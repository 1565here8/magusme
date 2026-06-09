import type { ArcanaEntry } from "./types";
import { KABBALAH_DANGER_BANNER } from "./contentPolicy";

type Seed = Omit<
  ArcanaEntry,
  "createdAt" | "indexedAt" | "backlashText" | "alternativesText" | "planetaryTiming"
>;

const KABBALAH_BACKLASH = `${KABBALAH_DANGER_BANNER}

Documented backlash specific to Kabbalistic work: sephirothic imbalance (obsession with one sphere), divine-name shock, loss of grounded identity, sleep disruption, messianic or persecutory ideation, and community/family rupture when practiced without teacher or circle.`;

const KABBALAH_ALTERNATIVES = `• **Exit the vault** — use general Merlian: LBRP (angelic-only form), hoodoo cleansing, cord-cutting
• **Planetary magic (Agrippa)** without Tree of Life frame
• **Solomonic angel work** without Sephiroth mapping
• **Professional pastoral or psychiatric support** if distress persists`;

export const KABBALAH_SEED_ENTRIES: Seed[] = [
  {
    id: "arc_kab_lbrp_full",
    title: "LBRP — Full Qabalistic Form (Vault)",
    tradition: "Hermetic Qabalah / Golden Dawn",
    category: "kabbalistic",
    intentTags: ["qabalah", "lbrp", "sephiroth", "banishing", "kabbalah-vault"],
    isKabbalistic: true,
    isBaneful: false,
    summary:
      "Complete Lesser Banishing Ritual with Qabalistic Cross mapping body to Sephiroth — vault-only; classified most dangerous daily practice if combined with other systems.",
    previewText:
      "ATEH MALKUTH, VE-GEBURAH, VE-GEDULAH — the cross aligns the microcosm to the Tree before archangelic quarters…",
    fullText: `# LBRP — Full Qabalistic Form

${KABBALAH_DANGER_BANNER}

## The Qabalistic Cross
Forehead ATEH (Kether) · Chest MALKUTH · Right shoulder VE-GEBURAH · Left VE-GEDULAH · Heart LE-OLAM AMEN.

## Pentagrams with divine names
YHVH (East), ADNI (South), AHIH (West), AGLA (North).

## Archangels
Raphael, Gabriel, Michael, Uriel — positioned on Tree columns.

## Vault note
Do not perform within 24h of non-Kabbalistic baneful work. Ground with food and sleep after.`,
    source: {
      title: "The Golden Dawn (Regardie)",
      author: "Israel Regardie",
      year: "1937",
      institution: "Hermetic Order of the Golden Dawn",
      url: "https://archive.org/details/golden_dawn",
    },
  },
  {
    id: "arc_kab_gematria",
    title: "Gematria Name Working — 72-Letter Bridge (Historical)",
    tradition: "Jewish / Hermetic Kabbalah",
    category: "kabbalistic",
    intentTags: ["gematria", "names", "72 names", "letter magic", "kabbalah-vault"],
    isKabbalistic: true,
    isBaneful: false,
    summary:
      "Letter-number permutation on a personal name — traditional Gematria operative sketch; vault-only due to identity restructuring risk.",
    previewText:
      "Reduce the name to its essential number, then permute through the 72-fold name lattice as documented in Hasidic and Hermetic commentaries…",
    fullText: `# Gematria Name Working (Historical Summary)

${KABBALAH_DANGER_BANNER}

## Method (structural)
1. Convert Hebrew or Latin name to Gematria sum.
2. Find corresponding divine name from traditional tables (NOT improvised).
3. Vocalize only after three-day purification in historical sources.

## Warning
Misaligned name work is cited in Kabbalistic literature as cause of **name-loss** — feeling untethered from self.`,
    source: {
      title: "Kabbalah: New Perspectives / Gematria commentaries",
      author: "Various",
      year: "Medieval–modern",
      institution: "Jewish mystical corpus",
      url: "https://archive.org/search?query=gematria+kabbalah",
    },
  },
  {
    id: "arc_kab_tree_path",
    title: "Tree of Life — Pathworking Tiphareth Gate",
    tradition: "Hermetic Qabalah",
    category: "kabbalistic",
    intentTags: ["tree of life", "pathworking", "tiphareth", "vision", "kabbalah-vault"],
    isKabbalistic: true,
    isBaneful: true,
    summary:
      "Guided ascent to Tiphareth (Beauty) — central sphere; vault documents severe imbalance risk if approached without Malkuth grounding.",
    previewText:
      "Ascend from Malkuth through Yesod; knock at the veil of Paroketh before the solar sphere…",
    fullText: `# Tiphareth Pathworking (Vault Document)

${KABBALAH_DANGER_BANNER}

## Prerequisites (tradition)
Daily LBRP for 28 days. Journal. Teacher recommended.

## Path
Malkuth → Yesod → climb to Tiphareth via attributed path (Zain or Resh per school).

## Documented dangers
Solar inflation, messianic ideation, inability to return to mundane tasks — **most common Kabbalistic crisis** in modern accounts.`,
    source: {
      title: "777 / Golden Dawn pathworking papers",
      author: "Crowley / Regardie lineage",
      year: "20th c.",
      institution: "Hermetic Qabalah",
    },
  },
  {
    id: "arc_kab_practical_letter",
    title: "Practical Kabbalah — Permuted Letter Square",
    tradition: "Practical Kabbalah",
    category: "kabbalistic",
    intentTags: ["practical kabbalah", "letter square", "notarikon", "kabbalah-vault"],
    isKabbalistic: true,
    isBaneful: true,
    summary:
      "Historical letter-square construction for intent fixation — BnF and Beinecke mss. cite misuse as cause of madness.",
    previewText:
      "Fill the square in order of permuted divine letters; no letter may repeat until the square closes…",
    fullText: `# Letter Square (Practical Kabbalah)

${KABBALAH_DANGER_BANNER}

## Construction
N×N square from permuted name of intent. Written at Saturn hour in vault tradition.

## Backlash in sources
Incomplete squares "leak" intent into dream and waking obsession.`,
    source: {
      title: "Practical Kabbalah manuscripts",
      institution: "BnF / Beinecke",
      url: "https://gallica.bnf.fr",
    },
  },
];

export function kabbalahSeedsWithTimestamps(now: string): ArcanaEntry[] {
  return KABBALAH_SEED_ENTRIES.map((entry) => ({
    ...entry,
    backlashText: KABBALAH_BACKLASH,
    alternativesText: KABBALAH_ALTERNATIVES,
    planetaryTiming:
      "Saturn or Mercury day/hour for construction; Sun day ONLY for Tiphareth work with full grounding. Never begin on void-of-course Moon per vault policy.",
    createdAt: now,
    indexedAt: now,
  }));
}
