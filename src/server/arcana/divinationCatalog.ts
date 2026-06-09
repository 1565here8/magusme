import {
  MANIFESTATION_CATALOG_ENTRIES,
  MANIFESTATION_CATEGORIES,
  isManifestationCategory,
} from "./manifestationCatalogEntries";

export { isManifestationCategory, MANIFESTATION_CATEGORIES };

/** Every divination, oracle, and scrying method in the Merlian menu. */
export type DivinationMode =
  | "astro_watch"
  | "astro_natal"
  | "astro_deep"
  | "numerology"
  | "tarot"
  | "rune"
  | "describe"
  | "generic_llm"
  | "manifestation_llm"
  | "kabbalah";

export type DivinationMethod = {
  id: string;
  label: string;
  category: string;
  mode: DivinationMode;
  blurb: string;
  tradition?: string;
};

export const DIVINATION_CATEGORIES = [
  "Astronomical",
  "Indian Traditions",
  "Chinese Traditions",
  "Japanese Traditions",
  "Meditation & Relaxation",
  "Cartomancy",
  "Cleromancy & Sortilege",
  "Scrying & Vision",
  "Physiognomy & Body",
  "Tasseography & Food",
  "Numerology & Onomancy",
  "Bibliomancy & Sacred Text",
  "Oneiromancy & Trance",
  "Natural Omens",
  "Spirit & Mediumship",
  "Ceremonial Oracle",
  "Practical Kabbalah",
  ...MANIFESTATION_CATEGORIES,
] as const;

export const DIVINATION_CATALOG: DivinationMethod[] = [
  // Astronomical
  { id: "watch", label: "Astro Watch", category: "Astronomical", mode: "astro_watch", blurb: "Live planetary hours, moon phase, houses & sky map", tradition: "Hellenistic / Medieval" },
  { id: "natal", label: "Natal Chart Map", category: "Astronomical", mode: "astro_natal", blurb: "Birth chart wheel with planets & equal houses", tradition: "Western astrology" },
  { id: "horary", label: "Horary Astrology", category: "Astronomical", mode: "generic_llm", blurb: "Question chart read from the moment of asking", tradition: "William Lilly lineage" },
  { id: "electional", label: "Electional Timing", category: "Astronomical", mode: "generic_llm", blurb: "Choose the best moment for a working or event", tradition: "Planetary magic" },
  { id: "synastry", label: "Synastry / Compatibility", category: "Astronomical", mode: "generic_llm", blurb: "Compare two charts for relationship dynamics", tradition: "Relationship astrology" },
  { id: "vedic", label: "Vedic Jyotish Snapshot", category: "Astronomical", mode: "generic_llm", blurb: "Sidereal sign emphasis & dasha-style guidance", tradition: "Indian Jyotish" },
  { id: "chinese_zodiac", label: "Chinese Zodiac & BaZi hint", category: "Astronomical", mode: "generic_llm", blurb: "Animal year, element balance, four pillars overview", tradition: "Chinese metaphysics" },

  // Indian traditions
  { id: "prashna", label: "Prashna Jyotish", category: "Indian Traditions", mode: "generic_llm", blurb: "Horary chart for moment of question — sidereal", tradition: "Indian Jyotish" },
  { id: "panchang", label: "Panchāṅga Day Quality", category: "Indian Traditions", mode: "generic_llm", blurb: "Tithi, nakṣatra, yoga, karaṇa for today", tradition: "Vedic calendar" },
  { id: "ramayana_oracle", label: "Rāmāyaṇa Verse Oracle", category: "Indian Traditions", mode: "generic_llm", blurb: "Random śloka guidance with Sanskrit + English", tradition: "Hindu sacred text" },
  { id: "mahabharata_lots", label: "Mahābhārata Lots", category: "Indian Traditions", mode: "generic_llm", blurb: "Epic verse as oracle — original + translation", tradition: "Itihāsa" },
  { id: "tantra_yantra", label: "Yantra Meditation Hint", category: "Indian Traditions", mode: "generic_llm", blurb: "Contemplative yantra focus — non-operative", tradition: "Tantric contemplative" },
  { id: "ayurveda_dosha", label: "Āyurveda Dosha Read", category: "Indian Traditions", mode: "generic_llm", blurb: "Constitutional hint from described traits — not medical", tradition: "Āyurveda" },
  { id: "mantra_japa", label: "Mantra Japa Guidance", category: "Indian Traditions", mode: "generic_llm", blurb: "Suggest traditional mantra with IAST + English", tradition: "Vedic / bhakti" },

  // Chinese traditions
  { id: "bazi", label: "Bāzì Four Pillars", category: "Chinese Traditions", mode: "generic_llm", blurb: "Year/month/day/hour pillars from birth data", tradition: "Chinese astrology" },
  { id: "ziwei", label: "Zǐ Wēi Dòu Shù hint", category: "Chinese Traditions", mode: "generic_llm", blurb: "Purple Star astrology snapshot", tradition: "Chinese astrology" },
  { id: "feng_shui", label: "Fēngshuǐ Room Read", category: "Chinese Traditions", mode: "describe", blurb: "Describe room layout for qi flow hints", tradition: "Feng shui" },
  { id: "taoist_oracle", label: "Taoist Oracle Verse", category: "Chinese Traditions", mode: "generic_llm", blurb: "Dao De Jing or Zhuangzi line as guidance", tradition: "Daoist philosophy" },
  { id: "plum_blossom", label: "Plum Blossom Numerology", category: "Chinese Traditions", mode: "generic_llm", blurb: "Méihuā Yìshù number oracle", tradition: "Chinese numerology" },
  { id: "qimen", label: "Qí Mén Dùn Jiǎ hint", category: "Chinese Traditions", mode: "generic_llm", blurb: "Strategic timing oracle snapshot", tradition: "Chinese metaphysics" },

  // Japanese traditions
  { id: "omikuji", label: "Omikuji Fortune", category: "Japanese Traditions", mode: "generic_llm", blurb: "Shrine fortune slip style — dai-kichi to kyō", tradition: "Shinto" },
  { id: "renga", label: "Renga / Haiku Oracle", category: "Japanese Traditions", mode: "generic_llm", blurb: "Poetic fragment as seasonal guidance", tradition: "Japanese poetry" },
  { id: "kuji_kiri", label: "Kuji-kiri Contemplative", category: "Japanese Traditions", mode: "generic_llm", blurb: "Nine hand-seals meditation context — curio", tradition: "Shugendō / ninjutsu folklore" },
  { id: "reiki_guidance", label: "Reiki / Ki Flow Hint", category: "Japanese Traditions", mode: "generic_llm", blurb: "Energy balance meditation guidance", tradition: "Japanese ki work" },
  { id: "yokai_omen", label: "Yōkai Folk Omen", category: "Japanese Traditions", mode: "generic_llm", blurb: "Folklore sign reading — entertainment", tradition: "Japanese folk" },

  // Meditation & relaxation
  { id: "pranayama", label: "Prāṇāyāma Session", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Guided Indian breath practice with Sanskrit names", tradition: "Yoga" },
  { id: "yoga_nidra_guide", label: "Yoga Nidrā Script", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Body rotation relaxation with saṅkalpa", tradition: "Tantric yoga" },
  { id: "qigong_session", label: "Qìgōng Flow", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Eight Brocades or standing meditation — Chinese terms", tradition: "Qigong" },
  { id: "zazen_guide", label: "Zazen Sitting Guide", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Shikantaza instructions — Japanese + English", tradition: "Zen" },
  { id: "nembutsu_guide", label: "Nembutsu Chant Guide", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Namu Amida Butsu practice with kanji", tradition: "Pure Land" },
  { id: "body_scan", label: "Progressive Relaxation", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Full body scan — East-West blended", tradition: "Universal" },
  { id: "sound_bath", label: "Mantra / Sound Bath", category: "Meditation & Relaxation", mode: "generic_llm", blurb: "Seed syllables ōṃ, ǎn, hūṃ with translation", tradition: "Indo-Tibetan-Chinese" },

  // Cartomancy
  { id: "tarot", label: "Tarot", category: "Cartomancy", mode: "tarot", blurb: "78-card Rider-Waite deck — spreads with AI reading", tradition: "Hermetic tarot" },
  { id: "lenormand", label: "Lenormand", category: "Cartomancy", mode: "generic_llm", blurb: "36-card petit jeu — blunt practical answers", tradition: "French cartomancy" },
  { id: "playing_cards", label: "Playing-Card Reading", category: "Cartomancy", mode: "generic_llm", blurb: "Standard deck cartomancy (hearts, spades…)", tradition: "European fortune-telling" },
  { id: "oracle_deck", label: "Oracle Cards", category: "Cartomancy", mode: "generic_llm", blurb: "Modern oracle deck message for your question", tradition: "Contemporary" },
  { id: "kipper", label: "Kipper Cards", category: "Cartomancy", mode: "generic_llm", blurb: "19th-c. Bavarian situational cards", tradition: "German Kipper" },
  { id: "mahjong_oracle", label: "Mahjong Oracle", category: "Cartomancy", mode: "generic_llm", blurb: "Tile draw for luck and obstacle reading", tradition: "Chinese folk" },

  // Cleromancy
  { id: "rune", label: "Elder Futhark Runes", category: "Cleromancy & Sortilege", mode: "rune", blurb: "Norse rune cast with magical correspondence", tradition: "Germanic" },
  { id: "iching", label: "I Ching", category: "Cleromancy & Sortilege", mode: "generic_llm", blurb: "Hexagram from coins or yarrow method", tradition: "Chinese Zhou Yi" },
  { id: "ogham", label: "Ogham Staves", category: "Cleromancy & Sortilege", mode: "generic_llm", blurb: "Celtic tree alphabet cast", tradition: "Irish-Gaelic" },
  { id: "bone_throw", label: "Bone / Curio Cast", category: "Cleromancy & Sortilege", mode: "generic_llm", blurb: "Hoodoo bone reading & thrown curios", tradition: "African diaspora" },
  { id: "dice_oracle", label: "Dice Oracle", category: "Cleromancy & Sortilege", mode: "generic_llm", blurb: "Pythagorean or planetary dice throw", tradition: "Classical sortilege" },
  { id: "domino", label: "Domino Reading", category: "Cleromancy & Sortilege", mode: "generic_llm", blurb: "Domino draw for near-term fate", tradition: "Caribbean folk" },
  { id: "lots_bibliomancy", label: "Sortes / Sacred Lots", category: "Cleromancy & Sortilege", mode: "generic_llm", blurb: "Random verse or lot selection", tradition: "Ancient Mediterranean" },

  // Scrying
  { id: "crystal", label: "Crystal Scrying", category: "Scrying & Vision", mode: "generic_llm", blurb: "Describe visions in the sphere", tradition: "John Dee lineage" },
  { id: "mirror", label: "Mirror Scrying", category: "Scrying & Vision", mode: "generic_llm", blurb: "Black mirror or still water visions", tradition: "Renaissance" },
  { id: "water_bowl", label: "Water Scrying", category: "Scrying & Vision", mode: "generic_llm", blurb: "Hydromancy — patterns on water surface", tradition: "Universal" },
  { id: "fire_gazing", label: "Fire / Candle Gazing", category: "Scrying & Vision", mode: "generic_llm", blurb: "Pyromancy flame interpretation", tradition: "Hearth magic" },
  { id: "smoke", label: "Smoke / Capnomancy", category: "Scrying & Vision", mode: "generic_llm", blurb: "Incense smoke shape reading", tradition: "Temple divination" },
  { id: "cloud", label: "Cloud Reading", category: "Scrying & Vision", mode: "generic_llm", blurb: "Nephomancy — sky omens", tradition: "Weather magic" },

  // Physiognomy
  { id: "palm", label: "Palm Reading", category: "Physiognomy & Body", mode: "describe", blurb: "Chiromancy from your line description", tradition: "Western palmistry" },
  { id: "face", label: "Face Reading", category: "Physiognomy & Body", mode: "describe", blurb: "Physiognomy & Chinese Mian Xiang", tradition: "East-West blend" },
  { id: "phrenology", label: "Phrenology Map", category: "Physiognomy & Body", mode: "describe", blurb: "Historical skull mount reading (curio)", tradition: "19th-c. European" },
  { id: "iris", label: "Iridology Hint", category: "Physiognomy & Body", mode: "describe", blurb: "Iris pattern folklore reading — not medical", tradition: "Folk iridology" },
  { id: "foot", label: "Foot Reading", category: "Physiognomy & Body", mode: "describe", blurb: "Reflexology-style symbolic reading", tradition: "Asian-European folk" },

  // Tasseography
  { id: "coffee", label: "Coffee Cup Reading", category: "Tasseography & Food", mode: "describe", blurb: "Turkish/Greek tasseography", tradition: "Ottoman-Greek" },
  { id: "tea", label: "Tea Leaf Reading", category: "Tasseography & Food", mode: "describe", blurb: "British tasseomancy from leaf patterns", tradition: "Victorian" },
  { id: "wine_lees", label: "Wine Lees Reading", category: "Tasseography & Food", mode: "describe", blurb: "Oinomancy sediment patterns", tradition: "Classical" },
  { id: "egg", label: "Egg Cleanse Reading", category: "Tasseography & Food", mode: "describe", blurb: "Curandero egg limpia result interpretation", tradition: "Mexican folk" },

  // Numerology
  { id: "numerology", label: "Numerology Profile", category: "Numerology & Onomancy", mode: "numerology", blurb: "Life path, expression, soul urge from name & birth date", tradition: "Pythagorean-Chaldean" },
  { id: "nameology", label: "Name Analysis", category: "Numerology & Onomancy", mode: "generic_llm", blurb: "Classical onomancy — power of names (non-Kabbalistic)", tradition: "European onomancy" },
  { id: "angel_numbers", label: "Angel Numbers", category: "Numerology & Onomancy", mode: "generic_llm", blurb: "Repeating number synchronicity read", tradition: "New Age numerology" },

  // Bibliomancy
  { id: "bibliomancy", label: "Bibliomancy", category: "Bibliomancy & Sacred Text", mode: "generic_llm", blurb: "Random sacred page or verse", tradition: "Universal" },
  { id: "quran_lots", label: "Quranic Istikhara Style", category: "Bibliomancy & Sacred Text", mode: "generic_llm", blurb: "Islamic guidance lot tradition (curio)", tradition: "Islamic" },
  { id: "torah_lots", label: "Torah / Tanakh Lots", category: "Bibliomancy & Sacred Text", mode: "generic_llm", blurb: "Jewish sortes biblicae style", tradition: "Jewish" },
  { id: "poem_oracle", label: "Poem / Stichomancy", category: "Bibliomancy & Sacred Text", mode: "generic_llm", blurb: "Random poetry line as oracle", tradition: "Literary divination" },

  // Oneiromancy
  { id: "dream", label: "Dream Interpretation", category: "Oneiromancy & Trance", mode: "generic_llm", blurb: "Oneirocritica — symbols from your dream", tradition: "Artemidorus / Jungian" },
  { id: "hypnogogic", label: "Hypnagogic Vision", category: "Oneiromancy & Trance", mode: "generic_llm", blurb: "Threshold state imagery read", tradition: "Shamanic trance" },
  { id: "automatic_writing", label: "Automatic Writing", category: "Oneiromancy & Trance", mode: "describe", blurb: "Interpret flowing text you received", tradition: "Spiritist" },

  // Natural omens
  { id: "augury", label: "Bird Augury", category: "Natural Omens", mode: "generic_llm", blurb: "Roman-style bird flight omen", tradition: "Roman augury" },
  { id: "animal_omen", label: "Animal Omen", category: "Natural Omens", mode: "generic_llm", blurb: "Crossing paths with creature as sign", tradition: "Shamanic" },
  { id: "weather_omen", label: "Weather Omen", category: "Natural Omens", mode: "generic_llm", blurb: "Storm, wind, lightning as message", tradition: "Folk meteoromancy" },

  // Spirit
  { id: "mediumship", label: "Spirit Message", category: "Spirit & Mediumship", mode: "generic_llm", blurb: "Channeled guidance style read (curio)", tradition: "Spiritualist" },
  { id: "ancestor", label: "Ancestor Oracle", category: "Spirit & Mediumship", mode: "generic_llm", blurb: "Honoring the dead for counsel", tradition: "African diaspora / folk" },
  { id: "pendulum", label: "Pendulum / Radiesthesia", category: "Spirit & Mediumship", mode: "describe", blurb: "Yes/no swing patterns you observed", tradition: "European dowsing" },

  // Ceremonial
  { id: "geomancy", label: "Geomancy", category: "Ceremonial Oracle", mode: "generic_llm", blurb: "Sixteen tetragrams from dot figures", tradition: "Medieval European" },
  { id: "ifá", label: "Ifá / Odu Oracle", category: "Ceremonial Oracle", mode: "generic_llm", blurb: "Yoruba Odu Ifá wisdom structure (curio)", tradition: "Yoruba-Ifá" },
  { id: "ifa_kikongo", label: "Kikongo Cosmogram", category: "Ceremonial Oracle", mode: "generic_llm", blurb: "Bakongo sign cycle read", tradition: "Kongo" },
  { id: "enochian_call", label: "Enochian Tablet Draw", category: "Ceremonial Oracle", mode: "generic_llm", blurb: "Dee's angelic watchtower letter draw", tradition: "Enochian" },
  { id: "planetary_oracle", label: "Planetary Oracle", category: "Ceremonial Oracle", mode: "generic_llm", blurb: "Agrippa-style planetary intelligence query", tradition: "Hermetic" },

  // Practical Kabbalah — listed with all methods; UI requires danger acknowledgment on open
  { id: "gematria", label: "Gematria Reading", category: "Practical Kabbalah", mode: "kabbalah", blurb: "Hebrew/Greek letter-number analysis — practical Kabbalah", tradition: "Practical Kabbalah" },
  { id: "tree_path", label: "Tree of Life Path", category: "Practical Kabbalah", mode: "kabbalah", blurb: "Sephiroth pathworking snapshot — highest caution", tradition: "Hermetic Qabalah" },
  { id: "letter_perm", label: "Letter Permutation", category: "Practical Kabbalah", mode: "kabbalah", blurb: "Notarikon / Temurah letter work", tradition: "Practical Kabbalah" },
  { id: "sephir_oracle", label: "Sephirah Oracle", category: "Practical Kabbalah", mode: "kabbalah", blurb: "Daily sephira correspondence reading", tradition: "Practical Kabbalah" },

  ...(MANIFESTATION_CATALOG_ENTRIES as DivinationMethod[]),
];

export function divinationsByCategory() {
  const map = new Map<string, DivinationMethod[]>();
  for (const cat of DIVINATION_CATEGORIES) map.set(cat, []);
  for (const d of DIVINATION_CATALOG) {
    map.get(d.category)?.push(d);
  }
  return map;
}

export function getDivination(id: string) {
  return DIVINATION_CATALOG.find((d) => d.id === id);
}
