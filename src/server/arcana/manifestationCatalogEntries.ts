/** Manifestation encyclopedia menu entries — merged into DIVINATION_CATALOG. */
type CatalogEntry = {
  id: string;
  label: string;
  category: string;
  mode: string;
  blurb: string;
  tradition?: string;
};

export const MANIFESTATION_CATALOG_ENTRIES: CatalogEntry[] = [
  // Deep astro
  {
    id: "deep_cosmic",
    label: "Deep Cosmic Profile (DOB + Name)",
    category: "Astronomical",
    mode: "astro_deep",
    blurb: "Natal chart + numerology + name synthesis + Chinese zodiac + chart ruler map",
    tradition: "Western + Pythagorean synthesis",
  },

  // Manifestation & Law of Attraction
  { id: "manifest_loa", label: "Law of Attraction Reading", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Align desire, belief, and inspired action", tradition: "New Thought" },
  { id: "manifest_assumption", label: "Law of Assumption (Neville)", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Live in the end — assume the wish fulfilled", tradition: "Neville Goddard" },
  { id: "manifest_sats", label: "SATS — State Akin To Sleep", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Pre-sleep imaginal scene implantation", tradition: "Neville Goddard" },
  { id: "manifest_wattles", label: "Wattles Creative Method", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Mental picture + gratitude + efficient action", tradition: "Wallace Wattles" },
  { id: "manifest_hill", label: "Definite Chief Aim", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Napoleon Hill written aim + mastermind", tradition: "Napoleon Hill" },
  { id: "manifest_369", label: "3-6-9 Writing Protocol", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Repetitive written intention schedule", tradition: "Modern folk" },
  { id: "manifest_sigil_chaos", label: "Chaos Sigil for Desire", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "Encode desire, destroy sigil, forget — Spare method", tradition: "Chaos magic" },
  { id: "manifest_moon_bath", label: "Moon Phase Manifestation", category: "Manifestation & Law of Attraction", mode: "manifestation_llm", blurb: "New moon plant / full moon release timing", tradition: "Folk astrology" },

  // Affirmations
  { id: "affirm_coue", label: "Coué Autosuggestion", category: "Affirmations & Scripts", mode: "manifestation_llm", blurb: "20× morning & night present-tense repetition", tradition: "Émile Coué" },
  { id: "affirm_scripting", label: "Scripting / Living in the End", category: "Affirmations & Scripts", mode: "manifestation_llm", blurb: "Diary entries from fulfilled future", tradition: "Neville Goddard" },
  { id: "affirm_iam", label: "I AM Affirmations", category: "Affirmations & Scripts", mode: "manifestation_llm", blurb: "Identity-level present-tense declarations", tradition: "New Thought" },
  { id: "affirm_mirror", label: "Mirror Work Affirmations", category: "Affirmations & Scripts", mode: "manifestation_llm", blurb: "Louise Hay style eye-contact self-talk", tradition: "New Thought / Hay" },
  { id: "affirm_sankalpa", label: "Sankalpa (Yogic Resolve)", category: "Affirmations & Scripts", mode: "manifestation_llm", blurb: "Short positive resolve in yoga nidra", tradition: "Yoga / Tantra" },
  { id: "affirm_mantra_love", label: "Loving-Kindness Mantra", category: "Affirmations & Scripts", mode: "manifestation_llm", blurb: "Metta phrases for self and goal", tradition: "Buddhist" },

  // Visualization
  { id: "viz_creative", label: "Creative Visualization", category: "Visualization & Mental Rehearsal", mode: "manifestation_llm", blurb: "Sensory-rich mental movie — Gawain method", tradition: "Shakti Gawain" },
  { id: "viz_mental_rehearsal", label: "Mental Rehearsal (Athletic)", category: "Visualization & Mental Rehearsal", mode: "manifestation_llm", blurb: "Sports psychology visualization for any skill", tradition: "Performance psych" },
  { id: "viz_temple", label: "Temple of Light Visualization", category: "Visualization & Mental Rehearsal", mode: "manifestation_llm", blurb: "Inner sacred space for receiving guidance", tradition: "Hermetic / New Age" },
  { id: "viz_photosynthesis", label: "Golden Light Body Fill", category: "Visualization & Mental Rehearsal", mode: "manifestation_llm", blurb: "Pour golden light through crown — qigong blend", tradition: "Qigong / Energy" },
  { id: "viz_future_self", label: "Future Self Meeting", category: "Visualization & Mental Rehearsal", mode: "manifestation_llm", blurb: "Dialogue with achieved future self", tradition: "Positive psychology" },
  { id: "viz_cinema", label: "Cinema of the Mind", category: "Visualization & Mental Rehearsal", mode: "manifestation_llm", blurb: "Edit negative mental clips to positive outcomes", tradition: "NLP" },

  // Journaling
  { id: "journal_morning_pages", label: "Morning Pages", category: "Journaling & Writing Practices", mode: "manifestation_llm", blurb: "3 pages stream-of-consciousness — Cameron", tradition: "Julia Cameron" },
  { id: "journal_future_self", label: "Future Self Journal", category: "Journaling & Writing Practices", mode: "manifestation_llm", blurb: "Write from goal-achieved identity", tradition: "Narrative therapy" },
  { id: "journal_gratitude", label: "Gratitude Journal (PERMA)", category: "Journaling & Writing Practices", mode: "manifestation_llm", blurb: "5 specific gratitudes nightly — Emmons protocol", tradition: "Positive psychology" },
  { id: "journal_bullet", label: "Bullet Journal Intentions", category: "Journaling & Writing Practices", mode: "manifestation_llm", blurb: "Monthly intention + daily log alignment", tradition: "Ryder Carroll" },
  { id: "journal_dream", label: "Dream Journal for Manifestation", category: "Journaling & Writing Practices", mode: "manifestation_llm", blurb: "Track symbols pointing toward desires", tradition: "Jungian" },
  { id: "journal_release", label: "Burn & Release Letter", category: "Journaling & Writing Practices", mode: "manifestation_llm", blurb: "Write blocks, safely destroy, visualize release", tradition: "Folk / therapeutic" },

  // Self-hypnosis
  { id: "hypno_elman", label: "Dave Elman Induction", category: "Self-Hypnosis & Trance", mode: "manifestation_llm", blurb: "Fractionation depth for suggestion planting", tradition: "Clinical hypnosis" },
  { id: "hypno_progressive", label: "Progressive Relaxation + Suggestion", category: "Self-Hypnosis & Trance", mode: "manifestation_llm", blurb: "Jacobson relax then embed affirmations", tradition: "Autogenic / clinical" },
  { id: "hypno_countdown", label: "10-to-1 Countdown Trance", category: "Self-Hypnosis & Trance", mode: "manifestation_llm", blurb: "Classic numeric deepening ladder", tradition: "Ericksonian folk" },
  { id: "hypno_staircase", label: "Staircase Deepening", category: "Self-Hypnosis & Trance", mode: "manifestation_llm", blurb: "Descend 10 steps into suggestible state", tradition: "Hypnotherapy standard" },
  { id: "hypno_recorded", label: "Recorded Self-Hypnosis Script", category: "Self-Hypnosis & Trance", mode: "manifestation_llm", blurb: "Write & record custom manifestation script", tradition: "Clinical / folk" },

  // NLP & EFT
  { id: "nlp_swish", label: "NLP Swish Pattern", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Replace unwanted self-image rapidly", tradition: "Bandler & Grinder" },
  { id: "nlp_anchor", label: "NLP Resource Anchoring", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Stack peak states with physical anchor", tradition: "NLP" },
  { id: "nlp_reframe", label: "Six-Step Reframe", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Negotiate with part maintaining blocks", tradition: "NLP" },
  { id: "nlp_timeline", label: "Timeline Therapy", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Release past blocks on mental timeline", tradition: "NLP / Tad James" },
  { id: "nlp_fast_phobia", label: "Fast Phobia Model (Adapted)", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Dissolve fear of success/failure pattern", tradition: "NLP" },
  { id: "eft_basic", label: "EFT Basic Recipe", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Tapping meridians for emotional release", tradition: "Gary Craig" },
  { id: "eft_manifest", label: "EFT for Manifestation Blocks", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Tap worthiness, scarcity, fear of receiving", tradition: "EFT" },
  { id: "eft_positive", label: "Positive EFT Rounds", category: "NLP & EFT", mode: "manifestation_llm", blurb: "Tap while stating desired state", tradition: "EFT evolution" },

  // Positive psychology
  { id: "psych_perma", label: "PERMA Wellbeing Audit", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Seligman model — sustainable manifestation base", tradition: "Martin Seligman" },
  { id: "psych_flow", label: "Flow State Design", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Csikszentmihalyi conditions for engagement", tradition: "Flow research" },
  { id: "psych_strengths", label: "VIA Character Strengths", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Leverage top 5 strengths toward goal", tradition: "Peterson & Seligman" },
  { id: "psych_best_self", label: "Best Possible Self Exercise", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Write ideal future life 15 min — research-backed", tradition: "Positive psych intervention" },
  { id: "psych_savoring", label: "Savoring Walk", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Mindful amplification of positive moments", tradition: "Fred Bryant" },
  { id: "psych_luck", label: "Luck Factor Principles", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Wiseman's 4 luck maximizers", tradition: "Richard Wiseman" },
  { id: "psych_cbt", label: "CBT Thought Record", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Challenge limiting beliefs blocking goals", tradition: "Aaron Beck / CBT" },
  { id: "psych_act", label: "ACT Values Alignment", category: "Positive Psychology", mode: "manifestation_llm", blurb: "Acceptance & commitment toward valued goals", tradition: "Steven Hayes / ACT" },

  // Philosophy
  { id: "phil_stoic_am", label: "Stoic Morning & Evening", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Premeditatio + evening review — Aurelius/Seneca", tradition: "Stoicism" },
  { id: "phil_james_act", label: "William James — Act As If", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Action precedes feeling — pragmatic manifesting", tradition: "William James" },
  { id: "phil_epictetus", label: "Epictetus Dichotomy of Control", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Focus effort only on what you control", tradition: "Epictetus" },
  { id: "phil_nietzsche", label: "Nietzsche Amor Fati & Will", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Love fate, build self through adversity", tradition: "Nietzsche" },
  { id: "phil_emerson", label: "Emerson Self-Reliance", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Trust inner genius — Transcendentalist path", tradition: "Ralph Waldo Emerson" },
  { id: "phil_tao", label: "Taoist Wu Wei (Non-Forcing)", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Align with Tao — effortless right action", tradition: "Lao Tzu / Zhuangzi" },
  { id: "phil_hermetic", label: "Hermetic Kybalion Principles", category: "Philosophy & Stoic Wisdom", mode: "manifestation_llm", blurb: "Mentalism, correspondence, vibration applied", tradition: "Hermetic (non-Kabbalistic)" },
];

export const MANIFESTATION_CATEGORIES = [
  "Manifestation & Law of Attraction",
  "Affirmations & Scripts",
  "Visualization & Mental Rehearsal",
  "Journaling & Writing Practices",
  "Self-Hypnosis & Trance",
  "NLP & EFT",
  "Positive Psychology",
  "Philosophy & Stoic Wisdom",
] as const;

export function isManifestationCategory(category: string): boolean {
  return (MANIFESTATION_CATEGORIES as readonly string[]).includes(category);
}
