export function arcanaSpellPriceCents() {
  const raw = Number(process.env.ARCANA_SPELL_PRICE_CENTS ?? 500);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 500;
}

export function arcanaSourcePriceCents() {
  const raw = Number(process.env.ARCANA_SOURCE_PRICE_CENTS ?? 200);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 200;
}

export function arcanaPlanPriceCents() {
  const raw = Number(process.env.ARCANA_PLAN_PRICE_CENTS ?? 20000);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 20000;
}

export function arcanaDevUnlockEnabled() {
  return process.env.ARCANA_DEV_UNLOCK === "true" || process.env.NODE_ENV !== "production";
}
