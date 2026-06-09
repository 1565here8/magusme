import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Sparkles, BookOpen, Star, Clock, Wand2, Brain, Shield, Moon, Sun, Feather, Eye, Heart } from "lucide-react";

const FEATURES = [
  {
    to: "/reading",
    icon: Sparkles,
    title: "🔮 Analyze My Situation",
    desc: "Describe what's happening. I'll use Tarot, Runes, Astrology, Numerology, and the Grimoire to map the pattern — then recommend spells + psychological techniques. You choose the approach.",
    color: "from-violet-600/20 to-fuchsia-600/10",
    border: "hover:border-violet-500/50",
    badge: "⭐ New — AI-powered",
    popular: true,
    big: true,
  },
  {
    to: "/consult",
    icon: Sparkles,
    title: "Tarot & Divination",
    desc: "16 systems — Tarot, Runes, Astrology, I Ching, Numerology, Pendulum, Scrying & more",
    color: "from-violet-500/10 to-purple-500/5",
    border: "hover:border-violet-500/30",
    badge: "12+ decks",
  },
  {
    to: "/learn",
    icon: BookOpen,
    title: "Spells & Grimoire",
    desc: "Love, money, protection, healing, destruction, manifestation — 1,000+ spells with sources",
    color: "from-emerald-500/10 to-teal-500/5",
    border: "hover:border-emerald-500/30",
    badge: "1,000+ spells",
  },
  {
    to: "/create",
    icon: Brain,
    title: "Manifestation & NLP",
    desc: "Visualization, affirmations, scripting, NLP, sigil magic, quantum jumping, energy work",
    color: "from-amber-500/10 to-orange-500/5",
    border: "hover:border-amber-500/30",
    badge: "40+ techniques",
  },
  {
    to: "/tools",
    icon: Clock,
    title: "Planetary Hours & Tools",
    desc: "Live planetary hours, moon phases, daily magic timing, reference libraries, journals",
    color: "from-sky-500/10 to-blue-500/5",
    border: "hover:border-sky-500/30",
    badge: "Live data",
  },
];

const QUICK_LINKS = [
  { to: "/learn", label: "Love Spells", icon: Heart },
  { to: "/learn", label: "Protection", icon: Shield },
  { to: "/learn", label: "Money Magic", icon: Star },
  { to: "/learn", label: "Evil Eye", icon: Eye },
  { to: "/consult", label: "Natal Chart", icon: Moon },
  { to: "/create", label: "Affirmations", icon: Sun },
  { to: "/create", label: "Sigil Magic", icon: Wand2 },
  { to: "/learn", label: "Cleansing Rituals", icon: Feather },
];

export function MagusMeHomePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen">
      {/* HERO — minimal, one clear message */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 text-center md:pt-24">
          <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
            The Library of
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              Everything Occult
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-zinc-400">
            Tarot · Runes · Astrology · Spells · Manifestation · NLP · Grimoires · All Traditions · No Censorship
          </p>

          {/* BIG SEARCH — primary action */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you want to find? A spell, a divination, a teaching..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-base text-white placeholder-zinc-600 outline-none transition focus:border-violet-500/40 focus:bg-white/[0.06]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    window.location.href = `/learn?q=${encodeURIComponent(search.trim())}`;
                  }
                }}
              />
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-zinc-600">
              <span>Popular:</span>
              {["protection spell", "love tarot", "natal chart", "369 method"].map((q) => (
                <button
                  key={q}
                  onClick={() => window.location.href = `/learn?q=${encodeURIComponent(q)}`}
                  className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES GRID — what you can actually DO */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURES.map((f) => {
              const isBig = "big" in f && f.big;
              return (
              <Link
                key={f.to}
                to={f.to}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${f.color} p-6 transition-all ${f.border} ${isBig ? "md:col-span-2 md:row-span-1" : ""}`}
              >
                {f.popular && (
                  <span className="absolute right-3 top-3 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-medium text-violet-300">
                    {isBig ? "New — Try it" : "Most used"}
                  </span>
                )}
                <div className="mb-3 inline-flex rounded-xl bg-white/[0.06] p-3">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h2 className={`font-bold text-white ${isBig ? "font-serif text-xl" : "font-serif text-lg"}`}>{f.title}</h2>
                <p className={`mt-1 leading-relaxed text-zinc-400 ${isBig ? "text-base" : "text-sm"}`}>{f.desc}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-white/[0.04] px-3 py-0.5 text-xs text-zinc-500">{f.badge}</span>
                  <span className={`text-xs opacity-0 transition-opacity group-hover:opacity-100 ${isBig ? "text-fuchsia-400" : "text-violet-400"}`}>
                    Go →
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK LINKS — see everything at a glance */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-white">Browse by topic</h2>
            <Link to="/learn" className="text-xs text-violet-400 hover:text-violet-300">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-300 transition hover:border-violet-500/30 hover:bg-white/[0.04]"
              >
                <link.icon className="h-4 w-4 text-violet-400" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST — one line */}
      <section className="mx-auto max-w-6xl px-5 py-8 text-center md:px-8">
        <p className="text-xs text-zinc-600">
          ✓ 1,000+ verified spells from primary sources&nbsp;&nbsp;·&nbsp;&nbsp;
          ✓ No censorship — all traditions equally shown&nbsp;&nbsp;·&nbsp;&nbsp;
          ✓ AI that believes in magic&nbsp;&nbsp;·&nbsp;&nbsp;
          ✓ Free, local, private (Ollama)
        </p>
      </section>
    </div>
  );
}
