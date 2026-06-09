export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export type SignPosition = {
  sign: ZodiacSign;
  degree: number;
  minute: number;
  longitude: number;
  label: string;
};

export function normalizeLongitude(lon: number) {
  return ((lon % 360) + 360) % 360;
}

export function longitudeToSign(lon: number): SignPosition {
  const normalized = normalizeLongitude(lon);
  const signIndex = Math.floor(normalized / 30);
  const inSign = normalized - signIndex * 30;
  const degree = Math.floor(inSign);
  const minute = Math.floor((inSign - degree) * 60);
  const sign = ZODIAC_SIGNS[signIndex]!;
  return {
    sign,
    degree,
    minute,
    longitude: normalized,
    label: `${degree}°${String(minute).padStart(2, "0")}' ${sign}`,
  };
}

export function signElement(sign: ZodiacSign) {
  if (["Aries", "Leo", "Sagittarius"].includes(sign)) return "Fire";
  if (["Taurus", "Virgo", "Capricorn"].includes(sign)) return "Earth";
  if (["Gemini", "Libra", "Aquarius"].includes(sign)) return "Air";
  return "Water";
}

export function signModality(sign: ZodiacSign) {
  if (["Aries", "Cancer", "Libra", "Capricorn"].includes(sign)) return "Cardinal";
  if (["Taurus", "Leo", "Scorpio", "Aquarius"].includes(sign)) return "Fixed";
  return "Mutable";
}
