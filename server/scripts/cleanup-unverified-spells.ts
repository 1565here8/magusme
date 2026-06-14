import { initDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";
import { getDb } from "../../src/server/db";

async function main() {
  await initDatabase();
  await initSpellsModule();
  const spellsDb = getSpellsDb();
  const driver = getDb().getDriver();

  console.log("[cleanup] Starting verification cleanup...");

  // Get current count
  const totalBefore = await spellsDb.count();
  console.log(`[cleanup] Verified spells before: ${totalBefore}`);

  // Count all spells (including unverified)
  const allCount = await driver.get<{ count: number }>("SELECT COUNT(*) AS count FROM spells");
  console.log(`[cleanup] Total spells in DB (including unverified): ${allCount?.count ?? 0}`);

  // Count verified vs unverified
  const verifiedCount = await driver.get<{ count: number }>("SELECT COUNT(*) AS count FROM spells WHERE verified = 1");
  const unverifiedCount = await driver.get<{ count: number }>("SELECT COUNT(*) AS count FROM spells WHERE verified = 0");
  console.log(`[cleanup] Verified: ${verifiedCount?.count ?? 0}, Unverified: ${unverifiedCount?.count ?? 0}`);

  // Mark seed spells as verified
  // These are the hand-written spells from seed.ts
  const seedSpellTitles = [
    "Mirror Shield Charm",
    "Binding of the Hexer",
    "Psychic Shield",
    "Witch's Bottle",
    "Lesser Banishing Ritual of the Pentagram",
    "Love Drawing Ritual",
    "Rose Quartz Heart Opening",
    "Honey Jar Sweetening",
    "Aphrodite's Flame",
    "Lover's Knot",
    "Sekhmet's Wrath",
    "Mojo Bag",
    "Solar Plexus Empowerment",
    "Ocean Release"
  ];

  console.log("[cleanup] Marking seed spells as verified...");
  for (const title of seedSpellTitles) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await driver.exec("UPDATE spells SET verified = 1 WHERE slug = ?", [slug]);
    console.log(`  - ${title} (${slug})`);
  }

  // Delete all unverified spells (AI-generated)
  console.log("[cleanup] Deleting all unverified (AI-generated) spells...");
  await driver.exec("DELETE FROM spells WHERE verified = 0");
  console.log(`[cleanup] Deleted unverified spells`);

  // Also clean up orphaned sources that are not verified and not used by verified spells
  console.log("[cleanup] Cleaning up unverified sources...");
  await driver.exec(`
    DELETE FROM spell_sources 
    WHERE verified = 0 
    AND id NOT IN (SELECT DISTINCT source_id FROM spells WHERE source_id IS NOT NULL)
  `);
  console.log("[cleanup] Cleaned up orphaned unverified sources");

  // Final counts
  const totalAfter = await spellsDb.count();
  console.log(`[cleanup] Verified spells after: ${totalAfter}`);

  const finalCount = await driver.get<{ count: number }>("SELECT COUNT(*) AS count FROM spells");
  console.log(`[cleanup] Total spells in DB after cleanup: ${finalCount?.count ?? 0}`);

  console.log("[cleanup] Cleanup complete!");
  await getDb().close();
}

main().catch(async (err) => {
  console.error("[cleanup] Fatal error:", err);
  process.exit(1);
});