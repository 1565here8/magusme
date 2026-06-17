import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Moon, Sun, Star, Calendar, BookOpen, Notebook, TrendingUp, Sparkles, AlertTriangle, Zap, Eye, Heart, MapPin, Loader2 } from "lucide-react";
import { AstroWatch } from "../components/merlian/AstroWatch";
import { SpellBox } from "../components/tools/SpellBox";
import { SeoHead } from "../components/SeoHead";
import { fetchAstroNow, type AstroSnapshot } from "../api/merlianReadingsClient";

function useGeolocation() {
  const [loc, setLoc] = useState<{ lat: number; lon: number; label: string } | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("magusme_location");
    if (cached) {
      try { setLoc(JSON.parse(cached)); } catch { /* ignore */ }
    }
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const l = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Your Location" };
        setLoc(l);
        localStorage.setItem("magusme_location", JSON.stringify(l));
      },
      () => {
        setLoc({ lat: 40.7128, lon: -74.006, label: "New York (fallback)" });
      },
    );
  }, []);

  return loc;
}

function MoonPhaseCard({ snapshot }: { snapshot: AstroSnapshot | null }) {
  if (!snapshot) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        </div>
      </div>
    );
  }

  const m = snapshot.moon;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-white/[0.05] p-2">
          <Moon className="h-4 w-4 text-zinc-300" />
        </div>
        <span className="text-sm font-medium text-white">Moon Phase</span>
      </div>
      <div className="mb-2 text-2xl font-bold text-white">{m.name}</div>
      <div className="text-sm text-zinc-400">
        Day {Math.round(m.ageDays)} of 29 · {m.waxing ? "Waxing (Growth)" : "Waning (Release)"}
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Illumination: {Math.round(m.fraction * 100)}%</span>
          <span>Sign: {m.sign}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Element: {m.signElement}</span>
          <span>Modality: {m.signModality}</span>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-white/[0.03] p-3">
        <div className="mb-1 text-xs font-medium text-emerald-300">
          {m.waxing ? "🌱 Growth energy. good for:" : "🌘 Release energy. good for:"}
        </div>
        <div className="space-y-1 text-xs text-zinc-400">
          {m.waxing ? (
            <>
              <div>🌱 New beginnings & attraction</div>
              <div>💰 Prosperity & abundance spells</div>
              <div>💪 Strength & courage rituals</div>
            </>
          ) : (
            <>
              <div>🧹 Banishing & clearing</div>
              <div>🔚 Letting go & release</div>
              <div>🕯️ Protection & binding</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CurrentHourCard({ snapshot }: { snapshot: AstroSnapshot | null }) {
  if (!snapshot) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        </div>
      </div>
    );
  }

  const { current } = snapshot.planetaryHours;
  const ruler = current.ruler;
  const progress = current.progress ?? 0;
  const minutesRemaining = current.minutesRemaining ?? 0;
  const hours = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;

  const startTime = new Date(current.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const endTime = new Date(current.end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const planetEmoji: Record<string, string> = {
    Sun: "☀️", Moon: "🌙", Mars: "♂️", Mercury: "☿️", Jupiter: "♃", Venus: "♀️", Saturn: "♄",
  };

  return (
    <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-transparent p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-sky-500/15 p-2">
          <Clock className="h-4 w-4 text-sky-400" />
        </div>
        <span className="text-sm font-medium text-white">Planetary Hour</span>
      </div>
      <div className="mb-2 text-2xl font-bold text-white">
        {planetEmoji[ruler] ?? "🪐"} {ruler} Hour
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span>{hours}h {mins}m remaining</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-purple-500"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-zinc-600">
        <span>Started: {startTime}</span>
        <span>Ends: {endTime}</span>
      </div>
    </div>
  );
}

function VoidOfCourseCard() {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-amber-500/15 p-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </div>
        <span className="text-sm font-medium text-white">Void of Course Moon</span>
      </div>
      <div className="mb-2 text-xl font-bold text-amber-300">Check AstroWatch</div>
      <div className="text-sm text-zinc-400">
        View void-of-course timing in the live sky dashboard below.
      </div>
      <div className="mt-3 text-xs leading-relaxed text-zinc-500">
        The moon between zodiac signs. spells may fail or be unclear. Rest, plan, or divine instead of active spellwork.
      </div>
    </div>
  );
}

export function DailyToolsPage() {
  const loc = useGeolocation();
  const [snapshot, setSnapshot] = useState<AstroSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(true);

  useEffect(() => {
    if (!loc) return;
    setSnapshotLoading(true);
    fetchAstroNow({ lat: loc.lat, lon: loc.lon, label: loc.label })
      .then(setSnapshot)
      .catch(() => null)
      .finally(() => setSnapshotLoading(false));
  }, [loc]);

  return (
    <div className="min-h-screen">
      <SeoHead title="Daily Tools · Planetary Hours & Moon Phases" description="Live planetary hours, moon phases, void-of-course moon, astro watch, and daily spell box. Plan your magical timing with precision." path="/tools" />
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-blue-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
            <Clock className="h-3.5 w-3.5" />
            Live Planetary Data · Real-Time Timing
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Daily Tools. What's Optimal Right Now
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Planetary hours, moon phases, timing recommendations, and all your reference libraries.
          </p>
          {loc && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-600">
              <MapPin className="h-3 w-3" />
              {loc.label}
            </div>
          )}
        </div>
      </section>

      {/* Live Dashboard */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <CurrentHourCard snapshot={snapshot} />
            <MoonPhaseCard snapshot={snapshot} />
            <VoidOfCourseCard />
          </div>
        </div>
      </section>

      {/* Full AstroWatch. live sky data */}
      {loc && (
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
            <h2 className="mb-6 font-serif text-lg font-bold text-white">Live Sky Dashboard</h2>
            <AstroWatch />
          </div>
        </section>
      )}

      {/* Spell Box */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <SpellBox />
        </div>
      </section>

      {/* Daily Rituals */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <h2 className="mb-6 font-serif text-lg font-bold text-white">Daily Rituals</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { time: "🌅 Morning Centering", duration: "5 min", desc: "Grounding · Protection · Intention Setting", color: "from-sky-500/10 to-blue-500/5", icon: Sun, to: "/consult" },
              { time: "🌞 Midday Check-In", duration: "3 min", desc: "Energy Scan · Affirmation · Chakra Quick Check", color: "from-amber-500/10 to-orange-500/5", icon: Sparkles, to: "/consult" },
              { time: "🌆 Evening Release", duration: "5 min", desc: "Gratitude · Cord-Cutting · Energy Clearing", color: "from-purple-500/10 to-pink-500/5", icon: Moon, to: "/consult" },
              { time: "🌙 Night Reflection", duration: "10 min", desc: "Integration · Dream Journal · Tomorrow's Intent", color: "from-indigo-500/10 to-violet-500/5", icon: Star, to: "/human-map" },
            ].map((ritual) => (
              <Link
                key={ritual.time}
                to={ritual.to}
                className="group block rounded-xl border border-white/10 bg-gradient-to-br ${ritual.color} p-5 transition hover:border-white/20"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium text-white">{ritual.time}</div>
                  <span className="text-xs text-zinc-500">{ritual.duration}</span>
                </div>
                <p className="text-xs text-zinc-400">{ritual.desc}</p>
                <div className="mt-3 text-xs font-medium text-purple-400 transition-opacity group-hover:opacity-100">
                  Start Practice →
                </div>
              </Link>
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
              { name: "Color Magic Guide", icon: Eye, q: "color magic" },
              { name: "Herb Properties", icon: Sun, q: "herb properties" },
              { name: "Stone & Crystal Guide", icon: Star, q: "crystal guide" },
              { name: "Tarot Quick Ref", icon: BookOpen, q: "tarot" },
              { name: "Rune Meanings", icon: Sparkles, q: "rune" },
              { name: "Symbol Dictionary", icon: Eye, q: "symbol dictionary" },
              { name: "Chakra System", icon: Heart, q: "chakra" },
              { name: "Element Correspondences", icon: Moon, q: "element correspondences" },
            ].map((ref) => (
              <Link
                key={ref.name}
                to={`/learn?q=${encodeURIComponent(ref.q)}`}
                className="group block rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center transition hover:border-sky-500/30 hover:bg-white/[0.04]"
              >
                <div className="mb-2 inline-flex rounded-lg bg-sky-500/10 p-2">
                  <ref.icon className="h-4 w-4 text-sky-400" />
                </div>
                <div className="text-xs font-medium text-zinc-300 group-hover:text-white">{ref.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Tracking */}
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <h2 className="mb-6 font-serif text-lg font-bold text-white">Your Tracking & Journal</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Manifestation Journal", count: "34 entries", latest: "Seeing more abundance signs...", icon: Notebook, to: "/human-map" },
            { name: "Spell Casting Log", count: "12 casts", latest: "75% success rate! Mirror Shield worked.", icon: BookOpen, to: "/human-map" },
            { name: "Oracle Archive", count: "127 readings", latest: "Latest: 3-Card Tarot (Jun 9)", icon: Eye, to: "/human-map" },
            { name: "Dream Journal", count: "23 entries", latest: "Flying over water, felt free", icon: Moon, to: "/human-map" },
            { name: "Synchronicity Tracker", count: "41 events", latest: "Heard song 3x about abundance", icon: TrendingUp, to: "/human-map" },
            { name: "Progress Dashboard", count: "Last 30 days", latest: "73% manifestation success rate", icon: Sparkles, to: "/human-map" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="group block rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20"
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
              <div className="mt-3 text-xs font-medium text-purple-400 transition-opacity group-hover:opacity-100">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
