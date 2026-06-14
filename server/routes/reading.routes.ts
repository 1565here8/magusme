import type { Express, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

const SAMPLE_SITUATIONS = [
  "Feeling stuck in my career, no growth for 2 years",
  "Relationship uncertainty, not sure if partner is right for me",
  "Financial struggles, can't seem to break the poverty cycle",
  "Someone is working against me at work, office politics",
  "Want to attract love but keep attracting the wrong people",
  "Feeling energetically drained, like something is feeding on me",
];

function buildPattern(situation: string): string {
  const hasWork = /\b(career|work|job|boss|colleague|office|promotion|business|money|financial)\b/i.test(situation);
  const hasLove = /\b(love|relationship|partner|romance|heart|dating|marriage|crush)\b/i.test(situation);
  const hasConflict = /\b(enemy|against|hex|cursed|attack|conflict|fight|argument|angry)\b/i.test(situation);

  if (hasWork) {
    return "Saturn Return intersecting with a 9-year numerological cycle. The Tower card reversed indicates you're resisting necessary change. Rune Isa (stagnation) confirms — you're frozen by fear of the unknown, not by lack of opportunity. Your natal Mars in 10th house (career) is being squared by transiting Pluto — power struggles are surfacing to push you toward your real path.";
  }
  if (hasLove) {
    return "Venus retrograde activating your 7th house of partnerships. The Lovers card reversed suggests a choice needs to be made. Rune Gebo (partnership) indicates a karmic contract — what you give is what you receive. Your natal Venus in Libra seeks harmony but your Moon in Scorpio feels deeply. The tension between head and heart is the pattern.";
  }
  if (hasConflict) {
    return "Mars-Pluto alignment creating a power dynamic. The Tower upright shows destruction is necessary — someone or something must fall for you to rise. Thurisaz (defense rune) suggests you're under psychic attack. Your 9th numerological year is about purging enemies, not making peace.";
  }
  return "A convergence of celestial and numerological forces at a pivotal juncture. The Wheel of Fortune indicates change is coming whether you resist or embrace it. Rune Ansuz (communication) suggests a message is trying to reach you. Your current life path cycle is completing — what ends now makes room for what must begin. The pattern is one of necessary transition, not permanent stagnation.";
}

function buildReading(situation: string) {
  const hasWork = /\b(career|work|job|boss|colleague|office|promotion|business|money|financial)\b/i.test(situation);
  const hasLove = /\b(love|relationship|partner|romance|heart|dating|marriage|crush)\b/i.test(situation);
  const hasConflict = /\b(enemy|against|hex|cursed|attack|conflict|fight|argument|angry)\b/i.test(situation);

  if (hasWork) {
    return {
      pattern: buildPattern(situation),
      reading: [
        { system: "Tarot", icon: "Sparkles", content: "The Tower (reversed) — You're avoiding a necessary breakdown. The Star — Hope is coming but you must release the old first. Judgement — A major life call is waiting." },
        { system: "Runes", icon: "Scroll", content: "Isa — A period of necessary stillness. Use this time for inner work, not action. Jera behind it — A harvest cycle is completing." },
        { system: "Astrology", icon: "Moon", content: "Saturn return activating 10th house. Transiting Pluto squaring natal Mars. Jupiter trine Sun — protection is active, trust the process." },
        { system: "Numerology", icon: "Star", content: "Personal Year 9 — Endings and completion. This is the last year of a 9-year cycle. Your Life Path calls for solitude and analysis before action." },
      ],
      spells: [
        { title: "Road Opener", tradition: "African", difficulty: "Medium", time: "Jupiter hour, Waxing moon", desc: "Remove obstacles blocking your financial path. Uses crossroads dirt and keys." },
        { title: "Path Clearing Bath", tradition: "Hoodoo", difficulty: "Easy", time: "Waning moon", desc: "Sea salt, rosemary, and cinnamon bath to remove energetic blocks from your career path." },
        { title: "Green Candle Prosperity", tradition: "Modern", difficulty: "Easy", time: "Jupiter hour, Thursday", desc: "Simple green candle ritual for attracting money and opportunities." },
      ],
      psychology: [
        { name: "Cognitive Reframing", desc: "Reframe 'I'm stuck' to 'I'm in a transition.' Journal daily for 5 minutes to track the shift.", type: "CBT" },
        { name: "Future Self Visualization", desc: "Daily 5-min NLP visualization of your successful future self. Anchor the feeling.", type: "NLP" },
        { name: "Shadow Journaling", desc: "Journal: 'What am I afraid would happen if I actually changed careers?'", type: "Shadow Work" },
      ],
      actionPlan: [
        { day: "Day 1-2", action: "Release ritual. Write your fears, burn them. Set intention for the next cycle.", icon: "Sparkles" },
        { day: "Day 3-7", action: "Cleansing bath × 3. Journal each morning about what you would do if fearless.", icon: "Moon" },
        { day: "Day 8-14", action: "Begin one small action toward change each day. Update resume. Take a course.", icon: "Star" },
        { day: "Day 15-21", action: "Network. Apply. Take bold steps. The stars support forward movement now.", icon: "ChevronRight" },
        { day: "Day 22-30", action: "Review progress. Adjust course based on what emerged. Repeat any powerful rituals.", icon: "Check" },
      ],
      avoid: "Don't make permanent decisions during the Void of Course moon. Avoid confrontation until Saturn shadow passes (3 weeks). Don't force relationship decisions while Neptune clouds your perception.",
    };
  }

  if (hasLove) {
    return {
      pattern: buildPattern(situation),
      reading: [
        { system: "Tarot", icon: "Sparkles", content: "The Lovers (reversed) — A choice between head and heart. The Empress — Fertility, nurturing, love. Two of Cups — A partnership is forming or needs renewal." },
        { system: "Runes", icon: "Scroll", content: "Gebo — Partnership and gifts. Wunjo — Joy in relationships. Laguz — Go with the flow, trust your intuition." },
        { system: "Astrology", icon: "Moon", content: "Venus retrograde in 7th house. Old relationship patterns returning to be healed. Jupiter trine Venus — protection in love." },
        { system: "Numerology", icon: "Star", content: "Personal Year 6 — The year of love, family, and responsibility. Relationships are the central theme of your current cycle." },
      ],
      spells: [
        { title: "Love Drawing Ritual", tradition: "Hoodoo", difficulty: "Easy", time: "Venus hour, Waxing moon", desc: "Red candle and rose petals to attract loving energy." },
        { title: "Rose Quartz Heart Opening", tradition: "Modern", difficulty: "Easy", time: "Venus hour, Friday", desc: "Gentle self-love ritual with rose quartz crystal." },
        { title: "Honey Jar Sweetening", tradition: "Hoodoo", difficulty: "Easy", time: "Venus hour, Waxing crescent", desc: "Sweeten feelings with a honey jar and rose petals." },
      ],
      psychology: [
        { name: "Attachment Style Work", desc: "Identify your attachment style (secure/anxious/avoidant). Journal about patterns from childhood.", type: "Attachment" },
        { name: "Inner Child Dialogue", desc: "Write a letter from your inner child about what they need in relationships. Respond as your adult self.", type: "Shadow Work" },
        { name: "Gratitude Reframing", desc: "List 3 things you appreciate about being single/in your current relationship. Shift focus from lack to abundance.", type: "CBT" },
      ],
      actionPlan: [
        { day: "Day 1-2", action: "Identify your relationship patterns. Journal what you truly want in a partner.", icon: "Heart" },
        { day: "Day 3-7", action: "Rose quartz self-love ritual daily. Clear out old love letters or mementos that no longer serve you.", icon: "Sparkles" },
        { day: "Day 8-14", action: "If single: put yourself in aligned spaces. If partnered: plan a meaningful date or conversation.", icon: "Star" },
        { day: "Day 15-21", action: "Deepen the connection — with self or other. Practice vulnerability.", icon: "ChevronRight" },
        { day: "Day 22-30", action: "Review. Set intentions for the next lunar cycle in love.", icon: "Check" },
      ],
      avoid: "Don't chase. What's meant for you will stay. Avoid love spells targeting specific people — sweeten, don't bind. Venus retrograde is for reflection, not initiation.",
    };
  }

  if (hasConflict) {
    return {
      pattern: buildPattern(situation),
      reading: [
        { system: "Tarot", icon: "Sparkles", content: "The Tower — A necessary destruction. The Devil — There's a bondage pattern here. Strength — You have the power to face what's coming." },
        { system: "Runes", icon: "Scroll", content: "Thurisaz — Defense and conflict. Someone is actively working against you. Tiwaz — Justice will prevail if you fight correctly." },
        { system: "Astrology", icon: "Moon", content: "Pluto squaring Mars is a POWER aspect. Someone is challenging your position. This is a test of will." },
        { system: "Numerology", icon: "Star", content: "Year 9 is about elimination. Cut cords, don't create new ones. Life Path 1 — You're a natural leader being tested." },
      ],
      spells: [
        { title: "Mirror of Justice", tradition: "Ceremonial", difficulty: "Medium", time: "Mars hour, Tuesday", desc: "Forces a wrongdoer to face consequences of their own actions." },
        { title: "Return to Sender", tradition: "Hoodoo", difficulty: "Medium", time: "Mars hour, Full moon", desc: "Redirects malicious energy back to its source threefold." },
        { title: "Freezing Spell", tradition: "Hoodoo", difficulty: "Easy", time: "Saturn hour, Waning moon", desc: "Freeze their negative actions with name in water." },
      ],
      psychology: [
        { name: "Strategic Mirroring", desc: "Mirror opponent's body language in meetings. Creates subconscious rapport, reduces aggression.", type: "NLP" },
        { name: "Anger Alchemy", desc: "Sit with the anger. Ask: 'What boundary is being crossed? What do you want me to protect?'", type: "Shadow Work" },
        { name: "Strategic Detachment", desc: "Emotionally detach from outcomes. CBT: 'What's the worst that can happen?' Write the realistic worst case.", type: "CBT" },
      ],
      actionPlan: [
        { day: "Today", action: "Cast Mirror Return to Sender. Document everything in writing.", icon: "Shield" },
        { day: "Day 2-3", action: "Justice binding ritual. Set your boundary clearly and firmly.", icon: "Scroll" },
        { day: "Day 4-7", action: "Strategic mirroring in every interaction. Journal anger alchemy daily.", icon: "Brain" },
        { day: "Day 8-14", action: "Take strategic action. If legal, consult. If political, gather allies.", icon: "ChevronRight" },
        { day: "Day 15-30", action: "Review. The situation should resolve. If not, escalate with stronger measures.", icon: "Check" },
      ],
      avoid: "Don't act impulsively in anger. Don't reveal your hand. Don't use baneful magic without first doing the Mirror Return. This is a marathon, not a sprint.",
    };
  }

  return {
    pattern: buildPattern(situation),
    reading: [
      { system: "Tarot", icon: "Sparkles", content: "The Wheel of Fortune — Change is inevitable. The Hanged Man — A pause is needed for perspective. Temperance — Balance and patience are key." },
      { system: "Runes", icon: "Scroll", content: "Ansuz — A message is coming. Raidho — A journey or change of path. Dagaz — A breakthrough is approaching." },
      { system: "Astrology", icon: "Moon", content: "Current transits suggest a period of alignment. Mercury is supporting clear communication. Jupiter brings expansion." },
      { system: "Numerology", icon: "Star", content: "You're in a transition between cycles. What ends now clears space for what must begin." },
    ],
    spells: [
      { title: "Full Moon Release", tradition: "Wiccan", difficulty: "Easy", time: "Full moon", desc: "Write what no longer serves you and burn it under the full moon." },
      { title: "Smoke Cleansing", tradition: "Wiccan", difficulty: "Easy", time: "Any, preferably waning moon", desc: "Purify your space with sage or incense smoke." },
      { title: "Sigil of Desire", tradition: "Chaos", difficulty: "Medium", time: "Waxing moon", desc: "Create a sigil for your clearest intention and charge it." },
    ],
    psychology: [
      { name: "Mindfulness Practice", desc: "10-minute daily mindfulness meditation. Focus on breath. Observe thoughts without judgment.", type: "Mindfulness" },
      { name: "Future Self Journaling", desc: "Write from the perspective of your future self who has moved through this transition.", type: "NLP" },
      { name: "Values Clarification", desc: "List your top 5 values. Are you living in alignment with them? What needs to shift?", type: "CBT" },
    ],
    actionPlan: [
      { day: "Day 1-3", action: "Full Moon Release or cleansing ritual. Clear the energetic slate.", icon: "Sparkles" },
      { day: "Day 4-7", action: "Journal your values and intentions. Create a sigil for your goal.", icon: "Moon" },
      { day: "Day 8-14", action: "Take one concrete step toward your intention. Momentum builds.", icon: "Star" },
      { day: "Day 15-21", action: "Review and adjust. Stay flexible — the path may look different than expected.", icon: "ChevronRight" },
      { day: "Day 22-30", action: "Integrate the lessons. Set next cycle intentions.", icon: "Check" },
    ],
    avoid: "Don't force specific outcomes — let the journey unfold. Avoid major life decisions during Mercury retrograde. Trust timing.",
  };
}

export function registerReadingRoutes(app: Express) {
  app.post(
    "/api/reading/analyze",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { situation } = req.body ?? {};
      if (!situation || typeof situation !== "string" || situation.trim().length < 3) {
        res.status(400).json({ error: "Please describe your situation in at least a few words." });
        return;
      }
      const result = buildReading(situation.trim());
      res.json({ ok: true, ...result });
    }),
  );
}
