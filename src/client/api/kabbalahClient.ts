import { ensureCsrfToken } from "./apiClient";

const credentials: RequestInit = { credentials: "include" };

function readCsrfCookie() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)nc_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function mutationHeaders(): HeadersInit {
  const headers = new Headers({ "content-type": "application/json" });
  const csrf = readCsrfCookie();
  if (csrf) headers.set("X-CSRF-Token", csrf);
  return headers;
}

export type KabbalahVaultStatus = {
  dangerBanner: string;
  vaultAcknowledgment: string;
  totalEntries: number;
  separated: boolean;
  classification: "most_dangerous";
  divinations: Array<{
    id: string;
    label: string;
    blurb: string;
    tradition: string;
    mode: string;
  }>;
  entries: Array<{
    id: string;
    title: string;
    tradition: string;
    isBaneful: boolean;
    summary: string;
  }>;
};

export type KabbalahConsultResult = {
  consultationId: string;
  query: string;
  analysis: string;
  recommendations: Array<{
    id: string;
    title: string;
    tradition: string;
    summary: string;
    isBaneful: boolean;
    unlocked: boolean;
  }>;
  disclaimer: string;
};

export async function fetchKabbalahVaultStatus(signal?: AbortSignal): Promise<KabbalahVaultStatus> {
  const res = await fetch("/api/arcana/kabbalah/status", { ...credentials, signal });
  if (!res.ok) throw new Error("Failed to load Kabbalah Vault status.");
  return res.json();
}

export async function consultKabbalahVaultStream(
  query: string,
  onChunk: (text: string) => void,
): Promise<KabbalahConsultResult> {
  await ensureCsrfToken();
  const res = await fetch("/api/arcana/kabbalah/consult/stream", {
    method: "POST",
    headers: mutationHeaders(),
    ...credentials,
    body: JSON.stringify({ query, vaultAcknowledged: true }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Vault consultation failed.");
  }
  if (!res.body) throw new Error("No response stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: KabbalahConsultResult | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as { type: string; text?: string; result?: KabbalahConsultResult };
      if (event.type === "chunk" && event.text) onChunk(event.text);
      if (event.type === "done" && event.result) result = event.result;
    }
  }

  if (!result) throw new Error("Vault consultation ended without result.");
  return result;
}

export async function streamKabbalahDivination(
  args: {
    divinationId: string;
    question?: string;
    description?: string;
  },
  onChunk: (text: string) => void,
): Promise<string> {
  await ensureCsrfToken();
  const res = await fetch("/api/arcana/kabbalah/divination/stream", {
    method: "POST",
    headers: mutationHeaders(),
    ...credentials,
    body: JSON.stringify({ ...args, vaultAcknowledged: true }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Vault divination failed.");
  }
  if (!res.body) throw new Error("No response stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let reading = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as { type: string; text?: string; reading?: string };
      if (event.type === "chunk" && event.text) {
        reading += event.text;
        onChunk(event.text);
      }
      if (event.type === "done" && event.reading) reading = event.reading;
    }
  }

  return reading;
}
