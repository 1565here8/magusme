/** Frasdaia subscription plans — independent of DagulAI tiers. */

export type FrasdaiaPlan = "frasdaia_basic" | "frasdaia_pro";

export const FRASDAIA_BASIC_PRICE_USD = Number(
  process.env.FRASDAIA_BASIC_PRICE_USD ?? 9,
);

export const FRASDAIA_PRO_PRICE_USD = Number(
  process.env.FRASDAIA_PRO_PRICE_USD ?? 29,
);

export const FRASDAIA_CRYPTO_ACCESS_DAYS = Number(
  process.env.FRASDAIA_CRYPTO_ACCESS_DAYS ?? 30,
);

export function frasdaiaPlanPriceUsd(plan: FrasdaiaPlan): number {
  if (plan === "frasdaia_pro") return FRASDAIA_PRO_PRICE_USD;
  return FRASDAIA_BASIC_PRICE_USD;
}

export function frasdaiaPlansPublic() {
  return {
    basic: {
      plan: "frasdaia_basic" as const,
      priceUsd: FRASDAIA_BASIC_PRICE_USD,
      interval: "month" as const,
      methods: ["crypto"] as const,
      includes: [
        "Frasdaia Basic — privacy briefs",
        "SafeNow extension premium feeds",
      ],
    },
    pro: {
      plan: "frasdaia_pro" as const,
      priceUsd: FRASDAIA_PRO_PRICE_USD,
      interval: "month" as const,
      methods: ["crypto"] as const,
      includes: [
        "Everything in Basic",
        "Pro intel pipeline + priority webhook",
      ],
    },
  };
}
