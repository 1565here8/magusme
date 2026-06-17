import React from "react";
import { LegalPage } from "./LegalPage";

const markdown = `
## Overview

This policy explains how this deployment of Frasdaia-family apps handles information.

## Data Collected

- Session identity (\`x-user-id\` header / local storage UUID)
- Token balance and usage transactions
- Job records (mode, status, timestamps)
- Prompt/response history when needed for session continuity and product operation

## What We Do Not Do

- No payment card storage (no Stripe in default build)
- No ML training on your prompts
- No P2P data replication
- **No selling prompt data** to advertisers or data brokers
- **No cloud AI vendors** for Arcana Oracle when \`ARCANA_REQUIRE_LOCAL_LLM=true\` (default)

## Arcana Oracle (Local AI)

When using the Arcana module:

- Consultations run through **Ollama on your machine** (\`OLLAMA_HOST=http://127.0.0.1:11434\`) by default
- Prompts are **not** sent to OpenAI, Google, Anthropic, or similar unless you explicitly disable local-only mode
- Your conversations are **not** used to train or fine-tune AI models
- Optional \`ARCANA_MINIMAL_LOGGING=true\` reduces what is written to the local database
- Set \`ARCANA_REQUIRE_LOCAL_LLM=false\` only if you knowingly accept remote inference

## Security

Sessions use signed **HttpOnly cookies** (\`nc_session\`) with **CSRF double-submit** (\`nc_csrf\` + \`X-CSRF-Token\` header) on authenticated POST requests. Production requires PostgreSQL via \`DATABASE_URL\`.

## Your Choices

- Use Offline mode for local-first privacy where supported
- Use Online mode when you want cloud convenience
- Review the Security page for a plain-English trust summary and safety stance

## Contact

Contact your deployment operator for data export or deletion.
`;

export function PrivacyPage() {
  return <LegalPage title="Privacy Policy" markdown={markdown} path="/privacy" description="Privacy policy for Merlian. data collection, encryption, retention, and user rights." />;
}
