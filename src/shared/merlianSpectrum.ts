/**
 * Merlian magic spectrum — white (harmless / manifestation) → black (baneful).
 * Every index, category, and tradition maps to a tier so users can navigate by color.
 */

export type SpectrumTier =
  | "pure_white"   // 0  — psychology, philosophy, manifestation (not magic, but white)
  | "pearl"        // 1  — white magic, wicca, meditation
  | "angelic"      // 2  — angels, divine names, protective ceremonial
  | "celestial"    // 3  — astrology, planetary benign, numerology
  | "nature"       // 4  — natural omens, herbal, body reading
  | "cultural"     // 5  — Indian, Chinese, Japanese lineages
  | "oracle"       // 6  — tarot, scrying, cartomancy, divination
  | "spirit"       // 7  — mediumship, ancestors, trance spirits
  | "passion"      // 8  — love magic, consensual sex magic, Thelema
  | "folk"         // 9  — hoodoo, rootwork, Arabic folk
  | "warrior"      // 10 — reversal, binding, aggressive defense
  | "orisha"       // 11 — vodou, orisha, powerful entities
  | "kabbalah"     // 12 — Kabbalah vault (isolated, highest danger)
  | "death"        // 13 — necromancy, death work
  | "black"        // 14 — black magic, baneful grimoires
  | "infernal";    // 15 — demonic, Satan, Goetia spirits

export type SpectrumMeta = {
  tier: SpectrumTier;
  /** 0 = pure white … 15 = infernal black */
  index: number;
  label: string;
  family: string;
  hint: string;
};

export const SPECTRUM_ORDER: SpectrumTier[] = [
  "pure_white",
  "pearl",
  "angelic",
  "celestial",
  "nature",
  "cultural",
  "oracle",
  "spirit",
  "passion",
  "folk",
  "warrior",
  "orisha",
  "kabbalah",
  "death",
  "black",
  "infernal",
];

export const SPECTRUM_META: Record<SpectrumTier, SpectrumMeta> = {
  pure_white: {
    tier: "pure_white",
    index: 0,
    label: "Pure White",
    family: "Manifestation & Mind",
    hint: "Psychology, philosophy, LOA, affirmations — harmless white light",
  },
  pearl: {
    tier: "pearl",
    index: 1,
    label: "Pearl",
    family: "White Magic",
    hint: "Wicca, benign folk, healing — classic white magic",
  },
  angelic: {
    tier: "angelic",
    index: 2,
    label: "Angelic Ivory",
    family: "Divine / Angelic",
    hint: "Angels, archangels, LBRP, divine names — off-white holy work",
  },
  celestial: {
    tier: "celestial",
    index: 3,
    label: "Celestial",
    family: "Stars & Numbers",
    hint: "Astrology, planetary hours, numerology — sky wisdom",
  },
  nature: {
    tier: "nature",
    index: 4,
    label: "Nature Sage",
    family: "Earth & Body",
    hint: "Omens, herbal, palmistry, shamanic healing",
  },
  cultural: {
    tier: "cultural",
    index: 5,
    label: "Cultural Gold",
    family: "World Traditions",
    hint: "Indian, Chinese, Japanese spiritual lineages",
  },
  oracle: {
    tier: "oracle",
    index: 6,
    label: "Oracle Violet",
    family: "Divination",
    hint: "Tarot, runes, scrying, bibliomancy — seeing without summoning",
  },
  spirit: {
    tier: "spirit",
    index: 7,
    label: "Spirit Mist",
    family: "Spirit & Mediumship",
    hint: "Ancestors, mediums, dreams — neutral spirit contact",
  },
  passion: {
    tier: "passion",
    index: 8,
    label: "Passion Rose",
    family: "Love & Will",
    hint: "Love magic, consensual sex magic, creative force",
  },
  folk: {
    tier: "folk",
    index: 9,
    label: "Folk Copper",
    family: "Rootwork & Folk",
    hint: "Hoodoo, conjure, Arabic folk magic, curandero",
  },
  warrior: {
    tier: "warrior",
    index: 10,
    label: "Warrior Rust",
    family: "Aggressive Defense",
    hint: "Reversal, mirror return, binding attack back",
  },
  orisha: {
    tier: "orisha",
    index: 11,
    label: "Orisha Ember",
    family: "Orisha & Vodou",
    hint: "Vodou, Santería, orisha — powerful living spirits",
  },
  kabbalah: {
    tier: "kabbalah",
    index: 12,
    label: "Kabbalah Void",
    family: "Kabbalah Vault",
    hint: "Isolated vault — Tree of Life, gematria — highest danger class",
  },
  death: {
    tier: "death",
    index: 13,
    label: "Death Charcoal",
    family: "Necromancy",
    hint: "Death work, shades, underworld contact",
  },
  black: {
    tier: "black",
    index: 14,
    label: "Black Magic",
    family: "Baneful",
    hint: "Harmful historical grimoires — curio / academic only",
  },
  infernal: {
    tier: "infernal",
    index: 15,
    label: "Infernal Abyss",
    family: "Demonic",
    hint: "Satan, demons, Goetia — darkest tier",
  },
};

/** Manifestation sidebar categories — always pure white */
export const MANIFESTATION_CATEGORY_LIST = [
  "Manifestation & Law of Attraction",
  "Affirmations & Scripts",
  "Visualization & Mental Rehearsal",
  "Journaling & Writing Practices",
  "Self-Hypnosis & Trance",
  "NLP & EFT",
  "Positive Psychology",
  "Philosophy & Stoic Wisdom",
] as const;

export function isManifestationCategory(category: string): boolean {
  return (MANIFESTATION_CATEGORY_LIST as readonly string[]).includes(category);
}

const DIVINATION_CATEGORY_SPECTRUM: Record<string, SpectrumTier> = {
  "Manifestation & Law of Attraction": "pure_white",
  "Affirmations & Scripts": "pure_white",
  "Visualization & Mental Rehearsal": "pure_white",
  "Journaling & Writing Practices": "pure_white",
  "Self-Hypnosis & Trance": "pure_white",
  "NLP & EFT": "pure_white",
  "Positive Psychology": "pure_white",
  "Philosophy & Stoic Wisdom": "pure_white",
  "Meditation & Relaxation": "pearl",
  Astronomical: "celestial",
  "Indian Traditions": "cultural",
  "Chinese Traditions": "cultural",
  "Japanese Traditions": "cultural",
  Cartomancy: "oracle",
  "Cleromancy & Sortilege": "oracle",
  "Scrying & Vision": "oracle",
  "Numerology & Onomancy": "celestial",
  "Bibliomancy & Sacred Text": "oracle",
  "Physiognomy & Body": "nature",
  "Tasseography & Food": "folk",
  "Oneiromancy & Trance": "spirit",
  "Natural Omens": "nature",
  "Spirit & Mediumship": "spirit",
  "Ceremonial Oracle": "angelic",
  "Practical Kabbalah": "kabbalah",
};

const ARCANA_CATEGORY_SPECTRUM: Record<string, SpectrumTier> = {
  manifestation: "pure_white",
  affirmation: "pure_white",
  nlp: "pure_white",
  white_magic: "pearl",
  wicca: "pearl",
  defensive: "angelic",
  hermetic: "angelic",
  planetary: "celestial",
  numerology: "celestial",
  divination: "oracle",
  indian: "cultural",
  chinese: "cultural",
  japanese: "cultural",
  shamanic: "nature",
  energy_work: "nature",
  chaos: "oracle",
  verbal_magic: "pearl",
  red_magic: "passion",
  sex_magic: "passion",
  hoodoo: "folk",
  arabic: "folk",
  vodou: "orisha",
  vampiric: "warrior",
  necromantic: "death",
  black_magic: "black",
  baneful: "black",
  kabbalistic: "kabbalah",
};

const ANGELIC_PATTERN =
  /\b(angel|archangel|michael|raphael|gabriel|uriel|metatron|seraph|cherub|LBRP|lesser banishing|enochian angel|heptarchia|shekinah|divine name)\b/i;
const INFERNAL_PATTERN =
  /\b(satan|satanic|demon|devil|lucifer|belial|asmod(eus|ay)|goetia|infernal|hell|leviathan|baal|abaddon|demonic|left[- ]hand path)\b/i;
const DEATH_PATTERN = /\b(necrom|death spell|shade|underworld|ancestor skull|graveyard|ossuary)\b/i;
const ORISHA_PATTERN = /\b(vodou|voodoo|santer[ií]a|orisha|lwa|ifa|palo|candombl[eé]|haitian)\b/i;
const KABBALAH_PATTERN = /\b(kabbal|qabalah|sephir|gematria|tree of life|practical kabbalah)\b/i;

function traditionKeywordTier(tradition: string): SpectrumTier | null {
  const t = tradition.trim();
  if (!t) return null;
  if (KABBALAH_PATTERN.test(t)) return "kabbalah";
  if (INFERNAL_PATTERN.test(t)) return "infernal";
  if (ANGELIC_PATTERN.test(t)) return "angelic";
  if (ORISHA_PATTERN.test(t)) return "orisha";
  if (DEATH_PATTERN.test(t)) return "death";
  return null;
}

export function getSpectrumMeta(tier: SpectrumTier): SpectrumMeta {
  return SPECTRUM_META[tier];
}

export function spectrumTierClass(tier: SpectrumTier): string {
  return `spectrum-tier-${tier.replace(/_/g, "-")}`;
}

export function resolveDivinationSpectrum(method: {
  category: string;
  tradition?: string;
  mode?: string;
}): SpectrumMeta {
  if (method.mode === "manifestation_llm" || isManifestationCategory(method.category)) {
    return SPECTRUM_META.pure_white;
  }
  const fromTradition = traditionKeywordTier(method.tradition ?? "");
  if (fromTradition) return SPECTRUM_META[fromTradition];
  const tier = DIVINATION_CATEGORY_SPECTRUM[method.category] ?? "oracle";
  return SPECTRUM_META[tier];
}

export function resolveArcanaSpectrum(entry: {
  category: string;
  tradition?: string;
  isBaneful?: boolean;
  isKabbalistic?: boolean;
}): SpectrumMeta {
  if (entry.isKabbalistic) return SPECTRUM_META.kabbalah;
  const fromTradition = traditionKeywordTier(entry.tradition ?? "");
  if (fromTradition === "infernal" || fromTradition === "kabbalah") {
    return SPECTRUM_META[fromTradition];
  }
  if (entry.isBaneful || entry.category === "black_magic" || entry.category === "baneful") {
    if (INFERNAL_PATTERN.test(entry.tradition ?? "") || INFERNAL_PATTERN.test(entry.category)) {
      return SPECTRUM_META.infernal;
    }
    return SPECTRUM_META.black;
  }
  if (fromTradition) return SPECTRUM_META[fromTradition];
  const tier = ARCANA_CATEGORY_SPECTRUM[entry.category] ?? "oracle";
  return SPECTRUM_META[tier];
}

export function resolveCategoryLabelSpectrum(categoryLabel: string): SpectrumMeta {
  if (isManifestationCategory(categoryLabel)) return SPECTRUM_META.pure_white;
  const tier = DIVINATION_CATEGORY_SPECTRUM[categoryLabel];
  if (tier) return SPECTRUM_META[tier];
  return SPECTRUM_META.oracle;
}
