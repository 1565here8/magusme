import { Body, Illumination, type AstroTime } from "./astronomyCompat";

export type MoonPhaseInfo = {
  fraction: number;
  phaseAngle: number;
  name: string;
  emoji: string;
  waxing: boolean;
  ageDays: number;
};

const PHASES: Array<{ max: number; name: string; emoji: string }> = [
  { max: 0.03, name: "New Moon", emoji: "🌑" },
  { max: 0.22, name: "Waxing Crescent", emoji: "🌒" },
  { max: 0.28, name: "First Quarter", emoji: "🌓" },
  { max: 0.47, name: "Waxing Gibbous", emoji: "🌔" },
  { max: 0.53, name: "Full Moon", emoji: "🌕" },
  { max: 0.72, name: "Waning Gibbous", emoji: "🌖" },
  { max: 0.78, name: "Last Quarter", emoji: "🌗" },
  { max: 0.97, name: "Waning Crescent", emoji: "🌘" },
  { max: 1.01, name: "New Moon", emoji: "🌑" },
];

export function moonPhaseAt(time: AstroTime): MoonPhaseInfo {
  const illum = Illumination(Body.Moon, time);
  const fraction = illum.fraction;
  const phase = PHASES.find((p) => fraction <= p.max) ?? PHASES[0]!;
  const waxing = fraction < 0.5;
  const ageDays = waxing ? fraction * 29.53 : (1 - fraction) * 29.53;

  return {
    fraction,
    phaseAngle: illum.phase_angle,
    name: phase.name,
    emoji: phase.emoji,
    waxing,
    ageDays: Math.round(ageDays * 10) / 10,
  };
}
