export type OllamaStatus = {
  reachable: boolean;
  host: string;
  model: string;
  models: string[];
  error?: string;
};

let cachedProbe: { at: number; status: OllamaStatus } | null = null;
const PROBE_TTL_MS = 8_000;

export async function probeOllama(force = false): Promise<OllamaStatus> {
  if (!force && cachedProbe && Date.now() - cachedProbe.at < PROBE_TTL_MS) {
    return cachedProbe.status;
  }

  const host = (process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL?.trim() || "llama3.2:1b";

  try {
    const res = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) {
      return {
        reachable: false,
        host,
        model,
        models: [],
        error: `Ollama returned ${res.status}`,
      };
    }
    const body = (await res.json()) as { models?: Array<{ name?: string }> };
    const models = (body.models ?? []).map((m) => m.name ?? "").filter(Boolean);
    const hasModel = models.some((n) => n === model || n.startsWith(`${model}:`));
    const status: OllamaStatus = {
      reachable: true,
      host,
      model,
      models,
      error: hasModel ? undefined : `Model "${model}" not pulled. Run: ollama pull ${model}`,
    };
    cachedProbe = { at: Date.now(), status };
    return status;
  } catch (err) {
    const status: OllamaStatus = {
      reachable: false,
      host,
      model,
      models: [],
      error: err instanceof Error ? err.message : "Ollama not reachable",
    };
    cachedProbe = { at: Date.now(), status };
    return status;
  }
}
