export interface KipperHistorySection {
  title: string;
  paragraphs: string[];
}

export const KIPPER_HISTORY: KipperHistorySection[] = [
  {
    title: "Origins in 19th-Century Bavaria",
    paragraphs: [
      "The Kipper cards emerged in the German-speaking regions of Bavaria and Austria during the mid-19th century, roughly concurrent with the Petit Lenormand in France and Germany. Both systems share the 36-card structure and the focus on everyday life situations, but Kipper developed its own distinct card list, meanings, and reading style. The earliest known Kipper decks were produced by ASS Altenburger, one of Germany's oldest playing card manufacturers, and by the Königsfurt-Urania publishing house. The exact origins of the system are obscure: like the Lenormand cards, the Kipper deck is often attributed to a fictional or semi-legendary fortune-teller rather than a single known creator. The name Kipper itself may derive from a German dialect word for a fortune-teller or diviner.",
      "The Kipper deck reflects the social world of 19th-century Bavaria: a hierarchical society with clear roles for men and women, strong family structures, a respect for officialdom and military service, and a devout Christian faith that coexisted with folk divination practices. The cards depict characters and situations from this world: the Male and Female Protagonists, the Good Gentleman and Good Lady, the Military Person, the Court Official, and scenes of domestic life in the House and Living Room. The deck was used by village wise-women and traveling fortune-tellers who read the cards for farmers, merchants, and townspeople seeking guidance on love, work, money, and family matters."
    ],
  },
  {
    title: "Relationship to Lenormand",
    paragraphs: [
      "The Kipper cards are often described as the cousin of the Lenormand system, but the two decks are distinct in important ways. Both have 36 cards and both emerged from the same 19th-century German cartomantic tradition, but their card lists, meanings, and reading techniques differ significantly. The Lenormand deck includes cards like the Fox, the Stork, the Stars, the Moon, and the Key that do not appear in Kipper. Conversely, Kipper includes cards like the Rich Girl, the Good Outcome in Love, His Thoughts, and the Court Official that have no Lenormand equivalent.",
      "The reading style also differs. Lenormand readings are built on card combinations, where each card's meaning shifts dramatically based on its neighbor. Kipper readings place more emphasis on the directional flow of the spread: cards that fall ahead of the querent's significator represent the future, while those behind represent the past. The Kipper system gives more weight to the concept of stop cards (cards that pause the reading and demand attention) and to the distinction between people cards, action cards, and outcome cards. Many experienced readers find Kipper more direct and less abstract than Lenormand, with card meanings that are more intuitive and rooted in everyday situations."
    ],
  },
  {
    title: "Key Figures in Kipper History",
    paragraphs: [
      "Unlike tarot, which has named creators such as Waite, Crowley, and Colman Smith, the Kipper system developed anonymously through folk tradition. The earliest decks were published without attribution, and the meanings were passed down orally from reader to reader. The first printed guidebooks for Kipper decks appeared in the early 20th century, written in German and largely unknown outside German-speaking countries. These guides established the core meanings that are still used today.",
      "In the late 20th and early 21st centuries, interest in Kipper expanded beyond German-speaking countries. English-language Kipper decks and guidebooks began to appear, with artists and authors such as Ciro Marchetti (Fin de Siecle Kipper, 2015), whose Victorian-themed deck introduced Kipper to a global audience. The rise of online cartomancy communities in the 2010s brought further attention to Kipper, with readers on forums and social media sharing techniques and interpretations. Today, Kipper remains less well-known than Lenormand internationally, but it has a devoted following among readers who appreciate its directness and its distinctive 19th-century Bavarian character."
    ],
  },
  {
    title: "Reading Techniques: Direction and Stop Cards",
    paragraphs: [
      "The most distinctive feature of Kipper reading is the importance of directionality. The Main Characters (cards 1 and 2) face to the right in traditional Kipper decks. Cards that fall to the right of the significator are ahead of the querent, representing the future or what is approaching. Cards to the left are behind, representing the past or what is receding. Cards above the significator indicate conscious thoughts, while cards below indicate hidden or unconscious influences. This directional system gives Kipper readings a strong narrative quality: the reader traces a story from left to right, from past through present to future.",
      "Kipper also employs a system of stop cards: certain cards (notably 7 Pleasant Letter, 11 Win a Lot of Money, 25 Attain High Honors, 26 Great Happiness, and 36 Hope) act as full stops that pause the reading and draw attention to their meaning. When a reader encounters a stop card in a spread, they give it particular emphasis, as it signals a significant event or influence. The interaction between directional flow and stop cards creates a reading style that is both narrative and punctuated, moving from event to significant event."
    ],
  },
  {
    title: "When to Use Kipper Cards",
    paragraphs: [
      "The Kipper deck excels at practical, everyday questions. It is particularly suited to readings about family dynamics, relationships, career decisions, financial matters, and domestic situations. The deck's 19th-century social framework translates surprisingly well to modern life: the House still represents home and family, the Work card still speaks of employment and labor, and the Marriage card still addresses partnership and commitment. Kipper is less suited to abstract spiritual questions or deep psychological inquiry; its strength is in providing clear, practical guidance for real-world situations.",
      "The Kipper system is also valuable for readings that require a timeline. The directional flow of a Kipper spread gives the reader a sense of sequence: what has already happened, what is developing, and what is approaching. For querents who want to understand how a situation evolved and where it is heading, Kipper offers more clarity than many other card systems. The deck is particularly effective for follow-up readings, where the directional flow allows the reader to track the progression of a situation over time. Many Kipper practitioners read the deck in series, returning to the same querent over weeks or months to observe how the cards move through the spread."
    ],
  },
  {
    title: "Sources and Further Reading",
    paragraphs: [
      "The traditional Kipper meanings are preserved in 19th- and early 20th-century German guidebooks published by ASS Altenburger and Konigsfurt-Urania. These original sources established the core interpretations that all subsequent Kipper decks follow. For English-language readers, the most accessible introduction is the guidebook accompanying Ciro Marchetti's Fin de Siecle Kipper (U.S. Games Systems, 2015), which presents the traditional meanings in clear, modern language while preserving their 19th-century character.",
      "Online resources for Kipper study include the World Divination Association's Kipper section, which offers card meanings and reading techniques from experienced practitioners. The Kipper Cards Study Group on Facebook and the r/Kipper subreddit provide community discussion and interpretation help. The blog of Toni Savory, an English Kipper specialist, offers detailed explanations of the directional system and stop card mechanics. For German-speaking readers, kipperkarten.de and soultarot.de provide comprehensive card meanings and spread examples in the original language. The English translations of the traditional ASS Altenburger guidebook meanings, available through independent cartomancy publishers, remain the most authoritative source for authentic Kipper interpretations."
    ],
  },
];

export function getKipperHistorySections(): KipperHistorySection[] {
  return KIPPER_HISTORY;
}
