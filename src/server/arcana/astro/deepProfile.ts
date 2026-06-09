import { buildNatalChart, type NatalChart } from "./snapshot";
import { signElement, signModality, type ZodiacSign } from "./zodiac";
import { computeNumerology, type NumerologyProfile } from "../readings/numerology";

const SIGN_RULERS: Record<ZodiacSign, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const CHINESE_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
] as const;

const CHINESE_ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"] as const;

export type PlanetAspect = {
  planetA: string;
  planetB: string;
  type: "conjunction" | "opposition" | "trine" | "square" | "sextile";
  orb: number;
  interpretation: string;
};

export type DeepAstroProfile = {
  fullName: string;
  birth: NatalChart["birth"];
  location: NatalChart["location"];
  natal: NatalChart;
  numerology: NumerologyProfile;
  chineseZodiac: {
    animal: string;
    element: string;
    yinYang: "Yin" | "Yang";
    label: string;
  };
  chartRuler: { planet: string; reason: string };
  sunSign: string;
  moonSign: string;
  risingSign: string;
  dominantElement: { element: string; count: number; planets: string[] };
  dominantModality: { modality: string; count: number; planets: string[] };
  nameLetterMap: Array<{ letter: string; value: number }>;
  nameAstroHarmony: {
    lifePathPlanet: string;
    expressionSignAffinity: string;
    synthesis: string;
  };
  aspects: PlanetAspect[];
  personalYear: { year: number; number: number; theme: string };
  manifestationProfile: {
    strengths: string[];
    challenges: string[];
    bestPlanetaryDays: string[];
    recommendedPractices: string[];
  };
  summary: string;
};

const ASPECT_ANGLES: Array<{ type: PlanetAspect["type"]; angle: number; orb: number }> = [
  { type: "conjunction", angle: 0, orb: 8 },
  { type: "opposition", angle: 180, orb: 8 },
  { type: "trine", angle: 120, orb: 7 },
  { type: "square", angle: 90, orb: 7 },
  { type: "sextile", angle: 60, orb: 5 },
];

const LIFE_PATH_PLANETS: Record<number, string> = {
  1: "Sun", 2: "Moon", 3: "Jupiter", 4: "Uranus", 5: "Mercury",
  6: "Venus", 7: "Neptune", 8: "Saturn", 9: "Mars",
  11: "Moon", 22: "Uranus", 33: "Neptune",
};

const PERSONAL_YEAR_THEMES: Record<number, string> = {
  1: "New beginnings — plant seeds, initiate projects",
  2: "Patience, partnership, receptivity",
  3: "Creative expression, social expansion",
  4: "Foundation building, discipline, structure",
  5: "Change, travel, freedom, risk",
  6: "Home, family, responsibility, love",
  7: "Inner work, study, spiritual deepening",
  8: "Power, career peaks, material harvest",
  9: "Completion, release, humanitarian closure",
  11: "Master intuitive year — spiritual messenger energy",
  22: "Master builder year — large-scale manifestation",
};

function chineseZodiacFromDate(isoDate: string) {
  const year = Number(isoDate.slice(0, 4));
  const animal = CHINESE_ANIMALS[(year - 4) % 12]!;
  const element = CHINESE_ELEMENTS[Math.floor(((year - 4) % 10) / 2)]!;
  const yinYang: "Yin" | "Yang" = year % 2 === 0 ? "Yang" : "Yin";
  return { animal, element, yinYang, label: `${element} ${animal} (${yinYang})` };
}

function angularDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function computeAspects(natal: NatalChart): PlanetAspect[] {
  const aspects: PlanetAspect[] = [];
  const bodies = natal.planets;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i]!;
      const b = bodies[j]!;
      const dist = angularDistance(a.longitude, b.longitude);
      for (const spec of ASPECT_ANGLES) {
        const orb = Math.abs(dist - spec.angle);
        if (orb <= spec.orb) {
          aspects.push({
            planetA: a.body,
            planetB: b.body,
            type: spec.type,
            orb: Math.round(orb * 10) / 10,
            interpretation: `${a.body} ${spec.type} ${b.body} (${orb.toFixed(1)}° orb)`,
          });
          break;
        }
      }
    }
  }
  return aspects.slice(0, 12);
}

function dominantFromPlanets(natal: NatalChart) {
  const elementCount: Record<string, { count: number; planets: string[] }> = {
    Fire: { count: 0, planets: [] },
    Earth: { count: 0, planets: [] },
    Air: { count: 0, planets: [] },
    Water: { count: 0, planets: [] },
  };
  const modalityCount: Record<string, { count: number; planets: string[] }> = {
    Cardinal: { count: 0, planets: [] },
    Fixed: { count: 0, planets: [] },
    Mutable: { count: 0, planets: [] },
  };

  for (const p of natal.planets) {
    const el = signElement(p.sign.sign);
    const mod = signModality(p.sign.sign);
    elementCount[el]!.count++;
    elementCount[el]!.planets.push(p.body);
    modalityCount[mod]!.count++;
    modalityCount[mod]!.planets.push(p.body);
  }

  const domEl = Object.entries(elementCount).sort((a, b) => b[1].count - a[1].count)[0]!;
  const domMod = Object.entries(modalityCount).sort((a, b) => b[1].count - a[1].count)[0]!;

  return {
    dominantElement: { element: domEl[0], count: domEl[1].count, planets: domEl[1].planets },
    dominantModality: { modality: domMod[0], count: domMod[1].count, planets: domMod[1].planets },
  };
}

function nameLetterMap(fullName: string) {
  const values: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
  };
  return fullName
    .toUpperCase()
    .split("")
    .filter((ch) => values[ch])
    .map((letter) => ({ letter, value: values[letter]! }));
}

function expressionSignAffinity(expressionNum: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ];
  const idx = (expressionNum - 1) % 12;
  const masterIdx = expressionNum === 11 ? 10 : expressionNum === 22 ? 3 : expressionNum === 33 ? 5 : idx;
  return signs[masterIdx] ?? signs[idx]!;
}

function personalYear(birthDate: string, refYear?: number) {
  const year = refYear ?? new Date().getFullYear();
  const month = Number(birthDate.slice(5, 7));
  const day = Number(birthDate.slice(8, 10));
  let sum = String(year).split("").reduce((a, d) => a + Number(d), 0);
  sum += month + day;
  while (sum > 9 && ![11, 22].includes(sum)) {
    sum = String(sum).split("").reduce((a, d) => a + Number(d), 0);
  }
  return {
    year,
    number: sum,
    theme: PERSONAL_YEAR_THEMES[sum] ?? PERSONAL_YEAR_THEMES[sum % 9 || 9]!,
  };
}

function buildManifestationProfile(args: {
  numerology: NumerologyProfile;
  natal: NatalChart;
  dominantElement: string;
  aspects: PlanetAspect[];
}): DeepAstroProfile["manifestationProfile"] {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const lp = args.numerology.lifePath.number;
  if ([1, 8, 22].includes(lp)) strengths.push("Natural initiator — chief aim & visualization excel");
  if ([2, 6, 9, 33].includes(lp)) strengths.push("Relational magnetism — scripting & gratitude journal excel");
  if ([3, 5, 11].includes(lp)) strengths.push("Creative expression — affirmations & creative visualization excel");
  if ([4, 7].includes(lp)) strengths.push("Discipline & depth — stoic practice & meditation excel");
  if ([7, 11, 33].includes(lp)) strengths.push("Inner work capacity — self-hypnosis & vipassana excel");

  if (args.dominantElement === "Water") strengths.push("Strong imaginal faculty — SATS & hypnosis");
  if (args.dominantElement === "Fire") strengths.push("Decisive action energy — act-as-if & NLP anchoring");
  if (args.dominantElement === "Air") strengths.push("Verbal power — affirmations, NLP, scripting");
  if (args.dominantElement === "Earth") strengths.push("Grounded persistence — 369 method & bullet journal");

  const hardAspects = args.aspects.filter((a) => a.type === "square" || a.type === "opposition");
  if (hardAspects.length >= 3) challenges.push("Inner tension — EFT & CBT thought records recommended");
  if (hardAspects.some((a) => a.planetA === "Saturn" || a.planetB === "Saturn")) {
    challenges.push("Saturn aspects — patience, stoic premeditation, long timelines");
  }

  const dayRulers = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const lpPlanet = LIFE_PATH_PLANETS[lp] ?? "Sun";
  const bestDays = dayRulers.filter((_, i) => {
    const planets = args.natal.planets.map((p) => p.body as string);
    return planets.includes(lpPlanet) || i === lp % 7;
  });

  const practices: string[] = [];
  if (lp <= 3) practices.push("Definite Chief Aim", "Creative Visualization");
  if (lp >= 4 && lp <= 6) practices.push("Gratitude Journal", "Morning Pages");
  if (lp >= 7) practices.push("Self-Hypnosis", "Vipassana body scan");
  practices.push("EFT for blocks", "PERMA wellbeing audit");

  return {
    strengths: strengths.slice(0, 5),
    challenges: challenges.slice(0, 4),
    bestPlanetaryDays: [...new Set([lpPlanet, ...bestDays])].slice(0, 4),
    recommendedPractices: [...new Set(practices)].slice(0, 6),
  };
}

export function buildDeepAstroProfile(args: {
  birthDate: string;
  birthTime?: string;
  fullName: string;
  lat: number;
  lon: number;
  label?: string;
}): DeepAstroProfile {
  const fullName = args.fullName.trim();
  if (!fullName) throw new Error("Full name is required for deep cosmic profile.");

  const natal = buildNatalChart({
    birthDate: args.birthDate,
    birthTime: args.birthTime,
    lat: args.lat,
    lon: args.lon,
    label: args.label,
  });
  const numerology = computeNumerology(args.birthDate, fullName);
  const chineseZodiac = chineseZodiacFromDate(args.birthDate);
  const sun = natal.planets.find((p) => p.body === "Sun")!;
  const moon = natal.planets.find((p) => p.body === "Moon")!;
  const rising = natal.ascendant.sign;
  const chartRulerPlanet = SIGN_RULERS[rising];
  const { dominantElement, dominantModality } = dominantFromPlanets(natal);
  const aspects = computeAspects(natal);
  const letters = nameLetterMap(fullName);
  const lpPlanet = LIFE_PATH_PLANETS[numerology.lifePath.number] ?? "Sun";
  const exprAffinity = expressionSignAffinity(numerology.expression.number);
  const py = personalYear(args.birthDate);
  const manifestationProfile = buildManifestationProfile({
    numerology,
    natal,
    dominantElement: dominantElement.element,
    aspects,
  });

  const synthesis = `Life Path ${numerology.lifePath.number} (${lpPlanet} tone) meets Expression ${numerology.expression.number} (${exprAffinity} affinity). Sun in ${sun.sign.sign}, Moon in ${moon.sign.sign}, ${rising} rising — chart ruled by ${chartRulerPlanet}.`;

  return {
    fullName,
    birth: natal.birth,
    location: natal.location,
    natal,
    numerology,
    chineseZodiac,
    chartRuler: {
      planet: chartRulerPlanet,
      reason: `${rising} ascendant traditionally ruled by ${chartRulerPlanet}`,
    },
    sunSign: sun.sign.sign,
    moonSign: moon.sign.sign,
    risingSign: rising,
    dominantElement,
    dominantModality,
    nameLetterMap: letters,
    nameAstroHarmony: {
      lifePathPlanet: lpPlanet,
      expressionSignAffinity: exprAffinity,
      synthesis,
    },
    aspects,
    personalYear: py,
    manifestationProfile,
    summary: `${fullName}: ${synthesis} Chinese ${chineseZodiac.label}. Personal year ${py.number} — ${py.theme}.`,
  };
}
