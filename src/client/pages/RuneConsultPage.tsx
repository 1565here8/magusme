import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, Scroll, RotateCcw, Shield } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { ELDER_FUTHARK, getRandomRune, type RuneDef } from "../../shared/elderFuthark";
import {
  fetchDivinations,
  type DivinationMethod,
} from "../api/merlianReadingsClient";
import { streamDivination } from "../api/merlianReadingsClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MerlianPersonalProfilePanel,
  useMerlianPersonalProfile,
  profileToApiPayload,
} from "../components/merlian/MerlianPersonalProfilePanel";

type CastRune = { rune: RuneDef; reversed: boolean; id: number };

function RuneCard({ cast, dim }: { cast: CastRune; dim?: boolean }) {
  const { rune, reversed } = cast;
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        reversed
          ? "border-red-900/30 bg-red-950/15"
          : "border-amber-700/30 bg-amber-950/15"
      } ${dim ? "opacity-30" : ""}`}
    >
      <div className="mb-2 text-right text-[10px] uppercase tracking-wider text-zinc-600">
        Cast #{cast.id}
      </div>
      <div className={`text-center text-5xl ${reversed ? "rotate-180 text-red-300" : "text-amber-200"}`}>
        {rune.glyph}
      </div>
      <h3 className="mt-2 text-center font-serif text-lg font-bold text-white">
        {rune.name}
      </h3>
      <p className="text-center text-xs text-zinc-500">{rune.letter}</p>
      <p className="mt-2 text-center text-xs leading-relaxed text-zinc-400">
        {reversed ? rune.reversedMeaning : rune.meaning}
      </p>
      {reversed && (
        <span className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md bg-red-900/30 px-2 py-0.5 text-[10px] text-red-400">
          <Shield className="h-3 w-3" />
          Merkstave (reversed)
        </span>
      )}
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {rune.keywords.slice(0, 3).map((kw) => (
          <span
            key={kw}
            className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-zinc-500"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RuneConsultPage() {
  const [catalog, setCatalog] = useState<DivinationMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [castRunes, setCastRunes] = useState<CastRune[]>([]);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, saveProfile, expanded, setExpanded, hasPersonalization } =
    useMerlianPersonalProfile();

  useEffect(() => {
    fetchDivinations()
      .then((data) => {
        const match = data.catalog.find(
          (m) => m.id === "rune" || m.id === "runes" || m.id.startsWith("rune_")
        );
        setCatalog(match ?? null);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const castRune = useCallback(() => {
    if (castRunes.length >= 5) return;
    const { rune, reversed } = getRandomRune();
    setCastRunes((prev) => [
      ...prev,
      { rune, reversed, id: prev.length + 1 },
    ]);
  }, [castRunes.length]);

  const castAll = useCallback(() => {
    const needed = 5 - castRunes.length;
    const newRunes: CastRune[] = [];
    for (let i = 0; i < needed; i++) {
      const { rune, reversed } = getRandomRune();
      newRunes.push({ rune, reversed, id: castRunes.length + i + 1 });
    }
    setCastRunes((prev) => [...prev, ...newRunes]);
  }, [castRunes.length]);

  const clearRunes = useCallback(() => {
    setCastRunes([]);
    setReading("");
    setError(null);
  }, []);

  const getReading = useCallback(async () => {
    if (!catalog || castRunes.length === 0) return;
    setStreaming(true);
    setError(null);
    setReading("");

    const runeSummary = castRunes
      .map(
        (c) =>
          `${c.rune.name} (${c.rune.glyph}) — ${c.reversed ? "Merkstave (reversed): " : ""}${c.reversed ? c.rune.reversedMeaning : c.rune.meaning}`
      )
      .join("\n");

    const fullQuestion =
      `Rune cast (${castRunes.length} runes):\n${runeSummary}\n\n` +
      `Question: ${question || "General guidance"}\n\n` +
      "Interpret this rune casting. For each rune explain its meaning in this context, the significance of its position, and how it relates to the other runes. Give practical guidance.";

    try {
      await streamDivination(
        {
          divinationId: catalog.id,
          question: fullQuestion,
          ...profileToApiPayload(profile),
        },
        (chunk) => setReading((prev) => prev + chunk),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Reading failed. Try again.",
      );
    } finally {
      setStreaming(false);
    }
  }, [catalog, castRunes, question, profile]);

  return (
    <div className="min-h-screen">
      <SeoHead title="Rune Casting · Elder Futhark" description="Cast the Elder Futhark runes with AI-powered interpretation. Full rune spreads, merkstave analysis, and Norse magical correspondences." path="/consult/runes" />
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-purple-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <Link
            to="/consult"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all divination methods
          </Link>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
              <Scroll className="h-3.5 w-3.5" />
              Elder Futhark · Germanic Tradition
            </div>
            <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Rune Consultation
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
              Cast the ancient runes for guidance, wisdom, and insight. Click to draw runes one by one or cast all at once.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Rune Cast Area */}
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
                  placeholder="e.g., What do I need to know about my path?"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-amber-500/40 focus:bg-white/[0.05]"
                  disabled={streaming}
                />
              </div>

              {/* Rune Cast Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={castRune}
                  disabled={castRunes.length >= 5 || streaming}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:from-amber-500 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Scroll className="h-4 w-4" />
                  {castRunes.length >= 5 ? "Complete" : "Cast a Rune"}
                </button>
                <button
                  onClick={castAll}
                  disabled={castRunes.length >= 5 || streaming}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  Cast All (5)
                </button>
                <button
                  onClick={clearRunes}
                  disabled={castRunes.length === 0 || streaming}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-500 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </button>
              </div>

              {/* Cast Runes Display */}
              {castRunes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">
                      Your Rune Cast ({castRunes.length})
                    </h3>
                    <span className="text-xs text-zinc-500">
                      Cast in order — first rune sets the theme
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                    {castRunes.map((cast, i) => (
                      <RuneCard key={cast.id} cast={cast} dim={streaming && i !== castRunes.length - 1} />
                    ))}
                  </div>

                  {/* Get Reading Button */}
                  <button
                    onClick={getReading}
                    disabled={streaming || castRunes.length === 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 px-6 py-3 text-sm font-bold text-white transition hover:from-purple-500 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {streaming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Consulting the Runes...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Get Rune Reading
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Reading Result */}
              {error && (
                <div className="rounded-xl border border-red-900/30 bg-red-950/20 p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              {reading && (
                <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-amber-900/10 p-6">
                  <h3 className="mb-4 font-serif text-lg font-bold text-white">
                    The Runes Speak
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {reading}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info Sidebar */}
            <div className="space-y-4 lg:col-span-2">
              <MerlianPersonalProfilePanel
                profile={profile}
                expanded={expanded}
                onToggle={() => setExpanded((v) => !v)}
                onChange={saveProfile}
                hasPersonalization={hasPersonalization}
              />

              {/* How to Cast */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="mb-3 text-sm font-medium text-white">
                  How to Cast
                </h3>
                <ol className="space-y-2 text-xs text-zinc-400">
                  <li className="flex gap-2">
                    <span className="shrink-0 font-bold text-amber-400">1.</span>
                    <span>Formulate your question in mind</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-bold text-amber-400">2.</span>
                    <span>Click "Cast a Rune" to draw runes one by one, or "Cast All" for a full 5-rune spread</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-bold text-amber-400">3.</span>
                    <span>Each rune can be upright or merkstave (reversed)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-bold text-amber-400">4.</span>
                    <span>First rune sets the overall theme, subsequent runes add detail</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 font-bold text-amber-400">5.</span>
                    <span>Click "Get Rune Reading" for an AI interpretation</span>
                  </li>
                </ol>
              </div>

              {/* Elder Futhark Quick Reference */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="mb-3 text-sm font-medium text-white">
                  Elder Futhark — 24 Runes
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {ELDER_FUTHARK.map((rune) => (
                    <div
                      key={rune.id}
                      className="rounded-lg bg-white/[0.03] px-2 py-1.5 text-center transition hover:bg-amber-500/10"
                    >
                      <div className="text-lg">{rune.glyph}</div>
                      <div className="text-[9px] text-zinc-500">{rune.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
