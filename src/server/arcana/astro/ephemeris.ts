import { Body, Ecliptic, GeoVector, MakeTime } from "./astronomyCompat";
import type { AstroTime } from "./astronomyCompat";
import { houseForLongitude } from "./houses";
import { longitudeToSign, type SignPosition } from "./zodiac";

export type PlanetKey = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto";

function getBodyMap() {
  return {
    Sun: Body.Sun, Moon: Body.Moon, Mercury: Body.Mercury,
    Venus: Body.Venus, Mars: Body.Mars, Jupiter: Body.Jupiter,
    Saturn: Body.Saturn, Uranus: Body.Uranus, Neptune: Body.Neptune, Pluto: Body.Pluto,
  };
}

export type PlanetPosition = {
  body: PlanetKey;
  longitude: number;
  latitude: number;
  distance: number;
  sign: SignPosition;
  house: number;
  retrograde: boolean;
};

export function planetPositionsAt(time: AstroTime, lat: number, lon: number): PlanetPosition[] {
  const bodyMap = getBodyMap();
  const keys = Object.keys(bodyMap) as PlanetKey[];
  const results: PlanetPosition[] = [];
  for (const body of keys) {
    const astroBody = bodyMap[body] as (typeof Body)[keyof typeof Body];
    const geo = GeoVector(astroBody, time, true);
    const ecl = Ecliptic(geo);
    const house = houseForLongitude(ecl.elon, lat, lon, time);
    results.push({
      body,
      longitude: ecl.elon,
      latitude: ecl.elat,
      distance: geo[2],
      sign: longitudeToSign(ecl.elon),
      house,
      retrograde: false,
    });
  }
  return results;
}
