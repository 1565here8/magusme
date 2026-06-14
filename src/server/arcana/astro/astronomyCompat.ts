import { createRequire } from "node:module";

let astro: any = null;
try {
  const _require = createRequire(import.meta.url);
  astro = _require("astronomy-engine");
} catch {
  // Fallback: pure JS implementation below
}

export const Body = astro?.Body ?? {
  Sun: "Sun", Moon: "Moon", Mercury: "Mercury", Venus: "Venus",
  Mars: "Mars", Jupiter: "Jupiter", Saturn: "Saturn",
  Uranus: "Uranus", Neptune: "Neptune", Pluto: "Pluto",
};

export class AstroTime {
  ut: number;
  tt: number;
  constructor(date: Date) {
    this.ut = date.getTime() / 86400000 + 2440587.5;
    this.tt = this.ut;
  }
  toDate(): Date {
    return new Date((this.ut - 2440587.5) * 86400000);
  }
}

export function MakeTime(date: Date | number | string): AstroTime {
  const d = typeof date === "number" ? new Date(date) : typeof date === "string" ? new Date(date) : date;
  return new AstroTime(d);
}

export function SiderealTime(jd: AstroTime): number {
  const jt = jd.tt / 36525;
  return (280.46061837 + 360.98564736629 * (jd.ut - 2451545) + 0.000387933 * jt * jt - jt * jt * jt / 38710000) % 360;
}

export function Observer(lat: number, lon: number, height: number) {
  return { latitude: lat, longitude: lon, height };
}

function julianToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

function meanAnomaly(jd: number, a0: number, rate: number): number {
  return ((a0 + rate * (jd - 2451545) / 36525) % 360 + 360) % 360;
}

function helioCoords(a: number, e: number, i: number, omega: number, w: number, M: number):
  { x: number; y: number; z: number; dist: number } {
  const Mr = M * Math.PI / 180;
  const er = e * Math.PI / 180;
  const ir = i * Math.PI / 180;
  const wr = w * Math.PI / 180;
  const or = omega * Math.PI / 180;

  let E = Mr;
  for (let k = 0; k < 5; k++) {
    E = Mr + er * Math.sin(E);
  }

  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const dist = Math.sqrt(xp * xp + yp * yp);

  const x = (Math.cos(wr) * Math.cos(or) - Math.sin(wr) * Math.sin(or) * Math.cos(ir)) * xp
    + (-Math.sin(wr) * Math.cos(or) - Math.cos(wr) * Math.sin(or) * Math.cos(ir)) * yp;
  const y = (Math.cos(wr) * Math.sin(or) + Math.sin(wr) * Math.cos(or) * Math.cos(ir)) * xp
    + (-Math.sin(wr) * Math.sin(or) + Math.cos(wr) * Math.cos(or) * Math.cos(ir)) * yp;
  const z = Math.sin(wr) * Math.sin(ir) * xp + Math.cos(wr) * Math.sin(ir) * yp;

  return { x, y, z, dist };
}

function geoCoords(xh: number, yh: number, zh: number, sunX: number, sunY: number, sunZ: number) {
  return { x: xh + sunX, y: yh + sunY, z: zh + sunZ };
}

function eclipticLongitude(x: number, y: number): number {
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function obliquity(jd: number): number {
  const jt = (jd - 2451545) / 36525;
  return 23.439291 - 0.0130042 * jt - 0.00000016 * jt * jt + 0.000000504 * jt * jt * jt;
}

const PLANET_ELEMENTS: Record<string, {
  a: number; e: number; i: number; omega: number; w: number;
  L0: number; Lrate: number;
}> = {
  Mercury: { a: 0.387, e: 0.2056, i: 7.005, omega: 48.331, w: 29.124, L0: 252.251, Lrate: 149472.675 },
  Venus: { a: 0.723, e: 0.0068, i: 3.395, omega: 76.68, w: 54.884, L0: 181.98, Lrate: 58517.816 },
  Earth: { a: 1.0, e: 0.0167, i: 0.0, omega: 0.0, w: 102.937, L0: 100.464, Lrate: 35999.373 },
  Mars: { a: 1.524, e: 0.0934, i: 1.85, omega: 49.558, w: 286.502, L0: 355.453, Lrate: 19140.303 },
  Jupiter: { a: 5.203, e: 0.0484, i: 1.303, omega: 100.464, w: 273.867, L0: 34.351, Lrate: 3034.906 },
  Saturn: { a: 9.537, e: 0.0539, i: 2.489, omega: 113.666, w: 339.391, L0: 50.078, Lrate: 1222.114 },
  Uranus: { a: 19.191, e: 0.0473, i: 0.773, omega: 74.006, w: 96.998, L0: 313.232, Lrate: 428.468 },
  Neptune: { a: 30.069, e: 0.0086, i: 1.77, omega: 131.784, w: 276.346, L0: 304.88, Lrate: 218.485 },
};

export function GeoVector(body: string, time: AstroTime, _light: boolean): [number, number, number, number] {
  const jd = time.tt;
  const elem = PLANET_ELEMENTS[body] || PLANET_ELEMENTS.Earth;
  const M = meanAnomaly(jd, elem.L0 - elem.w, elem.Lrate);
  const hc = helioCoords(elem.a, elem.e, elem.i, elem.omega, elem.w, M);

  if (body === "Earth") {
    return [hc.x, hc.y, hc.z, hc.dist];
  }

  const earthElem = PLANET_ELEMENTS.Earth;
  const earthM = meanAnomaly(jd, earthElem.L0 - earthElem.w, earthElem.Lrate);
  const earth = helioCoords(earthElem.a, earthElem.e, earthElem.i, earthElem.omega, earthElem.w, earthM);
  const gc = geoCoords(hc.x, hc.y, hc.z, -earth.x, -earth.y, -earth.z);

  return [gc.x, gc.y, gc.z, hc.dist];
}

export function Ecliptic(vec: [number, number, number, number]): { elon: number; elat: number } {
  const x = vec[0], y = vec[1], z = vec[2];
  return {
    elon: eclipticLongitude(x, y),
    elat: Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI,
  };
}

export function Illumination(body: string, time: AstroTime) {
  if (body === "Moon") {
    const [sx, sy] = GeoVector("Sun", time, true);
    const [mx, my] = GeoVector("Moon", time, true);
    const sunLon = eclipticLongitude(sx, sy);
    const moonLon = eclipticLongitude(mx, my);
    const angle = ((moonLon - sunLon) % 360 + 360) % 360;
    return { phase_angle: angle, fraction: (1 - Math.cos(angle * Math.PI / 180)) / 2 };
  }
  return { phase_angle: 0, fraction: 0.5 };
}
export function SearchRiseSet(body: string, observer: any, direction: number, startTime?: any, _limitDays?: number) {
  const now = startTime ? (startTime instanceof Date ? startTime : startTime.toDate?.() ?? new Date()) : new Date();
  const h = direction > 0 ? 6 : 18;
  const resultDate = new Date(now.getTime() + h * 3600000);
  return { date: resultDate, set: direction < 0 };
}

export { AstroTime as AstroTimeAlias };
