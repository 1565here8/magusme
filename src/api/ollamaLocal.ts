export type OllamaStreamOptions = {
  controllerSignal?: AbortSignal;
  model?: string;
  host?: string;
};

/** Stream assistant text from a local Ollama instance (default http://127.0.0.1:11434). */
export async function* ollamaTextStream(
  query: string,
  options: OllamaStreamOptions = {},
): AsyncGenerator<string> {
  const host = (options.host ?? process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(
    /\/$/,
    "",
  );
  const model = options.model ?? process.env.OLLAMA_MODEL ?? "llama3.2:1b";
  const numPredict = Number(process.env.OLLAMA_NUM_PREDICT ?? 2048);
  const keepAlive = process.env.OLLAMA_KEEP_ALIVE?.trim() || "5m";

  const response = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: options.controllerSignal,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: query }],
      stream: true,
      options: { num_predict: Number.isFinite(numPredict) ? numPredict : 2048 },
      keep_alive: keepAlive,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(
      `Ollama error ${response.status}: ${bodyText || response.statusText}. Is Ollama running? Try: ollama serve`,
    );
  }

  if (!response.body) {
    const text = await response.text();
    yield parseOllamaNonStream(text);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const chunk = parseOllamaLine(line);
      if (chunk) yield chunk;
    }
  }

  if (buffer.trim()) {
    const chunk = parseOllamaLine(buffer);
    if (chunk) yield chunk;
  }
}

function parseOllamaLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return "";
  try {
    const json = JSON.parse(trimmed) as { message?: { content?: string }; response?: string };
    return json.message?.content ?? json.response ?? "";
  } catch {
    return "";
  }
}

function parseOllamaNonStream(text: string): string {
  try {
    const json = JSON.parse(text) as { message?: { content?: string } };
    return json.message?.content ?? text;
  } catch {
    return text;
  }
}
