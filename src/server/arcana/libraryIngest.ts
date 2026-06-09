import { arcanaLlmComplete } from "./privacy";
import type { ArcanaCategory, ArcanaEntry } from "./types";
import { BANEFUL_METADATA, DEFAULT_PEACEFUL_META } from "./banefulMeta";
import {
  archiveQueryExcludeKabbalah,
  entryLooksKabbalistic,
  KABBALAH_DANGER_BANNER,
  MERLIAN_GENERAL_SEPARATION_RULE,
} from "./contentPolicy";
import type { IndexSource } from "./indexSourceTypes";
import { getArcanaDb } from "./arcanaDb";

type ArchiveDoc = {
  identifier: string;
  title: string;
  creator?: string;
  description?: string;
  year?: string;
};

function isComprehensiveIndex() {
  return process.env.ARCANA_COMPREHENSIVE_INDEX?.trim().toLowerCase() === "true";
}

function ingestBudget() {
  return Number(process.env.ARCANA_INGEST_MAX ?? (isComprehensiveIndex() ? 32 : 8));
}

function docsPerQuery() {
  return Number(process.env.ARCANA_INGEST_DOCS ?? (isComprehensiveIndex() ? 10 : 6));
}

export async function fetchInternetArchiveDocs(
  query: string,
  limit = 5,
  page = 1,
  options?: { includeKabbalah?: boolean },
): Promise<ArchiveDoc[]> {
  const url = new URL("https://archive.org/advancedsearch.php");
  const q = options?.includeKabbalah ? query : archiveQueryExcludeKabbalah(query);
  url.searchParams.set("q", q);
  url.searchParams.set("fl[]", "identifier");
  url.searchParams.append("fl[]", "title");
  url.searchParams.append("fl[]", "creator");
  url.searchParams.append("fl[]", "description");
  url.searchParams.append("fl[]", "year");
  url.searchParams.set("sort[]", "downloads desc");
  url.searchParams.set("rows", String(limit));
  url.searchParams.set("page", String(Math.max(1, page)));
  url.searchParams.set("output", "json");

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) return [];
  const body = (await res.json()) as {
    response?: { docs?: Array<Record<string, unknown>> };
  };
  const docs = body.response?.docs ?? [];
  return docs.map((d) => ({
    identifier: String(d.identifier ?? ""),
    title: String(Array.isArray(d.title) ? d.title[0] : d.title ?? "Untitled"),
    creator: Array.isArray(d.creator) ? String(d.creator[0]) : d.creator ? String(d.creator) : undefined,
    description: Array.isArray(d.description) ? String(d.description[0]) : d.description ? String(d.description) : undefined,
    year: d.year ? String(d.year) : undefined,
  }));
}

function slugId(prefix: string, identifier: string) {
  return `${prefix}_${identifier.replace(/[^a-z0-9]/gi, "_").slice(0, 48).toLowerCase()}`;
}

function inferBaneful(text: string, traditions: string[]): boolean {
  const lower = text.toLowerCase();
  const banefulTerms = [
    "curse",
    "death spell",
    "binding enemy",
    "black magic",
    "grand grimoire",
    "malefic",
    "hot foot",
    "defixio",
    "necromancy",
  ];
  return banefulTerms.some((t) => lower.includes(t)) || traditions.some((t) => /black|baneful|petro/i.test(t));
}

function inferCategory(traditions: string[], title: string, isBaneful: boolean): ArcanaCategory {
  const t = `${traditions.join(" ")} ${title}`.toLowerCase();
  if (isBaneful) return t.includes("black") ? "black_magic" : "baneful";
  if (t.includes("wicca")) return "white_magic";
  if (t.includes("chaos")) return "chaos";
  if (t.includes("hoodoo") || t.includes("conjure")) return "hoodoo";
  if (t.includes("vodou") || t.includes("voodoo") || t.includes("haitian")) return "vodou";
  if (t.includes("santer") || t.includes("lucumi") || t.includes("orisha") || t.includes("candomble") || t.includes("umbanda") || t.includes("macumba")) return "vodou";
  if (t.includes("palo") || t.includes("kimbisa")) return "hoodoo";
  if (t.includes("shaman") || t.includes("norse") || t.includes("galdr") || t.includes("seidr") || t.includes("celtic") || t.includes("druid") || t.includes("slavic") || t.includes("thai") || t.includes("filipino") || t.includes("korean") || t.includes("indigenous") || t.includes("native ") || t.includes("hawaiian")) return "shamanic";
  if (t.includes("tibetan") || t.includes("vajrayana") || t.includes("bon")) return "energy_work";
  if (t.includes("curandero") || t.includes("brujeria")) return "hoodoo";
  if (t.includes("luciferian") || t.includes("satanic") || t.includes("left hand")) return "black_magic";
  if (t.includes("alchemy") || t.includes("talisman") || t.includes("geomancy") || t.includes("tarot")) return "planetary";
  if (t.includes("spiritualism") || t.includes("mediumship") || t.includes("psychic")) return "necromantic";
  if (t.includes("theosoph") || t.includes("anthroposoph")) return "hermetic";
  if (t.includes("arab") || t.includes("islam") || t.includes("picatrix") || t.includes("sufi")) return "arabic";
  if (t.includes("sex") || t.includes("thelema") || t.includes("crowley")) return "red_magic";
  if (t.includes("vampir")) return "energy_work";
  if (t.includes("verbal") || t.includes("incant")) return "manifestation";
  if (t.includes("necro")) return "necromantic";
  if (t.includes("planetary") || t.includes("agrippa")) return "planetary";
  if (t.includes("kabbal") || t.includes("qabalah") || t.includes("gematria")) return "kabbalistic";
  if (t.includes("indian") || t.includes("vedic") || t.includes("yoga") || t.includes("ayurveda") || t.includes("jyotish") || t.includes("sanskrit")) return "indian";
  if (t.includes("chinese") || t.includes("taoist") || t.includes("daoist") || t.includes("qigong") || t.includes("feng shui") || t.includes("i ching")) return "chinese";
  if (t.includes("japanese") || t.includes("zen") || t.includes("shinto") || t.includes("nembutsu") || t.includes("aikido")) return "japanese";
  return "hermetic";
}

export async function buildEntryFromArchiveDoc(
  source: IndexSource,
  doc: ArchiveDoc,
  existing?: ArcanaEntry,
  options?: { vaultLane?: boolean },
): Promise<ArcanaEntry | null> {
  if (!doc.identifier) return null;

  const rawContext = [
    `Title: ${doc.title}`,
    doc.creator ? `Author: ${doc.creator}` : "",
    doc.year ? `Year: ${doc.year}` : "",
    doc.description ? `Description: ${doc.description.slice(0, 2000)}` : "",
    `Archive: https://archive.org/details/${doc.identifier}`,
    `Indexing source: ${source.name} (${source.institution})`,
    `Traditions: ${source.traditions.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const liveIndex = process.env.ARCANA_LIVE_INDEX === "true";
  let structured: {
    title: string;
    tradition: string;
    summary: string;
    previewText: string;
    fullText: string;
    intentTags: string[];
    originalLanguage?: string;
  };

  const vaultLane = options?.vaultLane === true;

  if (liveIndex) {
    try {
      const llmOut = await arcanaLlmComplete({
        messages: [
          {
            role: "system",
            content: vaultLane
              ? `You are Merlian's Kabbalah Vault librarian. Extract ONE Kabbalistic operative practice from archive metadata.
Always output in clear modern ENGLISH. This material is tagged HIGHEST DANGER CLASS.

${KABBALAH_DANGER_BANNER}

If this document is NOT primarily Kabbalistic, respond with JSON: {"reject": true, "reason": "not_kabbalistic"}

Otherwise output valid JSON only.`
              : `You are Merlian's esoteric librarian indexing ALL known magical traditions available online.
Extract or reconstruct ONE operative spell, ritual, meditation, or folk practice from this archive metadata.
Always output in clear modern ENGLISH. If the source is Arabic, Latin, Greek, French, Sanskrit (IAST + Devanāgarī), Chinese (汉字 + Pinyin), Japanese (kanji + Hepburn), or any other language, TRANSLATE using named scholarly sources — never invent original-language text.

${MERLIAN_GENERAL_SEPARATION_RULE}

If this document is primarily Kabbalistic, respond with JSON: {"reject": true, "reason": "kabbalistic_vault"}

Otherwise output valid JSON only.`,
          },
          {
            role: "user",
            content: `${rawContext}

Return JSON:
{
  "title": "",
  "tradition": "",
  "originalLanguage": "",
  "summary": "",
  "previewText": "",
  "fullText": "# Title\\n\\n## Source & Translation\\n...\\n## Verbal Component\\n...\\n## Steps\\n...",
  "intentTags": ["tag1","tag2"]
}`,
          },
        ],
        performance: { num_predict: 1800, temperature: 0.4 },
      });
      const jsonMatch = llmOut.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]!) as { reject?: boolean; reason?: string } & typeof structured;
      if (parsed.reject) return null;
      if (vaultLane && !entryLooksKabbalistic({ title: parsed.title, tradition: parsed.tradition, summary: parsed.summary, fullText: parsed.fullText, intentTags: parsed.intentTags })) {
        return null;
      }
      structured = parsed;
    } catch {
      return null;
    }
  } else {
    structured = {
      title: doc.title,
      tradition: source.traditions[0] ?? "Esoteric archive",
      summary: doc.description?.slice(0, 280) ?? `Indexed from ${source.name}. Full translation available on unlock.`,
      previewText: `Archive record from ${source.institution}. Merlian will translate and expand on next live index pass.`,
      fullText: `# ${doc.title}\n\n## Archive source\n${rawContext}\n\n## Status\nEntry catalogued. Set ARCANA_LIVE_INDEX=true with Ollama running for automatic English translation and spell extraction.`,
      intentTags: [...source.traditions.slice(0, 2), "archive", "indexed"],
    };
  }

  const kabbalistic = vaultLane || entryLooksKabbalistic({
    title: structured.title,
    tradition: structured.tradition,
    summary: structured.summary,
    fullText: structured.fullText,
    intentTags: structured.intentTags,
  });

  if (!vaultLane && kabbalistic) return null;
  if (vaultLane && !kabbalistic) return null;

  const isBaneful = inferBaneful(`${structured.title} ${structured.fullText}`, source.traditions);
  const category = kabbalistic ? "kabbalistic" : inferCategory(source.traditions, structured.title, isBaneful);
  const meta = isBaneful
    ? (BANEFUL_METADATA[existing?.id ?? ""] ?? DEFAULT_PEACEFUL_META)
    : DEFAULT_PEACEFUL_META;
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? slugId("arc_ia", doc.identifier),
    title: structured.title,
    tradition: structured.tradition,
    category,
    intentTags: structured.intentTags,
    summary: structured.summary,
    previewText: structured.previewText,
    fullText: structured.fullText,
    source: {
      title: doc.title,
      author: doc.creator,
      year: doc.year,
      institution: source.institution,
      url: `https://archive.org/details/${doc.identifier}`,
      pdfRef: doc.identifier,
    },
    isBaneful,
    isKabbalistic: kabbalistic,
    backlashText: kabbalistic
      ? KABBALAH_DANGER_BANNER
      : isBaneful
        ? meta.backlashText || "Historical baneful material — see tradition warnings in full text."
        : "",
    alternativesText: isBaneful ? meta.alternativesText || "Consider reversal, cleansing, and defensive work first." : "",
    planetaryTiming: meta.planetaryTiming,
    createdAt: existing?.createdAt ?? now,
    indexedAt: now,
  };
}

async function ingestRoundRobin(args: {
  sources: IndexSource[];
  existingIds: Set<string>;
  cursorKey: string;
  vaultLane: boolean;
  idPrefix: string;
  kabbalahFilter: "exclude" | "only";
}): Promise<{ entries: ArcanaEntry[]; docsScanned: number; sourcesTouched: number }> {
  const db = getArcanaDb();
  const maxIngest = ingestBudget();
  const perQuery = docsPerQuery();
  const sorted = [...args.sources].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const n = sorted.length;
  if (n === 0) return { entries: [], docsScanned: 0, sourcesTouched: 0 };

  let cursor = Number((await db.getMeta(args.cursorKey)) ?? 0) % n;
  const entries: ArcanaEntry[] = [];
  let ingested = 0;
  let docsScanned = 0;
  let sourcesTouched = 0;

  for (let step = 0; step < n && ingested < maxIngest; step++) {
    const source = sorted[(cursor + step) % n]!;
    if (!source.archiveQuery) continue;

    const pageKey = `index_page:${args.idPrefix}:${source.id}`;
    const page = Math.max(1, Number((await db.getMeta(pageKey)) ?? 1));
    const docs = await fetchInternetArchiveDocs(source.archiveQuery, perQuery, page, {
      includeKabbalah: args.vaultLane,
    });
    docsScanned += docs.length;

    if (docs.length === 0) {
      await db.setMeta(pageKey, "1");
      continue;
    }

    let touched = false;
    for (const doc of docs) {
      if (ingested >= maxIngest) break;

      const kabbalisticDoc = entryLooksKabbalistic({
        title: doc.title,
        tradition: source.traditions.join(", "),
        summary: doc.description ?? "",
      });
      if (args.kabbalahFilter === "exclude" && kabbalisticDoc) continue;
      if (args.kabbalahFilter === "only" && !kabbalisticDoc) continue;

      const id = slugId(args.idPrefix, doc.identifier);
      if (args.existingIds.has(id)) continue;

      const entry = await buildEntryFromArchiveDoc(source, doc, undefined, { vaultLane: args.vaultLane });
      if (!entry) continue;

      entries.push(args.vaultLane ? { ...entry, id } : entry);
      args.existingIds.add(entry.id);
      ingested += 1;
      touched = true;
    }

    if (touched || docs.length > 0) {
      await db.setMeta(pageKey, String(docs.length < perQuery ? 1 : page + 1));
      sourcesTouched += 1;
    }
  }

  await db.setMeta(args.cursorKey, String((cursor + Math.max(sourcesTouched, 1)) % n));
  return { entries, docsScanned, sourcesTouched };
}

export async function ingestFromSources(
  sources: IndexSource[],
  existingIds: Set<string>,
): Promise<{ entries: ArcanaEntry[]; docsScanned: number; sourcesTouched: number }> {
  return ingestRoundRobin({
    sources,
    existingIds,
    cursorKey: "index_source_cursor_general",
    vaultLane: false,
    idPrefix: "arc_ia",
    kabbalahFilter: "exclude",
  });
}

export async function ingestKabbalahFromSources(
  sources: IndexSource[],
  existingIds: Set<string>,
): Promise<{ entries: ArcanaEntry[]; docsScanned: number; sourcesTouched: number }> {
  return ingestRoundRobin({
    sources,
    existingIds,
    cursorKey: "index_source_cursor_kabbalah",
    vaultLane: true,
    idPrefix: "arc_kab_ia",
    kabbalahFilter: "only",
  });
}
