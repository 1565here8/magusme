import { Payram } from "payram";
import type { SqlDriver } from "../db/sql/driver";
import { getMarketplaceDb } from "./marketplaceDb";

function isoNow(): string {
  return new Date().toISOString();
}

// ── Payram client factory (shared with payments.routes.ts pattern) ──

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

// ── Payout Accounts (sellers register to receive funds) ──

export interface PayoutAccount {
  userId: string;
  email: string;
  blockchainCode: string;
  currencyCode: string;
  walletAddress: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getPayoutAccount(
  driver: SqlDriver,
  userId: string,
): Promise<PayoutAccount | null> {
  const row = await driver.get<{
    user_id: string;
    email: string;
    blockchain_code: string;
    currency_code: string;
    wallet_address: string;
    is_active: number;
    created_at: string;
    updated_at: string;
  }>(
    "SELECT * FROM marketplace_payout_accounts WHERE user_id = ?",
    [userId],
  );
  if (!row) return null;
  return {
    userId: row.user_id,
    email: row.email,
    blockchainCode: row.blockchain_code,
    currencyCode: row.currency_code,
    walletAddress: row.wallet_address,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertPayoutAccount(
  driver: SqlDriver,
  userId: string,
  data: {
    email: string;
    blockchainCode: string;
    currencyCode: string;
    walletAddress: string;
  },
): Promise<PayoutAccount> {
  const now = isoNow();
  const existing = await getPayoutAccount(driver, userId);
  if (existing) {
    await driver.exec(
      `UPDATE marketplace_payout_accounts
       SET email = ?, blockchain_code = ?, currency_code = ?, wallet_address = ?, updated_at = ?
       WHERE user_id = ?`,
      [data.email, data.blockchainCode, data.currencyCode, data.walletAddress, now, userId],
    );
  } else {
    await driver.exec(
      `INSERT INTO marketplace_payout_accounts
       (user_id, email, blockchain_code, currency_code, wallet_address, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [userId, data.email, data.blockchainCode, data.currencyCode, data.walletAddress, now, now],
    );
  }
  return (await getPayoutAccount(driver, userId))!;
}

const VALID_BLOCKCHAINS = ["ETH", "TRX", "BTC", "BASE"];
const VALID_CURRENCIES = ["USDC", "USDT"];

export function validatePayoutInput(data: {
  email: string;
  blockchainCode: string;
  currencyCode: string;
  walletAddress: string;
}): string | null {
  if (!data.email || !data.email.includes("@")) return "Valid email is required.";
  if (!VALID_BLOCKCHAINS.includes(data.blockchainCode)) {
    return `Blockchain must be one of: ${VALID_BLOCKCHAINS.join(", ")}`;
  }
  if (!VALID_CURRENCIES.includes(data.currencyCode)) {
    return `Currency must be one of: ${VALID_CURRENCIES.join(", ")}`;
  }
  if (!data.walletAddress || data.walletAddress.length < 10) {
    return "Valid wallet address is required.";
  }
  return null;
}

// ── Marketplace Payment Invoices ──

export interface MarketplaceInvoice {
  referenceId: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amountCents: number;
  platformFeeCents: number;
  sellerPayoutCents: number;
  status: "pending" | "paid" | "settled" | "refunded" | "expired";
  checkoutUrl: string | null;
  paidAt: string | null;
  settledAt: string | null;
  createdAt: string;
}

function calculateFees(amountCents: number): {
  platformFeeCents: number;
  sellerPayoutCents: number;
} {
  const platformFeeCents = Math.round(amountCents * 0.05); // 5% platform fee
  const sellerPayoutCents = amountCents - platformFeeCents;
  return { platformFeeCents, sellerPayoutCents };
}

export async function createMarketplaceInvoice(
  driver: SqlDriver,
  orderId: string,
  buyerId: string,
  sellerId: string,
  amountCents: number,
): Promise<MarketplaceInvoice> {
  const payram = getPayramClient();
  if (!payram) {
    throw new Error("PayRAM not configured. Set PAYRAM_API_KEY and PAYRAM_BASE_URL.");
  }

  const { platformFeeCents, sellerPayoutCents } = calculateFees(amountCents);

  // Initiate payment with Payram
  const checkout = await payram.initiatePayment({
    customerEmail: `user-${buyerId}@magusme.local`,
    customerId: buyerId,
    amountInUSD: amountCents / 100,
  });

  const now = isoNow();
  await driver.exec(
     `INSERT INTO marketplace_invoices
      (reference_id, order_id, buyer_id, seller_id, amount_cents, platform_fee_cents, seller_payout_cents, status, checkout_url, created_at, settled_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, NULL)`,
    [
      checkout.reference_id, orderId, buyerId, sellerId,
      amountCents, platformFeeCents, sellerPayoutCents,
      checkout.url, now,
    ],
  );

  return {
    referenceId: checkout.reference_id,
    orderId,
    buyerId,
    sellerId,
    amountCents,
    platformFeeCents,
    sellerPayoutCents,
    status: "pending",
    checkoutUrl: checkout.url,
    paidAt: null,
    settledAt: null,
    createdAt: now,
  };
}

export async function getMarketplaceInvoice(
  driver: SqlDriver,
  referenceId: string,
): Promise<MarketplaceInvoice | null> {
  const row = await driver.get<{
    reference_id: string;
    order_id: string;
    buyer_id: string;
    seller_id: string;
    amount_cents: number;
    platform_fee_cents: number;
    seller_payout_cents: number;
    status: string;
    checkout_url: string | null;
    paid_at: string | null;
    settled_at: string | null;
    created_at: string;
  }>(
    "SELECT * FROM marketplace_invoices WHERE reference_id = ?",
    [referenceId],
  );
  if (!row) return null;
  return {
    referenceId: row.reference_id,
    orderId: row.order_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    amountCents: row.amount_cents,
    platformFeeCents: row.platform_fee_cents,
    sellerPayoutCents: row.seller_payout_cents,
    status: row.status as MarketplaceInvoice["status"],
    checkoutUrl: row.checkout_url,
    paidAt: row.paid_at,
    settledAt: row.settled_at,
    createdAt: row.created_at,
  };
}

export async function getInvoiceByOrder(
  driver: SqlDriver,
  orderId: string,
): Promise<MarketplaceInvoice | null> {
  const row = await driver.get<{
    reference_id: string;
    order_id: string;
    buyer_id: string;
    seller_id: string;
    amount_cents: number;
    platform_fee_cents: number;
    seller_payout_cents: number;
    status: string;
    checkout_url: string | null;
    paid_at: string | null;
    settled_at: string | null;
    created_at: string;
  }>(
    "SELECT * FROM marketplace_invoices WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
    [orderId],
  );
  if (!row) return null;
  return {
    referenceId: row.reference_id,
    orderId: row.order_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    amountCents: row.amount_cents,
    platformFeeCents: row.platform_fee_cents,
    sellerPayoutCents: row.seller_payout_cents,
    status: row.status as MarketplaceInvoice["status"],
    checkoutUrl: row.checkout_url,
    paidAt: row.paid_at,
    settledAt: row.settled_at,
    createdAt: row.created_at,
  };
}

export async function settleMarketplaceInvoice(
  driver: SqlDriver,
  referenceId: string,
): Promise<void> {
  const now = isoNow();
  await driver.exec(
    `UPDATE marketplace_invoices SET status = 'paid', paid_at = ? WHERE reference_id = ? AND status = 'pending'`,
    [now, referenceId],
  );
}

export async function refundMarketplaceInvoice(
  driver: SqlDriver,
  referenceId: string,
): Promise<void> {
  await driver.exec(
    `UPDATE marketplace_invoices SET status = 'refunded' WHERE reference_id = ?`,
    [referenceId],
  );
}

// ── Webhook handler ──

export async function handleMarketplaceWebhook(
  driver: SqlDriver,
  referenceId: string,
  webhookStatus: string,
): Promise<void> {
  if (!referenceId) return;

  const invoice = await getMarketplaceInvoice(driver, referenceId);
  if (!invoice || invoice.status !== "pending") return;

  // Payram sends FILLED when payment succeeds
  if (webhookStatus === "FILLED" || webhookStatus === "PAID") {
    await settleMarketplaceInvoice(driver, referenceId);

    // Update the order to confirmed
    await driver.exec(
      `UPDATE service_orders SET status = 'confirmed', confirmed_at = ? WHERE id = ? AND status = 'pending'`,
      [isoNow(), invoice.orderId],
    );

    // Try to auto-payout the seller if they have a payout account
    const sellerPayout = await getPayoutAccount(driver, invoice.sellerId);
    if (sellerPayout && sellerPayout.isActive) {
      await triggerSellerPayout(driver, invoice);
    }
  } else if (webhookStatus === "CANCELLED" || webhookStatus === "EXPIRED") {
    await driver.exec(
      `UPDATE marketplace_invoices SET status = 'expired' WHERE reference_id = ?`,
      [referenceId],
    );
  }
}

async function triggerSellerPayout(
  driver: SqlDriver,
  invoice: MarketplaceInvoice,
): Promise<void> {
  try {
    const payram = getPayramClient();
    if (!payram) return;

    const account = await getPayoutAccount(driver, invoice.sellerId);
    if (!account || !account.isActive) return;

    await payram.createPayout({
      email: account.email,
      blockchainCode: account.blockchainCode as any,
      currencyCode: account.currencyCode as any,
      amount: (invoice.sellerPayoutCents / 100).toString(),
      toAddress: account.walletAddress,
      customerID: invoice.sellerId,
    });

    await driver.exec(
      `UPDATE marketplace_invoices SET status = 'settled', settled_at = ? WHERE reference_id = ?`,
      [isoNow(), invoice.referenceId],
    );
  } catch (err) {
    console.error("[marketplace payout] auto-payout failed:", err instanceof Error ? err.message : err);
    // Invoice stays as 'paid' — payout can be retried manually
  }
}

// ── Escrow Release Processing ────────────────────────────────

const ESCROW_PERIOD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/**
 * Find completed orders past their auto_release_at and process them:
 * triggers seller payout if the invoice is paid and a payout account exists.
 */
export async function processEscrowReleases(driver: SqlDriver): Promise<{ released: number; failed: number }> {
  const db = getMarketplaceDb();
  const pending = await db.findOrdersPendingRelease();
  let released = 0;
  let failed = 0;

  for (const order of pending) {
    try {
      // Get the paid invoice for this order
      const invoice = await getInvoiceByOrder(driver, order.id);
      if (!invoice || invoice.status !== "paid") {
        // No paid invoice — just update order status to confirmed
        await db.confirmOrderRelease(order.id as any);
        released++;
        continue;
      }

      // Try to payout the seller
      const account = await getPayoutAccount(driver, order.sellerId);
      if (account && account.isActive) {
        await triggerSellerPayout(driver, invoice);
      } else {
        // No payout account — mark invoice as settled anyway
        await driver.exec(
          `UPDATE marketplace_invoices SET status = 'settled', settled_at = ? WHERE reference_id = ?`,
          [isoNow(), invoice.referenceId],
        );
      }
      await db.confirmOrderRelease(order.id as any);
      released++;
    } catch (err) {
      console.error("[escrow] release failed for order", order.id, err instanceof Error ? err.message : err);
      failed++;
    }
  }

  return { released, failed };
}
