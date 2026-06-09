let baseUrl = "http://localhost:11434";

export function setOllamaBaseUrl(url: string) {
  baseUrl = url;
}

export function getOllamaClient() {
  return {
    async generate(prompt: string, model = "qwen2.5:3b"): Promise<string> {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, stream: false }),
      });
      if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
      const data = await res.json();
      return data.response || "";
    },

    async chat(messages: Array<{ role: string; content: string }>, model = "qwen2.5:3b"): Promise<string> {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, stream: false }),
      });
      if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
      const data = await res.json();
      return data.message?.content || "";
    },

    async isAvailable(): Promise<boolean> {
      try {
        const res = await fetch(`${baseUrl}/api/tags`);
        return res.ok;
      } catch {
        return false;
      }
    },
  };
}
