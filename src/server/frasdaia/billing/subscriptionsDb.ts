import type { SqlDriver } from "../../db/sql/driver";
import type { FrasdaiaPlan } from "./plans";

export type FrasdaiaSubscriptionStatus = "active" | "past_due" | "canceled";

export type FrasdaiaSubscription = {
  userId: string;
  plan: FrasdaiaPlan;
  status: FrasdaiaSubscriptionStatus;
  paymentMethod: "crypto" | null;
  paidUntil: string | null;
  updatedAt: string;
};

let driver: SqlDriver | null = null;

export function initFrasdaiaSubscriptionsDb(db: SqlDriver): void {
  driver = db;
}

function requireDriver(): SqlDriver {
  if (!driver) throw new Error("Frasdaia subscriptions DB not initialized");
  return driver;
}

type Row = {
  user_id: string;
  plan: string;
  status: string;
  payment_method: string | null;
  paid_until: string | null;
  updated_at: string;
};

function mapRow(r: Row): FrasdaiaSubscription {
  return {
    userId: r.user_id,
    plan: r.plan as FrasdaiaPlan,
    status: r.status as FrasdaiaSubscriptionStatus,
    paymentMethod: (r.payment_method as FrasdaiaSubscription["paymentMethod"]) ?? null,
    paidUntil: r.paid_until,
    updatedAt: r.updated_at,
  };
}

export async function getFrasdaiaSubscription(
  userId: string,
): Promise<FrasdaiaSubscription | null> {
  const db = requireDriver();
  const row = await db.get<Row>(
    "SELECT * FROM frasdaia_subscriptions WHERE user_id = ?",
    [userId],
  );
  return row ? mapRow(row) : null;
}

export async function upsertFrasdaiaSubscription(args: {
  userId: string;
  plan: FrasdaiaPlan;
  status: FrasdaiaSubscriptionStatus;
  paymentMethod?: "crypto" | null;
  paidUntil?: string | null;
}): Promise<void> {
  const db = requireDriver();
  const now = new Date().toISOString();
  await db.exec(
    `INSERT INTO frasdaia_subscriptions (user_id, plan, status, payment_method, paid_until, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       plan = excluded.plan,
       status = excluded.status,
       payment_method = COALESCE(excluded.payment_method, frasdaia_subscriptions.payment_method),
       paid_until = COALESCE(excluded.paid_until, frasdaia_subscriptions.paid_until),
       updated_at = excluded.updated_at`,
    [
      args.userId,
      args.plan,
      args.status,
      args.paymentMethod ?? null,
      args.paidUntil ?? null,
      now,
    ],
  );
}
