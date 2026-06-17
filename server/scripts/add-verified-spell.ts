import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";
import { generateRichContent } from "../../src/server/spells/richContent";

interface VerifiedSpell {
  title: string;
  tradition: string;
  source: string;
  sourceCitation: string;
  category: string;
  rating: number;
  reviewCount: number;
  difficulty: string;
  difficultyLevel: number;
  danger: string;
  dangerLevel: number;
  element: string;
  timing: string;
  counterSpell: string;
  warning: string | null;
  summary: string;
  tags: string[];
  referenceLink: string;
}

const SPELLS_TO_ADD: VerifiedSpell[] = [
  // Add your spells here, following this format:
  // {
  //   title: "Spell Name",
  //   tradition: "Wiccan",
  //   source: "Cunningham's Encyclopedia of Magical Herbs",
  //   sourceCitation: "Cunningham, Scott. *Encyclopedia of Magical Herbs*. St. Paul, MN: Llewellyn Publications, 1985.",
  //   category: "Protection",
  //   rating: 4.8,
  //   reviewCount: 0,
  //   difficulty: "Easy",
  //   difficultyLevel: 1,
  //   danger: "None",
  //   dangerLevel: 0,
  //   element: "Air, Spirit",
  //   timing: "Mercury hour, Waxing moon",
  //   counterSpell: "Reflect Release",
  //   warning: null,
  //   summary: "Description of what the spell does...",
  //   tags: ["Beginner-friendly", "No materials", "Fast results"],
  //   referenceLink: "https://magusme.com/references/cunninghams-encyclopedia/spell-name"
  // },
];

async function main() {
  console.log("[add-verified-spell] Initializing database...");
  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  // Upsert traditions, categories, sources
  const traditions = new Set(SPELLS_TO_ADD.map(s => s.tradition));
  const categories = new Set(SPELLS_TO_ADD.map(s => s.category));
  const sources = new Map<string, { title: string; citation: string }>();
  SPELLS_TO_ADD.forEach(s => sources.set(s.source, { title: s.source, citation: s.sourceCitation }));

  const tradIds: Record<string, string> = {};
  for (const t of traditions) {
    tradIds[t] = await db.upsertTradition(t);
  }

  const catIds: Record<string, string> = {};
  const catList = ["Protection", "Love & Attraction", "Money & Prosperity", "Healing", "Destruction",
    "Power & Dominion", "Knowledge & Wisdom", "Manifestation", "Cleansing", "Evil Eye",
    "Sex Magic", "Summoning", "Transformation", "Self-Mastery", "Letting Go", "Revenge"];
  for (const [i, c] of catList.entries()) {
    if (categories.has(c)) {
      catIds[c] = await db.upsertCategory(c, i + 1);
    }
  }

  const sourceIds: Record<string, string> = {};
  for (const [title, { citation }] of sources) {
    sourceIds[title] = await db.upsertSource(title, "", true);
  }

  let added = 0;
  for (const spell of SPELLS_TO_ADD) {
    const slug = spell.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    console.log(`[add-verified-spell] Adding: ${spell.title} (${slug})`);

    const rc = generateRichContent(
      spell.title,
      spell.category,
      spell.element,
      spell.tradition,
      spell.difficultyLevel,
      spell.dangerLevel
    );
    const fullText = JSON.stringify(rc);

    await db.upsertSpell({
      title: spell.title,
      traditionId: tradIds[spell.tradition],
      sourceId: sourceIds[spell.source],
      categoryId: catIds[spell.category],
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
      verified: true,
      verificationStatus: 'verified',
      verificationSource: spell.sourceCitation,
    });
    added++;
  }

  const finalCount = await db.count();
  console.log(`[add-verified-spell] DONE — ${added} spells added. Total verified: ${finalCount}`);

  await shutdownDatabase();
}

main().catch(async (err) => {
  console.error("[add-verified-spell] Fatal:", err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});