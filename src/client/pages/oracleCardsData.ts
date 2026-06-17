export interface OracleCardDef {
  title: string;
  category: string;
  keywords: string[];
  symbolism: string;
  upright: string;
  reversed?: string;
}

const TITLE_INDEX: Record<string, OracleCardDef> = {};

export function getOracleCard(title: string): OracleCardDef | undefined {
  return TITLE_INDEX[title];
}

export function getOracleCardsForDeck(deckId: string): OracleCardDef[] {
  return Object.values(TITLE_INDEX).filter(c => c.title.startsWith(deckId + "|"));
}

export function getMeaning(title: string, reversed: boolean): { keywords: string; symbolism: string; meaning: string } {
  const card = TITLE_INDEX[title];
  if (!card) return { keywords: "", symbolism: "", meaning: title };
  return {
    keywords: card.keywords.join(", "),
    symbolism: card.symbolism,
    meaning: reversed && card.reversed ? card.reversed : card.upright,
  };
}

function register(c: OracleCardDef) {
  TITLE_INDEX[c.title] = c;
}

function alias(title: string, ...aliases: string[]) {
  for (const a of aliases) TITLE_INDEX[a] = TITLE_INDEX[title];
}

/* ══════════════════════════════════════════════════
   WISDOM OF THE ORACLE (Colette Baron-Reid, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "wisdom-of-the-oracle|The Emissary",
  category: "Wisdom of the Oracle",
  keywords: ["messenger", "communication", "new information", "guidance", "delivery"],
  symbolism: "A winged figure descends from golden clouds carrying a sealed scroll tied with a crimson ribbon. Below, a lone traveler on a path looks upward, hands open to receive. The landscape stretches toward distant hills where the sun rises.",
  upright: `The Emissary arrives bearing news that has been sought or a message that carries the weight of synchronicity. This card speaks of communication that comes at the exactly right moment, often through unexpected channels. You may receive a letter, a phone call, or a chance encounter that delivers precisely what you need to hear. The messenger is not the source of the wisdom but the carrier. Pay attention to what arrives now, even if it seems small or insignificant. The universe speaks through signs, symbols, and the voices of those it sends your way. Open your hands and your heart to receive what is being delivered. This message has traveled a long road to reach you. Do not dismiss it as coincidence. The Emissary confirms that you are being guided and that the information you need is on its way. Trust the timing. What arrives now arrives for a reason.`,
  reversed: `The Emissary reversed suggests a message that has been delayed, miscommunicated, or ignored. You may have missed an important sign or refused to hear what someone is trying to tell you. Check your assumptions and your willingness to listen. The message may still arrive, but you must be open to receiving it.`,
});

register({
  title: "wisdom-of-the-oracle|The Garden",
  category: "Wisdom of the Oracle",
  keywords: ["nurturing", "growth", "cultivation", "patience", "beauty"],
  symbolism: "A walled garden blooms with roses, lavender, and flowering vines. A woman in simple clothes tends the soil with her hands, a watering can beside her. Butterflies drift among the blossoms, and a stone bench sits beneath an arbor.",
  upright: `The Garden represents the patient cultivation of your dreams and relationships. Nothing grows overnight. The seeds you have planted in your life, whether in love, work, or creative expression, need consistent care and attention. This card asks you to tend your life with the same devotion a gardener gives to her plants. Pull the weeds of doubt and negativity. Water your commitments with regular attention. Give your projects sunlight through focus and warmth through passion. The Garden reminds you that beauty and abundance are the natural result of steady, loving care. You are not meant to rush the process. Enjoy the slow unfolding. Trust that what you nurture now will bloom in its own season. The harvest will come. Until then, keep your hands in the soil and your heart open to the growth that is happening beneath the surface.`,
  reversed: `The Garden reversed indicates neglect, impatience, or a failure to nurture what matters. You may have abandoned a relationship, a project, or yourself. Weeds have overtaken the beds, and what once flourished is now struggling. The card asks you to assess what you have been ignoring and to return to the work of loving care. It is never too late to start tending again.`,
});

register({
  title: "wisdom-of-the-oracle|The Bridge",
  category: "Wisdom of the Oracle",
  keywords: ["connection", "transition", "crossing over", "reconciliation", "pathway"],
  symbolism: "An ancient stone bridge arches over a wide river, connecting two distinct landscapes. On one side lies a dark forest; on the other, sunlit meadows. A figure stands at the center of the bridge, pausing to take in both shores.",
  upright: `The Bridge appears when you are being asked to connect two seemingly separate parts of your life or to cross from one state of being into another. The river below represents the passage of time and the flow of experience. You are not meant to stay on one side forever. The Bridge invites you to make a crossing. This may involve reconciling with someone, integrating opposing aspects of yourself, or making a transition that has felt daunting. The structure beneath you is solid. The path is walkable. Your only task is to take the steps. The Bridge assures you that the connection you seek is possible. What has felt divided can be united. What has seemed out of reach is now accessible. Trust the architecture of your life. It was built to hold you.`,
  reversed: `The Bridge reversed suggests a refusal to cross, a connection that has broken, or a transition that feels blocked. You may be clinging to one shore out of fear of what lies on the other side. The card asks you to examine what is preventing the crossing. Is the bridge truly broken, or are you simply afraid to walk it? Repair is possible, but you must be willing to make the journey.`,
});

register({
  title: "wisdom-of-the-oracle|The Compass",
  category: "Wisdom of the Oracle",
  keywords: ["direction", "guidance", "inner knowing", "true north", "orientation"],
  symbolism: "An ornate compass rests on an open palm, its needle pointing steadily toward a single direction. Behind it, a map unfurls across a wooden table with marked routes and unknown territories. Candlelight casts warm shadows on the parchment.",
  upright: `The Compass speaks to the inner guidance that always points you toward your true north. You may feel uncertain about which direction to take, but the needle of your heart already knows the way. This card asks you to trust your internal navigation system above all external advice. Others may have opinions, maps, and suggestions, but only you know the direction that aligns with your deepest truth. The Compass does not show you the entire journey. It shows you the next step. Look at what is directly before you and ask yourself whether it points toward your authentic path. If yes, move forward. If not, adjust. You are not lost. You are simply being asked to consult the guidance that lives within you. Your true north is fixed and steady. Trust it.`,
  reversed: `The Compass reversed indicates confusion, a loss of direction, or reliance on external validation at the expense of your own knowing. You may feel pulled in many directions, unable to sense which way is true. The card asks you to pause and go inward. The needle still points true. You need to quiet the noise to feel it.`,
});

register({
  title: "wisdom-of-the-oracle|The Mirror",
  category: "Wisdom of the Oracle",
  keywords: ["reflection", "self-awareness", "truth", "perception", "honesty"],
  symbolism: "A woman stands before an ornate standing mirror, but instead of reflecting her face, the mirror shows a radiant version of herself surrounded by light. The room is dim, but the reflection glows with an inner radiance.",
  upright: `The Mirror invites you to look honestly at yourself and see beyond the surface. What you see in the reflection is not always what the world sees, but what is true about you at the deepest level. This card asks for radical self-honesty. Stop looking at how others perceive you and look at how you perceive yourself. The Mirror reveals the parts of yourself you may have been avoiding, the gifts you have not claimed, and the truth you have been reluctant to admit. It asks you to see yourself clearly and to love what you see. The reflection in the Mirror is not a stranger. It is you. All of you. The light and the shadow, the strength and the vulnerability. Accept the full picture. When you see yourself as you truly are, you can begin to live as you truly are.`,
  reversed: `The Mirror reversed suggests denial, self-deception, or a refusal to see the truth about yourself. You may be avoiding a reflection that makes you uncomfortable. The card asks you to stop looking away. What you resist seeing will continue to follow you. Courage is required, but the truth will set you free.`,
});

register({
  title: "wisdom-of-the-oracle|The Sunflower",
  category: "Wisdom of the Oracle",
  keywords: ["turning toward the light", "optimism", "devotion", "loyalty", "following your joy"],
  symbolism: "A field of sunflowers stretches toward a brilliant golden sun. One sunflower stands taller than the rest, its face fully turned to the light. Bees drift between the blooms, and the sky is clear and warm.",
  upright: `The Sunflower teaches the art of turning toward what gives you life. Just as the sunflower follows the sun across the sky, you are being called to orient yourself toward joy, gratitude, and the sources of warmth in your life. This card asks you to notice where you direct your attention. Are you facing the light or turning away from it? The Sunflower does not deny the existence of clouds, but it keeps its face turned toward the brightness. You are asked to do the same. Cultivate optimism not as denial of difficulty, but as a conscious choice to seek the good. Devote yourself to what lifts you. Follow what brings you alive. When you turn your face toward the light, the shadows fall behind you where they belong.`,
  reversed: `The Sunflower reversed suggests turning away from joy, pessimism, or a refusal to see the good in your life. You may be dwelling in darkness when light is available. The card asks you to examine why you resist happiness. Is there a fear of disappointment that keeps you from hoping? Turn your face back toward the sun. It is still shining.`,
});

register({
  title: "wisdom-of-the-oracle|The Labyrinth",
  category: "Wisdom of the Oracle",
  keywords: ["journey", "complexity", "patience", "trusting the process", "winding path"],
  symbolism: "A winding labyrinth is set into the floor of an ancient stone courtyard. A woman stands at the entrance, one hand resting on the stone wall, ready to begin the walk. Ivy grows along the outer edges, and the sky above is filled with stars.",
  upright: `The Labyrinth appears when you are in the middle of a complex process that cannot be rushed. Unlike a maze, which is designed to confuse, a labyrinth has a single path that winds and turns but always leads to the center. You are not lost. You are on a path that requires patience and trust. The Labyrinth asks you to keep walking even when you cannot see the destination. Every turn has purpose. Every step brings you closer to the center, even when it feels like you are moving sideways. Trust the winding nature of your journey. The direct route is not always available, and the scenic route has its own lessons. Breathe. Stay on the path. You will reach the center in exactly the right time. The Labyrinth does not test you. It teaches you.`,
  reversed: `The Labyrinth reversed suggests frustration with the pace of progress or a feeling of being stuck in confusion. You may want to rush or abandon the path altogether. The card asks you to slow down and trust that each step matters, even the ones that feel circular. Impatience is the only real obstacle.`,
});

register({
  title: "wisdom-of-the-oracle|The Seed",
  category: "Wisdom of the Oracle",
  keywords: ["potential", "beginning", "trust", "small steps", "what is planted"],
  symbolism: "A pair of cupped hands holds a single seed glowing with inner light. The seed rests in dark, rich soil. Behind the hands, a vast field stretches under a twilight sky, and tiny green shoots are visible pushing through the earth.",
  upright: `The Seed represents the beginning of something that has not yet shown itself to the world. You have planted something through your intention, your desire, or your actions, but it has not yet broken the surface. This card asks you to trust the process of growth even when you cannot see results. The seed does not struggle to become a plant. It simply rests in the soil, drawing nourishment, until the time is right to sprout. Your job is not to force the growth but to provide the conditions. Patience, faith, and consistent care. What you have begun is alive and growing beneath the surface. It will emerge when it is ready. Trust the darkness of the soil as much as the light of the sun. Both are necessary for growth. Your potential is not wasted. It is germinating.`,
  reversed: `The Seed reversed indicates impatience with growth, a fear that nothing is happening, or a seed that has been planted in poor conditions. You may be trying to force something before its time. Check the soil of your life. Are you providing what this beginning needs? Adjust your care and trust the timing.`,
});

register({
  title: "wisdom-of-the-oracle|The Waterfall",
  category: "Wisdom of the Oracle",
  keywords: ["release", "flow", "purification", "catharsis", "letting go"],
  symbolism: "A powerful waterfall crashes into a deep blue pool surrounded by moss-covered rocks. A woman stands beneath the cascade, clothes soaked, arms raised in surrender. Rainbows form in the mist around her. Sunlight filters through the trees.",
  upright: `The Waterfall is the card of emotional release and purification. You have been holding onto grief, anger, fear, or tension that needs to be released. The Waterfall invites you to let it go. Stand beneath the cascade and allow the waters to wash away what no longer serves you. Tears, laughter, confession, or physical movement. The release must come. The Waterfall does not judge what it washes away. It simply carries it downstream. This card asks you to stop controlling your emotions and start expressing them. The energy you have been holding is not meant to stay inside you. Let it pour out. Give yourself permission to feel fully and to release completely. After the waterfall comes the calm pool. After the release comes the peace. You cannot reach the stillness without first allowing the flow.`,
  reversed: `The Waterfall reversed suggests blocked emotions, a refusal to release, or holding onto pain that needs to be expressed. You may be trying to stay in control when what you need is to let go. The pressure is building. Find a safe way to release before the dam breaks on its own.`,
});

register({
  title: "wisdom-of-the-oracle|The Cauldron",
  category: "Wisdom of the Oracle",
  keywords: ["transformation", "alchemy", "inner work", "brewing", "deep change"],
  symbolism: "A large iron cauldron sits over a fire in a moonlit clearing. Steam rises in shapes that form faces and symbols. A woman stirs the contents with a wooden staff. The stars above are mirrored in the bubbling liquid below.",
  upright: `The Cauldron represents the deep, transformative work that happens in the hidden places of your life. What is being brewed inside you is not visible to others, but it is powerful and real. This card speaks to the alchemical process of turning old pain into wisdom, confusion into clarity, and fear into courage. You are in a period of profound inner change. The ingredients of your past experiences are being combined to create something new. Trust the process, even when it feels uncomfortable. The Cauldron does not reveal its contents until the transformation is complete. Your task is to tend the fire and trust the recipe. What is cooking is exactly what you need. When the time is right, the brew will be ready to serve its purpose. You are not breaking down. You are being remade.`,
  reversed: `The Cauldron reversed suggests resistance to transformation or a fear of the deep changes occurring within you. You may be trying to avoid the inner work by staying busy or distracting yourself. The Cauldron still simmers. You cannot stop the process by ignoring it. Face what is brewing inside you. It will not go away.`,
});

register({
  title: "wisdom-of-the-oracle|The Tides",
  category: "Wisdom of the Oracle",
  keywords: ["fluctuation", "natural cycles", "ebb and flow", "patience", "rhythm"],
  symbolism: "The moon hangs full over a restless sea. Waves advance and retreat along a sandy shore dotted with seashells and starfish. A woman sits on a rock at the water's edge, watching the rhythm of the tide with calm attention.",
  upright: `The Tides remind you that life moves in cycles of advance and retreat. Not every moment is a time of action and forward movement. Some moments ask you to pull back, to rest, to allow the waters to recede before they return. This card asks you to honor the natural rhythms of your life. You cannot be in the push phase forever. The tide that goes out always comes back in. Trust the rhythm. When the tide is low, use the time for reflection, restoration, and gathering what has been left on the shore. When the tide is high, ride the wave of momentum. The Tides teach you to work with the natural flow of your life rather than against it. You are not failing when you retreat. You are participating in the eternal cycle that governs all of life. The sea always returns. So will your power, your clarity, and your forward motion.`,
  reversed: `The Tides reversed suggests fighting against natural cycles, exhaustion from constant pushing, or a refusal to accept the ebb phase. You may be trying to force progress when the natural flow is pulling back. Rest is not weakness. Stop fighting the tide and allow yourself to float.`,
});

register({
  title: "wisdom-of-the-oracle|The Gift",
  category: "Wisdom of the Oracle",
  keywords: ["generosity", "receiving", "blessing", "offering", "gratitude"],
  symbolism: "A beautifully wrapped box tied with gold ribbon rests on a velvet cushion. The box glows with a soft inner light. Hands reach toward it with reverence and curiosity. The background is draped in rich fabric suggesting ceremony and celebration.",
  upright: `The Gift represents something valuable that is being offered to you. This may be a talent you have not yet claimed, an opportunity that arrives unexpectedly, a relationship that enriches your life, or a moment of grace that feels undeserved. The Gift asks you to receive with open hands and an open heart. So often we struggle to accept what is freely given. We question whether we deserve it, or we feel obligated to earn it. The Gift asks you to simply say thank you. Receiving is a spiritual practice. When you allow yourself to receive, you honor the giver and you acknowledge your own worthiness. This gift is not a test. It is a blessing. Accept it with grace and allow it to enrich your life. You are deserving of good things. The universe offers them freely. Let yourself receive.`,
  reversed: `The Gift reversed indicates difficulty receiving, a refusal to accept help, or a gift that comes with strings attached. You may feel unworthy of what is being offered, or you may be suspicious of generosity. The card asks you to examine your beliefs about receiving. Are you blocking your own blessings? Open your hands and your heart.`,
});

register({
  title: "wisdom-of-the-oracle|The Mountain",
  category: "Wisdom of the Oracle",
  keywords: ["challenge", "perseverance", "achievement", "obstacle", "summit"],
  symbolism: "A towering mountain peak rises above a cloud line, its summit touched by the first light of dawn. A climber stands on a ledge partway up, looking upward with determination. The trail behind is steep and visible far below.",
  upright: `The Mountain speaks of challenges that must be met with determination and steady effort. You are facing an obstacle that feels large, perhaps overwhelming. The Mountain does not deny the difficulty. It asks you to keep climbing. Every step upward brings you closer to the summit. The view from below can make the peak seem impossible, but you do not need to reach the top in one leap. You need only to take the next step. The Mountain teaches persistence, resilience, and the value of hard-won achievement. When you reach the summit, the perspective you gain will make every struggle worthwhile. The climb is the teacher. The summit is the reward. Do not give up. You are stronger than the obstacle before you. The Mountain is there to show you what you are made of.`,
  reversed: `The Mountain reversed suggests an obstacle that feels insurmountable, a loss of motivation, or the choice to turn back. You may feel exhausted or defeated by the challenge before you. The card asks you to pause and assess. Do you need to rest and try again, or is it time to find another route? The Mountain will still be there when you are ready.`,
});

register({
  title: "wisdom-of-the-oracle|The River",
  category: "Wisdom of the Oracle",
  keywords: ["flow", "movement", "life force", "adaptability", "going with the flow"],
  symbolism: "A wide, clear river winds through a green valley, reflecting the blue sky above. Trees and wildflowers line its banks. A small boat drifts on the current, unmanned, moving with the natural flow of the water.",
  upright: `The River represents the natural flow of life and the wisdom of moving with it rather than against it. Water does not struggle against the riverbed. It finds the path of least resistance and flows steadily toward the sea. This card asks you to trust the current of your life. Stop paddling against the flow. Stop trying to control every outcome. Relax into the movement that is already carrying you. The River knows where it is going, even if you cannot see the destination from where you float. Trust that you are being carried toward exactly what you need. Your task is not to steer the river but to stay afloat and enjoy the journey. When you stop fighting, you start flowing. And when you flow, life becomes easier, more graceful, and far more rewarding. Let the River carry you. It knows the way.`,
  reversed: `The River reversed suggests resistance to the natural flow, struggling against circumstances, or feeling stuck in stagnant waters. You may be trying to control outcomes that are not yours to control. The card asks you to release your grip and trust the current. Fighting the flow only exhausts you. Let go and allow yourself to be moved.`,
});

register({
  title: "wisdom-of-the-oracle|The Key",
  category: "Wisdom of the Oracle",
  keywords: ["access", "solution", "opportunity", "answer", "unlocking"],
  symbolism: "An ornate antique key floats in a beam of golden light. Behind it, a heavy wooden door stands slightly ajar. Dust motes dance in the light, and the air feels charged with possibility and anticipation.",
  upright: `The Key represents the solution, the answer, or the access point you have been seeking. You may have been searching for a way forward, a missing piece, or a breakthrough. The Key tells you that the answer is within reach. It may have been there all along, waiting for you to see it. This card asks you to look at your situation from a new angle. What have you overlooked? What simple solution have you dismissed because it seemed too obvious? The Key does not create the door. It opens what already exists. Your role is to pick it up and turn it. The opportunity is there. The access is available. The question is whether you will take the step. You have everything you need to move forward. The Key is in your hand. Use it.`,
  reversed: `The Key reversed suggests a solution that remains hidden, a door that will not open, or a feeling of being locked out. You may be looking in the wrong place for answers or refusing to try the obvious solution. The card asks you to step back and reconsider your approach. Sometimes the key is not a thing but a change in perspective.`,
});

register({
  title: "wisdom-of-the-oracle|The Crossroads",
  category: "Wisdom of the Oracle",
  keywords: ["choice", "decision", "intersection", "options", "free will"],
  symbolism: "A signpost at a crossroads points in four directions, each path leading to a different landscape: mountains, forest, sea, and meadow. A traveler stands at the center, holding a walking stick, contemplating the way forward.",
  upright: `The Crossroads appears when a significant choice is before you. You have arrived at a point where the path divides, and the direction you choose will shape your future in meaningful ways. This card does not tell you which path to take. It asks you to be present to the choice itself. Each path leads somewhere valid, but each leads somewhere different. The Crossroads asks you to consider your destination. Not where the road leads, but where you want to go. Listen to your heart. Consult your values. Trust your intuition. The right choice is the one that aligns with your deepest truth. You may wish someone could decide for you, but this is your choice to make. The Crossroads honors your free will. Choose consciously, choose bravely, and trust that no choice is truly wrong. Every road has gifts and lessons. The power is in the choosing.`,
  reversed: `The Crossroads reversed suggests indecision, avoidance of a necessary choice, or fear of making the wrong decision. You may be standing at the intersection frozen, unwilling to move. The card asks you to recognize that not choosing is itself a choice. Indecision does not stop time. It only delays your journey. Choose something. You can always adjust later.`,
});

register({
  title: "wisdom-of-the-oracle|The Ancestors",
  category: "Wisdom of the Oracle",
  keywords: ["lineage", "heritage", "wisdom of elders", "roots", "support"],
  symbolism: "A procession of shadowy figures walks through a misty landscape, their forms translucent yet distinct. An older woman with kind eyes stands closest, her hand extended. Behind them, a great tree spreads its roots deep into the earth.",
  upright: `The Ancestors appear to remind you that you are not alone and that you stand on the foundation of those who came before you. Your lineage, whether biological, spiritual, or chosen, supports you. The wisdom of your elders is available to you, both those you have known and those who lived long before your time. This card asks you to draw strength from your roots. Remember where you come from. Honor the struggles and triumphs of those who paved the way for your existence. Their blood, their tears, their hopes run through your veins. You carry their legacy forward. The Ancestors offer their guidance and protection. You do not have to figure everything out on your own. Call on them. Listen for their whispers in the wind, in your dreams, in the sudden knowing that arrives without explanation. They are with you. They always have been.`,
  reversed: `The Ancestors reversed suggests a disconnection from your roots, unresolved family patterns, or a refusal to honor where you come from. You may be carrying wounds from your lineage that need healing. The card asks you to make peace with your past and your people. Forgiveness and understanding can free you from patterns that are not yours to carry.`,
});

register({
  title: "wisdom-of-the-oracle|The Swan",
  category: "Wisdom of the Oracle",
  keywords: ["grace", "beauty", "transformation", "elegance", "trust"],
  symbolism: "A white swan glides across a still lake at dawn, its reflection perfect in the water. Reeds and lily pads frame the shore. The sky is painted in soft pinks and golds. The swan's neck curves in a graceful arc.",
  upright: `The Swan embodies grace, beauty, and the quiet confidence that comes from knowing who you are. The swan glides across the water with effortless elegance, but beneath the surface, its feet are paddling steadily. This card speaks to the dignity with which you carry yourself, even when the work is hard and unseen. You are being asked to trust in your own grace. Move through your life with poise. Do not rush. Do not force. The Swan shows you that true elegance is not about perfection but about authenticity. You are beautiful in your natural state. Trust that. The Swan also speaks of transformation. Just as the ugly duckling becomes the swan, you are growing into a version of yourself that you may not yet fully recognize. Trust the process of becoming. Your true form is emerging, and it is exquisite.`,
  reversed: `The Swan reversed suggests awkwardness, self-consciousness, or a struggle to trust your own beauty and worth. You may feel ungainly or out of place. The card asks you to stop comparing yourself to others. Your grace is unique. Trust that you are exactly where you need to be, becoming exactly who you are meant to be.`,
});

register({
  title: "wisdom-of-the-oracle|The Dolphin",
  category: "Wisdom of the Oracle",
  keywords: ["joy", "play", "intelligence", "connection", "breath"],
  symbolism: "A pod of dolphins leaps through sparkling turquoise waves, their bodies arcing in perfect harmony. Sunlight dances on the water. A figure swims among them, laughing, completely at home in the deep blue sea.",
  upright: `The Dolphin brings the medicine of joy, play, and intelligent connection. Dolphins are among the most playful creatures, yet they are deeply intelligent and fiercely protective of their pod. This card asks you to bring more joy into your life. You have been taking things too seriously. The Dolphin reminds you that play is not a distraction from your purpose. It is a part of it. Laughter heals. Connection nourishes. Breath by breath, you can release the weight you have been carrying and remember the simple pleasure of being alive. The Dolphin also speaks to the power of community. You are part of a pod. Reach out to those who share your values and your joy. Swim together. Breathe together. Support one another. Life is not meant to be navigated alone. The Dolphin calls you to connect, to play, and to remember that joy is your birthright.`,
  reversed: `The Dolphin reversed suggests isolation, joylessness, or a disconnection from your playful spirit. You may be taking life too seriously or withdrawing from the people who love you. The card asks you to find one small joy today. Laughter is medicine. Let yourself play.`,
});

register({
  title: "wisdom-of-the-oracle|The Owl",
  category: "Wisdom of the Oracle",
  keywords: ["wisdom", "seeing through illusion", "night vision", "silence", "truth"],
  symbolism: "A great horned owl perches on a gnarled branch under a full moon. Its golden eyes are wide and penetrating, seeing clearly through the darkness. Moths flutter around its perch, and the forest below is deep shadow.",
  upright: `The Owl is the keeper of wisdom that sees through darkness and illusion. The owl sees what others miss. Its vision is not fooled by surface appearances. This card appears when you are being asked to look deeper, to see the truth that hides beneath the obvious. What is being concealed? What are you refusing to see? The Owl gives you the gift of perception. Trust your instincts about people and situations. You know more than you think you know. The Owl also speaks of silent wisdom. You do not need to announce what you know. Sometimes the wisest course is to observe, to listen, and to wait. The Owl asks you to be comfortable with the dark. Not everything needs to be brought into the light immediately. Some truths reveal themselves in their own time. Be patient, be watchful, and trust your inner sight.`,
  reversed: `The Owl reversed suggests denial, refusing to see the truth, or being deceived by appearances. You may be ignoring what is obvious because the truth is uncomfortable. The card asks you to open your eyes. The owl's wisdom is available, but you must be willing to look. What are you afraid to see?`,
});

register({
  title: "wisdom-of-the-oracle|The Butterfly",
  category: "Wisdom of the Oracle",
  keywords: ["metamorphosis", "transformation", "emergence", "beauty", "freedom"],
  symbolism: "A butterfly emerges from a chrysalis hanging from a slender branch. Its wings are still damp but beginning to unfurl, revealing brilliant patterns of orange and black. The morning light illuminates the delicate structure of its wings.",
  upright: `The Butterfly is one of the most powerful symbols of transformation. It speaks of a metamorphosis that is underway or complete. You have been in the chrysalis, undergoing change that has felt dark and confining. Now you are ready to emerge. The Butterfly asks you to trust the process of becoming. You are not the same person you were. The old form had to dissolve for the new to take shape. This can be disorienting. You may feel tender, exposed, and not yet fully formed. That is okay. The Butterfly does not apologize for its beauty or its vulnerability. It simply unfolds its wings and takes flight. You are being called to do the same. Claim your transformation. Show the world who you have become. The struggle to break free of the chrysalis is what gives the butterfly the strength to fly. You have earned your wings. Use them.`,
  reversed: `The Butterfly reversed suggests a transformation that is stalled or resisted. You may be clinging to an old identity that no longer fits, afraid to let go of who you were. The chrysalis is not meant to be a permanent home. It is time to break free, even if the process feels uncomfortable. Growth requires release.`,
});

register({
  title: "wisdom-of-the-oracle|The Council",
  category: "Wisdom of the Oracle",
  keywords: ["wise counsel", "community guidance", "consultation", "collective wisdom", "council of elders"],
  symbolism: "A circle of elders sits around a fire in a circular stone chamber. Each holds a staff or symbol of their authority. The firelight casts dancing shadows on the walls. An empty seat waits for the seeker to join the circle.",
  upright: `The Council appears when you need to seek guidance from those who have walked the path before you. This may be a literal council of mentors, advisors, or trusted friends, or it may be the inner council of your own higher wisdom. The Council reminds you that you do not have to make decisions in isolation. There are those who can offer perspective, experience, and clarity. The card asks you to reach out. Consult someone whose judgment you trust. Gather input from multiple sources before making your choice. The Council does not decide for you. It offers its collective wisdom and then steps back, trusting you to integrate what you have received. You are the one who must ultimately decide, but you are surrounded by support. You have a tribe of wisdom keepers who want to see you thrive. Do not go it alone. The Council is convened and waiting for your question.`,
  reversed: `The Council reversed suggests a refusal to seek help, bad advice, or a council that is not aligned with your best interests. You may be isolating yourself when you need community most. The card asks you to examine the quality of the counsel you are receiving. Is it wise? Is it true? Seek better sources. Do not go it alone.`,
});

register({
  title: "wisdom-of-the-oracle|The Rose",
  category: "Wisdom of the Oracle",
  keywords: ["love", "beauty", "unfolding", "delicacy", "passion"],
  symbolism: "A single crimson rose in full bloom, its petals layered and velvety. Dewdrops cling to the petals. The stem has thorns, visible but not threatening. The background is soft and out of focus, drawing all attention to the flower.",
  upright: `The Rose represents the unfolding of love, beauty, and the tender aspects of the heart. The rose does not rush its blooming. Petal by petal, it opens to the sun. This card asks you to allow your heart to open in its own time. Love cannot be forced. Beauty cannot be hurried. The Rose reminds you that vulnerability is not weakness. The rose reveals its soft center, trusting the world with its beauty. But the rose also has thorns. You are allowed to have boundaries. You are allowed to protect your tender heart even as you open it. The Rose teaches the balance between openness and protection. Let yourself be seen. Let yourself be loved. Let your beauty unfold at its own pace. You are exquisite, just as you are, in every stage of your blooming.`,
  reversed: `The Rose reversed suggests a heart that has closed, a refusal to be vulnerable, or beauty that is being hidden. You may be protecting yourself from potential hurt by keeping your walls up. The card asks you to examine the cost of that protection. Is the safety worth the isolation? Consider letting one petal unfold.`,
});

register({
  title: "wisdom-of-the-oracle|The Dreamer",
  category: "Wisdom of the Oracle",
  keywords: ["imagination", "vision", "intuition", "inner world", "possibility"],
  symbolism: "A figure lies sleeping on a bed of moss beneath a canopy of stars. Their dream body rises above them, luminous and free, reaching toward a sky filled with swirling colors and symbols. The boundary between dream and waking is blurred.",
  upright: `The Dreamer speaks to the power of your imagination and the wisdom of your inner world. Your dreams, daydreams, and visions are not escapes from reality. They are gateways to deeper understanding. This card asks you to pay attention to what arises when you are in the liminal space between waking and sleeping. Your subconscious is communicating with you through symbols, feelings, and images. Keep a journal by your bed. Write down what comes to you in the night. The Dreamer also asks you to honor your capacity to envision a different future. The ability to imagine something new is the first step toward creating it. Do not dismiss your visions as unrealistic. The greatest realities began as dreams. Let yourself dream without limits. Your imagination is a sacred tool. Use it freely.`,
  reversed: `The Dreamer reversed suggests disconnection from your inner world, nightmares, or a fear of what your dreams reveal. You may be avoiding your subconscious because it holds something you are not ready to face. The card asks you to gently turn toward your inner world. The dreams are trying to help you. Listen.`,
});

register({
  title: "wisdom-of-the-oracle|The Wanderer",
  category: "Wisdom of the Oracle",
  keywords: ["exploration", "uncertainty", "adventure", "open road", "freedom"],
  symbolism: "A figure walks along a winding road through an open landscape. They carry a simple pack and a walking staff. Their posture is relaxed, their gaze curious. The road stretches ahead into unknown territory, and the sky is full of migrating birds.",
  upright: `The Wanderer steps onto the open road without a fixed destination. This card represents a time of exploration, uncertainty, and freedom. You may not know exactly where you are going, and that is exactly the point. The Wanderer asks you to embrace the unknown with curiosity rather than fear. Not every journey requires a detailed map. Some of the most important journeys are the ones you take without knowing the outcome. Trust your ability to navigate. Trust the road to provide what you need. The Wanderer is not lost. They are exactly where they need to be, moving forward with an open heart and an adventurous spirit. This is a time to explore new possibilities, to say yes to detours, and to trust that even the wrong turns lead to the right places. The road will show you the way. Keep walking.`,
  reversed: `The Wanderer reversed suggests restlessness, fear of the unknown, or a reluctance to leave familiar territory. You may want to explore but feel held back by fear or obligation. The card asks you to identify what is keeping you tethered. The road is still there. You can take it whenever you are ready.`,
});

register({
  title: "wisdom-of-the-oracle|The Safe Harbor",
  category: "Wisdom of the Oracle",
  keywords: ["safety", "refuge", "rest", "homecoming", "protection"],
  symbolism: "A small stone cottage sits at the edge of a calm harbor, warm light glowing from its windows. A sturdy dock extends into still water where a single sailboat is moored. The sunset casts golden light across the peaceful scene.",
  upright: `Safe Harbor appears when you have found or are being called to find a place of refuge and restoration. The storms of life have been real, and you have weathered them. Now it is time to come ashore. This card speaks of the deep need for safety, rest, and the comfort of a place where you can let down your guard. You have been strong for too long. The Safe Harbor invites you to rest. Let others care for you. Allow yourself to be held by the circumstances or the people that make you feel safe. This is not retreat. This is recuperation. The harbor does not keep the boat forever. It prepares it for the next journey. Take the time you need to repair, refuel, and remember who you are when you are not fighting the storm. The harbor is open. Come in. You are safe here.`,
  reversed: `Safe Harbor reversed suggests a refusal to rest, a lack of safety, or a harbor that has become a trap. You may be pushing yourself past your limits because you do not feel safe enough to stop. The card asks you to examine what would need to change for you to feel secure. Rest is not an option. It is a necessity. Find your harbor.`,
});

register({
  title: "wisdom-of-the-oracle|The Map",
  category: "Wisdom of the Oracle",
  keywords: ["planning", "clarity", "direction", "strategy", "overview"],
  symbolism: "A detailed old map spreads across a wooden table, marked with routes, compass roses, and annotations. A quill and ink pot sit nearby. The map shows both known lands and territories marked as uncharted. A hand traces a route with one finger.",
  upright: `The Map speaks to the value of planning and clear direction. You are being asked to look at the bigger picture of your life and chart a course. The Map does not show every detail of the journey, but it gives you enough to orient yourself and begin moving. This card asks you to get clear about your destination. What do you want? Where are you going? What steps are needed to get there? Take time to plan, to strategize, and to consider the terrain ahead. The Map also acknowledges the uncharted territories. Not everything can be planned. Some of the journey will require improvisation and trust. But having a general direction is better than wandering without aim. Draw your map. Mark your route. Then take the first step. You can always adjust the course once you are underway. The important thing is to begin with intention.`,
  reversed: `The Map reversed suggests a lack of direction, poor planning, or a refusal to look at the bigger picture. You may be moving forward without a clear sense of where you are going. The card asks you to pause and orient yourself before continuing. You do not need to have every detail mapped, but you need a general direction. Take out your map and look at it.`,
});

register({
  title: "wisdom-of-the-oracle|The Lantern",
  category: "Wisdom of the Oracle",
  keywords: ["guidance", "clarity in darkness", "illumination", "hope", "inner light"],
  symbolism: "A hand holds a lantern high in the darkness. The light pushes back the shadows, revealing a path forward. The lantern's glass panels show a flame burning steady and bright. Moths circle the light, drawn to its warmth.",
  upright: `The Lantern appears when you need light to find your way through a dark or uncertain time. The path ahead is not fully visible, but the lantern reveals enough for the next step. This card speaks to the guidance that is available to you even in your darkest moments. You are not alone. You are not lost. The light you carry within you is sufficient to illuminate the way forward. Trust the small steps that become visible. You do not need to see the entire path. You only need to see the next few feet. The Lantern asks you to hold your light high, not just for yourself but for others who may be walking in darkness beside you. Your courage inspires. Your faith lights the way. Keep walking. Keep holding the light. The darkness cannot extinguish what you carry within. Dawn is coming, but until it arrives, the lantern is enough.`,
  reversed: `The Lantern reversed suggests a loss of hope, a light that is dimming, or a refusal to look for guidance in the darkness. You may feel that the path is too dark to navigate. The card asks you to reach out for support. Even the smallest light can guide you. Do not give up. The dawn is closer than you think.`,
});

register({
  title: "wisdom-of-the-oracle|The Chariot of the Sun",
  category: "Wisdom of the Oracle",
  keywords: ["victory", "triumph", "will", "success", "radiant power"],
  symbolism: "A golden chariot pulled by four white horses races across the sky, carrying a radiant figure who holds the reins with confidence. The sun blazes behind them, casting rays of light across the clouds below.",
  upright: `The Chariot of the Sun is a card of radiant victory and the triumphant assertion of will. You have harnessed the forces of your life and are driving forward with purpose and confidence. The sun itself rides with you, blessing your endeavors with light and warmth. This card speaks to success that is not just achieved but celebrated. You have earned this moment. The Chariot of the Sun asks you to take your rightful place in the driver's seat of your life. Own your power. Claim your victory. Let the world see you shine. The four horses represent the four aspects of your being: physical, emotional, mental, and spiritual. All are aligned and pulling together. There is no force that can stop you now. Move forward with the full radiance of the sun at your back. This is your time. Triumph is yours.`,
  reversed: `The Chariot of the Sun reversed suggests a loss of momentum, defeated will, or success that feels hollow. You may be struggling to keep the horses aligned or driving in the wrong direction. The card asks you to check your alignment. Are you moving toward what truly matters to you? Realign and try again. The sun is still shining, even if clouds obscure it.`,
});

register({
  title: "wisdom-of-the-oracle|The Oasis",
  category: "Wisdom of the Oracle",
  keywords: ["refreshment", "relief", "sustenance", "restoration", "gratitude"],
  symbolism: "A cluster of palm trees surrounds a crystal-clear pool in the middle of a vast desert. Date fruits hang from the branches. A traveler kneels at the water's edge, cupping water in their hands, their face reflecting relief and gratitude.",
  upright: `The Oasis appears when you have been traveling through a dry period and have finally found relief. This card speaks of the refreshment that comes at exactly the right moment. The universe provides what you need when you need it. The Oasis asks you to stop and drink deeply. You have been pushing through hardship, scarcity, or emotional dryness. Now is the time to replenish. Accept the help that arrives. Savor the moments of peace and abundance. Gratitude is the proper response to an oasis. Do not take it for granted. This respite is a gift. It will prepare you for the next leg of your journey, but for now, simply rest and be restored. The water is cool. The shade is welcome. Your thirst is being quenched. Thank the universe for providing exactly what you needed. The timing was perfect. It always is.`,
  reversed: `The Oasis reversed suggests a mirage, false hope, or a refusal to accept the relief that is offered. You may be so accustomed to scarcity that you cannot trust abundance when it appears. The card asks you to check if what you see is real. If it is real, accept it. If it is a mirage, keep walking. Your real oasis is ahead.`,
});

register({
  title: "wisdom-of-the-oracle|The Weaver",
  category: "Wisdom of the Oracle",
  keywords: ["destiny", "interconnection", "creation", "fate", "divine design"],
  symbolism: "A woman sits at a great loom, her hands moving deftly between threads of many colors. The tapestry she weaves is vast, and its patterns are intricate. On one side of the loom, the threads appear chaotic. On the finished side, a beautiful design emerges.",
  upright: `The Weaver speaks to the interconnectedness of all things and the divine design that is being woven through your life. What looks like chaos on your side of the loom is becoming something beautiful on the other side. This card asks you to trust the larger pattern. You see only the threads, the loose ends, the colors that seem not to match. The Weaver sees the finished tapestry. Your job is not to control the design. Your job is to be a willing thread in the hands of the Weaver. Trust that everything you have experienced, every person you have met, every joy and every sorrow, is being woven into a pattern that is meaningful and whole. Nothing is wasted. In the fullness of time, you will see the beauty of the design. Until then, trust the Weaver. The pattern is unfolding exactly as it should.`,
  reversed: `The Weaver reversed suggests a feeling of chaos, a sense that the threads of your life are tangled and meaningless. You may be struggling to see the pattern or fighting against the design. The card asks you to stop pulling at the threads. Trust that the Weaver knows what they are doing. The pattern will emerge.`,
});

register({
  title: "wisdom-of-the-oracle|The Harvest",
  category: "Wisdom of the Oracle",
  keywords: ["abundance", "reaping", "results", "gratitude", "completion"],
  symbolism: "A field of golden wheat stretches under a warm autumn sun. A figure holds a sheaf of wheat, their face glowing with satisfaction. A basket overflows with apples, gourds, and vegetables. The season is full and generous.",
  upright: `The Harvest is the reward for the seeds you have planted and the work you have done. The fields are ripe. The bounty is ready. This card speaks of a time of reaping what you have sown. Your efforts are paying off, and abundance is flowing into your life. The Harvest asks you to receive with gratitude. You have earned this. Do not downplay your success or feel guilty for your abundance. You planted. You tended. You waited. Now you reap. Celebrate the harvest. Share it with others. Give thanks for the cycle of planting and reaping that sustains all life. The Harvest is not just about material abundance. It is also about the ripening of your skills, your relationships, and your spiritual understanding. You have grown. You have produced. You are fruitful. Enjoy the fruits of your labor. The harvest is plentiful, and you have earned every bit of it.`,
  reversed: `The Harvest reversed suggests a poor harvest, unfulfilled expectations, or a refusal to accept the results of your efforts. You may have planted in poor soil or reaped less than you hoped. The card asks you to learn from the season and prepare for the next. Not every harvest is abundant, but every harvest teaches.`,
});

register({
  title: "wisdom-of-the-oracle|The Stone",
  category: "Wisdom of the Oracle",
  keywords: ["stability", "foundation", "endurance", "strength", "permanence"],
  symbolism: "A massive granite stone rests in a clearing, moss growing along its base. It has been here for centuries, unmoved by wind or weather. A small sapling grows beside it, leaning slightly as if seeking the stone's protection.",
  upright: `The Stone represents the unshakable foundation upon which your life is built. Some things in your life are solid, enduring, and dependable. The Stone asks you to recognize these foundations and to ground yourself in what is stable. Your values, your true relationships, your core strengths. These are the things that weather every storm. The Stone also speaks of patience and endurance. Some processes take a long time, and that is okay. The Stone has been here for millennia and will be here for millennia more. There is no rush. You do not need to hurry. Stand firm in your truth. Let the winds of circumstance blow around you. You will not be moved. The Stone does not strive. It simply exists, steady and strong. Be like the stone. Root yourself in what is real and true. From that stability, everything else can grow.`,
  reversed: `The Stone reversed suggests instability, a weak foundation, or something you thought was solid crumbling beneath you. The card asks you to assess your foundations. What in your life is truly stable? What needs to be reinforced? Do not build on shaky ground. Strengthen your foundation before you build higher.`,
});

register({
  title: "wisdom-of-the-oracle|The Scroll",
  category: "Wisdom of the Oracle",
  keywords: ["knowledge", "wisdom recorded", "learning", "study", "revelation"],
  symbolism: "An ancient scroll unfurls across a stone lectern, covered in illuminated letters and intricate illustrations. The writing appears in multiple languages. A quill and ink wait beside it. Candelabras cast warm light on the text.",
  upright: `The Scroll represents recorded wisdom, knowledge that has been preserved for you to discover. This card speaks to the importance of study, learning, and accessing the accumulated wisdom of those who came before you. There is something you need to learn, and the resources are available. The Scroll asks you to open yourself to study. Read the book that has been calling to you. Take the course. Learn from the teachings of those who have walked the path. Knowledge is power, but only when it is applied. The Scroll also carries the energy of revelation. As you study, new understandings will unfold. Insights will come. The knowledge you gain now will be the foundation for wisdom you will need later. Trust the process of learning. Even if the material feels dense, the illumination will come. The Scroll is open before you. Read, learn, and grow.`,
  reversed: `The Scroll reversed suggests a refusal to learn, information that is being withheld, or knowledge that has been ignored. You may have access to wisdom but are not taking the time to study it. The card asks you to open the book. The answers are there. You just need to read them.`,
});

register({
  title: "wisdom-of-the-oracle|The Crown",
  category: "Wisdom of the Oracle",
  keywords: ["sovereignty", "self-rule", "authority", "dignity", "personal power"],
  symbolism: "A golden crown rests on a velvet cushion. It is elegant but not ostentatious. The crown appears to glow from within. The room around it is simple and unadorned, drawing all attention to the crown itself and what it represents.",
  upright: `The Crown speaks of your sovereignty and the authority you hold over your own life. No one else can rule your kingdom. You are the one who decides what enters your life, what you tolerate, and what you release. This card appears when you need to claim your personal authority. The Crown asks you to take responsibility for your life. Stop giving your power away to others. Stop waiting for permission. You are the ruler of your own domain, and it is time to govern with wisdom and confidence. The Crown is not about dominating others. It is about governing yourself with dignity and clarity. Set your own standards. Honor your own boundaries. Make decisions that align with your highest truth. You wear the crown. You hold the power. Rule your life with grace, wisdom, and the full authority of your sovereign self.`,
  reversed: `The Crown reversed suggests giving away your power, feeling powerless, or abdicating responsibility for your own life. You may be letting others make decisions for you or waiting for someone to rescue you. The card asks you to reclaim your authority. Pick up your crown and put it back on your head. Your kingdom needs you.`,
});

register({
  title: "wisdom-of-the-oracle|The Envoy",
  category: "Wisdom of the Oracle",
  keywords: ["ambassador", "diplomacy", "representation", "negotiation", "connection between worlds"],
  symbolism: "A figure dressed in formal robes stands between two groups, one hand extended toward each. Behind them, a bridge connects two distinct lands. Flags from both territories fly on either side. The figure's posture is diplomatic and calm.",
  upright: `The Envoy appears when you are being called to act as a bridge between different worlds, people, or perspectives. You have the ability to understand multiple viewpoints and to facilitate communication where it has broken down. This card speaks of diplomacy, mediation, and the sacred role of the peacemaker. The world needs more people who can stand in the middle and see both sides. The Envoy asks you to use your skills of communication and empathy to bring understanding where there is conflict. You have a unique capacity to translate between languages of the heart, the mind, and the spirit. Your role is not to take sides but to find common ground. Be the bridge. Be the messenger of understanding. The Envoy carries the energy of reconciliation. Where there has been division, you can bring unity. Speak the truth with compassion. Listen with an open heart. You are the connection that the world needs.`,
  reversed: `The Envoy reversed suggests failed communication, taking sides, or a refusal to mediate. You may be contributing to division rather than healing it. The card asks you to examine your role in the conflict. Are you part of the problem or part of the solution? Choose to be the bridge.`,
});

register({
  title: "wisdom-of-the-oracle|The Starfish",
  category: "Wisdom of the Oracle",
  keywords: ["regeneration", "healing", "renewal", "adaptation", "wonder"],
  symbolism: "A starfish clings to a tide pool rock, one of its arms regrowing after being lost. The water is clear and teeming with small sea creatures. Sunlight penetrates the pool, illuminating the starfish's brilliant orange color.",
  upright: `The Starfish carries the medicine of regeneration and healing. Just as the starfish can regrow a lost arm, you have the ability to heal and regenerate what has been damaged or lost in your life. This card speaks to the incredible resilience that lives within you. You can recover from loss. You can grow back what was taken. The Starfish asks you to trust your innate healing capacity. Your body, heart, and spirit know how to repair themselves. Give them the time and conditions they need. Healing takes time and patience. The new arm does not grow overnight. But cell by cell, the starfish rebuilds what was lost. You can too. Be patient with your healing. Trust the process. You are not broken beyond repair. You are regenerating. The wholeness you seek is already growing back. Trust the slow work of restoration.`,
  reversed: `The Starfish reversed suggests difficulty healing, wounds that are not mending, or a refusal to allow regeneration. You may be picking at the wound or preventing your own recovery. The card asks you to stop interfering with the healing process. Give yourself the rest and care you need. Regeneration takes time. Let it happen.`,
});

register({
  title: "wisdom-of-the-oracle|The Cavern",
  category: "Wisdom of the Oracle",
  keywords: ["inner depths", "the unconscious", "hidden treasure", "descent", "mystery"],
  symbolism: "The entrance to a dark cavern opens in the side of a rocky cliff. Water drips from the ceiling, and the sound echoes into deep, unknown chambers. A faint glimmer from within suggests something precious hidden in the darkness.",
  upright: `The Cavern invites you to descend into the depths of your own inner world. What lies beneath the surface of your conscious mind holds treasures that are waiting to be discovered. The Cavern asks you to be brave enough to explore your own darkness. Not everything in the depths will be comfortable. There are fears, forgotten memories, and shadow aspects of yourself that you have avoided. But there are also treasures. Strengths you did not know you had. Wisdom that has been waiting in the dark. The Cavern is not a place to stay. It is a place to explore, to retrieve what has been hidden, and to return to the surface with new understanding. The descent is voluntary. The rewards are profound. Take a torch. Go inward. The treasure is waiting for you in the depths. You will emerge richer than you entered.`,
  reversed: `The Cavern reversed suggests a fear of going inward, getting lost in the depths, or refusing to face what lies in your subconscious. You may be avoiding inner work because it feels too dark or overwhelming. The card asks you to take a torch and descend anyway. The treasure cannot be retrieved without the journey. Face your depths. The light you carry is sufficient.`,
});

register({
  title: "wisdom-of-the-oracle|The Eclipse",
  category: "Wisdom of the Oracle",
  keywords: ["obscuration", "revelation", "temporary darkness", "transformation", "cosmic timing"],
  symbolism: "The sun is partially obscured by the moon, creating a ring of fire in the darkening sky. Below, the landscape is cast in an eerie, golden twilight. Animals pause, confused by the sudden change in light. The atmosphere is charged and expectant.",
  upright: `The Eclipse speaks of moments when the light is temporarily obscured, revealing something that is usually invisible. This is a time of heightened cosmic energy, when the veils between worlds are thin and the ordinary rules seem suspended. The Eclipse asks you to pay attention. Something is being revealed that has been hidden. What you see during this time will not be visible once the light returns. The Eclipse is also a card of transformation. Just as the moon passes between the earth and the sun, something is passing between you and your usual way of seeing things. Trust that the darkness is temporary. The light will return. But in this moment of obscuration, you have the opportunity to see things differently. Embrace the shadow. It is showing you something important. When the light returns, you will be changed by what you have witnessed.`,
  reversed: `The Eclipse reversed suggests a refusal to see what is being revealed, or the end of a period of obscuration. The light is returning, and what was hidden is now becoming clear. You may have been avoiding a truth that is now unavoidable. The card asks you to accept what has been revealed. The eclipse is passing. Clarity is returning.`,
});

register({
  title: "wisdom-of-the-oracle|The Wind",
  category: "Wisdom of the Oracle",
  keywords: ["movement", "change", "the invisible", "spirit", "breath"],
  symbolism: "Leaves swirl through a forest path, caught in an invisible current. A woman stands with her arms slightly raised, her hair and clothes blown by a strong breeze. Her eyes are closed, and her face is lifted to feel the wind.",
  upright: `The Wind represents the invisible forces that move through your life. You cannot see the wind, but you can feel it and see its effects. This card speaks of change that comes through unseen influences: spirit, intuition, the movement of the divine in your life. The Wind asks you to pay attention to what you cannot see but can feel. That subtle nudge. That sudden inspiration. That change in atmosphere. The Wind is moving, and it is moving through you. The Wind does not ask permission. It comes and goes as it pleases. Your task is to be responsive. Drop your sails and let the wind carry you in a new direction. Do not resist the invisible forces that are guiding you. The Wind is the breath of spirit. It is clearing the stale air and bringing something new. Let it move through you. Let it change you. The Wind knows where it is going. Trust the invisible.`,
  reversed: `The Wind reversed suggests stagnation, resistance to change, or a refusal to feel the movement of spirit in your life. You may be stuck in stillness when change is calling. The card asks you to open your windows and let the fresh air in. Stale energy needs to be cleared. Invite the wind.`,
});

register({
  title: "wisdom-of-the-oracle|The Lion",
  category: "Wisdom of the Oracle",
  keywords: ["courage", "strength", "leadership", "majesty", "heart"],
  symbolism: "A lion stands on an outcropping of rock, surveying the savannah below. The sun sets behind it, painting the sky in shades of amber and gold. The lion's posture is relaxed but alert. It has nothing to prove and everything to protect.",
  upright: `The Lion speaks to the courage of the heart and the quiet strength of one who knows their own power. The lion does not need to roar to prove its authority. Its presence is enough. This card asks you to claim your own quiet strength. You are braver than you know. The Lion does not fight every battle. It chooses its battles wisely and fights with the full force of its being when the moment calls. You are being asked to stand in your power with dignity and calm. Leadership is not about domination. It is about presence. The Lion leads by example, by courage, and by the unwavering commitment to protect what matters. What matters to you? What are you willing to stand for? The Lion asks you to answer these questions and to act from that place of clear-hearted courage. You have the heart of a lion. Trust it. Roar when you must. But know that true strength is often silent.`,
  reversed: `The Lion reversed suggests cowardice, a loss of courage, or aggression that masks fear. You may be backing down from a challenge that requires your strength. The card asks you to find your backbone. You have more courage than you are currently using. Stand up. You are stronger than you think.`,
});

register({
  title: "wisdom-of-the-oracle|The Vessel",
  category: "Wisdom of the Oracle",
  keywords: ["receptivity", "holding space", "capacity", "sacred container", "emptiness"],
  symbolism: "A beautiful ceramic vessel sits on a wooden table. It is empty, waiting. The vessel is crafted with care, painted with intricate patterns. Its opening is wide enough to receive. The room around it is quiet and still.",
  upright: `The Vessel speaks of the sacred art of receptivity. You are being called to become empty so that you can be filled. The vessel must be hollow to serve its purpose. If it is already full, there is no room for what is coming. This card asks you to practice the discipline of openness. Stop filling every moment with activity, every space with noise, every need with a solution. Make yourself available to receive. The Vessel is a sacred container. It holds space for what is to come. You are being prepared to receive something that requires your emptiness. Trust that the waiting is not wasted. The Vessel is not useless when it is empty. It is ready. Be ready. Be empty. Be open. What is coming will fill you perfectly. Do not rush to fill yourself with distractions. Let yourself wait in sacred anticipation. The filling is coming. The vessel is prepared.`,
  reversed: `The Vessel reversed suggests being overfull, inability to receive, or refusing the sacred emptiness. You may be too full of old contents to accept new blessings. The card asks you to pour out what no longer serves you. Empty yourself so you can be refilled. The vessel must be empty to be useful.`,
});

register({
  title: "wisdom-of-the-oracle|The Journey",
  category: "Wisdom of the Oracle",
  keywords: ["pilgrimage", "purposeful travel", "transformation", "path", "quest"],
  symbolism: "A long road stretches across varied terrain, passing through forests, over mountains, and beside rivers. A traveler walks with purpose, their face set toward the horizon. The journey ahead is long, but each step brings them closer to their destination.",
  upright: `The Journey speaks of the purposeful path you are walking. This is not aimless wandering. You are on a quest, whether you fully realize it or not. Every experience, every meeting, every challenge is part of the journey that is shaping you. The Journey asks you to honor the process. You may wish to arrive at the destination now, but the journey itself is the teacher. Each leg of the path has something to offer. The mountains teach you endurance. The rivers teach you flow. The forests teach you mystery. The Journey also reminds you that you chose this path. You may not remember choosing it, but your soul did. Trust the path you are on. It is leading you exactly where you need to go. Keep walking. Keep growing. The destination will be there when you are ready. But do not rush past the lessons of the road. The journey is the point. The destination is just the excuse.`,
  reversed: `The Journey reversed suggests a feeling of being lost, a path that feels wrong, or a reluctance to continue the journey. You may be questioning whether you are on the right road. The card asks you to pause and take your bearings. You can change direction. You can choose a new path. But do not stop walking. Stagnation is the only true failure. Keep moving, even if you change direction.`,
});

register({
  title: "wisdom-of-the-oracle|The Oracle",
  category: "Wisdom of the Oracle",
  keywords: ["divine message", "prophecy", "inner truth", "revelation", "sacred knowing"],
  symbolism: "A figure sits in a cave illuminated by a single shaft of light from above. In their hands, they hold a crystal that glows with inner fire. Their eyes are closed, their face turned upward. Symbols float in the air around them, half-formed and luminous.",
  upright: `The Oracle speaks directly to the truth that is being revealed to you at this time. This card is a direct channel of divine guidance. The messages you are receiving now, through your intuition, your dreams, your synchronicities, are not coincidences. They are answers to the questions you have been asking. The Oracle asks you to trust what you know. Not what you have been told, not what you have read, but what you know in the deepest core of your being. That knowing is the Oracle speaking through you. You are the vessel of your own revelation. This is a time of profound inner clarity. The truth is available to you. Ask your question and listen. The answer is already forming in the space between your thoughts. Trust the voice of your own inner Oracle. The divine speaks through you. Listen to yourself.`,
  reversed: `The Oracle reversed suggests a block in your connection to inner truth, messages that have been ignored, or confusion about what is true. You may be listening to external voices instead of your own inner knowing. The card asks you to go within and reconnect. The Oracle is still speaking. You have stopped listening. Quiet your mind and hear the truth.`,
});

register({
  title: "wisdom-of-the-oracle|The Nest",
  category: "Wisdom of the Oracle",
  keywords: ["home", "family", "nurturing", "shelter", "new life"],
  symbolism: "A bird's nest sits in the crook of a tree branch, containing three pale blue eggs. The mother bird perches on a nearby branch, watching. The nest is woven from twigs, grass, and feathers. Morning light filters through the leaves.",
  upright: `The Nest speaks of home, family, and the nurturing of new life. This card appears when you are being called to tend to your home and your close relationships. The nest must be built with care, twig by twig, to hold what is precious. What are you nurturing? What needs the safety of your care? The Nest asks you to create a safe and loving environment for yourself and those you love. The nest is not a prison. It is a foundation. From the safety of the nest, the young eventually fly. Your role is to provide the safety that allows growth. Nurture without smothering. Protect without confining. The Nest also speaks of the new life that is coming. The eggs are not yet hatched, but the potential is alive and warm. Something is growing in the safety of your care. Trust the process. The hatching will come. Until then, keep the nest warm and the vigil patient.`,
  reversed: `The Nest reversed suggests a home that feels unsafe, family conflict, or a refusal to nurture what is growing. The nest may be empty or broken. The card asks you to examine your home life and your relationships. What needs repair? What needs attention? You cannot build a nest on shaky ground. Secure the foundation.`,
});

register({
  title: "wisdom-of-the-oracle|The Bridge of Stars",
  category: "Wisdom of the Oracle",
  keywords: ["divine connection", "cosmic guidance", "dreams", "mystical union", "the beyond"],
  symbolism: "A bridge made of stars spans across a night sky, connecting two mountain peaks. The Milky Way forms the arch. A figure walks across the bridge, their form translucent, moving between worlds. Below, the earth sleeps in darkness.",
  upright: `The Bridge of Stars speaks of the connection between the earthly and the divine, the seen and the unseen. You are being given access to realms beyond the ordinary. The stars themselves form a path for you to walk. This card asks you to expand your awareness beyond the material world. There is more to your existence than what you can see and touch. You are a spiritual being having a human experience, and the Bridge of Stars invites you to remember your cosmic nature. The card is a reminder that you are never alone and that divine guidance is always available. Your dreams carry messages. Your intuition is a direct line to the cosmos. Walk the Bridge of Stars in your dreams, in your meditations, and in your deepest knowing. The universe is vast and you are part of it. You belong to the stars as much as you belong to the earth. Remember who you are. A child of the cosmos. A walker between worlds.`,
  reversed: `The Bridge of Stars reversed suggests a disconnection from the divine, a feeling of cosmic loneliness, or a refusal to acknowledge the spiritual dimension of life. You may be stuck in material concerns and forgetting your spiritual nature. The card asks you to look up at the stars and remember. The connection is still there. You have only forgotten it. Look up. The bridge awaits.`,
});

register({
  title: "wisdom-of-the-oracle|The Phoenix",
  category: "Wisdom of the Oracle",
  keywords: ["rebirth", "resurrection", "transformation through fire", "rising again", "immortality"],
  symbolism: "A magnificent phoenix rises from a bed of glowing embers and flames. Its feathers blaze with gold, crimson, and orange. Its wings are spread wide, catching the updraft. The sky above is streaked with the colors of dawn.",
  upright: `The Phoenix speaks of the most profound transformation: death and rebirth through the fires of experience. You have been through a destruction that felt total. The old life, the old self, the old way of being has been reduced to ash. But from those ashes, something new is rising. The Phoenix asks you to trust the rebirth. You cannot rise from the ashes until you have been fully burned. The fire was necessary. It consumed what needed to die. Now, from the very substance of your endings, new life is emerging. You are not the same being who went into the flames. You have been transformed. The Phoenix does not look back at the ashes. It spreads its wings and takes flight. Do not mourn what was burned. It had to go. What is rising now is more magnificent than what was lost. You are reborn. Rise. Fly. Your new life begins now.`,
  reversed: `The Phoenix reversed suggests a refusal to rise from the ashes, lingering in the remains of what has burned, or fear of the rebirth that is calling you. You may be clinging to the ashes of a life that is over. The card asks you to stop looking back. The fire is out. The ashes are cold. It is time to rise. You have everything you need to begin again.`,
});

register({
  title: "wisdom-of-the-oracle|The Lake",
  category: "Wisdom of the Oracle",
  keywords: ["stillness", "reflection", "depth", "calm", "mirror"],
  symbolism: "A mountain lake lies perfectly still, reflecting the surrounding peaks and the sky above. The water is so clear that the bottom is visible, with smooth stones and fallen leaves resting on the sandy floor. The scene radiates peace and stillness.",
  upright: `The Lake speaks of the profound wisdom found in stillness. When the waters of your mind are calm, you can see clearly to the depths. The Lake reflects not only the world around it but also reveals what lies beneath its surface. This card asks you to find stillness. Stop churning the waters with constant activity, worry, and noise. Sit at the edge of your own inner lake and simply be. In the stillness, clarity will come. The answers you seek are not found in more thinking. They are found in the quiet space between thoughts. The Lake does not strive. It simply reflects. Become like the lake. Let the world move around you while you remain centered and calm. When the surface is still, you can see to the bottom. You can see the truth. Seek stillness. The Lake knows. Be still and know.`,
  reversed: `The Lake reversed suggests emotional turbulence, muddy thinking, or a refusal to be still. Your inner waters are churned up, and you cannot see clearly. The card asks you to stop stirring the sediment. Let the waters settle. Sit in stillness until the clarity returns. You cannot see the bottom when the water is disturbed. Be still and wait.`,
});

register({
  title: "wisdom-of-the-oracle|The Messenger",
  category: "Wisdom of the Oracle",
  keywords: ["announcement", "communication", "tidings", "news", "swift delivery"],
  symbolism: "A figure runs across a hilltop at dawn, a scroll held high in one hand. Their legs are swift, their expression urgent but joyful. Behind them, the sun crests the horizon, and birds scatter into the new day.",
  upright: `The Messenger arrives with news that requires your attention. This card often signals that communication is imminent, whether through a letter, a call, an email, or a face-to-face conversation. The news may be expected or unexpected, but it will carry significance. The Messenger asks you to be open to receiving what is being delivered. Do not shoot the messenger if the news is not what you hoped for. The message is not the source of the truth. It is the carrier. Pay attention to the timing of the arrival. The Messenger does not arrive by accident. There is meaning in when and how the news reaches you. If you have been waiting for an answer, it is coming. If you have been avoiding a conversation, it is time. The Messenger brings what must be heard. Receive it with grace, respond with integrity, and trust that the communication serves your highest good.`,
  reversed: `The Messenger reversed suggests missed communications, delays in delivery, or messages that are not being received. You may be ignoring signs, avoiding a conversation, or refusing to hear what is being said. The card asks you to check your inbox, literally and metaphorically. What have you been avoiding? The message will keep arriving until you receive it.`,
});

register({
  title: "wisdom-of-the-oracle|The Sanctuary",
  category: "Wisdom of the Oracle",
  keywords: ["sacred space", "protection", "peace", "refuge", "spiritual retreat"],
  symbolism: "A walled garden surrounds an ancient stone chapel. Ivy covers the walls. Inside, candles flicker on an altar, and the air is thick with the scent of incense and flowers. The space feels protected, separate from the world outside.",
  upright: `The Sanctuary appears when you need to withdraw into sacred space. The world has been too loud, too demanding, too chaotic. The Sanctuary offers you a place of peace and protection where you can reconnect with what is holy. This card asks you to create or enter a space that feels safe and consecrated. This may be a physical space, like a room in your home, a place in nature, or a place of worship. It may also be an inner sanctuary, a mental and emotional space you can enter through meditation or prayer. The Sanctuary is where you go to remember who you are beyond your roles and responsibilities. Go there. Spend time in the sacred quiet. Let the peace restore you. The world will still be there when you return, but you will return stronger, clearer, and more centered. The Sanctuary is your refuge. Honor it. Use it. It exists for your renewal.`,
  reversed: `The Sanctuary reversed suggests a sacred space that has been violated, a loss of peace, or a refusal to create the safe space you need. You may be too exposed, too available, too permeable to the world's chaos. The card asks you to fortify your boundaries and reclaim your sanctuary. Your peace is worth protecting.`,
});

register({
  title: "wisdom-of-the-oracle|The Mask",
  category: "Wisdom of the Oracle",
  keywords: ["persona", "illusion", "hidden self", "roles", "authenticity"],
  symbolism: "An elaborate mask lies on a velvet surface. The mask is beautiful, adorned with gold leaf and feathers. Beside it, a hand reaches toward it as if to pick it up, but hesitates. A mirror reflects the empty space where the face behind the mask would be.",
  upright: `The Mask speaks to the roles you play and the faces you show the world. Everyone wears masks. It is part of social life. But the Mask appears when it is time to examine the difference between who you pretend to be and who you truly are. The Mask asks you to consider: Are you hiding behind a persona? Are you afraid to show your true face? The mask may be comfortable, but it is also limiting. Authenticity requires vulnerability. The Mask invites you to take off what you have been hiding behind and let yourself be seen as you truly are. The world does not need your performance. It needs your presence. You are enough without the mask. Let it fall. The face beneath is beautiful, not despite its imperfections, but because of them. True connection happens when masks are removed. Are you brave enough to be seen?`,
  reversed: `The Mask reversed suggests the mask coming off, either by choice or by force. Pretenses are dropping, and the truth of who you are is being revealed. This may feel exposing, but it is ultimately liberating. The card asks you to embrace the vulnerability of authenticity. You do not need to hide. Your true face is enough.`,
});

register({
  title: "wisdom-of-the-oracle|The Arrow",
  category: "Wisdom of the Oracle",
  keywords: ["purpose", "direction", "focus", "precision", "swift movement"],
  symbolism: "An arrow is nocked on a drawn bowstring, aimed at a target in the distance. The archer's eye is focused, their breath steady. The sky behind them is streaked with the light of a new dawn. The arrow is ready to fly.",
  upright: `The Arrow represents focused intention and the power of directed purpose. The arrow does not waver. It flies straight toward its target. This card appears when you need to concentrate your energy and aim with precision. You have been scattered, pulled in many directions. The Arrow asks you to choose one target and commit to it. Focus is power. When you aim your intention with clarity, you cannot miss. The Arrow also speaks of swift movement. Once released, the arrow does not hesitate. It does not second-guess. It flies. When the time comes to act, act without reservation. Trust your aim. Trust the direction you have chosen. You have prepared. You are ready. Release the arrow. Let it fly toward the target you have chosen. With focus and intention, you will hit the mark.`,
  reversed: `The Arrow reversed suggests lack of focus, scattered energy, or aimlessness. You may be shooting in too many directions and hitting nothing. The card asks you to choose one target and concentrate your efforts. A scattered archer hits nothing. Pull your energy back into focus. Take aim. Then release.`,
});

register({
  title: "wisdom-of-the-oracle|The Talisman",
  category: "Wisdom of the Oracle",
  keywords: ["protection", "luck", "symbolic power", "charm", "sacred object"],
  symbolism: "An ancient talisman hangs from a leather cord. The talisman is made of carved stone, etched with symbols of protection and blessing. It glows with a faint inner light. The hands that hold it are weathered and old, suggesting generations of use.",
  upright: `The Talisman speaks of protection, luck, and the power imbued in symbolic objects. You are being protected by forces beyond your understanding. The Talisman is a reminder that you carry blessings with you, whether you are aware of them or not. This card asks you to recognize the sacred objects and symbols that hold meaning in your life. A piece of jewelry, a stone, a photograph, a written blessing. These objects are not magical in themselves, but they carry the power of your intention and the love of those who have blessed them. The Talisman also represents your own inner power to protect yourself. You have everything you need to keep yourself safe. Trust your instincts. Trust the symbols that speak to your heart. Carry your talisman with you, physically or in your mind. You are blessed. You are protected. You are never without the power of the sacred.`,
  reversed: `The Talisman reversed suggests a loss of protection, a talisman that has lost its power, or a reliance on external objects rather than inner strength. You may feel unprotected or vulnerable. The card asks you to reconnect with your own inner power. No object can replace the protection of your own awareness and boundaries. Reclaim your power.`,
});

register({
  title: "wisdom-of-the-oracle|The Gathering",
  category: "Wisdom of the Oracle",
  keywords: ["community", "celebration", "togetherness", "shared purpose", "festival"],
  symbolism: "A circle of people stands around a bonfire under a starry sky. Their faces are lit by the firelight. Some hold hands, some raise cups, some dance. The atmosphere is one of joy, belonging, and shared celebration.",
  upright: `The Gathering speaks of community, celebration, and the power of coming together with others. You are not meant to walk this path alone. This card appears when it is time to connect with your people, to celebrate shared joys, and to draw strength from community. The Gathering asks you to reach out. Attend the event. Join the group. Answer the invitation. Something important happens when people gather with intention. The fire is brighter when many logs burn together. Your joy multiplies when it is shared. The Gathering is a reminder that you belong. You have a place in the circle. Your presence is needed. Others are waiting for you to join them. Do not isolate yourself out of shyness, pride, or fear. The circle is open. Your seat is waiting. Come to the fire. Share your story. Add your log to the flame. The Gathering needs you as much as you need it.`,
  reversed: `The Gathering reversed suggests isolation, disconnection from community, or a celebration that has lost its joy. You may be withdrawing from your people when you need them most. The card asks you to examine why you are staying away. The circle is still there. Your place is still warm. Come back to the gathering. You do not have to be alone.`,
});

register({
  title: "wisdom-of-the-oracle|The Ice",
  category: "Wisdom of the Oracle",
  keywords: ["coldness", "stagnation", "preservation", "frozen emotion", "waiting"],
  symbolism: "A landscape of ice and snow stretches to the horizon. A single figure stands on the frozen surface of a lake, looking down at something trapped beneath the ice. The air is still and silent. The cold is beautiful but unforgiving.",
  upright: `The Ice speaks of emotions that have been frozen, situations that have become stagnant, or a period of cold preservation. Something in your life has been put on hold, frozen in place. The Ice asks you to examine what has become stuck. Are you avoiding feeling something because it is too painful? Have you frozen a situation because you do not know how to move forward? The Ice preserves. It keeps things in suspended animation. But nothing can grow in the ice. The Ice asks you to consider: what needs to thaw? What has been waiting too long in the cold? The thaw will come. Spring always follows winter. But you may need to be the warmth that begins the melting. It is safe to feel again. The Ice has served its purpose. Now let it melt. Let the waters flow. Let the frozen parts of your life begin to move again.`,
  reversed: `The Ice reversed suggests the beginning of a thaw, emotions that are starting to flow, or a situation that is finally becoming unstuck. The cold is passing. The card asks you to be patient with the melting process. Do not force the thaw. Let it happen naturally. The waters will flow again. Allow feeling to return at its own pace.`,
});

register({
  title: "wisdom-of-the-oracle|The Lightning",
  category: "Wisdom of the Oracle",
  keywords: ["sudden insight", "illumination", "shock", "awakening", "strike of truth"],
  symbolism: "A bolt of lightning splits the sky, illuminating a dark landscape in stark relief. The flash reveals a pathway that was hidden. Thunder rolls in the distance. The air is charged with electricity and the smell of ozone.",
  upright: `The Lightning represents sudden, illuminating insight that comes like a strike from the blue. You have been in the dark about something, and now, in a flash, you see the truth. The Lightning does not ask permission. It strikes when it strikes. This card speaks of moments of profound awakening that can feel shocking but are ultimately liberating. The Lightning asks you to pay attention to the flashes of insight that are coming to you. That sudden idea that seems to come from nowhere. That moment of clarity that changes everything. The Lightning does not linger. It strikes and is gone. But the illumination it provides lasts. When clarity strikes, act on it. Do not wait. The moment of insight is a gift. Use it while the light is bright. The truth has been revealed. What you do with it now is up to you. The Lightning clears the air. It wakes you up. Stay awake.`,
  reversed: `The Lightning reversed suggests a refusal to see the truth, a shock that you are not ready to process, or insights that are being blocked. You may be afraid of what the lightning will reveal. The card asks you to prepare yourself for the truth. The strike will come whether you are ready or not. Open your eyes. The flash will show you what you need to see.`,
});

register({
  title: "wisdom-of-the-oracle|The Chalice",
  category: "Wisdom of the Oracle",
  keywords: ["receptivity", "emotion", "intuition", "feminine wisdom", "sacred vessel"],
  symbolism: "A golden chalice set with gemstones stands on an altar. Light catches the facets of the stones, casting rainbows across the cloth beneath. The chalice is empty, waiting to be filled. Its form is elegant and balanced.",
  upright: `The Chalice speaks of emotional and spiritual receptivity. It is the sacred vessel that holds the waters of life, of intuition, of divine love. The Chalice appears when you are being asked to open yourself to receive on the deepest levels. This card asks you to become receptive. Not passive, but open. The Chalice does not seek. It waits. It trusts that what is meant for it will be poured into it. You have been striving, reaching, grasping. The Chalice asks you to stop and simply receive. Love, wisdom, grace, guidance. These cannot be taken by force. They must be received. Open your heart like a chalice. Let the divine fill you. You do not need to earn what is given freely. Your worthiness is not in question. You are a sacred vessel. Let yourself be filled. Let the waters of life flow into you and through you. You are made to receive as well as to give. Both are sacred.`,
  reversed: `The Chalice reversed suggests a refusal to receive, emotional blockage, or a sacred vessel that has been damaged. You may be too full of old pain to accept new blessings. The card asks you to empty the old contents so that you can be filled anew. The chalice must be empty to receive. Let go of what has been. Make space for what is coming.`,
});

register({
  title: "wisdom-of-the-oracle|The Torch",
  category: "Wisdom of the Oracle",
  keywords: ["inspiration", "passion", "illumination", "transmission", "lighting the way"],
  symbolism: "A runner carries a blazing torch through a night landscape. The flame streams behind them as they run. Others wait ahead, their own torches unlit, ready to receive the flame. The relay continues across the dark terrain.",
  upright: `The Torch represents the fire of inspiration that must be passed from one person to another. You have been given a gift of passion, knowledge, or creative fire. The Torch asks you not to keep it for yourself. Pass it on. The Torch also speaks of the inspiration that is lighting your path right now. You are in a period of creative fire and passionate purpose. The flame inside you is bright. Use it to illuminate your work, your relationships, and your spiritual practice. But remember that the torch is meant to be shared. When you light another's torch, your flame does not diminish. It multiplies. Teach what you know. Share what inspires you. Light the way for others. The Torch is a reminder that your passion has purpose beyond your own fulfillment. You carry the flame for the benefit of all. Pass it on. Light up the darkness. The world needs your fire.`,
  reversed: `The Torch reversed suggests a loss of inspiration, a flame that has gone out, or a refusal to share your gifts with others. You may be hoarding your passion out of fear that it will run out. The card asks you to tend your inner fire. Find what reignites your passion. And then share it. A torch kept in a closet gives no light. Let your flame burn bright and share it freely.`,
});

register({
  title: "wisdom-of-the-oracle|The Anchor",
  category: "Wisdom of the Oracle",
  keywords: ["stability", "grounding", "security", "steadiness", "holding fast"],
  symbolism: "A heavy iron anchor rests on a sandy seabed, chain taut, holding a ship steady above. The water above is clear and blue. Seaweed sways around the anchor. Fish dart among the links. The anchor does its work unseen.",
  upright: `The Anchor represents the deep stability and grounding that holds you steady when the waters of life grow rough. You may not see the anchor, but it is there, holding you in place. This card speaks of the foundations of your life that keep you secure. The Anchor asks you to check your moorings. What is holding you steady? Your values, your commitments, your spiritual practice, your true relationships. These are the anchors that keep you from drifting. The Anchor also speaks of patience. The anchor does not fight the storm. It simply holds. When you are anchored, you can weather any storm. You may sway, but you will not be swept away. Trust what holds you. Strengthen your anchors. And when the seas are calm again, you will know that your stability was never in question. The Anchor does its work beneath the surface. Your true strength is in what is unseen but unshakable.`,
  reversed: `The Anchor reversed suggests instability, drifting, or a loss of grounding. You may feel untethered, floating without direction. The card asks you to find your anchor again. What has held you steady in the past? Return to that. Re-establish your foundations before the winds pick up.`,
});

})();

/* ══════════════════════════════════════════════════
   WORK YOUR LIGHT ORACLE (Rebecca Campbell, 44 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "work-your-light|Calling in Your Soul Tribe",
  category: "Work Your Light Oracle",
  keywords: ["soul family", "belonging", "connection", "community", "like-minded"],
  symbolism: "A circle of figures stands together on a hilltop at twilight, each holding a small light. Their lights merge into a single glow above them. The stars above mirror the pattern of lights below, suggesting a cosmic connection between souls.",
  upright: `You are being called to connect with those who share your soul's purpose. The people you are meant to work with, love, and grow alongside are gathering. This card speaks of the deep belonging that comes when you find your soul tribe. You do not have to do this work alone. There are others who see the world as you do, who carry similar dreams, who are waiting for someone exactly like you to show up. The soul tribe does not always look like you expected. They may come from different backgrounds, but your spirits recognize each other. Trust the connections that feel like coming home. Reach out. Join the circle. Your people are waiting. The tribe is calling. Answer the call and take your place in the circle. Your light is needed here.`,
  reversed: `Calling in Your Soul Tribe reversed suggests isolation or difficulty finding your people. You may be withdrawing from connection or the right community has not yet appeared. The card asks you to keep putting yourself out there. Your tribe exists. Trust that you will find each other in divine timing.`,
});

register({
  title: "work-your-light|Trusting the Timing",
  category: "Work Your Light Oracle",
  keywords: ["patience", "divine timing", "surrender", "trust", "waiting"],
  symbolism: "A figure sits beneath a large tree with roots that extend deep into the earth and branches that reach high into the sky. A clock face is embedded in the trunk, but its hands are softly blurred. Leaves fall gently around the seated figure.",
  upright: `This card asks you to trust that everything is unfolding in the right time. The universe operates on a schedule that your human mind cannot always comprehend. You may feel ready, you may feel impatient, but some things cannot be rushed. Trusting the timing means surrendering your need to control when things happen. The seed does not demand to sprout before its time. It rests in the darkness, gathering strength, until the conditions are right. You are being prepared for what is coming. The delay is not a denial. It is a protection. When the timing is right, everything will fall into place with an ease that confirms you were never forgotten. Trust the timing of your life. It is impeccable.`,
  reversed: `Trusting the Timing reversed suggests impatience, frustration with delays, or a feeling that your life is not moving fast enough. You may be trying to force something before it is ready. The card asks you to breathe and surrender the timeline. Rushing will not help. Trust the process.`,
});

register({
  title: "work-your-light|Tending the Flame",
  category: "Work Your Light Oracle",
  keywords: ["devotion", "practice", "consistency", "inner fire", "dedication"],
  symbolism: "A woman kneels before a simple hearth, adding a small log to a fire. The flames respond, growing brighter. Her face is lit by the warm glow. The room is otherwise dark, emphasizing the importance of tending this one flame.",
  upright: `This card speaks to the importance of tending your inner fire with regular devotion. The flame of your purpose, your creativity, your spiritual connection requires consistent care. It will not burn brightly if you neglect it. Tending the Flame asks you to show up for your practice, whatever that looks like for you. Daily meditation, creative work, prayer, movement, time in nature. The small, consistent acts of devotion are what keep the flame alive. You do not need grand gestures. You need steady attention. The flame responds to your presence. When you tend it daily, it grows stronger and lights your way more clearly. Do not wait for inspiration to strike. Light the match yourself. Tending the flame is your responsibility. No one else can do it for you.`,
  reversed: `Tending the Flame reversed suggests neglect of your inner fire. You have let the flame burn low or go out entirely. The card asks you to return to the hearth. It is not too late. Add a log to the fire. Your flame can be reignited. Start with one small act of devotion today.`,
});

register({
  title: "work-your-light|Releasing the Need to Know",
  category: "Work Your Light Oracle",
  keywords: ["surrender", "uncertainty", "faith", "letting go of control", "mystery"],
  symbolism: "A figure stands at the edge of a misty forest, one hand releasing a handful of feathers into the wind. The path ahead is shrouded in fog. The figure's posture is one of acceptance, neither stepping forward nor backward, simply releasing.",
  upright: `You do not need to know how everything will unfold. The need to know is a form of control that keeps you tethered to anxiety. This card asks you to release your grip on certainty and make peace with the unknown. Not knowing is a sacred space. It is where faith grows. When you release the need to know, you open yourself to wonder, surprise, and guidance that you could not have anticipated. The universe often works better without your interference. The need to know is fear dressed up as practicality. Beneath it is the belief that you must be in control to be safe. This card invites you to practice radical trust. You do not need to see the whole staircase. You only need to take the next step. Let the mist be. It will clear when you are ready to see.`,
  reversed: `Releasing the Need to Know reversed indicates clinging to certainty, anxiety about the unknown, or a refusal to surrender control. You may be over-researching, over-planning, or over-thinking to avoid the discomfort of not knowing. The card asks you to breathe and let go. You do not need to have all the answers. Trust that clarity will come when it is time.`,
});

register({
  title: "work-your-light|The Light of Your Soul",
  category: "Work Your Light Oracle",
  keywords: ["true self", "essence", "authenticity", "inner radiance", "purpose"],
  symbolism: "A figure stands with arms outstretched, light emanating from their chest in a brilliant beam that illuminates everything around them. The light does not come from above or outside. It comes from within, from the very core of their being.",
  upright: `This card reminds you that you are here to shine your unique light in the world. Your soul came into this life with a specific radiance that only you can offer. The Light of Your Soul is not something you need to create. It is something you need to uncover and allow. The world needs your particular brightness. Not a copy of someone else's light, not what you think you should be, but the authentic expression of who you truly are. The light of your soul knows the way. It has always known. Your task is to stop dimming yourself to fit in, to stop hiding your brilliance so others feel comfortable. Let your light shine fully. It will attract what is meant for you and illuminate the path for others. You are here to shine. Do not hold back.`,
  reversed: `The Light of Your Soul reversed suggests hiding your true self, dimming your light to fit in, or forgetting your authentic nature. You may be playing small or pretending to be less than you are. The card asks you to stop hiding. The world needs your light. Let it shine. Do not apologize for your brightness.`,
});

register({
  title: "work-your-light|You Are Ready",
  category: "Work Your Light Oracle",
  keywords: ["preparedness", "confidence", "readiness", "calling", "now"],
  symbolism: "A figure stands at the edge of a diving board, poised and calm. The water below is deep and inviting. The figure's stance is confident, not hesitant. The sky behind them is clear, and the moment feels charged with anticipation.",
  upright: `You have been preparing for this moment, and you are ready. Doubt may whisper that you need more time, more skills, more certainty, but this card tells you that the time is now. You are not meant to wait any longer. You are Ready is a confirmation from the universe that everything you have learned, every experience that has shaped you, has led to this moment. Trust yourself. You have what it takes. The readiness you feel is real. It is not arrogance. It is the quiet confidence of knowing you have done the work. Step forward. Say yes. Take the leap. The water is deep enough to hold you. You will not fall. You will fly. The moment you have been waiting for is here. You are ready. Go.`,
  reversed: `You Are Ready reversed suggests self-doubt, imposter syndrome, or a belief that you are not prepared enough. You may be waiting for a sign or for perfect conditions. The card asks you to recognize that you will never feel 100% ready. The readiness comes from taking the step despite the fear. Trust yourself. You are more prepared than you think.`,
});

register({
  title: "work-your-light|Honoring Your Boundaries",
  category: "Work Your Light Oracle",
  keywords: ["limits", "protection", "self-respect", "saying no", "personal space"],
  symbolism: "A woman stands within a circle of stones, one hand raised in a gentle but firm stopping gesture. The stones mark the boundary of her sacred space. Outside the circle, the world continues, but within it, she is safe and sovereign.",
  upright: `This card asks you to honor your boundaries with love and clarity. Boundaries are not walls to keep others out. They are the gates that protect what is sacred to you. Without them, your light cannot shine clearly because it leaks away in every direction. Honoring your boundaries means knowing what is yours to carry and what is not. It means saying no when your spirit needs rest. It means protecting your time, your energy, and your emotional well-being. The world may not always respect your boundaries, but you must. When you honor your own limits, you teach others how to treat you. You also create the container within which your gifts can develop fully. Boundaries are not selfish. They are sacred. Honor them.`,
  reversed: `Honoring Your Boundaries reversed suggests weak boundaries, people-pleasing, or a refusal to protect your own space. You may be giving too much of yourself away or allowing others to overstep. The card asks you to reclaim your boundaries. It is safe to say no. Your worth is not determined by how much you give. Protect your sacred space.`,
});

register({
  title: "work-your-light|The Path of Service",
  category: "Work Your Light Oracle",
  keywords: ["giving", "purpose", "contribution", "helping others", "vocation"],
  symbolism: "A figure kneels by a small spring, cupping water in their hands to offer to a traveler who has collapsed from exhaustion. The giver's face shows compassion, not pity. The act of service is simple, direct, and deeply human.",
  upright: `You are being called to serve in a way that aligns with your soul's purpose. The Path of Service is not about martyrdom or losing yourself in the needs of others. It is about offering your unique gifts in a way that helps the whole. True service flows naturally from who you are. It does not drain you. It fulfills you. When you serve from your authentic self, you do not need to force or strive. The right opportunities appear. The people you are meant to help cross your path. The Path of Service asks you to listen for the call. What is yours to give? What does the world need that you can provide? Your purpose is not separate from service. It is service itself. Find the intersection between your joy and the world's need, and give yourself to it freely.`,
  reversed: `The Path of Service reversed suggests burnout from giving, service that is not aligned, or a refusal to offer your gifts. You may be helping from obligation rather than love, or your giving may be depleting you. The card asks you to check your motivation. True service is joyful. If it is not, something is out of alignment. Adjust.`,
});

register({
  title: "work-your-light|The Womb of Creation",
  category: "Work Your Light Oracle",
  keywords: ["birthing", "creation", "gestation", "potential", "new life"],
  symbolism: "A woman sits in a dark, warm space, hands resting on her belly. Around her, the darkness is not empty but full of stars and swirling nebulae, suggesting that she carries a universe within her. The sense of anticipation is palpable.",
  upright: `This card speaks of the creative gestation that is happening within you. Something new is being formed in the darkness of your inner world. You may not see it yet, but it is growing. The Womb of Creation asks you to trust the process of becoming. Creation requires darkness. The seed grows in the soil before it breaks the surface. The baby gestates in the womb before it enters the world. Your creation, whether it is a project, a relationship, or a new phase of life, needs time to form in the unseen. Do not rush the birth. Do not pull the seedling from the soil to check its roots. Trust the darkness. Nourish yourself. Rest when you need to. What is growing within you is alive and will emerge in its own time. The birthing will come when the creation is ready.`,
  reversed: `The Womb of Creation reversed suggests creative blocks, fear of birthing something new, or impatience with the creative process. You may be trying to force a birth before the creation is ready. The card asks you to be patient. The darkness is not empty. It is full of potential. Trust the gestation. The birth will happen in its own time.`,
});

register({
  title: "work-your-light|Dancing with the Moon",
  category: "Work Your Light Oracle",
  keywords: ["cycles", "intuition", "feminine wisdom", "flow", "night"],
  symbolism: "A woman dances alone in a moonlit clearing, her movements fluid and unselfconscious. The moon is full and bright overhead. Her shadow stretches across the grass, and her body moves in rhythms that feel both ancient and instinctive.",
  upright: `This card invites you to sync your life with the cycles of the moon and the natural world. Not every phase is for action. Some phases are for rest, reflection, and turning inward. Dancing with the Moon asks you to honor your own internal rhythms rather than pushing against them. The moon waxes and wanes, and so do you. There is a time for growth and a time for release. A time for social connection and a time for solitude. When you dance with the moon, you stop fighting the natural tides of your being. You allow yourself to be guided by a wisdom that is older than thought. Intuition is your navigation system. Trust it. The moon does not rush to be full. It takes its time, and so should you. Move with the rhythm of your own life. The dance is yours. Enjoy it.`,
  reversed: `Dancing with the Moon reversed suggests being out of sync with your natural cycles, pushing against your own rhythms, or ignoring your intuition. You may be forcing productivity during a time meant for rest, or resting when you should be acting. The card asks you to tune in to your inner seasons. Honor where you are in your cycle. The dance flows better when you stop forcing the steps.`,
});

register({
  title: "work-your-light|Sacred Pause",
  category: "Work Your Light Oracle",
  keywords: ["stillness", "rest", "silence", "reflection", "cessation"],
  symbolism: "A figure sits motionless on a rock beside a still pool. Their eyes are closed, their hands relaxed in their lap. The water reflects the sky perfectly. Nothing moves. The pause is complete and intentional.",
  upright: `This card is a direct instruction to stop. Stop doing. Stop striving. Stop thinking. The Sacred Pause is not empty time. It is filled with presence. When you pause, you create space for something new to enter. The universe cannot fill a moving vessel. Sacred Pause asks you to sit in the stillness and listen. The answers you have been seeking through frantic activity will only come when you are quiet enough to hear them. The pause is not a punishment. It is a gift. The world will not fall apart if you stop for a moment. In fact, your presence is needed more when you are rested and centered. Take the pause. Let the silence speak. In the stillness, you will find what you have been searching for in all the noise.`,
  reversed: `Sacred Pause reversed suggests an inability to stop, restlessness, or a fear of silence. You may be filling every moment with activity to avoid being alone with yourself. The card asks you to put down the distractions. The pause is waiting for you. The stillness will not hurt you. It will heal you. Stop and breathe.`,
});

register({
  title: "work-your-light|Clear Vision",
  category: "Work Your Light Oracle",
  keywords: ["clarity", "perception", "insight", "truth", "seeing clearly"],
  symbolism: "A woman stands before a window, wiping away condensation with her hand. Through the cleared glass, a landscape is visible in sharp detail. The contrast between the blurred and clear sections of the glass emphasizes the act of seeing clearly.",
  upright: `Clear Vision appears when the fog is lifting and you are beginning to see the truth of your situation. Things that were confusing are becoming clear. The haze of illusion, wishful thinking, or denial is clearing, and you can see what has been there all along. This card asks you to trust your clarity. You have been through the confusion, and now you can see. Do not second-guess yourself. The clarity you feel is real. It has been earned through experience and honest self-reflection. Clear Vision also asks you to act on what you see. Clarity without action becomes regret. Now that you can see clearly, take the steps that the truth demands. The window is clear. Look through it. See your path. Walk it with confidence. The fog will not return.`,
  reversed: `Clear Vision reversed suggests confusion, denial, or a refusal to see the truth. The fog has not yet lifted, or you are choosing to stay in the haze because clarity would require change. The card asks you to be honest with yourself. What are you not willing to see? The truth will set you free, but first it may be uncomfortable. Open your eyes.`,
});

register({
  title: "work-your-light|The Courage to Feel",
  category: "Work Your Light Oracle",
  keywords: ["emotion", "vulnerability", "feeling", "bravery", "heart"],
  symbolism: "A figure sits with their hand over their heart, tears streaming down their face, but their posture is not defeated. There is strength in their willingness to feel. Around them, the world softens, and light begins to filter through the clouds.",
  upright: `This card honors the bravery required to feel your feelings fully. In a world that often rewards emotional control and stoicism, the choice to feel deeply is an act of courage. The Courage to Feel asks you to stop numbing, distracting, or suppressing your emotions. Let them move through you. Feelings are not permanent. They are visitors. Let them in. Let them pass through. The courage to feel is also the courage to heal. When you allow yourself to fully experience grief, anger, or fear, you also open yourself to joy, love, and peace. You cannot selectively numb. The Courage to Feel is the path to authentic living. Your heart is strong enough to hold what needs to be felt. Trust it. Feel it. Let it go. The release is the healing.`,
  reversed: `The Courage to Feel reversed suggests emotional avoidance, numbing, or a fear of vulnerability. You may be stuffing your feelings, distracting yourself, or pretending you are fine when you are not. The card asks you to create safe space to feel. The emotions will not destroy you. They will free you. Let them out.`,
});

register({
  title: "work-your-light|You Belong Here",
  category: "Work Your Light Oracle",
  keywords: ["belonging", "acceptance", "home", "inclusion", "worthy"],
  symbolism: "A figure stands in a circle of light cast by a single lamp. The light does not ask them to be different. It simply illuminates them as they are. The expression on their face is one of quiet relief, the relief of finally being seen and accepted.",
  upright: `You Belong Here is a direct message from the universe: you are not a mistake. You were not born into the wrong life. You belong exactly where you are, exactly as you are. The feeling of not belonging has been a shadow that followed you, but this card comes to dispel it. You have a place in the great web of life. Your presence matters. Your voice is needed. The longing to belong is your soul remembering its home. It is not a sign that you are lost. It is a sign that you are ready to come home to yourself. Stop trying to earn your belonging. It is not something you achieve. It is something you recognize. You belong here. Not because you are perfect, but because you are you. The world is incomplete without you. Take your place. You are welcome here.`,
  reversed: `You Belong Here reversed suggests feelings of not fitting in, self-doubt about your place in the world, or rejection by a community you wanted to join. The card asks you to remember that belonging begins within. No external group can make you feel like you belong if you do not believe you deserve to. Claim your belonging. You have a place. You are needed.`,
});

register({
  title: "work-your-light|Trust the Whisper",
  category: "Work Your Light Oracle",
  keywords: ["intuition", "quiet guidance", "inner voice", "subtle signs", "following"],
  symbolism: "A figure pauses in their busy day, head tilted as if listening to something faint. Around them, the world is blurred and rushing, but they have stopped to hear a quiet sound. A single feather floats down beside them, a confirmation of the whisper.",
  upright: `The guidance you are receiving may be quiet, but it is real. Trust the Whisper asks you to pay attention to the subtle nudges, the sudden knowing, the quiet voice that speaks in your chest rather than your head. Big answers do not always come with big fanfare. Often the most profound guidance comes as a whisper, easily drowned out by the noise of daily life. You have been hearing it. That small voice that tells you to turn left, to call that person, to wait, to go. Do not dismiss it because it seems small or illogical. The whisper knows the way. Your task is to listen and trust. The more you follow the whisper, the louder it becomes. Trust builds trust. Begin with the small nudges. They will lead you to the big answers. The whisper is your soul speaking. Listen.`,
  reversed: `Trust the Whisper reversed suggests ignoring your intuition, drowning out your inner voice with noise and logic, or waiting for a louder sign. The whisper is still there, but you are not listening. The card asks you to quiet the noise and tune in. The guidance is available. You just need to be still enough to hear it.`,
});

register({
  title: "work-your-light|Your Soul's Purpose",
  category: "Work Your Light Oracle",
  keywords: ["calling", "mission", "destiny", "reason for being", "life work"],
  symbolism: "A figure stands at the center of a spiral labyrinth, their hand over their heart. At the center of the spiral, a brilliant light glows. The figure has reached the center, the place of knowing. Their purpose is no longer a question but a felt truth.",
  upright: `Your Soul's Purpose is not something you need to invent or discover as if it were hidden. It is something you remember. Your purpose is woven into the fabric of who you are. It is the work that calls to you, the way you naturally serve, the expression of your deepest gifts. This card asks you to stop searching outside yourself for your purpose. Look at what you already love. Look at what you naturally do. Look at what brings you alive. That is your purpose. It does not have to be grand or visible to the world. It only has to be true to you. Your Soul's Purpose may not be one thing. It may be a thread that runs through many things. Follow the thread. It will lead you home. You are already living your purpose in ways you may not recognize. Open your eyes to the meaning that is already present in your life.`,
  reversed: `Your Soul's Purpose reversed suggests feeling lost, disconnected from your calling, or questioning the meaning of your life. You may be searching for purpose in all the wrong places or comparing your path to others'. The card asks you to stop looking and start feeling. Your purpose is not a destination. It is the way you walk. Pay attention to what brings you alive. That is your purpose.`,
});

register({
  title: "work-your-light|Receiving from the Divine",
  category: "Work Your Light Oracle",
  keywords: ["openness", "grace", "receptivity", "blessings", "allowing"],
  symbolism: "A figure stands with upturned palms, eyes closed, face lifted to the sky. Light streams down from above, passing through their hands and filling their body. The scene is one of complete trust and openness to receive.",
  upright: `This card asks you to open yourself to receive from the divine. You have been giving, doing, striving, and holding things together. Now it is time to allow yourself to be held. Receiving from the Divine is not passive. It is an active state of openness and trust. The universe wants to give to you. Blessings, guidance, support, love, resources. They are flowing toward you. But you must be open to receive them. Are you? Or are you too busy, too proud, too independent to let yourself be supported? Receiving is a spiritual practice. It requires you to acknowledge that you are not alone, that help is available, and that you are worthy of good things. Open your hands. Open your heart. Let the divine fill you. You do not have to do this alone. You were never meant to.`,
  reversed: `Receiving from the Divine reversed suggests blocks to receiving, difficulty accepting help, or a belief that you must earn everything. You may be pushing away blessings because you feel unworthy or because you prefer to be self-sufficient. The card asks you to examine your blocks to receiving. The universe is offering. Are you willing to take? Let yourself receive. You deserve it.`,
});

register({
  title: "work-your-light|The Queen of Wands",
  category: "Work Your Light Oracle",
  keywords: ["confidence", "warmth", "courage", "sovereignty", "personal power"],
  symbolism: "A queen sits on a throne carved from living wood, a staff in one hand and a sunflower in the other. Her crown is made of woven vines and lit candles. She radiates warmth and authority, the kind of power that comes from knowing who you are.",
  upright: `The Queen of Wands appears when you are being called to step into your full power with warmth and confidence. She is the part of you that knows what she wants and is not afraid to go after it. Her power is not aggressive. It is magnetic. People are drawn to her clarity and warmth. This card asks you to embody the Queen of Wands energy. Be bold. Be generous. Be confident in your abilities. You have the creative fire and the leadership qualities to make things happen. The Queen of Wands does not wait for permission. She acts. She leads. She inspires. She also nurtures. Her warmth makes others feel safe and seen. Step into your sovereignty. Own your power. The throne is yours. Sit in it with the confidence of one who has earned their place. The kingdom needs your light.`,
  reversed: `The Queen of Wands reversed suggests a loss of confidence, self-doubt, or power that is being misused. You may be shrinking from your authority or being overly domineering. The card asks you to find the balance between confidence and humility. Your power is a gift. Use it wisely and generously.`,
});

register({
  title: "work-your-light|The King of Cups",
  category: "Work Your Light Oracle",
  keywords: ["emotional mastery", "compassion", "calm", "wisdom", "depth"],
  symbolism: "A king sits on a throne at the edge of the sea, his feet in the water. His expression is calm and wise. He holds a cup that is full but not overflowing. The waves behind him are powerful, yet he is not disturbed by them. He has mastered his inner ocean.",
  upright: `The King of Cups represents emotional mastery and the wisdom that comes from feeling deeply without being controlled by those feelings. He sits calmly at the edge of the vast ocean of emotion, neither denying the waves nor being drowned by them. This card asks you to cultivate emotional steadiness. You can feel your feelings without being ruled by them. You can sit with the depths without being pulled under. The King of Cups is compassionate but not codependent. He feels everything and is overwhelmed by nothing. You are being called to this place of emotional sovereignty. Acknowledge your feelings. Honor them. Then choose how to respond rather than react. The cup in your hand is full. You do not need more or less. You need to be present with what is. Emotional mastery is not control. It is presence. Be present.`,
  reversed: `The King of Cups reversed suggests emotional volatility, repressed feelings, or being overwhelmed by emotion. You may be drowning in feelings or, conversely, cut off from them entirely. The card asks you to find the middle path. Feel without being consumed. The King of Cups is not about denying emotion. It is about riding the waves with grace. Seek balance.`,
});

register({
  title: "work-your-light|The Wheel of the Year",
  category: "Work Your Light Oracle",
  keywords: ["seasons", "cycles", "rhythm", "nature", "time"],
  symbolism: "A circle divided into four quadrants shows the same tree in spring, summer, autumn, and winter. The wheel turns, and the figure stands at the center, witnessing the turning without resistance. Each season is honored equally.",
  upright: `The Wheel of the Year reminds you that life moves in seasons, and each season has its purpose. Spring is for planting. Summer is for growing. Autumn is for harvesting. Winter is for resting. You cannot be in all seasons at once, and trying to do so leads to exhaustion. This card asks you to identify which season you are in and honor it. If you are in winter, rest. Do not force spring growth. If you are in summer, act. Do not hibernate. The Wheel of the Year also reminds you that no season is permanent. If you are in a difficult season, it will pass. If you are in a beautiful season, savor it. The wheel turns. Your only task is to be present in the season you are in and do what that season requires. Honor the cycles of your life. They are natural and wise. The wheel knows what it is doing. Trust the turning.`,
  reversed: `The Wheel of the Year reversed suggests being out of sync with the seasons of your life, pushing against the natural cycle, or trying to be in one season when you are in another. You may be forcing growth in winter or resting in summer. The card asks you to check where you are in your cycle and adjust. The wheel turns for a reason. Do not fight it.`,
});

register({
  title: "work-your-light|Trusting Your Creative Voice",
  category: "Work Your Light Oracle",
  keywords: ["creativity", "expression", "art", "authenticity", "voice"],
  symbolism: "A figure stands before a blank canvas, brush in hand. They are not painting yet. They are listening. Their head is tilted, their eyes closed. The canvas is not empty. It is full of potential, waiting for the first mark that will bring the vision to life.",
  upright: `Your creative voice is unique, and it deserves to be heard. This card asks you to trust the creative impulse that is moving through you. You may doubt whether your work is good enough, original enough, or worthy of being seen, but those doubts are not the truth. The truth is that your creative voice matters. The world needs your particular expression. No one else can say what you have to say in exactly the way you can say it. Trusting Your Creative Voice means showing up to create even when you are unsure. It means making the thing, writing the words, singing the song, even if only for yourself. The creative process is not about perfection. It is about connection. Trust that what wants to be expressed through you is valid. Pick up the brush. Make the first mark. The rest will follow.`,
  reversed: `Trusting Your Creative Voice reversed suggests creative blocks, self-doubt, or a fear of expressing yourself. You may be comparing your work to others or judging it before it is born. The card asks you to create for yourself first. Let go of the need for approval. Your creative voice is a gift. Trust it. Use it. The world is waiting for what only you can create.`,
});

register({
  title: "work-your-light|Blessings and Gratitude",
  category: "Work Your Light Oracle",
  keywords: ["thanksgiving", "appreciation", "abundance", "receiving", "grace"],
  symbolism: "A figure kneels in a field of wildflowers, hands clasped over their heart. Their head is bowed, not in submission but in gratitude. The sun is setting, casting a golden glow over everything. The field is abundant. The heart is full.",
  upright: `Blessings and Gratitude asks you to pause and count the good in your life. Not because you should, but because gratitude shifts everything. When you focus on what is good, more good comes into focus. This card speaks of the abundance that is already present in your life. You may be so focused on what is missing that you cannot see what is here. The field is full of wildflowers. The sun is setting in gold. Your life is full of blessings, some small, some large, all real. Gratitude is not toxic positivity. It is not pretending difficulties do not exist. It is the practice of noticing the good alongside the hard. Both can be true. Your blessings are real. Acknowledge them. Thank the universe, thank yourself, thank those who have helped you. Gratitude opens the door for more blessings to enter. The more you give thanks, the more you receive.`,
  reversed: `Blessings and Gratitude reversed suggests ingratitude, a focus on what is lacking, or an inability to see the good in your life. You may be taking your blessings for granted or comparing your life to others. The card asks you to shift your perspective. What is going well? What can you appreciate right now? Gratitude is a practice. Start small.`,
});

register({
  title: "work-your-light|The Healer Within",
  category: "Work Your Light Oracle",
  keywords: ["healing", "wholeness", "self-care", "restoration", "inner medicine"],
  symbolism: "A figure sits with their hands gently cupping a glowing light at their heart center. The light radiates through their body, mending what is broken from the inside out. Their face is peaceful, and the scene radiates the quiet power of self-healing.",
  upright: `You have the power to heal yourself. The Healer Within is not outside of you. It is not a person, a pill, or a technique. It is the innate intelligence of your own being that knows how to restore balance and wholeness. This card asks you to trust your body and your spirit's ability to heal. You have been through wounds, some visible, some hidden. The path to healing begins within. Create the conditions for healing. Rest, nourishment, gentle movement, time in nature, loving connection, honest expression. These are the medicines. The Healer Within also asks you to stop looking outside yourself for someone to fix you. Others can support you, but the healing is yours to do. Trust your inner healer. It knows the way. Give it the space and resources it needs, then get out of its way. Healing is not forcing. It is allowing.`,
  reversed: `The Healer Within reversed suggests resistance to healing, a belief that you are broken beyond repair, or looking outside yourself for healing that must come from within. You may be avoiding the inner work that true healing requires. The card asks you to turn inward. The healer is within you. Trust it. The path to wholeness begins with the choice to heal. Choose yourself.`,
});

register({
  title: "work-your-light|Soul Alignment",
  category: "Work Your Light Oracle",
  keywords: ["integrity", "harmony", "truth", "congruence", "authentic living"],
  symbolism: "A figure stands with their arms raised, a vertical line of light running from the crown of their head through the center of their body to the earth below. They are perfectly aligned. The energy flows without obstruction. The heavens and earth are connected within them.",
  upright: `Soul Alignment speaks of the deep congruence between your inner truth and your outer life. When you are in alignment, your actions match your values, your words match your heart, and your life reflects your soul. This is the state of grace that comes when you stop living for others and start living as yourself. This card asks you to check your alignment. Are you living in a way that honors your truth? Have you compromised your values to fit in or to please others? The misalignment you feel is not a sign that you are wrong. It is a sign that you are ready to realign. Soul Alignment is not a destination. It is a continuous practice of returning to your center. The light flows when you are aligned. When you are not, the path feels blocked and heavy. Realign. Return to your truth. The energy flows freely when you are in integrity. Let it flow.`,
  reversed: `Soul Alignment reversed suggests misalignment between your inner truth and your outer life. You may be living in a way that contradicts your values, or you may feel out of sync with your purpose. The card asks you to identify where you have compromised yourself and take steps to realign. The discomfort of misalignment is a sign pointing you home. Follow it.`,
});

register({
  title: "work-your-light|The Magic of Beginnings",
  category: "Work Your Light Oracle",
  keywords: ["fresh start", "new cycle", "potential", "innocence", "first step"],
  symbolism: "A door stands open in a wall of ivy, revealing a sunlit landscape beyond. The threshold is crossed with one foot, and a figure pauses at the entrance, breathing in the new air. The doorframe is decorated with fresh blossoms and green vines.",
  upright: `The Magic of Beginnings celebrates the power and potential of starting something new. Every beginning carries a unique enchantment. The moment before the first step is charged with possibility. This card asks you to honor that magic. You are at the start of something. Do not let your knowledge of past struggles rob this moment of its freshness. This beginning is different. You are different. The Magic of Beginnings is not naive optimism. It is the recognition that every moment offers the chance to start again. The door is open. The threshold is before you. What you are beginning is blessed by the universe. Step through with wonder. Trust that the path will open as you walk it. The magic of beginnings is real. Feel it. Let it carry you forward into the new.`,
  reversed: `The Magic of Beginnings reversed suggests a reluctance to start something new, fear of the unknown, or a beginning that feels cursed. Past disappointments may be casting a shadow on this fresh start. The card asks you to separate this beginning from past ones. This is a clean slate. The magic is still here, even if you cannot feel it. Take the first step anyway. The magic will meet you.`,
});

register({
  title: "work-your-light|The Inner Temple",
  category: "Work Your Light Oracle",
  keywords: ["sacred space", "inner sanctuary", "solitude", "spiritual practice", "centering"],
  symbolism: "A figure sits in meditation within a column of light. The space around them is simple and clean. The walls of their inner temple are made of translucent crystal, filtering light into rainbows. The figure is both the worshipper and the temple itself.",
  upright: `The Inner Temple is the sacred space within you that no one can touch. It is your center, your place of peace, your direct connection to the divine. This card asks you to build and return to your inner temple regularly. In the chaos of the outer world, you have a sanctuary within. The Inner Temple is not a place you go. It is a place you become. Through meditation, prayer, breath, or stillness, you can enter this sacred space at any time. The temple is always open. The door is your intention. The Inner Temple asks you to make your spiritual practice a priority, not an afterthought. Your inner sanctuary is where you remember who you truly are. Visit it daily. Tend it with care. The peace you find there will radiate into every area of your life. You are the temple. Treat yourself as sacred.`,
  reversed: `The Inner Temple reversed suggests a neglected spiritual practice, a loss of connection to your inner sanctuary, or a sacred space that has been abandoned. You may have been too busy or too distracted to tend your inner life. The card asks you to return to the temple. It is still there. The door is still open. Enter. Be still. Reconnect. The temple has been waiting for you.`,
});

register({
  title: "work-your-light|The Gift of Tears",
  category: "Work Your Light Oracle",
  keywords: ["release", "grief", "healing", "cleansing", "emotion"],
  symbolism: "A figure sits with tears streaming down their face, but their hands are open and relaxed. The tears are not painful. They are cleansing. Each tear that falls becomes a small flower as it touches the ground, transforming sorrow into beauty.",
  upright: `The Gift of Tears honors the healing power of crying. Tears are not a sign of weakness. They are a release valve for the soul. This card asks you to allow yourself to cry if tears are near. The release you have been holding onto is ready to flow. Crying is a form of prayer. It is the body's way of releasing what the heart can no longer carry. The Gift of Tears tells you that your tears are holy. They are not wasted. They water the ground of your being and prepare it for new growth. What you release through tears creates space for joy to enter. The Gift of Tears also asks you to hold space for others to cry. Not to fix them, not to stop their tears, but to witness their release. Tears are a gift. Let them flow. The healing is in the release. After the tears comes the peace.`,
  reversed: `The Gift of Tears reversed suggests suppressed grief, an inability to cry, or a fear of emotional release. You may be holding onto pain that needs to be expressed. The card asks you to create a safe space to let the tears come. They are not weakness. They are release. Let yourself cry. The healing you need is waiting on the other side of your tears.`,
});

register({
  title: "work-your-light|The Wild Woman",
  category: "Work Your Light Oracle",
  keywords: ["freedom", "instinct", "untamed", "authentic", "wild nature"],
  symbolism: "A woman with wild hair stands in a forest, her clothes made of leaves and bark. She is not separate from the wilderness. She is part of it. Animals gather around her without fear. Her eyes hold the wisdom of the ancient and the freedom of the untamed.",
  upright: `The Wild Woman is the part of you that has never been tamed by society's rules. She knows what she wants. She follows her instincts. She does not ask for permission. This card asks you to reconnect with your wild nature. You have been domesticated by expectations, responsibilities, and the need to fit in. But the Wild Woman is still alive within you. She remembers how to run free, how to trust her gut, how to say no when something does not feel right. The Wild Woman does not follow the path. She makes her own. She trusts her body. She listens to the earth. She knows that her desires are valid and her voice matters. This card asks you to uncage yourself. Return to your wild nature. Let your hair down. Speak your truth. Follow your instincts. The Wild Woman is not lost. She is waiting for you to remember her. Let her lead.`,
  reversed: `The Wild Woman reversed suggests suppression of your true nature, over-domestication, or a fear of your own wildness. You may be conforming to expectations that do not fit you. The card asks you to reclaim your freedom. The wild woman is calling. She will not be tamed. Do not try to silence her. Let her run.`,
});

register({
  title: "work-your-light|Ancestral Healing",
  category: "Work Your Light Oracle",
  keywords: ["lineage", "family patterns", "healing the past", "ancestors", "liberation"],
  symbolism: "A figure stands in a river, hands extended to both banks. On one bank stand shadowy ancestral figures. On the other bank, children play in the light. The figure is the bridge between past and future, healing the line so the children can play freely.",
  upright: `Ancestral Healing calls you to address the patterns that have been passed down through your family line. The wounds of your ancestors live in your body, your beliefs, and your behaviors. This card asks you to heal not just for yourself, but for those who came before and those who will come after. You are the one who can break the cycle. You have the awareness, the courage, and the resources to heal what has been carried for generations. The healing may involve forgiveness, understanding, or simply naming what was previously unspeakable. An Ancestral Healing asks you to honor your lineage without being bound by it. You can love your family and still choose to heal the patterns that no longer serve. As you heal, you free yourself and all those who come after you. The healing ripples forward and backward through time. You are the ancestor of the future. Heal for them.`,
  reversed: `Ancestral Healing reversed suggests unresolved family patterns, denial of lineage, or a refusal to address inherited wounds. You may be repeating cycles without awareness. The card asks you to look honestly at your family patterns. What are you carrying that is not yours? The healing is possible, but it begins with acknowledgment. Name the pattern. The liberation can begin.`,
});

register({
  title: "work-your-light|The Cosmic Mother",
  category: "Work Your Light Oracle",
  keywords: ["divine feminine", "nurturing", "infinity", "universal love", "creation"],
  symbolism: "A vast female figure made of stars and nebulae cradles the earth in her hands. Her presence fills the cosmos. She is the mother of all things, the womb from which all life emerged. Her eyes hold the wisdom of infinite love.",
  upright: `The Cosmic Mother appears to remind you that you are held by a love greater than any human love. This love is the fabric of the universe itself. It does not judge. It does not withhold. It simply holds you, always, in every moment. This card asks you to rest in the embrace of the Cosmic Mother. You do not have to earn her love. You do not have to perform or achieve or be good enough. You are her child, and she loves you unconditionally. The Cosmic Mother is the source of all nurturing, all creation, all life. When you feel alone, remember that you are cradled in her hands. When you feel lost, remember that she holds the map. When you feel unloved, remember that her love is the substance of your being. Rest in the cosmic womb. Let yourself be held. You are safe. You are loved. You are never alone.`,
  reversed: `The Cosmic Mother reversed suggests a feeling of being unloved, disconnected from the divine feminine, or orphaned by the universe. You may feel that no one is holding you, that you are alone in the vastness. The card asks you to open to the love that is always present. The Cosmic Mother has not abandoned you. You have only forgotten her. She is there. Let yourself be held.`,
});

register({
  title: "work-your-light|The Time Is Now",
  category: "Work Your Light Oracle",
  keywords: ["action", "urgency", "opportunity", "seize the moment", "no more delay"],
  symbolism: "A figure stands at the edge of a cliff, the sun rising before them. Their foot is already lifted, mid-step, about to step into the unknown. The time for waiting is over. The moment demands action. The figure is committed to the step.",
  upright: `The Time Is Now is a clear and urgent call to action. You have waited, planned, prepared, and hesitated long enough. The moment you have been waiting for is here. This card asks you to stop waiting for the perfect conditions and take the step. The sun is rising on a new phase. The cliff edge is not a threat. It is an invitation. The leap is not reckless. It is faith in action. The Time Is Now does not mean you have all the answers. It means you have enough. You have enough clarity, enough courage, enough support. The rest will come as you move. Waiting any longer will cost you more than jumping will. The universe is backing you. The time is now. Take the step. The net will appear. The path will open. But only if you move. Now is the moment. Do not let it pass.`,
  reversed: `The Time Is Now reversed suggests procrastination, missed opportunities, or a fear of taking action. You may be waiting for a sign that has already come. The card asks you to recognize that delay is becoming denial. The moment is passing. Take the step before the window closes. You are ready. The time is now. Act.`,
});

register({
  title: "work-your-light|Surrender to the Flow",
  category: "Work Your Light Oracle",
  keywords: ["letting go", "allowing", "trust", "non-resistance", "effortless"],
  symbolism: "A figure lies face-down in a clear river, arms outstretched, allowing the current to carry them. Their body is relaxed. They are not fighting the current. They trust the river completely. The water sparkles with light, and the journey looks peaceful.",
  upright: `Surrender to the Flow asks you to stop swimming against the current of your life. The effort you are expending to control outcomes is exhausting you. This card invites you to relax into the natural flow of events. The river of life knows where it is going. You do not need to steer. You only need to trust. Surrender is not giving up. It is giving over. You release the illusion of control and allow a higher intelligence to guide you. The flow will take you where you need to go. It will bring you to exactly the right people, opportunities, and experiences. Your only task is to stay present and trust. When you stop fighting, the journey becomes effortless. The river carries you. You float. You are not passive. You are trusting. The flow knows the way. Let it carry you. Surrender is the highest form of trust.`,
  reversed: `Surrender to the Flow reversed suggests resistance, control, or fighting against the natural current of your life. You are exhausting yourself by trying to control outcomes that are not yours to control. The card asks you to release your grip. The river knows the way. Stop fighting the current. Let go. Float. Trust. The flow is safe. You can surrender.`,
});

register({
  title: "work-your-light|Your Crown of Light",
  category: "Work Your Light Oracle",
  keywords: ["divine connection", "illumination", "higher self", "radiance", "awakening"],
  symbolism: "A figure wears a crown made of pure light that floats slightly above their head. The light streams down through their body, grounding into the earth. The figure stands tall, connected to the heavens and the earth simultaneously. They are both human and divine.",
  upright: `Your Crown of Light is the symbol of your direct connection to the divine. You are not separate from the source. You are an expression of it. This card asks you to claim your spiritual authority and remember your divine nature. The crown is not a symbol of power over others. It is a symbol of your connection to something greater. You are a channel for divine light. Your purpose is to let that light flow through you into the world. The crown is already there. You do not need to earn it. You need to remember it. Your Crown of Light asks you to stand tall in your spiritual truth. You are not a small, limited human trying to figure things out. You are a divine being having a human experience. The light is your nature. Let it shine. Let it guide you. You are crowned with light. Live from that truth.`,
  reversed: `Your Crown of Light reversed suggests forgetting your divine nature, feeling disconnected from source, or a lack of spiritual confidence. You may be living as if you are separate and alone. The card asks you to remember who you are. The crown is still there. You have only forgotten it. Reconnect with the divine. The light is your birthright. Claim it.`,
});

})();

/* ══════════════════════════════════════════════════
   MOONOLOGY (Yasmin Boland, 44 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "moonology|New Moon in Aries",
  category: "Moonology",
  keywords: ["new beginning", "initiative", "courage", "fresh start", "action"],
  symbolism: "A slender crescent moon hangs over a spark of flame. The landscape below is still dark, but the spark is the beginning of something new. The energy is raw, impatient, and full of potential. The flame and the crescent mirror each other.",
  upright: `The New Moon in Aries marks the beginning of a new cycle, charged with the fire of initiative and courage. This is a time to start something you have been afraid to begin. The energy is raw and unformed, like the spark before the flame catches. You are being asked to take action without having all the answers. Trust your instincts. Aries energy does not overthink. It acts. The New Moon in Aries asks you to be brave, to assert yourself, and to take the first step. The seeds planted now will grow through the coming cycle. Choose your intention with care. What do you want to ignite? The spark is in your hand. Blow on it. Watch it catch. Something new is being born. Be bold enough to claim it.`,
  reversed: `New Moon in Aries reversed suggests hesitation, fear of starting, or a lack of direction. You may be holding back when action is needed. The card asks you to find your courage. The spark is still there. It has not gone out. Take the first step, no matter how small. The fire will catch.`,
});

register({
  title: "moonology|Full Moon in Libra",
  category: "Moonology",
  keywords: ["balance", "relationships", "harmony", "partnership", "justice"],
  symbolism: "A brilliant full moon hangs in a twilight sky, perfectly balanced between two evenly matched scales suspended on either side of it. The light of the moon illuminates both sides equally. The scene evokes balance, beauty, and the resolution of opposites.",
  upright: `The Full Moon in Libra brings matters of relationship and balance to a peak. This is a time of culmination in partnerships of all kinds. What has been developing in your connections with others now comes to light. The Full Moon illuminates where balance is needed. Are you giving and receiving equally? Are your relationships fair and harmonious? The Full Moon in Libra asks you to seek equilibrium. Not through compromise that diminishes you, but through the creation of a third way that honors both sides. The scales are balanced not by taking from one side but by bringing both into alignment. This is also a time of beauty, art, and social connection. Allow yourself to enjoy the company of others. Let grace and diplomacy guide your interactions. The Full Moon in Libra brings clarity to the heart of your relationships. Look honestly. Adjust where needed. Harmony is possible.`,
  reversed: `Full Moon in Libra reversed suggests relationship conflict, imbalance, or injustice. A partnership may be out of balance, or you may be avoiding a necessary confrontation about fairness. The card asks you to address the imbalance directly. The full moon will not hide what needs to be seen. Face it with grace and honesty.`,
});

register({
  title: "moonology|New Moon in Cancer",
  category: "Moonology",
  keywords: ["home", "nurturing", "emotion", "family", "security"],
  symbolism: "A new moon rests in a nest made of branches and soft moss, cradled in the fork of a tree. The nest is a symbol of home, safety, and maternal care. The moon is barely visible, suggesting the tender beginnings that happen in the safety of the nest.",
  upright: `The New Moon in Cancer is a tender time for planting seeds related to home, family, and emotional security. This is a powerfully nurturing energy, asking you to consider what you need to feel safe and cared for. The New Moon in Cancer invites you to turn inward and tend to your emotional foundations. What does your inner child need? What would make you feel held and protected? This is also a time to focus on your home environment. Make your space feel safe and loving. Plant seeds for family healing and deeper emotional connections. The New Moon in Cancer reminds you that security begins within. When you feel safe in your own being, you can create safety in your outer world. Nurture yourself. Nurture your home. Nurture the seeds of emotional well-being. They will grow into a foundation that can hold you through anything.`,
  reversed: `New Moon in Cancer reversed suggests emotional insecurity, home conflicts, or difficulty nurturing yourself or others. You may be feeling unsafe or untethered. The card asks you to tend to your emotional foundations. What do you need to feel secure? Create safety from the inside out. The nest can be rebuilt.`,
});

register({
  title: "moonology|Full Moon in Capricorn",
  category: "Moonology",
  keywords: ["ambition", "achievement", "structure", "culmination", "responsibility"],
  symbolism: "A full moon rises behind a mountain peak, its light casting long shadows across a rocky landscape. The mountain represents ambition and achievement. The full moon represents the culmination of efforts. The scene is stark, powerful, and clear.",
  upright: `The Full Moon in Capricorn brings matters of career, ambition, and public achievement to a head. This is a time of reckoning with your responsibilities and your standing in the world. The Full Moon illuminates the mountain you have been climbing. How far have you come? What remains to be achieved? The Full Moon in Capricorn asks you to take stock of your accomplishments with honesty and pride. You have worked hard. You have earned your place. But the Capricorn full moon also asks whether your ambitions are still aligned with your true values. The structure you are building must rest on a foundation that can hold it. This is also a time for taking responsibility. Own your successes and your failures. Both have brought you to this point. The mountain is high, but the view from the summit is clear. Assess your position. Plan your next ascent. The climb continues.`,
  reversed: `Full Moon in Capricorn reversed suggests career disappointment, unfulfilled ambitions, or a fear of failure. The mountain may feel too steep, or you may be questioning whether the climb is worth it. The card asks you to reassess your goals. What truly matters to you? The full moon reveals the truth. Adjust your course if needed. The mountain will still be there.`,
});

register({
  title: "moonology|New Moon in Gemini",
  category: "Moonology",
  keywords: ["communication", "ideas", "curiosity", "duality", "connection"],
  symbolism: "Two crescent moons mirror each other in a sky that is neither day nor night. Between them, a stream of tiny stars connects them like a conversation across the sky. The image evokes communication, duality, and the meeting of minds.",
  upright: `The New Moon in Gemini brings the energy of curiosity, communication, and mental exploration. This is a time to plant seeds of ideas, to start conversations, to learn something new. The New Moon in Gemini asks you to open your mind and follow your curiosity. What have you been wanting to learn? What conversations need to happen? What ideas are waiting to be born? This energy is light, quick, and versatile. It is not the time for heavy commitment. It is the time for exploration and exchange. The New Moon in Gemini also illuminates duality. You may hold two seemingly contradictory truths within you. That is okay. You do not have to choose one. Gemini energy embraces both. Plant seeds for new connections, new studies, new ways of thinking. The mind is fertile ground. What you plant now will grow into understanding. Curiosity is the gateway. Follow it.`,
  reversed: `New Moon in Gemini reversed suggests communication blocks, mental confusion, or difficulty making connections. Your mind may feel scattered or stuck. The card asks you to simplify. Focus on one idea at a time. Clear the mental clutter. The seeds you plant need clear ground to grow. Take a breath and focus.`,
});

register({
  title: "moonology|Full Moon in Sagittarius",
  category: "Moonology",
  keywords: ["adventure", "truth", "expansion", "freedom", "wisdom"],
  symbolism: "A full moon blazes over an open horizon, illuminating a wide landscape of plains and distant mountains. An archer's arrow flies across the moon, pointing toward the unknown. The scene speaks of adventure, truth-seeking, and the call of the wild.",
  upright: `The Full Moon in Sagittarius brings a blaze of truth-seeking and adventurous energy. This full moon asks you to expand your horizons. The truth you have been seeking is ready to be revealed, but you must be willing to travel for it. The Full Moon in Sagittarius calls you to adventure. Is there somewhere you have wanted to go, something you have wanted to learn, a truth you have wanted to speak? The time is now. This is a full moon of freedom. Release anything that has been confining your spirit. The archer's arrow is flying. It does not second-guess. It aims for the truth and releases. The Full Moon in Sagittarius asks you to do the same. Speak your truth. Follow your call to adventure. Expand your understanding of what is possible. The horizon is wide. The world is larger than your current perspective. Go see it. The truth will set you free.`,
  reversed: `Full Moon in Sagittarius reversed suggests a fear of freedom, avoidance of truth, or feeling confined by your circumstances. You may be playing small when you are meant to expand. The card asks you to examine what is holding you back. The truth is waiting. The adventure is calling. Do not let fear keep you in a cage that has no door.`,
});

register({
  title: "moonology|New Moon in Taurus",
  category: "Moonology",
  keywords: ["stability", "manifestation", "grounding", "abundance", "patience"],
  symbolism: "A new moon rests low on the horizon above a fertile field. The soil is dark and rich. Tiny green shoots are visible, just beginning to emerge. The scene is still, patient, and full of the promise of abundance. The earth is ready to receive.",
  upright: `The New Moon in Taurus brings slow, steady energy for planting seeds of abundance and stability. This is not a time for quick results. It is a time for patient cultivation. The New Moon in Taurus asks you to get grounded. Connect with your body, your resources, your senses. What do you want to build that will last? Taurus energy is about creating solid foundations. The seeds you plant now will grow slowly but surely. Trust the pace. The New Moon in Taurus is also about self-worth. What are you worth? What do you value? Plant seeds for financial abundance, for physical well-being, for the kind of security that comes from knowing you are enough. This energy is patient, sensual, and deeply connected to the earth. Get your hands in the soil of your life. Plant what matters. Water it with patience. The harvest will come. It always does for those who tend the land with love.`,
  reversed: `New Moon in Taurus reversed suggests impatience with material progress, financial insecurity, or a disconnection from your body and the earth. You may be trying to force growth when steady tending is needed. The card asks you to slow down and trust the process. The earth supports you. Ground yourself. Abundance is coming.`,
});

register({
  title: "moonology|Full Moon in Scorpio",
  category: "Moonology",
  keywords: ["transformation", "depth", "intensity", "release", "rebirth"],
  symbolism: "A full moon hangs over a dark lake, its reflection rippling on the water's surface. Beneath the surface, shapes move in the depths. The moon's light penetrates the water, revealing what is usually hidden. The scene is intense, mysterious, and deeply truthful.",
  upright: `The Full Moon in Scorpio is one of the most intense lunar events of the year. This full moon brings hidden truths to the surface, especially those related to power, intimacy, and transformation. The Full Moon in Scorpio asks you to dive deep. What have you been hiding? What needs to be transformed? What emotional patterns are ready to die so something new can be born? This is not a gentle full moon. It is surgical. It cuts away what is false so the truth can emerge. The Full Moon in Scorpio asks you to face your shadows with courage. The truth may be uncomfortable, but it is also liberating. Release what has been dead in your life. Let it go. The Scorpio full moon is a powerful time for emotional healing and deep psychological release. Trust the process. The darkness is not your enemy. It is the womb of your rebirth. Face it. Release it. Rise.`,
  reversed: `Full Moon in Scorpio reversed suggests resistance to deep transformation, hidden truths that are not yet surfacing, or fear of emotional intensity. You may be avoiding the depths because you are afraid of what you will find. The card asks you to be brave. The truth will set you free, but first it may unnerve you. Dive deep anyway. The healing is in the depths.`,
});

register({
  title: "moonology|New Moon in Leo",
  category: "Moonology",
  keywords: ["self-expression", "creativity", "joy", "confidence", "heart"],
  symbolism: "A new moon shines in a sky that is lit by the last rays of sunset. Below, a stage is set with a single microphone. The spotlight waits. The energy is one of anticipation, of a performance about to begin, of the heart ready to express itself.",
  upright: `The New Moon in Leo brings bold, creative energy for planting seeds of self-expression and joy. This is a time to put yourself out there, to take center stage in your own life. The New Moon in Leo asks you to express your true self without apology. What do you want to create? How do you want to shine? Leo energy is generous, warm, and unapologetically visible. The New Moon in Leo is also about the heart. What does your heart want? Not what your head thinks is practical, but what your heart desires. This is a time to follow the breadcrumbs of joy. Do what lights you up. Create from a place of passion. The New Moon in Leo asks you to be the star of your own life. Not in an ego-driven way, but in the sense of claiming your unique radiance. The world needs your light. Plant seeds of creative expression. Let yourself be seen. The spotlight is waiting. Step into it.`,
  reversed: `New Moon in Leo reversed suggests fear of being seen, creative blocks, or difficulty expressing your true self. You may be hiding your light or dimming yourself to avoid attention. The card asks you to find the courage to shine. The world needs your unique expression. Step into the light. You were born to be seen.`,
});

register({
  title: "moonology|Full Moon in Aquarius",
  category: "Moonology",
  keywords: ["community", "innovation", "humanity", "vision", "collective"],
  symbolism: "A full moon rises behind a network of interconnected lights, like a city seen from above or a neural network. The individual lights are distinct, but they form a larger pattern together. The moon illuminates the whole system, revealing the beauty of connection.",
  upright: `The Full Moon in Aquarius brings focus to your place in the collective. This is a time of culmination in matters of community, friendship, and your contribution to the greater good. The Full Moon in Aquarius asks you to think beyond yourself. How do you fit into the larger pattern? What is your unique contribution to the whole? Aquarius energy is innovative, humanitarian, and future-focused. This full moon may bring breakthroughs in your social connections or your vision for the future. The Full Moon in Aquarius also celebrates your individuality. You are a unique thread in the fabric of humanity. Your differences are not weaknesses. They are your gifts. This full moon asks you to honor both your individuality and your connection to others. You are both uniquely yourself and part of something larger. Both truths are real. Both are celebrated under the Aquarius full moon. Connect. Contribute. Be yourself fully. The collective needs exactly what you have to offer.`,
  reversed: `Full Moon in Aquarius reversed suggests disconnection from community, feeling like an outsider, or a conflict between your individuality and belonging. You may be isolating yourself or suppressing your uniqueness to fit in. The card asks you to find your tribe. Your individuality is your gift. Do not hide it to belong. The right community will celebrate you as you are.`,
});

register({
  title: "moonology|New Moon in Pisces",
  category: "Moonology",
  keywords: ["dreams", "intuition", "spirituality", "imagination", "dissolution"],
  symbolism: "A new moon barely visible above an infinite ocean, its light diffusing through mist and sea spray. The boundary between sea and sky is impossible to find. The scene is dreamy, mystical, and boundaryless. Reality seems to dissolve into imagination.",
  upright: `The New Moon in Pisces brings dreamy, intuitive energy for planting seeds of spiritual connection and creative imagination. This is a time when the veils between worlds are thin. The New Moon in Pisces asks you to dream without limits. Your imagination is a portal. What do you see when you close your eyes? What does your soul long for? Pisces energy dissolves boundaries. This is not a time for rigid plans. It is a time for openness, flow, and trust. The New Moon in Pisces is deeply spiritual. It invites you to connect with the divine through meditation, art, music, or simply being present with the mystery. The seeds you plant now are more about feeling than doing. What state of being do you want to cultivate? Peace, compassion, connection, wonder. These are the seeds of Pisces. They grow not through effort but through allowing. Trust the current. Let yourself be carried into the infinite. The dreams you plant now will bloom in ways you cannot yet imagine.`,
  reversed: `New Moon in Pisces reversed suggests confusion, escapism, or difficulty grounding your dreams in reality. You may be avoiding practical matters or feeling lost in fantasy. The card asks you to find balance between dreaming and doing. Your visions need a container to become real. Ground your dreams with one practical step.`,
});

register({
  title: "moonology|Full Moon in Virgo",
  category: "Moonology",
  keywords: ["healing", "service", "organization", "health", "refinement"],
  symbolism: "A full moon illuminates a garden where every plant is neatly tended, every weed removed. Moonlight reveals the details. A figure moves through the garden, tending with care and precision. The scene speaks of healing, order, and the beauty of careful attention.",
  upright: `The Full Moon in Virgo brings matters of health, service, and daily life to a point of clarity. This is a time to assess your routines, your habits, and your well-being. The Full Moon in Virgo asks you to look at the details. Small things matter. What needs to be cleaned, organized, or healed in your daily life? Virgo energy is analytical, practical, and deeply caring. This full moon illuminates where you can improve your well-being. The Full Moon in Virgo is also about service. How do you serve others? How do you serve yourself? True service comes from a place of grounded love. This is a time to refine your life, not through harsh criticism but through loving attention to detail. Heal your body. Organize your space. Serve with joy. The full moon in Virgo reveals the sacred in the ordinary. The smallest act of care is a prayer. Tend your life with love and watch it bloom.`,
  reversed: `Full Moon in Virgo reversed suggests perfectionism, health issues, or excessive worry about details. You may be overcritical of yourself or others. The card asks you to release the need for perfection. Done is better than perfect. Heal your relationship with yourself. You are enough, exactly as you are. The details can wait. Tend to your heart first.`,
});

register({
  title: "moonology|New Moon in Libra",
  category: "Moonology",
  keywords: ["relationship", "balance", "harmony", "aesthetics", "partnership"],
  symbolism: "A perfect new moon cradled between two hands that are gently cupped together, forming a bowl. The hands are equal, neither dominating. The moon rests in the space between them. The image speaks of balance, relationship, and the beauty of equal partnership.",
  upright: `The New Moon in Libra brings energy for planting seeds in relationships and creating more beauty and balance in your life. This is a time to focus on partnership. Not just romantic partnership, but all forms of connection. The New Moon in Libra asks you to consider what balance means in your relationships. Are you giving and receiving in equal measure? Are you honoring both your needs and the needs of others? Libra energy is diplomatic, graceful, and aesthetically attuned. This is a time to create beauty in your environment and harmony in your connections. The New Moon in Libra is also a call to make peace. Is there a relationship that needs healing? A conversation that needs to happen? The seeds you plant now for peace and partnership will grow into deeper connection. Approach others with grace. Seek the middle ground. Create relationships that honor both of you. The scales of Libra are balanced not by force but by love. Plant seeds of harmony. They will grow.`,
  reversed: `New Moon in Libra reversed suggests relationship difficulties, imbalance in giving and receiving, or a fear of partnership. You may be avoiding a relationship that needs attention or staying in one that is out of balance. The card asks you to seek equilibrium. Address the imbalance with grace and honesty. Harmony is possible, but it requires action.`,
});

register({
  title: "moonology|Full Moon in Aries",
  category: "Moonology",
  keywords: ["assertion", "conflict", "independence", "courage", "culmination"],
  symbolism: "A full moon blazes in a sky streaked with red and orange. Below, a single figure stands on a battlefield that is now quiet. The fight is over. The figure stands alone, breathing hard, having asserted their position. The moon witnesses their courage.",
  upright: `The Full Moon in Aries brings matters of independence, assertion, and courage to a head. This is a time when conflicts may come to a peak, and you are asked to stand your ground. The Full Moon in Aries asks you to claim your independence. Where have you been too accommodating? Where have you lost yourself in the needs of others? This full moon gives you the fire to assert your truth. The Full Moon in Aries is not about picking fights. It is about having the courage to be yourself fully. This full moon can be confrontational. It can stir up anger. But the anger is a signal. Something needs to change. Something needs to be asserted. The Full Moon in Aries asks you to be honest about what you want and to have the courage to pursue it. The battlefield is quiet now. The fight is over. You spoke your truth. You stood your ground. You may be bruised, but you are not broken. You are free.`,
  reversed: `Full Moon in Aries reversed suggests suppressed anger, fear of conflict, or a loss of your sense of self. You may be avoiding confrontation at the cost of your own truth. The card asks you to find healthy ways to assert yourself. Your truth matters. Speak it, even if your voice shakes. The courage is within you. Claim it.`,
});

register({
  title: "moonology|New Moon in Capricorn",
  category: "Moonology",
  keywords: ["ambition", "structure", "foundation", "commitment", "long-term"],
  symbolism: "A new moon sits on the peak of a mountain, small but steady. Below, the foundations of a building are being laid. Workers place stones carefully. The work is slow and deliberate. The scene speaks of ambition grounded in patience and solid construction.",
  upright: `The New Moon in Capricorn brings serious, ambitious energy for planting long-term goals and building solid foundations. This is not a time for frivolous beginnings. It is a time for commitments that matter. The New Moon in Capricorn asks you to think about your legacy. What do you want to build that will last? Capricorn energy is disciplined, patient, and focused on the long game. The seeds you plant now may take years to fully grow, but they will be worth the wait. The New Moon in Capricorn is also about taking responsibility. Own your ambitions. Commit to your path. This is a time for setting goals that align with your highest purpose. The mountain is steep, but you have the stamina to climb it. Plant your flag. Set your intention. Begin the climb. The New Moon in Capricorn blesses the slow and steady. One step at a time, you will reach the summit. Your foundation is being built to last.`,
  reversed: `New Moon in Capricorn reversed suggests a lack of ambition, fear of commitment, or impatience with the slow pace of achievement. You may be avoiding responsibility or doubting your ability to reach your goals. The card asks you to get practical. Break your goal into small steps. The mountain is climbed one step at a time. You can do this. Trust the process.`,
});

register({
  title: "moonology|Full Moon in Cancer",
  category: "Moonology",
  keywords: ["emotions", "home", "family", "nurturing", "culmination"],
  symbolism: "A full moon shines through the window of a cozy home, casting silver light on a table set for a family meal. The chairs are full. The room is warm. The moon's light softens every edge, making the home feel safe and sacred. Emotions are close to the surface.",
  upright: `The Full Moon in Cancer brings emotional matters to a peak, especially those related to home, family, and your sense of security. This full moon asks you to feel your feelings fully. Cancer energy is deeply emotional, protective, and nurturing. The Full Moon in Cancer illuminates what you need to feel safe. The Full Moon in Cancer is a time for emotional release. Tears may come easily. Let them. Your feelings are valid. The full moon in Cancer also highlights family dynamics. Old patterns may surface. Unresolved emotional issues may come up for healing. This is a good thing. You cannot heal what you do not acknowledge. The Full Moon in Cancer asks you to nurture yourself as you would nurture a beloved child. You are safe here. You are held. The moon cradles you in her soft light. Let yourself be held. Let yourself feel. The emotional release you experience now clears the way for deeper peace. Home is not a place. It is the safety of your own heart. Come home to yourself.`,
  reversed: `Full Moon in Cancer reversed suggests emotional overwhelm, family conflict, or a fear of vulnerability. You may be shutting down your feelings to protect yourself. The card asks you to create safety for your emotions. It is okay to feel. It is okay to need. Nurture yourself. The moon holds you. Let yourself be held.`,
});

register({
  title: "moonology|New Moon in Virgo",
  category: "Moonology",
  keywords: ["health", "organization", "service", "refinement", "practicality"],
  symbolism: "A new moon rises over a tidy desk with organized papers, a cup of tea, and a single perfect flower in a vase. The scene is orderly but warm. The energy is one of calm productivity, of gentle refinement. Small improvements are being made with care.",
  upright: `The New Moon in Virgo brings practical, healthful energy for improving your daily life and well-being. This is a time to plant seeds of healthy habits and organized systems. The New Moon in Virgo asks you to pay attention to the details. Small changes lead to big results. Virgo energy is analytical, precise, and service-oriented. The New Moon in Virgo is about refining your life, not through harsh discipline but through loving attention. What small change would improve your health? What system could you put in place to reduce chaos? The seeds you plant now for order and well-being will grow into a life that runs more smoothly. The New Moon in Virgo also asks you to serve. Service is not about sacrifice. It is about contributing your gifts in practical ways. How can you be of service today? The smallest act of kindness matters. Plant seeds of practical care. The harvest will be a life that works better, a body that feels better, a heart that is lighter.`,
  reversed: `New Moon in Virgo reversed suggests health concerns, disorganization, or perfectionism that paralyzes. You may be over-focusing on details and missing the bigger picture. The card asks you to find balance. Do what is good enough. Progress, not perfection. Your health and well-being are worth tending, but do not let the perfect be the enemy of the good.`,
});

register({
  title: "moonology|Full Moon in Pisces",
  category: "Moonology",
  keywords: ["spirituality", "dreams", "dissolution", "compassion", "surrender"],
  symbolism: "A full moon blurs behind a veil of mist and water, its edges soft and indistinct. The light seems to come from everywhere and nowhere. The scene is dreamlike, dissolving the boundaries between self and universe. Reality feels porous and sacred.",
  upright: `The Full Moon in Pisces brings spiritual and creative matters to a dreamy culmination. This is a time when the veils between worlds are thin, and you may feel more connected to the unseen. The Full Moon in Pisces asks you to surrender. Not to give up, but to let go of the need to control. Pisces energy is fluid, compassionate, and deeply connected to the divine. The Full Moon in Pisces is a powerful time for prayer, meditation, and creative inspiration. The boundaries between you and the universe soften. You may feel more emotional, more intuitive, more connected to all beings. The Full Moon in Pisces asks you to trust the flow. You are part of something vast and beautiful. You do not need to have all the answers. You do not need to be in control. Float in the infinite sea of divine love. Let yourself dissolve into the mystery. From that dissolution, you will emerge renewed. The full moon in Pisces is the completion of a cycle. Release. Surrender. Trust. The next cycle will begin in its own time.`,
  reversed: `Full Moon in Pisces reversed suggests escapism, confusion, or a loss of boundaries. You may be avoiding reality or feeling overwhelmed by the intensity of your emotions. The card asks you to find ground. The dream world is beautiful, but you must also live in this world. Ground your spiritual insights in practical action. Find the balance between heaven and earth.`,
});

register({
  title: "moonology|New Moon in Scorpio",
  category: "Moonology",
  keywords: ["transformation", "depth", "intensity", "rebirth", "power"],
  symbolism: "A new moon in a dark sky, barely visible, hangs over a dormant volcano. Beneath the surface, lava glows. The mountain appears quiet, but deep within, powerful forces are building. The scene speaks of hidden power, transformation, and the calm before the eruption.",
  upright: `The New Moon in Scorpio brings intense, transformative energy for planting seeds of deep change and personal power. This is not a surface-level new moon. It asks you to go deep. The New Moon in Scorpio is about transformation. What needs to die so something new can be born? What patterns, relationships, or beliefs have outlived their purpose? Scorpio energy is not afraid of the dark. It knows that the most profound growth happens in the shadows. The New Moon in Scorpio asks you to face your depths with courage. The seeds you plant now are planted in the rich soil of your subconscious. They will grow into profound personal power and emotional depth. The New Moon in Scorpio is also about intimacy. What would it mean to let someone see you completely? To be truly known? This is a powerful time for deepening connections and healing sexual and emotional wounds. Plant seeds of authenticity. Let yourself be seen. The darkness is fertile ground. Trust what grows there.`,
  reversed: `New Moon in Scorpio reversed suggests a fear of depth, resistance to transformation, or a refusal to let go. You may be clinging to the surface when the depths are calling. The card asks you to be brave. The transformation will happen whether you resist or not. It is easier if you surrender. Trust the process of death and rebirth.`,
});

register({
  title: "moonology|Full Moon in Taurus",
  category: "Moonology",
  keywords: ["abundance", "values", "sensuality", "completion", "stability"],
  symbolism: "A full moon rises over a bountiful harvest. Baskets of fruit and grain overflow. The moon's golden light makes the abundance look even more generous. A figure sits among the harvest, resting, satisfied. The scene speaks of completion, fullness, and earthy pleasure.",
  upright: `The Full Moon in Taurus brings matters of abundance, values, and physical well-being to a satisfying culmination. This is a time to appreciate what you have and to enjoy the fruits of your labor. The Full Moon in Taurus asks you to slow down and savor. Taurus energy is sensual, grounded, and appreciative of beauty and comfort. The Full Moon in Taurus is a time of harvest. What have you been working toward? Is it coming to fruition? Take time to appreciate your accomplishments. The Full Moon in Taurus also asks you to examine your values. What do you truly value? Not what you think you should value, but what actually matters to you. Your relationship with money, with your body, with pleasure. The full moon in Taurus invites you to enjoy the good things in life without guilt. You have earned them. The harvest is plentiful. Rest in the abundance. Appreciate your body. Enjoy your comforts. Give thanks for what you have. The fullness you feel is real. You are allowed to enjoy it.`,
  reversed: `Full Moon in Taurus reversed suggests financial concerns, stubbornness, or an inability to enjoy life. You may be holding onto things too tightly or refusing to appreciate what you have. The card asks you to loosen your grip. Abundance is not just about having more. It is about appreciating what is. Find one thing to enjoy right now. Gratitude opens the door to more.`,
});

register({
  title: "moonology|New Moon in Sagittarius",
  category: "Moonology",
  keywords: ["adventure", "faith", "expansion", "optimism", "travel"],
  symbolism: "A new moon hangs over an open road that stretches toward a distant mountain range. The road is long and the destination is far, but the traveler at the start of the road looks forward with excitement, not fear. The journey calls. The unknown beckons.",
  upright: `The New Moon in Sagittarius brings expansive, adventurous energy for planting seeds of exploration and growth. This is a time to think big. The New Moon in Sagittarius asks you to expand your horizons. Sagittarius energy is optimistic, philosophical, and hungry for meaning. What do you want to learn? Where do you want to go? What big questions are calling you? The New Moon in Sagittarius is a time for setting intentions related to travel, education, and spiritual exploration. The seeds you plant now will grow into a broader understanding of the world and your place in it. The New Moon in Sagittarius also asks you to have faith. The road is long. The destination is not yet visible. But the journey itself is the teacher. Trust that the path will reveal itself as you walk it. Plant your intentions with optimism. The universe is vast and full of possibility. Your adventure is waiting. Take the first step. The road will unfold before you.`,
  reversed: `New Moon in Sagittarius reversed suggests a lack of direction, pessimism, or a fear of expanding beyond your comfort zone. You may be playing small when you are meant to grow. The card asks you to find your faith. The world is larger than your current perspective. Dare to explore. The adventure will change you, but change is not something to fear. It is something to embrace.`,
});

register({
  title: "moonology|Full Moon in Gemini",
  category: "Moonology",
  keywords: ["communication", "duality", "social", "clarity", "connection"],
  symbolism: "A full moon hangs between two facing mirrors, creating an infinite reflection of the moon stretching into infinity on both sides. The image captures duality, reflection, and the endless conversation between opposing ideas. Communication is the bridge between them.",
  upright: `The Full Moon in Gemini brings matters of communication and connection to a point of clarity. This is a time when conversations reach their peak and decisions may be made. The Full Moon in Gemini asks you to speak your truth. You have been gathering information, weighing options, seeing both sides. Now it is time to communicate your position. Gemini energy is curious, articulate, and social. The Full Moon in Gemini brings clarity to situations that have been confusing. Both sides of the story are now visible. The Full Moon in Gemini also highlights duality. You may feel pulled in two directions. You may hold two contradictory truths. That is the nature of Gemini. The full moon asks you to integrate these opposites. Not to choose one, but to hold both in awareness. The truth is often found in the space between opposing ideas. The Full Moon in Gemini asks you to communicate with clarity, listen with curiosity, and trust the connections that are forming. Conversation is the bridge. Cross it.`,
  reversed: `Full Moon in Gemini reversed suggests miscommunication, gossip, or a failure to express your truth. You may be overwhelmed by information or unable to make a decision because you see too many sides. The card asks you to simplify. Speak directly. Listen carefully. The clarity you seek is available. Cut through the noise.`,
});

register({
  title: "moonology|New Moon in Aquarius",
  category: "Moonology",
  keywords: ["innovation", "community", "vision", "humanity", "individuality"],
  symbolism: "A new moon rises over a futuristic city where architecture blends with nature. Lights twinkle in windows. People move through the streets in harmony. Drones and birds share the sky. The scene is a vision of the future built on community and innovation.",
  upright: `The New Moon in Aquarius brings visionary energy for planting seeds of community, innovation, and collective well-being. This is a time to think about the future you want to create, not just for yourself but for everyone. The New Moon in Aquarius asks you to envision a better world. Aquarius energy is innovative, humanitarian, and future-focused. The New Moon in Aquarius is about connection. Not just personal connection, but connection to the larger web of humanity. The seeds you plant now are for collective good. What change do you want to see in the world? What community do you want to build? The New Moon in Aquarius also celebrates your unique individuality. You are part of the whole, but you are also distinctly yourself. Your differences are your contributions. The seeds you plant now for a better future are needed. The world is waiting for your vision. Dare to dream big. The future is not fixed. It is being created by the intentions we plant now. Plant yours with hope.`,
  reversed: `New Moon in Aquarius reversed suggests a sense of disconnection, feeling like an outsider, or difficulty envisioning a positive future. You may feel alienated or apathetic. The card asks you to reconnect with hope. You are not alone. Your contribution matters. Find your tribe. Plant seeds of connection. The future you want is possible, but it requires you to believe in it.`,
});

})();

/* ══════════════════════════════════════════════════
   STARSEED ORACLE (Rebecca Campbell, 53 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "starseed|You Are a Starseed",
  category: "Starseed Oracle",
  keywords: ["origin", "belonging", "cosmic identity", "home", "remembering"],
  symbolism: "A figure stands on a hilltop, arms open, looking up at a starry sky. Their body is made of the same light as the stars above. Lines of light connect their heart to specific constellations, showing that they are not separate from the cosmos. They are made of stars.",
  upright: `You are a Starseed. You came into this life with a knowing that you originated from somewhere beyond. You have always felt different, as if your home is elsewhere. This card confirms that your feeling of not belonging is not a flaw. It is a sign of your origin. You carry within you the memory of the stars. Your soul has traveled vast distances to be here, and you brought gifts from your cosmic lineage. The feeling of homesickness you carry is real, but it is also a compass pointing you toward your purpose. You are here to bring the light of your star origin into this world. The Starseed card asks you to honor your cosmic heritage. You are not broken because you do not fit in. You are on a mission. The stars are your family. The universe is your home. Remember who you are. A Starseed. A child of the cosmos. Here to shine.`,
  reversed: `You Are a Starseed reversed suggests forgetting your cosmic origins, feeling disconnected from your purpose, or struggling with the feeling of not belonging. You may be trying too hard to fit into a world that was never your true home. The card asks you to remember. You came from somewhere. Your mission matters. Reconnect with the stars. They are calling you home.`,
});

register({
  title: "starseed|The Pleiadian Gateway",
  category: "Starseed Oracle",
  keywords: ["healing", "sisterhood", "nurturing", "compassion", "star family"],
  symbolism: "A cluster of seven stars glows in a deep indigo sky. A luminous female figure stands within the star cluster, her hands extended in blessing. She wears a dress woven from nebula light. The Pleiadian energy is warm, maternal, and deeply healing.",
  upright: `The Pleiadian Gateway opens to the healing energy of the star sisters. The Pleiades have long been associated with nurturing, compassion, and the divine feminine. This card indicates a time of deep emotional healing. You are being held by a loving cosmic family that wants nothing more than to see you thrive. The Pleiadian Gateway asks you to open your heart to receive nurturing. You have been strong for too long. Allow yourself to be held. The Pleiadian energy is gentle but powerful. It heals the wounds of separation and reminds you that you are loved unconditionally. This is a time for self-care, for sisterhood, for reconnecting with the feminine aspects of your nature. The Pleiadian Gateway is also a portal for creativity. The healing you receive now will unlock creative expression. Let the love of the star sisters wash over you. You are not alone. You are deeply loved by your cosmic family. Accept their nurturing. Let it heal you.`,
  reversed: `The Pleiadian Gateway reversed suggests blocking love and nurturing, difficulty trusting feminine energy, or a disconnection from your star family. You may be rejecting the support that is being offered. The card asks you to open your heart. You are worthy of love and care. Let the Pleiadian sisters hold you. Healing is available. Accept it.`,
});

register({
  title: "starseed|The Sirian Blue",
  category: "Starseed Oracle",
  keywords: ["wisdom", "clarity", "truth", "ancient knowledge", "discipline"],
  symbolism: "A brilliant blue star shines at the center of a geometric mandala made of crystalline light. The pattern is precise, mathematical, and beautiful. The energy of Sirius is sharp, clear, and deeply wise. It cuts through illusion with the precision of a laser.",
  upright: `The Sirian Blue brings the energy of crystalline wisdom and clear sight. Sirius is associated with ancient knowledge, spiritual discipline, and the mastery of light. This card indicates a time of mental clarity and profound insight. You are being asked to see the truth of your situation with crystal clarity. The Sirian Blue energy does not tolerate illusion. It cuts through confusion with precision. This is a time for study, for discipline, for the pursuit of wisdom. Your mind is sharp. Use it well. The Sirian Blue also asks you to align your life with truth. Where have you been less than honest? Where have you been avoiding the obvious? The wisdom of Sirius demands integrity. Your thoughts, words, and actions must align. The Sirian Blue is the energy of the spiritual warrior. Not one who fights, but one who has mastered the self. Discipline, clarity, truth. These are the gifts of Sirius. Claim them. Live them. Let the blue light of wisdom guide you.`,
  reversed: `The Sirian Blue reversed suggests mental confusion, dishonesty with yourself, or a refusal to see the truth. The clarity you need is available, but you are blocking it. The card asks you to commit to honesty. The truth may be uncomfortable, but it is also freeing. Align your life with what is true. The wisdom you seek requires integrity.`,
});

register({
  title: "starseed|The Arcturian Light",
  category: "Starseed Oracle",
  keywords: ["healing", "integration", "multidimensional", "ascension", "higher self"],
  symbolism: "A figure stands within a beam of white-green light that descends from a star in the sky. The light is entering through the crown of the head and filling every cell. The figure is being recalibrated, healed, and upgraded by the gentle but powerful Arcturian energy.",
  upright: `The Arcturian Light brings the energy of multidimensional healing and integration. Arcturus is a highly evolved star system known for its advanced healing technologies and compassionate wisdom. This card indicates a time of profound healing on all levels. The Arcturian Light is working with you to integrate your higher self into your daily life. Gaps between your spiritual understanding and your human experience are being bridged. This is the energy of ascension. You are being asked to step into a higher version of yourself. The Arcturian Light heals the wounds that have kept you small. It recalibrates your energy system to hold more light. This can be intense. You may feel tired or disoriented as old patterns are released. Trust the process. The Arcturian Light knows exactly what needs to be healed and how. Your only task is to be willing. Say yes to the healing. Let the light do its work. You are being upgraded. You are becoming more of who you truly are.`,
  reversed: `The Arcturian Light reversed suggests resistance to healing, fear of ascension, or feeling stuck in old patterns. The light is available, but you are not fully opening to receive it. The card asks you to examine what you are afraid to release. The healing is gentle. The transformation is safe. Trust the process. The light is working, even if you cannot feel it. Surrender.`,
});

register({
  title: "starseed|The Andromeda Bridge",
  category: "Starseed Oracle",
  keywords: ["connection", "merging", "collaboration", "unity", "galactic family"],
  symbolism: "Two spiral galaxies begin to merge, their arms reaching toward each other across the void of space. A bridge of light forms between them, and small points of light travel across the bridge. The scene is one of cosmic reunion, of separate becoming one.",
  upright: `The Andromeda Bridge speaks of connection and collaboration across boundaries. Andromeda energy is about bringing together what has been separated. This card indicates a time of reunion, merging, and partnership. The Andromeda Bridge asks you to reach across perceived divides. The separation you perceive between yourself and others, between different parts of yourself, between the human and the divine. These separations are illusions. The Andromeda Bridge invites you to experience unity. The Andromeda Bridge is also about galactic connection. You are part of a vast interstellar family. The sense of isolation you have felt is ending. You are being connected with those who share your mission. The Andromeda Bridge asks you to collaborate. The work ahead requires partnership. You cannot do it alone. Reach out. Build bridges. The reunion is happening. The separate parts are coming together. This is the time of connection. Your galactic family is reaching out. Take their hand. The bridge is built. Cross it.`,
  reversed: `The Andromeda Bridge reversed suggests isolation, disconnection, or a refusal to collaborate. You may be trying to go it alone when partnership is needed. The card asks you to reach out. The bridges are available, but you must cross them. You are not meant to do this alone. Connection is your next step. Take it.`,
});

register({
  title: "starseed|The Lyrans",
  category: "Starseed Oracle",
  keywords: ["leadership", "pioneer", "originality", "courage", "first"],
  symbolism: "A powerful blue-white star pulses at the center of a nebula shaped like a great winged lion. The figure of a warrior stands before the star, holding a spear of light. The Lyran energy is original, courageous, and fiercely independent. They were among the first.",
  upright: `The Lyrans are the pioneers, the originals, the ones who dared to go first. This card speaks of your pioneering spirit and your ability to lead where others have not yet gone. The Lyran energy is courageous and fiercely independent. You are being called to lead. Not by following a path that already exists, but by creating one. The Lyrans were among the first civilizations in this galaxy. They did not have models to follow. They invented. They explored. They led. This is your energy now. The Lyran card asks you to trust your originality. Your ideas are valid. Your vision is real. Do not wait for permission to create the life you want. The Lyran energy is also about protection. You are being protected as you pioneer. The universe has your back. The Lyran card asks you to be brave. You are not alone. Your ancestors in the stars walk with you. Lead with courage. Create with confidence. You are a pioneer. The path you forge is for others to follow. Go first. Show the way.`,
  reversed: `The Lyrans reversed suggests a loss of courage, fear of standing out, or a reluctance to take the lead. You may be following when you are meant to forge. The card asks you to find your bravery. Your unique path is waiting. You do not need permission to be who you are. Lead the way. Your courage will inspire others.`,
});

register({
  title: "starseed|Earth Keeper",
  category: "Starseed Oracle",
  keywords: ["grounding", "nature", "service", "incarnation", "presence"],
  symbolism: "A figure stands with their feet planted on the earth, hands reaching down to touch the soil. Their body is rooted like a tree. Stars shine above them, but their focus is on the earth beneath. They are the bridge between the stars and the soil, a keeper of both worlds.",
  upright: `Earth Keeper honors your commitment to being fully present in your human body on this planet. You came from the stars, but you chose to be here now. This card asks you to honor that choice by being fully present in your body and on this earth. The Earth Keeper energy is grounding and stabilizing. You have been given the task of holding light on this planet. Your presence matters. The Earth Keeper card asks you to connect with nature. Walk on the earth. Tend a garden. Hug a tree. Your starseed energy needs grounding. Without it, you feel unmoored, scattered, unable to bring your gifts fully into form. The Earth Keeper reminds you that you are not here to escape the earth. You are here to serve it. Your cosmic gifts are needed on this planet. Root yourself. Be here fully. The Earth Keeper is the one who remembers that spirit and matter are not separate. You are both Star and Earth. Honor both. Serve both. Be the bridge.`,
  reversed: `Earth Keeper reversed suggests disconnection from nature, difficulty grounding, or a desire to escape the physical world. You may be spending too much time in your head or in spiritual realms and neglecting your body and the earth. The card asks you to come back to your body. Touch the earth. Your mission requires you to be present here. You cannot serve from a distance. Plant your feet on the ground.`,
});

register({
  title: "starseed|Cosmic Inheritance",
  category: "Starseed Oracle",
  keywords: ["gifts", "talents", "purpose", "birthright", "soul tools"],
  symbolism: "A figure stands before a treasure chest made of starlight. When they open it, light pours out containing symbols of their unique gifts: a paintbrush, a healing hand, a book, a compass, a musical note. The chest is their inheritance. The gifts are theirs by birthright.",
  upright: `Cosmic Inheritance reveals the unique gifts your soul brought with it into this life. You did not come here empty-handed. You came with a toolbox of talents, wisdom, and abilities that are yours alone. This card asks you to recognize and claim your inheritance. Your gifts are not accidental. They are your soul tools, given to you to fulfill your mission. The Cosmic Inheritance card asks you to stop comparing your gifts to others'. Your inheritance is unique to you. The Cosmic Inheritance is also about abundance. You have been given everything you need to fulfill your purpose. There is no lack. There is only the unclaimed treasure of your own potential. What gifts have you been hiding? What talents have you dismissed as unimportant? Your Cosmic Inheritance is waiting for you to open it. Claim your gifts. Use them boldly. They are not for you alone. They are for the world. Your inheritance is your contribution. Open the chest. The treasure is yours.`,
  reversed: `Cosmic Inheritance reversed suggests unclaimed gifts, self-doubt about your talents, or a refusal to accept your own worth. You may be downplaying your abilities or comparing yourself unfavorably to others. The card asks you to recognize your unique value. Your gifts are real. They are yours by birthright. Claim them. The world needs what only you can offer. Do not hide your inheritance.`,
});

register({
  title: "starseed|Star Navigator",
  category: "Starseed Oracle",
  keywords: ["guidance", "inner knowing", "direction", "trust", "navigation"],
  symbolism: "A figure stands at the helm of a ship made of light, sailing through a sea of stars. A compass made of constellations glows in their hand. The ship knows where it is going, not because of an external map, but because the navigator trusts their inner guidance.",
  upright: `Star Navigator speaks to your innate ability to navigate by your inner compass. You have an internal guidance system that is more reliable than any external map. This card asks you to trust it. You know where you are going. You have always known. The Star Navigator energy is about trust. Trust that you are being guided. Trust that the signs you are receiving are real. Trust that you can find your way, even through unknown territory. The Star Navigator does not need to see the entire journey. They trust the next step. The Star Navigator card also speaks of your ability to guide others. You have a natural gift for navigation, for seeing the path when others cannot. Your clarity is a gift to those around you. The Star Navigator asks you to trust your inner knowing. You are not lost. You are exactly where you need to be, navigating exactly as you should. The stars are within you. Let them guide you home.`,
  reversed: `Star Navigator reversed suggests feeling lost, doubting your inner guidance, or relying too heavily on external direction. You may be seeking answers outside yourself when the guidance you need is within. The card asks you to turn inward. Your compass still works. You just need to trust it. Quiet the noise and listen. The way is clear.`,
});

register({
  title: "starseed|Light Language",
  category: "Starseed Oracle",
  keywords: ["communication", "symbol", "frequency", "beyond words", "download"],
  symbolism: "Geometric symbols and patterns float in the air around a figure, flowing from their hands and mouth like visible sound. The symbols are not from any known language. They are direct transmissions of light and frequency, bypassing the mind and speaking to the soul.",
  upright: `Light Language is the communication that happens beyond words. It is the transmission of frequency, symbol, and direct knowing that bypasses the rational mind. This card indicates that you are receiving information that cannot be put into ordinary words. Trust it. Light Language may come to you through dreams, through symbols, through sudden knowing. It may come through channeled writing, drawing, or sound. The Light Language card asks you to be open to non-verbal communication. Not everything needs to be understood with the mind. Your soul understands. The Light Language is also about expression. You have a unique way of communicating that transcends words. Trust your unconventional expression. Your symbols are valid. Your sounds are sacred. Light Language card is a reminder that you are a transmitter. You are receiving cosmic information and transmitting it into the world. Do not judge the form it takes. Let it flow. The frequency you carry is more important than the words you speak. Let the light speak through you.`,
  reversed: `Light Language reversed suggests difficulty expressing yourself, feeling misunderstood, or blocking the flow of cosmic communication. You may be trying too hard to make sense of something that is meant to be felt, not analyzed. The card asks you to relax. Not everything needs to be understood. Let the transmission flow through you without judgment. The meaning will become clear in its own time.`,
});

register({
  title: "starseed|The Star Portals",
  category: "Starseed Oracle",
  keywords: ["threshold", "opportunity", "activation", "transition", "cosmic timing"],
  symbolism: "A circle of standing stones on a hilltop, each stone aligned with a specific star. Between the stones, the air shimmers, and portals of light open. A figure stands at the threshold of one portal, ready to step through. The timing is cosmic. The threshold is open.",
  upright: `Star Portals indicates that a cosmic gateway is open before you. This is a time of heightened opportunity and spiritual activation. The veils between dimensions are thin. The universe is offering you a threshold to cross. Star Portals ask you to recognize the significance of this moment. The timing is not random. You are being given an opportunity to move to a new level of your journey. The portal will not stay open forever. The Star Portals energy is about readiness. Are you ready to step through? The portal may require you to leave behind what no longer serves you. The Star Portals card also asks you to trust cosmic timing. The portal opens when you are ready, not when you think you should be ready. The universe has been preparing you for this threshold. You are ready. The portal is open. Step through. The other side holds what you have been seeking. The timing is now. Trust it. Cross the threshold. Your next level awaits.`,
  reversed: `Star Portals reversed suggests a missed opportunity, a portal that has closed, or a fear of stepping through. You may have hesitated too long, or the timing may not yet be right. The card asks you to be patient. There will be other portals. Learn from this one and prepare for the next. When the doorway opens again, do not hesitate. Step through.`,
});

register({
  title: "starseed|Cosmic Heart",
  category: "Starseed Oracle",
  keywords: ["love", "compassion", "unity", "heart-centered", "connection"],
  symbolism: "A figure stands with their hands over their heart, which glows with a warm golden light. From their heart, beams of light extend in all directions, connecting to the hearts of others across the planet. The image shows that the heart is a cosmic organ, connecting all beings.",
  upright: `Cosmic Heart speaks of the love that connects all beings across space and time. Your heart is not just a physical organ. It is a cosmic receiver and transmitter of love. This card asks you to open your heart to the love that is your true nature. The Cosmic Heart card indicates a time of heart-centered connection. You are being called to lead with love. Not romantic love, but the universal love that recognizes the divine in all beings. The Cosmic Heart is also about healing. Your heart has been wounded, but it is also infinitely capable of healing. The Cosmic Heart card asks you to let love in. You have been protecting your heart for good reason, but the walls you built are now keeping out the love you need. The Cosmic Heart asks you to trust again. Not blindly, but wisely. Your heart knows the difference between love that is safe and love that is not. The Cosmic Heart card reminds you that love is the highest frequency. It is your origin and your destination. Open your heart. Let the cosmic love flow through you. You are love. You are loved. Never forget.`,
  reversed: `Cosmic Heart reversed suggests a closed heart, fear of love, or a disconnection from the universal love that connects all beings. You may be protecting yourself from hurt by shutting down emotionally. The card asks you to consider the cost of that protection. Your heart wants to open. It is safe to love. Let the walls come down, one brick at a time.`,
});

register({
  title: "starseed|The Oracle of the Stars",
  category: "Starseed Oracle",
  keywords: ["prophecy", "vision", "divination", "cosmic wisdom", "channel"],
  symbolism: "A figure sits in a circle of candles under a starry sky, a crystal sphere before them. The stars above are reflected in the sphere, and images form within the crystal. The figure is a channel for the wisdom of the stars, translating cosmic messages into human understanding.",
  upright: `The Oracle of the Stars is a card of prophecy and cosmic vision. You are being asked to open yourself as a channel for messages from the stars. The wisdom of the cosmos wants to flow through you. The Oracle of the Stars card indicates that you have a gift for divination and spiritual sight. Trust the visions you receive. Trust the knowing that comes without explanation. The Oracle of the Stars card also speaks to your role as a messenger. You are being asked to share what you receive. Not everyone will understand your visions. That is okay. Your role is to transmit, not to convince. The Oracle of the Stars asks you to trust your connection to the cosmos. The messages you receive are real. The guidance is accurate. You are a bridge between the stars and the earth. The Oracle of the Stars walks between worlds. Claim your role as a seer, a channel, a translator of cosmic wisdom. The stars speak through you. Listen. Translate. Share. Your visions matter.`,
  reversed: `The Oracle of the Stars reversed suggests blocked intuition, distrust of your visions, or messages that are not coming through clearly. You may be doubting your psychic abilities or dismissing your inner knowing. The card asks you to trust your connection. The channel is not broken. You have simply stopped listening. Quiet your mind. Open your heart. The messages are still flowing. Receive them.`,
});

register({
  title: "starseed|The New Earth",
  category: "Starseed Oracle",
  keywords: ["future", "hope", "creation", "consciousness", "paradigm shift"],
  symbolism: "A vision of a world transformed: cities integrated with nature, people living in harmony, light bathing everything in a golden glow. Children play freely. Animals approach without fear. The image is of a future that is possible, a world healed by conscious choice.",
  upright: `The New Earth is a vision of what is possible when humanity awakens. This card carries the energy of hope, transformation, and the active creation of a better world. You are being asked to be a builder of the New Earth. The New Earth card is not about escaping this world for a better one. It is about transforming this world into a better one. You are part of the shift. Your choices matter. Your consciousness matters. Every act of love, every moment of presence, every choice for compassion helps build the New Earth. The New Earth card asks you to hold the vision. Even when the world seems dark, the vision of what is possible keeps the light alive. The New Earth card is also a reminder that the future is not fixed. It is being created now, by all of us, together. The New Earth is not a distant dream. It is a possibility that becomes more real with every conscious choice. Choose love. Choose compassion. Choose the world you want to live in. The New Earth is being built, one heart at a time. Be a builder.`,
  reversed: `The New Earth reversed suggests hopelessness, cynicism, or a belief that change is impossible. You may be discouraged by the state of the world or doubting that your actions matter. The card asks you to find hope. The New Earth is still possible. Your choices matter more than you know. Do not give up. The shift is happening, even if you cannot see it. Keep building the vision. Hope is the foundation of the New Earth.`,
});

register({
  title: "starseed|Ancestors of Light",
  category: "Starseed Oracle",
  keywords: ["lineage", "guidance", "protection", "galactic family", "remembering"],
  symbolism: "A procession of luminous beings walks through a starry landscape. They are the ancestors of light, your cosmic lineage. One of them turns and extends a hand toward the viewer. They have been watching. They have been waiting. They are ready to guide you.",
  upright: `Ancestors of Light reveals that you are supported by a lineage that extends beyond this planet. Your cosmic ancestors are real. They have been watching over you, guiding you, waiting for you to remember them. The Ancestors of Light card asks you to call on your star family. They are available to you. They want to help. The Ancestors of Light are not bound by time or space. They exist in higher dimensions and can offer guidance, protection, and support. The Ancestors of Light card indicates that you are not alone in your mission. You have a vast family of light beings who are invested in your success. The Ancestors of Light card also asks you to honor your lineage. You come from a long line of light beings. Your heritage is cosmic. Your blood is made of stars. The Ancestors of Light ask you to remember who you are and who sent you. You are here on purpose. You are supported. Call on your ancestors of light. They have been waiting to hear from you.`,
  reversed: `Ancestors of Light reversed suggests forgetting your cosmic lineage, feeling unsupported, or a disconnection from your spiritual heritage. The guidance is still available, but you are not tuning in. The card asks you to reach out. Your ancestors of light are waiting. They have not abandoned you. Call on them. The connection is still there. You only need to remember.`,
});

register({
  title: "starseed|Star Child",
  category: "Starseed Oracle",
  keywords: ["innocence", "wonder", "new beginnings", "purity", "potential"],
  symbolism: "A newborn star glows in a cosmic cradle of nebula gas and dust. The star is small but intensely bright, full of potential. It has just been born, and its entire life stretches before it. The scene captures the miracle of new life, cosmic and innocent.",
  upright: `Star Child celebrates the innocence, wonder, and pure potential of new beginnings. You are being born into a new phase of your journey. Approach it with the openness of a child. The Star Child card asks you to release your cynicism and embrace wonder. The universe is full of magic. You have forgotten how to see it. The Star Child reminds you to look with fresh eyes. The Star Child card is also about new projects, new relationships, new phases of life. Something is being born. Handle it with care. The Star Child energy is tender and vulnerable. It needs protection and nurturing. The Star Child card asks you to protect the new beginnings in your life. Do not expose them to harsh criticism too soon. Let them grow strong in the safety of your belief. The Star Child is the part of you that still believes in magic, that still gets excited, that still dares to hope. Let that part of you lead. The Star Child knows how to find joy. Follow them. The universe is full of wonder. Open your eyes and see.`,
  reversed: `Star Child reversed suggests lost innocence, cynicism, or a new beginning that has been damaged or neglected. You may be protecting yourself from disappointment by refusing to hope. The card asks you to find one small thing to wonder at today. The magic is still there. You have only forgotten how to see it. Let yourself believe again.`,
});

register({
  title: "starseed|Mission of the Soul",
  category: "Starseed Oracle",
  keywords: ["purpose", "calling", "destiny", "service", "why you are here"],
  symbolism: "A figure stands at the center of a cosmic compass, with arrows pointing in the cardinal directions. Above them, their soul contract appears as a scroll of light, written in symbols that glow. The figure is aligned with their purpose. They know why they came.",
  upright: `Mission of the Soul reveals that you are here for a reason. Your life has purpose, even when you cannot see it. This card asks you to trust that your mission exists and that you are fulfilling it, even when it does not look like you expected. The Mission of the Soul card is not about grand destiny. It is about the unique contribution that only you can make. Your mission is woven into the fabric of who you are. The Mission of the Soul card asks you to stop searching for your purpose as if it is hidden. Your purpose is what you are already doing, what you are called to, what brings you alive. Your mission does not have to be visible to the world. It may be quiet, personal, and deeply meaningful. The Mission of the Soul card asks you to trust that you are exactly where you need to be. Your soul chose this life, this time, this mission. You have not failed. You have not missed your calling. Your mission is unfolding perfectly. Trust it. Live it. Your soul's mission is the reason you are here. Honor it by being fully present in your life.`,
  reversed: `Mission of the Soul reversed suggests feeling lost, questioning your purpose, or believing you have missed your calling. You may be comparing your path to others or waiting for a sign that has already come. The card asks you to trust that your purpose is not lost. You are living it, even when you cannot see it. Relax. Your mission is unfolding. You are exactly where you need to be.`,
});

register({
  title: "starseed|The Star Council",
  category: "Starseed Oracle",
  keywords: ["guidance", "collective wisdom", "higher authority", "council", "consultation"],
  symbolism: "A council of twelve luminous beings sits in a semicircle around a central pillar of light. Each being represents a different star system. They are wise, ancient, and benevolent. An empty seat awaits the one who has come to seek their counsel. The council is in session.",
  upright: `The Star Council appears when you need guidance from the highest authority. This card indicates that you are being supported by a collective of wise beings who oversee your evolution. The Star Council is available to you. Ask your questions. Seek their counsel. The Star Council card asks you to remember that you have access to wisdom far beyond your human understanding. The Star Council is not a distant authority. It is a resource. Call on them when you need clarity, when you need confirmation, when you need to know you are on the right path. The Star Council card also speaks of your place in the cosmic order. You are being prepared for greater responsibility. The council sees your potential. They are guiding you toward your next level of service. The Star Council asks you to trust their guidance. The wisdom they offer is for your highest good. The council is in session. They are waiting for your question. Ask. Listen. Receive. The guidance you need is available. Trust it.`,
  reversed: `The Star Council reversed suggests difficulty receiving guidance, doubting the wisdom available to you, or feeling disconnected from your spiritual support system. The council is still there. You are not tuning in. The card asks you to quiet your mind and open to receive. The guidance is available. Ask your question and listen. The council is waiting.`,
});

register({
  title: "starseed|Galactic Heart",
  category: "Starseed Oracle",
  keywords: ["unity", "compassion", "oneness", "interconnection", "universal love"],
  symbolism: "A figure floats in space, their heart chakra glowing with brilliant light. From their heart, threads of light connect them to galaxies, stars, and other beings across the cosmos. They are not separate from the universe. They are its heart beating.",
  upright: `Galactic Heart is the recognition that you are not separate from the cosmos. You are the universe experiencing itself. Your heart beats in rhythm with the galaxies. The love you feel is the love of the cosmos loving through you. The Galactic Heart card asks you to expand your sense of self beyond your body. You are not a drop in the ocean. You are the entire ocean in a drop. The Galactic Heart card is about unity consciousness. The separation you perceive between yourself and others is an illusion. The Galactic Heart card asks you to live from this truth. When you act from your Galactic Heart, you act with the wisdom that harming another is harming yourself. Helping another is helping yourself. The Galactic Heart is also about compassion. The suffering of the world is your suffering. The joy of the world is your joy. The Galactic Heart card asks you to hold both with love. You are vast. You are connected. You are the heart of the galaxy. Let that heart lead. Love without limits. Connect without fear. The universe is your body. Your heart is its heart. Let it beat.`,
  reversed: `Galactic Heart reversed suggests a sense of separation, disconnection from others, or difficulty feeling compassion. You may be feeling isolated or believing that you are alone. The card asks you to remember your connection. You are not separate. The heart of the galaxy beats within you. Open to the connection. You are part of the whole.`,
});

register({
  title: "starseed|Starseed Awakening",
  category: "Starseed Oracle",
  keywords: ["awakening", "remembrance", "activation", "awareness", "consciousness shift"],
  symbolism: "A figure lies sleeping on the earth. Above them, their star self descends in a column of light, merging with their physical form. The moment of awakening is happening. The figure's eyes are opening. They are remembering who they are and why they came.",
  upright: `Starseed Awakening is the moment of remembrance. The veil is lifting. You are remembering who you truly are and why you came to this planet. This card indicates a profound shift in consciousness. The Starseed Awakening card is a powerful activation. Your DNA is being upgraded. Your perception is expanding. You are waking up from the dream of separation. The Starseed Awakening card asks you to be gentle with yourself during this process. Awakening can be disorienting. You may feel caught between worlds, no longer fully asleep but not yet fully awake. That is okay. The awakening is happening in its own time. The Starseed Awakening card also asks you to integrate your awakening into daily life. Spiritual awakening is not about escaping the world. It is about seeing the world more clearly. Starseed Awakening is the beginning of your conscious mission. You are waking up to fulfill your purpose. Welcome. The journey of awakening is underway. You are not alone. Many are waking up with you. Together, you will remember. Together, you will fulfill your mission. The awakening is here. Breathe it in. Let it transform you.`,
  reversed: `Starseed Awakening reversed suggests resistance to awakening, fear of the changes it brings, or a delay in your spiritual rememberance. You may be feeling the call but hesitating to answer. The card asks you to trust the process. The awakening will happen in its own time. You cannot force it, but you can stop resisting. Open to the shift. It is safe to wake up.`,
});

})();

/* ══════════════════════════════════════════════════
   SACRED REBELS ORACLE (Alana Fairchild, 44 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "sacred-rebels|Sacred Rebel",
  category: "Sacred Rebels Oracle",
  keywords: ["authenticity", "courage", "nonconformity", "freedom", "truth"],
  symbolism: "A figure stands on a cliff edge, arms spread, facing the wind. They wear a crown of wildflowers and carry a staff. Behind them, a path they forged themselves winds through untamed land. They did not follow the well-worn road. They made their own.",
  upright: `The Sacred Rebel is the archetype of the one who dares to be authentic in a world that demands conformity. You are being called to stand in your truth, even if it means standing alone. The Sacred Rebel does not rebel for the sake of rebellion. They rebel because they must. The cost of pretending is too high. The Sacred Rebel card appears when you are being asked to break the rules that have kept you small. Not all rules are meant to be followed. Some are cages disguised as safety. The Sacred Rebel card asks you to examine the rules you have internalized. Whose voice told you that you must be a certain way to be accepted? The Sacred Rebel gives you permission to be yourself, fully and unapologetically. The Sacred Rebel walks a path of their own making. The ground beneath their feet is not solid because others have walked it. It is solid because they trust their steps. You are the sacred rebel. Trust your path. It is yours alone. Walk it with courage.`,
  reversed: `Sacred Rebel reversed suggests conformity, fear of standing out, or playing small to fit in. You may be hiding your true self to avoid rejection. The card asks you to examine the cost of your conformity. Your soul is a rebel. It cannot be tamed. Let it be wild. Let it be free. You were not born to fit in. You were born to stand out.`,
});

register({
  title: "sacred-rebels|Divine Unconditional Love",
  category: "Sacred Rebels Oracle",
  keywords: ["love", "acceptance", "compassion", "divine mother", "unconditional"],
  symbolism: "A woman stands with her arms wrapped around herself, but the light surrounding her suggests she is being held by something larger. A radiant feminine presence behind her holds her with infinite tenderness. The love is not earned. It simply is.",
  upright: `Divine Unconditional Love is the love that does not require you to be anything other than what you are. It does not judge. It does not withhold. It does not keep score. This card asks you to open to this love. You do not have to earn it. You do not have to be good enough. You are already held. The Divine Unconditional Love card appears when you need to remember that you are loved beyond measure. Not for your achievements, not for your efforts, but simply because you exist. This love is the fabric of the universe itself. You are wrapped in it, even when you cannot feel it. The Divine Unconditional Love card asks you to let this love in. Let it heal the wounds of conditional love you have experienced. You are worthy of love that does not demand you be different. You are worthy of love that sees all of you and does not turn away. Divine Unconditional Love is your birthright. Open to it. Let it fill you. Let it heal you. You are love. You are loved. Always.`,
  reversed: `Divine Unconditional Love reversed suggests difficulty receiving love, feeling unworthy, or believing you must earn love. The love is there, but you are not letting it in. The card asks you to examine the walls around your heart. You are worthy of unconditional love. You do not need to earn it. Open your heart. Let yourself be held. The love is real. You are worthy of it.`,
});

register({
  title: "sacred-rebels|Wild Free Being",
  category: "Sacred Rebels Oracle",
  keywords: ["freedom", "authenticity", "nature", "instinct", "untamed"],
  symbolism: "A figure runs through a meadow, hair flying, clothes loose, barefoot. They are not running from anything. They are running for the joy of running. Animals run alongside them. The sky is open. The land is open. The being is free.",
  upright: `Wild Free Being is the call to reclaim your natural state of freedom. You were not born to be caged. You were born to run wild, to follow your instincts, to be true to your nature. The Wild Free Being card appears when you have been contained for too long. The expectations, responsibilities, and fears that have kept you tethered are ready to be released. The Wild Free Being asks you to return to your natural state. Wild Free Being is not about irresponsibility. It is about authenticity. The wild knows how to care for itself. It survives. It thrives. The Wild Free Being card asks you to trust your instincts. Your body knows what it needs. Your spirit knows where it wants to go. The Wild Free Being card also asks you to reconnect with nature. The natural world is your home. Walk barefoot. Breathe fresh air. Remember that you are part of the earth. The Wild Free Being is not lost. It has been waiting for you to remember. Take off your shoes. Feel the ground beneath your feet. You are free. Run.`,
  reversed: `Wild Free Being reversed suggests feeling caged, over-domesticated, or disconnected from your natural self. You may be trapped by responsibilities or expectations that are not truly yours. The card asks you to identify what is containing you. The cage may have no bars. The freedom is available. You only need to claim it. One wild act will remind you who you are.`,
});

register({
  title: "sacred-rebels|Soul Purpose",
  category: "Sacred Rebels Oracle",
  keywords: ["calling", "destiny", "mission", "meaning", "fulfillment"],
  symbolism: "A figure stands at a crossroads, but unlike the traditional crossroads, they are not confused. They know which path is theirs. One path is worn by many feet. The other is overgrown, barely visible. Their hand rests over their heart, and their face shows certainty.",
  upright: `Soul Purpose is not something you find. It is something you recognize. Your purpose is woven into the fabric of your being. It is what makes you come alive. The Soul Purpose card appears when you are being asked to commit to your path. The Soul Purpose card asks you to stop waiting for permission. Your purpose does not require external validation. The Soul Purpose card also asks you to trust that your purpose is unfolding. You do not need to see the whole picture. You only need to take the next step that feels true. The Soul Purpose card is a confirmation that you are on the right path. The doubts you have are not signs that you are wrong. They are the growing pains of stepping into your purpose. Keep going. Your soul's purpose is the reason you are here. Do not abandon it for the safety of the well-worn path. The overgrown trail is yours. Walk it.`,
  reversed: `Soul Purpose reversed suggests feeling lost, questioning your path, or abandoning your calling. You may be comparing your purpose to others' or waiting for a sign that has already come. The card asks you to return to what makes you come alive. Your purpose is not lost. It is waiting for you to recommit. The trail is still there. Pick up where you left off.`,
});

register({
  title: "sacred-rebels|Divine Mother",
  category: "Sacred Rebels Oracle",
  keywords: ["nurturing", "protection", "compassion", "feminine", "unconditional love"],
  symbolism: "A luminous maternal figure, vast and radiant, cradles the earth in her arms. Her face is serene. Her love is infinite. She is the mother of all things, and every being on the planet is held in her unconditional embrace.",
  upright: `Divine Mother appears when you need to be held, nurtured, and reminded that you are safe. She is the universal mother who loves without condition and protects without smothering. The Divine Mother card asks you to rest in her arms. You have been trying to be strong, to hold everything together, to take care of everyone. The Divine Mother card reminds you that you are also a child of the universe. You are allowed to be held. The Divine Mother card asks you to nurture yourself as she would nurture you. Tenderly, patiently, without judgment. The Divine Mother is also within you. You have the capacity to nurture yourself and others with the same unconditional love she offers. The Divine Mother card asks you to trust that you are held. You are not alone. You have never been alone. The mother of all things holds you in her heart. Rest in that holding. Let yourself be loved. You are safe in the arms of the Divine Mother.`,
  reversed: `Divine Mother reversed suggests a lack of nurturing, feeling un-mothered, or difficulty accepting love and care. You may be pushing away the support that is available. The card asks you to open to the mother's love. You are worthy of care. You are worthy of tenderness. Let yourself be held. The Divine Mother has not abandoned you. She is waiting for you to turn toward her.`,
});

})();

/* ══════════════════════════════════════════════════
   KEEPERS OF THE LIGHT (Kyle Gray, 45 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "keepers-of-the-light|Archangel Michael",
  category: "Keepers of the Light",
  keywords: ["protection", "courage", "strength", "truth", "boundaries"],
  symbolism: "A towering angelic figure in armor of blue and gold holds a sword of brilliant light. His wings spread wide, shimmering with protective energy. He does not threaten. He stands guard. His presence is a fortress. Where he stands, darkness cannot enter.",
  upright: `Archangel Michael appears to offer you his protection and courage. He is the guardian of truth and the defender of the faithful. When this card appears, you are being protected on all levels. Archangel Michael asks you to release your fear. You are not alone. The sword of truth cuts through illusion and falsehood. Archangel Michael asks you to stand in your truth with courage. You have nothing to fear. Archangel Michael also helps you set boundaries. He teaches you to protect your energy and say no to what does not serve you. Archangel Michael appears when you need to be brave. The situation you are facing may feel overwhelming, but you have the strength to handle it. Archangel Michael walks beside you. His sword is drawn. His shield is raised. You are protected. Call on Archangel Michael when you need courage. He will answer. His presence is real. His protection is absolute. Trust in the light that guards you.`,
  reversed: `Archangel Michael reversed suggests a lack of protection, fear that is overwhelming, or difficulty standing in your truth. You may be feeling vulnerable or exposed. The card asks you to call on Archangel Michael for protection. He will not fail you. You are not alone. Ask for help. It is already on its way.`,
});

register({
  title: "keepers-of-the-light|Archangel Raphael",
  category: "Keepers of the Light",
  keywords: ["healing", "health", "compassion", "restoration", "emerald light"],
  symbolism: "An angelic figure bathed in emerald green light stands with hands extended over a figure lying below. Green light streams from their hands, filling the reclining figure with healing energy. The atmosphere is calm, safe, and deeply restorative.",
  upright: `Archangel Raphael is the angel of healing. His emerald green light brings restoration to body, mind, and spirit. When this card appears, healing is available to you. Archangel Raphael asks you to open to his healing energy. He is a divine physician, working with the highest good of all beings. Archangel Raphael assists with physical healing, emotional release, and spiritual renewal. Archangel Raphael appears when you need to tend to your health or when someone you love needs healing. Archangel Raphael also guides healers and those in healing professions. If you are called to be a healer, this card confirms your path. Archangel Raphael asks you to trust in the healing process. The body knows how to heal. The spirit knows how to restore. Archangel Raphael supports these natural processes. Open to his emerald light. Let it fill you with healing. Whether you are healing from illness, grief, or spiritual exhaustion, Archangel Raphael is with you. His light is gentle but powerful. Trust in his healing presence. You are being restored.`,
  reversed: `Archangel Raphael reversed suggests blocks to healing, health concerns that are not resolving, or a need to seek additional support. The healing is available, but there may be resistance. The card asks you to examine your beliefs about healing. Are you holding onto something that needs to be released? Archangel Raphael offers his light. Open to receive it.`,
});

register({
  title: "keepers-of-the-light|Archangel Gabriel",
  category: "Keepers of the Light",
  keywords: ["communication", "truth", "creativity", "announcement", "new beginning"],
  symbolism: "An angelic figure with golden-white wings holds a golden trumpet to their lips. Light emanates from the trumpet in waves of sound. The message being delivered is one of hope, new beginnings, and divine communication. The annunciation is happening now.",
  upright: `Archangel Gabriel is the messenger angel. He brings news, inspiration, and the call to creative expression. When this card appears, you are being asked to communicate your truth. Archangel Gabriel supports writers, artists, teachers, and all who share wisdom through words. Archangel Gabriel appears when you have a message to deliver. It may be a creative project, a difficult conversation, or a truth that needs to be spoken. Archangel Gabriel gives you the courage and clarity to express yourself. Archangel Gabriel also announces new beginnings. Like the angel who announced the birth of Christ, Gabriel heralds the birth of something new in your life. Archangel Gabriel asks you to trust your voice. What you have to say matters. Your creative expression is a gift to the world. Do not hide it. Archangel Gabriel sounds the trumpet. The message is ready. Are you ready to deliver it? Trust the words that come through you. They are not yours alone. They are divinely guided. Speak them. Write them. Share them. The world is waiting for your message.`,
  reversed: `Archangel Gabriel reversed suggests difficulty communicating, creative blocks, or a message that is not being delivered. You may be holding back your truth or avoiding a conversation that needs to happen. The card asks you to find your voice. Your message matters. Do not let fear silence you. Archangel Gabriel will help you find the words. Speak.`,
});

register({
  title: "keepers-of-the-light|Archangel Uriel",
  category: "Keepers of the Light",
  keywords: ["wisdom", "clarity", "truth", "illumination", "intellect"],
  symbolism: "An angelic figure holds a radiant golden lantern high, illuminating a dark path. Their wings are flecked with amber light. The light from the lantern reveals what was hidden. Their expression is calm, knowing. They are the light that shows the way.",
  upright: `Archangel Uriel is the angel of wisdom and illumination. His golden light brings clarity to confusion and reveals the truth in any situation. When this card appears, you are being given the gift of clear sight. Archangel Uriel helps you see through the fog. Archangel Uriel appears when you need answers, when you need to understand a complex situation, or when you need the wisdom to make a right decision. Archangel Uriel helps you access your inner knowing. Archangel Uriel also protects the earth and its natural resources. He is connected to the elemental world and to the wisdom of nature. Archangel Uriel asks you to seek wisdom. Read, study, learn. But also trust your inner knowing. The lantern of Uriel illuminates both external knowledge and internal truth. Archangel Uriel appears when you are ready to see clearly. The light is here. The truth is revealed. Trust what you see. Trust what you know. Archangel Uriel's light does not deceive. It illuminates. The path forward is now visible. Walk it with confidence.`,
  reversed: `Archangel Uriel reversed suggests confusion, a lack of clarity, or a refusal to see the truth. The light is available, but you are not opening your eyes. The card asks you to seek clarity. The answers are available. Archangel Uriel offers his lantern. Take it. Let the light reveal what you need to see. The truth will set you free.`,
});

register({
  title: "keepers-of-the-light|Archangel Jophiel",
  category: "Keepers of the Light",
  keywords: ["beauty", "joy", "positivity", "creativity", "inspiration"],
  symbolism: "An angel bathed in soft pink and rose-gold light floats among blooming cherry blossoms. Their wings are made of petals and light. Beauty radiates from them in waves. Wherever they look, flowers bloom, colors brighten, and joy increases.",
  upright: `Archangel Jophiel is the angel of beauty and joy. She helps you see the beauty in yourself, in others, and in the world around you. When this card appears, you are being asked to find the beauty in your life. Archangel Jophiel lifts your spirits and helps you focus on the positive. Archangel Jophiel appears when you need a perspective shift. The situation may not have changed, but your perception can. Archangel Jophiel helps you see the silver lining, the hidden beauty, the reason to smile. Archangel Jophiel also supports creative endeavors. She inspires artists, designers, and anyone creating beauty in the world. Archangel Jophiel asks you to surround yourself with beauty. Declutter your space. Add flowers. Play music. Wear colors that make you happy. Beauty is not superficial. It is food for the soul. Archangel Jophiel reminds you that you are beautiful. Not despite your flaws, but because of them. Your unique beauty is a gift to the world. Let it shine. Let joy fill your heart. Archangel Jophiel is with you, bringing beauty and light. Open your eyes to the beauty around you. It is everywhere.`,
  reversed: `Archangel Jophiel reversed suggests negativity, ugliness, or a refusal to see the beauty in life. You may be stuck in a negative perspective that is coloring everything gray. The card asks you to shift your focus. There is beauty here. There is joy available. Archangel Jophiel asks you to look for it. Find one beautiful thing. Let it lift your spirits.`,
});

register({
  title: "keepers-of-the-light|Archangel Chamuel",
  category: "Keepers of the Light",
  keywords: ["love", "relationships", "peace", "connection", "heart healing"],
  symbolism: "An angelic being surrounded by rose-colored light holds a glowing heart in their hands. Their wings are soft pink, edged with gold. The atmosphere is one of pure, gentle love. The heart they hold is both theirs and yours. Love flows between them and you.",
  upright: `Archangel Chamuel is the angel of love and peaceful relationships. He helps you find love, heal relationships, and open your heart. When this card appears, love is present. Archangel Chamuel helps you see the love that already exists in your life. Archangel Chamuel appears when you need to heal a relationship. Whether with a partner, family member, friend, or yourself, Chamuel brings the energy of forgiveness and understanding. Archangel Chamuel helps you find the courage to love again if you have been hurt. Archangel Chamuel also helps you find lost items and inner peace. His name means he who sees God. He helps you see the divine in yourself and others. Archangel Chamuel asks you to open your heart. The walls you have built are keeping out the love you long for. It is safe to love. It is safe to be loved. Archangel Chamuel surrounds you with his rose-pink light. Let it soften your heart. Let it heal your wounds. Love is here. Open to it.`,
  reversed: `Archangel Chamuel reversed suggests heartbreak, loneliness, or difficulty giving or receiving love. Your heart may be closed after being hurt. The card asks you to call on Archangel Chamuel for healing. The rose light can help. Your heart is not broken beyond repair. Love is still possible. Open slowly. Let the healing begin.`,
});

register({
  title: "keepers-of-the-light|Archangel Zadkiel",
  category: "Keepers of the Light",
  keywords: ["mercy", "forgiveness", "transformation", "purple flame", "release"],
  symbolism: "An angelic figure stands within a violet-purple flame. Their wings pulse with the color of amethyst. They hold a scroll that represents the records of the past. With their other hand, they touch the flame, transmuting old pain into wisdom.",
  upright: `Archangel Zadkiel is the angel of mercy, forgiveness, and transformation. He holds the violet flame of transmutation, which can heal even the deepest wounds. When this card appears, you are being called to forgive. Archangel Zadkiel helps you release the past. Forgiveness is not about condoning what happened. It is about freeing yourself from the weight of resentment. Archangel Zadkiel appears when you are ready to let go. The situation that has haunted you can be transformed. Archangel Zadkiel holds the akashic records and can help you understand the soul lessons in your experiences. Archangel Zadkiel helps you transform pain into wisdom, guilt into grace, anger into peace. Archangel Zadkiel asks you to be merciful with yourself. Self-forgiveness is often the hardest. You have done the best you could with the awareness you had. Release the judgment. Let the violet flame transmute your past. You are not your mistakes. You are the wisdom you gained from them. Archangel Zadkiel offers transformation. Accept it. Release. Forgive. Be free.`,
  reversed: `Archangel Zadkiel reversed suggests holding onto grudges, difficulty forgiving, or resisting transformation. The past is weighing on you, and the weight is becoming unbearable. The card asks you to consider the cost of holding on. Forgiveness is for you, not for them. Release the burden. The violet flame is ready to transform your pain. Let it.`,
});

register({
  title: "keepers-of-the-light|Ascended Master Jesus",
  category: "Keepers of the Light",
  keywords: ["love", "compassion", "healing", "divine love", "unconditional"],
  symbolism: "A figure wearing a simple white robe stands with arms outstretched, light radiating from their heart. Their face holds infinite compassion. They do not judge. They do not condemn. They simply love. Behind them, light dawns over a peaceful landscape.",
  upright: `Ascended Master Jesus appears when you need to remember the power of unconditional love. He represents the Christ consciousness, the divine love that exists within all beings. When this card appears, you are being called to love without conditions. Ascended Master Jesus asks you to open your heart to divine love. This love is not limited to any religion. It is the universal love that recognizes the divine in all. Ascended Master Jesus appears when you are struggling with forgiveness, judgment, or self-worth. Ascended Master Jesus helps you release guilt and shame. He reminds you that you are worthy of love, not because of what you have done, but because of who you are. Ascended Master Jesus also assists with healing, especially healing of the heart. Ascended Master Jesus asks you to be kind to yourself and others. Judgment closes the heart. Love opens it. Love as you wish to be loved. Forgive as you wish to be forgiven. The Christ light is within you. Let it shine. Let it heal. Let it love through you.`,
  reversed: `Ascended Master Jesus reversed suggests self-judgment, guilt, or difficulty accepting divine love. You may feel unworthy of love or forgiveness. The card asks you to release the judgment. You are worthy of love. You are worthy of forgiveness. Ascended Master Jesus offers both freely. Accept them. Let the love in.`,
});

register({
  title: "keepers-of-the-light|Ascended Master Mary",
  category: "Keepers of the Light",
  keywords: ["motherhood", "compassion", "purity", "grace", "divine feminine"],
  symbolism: "A serene figure in blue and white robes stands with hands gently folded. A soft golden light surrounds her. Roses bloom at her feet. Her expression is one of infinite tenderness. She is the mother of compassion, the face of divine grace.",
  upright: `Ascended Master Mary appears when you need the comfort of the divine mother. She embodies pure compassion, grace, and unconditional love. When this card appears, you are being held in her loving embrace. Ascended Master Mary nurtures your spirit. Ascended Master Mary appears when you are hurting, when you need comfort, when you need to feel that you are not alone. Ascended Master Mary asks you to be gentle with yourself. You do not need to be strong all the time. Ascended Master Mary also supports those who are mothers or who mother others. She honors the sacred work of nurturing. Ascended Master Mary asks you to trust in grace. Grace is the love that flows to you without your having to earn it. You are held. You are loved. You are pure in her eyes. Ascended Master Mary is with you, wrapping you in her blue mantle of compassion. Let her comfort you. Let her love fill the places that feel empty. You are her child. She will never abandon you.`,
  reversed: `Ascended Master Mary reversed suggests a lack of nurturing, feeling abandoned, or difficulty accepting maternal love. You may be rejecting the comfort that is available. The card asks you to open to grace. You are worthy of love and comfort. Ascended Master Mary offers both freely. Let her hold you. It is safe to receive.`,
});

register({
  title: "keepers-of-the-light|Quan Yin",
  category: "Keepers of the Light",
  keywords: ["compassion", "mercy", "hearing prayers", "goddess", "bodhisattva"],
  symbolism: "A radiant figure in flowing white robes stands on a lotus blossom, holding a vase of healing nectar and a willow branch. Their expression is one of infinite compassion. They have heard every prayer and answered every sincere call. They are the embodiment of mercy.",
  upright: `Quan Yin is the bodhisattva of compassion, the one who hears the cries of the world. When this card appears, your prayers have been heard. Quan Yin appears when you need mercy, compassion, and healing. Quan Yin is the embodiment of the feminine divine. She hears every prayer and responds with unconditional love. Quan Yin appears when you are suffering, when you feel alone, when you need to know that someone hears you. Quan Yin also teaches compassion for yourself. You cannot pour from an empty cup. Quan Yin asks you to treat yourself with the same compassion you offer others. Quan Yin asks you to trust that you are heard. Every prayer, every tear, every quiet plea is known. The answer may not come in the form you expect, but it will come. Quan Yin is patient. She waits. She pours the nectar of compassion into the hearts of those who call on her. Quan Yin hears you. She is with you. You are not alone. Her compassion is infinite. Let it fill you. Let it heal you. Let it remind you that love is always present.`,
  reversed: `Quan Yin reversed suggests feeling unheard, a crisis of faith, or difficulty extending compassion to yourself. You may feel that your prayers are not being answered. The card asks you to trust that you are heard. The answer may be delayed, but it is coming. Quan Yin has not abandoned you. Be patient. Be compassionate with yourself. The healing is on its way.`,
});

register({
  title: "keepers-of-the-light|White Eagle",
  category: "Keepers of the Light",
  keywords: ["spirit guide", "wisdom", "freedom", "vision", "higher perspective"],
  symbolism: "A magnificent white eagle soars high above a mountain landscape, its wings spread wide. Its eyes see everything from above. The eagle is a messenger between heaven and earth, carrying prayers to the creator and bringing visions to those below.",
  upright: `White Eagle is a powerful spirit guide who brings wisdom, vision, and a higher perspective. When this card appears, you are being asked to rise above your current situation and see the bigger picture. White Eagle appears when you need clarity, when you feel stuck in the details, when you need to see your life from a higher vantage point. White Eagle also carries your prayers to the divine. He is a messenger between worlds. White Eagle appears when your prayers are ready to be answered. White Eagle asks you to trust your vision. You can see farther than you think. The eagle does not doubt its eyes. It trusts what it sees. White Eagle also represents freedom. You are not meant to be caged. White Eagle asks you to release what holds you down and trust your ability to soar. White Eagle asks you to rise. Leave the ground behind. See your life from above. The patterns are clearer from up here. Trust the vision. Spread your wings. Soar.`,
  reversed: `White Eagle reversed suggests a limited perspective, feeling trapped in details, or difficulty seeing the bigger picture. You may be stuck in the weeds when you need to rise above. The card asks you to find higher ground. The vision is available. Climb higher. See farther. The eagle is calling you to rise.`,
});

register({
  title: "keepers-of-the-light|Buffalo",
  category: "Keepers of the Light",
  keywords: ["abundance", "prayer", "gratitude", "sacredness", "provision"],
  symbolism: "A great buffalo stands on the prairie, its massive head bowed as if in prayer. The animal radiates a sense of sacred abundance. Behind it, the land is rich and providing. The buffalo represents the sacredness of all life and the abundance that comes when we give thanks.",
  upright: `Buffalo is a powerful spirit guide who represents abundance, gratitude, and the sacredness of provision. When this card appears, you are being called to give thanks. Buffalo appears when you need to remember that your needs are provided for. Buffalo also teaches the power of prayer. The buffalo was central to the survival of many indigenous peoples, providing food, shelter, and tools. Every part was used. Nothing was wasted. Buffalo asks you to honor what you have been given. Buffalo appears when you are worried about lack. Trust that you are provided for. Buffalo also teaches gratitude. Before the hunt, the people prayed, thanking the buffalo for its sacrifice. Buffalo asks you to give thanks before you receive. Gratitude opens the doors of abundance. Buffalo asks you to recognize the sacredness of your life. Every breath is a gift. Every meal is a blessing. Buffalo walks with you, providing for your needs. Give thanks. Live in gratitude. The abundance is here. It has always been here. Open your eyes and see.`,
  reversed: `Buffalo reversed suggests a scarcity mindset, ingratitude, or a fear that your needs will not be met. You may be focusing on what is lacking rather than what is present. The card asks you to shift to gratitude. Your needs are provided for. Give thanks, and more will come. The buffalo does not hoard. It trusts the land. Trust that you are provided for.`,
});

})();

/* ══════════════════════════════════════════════════
   ANGEL ANSWERS (Radleigh Valentine, 44 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "angel-answers|Yes",
  category: "Angel Answers",
  keywords: ["affirmation", "confirmation", "positive", "yes", "go ahead"],
  symbolism: "A golden light radiates from above, illuminating a pathway that opens before a waiting figure. The sky is clear. The path is inviting. The message is unmistakable. The answer is yes. The universe is giving the green light. Move forward with confidence.",
  upright: `Yes is a clear and unmistakable confirmation from the angels. Your question has been heard, and the answer is affirmative. This card appears when you need reassurance that you are on the right path. The angels are telling you to proceed. Yes appears when you have been uncertain, when you have been seeking confirmation, when you have been waiting for permission. The answer is yes. The angels ask you to trust this answer and move forward with confidence. Yes does not guarantee that the path will be easy, but it confirms that it is the right path. Yes also carries the energy of abundance and positive outcomes. The universe is supporting your endeavors. The angels are cheering you on. Yes is a green light. Do not hesitate. The timing is right. The path is open. The answer is yes. Move forward with faith. The angels are with you.`,
  reversed: `Yes reversed is not a no. It suggests that the timing may not be right or that you need more clarity before proceeding. The answer is still yes, but perhaps not yet. The card asks you to be patient. The confirmation will come. Trust the timing.`,
});

register({
  title: "angel-answers|No",
  category: "Angel Answers",
  keywords: ["redirection", "protection", "not now", "different path", "closed door"],
  symbolism: "A gentle but firm hand is raised in a stopping gesture. A door closes softly. The message is clear: this path is not for you. But the hand is gentle, and the closing door does not slam. It is a loving redirection, a protection from what is not meant for you.",
  upright: `No is a clear answer from the angels, but it is not a rejection. It is a redirection. The angels are guiding you away from a path that is not in your highest good. This card appears when you need to accept a closed door. No appears when you have been pushing for something that is not meant for you. The angels ask you to trust that the no is a protection. No also clears the way for a yes to something better. No appears when you need to release attachment to a specific outcome. The angels know what you cannot see. They know that this no is clearing the path for a yes that will bring you greater joy. No asks you to trust. The closed door is a gift. It saves you from wasted effort and potential heartache. No appears with love. The angels do not deny you because they want to punish you. They deny you because they want to protect you. Trust the no. The right yes is on its way.`,
  reversed: `No reversed suggests that you may be refusing to accept a no that has already been given. You may be pushing against a closed door. The card asks you to stop and listen. The no is not a punishment. It is a protection. Trust that the angels are guiding you toward something better. Release the attachment. The right path will open.`,
});

register({
  title: "angel-answers|Pay Attention",
  category: "Angel Answers",
  keywords: ["awareness", "presence", "signs", "look around", "notice"],
  symbolism: "A figure stands in the middle of a busy scene, but a spotlight illuminates a specific object at their feet. They are about to miss it, distracted by the noise around them. The angels are asking them to look down, to notice what is right in front of them.",
  upright: `Pay Attention is a call from the angels to become aware of the signs around you. You have been so focused on the big picture that you are missing the messages at your feet. This card appears when you need to stop and look. Pay Attention asks you to notice the synchronicities, the repeating numbers, the chance encounters, the words of a song that speak directly to your situation. The angels communicate through signs. They are trying to get your attention. Pay Attention also asks you to be present. You may be so focused on the future or the past that you are missing the guidance available in the present moment. Pay Attention asks you to slow down. The answers you seek are not hidden. They are in plain sight. Pay attention. The angels are speaking. Look around. Listen. The message is here. Do not miss it.`,
  reversed: `Pay Attention reversed suggests that you are distracted, missing signs, or not listening to the guidance around you. The angels are speaking, but you are not hearing them. The card asks you to slow down and tune in. The messages are there. You need to be still enough to receive them. Quiet the noise and listen.`,
});

register({
  title: "angel-answers|Trust",
  category: "Angel Answers",
  keywords: ["faith", "surrender", "confidence", "belief", "inner knowing"],
  symbolism: "A figure stands at the edge of a step that leads into mist. They cannot see where the step goes, but their foot is already moving forward. Their face shows trust, not fear. They walk into the unknown with the confidence that they will be supported.",
  upright: `Trust is a message from the angels asking you to have faith. You have been seeking answers, waiting for certainty, wanting guarantees. The angels ask you to trust without seeing. Trust appears when you are at a threshold. You cannot see the other side. The path ahead is obscured. But the angels assure you that the step is safe. Trust asks you to release the need to know every detail. Trust is active. It is the choice to move forward despite uncertainty. Trust appears when your faith is being tested. The angels are asking you to believe in yourself, in them, in the divine plan. Trust asks you to remember that you have been guided this far. You will not be abandoned now. The step you are afraid to take is the step that will lead you home. Trust. The angels are with you. The path will appear beneath your feet as you walk it. Trust the process. Trust the timing. Trust yourself.`,
  reversed: `Trust reversed suggests doubt, fear, or a struggle to believe. You may be looking for guarantees that cannot be given. The card asks you to find one small thing to trust. Faith is built one step at a time. Take a small step into the unknown. The angels will catch you. Trust them. Trust yourself.`,
});

register({
  title: "angel-answers|Release Control",
  category: "Angel Answers",
  keywords: ["surrender", "let go", "allow", "trust the process", "release"],
  symbolism: "A figure stands with their hands open, releasing a flock of birds. The birds fly free. The figure's expression is one of relief, not loss. They have understood that holding on was causing more pain than letting go. Release is not loss. It is freedom.",
  upright: `Release Control is a direct message from the angels to let go. You have been holding on too tightly. The need to control every outcome is exhausting you and blocking the flow of grace. Release Control appears when you need to surrender. The angels ask you to open your hands and let the universe take over. Release Control does not mean giving up. It means giving over. You release the outcome to a higher power. You do your part and trust the rest to divine grace. Release Control appears when your efforts are not producing results. The more you push, the more resistance you meet. The angels ask you to try a different approach. Stop pushing. Start allowing. Release Control asks you to trust that the universe can handle things without your constant intervention. The birds you release will find their way home. The situation you surrender will find its right resolution. Release Control. Breathe. Let go. The angels are handling it. Trust them.`,
  reversed: `Release Control reversed suggests that you are still gripping tightly, still trying to manage every detail. The need for control is causing stress and blocking solutions. The card asks you to consider what you are afraid will happen if you let go. The fear is real, but it is not the truth. Release the outcome. Trust that all will be well. Let go and let the angels guide.`,
});

register({
  title: "angel-answers|Take Action",
  category: "Angel Answers",
  keywords: ["initiative", "movement", "do it", "step forward", "act"],
  symbolism: "A figure stands before an open door, one foot already across the threshold. Light pours through the doorway. The figure is poised, ready to move. The angels urge them forward. The waiting is over. The time for action is now.",
  upright: `Take Action is a clear message from the angels that the time for waiting is over. You have the answers you need. You have the guidance you requested. Now it is time to act. Take Action appears when you have been hesitating, waiting for more clarity, more confidence, more certainty. The angels say you have enough. Take Action does not mean rush without thought. It means move forward with intention. The angels ask you to trust that you have everything you need. The door is open. The path is waiting. Take Action also carries the energy of courage. It takes courage to act on faith. The angels are with you. They will support your steps. Take Action asks you to stop waiting for the perfect moment. This is the moment. The angels are urging you forward. Take the step. Make the call. Have the conversation. Start the project. The time is now. Action is the bridge between intention and manifestation. Cross it.`,
  reversed: `Take Action reversed suggests procrastination, fear of moving forward, or a lack of motivation. You may be stuck in overthinking when action is needed. The card asks you to identify what is holding you back. Fear? Perfectionism? Lack of clarity? Address the obstacle and take one small step. The angels will meet you in the movement.`,
});

register({
  title: "angel-answers|Ask for Help",
  category: "Angel Answers",
  keywords: ["support", "community", "reaching out", "vulnerability", "assistance"],
  symbolism: "A figure stands alone on one side of a chasm. On the other side, hands reach out, ready to help. The figure only needs to ask. The reaching hands have been there all along, waiting for the request. Asking is the bridge that closes the distance.",
  upright: `Ask for Help is a gentle reminder that you do not have to do this alone. The angels see you struggling, trying to manage everything on your own. They ask you to reach out. Ask for Help appears when you need support but have been too proud, too afraid, or too independent to ask. Ask for Help asks you to release the belief that asking for help is weakness. It is strength. It is wisdom. Ask for Help also applies to your relationship with the angels. You can ask them for help directly. They are waiting for your request. They respect your free will and will not intervene without your invitation. Ask for Help appears when you need to remember that support is available. The hands are reaching out. The angels are ready. Your community is willing. Ask. Receive. Let yourself be supported. You do not have to carry everything alone. Asking for help is sacred. It opens the door for others to give and for you to receive. Ask. The help is here.`,
  reversed: `Ask for Help reversed suggests a refusal to reach out, pride that isolates, or a belief that you must handle everything alone. The card asks you to examine the cost of this independence. Help is available. You only need to ask. Drop the armor. Let others in. The support you need is waiting for your request.`,
});

register({
  title: "angel-answers|You Are Loved",
  category: "Angel Answers",
  keywords: ["love", "worthiness", "acceptance", "divine love", "unconditional"],
  symbolism: "A figure stands under a waterfall of golden-pink light. The light pours over them, filling every cell with love. Their expression is one of bliss and relief. They are being loved unconditionally, and for the first time, they are letting it in.",
  upright: `You Are Loved is a direct message from the angels, delivered with the full force of divine love. You are loved. Not because of what you have done. Not because of who you are trying to be. You are loved because you exist. This card appears when you need to feel the love that surrounds you. You Are Loved appears when you have been feeling alone, unworthy, or forgotten. The angels want you to know that you are none of those things. You Are Loved asks you to stop trying to earn love. You Are Loved also asks you to love yourself. The love the angels have for you is also the love you are meant to have for yourself. The angels cannot give you what you will not give yourself. You Are Loved asks you to receive this love. Let it in. The waterfall of love is pouring over you. Feel it. Let it heal you. Let it remind you that you are worthy. You are loved. You have always been loved. You will always be loved. Nothing can change that.`,
  reversed: `You Are Loved reversed suggests difficulty feeling loved, low self-worth, or a belief that you are unlovable. The love is there, but you are not letting it in. The card asks you to examine the stories you tell yourself about your worthiness. They are not true. You are loved unconditionally. Open your heart to receive that love. You are worthy. You have always been worthy.`,
});

register({
  title: "angel-answers|Let It Go",
  category: "Angel Answers",
  keywords: ["release", "forgiveness", "detachment", "freedom", "moving on"],
  symbolism: "A figure stands at the edge of a river, releasing a handful of autumn leaves into the current. The leaves float away downstream. The figure watches them go without sadness. Release is not loss. It is making space for spring. The river carries the past away.",
  upright: `Let It Go is a message from the angels to release what no longer serves you. You have been holding onto something that is weighing you down. An old hurt, a failed expectation, a relationship that has run its course, a belief that limits you. The angels ask you to let it go. Let It Go appears when the holding on is causing more pain than the letting go. Let It Go asks you to trust that releasing creates space for something better. The angels know that you may be afraid to let go. The leaf fears the current, but the current carries it to new shores. Let It Go is an act of faith. You release what was so that what is meant to be can arrive. Let It Go appears with love. The angels are not asking you to deny your pain. They are asking you to stop letting it define you. The river is flowing. The past is passing. Let it go. The freedom you seek is on the other side of release.`,
  reversed: `Let It Go reversed suggests holding on, difficulty releasing, or clinging to the past. You may be afraid of what life will look like after you let go. The card asks you to consider what holding on is costing you. The weight is heavy. Release does not mean loss. It means freedom. Let the river carry the past away. What is meant for you will remain.`,
});

})();

/* ══════════════════════════════════════════════════
   CRYSTAL SPIRITS (Colette Baron-Reid, 58 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "crystal-spirits|Clear Quartz",
  category: "Crystal Spirits",
  keywords: ["clarity", "amplification", "focus", "master healer", "programmable"],
  symbolism: "A tall clear quartz crystal cluster rises from a bed of moss. Light passes through the crystals, splitting into rainbows that dance across the surrounding forest floor. The crystals are clear, faceted, and precise, channeling light with perfect clarity.",
  upright: `Clear Quartz is the master crystal, capable of amplifying any intention or healing. This card appears when you need clarity of mind and purpose. Clear Quartz asks you to clarify your intentions. What you focus on now will be amplified. Choose your focus with care. Clear Quartz also represents the ability to see through confusion. The fog is lifting. The truth is becoming visible. Clear Quartz asks you to trust your clarity. You know what you need to do. Clear Quartz also amplifies your energy and the energy around you. Be mindful of what you are putting out, because it will return multiplied. Clear Quartz is a programmable crystal. Set your intention clearly. What do you want to create? What do you want to heal? Clear Quartz asks you to be precise in your intentions. The universe responds to clarity. Be clear about what you want. Be clear about who you are. The crystal light illuminates your path. Walk it with focused intention.`,
  reversed: `Clear Quartz reversed suggests confusion, scattered focus, or intentions that are not clear. Your energy is being amplified in directions that do not serve you. The card asks you to pause and get clear. What do you actually want? Clarify your intention before you take another step.`,
});

register({
  title: "crystal-spirits|Amethyst",
  category: "Crystal Spirits",
  keywords: ["intuition", "spirituality", "peace", "protection", "divine connection"],
  symbolism: "A geode of deep purple amethyst crystals opens to reveal a glowing core. The crystals are arranged in a circle, like a sanctuary. The purple light is calming and protective. The space within the crystals feels sacred, safe, and deeply peaceful.",
  upright: `Amethyst is the stone of spiritual protection and intuitive connection. This card appears when you need to deepen your spiritual practice and trust your intuition. Amethyst asks you to create sacred space in your life. Amethyst also offers protection from negative influences. Amethyst creates a bubble of peace around you. Amethyst asks you to quiet your mind and listen. Your intuition is speaking. Trust what you hear. Amethyst is also a stone of sobriety and release from addictions. If you are struggling with any form of dependency, Amethyst supports your freedom. Amethyst appears when you need peace. The world has been chaotic. Amethyst offers a sanctuary of calm. Step into the purple light. Let it quiet your mind. Let it open your intuition. Amethyst connects you to your highest self. The answers you seek are within. Amethyst helps you access them. Trust your inner knowing. The peace you seek is available. Breathe it in.`,
  reversed: `Amethyst reversed suggests a disconnection from your intuition, spiritual confusion, or a lack of peace. You may be feeling unprotected or overwhelmed. The card asks you to create sacred space. Quiet the noise. Reconnect with your inner knowing. Amethyst's peace is still available. You have only forgotten to access it. Breathe. Center. Return to peace.`,
});

register({
  title: "crystal-spirits|Rose Quartz",
  category: "Crystal Spirits",
  keywords: ["love", "compassion", "healing", "heart", "gentleness"],
  symbolism: "A heart-shaped rose quartz crystal rests on a bed of rose petals. The stone glows with a soft pink light. The atmosphere is tender and loving. The stone seems to pulse with unconditional love, warming the space around it with gentle, healing energy.",
  upright: `Rose Quartz is the stone of unconditional love. It opens the heart to give and receive love in its purest form. Rose Quartz appears when you need to heal your heart. Rose Quartz asks you to be gentle with yourself. Love is not something you earn. Love is your nature. Rose Quartz also attracts loving relationships. If you are seeking a partner, Rose Quartz helps you open to receive love. Rose Quartz appears when you need to forgive. Forgiveness is the key that unlocks the heart. Rose Quartz asks you to forgive yourself and others. Rose Quartz is the stone of compassion. It teaches you to see the divine in all beings. Rose Quartz appears when you need to remember that you are love. Not that you are loved, though you are. You are love itself. Your true nature is love. Rose Quartz asks you to let that love flow freely. Give it. Receive it. Be it. The heart knows the way. Follow your heart.`,
  reversed: `Rose Quartz reversed suggests a closed heart, difficulty giving or receiving love, or wounds that have not healed. You may be protecting yourself from love out of fear. The card asks you to open your heart slowly. It is safe to love. It is safe to be loved. Rose Quartz offers gentle healing. Let it in.`,
});

register({
  title: "crystal-spirits|Citrine",
  category: "Crystal Spirits",
  keywords: ["abundance", "success", "confidence", "joy", "solar plexus"],
  symbolism: "A cluster of golden citrine crystals catches the sunlight, blazing with warm yellow-gold light. The crystals look like frozen sunshine. The energy is bright, optimistic, and abundant. Holding the citrine feels like holding a piece of the sun in your hands.",
  upright: `Citrine is the stone of abundance, success, and personal power. It activates the solar plexus chakra, the seat of confidence and will. Citrine appears when you are ready to claim your power. Citrine asks you to step into your worth. Citrine also attracts abundance. Citrine is a stone of manifestation. It aligns your will with the universe to create prosperity. Citrine appears when you need a boost of confidence. You have been doubting yourself. Citrine reminds you of your capabilities. Citrine also dispels negativity. It is one of the few crystals that does not need to be cleansed because it transmutes negative energy into positive. Citrine appears when you need to shift your mindset from lack to abundance. The sun is shining. The abundance is flowing. Citrine asks you to open your hands and receive. You are worthy of success. You are worthy of joy. Citrine carries the energy of the sun. Let its warmth fill you. Let its light show you the way.`,
  reversed: `Citrine reversed suggests low self-worth, blocks to abundance, or a lack of confidence. You may be holding onto negative beliefs about your worthiness. The card asks you to examine these beliefs. They are not true. You are worthy of success. You deserve abundance. Citrine helps you shift into confidence. Claim your power.`,
});

register({
  title: "crystal-spirits|Black Tourmaline",
  category: "Crystal Spirits",
  keywords: ["protection", "grounding", "shield", "negativity removal", "earth connection"],
  symbolism: "A cluster of black tourmaline crystals rises from dark earth. The crystals are long, striated, and deeply black. They stand like a protective fence, absorbing and transmuting negative energy. The ground around them feels solid and safe.",
  upright: `Black Tourmaline is the ultimate stone of protection and grounding. It forms a shield around you, deflecting negative energy and returning it to the earth for transmutation. Black Tourmaline appears when you need protection. Black Tourmaline also grounds you firmly in the earth. Black Tourmaline appears when you feel scattered, ungrounded, or vulnerable. It asks you to root yourself. Black Tourmaline connects you to the stabilizing energy of the earth. Black Tourmaline also transmutes negative energy. It does not simply block negativity. It transforms it into neutral or positive energy. Black Tourmaline appears when you are dealing with difficult people or environments. It helps you maintain your center. Black Tourmaline asks you to stand your ground. You are protected. You are safe. When you feel the world pressing in, call on Black Tourmaline. It is a shield of unwavering strength. Let it ground you. Let it protect you. You are safe. You are strong.`,
  reversed: `Black Tourmaline reversed suggests feeling unprotected, ungrounded, or vulnerable to negative influences. Your energetic shields may be down. The card asks you to take steps to protect yourself. Ground yourself in the earth. Set boundaries. Call on Black Tourmaline for protection. The shield can be restored. You are safe.`,
});

register({
  title: "crystal-spirits|Lapis Lazuli",
  category: "Crystal Spirits",
  keywords: ["wisdom", "truth", "intuition", "royalty", "third eye"],
  symbolism: "A deep blue lapis lazuli stone flecked with golden pyrite glows against a dark background. The gold flecks look like stars in a midnight sky. The stone is ancient, royal, and deeply wise. It holds the knowledge of the ages within its depths.",
  upright: `Lapis Lazuli is the stone of wisdom, truth, and royal power. It activates the third eye and throat chakra, enabling you to speak your truth with clarity and see the world with depth. Lapis Lazuli appears when you need to seek truth. Lapis Lazuli asks you to be honest. Lapis Lazuli also connects you to ancient wisdom. It is a stone of philosophers and truth-seekers. Lapis Lazuli appears when you are ready to understand deeper truths about yourself and the world. Lapis Lazuli also represents royalty. You are a child of the universe, born with inherent dignity. Lapis Lazuli asks you to claim your royal nature. Lapis Lazuli is a stone of intuition. Trust what you know. The wisdom is within you. The gold flecks in the lapis are like stars guiding you home. Lapis Lazuli asks you to speak your truth with love. The world needs your voice. The world needs your wisdom. Do not hide it. Lapis Lazuli helps you see clearly and speak truly. You are a truth-seeker. You are a wisdom-keeper. Honor that.`,
  reversed: `Lapis Lazuli reversed suggests dishonesty, confusion, or a refusal to seek the truth. You may be avoiding a truth that would set you free. The card asks you to be honest with yourself. The wisdom is available. The truth is ready to be seen. Open your eyes. Speak your truth. Lapis Lazuli supports you.`,
});

register({
  title: "crystal-spirits|Moonstone",
  category: "Crystal Spirits",
  keywords: ["intuition", "cycles", "feminine", "new beginnings", "mystery"],
  symbolism: "A cabochon of moonstone glows with an ethereal blue-white light. The light seems to come from within, shifting as the stone moves. The moonstone reflects the light of the moon, carrying its mystery, its magic, and its gentle, cyclical power.",
  upright: `Moonstone is the stone of the moon, intuition, and feminine mysteries. It connects you to the cycles of nature and the rhythms of your own body. Moonstone appears when you need to honor your cycles. Not every phase is for action. Some phases are for rest, reflection, and inner work. Moonstone asks you to honor where you are in your cycle. Moonstone also enhances intuition. It opens the door to the unconscious and helps you receive guidance through dreams and feelings. Moonstone appears when you are entering a new beginning. It is a stone of the new moon, of fresh starts, of tender potential. Moonstone asks you to trust the new beginning, even though it is fragile. Moonstone also helps you connect with the divine feminine. It honors the receptive, nurturing, intuitive aspects of your nature. Moonstone appears when you need to soften. You have been in your masculine, doing energy. Moonstone invites you to rest in your feminine, being energy. Moonstone asks you to trust the mystery. You do not need to have all the answers. The moon knows when to shine and when to hide. Trust your own cycles. Trust the timing of your life.`,
  reversed: `Moonstone reversed suggests being out of sync with your cycles, ignoring your intuition, or suppressing your feminine nature. You may be pushing yourself too hard when you need to rest. The card asks you to honor your natural rhythms. The moon does not rush. Neither should you. Rest. Reflect. Trust the cycle.`,
});

})();

/* ══════════════════════════════════════════════════
   SPIRIT ANIMAL ORACLE (Colette Baron-Reid, 50 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "spirit-animal|Wolf",
  category: "Spirit Animal Oracle",
  keywords: ["loyalty", "instinct", "freedom", "pack", "wildness"],
  symbolism: "A lone wolf stands on a rocky outcropping under a full moon, its head raised in a howl. The call is not of loneliness but of connection. The wolf communicates with its pack across the vast distance. The wildness in its eyes is untamed, intelligent, and free.",
  upright: `Wolf appears when you need to trust your instincts and honor your connection to your pack. Wolf teaches the balance between independence and community. Wolf appears when you need to honor both. Wolf also teaches loyalty. Wolf is fiercely loyal to its pack. Wolf asks you to examine your loyalties. Wolf appears when you need to communicate your truth. The howl of the wolf carries across vast distances. Your voice needs to be heard. Wolf asks you to speak, knowing that your words will reach those who need to hear them. Wolf also represents freedom. The wolf cannot be tamed. Wolf appears when you need to reclaim your wildness. You have been domesticated by expectations and responsibilities. Wolf calls you back to the wild. Wolf asks you to trust your instincts. Your gut knows the truth. Trust it. Wolf asks you to find your pack. The ones who understand you, who will run beside you, who will howl with you. You are not meant to walk alone. Call to your pack. They will answer.`,
  reversed: `Wolf reversed suggests mistrust of your instincts, disconnection from your pack, or a loss of personal freedom. You may be feeling isolated or betrayed. The card asks you to howl. Your pack is out there. Call to them. Trust your instincts. The wolf knows the way home. Follow it.`,
});

register({
  title: "spirit-animal|Bear",
  category: "Spirit Animal Oracle",
  keywords: ["strength", "courage", "introspection", "healing", "protection"],
  symbolism: "A massive grizzly bear emerges from a forest, standing on its hind legs. It is not aggressive. It is asserting its presence. The bear knows its power. It does not need to prove it. The forest around it is deep and wild. The bear is the guardian of its domain.",
  upright: `Bear appears when you need to access your inner strength and stand in your power. Bear does not need to fight to prove its strength. Its presence is enough. Bear appears when you need to assert yourself without aggression. Bear also represents introspection. The bear hibernates, going deep within during the winter months. Bear appears when you need to turn inward. Bear represents healing. The bear knows how to heal itself. Bear appears when you are ready to heal deep wounds. Bear asks you to be patient with the healing process. Bear also represents protection. The mother bear is fiercely protective of her cubs. Bear appears when you need to protect what is precious to you. Bear asks you to stand guard over your boundaries. Bear appears when you need to be still and know your power. You are stronger than you think. You do not need to prove anything. The bear knows its strength. You can know yours. Stand tall. Protect what matters. Rest when you need to. Heal. Your power is not diminished by rest. It is renewed.`,
  reversed: `Bear reversed suggests a lack of strength, difficulty protecting boundaries, or a refusal to go within. You may be avoiding the introspection that is needed. The card asks you to turn inward. The healing you need requires rest. The bear does not fight winter. It sleeps through it. Honor your need for rest and reflection.`,
});

register({
  title: "spirit-animal|Butterfly",
  category: "Spirit Animal Oracle",
  keywords: ["transformation", "metamorphosis", "joy", "beauty", "emergence"],
  symbolism: "A monarch butterfly emerges from its chrysalis, wings unfurling in the morning light. The transformation is complete. The butterfly that emerges is nothing like the caterpillar that entered. The process was hidden, dark, and necessary. Now there is flight.",
  upright: `Butterfly appears when you are undergoing a profound transformation. The old form is dissolving. A new form is emerging. Butterfly appears when you are between who you were and who you are becoming. This in-between place can feel vulnerable. Butterfly asks you to trust the process. Butterfly is the symbol of joy and beauty. After the darkness of the chrysalis, the butterfly emerges into the light. Butterfly appears when joy is returning to your life. Butterfly asks you to embrace the lightness of being. Butterfly also represents the soul's journey. The butterfly has been associated with the soul across many cultures. Butterfly appears when your soul is evolving. Butterfly asks you to trust the metamorphosis. You are not falling apart. You are transforming. The process cannot be rushed. The butterfly does not struggle to become. It simply becomes. Trust your becoming. The wings are forming. The flight is coming. You will emerge more beautiful than you could have imagined.`,
  reversed: `Butterfly reversed suggests resistance to transformation, clinging to an old identity, or a transformation that is stalled. You may be afraid of who you are becoming. The card asks you to trust the process. The chrysalis is not a prison. It is a cocoon. You are not dying. You are being reborn. Let the transformation happen.`,
});

register({
  title: "spirit-animal|Owl",
  category: "Spirit Animal Oracle",
  keywords: ["wisdom", "truth", "seeing through darkness", "silence", "observation"],
  symbolism: "A great horned owl perches on a branch in the deep night. Its golden eyes are wide, seeing everything in the darkness. The moon is full behind it. The owl does not need light to see. It has adapted to the dark. Its wisdom is born of the night.",
  upright: `Owl appears when you need to see the truth that is hidden in the shadows. Owl has the ability to see what others miss. Owl appears when you need to look deeper. Owl also represents silent wisdom. The owl does not announce its presence. It watches. It listens. Owl appears when you are being asked to observe before you act. Owl appears when you need to trust your ability to see through deception. The owl cannot be fooled by appearances. Owl asks you to look beneath the surface. What is really going on? Owl appears when you need to sit with the unknown. Not everything needs to be brought into the light immediately. Some truths reveal themselves in darkness. Owl asks you to be comfortable with mystery. Owl appears when you need wisdom. The owl has access to ancient knowledge. Owl asks you to be still and listen. The wisdom you seek is available in the silence. Trust what you see in the dark. The owl sees clearly. So can you.`,
  reversed: `Owl reversed suggests denial, refusing to see the truth, or being deceived by appearances. You may be ignoring what is obvious. The card asks you to open your eyes. The owl's wisdom is available, but you must be willing to look. What are you afraid to see? The truth will set you free. Look.`,
});

register({
  title: "spirit-animal|Raven",
  category: "Spirit Animal Oracle",
  keywords: ["magic", "transformation", "mystery", "intelligence", "messenger"],
  symbolism: "A raven perches on an ancient standing stone, its black feathers iridescent in the light. In its beak, it holds a small glowing object. The raven is a keeper of secrets, a messenger between worlds. Its intelligence is ancient and its purpose is mysterious.",
  upright: `Raven appears when magic is afoot. Raven is the keeper of mysteries, the carrier of secrets, the transformer of reality. Raven appears when you are being asked to embrace the unknown. Raven also represents intelligence. Raven is one of the most intelligent of birds, capable of solving complex problems and using tools. Raven appears when you need to use your intelligence in creative ways. Raven appears when you are ready for shape-shifting. Raven can teach you to move between different worlds, different realities, different versions of yourself. Raven appears when you need to be adaptable. Raven also carries messages from the spirit world. Raven appears when you are receiving guidance from beyond. Raven appears when you need to trust the magic of life. Things are not always as they seem. Raven asks you to look beyond the veil. There is more here than meets the eye. Trust the mystery. Raven is your guide through the unknown. Follow the raven. It knows the way.`,
  reversed: `Raven reversed suggests a loss of magic, feeling disconnected from mystery, or messages that are not getting through. You may be too focused on the mundane to see the magic around you. The card asks you to open your eyes to the wonder. The raven's magic is still here. You have only forgotten to look. Pay attention. The mystery is calling.`,
});

register({
  title: "spirit-animal|Deer",
  category: "Spirit Animal Oracle",
  keywords: ["gentleness", "grace", "intuition", "sensitivity", "innocence"],
  symbolism: "A white-tailed deer stands at the edge of a forest clearing, ears perked, eyes soft. The deer is alert but not afraid. Its presence is gentle and graceful. It moves with quiet elegance. The deer trusts its sensitivity to navigate the world.",
  upright: `Deer appears when you need to embrace gentleness and grace. Deer moves through the forest with quiet elegance. Deer appears when you need to bring more gentleness into your life. Deer also represents sensitivity. Deer is highly attuned to its environment. Deer appears when you need to trust your sensitivity as a strength. Deer appears when you need to approach a situation with gentleness. Not every situation requires force. Deer appears when you need to trust your intuition. Deer relies on its instincts to survive. Deer asks you to trust your gut. Deer also represents the power of innocence. The fawn is pure and trusting. Deer appears when you need to approach life with fresh eyes. Deer appears when you need to be gentle with yourself. You have been too hard on yourself. Deer asks you to soften. Deer asks you to move through your life with grace. You do not need to force or fight. Gentleness is its own form of strength. Trust the soft path. It leads where you need to go.`,
  reversed: `Deer reversed suggests a loss of gentleness, over-sensitivity, or a refusal to be vulnerable. You may be bracing yourself against the world when gentleness is what is needed. The card asks you to soften. It is safe to be gentle. Grace is available. Let yourself receive it.`,
});

})();

/* ══════════════════════════════════════════════════
   THE WILD UNKNOWN ANIMAL SPIRIT (Kim Krans, 63 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "wild-unknown-animal|Wolf",
  category: "The Wild Unknown Animal Spirit",
  keywords: ["wildness", "loyalty", "instinct", "solitude", "pack"],
  symbolism: "A wolf drawn in stark black ink, its body formed of geometric shards and sharp angles. The wolf is both creature and pattern, wild and structured. Its eye is a single white circle, alert and knowing. The background is deep black, suggesting the dark of the moon.",
  upright: `The Wolf appears when you must reclaim your wildness. The wolf has been hunted, domesticated, and driven to the edges. Yet the wolf survives. The wolf appears when you have been too tame, too compliant, too safe. The wolf calls you back to the wilderness within. The wolf also teaches loyalty. The wolf is fiercely loyal to its pack. The wolf asks you to examine your loyalties. The wolf appears when you need to howl. The wolf howls to communicate, to find its pack, to announce its presence. Your voice needs to be heard. The wolf asks you to howl. The wolf also represents instinct. The wolf trusts its gut. The wolf asks you to trust yours. The wolf appears when you have been overthinking. Feel your way forward. The wolf does not plan. The wolf responds. The wolf is wild, intelligent, and free. The wolf appears when you need to remember your untamed nature. You are not meant to be caged. Howl. Find your pack. Run free.`,
  reversed: `Wolf reversed suggests domestication of the spirit, suppression of wild nature, or being separated from your pack. You have been playing small, safe, tame. The wolf calls you back to the wild. It is time to howl. Trust your instincts. Find your people.`,
});

register({
  title: "wild-unknown-animal|Bear",
  category: "The Wild Unknown Animal Spirit",
  keywords: ["strength", "solitude", "hibernation", "power", "introspection"],
  symbolism: "A bear rendered in dense black cross-hatching, massive and immovable. The bear takes up the entire frame. Its form is built of shadows and lines. It is a creature of the deep woods, of caves, of the dark winter months. It is patient and powerful.",
  upright: `The Bear appears when you must go within. The bear hibernates through the long winter, living on its own reserves. The bear appears when you need to turn inward. The bear appears when you need rest, solitude, and introspection. The bear does not fight the winter. The bear honors it. The bear also represents raw power. The bear is one of the most powerful animals in the wild, but it does not use its power carelessly. The bear appears when you need to know your own power. The bear appears when you need to stand your ground. The bear asks you to be still and know your strength. The bear also represents healing. The bear enters the cave wounded and emerges healed. The bear appears when you are in a healing process. The bear asks you to trust the dark. What is happening in the quiet, in the stillness, is transformation. The bear is patient. The bear trusts the process. The bear will emerge when it is time. So will you.`,
  reversed: `Bear reversed suggests a refusal to go within, restlessness, or power misused. You may be fighting the need for rest or solitude. The bear asks you to honor the season. Winter is for rest. Do not force spring. Sleep. Heal. Trust the dark.`,
});

register({
  title: "wild-unknown-animal|Crow",
  category: "The Wild Unknown Animal Spirit",
  keywords: ["magic", "transformation", "intelligence", "death", "rebirth"],
  symbolism: "A crow drawn in sharp, jagged lines, its feathers formed of knife-like shapes. The crow's eye is a pinpoint of white. It perches on a bare branch. The crow is ancient, clever, and unafraid. It is a messenger between the worlds.",
  upright: `The Crow appears when magic is near. The crow is a shape-shifter, a trickster, a keeper of secrets. The crow appears when the veils between worlds are thin. Pay attention. The crow appears when you are being called to transformation. The crow is associated with death and rebirth. The crow appears when something must die to make way for something new. The crow does not fear death. The crow knows that death is transformation. The crow appears when you need to be intelligent and adaptable. The crow is one of the most intelligent of birds, able to solve problems and use tools. The crow asks you to think creatively. The crow also appears when you need to see the truth. The crow sees everything from above. The crow appears when you need perspective. The crow asks you to look at the bigger picture. The crow is a messenger. The crow carries messages from the spirit world. The crow appears when you need to listen. What is the universe trying to tell you? The crow knows. Pay attention. Listen.`,
  reversed: `Crow reversed suggests a denial of magic, resistance to transformation, or refusal to see the truth. You may be ignoring messages that are trying to reach you. The crow asks you to open your eyes. The magic is here. The messages are coming. Pay attention before the message is lost.`,
});

register({
  title: "wild-unknown-animal|Fox",
  category: "The Wild Unknown Animal Spirit",
  keywords: ["cunning", "adaptability", "observation", "strategy", "stealth"],
  symbolism: "A fox drawn in fine, delicate lines, its body elongated and graceful. The fox moves through tall grass, unseen, unheard. Its eyes are sharp, focused, intelligent. The fox is a creature of the edges, moving between the forest and the field, unseen but always watching.",
  upright: `The Fox appears when you need to be cunning. The fox is a master strategist. The fox appears when you need to outthink your circumstances. The fox asks you to be clever, not forceful. The fox also represents adaptability. The fox can survive in almost any environment. The fox appears when you need to adapt to your circumstances. The fox asks you to be flexible. The fox also represents observation. The fox watches before it acts. The fox appears when you need to gather information before you move. The fox asks you to be patient and observe. The fox is also a creature of stealth. The fox moves unseen. The fox appears when you need to move quietly. Not everything needs to be announced. The fox appears when you need to be strategic. Think several moves ahead. The fox is playing chess while others play checkers. The fox appears when you need to be smart, not loud. The fox wins by being clever. So can you. Outthink. Outmaneuver. Outfox.`,
  reversed: `Fox reversed suggests being outsmarted, caught in a trap, or using cunning for selfish purposes. You may have been too clever for your own good. The fox asks you to examine your motives. Strategy without integrity is manipulation. Stay honest. Stay sharp.`,
});

register({
  title: "wild-unknown-animal|Snake",
  category: "The Wild Unknown Animal Spirit",
  keywords: ["transformation", "healing", "kundalini", "rebirth", "shedding"],
  symbolism: "A snake coiled in a spiral, its scales rendered as repeating geometric patterns. The snake's body forms a perfect circle, tail in mouth, an ouroboros. The snake is ancient, primal, and deeply connected to the earth. Its tongue flicks, tasting the air.",
  upright: `The Snake appears when transformation is not just coming but is already underway. The snake sheds its skin to grow. The snake appears when you must shed an old version of yourself. The snake asks you to release what no longer fits. The snake also represents healing. The snake is a symbol of medicine and healing across many cultures. The snake appears when healing is needed. The snake helps you shed old wounds. The snake also represents kundalini energy, the coiled spiritual energy at the base of the spine. The snake appears when you are ready for spiritual awakening. The snake appears when your life force energy is rising. The snake also represents primal wisdom. The snake is one of the oldest symbols in human history. The snake appears when you need ancient knowledge. The snake asks you to go deep. The snake appears when you need to shed your skin. The old you is too small. You must grow. Transformation is uncomfortable. The snake does not resist the shedding. Neither should you. What must you release to become who you are meant to be? The snake knows. Shed it. Move forward.`,
  reversed: `Snake reversed suggests resistance to transformation, holding onto what should be shed, or blocked energy. You may be clinging to an old identity that is too small for you. The snake asks you to release. Shedding is not loss. It is growth. Let go. Become.`,
});

register({
  title: "wild-unknown-animal|Horse",
  category: "The Wild Unknown Animal Spirit",
  keywords: ["freedom", "power", "movement", "spirit", "wildness"],
  symbolism: "A horse galloping at full speed, mane and tail streaming, body stretched in a moment of pure motion. The horse is drawn in sweeping, fluid lines. The horse is not tamed, not saddled, not bridled. The horse is pure freedom, pure power, pure spirit.",
  upright: `The Horse appears when you need to move. The horse is the embodiment of freedom and forward motion. The horse appears when you have been stuck, stagnant, waiting. The horse asks you to run. The horse also represents power. The horse is powerful beyond what most people realize. The horse appears when you need to access your personal power. The horse asks you to know your strength. The horse also represents spirit. The horse carries the soul on its back. The horse appears when you need to connect with your spiritual nature. The horse asks you to trust your spirit to carry you. The horse also represents wildness. The horse has been domesticated, but its spirit remains wild. The horse appears when you need to reclaim your wild freedom. The horse appears when you need to stop letting others control your direction. The horse asks you to run your own race. The horse asks you to feel the wind in your mane. You were born to run. You were born free. The horse reminds you. Gallop.`,
  reversed: `Horse reversed suggests feeling stuck, powerless, or constrained. You may be letting others control your direction. The horse asks you to reclaim your freedom. You are not meant to be fenced in. Break free. Run. The wild is waiting.`,
});

})();

/* ══════════════════════════════════════════════════
   THE WILD UNKNOWN ARCHETYPES (Kim Krans, 78 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "wild-unknown-archetype|The Seeker",
  category: "The Wild Unknown Archetypes",
  keywords: ["quest", "curiosity", "search", "restlessness", "exploration"],
  symbolism: "A figure stands at a crossroads, staff in hand, facing the unknown. The path ahead disappears into mist. The figure's back is to the familiar. The seeker has chosen the unknown. The drawing is stark, minimal, black and white. The seeker stands alone.",
  upright: `The Seeker appears when you are called to a quest. The Seeker is driven by an inner restlessness, a hunger for something more. The Seeker appears when the familiar no longer satisfies. The Seeker asks you to follow your curiosity. The Seeker also represents the search for truth. The Seeker is not content with easy answers. The Seeker wants to know for themselves. The Seeker appears when you need to question everything you have been told. The Seeker appears when you must leave behind the known. The Seeker appears when you are entering new territory. The Seeker asks you to trust the unknown. The Seeker carries a staff but no map. The Seeker does not know where the path leads. The Seeker goes anyway. The Seeker appears when you need courage. The Seeker also represents the eternal student. The Seeker is always learning, always growing, always asking. The Seeker appears when you need to stay curious. The Seeker is the part of you that knows the answer is out there, just beyond the horizon. Keep walking. Keep seeking. The path reveals itself to those who walk it.`,
  reversed: `The Seeker reversed suggests a loss of direction, giving up the search, or settling for easy answers. You may have stopped asking questions. The Seeker asks you to renew your curiosity. The quest is not over. Keep seeking. The answer is worth the journey.`,
});

register({
  title: "wild-unknown-archetype|The Lover",
  category: "The Wild Unknown Archetypes",
  keywords: ["passion", "connection", "devotion", "surrender", "heart"],
  symbolism: "Two figures merge into one shape, their bodies intertwined, indistinguishable from each other. The drawing is composed of flowing lines that weave together. The lovers have no boundaries between them. They are one being, one heart, one breath.",
  upright: `The Lover appears when you are called to deep connection. The Lover is not about romance alone. The Lover is about the capacity to connect deeply with anyone or anything. The Lover appears when you need to open your heart. The Lover also represents passion. The Lover is passionate about life, about people, about causes, about art. The Lover appears when you need to bring passion into your life. The Lover appears when you have been living without passion. The Lover also represents devotion. The Lover is devoted to what they love. The Lover appears when you need to commit. The Lover also represents surrender. The Lover surrenders to love. The Lover appears when you need to let down your walls. The Lover appears when you need to merge. The Lover asks you to let someone in. The Lover asks you to let yourself love fully, without reservation. The Lover is not afraid of losing themselves in love. The Lover knows that connection is the point of being alive. The Lover appears when you need to remember that love is the answer. Open your heart. Surrender. Love.`,
  reversed: `The Lover reversed suggests a closed heart, fear of intimacy, or passion blocked. You may be protecting yourself from love. The Lover asks you to examine your walls. Who are you keeping out? Who are you keeping yourself from? Open the heart. It is safe to love.`,
});

register({
  title: "wild-unknown-archetype|The Magician",
  category: "The Wild Unknown Archetypes",
  keywords: ["power", "creation", "skill", "transformation", "will"],
  symbolism: "A figure stands before a table, one hand pointing to the sky, one hand pointing to the earth. Between the hands, a glowing orb. The figure is crowned and robed. The tools of creation are on the table. The Magician is the conduit between heaven and earth.",
  upright: `The Magician appears when you have all the tools you need. The Magician is the master of creation, the one who can transform vision into reality. The Magician appears when you need to take action. The Magician also represents will. The Magician uses focused will to create change. The Magician appears when you need to apply your will with precision. The Magician also represents skill. The Magician has mastered their craft. The Magician appears when you need to develop your skills. The Magician also represents timing. The Magician knows when to act. The Magician appears when the timing is right. The Magician asks you to trust your abilities. The Magician appears when you are ready to create something significant. The Magician appears when you have everything you need. The only question is whether you will act. The Magician asks you to act. The Magician asks you to channel the power flowing through you. The universe is waiting for you to create. What will you bring into being? The Magician is ready. Are you?`,
  reversed: `The Magician reversed suggests untapped potential, misuse of power, or a failure to act. You have the tools but are not using them. The Magician asks you to step into your power. The universe is waiting. Stop hesitating. Create.`,
});

register({
  title: "wild-unknown-archetype|The Healer",
  category: "The Wild Unknown Archetypes",
  keywords: ["wounding", "wholeness", "compassion", "integration", "medicine"],
  symbolism: "A figure stands with arms open, chest exposed. A wound is visible over the heart, but from the wound, light streams out. The healer is not unbroken. The healer is broken in a way that allows light to enter. The drawing is tender and powerful.",
  upright: `The Healer appears when you are called to heal. The Healer appears when you are both the healer and the one being healed. The Healer knows that healing is not about fixing. Healing is about integrating. The Healer appears when you need to bring together the broken parts of yourself. The Healer also represents compassion. The Healer has been wounded and knows the pain of others. The Healer appears when you need to be compassionate with yourself and others. The Healer also represents medicine. The Healer carries knowledge of what heals. The Healer appears when you need to find the right medicine for your wound. The Healer appears when you need to acknowledge your wounds. The Healer also knows that the wound is where the light enters. The Healer appears when you are ready to transform your pain into wisdom. The Healer asks you to stop hiding your wounds. Your brokenness is not a weakness. It is a source of power. The Healer asks you to let the light in. Heal. Then help others heal. This is the healer's way.`,
  reversed: `The Healer reversed suggests denial of wounds, refusal to heal, or helping others to avoid helping yourself. You may be focusing on fixing others to avoid facing your own pain. The Healer asks you to turn your medicine on yourself. Heal yourself first. Your wounds are worthy of attention.`,
});

register({
  title: "wild-unknown-archetype|The Fool",
  category: "The Wild Unknown Archetypes",
  keywords: ["innocence", "trust", "leap", "beginning", "faith"],
  symbolism: "A figure stands at the edge of a cliff, one foot in the air, about to step off. The figure carries a small bundle on a stick. The face is open, trusting, almost foolish. Below the cliff, clouds obscure the bottom. The fool does not look down.",
  upright: `The Fool appears when you are being asked to take a leap of faith. The Fool does not know what is below. The Fool does not need to know. The Fool trusts that the universe will catch them. The Fool appears when you need to begin something new. The Fool appears when you need to trust the unknown. The Fool also represents innocence. The Fool sees the world with fresh eyes. The Fool appears when you need to approach life with beginner's mind. The Fool also represents freedom. The Fool is not weighed down by expectations. The Fool carries only a small bundle, carrying only what is essential. The Fool appears when you need to simplify. The Fool appears when you need to take a risk. The Fool appears when you have been playing it too safe. The Fool asks you to step off the edge. The Fool also represents divine madness. The Fool is considered blessed by the gods. The Fool appears when you need to trust that you are guided. The Fool appears when you need to be brave enough to look foolish. Take the leap. The net will appear.`,
  reversed: `The Fool reversed suggests fear of taking risks, over-caution, or foolish decisions made without foresight. You may be hesitating at the edge when you need to leap. The Fool asks you to examine your fear. Is it real danger or fear of looking foolish? Trust. Leap. The universe catches those who take the risk.`,
});

register({
  title: "wild-unknown-archetype|The Mother",
  category: "The Wild Unknown Archetypes",
  keywords: ["nurturing", "protection", "creation", "abundance", "fierce love"],
  symbolism: "A great maternal figure, vast and encompassing, arms open wide. From her body flow rivers, trees, stars. She is the source of life. Her face is ancient and young at once. She is the mother of all things, fierce and tender, giving and holding.",
  upright: `The Mother appears when you are being called to nurture. The Mother is the source of life, the giver of care, the protector of the vulnerable. The Mother appears when you need to nurture yourself or someone else. The Mother also represents abundance. The Mother's body produces milk, food, life itself. The Mother appears when you need to trust that you will be provided for. The Mother also represents fierce love. The mother will fight for her children. The Mother appears when you need to protect what is precious. The Mother also represents creation. The Mother brings forth life. The Mother appears when you are creating something new, whether a child, a project, or a new chapter. The Mother appears when you need to be patient with growth. The Mother does not rush the baby. The Mother trusts the process of gestation. The Mother appears when you need to be held. The Mother also appears when you need to hold someone else. The Mother appears when you need to remember that you are held by the great Mother of all things. You are nurtured. You are safe. You are loved.`,
  reversed: `The Mother reversed suggests neglect of self or others, smothering, or difficulty receiving nurturing. You may be giving too much or not allowing yourself to be held. The Mother asks you to find balance. Nurture yourself so you can nurture others. Receive care. It is your right.`,
});

})();

/* ══════════════════════════════════════════════════
   DIVINE FEMININE ORACLE (Meggan Watterson, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "divine-feminine|Mary Magdalene",
  category: "Divine Feminine Oracle",
  keywords: ["devotion", "love", "resilience", "sacred feminine", "witness"],
  symbolism: "A woman with long red hair stands in a desert landscape, holding an alabaster jar. Her eyes are piercing and kind. She is dressed in simple robes. Behind her, the sun is rising. She is the one who witnesses, the one who stays, the one who loves completely.",
  upright: `Mary Magdalene appears when you are called to a love that does not waver. Mary Magdalene has been misunderstood, maligned, and diminished, yet she remains devoted. She appears when you need to stay loyal to your truth despite what others say. Mary Magdalene also represents resilience. She has been called many things, none of them true. She appears when you need to rise above the stories others tell about you. Mary Magdalene also represents sacred partnership. She walked with Jesus as an equal. She appears when you need to honor the sacred partnership in your life. Mary Magdalene also represents the witness. She was the first to witness the resurrection. She appears when you are called to witness something sacred. Mary Magdalene appears when you need to trust the love that holds you. She appears when you need to be brave enough to love completely. She also represents the alabaster jar, the container of precious oil. She appears when you need to offer what is most precious to you. Mary Magdalene asks you to love without reservation. Love is the only truth. Love is the only thing that remains.`,
  reversed: `Mary Magdalene reversed suggests a loss of faith in love, feeling betrayed by your devotion, or allowing others' opinions to diminish you. You may be forgetting your worth. Mary Magdalene asks you to remember who you are. No one else gets to define you. Love yourself. Stay true.`,
});

register({
  title: "divine-feminine|Rumi",
  category: "Divine Feminine Oracle",
  keywords: ["union", "divine love", "poetry", "ecstasy", "surrender"],
  symbolism: "A figure spins in ecstatic dance, robes flowing, arms open to the sky. The movement is a prayer. The figure is lost in love of the divine. The ecstasy is visible in every line of the body. The dancer is both human and divine, spinning toward union.",
  upright: `Rumi appears when you are called to divine love. Rumi was a poet of love, a mystic who knew that love is the path to the divine. Rumi appears when you need to fall in love with life again. Rumi also represents ecstasy. Rumi's poetry is ecstatic, overflowing with love for the beloved. Rumi appears when you need to let yourself feel joy completely. Rumi also represents surrender. Rumi teaches that the intellect can only take you so far. At some point, you must surrender to love. Rumi appears when you need to let go of control and let love lead. Rumi also represents union. Rumi's poetry speaks of the longing to return to the source, to merge with the beloved. Rumi appears when you are ready for union. Rumi appears when you need to remember that you are not separate. Rumi appears when you need to open your heart to the vastness of love. Rumi appears when you need to dance. Rumi appears when your soul needs to express itself. Rumi says, "Dance, when you are broken open. Dance, when you have torn the bandage off." Rumi appears when the only appropriate response to life is ecstatic surrender. Dance. Love. Become one.`,
  reversed: `Rumi reversed suggests a disconnection from divine love, intellectualizing instead of feeling, or fear of ecstatic surrender. You may be holding back from fully loving. Rumi asks you to let down your guard. Love is not something to understand. Love is something to become. Surrender.`,
});

register({
  title: "divine-feminine|Sophia",
  category: "Divine Feminine Oracle",
  keywords: ["wisdom", "sacred knowledge", "truth", "insight", "divine feminine"],
  symbolism: "A woman sits on a throne, holding an open book in one hand and a lamp in the other. Her face is calm and knowing. She is neither young nor old. She is wisdom itself. The lamp illuminates the darkness. The book contains all knowledge. She is Sophia, holy wisdom.",
  upright: `Sophia appears when you need wisdom. Sophia is the personification of divine wisdom, the sacred feminine aspect of God. Sophia appears when you need to access deep knowing. Sophia also represents truth. Sophia is not impressed by opinions or beliefs. Sophia wants to know what is true. Sophia appears when you need to seek the truth. Sophia also represents sacred knowledge. Sophia holds the book of all knowledge. Sophia appears when you need to study, learn, and understand. Sophia appears when you are called to be a student of wisdom. Sophia also represents light. Sophia carries a lamp to illuminate the darkness. Sophia appears when you need to see clearly. Sophia appears when confusion has clouded your vision. Sophia asks you to seek wisdom. Sophia asks you to value truth above comfort. Sophia appears when you are ready to know. Sophia appears when you are ready to grow. Sophia does not give easy answers. Sophia gives the tools to find your own answers. Sophia is patient. Sophia is wise. Sophia appears when you are ready to receive her. Open the book. Light the lamp. Seek the truth.`,
  reversed: `Sophia reversed suggests a rejection of wisdom, choosing ignorance, or being misled by false knowledge. You may be avoiding the truth because it is uncomfortable. Sophia asks you to be brave enough to know. The truth will set you free. Seek it.`,
});

register({
  title: "divine-feminine|Inanna",
  category: "Divine Feminine Oracle",
  keywords: ["descent", "power", "queenship", "shadow work", "rebirth"],
  symbolism: "A winged goddess descends through layers of darkness. She is crowned and robed, but as she descends, her garments are removed one by one. At the bottom, she is naked, stripped of everything. Below, her sister Ereshkigal waits. Inanna must face what she has avoided.",
  upright: `Inanna appears when you must descend into the underworld. Inanna is the Sumerian goddess who descended to the underworld to face her sister Ereshkigal. She appears when you must face your shadow. Inanna also represents the journey of stripping away. Inanna had to give up her crown, her robes, her jewels, everything that defined her. Inanna appears when you must let go of your identities. Inanna also represents power. Inanna is the queen of heaven and earth. She appears when you need to claim your power. Inanna appears when you need to acknowledge your sovereignty. Inanna also represents the cycle of descent and rebirth. Inanna descended, was killed, and was reborn. Inanna appears when you are in the descent, but rebirth is coming. Inanna appears when you are being asked to face what you have avoided. Inanna appears when you need to go into the darkness. Inanna appears when you need to meet your shadow. The descent is not punishment. The descent is transformation. Inanna shows you that you can survive the journey. You will emerge stronger.`,
  reversed: `Inanna reversed suggests resistance to shadow work, refusal to descend, or getting stuck in the underworld. You may be avoiding what needs to be faced. Inanna asks you to go into the darkness. What you fear is not as terrifying as you think. Descend. Face it. Rise again.`,
});

register({
  title: "divine-feminine|Kuan Yin",
  category: "Divine Feminine Oracle",
  keywords: ["compassion", "mercy", "hearing", "presence", "grace"],
  symbolism: "A serene figure in flowing white robes stands on a lotus, holding a vase of healing water in one hand and a willow branch in the other. Her eyes are half-closed in compassion. She is the one who hears the cries of the world. She is mercy embodied.",
  upright: `Kuan Yin appears when you need compassion. Kuan Yin is the bodhisattva of compassion, the one who hears the cries of the world. She appears when you need to be gentle with yourself. Kuan Yin also represents mercy. Kuan Yin is not judgmental. Kuan Yin does not keep score. Kuan Yin appears when you need forgiveness. Kuan Yin appears when you need to extend mercy to yourself or someone else. Kuan Yin also represents presence. Kuan Yin is fully present to suffering. She does not turn away. Kuan Yin appears when you need someone to witness your pain. Kuan Yin also represents grace. Grace is unearned love. Grace is the compassion that flows freely. Kuan Yin appears when you need to remember that you are loved unconditionally. Kuan Yin appears when you need to pour healing water on your wounds. Kuan Yin appears when you need to know that you are heard. The universe hears your cries. You are not alone. Kuan Yin is with you. Kuan Yin is compassion itself. Let her mercy flow to you and through you. Be gentle. Be kind. Be merciful. This is the path of Kuan Yin.`,
  reversed: `Kuan Yin reversed suggests a lack of compassion, harsh self-judgment, or refusal to extend mercy. You may be being too hard on yourself or others. Kuan Yin asks you to soften. Judgment is not the way. Compassion is. Be gentle. Forgive. Mercy is available. Accept it and extend it.`,
});

register({
  title: "divine-feminine|Durga",
  category: "Divine Feminine Oracle",
  keywords: ["protection", "fierce love", "boundaries", "warrior", "strength"],
  symbolism: "A many-armed goddess rides a lion, weapons in each hand. Her face is fierce but serene. She is the protector of the innocent. She is the divine mother. She is not aggressive. She is responsive. She takes up arms only in defense of love.",
  upright: `Durga appears when you need protection. Durga is the divine mother as warrior, riding a lion into battle against the forces of darkness. She appears when you need to defend yourself. Durga also represents fierce love. Durga's love is not soft. Durga's love is fierce. Durga appears when you need to be fierce in your love. Durga also represents boundaries. Durga does not let anyone cross the line. Durga appears when you need to set and enforce boundaries. Durga also represents righteous anger. Durga does not suppress her anger. Durga uses her anger to protect. Durga appears when your anger is telling you something important. Durga appears when you need to fight for what is right. Durga appears when you need to take a stand. Durga also represents the power of the divine feminine. She is not less powerful because she is feminine. She is more powerful because she is feminine. Durga appears when you need to know that true strength combines fierceness with love. Durga says: You are protected. You are powerful. You are fierce. Do not be afraid to fight for what matters. Ride your lion. Take up your weapons. Defend love.`,
  reversed: `Durga reversed suggests insufficient boundaries, inability to protect yourself, or fear of your own power. You may be suppressing righteous anger or allowing others to cross your boundaries. Durga asks you to find your fierceness. It is okay to fight for yourself. You are worth defending.`,
});

})();

/* ══════════════════════════════════════════════════
   THE UNIVERSE HAS YOUR BACK (Gabby Bernstein, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "universe-has-back|Trust the Timing",
  category: "The Universe Has Your Back",
  keywords: ["patience", "divine timing", "trust", "surrender", "faith"],
  symbolism: "A clock whose hands are spiraling galaxies instead of numbers. The face of the clock is deep space, full of stars and nebulas. Time is not linear. Time is vast, curved, and mysterious. The hour hand and minute hand spiral toward an unknown but perfect moment.",
  upright: `Trust the Timing appears when you are feeling impatient. You want things to happen faster. You think you know when things should happen. This card reminds you that there is a divine timing at work. Trust the Timing asks you to release your timeline and surrender to the universal timeline. Trust the Timing also reminds you that everything is happening for you, not against you. The delay is a protection. The delay is a preparation. When you trust the timing, you release anxiety. Trust the Timing also asks you to remember that you are exactly where you need to be. Not behind. Not ahead. Exactly where you need to be. The universe is orchestrating something perfect. You cannot see the whole picture. You do not need to. Trust the Timing asks you to relax into the now. Trust the Timing asks you to have faith. The universe has your back. The universe knows the right time. Let go of your watch. Let go of your timeline. Trust the timing. Everything is unfolding perfectly.`,
  reversed: `Trust the Timing reversed suggests impatience, forcing things before their time, or lack of faith in divine timing. You may be trying to rush the universe. The card asks you to slow down. The timing is perfect, even if it does not feel that way. Surrender your schedule. Trust.`,
});

register({
  title: "universe-has-back|Choose Love",
  category: "The Universe Has Your Back",
  keywords: ["love", "fear", "choice", "freedom", "alignment"],
  symbolism: "A figure stands at a crossroads. One path leads into darkness. One path leads into light. Above the figure, a heart glows in the chest. The figure is choosing. The heart knows the way. Choose Light. Choose Love. Choose the path that lights you up.",
  upright: `Choose Love appears when you are at a crossroads. Every moment, you are choosing between love and fear. Choose Love reminds you that you always have a choice. Choose Love appears when you are being pulled toward fear. The fear may feel real. The fear may feel justified. Choose Love asks you to choose love anyway. Choose Love also represents freedom. When you choose love, you are free. When you choose fear, you are trapped. Choose Love appears when you are ready to be free. Choose Love also represents alignment. When you choose love, you align with your true nature. When you choose love, you align with the universe. Choose Love appears when you need to get back into alignment. Choose Love asks you to check in with yourself. What would love do? What would love say? Choose Love asks you to answer those questions and act on them. The heart knows the way. The heart is never wrong. Choose Love. Every time. No exceptions. Love is the only choice that sets you free.`,
  reversed: `Choose Love reversed suggests choosing fear over love, being stuck in fear-based thinking, or forgetting that you have a choice. The card asks you to pause and notice the fear. Now, choose differently. The choice is still yours. You can always choose love. Always.`,
});

register({
  title: "universe-has-back|You Are a Miracle",
  category: "The Universe Has Your Back",
  keywords: ["wonder", "gratitude", "uniqueness", "awe", "celebration"],
  symbolism: "A figure stands looking at their reflection, but the reflection is made of stars. The figure is ordinary and extraordinary at the same time. The reflection shows the truth: this being is made of stardust, a miracle of consciousness in a vast universe.",
  upright: `You Are a Miracle appears when you have forgotten your magnificence. You have been looking at yourself with critical eyes. You Are a Miracle reminds you of the truth. You are not a mistake. You are not ordinary. You are a miracle. You Are a Miracle also represents wonder. The universe is full of wonder. You are part of that wonder. You Are a Miracle appears when you need to see yourself with fresh eyes. You Are a Miracle also represents gratitude. When you know you are a miracle, gratitude flows. You Are a Miracle appears when you need to practice gratitude for your existence. You Are a Miracle also represents uniqueness. There has never been anyone exactly like you. There never will be. You Are a Miracle appears when you need to honor your uniqueness. You Are a Miracle asks you to celebrate yourself. You are not too much. You are not not enough. You are exactly the miracle the universe intended. Stop comparing. Stop criticizing. Start celebrating. You are a miracle. Live like one.`,
  reversed: `You Are a Miracle reversed suggests self-criticism, low self-worth, or forgetting your magnificence. You have been looking at yourself with unkind eyes. The card asks you to see yourself as the universe sees you. You are a miracle. Believe it.`,
});

register({
  title: "universe-has-back|Surrender",
  category: "The Universe Has Your Back",
  keywords: ["release", "trust", "letting go", "control", "faith"],
  symbolism: "Two hands open, releasing a bird into the sky. The bird is pure white. The hands are relaxed, not grasping. The bird does not look back. It flies free. The sky is wide open. The hands trust that the bird knows where it is going.",
  upright: `Surrender appears when you have been trying too hard. You have been gripping, controlling, forcing. Surrender asks you to let go. Surrender is not giving up. Surrender is releasing control and trusting a higher power. Surrender appears when you have done all you can do. Surrender asks you to release the outcome. Surrender also represents peace. The moment you surrender, peace arrives. The struggle ends. Surrender appears when you are exhausted from trying to control everything. Surrender asks you to trust the universe. The universe has your back. Surrender asks you to open your hands. Let it go. Let it be. Surrender also represents faith. Surrender requires faith. You cannot surrender if you do not trust. Surrender appears when you are being asked to deepen your faith. Surrender appears when you need to remember that you are not alone. You do not have to do this by yourself. Surrender is an act of trust. Surrender is an act of love. Open your hands. Release the bird. Trust that it knows where to fly. The universe is holding you. Let go. Surrender.`,
  reversed: `Surrender reversed suggests gripping, controlling, or refusing to release. You are trying to force outcomes through sheer will. The card asks you to examine your grip. What are you afraid will happen if you let go? Trust. The universe will catch you. Release.`,
});

register({
  title: "universe-has-back|Your Light Cannot Be Dimmed",
  category: "The Universe Has Your Back",
  keywords: ["inner light", "resilience", "truth", "shine", "authenticity"],
  symbolism: "A figure stands in a dark room, but light radiates from their chest, illuminating the space around them. Others in the room have their lights covered, hidden, or dimmed. The figure's light cannot be hidden. It shines without effort. It is who they are.",
  upright: `Your Light Cannot Be Dimmed appears when you have been hiding. You have been making yourself small to fit in, to not upset others, to be accepted. Your Light Cannot Be Dimmed reminds you that your light cannot be hidden. The universe needs your light. Your Light Cannot Be Dimmed also represents authenticity. The light is your true self. When you dim your light, you are hiding who you really are. Your Light Cannot Be Dimmed appears when you are ready to be fully yourself. Your Light Cannot Be Dimmed also represents resilience. People may try to dim your light. The world may try to dim your light. But your light is eternal. Your Light Cannot Be Dimmed appears when you need to remember that no one can take away who you are. Your Light Cannot Be Dimmed asks you to shine. The world is darker without you. The world needs your unique light. You were not meant to blend in. You were meant to stand out. Stop hiding. Stop dimming. Shine bright. Your light cannot be dimmed. Let it blaze. Let it illuminate the darkness. The world needs your light.`,
  reversed: `Your Light Cannot Be Dimmed reversed suggests hiding your light, playing small, or allowing others to dim you. You may be afraid of shining too brightly. The card asks you to stop dimming your light. The world needs you to shine. You are not too much. Shine.`,
});

register({
  title: "universe-has-back|You Are Supported",
  category: "The Universe Has Your Back",
  keywords: ["support", "connection", "community", "angels", "guidance"],
  symbolism: "A figure stands with arms open, looking up. Above them, hands reach down. Around them, hands reach out. Some hands are human, some are made of light. The figure is surrounded by support on all sides. They are held, lifted, and loved by the invisible and visible alike.",
  upright: `You Are Supported appears when you feel alone. You think you are doing this by yourself. You Are Supported reminds you that you are not alone. The universe is supporting you. Your guides are supporting you. Your community is supporting you. You Are Supported appears when you need to ask for help. You Are Supported also represents connection. You are connected to a vast web of support. You Are Supported appears when you have felt isolated. You Are Supported also represents receiving. You Are Supported appears when you have been giving too much and receiving too little. You Are Supported asks you to open your hands and receive. You Are Supported also represents the invisible world. Angels, ancestors, guides, and the universe itself are supporting you. You Are Supported appears when you need to feel the love that surrounds you. You Are Supported asks you to take a breath and feel the support. It is here. It has always been here. You Are Supported asks you to lean into the support. You do not have to carry everything alone. You are held. You are loved. You are supported. Open your arms. Receive.`,
  reversed: `You Are Supported reversed suggests feeling alone, refusing help, or not recognizing the support around you. You may be isolating yourself when you need connection. The card asks you to reach out. The support is there, but you must be willing to receive it. You are not alone.`,
});

})();


/* ══════════════════════════════════════════════════
   ROSE ORACLE (Rebecca Campbell, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "rose-oracle|The Calling",
  category: "Rose Oracle",
  keywords: ["awakening", "call", "purpose", "soul", "invitation"],
  symbolism: "A single rosebud with morning sunlight glowing behind it. The layers of petals are just beginning to open. The light illuminates the rose from within. The rose is young but ready. The call is gentle but persistent. The rose is being invited to bloom.",
  upright: `The Calling appears when your soul is inviting you to something more. You may feel a restlessness, a pull, a quiet knowing that there is more to your life. The Calling asks you to listen. The Calling also represents awakening. You are waking up to your soul's purpose. The Calling appears when you are being invited to remember why you came here. The Calling also represents choice. You can ignore the calling. Many do. But the calling will not go away. The Calling appears when you must choose to answer or not. The Calling asks you to answer the call. The calling does not ask you to have a plan. It does not ask you to know how. It simply asks you to say yes. The calling is an invitation to a life of meaning. The calling is the rose opening. The calling is the soul remembering. The Calling asks you to say yes. Say yes to your soul. Say yes to your purpose. Say yes to the life you came here to live. The calling is here. Will you answer?`,
  reversed: `The Calling reversed suggests ignoring your soul's invitation, fear of your purpose, or refusing to answer the call. You may be staying small to avoid the responsibility of your calling. The card asks you to listen. The calling will not stop until you answer. Say yes.`,
});

register({
  title: "rose-oracle|The Root",
  category: "Rose Oracle",
  keywords: ["foundation", "grounding", "stability", "origin", "earth"],
  symbolism: "The roots of a rose bush deep underground, spreading through dark, rich soil. The roots are thick and strong. They anchor the rose. Above ground, we see only the bloom. But the bloom depends on the root. The root is unseen but essential.",
  upright: `The Root appears when you need to focus on your foundation. The root is the part of the rose that is hidden, yet everything depends on it. The Root appears when you need to strengthen your foundation. The Root also represents grounding. The root connects the rose to the earth. The root keeps the rose stable. The Root appears when you feel ungrounded. The Root asks you to connect with the earth. The Root also represents origin. The root holds the history of the rose. Everything that the rose becomes is encoded in the root. The Root appears when you need to honor where you come from. The Root also represents stability. The rose can weather any storm because of its root. The Root appears when you need stability. The Root asks you to root yourself deeply. The deeper the root, the higher the rose can reach. The Root appears when you need to build a strong foundation. What are you building your life on? Is it solid? The Root asks you to strengthen your foundation so you can bloom without fear. Root yourself. Ground yourself. The bloom depends on it.`,
  reversed: `The Root reversed suggests instability, weak foundations, or being uprooted. You may be trying to bloom without a strong foundation. The card asks you to focus on your roots. Build a solid foundation. Ground yourself. The bloom will come when the root is ready.`,
});

register({
  title: "rose-oracle|The Thorn",
  category: "Rose Oracle",
  keywords: ["protection", "boundary", "defense", "sharp truth", "armor"],
  symbolism: "A close-up of a rose stem with a sharp thorn. The thorn is not aggressive. It is defensive. The thorn says: approach with care. The thorn is part of the rose's nature. The rose does not apologize for its thorns. The thorn protects the bloom.",
  upright: `The Thorn appears when you need to examine your boundaries. The thorn is the part of the rose that says, "This far and no further." The Thorn appears when your boundaries need attention. The Thorn also represents protection. The thorn protects the rose from being consumed. The Thorn appears when you need to protect yourself. The Thorn also represents sharp truth. Sometimes the truth is sharp. Sometimes the truth must pierce. The Thorn appears when you need to speak or hear a sharp truth. The Thorn also represents the parts of you that are not soft. You do not need to be soft all the time. You are allowed to have thorns. The Thorn appears when you need to honor your defenses. The Thorn reflects the balance of the rose: beauty and protection, softness and sharpness. The Thorn asks you to honor your boundaries. It is okay to say no. It is okay to protect yourself. The Thorn asks you to be clear about what you will and will not tolerate. The rose has thorns for a reason. So do you. Honor them.`,
  reversed: `The Thorn reversed suggests weak boundaries, being taken advantage of, or fear of asserting yourself. You may be avoiding conflict at the expense of your well-being. The card asks you to grow your thorns. It is safe to protect yourself. Boundaries are love. Set them.`,
});

register({
  title: "rose-oracle|The Bloom",
  category: "Rose Oracle",
  keywords: ["flowering", "full expression", "beauty", "fulfillment", "radiance"],
  symbolism: "A fully opened rose in perfect bloom. Every petal is in its place. The rose is not holding back. It is fully, completely itself. The rose gives its beauty without reservation. The bloom does not last forever, but while it lasts, it is magnificent.",
  upright: `The Bloom appears when you are in a season of flowering. You have done the root work. You have grown the thorns. Now it is time to bloom. The Bloom appears when you are being asked to express yourself fully. The Bloom also represents fulfillment. The bloom is the fulfillment of the rose's purpose. Every rose is meant to bloom. The Bloom appears when you are fulfilling your purpose. The Bloom also represents beauty. The bloom is beautiful, not because it tries to be, but because it is fully itself. The Bloom appears when you need to recognize your own beauty. The Bloom also represents radiance. The bloom radiates beauty without effort. The Bloom appears when you are being asked to let your light shine. The Bloom asks you to stop holding back. You have done the work. You are ready. The Bloom asks you to open fully. Let yourself be seen. Let yourself be beautiful. Let yourself be completely, unapologetically you. This is your season of flowering. The Bloom does not question its beauty. The Bloom does not hide. The Bloom opens. The Bloom shines. The Bloom is you.`,
  reversed: `The Bloom reversed suggests holding back your full expression, fear of being seen, or a bloom that is being suppressed. You may be afraid of your own beauty and power. The card asks you to open. The world needs you in full bloom. Do not hide. Flower.`,
});

register({
  title: "rose-oracle|The Wilt",
  category: "Rose Oracle",
  keywords: ["ending", "release", "completion", "decay", "cycle"],
  symbolism: "A rose whose petals have browned and are falling. The stem is bending. The rose is dying, but there is a quiet dignity in the wilt. The rose does not fight the wilt. The wilt is not failure. The wilt is completion. The cycle continues.",
  upright: `The Wilt appears when something is ending. The Wilt is not a card of failure. It is a card of completion. Everything that blooms must eventually wilt. The Wilt appears when a season of life is ending. The Wilt also represents release. The rose releases its petals without struggle. The Wilt appears when you need to release something. The Wilt also represents the cycle of life. The wilt feeds the soil. The wilt makes way for new blooms. The Wilt appears when you need to trust the cycle. The Wilt also represents dignity in endings. The wilted rose is not ugly. It is complete. The Wilt appears when you need to honor an ending. The Wilt asks you to let go with grace. The Wilt asks you to trust that endings lead to beginnings. The rose does not fight the wilt. The rose completes its cycle. The Wilt appears when you need to complete a cycle. The Wilt asks you to honor what was, release it, and trust the soil that will nourish the next bloom. Every ending is a seed. Trust the Wilt. Trust the cycle.`,
  reversed: `The Wilt reversed suggests clinging to what is ending, refusing to release, or fighting the natural cycle. You may be trying to keep a dead rose alive. The card asks you to let go. The ending is not failure. It is completion. Release with grace. Trust the cycle.`,
});

register({
  title: "rose-oracle|The Gardener",
  category: "Rose Oracle",
  keywords: ["care", "tending", "patience", "cultivation", "nurturing"],
  symbolism: "A pair of gentle hands tending a rose bush. The hands are weathered and kind. They prune with care. They water with love. The gardener does not force the rose to bloom. The gardener creates the conditions for the bloom. The gardener trusts the process.",
  upright: `The Gardener appears when you are being asked to tend to your life with care. The gardener does not control the rose. The gardener nurtures the rose. The Gardener appears when you need to nurture yourself or something in your life. The Gardener also represents patience. The gardener cannot rush the bloom. The gardener must wait. The Gardener appears when you need to be patient. The Gardener also represents cultivation. The gardener prepares the soil, waters, and prunes. The Gardener appears when you need to do the slow work of cultivation. The Gardener also represents love. The gardener loves the rose. The gardener does not resent the care the rose requires. The Gardener appears when you need to do your work with love. The Gardener asks you to tend your life gently. The Gardener asks you to trust the process. You are the gardener of your own life. You cannot force the bloom. You can only create the conditions. The Gardener appears when you need to tend, wait, and trust. The bloom will come. The gardener knows this. The gardener is patient. The gardener trusts. Be the gardener. Tend with love. Trust the timing.`,
  reversed: `The Gardener reversed suggests neglect of what needs tending, forcing growth, or impatience with the process. You may be trying to rush the bloom or neglecting the care that is needed. The card asks you to tend your garden with love. Patience. Care. Trust.`,
});

})();

/* ══════════════════════════════════════════════════
   HEALING WITH THE ANGELS (Doreen Virtue, 88 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "healing-angels|Archangel Raphael",
  category: "Healing with the Angels",
  keywords: ["healing", "health", "guidance", "green light", "wholeness"],
  symbolism: "Archangel Raphael stands with a staff entwined by a serpent. He radiates a green healing light. His presence is warm, gentle, and deeply reassuring. He is the archangel of healing, sent to bring wholeness to body, mind, and spirit.",
  upright: `Archangel Raphael appears when healing is needed. He is the archangel of healing, the one who mends what is broken. He appears when you or someone you love needs healing. Archangel Raphael also represents guidance. He is a guide on your healing journey. He will show you what needs attention. Archangel Raphael also represents the green light of healing. His energy is green, the color of the heart chakra. He appears when you need to open your heart to healing. Archangel Raphael also represents wholeness. Healing is not just about fixing what is broken. Healing is about returning to wholeness. Archangel Raphael appears when you are ready to be whole. Archangel Raphael asks you to invite healing into your life. He asks you to believe that healing is possible. He asks you to open your heart to receive. Archangel Raphael is with you on this healing journey. His green light surrounds you. His love supports you. You are being healed. Trust the process. Trust Raphael.`,
  reversed: `Archangel Raphael reversed suggests blocked healing, resistance to health, or ignoring health issues. You may be refusing to address what needs attention. The card asks you to invite healing. Archangel Raphael is waiting. Ask for his help. Heal.`,
});

register({
  title: "healing-angels|Archangel Michael",
  category: "Healing with the Angels",
  keywords: ["protection", "courage", "truth", "power", "guidance"],
  symbolism: "Archangel Michael stands with a blue sword and shield. His blue light is powerful and calming. He is the protector, the warrior of light. His presence is strong and reassuring. He does not attack. He defends. He is the guardian.",
  upright: `Archangel Michael appears when you need protection. He is the archangel of protection, the one who guards and guides. He appears when you feel unsafe or vulnerable. Archangel Michael also represents courage. He gives you the courage to face your fears. He appears when you need to be brave. Archangel Michael also represents truth. He wields a sword of truth. He appears when you need to speak or know the truth. Archangel Michael also represents power. He helps you stand in your power. He appears when you need to reclaim your power. Archangel Michael asks you to call on him for protection. He asks you to be brave. Archangel Michael asks you to stand in your truth. He is the guardian of your heart and your home. Call on Archangel Michael. He is with you. You are protected. You are safe. You are guided.`,
  reversed: `Archangel Michael reversed suggests feeling unprotected, lacking courage, or fear of the truth. You may have forgotten that you are protected. The card asks you to call on Archangel Michael. He is waiting. Ask for his protection. Be brave.`,
});

register({
  title: "healing-angels|Archangel Gabriel",
  category: "Healing with the Angels",
  keywords: ["communication", "creativity", "new beginnings", "clarity", "messenger"],
  symbolism: "Archangel Gabriel holds a golden trumpet and a white lantern. Her copper light is warm and creative. She is the messenger angel, the one who brings news, inspiration, and new beginnings. Her presence is clear, direct, and full of creative fire.",
  upright: `Archangel Gabriel appears when you are being called to communicate or create. Gabriel is the messenger angel, the one who helps you speak your truth and birth your creative visions. Archangel Gabriel also represents new beginnings. Gabriel appears when a new chapter is beginning. Archangel Gabriel also represents clarity. Gabriel cuts through confusion. Archangel Gabriel also represents creativity. Gabriel inspires artists, writers, and creators. Archangel Gabriel appears when you need to express yourself. Gabriel asks you to speak your truth. Gabriel asks you to birth your creative vision. Gabriel asks you to embrace the new beginning. Archangel Gabriel is with you. Trust her guidance. Communicate with clarity. Create with passion. The message must be delivered. The vision must be born. Gabriel is here to help.`,
  reversed: `Archangel Gabriel reversed suggests blocks in communication, creative blocks, or fear of new beginnings. You may be holding back your truth or your creative gifts. Gabriel asks you to speak, create, and begin. The message and the vision need you.`,
});

register({
  title: "healing-angels|Archangel Uriel",
  category: "Healing with the Angels",
  keywords: ["wisdom", "insight", "prophecy", "understanding", "light"],
  symbolism: "Archangel Uriel holds an open book and a lantern. His golden yellow light radiates wisdom and understanding. He is the archangel of wisdom, the one who brings insight and understanding. His presence illuminates the mind.",
  upright: `Archangel Uriel appears when you need wisdom. He is the archangel of wisdom, the one who brings insight and understanding. He appears when you need clarity of mind. Archangel Uriel also represents prophecy. He helps you see what is coming. He appears when you need foresight. Archangel Uriel also represents understanding. He helps you understand complex situations. He appears when confusion clouds your mind. Archangel Uriel also represents the light of knowledge. His lantern illuminates the darkness. Archangel Uriel appears when you need knowledge. Archangel Uriel asks you to seek wisdom. He asks you to trust your insights. He asks you to be open to understanding. Archangel Uriel says: The answers are available. I will help you find them. Open your mind. Seek wisdom. Trust what you discover.`,
  reversed: `Archangel Uriel reversed suggests mental confusion, lack of insight, or rejection of wisdom. You may be ignoring the answers that are available. The card asks you to open your mind. Seek understanding. The wisdom you need is available. Ask and you will receive.`,
});

register({
  title: "healing-angels|Archangel Jophiel",
  category: "Healing with the Angels",
  keywords: ["beauty", "joy", "positivity", "upliftment", "art"],
  symbolism: "Archangel Jophiel stands surrounded by golden light, holding a rose. Her pinkish-gold light is beautiful, joyful, and uplifting. She is the archangel of beauty and joy. Her presence makes everything lighter, brighter, and more beautiful.",
  upright: `Archangel Jophiel appears when you need beauty and joy. She is the archangel of beauty, the one who helps you see the beauty in yourself and your life. She appears when life feels heavy. Archangel Jophiel also represents positivity. She helps you shift your perspective. She appears when you need to see the bright side. Archangel Jophiel also represents creativity. She inspires artists and creators. She appears when you need creative inspiration. Archangel Jophiel also represents joy. She brings lightness and laughter. Archangel Jophiel appears when you need to lighten up. Archangel Jophiel asks you to find the beauty around you. She asks you to choose joy. She asks you to let in the light. Beauty is everywhere. Joy is available. Let Jophiel help you see it. Let her light lift you. Let her rose remind you of the beauty that is you.`,
  reversed: `Archangel Jophiel reversed suggests lack of joy, inability to see beauty, or negativity. You may be focusing on what is wrong instead of what is right. Jophiel asks you to shift your perspective. Beauty and joy are still here. Open your eyes. Let the light in.`,
});

register({
  title: "healing-angels|Archangel Chamuel",
  category: "Healing with the Angels",
  keywords: ["love", "peace", "comfort", "relationships", "heart"],
  symbolism: "Archangel Chamuel radiates a soft pink light, holding a glowing heart. His presence is gentle, comforting, and filled with unconditional love. He is the archangel of love and peace, the one who mends hearts and soothes emotions.",
  upright: `Archangel Chamuel appears when you need love and comfort. He is the archangel of love, the one who helps you feel loved and at peace. He appears when your heart is hurting. Archangel Chamuel also represents peace. He brings calm to emotional turmoil. He appears when you need inner peace. Archangel Chamuel also represents relationships. He helps heal relationships. He appears when you need help with a relationship. Archangel Chamuel also represents the heart. He opens and heals the heart. Archangel Chamuel appears when you need to feel love. Archangel Chamuel asks you to open your heart. He asks you to receive love. He asks you to let peace fill your being. You are loved. You are held. You are at peace. Chamuel is with you. His pink light surrounds you. Let love in. Let peace fill you. Chamuel is here to comfort you. You are not alone. You are loved.`,
  reversed: `Archangel Chamuel reversed suggests a closed heart, lack of peace, or difficulty receiving love. You may be blocking love out of fear. Chamuel asks you to open your heart. Love is safe. Love is available. Let it in. Let peace fill you.`,
});

})();


/* ══════════════════════════════════════════════════
   ARCHANGEL ORACLE (Doreen Virtue, 88 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "archangel-oracle|Archangel Michael",
  category: "Archangel Oracle",
  keywords: ["protection", "courage", "strength", "boundaries", "truth"],
  symbolism: "A warrior angel with a blue sword and shield stands against a sky filled with light. The sword is pointed downward, not in threat but in readiness. The shield is held close to the heart. The blue light of protection envelops everything.",
  upright: `Archangel Michael appears when you need protection and courage. He is the leader of the archangels, the one who guards and guides. He appears when you feel threatened or fearful. Archangel Michael also represents strength. He gives you the strength to face any challenge. He appears when you need to be strong. Archangel Michael also represents boundaries. He helps you set clear boundaries. He appears when your boundaries are being tested. Archangel Michael also represents truth. He is the angel of truth. He appears when you need to speak or know the truth. Archangel Michael asks you to call on him for protection. He asks you to be brave. He asks you to stand in your truth. Archangel Michael says: You are protected. You are strong. You are guided. Call on me and I will be with you. My sword cuts through illusion. My shield guards your heart. Be brave. Stand tall. You are safe.`,
  reversed: `Archangel Michael reversed suggests feeling unprotected, lacking courage, or difficulty with boundaries. You may have forgotten to ask for protection. The card asks you to call on Archangel Michael. He is ready to help. Ask. Be brave. You are not alone.`,
});

register({
  title: "archangel-oracle|Archangel Raphael",
  category: "Archangel Oracle",
  keywords: ["healing", "abundance", "guidance", "health", "prosperity"],
  symbolism: "An angel with green wings and a staff with a serpent. The green light of healing emanates from the angel. The angel carries a pouch of abundance. The room is filled with green light, the color of healing and prosperity.",
  upright: `Archangel Raphael appears when healing is needed. He is the archangel of healing, the one who restores health and well-being. He appears when you or someone you know needs healing. Archangel Raphael also represents abundance. He is associated with prosperity and abundance. He appears when you need financial healing. Archangel Raphael also represents guidance. He guides healers and those on a healing path. He appears when you need direction in your healing journey. Archangel Raphael also represents health. He helps maintain physical health. Archangel Raphael asks you to invite healing into your life. He asks you to trust the healing process. He asks you to open to abundance. Archangel Raphael says: I am with you on your healing journey. My green light surrounds you. Trust the healing. Receive the abundance. You are being restored to wholeness.`,
  reversed: `Archangel Raphael reversed suggests resistance to healing, health issues being ignored, or blocks to abundance. You may be avoiding what needs attention. Raphael asks you to invite healing. The healing is available. Open to it. Trust.`,
});

register({
  title: "archangel-oracle|Archangel Gabriel",
  category: "Archangel Oracle",
  keywords: ["communication", "creativity", "new beginnings", "messenger", "clarity"],
  symbolism: "An angel with copper wings holds a golden trumpet and a lantern. The copper light is warm and inspiring. The angel is ready to deliver a message or announce a new beginning.",
  upright: `Archangel Gabriel appears when you are being called to communicate, create, or begin something new. Gabriel is the messenger angel, the one who brings news and inspiration. Archangel Gabriel also represents creativity. Gabriel inspires artists, writers, and creators. Gabriel appears when you need to express yourself creatively. Archangel Gabriel also represents new beginnings. Gabriel announces new chapters and fresh starts. Archangel Gabriel also represents clarity. Gabriel helps you communicate with clarity and purpose. Archangel Gabriel asks you to speak your truth. Create your art. Begin your new chapter. Archangel Gabriel says: The message must be delivered. The vision must be born. I am with you. Speak clearly. Create boldly. Trust the new beginning.`,
  reversed: `Archangel Gabriel reversed suggests communication blocks, creative blocks, or fear of new beginnings. You may be holding back your message or your gift. Gabriel asks you to speak. The world needs what you have to say. Create. Communicate. Begin.`,
});

register({
  title: "archangel-oracle|Archangel Uriel",
  category: "Archangel Oracle",
  keywords: ["wisdom", "insight", "understanding", "knowledge", "prophecy"],
  symbolism: "An angel with golden wings holds an open book and a lantern. The yellow light of wisdom illuminates the darkness. The book contains ancient knowledge. The angel offers understanding and insight.",
  upright: `Archangel Uriel appears when you need wisdom and understanding. He is the archangel of wisdom, the one who brings insight and knowledge. He appears when you are seeking answers. Archangel Uriel also represents prophecy. He helps you see what is coming. He appears when you need foresight. Archangel Uriel also represents understanding. He helps you comprehend difficult situations. He appears when you are confused. Archangel Uriel also represents knowledge. He brings information and learning. Archangel Uriel asks you to seek wisdom. He asks you to trust your insights. He asks you to be open to understanding. Archangel Uriel says: The answers exist. I will help you find them. Open your mind. Seek knowledge. Trust your inner knowing. Wisdom is available. You have only to ask.`,
  reversed: `Archangel Uriel reversed suggests confusion, lack of insight, or rejection of wisdom. You may be ignoring the answers that are available. Uriel asks you to open your mind. The wisdom is here. Seek it. Trust it.`,
});

register({
  title: "archangel-oracle|Archangel Jophiel",
  category: "Archangel Oracle",
  keywords: ["beauty", "joy", "positivity", "creativity", "upliftment"],
  symbolism: "An angel with pink-gold wings holds a rose and a sunlit mirror. The light is warm, beautiful, and uplifting. The angel brings beauty and joy wherever she goes.",
  upright: `Archangel Jophiel appears when you need to see the beauty in yourself and your life. She is the archangel of beauty and joy, the one who uplifts and inspires. She appears when life feels heavy or dark. Archangel Jophiel also represents positivity. She helps you shift your perspective from negative to positive. She appears when you need a new outlook. Archangel Jophiel also represents creativity. She inspires artists and creators. She appears when you need creative inspiration. Archangel Jophiel also represents joy. She brings lightness and laughter. Archangel Jophiel asks you to find the beauty around you. She asks you to choose joy. She asks you to let in the light. Archangel Jophiel says: Beauty surrounds you. Joy is your birthright. Let me help you see the light. Look for the beauty. Choose joy. Let your spirit be lifted. You are surrounded by grace. Open your eyes and see it.`,
  reversed: `Archangel Jophiel reversed suggests negativity, inability to see beauty, or a lack of joy. You may be focusing on what is wrong instead of what is right. Jophiel asks you to shift your perspective. Beauty is still there. Joy is available. Look.`,
});

register({
  title: "archangel-oracle|Archangel Chamuel",
  category: "Archangel Oracle",
  keywords: ["love", "peace", "comfort", "relationships", "heart healing"],
  symbolism: "An angel with soft pink wings holds a glowing heart. The pink light is gentle, warm, and loving. The angel's presence brings peace and comfort to the heart.",
  upright: `Archangel Chamuel appears when you need love and comfort. He is the archangel of love, the one who helps you feel loved and at peace. He appears when your heart is hurting or when you need emotional support. Archangel Chamuel also represents peace. He brings calm to emotional turmoil. He appears when you need inner peace. Archangel Chamuel also represents relationships. He helps heal relationships. He appears when you need help with a relationship. Archangel Chamuel also represents heart healing. He mends broken hearts. Archangel Chamuel asks you to open your heart to love. He asks you to receive comfort. He asks you to find peace. Archangel Chamuel says: You are loved. You are held. You are at peace. Let my pink light surround you. Let love in. Let peace fill your heart. You are never alone. My love is with you.`,
  reversed: `Archangel Chamuel reversed suggests a closed heart, difficulty receiving love, or lack of peace. You may be blocking love out of fear or pain. Chamuel asks you to open your heart. Love is safe. Love is available. Let it in.`,
});

})();

/* ══════════════════════════════════════════════════
   RUMI ORACLE (Rassouli, 44 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "rumi-oracle|The Guest House",
  category: "Rumi Oracle",
  keywords: ["welcome", "all emotions", "presence", "hospitality", "non-judgment"],
  symbolism: "A candlelit doorway opens into a warm, welcoming space. All kinds of beings approach the door joy, sorrow, depression, gratitude. Each is welcomed equally. The house is the heart. The guests are all feelings. The host is presence itself.",
  upright: `The Guest House appears when you are being asked to welcome all of your emotions. Rumi's famous poem teaches that every feeling, even dark ones, is a guest in the house of your heart. The Guest House appears when you have been judging your emotions. The Guest House also represents presence. The host does not turn away any guest. The host welcomes each one with equal hospitality. The Guest House appears when you need to be present with all of your experience. The Guest House also represents non-judgment. Rumi says every guest has been sent as a guide from beyond. The Guest House appears when you need to stop judging your feelings as good or bad. The Guest House asks you to welcome every emotion. Welcome joy. Welcome sorrow. Welcome anger. Welcome love. Each guest has something to teach you. Each guest clears you out for some new delight. The Guest House asks you to be grateful for all who come. They are guides. They are gifts. Welcome them all.`,
  reversed: `The Guest House reversed suggests rejecting certain emotions, judging your feelings, or not allowing yourself to fully feel. You may be turning away guests that need to be welcomed. The card asks you to open the door. All feelings are welcome. All feelings are guides. Let them in.`,
});

register({
  title: "rumi-oracle|The Field",
  category: "Rumi Oracle",
  keywords: ["beyond", "thought", "freedom", "being", "mystery"],
  symbolism: "A vast, open field stretches to the horizon under a starry sky. There is no path, no marker, no destination. The field is beyond thinking, beyond concepts, beyond words. In the field, there is only being. There is only presence.",
  upright: `The Field appears when you are being called beyond your mind. Rumi speaks of a field beyond right and wrong, a place of pure being. The Field appears when you have been overthinking. The Field also represents freedom. In the field, there are no categories, no judgments, no concepts. There is only what is. The Field appears when you need freedom from your thoughts. The Field also represents mystery. The field cannot be understood. It can only be experienced. The Field appears when you are ready to let go of understanding. The Field also represents being. Not doing, not thinking, not achieving. Just being. The Field appears when you need to rest in pure presence. The Field asks you to meet Rumi in the field beyond. The Field asks you to lay down your concepts, your judgments, your categories. The Field asks you to rest in what is. Out beyond ideas of right and wrong, there is a field. Rumi will meet you there.`,
  reversed: `The Field reversed suggests being stuck in your mind, overthinking, or clinging to concepts. You may be trapped in judgment and categories. The field is available. The card asks you to lay down your thoughts. Step beyond. Rest in what is. Freedom awaits.`,
});

register({
  title: "rumi-oracle|The Beloved",
  category: "Rumi Oracle",
  keywords: ["divine love", "union", "longing", "devotion", "ecstasy"],
  symbolism: "Two figures merge into a single form, surrounded by golden light. The faces are indistinct because they are no longer separate. The lovers have become one. The longing is fulfilled. The union is complete. The Beloved and the lover are one.",
  upright: `The Beloved appears when you are being called into union with the divine. Rumi's poetry is a love song to the Beloved, the divine source of all love. The Beloved appears when you are ready for deeper connection. The Beloved also represents longing. Rumi says longing is the path. The ache for union is itself the way. The Beloved appears when you feel the ache of longing. The Beloved also represents devotion. The lover is devoted to the Beloved. The Beloved appears when you need to dedicate yourself to what you love. The Beloved also represents ecstasy. Union with the Beloved is the highest ecstasy. The Beloved appears when you are ready for ecstatic connection. The Beloved asks you to turn your heart toward the divine. The Beloved asks you to long, to ache, to love with complete devotion. The Beloved is the source of all love. The Beloved is the love itself. The Beloved is waiting for you. Turn your heart. Let yourself fall in love with the divine.`,
  reversed: `The Beloved reversed suggests a sense of separation from the divine, blocked longing, or difficulty feeling love. You may feel distant from the source. The Beloved asks you to turn back. The longing itself is the connection. The Beloved has never been separate from you.`,
});

register({
  title: "rumi-oracle|The Reed",
  category: "Rumi Oracle",
  keywords: ["separation", "song", "longing", "return", "music"],
  symbolism: "A reed flute lies on a dark surface. The reed has been cut from the reed bed. It longs to return. When played, it sings of its separation. The song is beautiful and heartbreaking. The reed's music is born of its longing for home.",
  upright: `The Reed appears when you feel the pain of separation. Rumi begins his great work with the reed's lament: "Listen to the reed as it tells its tale, complaining of separation." The Reed appears when you feel far from home. The Reed also represents song. The reed's separation becomes music. The Reed appears when your pain is transforming into beauty. The Reed also represents longing. The reed longs to return to the reed bed. The Reed appears when you are longing for return. The Reed also represents the soul's journey. The soul has been cut from its source and placed in this world. The Reed appears when you are aware of your soul's homesickness. The Reed asks you to listen to the song of your own longing. The Reed asks you to let your separation become music. The Reed asks you to remember where you came from. The ache you feel is the soul remembering home. Let your longing sing. Let your pain become beauty. The reed's song is beautiful because of its longing. So is yours.`,
  reversed: `The Reed reversed suggests a denial of longing, numbness, or disconnection from the soul's homesickness. You may have suppressed your longing to avoid the pain of separation. The card asks you to feel the ache. The longing is the path home. Let it sing through you.`,
});

register({
  title: "rumi-oracle|The Whirling",
  category: "Rumi Oracle",
  keywords: ["surrender", "ecstasy", "movement", "prayer", "freedom"],
  symbolism: "A figure in a white robe spins under the stars. The robe is a circle of fabric expanding as the figure turns. The dancer's face is lifted to the sky. The eyes are closed. The dancer has surrendered to the spin. The movement is prayer.",
  upright: `The Whirling appears when you need to surrender to the movement of life. The whirling dervish spins as an act of prayer. The Whirling appears when you need to let go of control. The Whirling also represents ecstasy. The dervish spins into ecstatic union with the divine. The Whirling appears when you need ecstatic release. The Whirling also represents movement. Life is movement. The Whirling appears when you have been stuck. The Whirling asks you to move. The Whirling also represents prayer. The spin is not just movement. The spin is devotion. The Whirling appears when you need to make your life a prayer. The Whirling asks you to surrender to the divine spin. The Whirling asks you to let go of your center and trust the greater center. The Whirling asks you to find freedom in surrender. Spin. Let go. Trust. The universe is spinning you into alignment. Surrender to the movement. Let the spin be your prayer. Let the ecstasy carry you home.`,
  reversed: `The Whirling reversed suggests resistance to surrender, being stuck, or fear of ecstatic release. You may be holding onto control when you need to let go. The card asks you to surrender to the spin. Life is movement. Trust it. Let yourself be moved.`,
});

})();


/* ══════════════════════════════════════════════════
   SACRED SELF-CARE ORACLE (Melissa Alvarez, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "sacred-selfcare|Rest",
  category: "Sacred Self-Care Oracle",
  keywords: ["rest", "stillness", "restoration", "sleep", "pause"],
  symbolism: "A figure lies on a bed of moss beneath a canopy of trees. Sunlight filters through the leaves. The figure's eyes are closed. The body is still. There is no urgency. There is only the quiet rhythm of breath. Rest is sacred.",
  upright: `Rest appears when you need to stop. You have been going, doing, achieving. Rest asks you to pause. Rest is not lazy. Rest is essential. Rest appears when your body is tired. Rest asks you to listen to your body. Rest also represents restoration. Rest restores what has been depleted. Rest appears when you need to recharge. Rest also represents stillness. Stillness is where healing happens. Rest appears when you need to be still. Rest also represents the sacred pause. Doing nothing is doing something. Rest appears when you need to honor your limits. Rest asks you to lie down. Rest asks you to close your eyes. Rest asks you to trust that the world will continue without you for a while. Rest is a sacred act of self-care. Rest is a rebellion against a culture that values doing over being. Rest is your right. Take it. Rest deeply. Let restoration flow. You will rise again when you are ready.`,
  reversed: `Rest reversed suggests burnout, overwork, or refusal to stop. You are pushing yourself beyond your limits. The card asks you to rest before your body forces you to. Rest is not a luxury. Rest is a necessity. Stop. Rest. Heal.`,
});

register({
  title: "sacred-selfcare|Nourish",
  category: "Sacred Self-Care Oracle",
  keywords: ["nourishment", "food", "soul", "feeding", "satisfaction"],
  symbolism: "A table spread with fruits, vegetables, grains, and bread. Candles flicker. The food is fresh and abundant. A pair of hands reaches for an apple. Nourishment is not just physical. It is soul food. Feed yourself deeply.",
  upright: `Nourish appears when you need to feed yourself. Not just your body, but your soul. Nourish appears when you have been neglecting your needs. Nourish also represents physical nourishment. What are you putting into your body? Nourish asks you to choose foods that truly feed you. Nourish also represents soul nourishment. What feeds your soul? What fills you up? Nourish appears when your soul is hungry. Nourish also represents satisfaction. True nourishment satisfies. Nourish appears when you are craving something deeper. Nourish appears when you have been running on empty. Nourish asks you to sit down. Nourish asks you to eat slowly. Nourish asks you to savor. Nourish asks you to give your body and soul what they actually need. Not what is convenient. Not what is fast. What is nourishing. Feed yourself deeply. You deserve to be full, satisfied, and nourished.`,
  reversed: `Nourish reversed suggests neglect of physical or soul nourishment, unhealthy eating, or starving yourself emotionally. You may be running on empty. The card asks you to nourish yourself. Eat well. Feed your soul. You deserve to be full.`,
});

register({
  title: "sacred-selfcare|Boundaries",
  category: "Sacred Self-Care Oracle",
  keywords: ["boundaries", "limits", "self-protection", "no", "space"],
  symbolism: "A fence with a gate. The fence is not hostile. It is clear. Beyond the fence is a garden of flowers. The fence protects the garden. The gate can be opened, but by invitation only. The fence says: this is sacred space.",
  upright: `Boundaries appears when you need to set limits. Boundaries are a form of self-care. Boundaries protect your energy. Boundaries appear when you have been giving too much. Boundaries also represent clarity. Boundaries make expectations clear. Boundaries appear when you need to be clear about what you will and will not accept. Boundaries also represent the word no. No is a complete sentence. Boundaries appear when you need to say no. Boundaries also represent sacred space. Your space is sacred. Your energy is precious. Boundaries appear when you need to protect what is yours. Boundaries are not selfish. Boundaries are necessary. Boundaries appear when you need to love yourself enough to say no. Boundaries ask you to be clear. Boundaries ask you to be firm. Boundaries ask you to protect your peace. The fence with the gate is not a wall. It is a boundary. It says: you are welcome here, but with respect. Set your boundaries. Protect your garden. Your no is sacred.`,
  reversed: `Boundaries reversed suggests weak boundaries, difficulty saying no, or letting others take your energy. You may be overgiving or being taken advantage of. The card asks you to set limits. Your no is powerful. Use it. Protect your peace.`,
});

register({
  title: "sacred-selfcare|Gentleness",
  category: "Sacred Self-Care Oracle",
  keywords: ["softness", "kindness", "tenderness", "compassion", "self-love"],
  symbolism: "Two hands cupping a small bird. The hands are open and gentle. The bird trusts the hands. There is no grasping. There is only holding. The gentleness in the hands is palpable. This is how you are meant to hold yourself.",
  upright: `Gentleness appears when you need to be gentle with yourself. You have been harsh, critical, and demanding. Gentleness asks you to soften. Gentleness also represents kindness. Kindness is not weakness. Kindness is strength that does not need to prove itself. Gentleness appears when you need to be kind to yourself. Gentleness also represents tenderness. Tenderness is the quality of treating yourself with care. Gentleness appears when you have been treating yourself roughly. Gentleness also represents self-love. Love is gentle. Gentleness appears when you need to love yourself tenderly. Gentleness asks you to cup yourself like the small bird. Gentleness asks you to hold yourself with care. Gentleness asks you to speak kindly to yourself. Gentleness asks you to stop pushing so hard. Gentleness is the way. Be gentle. Be tender. Be kind. You are not a project to be fixed. You are a being to be held with love. Hold yourself gently. You deserve tenderness.`,
  reversed: `Gentleness reversed suggests self-criticism, harshness, or lack of compassion for yourself. You are being too hard on yourself. The card asks you to soften. Kindness is not weakness. Be gentle with yourself. You deserve tenderness.`,
});

register({
  title: "sacred-selfcare|Solitude",
  category: "Sacred Self-Care Oracle",
  keywords: ["alone", "solitude", "quiet", "introspection", "peace"],
  symbolism: "A figure sits alone on a mountainside, watching the sunset. The figure is not lonely. The figure is in solitude. There is a difference. Solitude is chosen. Solitude is rich. Solitude is a gift. The peace in the figure's posture is unmistakable.",
  upright: `Solitude appears when you need to be alone. Not lonely. Alone. Solitude is chosen. Solitude is sacred. Solitude appears when you need space from others. Solitude also represents quiet. The noise of the world has been too much. Solitude asks you to find quiet. Solitude also represents introspection. In solitude, you can hear yourself think. Solitude appears when you need to reflect. Solitude also represents peace. Solitude is peaceful. There is no demand in solitude. There is only presence. Solitude appears when you need peace. Solitude asks you to withdraw. Solitude asks you to be with yourself. Solitude asks you to enjoy your own company. Solitude is not punishment. Solitude is a gift. Solitude appears when you need to reconnect with yourself. Solitude appears when the world has been too loud. Solitude is the space where you can hear your own soul. Take the solitude. Embrace it. Let the quiet restore you. Let peace be your companion.`,
  reversed: `Solitude reversed suggests fear of being alone, inability to be with yourself, or loneliness. You may be avoiding your own company. The card asks you to learn to be with yourself. Solitude is not empty. Solitude is full. Sit with yourself. Find peace in your own presence.`,
});

register({
  title: "sacred-selfcare|Play",
  category: "Sacred Self-Care Oracle",
  keywords: ["play", "joy", "lightness", "creativity", "fun"],
  symbolism: "A figure splashes in puddles after a rain, scattering droplets that catch the light. The face is full of joy. There is no purpose to this activity. There is no goal. There is only the pure, foolish, glorious joy of play.",
  upright: `Play appears when you need to lighten up. You have been too serious, too focused, too productive. Play asks you to remember joy. Play also represents lightness. Not everything is heavy. Play appears when you are carrying too much weight. Play also represents creativity. Play is the birthplace of creativity. Play appears when you need to be creative. Play also represents fun. Fun is not frivolous. Fun is essential. Play appears when you have forgotten how to have fun. Play appears when you need to do something for no reason. Play appears when you need to laugh. Play appears when you need to be silly. Play asks you to find the puddle and splash. Play asks you to do something that has no purpose but joy. Play is a sacred act of self-care. Play reminds you that life is not just about achieving. Life is also about enjoying. Let yourself play. Let yourself laugh. Let yourself be light. The child in you is waiting. Play.`,
  reversed: `Play reversed suggests over-seriousness, burnout from too much work, or forgetting how to have fun. You have been all work and no play. The card asks you to lighten up. Life is not all about productivity. Play is essential. Go play.`,
});

})();

/* ══════════════════════════════════════════════════
   ENCHANTED MAP (Colette Baron-Reid, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "enchanted-map|The Companion",
  category: "Enchanted Map",
  keywords: ["support", "friendship", "kindness", "assistance", "connection"],
  symbolism: "A figure walks along a path, and beside them walks a luminous being. The companion is part guide, part friend. The journey is shared. The companion does not carry the traveler. The companion walks beside them. The journey is lighter together.",
  upright: `The Companion appears when you need support. You are not meant to walk this path alone. The Companion appears when you need a friend. The Companion also represents kindness. A small act of kindness can change everything. The Companion appears when you need to give or receive kindness. The Companion also represents assistance. Help is available. The Companion appears when you need to ask for help. The Companion also represents connection. We are all connected. The Companion appears when you need to remember that you are not alone. The Companion asks you to reach out. The Companion asks you to accept support. The Companion asks you to be a companion to someone else. The journey is shared. The Companion walks beside you. You do not have to do this alone. Help is here. Friendship is here. Connection is here. Reach out. Take the hand. Walk together. The Companion is with you.`,
  reversed: `The Companion reversed suggests isolation, refusing help, or difficulty connecting with others. You may be trying to do everything alone. The companion asks you to reach out. You are not meant to walk alone. Let someone walk beside you.`,
});

register({
  title: "enchanted-map|The River",
  category: "Enchanted Map",
  keywords: ["flow", "emotion", "movement", "cleansing", "surrender"],
  symbolism: "A wide, flowing river curves through a lush landscape. The water is clear and moving. Leaves float on the surface, carried along. The river does not fight its course. The river flows. The river is the path.",
  upright: `The River appears when you need to go with the flow. The river does not resist. The river moves. The River appears when you have been struggling against the current. The River also represents emotion. Emotions are like rivers. They need to flow. The River appears when you need to let your emotions flow. The River also represents cleansing. The river washes away what is not needed. The River appears when you need cleansing. The River also represents movement. The river is always moving. The River appears when you need to move forward. The River asks you to trust the current. The River asks you to stop fighting. The River asks you to let yourself be carried. The river knows where it is going. The River asks you to release control and trust the flow. The River is the path. Float. Trust. Let the current take you where you need to go. The river knows the way.`,
  reversed: `The River reversed suggests resistance to flow, blocked emotions, or struggling against the current. You are fighting what is natural. The card asks you to surrender to the flow. Stop struggling. Trust the current. The river knows where it is going. Float.`,
});

register({
  title: "enchanted-map|The Mountain",
  category: "Enchanted Map",
  keywords: ["challenge", "achievement", "perspective", "climbing", "summit"],
  symbolism: "A majestic mountain rises against a clear sky. A figure stands at the summit, looking out at the vast landscape below. The climb was difficult, but the view is worth it. The mountain represents challenge and achievement.",
  upright: `The Mountain appears when you face a challenge. The mountain stands before you. The Mountain appears when you need to climb. The Mountain also represents achievement. The summit is the goal. The Mountain appears when you are ready to achieve something significant. The Mountain also represents perspective. From the summit, everything looks different. The Mountain appears when you need perspective. The Mountain also represents effort. The climb is not easy. The Mountain appears when you need to put in the work. The Mountain asks you to keep climbing. The Mountain asks you to trust that the effort is worth it. The Mountain asks you to enjoy the climb, not just the summit. The Mountain also reminds you that every mountain can be climbed. One step at a time. Keep going. The summit is waiting. The view will be magnificent. Keep climbing. You can do this.`,
  reversed: `The Mountain reversed suggests a challenge that feels too great, avoidance of effort, or feeling stuck at the base. You may be doubting your ability to make the climb. The mountain asks you to take the first step. One step at a time. You can do this. Keep climbing.`,
});

register({
  title: "enchanted-map|The Forest",
  category: "Enchanted Map",
  keywords: ["mystery", "growth", "shadows", "shelter", "wisdom"],
  symbolism: "A path leads into a dense forest. Sunlight filters through the canopy. The forest is deep, mysterious, and alive. The trees are ancient. The forest holds secrets. The forest is a place of transformation.",
  upright: `The Forest appears when you are entering a period of mystery and growth. The forest is where the wild things grow. The Forest appears when you are in a time of transformation. The Forest also represents shadows. Not all is light in the forest. The Forest appears when you need to face your shadows. The Forest also represents shelter. The forest provides shelter. The Forest appears when you need protection. The Forest also represents wisdom. The ancient trees hold wisdom. The Forest appears when you need deep wisdom. The Forest asks you to enter the mystery. The Forest asks you to trust the growth that happens in the shadows. The Forest asks you to find shelter in the unknown. The Forest is not dangerous. The Forest is transformative. Walk into the forest. Trust the path. The trees will guide you. The forest is where you grow. The forest is where you become.`,
  reversed: `The Forest reversed suggests fear of the unknown, getting lost in confusion, or avoiding shadow work. You may be afraid of what is in the darkness. The forest asks you to trust. The shadows are not enemies. They are teachers. Walk into the mystery. You will find your way.`,
});

register({
  title: "enchanted-map|The Bridge",
  category: "Enchanted Map",
  keywords: ["connection", "transition", "crossing", "linking", "passage"],
  symbolism: "An arched stone bridge spans a river. The bridge connects two sides. On one side is the known. On the other side is the unknown. The bridge is well built. The bridge is safe. The bridge invites crossing.",
  upright: `The Bridge appears when you are in transition. The bridge connects where you have been to where you are going. The Bridge appears when you are crossing from one phase of life to another. The Bridge also represents connection. The bridge connects two sides. The Bridge appears when you need to connect two parts of your life. The Bridge also represents passage. The bridge is the way across. The Bridge appears when you need to find the way. The Bridge also represents trust. The bridge was built to be crossed. The Bridge appears when you need to trust the transition. The Bridge asks you to cross. The Bridge asks you to trust that it will hold. The Bridge asks you to leave the known and step into the unknown. The Bridge is safe. The Bridge is the way. Cross the bridge. What is waiting for you on the other side is worth the crossing. Take the step. Cross.`,
  reversed: `The Bridge reversed suggests resistance to transition, fear of crossing, or being stuck between two places. You may be hesitating at the threshold. The bridge asks you to cross. It is safe. The other side is waiting. Take the step.`,
});

register({
  title: "enchanted-map|The Lighthouse",
  category: "Enchanted Map",
  keywords: ["guidance", "direction", "hope", "awareness", "illumination"],
  symbolism: "A lighthouse stands on a rocky shore, its beam sweeping across dark waters. The light cuts through the fog. The lighthouse does not move. It stands firm and shines. The light guides ships safely home.",
  upright: `The Lighthouse appears when you need guidance. The lighthouse stands firm and shines its light into the darkness. The Lighthouse appears when you feel lost. The Lighthouse also represents direction. The light shows the way. The Lighthouse appears when you need direction. The Lighthouse also represents hope. The light is hope in the darkness. The Lighthouse appears when you need hope. The Lighthouse also represents awareness. The lighthouse is aware of its purpose. The Lighthouse appears when you need to be aware of your purpose. The Lighthouse asks you to be the light. The Lighthouse asks you to stand firm in who you are. The Lighthouse asks you to shine even when it is dark. The Lighthouse also reminds you that guidance is available. Look for the light. You are not lost. The light is guiding you home. Trust the light. Follow it. The lighthouse never fails. The light is always shining. You will find your way.`,
  reversed: `The Lighthouse reversed suggests feeling lost without guidance, the light has gone out, or refusing to see the way. You may be ignoring the guidance that is available. The lighthouse asks you to look for the light. It is still there. You have only to look. The light will guide you home.`,
});

})();


/* ══════════════════════════════════════════════════
   ANCIENT STONES ORACLE (Rebecca Campbell, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "ancient-stones|Standing Stone",
  category: "Ancient Stones Oracle",
  keywords: ["stillness", "presence", "ancient", "witness", "anchor"],
  symbolism: "A single standing stone rises from the earth. It has stood for thousands of years. It has witnessed countless seasons, generations, and changes. Yet it remains still. It remains present. It is ancient, anchored, and wise.",
  upright: `Standing Stone appears when you need to be still and present. The standing stone has been in the same place for millennia. It does not chase. It does not run. It stands. Standing Stone appears when you need to anchor yourself. Standing Stone also represents ancient wisdom. The stone has witnessed everything. Standing Stone appears when you need access to ancient knowing. Standing Stone also represents endurance. The stone endures through all weather, all seasons, all change. Standing Stone appears when you need to endure. Standing Stone also represents witnessing. The stone witnesses without judgment. Standing Stone appears when you need to witness your own life without judgment. Standing Stone asks you to be still. Standing Stone asks you to stand firm. Standing Stone asks you to trust that endurance has value. You do not need to move. You do not need to change. Sometimes, the most powerful thing you can do is stand still and witness. Be the standing stone. Be still. Be present. Be anchored. You have stood through everything. You are still standing. That is your strength.`,
  reversed: `Standing Stone reversed suggests restlessness, inability to be still, or feeling unanchored. You may be moving when you need to stand still. The standing stone asks you to root yourself. Be still. Presence is powerful. Stop chasing. Stand.`,
});

register({
  title: "ancient-stones|Crystal Cave",
  category: "Ancient Stones Oracle",
  keywords: ["inner world", "depth", "hidden beauty", "introspection", "treasure"],
  symbolism: "The entrance to a cave, dark and mysterious. Inside, crystals glow with inner light. The cave is not empty. The cave is full of hidden treasure. The darkness holds beauty that only reveals itself to those who enter.",
  upright: `Crystal Cave appears when you need to go within. The cave is the inner world. Crystal Cave appears when you need to explore your depths. Crystal Cave also represents hidden beauty. The crystals are hidden in the darkness. Crystal Cave appears when you need to discover the beauty within yourself. Crystal Cave also represents introspection. The cave is a place of reflection. Crystal Cave appears when you need to reflect. Crystal Cave also represents treasure. The cave holds treasure. Crystal Cave appears when you are ready to discover your inner riches. Crystal Cave asks you to enter the darkness. Crystal Cave asks you to explore your depths. Crystal Cave asks you to trust that there is beauty in the dark. The crystals are waiting. They have been forming in the darkness for eons. They are beautiful. They are precious. Enter the cave. Explore your inner world. The treasure within you is waiting to be discovered. Do not fear the darkness. The darkness holds light.`,
  reversed: `Crystal Cave reversed suggests fear of going within, avoidance of inner work, or hiding from your depths. You may be afraid of what you will find in the darkness. The crystal cave asks you to enter. The treasure is worth the journey. Your inner world is full of beauty. Explore it.`,
});

register({
  title: "ancient-stones|River Stone",
  category: "Ancient Stones Oracle",
  keywords: ["smoothing", "patience", "time", "polishing", "flow"],
  symbolism: "A smooth river stone rests in a bed of pebbles. The stone was once sharp and jagged. Years of flowing water have polished it smooth. The stone is beautiful because of the friction it has endured. The river has caressed it into softness.",
  upright: `River Stone appears when you are being smoothed by time. The river stone was once sharp. The water has worn away its edges. River Stone appears when you are in a process of refinement. River Stone also represents patience. The smoothing takes time. River Stone appears when you need patience. River Stone also represents beauty. The smoothed stone is beautiful. River Stone appears when you need to see the beauty in your own smoothing. River Stone also represents flow. The river does the smoothing. River Stone appears when you need to trust the flow. River Stone asks you to trust the process. River Stone asks you to allow yourself to be smoothed by time. River Stone asks you to let the water of life polish your edges. River Stone asks you to be patient. The rough edges will soften. The beauty is emerging. The river of time is making you smooth. Trust it. You are being polished into perfection. The friction is the refinement. The smoothing is the grace.`,
  reversed: `River Stone reversed suggests resistance to the smoothing process, impatience with growth, or clinging to rough edges as identity. You may be fighting the very process that is refining you. The card asks you to trust the river. Let it smooth you. Let time polish you into beauty.`,
});

register({
  title: "ancient-stones|Mountain Peak",
  category: "Ancient Stones Oracle",
  keywords: ["height", "vision", "achievement", "clarity", "aspiration"],
  symbolism: "A sharp mountain peak pierces the clouds. The peak is made of ancient granite. It has been pushed up by immense forces over eons. The peak touches the sky. From the peak, you can see everything. The view is unobstructed and clear.",
  upright: `Mountain Peak appears when you are reaching a high point. The mountain peak represents achievement, vision, and clarity. Mountain Peak appears when you have climbed high. Mountain Peak also represents vision. From the peak, you can see far. Mountain Peak appears when you need perspective. Mountain Peak also represents aspiration. The peak is what you reach for. Mountain Peak appears when you need to set your sights high. Mountain Peak also represents clarity. The air at the peak is clear. Mountain Peak appears when you need clarity. Mountain Peak asks you to look at how far you have come. Mountain Peak asks you to enjoy the view. Mountain Peak asks you to celebrate your achievement. Mountain Peak also reminds you that you cannot stay at the peak forever. The descent is part of the journey. But for now, enjoy the summit. The view is magnificent. You have earned this. Breathe the clear air. See how far you have come. Celebrate. Then continue your journey.`,
  reversed: `Mountain Peak reversed suggests feeling low, lack of perspective, or a summit that feels out of reach. You may be at the base looking up with discouragement. The mountain peak asks you to keep climbing. The view from the top is worth it. One step at a time. You will get there.`,
});

register({
  title: "ancient-stones|Ley Line",
  category: "Ancient Stones Oracle",
  keywords: ["energy", "alignment", "connection", "path", "power"],
  symbolism: "A line of light running across the landscape, connecting ancient sites. The ley line is invisible to most, but those who can see it know it is the energy of the earth. The line connects everything. The line is the pathway of power.",
  upright: `Ley Line appears when you are in alignment. The ley line is the energy current that connects sacred sites. Ley Line appears when you are aligned with your path. Ley Line also represents connection. The ley line connects everything. Ley Line appears when you need to feel connected. Ley Line also represents energy. The ley line carries earth energy. Ley Line appears when you need to tap into your energy. Ley Line also represents the path. The ley line is a pathway. Ley Line appears when you need to find your path. Ley Line asks you to feel the alignment. Ley Line asks you to trust that you are connected. Ley Line asks you to walk the path of energy. The line is there. You are aligned. You are connected. You are walking the sacred path. Feel the current. Let the energy flow through you. The ley line is carrying you where you need to go. Trust the alignment. Trust the connection. The path is lit. Walk it.`,
  reversed: `Ley Line reversed suggests misalignment, disconnection, or being off your path. You may feel out of sync with the energy around you. The ley line asks you to realign. The connection is still there. You have only stepped off the line. Find your way back. The path is still there.`,
});

register({
  title: "ancient-stones|Dolmen Gate",
  category: "Ancient Stones Oracle",
  keywords: ["threshold", "portal", "passage", "transition", "ancestors"],
  symbolism: "A dolmen, two upright stones with a capstone, standing in a field. The dolmen is a gateway. It marks a threshold between worlds. Through the dolmen, you can see mist and light. The ancestors passed through this gate. Now it is your turn.",
  upright: `Dolmen Gate appears when you are at a threshold. The dolmen is an ancient portal, a gate between worlds. Dolmen Gate appears when you are crossing a significant threshold. Dolmen Gate also represents passage. The dolmen marks a passage from one state to another. Dolmen Gate appears when you are passing through. Dolmen Gate also represents ancestors. The dolmen was built by those who came before. Dolmen Gate appears when you are connected to your ancestors. Dolmen Gate also represents transition. The gate is the in-between. Dolmen Gate appears when you are in transition. Dolmen Gate asks you to honor the threshold. Dolmen Gate asks you to acknowledge the passage. Dolmen Gate asks you to connect with those who have passed through before you. The gate is open. The ancestors are waiting. You are not the first to cross this threshold. You are not the last. The dolmen gate marks the sacred passage. Step through with reverence. The ancestors are with you.`,
  reversed: `Dolmen Gate reversed suggests fear of crossing a threshold, being stuck in transition, or disconnection from ancestors. You may be hesitating at the gate. The dolmen asks you to step through. The ancestors are with you. The gate is open. Cross.`,
});

})();

/* ══════════════════════════════════════════════════
   LIGHT SEER'S ORACLE (Chris-Anne, 54 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "light-seer|The Nurturer",
  category: "Light Seer's Oracle",
  keywords: ["care", "compassion", "mothering", "gentle strength", "heart"],
  symbolism: "A figure with a warm, glowing heart holds a small plant in cupped hands. The plant is young and tender. The figure's gaze is soft and loving. The energy is maternal, caring, and deeply compassionate. The Nurturer is the heart of the deck.",
  upright: `The Nurturer appears when you need to nurture yourself or someone else. The Nurturer is the caring, compassionate aspect of yourself. The Nurturer appears when someone needs care. The Nurturer also represents gentle strength. The Nurturer is strong but soft. The Nurturer appears when you need to be strong in a gentle way. The Nurturer also represents the heart. The Nurturer leads with heart. The Nurturer appears when you need to lead with love. The Nurturer also represents compassion. Compassion is the Nurturer's gift. The Nurturer appears when you need to extend compassion. The Nurturer asks you to care for what is growing. The Nurturer asks you to be gentle. The Nurturer asks you to nurture yourself the way you would nurture a small plant. You need care. You need tenderness. The Nurturer is here to remind you that gentleness is strength. Care for yourself. Care for others. The heart knows how. Trust the heart. The Nurturer is within you.`,
  reversed: `The Nurturer reversed suggests neglect of self or others, over-giving without receiving, or smothering care. You may be giving too much or not enough. The nurturer asks you to find balance. Nurture yourself so you can nurture others. Both are essential.`,
});

register({
  title: "light-seer|The Dreamer",
  category: "Light Seer's Oracle",
  keywords: ["imagination", "vision", "possibility", "inspiration", "stars"],
  symbolism: "A figure lies on the ground, looking up at a starry sky. Stars are reflected in their eyes. Above them, a constellation forms a dream, a vision of what could be. The figure is not asleep. The figure is dreaming with open eyes.",
  upright: `The Dreamer appears when you need to dream. The Dreamer is the visionary, the one who sees possibility where others see limitation. The Dreamer appears when you need to imagine a new reality. The Dreamer also represents inspiration. The stars inspire the dreamer. The Dreamer appears when you need inspiration. The Dreamer also represents possibility. The dreamer knows that anything is possible. The Dreamer appears when you need to believe in possibility. The Dreamer also represents vision. The dreamer sees what is not yet visible. The Dreamer appears when you need to envision your future. The Dreamer asks you to look up. The Dreamer asks you to dream big. The Dreamer asks you to let the stars inspire you. The Dreamer also reminds you that dreams are the seeds of reality. Dream boldly. Do not limit your imagination. Do not let practicality kill your dream. The stars are unlimited. Your dreams can be unlimited too. Dream. Imagine. Believe. The dream is the first step to creation.`,
  reversed: `The Dreamer reversed suggests lack of imagination, loss of hope, or dreams that have been abandoned. You may have stopped believing in possibility. The dreamer asks you to look up. The stars are still there. Your dreams are still possible. Start dreaming again.`,
});

register({
  title: "light-seer|The Seeker",
  category: "Light Seer's Oracle",
  keywords: ["curiosity", "quest", "exploration", "learning", "path"],
  symbolism: "A figure stands at a crossroads with a lantern. The lantern illuminates the path ahead. The figure is curious, open, and ready. The Seeker does not know which path to take, but the Seeker knows that the path unfolds by walking.",
  upright: `The Seeker appears when you are on a quest. The Seeker is the curious explorer, the one who asks questions and seeks truth. The Seeker appears when you need to search for answers. The Seeker also represents curiosity. The Seeker is curious about everything. The Seeker appears when you need to be curious. The Seeker also represents learning. The Seeker is always learning. The Seeker appears when you need to learn something new. The Seeker also represents the path. The Seeker walks the path of discovery. The Seeker appears when you are on a path of discovery. The Seeker asks you to keep asking questions. The Seeker asks you to stay curious. The Seeker asks you to trust that the path will unfold. The Seeker does not need to know the destination. The Seeker trusts the journey. Keep seeking. Keep asking. Keep growing. The answers you seek are found by walking. The path is the teacher. Walk it with curiosity and trust.`,
  reversed: `The Seeker reversed suggests giving up the search, loss of curiosity, or feeling like you have found all the answers. The seeker asks you to stay curious. There is always more to learn. The quest is not over. Keep seeking. Keep asking.`,
});

register({
  title: "light-seer|The Warrior",
  category: "Light Seer's Oracle",
  keywords: ["courage", "battle", "strength", "protection", "conviction"],
  symbolism: "A figure in armor stands with a spear, but the armor is made of light and the spear is a ray of sun. The Warrior's face is determined but peaceful. The Warrior fights for what is right, not for what is easy. The Warrior is a protector.",
  upright: `The Warrior appears when you need courage. The Warrior is the aspect of yourself that fights for what matters. The Warrior appears when you need to take a stand. The Warrior also represents battle. The Warrior does not avoid necessary battles. The Warrior appears when you must fight for something. The Warrior also represents protection. The Warrior protects the vulnerable. The Warrior appears when you need to protect yourself or others. The Warrior also represents conviction. The Warrior fights for what they believe. The Warrior appears when you need to stand in your conviction. The Warrior asks you to be brave. The Warrior asks you to fight for what is right. The Warrior asks you to protect what matters. The Warrior also reminds you that not every battle needs to be fought. Choose your battles wisely. But when you fight, fight with your whole heart. The Warrior is within you. Be brave. Take your stand. Fight the good fight.`,
  reversed: `The Warrior reversed suggests avoidance of necessary conflict, fear of standing up for yourself, or misdirected aggression. You may be fighting the wrong battles or avoiding the right ones. The warrior asks you to choose wisely, but do not avoid what must be faced. Be brave.`,
});

register({
  title: "light-seer|The Mystic",
  category: "Light Seer's Oracle",
  keywords: ["mystery", "spirit", "connection", "intuition", "transcendence"],
  symbolism: "A figure sits in meditation, and their body is becoming transparent, revealing stars and galaxies within. The Mystic is not separate from the universe. The Mystic is the universe experiencing itself. The boundaries are dissolving.",
  upright: `The Mystic appears when you are ready for deeper connection. The Mystic is the spiritual seeker, the one who knows that we are all one. The Mystic appears when you are ready to transcend the illusion of separation. The Mystic also represents mystery. The Mystic is comfortable with not knowing. The Mystic appears when you need to embrace mystery. The Mystic also represents intuition. The Mystic trusts inner knowing. The Mystic appears when you need to trust your intuition. The Mystic also represents connection. The Mystic knows that all is connected. The Mystic appears when you need to feel connected. The Mystic asks you to go deeper. The Mystic asks you to look within. The Mystic asks you to remember that you are not separate. The Mystic asks you to dissolve the boundaries that make you feel alone. You are the universe experiencing itself. The Mystic knows this. Now you must know it too. Sit in the mystery. Trust the connection. Become one with all that is.`,
  reversed: `The Mystic reversed suggests disconnection from spirit, skepticism, or fear of the unknown. You may be clinging to the material world and ignoring the spiritual. The mystic asks you to open to mystery. There is more than what you can see. Trust what you cannot explain.`,
});

register({
  title: "light-seer|The Alchemist",
  category: "Light Seer's Oracle",
  keywords: ["transformation", "magic", "creation", "change", "synthesis"],
  symbolism: "A figure stands before a cauldron. The figure's hands glow. Into the cauldron go base metals. Out of the cauldron comes gold. The Alchemist transforms the ordinary into the extraordinary. The Alchemist turns lead into gold, darkness into light.",
  upright: `The Alchemist appears when you are in a process of transformation. The Alchemist turns one thing into another. The Alchemist appears when you are being transformed. The Alchemist also represents magic. The Alchemist works with invisible forces. The Alchemist appears when magic is needed. The Alchemist also represents creation. The Alchemist creates something new. The Alchemist appears when you are creating. The Alchemist also represents change. The Alchemist is the master of change. The Alchemist appears when change is needed. The Alchemist asks you to trust the transformation. The Alchemist asks you to believe that your darkness can become gold. The Alchemist asks you to participate in your own transformation. The Alchemist does not sit back and wait. The Alchemist works. The Alchemist stirs the cauldron. The Alchemist adds intention. The Alchemist believes in the possibility of gold. The Alchemist is within you. Work with the materials of your life. Transform them. Turn your lead into gold. You are the Alchemist of your own life.`,
  reversed: `The Alchemist reversed suggests resistance to transformation, feeling stuck in base material, or lack of belief in your power to change. You may not believe you can transform your circumstances. The alchemist asks you to believe in the possibility of gold. Trust the process. Work the magic.`,
});

})();


/* ══════════════════════════════════════════════════
   WISDOM OF THE ANCESTORS (Collette Baron-Reid, 52 cards)
   ══════════════════════════════════════════════════ */

(function () {

register({
  title: "wisdom-ancestors|The Ancestors Speak",
  category: "Wisdom of the Ancestors",
  keywords: ["guidance", "lineage", "heritage", "support", "roots"],
  symbolism: "A circle of elder faces emerges from the mists of time. The faces are ancient, wise, and kind. They have been watching. They have been waiting. They have wisdom to share. The ancestors are speaking. Are you listening?",
  upright: `The Ancestors Speak appears when you are being called to listen to the wisdom of those who came before. Your ancestors have walked the path before you. They have faced challenges, survived hardships, and gained wisdom. The Ancestors Speak appears when you need their guidance. The Ancestors Speak also represents support. Your ancestors are supporting you. You are not alone. You carry their strength in your blood. The Ancestors Speak also represents heritage. Honor where you come from. The Ancestors Speak appears when you need to connect with your roots. The Ancestors Speak asks you to listen. The Ancestors Speak asks you to honor your lineage. The Ancestors Speak asks you to trust that you are supported by those who came before. The ancestors are speaking. Their wisdom is available. Listen. Honor them. Carry their strength forward. You are the culmination of their dreams. Live in a way that honors their legacy.`,
  reversed: `The Ancestors Speak reversed suggests disconnection from your roots, ignoring ancestral wisdom, or feeling unsupported by your lineage. The card asks you to reconnect with your heritage. The ancestors are still speaking. You have only stopped listening. Tune in. Their wisdom is still available.`,
});

register({
  title: "wisdom-ancestors|The Storyteller",
  category: "Wisdom of the Ancestors",
  keywords: ["narrative", "memory", "teaching", "legacy", "oral tradition"],
  symbolism: "A figure sits before a fire, surrounded by listeners of all ages. The figure's hands move as they speak. The story is alive. The listeners are transported. The story carries the wisdom of the people. The Storyteller keeps the memory alive.",
  upright: `The Storyteller appears when you need to share your story. The Storyteller is the keeper of memory, the one who passes wisdom through narrative. The Storyteller appears when it is time to speak your truth. The Storyteller also represents legacy. Your story matters. The Storyteller appears when you need to record your legacy. The Storyteller also represents teaching. The story teaches what needs to be learned. The Storyteller appears when you have something to teach. The Storyteller also represents memory. The story keeps memory alive. The Storyteller appears when you need to remember. The Storyteller asks you to tell your story. The Storyteller asks you to share your wisdom. The Storyteller asks you to pass on what you have learned. Your story is medicine. Your story heals. Tell it. The fire is burning. The listeners are ready. Speak your story. It is time.`,
  reversed: `The Storyteller reversed suggests silence, forgotten stories, or a refusal to share your truth. You may be hiding your story out of fear. The storyteller asks you to speak. Your story matters. Your story heals. Find your voice. Tell your tale. The world needs to hear it.`,
});

register({
  title: "wisdom-ancestors|The Healer",
  category: "Wisdom of the Ancestors",
  keywords: ["medicine", "restoration", "herbs", "tradition", "wholeness"],
  symbolism: "A figure gathers plants from a forest, placing them in a basket. A bundle of sage smolders nearby. The figure has the knowledge of generations. They know which plant heals which ailment. The Healer carries the medicine of the ancestors.",
  upright: `The Healer appears when you need healing that honors tradition. The Healer carries the medicine of the ancestors, the knowledge of plants, of rituals, of the old ways. The Healer appears when you need deep healing. The Healer also represents restoration. The Healer restores what has been broken. The Healer appears when you need restoration. The Healer also represents knowledge. The Healer has studied the old ways. The Healer appears when you need to study the wisdom of traditional healing. The Healer also represents wholeness. The Healer treats the whole person, not just the symptom. The Healer appears when you need holistic healing. The Healer asks you to honor the old ways. The Healer asks you to trust traditional medicine. The Healer asks you to seek healing that addresses the root, not just the branch. The ancestors knew how to heal. Their medicine is still available. Seek it. Trust it. Heal deeply.`,
  reversed: `The Healer reversed suggests rejection of traditional healing, disconnection from natural medicine, or a wound that is not healing. The card asks you to consider the old ways. The ancestors had knowledge that is still relevant. Seek the medicine of the earth. Heal at the root.`,
});

register({
  title: "wisdom-ancestors|The Vision Keeper",
  category: "Wisdom of the Ancestors",
  keywords: ["vision", "prophecy", "future", "dreams", "guidance"],
  symbolism: "A figure stands on a hilltop, looking toward the horizon. The figure holds a staff and wears a headdress adorned with feathers. Before them, the future unfolds like a tapestry. They can see what is coming. They are the Vision Keeper for the people.",
  upright: `The Vision Keeper appears when you need to see the future. The Vision Keeper is the one who can see what is coming, who holds the vision for the people. The Vision Keeper appears when you need guidance for the path ahead. The Vision Keeper also represents prophecy. The Vision Keeper sees the patterns of time. The Vision Keeper appears when you need foresight. The Vision Keeper also represents dreams. The Vision Keeper dreams the future into being. The Vision Keeper appears when you need to pay attention to your dreams. The Vision Keeper also represents responsibility. The Vision Keeper holds the vision for others. The Vision Keeper appears when you are being called to hold a vision for your community. The Vision Keeper asks you to look ahead. The Vision Keeper asks you to trust your visions. The Vision Keeper asks you to hold the vision for others. The future is not fixed. The Vision Keeper knows this. But the Vision Keeper also knows that vision shapes the future. See clearly. Dream boldly. Hold the vision.`,
  reversed: `The Vision Keeper reversed suggests loss of vision, fear of the future, or refusal to see what is coming. You may be avoiding looking ahead because you are afraid of what you will see. The vision keeper asks you to face the future with courage. The vision is not fixed. You have the power to shape it. See it. Dream it. Create it.`,
});

register({
  title: "wisdom-ancestors|The Gatherer",
  category: "Wisdom of the Ancestors",
  keywords: ["provision", "community", "harvest", "preparation", "abundance"],
  symbolism: "A figure returns to the village with a basket full of food. Children run to greet them. The elder at the fire nods in approval. The Gatherer has provided for the community. The harvest is good. The people will eat.",
  upright: `The Gatherer appears when you need to gather what is needed. The Gatherer is the provider, the one who brings resources to the community. The Gatherer appears when you need to provide for yourself or others. The Gatherer also represents community. The Gatherer gathers not just food but people. The Gatherer appears when you need to bring people together. The Gatherer also represents harvest. The Gatherer knows when it is time to harvest. The Gatherer appears when the time to reap has come. The Gatherer also represents preparation. The Gatherer prepares for winter during the summer. The Gatherer appears when you need to prepare. The Gatherer asks you to gather what you need. The Gatherer asks you to provide for your community. The Gatherer asks you to harvest what you have planted. The Gatherer asks you to prepare for the future. The abundance is here. Gather it. Share it. The community thrives when we gather together. Be the Gatherer. Bring in the harvest. Feed the people.`,
  reversed: `The Gatherer reversed suggests scarcity, hoarding, or a failure to provide or prepare. You may be taking more than you need or not gathering enough. The gatherer asks you to be mindful of resources. Share what you have. Prepare for the future. Abundance is available when we gather together.`,
});

register({
  title: "wisdom-ancestors|The Warrior",
  category: "Wisdom of the Ancestors",
  keywords: ["protection", "courage", "battle", "honor", "sacrifice"],
  symbolism: "A figure in traditional war paint stands with a spear and shield. The face is fierce but not cruel. The Warrior protects the village. The Warrior does not seek battle but will not avoid necessary conflict. The Warrior fights with honor.",
  upright: `The Warrior appears when you need to defend what matters. The Warrior is the protector of the tribe, the one who stands between danger and the vulnerable. The Warrior appears when you need to take a stand. The Warrior also represents courage. The Warrior feels fear but acts despite it. The Warrior appears when you need to be brave. The Warrior also represents honor. The Warrior fights with honor, only when necessary. The Warrior appears when you need to act with integrity. The Warrior also represents sacrifice. The Warrior is willing to sacrifice for the greater good. The Warrior appears when you need to consider what you are willing to sacrifice. The Warrior asks you to stand up. The Warrior asks you to protect what matters. The Warrior asks you to fight with honor. Not every battle is worth fighting. But when you must fight, fight with courage and integrity. The Warrior is within you. Be brave. Protect. Defend. Fight the good fight with honor.`,
  reversed: `The Warrior reversed suggests cowardice, unnecessary conflict, or fighting without honor. You may be avoiding a necessary battle or engaging in battles that are not yours. The warrior asks you to choose your battles wisely. When you fight, fight with honor. When you must stand, stand with courage.`,
});

})();

