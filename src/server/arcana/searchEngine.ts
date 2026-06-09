import { MERLIAN_GENERAL_SEPARATION_RULE } from "./contentPolicy";
import { arcanaLlmStream } from "./privacy";
import { formatEntriesForLlm, searchArcanaEntries } from "./search";
import { getArcanaDb } from "./arcanaDb";

const MAGUBRAIN_SEARCH_PROMPT = `You are Magubrain — the AllMagus living encyclopedia of magic, manifestation, psychology, and esoteric traditions worldwide.

Answer the user's question clearly in modern English. Draw from the corpus snippets provided. Structure:
1. **Direct answer** (2–4 paragraphs max for free search)
2. **Traditions cited** — name sources/traditions
3. **Safety note** — one line if relevant (entertainment/curio; not medical/legal advice)

${MERLIAN_GENERAL_SEPARATION_RULE}

Do NOT perform Practical Kabbalah operations here — direct Kabbalah questions to the Practical Kabbalah panel.`;

export async function* streamMagubrainSearch(query: string, signal?: AbortSignal) {
  const db = getArcanaDb();
  const general = await db.listGeneralEntries();
  const hits = searchArcanaEntries(general, query, 8);
  const corpusBlock = formatEntriesForLlm(hits);

  const userPrompt = `Question:\n"${query}"\n\nRelevant corpus:\n${corpusBlock}\n\nAnswer as Magubrain.`;

  yield* arcanaLlmStream({
    messages: [
      { role: "system", content: MAGUBRAIN_SEARCH_PROMPT },
      { role: "user", content: userPrompt },
    ],
    controllerSignal: signal,
  });
}
