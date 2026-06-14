import { initDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";

async function main() {
  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  const count = await db.count();
  console.log('Total spells:', count);

  const spells = await db.getSpells({ limit: 20, offset: 0 });
  console.log('Sample spells:');
  for (const s of spells.spells) {
    console.log(' -', s.title, '|', s.tradition, '|', s.category, '|', s.source);
  }
}

main().catch(console.error);