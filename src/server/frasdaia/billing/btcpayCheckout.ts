import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import type { SqlDriver } from "../../db/sql/driver";
import type { FrasdaiaPlan } from "./plans";
import { frasdaiaPlanPriceUsd } from "./plans";
import { grantFrasdaiaTier } from "./tierGrant";

let driver: SqlDriver | null = null;

export function initFrasdaiaBtcpayInvoicesDb(db: SqlDriver): void {
  driver = db;
}

function requireDriver(): SqlDriver {
  if (!driver) throw new Error("Frasdaia BTCPay invoices DB not initialized");
  return driver;
}

export function frasdaiaBtcpayConfigured(): boolean {
  return Boolean(
    process.env.BTCPAY_URL?.trim() &&
      process.env.BTCPAY_API_KEY_FRASDAIA?.trim() &&
      process.env.BTCPAY_STORE_ID_FRASDAIA?.trim(),
  );
}

function btcpayBaseUrl(): string {
  return process.env.BTCPAY_URL!.trim().replace(/\/$/, "");
}

function btcpayStoreId(): string {
  return process.env.BTCPAY_STORE_ID_FRASDAIA!.trim();
}

function frasdaiaPublicUrl(): string {
  return (
    process.env.FRASDAIA_PUBLIC_URL?.trim() ||
    "https://frasdaia.com"
  ).replace(/\/$/, "");
}

function btcpayRedirectUrl(): string {
  const explicit = process.env.BTCPAY_REDIRECT_URL_FRASDAIA?.trim();
  if (explicit) return explicit;
  return `${frasdaiaPublicUrl()}/billing/success`;
}

function btcpayNotificationUrl(): string | undefined {
  const explicit = process.env.BTCPAY_NOTIFICATION_URL_FRASDAIA?.trim();
  if (explicit) return explicit;
  const base = frasdaiaPublicUrl();
  return base ? `${base}/api/frasdaia/billing/btcpay/webhook` : undefined;
}

export async function createFrasdaiaBtcpayInvoice(
  plan: FrasdaiaPlan,
  userId: string,
  email?: string,
): Promise<{ invoiceId: string; checkoutLink: string; amountUsd: number }> {
  if (!frasdaiaBtcpayConfigured()) throw new Error("Frasdaia BTCPay not configured");

  const amountUsd = frasdaiaPlanPriceUsd(plan);
  const url = `${btcpayBaseUrl()}/api/v1/stores/${encodeURIComponent(btcpayStoreId())}/invoices`;
  const orderId = randomUUID();
  const trimmedEmail = email?.trim();
  const notificationURL = btcpayNotificationUrl();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${process.env.BTCPAY_API_KEY_FRASDAIA!.trim()}`,
    },
    body: JSON.stringify({
      amount: amountUsd,
      currency: "USD",
      metadata: {
        orderId,
        userId,
        plan,
        product: "frasdaia",
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
      },
      checkout: {
        redirectURL: btcpayRedirectUrl(),
        ...(notificationURL ? { notificationURL } : {}),
        defaultPaymentMethod: "BTC-LightningNetwork",
      },
      receipt: { enabled: true, showQR: true },
      ...(trimmedEmail ? { buyer: { email: trimmedEmail } } : {}),
    }),
  });

  const json = (await res.json()) as {
    id?: string;
    checkoutLink?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(json.message ?? `BTCPay error ${res.status}`);
  }

  const invoiceId = String(json.id ?? "");
  const checkoutLink = String(json.checkoutLink ?? "");
  if (!invoiceId || !checkoutLink) throw new Error("BTCPay returned incomplete invoice");

  const db = requireDriver();
  await db.exec(
    `INSERT INTO frasdaia_btcpay_invoices (invoice_id, user_id, plan, amount_usd, status, checkout_url, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)
     ON CONFLICT(invoice_id) DO UPDATE SET checkout_url = excluded.checkout_url`,
    [invoiceId, userId, plan, amountUsd, checkoutLink, new Date().toISOString()],
  );

  return { invoiceId, checkoutLink, amountUsd };
}

export function verifyFrasdaiaBtcpayWebhook(
  rawBody: string,
  signature: string | undefined,
): void {
  const secret = process.env.BTCPAY_WEBHOOK_SECRET_FRASDAIA?.trim();
  if (!secret) return;
  if (!signature) throw new Error("Missing BTCPay webhook signature");
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("BTCPay webhook signature invalid");
  }
}

export type ParsedFrasdaiaBtcpayWebhook = {
  invoiceId: string | null;
  type: string;
  settled: boolean;
  terminalFailure: boolean;
  metadata?: { userId?: string; plan?: string; product?: string };
};

export function parseFrasdaiaBtcpayWebhook(rawBody: string): ParsedFrasdaiaBtcpayWebhook {
  const payload = JSON.parse(rawBody) as {
    type?: string;
    invoiceId?: string;
    data?: {
      id?: string;
      invoiceId?: string;
      metadata?: { userId?: string; plan?: string; product?: string };
    };
  };
  const type = payload.type ?? "";
  const settled =
    type === "InvoiceSettled" ||
    type === "InvoicePaymentSettled" ||
    type === "InvoiceProcessing";
  const terminalFailure = type === "InvoiceExpired" || type === "InvoiceInvalid";
  const invoiceId =
    payload.invoiceId ?? payload.data?.invoiceId ?? payload.data?.id ?? null;
  return {
    invoiceId,
    type,
    settled,
    terminalFailure,
    metadata: payload.data?.metadata,
  };
}

export async function handleFrasdaiaBtcpayWebhookEvent(
  rawBody: string,
  signature: string | undefined,
): Promise<void> {
  verifyFrasdaiaBtcpayWebhook(rawBody, signature);
  const parsed = parseFrasdaiaBtcpayWebhook(rawBody);
  const { invoiceId, settled, terminalFailure, metadata } = parsed;

  if (!invoiceId) return;

  const db = requireDriver();

  if (terminalFailure) {
    const now = new Date().toISOString();
    await db.exec(
      `UPDATE frasdaia_btcpay_invoices SET status = ?, settled_at = ?
       WHERE invoice_id = ? AND status != 'settled'`,
      [parsed.type === "InvoiceExpired" ? "expired" : "invalid", now, invoiceId],
    );
    return;
  }

  if (!settled) return;

  const row = await db.get<{
    invoice_id: string;
    user_id: string;
    plan: string;
    status: string;
  }>(
    "SELECT invoice_id, user_id, plan, status FROM frasdaia_btcpay_invoices WHERE invoice_id = ?",
    [invoiceId],
  );

  if (!row || row.status === "settled") return;

  const userId = row.user_id || String(metadata?.userId ?? "");
  const plan = (row.plan || metadata?.plan || "frasdaia_basic") as FrasdaiaPlan;
  if (!userId) return;

  const now = new Date().toISOString();
  await db.exec(
    `UPDATE frasdaia_btcpay_invoices SET status = 'settled', settled_at = ? WHERE invoice_id = ?`,
    [now, invoiceId],
  );

  await grantFrasdaiaTier(userId, plan, invoiceId);
}
