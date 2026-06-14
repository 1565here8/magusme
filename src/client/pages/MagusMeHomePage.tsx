import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Sparkles, BookOpen, Star, Clock, Wand2, Brain, Shield, Moon, Sun, Feather, Eye, Heart, Users, CheckCircle2, ScrollText, Compass } from "lucide-react";
import { SeoHead } from "../components/SeoHead";

const TRUST_ITEMS = [
  { icon: CheckCircle2, text: "63 Verified Spells from Primary Sources" },
  { icon: ScrollText, text: "16 Divination Systems — Tarot, Runes, Astrology & More" },
  { icon: Shield, text: "No Censorship — All Traditions, White to Black" },
  { icon: Sparkles, text: "AI That Believes in Magic, Not a Skeptical Chatbot" },
];

const PATHWAYS = [
  {
    to: "/consult",
    icon: Compass,
    title: "Consult the Oracle",
    desc: "Ask anything. Choose from 16 divination systems — Tarot, Runes, Astrology, I Ching, Pendulum, Scrying & more. Get answers the AI that believes in magic.",
    color: "from-violet-600/20 to-fuchsia-600/10",
    border: "border-violet-500/20 hover:border-violet-500/50",
    cta: "Start Your Reading",
    features: ["Tarot (12+ decks)", "Rune Casting", "Natal Charts", "Numerology", "I Ching", "+ 11 more"],
  },
  {
    to: "/learn",
    icon: BookOpen,
    title: "Browse the Grimoire",
    desc: "Browse 63 verified spells with sources, counter-spells, danger levels, and planetary timing. Every tradition. Every technique. No gatekeeping.",
    color: "from-emerald-600/20 to-teal-600/10",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    cta: "Search Spells",
    features: ["Love & Binding", "Protection & Wards", "Money & Prosperity", "Healing & Curses", "Counter-spells", "Source Citations"],
  },
  {
    to: "/create",
    icon: Wand2,
    title: "Practice Manifestation",
    desc: "Visualization, affirmations, sigil magic, NLP, quantum jumping, chakra work, energy healing — 40+ techniques with step-by-step guides.",
    color: "from-amber-600/20 to-orange-600/10",
    border: "border-amber-500/20 hover:border-amber-500/50",
    cta: "Begin Creating",
    features: ["Sigil Magic", "Affirmations", "NLP Techniques", "Energy Work", "Chakra Balancing", "40+ Methods"],
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

const FEATURED_SPELLS = [
  { name: "Mirror Shield Charm", tradition: "Wiccan", rating: "4.9", difficulty: "Easy", to: "/learn/mirror-shield-charm" },
  { name: "369 Manifestation", tradition: "Modern", rating: "4.8", difficulty: "Easy", to: "/learn/369-manifestation-method" },
  { name: "Binding of the Hexer", tradition: "Hoodoo", rating: "4.7", difficulty: "Moderate", to: "/learn/binding-of-the-hexer" },
];

export function MagusMeHomePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen">
      <SeoHead
        title="MagusMe — The Vault of Everything Occult"
        description="The world's largest open occult library. 63+ verified spells, 81 divination systems, AI-powered tarot/runes/astrology readings. No censorship, all traditions welcome."
        path="/"
      />
      {/* HERO — vault messaging */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-600/3 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 text-center md:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
            <Sparkles className="h-3 w-3" />
            The Occult Search Engine Has Arrived
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            The Vault of
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              All Occult
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 md:text-lg">
            Everything known about changing your fate — in one place.
            <br />
            Natal Charts · Tarot · Runes · Spells · Manifestation · Kabbalah · All Traditions
          </p>

          {/* SEARCH — primary action */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ask a question or search anything..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-4 text-base text-white placeholder-zinc-600 outline-none transition focus:border-violet-500/40 focus:bg-white/[0.06]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      window.location.href = `/learn?q=${encodeURIComponent(search.trim())}`;
                    }
                  }}
                />
              </div>
              <button
                onClick={() => {
                  if (search.trim()) {
                    window.location.href = `/learn?q=${encodeURIComponent(search.trim())}`;
                  }
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
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

          {/* CTA buttons above the fold */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/consult"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              <Compass className="h-4 w-4" />
              Start Your First Reading
            </Link>
            <Link
              to="/reading"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-violet-500/50 hover:text-white"
            >
              <Brain className="h-4 w-4" />
              Analyze My Situation
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BADGES — prominent */}
      <section className="border-b border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                <span className="text-xs leading-relaxed text-zinc-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 PATHWAYS — choose your path */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">Choose Your Path</h2>
            <p className="mt-2 text-sm text-zinc-500">Three ways into the vault — pick what calls you</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PATHWAYS.map((p) => (
              <div
                key={p.to}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${p.color} ${p.border} p-6 transition-all duration-300`}
              >
                <div className="mb-4 inline-flex rounded-xl bg-white/[0.06] p-3">
                  <p.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="h-1 w-1 rounded-full bg-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.to}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  {p.cta}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECONDARY FEATURES — Daily Tools */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/tools"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-600/10 to-blue-600/5 p-6 transition-all hover:border-sky-500/30"
            >
              <div className="mb-3 inline-flex rounded-xl bg-white/[0.06] p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Daily Tools</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Live planetary hours, moon phases, void-of-course moon, optimal magic timing, daily rituals — know when to act.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5">Live data</span>
                <span className="text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">View Dashboard →</span>
              </div>
            </Link>

            <Link
              to="/reading"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-600/10 to-rose-600/5 p-6 transition-all hover:border-fuchsia-500/30"
            >
              <div className="mb-3 inline-flex rounded-xl bg-white/[0.06] p-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Situation Analysis</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Describe what's happening. Get a full cross-system analysis: Tarot, Runes, Astrology, Numerology, Grimoire — with spells and psychological techniques.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-violet-300">⭐ New — AI powered</span>
                <span className="text-fuchsia-400 opacity-0 transition-opacity group-hover:opacity-100">Try it →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS — browse by topic */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-white">Browse by Topic</h2>
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

      {/* FEATURED SPELLS */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="mb-6">
            <h2 className="font-serif text-lg font-bold text-white">Featured This Week</h2>
            <p className="mt-1 text-xs text-zinc-500">Popular spells and practices chosen by the community</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURED_SPELLS.map((spell) => (
              <Link
                key={spell.name}
                to={spell.to}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-violet-500/30"
              >
                <h3 className="font-serif font-bold text-white group-hover:text-violet-300">{spell.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-xs text-zinc-500">{spell.tradition}</span>
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="h-3 w-3 fill-current" /> {spell.rating}
                  </span>
                  <span className="text-xs text-zinc-600">Difficulty: {spell.difficulty}</span>
                </div>
                <div className="mt-3 text-xs text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">Learn More →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center md:px-8">
          <div className="mx-auto max-w-lg">
            <div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-3">
              <Users className="h-6 w-6 text-violet-400" />
            </div>
            <h2 className="font-serif text-xl font-bold text-white">Built by Practitioners, For Practitioners</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Every spell sourced, every tradition respected, every path honored — from white to black, from Wiccan to Hoodoo to Chaos.
              No censorship. No gatekeeping. Just the knowledge.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-zinc-600">
              <span>🔮 63 Spells</span>
              <span>🎴 16 Divination Systems</span>
              <span>📜 40+ Manifestation Techniques</span>
              <span>🌙 Planetary Timing</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST FOOTER */}
      <section className="mx-auto max-w-6xl px-5 py-8 text-center md:px-8">
        <p className="text-xs text-zinc-600">
          ✓ Verified sources from Goetia, Key of Solomon, Eddas, Atharva Veda & more&nbsp;&nbsp;·&nbsp;&nbsp;
          ✓ No censorship — all traditions equally shown&nbsp;&nbsp;·&nbsp;&nbsp;
          ✓ AI assistant, not skeptical chatbot&nbsp;&nbsp;·&nbsp;&nbsp;
          ✓ Counter-spell linked: every curse comes with removal
        </p>
      </section>
    </div>
  );
}
