import { resolvePrivateClusterUrl } from "./cloudClusterUrl";
import { devMockLlmEnabled, devMockTextStream } from "./devMockLlm";
import { ollamaTextStream } from "./ollamaLocal";
import { probeOllama } from "./ollamaStatus";

export type CloudCoreTextStreamOptions = {
  controllerSignal?: AbortSignal;
};

function devCloudUsesOllama(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.DEV_CLOUD_USE_OLLAMA?.trim().toLowerCase() === "true";
}

export async function* cloudCoreTextStream(
  query: string,
  options: CloudCoreTextStreamOptions = {},
): AsyncGenerator<string> {
  const baseUrl = resolvePrivateClusterUrl();
  if (!baseUrl) {
    if (devCloudUsesOllama()) {
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
    throw new Error("Cloud is not configured. Set CLOUD_NO_TRAINING_ACTIVE=true in .env");
  }

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: options.controllerSignal,
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Cloud upstream error ${response.status}: ${bodyText || response.statusText}`);
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
