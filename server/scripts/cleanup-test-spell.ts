import { initDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";
import { getDb } from "../../src/server/db";

async function main() {
  await initDatabase();
  await initSpellsModule();
  const spellsDb = getSpellsDb();
  const driver = getDb().getDriver();

  // Delete the test spell
  await driver.exec("DELETE FROM spells WHERE title = ?", ["Test Verified Spell"]);
  console.log("Test spell cleaned up");

  // Verify count is back to 14
  const count = await spellsDb.count();
  console.log("Verified spells:", count);
}

main().catch(console.error);