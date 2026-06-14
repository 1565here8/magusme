import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Star, Shield, AlertTriangle, Clock, Share2, Bookmark, Sparkles, Loader2, Send, MessageSquare } from "lucide-react";
import { fetchSpellBySlug, fetchSpellReviews, submitSpellReview, type SpellDetail, type SpellReview } from "../api/spellsClient";
import { SeoHead } from "../components/SeoHead";

const RICH_SPELLS: Record<string, {
  materials: string[]; steps: string[]; variations: string[]; purpose: string;
}> = {
  "mirror-shield-charm": {
    purpose: "Creates an energetic mirror that reflects negative intentions, curses, or harmful energy back to their source.",
    materials: ["Mirror (any size)", "White candle (optional)", "Salt (optional, for circle)", "Your visualization ability"],
    steps: [
      "Find a quiet place where you won't be disturbed.",
      "Light a candle (if using one). Optionally, cast a circle with salt.",
      "Hold the mirror in front of you. Close your eyes and breathe deeply.",
      "Visualize a bright, reflective shield forming around your entire body.",
      "See the shield made of pure light — silver, white, or gold.",
      "Say 3 times: 'What is sent to me returns to source. This mirror reflects, rejects, protects me.'",
      "Seal the spell: 'So mote it be' or 'It is done.'",
      "Leave the mirror visible as a reminder of your protection.",
      "Refresh weekly during waxing moon."
    ],
    variations: [
      "Four-Mirror Shield: Use 4 mirrors facing each cardinal direction for whole-home protection.",
      "Portable Mirror Charm: Carry a small mirror in your pocket. Refresh intention each morning.",
      "Water Mirror: Use a bowl of water instead of a physical mirror. Requires stronger visualization.",
      "Bedroom Protection: Place mirror over bed or under pillow for nighttime protection."
    ],
  },
  "binding-of-the-hexer": {
    purpose: "Binds the hands of someone hexing you. Prevents them from continuing harmful magical work.",
    materials: ["Black candle", "Red string or cord", "Photo or name of the hexer (optional)", "Salt water", "Small cloth bag"],
    steps: [
      "Wait for Mars hour on a full moon night.",
      "Carve the hexer's name (or 'my enemy') into the black candle.",
      "Tie 9 knots in the red cord, visualizing each knot binding their power.",
      "Light the candle. Pass the cord through the flame (safely) 3 times.",
      "Say: 'Your hands are bound. Your words are stopped. Your power returns to you.'",
      "Place the cord in the cloth bag with salt water. Bury it away from your home.",
      "Let the candle burn out completely. Dispose of remnants."
    ],
    variations: [
      "Mirror Binding: Add a small mirror to reflect their own hexes back.",
      "Photo Binding: Use their photo wrapped in the cord.",
      "Distance Binding: Works regardless of physical distance."
    ],
  },
};

function parseRichSpell(slug: string): typeof RICH_SPELLS[string] | undefined {
  return RICH_SPELLS[slug];
}

function formatDifficulty(level: number): string {
  if (level <= 2) return "Beginner";
  if (level <= 4) return "Easy";
  if (level <= 6) return "Medium";
  if (level <= 8) return "Hard";
  return "Extreme";
}

function formatDanger(level: number): string {
  if (level === 0) return "None";
  if (level <= 2) return "Low";
  if (level <= 4) return "Moderate";
  if (level <= 6) return "High";
  return "Extreme";
}

export function SpellDetailPage() {
  const { spellId } = useParams();
  const navigate = useNavigate();
  const [spell, setSpell] = useState<SpellDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState<SpellReview[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!spellId) return;
    fetchSpellReviews(spellId.toLowerCase()).then((r) => {
      setReviews(r.reviews);
      setReviewTotal(r.total);
    }).catch(() => null);
  }, [spellId]);

  useEffect(() => {
    if (!spellId) return;
    const controller = new AbortController();
    fetchSpellBySlug(spellId.toLowerCase(), controller.signal)
      .then(setSpell)
      .catch(() => null)
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [spellId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!spell) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
        <div className="mb-4 text-6xl">🔮</div>
        <h1 className="mb-4 font-serif text-2xl font-bold text-white">Spell Not Found</h1>
        <p className="mb-8 text-zinc-400">This spell hasn't been loaded into the grimoire yet.</p>
        <Link to="/learn" className="rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white">
          Browse the Grimoire
        </Link>
      </div>
    );
  }

  const hardcodedRich = spellId ? parseRichSpell(spellId.toLowerCase()) : undefined;
  const rich = (() => {
    if (hardcodedRich) return hardcodedRich;
    if (spell?.full_text) {
      try { return JSON.parse(spell.full_text) as { purpose: string; materials: string[]; steps: string[]; variations: string[] }; } catch { return null; }
    }
    return null;
  })();
  const tags: string[] = spell.tags ?? [];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8">
        {spell && <SeoHead title={spell.title} description={spell.summary ?? "View spell details from the grimoire."} path={`/learn/${spellId}`} />}
        <Link to="/learn" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Grimoire
        </Link>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                {spell.category}
              </span>
              <span className="text-xs text-zinc-500">{spell.tradition}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">{spell.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" /> {spell.rating}
              </span>
              <span className="text-zinc-500">({spell.review_count} reviews)</span>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="hidden flex-wrap gap-1.5 md:flex">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-zinc-400">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 md:grid-cols-4">
          {[
            { label: "Difficulty", value: spell.difficulty ? `${spell.difficulty} (${spell.difficulty_level}/10)` : `${formatDifficulty(spell.difficulty_level)} (${spell.difficulty_level}/10)` },
            { label: "Danger Level", value: spell.danger ? `${spell.danger} (${spell.danger_level}/10)` : `${formatDanger(spell.danger_level)} (${spell.danger_level}/10)`, warn: spell.danger_level >= 5 },
            { label: "Elements", value: spell.element ?? "—" },
            { label: "Timing", value: spell.timing ?? "Any" },
            { label: "Source", value: spell.source ?? "Traditional", wide: true },
            { label: "Counter-Spell", value: spell.counter_spell ?? "—" },
          ].map((item) => (
            <div key={item.label} className={item.wide ? "col-span-2" : ""}>
              <div className="text-xs text-zinc-500">{item.label}</div>
              <div className={`mt-1 text-sm ${item.warn ? "font-medium text-amber-400" : "text-zinc-300"}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {spell.warning && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-300">Warning</p>
              <p className="mt-1 text-xs text-amber-400/80">{spell.warning}</p>
            </div>
          </div>
        )}

        {rich ? (
          <>
            <section className="mb-8">
              <h2 className="mb-3 font-serif text-xl font-bold text-white">Purpose</h2>
              <p className="text-sm leading-relaxed text-zinc-400">{rich.purpose}</p>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 font-serif text-xl font-bold text-white">Materials Needed</h2>
              <ul className="space-y-2">
                {rich.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-3 font-serif text-xl font-bold text-white">Step-by-Step Instructions</h2>
              <div className="space-y-4">
                {rich.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-sm font-bold text-purple-300">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-zinc-300">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {rich.variations.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-3 font-serif text-xl font-bold text-white">Variations</h2>
                <div className="space-y-3">
                  {rich.variations.map((v, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mb-1 text-xs font-medium text-purple-300">Variation {i + 1}</div>
                      <p className="text-sm text-zinc-400">{v}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-5">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">Karmic & Safety Assessment</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                This spell is rated {formatDanger(spell.danger_level)} ({spell.danger_level}/10).
                Ethical magic. Many traditions teach "what you send returns threefold."
              </p>
            </section>
          </>
        ) : spell.full_text && !spell.full_text.startsWith("{") ? (
          <section className="mb-8">
            <h2 className="mb-3 font-serif text-xl font-bold text-white">Instructions</h2>
            <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {spell.full_text}
            </div>
          </section>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="mb-3 font-serif text-xl font-bold text-white">Overview</h2>
              <p className="text-sm leading-relaxed text-zinc-400">{spell.summary ?? "No description available."}</p>
            </section>

            <section className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h2 className="mb-3 font-serif text-lg font-bold text-white">Spell Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-zinc-500">Difficulty</div>
                  <div className="text-sm text-zinc-300">{spell.difficulty ?? formatDifficulty(spell.difficulty_level)}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Danger Level</div>
                  <div className="text-sm text-zinc-300">{spell.danger ?? formatDanger(spell.danger_level)}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Element</div>
                  <div className="text-sm text-zinc-300">{spell.element ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Timing</div>
                  <div className="text-sm text-zinc-300">{spell.timing ?? "Any"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Source</div>
                  <div className="text-sm text-zinc-300">{spell.source ?? "Traditional"}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Counter-Spell</div>
                  <div className="text-sm text-zinc-300">{spell.counter_spell ?? "—"}</div>
                </div>
              </div>
            </section>

            {spell.tags && spell.tags.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-3 font-serif text-lg font-bold text-white">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {spell.tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-5">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">Karmic & Safety Assessment</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                This spell is rated {formatDanger(spell.danger_level)} ({spell.danger_level}/10).
                Ethical magic. Many traditions teach "what you send returns threefold."
              </p>
            </section>
          </>
        )}

        <section className="mb-8 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-5">
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Source Verified</span>
          </div>
          <p className="text-xs text-zinc-400">
            {spell.source ?? "Traditional"} — Community verified by {spell.review_count}+ practitioners.
          </p>
        </section>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/learn" className="rounded-full border border-white/10 px-8 py-3 text-sm text-zinc-400 transition hover:border-white/20">
            Browse More Spells
          </Link>
          <button
            onClick={() => navigate("/reading")}
            className="rounded-full bg-purple-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-purple-500"
          >
            <Sparkles className="mr-2 inline h-4 w-4" />
            Consult the Oracle
          </button>
        </div>

        {/* Reviews section */}
        <section className="mt-12 border-t border-white/10 pt-8">
          <h2 className="mb-6 font-serif text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            Reviews ({reviewTotal})
          </h2>

          {/* Review form */}
          <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-medium text-zinc-300">Leave a Review</h3>
            <div className="mb-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star className={`h-5 w-5 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`} />
                </button>
              ))}
              {reviewRating > 0 && <span className="ml-2 text-xs text-zinc-500">{reviewRating}/5</span>}
            </div>
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Share your experience with this spell..."
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-purple-500/40"
            />
            {reviewError && <p className="mt-1 text-xs text-red-400">{reviewError}</p>}
            <button
              onClick={async () => {
                if (!spellId) return;
                setReviewError("");
                if (reviewRating === 0) { setReviewError("Please select a rating."); return; }
                if (reviewBody.trim().length < 10) { setReviewError("Review must be at least 10 characters."); return; }
                setSubmittingReview(true);
                try {
                  const review = await submitSpellReview(spellId.toLowerCase(), reviewRating, reviewBody.trim());
                  setReviews((prev) => [review, ...prev]);
                  setReviewTotal((n) => n + 1);
                  setReviewRating(0);
                  setReviewBody("");
                } catch (err) {
                  setReviewError(err instanceof Error ? err.message : "Failed to submit review.");
                } finally {
                  setSubmittingReview(false);
                }
              }}
              disabled={submittingReview}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          {/* Review list */}
          {reviews.length === 0 ? (
            <p className="text-sm text-zinc-500">No reviews yet. Be the first to share your experience.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-white/5 bg-white/[0.01] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{review.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
