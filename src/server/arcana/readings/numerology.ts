export type NumerologyProfile = {
  birthDate: string;
  fullName: string;
  lifePath: { number: number; master: boolean; label: string };
  expression: { number: number; master: boolean; label: string };
  soulUrge: { number: number; master: boolean; label: string };
  personality: { number: number; master: boolean; label: string };
  summary: string;
};

const MASTER = new Set([11, 22, 33]);

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const PATH_MEANINGS: Record<number, string> = {
  1: "Leadership, initiation, sovereign will",
  2: "Partnership, diplomacy, receptivity",
  3: "Expression, joy, creative speech",
  4: "Structure, discipline, earth mastery",
  5: "Change, freedom, mercurial paths",
  6: "Nurture, responsibility, Venusian harmony",
  7: "Mystery, analysis, inner oracle",
  8: "Power, karma, material mastery",
  9: "Completion, humanitarian release",
  11: "Master intuitive — spiritual messenger",
  22: "Master builder — manifest large visions",
  33: "Master teacher — compassionate service",
};

function reduceNum(n: number, keepMaster = true): number {
  if (keepMaster && MASTER.has(n)) return n;
  while (n > 9 && !(keepMaster && MASTER.has(n))) {
    n = String(n)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

function sumDigitsFromDate(isoDate: string): number {
  const digits = isoDate.replace(/\D/g, "");
  return digits.split("").reduce((a, d) => a + Number(d), 0);
}

function nameSum(name: string, vowelsOnly?: boolean): number {
  const vowels = new Set(["A", "E", "I", "O", "U", "Y"]);
  let sum = 0;
  for (const ch of name.toUpperCase()) {
    if (!LETTER_VALUES[ch]) continue;
    if (vowelsOnly !== undefined) {
      const isVowel = vowels.has(ch);
      if (vowelsOnly && !isVowel) continue;
      if (!vowelsOnly && isVowel) continue;
    }
    sum += LETTER_VALUES[ch]!;
  }
  return sum;
}

function numBlock(raw: number) {
  const n = reduceNum(raw);
  return {
    number: n,
    master: MASTER.has(n),
    label: PATH_MEANINGS[n] ?? "Unique path",
  };
}

export function computeNumerology(birthDate: string, fullName: string): NumerologyProfile {
  const lifeRaw = sumDigitsFromDate(birthDate);
  const lifePath = numBlock(lifeRaw);
  const expression = numBlock(nameSum(fullName));
  const soulUrge = numBlock(nameSum(fullName, true));
  const personality = numBlock(nameSum(fullName, false));

  return {
    birthDate,
    fullName,
    lifePath,
    expression,
    soulUrge,
    personality,
    summary: `Life Path ${lifePath.number}${lifePath.master ? " (master)" : ""} — ${lifePath.label}. Expression ${expression.number}. Soul Urge ${soulUrge.number}. Personality ${personality.number}.`,
  };
}
