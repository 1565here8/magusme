import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Book, Coins, ScrollText, ChevronDown, ChevronUp, Asterisk, TriangleAlert, ArrowRightLeft, Layers, Compass, Lightbulb, BookOpenText, CircleHelp, Binary, Braces } from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  HEXAGRAMS, TRIGRAMS, tossCoins, hexagramByNumber, hexagramByBinary,
  getNuclearHexagram, buildHexagramBinary, buildSecondaryBinary,
  trigramFromBinary,
  type HexagramDef, type CoinTossResult, type TrigramDef,
} from "./ichingData";

/* ─── Theme colors ─── */
const CINNABAR = "#c43a31";
const CINNABAR_DIM = "rgba(196,58,49,0.7)";
const GOLD = "#c8a45c";
const JADE = "#5b8c5a";
const INK_BG = "#0f0f0f";
const INK_CARD = "rgba(20,20,20,0.8)";

/* ─── Line position meanings ─── */
const LINE_POSITIONS = [
  { pos: "Line 1", name: "The Beginning", desc: "The hidden first stage. Potential not yet visible. Humble origins, the seed of what is unfolding." },
  { pos: "Line 2", name: "Inner Virtue", desc: "The inner self. Personal character, integrity, what you carry within. Your true nature in this situation." },
  { pos: "Line 3", name: "The Threshold", desc: "The crisis point. A transition between inner and outer. Danger, effort, vigilance required. Where you are tested." },
  { pos: "Line 4", name: "The Advisor", desc: "Near authority. The role of service, preparation, counsel. The moment just before full expression." },
  { pos: "Line 5", name: "The Ruler", desc: "The central position. Mastery, leadership, power manifested. The heart of the matter, where the theme expresses most clearly." },
  { pos: "Line 6", name: "The Culmination", desc: "The peak and the turning point. Excess, retreat, completion. The energy has reached its limit and must transform." },
];

/* ─── Line value definitions ─── */
const LINE_VALUES = [
  { value: 6, name: "Old Yin", symbol: "⚋", marker: "✕", yin: true, changing: true, meaning: "Changing Yin. transforms into a Yang line. This energy is in flux, about to turn." },
  { value: 7, name: "Young Yang", symbol: "⚊", marker: "", yin: false, changing: false, meaning: "Stable Yang. firm, strong energy that stays as it is." },
  { value: 8, name: "Young Yin", symbol: "⚋", marker: "", yin: true, changing: false, meaning: "Stable Yin. receptive, yielding energy that stays as it is." },
  { value: 9, name: "Old Yang", symbol: "⚊", marker: "○", yin: false, changing: true, meaning: "Changing Yang. transforms into a Yin line. This energy has reached fullness and is turning." },
];

/* ─── Glossary tooltip data ─── */
const GLOSSARY: Record<string, string> = {
  hexagram: "A six-line figure (stack of 6 yin or yang lines) that represents a specific life situation. There are 64 possible hexagrams, each with a unique name and meaning.",
  trigram: "A three-line figure. Each hexagram is made of two trigrams: an upper (outer) and lower (inner) trigram. There are 8 trigrams, each representing a natural force (Heaven, Earth, Thunder, etc.).",
  judgment: "The primary oracle text for the hexagram. It gives the overall answer, the central message of the situation.",
  image: "A poetic description of how the hexagram's pattern appears in nature. It shows how the principle operates in the world and how to apply its wisdom.",
  changingLine: "A line with value 6 (Old Yin) or 9 (Old Yang). These are 'old' energies that are about to transform into their opposite. Changing lines indicate where the action, tension, or transformation is happening in your reading.",
  secondaryHexagram: "The hexagram that emerges when you swap every changing line to its opposite. It shows the direction your situation is moving. what is becoming.",
  nuclearHexagram: "The 'inner core' hexagram formed by lines 2-5 of the primary hexagram. It reveals the hidden dynamic at work inside the situation.",
};

/* ─── Line component ─── */
function YangLine({ changing, delay, label }: { changing: boolean; delay: number; label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1" style={{ animation: `fadeSlideIn 0.4s ease-out ${delay}s both` }}>
      <div className={`h-1.5 flex-1 rounded-full ${changing ? "bg-[#c43a31]" : "bg-white/80"}`} />
      {changing && <span className="text-[9px] font-mono text-[#c43a31]" title="Changing line. this yang line will become yin">○</span>}
      {label && <span className="text-[7px] text-zinc-600 w-16 text-right">{label}</span>}
    </div>
  );
}

function YinLine({ changing, delay, label }: { changing: boolean; delay: number; label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1" style={{ animation: `fadeSlideIn 0.4s ease-out ${delay}s both` }}>
      <div className={`h-1.5 w-[42%] rounded-full ${changing ? "bg-[#c43a31]" : "bg-white/40"}`} />
      <div className="flex-1" />
      <div className={`h-1.5 w-[42%] rounded-full ${changing ? "bg-[#c43a31]" : "bg-white/40"}`} />
      {changing && <span className="text-[9px] font-mono text-[#c43a31]" title="Changing line. this yin line will become yang">✕</span>}
      {label && <span className="text-[7px] text-zinc-600 w-16 text-right">{label}</span>}
    </div>
  );
}

/* ─── Trigram info popout ─── */
function TrigramInfoCard({ tri, label }: { tri: TrigramDef; label: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-3 min-w-0">
      <span className="text-[7px] uppercase tracking-wider text-zinc-600">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xl">{tri.symbol}</span>
        <div>
          <div className="text-xs font-semibold text-white/80">{tri.name}</div>
          <div className="text-[8px] text-zinc-500">{tri.pinyin} · {tri.chinese}</div>
        </div>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[8px] text-zinc-600">
        <span>Family: {tri.family}</span>
        <span>Element: {tri.element}</span>
        <span>Direction: {tri.directionPost}</span>
        <span>Nature: {tri.attribute}</span>
      </div>
    </div>
  );
}

/* ─── Hexagram figure ─── */
function HexagramFigure({ hexagram, tosses, label }: {
  hexagram: HexagramDef;
  tosses?: CoinTossResult[];
  label?: string;
}) {
  const upperTri = trigramFromBinary(hexagram.binary.substring(0, 3));
  const lowerTri = trigramFromBinary(hexagram.binary.substring(3, 6));
  const lines = hexagram.binary.split("").reverse();

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500">{label}</span>}
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-0.5 pt-6">
          <span className="text-xl leading-none opacity-50">{upperTri.symbol}</span>
          <span className="text-[7px] text-zinc-600">{upperTri.name}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-3">
            <div className="flex flex-col gap-0.5" style={{ minWidth: 72 }}>
              {[5, 4, 3, 2, 1, 0].map((li) => {
                const isYang = lines[li] === "1";
                const ch = tosses ? tosses[5 - li]?.isChanging ?? false : false;
                const posLabel = LINE_POSITIONS[li]?.name;
                return isYang
                  ? <YangLine key={li} changing={ch} delay={(5 - li) * 0.15} label={posLabel} />
                  : <YinLine key={li} changing={ch} delay={(5 - li) * 0.15} label={posLabel} />;
              })}
            </div>
          </div>
          <div className="mt-1.5 flex flex-col items-center">
            <span className="text-[9px] font-bold tracking-wider text-white/60">
              {hexagram.number}. {hexagram.name}
            </span>
            <span className="text-[8px] text-zinc-600 font-mono">{hexagram.pinyin} · {hexagram.chinese}</span>
            <span className="mt-0.5 text-[7px] text-zinc-700 font-mono">
              Binary: {hexagram.binary} (top→bottom)
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5 pt-6">
          <span className="text-xl leading-none opacity-50">{lowerTri.symbol}</span>
          <span className="text-[7px] text-zinc-600">{lowerTri.name}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Trigram badge (small inline) ─── */
function TrigramBadge({ tri }: { tri: TrigramDef }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[9px] text-zinc-400">
      <span>{tri.symbol}</span>
      <span>{tri.name} ({tri.pinyin})</span>
      <span className="text-zinc-600">· {tri.element} · {tri.directionPost}</span>
    </span>
  );
}

/* ─── Glossary term ─── */
function GlossaryTerm({ term, children }: { term: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline">
      <button
        onClick={() => setOpen(!open)}
        className="border-b border-dotted border-[#c43a31]/40 text-[#c43a31]/80 hover:text-[#c43a31] transition cursor-help text-xs font-medium"
      >
        {children}
      </button>
      {open && (
        <div className="absolute z-10 left-0 top-5 mt-1 w-64 rounded-lg border border-white/[0.08] bg-[#1a1a1a] p-3 text-left shadow-2xl text-[10px] leading-relaxed text-zinc-400">
          <span className="font-bold text-white/70 block mb-0.5">{children}</span>
          {GLOSSARY[term]}
        </div>
      )}
    </span>
  );
}

/* ─── Section divider ─── */
function SectionIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c43a31]/10 border border-[#c43a31]/20">
        <Icon className="h-3 w-3 text-[#c43a31]/70" />
      </div>
      <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">{label}</span>
    </div>
  );
}

/* ─── Info callout ─── */
function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2 text-[9px] leading-relaxed text-zinc-600">
      <CircleHelp className="h-3 w-3 mt-0.5 shrink-0 text-zinc-600" />
      <span>{children}</span>
    </div>
  );
}

/* ─── How to Read section ─── */
function HowToRead() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2">
          <BookOpenText className="h-3.5 w-3.5 text-[#c43a31]/60" />
          <span className="text-xs font-semibold text-white/70">How the I Ching Works</span>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-zinc-600" /> : <ChevronDown className="h-3 w-3 text-zinc-600" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 text-[10px] leading-relaxed text-zinc-500">
          <div>
            <h4 className="font-bold text-white/60 mb-1">What is the I Ching?</h4>
            <p>The I Ching (易經), or <em>Book of Changes</em>, is one of the oldest Chinese classics. over 3,000 years old. It is both a philosophical text and an oracle. At its core is a simple insight: all situations follow predictable patterns of change, and by understanding the pattern of the present moment, you can navigate wisely.</p>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">How does casting work?</h4>
            <p>You ask a question and toss three coins six times. Each toss builds one line of a hexagram (a six-line figure). The coin values add up to 6, 7, 8, or 9. each number has a specific meaning, and some lines are "changing" (the energy is in motion). The six lines together form a hexagram that describes your situation.</p>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">What do the numbers mean?</h4>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {LINE_VALUES.map(lv => (
                <div key={lv.value} className="rounded border border-white/[0.04] bg-white/[0.01] px-2 py-1.5">
                  <span className="font-mono font-bold text-white/70">{lv.value}</span>
                  <span className="ml-1.5 text-white/40">{lv.symbol}</span>
                  <span className="ml-1.5 font-medium" style={{ color: lv.changing ? CINNABAR : undefined }}>{lv.name}</span>
                  <p className="text-[8px] text-zinc-600 mt-0.5">{lv.meaning}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-zinc-600">Heads = 3, Tails = 2. Three coins: 3+2+2 = 7 (Young Yang), 3+3+3 = 9 (Old Yang), 2+2+2 = 6 (Old Yin), 3+3+2 = 8 (Young Yin).</p>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">What is a hexagram?</h4>
            <p>A hexagram is a stack of six lines, read from the <strong>bottom up</strong> (line 1 is the first coin toss). It splits into two trigrams of three lines each: the lower trigram (lines 1-3, the inner self) and the upper trigram (lines 4-6, the outer world). The interaction between the two trigrams tells the story of the situation.</p>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">Parts of a reading</h4>
            <ul className="space-y-1 mt-1">
              <li><strong className="text-white/50">The Judgment</strong>. The overall answer. The central message of the hexagram.</li>
              <li><strong className="text-white/50">The Image</strong>. A natural metaphor showing how this principle works in the world, and how to apply it.</li>
              <li><strong className="text-white/50">Changing Lines</strong>. Lines that are 6 or 9. They show where transformation is happening. Each changing line has its own message.</li>
              <li><strong className="text-white/50">The Secondary Hexagram</strong>. What the situation is turning into. Created by flipping all changing lines to their opposite.</li>
              <li><strong className="text-white/50">The Nuclear Hexagram</strong>. The hidden inner dynamic, formed by lines 2-5.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white/60 mb-1">Line positions</h4>
            <p>Each of the six lines has a traditional meaning based on its position:</p>
            <div className="grid gap-1.5 mt-1">
              {[...LINE_POSITIONS].reverse().map(lp => (
                <div key={lp.pos} className="flex items-start gap-2 rounded border border-white/[0.03] bg-white/[0.005] px-2 py-1">
                  <span className="shrink-0 font-mono font-bold text-[#c43a31]/60 text-[8px] w-12">{lp.pos}</span>
                  <div>
                    <span className="font-bold text-white/50 text-[9px]">{lp.name}</span>
                    <p className="text-[8px] text-zinc-600">{lp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Hexagram reading (full interpretation) ─── */
function HexagramReading({ hexagram, tosses }: { hexagram: HexagramDef; tosses: CoinTossResult[] }) {
  const upperTri = trigramFromBinary(hexagram.binary.substring(0, 3));
  const lowerTri = trigramFromBinary(hexagram.binary.substring(3, 6));
  const nuclear = getNuclearHexagram(hexagram);
  const changingLines = tosses.filter(t => t.isChanging);
  const binarySplit = hexagram.binary;

  return (
    <div className="mx-auto max-w-2xl space-y-8">

      {/* ── 1. Hexagram Identity ── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c43a31]/15 bg-[#c43a31]/5 px-3 py-1 text-[9px] text-[#c43a31]/60 mb-3">
          <ScrollText className="h-3 w-3" />
          Hexagram {hexagram.number}
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">{hexagram.name}</h2>
        <p className="mt-1 text-xs text-zinc-500">{hexagram.pinyin} · {hexagram.chinese}</p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <TrigramBadge tri={upperTri} />
          <TrigramBadge tri={lowerTri} />
        </div>

        {/* Binary breakdown */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[8px] font-mono text-zinc-700">
          <Binary className="h-3 w-3" />
          <span>Upper trigram: {binarySplit.substring(0, 3)} ({upperTri.name})</span>
          <span className="text-zinc-800">·</span>
          <span>Lower trigram: {binarySplit.substring(3, 6)} ({lowerTri.name})</span>
        </div>
      </div>

      {/* ── 2. Structure: Upper & Lower Trigrams ── */}
      <div>
        <SectionIcon icon={Layers} label="Hexagram Structure" />
        <div className="grid grid-cols-2 gap-3">
          <TrigramInfoCard tri={upperTri} label="Upper Trigram (Outer World)" />
          <TrigramInfoCard tri={lowerTri} label="Lower Trigram (Inner Self)" />
        </div>
        <InfoCallout>
          <GlossaryTerm term="trigram">Trigrams</GlossaryTerm> combine to tell a story: the <strong>upper trigram</strong> ({upperTri.name}) represents the outer situation, what is visible to others. The <strong>lower trigram</strong> ({lowerTri.name}) represents your inner state. your character, your foundation. {upperTri.name} over {lowerTri.name}: {upperTri.attribute.toLowerCase()} over {lowerTri.attribute.toLowerCase()}.
        </InfoCallout>
      </div>

      {/* ── 3. The Judgment ── */}
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-5">
        <SectionIcon icon={Compass} label="The Oracle's Answer" />
        <blockquote className="text-sm italic leading-relaxed text-zinc-300 border-l-2 border-[#c43a31]/30 pl-4">
          &ldquo;{hexagram.judgment}&rdquo;
        </blockquote>
        <InfoCallout>
          <GlossaryTerm term="judgment">The Judgment</GlossaryTerm> is the central message of this hexagram. the oracle's direct answer to your situation. It describes the overall quality of the moment and gives guidance on how to proceed. Read it as the keynote of your reading.
        </InfoCallout>
      </div>

      {/* ── 4. The Image ── */}
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-5">
        <SectionIcon icon={Lightbulb} label="Nature's Pattern" />
        <blockquote className="text-sm italic leading-relaxed text-zinc-300 border-l-2 border-[#5b8c5a]/30 pl-4">
          &ldquo;{hexagram.image}&rdquo;
        </blockquote>
        <InfoCallout>
          <GlossaryTerm term="image">The Image</GlossaryTerm> shows how this hexagram's principle appears in nature. It is a metaphor for how to apply the wisdom in your own life. The "superior man" referenced is an ideal. the person who acts in harmony with the Tao.
        </InfoCallout>
      </div>

      {/* ── 5. Changing Lines ── */}
      {changingLines.length > 0 && (
        <div className="rounded-xl border border-[#c43a31]/20 bg-[#c43a31]/[0.02] p-5">
          <SectionIcon icon={TriangleAlert} label="Where Energy is Moving" />
          <p className="text-[9px] text-zinc-600 mb-4">
            {changingLines.length === 1
              ? "One line is changing. This is where the central energy of your reading is focused. the place where transformation is active."
              : `${changingLines.length} lines are changing. Each one reveals a different facet of how your situation is transforming. Read them in order: they describe the arc of change.`}
          </p>
          <div className="space-y-4">
            {tosses.map((t, i) => {
              if (!t.isChanging) return null;
              const lineIdx = 5 - i;
              const lineText = hexagram.lines[lineIdx];
              const posInfo = LINE_POSITIONS[lineIdx];
              const lv = LINE_VALUES.find(l => l.value === t.value)!;
              return (
                <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#c43a31] font-mono">Line {lineIdx + 1}</span>
                    <span className="rounded bg-[#c43a31]/10 px-1.5 py-0.5 text-[8px] font-mono text-[#c43a31]/70">{t.value} {lv.symbol}</span>
                    <span className="text-[9px] text-zinc-500">{posInfo.name}</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 mb-1.5 italic">
                    <GlossaryTerm term="changingLine">Changing line</GlossaryTerm>: {lv.name} ({t.value}) → {t.isYang ? "Yin" : "Yang"}
                  </p>
                  <p className="text-[9px] text-zinc-600 mb-1">
                    <strong>Position meaning: </strong>{posInfo.desc}
                  </p>
                  <blockquote className="text-xs italic leading-relaxed text-zinc-400 border-l-2 border-zinc-700 pl-3">
                    &ldquo;{lineText}&rdquo;
                  </blockquote>
                  <p className="mt-1.5 text-[9px] text-zinc-600">
                    <strong>What this indicates: </strong>
                    This line is at the <em>{posInfo.name}</em> position. The energy here is {t.isYang ? "yang (active, firm)" : "yin (receptive, yielding)"} but it is <em>old</em>. it has reached its peak and is transforming into its opposite. Pay close attention to this area of your life or situation.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6. No changing lines ── */}
      {changingLines.length === 0 && (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 text-center">
          <SectionIcon icon={Asterisk} label="No Changing Lines" />
          <p className="text-[9px] text-zinc-600">
            No lines are changing. This means the situation is <strong>stable</strong>. the energy is not in flux. Focus on the Judgment and Image alone. The hexagram describes the situation as it is, without a trajectory of change. This is rare: it suggests a moment of stillness, clarity, or equilibrium.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Secondary hexagram ─── */
function SecondaryView({ primary, secondary, tosses }: {
  primary: HexagramDef;
  secondary: HexagramDef;
  tosses: CoinTossResult[];
}) {
  const changingCount = tosses.filter(t => t.isChanging).length;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center mb-6">
        <SectionIcon icon={ArrowRightLeft} label="Transformation" />
        <p className="text-[9px] text-zinc-600">
          {changingCount === 1 ? "1 line changes" : `${changingCount} lines change`}, transforming the situation into something new
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <HexagramFigure hexagram={primary} tosses={tosses} label="Primary (Now)" />
        <div className="flex flex-col items-center">
          <span className="text-2xl text-zinc-600 hidden sm:inline">→</span>
          <span className="text-sm text-zinc-600 sm:hidden">↓</span>
          <span className="text-[8px] text-zinc-700 mt-1">transforms to</span>
        </div>
        <HexagramFigure hexagram={secondary} label="Secondary (Becoming)" />
      </div>

      {/* Secondary judgment */}
      <div className="mt-6 mx-auto max-w-2xl">
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-5">
          <SectionIcon icon={Compass} label="Secondary. Where You Are Heading" />
          <p className="text-[9px] text-zinc-600 mb-3">
            <GlossaryTerm term="secondaryHexagram">The Secondary Hexagram</GlossaryTerm> shows what your situation is <em>becoming</em>. It emerges naturally as the changing lines transform. This is not a different answer. it is the continuation of the story, the direction of movement.
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-white/70">{secondary.number}. {secondary.name}</span>
            <span className="text-[9px] text-zinc-500">{secondary.pinyin} · {secondary.chinese}</span>
          </div>
          <blockquote className="text-sm italic leading-relaxed text-zinc-300 border-l-2 border-[#c43a31]/30 pl-4">
            &ldquo;{secondary.judgment}&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}

/* ─── Nuclear hexagram ─── */
function NuclearSection({ hexagram }: { hexagram: HexagramDef }) {
  const nuclear = getNuclearHexagram(hexagram);
  const upperNucTri = trigramFromBinary(nuclear.binary.substring(0, 3));
  const lowerNucTri = trigramFromBinary(nuclear.binary.substring(3, 6));
  const nucBinary = hexagram.binary.substring(2, 5) + hexagram.binary.substring(1, 4);

  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
      <SectionIcon icon={Braces} label="Inner Core. Nuclear Hexagram" />
      <p className="text-[9px] text-zinc-600 mb-3">
        <GlossaryTerm term="nuclearHexagram">The Nuclear Hexagram</GlossaryTerm> is formed from lines 2-5 of the primary hexagram (the "inner" lines). It reveals the hidden dynamic, the inner machinery of the situation. what is going on beneath the surface.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-2">
          <span className="text-sm opacity-50">{upperNucTri.symbol}</span>
          <span className="text-sm opacity-50">{lowerNucTri.symbol}</span>
          <div>
            <span className="text-xs font-semibold text-white/60">{nuclear.number}. {nuclear.name}</span>
            <span className="ml-1.5 text-[9px] text-zinc-500">{nuclear.pinyin}</span>
          </div>
        </div>
        <span className="text-[9px] text-zinc-600 italic">{nuclear.judgment}</span>
      </div>
      <div className="mt-2 text-[8px] text-zinc-700 font-mono">
        Formed from lines 2-5: ({nucBinary.substring(0, 3)} over {nucBinary.substring(3, 6)})
      </div>
    </div>
  );
}

/* ─── Coin toss ─── */
function CoinTossAnimation({ onComplete }: { onComplete: (tosses: CoinTossResult[]) => void }) {
  const [phase, setPhase] = useState<"idle" | "tossing" | "done">("idle");
  const [tosses, setTosses] = useState<CoinTossResult[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const doToss = useCallback(() => {
    setPhase("tossing");
    setCurrentLine(0);
    const results = tossCoins();
    setTosses(results);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentLine(i);
      if (i >= 6) {
        clearInterval(interval);
        setPhase("done");
        setTimeout(() => onComplete(results), 800);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="space-y-4">
      {phase === "idle" && (
        <div className="text-center">
          <button onClick={doToss}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#c43a31]/20 to-[#c43a31]/10 border border-[#c43a31]/30 px-6 py-3.5 text-sm font-medium text-[#c43a31] transition-all hover:bg-[#c43a31]/30 hover:border-[#c43a31]/50 active:scale-[0.98]"
          >
            <Coins className="h-4 w-4 transition group-hover:rotate-12" />
            Cast the Three Coins
          </button>
          <p className="mt-2 text-[9px] text-zinc-600">Six tosses build one hexagram from bottom to top</p>
        </div>
      )}

      {(phase === "tossing" || phase === "done") && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-0.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#c43a31]/50 transition-all duration-500"
                style={{ width: `${(currentLine / 6) * 100}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-zinc-600 w-16 text-right">
              {phase === "tossing" ? `Line ${6 - currentLine + 1} of 6` : "Complete"}
            </span>
          </div>

          {/* Line results */}
          <div className="grid grid-cols-6 gap-2">
            {tosses.slice(0, currentLine).map((t, i) => {
              const lv = LINE_VALUES.find(l => l.value === t.value)!;
              const lineNum = 6 - i;
              return (
                <div key={i}
                  className={`rounded-lg border px-2 py-2 text-center transition-all duration-300 ${
                    t.isChanging
                      ? "border-[#c43a31]/40 bg-[#c43a31]/10"
                      : "border-white/[0.06] bg-white/[0.02]"
                  }`}
                  style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 0.1}s both` }}
                >
                  <div className="text-[8px] font-mono text-zinc-500">Line {lineNum}</div>
                  <div className={`text-lg font-mono font-bold my-0.5 ${t.isChanging ? "text-[#c43a31]" : "text-white/60"}`}>
                    {lv.symbol}
                  </div>
                  <div className={`text-[9px] font-bold ${t.isChanging ? "text-[#c43a31]/80" : "text-zinc-400"}`}>
                    {t.value}
                  </div>
                  <div className="text-[7px] text-zinc-600 leading-tight">{lv.name}</div>
                  {t.isChanging && <div className="text-[7px] text-[#c43a31]/60 mt-0.5">→ changes</div>}
                </div>
              );
            })}
            {/* Placeholder for incomplete lines */}
            {currentLine < 6 && phase === "tossing" && (
              Array.from({length: 6 - currentLine}).map((_, idx) => (
                <div key={`ph-${idx}`}
                  className="rounded-lg border border-white/[0.02] bg-white/[0.005] px-2 py-2 text-center"
                >
                  <div className="text-[8px] text-zinc-800">Tossing...</div>
                  <div className="text-lg my-0.5 text-zinc-800">
                    <div className="h-4 w-4 mx-auto animate-pulse rounded bg-zinc-800" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Line value cheat sheet */}
          <div className="grid grid-cols-4 gap-1.5">
            {LINE_VALUES.map(lv => (
              <div key={lv.value} className={`rounded px-1.5 py-1 text-center border ${
                tosses.slice(0, currentLine).some(t => t.value === lv.value)
                  ? "border-[#c43a31]/15 bg-[#c43a31]/5"
                  : "border-white/[0.02] bg-white/[0.005]"
              }`}>
                <span className="font-mono text-xs font-bold" style={{ color: lv.changing ? CINNABAR : "rgba(255,255,255,0.5)" }}>{lv.value}</span>
                <span className="ml-1 text-[9px] text-zinc-600">{lv.symbol}</span>
                <span className="ml-1 text-[7px] text-zinc-600">{lv.name}</span>
              </div>
            ))}
          </div>

          {phase === "done" && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <div className="h-1 w-1 rounded-full bg-[#c43a31]" />
                Hexagram built. {tosses.filter(t => t.isChanging).length} changing line{tosses.filter(t => t.isChanging).length !== 1 ? "s" : ""}
              </div>
              <p className="text-[8px] text-zinc-700">Lines cast from bottom (line 1) to top (line 6). Lower trigram = lines 1-3, upper trigram = lines 4-6.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Browse all hexagrams ─── */
function HexagramBrowser() {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<HexagramDef | null>(null);
  const filtered = filter
    ? HEXAGRAMS.filter(h =>
        h.name.toLowerCase().includes(filter.toLowerCase()) ||
        h.pinyin.toLowerCase().includes(filter.toLowerCase()) ||
        h.number.toString().includes(filter) ||
        h.chinese.includes(filter) ||
        h.judgment.toLowerCase().includes(filter.toLowerCase())
      )
    : HEXAGRAMS;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <div className="mb-6">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search by name, number, keyword, or judgment text..."
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c43a31]/30 focus:bg-white/[0.04]"
        />
      </div>

      {/* Selected detail */}
      {selected && (
        <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5">
          <div className="flex items-start gap-4">
            <HexagramFigure hexagram={selected} />
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-bold text-white">{selected.number}. {selected.name}</h3>
              <p className="text-[10px] text-zinc-500">{selected.pinyin} · {selected.chinese}</p>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-600">Judgment</span>
                  <p className="text-[11px] italic text-zinc-400">&ldquo;{selected.judgment}&rdquo;</p>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-600">Image</span>
                  <p className="text-[11px] italic text-zinc-400">&ldquo;{selected.image}&rdquo;</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="mt-3 text-[9px] text-zinc-600 hover:text-zinc-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((h) => {
          const upperTri = trigramFromBinary(h.binary.substring(0, 3));
          const lowerTri = trigramFromBinary(h.binary.substring(3, 6));
          return (
            <button key={h.number}
              onClick={() => setSelected(selected?.number === h.number ? null : h)}
              className="text-left rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 transition hover:border-white/10 hover:bg-white/[0.03] active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[8px] font-mono text-zinc-600">#{h.number}</span>
                  <h4 className="text-sm font-semibold text-white/90">{h.name}</h4>
                  <p className="text-[9px] text-zinc-500">{h.pinyin} · {h.chinese}</p>
                </div>
                <div className="flex gap-1 text-sm opacity-40">
                  <span>{upperTri.symbol}</span>
                  <span>{lowerTri.symbol}</span>
                </div>
              </div>
              <p className="mt-2 text-[10px] italic leading-relaxed text-zinc-600 line-clamp-2">
                {h.judgment}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-600">{upperTri.name}</span>
                <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-600">{lowerTri.name}</span>
                <span className="rounded border border-white/[0.04] px-1.5 py-0.5 text-[7px] text-zinc-700 font-mono">{h.binary}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function IChingPage() {
  const [view, setView] = useState<"cast" | "read" | "browse">("cast");
  const [question, setQuestion] = useState("");
  const [tosses, setTosses] = useState<CoinTossResult[] | null>(null);
  const [primary, setPrimary] = useState<HexagramDef | null>(null);
  const [secondary, setSecondary] = useState<HexagramDef | null>(null);

  const handleCastComplete = useCallback((results: CoinTossResult[]) => {
    setTosses(results);
    const bin = buildHexagramBinary(results);
    const p = hexagramByBinary(bin);
    setPrimary(p);
    const secBin = buildSecondaryBinary(results);
    setSecondary(secBin ? hexagramByBinary(secBin) : null);
    setView("read");
  }, []);

  const reset = useCallback(() => {
    setTosses(null);
    setPrimary(null);
    setSecondary(null);
    setQuestion("");
    setView("cast");
  }, []);

  const upperTri = primary ? trigramFromBinary(primary.binary.substring(0, 3)) : null;
  const lowerTri = primary ? trigramFromBinary(primary.binary.substring(3, 6)) : null;

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${INK_BG}, #0a0a0a)` }}>
      <SeoHead title="I Ching · Book of Changes" description="Ancient Chinese oracle. cast three coins or yarrow stalks for hexagram guidance from the 64 hexagrams of the Yì Jīng" path="/consult/iching" />

      {/* Header */}
      <div className="border-b border-white/[0.03]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/consult" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            All methods
          </Link>
          <span className="text-xs text-zinc-700">I Ching · 易經</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative border-b border-white/[0.03] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${CINNABAR} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${JADE} 0%, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c43a31]/20 bg-[#c43a31]/10 px-4 py-1.5 text-xs text-[#c43a31]/80">
            <ScrollText className="h-3.5 w-3.5" />
            易經 · Book of Changes
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            {view === "cast" && "Consult the I Ching"}
            {view === "read" && primary?.name}
            {view === "browse" && "All 64 Hexagrams"}
          </h1>

          {/* Subtitle for each view */}
          {view === "cast" && (
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-500">
              The I Ching reveals the pattern of the present moment. Cast three coins six times to build a hexagram. the oracle speaks through lines of yin and yang, change and stability.
            </p>
          )}
          {view === "read" && primary && (
            <div className="mx-auto mt-2 space-y-1">
              <p className="text-xs text-zinc-600">
                Hexagram {primary.number} · {primary.pinyin} · {primary.chinese}
              </p>
              {upperTri && lowerTri && (
                <p className="text-[9px] text-zinc-700">
                  {upperTri.name} ({upperTri.symbol}) over {lowerTri.name} ({lowerTri.symbol}) · Binary: {primary.binary}
                </p>
              )}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {view !== "cast" && (
              <button onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-4 py-1.5 text-[10px] text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
              >
                <Coins className="h-3 w-3" />
                New Cast
              </button>
            )}
            <button onClick={() => setView(view === "browse" ? "cast" : "browse")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-wider transition ${
                view === "browse"
                  ? "border-[#c43a31]/30 bg-[#c43a31]/10 text-[#c43a31]/80"
                  : "border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              <Book className="h-3 w-3" />
              {view === "browse" ? "Back" : "Browse 64"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CAST VIEW ── */}
      {view === "cast" && (
        <section className="mx-auto max-w-3xl px-5 py-8">
          <div className="mx-auto max-w-xl space-y-6">

            {/* How to Read (collapsible guide) */}
            <HowToRead />

            {/* Question input */}
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Your Question <span className="text-zinc-800">(optional, but helps focus)</span>
              </label>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What do you wish to ask the oracle?"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c43a31]/30 focus:bg-white/[0.04]"
              />
            </div>

            {/* Casting area */}
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-6">
              <div className="mb-5 text-center">
                <h3 className="text-xs font-semibold text-white/70">Three-Coin Method</h3>
                <p className="mt-1 text-[9px] text-zinc-600">
                  Toss three coins six times. Each toss produces one line of the hexagram.
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[8px] text-zinc-700">
                  <span>Heads = 3 (yang)</span>
                  <span>Tails = 2 (yin)</span>
                  <span>6 = old yin ✕ (changing)</span>
                  <span>7 = young yang ⚊ (stable)</span>
                  <span>8 = young yin ⚋ (stable)</span>
                  <span>9 = old yang ○ (changing)</span>
                </div>
              </div>
              <CoinTossAnimation onComplete={handleCastComplete} />
            </div>

            {/* Bottom info */}
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 text-center">
              <p className="text-[9px] leading-relaxed text-zinc-600">
                Lines build from <strong>bottom to top</strong>. Line 1 is your first toss, line 6 your last. A changing line (value 6 or 9) transforms into its opposite, creating a <strong>secondary hexagram</strong> that shows where the situation is heading.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── READING VIEW ── */}
      {view === "read" && primary && (
        <section className="mx-auto max-w-5xl px-5 py-8">

          {/* Hexagram display */}
          <div className="mb-8 flex justify-center">
            <HexagramFigure hexagram={primary} tosses={tosses!} label="Your Hexagram" />
          </div>

          {/* Full reading */}
          <HexagramReading hexagram={primary} tosses={tosses!} />

          {/* Secondary hexagram */}
          {secondary && (
            <div className="mt-12 pt-8 border-t border-white/[0.04]">
              <SecondaryView primary={primary} secondary={secondary} tosses={tosses!} />
            </div>
          )}

          {/* Nuclear hexagram */}
          <div className="mt-8">
            <NuclearSection hexagram={primary} />
          </div>

          {/* Question */}
          {question && (
            <div className="mx-auto mt-8 max-w-lg text-center pt-6 border-t border-white/[0.03]">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">Your Question</p>
              <p className="mt-1.5 text-sm italic text-zinc-500">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Bottom guidance */}
          <div className="mx-auto mt-8 max-w-lg text-center">
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
              <Compass className="h-4 w-4 mx-auto text-[#c43a31]/40 mb-2" />
              <p className="text-[9px] leading-relaxed text-zinc-600">
                A hexagram describes the <strong>energetic pattern</strong> of your situation, not a fixed fate. The I Ching guides you to act in harmony with the Tao. the natural order of things. Read with an open heart, contemplate the images, and apply the wisdom as your own insight dictates.
              </p>
            </div>
          </div>

        </section>
      )}

      {/* ── BROWSE VIEW ── */}
      {view === "browse" && <HexagramBrowser />}

    </div>
  );
}

/* ─── Keyframes injected once ─── */
const styleId = "iching-keyframes";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
