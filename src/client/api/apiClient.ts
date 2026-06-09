export type MeResponse = {
  user: {
    id: string;
    tokens: number;
    createdAt: string;
    role: "user" | "admin";
  };
};

export type OllamaStatus = {
  reachable: boolean;
  host: string;
  model: string;
  models: string[];
  error?: string;
};

export type ModePolicy = {
  id: "cloud" | "local";
  label: string;
  inference: string;
  internet: string;
  serverLogs: string;
  training: string;
};

export type DeploymentConfig = {
  cloud: { configured: boolean; envVar: string; detail?: string };
  local: { configured: boolean; envVar: string; detail?: string };
  mesh: { configured: boolean; envVar: string; detail?: string };
  vpnix: { configured: boolean; envVar: string; detail?: string };
  externalBilling: { configured: boolean; envVar: string; detail?: string };
  desktopClient: { configured: boolean; envVar: string; detail?: string };
  fileExtraction: { configured: boolean; envVar: string; detail?: string };
  modePolicies?: ModePolicy[];
};

export type AdminMetrics = {
  summary: { registeredUsers: number; totalJobs: number; failedJobs: number };
  jobQueues: Array<{
    mode: "cloud" | "local" | "mesh";
    queued: number;
    running: number;
    completed30m: number;
  }>;
  transactionHistory: Array<{
    id: string;
    userId: string;
    tokensDelta: number;
    reason: string;
    createdAt: string;
  }>;
};

const credentials: RequestInit = { credentials: "include" };

let cachedCsrf: string | null = null;

function readCsrfCookie() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)nc_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function ensureCsrfToken() {
  const fromCookie = readCsrfCookie();
  if (fromCookie) {
    cachedCsrf = fromCookie;
    return fromCookie;
  }
  if (cachedCsrf) return cachedCsrf;
  const res = await fetch("/api/auth/csrf", credentials);
  if (!res.ok) throw new Error(`CSRF fetch failed (${res.status}).`);
  const body = (await res.json()) as { csrfToken: string };
  cachedCsrf = body.csrfToken;
  return body.csrfToken;
}

function mutationHeaders(): HeadersInit {
  const headers = new Headers({ "content-type": "application/json" });
  const csrf = readCsrfCookie() ?? cachedCsrf;
  if (csrf) headers.set("X-CSRF-Token", csrf);
  return headers;
}

export async function bootstrapSession(): Promise<MeResponse> {
  await ensureCsrfToken().catch(() => null);
  const res = await fetch("/api/auth/bootstrap", { method: "POST", ...credentials });
  if (res.status === 429) {
    throw new Error("Account creation limit reached. Try again later.");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Bootstrap failed (${res.status}).`);
  }
  cachedCsrf = readCsrfCookie() ?? cachedCsrf;
  return (await res.json()) as MeResponse;
}

export async function fetchMe(): Promise<MeResponse | null> {
  const res = await fetch("/api/me", { ...credentials });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to load profile (${res.status}).`);
  await ensureCsrfToken().catch(() => null);
  return (await res.json()) as MeResponse;
}

export async function fetchDeploymentConfig(args?: { signal?: AbortSignal }): Promise<DeploymentConfig> {
  const res = await fetch("/api/deployment", { ...credentials, signal: args?.signal });
  if (!res.ok) throw new Error(`Deployment config failed (${res.status}).`);
  return (await res.json()) as DeploymentConfig;
}

export async function fetchOllamaStatus(args?: { signal?: AbortSignal }): Promise<OllamaStatus> {
  const res = await fetch("/api/local/ollama-status", { ...credentials, signal: args?.signal });
  if (!res.ok) throw new Error(`Ollama status failed (${res.status}).`);
  return (await res.json()) as OllamaStatus;
}

export type BillingConfig = {
  starterTokens: number;
  topUpUrl: string | null;
  localPrivateInference: boolean;
  localPrivacyNote: string;
};

export async function fetchBillingConfig(args?: { signal?: AbortSignal }): Promise<BillingConfig> {
  const res = await fetch("/api/billing", { ...credentials, signal: args?.signal });
  if (!res.ok) throw new Error(`Billing config failed (${res.status}).`);
  return (await res.json()) as BillingConfig;
}

async function streamPost(path: string, query: string, signal: AbortSignal) {
  await ensureCsrfToken();
  return fetch(path, {
    method: "POST",
    ...credentials,
    headers: mutationHeaders(),
    body: JSON.stringify({ query }),
    signal,
  });
}

export const sendCloudCoreStream = (args: { query: string; signal: AbortSignal }) =>
  streamPost("/api/cloudCore", args.query, args.signal);

export const sendLocalCoreStream = (args: { query: string; signal: AbortSignal }) =>
  streamPost("/api/localCore", args.query, args.signal);

export const sendMeshComputeStream = (args: { query: string; signal: AbortSignal }) =>
  streamPost("/api/mesh/compute", args.query, args.signal);

export async function fetchAdminMetrics(args?: { signal?: AbortSignal }): Promise<AdminMetrics> {
  const res = await fetch("/api/admin/metrics", { ...credentials, signal: args?.signal });
  if (!res.ok) throw new Error(`Admin metrics failed (${res.status}).`);
  return (await res.json()) as AdminMetrics;
}

export async function fetchOpsMetrics(args?: { signal?: AbortSignal }) {
  const res = await fetch("/api/metrics", { ...credentials, signal: args?.signal });
  if (!res.ok) throw new Error(`Metrics failed (${res.status}).`);
  return res.json();
}

export type InferenceLaneConfig = {
  lane: "cloud" | "corporate";
  label: string;
  zeroVpsCost: boolean;
  provider: string;
  model: string;
  host: string;
  thirdPartyVendor: boolean;
  promptsLeaveDevice: boolean;
  corporateInHouse: boolean;
  demoMode: boolean;
};

export type InferenceLanesStatus = {
  defaultLane: string;
  demoMode: boolean;
  geminiConfigured: boolean;
  corporateAvailable: boolean;
  cloud: InferenceLaneConfig;
  corporate: InferenceLaneConfig;
  pricing: {
    cloud: { priceFromUsd: number; product: string; infra: string };
    pocket?: { priceFromUsd: number; product: string; infra: string };
    corporate: { priceFromUsd: number; product: string; infra: string };
    retainer?: { priceFromUsd: number; product: string; infra: string; speed?: string };
  };
};

export async function fetchInferenceLanes(args?: { signal?: AbortSignal }): Promise<InferenceLanesStatus> {
  const res = await fetch("/api/inference/lanes", { ...credentials, signal: args?.signal });
  if (!res.ok) throw new Error(`Inference lanes failed (${res.status}).`);
  return (await res.json()) as InferenceLanesStatus;
}
