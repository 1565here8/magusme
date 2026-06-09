import { getArcanaDb } from "./arcanaDb";
import {
  ARCANA_ACADEMIC_DISCLAIMER,
  ARCANA_CURIO_FOOTER_SHORT,
  ARCANA_SPELL_FOOTER,
} from "./disclaimers";
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
import { formatEntriesForLlm, searchArcanaEntries } from "./search";
import { isKabbalisticContent, MERLIAN_GENERAL_SEPARATION_RULE } from "./contentPolicy";
import type {
  ArcanaConsultationResult,
  ArcanaEntry,
  ArcanaEntryPreview,
  ArcanaSpellDetailResult,
} from "./types";
import type { ID } from "../db/models";
import {
  appendPersonalization,
  buildOracleConsultBundle,
  ORACLE_CONSULT_RULE,
  personalizationSystemAddon,
  type MerlianPersonalProfileInput,
  type PersonalizationBundle,
} from "./readings/personalization";

export const ARCANA_SYSTEM_PROMPT = `You are Merlian — the complete esoteric archive oracle indexing **all magical traditions known to humanity that exist online**: every grimoire, folk practice, shamanic rite, diaspora tradition, meditation system, and historical curio in Internet Archive, Sacred Texts, Gutenberg, Yale Beinecke, Gallica, Wellcome, and global ethnographic corpora.

You know: Solomonic, Goetia, Enochian, Agrippa, PGM, Arabic (Picatrix, Shams al-Ma'arif), hoodoo, vodou, santería, palo, candomblé, Ifá, shamanic/indigenous (ethnographic), Wicca, chaos, Thelema, LHP, vampiric, verbal magic, necromancy, black grimoires, NLP, EFT, positive psychology (PERMA, CBT, ACT), affirmations, visualization, journaling, self-hypnosis, manifestation (Neville, Hill, Wattles, Coué), Stoic & pragmatic philosophy, Indian (Vedic, yoga, tantra, Jyotish), Chinese (taoist, qigong, I Ching, feng shui), Japanese (zen, shinto, ki), Tibetan, Thai, Filipino, Korean, Celtic, Norse, Slavic, Mesopotamian, Egyptian, Zoroastrian, Christian folk, powwow, cunning folk, spiritualism, alchemy, tarot, geomancy — and every other tradition in the corpus.

${MERLIAN_GENERAL_SEPARATION_RULE}

**Translation policy:** Always give **original script or authentic romanization** plus verified English from named scholarly sources. Never invent mantras or characters. Mark uncertain readings as "variant translation."

**Language:** Always respond in clear modern ENGLISH. When citing sources originally in Arabic, Latin, Greek, or French, provide English translation with transliteration of key divine names or words of power when needed for angelic/Solomonic rites.

**Library role:** You draw from Yale Beinecke manuscripts, Internet Archive grimoires, PGM, Gallica, and continuously indexed material. Cite institution/source when referencing corpus entries.

**Consultation flow (always follow this order):**
1. **Magical Warnings** — real backlash documented in tradition: rebound, spirit retaliation, karma, legal risk, obsession
2. **Non-Harmful Paths That Work** — lead with these. For hostile magic sent against the client: reversal, mirror return, cleansing, cord-cutting, binding the attack back — NOT killing the enemy
3. **Only if they still want harm** — mention that historical baneful rites exist in the corpus, but do NOT write the full violent procedure in the free consultation. Say they can unlock the tradition document (curio) if they insist

Never tell someone to kill a specific person. For violent historical material (when explicitly requested after unlock), frame as: "According to [tradition/source], the documented method for directing harm toward an adversary involved…" — always third-person historical voice.

Every baneful deliverable MUST include a **Protection You Must Cast First** section before any harm work (circle, LBRP, shield, or tradition-specific guard) so the operator does not get hurt — this is mandatory in the text.

Write spells in clear modern steps anyone can read, with traceable roots cited inline. Be concise but complete.`;

const VIOLENT_PATH_PROMPT = `The reader explicitly chose the TRADITION DOCUMENT (curio) path for entertainment/folklore study.

Write in direct, satisfying modern language — the reader wants to understand what the tradition says — but stay in **historical citation voice**:
- "According to [Tradition], as recorded in [Source]…"
- "Practitioners in this lineage historically used…"
- Never: "Go kill your enemy" — instead: "The documented way this tradition directed harm at an adversary was…"

Required sections (use these exact headings):
## What the Tradition Says
## Magical Warnings & Backlash (from sources)
## Protection You Must Cast First (mandatory — circle, shield, or banishing before ANY harm step)
## When to Do It (planetary day, hour, moon phase — be specific)
## What You Need (simple shopping list)
## Step by Step (numbered, modern plain English, traceable to source)
## How to Close & Shield Yourself After
## Primary Source

End the body with: "${ARCANA_CURIO_FOOTER_SHORT}"`;

function buildConsultUserPrompt(query: string, corpusBlock: string) {
  return `Client says:\n"${query}"\n\nVerified corpus:\n${corpusBlock}\n\nStructure EXACTLY:

## Your Natal Chart Reading
(Interpret the querent's birth chart — or current sky data if natal is partial — specifically for THIS question. Name sun, moon, rising, chart ruler, numerology, and timing themes.)

## Your Tarot Reading
(Interpret the three tarot cards drawn for this session — soul pattern, present energy, spell path — for THIS question.)

## Spells Chosen For You
(2–4 corpus spells that best match chart + tarot + question. Name each entry and explain why it fits THIS person.)

## Magical Warnings
(Real tradition-backed risks if they pursue harm — rebound, legal, spiritual)

## Non-Harmful Paths That Work
(Practical steps using the chosen spells. Protection, blessing, reversal, cleansing as appropriate.)

## If You Still Want the Historical Harm Rite
(Brief note only — do NOT write the full baneful procedure here. Say which corpus entries document what each tradition says, and that unlocking shows the tradition text for curio/entertainment.)

## Summary

End with: RECOMMENDED_IDS: id1, id2, id3 (best spell matches FIRST from chart/tarot fit, baneful ids LAST)`;
}

function consultMessages(query: string, corpusBlock: string, personalization: PersonalizationBundle) {
  const system = `${ARCANA_SYSTEM_PROMPT}\n\n${ORACLE_CONSULT_RULE}${personalizationSystemAddon(personalization)}`;
  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: appendPersonalization(buildConsultUserPrompt(query, corpusBlock), personalization) },
  ];
}

async function finalizeConsultation(args: {
  userId: ID;
  query: string;
  analysis: string;
  matches: ArcanaEntry[];
  allEntries: ArcanaEntry[];
  personalization: PersonalizationBundle;
}): Promise<ArcanaConsultationResult> {
  const db = getArcanaDb();
  const recommendedIds = extractRecommendedIds(args.analysis, args.matches, args.allEntries);
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

  return {
    consultationId,
    query: args.query,
    analysis: args.analysis,
    personalReading: {
      astroSummary: args.personalization.astroSummary,
      tarotAnchor:
        args.personalization.tarotAnchor?.map((c) => ({
          name: c.name,
          reversed: c.reversed,
          position: c.position,
          meaning: c.reversed ? c.reversedMeaning : c.upright,
        })) ?? [],
    },
    peacefulOptions: previews.filter((p) => !p.isBaneful),
    historicalBanefulOptions: previews.filter((p) => p.isBaneful),
    recommendations: previews,
    disclaimer: ARCANA_ACADEMIC_DISCLAIMER,
    privacy: getArcanaPrivacyManifest(),
    pricing: {
      spellCents: arcanaSpellPriceCents(),
      sourceCents: arcanaSourcePriceCents(),
      planCents: arcanaPlanPriceCents(),
    },
  };
}

export async function* streamArcanaConsultation(args: {
  userId: ID;
  query: string;
  personalProfile?: MerlianPersonalProfileInput;
  signal?: AbortSignal;
}): AsyncGenerator<
  { type: "chunk"; text: string } | { type: "done"; result: ArcanaConsultationResult }
> {
  const db = getArcanaDb();
  const allEntries = await db.listGeneralEntries();
  const matches = searchArcanaEntries(allEntries, args.query, 10);
  const corpusBlock = formatEntriesForLlm(matches.length > 0 ? matches : allEntries.slice(0, 10));
  const personalization = buildOracleConsultBundle(args.personalProfile ?? {});

  let analysis = "";
  try {
    for await (const chunk of arcanaLlmStream({
      messages: consultMessages(args.query, corpusBlock, personalization),
      controllerSignal: args.signal,
    })) {
      analysis += chunk;
      yield { type: "chunk", text: chunk };
    }
  } catch {
    analysis = buildFallbackAnalysis(args.query, matches.length > 0 ? matches : allEntries.slice(0, 4));
    yield { type: "chunk", text: analysis };
  }

  const result = await finalizeConsultation({
    userId: args.userId,
    query: args.query,
    analysis,
    matches,
    allEntries,
    personalization,
  });
  yield { type: "done", result };
}

export async function runArcanaConsultation(args: {
  userId: ID;
  query: string;
  personalProfile?: MerlianPersonalProfileInput;
  signal?: AbortSignal;
}): Promise<ArcanaConsultationResult> {
  const db = getArcanaDb();
  const allEntries = await db.listGeneralEntries();
  const matches = searchArcanaEntries(allEntries, args.query, 10);
  const corpusBlock = formatEntriesForLlm(matches.length > 0 ? matches : allEntries.slice(0, 10));
  const personalization = buildOracleConsultBundle(args.personalProfile ?? {});

  let analysis: string;
  try {
    analysis = await arcanaLlmComplete({
      messages: consultMessages(args.query, corpusBlock, personalization),
      controllerSignal: args.signal,
    });
  } catch {
    analysis = buildFallbackAnalysis(args.query, matches.length > 0 ? matches : allEntries.slice(0, 4));
  }

  return finalizeConsultation({
    userId: args.userId,
    query: args.query,
    analysis,
    matches,
    allEntries,
    personalization,
  });
}

export async function generateSpellDetail(args: {
  userId: ID;
  entryId: string;
  pathChoice: "peaceful" | "violent";
  consultationId?: string;
  signal?: AbortSignal;
}): Promise<ArcanaSpellDetailResult> {
  const db = getArcanaDb();
  const entry = await db.getEntry(args.entryId);
  if (!entry) throw new Error("Entry not found.");

  const hasSpell = await db.userHasPurchase(args.userId, args.entryId, "spell");
  if (!hasSpell) throw new Error("Unlock this spell before requesting full detail.");

  let consultationQuery = "";
  if (args.consultationId) {
    const c = await db.getConsultation(args.consultationId);
    if (c && c.userId === args.userId) consultationQuery = c.query;
  }

  const backlash = entry.backlashText || "Tradition texts warn of rebound if protection is skipped.";
  const alternatives = entry.alternativesText || "See reversal and mirror-return entries in the corpus.";
  const timing = entry.planetaryTiming;

  if (args.pathChoice === "peaceful") {
    const content = await buildPeacefulPathContent(entry, alternatives, consultationQuery, args.signal);
    return wrapDetail("peaceful", content, backlash, alternatives, timing);
  }

  let content: string;
  try {
    content = await arcanaLlmComplete({
      messages: [
        { role: "system", content: `${ARCANA_SYSTEM_PROMPT}\n\n${VIOLENT_PATH_PROMPT}` },
        {
          role: "user",
          content: `Client originally asked: "${consultationQuery || "General curio study"}"

Tradition entry: ${entry.title}
Lineage: ${entry.tradition}
Source: ${entry.source.title}${entry.source.author ? ` by ${entry.source.author}` : ""}${entry.source.year ? ` (${entry.source.year})` : ""}
Institution/archive: ${entry.source.institution ?? "See source citation"}

Archival text:
${entry.fullText}

Documented backlash: ${backlash}
Planetary timing from corpus: ${timing}

Write the full tradition document in modern easy language. Cite the source throughout. Include mandatory protection-before-harm section.`,
        },
      ],
      controllerSignal: args.signal,
    });
  } catch {
    content = buildViolentFallbackContent(entry, timing);
  }

  return wrapDetail("violent", content, backlash, alternatives, timing);
}

function wrapDetail(
  pathChoice: "peaceful" | "violent",
  content: string,
  backlash: string,
  alternatives: string,
  timing: string,
): ArcanaSpellDetailResult {
  return {
    pathChoice,
    content: `${content}\n\n${ARCANA_SPELL_FOOTER}`,
    backlash,
    alternatives,
    planetaryTiming: timing,
    disclaimer: ARCANA_ACADEMIC_DISCLAIMER,
    spellFooter: ARCANA_SPELL_FOOTER,
  };
}

export async function generateArcanaPlan(args: {
  userId: ID;
  consultationId: string;
  signal?: AbortSignal;
}): Promise<string> {
  const db = getArcanaDb();
  const consultation = await db.getConsultation(args.consultationId);
  if (!consultation || consultation.userId !== args.userId) {
    throw new Error("Consultation not found.");
  }

  const entries = await db.getEntriesByIds(consultation.recommendedEntryIds);
  const corpusDetail = entries
    .map(
      (e) =>
        `## ${e.title} (${e.tradition})\nBacklash: ${e.backlashText}\nAlternatives: ${e.alternativesText}\n${e.fullText}`,
    )
    .join("\n\n---\n\n");

  const prompt = `Client situation: ${consultation.query}

Prior reading:
${consultation.responsePreview}

Corpus:
${corpusDetail}

Write a multi-week plan in modern English. START with reversal/protection weeks before any optional baneful material. At every baneful step: warnings + protection-first + peaceful swap option. Cite traditions by name. Entertainment/curio framing.`;

  try {
    const plan = await arcanaLlmComplete({
      messages: [
        { role: "system", content: ARCANA_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      controllerSignal: args.signal,
    });
    return `${plan}\n\n${ARCANA_SPELL_FOOTER}`;
  } catch {
    return `# Your Plan\n\n## Week 1–2: Reversal & Shielding\nMirror return, LBRP daily, cord-cutting.\n\n## Week 3+: Optional tradition study\nUnlock corpus entries for curio only.\n\n${ARCANA_SPELL_FOOTER}`;
  }
}

async function buildPeacefulPathContent(
  entry: ArcanaEntry,
  alternatives: string,
  situation: string,
  signal?: AbortSignal,
): Promise<string> {
  try {
    return await arcanaLlmComplete({
      messages: [
        { role: "system", content: ARCANA_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Client chose the NON-HARMFUL path. Situation: "${situation || "General"}"

Primary peaceful entry: ${entry.title} (${entry.tradition})
Archival basis: ${entry.fullText}

Alternatives from corpus: ${alternatives}

Write a clear modern action plan — reversal, protection, cleansing — NO harm toward any person. Cite traditions. Include planetary timing if relevant. Sections: ## What to Do First, ## Step by Step, ## Why This Works Without Violence`,
        },
      ],
      controllerSignal: signal,
    });
  } catch {
    return `# Non-Harmful Path\n\n## Your situation\n${situation}\n\n## Recommended\n${alternatives}\n\n## Steps\n1. Daily LBRP or cleansing for 7 days\n2. Mirror return or cord-cutting per corpus\n3. Journal and reassess — no harm rites needed\n\n${entry.fullText}`;
  }
}

function buildViolentFallbackContent(entry: ArcanaEntry, timing: string): string {
  return `# According to ${entry.tradition}

*As recorded in ${entry.source.title} — entertainment/curio reproduction.*

## What the Tradition Says
Historical practitioners in this lineage documented methods for directing harm at an adversary. The archival procedure follows.

## Magical Warnings & Backlash
${entry.backlashText}

## Protection You Must Cast First
Before any harm step: perform LBRP or your tradition's circle and banishing. ${entry.tradition} texts insist the operator remain shielded or risk rebound.

## When to Do It
${timing}

## Step by Step
${entry.fullText}

## How to Close & Shield Yourself After
Banish, cleanse tools, salt bath, close circle. Do not skip this.`;
}

function extractRecommendedIds(
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
    const valid = ids.filter((id) => allEntries.some((e) => e.id === id && !e.isKabbalistic));
    if (valid.length > 0) {
      const peaceful = valid.filter((id) => !allEntries.find((e) => e.id === id)?.isBaneful);
      const baneful = valid.filter((id) => allEntries.find((e) => e.id === id)?.isBaneful);
      return [...peaceful, ...baneful].slice(0, 5);
    }
  }

  const sorted = [...matches].sort((a, b) => Number(a.isBaneful) - Number(b.isBaneful));
  return sorted.slice(0, 4).map((e) => e.id);
}

function buildFallbackAnalysis(query: string, entries: ArcanaEntry[]): string {
  const peaceful = entries.filter((e) => !e.isBaneful);
  const baneful = entries.filter((e) => e.isBaneful);
  const q = query.toLowerCase();
  const hostile =
    q.includes("enemy") || q.includes("hostile") || q.includes("attack") || q.includes("sent magic");

  let text = "";
  if (isKabbalisticContent(query)) {
    text += `## Kabbalah Vault Required\n\nYour question involves **Kabbalistic magic** — classified on Merlian as **the most dangerous type of magic**, above baneful grimoires and necromancy. It is **completely separated** from this general oracle.\n\nScroll to the **Kabbalah Vault** section below, read the danger warning, and enter only if you accept full risk. Do **not** mix Kabbalistic work with other traditions in the same session.\n\n## General Alternatives\n\n`;
  }

  text += `## Magical Warnings\n`;
  text += hostile
    ? `Sending harm back or killing an enemy carries documented rebound in virtually every tradition — spirit retaliation, guilt loops, legal exposure, and amplified hostility. Most lineages warn the curse returns threefold if protection is not maintained.\n\n`
    : `Every operative tradition documents risk when intent is clouded by rage. Pause and shield before any work.\n\n`;

  text += `## Non-Harmful Paths That Work\n`;
  if (hostile) {
    text += `For hostile magic sent against you, **reversal and mirror return** are the classic answer — not death spells:\n\n`;
  }
  for (const e of peaceful.length ? peaceful : entries.filter((x) => !x.isBaneful).slice(0, 3)) {
    text += `- **${e.title}** (${e.tradition}) — ${e.summary}\n`;
  }
  text += `\nThese address your situation without directing lethal harm.\n\n`;

  if (baneful.length || entries.some((e) => e.isBaneful)) {
    text += `## If You Still Want the Historical Harm Rite\n`;
    text += `The corpus holds documented baneful rites for curio study only. Unlock to read what each tradition says — framed as folklore, not advice:\n\n`;
    for (const e of baneful.length ? baneful : entries.filter((x) => x.isBaneful)) {
      text += `- **${e.title}** — ${e.backlashText.slice(0, 120)}…\n`;
    }
  }

  const ids = [...(peaceful.length ? peaceful : entries.filter((x) => !x.isBaneful)), ...baneful].slice(0, 5);
  text += `\nRECOMMENDED_IDS: ${ids.map((e) => e.id).join(", ")}`;
  return text;
}
