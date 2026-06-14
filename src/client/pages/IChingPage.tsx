import { useState, useCallback, useRef } from "react";
import { Shuffle, Loader2, ChevronDown, Sparkles, BookOpen, RefreshCw, Zap } from "lucide-react";
import { streamDivination, type ReadingMeta } from "../api/merlianReadingsClient";
import {
  HEXAGRAMS, getHexagramByBinary, linesToBinary, coinValuesToLine,
} from "../../shared/ichingHexagrams";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SeoHead } from "../components/SeoHead";

const COIN_SIDES = ["Heads", "Tails"];

function Coin({ value, flipping }: { value: number | null; flipping: boolean }) {
  const label = value === null ? "" : value === 3 ? "H" : "T";
  const sideClass = value === null ? "" : value === 3 ? "text-amber-300" : "text-zinc-400";
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
        flipping
          ? "border-purple-400 bg-purple-500/20 animate-pulse scale-110"
          : value !== null
            ? `${value === 3 ? "border-amber-500/50 bg-amber-500/15" : "border-zinc-600 bg-zinc-800"} scale-100`
            : "border-zinc-700 bg-zinc-800/50 scale-90 opacity-40"
      }`}
    >
      {flipping ? "?" : <span className={sideClass}>{label}</span>}
    </div>
  );
}

function LineDisplay({ yin, changing, index }: { yin: boolean; changing: boolean; index: number }) {
  const label = index + 1;
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 text-right text-xs text-zinc-600">{label}</span>
      <div className="flex items-center gap-2">
        {yin ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className={`h-1 w-12 rounded ${changing ? "bg-red-400" : "bg-zinc-300"}`} />
            <div className="flex w-full justify-center gap-2">
              <div className={`h-1 w-5 rounded ${changing ? "bg-red-400" : "bg-zinc-300"}`} />
              <div className={`h-1 w-5 rounded ${changing ? "bg-red-400" : "bg-zinc-300"}`} />
            </div>
          </div>
        ) : (
          <div className={`h-1 w-12 rounded ${changing ? "bg-red-400" : "bg-zinc-300"}`} />
        )}
        {changing && <span className="text-[10px] text-red-400">×</span>}
      </div>
    </div>
  );
}

export function IChingPage() {
  const [question, setQuestion] = useState("");
  const [lines, setLines] = useState<{ value: number; yin: boolean; changing: boolean }[]>([]);
  const [casting, setCasting] = useState(false);
  const [currentCastLine, setCurrentCastLine] = useState<number | null>(null);
  const [coinFlips, setCoinFlips] = useState<(number | null)[]>([null, null, null]);
  const [flipping, setFlipping] = useState(false);
  const [reading, setReading] = useState("");
  const [loadingReading, setLoadingReading] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [meta, setMeta] = useState<ReadingMeta | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hexagram = lines.length === 6 ? getHexagramByBinary(linesToBinary(lines.map((l) => l.value))) : null;
  const changingLines = lines.filter((l) => l.changing);
  const hasChanging = changingLines.length > 0;

  const castLine = useCallback(async () => {
    if (casting || lines.length >= 6) return;
    setCasting(true);
    setFlipping(true);
    setCoinFlips([null, null, null]);

    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 250));
      const v = Math.random() < 0.5 ? 3 : 2;
      setCoinFlips((prev) => {
        const next = [...prev];
        next[i] = v;
        return next;
      });
    }

    setFlipping(false);
    await new Promise((r) => setTimeout(r, 150));

    const v1 = coinFlips[0] ?? (Math.random() < 0.5 ? 3 : 2);
    const v2 = coinFlips[1] ?? (Math.random() < 0.5 ? 3 : 2);
    const v3 = coinFlips[2] ?? (Math.random() < 0.5 ? 3 : 2);
    const result = coinValuesToLine(v1, v2, v3);

    setLines((prev) => [...prev, { value: result.value, yin: result.yin, changing: result.value === 6 || result.value === 9 }]);
    setCurrentCastLine(lines.length);
    setCasting(false);
  }, [casting, lines.length, coinFlips]);

  const castAll = useCallback(async () => {
    if (casting) return;
    setLines([]);
    setReading("");
    setShowReading(false);
    setCasting(true);

    for (let i = 0; i < 6; i++) {
      setCurrentCastLine(i);
      setFlipping(true);
      setCoinFlips([null, null, null]);

      for (let j = 0; j < 3; j++) {
        await new Promise((r) => setTimeout(r, 100 + Math.random() * 150));
        setCoinFlips((prev) => {
          const next = [...prev];
          next[j] = Math.random() < 0.5 ? 3 : 2;
          return next;
        });
      }

      setFlipping(false);
      await new Promise((r) => setTimeout(r, 100));

      const v1 = Math.random() < 0.5 ? 3 : 2;
      const v2 = Math.random() < 0.5 ? 3 : 2;
      const v3 = Math.random() < 0.5 ? 3 : 2;
      const result = coinValuesToLine(v1, v2, v3);
      setLines((prev) => [...prev, { value: result.value, yin: result.yin, changing: result.value === 6 || result.value === 9 }]);
    }

    setCurrentCastLine(null);
    setCasting(false);
  }, [casting]);

  const resetCast = () => {
    setLines([]);
    setReading("");
    setShowReading(false);
    setMeta(null);
    setCoinFlips([null, null, null]);
    if (abortRef.current) abortRef.current.abort();
  };

  const getReading = useCallback(async () => {
    if (!hexagram) return;
    setLoadingReading(true);
    setShowReading(false);
    setReading("");
    setMeta(null);

    const description = [
      `Generated hexagram: #${hexagram.number} ${hexagram.name} (${hexagram.english})`,
      `Binary: ${hexagram.binary}`,
      `Judgment: ${hexagram.judgment}`,
      `Keywords: ${hexagram.keywords.join(", ")}`,
      ...(hasChanging ? [`Changing lines: ${changingLines.map((_, i) => i + 1).join(", ")}. These lines are changing, indicating the situation is in flux.`] : []),
    ].join("\n");

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await streamDivination(
        {
          divinationId: "iching",
          question: question || `Interpret hexagram ${hexagram.number} — ${hexagram.english}`,
          description,
        },
        (chunk) => setReading((prev) => prev + chunk),
        (m) => setMeta(m),
        ctrl.signal,
      );
      setShowReading(true);
    } catch {
      // handled
    } finally {
      setLoadingReading(false);
    }
  }, [hexagram, hasChanging, changingLines, question]);

  return (
    <div className="min-h-screen">
      <SeoHead title="I Ching · Chinese Zhou Yi" description="Cast the I Ching with AI-powered interpretation. Six-line hexagrams, changing lines, and the full 64-hexagram library of the Zhou Yi." path="/consult/iching" />
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-purple-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
            <BookOpen className="h-3.5 w-3.5" />
            I Ching · Chinese Zhou Yi
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            I Ching — The Book of Changes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Cast coins to generate a hexagram. Discover the ancient wisdom of the Yì Jīng.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — Coin Cast Area */}
          <div className="space-y-6 lg:col-span-3">
            {/* Question Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Your Question <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What should I know about my current path?"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-amber-500/40 focus:bg-white/[0.05]"
                disabled={lines.length > 0 && !showReading}
              />
            </div>

            {/* Coin Display */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Coin Toss</h3>
                <div className="text-xs text-zinc-500">
                  Line {lines.length + 1} of 6 · {(lines.length / 6) * 100}%
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 py-4">
                {[0, 1, 2].map((i) => (
                  <Coin key={i} value={coinFlips[i]} flipping={flipping} />
                ))}
              </div>
              {lines.length === 6 ? (
                <p className="text-center text-xs text-emerald-400">All six lines cast. Hexagram complete.</p>
              ) : (
                <p className="text-center text-xs text-zinc-500">
                  {flipping ? "Casting..." : "Toss three coins to determine each line"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={castLine}
                disabled={casting || lines.length >= 6}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:from-amber-500 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {casting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shuffle className="h-4 w-4" />
                )}
                {lines.length >= 6 ? "Complete" : casting ? "Casting..." : "Toss Coins"}
              </button>
              <button
                onClick={castAll}
                disabled={casting || lines.length >= 6}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap className="h-4 w-4" />
                Quick Cast
              </button>
              {lines.length > 0 && (
                <button
                  onClick={resetCast}
                  disabled={casting}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-500 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Hexagram Display */}
            {lines.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="mb-4 text-sm font-medium text-white">Hexagram Construction</h3>
                <div className="flex flex-col-reverse gap-2">
                  {lines.map((line, i) => (
                    <LineDisplay key={i} yin={line.yin} changing={line.changing} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Hexagram Result */}
            {hexagram && (() => {
              const h = hexagram;
              return (
              <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-purple-500/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white">Hexagram {h.number}</h3>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-300">{h.name}</span>
                </div>
                <h4 className="mb-1 font-serif text-xl text-white">{h.chinese} — {h.english}</h4>
                <p className="mb-4 text-sm italic text-zinc-300">"{h.judgment}"</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {h.keywords.map((kw: string) => (
                    <span key={kw} className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">{kw}</span>
                  ))}
                </div>
                {hasChanging && (
                  <div className="rounded-lg bg-red-500/5 px-3 py-2">
                    <p className="text-xs text-red-300">
                      {changingLines.length} changing line{changingLines.length > 1 ? "s" : ""} (lines {changingLines.map((_, i) => lines.indexOf(_) + 1).join(", ")}). The situation is in flux — the hexagram is transforming.
                    </p>
                  </div>
                )}
                <button
                  onClick={getReading}
                  disabled={loadingReading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 px-5 py-3 text-sm font-bold text-white transition hover:from-purple-500 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingReading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loadingReading ? "Consulting the Oracle..." : "Get AI Reading"}
                </button>
              </div>
              );
            })()}

            {/* Reading Output */}
            {showReading && reading && (
              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent p-6">
                <h3 className="mb-4 font-serif text-lg font-bold text-white">The Oracle Speaks</h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{reading}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Right — Reference Panel */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-3 text-sm font-medium text-white">How to Cast</h3>
              <ol className="space-y-2 text-xs text-zinc-400">
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-amber-400">1.</span>
                  <span>Formulate your question clearly in mind</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-amber-400">2.</span>
                  <span>Toss 3 coins — heads = 3, tails = 2. Total tells the line.</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-amber-400">3.</span>
                  <span>6 = old yin (changing), 7 = young yang, 8 = young yin, 9 = old yang (changing)</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-amber-400">4.</span>
                  <span>Repeat 6 times, building from the bottom line up</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-amber-400">5.</span>
                  <span>Read the hexagram and consult the AI for interpretation</span>
                </li>
              </ol>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-3 text-sm font-medium text-white">About I Ching</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                The I Ching (Yì Jīng) is one of the oldest Chinese classics, dating back over 3,000 years. It began as a divination system using yarrow stalks and later coins, with 64 hexagrams representing all possible life situations. Confucius, Laozi, and countless scholars have commented on its wisdom. The "Book of Changes" teaches that change is the only constant, and understanding its patterns brings clarity.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-3 text-sm font-medium text-white">Line Values</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded bg-zinc-300" /> Young Yang</span>
                  <span className="text-zinc-500">7 (stable)</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="flex items-center gap-2"><span className="flex gap-1"><span className="h-0.5 w-1.5 rounded bg-zinc-300" /><span className="h-0.5 w-1.5 rounded bg-zinc-300" /></span> Young Yin</span>
                  <span className="text-zinc-500">8 (stable)</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded bg-red-400" /> Old Yang (changing)</span>
                  <span className="text-zinc-500">9 → yin</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="flex items-center gap-2"><span className="flex gap-1"><span className="h-0.5 w-1.5 rounded bg-red-400" /><span className="h-0.5 w-1.5 rounded bg-red-400" /></span> Old Yin (changing)</span>
                  <span className="text-zinc-500">6 → yang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
