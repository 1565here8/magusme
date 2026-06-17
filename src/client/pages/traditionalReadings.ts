/* ─── Types ─── */
import { getMeaning } from "./tarotCardData";

export interface SpreadElement {
  glyph: string;
  title: string;
  meaning: string;
  position: string;
  reversed?: boolean;
  polarity?: number;
  keywords?: string;
  symbolism?: string;
}

export interface ReadingResult {
  systemName: string;
  method: string;
  spreadName: string;
  elements: SpreadElement[];
  interpretation: string;
  verdict?: { answer: "Yes" | "No" | "Mixed" | "Unclear"; explanation: string };
}

export type SpreadLayout = "single" | "line" | "celtic-cross" | "horseshoe" | "yes-no";

export interface SpreadDef {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  cardCount: number;
  positions: string[];
  layout: SpreadLayout;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

/* ─── Oracle data per system ─── */
type OracleData = { glyph: string; readings: [string, string, string][] };

const ORACLES: Record<string, OracleData> = {
  mahjong_oracle: { glyph: "🀄", readings: [
    ["Bamboo 1. One Bamboo", "A new beginning takes root. Patience. what you plant now will grow.", "The Tile"],
    ["Bamboo 2. Two Bamboo", "Balance and partnership. Harmonize opposing forces in your life.", "The Tile"],
    ["Bamboo 3. Three Bamboo", "Growth through collaboration. Your network is your strength.", "The Tile"],
    ["Bamboo 4. Four Bamboo", "Stability in family and home. Root yourself before reaching higher.", "The Tile"],
    ["Dragon Red", "Power and authority. A transformative force enters your life.", "The Tile"],
    ["Dragon Green", "Growth, vitality, and renewal. Fortune favors your efforts.", "The Tile"],
    ["Wind East", "New dawn. a fresh cycle begins. Set intentions now.", "The Tile"],
    ["Wind West", "Travel or movement. A journey. physical or spiritual. awaits.", "The Tile"],
    ["One Dot", "Single focus. One goal, one heart, one path. Clarity emerges.", "The Tile"],
    ["Nine Dot", "Completion and fulfillment. A cycle closes to make way for the next.", "The Tile"],
  ]},
  tarot: { glyph: "🃏", readings: [
    ["The Fool", "New beginnings, spontaneity, free spirit. Trust the path ahead.", "Major Arcana"],
    ["The Magician", "Manifestation, resourcefulness, power. You have all you need.", "Major Arcana"],
    ["The High Priestess", "Intuition, mystery, the subconscious. Listen to your inner voice.", "Major Arcana"],
    ["The Empress", "Abundance, nurturing, fertility. Nature provides.", "Major Arcana"],
    ["The Emperor", "Authority, structure, stability. Take command of your domain.", "Major Arcana"],
    ["The Hierophant", "Wisdom, tradition, spiritual guidance. Seek the teacher within.", "Major Arcana"],
    ["The Lovers", "Union, partnership, choices of the heart. Follow love.", "Major Arcana"],
    ["The Chariot", "Willpower, determination, victory. Push forward with resolve.", "Major Arcana"],
    ["Strength", "Courage, inner power, patience. True strength is gentle.", "Major Arcana"],
    ["The Hermit", "Introspection, solitude, inner wisdom. The answers are within.", "Major Arcana"],
    ["Wheel of Fortune", "Cycles turn. Destiny shifts. Embrace change.", "Major Arcana"],
    ["Justice", "Balance, truth, cause and effect. Fairness prevails.", "Major Arcana"],
    ["The Hanged Man", "Surrender, new perspective. Pause to see differently.", "Major Arcana"],
    ["Death", "Endings, transformation, rebirth. Let the old die.", "Major Arcana"],
    ["Temperance", "Moderation, alchemy, blending. Find the middle path.", "Major Arcana"],
    ["The Devil", "Shadow, bondage, materialism. Recognize your chains.", "Major Arcana"],
    ["The Tower", "Sudden upheaval, revelation. False structures fall.", "Major Arcana"],
    ["The Star", "Hope, inspiration, healing. Light after darkness.", "Major Arcana"],
    ["The Moon", "Illusion, intuition, subconscious. Trust inner knowing.", "Major Arcana"],
    ["The Sun", "Joy, success, vitality. Clarity and warmth shine.", "Major Arcana"],
    ["Judgement", "Awakening, reckoning, calling. Rise to your purpose.", "Major Arcana"],
    ["The World", "Completion, integration, wholeness. Cycle fulfilled.", "Major Arcana"],
    ["Ace of Wands", "Creative spark, new venture, inspiration. Fire ignites.", "Minor Arcana. Wands"],
    ["Two of Wands", "Planning, decisions, personal power. Choose your path.", "Minor Arcana. Wands"],
    ["Three of Wands", "Expansion, foresight, enterprise. Horizons widen.", "Minor Arcana. Wands"],
    ["Four of Wands", "Celebration, harmony, homecoming. Foundation stable.", "Minor Arcana. Wands"],
    ["Five of Wands", "Conflict, competition, struggle. Test your strength.", "Minor Arcana. Wands"],
    ["Six of Wands", "Victory, recognition, public success. Crown earned.", "Minor Arcana. Wands"],
    ["Seven of Wands", "Defense, perseverance, standing ground. Hold your position.", "Minor Arcana. Wands"],
    ["Eight of Wands", "Swift action, movement, messages. Momentum builds.", "Minor Arcana. Wands"],
    ["Nine of Wands", "Resilience, last stand, boundaries. You endure.", "Minor Arcana. Wands"],
    ["Ten of Wands", "Burden, responsibility, overwhelm. Delegate or release.", "Minor Arcana. Wands"],
    ["Page of Wands", "Enthusiasm, discovery, creative messenger. Begin.", "Minor Arcana. Wands"],
    ["Knight of Wands", "Adventure, impulse, charged forward. Ride the fire.", "Minor Arcana. Wands"],
    ["Queen of Wands", "Confidence, charisma, independent spirit. Radiate.", "Minor Arcana. Wands"],
    ["King of Wands", "Leadership, vision, natural authority. Command.", "Minor Arcana. Wands"],
    ["Ace of Cups", "New love, emotional opening, intuition flows. Heart opens.", "Minor Arcana. Cups"],
    ["Two of Cups", "Partnership, mutual attraction, union. Hearts align.", "Minor Arcana. Cups"],
    ["Three of Cups", "Celebration, friendship, community joy. Share the bounty.", "Minor Arcana. Cups"],
    ["Four of Cups", "Apathy, contemplation, missed offer. Look deeper.", "Minor Arcana. Cups"],
    ["Five of Cups", "Grief, regret, loss. Yet two cups remain upright.", "Minor Arcana. Cups"],
    ["Six of Cups", "Nostalgia, childhood, innocence returned. Sweet memories.", "Minor Arcana. Cups"],
    ["Seven of Cups", "Illusions, choices, fantasy. Discern reality from dream.", "Minor Arcana. Cups"],
    ["Eight of Cups", "Walking away, deeper calling. Leave what no longer serves.", "Minor Arcana. Cups"],
    ["Nine of Cups", "Wish fulfilled, emotional satisfaction. Contentment.", "Minor Arcana. Cups"],
    ["Ten of Cups", "Family harmony, lasting happiness. Domestic bliss.", "Minor Arcana. Cups"],
    ["Page of Cups", "Intuitive message, creative child, dreamer. Listen.", "Minor Arcana. Cups"],
    ["Knight of Cups", "Romantic pursuit, idealistic quest. Follow the heart.", "Minor Arcana. Cups"],
    ["Queen of Cups", "Empathy, psychic depth, nurturing. Hold space.", "Minor Arcana. Cups"],
    ["King of Cups", "Emotional mastery, wise counsel, compassion. Rule with heart.", "Minor Arcana. Cups"],
    ["Ace of Swords", "Mental clarity, breakthrough, truth cuts through. Decide.", "Minor Arcana. Swords"],
    ["Two of Swords", "Stalemate, difficult choice, blindfolded. Remove the blindfold.", "Minor Arcana. Swords"],
    ["Three of Swords", "Heartbreak, sorrow, separation. Grief purifies.", "Minor Arcana. Swords"],
    ["Four of Swords", "Rest, recuperation, meditation. Heal in silence.", "Minor Arcana. Swords"],
    ["Five of Swords", "Conflict, hollow victory, betrayal. Choose peace.", "Minor Arcana. Swords"],
    ["Six of Swords", "Transition, moving on, calmer waters. Journey forward.", "Minor Arcana. Swords"],
    ["Seven of Swords", "Deception, strategy, stealth. Act with integrity.", "Minor Arcana. Swords"],
    ["Eight of Swords", "Self-imposed limits, mental trap. Freedom is within.", "Minor Arcana. Swords"],
    ["Nine of Swords", "Anxiety, nightmares, worry. Dawn comes.", "Minor Arcana. Swords"],
    ["Ten of Swords", "Rock bottom, ending, release. Only way is up.", "Minor Arcana. Swords"],
    ["Page of Swords", "Curiosity, vigilance, mental agility. Question everything.", "Minor Arcana. Swords"],
    ["Knight of Swords", "Swift action, direct communication, intellect. Charge.", "Minor Arcana. Swords"],
    ["Queen of Swords", "Sharp intellect, independence, truth-teller. Discern.", "Minor Arcana. Swords"],
    ["King of Swords", "Authority, logic, ethical judgment. Rule with mind.", "Minor Arcana. Swords"],
    ["Ace of Pentacles", "New prosperity, opportunity, seed of abundance. Plant it.", "Minor Arcana. Pentacles"],
    ["Two of Pentacles", "Balance, adaptability, juggling priorities. Dance with life.", "Minor Arcana. Pentacles"],
    ["Three of Pentacles", "Collaboration, craftsmanship, teamwork. Build together.", "Minor Arcana. Pentacles"],
    ["Four of Pentacles", "Security, possession, holding on. Generosity frees.", "Minor Arcana. Pentacles"],
    ["Five of Pentacles", "Hardship, lack, exclusion. Help exists. receive.", "Minor Arcana. Pentacles"],
    ["Six of Pentacles", "Generosity, charity, fair exchange. Give and receive.", "Minor Arcana. Pentacles"],
    ["Seven of Pentacles", "Patience, assessment, long-term view. Harvest comes.", "Minor Arcana. Pentacles"],
    ["Eight of Pentacles", "Mastery, diligence, apprenticeship. Perfect your craft.", "Minor Arcana. Pentacles"],
    ["Nine of Pentacles", "Self-sufficiency, luxury, reward. Enjoy your harvest.", "Minor Arcana. Pentacles"],
    ["Ten of Pentacles", "Legacy, inheritance, family wealth. Foundations last.", "Minor Arcana. Pentacles"],
    ["Page of Pentacles", "Study, manifestation, practical learning. Begin the work.", "Minor Arcana. Pentacles"],
    ["Knight of Pentacles", "Reliability, routine, steady progress. Persist.", "Minor Arcana. Pentacles"],
    ["Queen of Pentacles", "Nurturing abundance, practical magic. Provide and protect.", "Minor Arcana. Pentacles"],
    ["King of Pentacles", "Mastery of material world, provider, builder. Reign.", "Minor Arcana. Pentacles"],
  ]},
  lenormand: { glyph: "🃏", readings: [
    ["1. Rider", "News, messages, arrival. Information comes swiftly.", "Card"],
    ["2. Clover", "Luck, opportunity, hope. Small fortune favors you.", "Card"],
    ["3. Ship", "Travel, journey, adventure. Distance bridged.", "Card"],
    ["4. House", "Home, family, security. Foundation is solid.", "Card"],
    ["5. Tree", "Health, growth, roots. Deep healing takes time.", "Card"],
    ["6. Clouds", "Confusion, uncertainty, doubt. Clarity will return.", "Card"],
    ["7. Snake", "Complication, deception, desire. Wisdom needed.", "Card"],
    ["8. Coffin", "Ending, closure, transformation. Let it rest.", "Card"],
    ["9. Bouquet", "Beauty, gift, appreciation. Joy arrives.", "Card"],
    ["10. Scythe", "Swift cut, decision, separation. Act decisively.", "Card"],
    ["11. Whip", "Conflict, repetition, exertion. Master the pattern.", "Card"],
    ["12. Birds", "Conversation, worry, chatter. Listen for truth.", "Card"],
    ["13. Child", "New beginning, innocence, smallness. Fresh start.", "Card"],
    ["14. Fox", "Cunning, strategy, self-interest. Trust instincts.", "Card"],
    ["15. Bear", "Strength, authority, finances. Power protects.", "Card"],
    ["16. Stars", "Guidance, hope, destiny. Navigate by them.", "Card"],
    ["17. Stork", "Change, relocation, improvement. Migration happens.", "Card"],
    ["18. Dog", "Loyalty, friendship, support. True companion.", "Card"],
    ["19. Tower", "Institution, authority, solitude. Structure stands.", "Card"],
    ["20. Garden", "Public life, community, network. Circle expands.", "Card"],
    ["21. Mountain", "Obstacle, delay, challenge. Patience overcomes.", "Card"],
    ["22. Crossroads", "Choice, decision, diverging paths. Choose wisely.", "Card"],
    ["23. Mice", "Loss, erosion, anxiety. Small drains deplete.", "Card"],
    ["24. Heart", "Love, affection, emotion. Feelings guide.", "Card"],
    ["25. Ring", "Commitment, contract, cycle. Bond sealed.", "Card"],
    ["26. Book", "Knowledge, secret, education. Study reveals.", "Card"],
    ["27. Letter", "Communication, document, message. Written word.", "Card"],
    ["28. Man", "The querent (male) or significant male. Masculine energy.", "Card"],
    ["29. Woman", "The querent (female) or significant female. Feminine energy.", "Card"],
    ["30. Lily", "Purity, maturity, sensuality, peace. Grace unfolds.", "Card"],
    ["31. Sun", "Success, vitality, clarity. All illuminates.", "Card"],
    ["32. Moon", "Intuition, dreams, reputation. Subconscious speaks.", "Card"],
    ["33. Key", "Solution, certainty, opening. Answer found.", "Card"],
    ["34. Fish", "Abundance, flow, business. Wealth circulates.", "Card"],
    ["35. Anchor", "Stability, persistence, work. Hold fast.", "Card"],
    ["36. Cross", "Burden, destiny, faith. Carry it. it shapes you.", "Card"],
  ]},
  rune: { glyph: "ᚠ", readings: [
    ["Fehu (ᚠ)", "Wealth, abundance, prosperity. Flowing energy brings increase.", "Elder Futhark"],
    ["Uruz (ᚢ)", "Strength, vitality, raw power. The wild ox awakens your spirit.", "Elder Futhark"],
    ["Ansuz (ᚨ)", "Wisdom, communication, divine inspiration. Speak your truth.", "Elder Futhark"],
    ["Raidho (ᚱ)", "Journey, travel, change of course. The road opens before you.", "Elder Futhark"],
    ["Kenaz (ᚲ)", "Fire, illumination, creative forge. Passion burns bright.", "Elder Futhark"],
    ["Gebo (ᚷ)", "Gift, partnership, generosity. Give and receive freely.", "Elder Futhark"],
    ["Wunjo (ᚹ)", "Joy, harmony, fulfillment. Delight is your birthright.", "Elder Futhark"],
    ["Hagalaz (ᚺ)", "Hail, disruption, transformation. What breaks you remakes you.", "Elder Futhark"],
    ["Berkano (ᛒ)", "Growth, birth, renewal. The birch tree shelters new life.", "Elder Futhark"],
    ["Sowilo (ᛋ)", "Sun, success, vitality. Victory and wholeness are yours.", "Elder Futhark"],
  ]},
  iching: { glyph: "☰", readings: [
    ["Hexagram 1. Qián (The Creative)", "Strong, creative power. Heaven above. act with integrity and vision.", "I Ching"],
    ["Hexagram 2. Kūn (The Receptive)", "Yield, receive, nurture. The earth supports all things.", "I Ching"],
    ["Hexagram 3. Zhūn (Difficulty)", "Birth pangs. The beginning is hard. push through the thicket.", "I Ching"],
    ["Hexagram 8. Bǐ (Holding Together)", "Unity, alliance, community. Find your people and stand with them.", "I Ching"],
    ["Hexagram 11. Tài (Peace)", "Harmony and prosperity. Heaven and earth in balance.", "I Ching"],
    ["Hexagram 24. Fù (Return)", "Turning point. The light returns after darkness.", "I Ching"],
    ["Hexagram 42. Yì (Increase)", "Growth and abundance. A time of blessing. share it.", "I Ching"],
    ["Hexagram 52. Gèn (Keeping Still)", "Stillness, meditation, inner peace. Know when to stop.", "I Ching"],
    ["Hexagram 55. Fēng (Abundance)", "Fullness, prosperity, culmination. Enjoy the harvest.", "I Ching"],
    ["Hexagram 61. Zhōng Fú (Inner Truth)", "Sincerity, trust, inner guidance. Your heart knows.", "I Ching"],
  ]},
  ogham: { glyph: "🌲", readings: [
    ["Beith (B). Birch", "New beginnings, purification, birth. A fresh page turns.", "Fid"],
    ["Luis (L). Rowan", "Protection, intuition, quickening. The shield tree guards you.", "Fid"],
    ["Fearn (F). Alder", "Courage, confidence, spirit-warrior. Stand your ground.", "Fid"],
    ["Saille (S). Willow", "Flow, intuition, lunar wisdom. Bend like the willow.", "Fid"],
    ["Duir (D). Oak", "Strength, endurance, kingship. The door opens for the worthy.", "Fid"],
    ["Tinne (T). Holly", "Balance, challenge, justice. What you wield must be earned.", "Fid"],
    ["Coll (C). Hazel", "Wisdom, poetry, inspiration. The salmon of knowledge feeds you.", "Fid"],
    ["Quert (Q). Apple", "Choice, love, immortality. The silver branch leads to otherworld.", "Fid"],
    ["Muin (M). Vine", "Inner strength, prophetic vision. The vine weaves unseen paths.", "Fid"],
    ["Gort (G). Ivy", "Connection, binding, resilience. What holds you also strengthens.", "Fid"],
  ]},
  playing_cards: { glyph: "🂡", readings: [
    ["Ace of Hearts", "New love, emotional beginning, heartfelt offer. Home and family joy.", "Card"],
    ["Two of Hearts", "Partnership, friendship, mutual affection. Harmony in relationships.", "Card"],
    ["Three of Hearts", "Celebration, community, creative expression. Shared happiness.", "Card"],
    ["Four of Hearts", "Stability in love, domestic peace. Foundation secure.", "Card"],
    ["Five of Hearts", "Change in relationships, emotional challenge. Adapt with heart.", "Card"],
    ["Six of Hearts", "Nostalgia, past connections, childhood memories. Sweet reunion.", "Card"],
    ["Seven of Hearts", "Dreams, illusions, choices in love. Discern true feeling.", "Card"],
    ["Eight of Hearts", "Moving on emotionally, leaving behind. Seek deeper fulfillment.", "Card"],
    ["Nine of Hearts", "Wish fulfilled, emotional contentment. Heart's desire met.", "Card"],
    ["Ten of Hearts", "Family bliss, lasting harmony, legacy. Ultimate fulfillment.", "Card"],
    ["Jack of Hearts", "Young romantic, messenger of love, creative youth. Sincere offer.", "Card"],
    ["Queen of Hearts", "Nurturing woman, emotional maturity, compassion. Motherly wisdom.", "Card"],
    ["King of Hearts", "Fair-haired man, emotional leader, kindness. Benevolent authority.", "Card"],
    ["Ace of Diamonds", "New financial opportunity, seed of wealth. Material beginning.", "Card"],
    ["Two of Diamonds", "Balance of resources, juggling finances. Adaptable management.", "Card"],
    ["Three of Diamonds", "Teamwork, collaboration, skilled craft. Build together.", "Card"],
    ["Four of Diamonds", "Financial stability, savings, possession. Secure foundation.", "Card"],
    ["Five of Diamonds", "Material hardship, loss, exclusion. Seek support.", "Card"],
    ["Six of Diamonds", "Generosity, fair exchange, charity. Give and receive.", "Card"],
    ["Seven of Diamonds", "Patience, assessment, long-term investment. Harvest comes.", "Card"],
    ["Eight of Diamonds", "Apprenticeship, diligence, mastery. Perfect your craft.", "Card"],
    ["Nine of Diamonds", "Self-sufficiency, luxury earned, reward. Enjoy your harvest.", "Card"],
    ["Ten of Diamonds", "Legacy, inheritance, family wealth. Foundations endure.", "Card"],
    ["Jack of Diamonds", "Young entrepreneur, messenger of opportunity. Resourceful youth.", "Card"],
    ["Queen of Diamonds", "Practical woman, social grace, resource manager. Sophisticated.", "Card"],
    ["King of Diamonds", "Business leader, financial authority, provider. Mastery of wealth.", "Card"],
    ["Ace of Clubs", "New inspiration, creative spark, mental energy. Intellectual fire.", "Card"],
    ["Two of Clubs", "Planning, consideration, partnership in ideas. Weigh options.", "Card"],
    ["Three of Clubs", "Collaboration, enterprise, expansion. Venture forth together.", "Card"],
    ["Four of Clubs", "Stable structure, community, mental peace. Foundation built.", "Card"],
    ["Five of Clubs", "Competition, conflict, mental struggle. Test your ideas.", "Card"],
    ["Six of Clubs", "Victory, recognition, progress. Success acknowledged.", "Card"],
    ["Seven of Clubs", "Defense of position, perseverance. Stand your ground.", "Card"],
    ["Eight of Clubs", "Swift communication, movement, messages. Speed serves you.", "Card"],
    ["Nine of Clubs", "Resilience, boundaries, last stand. You have endured.", "Card"],
    ["Ten of Clubs", "Burden of responsibility, overwhelm. Delegate or release.", "Card"],
    ["Jack of Clubs", "Curious youth, student, messenger of news. Eager learner.", "Card"],
    ["Queen of Clubs", "Confident woman, charismatic, independent. Magnetic leader.", "Card"],
    ["King of Clubs", "Visionary leader, natural authority, master of craft. Commanding.", "Card"],
    ["Ace of Spades", "Mental clarity, decisive cut, new truth. Cut through illusion.", "Card"],
    ["Two of Spades", "Stalemate, difficult choice, truce. Seek inner resolution.", "Card"],
    ["Three of Spades", "Heartbreak, sorrow, separation. Grief purifies the heart.", "Card"],
    ["Four of Spades", "Rest, recuperation, meditation. Heal in sacred silence.", "Card"],
    ["Five of Spades", "Conflict, hollow victory, betrayal. Choose peace over pride.", "Card"],
    ["Six of Spades", "Transition, moving to calmer waters. Journey forward.", "Card"],
    ["Seven of Spades", "Deception, strategy, stealth. Act with integrity instead.", "Card"],
    ["Eight of Spades", "Self-imposed limits, mental trap. Freedom is within.", "Card"],
    ["Nine of Spades", "Anxiety, worry, nightmares. Dawn always comes.", "Card"],
    ["Ten of Spades", "Rock bottom, final ending, release. Only way is up.", "Card"],
    ["Jack of Spades", "Vigilant youth, sharp mind, messenger of warning. Observe.", "Card"],
    ["Queen of Spades", "Sharp intellect, independent, truth-teller. Discerning wisdom.", "Card"],
    ["King of Spades", "Ethical authority, logical judgment, master of mind. Just ruler.", "Card"],
  ]},
  oracle_deck: { glyph: "🔮", readings: [
    ["The Gateway", "A threshold crossed. New possibilities open.", "Card"],
    ["The Mirror", "Truth revealed. See yourself clearly now.", "Card"],
    ["The Key", "Solution found. You hold the answer.", "Card"],
    ["The Lantern", "Guidance in darkness. Follow the light within.", "Card"],
    ["The Bridge", "Connection made. Transition to new phase.", "Card"],
    ["The Anchor", "Stability amid change. Hold fast.", "Card"],
    ["The Feather", "Lightness of being. Release what weighs you.", "Card"],
    ["The Compass", "Direction found. Trust your inner knowing.", "Card"],
  ]},
  kipper: { glyph: "🃏", readings: [
    ["Main Character", "You. the questioner at center of the reading.", "Card"],
    ["The Meeting", "Important encounter. Someone enters your life.", "Card"],
    ["The Journey", "Travel, movement, change of residence.", "Card"],
    ["House & Home", "Domestic matters, family, real estate.", "Card"],
    ["Good Fortune", "Unexpected luck, gift, favorable turn.", "Card"],
    ["Sorrow & Tribulation", "Temporary difficulty. This too shall pass.", "Card"],
    ["The Letter", "Written communication, contract, document.", "Card"],
    ["False Person", "Deception nearby. Trust your instincts.", "Card"],
    ["Change", "Transformation, shift in circumstances.", "Card"],
    ["The Court", "Official matter, legal, authority decision.", "Card"],
  ]},
  bone_throw: { glyph: "🦴", readings: [
    ["The Ancestor Bone", "Elders speak. Honor your lineage.", "Bone"],
    ["The Heart Bone", "Love, passion, emotional truth revealed.", "Bone"],
    ["The Path Bone", "Direction shown. Follow where it leads.", "Bone"],
    ["The Shield Bone", "Protection invoked. You are guarded.", "Bone"],
    ["The Coin Bone", "Material gain, resource arrives.", "Bone"],
    ["The Knife Bone", "Cut away what no longer serves.", "Bone"],
    ["The Eye Bone", "Hidden truth revealed. See clearly.", "Bone"],
    ["The Root Bone", "Foundation, ancestry, grounding.", "Bone"],
  ]},
  dice_oracle: { glyph: "🎲", readings: [
    ["Two Ones. Snake Eyes", "New beginning, raw potential. Start fresh.", "Throw"],
    ["Two Sixes. Boxcars", "Completion, mastery, peak reached.", "Throw"],
    ["One and Two", "Choice between paths. Decide with heart.", "Throw"],
    ["Three of a Kind", "Power amplified. Energy concentrated.", "Throw"],
    ["Six and One", "Balance of opposites. Harmony found.", "Throw"],
    ["Total Seven", "Divine number. Luck turns in your favor.", "Throw"],
    ["Double Threes", "Creative burst. Manifestation accelerating.", "Throw"],
    ["Low Total (2-4)", "Patience needed. Seeds planted underground.", "Throw"],
    ["High Total (10-12)", "Harvest time. Rewards manifesting.", "Throw"],
  ]},
  domino: { glyph: "🀱", readings: [
    ["Double Six", "Supreme success, victory, highest achievement.", "Tile"],
    ["Six-Five", "Progress through effort, steady advancement.", "Tile"],
    ["Double Five", "Change coming, adaptation required.", "Tile"],
    ["Six-Four", "Opportunity from unexpected source.", "Tile"],
    ["Five-Four", "Balance of give and take in partnerships.", "Tile"],
    ["Double Four", "Foundation solid, build upon it.", "Tile"],
    ["Six-Three", "Communication opens doors, speak up.", "Tile"],
    ["Five-Three", "Creative solution to old problem.", "Tile"],
    ["Four-Three", "Gradual growth, patience rewarded.", "Tile"],
    ["Double Three", "Harmony in small matters, details matter.", "Tile"],
  ]},
  lots_bibliomancy: { glyph: "📖", readings: [
    ["The Open Book", "Wisdom seeks you. Open to guidance.", "Verse"],
    ["The Hidden Page", "Truth concealed. Look deeper within.", "Verse"],
    ["The Turning Leaf", "Transition imminent. Embrace the change.", "Verse"],
    ["The Marked Passage", "Direct answer to your question.", "Verse"],
    ["The Blank Page", "Possibility unlimited. Write your fate.", "Verse"],
    ["The Torn Leaf", "Release what is broken. Healing follows.", "Verse"],
    ["The Illuminated Text", "Divine inspiration. Clarity arrives.", "Verse"],
    ["The Ancient Script", "Ancestral wisdom. Honor tradition.", "Verse"],
  ]},
  crystal: { glyph: "🔮", readings: [
    ["Clear Vision", "Truth seen without distortion. Know clearly.", "Vision"],
    ["Clouded Depths", "Uncertainty present. Wait for clarity.", "Vision"],
    ["Rainbow Refraction", "Many paths open. Choose with heart.", "Vision"],
    ["Single Beam", "Focused intent. One thing at a time.", "Vision"],
    ["Fractured Light", "Multiple perspectives. Integrate them.", "Vision"],
    ["Dark Crystal", "Shadow work needed. Face what hides.", "Vision"],
    ["Pulsing Glow", "Energy building. Action time approaching.", "Vision"],
    ["Still Clarity", "Perfect peace. Rest in knowing.", "Vision"],
  ]},
  mirror: { glyph: "🪞", readings: [
    ["True Reflection", "Self-knowledge attained. No illusion.", "Vision"],
    ["Distorted Image", "Perception skewed. Question assumptions.", "Vision"],
    ["Cracked Surface", "Old self breaking. New self emerging.", "Vision"],
    ["Fogged Glass", "Confusion temporary. Clarity returning.", "Vision"],
    ["Dual Reflection", "Inner and outer aligning. Integrate.", "Vision"],
    ["Empty Frame", "Projection ceased. Pure presence.", "Vision"],
    ["Golden Light", "Divine self revealed. Radiate truth.", "Vision"],
    ["Shadowed Side", "Hidden aspect shown. Embrace it.", "Vision"],
  ]},
  water_bowl: { glyph: "💧", readings: [
    ["Still Waters", "Deep peace. Answers rise from silence.", "Vision"],
    ["Rippling Surface", "Change stirring. Adapt fluidly.", "Vision"],
    ["Clear Depths", "Truth visible. See to the bottom.", "Vision"],
    ["Murky Waters", "Confusion present. Let sediment settle.", "Vision"],
    ["Flowing Stream", "Life moving. Go with the current.", "Vision"],
    ["Frozen Pool", "Stagnation. Warmth needed to flow.", "Vision"],
    ["Reflecting Stars", "Cosmic guidance. As above, so below.", "Vision"],
    ["Spring Source", "New beginning. Fresh water rising.", "Vision"],
  ]},
  fire_gazing: { glyph: "🔥", readings: [
    ["Steady Flame", "Clear intent. Will aligned with purpose.", "Vision"],
    ["Dancing Fire", "Energy in motion. Creative force active.", "Vision"],
    ["Flickering Light", "Uncertainty. Guard your focus.", "Vision"],
    ["Blue Flame", "Spiritual insight. Higher guidance near.", "Vision"],
    ["Sparking Embers", "New ideas igniting. Nurture them.", "Vision"],
    ["Dying Fire", "Cycle ending. Rest before renewal.", "Vision"],
    ["Rising Smoke", "Prayers ascending. Message sent.", "Vision"],
    ["White Heat", "Purification. Transformation complete.", "Vision"],
  ]},
  smoke: { glyph: "💨", readings: [
    ["Straight Rise", "Clear path. No obstacles ahead.", "Vision"],
    ["Swirling Patterns", "Complex situation. Multiple factors.", "Vision"],
    ["White Smoke", "Peace, purity, blessing arriving.", "Vision"],
    ["Dark Smoke", "Shadow work. Face what is hidden.", "Vision"],
    ["Spiral Upward", "Spiritual ascent. Growth accelerating.", "Vision"],
    ["Low Hovering", "Grounded energy. Stay practical.", "Vision"],
    ["Sudden Dissipation", "Issue resolving. Tension released.", "Vision"],
    ["Thick Cloud", "Confusion temporary. Clarity coming.", "Vision"],
  ]},
  cloud: { glyph: "☁️", readings: [
    ["Clear Sky", "Unlimited potential. No limits.", "Vision"],
    ["White Cumulus", "Gentle growth. Steady progress.", "Vision"],
    ["Storm Clouds", "Challenge approaching. Prepare inner strength.", "Vision"],
    ["Rainbow", "Promise fulfilled. Hope confirmed.", "Vision"],
    ["Swift Movement", "Rapid change. Adapt quickly.", "Vision"],
    ["Sun Through Clouds", "Breakthrough imminent. Light returns.", "Vision"],
    ["Fog Bank", "Uncertainty. Pause and listen.", "Vision"],
    ["Golden Sunset", "Cycle completing. Harvest earned.", "Vision"],
  ]},
  palm: { glyph: "🤚", readings: [
    ["Life Line Strong", "Vitality and resilience. Long healthy path.", "Line"],
    ["Heart Line Curved", "Open emotions. Love flows freely.", "Line"],
    ["Head Line Clear", "Sharp mind. Decisions from wisdom.", "Line"],
    ["Fate Line Present", "Destiny guided. Purpose unfolds.", "Line"],
    ["Sun Line Bright", "Recognition coming. Talents seen.", "Line"],
    ["Mercury Line Active", "Communication gift. Business success.", "Line"],
    ["Mars Strong", "Courage and drive. Overcome obstacles.", "Mount"],
    ["Venus Mount Full", "Love and pleasure abundant.", "Mount"],
  ]},
  face: { glyph: "👤", readings: [
    ["Bright Eyes", "Clear spirit. Truth shines through.", "Feature"],
    ["High Forehead", "Wisdom and intellect. Think deeply.", "Feature"],
    ["Full Cheeks", "Abundance and vitality. Life well-lived.", "Feature"],
    ["Straight Nose", "Integrity and purpose. Direct path.", "Feature"],
    ["Kind Mouth", "Words that heal. Speech with heart.", "Feature"],
    ["Strong Chin", "Determination. Will not yield.", "Feature"],
    ["Defined Eyebrows", "Focus and drive. Goals achieved.", "Feature"],
    ["Radiant Complexion", "Inner health reflects outward. Glowing.", "Feature"],
  ]},
  phrenology: { glyph: "🧠", readings: [
    ["Amativeness Strong", "Deep capacity for love and connection.", "Faculty"],
    ["Philoprogenitiveness", "Nurturing instinct. Protective of kin.", "Faculty"],
    ["Concentrativeness", "Focus and persistence. Sees things through.", "Faculty"],
    ["Adhesiveness", "Loyalty and friendship. Bonds endure.", "Faculty"],
    ["Combativeness", "Courage to defend. Stand your ground.", "Faculty"],
    ["Destructiveness", "Power to transform. Clear the old.", "Faculty"],
    ["Secretiveness", "Discretion. Knows when to speak.", "Faculty"],
    ["Acquisitiveness", "Resource gathering. Provides security.", "Faculty"],
  ]},
  iris: { glyph: "👁️", readings: [
    ["Clear Blue", "Clarity of vision. Truth-seeking soul.", "Iris Sign"],
    ["Deep Brown", "Grounded wisdom. Practical insight.", "Iris Sign"],
    ["Green Flecks", "Healing gift. Nature connection.", "Iris Sign"],
    ["Radiating Lines", "Strong constitution. Vital force.", "Iris Sign"],
    ["Contraction Furrows", "Tension held. Release needed.", "Iris Sign"],
    ["Lymphatic Rosary", "Sensitivity. Absorb energies.", "Iris Sign"],
    ["Pupil Margin Clear", "Nervous system balanced. Calm mind.", "Iris Sign"],
    ["Iris Freckles", "Ancestral marks. Gifts inherited.", "Iris Sign"],
  ]},
  foot: { glyph: "🦶", readings: [
    ["High Arch", "Independent spirit. Self-reliant path.", "Zone"],
    ["Flat Sole", "Grounded nature. Community rooted.", "Zone"],
    ["Long Second Toe", "Leadership gift. Visionary mind.", "Zone"],
    ["Wide Forefoot", "Generous heart. Gives freely.", "Zone"],
    ["Narrow Heel", "Focused direction. Single path.", "Zone"],
    ["Callused Ball", "Hard work bearing fruit. Persistence.", "Zone"],
    ["Cool Toes", "Energy flowing. Circulation good.", "Zone"],
    ["Warm Soles", "Vitality strong. Life force active.", "Zone"],
  ]},
  coffee: { glyph: "☕", readings: [
    ["Bird Shape", "News arriving. Message on wings.", "Symbol"],
    ["Heart Form", "Love deepening. Affection grows.", "Symbol"],
    ["Ring Circle", "Commitment sealed. Cycle complete.", "Symbol"],
    ["Snake Coil", "Transformation. Shed the old.", "Symbol"],
    ["Tree Branching", "Growth expanding. Roots deepen.", "Symbol"],
    ["Mountain Peak", "Challenge climbed. Summit reached.", "Symbol"],
    ["Fish Swimming", "Abundance flowing. Wealth comes.", "Symbol"],
    ["Cross Lines", "Decision point. Choose wisely.", "Symbol"],
  ]},
  tea: { glyph: "🍵", readings: [
    ["Anchor", "Stability found. Safe harbor.", "Symbol"],
    ["Bird Flying", "Good news coming. Freedom calls.", "Symbol"],
    ["Circle Complete", "Cycle fulfilled. Return to source.", "Symbol"],
    ["Heart Shape", "Love matter resolves. Hearts unite.", "Symbol"],
    ["Key Form", "Solution found. Door unlocks.", "Symbol"],
    ["Moon Crescent", "Intuition rising. Trust inner knowing.", "Symbol"],
    ["Star Bright", "Hope confirmed. Guidance clear.", "Symbol"],
    ["Tree Growing", "Steady progress. Patience rewarded.", "Symbol"],
  ]},
};

/* ─── Tarot Deck Library ─── */
export interface TarotDeckDef {
  id: string;
  name: string;
  artist: string;
  year: string;
  tradition: "rws" | "thoth" | "marseille";
  description: string;
  styleId: "classic" | "vintage" | "dark" | "minimal";
}

export const TAROT_DECKS: TarotDeckDef[] = [
  { id: "rws", name: "Rider-Waite-Smith", artist: "Pamela Colman Smith", year: "1909", tradition: "rws", description: "The standard tarot. Every modern deck descends from this one.", styleId: "classic" },
  { id: "thoth", name: "Thoth Tarot", artist: "Aleister Crowley & Lady Frieda Harris", year: "1944", tradition: "thoth", description: "Thelemic masterwork of symbolic depth and astrological precision.", styleId: "dark" },
  { id: "marseille", name: "Ancient Tarot of Marseilles", artist: "Anonymous (Dormal-Petrus pattern)", year: "1760", tradition: "marseille", description: "The classic French pattern that shaped European cartomancy.", styleId: "vintage" },
  { id: "visconti", name: "Visconti-Sforza Tarot", artist: "Bonifacio Bembo", year: "1451", tradition: "marseille", description: "The oldest surviving tarot deck, painted for the Milanese nobility.", styleId: "vintage" },
  { id: "golden-dawn", name: "Golden Dawn Ritual Tarot", artist: "Pat Zalewski", year: "2006", tradition: "rws", description: "Based on original GD teaching manuscripts and Enochian correspondences.", styleId: "classic" },
  { id: "wild-unknown", name: "The Wild Unknown", artist: "Kim Krans", year: "2012", tradition: "rws", description: "Hand-drawn archetypes in a stark, elemental style.", styleId: "dark" },
  { id: "shadowscapes", name: "Shadowscapes Tarot", artist: "Stephanie Pui-Mun Law", year: "2010", tradition: "rws", description: "Watercolor dreamscapes blending folklore, fantasy, and fairy tales.", styleId: "classic" },
  { id: "modern-witch", name: "Modern Witch Tarot", artist: "Lisa Sterle", year: "2018", tradition: "rws", description: "Contemporary witch aesthetic with diverse representation and everyday magic.", styleId: "minimal" },
  { id: "light-seer", name: "Light Seer's Tarot", artist: "Chris-Anne", year: "2019", tradition: "rws", description: "Bright, optimistic artwork rooted in shadow work and self-discovery.", styleId: "classic" },
  { id: "ethereal-visions", name: "Ethereal Visions Illuminated Tarot", artist: "Matt Hughes", year: "2018", tradition: "rws", description: "Art Nouveau-inspired deck with gold foil accents.", styleId: "classic" },
  { id: "prisma-visions", name: "Prisma Visions Tarot", artist: "James R. Eads", year: "2015", tradition: "rws", description: "Dreamlike flowing imagery that connects each card through landscape.", styleId: "dark" },
  { id: "cosmic-tarot", name: "Cosmic Tarot", artist: "Norbert Lösche", year: "1988", tradition: "rws", description: "Cosmic and celestial themes with a soft painterly style.", styleId: "vintage" },
  { id: "haindl", name: "Haindl Tarot", artist: "Hermann Haindl", year: "1992", tradition: "rws", description: "Deeply esoteric with runes, I Ching, and Kabbalah woven into each card.", styleId: "dark" },
  { id: "osho-zen", name: "Osho Zen Tarot", artist: "Ma Deva Padma", year: "1994", tradition: "rws", description: "Zen-inflected deck focusing on the present moment rather than prediction.", styleId: "minimal" },
  { id: "motherpeace", name: "Motherpeace Tarot", artist: "Karen Vogel & Vicki Noble", year: "1979", tradition: "rws", description: "Round feminist tarot with goddess imagery and matriarchal symbolism.", styleId: "vintage" },
  { id: "deviant-moon", name: "Deviant Moon Tarot", artist: "Patrick Valenza", year: "2008", tradition: "rws", description: "Surreal distorted imagery that delves into the shadow self.", styleId: "dark" },
  { id: "tarot-divine", name: "Tarot of the Divine", artist: "Yoshi Yoshitani", year: "2019", tradition: "rws", description: "Fairy tales and myths from around the world as archetypal cards.", styleId: "classic" },
  { id: "true-black", name: "True Black Tarot", artist: "Arthur Wang", year: "2020", tradition: "rws", description: "Stark black-and-white minimalism with symbolic precision.", styleId: "dark" },
  { id: "lumina", name: "Lumina Tarot", artist: "Lauren Aletta", year: "2020", tradition: "rws", description: "Soft radiant watercolors focused on hope and healing.", styleId: "minimal" },
  { id: "druid-craft", name: "Druid Craft Tarot", artist: "Will Worthington & Philip Carr-Gomm", year: "2004", tradition: "rws", description: "Celtic druid tradition rooted in nature spirituality.", styleId: "vintage" },
  { id: "wildwood", name: "Wildwood Tarot", artist: "Mark Ryan & Will Worthington", year: "2011", tradition: "rws", description: "Pre-Celtic greenwood tradition set in the ancient Forest of Arden.", styleId: "vintage" },
  { id: "hermetic", name: "Hermetic Tarot", artist: "Godfrey Dowson", year: "1900", tradition: "rws", description: "Golden Dawn symbolism with Qabalistic correspondences on every card.", styleId: "dark" },
  { id: "victorian-romantic", name: "Victorian Romantic Tarot", artist: "Karen Mahony & Alex Ukolov", year: "2003", tradition: "rws", description: "Victorian Gothic romance with Pre-Raphaelite-inspired artwork.", styleId: "vintage" },
  { id: "mystic-mondays", name: "Mystic Mondays Tarot", artist: "Grace Duong", year: "2018", tradition: "rws", description: "Bold colorful modern design with clean iconography.", styleId: "minimal" },
  { id: "linestrider", name: "Linestrider Tarot", artist: "Siolo Thompson", year: "2014", tradition: "rws", description: "Delicate line art influenced by Golden Dawn symbolism.", styleId: "minimal" },
  { id: "star-spinner", name: "Star Spinner Tarot", artist: "Trungles", year: "2020", tradition: "rws", description: "Diverse inclusive deck with multiple Lovers cards to choose from.", styleId: "classic" },
  { id: "santa-muerte", name: "Santa Muerte Tarot", artist: "Fabrice Palou", year: "2019", tradition: "rws", description: "Mexican folk saint tradition with Day of the Dead aesthetic.", styleId: "dark" },
  { id: "zombie", name: "Zombie Tarot", artist: "Paul Kepple & Ralph Geroni", year: "2008", tradition: "rws", description: "Mid-century horror comic style with black humor and wit.", styleId: "minimal" },
  { id: "bohemian-gothic", name: "Bohemian Gothic Tarot", artist: "Alex Ukolov & Karen Mahony", year: "2007", tradition: "rws", description: "Dark Victorian Gothic with vampires, ghosts, and haunted beauty.", styleId: "dark" },
  { id: "anna-k", name: "Anna K Tarot", artist: "Anna K. Zinkeisen", year: "2008", tradition: "rws", description: "Expressive painterly style capturing real human emotion and gesture.", styleId: "classic" },
  { id: "holy-light", name: "Tarot of the Holy Light", artist: "Christine Payne Towler", year: "1989", tradition: "rws", description: "Mystical Christian and Hermetic blend with gilded details.", styleId: "vintage" },
  { id: "mystic-sea", name: "Navigators of the Mystic SEA Tarot", artist: "Julia M. B.", year: "2023", tradition: "rws", description: "Nautical and astronomical symbolism with esoteric anchors.", styleId: "classic" },
  { id: "hidden-realm", name: "Tarot of the Hidden Realm", artist: "C. L. Brown", year: "2021", tradition: "rws", description: "Fae and woodland realm hauntingly beautiful shadow work deck.", styleId: "dark" },
  { id: "golden-thread", name: "Golden Thread Tarot", artist: "Tina Gong", year: "2016", tradition: "rws", description: "Clean geometric design with gold foil and app integration.", styleId: "minimal" },
  { id: "waking-wild", name: "Waking the Wild Tarot", artist: "Lindsay Mack", year: "2023", tradition: "rws", description: "Gentle nature-based deck for healing and inner wisdom.", styleId: "minimal" },
];

/* ─── Thoth Tarot readings ─── */
const THOTH_READINGS: [string, string, string][] = [
  ["The Fool", "The fool leaps into the void without looking. Trust that the universe will hold you.", "Major Arcana. Thoth"],
  ["The Magician", "The wand of double power. Will made manifest through disciplined skill.", "Major Arcana. Thoth"],
  ["The High Priestess", "The veiled goddess of the stars. Intuition flows through the lunar veil.", "Major Arcana. Thoth"],
  ["The Empress", "The rose of the world. Nature pours her abundance through your open hands.", "Major Arcana. Thoth"],
  ["The Emperor", "The scepter of authority. Rule with the fire of the ram and the wisdom of the hawk.", "Major Arcana. Thoth"],
  ["The Hierophant", "Sacred law speaks through ritual. The mysteries reveal themselves to the patient.", "Major Arcana. Thoth"],
  ["The Lovers", "The alchemical wedding of opposites. Choose from the heart, not from the fear.", "Major Arcana. Thoth"],
  ["The Chariot", "The grail borne in triumph. Will harnessed to the stars drives all obstacles aside.", "Major Arcana. Thoth"],
  ["Adjustment", "The cosmic scales find their balance. Every act returns to meet you.", "Major Arcana. Thoth"],
  ["The Hermit", "The lamp in the darkness. Solitude reveals what crowds conceal.", "Major Arcana. Thoth"],
  ["The Wheel of Fortune", "The wheel turns. The sphinx guards the cycle. Change is the only constant.", "Major Arcana. Thoth"],
  ["Lust", "The serpent rises. Raw creative fire must be expressed or it consumes you.", "Major Arcana. Thoth"],
  ["The Hanged Man", "The drowned god suspended in the waters of initiation. Surrender opens vision.", "Major Arcana. Thoth"],
  ["Death", "The scorpion sheds its skin. Transformation is not destruction. Let the old dissolve.", "Major Arcana. Thoth"],
  ["Art", "The alchemical wedding of sun and moon. Brew your experience into wisdom.", "Major Arcana. Thoth"],
  ["The Devil", "The goat of Mendes. Your chains are your own shadow. Face it without flinching.", "Major Arcana. Thoth"],
  ["The Tower", "The lightning of truth strikes. False structures burn away to reveal the core.", "Major Arcana. Thoth"],
  ["The Star", "The goddess pours forth the waters of life. Healing and hope renew the spirit.", "Major Arcana. Thoth"],
  ["The Moon", "The twilight world between waking and dream. Walk the threshold without fear.", "Major Arcana. Thoth"],
  ["The Sun", "The sun of understanding returns. The child of light ascends in full glory.", "Major Arcana. Thoth"],
  ["The Aeon", "A new dispensation dawns. The child of the void awakens to cosmic consciousness.", "Major Arcana. Thoth"],
  ["The Universe", "The dance of Shiva. The great work is complete and instantly begins again.", "Major Arcana. Thoth"],
  ["Ace of Wands", "The root of fire. Pure creative spark. A surge of will that cannot be denied.", "Minor Arcana. Thoth Wands"],
  ["Two of Wands", "Fire meeting fire. Dominion and authority. You hold the power in this situation.", "Minor Arcana. Thoth Wands"],
  ["Three of Wands", "Established strength. The fire burns steady. Your foundation of power is secure.", "Minor Arcana. Thoth Wands"],
  ["Four of Wands", "Completion of the work. The fire has found its form. This is a time of resting strength.", "Minor Arcana. Thoth Wands"],
  ["Five of Wands", "Strife and competition. Fire lashes out. Choose your battles with care.", "Minor Arcana. Thoth Wands"],
  ["Six of Wands", "Victory. The fire rises triumphant. Recognition and reward for your efforts.", "Minor Arcana. Thoth Wands"],
  ["Seven of Wands", "Bravery in the face of opposition. The fire defends its ground.", "Minor Arcana. Thoth Wands"],
  ["Eight of Wands", "Swiftness. The fire moves like lightning. Rapid developments and clear direction.", "Minor Arcana. Thoth Wands"],
  ["Nine of Wands", "Strength under pressure. The fire endures. Your resilience has been forged.", "Minor Arcana. Thoth Wands"],
  ["Ten of Wands", "Oppression. The fire is smothered by weight. Release what drains your spirit.", "Minor Arcana. Thoth Wands"],
  ["Princess of Wands", "The earth of fire. Creative potential in its rawest form. A spark waiting to catch.", "Minor Arcana. Thoth Wands"],
  ["Prince of Wands", "The air of fire. Swift and intellectual. The visionary who acts on inspiration.", "Minor Arcana. Thoth Wands"],
  ["Queen of Wands", "The water of fire. The flame of the heart. Charisma that draws others to your light.", "Minor Arcana. Thoth Wands"],
  ["Knight of Wands", "The fire of fire. Pure will, pure action. The force that drives all transformation.", "Minor Arcana. Thoth Wands"],
  ["Ace of Cups", "The root of water. Love flows from the divine source. The heart opens without reservation.", "Minor Arcana. Thoth Cups"],
  ["Two of Cups", "Love meeting love. The reflection of hearts. Perfect harmony in relationship.", "Minor Arcana. Thoth Cups"],
  ["Three of Cups", "Abundance of the heart. Joy overflows. Celebrating the fullness of feeling.", "Minor Arcana. Thoth Cups"],
  ["Four of Cups", "Luxury and pleasure. The waters still and deepen. A time of emotional satisfaction.", "Minor Arcana. Thoth Cups"],
  ["Five of Cups", "Disappointment in love. The waters turn bitter. But some cups still remain.", "Minor Arcana. Thoth Cups"],
  ["Six of Cups", "Pleasure remembered. The waters hold memory. Nostalgia sweetens the present moment.", "Minor Arcana. Thoth Cups"],
  ["Seven of Cups", "Illusion and fantasy. The waters reflect wishes. Discern the real from the dreamed.", "Minor Arcana. Thoth Cups"],
  ["Eight of Cups", "Indolence. The waters grow still. A time of emotional retreat and quiet recovery.", "Minor Arcana. Thoth Cups"],
  ["Nine of Cups", "Happiness. The waters reflect contentment. The wish of the heart is fulfilled.", "Minor Arcana. Thoth Cups"],
  ["Ten of Cups", "Satiety. The waters overflow. Complete emotional fulfillment and lasting joy.", "Minor Arcana. Thoth Cups"],
  ["Princess of Cups", "The earth of water. Deep emotional sensitivity. A gentle intuitive presence.", "Minor Arcana. Thoth Cups"],
  ["Prince of Cups", "The air of water. The dreamer and romantic. Feelings expressed through imagination.", "Minor Arcana. Thoth Cups"],
  ["Queen of Cups", "The water of water. Pure emotional depth. The mother of the waters holds safe space.", "Minor Arcana. Thoth Cups"],
  ["Knight of Cups", "The fire of water. Passionate feeling. Love as transformation, love as living force.", "Minor Arcana. Thoth Cups"],
  ["Ace of Swords", "The root of air. The sword of truth cuts through all illusion. Clarity above all.", "Minor Arcana. Thoth Swords"],
  ["Two of Swords", "Peace restored. The swords find balance. A truce in the battlefield of the mind.", "Minor Arcana. Thoth Swords"],
  ["Three of Swords", "Sorrow. The sword brings grief. Tears are the price of honest perception.", "Minor Arcana. Thoth Swords"],
  ["Four of Swords", "Truce. The swords rest. A ceasefire in the inner war. Stop fighting yourself.", "Minor Arcana. Thoth Swords"],
  ["Five of Swords", "Defeat. The sword of intellect wounds. Pride arrives before a fall.", "Minor Arcana. Thoth Swords"],
  ["Six of Swords", "Science. The sword of reason cuts through emotion. Objectivity serves clarity.", "Minor Arcana. Thoth Swords"],
  ["Seven of Swords", "Futility. The sword of strategy. Plans collapse. Adapt or break.", "Minor Arcana. Thoth Swords"],
  ["Eight of Swords", "Interference. The sword of restriction. Limitations tighten their hold.", "Minor Arcana. Thoth Swords"],
  ["Nine of Swords", "Cruelty. The sword of despair. The darkest night of the soul descends.", "Minor Arcana. Thoth Swords"],
  ["Ten of Swords", "Ruin. The sword of finality. The end has come. Dawn follows the darkest hour.", "Minor Arcana. Thoth Swords"],
  ["Princess of Swords", "The earth of air. The intellect in service of creation. A sharp and curious mind.", "Minor Arcana. Thoth Swords"],
  ["Prince of Swords", "The air of air. The warrior of the mind. Pure intellectual force and reason.", "Minor Arcana. Thoth Swords"],
  ["Queen of Swords", "The water of air. The sword tempered by love. Wisdom that cuts with compassion.", "Minor Arcana. Thoth Swords"],
  ["Knight of Swords", "The fire of air. The fiery intellect. Ideas that burn and transform reality.", "Minor Arcana. Thoth Swords"],
  ["Ace of Disks", "The root of earth. The seed of all material possibility. Prosperity begins.", "Minor Arcana. Thoth Disks"],
  ["Two of Disks", "Harmony in duality. The balance of forces. Energies align for material success.", "Minor Arcana. Thoth Disks"],
  ["Three of Disks", "Work. Disciplined effort builds the foundation of future stability.", "Minor Arcana. Thoth Disks"],
  ["Four of Disks", "Power. The strength of the established order. What you have built is secure.", "Minor Arcana. Thoth Disks"],
  ["Five of Disks", "Worry. The earth cracks. Financial anxiety must be met with practical steps.", "Minor Arcana. Thoth Disks"],
  ["Six of Disks", "Success. The fruit of labor. Reward comes through sustained effort and generosity.", "Minor Arcana. Thoth Disks"],
  ["Seven of Disks", "Failure. A setback in material affairs. Not the end but a necessary lesson.", "Minor Arcana. Thoth Disks"],
  ["Eight of Disks", "Prudence. Careful and deliberate action. The slow steady approach wins.", "Minor Arcana. Thoth Disks"],
  ["Nine of Disks", "Gain. The harvest is abundant. Enjoy what you have earned.", "Minor Arcana. Thoth Disks"],
  ["Ten of Disks", "Wealth. The culmination of material success. Legacy established and enduring.", "Minor Arcana. Thoth Disks"],
  ["Princess of Disks", "The earth of earth. Practical magic. The manifestor of all that is solid and real.", "Minor Arcana. Thoth Disks"],
  ["Prince of Disks", "The air of earth. Methodical intelligence. The craftsman who studies to perfect.", "Minor Arcana. Thoth Disks"],
  ["Queen of Disks", "The water of earth. Nurturing abundance. The caretaker of all living things.", "Minor Arcana. Thoth Disks"],
  ["Knight of Disks", "The fire of earth. The slow and patient force. Endurance that moves mountains.", "Minor Arcana. Thoth Disks"],
];

/* ─── Marseille Tarot readings ─── */
const MARSEILLE_READINGS: [string, string, string][] = [
  ["Le Mat. The Fool", "A wandering soul steps into the unknown without a map. Trust that the path will appear beneath your feet.", "Major Arcana. Marseille"],
  ["Le Bateleur. The Magician", "The mountebank shows his tricks. All the tools of creation are on your table. Use them.", "Major Arcana. Marseille"],
  ["La Papesse. The High Priestess", "The veiled woman sits between two pillars. Knowledge hides behind the veil. Seek it in silence.", "Major Arcana. Marseille"],
  ["L'Impératrice. The Empress", "The crowned woman holds her shield. Fertility and abundance flow from her presence.", "Major Arcana. Marseille"],
  ["L'Empereur. The Emperor", "The emperor sits in judgment. Authority earned through experience. Command with the weight of time.", "Major Arcana. Marseille"],
  ["Le Pape. The Hierophant", "The pope blesses the faithful. Spiritual authority and orthodox wisdom guide the seeker.", "Major Arcana. Marseille"],
  ["L'Amoureux. The Lovers", "The lover stands between two women. A choice of the heart. Cupid's arrow finds its mark.", "Major Arcana. Marseille"],
  ["Le Chariot. The Chariot", "The hero rides in a triumphal carriage. Will and determination carry you through.", "Major Arcana. Marseille"],
  ["La Force. Strength", "A woman opens the lion's jaws. Gentleness overcomes raw power. True strength is quiet.", "Major Arcana. Marseille"],
  ["L'Ermite. The Hermit", "The old man carries a lantern. Step away from the crowd. Wisdom waits in solitude.", "Major Arcana. Marseille"],
  ["La Roue de Fortune. Wheel of Fortune", "The wheel turns with its three creatures. Fortune rises and falls. This moment will pass.", "Major Arcana. Marseille"],
  ["La Justice. Justice", "The scale and sword are balanced. Truth will out. What is due will arrive.", "Major Arcana. Marseille"],
  ["Le Pendu. The Hanged Man", "The traitor hangs by one foot. Nothing changes until you change your view.", "Major Arcana. Marseille"],
  ["La Mort. Death", "The skeleton reaps the field. The ground must be cleared before spring planting. Do not cling.", "Major Arcana. Marseille"],
  ["La Tempérance. Temperance", "A figure pours water between two cups. Moderation and patience blend extremes into gold.", "Major Arcana. Marseille"],
  ["Le Diable. The Devil", "The horned one rules the night. The chains you wear are the ones you accepted.", "Major Arcana. Marseille"],
  ["La Maison Dieu. The Tower", "The house of God struck by lightning. Pride falls. The structure you trusted comes down.", "Major Arcana. Marseille"],
  ["L'Étoile. The Star", "The naked woman pours water from two vessels. Hope pours into the wounded world.", "Major Arcana. Marseille"],
  ["La Lune. The Moon", "Two towers in the moonlight. The path of the soul through fear and fascination.", "Major Arcana. Marseille"],
  ["Le Soleil. The Sun", "Twin children beneath the sun. Joy and clarity are your birthright.", "Major Arcana. Marseille"],
  ["Le Jugement. Judgement", "The angel sounds the trumpet. The dead rise from their tombs. A calling awakens you.", "Major Arcana. Marseille"],
  ["Le Monde. The World", "The dancing figure within the wreath. Completion, integration, the great dance of life.", "Major Arcana. Marseille"],
  ["Ace of Batons", "A new venture rises from the ground. Take the first step without hesitation.", "Minor Arcana. Marseille Batons"],
  ["Two of Batons", "A choice between what is known and what could be. Look outward to the horizon.", "Minor Arcana. Marseille Batons"],
  ["Three of Batons", "Trade and enterprise. Your efforts reach beyond the horizon.", "Minor Arcana. Marseille Batons"],
  ["Four of Batons", "A resting place. The harvest is gathered. Celebrate the milestone.", "Minor Arcana. Marseille Batons"],
  ["Five of Batons", "Struggle and competition. The fight is not against others but for your own ground.", "Minor Arcana. Marseille Batons"],
  ["Six of Batons", "Victory confirmed. Your position is recognized by those who matter.", "Minor Arcana. Marseille Batons"],
  ["Seven of Batons", "Hold your ground against opposition. The strongest defense is conviction.", "Minor Arcana. Marseille Batons"],
  ["Eight of Batons", "Quick movement. News arrives. The pace of events accelerates suddenly.", "Minor Arcana. Marseille Batons"],
  ["Nine of Batons", "Strength tested. You have been through much. Rest is earned.", "Minor Arcana. Marseille Batons"],
  ["Ten of Batons", "The weight of responsibility. Too many burdens. Delegate or lay down what is not yours.", "Minor Arcana. Marseille Batons"],
  ["Valet of Batons", "A messenger with news. An honest and eager spirit carries tidings.", "Minor Arcana. Marseille Batons"],
  ["Cavalier of Batons", "The rider departs on his journey. Impetuous energy. Action without delay.", "Minor Arcana. Marseille Batons"],
  ["Reine of Batons", "A woman of confidence and warmth. She knows her worth and commands respect.", "Minor Arcana. Marseille Batons"],
  ["Roi of Batons", "A man of action and authority. His word carries weight. Natural leader.", "Minor Arcana. Marseille Batons"],
  ["Ace of Coupes", "The fountain of love. The heart overflows with grace and new feeling.", "Minor Arcana. Marseille Coupes"],
  ["Two of Coupes", "Two cups joined. Friendship, courtship, harmony of hearts.", "Minor Arcana. Marseille Coupes"],
  ["Three of Coupes", "Celebration and abundance. Joy shared among companions.", "Minor Arcana. Marseille Coupes"],
  ["Four of Coupes", "Discontent amid plenty. Look again at what you already hold.", "Minor Arcana. Marseille Coupes"],
  ["Five of Coupes", "Loss spills the cups. Grieve, but know that not everything is gone.", "Minor Arcana. Marseille Coupes"],
  ["Six of Coupes", "Memories of childhood. Innocence returns to soften the present.", "Minor Arcana. Marseille Coupes"],
  ["Seven of Coupes", "Fantasy and illusion. The heart can be deceived by its own desires.", "Minor Arcana. Marseille Coupes"],
  ["Eight of Coupes", "Turning from what no longer satisfies. The heart knows when to leave.", "Minor Arcana. Marseille Coupes"],
  ["Nine of Coupes", "Contentment. The heart is full. A wish realized brings quiet joy.", "Minor Arcana. Marseille Coupes"],
  ["Ten of Coupes", "Perfect harmony. Family, home, and lasting love complete the circle.", "Minor Arcana. Marseille Coupes"],
  ["Valet of Coupes", "A young messenger of love. A dreamer with an open heart.", "Minor Arcana. Marseille Coupes"],
  ["Cavalier of Coupes", "The knight rides with the cup. He follows his heart though it may lead him astray.", "Minor Arcana. Marseille Coupes"],
  ["Reine of Coupes", "A woman of deep feeling and gentle strength. She holds space for all who suffer.", "Minor Arcana. Marseille Coupes"],
  ["Roi of Coupes", "A man of patience and compassion. He rules through understanding not force.", "Minor Arcana. Marseille Coupes"],
  ["Ace of Épées", "The sword of truth. A sharp decision must be made.", "Minor Arcana. Marseille Épées"],
  ["Two of Épées", "A truce between opposing forces. Neither side can move. Bide your time.", "Minor Arcana. Marseille Épées"],
  ["Three of Épées", "A heart pierced by three swords. Sorrow arrives but it will not last forever.", "Minor Arcana. Marseille Épées"],
  ["Four of Épées", "Withdrawal and contemplation. The mind needs stillness to heal.", "Minor Arcana. Marseille Épées"],
  ["Five of Épées", "Conflict ends in hollow victory. Winning this fight may cost more than losing.", "Minor Arcana. Marseille Épées"],
  ["Six of Épées", "The ferry carries passengers to the far shore. A necessary passage awaits.", "Minor Arcana. Marseille Épées"],
  ["Seven of Épées", "Theft and deception. Someone acts in the shadows. Do not trust too quickly.", "Minor Arcana. Marseille Épées"],
  ["Eight of Épées", "The mind trapped in its own limitations. The prison is of your own making.", "Minor Arcana. Marseille Épées"],
  ["Nine of Épées", "Worry keeps you awake. The night is darkest before the dawn arrives.", "Minor Arcana. Marseille Épées"],
  ["Ten of Épées", "Laid low. The worst is over. Only one direction remains and it is up.", "Minor Arcana. Marseille Épées"],
  ["Valet of Épées", "A sharp-tongued messenger. Words that cut. Listen for the truth beneath the insult.", "Minor Arcana. Marseille Épées"],
  ["Cavalier of Épées", "The rider charges with sword drawn. Swift action driven by a clear mind.", "Minor Arcana. Marseille Épées"],
  ["Reine of Épées", "A woman of sharp intellect and clear sight. She sees through deception.", "Minor Arcana. Marseille Épées"],
  ["Roi of Épées", "A man of authority and justice. His judgment is final and fair.", "Minor Arcana. Marseille Épées"],
  ["Ace of Deniers", "A coin appears. Prosperity begins with a single step or a single coin.", "Minor Arcana. Marseille Deniers"],
  ["Two of Deniers", "The dance of give and take. Juggle your resources with attention and care.", "Minor Arcana. Marseille Deniers"],
  ["Three of Deniers", "Craftsmanship and honest work. Build well and your name will stand.", "Minor Arcana. Marseille Deniers"],
  ["Four of Deniers", "Possession held tight. Hoarding protects but also imprisons. Loosen your grip.", "Minor Arcana. Marseille Deniers"],
  ["Five of Deniers", "Poverty and exclusion. Help is available but you must ask for it.", "Minor Arcana. Marseille Deniers"],
  ["Six of Deniers", "Fair exchange. The scales of commerce are balanced. What you give returns.", "Minor Arcana. Marseille Deniers"],
  ["Seven of Deniers", "Patience in labor. The harvest is not yet ready but the soil is good.", "Minor Arcana. Marseille Deniers"],
  ["Eight of Deniers", "Diligence and apprenticeship. Steady work perfects the craft.", "Minor Arcana. Marseille Deniers"],
  ["Nine of Deniers", "Comfort and self-reliance. You have built a stable garden. Rest in it.", "Minor Arcana. Marseille Deniers"],
  ["Ten of Deniers", "Inheritance and legacy. The family line endures. What you build outlives you.", "Minor Arcana. Marseille Deniers"],
  ["Valet of Deniers", "A young student with a coin. The beginning of practical knowledge.", "Minor Arcana. Marseille Deniers"],
  ["Cavalier of Deniers", "The rider moves with steady purpose. Slow but unstoppable progress.", "Minor Arcana. Marseille Deniers"],
  ["Reine of Deniers", "A woman of substance and comfort. She provides for all who depend on her.", "Minor Arcana. Marseille Deniers"],
  ["Roi of Deniers", "A man of wealth and stability. His fortunes are built on years of honest work.", "Minor Arcana. Marseille Deniers"],
];

const DEFAULT_GLYPH = "✨";
const DEFAULT_READINGS: [string, string, string][] = [
  ["The Star", "Guidance appears. Look to the sky. the universe speaks.", "Sign"],
  ["The Crossroads", "A choice stands before you. Both paths lead to growth.", "Sign"],
  ["The Well", "Depth and reflection. Draw wisdom from within.", "Sign"],
  ["The Gate", "An opportunity opens. Step through with courage.", "Sign"],
  ["The Mirror", "Truth reflects back at you. See yourself clearly.", "Sign"],
  ["The Shield", "Protection surrounds you. You are safe.", "Sign"],
  ["The Flame", "Passion ignites. Your inner fire burns bright.", "Sign"],
  ["The Seed", "Potential waits. Nurture it with patience.", "Sign"],
  ["The River", "Flow with change. Resistance exhausts. surrender carries.", "Sign"],
  ["The Mountain", "A challenge rises. Climb with steady breath.", "Sign"],
];

/* ─── Spread definitions per system ─── */
const ALL_SPREADS: Record<string, SpreadDef[]> = {
  tarot: [
    { id: "single", name: "Single Card", description: "One card for daily guidance or a focused question", bestFor: "Daily guidance, quick insights, or a simple focal point for meditation", cardCount: 1, positions: ["The Message"], layout: "single" },
    { id: "three-card", name: "Three-Card", description: "Past · Present · Future. the classic timeline", bestFor: "Timeline questions, understanding how a situation evolves from one phase to the next", cardCount: 3, positions: ["Past", "Present", "Future"], layout: "line" },
    { id: "yes-no", name: "Yes / No", description: "Three cards. current situation, challenge, direction. for binary answers", bestFor: "Clear binary questions. should I, will they, is this path right", cardCount: 3, positions: ["Current Situation", "Challenge or Obstacle", "Likely Direction"], layout: "yes-no" },
    { id: "horseshoe", name: "Horseshoe", description: "7 cards. past, present, hidden forces, obstacles, environment, advice, outcome", bestFor: "Action-oriented questions. where am I blocked and what should I do about it", cardCount: 7, positions: ["Past", "Present", "Hidden Influences", "Obstacles", "External Influences", "Advice", "Outcome"], layout: "horseshoe" },
    { id: "celtic-cross", name: "Celtic Cross", description: "10 cards. the most comprehensive traditional spread", bestFor: "Deep exploration of complex situations. relationships, career, life crossroads", cardCount: 10, positions: [
      "Present Situation", "Challenge", "Foundation", "Recent Past", "Crown / Best Outcome",
      "Near Future", "Your Attitude", "External Influences", "Hopes & Fears", "Final Outcome"
    ], layout: "celtic-cross" },
  ],
  lenormand: [
    { id: "single", name: "Single Card", description: "One card for a direct answer", bestFor: "Quick yes/no reframe, daily guidance", cardCount: 1, positions: ["The Card"], layout: "single" },
    { id: "three-card", name: "Three-Card Line", description: "Past · Present · Future", bestFor: "Timeline questions, linear situations", cardCount: 3, positions: ["Past", "Present", "Future"], layout: "line" },
    { id: "yes-no", name: "Yes / No", description: "Three cards. current situation, challenge, direction", bestFor: "Clear binary questions", cardCount: 3, positions: ["Current Situation", "Challenge or Obstacle", "Likely Direction"], layout: "yes-no" },
    { id: "five-card", name: "Five-Card Line", description: "Present · Past · Future · Hopes · Outcome", bestFor: "Situations needing more nuance than a three-card line", cardCount: 5, positions: ["Present", "Past", "Future", "Hopes or Fears", "Outcome"], layout: "line" },
  ],
  playing_cards: [
    { id: "single", name: "Single Card", description: "One card for a quick answer", bestFor: "Quick guidance, daily card", cardCount: 1, positions: ["The Card"], layout: "single" },
    { id: "three-card", name: "Three-Card", description: "Past · Present · Future", bestFor: "Timeline or simple situation overview", cardCount: 3, positions: ["Past", "Present", "Future"], layout: "line" },
    { id: "yes-no", name: "Yes / No", description: "Three cards. current situation, challenge, direction", bestFor: "Binary questions", cardCount: 3, positions: ["Current Situation", "Challenge or Obstacle", "Likely Direction"], layout: "yes-no" },
  ],
  rune: [
    { id: "single", name: "Single Rune", description: "One rune for focused guidance", bestFor: "Focused guidance, a single insight", cardCount: 1, positions: ["The Rune"], layout: "single" },
    { id: "three-rune", name: "Three-Rune Cast", description: "Past · Present · Future", bestFor: "Timeline questions", cardCount: 3, positions: ["Past", "Present", "Future"], layout: "line" },
    { id: "yes-no", name: "Yes / No", description: "Three runes. situation, challenge, direction", bestFor: "Binary questions", cardCount: 3, positions: ["Current Situation", "Challenge or Obstacle", "Likely Direction"], layout: "yes-no" },
  ],
  iching: [
    { id: "single", name: "Single Hexagram", description: "One hexagram for deep insight", bestFor: "Deep philosophical questions, contemplative guidance", cardCount: 1, positions: ["The Hexagram"], layout: "single" },
  ],
  ogham: [
    { id: "single", name: "Single Ogham", description: "One sacred tree for guidance", bestFor: "Nature-connected guidance, seasonal questions", cardCount: 1, positions: ["The Stave"], layout: "single" },
    { id: "three-ogham", name: "Three-Stave Cast", description: "Past · Present · Future", bestFor: "Timeline questions", cardCount: 3, positions: ["Past", "Present", "Future"], layout: "line" },
  ],
  oracle_deck: [
    { id: "single", name: "Single Card", description: "One card for direct guidance", bestFor: "Direct, focused answers", cardCount: 1, positions: ["The Message"], layout: "single" },
    { id: "yes-no", name: "Yes / No", description: "Three cards. situation, challenge, direction", bestFor: "Binary questions", cardCount: 3, positions: ["Current Situation", "Challenge or Obstacle", "Likely Direction"], layout: "yes-no" },
  ],
  kipper: [
    { id: "single", name: "Single Card", description: "One card for focus", bestFor: "Focused insight", cardCount: 1, positions: ["The Card"], layout: "single" },
    { id: "yes-no", name: "Yes / No", description: "Three cards. situation, challenge, direction", bestFor: "Binary questions", cardCount: 3, positions: ["Current Situation", "Challenge or Obstacle", "Likely Direction"], layout: "yes-no" },
    { id: "five-card", name: "Five-Card", description: "You · Near Past · Near Future · Obstacle · Outcome", bestFor: "Situational depth with multiple factors", cardCount: 5, positions: ["You", "Near Past", "Near Future", "Obstacle", "Outcome"], layout: "line" },
  ],
  bone_throw: [
    { id: "three-bone", name: "Three-Bone Cast", description: "Foundation · Challenge · Guidance", bestFor: "Understanding foundations and what challenges them", cardCount: 3, positions: ["Foundation", "Challenge", "Guidance"], layout: "line" },
  ],
  dice_oracle: [
    { id: "single", name: "Single Throw", description: "One throw for direct answer", bestFor: "Quick yes/no reframe", cardCount: 1, positions: ["The Throw"], layout: "single" },
  ],
  domino: [
    { id: "single", name: "Single Tile", description: "One tile for guidance", bestFor: "Simple guidance", cardCount: 1, positions: ["The Tile"], layout: "single" },
  ],
  palm: [
    { id: "reading", name: "Palm Reading", description: "Primary features of the hand", bestFor: "Life overview, personality insight", cardCount: 1, positions: ["Primary Feature"], layout: "single" },
  ],
  face: [
    { id: "reading", name: "Face Reading", description: "Primary facial features", bestFor: "Character insight, self-understanding", cardCount: 1, positions: ["Primary Feature"], layout: "single" },
  ],
  coffee: [
    { id: "reading", name: "Cup Reading", description: "Symbols in the coffee grounds", bestFor: "Symbolic guidance", cardCount: 1, positions: ["Primary Symbol"], layout: "single" },
  ],
  tea: [
    { id: "reading", name: "Cup Reading", description: "Symbols in the tea leaves", bestFor: "Symbolic guidance", cardCount: 1, positions: ["Primary Symbol"], layout: "single" },
  ],
};

/* ─── Interpretation engine ─── */

/* ── Card display helper ── */
function cardBlock(el: SpreadElement): string {
  const lines: string[] = [];
  lines.push(`${el.title}${el.reversed ? " (Reversed)" : ""}${el.keywords ? ` \u2014 Keywords: ${el.keywords}` : ""}`);
  if (el.symbolism) lines.push(`  ${el.symbolism}`);
  return lines.join("\n");
}

/* ── Single Card ── */
function interpretSingle(el: SpreadElement, _systemId: string): string {
  return [cardBlock(el), "", el.meaning].join("\n");
}

/* ── Yes/No Spread ── */
function interpretYesNo(elements: SpreadElement[], _systemId: string): { text: string; verdict: { answer: "Yes" | "No" | "Mixed" | "Unclear"; explanation: string } } {
  const [situation, challenge, direction] = elements;
  const totalPolarity = elements.reduce((sum, el) => sum + getCardPolarity(el.title, el.reversed ?? false), 0);

  let answer: "Yes" | "No" | "Mixed" | "Unclear";
  if (totalPolarity >= 1.5) answer = "Yes";
  else if (totalPolarity <= -1.5) answer = "No";
  else if (Math.abs(totalPolarity) < 0.5) answer = "Unclear";
  else answer = "Mixed";

  const explanation = totalPolarity >= 1.5
    ? "The cards lean clearly toward yes. The positive energy outweighs the obstacles."
    : totalPolarity <= -1.5
    ? "The cards lean toward no. The resistance you feel is meaningful and should be taken seriously."
    : Math.abs(totalPolarity) < 0.5
    ? "The cards are evenly balanced. The answer is not fixed. Your choices will determine the outcome."
    : "The cards show a mixed picture. There is both support and resistance. The outcome depends on which energy you feed.";

  const parts: string[] = [];
  parts.push("Yes / No Spread" + "\n" + "═══════════════" + "\n");
  parts.push("Current Situation" + "\n" + cardBlock(situation) + "\n" + situation.meaning);
  parts.push("");
  parts.push("Challenge or Obstacle" + "\n" + cardBlock(challenge) + "\n" + challenge.meaning);
  parts.push("");
  parts.push("Likely Direction" + "\n" + cardBlock(direction) + "\n" + direction.meaning);
  parts.push("");
  parts.push(`Verdict: ${answer}`);
  parts.push(explanation);

  return { text: parts.join("\n"), verdict: { answer, explanation } };
}

/** Determine polarity for yes/no spreads */
function getCardPolarity(title: string, reversed: boolean): number {
  const t = title.toLowerCase();
  const strongYes = ["the sun", "the star", "the world", "the magician", "the empress", "six of wands", "nine of cups", "ace of cups", "ace of pentacles", "ten of cups", "the chariot", "ace of wands", "wheel of fortune", "judgement", "six of pentacles", "king of pentacles", "nine of pentacles"];
  const strongNo = ["the tower", "the hanged man", "the moon", "the devil", "five of cups", "ten of swords", "five of pentacles", "death", "five of wands", "seven of swords", "eight of swords", "nine of swords", "three of swords", "seven of pentacles"];
  if (strongYes.some((s) => t.startsWith(s) || t.includes(s))) return reversed ? -1 : 2;
  if (strongNo.some((s) => t.startsWith(s) || t.includes(s))) return reversed ? 1 : -2;
  if (t.includes("ace") || t.includes("page")) return reversed ? -0.5 : 1;
  if (t.includes("king") || t.includes("queen") || t.includes("knight")) return reversed ? -0.5 : 1;
  if (t.includes("two") || t.includes("three")) return reversed ? 0.5 : -0.5;
  return reversed ? -0.5 : 0.5;
}

/* ── Line Spread (3+ cards) ── */
function interpretLine(elements: SpreadElement[], _systemId: string): string {
  const parts: string[] = [];
  const title = elements.length <= 4 ? `${elements.length}-Card Spread` : `${elements.length}-Card Line Spread`;
  parts.push(title);
  parts.push("═".repeat(title.length));
  parts.push("");
  for (const el of elements) {
    parts.push(el.position);
    parts.push(cardBlock(el));
    parts.push(el.meaning);
    parts.push("");
  }
  return parts.join("\n");
}

/* ── Horseshoe (7 cards) ── */
function interpretHorseshoe(elements: SpreadElement[], _systemId: string): string {
  const parts: string[] = [];
  parts.push("Horseshoe Spread");
  parts.push("════════════════");
  parts.push("");
  const positions = ["Past", "Present", "Hidden Influences", "Obstacles", "External Influences", "Advice", "Outcome"];
  for (let i = 0; i < elements.length && i < positions.length; i++) {
    const el = elements[i];
    parts.push(positions[i]);
    parts.push(cardBlock(el));
    parts.push(el.meaning);
    parts.push("");
  }
  return parts.join("\n");
}

/* ── Celtic Cross (10 cards) ── */
function interpretCelticCross(elements: SpreadElement[], _systemId: string): string {
  const parts: string[] = [];
  parts.push("Celtic Cross Spread");
  parts.push("═════════════════════");
  parts.push("");
  const positions = [
    "Present Situation", "Challenge", "Foundation", "Recent Past",
    "Crown / Best Outcome", "Near Future", "Your Attitude",
    "External Influences", "Hopes & Fears", "Final Outcome",
  ];
  for (let i = 0; i < elements.length && i < positions.length; i++) {
    const el = elements[i];
    parts.push(positions[i]);
    parts.push(cardBlock(el));
    parts.push(el.meaning);
    parts.push("");
  }
  return parts.join("\n");
}

/* ── Main dispatch ── */
function interpretReading(elements: SpreadElement[], spreadName: string, systemId: string): string | { text: string; verdict: { answer: "Yes" | "No" | "Mixed" | "Unclear"; explanation: string } } {
  if (elements.length === 1) return interpretSingle(elements[0], systemId);
  if (spreadName.toLowerCase().includes("yes") || spreadName.toLowerCase().includes("no")) {
    return interpretYesNo(elements, systemId);
  }
  if (elements.length === 7) return interpretHorseshoe(elements, systemId);
  if (elements.length === 10) return interpretCelticCross(elements, systemId);
  return interpretLine(elements, systemId);
}

/* ─── Deck resolution ─── */

function getResolvedOracle(systemId: string, deckId?: string): OracleData {
  if (systemId !== "tarot") return ORACLES[systemId] ?? { glyph: "🃏", readings: DEFAULT_READINGS };
  if (!deckId) return ORACLES.tarot;
  const deck = TAROT_DECKS.find(d => d.id === deckId);
  if (!deck) return ORACLES.tarot;
  if (deck.tradition === "thoth") return { glyph: "🃏", readings: THOTH_READINGS };
  if (deck.tradition === "marseille") return { glyph: "🃏", readings: MARSEILLE_READINGS };
  return ORACLES.tarot;
}

export function getSystemDecks(systemId: string): TarotDeckDef[] | null {
  if (systemId === "tarot") return TAROT_DECKS;
  return null;
}

/* ─── Functions ─── */
export function getSpreads(systemId: string): SpreadDef[] {
  return ALL_SPREADS[systemId] ?? [
    { id: "single", name: "Single Draw", description: "One card for direct guidance", bestFor: "Simple guidance", cardCount: 1, positions: ["The Oracle"], layout: "single" },
  ];
}

export function getTraditionalReading(
  systemId: string,
  systemName: string,
  spreadId?: string,
  deckId?: string
): ReadingResult {
  const oracle = getResolvedOracle(systemId, deckId);
  const readings = oracle?.readings ?? DEFAULT_READINGS;
  const glyph = oracle?.glyph ?? DEFAULT_GLYPH;
  const spreads = getSpreads(systemId);
  const spread = spreads.find((s) => s.id === spreadId) ?? spreads[0];

  const drawn = pickN(readings, spread.cardCount);
  const elements: SpreadElement[] = drawn.map((r, i) => {
    const rev = Math.random() > 0.75;
    const cardInfo = systemId === "tarot" ? getMeaning(r[0], rev) : null;
    return {
      glyph,
      title: r[0],
      meaning: cardInfo ? cardInfo.meaning : r[1],
      position: spread.positions[i] ?? r[2],
      reversed: rev,
      polarity: getCardPolarity(r[0], rev),
      keywords: cardInfo ? cardInfo.keywords : undefined,
      symbolism: cardInfo ? cardInfo.symbolism : undefined,
    };
  });

  const raw = interpretReading(elements, spread.name, systemId);

  let interpretation: string;
  let verdict: ReadingResult["verdict"];

  if (typeof raw === "string") {
    interpretation = raw;
  } else {
    interpretation = raw.text;
    verdict = raw.verdict;
  }

  return {
    systemName,
    method: `Traditional ${systemName}`,
    spreadName: spread.name,
    elements,
    interpretation,
    verdict,
  };
}

export function getTraditionalDeck(systemId: string, deckId?: string): SpreadElement[] {
  const oracle = getResolvedOracle(systemId, deckId);
  if (!oracle) return [];
  return (oracle.readings ?? []).map(([title, meaning, position]) => {
    const cardInfo = systemId === "tarot" ? getMeaning(title, false) : null;
    return {
      glyph: oracle.glyph,
      title,
      meaning: cardInfo ? cardInfo.meaning : meaning,
      position,
      keywords: cardInfo ? cardInfo.keywords : undefined,
      symbolism: cardInfo ? cardInfo.symbolism : undefined,
    };
  });
}
