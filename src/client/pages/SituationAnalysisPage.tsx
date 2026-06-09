import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Moon, Star, Scroll, Brain, BookOpen, Wand2,
  Shield, Heart, AlertTriangle, ChevronRight, Loader2,
  Check, ArrowLeft, Sun, Clock, Feather,
} from "lucide-react";

type PathChoice = "white" | "black" | null;
type Step = "input" | "analyzing" | "path" | "result";

const SAMPLE_SITUATIONS = [
  "Feeling stuck in my career, no growth for 2 years",
  "Relationship uncertainty, not sure if partner is right for me",
  "Financial struggles, can't seem to break the poverty cycle",
  "Someone is working against me at work, office politics",
  "Want to attract love but keep attracting the wrong people",
  "Feeling energetically drained, like something is feeding on me",
];

const ANALYZING_SYSTEMS = [
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
  const [path, setPath] = useState<PathChoice>(null);
  const [result, setResult] = useState<typeof MOCK_RESULTS.white | null>(null);

  // Mock results for demo
  const MOCK_RESULTS = {
    white: {
      pattern: "Saturn Return intersecting with a 9-year numerological cycle. The Tower card reversed indicates you're resisting necessary change. Rune Isa (stagnation) confirms — you're frozen by fear of the unknown, not by lack of opportunity. Your natal Mars in 10th house (career) is being squared by transiting Pluto — power struggles are surfacing to push you toward your real path.",

      reading: [
        { system: "Tarot", icon: Sparkles, content: "The Tower (reversed) — You're avoiding a necessary breakdown. The Star — Hope is coming but you must release the old first. Judgement — A major life call is waiting." },
        { system: "Runes", icon: Scroll, content: "Isa — A period of necessary stillness. Use this time for inner work, not action. Jera behind it — A harvest cycle is completing. What you reap depends on what you sow now." },
        { system: "Astrology", icon: Moon, content: "Saturn return activating 10th house. Transiting Pluto squaring natal Mars (career tension). Neptune in 7th — confusion in relationships. Jupiter trine Sun — protection is active, trust the process." },
        { system: "Numerology", icon: Star, content: "Personal Year 9 — Endings and completion. This is the last year of a 9-year cycle. 2026 is Universal Year 1 — new beginnings are being prepared. Your Life Path 7 calls for solitude and analysis before action." },
      ],

      spells: [
        { title: "Saturn Return Release Ritual", tradition: "Ceremonial", difficulty: "Medium", time: "Saturn hour, Saturday", desc: "Honor the Saturn transition. Write what no longer serves you, burn it, and welcome the new structure." },
        { title: "Path Clearing Bath", tradition: "Hoodoo", difficulty: "Easy", time: "Waning moon", desc: "Sea salt, rosemary, and cinnamon bath to remove energetic blocks from your career path." },
        { title: "Star Anchor Meditation", tradition: "Wiccan", difficulty: "Easy", time: "Night, visible star", desc: "The Star card calls. Nightly meditation under starlight to align with your true north." },
      ],

      psychology: [
        { name: "Cognitive Reframing", desc: "Reframe 'I'm stuck' to 'I'm in a transition. Transitions feel like stagnation but are actually transformation in process.' Daily journaling for 5 min.", type: "CBT" },
        { name: "Future Self Visualization", desc: "Daily 5-min NLP visualization: see your future self 1 year from now, having moved through this. Feel the relief and pride. Anchor this feeling to a physical touch (hand on heart).", type: "NLP" },
        { name: "Shadow Journaling", desc: "The Tower reversed means you're avoiding a truth. Journal: 'What am I afraid would happen if I actually changed careers? What's the worst case? What's the best case?'", type: "Shadow Work" },
      ],

      actionPlan: [
        { day: "Day 1-2", action: "Saturn Return Release Ritual. Write your fears, burn them. Set your intention for the next 9-year cycle.", icon: Sparkles },
        { day: "Day 3-7", action: "Path Clearing Bath × 3 (every other night). Journal each morning: 'What would I do if I weren't afraid?'", icon: Moon },
        { day: "Day 8-14", action: "Star Anchor Meditation nightly. Add Future Self Visualization before sleep.", icon: Star },
        { day: "Day 15-21", action: "Begin taking one small action toward career change each day. Update resume. Take a course. Network.", icon: ChevronRight },
        { day: "Day 22-30", action: "Review progress. Repeat any rituals that felt powerful. Adjust course based on what emerged.", icon: Check },
      ],

      avoid: "Don't make permanent decisions during the Void of Course moon (Jun 11-13). Avoid confrontation at work until Saturn shadow passes (3 weeks). Don't force a relationship decision while Neptune clouds 7th house.",
    },

    black: {
      pattern: "Saturn Return + Pluto squaring Mars. This is a POWER moment disguised as a crisis. The Tower upright shows destruction is necessary — someone or something must fall for you to rise. Thurisaz (defense rune) suggests you're under psychic attack at work. Your 9th numerological year is about purging enemies, not making peace.",

      reading: [
        { system: "Tarot", icon: Sparkles, content: "The Tower — A necessary destruction. This situation must break. The Devil — There's a bondage pattern here (maybe a person, job, or belief). Strength — You have the power to face what's coming." },
        { system: "Runes", icon: Scroll, content: "Thurisaz — Defense and conflict. Someone is actively working against you. Uruz — Your inner strength is being called. Tiwaz — Justice will prevail if you fight correctly." },
        { system: "Astrology", icon: Moon, content: "Pluto squaring Mars is a POWER aspect. Someone is challenging your position. This is a test of will. Sun trine Jupiter offers legal/institutional protection if you act wisely." },
        { system: "Numerology", icon: Star, content: "Year 9 is about elimination. What/who in your life has overstayed? This is the year to cut cords, not create new ones. Life Path 1 — You're a natural leader being tested." },
      ],

      spells: [
        { title: "Mirror Return to Sender", tradition: "Wiccan", difficulty: "Easy", time: "Mars hour", desc: "Return the energy being sent at you. Ethical — it only reflects what was sent." },
        { title: "Tiwaz Justice Binding", tradition: "Norse", difficulty: "Medium", time: "Tyr's hour, Tuesday", desc: "Call on Tyr for justice. Bind the hands of those working against you with red thread and a candle." },
        { title: "Pluto Power Bath", tradition: "Ceremonial", difficulty: "Medium", time: "Mars hour, Saturday", desc: "Salt, black pepper, and iron-bearing herbs. Strip away energetic manipulation from others." },
      ],

      psychology: [
        { name: "Strategic Mirroring (NLP)", desc: "Mirror your opponent's body language and speech patterns in meetings. Creates subconscious rapport, reduces their aggression. Practice 2 min before each interaction.", type: "NLP" },
        { name: "Anger Alchemy", desc: "Your anger is power. 5-min daily: sit with the anger, don't suppress it. Ask it: 'What boundary is being crossed? What do you want me to protect?' Move the energy through breathwork.", type: "Shadow Work" },
        { name: "Strategic Detachment", desc: "Emotionally detach from outcomes at work. CBT technique: 'What's the worst that can happen?' Usually your brain exaggerates. Write the realistic worst case — it's rarely as bad as fear predicts.", type: "CBT" },
      ],

      actionPlan: [
        { day: "Today", action: "Cast Mirror Return to Sender. Document everything happening at work (dates, times, witnesses).", icon: Shield },
        { day: "Day 2-3", action: "Tiwaz Justice Binding. Tuesday at Tyr's hour. Set your boundary clearly.", icon: Scroll },
        { day: "Day 4-7", action: "Strategic Mirroring in every interaction. Pluto Power Bath on Saturday. Journal anger alchemy daily.", icon: Brain },
        { day: "Day 8-14", action: "Take strategic action. If legal, consult. If political at work, gather allies. Move from defense to positioned offense.", icon: ChevronRight },
        { day: "Day 15-30", action: "Review. The situation should resolve by end of month. If not, escalate with stronger measures.", icon: Check },
      ],

      avoid: "Don't act impulsively in Mars hour (anger). Don't reveal your hand — let them think you're weak. Don't use baneful magic without first doing the Mirror Return (ethics matter). The Pluto transit lasts 2 years — this is a marathon, not a sprint.",
    },
  };

  function startAnalysis() {
    setStep("analyzing");
    setCurrentSystem(0);
    ANALYZING_SYSTEMS.forEach((_, i) => {
      setTimeout(() => setCurrentSystem(i + 1), ANALYZING_SYSTEMS[i].time);
    });
    setTimeout(() => setStep("path"), 5000);
  }

  function choosePath(selected: PathChoice) {
    setPath(selected);
    setResult(selected === "white" ? MOCK_RESULTS.white : MOCK_RESULTS.black);
    setStep("result");
  }

  return (
    <div className="min-h-screen">
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
                and the Grimoire — then build you a complete action plan.
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
              {ANALYZING_SYSTEMS.map((sys, i) => (
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

        {/* STEP 3: CHOOSE PATH */}
        {step === "path" && (
          <div className="py-12">
            <div className="mb-8 text-center">
              <div className="mb-4 text-4xl">🔮</div>
              <h2 className="font-serif text-2xl font-bold text-white">The Analysis is Complete</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                I can see the pattern. Now — how do you want to approach this?
              </p>
            </div>

            <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
              <button
                onClick={() => choosePath("white")}
                className="group rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 text-left transition hover:border-emerald-500/40"
              >
                <div className="mb-3 inline-flex rounded-xl bg-emerald-500/15 p-3">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">White Magic Path</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Protection, reflection, healing. Uses positive psychology + ethical magic.
                  Returns negativity to source without causing harm. Builds long-term strength.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">CBT</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">NLP</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">Protection Spells</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">Shadow Work</span>
                </div>
              </button>

              <button
                onClick={() => choosePath("black")}
                className="group rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-6 text-left transition hover:border-red-500/40"
              >
                <div className="mb-3 inline-flex rounded-xl bg-red-500/15 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">Shadow Work Path</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Direct confrontation, binding, strategic retreat. Uses shadow psychology +
                  forceful magic. For when gentle hasn't worked. Faster results, higher stakes.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-300">Strategic NLP</span>
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-300">Binding</span>
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-300">Justice Rituals</span>
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-300">Anger Alchemy</span>
                </div>
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-zinc-600">
              Both paths include psychological support. The difference is approach — ethical reflection vs. direct confrontation.
            </p>
          </div>
        )}

        {/* STEP 4: RESULT */}
        {step === "result" && result && (
          <div className="pb-12">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className={`mb-4 inline-flex rounded-2xl p-4 ${path === "white" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                {path === "white" ? (
                  <Shield className="h-8 w-8 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                )}
              </div>
              <h1 className="font-serif text-2xl font-bold text-white">Your Complete Reading</h1>
              <p className="text-sm text-zinc-500">{path === "white" ? "White Magic + Positive Psychology Path" : "Shadow Work + Strategic Magic Path"}</p>
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
                {result.reading.map((r) => (
                  <div key={r.system} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <r.icon className="h-4 w-4 text-violet-400" />
                      <span className="text-sm font-medium text-white">{r.system}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-400">{r.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Spells */}
            <section className="mb-6">
              <h2 className="mb-4 font-serif text-lg font-bold text-white">Recommended Spells</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {result.spells.map((s) => (
                  <div
                    key={s.title}
                    className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-violet-500/30"
                    onClick={() => navigate(`/learn/${s.title.toLowerCase().replace(/\s+/g, "-")}`)}
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

            {/* Psychology */}
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

            {/* Action Plan */}
            <section className="mb-6">
              <h2 className="mb-4 font-serif text-lg font-bold text-white">30-Day Action Plan</h2>
              <div className="space-y-2">
                {result.actionPlan.map((step) => (
                  <div key={step.day} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex h-8 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                      {step.day}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-300">{step.action}</p>
                    </div>
                    <step.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-400" />
                  </div>
                ))}
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
                onClick={() => { setStep("input"); setPath(null); setResult(null); }}
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
          </div>
        )}
      </div>
    </div>
  );
}
