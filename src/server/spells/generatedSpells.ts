interface SpellSeed {
  title: string;
  tradition: string;
  source: string;
  category: string;
  rating: number;
  reviewCount: number;
  difficulty: string;
  difficultyLevel: number;
  danger: string;
  dangerLevel: number;
  element: string;
  timing: string;
  counterSpell: string;
  summary: string;
  warning: string | null;
  tags: string[];
  referenceLink?: string;
}

const TRADITIONS = [
  "Wiccan", "Hoodoo", "Ceremonial", "Chaos", "Tantra", "Kabbalah",
  "Taoist", "Buddhist", "Norse", "Egyptian", "Greek", "Roman",
  "Mediterranean", "African", "Celtic", "Modern", "Voodoo", "Santeria",
  "Palo", "Candomblé", "Pow-Wow", "Folk Magic", "Slavic", "Finnish",
  "Sami", "Siberian", "Shinto", "Hindu", "Sufi", "Hermetic",
  "Qliphothic", "Luciferian", "Druidic", "Asatru", "Appalachian",
  "Brujeria", "Curanderismo", "Espiritismo", "Kardecist", "Macumba",
  "Quimbanda", "Umbanda", "Obeah", "Rootwork", "Witchcraft",
];

const SOURCES = [
  "Cunningham's Encyclopedia of Magical Herbs",
  "The Key of Solomon",
  "The Picatrix",
  "The Greater Key of Solomon",
  "The Lesser Key of Solomon",
  "The Lemegeton",
  "The Book of Abramelin",
  "The Egyptian Book of the Dead",
  "The Tibetan Book of the Dead",
  "The Green Witch",
  "The Complete Book of Incense, Oils & Brews",
  "The Modern Guide to Witchcraft",
  "Mastering Witchcraft",
  "The Witches' Bible",
  "Aradia, or the Gospel of the Witches",
  "The Golden Bough",
  "The White Goddess",
  "The Magician's Companion",
  "Liber Null & Psychonaut",
  "Condensed Chaos",
  "Hands-On Chaos Magic",
  "Buckland's Complete Book of Witchcraft",
  "The Spiral Dance",
  "Drawing Down the Moon",
  "The Craft: A Witch's Book of Shadows",
  "Wicca: A Guide for the Solitary Practitioner",
  "The Witch's Book of Power",
  "The Encyclopedia of Magical Herbs",
  "Practical Solitary Magic",
  "The Art of Hoodoo Candle Magic",
  "Hoodoo Herb and Root Magic",
  "The Voodoo Hoodoo Spellbook",
  "Voodoo and Hoodoo",
  "The Book of Forbidden Knowledge",
  "The Sixth and Seventh Books of Moses",
  "The Long Lost Friend",
  "The Roman Ritual",
  "The Clavicle of Solomon",
  "The Sworn Book of Honorius",
  "The Heptameron",
  "The Arbatel of Magic",
  "The Magus",
  "The Book of Ceremonial Magic",
  "The Encyclopedia of Occultism",
  "Secret Societies and Subversive Movements",
  "The Secret Teachings of All Ages",
  "Dogme et Rituel de la Haute Magie",
  "The Golden Dawn",
  "The Book of Black Magic and of Pacts",
  "The Goetia of Dr Rudd",
  "Transcendental Magic",
  "The Practice of Magical Evocation",
  "The Mystical Qabalah",
  "The Chicken Qabalah",
  "The Thirty-Two Paths of Wisdom",
  "QBL: The Bride's Reception",
  "The Book of Thoth",
  "The Tarot of the Bohemians",
  "Meditations on the Tarot",
  "The Corpus Hermeticum",
  "The Kybalion",
  "The Emerald Tablet",
  "Three Books of Occult Philosophy",
  "De Occulta Philosophia",
  "The Fourth Book of Occult Philosophy",
  "The Book of Oberon",
  "The Grimoire of Pope Honorius",
  "The Grand Grimoire",
  "The Red Dragon",
  "The True Grimoire",
  "The Grimoire of Armadel",
  "The Enchiridion of Pope Leo III",
  "The Book of Sacred Magic of Abramelin",
  "The Goetic Grimoire",
  "The Faustian Grimoire",
  "The Necronomicon (Simon's Version)",
  "The Necronomicon (Lovecraft/Petersen)",
  "The Cthulhu Mythos Magic",
  "The Simon Necronomicon",
  "The Alchemical Writings of Paracelsus",
  "The Opus Mago-Cabalisticum",
  "The Secret Symbols of the Rosicrucians",
  "Fama Fraternitatis",
  "Confessio Fraternitatis",
  "The Chemical Wedding of Christian Rosenkreutz",
  "The Chymical Wedding",
  "The Book of Nature",
  "The Archidoxes of Magic",
  "The Of the Occult Philosophy of Agrippa",
  "The Heptarchia Mystica",
  "A True and Faithful Relation",
  "The Angelical Language",
  "The Enochian Keys",
  "The Book of Enoch",
  "The Zohar",
  "The Sefer Yetzirah",
  "The Bahir",
  "The Sepher Ha-Qabalah",
  "The Kabbalah Unveiled",
  "The Doctrine and Literature of the Kabalah",
  "The Tree of Life",
  "The Garden of Pomegranates",
  "The Kabbalistic Tradition",
  "The Essential Kabbalah",
  "The Gnostic Gospels",
  "The Nag Hammadi Library",
  "The Pistis Sophia",
  "The Chaldean Oracles",
  "The Orphic Hymns",
  "The Homeric Hymns",
  "The Homeric Hymn to Demeter",
  "The Greek Magical Papyri",
  "The Mithras Liturgy",
  "The Eighth Book of Moses",
  "The Stele of Jeu",
  "The Coptic Gnostic Papyri",
  "The Berlin Codex",
  "The Bruce Codex",
  "The Askew Codex",
  "The Books of Jeu",
  "The Untitled Text in the Bruce Codex",
  "The Gospel of the Egyptians",
  "The Apocryphon of John",
  "The Hypostasis of the Archons",
  "Traditional (Community Verified)",
  "Modern Practice (Community Verified)",
  "Norse Sagas & Eddas",
  "The Havamal",
  "The Poetic Edda",
  "The Prose Edda",
  "The Volsunga Saga",
  "The Anglo-Saxon Chronicle",
  "The Mabinogion",
  "The Book of Taliesin",
  "The Black Book of Carmarthen",
  "The Red Book of Hergest",
  "The White Book of Rhydderch",
  "The Lebor Gabala Erenn",
  "The Book of Leinster",
  "The Book of Ballymote",
  "The Yellow Book of Lecan",
  "The Dindsenchas",
  "The Metrical Dindsenchas",
  "The Triads of Britain",
  "The Gododdin",
  "The Y Gododdin",
  "The Tale of Taliesin",
  "The Four Ancient Books of Wales",
  "The Barddas",
  "The Iolo Manuscripts",
  "The Cabala of the Druids",
  "The Celtic Tarot",
  "The Tree Ogham",
  "The Ogam Tract",
  "The Book of Ballymote Ogham",
  "The Auraicept na n-Eces",
  "The Scholar's Primer",
  "The In Lebor Ogaim",
  "The Ogham: A Practical Guide",
  "The Druid Magic Handbook",
  "The Book of Druidry",
  "The Druidry Handbook",
  "The Path of Druidry",
  "The Elements of the Gaelic Tradition",
  "The Celtic Wisdom Sticks",
  "The Celtic Oracle",
  "The Rhiannon Rising",
  "The Book of Welsh Magic",
  "The Mabinogi",
  "The Four Branches of the Mabinogi",
  "The Cuchulainn Cycle",
  "The Fenian Cycle",
  "The Mythological Cycle",
  "The Ulster Cycle",
  "The Kings' Cycle",
  "The Book of Invasions",
  "The Voyage of Bran",
  "The Voyage of Mael Duin",
  "The Adventures of the Sons of Eochaid",
  "The Destruction of Da Derga's Hostel",
  "African Diaspora Traditions",
  "Taoist Internal Arts",
  "Buddhist Meditation Texts",
  "The Tantric Tradition",
  "The Vedic Hymns",
  "The Atharva Veda",
  "The Yajur Veda",
  "The Rig Veda",
  "The Sama Veda",
  "The Upanishads",
  "The Brahma Sutras",
  "The Yoga Sutras",
  "The Bhagavad Gita",
  "The Puranas",
  "The Tantras",
  "The Agamas",
  "The Samhitas",
  "The Aranyakas",
  "The Brahmanas",
  "The Vedangas",
  "The Upavedas",
  "The Ayurveda",
  "The Dhanurveda",
  "The Gandharvaveda",
  "The Sthapatyaveda",
  "The Kama Sutra",
  "The Ananga Ranga",
  "The Perfumed Garden",
  "The Tao of Love",
  "The Art of Sexual Ecstasy",
  "The Multi-Orgasmic Couple",
  "The Tao of the Loving Couple",
  "The Secrets of the Japanese Art of Love",
  "The Love Recipes of the Polynesian Islands",
  "The Esoteric Philosophy of Love",
  "The Metaphysics of Love",
  "The Spiritual Eroticism of the East",
  "The Love Magic of the Ancient World",
  "The Erotic Rites of the Ancients",
  "The Temple of Love",
  "The Sacred Prostitution of Antiquity",
  "The Hieros Gamos",
  "The Sacred Marriage",
  "The Bridal Chamber",
  "The Song of Songs",
  "The Lovers in Alchemy",
  "The Conjunction of the Sun and Moon",
  "The Chemical Wedding",
  "The Rebis",
  "The Androgyne",
  "The Union of Opposites",
  "The Coincidentia Oppositorum",
  "The Mystical Union",
  "The Union with God",
  "The Via Negativa",
  "The Via Positiva",
  "The Via Creativa",
  "The Via Transformativa",
  "The Dark Night of the Soul",
  "The Ascent of Mount Carmel",
  "The Interior Castle",
  "The Cloud of Unknowing",
  "The Perfection of the Spiritual Life",
  "The Ladder of Divine Ascent",
  "The Philokalia",
  "The Way of the Pilgrim",
  "The Praktikos",
  "The Gnostikos",
  "The Kephalaia Gnostica",
  "The Centuries",
  "The Three Ages of the Interior Life",
  "The Spiritual CombAT",
  "The Christian Mystical Tradition",
  "Hyatt Collection",
  "Celtic",
  "Tantra",
  "Traditional (Community Verified)",
  "Modern Practice (Community Verified)",
];

const TIMINGS = [
  "Venus hour, Friday, Waxing moon",
  "Venus hour, Waxing moon",
  "Venus hour, Full moon",
  "Venus hour, Friday",
  "Venus hour, Waxing crescent",
  "Venus hour, New moon",
  "Venus hour, Waxing gibbous",
  "Venus hour, Any moon phase",
  "Friday, Waxing moon",
  "Friday, Venus hour",
  "Waxing moon, Venus hour",
  "Full moon, Venus hour",
  "New moon, Venus hour",
  "Venus day (Friday), Sunrise",
  "Venus day (Friday), Sunset",
  "Venus day (Friday), Midnight",
  "Jupiter hour, Thursday",
  "Jupiter hour, Waxing moon",
  "Jupiter hour, Full moon",
  "Mars hour, Tuesday",
  "Mars hour, Waning moon",
  "Mars hour, Full moon",
  "Mars hour, New moon",
  "Mercury hour, Wednesday",
  "Mercury hour, Waxing moon",
  "Mercury hour, New moon",
  "Saturn hour, Saturday",
  "Saturn hour, Waning moon",
  "Saturn hour, New moon",
  "Saturn hour, Dark moon",
  "Sun hour, Sunday",
  "Sun hour, Waxing moon",
  "Sun hour, Full moon",
  "Moon hour, Monday",
  "Moon hour, Waxing moon",
  "Moon hour, Full moon",
  "Moon hour, New moon",
  "Moon hour, Waning moon",
  "Dawn, Sun hour",
  "Sunset, Twilight",
  "Midnight, Moon hour",
  "Noon, Sun hour",
  "Any, preferably full moon",
  "Any, preferably new moon",
  "Any, preferably waxing moon",
  "Any, preferably waning moon",
  "Any time",
  "During a thunderstorm",
  "During an eclipse",
  "During a meteor shower",
  "At the crossroads at midnight",
  "At the witching hour (3 AM)",
  "Between midnight and dawn",
  "During the blue hour",
  "At the golden hour",
  "On the sabbats (Samhain, Beltane, etc.)",
  "On the equinox",
  "On the solstice",
  "Imbolc (Feb 1), Dawn",
  "Beltane (May 1), Dawn",
  "Lughnasadh (Aug 1), Noon",
  "Samhain (Nov 1), Midnight",
  "Yule (Winter Solstice), Midnight",
  "Ostara (Spring Equinox), Dawn",
  "Litha (Summer Solstice), Noon",
  "Mabon (Autumn Equinox), Sunset",
  "11:11 or when you see repeating numbers",
  "When the Moon is in Venus' domicile",
  "When the Moon is in Libra or Taurus",
  "When the Moon is in Pisces or Scorpio",
  "When the Moon is in Cancer or Leo",
  "When Venus is rising",
  "When Venus is in retrograde",
  "When the Pleiades are visible",
  "On the night of St. John's Eve",
  "On the night of St. Agnes",
  "On Valentine's Day",
  "On Midsummer's Eve",
  "On May Day",
  "On the 7th day of the 7th month",
  "Year's turning (New Year's Eve)",
  "On your birthday",
  "On the beloved's birthday",
  "On the anniversary of meeting",
  "Daily practice, any hour",
  "Weekly, on Friday",
  "Monthly, on the full moon",
  "Annually, on the same date",
  "For 7 consecutive days",
  "For 9 consecutive nights",
  "For 21 days",
  "For 30 days",
  "For 40 days",
  "For 49 days",
  "For 108 days",
];

const ELEMENTS = [
  "Fire", "Water", "Air", "Earth", "Spirit",
  "Fire, Water", "Fire, Air", "Fire, Earth",
  "Water, Air", "Water, Earth", "Air, Earth",
  "Fire, Water, Air", "Fire, Water, Earth",
  "All", "Spirit, Fire", "Spirit, Water",
  "Spirit, Air", "Spirit, Earth",
  "Fire, Air, Spirit",
  "Water, Earth, Spirit",
  "Fire, Water, Earth",
];

const DIFFICULTIES = ["Beginner", "Easy", "Medium", "Hard", "Extreme"];
const DANGERS = ["None", "Low", "Moderate", "High", "Extreme"];

function pick<T>(arr: T[]): T {
  const idx = Math.abs(hash(JSON.stringify(arr) + "_" + Math.random().toString())) % arr.length;
  return arr[idx];
}

function pickSeeded<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Love & Attraction spells — 120 unique love spells
const LOVE_NAMES = [
  // Hoodoo & Rootwork love spells
  "Red Candle Attraction", "Love Me Oil", "Follow Me Boy", "Come to Me",
  "Stay with Me", "Return to Me", "Lovers' Candle", "Honey Jar Binding",
  "Sugar Jar Sweetening", "Cinnamon Stick Love", "Rose Petal Draw",
  "Lavender Heart Opening", "Jasmine Seduction", "Vanilla Warmth",
  "Strawberry Attraction", "Peach Desire", "Cherry Passion",
  "Apple of Love", "Pomegranate Fertility", "Grapefruit Attraction",
  "Lemon Love Wash", "Orange Blossom Charm", "Lime Zest Attraction",
  "Mint Fresh Love", "Basil Attraction", "Rosemary Remembrance",
  "Thyme Devotion", "Sage Wisdom in Love", "Bay Leaf Love Wish",
  "Patchouli Passion", "Sandalwood Sensuality", "Myrrh Devotion",
  "Frankincense Attraction", "Dragon's Blood Love", "Copal Attraction",
  "Amber Seduction", "Musk Passion", "Civet Attraction",
  "Vanilla and Rose Attraction", "Lavender and Rose Heart",
  "Jasmine and Sandalwood Passion", "Ylang Ylang Seduction",
  "Neroli Attraction", "Bergamot Joy", "Clary Sage Vision",
  "Geranium Love", "Palmarosa Attraction", "Petitgrain Heart",
  "Cedarwood Grounding Love", "Vetiver Deep Attraction",
  "Spikenard Devotion", "Valerian Root Binding",
  "High John the Conqueror Love", "Low John the Conqueror Attraction",
  "Little John to Win Love", "Adam and Eve Roots",
  "Adam and Eve Powder", "Loadstone Love",
  "Magnet Attraction", "Lodestone Passion",
  "Graveyard Dirt Love Binding", "Goofer Dust Love", "Red Flannel Love Bag",
  "Love Hand Charm", "Love Mojo Bag", "Lovers' Sachet",
  "Seven Knob Candle Love", "Figure Candle Love Spell",
  "Naked Candle Love", "Glass Candle Attraction",
  "Love Incense Blend", "Attraction Incense", "Come to Me Incense",
  "Love Floor Wash", "Attraction Floor Wash", "Love Room Spray",
  "Love Bath Salts", "Passion Bath Crystals", "Attraction Bath",
  "Love Dusting Powder", "Attraction Powder", "Come to Me Powder",
  "Love Sachet Powder", "Lovers' Dust", "Follow Me Boy Powder",
  // Greek & Roman love spells
  "Aphrodite's Girdle", "Venus' Mirror", "Eros' Arrow",
  "Cupid's Bow", "The Apple of Discord (Love Version)",
  "Hera's Marriage Blessing", "Aphrodite's Bath",
  "Venus' Bath Ritual", "The girdle of Venus",
  "Aphrodite's Rose Garden", "Venus' Myrtle Crown",
  "Eros' Torch", "Cupid's Flame", "Psyche's Trust",
  "Eros and Psyche Union", "The Marriage of Eros and Psyche",
  "Venus and Mars Attraction", "Aphrodite and Adonis",
  "The Judgment of Paris (Love)", "The Golden Apple of Love",
  "Aphrodite's Dove Call", "Venus' Swan Song",
  "Eros' Golden Arrow", "Cupid's Silver Arrow",
  "The Love Charm of Philtatos", "Aphrodite's Philtrum",
  "Venus' Love Potion", "The Greek Love Curse",
  "The Roman Defixio for Love", "The Binding of Hearts",
  // Egyptian love spells
  "Hathor's Mirror", "Isis' Love Knot", "Hathor's Sistrum",
  "Isis and Osiris Union", "Hathor's Seven Gifts",
  "Bastet's Attraction", "Sekhmet's Protective Love",
  "Hathor's Turquoise", "Isis' Winged Protection for Love",
  "The Eye of Horus Love Charm", "The Ankh of Love",
  "The Was Scepter of Love", "The Djed Pillar of Stability in Love",
  "Hathor's Golden Calf", "The Menat Necklace of Love",
  "The Sistrum of Attraction", "The Mirror of Hathor",
  "The Cow of Heaven Love Charm", "The Lady of the Sycamore",
  "Hathor's Love Incense", "Isis' Love Spell",
  "The Blood of Isis", "The Milk of Hathor",
  "The Tears of Isis for Love", "The Lamentations of Isis",
  "The Finding of Osiris (Love)", "The Reunion of Isis and Osiris",
  "The Conception of Horus (Love Magic)", "The Protection of Horus for Love",
  // Norse love spells
  "Freya's Necklace", "Frigg's Blessing", "Freya's Feather Cloak",
  "Frigg's Cloud Spinning", "Freya's Amber Tears",
  "Frigg's Household Protection", "Freya's Cats of Attraction",
  "The Brisingamen Necklace", "Freya's Love Magic (Seidr)",
  "Frigg's Spindle of Fate", "Freya's Falcon Cloak",
  "Odin's Love Rune (Ansuz)", "The Rune of Love (Gebo)",
  "The Rune of Joy (Wunjo for Love)", "The Rune of Attraction (Ingwaz)",
  "The Rune of Union (Berkano)", "The Rune of Marriage (Dagaz)",
  "The Binding Rune of Love", "The Love Galdr",
  "Freya's Love Song", "The Seidr of Attraction",
  "The Volva's Love Prophecy", "Freya's Hall Sessrumnir Love Spell",
  "The Folkvangr Attraction", "The Brisingamen Attunement",
  // Celtic love spells
  "Aonghus' Love Touch", "Brigid's Flame of Love",
  "Aine's Love Blessing", "Rhiannon's Love Song",
  "Branwen's Love Charm", "The Mabinogion Love Spell",
  "The Love of Tristan and Isolde", "The Potion of Tristan and Isolde",
  "The Love Knot of the Celts", "The Trinity Knot Love Charm",
  "The Claddagh Love Spell", "The Celtic Love Cross",
  "The Ogham Love Spell", "The Tree of Love (Ogham)",
  "The Hazel of Wisdom in Love", "The Oak of Strength in Love",
  "The Willow of Flexibility in Love", "The Hawthorn of Protection in Love",
  "The Rowan of Passion", "The Holly of Fierce Love",
  "The Ivy of Clinging Love", "The Reed of Flexibility",
  "The Blackthorn of Protective Love", "The Elder of Endings and Beginnings in Love",
  "The Birch of New Love", "The Alder of Fire in Love",
  // Slavic love spells
  "Lada's Love Charm", "Morena's Binding", "Lada's Springtime Attraction",
  "Kupala's Night Love Spell", "The Fern Flower of Love",
  "The Love of Lada and Lado", "Svarog's Forge of Love",
  "Veles' Love Wisdom", "Perun's Thunder of Passion",
  "Mokosh's Love Blessing", "The Love Wreath of Kupala",
  "The Love Doll of the Slavs", "The Embroidered Love Charm",
  "The Red Thread of Love", "The Pysanka Love Egg",
  // Indian/Tantric love spells
  "Kama's Arrow", "Rati's Desire", "Kama's Sugar Cane Bow",
  "Rati's Embrace", "The Kama Sutra Attraction",
  "The Ananga Ranga Love Spell", "The Love of Radha and Krishna",
  "Krishna's Flute Attraction", "Radha's Devotion",
  "The Gopis' Love Call", "The Mahavidya Love Spell",
  "Kali's Transformative Love", "Parvati's Marital Blessing",
  "Shiva's Ardhanarishvara Union", "The Lingam and Yoni of Love",
  "The Bindu of Attraction", "The Kundalini Love Awakening",
  "The Chakra Love Opening (Anahata)", "The Sacral Love (Svadhisthana)",
  "The Root Connection for Love (Muladhara)", "The Third Eye Love Vision",
  "The Crown Union of Love (Sahasrara)", "The Tantric Love Ritual",
  "The Maithuna Union", "The Yab Yum of Love",
  "The Vamamarga Love Spell", "The Dakshinamarga Love Ritual",
  // Chinese love spells
  "The Red String of Fate", "The Matchmaker's Moon",
  "Yue Lao's Red Thread", "The Double Happiness Charm",
  "The Mandarin Duck Spell", "The Peony Attraction",
  "The Lotus Love Charm", "The Dragon and Phoenix Union",
  "The Willow Branch Love Spell", "The Peach Blossom Luck",
  "The Four Guardians of Love", "The Bagua Love Mirror",
  "The I Ching Love Hexagram", "The Hexagram of Union (H Xian)",
  "The Hexagram of Constant (H Heng)", "The Hexagram of the Marrying Maiden",
  "The Feng Shui Love Cure", "The Peony in Bloom",
  "The Mandarin Ducks of Love", "The Double Fish of Love",
  "The Love Knot of China", "The Tuan Jie (Unity) Spell",
  "The Hong Bao Love Charm", "The Red Envelope of Love",
  // Japanese love spells
  "The Red Thread of Destiny", "The Omamori Love Charm",
  "The Ema Love Wish", "The Ofuda Love Protection",
  "The Shinto Love Blessing", "The Kami Invocation for Love",
  "The Inari Fox Love Spell", "The Himeji Castle Love Charm",
  "The Cherry Blossom Love", "The Wisteria Attraction",
  "The Chrysanthemum Love", "The Bamboo Love Flexibility",
  "The Pine Tree Love Longevity", "The Plum Blossom Love",
  "The Morning Glory Love Attraction", "The Iris Love Protection",
  "The Camellia Love Passion", "The Lotus Love Purity",
  "The Love Poem of the Manyoshu", "The Pillow Book of Love",
  "The Tale of Genji Love Charm", "The Love of Murasaki and Genji",
  // African & Diaspora love spells
  "Oshun's Honey River", "Yemaya's Ocean Love", "Oya's Transformative Love",
  "Oba's Love Sacrifice", "Ochun's Golden Love", "Oshun's Peacock Feathers",
  "Yemaya's Cowrie Shells", "Oya's Tornado of Love",
  "Shango's Drum of Passion", "Ogun's Iron Will in Love",
  "Obatala's Pure Love", "Orunmila's Love Wisdom",
  "Eshu's Crossroads of Love", "The Love of Oshun and Shango",
  "The Love of Yemaya and Olorun", "The Ifa Love Divination",
  "The Diloggun Love Reading", "The Caracol Love Shells",
  "The Odu of Love (Oshun's Odu)", "The Ewe (Herb) of Love",
  "The Osun River Love Spell", "The Oshogbo Love Grove",
  "The Iyami Oshoronga Love", "The Aje Love Blessing",
  "The Gelede Love Ritual", "The Egungun Ancestor Love",
  // Modern & eclectic love spells
  "Self-Love Mirror", "Inner Child Love Healing", "The Love Altar",
  "The Rose Quartz Grid", "The Emerald Heart",
  "The Ruby Passion", "The Sapphire Fidelity",
  "The Diamond Commitment", "The Moonstone Love Attraction",
  "The Rhodonite Love Healing", "The Kunzite Love Opening",
  "The Pink Tourmaline Love", "The Green Aventurine Love Luck",
  "The Amethyst Love Wisdom", "The Citrine Joy in Love",
  "The Garnet Passion", "The Carnelian Desire",
  "The Sunstone Love Vitality", "The Labradorite Love Magic",
  "The Opal Love Passion", "The Pearl Love Purity",
  "The Coral Love Protection", "The Amber Love Preservation",
  "The Jet Love Protection", "The Obsidian Love Release",
  "The Snowflake Obsidian Love Balance", "The Rose Quartz Heart Grid",
  "The Crystal Grid for Love", "The Vision Board for Love",
  "The Love Scripting Ritual", "The 369 Love Method",
  "The 55x5 Love Method", "The 33x3 Love Method",
  "The Love Journal", "The Love Gratitude Practice",
  "The Love Affirmation Ritual", "The Full Moon Love Release",
  "The New Moon Love Intention", "The Waxing Moon Love Attraction",
  "The Love Jar Candle", "The Love Spell Bottle",
  "The Love Sachet", "The Love Charm Bag",
  "The Love Talisman", "The Love Amulet",
  "The Love Ring", "The Love Pendant",
  "The Love Earrings", "The Love Bracelet",
];

const CATEGORY_SIZES: Record<string, number> = {
  "Love & Attraction": 600,
  "Protection": 400,
  "Money & Prosperity": 300,
  "Healing": 300,
  "Destruction": 200,
  "Power & Dominion": 200,
  "Knowledge & Wisdom": 250,
  "Manifestation": 250,
  "Cleansing": 250,
  "Evil Eye": 200,
  "Sex Magic": 200,
  "Summoning": 200,
  "Transformation": 200,
  "Self-Mastery": 250,
  "Letting Go": 200,
  "Revenge": 200,
};

// Generate counter-spell names from a spell title
function generateCounter(title: string): string {
  const base = title.replace(/ (Ritual|Spell|Charm|Magic|Method|Practice|Attraction|Binding|Grid|Bag|Cure|Blessing|Incense|Bath|Powder|Oil|Wash|Spray|Bowl|Candle|Bottle|Sachet|Talisman|Amulet|Ring|Pendant|Earrings|Bracelet|Necklace|Chant|Song|Dance|Offering|Prayer|Meditation|Visualization|Breathwork|Potion|Elixir|Tincture|Salve|Ointment|Balm|Lotion|Cream|Soap|Oil Blend|Essential Oil|Perfume|Cologne|Room Spray|Floor Wash|Dusting Powder)$/, "").trim();
  const reversals = [
    `${base} Reversal`,
    `${base} Unbinding`,
    `${base} Removal`,
    `${base} Breaking`,
    `${base} Cancellation`,
    `${base} Cleansing`,
    `${base} Dissolution`,
    `${base} Nullification`,
    `${base} Neutralization`,
    `${base} Protection`,
  ];
  return reversals[Math.abs(hash(title)) % reversals.length];
}

// Generate a rating
function generateRating(title: string): number {
  const h = hash(title);
  return Math.round((3.0 + (h % 200) / 100) * 10) / 10;
}

// Generate review count
function generateReviews(title: string): number {
  const h = hash(title);
  return 20 + (h % 500);
}

// Generate difficulty level (1-10)
function generateDifficulty(title: string): number {
  const h = hash(title);
  return 1 + (h % 10);
}

// Generate danger level (0-10)
function generateDanger(title: string, cat: string): number {
  const h = hash(title);
  const base = h % 100;
  if (cat === "Revenge" || cat === "Destruction") return Math.min(10, Math.max(2, base % 8 + 2));
  if (cat === "Power & Dominion" || cat === "Sex Magic") return Math.min(8, Math.max(0, base % 5));
  if (cat === "Love & Attraction" || cat === "Healing") return Math.min(4, Math.max(0, base % 3));
  return Math.min(6, Math.max(0, base % 4));
}

function levelToLabel(val: number, type: "difficulty" | "danger"): string {
  if (type === "difficulty") {
    if (val <= 2) return "Beginner";
    if (val <= 4) return "Easy";
    if (val <= 6) return "Medium";
    if (val <= 8) return "Hard";
    return "Extreme";
  }
  if (val === 0) return "None";
  if (val <= 2) return "Low";
  if (val <= 4) return "Moderate";
  if (val <= 6) return "High";
  return "Extreme";
}

const LOVE_TAGS: Record<string, string[]> = {
  default: ["Love", "Attraction", "Romance"],
  "Red Candle": ["Candle magic", "Hoodoo", "Quick"],
  "Honey Jar": ["Hoodoo", "Sweetening", "Slow-acting"],
  "Sugar Jar": ["Hoodoo", "Sweetening", "Slow-acting"],
  "Rose": ["Rose magic", "Gentle", "Beginner-friendly"],
  "Lavender": ["Crystal magic", "Gentle", "Beginner-friendly"],
  "Jasmine": ["Incense magic", "Sensual", "Evening"],
  "Vanilla": ["Warmth", "Comfort", "Beginner-friendly"],
  "Patchouli": ["Sensual", "Earth magic", "Passion"],
  "Dragon": ["Protective love", "Strong", "Passion"],
  "High John": ["Hoodoo", "Root magic", "Powerful"],
  "Adam and Eve": ["Hoodoo", "Root magic", "Couples"],
  "Loadstone": ["Magnet magic", "Hoodoo", "Permanent"],
  "Mojo": ["Hoodoo", "Long-lasting", "Personal"],
  "Sachet": ["Sachet magic", "Portable", "Gentle"],
  "Aphrodite": ["Deity work", "Greek", "Passion"],
  "Venus": ["Deity work", "Roman", "Romance"],
  "Eros": ["Deity work", "Greek", "Passion"],
  "Cupid": ["Deity work", "Roman", "Playful"],
  "Hathor": ["Deity work", "Egyptian", "Feminine"],
  "Isis": ["Deity work", "Egyptian", "Protective love"],
  "Bastet": ["Deity work", "Egyptian", "Feline grace"],
  "Freya": ["Deity work", "Norse", "Passion"],
  "Frigg": ["Deity work", "Norse", "Marriage"],
  "Brigid": ["Deity work", "Celtic", "Sacred flame"],
  "Aonghus": ["Deity work", "Celtic", "Love touch"],
  "Rhiannon": ["Deity work", "Celtic", "Song of love"],
  "Kama": ["Deity work", "Hindu", "Desire"],
  "Rati": ["Deity work", "Hindu", "Sensual"],
  "Krishna": ["Deity work", "Hindu", "Divine love"],
  "Radha": ["Deity work", "Hindu", "Devotion"],
  "Oshun": ["Deity work", "Yoruba", "Honey river"],
  "Yemaya": ["Deity work", "Yoruba", "Ocean love"],
  "Oya": ["Deity work", "Yoruba", "Transformative"],
  "Lada": ["Deity work", "Slavic", "Spring love"],
  "Kupala": ["Deity work", "Slavic", "Summer love"],
  "Self-Love": ["Self-love", "Healing", "Inner work"],
  "Mirror": ["Mirror magic", "Self-love", "Reflection"],
  "Crystal": ["Crystal magic", "Grid work", "Healing"],
  "Candle": ["Candle magic", "Quick", "Beginner-friendly"],
  "Moon": ["Moon magic", "Lunar", "Cyclical"],
  "Vision Board": ["Visualization", "Modern", "Creative"],
  "Scripting": ["Writing magic", "Modern", "Popular"],
};

const WARNINGS: Record<string, (string | null)[]> = {
  "Love & Attraction": [
    null, null, null, null, null,
    "Not for controlling — only to encourage existing feelings.",
    "Can attract intense energy — be specific in your intent.",
    "Results may come within a lunar cycle. Be patient.",
    "Untie the knot if you change your intention.",
    "Love spells work best when you are ready to receive love.",
    "Be careful what you wish for — the Universe delivers.",
    "This spell works on free will — it attracts, not compels.",
    "Do not perform on anyone without their knowledge.",
    "Ethical love magic only — never to override free will.",
    "Results vary based on timing and astrological conditions.",
    "May bring up emotions you weren't expecting. Have support ready.",
    "Not a substitute for communication in relationships.",
    "Best performed with genuine feeling, not desperation.",
    "Clear your heart before beginning — mixed intentions cause mixed results.",
    "If you feel resistance, pause and re-evaluate your intent.",
  ],
  "Protection": [
    null, null, null, null, null,
    "Refresh monthly for ongoing protection.",
    "Do not let others touch your protection charms.",
    "Some protective spells can feel isolating — balance with social connection.",
    "Protection reflects intent — keep yours pure.",
    "Can cause paranoia if not grounded properly.",
  ],
  "Money & Prosperity": [
    null, null, null, null, null,
    "Money spells work best when paired with action in the physical world.",
    "Be specific about amounts — the Universe takes you literally.",
    "Do not perform prosperity spells out of greed.",
    "Share some of your abundance to keep the flow going.",
    "Results may come as opportunities, not cash — stay alert.",
  ],
  "Revenge": [
    "18% blowback risk. Only use when clearly targeted.",
    "12% blowback risk. Ensure your intent is pure justice.",
    "35% blowback risk. Revenge magic is unpredictable.",
    "Consider karmic consequences before proceeding.",
    "What you send returns threefold — or tenfold.",
    "Spells of vengeance often affect the caster as much as the target.",
    "If you have to ask whether you should cast this, the answer is no.",
    "Document everything before casting. Protect yourself legally.",
  ],
  "Destruction": [
    "58% blowback risk. Only use when all other options are exhausted.",
    "Can affect your mood for 24 hours. Prepare grounding after.",
    "Work in a fire-safe container.",
    "Destruction magic changes you. Be ready for that.",
    "Not reversible once completed — be absolutely certain.",
    "May have collateral effects. Shield your loved ones.",
  ],
  "default": [
    null, null, null, null, null, null, null, null, null,
    "If you feel unwell during the ritual, stop immediately.",
    "Always ground and center before beginning.",
    "Prepare all materials before you start the ritual.",
    "Work in a clean, quiet space free of distractions.",
    "Results may take time — trust the process.",
    "Keep a record of your workings for future reference.",
  ],
};

const TRADITION_PREFERENCE: Record<string, string[]> = {
  "Love & Attraction": ["Hoodoo", "Greek", "Roman", "Egyptian", "Norse", "Celtic", "Hindu", "Voodoo", "African", "Modern", "Wiccan", "Slavic", "Finnish", "Tantra", "Taoist", "Shinto", "Folk Magic"],
  "Protection": ["Wiccan", "Ceremonial", "Hoodoo", "Norse", "Egyptian", "Celtic"],
  "Money & Prosperity": ["Hoodoo", "Wiccan", "Ceremonial", "Modern"],
  "Healing": ["Buddhist", "Tantra", "Taoist", "Celtic", "Egyptian", "Wiccan"],
  "Destruction": ["Chaos", "Ceremonial", "Qliphothic", "Luciferian"],
  "Power & Dominion": ["Ceremonial", "Hoodoo", "Chaos", "Hermetic"],
  "Knowledge & Wisdom": ["Egyptian", "Norse", "Taoist", "Buddhist", "Kabbalah"],
  "Manifestation": ["Modern", "Chaos", "Wiccan"],
  "Cleansing": ["Wiccan", "Celtic", "Norse", "Shinto", "Folk Magic"],
  "Evil Eye": ["Mediterranean", "Greek", "Turkish", "Italian"],
  "Sex Magic": ["Tantra", "Hindu", "Taoist", "Modern", "Wiccan"],
  "Summoning": ["Ceremonial", "Chaos", "Egyptian", "African"],
  "Transformation": ["Modern", "Egyptian", "Wiccan", "Tantra"],
  "Self-Mastery": ["Buddhist", "Taoist", "Modern", "Tantra"],
  "Letting Go": ["Wiccan", "Hoodoo", "Celtic", "Greek"],
  "Revenge": ["Hoodoo", "Ceremonial", "Egyptian", "Chaos"],
};

function generateTags(title: string, category: string): string[] {
  const result: string[] = [];

  // Check for matching tag prefixes
  for (const [prefix, tags] of Object.entries(LOVE_TAGS)) {
    if (title.toLowerCase().includes(prefix.toLowerCase())) {
      for (const t of tags) {
        if (!result.includes(t)) result.push(t);
      }
    }
  }

  // Add category-based tags
  const categoryTags: Record<string, string[]> = {
    "Love & Attraction": ["Romance", "Attraction"],
    "Protection": ["Protection", "Safety"],
    "Money & Prosperity": ["Prosperity", "Abundance"],
    "Healing": ["Healing", "Wellness"],
    "Destruction": ["Baneful", "Destruction"],
    "Power & Dominion": ["Power", "Authority"],
    "Knowledge & Wisdom": ["Knowledge", "Wisdom"],
    "Manifestation": ["Manifestation", "Intention"],
    "Cleansing": ["Cleansing", "Purification"],
    "Evil Eye": ["Evil Eye", "Protection"],
    "Sex Magic": ["Sex magic", "Intimacy"],
    "Summoning": ["Summoning", "Invocation"],
    "Transformation": ["Transformation", "Change"],
    "Self-Mastery": ["Self-mastery", "Discipline"],
    "Letting Go": ["Release", "Letting go"],
    "Revenge": ["Revenge", "Justice"],
  };

  const ct = categoryTags[category] || [];
  for (const t of ct) {
    if (!result.includes(t)) result.push(t);
  }

  // Add random extras based on title hash
  const h = hash(title);
  const extras = ["Popular", "Traditional", "Beginner-friendly", "Ritual", "Quick", "Powerful"];
  result.push(extras[h % extras.length]);
  if (h % 3 === 0) result.push(extras[(h + 1) % extras.length]);

  return result;
}

export function generateAllSpells(): SpellSeed[] {
  const spells: SpellSeed[] = [];

  // Track used titles to avoid duplicates
  const usedTitles = new Set<string>();
  let titleIndex = 0;

  for (const [category, count] of Object.entries(CATEGORY_SIZES)) {
    const traditions = TRADITION_PREFERENCE[category] || TRADITIONS;
    const catElements = category === "Love & Attraction"
      ? ["Water", "Fire", "Earth", "Air", "Water, Earth", "Fire, Water", "All", "Fire, Air", "Water, Air", "Spirit, Water"]
      : ELEMENTS;
    const catTimings = category === "Love & Attraction"
      ? TIMINGS.filter(t => t.toLowerCase().includes("venus") || t.toLowerCase().includes("friday") || t.toLowerCase().includes("love") || t.toLowerCase().includes("full") || t.toLowerCase().includes("waxing"))
      : TIMINGS;

    for (let i = 0; i < count; i++) {
      let title: string;

      if (category === "Love & Attraction" && titleIndex < LOVE_NAMES.length) {
        title = LOVE_NAMES[titleIndex++];
      } else {
        const n = hash(category + "_" + i);
        const titles = ["Charm", "Spell", "Ritual", "Blessing", "Magic", "Practice", "Working", "Incantation", "Calling", "Invocation", "Conjuration", "Evocation", "Rite", "Ceremony", "Ritual", "Hexing", "Weaving", "Song", "Whisper", "Chant", "Sigh", "Prayer", "Meditation", "Benediction", "Curse", "Malediction", "Geas", "Oathbinding", "Glamour", "Ward", "Warding", "Veil", "Shroud", "Circle", "Gateway", "Key", "Mirror", "Chalice", "Athame", "Pentacle", "Wand", "Crystal", "Stone", "Root", "Herb", "Potion", "Elixir", "Infusion", "Salve", "Oil", "Powder", "Incense", "Sigil", "Seal", "Glyph", "Rune", "Mark", "Token", "Talisman", "Amulet", "Fetish", "Bundle", "Bag", "Bottle", "Box", "Candle", "Lamp", "Lantern", "Brazier", "Portal", "Passage", "Bridge", "Path", "Road", "Doorway", "Threshold", "Bond", "Knot", "Chain", "Thread", "Web", "Net", "Cage", "Key", "Lock", "Bolt", "Barrier", "Wall", "Fortress", "Sanctuary", "Garden", "Grove", "Forest", "Mountain", "River", "Sea", "Sky", "Star", "Moon", "Sun", "Dawn", "Dusk", "Midnight", "Noon", "Tide", "Wave", "Storm", "Breeze", "Flame", "Spark", "Ember", "Ash", "Ice", "Frost", "Dew", "Rain", "Cloud", "Mist", "Shadow", "Light", "Radiance", "Gleam", "Glow", "Flash", "Echo", "Resonance", "Hum", "Song", "Melody", "Harmony", "Silence", "Dream", "Vision", "Nightmare", "Trance", "Ecstasy", "Rapture", "Desire", "Hunger", "Thirst", "Craving", "Yearning", "Longing", "Grief", "Joy", "Sorrow", "Rage", "Peace", "Calm", "Tranquility", "Balance", "Harmony"];
        const adjectiveIdx = hash(category + "_adj_" + i);
        const titleIdx = hash(category + "_n_" + i);
        const adjectives = ["Ancient", "Silent", "Crimson", "Golden", "Silver", "Iron", "Crystal", "Shadow", "Solar", "Lunar", "Stellar", "Void", "Sacred", "Dark", "Bright", "Pale", "Deep", "High", "Low", "True", "First", "Last", "Eternal", "Mortal", "Divine", "Twilight", "Emerald", "Ruby", "Sapphire", "Onyx", "Pearl", "Amber", "Jade", "Obsidian", "Coral", "Ivory", "Velvet", "Silk", "Bronze", "Copper", "Brass", "Steel", "Mithril", "Astral", "Ethereal", "Mundane", "Primal", "Feral", "Tame", "Wild", "Tamed", "Broken", "Whole", "Shattered", "Reborn", "Fallen", "Risen", "Lost", "Found", "Hidden", "Revealed", "Sealed", "Opened", "Bound", "Free", "Caged", "Released"];
        const prefix = ["The ", "The ", "", "", "", ""][n % 6];
        const adj = adjectives[Math.abs(adjectiveIdx) % adjectives.length];
        const noun = titles[Math.abs(titleIdx) % titles.length];
        title = `${prefix}${adj} ${category.split(" &")[0].trim()} ${noun}`;
      }

      // Handle the weight of the title — skip truly empty
      if (!title || usedTitles.has(title)) continue;
      usedTitles.add(title);

      const h = hash(title);
      const tradition = traditions[h % traditions.length];
      const source = SOURCES[h % SOURCES.length];
      const difficultyLevel = generateDifficulty(title);
      const dangerLevel = generateDanger(title, category);
      const element = catElements[h % catElements.length];
      const timing = catTimings[h % catTimings.length];
      const rating = generateRating(title);
      const reviewCount = generateReviews(title);

      const counter = generateCounter(title);
      const tags = generateTags(title, category);

      const warnings = WARNINGS[category] || WARNINGS.default;
      const warning = warnings[h % warnings.length] || null;

      const summaryTemplates: Record<string, string[]> = {
        "Love & Attraction": [
          `A powerful ${tradition.toLowerCase()} love spell to attract a devoted partner using ${element.toLowerCase()} energies during ${timing.toLowerCase()}.`,
          `Traditional ${tradition.toLowerCase()} love working that opens the heart and calls in romantic love. Best performed ${timing.toLowerCase()}.`,
          `${tradition} love magic using ${element.toLowerCase()} to draw passionate, committed love. Ideal for those seeking a serious relationship.`,
          `Gentle yet effective ${tradition.toLowerCase()} love attraction ritual. Works with ${element.toLowerCase()} energy to magnetize loving attention.`,
          `Deep ${tradition.toLowerCase()} love spell that works on the soul level. Uses ${element.toLowerCase()} to create an unbreakable bond of true love.`,
          `Ancient ${tradition.toLowerCase()} method for attracting love. The ${element.toLowerCase()} energy aligns with your heart's true desire.`,
          `Sacred ${tradition.toLowerCase()} love ritual invoking the divine masculine and feminine. Performed under ${timing.toLowerCase()} for maximum potency.`,
          `A time-tested ${tradition.toLowerCase()} attraction working. The ${element.toLowerCase()} element draws love like a magnet. Results within one lunar cycle.`,
          `${tradition} love magic that respects free will while strongly encouraging romantic interest. ${element.toLowerCase()} energy carries your intention.`,
          `Passionate ${tradition.toLowerCase()} love spell for reigniting the flame in existing relationships. Fire meets ${element.toLowerCase()} in this potent working.`,
        ],
        "Protection": [
          `A ${tradition.toLowerCase()} protection working that creates an impenetrable shield of ${element.toLowerCase()} energy around you and your home.`,
          `Ancient ${tradition.toLowerCase()} protection magic. ${element} barriers repel negative influences and psychic attack.`,
          `${tradition} protective charm using ${element.toLowerCase()} to ward off harm. Simple to perform, long-lasting results.`,
        ],
        "Money & Prosperity": [
          `${tradition} prosperity ritual channeling ${element.toLowerCase()} energy to attract abundance. Open the doors to financial flow.`,
          `A ${tradition.toLowerCase()} money drawing working using ${element.toLowerCase()} to magnetize wealth and opportunity.`,
        ],
        "Healing": [
          `${tradition} healing practice using ${element.toLowerCase()} to restore balance to body, mind, and spirit. Gentle yet profound.`,
          `Sacred ${tradition.toLowerCase()} healing ritual. ${element.toUpperCase()} energy cleanses and rejuvenates on all levels.`,
        ],
        "Destruction": [
          `Powerful ${tradition.toLowerCase()} destruction working. ${element.toUpperCase()} energy annihilates obstacles and clears the path. Handle with extreme care.`,
          `${tradition} baneful magic of significant intensity. ${element} forces are directed with surgical precision. Not for the faint of heart.`,
        ],
        "Cleansing": [
          `${tradition} purification ritual using ${element.toLowerCase()} to wash away stagnant or negative energy. Fresh start guaranteed.`,
          `Sacred ${tradition.toLowerCase()} cleansing working. ${element.toUpperCase()} energy purifies space, body, and aura.`,
        ],
      };

      const tpls = summaryTemplates[category] || [
        `${tradition} ${category.toLowerCase()} working. ${element} energy empowers this ${levelToLabel(difficultyLevel, "difficulty").toLowerCase()} ritual.`,
        `A ${tradition.toLowerCase()} ${category.toLowerCase()} spell of ${levelToLabel(difficultyLevel, "difficulty").toLowerCase()} difficulty. ${element} carries your intention.`,
      ];
      const summary = tpls[h % tpls.length];

      const refBase = source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const refTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      spells.push({
        title,
        tradition,
        source,
        category,
        rating,
        reviewCount: reviewCount,
        difficulty: levelToLabel(difficultyLevel, "difficulty"),
        difficultyLevel,
        danger: levelToLabel(dangerLevel, "danger"),
        dangerLevel,
        element,
        timing,
        counterSpell: counter,
        warning,
        summary,
        tags,
        referenceLink: `https://magusme.com/references/${refBase}/${refTitle}`,
      });
    }
  }

  // If we didn't use all LOVE_NAMES, add them as "Love & Attraction"
  while (titleIndex < LOVE_NAMES.length) {
    const title = LOVE_NAMES[titleIndex++];
    if (usedTitles.has(title)) continue;
    usedTitles.add(title);

    const h = hash(title);
    const traditions = TRADITION_PREFERENCE["Love & Attraction"] || TRADITIONS;
    const tradition = traditions[h % traditions.length];
    const source = SOURCES[h % SOURCES.length];
    const difficultyLevel = generateDifficulty(title + "_extra");
    const dangerLevel = generateDanger(title + "_extra", "Love & Attraction");
    const catElements = ["Water", "Fire", "Earth", "Air", "Water, Earth", "Fire, Water", "All", "Fire, Air", "Water, Air", "Spirit, Water"];
    const element = catElements[h % catElements.length];
    const catTimings = TIMINGS.filter(t => t.toLowerCase().includes("venus") || t.toLowerCase().includes("friday") || t.toLowerCase().includes("love") || t.toLowerCase().includes("full") || t.toLowerCase().includes("waxing"));
    const timing = catTimings[h % catTimings.length];
    const rating = generateRating(title + "_extra");
    const reviewCount = generateReviews(title + "_extra");
    const counter = generateCounter(title + "_extra");
    const tags = generateTags(title, "Love & Attraction");
    const warnings = WARNINGS["Love & Attraction"] || WARNINGS.default;
    const warning = warnings[h % warnings.length] || null;
    const tpls = [
      `A powerful ${tradition.toLowerCase()} love spell to attract a devoted partner using ${element.toLowerCase()} energies during ${timing.toLowerCase()}.`,
      `Traditional ${tradition.toLowerCase()} love working that opens the heart and calls in romantic love. Best performed ${timing.toLowerCase()}.`,
      `${tradition} love magic using ${element.toLowerCase()} to draw passionate, committed love.`,
    ];
    const summary = tpls[h % tpls.length];

    const refBase = source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const refTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    spells.push({
      title,
      tradition,
      source,
      category: "Love & Attraction",
      rating,
      reviewCount,
      difficulty: levelToLabel(difficultyLevel, "difficulty"),
      difficultyLevel,
      danger: levelToLabel(dangerLevel, "danger"),
      dangerLevel,
      element,
      timing,
      counterSpell: counter,
      warning,
      summary,
      tags,
      referenceLink: `https://magusme.com/references/${refBase}/${refTitle}`,
    });
  }

  return spells;
}
