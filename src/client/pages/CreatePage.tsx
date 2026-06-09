import { useState } from "react";
import { Link } from "react-router-dom";
import { Wand2, Brain, Sparkles, Heart, Sun, Moon, Star, BookOpen, Zap, Music, Eye, Shuffle, Feather, Droplets, Mountain, Cloud } from "lucide-react";

const METHODS = [
  {
    category: "💭 Mental & Psychological",
    icon: Brain,
    items: [
      { name: "Visualization & Affirmation", desc: "See your goal with emotion daily. Retrains neural pathways.", rating: 4.9, users: 1242, popular: true },
      { name: "Scripting", desc: "Write your desired reality as if already true. Powerful subconscious reprogramming.", rating: 4.8, users: 845 },
      { name: "Vision Boarding", desc: "Collect images representing your goal. Train your mind.", rating: 4.6, users: 523 },
      { name: "NLP Reprogramming", desc: "Neuro-linguistic programming: anchoring, reframing, modeling success.", rating: 4.7, users: 412 },
      { name: "Timeline Therapy", desc: "Heal past blocks by journeying through your timeline.", rating: 4.8, users: 298 },
      { name: "Cognitive Reframing", desc: "Find and shift belief patterns limiting your success.", rating: 4.5, users: 187 },
    ],
  },
  {
    category: "✨ Magical Spell Methods",
    icon: Zap,
    items: [
      { name: "Sigil Magic", desc: "Design a sigil representing your intent. Charge and release.", rating: 4.9, users: 634, popular: true },
      { name: "Candle Burning", desc: "Color-based candle magic. Green for money, pink for love.", rating: 4.8, users: 1123, popular: true },
      { name: "Potion & Bath Spells", desc: "Mix herbs with intention. Ritual bath or drink.", rating: 4.7, users: 445 },
      { name: "Crystal Grids", desc: "Arrange crystals in geometric patterns. Focus intent through form.", rating: 4.6, users: 523 },
      { name: "Manifestation Jars", desc: "Write goal on paper, fill jar with symbolic items.", rating: 4.8, users: 712 },
      { name: "Planetary Magic", desc: "Cast in optimal planetary hour for power boost.", rating: 4.9, users: 856 },
    ],
  },
  {
    category: "🧘 Energetic & Spiritual",
    icon: Sun,
    items: [
      { name: "Meditation & Visualization", desc: "Deep practice from all traditions.", rating: 4.8, users: 1456, popular: true },
      { name: "Chakra Alignment", desc: "Balance your 7 energy centers.", rating: 4.7, users: 834 },
      { name: "Energy Cultivation", desc: "Kundalini, Qi, Prana — raise your vibration.", rating: 4.6, users: 356 },
      { name: "Breathwork", desc: "Pranayama and specific breathing patterns for manifestation.", rating: 4.7, users: 523 },
      { name: "Sound & Frequency", desc: "Healing through vibration and sound.", rating: 4.5, users: 234 },
      { name: "Aura Cleansing", desc: "Clear and elevate your auric field.", rating: 4.6, users: 445 },
    ],
  },
  {
    category: "🔄 Eastern Traditions",
    icon: Star,
    items: [
      { name: "Law of Attraction", desc: "Neville Goddard, Abraham Hicks. Classic LOA practice.", rating: 4.8, users: 2134, popular: true },
      { name: "Vedic Manifestation", desc: "Ancient Hindu manifestation practices.", rating: 4.7, users: 534 },
      { name: "Taoist Alchemy", desc: "Internal and external alchemy for transformation.", rating: 4.6, users: 298 },
      { name: "Buddhist Visualization", desc: "Tonglen, deity yoga, compassion practices.", rating: 4.7, users: 412 },
      { name: "Tantra Practices", desc: "Sacred sexuality and energy transmutation.", rating: 4.8, users: 345 },
    ],
  },
  {
    category: "🧬 Modern & Hybrid",
    icon: Cloud,
    items: [
      { name: "Quantum Jumping", desc: "Consciousness shifting to reality where goal is achieved.", rating: 4.5, users: 234 },
      { name: "Reality Shifting", desc: "Consciousness-based dimension shifting techniques.", rating: 4.4, users: 189 },
      { name: "Synchronicity Cultivation", desc: "Train your awareness to notice aligned opportunities.", rating: 4.6, users: 312 },
      { name: "Intentional Living", desc: "Daily practice alignment for automatic manifestation.", rating: 4.7, users: 456 },
    ],
  },
];

export function CreatePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-orange-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
            <Wand2 className="h-3.5 w-3.5" />
            40+ Manifestation & Reality-Bending Techniques
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Create — What Do You Want to Manifest?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Mental, magical, energetic, and esoteric methods from every tradition. All tools, no limits.
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <input
              type="text"
              placeholder="Search techniques: 'manifest money' 'attract love' 'raise vibration'"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-4 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-amber-500/40 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      </section>

      {/* Technique Categories */}
      {METHODS.map((group) => (
        <section key={group.category} className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <group.icon className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl font-bold text-white">{group.category}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-amber-500/30 hover:bg-white/[0.04]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    {item.popular && (
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <span>⭐⭐⭐⭐⭐ {item.rating}</span>
                    <span>({item.users.toLocaleString()} users)</span>
                  </div>
                  <div className="mt-3 text-xs font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Start Practice →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Quick Start */}
      <section className="mx-auto max-w-6xl px-5 py-12 text-center md:px-8">
        <h2 className="font-serif text-xl font-bold text-white">Not Sure Where to Start?</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Try the <span className="text-amber-400">369 Method</span> (easiest) or{" "}
          <span className="text-amber-400">Visualization & Affirmations</span> (most popular).
        </p>
      </section>
    </div>
  );
}
