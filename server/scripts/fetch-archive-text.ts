#!/usr/bin/env npx tsx
/**
 * Archive.org Full-Text Fetcher
 * Downloads and extracts text from archive.org documents for manual spell curation.
 * NO AI. Pure text extraction for human review.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "/Users/magusme/Desktop/magusme-archive-corpus";

function log(msg: string) {
  console.log(`[fetch-archive] ${msg}`);
}

function runCmd(cmd: string, args: string[]) {
  const result = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 100 * 1024 * 1024 });
  if (result.error) log(`Error: ${result.error.message}`);
  if (result.status !== 0) log(`Exit ${result.status}: ${result.stderr?.slice(0, 200)}`);
  return result;
}

async function fetchMetadata(identifier: string) {
  const url = `https://archive.org/metadata/${identifier}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`);
  return res.json();
}

async function listFiles(identifier: string): Promise<string[]> {
  const metadata = await fetchMetadata(identifier);
  const files = metadata.files || [];
  return files
    .filter((f: any) => f.name?.endsWith(".txt") || f.name?.endsWith(".djvu.txt") || f.name?.endsWith("_text.txt"))
    .map((f: any) => f.name);
}

async function downloadTextFile(identifier: string, filename: string): Promise<string> {
  const url = `https://archive.org/download/${identifier}/${filename}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${filename}: ${res.status}`);
  return res.text();
}

async function extractWithPdftotext(identifier: string): Promise<string> {
  const pdfUrl = `https://archive.org/download/${identifier}/${identifier}.pdf`;
  const tempPdf = join("/tmp", `${identifier}.pdf`);
  const tempTxt = join("/tmp", `${identifier}.txt`);

  log(`Downloading PDF...`);
  const dl = runCmd("curl", ["-sfL", "-o", tempPdf, pdfUrl]);
  if (dl.status !== 0 || !existsSync(tempPdf)) {
    throw new Error("PDF download failed");
  }

  log(`Extracting text with pdftotext...`);
  const extract = runCmd("pdftotext", ["-layout", tempPdf, tempTxt]);
  if (extract.status !== 0) {
    throw new Error("pdftotext failed");
  }

  const text = readFileSync(tempTxt, "utf8");
  runCmd("rm", ["-f", tempPdf, tempTxt]);
  return text;
}

async function fetchFullText(identifier: string): Promise<{ text: string; source: string }> {
  log(`Fetching full text for: ${identifier}`);

  const textFiles = await listFiles(identifier);
  if (textFiles.length > 0) {
    for (const file of textFiles) {
      try {
        const text = await downloadTextFile(identifier, file);
        if (text.length > 1000) {
          log(`Found text file: ${file} (${text.length} chars)`);
          return { text, source: `archive.org text file: ${file}` };
        }
      } catch (e) {
        log(`Failed to read ${file}: ${e}`);
      }
    }
  }

  try {
    const text = await extractWithPdftotext(identifier);
    if (text.length > 1000) {
      log(`Extracted from PDF (${text.length} chars)`);
      return { text, source: "archive.org PDF (pdftotext)" };
    }
  } catch (e) {
    log(`PDF extraction failed: ${e}`);
  }

  throw new Error("No usable text found for this identifier");
}

function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\x20-\x7E\n\t]/g, "")
    .replace(/\s+$/gm, "")
    .trim();
}

function chunkByHeadings(text: string): Array<{ heading: string; content: string }> {
  const lines = text.split("\n");
  const chunks: Array<{ heading: string; content: string }> = [];
  let currentHeading = "Document Start";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(Chapter|Section|Part|Book|Spell|Ritual|Incantation|Formula|Operation|Experiment)\s+[\dIVXLC]+/i) ||
      line.match(/^[A-Z][A-Z\s]{3,}$/); // ALL CAPS lines likely headings

    if (headingMatch && currentContent.length > 50) {
      chunks.push({ heading: currentHeading, content: currentContent.join("\n") });
      currentHeading = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentContent.length > 50) {
    chunks.push({ heading: currentHeading, content: currentContent.join("\n") });
  }
  return chunks;
}

async function main() {
  const identifier = process.argv[2];
  if (!identifier) {
    console.error("Usage: npx tsx server/scripts/fetch-archive-text.ts <archive.org-identifier>");
    console.error("Example: npx tsx server/scripts/fetch-archive-text.ts keyofsolomon00math");
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  try {
    const { text, source } = await fetchFullText(identifier);
    const cleaned = cleanText(text);
    const chunks = chunkByHeadings(cleaned);

    const outFile = join(OUT_DIR, `${identifier}-fulltext.txt`);
    writeFileSync(outFile, cleaned);
    log(`Saved full text: ${outFile} (${cleaned.length} chars)`);

    const chunksFile = join(OUT_DIR, `${identifier}-chunks.json`);
    writeFileSync(chunksFile, JSON.stringify(chunks, null, 2));
    log(`Saved ${chunks.length} chunks: ${chunksFile}`);

    console.log("\n=== FIRST 2000 CHARS ===");
    console.log(cleaned.slice(0, 2000));
    console.log("\n=== CHUNKS ===");
    chunks.forEach((c, i) => console.log(`${i}: ${c.heading.slice(0, 80)} (${c.content.length} chars)`));

  } catch (err) {
    log(`FATAL: ${err}`);
    process.exit(1);
  }
}

main();