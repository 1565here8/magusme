export type TarotCard = {
  id: string;
  name: string;
  arcana: "major" | "minor";
  suit?: "Wands" | "Cups" | "Swords" | "Pentacles";
  number?: number;
  keywords: string;
  upright: string;
  reversedMeaning: string;
};

export const TAROT_DECK: TarotCard[] = [
  { id: "major-0", name: "The Fool", arcana: "major", keywords: "beginnings, leap of faith", upright: "New journey, innocence, spontaneity", reversedMeaning: "Recklessness, fear of change" },
  { id: "major-1", name: "The Magician", arcana: "major", keywords: "will, skill, manifestation", upright: "Focused intent, resources at hand", reversedMeaning: "Manipulation, scattered energy" },
  { id: "major-2", name: "The High Priestess", arcana: "major", keywords: "intuition, mystery", upright: "Inner knowing, secrets revealed in time", reversedMeaning: "Blocked intuition, surface reading" },
  { id: "major-3", name: "The Empress", arcana: "major", keywords: "abundance, nurture", upright: "Fertility, creativity, comfort", reversedMeaning: "Smothering, creative block" },
  { id: "major-4", name: "The Emperor", arcana: "major", keywords: "structure, authority", upright: "Stability, boundaries, leadership", reversedMeaning: "Tyranny, rigidity" },
  { id: "major-5", name: "The Hierophant", arcana: "major", keywords: "tradition, teaching", upright: "Guidance, ritual, lineage", reversedMeaning: "Dogma, rebellion" },
  { id: "major-6", name: "The Lovers", arcana: "major", keywords: "union, choice", upright: "Alignment, partnership, values", reversedMeaning: "Disharmony, avoidance" },
  { id: "major-7", name: "The Chariot", arcana: "major", keywords: "victory, drive", upright: "Determination, forward motion", reversedMeaning: "Loss of control, aggression" },
  { id: "major-8", name: "Strength", arcana: "major", keywords: "courage, patience", upright: "Inner power, gentle mastery", reversedMeaning: "Self-doubt, raw force" },
  { id: "major-9", name: "The Hermit", arcana: "major", keywords: "solitude, wisdom", upright: "Retreat, lantern of truth", reversedMeaning: "Isolation, refusal of counsel" },
  { id: "major-10", name: "Wheel of Fortune", arcana: "major", keywords: "cycles, fate", upright: "Turning point, luck shifts", reversedMeaning: "Resistance to change" },
  { id: "major-11", name: "Justice", arcana: "major", keywords: "balance, truth", upright: "Fair outcome, accountability", reversedMeaning: "Bias, dishonesty" },
  { id: "major-12", name: "The Hanged Man", arcana: "major", keywords: "surrender, perspective", upright: "Pause, sacrifice for insight", reversedMeaning: "Stagnation, martyrdom" },
  { id: "major-13", name: "Death", arcana: "major", keywords: "transformation", upright: "Ending that clears space", reversedMeaning: "Clinging, delayed change" },
  { id: "major-14", name: "Temperance", arcana: "major", keywords: "alchemy, moderation", upright: "Integration, healing blend", reversedMeaning: "Extremes, impatience" },
  { id: "major-15", name: "The Devil", arcana: "major", keywords: "bondage, shadow", upright: "Attachment, temptation named", reversedMeaning: "Release, breaking chains" },
  { id: "major-16", name: "The Tower", arcana: "major", keywords: "upheaval, revelation", upright: "Sudden truth, collapse of illusion", reversedMeaning: "Narrow escape, fear of upheaval" },
  { id: "major-17", name: "The Star", arcana: "major", keywords: "hope, renewal", upright: "Healing, guidance after storm", reversedMeaning: "Despair, disconnection" },
  { id: "major-18", name: "The Moon", arcana: "major", keywords: "dreams, illusion", upright: "Psychic tides, walk carefully", reversedMeaning: "Clarity emerging, fear fading" },
  { id: "major-19", name: "The Sun", arcana: "major", keywords: "vitality, success", upright: "Joy, clarity, visibility", reversedMeaning: "Temporary cloud, ego burn" },
  { id: "major-20", name: "Judgement", arcana: "major", keywords: "awakening, reckoning", upright: "Calling, review, rebirth", reversedMeaning: "Self-judgment, ignored call" },
  { id: "major-21", name: "The World", arcana: "major", keywords: "completion, wholeness", upright: "Integration, cycle complete", reversedMeaning: "Almost there, loose ends" },
];

const SUITS = ["Wands", "Cups", "Swords", "Pentacles"] as const;
const RANKS = [
  { n: 1, name: "Ace", kw: "seed, spark" },
  { n: 2, name: "Two", kw: "pairing, choice" },
  { n: 3, name: "Three", kw: "growth, collaboration" },
  { n: 4, name: "Four", kw: "stability, rest" },
  { n: 5, name: "Five", kw: "conflict, challenge" },
  { n: 6, name: "Six", kw: "harmony, gift" },
  { n: 7, name: "Seven", kw: "assessment, persistence" },
  { n: 8, name: "Eight", kw: "movement, mastery" },
  { n: 9, name: "Nine", kw: "near completion, test" },
  { n: 10, name: "Ten", kw: "culmination, burden or bounty" },
  { n: 11, name: "Page", kw: "message, student" },
  { n: 12, name: "Knight", kw: "action, quest" },
  { n: 13, name: "Queen", kw: "embodiment, nurture" },
  { n: 14, name: "King", kw: "mastery, authority" },
];

for (const suit of SUITS) {
  for (const rank of RANKS) {
    TAROT_DECK.push({
      id: `${suit.toLowerCase()}-${rank.n}`,
      name: `${rank.name} of ${suit}`,
      arcana: "minor",
      suit,
      number: rank.n,
      keywords: rank.kw,
      upright: `${rank.name} of ${suit} — active energy of ${suit}`,
      reversedMeaning: `Blocked or internalized ${suit} theme`,
    });
  }
}

export type DrawnTarotCard = TarotCard & { reversed: boolean; position?: string };

export function drawTarot(count: number, positions?: string[]): DrawnTarotCard[] {
  const pool = [...TAROT_DECK];
  const drawn: DrawnTarotCard[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const card = pool.splice(idx, 1)[0]!;
    drawn.push({
      ...card,
      reversed: Math.random() < 0.35,
      position: positions?.[i],
    });
  }
  return drawn;
}

export type Rune = {
  id: string;
  glyph: string;
  name: string;
  meaning: string;
  magical: string;
};

export const ELDER_FUTHARK: Rune[] = [
  { id: "fehu", glyph: "ᚠ", name: "Fehu", meaning: "Wealth, cattle, mobile power", magical: "Increase, new beginnings, prosperity flow" },
  { id: "uruz", glyph: "ᚢ", name: "Uruz", meaning: "Aurochs, raw strength", magical: "Vitality, courage, health, endurance" },
  { id: "thurisaz", glyph: "ᚦ", name: "Thurisaz", meaning: "Giant, thorn, hammer", magical: "Protection, directed force, gateway" },
  { id: "ansuz", glyph: "ᚨ", name: "Ansuz", meaning: "Odin, breath, message", magical: "Communication, inspiration, truth" },
  { id: "raidho", glyph: "ᚱ", name: "Raidho", meaning: "Ride, journey", magical: "Travel, rhythm, right path" },
  { id: "kenaz", glyph: "ᚲ", name: "Kenaz", meaning: "Torch, craft", magical: "Knowledge, creativity, healing fire" },
  { id: "gebo", glyph: "ᚷ", name: "Gebo", meaning: "Gift, exchange", magical: "Partnership, sacrifice, balance" },
  { id: "wunjo", glyph: "ᚹ", name: "Wunjo", meaning: "Joy, harmony", magical: "Success, fellowship, bliss" },
  { id: "hagalaz", glyph: "ᚺ", name: "Hagalaz", meaning: "Hail, disruption", magical: "Breakthrough, crisis that clears" },
  { id: "nauthiz", glyph: "ᚾ", name: "Nauthiz", meaning: "Need, friction", magical: "Constraint, patience, necessity" },
  { id: "isa", glyph: "ᛁ", name: "Isa", meaning: "Ice, stillness", magical: "Pause, focus, ego check" },
  { id: "jera", glyph: "ᛄ", name: "Jera", meaning: "Year, harvest", magical: "Cycles, reward for work, timing" },
  { id: "eihwaz", glyph: "ᛇ", name: "Eihwaz", meaning: "Yew, axis", magical: "Endurance, death/rebirth, protection" },
  { id: "perthro", glyph: "ᛈ", name: "Perthro", meaning: "Lot cup, mystery", magical: "Fate, secrets, divination" },
  { id: "algiz", glyph: "ᛉ", name: "Algiz", meaning: "Elk, protection", magical: "Shield, connection to higher self" },
  { id: "sowilo", glyph: "ᛊ", name: "Sowilo", meaning: "Sun, victory", magical: "Success, wholeness, will aligned" },
  { id: "tiwaz", glyph: "ᛏ", name: "Tiwaz", meaning: "Tyr, justice", magical: "Honor, sacrifice for right, victory" },
  { id: "berkano", glyph: "ᛒ", name: "Berkano", meaning: "Birch, growth", magical: "Birth, family, gentle growth" },
  { id: "ehwaz", glyph: "ᛖ", name: "Ehwaz", meaning: "Horse, partnership", magical: "Trust, movement together, loyalty" },
  { id: "mannaz", glyph: "ᛗ", name: "Mannaz", meaning: "Humanity, self", magical: "Mind, community, self-knowledge" },
  { id: "laguz", glyph: "ᛚ", name: "Laguz", meaning: "Water, flow", magical: "Intuition, dreams, psychic tide" },
  { id: "ingwaz", glyph: "ᛜ", name: "Ingwaz", meaning: "Seed, fertility", magical: "Completion, inner work, gestation" },
  { id: "dagaz", glyph: "ᛞ", name: "Dagaz", meaning: "Day, breakthrough", magical: "Awakening, transformation, clarity" },
  { id: "othala", glyph: "ᛟ", name: "Othala", meaning: "Heritage, estate", magical: "Ancestry, home, inherited power" },
];

export type DrawnRune = Rune & { merkstave: boolean; position?: string };

export function castRunes(count: number, positions?: string[]): DrawnRune[] {
  const pool = [...ELDER_FUTHARK];
  const cast: DrawnRune[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const rune = pool.splice(idx, 1)[0]!;
    cast.push({
      ...rune,
      merkstave: Math.random() < 0.3,
      position: positions?.[i],
    });
  }
  return cast;
}

export const TAROT_SPREADS = {
  single: { count: 1, positions: ["Message"] },
  three: { count: 3, positions: ["Past / Root", "Present / Heart", "Future / Crown"] },
  cross: { count: 5, positions: ["Situation", "Challenge", "Past", "Future", "Outcome"] },
} as const;

export const RUNE_CASTS = {
  single: { count: 1, positions: ["Guidance"] },
  three: { count: 3, positions: ["Root", "Action", "Outcome"] },
  five: { count: 5, positions: ["Self", "Challenge", "Help", "Hindrance", "Result"] },
} as const;
