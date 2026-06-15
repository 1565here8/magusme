import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Book, Shuffle, RotateCcw, Layers,
  LayoutGrid, Crosshair, ChevronDown, ChevronUp, Info,
  Scroll, Library, History,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  LENORMAND_CARDS, SPREAD_DEFS, getRandomCards, getAllCards,
  type LenormandCardDef, type SpreadType,
} from "./lenormandData";
import { LENORMAND_ORIGINS } from "./lenormandHistory";

/* ─── Theme ─── */
const INDIGO = "#2c3e7a";
const GOLD = "#c8a45c";
const CREAM = "#f5f0e8";
const BG = "#0a0a12";

/* ─── Card face ─── */
function LenormandCard({ card, reversed, position, dim, number }: {
  card: LenormandCardDef; reversed: boolean; position?: string; dim?: boolean; number?: number;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border-2 p-3 transition-all duration-300 ${
        reversed
          ? "border-red-900/30 bg-red-950/8"
          : "border-indigo-900/30 bg-indigo-950/8"
      } ${dim ? "opacity-30" : ""}`}
      style={{
        boxShadow: reversed
          ? "inset 0 0 20px rgba(139,0,0,0.08)"
          : "inset 0 0 20px rgba(44,62,122,0.08)",
      }}
    >
      {number && (
        <span className="absolute top-1 left-1.5 text-[7px] font-mono text-zinc-700">
          #{number}
        </span>
      )}
      <div className={`text-center text-3xl ${reversed ? "rotate-180 scale-x-[-1]" : ""}`}>
        {card.glyph}
      </div>
      <h3 className="mt-1 text-center font-serif text-xs font-bold text-white/80">
        {card.name}
      </h3>
      <p className="text-center text-[7px] font-mono text-zinc-600">{card.cardEquivalent}</p>
      {position && (
        <p className="mt-1 text-center text-[7px] uppercase tracking-[0.15em] text-indigo-400/50">
          {position}
        </p>
      )}
      {reversed && (
        <div className="mt-1 flex items-center justify-center gap-1 rounded border border-red-900/20 bg-red-950/15 px-1.5 py-0.5">
          <span className="text-[6px] text-red-400/60">Reversed</span>
        </div>
      )}
      <div className="mt-1 flex flex-wrap justify-center gap-0.5">
        {card.keywords.slice(0, 3).map(kw => (
          <span key={kw} className="rounded border border-white/[0.03] bg-white/[0.02] px-1 py-0.5 text-[6px] text-zinc-600">
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Card detail panel ─── */
function CardDetail({ card, reversed }: { card: LenormandCardDef; reversed: boolean }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className={`inline-block text-5xl ${reversed ? "rotate-180 scale-x-[-1]" : ""}`}>
          {card.glyph}
        </div>
        <h2 className="mt-3 font-serif text-2xl font-bold text-white">{card.name}</h2>
        <p className="text-xs text-zinc-500">{card.cardEquivalent} · Card {card.id} of 36</p>
        <p className="text-[9px] text-zinc-600">{card.tradition}</p>
      </div>

      <div className={`rounded-xl border p-5 ${
        reversed ? "border-red-900/20 bg-red-950/10" : "border-indigo-900/20 bg-indigo-950/10"
      }`}>
        <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-zinc-500">
          {reversed ? "Reversed Meaning" : "Upright Meaning"}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-300">
          {reversed ? card.reversedMeaning : card.meaning}
        </p>
      </div>

      {card.timing && (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
          <h3 className="mb-1.5 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Timing</h3>
          <p className="text-xs leading-relaxed text-zinc-400">{card.timing}</p>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
        <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Symbolism</h3>
        <p className="text-xs leading-relaxed text-zinc-400">{card.symbolism}</p>
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
        <h3 className="mb-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500">Keywords</h3>
        <div className="flex flex-wrap gap-1.5">
          {card.keywords.map(kw => (
            <span key={kw} className="rounded border border-white/[0.04] bg-white/[0.02] px-2 py-0.5 text-[10px] text-zinc-400">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Pair interpretation (essential Lenormand technique) ─── */
function PairInterpretation({ cardA, cardB }: { cardA: LenormandCardDef; cardB: LenormandCardDef }) {
  const pairs: Record<string, string> = {
    "1-24": "A love message or romantic news. The Rider brings a declaration of love, a date invitation, or news that stirs the heart.",
    "1-25": "A proposal or commitment offered. News of an engagement, a contract arriving, a commitment being presented.",
    "1-28": "A man arriving or a message from a man. The male figure is active and approaching.",
    "1-29": "A woman arriving or a message from a woman. She brings news or is coming to see you.",
    "2-31": "Extraordinary good fortune. Luck and success combined — a fortunate breakthrough.",
    "2-34": "Financial luck — unexpected money, a windfall, a lucky financial opportunity.",
    "3-4": "Moving house. A journey related to home or returning home after travel.",
    "3-35": "A journey for work or a stable relocation. Travel that leads to a settled outcome.",
    "4-24": "Domestic happiness. Love at home, a happy family life, emotional security in the home.",
    "4-25": "A domestic commitment — moving in together, marriage at home, a home purchase.",
    "5-8": "Health concerns. The tree's vitality affected by the coffin — illness or recovery from illness.",
    "5-31": "Robust health. Vitality restored, strong immune system, healing complete.",
    "6-31": "Clarity after confusion. The sun burns through clouds — truth emerges, confusion resolves.",
    "6-32": "Emotional fog. Confused feelings, self-deception, a situation where emotions cloud judgment.",
    "7-14": "A cunning deceiver. Someone who manipulates through cleverness — double deception.",
    "7-24": "Love that is not trustworthy. A relationship with hidden agendas or emotional manipulation.",
    "8-17": "An ending that leads to positive change. Death and rebirth — closure brings transformation.",
    "8-31": "A happy ending. Transformation that leads to light. The coffin opens to sunshine.",
    "9-24": "A love gift or romantic invitation. A date, a proposal, a gesture of affection offered freely.",
    "9-25": "An engagement gift or a contract offer. A commitment presented as a gift.",
    "10-24": "Sudden heartbreak. A relationship cut abruptly — a breakup that comes without warning.",
    "10-25": "A sudden divorce or contract cancellation. The scythe cuts through a commitment.",
    "11-24": "Passionate but volatile love. Intense emotions with frequent arguments — fire and heat.",
    "11-25": "A turbulent relationship. Commitment that involves conflict, or a contract under dispute.",
    "13-17": "A new phase beginning. A birth, a new project launching, a fresh start that changes everything.",
    "13-24": "New love. A fresh romance, innocent and full of potential. The beginning of something beautiful.",
    "14-15": "A cunning authority figure. A boss who manipulates, or workplace politics requiring caution.",
    "16-31": "Destined success. Your path and your purpose align — extraordinary clarity and fulfillment.",
    "16-32": "Spiritual intuition. Deep inner knowing, psychic awareness, guidance from within.",
    "17-24": "A change of heart. Feelings shift, a relationship transforms, emotional direction changes.",
    "17-25": "A commitment that changes form — marriage after a period of change, a renewed contract.",
    "18-24": "Loyal love. Faithful partnership, a devoted friend who loves truly, trust that holds.",
    "19-24": "Distant love. A long-distance relationship, emotional isolation, or coldness in love.",
    "20-24": "Social love. Meeting someone through friends, a public romance, love that thrives in community.",
    "21-33": "An obstacle that will be overcome. The key unlocks the mountain — the solution exists.",
    "22-24": "A choice in love. Between two people, or the decision to commit or walk away.",
    "23-34": "Financial loss. Money draining away, theft, bad investments, expenses exceeding income.",
    "24-25": "A committed love. Marriage, engagement, a deep partnership. The heart bound by the ring.",
    "24-28": "A man in love, or love from a man. His heart is engaged and sincere.",
    "24-29": "A woman in love, or love from a woman. Her emotions are deeply invested.",
    "24-31": "Radiant love. A joyful, warm relationship. Happiness in love, love that brings light.",
    "24-36": "A love that is burdened. Difficult love, a relationship that requires sacrifice, karmic love.",
    "25-31": "A joyful commitment. A happy marriage, a successful partnership, a contract that brings joy.",
    "25-35": "A stable commitment. A secure relationship or contract that provides lasting foundation.",
    "26-33": "The secret revealed. Knowledge unlocked, a mystery solved, the answer to a hidden question.",
    "27-24": "A love letter or romantic message. Written declaration of affection.",
    "28-29": "The union of masculine and feminine. A partnership, relationship, or the integration of opposites.",
    "30-31": "Peace and joy together. Mature happiness, contentment, the bloom of a life well-lived.",
    "31-32": "Day and night, conscious and unconscious aligned. A complete cycle — integration and wholeness.",
    "31-33": "The answer is clear and positive. Success and solution together — the outcome is bright.",
    "31-36": "A burden that ends in success. The cross carried to light — hard work rewarded.",
    "33-34": "The key to financial success. A solution to money problems, access to abundance.",
    "34-35": "Financial stability. Steady income, secure finances, money that provides lasting security.",
    "35-36": "A stable burden. A responsibility that you carry because it provides security — work, family duty.",
  };

  const key = `${Math.min(cardA.id, cardB.id)}-${Math.max(cardA.id, cardB.id)}`;
  const interpretation = pairs[key];

  if (!interpretation) return null;

  return (
    <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.03] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{cardA.glyph}</span>
        <span className="text-[9px] text-zinc-600">+</span>
        <span className="text-lg">{cardB.glyph}</span>
        <span className="text-[9px] uppercase tracking-[0.15em] text-indigo-400/50 ml-1">Pair</span>
      </div>
      <div className="flex items-center gap-2 text-[9px] text-zinc-500 mb-2">
        <span className="font-medium text-white/60">{cardA.name}</span>
        <span>+</span>
        <span className="font-medium text-white/60">{cardB.name}</span>
      </div>
      <p className="text-xs leading-relaxed text-zinc-300">{interpretation}</p>
    </div>
  );
}

/* ─── How to read section ─── */
function HowToRead() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <Book className="h-3.5 w-3.5 text-indigo-400/60" />
          <span className="text-xs font-semibold text-white/70">How Lenormand Reading Works</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          <div>
            <h4 className="font-bold text-white/60 mb-1">What is Lenormand?</h4>
            <p>Lenormand is a 36-card cartomantic system named after Marie Anne Lenormand (1772–1843), though she did not design the deck herself. The cards as we know them today originated in 19th-century Germany as <em>Das Spiel der Hoffnung</em> (The Game of Hope), a simple fortune-telling game using symbolic images. Unlike Tarot (which uses archetypes and spiritual narratives), Lenormand is direct, practical, and literal. It answers specific questions about daily life — love, work, money, travel, health — with blunt honesty. No spiritual elevation, no hidden mysteries. Just clear, grounded answers.</p>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">How does reading work?</h4>
            <p>Lenormand cards are read primarily in <strong>combinations</strong>. A single card has a range of meanings, but when placed next to another card, the two create a specific phrase — like words in a sentence. The Rider (news) next to the Heart (love) = "a love message." The Ship (travel) next to the Anchor (work) = "a business trip." The spread is read as a coherent story, not a collection of individual card meanings. Context is everything: the same card means something different depending on who it sits beside.</p>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">Essential techniques</h4>
            <ul className="space-y-1.5 mt-1">
              <li><strong className="text-white/50">Pairing:</strong> Every card is read in combination with the cards next to it. Card 1 + Card 2 form a phrase, Card 2 + Card 3 form the next phrase, and so on.</li>
              <li><strong className="text-white/50">Mirroring:</strong> In a Grand Tableau, cards reflect across horizontal and vertical axes. The card opposite you in the grid holds complementary or opposing energy.</li>
              <li><strong className="text-white/50">Knighting:</strong> A card "visits" another card by moving in an L-shape (chess knight move). Cards that knight each other have a special relationship.</li>
              <li><strong className="text-white/50">Near/Far:</strong> Cards close to the significator (Man/Woman card) affect the querent directly. Cards far away are distant influences or things outside the querent's control.</li>
              <li><strong className="text-white/50">House system:</strong> In the Grand Tableau, each of the 36 positions corresponds to one of the 36 cards' houses. The card that lands in a house takes on the house's theme. For example, the Snake in the House of the Heart (position 24) = deception in love.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">What makes Lenormand different from Tarot?</h4>
            <p>Tarot uses 78 cards with complex symbolism, archetypes, and spiritual narratives. Lenormand uses 36 cards with simple, everyday images. Tarot asks "why" — Lenormand asks "what." Tarot explores the soul's journey; Lenormand tells you what to expect next week. Both are valid, but they speak different languages. Lenormand is faster, more specific, and less concerned with spiritual growth than with practical outcomes. It is the card system for people who want answers, not lessons.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── History Section (at bottom) ─── */
function HistorySection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-indigo-400/60" />
          <span className="text-xs font-semibold text-white/70">History of the Lenormand Deck</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          {LENORMAND_ORIGINS.map((section, i) => (
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

/* ─── Spread position preview ─── */
function SpreadPreview({ spreadType }: { spreadType: SpreadType }) {
  const spread = SPREAD_DEFS.find(s => s.type === spreadType)!;
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
      <h3 className="mb-3 text-[9px] uppercase tracking-[0.25em] text-zinc-600">
        {spread.name} — {spread.cardCount} cards
      </h3>
      <p className="text-[10px] text-zinc-500 mb-4">{spread.description}</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(spread.positions.length, 3)}, 1fr)` }}>
        {spread.positions.map((pos, i) => (
          <div key={i} className="rounded-lg bg-white/[0.02] p-2.5">
            <span className="text-[10px] font-bold text-indigo-400/80">{pos.name}</span>
            <p className="mt-0.5 text-[7px] text-zinc-600">{pos.subtitle}</p>
            <p className="mt-0.5 text-[7px] leading-relaxed text-zinc-500">{pos.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card Browser ─── */
function CardBrowser() {
  const [filter, setFilter] = useState("");
  const [detail, setDetail] = useState<LenormandCardDef | null>(null);
  const [reversed, setReversed] = useState(false);

  const filtered = useMemo(() => {
    return filter
      ? LENORMAND_CARDS.filter(c =>
          c.name.toLowerCase().includes(filter.toLowerCase()) ||
          c.keywords.some(k => k.includes(filter.toLowerCase())) ||
          c.cardEquivalent.toLowerCase().includes(filter.toLowerCase())
        )
      : LENORMAND_CARDS;
  }, [filter]);

  if (detail) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-16">
        <button
          onClick={() => setDetail(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-[10px] text-zinc-500 transition hover:text-zinc-300"
        >
          ← Back to all cards
        </button>
        <CardDetail card={detail} reversed={reversed} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <div className="mb-6">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search cards by name, keyword, or playing card..."
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/30 focus:bg-white/[0.04]"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(card => (
          <button
            key={card.id}
            onClick={() => { setDetail(card); setReversed(false); }}
            className="group rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 text-left transition hover:border-indigo-500/20 hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-600">#{card.id}</span>
              <span className="text-[8px] text-zinc-600">{card.cardEquivalent}</span>
            </div>
            <div className="my-2 text-center text-3xl">
              {card.glyph}
            </div>
            <h4 className="text-center text-sm font-semibold text-white/80">{card.name}</h4>
            <p className="mt-1 text-center text-[8px] text-zinc-500">{card.tradition}</p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-0.5">
              {card.keywords.slice(0, 3).map(kw => (
                <span key={kw} className="rounded border border-white/[0.03] px-1 py-0.5 text-[6px] text-zinc-600">
                  {kw}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-xs text-zinc-600">No cards match your search.</p>
      )}
    </div>
  );
}

/* ─── Grid display helper ─── */
function SpreadGrid({ cards, spreadType, positions }: {
  cards: { card: LenormandCardDef; reversed: boolean }[];
  spreadType: SpreadType;
  positions: { name: string; subtitle: string; desc: string }[];
}) {
  if (spreadType === "three") {
    return (
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {cards.map((c, i) => (
          <div key={i} style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.15}s both` }}>
            <LenormandCard card={c.card} reversed={c.reversed} position={positions[i]?.name} />
          </div>
        ))}
      </div>
    );
  }

  if (spreadType === "five_cross") {
    return (
      <div className="relative max-w-md mx-auto">
        {/* Center */}
        <div className="flex justify-center mb-3">
          {cards[0] && (
            <div style={{ animation: `fadeSlideIn 0.4s ease-out 0s both` }}>
              <LenormandCard card={cards[0].card} reversed={cards[0].reversed} position={positions[0]?.name} />
            </div>
          )}
        </div>
        {/* Four arms */}
        <div className="grid grid-cols-5 gap-2 items-start">
          <div />
          <div style={{ animation: `fadeSlideIn 0.4s ease-out 0.15s both` }}>
            {cards[1] && <LenormandCard card={cards[1].card} reversed={cards[1].reversed} position={positions[1]?.name} />}
          </div>
          <div />
          <div>
            {/* Empty center spot accounted for */}
          </div>
          <div />
          <div style={{ animation: `fadeSlideIn 0.4s ease-out 0.3s both` }}>
            {cards[3] && <LenormandCard card={cards[3].card} reversed={cards[3].reversed} position={positions[3]?.name} />}
          </div>
          <div />
          <div style={{ animation: `fadeSlideIn 0.4s ease-out 0.45s both` }}>
            {cards[4] && <LenormandCard card={cards[4].card} reversed={cards[4].reversed} position={positions[4]?.name} />}
          </div>
          <div />
          <div style={{ animation: `fadeSlideIn 0.4s ease-out 0.6s both` }}>
            {cards[2] && <LenormandCard card={cards[2].card} reversed={cards[2].reversed} position={positions[2]?.name} />}
          </div>
          <div />
        </div>
      </div>
    );
  }

  if (spreadType === "nine_grid") {
    return (
      <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
        {cards.map((c, i) => (
          <div key={i} style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.06}s both` }}>
            <LenormandCard card={c.card} reversed={c.reversed} position={positions[i]?.name} number={c.card.id} />
          </div>
        ))}
      </div>
    );
  }

  if (spreadType === "grand_tableau") {
    return (
      <div className="grid grid-cols-9 gap-1.5 max-w-6xl mx-auto">
        {cards.map((c, i) => (
          <div key={i} style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.015}s both` }}>
            <LenormandCard card={c.card} reversed={c.reversed} number={c.card.id} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

/* ─── Main Page ─── */
export function LenormandPage() {
  const [view, setView] = useState<"choose" | "cast" | "read" | "browse">("choose");
  const [spreadType, setSpreadType] = useState<SpreadType>("three");
  const [question, setQuestion] = useState("");
  const [castCards, setCastCards] = useState<{ card: LenormandCardDef; reversed: boolean }[]>([]);

  const spread = SPREAD_DEFS.find(s => s.type === spreadType)!;

  const doCast = useCallback(() => {
    const results = getRandomCards(spread.cardCount);
    setCastCards(results);
    setView("cast");
    setTimeout(() => setView("read"), 600);
  }, [spread.cardCount]);

  const reset = useCallback(() => {
    setCastCards([]);
    setQuestion("");
    setView("choose");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${BG}, #0d0d1a)` }}>
      <SeoHead
        title="Lenormand Cards · 36-Card Petit Lenormand"
        description="French cartomancy with the 36-card Petit Lenormand system. Grand Tableau, 3-card spreads, card pairs, and full authentic interpretations rooted in European tradition."
        path="/consult/lenormand"
      />

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardReveal { from { opacity: 0; transform: scale(0.8) rotateY(180deg); } to { opacity: 1; transform: scale(1) rotateY(0); } }
      `}</style>

      {/* Header */}
      <div className="border-b border-white/[0.03]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            All methods
          </Link>
          <span className="text-xs text-zinc-700">Lenormand · 36 cartes</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.03]">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${INDIGO} 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${GOLD} 0%, transparent 50%)`,
        }} />
        <div className="relative mx-auto max-w-3xl px-5 py-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-400/80">
            <Scroll className="h-3.5 w-3.5" />
            Petit Lenormand · 36 cartes
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {view === "choose" && "Lenormand Reading"}
            {view === "cast" && "Drawing Cards..."}
            {view === "read" && "The Cards Speak"}
            {view === "browse" && "All 36 Cards"}
          </h1>
          {view === "choose" && (
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500">
              The Petit Lenormand is a 36-card system of direct, practical divination. 
              Unlike Tarot's archetypal depth, Lenormand speaks plainly: this card next to that card 
              forms a sentence, and the sentence tells your story. Choose a spread and ask your question.
            </p>
          )}

          {/* Nav */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {view !== "choose" && (
              <button onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-[10px] text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
              >
                <RotateCcw className="h-3 w-3" />
                New Reading
              </button>
            )}
            <button onClick={() => setView(view === "browse" ? "choose" : "browse")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-wider transition ${
                view === "browse"
                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400/80"
                  : "border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              <Library className="h-3 w-3" />
              {view === "browse" ? "Back" : "Browse 36"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CHOOSE VIEW ── */}
      {view === "choose" && (
        <section className="mx-auto max-w-3xl px-5 py-8">
          <div className="mx-auto max-w-lg space-y-6">

            {/* How to Read */}
            <HowToRead />

            {/* Question */}
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Your Question <span className="text-zinc-800">(specific questions get specific answers)</span>
              </label>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What do you wish to know?"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/30 focus:bg-white/[0.04]"
              />
            </div>

            {/* Spread selection */}
            <div>
              <label className="mb-3 block text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Spread Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SPREAD_DEFS.map(sd => (
                  <button
                    key={sd.type}
                    onClick={() => setSpreadType(sd.type)}
                    className={`rounded-xl border p-3 text-left transition ${
                      spreadType === sd.type
                        ? "border-indigo-500/30 bg-indigo-500/10"
                        : "border-white/[0.04] bg-white/[0.015] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {sd.type === "three" && <LayoutGrid className={`h-3.5 w-3.5 ${spreadType === sd.type ? "text-indigo-400" : "text-zinc-600"}`} />}
                      {sd.type === "five_cross" && <Crosshair className={`h-3.5 w-3.5 ${spreadType === sd.type ? "text-indigo-400" : "text-zinc-600"}`} />}
                      {sd.type === "nine_grid" && <Layers className={`h-3.5 w-3.5 ${spreadType === sd.type ? "text-indigo-400" : "text-zinc-600"}`} />}
                      {sd.type === "grand_tableau" && <LayoutGrid className={`h-3.5 w-3.5 ${spreadType === sd.type ? "text-indigo-400" : "text-zinc-600"}`} />}
                      <span className={`text-xs font-medium ${spreadType === sd.type ? "text-indigo-300" : "text-zinc-400"}`}>
                        {sd.name.split(" (")[0]}
                      </span>
                    </div>
                    <p className="mt-1 text-[9px] text-zinc-600">{sd.cardCount} cards</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Spread details */}
            <SpreadPreview spreadType={spreadType} />

            {/* Cast button */}
            <div className="text-center">
              <button onClick={doCast}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-violet-800 px-8 py-4 text-sm font-bold text-white transition hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98]"
              >
                <Shuffle className="h-4 w-4" />
                Draw {spread.cardCount} Card{spread.cardCount > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── CAST VIEW ── */}
      {view === "cast" && (
        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <div className="inline-block animate-pulse text-6xl mb-4">🎴</div>
          <p className="text-sm text-zinc-500">The cards are being drawn...</p>
        </section>
      )}

      {/* ── READ VIEW ── */}
      {view === "read" && castCards.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-8">
          {question && (
            <div className="mb-8 text-center">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">Asked</p>
              <p className="mt-1 text-sm italic text-zinc-500">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Card grid */}
          <SpreadGrid cards={castCards} spreadType={spreadType} positions={spread.positions} />

          {/* Individual interpretations */}
          <div className="mt-10 mx-auto max-w-3xl space-y-6">
            {castCards.map((c, i) => {
              const pos = spread.positions[i];
              return (
                <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5"
                  style={{ animation: `fadeSlideIn 0.5s ease-out ${i * 0.12 + 0.3}s both` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-3xl ${c.reversed ? "rotate-180 scale-x-[-1]" : ""}`}>
                      {c.card.glyph}
                    </span>
                    <div>
                      {pos ? (
                        <>
                          <h3 className="text-sm font-bold text-white">{pos.name}</h3>
                          <p className="text-[9px] text-zinc-600">{pos.subtitle}</p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-sm font-bold text-white">{c.card.name}</h3>
                          <p className="text-[9px] text-zinc-600">Card #{c.card.id}</p>
                        </>
                      )}
                      <p className="text-[8px] text-zinc-700">#{c.card.id} · {c.card.name} · {c.card.cardEquivalent}</p>
                    </div>
                    {c.reversed && (
                      <span className="ml-auto rounded border border-red-900/30 bg-red-950/20 px-2 py-0.5 text-[8px] text-red-400/70">
                        Reversed
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-300">
                    {c.reversed ? c.card.reversedMeaning : c.card.meaning}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.card.keywords.map(kw => (
                      <span key={kw} className="rounded border border-white/[0.03] bg-white/[0.02] px-1.5 py-0.5 text-[8px] text-zinc-600">
                        {kw}
                      </span>
                    ))}
                    <span className="rounded border border-white/[0.03] bg-white/[0.02] px-1.5 py-0.5 text-[8px] text-zinc-600">
                      {c.card.cardEquivalent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pair interpretations (essential Lenormand technique) */}
          {castCards.length >= 2 && (
            <div className="mt-10 mx-auto max-w-3xl">
              <div className="mb-4 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-400/60">Card Combinations</span>
                <p className="mt-1 text-[10px] text-zinc-600">
                  In Lenormand, cards are read in pairs. The combination of two adjacent cards creates a specific meaning that refines and focuses each individual card.
                </p>
              </div>
              <div className="space-y-3">
                {Array.from({ length: castCards.length - 1 }).map((_, i) => (
                  <PairInterpretation key={i} cardA={castCards[i].card} cardB={castCards[i + 1].card} />
                ))}
              </div>
            </div>
          )}

          {/* Spread-specific guidance */}
          {spreadType === "three" && (
            <div className="mx-auto mt-8 max-w-lg text-center">
              <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.03] p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">Reading the Three Cards</p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                  Read the three cards as a sentence: Card 1 (Past) + Card 2 (Present) = the situation as it stands. 
                  Card 2 (Present) + Card 3 (Future) = where it is heading. All three together = the full story.
                  Each pair tells a mini-story within the larger narrative.
                </p>
              </div>
            </div>
          )}

          {spreadType === "five_cross" && (
            <div className="mx-auto mt-8 max-w-lg text-center">
              <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.03] p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">Reading the Cross</p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                  The center card (1) is the core of the matter. Above (2) is the conscious goal, below (3) is the hidden root. 
                  Left (4) is what fades, right (5) is what approaches. Read vertically and horizontally: 
                  the cross reveals how the situation is structured, not just sequenced.
                </p>
              </div>
            </div>
          )}

          {spreadType === "nine_grid" && (
            <div className="mx-auto mt-8 max-w-lg text-center">
              <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.03] p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">Reading the 3×3 Grid</p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                  Read by <strong>rows</strong> (top = outer world, middle = present dynamic, bottom = hidden/subconscious), 
                  by <strong>columns</strong> (left = past, center = core, right = future), 
                  and by <strong>diagonals</strong> (hidden influences crossing the grid). 
                  The center card (position 5) is the still point — the truth at the heart of the reading.
                </p>
              </div>
            </div>
          )}

          {spreadType === "grand_tableau" && (
            <div className="mx-auto mt-8 max-w-lg text-center">
              <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.03] p-4">
                <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">Reading the Grand Tableau</p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                  The Grand Tableau is the pinnacle of Lenormand reading. All 36 cards in a 9×4 grid. 
                  Each position is the "house" of the card whose number matches that position, coloring the card that lands there. 
                  Read the flow from top-left to bottom-right. Find the significator (Man or Woman card) and read what surrounds it. 
                  Mirror across axes. Knight (L-move) between distant cards. The Grand Tableau tells the full story.
                </p>
              </div>
            </div>
          )}

          {/* Bottom guidance */}
          <div className="mx-auto mt-8 max-w-lg text-center">
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
              <Info className="h-4 w-4 mx-auto text-indigo-400/40 mb-2" />
              <p className="text-[9px] leading-relaxed text-zinc-600">
                Lenormand cards are read as a narrative, not a collection of isolated meanings. 
                Each card modifies and is modified by its neighbors. The story is in the combination — 
                the sentence formed by the cards together. Read the pairs, read the flow, 
                and remember: Lenormand speaks plainly. Trust what the cards say, not what you hope they will say.
              </p>
            </div>
          </div>

        </section>
      )}

      {/* ── HISTORY SECTION (always visible at bottom) ── */}
      <div className="mx-auto max-w-3xl px-5 pb-16 mt-8">
        <HistorySection />
      </div>

      {/* ── BROWSE VIEW ── */}
      {view === "browse" && <CardBrowser />}

    </div>
  );
}
