export type LenormandCardDef = {
  id: number;
  name: string;
  glyph: string;
  cardEquivalent: string;
  keywords: string[];
  meaning: string;
  reversedMeaning: string;
  symbolism: string;
  tradition: string;
  timing?: string;
  houseTheme?: string;
};

export const LENORMAND_CARDS: LenormandCardDef[] = [
  {
    id: 1,
    name: "The Rider",
    glyph: "🏇",
    cardEquivalent: "9♥",
    keywords: ["news", "arrival", "messenger", "movement", "speed", "delivery"],
    meaning: "The Rider brings news, messages, or a visitor. Always the first card in the deck, it signals something approaching. an arrival that is imminent but not yet present. This is active, forward movement: a letter, an announcement, someone coming to see you, or information arriving from a distance. The direction matters: if the Rider faces toward the other cards in a spread, the news comes toward the querent; if facing away, information departs or a visitor leaves. In a Grand Tableau, the Rider often indicates mail, emails, phone calls, or any form of communication that bridges distance. Paired with the Heart (24), it brings a love message. With the Coffin (8), news of illness or death. With the Ship (3), news from abroad. The Rider rarely indicates a specific person. it is the messenger itself, not the message. Its arrival is neutral; the neighboring cards color the nature of what comes. Speed is of the essence here: things develop quickly around this card.",
    reversedMeaning: "The Rider reversed indicates delayed news, a missed message, or an arrival that does not materialize. The messenger has been waylaid. If you expected information, it will be late. If you expected a person, they may cancel or reschedule. In a negative context, it can warn of unwanted news that you cannot avoid. The movement is blocked or frustrated.",
    symbolism: "A galloping horse and rider seen from the side, moving from left to right (toward the future). The rider carries no visible bag or letter. he IS the message. The horse's raised front legs indicate urgency.",
    tradition: "French (Petit Lenormand). card 1, the beginning of all readings. No modern deck omits this card.",
    timing: "Within days. Fast arrival. The Rider's suit (hearts) lands it in the emotional realm."
  },
  {
    id: 2,
    name: "The Clover",
    glyph: "🍀",
    cardEquivalent: "6♦",
    keywords: ["luck", "chance", "opportunity", "hope", "brief pleasure", "gamble"],
    meaning: "The Clover is the small fortune. a stroke of luck that brightens your path but does not last forever. It represents chance encounters, happy accidents, and the kind of opportunity that appears suddenly and must be seized quickly. This card tempers heavier cards around it: even in a difficult reading, the Clover promises a silver lining, a brief respite, or unexpected help from an unlikely source. It is the card of 'maybe'. not certainty, but possibility. In timing, the Clover is the shortest of all cards: what it signals will happen fast and pass fast. Paired with the Sun (31), it is extraordinary good fortune. With the Clouds (6), luck mixed with confusion. a gamble whose outcome is unclear. With the Cross (36), a burden lightened temporarily. The Clover is not deep transformation or lasting change; it is the wink of fate, a small gift, the green shoot that appears through cracked pavement.",
    reversedMeaning: "Bad luck, missed opportunity, a chance wasted. The clover has been uprooted. What could have been a fortunate moment passes you by. Misfortune of a minor kind. not catastrophic, but disappointing. A gamble that does not pay off. Bad timing.",
    symbolism: "A four-leaf clover growing from the ground, leaves spread like a cross. Occasionally shown with a hand reaching for it, indicating the need to grasp the opportunity.",
    tradition: "French/German. card 2, the small hope. The diamond suit ties it to material fortune.",
    timing: "Very short. days or weeks. Fleeting."
  },
  {
    id: 3,
    name: "The Ship",
    glyph: "⛵",
    cardEquivalent: "10♠",
    keywords: ["travel", "journey", "distance", "departure", "abroad", "commerce", "voyage"],
    meaning: "The Ship represents travel, movement across water, and everything foreign or distant. It is the card of leaving. whether a physical journey, a change of residence, or movement toward something new. In a business context, it indicates international commerce, import/export, or expansion into new markets. The Ship also carries the meaning of longing: desire for what is far away, nostalgia, or the call of adventure. Unlike the Rider (which brings things to you), the Ship carries you away. A Ship pointing toward other cards indicates travel toward what those cards represent. A Ship at the bottom of a spread suggests the journey is still distant; at the top, the journey is imminent. Paired with the Anchor (35), a journey connected to work or a move for stability. With the Heart (24), a romantic trip or long-distance relationship. With the Lilies (30), a peaceful retreat. With the Mountain (21), obstacles to travel. cancelled flights, blocked paths.",
    reversedMeaning: "Delayed or cancelled travel. A journey that does not happen. Unrest abroad, problems with foreign matters. Longing without fulfillment. In a work context, failed expansion or export troubles. The ship stays in port.",
    symbolism: "A three-masted sailing ship on calm water, sails full of wind. Sometimes shown with a lighthouse or coastline in the background. The ship always faces right (the future) in standard decks.",
    tradition: "French/German. card 3, the adventure. Spades suit gives it an element of fate and necessary movement.",
    timing: "Months or longer. The furthest-reaching time card in the deck."
  },
  {
    id: 4,
    name: "The House",
    glyph: "🏠",
    cardEquivalent: "K♥",
    keywords: ["home", "family", "stability", "foundation", "security", "domestic"],
    meaning: "The House is the center of your world. your home, your family, your foundation. It represents physical and emotional shelter: the place where you are safe, the people who share your blood or your roof, the structures that support your daily life. In a reading, the House anchors everything around it: it is the stable point from which other cards radiate. Matters related to real estate, household affairs, family dynamics, and domestic harmony fall under this card. The House can also refer to one's inner foundation. the sense of rootedness that allows growth elsewhere. Paired with the Garden (20), a community gathering or house party. With the Snake (7), conflict within the home or family secrets. With the Heart (24), domestic happiness and love at home. With the Mice (23), decay affecting the home. repairs needed, family tension eroding stability. The House is never negative on its own, but it absorbs the energy of surrounding cards: positive cards create domestic bliss, negative cards create household strife.",
    reversedMeaning: "Problems at home. domestic disputes, structural issues, household tension. Instability in one's living situation. Feeling unsafe or unwelcome in your own space. A home that needs repair, literally or emotionally. Family conflict.",
    symbolism: "A simple, sturdy house with a door, two windows, and a chimney with smoke. A tree or garden path often leads to the door. The house is a universal symbol of shelter and belonging.",
    tradition: "French/German. card 4, the home base. King of Hearts. the emotional ruler of the domestic realm.",
    timing: "Long-term. A year or more. The House represents permanent structures."
  },
  {
    id: 5,
    name: "The Tree",
    glyph: "🌳",
    cardEquivalent: "7♥",
    keywords: ["health", "growth", "roots", "ancestry", "vitality", "healing"],
    meaning: "The Tree represents health, growth, and the slow unfolding of life over time. It is the card of vitality. physical well-being, the body's natural rhythms, and the strength that comes from solid roots. In a reading, the Tree often becomes the health indicator: surrounding cards reveal the nature of one's physical state. But the Tree is also about ancestry and lineage: family roots, inherited traits, karmic patterns that run through generations. It grows slowly but deeply; what the Tree indicates has been building for a long time and will not change overnight. Paired with the Coffin (8), health concerns or the end of a cycle of growth. With the Sun (31), robust health and vitality. With the Stork (17), a change in health status (positive or negative depends on neighbors). With the Cross (36), a burden carried through the family line. The Tree tempers urgency: whatever it touches needs time, patience, and steady care. Its roots extend deep into the past, its branches reach toward the future. it connects what was, is, and will be.",
    reversedMeaning: "Illness, poor health, weakened vitality. A family pattern that needs healing. Roots that have become tangled or sick. Slow recovery from illness. Ancestral burdens rising to the surface. The tree is sick at its roots.",
    symbolism: "A large, leafy tree with visible roots spreading underground. The trunk is thick and gnarled with age. The crown is full and rounded. Some decks show fruit, indicating the harvest of one's health choices.",
    tradition: "French/German. card 5, the life force. 7 of Hearts. hearts tie it to emotional well-being as much as physical.",
    timing: "Slow, long-term. Months to years."
  },
  {
    id: 6,
    name: "The Clouds",
    glyph: "☁️",
    cardEquivalent: "K♣",
    keywords: ["confusion", "uncertainty", "doubt", "obscurity", "fog", "unclarity"],
    meaning: "The Clouds bring confusion, uncertainty, and lack of clarity. This is the only card in Lenormand that has a directional split: the dark side of the cloud faces one direction, the light side another. The side facing the neighboring cards indicates whether the confusion is clearing (light side toward the future) or is still thick (dark side toward the future). The Clouds represent a situation that is not yet fully visible. something hidden in fog, a matter where key information is being withheld or is simply not yet known. This is not deliberate deception (that is the Snake's domain) but genuine uncertainty: the situation has not yet clarified itself. Patience is required until the fog lifts. Paired with the Sun (31), the confusion will resolve into clarity. the sun burns away the clouds. With the Moon (32), emotional confusion or self-deception. With the Key (33), the answer exists but is not yet visible. With the Tower (19), isolation caused by misunderstanding or lack of communication. The Clouds never indicate a permanent state; fog always lifts. The question is when.",
    reversedMeaning: "The clouds are parting; clarity is returning. A confusing situation begins to make sense. Truth emerging from confusion. Reversed, the Clouds are actually more positive than upright. the worst of the fog is behind you.",
    symbolism: "A dark cumulus cloud covering most of the card, with one side darker (the shadow) and one side lighter (the break in clouds). Some decks show lightning within the cloud. Rarely, a small patch of blue sky is visible.",
    tradition: "French/German. card 6, the fog. King of Clubs. clubs tie it to mental/intellectual confusion.",
    timing: "Depends on neighboring cards. The fog will lift but the timing is itself unclear."
  },
  {
    id: 7,
    name: "The Snake",
    glyph: "🐍",
    cardEquivalent: "Q♣",
    keywords: ["deception", "betrayal", "lies", "cunning", "falsehood", "treachery"],
    meaning: "The Snake warns of deception, manipulation, and hidden agendas. Unlike the Clouds (honest confusion), the Snake represents deliberate falsehood: someone is not telling the truth, someone is working against you, someone cannot be trusted. The person indicated by the Snake is clever, subtle, and patient. they do not strike openly but wait for the right moment. The Snake can also represent a toxic person in your life: the friend who gossips, the partner who hides things, the colleague who undermines you. In a positive position surrounded by good cards, the Snake can indicate a cunning ally. someone whose cleverness works in your favor. But the default meaning is caution: trust slowly, verify everything, keep your cards close. Paired with the Fox (14), double deception. someone who pretends to help while harming. With the Ring (25), a dishonest commitment or marriage built on lies. With the Garden (20), social circle gossip or reputational damage. With the Cross (36), a heavy karmic betrayal. The Snake coils slowly, strikes fast.",
    reversedMeaning: "A deception has been or will be exposed. Someone's true nature comes to light. The liar is caught. The snake's venom has been milked. You are seeing through the manipulation. Warning still stands, but you are on to them.",
    symbolism: "A large snake coiled on the ground, head raised and tongue flicking. Some decks show the snake among grass or flowers, emphasizing its camouflage. danger hidden in beauty.",
    tradition: "French/German. card 7, the deceiver. Queen of Clubs. a clever, intellectual woman who uses words as weapons.",
    timing: "The deception is already in motion. The snake has already struck or is about to. Timing depends on neighbors."
  },
  {
    id: 8,
    name: "The Coffin",
    glyph: "⚰️",
    cardEquivalent: "9♦",
    keywords: ["ending", "illness", "transformation", "grief", "closure", "death"],
    meaning: "The Coffin is one of the most feared cards in Lenormand, but its meaning is often misunderstood. It rarely indicates physical death. instead, it represents endings, closures, and the necessary death of something so that something new can live. A relationship ends, a job finishes, a phase of life closes. The Coffin carries grief. the natural sorrow that comes with letting go. but it also carries the promise of transformation. Nothing stays in the grave forever. In the Grand Tableau, the Coffin often marks the area of the spread that holds the greatest challenge but also the greatest potential for change. Paired with the Tree (5), genuine health concerns or a long recovery. With the Sun (31), a transformation that leads to happiness. With the Stork (17), an ending that leads to positive change. With the Garden (20), the end of a social connection or a funeral. The Coffin is the card of the necessary end. the thing you must release before you can receive what comes next.",
    reversedMeaning: "Avoidance of necessary endings. A situation that should have ended continues past its natural term. Stagnation from refusing to let go. Resurrection. something thought dead returns. Reversed, the Coffin can be more positive: what was buried comes back to life.",
    symbolism: "A wooden coffin, sometimes closed and draped, sometimes with the lid partially open. A skull may rest on top. Dark earth or grave dirt surrounds it. The card is somber and heavy in its imagery.",
    tradition: "French/German. card 8, the great ending. 9 of Diamonds. diamonds tie it to material endings (job, money, possessions).",
    timing: "An ending is near. within weeks to months. The timing of grief follows its own schedule."
  },
  {
    id: 9,
    name: "The Bouquet",
    glyph: "💐",
    cardEquivalent: "Q♠",
    keywords: ["gift", "invitation", "beauty", "pleasure", "grace", "social offer"],
    meaning: "The Bouquet is one of the most positive cards in the deck. It represents gifts, invitations, social pleasures, and the beautiful aspects of life. A gift is coming. not necessarily material (though it can be), but more often an offering of friendship, an invitation to an event, a compliment, or a gesture of appreciation. The Bouquet is the card of grace: things come to you without effort, doors open, people want to welcome you. It represents the social lubricant that makes life pleasant. parties, dates, gatherings, and the exchange of goodwill. In a professional context, the Bouquet indicates a job offer, a commission, or a creative opportunity. Paired with the Heart (24), a love invitation. a date, a proposal, a romantic gesture. With the Ring (25), a marriage proposal or engagement gift. With the Lilies (30), a refined, elegant offering. With the Ship (3), a gift arriving from abroad or an invitation to travel. The Bouquet never brings bad news; it sweetens every card it touches.",
    reversedMeaning: "A declined invitation. A gift refused or not given. Social rejection. A missed social opportunity. Beauty that fades before it can be enjoyed. The bouquet wilts before it is received. Temporarily unlucky in social matters.",
    symbolism: "A bouquet of flowers in a vase or wrapped in paper. Often roses, tulips, or mixed wildflowers. The arrangement is pleasing, the colors warm. an offering of beauty and goodwill.",
    tradition: "French/German. card 9, the gift. Queen of Spades. spades connect to fate, but the Queen softens it into grace.",
    timing: "Soon. within days to weeks. The Bouquet is quick to arrive."
  },
  {
    id: 10,
    name: "The Scythe",
    glyph: "🔪",
    cardEquivalent: "J♦",
    keywords: ["sudden change", "cutting", "risk", "accident", "separation", "sharp decision"],
    meaning: "The Scythe is the card of sudden, sharp, and irreversible change. It cuts swiftly and decisively. a surgery, a sudden breakup, an accident, a job loss, a revelation that changes everything in an instant. The Scythe carries danger: it is the blade that reaps without asking permission. When this card appears, whatever it touches will change abruptly and cannot be undone. There is no slow transition with the Scythe. only the clean cut between before and after. Its position in the spread is critical: the Scythe cuts through whatever card it points toward (the direction it faces matters enormously). Paired with the Heart (24), a sudden end to a relationship. a breakup that comes out of nowhere. With the Ring (25), a sudden divorce or contract cancellation. With the Ship (3), a sudden journey (possibly emergency travel). With the Coffin (8), surgery, sudden death, or catastrophic ending. With the Garden (20), a public scandal or sudden social expulsion. The Scythe demands respect: it is the most dangerous card in the deck by nature of its speed and finality.",
    reversedMeaning: "A sudden cut that is avoided at the last moment. An accident that nearly happens. A divorce that is called off. Danger averted, but the scare is real. Reversed, the Scythe's edge is less sharp, but the warning remains. you dodged it this time.",
    symbolism: "A farmer's scythe, blade prominent and curved, handle long and wooden. Some decks show the scythe in mid-swing or leaning against a tree. The blade always points toward something.",
    tradition: "French/German. card 10, the cutter. Jack of Diamonds. a young person bringing material disruption.",
    timing: "Instant. The Scythe is the fastest card in the deck. what it signals happens without warning."
  },
  {
    id: 11,
    name: "The Whip",
    glyph: "🪓",
    cardEquivalent: "J♣",
    keywords: ["conflict", "arguments", "repetition", "discipline", "passion", "intensity"],
    meaning: "The Whip represents conflict, arguments, and the kind of heated exchange that leaves marks. It is the card of friction. disagreements, power struggles, and situations that generate heat through opposition. In relationships, the Whip indicates passionate arguments that may either clear the air or escalate into lasting damage. The Whip also carries the meaning of repetition: cycles of behavior that repeat until the pattern is broken. The same fight, the same mistake, the same lesson coming around again until you learn it. In a more measured context, the Whip can represent discipline and self-mastery. the crack of the will over the reluctant self. It is forceful, direct, and uncomfortable. Paired with the Heart (24), a passionate but volatile relationship. intense love and intense fights. With the Snake (7), verbal warfare with hidden agendas. accusations and counter-accusations. With the Bear (15), a conflict with authority. With the Cross (36), a karmic punishment or a burden that is enforced through discipline. The Whip rarely lies. what it shows is raw, unfiltered conflict that demands resolution.",
    reversedMeaning: "Conflict that is subsiding. An argument that ends. Abuse or punishment that stops. The worst of the fighting is over. Caution against reopening old wounds. Domestic peace returning after a storm.",
    symbolism: "A multi-threaded whip or a bundle of birch rods (fasces), sometimes with a handle. In earlier decks, a horse whip or riding crop. The instrument of correction.",
    tradition: "French/German. card 11, the conflict. Jack of Clubs. a young, argumentative, or passionate personality.",
    timing: "Ongoing. The Whip indicates patterns that repeat until resolved."
  },
  {
    id: 12,
    name: "The Birds",
    glyph: "🐦",
    cardEquivalent: "7♦",
    keywords: ["communication", "gossip", "conversation", "chat", "worry", "nervousness"],
    meaning: "The Birds represent communication, conversation, and the constant mental chatter of daily life. This is the card of phone calls, texts, meetings, gossip, and the exchange of ideas. But the Birds also carry a note of anxiety: they flutter, they worry, they cannot settle. A question surrounded by Birds is one that is being overthought. discussed with too many people, analyzed from too many angles. The Birds can indicate a conversation that needs to happen but hasn't yet, or gossip that is circling about you. Unlike the Rider (which brings a specific message) or the Letter (a document), the Birds are informal, casual communication. the buzz of social interaction. In a relationship context, the Birds can indicate a couple that talks well together or one that nags and bickers (depending on surrounding cards). Paired with the Heart (24), a love conversation or declaration. With the Fox (14), clever talk. someone is trying to talk you into something. With the Clouds (6), confused communication. mixed messages, crossed lines. With the Tower (19), gossip in the workplace or isolation caused by miscommunication.",
    reversedMeaning: "Miscommunication, crossed lines, a message not received. Gossip that damages. A conversation that needs to happen but is avoided. Nervousness that interferes with clear expression. The birds are overheard but not understood.",
    symbolism: "Two birds perched on a branch or a fence, facing each other as if in conversation. Sometimes shown mid-flight. The pair suggests dialogue between two parties.",
    tradition: "French/German. card 12, the talkers. In some traditions called 'The Owls' (night birds of worry). 7 of Diamonds. material matters discussed.",
    timing: "Short-term. days to weeks. Conversations happen quickly."
  },
  {
    id: 13,
    name: "The Child",
    glyph: "👶",
    cardEquivalent: "J♠",
    keywords: ["new beginning", "innocence", "youth", "trust", "birth", "naivety"],
    meaning: "The Child represents new beginnings, fresh starts, and the innocence of something that has not yet been marked by experience. A new project, a new relationship, a new phase of life. all begin with the energy of the Child: open, trusting, full of potential but lacking history. The Child is not yet fully formed; it can grow in any direction depending on the cards around it. This card also carries literal meanings: a pregnancy, a birth, or a young person in the querent's life. In timing, the Child indicates something early in its development. do not expect maturity or completion yet. This is the seedling stage. Paired with the Bouquet (9), a birth or baby shower. With the Heart (24), a new love. fresh, uncomplicated, full of hope. With the Ring (25), a new commitment (young engagement, new contract). With the Stork (17), a birth or a new phase that brings change. With the Rider (1), news of a birth or a new beginning announced. The Child does not carry cynicism or caution; it trusts purely. That is its strength and its vulnerability.",
    reversedMeaning: "Immaturity, stunted growth, a new beginning that fails to launch. Trust that is betrayed. A child or young person causing concern. The new project falters at the starting line. Naivety that leads to harm.",
    symbolism: "A small child standing or toddling, often reaching toward something. The child may be holding a toy or simply standing with arms open. The image is innocent, uncomplicated, hopeful.",
    tradition: "French/German. card 13, the beginner. Jack of Spades. spades give the child a touch of fate; this new beginning is significant.",
    timing: "Short to medium-term. The beginning is now; the full development takes time."
  },
  {
    id: 14,
    name: "The Fox",
    glyph: "🦊",
    cardEquivalent: "9♣",
    keywords: ["cunning", "work", "caution", "trickery", "manipulation", "survival"],
    meaning: "The Fox is the card of cunning, cleverness, and survival instinct. It represents a person who uses their wits to get ahead. sometimes legitimately, sometimes at others' expense. The Fox is the coworker who takes credit for your ideas, the friend who gives advice that serves their own interests, the deal that seems too good to be true. This card demands that you stay sharp: someone around you is not operating with pure intentions, or perhaps you yourself are being too calculating. The Fox also carries a strong work meaning: the daily grind, employment, the hustle required to survive. In this sense, it is neutral. the Fox works hard because it must. The direction of its gaze matters: a Fox looking toward other cards indicates caution regarding those areas of life. Paired with the Snake (7), a dangerously cunning person. clever and dishonest. With the Bear (15), workplace power dynamics. a cunning authority figure or a battle for promotion. With the Heart (24), a relationship where one person is not being straight. With the Garden (20), professional networking with hidden agendas. Trust the Fox less than it asks to be trusted.",
    reversedMeaning: "Guardedness that becomes paranoia. Cunning used against the wrong person. The trickster is caught in their own trap. Overwork leading to burnout. The fox is outfoxed. Your own cleverness works against you.",
    symbolism: "A fox standing alert, often looking back over its shoulder. Its brush (tail) is prominent. In some decks, it holds a prize or stands near a henhouse. the predator near its prey.",
    tradition: "French/German. card 14, the trickster. 9 of Clubs. clubs tie it to the intellectual/work domain.",
    timing: "Ongoing. The Fox works steadily and watches constantly. Timing depends on its goal."
  },
  {
    id: 15,
    name: "The Bear",
    glyph: "🐻",
    cardEquivalent: "10♣",
    keywords: ["power", "strength", "authority", "protection", "leadership", "influence"],
    meaning: "The Bear represents power, strength, and authority. It can be a person in a position of power (a boss, a parent, a government figure), or it can represent your own inner strength and capacity to lead. The Bear is protective of its territory and its charges. when this card appears, you are either being protected or you need to step into a protective role yourself. The Bear can also indicate something large and lumbering: a large organization, a slow-moving bureaucracy, or a situation that has mass and inertia. It is not fast or subtle (that is the Fox), but it is undeniable. The Bear's size means its impact is felt. Paired with the Fox (14), workplace authority. a boss and a cunning subordinate; a power struggle. With the Tower (19), institutional authority. government, large corporation. With the Fish (34), financial power. a wealthy person or a large sum of money. With the Mice (23), the erosion of power. authority that is being undermined. The Bear rarely lies, but its size makes it dangerous if angered. Respect the power dynamics this card reveals.",
    reversedMeaning: "Authority abused. A bully in power. Powerlessness. your strength has been taken or undermined. An overbearing person who dominates others. A leader who is not worthy of their position. The bear is sick or enraged.",
    symbolism: "A large brown bear standing on all fours or reared up. Its mass fills the card. The bear is neither smiling nor aggressive. simply present, which is enough to command attention.",
    tradition: "French/German. card 15, the authority. 10 of Clubs. clubs tie it to professional/intellectual power.",
    timing: "Slow to medium. Large things move at their own pace. The Bear's timing is deliberate."
  },
  {
    id: 16,
    name: "The Stars",
    glyph: "⭐",
    cardEquivalent: "6♥",
    keywords: ["guidance", "destiny", "inspiration", "hope", "spiritual path", "clarity"],
    meaning: "The Stars represent inspiration, guidance, and the sense that one is following their true path. This is the card of destiny. not the small luck of the Clover, but the deep knowing that you are where you are meant to be. The Stars shine above, providing direction even in darkness. When this card appears, trust your intuition: you have an inner compass that knows the way, even if the road ahead is not fully visible. The Stars also carry a creative meaning. artistic inspiration, visionary ideas, moments of profound insight. In a practical sense, the Stars indicate that the timing is right: the cosmos align with your intentions. Paired with the Heart (24), a destined love. soulmate energy. With the Sun (31), extraordinary clarity and success. a bright path ahead. With the Moon (32), spiritual or intuitive guidance that blends emotion with higher purpose. With the Moon (32) and Sun (31) together, a powerful spiritual cycle. With the Tower (19), a spiritual community or a period of inspired solitude. The Stars are never negative: they may be obscured by clouds, but they never go out.",
    reversedMeaning: "Lost direction. Disconnection from your purpose. Inspiration that has dried up. A period of spiritual confusion where the path is unclear. The stars are hidden by clouds but still there. you need to wait for them to reappear.",
    symbolism: "A starry sky with one large central star (often eight-pointed) surrounded by smaller stars. Sometimes a woman or figure points upward toward the stars. The light radiates downward.",
    tradition: "French/German. card 16, the guide. 6 of Hearts. hearts tie it to the emotional-spiritual realm. A deeply positive card.",
    timing: "The guidance is available now. The fulfillment of the destiny it signals unfolds over the long term."
  },
  {
    id: 17,
    name: "The Stork",
    glyph: "🕊️",
    cardEquivalent: "Q♥",
    keywords: ["change", "transformation", "new direction", "migration", "movement"],
    meaning: "The Stork represents change that is natural, necessary, and ultimately positive. Unlike the sudden cut of the Scythe, the Stork's change is awaited and anticipated. a migration, a relocation, a promotion, a new baby. The Stork builds its nest high up, bringing new life and fresh perspective. This card signals that a change is coming, and while all change carries uncertainty, the Stork's change is aligned with the natural order. It is time to move, to shift, to adapt. The Stork does not ask whether you are ready; the season has turned and migration is non-negotiable. Paired with the House (4), a move to a new home. With the Ship (3), a long-distance move or relocation abroad. With the Child (13), a pregnancy or the birth of a new project. With the Ring (25), a change in relationship status. marriage or divorce. With the Heart (24), a change of heart or a new emotional direction. The Stork bridges the old and the new: what you leave behind is real, but what awaits is where you need to be.",
    reversedMeaning: "Change that is resisted or delayed. An expected change does not happen. A move that falls through. You want things to shift but circumstances keep you in place. The stork cannot find a place to land. Stagnation that frustrates.",
    symbolism: "A white stork standing on one leg, often with a nest and babies on a chimney top. The stork is a migratory bird. always moving between homes. Its arrival signals seasonal change.",
    tradition: "French/German. card 17, the transformer. Queen of Hearts. a nurturing, emotional change. One of the most positive change cards.",
    timing: "The change is coming soon. within weeks to a few months. The season is turning."
  },
  {
    id: 18,
    name: "The Dog",
    glyph: "🐕",
    cardEquivalent: "10♥",
    keywords: ["loyalty", "friendship", "faithfulness", "trust", "companion", "devotion"],
    meaning: "The Dog represents loyalty, friendship, and the people you can truly count on. This is the card of the faithful companion. the friend who shows up, the partner who stays, the ally who does not waver. In a reading, the Dog can indicate a specific person: a loyal friend, a devoted partner, a reliable colleague. It can also represent your own capacity for loyalty and what you are willing to stand by. The Dog's devotion is not blind. it is earned and returned. This card asks: who in your life has proven their loyalty? And to whom are you loyal in return? Paired with the Heart (24), a deeply faithful love. the partner who stays through anything. With the House (4), family loyalty or a pet that is part of the family. With the Bear (15), a loyal protector or a mentor who supports you. With the Tower (19), a loyal colleague or the isolation that comes when loyalty is not returned. The Dog is a positive card but warns against misplaced loyalty: if surrounded by the Snake (7) or Fox (14), question whether your trust is earned.",
    reversedMeaning: "Betrayal by a friend. Disloyalty. A trust that is broken. A relationship where loyalty is one-sided. A false friend. The dog bites the hand that feeds. Someone you counted on lets you down.",
    symbolism: "A dog, often a spaniel or hunting breed, sitting at attention or following a path. Its posture is alert and loyal. Sometimes shown with a collar, indicating belonging and domestication.",
    tradition: "French/German. card 18, the faithful. 10 of Hearts. hearts in the tenth position: the fullness of emotional loyalty.",
    timing: "Long-term. True loyalty is measured in years, not weeks."
  },
  {
    id: 19,
    name: "The Tower",
    glyph: "🏛️",
    cardEquivalent: "6♠",
    keywords: ["isolation", "solitude", "authority", "institution", "separation", "structure"],
    meaning: "The Tower represents solitude, isolation, and the structures that separate us from others. It can be a physical place. a tall building, an institution, a prison, a hospital. or a state of being: loneliness, separation, the cold dignity of standing alone. The Tower is also the card of established authority: governments, corporations, systems that are larger than any individual. When this card appears, you may be dealing with an institution (bank, court, school, hospital) or experiencing a period where you must stand alone. Unlike the House (which is warm and personal), the Tower is impersonal and imposing. Its height gives perspective but also distance. Paired with the Heart (24), a love that is distant or cold. a long-distance relationship, emotional walls. With the Garden (20), a public institution or a formal gathering. With the Moon (32), emotional isolation or depression. With the Sun (31), a solitary achievement or recognition from an institution. The Tower is not inherently negative, but it is always about boundaries: where are they needed, and where have they become prison walls?",
    reversedMeaning: "Institutional oppression or confinement. A prison (literal or metaphorical). Feeling trapped by a system. A breakdown of communication with authority. The tower is collapsing. an institution fails or a rigid structure breaks down.",
    symbolism: "A tall stone tower, often with a single window or battlement at the top. The tower stands alone on the landscape. no other structures nearby. It is solid, cold, and permanent.",
    tradition: "French/German. card 19, the solitary. 6 of Spades. spades tie it to fate and separation.",
    timing: "Long-term. Institutions move slowly. Solitude, once established, is not quickly broken."
  },
  {
    id: 20,
    name: "The Garden",
    glyph: "🌿",
    cardEquivalent: "8♠",
    keywords: ["social", "public", "gathering", "community", "networking", "audience"],
    meaning: "The Garden represents social life, public spaces, and interactions with groups of people. It is the card of community, networking, and being seen. Unlike the domestic warmth of the House (4), the Garden is the public sphere: parties, conferences, social gatherings, online communities, any place where people meet as equals. The Garden carries an energy of openness and exchange. ideas, introductions, relationships formed in public settings. This is a card of reception: you are either hosting, attending, or being received by a group. Its position in the spread reveals whether the public aspect of your life is flourishing or needs attention. Paired with the Heart (24), a social romance. meeting someone through friends or at an event. With the Ring (25), a public commitment. a wedding, a public contract, a launch event. With the Tower (19), a formal institution with a public face. a conference, a gala, a ceremony. With the Bouquet (9), a social invitation. The Garden is moderately positive on its own; its quality depends heavily on neighboring cards.",
    reversedMeaning: "Public humiliation or embarrassment. A social gathering that goes wrong. Exclusion from a group. Isolation when you want community. A party you are not invited to. Being ignored or overlooked in a social context.",
    symbolism: "A walled garden with trees, flowers, and paths. People may be visible walking or sitting. The space is cultivated, orderly. nature shaped for human pleasure and social gathering.",
    tradition: "French/German. card 20, the public. 8 of Spades. spades connect it to social fate; the group's destiny interacts with yours.",
    timing: "Scheduled events. The Garden's timing follows social calendars. weeks to months."
  },
  {
    id: 21,
    name: "The Mountain",
    glyph: "⛰️",
    cardEquivalent: "8♣",
    keywords: ["obstacle", "block", "challenge", "delay", "struggle", "resistance"],
    meaning: "The Mountain represents an obstacle, a block, or a significant challenge that must be overcome. But in Lenormand, the Mountain is not permanent. it is a barrier that can be climbed, tunneled through, or walked around with the right strategy. The block may be external (a person blocking your path, a bureaucracy, a competitor) or internal (fear, doubt, a limiting belief). The Mountain does not tell you to give up; it tells you that the path forward requires more effort than you anticipated. The steepness of the climb depends on what surrounds the Mountain. Paired with the Ship (3), a journey blocked. travel difficulties, visa problems. With the Scythe (10), a sudden obstacle that cuts across your plans. With the Key (33), the solution exists but requires effort to reach. the key unlocks the mountain's passage. With the Cross (36), a heavy burden or karmic obstacle. the weight is significant. With the Garden (20), social obstacles. competition, gatekeeping, or being blocked from a group. The Mountain does not move; you must move around it or through it.",
    reversedMeaning: "An obstacle is being overcome. The climb is underway. The block is dissolving. Persistence pays off. The mountain is being scaled. Reversed is more positive than upright. the hardest part is behind you.",
    symbolism: "A large, steep mountain filling most of the card. A single path may wind up its side. The peak is capped with snow or rock. The scale makes human effort seem small.",
    tradition: "French/German. card 21, the blocker. 8 of Clubs. clubs tie it to intellectual/professional barriers.",
    timing: "Slow. Obstacles take time to overcome. The Mountain delays everything around it."
  },
  {
    id: 22,
    name: "The Crossroads",
    glyph: "🔀",
    cardEquivalent: "Q♦",
    keywords: ["choice", "decision", "options", "crossroads", "divergent paths", "free will"],
    meaning: "The Crossroads represents a significant decision or a point in life where paths diverge. A choice must be made, and the direction you choose will affect everything that follows. Unlike the Mountain (where the obstacle is external), the Crossroads is about internal choice: you have options, and none is obviously right or wrong. The card asks you to weigh your options carefully, to consider not just where each path leads but what you leave behind. The Crossroads can also indicate both possibilities being open. you have not yet closed any door, but you must soon. In timing, the Crossroads suggests a decision point is imminent. Paired with the Heart (24), a choice in love. between two people, or whether to commit. With the Ship (3), a choice about travel or relocation. With the Birds (12), a decision that requires discussion. do not decide alone. With the Clover (2), a lucky choice. one path carries unexpected fortune. The Crossroads carries the full weight of human freedom: you cannot avoid choosing, because not choosing is itself a choice.",
    reversedMeaning: "A wrong turn has been taken. Regret about a past decision. Indecision that paralyzes. Fear of making the wrong choice leads to making no choice. The path you took was not the right one. The crossroads reversed is the moment after a mistake, when you realize you must turn back.",
    symbolism: "Two or three paths meeting at a central point, often with a signpost pointing in different directions. The paths lead into different landscapes. A traveler stands at the junction, facing the decision.",
    tradition: "French/German. card 22, the decider. Queen of Diamonds. a practical woman facing a material decision.",
    timing: "The decision is imminent. within days to weeks. The consequences unfold over the long term."
  },
  {
    id: 23,
    name: "The Mice",
    glyph: "🐭",
    cardEquivalent: "7♣",
    keywords: ["loss", "decay", "theft", "anxiety", "erosion", "what consumes"],
    meaning: "The Mice represent loss, decay, and the slow erosion of what was once solid. This is not the dramatic cut of the Scythe but the quiet, persistent nibbling away at something until it crumbles. A small leak that becomes a flood, a habit that drains your finances, a relationship that slowly sours through neglect. The Mice are anxiety. the worries that gnaw at you in the night, the stress that eats away at your peace. In a material sense, this card can indicate theft, loss, or damage to property. In health, it can indicate chronic conditions or stress-related illness. The Mice are the card of 'what is being taken from you'. by circumstances, by others, or by your own neglect. Paired with the Fish (34), financial loss. money leaks, bad investments, theft. With the Heart (24), a love that is slowly eroding. death by a thousand cuts. With the House (4), property damage or household tensions that wear away at family bonds. With the Bear (15), power that is being slowly undermined. The Mice are a warning: attend to the small things before they become big things.",
    reversedMeaning: "The erosion is stopping. You are fixing the leak. Recovery from a period of loss. Anxiety beginning to subside. The mice are driven out. Reversed, the Mice are more positive. the worst of the loss is over, and repair can begin.",
    symbolism: "Two or three mice running along a baseboard or near a hole in the wall. They are small, grey, and nibbling. In some decks, one mouse stands on its hind legs, alert. The image suggests quiet, persistent activity.",
    tradition: "French/German. card 23, the eroder. 7 of Clubs. clubs tie it to worry, work, and intellectual anxiety.",
    timing: "Slow and ongoing. The decay has been happening for a while and will continue until addressed."
  },
  {
    id: 24,
    name: "The Heart",
    glyph: "❤️",
    cardEquivalent: "J♥",
    keywords: ["love", "emotion", "passion", "affection", "happiness", "romance"],
    meaning: "The Heart is the card of love, emotion, and deep affection. It represents romantic love, but also love in all its forms: the love between partners, the love of family, the love of a friend, the love of a craft or calling. The Heart is the most emotional card in the deck, and when it appears, the matter at hand is driven by feeling rather than logic. In a love reading, the Heart is the best card to see. it promises genuine affection, emotional connection, and the warmth of true attachment. The Heart is always positive, but its power depends on surrounding cards: negative cards may indicate obstacles to love, unrequited feelings, or love that causes pain. Paired with the Ring (25), a committed love. marriage, engagement, a deep partnership. With the Bouquet (9), a love offering or invitation. a date, a gift of the heart. With the Scythe (10), a sudden end to love. heartbreak. With the Coffin (8), a love that has ended or must be released. With the Cross (36), love that comes with burden or sacrifice. The Heart beats true: it does not lie about what it feels.",
    reversedMeaning: "Heartbreak, unrequited love, emotional pain. A relationship that is cold or one-sided. Emotional numbness. The heart is closed or has been hardened by experience. Love that causes suffering. An affair or divided affections.",
    symbolism: "A heart, sometimes anatomically detailed, sometimes stylized. It may be pierced by an arrow or surrounded by flowers. The image is unmistakably about emotion and the core of human feeling.",
    tradition: "French/German. card 24, the lover. Jack of Hearts. a young, romantic person or the romantic impulse itself.",
    timing: "Love follows its own timing. The Heart indicates that emotions are active now."
  },
  {
    id: 25,
    name: "The Ring",
    glyph: "💍",
    cardEquivalent: "A♣",
    keywords: ["commitment", "union", "contract", "marriage", "partnership", "agreement"],
    meaning: "The Ring represents commitment, union, and formal agreement. It is the card of bonds that are meant to last. marriage, partnership, business contracts, promises sealed. When the Ring appears, a commitment is either being offered, expected, or tested. This is the card of 'forever'. or at least, the intention of forever. Unlike the Heart (which feels) or the Bouquet (which offers), the Ring binds: it creates a connection that is not easily broken. In a business context, the Ring indicates contracts, partnerships, mergers, and formal agreements. In love, it is marriage or a commitment ceremony. The Ring is positive in that it represents stability and intention, but it can also indicate feeling trapped by a commitment or a contract that must be honored. Paired with the Heart (24), a love commitment. marriage, engagement. With the Garden (20), a public union. a wedding with guests, a publicly announced partnership. With the Cross (36), a commitment that feels like a burden. duty over desire. With the Mice (23), a contract that is eroding. divorce, dissolution of partnership.",
    reversedMeaning: "Broken commitment. Divorce. A contract that falls through. An engagement called off. A promise that is not kept. The ring falls from the finger. Freedom from a commitment that was binding you. could be positive or negative depending on context.",
    symbolism: "A gold ring, sometimes with a gemstone, on a surface or held by a hand. The ring is a circle. no beginning, no end. It represents eternity and the unbroken nature of true commitment.",
    tradition: "French/German. card 25, the binder. Ace of Clubs. the beginning of a mental/intellectual agreement.",
    timing: "The commitment is made or expected soon. Its duration is long-term."
  },
  {
    id: 26,
    name: "The Book",
    glyph: "📖",
    cardEquivalent: "10♦",
    keywords: ["knowledge", "secrets", "mystery", "learning", "study", "hidden things"],
    meaning: "The Book represents knowledge, secrets, and information that is not yet fully revealed. This is the card of hidden things. what is known but not spoken, what is written but not yet read, what is studied but not yet understood. The Book can indicate education, research, and the pursuit of knowledge for its own sake. It also carries the meaning of a secret: something you know that others do not, or something others are keeping from you. In a reading, the Book often indicates that not all information is available yet. The full story has not been written, or the key pages have not been turned. Paired with the Letter (27), a sealed document or confidential information. With the Key (33), the secret will be revealed. knowledge that unlocks understanding. With the Tower (19), institutional knowledge or academic study. With the Stars (16), spiritual or esoteric knowledge. hidden wisdom. The Book does not reveal its contents easily; it asks for patience, study, and the willingness to learn what is not obvious. Some doors open only to those who read the instructions.",
    reversedMeaning: "A secret exposed. Information that was hidden comes to light. A mystery solved. Education completed. The book is open and its contents are known. Reversed, the Book reveals more than it hides. but also warns that some secrets should stay buried.",
    symbolism: "A large closed book, often leather-bound with a ribbon bookmark. The cover may be plain or ornately decorated. The book is closed. its contents await the reader who opens it.",
    tradition: "French/German. card 26, the hidden. 10 of Diamonds. diamonds tie it to material knowledge or practical learning.",
    timing: "The knowledge takes time to acquire. What is hidden will reveal itself in due course."
  },
  {
    id: 27,
    name: "The Letter",
    glyph: "✉️",
    cardEquivalent: "7♠",
    keywords: ["message", "document", "communication", "notification", "written word"],
    meaning: "The Letter represents a written communication. a letter, an email, a document, a text message, any information that comes in written form. Unlike the Rider (which brings news in general) or the Birds (casual conversation), the Letter is specifically about the written word: official documents, contracts, applications, invitations, notices. When the Letter appears, expect to receive something in writing or to need to produce written communication yourself. The Letter is more formal and more permanent than spoken words. it leaves a record. In a legal context, it can indicate paperwork, filings, or official notifications. Paired with the Heart (24), a love letter or declaration in writing. With the Ring (25), a written contract or marriage certificate. With the Book (26), a report, research paper, or document that contains important information. With the Scythe (10), a termination letter, a layoff notice, or a breakup letter. The Letter is relatively neutral; its content is determined by what card it connects to. The message is coming. check your mailbox.",
    reversedMeaning: "A message that does not arrive, is lost, or is not sent. Bad news in writing. A document that is delayed or rejected. Communication breakdown in written form. The letter goes unanswered.",
    symbolism: "A sealed envelope, sometimes with a wax seal or stamp. In some decks, a hand holds the letter out, offering it. The image captures the moment before reading. the content is still unknown.",
    tradition: "French/German. card 27, the written message. 7 of Spades. spades tie it to fate and official matters.",
    timing: "Within days to weeks. Written communication moves at its own pace but is generally faster than implied by the Ship."
  },
  {
    id: 28,
    name: "The Man",
    glyph: "👨",
    cardEquivalent: "A♥",
    keywords: ["man", "masculine", "partner", "male figure", "consciousness"],
    meaning: "The Man represents a specific male figure, often the querent (if male) or the most important man in the querent's life. partner, father, brother, boss, friend. In a reading for a female querent, the Man typically represents her romantic partner or a significant male influence. In a reading for a male querent, the Man can represent the querent himself. The Man card acts as an anchor: it grounds the spread in one person's perspective. Where the Man is positioned relative to other cards tells you where his focus, energy, and intentions lie. Paired with the Woman (29), a relationship. the two cards together represent a partnership or the dynamic between masculine and feminine. With the Heart (24), a man in love. With the Tower (19), a solitary man or a man in a position of institutional authority. With the House (4), a man connected to the home. a husband, father, or homeowner. The Man card inherits much of its meaning from surrounding cards: he takes on the qualities of what he touches.",
    reversedMeaning: "A man who is absent, unreliable, or untrustworthy. Masculine energy that is blocked or unhealthy. A man who lets you down. The shadow of masculinity: aggression, coldness, domination. The man is not what he appears to be.",
    symbolism: "A standing male figure, often in profile or facing slightly to the side. He is dressed in ordinary or period clothing. His posture is confident but not aggressive.",
    tradition: "French/German. card 28, the masculine principle. Ace of Hearts. the beginning of emotional connection.",
    timing: "Depends on the man and the situation. He acts on his own timeline."
  },
  {
    id: 29,
    name: "The Woman",
    glyph: "👩",
    cardEquivalent: "A♠",
    keywords: ["woman", "feminine", "partner", "female figure", "intuition"],
    meaning: "The Woman represents a specific female figure, often the querent (if female) or the most important woman in the querent's life. partner, mother, sister, friend, colleague. In a reading for a male querent, the Woman typically represents his romantic partner or a significant female influence. In a reading for a female querent, the Woman can represent the querent herself. Like the Man, the Woman anchors the spread in a person's perspective, and her position relative to other cards reveals where her energy is directed. The Woman carries the feminine qualities of intuition, receptivity, and emotional intelligence. Paired with the Man (28), a relationship between the masculine and feminine. With the Heart (24), a woman in love. With the Snake (7), a deceitful woman or a female rival. With the Bouquet (9), a generous woman or a woman who brings gifts. With the Book (26), a woman with secrets or a woman of knowledge. As with the Man card, the Woman's meaning is deeply influenced by what surrounds her.",
    reversedMeaning: "A woman who is unreliable, manipulative, or absent. Feminine energy that is blocked or used destructively. A woman who competes rather than supports. Emotional manipulation. The woman's true nature is hidden.",
    symbolism: "A standing female figure, often in profile. She is dressed in period or ordinary clothing. Her posture is open and receptive. Some decks show her with flowers or a book, emphasizing femininity and grace.",
    tradition: "French/German. card 29, the feminine principle. Ace of Spades. spades connect the feminine to fate and deep intuition.",
    timing: "Depends on the woman and the situation. Her choices drive the timing."
  },
  {
    id: 30,
    name: "The Lily",
    glyph: "🌸",
    cardEquivalent: "K♠",
    keywords: ["peace", "virtue", "sexuality", "maturity", "purity", "refinement"],
    meaning: "The Lily represents peace, virtue, and mature wisdom. It is the card of things that have been refined over time. a person who has grown into their wisdom, a relationship that has deepened through years of shared experience, a project that has reached full bloom. The Lily is deeply positive but subdued: it does not shout like the Sun or burn like the Heart. It is the quiet satisfaction of a life well-lived, the peace that comes after the storm. The Lily also carries the meaning of sexuality and intimacy in their mature forms. the physical expression of love between people who know each other deeply. It is not the passionate flash of the Heart but the abiding warmth of two bodies that have learned each other. Paired with the Heart (24), a mature, peaceful love. With the Stars (16), spiritual fulfillment at a high level. With the Garden (20), refined social company. a gathering of cultured people. With the Coffin (8), a peaceful death or a dignified ending. With the Mountain (21), obstacles to peace or sexuality that is blocked. The Lily is the card of grace earned through time.",
    reversedMeaning: "Peace disturbed. Virtue questioned. Sexual dysfunction or blockage. Immaturity in matters of love or intimacy. A person who has not grown up. Disgrace or scandal. The lily wilts. something once beautiful fades.",
    symbolism: "A stalk of lilies in full flower, sometimes in a vase or growing from the ground. The lily is a traditional symbol of purity, royalty, and refined beauty. White lilies dominate.",
    tradition: "French/German. card 30, the bloom. King of Spades. the mature, wise male figure; spades add depth and fate.",
    timing: "Long-term. The Lily represents what has grown slowly and will last."
  },
  {
    id: 31,
    name: "The Sun",
    glyph: "☀️",
    cardEquivalent: "A♦",
    keywords: ["success", "joy", "vitality", "warmth", "triumph", "happiness"],
    meaning: "The Sun is the most positive card in the Lenormand deck. It represents success, joy, vitality, and the triumph of light over darkness. When the Sun appears, the outcome is bright: whatever you are working toward will succeed, whatever you are worried about will resolve, whatever is hidden will be illuminated. The Sun brings warmth to every card it touches. it turns even challenging cards into temporary obstacles that will pass. The Sun is also the card of clarity: things become visible, truth emerges, confusion burns away. In a health context, the Sun is the best possible card. vitality, recovery, strength. In work, it indicates success, recognition, and achievement. In love, it promises happiness and warmth. Paired with the Moon (32), a powerful cycle. day and night, consciousness and intuition working together. With the Stars (16), a destined success. your path is aligned with your purpose. With the Heart (24), radiant love. happiness, warmth, and joy in relationships. With the Key (33), the answer is clear and positive. the lock opens to joy. The Sun does not have a shadow side; its only challenge is that its light can be overwhelming for those who have been in darkness too long.",
    reversedMeaning: "The Sun reversed is not negative. it simply indicates that success is delayed or that the brightness will return. Temporary cloud cover. Joy that is slightly muted. Success that takes a little longer. The best card reversed is still a good card.",
    symbolism: "A large radiant sun with a human face, surrounded by rays of light. Sunflowers or a bright landscape may fill the lower portion. The warmth radiates outward, touching everything.",
    tradition: "French/German. card 31, the great joy. Ace of Diamonds. the beginning of material success and happiness.",
    timing: "Imminent. The Sun's timing is 'soon'. the waiting is nearly over."
  },
  {
    id: 32,
    name: "The Moon",
    glyph: "🌙",
    cardEquivalent: "8♥",
    keywords: ["emotions", "intuition", "night", "dreams", "subconscious", "cycles"],
    meaning: "The Moon represents emotions, intuition, and the realm of the subconscious. Where the Sun shows what is visible and certain, the Moon reveals what is felt, sensed, and known without proof. This is the card of dreams, psychic impressions, deep feelings, and the cycles of life that follow a rhythm beyond rational control. The Moon governs the night. the time when the conscious mind rests and the deeper self speaks. In a reading, the Moon suggests that the answer lies not in logic but in feeling. Trust your instincts; the rational mind does not have all the information. The Moon also carries meaning about cycles: what is waxing and waning in your life, what is coming to fullness and what is diminishing. Paired with the Sun (31), a complete cycle. the integration of conscious and unconscious, logic and intuition. With the Stars (16), spiritual and intuitive gifts. a natural psychic connection. With the Clouds (6), emotional confusion. feelings that are unclear or self-deceptive. With the Heart (24), deep emotional love. love that is felt rather than spoken. The Moon does not lie, but its truth is felt rather than seen.",
    reversedMeaning: "Emotional confusion. Depression or mood swings. Intuition blocked or unreliable. A dark night of the soul. Feelings that overwhelm reason. Self-deception. The moon is waning. something emotional is diminishing and needs release.",
    symbolism: "A crescent moon with a face profile, surrounded by stars. Two towers or pillars may frame the moon. A path stretches below into darkness. The night is deep but the moon provides guidance.",
    tradition: "French/German. card 32, the intuitive. 8 of Hearts. the fullness of emotional depth.",
    timing: "Cyclical. The Moon's timing follows natural rhythms. days to months depending on the cycle."
  },
  {
    id: 33,
    name: "The Key",
    glyph: "🔑",
    cardEquivalent: "8♦",
    keywords: ["solution", "answer", "opening", "revelation", "certainty", "access"],
    meaning: "The Key represents the answer, the solution, the moment when everything clicks into place. It is the card of certainty. the lock opens, the door swings wide, the path becomes clear. When the Key appears, the question you are asking has an answer, and you are about to discover it. The Key is decisive: it does not hint or suggest. It opens or it does not. In a reading, the Key tells you that what you seek is close. the solution is at hand, the truth will be revealed, the access you need will be granted. The Key also represents something that cannot be avoided: a door that must be walked through, a truth that must be faced. Paired with the Book (26), a secret revealed or knowledge that unlocks understanding. With the Heart (24), the key to someone's heart. emotional breakthrough. With the Mountain (21), the obstacle will be overcome. the key finds the lock through the mountain. With the Coffin (8), a closed case reopened. the key to understanding an ending. The Key is one of the most affirmative cards in the deck. When it appears, the answer is yes. the question is only what door you are unlocking.",
    reversedMeaning: "A solution that is not found. Keys that do not fit. Being locked out or denied access. The answer is there but you cannot reach it yet. An opportunity that closes before you can take it. A door that remains shut.",
    symbolism: "A large ornate key, often old-fashioned, sometimes with a ribbon or chain. The key stands alone or rests on a surface. It is the object that opens. without it, what is locked stays locked.",
    tradition: "French/German. card 33, the opener. 8 of Diamonds. diamonds tie it to material solutions and practical answers.",
    timing: "The solution is imminent. within days to weeks. The Key unlocks the present moment."
  },
  {
    id: 34,
    name: "The Fish",
    glyph: "🐟",
    cardEquivalent: "K♦",
    keywords: ["money", "commerce", "abundance", "wealth", "prosperity", "resources"],
    meaning: "The Fish represent money, commerce, and material abundance. This is the primary money card in Lenormand. when you see the Fish, finances are coming into focus. A payment, a salary, a business deal, an investment return, or simply a period of material comfort. The Fish swim in schools: when one fish appears, more are nearby. The card suggests that wealth is not isolated. where there is one source of income, others will follow. The Fish also carry the meaning of fluidity. money that moves, flows, and changes form. Cash, credit, assets, investments. the Fish swim through different waters but remain abundance. In a career context, the Fish indicate commerce, trade, or any profession involving the movement of money. Paired with the Sun (31), extraordinary financial success. With the Ship (3), international commerce or money from abroad. With the Mice (23), financial loss, theft, or money draining away. With the Crossroads (22), a financial decision. an investment choice, a spending decision. With the Bouquet (9), a gift of money or a financial opportunity offered freely.",
    reversedMeaning: "Financial difficulty. Loss of income. A bad investment. Money that is owed but not paid. Cash flow problems. Poverty consciousness or fear around money. The fish swim away from you. Reversed, the Fish indicate financial lack or anxiety about resources.",
    symbolism: "A school of fish swimming in the same direction, often shown in water with ripples or waves. The fish are similar in size and shape. abundance through numbers, not any single large fish.",
    tradition: "French/German. card 34, the abundance. King of Diamonds. a wealthy or materially successful man; the master of commerce.",
    timing: "Money moves in cycles. The Fish indicate ongoing or incoming financial flow."
  },
  {
    id: 35,
    name: "The Anchor",
    glyph: "⚓",
    cardEquivalent: "9♠",
    keywords: ["stability", "security", "work", "rest", "foundation", "permanence"],
    meaning: "The Anchor represents stability, security, and the things that keep you grounded. In a world of constant change, the Anchor holds. it is your job, your home, your steady relationship, your core values, the things that do not shift when the winds blow. The Anchor is a deeply positive card for work and career: it indicates stable employment, a secure position, a role that provides both income and identity. In relationships, it suggests a partnership built on solid ground. not passionate highs and lows but steady, reliable love. The Anchor can also indicate a need for rest and stillness: you have been moving and changing, and now it is time to drop anchor and simply be. Paired with the Ship (3), travel for work or a stable journey. relocation for a job. With the House (4), a stable home. owned rather than rented, secure rather than temporary. With the Heart (24), a stable love. steady, reliable, committed. With the Cross (36), a burden that is also your stability. a job you cannot leave, a responsibility that holds you. The Anchor cannot be dragged easily; it is set deep. What it holds is meant to stay.",
    reversedMeaning: "Instability. Job loss or insecurity. A shaky foundation. A relationship that is not secure. Restlessness. you cannot settle. The anchor drags. you are not holding where you should be. A need for grounding that is not being met.",
    symbolism: "A ship's anchor, heavy and solid, with chain links wrapped around it or lying beside it. The anchor on a calm seabed, sometimes with a rope or line leading upward. The image is stillness itself.",
    tradition: "French/German. card 35, the stabilizer. 9 of Spades. spades tie it to fate and work, but the 9 brings completion and stability.",
    timing: "Long-term. The Anchor holds for years. It represents permanent or semi-permanent conditions."
  },
  {
    id: 36,
    name: "The Cross",
    glyph: "✝️",
    cardEquivalent: "6♣",
    keywords: ["burden", "suffering", "sacrifice", "karma", "faith", "destiny"],
    meaning: "The Cross is the heaviest card in the deck. It represents burdens, suffering, karmic debts, and the weight of destiny. When the Cross appears, the querent is carrying something heavy. a responsibility, a grief, a difficult life lesson that cannot be avoided. The Cross is not punishment; it is the weight of meaningful experience. Some burdens are not meant to be dropped but to be carried with dignity until the lesson is learned or the road reaches its appointed end. The Cross also represents faith and spiritual trials. the tests that deepen belief or break it. In a karmic sense, the Cross indicates that the current situation is not random: it has roots in past actions (of this life or another) and must be worked through rather than escaped. Paired with the Heart (24), a love that is difficult or carries a heavy price. a forbidden love, a sacrifice for love. With the Sun (31), a burden that will be rewarded. the cross carried into the light. With the Coffin (8), the end of a difficult period. karmic completion. With the Key (33), the key to your burden. understanding why you carry it. The Cross is the final card. it represents the great questions of life: meaning, suffering, and what we do with the weight we are given.",
    reversedMeaning: "A burden being lifted. Karmic debt paid. A difficult period ending. Suffering that has purpose and is nearing completion. The cross is laid down. Reversed, the Cross indicates that the worst is over and relief is coming.",
    symbolism: "A large wooden cross, sometimes on a hill, sometimes with a figure of Christ or simply the empty cross. It stands alone against the sky. no other symbols compete. The cross is the weight.",
    tradition: "French/German. card 36, the burden. The final card of the deck. 6 of Clubs. clubs tie it to mental/spiritual weight.",
    timing: "Karmic timing. The burden lasts as long as needed for the lesson to be learned."
  }
];

export function getCardById(id: number): LenormandCardDef | undefined {
  return LENORMAND_CARDS.find(c => c.id === id);
}

export function getCardByName(name: string): LenormandCardDef | undefined {
  return LENORMAND_CARDS.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getAllCards(): LenormandCardDef[] {
  return LENORMAND_CARDS;
}

export type SpreadType = "three" | "five_cross" | "nine_grid" | "grand_tableau";

export interface SpreadDef {
  type: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  positions: { name: string; subtitle: string; desc: string }[];
}

export const SPREAD_DEFS: SpreadDef[] = [
  {
    type: "three",
    name: "Three-Card Spread",
    description: "The simplest and most direct Lenormand spread. Cards are read in sequence from left to right, but also as pairs (1+2, 2+3) and in combination (all three together). This spread answers specific questions with clarity and brevity.",
    cardCount: 3,
    positions: [
      { name: "Past", subtitle: "What has led here", desc: "The foundation of the situation. What you carry into this moment." },
      { name: "Present", subtitle: "The current energy", desc: "The heart of the matter. What is active right now." },
      { name: "Future", subtitle: "Where it is heading", desc: "The likely trajectory if nothing changes. Can shift with awareness." },
    ],
  },
  {
    type: "five_cross",
    name: "Five-Card Cross",
    description: "A positional spread that maps the situation across five dimensions. Cards are read individually and in interaction. the center card is the core, and the four arms show what supports, opposes, and surrounds the matter.",
    cardCount: 5,
    positions: [
      { name: "Center", subtitle: "The core", desc: "The heart of the matter. What this is really about." },
      { name: "Above", subtitle: "What guides", desc: "The conscious goal, aspiration, or ideal influencing the situation." },
      { name: "Below", subtitle: "The foundation", desc: "The subconscious or hidden root. What supports or undermines from below." },
      { name: "Left", subtitle: "The past", desc: "What recedes, fades, or has been recently completed." },
      { name: "Right", subtitle: "The future", desc: "What approaches, grows, or is about to manifest." },
    ],
  },
  {
    type: "nine_grid",
    name: "Nine-Card Grid (3×3)",
    description: "A 3×3 grid that provides deeper context than the three-card spread. Read by rows (overall theme), columns (temporal layers), and diagonals (hidden dynamics). Center card is the focal point. Pairs read horizontally, vertically, and diagonally.",
    cardCount: 9,
    positions: [
      { name: "Top Left", subtitle: "Distant past", desc: "Origins, early influences, what set this in motion." },
      { name: "Top Center", subtitle: "Present outer", desc: "What is visible to others. The public face of the matter." },
      { name: "Top Right", subtitle: "Distant future", desc: "Long-term outcome tendency. Where this leads eventually." },
      { name: "Middle Left", subtitle: "Recent past", desc: "What is still settling. The immediate background." },
      { name: "Center", subtitle: "The still point", desc: "The eye of the storm. The core truth of the reading." },
      { name: "Middle Right", subtitle: "Near future", desc: "What is approaching. The next development." },
      { name: "Bottom Left", subtitle: "Hidden past", desc: "What was hidden or unacknowledged. Ancestral or subconscious roots." },
      { name: "Bottom Center", subtitle: "Hidden present", desc: "What is not yet visible. The unspoken, the potential." },
      { name: "Bottom Right", subtitle: "Hidden future", desc: "The shadow trajectory. What could emerge if unseen factors prevail." },
    ],
  },
  {
    type: "grand_tableau",
    name: "Grand Tableau (9×4)",
    description: "The classic Lenormand Grand Tableau. all 36 cards laid out in a 9×4 grid. This is the most comprehensive reading in the Lenormand tradition. Every card is read in context of its position, the card's house (the card that occupies its numerical position), mirroring across axes, knight moves, and the overall flow of the spread. Requires deep knowledge of card interactions.",
    cardCount: 36,
    positions: Array.from({ length: 36 }, (_, i) => ({
      name: `Position ${i + 1}`,
      subtitle: `House of ${LENORMAND_CARDS[i]?.name ?? ". "}`,
      desc: `Card ${i + 1} in the reading order. The house of card #${i + 1} colors the meaning of whatever card lands here.`,
    })),
  },
];

export function getRandomCards(count: number): { card: LenormandCardDef; reversed: boolean }[] {
  const shuffled = [...LENORMAND_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    card,
    reversed: Math.random() < 0.25,
  }));
}
