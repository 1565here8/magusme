import { useState } from "react";
import { Sparkles, ArrowLeft, Shuffle } from "lucide-react";

const CARDS = [
  { name: "The Fool", number: 0, suit: "Major", symbol: "∞", meaning: "New beginnings, innocence, spontaneity" },
  { name: "The Magician", number: 1, suit: "Major", symbol: "𓃑", meaning: "Power, skill, concentration" },
  { name: "The High Priestess", number: 2, suit: "Major", symbol: "𓁒", meaning: "Intuition, mystery, inner knowledge" },
  { name: "The Empress", number: 3, suit: "Major", symbol: "𓅡", meaning: "Fertility, abundance, nature" },
  { name: "The Emperor", number: 4, suit: "Major", symbol: "𓋜", meaning: "Authority, structure, stability" },
  { name: "The Hierophant", number: 5, suit: "Major", symbol: "𓋔", meaning: "Tradition, spiritual wisdom, conformity" },
  { name: "The Lovers", number: 6, suit: "Major", symbol: "♡", meaning: "Love, harmony, relationships" },
  { name: "The Chariot", number: 7, suit: "Major", symbol: "𓌉", meaning: "Willpower, determination, victory" },
  { name: "Strength", number: 8, suit: "Major", symbol: "𓃭", meaning: "Courage, inner strength, compassion" },
  { name: "The Hermit", number: 9, suit: "Major", symbol: "𓂀", meaning: "Soul-searching, introspection, guidance" },
  { name: "Wheel of Fortune", number: 10, suit: "Major", symbol: "☸", meaning: "Change, cycles, fate" },
  { name: "Justice", number: 11, suit: "Major", symbol: "⚖", meaning: "Fairness, truth, cause and effect" },
  { name: "The Hanged Man", number: 12, suit: "Major", symbol: "𓈖", meaning: "Surrender, new perspective, pause" },
  { name: "Death", number: 13, suit: "Major", symbol: "𓋴", meaning: "Transformation, endings, change" },
  { name: "Temperance", number: 14, suit: "Major", symbol: "𓋨", meaning: "Balance, moderation, patience" },
  { name: "The Devil", number: 15, suit: "Major", symbol: "𓃀", meaning: "Shadow self, materialism, bondage" },
  { name: "The Tower", number: 16, suit: "Major", symbol: "𓉐", meaning: "Sudden change, upheaval, revelation" },
  { name: "The Star", number: 17, suit: "Major", symbol: "✧", meaning: "Hope, inspiration, serenity" },
  { name: "The Moon", number: 18, suit: "Major", symbol: "☽", meaning: "Illusion, fear, subconscious" },
  { name: "The Sun", number: 19, suit: "Major", symbol: "☀", meaning: "Joy, success, vitality" },
  { name: "Judgement", number: 20, suit: "Major", symbol: "𓂋", meaning: "Reflection, reckoning, inner calling" },
  { name: "The World", number: 21, suit: "Major", symbol: "🌍", meaning: "Completion, fulfillment, travel" },
  { name: "Ace of Cups", number: 1, suit: "Cups", symbol: "♡", meaning: "New love, emotional beginning" },
  { name: "Two of Cups", number: 2, suit: "Cups", symbol: "♡♡", meaning: "Partnership, unity, connection" },
  { name: "Three of Cups", number: 3, suit: "Cups", symbol: "♡♡♡", meaning: "Friendship, celebration, community" },
  { name: "Ace of Wands", number: 1, suit: "Wands", symbol: "𓌳", meaning: "New energy, inspiration, bold start" },
  { name: "Two of Wands", number: 2, suit: "Wands", symbol: "𓌳𓌳", meaning: "Planning, decisions, future vision" },
  { name: "Ace of Swords", number: 1, suit: "Swords", symbol: "𓋾", meaning: "Mental clarity, breakthrough, truth" },
  { name: "Two of Swords", number: 2, suit: "Swords", symbol: "𓋾𓋾", meaning: "Difficult choice, stalemate, blocked emotion" },
  { name: "Ace of Pentacles", number: 1, suit: "Pentacles", symbol: "✧", meaning: "New financial opportunity, prosperity" },
  { name: "Two of Pentacles", number: 2, suit: "Pentacles", symbol: "✧✧", meaning: "Balance, adaptability, juggling priorities" },
];

const SPREADS = [
  { name: "3-Card Spread", positions: ["Past", "Present", "Future"], cols: 3 },
  { name: "Celtic Cross", positions: ["Present", "Challenge", "Past", "Future", "Above", "Below", "Advice", "External", "Hopes", "Outcome"], cols: 5 },
  { name: "Love Spread", positions: ["You", "Partner", "Relationship", "Challenge", "Outcome"], cols: 5 },
  { name: "Horseshoe", positions: ["Past", "Present", "Hidden", "Obstacle", "Advice", "Outcome"], cols: 6 },
];

interface TarotSpreadProps {
  onBack: () => void;
  onReadingComplete: (cards: typeof CARDS) => void;
}

export function TarotSpread({ onBack, onReadingComplete }: TarotSpreadProps) {
  const [selectedSpread, setSelectedSpread] = useState<typeof SPREADS[0] | null>(null);
  const [drawnCards, setDrawnCards] = useState<Array<{ card: typeof CARDS[0]; reversed: boolean }>>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [question, setQuestion] = useState("");

  function shuffleAndDraw(spread: typeof SPREADS[0]) {
    setSelectedSpread(spread);
    setIsShuffling(true);
    setDrawnCards([]);

    setTimeout(() => {
      const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, spread.positions.length).map((card) => ({
        card,
        reversed: Math.random() > 0.7,
      }));
      setDrawnCards(drawn);
      setIsShuffling(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Methods
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-white">Tarot Reading</h1>
          <p className="mt-2 text-zinc-400">Choose your spread, ask your question, and draw the cards.</p>
        </div>

        {!selectedSpread && (
          <>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-zinc-300">Your Question (optional)</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you seek to know?"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-purple-500/40"
              />
            </div>

            <h2 className="mb-4 text-lg font-medium text-white">Choose Your Spread</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SPREADS.map((spread) => (
                <button
                  key={spread.name}
                  onClick={() => shuffleAndDraw(spread)}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-purple-500/30"
                >
                  <h3 className="font-serif text-lg font-bold text-white">{spread.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{spread.positions.join(" · ")}</p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: spread.positions.length }).map((_, i) => (
                      <div key={i} className="h-1 flex-1 rounded-full bg-purple-500/30" />
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Draw Cards →
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {isShuffling && (
          <div className="flex flex-col items-center py-20">
            <Shuffle className="mb-4 h-12 w-12 animate-pulse text-purple-400" />
            <p className="text-zinc-400">Shuffling the deck...</p>
            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 w-20 animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
              ))}
            </div>
          </div>
        )}

        {drawnCards.length > 0 && selectedSpread && !isShuffling && (
          <>
            <div className={`grid gap-4 ${selectedSpread.cols <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-5"}`}>
              {drawnCards.map(({ card, reversed }, i) => (
                <div
                  key={i}
                  className={`group relative rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/5 to-transparent p-4 text-center transition hover:border-purple-500/30 ${reversed ? "rotate-180" : ""}`}
                >
                  <div className={`mb-2 text-3xl ${reversed ? "rotate-180" : ""}`}>{card.symbol}</div>
                  <h3 className="font-serif text-sm font-bold text-white">{card.name}</h3>
                  <div className="mt-1 text-[10px] text-purple-300">{card.suit}</div>
                  <div className={`mt-1 text-[10px] font-medium ${reversed ? "text-amber-400" : "text-emerald-400"}`}>
                    {reversed ? "Reversed" : "Upright"}
                  </div>
                  <div className="mt-1 text-[10px] leading-tight text-zinc-500">{card.meaning}</div>
                  <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="absolute -top-2 -right-2 rounded-full bg-zinc-800 px-2 py-0.5 text-[9px] text-zinc-400">
                    {selectedSpread.positions[i]}
                  </div>
                </div>
              ))}
            </div>

            {question && (
              <div className="mt-8 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
                <p className="text-xs text-purple-300">Your Question:</p>
                <p className="mt-1 text-sm text-white italic">"{question}"</p>
              </div>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setSelectedSpread(null)}
                className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-zinc-400 transition hover:border-white/20"
              >
                New Reading
              </button>
              <button
                onClick={() => onReadingComplete(drawnCards.map((d) => d.card))}
                className="rounded-full bg-purple-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
              >
                <Sparkles className="mr-2 inline h-4 w-4" />
                Get AI Interpretation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
