import { Body, MakeTime, Observer, SearchRiseSet, type AstroTime } from "./astronomyCompat";

export const CHALDEAN_ORDER = [
  "Saturn",
  "Jupiter",
  "Mars",
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
] as const;

export type PlanetRuler = (typeof CHALDEAN_ORDER)[number];

const WEEKDAY_RULER: PlanetRuler[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

export type PlanetaryHourSlot = {
  index: number;
  ruler: PlanetRuler;
  start: string;
  end: string;
  isDay: boolean;
};

export type PlanetaryHourState = {
  dayRuler: PlanetRuler;
  weekday: string;
  current: PlanetaryHourSlot & { minutesRemaining: number; progress: number };
  dayHours: PlanetaryHourSlot[];
  nightHours: PlanetaryHourSlot[];
  sunrise: string;
  sunset: string;
  nextSunrise: string;
};

function localWeekday(date: Date, lon: number): number {
  const approx = new Date(date.getTime() + (lon / 15) * 3_600_000);
  return approx.getUTCDay();
}

function chaldeanFrom(startRuler: PlanetRuler, offset: number): PlanetRuler {
  const start = CHALDEAN_ORDER.indexOf(startRuler);
  return CHALDEAN_ORDER[(start + offset) % CHALDEAN_ORDER.length]!;
}

function buildSlots(
  start: Date,
  end: Date,
  firstRuler: PlanetRuler,
  isDay: boolean,
): PlanetaryHourSlot[] {
  const durationMs = (end.getTime() - start.getTime()) / 12;
  const slots: PlanetaryHourSlot[] = [];
  for (let i = 0; i < 12; i++) {
    const slotStart = new Date(start.getTime() + durationMs * i);
    const slotEnd = new Date(start.getTime() + durationMs * (i + 1));
    slots.push({
      index: i + 1,
      ruler: chaldeanFrom(firstRuler, i),
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      isDay,
    });
  }
  return slots;
}

function findRiseSet(
  observer: Observer,
  time: AstroTime,
): { sunrise: Date; sunset: Date; nextSunrise: Date } {
  const rise = SearchRiseSet(Body.Sun, observer, +1, time, 1);
  const set = SearchRiseSet(Body.Sun, observer, -1, time, 1);
  const nextRise = SearchRiseSet(
    Body.Sun,
    observer,
    +1,
    MakeTime(set!.date.getTime() + 60_000),
    1,
  );
  if (!rise || !set || !nextRise) {
    throw new Error("Could not compute sunrise/sunset for this location.");
  }
  return { sunrise: rise.date, sunset: set.date, nextSunrise: nextRise.date };
}

export function planetaryHoursAt(
  date: Date,
  lat: number,
  lon: number,
): PlanetaryHourState {
  const observer = new Observer(lat, lon, 0);
  const time = MakeTime(date);
  const { sunrise, sunset, nextSunrise } = findRiseSet(observer, time);

  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayIndex = localWeekday(date, lon);
  const weekday = weekdayNames[weekdayIndex]!;
  const dayRuler = WEEKDAY_RULER[weekdayIndex]!;

  const dayHours = buildSlots(sunrise, sunset, dayRuler, true);
  const nightHours = buildSlots(sunset, nextSunrise, chaldeanFrom(dayRuler, 12), false);
  const all = [...dayHours, ...nightHours];

  const nowMs = date.getTime();
  const current =
    all.find((s) => nowMs >= new Date(s.start).getTime() && nowMs < new Date(s.end).getTime()) ??
    all[0]!;
  const endMs = new Date(current.end).getTime();
  const startMs = new Date(current.start).getTime();
  const minutesRemaining = Math.max(0, Math.ceil((endMs - nowMs) / 60_000));
  const progress = Math.min(1, Math.max(0, (nowMs - startMs) / (endMs - startMs)));

  return {
    dayRuler,
    weekday,
    current: { ...current, minutesRemaining, progress },
    dayHours,
    nightHours,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    nextSunrise: nextSunrise.toISOString(),
  };
}

export const PLANET_CORRESPONDENCES: Record<
  PlanetRuler,
  { metal: string; color: string; scent: string; day: string }
> = {
  Sun: { metal: "Gold", color: "Gold / Yellow", scent: "Frankincense", day: "Sunday" },
  Moon: { metal: "Silver", color: "White / Silver", scent: "Jasmine", day: "Monday" },
  Mars: { metal: "Iron", color: "Red", scent: "Dragon's blood", day: "Tuesday" },
  Mercury: { metal: "Mercury / Alloy", color: "Orange / Yellow", scent: "Lavender", day: "Wednesday" },
  Jupiter: { metal: "Tin", color: "Blue / Purple", scent: "Cedar", day: "Thursday" },
  Venus: { metal: "Copper", color: "Green / Pink", scent: "Rose", day: "Friday" },
  Saturn: { metal: "Lead", color: "Black / Indigo", scent: "Myrrh", day: "Saturday" },
};
