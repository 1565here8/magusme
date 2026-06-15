export interface TarotHistorySection {
  title: string;
  paragraphs: string[];
}

export interface TarotFact {
  fact: string;
  source?: string;
}

export interface TarotHistoryEntry {
  section: TarotHistorySection;
}

export const TAROT_ORIGINS: TarotHistorySection[] = [
  {
    title: "The Birth of Tarot in Renaissance Italy (c. 1440)",
    paragraphs: [
      "Tarot was not invented by mystics or occultists — it was invented by Italian aristocrats as a card game. The earliest known tarot decks were created in the 1440s for the Visconti-Sforza family in Milan. These hand-painted decks, called carte da trionfi (\"cards of triumphs\"), added a fifth suit of 22 allegorical trumps to the standard 56-card Latin-suited deck. The trumps depicted classical and Christian virtues: The Fool, The Empress, The Emperor, The Pope, The Lovers, The Chariot, Death, The Devil, and others. The game was a sophisticated form of trick-taking called tarocchi, popular among the nobility of northern Italy.",
      "The oldest surviving tarot decks are the Visconti-Sforza decks (c. 1440–1470), of which about 15 partial decks exist today. The most famous is the Pierpont Morgan Bergamo deck, held at the Morgan Library in New York. These decks had no occult symbolism — they were luxury objects decorated with Renaissance allegorical art, similar to the illuminated manuscripts of the period. The cards were not used for divination. They were for playing a game that required strategy, memory, and luck.",
      "As printing technology spread, tarot decks became cheaper and more widely available. By the 1500s, the game had spread from Italy into France, Switzerland, Germany, and Belgium. Each region developed its own suit system (Italian, Spanish, German, or French) and its own trump order and imagery. The French suits — Clubs, Spades, Hearts, Diamonds — eventually became the standard for most of Europe."
    ]
  },
  {
    title: "The Marseille Tarot (1700s–1800s)",
    paragraphs: [
      "By the 18th century, the city of Marseille had become the center of tarot card production in Europe. The Tarot de Marseille — printed from woodblocks and hand-colored using stencils — became the standard design across France and much of Europe. Unlike the individualized Visconti-Sforza decks, Marseille decks followed a consistent iconographic formula: bold lines, primary colors, and simplified but powerful images. The Marseille tradition preserved the original structure: 22 Major Arcana (numbered I–XXI with The Fool unnumbered), 16 court cards (King, Queen, Knight, Page in four suits), and 40 pip cards (Ace through 10 in four suits). The Marseille deck is still in production today and is considered the root of all Western tarot traditions.",
      "At this point, tarot was still primarily a game. The first known connection between tarot and divination appears in a 1750 essay by Antoine Court de Gébelin, a French clergyman and Freemason. In his multivolume work Le Monde Primitif, de Gébelin claimed that tarot was the surviving book of the Egyptian god Thoth — a repository of ancient wisdom encoded in symbols. He argued (without evidence) that \"Tarot\" derived from the Egyptian words tar (\"path\" or \"road\") and ro (\"royal\"). This Egyptomania theory was completely wrong historically, but it was enormously influential — it launched the occult tarot tradition that continues to this day."
    ]
  },
  {
    title: "Etteilla — The First Professional Tarot Reader (1738–1791)",
    paragraphs: [
      "Jean-Baptiste Alliette, who wrote under the pseudonym \"Etteilla\" (his surname spelled backward), was a Parisian fortune-teller who created the first dedicated divinatory tarot deck. In 1783–1785, he published a deck and accompanying book that assigned specific meanings to each card for upright and reversed positions. Etteilla's deck rearranged the cards completely — he changed the order of the trumps, introduced Egyptian-themed imagery, and replaced the traditional court cards with esoteric titles. His system was complex, blending astrology, alchemy, numerology, and the four elements. Etteilla was the first person to make a living exclusively as a tarot reader, and he established many of the divinatory meanings that later traditions would adopt or adapt."
    ]
  },
  {
    title: "The Occult Revival: Eliphas Lévi, The Golden Dawn, and the Hermetic Tarot (1850–1900)",
    paragraphs: [
      "The 19th century saw an explosion of interest in the occult across Europe. The French magician Eliphas Lévi (1810–1875) was the first to systematically connect tarot to Kabbalah, astrology, and alchemy. In his books Dogme et Rituel de la Haute Magie (1854–1856), Lévi argued that the 22 Major Arcana corresponded to the 22 paths on the Kabbalistic Tree of Life — a framework that became the foundation of almost all subsequent esoteric tarot. Lévi also created the famous \"Baphomet\" illustration and was the first to describe the pentagram and hexagram in their modern ritual contexts.",
      "The Hermetic Order of the Golden Dawn (founded 1888) was the most influential occult society in modern Western history. Its members developed a comprehensive system of tarot correspondences that assigned each card to specific Hebrew letters, astrological signs, planetary rulers, and elemental associations. The Golden Dawn's system was codified in unpublished documents known as the Cipher Manuscripts. Key members included S. L. MacGregor Mathers, William Butler Yeats, Arthur Edward Waite, and (briefly) Aleister Crowley. The Golden Dawn synthesized Lévi's Kabbalistic approach with astrology, alchemy, numerology, and geomancy into a unified magical system.",
      "In 1889, Oswald Wirth published the first tarot deck explicitly designed for occult study — the Tarot of the Magi. Wirth was a student of the French occultist Stanislas de Guaita. His deck followed Lévi's framework and became the model for later esoteric decks. The Wirth deck established the convention of assigning astrological correspondences to the trumps and adding Kabbalistic symbols to the card designs."
    ]
  },
  {
    title: "The Rider-Waite-Smith Tarot (1909–1910)",
    paragraphs: [
      "The most famous tarot deck in history was created by Arthur Edward Waite (a Golden Dawn member) and drawn by Pamela Colman Smith, a gifted artist and fellow Golden Dawn initiate. Published by the Rider Company in London in 1909 (with a companion book in 1910), the Rider-Waite-Smith (RWS) deck revolutionized tarot by illustrating the pip cards (Ace through 10 in each suit) with full narrative scenes. Earlier decks — including Marseille — showed pips as abstract arrangements of suit symbols (e.g., five cups arranged in a pattern). The RWS deck turned every card into a picture with a story. This made the deck instantly accessible to non-occultists and transformed tarot from a secret society tool into a popular divination method.",
      "Pamela Colman Smith was a remarkable figure: a Jamaican-born American artist who worked with the Lyceum Theatre in London and was a protégé of Bram Stoker. She was also a stage designer, a children's book author, and a collector of Jamaican folklore. Waite paid her a flat fee of £1 per card — approximately £130 per card in today's money — and she received no royalties. She died penniless in 1951. Today, her deck is the best-selling tarot deck of all time, and she is finally receiving recognition as the artist who defined the visual language of tarot for the 20th and 21st centuries. A 2019 campaign raised funds to install a memorial plaque for her at her final residence in Cornwall.",
      "The RWS deck introduced the standard meanings that most modern tarot readers use: The Fool as new beginnings, The Magician as manifestation, The High Priestess as intuition, Death as transformation, etc. These meanings were largely Waite's synthesis of Golden Dawn teachings, filtered through his Christian mystical perspective. Waite omitted the more overtly sexual and alchemical imagery of the Golden Dawn system, making the deck more palatable to Edwardian sensibilities. Many of his card interpretations were deliberately obtuse — Waite was both an esotericist and a showman who enjoyed keeping secrets and hiding meanings within his texts."
    ]
  },
  {
    title: "The Thoth Tarot (1938–1969)",
    paragraphs: [
      "Aleister Crowley, the most infamous occultist of the 20th century, created the Thoth Tarot in collaboration with Lady Frieda Harris, a British artist and socialite. Crowley began the project in 1938 and completed the text in 1944 (published as The Book of Thoth), but the painted deck was not published until 1969, 22 years after Crowley's death. The Thoth deck is a dense synthesis of Crowley's occult philosophy: Thelema, Egyptian mythology, alchemy, astrology, Kabbalah, tantra, and numerology. Every card is packed with symbols from multiple traditions.",
      "Lady Frieda Harris spent five years painting the 78 cards, often working 12-hour days. She was 60 years old when she started. She described the project as \"the most exhausting and exhilarating thing I have ever done.\" The paintings are masterpieces of modernist art — blending Surrealism, Cubism, and Art Deco with occult symbolism. Harris's use of color was particularly innovative: she developed a personal system of color correspondences based on the Golden Dawn's system but extended and personalized. Crowley wrote that the deck \"would remain a secret for 100 years\" after publication, but it became one of the three most popular tarot traditions (alongside RWS and Marseille) within a few decades.",
      "The Thoth deck differs significantly from RWS in several ways: it renamed many cards (Strength became Lust, Justice became Adjustment, The World became The Universe), changed the order of Justice (VIII in RWS, XI in Thoth) and Strength (XI in RWS, VIII in Thoth) to match the Kabbalistic order, and replaced some court cards with titles like Knight, Queen, Prince, and Princess. The pip cards are fully illustrated but in a more abstract, symbolic style than RWS. Crowley's interpretations merge the Golden Dawn system with his own Thelemic philosophy, making the Thoth deck both richer and more challenging for beginners."
    ]
  },
  {
    title: "Tarot in the 20th Century: Pop Culture and the Bohemian Boom",
    paragraphs: [
      "Tarot entered mainstream American consciousness in the mid-20th century through several channels. The counterculture movement of the 1960s and 70s embraced tarot as a tool for self-exploration and spiritual rebellion. The publication of Eden Gray's Mastering the Tarot (1970) and A. E. Waite's Pictorial Key to the Tarot (reprinted in mass-market paperback) made tarot accessible to a generation of seekers. The Rider-Waite-Smith deck became the standard learning deck, a position it still holds today.",
      "Tarot's influence spread into pop culture through music, film, and literature. T. S. Eliot used tarot imagery in The Waste Land (1922). James Bond's Live and Let Die (1973) featured a tarot-reading villainess. The Rolling Stones' Their Satanic Majesties Request (1967) used tarot imagery. In the 1980s, MTV brought tarot to television audiences. Sally Morgan, a British psychic, hosted a tarot call-in show that drew millions of viewers. The internet age made tarot ubiquitous: digital readings, online communities, and social media transformed it into a global, democratized practice.",
      "Perhaps no single person did more to popularize tarot in mainstream culture than Nancy Reagan. During her husband's presidency (1981–1989), it was widely reported that the First Lady consulted astrologer Joan Quigley and tarot readers to schedule presidential events — including press conferences, trips, and even the State of the Union address. The revelations caused a media frenzy. White House Chief of Staff Donald Regan wrote in his memoir For the Record (1988) that virtually every major move Reagan made was cleared in advance with Quigley's astrological charts. The First Lady defended her practice, saying she consulted astrology \"for safety reasons\" after the 1981 assassination attempt on her husband. The controversy, ironically, normalized tarot and astrology for millions of Americans who had never considered them before.",
      "The late 20th century also saw the emergence of diverse, culturally responsive tarot decks. The Motherpeace Tarot (1978–1980) by Karen Vogel and Vicki Noble introduced round cards and feminist spirituality. The Voyager Tarot (1984) by James Wanless used photo-collage. The Osho Zen Tarot (1995) blended Zen Buddhism with tarot structure. The Wild Unknown Tarot (2012) by Kim Krans became a cultural phenomenon, outselling many classic decks through Instagram-driven popularity. The modern tarot landscape is more diverse than ever: LGBTQ+ decks, decks by artists of color, minimalist decks, and decks designed for specific therapeutic or coaching applications."
    ]
  },
  {
    title: "Interesting Facts About Tarot",
    paragraphs: [
      "The oldest known complete tarot deck is the Visconti-Sforza deck (c. 1450). Three of its 78 cards are missing, but the surviving cards are housed at the Pierpont Morgan Library in New York, the Accademia Carrara in Bergamo, and the Casa Goldoni in Venice. In 2022, a single Visconti-Sforza card sold at auction for €26,000.",
      "The word 'tarot' has no known etymology. Popular theories include the Italian tarocchi (a card game), the French tarot (the game that replaced tarocchi), and the Arabic turuq (meaning 'paths'). None of these are conclusively proven. The most common explanation — that it derives from Egyptian tar (road) and ro (royal) — was invented by Court de Gébelin in 1781 and has no basis in fact.",
      "Adolf Hitler kept a tarot deck in his bunker during World War II. According to postwar accounts, he asked his assistants to read the cards for omens about the war's outcome. The deck was reportedly a Marseille-style deck, and the readings were consistently pessimistic in the final months of the war.",
      "The 1993 movie The Craft introduced an entire generation to tarot. The film's card scene — in which a character draws The Tower — became one of the most iconic tarot moments in pop culture. Sales of tarot decks spiked significantly after the film's release and have remained elevated ever since.",
      "Nancy Reagan's astrologer Joan Quigley charged $200,000 per year for her services. The Reagans' reliance on astrology was so extensive that Chief of Staff Donald Regan titled his memoir For the Record with the subtitle 'From Wall Street to Washington' — and devoted a full chapter to what he called 'The Astrological Presidency.'",
      "The 10 of Swords is historically the least favorite card in tarot, representing a painful ending, betrayal, or rock bottom. However, in the RWS deck, Pamela Colman Smith illustrated the card with a dawn sky visible in the background — Waite specifically instructed her to include this detail as a symbol that dawn always follows even the darkest night.",
      "Eliphas Lévi's 1854 Baphomet illustration — one of the most famous occult images in history — was designed as a tarot card. Lévi intended it to be The Devil (Card XV), though it was never published as part of a deck. The image was adapted for the Devil card in many later decks, including the Thoth tarot.",
      "In 2020, during the first COVID-19 lockdown, tarot app downloads increased by over 300% globally. Tarot website traffic similarly spiked. The top three search questions were: 'Will I keep my job?', 'Will my relationship survive?', and 'When will this end?'"
    ]
  },
  {
    title: "Sources & Further Reading",
    paragraphs: [
      "The Pictorial Key to the Tarot — Arthur Edward Waite (1910). The original companion to the RWS deck. Essential reading for understanding the deck's symbolism and Waite's interpretive framework, though deliberately opaque in places.",
      "The Book of Thoth — Aleister Crowley (1944). The definitive text for the Thoth tradition. Dense, esoteric, and brilliant. Required reading for anyone working with the Thoth deck or Crowley's system.",
      "A History of the Occult Tarot — Ronald Decker & Michael Dummett (2002). The definitive scholarly history of tarot. Dummett was a philosopher and playing card historian who debunked most of the occult claims about tarot's origins. This book is the gold standard for historical accuracy.",
      "The Game of Tarot: From Ferrara to Salt Lake City — Michael Dummett (1980). Covers tarot as a card game across Europe. A massively detailed work that traces how tarot evolved as a game in different countries.",
      "Seventy-Eight Degrees of Wisdom — Rachel Pollack (1980). The most influential modern tarot instruction book. Pollack's synthesis of psychological, spiritual, and practical approaches shaped the way an entire generation reads tarot.",
      "Tarot and the Archetypal Journey — Sallie Nichols (1980). A Jungian analysis of the Major Arcana. Brilliant psychological interpretation of each trump as an archetype of the individuation process.",
      "Tarot: The Complete Guide — Cynthia Giles (1994). A comprehensive academic overview of tarot's history, symbolism, and cultural impact. More accessible than Dummett but still scholarly.",
      "The Marseille Tarot Revealed — Yoav Ben-Dov (2017). The best modern guide to reading the Marseille tradition. Ben-Dov's approach emphasizes visual interpretation over memorized meanings.",
      "Pamela Colman Smith: The Untold Story — Stuart R. Kaplan (2018). The definitive biography of the artist behind the RWS deck. Includes many of her non-tarot works and tells the story of her remarkable but ultimately tragic life."
    ]
  }
];

export function getTarotHistorySections(): TarotHistorySection[] {
  return TAROT_ORIGINS;
}
