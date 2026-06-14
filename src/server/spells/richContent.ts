interface RichContent {
  purpose: string;
  materials: string[];
  steps: string[];
  variations: string[];
}

const ELEMENT_MATERIALS: Record<string, string[]> = {
  Fire: ["Red candle", "Matches or lighter", "Fire-safe bowl", "Cinnamon stick", "Dragon's blood resin"],
  Water: ["Bowl of spring water", "Moon-charged water", "Blue candle", "Sea salt", "Rose petals"],
  Air: ["Incense stick", "Feather", "Small bell", "Sandalwood powder", "Paper and pen"],
  Earth: ["Small clay pot", "Soil or sand", "Green candle", "Lodestone", "Herb bundle"],
  Spirit: ["Purple candle", "Clear quartz crystal", "Sacred oil", "Meditation cushion", "White cloth"],
  Aether: ["Silver candle", "Star anise", "Amber resin", "Gold thread", "Mirror"],
};

const CATEGORY_PURPOSES: Record<string, string[]> = {
  "Love & Attraction": [
    "Draw romantic love into your life by aligning your aura with the frequency of attraction.",
    "Open your heart chakra to give and receive love more fully.",
    "Create a magnetic field around you that naturally attracts loving partnerships.",
  ],
  Protection: [
    "Erect an impenetrable energetic barrier around your home and person.",
    "Shield your aura from negative influences, psychic attacks, and harmful intentions.",
    "Create a safe sacred space that repels all forms of spiritual harm.",
  ],
  "Money & Prosperity": [
    "Open the channels for wealth and abundance to flow freely into your life.",
    "Align your energetic signature with prosperity and financial success.",
    "Remove energetic blocks that prevent money from reaching you.",
  ],
  Healing: [
    "Channel universal life force energy to accelerate physical and emotional healing.",
    "Realign the body's energy centers to promote natural healing processes.",
    "Draw down healing light to repair damaged tissues and restore vitality.",
  ],
  Cleansing: [
    "Purify your aura and environment of stagnant or negative energies.",
    "Wash away spiritual debris accumulated from daily life and interactions.",
    "Reset your energetic field to a neutral, clear state.",
  ],
  "Evil Eye": [
    "Break the malocchio — the evil eye curse — and return its power to the sender.",
    "Remove the heavy energy of envy and jealousy that has attached to your aura.",
    "Cleanse the gaze of others that has left its mark on your energy field.",
  ],
  "Knowledge & Wisdom": [
    "Open the third eye to receive divine wisdom and hidden knowledge.",
    "Strengthen your connection to the akashic records and ancestral wisdom.",
    "Illuminate the mind with clarity, insight, and deeper understanding.",
  ],
  Manifestation: [
    "Imprint your desire onto the universal field and accelerate its materialization.",
    "Bridge the gap between intent and reality through focused magical will.",
    "Align the energies of heaven and earth to bring your vision into form.",
  ],
  "Self-Mastery": [
    "Strengthen your willpower and align your actions with your highest self.",
    "Break free from limiting patterns and step into your personal power.",
    "Forge unshakeable discipline and mastery over your thoughts and emotions.",
  ],
  "Letting Go": [
    "Release emotional attachments that no longer serve your highest good.",
    "Cut the cords binding you to past pain, grief, and old stories.",
    "Surrender what weighs you down and make space for new blessings.",
  ],
  "Power & Dominion": [
    "Claim your personal authority and command respect in all situations.",
    "Amplify your natural charisma and influence through focused intention.",
    "Step into your sovereign power and rule your own domain.",
  ],
  Transformation: [
    "Shed your old skin and emerge reborn through the crucible of magical fire.",
    "Undergo a profound energetic metamorphosis to align with your true self.",
    "Dissolve the structures that confine you and reform them from pure intent.",
  ],
  "Sex Magic": [
    "Channel sexual energy into focused intent for powerful magical results.",
    "Weave the energies of passion and desire into a spell of deep connection.",
    "Harness the creative life force for transformative magical workings.",
  ],
  Summoning: [
    "Open a gateway between worlds and call forth a spirit to counsel or aid you.",
    "Establish a clear channel of communication with entities from beyond the veil.",
    "Create a sacred container for spirit contact and evocation.",
  ],
  Destruction: [
    "Direct focused destructive energy to dismantle obstacles and enemies.",
    "Call upon the forces of unraveling to break what must be broken.",
    "Channel the power of entropy to dissolve that which opposes your will.",
  ],
  Revenge: [
    "Return the harm that was sent to you, multiplied by the law of reflection.",
    "Call cosmic justice upon those who have wronged you without mercy.",
    "Activate the karmic boomerang to deliver consequences to the perpetrator.",
  ],
};

const CATEGORY_STEPS: Record<string, string[]> = {
  "Love & Attraction": [
    "Cleanse your space and yourself with sacred smoke or salt water.",
    "Cast a circle of protection, calling in the directions and your guides.",
    "Light the candle while focusing on your heart center and the love you wish to attract.",
    "Speak your intention aloud three times, each time with increasing conviction.",
    "Visualize the love you desire as already present — feel it, breathe it, embody it.",
  ],
  Protection: [
    "Begin by centering yourself through deep, grounding breaths.",
    "Trace a protective symbol in the air or on the ground with your finger or tool.",
    "Charge the protective barrier with your intent, pushing energy outward from your core.",
    "Name what you are protected from and what is allowed to pass.",
    "Seal the barrier with a final gesture — a clap, a stamp, or a spoken word of power.",
  ],
  Cleansing: [
    "Prepare your cleansing solution — salt water, herbal smoke, or charged water.",
    "Starting at the top of your space or body, work downward in clockwise spirals.",
    "As you cleanse, visualize grey stagnant energy dissolving into white light.",
    "Pay special attention to corners, doorways, and areas where energy pools.",
    "Open a window or door to let the released energy exit completely.",
  ],
};

const VARIATION_TEMPLATES = [
  (e: string) => `Elemental Variation: Substitute ${e} elements for the primary element. Use a ${e.toLowerCase()} candle and corresponding tools.`,
  (e: string) => `${e} Variant: Perform this working with ${e.toLowerCase()} as the dominant force. Adjust the timing to the ${e.toLowerCase()} planetary hour.`,
  (t: string) => `${t} Tradition Variant: Adapt this spell following ${t.toLowerCase()} practices. Incorporate traditional ${t.toLowerCase()} symbols and invocations.`,
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function deterministicPick<T>(arr: T[], seed: string, count: number): T[] {
  const indices = [...Array(arr.length).keys()];
  indices.sort((a, b) => hashString(seed + a) - hashString(seed + b));
  return indices.slice(0, count).map((i) => arr[i]);
}

function generateMaterials(element: string, difficulty: number, seed: string): string[] {
  const base = ELEMENT_MATERIALS[element] ?? ELEMENT_MATERIALS.Spirit;
  const count = Math.min(3 + Math.floor(difficulty / 2), base.length);
  const selected = deterministicPick(base, seed + "_materials", count);
  const extra: string[] = [];
  if (difficulty >= 6) extra.push("Protective circle tools", "Personal talisman or amulet");
  if (difficulty >= 8) extra.push("Consecrated ritual blade", "Scribed parchment petition");
  return [...selected, ...extra];
}

function generateSteps(category: string, difficulty: number, seed: string): string[] {
  const base = CATEGORY_STEPS[category] ?? [
    "Prepare your sacred space by cleansing and setting protective boundaries.",
    "Arrange your materials on the altar in a pattern that resonates with your intent.",
    "Center yourself through breath and grounding visualization.",
    "State your intention clearly, with conviction and focus.",
    "Perform the working, channeling energy toward your goal.",
    "Give thanks to the forces and guides that assisted you.",
    "Close the circle and ground any excess energy.",
  ];
  const count = Math.min(3 + Math.floor(difficulty / 2), base.length + 2);
  const steps = deterministicPick(base, seed + "_steps", count);
  if (difficulty >= 5 && !steps.some((s) => s.includes("invocation"))) steps.push("Recite the invocation or power words three times.");
  if (difficulty >= 7) steps.push("Raise energy through chanting, dancing, or focused breathwork.");
  if (difficulty >= 9) steps.push("Perform the sealing gesture or sacrifice to lock the spell.");
  return steps;
}

function generateVariations(element: string, tradition: string, seed: string): string[] {
  const vars: string[] = [];
  const otherElements = Object.keys(ELEMENT_MATERIALS).filter((e) => e !== element);
  const picked = deterministicPick(otherElements, seed + "_vars", Math.min(2, otherElements.length));
  for (const e of picked) {
    vars.push(VARIATION_TEMPLATES[0](e));
  }
  const otherTrads = ["Celtic", "Norse", "Egyptian", "Hoodoo"].filter((t) => t !== tradition);
  if (otherTrads.length > 0) {
    vars.push(VARIATION_TEMPLATES[2](deterministicPick(otherTrads, seed + "_trad", 1)[0]));
  }
  return vars;
}

export function generateRichContent(
  title: string,
  category: string,
  element: string,
  tradition: string,
  difficulty: number,
  danger: number,
): RichContent {
  const seed = `${title}|${category}|${element}`;
  const purposes = CATEGORY_PURPOSES[category] ?? ["Focus your intent and channel energy toward your desired outcome."];
  const purpose = purposes[hashString(seed) % purposes.length];
  const materials = generateMaterials(element, difficulty, seed);
  const steps = generateSteps(category, difficulty, seed);
  const variations = generateVariations(element, tradition, seed);

  return { purpose, materials, steps, variations };
}
