import { useState } from "react";
import { Sparkles, ArrowLeft, Shuffle } from "lucide-react";

const RUNES = [
  { name: "Fehu", glyph: "ᚠ", meaning: "Wealth, abundance, fulfillment" },
  { name: "Uruz", glyph: "ᚢ", meaning: "Strength, courage, vitality" },
  { name: "Thurisaz", glyph: "ᚦ", meaning: "Protection, defense, conflict" },
  { name: "Ansuz", glyph: "ᚨ", meaning: "Communication, wisdom, divine message" },
  { name: "Raidho", glyph: "ᚱ", meaning: "Journey, movement, change" },
  { name: "Kenaz", glyph: "ᚲ", meaning: "Fire, creativity, transformation" },
  { name: "Gebo", glyph: "ᚷ", meaning: "Gift, generosity, partnership" },
  { name: "Wunjo", glyph: "ᚹ", meaning: "Joy, harmony, comfort" },
  { name: "Hagalaz", glyph: "ᚺ", meaning: "Hail, disruption, natural force" },
  { name: "Nauthiz", glyph: "ᚾ", meaning: "Need, constraint, necessity" },
  { name: "Isa", glyph: "ᛁ", meaning: "Ice, stillness, challenge" },
  { name: "Jera", glyph: "ᛃ", meaning: "Harvest, reward, cycle" },
  { name: "Eihwaz", glyph: "ᛇ", meaning: "Yew tree, endurance, defense" },
  { name: "Perthro", glyph: "ᛈ", meaning: "Mystery, fate, hidden knowledge" },
  { name: "Algiz", glyph: "ᛉ", meaning: "Protection, higher self, awakening" },
  { name: "Sowilo", glyph: "ᛊ", meaning: "Sun, success, life force" },
  { name: "Tiwaz", glyph: "ᛏ", meaning: "Justice, honor, leadership" },
  { name: "Berkano", glyph: "ᛒ", meaning: "Growth, rebirth, fertility" },
  { name: "Ehwaz", glyph: "ᛖ", meaning: "Trust, partnership, progress" },
  { name: "Mannaz", glyph: "ᛗ", meaning: "Humanity, self, community" },
  { name: "Laguz", glyph: "ᛚ", meaning: "Water, flow, intuition" },
  { name: "Ingwaz", glyph: "ᛝ", meaning: "Fertility, new beginning, potential" },
  { name: "Dagaz", glyph: "ᛞ", meaning: "Dawn, breakthrough, transformation" },
  { name: "Othala", glyph: "ᛟ", meaning: "Heritage, inheritance, home" },
];

const CAST_TYPES = [
  { name: "Single Rune", description: "Quick guidance on one question", count: 1 },
  { name: "Three Runes", description: "Past · Present · Future", count: 3 },
  { name: "Nine Rune Cast", description: "Full life overview, deep insight", count: 9 },
];

interface RuneCastProps {
  onBack: () => void;
}

export function RuneCast({ onBack }: RuneCastProps) {
  const [selectedCast, setSelectedCast] = useState<typeof CAST_TYPES[0] | null>(null);
  const [castResult, setCastResult] = useState<Array<{ rune: typeof RUNES[0]; reversed: boolean }>>([]);
  const [isCasting, setIsCasting] = useState(false);

  function castRunes(castType: typeof CAST_TYPES[0]) {
    setSelectedCast(castType);
    setIsCasting(true);
    setCastResult([]);

    setTimeout(() => {
      const shuffled = [...RUNES].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, castType.count).map((rune) => ({
        rune,
        reversed: Math.random() > 0.75,
      }));
      setCastResult(drawn);
      setIsCasting(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Methods
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-white">Rune Casting</h1>
          <p className="mt-2 text-zinc-400">Ancient Norse divination. Cast the runes and receive wisdom.</p>
        </div>

        {!selectedCast && (
          <>
            <h2 className="mb-4 text-lg font-medium text-white">Choose Your Cast</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {CAST_TYPES.map((cast) => (
                <button
                  key={cast.name}
                  onClick={() => castRunes(cast)}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center transition hover:border-amber-500/30"
                >
                  <h3 className="font-serif text-lg font-bold text-white">{cast.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{cast.description}</p>
                  <div className="mt-3 text-4xl">
                    {RUNES.slice(0, cast.count).map((r) => (
                      <span key={r.name} className="mx-0.5 text-amber-400">{r.glyph}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Cast Runes →
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {isCasting && (
          <div className="flex flex-col items-center py-20">
            <Shuffle className="mb-4 h-12 w-12 animate-pulse text-amber-400" />
            <p className="text-zinc-400">Casting the runes...</p>
            <div className="mt-6 flex gap-3">
              {RUNES.slice(0, 9).sort(() => Math.random() - 0.5).slice(0, 3).map((r) => (
                <div key={r.name} className="flex h-16 w-16 animate-bounce items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-3xl">
                  {r.glyph}
                </div>
              ))}
            </div>
          </div>
        )}

        {castResult.length > 0 && !isCasting && (
          <>
            <div className={`grid gap-6 ${selectedCast!.count <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-3 sm:grid-cols-3 lg:grid-cols-5"}`}>
              {castResult.map(({ rune, reversed }, i) => (
                <div
                  key={i}
                  className={`group relative rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-6 text-center transition hover:border-amber-500/40 ${reversed ? "" : ""}`}
                >
                  <div className={`mb-2 text-6xl ${reversed ? "rotate-180 opacity-60" : ""}`}>{rune.glyph}</div>
                  <h3 className="font-serif text-lg font-bold text-white">{rune.name}</h3>
                  <div className={`mt-1 text-xs font-medium ${reversed ? "text-amber-400" : "text-emerald-400"}`}>
                    {reversed ? "Reversed" : "Upright"}
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">{rune.meaning}</p>
                  <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setSelectedCast(null)}
                className="rounded-full border border-white/10 px-8 py-3 text-sm text-zinc-400 transition hover:border-white/20"
              >
                Cast Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
