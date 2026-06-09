import { getArcanaDb } from "./arcanaDb";
import { ARCANA_ACADEMIC_DISCLAIMER } from "./disclaimers";
import {
  arcanaLlmComplete,
  arcanaLlmStream,
  getArcanaPrivacyManifest,
  sanitizeConsultationForStorage,
} from "./privacy";
import {
  arcanaPlanPriceCents,
  arcanaSourcePriceCents,
  arcanaSpellPriceCents,
} from "./pricing";
import { formatEntriesForLlm, searchKabbalahEntries } from "./search";
import { KABBALAH_DANGER_BANNER, KABBALAH_VAULT_ORACLE_PROMPT } from "./contentPolicy";
import { buildOracleConsultBundle } from "./readings/personalization";
import type { ArcanaConsultationResult, ArcanaEntry, ArcanaEntryPreview } from "./types";
import type { ID } from "../db/models";

const KABBALAH_DISCLAIMER = `${KABBALAH_DANGER_BANNER}

---

${ARCANA_ACADEMIC_DISCLAIMER}`;

function buildKabbalahUserPrompt(query: string, corpusBlock: string) {
  return `Vault seeker says:\n"${query}"\n\nKabbalah Vault corpus (isolated — most dangerous class):\n${corpusBlock}\n\nStructure EXACTLY:

## ⚠️ Danger & Backlash (Kabbalistic)
(Psychosis risk, sephirothic imbalance, divine-name shock, identity dissolution — state this is MORE dangerous than baneful grimoire work)

## Safer Non-Kabbalistic Alternatives
(Redirect to general Merlian: angelic LBRP without Tree, hoodoo cleansing, planetary magic — urge exiting the vault)

## What the Vault Documents
(Historical/curio voice only — cite corpus entries)

## Summary

End with: RECOMMENDED_IDS: id1, id2 (vault entry ids only)`;
}

function kabbalahMessages(query: string, corpusBlock: string) {
  return [
    { role: "system" as const, content: KABBALAH_VAULT_ORACLE_PROMPT },
    { role: "user" as const, content: buildKabbalahUserPrompt(query, corpusBlock) },
  ];
}

async function finalizeKabbalahConsultation(args: {
  userId: ID;
  query: string;
  analysis: string;
  matches: ArcanaEntry[];
  allEntries: ArcanaEntry[];
}): Promise<ArcanaConsultationResult> {
  const db = getArcanaDb();
  const recommendedIds = extractKabbalahIds(args.analysis, args.matches, args.allEntries);
  const recommended = await db.getEntriesByIds(recommendedIds);

  const previews: ArcanaEntryPreview[] = await Promise.all(
    recommended.map(async (entry) => {
      const spell = await db.userHasPurchase(args.userId, entry.id, "spell");
      const source = await db.userHasPurchase(args.userId, entry.id, "source");
      return db.toPreview(entry, { spell, source });
    }),
  );

  const stored = sanitizeConsultationForStorage(args.query, args.analysis.slice(0, 4000));
  const consultationId = await db.saveConsultation({
    userId: args.userId,
    query: stored.query,
    responsePreview: stored.responsePreview,
    recommendedEntryIds: recommendedIds,
  });

  const personalization = buildOracleConsultBundle({});

  return {
    consultationId,
    query: args.query,
    analysis: args.analysis,
    personalReading: {
      astroSummary: personalization.astroSummary,
      tarotAnchor:
        personalization.tarotAnchor?.map((c) => ({
          name: c.name,
          reversed: c.reversed,
          position: c.position,
          meaning: c.reversed ? c.reversedMeaning : c.upright,
        })) ?? [],
    },
    peacefulOptions: previews.filter((p) => !p.isBaneful),
    historicalBanefulOptions: previews.filter((p) => p.isBaneful),
    recommendations: previews,
    disclaimer: KABBALAH_DISCLAIMER,
    privacy: getArcanaPrivacyManifest(),
    pricing: {
      spellCents: arcanaSpellPriceCents(),
      sourceCents: arcanaSourcePriceCents(),
      planCents: arcanaPlanPriceCents(),
    },
  };
}

export async function* streamKabbalahConsultation(args: {
  userId: ID;
  query: string;
  signal?: AbortSignal;
}): AsyncGenerator<
  { type: "chunk"; text: string } | { type: "done"; result: ArcanaConsultationResult }
> {
  const db = getArcanaDb();
  const allEntries = await db.listKabbalisticEntries();
  const matches = searchKabbalahEntries(allEntries, args.query, 10);
  const corpusBlock = formatEntriesForLlm(matches.length > 0 ? matches : allEntries.slice(0, 10));

  let analysis = "";
  try {
    for await (const chunk of arcanaLlmStream({
      messages: kabbalahMessages(args.query, corpusBlock),
      controllerSignal: args.signal,
    })) {
      analysis += chunk;
      yield { type: "chunk", text: chunk };
    }
  } catch {
    analysis = buildKabbalahFallback(args.query, matches.length > 0 ? matches : allEntries.slice(0, 4));
    yield { type: "chunk", text: analysis };
  }

  const result = await finalizeKabbalahConsultation({
    userId: args.userId,
    query: args.query,
    analysis,
    matches,
    allEntries,
  });
  yield { type: "done", result };
}

function extractKabbalahIds(
  analysis: string,
  matches: ArcanaEntry[],
  allEntries: ArcanaEntry[],
): string[] {
  const idMatch = analysis.match(/RECOMMENDED_IDS:\s*([^\n]+)/i);
  if (idMatch) {
    const ids = idMatch[1]
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("arc_"));
    const valid = ids.filter((id) => allEntries.some((e) => e.id === id && e.isKabbalistic));
    if (valid.length > 0) return valid.slice(0, 5);
  }
  return matches.slice(0, 4).map((e) => e.id);
}

function buildKabbalahFallback(query: string, entries: ArcanaEntry[]): string {
  let text = `## ⚠️ Danger & Backlash (Kabbalistic)\n\n${KABBALAH_DANGER_BANNER}\n\nKabbalistic operative work carries the **highest documented risk** on Merlian — including psychosis, obsessive fixation, and identity dissolution. This exceeds baneful grimoire danger in our classification.\n\n## Safer Non-Kabbalistic Alternatives\n\nExit the vault. Use general Merlian: angelic banishing (non-Tree LBRP), hoodoo cleansing, cord-cutting, or planetary magic without Sephiroth mapping.\n\n## What the Vault Documents\n\nRegarding: "${query}"\n\n`;
  for (const e of entries) {
    text += `- **${e.title}** (${e.tradition}) — ${e.summary}\n`;
  }
  text += `\nRECOMMENDED_IDS: ${entries.map((e) => e.id).join(", ")}`;
  return text;
}
