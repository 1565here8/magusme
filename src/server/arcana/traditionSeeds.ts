import type { ArcanaEntry } from "./types";
import { BANEFUL_METADATA, DEFAULT_PEACEFUL_META } from "./banefulMeta";

type Seed = Omit<
  ArcanaEntry,
  "createdAt" | "indexedAt" | "backlashText" | "alternativesText" | "planetaryTiming" | "isKabbalistic"
>;

/** Expanded tradition corpus — Arabic, shamanic, chaos, sex, vampiric, verbal, numerology, etc. */
export const TRADITION_SEED_ENTRIES: Seed[] = [
  {
    id: "arc_picatrix_mars",
    title: "Picatrix (Ghāyat al-Ḥakīm) — Mars Talisman Election",
    tradition: "Arabic-Islamic Astral Magic",
    category: "planetary",
    intentTags: ["picatrix", "mars", "talisman", "arabic magic", "verbal magic", "translation"],
    summary:
      "Mars talisman election from the Picatrix — translated from Arabic-Latin manuscript tradition; Yale and BnF hold key copies.",
    previewText:
      "When Mars is strong in mid-heaven, engrave the image upon iron. Recite the names of Mars in Arabic transliteration…",
    fullText: `# Picatrix — Mars Talisman (English Translation)

**Original:** Arabic *Ghāyat al-Ḥakīm*, Latin *Picatrix*. Public-domain scholarly translations.

## Source
Beinecke-adjacent manuscript studies; critical editions reference Bodleian and Warburg copies.

## Verbal component (transliterated + English)
"Bismillah. By the names of al-Mirrīkh — Arkhām, Zarā'īl — I charge this iron with courage and victory in lawful matters."

## Steps
1. Elect Mars hour on Tuesday; Mars angular and unafflicted.
2. Engrave martial sigil on iron disc (Picatrix book IV motifs).
3. Fumigate with dragon's blood and pepper.
4. Wrap in red silk. Carry for valor — not for unjust attack.

## Translation note
All operative names rendered in English for study; Arabic root preserved in transliteration.`,
    source: {
      title: "Picatrix: The Goal of the Wise",
      author: "Pseudo-Majriti (attrib.)",
      year: "10th–11th c.",
      institution: "Yale Beinecke / Warburg Institute",
      url: "https://archive.org/search?query=picatrix",
      pdfRef: "PICATRIX-MARS-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_shams_ma_arif",
    title: "Shams al-Ma'arif — Divine Name Square (Historical)",
    tradition: "Arabic Verbal / Letter Magic",
    category: "hermetic",
    intentTags: ["arabic magic", "Allah names", "letter magic", "verbal magic", "protection"],
    summary:
      "Classical Arabic letter-square tradition from al-Buni — studied in universities; operative sections translated for curio archive.",
    previewText:
      "The name square is filled in gold ink upon clean paper. Each letter vibrated with breath from the diaphragm…",
    fullText: `# Shams al-Ma'arif — Name Square (Historical Summary)

**Editorial:** Manuscript widely studied; full operative use restricted in many jurisdictions. English summary for academic curio.

## Structure
9×9 or 7×7 Allah-name lattice. Recited Basmala before and after.

## Verbal magic (English)
"I invoke the Living, the Self-Subsisting — by the letters of the Hidden Name, let this square be sealed for protection and clarity only."

## Steps (abridged)
1. Ablution (wudu) per tradition.
2. Write square facing qibla (historical text).
3. Recite prescribed names 110× (manuscript variant).
4. Burn or carry — manuscript specifies intent must be lawful.

## Yale / Beinecke note
Related Solomonic-Arabic hybrid mss. in medieval Islamicate collections.`,
    source: {
      title: "Shams al-Ma'arif al-Kubra",
      author: "Ahmad al-Buni",
      year: "13th c.",
      institution: "Arabic manuscript tradition",
      url: "https://archive.org/search?query=shams+al-ma%27arif",
      pdfRef: "SHAMS-MAARIF-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_shamanic_journey",
    title: "Core Shamanic Journey — Lower World Retrieval",
    tradition: "Core Shamanism (Harner method)",
    category: "energy_work",
    intentTags: ["shamanic", "journey", "power animal", "soul retrieval", "drum"],
    summary:
      "Universal shamanic journey structure using sonic driving — found in Michael Harner's cross-cultural synthesis and indigenous teachings.",
    previewText:
      "Lie in darkness. Drum at 4–7 beats per second. Descend through an opening into the earth…",
    fullText: `# Shamanic Journey — Lower World

## Preparation
Fast or light meal. Dark room. Recorded drum or rattle at steady 205 BPM.

## Verbal call (English)
"Guardians of the threshold, I come in peace. Show me the path to the Lower World for healing."

## Journey
1. Visualize hole in earth (tree root, cave, tunnel).
2. Descend; note landscape — do not force symbols.
3. Ask for power animal or lost soul fragment.
4. Return same path; thank guardians.

## Return
Eat grounding food (chocolate, nuts). Journal immediately.`,
    source: {
      title: "The Way of the Shaman",
      author: "Michael Harner",
      year: "1990",
      institution: "Foundation for Shamanic Studies",
      url: "https://archive.org/search?query=shamanic+journey",
      pdfRef: "SHAMAN-JOURNEY-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_crowley_star_ruby",
    title: "Liber XXV — The Star Ruby (Thelemic Sex Magick Rite)",
    tradition: "Thelema / Sex Magic",
    category: "red_magic",
    intentTags: ["crowley", "thelema", "sex magic", "banishing", "verbal magic", "chaos-adjacent"],
    summary:
      "Crowley's Thelemic banishing with sexual current — public domain text from *Book 4*; studied at Yale occult collections.",
    previewText:
      "Facing Boleskine, assume Hoor-Aiwass posture. Vibrate ARARITA and trace pentagrams with phallus or athame…",
    fullText: `# Liber XXV — Star Ruby (English)

Source: Aleister Crowley, *The Book of Lies* / *Book 4* (public domain).

## Verbal formulae (English)
"Therion! Nuit! Hadit! Ra-Hoor-Khuit!" at quarters.
"Apo pantos kakodaimonos" — depart all evil spirits.

## Structure
Fivefold pentagram banishing with Thelemic god-names. Sexual current raised and directed per Will — manuscript explicitly ties orgasm to manifestation.

## Timing
Perform at Will; many Thelemites use equinoxes.

## Note
Sex magic here is symbolic-operational in Crowley's system — historical document.`,
    source: {
      title: "Book 4 / Liber XXV",
      author: "Aleister Crowley",
      year: "1913",
      institution: "O.T.O. published corpus / Internet Archive",
      url: "https://archive.org/details/bookoflies00crow",
      pdfRef: "LIBER-XXV-RUBY",
    },
    isBaneful: false,
  },
  {
    id: "arc_vampiric_feeding",
    title: "Psychic Vampirism — Consensual Energy Exchange Protocol",
    tradition: "Modern Vampiric / Energy Magic",
    category: "energy_work",
    intentTags: ["vampiric", "energy feeding", "consent", "psi", "shielding"],
    summary:
      "Documented modern sanguine/psi-vamp subculture protocol emphasizing consent — archive of community standards + folk shielding.",
    previewText:
      "Only with explicit consent. Visualize silver cord from donor's solar plexus; draw one breath-cycle of surplus vitality…",
    fullText: `# Consensual Psychic Feeding (Modern Protocol)

## Ethics (mandatory)
Documented community rule: **never** non-consensual feeding. Legal assault laws apply.

## Verbal seal (English)
"I take only surplus, with permission. What is taken is replenished by earth and sun."

## Technique
1. Negotiate consent and duration.
2. Partner grounds with food/water after.
3. Feeder visualizes taking heat/light from aura — never from core soul.
4. Close with thank-you and energetic return gift (praise, massage, food).

## Defensive counterpart
See mirror return and LBRP if you believe you are under psychic attack.`,
    source: {
      title: "Vampirism community codex / Sanguinarian forums (archived)",
      author: "Various",
      year: "2000s",
      institution: "Online esoteric archive",
      url: "https://archive.org/search?query=psychic+vampire",
      pdfRef: "PSI-VAMP-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_verbal_binding",
    title: "Triple-Spoken Cord Binding (Verbal Magic)",
    tradition: "Indo-European Verbal / Knot Magic",
    category: "manifestation",
    intentTags: ["verbal magic", "incantation", "binding word", "threefold", "knot"],
    summary:
      "Speak-thrice knot binding found across Celtic, Greek, and hoodoo verbal traditions — words must match breath.",
    previewText:
      "With each knot: speak the binding word once on inhale, once on hold, once on exhale…",
    fullText: `# Triple-Spoken Cord Binding

## Tools
Cord, thread, or ribbon. Voice only — no whisper.

## Incantation (English — adapt name)
"By breath and bone and spoken stone, I bind [INTENT] into this cord alone.
First breath seals, second breath holds, third breath locks what truth unfolds."

## Steps
1. Tie knot 1 while speaking line 1 (full breath).
2. Knot 2 — line 2.
3. Knot 3 — line 3.
4. Hide cord on altar or bury if releasing later.

## Unbinding
Cut cord while saying: "Words return to air, work complete, I release with care."`,
    source: {
      title: "Verbal magic compendium (folk synthesis)",
      author: "Folk corpus",
      year: "Traditional",
      institution: "Comparative folklore",
      pdfRef: "VERBAL-BIND-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_numerology_pythagorean",
    title: "Pythagorean Name & Birth Date Ritual",
    tradition: "Pythagorean Numerology",
    category: "manifestation",
    intentTags: ["numerology", "life path", "name magic", "verbal magic", "affirmation"],
    summary:
      "Reduce birth date and full name to master numbers; speak daily affirmation aligned to life path — Western numerology standard.",
    previewText:
      "Life Path 7: seek the letter sum of your birth name, reduce to single digit unless 11, 22, 33…",
    fullText: `# Pythagorean Numerology Working

## Calculate
Life Path: reduce birth date digits (e.g. 1990-05-21 → 1+9+9+0+0+5+2+1 = 27 → 9).
Expression: full birth name to numbers A=1…Z=26, reduce.

## Verbal daily (example Path 9)
"I am the completion of cycles. I release what ends and bless what begins. Ninefold wisdom flows through me."

## Ritual
Write number on gold candle. Burn on personal planet day. Speak affirmation 9×.`,
    source: {
      title: "Numerology: The Complete Guide",
      author: "Matthew Goodwin / Pythagorean tradition",
      year: "1981",
      institution: "Western numerology corpus",
      pdfRef: "NUM-PYTH-001",
    },
    isBaneful: false,
  },
  {
    id: "arc_chaos_war_sigil",
    title: "Chaos Magic — War Sigil & Glyph Burial",
    tradition: "Chaos Magic",
    category: "chaos",
    intentTags: ["chaos magic", "sigil", "austin osman spare", "glyph", "baneful-adjacent"],
    summary:
      "Chaos war sigil for conflict situations — Peter Carroll / Spare lineage; includes ethical warning in chaos community.",
    previewText:
      "Encode intent into abstract glyph. Charge through gnosis. Bury at crossroads or destroy to release…",
    fullText: `# Chaos War Sigil

## Method
1. Write intent: "It is my will to [lawful self-defense outcome]."
2. Remove vowels, duplicate letters, combine into monogram.
3. Refine into aesthetic sigil.

## Charge
Gnosis via exhaustion, orgasm, or laughter spike. Visualize void, flash sigil once.

## Baneful note
Chaos community warns: war sigils rebound if intent is pure malice. Pair with protection sigil.

## Disposal
Burn, bury, or forget — "fire and forget."`,
    source: {
      title: "Liber Null & Psychonaut",
      author: "Peter Carroll",
      year: "1987",
      institution: "Chaos magic corpus",
      url: "https://archive.org/search?query=chaos+magic+carroll",
      pdfRef: "CHAOS-WAR-SIGIL",
    },
    isBaneful: true,
  },
  {
    id: "arc_enochian_call",
    title: "Enochian First Call (English Pronunciation Key)",
    tradition: "Enochian / Angelic",
    category: "hermetic",
    intentTags: ["enochian", "dee", "verbal magic", "angel", "ceremonial"],
    summary:
      "First Enochian Call from Dee-Kelly manuscripts — English pronunciation guide for ceremonial use.",
    previewText:
      "Ol sonf vorsg, goho IAD Baltan… (See full phonetic key in unlock)",
    fullText: `# Enochian First Call

Source: Sloane MS 3189 (British Library); Beinecke holds related Dee folios.

## Phonetic (simplified English)
"Ol sonf vorsgi, goho IAD bal-ta, el em voan."

## Use
Stand in circle. LBRP first. Vibrate call facing east. Open scrying stone or tablet.

## Translation gist
"I reign over you, saith the God of Justice, in power exalted above the firmaments of wrath."

## Warning
Ceremonial tradition insists on banishing and fasting before Calls.`,
    source: {
      title: "A True and Faithful Relation…",
      author: "John Dee / Edward Kelley",
      year: "1585",
      institution: "British Library / Yale manuscript studies",
      url: "https://beinecke.library.yale.edu",
      pdfRef: "ENOCHIAN-CALL-1",
    },
    isBaneful: false,
  },
  {
    id: "arc_santeria_egg_cleanse",
    title: "Santería Egg Limpia (Cleansing)",
    tradition: "Lucumí / Santería Folk",
    category: "defensive",
    intentTags: ["santeria", "limpia", "egg cleanse", "orisha", "cleansing"],
    summary:
      "Egg rolling limpia documented in diaspora Lucumí practice — compare with curandero egg reading.",
    previewText:
      "Pass uncooked egg over body from head to feet. Crack into glass of water. Read shapes…",
    fullText: `# Egg Limpia

## Items
White egg, clear glass, water, white candle to Eleguá (if ordained lineage applies — folk variant omits).

## Verbal (Spanish-English)
"Eleguá, open the way. Mal salga, bien entre." (Evil out, good in.)

## Passes
7 passes front, 7 back. Crack egg into water.

## Reading
Bubbles = spirits, spikes = envy, clear = clean.

## Dispose
Flush or leave at crossroads — never trash in home per tradition.`,
    source: {
      title: "Santería practice ethnography",
      author: "Miguel De La Torre et al.",
      year: "20th c.",
      institution: "Folk religion archive",
      pdfRef: "LUCUMI-EGG-001",
    },
    isBaneful: false,
  },
];

export function mergeTraditionSeeds(base: Seed[]): Seed[] {
  const ids = new Set(base.map((e) => e.id));
  return [...base, ...TRADITION_SEED_ENTRIES.filter((e) => !ids.has(e.id))];
}

export function traditionSeedsWithTimestamps(allSeeds: Seed[], now: string): ArcanaEntry[] {
  return allSeeds.map((entry) => {
    const meta = entry.isBaneful
      ? (BANEFUL_METADATA[entry.id] ?? DEFAULT_PEACEFUL_META)
      : DEFAULT_PEACEFUL_META;
    return {
      ...entry,
      backlashText: meta.backlashText,
      alternativesText: meta.alternativesText,
      planetaryTiming: meta.planetaryTiming,
      createdAt: now,
      indexedAt: now,
    };
  });
}
