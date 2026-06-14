import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";
import { generateAllSpells } from "../../src/server/spells/generatedSpells";
import { generateRichContent } from "../../src/server/spells/richContent";

const TARGET_TOTAL = 1_000_000;
const BATCH_SIZE = 10_000;
const REPORT_DIR = ".data/reports";

async function main() {
  console.log(`[bulk-spells] Initializing database...`);
  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  const currentCount = await db.count();
  console.log(`[bulk-spells] Current spells in DB: ${currentCount}`);

  if (currentCount >= TARGET_TOTAL) {
    console.log(`[bulk-spells] Target of ${TARGET_TOTAL} already reached!`);
    await shutdownDatabase();
    return;
  }

  const needed = TARGET_TOTAL - currentCount;
  const totalBatches = Math.ceil(needed / BATCH_SIZE);
  console.log(`[bulk-spells] Need ${needed} more spells (${totalBatches} batches of ${BATCH_SIZE})`);

  const generatedSpells = generateAllSpells();
  console.log(`[bulk-spells] Pre-generated spell pool: ${generatedSpells.length} unique spells`);

  const existingSlugs = new Set(await db.getAllSpellSlugs());
  console.log(`[bulk-spells] Existing slugs loaded: ${existingSlugs.size}`);

  const categories = [
    "Protection", "Love & Attraction", "Money & Prosperity", "Healing", "Destruction",
    "Power & Dominion", "Knowledge & Wisdom", "Manifestation", "Cleansing", "Evil Eye",
    "Sex Magic", "Summoning", "Transformation", "Self-Mastery", "Letting Go", "Revenge",
  ];

  let totalAdded = 0;
  let spellIndex = 0;

  for (let batch = 1; batch <= totalBatches; batch++) {
    const batchNeeded = Math.min(BATCH_SIZE, needed - totalAdded);
    const added: string[] = [];

    for (const spell of generatedSpells) {
      if (added.length >= batchNeeded) break;
      if (spellIndex >= generatedSpells.length) {
        spellIndex = 0;
      }

      const slug = spell.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (existingSlugs.has(slug)) {
        spellIndex++;
        continue;
      }

      const traditionId = await db.upsertTradition(spell.tradition);
      const sourceId = await db.upsertSource(spell.source, "", spell.source.includes("Verified") || spell.source.includes("Community"));
      const categoryId = await db.upsertCategory(spell.category);

      const richContent = generateRichContent(
        spell.title,
        spell.category,
        spell.element,
        spell.tradition,
        spell.difficultyLevel,
        spell.dangerLevel
      );
      const fullText = JSON.stringify(richContent);

      await db.upsertSpell({
        title: spell.title,
        traditionId,
        sourceId,
        categoryId,
        rating: spell.rating,
        reviewCount: spell.reviewCount,
        difficulty: spell.difficulty,
        difficultyLevel: spell.difficultyLevel,
        danger: spell.danger,
        dangerLevel: spell.dangerLevel,
        element: spell.element,
        timing: spell.timing,
        counterSpell: spell.counterSpell,
        warning: spell.warning,
        summary: spell.summary,
        tags: spell.tags,
        fullText,
        referenceLink: spell.referenceLink,
      });

      existingSlugs.add(slug);
      added.push(`${spell.title} — ${spell.tradition}, ${spell.category}`);
      spellIndex++;
      totalAdded++;
    }

    const count = await db.count();
    console.log(`[bulk-spells] Batch ${batch}/${totalBatches} complete — added ${added.length} spells (${count} total)`);

    if (added.length > 0) {
      const fs = await import("node:fs");
      if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
      const date = new Date().toISOString().split("T")[0];
      const path = `${REPORT_DIR}/${date}-bulk.md`;
      fs.appendFileSync(path, `- Batch ${batch}: ${added.length} spells added\n`);
      for (const a of added) {
        fs.appendFileSync(path, `  - ${a}\n`);
      }
    }

    if (totalAdded >= needed) break;
  }

  const finalCount = await db.count();
  console.log(`[bulk-spells] DONE — ${totalAdded} spells added. Total: ${finalCount}`);

  await shutdownDatabase();
}

main().catch(async (err) => {
  console.error(`[bulk-spells] Fatal:`, err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});