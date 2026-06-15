# 🔮 MagusME — Divination Systems Roadmap

> **使命**: Every system on MagusME gets *tarot-quality treatment* — complete authentic data (not LLM prompts), proper spreads and techniques, unique interactive UI, and real educational depth. We are building **the most comprehensive digital divination library on the web**.

---

## 📋 Status Dashboard

| Tier | Count | Status |
|------|-------|--------|
| ✅ **Complete** (full data + custom page) | 5 | Tarot, Runes, I Ching, Lenormand, Playing Cards |
| 🟡 **Generic** (uses GenericDivinationPage, LLM-driven) | 75 | Needs authentic data |
| 🔲 **Not started** (no route exists) | 3 | All generic systems have routes |
| **Total** | **81** | |

### Legend
- 🏆 = Full authentic data + custom page (tarot-level)
- 📦 = Data file done, needs custom page
- 🖼 = Needs photo upload
- 📝 = Needs research
- 🤖 = Currently LLM-only (generic)
- ⏸ = Low priority

---

## 🎯 Architecture: The Unified Oracle Page

### Current Flow
```
/consult                    → ConsultPage (system grid browser)
/consult/tarot              → TarotPage 🏆
/consult/runes              → RuneConsultPage 🏆
/consult/iching             → IChingPage 🏆
/consult/astrology          → AstrologyConsultPage (needs work)
/consult/astro-watch        → AstroWatchPage (needs work)
/consult/lenormand          → LenormandPage 🏆
/consult/{74+ systems}      → GenericDivinationPage [🤖 LLM-only]
```

### Target Flow
```
/consult                            → ConsultPage (system grid, unchanged)
/consult/{systemId}                 → UnifiedOraclePage 🏗
  ├── mode = "card-draw"            → Tarot, Lenormand, Playing Cards, Kipper, Mahjong, Runes, Ogham, Oracle, Domino
  ├── mode = "hexagram"             → I Ching, Plum Blossom
  ├── mode = "form"                 → Numerology, Name Analysis, Angel Numbers, Ba Zi, Panchanga
  ├── mode = "photo-upload" 🖼      → Palm, Face, Foot, Coffee, Tea, Egg, Iridology
  ├── mode = "describe"             → Crystal, Mirror, Water, Fire, Smoke, Cloud, Dreams, Augury, Animals, Weather
  ├── mode = "scatter"              → Bone Reading, Dice, Sacred Lots
  ├── mode = "bibliomancy"          → Bibliomancy, Quran, Torah, Poem, Ramayana, Mahabharata, Taoist
  ├── mode = "ceremonial"           → Geomancy, Ifá, Enochian, Planetary, Kikongo
  ├── mode = "guided"               → Pranayama, Yoga Nidra, Qigong, Zazen, Nembutsu, Body Scan, Sound Bath
  └── mode = "shrine"               → Omikuji

# Specialized pages stay — power users love them
/consult/tarot              → TarotPage (preserved)
/consult/runes              → RuneConsultPage (preserved)
/consult/iching             → IChingPage (preserved)
```

### 🏗 Build Queue — Infrastructure Components

| Widget | Status | Systems Served |
|--------|--------|---------------|
| `UnifiedOraclePage.tsx` | 🔲 Not started | All 81 (mode router) |
| `OracleCardDraw.tsx` | ✅ Reuse GenericDivinationPage card logic | 10 systems |
| `LenormandPage.tsx` | ✅ Complete — 36 cards, 4 spread types, pairs | 1 system |
| `OraclePhotoUpload.tsx` 🖼 | 🔲 Build | 7 systems (palm, face, foot, coffee, tea, egg, iris) |
| `OracleScatter.tsx` | 🔲 Build | Bone, Dice, Lots |
| `OracleBibliomancy.tsx` | 🔲 Build | 7 text-corpus systems |
| `OracleCeremonial.tsx` | 🔲 Build | Geomancy shield chart, Enochian tablet |
| `OracleGuided.tsx` | 🔲 Build | 7 meditation/relaxation |
| `OracleForm.tsx` | 🔲 Build | 5 form-based systems |
| `OracleShrine.tsx` | 🔲 Build | Omikuji |
| `OracleHexagram.tsx` | 🔲 Build | I Ching, Plum Blossom |

---

## 📸 Photo Upload Architecture 🖼

### Systems

| System | Photo Input | Interactive Overlay | Est. Complexity |
|--------|------------|-------------------|-----------------|
| Palm Reading | Hand photo | Clickable lines (life/head/heart/fate) + mounts | Medium |
| Face Reading | Face photo | Clickable zones (forehead/nose/chin/cheeks + 100 Mian Xiang points) | Medium |
| Foot Reading | Foot photo | Clickable reflexology zones | Low |
| Coffee Cup Reading ☕ | Cup photo | Symbol markers overlaid on grounds pattern | High |
| Tea Leaf Reading 🍵 | Cup photo | Leaf symbol markers | Medium |
| Egg Cleanse Reading 🥚 | Glass photo | Yolk pattern markers (bubbles/threads/shapes) | Medium |
| Iridology 👁 | Eye photo | Iris zone map overlay | Low |

### Component Spec
```
OraclePhotoUpload.tsx
├── DropZone / FileInput
│   └── Client-side resize (max 800px, WebP)
├── ImagePreview
│   └── Responsive: 80% width desktop, 100% mobile
├── RegionSelector (optional per system)
│   └── SVG overlay with path-based click zones
│   └── Highlights selected region
├── SymbolOverlay (coffee/tea/egg only)
│   └── Renders 5-12 symbol icons at random positions
│   └── Each symbol links to its tradition meaning
└── InterpretationPanel
    └── Reads from system's data file (not LLM)
    └── Renders card-style meaning + tradition notes
```

---

## 📚 Data Files — Complete List

### Model: tarotCardData.ts 🏆
```typescript
interface CardMeaning {
  id: string
  glyph: string
  title: string
  uprightMeaning: string     // 2-3 paragraphs (150-300 words)
  reversedMeaning?: string   // 1-2 paragraphs (100-200 words)
  keywords: string           // comma-separated, authentic associations
  symbolism?: string         // actual card imagery elements
  tradition?: string         // RWS | Thoth | Marseille
}
export function getMeaning(systemId: string, cardId: string): CardMeaning | undefined
export function getAllMeanings(systemId: string): CardMeaning[]
```

### Data Files To Create

| # | File | Items | Est. Size | Priority |
|---|------|-------|-----------|----------|
| ✅ | `tarotCardData.ts` | 78 cards | ~45KB | DONE |
| ✅ | `runeData.ts` | 24 runes | ~15KB | DONE |
| ✅ | `ichingData.ts` | 64 hexagrams | ~40KB | DONE |
| ✅ | `lenormandData.ts` | 36 cards | ~35KB | DONE 🏆 |
| 🔲 | `coffeeSymbolData.ts` | 100+ symbols | ~25KB | 🔴 HIGH |
| 🔲 | `palmHandData.ts` | 4 shapes, 7 lines, 7 mounts | ~15KB | 🔴 HIGH |
| 🔲 | `eggPatternData.ts` | 21 patterns | ~8KB | 🔴 HIGH |
| 🔲 | `faceMapData.ts` | 10+ zones | ~10KB | 🔴 HIGH |
| 🔲 | `playingCardsData.ts` | 52 cards | ~25KB | 🟡 MED |
| 🔲 | `teaSymbolData.ts` | 50+ symbols | ~12KB | 🟡 MED |
| 🔲 | `footMapData.ts` | 4 shapes, 5 toes | ~6KB | 🟡 MED |
| 🔲 | `iridologyMapData.ts` | ~20 zones | ~5KB | 🟡 MED |
| 🔲 | `oracleCardData.ts` | 44 cards | ~20KB | 🟡 MED |
| 🔲 | `kipperData.ts` | 36 cards | ~18KB | 🟡 MED |
| 🔲 | `oghamData.ts` | 25 staves | ~12KB | 🟡 MED |
| 🔲 | `omikujiData.ts` | 12 fortune grades | ~5KB | 🟡 MED |
| 🔲 | `geomancyData.ts` | 16 figures | ~10KB | 🟡 MED |
| 🔲 | `angelNumberData.ts` | 27 sequences | ~6KB | 🟡 MED |
| 🔲 | `numerologyData.ts` | 9+3 master numbers | ~10KB | 🟡 MED |
| 🔲 | `boneData.ts` | ~20 objects | ~8KB | ⏸ LOW |
| 🔲 | `diceData.ts` | 6 faces × 7 polyhedra | ~10KB | ⏸ LOW |
| 🔲 | `dominoData.ts` | 28 tiles | ~8KB | ⏸ LOW |
| 🔲 | `mahjongData.ts` | 144 tiles | ~40KB | ⏸ LOW |
| 🔲 | `planetaryData.ts` | 7 planets | ~6KB | ⏸ LOW |
| 🔲 | `textCorpusData.ts` | 100+ texts | ~30KB | ⏸ LOW |
| 🔲 | `yokaiData.ts` | ~30 creatures | ~8KB | ⏸ LOW |

---

## 🧠 Agent Prompts — Research Library

Copy-paste these into any AI agent to research each system before implementation.

### Research Agent Template
```
You are a research assistant for a digital divination library (MagusME).
Research {SYSTEM} and return a structured report covering:

1. HISTORY & ORIGIN — where/when/who created it, cultural context, etymology of name
2. AUTHENTIC TECHNIQUES — every traditional method, casting/reading procedure, spread/layout names
3. ALL CARD/ELEMENT/SYMBOL MEANINGS — complete list with:
   - Name/id, glyph/symbol
   - Upright meaning (2-3 rich paragraphs, 150-300 words)
   - Reversed/merkstave meaning if applicable (1-2 paragraphs, 100-200 words)
   - Keywords (authentic traditional keywords, comma-separated, 5-10)
   - Symbolism/imagery description (what appears on the card/object)
   - Element/color/astrological association if applicable
4. VARIANTS — regional traditions, deck variations, school differences
5. TECHNIQUE DETAILS — for each spread/reading method: card count, position names, what each position means, how cards interact
6. COMMON MISCONCEPTIONS — what pop culture gets wrong, what online tools oversimplify
7. VISUAL REFERENCES — what authentic tools/cards/setups look like

Return the complete data in valid JSON format matching this interface:
{
  "systemName": string,
  "history": string,
  "techniques": [{ name: string, description: string, cardCount?: number, positions?: string[] }],
  "traditions": string[],
  "variants": [{ name: string, description: string }],
  "cards": [{ id: string, glyph: string, title: string, uprightMeaning: string, reversedMeaning?: string, keywords: string, symbolism?: string, element?: string, astro?: string, tradition?: string }],
  "misconceptions": string[],
  "sources": string[]
}

IMPORTANT: All meanings must be authentic traditional content, NOT generic AI-sounding text. Every paragraph must contain verifiable traditional interpretations from published sources (Rider-Waite, Golden Dawn, Mathers, Crowley, etc.).
```

### 🔴 HIGH Priority — Ready-to-Copy Prompts

#### Lenormand
```
Research the 36-card Petit Lenormand system. I need ALL 36 cards with full upright meanings (2-3 paragraphs each), keywords, and symbolism. Include:
- The Grand Tableau (9×4 grid) with house system (each position = numbered house, card placed in that house modifies meaning)
- 5-card spread, 9-card (3×3) spread, 3-card spread
- Mirroring (cards reflect across axes), Knighting (card visits another position), Near/Far method
- Pairs/Combinations — essential technique, cards are always read in pairs
- French vs German vs English school differences
- Playing card equivalents for each card
- Color method (red/black)
```

#### Coffee Cup Reading (Turkish Kahve Falı)
```
Research Turkish/Greek coffee cup reading (kahve falı / kafemanteia). I need:
- Complete history: ~500 years, Ottoman arrival of coffee
- ALL traditional symbols (100+) each with: name, meaning (2-3 sentences), whether it's positive/negative/neutral
- The 6 sections of the cup (top rim = present, middle = general, bottom = far future) plus the handle (querent/home)
- Turn-over procedure: how the cup is turned onto saucer, waiting time, reading direction (handle to opposite)
- Regional variants: Turkish vs Greek vs Lebanese symbol sets
- 21 most common symbol categories: snake, fish, bird, tree, mountain, eye, heart, house, road, cross, moon, sun, star, baby, ring, letter, knife, bridge, anchor, ladder, flower
```

#### Palm Reading (Chiromancy)
```
Research Western chiromancy (palm reading). I need complete data for:
- HAND SHAPES (4 types): Earth (square palm/short fingers), Air (square palm/long fingers), Water (long palm/long fingers), Fire (long palm/short fingers) — each with personality description, element, career tendency
- MAJOR LINES (4+): Life line (curving around thumb), Heart line (top across), Head line (middle), Fate line (vertical middle), Sun/Apollo line (under ring finger) — each with: what it represents, variations (long/short/deep/faint/broken/forked/chained/islands), meaning for each variation
- MINOR LINES: Marriage line (edge under pinky), Health line (below pinky to wrist), Girdle of Venus, Bracelet lines (wrist)
- MOUNTS (7+): Venus (thumb base = passion), Jupiter (index base = ambition), Saturn (middle base = wisdom), Apollo (ring base = creativity), Mercury (pinky base = communication), Mars (center/edge of palm = courage/anger), Moon (heel of palm = intuition) — each with: location description, positive traits when prominent, negative traits when underdeveloped
- FINGER ANALYSIS: finger lengths ratio (2D:4D), finger shape (smooth/knotted), fingertip shape (pointed/conical/square/spatulate), thumb flexibility and shape
- TEXTS ON PALM: markings (stars, crosses, squares, triangles, islands, grilles) — meaning per mark
- VEDIC PALMISTRY DIFFERENCES: 8 planets instead of 7 mounts, astrological markings emphasis
- CHINESE PALMISTRY DIFFERENCES: more lines, different emphasis on finger lengths
```

### 🟡 MEDIUM Priority

#### Playing Cards (52-Card Cartomancy)
```
Research 52-card standard deck cartomancy. I need ALL 52 cards with full meanings. Include:
- Suit meanings: Hearts (emotions/water), Clubs (action/fire), Diamonds (money/earth), Spades (wisdom/air)
- Number meanings for each suit position (Ace through 10 plus Jack/Queen/King)
- Regional variants: English (52), French Piquet (32), Italian (40), Spanish (40/48), German (32), Russian (36)
- Red vs black polarity
- Spreads: single, 3-card, 5-card cross, 9-card grid, horseshoe, 13-card year
- Adjacent card interaction rules
- Each card needs: title, glyph (unicode suit char), upright meaning (2 paragraphs), reversed meaning (1 paragraph), keywords, element
```

#### Egg Cleanse Reading (Limpia con Huevo)
```
Research Curandero/Espiritismo egg cleansing (limpia con huevo). I need complete data on:
- History: Mesoamerican + Spanish Catholic syncretic tradition
- COMPLETE PROCEDURE: how to pass egg over body (head to feet, specific patterns), how to break into water glass, reading time (15-20 minutes after breaking)
- ALL 21+ PATTERNS with name, description of appearance in glass, meaning (2-3 paragraphs each), severity level:
  - Yolk intact/clear white = clean, no negative energy
  - Yolk split = conflict, divided energy
  - Bubbles rising from yolk = negative energy being released
  - Bubbles on surface = eye-related issues (mal de ojo)
  - White rising like a cloud = protection forming
  - Thread-like strands = spiritual attachments
  - Needle-like points = directed negative energy
  - Faces in yolk = spirit presence
  - Blood spots = deep spiritual issue
  - Yolk sunk to bottom = heavy energy, depression
  - White completely separated = fragmentation, scattered energy
  - Scrambled appearance = chaos, confusion
  - Cross/crucifix shape = spiritual protection needed
  - Eye shape = mal de ojo (evil eye) confirmed
  - Skull shape = ancestral communication
  - Heart shape = emotional wounding
  - Snake shape = envy/jealousy
  - Star shape = positive spiritual blessing
  - Moon/crescent = feminine spiritual energy
  - Sun shape = vitality restored
  - Multiple yolks = pregnancy or creative fertility
- Regional variants: Mexican vs Puerto Rican vs Cuban traditions
- Disposal methods: flush down toilet vs bury in earth vs throw at crossroads
```

#### Omikuji (Shrine Fortune Slips)
```
Research Japanese Shinto omikuji fortune slips. I need:
- Complete history: Shinto shrine tradition, origin in Heian period
- ALL FORTUNE GRADES (12): Dai-kichi (great blessing), Kichi (blessing), Chu-kichi (middle blessing), Sho-kichi (small blessing), Sue-kichi (later blessing), Kichi (blessing), Han-kichi (half blessing), Moto-sue-kichi (beginning-ending blessing), Sue-sue-kichi (later-later blessing), Kyo (curse), Dai-kyo (great curse), Sho-kyo (small curse), Han-kyo (half curse)
  Each grade with: Japanese name + romanization, English translation, general meaning (2-3 sentences), frequency (dai-kichi is rare)
- SPECIFIC CATEGORIES on each slip: general fortune, wish, waiting person, lost article, travel, business, study, health, love/relationship, marriage, childbirth, house removal, dispute, direction
  Each category has numbered responses (1-12) varying by grade
- SHRINE VARIANTS: how different shrines (Meiji Jingu, Senso-ji, Fushimi Inari, etc.) have different omikuji traditions
- BAD FORTUNE RITUAL: tying to trees/wires at shrine to neutralize
- READING PROCEDURE: shake numbered stick from box → match to drawer → receive paper
- Ema plaques tradition as related practice
```

### ⏸ LOW Priority (simple data queries)

#### Ogham Staves
```
Research the 25-letter Ogham Celtic tree alphabet. I need all 25 staves (20 aicmí + 5 forfeda) with full meanings, tree associations, and kennings. Include 4 aicmí (families), single stave draw, 3-stave spread, 5-stave cross, Ogham cast (throw all, read face-up).
```

#### Bone Reading (Hoodoo/Conjure)
```
Research African diaspora bone reading tradition. Not standardized — practitioner's collection of ~20 symbolic objects (bones, shells, stones, coins, keys, claws, teeth, beads, buttons, rings). Each object needs: name, traditional folk meaning (2-3 paragraphs), positive/negative/neutral polarity. Include cast procedure, cluster reading, proximity interpretation.
```

#### Geomancy
```
Research Medieval geomantic divination (ilm al-raml). I need complete data on all 16 figures (Via, Populus, Cauda Draconis, Caput Draconis, Puer, Puella, Fortuna Maior, Fortuna Minor, Acquisitio, Amissio, Laetitia, Tristitia, Rubeus, Albus, Coniunctio, Carcer) with:
- Dot pattern (4 rows of 1-2 dots each)
- Element, zodiac sign, planetary ruler
- Upright meaning (2 paragraphs), reversed meaning
- Keywords
- Shield chart construction process: 4 mothers → 4 daughters → 4 nieces → 2 witnesses → 1 judge → 1 superjudge
- 12 house meanings in geomantic chart
```

#### Numerology Profile
```
Research Pythagorean and Chaldean numerology. I need all 9 numbers (1-9) plus master numbers (11, 22, 33) with:
- Pythagorean meaning (2 paragraphs), Chaldean meaning (2 paragraphs)
- Positive and shadow traits
- Career paths, life themes, karmic lessons
- Color, element, planetary association
- Calculation methods: Life Path, Expression, Soul Urge, Personality, Birth Day, Maturity, Personal Year/Month/Day, Pinnacles, Challenges
- Chaldean vs Pythagorean differences in letter-to-number mapping
```

---

## 📋 Data Completeness Tracker

### Full Authentic Data (tarot-level: 2-3 paragraphs per item)
```
[████████████████░░] Tarot        78/78  ✅
[████████████████░░] Runes        24/24  ✅
[████████████████░░] I Ching      64/64  ✅
[████████████████░░] Lenormand    36/36  ✅ 🏆
[████████████████░░] Playing Cards 52/52  🏆
[░░░░░░░░░░░░░░░░░░] Oracle        0/44  🔲
[░░░░░░░░░░░░░░░░░░] Kipper        0/36  🔲
[░░░░░░░░░░░░░░░░░░] Ogham         0/25  🔲
[░░░░░░░░░░░░░░░░░░] Omikuji       0/12  🔲
[░░░░░░░░░░░░░░░░░░] Angel Nums    0/27  🔲
[░░░░░░░░░░░░░░░░░░] Geomancy      0/16  🔲
[░░░░░░░░░░░░░░░░░░] Coffee Syms   0/100 🔲
[░░░░░░░░░░░░░░░░░░] Tea Syms      0/50  🔲
[░░░░░░░░░░░░░░░░░░] Egg Patterns  0/21  🔲
```

### Systems Complete: ████████████░░░░░░░░ 4/81 (4.9%)

---

## 📦 Implementation Phases

### Phase 0 — Infrastructure 🏗
**Goal**: Build the unified page + photo upload + all widget components

| Task | Est. Time | Depends On |
|------|-----------|-----------|
| Build `UnifiedOraclePage.tsx` with mode router | 2h | — |
| Build `OraclePhotoUpload.tsx` 🖼 | 3h | — |
| Convert all generic routes to use UnifiedOraclePage | 30m | UnifiedOraclePage |
| Build `OracleScatter.tsx` | 1.5h | — |
| Build `OracleBibliomancy.tsx` | 1h | — |
| Build `OracleCeremonial.tsx` | 2h | — |
| Build `OracleGuided.tsx` | 1h | — |
| Build `OracleForm.tsx` | 1.5h | — |
| Build `OracleShrine.tsx` | 1.5h | — |
| Build `OracleHexagram.tsx` | 2h | — |
| **Total** | **16h** | |

### Phase 1 — Content + Photo Systems 🔴 HIGH
**Goal**: 10 most impactful systems with full authentic data

| # | System | Data File | Widget | Research Agent | Est. Time |
|---|--------|-----------|--------|---------------|-----------|
| 1 | **Lenormand** 🏆 | `lenormandData.ts` (36 cards) | `LenormandPage.tsx` | ✅ COMPLETE | ✅ DONE |
| 2 | **Coffee Cup** ☕ | `coffeeSymbolData.ts` (100+) | PhotoUpload | 📋 Use Coffee prompt | 5h |
| 3 | **Palm Reading** ✋ | `palmHandData.ts` (4+7+7) | PhotoUpload | 📋 Use Palm prompt | 5h |
| 4 | **Egg Cleanse** 🥚 | `eggPatternData.ts` (21) | PhotoUpload | 📋 Use Egg prompt | 3h |
| 5 | **Face Reading** 👤 | `faceMapData.ts` (10+) | PhotoUpload | Use Mian Xiang research | 4h |
| 6 | **Tea Leaf** 🍵 | `teaSymbolData.ts` (50+) | PhotoUpload | Use similar to Coffee prompt | 3h |
| 7 | **Foot Reading** 🦶 | `footMapData.ts` (4+5) | PhotoUpload | Simple — reflexology research | 2h |
| 8 | **Iridology** 👁 | `iridologyMapData.ts` (20) | PhotoUpload | Simple | 1.5h |
| 9 | **Playing Cards** 🂡 | `playingCardsData.ts` (52) | CardDraw | 📋 Use Playing Cards prompt | 4h |
| 10 | **Omikuji** 🎋 | `omikujiData.ts` (12) | Shrine | 📋 Use Omikuji prompt | 2.5h |
| | **Total Phase 1** | | | | **34h** |

### Phase 2 — Deck Systems 🟡 MED

| # | System | Items | Widget | Est. Time |
|---|--------|-------|--------|-----------|
| 11 | Oracle Cards | 44 | CardDraw | 3h |
| 12 | Kipper | 36 | CardDraw | 3h |
| 13 | Ogham | 25 | CardDraw | 2h |
| 14 | Bone Reading | ~20 | Scatter | 3h |
| 15 | Dice | 6×7 | Scatter | 2h |
| 16 | Domino | 28 | CardDraw | 2h |
| 17 | Mahjong | 144 | CardDraw | 6h |
| | **Total Phase 2** | | | **21h** |

### Phase 3 — Form + Ceremonial + Text Systems 🟡 MED

| # | System | Type | Est. Time |
|---|--------|------|-----------|
| 18 | Numerology | Form | 4h |
| 19 | Name Analysis | Form | 1.5h |
| 20 | Angel Numbers | Form | 1.5h |
| 21 | Geomancy | Ceremonial | 5h |
| 22 | Bibliomancy | Bibliomancy | 2h |
| 23 | Poem Oracle | Bibliomancy | 2h |
| 24 | Planetary Oracle | Ceremonial | 2h |
| 25 | Ifá / Odu | Ceremonial | 3h |
| 26 | Enochian | Ceremonial | 2h |
| 27 | Kikongo | Ceremonial | 1.5h |
| 28 | Taoist Oracle | Bibliomancy | 1.5h |
| | **Total Phase 3** | | | **26h** |

### Phase 4 — Astronomical + Asian Systems 🔵

| # | System | Est. Time |
|---|--------|-----------|
| 29-35 | Western Astrology (Natal, Horary, Electional, Synastry) | 15h |
| 36 | Vedic Jyotish | 6h |
| 37 | Chinese Zodiac | 3h |
| 38 | Ba Zi | 5h |
| 39 | Zi Wei Dou Shu | 5h |
| 40-42 | Feng Shui, Plum Blossom, Qi Men | 6h |
| 43-54 | Indian Traditions (7) + Other Asian (5) + Spirit (3) | 20h |
| | **Total Phase 4** | | **60h** |

### Phase 5 — Scrying + Omen + Guided Systems ⏸

| # | Systems | Est. Time |
|---|---------|-----------|
| 55-60 | Scrying (Crystal, Mirror, Water, Fire, Smoke, Cloud) | 12h |
| 61-63 | Omens (Dreams, Augury, Animals, Weather) | 6h |
| 64-70 | Guided (Pranayama, Yoga Nidra, Qigong, Zazen, Nembutsu, Body Scan, Sound Bath) | 7h |
| | **Total Phase 5** | | **25h** |

### Grand Total: ~182 hours

---

## 🔄 Research → Implementation Workflow

### For Each System
```
Step 1: RESEARCH (via agent prompt above)
  ├── Agent returns: history, techniques, ALL card/symbol meanings in JSON
  └── Save to: src/shared/research/{systemId}.json

Step 2: CREATE DATA FILE
  ├── Pattern from: tarotCardData.ts
  ├── Export: getMeaning(systemId, cardId), getAllMeanings(systemId)
  ├── Include: TITLE_INDEX aliases if needed (like Thoth/Marseille names → RWS)
  └── File: src/client/pages/{systemId}Data.ts

Step 3: REGISTER IN divinationSystems.ts
  ├── Set generic: false (removes from GenericDivinationPage)
  └── Set mode: "card-draw" | "photo-upload" | "form" | etc.

Step 4: VERIFY
  ├── HTTP 200 on /consult/{systemId}
  ├── Card/symbol data renders without generic text
  ├── Check for LLM buzzwords ("gateway", "manifest", "energy", "vibrational")
  └── Bundle size reasonable (tarot = 45KB baseline)
```

### Content Quality Checklist (BEFORE marking a system complete)
```
□ Each card/item has 2-3 paragraphs of meaning (not 1 sentence)
□ Reversed/merkstave meaning exists where applicable
□ Keywords are authentic traditional (not "energy", "manifest", "vibrational")
□ Symbolism references actual card imagery
□ Spreads work and render correct card count
□ No AI/generic-sounding text remains
□ All variants documented (regional/school differences)
```

---

## 🚫 Anti-Patterns — What We DON'T Do

| Anti-Pattern | Why | Instead |
|-------------|-----|---------|
| LLM-generated card meanings | Generic, samey, lacks tradition depth | Write authentic meanings from published sources |
| "The cards suggest..." wrapping | Fluff that pads without adding meaning | Direct card content: title, keywords, symbolism, then full text |
| Same interpretation style for all systems | Each tradition has unique voice | Match tone to tradition (blunt for Lenormand, poetic for omikuji, clinical for geomancy) |
| Single generic page forever | Every system deserves unique UI | Each system graduates to its own experience |
| Ignoring reversals/merkstave | Drops 50% of depth | All card systems include reversed meanings |
| Buzzword reliance ("energy", "vibrational", "gateway") | Marks content as AI-generated | Use tradition-specific terminology |

---

## 🧪 Test Commands

```bash
# Verify system renders
curl -s http://localhost:5173/consult/lenormand | grep -c "HTTP"

# Check no generic fallback words in card data
rg -l "gateway|manifest.*energy|vibrational" src/client/pages/*Data.ts

# Verify build
npm run build

# Bundle analysis
npx vite-bundle-visualizer
```

---

## 🏁 Quick-Start Checklist

When starting work on a new system:
```
[ ] Copy agent prompt → run against AI → get research JSON
[ ] Save JSON to src/shared/research/{systemId}.json
[ ] Create {systemId}Data.ts with all card/item meanings
[ ] Register in divinationSystems.ts (generic: false, correct mode)
[ ] Update UnifiedOraclePage to handle this mode (if new mode)
[ ] If photo system: add upload config in OraclePhotoUpload
[ ] Test: HTTP 200, correct card count, no generic text
[ ] Update this roadmap: mark system as ✅
```

## 📜 History & Sources Requirement

Every completed oracle **must include** a dedicated History & Sources section in its page, following this format:

```tsx
/* ─── History Section (at bottom) ─── */
function HistorySection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-indigo-400/60" />
          <span className="text-xs font-semibold text-white/70">History of [Oracle Name]</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          {/* Each major section: chronological history + interesting facts + best-use guide */}
          {/* Sources & Further Reading list at the end */}
        </div>
      )}
    </div>
  );
}
```

### Content requirements for History section:
1. **Historical origins** — Where and when the system originated (with dates)
2. **Key figures** — Who developed/popularized it (with biographical context)
3. **Evolution** — How the system changed over time (regional variants, major reinterpretations)
4. **Interesting facts** — Pop culture moments, famous practitioners, unusual trivia (Nancy Reagan's tarot readers, Aleister Crowley's Thoth, etc.)
5. **When to use this system** — Practical guidance on which questions suit the oracle best
6. **Sources & Further Reading** — 8-12 cited works (books, historical decks, online resources) with descriptions

### Data file pattern:
Extract history text into a dedicated `{systemId}History.ts` file with typed sections:
```typescript
export interface HistorySection {
  title: string;
  paragraphs: string[];
}
```

### Check:
- [ ] History section exists as collapsible at bottom of page
- [ ] At least 6 historical sections (origins, key figures, evolution, fun facts, best-use, sources)
- [ ] All facts cite sources
- [ ] History data is in a separate `{system}History.ts` file (not inline in the page)

---

*Last updated: 2026-06-15*
*Next: 🂡 Playing Cards (52-Card Cartomancy) — traditional English cartomancy with spreads*
