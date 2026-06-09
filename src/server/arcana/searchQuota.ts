import { getArcanaDb } from "./arcanaDb";
import type { ID } from "../db/models";

export function arcanaFreeSearchesPerDay(): number {
  const raw = Number(process.env.ARCANA_FREE_SEARCHES_PER_DAY ?? 5);
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 5;
}

export function arcanaSearchPriceCents(): number {
  const raw = Number(process.env.ARCANA_SEARCH_PRICE_CENTS ?? 100);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 100;
}

export function arcanaMonthlySearchLimit(): number {
  const raw = Number(process.env.ARCANA_MONTHLY_SEARCH_LIMIT ?? 100);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 100;
}

export function arcanaMonthlyPriceCents(): number {
  const raw = Number(process.env.ARCANA_MONTHLY_PRICE_CENTS ?? 900);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 900;
}

function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function dailyMetaKey(userId: ID) {
  return `search_daily:${userId}:${dayKey()}`;
}

function monthlyMetaKey(userId: ID) {
  return `search_monthly:${userId}`;
}

function singleCreditMetaKey(userId: ID) {
  return `search_single_credit:${userId}`;
}

export async function getSingleSearchCredits(userId: ID): Promise<number> {
  const db = getArcanaDb();
  const raw = await db.getMeta(singleCreditMetaKey(userId));
  return raw ? Math.max(0, Number(raw) || 0) : 0;
}

export async function grantSingleSearchCredit(userId: ID, count = 1): Promise<void> {
  const db = getArcanaDb();
  const current = await getSingleSearchCredits(userId);
  await db.setMeta(singleCreditMetaKey(userId), String(current + count));
}

type MonthlyPack = { remaining: number; expiresAt: string };

export type SearchQuotaStatus = {
  freePerDay: number;
  freeUsedToday: number;
  freeRemaining: number;
  monthlyActive: boolean;
  monthlyRemaining: number;
  monthlyLimit: number;
  monthlyExpiresAt: string | null;
  payPerSearchCents: number;
  monthlyPriceCents: number;
  singleCreditsRemaining: number;
  requiresPayment: boolean;
};

export async function getSearchQuotaStatus(userId: ID): Promise<SearchQuotaStatus> {
  const db = getArcanaDb();
  const freePerDay = arcanaFreeSearchesPerDay();
  const dailyRaw = await db.getMeta(dailyMetaKey(userId));
  const freeUsedToday = dailyRaw ? Number(dailyRaw) || 0 : 0;
  const monthlyRaw = await db.getMeta(monthlyMetaKey(userId));
  let monthly: MonthlyPack | null = null;
  if (monthlyRaw) {
    try {
      monthly = JSON.parse(monthlyRaw) as MonthlyPack;
    } catch {
      monthly = null;
    }
  }
  const now = Date.now();
  const monthlyActive = Boolean(monthly && new Date(monthly.expiresAt).getTime() > now);
  const monthlyRemaining = monthlyActive ? Math.max(0, monthly!.remaining) : 0;
  const freeRemaining = Math.max(0, freePerDay - freeUsedToday);
  const singleCreditsRemaining = await getSingleSearchCredits(userId);
  const requiresPayment =
    freeRemaining <= 0 &&
    (!monthlyActive || monthlyRemaining <= 0) &&
    singleCreditsRemaining <= 0;

  return {
    freePerDay,
    freeUsedToday,
    freeRemaining,
    monthlyActive,
    monthlyRemaining,
    monthlyLimit: arcanaMonthlySearchLimit(),
    monthlyExpiresAt: monthlyActive ? monthly!.expiresAt : null,
    payPerSearchCents: arcanaSearchPriceCents(),
    monthlyPriceCents: arcanaMonthlyPriceCents(),
    singleCreditsRemaining,
    requiresPayment,
  };
}

export async function consumeSearchQuota(userId: ID, opts?: { paidSingle?: boolean }): Promise<SearchQuotaStatus> {
  const status = await getSearchQuotaStatus(userId);
  if (status.requiresPayment && !opts?.paidSingle) {
    const err = new Error("SEARCH_PAYMENT_REQUIRED") as Error & { status: SearchQuotaStatus };
    err.status = status;
    throw err;
  }

  const db = getArcanaDb();
  if (status.freeRemaining > 0) {
    await db.setMeta(dailyMetaKey(userId), String(status.freeUsedToday + 1));
  } else if (status.monthlyActive && status.monthlyRemaining > 0) {
    const monthlyRaw = await db.getMeta(monthlyMetaKey(userId));
    const monthly = JSON.parse(monthlyRaw!) as MonthlyPack;
    monthly.remaining = Math.max(0, monthly.remaining - 1);
    await db.setMeta(monthlyMetaKey(userId), JSON.stringify(monthly));
  } else if (status.singleCreditsRemaining > 0) {
    await db.setMeta(
      singleCreditMetaKey(userId),
      String(Math.max(0, status.singleCreditsRemaining - 1)),
    );
  } else if (opts?.paidSingle) {
    // dev unlock — allow one search without BTCPay credit
  }

  return getSearchQuotaStatus(userId);
}

export async function grantMonthlySearchPack(userId: ID): Promise<SearchQuotaStatus> {
  const db = getArcanaDb();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  const pack: MonthlyPack = {
    remaining: arcanaMonthlySearchLimit(),
    expiresAt: expires.toISOString(),
  };
  await db.setMeta(monthlyMetaKey(userId), JSON.stringify(pack));
  return getSearchQuotaStatus(userId);
}

export function formatSearchCents(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}
