import { buildDeepAstroProfile } from "../astro/deepProfile";
import { buildAstroSnapshot } from "../astro/snapshot";
import { drawTarot, type DrawnTarotCard } from "./deck";

/** Querent-supplied identity & life context — all fields optional except when astro requires birth data. */
export type MerlianPersonalProfileInput = {
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  lat?: number;
  lon?: number;
  /** Cultural traditions, upbringing, spiritual lineage (free text). */
  culturalBackground?: string;
  /** How the querent describes their heritage or community (self-identified). */
  heritageCommunity?: string;
  /** Literal destination or life direction they are moving toward. */
  destinationPlace?: string;
  /** Inner work, skills, or patterns they want to grow through. */
  growthAreas?: string;
  /** Draw a 3-card tarot anchor to personalize the reading (default true when profile has any field). */
  includeTarotAnchor?: boolean;
};

export type PersonalizationBundle = {
  astroSummary: string | null;
  tarotAnchor: DrawnTarotCard[] | null;
  culturalBlock: string | null;
  destinationBlock: string | null;
  growthBlock: string | null;
  llmBlock: string;
};

const PERSONALIZATION_SYSTEM_RULE = `**Personalization mandate (when querent profile is attached):**
- Weave natal/astro themes, tarot anchor cards (if any), socio-cultural background, destination/direction, and growth edges into EVERY section.
- Honor the querent's cultural heritage respectfully — suggest practices from their lineage when relevant, never stereotype or exoticize.
- Tie manifestation techniques, affirmations, and timing to their chart and cards specifically.
- Address how their stated growth areas intersect with astro/tarot themes.
- If they named a place or direction, include practical and symbolic guidance for that journey.
- Write as if you know this person — warm, specific, never generic.`;

function formatTarotAnchor(cards: DrawnTarotCard[]) {
  return cards
    .map((c) => {
      const orient = c.reversed ? "Reversed" : "Upright";
      const pos = c.position ? `[${c.position}] ` : "";
      return `${pos}${c.name} (${orient}) — ${c.reversed ? c.reversedMeaning : c.upright}`;
    })
    .join("\n");
}

function hasProfileInput(input: MerlianPersonalProfileInput): boolean {
  return Boolean(
    input.fullName?.trim() ||
      input.birthDate?.trim() ||
      input.culturalBackground?.trim() ||
      input.heritageCommunity?.trim() ||
      input.destinationPlace?.trim() ||
      input.growthAreas?.trim(),
  );
}

export function buildPersonalizationBundle(input: MerlianPersonalProfileInput): PersonalizationBundle | null {
  if (!hasProfileInput(input)) return null;

  let astroSummary: string | null = null;
  if (
    input.birthDate?.trim() &&
    input.fullName?.trim() &&
    typeof input.lat === "number" &&
    typeof input.lon === "number"
  ) {
    try {
      const deep = buildDeepAstroProfile({
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        fullName: input.fullName.trim(),
        lat: input.lat,
        lon: input.lon,
      });
      astroSummary = [
        `Name: ${deep.fullName}`,
        `Sun ${deep.sunSign} · Moon ${deep.moonSign} · Rising ${deep.risingSign} · Chart ruler ${deep.chartRuler.planet}`,
        `Life Path ${deep.numerology.lifePath.number} · Expression ${deep.numerology.expression.number} · Soul Urge ${deep.numerology.soulUrge.number}`,
        `Chinese ${deep.chineseZodiac.label} · Personal year ${deep.personalYear.number}: ${deep.personalYear.theme}`,
        `Dominant element ${deep.dominantElement.element} · ${deep.nameAstroHarmony.synthesis}`,
        `Manifestation strengths: ${deep.manifestationProfile.strengths.join("; ")}`,
        deep.manifestationProfile.challenges.length
          ? `Watch: ${deep.manifestationProfile.challenges.join("; ")}`
          : null,
        `Recommended techniques: ${deep.manifestationProfile.recommendedPractices.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n");
    } catch {
      astroSummary = null;
    }
  }

  const includeTarot = input.includeTarotAnchor !== false;
  const tarotAnchor = includeTarot
    ? drawTarot(3, ["Root / past pattern", "Present energy", "Path toward destination"])
    : null;

  const culturalParts = [
    input.culturalBackground?.trim() ? `Cultural background & traditions: ${input.culturalBackground.trim()}` : null,
    input.heritageCommunity?.trim() ? `Heritage / community (self-described): ${input.heritageCommunity.trim()}` : null,
  ].filter(Boolean);
  const culturalBlock = culturalParts.length ? culturalParts.join("\n") : null;

  const destinationBlock = input.destinationPlace?.trim()
    ? `Destination / direction in life: ${input.destinationPlace.trim()}`
    : null;

  const growthBlock = input.growthAreas?.trim()
    ? `Growth edges & inner work: ${input.growthAreas.trim()}`
    : null;

  const llmBlock = [
    "## Querent personal profile (personalize entire response to this person)",
    astroSummary ? `### Astral & numerology map\n${astroSummary}` : null,
    tarotAnchor?.length ? `### Tarot soul-path anchor (drawn for this session)\n${formatTarotAnchor(tarotAnchor)}` : null,
    culturalBlock ? `### Socio-cultural context\n${culturalBlock}` : null,
    destinationBlock ? `### ${destinationBlock}` : null,
    growthBlock ? `### ${growthBlock}` : null,
    "",
    PERSONALIZATION_SYSTEM_RULE,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    astroSummary,
    tarotAnchor,
    culturalBlock,
    destinationBlock,
    growthBlock,
    llmBlock,
  };
}

export function appendPersonalization(userContent: string, bundle: PersonalizationBundle | null | undefined): string {
  if (!bundle) return userContent;
  return `${userContent}\n\n---\n\n${bundle.llmBlock}`;
}

export function personalizationSystemAddon(bundle: PersonalizationBundle | null | undefined): string {
  if (!bundle) return "";
  return `\n\n${PERSONALIZATION_SYSTEM_RULE}`;
}

export { PERSONALIZATION_SYSTEM_RULE };

const ORACLE_TAROT_POSITIONS = [
  "Soul pattern",
  "Present energy",
  "Spell path for your question",
];

export const ORACLE_CONSULT_RULE = `**Oracle consult mandate (always follow):**
1. Open with **Your Natal Chart Reading** — interpret the querent's birth map (or current sky if natal data is partial) specifically for their question.
2. Follow with **Your Tarot Reading** — interpret the three session cards drawn for this consultation.
3. Then **Spells Chosen For You** — pick 2–4 corpus entries that best fit chart + tarot + question + cultural context. Explain why each spell fits THIS person.
4. Only after that, continue with warnings and tradition paths as usual.
Never recommend spells without tying them to chart and tarot themes first.`;

function buildAstroSummaryFromNatal(input: MerlianPersonalProfileInput): string | null {
  if (
    !input.birthDate?.trim() ||
    !input.fullName?.trim() ||
    typeof input.lat !== "number" ||
    typeof input.lon !== "number"
  ) {
    return null;
  }
  try {
    const deep = buildDeepAstroProfile({
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      fullName: input.fullName.trim(),
      lat: input.lat,
      lon: input.lon,
    });
    return [
      `Name: ${deep.fullName}`,
      `Sun ${deep.sunSign} · Moon ${deep.moonSign} · Rising ${deep.risingSign} · Chart ruler ${deep.chartRuler.planet}`,
      `Life Path ${deep.numerology.lifePath.number} · Expression ${deep.numerology.expression.number} · Soul Urge ${deep.numerology.soulUrge.number}`,
      `Chinese ${deep.chineseZodiac.label} · Personal year ${deep.personalYear.number}: ${deep.personalYear.theme}`,
      `Dominant element ${deep.dominantElement.element} · ${deep.nameAstroHarmony.synthesis}`,
      `Manifestation strengths: ${deep.manifestationProfile.strengths.join("; ")}`,
      deep.manifestationProfile.challenges.length
        ? `Watch: ${deep.manifestationProfile.challenges.join("; ")}`
        : null,
      `Recommended techniques: ${deep.manifestationProfile.recommendedPractices.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");
  } catch {
    return null;
  }
}

function buildSkyNowSummary(input: MerlianPersonalProfileInput): string {
  const lat = typeof input.lat === "number" ? input.lat : 40.7128;
  const lon = typeof input.lon === "number" ? input.lon : -74.006;
  const snap = buildAstroSnapshot({ lat, lon, label: input.fullName?.trim() ? "Your location" : "Default location" });
  const hour = snap.planetaryHours.current;
  return [
    `Current sky at ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    `Moon ${snap.moon.name} in ${snap.moon.sign} (${snap.moon.ageDays}d old)`,
    `Planetary hour: ${hour?.ruler ?? "—"} (${hour?.isDay ? "day" : "night"} hour ${hour?.index ?? "—"})`,
    `Day ruler: ${snap.planetaryHours.dayRuler} · ASC ${snap.ascendant.label}`,
    "Add birth date, time, and name in your profile for full natal-chart spell matching.",
  ].join("\n");
}

/** Every oracle consult gets tarot + astro (natal or sky-now) for spell matching. */
export function buildOracleConsultBundle(input: MerlianPersonalProfileInput = {}): PersonalizationBundle {
  const tarotAnchor = drawTarot(3, ORACLE_TAROT_POSITIONS);
  const astroSummary = buildAstroSummaryFromNatal(input) ?? buildSkyNowSummary(input);

  const culturalParts = [
    input.culturalBackground?.trim() ? `Cultural background & traditions: ${input.culturalBackground.trim()}` : null,
    input.heritageCommunity?.trim() ? `Heritage / community (self-described): ${input.heritageCommunity.trim()}` : null,
  ].filter(Boolean);
  const culturalBlock = culturalParts.length ? culturalParts.join("\n") : null;

  const destinationBlock = input.destinationPlace?.trim()
    ? `Destination / direction in life: ${input.destinationPlace.trim()}`
    : null;

  const growthBlock = input.growthAreas?.trim()
    ? `Growth edges & inner work: ${input.growthAreas.trim()}`
    : null;

  const llmBlock = [
    "## Querent personal profile (oracle must read chart + tarot before choosing spells)",
    `### Astral map for this consultation\n${astroSummary}`,
    tarotAnchor.length ? `### Tarot spread drawn for this oracle session\n${formatTarotAnchor(tarotAnchor)}` : null,
    culturalBlock ? `### Socio-cultural context\n${culturalBlock}` : null,
    destinationBlock ? `### ${destinationBlock}` : null,
    growthBlock ? `### ${growthBlock}` : null,
    "",
    ORACLE_CONSULT_RULE,
    PERSONALIZATION_SYSTEM_RULE,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    astroSummary,
    tarotAnchor,
    culturalBlock,
    destinationBlock,
    growthBlock,
    llmBlock,
  };
}
