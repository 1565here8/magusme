import { getArcanaDb } from "./arcanaDb";
import { ingestFromSources, ingestKabbalahFromSources } from "./libraryIngest";
import { INDEX_SOURCES, KABBALAH_INDEX_SOURCES, MERLIAN_INDEXING_MISSION, WORLD_MAGIC_TAXONOMY } from "./indexSources";
import { seedEntriesWithTimestamps } from "./seedData";
import { kabbalahSeedsWithTimestamps } from "./kabbalahSeeds";

const INDEX_INTERVAL_MS = Number(process.env.ARCANA_INDEX_INTERVAL_MS ?? 6 * 60 * 60 * 1000);

let indexerTimer: ReturnType<typeof setInterval> | null = null;
let nextRunAt = Date.now() + INDEX_INTERVAL_MS;

function allSeedEntries() {
  const now = new Date().toISOString();
  return [...seedEntriesWithTimestamps(), ...kabbalahSeedsWithTimestamps(now)];
}

export async function seedArcanaCorpus() {
  const db = getArcanaDb();
  const count = await db.countEntries();
  if (count > 0) return count;

  const seeds = allSeedEntries();
  for (const entry of seeds) {
    await db.upsertEntry(entry);
  }
  await db.recordIndexRun(INDEX_SOURCES.length, seeds.length);
  return seeds.length;
}

export async function runArcanaIndexer() {
  const db = getArcanaDb();
  let added = 0;

  for (const entry of allSeedEntries()) {
    const existing = await db.getEntry(entry.id);
    if (!existing) added += 1;
    await db.upsertEntry({
      ...entry,
      createdAt: existing?.createdAt ?? entry.createdAt,
    });
  }

  const allEntries = await db.listAllEntries();
  const existingIds = new Set(allEntries.map((e) => e.id));
  const { entries: ingested, docsScanned, sourcesTouched } = await ingestFromSources(INDEX_SOURCES, existingIds);

  for (const entry of ingested) {
    const existing = await db.getEntry(entry.id);
    if (!existing) added += 1;
    await db.upsertEntry(entry);
  }

  const { entries: kabIngested, docsScanned: kabDocs, sourcesTouched: kabTouched } =
    await ingestKabbalahFromSources(KABBALAH_INDEX_SOURCES, existingIds);

  for (const entry of kabIngested) {
    const existing = await db.getEntry(entry.id);
    if (!existing) added += 1;
    await db.upsertEntry(entry);
  }

  await db.recordIndexRun(INDEX_SOURCES.length + sourcesTouched + kabTouched, added);
  nextRunAt = Date.now() + INDEX_INTERVAL_MS;
  return {
    sourcesChecked: INDEX_SOURCES.length,
    sourcesTouched: sourcesTouched + kabTouched,
    entriesAdded: added,
    docsScanned: docsScanned + kabDocs,
    totalIndexLanes: INDEX_SOURCES.length + KABBALAH_INDEX_SOURCES.length,
  };
}

export function startArcanaIndexer() {
  if (indexerTimer) return;
  void runArcanaIndexer().catch(() => null);
  indexerTimer = setInterval(() => {
    void runArcanaIndexer().catch(() => null);
  }, INDEX_INTERVAL_MS);
}

export function stopArcanaIndexer() {
  if (indexerTimer) {
    clearInterval(indexerTimer);
    indexerTimer = null;
  }
}

export async function getArcanaIndexStatus() {
  const db = getArcanaDb();
  const totalEntries = await db.countEntries();
  const lastRun = await db.getLastIndexRun();
  const entries = await db.listAllEntries();
  const traditions = [...new Set(entries.map((e) => e.tradition))].sort();

  return {
    totalEntries,
    lastRun,
    nextScheduledInMs: Math.max(0, nextRunAt - Date.now()),
    sources: INDEX_SOURCES.map((s) => ({ name: s.name, url: s.url, institution: s.institution })),
    totalIndexLanes: INDEX_SOURCES.length + KABBALAH_INDEX_SOURCES.length,
    indexingMission: MERLIAN_INDEXING_MISSION,
    comprehensiveIndex: process.env.ARCANA_COMPREHENSIVE_INDEX?.trim().toLowerCase() === "true",
    ingestPerRun: Number(process.env.ARCANA_INGEST_MAX ?? (process.env.ARCANA_COMPREHENSIVE_INDEX === "true" ? 32 : 8)),
    traditions,
    traditionTaxonomy: WORLD_MAGIC_TAXONOMY,
    liveIndexEnabled: process.env.ARCANA_LIVE_INDEX === "true",
  };
}

export { INDEX_SOURCES, WORLD_MAGIC_TAXONOMY as TRADITION_TAXONOMY, MERLIAN_INDEXING_MISSION };
