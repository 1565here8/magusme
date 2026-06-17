const credentials: RequestInit = { credentials: "include" };

async function jsonGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { ...credentials, signal });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status}).`);
  }
  return (await res.json()) as T;
}

async function jsonPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Request failed (${res.status}).`);
  }
  return (await res.json()) as T;
}

async function jsonPut<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Request failed (${res.status}).`);
  }
  return (await res.json()) as T;
}

// ── Types ──────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  parentId: string | null;
  sortOrder: number;
  count: number;
}

export interface ServiceListingSummary {
  id: string;
  providerId: string;
  providerHandle: string;
  providerDisplayName: string;
  providerKycStatus: string;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  title: string;
  slug: string;
  pricingModel: string;
  priceCents: number;
  durationMinutes: number | null;
  deliveryDays: number | null;
  isOnline: boolean;
  location: string | null;
  tags: string[];
  mediaUrls: string[];
  status: string;
  viewCount: number;
  orderCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  listingId: string;
  name: string;
  description: string;
  priceCents: number;
  deliveryDays: number | null;
  inclusions: string[];
  sortOrder: number;
}

export interface ServiceListingDetail extends ServiceListingSummary {
  description: string;
  providerBio: string;
  providerTraditions: string[];
  packages: ServicePackage[];
}

export interface ServiceOrderSummary {
  id: string;
  listingId: string;
  listingTitle: string;
  listingSlug: string;
  buyerId: string;
  buyerHandle: string | null;
  sellerId: string;
  sellerHandle: string | null;
  packageName: string | null;
  amountCents: number;
  status: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOrderDetail extends ServiceOrderSummary {
  buyerInstructions: string;
  sellerNotes: string;
  deliveryNotes: string;
  confirmedAt: string | null;
  completedAt: string | null;
  listingMediaUrls: string[];
  packageDescription: string | null;
  packageInclusions: string[];
}

export interface ServiceOrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderHandle: string;
  body: string;
  createdAt: string;
}

export interface ServiceReview {
  id: string;
  orderId: string;
  listingId: string;
  reviewerId: string;
  reviewerHandle: string;
  rating: number;
  body: string;
  isPublic: boolean;
  createdAt: string;
}

export interface ServiceProviderProfile {
  userId: string;
  handle: string;
  displayName: string;
  bio: string;
  interests: string[];
  traditions: string[];
  kycStatus: string;
  listingCount: number;
  avgRating: number;
  reviewCount: number;
}

// ── Categories ─────────────────────────────────────────────────────

export function fetchCategories(signal?: AbortSignal): Promise<ServiceCategory[]> {
  return jsonGet<ServiceCategory[]>("/api/marketplace/categories", signal);
}

export function fetchCategoryBySlug(slug: string, signal?: AbortSignal): Promise<ServiceCategory> {
  return jsonGet<ServiceCategory>(`/api/marketplace/categories/${slug}`, signal);
}

// ── Listings ───────────────────────────────────────────────────────

export interface SearchListingsParams {
  query?: string;
  category?: string;
  tradition?: string;
  pricingModel?: string;
  minPrice?: number;
  maxPrice?: number;
  isOnline?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
}

export function searchListings(params?: SearchListingsParams, signal?: AbortSignal): Promise<{ listings: ServiceListingSummary[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.query) search.set("query", params.query);
  if (params?.category) search.set("category", params.category);
  if (params?.tradition) search.set("tradition", params.tradition);
  if (params?.pricingModel) search.set("pricingModel", params.pricingModel);
  if (params?.minPrice !== undefined) search.set("minPrice", String(params.minPrice));
  if (params?.maxPrice !== undefined) search.set("maxPrice", String(params.maxPrice));
  if (params?.isOnline !== undefined) search.set("isOnline", String(params.isOnline));
  if (params?.sort) search.set("sort", params.sort);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  const qs = search.toString();
  return jsonGet(`/api/marketplace/listings${qs ? `?${qs}` : ""}`, signal);
}

export function fetchFeaturedListings(limit?: number, signal?: AbortSignal): Promise<{ listings: ServiceListingSummary[] }> {
  const qs = limit ? `?limit=${limit}` : "";
  return jsonGet(`/api/marketplace/listings/featured${qs}`, signal);
}

export function fetchListingBySlug(slug: string, signal?: AbortSignal): Promise<ServiceListingDetail> {
  return jsonGet<ServiceListingDetail>(`/api/marketplace/listings/${slug}`, signal);
}

export function fetchListingReviews(slug: string, signal?: AbortSignal): Promise<{ reviews: ServiceReview[]; avgRating: number; total: number }> {
  return jsonGet(`/api/marketplace/listings/${slug}/reviews`, signal);
}

// ── Provider (Authenticated) ───────────────────────────────────────

export function fetchMyListings(status?: string, signal?: AbortSignal): Promise<{ listings: ServiceListingSummary[] }> {
  const qs = status ? `?status=${status}` : "";
  return jsonGet(`/api/marketplace/provider/listings${qs}`, signal);
}

export function createListing(data: Record<string, unknown>, signal?: AbortSignal): Promise<{ id: string; slug: string }> {
  return jsonPost("/api/marketplace/listings", data, signal);
}

export function updateListing(id: string, data: Record<string, unknown>, signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/listings/${id}`, data, signal);
}

export function updateListingStatus(id: string, status: string, signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/listings/${id}/status`, { status }, signal);
}

export function updateListingPackages(id: string, packages: Array<{
  name: string; description?: string; priceCents: number;
  deliveryDays?: number; inclusions?: string[]; sortOrder?: number;
}>, signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/listings/${id}/packages`, { packages }, signal);
}

// ── Orders ─────────────────────────────────────────────────────────

export function placeOrder(slug: string, data: {
  packageId?: string;
  customAmountCents?: number;
  buyerInstructions?: string;
}, signal?: AbortSignal): Promise<{ id: string }> {
  return jsonPost(`/api/marketplace/listings/${slug}/order`, data, signal);
}

export function fetchMyOrders(status?: string, signal?: AbortSignal): Promise<{ orders: ServiceOrderSummary[] }> {
  const qs = status ? `?status=${status}` : "";
  return jsonGet(`/api/marketplace/orders${qs}`, signal);
}

export function fetchIncomingOrders(status?: string, signal?: AbortSignal): Promise<{ orders: ServiceOrderSummary[] }> {
  const qs = status ? `?status=${status}` : "";
  return jsonGet(`/api/marketplace/orders/incoming${qs}`, signal);
}

export function fetchOrder(id: string, signal?: AbortSignal): Promise<ServiceOrderDetail> {
  return jsonGet<ServiceOrderDetail>(`/api/marketplace/orders/${id}`, signal);
}

export function cancelOrder(id: string, signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/orders/${id}/cancel`, {}, signal);
}

export function updateOrderStatus(id: string, status: string, data?: {
  sellerNotes?: string;
  deliveryNotes?: string;
}, signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/orders/${id}/status`, { status, ...data }, signal);
}

export function updateOrderNotes(id: string, data: {
  sellerNotes?: string;
  deliveryNotes?: string;
}, signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/orders/${id}/notes`, data, signal);
}

// ── Order Messages ────────────────────────────────────────────────

export function fetchOrderMessages(id: string, signal?: AbortSignal): Promise<{ messages: ServiceOrderMessage[] }> {
  return jsonGet(`/api/marketplace/orders/${id}/messages`, signal);
}

export function sendOrderMessage(id: string, body: string, signal?: AbortSignal): Promise<ServiceOrderMessage> {
  return jsonPost<ServiceOrderMessage>(`/api/marketplace/orders/${id}/message`, { body }, signal);
}

// ── Reviews ────────────────────────────────────────────────────────

export function submitReview(id: string, data: {
  rating: number;
  body: string;
  isPublic?: boolean;
}, signal?: AbortSignal): Promise<ServiceReview> {
  return jsonPost<ServiceReview>(`/api/marketplace/orders/${id}/review`, data, signal);
}

// ── Providers ──────────────────────────────────────────────────────

export function searchProviders(query?: string, limit?: number, signal?: AbortSignal): Promise<{ providers: ServiceProviderProfile[] }> {
  const search = new URLSearchParams();
  if (query) search.set("query", query);
  if (limit) search.set("limit", String(limit));
  const qs = search.toString();
  return jsonGet(`/api/marketplace/providers${qs ? `?${qs}` : ""}`, signal);
}

export function fetchProviderByHandle(handle: string, signal?: AbortSignal): Promise<{
  profile: ServiceProviderProfile;
  listings: ServiceListingSummary[];
}> {
  return jsonGet(`/api/marketplace/providers/${handle}`, signal);
}

// ── KYC Status ─────────────────────────────────────────────────────

export function fetchKycStatus(signal?: AbortSignal): Promise<{
  kycStatus: string;
  kycProvider?: string;
  isServiceProvider: boolean;
}> {
  return jsonGet("/api/marketplace/kyc/status", signal);
}

// ── Admin Marketplace ──────────────────────────────────────────────

export function fetchAdminProviders(signal?: AbortSignal): Promise<{ providers: ServiceProviderProfile[] }> {
  return jsonGet("/api/admin/marketplace/providers", signal);
}

export function fetchAdminDisputes(signal?: AbortSignal): Promise<{ disputes: ServiceOrderSummary[] }> {
  return jsonGet("/api/admin/marketplace/disputes", signal);
}

export function resolveDispute(id: string, resolution: "completed" | "refunded", signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/admin/marketplace/disputes/${id}/resolve`, { resolution }, signal);
}

export function updateKycStatus(userId: string, status: "verified" | "rejected" | "none", signal?: AbortSignal): Promise<{ ok: boolean }> {
  return jsonPut(`/api/admin/marketplace/kyc/${userId}`, { status }, signal);
}

// ── Divination Provider Recommendations ──────────────────────────

export function fetchDivinationProviders(q: string, limit?: number, signal?: AbortSignal): Promise<{ providers: ServiceProviderProfile[] }> {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (limit) search.set("limit", String(limit));
  return jsonGet(`/api/marketplace/divination-providers?${search.toString()}`, signal);
}

// ── Notifications ────────────────────────────────────────────────

export interface MarketplaceNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export function fetchNotifications(signal?: AbortSignal): Promise<{ notifications: MarketplaceNotification[]; unread: number }> {
  return jsonGet("/api/marketplace/notifications", signal);
}

export function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  return jsonPut(`/api/marketplace/notifications/${id}/read`, {});
}

export function markAllNotificationsRead(): Promise<{ ok: boolean }> {
  return jsonPut("/api/marketplace/notifications/read-all", {});
}
