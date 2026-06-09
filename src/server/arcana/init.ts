import { getDb } from "../db";
import { initArcanaDb } from "./arcanaDb";
import { seedArcanaCorpus, startArcanaIndexer } from "./indexer";
import { migrateArcanaColumns } from "./migrate";
import { initArcanaBtcpayInvoicesDb } from "./billing/btcpayCheckout";
import {
  arcanaCloudLlmEnabled,
  arcanaCloudModel,
  resolveArcanaCloudProvider,
} from "./llm/cloudLane";

export async function initArcanaModule() {
  if (process.env.ARCANA_ENABLED?.trim().toLowerCase() !== "true") {
    return;
  }
  if (arcanaCloudLlmEnabled() && !resolveArcanaCloudProvider()) {
    // eslint-disable-next-line no-console
    console.warn("[arcana] ARCANA_CLOUD_LLM=true but set GEMINI_API_KEY, XAI_API_KEY (Grok), and/or GROQ_API_KEY");
  }
  try {
    const store = getDb();
    const driver = store.getDriver();
    await migrateArcanaColumns(driver);
    initArcanaDb(driver);
    initArcanaBtcpayInvoicesDb(driver);
    await seedArcanaCorpus();
    startArcanaIndexer();
    const cloud = resolveArcanaCloudProvider();
    // eslint-disable-next-line no-console
    console.log(
      "[arcana] module enabled",
      cloud ? `cloud=${cloud} model=${arcanaCloudModel(cloud)}` : "ollama/local only",
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[arcana] init failed (app continues):", err instanceof Error ? err.message : err);
  }
}
