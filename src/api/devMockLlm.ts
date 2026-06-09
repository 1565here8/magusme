/** Streams a helpful message when Ollama is not installed (dev only). */
export async function* devMockTextStream(
  query: string,
  reason: string,
): AsyncGenerator<string> {
  const text =
    `**Local AI is not running yet**\n\n` +
    `${reason}\n\n` +
    `**Fix (one time):**\n` +
    `1. Double-click \`install-local-llm.bat\` in your project folder\n` +
    `2. Wait for the model download (~1–2 GB)\n` +
    `3. Restart \`start-app.bat\`\n\n` +
    `Your message was: "${query.slice(0, 120)}${query.length > 120 ? "…" : ""}"`;

  for (let i = 0; i < text.length; i += 3) {
    yield text.slice(i, i + 3);
    await new Promise((r) => setTimeout(r, 12));
  }
}

export function devMockLlmEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}
