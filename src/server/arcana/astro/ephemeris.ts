import { Body, Ecliptic, GeoVector, MakeTime, type AstroTime } from "./astronomyCompat";

import { houseForLongitude } from "./houses";
import { longitudeToSign, type SignPosition } from "./zodiac";

export type PlanetKey =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto";

const BODY_MAP: Record<PlanetKey, (typeof Body)[keyof typeof Body]> = {
  Sun: Body.Sun,
  Moon: Body.Moon,
  Mercury: Body.Mercury,
  Venus: Body.Venus,
  Mars: Body.Mars,
  Jupiter: Body.Jupiter,
  Saturn: Body.Saturn,
  Uranus: Body.Uranus,
  Neptune: Body.Neptune,
  Pluto: Body.Pluto,
};

export type PlanetPosition = {
  body: PlanetKey;
  longitude: number;
  sign: SignPosition;
  retrograde: boolean;
  house?: number;
};

export function planetLongitude(body: (typeof Body)[keyof typeof Body], time: AstroTime): number {
  const vec = GeoVector(body, time, true);
  const ecl = Ecliptic(vec);
  return ecl.elon;
}

function isRetrograde(body: (typeof Body)[keyof typeof Body], time: AstroTime): boolean {
  if (body === Body.Sun || body === Body.Moon) return false;
  const t0 = MakeTime(time.date.getTime() - 86_400_000);
  const t1 = MakeTime(time.date.getTime() + 86_400_000);
  const lon0 = planetLongitude(body, t0);
  const lon1 = planetLongitude(body, t1);
  let delta = lon1 - lon0;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

export function planetPositionsAt(time: AstroTime, ascendantLon?: number): PlanetPosition[] {
  const keys = Object.keys(BODY_MAP) as PlanetKey[];
  return keys.map((body) => {
    const astroBody = BODY_MAP[body];
    const longitude = planetLongitude(astroBody, time);
    const sign = longitudeToSign(longitude);
    const retrograde = isRetrograde(astroBody, time);
    return {
      body,
      longitude,
      sign,
      retrograde,
      house: ascendantLon !== undefined ? houseForLongitude(longitude, ascendantLon) : undefined,
    };
  });
}
