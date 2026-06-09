import type { OllamaChatOptions } from "../../api/ollamaChat";
import { ollamaChatComplete, ollamaChatStream } from "../../api/ollamaChat";
import {
  arcanaCloudLlmEnabled,
  arcanaCloudModel,
  arcanaCloudComplete,
  arcanaCloudStream,
  resolveArcanaCloudProvider,
} from "./llm/cloudLane";

export type ArcanaLlmMode = "local" | "private-cloud" | "auto" | "cloud";

export type ArcanaPrivacyManifest = {
  llmMode: ArcanaLlmMode;
  llmProvider:
    | "ollama-local"
    | "ollama-private-cloud"
    | "gemini-cloud"
    | "groq-cloud"
    | "xai-cloud"
    | "blocked-remote";
  llmHost: string;
  llmModel: string;
  promptsLeaveDevice: boolean;
  /** True when using your own VPS — still private, not a public AI vendor */
  privateCloud: boolean;
  dataSold: false;
  usedForModelTraining: false;
  thirdPartyAiVendors: false;
  minimalLogging: boolean;
  secureDefaults: boolean;
  streamingEnabled: boolean;
  notes: string[];
};

const BLOCKED_PUBLIC_HOSTS = [
  "api.openai.com",
  "openai.com",
  "api.anthropic.com",
  "generativelanguage.googleapis.com",
  "api.groq.com",
  "openrouter.ai",
  "api.together.xyz",
];

function arcanaLlmMode(): ArcanaLlmMode {
  const raw = process.env.ARCANA_LLM_MODE?.trim().toLowerCase();
  if (raw === "local" || raw === "private-cloud" || raw === "auto") return raw;
  return process.env.ARCANA_PRIVATE_CLOUD_URL?.trim() ? "auto" : "local";
}

function arcanaMinimalLogging() {
  return process.env.ARCANA_MINIMAL_LOGGING === "true";
}

function arcanaRequireTrustedOnly() {
  return process.env.ARCANA_REQUIRE_LOCAL_LLM !== "false";
}

function trustedHostnames(): Set<string> {
  const fromEnv = (process.env.ARCANA_TRUSTED_OLLAMA_HOSTS ?? "")
    .split(/[,;\s]+/)
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const cloud = process.env.ARCANA_PRIVATE_CLOUD_URL?.trim();
  if (cloud) {
    try {
      fromEnv.push(new URL(cloud).hostname.toLowerCase());
    } catch {
      // ignore invalid URL
    }
  }

  fromEnv.push("127.0.0.1", "localhost", "::1", "ollama");
  return new Set(fromEnv);
}

function isLocalHost(hostname: string) {
  const h = hostname.toLowerCase();
  return h === "127.0.0.1" || h === "localhost" || h === "::1" || h === "ollama";
}

function isBlockedPublicHost(hostname: string) {
  const h = hostname.toLowerCase();
  return BLOCKED_PUBLIC_HOSTS.some((b) => h === b || h.endsWith(`.${b}`));
}

export function resolveArcanaOllamaHost(): string {
  const mode = arcanaLlmMode();
  const privateCloud = process.env.ARCANA_PRIVATE_CLOUD_URL?.trim().replace(/\/$/, "");
  const local = (process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(/\/$/, "");

  if (mode === "private-cloud" && privateCloud) return privateCloud;
  if (mode === "auto" && privateCloud) return privateCloud;
  return local;
}

export function resolveArcanaOllamaModel() {
  return process.env.OLLAMA_MODEL ?? "llama3.2:3b";
}

function validateArcanaHost(hostUrl: string) {
  let hostname: string;
  try {
    hostname = new URL(hostUrl).hostname;
  } catch {
    throw new Error(`Invalid Ollama host URL: ${hostUrl}`);
  }

  if (isBlockedPublicHost(hostname)) {
    throw new Error(
      `Blocked host ${hostname} — Arcana does not use public AI vendor APIs. Use local Ollama or your own private-cloud VPS.`,
    );
  }

  if (!arcanaRequireTrustedOnly()) return;

  const trusted = trustedHostnames();
  const mode = arcanaLlmMode();
  const local = isLocalHost(hostname);

  if (local) return;

  if (mode === "local") {
    throw new Error(
      `ARCANA_LLM_MODE=local requires localhost. Current host: ${hostUrl}. Set ARCANA_LLM_MODE=private-cloud and ARCANA_PRIVATE_CLOUD_URL for your VPS.`,
    );
  }

  if (!trusted.has(hostname.toLowerCase())) {
    throw new Error(
      `Untrusted Ollama host ${hostname}. Add it to ARCANA_TRUSTED_OLLAMA_HOSTS or set ARCANA_PRIVATE_CLOUD_URL.`,
    );
  }
}

export function assertArcanaTrustedLlm() {
  validateArcanaHost(resolveArcanaOllamaHost());
}

/** @deprecated use assertArcanaTrustedLlm */
export function assertArcanaLocalLlm() {
  assertArcanaTrustedLlm();
}

export function getArcanaPrivacyManifest(): ArcanaPrivacyManifest {
  const cloudProvider = resolveArcanaCloudProvider();
  if (cloudProvider) {
    const groq = cloudProvider === "groq-cloud";
    const xai = cloudProvider === "xai-cloud";
    return {
      llmMode: "cloud",
      llmProvider: cloudProvider,
      llmHost: groq ? "api.groq.com" : xai ? "api.x.ai" : "generativelanguage.googleapis.com",
      llmModel: arcanaCloudModel(cloudProvider),
      promptsLeaveDevice: true,
      privateCloud: false,
      dataSold: false,
      usedForModelTraining: false,
      thirdPartyAiVendors: true,
      minimalLogging: arcanaMinimalLogging(),
      secureDefaults: true,
      streamingEnabled: true,
      notes: [
        xai
          ? "Megamind Cloud via xAI Grok — set XAI_API_KEY from console.x.ai."
          : groq
            ? "Megamind Cloud via Groq LPU — set GROQ_API_KEY (not the same as Grok)."
            : "Megamind Cloud via Gemini Flash — set GEMINI_API_KEY.",
        "ARCANA_CLOUD_PREFER=gemini | grok | groq picks default vendor.",
        "No data sales. Vendor may log per their API terms.",
      ],
    };
  }

  const host = resolveArcanaOllamaHost();
  let hostname = "unknown";
  try {
    hostname = new URL(host).hostname;
  } catch {
    // keep unknown
  }

  const local = isLocalHost(hostname);
  const privateCloud = !local && !isBlockedPublicHost(hostname);
  const mode = arcanaLlmMode();

  let provider: ArcanaPrivacyManifest["llmProvider"] = "blocked-remote";
  if (local) provider = "ollama-local";
  else if (privateCloud) provider = "ollama-private-cloud";

  return {
    llmMode: mode,
    llmProvider: provider,
    llmHost: host,
    llmModel: resolveArcanaOllamaModel(),
    promptsLeaveDevice: !local,
    privateCloud,
    dataSold: false,
    usedForModelTraining: false,
    thirdPartyAiVendors: false,
    minimalLogging: arcanaMinimalLogging(),
    secureDefaults: arcanaRequireTrustedOnly() && (local || privateCloud),
    streamingEnabled: true,
    notes: [
      local
        ? "Running on this machine — prompts never leave your PC."
        : privateCloud
          ? "Private-cloud Ollama on YOUR server — not OpenAI/Google/Groq."
          : "Configure ARCANA_PRIVATE_CLOUD_URL or local Ollama.",
      "No data sales. No vendor model training.",
      privateCloud
        ? "OLLAMA_KEEP_ALIVE=5m keeps the model warm on your VPS for faster replies."
        : "Use llama3.2:3b or llama3.1:8b for speed vs quality balance.",
    ],
  };
}

export function arcanaOllamaPerformanceOptions() {
  const numPredict = Number(process.env.OLLAMA_NUM_PREDICT ?? 2048);
  const numCtx = Number(process.env.OLLAMA_NUM_CTX ?? 4096);
  const host = resolveArcanaOllamaHost();
  let local = true;
  try {
    local = isLocalHost(new URL(host).hostname);
  } catch {
    local = true;
  }
  const keepAlive = process.env.OLLAMA_KEEP_ALIVE ?? (local ? "0" : "5m");

  return {
    keep_alive: keepAlive,
    options: {
      num_predict: Number.isFinite(numPredict) ? numPredict : 2048,
      num_ctx: Number.isFinite(numCtx) ? numCtx : 4096,
      temperature: 0.75,
    },
  };
}

function cloudFromMessages(options: OllamaChatOptions): { system?: string; prompt: string } {
  if (options.messages?.length) {
    const system = options.messages.find((m) => m.role === "system")?.content;
    const prompt = options.messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n\n");
    return { system, prompt };
  }
  const legacy = options as OllamaChatOptions & { system?: string; prompt?: string };
  return { system: legacy.system, prompt: legacy.prompt ?? "" };
}

export async function arcanaLlmComplete(options: OllamaChatOptions): Promise<string> {
  if (arcanaCloudLlmEnabled() && resolveArcanaCloudProvider()) {
    const { system, prompt } = cloudFromMessages(options);
    return arcanaCloudComplete(system, prompt);
  }
  assertArcanaTrustedLlm();
  const perf = arcanaOllamaPerformanceOptions();
  return ollamaChatComplete({
    ...options,
    host: resolveArcanaOllamaHost(),
    model: resolveArcanaOllamaModel(),
    keepAlive: perf.keep_alive,
    performance: perf.options,
  });
}

export async function* arcanaLlmStream(
  options: OllamaChatOptions,
): AsyncGenerator<string> {
  if (arcanaCloudLlmEnabled() && resolveArcanaCloudProvider()) {
    const { system, prompt } = cloudFromMessages(options);
    yield* arcanaCloudStream(system, prompt);
    return;
  }
  assertArcanaTrustedLlm();
  const perf = arcanaOllamaPerformanceOptions();
  yield* ollamaChatStream({
    ...options,
    host: resolveArcanaOllamaHost(),
    model: resolveArcanaOllamaModel(),
    keepAlive: perf.keep_alive,
    performance: perf.options,
  });
}

export function sanitizeConsultationForStorage(query: string, analysisPreview: string) {
  if (!arcanaMinimalLogging()) {
    return { query, responsePreview: analysisPreview };
  }
  return {
    query: `[local-only] ${query.slice(0, 80)}${query.length > 80 ? "…" : ""}`,
    responsePreview: analysisPreview.slice(0, 200) + (analysisPreview.length > 200 ? "…" : ""),
  };
}
