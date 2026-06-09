import { runArcanaIndexer, getArcanaIndexStatus } from "./indexer";
import { getArcanaDb } from "./arcanaDb";
import { getOllamaClient } from "./llm/ollamaClient";

const SCANNER_INTERVAL_MS = 24 * 60 * 60 * 1000;
const BOT_USER_AGENT = "MagusMe-Scanner/1.0 (Ollama-powered; magusme.com)";

export async function startNightlyScanner() {
  console.log("[scanner] starting nightly web scouting bot...");
  await runScanCycle();
  setInterval(runScanCycle, SCANNER_INTERVAL_MS);
  console.log(`[scanner] next scan in ${SCANNER_INTERVAL_MS / 60000} minutes`);
}

async function runScanCycle() {
  const startTime = Date.now();
  console.log(`[scanner] scan cycle starting at ${new Date().toISOString()}`);

  try {
    const ollama = getOllamaClient();
    const db = getArcanaDb();
    const status = await getArcanaIndexStatus();

    console.log(`[scanner] corpus has ${status.totalEntries} entries, ${status.totalIndexLanes} source lanes`);

    const result = await runArcanaIndexer();

    const newEntries = await db.listEntriesSinceLastScan();
    const enrichedCount = await enrichEntriesWithAI(newEntries, ollama);

    const duration = Date.now() - startTime;
    console.log(`[scanner] cycle complete in ${duration}ms`);
    console.log(`[scanner] sources checked: ${result.sourcesChecked}, entries added: ${result.entriesAdded}, enriched: ${enrichedCount}`);

    await db.setMeta("last_scanner_run", new Date().toISOString());
    await db.setMeta("scanner_entries_found", String(result.entriesAdded));
    await db.setMeta("scanner_entries_enriched", String(enrichedCount));

  } catch (err) {
    console.error(`[scanner] cycle failed:`, err);
  }
}

async function enrichEntriesWithAI(
  entries: Array<{ id: string; title: string; summary: string; tradition: string }>,
  ollama: ReturnType<typeof getOllamaClient>,
): Promise<number> {
  let count = 0;
  const db = getArcanaDb();

  for (const entry of entries) {
    try {
      const prompt = `You are MagusMe, an occult research AI. Analyze this entry and enrich it with verified information.

Entry Title: ${entry.title}
Tradition: ${entry.tradition}
Summary: ${entry.summary}

Please provide:
1. SOURCE VERIFICATION: Is this from a legitimate historical/folkloric source?
2. CROSS-REFERENCES: What other traditions have similar practices?
3. DANGER ASSESSMENT: Rate 0-10 (0 = harmless, 10 = extreme risk) with brief reasoning
4. DIFFICULTY: Rate 1-10 (1 = beginner, 10 = advanced practitioner)
5. PLANETARY TIMING: Best planetary hour and moon phase for this practice
6. KEYWORDS: 5 relevant keywords for search
7. COMMUNITY NOTE: Any known safety warnings or ethical considerations

Format as JSON only.`;

      const response = await ollama.generate(prompt);
      let analysis;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        analysis = null;
      }

      if (analysis) {
        await db.updateEntryMetadata(entry.id, {
          dangerLevel: analysis.danger_assessment ?? analysis.dangerLevel,
          difficulty: analysis.difficulty,
          planetaryTiming: analysis.planetary_timing ?? analysis.planetaryTiming,
          keywords: analysis.keywords,
          crossReferences: analysis.cross_references ?? analysis.crossReferences,
          aiVerified: true,
          aiVerifiedAt: new Date().toISOString(),
        });
        count++;
      }

      await sleep(500);
    } catch (err) {
      console.error(`[scanner] failed to enrich entry ${entry.id}:`, err);
    }
  }

  return count;
}
