import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Book, Coins, ScrollText } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  HEXAGRAMS, TRIGRAMS, tossCoins, hexagramByNumber, hexagramByBinary,
  getNuclearHexagram, buildHexagramBinary, buildSecondaryBinary,
  trigramFromBinary,
  type HexagramDef, type CoinTossResult, type TrigramDef,
} from "./ichingData";

/* ─── Theme colors ─── */
const CINNABAR = "#c43a31";
const CINNABAR_DIM = "rgba(196,58,49,0.7)";
const GOLD = "#c8a45c";
const JADE = "#5b8c5a";
const INK_BG = "#0f0f0f";
const INK_CARD = "rgba(20,20,20,0.8)";

/* ─── Line rendering ─── */
function YangLine({ changing, delay }: { changing: boolean; delay: number }) {
  return (
    <div
      className="flex items-center gap-2 py-1.5 animate-in"
      style={{ animation: `fadeSlideIn 0.4s ease-out ${delay}s both` }}
    >
      <div className={`h-1.5 flex-1 rounded-full ${changing ? "bg-[#c43a31]" : "bg-white/80"}`} />
      {changing && <span className="text-[9px] font-mono text-[#c43a31]">○</span>}
    </div>
  );
}

function YinLine({ changing, delay }: { changing: boolean; delay: number }) {
  return (
    <div
      className="flex items-center gap-2 py-1.5 animate-in"
      style={{ animation: `fadeSlideIn 0.4s ease-out ${delay}s both` }}
    >
      <div className={`h-1.5 w-[42%] rounded-full ${changing ? "bg-[#c43a31]" : "bg-white/40"}`} />
      <div className="flex-1" />
      <div className={`h-1.5 w-[42%] rounded-full ${changing ? "bg-[#c43a31]" : "bg-white/40"}`} />
      {changing && <span className="text-[9px] font-mono text-[#c43a31]">✕</span>}
    </div>
  );
}

/* ─── Hexagram figure ─── */
function HexagramFigure({ hexagram, tosses, label }: {
  hexagram: HexagramDef;
  tosses?: CoinTossResult[];
  label?: string;
}) {
  const upperTri = trigramFromBinary(hexagram.binary.substring(0, 3));
  const lowerTri = trigramFromBinary(hexagram.binary.substring(3, 6));
  const lines = hexagram.binary.split("").reverse();

  return (
    <div className="flex flex-col items-center gap-3">
      {label && <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">{label}</span>}
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-0.5 pt-6">
          <span className="text-xl leading-none opacity-50">{upperTri.symbol}</span>
          <span className="text-[8px] text-zinc-600">{upperTri.name}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-4">
            <div className="flex flex-col gap-0.5" style={{ minWidth: 80 }}>
              {[5, 4, 3, 2, 1, 0].map((li) => {
                const isYang = lines[li] === "1";
                const ch = tosses ? tosses[5 - li]?.isChanging ?? false : false;
                return isYang
                  ? <YangLine key={li} changing={ch} delay={(5 - li) * 0.15} />
                  : <YinLine key={li} changing={ch} delay={(5 - li) * 0.15} />;
              })}
            </div>
          </div>
          <span className="mt-1.5 text-[9px] font-bold tracking-wider text-white/60">
            {hexagram.number}. {hexagram.name}
          </span>
          <span className="text-[8px] text-zinc-600 font-mono">{hexagram.pinyin} · {hexagram.chinese}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 pt-6">
          <span className="text-xl leading-none opacity-50">{lowerTri.symbol}</span>
          <span className="text-[8px] text-zinc-600">{lowerTri.name}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Trigrams mini badge ─── */
function TrigramBadge({ tri }: { tri: TrigramDef }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[9px] text-zinc-400">
      <span>{tri.symbol}</span>
      <span>{tri.name} ({tri.pinyin})</span>
      <span className="text-zinc-600">· {tri.element} · {tri.directionPost}</span>
    </span>
  );
}

/* ─── Hexagram detail card ─── */
function HexagramDetail({ hexagram, tosses }: { hexagram: HexagramDef; tosses?: CoinTossResult[] }) {
  const upperTri = trigramFromBinary(hexagram.binary.substring(0, 3));
  const lowerTri = trigramFromBinary(hexagram.binary.substring(3, 6));
  const nuclear = getNuclearHexagram(hexagram);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-serif text-xl font-bold text-white">{hexagram.number}. {hexagram.name}</h2>
        <p className="mt-1 text-xs text-zinc-500">{hexagram.pinyin} · {hexagram.chinese}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <TrigramBadge tri={upperTri} />
          <TrigramBadge tri={lowerTri} />
          <TrigramBadge tri={trigramFromBinary(nuclear.binary.substring(0, 3))} />
        </div>
        <p className="mt-1 text-[9px] text-zinc-600">
          Upper: {upperTri.name} over Lower: {lowerTri.name} ·
          Nuclear: {nuclear.name}
        </p>
      </div>

      {/* Judgment */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">The Judgment</h3>
        <p className="text-sm italic leading-relaxed text-zinc-300">&ldquo;{hexagram.judgment}&rdquo;</p>
      </div>

      {/* Image */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">The Image</h3>
        <p className="text-sm italic leading-relaxed text-zinc-300">&ldquo;{hexagram.image}&rdquo;</p>
      </div>

      {/* Changing lines */}
      {tosses && tosses.filter(t => t.isChanging).length > 0 && (
        <div className="rounded-xl border border-[#c43a31]/20 bg-[#c43a31]/[0.03] p-5">
          <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-[#c43a31]/70">Changing Lines</h3>
          {tosses.map((t, i) => {
            if (!t.isChanging) return null;
            const lineIdx = 5 - i;
            const lineText = hexagram.lines[lineIdx];
            return (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#c43a31]">Line {lineIdx + 1}</span>
                  <span className="text-[9px] text-zinc-600">
                    {t.value === 6 ? "Old Yin (6) → Yang" : "Old Yang (9) → Yin"}
                  </span>
                </div>
                <p className="text-xs italic leading-relaxed text-zinc-400">&ldquo;{lineText}&rdquo;</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Secondary Hexagram comparison ─── */
function SecondaryView({ primary, secondary, tosses }: {
  primary: HexagramDef;
  secondary: HexagramDef;
  tosses: CoinTossResult[];
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-6">
        <h3 className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">Transformation</h3>
        <p className="mt-1 text-xs text-zinc-600">
          {tosses.filter(t => t.isChanging).length} changing line{tosses.filter(t => t.isChanging).length > 1 ? "s" : ""} · Primary → Secondary
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
        <HexagramFigure hexagram={primary} tosses={tosses} label="Primary" />
        <div className="hidden sm:flex items-center">
          <span className="text-2xl text-zinc-600">→</span>
        </div>
        <div className="sm:hidden">
          <span className="text-sm text-zinc-600">↓</span>
        </div>
        <HexagramFigure hexagram={secondary} label="Secondary" />
      </div>
      <div className="mt-6 mx-auto max-w-2xl">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">
            Secondary Judgment — {secondary.number}. {secondary.name}
          </h3>
          <p className="text-sm italic leading-relaxed text-zinc-300">
            &ldquo;{secondary.judgment}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Coin Toss animation ─── */
function CoinTossAnimation({ onComplete }: { onComplete: (tosses: CoinTossResult[]) => void }) {
  const [phase, setPhase] = useState<"idle" | "tossing" | "done">("idle");
  const [tosses, setTosses] = useState<CoinTossResult[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const doToss = useCallback(() => {
    setPhase("tossing");
    setCurrentLine(0);
    const results = tossCoins();
    setTosses(results);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentLine(i);
      if (i >= 6) {
        clearInterval(interval);
        setPhase("done");
        setTimeout(() => onComplete(results), 600);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="text-center">
      {phase === "idle" && (
        <button onClick={doToss}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c43a31]/20 to-[#c43a31]/10 border border-[#c43a31]/30 px-6 py-3 text-sm text-[#c43a31] transition hover:bg-[#c43a31]/30"
        >
          <Coins className="h-4 w-4" />
          Cast the Coins
        </button>
      )}

      {(phase === "tossing" || phase === "done") && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {tosses.slice(0, currentLine).map((t, i) => (
              <div key={i}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all duration-300 ${
                  t.isChanging
                    ? "border-[#c43a31]/40 bg-[#c43a31]/10 text-[#c43a31]"
                    : "border-white/[0.06] bg-white/[0.02] text-zinc-400"
                }`}
                style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.1}s both` }}
              >
                <span className="font-mono">Line {6 - i}</span>
                <span className="font-bold">{t.value}</span>
                <span>{t.isYang ? "⚊" : "⚋"}</span>
                {t.isChanging && <span className="text-[9px]">·changing</span>}
              </div>
            ))}
            {currentLine < 6 && phase === "tossing" && (
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-1.5 text-xs text-zinc-600">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#c43a31]/50" />
                Casting line {6 - currentLine}...
              </div>
            )}
          </div>
          {phase === "done" && (
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <div className="h-1 w-1 rounded-full bg-[#c43a31]" />
              Complete — {tosses.filter(t => t.isChanging).length} changing line{tosses.filter(t => t.isChanging).length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Browse all hexagrams ─── */
function HexagramBrowser() {
  const [filter, setFilter] = useState("");
  const filtered = filter
    ? HEXAGRAMS.filter(h =>
        h.name.toLowerCase().includes(filter.toLowerCase()) ||
        h.pinyin.toLowerCase().includes(filter.toLowerCase()) ||
        h.number.toString().includes(filter) ||
        h.chinese.includes(filter)
      )
    : HEXAGRAMS;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <div className="mb-6">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search hexagrams by name, number, or pinyin..."
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-white outline-none transition focus:border-[#c43a31]/30 focus:bg-white/[0.04]"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((h) => {
          const upperTri = trigramFromBinary(h.binary.substring(0, 3));
          const lowerTri = trigramFromBinary(h.binary.substring(3, 6));
          return (
            <div key={h.number}
              className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 transition hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-mono text-zinc-600">#{h.number}</span>
                  <h4 className="text-sm font-semibold text-white/90">{h.name}</h4>
                  <p className="text-[9px] text-zinc-500">{h.pinyin} · {h.chinese}</p>
                </div>
                <div className="flex gap-1 text-sm opacity-40">
                  <span>{upperTri.symbol}</span>
                  <span>{lowerTri.symbol}</span>
                </div>
              </div>
              <p className="mt-2 text-[10px] italic leading-relaxed text-zinc-600 line-clamp-2">
                {h.judgment}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-600">{upperTri.name}</span>
                <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-600">{lowerTri.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function IChingPage() {
  const [view, setView] = useState<"cast" | "read" | "browse">("cast");
  const [question, setQuestion] = useState("");
  const [tosses, setTosses] = useState<CoinTossResult[] | null>(null);
  const [primary, setPrimary] = useState<HexagramDef | null>(null);
  const [secondary, setSecondary] = useState<HexagramDef | null>(null);

  const handleCastComplete = useCallback((results: CoinTossResult[]) => {
    setTosses(results);
    const bin = buildHexagramBinary(results);
    const p = hexagramByBinary(bin);
    setPrimary(p);
    const secBin = buildSecondaryBinary(results);
    setSecondary(secBin ? hexagramByBinary(secBin) : null);
    setView("read");
  }, []);

  const reset = useCallback(() => {
    setTosses(null);
    setPrimary(null);
    setSecondary(null);
    setQuestion("");
    setView("cast");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${INK_BG}, #0a0a0a)` }}>
      <SeoHead title="I Ching · Book of Changes" description="Ancient Chinese oracle — cast coins or yarrow stalks for hexagram guidance from the 64 hexagrams of the Yì Jīng" path="/consult/iching" />

      {/* Header */}
      <div className="border-b border-white/[0.03]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            All methods
          </Link>
          <span className="text-xs text-zinc-700">I Ching</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-white/[0.03] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${CINNABAR} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${JADE} 0%, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c43a31]/20 bg-[#c43a31]/10 px-4 py-1.5 text-xs text-[#c43a31]/80">
            <ScrollText className="h-3.5 w-3.5" />
            易經 · Book of Changes
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {view === "cast" && "Consult the I Ching"}
            {view === "read" && primary?.name}
            {view === "browse" && "All 64 Hexagrams"}
          </h1>
          {view === "cast" && (
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500">
              The I Ching reveals the configuration of the moment. Cast three coins six times to build a hexagram — the oracle speaks through the patterns of change.
            </p>
          )}
          {view === "read" && primary && (
            <p className="mx-auto mt-2 text-xs text-zinc-600">
              Hexagram {primary.number} · {primary.pinyin} · {primary.chinese} · {upperLower(primary)}
            </p>
          )}

          {/* Nav */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {view !== "cast" && (
              <button onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-[10px] text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
              >
                <Coins className="h-3 w-3" />
                New Cast
              </button>
            )}
            <button onClick={() => setView(view === "browse" ? "cast" : "browse")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-wider transition ${
                view === "browse"
                  ? "border-[#c43a31]/30 bg-[#c43a31]/10 text-[#c43a31]/80"
                  : "border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              <Book className="h-3 w-3" />
              {view === "browse" ? "Back" : "Browse 64"}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      {view === "cast" && (
        <section className="mx-auto max-w-3xl px-5 py-12">
          <div className="mx-auto max-w-lg space-y-8">
            {/* Question input */}
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Your Question (optional)
              </label>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What do you wish to ask the oracle?"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c43a31]/30 focus:bg-white/[0.04]"
              />
            </div>

            {/* Casting method */}
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-6">
              <div className="mb-4 text-center">
                <h3 className="text-xs font-semibold text-white/70">Three-Coin Method</h3>
                <p className="mt-1 text-[9px] text-zinc-600">
                  Toss three coins 6 times · Heads=3 (yang) · Tails=2 (yin) · 6=yin changing · 9=yang changing
                </p>
              </div>
              <CoinTossAnimation onComplete={handleCastComplete} />
            </div>

            {/* Method info */}
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 text-center">
              <p className="text-[9px] leading-relaxed text-zinc-600">
                Lines build from bottom to top. A changing line (6 or 9) transforms into its opposite,
                creating a secondary hexagram showing the direction of change.
              </p>
            </div>
          </div>
        </section>
      )}

      {view === "read" && primary && (
        <section className="mx-auto max-w-5xl px-5 py-8">
          {/* Hexagram display */}
          <div className="mb-10 flex justify-center">
            <HexagramFigure hexagram={primary} tosses={tosses!} label="Your Hexagram" />
          </div>

          {/* Interpretation */}
          <HexagramDetail hexagram={primary} tosses={tosses!} />

          {/* Secondary hexagram */}
          {secondary && (
            <div className="mt-12 pt-8 border-t border-white/[0.04]">
              <SecondaryView primary={primary} secondary={secondary} tosses={tosses!} />
            </div>
          )}

          {/* Nuclear hexagram hint */}
          <div className="mt-8 text-center">
            <p className="text-[8px] text-zinc-700">
              Nuclear hexagram: {getNuclearHexagram(primary).number}. {getNuclearHexagram(primary).name}
              · {getNuclearHexagram(primary).pinyin}
            </p>
          </div>

          {/* Question asked */}
          {question && (
            <div className="mx-auto mt-8 max-w-lg text-center">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">Asked</p>
              <p className="mt-1 text-xs italic text-zinc-500">&ldquo;{question}&rdquo;</p>
            </div>
          )}
        </section>
      )}

      {view === "browse" && <HexagramBrowser />}
    </div>
  );
}

function upperLower(h: HexagramDef): string {
  const u = trigramFromBinary(h.binary.substring(0, 3));
  const l = trigramFromBinary(h.binary.substring(3, 6));
  return `${u.symbol} ${u.name} over ${l.name} ${l.symbol}`;
}

/* ─── Keyframes injected once ─── */
const styleId = "iching-keyframes";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
