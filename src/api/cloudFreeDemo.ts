/** Free Cloud tier — streams answers without Ollama or any install on the user's PC. */

export function cloudFreeDemoEnabled(): boolean {
  return process.env.CLOUD_FREE_DEMO?.trim().toLowerCase() !== "false";
}

export async function* cloudFreeTextStream(query: string): AsyncGenerator<string> {
  const q = query.trim();
  const preview = q.length > 200 ? `${q.slice(0, 200)}…` : q;

  const text =
    `**Cloud Core — free tier**\n\n` +
    `You asked:\n> ${preview.replace(/\n/g, "\n> ")}\n\n` +
    `This response is from the **hosted Cloud demo** on your Cerebelix server. ` +
    `You do **not** need Ollama or any local AI install to use Cloud mode.\n\n` +
    `**How it works**\n` +
    `- Your browser talks to this app over the internet (or localhost in dev).\n` +
    `- Inference runs on the **server**, not on your PC.\n` +
    `- You start with free session tokens; each message uses a small amount.\n` +
    `- We do **not** send your chats to OpenAI-style vendors for model training in this demo path.\n\n` +
    `**Upgrade path (operator)**\n` +
    `For full-strength models, set \`PRIVATE_CLUSTER_URL\` on the server to your own GPU cluster ` +
    `and set \`CLOUD_FREE_DEMO=false\`.\n\n` +
    `*Demo note: replies are templated until a real cloud upstream is connected.*`;

  for (let i = 0; i < text.length; i += 4) {
    yield text.slice(i, i + 4);
    await new Promise((r) => setTimeout(r, 8));
  }
}
