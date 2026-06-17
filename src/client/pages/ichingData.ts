export interface TrigramDef {
  symbol: string;
  name: string;
  pinyin: string;
  chinese: string;
  binary: string;
  family: string;
  element: string;
  directionPost: string;
  attribute: string;
}

export const TRIGRAMS: Record<string, TrigramDef> = {
  qian: { symbol: "☰", name: "Heaven", pinyin: "Qián", chinese: "乾", binary: "111", family: "Father", element: "Metal", directionPost: "Northwest", attribute: "Creative, strong" },
  dui: { symbol: "☱", name: "Lake", pinyin: "Duì", chinese: "兌", binary: "110", family: "Youngest Daughter", element: "Metal", directionPost: "West", attribute: "Joyous, pleasure" },
  li: { symbol: "☲", name: "Fire", pinyin: "Lí", chinese: "離", binary: "101", family: "Middle Daughter", element: "Fire", directionPost: "South", attribute: "Clinging, radiance" },
  zhen: { symbol: "☳", name: "Thunder", pinyin: "Zhèn", chinese: "震", binary: "100", family: "Eldest Son", element: "Wood", directionPost: "East", attribute: "Arousing, movement" },
  xun: { symbol: "☴", name: "Wind", pinyin: "Xùn", chinese: "巽", binary: "011", family: "Eldest Daughter", element: "Wood", directionPost: "Southeast", attribute: "Gentle, penetrating" },
  kan: { symbol: "☵", name: "Water", pinyin: "Kǎn", chinese: "坎", binary: "010", family: "Middle Son", element: "Water", directionPost: "North", attribute: "Abysmal, danger" },
  gen: { symbol: "☶", name: "Mountain", pinyin: "Gèn", chinese: "艮", binary: "001", family: "Youngest Son", element: "Earth", directionPost: "Northeast", attribute: "Keeping still" },
  kun: { symbol: "☷", name: "Earth", pinyin: "Kūn", chinese: "坤", binary: "000", family: "Mother", element: "Earth", directionPost: "Southwest", attribute: "Receptive, yielding" },
};

export function trigramFromBinary(bin: string): TrigramDef {
  return Object.values(TRIGRAMS).find(t => t.binary === bin)!;
}

export function trigramFromName(name: string): TrigramDef {
  return TRIGRAMS[name.toLowerCase()];
}

export interface HexagramDef {
  number: number;
  name: string;
  pinyin: string;
  chinese: string;
  binary: string;
  lower: string;
  upper: string;
  judgment: string;
  image: string;
  lines: string[];
}

export const HEXAGRAMS: HexagramDef[] = [
  { number: 1, name: "The Creative", pinyin: "Qián", chinese: "乾", binary: "111111", lower: "qian", upper: "qian",
    judgment: "The Creative works sublime success, furthering through perseverance.",
    image: "The movement of heaven is full of power. Thus the superior man makes himself strong and untiring.",
    lines: ["Hidden dragon. Do not act.", "Dragon appearing in the field. It furthers one to see the great man.", "All day long the superior man is creatively active. At nightfall his mind is still beset with cares. Danger. No blame.", "Wavering flight over the depths. No blame.", "Flying dragon in the heavens. It furthers one to see the great man.", "Arrogant dragon will have cause to repent."] },
  { number: 2, name: "The Receptive", pinyin: "Kūn", chinese: "坤", binary: "000000", lower: "kun", upper: "kun",
    judgment: "The Receptive brings about sublime success, furthering through the perseverance of a mare.",
    image: "The earth's condition is receptive devotion. Thus the superior man who has breadth of character carries the outer world.",
    lines: ["Hoarfrost underfoot. Solid ice is near.", "Straight, square, great. Without purpose, nothing fails.", "Hidden lines. One is able to remain persevering. If by chance you are in the service of a king, seek not works, but bring to completion.", "A tied-up sack. No blame, no praise.", "A yellow lower garment. Supreme good fortune.", "Dragons fight in the meadow. Their blood is black and yellow."] },
  { number: 3, name: "Difficulty at the Beginning", pinyin: "Zhūn", chinese: "屯", binary: "100010", lower: "zhen", upper: "kan",
    judgment: "Difficulty at the Beginning works supreme success, furthering through perseverance.",
    image: "Clouds and thunder: the image of Difficulty at the Beginning. Thus the superior man brings order out of confusion.",
    lines: ["Hesitation and hindrance. It furthers one to remain persevering. It furthers one to appoint helpers.", "Difficulties pile up. Horse and wagon part. He is not a robber; he wants to woo when the time comes. The maiden is chaste, she does not pledge herself. Ten years. then she pledges herself.", "Whoever hunts deer without the forester only loses his way in the forest. The superior man understands the signs of the time and prefers to desist. To go on only brings humiliation.", "Horse and wagon part. Strive for union. To go brings good fortune. Everything acts to further.", "Difficulties in blessing. A little perseverance brings good fortune. Great perseverance brings misfortune.", "Horse and wagon part, tears of blood flow in streams."] },
  { number: 4, name: "Youthful Folly", pinyin: "Méng", chinese: "蒙", binary: "010001", lower: "kan", upper: "gen",
    judgment: "Youthful Folly has success. It is not I who seek the young fool; the young fool seeks me.",
    image: "A spring wells up at the foot of the mountain: the image of Youth. Thus the superior man fosters his character by thoroughness in all that he does.",
    lines: ["To make a fool develop it furthers one to apply discipline. The fetters should be removed. To go on in this way brings humiliation.", "To bear with fools in kindliness brings good fortune. To know how to take women brings good fortune. The son is capable of taking charge of the household.", "Take not a maiden who, when she sees a man of bronze, loses possession of herself. Nothing furthers.", "Entangled folly brings humiliation.", "Childlike folly brings good fortune.", "In punishing folly it does not further one to commit transgression. The only thing that furthers is to prevent transgressions."] },
  { number: 5, name: "Waiting (Nourishment)", pinyin: "Xū", chinese: "需", binary: "111010", lower: "qian", upper: "kan",
    judgment: "If you are sincere, you have light and success. Perseverance brings good fortune. It furthers one to cross the great water.",
    image: "Clouds rising up to heaven: the image of Waiting. Thus the superior man eats and drinks, is joyous and of good cheer.",
    lines: ["Waiting in the meadow. It furthers one to abide in what endures. No blame.", "Waiting on the sand. There is some gossip. The end brings good fortune.", "Waiting in the mud brings about the arrival of the enemy.", "Waiting in blood. Get out of the pit.", "Waiting at meat and drink. Perseverance brings good fortune.", "One falls into the pit. Three uninvited guests arrive. Honor them and in the end there will be good fortune."] },
  { number: 6, name: "Conflict", pinyin: "Sòng", chinese: "訟", binary: "010111", lower: "kan", upper: "qian",
    judgment: "Conflict. You are sincere and are being obstructed. A cautious halt half-way brings good fortune.",
    image: "Heaven and water go their opposite ways: the image of Conflict. Thus the superior man deals with things before they happen.",
    lines: ["If one does not perpetuate the matter, there will be a little gossip. In the end, good fortune comes.", "One cannot engage in conflict; one returns home, gives way. The people of his town, three hundred households, remain free of guilt. No blame.", "To nourish oneself on ancient virtue induces perseverance. Danger. In the end, good fortune comes. If by chance you are in the service of a king, seek not works.", "One cannot engage in conflict. One turns back and submits to fate, changes one's attitude, and finds peace in perseverance. Good fortune.", "To contend before him brings supreme good fortune.", "Even if by chance a leather belt is bestowed on one, by the end of a morning it will have been snatched away three times."] },
  { number: 7, name: "The Army", pinyin: "Shī", chinese: "師", binary: "010000", lower: "kan", upper: "kun",
    judgment: "The Army. The army needs perseverance and a strong man. Good fortune without blame.",
    image: "In the middle of the earth is water: the image of The Army. Thus the superior man increases his masses by generosity toward the people.",
    lines: ["An army must set forth in proper order. If the order is not good, misfortune threatens.", "In the midst of the army. Good fortune. No blame. The king bestows a triple decoration.", "Whoever carts up corpses in the army brings misfortune.", "The army retreats. No blame.", "There is game in the field. It furthers one to catch it. Without blame. Let the eldest lead the army. The younger transports corpses; then perseverance brings misfortune.", "The great ruler issues commands, founds states, vests families with fiefs. Inferior men should not be employed."] },
  { number: 8, name: "Holding Together", pinyin: "Bǐ", chinese: "比", binary: "000010", lower: "kun", upper: "kan",
    judgment: "Holding Together brings good fortune. Inquire of the oracle again whether you possess sublimity, constancy, and perseverance; then there is no blame.",
    image: "On the earth is water: the image of Holding Together. Thus the kings of antiquity bestowed the different states as fiefs and cultivated friendly relations with the feudal lords.",
    lines: ["Hold to him in truth and loyalty; this is without blame. Truth, like a full earthen bowl; thus in the end good fortune comes from without.", "Hold to him inwardly. Perseverance brings good fortune.", "You hold together with the wrong people.", "Hold to him outwardly also. Perseverance brings good fortune.", "The king's approach is like hunting. Yet there are also those who flee. The king's approach brings good fortune. Let the king approach his vassals, and let them receive the mandate. To the king's heart it is a great cause for joy.", "He finds no head for holding together. Misfortune."] },
  { number: 9, name: "The Taming Power of the Small", pinyin: "Xiǎo Chù", chinese: "小畜", binary: "111011", lower: "qian", upper: "xun",
    judgment: "The Taming Power of the Small has success. Dense clouds, no rain from our western region.",
    image: "The wind drives across heaven: the image of the Taming Power of the Small. Thus the superior man refines the outward aspect of his nature.",
    lines: ["Return to the way. How could there be blame in this? Good fortune.", "He allows himself to be drawn into returning. Good fortune.", "The spokes burst out of the wagon wheels. Man and wife roll their eyes.", "If you are sincere, blood vanishes and fear gives way. No blame.", "If you are sincere and loyally attached, you are rich in your neighbor.", "The rain comes, there is an end to restraint. This is due to the lasting influence of the character. Perseverance brings danger. The moon is almost full. If the superior man persists, misfortune comes."] },
  { number: 10, name: "Treading (Conduct)", pinyin: "Lǚ", chinese: "履", binary: "110111", lower: "dui", upper: "qian",
    judgment: "Treading upon the tail of the tiger. It does not bite the man. Success.",
    image: "Heaven above, the lake below: the image of Treading. Thus the superior man discriminates between high and low, and thereby fortifies the thinking of the people.",
    lines: ["Simple conduct. Progress without blame.", "Treading a smooth, level course. The perseverance of a dark man brings good fortune.", "A one-eyed man is able to see, a lame man is able to tread. He treads on the tail of a tiger. The tiger bites the man. Misfortune. This is indeed a warrior.", "He treads on the tail of a tiger. Caution and circumspection lead ultimately to good fortune.", "Resolute conduct. Perseverance with awareness of danger brings good fortune.", "Look to your conduct and weigh the favorable signs. When everything is fulfilled, supreme good fortune comes."] },
  { number: 11, name: "Peace", pinyin: "Tài", chinese: "泰", binary: "111000", lower: "qian", upper: "kun",
    judgment: "Peace. The small departs, the great approaches. Good fortune. Success.",
    image: "Heaven and earth unite: the image of Peace. Thus the ruler divides and completes the course of heaven and earth.",
    lines: ["When ribbon grass is pulled up, the sod comes with it. Each according to his kind. Undertakings bring good fortune.", "Bearing with the uncultured in gentleness, fording the river with resolution, not neglecting what is distant, not regarding one's companions: thus one may walk in the middle.", "No plain not followed by a slope. No going not followed by a return. He who remains persevering in danger is without blame. Do not complain about this truth; enjoy the good fortune you still have.", "He flutters down, not boasting of his wealth, together with his neighbor, guileless and sincere.", "The sovereign I gives his daughter in marriage. This brings blessing and supreme good fortune.", "The wall falls back into the moat. Use no army now. Make your commands known within your own town. Perseverance brings humiliation."] },
  { number: 12, name: "Standstill (Stagnation)", pinyin: "Pǐ", chinese: "否", binary: "000111", lower: "kun", upper: "qian",
    judgment: "Standstill. Evil people do not further the perseverance of the superior man. The great departs, the small approaches.",
    image: "Heaven and earth do not unite: the image of Standstill. Thus the superior man falls back upon his inner worth in order to escape the difficulties.",
    lines: ["When ribbon grass is pulled up, the sod comes with it. Each according to his kind. Perseverance brings good fortune and success.", "They bear and endure; this also means good fortune. The standstill serves to help the inferior people. To be like this brings good fortune.", "They bear shame.", "He who acts at the command of the highest remains without blame. Those of like mind partake of the blessing.", "Standstill is giving way. For the great man it brings good fortune. 'What if it should fail, what if it should fail?' In this way he ties it to a cluster of mulberry shoots.", "The standstill comes to an end. First standstill, then good fortune."] },
  { number: 13, name: "Fellowship with Men", pinyin: "Tóng Rén", chinese: "同人", binary: "101111", lower: "li", upper: "qian",
    judgment: "Fellowship with Men in the open. Success. It furthers one to cross the great water. The perseverance of the superior man furthers.",
    image: "Heaven together with fire: the image of Fellowship. Thus the superior man organizes the clans and makes distinctions between things.",
    lines: ["Fellowship with men at the gate. No blame.", "Fellowship with men in the clan. Humiliation.", "Hidden arms in the thicket. He climbs the high hill in front of it. For three years he does not rise up.", "He climbs up on his wall; he cannot attack. Good fortune.", "Men bound in fellowship first weep and lament, but afterward they laugh. After great struggles they succeed in meeting.", "Fellowship with men in the meadow. No remorse."] },
  { number: 14, name: "Possession in Great Measure", pinyin: "Dà Yǒu", chinese: "大有", binary: "111101", lower: "qian", upper: "li",
    judgment: "Possession in Great Measure. Supreme success.",
    image: "Fire in heaven above: the image of Possession in Great Measure. Thus the superior man curbs evil and furthers good, and thereby obeys the benevolent will of heaven.",
    lines: ["No relationship with what is harmful; this is not blame. If we remain conscious of difficulty, we remain without blame.", "A big wagon for loading. One may undertake something. No blame.", "A prince offers it to the Son of Heaven. A petty man cannot do this.", "He makes a difference between himself and his neighbor. No blame.", "His sincerity is conspicuous to all. Thus he wins respect. Good fortune.", "He is blessed by heaven. Good fortune. Nothing that does not further."] },
  { number: 15, name: "Modesty", pinyin: "Qiān", chinese: "謙", binary: "001000", lower: "gen", upper: "kun",
    judgment: "Modesty creates success. The superior man carries things through.",
    image: "Within the earth, a mountain: the image of Modesty. Thus the superior man reduces that which is too much and augments that which is too little.",
    lines: ["A superior man who is modest about his modesty may cross the great water. Good fortune.", "Modesty that finds expression. Perseverance brings good fortune.", "A superior man of modesty and merit carries things to conclusion. Good fortune.", "Nothing that would not further modesty in movement.", "He may, because of his wealth, make his neighbor aggressive. It furthers one to attack him. Nothing that would not further.", "Modesty that comes to expression. It furthers one to set armies marching to chastise one's own city and one's country."] },
  { number: 16, name: "Enthusiasm", pinyin: "Yù", chinese: "豫", binary: "000100", lower: "kun", upper: "zhen",
    judgment: "Enthusiasm. It furthers one to install helpers and set armies marching.",
    image: "Thunder comes resounding out of the earth: the image of Enthusiasm. Thus the ancient kings made music in order to honor merit.",
    lines: ["An enthusiastic attitude that expresses itself brings misfortune.", "Firm as a rock. Not a whole day. Perseverance brings good fortune.", "An enthusiastic attitude looks upward; an enthusiastic attitude looks downward. Remorse.", "The source of enthusiasm. He achieves great things. Doubt not. You gather friends around you as a hair clasp gathers the hair.", "Persistently ill, and still he does not die.", "Enthusiasm that is at the end. The result is misfortune."] },
  { number: 17, name: "Following", pinyin: "Suí", chinese: "隨", binary: "100110", lower: "zhen", upper: "dui",
    judgment: "Following has supreme success. Perseverance furthers. No blame.",
    image: "Thunder in the lake: the image of Following. Thus the superior man at nightfall goes indoors for rest and recuperation.",
    lines: ["The standard is changing. Perseverance brings good fortune. To go out of the door in company produces deeds.", "If one clings to the little boy, one loses the strong man.", "If one clings to the strong man, one loses the little boy. Through following one finds what one seeks. It furthers one to remain persevering.", "Following creates success. Perseverance brings good fortune. To tarry in this preserves no blame. If one is sincere, the path is clear.", "Sincere in the good. Good fortune.", "He meets with firm allegiance and is still further bound. The king introduces him to the Western Mountain."] },
  { number: 18, name: "Work on What Has Been Spoiled (Decay)", pinyin: "Gǔ", chinese: "蠱", binary: "011001", lower: "xun", upper: "gen",
    judgment: "Work on What Has Been Spoiled has supreme success. It furthers one to cross the great water.",
    image: "The wind blows low on the mountain: the image of Decay. Thus the superior man stirs up the people and strengthens their spirit.",
    lines: ["Setting right what has been spoiled by the father. If there is a son, no blame remains. Danger, but in the end good fortune.", "Setting right what has been spoiled by the mother. One must not be too persevering.", "Setting right what has been spoiled by the father. There will be a little remorse. No great blame.", "Tolerating what has been spoiled by the father. In looking up you see shortcomings.", "Setting right what has been spoiled by the father. One meets with praise.", "He does not serve kings and princes, sets himself higher goals."] },
  { number: 19, name: "Approach", pinyin: "Lín", chinese: "臨", binary: "110000", lower: "dui", upper: "kun",
    judgment: "Approach has supreme success. Perseverance furthers. When the eighth month comes, there will be misfortune.",
    image: "The earth above the lake: the image of Approach. Thus the superior man is inexhaustible in his will to teach.",
    lines: ["Joint approach. Perseverance brings good fortune.", "Joint approach. Good fortune. Everything furthers.", "Comfortable approach. Nothing that would further. If one is induced to grieve over it, one becomes free of blame.", "Complete approach. No blame.", "Wise approach. This is right for a great prince. Good fortune.", "Greathearted approach. Good fortune. No blame."] },
  { number: 20, name: "Contemplation (View)", pinyin: "Guān", chinese: "觀", binary: "000011", lower: "kun", upper: "xun",
    judgment: "Contemplation. The ablution has been made, but not yet the offering.",
    image: "The wind blows over the earth: the image of Contemplation. Thus the kings of old made the rounds of the four quarters of the kingdom.",
    lines: ["Boylike contemplation. For an inferior man, no blame. For a superior man, humiliation.", "Contemplation through the crack of the door. Furthering for the perseverance of a woman.", "Contemplation of my life decides the choice of advance or retreat.", "Contemplation of the light of the kingdom. It furthers one to exert influence as the guest of a king.", "Contemplation of my life. The superior man is without blame.", "He contemplates his own course. Then the superior man is without blame."] },
  { number: 21, name: "Biting Through", pinyin: "Shì Kè", chinese: "噬嗑", binary: "100101", lower: "zhen", upper: "li",
    judgment: "Biting Through has success. It is favorable to let justice be administered.",
    image: "Thunder and lightning: the image of Biting Through. Thus the kings of former times made firm the laws through clearly defined penalties.",
    lines: ["His feet are fastened in the stocks, so that his toes disappear. No blame.", "Bites through tender meat, so that his nose disappears. No blame.", "Bites on old dried meat and strikes on something poisonous. Small humiliation. No blame.", "Bites on dried gristle. He receives metal arrows. It furthers one to be mindful of difficulties and to be persevering. Good fortune.", "Bites on dried lean meat. He receives yellow gold. Perseveringly aware of danger, no blame.", "His neck is fastened in the wooden cangue, so that his ears disappear. Misfortune."] },
  { number: 22, name: "Grace", pinyin: "Bì", chinese: "賁", binary: "101001", lower: "li", upper: "gen",
    judgment: "Grace has success. In small matters it furthers one to undertake something.",
    image: "Fire at the foot of the mountain: the image of Grace. Thus does the superior man proceed when investigating a point of law.",
    lines: ["He lends grace to his toes, leaves the carriage and walks.", "Lends grace to the beard on his chin.", "Graceful and moist. Constant perseverance brings good fortune.", "Grace or simplicity? A white horse comes as if on wings. He is not a robber, he will woo at the right time.", "Grace in the hills and gardens. The roll of silk is meager and small. Humiliation, but in the end good fortune.", "Simple grace. No blame."] },
  { number: 23, name: "Splitting Apart", pinyin: "Bō", chinese: "剝", binary: "000001", lower: "kun", upper: "gen",
    judgment: "Splitting Apart. It does not further one to undertake anything.",
    image: "The mountain rests on the earth: the image of Splitting Apart. Thus those above can insure their position only by giving generously to those below.",
    lines: ["The leg of the bed is split. Those who persevere are destroyed. Misfortune.", "The bed is split at the edges. Those who persevere are destroyed. Misfortune.", "He splits with them. No blame.", "The bed is split up to the skin. Misfortune.", "A shoal of fishes. Favor comes through the court ladies. Everything acts to further.", "There is a large fruit still uneaten. The superior man receives a carriage. The house of the inferior man is split apart."] },
  { number: 24, name: "Return (The Turning Point)", pinyin: "Fù", chinese: "復", binary: "100000", lower: "zhen", upper: "kun",
    judgment: "Return. Success. Going out and coming in without error. Friends come without blame.",
    image: "Thunder within the earth: the image of the Turning Point. Thus the kings of antiquity closed the passes at the winter solstice.",
    lines: ["Return from a short distance. No need for remorse. Great good fortune.", "Quiet return. Good fortune.", "Repeated return. Danger. No blame.", "Walking in the midst of others, one returns alone.", "Noblehearted return. No remorse.", "Missing the return. Misfortune. Misfortune for both country and ruler."] },
  { number: 25, name: "Innocence (The Unexpected)", pinyin: "Wú Wàng", chinese: "無妄", binary: "100111", lower: "zhen", upper: "qian",
    judgment: "Innocence. Supreme success. Perseverance furthers. If someone is not as he should be, he has misfortune.",
    image: "Under heaven thunder rolls: all is not at peace. Thus the superior man, in a time of unspoiled innocence, nourishes his character.",
    lines: ["Innocent behavior brings good fortune.", "If one does not count on the harvest while plowing, nor on the use of the ground while clearing it, it furthers one to undertake something.", "Undeserved misfortune. The cow that was tethered is the wanderer's gain, the citizen's loss.", "He who can be persevering remains without blame.", "Use no medicine in an illness incurred through no fault of your own. It will pass of itself.", "Innocent action brings misfortune. Nothing furthers."] },
  { number: 26, name: "The Taming Power of the Great", pinyin: "Dà Chù", chinese: "大畜", binary: "111001", lower: "qian", upper: "gen",
    judgment: "The Taming Power of the Great. Perseverance furthers. It furthers one to cross the great water.",
    image: "Heaven within the mountain: the image of the Taming Power of the Great. Thus the superior man acquaints himself with many sayings of antiquity.",
    lines: ["Danger is at hand. It furthers one to desist.", "The axletree is taken from the wagon.", "A good horse that follows others. Awareness of danger, with perseverance, brings good fortune. Practice chariot driving and armed defense daily. It furthers one to have somewhere to go.", "The headboard of a young bull. Great good fortune.", "The tusk of a gelded boar. Good fortune.", "One attains the way of heaven. Success."] },
  { number: 27, name: "The Corners of the Mouth (Providing Nourishment)", pinyin: "Yí", chinese: "頤", binary: "100001", lower: "zhen", upper: "gen",
    judgment: "The Corners of the Mouth. Perseverance brings good fortune. Pay heed to the providing of nourishment.",
    image: "At the foot of the mountain, thunder: the image of Nourishment. Thus the superior man is careful of his words and temperate in eating and drinking.",
    lines: ["You let your magic tortoise go and look at me with the corners of your mouth drooping. Misfortune.", "Turning to the summit for nourishment. Deviating from the path to seek nourishment from the hill. Continuing this brings misfortune.", "Turning away from nourishment. Perseverance brings misfortune. Do not act thus for ten years. Nothing serves to further.", "Tiger look, with desperate intensity. The desire to pursue. No blame.", "Turning away from the path. To remain persevering brings good fortune. One should not cross the great water.", "The source of nourishment. Awareness of danger brings good fortune. It furthers one to cross the great water."] },
  { number: 28, name: "Preponderance of the Great", pinyin: "Dà Guò", chinese: "大過", binary: "011110", lower: "xun", upper: "dui",
    judgment: "Preponderance of the Great. The ridgepole sags to the breaking point. It furthers one to have somewhere to go. Success.",
    image: "The lake rises above the trees: the image of Preponderance of the Great. Thus the superior man, when he stands alone, is unconcerned.",
    lines: ["To spread white rushes underneath. No blame.", "A withered poplar puts forth a shoot. An older man takes a young wife. Everything furthers.", "The ridgepole sags to the breaking point. Misfortune.", "The ridgepole is braced. Good fortune. If there are ulterior motives, it is humiliating.", "A withered poplar puts forth flowers. An older woman takes a young husband. No blame. No praise.", "One must go through the water. It goes over one's head. Misfortune. No blame."] },
  { number: 29, name: "The Abysmal (Water)", pinyin: "Kǎn", chinese: "坎", binary: "010010", lower: "kan", upper: "kan",
    judgment: "The Abysmal repeated. If you are sincere, you have success in your heart, and whatever you do succeeds.",
    image: "Water flows on incessantly and reaches its goal: the image of the Abysmal repeated. Thus the superior man walks in lasting virtue.",
    lines: ["Repetition of the Abysmal. In the abyss one falls into a pit. Misfortune.", "The abyss is dangerous. One should strive to attain small things only.", "Forward and backward, abyss on abyss. In danger like this, pause at first and wait, otherwise you will fall into a pit. Do not act this way.", "A jug of wine, a bowl of rice with it; vessels simply made of clay. This can be offered simply from the window. There is certainly no blame in this.", "The abyss is not filled to overflowing; it is only filled to the rim. No blame.", "Bound with cords and ropes, shut in between thorn-hedged prison walls. For three years one does not find the way. Misfortune."] },
  { number: 30, name: "The Clinging, Fire", pinyin: "Lí", chinese: "離", binary: "101101", lower: "li", upper: "li",
    judgment: "The Clinging. Perseverance furthers. It brings success. Care of the cow brings good fortune.",
    image: "That which is bright rises twice: the image of Fire. Thus the great man, by perpetuating this brightness, illuminates the four quarters of the world.",
    lines: ["The footprints run crisscross. If one is seriously intent, no blame.", "Yellow light. Supreme good fortune.", "In the light of the setting sun, men either beat the pot and sing or loudly bewail the approach of old age. Misfortune.", "How sudden it comes! It burns, dies, is cast away.", "Tears in floods, sighing and lamenting. Good fortune.", "The king uses him to march forth and chastise. Then it is best to kill the leaders and take captive the followers. No blame."] },
  { number: 31, name: "Influence (Wooing)", pinyin: "Xián", chinese: "咸", binary: "001110", lower: "gen", upper: "dui",
    judgment: "Influence. Success. Perseverance furthers. To take a maiden to wife brings good fortune.",
    image: "A lake on the mountain: the image of Influence. Thus the superior man holds himself receptive.",
    lines: ["The influence shows itself in the big toe.", "The influence shows itself in the calves of the legs. Misfortune. Tarrying brings good fortune.", "The influence shows itself in the thighs. Holds to that which follows. To continue is humiliating.", "Perseverance brings good fortune. Remorse disappears. If a man is agitated in mind, and his thoughts go hither and thither, only those friends on whom he fixes his conscious thoughts will follow.", "The influence shows itself in the back of the neck. No remorse.", "The influence shows itself in the jaws, cheeks, and tongue."] },
  { number: 32, name: "Duration", pinyin: "Héng", chinese: "恆", binary: "011100", lower: "xun", upper: "zhen",
    judgment: "Duration. Success. No blame. Perseverance furthers. It furthers one to have somewhere to go.",
    image: "Thunder and wind: the image of Duration. Thus the superior man stands firm and does not change his direction.",
    lines: ["Too deep a desire for duration brings misfortune. Nothing that would further.", "Remorse disappears.", "He who does not give duration to his character meets with disgrace. Persistent humiliation.", "No game in the field.", "Giving duration to one's character through perseverance. This is good fortune for a woman, misfortune for a man.", "Restlessness as a permanent state brings misfortune."] },
  { number: 33, name: "Retreat", pinyin: "Dùn", chinese: "遯", binary: "001111", lower: "gen", upper: "qian",
    judgment: "Retreat. Success. In small matters perseverance furthers.",
    image: "Mountain under heaven: the image of Retreat. Thus the superior man keeps the inferior man at a distance.",
    lines: ["At the tail in retreat. This is dangerous. One must not wish to undertake anything.", "He holds him fast with yellow oxhide. No one can tear him loose.", "A halted retreat is nerve-wracking and dangerous. To retain people as men-and-maidservants brings good fortune.", "Voluntary retreat brings good fortune to the superior man and downfall to the inferior man.", "Friendly retreat. Perseverance brings good fortune.", "Cheerful retreat. Everything serves to further."] },
  { number: 34, name: "The Power of the Great", pinyin: "Dà Zhuàng", chinese: "大壯", binary: "111100", lower: "qian", upper: "zhen",
    judgment: "The Power of the Great. Perseverance furthers.",
    image: "Thunder in heaven above: the image of the Power of the Great. Thus the superior man does not tread upon paths that do not accord with proper order.",
    lines: ["Power in the toes. Going brings misfortune. This is certainly true.", "Perseverance brings good fortune.", "The inferior man works through power. The superior man does not act thus. To continue is dangerous. A goat butts against a hedge and gets its horns entangled.", "Perseverance brings good fortune. Remorse disappears. The hedge opens; there is no entanglement. Power depends upon the axletree of a big wagon.", "One loses the goat with ease. No remorse.", "A goat butts against a hedge. It cannot go backward, it cannot go forward. Nothing serves to further. If one notes the difficulty, this brings good fortune."] },
  { number: 35, name: "Progress", pinyin: "Jìn", chinese: "晉", binary: "000101", lower: "kun", upper: "li",
    judgment: "Progress. The powerful prince is honored with horses in large numbers. He is granted audience three times in a day.",
    image: "The sun rises over the earth: the image of Progress. Thus the superior man brightens his bright virtue.",
    lines: ["Progressing, but turned back. Perseverance brings good fortune. If one meets with no confidence, one should remain calm. No mistake.", "Progressing, but in sorrow. Perseverance brings good fortune. One obtains great happiness from one's ancestress.", "All are in accord. Remorse disappears.", "Progressing like a hamster. Perseverance brings danger.", "Remorse disappears. Take not gain and loss to heart. Undertakings bring good fortune. Everything serves to further.", "Progressing with the horns is permissible only for the purpose of punishing one's own city. To be conscious of danger brings good fortune. No blame. Perseverance brings humiliation."] },
  { number: 36, name: "Darkening of the Light", pinyin: "Míng Yí", chinese: "明夷", binary: "101000", lower: "li", upper: "kun",
    judgment: "Darkening of the Light. In adversity it furthers one to be persevering.",
    image: "The light has sunk into the earth: the image of Darkening of the Light. Thus the superior man lives with the great mass of men and veils his light.",
    lines: ["Darkening of the light during flight. He lowers his wings. The superior man does not eat for three days on his wanderings. But he has somewhere to go. The host has occasion to gossip about him.", "Darkening of the light injures him in the left thigh. He gives help by means of his strength. Good fortune.", "Darkening of the light during the hunt in the south. Their great leader is captured. One must not expect perseverance too soon.", "He penetrates the left side of the belly. One gets at the very heart of the darkening of the light, and leaves gate and courtyard.", "Darkening of the light as with Prince Ji. Perseverance furthers.", "Not light but darkness. First he climbed up to heaven, later he plunged into the depths of the earth."] },
  { number: 37, name: "The Family (The Clan)", pinyin: "Jiā Rén", chinese: "家人", binary: "101011", lower: "li", upper: "xun",
    judgment: "The Family. The perseverance of the woman furthers.",
    image: "Wind comes forth from fire: the image of the Family. Thus the superior man has substance in his words and duration in his way of life.",
    lines: ["Firm seclusion within the family. Remorse disappears.", "She should not follow her whims. She should attend to the food within the household. Perseverance brings good fortune.", "When tempers flare up in the family, too great severity brings remorse. Good fortune nonetheless. When woman and child giggle and titter, in the end it leads to humiliation.", "She is the treasure of the house. Great good fortune.", "As a king he approaches his family. Fear not. Good fortune.", "His work commands respect. In the end good fortune comes."] },
  { number: 38, name: "Opposition", pinyin: "Kuí", chinese: "睽", binary: "110101", lower: "dui", upper: "li",
    judgment: "Opposition. In small matters, good fortune.",
    image: "Above, fire; below, lake: the image of Opposition. Thus amid all fellowship the superior man retains his individuality.",
    lines: ["Remorse disappears. If you lose your horse, do not run after it; it will come back of its own accord. When you see evil people, guard yourself against mistakes.", "One meets his lord in a narrow street. No blame.", "One sees his wagon dragged back, his oxen halted, his hair and nose cut off. Not a good beginning, but a good end.", "Isolated through opposition, one meets a like-minded man with whom one can associate in good faith. Despite the danger, no blame.", "Remorse disappears. The companion bites his way through the wrappings. If one goes to him, how could it be a mistake?", "Isolated through opposition, one sees one's companion as a pig covered with dirt, as a wagon full of devils. First one draws a bow against him, then one lays the bow aside. He is not a robber; he will woo at the right time. As he goes, rain falls; then good fortune comes."] },
  { number: 39, name: "Obstruction", pinyin: "Jiǎn", chinese: "蹇", binary: "001010", lower: "gen", upper: "kan",
    judgment: "Obstruction. The southwest furthers. The northeast does not further. It furthers one to see the great man. Perseverance brings good fortune.",
    image: "Water on the mountain: the image of Obstruction. Thus the superior man turns his attention to himself and molds his character.",
    lines: ["Going leads to obstructions, coming meets with praise.", "The king's servant is beset with obstruction upon obstruction, but it is not his own fault.", "Going leads to obstructions; therefore he comes back.", "Going leads to obstructions, coming leads to union.", "In the midst of the greatest obstructions, friends come.", "Going leads to obstructions, coming leads to great good fortune. It furthers one to see the great man."] },
  { number: 40, name: "Deliverance", pinyin: "Xiè", chinese: "解", binary: "010100", lower: "kan", upper: "zhen",
    judgment: "Deliverance. The southwest furthers. If there is no longer anything where it is necessary to go, return brings good fortune. If there is still something where it is necessary to go, hastening brings good fortune.",
    image: "Thunder and rain set in: the image of Deliverance. Thus the superior man pardons mistakes and forgives misdeeds.",
    lines: ["Without blame.", "One kills three foxes in the field and receives a yellow arrow. Perseverance brings good fortune.", "If a man carries a burden on his back and rides in a carriage, he thereby encourages robbers. Perseverance leads to humiliation.", "Deliver yourself of your own little faults. Only then can you help other men.", "If only the superior man can deliver himself, it brings good fortune. He proves to the inferior men that he is in earnest.", "The prince shoots at a hawk on a high wall. He kills it. Everything serves to further."] },
  { number: 41, name: "Decrease", pinyin: "Sǔn", chinese: "損", binary: "110001", lower: "dui", upper: "gen",
    judgment: "Decrease combined with sincerity brings about supreme good fortune without blame. One may be persevering in this. It furthers one to undertake something.",
    image: "At the foot of the mountain, the lake: the image of Decrease. Thus the superior man controls his anger and restrains his instincts.",
    lines: ["Going quickly when one has finished one's work is without blame. But one must reflect on how much one may decrease others.", "Perseverance furthers. To undertake something brings misfortune. Without decreasing oneself, one is able to bring increase to others.", "When three people journey together, their number decreases by one. When one man journeys alone, he finds a companion.", "If a man decreases his faults, it makes the other hasten to come and rejoice. No blame.", "One may increase the store of ten pairs of tortoise shells. One may be given a high rank. Supreme good fortune.", "If one is increased without depriving others, there is no blame. Perseverance brings good fortune. It furthers one to undertake something. One obtains helpers but not as servants."] },
  { number: 42, name: "Increase", pinyin: "Yì", chinese: "益", binary: "100011", lower: "zhen", upper: "xun",
    judgment: "Increase. It furthers one to undertake something. It furthers one to cross the great water.",
    image: "Wind and thunder: the image of Increase. Thus the superior man, when he sees good, imitates it; when he has faults, rids himself of them.",
    lines: ["It furthers one to accomplish great deeds. Supreme good fortune. No blame.", "One is enriched. Ten pairs of tortoise shells cannot oppose it. Constant perseverance brings good fortune. The king presents him before God. Good fortune.", "One is enriched through unfortunate events. No blame, if one is sincere and walks in the middle and reports with a seal to the prince.", "If one walks in the middle and reports to the prince, he will follow. It furthers one to be used in the removal of the capital.", "If in truth you have a kind heart, ask not. Supreme good fortune. Truly, kindness will be recognized as your virtue.", "He brings increase to no one. Someone will even strike him. He does not keep his heart constantly steady. Misfortune."] },
  { number: 43, name: "Breakthrough (Resoluteness)", pinyin: "Guài", chinese: "夬", binary: "111110", lower: "qian", upper: "dui",
    judgment: "Breakthrough. One must resolutely make the matter known at the court of the king. It must be announced truthfully. Danger.",
    image: "The lake has risen up to heaven: the image of Breakthrough. Thus the superior man dispenses riches downward and refrains from resting on his virtue.",
    lines: ["Mighty in the forward-striding toes. When one goes and is not equal to the task, one makes a mistake.", "A cry of alarm. Arms are taken up against the enemy. Evening brings misfortune. No blame.", "To be powerful in one's cheekbones brings misfortune. The superior man is firmly determined. He walks alone and is caught in the rain. He is bespattered, and people grumble. No blame.", "There is no skin on his thighs, and walking comes hard. If a man were to let himself be led like a sheep, remorse would disappear. But if these words are heard they will not be believed.", "In dealing with weeds, resolute determination is necessary. Walking in the middle remains free of blame.", "No cry. In the end misfortune comes."] },
  { number: 44, name: "Coming to Meet", pinyin: "Gòu", chinese: "姤", binary: "011111", lower: "xun", upper: "qian",
    judgment: "Coming to Meet. The maiden is powerful. One should not marry such a maiden.",
    image: "Under heaven, wind: the image of Coming to Meet. Thus the ruler spreads his commands and promulgates them throughout the four quarters.",
    lines: ["It must be checked with a brake of bronze. Perseverance brings good fortune. If one lets things take their course, one experiences misfortune. Even a lean pig has it in him to rage around.", "There is a fish in the tank. It does not further to reach guests.", "There is no skin on his thighs, and walking comes hard. If one is mindful of the danger, no great blame is incurred.", "No fish in the tank. This leads to misfortune.", "A melon covered with willow leaves. Hidden lines. Then it drops down to one from heaven.", "He comes to meet with his horns. Humiliation, no blame."] },
  { number: 45, name: "Gathering Together (Massing)", pinyin: "Cuì", chinese: "萃", binary: "000110", lower: "kun", upper: "dui",
    judgment: "Gathering Together. Success. The king approaches his temple. It furthers one to see the great man. This brings success. Perseverance furthers.",
    image: "Over the earth, the lake: the image of Gathering Together. Thus the superior man renews his weapons in order to meet the unforeseen.",
    lines: ["If you are sincere, but not to the end, there will now be confusion, now gathering together. If you call out, then after one grasp of the hand you will laugh again. Regret not. Going is without blame.", "Letting oneself be drawn brings good fortune and remains without blame. If one is sincere, it furthers one to bring even a small offering.", "Gathering together amid sighs. Nothing that would further. Going is without blame. Small humiliation.", "Great good fortune. No blame.", "If one is gathering together, one attains a leading position. No blame. If one is not completely sincere, one must be great and good to become blameless.", "Sighing and weeping, floods of tears. No blame."] },
  { number: 46, name: "Pushing Upward", pinyin: "Shēng", chinese: "升", binary: "011000", lower: "xun", upper: "kun",
    judgment: "Pushing Upward has supreme success. One must see the great man. Fear not. Departure toward the south brings good fortune.",
    image: "Within the earth, wood grows upward: the image of Pushing Upward. Thus the superior man accumulates small things in order to achieve high and great things.",
    lines: ["Sincere pushing upward. Great good fortune.", "If one is sincere, it furthers one to bring even a small offering. No blame.", "One pushes upward into an empty city.", "The king offers him the mountain Ch'i. Good fortune. No blame.", "Perseverance brings good fortune. One pushes upward by degrees.", "Invisible pushing upward. It furthers one to be unremittingly persevering."] },
  { number: 47, name: "Oppression (Exhaustion)", pinyin: "Kùn", chinese: "困", binary: "010110", lower: "kan", upper: "dui",
    judgment: "Oppression. Success. Perseverance. The great man brings about good fortune. No blame.",
    image: "The lake has no water left: the image of Oppression. Thus the superior man stakes his life on following his will.",
    lines: ["One sits oppressed under a bare tree and strays into a gloomy valley. For three years one sees nothing.", "One is oppressed while at meat and drink. The man with the scarlet knee bands is just coming. It furthers one to offer sacrifice. To set forth brings misfortune. No blame.", "One lets oneself be oppressed by stones, and leans on thorns and thistles. Enters his house and does not see his wife. Misfortune.", "He comes very quietly, oppressed in a golden carriage. Humiliation, but the end is reached.", "His nose and feet are cut off. Oppression at the hands of the man with the scarlet knee bands. Joy comes softly. It furthers one to make offerings and libations.", "He is oppressed by creeping vines. He moves uncertainly and says, 'Movement brings remorse.' If one feels remorse over this and makes a start, good fortune comes."] },
  { number: 48, name: "The Well", pinyin: "Jǐng", chinese: "井", binary: "011010", lower: "xun", upper: "kan",
    judgment: "The Well. The town may be changed, but the well cannot be changed. It neither decreases nor increases.",
    image: "Water over wood: the image of the Well. Thus the superior man encourages the people at their work and exhorts them to help one another.",
    lines: ["One does not drink the mud of the well. No animals come to an old well.", "At the wellhole one shoots fishes. The jug is broken and leaks.", "The well is cleaned but no one drinks from it. This is my heart's sorrow, for one might draw from it. If the king were clear-minded, good fortune might be enjoyed in common.", "The well is being lined. No blame.", "A clear, cold spring from which one can drink. Good fortune.", "One draws from the well without hindrance. It is dependable. Supreme good fortune."] },
  { number: 49, name: "Revolution (Molting)", pinyin: "Gé", chinese: "革", binary: "101110", lower: "li", upper: "dui",
    judgment: "Revolution. On your own day you are believed. Supreme success, furthering through perseverance. Remorse disappears.",
    image: "Fire in the lake: the image of Revolution. Thus the superior man sets the calendar in order and makes the seasons clear.",
    lines: ["Wrapped in the hide of a yellow cow.", "When one's own day comes, one may create revolution. Starting brings good fortune. No blame.", "Starting brings misfortune. Perseverance brings danger. When talk of revolution has gone the rounds three times, one may commit himself, and men will believe him.", "Remorse disappears. He is believed. He changes the form of government. Good fortune.", "The great man changes like a tiger. Even before he questions, he is believed.", "The superior man changes like a panther. The inferior man molts in the face. Starting brings misfortune. To remain persevering brings good fortune."] },
  { number: 50, name: "The Cauldron", pinyin: "Dǐng", chinese: "鼎", binary: "011101", lower: "xun", upper: "li",
    judgment: "The Cauldron. Supreme good fortune. Success.",
    image: "Fire over wood: the image of the Cauldron. Thus the superior man consolidates his fate by making his position correct.",
    lines: ["A cauldron with legs upturned. Furthers removal of stagnating stuff. One takes a concubine for the sake of her son. No blame.", "There is food in the cauldron. My comrades are envious, but they cannot harm me. Good fortune.", "The handle of the cauldron is altered. One is impeded in his way of life. The fat of the pheasant is not eaten. Once rain falls, remorse is spent. Good fortune comes in the end.", "The legs of the cauldron are broken. The prince's meal is spilled and his person is soiled. Misfortune.", "The cauldron has yellow ears, golden carrying rings. Perseverance furthers.", "The cauldron has jade rings. Great good fortune. Nothing that would not further."] },
  { number: 51, name: "The Arousing (Shock, Thunder)", pinyin: "Zhèn", chinese: "震", binary: "100100", lower: "zhen", upper: "zhen",
    judgment: "The Arousing brings success. Shock comes. oh, oh! Then there is laughter. ha, ha! The shock terrifies for a hundred miles, and he does not let fall the sacrificial spoon and chalice.",
    image: "Thunder repeated: the image of Shock. Thus the superior man is fearful and apprehensive, improves his life, and examines himself.",
    lines: ["Shock comes. oh, oh! Then follow laughing words. ha, ha! Good fortune.", "Shock comes bringing danger. A hundred thousand times you lose your treasures and must climb the nine hills. Do not go in pursuit. After seven days you will get them back again.", "Shock comes and makes one distraught. If shock spurs one to action, one remains free of misfortune.", "Shock is mired.", "Shock goes hither and thither. Danger. However, nothing at all is lost. There is business to be done.", "Shock brings ruin and terrified gazing around. Going ahead brings misfortune. If it has not yet touched one's own body but has reached one's neighbor first, there is no blame. One's comrades have talked about it."] },
  { number: 52, name: "Keeping Still, Mountain", pinyin: "Gèn", chinese: "艮", binary: "001001", lower: "gen", upper: "gen",
    judgment: "Keeping Still. Keeping his back still so that he no longer feels his body. He goes into the courtyard and does not see his persons. No blame.",
    image: "Mountains standing close together: the image of Keeping Still. Thus the superior man does not permit his thoughts to go beyond his situation.",
    lines: ["Keeping his toes still. No blame. Continued perseverance furthers.", "Keeping his calves still. He cannot rescue him whom he follows. His heart is not glad.", "Keeping his hips still. Making his sacrum stiff. Dangerous. The heart suffocates.", "Keeping his trunk still. No blame.", "Keeping his jaws still. His words have order. Remorse disappears.", "Noblehearted keeping still. Good fortune."] },
  { number: 53, name: "Development (Gradual Progress)", pinyin: "Jiàn", chinese: "漸", binary: "001011", lower: "gen", upper: "xun",
    judgment: "Development. The maiden is given in marriage. Good fortune. Perseverance furthers.",
    image: "On the mountain, a tree: the image of Development. Thus the superior man abides in dignity and virtue, in order to improve the manners and customs.",
    lines: ["The wild goose gradually draws near the shore. The young son is in danger. There is talk. No blame.", "The wild goose gradually draws near the cliff. Eating and drinking in peace and concord. Good fortune.", "The wild goose gradually draws near the plateau. The man goes forth and does not return. The woman carries a child but does not bring it forth. Misfortune. It furthers one to fight off robbers.", "The wild goose gradually draws near the tree. Perhaps it will find a flat branch. No blame.", "The wild goose gradually draws near the summit. For three years the woman has no child. In the end nothing can hinder her. Good fortune.", "The wild goose gradually draws near the cloud heights. Its feathers can be used as ornaments. Good fortune."] },
  { number: 54, name: "The Marrying Maiden", pinyin: "Guī Mèi", chinese: "歸妹", binary: "110100", lower: "dui", upper: "zhen",
    judgment: "The Marrying Maiden. Undertakings bring misfortune. Nothing that would further.",
    image: "Thunder over the lake: the image of the Marrying Maiden. Thus the superior man understands the transitory in the light of the eternity of the end.",
    lines: ["The marrying maiden as a concubine. A lame man who is able to tread. Undertakings bring good fortune.", "A one-eyed man who is able to see. The perseverance of a solitary man furthers.", "The marrying maiden as a slave. She marries as a concubine.", "The marrying maiden draws out the allotted time. A late marriage comes in due course.", "The sovereign I gave his daughter in marriage. The embroidered garments of the princess were not as gorgeous as those of the servingmaid. The moon that is nearly full brings good fortune.", "The woman holds the basket, but there are no fruits in it. The man stabs the sheep, but no blood flows. Nothing that would further."] },
  { number: 55, name: "Abundance (Fullness)", pinyin: "Fēng", chinese: "豐", binary: "101100", lower: "li", upper: "zhen",
    judgment: "Abundance has success. The king attains abundance. Be not sad. Be like the sun at midday.",
    image: "Both thunder and lightning come: the image of Abundance. Thus the superior man decides lawsuits and carries out punishments.",
    lines: ["When a man meets his destined ruler, they can be together ten days, and it is not a fault. Going brings recognition.", "The curtain is of such fullness that the polestars can be seen at noon. Through going one meets with mistrust and hate. If one rouses him to action, it brings good fortune.", "The underbrush is of such abundance that the small stars can be seen at noon. He breaks his right arm. No blame.", "The curtain is of such fullness that the polestars can be seen at noon. He meets his ruler, who is of like kind. Good fortune.", "Lines are coming, blessing and fame draw near. Good fortune.", "His house is full of abundance. He screens off his family. He peers through the gate and no longer perceives anyone. For three years he sees nothing. Misfortune."] },
  { number: 56, name: "The Wanderer", pinyin: "Lǚ", chinese: "旅", binary: "001101", lower: "gen", upper: "li",
    judgment: "The Wanderer. Success through smallness. Perseverance brings good fortune to the wanderer.",
    image: "Fire on the mountain: the image of the Wanderer. Thus the superior man is clear-minded and cautious in imposing penalties.",
    lines: ["The wanderer busies himself with trivial things. He thus brings calamity upon himself.", "The wanderer comes to an inn. He has his means with him. He wins the steadfastness of a young servant.", "The wanderer's inn burns down. He loses the steadfastness of his young servant. Danger.", "The wanderer rests in a shelter. He obtains his property and an ax. My heart is not glad.", "He shoots a pheasant. It drops with the first arrow. In the end this brings both praise and office.", "The bird's nest burns up. The wanderer laughs at first, then afterward laments. Through carelessness he loses his cow. Misfortune."] },
  { number: 57, name: "The Gentle (The Penetrating, Wind)", pinyin: "Xùn", chinese: "巽", binary: "011011", lower: "xun", upper: "xun",
    judgment: "The Gentle. Success through what is small. It furthers one to have somewhere to go. It furthers one to see the great man.",
    image: "Winds following one upon the other: the image of the Gently Penetrating. Thus the superior man spreads his commands and carries out his undertakings.",
    lines: ["In advancing and retreating, the perseverance of a warrior furthers.", "Penetration under the bed. Priests and magicians are used in great number. Good fortune. No blame.", "Hasty penetration brings humiliation.", "Remorse vanishes. During the hunt three kinds of game are caught.", "Perseverance brings good fortune. Remorse vanishes. Nothing that does not further. No beginning but an end. Before the change, three days. After the change, three days. Good fortune.", "Penetration under the bed. He loses his property and his ax. Perseverance brings misfortune."] },
  { number: 58, name: "The Joyous, Lake", pinyin: "Duì", chinese: "兌", binary: "110110", lower: "dui", upper: "dui",
    judgment: "The Joyous. Success. Perseverance furthers.",
    image: "Lakes resting one on the other: the image of the Joyous. Thus the superior man joins with his friends for discussion and practice.",
    lines: ["Contented joyousness. Good fortune.", "Sincere joyousness. Good fortune. Remorse disappears.", "Coming joyousness. Misfortune.", "Joyousness that is weighed is not at peace. After ridding himself of mistakes a man has joy.", "Sincerity toward disintegrating influences is dangerous.", "Submissive joyousness."] },
  { number: 59, name: "Dispersion (Dissolution)", pinyin: "Huàn", chinese: "渙", binary: "010011", lower: "kan", upper: "xun",
    judgment: "Dispersion. Success. The king approaches his temple. It furthers one to cross the great water. Perseverance furthers.",
    image: "The wind drives over the water: the image of Dispersion. Thus the kings of old sacrificed to the Lord and built temples.",
    lines: ["He brings help through the strength of a horse. Good fortune.", "During dispersion he hastens to his place. All his wishes are fulfilled.", "He dissolves his self. No remorse.", "He dissolves his bond with his group. Supreme good fortune. Dispersion leads in turn to accumulation. This is something that ordinary men do not think of.", "His loud cries are as dissolving as sweat. Dissolution! A king abides without blame.", "He dissolves his blood. Departing, keeping at a distance, going out, is without blame."] },
  { number: 60, name: "Limitation", pinyin: "Jié", chinese: "節", binary: "110010", lower: "dui", upper: "kan",
    judgment: "Limitation. Success. Galling limitation must not be persevered in.",
    image: "Water over lake: the image of Limitation. Thus the superior man creates number and measure, and examines the nature of virtue and correct conduct.",
    lines: ["Not going out of the door and the courtyard is without blame.", "Not going out of the gate and the courtyard brings misfortune.", "He who knows no limitation will have cause to lament. No blame.", "Contented limitation. Success.", "Sweet limitation brings good fortune. Going brings esteem.", "Galling limitation. Perseverance brings misfortune. Remorse disappears."] },
  { number: 61, name: "Inner Truth", pinyin: "Zhōng Fú", chinese: "中孚", binary: "110011", lower: "dui", upper: "xun",
    judgment: "Inner Truth. Pigs and fishes. Good fortune. It furthers one to cross the great water. Perseverance furthers.",
    image: "Wind over lake: the image of Inner Truth. Thus the superior man discusses criminal cases in order to delay executions.",
    lines: ["Being prepared brings good fortune. If there are secret designs, one is disquieted.", "A crane crying in the shade. Its young answers it. I have a good goblet. I will share it with you.", "He finds a comrade. Now he beats the drum, now he leaves off. Now he sobs, now he sings.", "The moon nearly at the full. The team horse goes astray. No blame.", "He possesses the truth, which links together. No blame.", "Cockcrow penetrating to heaven. Perseverance brings misfortune."] },
  { number: 62, name: "Preponderance of the Small", pinyin: "Xiǎo Guò", chinese: "小過", binary: "001100", lower: "gen", upper: "zhen",
    judgment: "Preponderance of the Small. Success. Perseverance furthers. Small things may be done; great things should not be done.",
    image: "Thunder on the mountain: the image of Preponderance of the Small. Thus the superior man in his conduct exceeds in courtesy, in mourning exceeds in sorrow.",
    lines: ["The bird meets with misfortune through flying.", "She passes by her ancestor and meets her ancestress. He does not reach his ruler and meets his official. No blame.", "If one is not extremely careful, somebody may come up from behind and strike him. Misfortune.", "No blame. He meets him without passing by. Going brings danger. One must be cautious. Do not act thus. Be constantly persevering.", "Dense clouds, no rain from our western region. The prince shoots and hits him who is in the cave.", "He passes him by, not meeting him. The flying bird leaves him. Misfortune. This means bad luck and injury."] },
  { number: 63, name: "After Completion", pinyin: "Jì Jì", chinese: "既濟", binary: "101010", lower: "li", upper: "kan",
    judgment: "After Completion. Success in small matters. Perseverance furthers. At the beginning good fortune; at the end disorder.",
    image: "Water over fire: the image of the condition in After Completion. Thus the superior man thinks of misfortune and arms himself against it in advance.",
    lines: ["He breaks through the brake. He loses the rug of the carriage. He gets his head into the water. No blame.", "The woman loses the curtain of her carriage. Do not run after it; on the seventh day you will get it back.", "The illustrious ancestor chastises the devil's country. After three years he conquers it. Inferior men must not be employed.", "There is fine clothing, but it is in rags. He is on guard all day long. At dusk he is still cautious. Danger. No blame.", "The neighbor in the east who slaughters an ox does not attain as much real happiness as the neighbor in the west with his small offering. This is because his blessing is inexhaustible.", "He gets his head into the water. Danger."] },
  { number: 64, name: "Before Completion", pinyin: "Wèi Jì", chinese: "未濟", binary: "010101", lower: "kan", upper: "li",
    judgment: "Before Completion. Success. But if the little fox, after nearly completing the crossing, gets his tail in the water, there is nothing that would further.",
    image: "Fire over water: the image of the condition before transition. Thus the superior man is careful in the differentiation of things.",
    lines: ["He gets his tail in the water. Humiliating.", "He drags back his wheel. Perseverance brings good fortune.", "Before completion, the undertaking brings misfortune. But it furthers one to cross the great water.", "Perseverance brings good fortune. Remorse disappears. Shock, thus to discipline the devil's country, for three years, great realms are rewarded.", "Perseverance brings good fortune. No remorse. The light of the superior man is true. Good fortune.", "There is drinking of wine amid genuine confidence. No blame. If one wets his head, he loses it, in truth."] },
];

export function hexagramByNumber(n: number): HexagramDef {
  return HEXAGRAMS.find(h => h.number === n)!;
}

export function hexagramByBinary(bin: string): HexagramDef {
  return HEXAGRAMS.find(h => h.binary === bin)!;
}

export function getNuclearHexagram(h: HexagramDef): HexagramDef {
  const lowerNuc = h.binary.substring(1, 4);
  const upperNuc = h.binary.substring(2, 5);
  const nucBinary = upperNuc + lowerNuc;
  return hexagramByBinary(nucBinary);
}

export interface CoinTossResult {
  line: number;
  value: number;
  isChanging: boolean;
  isYang: boolean;
}

export function tossCoins(): CoinTossResult[] {
  const results: CoinTossResult[] = [];
  for (let i = 0; i < 6; i++) {
    const c1 = Math.random() < 0.5 ? 3 : 2;
    const c2 = Math.random() < 0.5 ? 3 : 2;
    const c3 = Math.random() < 0.5 ? 3 : 2;
    const value = c1 + c2 + c3;
    results.push({
      line: i,
      value,
      isChanging: value === 6 || value === 9,
      isYang: value === 7 || value === 9,
    });
  }
  return results;
}

export function buildHexagramBinary(tosses: CoinTossResult[]): string {
  return tosses.map(t => t.isYang ? "1" : "0").join("");
}

export function buildSecondaryBinary(tosses: CoinTossResult[]): string | null {
  const hasChanges = tosses.some(t => t.isChanging);
  if (!hasChanges) return null;
  return tosses.map(t => {
    if (!t.isChanging) return t.isYang ? "1" : "0";
    return t.isYang ? "0" : "1";
  }).join("");
}
