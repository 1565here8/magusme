export type ArcanaCategory =
  | "white_magic"
  | "red_magic"
  | "black_magic"
  | "baneful"
  | "hoodoo"
  | "vodou"
  | "hermetic"
  | "planetary"
  | "necromantic"
  | "chaos"
  | "energy_work"
  | "affirmation"
  | "nlp"
  | "defensive"
  | "manifestation"
  | "shamanic"
  | "arabic"
  | "wicca"
  | "verbal_magic"
  | "sex_magic"
  | "vampiric"
  | "divination"
  | "numerology"
  | "kabbalistic"
  | "indian"
  | "chinese"
  | "japanese";

export type ArcanaPurchaseType = "spell" | "source" | "plan";

import type { ArcanaPrivacyManifest } from "./privacy";

export type { ArcanaPrivacyManifest };

export interface ArcanaEntry {
  id: string;
  title: string;
  tradition: string;
  category: ArcanaCategory;
  intentTags: string[];
  summary: string;
  previewText: string;
  fullText: string;
  source: {
    title: string;
    author?: string;
    year?: string;
    institution?: string;
    url?: string;
    pdfRef?: string;
  };
  isBaneful: boolean;
  /** Isolated Kabbalah Vault — most dangerous tradition class; excluded from general oracle */
  isKabbalistic?: boolean;
  backlashText: string;
  alternativesText: string;
  planetaryTiming: string;
  createdAt: string;
  indexedAt: string;
}

export interface ArcanaEntryPreview {
  id: string;
  title: string;
  tradition: string;
  category: ArcanaCategory;
  intentTags: string[];
  summary: string;
  previewText: string;
  isBaneful: boolean;
  isKabbalistic?: boolean;
  backlashText: string;
  alternativesText: string;
  unlocked: boolean;
  sourceUnlocked: boolean;
}

export interface ArcanaSpellDetailResult {
  pathChoice: "peaceful" | "violent";
  content: string;
  backlash: string;
  alternatives: string;
  planetaryTiming: string;
  disclaimer: string;
  spellFooter: string;
}

export interface OraclePersonalReading {
  astroSummary: string | null;
  tarotAnchor: Array<{
    name: string;
    reversed: boolean;
    position?: string;
    meaning: string;
  }>;
}

export interface ArcanaConsultationResult {
  consultationId: string;
  query: string;
  analysis: string;
  /** Natal + tarot drawn for this oracle session */
  personalReading: OraclePersonalReading;
  /** Defensive, reversal, cleansing — shown first */
  peacefulOptions: ArcanaEntryPreview[];
  /** Baneful historical entries — only if user opts in */
  historicalBanefulOptions: ArcanaEntryPreview[];
  recommendations: ArcanaEntryPreview[];
  disclaimer: string;
  privacy: ArcanaPrivacyManifest;
  pricing: {
    spellCents: number;
    sourceCents: number;
    planCents: number;
  };
}

export interface ArcanaIndexStatus {
  totalEntries: number;
  totalIndexLanes?: number;
  comprehensiveIndex?: boolean;
  ingestPerRun?: number;
  indexingMission?: string;
  lastRun: {
    sourcesChecked: number;
    entriesAdded: number;
    finishedAt: string;
  } | null;
  nextScheduledInMs: number;
  traditions?: string[];
  liveIndexEnabled?: boolean;
}
