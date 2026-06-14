import { Link } from "react-router-dom";
import { Sparkles, Moon, Apple, Bird, Book, BookOpen, Calculator, Camera, Dice4, Droplets, Eye, Globe, Mountain, Music, Scroll, Shuffle, Stars, Sun, Clock, Heart, Coffee, Wind, Flame, Cloud, Hand, Brain, Footprints, Feather, Home, Calendar, Users, type LucideIcon } from "lucide-react";
import { DIVINATION_SYSTEMS, getSystemsByCategory, type DivinationSystemDef } from "../../shared/divinationSystems";
import { SeoHead } from "../components/SeoHead";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Moon, Apple, Bird, Book, BookOpen, Calculator,
  Camera, Dice4, Droplets, Eye, Globe, Mountain, Music, Scroll,
  Shuffle, Stars, Sun, Clock, Heart, Coffee, Wind, Flame, Cloud,
  Hand, Brain, Footprints, Feather, Home, Calendar, Users,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}

const CATEGORY_ORDER = [
  "Cartomancy",
  "Cleromancy & Sortilege",
  "Scrying & Vision",
  "Physiognomy & Body",
  "Tasseography & Food",
  "Numerology & Onomancy",
  "Bibliomancy & Sacred Text",
  "Oneiromancy & Trance",
  "Natural Omens",
  "Spirit & Mediumship",
  "Ceremonial Oracle",
  "Astronomical",
  "Indian Traditions",
  "Chinese Traditions",
  "Japanese Traditions",
  "Meditation & Relaxation",
];

export function ConsultPage() {
  const byCategory = getSystemsByCategory();

  return (
    <div className="min-h-screen">
      <SeoHead title="Consult the Oracle · 81 Divination Systems" description="Choose from 81 divination methods across 16 traditions — tarot, runes, astrology, I Ching, numerology, scrying, and more. AI-powered readings with full cross-system analysis." path="/consult" />
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-purple-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            {DIVINATION_SYSTEMS.length} Divination Systems Available
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
              <Link
                to="/reading"
                className="flex w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-zinc-500 outline-none transition focus:border-purple-500/40 focus:bg-white/[0.05]"
              >
                Ask anything for a full cross-system analysis...
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* All categories */}
      {CATEGORY_ORDER.map((catName) => {
        const systems = byCategory.get(catName);
        if (!systems || systems.length === 0) return null;
        return (
          <section key={catName} className="border-b border-white/5">
            <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
              <h2 className="mb-2 font-serif text-xl font-bold text-white">{catName}</h2>
              <p className="mb-6 text-sm text-zinc-500">{systems.length} methods</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {systems.map((system) => {
                  const Icon = resolveIcon(system.icon);
                  return (
                    <Link
                      key={system.id}
                      to={system.route}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.04]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="rounded-lg bg-purple-500/10 p-2.5">
                          <Icon className="h-5 w-5 text-purple-400" />
                        </div>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white">{system.label}</h3>
                      <p className="mb-3 text-xs leading-relaxed text-zinc-500">{system.description}</p>
                      {system.tradition && (
                        <span className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-600">
                          {system.tradition}
                        </span>
                      )}
                      <div className="mt-3 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                        Consult →
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Quick links */}
      <section className="mx-auto max-w-6xl px-5 py-12 text-center md:px-8">
        <h2 className="font-serif text-xl font-bold text-white">Need Help Choosing?</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Not sure where to start? Try{" "}
          <Link to="/consult/tarot" className="text-purple-400 hover:text-purple-300">Tarot</Link>
          {" · "}
          <Link to="/consult/runes" className="text-purple-400 hover:text-purple-300">Runes</Link>
          {" · "}
          <Link to="/consult/astrology" className="text-purple-400 hover:text-purple-300">Astrology</Link>
          {" · or "}
          <Link to="/reading" className="text-purple-400 hover:text-purple-300">ask a question</Link>
          {" for a full reading."}
        </p>
      </section>
    </div>
  );
}
