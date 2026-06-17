/** Practical Kabbalah methods. require danger acknowledgment before use. */

export const KABBALAH_DIVINATION_ENTRIES = [
  {
    id: "gematria",
    label: "Gematria Reading",
    blurb: "Hebrew/Greek letter-number analysis. practical Kabbalah",
    tradition: "Practical Kabbalah",
    mode: "question" as const,
  },
  {
    id: "tree_path",
    label: "Tree of Life Path",
    blurb: "Sephiroth pathworking snapshot. use with extreme caution",
    tradition: "Hermetic Qabalah",
    mode: "question" as const,
  },
  {
    id: "letter_perm",
    label: "Letter Permutation",
    blurb: "Notarikon / Temurah letter work",
    tradition: "Practical Kabbalah",
    mode: "describe" as const,
  },
  {
    id: "sephir_oracle",
    label: "Sephirah Oracle",
    blurb: "Daily sephira correspondence reading",
    tradition: "Practical Kabbalah",
    mode: "question" as const,
  },
] as const;

export const KABBALAH_DIVINATION_IDS = new Set<string>(
  KABBALAH_DIVINATION_ENTRIES.map((d) => d.id),
);

export function isKabbalahDivinationId(id: string): boolean {
  return KABBALAH_DIVINATION_IDS.has(id);
}

export const KABBALAH_USER_DANGER_INTRO = `Practical Kabbalah is classified as **more dangerous than most other practices** on AllMagus. including many dark arts and necromantic rites. because of documented risks of psychological destabilization, obsessive fixation, and identity dissolution.

This is **at your own risk**. AllMagus denies liability. If you are in crisis, use emergency services. not this tool.`;

export const KABBALAH_USER_ACKNOWLEDGMENT =
  "I am 18+. I understand Practical Kabbalah is more dangerous than other methods here. I accept full risk at my own responsibility. All liability is denied.";
