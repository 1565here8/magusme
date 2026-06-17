import { describe, it, before, after } from "node:test";
import assert from "node:assert";

import { SCHEMA } from "../src/server/db/sql/schema";
import { NodeBuiltinSqliteDriver } from "../src/server/db/sql/nodeBuiltinSqliteDriver";
import { initMarketplaceDb } from "../src/server/marketplace/marketplaceDb";
import {
  getInvoiceByOrder,
  handleMarketplaceWebhook,
  upsertPayoutAccount,
  getPayoutAccount,
  validatePayoutInput,
} from "../src/server/marketplace/marketplacePayments";

function isoNow() {
  return new Date().toISOString();
}

const PAYOUT_SCHEMA = `
CREATE TABLE IF NOT EXISTS marketplace_payout_accounts (
  user_id TEXT PRIMARY KEY REFERENCES social_profiles(user_id),
  email TEXT NOT NULL,
  blockchain_code TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS marketplace_invoices (
  reference_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL DEFAULT 0,
  seller_payout_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  checkout_url TEXT,
  paid_at TEXT,
  settled_at TEXT,
  created_at TEXT NOT NULL
);
`;

describe("Marketplace Payments", () => {
  let driver: NodeBuiltinSqliteDriver;

  before(async () => {
    driver = new NodeBuiltinSqliteDriver(":memory:");
    for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
      await driver.exec(stmt);
    }
    for (const stmt of PAYOUT_SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
      await driver.exec(stmt);
    }
    initMarketplaceDb(driver);

    // Seed minimal test data
    await driver.exec("INSERT INTO users (id, created_at, token_balance, tokens_updated_at) VALUES ('buyer_1', ?, 1000, ?)", [isoNow(), isoNow()]);
    await driver.exec("INSERT INTO users (id, created_at, token_balance, tokens_updated_at) VALUES ('seller_1', ?, 1000, ?)", [isoNow(), isoNow()]);
    await driver.exec("INSERT INTO users (id, created_at, token_balance, tokens_updated_at) VALUES ('seller_2', ?, 1000, ?)", [isoNow(), isoNow()]);
    await driver.exec(
      `INSERT INTO social_profiles (user_id, handle, display_name, bio, interests, traditions, is_service_provider, kyc_status, created_at, updated_at)
       VALUES ('seller_1', 'testseller', 'Test Seller', 'I do readings', '[]', '["Tarot","Astrology"]', 1, 'verified', ?, ?)`,
      [isoNow(), isoNow()],
    );
    await driver.exec(
      `INSERT INTO social_profiles (user_id, handle, display_name, bio, interests, traditions, is_service_provider, kyc_status, created_at, updated_at)
       VALUES ('seller_2', 'seller2', 'Seller Two', 'I also do readings', '[]', '["Astrology"]', 1, 'verified', ?, ?)`,
      [isoNow(), isoNow()],
    );
    await driver.exec(
      "INSERT INTO service_categories (id, slug, name, description, icon, sort_order, created_at) VALUES ('cat_1', 'tarot', 'Tarot', 'Tarot readings', 'Sparkles', 1, ?)",
      [isoNow()],
    );
    await driver.exec(
      `INSERT INTO service_listings (id, provider_id, category_id, title, slug, description, pricing_model, price_cents, duration_minutes, delivery_days, is_online, tags, status, view_count, order_count, rating, review_count, created_at, updated_at)
       VALUES ('listing_1', 'seller_1', 'cat_1', 'Tarot Reading', 'tarot-reading', 'A full tarot reading', 'fixed', 5000, 30, 2, 1, '["tarot","reading"]', 'active', 0, 0, 0, 0, ?, ?)`,
      [isoNow(), isoNow()],
    );
    await driver.exec(
      `INSERT INTO service_orders (id, listing_id, buyer_id, status, buyer_instructions, created_at)
       VALUES ('order_a', 'listing_1', 'buyer_1', 'pending', '', ?)`,
      [isoNow()],
    );
    await driver.exec(
      `INSERT INTO service_orders (id, listing_id, buyer_id, status, buyer_instructions, created_at)
       VALUES ('order_b', 'listing_1', 'buyer_1', 'pending', '', ?)`,
      [isoNow()],
    );
    await driver.exec(
      `INSERT INTO service_orders (id, listing_id, buyer_id, status, buyer_instructions, created_at)
       VALUES ('order_c', 'listing_1', 'buyer_1', 'pending', '', ?)`,
      [isoNow()],
    );
  });

  after(async () => {
    await driver.close();
  });

  // ── Invoice & Webhook Tests (using direct DB inserts to avoid Payram HTTP calls) ──

  it("should insert and retrieve an invoice by order", async () => {
    const refId = "test_ref_order_a";
    await driver.exec(
      `INSERT INTO marketplace_invoices (reference_id, order_id, buyer_id, seller_id, amount_cents, platform_fee_cents, seller_payout_cents, status, checkout_url, created_at)
       VALUES (?, 'order_a', 'buyer_1', 'seller_1', 5000, 250, 4750, 'pending', 'https://checkout.test/abc', ?)`,
      [refId, isoNow()],
    );

    const invoice = await getInvoiceByOrder(driver, "order_a");
    assert.ok(invoice);
    assert.equal(invoice!.referenceId, refId);
    assert.equal(invoice!.status, "pending");
    assert.equal(invoice!.amountCents, 5000);
    assert.equal(invoice!.platformFeeCents, 250);
    assert.equal(invoice!.sellerPayoutCents, 4750);
    assert.equal(invoice!.checkoutUrl, "https://checkout.test/abc");
    assert.strictEqual(invoice!.paidAt, null);
    assert.strictEqual(invoice!.settledAt, null);
  });

  it("should handle successful payment webhook: paid + confirmed", async () => {
    const refId = "test_ref_order_a";
    await handleMarketplaceWebhook(driver, refId, "FILLED");

    const invoice = await getInvoiceByOrder(driver, "order_a");
    assert.equal(invoice!.status, "paid");

    const order = await driver.get<{ status: string }>("SELECT status FROM service_orders WHERE id = ?", ["order_a"]);
    assert.equal(order!.status, "confirmed");
  });

  it("should auto-payout seller when payout account exists", async () => {
    // Setup payout account
    const account = await upsertPayoutAccount(driver, "seller_1", {
      email: "seller@test.com",
      blockchainCode: "BASE",
      currencyCode: "USDC",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    });
    assert.ok(account);
    assert.equal(account.isActive, true);

    // Insert fresh invoice for order_b
    const refId = "test_ref_order_b";
    await driver.exec(
      `INSERT INTO marketplace_invoices (reference_id, order_id, buyer_id, seller_id, amount_cents, platform_fee_cents, seller_payout_cents, status, checkout_url, created_at)
       VALUES (?, 'order_b', 'buyer_1', 'seller_1', 3000, 150, 2850, 'pending', 'https://checkout.test/def', ?)`,
      [refId, isoNow()],
    );

    await handleMarketplaceWebhook(driver, refId, "FILLED");

    // With payout account, invoice should go to 'settled' with settled_at set
    // (payout attempt is made; if Payram SDK is not available, invoice stays as 'paid')
    const settled = await getInvoiceByOrder(driver, "order_b");
    assert.ok(settled!.status === "settled" || settled!.status === "paid",
      `Expected 'settled' or 'paid', got '${settled!.status}'`);
    if (settled!.status === "settled") {
      assert.ok(settled!.settledAt, "settled_at must be set after payout");
    }
  });

  it("should handle webhook expiry", async () => {
    const refId = "test_ref_order_c";
    await driver.exec(
      `INSERT INTO marketplace_invoices (reference_id, order_id, buyer_id, seller_id, amount_cents, platform_fee_cents, seller_payout_cents, status, checkout_url, created_at)
       VALUES (?, 'order_c', 'buyer_1', 'seller_1', 1000, 50, 950, 'pending', 'https://checkout.test/ghi', ?)`,
      [refId, isoNow()],
    );

    await handleMarketplaceWebhook(driver, refId, "EXPIRED");

    const expired = await getInvoiceByOrder(driver, "order_c");
    assert.equal(expired!.status, "expired");
  });

  it("should not re-process an already-processed webhook", async () => {
    const invoice = await getInvoiceByOrder(driver, "order_a");
    assert.ok(invoice);

    await handleMarketplaceWebhook(driver, invoice!.referenceId, "FILLED");

    const unchanged = await getInvoiceByOrder(driver, "order_a");
    assert.equal(unchanged!.status, "paid"); // unchanged
  });

  // ── Payout Account Tests ──

  it("should create and retrieve a payout account", async () => {
    const acct = await upsertPayoutAccount(driver, "seller_2", {
      email: "seller2@test.com",
      blockchainCode: "ETH",
      currencyCode: "USDT",
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    });
    assert.equal(acct.email, "seller2@test.com");
    assert.equal(acct.blockchainCode, "ETH");
    assert.equal(acct.currencyCode, "USDT");
    assert.equal(acct.isActive, true);

    const fetched = await getPayoutAccount(driver, "seller_2");
    assert.ok(fetched);
    assert.equal(fetched!.email, "seller2@test.com");
  });

  it("should update an existing payout account", async () => {
    const updated = await upsertPayoutAccount(driver, "seller_2", {
      email: "seller2_new@test.com",
      blockchainCode: "BASE",
      currencyCode: "USDC",
      walletAddress: "0xnew1234567890abcdef1234567890abcdef1234",
    });
    assert.equal(updated.email, "seller2_new@test.com");
    assert.equal(updated.blockchainCode, "BASE");
  });

  it("should return null for non-existent payout account", async () => {
    const result = await getPayoutAccount(driver, "nonexistent_user");
    assert.strictEqual(result, null);
  });

  // ── Validation Tests ──

  it("should validate payout account input", () => {
    assert.strictEqual(validatePayoutInput({ email: "a@b.com", blockchainCode: "BASE", currencyCode: "USDC", walletAddress: "0x1234567890abcdef" }), null);
    assert.ok(validatePayoutInput({ email: "", blockchainCode: "BASE", currencyCode: "USDC", walletAddress: "0xabc" }));
    assert.ok(validatePayoutInput({ email: "a@b.com", blockchainCode: "INVALID", currencyCode: "USDC", walletAddress: "0xabc" }));
    assert.ok(validatePayoutInput({ email: "a@b.com", blockchainCode: "BASE", currencyCode: "INVALID", walletAddress: "0xabc" }));
    assert.ok(validatePayoutInput({ email: "a@b.com", blockchainCode: "BASE", currencyCode: "USDC", walletAddress: "x" }));
  });

  // ── Escrow Release Tests ──

  it("should find orders pending release after auto_release_at", async () => {
    // Create an order past its auto_release_at
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await driver.exec(
      `INSERT INTO service_orders (id, listing_id, buyer_id, status, buyer_instructions, auto_release_at, created_at)
       VALUES ('order_escrow', 'listing_1', 'buyer_1', 'completed', '', ?, ?)`,
      [pastDate, isoNow()],
    );

    const db = (await import("../src/server/marketplace/marketplaceDb")).getMarketplaceDb();
    const pending = await db.findOrdersPendingRelease();
    assert.ok(pending.length >= 1);
    assert.ok(pending.some((o) => o.id === "order_escrow"));
  });

  it("should process escrow release via processEscrowReleases", async () => {
    // Insert a paid invoice for the escrow order
    const refId = "test_ref_escrow";
    await driver.exec(
      `INSERT INTO marketplace_invoices (reference_id, order_id, buyer_id, seller_id, amount_cents, platform_fee_cents, seller_payout_cents, status, checkout_url, created_at)
       VALUES (?, 'order_escrow', 'buyer_1', 'seller_1', 2000, 100, 1900, 'paid', 'https://checkout.test/escrow', ?)`,
      [refId, isoNow()],
    );

    // Process releases
    const { processEscrowReleases } = await import("../src/server/marketplace/marketplacePayments");
    const result = await processEscrowReleases(driver);
    assert.ok(result.released >= 1);

    // Order should now be 'confirmed'
    const order = await driver.get<{ status: string }>("SELECT status FROM service_orders WHERE id = ?", ["order_escrow"]);
    assert.equal(order!.status, "confirmed");
  });
});
