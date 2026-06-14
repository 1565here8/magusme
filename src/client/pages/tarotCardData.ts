export interface TarotCardDef {
  title: string;
  category: string;
  keywords: string[];
  symbolism: string;
  upright: string;
  reversed: string;
}

/* ─── Lookup index ─── */

const TITLE_INDEX: Record<string, TarotCardDef> = {};

export function getTarotCard(title: string): TarotCardDef | undefined {
  return TITLE_INDEX[title];
}

export function getMeaning(title: string, reversed: boolean): { keywords: string; symbolism: string; meaning: string } {
  const card = TITLE_INDEX[title];
  if (!card) return { keywords: "", symbolism: "", meaning: title };
  return {
    keywords: card.keywords.join(", "),
    symbolism: card.symbolism,
    meaning: reversed ? card.reversed : card.upright,
  };
}

function register(c: TarotCardDef) {
  TITLE_INDEX[c.title] = c;
}

/* ─── Title aliases (Thoth, Marseille → RWS) ─── */

function alias(title: string, ...aliases: string[]) {
  for (const a of aliases) TITLE_INDEX[a] = TITLE_INDEX[title];
}

/* ══════════════════════════════════════════════════
   MAJOR ARCANA
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "The Fool",
  category: "Major Arcana",
  keywords: ["beginnings", "spontaneity", "innocence", "adventure", "faith"],
  symbolism: "A young man stands at the edge of a cliff, a small white dog at his heels, carrying a knapsack on a stick over his shoulder. The sun rises behind him, and the distant mountains represent the journey ahead.",
  upright: `The Fool marks the beginning of a new cycle in your life. This card appears when you stand at the threshold of the unknown, about to step into something you have never experienced before. The path ahead is unmarked, and that is precisely the point. You are being called to trust the journey itself rather than demanding a map of every step. The Fool invites you to embrace the innocence of not knowing, the courage of beginning without guarantees, and the faith that everything you need is already with you. This is a time of pure potential. Every possibility is still open. The only mistake you can make is to refuse to take the first step. The Fool reminds you that all great journeys begin with a single step into uncertainty. Trust the universe, trust yourself, and go.`,
  reversed: `The Fool reversed suggests a fear of taking the first step. You may be hesitating on the edge of a new beginning, paralyzed by what could go wrong. The card can also indicate naivety or recklessness, charging forward without any thought for consequences. There may be risk-taking that is not wise, or conversely, an opportunity you are letting slip because the moment feels uncertain. Ask yourself whether you are holding back out of genuine caution or fear. Sometimes the Fool reversed calls you to check your footing before leaping, but other times it tells you that your hesitation is the only real obstacle. Take a breath, then take the step.`,
});

register({
  title: "The Magician",
  category: "Major Arcana",
  keywords: ["manifestation", "skill", "power", "resourcefulness", "willpower"],
  symbolism: "A figure stands before a table bearing the four suits of the Tarot, one hand raised to the heavens and the other pointing to the earth. An infinity symbol hovers above his head. Flowers bloom at his feet, representing the garden of the manifested world.",
  upright: `The Magician is the card of active manifestation. You possess all the tools you need to create what you desire. The four suits on the table represent the complete range of human resources — inspiration (Wands), emotion (Cups), intellect (Swords), and material reality (Pentacles). Your hand points to the earth, grounding divine energy into practical form. This is a time of exceptional personal power. Your will is aligned with the universe, and your skills are sharp. Whatever you focus your attention on now has the potential to become real. Do not waste this energy on trivial matters. The Magician asks you to be deliberate, focused, and confident in your ability to shape your circumstances. You have everything. Now act.`,
  reversed: `The Magician reversed indicates untapped potential or misused power. You may have the tools but lack the focus or confidence to use them effectively. There can be manipulation at play — either someone is deceiving you, or you are using your skills to deceive others. The card can also signal a gap between potential and action, knowing what to do but not doing it. Talents are being wasted or directed toward the wrong ends. Draw your energy back, clarify your intention, and start again with honesty.`,
});

register({
  title: "The High Priestess",
  category: "Major Arcana",
  keywords: ["intuition", "mystery", "subconscious", "inner knowledge", "secrets"],
  symbolism: "A seated woman in flowing robes holds a scroll of sacred knowledge. She sits between two pillars, one black and one white, with a veil behind her embroidered with pomegranates. The crescent moon rests at her feet, and the cross rests on her breast.",
  upright: `The High Priestess represents the deep intuitive knowledge that lies beneath the surface of consciousness. She is the guardian of the veil between the known and the unknown, and her appearance tells you that the answers you seek are not found through logic or external research. They are found within. This is a time for silence, meditation, and listening to the quiet voice inside. The High Priestess asks you to trust your instincts even when they contradict what the world tells you. Dreams, synchronicities, and gut feelings carry special weight now. What you need to know is already present in your subconscious, waiting for you to be still enough to hear it. Look inward. The truth is there.`,
  reversed: `The High Priestess reversed suggests that you are ignoring your intuition or that the subconscious is blocked from your awareness. You may be too focused on external validation, logic, or surface-level explanations to hear the deeper truth. Secrets may be kept from you, or you may be keeping secrets from yourself. The card can also indicate a withdrawal from spiritual connection, a fear of the unknown, or information that is not yet ready to be revealed. Pull back from the noise of the outer world and create space for silence. The answers are there, but you must listen to hear them.`,
});

register({
  title: "The Empress",
  category: "Major Arcana",
  keywords: ["abundance", "fertility", "nurturing", "nature", "beauty"],
  symbolism: "A majestic woman sits on a throne surrounded by lush nature. A crown of twelve stars rests on her head, and she holds a scepter representing her dominion over life. Wheat grows at her feet, and a waterfall flows behind her, symbolizing the abundance of the natural world.",
  upright: `The Empress is the great mother of the Tarot, representing the fertile, nurturing forces of the universe. She brings abundance in all forms — material comfort, creative output, emotional richness, and physical well-being. When the Empress appears, you are in a period of natural growth and expansion. Creativity flows freely, relationships deepen, and the material world provides for your needs. This card asks you to connect with nature, beauty, and your own body. Nurture yourself and others. Tend to what is growing in your life, whether that is a creative project, a relationship, or your own well-being. The Empress reminds you that abundance is your natural state. Receive it, enjoy it, and share it.`,
  reversed: `The Empress reversed points to creative blocks, financial dependence, or a disconnection from nature and the body. You may be neglecting self-care or struggling to nurture others because your own reserves are depleted. The card can indicate issues with fertility or motherhood, or a sense of being stuck in the creative process. There may be financial insecurity or an over-reliance on others for material support. Focus on restoring your own well-being first. You cannot pour from an empty cup.`,
});

register({
  title: "The Emperor",
  category: "Major Arcana",
  keywords: ["authority", "structure", "stability", "discipline", "protection"],
  symbolism: "A bearded ruler sits on a throne adorned with four rams' heads, representing his commanding and determined nature. He holds a scepter in one hand and an orb in the other, symbols of his authority over both the temporal and spiritual realms. The harsh landscape behind him speaks to the disciplined world he governs.",
  upright: `The Emperor brings the energy of structure, order, and established authority. He represents the masculine principle of boundary-setting, discipline, and protection. When this card appears, it is time to bring order to chaos. Create systems, set boundaries, take responsibility, and lead with clarity. The Emperor asks you to be firm in your decisions and to stand by your principles. This is not a time for wishy-washy behavior or avoiding hard choices. Step into your authority. Whether you are leading a team, managing a household, or taking control of your own life, the Emperor reminds you that true power comes from responsibility, not dominance. Build structures that will last.`,
  reversed: `The Emperor reversed suggests issues with authority, either in yourself or in others. You may be dealing with a domineering figure who exercises power without wisdom, or alternatively, you may be struggling with a lack of structure in your own life. There can be rigidity, stubbornness, or an unwillingness to listen. The card can also point to immaturity, an inability to take responsibility, or a rebellion against necessary order. Find the balance between discipline and flexibility. Authority without compassion becomes tyranny.`,
});

register({
  title: "The Hierophant",
  category: "Major Arcana",
  keywords: ["tradition", "wisdom", "spiritual guidance", "teaching", "conformity"],
  symbolism: "A religious figure sits between two pillars, wearing a triple crown and holding a scepter. Two acolytes kneel before him, representing the transmission of sacred knowledge from teacher to student. The crossed keys at his feet symbolize the unlocking of spiritual mysteries.",
  upright: `The Hierophant represents established traditions, spiritual wisdom, and the transmission of knowledge through institutions. He is the teacher, the mentor, the guide who initiates you into deeper understanding. When this card appears, you may benefit from seeking guidance from a trusted source, whether a spiritual teacher, a therapist, a mentor, or an established body of knowledge. There is wisdom in tradition. The Hierophant asks you to respect the structures that have been built over time, to learn from those who have walked the path before you, and to find meaning within established frameworks. This is a time for study, ceremony, and commitment to a spiritual or philosophical path.`,
  reversed: `The Hierophant reversed signals a rejection of tradition or a need to find your own spiritual path. Established institutions may feel limiting or hypocritical. You may be questioning the beliefs you were raised with or chafing against the authority of conventional wisdom. The card can indicate a teacher who is not worthy of trust or orthodoxy that no longer serves. It is time to question everything you have been taught and find your own truth. Unconventional approaches to spirituality and learning are favored now.`,
});

register({
  title: "The Lovers",
  category: "Major Arcana",
  keywords: ["love", "union", "partnership", "choices", "values"],
  symbolism: "A man and a woman stand beneath a winged angelic figure with arms outstretched. Behind the man is the Tree of Life, behind the woman the Tree of Knowledge. The scene represents both romantic union and the fundamental choice between different paths in life.",
  upright: `The Lovers is one of the most significant cards for matters of the heart, but its meaning goes deeper than romance. This card speaks to alignment — the harmony that comes when you choose from your deepest truth. A major decision is before you, and it asks you to consult your heart, not just your head. The Lovers represent the union of opposites, the integration of your own masculine and feminine energies, and the power of committed partnership. In relationships, this card signals a deep bond, a soul connection, or a pivotal choice about commitment. More broadly, it asks you to choose what is in alignment with your highest values. When the Lovers appear, follow what feels true, not what seems safe.`,
  reversed: `The Lovers reversed indicates disharmony, misalignment, or a difficult choice that has caused division. There may be a broken relationship, a betrayal of trust, or values that are in conflict. The card can also point to avoiding a necessary decision, staying in a situation that is out of alignment, or internal conflict between what you want and what you believe is right. It asks you to examine where you have compromised your integrity or settled for less than you deserve. Restoring harmony will require truth, courage, and a willingness to make the hard choice.`,
});

register({
  title: "The Chariot",
  category: "Major Arcana",
  keywords: ["willpower", "determination", "victory", "control", "ambition"],
  symbolism: "A warrior stands in a chariot pulled by two sphinxes, one black and one white, representing opposing forces that must be controlled. He wears a crown of stars and carries a spear, but he holds no reins — the sphinxes are controlled by his sheer will alone. The city behind him represents the worldly realm he has conquered.",
  upright: `The Chariot is the card of willpower and victorious determination. The two sphinxes pulling the chariot represent the opposing forces within you — fear and desire, logic and emotion, the conscious and the unconscious. Your task is not to eliminate one side, but to harness both through focused will. You have the power to overcome obstacles, to push through resistance, and to achieve what you set out to do. This is a time for assertiveness, for taking the reins of your life firmly in hand, and for moving forward with unwavering focus. The Chariot promises victory, but only if you maintain discipline and refuse to be distracted. The path is clear. Drive.`,
  reversed: `The Chariot reversed suggests a loss of control, lack of direction, or willpower that has failed. You may feel pulled in opposing directions with no clear way forward. Aggression that has turned destructive, a project that has stalled, or a situation where force is being met with equal resistance. The card can also indicate a lack of confidence or an inability to assert yourself. Step back and regain your center before trying to move forward. The sphinxes cannot be controlled until you first control yourself.`,
});

register({
  title: "Strength",
  category: "Major Arcana",
  keywords: ["courage", "inner strength", "patience", "compassion", "gentle power"],
  symbolism: "A woman calmly and gently closes the jaws of a lion. She wears a garland of flowers, representing the civilizing power of love and patience over brute force. The infinity symbol above her head indicates her connection to the divine and the endless nature of spirit.",
  upright: `Strength is not about physical power, but about inner fortitude, courage of the heart, and the quiet patience that tames the wild forces within. The lion represents your primal nature — your passions, desires, and fears. The woman does not fight the lion; she gently befriends it. This is a time when you are being called to face something difficult with grace, composure, and compassion. You have more strength than you realize, but it is not the kind that roars. It is the strength that endures, that stays gentle in the face of provocation, that loves even when it is hard. Trust your resilience. You can handle what is before you without losing your softness.`,
  reversed: `Strength reversed points to inner weakness, self-doubt, or a loss of confidence. You may feel overwhelmed by your own emotions or instincts, unable to control the lion within. The card can indicate fear, insecurity, or a sense that circumstances are overpowering you. There may be a need to set firmer boundaries or to stop being so hard on yourself. Rebuild your confidence one small victory at a time. You are stronger than you believe — you have just forgotten.`,
});

register({
  title: "The Hermit",
  category: "Major Arcana",
  keywords: ["introspection", "solitude", "inner wisdom", "guidance", "contemplation"],
  symbolism: "An old man wrapped in robes stands alone on a mountain peak, holding a lantern that contains a single star. His staff supports him on the ascent. The lantern represents the light of inner wisdom that guides him through the darkness of the unknown.",
  upright: `The Hermit appears when it is time to withdraw from the noise of the world and seek answers within. This is a period of introspection, contemplation, and inner work. The Hermit carries a lantern, indicating that you are not walking in total darkness — you have inner guidance available to you, but you must be alone and quiet enough to see it. This is not a time for social activity or external validation. Pull back. Reflect on what truly matters. The Hermit asks you to become your own teacher, your own guide. The answers you seek are not found in the opinions of others or in the distractions of daily life. They are found in the still, quiet place within. Honor this period of solitude. It is a gift, not a punishment.`,
  reversed: `The Hermit reversed suggests isolation that has become unhealthy, or a refusal to engage in the inner work that is needed. You may be withdrawing from the world out of fear rather than wisdom, or you may be feeling lost and disconnected from your inner guidance. The card can also indicate that you have been alone too long and now need to rejoin the community. There is a difference between healthy solitude and lonely isolation. Check which one you are in and adjust.`,
});

register({
  title: "Wheel of Fortune",
  category: "Major Arcana",
  keywords: ["cycles", "change", "destiny", "luck", "turning point"],
  symbolism: "A great wheel inscribed with letters rises from the sea. Figures ascend and descend on the wheel, representing the eternal cycle of rise and fall. In the corners, four winged figures represent the fixed signs of the zodiac, watching over the turning of the ages.",
  upright: `Wheel of Fortune signals that a turning point has arrived. The cycles of life are in motion, and change is not only coming — it is already here. What goes up must come down, and what is down will rise again. This card reminds you that nothing stays the same, and that is ultimately a good thing. The energy is shifting in your favor, and circumstances beyond your control are aligning. There is an element of destiny at play, of being in the right place at the right time. Your task is to recognize the turning of the wheel and to move with it rather than against it. Accept change as the natural order of life. The wheel turns for everyone. This moment is your turn.`,
  reversed: `Wheel of Fortune reversed suggests bad luck, resistance to change, or a cycle that seems stuck. External forces may feel like they are working against you, or you may be experiencing a downturn that feels unfair. The card can also indicate a failure to learn from past cycles, so the same patterns repeat. Remember that the wheel always turns. Even in a period of difficulty, the direction will change. Focus on what you can learn from this phase rather than fighting it.`,
});

register({
  title: "Justice",
  category: "Major Arcana",
  keywords: ["truth", "fairness", "accountability", "cause and effect", "balance"],
  symbolism: "A crowned figure sits on a throne holding a sword in one hand and scales in the other. The sword represents the power of truth to cut through illusion. The scales represent the careful weighing of all factors. Justice is neither merciful nor cruel — she is simply accurate.",
  upright: `Justice represents the principle of cause and effect, of accountability, and of truth. What you have put into the world is now returning to you. This card often appears when a decision must be made, a verdict rendered, or a situation brought into balance. The scales ask you to weigh all factors carefully and to be fair in your judgment. The sword asks you to tell the truth, even when it cuts. Justice is not about punishment; it is about alignment. If you have acted with integrity, you will be rewarded. If you have acted unjustly, there will be consequences. This is the law of the universe. The card asks you to take responsibility for your actions and to commit to honesty in all your dealings. The truth will prevail.`,
  reversed: `Justice reversed indicates unfairness, dishonesty, or consequences that you are trying to avoid. You may be dealing with an unjust situation, a legal matter that is not going in your favor, or a decision that was made based on bias rather than truth. The card can also point to denial, refusing to accept responsibility for your actions, or a system that is rigged. Whether the injustice is external or internal, Justice reversed calls you to stand for what is right, even when the system is not on your side.`,
});

register({
  title: "The Hanged Man",
  category: "Major Arcana",
  keywords: ["surrender", "suspension", "new perspective", "letting go", "sacrifice"],
  symbolism: "A man hangs upside down from a T-shaped cross, suspended by one foot. His hands are tied behind his back, yet his face is calm and serene. A halo glows around his head, indicating enlightenment. The pose is one of willing sacrifice and voluntary suspension.",
  upright: `The Hanged Man represents the paradox of finding freedom through surrender. You may feel stuck, waiting, or suspended in limbo, but this card asks you to see the situation differently. You are not trapped — you are being given time to gain a new perspective. The Hanged Man has chosen to hang upside down, and from this inverted position, he sees the world the right way up for the first time. Your current situation is asking you to stop struggling, to let go of the need to control outcomes, and to trust that the pause has purpose. Something is being worked out beneath the surface. Use this time to change your point of view, to release attachments that no longer serve, and to accept that not all action is productive. Sometimes the most powerful thing you can do is wait with awareness.`,
  reversed: `The Hanged Man reversed suggests a refusal to surrender or a delay that has become unbearable. You may be fighting against circumstances that require acceptance, or you may be stuck in martyrdom, sacrificing yourself unnecessarily. The card can also indicate that you have been in limbo for too long and it is time to make a change. If you have been holding on out of fear, the card asks you to let go. If you have been waiting passively when action is needed, it tells you to move. Distinguish between wise surrender and giving up.`,
});

register({
  title: "Death",
  category: "Major Arcana",
  keywords: ["transformation", "endings", "rebirth", "release", "transition"],
  symbolism: "A skeleton rides a white horse, carrying a black banner embroidered with a mysterious white rose. Figures lie before him — a king, a bishop, a woman, and a child — showing that death comes for all regardless of station. The sun rises between two towers in the background, promising new life beyond the end.",
  upright: `Death is one of the most misunderstood cards in the Tarot. It rarely signifies physical death. Instead, it represents profound transformation, the end of one phase and the beginning of another. Something in your life is ending — a relationship, a career, a belief system, a way of being. This ending is necessary and natural, like autumn clearing away what has died to make space for spring. The Death card asks you to release what no longer serves you, to let the old structures fall without clinging to them. The pain of this transition is real, but the transformation it brings is necessary for your growth. Resistance will only prolong the suffering. Surrender to the process. On the other side of this ending is a new beginning that you cannot yet see. Trust it.`,
  reversed: `Death reversed indicates resistance to necessary change. You may be clinging to something that has already ended, refusing to let go out of fear of the unknown. The card can also signal transformation that is being delayed or denied. Stagnation sets in when we refuse the natural cycles of death and rebirth. The more you resist, the harder the transition will be when it finally comes. It is time to examine what you are holding on to and why. Release is not defeat. It is the first step of renewal.`,
});

register({
  title: "Temperance",
  category: "Major Arcana",
  keywords: ["balance", "moderation", "patience", "alchemy", "harmony"],
  symbolism: "A winged figure pours liquid between two cups, one held high and one held low. The gesture represents the blending of opposites, the alchemical process of creating something new from different elements. A path leads from a mountain peak to a river, symbolizing the journey from the heights of spirit to the depths of feeling.",
  upright: `Temperance is the card of balance, patience, and the gentle art of blending opposites. The figure pours water between two cups, never spilling a drop — this is the essence of moderation and harmony. When Temperance appears, you are being called to find the middle path. Not too much, not too little. Not force, not passivity. The card often appears when you are learning to integrate different aspects of your life, to balance work and rest, spirit and matter, giving and receiving. This is a time of healing and synthesis. Things are coming together in their own time, and the process cannot be rushed. Practice patience. Trust the timing of your life. The alchemical work is happening even when you cannot see the result.`,
  reversed: `Temperance reversed signals imbalance, excess, or a lack of harmony. You may be pushing too hard in one direction while neglecting another, leading to burnout or dissatisfaction. The card can indicate impatience, rushing processes that need time, or a failure to integrate different parts of your life. There may be extremes of behavior — too much work, too much indulgence, too much isolation. Bring yourself back to center. The middle path is where peace lives.`,
});

register({
  title: "The Devil",
  category: "Major Arcana",
  keywords: ["shadow", "bondage", "materialism", "addiction", "fear"],
  symbolism: "A horned figure stands on a pedestal, wings spread, with chains around the necks of two naked figures below. The chains are loose enough to remove, but the figures do not see that they can free themselves. The torch held by the devil represents the false light of materialism and ego-driven desire.",
  upright: `The Devil represents the shadow side of human nature — the fears, addictions, and attachments that keep you bound. Unlike the popular image of evil, the Devil in the Tarot is about ignorance and enslavement to the material world. You may feel trapped in a pattern of behavior, a toxic relationship, an addiction, or a belief system that limits you. But here is the truth that the card reveals: the chains around your neck are loose. You are only imprisoned because you believe you are. The Devil asks you to look honestly at what binds you — the habits, fears, and attachments that drain your power. Name them. Face them. And recognize that you have the strength to walk away. Your shadow does not define you. What you fear controls you only as long as you refuse to meet it.`,
  reversed: `The Devil reversed signals breaking free from bondage, overcoming addiction, or releasing the fear that has held you. You are beginning to see the truth about your situation and to reclaim your power. This is a profound liberation, but it takes courage and honesty. The card can also indicate a willingness to face your shadow and integrate the parts of yourself you have denied. You are ready to walk out of the prison you built. The chains are already falling away.`,
});

register({
  title: "The Tower",
  category: "Major Arcana",
  keywords: ["upheaval", "revelation", "sudden change", "destruction", "awakening"],
  symbolism: "A tall tower on a mountain peak is struck by lightning, setting it ablaze. Two figures fall from the tower into the abyss below. Flames consume the structure. The scene represents the sudden collapse of false structures, the lightning of truth striking down illusion.",
  upright: `The Tower is the card of sudden, disruptive change. A structure you believed was solid is collapsing — a belief, a relationship, a career, a worldview. The lightning strike comes without warning and cannot be prevented. The Tower represents the painful but necessary breakdown of what is false, unstable, or built on an unworthy foundation. It is a moment of revelation: what you thought was secure was never truly stable. This is a hard card, but it is not a bad one. The collapse clears the way for something more authentic to be built. The Tower asks you to let it fall. Do not try to prop up what is crumbling. What is being destroyed was never meant to last. Trust that the wreckage, painful as it is, creates space for truth to enter.`,
  reversed: `The Tower reversed suggests an attempt to avoid the inevitable collapse. You may be resisting a necessary upheaval, trying to hold together something that needs to fall. The card can also indicate that the crisis has passed and you are now dealing with the aftermath. Recovery is possible, but you cannot rebuild until you have let the old structure go. Sometimes the reversed Tower signals a disaster narrowly avoided, but the lesson is the same: what was weak must be addressed before it falls again.`,
});

register({
  title: "The Star",
  category: "Major Arcana",
  keywords: ["hope", "healing", "inspiration", "serenity", "renewal"],
  symbolism: "A naked woman kneels at the edge of a pool of water, pouring water from two vessels — one onto the land and one into the water. Seven stars surround a single large star in the sky above her. A bird perches in a tree in the background, representing the soul's return to peace.",
  upright: `After the destruction of the Tower, the Star brings healing, hope, and renewal. This is a card of profound peace, inspiration, and connection to the divine. The waters of life are flowing again, and you are being replenished at every level. The Star tells you that the difficult time is passing. You are entering a period of calm, clarity, and restoration. Trust that the universe is guiding you toward wholeness. This is a time to heal, to dream, and to open yourself to inspiration. The Star asks you to have faith in the future, to believe that beauty and meaning are still present in the world, and to let your own inner light shine. You are being guided. You are exactly where you need to be.`,
  reversed: `The Star reversed indicates a loss of hope, discouragement, or a disconnection from your sense of purpose. You may be struggling to find meaning after a difficult experience, or feeling uninspired and directionless. The card can signal a period of despair, but it also affirms that the darkness is not permanent. Healing is still possible, but you may need to actively seek support and reconnect with what gives your life meaning. Do not give up. The stars still shine, even when clouds hide them.`,
});

register({
  title: "The Moon",
  category: "Major Arcana",
  keywords: ["illusion", "fear", "subconscious", "uncertainty", "mystery"],
  symbolism: "A crescent moon hangs in the night sky between two towers. A path leads through the landscape, where a wolf and a dog howl at the moon. A crayfish emerges from the water, representing the primal fears that lurk beneath the surface of consciousness. The towers represent the gates between the seen and unseen worlds.",
  upright: `The Moon speaks to the realm of the subconscious, of illusion, of things not being as they seem. This card often appears when you are navigating a period of uncertainty, confusion, or fear. The path ahead is not clearly lit, and you cannot trust everything you perceive. The Moon asks you to move forward carefully, relying on your intuition rather than your eyes. Something is hidden below the surface. Fears and anxieties that you have pushed into the shadows are rising to be acknowledged. The howling animals represent the wildness within you that must be recognized, not suppressed. This is not a time for major decisions or clear certainties. It is a time to sit with the unknown, to explore your inner landscape, and to trust that the dawn will come. Not everything needs to be understood immediately.`,
  reversed: `The Moon reversed indicates that the confusion is lifting, illusions are being dispelled, and repressed fears are coming to light. You are moving through the darkness toward clarity. The card can also signal that you have been deceived but are now seeing the truth. Release anxiety and trust that you are emerging from a period of uncertainty. What was hidden is now revealed.`,
});

register({
  title: "The Sun",
  category: "Major Arcana",
  keywords: ["joy", "success", "vitality", "positivity", "fulfillment"],
  symbolism: "A great sun shines down on a naked child riding a white horse. The child represents joy, innocence, and new life. Sunflowers bloom in the background, following the light. A red banner flies from the horse, symbolizing vitality and triumphant energy.",
  upright: `The Sun is one of the most positive cards in the Tarot. It represents joy, success, clarity, and the full expression of your authentic self. The clouds have parted, and you are standing in the light of your own truth. This is a time of happiness, vitality, and achievement. Everything is going well, and you are exactly where you should be. The Sun asks you to celebrate your successes, to share your joy with others, and to let your true self shine without shame or hesitation. You have earned this moment of brightness. Bask in it, and let its warmth remind you of what is possible when you live in alignment with your purpose. The Sun child rides free. You can too.`,
  reversed: `The Sun reversed suggests a temporary dimming of your joy or success. You may be struggling to see the bright side, feeling blocked from happiness, or dealing with a setback that has dampened your spirits. The card can also indicate that you are not allowing yourself to enjoy your achievements, holding back from fully expressing your true self. Your joy is not lost — it is waiting for you to claim it. Clear away whatever is blocking the light and let yourself be happy.`,
});

register({
  title: "Judgement",
  category: "Major Arcana",
  keywords: ["awakening", "reckoning", "calling", "absolution", "evaluation"],
  symbolism: "An angel blows a trumpet from which a banner hangs. Below, the dead rise from their tombs with arms outstretched, awakened to a new life. The scene represents the final judgment, but more broadly, it depicts the moment of awakening, of hearing a higher calling and answering it.",
  upright: `Judgement is the card of spiritual awakening, of hearing and answering a higher calling. It represents a moment of reckoning when you are called to account for your life, to evaluate your choices, and to rise to a new level of awareness. The dead rising from their tombs symbolize the parts of yourself that have been dormant, neglected, or buried. You are being called to bring them back to life. This is a time of profound self-evaluation. What have you done with your life? Are you living in alignment with your deepest truth? Judgement asks you to forgive yourself for past mistakes, to release guilt and shame, and to step into a new chapter with clarity and purpose. The call is sounding. It is time to answer.`,
  reversed: `Judgement reversed suggests a refusal to answer the call, self-doubt, or a harsh inner critic that keeps you stuck in the past. You may be avoiding a necessary self-evaluation, holding onto guilt or regret, or ignoring the signs that it is time to change. The card can also indicate fear of judgment from others or an inability to forgive yourself. Release the weight of the past. The call is still there, waiting for you to answer. It is never too late to rise.`,
});

register({
  title: "The World",
  category: "Major Arcana",
  keywords: ["completion", "integration", "fulfillment", "travel", "wholeness"],
  symbolism: "A naked figure dances within a laurel wreath, holding a staff in each hand. The four living creatures of the zodiac — the angel, the eagle, the lion, and the bull — watch from the corners. The wreath represents the completion of a great cycle, the achievement of mastery and integration.",
  upright: `The World is the final card of the Major Arcana, representing the successful completion of a major life cycle. You have arrived. The journey that began with The Fool has reached its fulfillment, and you stand in a place of integration, wholeness, and accomplishment. This card signals the achievement of a long-term goal, the mastery of a skill, the successful completion of a project, or the attainment of a deep sense of purpose. The World asks you to celebrate your accomplishment, to honor how far you have come, and to recognize the fullness of your being. At the same time, it reminds you that completion is also a beginning. The dancer's movement is ongoing. The cycle completes only to begin again at a higher level. You are whole. You are complete. And you are ready for whatever comes next.`,
  reversed: `The World reversed indicates a lack of completion or a failure to bring something to fulfillment. You may be very close to finishing but struggling to take the final step, or you may have abandoned a goal before reaching its conclusion. The card can also point to a sense of incompleteness, of feeling stuck in an unfinished cycle. There is still work to do. Do not stop now. The finish line is closer than it seems.`,
});

// Title aliases (Thoth & Marseille) for Major Arcana
alias("The Fool", "The Fool", "Le Mat — The Fool");
alias("The Magician", "The Magician", "Le Bateleur — The Magician");
alias("The High Priestess", "The High Priestess", "La Papesse — The High Priestess");
alias("The Empress", "The Empress", "L'Imp\u00e9ratrice — The Empress");
alias("The Emperor", "The Emperor", "L'Empereur — The Emperor");
alias("The Hierophant", "The Hierophant", "Le Pape — The Hierophant");
alias("The Lovers", "The Lovers", "L'Amoureux — The Lovers");
alias("The Chariot", "The Chariot", "Le Chariot — The Chariot");
alias("Strength", "Lust", "La Force — Strength");
alias("The Hermit", "The Hermit", "L'Ermite — The Hermit");
alias("Wheel of Fortune", "The Wheel of Fortune", "La Roue de Fortune — Wheel of Fortune");
alias("Justice", "Adjustment", "La Justice — Justice");
alias("The Hanged Man", "The Hanged Man", "Le Pendu — The Hanged Man");
alias("Death", "Death", "La Mort — Death");
alias("Temperance", "Art", "La Temp\u00e9rance — Temperance");
alias("The Devil", "The Devil", "Le Diable — The Devil");
alias("The Tower", "The Tower", "La Maison Dieu — The Tower");
alias("The Star", "The Star", "L'\u00c9toile — The Star");
alias("The Moon", "The Moon", "La Lune — The Moon");
alias("The Sun", "The Sun", "Le Soleil — The Sun");
alias("Judgement", "The Aeon", "Le Jugement — Judgement");
alias("The World", "The Universe", "Le Monde — The World");

})();

/* ══════════════════════════════════════════════════
   PENTACLES (Ace through King)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "Ace of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["new opportunity", "prosperity", "abundance", "material beginning", "foundation"],
  symbolism: "A hand emerges from a cloud, holding a golden pentacle. A garden with blooming flowers and a gateway to a distant mountain lies below, representing the potential for growth and stability that comes from this material beginning.",
  upright: `The Ace of Pentacles is the seed of material prosperity and new beginnings in the physical world. A new financial opportunity is presenting itself, a career path is opening, or a practical venture is ready to begin. The pentacle is offered to you in the open hand of the universe. When this card appears, abundance is available. This is a time for practical action, for investing in your future, and for building solid foundations. The Ace of Pentacles asks you to take the opportunity seriously. This is not a fantasy \u2014 it is a real, tangible chance to improve your material circumstances. Plant the seed now, nurture it with steady work, and watch it grow. But remember that the Ace is just the beginning. The opportunity is given, but it is up to you to cultivate it.`,
  reversed: `The Ace of Pentacles reversed indicates a missed opportunity, a financial setback, or a lack of planning for material stability. You may have dropped the proverbial golden coin, or an offer may have fallen through. The card can also point to a focus on material gain at the expense of other values, greed, or a reluctance to commit to a practical path. Do not let fear of failure prevent you from trying. The seed can still grow if you are willing to plant it.`,
});

register({
  title: "Two of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["balance", "adaptability", "juggling", "priorities", "resource management"],
  symbolism: "A figure dances while juggling two large pentacles, held together by an infinity-shaped band. Ships toss on turbulent waters behind him, suggesting the instability and challenge of maintaining balance in a changing environment.",
  upright: `The Two of Pentacles is the card of balancing multiple responsibilities and adapting to change. The figure juggles two pentacles with skill, dancing through the challenges of managing work, money, time, and energy. When this card appears, you are managing multiple demands on your resources. The key is flexibility. You must adapt to changing circumstances, go with the flow, and keep all the balls in the air without dropping anything critical. The Two of Pentacles asks you to find the rhythm that works for you. Balance is not a static state \u2014 it is a dynamic dance. Stay light on your feet, prioritize wisely, and trust your ability to handle whatever comes. The ships may toss on the waves, but the dancer keeps moving.`,
  reversed: `The Two of Pentacles reversed suggests being overwhelmed by competing demands, dropping the ball, or a failure to manage resources effectively. You may have taken on too much, causing stress and chaos in your life. The card can also indicate financial instability or a refusal to adapt to changing circumstances. You cannot juggle everything forever. Assess what is truly essential and let go of what is not. Simplify.`,
});

register({
  title: "Three of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["collaboration", "craftsmanship", "teamwork", "skill", "mastery"],
  symbolism: "A young apprentice stands on a bench, working on a cathedral with a craftsman and a monk. The three figures represent the collaboration of different skills toward a common goal. The cathedral symbolizes the enduring result of dedicated teamwork.",
  upright: `The Three of Pentacles is the card of teamwork, collaboration, and the mastery of a craft. The apprentice, the craftsman, and the monk work together on the cathedral, each contributing their unique skill to a shared vision. When this card appears, the best results will come through collaboration. You do not have to do everything alone. Your skills are respected, and your contribution matters, but the whole is greater than the sum of its parts. The Three of Pentacles asks you to value the input of others, to commit to quality in your work, and to enjoy the process of creating something excellent together. This is a time for learning, teaching, and building something that will last. Take pride in your work, but share the credit generously.`,
  reversed: `The Three of Pentacles reversed indicates poor teamwork, lack of commitment to quality, or a breakdown in collaboration. You may be working alone when you should be working with others, or the team may be dysfunctional and unproductive. The card can also point to a lack of skill, insufficient training, or an unwillingness to learn from others. Rethink your approach. Great work requires great collaboration. If the team is not working, fix the team.`,
});

register({
  title: "Four of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["security", "holding on", "possessiveness", "control", "hoarding"],
  symbolism: "A figure clutches a pentacle to his chest, holds one over his head, and stands on two more. His posture is protective and tight, reflecting an unwillingness to let go of material possessions or financial security.",
  upright: `The Four of Pentacles represents the desire for security through holding on tightly to what you have. The figure clutches his coins, unwilling to let any of them go. When this card appears, you may be holding on too tightly to your resources, your position, or your sense of security. The desire for stability is natural, but the Four of Pentacles warns against hoarding. Money that does not flow becomes stagnant. A grip that never loosens becomes a prison. This card asks you to examine your relationship with security. Are you holding on because you genuinely need to protect what you have, or are you holding on out of fear? Sometimes you must open your hand to receive more. Generosity is not loss \u2014 it is circulation.`,
  reversed: `The Four of Pentacles reversed suggests a loosening of control, a willingness to share, or a release of the fear that has been driving your possessiveness. You are learning that true security comes not from hoarding but from trusting the flow of abundance. The card can also indicate that a period of financial anxiety is ending and you are ready to be more generous with yourself and others. Let go and trust.`,
});

register({
  title: "Five of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["hardship", "poverty", "exclusion", "lack", "insecurity"],
  symbolism: "Two figures walk past a lit church window in the snow, barefoot and in tattered clothing. The church represents help that is available but that the figures are not seeing or have not yet reached. The snow and cold reflect the material and spiritual hardship.",
  upright: `The Five of Pentacles is the card of material hardship, financial difficulty, and the feeling of being left out in the cold. You may be experiencing poverty, unemployment, illness, or a period of insecurity where your basic needs feel threatened. The figures walk past the church, unaware that help is available inside. The Five of Pentacles speaks to a fear of scarcity, of not having enough. But it also suggests that help exists \u2014 you may need to look for it or be willing to receive it. This card asks you to examine your relationship with lack. Are your circumstances genuinely dire, or is your fear of scarcity preventing you from seeing the resources available to you? The door is there. Do not be too proud or too lost in despair to knock.`,
  reversed: `The Five of Pentacles reversed indicates the end of a difficult financial period, recovery from hardship, or a newfound ability to see the help that was always there. You are emerging from a time of lack and beginning to feel more secure. The card can also signal finding support, receiving aid, or regaining a sense of spiritual and material well-being. The warmth of the church is finally reaching you. Let it in.`,
});

register({
  title: "Six of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["generosity", "charity", "fair exchange", "giving and receiving", "abundance shared"],
  symbolism: "A figure in a red robe holds a scales and gives coins to a beggar. The scales represent the balance of giving and receiving, and the act of charity is done with dignity and fairness. Another beggar waits in the background.",
  upright: `The Six of Pentacles is the card of generosity, charity, and the fair distribution of resources. The figure holds the scales, weighing the act of giving with fairness and balance. When this card appears, you may be in a position to give, or you may be in a position to receive. Both roles are sacred. The Six of Pentacles is about the flow of abundance and the responsibility that comes with having more than enough. If you are giving, do so with grace and without expectation. If you are receiving, do so with gratitude and without shame. The card also speaks to karmic balance \u2014 what you give freely will return to you. The scales will always balance in time.`,
  reversed: `The Six of Pentacles reversed indicates inequality, strings attached to generosity, or a power imbalance in giving and receiving. Someone may be using their resources to control others, or you may be in a situation where you are receiving charity that comes with conditions. The card can also point to debt, unfair exchange, or a refusal to share what you have. Examine the dynamics of your financial and personal exchanges. True generosity is free of obligation. If strings are attached, it is not charity \u2014 it is a transaction.`,
});

register({
  title: "Seven of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["patience", "assessment", "long-term view", "harvest", "reflection"],
  symbolism: "A figure leans on a hoe, looking at a flourishing vine where seven pentacles grow. The scene represents a moment of reflection on the work that has been done, assessing whether the harvest is worth the effort and what to do next.",
  upright: `The Seven of Pentacles is the card of patience, assessment, and the long view. The figure pauses from their labor to examine the pentacles growing on the vine. The work has been done, and now it is time to evaluate the results. When this card appears, you are in a period of reflection on your efforts. You have planted seeds \u2014 in your career, a relationship, a creative project \u2014 and now you are waiting to see what grows. The Seven of Pentacles asks you to be patient. Not every seed sprouts at the same speed. Evaluate your progress honestly. Are you satisfied with what is growing? Is this where you want to invest more energy? The harvest is coming, but it takes time. Use this pause wisely to assess and adjust.`,
  reversed: `The Seven of Pentacles reversed indicates impatience, wasted effort, or a sense that your investments are not paying off. You may be frustrated with the pace of growth, considering abandoning a project that has not yet yielded fruit, or realizing that you have been putting energy into the wrong things. The card can also signal a need to cut your losses and redirect your energy. Not every investment yields a return. Wisdom is knowing when to persevere and when to walk away.`,
});

register({
  title: "Eight of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["mastery", "diligence", "apprenticeship", "skill development", "craftsmanship"],
  symbolism: "A young apprentice works diligently on a set of pentacles in a workshop, hammer in hand. Completed pentacles hang on the wall behind him, showing his progress. The scene represents the dedication required to master a craft.",
  upright: `The Eight of Pentacles is the card of diligent work, skill development, and the pursuit of mastery. The apprentice focuses on his craft with dedication, each pentacle he creates better than the last. When this card appears, you are in a period of learning, practice, and refinement. Whether you are studying a new subject, learning a trade, or perfecting a skill, the Eight of Pentacles asks you to commit to the process. Mastery is not achieved overnight. It comes through consistent effort, attention to detail, and the willingness to be a beginner. Take pride in your work, no matter how small each step may seem. Each pentacle you complete is a testament to your dedication. The master was once a student who never quit.`,
  reversed: `The Eight of Pentacles reversed suggests a lack of dedication, poor workmanship, or a refusal to put in the effort required for mastery. You may be cutting corners, rushing through your work, or avoiding the discipline needed to improve. The card can also indicate boredom with your work, a desire to move on before you have mastered the basics, or perfectionism that prevents you from making progress. Find the joy in the process, not just the result. If your work feels meaningless, reconnect with the purpose behind it.`,
});

register({
  title: "Nine of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["self-sufficiency", "luxury", "reward", "financial independence", "enjoyment"],
  symbolism: "A woman in elegant robes stands in a lush garden, a falcon resting on her arm. The garden represents the abundance she has cultivated, and the falcon represents her mastery over her domain. She is surrounded by the fruits of her labor.",
  upright: `The Nine of Pentacles is the card of self-sufficiency, material comfort, and the enjoyment of the good life. The woman stands in her garden, surrounded by the abundance she has cultivated. She is independent, refined, and in full command of her life. When this card appears, you have earned the right to enjoy the fruits of your labor. Financial security, personal freedom, and a life of quality are yours. The Nine of Pentacles asks you to appreciate what you have built. You did not get here by accident \u2014 you worked for this. Enjoy the luxury and beauty around you. At the same time, the card is a reminder to stay connected to your own inner resources. True self-sufficiency is not just financial. It is the confidence that you can take care of yourself in any circumstance. You are enough.`,
  reversed: `The Nine of Pentacles reversed suggests financial setbacks, dependence on others, or an inability to enjoy the rewards you have earned. You may be struggling with self-sufficiency, feeling that your security is fragile, or living beyond your means. The card can also indicate a focus on material wealth at the expense of inner fulfillment, or a fear of losing everything. True security is not in what you have, but in knowing you can take care of yourself. Strengthen your foundation and simplify where you can.`,
});

register({
  title: "Ten of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["legacy", "inheritance", "family wealth", "long-term success", "enduring foundation"],
  symbolism: "An old man sits at the entrance to a grand estate, surrounded by family. Ten pentacles decorate the archway, representing the accumulated wealth and wisdom of generations. The scene speaks to inheritance, legacy, and the enduring structures of family and tradition.",
  upright: `The Ten of Pentacles is the card of lasting wealth, family legacy, and the culmination of material success. This is not just about your own prosperity \u2014 it is about what you leave behind for future generations. The estate, the family, the traditions, the accumulated wisdom \u2014 all of this is represented by the ten pentacles on the arch. When this card appears, you are in a period of long-term stability and fulfillment. Your foundation is secure, your family is connected, and the work you have done is building something that will outlast you. The Ten of Pentacles asks you to honor your roots, to value the legacy you have inherited, and to consider what you are creating for those who will come after you. True wealth is not just money \u2014 it is family, tradition, and the stability that endures.`,
  reversed: `The Ten of Pentacles reversed suggests family disputes over money, a loss of inheritance, or the breakdown of a family system. There may be conflict about shared resources, a will that divides the family, or a sense that the security you counted on is unstable. The card can also indicate a rejection of family values or traditions, or a desire to break free from a legacy that feels more like a burden. Whether you are dealing with financial loss or family conflict, the Ten of Pentacles reversed asks you to address the root issues honestly. What is broken in the foundation must be repaired before it can support anyone.`,
});

register({
  title: "Page of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["study", "manifestation", "practical learning", "ambition", "new project"],
  symbolism: "A young figure stands in a field, holding a pentacle with focused attention. The land around them represents the fertile ground of practical work. The figure's posture suggests concentration and a desire to learn the ways of the material world.",
  upright: `The Page of Pentacles is the student of the material world. This card represents a new venture in the realm of practical knowledge, financial planning, career development, or physical health. The Page gazes at the pentacle with focused attention, eager to understand how things work and how to build something real. When this Page appears, you are being called to study, plan, and take practical steps toward your goals. This is not a time for grand visions or abstract ideas \u2014 it is a time for grounded, methodical action. Start that course, save that money, write that business plan. The Page of Pentacles asks you to be patient and diligent. The foundation you lay now will support everything you build in the future. Be the student. Learn the craft.`,
  reversed: `The Page of Pentacles reversed suggests a lack of discipline, missed opportunities for growth, or a failure to follow through on practical plans. You may be procrastinating on an important project, avoiding the hard work of learning, or spending money or time unwisely. The card can also indicate a fear of failure that prevents you from even starting. A lack of planning leads to poor results. Get back to basics. Set small, achievable goals and start moving.`,
});

register({
  title: "Knight of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["reliability", "routine", "steady progress", "persistence", "dependability"],
  symbolism: "A knight sits on a heavy, unmoving horse, holding a pentacle in his outstretched hand. The horse is still, the knight's posture is stable. The landscape is a freshly plowed field, representing the slow, methodical work that produces lasting results.",
  upright: `The Knight of Pentacles is the most reliable and steady of all the Knights. He does not charge into battle with blazing speed \u2014 he plods forward with unwavering persistence. His horse is planted firmly on the ground. He holds his pentacle with care and dedication. When this card appears, you are being called to slow down, focus on the details, and do the steady work that leads to lasting success. This is not a time for risk or adventure. It is a time for consistency, discipline, and follow-through. The Knight of Pentacles does not miss a deadline, does not break a promise, and does not cut corners. If you commit to doing something, do it fully, carefully, and reliably. The results may not come fast, but they will be solid and enduring. True success is built one steady step at a time.`,
  reversed: `The Knight of Pentacles reversed suggests stagnation, laziness, or an obsessive focus on routine at the expense of growth. You may be stuck in a rut, refusing to change or adapt, or avoiding progress because it requires risk. The card can also indicate procrastination, missed deadlines, or a lack of follow-through. The Knight has become too cautious, too rigid, too comfortable. Break out of the routine. Not every step forward needs to be dramatic, but you do need to take a step.`,
});

register({
  title: "Queen of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["nurturing abundance", "practical magic", "financial wisdom", "groundedness", "comfort"],
  symbolism: "A queen sits on a throne in a lush natural setting, holding a pentacle in her lap. The landscape around her is fertile and abundant. A rabbit at her feet symbolizes the fertility of nature and comfort of home. She represents the nurturing aspect of material wealth.",
  upright: `The Queen of Pentacles is the embodiment of grounded, practical abundance. She is the one who creates a warm home, manages resources wisely, and nurtures those around her with practical care. Her throne is in a garden of abundance, and she holds her pentacle with ease and grace. When this card appears, you are being called to nurture the material aspects of your life with wisdom and care. This is a time to focus on home, health, and financial stability. The Queen of Pentacles knows that true wealth is not just having money \u2014 it is the ability to create comfort, security, and beauty for yourself and those you love. She asks you to be practical, resourceful, and generous. Take care of your body, your home, and your finances. Create a life of comfort and stability, and share it freely.`,
  reversed: `The Queen of Pentacles reversed suggests neglect of home or health, financial mismanagement, or a focus on material wealth at the expense of well-being. You may be neglecting self-care, working too hard to enjoy the fruits of your labor, or struggling to manage your resources effectively. The card can also indicate that you are giving too much to others and not taking care of yourself. Return to the basics. Nurture yourself before you can nurture others. The garden cannot grow if the gardener is exhausted.`,
});

register({
  title: "King of Pentacles",
  category: "Minor Arcana \u2014 Pentacles",
  keywords: ["mastery of material world", "provider", "builder", "financial success", "stability"],
  symbolism: "A king sits on his throne, adorned with symbols of wealth and authority. His robe is covered in grapevines, representing the abundance of the earth. He holds a scepter in one hand and a pentacle in the other, secure in his mastery of the material realm.",
  upright: `The King of Pentacles represents the ultimate mastery of the material world. He is the provider, the builder, the one who has achieved financial success through years of hard work and wise decisions. His throne is secure, and his authority is unquestioned. When this card appears, you are being called to step into your power as a provider and leader in the material realm. This is a time for solid business decisions, long-term financial planning, and taking responsibility for the well-being of others. The King of Pentacles asks you to be generous with your resources, wise in your investments, and steady in your leadership. True mastery of the material world is not about accumulating wealth for its own sake. It is about using your resources to build something lasting, to provide for those you love, and to create security that extends beyond yourself.`,
  reversed: `The King of Pentacles reversed suggests financial mismanagement, greed, or a loss of status and security. You may be dealing with someone who is controlling with money, or you may be struggling with your own relationship to material success. The card can indicate over-indulgence, workaholism, or a fixation on wealth that has become unhealthy. It can also point to a failure of responsibility, neglecting the people who depend on you. True success is not measured by what you accumulate, but by what you build for others. Realign your priorities.`,
});

// Title aliases for Pentacles
alias("Ace of Pentacles", "Ace of Disks", "Ace of Deniers");
alias("Two of Pentacles", "Two of Disks", "Two of Deniers");
alias("Three of Pentacles", "Three of Disks", "Three of Deniers");
alias("Four of Pentacles", "Four of Disks", "Four of Deniers");
alias("Five of Pentacles", "Five of Disks", "Five of Deniers");
alias("Six of Pentacles", "Six of Disks", "Six of Deniers");
alias("Seven of Pentacles", "Seven of Disks", "Seven of Deniers");
alias("Eight of Pentacles", "Eight of Disks", "Eight of Deniers");
alias("Nine of Pentacles", "Nine of Disks", "Nine of Deniers");
alias("Ten of Pentacles", "Ten of Disks", "Ten of Deniers");
alias("Page of Pentacles", "Princess of Disks", "Valet of Deniers");
alias("Knight of Pentacles", "Knight of Disks", "Cavalier of Deniers");
alias("Queen of Pentacles", "Queen of Disks", "Reine of Deniers");
alias("King of Pentacles", "Prince of Disks", "Roi of Deniers");

})();


(function () {

register({
  title: "Ace of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["mental clarity", "breakthrough", "truth", "justice", "intellectual power"],
  symbolism: "A hand emerges from a cloud, gripping a double-edged sword whose tip is crowned with a golden crown. A wreath hangs from the sword, and distant mountains represent the challenges that truth can overcome.",
  upright: `The Ace of Swords is the sword of truth cutting through illusion. It represents a moment of mental clarity, a breakthrough in understanding, or the emergence of a powerful idea. The double-edged sword symbolizes that truth can cut both ways \u2014 it brings clarity, but it can also be painful. The crown on its tip represents victory through clear thinking. When this card appears, you are experiencing a moment of profound mental clarity. The fog has lifted, and you can see the truth of your situation with crystalline precision. This is a time for decisive intellectual action. Speak the truth, make the hard decision, cut through what is no longer serving you. The Ace of Swords asks you to trust your intellect and to act with integrity. A breakthrough is at hand.`,
  reversed: `The Ace of Swords reversed indicates confusion, misinformation, or a refusal to face the truth. You may be clouded by unclear thinking, avoiding a necessary decision, or receiving unreliable information. The card can also point to hasty or cruel communication, using words to wound rather than to illuminate. Seek clarity before you act. The truth may be difficult, but it is the only path forward.`,
});

register({
  title: "Two of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["stalemate", "difficult choice", "blindness", "avoidance", "equilibrium"],
  symbolism: "A blindfolded figure sits on a stone bench, holding two crossed swords. A crescent moon hangs in the night sky behind. The blindfold represents the refusal to see the truth, and the crossed swords represent a stalemate between two equally weighted options.",
  upright: `The Two of Swords represents a difficult decision, a stalemate, or a deliberate refusal to see the truth. The figure is blindfolded, holding two crossed swords \u2014 she cannot see, and the swords are locked in a position that prevents forward movement. When this card appears, you are avoiding a decision or refusing to face an uncomfortable truth. You are stuck between two options, and your refusal to choose is itself a choice. The Two of Swords asks you to lower your defenses, remove the blindfold, and face whatever you have been avoiding. The truth may be uncomfortable, but it will set you free. Making no decision is still a decision, and it is rarely the right one.`,
  reversed: `The Two of Swords reversed indicates the blindfold coming off, information surfacing, or a decision finally being made. You are ready to face the truth and make the choice you have been avoiding. The card can also signal that too much information has created confusion, overwhelming your ability to decide. Be gentle with yourself. Not every decision must be made instantly. But also do not use confusion as an excuse to remain stuck.`,
});

register({
  title: "Three of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["heartbreak", "sorrow", "grief", "pain", "betrayal"],
  symbolism: "Three swords pierce a red heart suspended in a gray sky. Rain falls in the background, reinforcing the atmosphere of sorrow and emotional pain. The image is stark and direct \u2014 there is no mistaking the message of heartbreak.",
  upright: `The Three of Swords is one of the most painful cards in the Tarot. It represents heartbreak, grief, betrayal, and emotional pain that cuts deeply. The three swords through the heart are a direct expression of suffering that cannot be ignored. When this card appears, you are experiencing or will experience emotional pain. A relationship may be ending, a betrayal may have occurred, or a painful truth has been revealed. The Three of Swords does not ask you to be okay. It gives you permission to grieve. The rain falls, the heart bleeds, and the pain is real. But the Three of Swords also carries the seed of healing. In acknowledging the pain, you begin the process of recovery. Feel it fully. Grief is not weakness. It is the price of having loved deeply.`,
  reversed: `The Three of Swords reversed indicates the beginning of healing after heartbreak, recovery from grief, or the release of painful emotions. You are learning to forgive and to move forward. The card can also signal that you have been avoiding grief that needs to be expressed. Suppressing pain does not make it disappear. Allow yourself to heal at your own pace. The swords are being removed from the heart. It will take time, but the wound will close.`,
});

register({
  title: "Four of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["rest", "recuperation", "meditation", "retreat", "peace"],
  symbolism: "A figure lies on a stone slab in a chapel, hands in prayer position, with three swords mounted on the wall above. A fourth sword rests beside the figure, representing the voluntary laying down of mental struggle.",
  upright: `The Four of Swords is the card of rest, recovery, and the healing power of stillness. The figure lies in a church, having taken refuge from the battles of the mind. This is a voluntary retreat, not a defeat. When this card appears, you have been through a period of mental stress, and it is time to rest. Your mind needs a break from the constant cycle of worry and analysis. The Four of Swords asks you to step back, to meditate, to sleep, and to allow your mental energies to recharge. This is not the time for action or decision-making. It is a time for rest and contemplation. Honor your need for stillness. The battles will still be there when you return, but you will face them with renewed strength.`,
  reversed: `The Four of Swords reversed signals a return to activity after a period of rest, restlessness that prevents healing, or a refusal to take the time you need to recover. You may be forcing yourself back into action before you are truly ready. The card can also indicate burnout, insomnia, or mental exhaustion from pushing too hard. Rest is not optional. It is essential. Give yourself permission to stop.`,
});

register({
  title: "Five of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["conflict", "defeat", "hollow victory", "betrayal", "loss"],
  symbolism: "A figure walks away with three swords, looking back with a sneer at two defeated figures who walk away in shame. Two swords lie on the ground, abandoned. The sky is turbulent, reflecting the emotional aftermath of the conflict.",
  upright: `The Five of Swords represents conflict that ends in a hollow victory. Someone has won, but the cost was too high. The figure walks away with three swords, but the other two are abandoned on the ground, along with any sense of honor, goodwill, or peace. When this card appears, you may be experiencing a conflict that is not worth winning. The victory, if you achieve it, will leave you isolated and empty. The Five of Swords asks you to choose your battles wisely. Sometimes it is better to walk away, to concede, or to find a compromise rather than to fight for a victory that costs you your integrity. This card can also indicate bullying, intimidation, or underhanded tactics. Do not stoop to that level. True strength is knowing when not to fight.`,
  reversed: `The Five of Swords reversed suggests a desire to move past conflict, to make amends, or to find a resolution after a difficult situation. You may be recognizing that the fight was not worth it and seeking reconciliation. The card can also indicate that you are the one who was defeated and are now recovering from the loss. Forgiveness is possible, but it takes time. Make peace with what happened and let it go.`,
});

register({
  title: "Six of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["transition", "moving on", "calmer waters", "journey", "recovery"],
  symbolism: "A ferryman poles a boat across a river. A woman and child sit in the boat, with six swords standing upright in the hull. The figure faces forward, away from the turbulent waters behind them, toward the calm horizon ahead.",
  upright: `The Six of Swords is the card of transition, of moving from troubled waters toward calmer shores. The journey is not easy \u2014 the swords in the hull represent the mental baggage you carry with you. But the direction is forward, toward healing and peace. When this card appears, you are in a period of transition. You are leaving behind a difficult situation \u2014 a relationship, a job, a mindset, a way of living \u2014 and moving toward something more peaceful. The journey is bittersweet. You may feel relief at leaving the turbulence behind, but grief for what you are leaving. The Six of Swords asks you to keep moving forward. The crossing is necessary. On the other side, there is peace. Trust the ferryman and let yourself be carried.`,
  reversed: `The Six of Swords reversed indicates a refusal to move on, a difficult transition that is not going smoothly, or a return to troubled waters. You may be stuck in the past, unable to leave a situation that is clearly over. The card can also signal that the journey toward peace is being blocked by internal resistance or external circumstances. You cannot change the past. The only direction is forward. What is keeping you from letting go?`,
});

register({
  title: "Seven of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["deception", "strategy", "stealth", "trickery", "acting alone"],
  symbolism: "A figure sneaks away from a military camp, carrying five swords in his arms. Two swords remain stuck in the ground. The figure looks over his shoulder, checking if he has been seen. The sky is yellow, suggesting a deceptive atmosphere.",
  upright: `The Seven of Swords represents stealth, strategy, and actions taken in secret. The figure is sneaking away with swords that do not belong to him, suggesting deception, theft, or getting away with something. When this card appears, someone may be acting dishonestly, or you may need to use strategic thinking to navigate a difficult situation. The Seven of Swords asks you to consider whether you are being honest in your dealings. If you are the one being deceived, it is time to pay attention to what is happening beneath the surface. If you are the one acting in secret, ask yourself whether your actions align with your values. Strategy and discretion are sometimes necessary, but deception always carries a cost. The figure may get away this time, but the remaining swords in the ground suggest that not everything is as it seems.`,
  reversed: `The Seven of Swords reversed indicates that a deception is being revealed, a secret is coming to light, or a plan has been foiled. Honesty is being restored. The card can also signal that you have been caught in a lie or that your attempts at concealment are failing. It is better to come clean now than to be exposed later. Confession and accountability are the first steps toward rebuilding trust.`,
});

register({
  title: "Eight of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["restriction", "self-imposed limits", "feeling trapped", "negative thinking", "victimhood"],
  symbolism: "A woman stands blindfolded and bound in a circle of eight swords. The ropes around her wrists are loose enough to escape, but she does not realize it. The blindfold prevents her from seeing the way out. A castle on a hill represents the stability she could reach but cannot see.",
  upright: `The Eight of Swords represents the feeling of being trapped, restricted, and unable to see a way out. But the ropes around the woman are loose, and the blindfold is her own. The prison is largely self-imposed. When this card appears, you feel stuck, but the real limitations are in your own mind. Negative thinking patterns, self-doubt, and fear are the actual barriers. The Eight of Swords asks you to examine the thoughts that are keeping you bound. Are you focusing on what you cannot do rather than what you can? Are you waiting for someone else to rescue you? The way out is closer than you think. Remove the blindfold of your own limiting beliefs and see the escape route that has been there all along.`,
  reversed: `The Eight of Swords reversed signals liberation from self-imposed restrictions, a shift in perspective, or the beginning of self-empowerment. You are starting to see that the limitations were largely in your mind, and you are ready to free yourself. The blindfold is coming off. You can see the path forward. Do not wait for permission. Take the first step toward freedom.`,
});

register({
  title: "Nine of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["anxiety", "nightmares", "worry", "despair", "depression"],
  symbolism: "A figure sits upright in bed, face in hands, with nine swords hanging on the wall behind them. The posture is one of utter despair and anguish. A carved figure on the bed depicts a scene of violence, reflecting the tormented mental state.",
  upright: `The Nine of Swords is the card of anxiety, nightmares, and the darkest nights of the soul. The figure sits in bed consumed by worry, the swords of their own thoughts hanging over them like instruments of torture. When this card appears, your mind is trapped in a cycle of fear and negative thinking. You are up at night, haunted by worst-case scenarios, replaying past mistakes, or drowning in worry. The Nine of Swords does not sugarcoat the pain. Mental suffering is real and it is heavy. But the card also reminds you that these are thoughts, not reality. The swords are on the wall, not in your body. You are not in immediate danger. The pain you feel is real, but it is not the whole truth. Reach out for support. You do not have to carry this alone. Dawn always comes, even when the night feels endless.`,
  reversed: `The Nine of Swords reversed indicates the release of anxiety, the beginning of recovery from mental anguish, or a willingness to seek help. You are emerging from a period of intense worry and starting to see that things are not as dire as they seemed. The card can also signal an end to the worst of the suffering and a return to hope. Healing is possible. Reach out. Talk to someone. Let the light back in.`,
});

register({
  title: "Ten of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["rock bottom", "ending", "release", "betrayal finality", "new dawn"],
  symbolism: "A figure lies face down on the ground with ten swords piercing their back. The sky is black, but on the horizon, a golden sunrise is breaking. The figure is utterly defeated, but the dawn signals that the worst is over.",
  upright: `The Ten of Swords represents the final blow, the rock bottom, the situation that cannot get any worse. The figure lies defeated with ten swords in their back, but the dawn is breaking on the horizon. This is a card of endings, but also of the promise that follows. When this card appears, something in your life has reached its absolute end. A relationship has broken beyond repair, a career has hit a dead end, or a belief system has been shattered. The pain is intense, and the defeat feels total. But the Ten of Swords carries a crucial message: the worst is over. The only direction from here is up. The dawn is already breaking, even if you cannot see it from the ground. This ending, painful as it is, clears the space for something new to be born. Let yourself fall apart. It is the first step to putting yourself back together.`,
  reversed: `The Ten of Swords reversed suggests a refusal to accept an ending, or recovery after a devastating event. You may be trying to resurrect something that is truly over, or you may be in denial about the finality of a situation. The card can also signal that you are beginning to recover from a major setback. You have hit bottom and are starting to rise. Do not look back. What is over is over. The dawn is before you.`,
});

register({
  title: "Page of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["curiosity", "vigilance", "mental agility", "communication", "new ideas"],
  symbolism: "A young figure stands on a rocky outcrop, holding a sword high in both hands. The wind blows through the trees, and clouds race across the sky. The figure's stance is alert and ready, watching for new information or challenges.",
  upright: `The Page of Swords represents intellectual curiosity, mental alertness, and the eager pursuit of knowledge. This Page is always watching, always questioning, always ready for a new idea or a stimulating conversation. When this card appears, you are being invited to engage your mind actively. Study something new, ask the hard questions, speak your truth with clarity and conviction. The Page of Swords is a messenger of ideas. You may receive news or information that changes your perspective. Stay sharp. Not everything you hear is true. The Page asks you to verify your sources, think critically, and communicate with precision. Your mind is your greatest tool right now. Use it well.`,
  reversed: `The Page of Swords reversed suggests gossip, hasty communication, or a misuse of intellectual energy. You may be spreading rumors, speaking without thinking, or using your intelligence to manipulate. The card can also indicate cynicism, distrust, or a suspicious mindset that sees threats where there are none. Check your words before they leave your mouth. Information is powerful \u2014 use it responsibly.`,
});

register({
  title: "Knight of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["swift action", "determination", "direct communication", "ambition", "urgency"],
  symbolism: "A knight in full armor charges across the battlefield on a white horse, sword raised high. His posture is aggressive and his momentum is unstoppable. Birds scatter in the wind as he rides, representing the disruption of his passage.",
  upright: `The Knight of Swords represents swift, decisive action driven by the power of the mind. This Knight charges forward with total commitment, driven by conviction and a clear sense of purpose. When this card appears, you are driven to act with speed and determination. There is urgency in the air. You have a clear goal in mind and nothing will stand in your way. The Knight of Swords asks you to be direct, to speak your truth boldly, and to cut through obstacles with the power of your intellect and will. But the Knight can also be reckless. His speed may cause him to miss important details, and his directness may trample the feelings of others. Act with purpose, but also with awareness. Make sure you are charging toward the right target.`,
  reversed: `The Knight of Swords reversed indicates recklessness, scattered energy, or an inability to follow through. You may be rushing into situations without sufficient planning, or your directness may have created conflict. The card can also point to a lack of direction, starting many projects but finishing none, or charging at the wrong target. Slow down and check your compass before you ride off in the wrong direction.`,
});

register({
  title: "Queen of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["independence", "sharp intellect", "honesty", "discernment", "boundaries"],
  symbolism: "A queen sits on a throne with her sword raised, her posture regal and her expression stern but fair. The clouds behind her are turbulent, representing the challenges of the mental realm. A butterfly adorns her crown, symbolizing the transformation that comes through clear perception.",
  upright: `The Queen of Swords represents the power of the mind tempered by experience and independence. She is a truth-teller, a clear communicator, and a woman who has learned through hardship to trust her own judgment. She does not suffer fools, and she does not compromise her integrity. When this card appears, you are being asked to think clearly, speak honestly, and set firm boundaries. The Queen of Swords knows that the truth is not always gentle, but it is always necessary. This is a time for clear-headed decision-making and honest communication. Cut through the emotional fog and see the situation for what it is. The Queen asks you to be independent in your thinking and unafraid to stand alone if necessary. Your wisdom has been earned through experience. Trust it.`,
  reversed: `The Queen of Swords reversed suggests coldness, bitterness, or using intellect to distance yourself from emotions. You may be cutting yourself off from feeling, hiding behind logic, or using harsh words to keep people at a distance. The card can also indicate grief that has hardened into cynicism or an overly critical attitude toward yourself and others. Allow yourself to feel. The sharpest sword is useless if it cannot be sheathed. Balance intellect with compassion.`,
});

register({
  title: "King of Swords",
  category: "Minor Arcana \u2014 Swords",
  keywords: ["authority", "logic", "truth", "ethical judgment", "intellectual clarity"],
  symbolism: "A king sits on his throne holding a sword in one hand and his scepter in the other. He represents the highest expression of intellectual authority, the power of truth wielded with justice and wisdom. The butterflies on his throne represent transformation through clear perception.",
  upright: `The King of Swords represents the ultimate authority of truth, logic, and ethical clarity. He is the judge, the statesman, the intellectual leader who makes decisions based on reason and justice rather than emotion or self-interest. When this card appears, you are being called to think clearly, speak truthfully, and lead with intellectual integrity. The King of Swords asks you to rise above emotional entanglements and make decisions based on what is right and true. This is a time for ethical leadership and clear communication. Your words carry weight. Use them wisely. The King reminds you that true authority comes not from power over others, but from the integrity of your mind and the clarity of your principles.`,
  reversed: `The King of Swords reversed suggests the misuse of intellectual power, manipulation through information, or an authority figure who is unjust or dishonest. You may be dealing with someone who uses logic to control or confuse, or you may be using your own intellect in ways that are not aligned with your values. The card can also indicate an overly rigid or dogmatic mindset, refusing to listen to other perspectives. True wisdom is flexible. If you have been using your mind to dominate rather than to clarify, it is time to realign.`,
});

// Title aliases for Swords
alias("Ace of Swords", "Ace of Swords", "Ace of \u00c9p\u00e9es");
alias("Two of Swords", "Two of Swords", "Two of \u00c9p\u00e9es");
alias("Three of Swords", "Three of Swords", "Three of \u00c9p\u00e9es");
alias("Four of Swords", "Four of Swords", "Four of \u00c9p\u00e9es");
alias("Five of Swords", "Five of Swords", "Five of \u00c9p\u00e9es");
alias("Six of Swords", "Six of Swords", "Six of \u00c9p\u00e9es");
alias("Seven of Swords", "Seven of Swords", "Seven of \u00c9p\u00e9es");
alias("Eight of Swords", "Eight of Swords", "Eight of \u00c9p\u00e9es");
alias("Nine of Swords", "Nine of Swords", "Nine of \u00c9p\u00e9es");
alias("Ten of Swords", "Ten of Swords", "Ten of \u00c9p\u00e9es");
alias("Page of Swords", "Princess of Swords", "Valet of \u00c9p\u00e9es");
alias("Knight of Swords", "Knight of Swords", "Cavalier of \u00c9p\u00e9es");
alias("Queen of Swords", "Queen of Swords", "Reine of \u00c9p\u00e9es");
alias("King of Swords", "Prince of Swords", "Roi of \u00c9p\u00e9es");

})();


(function () {

register({
  title: "Ace of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["new love", "emotional opening", "intuition", "compassion", "joy"],
  symbolism: "A hand descends from a cloud, holding a golden cup from which five streams of water flow. A dove descends into the cup, holding a communion wafer marked with a cross, symbolizing the holy grail and the union of the spiritual and emotional.",
  upright: `The Ace of Cups is the beginning of all things emotional and relational. A new love may enter your life, an existing relationship may deepen, or your emotional and spiritual life may be opening in a profound way. The overflowing cup represents the heart's capacity for love, joy, and compassion. When this card appears, you are being invited to open your heart. Whether to a new love, to self-love, or to a deeper connection with the divine, the Ace of Cups signals a time of emotional abundance and intuitive clarity. Your cup is full. Let yourself feel deeply, love openly, and receive the emotional gifts the universe is offering. This is a blessing. Accept it with gratitude.`,
  reversed: `The Ace of Cups reversed suggests emotional blockage, repressed feelings, or an inability to give or receive love. You may be shutting down emotionally, avoiding intimacy, or struggling with self-love. The card can also indicate that a new relationship or emotional experience is being blocked by fear or past wounds. The cup is still full, but you are not allowing yourself to drink from it. Open your heart. The waters of life are waiting to flow through you.`,
});

register({
  title: "Two of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["partnership", "attraction", "unity", "connection", "mutual love"],
  symbolism: "A man and a woman face each other, each holding a cup. Above them, a winged lion's head and the caduceus of Hermes float, representing the alchemical marriage of opposites and the healing power of union.",
  upright: `The Two of Cups is the card of mutual attraction, partnership, and the meeting of hearts. It speaks to the deep connection that forms when two people recognize each other on a soul level. This is not necessarily romantic \u2014 it can be a deep friendship, a creative partnership, or a meaningful alliance. The Two of Cups represents equality, reciprocity, and the joy of being truly seen by another. When this card appears, you are being invited into a connection of mutual respect and genuine affection. The person you are meeting (or deepening with) is your equal. This bond has the potential to be deeply healing and creatively powerful. Meet them with an open heart and an open mind.`,
  reversed: `The Two of Cups reversed indicates imbalance in a relationship, broken communication, or a partnership that is out of alignment. One person may be giving more than the other, or the connection may be based on illusion rather than reality. The card can also point to a breakup, a separation, or a refusal to meet someone halfway. If the connection is worth saving, honest communication is needed. If not, the Two of Cups reversed asks you to acknowledge the imbalance and walk away.`,
});

register({
  title: "Three of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["celebration", "friendship", "community", "joy", "abundance"],
  symbolism: "Three women raise their cups in a toast, dancing together in a circle. Fruit and flowers surround them, representing the abundance of the harvest and the joy of shared celebration.",
  upright: `The Three of Cups is the card of friendship, celebration, and communal joy. It represents the happiness that comes from sharing good times with those you love. This is a time of social connection, creative collaboration, and pure, uncomplicated joy. When this card appears, you are surrounded by people who care about you. You are part of a community, and that community is a source of strength and happiness. The Three of Cups asks you to let loose, celebrate your blessings, and appreciate the people who make life meaningful. This is not a time for solitary pursuits \u2014 it is a time for togetherness, laughter, and shared abundance. Raise your glass and enjoy the company.`,
  reversed: `The Three of Cups reversed suggests social isolation, a falling out with friends, or a celebration that has turned sour. You may be feeling left out, betrayed by a friend, or disconnected from your community. The card can also indicate overindulgence, using alcohol or substances to avoid deeper issues. Address any conflicts within your social circle and reach out to those you trust. You do not have to celebrate alone.`,
});

register({
  title: "Four of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["apathy", "contemplation", "missed opportunity", "dissatisfaction", "reflection"],
  symbolism: "A young man sits under a tree with his arms crossed, looking at three cups on the ground before him. A hand from a cloud offers a fourth cup, but he does not see it. His posture reflects disinterest and emotional withdrawal.",
  upright: `The Four of Cups represents a state of emotional apathy, dissatisfaction, and withdrawal. You have been given much, but you are not appreciating it. Your attention is turned inward, and you may be missing the opportunities that are being offered to you. The fourth cup appears from the cloud, but the figure is so absorbed in his discontent that he does not see it. The Four of Cups asks you to examine your discontent honestly. Are you ungrateful, or is there something truly missing? Are you withdrawing because you need rest, or because you are stuck in a pattern of dissatisfaction? Look up from your meditation and see what new offering is being presented to you. The opportunity is there \u2014 you just need to open your eyes to it.`,
  reversed: `The Four of Cups reversed indicates a return to engagement, a new motivation, or the recognition of opportunities you previously overlooked. You are emerging from a period of apathy and beginning to see what has been available to you all along. The card can also signal a decision to stop brooding and to re-engage with life. Accept the new offer. It is time to get back in the game.`,
});

register({
  title: "Five of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["grief", "loss", "regret", "disappointment", "mourning"],
  symbolism: "A figure cloaked in black stands before three spilled cups, their contents draining away. Two cups remain upright behind them, but the figure is so focused on what is lost that they do not see what remains. A bridge in the background suggests the possibility of moving forward.",
  upright: `The Five of Cups is the card of grief, disappointment, and focusing on what has been lost. You have experienced a setback, a loss, or a disappointment, and you are deep in mourning. Three cups are spilled \u2014 the things that are gone. Two cups remain \u2014 the things that are still there. But the figure cannot see the remaining cups because their attention is fixed on the loss. This is a very human response. Grief must be honored. The Five of Cups gives you permission to feel the weight of your disappointment. But it also quietly shows you that not everything is lost. The remaining cups are behind you, waiting for you to turn around. When you are ready, the bridge is there. Grieve fully, but do not stay here forever. There is still goodness in your life, even if you cannot see it right now.`,
  reversed: `The Five of Cups reversed signals the beginning of acceptance, moving on from grief, and the ability to see the two cups that still remain. You are turning to face what is still good in your life. The card can also indicate that a period of mourning is ending and you are ready to rebuild. Hope returns. Forgive yourself for what was lost and begin again.`,
});

register({
  title: "Six of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["nostalgia", "childhood", "innocence", "memories", "kindness"],
  symbolism: "Two figures stand in a familiar village setting. A younger figure offers a cup filled with flowers to the other. The scene evokes the simplicity and sweetness of childhood, of giving and receiving without expectation.",
  upright: `The Six of Cups brings the energy of nostalgia, childhood innocence, and simple kindness. This card often appears when you are revisiting the past \u2014 a person from your history reappears, a familiar place calls you back, or old memories surface with emotional power. The Six of Cups is also a card of giving and receiving. The offering of the cup filled with flowers represents generosity that comes from the heart, without strings attached. When this card appears, you may be called to embody that childlike openness and generosity. Give without expectation. Receive without guilt. Reconnect with the pure, simple joys that used to light up your life. But be careful not to live in the past. The Six of Cups is a gift of sweetness, not a command to stay there.`,
  reversed: `The Six of Cups reversed suggests an inability to let go of the past, unrealistic nostalgia, or a refusal to grow up. You may be romanticizing how things used to be, comparing the present unfavorably to a past that may not have been as perfect as you remember. The card can also indicate that someone from your past is re-entering your life in an unhealthy way. Honor your memories, but do not let them trap you. The past is a well to draw from, not a place to live.`,
});

register({
  title: "Seven of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["illusions", "fantasy", "choices", "wishful thinking", "daydreaming"],
  symbolism: "A figure stands before seven cups floating on clouds, each containing a different symbol: a castle, a treasure, a crown, a snake, a skull, a covered figure, and a jewel. The figure is faced with a multitude of choices, but many of them are illusions.",
  upright: `The Seven of Cups is the card of fantasies, illusions, and the overwhelming abundance of choice. Before you are seven possibilities, each represented by a different symbol. Some are real, some are fantasies, and some are outright illusions. The figure before them stands in confusion, unsure which to choose. When this card appears, you are faced with many options, and not all of them are what they seem. The Seven of Cups asks you to ground yourself in reality. Your imagination is powerful, but it can also lead you astray. Not every dream is meant to be pursued. Not every opportunity is genuine. Take time to discern which of your options is based in reality and which is a beautiful fantasy. Ground yourself before making a decision. The castle in the clouds will not hold you.`,
  reversed: `The Seven of Cups reversed indicates clarity, decisive action, and the ability to cut through illusion. You are no longer confused about what you want, and you are ready to commit to a path. The fog has lifted, and you can see which options are real and which were fantasies. The card can also signal that a period of wishful thinking is ending and you are ready to get practical. Choose with clarity and act with intention.`,
});

register({
  title: "Eight of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["walking away", "letting go", "seeking deeper", "transition", "disillusionment"],
  symbolism: "A figure in a red cloak walks away from a stack of eight cups, heading into the mountains under the light of a crescent moon. The cups represent emotional attachments that the figure has decided to leave behind in search of something deeper.",
  upright: `The Eight of Cups is the card of walking away from what no longer satisfies. The figure has abandoned eight cups \u2014 emotional achievements, relationships, or situations that once mattered \u2014 to seek a deeper truth. The moon above lights the way through unfamiliar territory. When this card appears, you have reached a point where the old ways no longer fulfill you. Something that once brought you happiness now feels hollow. It is time to leave it behind and search for deeper meaning. This is not a failure. It is growth. The Eight of Cups asks you to have the courage to walk away, even when the destination is not clear. You are being called toward emotional and spiritual depth. The comfortable cups must be left behind so that you can find what truly nourishes your soul.`,
  reversed: `The Eight of Cups reversed suggests a fear of moving on, clinging to what is comfortable, or returning to a situation you had already left. You may know that it is time to go but cannot bring yourself to take the step. The card can also indicate aimless wandering, leaving situations without learning the lesson they were meant to teach. If you are going to walk away, do it consciously. If you are staying, commit fully. Half measures serve no one.`,
});

register({
  title: "Nine of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["wish fulfilled", "contentment", "satisfaction", "gratitude", "emotional fulfillment"],
  symbolism: "A figure sits on a wooden bench with arms crossed, looking satisfied. Behind him, nine golden cups are arranged in an arch on a blue cloth. His expression is one of complete contentment, having achieved what he desired.",
  upright: `The Nine of Cups is traditionally called the wish card \u2014 a sign that your desires are manifesting and your heart's content is being fulfilled. The figure sits with satisfaction, surrounded by nine cups that represent the full range of emotional satisfaction. When this card appears, you are entering a period of happiness, contentment, and gratitude. What you have wished for is coming to pass. The Nine of Cups asks you to enjoy this moment of fulfillment. You have earned it. Let yourself feel the satisfaction of a wish realized, a goal achieved, a heart made full. This is a time of celebration and gratitude. Acknowledge how far you have come and allow yourself to bask in the joy of the present moment.`,
  reversed: `The Nine of Cups reversed indicates dissatisfaction despite apparent success, unfulfilled wishes, or a sense that something is still missing. You may have achieved what you thought you wanted but found it did not bring the happiness you expected. The card can also point to greed, selfishness, or a refusal to share your good fortune. Take an honest inventory of what truly makes you happy. Sometimes getting what we want reveals that we wanted the wrong thing.`,
});

register({
  title: "Ten of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["family harmony", "lasting happiness", "emotional fulfillment", "peace", "blessings"],
  symbolism: "A family stands with arms raised toward a rainbow of ten cups in the sky. A loving couple and two dancing children represent domestic bliss and the fulfillment of family life. A river flows through a green landscape toward a welcoming home.",
  upright: `The Ten of Cups is the card of emotional fulfillment, family happiness, and the deep contentment that comes from loving relationships. The rainbow of cups represents the ultimate blessing \u2014 a life rich in love, harmony, and emotional satisfaction. When this card appears, you are experiencing or are about to experience a profound sense of belonging and peace. Family relationships are harmonious, love is abundant, and your emotional cup overflows. The Ten of Cups asks you to appreciate the blessings in your life, especially the people who love you. True wealth is not material \u2014 it is the joy of sharing your life with those who matter. This is a card of deep gratitude and lasting happiness. Cherish this moment.`,
  reversed: `The Ten of Cups reversed suggests family discord, broken relationships, or a failure to achieve the domestic bliss you long for. There may be tension at home, a divorce, or a sense of isolation from loved ones. The card can also indicate unrealistic expectations about love and family, chasing a fantasy of perfection that does not exist. Address the issues in your close relationships honestly. The rainbow is still possible, but it requires real work and real communication.`,
});

register({
  title: "Page of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["intuitive message", "creative child", "daydreamer", "emotional openness", "new feeling"],
  symbolism: "A young figure holds a cup from which a fish emerges, peeking out as if to say something. The fish represents imagination, creativity, and the messages of the subconscious rising to the surface. The figure's stance is open and curious.",
  upright: `The Page of Cups is the messenger of the emotional realm. This card brings an intuitive message, a creative inspiration, or the first stirring of a new feeling. The fish emerging from the cup represents the creative imagination bubbling up from the depths of the subconscious. When this Page appears, you are being invited to explore your emotional and creative side with childlike openness. A message may come through a dream, a sudden intuition, or a creative impulse. Pay attention to the subtle signals your heart is sending. The Page of Cups asks you to trust your feelings, even if they do not make logical sense. This is a time for gentle exploration, creative play, and emotional honesty. Let your inner child come out and play.`,
  reversed: `The Page of Cups reversed suggests emotional immaturity, creative blocks, or a refusal to listen to your intuition. You may be dismissing your feelings, avoiding a creative project out of fear, or receiving intuitive messages that you are ignoring. The card can also indicate someone who is overly emotional, using fantasy as an escape from reality, or giving in to unrealistic daydreams. Ground your creativity in action. Your feelings are valid but they are not instructions \u2014 use discernment.`,
});

register({
  title: "Knight of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["romantic", "idealist", "pursuit", "invitation", "creativity"],
  symbolism: "A knight rides a white horse, carrying a golden cup aloft. His armor is decorated with winged figures, and his cloak flows behind him. The landscape is fertile and green, reflecting the fertile ground of the heart.",
  upright: `The Knight of Cups is the romantic idealist of the Tarot. He follows his heart with total devotion, pursuing beauty, love, and creative inspiration. The cup he carries represents his emotional and artistic vision. When this card appears, you may receive an invitation, a romantic gesture, or a creative opportunity. The Knight of Cups asks you to follow your heart and pursue what inspires you. This is a time for creative expression, romantic pursuit, and following your dreams. But the Knight's idealism can also lead him astray. His heart is pure, but he may be chasing a fantasy rather than reality. Enjoy the romance and the creative energy, but keep your feet on the ground.`,
  reversed: `The Knight of Cups reversed suggests moodiness, jealousy, unrealistic expectations, or a romantic gesture that is not genuine. You may be dealing with someone who overpromises and underdelivers, or your own emotions may be leading you astray. The card can also indicate creative blocks, jealousy in relationships, or a tendency to withdraw into fantasy when reality disappoints. Check your expectations. Are you in love with a person or an idea?`,
});

register({
  title: "Queen of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["empathy", "intuition", "nurturing", "compassion", "emotional depth"],
  symbolism: "A queen sits on her throne by the sea, holding a finely decorated cup. The cup is closed, representing the deep, contained emotional wisdom she holds. Mermaids and sea creatures adorn her throne, connecting her to the depths of the emotional realm.",
  upright: `The Queen of Cups embodies emotional depth, intuition, and unconditional compassion. She is the mother of the waters, holding space for all who suffer and offering comfort without judgment. When this card appears, you are being asked to nurture yourself and others with the deep well of emotional wisdom you possess. Your empathy is your strength. You have the ability to understand what others feel and to offer genuine comfort. But the Queen also knows that her cup is closed \u2014 she protects her emotional boundaries. Be compassionate, but not to the point of draining yourself. The Queen of Cups asks you to trust your intuition, to care for others from a place of strength, and to honor the depth of your own emotional life. Your vulnerability is not weakness. It is your greatest gift.`,
  reversed: `The Queen of Cups reversed indicates emotional overwhelm, co-dependency, or a loss of emotional boundaries. You may be absorbing the feelings of others to the point of exhaustion, or you may be suppressing your own emotions because they feel too big. The card can also point to emotional manipulation, using empathy to control others, or a refusal to deal with your own emotional wounds. Restore your boundaries. You cannot pour from an empty cup.`,
});

register({
  title: "King of Cups",
  category: "Minor Arcana \u2014 Cups",
  keywords: ["emotional maturity", "wisdom", "compassion", "diplomacy", "calm authority"],
  symbolism: "A king sits on a throne floating on turbulent sea, representing his mastery over the emotional realm. He holds a cup in one hand and a scepter in the other. A fish pendant hangs around his neck, symbolizing the depth of his emotional wisdom.",
  upright: `The King of Cups represents emotional maturity, diplomatic wisdom, and the ability to remain calm and compassionate even in turbulent circumstances. He sits on a throne that floats on a stormy sea, but he is undisturbed. He has mastered his emotions rather than being controlled by them. When this card appears, you are being called to lead with compassion and emotional intelligence. You have the wisdom to handle difficult situations with grace, to mediate conflicts, and to provide stability for others. The King of Cups asks you to be the calm in the storm. Your emotional mastery is not about suppressing feelings \u2014 it is about channeling them wisely. Be compassionate but not weak, firm but not cold. True emotional authority comes from balance.`,
  reversed: `The King of Cups reversed suggests emotional manipulation, moodiness, or an authority figure who abuses their emotional power. You may be dealing with someone who uses emotions to control others, or you may be suppressing your own feelings to an unhealthy degree. The card can also indicate volatility, creating drama, or a loss of emotional control. The stormy sea has breached the throne. Restore your balance and take responsibility for your emotional state.`,
});

// Title aliases for Cups
alias("Ace of Cups", "Ace of Cups", "Ace of Coupes");
alias("Two of Cups", "Two of Cups", "Two of Coupes");
alias("Three of Cups", "Three of Cups", "Three of Coupes");
alias("Four of Cups", "Four of Cups", "Four of Coupes");
alias("Five of Cups", "Five of Cups", "Five of Coupes");
alias("Six of Cups", "Six of Cups", "Six of Coupes");
alias("Seven of Cups", "Seven of Cups", "Seven of Coupes");
alias("Eight of Cups", "Eight of Cups", "Eight of Coupes");
alias("Nine of Cups", "Nine of Cups", "Nine of Coupes");
alias("Ten of Cups", "Ten of Cups", "Ten of Coupes");
alias("Page of Cups", "Princess of Cups", "Valet of Coupes");
alias("Knight of Cups", "Knight of Cups", "Cavalier of Coupes");
alias("Queen of Cups", "Queen of Cups", "Reine of Coupes");
alias("King of Cups", "Prince of Cups", "Roi of Coupes");

})();


(function () {

register({
  title: "Ace of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["inspiration", "new venture", "creative spark", "potential", "energy"],
  symbolism: "A hand emerges from a cloud, grasping a flowering wand. A castle in the distance represents the possibilities that lie ahead. Leaves sprout from the wand, symbolizing the growth that comes from inspired action.",
  upright: `The Ace of Wands is the spark of creation, the burst of inspiration that ignites a new venture. It represents pure potential in the realm of creativity, passion, and enterprise. When this card appears, a powerful surge of energy is available to you. You have an idea, a vision, or a calling that wants to be born. The wand is in your hand \u2014 the question is what you will create with it. This is a time for bold action, for trusting your creative impulses, and for starting something new. Do not overthink it. The Ace of Wands carries the fire of life itself. Channel it into a project, a relationship, a creative work, or a personal transformation. The energy will not last forever. Use it while it is hot.`,
  reversed: `The Ace of Wands reversed indicates a creative block, a false start, or a lack of motivation. You may have an idea but lack the energy or confidence to pursue it. The spark is there but cannot catch fire. The card can also point to delays in a new venture, a project that has stalled before it began, or a loss of passion. Fan the flames. Find what reignites your enthusiasm and commit to it.`,
});

register({
  title: "Two of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["planning", "decisions", "future vision", "discovery", "ambition"],
  symbolism: "A figure stands on a battlement with a globe in one hand, looking out over a vast landscape. One wand is anchored to the wall while the other is held. A ship sails on the distant water, representing the voyages of discovery that await.",
  upright: `The Two of Wands is the card of strategic planning and long-term vision. You have already established a foundation, and now you are looking toward the horizon, considering your options for growth and expansion. The world is open before you, and you must make choices about which direction to take. This card asks you to think beyond your immediate circumstances and to plan for the future with boldness and foresight. Do not settle for what is comfortable. You have the resources, the vision, and the courage to venture further. The Two of Wands marks the moment between having a dream and taking action on it. The question is not whether you can do it \u2014 it is whether you will choose to step into your own power and pursue the path that calls to you.`,
  reversed: `The Two of Wands reversed suggests a lack of planning, fear of the unknown, or poor decisions about the future. You may be feeling restless but directionless, wanting to move forward but not knowing which way to go. The card can indicate that you have been playing small, hesitating to step into a larger vision out of fear. It can also point to plans that have gone awry or a need to rethink your strategy. Come back to the drawing board and clarify your direction before committing your energy.`,
});

register({
  title: "Three of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["expansion", "foresight", "enterprise", "progress", "exploration"],
  symbolism: "A figure stands on a cliff overlooking the sea, watching ships sail into the distance. Three wands are planted in the ground beside him. The scene represents the moment after departure, when the initial action has been taken and the results are beginning to unfold.",
  upright: `The Three of Wands is the card of expansion, progress, and enterprising spirit. The initial spark of the Ace and the planning of the Two have led to this moment \u2014 you are now in motion, and your horizons are expanding. Ships are sailing, trade routes are opening, and your influence is growing. This card encourages you to think big, to act with confidence, and to trust that your efforts are bearing fruit even if you cannot yet see the full result. You have done the groundwork. Now watch your enterprise unfold. The Three of Wands asks you to maintain your vision and your commitment as you move into this phase of growth. Success is on its way.`,
  reversed: `The Three of Wands reversed suggests delays, obstacles to expansion, or frustration with slow progress. You may have launched a venture that is not gaining traction as quickly as you hoped, or you may be feeling stuck after initial momentum. The card can also indicate a lack of foresight, a failure to plan adequately for growth, or a need to reconsider your approach. Patience is required. Adjust your sails and keep moving.`,
});

register({
  title: "Four of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["celebration", "harmony", "homecoming", "stability", "community"],
  symbolism: "Two figures raise bouquets in a celebratory gesture beneath a canopy of four wands. A garland hangs between the wands, and a castle stands in the background, representing the stability and security of home and community.",
  upright: `The Four of Wands is a card of celebration, harmony, and joyful reunions. It marks a milestone, a homecoming, or a moment of shared happiness. The structure you have built is stable, and it is time to celebrate that achievement with those you love. This card often appears for weddings, family gatherings, the purchase of a home, or any event that brings people together in joy. The Four of Wands asks you to pause and appreciate what you have built. You have created a foundation of stability and harmony. Enjoy it. Let yourself be surrounded by the people who matter. This is a time of rest and gratitude before the next phase of growth begins.`,
  reversed: `The Four of Wands reversed can indicate a disruption in home life, a celebration that has been canceled or gone wrong, or a feeling of instability in your foundations. Family tensions may be present, or you may be feeling disconnected from your community. The card can also point to a lack of harmony at home or a sense of not belonging. Address whatever is undermining your sense of security and connection.`,
});

register({
  title: "Five of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["conflict", "competition", "struggle", "tension", "challenge"],
  symbolism: "Five figures each brandish a wand, engaged in a chaotic struggle. Each figure appears to be fighting against the others, with no clear victor. The wands cross in the air, creating a visual representation of clashing energies.",
  upright: `The Five of Wands represents conflict, competition, and the clash of opposing forces. This is a card of creative tension, where different ideas, personalities, or energies meet and struggle for dominance. The conflict is not necessarily destructive \u2014 it can be the friction that sharpens your edge and clarifies your position. This card often appears when you are in a competitive environment, when there is disagreement within a group, or when your own internal conflicts are coming to a head. The Five of Wands asks you to engage constructively with the chaos. Not all conflict is bad. Competition can push you to be better. Disagreement can lead to stronger solutions. Find the productive edge of the struggle and work with it, not against it.`,
  reversed: `The Five of Wands reversed suggests a resolution of conflict, an avoidance of confrontation, or internalized tension. You may be trying to smooth things over instead of dealing with the underlying issues, or you may have disengaged from a conflict that needs your participation. The card can also indicate that competition has turned toxic or that you are holding back your truth to avoid disagreement. Find a healthy way to express what needs to be said. Avoidance is not resolution.`,
});

register({
  title: "Six of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["victory", "recognition", "success", "acclaim", "confidence"],
  symbolism: "A figure rides a white horse through a cheering crowd, wearing a laurel wreath of victory. A banner with a star is carried alongside him. The wands held by the crowd honor his achievement and acknowledge his triumph.",
  upright: `The Six of Wands is the card of victory, public recognition, and the sweet taste of success. You have achieved something significant, and others are acknowledging your accomplishment. This is a time of celebration, confidence, and well-earned pride. The ride through the crowd represents the moment when your efforts are seen and appreciated by others. Enjoy this recognition, but do not let it go to your head. The Six of Wands asks you to accept the praise gracefully, to acknowledge the contributions of those who helped you along the way, and to use this moment of confidence as fuel for continued growth. You have won this round. Let yourself feel good about it.`,
  reversed: `The Six of Wands reversed suggests a lack of recognition, failure, or a fall from grace. You may have been overlooked for a promotion, your efforts may have gone unnoticed, or you may be struggling with low confidence after a setback. The card can also indicate that you are seeking external validation too aggressively, or that you have become arrogant and are about to be humbled. Find your validation from within rather than from the crowd.`,
});

register({
  title: "Seven of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["defense", "perseverance", "standing ground", "challenge", "protection"],
  symbolism: "A figure stands on elevated ground, wielding a wand against six wands that rise from below, representing the challenges and attacks coming from others. The figure's position is higher, but the opposition is numerous.",
  upright: `The Seven of Wands is the card of standing your ground, defending your position against opposition. You are being challenged, and you must assert yourself to hold what you have earned. The figure on the hill has the advantage of higher ground, but the wands coming from below represent persistent opposition. This card tells you that you have what it takes to defend your position. Do not back down. Your values, your achievements, and your boundaries are worth protecting. The Seven of Wands asks you to be firm and courageous in the face of opposition. Others may challenge you, but you have already proven your worth. Hold your ground and trust your position.`,
  reversed: `The Seven of Wands reversed suggests feeling overwhelmed, giving in to pressure, or losing your position because you could not hold the line. You may be feeling exhausted from constant defense, ready to capitulate, or unsure whether your position is worth holding. The card can indicate that you are fighting battles that are not yours, or that you need to choose your battles more wisely. Know when to stand firm and when to let go.`,
});

register({
  title: "Eight of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["swiftness", "movement", "action", "momentum", "progress"],
  symbolism: "Eight wands fly through the air at an angle, creating a sense of rapid motion and unstoppable momentum. The landscape below is peaceful, suggesting that the movement is both energetic and harmonious.",
  upright: `The Eight of Wands is the card of swift action, rapid progress, and forward momentum. Things that have been stalled are now moving at speed. Messages arrive, plans come together, and obstacles dissolve. This is a time of accelerated energy, when the universe seems to support quick movement and decisive action. The Eight of Wands asks you to go with the flow of this energy. Do not hesitate or second-guess yourself. Strike while the iron is hot, send that message, take that leap. The momentum is on your side. Delays are ending, and the pace of events will only increase. Trust the speed and act with confidence.`,
  reversed: `The Eight of Wands reversed indicates delays, slowdowns, or a loss of momentum. Plans that were moving forward may be stalled by unforeseen obstacles, or communication may be tangled. The card can also point to scattered energy, rushing too fast without direction, or frustration with the pace of progress. Slow down and check your direction before you push harder. Sometimes a delay is a redirection.`,
});

register({
  title: "Nine of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["resilience", "persistence", "last stand", "boundaries", "endurance"],
  symbolism: "A figure leans on a staff, wearing a bandage on his head, looking warily behind him at a row of eight wands. He has been through battle, but he is still standing, ready to defend what is his. The figure's expression shows vigilance and fatigue but not defeat.",
  upright: `The Nine of Wands is the card of resilience, of having been through the fire and still standing. You have faced challenges and you are tired, but you have not given up. This card acknowledges the weariness of a long struggle while affirming that you have the strength to continue. The figure has a bandage from a previous fight, yet he is still standing guard. You have been tested, and you have proven your endurance. Now you must gather your remaining strength for the final push. The Nine of Wands asks you to hold on a little longer. You are further along than you think. The last battle is often the hardest, but you will not lose unless you lay down your arms. Persist. The victory is close.`,
  reversed: `The Nine of Wands reversed indicates burnout, giving up, or a loss of will to continue. You may have been fighting for too long without relief, and your reserves are depleted. The card can also suggest paranoia or defensiveness, seeing threats everywhere because you are exhausted. It may be time to ask for help, to delegate, or to lay down a burden that is not yours to carry. Distinguish between healthy persistence and stubborn self-destruction.`,
});

register({
  title: "Ten of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["burden", "overwhelm", "responsibility", "stress", "release"],
  symbolism: "A figure struggles under the weight of ten wands, bent forward as he carries them toward a distant building. The wands block his view of the path ahead. The scene represents the crushing weight of too many responsibilities.",
  upright: `The Ten of Wands is the card of burden, overwhelm, and the heavy weight of responsibility. You have taken on too much, and the load is becoming unsustainable. The figure cannot see where he is going because the wands block his vision. You may be carrying responsibilities that are not yours, saying yes when you should say no, or pushing yourself to the point of exhaustion. The Ten of Wands asks you to recognize the cost of your commitments. Something must be released or delegated. You cannot carry everything forever. This card is not a judgment on your hard work \u2014 it is a warning that you are approaching burnout. Identify what can be set down and give yourself permission to lighten the load.`,
  reversed: `The Ten of Wands reversed suggests the beginning of release, delegating burdens, or learning to say no. You are starting to recognize that you have been carrying too much, and you are taking steps to unload. The card can also indicate that a burden has been lifted, a project has been completed, or you are emerging from a period of extreme stress. There is light at the end of this tunnel. Keep letting go of what is not yours to carry.`,
});

register({
  title: "Page of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["enthusiasm", "discovery", "curiosity", "creative messenger", "beginning"],
  symbolism: "A young figure holds a wand with both hands, gazing at it with wonder and excitement. A distant landscape suggests adventure ahead. The figure's brightly colored clothing reflects the fiery nature of the suit of Wands.",
  upright: `The Page of Wands brings the energy of youthful enthusiasm and the excitement of discovery. This card represents the beginning of a creative journey, a new venture approached with curiosity and openness. The Page gazes at the wand as if seeing its potential for the first time. When this card appears, you are being invited to explore a new interest, to start a creative project, or to approach life with the wide-eyed wonder of a beginner. The Page of Wands asks you to say yes to the spark of curiosity. You do not need to have everything figured out. You just need to be willing to start. Enthusiasm is your greatest asset right now. Follow it and see where it leads.`,
  reversed: `The Page of Wands reversed suggests a lack of direction, low energy, or a creative project that has stalled before it began. You may be feeling uninspired, procrastinating on a new venture, or doubting your creative abilities. The card can also indicate immaturity, making grand plans without following through, or a fear of starting. Reconnect with your sense of wonder and give yourself permission to begin imperfectly.`,
});

register({
  title: "Knight of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["adventure", "impulse", "energy", "passion", "action"],
  symbolism: "A knight in full armor rides a rearing horse, charging forward with a wand raised high. His armor is emblazoned with salamanders, mythical creatures of fire. The landscape reflects the intensity of his forward motion.",
  upright: `The Knight of Wands is pure fiery energy in motion. This card represents passionate pursuit, adventurous spirit, and the impulse to chase what sets your soul on fire. The Knight charges forward with total commitment, driven by conviction and a hunger for experience. When this card appears, you are being called to act with passion and courage. Whatever you have been hesitating about, the Knight says go for it. This is a time for bold moves, for following your passion, and for pursuing your goals with fiery determination. The Knight of Wands does not wait for the perfect moment \u2014 he creates it. Channel his energy into focused action, but be aware that the Knight can also burn out quickly. Strike while the fire is hot, but keep your eye on the long game.`,
  reversed: `The Knight of Wands reversed indicates impulsiveness, scattered energy, or a project that burned out due to lack of follow-through. You may be charging in without a plan, creating chaos in your wake. The card can also point to frustration, delays that have killed your momentum, or anger that is driving you recklessly. Pull back the reins and regain your focus before you charge into something you will regret.`,
});

register({
  title: "Queen of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["confidence", "charisma", "determination", "warmth", "courage"],
  symbolism: "A queen sits on her throne holding a sunflower in one hand and a wand in the other. The sunflower represents the warmth and radiance of her personality. A black cat sits at her feet, symbolizing her independence and intuition.",
  upright: `The Queen of Wands embodies confidence, charisma, and unshakable self-belief. She is warm, passionate, and fiercely independent. When this card appears, you are being asked to step into your own power with grace and authority. The Queen of Wands knows her worth and is not afraid to shine. She leads with courage, inspires with her warmth, and trusts her intuition completely. This card often represents a strong female figure in your life or an aspect of yourself that is coming into leadership. The Queen of Wands asks you to be bold, to own your strengths, and to share your fire with the world. You have the confidence and the courage to achieve what you want. Sit in your throne and command your domain.`,
  reversed: `The Queen of Wands reversed suggests self-doubt, jealousy, or a lack of confidence. You may be feeling insecure about your abilities, letting fear hold you back from expressing your true self. The card can also indicate someone who is overly demanding, egotistical, or using their charisma to manipulate others. You may need to reconnect with your inner fire and remind yourself of your worth. Do not dim your light to make others comfortable.`,
});

register({
  title: "King of Wands",
  category: "Minor Arcana \u2014 Wands",
  keywords: ["leadership", "vision", "authority", "entrepreneurship", "honor"],
  symbolism: "A king sits on his throne, robed in fiery colors, holding a wand in full bloom. Salamanders adorn his throne, representing the transformative power of fire. His crown and scepter signify his mastery over the realm of creativity and enterprise.",
  upright: `The King of Wands represents bold leadership, visionary thinking, and the mature expression of creative power. He is the entrepreneur, the innovator, the one who turns ideas into reality through force of will and confident action. When this card appears, you are being called to lead with vision and integrity. The King of Wands does not wait for permission \u2014 he creates the future he wants to see. You have the experience, the wisdom, and the drive to take charge and guide others toward a shared goal. This is a time for decisive action and inspired leadership. Trust your vision and have the courage to implement it. The King of Wands reminds you that true leadership serves the greater good, not just the ego.`,
  reversed: `The King of Wands reversed suggests poor leadership, a misuse of power, or an inability to follow through on grand visions. You may be dealing with someone who is domineering, arrogant, or reckless in their authority. Alternatively, the card can indicate that you are not stepping into your leadership role when you should be, or that your confidence has turned into ego. Check your motives and ensure your leadership serves others, not just yourself.`,
});

// Title aliases for Wands
alias("Ace of Wands", "Ace of Wands", "Ace of Batons");
alias("Two of Wands", "Two of Wands", "Two of Batons");
alias("Three of Wands", "Three of Wands", "Three of Batons");
alias("Four of Wands", "Four of Wands", "Four of Batons");
alias("Five of Wands", "Five of Wands", "Five of Batons");
alias("Six of Wands", "Six of Wands", "Six of Batons");
alias("Seven of Wands", "Seven of Wands", "Seven of Batons");
alias("Eight of Wands", "Eight of Wands", "Eight of Batons");
alias("Nine of Wands", "Nine of Wands", "Nine of Batons");
alias("Ten of Wands", "Ten of Wands", "Ten of Batons");
alias("Page of Wands", "Princess of Wands", "Valet of Batons");
alias("Knight of Wands", "Knight of Wands", "Cavalier of Batons");
alias("Queen of Wands", "Queen of Wands", "Reine of Batons");
alias("King of Wands", "Prince of Wands", "Roi of Batons");

})();
