import { useState, useCallback, useEffect } from "react";
import { Sparkles, Shuffle, ChevronDown, ChevronUp, BookOpen, Loader2, AlertTriangle, Star } from "lucide-react";
import { fetchRandomSpell, fetchSpellCategories, type SpellListItem, type SpellCategory } from "../../api/spellsClient";

const ELEMENTS = ["All", "Fire", "Water", "Air", "Earth", "Spirit"] as const;

function elementIcon(el: string) {
  switch (el) {
    case "Fire": return "🔥";
    case "Water": return "💧";
    case "Air": return "🌬️";
    case "Earth": return "🪨";
    case "Spirit": return "✨";
    default: return "🔮";
  }
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

const DANGER_COLORS: Record<string, string> = {
  None: "text-zinc-500",
  Moderate: "text-amber-400",
  High: "text-red-400",
};

export function SpellBox() {
  const [spell, setSpell] = useState<SpellListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<SpellCategory[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchSpellCategories().then(setCategories).catch(() => null);
  }, []);

  const drawSpell = useCallback(async () => {
    setLoading(true);
    setDrawing(true);
    setError(null);
    setExpanded(false);

    await new Promise((r) => setTimeout(r, 600));

    try {
      const result = await fetchRandomSpell({
        element: selectedElement === "All" ? undefined : selectedElement,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });
      setSpell(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to draw spell.");
      setSpell(null);
    } finally {
      setLoading(false);
      setTimeout(() => setDrawing(false), 300);
    }
  }, [selectedElement, selectedCategory]);

  const ratingStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <span className="text-amber-400">
        {"★".repeat(full)}{"☆".repeat(5 - full)}
        <span className="ml-1 text-xs text-zinc-500">{rating.toFixed(1)}</span>
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/5">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/15 p-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Spell Box</h3>
            <p className="text-xs text-zinc-500">Random spell puller — filtered by element, intent, and planetary timing</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {ELEMENTS.map((el) => (
            <button
              key={el}
              onClick={() => setSelectedElement(el)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedElement === el
                  ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40"
                  : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-300"
              }`}
            >
              {el !== "All" && <span>{elementIcon(el)}</span>}
              {el}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedCategory === "all"
                ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40"
                : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-300"
            }`}
          >
            All Intentions
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat.slug
                  ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40"
                  : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Draw Button */}
      <div className="px-6 py-5">
        <button
          onClick={drawSpell}
          disabled={loading}
          className={`group relative w-full overflow-hidden rounded-xl py-4 text-center text-sm font-bold text-white transition ${
            loading
              ? "bg-purple-500/30 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-[0.98]"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent ${drawing ? "animate-shimmer" : ""}`} />
          <span className="relative inline-flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Drawing...
              </>
            ) : (
              <>
                <Shuffle className="h-4 w-4 transition-transform group-hover:rotate-180" />
                Draw a Spell
              </>
            )}
          </span>
        </button>
      </div>

      {/* Result */}
      <div className="px-6 pb-6">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {spell && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            {/* Title & Meta */}
            <div className="mb-4">
              <h4 className="mb-1 font-serif text-xl font-bold text-white">{spell.title}</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {spell.tradition && (
                  <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-zinc-400">{spell.tradition}</span>
                )}
                <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-zinc-400">{spell.category}</span>
                {spell.source && (
                  <span className="text-zinc-600">from {spell.source}</span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <div className="mb-1 text-xs text-zinc-500">Difficulty</div>
                <div className={`text-sm font-medium ${DIFFICULTY_COLORS[spell.difficulty] ?? "text-zinc-300"}`}>
                  {spell.difficulty}
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <div className="mb-1 text-xs text-zinc-500">Danger</div>
                <div className={`text-sm font-medium ${DANGER_COLORS[spell.danger] ?? "text-zinc-300"}`}>
                  {spell.danger === "None" ? "Safe" : spell.danger}
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <div className="mb-1 text-xs text-zinc-500">Element</div>
                <div className="text-sm font-medium text-zinc-300">
                  {spell.element ? `${elementIcon(spell.element)} ${spell.element}` : "—"}
                </div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <div className="mb-1 text-xs text-zinc-500">Rating</div>
                <div className="text-sm">{ratingStars(spell.rating)}</div>
              </div>
            </div>

            {/* Timing */}
            {spell.timing && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-500/5 px-3 py-2">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-zinc-400">Best timing: <span className="text-zinc-300">{spell.timing}</span></span>
              </div>
            )}

            {/* Warning */}
            {spell.warning && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-500/5 px-3 py-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                <span className="text-xs text-red-300">{spell.warning}</span>
              </div>
            )}

            {/* Tags */}
            {spell.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {spell.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            {spell.summary && (
              <p className="mb-4 text-sm leading-relaxed text-zinc-300">{spell.summary}</p>
            )}

            {/* Expand for more */}
            {spell.counter_spell && (
              <div className="border-t border-white/5 pt-3">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {expanded ? "Hide details" : "Show details"}
                </button>
                {expanded && (
                  <div className="mt-3 space-y-2 text-xs text-zinc-400">
                    {spell.counter_spell && (
                      <div>
                        <span className="text-zinc-500">Counter: </span>
                        {spell.counter_spell}
                      </div>
                    )}
                    {spell.review_count > 0 && (
                      <div>
                        <span className="text-zinc-500">Reviews: </span>
                        {spell.review_count} castings
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recommendation */}
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/5 px-3 py-2.5">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
              <div className="text-xs text-purple-300">
                {spell.danger === "None" && spell.difficulty === "Easy"
                  ? "Great beginner-friendly spell. Safe to try today."
                  : spell.danger === "Moderate"
                    ? "This spell requires caution. Ensure you have protection before casting."
                    : spell.difficulty === "Medium"
                      ? "Intermediate spell — recommended for those with some practice."
                      : "Review the full instructions and have all materials ready before starting."}
              </div>
            </div>
          </div>
        )}

        {!spell && !error && !loading && (
          <div className="rounded-xl border border-dashed border-white/5 py-12 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-500">Select your filters and draw a spell</p>
          </div>
        )}
      </div>
    </div>
  );
}
