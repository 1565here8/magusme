import { arcanaLlmComplete } from "../arcana/privacy";

export type ModerationVerdict = {
  allowed: boolean;
  reason?: string;
  severity?: "warn" | "ban";
};

const AGGRESSIVE_PATTERNS = [
  /\bf+u+c+k+\b/i,
  /\bsh+i+t+\b/i,
  /\bb+i+t+c+h+\b/i,
  /\bn+i+g+g+/i,
  /\bfagg?ot\b/i,
  /\bkill\s+your?self\b/i,
  /\bdie\b.*\b(hate|stupid|idiot)\b/i,
  /\bi\s+will\s+(kill|hurt|destroy)\s+you\b/i,
  /\bstupid\s+(whore|bitch|fuck)\b/i,
];

function keywordScan(text: string): ModerationVerdict | null {
  const t = text.trim();
  for (const pat of AGGRESSIVE_PATTERNS) {
    if (pat.test(t)) {
      return {
        allowed: false,
        reason: "Aggressive or hateful language detected.",
        severity: "ban",
      };
    }
  }
  return null;
}

async function llmModerate(text: string): Promise<ModerationVerdict | null> {
  if (process.env.SOCIAL_LLM_MODERATION === "false") return null;
  if (process.env.ARCANA_ENABLED?.trim().toLowerCase() !== "true") return null;

  try {
    const raw = await arcanaLlmComplete({
      messages: [
        {
          role: "system",
          content: `You are a community safety moderator for a spiritual self-growth social network.
Reply with ONLY valid JSON: {"allowed":true} OR {"allowed":false,"reason":"brief reason","severity":"ban"}
Ban (severity ban) for: slurs, threats, harassment, hate speech, sexual aggression, doxxing wishes.
Allow: passionate debate, witchy language, mild profanity in context, cultural spiritual terms.`,
        },
        { role: "user", content: `Moderate this message:\n"""${text.slice(0, 2000)}"""` },
      ],
    });
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { allowed?: boolean; reason?: string; severity?: string };
    if (parsed.allowed === true) return { allowed: true };
    if (parsed.allowed === false) {
      return {
        allowed: false,
        reason: parsed.reason ?? "Community guidelines violation.",
        severity: parsed.severity === "ban" ? "ban" : "ban",
      };
    }
  } catch {
    // fall through to keyword-only
  }
  return null;
}

export async function moderateSocialContent(text: string): Promise<ModerationVerdict> {
  if (!text.trim()) return { allowed: false, reason: "Empty content." };
  const kw = keywordScan(text);
  if (kw) return kw;
  const llm = await llmModerate(text);
  if (llm) return llm;
  return { allowed: true };
}
