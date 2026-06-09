import { Link } from "react-router-dom";
import {
  Sparkles, Moon, Apple, Bird, Book, BookOpen, Calculator,
  Camera, Dice4, Droplets, Eye, Globe, Mountain, Music, Scroll,
  Shuffle, Stars, Sun,
} from "lucide-react";

const DIVINATION_SYSTEMS = [
  {
    id: "tarot",
    name: "Tarot",
    icon: Sparkles,
    subtitle: "12+ decks · 7 spreads",
    description: "Rider-Waite, Thoth, Marseille, Shadow, Vampire, Gothic, Norse, Egyptian, Lenormand, Kipper, more",
    traditions: ["Western", "Egyptian", "Norse", "Dark"],
    comingSoon: false,
  },
  {
    id: "runes",
    name: "Runes",
    icon: Scroll,
    subtitle: "3 traditions",
    description: "Elder Futhark, Anglo-Saxon, Younger Futhark. Single rune, 3-rune, and 9-rune spreads.",
    traditions: ["Norse", "Germanic"],
    comingSoon: false,
  },
  {
    id: "astrology",
    name: "Astrology",
    icon: Stars,
    subtitle: "Natal · Transits · Synastry",
    description: "Western, Vedic, Chinese BaZi, Celtic tree signs, Norse runes-by-birth. Full chart interpretations.",
    traditions: ["Western", "Vedic", "Chinese", "Celtic", "Norse"],
    comingSoon: false,
  },
  {
    id: "iching",
    name: "I Ching",
    icon: Shuffle,
    subtitle: "Ancient wisdom",
    description: "Coin toss and yarrow stalk methods. Hexagram visualization with deep philosophical commentary.",
    traditions: ["Chinese", "Taoist"],
    comingSoon: true,
  },
  {
    id: "pendulum",
    name: "Pendulum",
    icon: Globe,
    subtitle: "Dowsing · Yes/No",
    description: "Virtual pendulum with chart overlay. Yes/no answers, body mapping, spirit communication.",
    traditions: ["Universal"],
    comingSoon: true,
  },
  {
    id: "numerology",
    name: "Numerology",
    icon: Calculator,
    subtitle: "Life path · Destiny",
    description: "Life path numbers, destiny analysis, name analysis, compatibility matrix, day codes.",
    traditions: ["Western", "Kabbalistic", "Chinese"],
    comingSoon: true,
  },
  {
    id: "scrying",
    name: "Scrying",
    icon: Eye,
    subtitle: "Crystal · Mirror · Water",
    description: "Crystal ball, obsidian mirror, water/fire gazing. Guided meditation and interpretation engine.",
    traditions: ["Universal"],
    comingSoon: true,
  },
  {
    id: "tasseography",
    name: "Tasseography",
    icon: Droplets,
    subtitle: "Tea leaf · Coffee cup",
    description: "Upload a photo of your cup. AI analyzes patterns with historical meanings from multiple traditions.",
    traditions: ["European", "Middle Eastern"],
    comingSoon: true,
  },
  {
    id: "animal",
    name: "Animal Oracle",
    icon: Bird,
    subtitle: "Spirit animals · Totems",
    description: "Spirit guide identification. Cross-cultural meanings from Native American, Celtic, Norse, African traditions.",
    traditions: ["Universal"],
    comingSoon: true,
  },
  {
    id: "bone",
    name: "Bone Reading",
    icon: Mountain,
    subtitle: "Osteomancy",
    description: "Ancient bone throwing divination. Upload photo of your cast for AI pattern analysis.",
    traditions: ["African", "Siberian", "Celtic"],
    comingSoon: true,
  },
  {
    id: "cartomancy",
    name: "Cartomancy",
    icon: Sun,
    subtitle: "Playing cards · Oracle decks",
    description: "Standard playing cards and specialty oracle decks. Multiple spread options.",
    traditions: ["European", "Gypsy"],
    comingSoon: true,
  },
  {
    id: "dreams",
    name: "Dream Interpretation",
    icon: Moon,
    subtitle: "Oneiromancy",
    description: "Dream journal with AI interpretation. Symbol database from Jungian, Freudian, and occult traditions.",
    traditions: ["Universal"],
    comingSoon: true,
  },
  {
    id: "augury",
    name: "Augury",
    icon: Bird,
    subtitle: "Bird flight · Natural signs",
    description: "Interpretation of bird flight patterns, cloud formations, and natural omens.",
    traditions: ["Roman", "Greek", "Celtic"],
    comingSoon: true,
  },
  {
    id: "geomancy",
    name: "Geomancy",
    icon: Mountain,
    subtitle: "Earth divination",
    description: "Shield charts, house charts, geomantic figures. Medieval Arabic/European divination system.",
    traditions: ["Arabic", "European", "African"],
    comingSoon: true,
  },
  {
    id: "bibliomancy",
    name: "Bibliomancy",
    icon: Book,
    subtitle: "Random passage",
    description: "Random book passage selection from sacred texts across traditions. AI contextual interpretation.",
    traditions: ["Universal"],
    comingSoon: true,
  },
  {
    id: "cleromancy",
    name: "Cleromancy",
    icon: Dice4,
    subtitle: "Dice · Stones · Lots",
    description: "Virtual dice roller, stone casting, random object divination with pattern interpretation.",
    traditions: ["Greek", "Roman", "Norse"],
    comingSoon: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Systems", icon: Sparkles },
  { id: "cards", label: "Cards", icon: Sun },
  { id: "symbols", label: "Symbols", icon: Scroll },
  { id: "astral", label: "Astral", icon: Stars },
  { id: "nature", label: "Nature", icon: Bird },
  { id: "random", label: "Random", icon: Dice4 },
];

export function ConsultPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-purple-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            16 Divination Systems Available
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Consult — Ask the Universe Anything
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Choose your method or simply ask a question and let the universe guide you to the right tool.
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Ask anything: 'Will I meet someone new?' 'What does my career hold?'"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-purple-500/40 focus:bg-white/[0.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-4 md:px-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-sm text-zinc-400 transition hover:border-purple-500/30 hover:text-purple-300"
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Divination Systems Grid */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {DIVINATION_SYSTEMS.map((system) => (
              <Link
                key={system.id}
                to={system.comingSoon ? "#" : `/consult/${system.id}`}
                className={`group relative overflow-hidden rounded-xl border ${
                  system.comingSoon ? "border-white/5 opacity-50" : "border-white/10"
                } bg-white/[0.02] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.04]`}
                onClick={(e) => system.comingSoon && e.preventDefault()}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-lg bg-purple-500/10 p-2.5">
                    <system.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  {system.comingSoon && (
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{system.name}</h3>
                <p className="mb-2 text-xs font-medium text-purple-300">{system.subtitle}</p>
                <p className="mb-3 text-xs leading-relaxed text-zinc-500">{system.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {system.traditions.map((t) => (
                    <span key={t} className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-600">
                      {t}
                    </span>
                  ))}
                </div>
                {system.comingSoon ? null : (
                  <div className="mt-3 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Consult {system.name} →
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mx-auto max-w-6xl px-5 py-12 text-center md:px-8">
        <h2 className="font-serif text-xl font-bold text-white">Need Help Choosing?</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Not sure which system to use? Start with a <span className="text-purple-400">3-Card Tarot</span> or just{" "}
          <span className="text-purple-400">ask a question</span> above.
        </p>
      </section>
    </div>
  );
}
