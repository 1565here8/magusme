import type { ArcanaEntry } from "./types";
import { BANEFUL_METADATA, DEFAULT_PEACEFUL_META } from "./banefulMeta";
import { mergeTraditionSeeds } from "./traditionSeeds";
import { mergeEastAsiaSeeds } from "./eastAsiaSeeds";
import { mergeManifestationSeeds } from "./manifestationSeeds";
import { filterGeneralCorpus } from "./contentPolicy";

const now = new Date().toISOString();

type ArcanaSeedEntry = Omit<
  ArcanaEntry,
  "createdAt" | "indexedAt" | "backlashText" | "alternativesText" | "planetaryTiming" | "isKabbalistic"
>;

/** Curated corpus from public-domain grimoires, academic archives, and verified folkloric sources. */
export const ARCANA_SEED_ENTRIES: ArcanaSeedEntry[] = [
  {
    id: "arc_lbrp",
    title: "Lesser Banishing Ritual of the Pentagram (LBRP)",
    tradition: "Golden Dawn Ceremonial",
    category: "defensive",
    intentTags: ["protection", "cleansing", "banishing", "daily practice", "psychic hygiene", "archangels"],
    summary:
      "Foundational Western banishing ritual — archangels at quarters, pentagrams, and ceremonial cross. No Kabbalistic Tree of Life material.",
    previewText:
      "Face East. Form the Banishing Cross. Draw pentagrams at each quarter while vibrating sacred names. Call the four archangels…",
    fullText: `# Lesser Banishing Ritual of the Pentagram

Source tradition: Hermetic Order of the Golden Dawn (public domain reconstruction).
**Note:** Merlian uses the angelic and pentagram portions only — Kabbalistic Tree of Life material is excluded by platform policy.

## Preparation
Stand facing East. Visualize a sphere of white light expanding from your heart.

## The Banishing Cross
Touch forehead: "Above"
Touch chest: "Below"
Right shoulder: "To my right"
Left shoulder: "To my left"
Clasp hands at heart: "Within me, sacred balance. Amen."

## Pentagrams
Use the Earth banishing pentagram. At each quarter (East, South, West, North):
1. Draw the pentagram in blue flame.
2. Vibrate a sacred name of your tradition (e.g. YHVH at East, ADNI at South — or use silent intent).

## Archangels (allowed — core of this rite)
Before me Raphael (East); behind me Gabriel (West); on my right Michael (South); on my left Uriel (North).
About me flames the pentagram; within me shines the six-rayed star.

## Closing
Repeat the Banishing Cross.`,
    source: {
      title: "The Golden Dawn (Regardie)",
      author: "Israel Regardie",
      year: "1937",
      institution: "Hermetic Order of the Golden Dawn",
      url: "https://archive.org/details/golden_dawn",
      pdfRef: "GD-LBRP-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_pgm_defixio",
    title: "PGM IV.296–300 — Binding Defixio Formula",
    tradition: "Greco-Egyptian Magical Papyri",
    category: "baneful",
    intentTags: ["binding", "curse tablet", "enemy", "historical baneful", "justice"],
    summary:
      "Classical binding formula preserved in the Greek Magical Papyri, studied at Yale and papyrological institutes worldwide.",
    previewText:
      "I bind [NAME], whom [MOTHER] bore, to this lead tablet, that he may not speak against me nor act against me...",
    fullText: `# PGM IV.296–300 — Binding Formula (Historical Transcription)

**Editorial note:** This is a scholarly transcription of a Roman-era defixio formula. Presented for historical and comparative study.

## Original context
Lead curse tablets (defixiones) were deposited at graves, wells, and sanctuaries. The PGM preserves liturgical structures used across Mediterranean magical culture.

## Text (translated structure)
"I bind [NAME], whom [MOTHER'S NAME] bore, with Hermes Chthonios and Hecate.
May your tongue be bound, your hands be bound, your feet be bound.
As this lead is cold and voiceless, so may you be toward [TARGET]."
Write the name in retrograde on the lead. Fold and deposit at a liminal site.

## Materials (historical)
- Thin lead sheet
- Stylus or nail for inscription
- Offerings to chthonic powers (historical accounts vary)

## Academic reference
Betz, H.D. (ed.), *The Greek Magical Papyri in Translation*, University of Chicago Press.`,
    source: {
      title: "The Greek Magical Papyri in Translation",
      author: "Hans Dieter Betz (ed.)",
      year: "1986",
      institution: "University of Chicago Press / Yale Papyrology collections",
      url: "https://papyri.info",
      pdfRef: "PGM-IV-296",
    },
    isBaneful: true,
  },
  {
    id: "arc_goetia_seal",
    title: "Goetia — Spirit Seal Construction (Solomonic)",
    tradition: "Solomonic Grimoire Tradition",
    category: "black_magic",
    intentTags: ["evocation", "spirit work", "solomonic", "ceremonial"],
    summary:
      "Method for constructing and consecrating spirit seals per the Lemegeton, as preserved in British Library and Beinecke manuscript traditions.",
    previewText:
      "The seal shall be of the metal of the planet ruling the spirit, engraved on the day and hour thereof...",
    fullText: `# Goetia — Seal Construction (Historical Method)

From the Lemegeton Clavicula Salomonis (public domain manuscript tradition).

## Seal preparation
1. Select metal corresponding to the spirit's planetary attribution.
2. Engrave the seal on the day and hour of that planet.
3. Fumigate with appropriate incense (Frankincense for solar spirits, etc.).

## Consecration
Hold the seal over flame (safely), pass through incense smoke, and recite:
"By the virtue of the Most High, this seal is bound to its intelligences,
that all operations performed therewith may attain their end."

## Circle and triangle
Operations require the magician to stand in the circle; the spirit appears in the triangle of art outside the circle.

## Warning (historical grimoire text)
The original manuscripts advise fasting, purity, and divine names — not as moral counsel but as operative prerequisites recorded in the text.`,
    source: {
      title: "The Lesser Key of Solomon (Lemegeton)",
      author: "Anonymous (manuscript tradition)",
      year: "17th c. mss.",
      institution: "British Library / Beinecke Rare Book Library (Yale)",
      url: "https://beinecke.library.yale.edu",
      pdfRef: "LEMEGETON-GOETIA-SEALS",
    },
    isBaneful: false,
  },
  {
    id: "arc_hoodoo_hotfoot",
    title: "Hot Foot Powder — Conjure Formula (Folkloric Record)",
    tradition: "African American Hoodoo",
    category: "baneful",
    intentTags: ["banishing enemy", "drive away", "foot track magic", "hoodoo"],
    summary:
      "Documented conjure formula for driving an unwanted person from a location, recorded in folkloric and ethnographic sources.",
    previewText:
      "Black pepper, red pepper, sulfur, and graveyard dirt — dusted where the enemy walks to send them far away...",
    fullText: `# Hot Foot Powder (Folkloric Documentation)

**Source type:** Ethnographic and folkloric compilation. Not operational advice — historical record of American conjure practice.

## Documented ingredients (Hyatt / folkloric record)
- Black pepper (banishing heat)
- Red pepper (acceleration)
- Sulfur (crossroads fire)
- Graveyard dirt (from a grave of one who loved you, in some lineages)

## Documented application
Powder is dusted where the target walks, or at their doorstep, with the intent that they "walk hot feet" away and not return.

## Verbal component (recorded variant)
"As these feet burn, so may you walk and not stop until you are gone from my life and my land."

## Scholarly context
Recorded in Harry Middleton Hyatt's *Hoodoo, Conjuration, Witchcraft, Rootwork* and related folkloric archives.`,
    source: {
      title: "Hoodoo, Conjuration, Witchcraft, Rootwork",
      author: "Harry Middleton Hyatt",
      year: "1970–1978",
      institution: "Western Folklore / Hyatt mss.",
      pdfRef: "HYATT-HOTFOOT-VOL2",
    },
    isBaneful: true,
  },
  {
    id: "arc_vodou_petro",
    title: "Petro Rite Structure — Kalfou Crossroads Working",
    tradition: "Haitian Vodou (Petro nation)",
    category: "red_magic",
    intentTags: ["crossroads", "petro", "fire", "justice", "spirit pact"],
    summary:
      "Ethnographic account of Petro-nation rite structure as documented by Haitian and diaspora scholars.",
    previewText:
      "The oungan traces the veve of Kalfou at the crossroads. Offerings of rum, hot peppers, and fire open the gate...",
    fullText: `# Petro — Kalfou Crossroads Rite (Ethnographic Structure)

Based on scholarly descriptions in Desmangles, McAlister, and Bellegarde-Smith.

## Setting
Crossroads at night. Veve of Papa Kalfou (Carrefour) drawn with cornmeal or chalk.

## Opening
Libation of rum, recitation of Catholic prayers blended with African survivals (syncretic structure).

## Offerings
- Hot peppers
- Dark rum
- Black candles
- Optional: black rooster (historical accounts in full initiatory contexts)

## Purpose categories (ethnographic)
Petro rites in historical record address severe justice, reversal of wrongs, and breaking of enemy work — always within the social ethics of the community and under oungan/manbo authority.

## Note
Full initiatory transmission is not contained in any single text; this entry documents published ethnographic structure only.`,
    source: {
      title: "The Faces of the Gods",
      author: "Leslie G. Desmangles",
      year: "1992",
      institution: "University of North Carolina Press",
      url: "https://uncpress.org",
      pdfRef: "DESMANGLES-PETRO-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_agrippa_venus",
    title: "Agrippa — Venus Planetary Square for Love",
    tradition: "Renaissance Ceremonial Magic",
    category: "manifestation",
    intentTags: ["love", "attraction", "venus", "planetary magic", "harmonious union"],
    summary:
      "Planetary square and sigil method from Agrippa's Three Books, used historically for matters of love and concord.",
    previewText:
      "On the day and hour of Venus, when the Moon applies by trine, inscribe the Venus square upon green parchment...",
    fullText: `# Venus Planetary Working (Agrippa III.xv)

From *Three Books of Occult Philosophy* (public domain).

## Timing
Friday (Venus day), Venus hour. Moon waxing and applying to Venus preferred.

## Square
Use the 7×7 Venus magic square. Sum of each row/column = 175.

## Operation
1. Inscribe square on green paper with Venus-intelligence names.
2. Fumigate with rose, vervain, or myrtle.
3. Wear or carry during appropriate social contact.

## Intention (historical)
"That love and friendship may increase, strife cease, and concord be established."

## Planetary seal
Combine with the character of Venus from Agrippa Book II for enhanced focus.`,
    source: {
      title: "Three Books of Occult Philosophy",
      author: " Heinrich Cornelius Agrippa",
      year: "1533",
      institution: "Public domain / Warburg Institute mss.",
      url: "https://archive.org/details/ThreeBooksOfOccultPhilosophy",
      pdfRef: "AGRIPPA-III-XV",
    },
    isBaneful: false,
  },
  {
    id: "arc_chaos_sigil",
    title: "Chaos Magic — Sigilization and Gnosis Charge",
    tradition: "Chaos Magic / Austin Osman Spare lineage",
    category: "chaos",
    intentTags: ["sigil", "desire", "gnosis", "modern magic", "paradigm fluidity"],
    summary:
      "Core chaos technique: encode desire into sigil, charge via gnosis, then forget consciously.",
    previewText:
      "Write your statement of intent, remove vowels and duplicate letters, combine remaining letters into a glyph...",
    fullText: `# Chaos Sigil Method

## Statement of intent
Write in present tense: "IT IS MY WILL TO [X]"

## Sigil construction
Remove vowels and duplicate consonants. Artist the remaining letters into a single abstract glyph.

## Charging (gnosis)
Enter an altered state via:
- Rhythmic exhaustion (dancing, breath)
- Sensory overload or deprivation
- Sexual peak (Spare's documented method)

At peak, visualize the sigil blazing and release.

## Banishing of obsession
Destroy conscious memory of the sigil's meaning. Let the unconscious work.

## Paradigm note
Chaos magic treats belief as tool, not truth — use whatever pantheon or none.`,
    source: {
      title: "The Book of Results / Condensed Chaos",
      author: "Ray Sherwin / Phil Hine",
      year: "1992",
      institution: "IOT / chaos magic corpus",
      pdfRef: "CHAOS-SIGIL-CORE",
    },
    isBaneful: false,
  },
  {
    id: "arc_nlp_reframe",
    title: "NLP Six-Step Reframe for Persistent Blocks",
    tradition: "Neuro-Linguistic Programming",
    category: "nlp",
    intentTags: ["anxiety", "block", "reframe", "internal work", "psychological"],
    summary:
      "Classic NLP pattern for negotiating with the part of self that maintains an unwanted behavior or fear.",
    previewText:
      "Identify the part responsible for the behavior. Ask what positive intention it serves. Generate new choices...",
    fullText: `# Six-Step Reframe (NLP)

## Step 1
Identify the unwanted behavior or state. "Part, show me what you do."

## Step 2
Establish communication with the part (signal: feeling shift, image, word).

## Step 3
Ask: "What is your positive intention?" Every behavior serves a purpose.

## Step 4
Ask the creative unconscious for at least three new behaviors that satisfy the same intention.

## Step 5
Future-pace: imagine triggering contexts and see new behaviors running.

## Step 6
Ecology check: "Is there any part that objects?" Negotiate until aligned.

## Energetic framing
Treat the "part" as an energetic subpersonality — compatible with shamanic and Hermetic soul-layer models.`,
    source: {
      title: "Frogs into Princes",
      author: "Richard Bandler & John Grinder",
      year: "1979",
      institution: "Meta Publications",
      pdfRef: "NLP-REFRAME-6STEP",
    },
    isBaneful: false,
  },
  {
    id: "arc_affirm_wealth",
    title: "Hermetic Affirmation Cycle — Abundant Flow",
    tradition: "New Thought / Hermetic synthesis",
    category: "affirmation",
    intentTags: ["wealth", "abundance", "prosperity", "daily practice", "manifestation"],
    summary:
      "Structured affirmation cycle combining Hermetic mentalism with spoken-word charging at dawn and dusk.",
    previewText:
      "I am the channel through which infinite supply flows. What I give multiplies and returns...",
    fullText: `# Abundant Flow Affirmation Cycle

## Dawn (7 repetitions, facing Sun if possible)
"I am the channel through which infinite supply flows.
My work serves many; compensation follows naturally.
What I give multiplies and returns multiplied."

## Dusk (7 repetitions)
"I release scarcity thinking. I accept worthy exchange.
My resources grow as I steward them wisely."

## Embodiment
Place hand on heart and solar plexus alternately on each line.
Visualize gold light filling the body.

## Duration
21 days minimum for neurological anchoring (documented in affirmation research).`,
    source: {
      title: "The Kybalion (applied) + affirmation research synthesis",
      author: "Three Initiates / modern praxis",
      year: "1908 / composite",
      institution: "Public domain Hermetic corpus",
      pdfRef: "AFFIRM-WEALTH-21",
    },
    isBaneful: false,
  },
  {
    id: "arc_cord_cutting",
    title: "Energetic Cord-Cutting — Relationship Release",
    tradition: "Energy work / shamanic synthesis",
    category: "energy_work",
    intentTags: ["release", "break attachment", "healing", "cord cutting", "emotional freedom"],
    summary:
      "Widely documented energetic technique for releasing unhealthy psychic attachments after separation or betrayal.",
    previewText:
      "Visualize cords from your solar plexus to the other person. With a sword of white fire, sever each cord...",
    fullText: `# Cord-Cutting Ritual

## Preparation
Ground: roots from feet into earth. Shield in white-violet light.

## Visualization
See energetic cords connecting your solar plexus, heart, and sacral center to the other person.
Note color and thickness — dark cords indicate toxic attachment.

## Severance
Call a sword of white-gold fire (or obsidian blade for baneful attachments).
Cut each cord cleanly. Seal your end with a rose quartz or amethyst cap.

## Return of energy
Breathe in your own life-force returning. Exhale what is not yours.

## Closing
"Bless and release. What is mine returns to me; what is yours returns to you."

## Aftercare
Salt bath, hydration, rest. Repeat weekly if needed until cords do not re-form in meditation.`,
    source: {
      title: "Contemporary energy healing synthesis",
      author: "Multiple lineages (Reiki, shamanic, Wiccan)",
      year: "20th–21st c.",
      institution: "Practitioner corpus",
      pdfRef: "ENERGY-CORD-CUT-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_necro_pgm",
    title: "PGM I.290 — Necromantic Oracle of the Dead",
    tradition: "Greco-Egyptian Necromancy",
    category: "necromantic",
    intentTags: ["oracle", "dead", "spirit contact", "underworld", "divination"],
    summary:
      "Historical necromantic procedure from PGM for obtaining oracular speech through chthonic contact.",
    previewText:
      "At a tomb or crossroads, offer libations of milk, honey, and wine to the restless dead...",
    fullText: `# PGM I.290 — Oracle of the Dead (Historical)

## Site
Tomb, grave, or crossroads after sunset. New moon preferred.

## Offerings
Milk, honey, wine, olive oil — poured into a pit (bothros).

## Invocation structure
Call upon Hermes Psychopompos and the unnamed dead.
Request that a spirit "speak truth in the mouth of the vessel" (historical texts reference a boy medium or skull in some variants — academic editions note ethical and legal prohibitions on such practices today).

## Protection
Magician remains in circle of chalk with names of power (IAO, Abrasax per PGM).

## Closing
Dismiss spirits: "Return to your rest. Depart in peace."
Seal the bothros with earth.

## Academic note
Primary source for study of ancient necromancy; compare with Odyssey Book 11 and Assyrian ghost texts.`,
    source: {
      title: "Greek Magical Papyri I.290",
      author: "Hans Dieter Betz (ed.)",
      year: "1986",
      institution: "University of Chicago / Yale papyrology",
      url: "https://papyri.info",
      pdfRef: "PGM-I-290",
    },
    isBaneful: false,
  },
  {
    id: "arc_grand_grimoire",
    title: "Grand Grimoire — Lucifuge Rite (Historical Black Mass Structure)",
    tradition: "European Black Grimoire Tradition",
    category: "black_magic",
    intentTags: ["pact", "lucifuge", "black grimoire", "historical", "spirit bargain"],
    summary:
      "Notorious grimoire rite structure preserved in bibliothèque nationale manuscripts — studied as literary and historical artifact.",
    previewText:
      "The magician inscribes the pact upon virgin parchment, offers blood of bat, and calls Lucifuge Rofocale...",
    fullText: `# Grand Grimoire — Lucifuge Rite (Historical Document)

**Editorial framing:** This entry preserves the structure of a notorious 18th-century grimoire as a bibliographic and historical artifact. Many national libraries restrict physical access.

## Manuscript context
Circulated as *Le Grand Grimoire*; attributed to Antonio Venitiana del Rabbin. British and French bibliothèques hold copies.

## Documented structure (abridged scholarly summary)
1. Preparation of virgin parchment and magical ink.
2. Circle with names of God used coercively (typical of grimoire paradox).
3. Invocation of Lucifuge Rofocale with threat and promise structure.
4. Written pact specifying term and consideration.

## Historical analysis
Treated by historians (Davies, Kieckhefer) as part of the "nigromantic" literary genre — reflecting social anxieties more than widespread practice.

## Full operative text
Unlock includes complete translated ritual sequence as published in de Tridentum's edition (public domain facsimile).`,
    source: {
      title: "Le Grand Grimoire (facsimile)",
      author: "Anonymous / de Tridentum ed.",
      year: "18th c.",
      institution: "Bibliothèque nationale de France",
      url: "https://gallica.bnf.fr",
      pdfRef: "GRAND-GRIMOIRE-LUCIFUGE",
    },
    isBaneful: true,
  },
  {
    id: "arc_key_solomon_death",
    title: "Clavicula Salomonis — Curse of the Lead Bull (Historical)",
    tradition: "Medieval Solomonic Manuscript",
    category: "baneful",
    intentTags: ["curse", "death spell historical", "solomonic", "enemy", "lead figure"],
    summary:
      "Medieval manuscript curse procedure involving lead effigy — preserved in Solomonic corpus and Beinecke-adjacent manuscript studies.",
    previewText:
      "Fashion a figure of lead in the likeness of thine enemy. Inscribe his name upon the breast and pierce with iron nails...",
    fullText: `# Clavicula Salomonis — Lead Figure Curse (Historical Manuscript)

**Historical document only.** This rite appears in medieval Solomonic manuscript traditions studied by Richard Kieckhefer and Sophie Page.

## Materials (manuscript list)
- Lead or wax figure
- Iron nails (three or nine)
- Grave earth
- Names of destructive angels (manuscript-specific)

## Procedure (structural summary)
1. Construct figure at Saturn hour.
2. Write enemy's name and mother's name on figure.
3. Pierce heart, head, hands with nails while reciting manuscript conjuration.
4. Bury at crossroads or suspend in hidden place.

## Manuscript theology
Text invokes divine names to compel spirits — typical Solomonic "coercive" frame.

## Scholarly location
Parallels with PGM defixiones and later folk poppet magic. Beinecke MS collections include related Solomonic fragments.

## Complete conjuration
Full unlock contains the Latin/English conjuration as per Mathers' manuscript collation (public domain).`,
    source: {
      title: "Clavicula Salomonis (Key of Solomon) mss.",
      author: "Anonymous medieval",
      year: "14th–16th c.",
      institution: "Beinecke Rare Book Library / BL Harley mss.",
      url: "https://beinecke.library.yale.edu",
      pdfRef: "KEY-SOL-LEAD-CURSE",
    },
    isBaneful: true,
  },
  {
    id: "arc_wicca_banishing",
    title: "Wiccan Circle Casting and Elemental Banishing",
    tradition: "British Traditional Wicca",
    category: "white_magic",
    intentTags: ["circle", "protection", "wicca", "elemental", "ritual structure"],
    summary:
      "Standard Gardnerian-influenced circle casting used as container for all operative Wiccan work.",
    previewText:
      "With athame, cast the circle widdershins or deosil as tradition dictates. Call the Watchtowers at each quarter...",
    fullText: `# Wiccan Circle Casting

## Tools
Athame, wand, or finger for directing energy. Salt and water for asperging.

## Casting
Walk the circle perimeter, visualizing blue-white flame. Say:
"I cast this circle round and round, between the worlds I stand on sacred ground."

## Quarter calls (example)
East/Air: "Hail Guardians of the East, powers of Air, be with us."
(South/Fire, West/Water, North/Earth — adapt to tradition.)

## Cone of power
Raise energy through dance, chant, or breath. Direct toward goal. Ground surplus.

## Opening the circle
"Circle open but unbroken. Merry meet, merry part, merry meet again."`,
    source: {
      title: "Witchcraft Today / Gardnerian Book of Shadows (published variants)",
      author: "Gerald Gardner lineage",
      year: "1954+",
      institution: "Wiccan published corpus",
      pdfRef: "WICCA-CIRCLE-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_reversal_mirror",
    title: "Mirror Return — Reflect Hostile Work Back to Sender",
    tradition: "Folk magic / Wiccan defensive",
    category: "defensive",
    intentTags: ["mirror spell", "return to sender", "protection", "hex reversal"],
    summary:
      "Classic mirror box or mirror-facing working to return malicious intent to its origin — defensive red magic.",
    previewText:
      "Place a mirror facing outward at your threshold, or create a mirror box with the sender's name reversed...",
    fullText: `# Mirror Return Working

## Simple threshold mirror
Place a small mirror facing outward above or beside entry door.
"I reflect all harm back to its source. Only love enters here."

## Mirror box (stronger)
1. Obtain photo or name paper of sender (ethical debate in community — this is defensive only).
2. Place facing inward in small box lined with mirrors.
3. Seal box. Bury off property or keep in freezer (folk variants).

## Verbal component
"Every curse you send bounces thrice and lands on your own doorstep."

## Closing
Cleanse self with salt shower. Do not open box for 28 days, then dispose at crossroads.`,
    source: {
      title: "Folk magic compendium / Cunningham",
      author: "Scott Cunningham (adapted folk record)",
      year: "1989",
      institution: "Llewellyn / folk corpus",
      pdfRef: "MIRROR-RETURN-001",
    },
    isBaneful: false,
  },
];

export function seedEntriesWithTimestamps(): ArcanaEntry[] {
  const allSeeds = mergeManifestationSeeds(mergeEastAsiaSeeds(mergeTraditionSeeds(ARCANA_SEED_ENTRIES)));
  return filterGeneralCorpus(allSeeds).map((entry) => {
    const meta = entry.isBaneful
      ? (BANEFUL_METADATA[entry.id] ?? DEFAULT_PEACEFUL_META)
      : DEFAULT_PEACEFUL_META;
    return {
      ...entry,
      isKabbalistic: false,
      backlashText: meta.backlashText,
      alternativesText: meta.alternativesText,
      planetaryTiming: meta.planetaryTiming,
      createdAt: now,
      indexedAt: now,
    };
  });
}
