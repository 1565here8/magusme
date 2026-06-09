import type { ArcanaEntry } from "./types";
import { filterGeneralCorpus, filterKabbalisticCorpus } from "./contentPolicy";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreEntry(entry: ArcanaEntry, queryTokens: string[]): number {
  const haystack = [
    entry.title,
    entry.tradition,
    entry.category,
    entry.summary,
    entry.previewText,
    ...entry.intentTags,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 2;
    for (const tag of entry.intentTags) {
      if (tag.toLowerCase().includes(token)) score += 3;
    }
  }

  const queryJoined = queryTokens.join(" ");
  if (entry.category.includes(queryJoined)) score += 5;
  if (queryJoined.includes("black") && entry.category === "black_magic") score += 8;
  if (queryJoined.includes("baneful") && entry.isBaneful) score += 8;
  if (queryJoined.includes("death") && entry.isBaneful) score += 6;
  if (queryJoined.includes("enemy") && entry.isBaneful) score += 5;
  if (queryJoined.includes("love") && entry.intentTags.some((t) => t.includes("love"))) score += 6;
  if (queryJoined.includes("protect") && entry.category === "defensive") score += 6;

  return score;
}

function rankEntries(entries: ArcanaEntry[], query: string, limit: number): ArcanaEntry[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return entries.slice(0, limit);

  return [...entries]
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}

/** General oracle — Kabbalistic entries never appear. */
export function searchArcanaEntries(entries: ArcanaEntry[], query: string, limit = 6): ArcanaEntry[] {
  return rankEntries(filterGeneralCorpus(entries), query, limit);
}

/** Kabbalah Vault oracle — only Kabbalistic entries. */
export function searchKabbalahEntries(entries: ArcanaEntry[], query: string, limit = 6): ArcanaEntry[] {
  return rankEntries(filterKabbalisticCorpus(entries), query, limit);
}

export function formatEntriesForLlm(entries: ArcanaEntry[]): string {
  return entries
    .map(
      (e, i) =>
        `[${i + 1}] id=${e.id} | ${e.title} (${e.tradition}, ${e.category}${e.isBaneful ? ", BANEFUL" : ""}${e.isKabbalistic ? ", KABBALISTIC VAULT" : ""})
Tags: ${e.intentTags.join(", ")}
Summary: ${e.summary}`,
    )
    .join("\n\n");
}
