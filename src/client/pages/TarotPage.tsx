import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp, Book, Wand2 } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  getTraditionalReading,
  getTraditionalDeck,
  getSpreads,
  TAROT_DECKS,
} from "./traditionalReadings";
import type { ReadingResult, SpreadElement, TarotDeckDef } from "./traditionalReadings";

/* ─── Per-deck color system ─── */

const DECK_HUES: Record<string, number> = {
  rws: 42, thoth: 270, marseille: 30, visconti: 25,
  "golden-dawn": 45, "wild-unknown": 200, shadowscapes: 220,
  "modern-witch": 340, "light-seer": 48, "ethereal-visions": 350,
  "prisma-visions": 190, "cosmic-tarot": 240, haindl: 120,
  "osho-zen": 80, motherpeace: 30, "deviant-moon": 260,
  "tarot-divine": 300, "true-black": 0, lumina: 180,
  "druid-craft": 140, wildwood: 110, hermetic: 45,
  "victorian-romantic": 340, "mystic-mondays": 280,
  linestrider: 200, "star-spinner": 360, "santa-muerte": 15,
  zombie: 60, "bohemian-gothic": 330, "anna-k": 30,
  "holy-light": 50, "mystic-sea": 220, "hidden-realm": 260,
  "golden-thread": 200, "waking-wild": 150,
};

interface DeckColors {
  faceBg: string; faceBorder: string; faceInnerBg: string; faceInnerBorder: string;
  backBg: string; backBorder: string; backInnerBg: string; backInnerBorder: string;
  pattern: string; titleColor: string; posColor: string; labelColor: string; revColor: string;
}

function deckColors(deckId: string): DeckColors {
  const h = DECK_HUES[deckId] ?? 42;
  if (deckId === "true-black") return {
    faceBg: "linear-gradient(180deg,#1a1a1a,#0d0d0d)", faceBorder: "1px solid #333",
    faceInnerBg: "rgba(255,255,255,0.03)", faceInnerBorder: "1px solid rgba(255,255,255,0.06)",
    backBg: "#000", backBorder: "1px solid #222", backInnerBg: "rgba(255,255,255,0.02)",
    backInnerBorder: "1px solid rgba(255,255,255,0.04)", pattern: "rgba(255,255,255,0.06)",
    titleColor: "#ccc", posColor: "rgba(255,255,255,0.3)", labelColor: "rgba(255,255,255,0.15)", revColor: "rgba(255,80,80,0.7)",
  };
  return {
    faceBg: `linear-gradient(180deg,hsl(${h},15%,92%),hsl(${h},12%,85%))`,
    faceBorder: `2px solid hsl(${h},40%,50%)`,
    faceInnerBg: `hsla(${h},20%,95%,0.7)`,
    faceInnerBorder: `1px solid hsla(${h},30%,45%,0.25)`,
    backBg: `hsl(${h},30%,10%)`,
    backBorder: `1px solid hsl(${h},35%,25%)`,
    backInnerBg: `hsla(${h},20%,15%,0.5)`,
    backInnerBorder: `1px solid hsla(${h},20%,20%,0.3)`,
    pattern: `hsla(${h+30},50%,60%,0.12)`,
    titleColor: `hsl(${h},10%,30%)`,
    posColor: `hsla(${h},25%,45%,0.6)`,
    labelColor: `hsla(${h+30},30%,55%,0.5)`,
    revColor: "rgba(220,40,40,0.8)",
  };
}

/* ─── Card components ─── */

type CardSize = "lg" | "md" | "sm";
const CARD_W: Record<CardSize, string> = { lg: "w-44", md: "w-36", sm: "w-28" };

function CardFace({ el, deckId, size = "md" }: { el: SpreadElement; deckId: string; size?: CardSize }) {
  const c = deckColors(deckId);
  return (
    <div className={`relative ${CARD_W[size]} ${el.reversed ? "rotate-180" : ""}`} style={{ aspectRatio: "2.5/3.5" }}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-lg shadow-xl shadow-black/40" style={{ border: c.faceBorder, background: c.faceBg }}>
        <div className="mx-1.5 my-1.5 flex-1 rounded-md" style={{ background: c.faceInnerBg, border: c.faceInnerBorder }}>
          <div className="flex h-full flex-col items-center justify-between p-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.posColor }}>{el.position}</span>
            <span className="text-4xl leading-none">{el.glyph}</span>
            <span className="text-center text-[10px] font-bold leading-tight" style={{ color: c.titleColor }}>{el.title}</span>
            {el.reversed && <span className="text-[7px] uppercase tracking-wider" style={{ color: c.revColor }}>Reversed</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardBack({ deckId, i }: { deckId: string; i: number }) {
  const c = deckColors(deckId);
  return (
    <div
      className="absolute inset-0 rounded-lg shadow-lg shadow-black/50"
      style={{ border: c.backBorder, background: c.backBg, transform: `rotate(${(i-2.5)*2}deg) translateY(${i}px)`, zIndex: i }}
    >
      <div className="flex h-full items-center justify-center p-2">
        <div
          className="h-full w-full rounded-md"
          style={{
            border: c.backInnerBorder, background: c.backInnerBg,
            backgroundImage: [
              `linear-gradient(45deg,${c.pattern} 25%,transparent 25%)`,
              `linear-gradient(-45deg,${c.pattern} 25%,transparent 25%)`,
              `linear-gradient(45deg,transparent 75%,${c.pattern} 75%)`,
              `linear-gradient(-45deg,transparent 75%,${c.pattern} 75%)`,
            ].join(","),
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Verdict Badge ─── */

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

/* ─── Spread Layouts ─── */

function CelticCross({ elements, deckId }: { elements: SpreadElement[]; deckId: string }) {
  const c = (i: number) => elements[i];
  const cc = deckColors(deckId);
  return (
    <div className="relative mx-auto hidden md:block" style={{ width: 500, height: 460 }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1"><CardFace el={c(2)} deckId={deckId} size="sm" /><span className="text-[7px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>Foundation</span></div>
        </div>
        <div className="absolute -left-28 top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1"><CardFace el={c(4)} deckId={deckId} size="sm" /><span className="text-[7px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>Recent Past</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1"><CardFace el={c(0)} deckId={deckId} size="sm" /><span className="text-[7px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>Present</span></div>
          <div className="flex flex-col items-center gap-1">
            <div className="relative"><CardFace el={c(1)} deckId={deckId} size="sm" /><div className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold text-rose-500/50">⨯</span></div></div>
            <span className="text-[7px] uppercase tracking-[0.15em] text-rose-500/50">Challenge</span>
          </div>
        </div>
        <div className="absolute -right-28 top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1"><CardFace el={c(5)} deckId={deckId} size="sm" /><span className="text-[7px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>Near Future</span></div>
        </div>
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1"><CardFace el={c(3)} deckId={deckId} size="sm" /><span className="text-[7px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>Crown</span></div>
        </div>
      </div>
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[6,7,8,9].map(i => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <CardFace el={c(i)} deckId={deckId} size="sm" />
            <span className="text-[6px] uppercase tracking-[0.15em] text-center leading-tight" style={{color:cc.labelColor}}>{elements[i].position.replace(/\s*&\s*/,"\n")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorseshoeArc({ elements, deckId }: { elements: SpreadElement[]; deckId: string }) {
  const cc = deckColors(deckId);
  const slots = [
    {i:0,x:-120,y:-80},{i:1,x:-40,y:-100},{i:2,x:40,y:-100},{i:3,x:120,y:-80},
    {i:4,x:-120,y:130},{i:5,x:-40,y:150},{i:6,x:40,y:150},
  ];
  return (
    <div className="relative mx-auto hidden md:block" style={{ width: 420, height: 340 }}>
      {slots.map(p => (
        <div key={p.i} className="absolute flex flex-col items-center gap-1" style={{left:`calc(50%+${p.x}px)`,top:`calc(50%+${p.y}px)`,transform:"translate(-50%,-50%)"}}>
          <CardFace el={elements[p.i]} deckId={deckId} size="sm" />
          <span className="text-[7px] uppercase tracking-[0.15em] text-center max-w-[80px] leading-tight" style={{color:cc.labelColor}}>{elements[p.i].position}</span>
        </div>
      ))}
    </div>
  );
}

function MobileGrid({ elements, dealt, shuffling, deckId }: { elements: SpreadElement[]; dealt: boolean; shuffling: boolean; deckId: string }) {
  return (
    <div className="md:hidden grid gap-3 grid-cols-2 sm:grid-cols-3">
      {elements.map((el,i) => (
        <div key={i} className={`transition-all duration-500 ${dealt&&!shuffling?"opacity-100":"opacity-0"}`} style={{transitionDelay:`${i*80}ms`}}>
          <div className="flex flex-col items-center">
            <CardFace el={el} deckId={deckId} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Deck Gallery ─── */

function DeckPreview({ deck, onSelect }: { deck: TarotDeckDef; onSelect: (id: string) => void }) {
  const c = deckColors(deck.id);
  return (
    <button onClick={() => onSelect(deck.id)} className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 transition hover:border-white/10 hover:bg-white/[0.03]">
      <div className="relative h-20 w-16 sm:h-24 sm:w-20" style={{ perspective: "600px" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-lg shadow-lg shadow-black/50 transition group-hover:shadow-xl group-hover:shadow-black/60"
            style={{
              border: c.backBorder, background: c.backBg,
              transform: `rotate(${(i-1)*3}deg) translateY(${i*2}px)`,
              zIndex: 3-i,
            }}
          >
            <div className="flex h-full items-center justify-center p-1.5">
              <div
                className="h-full w-full rounded-[4px]"
                style={{
                  border: c.backInnerBorder,
                  backgroundImage: [
                    `linear-gradient(45deg,${c.pattern} 25%,transparent 25%)`,
                    `linear-gradient(-45deg,${c.pattern} 25%,transparent 25%)`,
                    `linear-gradient(45deg,transparent 75%,${c.pattern} 75%)`,
                    `linear-gradient(-45deg,transparent 75%,${c.pattern} 75%)`,
                  ].join(","),
                  backgroundSize: "10px 10px",
                  backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold leading-tight text-white/80">{deck.name}</div>
        <div className="mt-0.5 text-[9px] text-zinc-600">{deck.artist}</div>
        <div className="mt-1">
          <span className="inline-block rounded-full border px-2 py-0.5 text-[7px] uppercase tracking-wider"
            style={{
              borderColor: `hsla(${DECK_HUES[deck.id]??42},40%,50%,0.3)`,
              color: `hsla(${DECK_HUES[deck.id]??42},40%,60%,0.7)`,
            }}
          >
            {deck.tradition}
          </span>
        </div>
      </div>
    </button>
  );
}

function DeckGallery({ decks, onSelect }: { decks: TarotDeckDef[]; onSelect: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-8">
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-white/90">Choose Your Deck</h2>
        <p className="mt-1 text-xs text-zinc-600">{decks.length} tarot decks from 6 centuries of tradition</p>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {decks.map(d => <DeckPreview key={d.id} deck={d} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

/* ─── Reading View ─── */

function ReadingView({ deckId, deck }: { deckId: string; deck: TarotDeckDef }) {
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [dealt, setDealt] = useState(false);
  const [spreadId, setSpreadId] = useState("three-card");
  const spreads = getSpreads("tarot");

  const doReading = useCallback((sid?: string) => {
    const s = sid ?? spreadId;
    setShuffling(true);
    setDealt(false);
    const r = getTraditionalReading("tarot", deck.name, s, deckId);
    setTimeout(() => {
      setReading(r);
      setShuffling(false);
      setTimeout(() => setDealt(true), 100);
    }, 900);
  }, [deckId, spreadId, deck.name]);

  useEffect(() => {
    const initial = spreads[0]?.id ?? "single";
    setSpreadId(initial);
    const r = getTraditionalReading("tarot", deck.name, initial, deckId);
    setReading(r);
    setDealt(true);
  }, [deckId]);

  if (!reading) return <div className="flex min-h-[30vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" /></div>;

  const currentSpread = spreads.find(s => s.id === spreadId);
  const isYesNo = currentSpread?.layout === "yes-no";
  const isComplex = reading.elements.length === 7 || reading.elements.length === 10;
  const cc = deckColors(deckId);

  return (
    <div>
      {/* Spread selector */}
      {spreads.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {spreads.map(s => (
            <button key={s.id} onClick={() => { setSpreadId(s.id); doReading(s.id); }}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${spreadId===s.id ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}
            >{s.name}</button>
          ))}
        </div>
      )}

      {currentSpread && (
        <div className="mx-auto max-w-lg px-5 pt-3 text-center">
          <p className="text-[10px] text-zinc-600">{currentSpread.description}</p>
          <p className="mt-0.5 text-[9px] italic text-zinc-700">Best for: {currentSpread.bestFor}</p>
        </div>
      )}

      {/* Shuffle + Draw */}
      <div className="mx-auto max-w-lg px-5 py-6 text-center">
        <div className={`relative mx-auto h-32 w-28 sm:h-36 sm:w-32 transition-all duration-700 ${shuffling ? "animate-[shake_0.3s_ease-in-out_infinite]" : ""}`}>
          {Array.from({ length: 6 }).map((_, i) => <CardBack key={i} deckId={deckId} i={i} />)}
        </div>
        <p className="mt-2 text-xs text-zinc-600">78 cards</p>
        <div className="mt-4">
          <button onClick={() => doReading()} disabled={shuffling}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-6 py-3 text-sm text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-40"
          >
            {shuffling ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border border-amber-300 border-t-transparent" /> Shuffling...</>
              : <><Sparkles className="h-3.5 w-3.5" /> Shuffle &amp; Draw</>}
          </button>
        </div>
      </div>

      {/* Cards */}
      {reading.elements.length > 0 && (
        <div className="mx-auto max-w-5xl px-5 pb-6">
          {reading.elements.length === 10 && <><CelticCross elements={reading.elements} deckId={deckId} /><MobileGrid elements={reading.elements} dealt={dealt} shuffling={shuffling} deckId={deckId} /></>}
          {reading.elements.length === 7 && <><HorseshoeArc elements={reading.elements} deckId={deckId} /><MobileGrid elements={reading.elements} dealt={dealt} shuffling={shuffling} deckId={deckId} /></>}
          {isYesNo && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-5 md:gap-8">
                {reading.elements.map((el,i) => (
                  <div key={i} className={`transition-all duration-500 ${dealt&&!shuffling?"translate-y-0 opacity-100":"translate-y-6 opacity-0"}`} style={{transitionDelay:`${i*120}ms`}}>
                    <div className="flex flex-col items-center gap-1"><CardFace el={el} deckId={deckId} size="lg" /><span className="text-[9px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>{el.position}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isYesNo && !isComplex && reading.elements.length > 1 && (
            <div className="flex flex-wrap justify-center gap-5 md:gap-8">
              {reading.elements.map((el,i) => (
                <div key={i} className={`transition-all duration-500 ${dealt&&!shuffling?"translate-y-0 opacity-100":"translate-y-6 opacity-0"}`} style={{transitionDelay:`${i*120}ms`}}>
                  <div className="flex flex-col items-center gap-1"><CardFace el={el} deckId={deckId} size={reading.elements.length<=3?"lg":"md"} /><span className="text-[9px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>{el.position}</span></div>
                </div>
              ))}
            </div>
          )}
          {reading.elements.length === 1 && (
            <div className={`flex justify-center transition-all duration-500 ${dealt&&!shuffling?"translate-y-0 opacity-100":"translate-y-6 opacity-0"}`}>
              <div className="flex flex-col items-center gap-1"><CardFace el={reading.elements[0]} deckId={deckId} size="lg" /><span className="text-[9px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>{reading.elements[0].position}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Verdict */}
      {reading.verdict && (
        <div className="mx-auto max-w-lg px-5 pb-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">Verdict</p>
            <VerdictBadge answer={reading.verdict.answer} />
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">{reading.verdict.explanation}</p>
          </div>
        </div>
      )}

      {/* Interpretation */}
      {reading.interpretation && (
        <div className="mx-auto max-w-2xl px-5 pb-12">
          <div className="rounded-xl border border-amber-500/10 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-5 sm:p-6">
            <h3 className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-amber-400/50">Interpretation</h3>
            <div className="text-left text-sm leading-relaxed text-zinc-300 space-y-2">
              {reading.interpretation.split("\n").map((line, j) => {
                if (line.startsWith("══") || line.startsWith("═══")) {
                  return <hr key={j} className="border-amber-700/20 my-3" />;
                }
                if (line === "") return null;
                if (line === line.toUpperCase() && line.length > 3 && !line.includes(" ")) {
                  return null;
                }
                const isHeader = !line.includes("Keywords") && !line.includes("Verdict:") &&
                  (line.endsWith("Spread") || line.match(/^[A-Z][a-z]+ [A-Z][a-z]/) && !line.includes("\u2014"));
                return (
                  <p key={j} className={isHeader ? "text-base font-semibold text-amber-300/60 mt-3 mb-1" : "leading-relaxed"}>
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Card Browser ─── */

function CardBrowser({ deckId }: { deckId: string }) {
  const [cards, setCards] = useState<SpreadElement[]>([]);
  const [filter, setFilter] = useState<string>("all");
  useEffect(() => { setCards(getTraditionalDeck("tarot", deckId)); }, [deckId]);
  if (cards.length === 0) return null;

  const suits = ["All","Major Arcana","Wands","Cups","Swords","Pentacles","Disks","Batons","Coupes","Épées","Deniers"];
  const filtered = filter === "all" ? cards : cards.filter(c => c.position.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {suits.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-[9px] uppercase tracking-wider transition ${filter===s ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-zinc-600 hover:border-white/20"}`}
          >{s}</button>
        ))}
      </div>
      <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {filtered.map((c, i) => (
          <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-2 py-3 text-center transition hover:border-white/10">
            <div className="flex justify-center"><CardFace el={{...c, glyph: "🃏", reversed: false}} deckId={deckId} size="sm" /></div>
            <div className="mt-1.5 text-[9px] font-semibold leading-tight text-white/80">{c.title}</div>
            <div className="mt-0.5 text-[8px] leading-tight text-zinc-600">{c.position}</div>
            {c.keywords && <div className="mt-1 text-[6px] leading-tight text-zinc-500">{c.keywords}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export function TarotPage() {
  const [view, setView] = useState<"gallery" | "read" | "browse">("gallery");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  const selectedDeck = TAROT_DECKS.find(d => d.id === selectedDeckId);

  const handleSelect = useCallback((id: string) => {
    setSelectedDeckId(id);
    setView("read");
  }, []);

  const goToGallery = useCallback(() => {
    setView("gallery");
    setSelectedDeckId(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900">
      <SeoHead title="Tarot · Deck Library & Readings" description="35 tarot decks with full traditional spreads — choose your deck and read the cards" path="/consult/tarot" />

      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <button onClick={view === "gallery" ? undefined : goToGallery}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {view === "gallery" ? <Link to="/consult">All methods</Link> : "All Decks"}
          </button>
          <span className="text-xs text-zinc-700">{view === "gallery" ? "Tarot" : selectedDeck?.name ?? "Tarot"}</span>
        </div>
      </div>

      {/* Deck detail header when reading/browsing */}
      {selectedDeck && view !== "gallery" && (
        <div className="border-b border-white/5 bg-white/[0.01]">
          <div className="mx-auto max-w-5xl px-5 py-4">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4">
              <div className="relative h-16 w-12 flex-shrink-0">
                {Array.from({ length: 3 }).map((_, i) => <CardBack key={i} deckId={selectedDeck.id} i={i} />)}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-sm font-semibold text-white/90">{selectedDeck.name}</h2>
                <p className="text-[10px] text-zinc-500">{selectedDeck.artist} · {selectedDeck.year}</p>
                <p className="mt-1 text-[10px] italic text-zinc-600">{selectedDeck.description}</p>
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-block rounded-full border border-amber-700/30 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-amber-400/70">{selectedDeck.tradition}</span>
                  <button onClick={() => setView("browse")}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[9px] uppercase tracking-wider transition ${view==="browse" ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-zinc-500 hover:border-white/20"}`}
                  ><Book className="h-3 w-3" />Browse</button>
                  <button onClick={() => setView("read")}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[9px] uppercase tracking-wider transition ${view==="read" ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-zinc-500 hover:border-white/20"}`}
                  ><Wand2 className="h-3 w-3" />Read</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View content */}
      {view === "gallery" && <DeckGallery decks={TAROT_DECKS} onSelect={handleSelect} />}
      {view === "read" && selectedDeck && <ReadingView deckId={selectedDeck.id} deck={selectedDeck} />}
      {view === "browse" && selectedDeckId && <CardBrowser deckId={selectedDeckId} />}
    </div>
  );
}
