import { MakeTime } from "./astronomyCompat";

import { planetPositionsAt } from "./ephemeris";
import { calcAscendant, calcMidheaven, equalHouses } from "./houses";
import { moonPhaseAt } from "./moon";
import {
  PLANET_CORRESPONDENCES,
  planetaryHoursAt,
  type PlanetaryHourState,
} from "./planetaryHours";
import { longitudeToSign, signElement, signModality } from "./zodiac";

export type AstroSnapshot = {
  timestamp: string;
  location: { lat: number; lon: number; label?: string };
  moon: ReturnType<typeof moonPhaseAt> & {
    sign: string;
    signElement: string;
    signModality: string;
  };
  planets: ReturnType<typeof planetPositionsAt>;
  ascendant: ReturnType<typeof longitudeToSign>;
  midheaven: ReturnType<typeof longitudeToSign>;
  houses: ReturnType<typeof equalHouses>;
  planetaryHours: PlanetaryHourState;
  correspondences: {
    currentHourRuler: (typeof PLANET_CORRESPONDENCES)[keyof typeof PLANET_CORRESPONDENCES];
    dayRuler: (typeof PLANET_CORRESPONDENCES)[keyof typeof PLANET_CORRESPONDENCES];
  };
};

export type NatalChart = AstroSnapshot & {
  birth: { date: string; timeKnown: boolean };
};

export function buildAstroSnapshot(args: {
  date?: Date;
  lat: number;
  lon: number;
  label?: string;
}): AstroSnapshot {
  const date = args.date ?? new Date();
  const time = MakeTime(date);
  const ascLon = calcAscendant(time, args.lat, args.lon);
  const mcLon = calcMidheaven(time, args.lon);
  const planets = planetPositionsAt(time, args.lat, args.lon);
  const moonPlanet = planets.find((p) => p.body === "Moon")!;
  const moonPhase = moonPhaseAt(time);
  const hours = planetaryHoursAt(date, args.lat, args.lon);

  return {
    timestamp: date.toISOString(),
    location: { lat: args.lat, lon: args.lon, label: args.label },
    moon: {
      ...moonPhase,
      sign: moonPlanet.sign.sign,
      signElement: signElement(moonPlanet.sign.sign),
      signModality: signModality(moonPlanet.sign.sign),
    },
    planets,
    ascendant: longitudeToSign(ascLon),
    midheaven: longitudeToSign(mcLon),
    houses: equalHouses(ascLon),
    planetaryHours: hours,
    correspondences: {
      currentHourRuler: PLANET_CORRESPONDENCES[hours.current.ruler],
      dayRuler: PLANET_CORRESPONDENCES[hours.dayRuler],
    },
  };
}

export function buildNatalChart(args: {
  birthDate: string;
  birthTime?: string;
  lat: number;
  lon: number;
  label?: string;
}): NatalChart {
  const timeKnown = Boolean(args.birthTime?.trim());
  const timeStr = args.birthTime?.trim() || "12:00";
  const date = localInstantFromParts(args.birthDate, timeStr, args.lon);
  const snapshot = buildAstroSnapshot({ date, lat: args.lat, lon: args.lon, label: args.label });
  return {
    ...snapshot,
    birth: { date: `${args.birthDate}T${timeStr}`, timeKnown },
  };
}

function localInstantFromParts(dateStr: string, timeStr: string, lon: number): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mi] = timeStr.split(":").map(Number);
  const localAsUtc = Date.UTC(y!, m! - 1, d!, hh!, mi!, 0);
  return new Date(localAsUtc - (lon / 15) * 3_600_000);
}
