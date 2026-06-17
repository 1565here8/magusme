#!/usr/bin/env npx tsx
/**
 * Spell Curation CLI
 * Interactive tool to extract spells from archive.org text and insert as verified spells.
 * NO AI. Human reads, human decides, human inserts with citation.
 */

import { initDatabase, shutdownDatabase } from "../../src/server/db";
import { initSpellsModule } from "../../src/server/spells/init";
import { getSpellsDb } from "../../src/server/spells/spellsDb";
import { generateRichContent } from "../../src/server/spells/richContent";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { join } from "node:path";
import { readFileSync, existsSync } from "node:fs";

const CORPUS_DIR = "/Users/magusme/Desktop/magusme-archive-corpus";

function log(msg: string) {
  console.log(`[curate] ${msg}`);
}

function rl() {
  return readline.createInterface({ input: stdin, output: stdout });
}

async function ask(question: string): Promise<string> {
  const r = rl();
  const answer = await r.question(question);
  r.close();
  return answer.trim();
}

async function askMulti(question: string): Promise<string> {
  console.log(question);
  console.log("(Enter empty line twice to finish)");
  const lines: string[] = [];
  const r = rl();
  let emptyCount = 0;
  for await (const line of r) {
    if (line.trim() === "") {
      emptyCount++;
      if (emptyCount >= 2) break;
    } else {
      emptyCount = 0;
      lines.push(line);
    }
  }
  r.close();
  return lines.join("\n").trim();
}

async function listCorpusFiles(): Promise<string[]> {
  if (!existsSync(CORPUS_DIR)) return [];
  const files = require("fs").readdirSync(CORPUS_DIR);
  return files
    .filter((f: string) => f.endsWith("-fulltext.txt"))
    .map((f: string) => f.replace("-fulltext.txt", ""))
    .sort();
}

async function viewChunks(identifier: string) {
  const chunksFile = join(CORPUS_DIR, `${identifier}-chunks.json`);
  if (!existsSync(chunksFile)) {
    log("No chunks file found. Run fetch-archive-text.ts first.");
    return;
  }
  const chunks = JSON.parse(readFileSync(chunksFile, "utf8"));
  chunks.forEach((c: any, i: number) => {
    console.log(`\n--- CHUNK ${i}: ${c.heading.slice(0, 80)} (${c.content.length} chars) ---`);
    console.log(c.content.slice(0, 500) + (c.content.length > 500 ? "..." : ""));
  });
  return chunks;
}

async function insertSpell(spell: any) {
  await initDatabase();
  await initSpellsModule();
  const db = getSpellsDb();

  const tradId = await db.upsertTradition(spell.tradition);
  const catId = await db.upsertCategory(spell.category);
  const sourceId = await db.upsertSource(spell.source, spell.author || "", true);

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
    traditionId: tradId,
    sourceId,
    categoryId: catId,
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
    verificationSource: spell.verificationSource,
  });

  await shutdownDatabase();
  log(`✅ Inserted: ${spell.title}`);
}

async function curateFromChunks(identifier: string) {
  const chunks = await viewChunks(identifier);
  if (!chunks || chunks.length === 0) return;

  console.log("\n=== CURATE SPELL ===");
  const title = await ask("Spell title: ");
  if (!title) return;

  const tradition = await ask("Tradition (Wiccan/Hoodoo/Ceremonial/etc): ");
  const category = await ask("Category (Protection/Love & Attraction/Money/Healing/etc): ");
  const source = await ask("Source book title (e.g., 'The Key of Solomon'): ");
  const author = await ask("Author (optional): ");
  const year = await ask("Year (optional): ");
  const institution = await ask("Institution (e.g., 'British Library', 'Internet Archive'): ");

  const citation = await askMulti(
    `Full academic citation (paste it):\nExample: "Mathers, S.L. MacGregor (ed.). *The Key of Solomon*. London: George Redway, 1888. British Library MS Sloane 3847."`
  );

  const element = await ask("Element (Fire/Water/Air/Earth/Spirit/comma-separated): ");
  const timing = await ask("Timing (e.g., 'Mars hour, Tuesday, Waning moon'): ");
  const difficultyLevel = parseInt(await ask("Difficulty level (1-10): ") || "3");
  const dangerLevel = parseInt(await ask("Danger level (0-10): ") || "0");

  const difficulty = difficultyLevel <= 2 ? "Beginner" : difficultyLevel <= 4 ? "Easy" : difficultyLevel <= 6 ? "Medium" : difficultyLevel <= 8 ? "Hard" : "Extreme";
  const danger = dangerLevel === 0 ? "None" : dangerLevel <= 2 ? "Low" : dangerLevel <= 4 ? "Moderate" : dangerLevel <= 6 ? "High" : "Extreme";

  console.log("\nChunks available. Select one by number, or type 'custom' to write your own:");
  const choice = await ask("Chunk number or 'custom': ");

  let fullTextContent: string;
  if (choice === "custom") {
    fullTextContent = await askMulti("Paste the full spell text (verbatim from source):");
  } else {
    const idx = parseInt(choice);
    if (isNaN(idx) || idx < 0 || idx >= chunks.length) {
      log("Invalid chunk number");
      return;
    }
    fullTextContent = chunks[idx].content;
    console.log(`\nSelected chunk ${idx}: ${chunks[idx].heading}`);
    console.log(fullTextContent.slice(0, 300) + "...");
    const confirm = await ask("Use this chunk? [y/N]: ");
    if (confirm.toLowerCase() !== "y") return;
  }

  const summary = await ask("One-sentence summary for the grimoire index: ");
  const counterSpell = await ask("Counter-spell name (optional): ");
  const warning = await ask("Warning/caution (optional): ");
  const tagsInput = await ask("Tags (comma-separated): ");
  const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);

  const referenceLink = `https://magusme.com/references/${source.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const spell = {
    title,
    tradition,
    source,
    author,
    year,
    institution,
    category,
    rating: 4.5,
    reviewCount: 0,
    difficulty,
    difficultyLevel,
    danger,
    dangerLevel,
    element,
    timing,
    counterSpell: counterSpell || "N/A",
    warning: warning || null,
    summary,
    tags,
    referenceLink,
    verificationSource: citation || `Verified from ${source} (${institution}, ${year || "n.d."}). Archive: https://archive.org/details/${identifier}`,
  };

  const confirm = await ask("\nInsert this spell? [y/N]: ");
  if (confirm.toLowerCase() === "y") {
    await insertSpell(spell);
  } else {
    log("Cancelled.");
  }
}

async function main() {
  const identifiers = await listCorpusFiles();
  if (identifiers.length === 0) {
    log("No fetched documents found. Run fetch-archive-text.ts first.");
    process.exit(1);
  }

  console.log("\n=== Available Documents ===");
  identifiers.forEach((id, i) => console.log(`${i}: ${id}`));

  const choice = await ask("\nSelect document number: ");
  const idx = parseInt(choice);
  if (isNaN(idx) || idx < 0 || idx >= identifiers.length) {
    log("Invalid selection");
    process.exit(1);
  }

  await curateFromChunks(identifiers[idx]);
}

main().catch(async (err) => {
  console.error("[curate] Fatal:", err);
  await shutdownDatabase().catch(() => null);
  process.exit(1);
});