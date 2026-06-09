import {
  geminiChatComplete,
  geminiChatStream,
  type ChatMessage,
} from "../../dagulai/llm/geminiChat";
import { geminiConfigured, dagulaiGeminiModel } from "../../dagulai/llm/inferenceLanes";
import {
  groqChatComplete,
  groqChatStream,
  groqConfigured,
  dagulaiGroqModel,
} from "../../dagulai/llm/groqChat";
import {
  xaiChatComplete,
  xaiChatStream,
  xaiConfigured,
  dagulaiXaiModel,
} from "../../dagulai/llm/xaiChat";

export type ArcanaCloudProvider = "gemini-cloud" | "groq-cloud" | "xai-cloud";

export function arcanaCloudLlmEnabled(): boolean {
  return process.env.ARCANA_CLOUD_LLM?.trim().toLowerCase() === "true";
}

export function arcanaCloudConfigured(): boolean {
  return geminiConfigured() || groqConfigured() || xaiConfigured();
}

function arcanaCloudPickOrder(): Array<"xai" | "groq" | "gemini"> {
  const prefer = process.env.ARCANA_CLOUD_PREFER?.trim().toLowerCase();
  if (prefer === "grok" || prefer === "xai") return ["xai", "gemini", "groq"];
  if (prefer === "groq") return ["groq", "gemini", "xai"];
  if (prefer === "gemini") return ["gemini", "xai", "groq"];
  return ["gemini", "xai", "groq"];
}

export function resolveArcanaCloudProvider(): ArcanaCloudProvider | null {
  if (!arcanaCloudLlmEnabled() || !arcanaCloudConfigured()) return null;
  for (const pick of arcanaCloudPickOrder()) {
    if (pick === "xai" && xaiConfigured()) return "xai-cloud";
    if (pick === "groq" && groqConfigured()) return "groq-cloud";
    if (pick === "gemini" && geminiConfigured()) return "gemini-cloud";
  }
  return null;
}

export function arcanaCloudModel(provider: ArcanaCloudProvider): string {
  if (provider === "groq-cloud") return dagulaiGroqModel();
  if (provider === "xai-cloud") return dagulaiXaiModel();
  return dagulaiGeminiModel();
}

function toMessages(system: string | undefined, prompt: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  if (system?.trim()) messages.push({ role: "system", content: system.trim() });
  messages.push({ role: "user", content: prompt });
  return messages;
}

async function completeWithProvider(
  provider: ArcanaCloudProvider,
  messages: ChatMessage[],
): Promise<string> {
  if (provider === "groq-cloud") return groqChatComplete(messages);
  if (provider === "xai-cloud") return xaiChatComplete(messages);
  return geminiChatComplete(messages);
}

async function* streamWithProvider(
  provider: ArcanaCloudProvider,
  messages: ChatMessage[],
): AsyncGenerator<string> {
  if (provider === "groq-cloud") {
    yield* groqChatStream(messages);
    return;
  }
  if (provider === "xai-cloud") {
    yield* xaiChatStream(messages);
    return;
  }
  yield* geminiChatStream(messages);
}

export async function arcanaCloudComplete(system: string | undefined, prompt: string): Promise<string> {
  const provider = resolveArcanaCloudProvider();
  if (!provider) {
    throw new Error(
      "Arcana cloud LLM off — set ARCANA_CLOUD_LLM=true and GEMINI_API_KEY, XAI_API_KEY (Grok), and/or GROQ_API_KEY.",
    );
  }
  return completeWithProvider(provider, toMessages(system, prompt));
}

export async function* arcanaCloudStream(
  system: string | undefined,
  prompt: string,
): AsyncGenerator<string> {
  const provider = resolveArcanaCloudProvider();
  if (!provider) {
    throw new Error(
      "Arcana cloud LLM off — set ARCANA_CLOUD_LLM=true and GEMINI_API_KEY, XAI_API_KEY (Grok), and/or GROQ_API_KEY.",
    );
  }
  yield* streamWithProvider(provider, toMessages(system, prompt));
}
