import { getDb } from "../db";
import { initSpellsDb } from "./spellsDb";
import { seedSpellData } from "./seed";

export async function initSpellsModule() {
  const driver = getDb().getDriver();
  initSpellsDb(driver);
  await seedSpellData();
}
