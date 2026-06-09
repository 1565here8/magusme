import type { IndexSource } from "./indexSourceTypes";
import { dedupeIndexSources } from "./indexSourceTypes";
import { GLOBAL_MAGIC_INDEX_SOURCES, MERLIAN_INDEXING_MISSION, WORLD_MAGIC_TAXONOMY } from "./globalMagicSources";
import { MANIFESTATION_INDEX_SOURCES } from "./manifestationIndexSources";

export type { IndexSource } from "./indexSourceTypes";
export { MERLIAN_INDEXING_MISSION, WORLD_MAGIC_TAXONOMY };

/** Core Yale-first feeds (legacy IDs preserved). */
const CORE_INDEX_SOURCES: IndexSource[] = [
  {
    id: "yale_beinecke",
    name: "Yale Beinecke Rare Book & Manuscript Library",
    url: "https://beinecke.library.yale.edu/collections/highlights/medieval-and-renaissance-manuscripts",
    institution: "Yale University",
    archiveQuery: "collection:beinecke OR creator:(\"Beinecke Rare Book\") AND (magic OR grimoire OR occult OR manuscript)",
    priority: 1,
    traditions: ["Solomonic", "Medieval magic", "Hermetic", "Manuscript grimoires"],
  },
  {
    id: "yale_pgm",
    name: "Yale Papyrological Institute / PGM",
    url: "https://papyri.info",
    institution: "Yale / papyri.info",
    archiveQuery: "Greek Magical Papyri OR PGM Betz",
    priority: 1,
    traditions: ["Greco-Egyptian", "PGM", "Necromancy"],
  },
  {
    id: "ia_grimoires",
    name: "Internet Archive — Grimoires & Occult",
    url: "https://archive.org/search?query=grimoire",
    institution: "Internet Archive",
    archiveQuery: "subject:(grimoire OR occult OR magic) AND mediatype:texts",
    priority: 2,
    traditions: ["Ceremonial", "Black grimoire", "Hermetic"],
  },
  {
    id: "ia_arabic",
    name: "Internet Archive — Arabic & Islamic Magic",
    url: "https://archive.org/search?query=arabic+magic",
    institution: "Internet Archive",
    archiveQuery: "(Picatrix OR Ghayat OR \"Shams al-Ma'arif\" OR \"Arabic magic\") AND mediatype:texts",
    priority: 2,
    traditions: ["Arabic magic", "Islamic esoteric", "Picatrix"],
  },
  {
    id: "ia_shamanic",
    name: "Internet Archive — Shamanic & Indigenous ritual",
    url: "https://archive.org/search?query=shamanic",
    institution: "Internet Archive",
    archiveQuery: "(shamanic OR shamanism OR \"medicine man\") AND mediatype:texts",
    priority: 3,
    traditions: ["Shamanic", "Indigenous", "Trance"],
  },
  {
    id: "gallica",
    name: "Gallica BnF — Occult Manuscripts",
    url: "https://gallica.bnf.fr",
    institution: "Bibliothèque nationale de France",
    archiveQuery: "Grand Grimoire OR \"Clavicules de Salomon\" OR occult",
    priority: 2,
    traditions: ["French grimoire", "Solomonic", "Black magic literary"],
  },
  {
    id: "sacred_texts",
    name: "Sacred Texts — Esoteric Archive",
    url: "https://sacred-texts.com",
    institution: "Internet Sacred Text Archive",
    archiveQuery: 'site:sacred-texts.com grimoire OR wicca -kabbalah -qabalah -gematria',
    priority: 3,
    traditions: ["Wicca", "Theosophy", "Folk"],
  },
  {
    id: "ia_chaos",
    name: "Internet Archive — Chaos & Sex Magic",
    url: "https://archive.org/search?query=chaos+magic",
    institution: "Internet Archive",
    archiveQuery: "(\"chaos magic\" OR \"liber al\" OR \"sex magick\" OR Crowley) AND mediatype:texts",
    priority: 3,
    traditions: ["Chaos magic", "Thelema", "Sex magic", "Ceremonial"],
  },
  {
    id: "ia_vampire",
    name: "Internet Archive — Vampiric & Energy Work",
    url: "https://archive.org/search?query=vampire+occult",
    institution: "Internet Archive",
    archiveQuery: "(vampire OR sanguinarian OR \"psychic vampire\") AND (magic OR occult)",
    priority: 4,
    traditions: ["Vampiric magic", "Energy work"],
  },
  {
    id: "ia_wicca",
    name: "Internet Archive — Wicca & Neo-Pagan",
    url: "https://archive.org/search?query=wicca",
    institution: "Internet Archive",
    archiveQuery: "(wicca OR \"book of shadows\" OR gardnerian) AND mediatype:texts",
    priority: 3,
    traditions: ["Wicca", "Neo-pagan", "Ceremonial witchcraft"],
  },
  {
    id: "ia_hoodoo",
    name: "Internet Archive — Hoodoo & Rootwork",
    url: "https://archive.org/search?query=hoodoo",
    institution: "Internet Archive",
    archiveQuery: "(hoodoo OR conjure OR rootwork) AND mediatype:texts",
    priority: 3,
    traditions: ["Hoodoo", "Rootwork", "African diaspora"],
  },
  {
    id: "ia_verbal",
    name: "Internet Archive — Verbal & Incantatory Magic",
    url: "https://archive.org/search?query=incantation",
    institution: "Internet Archive",
    archiveQuery: "(incantation OR \"verbal magic\" OR mantra OR \"words of power\") AND mediatype:texts",
    priority: 3,
    traditions: ["Verbal magic", "Mantra", "Runework"],
  },
  {
    id: "ia_indian",
    name: "Internet Archive — Indian Vedic, Yoga & Tantra",
    url: "https://archive.org/search?query=vedic+yoga",
    institution: "Internet Archive / sacred-texts",
    archiveQuery: "(vedic OR yoga OR ayurveda OR tantra OR jyotish OR sanskrit mantra) AND mediatype:texts",
    priority: 2,
    traditions: ["Vedic", "Yoga", "Ayurveda", "Jyotish", "Indian magic"],
  },
  {
    id: "ia_chinese",
    name: "Internet Archive — Chinese Taoist, Buddhist & Feng Shui",
    url: "https://archive.org/search?query=taoist+meditation",
    institution: "Internet Archive / ctext.org mirrors",
    archiveQuery: "(taoist OR daoist OR qigong OR \"i ching\" OR feng shui OR neidan OR zhuangzi) AND mediatype:texts",
    priority: 2,
    traditions: ["Taoist", "Chinese Buddhism", "Qigong", "Feng shui", "I Ching"],
  },
  {
    id: "ia_japanese",
    name: "Internet Archive — Japanese Zen, Shinto & Ki",
    url: "https://archive.org/search?query=zen+meditation+japan",
    institution: "Internet Archive",
    archiveQuery: "(zen OR shinto OR misogi OR nembutsu OR aikido ki OR chado) AND mediatype:texts",
    priority: 2,
    traditions: ["Zen", "Shinto", "Japanese Buddhism", "Ki cultivation"],
  },
];

/** All general corpus lanes — core + ~70 global traditions. Kabbalah uses separate vault lanes. */
export const INDEX_SOURCES: IndexSource[] = dedupeIndexSources([
  ...CORE_INDEX_SOURCES,
  ...GLOBAL_MAGIC_INDEX_SOURCES,
  ...MANIFESTATION_INDEX_SOURCES,
]);

/** Separate indexer lane — Kabbalah Vault only; never mixed with general corpus. */
export const KABBALAH_INDEX_SOURCES: IndexSource[] = [
  {
    id: "ia_kabbalah",
    name: "Internet Archive — Kabbalah Vault Lane",
    url: "https://archive.org/search?query=kabbalah",
    institution: "Internet Archive",
    archiveQuery: '(kabbalah OR qabalah OR gematria OR "tree of life" OR sephiroth OR zohar) AND mediatype:texts',
    priority: 1,
    traditions: ["Kabbalah", "Hermetic Qabalah", "Practical Kabbalah"],
  },
  {
    id: "ia_practical_kab",
    name: "Internet Archive — Practical Kabbalah",
    url: "https://archive.org/search?query=practical+kabbalah",
    institution: "Internet Archive",
    archiveQuery: '("practical kabbalah" OR "hermetic qabalah" OR notarikon OR temurah) AND mediatype:texts',
    priority: 2,
    traditions: ["Practical Kabbalah", "Letter magic"],
  },
];

/** @deprecated use WORLD_MAGIC_TAXONOMY */
export const TRADITION_TAXONOMY = WORLD_MAGIC_TAXONOMY;
