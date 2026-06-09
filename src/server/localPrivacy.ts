import type { NetworkCoreMode } from "./db/models";

/** Local prompts stay on-device; optional skip of server-side chat logs for privacy. */
export function shouldLogChatHistory(mode: NetworkCoreMode): boolean {
  if (mode !== "local") return true;
  const flag = process.env.LOCAL_PRIVATE_INFERENCE?.trim().toLowerCase();
  if (flag === "false") return true;
  // Default: no server logs for local Ollama (not used for ML training — runs on user's PC only)
  return false;
}

export function localPrivacySummary(): string {
  return "Local mode: inference runs on your machine via Ollama. Prompts are not sent to OpenAI or other cloud trainers. Server chat logs are disabled by default.";
}
