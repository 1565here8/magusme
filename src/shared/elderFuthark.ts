export type RuneDef = {
  id: number;
  glyph: string;
  name: string;
  letter: string;
  meaning: string;
  reversedMeaning: string;
  category: string;
  keywords: string[];
  aett: 1 | 2 | 3;
  aettName: string;
  element: string;
  color: string;
  tree?: string;
  deity?: string;
  detail: string;
  reversedDetail: string;
};

const A1 = "Freyr's Ætt" as const;
const A2 = "Hagal's Ætt" as const;
const A3 = "Tyr's Ætt" as const;

export const ELDER_FUTHARK: RuneDef[] = [
  {
    id: 1, glyph: "ᚠ", name: "Fehu", letter: "F",
    aett: 1, aettName: A1, element: "Fire", color: "#c8a45c", tree: "Elder",
    deity: "Freyr",
    category: "Cleromancy & Sortilege",
    meaning: "Wealth, abundance, success, mobile property",
    reversedMeaning: "Loss, bad luck, missed opportunity, blockage",
    keywords: ["wealth", "abundance", "prosperity", "success"],
    detail: "Fehu is the currency of life. not just gold but the energy that flows through all living things. Cattle were the original wealth of the Germanic tribes: mobile property that could walk, reproduce, and sustain. This rune signals prosperity on the horizon, resources coming into your power, and the circulation of energy between beings. It is the kindling that feeds the hearth fire.",
    reversedDetail: "When Fehu turns merkstave, the current has shifted. What flowed freely is now dammed. financial delay, broken trust, a transaction gone sour. This is the souring of generosity into obligation. The cattle have wandered. Do not chase them yet; first examine how the fence was breached.",
  },
  {
    id: 2, glyph: "ᚢ", name: "Uruz", letter: "U",
    aett: 1, aettName: A1, element: "Earth", color: "#5c4a3a", tree: "Birch",
    deity: "Thor",
    category: "Cleromancy & Sortilege",
    meaning: "Strength, vitality, courage, untamed potential",
    reversedMeaning: "Weakness, injury, domination by others",
    keywords: ["strength", "vitality", "courage", "power"],
    detail: "Uruz is the aurochs. the wild ox that once roamed Europe's forests, untamed and unstoppable. This is raw, primordial strength: the will to survive, the force that pushes through walls. Where Fehu is cultivated wealth, Uruz is the undomesticated power that creates wealth. It calls you to stand in your own strength and trust your body's wisdom.",
    reversedDetail: "Merkstave Uruz speaks of diminished will. The aurochs has been cornered. illness, exhaustion, or a situation that saps your vitality. You may be yielding too much of your power to another, or the wild within you has been caged. Forced submission is in the air. Do not break; instead, find the one thing you can control and hold it fast.",
  },
  {
    id: 3, glyph: "ᚦ", name: "Thurisaz", letter: "TH",
    aett: 1, aettName: A1, element: "Fire", color: "#8b0000", tree: "Thorn",
    deity: "Thor",
    category: "Cleromancy & Sortilege",
    meaning: "Protection, conflict, reactive force, defense",
    reversedMeaning: "Danger, betrayal, vulnerability, rash action",
    keywords: ["protection", "conflict", "defense", "giant"],
    detail: "Thurisaz is the thorn. the giant's hammer, the reactive force that rises unbidden. It is both shield and weapon: the thorn that protects the rose and wounds the hand that reaches carelessly. This rune signals a boundary being drawn, a confrontation that cleanses, or a defensive position that must be held. It is the sharp point where the old world meets the new.",
    reversedDetail: "When Thurisaz reverses, the thorn turns inward. A dangerous situation approaches from a blind quarter. betrayal where you expected loyalty, an attack you did not anticipate. The defensive wall has a crack. Rash action now would compound the wound. Let the storm pass before you decide your course.",
  },
  {
    id: 4, glyph: "ᚨ", name: "Ansuz", letter: "A",
    aett: 1, aettName: A1, element: "Air", color: "#4a90d9", tree: "Ash",
    deity: "Odin",
    category: "Cleromancy & Sortilege",
    meaning: "Message, wisdom, communication, divine inspiration",
    reversedMeaning: "Misunderstanding, lies, poor communication",
    keywords: ["wisdom", "communication", "message", "divine"],
    detail: "Ansuz is Odin's breath. the inspired word, the rune of the All-Father who hung on Yggdrasil to win the runes. This is communication from the higher realm: a message you need to hear, an insight that comes as a flash. It governs speech, poetry, and the transfer of wisdom across generations. When Ansuz appears, the gods are speaking. Listen.",
    reversedDetail: "Merkstave Ansuz brings the lie, the half-truth, the poison whisper. Communication breaks down. what you say is not what they hear, or worse, someone is deliberately misleading you. The divine channel is clogged with static. Silence is better than speech right now. Withdraw and wait for clearer air.",
  },
  {
    id: 5, glyph: "ᚱ", name: "Raidho", letter: "R",
    aett: 1, aettName: A1, element: "Air", color: "#6b7b8d", tree: "Oak",
    deity: "Forseti",
    category: "Cleromancy & Sortilege",
    meaning: "Journey, travel, change, movement, rhythm",
    reversedMeaning: "Stagnation, crisis, injustice, disruption",
    keywords: ["journey", "travel", "change", "movement"],
    detail: "Raidho is the wagon wheel turning, the rhythm of the road beneath hoof and foot. This is the rune of right action in motion. not aimless wandering but purposeful travel toward a goal. It governs physical journeys as well as the inner pilgrimage of the soul. The wheel knows its track; trust the process and keep moving, even if you cannot yet see the destination.",
    reversedDetail: "When Raidho reverses, the wheel has come off. The journey is blocked, the path is unjust, or the rhythm has been broken. A crisis of direction: you do not know which way to go, or external forces have thrown you off course. Do not force the passage. Fix what is broken before trying to move forward.",
  },
  {
    id: 6, glyph: "ᚲ", name: "Kenaz", letter: "K",
    aett: 1, aettName: A1, element: "Fire", color: "#e67e22", tree: "Pine",
    deity: "Heimdall",
    category: "Cleromancy & Sortilege",
    meaning: "Fire, creativity, illumination, knowledge",
    reversedMeaning: "Destruction, darkness, confusion, loss of passion",
    keywords: ["fire", "creativity", "knowledge", "illumination"],
    detail: "Kenaz is the torch that burns away the dark. controlled flame that forges iron and illuminates hidden spaces. This is creative fire, the spark of inspiration that births art, invention, and understanding. Where Ansuz brings the message, Kenaz provides the light by which to read it. It is the hearth fire of the smith, the forge of transformation.",
    reversedDetail: "Merkstave Kenaz is the guttering flame. The torch has gone out, leaving you in darkness. Creative blocks, loss of direction, confusion where there was once clarity. The fire has burned too hot and consumed its fuel. Before you can relight it, you must gather new wood. rest, reframe, and wait for the spark to catch again.",
  },
  {
    id: 7, glyph: "ᚷ", name: "Gebo", letter: "G",
    aett: 1, aettName: A1, element: "Air", color: "#c8a45c", tree: "Ash",
    deity: "Odin",
    category: "Cleromancy & Sortilege",
    meaning: "Gift, generosity, partnership, balance",
    reversedMeaning: "Greed, obligation, imbalance (upright only. no reverse)",
    keywords: ["gift", "partnership", "balance", "generosity"],
    detail: "Gebo is the gift exchanged between gods and humans. the sacred bond of giving and receiving. This is the rune of partnership in its truest form: not transaction but mutual offering. Every true relationship is a Gebo. each party gives freely and receives gratefully. It signals a time of generosity, alliance, or the deepening of a bond through sacrifice.",
    reversedDetail: "Gebo cannot be reversed in the traditional sense. its nature is exchange, and exchange simply is. When this rune appears troubled, look for imbalance: one gives too much, the other takes without return. The gift has become obligation, the partnership a burden. Restore equilibrium or release the bond.",
  },
  {
    id: 8, glyph: "ᚹ", name: "Wunjo", letter: "W",
    aett: 1, aettName: A1, element: "Water", color: "#5b8c5a", tree: "Apple",
    deity: "Freya",
    category: "Cleromancy & Sortilege",
    meaning: "Joy, pleasure, harmony, fellowship",
    reversedMeaning: "Sorrow, discord, imbalance, alienation",
    keywords: ["joy", "harmony", "fellowship", "pleasure"],
    detail: "Wunjo is the radiant joy that follows a trial survived. the laughter in the longhouse after the storm passes. This is the rune of harmony and fellowship, of belonging to something larger than yourself. Where Fehu is wealth and Uruz is strength, Wunjo is the happiness that makes both meaningful. It is the warmth of the mead hall, the embrace of kin, the satisfaction of work well done.",
    reversedDetail: "When Wunjo reverses, the mead hall is empty. The laughter has died. Sorrow, discord, or alienation has taken the place of fellowship. You feel cut off from your tribe, misunderstood, or grieving a loss that will not resolve quickly. The harmony has shattered; do not try to force it back together. Mourn the pieces before you rebuild.",
  },
  {
    id: 9, glyph: "ᚺ", name: "Hagalaz", letter: "H",
    aett: 2, aettName: A2, element: "Ice", color: "#6b8da8", tree: "Yew",
    deity: "Heimdall",
    category: "Cleromancy & Sortilege",
    meaning: "Hail, disruption, natural destruction, transformation",
    reversedMeaning: "Gradual change, delay (upright only. no reverse)",
    keywords: ["disruption", "transformation", "destruction", "change"],
    detail: "Hagalaz is the hailstorm that beats the harvest into the mud. destruction that is not personal, not targeted, simply indifferent. This rune represents the raw forces of nature that shatter what is weak to make way for what is strong. The hail falls on the just and unjust alike. When Hagalaz appears, you are being stripped of what you cannot keep. Surrender to the storm.",
    reversedDetail: "Hagalaz is not truly reversible. the hailstorm falls regardless. In a merkstave context, the disruption may be delayed or less severe, but it is still coming. The gradual thaw after the freeze offers time to prepare. You have been given a warning; use it wisely.",
  },
  {
    id: 10, glyph: "ᚾ", name: "Nauthiz", letter: "N",
    aett: 2, aettName: A2, element: "Fire", color: "#8b4513", tree: "Beech",
    deity: "Skuld",
    category: "Cleromancy & Sortilege",
    meaning: "Need, constraint, necessity, endurance",
    reversedMeaning: "Poverty, desperation, burnout (upright only. no reverse)",
    keywords: ["need", "constraint", "endurance", "necessity"],
    detail: "Nauthiz is the friction fire. the need that sparks invention, the constraint that forges character. This is the rune of necessity, of being backed into a corner where only your deepest resources can save you. It represents poverty, lack, and hardship, but also the resilience that hardship cultivates. The Norns weave through difficulty; you are being shaped for what comes next.",
    reversedDetail: "Nauthiz cannot be reversed. need is need. In a darkened context, the poverty has become desperate, the burnout complete. You have pushed past endurance and the well is dry. This is not the time for heroic effort. Rest, conserve, tend the spark. The fire will catch again when the wood is dry.",
  },
  {
    id: 11, glyph: "ᛁ", name: "Isa", letter: "I",
    aett: 2, aettName: A2, element: "Ice", color: "#d6e4f0", tree: "None",
    deity: "Ymir",
    category: "Cleromancy & Sortilege",
    meaning: "Ice, stillness, pause, clarity through freezing",
    reversedMeaning: "Stagnation, frustration, blockage (upright only. no reverse)",
    keywords: ["ice", "stillness", "pause", "clarity"],
    detail: "Isa is the ice that locks the fjord. not an ending but a suspension. The world is held in crystalline stillness, preserving what lies beneath. This rune commands patience: the freeze is necessary for the spring thaw. In that stillness comes a clarity that motion obscures. Nothing moves, but everything is revealed. Whatever you are pushing for, stop. Wait. The ice will break when it is time.",
    reversedDetail: "Isa stands for ice itself and cannot be turned upside-down. But the experience of Isa can be shadowed. then the pause has become prison, the stillness depression, the patience paralysis. You are not resting; you are frozen. Distinguish between the necessary pause and the fear that masquerades as patience.",
  },
  {
    id: 12, glyph: "ᛃ", name: "Jera", letter: "J",
    aett: 2, aettName: A2, element: "Earth", color: "#7b9a5a", tree: "Oak",
    deity: "Frigga",
    category: "Cleromancy & Sortilege",
    meaning: "Harvest, cycle, reward, natural fruition",
    reversedMeaning: "Bad harvest, poor timing, setback (upright only. no reverse)",
    keywords: ["harvest", "cycle", "reward", "fruition"],
    detail: "Jera is the harvest cycle. the turning of the seasons, the patient arc from seed to fruit. This is the rune of just reward for steady work. You cannot rush Jera; the grain takes its own time to ripen. It signals that you are in the right season of your life, the cycle is unfolding correctly, and your labor will bear fruit if you do not abandon the field before harvest.",
    reversedDetail: "Jera does not reverse. the cycle always turns. But when its energy is troubled, the harvest is poor. The timing is off; you are reaping what you did not sow, or the frost came early. This is not a permanent curse but a season of leanness. Clear the field, amend the soil, and plant again for the next cycle.",
  },
  {
    id: 13, glyph: "ᛇ", name: "Eihwaz", letter: "EI",
    aett: 2, aettName: A2, element: "Earth", color: "#4a6741", tree: "Yew",
    deity: "Odin",
    category: "Cleromancy & Sortilege",
    meaning: "Yew tree, endurance, resilience, death-rebirth",
    reversedMeaning: "Weakness, avoidance, fragility (upright only. no reverse)",
    keywords: ["endurance", "resilience", "rebirth", "protection"],
    detail: "Eihwaz is the yew tree. the longest-living thing in Europe, sacred to Odin, the wood from which bows are made. The yew does not die; it sends new shoots from its own decay. This is the rune of death-rebirth, the capacity to endure beyond all reasonable limit. It represents the axis mundi. the world tree Yggdrasil itself. the spine that holds the cosmos together.",
    reversedDetail: "Eihwaz does not reverse in the ordinary sense. the yew stands regardless. In shadow, its energy becomes avoidance of necessary endings. You cling to what should be released, refusing the death that precedes rebirth. The yew bends rather than breaks, but bending too long is collapse. Let the old branch fall.",
  },
  {
    id: 14, glyph: "ᛈ", name: "Perthro", letter: "P",
    aett: 2, aettName: A2, element: "Water", color: "#5a6e8a", tree: "Beech",
    deity: "Frigga",
    category: "Cleromancy & Sortilege",
    meaning: "Lot cup, mystery, fate, hidden knowledge",
    reversedMeaning: "Secrets kept, bad luck, stagnation",
    keywords: ["mystery", "fate", "hidden", "divination"],
    detail: "Perthro is the cup from which lots are drawn. the vessel of fate, the well of Wyrd where all possibilities swirl. This is the rune of mystery, of hidden knowledge that is not yet ready to be revealed. It governs divination itself, the act of peering into the unknown. When Perthro appears, something is being decided in the depths. The lot has not yet fallen; the outcome is still being woven.",
    reversedDetail: "Merkstave Perthro means the secrets stay hidden. The lot cup has been withdrawn. Bad luck, stagnation in hidden matters, or a secret that is being kept from you. perhaps for good reason. The well is clouded. Divination now will not yield clear answers. Wait until the waters settle.",
  },
  {
    id: 15, glyph: "ᛉ", name: "Algiz", letter: "Z",
    aett: 2, aettName: A2, element: "Air", color: "#c8a45c", tree: "Sedge",
    deity: "Heimdall",
    category: "Cleromancy & Sortilege",
    meaning: "Protection, defense, higher self, connection to gods",
    reversedMeaning: "Vulnerability, betrayal, hidden danger",
    keywords: ["protection", "defense", "higher self", "connection"],
    detail: "Algiz is the elk sedge. the plant with leaves that cut like blades, the antlers of the elk raised in defiance. This is the rune of protection, but not passive shelter: active defense, the raised shield, the stance that says 'you shall not pass.' It connects you to the higher self, the divine spark that cannot be touched. When Algiz appears, you are being guarded by forces beyond your understanding. Trust that protection.",
    reversedDetail: "When Algiz reverses, the shield has been lowered. You are exposed. vulnerable to forces you cannot see. Betrayal may be near, or a danger you have not anticipated. The connection to the higher self is frayed; you have lost faith in your protection. Lower your pride and reach out. Even the lone wolf needs the pack.",
  },
  {
    id: 16, glyph: "ᛊ", name: "Sowilo", letter: "S",
    aett: 2, aettName: A2, element: "Fire", color: "#f0c040", tree: "Juniper",
    deity: "Sunna/Sol",
    category: "Cleromancy & Sortilege",
    meaning: "Sun, success, vitality, wholeness, life force",
    reversedMeaning: "False success, burnout, loss (upright only. no reverse)",
    keywords: ["sun", "success", "vitality", "life force"],
    detail: "Sowilo is the sun wheel turning across the sky. invincible, life-giving, undeniable. This is the rune of total success, the wholeness that comes when body, mind, and spirit are aligned with the Will. It represents the life force itself, the fire that animates all things. When Sowilo appears, victory is certain. The sun always rises. You are moving toward the light.",
    reversedDetail: "Sowilo cannot be truly reversed. the sun does not unrise. But the shadow of Sowilo is burnout chased by false success, the hollow victory bought at too high a price. You have achieved the goal but lost yourself in the process. Or you are mistaking activity for progress, mistaking the sun's reflection for the sun itself. Realign with your true north.",
  },
  {
    id: 17, glyph: "ᛏ", name: "Tiwaz", letter: "T",
    aett: 3, aettName: A3, element: "Air", color: "#4a4a6a", tree: "Oak",
    deity: "Tyr",
    category: "Cleromancy & Sortilege",
    meaning: "Justice, honor, leadership, warrior's path",
    reversedMeaning: "Injustice, sacrifice without reward, loss of honor",
    keywords: ["justice", "honor", "leadership", "warrior"],
    detail: "Tiwaz is Tyr's sword. the rune of the one-handed god who sacrificed his right hand to bind Fenrir, knowing the wolf would not be held. This is justice without sentiment, honor without compromise, leadership that serves the greater good at personal cost. When Tiwaz appears, you are being called to stand for what is right, even if it costs you something precious. The spear points the way forward. Follow it.",
    reversedDetail: "Merkstave Tiwaz is justice denied. The right path was not taken; the leader has failed their charge. Sacrifice without reward. not noble martyrdom but pointless loss. Honor has been compromised, and the spear point is turned against you. Beware of zealotry, of following the letter of the law while betraying its spirit. The path must be corrected.",
  },
  {
    id: 18, glyph: "ᛒ", name: "Berkano", letter: "B",
    aett: 3, aettName: A3, element: "Earth", color: "#7ba07b", tree: "Birch",
    deity: "Frigga",
    category: "Cleromancy & Sortilege",
    meaning: "Growth, fertility, new beginnings, nurturing",
    reversedMeaning: "Loss of family, stagnation, decay",
    keywords: ["growth", "fertility", "beginnings", "nurturing"],
    detail: "Berkano is the birch goddess. the tree that is the first to colonize barren ground, the symbol of new life breaking through the wasteland. This is the rune of birth, growth, and nurturing. It governs the tender shoot, the mother's hand, the patient cultivation of what will become. When Berkano appears, something new is being born into your life. a project, a relationship, a phase of being. Protect it, nurture it, let it grow at its own pace.",
    reversedDetail: "When Berkano reverses, growth has stopped. The family is in crisis, the new beginning has failed to take root, or decay is setting into something once vital. Infertility of purpose or body. Do not cling to what will not grow; sometimes the seed is dead in the ground. Clear it and prepare the soil for the next planting.",
  },
  {
    id: 19, glyph: "ᛖ", name: "Ehwaz", letter: "E",
    aett: 3, aettName: A3, element: "Water", color: "#6b6b45", tree: "Ash",
    deity: "Freyr",
    category: "Cleromancy & Sortilege",
    meaning: "Horse, partnership, trust, progress together",
    reversedMeaning: "Distrust, betrayal, separation, broken trust",
    keywords: ["partnership", "trust", "progress", "horse"],
    detail: "Ehwaz is the horse. the sacred companion of the Norse world, the trust between rider and steed that makes the journey possible. This is the rune of partnership, of two wills moving as one. It represents relationships built on mutual trust and shared purpose. When Ehwaz appears, progress comes through alliance. You do not have to go alone. The right partner is here, or the existing bond is deepening.",
    reversedDetail: "Merkstave Ehwaz is the broken trust. The horse has thrown you. a partnership has failed, a betrayal has severed the bond. Separation is coming or has already arrived. You may have misjudged your partner's loyalty, or they have failed you. Do not rush into a new alliance; the wound is fresh. Heal before you ride again.",
  },
  {
    id: 20, glyph: "ᛗ", name: "Mannaz", letter: "M",
    aett: 3, aettName: A3, element: "Air", color: "#8b7355", tree: "Holly",
    deity: "Heimdall",
    category: "Cleromancy & Sortilege",
    meaning: "Human, community, cooperation, self-reflection",
    reversedMeaning: "Isolation, manipulation, loneliness",
    keywords: ["human", "community", "cooperation", "self"],
    detail: "Mannaz is the human being standing in relation to others. the rune of the tribe, the society, the shared mind. This is the self as seen through the eyes of the community. It represents cooperation, mutual understanding, and the collective wisdom that transcends the individual. When Mannaz appears, look to your place in the group. Are you contributing, isolating, or manipulating? The tribe thrives when each member honors the whole.",
    reversedDetail: "When Mannaz reverses, you are out of alignment with your people. Isolation has become exile, cooperation has been poisoned by manipulation, or the community has turned against you. You may feel unseen, unheard, or exploited by those you trusted. Do not withdraw further; the cure for alienation is not more distance, but finding the right tribe.",
  },
  {
    id: 21, glyph: "ᛚ", name: "Laguz", letter: "L",
    aett: 3, aettName: A3, element: "Water", color: "#4a90d9", tree: "Willow",
    deity: "Njord",
    category: "Cleromancy & Sortilege",
    meaning: "Water, flow, dreams, intuition, unconscious",
    reversedMeaning: "Blocked emotions, confusion, fear",
    keywords: ["water", "flow", "intuition", "dreams"],
    detail: "Laguz is the lake, the sea, the deep well of the unconscious. the waters that sustain life and conceal what lies beneath. This is the rune of intuition, dreams, and the fluid intelligence that does not think but simply knows. It represents the emotional and psychic tides that move through life. When Laguz appears, trust your instincts. The rational mind cannot see what the depths already know. Let the current carry you.",
    reversedDetail: "Merkstave Laguz is the blocked spring. Emotions have been dammed, intuition clouded by fear, the unconscious locked behind a door you are afraid to open. Confusion reigns because you have cut yourself off from your own depth. The well is poisoned by unexpressed grief or terror. You must go down into the dark water before it clears.",
  },
  {
    id: 22, glyph: "ᛝ", name: "Ingwaz", letter: "NG",
    aett: 3, aettName: A3, element: "Earth", color: "#7b9a5a", tree: "Apple",
    deity: "Freyr",
    category: "Cleromancy & Sortilege",
    meaning: "Seed, fertility, inner growth, completion",
    reversedMeaning: "Infertility, stagnation, incomplete (upright only. no reverse)",
    keywords: ["seed", "fertility", "growth", "completion"],
    detail: "Ingwaz is the seed resting in the dark earth. the potential that needs no external action, only the patience to gestate. This is Ing, the earth god who walks among his people in peace. The rune represents the completion of an inner cycle, the storage of energy before emergence. When Ingwaz appears, nothing visible is happening, but everything is being prepared. The seed does not struggle to become a plant; it simply becomes what it is.",
    reversedDetail: "Ingwaz does not reverse. the seed in the ground has no orientation. In its shadow aspect, the seed has failed to germinate. The inner work has stalled, the gestation has become stagnation. You are sitting on potential that will not release. What is blocking the emergence? Sometimes it is fear of what the sprout will become.",
  },
  {
    id: 23, glyph: "ᛟ", name: "Othala", letter: "O",
    aett: 3, aettName: A3, element: "Earth", color: "#6b5b45", tree: "Oak",
    deity: "Frigga",
    category: "Cleromancy & Sortilege",
    meaning: "Homeland, inheritance, ancestry, sacred space",
    reversedMeaning: "Displacement, lost heritage, materialism",
    keywords: ["homeland", "inheritance", "ancestry", "home"],
    detail: "Othala is the ancestral land. the fenced field that has been in the family for generations, the sacred space that defines who you are. This is the rune of inheritance, both material and spiritual. It represents the legacy of those who came before and your responsibility to those who will come after. When Othala appears, matters of home, heritage, and belonging are central. Your roots are showing. Honor them.",
    reversedDetail: "When Othala reverses, the land has been lost. Displacement, dispossession, or the rejection of your heritage. You may be cut off from your family, your homeland, or your spiritual foundation. Materialism has replaced the sacred; the fence now imprisons rather than protects. Return to what is truly yours. not possessions but the values and traditions that shaped you.",
  },
  {
    id: 24, glyph: "ᛞ", name: "Dagaz", letter: "D",
    aett: 3, aettName: A3, element: "Fire", color: "#f0e68c", tree: "Ash",
    deity: "Odin",
    category: "Cleromancy & Sortilege",
    meaning: "Day, breakthrough, transformation, awakening",
    reversedMeaning: "Delay, setback, blindness (upright only. no reverse)",
    keywords: ["breakthrough", "transformation", "awakening", "day"],
    detail: "Dagaz is the dawn that breaks after the long night. not gradual morning but the sharp line of light on the horizon. This is the rune of radical transformation, the breakthrough that changes everything in an instant. It represents the awakening of consciousness, the moment of clarity that shifts your entire perspective. When Dagaz appears, the wait is over. The light is coming. Everything is about to change.",
    reversedDetail: "Dagaz does not reverse. dawn is dawn. But in shadow, the dawn is delayed, the breakthrough blocked, the blindness persisting beyond its natural term. You are still in the night, though the sun should have risen. Do not mistake the false dawn for the true one. The breakthrough will come, but perhaps not in the form you expect. Keep your eyes on the eastern sky.",
  },
];

export function getRandomRune(): { rune: RuneDef; reversed: boolean } {
  const rune = ELDER_FUTHARK[Math.floor(Math.random() * ELDER_FUTHARK.length)];
  const reversed = Math.random() < 0.5;
  return { rune, reversed };
}

export function getRuneById(id: number): RuneDef | undefined {
  return ELDER_FUTHARK.find((r) => r.id === id);
}

export type SpreadType = "odin" | "three_norns" | "five_cross" | "free_cast";

export interface SpreadPosition {
  name: string;
  subtitle: string;
  desc: string;
}

export const SPREAD_DEFS: Record<SpreadType, {
  label: string;
  icon: string;
  count: number;
  positions: SpreadPosition[];
  description: string;
}> = {
  odin: {
    label: "Odin's Rune",
    icon: "Eye",
    count: 1,
    description: "A single rune drawn for focused insight. The All-Father's own method. one cast, one truth. Best for daily guidance or a simple yes/no orientation.",
    positions: [
      { name: "The Oracle", subtitle: "Single focus", desc: "The central thread of your question. This rune carries the full weight of the answer. Study its shape, its element, its voice. it speaks for the whole." },
    ],
  },
  three_norns: {
    label: "Three Norns",
    icon: "Scroll",
    count: 3,
    description: "Three runes cast in sequence, corresponding to the three Norns who weave fate at the root of Yggdrasil. Past, present, and probable future. The story of a moment in three acts.",
    positions: [
      { name: "Urd", subtitle: "Past. what has shaped this moment", desc: "Urd weaves the past. the root cause, the events that created this terrain. Nothing arrives from nowhere; this rune reveals what came before." },
      { name: "Verdandi", subtitle: "Present. what is being woven now", desc: "Verdandi weaves the present. your active agency, the choices you are making now. This rune shows the current shape of your path." },
      { name: "Skuld", subtitle: "Future. where this path leads", desc: "Skuld weaves the probable future. not destiny but consequence. If nothing changes, this is where the thread leads. The future can still be rewoven." },
    ],
  },
  five_cross: {
    label: "Five-Rune Cross",
    icon: "Crosshair",
    count: 5,
    description: "A cross-shaped cast offering a full situational map. Each position reveals a different dimension of your question, from inner resources to hidden obstacles.",
    positions: [
      { name: "Center", subtitle: "Heart of the matter", desc: "The central issue. what this question is truly about beneath the surface." },
      { name: "East", subtitle: "What you bring. resources", desc: "Your tools, talents, and inner resources. What you carry into this situation that will serve you." },
      { name: "South", subtitle: "Aspiration. what calls you", desc: "Your highest aim, the goal that pulls you forward. The ideal outcome that guides your choices." },
      { name: "West", subtitle: "Challenge. what opposes", desc: "The obstacle, the shadow, the force that resists your progress. This is not an enemy but a teacher." },
      { name: "North", subtitle: "Foundation. what supports", desc: "The ground beneath your feet. your stability, your roots, what is already secure." },
    ],
  },
  free_cast: {
    label: "Free Cast",
    icon: "Sparkles",
    count: 0, // variable
    description: "Cast any number of runes (1-9) onto the cloth and read those that fall face-up. Clusters reveal connection, distances show separation. No structure. pure oracle.",
    positions: [],
  },
};
