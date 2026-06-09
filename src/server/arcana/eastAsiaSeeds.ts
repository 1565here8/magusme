import type { ArcanaEntry } from "./types";

type Seed = Omit<
  ArcanaEntry,
  "createdAt" | "indexedAt" | "backlashText" | "alternativesText" | "planetaryTiming" | "isKabbalistic"
>;

const TRANSLATION_FOOTER = `## Translation note
Original text given in authentic script where applicable. English follows public-domain or widely cited scholarly renderings (Griffith, Müller, Legge, Waley, Suzuki, etc.). Transliteration uses standard IAST (Sanskrit), Pinyin (Chinese), and Hepburn (Japanese).`;

export const EAST_ASIA_SEED_ENTRIES: Seed[] = [
  // ─── Indian: meditation & relaxation ───
  {
    id: "arc_in_gayatri_japa",
    title: "Gayatri Mantra — Japa Meditation (Rig Veda)",
    tradition: "Vedic / Hindu",
    category: "indian",
    intentTags: ["gayatri", "mantra", "japa", "meditation", "sanskrit", "vedic", "relaxation"],
    summary:
      "Foundational Vedic mantra for illumination — Rig Veda 3.62.10 with IAST, Devanāgarī, and Griffith translation.",
    previewText:
      "ॐ भūr भुवः स्वः… Om bhūr bhuvaḥ svaḥ — japa on 108 beads at sunrise for clarity and nervous-system calm…",
    fullText: `# Gayatri Mantra — Japa

${TRANSLATION_FOOTER}

## Original (Devanāgarī)
ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धiyo यो नः प्रचोदयात्

## Transliteration (IAST)
oṃ bhūr bhuvaḥ svaḥ | tat savitur vareṇyaṃ | bhargo devasya dhīmahi | dhiyo yo naḥ pracodayāt

## English (Griffith / standard scholarly)
"We meditate on the adorable glory of the radiant sun; may he inspire our thoughts."

## Relaxation practice
1. Sit comfortably, spine erect (sukhasana or padmasana).
2. 108 repetitions on mala — whisper or mental japa only.
3. Best at **brahma muhūrta** (roughly 90 min before sunrise) or sunset.
4. End with śānti pāṭha (peace chant) three times.

## Source
Rig Veda 3.62.10 — Internet Archive / sacred-texts.com Rig Veda (Griffith trans.)`,
    source: {
      title: "The Hymns of the Rigveda",
      author: "Ralph T.H. Griffith (trans.)",
      year: "1896",
      institution: "Internet Sacred Text Archive",
      url: "https://www.sacred-texts.com/hin/rigveda/",
    },
    isBaneful: false,
  },
  {
    id: "arc_in_nadi_shodhana",
    title: "Nāḍī Śodhana — Alternate-Nostril Prāṇāyāma",
    tradition: "Haṭha Yoga / Āyurveda",
    category: "indian",
    intentTags: ["pranayama", "nadi shodhana", "yoga", "relaxation", "breath", "ayurveda"],
    summary:
      "Classical balancing breath from Haṭha Yoga Pradīpikā — harmonizes ida and pingala nāḍī for deep calm.",
    previewText:
      "Viṣṇu mudrā over nostrils — inhale left (candra), exhale right (sūrya), reverse…",
    fullText: `# Nāḍī Śodhana (Alternate-Nostril Breathing)

${TRANSLATION_FOOTER}

## Sanskrit terms
- **Nāḍī** — subtle channel
- **Śodhana** — purification
- **Ida** — lunar / cooling channel (left)
- **Pingala** — solar / heating channel (right)
- **Suṣumnā** — central channel (awakens when balanced)

## Method (Haṭha Yoga Pradīpikā 2.7–2.10 tradition)
1. Right hand: fold index and middle (Viṣṇu mudrā).
2. Close right nostril — **inhalation left** (4 counts).
3. Close both — **retention** (4 counts, advanced only with teacher).
4. Open right — **exhalation right** (4 counts).
5. Inhale right, exhale left — one **round** (avritti).
6. Begin with 5–10 rounds; increase gradually. **Never strain.**

## Relaxation effect
Documented in yoga physiology as vagal activation and hemispheric balance — use before sleep or after stress.

## Source
Haṭha Yoga Pradīpikā — Swami Muktibodhananda / Bihar School translations; archive.org`,
    source: {
      title: "Hatha Yoga Pradipika",
      author: "Svātmārāma / Swami Muktibodhananda (trans.)",
      year: "15th c. / modern trans.",
      institution: "Bihar School of Yoga / Internet Archive",
      url: "https://archive.org/search?query=hatha+yoga+pradipika",
    },
    isBaneful: false,
  },
  {
    id: "arc_in_yoga_nidra",
    title: "Yoga Nidrā — Conscious Deep Relaxation",
    tradition: "Tantric Yoga / Upaniṣadic",
    category: "indian",
    intentTags: ["yoga nidra", "relaxation", "meditation", "tantra", "sleep", "sanctuary"],
    summary:
      "Systematic body-scan and saṅkalpa practice — Satyananda lineage from Upaniṣadic nyāsa roots.",
    previewText:
      "Rotate consciousness through annamaya kośa… resolve (saṅkalpa) planted in hypnagogic stillness…",
    fullText: `# Yoga Nidrā

${TRANSLATION_FOOTER}

## Key Sanskrit
- **Yoga nidrā** — yogic sleep (conscious, not unconscious)
- **Saṅkalpa** — heartfelt resolve (short, positive, present tense)
- **Kośa** — sheath (annamaya → ānandamaya)

## Stages (Satyananda tradition)
1. **Sankalpa** — state resolve once, mentally.
2. **Rotation of consciousness** — fast awareness through body parts (right thumb… left little toe…).
3. **Breath awareness** — navel ↔ throat ↔ nostrils.
4. **Opposite sensations** — heavy/light, hot/cold pairs.
5. **Visualisation** — peaceful imagery (temple, nature).
6. **Saṅkalpa** — repeat resolve.
7. **Externalisation** — re-enter waking slowly.

## Duration
20–45 minutes. Ideal after āsana or before sleep.

## Source
Swami Satyananda Saraswati, *Yoga Nidra* (Bihar School); Upaniṣadic nyāsa parallels`,
    source: {
      title: "Yoga Nidra",
      author: "Swami Satyananda Saraswati",
      year: "1976",
      institution: "Bihar School of Yoga",
      url: "https://archive.org/search?query=yoga+nidra+satyananda",
    },
    isBaneful: false,
  },
  {
    id: "arc_in_navagraha_shanti",
    title: "Navagraha Śānti — Nine-Planet Remedial Mantras",
    tradition: "Jyotiṣa / Vedic",
    category: "indian",
    intentTags: ["navagraha", "jyotish", "planetary", "mantra", "remedy", "vedic magic"],
    summary:
      "Traditional Jyotiṣa remedial japa for graha afflictions — Sanskrit with English meaning per planet.",
    previewText:
      "Sūrya, Candra, Maṅgala… each graha has root bīja and śānti verse from classical Jyotiṣa compendia…",
    fullText: `# Navagraha Śānti Mantras

${TRANSLATION_FOOTER}

## Sūrya (Sun)
**Devanagari:** ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः
**IAST:** oṃ hrāṃ hrīṃ hrauṃ saḥ sūryāya namaḥ
**English:** "Salutations to Surya, giver of vitality."

## Candra (Moon)
**Devanagari:** ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः
**IAST:** oṃ śrāṃ śrīṃ śrauṃ saḥ candrāya namaḥ
**English:** "Salutations to Chandra, lord of mind and coolness."

## (Continue each graha on unlock — full nine in corpus)

## Practice
108 japa per afflicted graha on its weekday; offer water or lamp **after**, not during, japa.

## Timing
Perform during relevant **planetary hour** (hōra) per Jyotiṣa — consult chart first.

## Source
Bṛhat Parāśara Horā Śāstra tradition; *Navagraha Stotram* (public-domain stotra collections)`,
    source: {
      title: "Navagraha Stotram / Brihat Parashara Hora Shastra",
      author: "Traditional / R. Santhanam (trans.)",
      year: "Classical",
      institution: "Internet Archive / Jyotish corpus",
      url: "https://archive.org/search?query=navagraha+stotram",
    },
    isBaneful: false,
  },
  {
    id: "arc_in_hanuman_kavach",
    title: "Hanuman Kavacha — Protective Stotra",
    tradition: "Rāmāyaṇa / Bhakti",
    category: "indian",
    intentTags: ["hanuman", "kavacha", "protection", "stotra", "defensive", "sanskrit"],
    summary:
      "Armour hymn to Hanuman for fear, nightmares, and hostile magic — from Rāmāyaṇa devotional corpus.",
    previewText:
      "Yatra yatra raghunātha kīrtanam… wherever Rāma's name is sung, Hanuman is present as shield…",
    fullText: `# Hanuman Kavacha (Protective Stotra)

${TRANSLATION_FOOTER}

## Opening (sample verse)
**Devanagari:** मनोजवं मारुततुल्यवेगं
**IAST:** manojavaṃ mārutatulyavegaṃ
**English:** "Swift as thought, swift as the wind…"

## Use (bhakti tradition)
Recite at dawn facing east after bath; 11 or 21 repetitions when fear or spiritual disturbance is present.

## Defensive scope
Not for directing harm — creates **kavacha** (armour) field in devotional literature.

## Source
*Hanuman Chalisa* / *Hanuman Kavacham* — Gita Press and sacred-texts collections`,
    source: {
      title: "Hanuman Kavacham",
      author: "Traditional / Gita Press",
      year: "Medieval–modern",
      institution: "Internet Sacred Text Archive",
      url: "https://archive.org/search?query=hanuman+kavacha",
    },
    isBaneful: false,
  },
  {
    id: "arc_in_agnihotra",
    title: "Agnihotra — Vedic Fire Offering (Simplified)",
    tradition: "Śrauta / Vedic",
    category: "indian",
    intentTags: ["agnihotra", "vedic fire", "homa", "ritual", "sunrise", "sunset"],
    summary:
      "Twice-daily minimal fire offering at sunrise/sunset — documented in Śatapatha Brāhmaṇa lineage.",
    previewText:
      "Prepare kuṇḍa, ghee, rice — offer to Agni at exact solar transition with SVĀHĀ…",
    fullText: `# Agnihotra (Introductory)

${TRANSLATION_FOOTER}

## Sanskrit
**Agnihotra** — oblation to Agni
**Svāhā** — "well offered" (uttered on each offering)

## Items
Copper or iron pyramid kuṇḍa, cow ghee, whole rice, dried cow dung (traditional fuel).

## Timing
Exactly at local sunrise and sunset (solar disc at horizon).

## Steps
1. Light fire; establish Agni mentally.
2. Offer two pinches rice with ghee, each with **svāhā**.
3. Meditate on solar/fire unity 5 minutes.
4. Close — never leave fire unattended.

## Note
Full Śrauta Agnihotra requires initiation; this is documented folk-simplified variant for study.

## Source
Śatapatha Brāhmaṇa; Agnihotra manuals — Internet Archive Vedic collection`,
    source: {
      title: "Satapatha Brahmana / Agnihotra manuals",
      author: "Traditional Vedic",
      year: "Ancient",
      institution: "Internet Archive",
      url: "https://archive.org/search?query=agnihotra+vedic",
    },
    isBaneful: false,
  },

  // ─── Chinese: meditation, qigong, daoist ───
  {
    id: "arc_cn_baduanjin",
    title: "Bāduànjǐn — Eight Brocades Qìgōng",
    tradition: "Taoist / Chinese Medicine",
    category: "chinese",
    intentTags: ["qigong", "baduanjin", "eight brocades", "relaxation", "meditation", "qi"],
    summary:
      "Eight classical qigong exercises — original Chinese names, Pinyin, and English with Mawangdui lineage notes.",
    previewText:
      "双手托天理三焦… Two Hands Hold Up the Heavens — regulates Triple Burner meridian…",
    fullText: `# Bāduànjǐn (八段锦) — Eight Brocades

${TRANSLATION_FOOTER}

## 1. 双手托天理三焦 (Shuāng shǒu tuō tiān lǐ sān jiāo)
**English:** Two Hands Hold Up the Heavens — regulates Triple Burner (sān jiāo).

## 2. 左右开弓似射雕 (Zuǒ yòu kāi gōng sì shè diāo)
**English:** Draw the Bow to Shoot the Eagle — opens lungs and heart meridians.

## (Full eight exercises in unlocked text)

## Practice
Each movement 6–8 repetitions; breathe naturally; morning practice facing east traditionally preferred.

## Relaxation
Documented in Traditional Chinese Medicine as balancing qi and calming shen (神).

## Source
Mawangdui silk texts lineage; *Ba Duan Jin* — China Health Qigong Association; Internet Archive`,
    source: {
      title: "Ba Duan Jin / Qigong classics",
      author: "Traditional / China Health Qigong",
      year: "Song–modern",
      institution: "Internet Archive",
      url: "https://archive.org/search?query=baduanjin+qigong",
    },
    isBaneful: false,
  },
  {
    id: "arc_cn_taoist_microcosmic",
    title: "Taoist Microcosmic Orbit — Xiǎo Zhōu Tiān",
    tradition: "Taoist Neidan",
    category: "chinese",
    intentTags: ["taoist", "microcosmic orbit", "neidan", "meditation", "dantian", "relaxation"],
    summary:
      "Inner circulation of qi through Du and Ren meridians — classical neidan instruction with Chinese terms.",
    previewText:
      "舌抵上腭 — tongue to palate bridges Ren and Du… breathe qi from lower dantian…",
    fullText: `# Xiǎo Zhōu Tiān (小周天) — Microcosmic Orbit

${TRANSLATION_FOOTER}

## Key terms
- **Dantian (丹田)** — elixir field (lower: below navel)
- **Du Mai (督脉)** — governing vessel (spine)
- **Ren Mai (任脉)** — conception vessel (front)
- **Tiān (周天)** — celestial orbit

## Method (simplified safe form)
1. **舌抵上腭** (shé dǐ shàng é) — tongue touches palate.
2. Sit, relax jaw; breathe into **lower dantian**.
3. On exhale, visualize warm qi rising up spine (Du Mai) to crown.
4. On inhale, qi descends front line (Ren Mai) to dantian.
5. 36 cycles maximum for beginners; stop if headache or heat excess.

## Warnings (Taoist texts)
Do not force breath retention without teacher; stop if dizziness or insomnia worsens.

## Source
*The Secret of the Golden Flower* (Richard Wilhelm trans.); Liu Yiming commentaries — archive.org`,
    source: {
      title: "The Secret of the Golden Flower",
      author: "Richard Wilhelm (trans.) / Liu Yiming",
      year: "17th c. / 1931 trans.",
      institution: "Internet Archive",
      url: "https://archive.org/search?query=secret+golden+flower",
    },
    isBaneful: false,
  },
  {
    id: "arc_cn_iching_yarrow",
    title: "I Ching (Yì Jīng) — Yarrow-Stalk Divination",
    tradition: "Zhou Yi / Chinese",
    category: "chinese",
    intentTags: ["i ching", "yijing", "divination", "yarrow", "zhou yi", "oracle"],
    summary:
      "Classical yarrow-stalk method for hexagram — original Chinese hexagram names with Legge/Wilhelm translation.",
    previewText:
      "Divide 49 stalks… build hexagram from bottom up — ䷀ Qian, ䷁ Kun…",
    fullText: `# Yì Jīng (易经) — Yarrow Method

${TRANSLATION_FOOTER}

## Original
**易经** — Classic of Changes

## Procedure (summary)
1. Start with 49 yarrow stalks (one set aside).
2. Ritual divisions produce four changing lines → one hexagram.
3. Consult **tuan** (彖) and **xiang** (象) commentary.

## Example hexagram
**䷊ Tài (泰)** — Peace / Prosperity
**Wilhelm:** "The small departs, the great approaches."

## English source
James Legge (1882) or Richard Wilhelm/Baynes (1950) — both public domain on sacred-texts.com

## Source
Zhou Yi — *Book of Changes* — Yale China collections; Internet Archive`,
    source: {
      title: "I Ching / Book of Changes",
      author: "James Legge or Richard Wilhelm (trans.)",
      year: "1882 / 1950",
      institution: "Internet Sacred Text Archive",
      url: "https://www.sacred-texts.com/ich/",
    },
    isBaneful: false,
  },
  {
    id: "arc_cn_zuo_wang",
    title: "Zuò Wàng — Sitting and Forgetting (Zhuangzi)",
    tradition: "Daoist Philosophy",
    category: "chinese",
    intentTags: ["zhuangzi", "zuo wang", "meditation", "daoist", "relaxation", "wu wei"],
    summary:
      "Classical Daoist meditation from Zhuangzi — 坐忘 (sitting and forgetting) with original Chinese and Watson translation.",
    previewText:
      "Yan Hui reports: I sit and forget — 堕肢体，黜聪明…",
    fullText: `# Zuò Wàng (坐忘) — Sitting and Forgetting

${TRANSLATION_FOOTER}

## Original (excerpt)
**坐忘** — zuò wàng
**堕肢体，黜聪明，离形去知，同于大通，此谓坐忘。**

## Transliteration
Duò zhītǐ, chù cōngmíng, lí xíng qù zhī, tóng yú dà tōng — cǐ wèi zuò wàng.

## English (Burton Watson)
"Drop your body, discard your intelligence, leave appearance and eliminate knowledge — become one with the Great Pervader. This is called sitting-and-forgetting."

## Practice (contemplative)
1. Sit without agenda 20–40 minutes.
2. Release body tension layer by layer.
3. When thoughts arise, neither follow nor suppress — let them forget themselves.

## Source
Zhuangzi, Chapter 6 — Watson trans.; Chinese Text Project`,
    source: {
      title: "Zhuangzi: Basic Writings",
      author: "Zhuangzi / Burton Watson (trans.)",
      year: "4th c. BCE / 1964",
      institution: "Chinese Text Project / Columbia",
      url: "https://ctext.org/zhuangzi",
    },
    isBaneful: false,
  },
  {
    id: "arc_cn_anapanasati",
    title: "Chinese Buddhist Ānāpānasmṛti — Breath Mindfulness",
    tradition: "Chinese Buddhism / Chan root",
    category: "chinese",
    intentTags: ["anapanasati", "buddhist", "meditation", "breath", "chan", "relaxation"],
    summary:
      "Mindfulness of breathing as transmitted in Chinese Āgama and Chan — Sanskrit terms with Chinese and English.",
    previewText:
      "随息观 — follow the breath at tīkṣṇa gate (nostril tip)… sixteen steps per Ānāpānasati Sutta…",
    fullText: `# Ānāpānasmṛti (安般守意)

${TRANSLATION_FOOTER}

## Sanskrit / Chinese
- **Ānāpānasmṛti** — mindfulness of breathing
- **安般守意** (ān bān shǒu yì) — "guarding the mind on the breath"

## Sixteen steps (Dīrgha Āgama summary)
1. Discerning long breath (长息)
2. Discerning short breath (短息)
3. Experiencing whole body (遍身)
… through to liberation (解脱)

## Relaxation posture
Half-lotus on cushion; hands in dhyāna mudrā; count 1–10 on exhalations if mind wanders.

## Source
*Ekottara Āgama* / *An Ban Shou Yi Jing* (安般守意经) — CBETA Buddhist corpus; Internet Archive`,
    source: {
      title: "An Ban Shou Yi Jing / Anapanasati Sutta",
      author: "Buddhist canon / CBETA",
      year: "Classical",
      institution: "CBETA / Internet Archive",
      url: "https://archive.org/search?query=anapanasati+chinese",
    },
    isBaneful: false,
  },
  {
    id: "arc_cn_fengshui_shield",
    title: "Fēngshuǐ — Protective Threshold Arrangement",
    tradition: "Chinese Folk / Daoist",
    category: "chinese",
    intentTags: ["feng shui", "protection", "home", "qi", "defensive", "folk magic"],
    summary:
      "Classical threshold protection using mirror, salt, and five-element colours — not for harming others.",
    previewText:
      "门前八卦镜， salt at corners, 青龙白虎 balance left/right of entry…",
    fullText: `# Fēngshuǐ Threshold Protection

${TRANSLATION_FOOTER}

## Terms
- **风水** fēng shuǐ — wind-water (geomantic harmony)
- **八卦镜** bā guà jìng — eight-trigram mirror (outward-facing only at entry)
- **青龙** qīng lóng — Green Dragon (left of door)
- **白虎** bái hǔ — White Tiger (right)

## Defensive arrangement
1. Clear clutter from entry (**气口** qì kǒu — mouth of qi).
2. Outward **bagua mirror** only if directly facing poison arrow (路冲 lù chōng).
3. Salt bowls in corners renewed monthly (absorb stale qi — folk practice).
4. Welcome mat colour matches resident's favourable element (from Bāzì study).

## Source
*Zang Shu* (葬书) tradition; Yang House Feng Shui manuals — Internet Archive`,
    source: {
      title: "Zang Shu / Feng Shui classics",
      author: "Guo Pu tradition",
      year: "Jin dynasty–modern",
      institution: "Internet Archive",
      url: "https://archive.org/search?query=feng+shui+classic",
    },
    isBaneful: false,
  },

  // ─── Japanese: zen, shinto, ki ───
  {
    id: "arc_jp_zazen",
    title: "Zazen — Seated Meditation (Dōgen)",
    tradition: "Sōtō Zen",
    category: "japanese",
    intentTags: ["zazen", "zen", "meditation", "dogen", "relaxation", "shikantaza"],
    summary:
      "Shikantaza (just sitting) from Dōgen's Fukanzazengi — Japanese, romanization, and Nishijima/Cross translation.",
    previewText:
      "只管打坐 — shikantaza… hands in cosmic mudra, eyes half-open, count breath optional…",
    fullText: `# Zazen (坐禅)

${TRANSLATION_FOOTER}

## Japanese
**只管打坐** — shikan taza ("nothing but precisely sitting")
**放却身心** — hōkyaku shinjin ("cast off body and mind")

## English (Dōgen, Fukanzazengi)
"Think not-thinking. How? By non-thinking. This is the essential art of zazen."

## Posture
- **Kekkafuza** (結跏趺坐) — full lotus or half
- **Hishiryo** (非思量) — non-thinking awareness

## Method
1. 5–40 minutes daily, same time preferred.
2. Eyes lowered 45°, hands **hōkaijō-in** (法界定印).
3. Breathe through nose naturally; do not manipulate breath.
4. On distraction, return to posture without judgment.

## Source
Dōgen, *Fukanzazengi* — Nishijima/Cross trans.; sacred-texts / Stanford Zazen manuals`,
    source: {
      title: "Fukanzazengi / Universal Recommendation for Zazen",
      author: "Dōgen / Nishijima & Cross (trans.)",
      year: "1233 / modern trans.",
      institution: "Soto Zen / Internet Archive",
      url: "https://archive.org/search?query=fukanzazengi",
    },
    isBaneful: false,
  },
  {
    id: "arc_jp_misogi",
    title: "Misogi — Shinto Water Purification",
    tradition: "Shintō",
    category: "japanese",
    intentTags: ["misogi", "shinto", "purification", "water", "cleansing", "harai"],
    summary:
      "Classical Shinto body purification under cold or running water — original terms and Engler translation notes.",
    previewText:
      "Harai-tamai kiyome-tamai… three pours over head with left hand, breath vow…",
    fullText: `# Misogi (禊)

${TRANSLATION_FOOTER}

## Japanese / Romaji
**禊** — misogi (purification by water)
**祓** — harai (exorcism of pollution **kegare** 穢れ)

## Verbal (norito style, simplified)
**Harai-tamae, kiyome-tamae** — "Sweep away, purify" (addressed to kami)

## Method (safe variant)
1. At running water (river, waterfall, or shower if no access).
2. Pour left-hand scoops over body: head, left side, right side (3× each).
3. Breathe out sharply (**fu**) with each pour.
4. Bow twice, clap twice, bow once (standard **nirei nihakushu ichirei** optional at shrine).

## Source
*Norito* collections; Ōmoto misogi tradition — Kojiki purification parallels; Internet Archive`,
    source: {
      title: "Norito / Shinto Purification Rites",
      author: "Traditional Shinto",
      year: "Classical–modern",
      institution: "Internet Archive / Kojiki",
      url: "https://archive.org/search?query=misogi+shinto",
    },
    isBaneful: false,
  },
  {
    id: "arc_jp_nembutsu",
    title: "Nembutsu — Amida Invocation (Pure Land)",
    tradition: "Japanese Buddhism",
    category: "japanese",
    intentTags: ["nembutsu", "amida", "pure land", "mantra", "meditation", "jodo"],
    summary:
      "Namu Amida Butsu — central Japanese Buddhist chant for calm and refuge; kanji, romaji, English.",
    previewText:
      "南無阿弥陀仏 — Namu Amida Butsu — single-minded recitation with breath…",
    fullText: `# Nembutsu (念仏)

${TRANSLATION_FOOTER}

## Original
**南無阿弥陀仏**
**Namu Amida Butsu** (Hepburn)
**English:** "Homage to Amida Buddha" / "I take refuge in Amida Buddha"

## Practice
1. Sit; synchronize chant with slow exhalation.
2. **Jūnen** (專念) — single-minded focus on Amida.
3. 10–30 minutes; mala of 108 optional.

## Relaxation
Documented in Jōdo Shinshū and Jōdo-shū as settling **anjin** (安心) — peaceful mind.

## Source
*Kyōgyōshinshō* (Shinran); Pure Land sutras — BDK English Tripitaka; Internet Archive`,
    source: {
      title: "Pure Land Sutras / Kyogyoshinsho",
      author: "Shinran / BDK trans.",
      year: "13th c. / modern",
      institution: "BDK America / Internet Archive",
      url: "https://archive.org/search?query=pure+land+sutra",
    },
    isBaneful: false,
  },
  {
    id: "arc_jp_chado",
    title: "Chadō — Tea Ceremony as Moving Meditation",
    tradition: "Japanese Zen Aesthetics",
    category: "japanese",
    intentTags: ["chado", "tea ceremony", "meditation", "zen", "relaxation", "wabi sabi"],
    summary:
      "Sen no Rikyū lineage tea as mindfulness — Japanese terms with Okakura and modern chadō manuals.",
    previewText:
      "一期一会 ichigo ichie… whisk matcha with single breath, bow to guest and void…",
    fullText: `# Chadō (茶道) — Way of Tea

${TRANSLATION_FOOTER}

## Terms
- **茶道** chadō / sadō — way of tea
- **一期一会** ichigo ichie — "this moment once only"
- **わび寂び** wabi-sabi — beauty in imperfection

## Meditative sequence (guest perspective)
1. Enter **nijiriguchi** (crawl entrance) — humility posture.
2. Observe **tokonoma** scroll — seasonal awareness.
3. Receive bowl with bow; rotate twice before drinking.
4. Slurp final sip (sign of appreciation).
5. Examine bowl; return with bow.

## Inner practice
Treat each gesture as complete universe — **ima** (今) now only.

## Source
Sen no Rikyū; *The Book of Tea* (Okakura Kakuzō, 1906, public domain)`,
    source: {
      title: "The Book of Tea",
      author: "Okakura Kakuzō",
      year: "1906",
      institution: "Internet Archive",
      url: "https://archive.org/details/bookoftea0000okak",
    },
    isBaneful: false,
  },
  {
    id: "arc_jp_ki_breath",
    title: "Ki Breathing — Tohei Kōichi Method",
    tradition: "Japanese Aikidō / Ki Society",
    category: "japanese",
    intentTags: ["ki", "breathing", "aikido", "tohei", "relaxation", "meditation"],
    summary:
      "Modern Japanese ki cultivation breath method — 気 breathing with original Japanese terminology.",
    previewText:
      "Extend ki through fingertips on exhale… 自然の息 — natural breath, unforced…",
    fullText: `# Ki Breathing (気の呼吸)

${TRANSLATION_FOOTER}

## Japanese
**気** — ki (life energy)
**自然の息** — shizen no iki (natural breath)
**一点集中** — itten shūchū (single-point concentration)

## Method (Tohei lineage)
1. Seiza or chair; spine floating upward mentally.
2. Inhale imagining ki entering through fingertips and crown.
3. Exhale imagining ki expanding outward infinitely — **not forced**.
4. 10–20 minutes; eyes soft closed.

## Relaxation use
Used in Japanese corporate and martial contexts for stress — documented in *Ki in Daily Life*.

## Source
Kōichi Tohei, *Ki in Daily Life*; Internet Archive Aikido ki manuals`,
    source: {
      title: "Ki in Daily Life",
      author: "Kōichi Tohei",
      year: "1978",
      institution: "Ki Society / Internet Archive",
      url: "https://archive.org/search?query=tohei+ki",
    },
    isBaneful: false,
  },
  {
    id: "arc_jp_ofuda",
    title: "Ofuda — Shinto Talisman Placement (Documentary)",
    tradition: "Shintō Folk",
    category: "japanese",
    intentTags: ["ofuda", "shinto", "talisman", "protection", "kami", "folk magic"],
    summary:
      "Proper receipt and placement of shrine **ofuda** — protective household magic, not baneful.",
    previewText:
      "Receive ofuda at New Year from shrine… place on **kamidana** facing east or south…",
    fullText: `# Ofuda (御札)

${TRANSLATION_FOOTER}

## Japanese
**御札** — ofuda (sacred paper talisman)
**神棚** — kamidana (home altar shelf)
**氏神** — ujigami (clan/local kami)

## Receipt
Obtain from licensed shrine at New Year or after **hatsumōde**; never purchase fakes from tourist stalls for spiritual use.

## Placement
1. **Kamidana** height above eye level; clean shelf below.
2. Ofuda stands upright in center; **sake**, **salt**, **water**, **rice** offerings daily or weekly.
3. Replace annually — old ofuda returned to shrine for burning (**otakiage** お焚き上げ).

## Source
Shrine priest manuals; *Shinto: The Kami Way* (Sokyo Ono); Jinja Honcho guidelines`,
    source: {
      title: "Shinto: The Kami Way",
      author: "Sokyo Ono",
      year: "1962",
      institution: "Internet Archive",
      url: "https://archive.org/search?query=shinto+kami+way",
    },
    isBaneful: false,
  },
];

export function mergeEastAsiaSeeds(base: Seed[]): Seed[] {
  const ids = new Set(base.map((e) => e.id));
  return [...base, ...EAST_ASIA_SEED_ENTRIES.filter((e) => !ids.has(e.id))];
}
