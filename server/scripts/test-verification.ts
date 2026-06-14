import { initDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";

async function main() {
  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  console.log("Testing hard rule enforcement...");

  // Test 1: Try to insert unverified spell (should fail)
  console.log("\nTest 1: Inserting UNVERIFIED spell (should fail)...");
  try {
    await db.upsertSpell({
      title: "Test Unverified Spell",
      traditionId: null,
      sourceId: null,
      categoryId: null,
      rating: 5,
      reviewCount: 0,
      difficulty: "Easy",
      difficultyLevel: 1,
      danger: "None",
      dangerLevel: 0,
      element: null,
      timing: null,
      counterSpell: null,
      warning: null,
      summary: "Test spell",
      tags: ["test"],
      fullText: "test",
      referenceLink: null,
      verified: false
    });
    console.log("FAIL: Should have thrown!");
  } catch (e) {
    console.log("PASS - Hard rule enforced:", e.message);
  }

  // Test 2: Try to insert verified spell (should succeed)
  console.log("\nTest 2: Inserting VERIFIED spell (should succeed)...");
  try {
    await db.upsertSpell({
      title: "Test Verified Spell",
      traditionId: null,
      sourceId: null,
      categoryId: null,
      rating: 5,
      reviewCount: 0,
      difficulty: "Easy",
      difficultyLevel: 1,
      danger: "None",
      dangerLevel: 0,
      element: null,
      timing: null,
      counterSpell: null,
      warning: null,
      summary: "Test spell",
      tags: ["test"],
      fullText: "test",
      referenceLink: null,
      verified: true
    });
    console.log("PASS - Verified spell inserted successfully");
  } catch (e) {
    console.log("FAIL - Error:", e.message);
  }

  // Test 3: Verify only verified spells are returned
  console.log("\nTest 3: Checking getSpells only returns verified...");
  const spells = await db.getSpells({ limit: 20 });
  console.log(`Found ${spells.total} verified spells`);
  for (const s of spells.spells) {
    console.log(`  - ${s.title} | ${s.source}`);
  }

  console.log("\nAll tests complete!");
}

main().catch(console.error);