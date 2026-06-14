import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { getSystemById, DIVINATION_SYSTEMS } from "../../shared/divinationSystems";
import {
  getTraditionalReading,
  getTraditionalDeck,
  getSpreads,
  getSystemDecks,
} from "./traditionalReadings";
import type { ReadingResult, SpreadElement, TarotDeckDef } from "./traditionalReadings";

/* ── Deck style variants ── */
type DeckStyleId = "classic" | "vintage" | "dark" | "minimal";

interface DeckStyle {
  id: DeckStyleId;
  name: string;
  bg: string;
  border: string;
  inner: string;
  backBg: string;
  backBorder: string;
  backInner: string;
  pattern: string;
  textPos: string;
  textTitle: string;
  label: string;
}

const DECK_STYLES: DeckStyle[] = [
  {
    id: "classic",
    name: "Classic",
    bg: "bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d0]",
    border: "border-2 border-amber-700/50",
    inner: "border border-amber-600/25 bg-white/70",
    backBg: "bg-[#1a1520]",
    backBorder: "border border-amber-800/60",
    backInner: "border border-amber-700/20",
    pattern: "rgba(217,168,60,0.12)",
    textPos: "text-amber-800/60",
    textTitle: "text-gray-800",
    label: "text-amber-500/50",
  },
  {
    id: "vintage",
    name: "Vintage",
    bg: "bg-gradient-to-b from-[#e8dcc8] to-[#d4c8b0]",
    border: "border-2 border-amber-800/50",
    inner: "border border-amber-700/25 bg-amber-50/60",
    backBg: "bg-[#2a1f15]",
    backBorder: "border border-amber-800/60",
    backInner: "border border-amber-700/20",
    pattern: "rgba(180,120,60,0.15)",
    textPos: "text-amber-900/60",
    textTitle: "text-amber-950",
    label: "text-amber-600/50",
  },
  {
    id: "dark",
    name: "Dark",
    bg: "bg-gradient-to-b from-[#1a1528] to-[#2a1f30]",
    border: "border-2 border-purple-700/50",
    inner: "border border-purple-600/25 bg-white/[0.06]",
    backBg: "bg-[#0d0d12]",
    backBorder: "border border-purple-800/60",
    backInner: "border border-purple-700/20",
    pattern: "rgba(160,140,220,0.12)",
    textPos: "text-purple-300/60",
    textTitle: "text-zinc-200",
    label: "text-purple-400/50",
  },
  {
    id: "minimal",
    name: "Minimal",
    bg: "bg-gradient-to-b from-white to-gray-50",
    border: "border-2 border-gray-300/80",
    inner: "border border-gray-200/60 bg-white/80",
    backBg: "bg-[#1a1a1a]",
    backBorder: "border border-gray-700/60",
    backInner: "border border-gray-600/20",
    pattern: "rgba(100,100,100,0.12)",
    textPos: "text-gray-500/80",
    textTitle: "text-gray-800",
    label: "text-gray-400/60",
  },
];

function useDeckStyle(id: DeckStyleId): DeckStyle {
  return DECK_STYLES.find((d) => d.id === id) ?? DECK_STYLES[0];
}

/* ── Card back ── */
function CardBack({ i, deck }: { i: number; deck: DeckStyle }) {
  return (
    <div
      className={`absolute inset-0 rounded-lg shadow-lg shadow-black/50 ${deck.backBorder} ${deck.backBg}`}
      style={{ transform: `rotate(${(i - 2.5) * 2}deg) translateY(${i * 1}px)`, zIndex: i }}
    >
      <div className="flex h-full items-center justify-center p-2">
        <div
          className={`h-full w-full rounded-md ${deck.backInner}`}
          style={{
            backgroundImage: [
              `linear-gradient(45deg,${deck.pattern} 25%,transparent 25%)`,
              `linear-gradient(-45deg,${deck.pattern} 25%,transparent 25%)`,
              `linear-gradient(45deg,transparent 75%,${deck.pattern} 75%)`,
              `linear-gradient(-45deg,transparent 75%,${deck.pattern} 75%)`,
            ].join(","),
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        />
      </div>
    </div>
  );
}

/* ── Card face ── */
type CardSize = "sm" | "md" | "lg";

function CardFace({ el, size = "md", deck }: { el: SpreadElement; size?: CardSize; deck: DeckStyle }) {
  const w: Record<CardSize, string> = { lg: "w-44", md: "w-36", sm: "w-28" };
  return (
    <div className={`relative ${w[size]} ${el.reversed ? "rotate-180" : ""}`} style={{ aspectRatio: "2.5 / 3.5" }}>
      <div className={`relative flex h-full flex-col overflow-hidden rounded-lg shadow-xl shadow-black/40 ${deck.border} ${deck.bg}`}>
        <div className={`mx-1.5 my-1.5 flex-1 rounded-md ${deck.inner}`}>
          <div className="flex h-full flex-col items-center justify-between p-2">
            <span className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${deck.textPos}`}>{el.position}</span>
            <span className="text-4xl leading-none">{el.glyph}</span>
            <span className={`text-center text-[10px] font-bold leading-tight ${deck.textTitle}`}>{el.title}</span>
            {el.reversed && <span className="text-[7px] uppercase tracking-wider text-rose-600/70">Reversed</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Celtic Cross ── */
function CelticCrossLayout({ elements, deck }: { elements: SpreadElement[]; deck: DeckStyle }) {
  const c = (i: number) => elements[i];
  return (
    <div className="relative mx-auto hidden md:block" style={{ width: 500, height: 460 }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1">
            <CardFace el={c(2)} size="sm" deck={deck} />
            <span className={`text-[7px] uppercase tracking-[0.15em] ${deck.label}`}>Foundation</span>
          </div>
        </div>
        <div className="absolute -left-28 top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <CardFace el={c(4)} size="sm" deck={deck} />
            <span className={`text-[7px] uppercase tracking-[0.15em] ${deck.label}`}>Recent Past</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <CardFace el={c(0)} size="sm" deck={deck} />
            <span className={`text-[7px] uppercase tracking-[0.15em] ${deck.label}`}>Present</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <CardFace el={c(1)} size="sm" deck={deck} />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-rose-500/50">⨯</span>
              </div>
            </div>
            <span className="text-[7px] uppercase tracking-[0.15em] text-rose-500/50">Challenge</span>
          </div>
        </div>
        <div className="absolute -right-28 top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <CardFace el={c(5)} size="sm" deck={deck} />
            <span className={`text-[7px] uppercase tracking-[0.15em] ${deck.label}`}>Near Future</span>
          </div>
        </div>
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1">
            <CardFace el={c(3)} size="sm" deck={deck} />
            <span className={`text-[7px] uppercase tracking-[0.15em] ${deck.label}`}>Crown</span>
          </div>
        </div>
      </div>
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[6, 7, 8, 9].map((i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <CardFace el={c(i)} size="sm" deck={deck} />
            <span className={`text-[6px] uppercase tracking-[0.15em] ${deck.label} text-center leading-tight`}>
              {elements[i].position.replace(/\s*&\s*/, "\n")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Horseshoe U-arc ── */
function HorseshoeLayout({ elements, deck }: { elements: SpreadElement[]; deck: DeckStyle }) {
  const slots = [
    { i: 0, x: -120, y: -80 }, { i: 1, x: -40, y: -100 },
    { i: 2, x: 40, y: -100 }, { i: 3, x: 120, y: -80 },
    { i: 4, x: -120, y: 130 }, { i: 5, x: -40, y: 150 },
    { i: 6, x: 40, y: 150 },
  ];
  return (
    <div className="relative mx-auto hidden md:block" style={{ width: 420, height: 340 }}>
      {slots.map((p) => (
        <div key={p.i} className="absolute flex flex-col items-center gap-1" style={{ left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)`, transform: "translate(-50%,-50%)" }}>
          <CardFace el={elements[p.i]} size="sm" deck={deck} />
          <span className={`text-[7px] uppercase tracking-[0.15em] ${deck.label} text-center max-w-[80px] leading-tight`}>{elements[p.i].position}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Yes/No Verdict badge ── */
const VERDICT_STYLES: Record<string, string> = {
  Yes: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  No: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  Mixed: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  Unclear: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
};

function VerdictBadge({ answer }: { answer: string }) {
  return (
    <span className={`inline-block rounded-full border px-5 py-1.5 text-sm font-semibold tracking-wider ${VERDICT_STYLES[answer] ?? VERDICT_STYLES.Unclear}`}>
      {answer}
    </span>
  );
}

/* ── Mobile fallback grid ── */
function MobileGrid({ elements, dealt, shuffling, deck }: { elements: SpreadElement[]; dealt: boolean; shuffling: boolean; deck: DeckStyle }) {
  return (
    <div className="md:hidden grid gap-3 grid-cols-2 sm:grid-cols-3">
      {elements.map((el, i) => (
        <div key={i} className={`transition-all duration-500 ${dealt && !shuffling ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="flex flex-col items-center">
            <CardFace el={el} size="sm" deck={deck} />
            <span className={`mt-1 text-[7px] uppercase tracking-[0.15em] ${deck.label} text-center leading-tight`}>{el.position}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ── */
export function GenericDivinationPage({ systemId }: { systemId?: string }) {
  const params = useParams();
  const id = systemId ?? params.systemId ?? "";
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [deck, setDeck] = useState<SpreadElement[]>([]);
  const [showDeck, setShowDeck] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [dealt, setDealt] = useState(false);
  const [spreadId, setSpreadId] = useState<string>("three-card");
  const [deckStyleId, setDeckStyleId] = useState<DeckStyleId>("classic");
  const [deckId, setDeckId] = useState<string | undefined>(undefined);
  const deckStyle = useDeckStyle(deckStyleId);

  const systemDef = getSystemById(id) ?? DIVINATION_SYSTEMS.find((s) => s.route === `/consult/${id}`) ?? null;
  const displayName = systemDef?.label ?? id;
  const spreads = getSpreads(id);
  const availableDecks = getSystemDecks(id);
  const currentDeck = availableDecks?.find(d => d.id === deckId);

  const doReading = useCallback((sId?: string) => {
    const sid = sId ?? spreadId;
    setShuffling(true);
    setDealt(false);
    const r = getTraditionalReading(id, systemDef?.label ?? id, sid, deckId);
    setTimeout(() => {
      setReading(r);
      setShuffling(false);
      setTimeout(() => setDealt(true), 100);
    }, 900);
  }, [id, systemDef?.label, spreadId, deckId]);

  const handleDeckChange = useCallback((newDeckId: string) => {
    const d = availableDecks?.find(d => d.id === newDeckId);
    setDeckId(newDeckId);
    if (d) setDeckStyleId(d.styleId);
    setShuffling(true);
    setDealt(false);
    const r = getTraditionalReading(id, systemDef?.label ?? id, spreadId, newDeckId);
    const deckList = getTraditionalDeck(id, newDeckId);
    setDeck(deckList);
    setTimeout(() => {
      setReading(r);
      setShuffling(false);
      setTimeout(() => setDealt(true), 100);
    }, 900);
  }, [id, systemDef?.label, spreadId, availableDecks]);

  useEffect(() => {
    const initial = spreads[0]?.id ?? "single";
    setSpreadId(initial);
    if (availableDecks && availableDecks.length > 0) {
      const d = availableDecks[0];
      setDeckId(d.id);
      setDeckStyleId(d.styleId);
    }
    const r = getTraditionalReading(id, systemDef?.label ?? id, initial);
    setReading(r);
    setDealt(true);
    const d = getTraditionalDeck(id);
    setDeck(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!reading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  const currentSpread = spreads.find((s) => s.id === spreadId);
  const isYesNo = currentSpread?.layout === "yes-no";
  const isComplex = reading.elements.length === 7 || reading.elements.length === 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900">
      <SeoHead
        title={systemDef ? `${systemDef.label} · ${systemDef.category} Reading` : "Divination Reading"}
        description={systemDef ? `${systemDef.label}: ${systemDef.description}` : "Divination reading"}
        path={systemId ? `/consult/${systemId}` : "/consult"}
      />

      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            All methods
          </Link>
          <span className="text-xs text-zinc-700">{displayName}</span>
        </div>
      </div>

      {/* Spread selector */}
      {spreads.length > 1 && (
        <div className="mx-auto max-w-3xl px-5 pt-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {spreads.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSpreadId(s.id); doReading(s.id); }}
                className={`rounded-full border px-4 py-1.5 text-xs transition ${
                  spreadId === s.id
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentSpread && (
        <div className="mx-auto max-w-lg px-5 pt-3 text-center">
          <p className="text-[10px] text-zinc-600">{currentSpread.description}</p>
          <p className="mt-0.5 text-[9px] italic text-zinc-700">Best for: {currentSpread.bestFor}</p>
        </div>
      )}

      {/* Deck selector (tarot only) */}
      {availableDecks && availableDecks.length > 0 && (
        <div className="mx-auto max-w-lg px-5 pt-5">
          <div className="flex flex-col items-center gap-2">
            <select
              value={deckId ?? ""}
              onChange={(e) => handleDeckChange(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 outline-none transition hover:border-white/20"
            >
              {availableDecks.map((d) => (
                <option key={d.id} value={d.id} className="bg-gray-900">{d.name}</option>
              ))}
            </select>
            {currentDeck && (
              <p className="text-[9px] text-zinc-600">
                {currentDeck.artist} · {currentDeck.year} · {currentDeck.tradition.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Deck style selector + shuffle row */}
      <div className="mx-auto max-w-lg px-5 py-6 text-center">
        <div className={`relative mx-auto h-32 w-28 sm:h-36 sm:w-32 transition-all duration-700 ${shuffling ? "animate-[shake_0.3s_ease-in-out_infinite]" : ""}`}>
          {Array.from({ length: 6 }).map((_, i) => <CardBack key={i} i={i} deck={deckStyle} />)}
        </div>
        <p className="mt-2 text-xs text-zinc-600">{deck.length} cards</p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => doReading()}
            disabled={shuffling}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-6 py-3 text-sm text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-40"
          >
            {shuffling ? (
              <><div className="h-3.5 w-3.5 animate-spin rounded-full border border-amber-300 border-t-transparent" /> Shuffling...</>
            ) : (
              <><Sparkles className="h-3.5 w-3.5" /> Shuffle &amp; Draw</>
            )}
          </button>

          {/* Deck style picker */}
          <select
            value={deckStyleId}
            onChange={(e) => setDeckStyleId(e.target.value as DeckStyleId)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-[10px] text-zinc-400 outline-none transition hover:border-white/20"
          >
            {DECK_STYLES.map((d) => (
              <option key={d.id} value={d.id} className="bg-gray-900">{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards display */}
      {reading.elements.length > 0 && (
        <div className="mx-auto max-w-5xl px-5 pb-6">
          {reading.elements.length === 10 && (
            <><CelticCrossLayout elements={reading.elements} deck={deckStyle} /><MobileGrid elements={reading.elements} dealt={dealt} shuffling={shuffling} deck={deckStyle} /></>
          )}
          {reading.elements.length === 7 && (
            <><HorseshoeLayout elements={reading.elements} deck={deckStyle} /><MobileGrid elements={reading.elements} dealt={dealt} shuffling={shuffling} deck={deckStyle} /></>
          )}
          {isYesNo && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-5 md:gap-8">
                {reading.elements.map((el, i) => (
                  <div key={i} className={`transition-all duration-500 ${dealt && !shuffling ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: `${i * 120}ms` }}>
                    <div className="flex flex-col items-center gap-1">
                      <CardFace el={el} size="lg" deck={deckStyle} />
                      <span className={`text-[9px] uppercase tracking-[0.15em] ${deckStyle.label}`}>{el.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isYesNo && !isComplex && reading.elements.length > 1 && (
            <div className="flex flex-wrap justify-center gap-5 md:gap-8">
              {reading.elements.map((el, i) => (
                <div key={i} className={`transition-all duration-500 ${dealt && !shuffling ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="flex flex-col items-center gap-1">
                    <CardFace el={el} size={reading.elements.length <= 3 ? "lg" : "md"} deck={deckStyle} />
                    <span className={`text-[9px] uppercase tracking-[0.15em] ${deckStyle.label}`}>{el.position}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {reading.elements.length === 1 && (
            <div className={`flex justify-center transition-all duration-500 ${dealt && !shuffling ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
              <div className="flex flex-col items-center gap-1">
                <CardFace el={reading.elements[0]} size="lg" deck={deckStyle} />
                <span className={`text-[9px] uppercase tracking-[0.15em] ${deckStyle.label}`}>{reading.elements[0].position}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {reading.verdict && (
        <div className="mx-auto max-w-lg px-5 pb-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">Verdict</p>
            <VerdictBadge answer={reading.verdict.answer} />
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">{reading.verdict.explanation}</p>
          </div>
        </div>
      )}

      {reading.interpretation && (
        <div className="mx-auto max-w-2xl px-5 pb-12">
          <div className="rounded-xl border border-amber-500/10 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-5 sm:p-6">
            <h3 className="mb-3 text-center text-xs uppercase tracking-[0.2em] text-amber-400/50">Interpretation</h3>
            <p className="text-center text-sm leading-relaxed text-zinc-300">{reading.interpretation}</p>
          </div>
        </div>
      )}

      {deck.length > 1 && (
        <div className="mx-auto max-w-5xl px-5 pb-16">
          <button onClick={() => setShowDeck(!showDeck)} className="mx-auto mb-6 flex items-center gap-2 text-xs text-zinc-600 transition hover:text-zinc-400">
            {showDeck ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {showDeck ? "Hide" : "Browse"} full {displayName} ({deck.length})
          </button>
          {showDeck && (
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {deck.map((c, i) => (
                <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-2 py-2 text-center transition hover:border-white/10">
                  <div className="text-lg leading-none">{c.glyph}</div>
                  <div className="mt-1 text-[9px] font-semibold leading-tight text-white/80">{c.title}</div>
                  <div className="mt-0.5 text-[8px] leading-tight text-zinc-600">{c.position}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
