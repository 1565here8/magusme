import type { ArcanaEntry } from "./types";

type Seed = Omit<
  ArcanaEntry,
  "createdAt" | "indexedAt" | "backlashText" | "alternativesText" | "planetaryTiming" | "isKabbalistic"
>;

export const MANIFESTATION_SEED_ENTRIES: Seed[] = [
  {
    id: "arc_manifest_coue",
    title: "Émile Coué — Conscious Autosuggestion (1922)",
    tradition: "French New Thought / Autosuggestion",
    category: "affirmation",
    intentTags: ["affirmation", "autosuggestion", "coue", "self-hypnosis", "manifestation"],
    summary:
      "Foundational spoken affirmation method — repeat a simple present-tense phrase 20× morning and night until the unconscious accepts it.",
    previewText:
      "Every day, in every way, I am getting better and better — spoken slowly with closed eyes, no effort, no willpower struggle…",
    fullText: `# Coué Method — Conscious Autosuggestion

Source: Émile Coué, *Self-Mastery Through Conscious Autosuggestion* (public domain).

## Core law
The imagination always wins over willpower when they conflict. Speak as if already true — never "I will."

## Standard affirmation
"Every day, in every way, I am getting better and better."

## Personal formula
Replace with your goal in present tense: "Every day, I am more [confident / prosperous / healthy / loved]."

## Protocol
1. Morning upon waking — 20 repetitions, eyes closed, relaxed breath.
2. Night before sleep — 20 repetitions.
3. Optional: whisper on the **in-breath** only (Coué's advanced method).
4. Minimum 21 days; 90 days for deep imprinting.

## Visualization add-on
After the 20th repetition, hold a single vivid image of the outcome for 60 seconds — no strain.`,
    source: { title: "Self-Mastery Through Conscious Autosuggestion", author: "Émile Coué", year: "1922", institution: "Internet Archive / Gutenberg" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_napoleon_hill",
    title: "Napoleon Hill — Definite Chief Aim & Mastermind",
    tradition: "New Thought / Success Literature",
    category: "manifestation",
    intentTags: ["napoleon hill", "chief aim", "mastermind", "visualization", "manifestation"],
    summary:
      "Write a single definite chief aim, read it twice daily with emotion, and assemble a mastermind alliance for its realization.",
    previewText:
      "Write your chief aim in present tense, set a deadline, state what you give in return, read aloud morning and night…",
    fullText: `# Definite Chief Aim (Napoleon Hill)

Source: *Think and Grow Rich* / *Law of Success* (public domain editions).

## Written statement format
1. Exact amount or outcome desired.
2. Deadline date.
3. What you will give in return (service, value, discipline).
4. Written plan to achieve it.
5. Signed and dated.

## Daily ritual
- Read aloud **morning and night** with closed eyes, seeing and feeling possession.
- Add **auto-suggestion** at night: repeat chief aim until drowsy.

## Mastermind
Form a group of 2–8 aligned minds meeting regularly to refine the aim and hold accountability.

## Visualization
30 minutes daily "sitting for ideas" — quiet room, chief aim held in mind until inspired action arises.`,
    source: { title: "Think and Grow Rich", author: "Napoleon Hill", year: "1937", institution: "Internet Archive" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_shakti_gawain",
    title: "Creative Visualization — Shakti Gawain Method",
    tradition: "New Age / Creative Visualization",
    category: "manifestation",
    intentTags: ["visualization", "creative visualization", "manifestation", "meditation"],
    summary:
      "Relax body, breathe deeply, construct a mental movie of your goal already achieved — engage all senses for 10–15 minutes daily.",
    previewText:
      "Relax… breathe… see your goal as already done — colors, sounds, touch, emotion. End with gratitude and release…",
    fullText: `# Creative Visualization (Gawain lineage)

## Preparation
Quiet space. 4-7-8 breath × 4 cycles. Body scan from feet to crown.

## The movie
1. Define one clear scene (not a montage) showing goal **already achieved**.
2. First person perspective — you are inside the scene.
3. Engage: sight, sound, smell, touch, emotional tone.
4. Hold 10–15 min. If mind wanders, gently return.

## Pink bubble technique
After visualization, imagine your desire in a pink bubble of love and **release it upward** — trust the universe.

## Journal pairing
Write 3 lines after each session: what you saw, what you felt, one inspired action for today.`,
    source: { title: "Creative Visualization", author: "Shakti Gawain", year: "1978", institution: "Published corpus / summaries" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_eft_basic",
    title: "EFT Tapping — Basic Recipe (Emotional Freedom Technique)",
    tradition: "Energy Psychology / Gary Craig lineage",
    category: "nlp",
    intentTags: ["EFT", "tapping", "emotional freedom", "manifestation block", "anxiety"],
    summary:
      "Tap meridian points while stating the issue and an acceptance phrase — clears emotional resistance to manifestation.",
    previewText:
      "Setup: Even though I have [issue], I deeply love and accept myself. Tap karate chop → eyebrow → side of eye → …",
    fullText: `# EFT Basic Recipe

Source: Gary Craig, *EFT Manual* (archived public tutorials).

## Setup (repeat 3× while tapping karate chop)
"Even though I have [this problem / this fear about manifesting X], I deeply and completely accept myself."

## Reminder phrase
"This [problem / fear of not having X]."

## Tapping sequence (5–7 taps each, say reminder phrase)
1. Top of head
2. Eyebrow
3. Side of eye
4. Under eye
5. Under nose
6. Chin
7. Collarbone
8. Under arm
9. Top of head

## Manifestation variant
Round 1: tap the **block** ("Even though I don't believe I deserve abundance…").
Round 2: tap the **positive** ("I choose to feel worthy of abundance now").
Round 3: visualize desired outcome while tapping through points with no words.

## Frequency
3 full rounds per issue; revisit when intensity returns above 3/10.`,
    source: { title: "EFT Manual", author: "Gary Craig", year: "1990s", institution: "EFT archive / emofree.com historical" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_nlp_swish",
    title: "NLP Swish Pattern — Identity-Level Reframe",
    tradition: "Neuro-Linguistic Programming",
    category: "nlp",
    intentTags: ["NLP", "swish pattern", "reframe", "visualization", "habit change"],
    summary:
      "Replace an unwanted self-image with a compelling future self-image using rapid submodality swish — classic Bandler/Grinder pattern.",
    previewText:
      "See the old you small and dim → SWISH to bright large future you — repeat until automatic…",
    fullText: `# NLP Swish Pattern

## Identify cue
What triggers the unwanted state? (e.g., seeing a bill → "broke self" image)

## Construct two images
- **Cue image:** small, dim, lower-left — current unwanted identity.
- **Desired image:** bright, large, colorful — you **as already having** the goal.

## Swish (repeat 5–20×)
1. Big bright desired image far away.
2. Small dim cue image foreground.
3. **Swish!** — cue shrinks to point and flies away; desired image explodes to full screen.
4. Blank screen 2 seconds. Repeat.

## Break state between reps
Stand, shake out body.

## Test
Try to invoke old image — it should feel weak or absurd.`,
    source: { title: "Frogs into Princes / NLP Volume I", author: "Bandler & Grinder", year: "1979", institution: "NLP historical corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_nlp_anchoring",
    title: "NLP Resource Anchoring for Manifestation States",
    tradition: "Neuro-Linguistic Programming",
    category: "nlp",
    intentTags: ["NLP", "anchoring", "state management", "confidence", "manifestation"],
    summary:
      "Stack peak emotional states and fire a physical anchor (knuckle press) to access manifestation-ready confidence on demand.",
    previewText:
      "Recall peak success memory → at peak intensity press anchor → repeat with 4–5 memories → test anchor…",
    fullText: `# NLP Stacked Anchor

## Choose anchor
Unique gesture: thumb + middle finger press on left knuckle (unused in daily life).

## Stack states (4–5 memories)
For each peak memory of confidence, love, abundance, or creative flow:
1. Fully associate — see through your eyes, hear, feel.
2. At **peak**, press anchor 2 seconds.
3. Break state — look at ceiling, count backward from 10.
4. Next memory.

## Test
Press anchor — full stacked state should flood in within 2 seconds.

## Manifestation use
Before visualization, journaling, or important action — fire anchor, then begin practice.`,
    source: { title: "NLP Practitioner materials", author: "Richard Bandler", year: "1980s", institution: "NLP training corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_morning_pages",
    title: "Morning Pages — Julia Cameron (Artist's Way)",
    tradition: "Expressive Writing / Creativity",
    category: "manifestation",
    intentTags: ["journaling", "morning pages", "stream of consciousness", "creativity", "manifestation"],
    summary:
      "Three pages longhand stream-of-consciousness every morning — clears mental clutter so desire and intuition surface.",
    previewText:
      "Upon waking, before phone or coffee — 3 pages longhand, anything at all, no editing, no sharing…",
    fullText: `# Morning Pages

Source: Julia Cameron, *The Artist's Way*.

## Rules
1. **Three pages** longhand — not digital.
2. First thing upon waking (or within 90 min).
3. Write **anything** — complaints, lists, dreams, nonsense.
4. No reading back for 8 weeks. No sharing.

## Manifestation layer
Page 2 optional prompt: "If I already had [goal], today I would…"
Page 3: "I am grateful that…" (5 lines minimum).

## Why it works
Drains the "censor" (left-brain critic) so visualization and action arise from deeper self.`,
    source: { title: "The Artist's Way", author: "Julia Cameron", year: "1992", institution: "Published corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_future_self_journal",
    title: "Future Self Journaling — Write From the Goal Achieved",
    tradition: "Positive Psychology / Narrative Therapy blend",
    category: "manifestation",
    intentTags: ["journaling", "future self", "narrative", "manifestation", "visualization"],
    summary:
      "Journal in past tense as your future self who has already achieved the goal — embeds identity shift at narrative level.",
    previewText:
      "Date: one year from now. Dear past me, today I finally… — describe ordinary Tuesday in achieved life…",
    fullText: `# Future Self Journal

## Setup
Date the entry **one year forward** (or your deadline).

## Prompt
"Dear [your name] of [past date],

Today is an ordinary Tuesday. I want you to know that [goal] is now my normal life. Here's what happened…"

## Write for 15 min covering
- Morning routine in achieved state
- How relationships feel different
- One unexpected blessing
- Advice to past self

## Frequency
Weekly same day. Re-read monthly — note what manifested vs. what shifted internally.`,
    source: { title: "Narrative therapy / positive psychology synthesis", author: "Merlian corpus", year: "2020s", institution: "Clinical positive psych literature" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_gratitude_journal",
    title: "Gratitude Journaling — Emmons & McCullough Protocol",
    tradition: "Positive Psychology (Seligman school)",
    category: "manifestation",
    intentTags: ["gratitude", "journaling", "positive psychology", "wellbeing", "manifestation"],
    summary:
      "Write 5 specific gratitudes nightly — proven to increase wellbeing and receptivity to opportunity (broaden-and-build theory).",
    previewText:
      "Each night: 5 things you are grateful for today — be specific, include why…",
    fullText: `# Gratitude Journal (Research Protocol)

Source: Emmons & McCullough gratitude intervention studies.

## Nightly (5 items)
1. Be **specific** ("the barista remembered my name" not "my health").
2. Include **why** it mattered.
3. At least 2 items must be **surprises** or small moments.

## Weekly deep entry
One person who helped you — write a letter (send optional).

## Manifestation pairing
Item 5 each night: "Something that moved me closer to [goal] today, even slightly."

## Duration
Minimum 21 days for measurable mood shift; 90 days for trait change.`,
    source: { title: "Counting Blessings vs. Burdens", author: "Emmons & McCullough", year: "2003", institution: "Journal of Personality and Social Psychology" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_self_hypnosis_dave_elman",
    title: "Dave Elman Induction — Self-Hypnosis for Suggestion",
    tradition: "Clinical Hypnosis",
    category: "nlp",
    intentTags: ["self-hypnosis", "hypnosis", "Dave Elman", "suggestion", "manifestation"],
    summary:
      "Eye closure + progressive relaxation + fractionation — reach somnambulistic depth for planting manifestation suggestions.",
    previewText:
      "Roll eyes up, close lids, breathe… relax body in stages… fractionate by opening/closing eyes… deliver suggestion…",
    fullText: `# Dave Elman Self-Hypnosis (Simplified)

## Induction
1. Eyes up, close lids, take deep breath, let body go limp.
2. "Relax the muscles around the eyes so completely they won't work even if you try" — test, then stop trying.
3. Spread relaxation: scalp → jaw → neck → shoulders → chest → abdomen → legs → feet.
4. **Fractionation:** open eyes briefly, close, double relaxation. Repeat 3×.

## Suggestion delivery (at depth)
Speak slowly: "Every day my mind accepts that [goal in present tense] is my natural reality. I act accordingly with ease."

## Awakening
"At the count of 5, eyes open, alert, refreshed. 1… 2… 3… 4… 5."

## Practice
Daily 10 min before visualization. Record your voice for playback.`,
    source: { title: "Hypnotherapy", author: "Dave Elman", year: "1964", institution: "Clinical hypnosis corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_stoic_premeditatio",
    title: "Stoic Premeditatio Malorum + Amor Fati",
    tradition: "Stoic Philosophy",
    category: "manifestation",
    intentTags: ["stoicism", "marcus aurelius", "seneca", "philosophy", "resilience", "manifestation"],
    summary:
      "Morning premeditation of obstacles plus evening review — clears fear so action toward goals becomes inevitable (Epictetus/M.Aurelius).",
    previewText:
      "Morning: what could go wrong today? How will virtue handle it? Evening: what went well, what to improve…",
    fullText: `# Stoic Daily Practice for Goal Pursuit

Sources: Marcus Aurelius *Meditations*, Seneca *Letters*, Epictetus *Enchiridion* (public domain).

## Morning — Premeditatio
"Today I will meet interference, ingratitude, arrogance. I will not be harmed because virtue is my aim."
Visualize your goal-action **and** the obstacle — rehearse calm response.

## Day — Amor Fati
Whatever happens: "This is raw material for virtue and for my path."

## Evening — Review (Seneca)
1. What did I do well toward my aim?
2. Where did passion override reason?
3. One correction for tomorrow.

## Manifestation link
Desire the outcome **preferably**, not **desperately** — attach to effort and character, not external guarantee.`,
    source: { title: "Meditations", author: "Marcus Aurelius", year: "~170 CE", institution: "Gutenberg / Loeb public translations" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_james_visualization",
    title: "William James — As If + Act As If",
    tradition: "Pragmatic Philosophy / Psychology",
    category: "manifestation",
    intentTags: ["william james", "philosophy", "act as if", "manifestation", "psychology"],
    summary:
      "Act and feel 'as if' the desired state were already real — emotion follows action (James–Lange insight applied to goals).",
    previewText:
      "If you want confidence, act confidently before you feel it. Motion creates emotion…",
    fullText: `# William James — "Act As If"

Source: *The Principles of Psychology* / *The Varieties of Religious Experience*.

## Core principle
"Action seems to follow feeling, but really action and feeling go together; and by regulating the action… we can indirectly regulate the feeling."

## Protocol
1. Define the **behavior** of someone who has your goal.
2. Perform one such behavior today — dress, posture, schedule, language.
3. Do not wait for feeling — feeling follows within 2–3 weeks of consistent action.

## Daily
Morning: "How would Future Me walk, speak, and prioritize today?"
Execute one behavior before noon.`,
    source: { title: "The Principles of Psychology", author: "William James", year: "1890", institution: "Gutenberg / Harvard corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_perma",
    title: "PERMA Wellbeing Model — Seligman Manifestation Grounding",
    tradition: "Positive Psychology",
    category: "manifestation",
    intentTags: ["PERMA", "seligman", "positive psychology", "wellbeing", "manifestation"],
    summary:
      "Score and cultivate Positive emotion, Engagement, Relationships, Meaning, Achievement — sustainable base for any manifestation work.",
    previewText:
      "Rate each PERMA domain 1–10 weekly. Pick lowest domain — one micro-action this week…",
    fullText: `# PERMA Model (Martin Seligman)

## Weekly audit (1–10 each)
- **P** — Positive emotion (joy, gratitude, peace)
- **E** — Engagement (flow states)
- **R** — Relationships (connection quality)
- **M** — Meaning (purpose beyond self)
- **A** — Achievement (competence, progress)

## Manifestation rule
Do not pursue a material goal if PERMA average < 5 without addressing the lowest pillar first — collapsed pillars sabotage results.

## Micro-actions
Low P → 5-min savoring walk
Low E → 90-min deep work block on passion project
Low R → one vulnerable conversation
Low M → volunteer or connect goal to service
Low A → break goal into today's smallest win`,
    source: { title: "Flourish", author: "Martin Seligman", year: "2011", institution: "UPenn Positive Psychology Center" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_369",
    title: "3-6-9 Writing Method (Tesla-inspired folk practice)",
    tradition: "Modern Manifestation Folk",
    category: "affirmation",
    intentTags: ["369 method", "writing", "affirmation", "manifestation", "tesla"],
    summary:
      "Write your desire 3× morning, 6× afternoon, 9× night for 33 days — couples repetition with intention (popular folk protocol).",
    previewText:
      "Morning: write intention 3×. Afternoon: 6×. Night: 9×. Present tense. 33 days…",
    fullText: `# 3-6-9 Manifestation Writing

## Intention sentence
One sentence, present tense: "I am [specific outcome]." or "I have [specific outcome]."

## Daily schedule
- **Morning:** write 3×
- **Afternoon:** write 6×
- **Evening:** write 9×

## Rules
- Same sentence all 33 days (refine once before day 1 only).
- Handwritten preferred.
- After writing, 60-sec eyes-closed visualization.

## Pair with
Gratitude line after each session. Action step within 24 hours toward goal.`,
    source: { title: "Modern folk synthesis (Tesla number mysticism popularized)", author: "Folk / social media corpus", year: "2010s", institution: "Merlian curated protocol" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_scripting",
    title: "Scripting — Law of Assumption Journal",
    tradition: "New Thought / Neville Goddard lineage",
    category: "affirmation",
    intentTags: ["scripting", "law of assumption", "neville", "journaling", "manifestation"],
    summary:
      "Write diary entries from the reality where your desire is already fulfilled — Neville Goddard 'living in the end' in written form.",
    previewText:
      "Dear Diary, I can't believe how natural it feels now that… — write today's entry from fulfilled state…",
    fullText: `# Scripting (Living in the End)

Source: Neville Goddard lectures (public domain recordings/transcripts).

## Entry format
"Dear Diary,
Today was normal. [Desire] is just part of my life now. This morning I…"

## Rules
- Present tense only.
- Include mundane details (makes it believable to subconscious).
- Feel the satisfaction as you write — don't perform emptily.

## SATS pairing (State Akin To Sleep)
Before sleep, 10-min drowsy visualization of one scene from script. Loop until drowsy.

## Frequency
Daily scripting + nightly SATS for 30 days.`,
    source: { title: "Neville Goddard Lecture Corpus", author: "Neville Goddard", year: "1940s–60s", institution: "Internet Archive / nevillegoddard.io public lectures" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_lucky_duck",
    title: "Lucky Duck Syndrome Reframe — Wiseman Luck Principles",
    tradition: "Positive Psychology / Experimental",
    category: "manifestation",
    intentTags: ["luck", "richard wiseman", "opportunity", "manifestation", "positive psychology"],
    summary:
      "Maximize 'luck surface area' — relax attention, vary routine, expect good fortune (Wiseman's 4 luck principles).",
    previewText:
      "Build luck: flexible attention, network, positive expectation, resilience to bad luck…",
    fullText: `# The Luck Factor (Richard Wiseman)

## Four principles
1. **Maximize chance opportunities** — talk to strangers, vary routes, say yes.
2. **Listen to hunches** — meditation sharpens intuition signals.
3. **Expect good fortune** — self-fulfilling attention filter.
4. **Turn bad luck to good** — reframing setbacks as redirection.

## Weekly luck experiment
- One new conversation with someone outside your circle.
- One new place visited.
- Journal "lucky breaks" nightly — trains pattern recognition.

## Manifestation link
Opportunity often arrives disguised as inconvenience — principle 4 prevents quitting before receipt.`,
    source: { title: "The Luck Factor", author: "Richard Wiseman", year: "2003", institution: "Experimental psychology corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_vipassana_note",
    title: "Vipassana Body Scan — Insight for Desire Clarity",
    tradition: "Buddhist Meditation",
    category: "manifestation",
    intentTags: ["vipassana", "meditation", "body scan", "mindfulness", "manifestation"],
    summary:
      "Goenka-style body scan dissolves craving/aversion — clarifies whether a goal is authentic desire or compensatory craving.",
    previewText:
      "Sit 45 min. Sweep attention head to feet — observe sensation without reaction. Anicca, anatta, dukkha…",
    fullText: `# Vipassana Body Scan (Brief Home Practice)

Source: S.N. Goenka tradition (public course materials summary).

## Sit
45 min, spine straight, eyes closed.

## Scan
Move attention systematically: head → face → neck → shoulders… → feet. 2–3 sec per region.

## On each sensation
Observe without moving. Note: pleasant / unpleasant / neutral. **Do not react.**

## Insight goal
Desires that survive non-reactive observation are worth manifesting. Desires that dissolve were craving.

## Daily manifest check
After scan: "Does [goal] still feel clean?" If yes, proceed with visualization.`,
    source: { title: "Vipassana meditation public instructions", author: "S.N. Goenka lineage", year: "1960s+", institution: "dhamma.org public materials" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_transcendental",
    title: "Transcendental Meditation — Mantra Protocol (Overview)",
    tradition: "Vedic Meditation",
    category: "manifestation",
    intentTags: ["TM", "transcendental meditation", "mantra", "meditation", "manifestation"],
    summary:
      "20 min twice daily with individually assigned bija mantra — transcending thought to restful alertness (Maharishi Mahesh Yogi protocol overview).",
    previewText:
      "Sit comfortably, eyes closed, silently repeat mantra without force — return gently when distracted…",
    fullText: `# TM-Style Mantra Meditation (Educational Overview)

Source: Maharishi Mahesh Yogi public lectures (mantras traditionally assigned by teacher).

## Practice
- 20 min morning, 20 min evening.
- Sit comfortably, eyes closed.
- Silently repeat a **soft, simple sound** (traditionally assigned; home learners may use "So Hum" or "Om" with respect to tradition).
- When thoughts arise, **effortlessly** return to mantra.
- Do not force concentration or expect experiences.

## Manifestation timing
Meditate **before** visualization — rested nervous system accepts imagery more deeply.

## Note
Traditional TM requires certified instruction; this entry documents the public protocol shape for educational comparison.`,
    source: { title: "Science of Being and Art of Living", author: "Maharishi Mahesh Yogi", year: "1963", institution: "Published corpus" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_wattles",
    title: "Wallace Wattles — Creative Method & Gratitude",
    tradition: "New Thought",
    category: "manifestation",
    intentTags: ["wallace wattles", "science of getting rich", "gratitude", "visualization", "manifestation"],
    summary:
      "Hold mind on vision of increase, act efficiently in present work, and practice continuous gratitude — Wattles' creative method.",
    previewText:
      "Form clear mental picture of what you want. Hold it. Act now with faith. Be grateful for everything…",
    fullText: `# Wallace Wattles — Science of Getting Rich Method

Source: *The Science of Getting Rich* (public domain).

## Creative method
1. Form a **clear mental picture** of what you want — add missing details daily.
2. **Will** to have it (not wish — decide).
3. **Faith** that you already possess it in the formless.
4. **Gratitude** for it now.
5. **Act** efficiently in your present channel — do today's work in a successful manner.

## Daily
Morning: 10 min picture-building.
All day: "I am grateful that [goal] is coming to me."
Evening: add one detail to mental picture.

## Warning (Wattles)
Do not use willpower to force external people — work through creative, not competitive, mind.`,
    source: { title: "The Science of Getting Rich", author: "Wallace Wattles", year: "1910", institution: "Gutenberg" },
    isBaneful: false,
  },
  {
    id: "arc_manifest_cbt_thought_record",
    title: "CBT Thought Record for Limiting Beliefs",
    tradition: "Cognitive Behavioral Therapy",
    category: "nlp",
    intentTags: ["CBT", "thought record", "limiting beliefs", "manifestation block", "psychology"],
    summary:
      "Identify automatic negative thoughts blocking manifestation, examine evidence, craft balanced alternative belief.",
    previewText:
      "Situation → Automatic thought → Emotion → Evidence for/against → Balanced thought…",
    fullText: `# CBT 7-Column Thought Record

## Columns
1. **Situation** — what happened when doubt arose?
2. **Automatic thought** — "I'll never have X"
3. **Emotion** — name + 0–100% intensity
4. **Evidence FOR** the thought
5. **Evidence AGAINST** the thought
6. **Balanced thought** — realistic, kind, actionable
7. **Re-rate emotion**

## Manifestation use
Run record on every "I can't have" thought about your goal. Balanced thought becomes your **working affirmation**.

## Frequency
Each blocking thought once through full record. Keep journal of balanced thoughts — review weekly.`,
    source: { title: "Feeling Good / CBT manuals", author: "Aaron Beck / David Burns lineage", year: "1980s", institution: "Clinical psychology corpus" },
    isBaneful: false,
  },
];

export function mergeManifestationSeeds(entries: Seed[]): Seed[] {
  const ids = new Set(entries.map((e) => e.id));
  return [...entries, ...MANIFESTATION_SEED_ENTRIES.filter((e) => !ids.has(e.id))];
}
