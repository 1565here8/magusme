import { getDb } from "../db";
import { initFrasdaiaBtcpayInvoicesDb } from "./billing/btcpayCheckout";
import { initFrasdaiaSubscriptionsDb } from "./billing/subscriptionsDb";
import { migrateFrasdaiaTables } from "./migrate";

export function frasdaiaEnabled(): boolean {
  const raw = process.env.FRASDAIA_ENABLED?.trim().toLowerCase();
  return raw !== "false";
}

export async function initFrasdaiaModule(): Promise<void> {
  if (!frasdaiaEnabled()) return;

  try {
    const driver = getDb().getDriver();
    await migrateFrasdaiaTables(driver);
    initFrasdaiaSubscriptionsDb(driver);
    initFrasdaiaBtcpayInvoicesDb(driver);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      "[frasdaia] billing init failed (app continues):",
      e instanceof Error ? e.message : e,
    );
  }
}
