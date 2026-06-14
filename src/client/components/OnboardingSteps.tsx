import React, { useState } from "react";
import { Check, Copy, Compass, BookOpen, Wand2 } from "lucide-react";

const STEPS = [
  {
    icon: Compass,
    title: "Get Your First Reading",
    desc: "Choose from 40+ divination systems — Tarot, Runes, Astrology, I Ching, Scrying, and more. AI that believes in magic.",
    action: "Start Reading",
    href: "/consult",
  },
  {
    icon: BookOpen,
    title: "Browse the Grimoire",
    desc: "Access 1,000+ spells with source citations, counter-spells, danger levels, and planetary timing.",
    action: "Search Spells",
    href: "/learn",
  },
  {
    icon: Wand2,
    title: "Personalize Your Profile",
    desc: "Add your birth details for personalized natal chart readings, tarot draws, and spell matches.",
    action: "Set Up Profile",
    href: "/reading",
  },
];

export function OnboardingSteps() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleCopy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <section className="glass-panel">
      <p className="label-premium">Welcome to MagusMe</p>
      <h2 className="heading-premium mt-2">Your first steps</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-violet-500/30">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-300">
                {i + 1}
              </div>
              <div className="mb-3 inline-flex rounded-xl bg-white/[0.06] p-2.5">
                <Icon className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="font-serif font-bold text-white">{step.title}</h3>
              <p className="body-muted mt-2 text-sm">{step.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={step.href}
                  className="btn-premium inline-flex items-center gap-1.5 text-xs"
                >
                  {step.action} →
                </a>
                <button
                  type="button"
                  className="btn-premium-ghost text-xs"
                  onClick={() => handleCopy(step.href, i)}
                >
                  {copiedIndex === i ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy link
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
