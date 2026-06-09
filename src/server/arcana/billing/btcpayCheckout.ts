import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import type { SqlDriver } from "../../db/sql/driver";
import {
  arcanaMonthlyPriceCents,
  arcanaSearchPriceCents,
  grantMonthlySearchPack,
  grantSingleSearchCredit,
} from "../searchQuota";

export type ArcanaSearchProduct = "search_single" | "search_monthly";

let driver: SqlDriver | null = null;

export function initArcanaBtcpayInvoicesDb(db: SqlDriver): void {
  driver = db;
}

function requireDriver(): SqlDriver {
  if (!driver) throw new Error("Arcana BTCPay invoices DB not initialized");
  return driver;
}

export function arcanaBtcpayConfigured(): boolean {
  const apiKey =
    process.env.BTCPAY_API_KEY_ALLMAGUS?.trim() || process.env.BTCPAY_API_KEY?.trim();
  const storeId =
    process.env.BTCPAY_STORE_ID_ALLMAGUS?.trim() || process.env.BTCPAY_STORE_ID?.trim();
  return Boolean(process.env.BTCPAY_URL?.trim() && apiKey && storeId);
}

function btcpayApiKey(): string {
  return (
    process.env.BTCPAY_API_KEY_ALLMAGUS?.trim() ||
    process.env.BTCPAY_API_KEY!.trim()
  );
}

function btcpayStoreId(): string {
  return (
    process.env.BTCPAY_STORE_ID_ALLMAGUS?.trim() ||
    process.env.BTCPAY_STORE_ID!.trim()
  );
}

function btcpayBaseUrl(): string {
  return process.env.BTCPAY_URL!.trim().replace(/\/$/, "");
}

function allmagusPublicUrl(): string {
  return (
    process.env.ALLMAGUS_PUBLIC_URL?.trim() ||
    process.env.CORS_ORIGIN?.split(",")[0]?.trim() ||
    "https://allmagusai.com"
  ).replace(/\/$/, "");
}

function btcpayRedirectUrl(): string {
  const explicit = process.env.BTCPAY_REDIRECT_URL_ALLMAGUS?.trim();
  if (explicit) return explicit;
  return `${allmagusPublicUrl()}/?searchPaid=1`;
}

function btcpayNotificationUrl(): string | undefined {
  const explicit = process.env.BTCPAY_NOTIFICATION_URL_ALLMAGUS?.trim();
  if (explicit) return explicit;
  const base = allmagusPublicUrl();
  return base ? `${base}/api/arcana/billing/btcpay/webhook` : undefined;
}

export function amountUsdForSearchProduct(product: ArcanaSearchProduct): number {
  const cents =
    product === "search_monthly" ? arcanaMonthlyPriceCents() : arcanaSearchPriceCents();
  return cents / 100;
}

export async function createArcanaSearchBtcpayCheckout(opts: {
  userId: string;
  product: ArcanaSearchProduct;
  email?: string;
}): Promise<{ checkoutUrl: string; invoiceId: string; amountUsd: number }> {
  if (!arcanaBtcpayConfigured()) throw new Error("AllMagus BTCPay not configured");

  const amountUsd = amountUsdForSearchProduct(opts.product);
  const url = `${btcpayBaseUrl()}/api/v1/stores/${encodeURIComponent(btcpayStoreId())}/invoices`;
  const orderId = randomUUID();
  const email = opts.email?.trim();
  const notificationURL = btcpayNotificationUrl();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${btcpayApiKey()}`,
    },
    body: JSON.stringify({
      amount: amountUsd,
      currency: "USD",
      metadata: {
        orderId,
        userId: opts.userId,
        product: opts.product,
        plan: opts.product,
      },
      checkout: {
        redirectURL: btcpayRedirectUrl(),
        ...(notificationURL ? { notificationURL } : {}),
        defaultPaymentMethod: "BTC-LightningNetwork",
      },
      receipt: { enabled: true, showQR: true },
      ...(email ? { buyer: { email } } : {}),
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
  const checkoutUrl = String(json.checkoutLink ?? "");
  if (!invoiceId || !checkoutUrl) throw new Error("BTCPay returned incomplete invoice");

  const db = requireDriver();
  await db.exec(
    `INSERT INTO arcana_btcpay_invoices (invoice_id, user_id, product, amount_usd, status, checkout_url, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)
     ON CONFLICT(invoice_id) DO UPDATE SET checkout_url = excluded.checkout_url`,
    [invoiceId, opts.userId, opts.product, amountUsd, checkoutUrl, new Date().toISOString()],
  );

  return { checkoutUrl, invoiceId, amountUsd };
}

export function verifyArcanaBtcpayWebhook(rawBody: string, signature: string | undefined): void {
  const secret =
    process.env.BTCPAY_WEBHOOK_SECRET_ALLMAGUS?.trim() ||
    process.env.BTCPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return;
  if (!signature) throw new Error("Missing BTCPay webhook signature");
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("BTCPay webhook signature invalid");
  }
}

export function parseArcanaBtcpayWebhook(rawBody: string): {
  invoiceId: string | null;
  settled: boolean;
  type: string;
  metadata?: { userId?: string; product?: string; plan?: string };
} {
  const payload = JSON.parse(rawBody) as {
    type?: string;
    invoiceId?: string;
    data?: {
      id?: string;
      invoiceId?: string;
      metadata?: { userId?: string; product?: string; plan?: string };
    };
  };
  const type = payload.type ?? "";
  const settled =
    type === "InvoiceSettled" ||
    type === "InvoicePaymentSettled" ||
    type === "InvoiceProcessing";
  if (!settled) {
    return { invoiceId: null, settled: false, type };
  }
  const invoiceId =
    payload.invoiceId ?? payload.data?.invoiceId ?? payload.data?.id ?? null;
  return {
    invoiceId,
    settled: true,
    type,
    metadata: payload.data?.metadata,
  };
}

export async function handleArcanaBtcpayWebhookEvent(
  rawBody: string,
  signature: string | undefined,
): Promise<void> {
  verifyArcanaBtcpayWebhook(rawBody, signature);
  const { invoiceId, settled, metadata } = parseArcanaBtcpayWebhook(rawBody);
  if (!settled || !invoiceId) return;

  const db = requireDriver();
  const row = await db.get<{
    invoice_id: string;
    user_id: string;
    product: string;
    status: string;
  }>("SELECT invoice_id, user_id, product, status FROM arcana_btcpay_invoices WHERE invoice_id = ?", [
    invoiceId,
  ]);

  if (!row || row.status === "settled") return;

  const userId = row.user_id || String(metadata?.userId ?? "");
  const product = (row.product || metadata?.product || metadata?.plan || "search_single") as ArcanaSearchProduct;
  if (!userId) return;

  const now = new Date().toISOString();
  await db.exec(
    `UPDATE arcana_btcpay_invoices SET status = 'settled', settled_at = ? WHERE invoice_id = ?`,
    [now, invoiceId],
  );

  if (product === "search_monthly") {
    await grantMonthlySearchPack(userId);
  } else {
    await grantSingleSearchCredit(userId);
  }
}
