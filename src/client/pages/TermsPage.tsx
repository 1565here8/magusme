import React from "react";
import { LegalPage } from "./LegalPage";

const markdown = `
## Session Token Billing

Cloud, Local, and Mesh compute consume **session tokens** stored server-side. Each request debits tokens based on query size. When balance reaches zero, compute routes return HTTP 402.

This build does **not** include Stripe, card processing, or self-service top-ups unless your operator wires \`EXTERNAL_BILLING_URL\` separately.

## Compute Architecture

| Mode | Requirement |
|------|-------------|
| Cloud | \`PRIVATE_CLUSTER_URL\` HTTP upstream |
| Local | \`LOCAL_CORE_URL\` HTTP upstream |
| Mesh | \`MESH_COMPUTE_URL\` HTTP upstream |

There is no GPU fleet orchestration, P2P protocol, or decentralized node discovery in this codebase.

## Operator Setup

Features without configured environment variables show **Operator Setup Required** in the UI instead of disabled placeholder buttons.

## Refunds

Tokens are refunded only when a stream fails with **zero output**.

## Disclaimer

These terms describe the actual behavior of this software. Adapt with legal counsel before production use.
`;

export function TermsPage() {
  return <LegalPage title="Terms of Service" markdown={markdown} path="/terms" description="Terms of service for Merlian. session token billing, usage policies, and disclaimers." />;
}
