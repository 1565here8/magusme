import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Sparkles, RotateCcw, ChevronDown, ChevronUp, History,
  Heart, Diamond, Club, Shuffle, LayoutGrid,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  PLAYING_CARDS, SPREAD_DEFS, SUIT_MEANINGS, RANK_MEANINGS,
  getRandomCards, getCardsBySuit,
  type PlayingCardDef, type Suit,
} from "./playingCardsData";
import { PLAYING_CARDS_ORIGINS } from "./playingCardsHistory";

/* ─── Suit icon map ─── */
const SUIT_ICON: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const SUIT_GLYPH: Record<Suit, string> = {
  hearts: "🂱",
  diamonds: "🃁",
  clubs: "🃑",
  spades: "🂡",
};

const SUIT_COLOR: Record<Suit, string> = {
  hearts: "text-red-400",
  diamonds: "text-amber-400",
  clubs: "text-emerald-400",
  spades: "text-violet-400",
};

/* ─── Format rank for display ─── */
function displayRank(rank: string): string {
  if (rank === "A") return "Ace";
  if (rank === "J") return "Jack";
  if (rank === "Q") return "Queen";
  if (rank === "K") return "King";
  return rank;
}

/* ─── Card display ─── */
function CardFace({ card, position, size = "md" }: { card: PlayingCardDef; position?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = size === "lg" ? "w-32" : size === "sm" ? "w-20" : "w-28";
  return (
    <div className={`${sizeClasses} shrink-0 rounded-lg border ${card.suit === "hearts" || card.suit === "diamonds" ? "border-red-900/30" : "border-zinc-700/50"} bg-gradient-to-b from-zinc-900 to-zinc-950 p-2 text-center`}>
      <div className={`text-lg ${SUIT_COLOR[card.suit]}`}>{card.glyph}</div>
      <div className={`mt-0.5 text-[9px] font-semibold ${card.color === "red" ? "text-red-300" : "text-zinc-300"}`}>{card.name}</div>
      {position && <div className="mt-0.5 text-[8px] leading-tight text-zinc-600">{position}</div>}
    </div>
  );
}

/* ─── Card Back ─── */
function CardBack() {
  return (
    <div className="w-24 shrink-0 rounded-lg border border-zinc-700/50 bg-gradient-to-b from-indigo-950 to-indigo-900 p-3 text-center">
      <div className="text-xl text-indigo-400/60">🂠</div>
      <div className="mt-0.5 text-[8px] text-indigo-500/40">Playing Cards</div>
    </div>
  );
}

/* ─── Spread layout components ─── */

function SingleCard({ card, spread }: { card: PlayingCardDef; spread: typeof SPREAD_DEFS[0] }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <CardFace card={card} position={spread.positions[0]} size="lg" />
      <div className="max-w-md text-center">
        <p className="text-[10px] leading-relaxed text-zinc-500">{card.meaning}</p>
      </div>
    </div>
  );
}

function ThreeCardSpread({ cards }: { cards: PlayingCardDef[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {cards.map((card, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <CardFace card={card} position={["Past", "Present", "Future"][i]} size="md" />
          <div className="max-w-[180px] text-center">
            <p className="text-[9px] leading-relaxed text-zinc-600">{card.meaning.split(".")[0]}.</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FiveCrossSpread({ cards, spread }: { cards: PlayingCardDef[]; spread: typeof SPREAD_DEFS[0] }) {
  return (
    <div className="flex flex-col items-center py-8">
      {/* Center row: Left - Center - Right */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <CardFace card={cards[3]} position={spread.positions[3]} size="sm" />
        </div>
        <CardFace card={cards[0]} position={spread.positions[0]} size="lg" />
        <div className="flex flex-col items-center gap-1">
          <CardFace card={cards[4]} position={spread.positions[4]} size="sm" />
        </div>
      </div>
      {/* Above and Below */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <CardFace card={cards[1]} position={spread.positions[1]} size="sm" />
        <CardFace card={cards[2]} position={spread.positions[2]} size="sm" />
      </div>
    </div>
  );
}

function HorseshoeSpread({ cards }: { cards: PlayingCardDef[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 py-8">
      {cards.map((card, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <CardFace card={card} position={SPREAD_DEFS[3].positions[i]} size="sm" />
        </div>
      ))}
    </div>
  );
}

function YearSpread({ cards }: { cards: PlayingCardDef[] }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div className="py-8">
      <div className="mb-4 flex justify-center">
        <CardFace card={cards[0]} position="The Year Ahead" size="lg" />
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {cards.slice(1).map((card, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <CardFace card={card} position={months[i]} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card Browser ─── */
function CardBrowser() {
  const [suitFilter, setSuitFilter] = useState<Suit | "all">("all");
  const [selectedCard, setSelectedCard] = useState<PlayingCardDef | null>(null);

  const filtered = suitFilter === "all" ? PLAYING_CARDS : getCardsBySuit(suitFilter);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-16">
      {/* Suit filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => { setSuitFilter("all"); setSelectedCard(null); }}
          className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider transition ${suitFilter === "all" ? "bg-white/10 text-white" : "bg-white/[0.03] text-zinc-600 hover:text-zinc-400"}`}
        >All 52 Cards</button>
        {(Object.keys(SUIT_MEANINGS) as Suit[]).map((suit) => (
          <button key={suit} onClick={() => { setSuitFilter(suit); setSelectedCard(null); }}
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider transition ${suitFilter === suit ? "border-white/20 bg-white/10 text-white" : "border-white/5 text-zinc-500 hover:border-white/15"}`}
          >{SUIT_ICON[suit]} {suit}</button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((card) => (
          <button key={card.id} onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
            className={`rounded-lg border p-2 text-left transition ${selectedCard?.id === card.id ? "border-white/20 bg-white/[0.06]" : "border-white/[0.03] bg-white/[0.01] hover:border-white/[0.08]"}`}
          >
            <div className={`text-base ${SUIT_COLOR[card.suit]}`}>{card.glyph}</div>
            <div className={`mt-0.5 text-[8px] font-semibold ${card.color === "red" ? "text-red-300" : "text-zinc-400"}`}>{card.name}</div>
            <div className="mt-0.5 text-[7px] text-zinc-600">{card.keywords.slice(0, 2).join(" · ")}</div>
          </button>
        ))}
      </div>

      {/* Card detail panel */}
      {selectedCard && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
          <div className="flex items-start gap-4">
            <div className={`text-3xl ${SUIT_COLOR[selectedCard.suit]}`}>{selectedCard.glyph}</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white/90">{selectedCard.name}</h3>
              <p className="mt-0.5 text-[10px] text-zinc-600">
                {selectedCard.element} · {SUIT_MEANINGS[selectedCard.suit].domain} · {SUIT_ICON[selectedCard.suit]} {selectedCard.suit}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedCard.keywords.slice(0, 5).map((kw) => (
                  <span key={kw} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] text-zinc-500">{kw}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div>
              <h4 className="text-[10px] font-semibold text-white/60">Upright meaning</h4>
              <p className="text-[10px] leading-relaxed text-zinc-500">{selectedCard.meaning}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-white/60">Reversed meaning</h4>
              <p className="text-[10px] leading-relaxed text-zinc-500">{selectedCard.reversedMeaning}</p>
            </div>
            <div className="mt-3 rounded-lg bg-white/[0.02] p-3">
              <h4 className="text-[9px] font-semibold text-zinc-600">{SUIT_ICON[selectedCard.suit]} {selectedCard.suit.charAt(0).toUpperCase() + selectedCard.suit.slice(1)} — {SUIT_MEANINGS[selectedCard.suit].meaning}</h4>
              <p className="mt-1 text-[9px] leading-relaxed text-zinc-600">{SUIT_MEANINGS[selectedCard.suit].meaning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── How It Works section ─── */
function HowItWorks() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-white/70">How Cartomancy Reading Works</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 text-[10px] leading-relaxed text-zinc-500">
          <p>Cartomancy — reading standard playing cards for divination — is one of the oldest and most accessible forms of fortune-telling. Unlike tarot, which requires specialized knowledge of 78 cards and complex symbolism, playing card reading works with the deck you can buy at any grocery store. The system is based on the interaction between suit energy and number meaning.</p>
          <h4 className="font-bold text-white/60">The four suits</h4>
          <p className="text-zinc-600">Each suit governs a domain of life. Hearts rule love and emotions. Diamonds rule money and material affairs. Clubs rule career, creativity, and enterprise. Spades rule challenges, health, and necessary endings. The suit tells you <em>what area of life</em> is affected; the number tells you <em>how</em>.</p>
          <h4 className="font-bold text-white/60">Number meanings</h4>
          <p className="text-zinc-600">Aces are seeds (new beginnings), Twos are unions and choices, Threes are growth, Fours are stability, Fives are challenge and change, Sixes are harmony and progress, Sevens are reflection and inner work, Eights are movement and speed, Nines are near-completion, Tens are endings and legacy. Jacks bring news, Queens represent mature women, Kings represent authority figures.</p>
          <h4 className="font-bold text-white/60">Polarity</h4>
          <p className="text-zinc-600">Red cards (Hearts and Diamonds) are generally beneficial. Black cards (Clubs and Spades) indicate effort, obstacles, or challenges. In a reading, the ratio of red to black cards gives an immediate sense of the overall energy. A red-heavy spread suggests favorable conditions; a black-heavy spread warns of difficulties ahead.</p>
          <h4 className="font-bold text-white/60">Card combinations</h4>
          <p className="text-zinc-600">When cards appear next to each other in a spread, they modify each other. A positive card next to a negative card softens the negative. Two cards from the same suit amplify each other's energy. A card from one suit followed by a card from a different suit suggests a shift in life domains — from love (Hearts) to money (Diamonds), for example.</p>
          <h4 className="font-bold text-white/60">Reversals</h4>
          <p className="text-zinc-600">In traditional cartomancy, not all readers use reversals. When used, a reversed card suggests the card's energy is blocked, delayed, or turned inward. The meaning shifts from external action to internal experience, or from something that happens to something that is felt.</p>
        </div>
      )}
    </div>
  );
}

/* ─── History Section ─── */
function HistorySection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-violet-400/60" />
          <span className="text-xs font-semibold text-white/70">History of Playing Card Cartomancy</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          {PLAYING_CARDS_ORIGINS.map((section, i) => (
            <div key={i}>
              <h4 className="font-bold text-white/60 mb-1">{section.title}</h4>
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

export function PlayingCardsPage() {
  const [view, setView] = useState<"read" | "browse">("read");
  const [cards, setCards] = useState<PlayingCardDef[]>([]);
  const [spreadId, setSpreadId] = useState(SPREAD_DEFS[0].id);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const spread = SPREAD_DEFS.find(s => s.id === spreadId) ?? SPREAD_DEFS[0];

  const handleDraw = useCallback(() => {
    setIsShuffling(true);
    setIsRevealed(false);
    setTimeout(() => {
      setCards(getRandomCards(spread.cardCount));
      setIsShuffling(false);
      setTimeout(() => setIsRevealed(true), 200);
    }, 800);
  }, [spread.cardCount]);

  const handleClear = useCallback(() => {
    setCards([]);
    setIsRevealed(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900">
      <SeoHead title="Playing Cards · Cartomancy Readings" description="52-card standard deck cartomancy — hearts, spades, clubs, diamonds with full traditional meanings and multiple spreads" path="/consult/playing-cards" />

      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            All methods
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet-900/30 px-2 py-0.5 text-[8px] text-violet-400/60">Cartomancy</span>
            <span className="text-xs text-zinc-700">Playing Cards</span>
          </div>
        </div>
      </div>

      {/* View switcher */}
      {view === "read" ? (
        <>
          {/* Spread selector */}
          <div className="border-b border-white/5">
            <div className="mx-auto max-w-3xl px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {SPREAD_DEFS.map((s) => (
                    <button key={s.id} onClick={() => { setSpreadId(s.id); handleClear(); }}
                      className={`rounded-full px-3 py-1 text-[9px] uppercase tracking-wider transition ${spreadId === s.id ? "bg-violet-500/15 text-violet-300" : "text-zinc-600 hover:text-zinc-400"}`}
                    >{s.name}</button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={handleClear} disabled={cards.length === 0}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-wider text-zinc-500 transition hover:border-white/20 disabled:opacity-30"
                  ><RotateCcw className="h-3 w-3" />Clear</button>
                </div>
              </div>
              <p className="mt-2 text-[9px] text-zinc-600">{spread.description} · {spread.cardCount} cards · {spread.bestFor}</p>
            </div>
          </div>

          {/* Reading area */}
          <div className="mx-auto max-w-5xl px-5 py-4">
            {/* Draw button */}
            {cards.length === 0 && !isShuffling && (
              <div className="flex flex-col items-center py-16">
                <p className="text-6xl text-zinc-800">🂠</p>
                <p className="mt-4 text-xs text-zinc-600">Select a spread and draw</p>
                <button onClick={handleDraw}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-violet-500/10 px-6 py-3 text-xs text-violet-300 transition hover:bg-violet-500/20"
                ><Shuffle className="h-4 w-4" />Draw {spread.cardCount} Card{spread.cardCount > 1 ? "s" : ""}</button>
              </div>
            )}

            {/* Shuffle animation */}
            {isShuffling && (
              <div className="flex flex-col items-center py-16">
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, spread.cardCount) }).map((_, i) => (
                    <div key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                      <CardBack />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] text-zinc-600 animate-pulse">Shuffling the deck...</p>
              </div>
            )}

            {/* Cards display */}
            {!isShuffling && cards.length > 0 && (
              <>
                <div className={`transition-opacity duration-500 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
                  {spread.layout === "single" && <SingleCard card={cards[0]} spread={spread} />}
                  {spread.layout === "line" && <ThreeCardSpread cards={cards} />}
                  {spread.layout === "cross" && <FiveCrossSpread cards={cards} spread={spread} />}
                  {spread.layout === "horseshoe" && <HorseshoeSpread cards={cards} />}
                  {spread.layout === "year" && <YearSpread cards={cards} />}

                  {/* Card-by-card interpretations */}
                  {isRevealed && (
                    <div className="mt-8 space-y-3">
                      <h3 className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 text-center">Card Interpretations</h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card, i) => (
                          <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg ${SUIT_COLOR[card.suit]}`}>{card.glyph}</span>
                              <div>
                                <span className={`text-[10px] font-semibold ${card.color === "red" ? "text-red-300" : "text-zinc-300"}`}>{card.name}</span>
                                <span className="ml-2 text-[8px] text-zinc-600">{spread.positions[i] || `Card ${i + 1}`}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {card.keywords.slice(0, 3).map((kw) => (
                                <span key={kw} className="rounded-full bg-white/[0.03] px-1.5 py-0.5 text-[7px] text-zinc-600">{kw}</span>
                              ))}
                            </div>
                            <details className="mt-2">
                              <summary className="cursor-pointer text-[9px] text-zinc-600 hover:text-zinc-400">Read meaning</summary>
                              <p className="mt-1 text-[9px] leading-relaxed text-zinc-500">{card.meaning}</p>
                            </details>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Re-draw */}
                <div className="mt-8 flex justify-center">
                  <button onClick={handleDraw}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-violet-500/10 px-6 py-3 text-xs text-violet-300 transition hover:bg-violet-500/20"
                  ><Shuffle className="h-4 w-4" />Draw Again</button>
                </div>
              </>
            )}
          </div>

          {/* How it works & History */}
          <div className="mx-auto max-w-3xl px-5 pb-6 space-y-3">
            <HowItWorks />
          </div>
          <div className="mx-auto max-w-3xl px-5 pb-16">
            <HistorySection />
          </div>
        </>
      ) : (
        <CardBrowser />
      )}

      {/* Bottom nav */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 px-5 py-3">
          <button onClick={() => setView("read")}
            className={`text-[10px] uppercase tracking-wider transition ${view === "read" ? "text-violet-400" : "text-zinc-600 hover:text-zinc-400"}`}
          ><Shuffle className="mr-1 inline h-3 w-3" />Read</button>
          <button onClick={() => setView("browse")}
            className={`text-[10px] uppercase tracking-wider transition ${view === "browse" ? "text-violet-400" : "text-zinc-600 hover:text-zinc-400"}`}
          ><LayoutGrid className="mr-1 inline h-3 w-3" />Browse Cards</button>
        </div>
      </div>
    </div>
  );
}
