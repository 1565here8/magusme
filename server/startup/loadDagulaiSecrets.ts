/**
 * Load AI API keys from a root-only secrets file (never in git or public .env).
 * Production default: /root/.dagulai-secrets (chmod 600).
 */
import dotenv from "dotenv";
import { existsSync } from "node:fs";

const SECRET_KEYS = [
  "XAI_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "GROQ_API_KEY",
  "DAGULAI_VAULT_MASTER_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

export function dagulaiSecretsPath(): string | null {
  const explicit = process.env.DAGULAI_SECRETS_PATH?.trim();
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") return "/root/.dagulai-secrets";
  return null;
}

export function loadDagulaiSecrets(): boolean {
  const path = dagulaiSecretsPath();
  if (!path || !existsSync(path)) return false;
  dotenv.config({ path, override: true });
  return true;
}

/** Strip API key material from strings before logging or client errors. */
export function redactSecrets(text: string): string {
  let out = text;
  for (const name of SECRET_KEYS) {
    const val = process.env[name]?.trim();
    if (val && val.length > 8) out = out.split(val).join(`[${name}]`);
  }
  out = out.replace(/\b(AIza[A-Za-z0-9_-]{20,})\b/g, "[GEMINI_API_KEY]");
  out = out.replace(/\b(AQ\.[A-Za-z0-9_-]{20,})\b/g, "[API_KEY]");
  out = out.replace(/\b(xai-[A-Za-z0-9_-]{20,})\b/g, "[XAI_API_KEY]");
  out = out.replace(/\b(gsk_[A-Za-z0-9_-]{20,})\b/g, "[GROQ_API_KEY]");
  return out;
}

export function aiSecretsConfigured(): { xai: boolean; gemini: boolean; groq: boolean } {
  return {
    xai: Boolean(process.env.XAI_API_KEY?.trim()),
    gemini: Boolean(process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim()),
    groq: Boolean(process.env.GROQ_API_KEY?.trim()),
  };
}
