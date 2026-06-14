# MagusME — Divination Systems Roadmap

> **Philosophy**: Each divination system on MagusME must be treated as a complete tradition with its own history, authentic techniques, variant methods, and visual language. The goal is not to slap an LLM prompt on 79 systems, but to build **the most comprehensive digital divination library on the web** — where every system feels as rich and authentic as the tarot page, with unique UI, proper spreads, real card/rune/symbol data, and educational depth.

## Approach

### Phase 1: Foundation (done)
- Tarot: 35 decks, RWS/Thoth/Marseille, Celtic Cross/Horseshoe/Single/Yes-No, deck gallery with per-deck hue coloring, card browser
- Generic page: spread selector, deck style picker, interpretation, browse

### Phase 2: Deepen each system one at a time (current)
Each system gets researched, designed, and implemented individually. No two systems share a generic page forever — each graduates to its own custom experience.

### Phase 3: Cross-system synthesis
Compare readings across traditions, blend systems, AI-assisted pattern recognition.

---

## Cartomancy (6 systems)

### 1. Tarot ✅ (DONE — 35 decks, 3 traditions, 4+ spreads)
- **Research**: RWS (1909, Waite/Smith, Golden Dawn lineage), Thoth (Crowley/Harris, Thelemic/Kabbalistic), Marseille (17th C French pip-based)
- **Authentic techniques**: Celtic Cross (10-card), Horseshoe (7-card), Three-card (past/present/future), Yes/No (3-card verdict), Elemental dignities (Golden Dawn), Directional reading (Marseille gaze technique), Card interaction clusters
- **Variants**: Grand Tableau (78-card), Zodiac spread (13-card), Planetary spread (7-card), Year Ahead (13-card), Opening of the Key (Golden Dawn complex)
- **Implemented**: ✅ Deck gallery (35 decks), ✅ Per-deck hue colors, ✅ 4 spreads, ✅ Card browser, ✅ Thoth/Marseille naming
- **Next**: Grand Tableau spread, Year Ahead spread, Elemental dignity visualization, Card comparison mode, Reversal learning mode

### 2. Lenormand 🔲 (NOT STARTED — generic only)
- **Research**: 36-card Petit Lenormand, 19th C German/French tradition, "Playing cards for the home" — originated as a card game (Das Spiel der Hoffnung) that became divination
- **Authentic techniques**:
  - **Grand Tableau (9×4 or 8×4+4)**: All 36 cards in grid — the definitive Lenormand reading
  - **5-card spread**: Central card + 4 surrounding for quick insight
  - **3-card spread**: Past-present-future or situation-action-outcome
  - **9-card spread (3×3)**: Medium-depth reading with houses
  - **Mirroring**: Cards reflect across horizontal/vertical axes for additional meaning
  - **Knighting**: The card "visiting" another card's position
  - **Houses**: Each position is a "house" numbered 1-36, card placed in that house modifies meaning (House system is the core technique)
  - **Near/Far method**: Proximity to significator determines strength
  - **Diagonal reading**: Extra meaning along diagonals
  - **Pairs/Combinations**: Essential — Lenormand cards are always read in pairs, never alone
- **Variants**: Traditional GT (8×4+4 with extra row, slower/meditative), Modern GT (9×4, faster/more detail), Color method (red/black card meanings), Value method (card numerical values), French vs German vs English schools
- **Card meanings**: 36 specific images (Rider, Clover, Ship, House, Tree, Clouds, Snake, Coffin, Bouquet, Scythe, Whip, Birds, Child, Fox, Bear, Stars, Stork, Dog, Tower, Garden, Mountain, Crossroads, Mice, Heart, Ring, Book, Letter, Man, Woman, Lily, Sun, Moon, Key, Fish, Anchor, Cross)
- **Suits**: Hearts (6), Clubs (6), Spades (7? check), Diamonds (7? check) — each card also has a playing card equivalent
- **Implementation phases**:
  - **Phase 1**: 36-card deck data with authentic meanings, 5-card spread, shuffle/draw, interpretation
  - **Phase 2**: 9-card (3×3) spread with house system, pair interpretation, basic verdict
  - **Phase 3**: Grand Tableau (36-card full grid) — requires significant UI work for the grid layout with mirroring/knighting/houses
  - **Phase 4**: All 36 cards selectable as significator, full Near/Far, diagonal reading
- **Unique UI needs**: Grid-based layout (not linear), card positions with house numbers, significator highlighting, pair combination display
- **Target**: Custom page (not generic)

### 3. Playing Cards 🔲 (NOT STARTED — generic only)
- **Research**: 52-card standard deck divination, 14th C Mamluk origins, European folk tradition
- **Authentic techniques**:
  - **Suit meanings**: Hearts (emotions/love/relationships — water), Clubs (action/work/business — fire), Diamonds (money/career/resources — earth), Spades (wisdom/conflict/transformation — air)
  - **Number meanings**: Aces (new beginnings), 2s (decisions), 3s (creativity), 4s (stability), 5s (conflict), 6s (harmony), 7s (reflection), 8s (power), 9s (completion), 10s (cycles ending), Jacks (youth/messages), Queens (feminine power), Kings (authority)
  - **Color meanings**: Red (positive), Black (challenging)
  - **Adjacent card interaction**: cards read as pairs and triples
- **Variants by region**:
  - **English (52 cards)**: Full deck, detailed meanings
  - **French (32 cards)**: Ace + 7-10 + face cards (Piquet deck)
  - **Italian (40 cards)**: Ace-7 + face cards
  - **Spanish (48/40 cards)**: Copas/Oros/Bastos/Espadas, Sota/Caballo/Rey
  - **German (32 cards)**: Herz/Karo/Kreuz/Pik, Bube/Dame/König
  - **Russian (36 cards)**: Ace + 6-10 + face cards — commonly used in Russian fortune telling
- **Spreads**: Single card, Three-card (past/present/future), 5-card cross, 9-card (3×3 grid), Horseshoe (7-card), Celtic Cross adaptation (10-card), 13-card year spread
- **Implementation phases**:
  - **Phase 1**: 52 card meanings data (suit × rank matrix), card images with standard Unicode suits, 3 spreads (single, three, five)
  - **Phase 2**: French/German/Russian regional variants as selectable traditions, 32/36/40 card deck options
  - **Phase 3**: Visual deck styles (classic French, Spanish, Italian regional patterns)
- **Unique UI needs**: Deck selection (52/32/40/36), suit iconography, regional pattern variants
- **Target**: Custom page

### 4. Oracle Cards 🔲 (NOT STARTED — generic only)
- **Research**: Modern oracle decks vary wildly — no fixed tradition. Colette Baron-Reid, Doreen Virtue, Kyle Gray, Rebecca Campbell each have unique systems. Usually 44-52 cards with thematic messages.
- **Authentic techniques**: Single card pull for daily guidance, 3-card (situation/blockage/advice), 5-card spread, angel numbers, affirmation-based
- **Implementation**: Since no standard deck, our approach should generate unique oracle messages per reading. Card art would be abstract symbolic.
- **Unique UI needs**: Stylized "deck" with symbolic card backs, message reveal animation
- **Target**: Generic + custom deck visual

### 5. Kipper Cards 🔲 (NOT STARTED — generic only)
- **Research**: 36-card system developed in 19th C Bavaria by Susanne Kipper. Similar to Lenormand but with more narrative/situational cards (e.g., "Good News," "Bad News," "Surprise," "Legal Matter"). Spreads are usually 9×4 Grand Tableau or smaller situational layouts.
- **Authentic techniques**: Row reading (each row is a life domain — home, work, emotions, external), Column reading (past/present/future), 9-box spread, Kipper Grand Tableau (3×12 grid)
- **Implementation phases**:
  - **Phase 1**: 36 card meanings data, 5-card spread, 9-card spread
  - **Phase 2**: Kipper Grand Tableau (36-card) with row/column interpretation
- **Unique UI needs**: Similar to Lenormand grid but with different significator system
- **Target**: Custom page

### 6. Mahjong Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Chinese mahjong tile divination using the 144 tile set. Each tile (Bamboo, Characters, Dots, Winds, Dragons, Flowers) carries meaning. Tiles are drawn from a wall similar to the game.
- **Authentic techniques**: Single tile draw, 3-tile spread (past/present/future), 13-tile hand reading (like a mahjong hand), tile combinations
- **Implementation**: 144 tile meanings, tile wall animation, combination analysis
- **Unique UI needs**: Tile graphics (Chinese characters/symbols), tile wall animation
- **Target**: Custom page perhaps; generic page for now

---

## Cleromancy & Sortilege (7 systems)

### 7. Elder Futhark Runes 🔲 (SEMI-STARTED — generic page, no custom)
- **Research**: 24-rune Germanic/Norse alphabet, divided into 3 Aetts (Freyr's: Fehu-Wunjo, Heimdall's: Hagalaz-Sowilo, Tyr's: Tiwaz-Othala). Historical basis in Tacitus' *Germania* (98 CE) — "cut a branch from a nut-bearing tree, slice into strips, mark with signs, throw onto white cloth, pick up three."
- **Authentic techniques**:
  - **Single rune (Odin's Rune)**: Quick guidance
  - **Three Norns spread**: Urd (past/root cause), Verdandi (present/agency), Skuld (probable outcome/consequence)
  - **Five-rune cross**: Situation, Challenge, Past, Future, Outcome/Advice
  - **Nine-rune scatter**: Cast all runes onto cloth, read those face-up in clusters
  - **Runic Odin's Spread (9 positions)**: Life path deep dive
  - **Nine Worlds layout**: Map to Yggdrasil cosmology
  - **Free cast**: Random throw, read clusters and proximities
- **Rune aspects**: Each rune has upright and reversed/murkstave meanings (though controversial — some traditions don't reverse). Blank "Wyrd" rune is modern invention.
- **Elder vs Younger vs Anglo-Saxon**: Three Futhark variants. Elder (24, 2nd-8th C, Germanic), Younger (16, 9th-11th C, Norse — Viking age), Anglo-Saxon/Futhorc (28-33, 5th-11th C, England)
- **Implementation phases**:
  - **Phase 1**: 24 Elder Futhark rune data with upright/reversed meanings, Aett groupings, 3 spreads (single/three/five)
  - **Phase 2**: Younger Futhark and Anglo-Saxon as selectable traditions, rune scatter animation, cluster interpretation
  - **Phase 3**: Nine Worlds layout with Yggdrasil visualization, free cast mode
- **Unique UI needs**: Rune glyphs (Unicode or SVG), runestone visual style, scatter cloth animation, Yggdrasil diagram
- **Target**: **Custom page** — this deserves full treatment

### 8. I Ching 🔲 (SEMI-STARTED — has custom route but generic page)
- **Research**: 64 hexagrams from King Wen arrangements, 8 trigrams bagua. Two primary casting methods plus variants.
- **Authentic methods**:
  - **Yarrow stalk method (50 stalks)**: Complex, meditative,~15 min per hexagram. 1 stalk set aside (observer), remaining 49 divided and counted 3 times per line. Probabilities: 6 (1/16), 7 (5/16), 8 (7/16), 9 (3/16). Favors yin (yin: 8/16=50%, yang: 8/16=50% but static: 75%).
  - **Three-coin method**: Simplest, most popular. 3 coins tossed 6 times. Heads=3, tails=2. 6 (all tails/2+2+2 = old yin changing), 7 (1 head 2 tails = young yang), 8 (2 heads 1 tail = young yin), 9 (all heads = old yang changing).
  - **Single-coin method**: Toss 1 coin 6 times. Heads=yang, tails=yin. No changing lines.
  - **Plum Blossom method**: Generate hexagram from numbers/trigrams in observed phenomena (time, direction, sounds). No casting tools needed.
  - **Six Lines Divination (Liu Yao/Na Jia)**: After hexagram is derived, map to 5 elements and earthly branches for astrological reading.
  - **Zuo zhuan method**: Historical Zhou dynasty method using hexagram statements only
- **Key features**: Changing lines create a second hexagram (future/potential outcome). Nuclear hexagram (inner, lines 2-4 and 3-5). Moving lines (9 = old yang → yin, 6 = old yin → yang).
- **Implementation phases**:
  - **Phase 1**: All 64 hexagram data (binary sequence, King Wen number, name, judgment, image, line texts — from Wilhelm/Baynes or Huang translation), coin casting animation (3 coins, sound effect, 6 throws), changing line → second hexagram
  - **Phase 2**: Yarrow stalk method with full animation and explanation, hexagram detail (nuclear trigrams, element association, direction, body part)
  - **Phase 3**: Plum Blossom number input, Liu Yao element mapping, hexagram comparison
- **Unique UI needs**: Hexagram line animation (solid/broken/changing), coin toss visual, yarrow stalk counting visualization, bagua trigram display
- **Target**: **Custom page** — I Ching deserves the full tarot treatment with multiple casting methods

### 9. Ogham Staves 🔲 (NOT STARTED — generic only)
- **Research**: 20-25 letter Celtic tree alphabet (4th-6th C Ireland/Gaulish), grouped into 4 Aicmí (families) of 5 letters each. Each letter named after a tree/shrub (Beith=birch, Luis=rowan, Fearn=alder, etc.). Also 5 Forfeda (extra letters).
- **Authentic techniques**: Single stave draw, 3-stave spread, 5-stave cross, Ogham cast (throw all staves, read those face up), Year-wheel spread (13 months + 1)
- **Variants**: 20-letter classical (Consaine), 25-letter main (Aicmí + Forfeda), fews (wood staves), Bríatharogaim (kennings — word associations)
- **Implementation**: 20-25 stave data with tree associations, kennings, meanings. Simple spreads initially.
- **Unique UI needs**: Ogham line script (vertical or horizontal), stave visual (wood/parchment)
- **Target**: Generic page for now, custom page later

### 10. Bone Reading 🔲 (NOT STARTED — generic only)
- **Research**: African diaspora (Hoodoo, conjure) tradition. Not standardized — practitioner's own collection of bones, shells, stones, keys, coins, teeth, claws, etc. Each object carries personal and traditional meaning.
- **Authentic techniques**: Cast all items onto cloth, read clusters, proximities, orientation (face up/down, touching, distance)
- **Implementation**: Generate virtual "bones" (set of symbolic objects: chicken bone, coin, key, rabbit foot, shell, stone, feather, tooth, nail, bead, ring, button, marble, dice). Objects have general folk meanings. Cast animation, cluster analysis.
- **Unique UI needs**: 3D-ish object scatter, cluster grouping
- **Target**: Generic page for now

### 11. Dice Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Astragalomancy (Greek knucklebones), classical sortilege. Pythagoreans assigned meaning to dice numbers. Also: planetary dice (7 dice), polyhedral dice sets.
- **Authentic methods**: Single die throw (1-6 meanings), 2-dice (Pythagorean sum table), 3-dice (classical), 7-dice (planetary spheres each assigned to a celestial body), polyhedral dice (D4 through D20 for RPG-style fortune telling)
- **Implementation**: 1-3 dice roll with animation, number interpretation
- **Unique UI needs**: Dice rolling animation with physics, various polyhedral shapes
- **Target**: Generic page with custom dice visual

### 12. Domino Reading 🔲 (NOT STARTED — generic only)
- **Research**: Caribbean folk tradition, also Chinese (Tien Gow) domino divination. 28 domino tiles, each has two numbers (1-6, plus blanks). Pips on each side carry meaning similar to dice but with pairs.
- **Authentic techniques**: Single tile draw, 3-tile spread, 5-tile cross, pair reading (two numbers interact)
- **Implementation**: 28 domino tile data, tile draw animation
- **Unique UI needs**: Domino tile graphics with pip patterns
- **Target**: Generic page

### 13. Sacred Lots 🔲 (NOT STARTED — generic only)
- **Research**: Ancient Mediterranean *sortes* tradition — *Sortes Vergilianae* (Virgil), *Sortes Homericae* (Homer), *Sortes Biblicae* (Bible). Random passage selection from sacred/literary texts.
- **Authentic techniques**: Open book randomly, point to passage. Or cast lots (dice/sticks) to select from prepared list of sayings.
- **Implementation**: Pre-loaded collection of oracular verses from multiple traditions. User selects text tradition → random verse with context.
- **Variants**: Sortes Astrampsychi (Greek question-number oracle), Sortes Sangallenses (Latin), Tibetan Mo oracle
- **Unique UI needs**: Scroll/opened book animation
- **Target**: Generic page for now

---

## Scrying & Vision (6 systems)

### 14. Crystal Scrying 🔲 (NOT STARTED — generic only)
- **Research**: Crystalomancy — John Dee's showstone (shewstone), obsidian/crystal sphere/beryl. Renaissance ceremonial tradition. Dee and Edward Kelley used a "speculum" or shewstone for angelic communication.
- **Authentic techniques**: Gaze into sphere until visions form, describe what's seen. Traditional "four gates" method (North/East/South/West quadrants of crystal read differently). Darkening room, candle placement.
- **Implementation**: Describe scene → AI interprets. Random vision generation.
- **Unique UI needs**: Crystal sphere animation with light refraction effects, dark backdrop, candle illumination
- **Target**: Generic with immersive UI

### 15. Mirror Scrying 🔲 (NOT STARTED — generic only)
- **Research**: Catoptromancy/Enytromancy — black mirror (obsidian/ink-filled vessel), Venetian "black mirror" tradition. Used in Elizabethan England. Large mirrors, gilded frames, candle arrangement.
- **Authentic techniques**: Black mirror gaze, describe reflections/shadows/mists. Best done in dark room with single candle. Specific times (new moon, midnight, threshold times).
- **Implementation**: Similar to crystal scrying but with mirror visual theme
- **Unique UI needs**: Dark mirror reflection effect, candle flicker
- **Target**: Generic with immersive UI

### 16. Water Scrying 🔲 (NOT STARTED — generic only)
- **Research**: Hydromancy — bowl of water (still or rippled), ink dropping (ink in water patterns). Used in many traditions (Greek, Persian, African, Japanese).
- **Variants**: Clear water bowl, inked water, moonlight on water surface, fountain splash patterns
- **Implementation**: Water surface ripples, drop ink animation, pattern interpretation
- **Unique UI needs**: Animated water surface, ink dispersion physics
- **Target**: Generic with immersive UI

### 17. Fire Gazing 🔲 (NOT STARTED — generic only)
- **Research**: Pyromancy — flame interpretation in hearth fire, candle flame reading, spark patterns. Also includes lampadomancy (torch/lamplight).
- **Authentic techniques**: Candle flame shape (tall=positive, sputtering=resistance, blue=spirit, smoke=warning), bonfire ember shapes, incense coal patterns
- **Implementation**: Animated candle flame with various states, random ember patterns
- **Unique UI needs**: Fire particle animation, candle wax drip
- **Target**: Generic with immersive UI

### 18. Smoke Reading 🔲 (NOT STARTED — generic only)
- **Research**: Capnomancy — incense smoke (frankincense, myrrh, sage, copal) patterns. Also includes Libyan oracle of Ammon (incense smoke oracle), temple divination.
- **Authentic techniques**: Smoke direction (ascending straight=good, spreading=uncertain, low=blocked), smoke shapes (faces/objects)
- **Implementation**: Animated smoke plume with particle effects
- **Unique UI needs**: Smoke particle system, incense stick/burner visual
- **Target**: Generic with immersive UI

### 19. Cloud Reading 🔲 (NOT STARTED — generic only)
- **Research**: Nephomancy — cloud formation interpretation. Part of traditional weather magic and augury.
- **Authentic techniques**: Cloud shape reading (animal shapes, faces, objects), cloud type (cumulus=growth, stratus=stillness, cirrus=change, nimbus=challenge), cloud color/density, movement direction
- **Implementation**: Generate random cloud scene with shapes, animate
- **Unique UI needs**: Sky/cloud rendering, day/night variation
- **Target**: Generic with immersive UI

---

## Physiognomy & Body (5 systems)

### 20. Palm Reading 🔲 (NOT STARTED — generic only)
- **Research**: Chiromancy — Western palmistry with roots in ancient India (Hasta Samudrika), China, Greece (Aristotle, Hippocrates). Major lines, mounts, fingers, hand shapes.
- **Authentic techniques**:
  - **Major lines**: Life (bottom, around thumb — vitality/life path), Heart (top across — emotional), Head (middle — intellect), Fate (vertical middle — destiny), Sun/Apollo (under ring finger — success)
  - **Minor lines**: Marriage (edge under pinky), Health (below pinky to wrist), Girdle of Venus (above heart line)
  - **Mounts**: Venus (thumb base — passion), Jupiter (index base — ambition), Saturn (middle base — wisdom), Apollo (ring base — creativity), Mercury (pinky base — communication), Mars (center palm — courage), Moon (heel of hand — intuition)
  - **Hand shapes**: Earth (square palm/short fingers — practical), Air (square palm/long fingers — intellectual), Water (long palm/long fingers — emotional), Fire (long palm/short fingers — energetic)
  - **Finger lengths**: Ratio of ring to index finger (2D:4D ratio — testosterone exposure)
- **Implementation**: Interactive palm diagram where user describes or clicks on features → interpretation
- **Variants**: Chinese palmistry (more lines, different emphasis), Indian palmistry (Vedic — includes astrological markings, mounts are 8 planets), Gypsy tradition
- **Target**: Generic with interactive hand diagram

### 21. Face Reading 🔲 (NOT STARTED — generic only)
- **Research**: Western physiognomy (philosophically discredited but historically interesting) + Chinese Mian Xiang (still practiced, different system)
- **Mian Xiang techniques**: Five organs (forehead=fire/fate, nose=earth/wealth, chin=water/later years, left cheek=wood/family, right cheek=air/relationships). 100 positions on face. Three sections (upper=heaven/fate 18-30, middle=man/fortune 31-50, lower=earth/longevity 51+).
- **Implementation**: Face illustration with clickable zones
- **Target**: Generic

### 22. Phrenology 🔲 (NOT STARTED — generic only)
- **Research**: 19th C Franz Joseph Gall — 27 "organs" of the brain mapped to skull bumps. Discredited pseudoscience now, included as historical curio.
- **Implementation**: Skull map with zones, describe prominent areas
- **Target**: Generic (clear disclaimer required)

### 23. Iridology 🔲 (NOT STARTED — generic only)
- **Research**: Iris patterns reflect organ health (folk tradition, not medical). Zone map of iris (each section maps to body part).
- **Implementation**: Eye illustration with zone map
- **Target**: Generic (clear disclaimer)

### 24. Foot Reading 🔲 (NOT STARTED — generic only)
- **Research**: Reflexology-adjacent folk tradition. Foot shape (Egyptian/Greek/Roman/Peasant foot shapes), toes length/angle, pressure points.
- **Implementation**: Foot diagram with zones
- **Target**: Generic

---

## Tasseography & Food (4 systems)

### 25. Coffee Cup Reading 🔲 (NOT STARTED — generic only)
- **Research**: Turkish/Kahve falı / Greek kafemanteia — ~500 year tradition after coffee arrived in Ottoman Empire. Coffee grounds in demitasse cup, turned over onto saucer, patterns read from cup interior.
- **Authentic techniques**: Cup divided into 6 sections (top rim=present, middle=general, bottom=far/distant), handle=querent/home. Symbols read from cup interior walls to bottom. 100+ traditional symbols (snake=enemy, fish=money, bird=good news, tree=growth, mountain=obstacle, etc.)
- **Implementation**: Generate randomized "ground patterns" in cup shape with symbol overlay. Animate cup turning process.
- **Special consideration**: Very visual, tactile tradition. The cup reading experience itself is half the experience.
- **Unique UI needs**: 3D-ish cup interior rendering with coffee ground pattern, Turkish coffee aesthetic (cezve, demitasse, tray)
- **Variants**: Greek (similar but different symbol set), Middle Eastern (Lebanese tradition)
- **Target**: **Custom page** — this is a visually rich tradition that deserves full treatment

### 26. Tea Leaf Reading 🔲 (NOT STARTED — generic only)
- **Research**: Tasseomancy — British tradition, popularized in Victorian era. Loose leaf tea (not bagged) in wide cup. Swirl 3 times, turn over, read.
- **Authentic techniques**: Handle=querent. Leaves near handle=immediate, across=future. Symbols: leaf shape, dots (money), lines (journeys/steps), clumps (people/groups), sticks (obstacles). 50+ traditional symbols.
- **Implementation**: Similar to coffee but with tea leaves (different visual)
- **Unique UI needs**: Wide teacup, leaf scatter pattern
- **Target**: Custom page (with coffee)

### 27. Wine Lees Reading 🔲 (NOT STARTED — generic only)
- **Research**: Oinomancy — sediment patterns in wine. Classical Greek tradition. Used for Dionysian/oracular purposes.
- **Implementation**: Wine glass with sediment patterns
- **Target**: Generic

### 28. Egg Cleanse Reading 🔲 (NOT STARTED — generic only)
- **Research**: Curandero/Espiritismo tradition — *limpia con huevo* (egg cleansing). Egg passed over body, then broken into water glass. Yolk patterns (shapes/bubbles/blood/cloudiness/threads) are read for spiritual condition (mal de ojo, susto, etc.).
- **Authentic techniques**: Egg broken into room temperature water. 21 traditional patterns (yolk intact=clean, yolk split=conflict, bubbles=negative energy, white rising=protection trying to form, blood=deep issue, cloudy=mixed energy, threads=attachments, faces=spirit presence, etc.)
- **Implementation**: Glass of water animation, yolk shape generation, pattern identification
- **Unique UI needs**: Water glass with floating yolk visual — very distinct
- **Target**: **Custom page** — this is a distinctive, culturally rich tradition

---

## Numerology & Onomancy (3 systems)

### 29. Numerology Profile 🔲 (SEMI-STARTED — has custom mode but generic page)
- **Research**: Pythagorean (Pythagoras, 6th C BCE, reduction to 1-9 plus 11/22/33) and Chaldean (more ancient, different letter-number mapping, 1-8 plus 9 as sacred). Two distinct systems with different number assignments.
- **Authentic calculations**:
  - **Life Path**: Birth date sum reduced (YYYY+MM+DD → reduced). 5 core numbers.
  - **Expression**: Full name sum. Letters assigned to numbers.
  - **Soul Urge**: Vowels of name only. Inner desire.
  - **Personality**: Consonants of name only. Outer self.
  - **Birth Day**: Just the day of month.
  - **Maturity**: Life Path + Expression.
  - **Personal Year/Month/Day**: Current date + birth data.
  - **Challenge numbers**: Birth date differences.
  - **Pinnacle cycles**: Life divided into 4 periods.
- **Chaldean vs Pythagorean**: Chaldean assigns 1-8 (9 is holy, no letter to it). Letters mapped to sound vibration not position in alphabet. More complex. Used for different purposes.
- **Implementation phases**:
  - **Phase 1**: Name + birth date input, 5 core numbers with explanations, visual number wheel
  - **Phase 2**: Personal year/month/day, pinnacles, challenges, Karmic debt numbers (13/14/16/19)
  - **Phase 3**: Chaldean system as alternative, compatibility (compare two people)
- **Unique UI needs**: Number wheel or star chart visual
- **Target**: **Custom page** — numerology is form-based, needs proper form UI

### 30. Name Analysis 🔲 (NOT STARTED — generic only)
- **Research**: Onomancy (name magic) across cultures. From ancient (Pythagoras) to modern. Different from numerology in that it focuses on the name's meaning in natural language + number.
- **Techniques**: Assign numbers to name letters, analyze sum. Also: name meaning in origin language (etymology), name numerology in context of family/surname.
- **Implementation**: Name input → letter-to-number analysis + etymological analysis
- **Target**: Generic

### 31. Angel Numbers 🔲 (NOT STARTED — generic only)
- **Research**: Doreen Virtue popularized, but based on numerological principles. Repeating number sequences (111, 222, 333, etc. through 999, also 1111, 1212, 4444, etc.) carry specific meanings.
- **Techniques**: Number sequence interpretation (111=manifestation, 222=balance, 333=ascended masters, 444=protection, 555=change, 666=reevaluate, 777=luck, 888=abundance, 999=completion). Also combined sequences (1212, 1234, 5555).
- **Implementation**: User inputs a number or sequence of numbers they've been seeing → interpretation
- **Target**: Generic

---

## Bibliomancy & Sacred Text (4 systems)

### 32. Bibliomancy 🔲 (NOT STARTED — generic only)
- **Research**: Universal tradition. Open any book at random, point to a passage. The text is your oracle. *Sortes Biblicae* (Bible), *Sortes Virgilianae* (Aeneid), secular books.
- **Authentic techniques**: Random passage from prepared texts (literary canon). User can supply their own book title.
- **Implementation**: Pre-loaded text corpus from multiple sources (Rumi, Shakespeare, Rilke, Gibran, etc.). Random selection. User can optionally specify a book.
- **Target**: Generic

### 33. Quranic Istikhara 🔲 (NOT STARTED — generic only)
- **Research**: Islamic tradition of *Salat al-Istikhara* (prayer for guidance) followed by interpreting signs. Some practice opening the Quran at random for guidance.
- **Important**: Must be clearly labeled as educational/curio. Include proper context about the full Istikhara prayer tradition.
- **Implementation**: Random Quranic verse (with translation) with appropriate reverence
- **Target**: Generic (disclaimer required)

### 34. Torah Lots 🔲 (NOT STARTED — generic only)
- **Research**: Jewish *Goral* tradition — casting lots to determine divine will (Yom Kippur scapegoat, tribal land division). Some Hasidic traditions of random Torah passage.
- **Implementation**: Random Torah verse (Hebrew + translation)
- **Target**: Generic

### 35. Poem Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Literary divination using poetry as oracle. Rumi, Hafez (Divan-e-Hafez — popular Persian bibliomancy tradition), ancient Greek lyric, haiku, modern poetry.
- **Authentic techniques**: *Fal-e-Hafez* — open Hafez at random, read the ghazal as guidance. Persian tradition with specific cultural practice (recite prayer, think of question, open book).
- **Implementation**: Poetry corpus from multiple traditions, randomized selection. Hafez special mode.
- **Unique UI needs**: Persian/Iranian aesthetic for Fal-e-Hafez mode
- **Target**: Generic with Hafez mode

---

## Oneiromancy & Trance (3 systems)

### 36. Dream Interpretation 🔲 (NOT STARTED — generic only)
- **Research**: Artemidorus' *Oneirocritica* (2nd C CE — most comprehensive ancient dream dictionary), Jungian archetypal analysis, Freudian, Indigenous dreamwork (Seneca, Mohawk, Iroquois, Aboriginal), Tibetan dream yoga, Chinese dream interpretation.
- **Authentic methods**: Artemidorus system (categorize dream by type — personal, otherworldly, prophetic/retrospective), Jungian (archetypes, collective unconscious), cultural-specific (Indigenous dream sharing circles)
- **Variants**: Lucid dreaming analysis, nightmare therapy, Incubation (temple sleep for oracle dreams — Greek tradition)
- **Implementation**: Describe dream → system identifies symbols/archetypes/themes → interpretation from multiple frameworks
- **Target**: Generic

### 37. Hypnagogic Vision 🔲 (NOT STARTED — generic only)
- **Research**: Threshold state (between waking and sleeping) imagery. Used in shamanic traditions, Edgar Cayce, Tibetan dream yoga.
- **Implementation**: Describe the imagery seen at sleep onset → interpretation
- **Target**: Generic

### 38. Automatic Writing 🔲 (NOT STARTED — generic only)
- **Research**: Spiritist tradition (Allan Kardec), Surrealist *écriture automatique* (Breton, Soupault), channeling. Practitioner enters trance and writes without conscious control.
- **Implementation**: User describes or submits text received through automatic writing → interpretation
- **Target**: Generic

---

## Natural Omens (3 systems)

### 39. Bird Augury 🔲 (NOT STARTED — generic only)
- **Research**: Roman *auspicium* — official state divination by observing birds. *Augures* (priests) interpreted:
  - Bird type (eagle=Jupiter's messenger, raven=Apollo's, owl=death omen, dove=peace, crow=change, hawk=warrior)
  - Flight direction (left=positive (Greek tradition), right=positive (Roman tradition in later periods) — depends on orientation)
  - Number of birds (single=direct, pair=harmony, group=community)
  - Flight pattern (direct=clear, circling=contemplation, sudden=surprise)
  - Bird behavior (singing=joy, fighting=conflict, nesting=settled)
  - Feeding (at your window=proximity of news)
- **Implementation**: Generate bird omen scene with species/flight/behavior combo → interpretation
- **Variants**: Celtic augury (wren=cunning, raven=wisdom/prophecy, crane=secrets), Shinto (crow=guidance, crane=longevity), African (owl=witchcraft, vulture=purification)
- **Unique UI needs**: Bird silhouette animation, sky setting
- **Target**: Generic with rich visual/descriptive output

### 40. Animal Omen 🔲 (NOT STARTED — generic only)
- **Research**: Animal crossing your path as spiritual sign across cultures. Specific meanings per animal, context, direction, behavior.
- **Implementation**: User describes animal encounter → interpretation
- **Target**: Generic

### 41. Weather Omen 🔲 (NOT STARTED — generic only)
- **Research**: Meteoromancy — lightning direction (Etruscan *fulguration*), wind patterns, rainbow, storm timing, thunder intensity.
- **Implementation**: User describes weather phenomenon → interpretation
- **Target**: Generic

---

## Spirit & Mediumship (3 systems)

### 42. Spirit Message 🔲 (NOT STARTED — generic only)
- **Research**: Spiritualist tradition (Fox sisters, 1848 Hydesville). Sitters bring questions, medium receives messages from spirit guides/ancestors.
- **Implementation**: Generate "channeled" style reading. Clear entertainment label.
- **Target**: Generic

### 43. Ancestor Oracle 🔲 (NOT STARTED — generic only)
- **Research**: African diaspora traditions (Haitian Vodou, Santeria/Lukumi, Candomblé, Palo). Also Confucian ancestor veneration, Filipino, Mexican Día de Muertos. Approaching ancestors for counsel.
- **Implementation**: Ancestor altar visual, guided question → response. Must be respectful, label as educational.
- **Unique UI needs**: Altar/aesthetic based on tradition selection
- **Target**: Generic with cultural sensitivity

### 44. Pendulum / Radiesthesia 🔲 (NOT STARTED — generic only)
- **Research**: Dowsing — use weighted object on string/chain to answer yes/no questions. Mounted on hand/stand. Swing patterns: circular=yes or positive, linear=no or negative, elliptical=uncertain or maybe. Also used for finding water, objects, energy fields.
- **Authentic techniques**: Pendulum over hand diagrams, question calibration (swing patterns are individual — must "program" the pendulum), body pendulum (swing over specific body areas for health)
- **Implementation**: User inputs question, asks user to describe observed swing pattern → interpretation
- **Unique UI needs**: Animated pendulum swing
- **Target**: Generic with interactive pendulum visual

---

## Ceremonial Oracle (5 systems)

### 45. Geomancy 🔲 (NOT STARTED — generic only)
- **Research**: Medieval European / Arabic *ilm al-raml* ("science of sand"). Generate 16 figures (tetragrams) by counting dots in sand or on paper. 4 mothers → 4 daughters → 4 nieces → 2 witnesses → 1 judge → 1 superjudge.
- **Authentic method**: Earth/paper/dice random dot generation. 16 figures: Via, Populus, Cauda Draconis, Caput Draconis, Puer, Puella, Fortuna Maior, Fortuna Minor, Acquisitio, Amissio, Laetitia, Tristitia, Rubeus, Albus, Coniunctio, Carcer.
- **Implementation**: Dot generation animation, shield chart construction (12 houses), figure interpretation
- **Unique UI needs**: Geomantic shield chart diagram, dot field generation
- **Special consideration**: Full geomantic reading requires the complete shield chart process — most online geomancy tools are oversimplified
- **Variants**: Arabic (original 8th C), Western Medieval (12th C via translation), African (Ifá adjacent), Renaissance (Agrippa's system)
- **Target**: **Custom page** — geomancy has a unique visual language (shield chart, 16 figures) that deserves proper UI

### 46. Ifá / Odu Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Yoruba (Nigeria) — 256 Odu (signatures) derived from 16 major Odus (Meji) and 240 minor combinations (Omo Odu). Cast palm nuts (Ikin) or divination chain (Opele). Babalawo (priest/diviner) interprets the Odu.
- **Authentic techniques**: Ikin (16 palm nuts, toss and count remainder — 4 casts produce one Odu). Opele (divination chain, 8 half-seeds, toss and read 8 marks). Each Odu comes with specific stories/verses (Ese Ifá), taboos, sacrifices, prescriptions.
- **Important**: Ifá is a closed practice. Content must be educational/curio. Consult with practitioners for accuracy. Label clearly.
- **Implementation**: Generate Odu signature → Odu name and basic meaning. Not full Ifá — that requires Babalawo.
- **Target**: Generic (educational/curio labeling required)

### 47. Kikongo Cosmogram 🔲 (NOT STARTED — generic only)
- **Research**: Bakongo (Central Africa) — *Dikenga* (cosmogram). Cross/circle symbol representing the four moments of the sun (dawn=birth/beginning, noon=maturity, sunset=death/ancestor, midnight=rebirth/spirit world). Four Kalûnga (spirit/transformation) signs.
- **Implementation**: Dikenga diagram, user focus area → interpretation
- **Target**: Generic

### 48. Enochian Tablet Draw 🔲 (NOT STARTED — generic only)
- **Research**: John Dee and Edward Kelley (1580s). 4 Watchtowers (Great Table of Earth, each divided into 25 squares = 100 calls/sigils). Each square has letter sequences. Draw letters/sigils for angelic communication.
- **Implementation**: Random Watchtower letter selection → interpretation. Educational/curio.
- **Target**: Generic

### 49. Planetary Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Agrippa's *Three Books of Occult Philosophy* (1533). Planetary intelligences, spirits, hours. Each celestial body associated with specific spirits, sigils, incense, colors, metals, days.
- **Implementation**: User selects day/hour → appropriate planetary spirit → guidance. Based on traditional planetary hour calculation.
- **Target**: Generic

---

## Astronomical (7 systems)

### 50. Astro Watch 🔲 (SEMI-STARTED — custom mode but needs work)
- **Research**: Live planetary hours, moon phase, planetary positions. Based on Hellenistic/Medieval astrology.
- **Techniques**: Current sky conditions, planetary hour (7 classical planets × 24 hours), moon phase reading, day ruler, hour ruler
- **Implementation**: Currently has custom mode — needs visual planetary hour clock, moon phase display, current planet positions
- **Unique UI needs**: Sky wheel, planet position renderer
- **Target**: Custom page

### 51. Natal Chart 🔲 (SEMI-STARTED — custom mode but needs work)
- **Research**: Hellenistic, Medieval, Modern Western astrology traditions
- **Components**: 12 houses, 7-10 planets (including modern outer planets), 12 signs, aspects (conjunction, sextile, square, trine, opposition), element distribution (fire/earth/air/water), modality (cardinal/fixed/mutable)
- **Techniques**: Chart wheel, planet/sign/house interpretations, aspect analysis, dominant element, ruling planet
- **Implementation phases**:
  - **Phase 1**: Simple chart (sign emphasis, element analysis, basic planet placement) without full ephemeris — use simplified positions
  - **Phase 2**: Chart wheel rendering (SVG), aspect lines, house system (Placidus/Whole sign)
  - **Phase 3**: Transits, progressions, synastry comparison
- **Unique UI needs**: Circular chart wheel with aspect lines and symbols
- **Target**: Custom page (requires real chart rendering)

### 52. Horary Astrology 🔲 (NOT STARTED — generic only)
- **Research**: Question astrology — chart erected for the moment the question is asked. William Lilly's *Christian Astrology* (1647) is the definitive text.
- **Techniques**: Ascendant radicality check, question ruler, house of question, aspect timing, antiscia, collection of light, prohibition, refranation, translation of light
- **Implementation**: Generate current chart (time of asking) → interpret based on question category. Simplified horary rules.
- **Target**: Generic for now

### 53. Electional Timing 🔲 (NOT STARTED — generic only)
- **Research**: Choosing astrological moments for events. *Elections* (choose wedding, business launch, travel, ritual timing).
- **Implementation**: Input desired event type → suggests upcoming favorable astrological windows
- **Target**: Generic

### 54. Synastry / Compatibility 🔲 (NOT STARTED — generic only)
- **Research**: Compare two charts for relationship dynamics. Aspects between planets in two charts, house overlays, composite chart.
- **Implementation**: Two birth data inputs → aspect comparison, element analysis, Venus/Mars emphasis
- **Target**: Generic for now

### 55. Vedic Jyotish 🔲 (NOT STARTED — generic only)
- **Research**: Sidereal zodiac (fixed zodiac, about 24° behind tropical). 27 Nakshatras (lunar mansions) — each 13°20'. 9 Grahas (planets including Rahu/Ketu). 12 Rasis (signs). Dasha systems (planetary periods — Vimshottari most common, 120-year cycle).
- **Techniques**: Rasi chart, Navamsa (9th divisional chart), Nakshatra pada reading, Dasha period interpretation (you are in Moon dasha, sub-period of Jupiter, etc.)
- **Implementation**: Birth data → sidereal chart, nakshatra identification, current dasha period
- **Unique UI needs**: 27 nakshatra wheel, divisional charts
- **Target**: Generic for now

### 56. Chinese Zodiac 🔲 (NOT STARTED — generic only)
- **Research**: 12 animals (Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig), 5 elements (Wood, Fire, Earth, Metal, Water), 60-year cycle. Yin/Yang per animal.
- **Techniques**: Animal + element = complete Chinese zodiac sign. Four Pillars (Ba Zi) uses year/month/day/hour pillars. Chinese astrology also includes Zi Wei Dou Shu (Purple Star).
- **Implementation**: Birth year → animal + element. Annual fortune forecast per sign.
- **Unique UI needs**: 12 animal icon set
- **Target**: Generic for now

---

## Indian Traditions (7 systems)

### 57. Prashna Jyotish 🔲 (NOT STARTED — generic only)
- **Research**: Indian horary astrology — chart erected at time of question, interpreted sidereally with divisional charts (Navamsa, Drekkana, etc.)
- **Target**: Generic

### 58. Panchanga Day Quality 🔲 (NOT STARTED — generic only)
- **Research**: Vedic calendar — 5 limbs (Tithi/lunar day, Vara/weekday, Nakshatra/lunar mansion, Yoga, Karana). Each limb has qualities that combine to determine day auspiciousness.
- **Implementation**: Current date → 5 limbs displayed → overall day quality → suitable activities (what to begin, what to avoid)
- **Target**: Generic

### 59. Ramayana Verse Oracle 🔲 (NOT STARTED — generic only)
- **Target**: Generic

### 60. Mahabharata Lots 🔲 (NOT STARTED — generic only)
- **Target**: Generic

### 61. Yantra Meditation 🔲 (NOT STARTED — generic only)
- **Target**: Generic

### 62. Ayurveda Dosha Read 🔲 (NOT STARTED — generic only)
- **Target**: Generic

### 63. Mantra Japa Guidance 🔲 (NOT STARTED — generic only)
- **Target**: Generic

---

## Chinese Traditions (6 systems)

### 64. Ba Zi Four Pillars 🔲 (NOT STARTED — generic only)
- **Research**: 4 pillars (year/month/day/hour) each with Heavenly Stem (10) + Earthly Branch (12). Create 8 characters + hidden stems. Analysis of 5 elements, 10 gods, 12 stage of life cycle, nobleman/blood/star patterns.
- **Implementation**: Birth date/time → 4 pillars chart → basic element analysis. Full Ba Zi requires significant computation.
- **Target**: Generic for now

### 65. Zi Wei Dou Shu 🔲 (NOT STARTED — generic only)
- **Research**: Purple Star Astrology — 14 major stars, 12 palaces. Requires birth date/time to arrange stars in palaces.
- **Target**: Generic

### 66. Feng Shui Room Read 🔲 (NOT STARTED — generic only)
- **Research**: Bagua map overlaid on room floorplan. 8 areas (Career, Knowledge, Family, Wealth, Fame, Partnership, Children, Helpful People) + center (Health). Each area governs specific life domain.
- **Implementation**: User describes room layout or map → bagua overlay → suggestions
- **Target**: Generic

### 67. Taoist Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Dao De Jing (Laozi) or Zhuangzi passage as philosophical guidance
- **Target**: Generic

### 68. Plum Blossom Numerology 🔲 (NOT STARTED — generic only)
- **Research**: Meihua Yishu — Shao Yong (11th C Song Dynasty). Generate hexagram from observed numbers (time, direction, objects). Lighter, more intuitive than I Ching.
- **Target**: Generic

### 69. Qi Men Dun Jia 🔲 (NOT STARTED — generic only)
- **Research**: "Extraordinary Doors" — highest level Chinese metaphysics. Complex 3D arrangement of 8 gates, 9 stars, 8 spirits, 10 stems, 12 branches over time. Used for strategic decision making.
- **Implementation**: Simplified snapshot only
- **Target**: Generic

---

## Japanese Traditions (5 systems)

### 70. Omikuji Fortune 🔲 (NOT STARTED — generic only)
- **Research**: Shinto shrine fortune slips. Random draw from numbered sticks → paper fortune grade: Dai-kichi (great blessing), Kichi (blessing), Chu-kichi (middle blessing), Sho-kichi (small blessing), Sue-kichi (later blessing), Kyo (curse), Dai-kyo (great curse).
- **Authentic practice**: Draw numbered stick from box → match to drawer → receive paper fortune. Also: bad fortunes tied to tree at shrine to neutralize.
- **Implementation**: Random draw with Japanese aesthetic (shrine bells, wooden box), fortune grade + specific guidance (travel, love, health, business, study, wish)
- **Variants**: Ema (wooden prayer plaques — write wish, hang at shrine), Mikuji (variations per shrine — some include zodiac, some are specific to certain kami)
- **Unique UI needs**: Shrine aesthetic, omikuji box, paper unfolding animation
- **Target**: **Custom page** — visually and culturally rich

### 71. Haiku Oracle 🔲 (NOT STARTED — generic only)
- **Research**: Japanese poetry as oracle — seasonal reference (kigo), cutting word (kireji), 5-7-5 pattern. Haiku captures a moment of insight that can be applied to a situation.
- **Target**: Generic

### 72. Kuji-kiri Contemplative 🔲 (NOT STARTED — generic only)
- **Research**: Nine hand-seals (Rin, Kyo, Toh, Sha, Kai, Jin, Retsu, Zai, Zen). Shugendo (mountain asceticism) and ninjutsu folklore. Each seal associated with specific energies, elements, and virtues.
- **Target**: Generic (educational)

### 73. Reiki / Ki Flow 🔲 (NOT STARTED — generic only)
- **Target**: Generic

### 74. Yokai Folk Omen 🔲 (NOT STARTED — generic only)
- **Research**: Japanese supernatural folklore — specific creatures and their omens (Kitsune=transformation/trickery, Tanuki=mischief/prosperity, Tengu=mountain/teaching, Kappa=drowning/warning, Yuki-onna=snow/death, Zashiki-warashi=fortune/blessing)
- **Target**: Generic

---

## Meditation & Relaxation (7 systems)

### 75. Pranayama Session 🔲 (NOT STARTED — generic only)
### 76. Yoga Nidra Script 🔲 (NOT STARTED — generic only)
### 77. Qigong Flow 🔲 (NOT STARTED — generic only)
### 78. Zazen Sitting Guide 🔲 (NOT STARTED — generic only)
### 79. Nembutsu Chant Guide 🔲 (NOT STARTED — generic only)
### 80. Progressive Relaxation 🔲 (NOT STARTED — generic only)
### 81. Mantra / Sound Bath 🔲 (NOT STARTED — generic only)

- **Note**: Meditation & Relaxation are not divination per se. They are guided practice sessions. The generic page works fine for these — they are essentially formatted instruction text based on user input.
- **Target**: Keep generic for now

---

## Implementation Priority

### Tier 1 (Do these first — culturally rich, visually unique, high impact)
1. **I Ching** — Custom hexagram generation, coin/stalk animation, 64 hexagram data
2. **Elder Futhark Runes** — Custom rune casting, Aett visualization, scatter animation
3. **Lenormand** — Grand Tableau grid, house system, significator, pair reading
4. **Geomancy** — Shield chart, 16 figures, dot generation
5. **Coffee Cup Reading** — Cup interior rendering, ground patterns, Turkish aesthetic
6. **Omikuji** — Shrine draw animation, paper fortune reveal, paper fortune reveal

### Tier 2 (Rich traditions, medium customization)
7. **Numerology Profile** — Form-based input, calculation engine, 5 cores + extensions
8. **Palm Reading** — Interactive hand diagram
9. **Egg Cleanse** — Glass of water visual, yolk patterns
10. **Playing Cards** — Regional variant selection, 52-card data, suit matrix
11. **Kipper Cards** — 36-card Grand Tableau, row/column reading
12. **Rune scatter** (enhancement of Tier 1)

### Tier 3 (Simple data + LLM)
13-81: All remaining systems — staged from generic page to richer experiences as interest/feedback warrants.

---

## Technical Architecture Notes

### Each custom system needs:
- **Page component** at `src/client/pages/{SystemName}Page.tsx`
- **Data file** at `src/client/pages/{systemName}Data.ts` (cards/rune/stave/hexagram data)
- **Route registration** in `App.tsx`
- **divinationSystems.ts** entry with `generic: false`
- **Unique UI considerations**: animation, sound, visual theme matching the tradition

### Shared components to build:
- CardFace → RuneStoneFace, HexagramFace, LenormandCardFace, etc. (each tradition needs its own symbol rendering)
- Shuffle/draw animation library
- Pattern generator for card backs
- Interpretation narrative pipeline
- Verdict/inclination system (Yes/No/Mixed)
- Spread position mapper (drag-drop cards into positions)

### Color system pattern (follow Tarot approach):
- Each deck/system gets a unique hue/vibe
- `systemColors(systemId)` generates full palette
- Card/symbol faces use inline HSL dynamic styles
- Tradition badges match tradition color

---

## Research TODO

Before implementing any system, complete:
1. Wikipedia deep read (history, techniques, cultural context)
2. 3+ practitioner guides (authentic methods, not pop simplification)
3. 2+ academic sources (anthropology, religious studies, history)
4. Visual reference collection (20+ images of tools, layouts, symbolic elements)
5. Existing web tools analysis (what do other sites do wrong/right?)

Document findings in `src/shared/research/{systemId}.md` before coding.

---

*Last updated: 2026-06-14*
*Next system target: I Ching (Tier 1, highest impact)*
