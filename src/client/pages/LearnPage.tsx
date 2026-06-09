import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Star, Shield, AlertTriangle, Filter, ChevronDown, BookMarked } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Categories", count: 1347 },
  { id: "protection", label: "Protection", count: 142 },
  { id: "love", label: "Love & Attraction", count: 198 },
  { id: "money", label: "Money & Prosperity", count: 87 },
  { id: "healing", label: "Healing", count: 124 },
  { id: "destruction", label: "Destruction", count: 56 },
  { id: "power", label: "Power & Dominion", count: 93 },
  { id: "knowledge", label: "Knowledge & Wisdom", count: 78 },
  { id: "manifestation", label: "Manifestation", count: 156 },
  { id: "cleansing", label: "Cleansing", count: 67 },
  { id: "evil-eye", label: "Evil Eye", count: 43 },
  { id: "sex", label: "Sex Magic", count: 62 },
  { id: "summoning", label: "Summoning", count: 34 },
  { id: "transformation", label: "Transformation", count: 45 },
  { id: "self-mastery", label: "Self-Mastery", count: 112 },
  { id: "letting-go", label: "Letting Go", count: 38 },
  { id: "revenge", label: "Revenge", count: 22 },
];

const TRADITIONS = ["Wiccan", "Hoodoo", "Ceremonial", "Chaos", "Tantra", "Kabbalah", "Taoist", "Buddhist", "Norse", "Egyptian", "Greek", "Mediterranean", "African", "Celtic"];

const SAMPLE_SPELLS = [
  {
    title: "Mirror Shield Charm",
    tradition: "Wiccan",
    category: "Protection",
    rating: 4.8,
    reviews: 142,
    difficulty: "Easy",
    danger: "None",
    source: "Cunningham's Encyclopedia of Magical Herbs (Verified)",
    element: "Air, Spirit",
    timing: "Mercury hour, Waxing moon",
    counter: "Reflect Release",
    tags: ["Beginner-friendly", "No materials", "Fast results"],
  },
  {
    title: "Binding of the Hexer",
    tradition: "Hoodoo",
    category: "Protection",
    rating: 4.2,
    reviews: 89,
    difficulty: "Medium",
    danger: "Moderate",
    source: "Hyatt Collection (Verified)",
    element: "Fire",
    timing: "Mars hour, Full moon",
    counter: "Unbinding Ritual",
    tags: ["Requires focus", "8% blowback risk"],
    warning: "Only cast if truly hexed, not for revenge.",
  },
  {
    title: "Love Drawing Ritual",
    tradition: "Hoodoo",
    category: "Love",
    rating: 4.9,
    reviews: 203,
    difficulty: "Easy",
    danger: "None",
    source: "Traditional (Community Verified)",
    element: "Water, Earth",
    timing: "Venus hour, Waxing moon",
    counter: "Cord Cutting",
    tags: ["Popular", "Fast results", "Beginner-friendly"],
  },
  {
    title: "Psychic Shield",
    tradition: "Ceremonial",
    category: "Protection",
    rating: 4.3,
    reviews: 156,
    difficulty: "Medium",
    danger: "None",
    source: "Modern Practice (Community Verified)",
    element: "Spirit",
    timing: "Saturn hour",
    counter: "Shield Removal",
    tags: ["Ongoing", "Aura-based", "Effective"],
  },
  {
    title: "Evil Eye Reversal",
    tradition: "Mediterranean",
    category: "Evil Eye",
    rating: 4.9,
    reviews: 203,
    difficulty: "Easy",
    danger: "None",
    source: "Turkish/Greek/Italian Traditions (Verified)",
    element: "Fire, Spirit",
    timing: "Anytime",
    counter: "N/A (purely protective)",
    tags: ["Ancient", "Universal", "Instant"],
  },
  {
    title: "369 Manifestation Method",
    tradition: "Modern",
    category: "Manifestation",
    rating: 4.8,
    reviews: 312,
    difficulty: "Easy",
    danger: "None",
    source: "Neville Goddard / Tesla (Community Verified)",
    element: "All",
    timing: "Any",
    counter: "N/A",
    tags: ["Popular", "Trending", "No materials"],
  },
];

export function LearnPage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTradition, setSelectedTradition] = useState("All");
  const [sortBy, setSortBy] = useState("Relevance");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-teal-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
            <BookOpen className="h-3.5 w-3.5" />
            1,347 Verified Spells · All Traditions · No Censorship
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Learn — The Complete Occult Library
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Every spell, every tradition, every source. Full text. Full transparency. No gatekeeping.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spells, traditions, sources..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-emerald-500/40 focus:bg-white/[0.05]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-3.5 w-3.5 transition ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.slice(0, 8).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          selectedCategory === cat.id
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">Tradition</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedTradition("All")}
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        selectedTradition === "All" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      All
                    </button>
                    {TRADITIONS.slice(0, 7).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTradition(t)}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          selectedTradition === t
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 outline-none"
                  >
                    <option>Relevance</option>
                    <option>Popularity</option>
                    <option>Highest Rated</option>
                    <option>Difficulty (Easy first)</option>
                    <option>Danger Level</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {selectedCategory !== "all" && (
            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
              <span>Filtered by:</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-emerald-300">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                <button onClick={() => setSelectedCategory("all")} className="ml-2 text-zinc-600 hover:text-zinc-400">×</button>
              </span>
            </div>
          )}

          <div className="mb-3 text-sm text-zinc-500">
            Showing {SAMPLE_SPELLS.length} of 1,347 results
          </div>

          <div className="space-y-4">
            {SAMPLE_SPELLS.map((spell) => (
              <Link
                key={spell.title}
                to={`/learn/${spell.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                        {spell.category}
                      </span>
                      <span className="text-xs text-zinc-500">{spell.tradition}</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {spell.rating}
                        <span className="text-zinc-600">({spell.reviews})</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white">{spell.title}</h3>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span>🔥 Difficulty: {spell.difficulty}</span>
                      {spell.danger === "None" ? (
                        <span className="text-emerald-500">✓ Safe</span>
                      ) : (
                        <span className="text-amber-500">⚠️ Danger: {spell.danger}</span>
                      )}
                      <span>✧ {spell.element}</span>
                      <span>🪐 {spell.timing}</span>
                    </div>

                    <div className="mt-2 text-xs text-zinc-600">
                      📚 {spell.source}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {spell.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-600">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {spell.warning && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-500/5 px-3 py-2">
                        <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500" />
                        <span className="text-xs text-amber-400/80">{spell.warning}</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-2">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                      ↔️ {spell.counter}
                    </span>
                    <span className="text-xs text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                      View Full Spell →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 text-sm text-zinc-400 transition hover:border-white/20 hover:text-zinc-200">
              Load More Results
            </button>
          </div>
        </div>
      </section>

      {/* Category Browser */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h2 className="mb-6 font-serif text-xl font-bold text-white">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center transition hover:border-emerald-500/30 hover:bg-white/[0.04]"
            >
              <div className="text-lg font-medium text-white group-hover:text-emerald-300">{cat.label}</div>
              <div className="mt-1 text-xs text-zinc-500">{cat.count} spells</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
