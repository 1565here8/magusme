import { getDb } from "../db";
import { initMarketplaceDb, getMarketplaceDb } from "./marketplaceDb";
import { processEscrowReleases } from "./marketplacePayments";

function isoNow(): string {
  return new Date().toISOString();
}

let initialized = false;
let escrowInterval: ReturnType<typeof setInterval> | null = null;

export async function initMarketplaceModule() {
  if (initialized) return;
  try {
    const store = getDb();
    const driver = store.getDriver();
    initMarketplaceDb(driver);
    // Migration: add settled_at column if missing (existing databases)
    try {
      await driver.exec("ALTER TABLE marketplace_invoices ADD COLUMN settled_at TEXT");
    } catch { /* column already exists */ }
    // Migration: add auto_release_at column if missing
    try {
      await driver.exec("ALTER TABLE service_orders ADD COLUMN auto_release_at TEXT");
    } catch { /* column already exists */ }
    // Migration: create notifications table
    try {
      await driver.exec(`CREATE TABLE IF NOT EXISTS marketplace_notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL DEFAULT '',
        link TEXT,
        is_read INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`);
      await driver.exec("CREATE INDEX IF NOT EXISTS idx_mkt_notif_user ON marketplace_notifications(user_id, is_read)");
    } catch { /* table exists */ }
    await getMarketplaceDb().seedCategories();
    initialized = true;
    // eslint-disable-next-line no-console
    console.log("[marketplace] module initialized — categories seeded");

    // Start escrow release checker (every 10 minutes)
    escrowInterval = setInterval(async () => {
      try {
        const result = await processEscrowReleases(driver);
        if (result.released > 0 || result.failed > 0) {
          console.log(`[escrow] processed: ${result.released} released, ${result.failed} failed`);
        }
      } catch { /* background task error */ }
    }, 10 * 60 * 1000);

    // Publish scheduled listings (every 5 minutes)
    setInterval(async () => {
      try {
        const now = isoNow();
        await driver.exec(
          `UPDATE service_listings SET status = 'active' WHERE status = 'draft' AND scheduled_at IS NOT NULL AND scheduled_at <= ?`,
          [now],
        );
      } catch { /* background task error */ }
    }, 5 * 60 * 1000);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[marketplace] init failed (app continues):", err instanceof Error ? err.message : err);
  }
}

export function shutdownMarketplaceModule() {
  if (escrowInterval) {
    clearInterval(escrowInterval);
    escrowInterval = null;
  }
}

export { getMarketplaceDb };
