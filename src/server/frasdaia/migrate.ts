import type { SqlDriver } from "../db/sql/driver";

const FRASDAIA_SCHEMA = `
CREATE TABLE IF NOT EXISTS frasdaia_subscriptions (
  user_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  payment_method TEXT,
  paid_until TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_frasdaia_sub_status ON frasdaia_subscriptions(status);

CREATE TABLE IF NOT EXISTS frasdaia_btcpay_invoices (
  invoice_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  checkout_url TEXT,
  created_at TEXT NOT NULL,
  settled_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_frasdaia_btcpay_user ON frasdaia_btcpay_invoices(user_id, status);
`;

export async function migrateFrasdaiaTables(driver: SqlDriver): Promise<void> {
  await driver.exec(FRASDAIA_SCHEMA);
}
