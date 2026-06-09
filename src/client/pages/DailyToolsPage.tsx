import { useState } from "react";
import { Clock, Moon, Sun, Star, Calendar, BookOpen, Notebook, TrendingUp, Sparkles, AlertTriangle, Zap, ChevronRight, Eye, Heart } from "lucide-react";

export function DailyToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-blue-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
            <Clock className="h-3.5 w-3.5" />
            Live Planetary Data · Real-Time Timing
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Daily Tools — What's Optimal Right Now
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Planetary hours, moon phases, timing recommendations, daily rituals, and all your reference libraries.
          </p>
        </div>
      </section>

      {/* Live Data Dashboard */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Planetary Hour */}
            <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-transparent p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-sky-500/15 p-2">
                  <Clock className="h-4 w-4 text-sky-400" />
                </div>
                <span className="text-sm font-medium text-white">Planetary Hour</span>
              </div>
              <div className="mb-2 text-2xl font-bold text-white">♀ Venus Hour</div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>2h 34m remaining</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-sky-500 to-purple-500" />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-zinc-600">
                <span>Started: 1:47 PM</span>
                <span>Ends: 4:21 PM</span>
              </div>
              <div className="mt-3 rounded-lg bg-white/[0.03] p-3">
                <div className="mb-1 text-xs font-medium text-sky-300">Best for now:</div>
                <div className="space-y-1 text-xs text-zinc-400">
                  <div>❤️ Love spells (89% power)</div>
                  <div>💫 Attraction magic (92% power) ⭐ BEST</div>
                  <div>💞 Relationship healing (85% power)</div>
                  <div>🤝 Social magic (88% power)</div>
                </div>
              </div>
              <button className="mt-3 text-xs font-medium text-sky-400 transition hover:text-sky-300">
                Full Schedule →
              </button>
            </div>

            {/* Moon Phase */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-white/[0.05] p-2">
                  <Moon className="h-4 w-4 text-zinc-300" />
                </div>
                <span className="text-sm font-medium text-white">Moon Phase</span>
              </div>
              <div className="mb-2 text-2xl font-bold text-white">Waxing Crescent</div>
              <div className="text-sm text-zinc-400">Day 8 of 29 · Growth Energy</div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Illumination: 42%</span>
                  <span>Next Full: Jun 22</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Sign: Virgo</span>
                  <span>Next New: Jul 6</span>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-white/[0.03] p-3">
                <div className="mb-1 text-xs font-medium text-emerald-300">Good for now:</div>
                <div className="space-y-1 text-xs text-zinc-400">
                  <div>🌱 New beginnings</div>
                  <div>💰 Prosperity spells</div>
                  <div>💪 Strength rituals</div>
                </div>
              </div>
              <button className="mt-3 text-xs font-medium text-purple-400 transition hover:text-purple-300">
                Moon Phase Guide →
              </button>
            </div>

            {/* Void of Course */}
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-amber-500/15 p-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-sm font-medium text-white">Void of Course Moon</span>
              </div>
              <div className="mb-2 text-xl font-bold text-amber-300">⚠️ Avoid Magic</div>
              <div className="text-sm text-zinc-400">
                Wed Jun 11, 11pm — Fri Jun 13, 2am
              </div>
              <div className="mt-3 text-xs leading-relaxed text-zinc-500">
                The moon is between zodiac signs. Spells cast during this time often fail or produce unclear results. Use this time for rest, planning, or divination rather than active spellwork.
              </div>
              <button className="mt-3 text-xs font-medium text-amber-400 transition hover:text-amber-300">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Magic Rating */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/5 via-transparent to-emerald-500/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">Today's Magic Power Rating</h2>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                85% — HIGH
              </span>
            </div>
            <p className="mb-4 text-sm text-zinc-400">
              Venus hour + Waxing moon = excellent time for love, attraction, and social magic.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-medium text-emerald-300">✅ BEST RIGHT NOW</h3>
                <div className="space-y-2">
                  {[
                    { label: "Love spells", pct: 89 },
                    { label: "Attraction magic", pct: 92 },
                    { label: "Relationship healing", pct: 85 },
                    { label: "Manifestation (general)", pct: 84 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-32 text-xs text-zinc-400">{item.label}</span>
                      <div className="flex-1">
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-right text-xs text-emerald-300">{item.pct}%</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs font-medium text-emerald-400 transition hover:text-emerald-300">
                  View 47 spells for this moment →
                </button>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-medium text-amber-300">⚠️ AVOID RIGHT NOW</h3>
                <div className="space-y-2">
                  {[
                    { label: "Communication magic", reason: "Mercury transit confusion" },
                    { label: "Legal matters", reason: "Not clear-headed today" },
                    { label: "Binding spells", reason: "Intents may not hold" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-amber-500/5 px-3 py-2">
                      <div className="text-xs text-zinc-300">{item.label}</div>
                      <div className="text-[10px] text-zinc-600">{item.reason}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-xs font-medium text-amber-400 transition hover:text-amber-300">
                  Full Astrology Explanation →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Rituals */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <h2 className="mb-6 font-serif text-lg font-bold text-white">Daily Rituals</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { time: "🌅 Morning Centering", duration: "5 min", desc: "Grounding · Protection · Intention Setting", color: "from-sky-500/10 to-blue-500/5", icon: Sun },
              { time: "🌞 Midday Check-In", duration: "3 min", desc: "Energy Scan · Affirmation · Chakra Quick Check", color: "from-amber-500/10 to-orange-500/5", icon: Sparkles },
              { time: "🌆 Evening Release", duration: "5 min", desc: "Gratitude · Cord-Cutting · Energy Clearing", color: "from-purple-500/10 to-pink-500/5", icon: Moon },
              { time: "🌙 Night Reflection", duration: "10 min", desc: "Integration · Dream Journal · Tomorrow's Intent", color: "from-indigo-500/10 to-violet-500/5", icon: Star },
            ].map((ritual) => (
              <div
                key={ritual.time}
                className={`group cursor-pointer rounded-xl border border-white/10 bg-gradient-to-br ${ritual.color} p-5 transition hover:border-white/20`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium text-white">{ritual.time}</div>
                  <span className="text-xs text-zinc-500">{ritual.duration}</span>
                </div>
                <p className="text-xs text-zinc-400">{ritual.desc}</p>
                <div className="mt-3 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Start Practice →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <h2 className="mb-6 font-serif text-lg font-bold text-white">Quick Reference Libraries</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[
              { name: "Color Magic Guide", icon: Eye },
              { name: "Herb Properties", icon: Sun },
              { name: "Stone & Crystal Guide", icon: Star },
              { name: "Tarot Quick Ref", icon: BookOpen },
              { name: "Rune Meanings", icon: Sparkles },
              { name: "Symbol Dictionary", icon: Eye },
              { name: "Chakra System", icon: Heart },
              { name: "Element Correspondences", icon: Moon },
            ].map((ref) => (
              <div
                key={ref.name}
                className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center transition hover:border-sky-500/30 hover:bg-white/[0.04]"
              >
                <div className="mb-2 inline-flex rounded-lg bg-sky-500/10 p-2">
                  <ref.icon className="h-4 w-4 text-sky-400" />
                </div>
                <div className="text-xs font-medium text-zinc-300 group-hover:text-white">{ref.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Tracking */}
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <h2 className="mb-6 font-serif text-lg font-bold text-white">Your Tracking & Journal</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Manifestation Journal", count: "34 entries", latest: "Seeing more abundance signs...", icon: Notebook },
            { name: "Spell Casting Log", count: "12 casts", latest: "75% success rate! Mirror Shield worked.", icon: BookOpen },
            { name: "Oracle Archive", count: "127 readings", latest: "Latest: 3-Card Tarot (Jun 9)", icon: Eye },
            { name: "Dream Journal", count: "23 entries", latest: "Flying over water, felt free", icon: Moon },
            { name: "Synchronicity Tracker", count: "41 events", latest: "Heard song 3x about abundance", icon: TrendingUp },
            { name: "Progress Dashboard", count: "Last 30 days", latest: "73% manifestation success rate", icon: Sparkles },
          ].map((item) => (
            <div
              key={item.name}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <item.icon className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{item.name}</div>
                  <div className="text-xs text-zinc-500">{item.count}</div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 italic">"{item.latest}"</p>
              <div className="mt-3 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
