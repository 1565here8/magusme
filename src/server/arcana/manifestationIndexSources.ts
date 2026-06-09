import type { IndexSource } from "./indexSourceTypes";

function ia(
  id: string,
  name: string,
  query: string,
  traditions: string[],
  priority = 3,
  institution = "Internet Archive",
): IndexSource {
  return { id, name, url: "https://archive.org/search", institution, archiveQuery: query, priority, traditions };
}

/** Index lanes for manifestation, psychology, philosophy & mind-tech corpora. */
export const MANIFESTATION_INDEX_SOURCES: IndexSource[] = [
  ia("ia_manifest_newthought", "New Thought & Manifestation Classics", "Napoleon Hill OR \"Wallace Wattles\" OR \"Science of Getting Rich\" OR Coué OR autosuggestion", ["New Thought", "Manifestation", "Autosuggestion"], 2),
  ia("ia_manifest_neville", "Neville Goddard & Law of Assumption", "Neville Goddard OR \"law of assumption\" OR \"feeling is the secret\"", ["Neville Goddard", "Law of Assumption"], 2),
  ia("ia_manifest_visualization", "Creative Visualization & Mental Imagery", "\"creative visualization\" OR \"mental imagery\" OR Shakti Gawain OR \"guided imagery\"", ["Visualization", "Creative visualization"], 2),
  ia("ia_manifest_hypnosis", "Self-Hypnosis & Hypnotherapy", "self-hypnosis OR hypnotherapy OR \"Dave Elman\" OR \"Milton Erickson\" OR autogenic", ["Self-hypnosis", "Hypnotherapy"], 2),
  ia("ia_manifest_nlp", "NLP & Neuro-Linguistic Programming", "NLP OR \"Neuro Linguistic Programming\" OR Bandler OR Grinder OR \"six step reframe\"", ["NLP", "Reframing"], 2),
  ia("ia_manifest_eft", "EFT & Energy Psychology", "EFT OR \"emotional freedom technique\" OR tapping OR \"energy psychology\"", ["EFT", "Tapping", "Energy psychology"], 2),
  ia("ia_manifest_positive_psych", "Positive Psychology", "\"positive psychology\" OR Seligman OR PERMA OR \"character strengths\" OR Csikszentmihalyi flow", ["Positive psychology", "PERMA", "Flow"], 2),
  ia("ia_manifest_cbt", "CBT & Cognitive Therapy", "CBT OR \"cognitive behavioral\" OR \"Aaron Beck\" OR \"Feeling Good\" Burns", ["CBT", "Cognitive therapy"], 3),
  ia("ia_manifest_stoic", "Stoic Philosophy (Public Domain)", "Marcus Aurelius OR Seneca OR Epictetus OR Stoicism meditations", ["Stoicism", "Philosophy"], 2),
  ia("ia_manifest_james_emerson", "Pragmatist & Transcendentalist Philosophy", "William James OR Emerson OR \"Self-Reliance\" OR \"Varieties of Religious Experience\"", ["William James", "Emerson", "Philosophy"], 3),
  ia("ia_manifest_journaling", "Journaling & Expressive Writing", "\"morning pages\" OR \"Artist's Way\" OR journaling OR \"expressive writing\" OR bullet journal", ["Journaling", "Morning pages"], 3),
  ia("ia_manifest_meditation_mind", "Meditation for Mind Training", "meditation manifest OR mindfulness goal OR vipassana OR \"transcendental meditation\" public", ["Meditation", "Mindfulness"], 3),
  ia("ia_manifest_affirmations", "Affirmations & Autosuggestion Corpus", "affirmation OR autosuggestion OR \"positive thinking\" OR \"power of positive thinking\"", ["Affirmations", "Autosuggestion"], 3),
  ia("ia_manifest_lao_tao", "Taoist & Eastern Philosophy", "Lao Tzu OR Tao Te Ching OR Zhuangzi OR wu wei OR Taoism", ["Taoism", "Eastern philosophy"], 3),
];
