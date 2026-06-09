import type { SqlDriver } from "../db/sql/driver";

const ARCANA_EXTRA_COLUMNS = [
  "backlash_text TEXT NOT NULL DEFAULT ''",
  "alternatives_text TEXT NOT NULL DEFAULT ''",
  "planetary_timing TEXT NOT NULL DEFAULT ''",
  "is_kabbalistic INTEGER NOT NULL DEFAULT 0",
] as const;

/** Add columns / tables to existing SQLite/Postgres DBs. */
export async function migrateArcanaColumns(driver: SqlDriver) {
  if (driver.dialect === "postgres") {
    for (const col of ARCANA_EXTRA_COLUMNS) {
      const name = col.split(" ")[0];
      await driver.exec(`ALTER TABLE arcana_entries ADD COLUMN IF NOT EXISTS ${name} ${col.slice(name.length + 1)}`);
    }
    await driver.exec(`CREATE TABLE IF NOT EXISTS arcana_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`);
    await driver.exec(`CREATE TABLE IF NOT EXISTS arcana_btcpay_invoices (
      invoice_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      amount_usd REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      checkout_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      settled_at TEXT
    )`);
    await driver.exec(
      `CREATE INDEX IF NOT EXISTS idx_arcana_btcpay_user ON arcana_btcpay_invoices(user_id, status)`,
    );
    return;
  }
  for (const col of ARCANA_EXTRA_COLUMNS) {
    const name = col.split(" ")[0];
    try {
      await driver.exec(`ALTER TABLE arcana_entries ADD COLUMN ${name} TEXT NOT NULL DEFAULT ''`);
    } catch {
      // column already exists
    }
  }
  try {
    await driver.exec(`CREATE TABLE IF NOT EXISTS arcana_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`);
    await driver.exec(`CREATE TABLE IF NOT EXISTS arcana_btcpay_invoices (
      invoice_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      amount_usd REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      checkout_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      settled_at TEXT
    )`);
    await driver.exec(
      `CREATE INDEX IF NOT EXISTS idx_arcana_btcpay_user ON arcana_btcpay_invoices(user_id, status)`,
    );
  } catch {
    // table already exists
  }
}
