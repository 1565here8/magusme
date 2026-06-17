export interface OracleDeckDef {
  id: string;
  name: string;
  artist: string;
  year: string;
  cardCount: number;
  theme: string;
  description: string;
  styleId: "classic" | "dark" | "vintage" | "minimal" | "nature" | "celestial" | "ethereal";
  hasReversals: boolean;
  history: string;
}

export const ORACLE_DECKS: OracleDeckDef[] = [
  {
    id: "wisdom-of-the-oracle",
    name: "Wisdom of the Oracle",
    artist: "Colette Baron-Reid",
    year: "2014",
    cardCount: 52,
    theme: "Archetypal wisdom, mythology, symbolic guidance",
    description: "A 52-card deck blending tarot archetypes, I Ching wisdom, and Norse rune meanings into a universal oracle system. Each card carries a keyword, a message, and a symbolic image drawn from world mythology.",
    styleId: "classic",
    hasReversals: false,
    history: "Wisdom of the Oracle was Colette Baron-Reid's breakout deck, published by Hay House in 2014. Baron-Reid had spent the previous decade building a following as a psychic medium and spiritual teacher, releasing several earlier oracle decks including The Enchanted Map (2006) and The Universe Deck (2009). For Wisdom of the Oracle, she set out to create something more ambitious: a deck that drew equally from tarot archetypes, I Ching hexagrams, and Norse rune wisdom, unified under a single symbolic system. Each of the 52 cards corresponds to a rune, a hexagram, and a Major Arcana archetype, making it one of the most structurally complex oracle decks ever published. The deck was an instant bestseller and has been continuously in print since release. Artwork by Jena DellaGrottaglia, whose painterly style gives each card a luminous, mythic quality. The deck has been translated into over 15 languages and remains one of Hay House's top-selling oracle titles."
  },
  {
    id: "work-your-light",
    name: "Work Your Light Oracle",
    artist: "Rebecca Campbell",
    year: "2018",
    cardCount: 44,
    theme: "Soul purpose, inner guidance, spiritual awakening",
    description: "A 44-card deck divided into five suits: The Call, The Journey, The Companions, The Gifts, and The Dispensation. Guides the reader through listening to inner wisdom and stepping into soul-aligned purpose.",
    styleId: "ethereal",
    hasReversals: false,
    history: "Rebecca Campbell's second oracle deck following her debut Light Is the New Black (2016). Published by Hay House in 2018, Work Your Light Oracle was designed as a companion to Campbell's book of the same name. The deck is structured as a five-part journey: The Call (hearing your soul's invitation), The Journey (navigating the path), The Companions (guides and allies), The Gifts (what you offer the world), and The Dispensation (sharing your light). This narrative structure was innovative for oracle decks, which typically organize cards by theme rather than sequence. Artwork by Katie-Louise, whose ethereal watercolor style and use of light effects became the visual signature of Campbell's decks. The deck was particularly embraced by female entrepreneurs and creatives, with its emphasis on soul-aligned work striking a chord during the 2018-2020 conscious business movement."
  },
  {
    id: "moonology",
    name: "Moonology Oracle",
    artist: "Yasmin Boland",
    year: "2018",
    cardCount: 44,
    theme: "Lunar cycles, moon phases, celestial timing",
    description: "A 44-card deck corresponding to moon phases and astrological signs. Each card provides guidance aligned with lunar energy, from New Moon intentions to Full Moon releases.",
    styleId: "celestial",
    hasReversals: false,
    history: "Yasmin Boland, an astrologer and author from Australia, had already built a substantial following through her Moonology blog and podcast before approaching Hay House with a deck concept. The Moonology Oracle (2018) was her first deck and became one of Hay House's fastest-selling oracle releases. The deck organizes 44 cards into moon phases (New Moon, Waxing, Full Moon, Waning), moon signs (each of the 12 zodiac signs represented), and lunar aspects (specific astronomical configurations). Boland worked closely with illustrator Nyx to create cards that were astronomically accurate while remaining visually accessible. The deck popularized the concept of lunar living in the mainstream spirituality market, with Boland later releasing a Moonology book, planner, and year-long oracle set. The deck has sold over 500,000 copies internationally."
  },
  {
    id: "starseed-oracle",
    name: "The Starseed Oracle",
    artist: "Rebecca Campbell",
    year: "2020",
    cardCount: 53,
    theme: "Cosmic origins, soul gifts, starseed wisdom",
    description: "A 53-card deck for connecting with cosmic origins and remembering who you truly are. Cards carry activations and transmissions for awakening starseed gifts.",
    styleId: "celestial",
    hasReversals: false,
    history: "Rebecca Campbell's third oracle deck, published in 2020 by Hay House. The Starseed Oracle emerged from Campbell's growing interest in astrology, cosmic mythology, and the starseed movement a New Age concept that some souls incarnated from other star systems to assist Earth during a time of transformation. The deck includes 50 starseed cards plus 3 Gateway cards for opening and closing readings. Each card corresponds to a specific star system or cosmic archetype: Sirius, Pleiades, Arcturus, Andromeda, Orion, Lyra, and others. Artwork by Danielle Noel, whose luminous cosmic style had already gained a following through her own Starchild Tarot. The deck was notable for its gender-neutral language and inclusive imagery, reflecting the 2020 zeitgeist of spiritual decentralization."
  },
  {
    id: "sacred-rebels",
    name: "Sacred Rebels Oracle",
    artist: "Alana Fairchild",
    year: "2015",
    cardCount: 44,
    theme: "Authenticity, freedom, inner rebellion, soul sovereignty",
    description: "A 44-card deck celebrating the free spirit within. Each card calls the reader to trust inner knowing, break free from societal constraints, and live authentically.",
    styleId: "dark",
    hasReversals: false,
    history: "Alana Fairchild, an Australian spiritual teacher with a background in psychology and Jungian analysis, created Sacred Rebels Oracle for Blue Angel Publishing in 2015. Fairchild's decks are distinguished by their psychological depth and willingness to engage with shadow material where other oracle decks offer only comfort, her cards often challenge and provoke. Sacred Rebels calls the reader to question authority, break rules, and trust inner knowing over external validation. The deck's artwork by Mario Duguay features solitary figures in wild landscapes, emphasizing the individual's relationship with the natural world and the divine. Fairchild's Rumi Oracle (2017) and Kuan Yin Oracle (2018) followed. Sacred Rebels developed a devoted cult following and is frequently cited as the deck that oracle readers turn to when they need honest guidance rather than gentle reassurance."
  },
  {
    id: "wisdom-of-the-ancestors",
    name: "Wisdom of the Ancestors Oracle",
    artist: "Colette Baron-Reid",
    year: "2021",
    cardCount: 52,
    theme: "Ancestral healing, lineage wisdom, tribal guidance",
    description: "A 52-card deck drawing on the wisdom of ancestral traditions from around the world. Each card carries a message from the ancestors, offering guidance for healing family patterns.",
    styleId: "vintage",
    hasReversals: false,
    history: "Colette Baron-Reid's eighth oracle deck with Hay House, released in 2021 during the global ancestral healing movement. Wisdom of the Ancestors Oracle was directly influenced by the growing interest in generational trauma healing and lineage reconnection that accelerated during the COVID-19 pandemic. Each card features an ancestral archetype: The Storyteller, The Healer, The Warrior, The Gatherer, The Elder, The Seer. Baron-Reid drew on her own mixed ancestry (Irish, Ojibwe, and French-Canadian) to create a deck that honors multiple traditions without appropriating closed cultural practices. The artwork by Jena DellaGrottaglia uses a sepia-toned, vintage palette distinct from the luminous color scheme of Wisdom of the Oracle, giving the deck an antique, memory-like quality. The deck includes a substantial guidebook with journaling prompts for ancestral connection practices."
  },
  {
    id: "keepers-of-the-light",
    name: "Keepers of the Light Oracle",
    artist: "Kyle Gray",
    year: "2016",
    cardCount: 45,
    theme: "Ascended masters, spiritual deities, angelic guidance",
    description: "A 45-card deck featuring ascended masters, spiritual deities, and higher beings from multiple traditions. Each card channels the wisdom of a specific keeper of light.",
    styleId: "ethereal",
    hasReversals: false,
    history: "Kyle Gray, who began his professional career as a psychic medium at age 17 in Scotland, published Keepers of the Light Oracle with Hay House in 2016. Gray was one of the youngest authors ever published by Hay House and brought a fresh, less gendered perspective to angel and ascended-master card decks. The deck features 45 beings from multiple spiritual traditions: Jesus, Buddha, Quan Yin, Archangel Michael, White Buffalo Calf Woman, Mother Mary, and others. Gray was careful to present each being within its original cultural context while making their wisdom accessible to a general audience. The artwork by Lily Moses uses gold-influenced color schemes and multicultural iconography. The deck was notable for including less commonly featured beings like Green Tara, Grandmother Spider, and Sanat Kumara, broadening the pantheon beyond the standard angel deck canon."
  },
  {
    id: "angel-answers",
    name: "Angel Answers Oracle",
    artist: "Radleigh Valentine",
    year: "2019",
    cardCount: 44,
    theme: "Angel messages, direct guidance, yes-no answers",
    description: "A 44-card deck designed for clear, direct answers from the angelic realm. Cards include Yes, Not Yet, Take Action, Let Go, and other straightforward responses.",
    styleId: "ethereal",
    hasReversals: false,
    history: "Radleigh Valentine, a former Hay House executive and longtime collaborator with Doreen Virtue (he co-authored several of her books including Angel Therapy and How to Hear Your Angels), released the Angel Answers Oracle in 2019 after Virtue's departure from the angel card genre. Valentine's deck innovated on the angel card formula by including direct answer cards: Yes, No, Not Yet, Take Action, Let Go, Trust, and similar unambiguous responses. This yes-no format was a significant departure from the more interpretive style of Virtue's decks. The deck pairs each answer card with a supporting guidance card for additional context. Artwork by Sofia Salazar, who rendered angels in a style that balanced traditional iconography with modern diversity in skin tone, age, and gender presentation."
  },
  {
    id: "crystal-spirits",
    name: "Crystal Spirits Oracle",
    artist: "Colette Baron-Reid",
    year: "2017",
    cardCount: 58,
    theme: "Crystal energies, stone wisdom, earth magic",
    description: "A 58-card deck connecting oracle guidance to the energy of specific crystals. Each card pairs a crystal with a life lesson and spiritual teaching.",
    styleId: "nature",
    hasReversals: false,
    history: "The third deck in Colette Baron-Reid's oracle series with Hay House, Crystal Spirits Oracle (2017) was released at the peak of the crystal spirituality boom. At 58 cards, it was the largest oracle deck Baron-Reid had created at that point. Each card features a specific crystal paired with a spiritual archetype: Amethyst paired with The Seer, Rose Quartz with The Lover, Citrine with The Alchemist, and so on. The deck draws on traditional crystal lore while overlaying Baron-Reid's archetypal system. Baron-Reid worked with crystal expert and author Hibiscus Moon to ensure the metaphysical properties of each stone were accurately represented. Artwork by Jena DellaGrottaglia, who photographed actual crystal specimens and painted them into visionary landscapes, giving the deck a uniquely grounded yet mystical visual quality."
  },
  {
    id: "spirit-animal-oracle",
    name: "The Spirit Animal Oracle",
    artist: "Colette Baron-Reid",
    year: "2019",
    cardCount: 50,
    theme: "Animal spirits, totem animals, nature guidance",
    description: "A 50-card deck channeling the wisdom of the animal kingdom. Each card carries the medicine of a specific spirit animal with messages for guidance and protection.",
    styleId: "nature",
    hasReversals: false,
    history: "Colette Baron-Reid's fourth major oracle deck with Hay House, released in 2019. The Spirit Animal Oracle draws on the tradition of animal spirit guides and totem animals found in indigenous cultures worldwide, though Baron-Reid was careful to frame the deck as nature-based archetypal wisdom rather than claiming indigenous authenticity. Each of the 50 cards features an animal with its associated medicine: Bear (courage, strength), Wolf (loyalty, intuition), Owl (wisdom, vision), Deer (gentleness, grace), and so on. Baron-Reid included less commonly featured animals such as the Pangolin, the Axolotl, and the Numbat alongside more traditional spirit animals. Artwork by Angela Rizza, whose naturalist illustration style gives each animal anatomical accuracy while still conveying symbolic meaning. The deck was praised by animal communicators and nature spirituality practitioners for its respectful treatment of animal wisdom."
  },
  {
    id: "wild-unknown-animal",
    name: "The Wild Unknown Animal Spirit Deck",
    artist: "Kim Krans",
    year: "2015",
    cardCount: 63,
    theme: "Animal archetypes, shadow work, wild wisdom",
    description: "A 63-card deck exploring the animal kingdom as spiritual archetypes. Each card features hauntingly beautiful hand-drawn imagery of animals, birds, insects, and sea creatures.",
    styleId: "dark",
    hasReversals: false,
    history: "Kim Krans, an artist and illustrator based in upstate New York, had already achieved cult status with her Wild Unknown Tarot (2014), which became one of the best-selling tarot decks of the 2010s through grassroots word-of-mouth and Instagram virality. The Wild Unknown Animal Spirit Deck (2015, HarperElixir) was her second deck, expanding her monochrome, hand-drawn visual language into the animal kingdom. The deck contains 63 cards organized into five suits: Land Animals, Water Animals, Winged Ones, Insect Realm, and Reptiles and Amphibians. Krans drew each animal by hand in her distinctive black-and-white style with occasional accent colors, rejecting the full-color convention of virtually every commercial oracle deck. The deck's refusal to offer simple positive affirmations, instead presenting animals as complex, sometimes challenging archetypes, distinguished it from the Hay House oracle tradition and appealed to a more art-focused audience."
  },
  {
    id: "wild-unknown-archetypes",
    name: "The Wild Unknown Archetypes Deck",
    artist: "Kim Krans",
    year: "2019",
    cardCount: 63,
    theme: "Archetypal patterns, shadow work, collective unconscious",
    description: "A 63-card deck of archetypal energies including the Magician, the Seeker, the Healer, the Shapeshifter, and more. Each card is a portal into the collective unconscious.",
    styleId: "dark",
    hasReversals: false,
    history: "Kim Krans's third deck, published by HarperOne in 2019, completing her Wild Unknown trilogy alongside the Tarot (2014) and Animal Spirit (2015) decks. The Archetypes deck moves from the collective symbolism of tarot and the natural symbolism of animals into the personal territory of Jungian archetypes. Each of the 63 cards represents a pattern of behavior or energy: The Magician, The Rebel, The Shapeshifter, The Healer, The Destroyer, The Victim, The Addict. Krans was transparent about her Jungian influences, citing Carl Jung, Joseph Campbell, and Caroline Myss as reference points. The deck was notably darker and more psychologically challenging than either of its predecessors, with cards like The Shadow, The Martyr, and The Betrayer offering no comfortable interpretation. The deck's release was accompanied by an Archetypes book and online course, making it Krans's most ambitious project. The deck is used by therapists and coaches as well as oracle readers."
  },
  {
    id: "divine-feminine-oracle",
    name: "The Divine Feminine Oracle",
    artist: "Meggan Watterson",
    year: "2020",
    cardCount: 52,
    theme: "Goddess wisdom, feminine archetypes, sacred feminine",
    description: "A 52-card deck of goddess archetypes from world mythology. Each card carries the voice of a different aspect of the divine feminine, from Kali to Kuan Yin to Mary Magdalene.",
    styleId: "classic",
    hasReversals: false,
    history: "Meggan Watterson, a Harvard-trained theologian and author of Mary Magdalene Revealed (2019), created The Divine Feminine Oracle with Sounds True in 2020. Watterson's academic background distinguished this deck from other goddess decks: each card was researched from original source texts and historical scholarship rather than aggregated from popular New Age goddess mythology. The deck includes 52 goddesses from traditions including Hinduism (Kali, Lakshmi, Saraswati), Buddhism (Tara, Kuan Yin), Christianity (Mary Magdalene, Sophia), Greek mythology (Persephone, Athena, Aphrodite), Norse mythology (Frigg, Freyja), Egyptian mythology (Isis, Hathor), Celtic mythology (Brigid, Morrigan), and indigenous traditions (White Buffalo Calf Woman, Sedna). Artwork by Lisbeth Cheever-Gessaman, whose mixed-media collages incorporate sacred geometry, floral elements, and diverse cultural iconography. The deck was published during the peak of the sacred feminine movement in 2020 and was praised for its scholarly rigor."
  },
  {
    id: "universe-has-your-back",
    name: "The Universe Has Your Back",
    artist: "Gabrielle Bernstein",
    year: "2017",
    cardCount: 52,
    theme: "Affirmations, trust, spiritual surrender, divine timing",
    description: "A 52-card deck of affirmation-style cards with simple, direct messages. Each card delivers a clear spiritual principle without requiring complex interpretation.",
    styleId: "minimal",
    hasReversals: false,
    history: "Gabrielle Bernstein, a New York Times bestselling author and motivational speaker, released her first oracle deck The Universe Has Your Back in 2017 as a companion to her book of the same name. Bernstein, who rose to prominence through her accessible approach to A Course in Miracles, designed the deck to be the simplest possible oracle experience: each card carries a single affirmation or principle printed in clear text, with an expanded message in the accompanying guidebook. The deck deliberately rejects esoteric imagery in favor of abstract watercolor backgrounds and typography. This minimalist approach was polarizing: traditional oracle readers found it too simple, while newcomers to divination found it perfectly accessible. Bernstein's massive social media following (over 1 million Instagram followers) drove the deck to bestseller status. The deck's success proved that the oracle market could support decks outside the angel/animal/nature tradition."
  },
  {
    id: "rose-oracle",
    name: "The Rose Oracle",
    artist: "Rebecca Campbell",
    year: "2022",
    cardCount: 44,
    theme: "Heart wisdom, self-love, emotional healing",
    description: "A 44-card deck for connecting with the wisdom of the heart. Each card carries a message of love, healing, and the courage to open your heart again.",
    styleId: "classic",
    hasReversals: false,
    history: "Rebecca Campbell's fourth oracle deck with Hay House, released in 2022. The Rose Oracle marked a departure from Campbell's earlier cosmic and light-centric decks into a more grounded, heart-centered territory. The deck uses the rose as a central symbol across all 44 cards, exploring different aspects of heart wisdom: The Open Rose, The Thorn, The Bud, The Wild Rose, The Rose Cross. Campbell cited the medieval rose symbolism of Hildegard of Bingen and the Sufi rose poetry of Rumi as influences alongside her own experience of heartbreak and healing. The deck is more emotionally vulnerable than Campbell's previous work, with cards directly addressing grief, betrayal, and the courage required to love again. Artwork by Danielle Noel, who shifted from her signature cosmic style into a softer, more botanical aesthetic with rose motifs woven throughout each card."
  },
  {
    id: "healing-with-the-angels",
    name: "Healing with the Angels",
    artist: "Doreen Virtue",
    year: "1999",
    cardCount: 44,
    theme: "Angel therapy, divine guidance, gentle healing",
    description: "The original oracle deck that launched the modern oracle card movement. A 44-card deck of angelic messages for healing, comfort, and spiritual guidance.",
    styleId: "ethereal",
    hasReversals: false,
    history: "Healing with the Angels is the deck that created the modern oracle card category. Published by Hay House in 1999, it was the first mass-market deck designed specifically for divination that was not tarot, Lenormand, or playing cards. Doreen Virtue, a former psychotherapist who had transitioned into angel therapy, created the deck after students asked for a card tool that felt safer and more positive than tarot. The deck's format 44 cards with simple English messages printed on each card, guided by a companion book established the template that hundreds of subsequent oracle decks would follow: large cards, single-sentence titles, positive framing, and accessible guidebook language. Hay House initially printed 5,000 copies and quickly sold out. By 2005, the deck had sold over 200,000 copies. Virtue would go on to publish over 20 oracle decks before her controversial 2017 departure from the angel card genre. Healing with the Angels remains in print and is recognized as the foundational text of the oracle card movement."
  },
  {
    id: "archangel-oracle",
    name: "Archangel Oracle",
    artist: "Doreen Virtue",
    year: "2004",
    cardCount: 45,
    theme: "Archangel guidance, divine protection, spiritual support",
    description: "A 45-card deck connecting the reader with the 15 primary archangels. Each archangel has three cards carrying specific messages for different life situations.",
    styleId: "ethereal",
    hasReversals: false,
    history: "Doreen Virtue's second major oracle deck, published by Hay House in 2004, following the massive success of Healing with the Angels (1999). Archangel Oracle was more structurally ambitious than its predecessor, organizing 45 cards into 15 sets of three, each set dedicated to a specific archangel: Michael, Gabriel, Raphael, Uriel, Chamuel, Zadkiel, Jophiel, Metatron, Sandalphon, Ariel, Azrael, Haniel, Jeremiel, Raguel, and Raziel. The three cards for each archangel cover past, present, and future guidance. This tripartite structure gave the deck more depth than the single-message format of Healing with the Angels. Virtue researched archangel lore from Jewish, Christian, and Islamic sources, though she freely adapted traditional material for contemporary spiritual use. Artwork by Marius Michael-George, whose photorealistic style rendered angels in a classical Renaissance-inspired aesthetic. The deck was Virtue's personal favorite among her creations, and it remains one of the best-selling angel decks ever published."
  },
  {
    id: "rumi-oracle",
    name: "Rumi Oracle",
    artist: "Alana Fairchild",
    year: "2017",
    cardCount: 44,
    theme: "Sufi mysticism, poetic wisdom, divine love",
    description: "A 44-card deck inspired by the poetry of Rumi. Each card carries a verse and a message for the soul, blending Sufi mysticism with universal spiritual guidance.",
    styleId: "vintage",
    hasReversals: false,
    history: "Alana Fairchild's third oracle deck with Blue Angel Publishing, released in 2017. The Rumi Oracle was a risk: Rumi's 13th-century Persian poetry is beloved worldwide but adapting it into an oracle format could have felt gimmick or reductive. Fairchild, working with scholar and Rumi translator Haleh Pourafzal, selected specific verses that could function as oracular messages while preserving their poetic and spiritual integrity. Each card pairs a Rumi verse with Fairchild's contemporary interpretation, creating a bridge between 13th-century Sufi mysticism and 21st-century spiritual guidance. The deck includes 44 cards organized by theme: The Beloved, The Tavern, The Reed, The Wound, The Ocean. Artwork by Mario Duguay, whose painterly style renders Rumi's ecstatic and longing-filled imagery in rich colors. The deck was criticized by some Rumi scholars for decontextualizing the poetry from its Islamic framework, but defended by others for making Rumi's wisdom accessible."
  },
  {
    id: "sacred-self-care",
    name: "The Sacred Self-Care Oracle",
    artist: "Jill Pyle",
    year: "2021",
    cardCount: 52,
    theme: "Self-care, inner healing, rest, boundary setting",
    description: "A 52-card deck devoted to the sacred art of self-care. Cards carry messages about rest, boundaries, healing, and honoring your own needs as spiritual practice.",
    styleId: "minimal",
    hasReversals: false,
    history: "Jill Pyle, a first-time deck author and illustrator based in Arizona, created The Sacred Self-Care Oracle during the COVID-19 pandemic. Pyle, who had built a following as @pixieduststudio on Instagram with her ethereal watercolor paintings of women in nature, was approached by Hay House after they discovered her work online. The deck, published in 2021, was perfectly timed for the pandemic-era emphasis on mental health and burnout recovery. Each card carries a self-care directive: Rest, Set a Boundary, Say No, Ask for Help, Take a Bath, Go Outside, Call a Friend. Pyle illustrated all 52 cards herself, making her one of the few oracle deck creators who is also the sole artist. Her consistent visual style of solitary women in natural settings gives the deck a cohesive, meditative quality. The deck was Hay House's first to directly address the intersection of spirituality and mental health, and it was praised by therapists and spiritual teachers alike."
  },
  {
    id: "enchanted-map",
    name: "The Enchanted Map Oracle",
    artist: "Colette Baron-Reid",
    year: "2015",
    cardCount: 52,
    theme: "Life journey, destiny, crossroads, soul navigation",
    description: "A 52-card deck that maps the terrain of your life's journey. Cards represent places on the inner landscape: the Bridge, the Crossroads, the Oasis, the Mountain Pass.",
    styleId: "classic",
    hasReversals: false,
    history: "The Enchanted Map was Colette Baron-Reid's first major oracle deck, initially self-published in 2006 before being acquired and re-released by Hay House in 2015. The original 2006 edition was one of the earliest post-Virtue oracle decks to establish an independent creative voice in the genre. Baron-Reid conceived the deck as a map of the soul's journey, with each card representing a location on an inner landscape: The Bridge (transition), The Oasis (restoration), The Mountain Pass (challenge), The Swamp (confusion), The Lighthouse (guidance), The Crossroads (choice). This geographical metaphor was innovative because it gave the reader a spatial framework for understanding their life situation: where are you on the map? The 2015 Hay House edition featured updated artwork by Jena DellaGrottaglia, expanded guidebook content, and a card stock upgrade. The deck's success led directly to Hay House commissioning Baron-Reid's subsequent decks."
  },
  {
    id: "ancient-stones",
    name: "Ancient Stones Oracle",
    artist: "Rebecca Campbell",
    year: "2023",
    cardCount: 44,
    theme: "Earth wisdom, stone medicine, grounding",
    description: "A 44-card deck channeling the wisdom of ancient standing stones and megaliths. Each card connects the reader with earth energies and ancestral memory.",
    styleId: "nature",
    hasReversals: false,
    history: "Rebecca Campbell's fifth oracle deck with Hay House, released in 2023. Ancient Stones Oracle was inspired by Campbell's travels to megalithic sites across the British Isles: Stonehenge, Avebury, Callanish, Newgrange, and the Rollright Stones. Each card is named after a specific stone, megalith, or earth feature: The Standing Stone, The Circle, The Dolmen, The Cairn, The Ley Line, The Well. Campbell worked with archaeologist and pagan studies scholar Ronald Hutton as a consultant to ensure the deck's references to ancient sites were historically grounded rather than purely romanticized. The deck is the most grounded of Campbell's five Hay House decks, emphasizing physicality, place, and embodiment over her usual cosmic themes. Artwork by Soraia Yoshida, whose earthy color palette of greys, greens, and ochres and textured painting style evokes stone, soil, and lichen. The deck resonated particularly with readers in the UK and Ireland."
  },
  {
    id: "light-seer-oracle",
    name: "Light Seer's Oracle",
    artist: "Chris-Anne",
    year: "2022",
    cardCount: 55,
    theme: "Shadow work, light and dark integration, self-discovery",
    description: "A 55-card deck exploring the dance between light and shadow. Each card offers both a light and shadow interpretation, encouraging complete self-acceptance.",
    styleId: "classic",
    hasReversals: true,
    history: "Chris-Anne, a South African artist and author based in New Zealand, created the Light Seer's Oracle as her second major deck following the Light Seer's Tarot (2019). The Light Seer's Tarot had become a viral sensation on Instagram and TikTok, praised for its diverse, modern, and emotionally honest take on tarot imagery. The oracle deck (2022, Hay House) extends the same visual and philosophical language into oracle territory. The deck is structurally distinctive: each of the 55 cards includes both a light interpretation and a shadow interpretation, formalizing the Jungian concept of shadow work into a card-reading framework. Chris-Anne's artwork is her own, featuring digitally painted portraits of racially diverse figures in contemporary clothing, with luminous color palettes and expressive faces. The deck was groundbreaking for an oracle deck in its explicit invitation to explore shadow material, inspiring a wave of shadow-work focused oracle decks from other creators."
  },
];

export function getOracleDeck(id: string): OracleDeckDef | undefined {
  return ORACLE_DECKS.find(d => d.id === id);
}

export function getOracleDecks(): OracleDeckDef[] {
  return ORACLE_DECKS;
}
