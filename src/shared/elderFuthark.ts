export type RuneDef = {
  id: number;
  glyph: string;
  name: string;
  letter: string;
  meaning: string;
  reversedMeaning: string;
  category: string;
  keywords: string[];
};

export const ELDER_FUTHARK: RuneDef[] = [
  { id: 1, glyph: "ᚠ", name: "Fehu", letter: "F", meaning: "Wealth, abundance, success, mobile property", reversedMeaning: "Loss, bad luck, missed opportunity, blockage", category: "Freyr's Ætt", keywords: ["wealth", "abundance", "prosperity", "success"] },
  { id: 2, glyph: "ᚢ", name: "Uruz", letter: "U", meaning: "Strength, vitality, courage, untamed potential", reversedMeaning: "Weakness, injury, domination by others", category: "Freyr's Ætt", keywords: ["strength", "vitality", "courage", "power"] },
  { id: 3, glyph: "ᚦ", name: "Thurisaz", letter: "TH", meaning: "Protection, conflict, reactive force, defense", reversedMeaning: "Danger, betrayal, vulnerability, rash action", category: "Freyr's Ætt", keywords: ["protection", "conflict", "defense", "giant"] },
  { id: 4, glyph: "ᚨ", name: "Ansuz", letter: "A", meaning: "Message, wisdom, communication, divine inspiration", reversedMeaning: "Misunderstanding, lies, poor communication", category: "Freyr's Ætt", keywords: ["wisdom", "communication", "message", "divine"] },
  { id: 5, glyph: "ᚱ", name: "Raidho", letter: "R", meaning: "Journey, travel, change, movement, rhythm", reversedMeaning: "Stagnation, crisis, injustice, disruption", category: "Freyr's Ætt", keywords: ["journey", "travel", "change", "movement"] },
  { id: 6, glyph: "ᚲ", name: "Kenaz", letter: "K", meaning: "Fire, creativity, illumination, knowledge", reversedMeaning: "Destruction, darkness, confusion, loss of passion", category: "Freyr's Ætt", keywords: ["fire", "creativity", "knowledge", "illumination"] },
  { id: 7, glyph: "ᚷ", name: "Gebo", letter: "G", meaning: "Gift, generosity, partnership, balance", reversedMeaning: "Greed, obligation, imbalance (upright only — no reverse)", category: "Freyr's Ætt", keywords: ["gift", "partnership", "balance", "generosity"] },
  { id: 8, glyph: "ᚹ", name: "Wunjo", letter: "W", meaning: "Joy, pleasure, harmony, fellowship", reversedMeaning: "Sorrow, discord, imbalance, alienation", category: "Freyr's Ætt", keywords: ["joy", "harmony", "fellowship", "pleasure"] },
  { id: 9, glyph: "ᚺ", name: "Hagalaz", letter: "H", meaning: "Hail, disruption, natural destruction, transformation", reversedMeaning: "Gradual change, delay (upright only — no reverse)", category: "Hagal's Ætt", keywords: ["disruption", "transformation", "destruction", "change"] },
  { id: 10, glyph: "ᚾ", name: "Nauthiz", letter: "N", meaning: "Need, constraint, necessity, endurance", reversedMeaning: "Poverty, desperation, burnout (upright only — no reverse)", category: "Hagal's Ætt", keywords: ["need", "constraint", "endurance", "necessity"] },
  { id: 11, glyph: "ᛁ", name: "Isa", letter: "I", meaning: "Ice, stillness, pause, clarity through freezing", reversedMeaning: "Stagnation, frustration, blockage (upright only — no reverse)", category: "Hagal's Ætt", keywords: ["ice", "stillness", "pause", "clarity"] },
  { id: 12, glyph: "ᛃ", name: "Jera", letter: "J", meaning: "Harvest, cycle, reward, natural fruition", reversedMeaning: "Bad harvest, poor timing, setback (upright only — no reverse)", category: "Hagal's Ætt", keywords: ["harvest", "cycle", "reward", "fruition"] },
  { id: 13, glyph: "ᛇ", name: "Eihwaz", letter: "EI", meaning: "Yew tree, endurance, resilience, death-rebirth", reversedMeaning: "Weakness, avoidance, fragility (upright only — no reverse)", category: "Hagal's Ætt", keywords: ["endurance", "resilience", "rebirth", "protection"] },
  { id: 14, glyph: "ᛈ", name: "Perthro", letter: "P", meaning: "Lot cup, mystery, fate, hidden knowledge", reversedMeaning: "Secrets kept, bad luck, stagnation", category: "Hagal's Ætt", keywords: ["mystery", "fate", "hidden", "divination"] },
  { id: 15, glyph: "ᛉ", name: "Algiz", letter: "Z", meaning: "Protection, defense, higher self, connection to gods", reversedMeaning: "Vulnerability, betrayal, hidden danger", category: "Hagal's Ætt", keywords: ["protection", "defense", "higher self", "connection"] },
  { id: 16, glyph: "ᛊ", name: "Sowilo", letter: "S", meaning: "Sun, success, vitality, wholeness, life force", reversedMeaning: "False success, burnout, loss (upright only — no reverse)", category: "Hagal's Ætt", keywords: ["sun", "success", "vitality", "life force"] },
  { id: 17, glyph: "ᛏ", name: "Tiwaz", letter: "T", meaning: "Justice, honor, leadership, warrior's path", reversedMeaning: "Injustice, sacrifice without reward, loss of honor", category: "Tyr's Ætt", keywords: ["justice", "honor", "leadership", "warrior"] },
  { id: 18, glyph: "ᛒ", name: "Berkano", letter: "B", meaning: "Growth, fertility, new beginnings, nurturing", reversedMeaning: "Loss of family, stagnation, decay", category: "Tyr's Ætt", keywords: ["growth", "fertility", "beginnings", "nurturing"] },
  { id: 19, glyph: "ᛖ", name: "Ehwaz", letter: "E", meaning: "Horse, partnership, trust, progress together", reversedMeaning: "Distrust, betrayal, separation, broken trust", category: "Tyr's Ætt", keywords: ["partnership", "trust", "progress", "horse"] },
  { id: 20, glyph: "ᛗ", name: "Mannaz", letter: "M", meaning: "Human, community, cooperation, self-reflection", reversedMeaning: "Isolation, manipulation, loneliness", category: "Tyr's Ætt", keywords: ["human", "community", "cooperation", "self"] },
  { id: 21, glyph: "ᛚ", name: "Laguz", letter: "L", meaning: "Water, flow, dreams, intuition, unconscious", reversedMeaning: "Blocked emotions, confusion, fear", category: "Tyr's Ætt", keywords: ["water", "flow", "intuition", "dreams"] },
  { id: 22, glyph: "ᛝ", name: "Ingwaz", letter: "NG", meaning: "Seed, fertility, inner growth, completion", reversedMeaning: "Infertility, stagnation, incomplete (upright only — no reverse)", category: "Tyr's Ætt", keywords: ["seed", "fertility", "growth", "completion"] },
  { id: 23, glyph: "ᛟ", name: "Othala", letter: "O", meaning: "Homeland, inheritance, ancestry, sacred space", reversedMeaning: "Displacement, lost heritage, materialism", category: "Tyr's Ætt", keywords: ["homeland", "inheritance", "ancestry", "home"] },
  { id: 24, glyph: "ᛞ", name: "Dagaz", letter: "D", meaning: "Day, breakthrough, transformation, awakening", reversedMeaning: "Delay, setback, blindness (upright only — no reverse)", category: "Tyr's Ætt", keywords: ["breakthrough", "transformation", "awakening", "day"] },
];

export function getRandomRune(): { rune: RuneDef; reversed: boolean } {
  const rune = ELDER_FUTHARK[Math.floor(Math.random() * ELDER_FUTHARK.length)];
  const reversed = Math.random() < 0.5;
  return { rune, reversed };
}

export function getRuneById(id: number): RuneDef | undefined {
  return ELDER_FUTHARK.find((r) => r.id === id);
}
