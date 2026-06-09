import { devMockLlmEnabled, devMockTextStream } from "./devMockLlm";
import { ollamaTextStream } from "./ollamaLocal";
import { probeOllama } from "./ollamaStatus";

export type LocalCoreTextStreamOptions = {
  controllerSignal?: AbortSignal;
};

function useOllamaLocal(): boolean {
  const provider = process.env.LOCAL_LLM_PROVIDER?.trim().toLowerCase();
  const url = process.env.LOCAL_CORE_URL?.trim().toLowerCase();
  return provider === "ollama" || url === "ollama" || url === "ollama://local";
}

export async function* localCoreTextStream(
  query: string,
  options: LocalCoreTextStreamOptions = {},
): AsyncGenerator<string> {
  if (useOllamaLocal()) {
    const status = await probeOllama();
    if (status.reachable && !status.error) {
      yield* ollamaTextStream(query, { controllerSignal: options.controllerSignal });
      return;
    }
    const reason = status.error ?? "Ollama is not running on this PC.";
    if (devMockLlmEnabled()) {
      yield* devMockTextStream(query, reason);
      return;
    }
    throw new Error(reason);
  }

  const baseUrl = process.env.LOCAL_CORE_URL?.trim();
  if (!baseUrl) {
    throw new Error("LOCAL_CORE_URL is not configured. Set LOCAL_LLM_PROVIDER=ollama for offline Ollama.");
  }

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: options.controllerSignal,
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Local upstream error ${response.status}: ${bodyText || response.statusText}`);
  }

  if (!response.body) {
    yield await response.text();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
