import { useState, useEffect, useCallback } from "react";
import { Sparkles, ArrowLeft, Shuffle, ChevronDown } from "lucide-react";
import { ALL_DECKS, getDeck, type TarotDeck, type TarotCard } from "../../data/tarotDecks";

const SUIT_COLORS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Major: { text: "text-amber-300", bg: "from-amber-500/10", border: "border-amber-600/30", glow: "#f59e0b" },
  Cups: { text: "text-sky-300", bg: "from-sky-500/10", border: "border-sky-600/30", glow: "#38bdf8" },
  Wands: { text: "text-red-300", bg: "from-red-500/10", border: "border-red-600/30", glow: "#ef4444" },
  Swords: { text: "text-zinc-300", bg: "from-zinc-500/10", border: "border-zinc-600/30", glow: "#a1a1aa" },
  Pentacles: { text: "text-emerald-300", bg: "from-emerald-500/10", border: "border-emerald-600/30", glow: "#34d399" },
};

const SUIT_SYMBOLS: Record<string, string> = {
  Major: "✦",
  Cups: "𓋴",
  Wands: "𓌳",
  Swords: "𓋾",
  Pentacles: "✧",
};

const SPREADS = [
  { name: "3-Card Spread", positions: ["Past", "Present", "Future"], cols: 3 },
  { name: "Celtic Cross", positions: ["Present", "Challenge", "Past", "Future", "Above", "Below", "Advice", "External", "Hopes", "Outcome"], cols: 5 },
  { name: "Love Spread", positions: ["You", "Partner", "Relationship", "Challenge", "Outcome"], cols: 5 },
  { name: "Horseshoe", positions: ["Past", "Present", "Hidden", "Obstacle", "Advice", "Outcome"], cols: 6 },
  { name: "Single Card", positions: ["Guidance"], cols: 1 },
];

interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
  flipped: boolean;
}

interface TarotSpreadProps {
  onBack: () => void;
  onReadingComplete: (cards: TarotCard[]) => void;
}

function CardBack({ index, total }: { index: number; total: number }) {
  const delay = index * 0.08;
  return (
    <div
      className="absolute inset-0 rounded-xl"
      style={{
        background: `linear-gradient(145deg, #1a1035 0%, #2d1b69 40%, #1a1035 100%)`,
        border: "1px solid rgba(167, 139, 250, 0.3)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(167, 139, 250, 0.15)`,
        animation: `shuffleSlide 0.6s ease-in-out ${delay}s`,
      }}
    >
      <div className="flex h-full items-center justify-center">
        <div className="relative h-14 w-10">
          <div className="absolute inset-0 rounded-lg border border-purple-500/20" />
          <div className="absolute inset-1 rounded-md border border-purple-500/10" />
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl opacity-40" style={{ filter: "drop-shadow(0 0 4px rgba(167,139,250,0.3))" }}>✧</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-3 top-3 flex justify-between opacity-20">
        <span className="text-[8px]">✧</span>
        <span className="text-[8px]">✧</span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex justify-between opacity-20">
        <span className="text-[8px]">✧</span>
        <span className="text-[8px]">✧</span>
      </div>
    </div>
  );
}

function CardFace({ card, reversed, index }: { card: TarotCard; reversed: boolean; index: number }) {
  const colors = SUIT_COLORS[card.suit] || SUIT_COLORS.Major;
  const numberLabel = card.suit === "Major" ? `${card.number}` : card.name.split(" ")[0];

  return (
    <div
      className={`absolute inset-0 rounded-xl ${reversed ? "rotate-180" : ""}`}
      style={{
        background: `linear-gradient(180deg, rgba(24,24,27,0.95) 0%, rgba(24,24,27,0.98) 100%)`,
        border: `1px solid ${colors.border === "border-amber-600/30" ? "rgba(217,119,6,0.3)" : colors.border === "border-sky-600/30" ? "rgba(2,132,199,0.3)" : colors.border === "border-red-600/30" ? "rgba(220,38,38,0.3)" : colors.border === "border-zinc-600/30" ? "rgba(113,113,122,0.3)" : "rgba(5,150,105,0.3)"}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 0 20px ${colors.glow}08`,
      }}
    >
      <div className="flex h-full flex-col p-2.5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className={`text-xs font-bold leading-none ${colors.text}`}>{numberLabel}</span>
            <span className="mt-0.5 text-[7px] uppercase tracking-wider opacity-60">{card.suit}</span>
          </div>
          <span className={`text-lg leading-none ${colors.text}`}>{SUIT_SYMBOLS[card.suit]}</span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl ${colors.text}`} style={{ filter: `drop-shadow(0 0 6px ${colors.glow}40)` }}>
              {card.symbol}
            </div>
            <div className={`mt-1.5 text-[9px] font-bold uppercase tracking-wider ${colors.text}`}>
              {card.name}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className={`text-[7px] leading-tight opacity-60 max-w-[60%]`}>{card.meaning}</span>
          <div className="flex items-center gap-1">
            <span className={reversed ? "text-[8px] text-amber-400/80" : "text-[8px] text-emerald-400/80"}>
              {reversed ? "▽" : "△"}
            </span>
            <span className="text-[6px] uppercase tracking-wider opacity-50">
              {reversed ? "Rev" : "Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TarotCard({ card, reversed, flipped, index, total }: {
  card: TarotCard;
  reversed: boolean;
  flipped: boolean;
  index: number;
  total: number;
}) {
  const flipDelay = index * 0.2;
  const [showFace, setShowFace] = useState(false);

  useEffect(() => {
    if (flipped) {
      const timer = setTimeout(() => setShowFace(true), flipDelay * 1000);
      return () => clearTimeout(timer);
    }
    setShowFace(false);
  }, [flipped, flipDelay]);

  return (
    <div
      className="perspective-1000"
      style={{
        perspective: "1200px",
        animation: `cardDeal 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div
        className="relative"
        style={{
          width: "100%",
          paddingBottom: "140%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <CardBack index={index} total={total} />
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <CardFace card={card} reversed={reversed} index={index} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShufflingPhase() {
  const [cards] = useState(Array.from({ length: 10 }, (_, i) => i));

  return (
    <div className="flex flex-col items-center py-12">
      <div className="relative mb-8 h-24 w-40">
        {cards.slice(0, 6).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 top-0 h-24 w-16 animate-pulse rounded-xl"
            style={{
              background: `linear-gradient(145deg, #1a1035 0%, #2d1b69 40%, #1a1035 100%)`,
              border: "1px solid rgba(167, 139, 250, 0.25)",
              left: `${i * 4}px`,
              top: `${i * 2}px`,
              animationDelay: `${i * 0.1}s`,
              zIndex: 10 - i,
              transform: `rotate(${(Math.random() - 0.5) * 6}deg)`,
            }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="h-10 w-7 rounded border border-purple-500/15" />
            </div>
          </div>
        ))}
        <Shuffle className="absolute -right-8 top-1/2 h-6 w-6 -translate-y-1/2 text-purple-400 animate-pulse" />
      </div>
      <p className="text-zinc-400 text-sm">Shuffling the deck...</p>
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-purple-500/50"
            style={{ animation: `shuffleDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function DeckSelector({ decks, selected, onSelect, disabled }: {
  decks: typeof ALL_DECKS;
  selected: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = getDeck(selected);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-left transition ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-purple-500/30"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium truncate">{current.name}</div>
          <div className="text-[10px] text-zinc-500 truncate">{current.tradition}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 w-72 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="p-2 space-y-0.5">
              {decks.map((deck) => (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => { onSelect(deck.id); setOpen(false); }}
                  className={`w-full flex items-start gap-3 rounded-lg p-3 text-left transition ${
                    selected === deck.id
                      ? "bg-purple-500/15"
                      : "hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="mt-0.5 h-8 w-6 shrink-0 rounded border border-purple-500/20 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
                    <span className="text-[10px] opacity-60">✧</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white">{deck.name}</div>
                    <div className="text-xs text-zinc-500">{deck.tradition}</div>
                    <p className="text-[10px] text-zinc-600 mt-0.5 line-clamp-2">{deck.description}</p>
                  </div>
                  {selected === deck.id && (
                    <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function TarotSpread({ onBack, onReadingComplete }: TarotSpreadProps) {
  const [selectedSpread, setSelectedSpread] = useState<typeof SPREADS[0] | null>(null);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<"select" | "shuffle" | "deal" | "reveal" | "read">("select");
  const [deckId, setDeckId] = useState(ALL_DECKS[0].id);

  const deck = getDeck(deckId);

  const shuffleAndDraw = useCallback((spread: typeof SPREADS[0]) => {
    setSelectedSpread(spread);
    setPhase("shuffle");
    setIsShuffling(true);

    setTimeout(() => {
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, spread.positions.length).map((card) => ({
        card,
        reversed: Math.random() > 0.7,
        flipped: false,
      }));
      setDrawnCards(drawn);
      setIsShuffling(false);
      setPhase("deal");

      setTimeout(() => {
        setPhase("reveal");
        setDrawnCards(prev => prev.map((d) => ({
          ...d,
          flipped: true,
        })));
        setAllFlipped(true);

        setTimeout(() => {
          setPhase("read");
        }, drawn.length * 200 + 1000);
      }, 600);
    }, 2500);
  }, [deck]);

  const newReading = useCallback(() => {
    setSelectedSpread(null);
    setDrawnCards([]);
    setAllFlipped(false);
    setPhase("select");
  }, []);

  const flipAll = useCallback(() => {
    if (allFlipped) return;
    setAllFlipped(true);
    setPhase("reveal");
    setDrawnCards(prev => prev.map((d) => ({
      ...d,
      flipped: true,
    })));

    setTimeout(() => {
      setPhase("read");
    }, drawnCards.length * 200 + 1000);
  }, [allFlipped, drawnCards.length]);

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes shuffleSlide {
          0% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-8px) rotate(-2deg); }
          75% { transform: translateX(8px) rotate(2deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }
        @keyframes cardDeal {
          0% { opacity: 0; transform: translateY(-30px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shuffleDot {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        .perspective-1000 {
          perspective: 1200px;
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Methods
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-purple-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
                Tarot Reading
              </span>
            </h1>
            <p className="mt-2 text-zinc-400">Choose your spread, ask your question, and draw the cards.</p>
          </div>
          <DeckSelector
            decks={ALL_DECKS}
            selected={deckId}
            onSelect={setDeckId}
            disabled={phase !== "select"}
          />
        </div>

        {phase === "select" && (
          <>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Your Question (optional)</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you seek to know?"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40 transition"
              />
            </div>

            <div className="mb-6 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-amber-400/70 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-400">
                    Currently using <strong className="text-amber-300">{deck.name}</strong> —{" "}
                    <span className="text-zinc-500">{deck.tradition}</span>
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{deck.description}</p>
                </div>
              </div>
            </div>

            <h2 className="mb-4 text-lg font-medium text-white">Choose Your Spread</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SPREADS.map((spread) => (
                <button
                  key={spread.name}
                  onClick={() => shuffleAndDraw(spread)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-purple-500/5"
                >
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-purple-500/5 blur-xl transition-all duration-300 group-hover:bg-purple-500/10" />
                  <h3 className="font-serif text-lg font-bold text-white relative">{spread.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500 relative">{spread.positions.join(" · ")}</p>
                  <div className="mt-3 flex gap-1 relative">
                    {Array.from({ length: spread.positions.length }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full bg-purple-500/30 transition-all duration-300 group-hover:bg-purple-400/50"
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-medium text-purple-400 opacity-0 transition-all duration-300 group-hover:opacity-100 relative">
                    Draw Cards →
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "shuffle" && <ShufflingPhase />}

        {(phase === "deal" || phase === "reveal" || phase === "read") && selectedSpread && drawnCards.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">{selectedSpread.name}</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {selectedSpread.positions.join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 bg-zinc-800/50 px-2 py-1 rounded-full">{deck.name}</span>
                {question && (
                  <div className="hidden sm:block max-w-xs rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2">
                    <p className="text-[10px] text-purple-300">Question:</p>
                    <p className="text-xs text-zinc-300 italic truncate">"{question}"</p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`grid gap-4 ${
                selectedSpread.cols <= 1 ? "grid-cols-1 max-w-[200px] mx-auto" :
                selectedSpread.cols <= 3 ? "grid-cols-2 sm:grid-cols-3" :
                "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
              }`}
            >
              {drawnCards.map(({ card, reversed, flipped }, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-full max-w-[180px]">
                    <TarotCard
                      card={card}
                      reversed={reversed}
                      flipped={flipped}
                      index={i}
                      total={drawnCards.length}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        phase === "read"
                          ? "bg-purple-500/15 text-purple-300"
                          : "bg-zinc-800/50 text-zinc-500"
                      }`}
                    >
                      {phase === "read" ? selectedSpread.positions[i] : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {!allFlipped && phase !== "read" && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={flipAll}
                  className="btn-premium inline-flex items-center gap-2 px-8 py-3"
                >
                  <Sparkles className="h-4 w-4" />
                  Reveal All Cards
                </button>
              </div>
            )}

            {phase === "read" && (
              <div className="mt-10 space-y-6">
                {question && (
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 sm:hidden">
                    <p className="text-[10px] text-purple-300">Your Question:</p>
                    <p className="text-sm text-zinc-300 italic mt-0.5">"{question}"</p>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {drawnCards.map(({ card, reversed }, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-purple-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-purple-300 uppercase tracking-wider">
                          {selectedSpread.positions[i]}
                        </span>
                        <span className={`text-[10px] ${reversed ? "text-amber-400" : "text-emerald-400"}`}>
                          {reversed ? "Reversed" : "Upright"}
                        </span>
                      </div>
                      <p className="mt-1 font-serif text-sm font-bold text-white">{card.name}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">{card.suit} · #{card.number}</p>
                      <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{card.meaning}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={newReading}
                    className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-zinc-400 transition hover:border-white/20 hover:text-white"
                  >
                    New Reading
                  </button>
                  <button
                    onClick={() => onReadingComplete(drawnCards.map((d) => d.card))}
                    className="btn-premium inline-flex items-center gap-2 px-8 py-2.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    Get AI Interpretation
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
