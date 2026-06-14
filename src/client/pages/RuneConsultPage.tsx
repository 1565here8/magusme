import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Scroll, Book, Eye, Crosshair, RotateCcw, Shuffle } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  ELDER_FUTHARK, getRandomRune, getRuneById,
  type RuneDef, type SpreadType,
  SPREAD_DEFS,
} from "../../shared/elderFuthark";

const BLOOD = "#8b0000";
const ICE = "#4a90d9";
const GOLD = "#c8a45c";
const STONE = "#4a4a4a";
const BG = "#0a0a0a";

/* ─── Rune Stone Card ─── */
function RuneStone({ rune, reversed, position, dim }: {
  rune: RuneDef; reversed: boolean; position?: string; dim?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-300 ${
      reversed
        ? "border-red-900/40 bg-red-950/10"
        : "border-amber-900/30 bg-amber-950/10"
    } ${dim ? "opacity-30" : ""}`}
      style={{
        boxShadow: reversed
          ? "inset 0 0 30px rgba(139,0,0,0.1)"
          : "inset 0 0 30px rgba(200,164,92,0.05)",
      }}
    >
      {/* Rune glyph */}
      <div className={`text-center text-5xl font-bold tracking-tighter ${
        reversed ? "rotate-180 text-red-300/80" : "text-amber-200/90"
      }`}>
        {rune.glyph}
      </div>

      {/* Name */}
      <h3 className="mt-2 text-center font-serif text-base font-bold text-white/90">
        {rune.name}
      </h3>

      {/* Position */}
      {position && (
        <p className="mt-1 text-center text-[9px] uppercase tracking-[0.15em] text-amber-500/60">
          {position}
        </p>
      )}

      {/* Reversed badge */}
      {reversed && (
        <div className="mt-2 flex items-center justify-center gap-1.5 rounded border border-red-900/30 bg-red-950/20 px-2 py-0.5">
          <span className="text-[8px] text-red-400/70">Merkstave</span>
        </div>
      )}

      {/* Element + Aett tag */}
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-600">
          {rune.aettName}
        </span>
        <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-600">
          {rune.element}
        </span>
      </div>
    </div>
  );
}

/* ─── Cast result entry ─── */
interface CastEntry {
  rune: RuneDef;
  reversed: boolean;
  id: number;
}

/* ─── Spread type selector ─── */
const SPREAD_OPTIONS: { key: SpreadType; icon: typeof Scroll; label: string; desc: string }[] = [
  { key: "odin", icon: Eye, label: "Odin's Rune", desc: "Single focus" },
  { key: "three_norns", icon: Scroll, label: "Three Norns", desc: "Past · Present · Future" },
  { key: "five_cross", icon: Crosshair, label: "Five-Rune Cross", desc: "Full situation map" },
  { key: "free_cast", icon: Shuffle, label: "Free Cast", desc: "1-9 runes, no structure" },
];

/* ─── Rune Detail Panel ─── */
function RuneDetail({ rune, reversed }: { rune: RuneDef; reversed: boolean }) {
  const aettName = rune.aett === 1 ? "Freyr's Ætt" : rune.aett === 2 ? "Hagal's Ætt" : "Tyr's Ætt";
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className={`inline-block text-6xl ${reversed ? "rotate-180 text-red-300/70" : "text-amber-200/80"}`}>
          {rune.glyph}
        </div>
        <h2 className="mt-3 font-serif text-2xl font-bold text-white">{rune.name}</h2>
        <p className="text-xs text-zinc-500">{rune.letter} · {aettName} · {rune.element}{rune.tree ? ` · ${rune.tree}` : ""}</p>
        {rune.deity && <p className="text-[9px] text-zinc-600">Associated with {rune.deity}</p>}
      </div>

      <div className={`rounded-xl border p-5 ${reversed ? "border-red-900/20 bg-red-950/10" : "border-amber-900/20 bg-amber-950/10"}`}>
        <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">
          {reversed ? "Merkstave (Reversed) Meaning" : "Upright Meaning"}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-300">
          {reversed ? rune.reversedDetail : rune.detail}
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
        <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Keywords</h3>
        <div className="flex flex-wrap gap-1.5">
          {rune.keywords.map(kw => (
            <span key={kw} className="rounded border border-white/[0.04] bg-white/[0.02] px-2 py-0.5 text-[10px] text-zinc-400">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Browse all runes ─── */
function RuneBrowser() {
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState<RuneDef | null>(null);
  const [reversed, setReversed] = useState(false);

  const filtered = useMemo(() => {
    return filter
      ? ELDER_FUTHARK.filter(r =>
          r.name.toLowerCase().includes(filter.toLowerCase()) ||
          r.letter.toLowerCase().includes(filter.toLowerCase()) ||
          r.keywords.some(k => k.includes(filter.toLowerCase())) ||
          r.element.toLowerCase().includes(filter.toLowerCase()) ||
          r.aettName.toLowerCase().includes(filter.toLowerCase())
        )
      : ELDER_FUTHARK;
  }, [filter]);

  if (detail) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-16">
        <button
          onClick={() => setDetail(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-[10px] text-zinc-500 transition hover:text-zinc-300"
        >
          ← Back to all runes
        </button>
        <RuneDetail rune={detail} reversed={reversed} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <div className="mb-6">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search runes by name, letter, keyword, or element..."
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/30 focus:bg-white/[0.04]"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((rune) => (
          <button
            key={rune.id}
            onClick={() => { setDetail(rune); setReversed(false); }}
            className="group rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 text-left transition hover:border-amber-500/20 hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-600">#{rune.id}</span>
              <span className="text-[8px] text-zinc-600">{rune.letter}</span>
            </div>
            <div className="my-2 text-center text-4xl text-amber-200/60 transition group-hover:text-amber-200/80">
              {rune.glyph}
            </div>
            <h4 className="text-center text-sm font-semibold text-white/80">{rune.name}</h4>
            <p className="mt-1 text-center text-[9px] text-zinc-500">{rune.aettName} · {rune.element}</p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-600 line-clamp-2">
              {rune.meaning}
            </p>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-xs text-zinc-600">No runes match your search.</p>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function RuneConsultPage() {
  const [view, setView] = useState<"cast" | "read" | "browse">("cast");
  const [spreadType, setSpreadType] = useState<SpreadType>("odin");
  const [freeCastCount, setFreeCastCount] = useState(3);
  const [question, setQuestion] = useState("");
  const [castRunes, setCastRunes] = useState<CastEntry[]>([]);

  const spread = SPREAD_DEFS[spreadType];
  const spreadPositions = spread.positions;

  const doCast = useCallback(() => {
    const count = spreadType === "free_cast" ? freeCastCount : spread.count;
    const results: CastEntry[] = [];
    for (let i = 0; i < count; i++) {
      const r = getRandomRune();
      results.push({ ...r, id: i + 1 });
    }
    setCastRunes(results);
    setView("read");
  }, [spreadType, freeCastCount, spread.count]);

  const reset = useCallback(() => {
    setCastRunes([]);
    setQuestion("");
    setView("cast");
  }, []);

  const totalRunes = spreadType === "free_cast" ? freeCastCount : spread.count;

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${BG}, #050505)` }}>
      <SeoHead
        title="Elder Futhark Rune Casting · Norse Oracle"
        description="Cast the Elder Futhark runes with multiple spread types. Norse divination with full rune meanings, Merkstave analysis, and authentic Germanic tradition."
        path="/consult/runes"
      />

      {/* Keyframes */}
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes runeGlow { 0%,100% { text-shadow: 0 0 10px rgba(200,164,92,0.2); } 50% { text-shadow: 0 0 25px rgba(200,164,92,0.5); } }
        @keyframes runeDrop { from { opacity: 0; transform: translateY(-30px) rotate(-10deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }
        @keyframes bloodPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>

      {/* Header */}
      <div className="border-b border-white/[0.03]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            All methods
          </Link>
          <span className="text-xs text-zinc-700">Elder Futhark</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.03]">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${BLOOD} 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${ICE} 0%, transparent 50%)`,
        }} />
        <div className="relative mx-auto max-w-3xl px-5 py-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-400/80">
            <Scroll className="h-3.5 w-3.5" />
            ᚠᚢᚦᚨᚱᚲ · Elder Futhark
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {view === "cast" && "Rune Casting"}
            {view === "read" && "The Runes Speak"}
            {view === "browse" && "All 24 Runes"}
          </h1>
          {view === "cast" && (
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500">
              The runes were revealed to Odin when he hung nine days on Yggdrasil, pierced by his own spear. 
              Cast them for the wisdom of the All-Father — each rune a key to the hidden patterns of fate.
            </p>
          )}

          {/* Nav */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {view !== "cast" && (
              <button onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-[10px] text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
              >
                <RotateCcw className="h-3 w-3" />
                New Cast
              </button>
            )}
            <button onClick={() => setView(view === "browse" ? "cast" : "browse")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-wider transition ${
                view === "browse"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400/80"
                  : "border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              <Book className="h-3 w-3" />
              {view === "browse" ? "Back" : "Browse 24"}
            </button>
          </div>
        </div>
      </section>

      {/* Cast View */}
      {view === "cast" && (
        <section className="mx-auto max-w-3xl px-5 py-12">
          <div className="mx-auto max-w-lg space-y-8">
            {/* Question */}
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Your Question (optional)
              </label>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What do you seek to understand?"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-500/30 focus:bg-white/[0.04]"
              />
            </div>

            {/* Spread type */}
            <div>
              <label className="mb-3 block text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Casting Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SPREAD_OPTIONS.map(({ key, icon: Icon, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => setSpreadType(key)}
                    className={`rounded-xl border p-3 text-left transition ${
                      spreadType === key
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-white/[0.04] bg-white/[0.015] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 ${spreadType === key ? "text-amber-400" : "text-zinc-600"}`} />
                      <span className={`text-xs font-medium ${spreadType === key ? "text-amber-300" : "text-zinc-400"}`}>
                        {label}
                      </span>
                    </div>
                    <p className="mt-1 text-[9px] text-zinc-600">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Spread description */}
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
              <p className="text-[10px] leading-relaxed text-zinc-500">{spread.description}</p>
            </div>

            {/* Free cast count */}
            {spreadType === "free_cast" && (
              <div className="flex items-center gap-3">
                <label className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">Number of runes</label>
                <div className="flex gap-1">
                  {[1, 3, 5, 7, 9].map(n => (
                    <button
                      key={n}
                      onClick={() => setFreeCastCount(n)}
                      className={`h-8 w-8 rounded-lg border text-xs transition ${
                        freeCastCount === n
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border-white/[0.04] bg-white/[0.015] text-zinc-500 hover:border-white/10"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Position preview */}
            {spreadPositions.length > 0 && (
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                  Position Meanings
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {spreadPositions.map((pos, i) => (
                    <div key={i} className="rounded-lg bg-white/[0.02] p-2.5">
                      <span className="text-[10px] font-bold text-amber-400/80">{pos.name}</span>
                      <p className="mt-0.5 text-[8px] text-zinc-600">{pos.subtitle}</p>
                      <p className="mt-1 text-[8px] leading-relaxed text-zinc-500">{pos.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast button */}
            <div className="text-center">
              <button onClick={doCast}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-red-800 px-8 py-4 text-sm font-bold text-white transition hover:from-amber-600 hover:to-red-700"
              >
                <Sparkles className="h-4 w-4" />
                Cast {totalRunes} Rune{totalRunes > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Read View */}
      {view === "read" && (
        <section className="mx-auto max-w-6xl px-5 py-8">
          {question && (
            <div className="mb-8 text-center">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">Asked</p>
              <p className="mt-1 text-sm italic text-zinc-500">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Runestone display */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {castRunes.map((cast, i) => (
              <div key={cast.id} style={{ animation: `runeDrop 0.4s ease-out ${i * 0.12}s both` }}>
                <RuneStone
                  rune={cast.rune}
                  reversed={cast.reversed}
                  position={spreadPositions[i]?.name}
                />
              </div>
            ))}
          </div>

          {/* Position interpretations */}
          <div className="mt-10 mx-auto max-w-3xl space-y-6">
            {castRunes.map((cast, i) => {
              const pos = spreadPositions[i];
              return (
                <div key={cast.id} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5"
                  style={{ animation: `fadeSlideIn 0.5s ease-out ${i * 0.15 + 0.3}s both` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-3xl ${cast.reversed ? "rotate-180 text-red-300/50" : "text-amber-200/50"}`}>
                      {cast.rune.glyph}
                    </span>
                    {pos && (
                      <div>
                        <h3 className="text-sm font-bold text-white">{pos.name}</h3>
                        <p className="text-[9px] text-zinc-600">{pos.subtitle}</p>
                      </div>
                    )}
                    {!pos && (
                      <div>
                        <h3 className="text-sm font-bold text-white">{cast.rune.name}</h3>
                        <p className="text-[9px] text-zinc-600">Rune #{cast.id}</p>
                      </div>
                    )}
                    {cast.reversed && (
                      <span className="ml-auto rounded border border-red-900/30 bg-red-950/20 px-2 py-0.5 text-[8px] text-red-400/70">
                        Merkstave
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-300">
                    {cast.reversed ? cast.rune.reversedDetail : cast.rune.detail}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {cast.rune.keywords.map(kw => (
                      <span key={kw} className="rounded border border-white/[0.03] bg-white/[0.02] px-1.5 py-0.5 text-[8px] text-zinc-600">
                        {kw}
                      </span>
                    ))}
                    <span className="rounded border border-white/[0.03] bg-white/[0.02] px-1.5 py-0.5 text-[8px] text-zinc-600">
                      {cast.rune.element}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Three Norns spread guidance */}
          {spreadType === "three_norns" && (
            <div className="mx-auto mt-8 max-w-lg text-center">
              <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">The Norns Weave</p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                  Urd shapes the past from the well of memory. Verdandi weaves the present thread by thread. 
                  Skuld cuts the cloth at its appointed length — but the pattern is not fixed until the moment passes.
                </p>
              </div>
            </div>
          )}

          {/* Five-Rune Cross visualization hint */}
          {spreadType === "five_cross" && (
            <div className="mx-auto mt-8 max-w-xs">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                <p className="text-center text-[9px] uppercase tracking-[0.15em] text-zinc-600">The Cross</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[8px] text-zinc-600">
                  <div />
                  <div><span className="text-amber-400/60">Above</span><br />Aspiration</div>
                  <div />
                  <div><span className="text-amber-400/60">Left</span><br />Brings</div>
                  <div><span className="text-amber-400/60">Center</span><br />Heart</div>
                  <div><span className="text-amber-400/60">Right</span><br />Challenge</div>
                  <div />
                  <div><span className="text-amber-400/60">Below</span><br />Foundation</div>
                  <div />
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Browse View */}
      {view === "browse" && <RuneBrowser />}
    </div>
  );
}
