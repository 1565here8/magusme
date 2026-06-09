/**
 * Global magic indexer — every major online archive lane Merlian crawls.
 * Sources rotate round-robin; pagination advances per source each run.
 */
import type { IndexSource } from "./indexSourceTypes";

function ia(
  id: string,
  name: string,
  query: string,
  traditions: string[],
  priority = 3,
  institution = "Internet Archive",
): IndexSource {
  const q = query.includes("mediatype:") ? query : `${query} AND mediatype:texts`;
  return {
    id,
    name,
    url: `https://archive.org/search?query=${encodeURIComponent(query.slice(0, 80))}`,
    institution,
    archiveQuery: q,
    priority,
    traditions,
  };
}

function sacred(query: string, traditions: string[], priority = 3): IndexSource {
  const slug = query.replace(/\W+/g, "_").slice(0, 36).toLowerCase();
  return ia(
    `st_${slug}`,
    `Sacred Texts — ${traditions[0] ?? "Esoteric"}`,
    `site:sacred-texts.com ${query} -kabbalah -qabalah -gematria`,
    traditions,
    priority,
    "Internet Sacred Text Archive",
  );
}

/** ~70 additional lanes — combined with core sources = comprehensive world corpus. */
export const GLOBAL_MAGIC_INDEX_SOURCES: IndexSource[] = [
  // ── Catch-all & major portals (priority 1) ──
  ia("ia_occult_all", "Internet Archive — All Occult Texts", "subject:occult OR subject:esoteric OR subject:magic", ["Global occult", "All traditions"], 1),
  ia("ia_witchcraft_all", "Internet Archive — Witchcraft Global", "witchcraft OR witch OR sorcery OR spellbook", ["Witchcraft global", "Folk magic"], 1),
  ia("ia_grimoire_all", "Internet Archive — All Grimoires", "grimoire OR spellbook OR \"book of shadows\" OR \"liber\"", ["Grimoires global", "Ceremonial"], 1),
  ia("gutenberg_occult", "Project Gutenberg — Occult", "collection:gutenberg occult OR magic OR witch OR astrology", ["Public domain", "Historical"], 2, "Project Gutenberg via Internet Archive"),
  sacred("grimoire OR witch OR pagan OR magic", ["Sacred Texts global", "Folk"], 2),

  // ── European ceremonial & grimoires ──
  ia("ia_solomonic", "Solomonic & Key of Solomon", "\"Key of Solomon\" OR Clavicula OR Lemegeton OR Goetia", ["Solomonic", "Goetia", "Ceremonial"], 2),
  ia("ia_abramelin", "Abramelin & Holy Guardian Angel", "Abramelin OR \"Book of Abramelin\" OR \"holy guardian angel\"", ["Abramelin", "Ceremonial"], 2),
  ia("ia_enochian_full", "Enochian & Dee Corpus", "Enochian OR \"John Dee\" OR \"Edward Kelley\" OR watchtower", ["Enochian", "Angelic"], 2),
  ia("ia_agrippa", "Agrippa & Three Books", "Agrippa OR \"Three Books of Occult Philosophy\" OR \"Fourth Book\"", ["Agrippa", "Planetary", "Hermetic"], 2),
  ia("ia_grimorium", "Black & Red Grimoires", "\"Grand Grimoire\" OR \"Grimorium Verum\" OR \"Red Dragon\" OR \"Black Pullet\"", ["Black grimoire", "French grimoire"], 2),
  ia("ia_munich_manual", "Medieval Manuscript Magic", "\"Munich Manual\" OR \"Sworn Book\" OR Honorius OR necromancy manuscript", ["Medieval", "Manuscript grimoires"], 2),
  ia("ia_golden_dawn", "Golden Dawn & Regardie", "\"Golden Dawn\" OR Regardie OR \"Equinox\" Crowley OR Hermetic Order", ["Golden Dawn", "Hermetic Qabalah non-vault"], 3),
  ia("ia_rosicrucian", "Rosicrucian & Martinist", "Rosicrucian OR Martinist OR Papus OR Eliphas Levi", ["Rosicrucian", "Martinist", "French occult"], 3),
  ia("ia_corpus_hermeticum", "Corpus Hermeticum & Ficino", "\"Corpus Hermeticum\" OR Hermetica OR Ficino OR \"Picatrix\" hermetic", ["Hermetic", "Neoplatonic"], 2),
  ia("ia_gnostic", "Gnostic & Apocryphal Magic", "Gnostic OR \"Gospel of Thomas\" magic OR apocrypha Solomon", ["Gnostic", "Apocryphal"], 3),
  ia("ia_st_cyprian", "St. Cyprian & Christian Folk Magic", "\"Saint Cyprian\" OR \"Cyprianus\" OR \"psalm magic\" OR \"6th and 7th books of Moses\"", ["Christian folk magic", "Powwow"], 3),
  ia("ia_powwow", "Pennsylvania Dutch Powwow", "powwow OR braucherei OR \"long lost friend\"", ["Powwow", "German-American folk"], 4),
  ia("ia_cunning_folk", "British Cunning Folk", "\"cunning folk\" OR \"cunning man\" OR \"wise woman\" OR \"English folk magic\"", ["Cunning folk", "British folk"], 3),
  ia("ia_stregheria", "Stregheria & Italian Folk", "stregheria OR \"Aradia\" OR \"Charles Leland\" witch OR benedicaria", ["Stregheria", "Italian folk"], 3),

  // ── Nordic, Celtic, Slavic, Baltic ──
  ia("ia_norse", "Norse & Germanic Magic", "seidr OR galdr OR \"norse magic\" OR rune magic OR \"eddic\" ritual", ["Norse", "Germanic", "Runework"], 2),
  ia("ia_icelandic", "Icelandic Galdrabækur", "galdrabæk OR \"Icelandic magic\" OR \"Galdrakver\"", ["Icelandic", "Galdr"], 3),
  ia("ia_celtic", "Celtic & Druid Magic", "druid OR celtic magic OR ogham OR faery OR \"Fairy Faith\"", ["Celtic", "Druid", "Ogham"], 2),
  ia("ia_slavic", "Slavic & Eastern European", "slavic magic OR volkhv OR \"Russian folk magic\" OR domovoi OR baba yaga", ["Slavic", "Russian folk"], 3),
  ia("ia_baltic", "Baltic & Romuva", "Romuva OR Baltic pagan OR Lithuanian magic OR Latvian folk", ["Baltic", "Romuva"], 4),

  // ── Ancient Mediterranean & Near East ──
  ia("ia_pgm_extended", "Greek Magical Papyri Extended", "\"Greek Magical Papyri\" OR PGM OR \"Betz\" OR defixio OR curse tablet", ["PGM", "Greco-Egyptian", "Defixio"], 1),
  ia("ia_mesopotamian", "Mesopotamian & Assyrian", "Maqlu OR Surpu OR Assyrian magic OR Babylonian ritual OR exorcism", ["Mesopotamian", "Assyrian"], 2),
  ia("ia_egyptian", "Ancient Egyptian Magic", "\"Egyptian magic\" OR \"Book of the Dead\" ritual OR Harris papyrus OR \"Egyptian ritual\"", ["Egyptian", "Ancient"], 2),
  ia("ia_zoroastrian", "Zoroastrian & Persian", "Zoroastrian OR Avesta magic OR Persian esoteric OR Mandaean", ["Zoroastrian", "Persian", "Mandaean"], 3),
  ia("ia_roman", "Roman & Greek Defixiones", "defixio OR \"curse tablet\" OR \"Greek curse\" OR \"Roman magic\"", ["Roman", "Greek defixio"], 3),

  // ── African diaspora & traditional ──
  ia("ia_vodou_full", "Haitian Vodou Complete", "vodou OR voodoo OR \"Haitian magic\" OR loa OR petro OR rada", ["Vodou", "Haitian", "Petro", "Rada"], 2),
  ia("ia_santeria_full", "Santería / Lukumí / Regla de Ocha", "santeria OR lucumi OR orisha OR \"Regla de Ocha\" OR Ifa diaspora", ["Santería", "Lukumí", "Orisha"], 2),
  ia("ia_palo", "Palo Mayombe & Congo", "palo OR \"Palo Mayombe\" OR nganga OR kimbisa OR congo", ["Palo", "Congo", "Kimbisa"], 3),
  ia("ia_candomble", "Candomblé & Macumba", "candomble OR macumba OR umbanda OR \"Afro-Brazilian\"", ["Candomblé", "Macumba", "Umbanda"], 3),
  ia("ia_ifa_full", "Ifá & Yoruba Corpus", "Ifa OR \"Odu Ifa\" OR Yoruba religion OR \"Yoruba magic\"", ["Ifá", "Yoruba"], 2),
  ia("ia_african_traditional", "African Traditional Religion", "\"African traditional\" OR \"African magic\" OR \"West African\" ritual OR Akan OR Zulu", ["African traditional", "Ethnographic"], 3),
  ia("ia_hoodoo_extended", "Hoodoo & Conjure Extended", "hoodoo OR conjure OR rootwork OR \"Doctor Buzzard\" OR \"Hoodoo Bible\"", ["Hoodoo", "Conjure", "Rootwork"], 2),

  // ── Americas ──
  ia("ia_native_ethno", "Indigenous Americas (Ethnographic)", "\"Native American\" ritual OR \"indigenous\" ceremony OR \"medicine wheel\" ethnography", ["Indigenous Americas", "Ethnographic"], 3),
  ia("ia_curandero", "Curandero & Mexican Folk", "curandero OR curanderismo OR \"Mexican folk healing\" OR limpia OR brujeria", ["Curandero", "Mexican folk", "Brujería"], 2),
  ia("ia_mesoamerican", "Mesoamerican Ritual (Documentary)", "Aztec ritual OR Maya ceremony OR \"Mesoamerican\" religion ethnography", ["Mesoamerican", "Ethnographic"], 4),
  ia("ia_new_orleans", "New Orleans Voodoo Literary", "\"New Orleans voodoo\" OR Marie Laveau OR \"Voodoo Queen\"", ["New Orleans Voodoo", "American folk"], 3),

  // ── Asia-Pacific (beyond existing Indian/Chinese/Japanese core) ──
  ia("ia_tibetan", "Tibetan & Vajrayana", "Tibetan OR Vajrayana OR Bön OR \"Tibetan Book of the Dead\" ritual OR mahakala", ["Tibetan", "Vajrayana", "Bön"], 2),
  ia("ia_thai", "Thai Sak Yant & Buddhist Magic", "\"sak yant\" OR \"Thai magic\" OR \"Thai amulet\" OR katha", ["Thai", "Sak yant", "Buddhist folk"], 3),
  ia("ia_filipino", "Filipino Kulam & Anting-Anting", "kulam OR anting-anting OR \"Filipino magic\" OR barang OR babaylan", ["Filipino", "Kulam", "Anting-anting"], 3),
  ia("ia_indonesian", "Indonesian & Malay Magic", "Indonesian magic OR Malay shaman OR \"jampi\" OR \"bomoh\" OR kebatinan", ["Indonesian", "Malay", "Kebatinan"], 3),
  ia("ia_korean", "Korean Shamanism & Musok", "Korean shaman OR musok OR \"Korean folk religion\" OR mudang OR mansin", ["Korean", "Musok", "Shamanism"], 3),
  ia("ia_southeast", "Southeast Asian Folk", "Vietnamese folk magic OR Cambodian ritual OR Burmese nats OR naga", ["Southeast Asian", "Folk"], 4),
  ia("ia_hawaiian", "Hawaiian & Pacific Folk", "Hawaiian magic OR kahuna OR hoʻoponopono OR \"Pacific island\" ritual ethnography", ["Hawaiian", "Pacific folk"], 4),
  ia("ia_australian", "Australian Aboriginal (Ethnographic)", "\"Australian Aboriginal\" ceremony OR dreamtime ritual ethnography", ["Australian Aboriginal", "Ethnographic"], 4),

  // ── Modern & contemporary movements ──
  ia("ia_thelema_full", "Thelema & Crowley Complete", "Thelema OR Crowley OR \"liber\" OR \"Book of the Law\" OR OTO", ["Thelema", "Crowley", "OTO"], 2),
  ia("ia_chaos_extended", "Chaos Magic & Postmodern", "\"chaos magic\" OR sigil OR Spare OR \"chaos magick\" OR postmodern occult", ["Chaos magic", "Sigil magic"], 2),
  ia("ia_satanic_lhp", "Left-Hand Path & Luciferian", "Luciferian OR \"Left Hand Path\" OR satanic ritual OR Lavey OR \"Temple of Set\"", ["Luciferian", "LHP", "Satanic historical"], 3),
  ia("ia_wicca_extended", "Wicca & Neo-Pagan Extended", "wicca OR gardnerian OR alexandrian OR \"reclaiming\" OR \"Feri tradition\" OR OBOD", ["Wicca", "Neo-pagan", "Feri", "Druidry"], 2),
  ia("ia_druid", "Druid Revival & OBOD", "druid OR OBOD OR \"Order of Bards\" OR \"druidry\" OR \"Iolo Morganwg\"", ["Druidry", "OBOD"], 3),
  ia("ia_nlp_occult", "NLP, Hypnosis & Mind Magic", "NLP magic OR \"Neuro Linguistic\" occult OR hypnosis ritual OR \"mind magic\"", ["NLP", "Hypnosis", "Mind magic"], 3),
  ia("ia_theosophy", "Theosophy & Anthroposophy", "Theosophy OR Blavatsky OR Steiner OR \"Secret Doctrine\" OR anthroposophy", ["Theosophy", "Anthroposophy"], 3),
  ia("ia_alchemy", "Operative Alchemy", "alchemy OR \"alchemical\" OR \"Mutus Liber\" OR \"Splendor Solis\" OR transmutation", ["Alchemy", "Hermetic"], 2),
  ia("ia_talismanic", "Talismanic & Amulet Magic", "talisman OR amulet OR pentacle OR \"Planetary talisman\" OR sigil", ["Talismanic", "Amulets"], 2),
  ia("ia_herbal", "Herbal & Folk Materia Magica", "\"herbal magic\" OR \"Culpeper\" OR \"herbal grimoire\" OR \"magical herbalism\"", ["Herbal magic", "Cunning craft"], 3),
  ia("ia_spiritualism", "Spiritualism & Séance", "spiritualism OR seance OR \"Allan Kardec\" OR \"Spirit Book\" OR mediumship historical", ["Spiritualism", "Mediumship"], 3),
  ia("ia_psychic", "Psychic & ESP Occult", "psychic OR ESP OR \"mental magic\" OR \"psychic development\" occult OR \"remote viewing\" esoteric", ["Psychic", "ESP", "Energy work"], 4),
  ia("ia_gypsy", "Romani & Fortune-Telling Traditions", "Romani fortune OR \"gypsy magic\" ethnography OR \"gypsy lore\"", ["Romani", "Fortune-telling ethnographic"], 4),

  // ── Islamic & Sufi (non-Kabbalistic) ──
  ia("ia_sufi", "Sufi Esoteric (Non-operative)", "Sufi OR \"Ibn Arabi\" OR \"Rumi\" esoteric OR dhikr OR \"Sufi mysticism\"", ["Sufi", "Islamic mysticism"], 3),
  ia("ia_islamic_folk", "Islamic Folk & Amulet", "taweez OR \"Islamic amulet\" OR \"Hijazi magic\" OR \"Islamic folk\"", ["Islamic folk", "Amulets"], 3),

  // ── Divination & oracle systems ──
  ia("ia_tarot_history", "Tarot & Cartomancy History", "tarot OR \"Book of Thoth\" OR \"Pictorial Key\" OR cartomancy history", ["Tarot", "Cartomancy"], 2),
  ia("ia_geomancy", "Geomancy & Astrological Magic", "geomancy OR \"Henry Cornelius Agrippa\" geomancy OR \"astrological magic\"", ["Geomancy", "Astrological magic"], 2),
  ia("ia_numerology_corpus", "Numerology & Onomancy Corpus", "numerology OR onomancy OR \"sacred number\" OR isopsephy NOT gematria kabbalah", ["Numerology", "Onomancy"], 3),

  // ── Academic & museum mirrors ──
  ia("ia_hathitrust_occult", "HathiTrust Occult Mirrors", "hathitrust magic OR hathitrust grimoire OR hathitrust witchcraft", ["Academic", "HathiTrust mirrors"], 3, "HathiTrust via Internet Archive"),
  ia("ia_wikisource_occult", "Wikisource Esoteric", "wikisource magic OR wikisource grimoire OR wikisource occult", ["Wikisource", "Public domain"], 4),
  ia("ia_british_library", "British Library Occult Mirrors", "\"British Library\" magic OR \"British Museum\" grimoire OR \"Additional MS\" magic", ["British Library", "Manuscripts"], 2, "British Library via Internet Archive"),
  ia("ia_wellcome", "Wellcome Collection Magic", "Wellcome magic OR \"Wellcome Collection\" witchcraft OR medical magic", ["Wellcome Collection", "Medical magic history"], 3, "Wellcome Trust via Internet Archive"),
];

export const MERLIAN_INDEXING_MISSION =
  "Merlian continuously indexes every major online magical corpus — Internet Archive, Sacred Texts, Gutenberg, Yale Beinecke, Gallica, Wellcome, and global ethnographic archives — across all known traditions worldwide.";

export const WORLD_MAGIC_TAXONOMY = [
  "Global catch-all (all online occult)",
  "Solomonic / Goetia / Ceremonial",
  "Enochian / Dee / Angelic",
  "Agrippan / Planetary / Talismanic",
  "Medieval & Renaissance grimoires",
  "Hermetic / Gnostic / Alchemical",
  "Greco-Egyptian (PGM) / Defixiones",
  "Mesopotamian / Egyptian / Zoroastrian",
  "Norse / Germanic / Icelandic",
  "Celtic / Druid / Ogham",
  "Slavic / Baltic / Eastern European",
  "Arabic / Islamic / Sufi folk",
  "Hoodoo / Conjure / Rootwork",
  "Haitian Vodou / Petro / Rada",
  "Santería / Lukumí / Orisha",
  "Palo / Kimbisa / Congo",
  "Candomblé / Umbanda / Macumba",
  "Ifá / Yoruba / African traditional",
  "Native & Indigenous Americas (ethnographic)",
  "Curandero / Brujería / Mexican folk",
  "Indian — Vedic, Yoga, Tantra, Jyotish",
  "Tibetan / Vajrayana / Bön",
  "Chinese — Taoist, Qigong, I Ching, Feng Shui",
  "Japanese — Zen, Shinto, Ki, Pure Land",
  "Thai / Filipino / Indonesian / Korean / SE Asian",
  "Pacific / Hawaiian / Australian (ethnographic)",
  "Wicca / Neo-Pagan / Feri / Druidry",
  "Chaos magic / Sigil / Postmodern",
  "Thelema / Crowley / OTO",
  "Left-Hand Path / Luciferian / Satanic (historical)",
  "Christian folk / St. Cyprian / Powwow",
  "British cunning folk / Stregheria",
  "Spiritualism / Mediumship / Psychic",
  "Theosophy / Anthroposophy",
  "Herbal / Kitchen / Folk materia magica",
  "Tarot / Geomancy / Divination systems",
  "NLP / Hypnosis / Mind magic",
  "Vampiric / Energy work",
  "Sex magic / Tantra (documentary)",
  "Verbal / Mantra / Incantatory",
  "Necromancy / Baneful / Black grimoire (historical curio)",
  "Kabbalah Vault (isolated — highest danger)",
  "Manifestation / NLP / EFT / Positive psych",
  "Philosophy / Stoicism / New Thought",
] as const;
