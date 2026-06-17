const credentials: RequestInit = { credentials: "include" };

async function jsonGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { ...credentials, signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status}).`);
  }
  return (await res.json()) as T;
}

export interface SpellListItem {
  id: string;
  title: string;
  slug: string;
  tradition: string | null;
  category: string;
  rating: number;
  review_count: number;
  difficulty: string;
  danger: string;
  element: string | null;
  timing: string | null;
  counter_spell: string | null;
  warning: string | null;
  source: string | null;
  tags: string[];
  summary: string | null;
  reference_link: string | null;
  verified: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_source: string | null;
}

export interface SpellRow {
  id: string;
  title: string;
  slug: string;
  tradition_id: string | null;
  source_id: string | null;
  category_id: string | null;
  rating: number;
  review_count: number;
  difficulty: string | null;
  difficulty_level: number;
  danger: string | null;
  danger_level: number;
  element: string | null;
  timing: string | null;
  counter_spell: string | null;
  warning: string | null;
  summary: string | null;
  tags: string | null;
  full_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpellCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  count: number;
}

export interface SpellTradition {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface SpellSearchResponse {
  spells: SpellListItem[];
  total: number;
}

export function fetchSpells(params?: {
  query?: string;
  category?: string;
  tradition?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}, signal?: AbortSignal): Promise<SpellSearchResponse> {
  const search = new URLSearchParams();
  if (params?.query) search.set("query", params.query);
  if (params?.category) search.set("category", params.category);
  if (params?.tradition) search.set("tradition", params.tradition);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  const qs = search.toString();
  return jsonGet<SpellSearchResponse>(`/api/spells${qs ? `?${qs}` : ""}`, signal);
}

export function fetchSpellCategories(signal?: AbortSignal): Promise<SpellCategory[]> {
  return jsonGet<SpellCategory[]>("/api/spells/categories", signal);
}

export function fetchSpellTraditions(signal?: AbortSignal): Promise<SpellTradition[]> {
  return jsonGet<SpellTradition[]>("/api/spells/traditions", signal);
}

export interface SpellDetail extends SpellListItem {
  difficulty_level: number;
  danger_level: number;
  full_text: string | null;
  verified: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_source: string | null;
  verified_by: string | null;
  verified_at: string | null;
}

export function fetchSpellBySlug(slug: string, signal?: AbortSignal): Promise<SpellDetail> {
  return jsonGet<SpellDetail>(`/api/spells/${slug}`, signal);
}

export function fetchSpellsWithReferences(limit?: number, offset?: number, signal?: AbortSignal): Promise<SpellSearchResponse> {
  const search = new URLSearchParams();
  if (limit) search.set("limit", String(limit));
  if (offset) search.set("offset", String(offset));
  const qs = search.toString();
  return jsonGet<SpellSearchResponse>(`/api/spells/references${qs ? `?${qs}` : ""}`, signal);
}

export interface SpellReview {
  id: string;
  spell_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
  user_created_at: string;
}

export function fetchSpellReviews(slug: string, signal?: AbortSignal): Promise<{ reviews: SpellReview[]; total: number }> {
  return jsonGet(`/api/spells/${slug}/reviews`, signal);
}

export async function submitSpellReview(slug: string, rating: number, body: string, signal?: AbortSignal): Promise<SpellReview> {
  const res = await fetch(`/api/spells/${slug}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, body }),
    signal,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Failed to submit review (${res.status}).`);
  }
  return res.json();
}

export function fetchRandomSpell(params?: {
  element?: string;
  category?: string;
}, signal?: AbortSignal): Promise<SpellListItem> {
  const search = new URLSearchParams();
  if (params?.element) search.set("element", params.element);
  if (params?.category) search.set("category", params.category);
  const qs = search.toString();
  return jsonGet<SpellListItem>(`/api/spells/random${qs ? `?${qs}` : ""}`, signal);
}
