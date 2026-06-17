import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Book, ChevronDown, ChevronUp, History, LayoutList } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { KIPPER_CARDS, SPREAD_DEFS, shuffleArray, getAllKipperCards, type KipperCardDef, type SpreadDef } from "./kipperData";
import { getKipperHistorySections } from "./kipperHistory";

const BG = "#0f0d12";
const ACCENT = "#6b4c7a";
const GOLD = "#b8963c";
const CREAM = "#e8dcc8";

interface SpreadElement {
  card: KipperCardDef;
  reversed: boolean;
  position: string;
}

function KoanKipperCard({ card, reversed, position }: { card: KipperCardDef; reversed: boolean; position?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-lg border-2 p-3 transition-all duration-300 ${reversed ? "border-red-900/25 bg-red-950/6" : "border-purple-900/25 bg-purple-950/6"}`}
      style={{ boxShadow: reversed ? "inset 0 0 20px rgba(100,0,0,0.06)" : "inset 0 0 20px rgba(107,76,122,0.06)" }}
    >
      <div className={`text-center text-3xl ${reversed ? "rotate-180 scale-x-[-1]" : ""}`}>{card.glyph}</div>
      <h3 className="mt-1 text-center font-serif text-xs font-bold text-white/80">{card.name}</h3>
      <p className="text-center text-[6px] text-zinc-600 italic leading-tight mt-0.5">{card.nameGerman}</p>
      <p className="text-center text-[7px] font-mono text-zinc-700 mt-0.5">#{card.id}</p>
      {position && (
        <p className="mt-1 text-center text-[7px] uppercase tracking-[0.15em]" style={{ color: ACCENT + "80" }}>{position}</p>
      )}
      {reversed && (
        <div className="mt-1 flex items-center justify-center gap-1 rounded border border-red-900/15 bg-red-950/12 px-1.5 py-0.5">
          <span className="text-[6px] text-red-400/50">Reversed</span>
        </div>
      )}
      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
        {card.keywords.slice(0, 3).map(kw => (
          <span key={kw} className="rounded border border-white/[0.03] bg-white/[0.02] px-1 py-0.5 text-[6px] text-zinc-600">{kw}</span>
        ))}
      </div>
    </div>
  );
}

function KipperCardDetail({ card }: { card: KipperCardDef }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="inline-block text-5xl">{card.glyph}</div>
        <h2 className="mt-3 font-serif text-2xl font-bold text-white">{card.name}</h2>
        <p className="text-xs text-zinc-500 italic">{card.nameGerman} &middot; Card {card.id} of 36</p>
      </div>
      <div className="rounded-xl border p-5" style={{ borderColor: ACCENT + "30", background: `linear-gradient(180deg,${ACCENT}08,transparent)` }}>
        <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Upright Meaning</h3>
        <p className="text-sm leading-relaxed text-zinc-300">{card.meaning}</p>
      </div>
      <div className="rounded-xl border border-red-900/20 p-5 bg-red-950/8">
        <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-red-400/60">Reversed Meaning</h3>
        <p className="text-sm leading-relaxed text-zinc-400">{card.reversedMeaning}</p>
      </div>
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
        <h3 className="mb-1.5 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Symbolism</h3>
        <p className="text-xs leading-relaxed text-zinc-400">{card.symbolism}</p>
      </div>
      {card.timing && (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
          <h3 className="mb-1.5 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Timing</h3>
          <p className="text-xs leading-relaxed text-zinc-400">{card.timing}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {card.keywords.map(kw => (
          <span key={kw} className="rounded-full border px-2 py-0.5 text-[9px] text-zinc-500" style={{ borderColor: ACCENT + "30" }}>{kw}</span>
        ))}
      </div>
    </div>
  );
}

function KipperSpreadView({ spread }: { spread: SpreadDef }) {
  const [elements, setElements] = useState<SpreadElement[]>([]);
  const [dealt, setDealt] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const doReading = useCallback(() => {
    setShuffling(true);
    setDealt(false);
    setSelectedIdx(null);
    setTimeout(() => {
      const cards = shuffleArray(KIPPER_CARDS).slice(0, spread.cardCount);
      const els = cards.map((c, i) => ({
        card: c,
        reversed: Math.random() > 0.7,
        position: spread.positions[i] ?? `Position ${i + 1}`,
      }));
      setElements(els);
      setShuffling(false);
      setTimeout(() => setDealt(true), 100);
    }, 800);
  }, [spread]);

  return (
    <div>
      <div className="mx-auto max-w-lg px-5 pt-3 pb-2 text-center">
        <p className="text-[10px] text-zinc-600">{spread.description}</p>
      </div>
      <div className="flex justify-center px-5 py-6">
        <button onClick={doReading} disabled={shuffling}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm transition disabled:opacity-40"
          style={{ background: ACCENT + "18", color: CREAM }}
        >
          {shuffling ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border border-purple-300 border-t-transparent" /> Shuffling...</>
            : <><Sparkles className="h-3.5 w-3.5" /> {elements.length === 0 ? "Draw Cards" : "Draw Again"}</>}
        </button>
      </div>
      {elements.length > 0 && (
        <div className="mx-auto max-w-5xl px-5 pb-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {elements.map((el, i) => (
              <div key={i} className={`transition-all duration-500 cursor-pointer ${dealt && !shuffling ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
                onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
              >
                <KoanKipperCard card={el.card} reversed={el.reversed} position={el.position} />
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedIdx !== null && elements[selectedIdx] && (
        <div className="mx-auto max-w-lg px-5 pb-12">
          <KipperCardDetail card={elements[selectedIdx].card} />
        </div>
      )}
      {elements.length > 0 && !shuffling && (
        <div className="mx-auto max-w-2xl px-5 pb-12">
          <div className="rounded-xl border p-5 sm:p-6" style={{ borderColor: ACCENT + "15", background: `linear-gradient(135deg,${ACCENT}08,transparent)` }}>
            <h3 className="mb-4 text-center text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT + "70" }}>Interpretation</h3>
            <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
              {elements.map((el, i) => (
                <div key={i}>
                  <p className="font-semibold text-purple-300/70 mb-0.5">{el.position}: {el.card.name} {el.reversed ? "(reversed)" : ""}</p>
                  <p className="text-zinc-400">{el.reversed ? el.card.reversedMeaning : el.card.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KipperBrowseView() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = selectedId ? KIPPER_CARDS.find(c => c.id === selectedId) : null;
  return (
    <div>
      {selected ? (
        <div className="mx-auto max-w-lg px-5 pb-12">
          <button onClick={() => setSelectedId(null)}
            className="mb-4 inline-flex items-center gap-1 text-[10px] text-zinc-600 transition hover:text-zinc-400"
          ><ArrowLeft className="h-3 w-3" /> All Cards</button>
          <KipperCardDetail card={selected} />
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-5 pb-16">
          <div className="mb-4 text-center">
            <p className="text-[10px] text-zinc-600">All 36 Kipper cards. Tap any card for its full meaning.</p>
          </div>
          <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
            {KIPPER_CARDS.map(c => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-2 text-center transition hover:border-white/10"
              >
                <div className="text-2xl">{c.glyph}</div>
                <div className="mt-1 text-[9px] font-semibold leading-tight text-white/80">{c.name}</div>
                <div className="text-[6px] text-zinc-600 italic">{c.nameGerman}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KipperSpreadSelector({ current, onSelect }: { current: string; onSelect: (t: SpreadDef) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {SPREAD_DEFS.map(s => (
        <button key={s.type} onClick={() => onSelect(s)}
          className={`rounded-full border px-4 py-1.5 text-xs transition ${s.type === current ? "border-purple-500/30 bg-purple-500/8 text-purple-300" : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}
        >{s.name}</button>
      ))}
    </div>
  );
}

function KipperHistorySection() {
  const [open, setOpen] = useState(false);
  const history = getKipperHistorySections();
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5" style={{ color: ACCENT + "90" }} />
          <span className="text-xs font-semibold text-white/70">History of Kipper Cards</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          {history.map((section, i) => (
            <div key={i}>
              <h4 className="font-bold text-white/60 mb-1">{section.title}</h4>
              {section.paragraphs.map((p, j) => <p key={j} className={j > 0 ? "mt-2" : ""}>{p}</p>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function KipperPage() {
  const [view, setView] = useState<"read" | "browse">("read");
  const [spreadType, setSpreadType] = useState(SPREAD_DEFS[0].type);
  const currentSpread = SPREAD_DEFS.find(s => s.type === spreadType) ?? SPREAD_DEFS[0];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg,${BG},#08070a)` }}>
      <SeoHead title="Kipper Cards · 36-Card Bavarian Cartomancy" description="36-card German Kipper system from 19th-century Bavaria. direct, practical readings for everyday questions." path="/consult/kipper" />

      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" /> All methods
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setView("read")}
              className={`inline-flex items-center gap-1 text-[10px] transition ${view === "read" ? "text-purple-300" : "text-zinc-600 hover:text-zinc-400"}`}
            ><Sparkles className="h-3 w-3" /> Read</button>
            <button onClick={() => setView("browse")}
              className={`inline-flex items-center gap-1 text-[10px] transition ${view === "browse" ? "text-purple-300" : "text-zinc-600 hover:text-zinc-400"}`}
            ><Book className="h-3 w-3" /> Browse</button>
          </div>
        </div>
      </div>

      <div className="border-b border-white/5" style={{ background: ACCENT + "06" }}>
        <div className="mx-auto max-w-5xl px-5 py-4 text-center">
          <div className="text-4xl">🎴</div>
          <h2 className="mt-1 text-sm font-semibold text-white/90">Kipper Cards</h2>
          <p className="text-[10px] text-zinc-500">19th-century Bavarian cartomancy &middot; 36 cards</p>
          <p className="mt-1 text-[10px] italic text-zinc-600 max-w-md mx-auto">Direct, practical readings for everyday questions about love, work, family, and finances. A cousin of Lenormand with its own distinct voice.</p>
        </div>
      </div>

      {view === "read" && (
        <div className="border-b border-white/5 py-4">
          <KipperSpreadSelector current={spreadType} onSelect={(s) => setSpreadType(s.type)} />
          <KipperSpreadView spread={currentSpread} />
        </div>
      )}

      {view === "browse" && <KipperBrowseView />}

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-8">
        <KipperHistorySection />
      </div>
    </div>
  );
}
