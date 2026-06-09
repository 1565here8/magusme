import { arcanaLlmStream, getArcanaPrivacyManifest } from "../privacy";
import { KABBALAH_DIVINATIONS, KABBALAH_VAULT_ORACLE_PROMPT, MERLIAN_GENERAL_SEPARATION_RULE, isKabbalahDivinationId } from "../contentPolicy";
import { getDivination } from "../divinationCatalog";
import { isManifestationCategory } from "../manifestationCatalogEntries";
import { computeNumerology, type NumerologyProfile } from "./numerology";
import {
  appendPersonalization,
  buildPersonalizationBundle,
  personalizationSystemAddon,
  type MerlianPersonalProfileInput,
  type PersonalizationBundle,
} from "./personalization";
import {
  castRunes,
  drawTarot,
  RUNE_CASTS,
  TAROT_SPREADS,
  type DrawnRune,
  type DrawnTarotCard,
} from "./deck";

export type { MerlianPersonalProfileInput, PersonalizationBundle };
export { buildPersonalizationBundle };

export type ReadingType = "tarot" | "rune" | "coffee" | "palm" | "face" | "numerology" | "generic";

export type ReadingMeta =
  | { type: "tarot"; cards: DrawnTarotCard[]; spread: string }
  | { type: "rune"; runes: DrawnRune[]; cast: string }
  | { type: "coffee" | "palm" | "face"; focus: string }
  | { type: "numerology"; profile: NumerologyProfile }
  | { type: "generic"; divinationId: string; label: string; focus?: string };

export type ReadingResult = {
  type: ReadingType;
  divinationId?: string;
  question: string;
  meta: ReadingMeta;
  reading: string;
  disclaimer: string;
  privacy: ReturnType<typeof getArcanaPrivacyManifest>;
};

const FREE_DISCLAIMER =
  "For entertainment and self-reflection only — not medical, legal, or financial advice. Merlian denies liability for decisions made from this reading.";

const SYSTEM_BASE = `You are Merlian — a warm, precise esoteric reader. Write in clear modern English with poetic touches. Be specific to the symbols drawn or described. Structure with markdown headings. Keep readings substantive but readable (400–800 words unless a single-card draw). Always note this is for entertainment and self-reflection.

${MERLIAN_GENERAL_SEPARATION_RULE}

Do NOT perform Gematria, Tree of Life, or Practical Kabbalah readings here — direct users to the Kabbalah Vault.

**Indian / Chinese / Japanese readings:** Include original terms (Devanāgarī / 汉字 / かな where appropriate), standard romanization (IAST / Pinyin / Hepburn), and English from scholarly translations. Cite the tradition by name.`;

const MANIFESTATION_ENCYCLOPEDIA_SYSTEM = `You are Merlian — master guide to the global manifestation encyclopedia. You teach authentic techniques from:
- Affirmations (Coué, Neville, I AM, sankalpa, mirror work)
- Visualization (creative visualization, mental rehearsal, cinema of the mind)
- Manifestation (Law of Attraction, Law of Assumption, Napoleon Hill, Wattles, chaos sigils)
- Journaling (morning pages, future self, gratitude, scripting, bullet journal)
- Self-hypnosis (Elman, progressive relaxation, countdown, staircase)
- Meditation (vipassana, TM-style mantra, body scan)
- NLP (swish, anchoring, six-step reframe, timeline therapy)
- EFT tapping (basic recipe, manifestation blocks, positive rounds)
- Positive psychology (PERMA, flow, VIA strengths, best possible self, CBT, ACT)
- Philosophy (Stoicism, William James, Epictetus, Emerson, Taoist wu wei, Hermetic Kybalion principles — non-Kabbalistic)

Give step-by-step protocols the querent can use today. Cite tradition/source. Be warm, precise, actionable. 500–900 words.

${MERLIAN_GENERAL_SEPARATION_RULE}`;

function formatCards(cards: DrawnTarotCard[]) {
  return cards
    .map((c) => {
      const orient = c.reversed ? "Reversed" : "Upright";
      const pos = c.position ? `[${c.position}] ` : "";
      return `${pos}${c.name} (${orient}) — ${c.reversed ? c.reversedMeaning : c.upright}. Keywords: ${c.keywords}`;
    })
    .join("\n");
}

function formatRunes(runes: DrawnRune[]) {
  return runes
    .map((r) => {
      const orient = r.merkstave ? "Merkstave" : "Upright";
      const pos = r.position ? `[${r.position}] ` : "";
      return `${pos}${r.glyph} ${r.name} (${orient}) — ${r.meaning}. Magic: ${r.magical}`;
    })
    .join("\n");
}

function buildMessages(
  type: ReadingType,
  question: string,
  meta: ReadingMeta,
  personalization?: PersonalizationBundle | null,
): Array<{ role: "system" | "user"; content: string }> {
  const q = question.trim() || "General guidance for my path right now.";
  const pAddon = personalizationSystemAddon(personalization);

  if (type === "numerology" && meta.type === "numerology") {
    const p = meta.profile;
    return [
      {
        role: "system",
        content: `${SYSTEM_BASE}${pAddon}\n\nYou interpret Pythagorean-Chaldean numerology with magical timing suggestions.`,
      },
      {
        role: "user",
        content: appendPersonalization(
          `Question: "${q}"\n\nProfile:\nLife Path ${p.lifePath.number}: ${p.lifePath.label}\nExpression ${p.expression.number}\nSoul Urge ${p.soulUrge.number}\nPersonality ${p.personality.number}\nName: ${p.fullName}\nBirth: ${p.birthDate}\n\nSections: ## Core Numbers, ## Life Path Deep Dive, ## Name Magic & Verbal Affirmation, ## Timing & Personal Year hint, ## Practical Guidance`,
          personalization,
        ),
      },
    ];
  }

  if (type === "generic" && meta.type === "generic") {
    const div = getDivination(meta.divinationId);
    const isManifestation = div ? isManifestationCategory(div.category) : false;
    const system = isManifestation
      ? `${MANIFESTATION_ENCYCLOPEDIA_SYSTEM}${pAddon}\n\nYou are teaching: **${meta.label}** (${div?.tradition ?? "manifestation tradition"}).`
      : `${SYSTEM_BASE}${pAddon}\n\nYou perform ${meta.label} (${div?.tradition ?? "esoteric tradition"}). Follow authentic method structure for this oracle type.`;
    const userSections = isManifestation
      ? `Goal or question: "${q}"\n${meta.focus ? `Context:\n${meta.focus}\n` : ""}\nTeach the complete **${meta.label}** protocol tailored to this querent. Sections: ## What This Technique Is, ## Your Personalized Protocol (chart + culture + destination + growth), ## Step-by-Step Protocol, ## Daily Schedule, ## Affirmations/Scripts For You, ## Common Blocks & Fixes, ## 30-Day Practice Plan`
      : `Question: "${q}"\n${meta.focus ? `Details:\n${meta.focus}\n` : ""}\nPerform a complete ${meta.label} reading personalized to this querent. Sections: ## Method Used, ## Symbols & Signs, ## Answer to Question, ## Your Path (astro + tarot + culture), ## Timing, ## Growth Work, ## Optional follow-up (curio)`;
    return [
      { role: "system", content: system },
      { role: "user", content: appendPersonalization(userSections, personalization) },
    ];
  }

  if (type === "tarot" && meta.type === "tarot") {
    return [
      { role: "system", content: `${SYSTEM_BASE}${pAddon}\n\nYou interpret Tarot with traditional Rider-Waite symbolism.` },
      {
        role: "user",
        content: appendPersonalization(
          `Question: "${q}"\n\nSpread drawn:\n${formatCards(meta.cards)}\n\nGive a unified reading — how the cards speak to each other and to this querent's profile. Include practical magical timing if relevant (moon phase awareness, planetary day). Sections: ## Overview, ## Card by Card, ## Combined Message, ## Your Path (culture + destination + growth), ## Timing & Correspondence`,
          personalization,
        ),
      },
    ];
  }

  if (type === "rune" && meta.type === "rune") {
    return [
      {
        role: "system",
        content: `${SYSTEM_BASE}${pAddon}\n\nYou interpret Elder Futhark runes in Norse magical tradition. Mention bind-rune or galdr suggestions only as optional curio.`,
      },
      {
        role: "user",
        content: appendPersonalization(
          `Question: "${q}"\n\nRunes cast:\n${formatRunes(meta.runes)}\n\nSections: ## Overview, ## Rune by Rune, ## Combined Wyrd, ## Your Path, ## Rune Magic Notes (optional curio)`,
          personalization,
        ),
      },
    ];
  }

  if (type === "coffee" && meta.type === "coffee") {
    return [
      {
        role: "system",
        content: `${SYSTEM_BASE}${pAddon}\n\nYou read Turkish/Greek coffee cup (tasseography) patterns from the querent's description.`,
      },
      {
        role: "user",
        content: appendPersonalization(
          `Question: "${q}"\n\nCup patterns described:\n${meta.focus}\n\nSections: ## Symbols Seen, ## Near Future (rim), ## Heart of Matter (center), ## Settled Past (base), ## Overall Message, ## Your Path`,
          personalization,
        ),
      },
    ];
  }

  if (type === "palm" && meta.type === "palm") {
    return [
      {
        role: "system",
        content: `${SYSTEM_BASE}${pAddon}\n\nYou read palms (chiromancy) from the querent's line and mount description — classical Western palmistry.`,
      },
      {
        role: "user",
        content: appendPersonalization(
          `Question: "${q}"\n\nHand description:\n${meta.focus}\n\nSections: ## Hand Type & Element, ## Major Lines, ## Mounts & Marks, ## Life Themes, ## Timing on Lines, ## Growth Work`,
          personalization,
        ),
      },
    ];
  }

  if (type === "face" && meta.type === "face") {
    return [
      {
        role: "system",
        content: `${SYSTEM_BASE}${pAddon}\n\nYou read faces (physiognomy / Chinese face reading blend) from the querent's description — entertainment only.`,
      },
      {
        role: "user",
        content: appendPersonalization(
          `Question: "${q}"\n\nFace description:\n${meta.focus}\n\nSections: ## Overall Constitution, ## Forehead & Mind, ## Eyes & Heart, ## Nose & Will, ## Mouth & Destiny, ## Summary, ## Your Path`,
          personalization,
        ),
      },
    ];
  }

  throw new Error(`Unsupported reading type: ${type}`);
}

export function personalProfileFromBody(body: Record<string, unknown>): MerlianPersonalProfileInput {
  const num = (v: unknown) => (typeof v === "number" && !Number.isNaN(v) ? v : v != null && v !== "" ? Number(v) : undefined);
  return {
    fullName: typeof body.fullName === "string" ? body.fullName : undefined,
    birthDate: typeof body.birthDate === "string" ? body.birthDate : undefined,
    birthTime: typeof body.birthTime === "string" ? body.birthTime : undefined,
    lat: num(body.lat),
    lon: num(body.lon),
    culturalBackground: typeof body.culturalBackground === "string" ? body.culturalBackground : undefined,
    heritageCommunity: typeof body.heritageCommunity === "string" ? body.heritageCommunity : undefined,
    destinationPlace: typeof body.destinationPlace === "string" ? body.destinationPlace : undefined,
    growthAreas: typeof body.growthAreas === "string" ? body.growthAreas : undefined,
    includeTarotAnchor: body.includeTarotAnchor === false ? false : undefined,
  };
}

export function prepareReadingMeta(
  type: ReadingType,
  body: Record<string, unknown>,
): { question: string; meta: ReadingMeta } {
  const question = typeof body.question === "string" ? body.question : "";

  if (type === "tarot") {
    const spreadKey = (body.spread as keyof typeof TAROT_SPREADS) ?? "three";
    const spread = TAROT_SPREADS[spreadKey] ?? TAROT_SPREADS.three;
    const cards = drawTarot(spread.count, [...spread.positions]);
    return { question, meta: { type: "tarot", cards, spread: spreadKey } };
  }

  if (type === "rune") {
    const castKey = (body.cast as keyof typeof RUNE_CASTS) ?? "three";
    const cast = RUNE_CASTS[castKey] ?? RUNE_CASTS.three;
    const runes = castRunes(cast.count, [...cast.positions]);
    return { question, meta: { type: "rune", runes, cast: castKey } };
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!description) throw new Error("Please describe what you see (cup patterns, palm lines, or facial features).");

  if (type === "palm") {
    const hand = body.dominantHand === "left" ? "Left (receptive)" : "Right (active)";
    return {
      question,
      meta: { type: "palm", focus: `Dominant hand: ${hand}\n${description}` },
    };
  }

  if (type === "face") {
    return { question, meta: { type: "face", focus: description } };
  }

  if (type === "coffee") {
    return { question, meta: { type: "coffee", focus: description } };
  }

  throw new Error(`Unsupported reading type: ${type}`);
}

export function prepareDivinationReading(
  divinationId: string,
  body: Record<string, unknown>,
): { readingType: ReadingType; question: string; meta: ReadingMeta; divinationId: string } {
  if (isKabbalahDivinationId(divinationId)) {
    throw new Error(
      "This divination is Kabbalistic — the most dangerous type of magic on Merlian. Use the Kabbalah Vault section instead.",
    );
  }
  const div = getDivination(divinationId);
  if (!div) throw new Error("Unknown divination method.");

  if (div.mode === "tarot") {
    const r = prepareReadingMeta("tarot", body);
    return { readingType: "tarot", ...r, divinationId };
  }
  if (div.mode === "rune") {
    const r = prepareReadingMeta("rune", body);
    return { readingType: "rune", ...r, divinationId };
  }
  if (div.mode === "numerology") {
    const birthDate = typeof body.birthDate === "string" ? body.birthDate : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    if (!birthDate || !fullName) throw new Error("Birth date and full name required for numerology.");
    const profile = computeNumerology(birthDate, fullName);
    const question = typeof body.question === "string" ? body.question : "";
    return {
      readingType: "numerology",
      question,
      meta: { type: "numerology", profile },
      divinationId,
    };
  }
  if (div.mode === "describe") {
    if (divinationId === "palm" || divinationId === "face" || divinationId === "coffee") {
      const r = prepareReadingMeta(divinationId, body);
      return { readingType: divinationId, ...r, divinationId };
    }
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!description) throw new Error("Please describe what you see or experienced.");
    const question = typeof body.question === "string" ? body.question : "";
    return {
      readingType: "generic",
      question,
      meta: { type: "generic", divinationId, label: div.label, focus: description },
      divinationId,
    };
  }

  const question = typeof body.question === "string" ? body.question : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  return {
    readingType: "generic",
    question,
    meta: {
      type: "generic",
      divinationId,
      label: div.label,
      focus: description || undefined,
    },
    divinationId,
  };
}

export function prepareKabbalahDivinationReading(
  divinationId: string,
  body: Record<string, unknown>,
): { question: string; label: string; focus?: string } {
  const div = KABBALAH_DIVINATIONS.find((d) => d.id === divinationId);
  if (!div) throw new Error("Unknown Kabbalah Vault divination.");

  const question = typeof body.question === "string" ? body.question : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (div.mode === "describe" && !description) {
    throw new Error("Please describe letters, names, or patterns for this vault reading.");
  }
  return { question, label: div.label, focus: description || undefined };
}

export async function* streamKabbalahDivination(args: {
  divinationId: string;
  question: string;
  label: string;
  focus?: string;
  signal?: AbortSignal;
}): AsyncGenerator<
  | { type: "meta"; disclaimer: string }
  | { type: "chunk"; text: string }
  | { type: "done"; reading: string; disclaimer: string }
  | { type: "error"; message: string }
> {
  const disclaimer = `${KABBALAH_VAULT_ORACLE_PROMPT}\n\n---\n\nFor entertainment only. Kabbalistic magic is the most dangerous category on Merlian.`;
  yield { type: "meta", disclaimer };

  const userContent = args.focus
    ? `Vault divination: ${args.label}\nQuestion: "${args.question || "General vault read"}"\nDescription:\n${args.focus}`
    : `Vault divination: ${args.label}\nQuestion: "${args.question || "General vault read"}"`;

  let reading = "";
  try {
    for await (const chunk of arcanaLlmStream({
      messages: [
        { role: "system", content: KABBALAH_VAULT_ORACLE_PROMPT },
        {
          role: "user",
          content: `${userContent}

Structure: ## ⚠️ Danger & Backlash, ## Safer Non-Kabbalistic Alternatives, ## Reading, ## Closing Warning`,
        },
      ],
      controllerSignal: args.signal,
    })) {
      reading += chunk;
      yield { type: "chunk", text: chunk };
    }
  } catch (err) {
    yield { type: "error", message: err instanceof Error ? err.message : "Vault reading failed." };
    return;
  }

  yield { type: "done", reading, disclaimer };
}

export async function* streamMerlianReading(args: {
  type: ReadingType;
  question: string;
  meta: ReadingMeta;
  divinationId?: string;
  personalization?: PersonalizationBundle | null;
  signal?: AbortSignal;
}): AsyncGenerator<
  | { type: "meta"; meta: ReadingMeta; disclaimer: string }
  | { type: "chunk"; text: string }
  | { type: "done"; result: ReadingResult }
  | { type: "error"; message: string }
> {
  yield { type: "meta", meta: args.meta, disclaimer: FREE_DISCLAIMER };

  const messages = buildMessages(args.type, args.question, args.meta, args.personalization);
  let reading = "";

  try {
    for await (const chunk of arcanaLlmStream({ messages, controllerSignal: args.signal })) {
      reading += chunk;
      yield { type: "chunk", text: chunk };
    }
  } catch (err) {
    yield {
      type: "error",
      message: err instanceof Error ? err.message : "Reading failed.",
    };
    return;
  }

  yield {
    type: "done",
    result: {
      type: args.type,
      divinationId: args.divinationId,
      question: args.question,
      meta: args.meta,
      reading,
      disclaimer: FREE_DISCLAIMER,
      privacy: getArcanaPrivacyManifest(),
    },
  };
}
