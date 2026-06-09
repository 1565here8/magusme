import { getDb } from "../db";
import { initSocialDb, getSocialDb } from "./socialDb";

const SYSTEM_OWNER = "platform-admin";

export async function initSocialModule() {
  if (process.env.SOCIAL_ENABLED?.trim().toLowerCase() === "false") return;
  try {
    const store = getDb();
    initSocialDb(store.getDriver());
    await getSocialDb().seedDefaultGroups(SYSTEM_OWNER);
    // eslint-disable-next-line no-console
    console.log("[circle] social module enabled — friends, groups, DMs, LLM moderation");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[circle] init failed (app continues):", err instanceof Error ? err.message : err);
  }
}

export { getSocialDb };
