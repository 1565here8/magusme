export interface LenormandHistorySection {
  title: string;
  isList?: boolean;
  items?: string[];
  paragraphs: string[];
}

export const LENORMAND_ORIGINS: LenormandHistorySection[] = [
  {
    title: "Marie Anne Lenormand (1772–1843)",
    paragraphs: [
      "Marie Anne Adelaide Lenormand was a French professional fortune-teller who rose to prominence during the Napoleonic era. She advised Empress Josephine and was consulted by Robespierre, Marat, and other figures of the French Revolution. Her reputation was such that she was exiled several times by Napoleon himself, who found her predictions inconvenient. She wrote several books on divination and was one of the first women to make a professional career as an oracle. However, she did not create the 36-card deck that bears her name. The association came after her death, when publishers attached her famous name to a popular German fortune-telling game to increase sales."
    ]
  },
  {
    title: "Das Spiel der Hoffnung (The Game of Hope)",
    paragraphs: [
      "In 1799, a German publisher named J. G. I. Breitkopf created a simple card game called Das Spiel der Hoffnung. The Game of Hope. It used 36 cards numbered 1–36, each with a simple symbolic image (a rider, a ship, a house, etc.) and a short fortune text. The game was played like a board game: players moved tokens across a numbered track, and the card they landed on gave a prediction. It was not meant as a serious divination tool. it was parlor entertainment. But the images were universally understood, and the system spread across Germany and into France."
    ]
  },
  {
    title: "The Petit Lenormand",
    paragraphs: [
      "After Marie Anne Lenormand's death in 1843, European publishers realized the commercial value of her name. They took the 36-card Game of Hope system, renamed it \"Petit Lenormand\" (Little Lenormand), and added playing card equivalents to each card (e.g., Rider = 9 of Hearts). The deck was a commercial success across Europe, with regional variants appearing in Germany (where it was called the \"Zigeuner Wahrsagekarten\" or Gypsy Fortune-Telling Cards), France, the Netherlands, Scandinavia, and Russia. Each region developed its own interpretations and card order variations, but the core 36-card system remained consistent."
    ]
  },
  {
    title: "Key publishers and decks",
    paragraphs: [
      "Bristol / Blue Owl (c. 1890): The most influential Lenormand deck. Published by G. Bristol in Leipzig, it established the standard card order (1–36) and the blue-tinted illustrations that gave it the name \"Blue Owl.\"",
      "Piatnik (c. 1900): The Viennese publisher created a version with distinct Austrian interpretations. Still in print today and widely used in German-speaking countries.",
      "C.L. Wüst (c. 1860): One of the earliest publishers of the \"Zigeuner\" deck. The Wüst deck established many of the visual conventions that later decks followed.",
      "Dondorf (c. 1920): The Frankfurt publisher created a beautifully illustrated version that became popular in France. Dondorf's deck introduced the cream-colored background that many modern decks emulate."
    ]
  },
  {
    title: "The three schools of interpretation",
    paragraphs: [
      "As Lenormand spread across Europe, three distinct interpretive traditions developed. The French School emphasizes the playing card equivalents heavily. the card's suit and number carry meaning that modifies the image. The German School focuses primarily on the image itself and uses the Grand Tableau (9×4) as the default spread. The Dutch School blends both approaches and emphasizes the house system, where each of the 36 positions in a full spread corresponds to one of the 36 cards. Modern readers typically draw from all three traditions, adapting the system to the question being asked and their own intuitive style."
    ]
  },
  {
    title: "Interesting facts about Lenormand",
    paragraphs: [
      "Lenormand is often called \"the thinking person's oracle\" because every card in a spread must be read in combination with every other card. A 9-card spread has 36 possible pairs; a Grand Tableau has 630. This combinatorial depth makes Lenormand one of the most intellectually demanding divination systems.",
      "The 36-card structure predates the name \"Lenormand\" by nearly 50 years. The Game of Hope (1799) used the same 36 images, but they were used for a board game, not fortune-telling. The leap from game to oracle happened gradually as German and French readers began treating the card texts as predictions rather than game prompts.",
      "The \"Zigeuner\" (Gypsy) name in Germany was a marketing choice. publishers wanted to evoke Romani fortune-telling traditions. Romani people have their own divination systems, and they were not the source of the Lenormand deck. The name persists in some older German decks but has largely fallen out of use in modern publications.",
      "Unlike tarot, Lenormand has no Major Arcana. All 36 cards carry equal weight. There is no special \"trump\" card, no hierarchy of significance. The meaning comes entirely from the cards' relationships to each other in the spread.",
      "The Grand Tableau (all 36 cards laid out in a 9×4 grid) is the most complex spread in any cartomantic tradition. A full Grand Tableau reading can take 2-3 hours and involves analyzing each card's position (house), mirror pairs (corners), knight moves (chess-style), and distance from the significator (near/far technique)."
    ]
  },
  {
    title: "Modern revival",
    paragraphs: [
      "After declining in popularity mid-20th century, Lenormand experienced a revival in the 1990s and 2000s alongside the broader resurgence of interest in divination. The internet allowed readers across different national traditions to share techniques, leading to a cross-pollination of methods. Today, Lenormand is the second most popular cartomantic system after Tarot, valued for its directness, specificity, and the unique way it forces readers to combine card meanings into a coherent narrative. The Grand Tableau remains the most sophisticated spread in any cartomantic tradition. a full 36-card reading that can describe an entire life situation with astonishing detail."
    ]
  },
  {
    title: "When to use Lenormand",
    paragraphs: [
      "Lenormand excels at practical, everyday questions with clear, specific answers. Use it when you need to know what will happen rather than why it is happening. Common applications:",
      "Love & relationships: \"Does he have feelings for me?\" \"Will we reconcile?\" \"Is she being faithful?\" Lenormand gives blunt, behavior-based answers. not what you want to hear, but what is actually happening.",
      "Career & work: \"Will I get the promotion?\" \"Is my job secure?\" \"Should I accept this offer?\" The deck is excellent for yes/no and directional questions about professional matters.",
      "Money & finance: \"Will the investment pay off?\" \"When will my financial situation improve?\" The Fish (34), the Coffin (8), and the Mice (23) speak clearly about gain, loss, and erosion.",
      "Daily guidance: A three-card draw each morning for the day's energy. Lenormand is grounded in the concrete. it tells you what to expect today, not in some distant spiritual future.",
      "Missing objects & practical matters: The traditional \"where is it\" question that Lenormand handles better than any other system through positional analysis in the Grand Tableau.",
      "Timing: Lenormand cards carry timing indicators (the Rider = fast, the Ship = distant, the Mountain = delayed) that make it useful for \"when will it happen\" questions.",
      "Lenormand is not ideal for deep psychological exploration, spiritual growth, or abstract philosophical questions. For those, use Tarot. Lenormand is the friend who tells you the truth even when it hurts. not the therapist who helps you understand why you need to hear it."
    ]
  },
  {
    title: "Sources & Further Reading",
    paragraphs: [
      "The Lenormand Workbook. Caitlín Matthews. A comprehensive modern guide covering all 36 cards, spreads, and the house system. The most practical English-language book on Lenormand.",
      "The Complete Lenormand Handbook. Sylvie Steinbach. A detailed reference on Grand Tableau interpretation and the German school of Lenormand reading.",
      "Lenormand: Thirty-Six Cards. Andy Börner & Tali Goodwin. Historical research on the origins of the Lenormand deck, including the transition from Das Spiel der Hoffnung to the Petit Lenormand.",
      "The Playing Card Oracles. Ana Cortez. While focused on playing card divination, this book covers the French school's approach to reading card suits and numbers that overlaps heavily with Lenormand technique.",
      "Cartomancia: The Lenormand Tradition. Marcus Katz & Tali Goodwin. A deep dive into the historical development of cartomantic systems in Europe, including the Lenormand lineage.",
      "Historical decks: The Blue Owl (Bristol, c. 1890), Piatnik (c. 1900), and Dondorf (c. 1920) editions are the primary sources for the standard card imagery and order. Reproductions are widely available and recommended for serious study.",
      "Online: The Lenormand section of the Tarot Association's library (tarotassociation.net) and the Cartomantic Academy (cartomantic.com) maintain extensive free resources on card combinations and Grand Tableau technique."
    ]
  }
];

export function getLenormandHistory(): LenormandHistorySection[] {
  return LENORMAND_ORIGINS;
}
