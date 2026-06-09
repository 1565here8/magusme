import { ensureCsrfToken } from "./apiClient";

const credentials: RequestInit = { credentials: "include" };

let cachedCsrf: string | null = null;

function readCsrfCookie() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)nc_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function mutationHeaders(): HeadersInit {
  const headers = new Headers({ "content-type": "application/json" });
  const csrf = readCsrfCookie() ?? cachedCsrf;
  if (csrf) headers.set("X-CSRF-Token", csrf);
  return headers;
}

export type SignPosition = {
  sign: string;
  degree: number;
  minute: number;
  longitude: number;
  label: string;
};

export type PlanetPosition = {
  body: string;
  longitude: number;
  sign: SignPosition;
  retrograde: boolean;
  house?: number;
};

export type PlanetaryHourSlot = {
  index: number;
  ruler: string;
  start: string;
  end: string;
  isDay: boolean;
  minutesRemaining?: number;
  progress?: number;
};

export type AstroSnapshot = {
  timestamp: string;
  location: { lat: number; lon: number; label?: string };
  moon: {
    fraction: number;
    name: string;
    emoji: string;
    waxing: boolean;
    ageDays: number;
    sign: string;
    signElement: string;
    signModality: string;
  };
  planets: PlanetPosition[];
  ascendant: SignPosition;
  midheaven: SignPosition;
  houses: Array<{ house: number; longitude: number; sign: SignPosition }>;
  planetaryHours: {
    dayRuler: string;
    weekday: string;
    current: PlanetaryHourSlot;
    dayHours: PlanetaryHourSlot[];
    nightHours: PlanetaryHourSlot[];
    sunrise: string;
    sunset: string;
    nextSunrise: string;
  };
  correspondences: {
    currentHourRuler: { metal: string; color: string; scent: string; day: string };
    dayRuler: { metal: string; color: string; scent: string; day: string };
  };
};

export type NatalChart = AstroSnapshot & {
  birth: { date: string; timeKnown: boolean };
};

export type DeepAstroProfile = {
  fullName: string;
  birth: NatalChart["birth"];
  location: NatalChart["location"];
  natal: NatalChart;
  numerology: {
    lifePath: { number: number; master: boolean; label: string };
    expression: { number: number; master: boolean; label: string };
    soulUrge: { number: number; master: boolean; label: string };
    personality: { number: number; master: boolean; label: string };
    summary: string;
  };
  chineseZodiac: { animal: string; element: string; yinYang: string; label: string };
  chartRuler: { planet: string; reason: string };
  sunSign: string;
  moonSign: string;
  risingSign: string;
  dominantElement: { element: string; count: number; planets: string[] };
  dominantModality: { modality: string; count: number; planets: string[] };
  nameAstroHarmony: { lifePathPlanet: string; expressionSignAffinity: string; synthesis: string };
  aspects: Array<{ planetA: string; planetB: string; type: string; orb: number; interpretation: string }>;
  personalYear: { year: number; number: number; theme: string };
  manifestationProfile: {
    strengths: string[];
    challenges: string[];
    bestPlanetaryDays: string[];
    recommendedPractices: string[];
  };
  summary: string;
};

export type DivinationMethod = {
  id: string;
  label: string;
  category: string;
  mode: string;
  blurb: string;
  tradition?: string;
};

export type DivinationCatalogResponse = {
  total: number;
  catalog: DivinationMethod[];
  categories: Record<string, DivinationMethod[]>;
};

export type ReadingMeta =
  | { type: "tarot"; cards: Array<{ id: string; name: string; reversed: boolean; position?: string; keywords?: string }> }
  | { type: "rune"; runes: Array<{ id: string; glyph: string; name: string; merkstave: boolean; position?: string }> }
  | { type: "numerology"; profile: { lifePath: { number: number }; expression: { number: number }; soulUrge: { number: number }; personality: { number: number } } }
  | { type: "generic"; divinationId: string; label: string; focus?: string }
  | { type: "coffee" | "palm" | "face"; focus: string };

export async function fetchDivinations(): Promise<DivinationCatalogResponse> {
  const res = await fetch("/api/arcana/divinations", credentials);
  if (!res.ok) throw new Error("Failed to load divination catalog.");
  return (await res.json()) as DivinationCatalogResponse;
}

export type MerlianPersonalizationPayload = {
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  lat?: number;
  lon?: number;
  culturalBackground?: string;
  heritageCommunity?: string;
  destinationPlace?: string;
  growthAreas?: string;
  includeTarotAnchor?: boolean;
};

export async function streamDivination(
  body: {
    divinationId: string;
    question?: string;
    description?: string;
    birthDate?: string;
    fullName?: string;
    spread?: string;
    cast?: string;
  } & MerlianPersonalizationPayload,
  onChunk: (text: string) => void,
  onMeta?: (meta: ReadingMeta) => void,
  signal?: AbortSignal,
): Promise<void> {
  await ensureCsrfToken();
  cachedCsrf = readCsrfCookie() ?? cachedCsrf;
  const res = await fetch("/api/arcana/divination/stream", {
    method: "POST",
    ...credentials,
    headers: mutationHeaders(),
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errBody?.error ?? `Reading failed (${res.status}).`);
  }
  if (!res.body) throw new Error("No stream body.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as
        | { type: "meta"; meta: ReadingMeta }
        | { type: "chunk"; text: string }
        | { type: "error"; message: string };
      if (event.type === "meta") onMeta?.(event.meta);
      if (event.type === "chunk") onChunk(event.text);
      if (event.type === "error") throw new Error(event.message);
    }
  }
}

export type ReadingType = "tarot" | "rune" | "coffee" | "palm" | "face";

export type ReadingResult = {
  type: ReadingType;
  question: string;
  meta: ReadingMeta;
  reading: string;
  disclaimer: string;
};

export async function fetchAstroNow(args: {
  lat: number;
  lon: number;
  label?: string;
  signal?: AbortSignal;
}): Promise<AstroSnapshot> {
  const params = new URLSearchParams({
    lat: String(args.lat),
    lon: String(args.lon),
    at: new Date().toISOString(),
  });
  if (args.label) params.set("label", args.label);
  const res = await fetch(`/api/arcana/astro/now?${params}`, { ...credentials, signal: args.signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Astro fetch failed (${res.status}).`);
  }
  return (await res.json()) as AstroSnapshot;
}

export async function fetchNatalChart(body: {
  birthDate: string;
  birthTime?: string;
  lat: number;
  lon: number;
  label?: string;
}): Promise<NatalChart> {
  const res = await fetch("/api/arcana/astro/natal", {
    method: "POST",
    ...credentials,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Natal chart failed (${res.status}).`);
  }
  return (await res.json()) as NatalChart;
}

export async function fetchDeepAstroProfile(body: {
  birthDate: string;
  birthTime?: string;
  fullName: string;
  lat: number;
  lon: number;
  label?: string;
}): Promise<DeepAstroProfile> {
  const res = await fetch("/api/arcana/astro/deep-profile", {
    method: "POST",
    ...credentials,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Deep profile failed (${res.status}).`);
  }
  return (await res.json()) as DeepAstroProfile;
}

export async function streamMerlianReading(
  type: ReadingType,
  body: Record<string, unknown>,
  onChunk: (text: string) => void,
  onMeta?: (meta: ReadingMeta) => void,
  signal?: AbortSignal,
): Promise<ReadingResult> {
  await ensureCsrfToken();
  cachedCsrf = readCsrfCookie() ?? cachedCsrf;
  const res = await fetch(`/api/arcana/readings/${type}/stream`, {
    method: "POST",
    ...credentials,
    headers: mutationHeaders(),
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errBody?.error ?? `Reading failed (${res.status}).`);
  }
  if (!res.body) throw new Error("No stream body.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: ReadingResult | null = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as
        | { type: "meta"; meta: ReadingMeta }
        | { type: "chunk"; text: string }
        | { type: "done"; result: ReadingResult }
        | { type: "error"; message: string };
      if (event.type === "meta") onMeta?.(event.meta);
      if (event.type === "chunk") onChunk(event.text);
      if (event.type === "done") result = event.result;
      if (event.type === "error") throw new Error(event.message);
    }
  }

  if (!result) throw new Error("Reading ended without result.");
  return result;
}
