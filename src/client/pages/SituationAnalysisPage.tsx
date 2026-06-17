import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Moon, Star, Scroll, Brain, BookOpen, Wand2,
  Shield, Heart, AlertTriangle, ChevronRight, Loader2,
  Check, ArrowLeft, Sun, Clock, Feather,
} from "lucide-react";
import { ensureCsrfToken, bootstrapSession } from "../api/apiClient";
import { SeoHead } from "../components/SeoHead";

type Step = "input" | "analyzing" | "result";

type ReadingResult = {
  pattern: string;
  reading: Array<{ system: string; icon: string; content: string }>;
  spells: Array<{ title: string; tradition: string; difficulty: string; time: string; desc: string }>;
  psychology: Array<{ name: string; desc: string; type: string }>;
  actionPlan: Array<{ day: string; action: string; icon: string }>;
  avoid: string;
};

const SAMPLE_SITUATIONS = [
  "Feeling stuck in my career, no growth for 2 years",
  "Relationship uncertainty, not sure if partner is right for me",
  "Financial struggles, can't seem to break the poverty cycle",
  "Someone is working against me at work, office politics",
  "Want to attract love but keep attracting the wrong people",
  "Feeling energetically drained, like something is feeding on me",
];

const SYSTEM_ICONS: Record<string, typeof Sparkles> = {
  Sparkles, Moon, Star, Scroll, Brain, BookOpen, Feather, Shield, Heart, ChevronRight, Check,
};

const ANALYZING_STEPS = [
  { icon: Sparkles, label: "Tarot", time: 800 },
  { icon: Scroll, label: "Runes", time: 1200 },
  { icon: Moon, label: "Astrology", time: 1800 },
  { icon: Star, label: "Numerology", time: 2200 },
  { icon: Brain, label: "Psychological Profile", time: 2800 },
  { icon: BookOpen, label: "Grimoire Match", time: 3400 },
  { icon: Feather, label: "Energy Assessment", time: 4000 },
];

export function SituationAnalysisPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("input");
  const [situation, setSituation] = useState("");
  const [currentSystem, setCurrentSystem] = useState(0);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startAnalysis() {
    setStep("analyzing");
    setCurrentSystem(0);
    setError(null);

    for (let i = 0; i < ANALYZING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, ANALYZING_STEPS[i].time));
      setCurrentSystem(i + 1);
    }

    try {
      await ensureCsrfToken();
      await bootstrapSession().catch(() => null);
      const res = await fetch("/api/reading/analyze", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ situation }),
      });
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
      const data = (await res.json()) as ReadingResult & { ok: boolean };
      setResult(data);
    } catch {
      setError("Analysis service unavailable. Try again shortly.");
    }
    setStep("result");
  }

  function iconFromName(name: string) {
    return SYSTEM_ICONS[name] ?? Sparkles;
  }

  function slugifyTitle(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Situation Analysis · Cross-System Reading" description="Get a complete cross-system analysis of your situation using tarot, runes, astrology, numerology, and grimoire matching. Includes spells, psychology, and a 30-day action plan." path="/reading" />
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8">

        {/* STEP 1: INPUT */}
        {step === "input" && (
          <>
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex rounded-2xl bg-violet-500/10 p-4">
                <Sparkles className="h-8 w-8 text-violet-400" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-white">Describe Your Situation</h1>
              <p className="mx-auto mt-3 max-w-lg text-zinc-400">
                Tell me what's happening. I'll analyze through Tarot, Runes, Astrology, Numerology,
                and the Grimoire. then build you a complete action plan.
              </p>
            </div>

            <div className="mx-auto max-w-xl">
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="I'm feeling stuck in my career... I'm not sure about my relationship... Someone is working against me... What do you need guidance on?"
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-violet-500/40 focus:bg-white/[0.05]"
              />

              {!situation && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-zinc-500">Try a situation:</p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SITUATIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSituation(s)}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-violet-500/30 hover:text-violet-300"
                      >
                        {s.length > 30 ? s.slice(0, 30) + "..." : s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={startAnalysis}
                disabled={!situation.trim()}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-40"
              >
                <Sparkles className="h-5 w-5" />
                Analyze My Situation
              </button>
            </div>
          </>
        )}

        {/* STEP 2: ANALYZING */}
        {step === "analyzing" && (
          <div className="py-12">
            <div className="mb-8 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-400" />
              <h2 className="mt-4 font-serif text-xl font-bold text-white">Analyzing Your Situation</h2>
              <p className="mt-2 text-sm text-zinc-500">Consulting all systems simultaneously...</p>
            </div>

            <div className="mx-auto max-w-md space-y-3">
              {ANALYZING_STEPS.map((sys, i) => (
                <div
                  key={sys.label}
                  className={`flex items-center gap-4 rounded-xl border px-5 py-3.5 transition-all duration-500 ${
                    i < currentSystem
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                      : i === currentSystem
                        ? "border-violet-500/40 bg-violet-500/5 text-violet-300"
                        : "border-white/5 text-zinc-600"
                  }`}
                >
                  <sys.icon className={`h-5 w-5 ${i === currentSystem ? "animate-pulse" : ""}`} />
                  <span className="flex-1 text-sm">{sys.label}</span>
                  {i < currentSystem && <Check className="h-4 w-4 text-emerald-400" />}
                  {i === currentSystem && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === "result" && (
          <div className="pb-12">
            {error ? (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-400" />
                <h2 className="font-serif text-xl font-bold text-white mb-2">Analysis Unavailable</h2>
                <p className="text-zinc-400 mb-6">{error}</p>
                <button
                  onClick={() => { setStep("input"); setError(null); }}
                  className="rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white"
                >
                  Try Again
                </button>
              </div>
            ) : result ? (
              <>
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex rounded-2xl bg-violet-500/10 p-4">
                    <Star className="h-8 w-8 text-violet-400" />
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-white">Your Complete Reading</h1>
                  <p className="text-sm text-zinc-500">Multi-system analysis based on your situation</p>
                </div>

                {/* Pattern */}
                <section className="mb-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-5 w-5 text-violet-400" />
                    <h2 className="font-serif text-lg font-bold text-white">The Pattern</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">{result.pattern}</p>
                </section>

                {/* Reading Details */}
                <section className="mb-6">
                  <h2 className="mb-4 font-serif text-lg font-bold text-white">Cross-System Analysis</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.reading.map((r) => {
                      const Icon = iconFromName(r.icon);
                      return (
                        <div key={r.system} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-violet-400" />
                            <span className="text-sm font-medium text-white">{r.system}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-400">{r.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Spells */}
                {result.spells && result.spells.length > 0 && (
                  <section className="mb-6">
                    <h2 className="mb-4 font-serif text-lg font-bold text-white">Recommended Spells</h2>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {result.spells.map((s) => (
                        <div
                          key={s.title}
                          className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-violet-500/30"
                          onClick={() => navigate(`/learn/${slugifyTitle(s.title)}`)}
                        >
                          <h3 className="text-sm font-bold text-white">{s.title}</h3>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-zinc-500">
                            <span>{s.tradition}</span>
                            <span>·</span>
                            <span>{s.difficulty}</span>
                          </div>
                          <p className="mt-2 text-xs text-zinc-400">{s.desc}</p>
                          <p className="mt-2 text-[10px] text-violet-400">🪐 {s.time}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Psychology */}
                {result.psychology && result.psychology.length > 0 && (
                  <section className="mb-6">
                    <h2 className="mb-4 font-serif text-lg font-bold text-white">Psychological Techniques</h2>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {result.psychology.map((p) => (
                        <div key={p.name} className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white">{p.name}</h3>
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">{p.type}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-zinc-400">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Action Plan */}
                <section className="mb-6">
                  <h2 className="mb-4 font-serif text-lg font-bold text-white">30-Day Action Plan</h2>
                  <div className="space-y-2">
                    {result.actionPlan.map((stepItem) => {
                      const Icon = iconFromName(stepItem.icon);
                      return (
                        <div key={stepItem.day} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                          <div className="flex h-8 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                            {stepItem.day}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-zinc-300">{stepItem.action}</p>
                          </div>
                          <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* What to Avoid */}
                <section className="mb-6 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-300">What to Avoid</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{result.avoid}</p>
                </section>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => { setStep("input"); setError(null); }}
                    className="rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-400 transition hover:border-white/20"
                  >
                    New Reading
                  </button>
                  <button
                    onClick={() => navigate("/learn")}
                    className="rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
                  >
                    Browse Spells
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
