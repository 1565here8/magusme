/**
 * Ollama Spell Enricher — enhances spells with AI-generated detailed descriptions
 * Runs alongside the generator to add rich content using Ollama.
 */

import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_SPELL_MODEL ?? "qwen2.5:3b";
const ENRICH_BATCH = 10;

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
      temperature: 0.8,
      options: { num_predict: 2048 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = (await res.json()) as { response?: string };
  return data.response ?? "";
}

async function enrichSpell(title: string, tradition: string, category: string, element: string): Promise<string> {
  const prompt = `You are a grimoire author. Write a detailed 3-paragraph magical spell description for "${title}".

Tradition: ${tradition}
Category: ${category}
Element: ${element}

Write in an authoritative, mystical tone. Include:
1. Historical/cultural context
2. Step-by-step instructions
3. Expected outcomes and safety notes

Respond with ONLY the description text, no title or headers.`;

  return callOllama(prompt);
}

async function main() {
  console.log(`[spell-enricher] Starting Ollama spell enricher...`);
  console.log(`[spell-enricher] Model: ${MODEL}`);

  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  let enriched = 0;
  let batchNum = 0;

  while (true) {
    batchNum++;
    // Get spells without full_text
    const { spells } = await db.getSpells({ limit: ENRICH_BATCH, offset: 0, sort: "Newest" });

    const toEnrich = spells.filter((s: any) => !s.full_text);
    if (toEnrich.length === 0) {
      console.log(`[spell-enricher] All spells enriched! Total: ${enriched}`);
      break;
    }

    for (const spell of toEnrich) {
      try {
        const description = await enrichSpell(
          spell.title,
          spell.tradition,
          spell.category,
          spell.element || "Spirit"
        );
        const slug = spell.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        await db.updateFullText(slug, description);
        enriched++;
        if (enriched % 100 === 0) {
          console.log(`[spell-enricher] Enriched ${enriched} spells`);
        }
      } catch (err) {
        console.error(`[spell-enricher] Failed to enrich "${spell.title}":`, err);
      }
    }

    // Small delay between batches
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`[spell-enricher] ✅ Enrichment complete: ${enriched} spells enhanced`);
  await shutdownDatabase();
  process.exit(0);
}

process.on("SIGINT", async () => {
  await shutdownDatabase();
  process.exit(0);
});

main().catch(async (err) => {
  console.error(`[spell-enricher] Fatal:`, err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});
