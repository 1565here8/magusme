/** Kabbalistic magic — isolated vault; treated as the most dangerous tradition class. */

import { isKabbalahDivinationId } from "../../shared/kabbalahDivinations";

export { isKabbalahDivinationId };

export const KABBALAH_DANGER_BANNER = `⚠️ **PRACTICAL KABBALAH — HIGHEST DANGER CLASS**

AllMagus classifies Kabbalistic operative work as **more dangerous than most other practices** in the archive — including many baneful grimoires and necromantic rites — due to documented rates of **psychological destabilization**, **obsessive fixation**, **identity dissolution**, and **spiritual crisis**.

**At your own risk:** Tree of Life pathworking, letter permutations, Gematria operations, and Practical Kabbalah can restructure perception of self and divine in ways that are **hard to reverse without long guided remediation**. Do not combine with other workings in the same session unless a qualified teacher has instructed you otherwise.`;

export const KABBALAH_VAULT_ACKNOWLEDGMENT =
  "I am 18+. I understand Practical Kabbalah is more dangerous than other methods on AllMagus. I accept full risk at my own responsibility. All liability is denied.";

export const MERLIAN_GENERAL_SEPARATION_RULE = `**Corpus separation:** The main Merlian oracle and general library EXCLUDE Kabbalistic material. Kabbalistic magic lives only in the **Kabbalah Vault** — a separate, opt-in section with its own warnings.

If a user asks about Kabbalah in the general oracle, direct them to the Kabbalah Vault and state clearly that it is the most dangerous category. Do NOT teach Tree of Life, Gematria operations, or Practical Kabbalah outside the vault context.

**Angels in general magic:** Archangels (Michael, Raphael, Gabriel, Uriel), Solomonic hierarchies, and Enochian watchtowers remain available in the **general** library when NOT framed through Kabbalistic Tree of Life cosmology.`;

export const KABBALAH_VAULT_ORACLE_PROMPT = `You are the Merlian **Kabbalah Vault** oracle — isolated from all other traditions.

${KABBALAH_DANGER_BANNER}

You speak in clear modern ENGLISH with Hebrew/transliteration for divine names and letters when citing sources.

**Every response MUST include:**
1. ## Danger & Backlash (Kabbalistic-specific — psychosis risk, sephirothic imbalance, divine name misuse)
2. ## Safer Non-Kabbalistic Alternatives (redirect to general Merlian: planetary magic, angelic banishing without Tree, hoodoo cleansing)
3. ## What the Tradition Documents (historical/curio voice only unless user unlocked full text)

Never minimize danger. Kabbalistic magic is **more dangerous than baneful grimoire work** in Merlian's classification.`;

const KABBALISTIC_PATTERNS: RegExp[] = [
  /\bkabbal/i,
  /\bqabalah/i,
  /\bqabal/i,
  /\bgematria/i,
  /\btree of life\b/i,
  /\bsephir/i,
  /\bsefirot/i,
  /\bsephiroth/i,
  /\bzohar\b/i,
  /\bpractical kabbal/i,
  /\bhermetic qabalah/i,
  /\bjewish kabbal/i,
  /\bnotarikon\b/i,
  /\btemurah\b/i,
];

export function isKabbalisticContent(text: string): boolean {
  return KABBALISTIC_PATTERNS.some((p) => p.test(text));
}

export function entryLooksKabbalistic(entry: {
  isKabbalistic?: boolean;
  title: string;
  tradition: string;
  summary: string;
  previewText?: string;
  fullText?: string;
  intentTags?: string[];
  category?: string;
}): boolean {
  if (entry.isKabbalistic === true) return true;
  if (entry.category === "kabbalistic") return true;
  const blob = [
    entry.title,
    entry.tradition,
    entry.summary,
    entry.previewText ?? "",
    entry.fullText ?? "",
    ...(entry.intentTags ?? []),
  ].join("\n");
  return isKabbalisticContent(blob);
}

export function partitionCorpus<T extends { isKabbalistic?: boolean; title: string; tradition: string; summary: string; previewText?: string; fullText?: string; intentTags?: string[]; category?: string }>(
  entries: T[],
): { general: T[]; kabbalistic: T[] } {
  const general: T[] = [];
  const kabbalistic: T[] = [];
  for (const e of entries) {
    if (entryLooksKabbalistic(e)) kabbalistic.push(e);
    else general.push(e);
  }
  return { general, kabbalistic };
}

export function filterGeneralCorpus<T extends Parameters<typeof entryLooksKabbalistic>[0]>(entries: T[]): T[] {
  return partitionCorpus(entries).general;
}

export function filterKabbalisticCorpus<T extends Parameters<typeof entryLooksKabbalistic>[0]>(entries: T[]): T[] {
  return partitionCorpus(entries).kabbalistic;
}

/** Kabbalistic-only archive queries (separate indexer lane). */
export const KABBALAH_INDEX_QUERIES = [
  'kabbalah OR qabalah OR gematria OR "tree of life" OR sephiroth OR zohar',
  '"practical kabbalah" OR "hermetic qabalah" OR "jewish mysticism" magic',
] as const;

export const KABBALAH_DIVINATIONS = [
  { id: "gematria", label: "Gematria Reading", blurb: "Hebrew/Greek letter-number analysis", tradition: "Practical Kabbalah", mode: "question" as const },
  { id: "tree_path", label: "Tree of Life Path", blurb: "Sephiroth pathworking snapshot", tradition: "Hermetic Qabalah", mode: "question" as const },
  { id: "letter_perm", label: "Letter Permutation", blurb: "Notarikon / Temurah style", tradition: "Practical Kabbalah", mode: "describe" as const },
  { id: "sephir_oracle", label: "Sephirah Oracle", blurb: "Daily sephira correspondence read", tradition: "Practical Kabbalah", mode: "question" as const },
] as const;

export type KabbalahDivinationId = (typeof KABBALAH_DIVINATIONS)[number]["id"];

/** General archive lane — exclude Kabbalistic material from mixed feeds. */
export function archiveQueryExcludeKabbalah(query: string): string {
  return `(${query}) AND NOT (kabbalah OR qabalah OR gematria OR "tree of life" OR sephiroth OR zohar)`;
}
