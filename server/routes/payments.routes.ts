import { Payram } from "payram";
import { z } from "zod";
import type { Express } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import { getDb } from "../../src/server/db";
import type { SqlDriver } from "../../src/server/db/sql/driver";
import { grantSingleSearchCredit, grantMonthlySearchPack } from "../../src/server/arcana/searchQuota";

function db(): SqlDriver {
  return getDb().getDriver();
}

function getPayramClient(): Payram | null {
  const apiKey = process.env.PAYRAM_API_KEY?.trim();
  const baseUrl = process.env.PAYRAM_BASE_URL?.trim();
  if (!apiKey || !baseUrl) return null;
  const isHttp = baseUrl.startsWith("http://");
  return new Payram({
    apiKey,
    baseUrl,
    config: {
      timeoutMs: 15000,
      maxRetries: 2,
      allowInsecureHttp: isHttp,
    },
  });
}

export function payramConfigured(): boolean {
  return Boolean(process.env.PAYRAM_API_KEY?.trim() && process.env.PAYRAM_BASE_URL?.trim());
}

function payramProductCents(product: string): number {
  return product === "search_monthly"
    ? Number(process.env.ARCANA_MONTHLY_PRICE_CENTS ?? 900)
    : Number(process.env.ARCANA_SEARCH_PRICE_CENTS ?? 100);
}

async function ensurePaymentsTable() {
  await db().exec(
    `CREATE TABLE IF NOT EXISTS payram_invoices (
      reference_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      checkout_url TEXT,
      created_at TEXT NOT NULL,
      settled_at TEXT
    )`,
  );
}

export function registerPaymentRoutes(app: Express) {
  ensurePaymentsTable().catch((err) =>
    console.error("[payments] failed to create payram_invoices table:", err),
  );

  app.get("/api/payments/health", (_req, res) => {
    res.json({
      payramConfigured: payramConfigured(),
      currency: "USD",
      products: [
        { id: "search_single", label: "Single Search", priceCents: payramProductCents("search_single") },
        { id: "search_monthly", label: "Monthly Search Pack", priceCents: payramProductCents("search_monthly") },
      ],
    });
  });

  const CheckoutBody = z.object({
    product: z.enum(["search_single", "search_monthly"]),
    email: z.string().email().optional(),
  });

  app.post(
    "/api/payments/create-checkout",
    requireAuth,
    asyncHandler(async (req, res) => {
      const parsed = CheckoutBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
        return;
      }

      const payram = getPayramClient();
      if (!payram) {
        res.status(503).json({ error: "PayRAM not configured. Set PAYRAM_API_KEY and PAYRAM_BASE_URL." });
        return;
      }

      const { product, email } = parsed.data;
      const userId = req.session!.sub;
      const amountInUSD = payramProductCents(product) / 100;

      const checkout = await payram.payments.initiatePayment({
        customerEmail: email ?? `user-${userId}@magusme.local`,
        customerId: userId,
        amountInUSD,
      });

      await db().exec(
        `INSERT INTO payram_invoices (reference_id, user_id, product, amount_cents, status, checkout_url, created_at)
         VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
        [checkout.referenceId, userId, product, payramProductCents(product), checkout.checkoutUrl, new Date().toISOString()],
      );

      res.json({
        ok: true,
        checkoutUrl: checkout.checkoutUrl,
        referenceId: checkout.referenceId,
        amountInUSD,
      });
    }),
  );

  app.post(
    "/api/payments/webhook",
    (req, res, next) => {
      const payram = getPayramClient();
      if (!payram) {
        res.status(503).json({ error: "PayRAM not configured" });
        return;
      }

      const middleware = payram.webhooks.expressWebhook(async (payload) => {
        const referenceId = payload.reference_id;
        if (!referenceId) return;

        const row = await db().get<{
          reference_id: string;
          user_id: string;
          product: string;
          status: string;
        }>("SELECT reference_id, user_id, product, status FROM payram_invoices WHERE reference_id = ?", [referenceId]);

        if (!row || row.status === "settled") return;

        const now = new Date().toISOString();
        await db().exec(
          "UPDATE payram_invoices SET status = 'settled', settled_at = ? WHERE reference_id = ?",
          [now, referenceId],
        );

        if (row.product === "search_monthly") {
          await grantMonthlySearchPack(row.user_id);
        } else {
          await grantSingleSearchCredit(row.user_id);
        }
      });

      middleware(req, res, next);
    },
  );
}
