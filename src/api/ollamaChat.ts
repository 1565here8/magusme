export type OllamaChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type OllamaChatOptions = {
  controllerSignal?: AbortSignal;
  model?: string;
  host?: string;
  messages: OllamaChatMessage[];
  keepAlive?: string | number;
  performance?: { num_predict?: number; num_ctx?: number; temperature?: number };
};

export async function* ollamaChatStream(
  options: OllamaChatOptions,
): AsyncGenerator<string> {
  const host = (options.host ?? process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434").replace(
    /\/$/,
    "",
  );
  const model = options.model ?? process.env.OLLAMA_MODEL ?? "llama3.2:3b";
  const keepAlive = options.keepAlive ?? 0;

  const response = await fetch(`${host}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: options.controllerSignal,
    body: JSON.stringify({
      model,
      messages: options.messages,
      stream: true,
      keep_alive: keepAlive,
      options: options.performance,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(
      `Ollama error ${response.status}: ${bodyText || response.statusText}. Is Ollama running?`,
    );
  }

  if (!response.body) {
    const text = await response.text();
    yield parseNonStream(text);
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
      const chunk = parseLine(line);
      if (chunk) yield chunk;
    }
  }

  if (buffer.trim()) {
    const chunk = parseLine(buffer);
    if (chunk) yield chunk;
  }
}

export async function ollamaChatComplete(
  options: OllamaChatOptions,
): Promise<string> {
  let text = "";
  for await (const chunk of ollamaChatStream(options)) {
    text += chunk;
  }
  return text;
}

function parseLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return "";
  try {
    const json = JSON.parse(trimmed) as { message?: { content?: string }; response?: string };
    return json.message?.content ?? json.response ?? "";
  } catch {
    return "";
  }
}

function parseNonStream(text: string): string {
  try {
    const json = JSON.parse(text) as { message?: { content?: string } };
    return json.message?.content ?? text;
  } catch {
    return text;
  }
}
