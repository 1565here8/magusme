import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_SPELL_MODEL ?? "qwen2.5:3b";
const BATCH_SIZE = 5;
const MAX_RETRIES = 3;
const REPORT_DIR = ".data/reports";

interface NewSpell {
  title: string;
  tradition: string;
  source: string;
  category: string;
  difficultyLevel: number;
  dangerLevel: number;
  element: string;
  timing: string;
  summary: string;
  tags: string[];
  referenceLink: string;
}

const VALID_CATEGORIES = new Set([
  "Protection", "Love & Attraction", "Money & Prosperity", "Healing",
  "Power & Dominion", "Knowledge & Wisdom", "Manifestation", "Cleansing",
  "Evil Eye", "Sex Magic", "Transformation", "Self-Mastery", "Letting Go",
  "Destruction", "Summoning", "Revenge",
]);

const VALID_TRADITIONS = new Set([
  "Wiccan", "Hoodoo", "Ceremonial", "Chaos", "Tantra", "Kabbalah",
  "Taoist", "Buddhist", "Norse", "Egyptian", "Greek", "Roman",
  "Mediterranean", "African", "Celtic", "Modern", "Voodoo", "Santeria",
  "Palo", "Candomblé", "Pow-Wow", "Folk Magic", "Slavic", "Finnish",
  "Sami", "Siberian", "Shinto", "Hindu", "Sufi", "Hermetic",
  "Qliphothic", "Luciferian", "Druidic", "Asatru", "Appalachian",
  "Brujeria", "Curanderismo", "Espiritismo", "Kardecist", "Macumba",
  "Quimbanda", "Umbanda", "Obeah", "Rootwork", "Witchcraft",
  "Mesopotamian", "Japanese", "Chinese", "Shinto", "Vodou",
]);

const VALID_ELEMENTS = new Set([
  "Fire", "Water", "Air", "Earth", "Spirit", "Aether",
  "Fire, Water", "Water, Earth", "Air, Fire", "Earth, Air",
  "Spirit, Water", "Fire, Air", "Water, Air", "All",
]);

const GIBBERISH_PATTERNS = [
  /^[A-Z]{4,}$/, /^x+$/i, /^[a-z]{1,2}$/i, /[0-9]{4,}/,
];

function buildPrompt(existingTitles: string[]): string {
  const existing = existingTitles.slice(0, 60).map((t) => `  - ${t}`).join("\n");
  return `You are a grimoire author. Generate ${BATCH_SIZE} never-before-seen magical spells.

EXISTING SPELL TITLES (DO NOT REPEAT ANY OF THESE):
${existing}

Each spell must be a valid JSON object with these fields:
- "title": unique, believable spell name (3-8 words)
- "tradition": one of: ${[...VALID_TRADITIONS].join(", ")}
- "source": plausible grimoire or tradition name
- "category": one of: ${[...VALID_CATEGORIES].join(", ")}
- "difficultyLevel": 1-10
- "dangerLevel": 0-10
- "element": one of: ${[...VALID_ELEMENTS].join(", ")}
- "timing": short timing description like "Full moon, Venus hour"
- "summary": 1-2 sentence spell description that sounds authentic
- "tags": array of 2-4 short tag strings like ["Protection", "Candle magic"]
- "referenceLink": a plausible URL like "https://magusme.com/references/<source-slug>/<spell-slug>"

QUALITY RULES:
- Titles must sound like real grimoire entries, not random word salad
- Summaries must be coherent English describing what the spell actually does
- Difficulty and danger levels must be internally consistent

Respond ONLY with a JSON array of ${BATCH_SIZE} objects. No markdown, no explanation.`;
}

function isValidSpell(s: NewSpell): { valid: boolean; reason?: string } {
  if (!s.title || typeof s.title !== "string" || s.title.length < 5 || s.title.length > 120) {
    return { valid: false, reason: "title" };
  }
  for (const p of GIBBERISH_PATTERNS) {
    if (p.test(s.title)) return { valid: false, reason: `title looks like gibberish: "${s.title}"` };
  }
  if (!VALID_CATEGORIES.has(s.category)) {
    return { valid: false, reason: `invalid category: "${s.category}"` };
  }
  if (!VALID_TRADITIONS.has(s.tradition)) {
    return { valid: false, reason: `invalid tradition: "${s.tradition}"` };
  }
  if (!VALID_ELEMENTS.has(s.element)) {
    return { valid: false, reason: `invalid element: "${s.element}"` };
  }
  if (typeof s.difficultyLevel !== "number" || s.difficultyLevel < 1 || s.difficultyLevel > 10) {
    return { valid: false, reason: `difficultyLevel out of range: ${s.difficultyLevel}` };
  }
  if (typeof s.dangerLevel !== "number" || s.dangerLevel < 0 || s.dangerLevel > 10) {
    return { valid: false, reason: `dangerLevel out of range: ${s.dangerLevel}` };
  }
  if (!s.summary || typeof s.summary !== "string" || s.summary.length < 20 || s.summary.length > 500) {
    return { valid: false, reason: "summary too short or too long" };
  }
  if (!Array.isArray(s.tags) || s.tags.length < 1) {
    return { valid: false, reason: "tags missing" };
  }
  for (const t of s.tags) {
    if (typeof t !== "string" || t.length < 2) return { valid: false, reason: `invalid tag: "${t}"` };
  }
  return { valid: true };
}

function parseResponse(text: string): NewSpell[] {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const result = JSON.parse(cleaned);
  if (!Array.isArray(result)) throw new Error("Response is not a JSON array");
  return result as NewSpell[];
}

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, temperature: 0.85 }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  const data = (await res.json()) as { response?: string };
  return data.response ?? "";
}

function appendToReport(entries: string[]) {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const date = new Date().toISOString().split("T")[0];
  const path = `${REPORT_DIR}/${date}.md`;
  const lines = entries.map((e) => `- ${e}`);
  appendFileSync(path, `${lines.join("\n")}\n`);
  console.log(`[ollama-spells] report appended to ${path}`);
}

async function main() {
  console.log(`[ollama-spells] initializing database...`);
  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  const existingTitles = (await db.getAllSpellSlugs()).map((slug) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
  const existingSet = new Set(existingTitles.map((t) => t.toLowerCase()));
  console.log(`[ollama-spells] ${existingTitles.length} existing spells`);

  const added: string[] = [];
  let attempts = 0;

  while (added.length < BATCH_SIZE && attempts < MAX_RETRIES) {
    attempts++;
    const needed = BATCH_SIZE - added.length;
    console.log(`[ollama-spells] attempt ${attempts}/${MAX_RETRIES}, need ${needed} more...`);

    const prompt = buildPrompt(existingTitles);
    const raw = await callOllama(prompt);
    let candidates: NewSpell[];
    try {
      candidates = parseResponse(raw);
    } catch (err) {
      console.error(`[ollama-spells] parse error:`, err);
      continue;
    }

    for (const spell of candidates) {
      if (added.length >= BATCH_SIZE) break;

      const slug = spell.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (existingSet.has(spell.title.toLowerCase()) || existingSet.has(slug)) {
        console.log(`[ollama-spells]  ✗ skip (duplicate): ${spell.title}`);
        continue;
      }

      const check = isValidSpell(spell);
      if (!check.valid) {
        console.log(`[ollama-spells]  ✗ skip (${check.reason}): "${spell.title}"`);
        continue;
      }

      const traditionId = await db.upsertTradition(spell.tradition);
      const sourceId = await db.upsertSource(spell.source, "AI-generated");
      const categoryId = await db.upsertCategory(spell.category);
      await db.upsertSpell({
        title: spell.title,
        traditionId,
        sourceId,
        categoryId,
        rating: 0,
        reviewCount: 0,
        difficulty: spell.difficultyLevel <= 3 ? "Beginner" : spell.difficultyLevel <= 6 ? "Medium" : "Hard",
        difficultyLevel: spell.difficultyLevel,
        danger: spell.dangerLevel === 0 ? "None" : spell.dangerLevel <= 3 ? "Low" : spell.dangerLevel <= 6 ? "Moderate" : "High",
        dangerLevel: spell.dangerLevel,
        element: spell.element,
        timing: spell.timing,
        counterSpell: null,
        warning: null,
        summary: spell.summary,
        tags: spell.tags,
        referenceLink: spell.referenceLink || null,
      });

      existingSet.add(spell.title.toLowerCase());
      existingSet.add(slug);
      added.push(`${spell.title} — ${spell.tradition}, ${spell.category} — ${spell.summary.slice(0, 100)}...`);
      console.log(`[ollama-spells]  ✓ ${spell.title} (${spell.tradition}, ${spell.category})`);
    }
  }

  const total = await db.count();
  console.log(`[ollama-spells] done — seeded ${added.length} new spells (${total} total)`);

  if (added.length > 0) {
    appendToReport(added);
  }

  await shutdownDatabase();
}

main().catch(async (err) => {
  console.error(`[ollama-spells] fatal:`, err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});
