#!/usr/bin/env npx tsx
/**
 * Curation Agent — Nightly verified spell extraction from trusted sources
 * 1. SEARCH: archive.org for spell/ritual texts from pre-1930 public domain
 * 2. FETCH: Full text via text files or PDF extraction
 * 3. EXTRACT: LLM verbatim extraction with strict prompt
 * 4. STAGE: Write to staging DB for human review on port 8888
 */

import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { getArcanaDb, initArcanaDb } from "../../src/server/arcana/arcanaDb";
import { getOllamaClient } from "../../src/server/arcana/llm/ollamaClient";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const STAGING_DIR = "/Users/magusme/Desktop/magusme-staging";
const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_CURATION_MODEL ?? "qwen2.5:7b";
const MAX_SPELLS_PER_RUN = Number(process.env.CURATION_MAX_SPELLS ?? 5);

const TRUSTED_QUERIES = [
  'subject:"Magic" AND mediatype:texts AND date:[* TO 1930] AND language:(eng OR lat OR fre OR ger)',
  'subject:"Witchcraft" AND mediatype:texts AND date:[* TO 1930]',
  'subject:"Occultism" AND mediatype:texts AND date:[* TO 1930]',
  'subject:"Grimoire" AND mediatype:texts AND date:[* TO 1930]',
  'subject:"Ceremonial magic" AND mediatype:texts AND date:[* TO 1930]',
  'title:"Key of Solomon" AND mediatype:texts',
  'title:"Lesser Key of Solomon" AND mediatype:texts',
  'title:"Picatrix" AND mediatype:texts',
  'title:"Book of Abramelin" AND mediatype:texts',
  'creator:"Mathers" AND subject:"Magic"',
  'creator:"Crowley" AND subject:"Magic"',
  'creator:"Waite" AND subject:"Magic"',
  'subject:"Hoodoo" AND mediatype:texts',
  'subject:"Conjure" AND mediatype:texts',
  'subject:"Folk magic" AND mediatype:texts',
];

interface ArchiveDoc {
  identifier: string;
  title: string;
  creator?: string;
  description?: string;
  year?: string;
  downloads?: number;
}

interface ExtractedSpell {
  title: string;
  tradition: string;
  category: string;
  element: string;
  timing: string;
  materials: string[];
  steps: string[];
  warnings: string[];
  counterSpell: string;
  sourceCitation: {
    author: string;
    title: string;
    year: string;
    page: string;
    archiveUrl: string;
  };
  summary: string;
  dangerLevel: number;
  difficultyLevel: number;
  reject?: boolean;
  reason?: string;
}

function log(msg: string) {
  console.log(`[curation-agent] ${new Date().toISOString()} ${msg}`);
}

async function searchArchive(query: string, limit = 10): Promise<ArchiveDoc[]> {
  const url = new URL("https://archive.org/advancedsearch.php");
  url.searchParams.set("q", query);
  url.searchParams.set("fl[]", "identifier");
  url.searchParams.set("fl[]", "title");
  url.searchParams.set("fl[]", "creator");
  url.searchParams.set("fl[]", "description");
  url.searchParams.set("fl[]", "year");
  url.searchParams.set("fl[]", "downloads");
  url.searchParams.set("sort[]", "downloads desc");
  url.searchParams.set("rows", String(limit));
  url.searchParams.set("output", "json");

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) return [];
  const body = (await res.json()) as { response?: { docs?: ArchiveDoc[] } };
  return body.response?.docs ?? [];
}

async function fetchFullText(identifier: string): Promise<string | null> {
  try {
    const metaRes = await fetch(`https://archive.org/metadata/${identifier}`);
    if (!metaRes.ok) return null;
    const meta = await metaRes.json();
    const files = meta.files || [];

    const textFiles = files
      .filter((f: any) => f.name?.endsWith(".txt") || f.name?.endsWith("_text.txt") || f.name?.endsWith(".djvu.txt"))
      .sort((a: any, b: any) => (b.size || 0) - (a.size || 0));

    for (const file of textFiles.slice(0, 3)) {
      try {
        const url = `https://archive.org/download/${identifier}/${file.name}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
        if (res.ok) {
          const text = await res.text();
          if (text.length > 5000) return text;
        }
      } catch { continue; }
    }

    const pdfFiles = files.filter((f: any) => f.name?.endsWith(".pdf")).slice(0, 1);
    for (const file of pdfFiles) {
      try {
        const url = `https://archive.org/download/${identifier}/${file.name}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const pdfParse = await import("pdf-parse");
          const data = await pdfParse.default(buffer);
          if (data.text.length > 5000) return data.text;
        }
      } catch { continue; }
    }
  } catch (e) {
    log(`Fetch failed for ${identifier}: ${e}`);
  }
  return null;
}

const EXTRACTION_PROMPT = `You are a scholarly editor extracting ONE complete spell/ritual from a historical grimoire.

SOURCE TEXT:
{{SOURCE_TEXT}}

RULES — VIOLATION = REJECT:
1. Extract ONLY spells explicitly present in the text. If none, return {"reject": true, "reason": "no_spell_found"}
2. NO modernization, NO interpretation, NO "this spell does X". Copy verbatim.
3. Include: title, tradition, category, element, timing, materials[], steps[], warnings[], counterSpell
4. Source citation MUST include: author, title, year, page/chapter, archive.org URL
4. If text is in Latin/French/German/etc, TRANSLATE to English but mark original language
5. Output ONLY valid JSON matching the schema below.

SCHEMA:
{
  "title": "string",
  "tradition": "Ceremonial|Hoodoo|Wiccan|Grimoire|Folk|Egyptian|Greek|Norse|Celtic|Other",
  "category": "Protection|Love & Attraction|Money & Prosperity|Healing|Destruction|Power & Dominion|Knowledge & Wisdom|Manifestation|Cleansing|Evil Eye|Sex Magic|Summoning|Transformation|Self-Mastery|Letting Go|Revenge",
  "element": "Fire|Water|Air|Earth|Spirit|Fire, Water|etc",
  "timing": "string (e.g., 'Mars hour, Tuesday, Waning moon')",
  "materials": ["string", "..."],
  "steps": ["string", "..."],
  "warnings": ["string", "..."],
  "counterSpell": "string",
  "sourceCitation": {
    "author": "string",
    "title": "string",
    "year": "string",
    "page": "string (page/chapter/folio)",
    "archiveUrl": "https://archive.org/details/identifier"
  },
  "summary": "string (1-2 sentences, descriptive only)",
  "dangerLevel": "number (0-10)",
  "difficultyLevel": "number (1-10)"
}`;

async function extractSpell(ollama: any, text: string, identifier: string): Promise<ExtractedSpell | null> {
  const chunks = chunkText(text, 12000);
  for (const chunk of chunks.slice(0, 3)) {
    const prompt = EXTRACTION_PROMPT.replace("{{SOURCE_TEXT}}", chunk);
    try {
      const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt, stream: false, temperature: 0.1, format: "json" }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const parsed = JSON.parse(data.response);
      if (parsed.reject) continue;
      if (parsed.title && parsed.steps && parsed.steps.length > 0) {
        parsed.sourceCitation.archiveUrl = `https://archive.org/details/${identifier}`;
        return parsed as ExtractedSpell;
      }
    } catch (e) {
      log(`Extraction error: ${e}`);
    }
  }
  return null;
}

function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

function generateRichContent(spell: ExtractedSpell) {
  return {
    purpose: spell.summary,
    materials: spell.materials,
    steps: spell.steps,
    variations: spell.warnings.length > 0 ? [`Cautions: ${spell.warnings.join("; ")}`] : [],
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function writeStaging(spell: ExtractedSpell, sourceText: string, identifier: string) {
  if (!existsSync(STAGING_DIR)) mkdirSync(STAGING_DIR, { recursive: true });

  const slug = slugify(spell.title);
  const stagingSpell = {
    id: `staging_${slug}_${Date.now()}`,
    slug,
    ...spell,
    fullText: JSON.stringify(generateRichContent(spell)),
    sourceTextPreview: sourceText.slice(0, 3000),
    archiveIdentifier: identifier,
    status: "pending_review",
    createdAt: new Date().toISOString(),
  };

  const file = join(STAGING_DIR, `${slug}.json`);
  writeFileSync(file, JSON.stringify(stagingSpell, null, 2));
  log(`Staged: ${slug} → ${file}`);
}

async function main() {
  log("=== Curation Agent Started ===");
  
  await initDatabase();
  const { getDb } = await import("../../src/server/db");
  const { initArcanaDb } = await import("../../src/server/arcana/arcanaDb");
  const driver = getDb().getDriver();
  initArcanaDb(driver);

  const ollama = getOllamaClient();

  let totalStaged = 0;

  for (const query of TRUSTED_QUERIES) {
    if (totalStaged >= MAX_SPELLS_PER_RUN) break;

    log(`Searching: ${query}`);
    const docs = await searchArchive(query, 5);

    for (const doc of docs) {
      if (totalStaged >= MAX_SPELLS_PER_RUN) break;

      const existingStaged = existsSync(join(STAGING_DIR, `${slugify(doc.title)}.json`));
      if (existingStaged) continue;

      log(`Fetching: ${doc.identifier} — ${doc.title}`);
      const fullText = await fetchFullText(doc.identifier);
      if (!fullText) {
        log(`  No usable text`);
        continue;
      }

      log(`  Extracting spell...`);
      const spell = await extractSpell(ollama, fullText, doc.identifier);
      if (!spell) {
        log(`  No spell extracted`);
        continue;
      }

      await writeStaging(spell, fullText, doc.identifier);
      totalStaged++;
    }
  }

  log(`=== Complete: ${totalStaged} spells staged for review ===`);
  log(`Review at: http://localhost:8888/curation`);

  await shutdownDatabase();
}

main().catch(async (err) => {
  console.error("[curation-agent] Fatal:", err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});