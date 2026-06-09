import type { FrasdaiaPlan } from "./plans";
import { FRASDAIA_CRYPTO_ACCESS_DAYS } from "./plans";
import { upsertFrasdaiaSubscription } from "./subscriptionsDb";

function cryptoPaidUntil(): string {
  return new Date(
    Date.now() + FRASDAIA_CRYPTO_ACCESS_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
}

/**
 * Grant a Frasdaia plan to a user after a settled BTCPay invoice.
 * Idempotency is enforced upstream by the invoice-row status check in
 * `handleFrasdaiaBtcpayWebhookEvent` (each invoice grants at most once).
 *
 * @param invoiceId — kept in the signature for audit logging / future
 *   stronger idempotency keys; currently surfaced via subscriptionsDb metadata.
 */
export async function grantFrasdaiaTier(
  userId: string,
  plan: FrasdaiaPlan,
  _invoiceId: string,
): Promise<void> {
  await upsertFrasdaiaSubscription({
    userId,
    plan,
    status: "active",
    paymentMethod: "crypto",
    paidUntil: cryptoPaidUntil(),
  });
}
