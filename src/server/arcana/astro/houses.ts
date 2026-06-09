import { SiderealTime, type AstroTime } from "./astronomyCompat";

import { longitudeToSign, type SignPosition } from "./zodiac";

const OBLIQUITY_DEG = 23.4392911;

export type HouseCusp = {
  house: number;
  longitude: number;
  sign: SignPosition;
};

export function calcAscendant(time: AstroTime, lat: number, lon: number): number {
  const gstHours = SiderealTime(time);
  let lstHours = gstHours + lon / 15;
  lstHours = ((lstHours % 24) + 24) % 24;
  const lstRad = (lstHours * 15 * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const epsRad = (OBLIQUITY_DEG * Math.PI) / 180;

  const y = Math.cos(lstRad);
  const x = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascRad = Math.atan2(y, x);
  return ((ascRad * 180) / Math.PI + 360) % 360;
}

export function calcMidheaven(time: AstroTime, lon: number): number {
  const gstHours = SiderealTime(time);
  let lstHours = gstHours + lon / 15;
  lstHours = ((lstHours % 24) + 24) % 24;
  const ramc = lstHours * 15;
  const epsRad = (OBLIQUITY_DEG * Math.PI) / 180;
  const mcRad = Math.atan2(Math.tan((ramc * Math.PI) / 180), Math.cos(epsRad));
  return ((mcRad * 180) / Math.PI + 360) % 360;
}

/** Equal-house system from ascendant. */
export function equalHouses(ascendantLon: number): HouseCusp[] {
  return Array.from({ length: 12 }, (_, i) => {
    const lon = (ascendantLon + i * 30) % 360;
    return { house: i + 1, longitude: lon, sign: longitudeToSign(lon) };
  });
}

export function houseForLongitude(longitude: number, ascendantLon: number): number {
  const diff = (((longitude - ascendantLon) % 360) + 360) % 360;
  return Math.floor(diff / 30) + 1;
}
