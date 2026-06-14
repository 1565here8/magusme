import { ALLMAGUS_DOMAIN } from "./allmagusBrand";

export type BrandHost = "allmagus" | null;

export function normalizeHost(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

export function brandFromHost(hostname: string): BrandHost {
  const host = normalizeHost(hostname);
  if (host === ALLMAGUS_DOMAIN) return "allmagus";
  return null;
}

export function currentBrandHost(): BrandHost {
  if (typeof window === "undefined") return null;
  return brandFromHost(window.location.hostname);
}
