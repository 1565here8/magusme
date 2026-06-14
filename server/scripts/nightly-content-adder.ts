/**
 * Nightly Verified Content Adder — runs every night to add verified occult content
 * Uses Ollama to scrape, verify, and beautifully structure new entries from TRUSTED sources only
 */

import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { runArcanaIndexer, INDEX_SOURCES, KABBALAH_INDEX_SOURCES } from "../../src/server/arcana/indexer";
import { getArcanaDb } from "../../src/server/arcana/arcanaDb";
import { enrichEntriesWithAI } from "../../src/server/arcana/scannerBot";
import { getOllamaClient } from "../../src/server/arcana/llm/ollamaClient";

const SCAN_INTERVAL_MS = 24 * 60 * 60 * 1000;

// Trusted institutions that provide verified content
const TRUSTED_INSTITUTIONS = new Set([
  "Yale University",
  "Yale / papyri.info",
  "Internet Archive",
  "Bibliothèque nationale de France",
  "Internet Sacred Text Archive",
  "Project Gutenberg via Internet Archive",
  "British Library via Internet Archive",
  "Wellcome Trust via Internet Archive",
  "HathiTrust via Internet Archive",
  "Yale Papyrological Institute / PGM",
  "Internet Archive / sacred-texts",
  "Internet Archive / ctext.org mirrors",
  "British Library via Internet Archive",
  "Wellcome Collection Magic",
  "Gallica BnF",
  "Sacred Texts — Esoteric Archive",
  "ctext.org mirrors",
]);

function isTrustedInstitution(institution: string): boolean {
  return TRUSTED_INSTITUTIONS.has(institution);
}

async function runNightlyAdd() {
  console.log(`[nightly] Starting nightly VERIFIED content addition at ${new Date().toISOString()}`);
  
  try {
    const ollama = getOllamaClient();
    const db = getArcanaDb();
    
    // Step 1: Run the indexer to fetch new content from VERIFIED sources only
    console.log("[nightly] Running Arcana indexer from VERIFIED sources only...");
    const result = await runArcanaIndexer();
    console.log(`[nightly] Indexer complete: ${result.entriesAdded} new entries, ${result.sourcesTouched} sources touched, ${result.docsScanned} docs scanned`);

    // Step 2: Get newly added entries that need enrichment
    const newEntries = await db.listEntriesSinceLastScan();
    console.log(`[nightly] Found ${newEntries.length} new entries to verify and enrich`);

    // Step 3: Filter to only entries from trusted institutions
    const verifiedEntries = newEntries.filter(entry => {
      if (!entry.source?.institution) {
        console.log(`[nightly] REJECTED: No institution for "${entry.title}"`);
        return false;
      }
      if (!isTrustedInstitution(entry.source.institution)) {
        console.log(`[nightly] REJECTED: Untrusted institution "${entry.source.institution}" for "${entry.title}"`);
        return false;
      }
      console.log(`[nightly] ACCEPTED: "${entry.title}" from ${entry.source.institution}`);
      return true;
    });
    
    console.log(`[nightly] ${verifiedEntries.length} of ${newEntries.length} entries passed verification`);

    // Step 4: Enrich verified entries with Ollama AI
    if (verifiedEntries.length > 0) {
      console.log("[nightly] Enriching verified entries with Ollama AI...");
      const enrichedCount = await enrichEntriesWithAI(verifiedEntries, ollama);
      console.log(`[nightly] Enriched ${enrichedCount} verified entries with AI analysis`);
    }

    // Step 5: Log stats
    const totalEntries = await db.countEntries();
    console.log(`[nightly] Total corpus: ${totalEntries} entries (all from verified sources)`);
    console.log(`[nightly] Nightly verified addition complete at ${new Date().toISOString()}`);

  } catch (err) {
    console.error("[nightly] Error:", err);
  }
}

async function main() {
  console.log("[nightly] Initializing database and Arcana module for VERIFIED content only...");
  await initDatabase();
  
  // Initialize Arcana DB in this process
  const { getDb } = await import("../../src/server/db");
  const { initArcanaDb } = await import("../../src/server/arcana/arcanaDb");
  const driver = getDb().getDriver();
  initArcanaDb(driver);
  
  // Also initialize indexer
  const { startArcanaIndexer } = await import("../../src/server/arcana/indexer");
  startArcanaIndexer();
  
  console.log("[arcana] module enabled ollama/local only (nightly)");
  
  // Run immediately on start
  await runNightlyAdd();
  
  // Schedule nightly runs (3 AM daily)
  const now = new Date();
  const nextRun = new Date(now);
  nextRun.setHours(3, 0, 0, 0);
  if (nextRun <= now) nextRun.setDate(nextRun.getDate() + 1);
  
  const msUntilNextRun = nextRun.getTime() - now.getTime();
  console.log(`[nightly] Next scheduled run at ${nextRun.toISOString()} (${Math.round(msUntilNextRun / 1000 / 60)} minutes)`);
  
  setTimeout(() => {
    runNightlyAdd();
    setInterval(runNightlyAdd, SCAN_INTERVAL_MS);
  }, msUntilNextRun);
  
  console.log(`[nightly] Scheduled to run daily at 3:00 AM from trusted sources only.`);
}

process.on("SIGINT", async () => {
  console.log("[nightly] Shutting down...");
  await shutdownDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("[nightly] Received SIGTERM, shutting down...");
  await shutdownDatabase();
  process.exit(0);
});

main().catch(async (err) => {
  console.error("[nightly] Fatal error:", err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});