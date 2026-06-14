import React, { useEffect, useState } from "react";
import { Building2, Cloud, Lock, Radio, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchInferenceLanes, type InferenceLanesStatus } from "../api/apiClient";
import { allmagusRoutes } from "../allmagusBrand";
import { cx } from "../utils/classnames";

type TierVariant = "cerebelix" | "allmagus";

const tierSets: Record<
  TierVariant,
  Array<{
    id: "cloud" | "corporate" | "decentralized";
    icon: typeof Cloud;
    title: string;
    subtitle: string;
    hint: string;
    routeKey: "cloud" | "corporate" | "decentralized";
    cta: string;
    accent: string;
    dot: string;
  }>
> = {
  cerebelix: [
    {
      id: "cloud",
      icon: Cloud,
      title: "Cloud Intelligence",
      subtitle: "Fast AI, pay-as-you-go",
      hint: "Best for early days: zero GPU VPS, super fast replies.",
      routeKey: "cloud",
      cta: "Use Cloud",
      accent: "from-violet-500/15 to-sky-500/10 border-violet-500/25",
      dot: "bg-violet-400",
    },
    {
      id: "corporate",
      icon: Building2,
      title: "Corporate Private",
      subtitle: "In-house AI on your infrastructure",
      hint: "Your Ollama or private cluster — prompts never leave your org.",
      routeKey: "corporate",
      cta: "Corporate setup",
      accent: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
      dot: "bg-amber-400",
    },
    {
      id: "decentralized",
      icon: Lock,
      title: "Total Privacy",
      subtitle: "On your PC — or mesh when live",
      hint: "Local Ollama on-device. No cloud vendor.",
      routeKey: "decentralized",
      cta: "Go local",
      accent: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
  ],
  allmagus: [
    {
      id: "cloud",
      icon: Cloud,
      title: "Cloud Oracle",
      subtitle: "Gemini Flash — fast, zero VPS",
      hint: "Launch at near-zero fixed cost: small app server + pay-per-chat AI.",
      routeKey: "cloud",
      cta: "Start Cloud",
      accent: "from-violet-500/15 to-sky-500/10 border-violet-500/25",
      dot: "bg-violet-400",
    },
    {
      id: "decentralized",
      icon: Smartphone,
      title: "Private Sanctum",
      subtitle: "AI runs on your device",
      hint: "Premium tier: Ollama runs on your hardware. Prompts never leave.",
      routeKey: "decentralized",
      cta: "Pocket setup",
      accent: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
    {
      id: "corporate",
      icon: Building2,
      title: "Temple License",
      subtitle: "For covens & institutions",
      hint: "Your Ollama cluster on LAN or VPC. Guaranteed private inference.",
      routeKey: "corporate",
      cta: "Enterprise setup",
      accent: "from-amber-500/10 to-orange-500/10 border-amber-500/30",
      dot: "bg-amber-400",
    },
  ],
};

const routeMaps: Record<TierVariant, Record<"cloud" | "corporate" | "decentralized", string>> = {
  cerebelix: {
    cloud: "/cloud",
    corporate: "/corporate",
    decentralized: "/local",
  },
  allmagus: {
    cloud: allmagusRoutes.cloud,
    corporate: allmagusRoutes.corporate,
    decentralized: allmagusRoutes.pocket,
  },
};

export function InferenceTierCards(props: {
  compact?: boolean;
  className?: string;
  variant?: TierVariant;
}) {
  const variant = props.variant ?? "cerebelix";
  const tiers = tierSets[variant];
  const routes = routeMaps[variant];
  const [status, setStatus] = useState<InferenceLanesStatus | null>(null);

  useEffect(() => {
    fetchInferenceLanes().then(setStatus).catch(() => null);
  }, []);

  return (
    <div className={cx("space-y-4", props.className)}>
      {!props.compact ? (
        <div>
          <p className="label-premium">How you run AI</p>
          <h2 className="heading-display mt-1">Pick your lane</h2>
          <p className="body-muted mt-2 max-w-2xl">
            {variant === "allmagus"
              ? "Free to launch on cloud AI. Upgrade to private inference or institutional license when you need it."
              : "Start with cloud AI. Scale to corporate private nodes or full decentralized privacy."}
          </p>
        </div>
      ) : null}

      <div className={cx("grid gap-4", props.compact ? "sm:grid-cols-3" : "md:grid-cols-3")}>
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const ready =
            tier.id === "cloud"
              ? status?.geminiConfigured || status?.cloud?.demoMode
              : tier.id === "corporate"
                ? status?.corporateAvailable
                : true;
          return (
            <Link
              key={tier.id}
              to={routes[tier.routeKey]}
              className={cx(
                "glass-panel group flex flex-col bg-gradient-to-br transition hover:shadow-md",
                tier.accent,
                props.compact && "p-4",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)]">
                  <Icon className="h-5 w-5 text-[color:var(--accent)]" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cx("size-2 rounded-full", tier.dot)} aria-hidden />
                    <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{tier.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{tier.subtitle}</p>
                </div>
              </div>
              {!props.compact ? (
                <p className="body-muted mt-4 flex-1 text-xs leading-relaxed">{tier.hint}</p>
              ) : null}
              <p className="mt-4 flex items-center justify-between text-xs font-medium">
                <span className={ready ? "text-emerald-600 dark:text-emerald-400" : "text-[color:var(--text-tertiary)]"}>
                  {tier.id === "cloud" && status?.geminiConfigured
                    ? "Gemini ready"
                    : tier.id === "cloud" && status?.cloud?.demoMode
                      ? "Demo mode"
                      : tier.id === "corporate" && status?.corporateAvailable
                        ? "Private node ready"
                        : tier.id === "corporate"
                          ? "Configure Ollama URL"
                          : "Available"}
                </span>
                <span className="text-[color:var(--accent-text)] group-hover:underline">{tier.cta} →</span>
              </p>
            </Link>
          );
        })}
      </div>

      {status?.pricing ? (
        <p className="flex flex-wrap items-center gap-2 text-[10px] text-[color:var(--text-tertiary)]">
          <Radio className="h-3 w-3" />
          Cloud from ${status.pricing.cloud.priceFromUsd}/mo
          {status.pricing.pocket ? (
            <> · Private from ${status.pricing.pocket.priceFromUsd}/mo</>
          ) : null}
          {" · Corporate from $"}
          {status.pricing.corporate.priceFromUsd}/mo
          {status.pricing.retainer ? (
            <> · Retainer from ${status.pricing.retainer.priceFromUsd}/mo</>
          ) : null}
          {" · Local free with your hardware"}
        </p>
      ) : null}
    </div>
  );
}
