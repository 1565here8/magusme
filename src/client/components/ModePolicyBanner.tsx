import React from "react";
import type { DeploymentConfig } from "../api/apiClient";

export function ModePolicyBanner(props: {
  deployment: DeploymentConfig | null;
  active: "cloud" | "local";
}) {
  const policy = props.deployment?.modePolicies?.find(
    (p) => p.id === props.active,
  );
  if (!policy) return null;

  return (
    <div className="glass-panel border border-white/[0.06] text-sm">
      <div className="label-premium text-[#C9A962]/90">{policy.label}</div>
      <dl className="mt-4 grid gap-2 text-zinc-400 sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Inference</dt>
          <dd className="text-zinc-200">{policy.inference}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Internet</dt>
          <dd className="text-zinc-200">{policy.internet}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Server logs</dt>
          <dd className="text-zinc-200">{policy.serverLogs}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Training / privacy</dt>
          <dd className="text-zinc-200">{policy.training}</dd>
        </div>
      </dl>
    </div>
  );
}
