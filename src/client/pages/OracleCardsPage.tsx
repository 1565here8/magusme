import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp, Book, Wand2, History } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { ORACLE_DECKS, getOracleDeck, getOracleDecks } from "../data/oracleDecks";
import type { OracleDeckDef } from "../data/oracleDecks";
import { getOracleCardsForDeck } from "./oracleCardsData";
import { getOracleHistorySections } from "./oracleCardsHistory";

/* ─── Per-deck color system ─── */

const DECK_HUES: Record<string, number> = {
  "wisdom-of-the-oracle": 42,
  "work-your-light": 280,
  moonology: 220,
  "starseed-oracle": 250,
  "sacred-rebels": 340,
  "keepers-of-the-light": 45,
  "angel-answers": 200,
  "crystal-spirits": 160,
  "spirit-animal-oracle": 120,
  "wild-unknown-animal": 0,
  "wild-unknown-archetypes": 0,
  "divine-feminine-oracle": 330,
  "universe-has-your-back": 50,
  "rose-oracle": 350,
  "healing-with-the-angels": 200,
  "archangel-oracle": 45,
  "rumi-oracle": 30,
  "sacred-self-care": 180,
  "enchanted-map": 42,
  "ancient-stones": 110,
  "light-seer-oracle": 48,
  "wisdom-ancestors": 25,
};

interface DeckColors {
  faceBg: string; faceBorder: string; faceInnerBg: string; faceInnerBorder: string;
  backBg: string; backBorder: string; backInnerBg: string; backInnerBorder: string;
  pattern: string; titleColor: string; posColor: string; labelColor: string; revColor: string;
}

function deckColors(deckId: string): DeckColors {
  const h = DECK_HUES[deckId] ?? 42;
  if (deckId === "wild-unknown-animal" || deckId === "wild-unknown-archetypes") return {
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

/* ─── Oracle card interface for readings ─── */

interface OracleSpreadElement {
  glyph: string;
  title: string;
  meaning: string;
  position: string;
  reversed: boolean;
  keywords: string;
  symbolism: string;
}

interface OracleReadingResult {
  deckName: string;
  spreadName: string;
  elements: OracleSpreadElement[];
  interpretation: string;
}

interface OracleSpreadDef {
  id: string;
  name: string;
  cardCount: number;
  description: string;
  positions: string[];
  isYesNo: boolean;
}

const ORACLE_SPREADS: OracleSpreadDef[] = [
  { id: "single", name: "Single Draw", cardCount: 1, description: "A single card for focused guidance on your question. Quick, direct, clear.", positions: ["Guidance"], isYesNo: false },
  { id: "three-card", name: "Three Card", cardCount: 3, description: "Past, present, future or situation, obstacle, guidance depending on your question.", positions: ["Past", "Present", "Future"], isYesNo: false },
  { id: "five-card", name: "Five Card Cross", cardCount: 5, description: "The heart of the matter surrounded by past influences, future direction, conscious intention, and hidden factors.", positions: ["Heart", "Past", "Future", "Conscious", "Hidden"], isYesNo: false },
  { id: "seven-card", name: "Seven Card Horseshoe", cardCount: 7, description: "A horseshoe arc showing the flow of a situation from past through present to outcome.", positions: ["Past", "Present", "Hidden", "Obstacle", "Advice", "Near Future", "Outcome"], isYesNo: false },
  { id: "yes-no", name: "Yes or No", cardCount: 3, description: "Three cards for direct yes or no answers. The balance of positive and negative cards reveals the answer.", positions: ["First", "Second", "Third"], isYesNo: true },
];

function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOracleReading(deckId: string, deckName: string, spread: OracleSpreadDef): OracleReadingResult {
  const deck = getOracleDeck(deckId);
  if (!deck) {
    return {
      deckName, spreadName: spread.name, elements: [], interpretation: "Deck not found."
    };
  }

  const allCards = getOracleCardsForDeck(deckId);
  const selected = shuffleArray(allCards).slice(0, spread.cardCount);

  const elements: OracleSpreadElement[] = selected.map((card, i) => {
    const reversed = deck.hasReversals ? Math.random() > 0.7 : false;
    return {
      glyph: getGlyph(deckId, i + 1),
      title: card.title.split("|")[1] ?? card.title,
      meaning: reversed && card.reversed ? card.reversed : card.upright,
      position: spread.positions[i] ?? `Position ${i + 1}`,
      reversed,
      keywords: card.keywords?.join(", ") ?? "",
      symbolism: card.symbolism ?? "",
    };
  });

  const interpretation = elements.map((el, i) => {
    const revText = el.reversed ? " (reversed)" : "";
    return `${el.position}: ${el.title}${revText}\n${el.meaning}`;
  }).join("\n\n");

  let verdict = "";
  if (spread.isYesNo) {
    const positive = elements.filter(e => !e.reversed).length;
    verdict = positive >= 2 ? "Yes" : positive === 0 ? "No" : "Mixed";
  }

  return { deckName, spreadName: spread.name, elements, interpretation: verdict ? interpretation + `\n\nVerdict: ${verdict}` : interpretation };
}

function getGlyph(deckId: string, cardNum: number): string {
  const glyphs: Record<string, string[]> = {
    "wisdom-of-the-oracle": ["🔮","🌿","🌉","🌸","🔥","🌊","🌙","⭐","🕊","🌳","🏔","🌺","🦋","🌻","🍃","💎","🌈","🌌","🎭","⏳","🗝","🪞","⚖","🌱","🕯","🎵","🌸","🪨","🌊","🔥","🌙","⭐","🕊","🌳","🏔","🌺","🦋","🌻","🍃","💎","🌈","🌌","🎭","⏳","🗝","🪞","⚖","🌱","🕯","🎵","📿","🪶"],
    "work-your-light": ["🕯","🌸","🦋","🌙","⭐","🌊","🔥","🌿","💎","🕊","🌈","🌻","🍃","🎵","🪞","🗝","🌌","🏔","🌺","🪨","🌱","🎭","⏳","⚖","📿","🪶","🌳","🔮","🌉","🌟","✨","🪐","🌠","🌄","🌅","🌇","🌃","🌉","🌊","🔥","🌿","💎","🕊","🌈"],
    moonology: ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","🌝","🌞","⭐","🌟","✨","💫","🌠","🌌","🌃","🌄","🌅","🌇","🌉","🌊","🔥","🌿","💎","🕊","🌈","🌻","🍃","🎵","🪞","🗝","🌺","🪨","🌱","🎭","⏳","⚖","📿","🪶"],
  };
  const deckGlyphs = glyphs[deckId];
  if (deckGlyphs && cardNum <= deckGlyphs.length) return deckGlyphs[cardNum - 1];
  return ["🔮","✨","🌙","⭐","🕊","🌿","🔥","🌊","💎","🌸","🦋","🌈","🍃","🎵","🪞","🗝","🌺","🪨","🌱","🎭","⏳","⚖","📿","🪶","🌳","🌻","🌌","🌠","🌄","🌅"][cardNum % 30];
}

/* ─── Card components ─── */

type CardSize = "lg" | "md" | "sm";
const CARD_W: Record<CardSize, string> = { lg: "w-44", md: "w-36", sm: "w-28" };

function OracleCardFace({ el, deckId, size = "md" }: { el: OracleSpreadElement; deckId: string; size?: CardSize }) {
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

function OracleCardBack({ deckId, i }: { deckId: string; i: number }) {
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
};

function VerdictBadge({ answer }: { answer: string }) {
  const style = VERDICT_STYLES[answer] ?? "border-zinc-500/40 bg-zinc-500/10 text-zinc-300";
  return (
    <span className={`inline-block rounded-full border px-5 py-1.5 text-sm font-semibold tracking-wider ${style}`}>
      {answer}
    </span>
  );
}

/* ─── Deck Gallery ─── */

function DeckPreview({ deck, onSelect }: { deck: OracleDeckDef; onSelect: (id: string) => void }) {
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
            {deck.cardCount} cards
          </span>
        </div>
      </div>
    </button>
  );
}

function DeckGallery({ decks, onSelect }: { decks: OracleDeckDef[]; onSelect: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-8">
      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold text-white/90">Choose Your Oracle Deck</h2>
        <p className="mt-1 text-xs text-zinc-600">{decks.length} oracle decks from the world's leading creators</p>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {decks.map(d => <DeckPreview key={d.id} deck={d} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

/* ─── Reading View ─── */

function OracleReadingView({ deckId, deck }: { deckId: string; deck: OracleDeckDef }) {
  const [reading, setReading] = useState<OracleReadingResult | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [dealt, setDealt] = useState(false);
  const [spreadId, setSpreadId] = useState("three-card");

  const doReading = useCallback((sid?: string) => {
    const s = sid ?? spreadId;
    const spread = ORACLE_SPREADS.find(sp => sp.id === s) ?? ORACLE_SPREADS[0];
    setShuffling(true);
    setDealt(false);
    setTimeout(() => {
      const r = getOracleReading(deckId, deck.name, spread);
      setReading(r);
      setShuffling(false);
      setTimeout(() => setDealt(true), 100);
    }, 900);
  }, [deckId, spreadId, deck.name]);

  useEffect(() => {
    const initial = ORACLE_SPREADS[1]?.id ?? "single";
    setSpreadId(initial);
    const spread = ORACLE_SPREADS.find(sp => sp.id === initial) ?? ORACLE_SPREADS[0];
    const r = getOracleReading(deckId, deck.name, spread);
    setReading(r);
    setDealt(true);
  }, [deckId]);

  if (!reading) return <div className="flex min-h-[30vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" /></div>;

  const currentSpread = ORACLE_SPREADS.find(s => s.id === spreadId);
  const isYesNo = currentSpread?.isYesNo ?? false;
  const cc = deckColors(deckId);

  return (
    <div>
      {ORACLE_SPREADS.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {ORACLE_SPREADS.map(s => (
            <button key={s.id} onClick={() => { setSpreadId(s.id); doReading(s.id); }}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${spreadId===s.id ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}
            >{s.name}</button>
          ))}
        </div>
      )}

      {currentSpread && (
        <div className="mx-auto max-w-lg px-5 pt-3 text-center">
          <p className="text-[10px] text-zinc-600">{currentSpread.description}</p>
        </div>
      )}

      <div className="mx-auto max-w-lg px-5 py-6 text-center">
        <div className={`relative mx-auto h-32 w-28 sm:h-36 sm:w-32 transition-all duration-700 ${shuffling ? "animate-[shake_0.3s_ease-in-out_infinite]" : ""}`}>
          {Array.from({ length: 6 }).map((_, i) => <OracleCardBack key={i} deckId={deckId} i={i} />)}
        </div>
        <p className="mt-2 text-xs text-zinc-600">{deck.cardCount} cards</p>
        <div className="mt-4">
          <button onClick={() => doReading()} disabled={shuffling}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-6 py-3 text-sm text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-40"
          >
            {shuffling ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border border-amber-300 border-t-transparent" /> Shuffling...</>
              : <><Sparkles className="h-3.5 w-3.5" /> Shuffle & Draw</>}
          </button>
        </div>
      </div>

      {reading.elements.length > 0 && (
        <div className="mx-auto max-w-5xl px-5 pb-6">
          {isYesNo ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-5 md:gap-8">
                {reading.elements.map((el,i) => (
                  <div key={i} className={`transition-all duration-500 ${dealt&&!shuffling?"translate-y-0 opacity-100":"translate-y-6 opacity-0"}`} style={{transitionDelay:`${i*120}ms`}}>
                    <div className="flex flex-col items-center gap-1"><OracleCardFace el={el} deckId={deckId} size="lg" /><span className="text-[9px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>{el.position}</span></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-5 md:gap-8">
              {reading.elements.map((el,i) => (
                <div key={i} className={`transition-all duration-500 ${dealt&&!shuffling?"translate-y-0 opacity-100":"translate-y-6 opacity-0"}`} style={{transitionDelay:`${i*120}ms`}}>
                  <div className="flex flex-col items-center gap-1"><OracleCardFace el={el} deckId={deckId} size={reading.elements.length<=3?"lg":"md"} /><span className="text-[9px] uppercase tracking-[0.15em]" style={{color:cc.labelColor}}>{el.position}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {reading.interpretation && (
        <div className="mx-auto max-w-2xl px-5 pb-12">
          <div className="rounded-xl border border-amber-500/10 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-5 sm:p-6">
            <h3 className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-amber-400/50">Interpretation</h3>
            <div className="text-left text-sm leading-relaxed text-zinc-300 space-y-2">
              {reading.interpretation.split("\n\n").map((block, j) => {
                if (block.startsWith("Verdict:")) {
                  const answer = block.replace("Verdict: ", "");
                  return (
                    <div key={j} className="mt-4 text-center">
                      <VerdictBadge answer={answer} />
                    </div>
                  );
                }
                const lines = block.split("\n");
                return (
                  <div key={j}>
                    <p className="text-base font-semibold text-amber-300/60 mb-1">{lines[0]}</p>
                    {lines.slice(1).map((line, k) => (
                      <p key={k} className="leading-relaxed text-zinc-400">{line}</p>
                    ))}
                  </div>
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

function OracleCardBrowser({ deckId }: { deckId: string }) {
  const deck = getOracleDeck(deckId);
  if (!deck) return null;

  const allCards = getOracleCardsForDeck(deckId);
  const cards: { title: string; keywords: string }[] = allCards.map(c => ({
    title: c.title.split("|")[1] ?? c.title,
    keywords: c.keywords.join(", "),
  }));

  if (cards.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <div className="mb-4 text-center">
        <p className="text-[10px] text-zinc-600">{deck.name} - {deck.cardCount} cards by {deck.artist}</p>
      </div>
      <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {cards.map((c, i) => (
          <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.015] px-2 py-3 text-center transition hover:border-white/10">
            <div className="mt-1.5 text-[9px] font-semibold leading-tight text-white/80">{c.title}</div>
            {c.keywords && <div className="mt-1 text-[6px] leading-tight text-zinc-500">{c.keywords}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── History Section ─── */

function OracleHistorySection() {
  const [open, setOpen] = useState(false);
  const history = getOracleHistorySections();
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-amber-400/60" />
          <span className="text-xs font-semibold text-white/70">History of Oracle Cards</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          {history.map((section, i) => (
            <div key={i}>
              <h4 className={`font-bold text-white/60 mb-1 ${section.title.startsWith("Interesting") ? "mt-2" : ""}`}>{section.title}</h4>
              {section.paragraphs.map((p, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */

export function OracleCardsPage() {
  const [view, setView] = useState<"gallery" | "read" | "browse">("gallery");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  const selectedDeck = getOracleDeck(selectedDeckId ?? "");

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
      <SeoHead title="Oracle Cards · Deck Library & Readings" description="22 oracle decks from the world's leading creators. choose your deck and receive guidance" path="/consult/oracle-cards" />

      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <button onClick={view === "gallery" ? undefined : goToGallery}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {view === "gallery" ? <Link to="/consult">All methods</Link> : "All Decks"}
          </button>
          <span className="text-xs text-zinc-700">{view === "gallery" ? "Oracle Cards" : selectedDeck?.name ?? "Oracle Cards"}</span>
        </div>
      </div>

      {selectedDeck && view !== "gallery" && (
        <div className="border-b border-white/5 bg-white/[0.01]">
          <div className="mx-auto max-w-5xl px-5 py-4">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4">
              <div className="relative h-16 w-12 flex-shrink-0">
                {Array.from({ length: 3 }).map((_, i) => <OracleCardBack key={i} deckId={selectedDeck.id} i={i} />)}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-sm font-semibold text-white/90">{selectedDeck.name}</h2>
                <p className="text-[10px] text-zinc-500">{selectedDeck.artist} · {selectedDeck.year} · {selectedDeck.cardCount} cards</p>
                <p className="mt-1 text-[10px] italic text-zinc-600">{selectedDeck.description}</p>
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-block rounded-full border border-amber-700/30 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-amber-400/70">{selectedDeck.theme}</span>
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

      {view === "gallery" && <DeckGallery decks={getOracleDecks()} onSelect={handleSelect} />}
      {view === "read" && selectedDeck && <OracleReadingView deckId={selectedDeck.id} deck={selectedDeck} />}
      {view === "browse" && selectedDeckId && <OracleCardBrowser deckId={selectedDeckId} />}

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-8">
        <OracleHistorySection />
      </div>
    </div>
  );
}
