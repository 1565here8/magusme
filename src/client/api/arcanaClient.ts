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

export type ArcanaPrivacyManifest = {
  llmMode: "local" | "private-cloud" | "auto";
  llmProvider: "ollama-local" | "ollama-private-cloud" | "blocked-remote";
  llmHost: string;
  llmModel: string;
  promptsLeaveDevice: boolean;
  privateCloud: boolean;
  dataSold: false;
  usedForModelTraining: false;
  thirdPartyAiVendors: false;
  minimalLogging: boolean;
  secureDefaults: boolean;
  streamingEnabled: boolean;
  notes: string[];
};

export type ArcanaStatus = {
  totalEntries: number;
  totalIndexLanes?: number;
  comprehensiveIndex?: boolean;
  ingestPerRun?: number;
  indexingMission?: string;
  lastRun: {
    sourcesChecked: number;
    entriesAdded: number;
    finishedAt: string;
  } | null;
  nextScheduledInMs: number;
  sources: Array<{ name: string; url: string }>;
  pricing: {
    spell: { cents: number; label: string };
    source: { cents: number; label: string };
    plan: { cents: number; label: string };
  };
  disclaimer: string;
  privacyNotice: string;
  privacy: ArcanaPrivacyManifest;
  pathAcknowledgment: string;
};

export type ArcanaRecommendation = {
  id: string;
  title: string;
  tradition: string;
  category: string;
  intentTags: string[];
  summary: string;
  previewText: string;
  isBaneful: boolean;
  backlashText: string;
  alternativesText: string;
  unlocked: boolean;
  sourceUnlocked: boolean;
};

export type OraclePersonalReading = {
  astroSummary: string | null;
  tarotAnchor: Array<{
    name: string;
    reversed: boolean;
    position?: string;
    meaning: string;
  }>;
};

export type ArcanaConsultRequest = {
  query: string;
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

export type ArcanaConsultResult = {
  consultationId: string;
  query: string;
  analysis: string;
  personalReading: OraclePersonalReading;
  peacefulOptions: ArcanaRecommendation[];
  historicalBanefulOptions: ArcanaRecommendation[];
  recommendations: ArcanaRecommendation[];
  disclaimer: string;
  privacy: ArcanaPrivacyManifest;
  pricing: { spellCents: number; sourceCents: number; planCents: number };
};

export type ArcanaEntryDetail = {
  preview: ArcanaRecommendation;
  fullText: string | null;
  backlash: string;
  alternatives: string;
  planetaryTiming: string;
  source: {
    title: string;
    author?: string;
    year?: string;
    institution?: string;
    url?: string;
    pdfRef?: string;
  };
};

async function jsonGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { ...credentials, signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status}).`);
  }
  return (await res.json()) as T;
}

async function jsonPost<T>(path: string, body: unknown): Promise<T> {
  await ensureCsrfToken();
  cachedCsrf = readCsrfCookie() ?? cachedCsrf;
  const res = await fetch(path, {
    method: "POST",
    ...credentials,
    headers: mutationHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errBody?.error ?? `Request failed (${res.status}).`);
  }
  return (await res.json()) as T;
}

export const fetchArcanaStatus = (signal?: AbortSignal) =>
  jsonGet<ArcanaStatus>("/api/arcana/status", signal);

export const consultArcana = (request: ArcanaConsultRequest) =>
  jsonPost<ArcanaConsultResult>("/api/arcana/consult", request);

export async function consultArcanaStream(
  request: ArcanaConsultRequest,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<ArcanaConsultResult> {
  await ensureCsrfToken();
  cachedCsrf = readCsrfCookie() ?? cachedCsrf;
  const res = await fetch("/api/arcana/consult/stream", {
    method: "POST",
    ...credentials,
    headers: mutationHeaders(),
    body: JSON.stringify(request),
    signal,
  });
  if (!res.ok) {
    const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errBody?.error ?? `Stream failed (${res.status}).`);
  }
  if (!res.body) throw new Error("No stream body.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: ArcanaConsultResult | null = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as
        | { type: "chunk"; text: string }
        | { type: "done"; result: ArcanaConsultResult }
        | { type: "error"; message: string };
      if (event.type === "chunk") onChunk(event.text);
      if (event.type === "done") result = event.result;
      if (event.type === "error") throw new Error(event.message);
    }
  }

  if (!result) throw new Error("Stream ended without result.");
  return result;
}

export const fetchArcanaEntry = (id: string) =>
  jsonGet<ArcanaEntryDetail>(`/api/arcana/entry/${id}`);

export const purchaseArcana = (entryId: string, purchaseType: "spell" | "source") =>
  jsonPost<{ ok: boolean; message?: string }>("/api/arcana/purchase", {
    entryId,
    purchaseType,
  });

export const purchaseArcanaPlan = (consultationId: string) =>
  jsonPost<{ ok: boolean; planMarkdown: string }>("/api/arcana/plan", { consultationId });

export type ArcanaSpellDetail = {
  pathChoice: "peaceful" | "violent";
  content: string;
  backlash: string;
  alternatives: string;
  planetaryTiming: string;
  disclaimer: string;
  spellFooter: string;
};

export const fetchArcanaSpellDetail = (
  entryId: string,
  args: { pathChoice: "peaceful" | "violent"; consultationId?: string },
) => jsonPost<ArcanaSpellDetail>(`/api/arcana/entry/${entryId}/detail`, args);

export type SearchQuotaStatus = {
  freePerDay: number;
  freeUsedToday: number;
  freeRemaining: number;
  monthlyActive: boolean;
  monthlyRemaining: number;
  monthlyLimit: number;
  monthlyExpiresAt: string | null;
  payPerSearchCents: number;
  monthlyPriceCents: number;
  payPerSearchLabel: string;
  monthlyPriceLabel: string;
  singleCreditsRemaining: number;
  btcpayConfigured?: boolean;
  requiresPayment: boolean;
};

export async function fetchSearchQuota(signal?: AbortSignal): Promise<SearchQuotaStatus> {
  const res = await fetch("/api/arcana/search/quota", { ...credentials, signal });
  if (!res.ok) throw new Error("Could not load search quota.");
  return res.json();
}

export async function createSearchBtcpayCheckout(kind: "single" | "monthly") {
  await ensureCsrfToken();
  const res = await fetch("/api/arcana/search/btcpay/checkout", {
    method: "POST",
    headers: mutationHeaders(),
    ...credentials,
    body: JSON.stringify({ kind }),
  });
  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    checkoutUrl?: string;
    paidSingleReady?: boolean;
    quota?: SearchQuotaStatus;
  };
  if (!res.ok) throw new Error(body.error ?? "Checkout failed.");
  return body;
}

/** @deprecated use createSearchBtcpayCheckout */
export async function purchaseSearchAccess(kind: "single" | "monthly") {
  await ensureCsrfToken();
  const res = await fetch("/api/arcana/search/purchase", {
    method: "POST",
    headers: mutationHeaders(),
    ...credentials,
    body: JSON.stringify({ kind }),
  });
  if (!res.ok) throw new Error("Purchase failed.");
  return res.json();
}

export type PaymentHealth = {
  payramConfigured: boolean;
  currency: string;
  products: Array<{ id: string; label: string; priceCents: number }>;
};

export async function fetchPaymentHealth(signal?: AbortSignal): Promise<PaymentHealth> {
  const res = await fetch("/api/payments/health", { ...credentials, signal });
  if (!res.ok) throw new Error("Could not load payment info.");
  return res.json();
}

export async function createPaymentCheckout(kind: "single" | "monthly", email?: string) {
  await ensureCsrfToken();
  const res = await fetch("/api/payments/create-checkout", {
    method: "POST",
    headers: mutationHeaders(),
    ...credentials,
    body: JSON.stringify({ product: kind === "monthly" ? "search_monthly" : "search_single", email }),
  });
  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    checkoutUrl?: string;
    referenceId?: string;
    amountInUSD?: number;
  };
  if (!res.ok) throw new Error(body.error ?? "Checkout failed.");
  return body;
}

export async function streamMagubrainSearch(
  query: string,
  onChunk: (text: string) => void,
  opts?: { paidSingle?: boolean },
): Promise<SearchQuotaStatus> {
  await ensureCsrfToken();
  const res = await fetch("/api/arcana/search/stream", {
    method: "POST",
    headers: mutationHeaders(),
    ...credentials,
    body: JSON.stringify({ query, paidSingle: opts?.paidSingle }),
  });
  if (res.status === 402) {
    const body = (await res.json()) as { error: string; quota?: SearchQuotaStatus };
    const err = new Error(body.error) as Error & { quota?: SearchQuotaStatus; paymentRequired: boolean };
    err.paymentRequired = true;
    err.quota = body.quota;
    throw err;
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Search failed.");
  }
  if (!res.body) throw new Error("No stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let quota: SearchQuotaStatus | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as { type: string; text?: string; quota?: SearchQuotaStatus };
      if (event.type === "chunk" && event.text) onChunk(event.text);
      if (event.type === "done" && event.quota) quota = event.quota;
    }
  }
  if (!quota) throw new Error("Search ended without quota update.");
  return quota;
}
