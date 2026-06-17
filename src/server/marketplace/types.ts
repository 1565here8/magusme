export type ServiceListingId = string & { __brand: "ServiceListingId" };
export type ServiceOrderId = string & { __brand: "ServiceOrderId" };
export type ServiceCategoryId = string & { __brand: "ServiceCategoryId" };
export type ServicePackageId = string & { __brand: "ServicePackageId" };

export type PricingModel = "fixed" | "hourly" | "package" | "contact";
export type ListingStatus = "draft" | "active" | "paused" | "archived";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed"
  | "refunded";

export interface ServiceCategory {
  id: ServiceCategoryId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  parentId: ServiceCategoryId | null;
  sortOrder: number;
  count: number;
}

export interface ServiceCategoryRow {
  id: ServiceCategoryId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface ServiceListingRow {
  id: ServiceListingId;
  provider_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string;
  pricing_model: string;
  price_cents: number;
  duration_minutes: number | null;
  delivery_days: number | null;
  is_online: number;
  location: string | null;
  tags: string;
  media_urls: string;
  status: string;
  view_count: number;
  order_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceListingSummary {
  id: ServiceListingId;
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

export interface ServiceListingDetail extends ServiceListingSummary {
  description: string;
  providerBio: string;
  providerTraditions: string[];
  packages: ServicePackage[];
}

export interface ServicePackage {
  id: ServicePackageId;
  listingId: ServiceListingId;
  name: string;
  description: string;
  priceCents: number;
  deliveryDays: number | null;
  inclusions: string[];
  sortOrder: number;
}

export interface ServicePackageRow {
  id: ServicePackageId;
  listing_id: string;
  name: string;
  description: string;
  price_cents: number;
  delivery_days: number | null;
  inclusions: string;
  sort_order: number;
  created_at: string;
}

export interface ServiceOrderRow {
  id: ServiceOrderId;
  listing_id: string;
  buyer_id: string;
  package_id: string | null;
  custom_amount_cents: number | null;
  status: string;
  buyer_instructions: string;
  seller_notes: string;
  delivery_notes: string;
  created_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
}

export interface ServiceOrderSummary {
  id: ServiceOrderId;
  listingId: ServiceListingId;
  listingTitle: string;
  listingSlug: string;
  buyerId: string;
  buyerHandle: string | null;
  sellerId: string;
  sellerHandle: string | null;
  packageName: string | null;
  amountCents: number;
  status: OrderStatus;
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
  orderId: ServiceOrderId;
  senderId: string;
  senderHandle: string;
  body: string;
  createdAt: string;
}

export interface ServiceOrderMessageRow {
  id: string;
  order_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface ServiceReview {
  id: string;
  orderId: ServiceOrderId;
  listingId: ServiceListingId;
  reviewerId: string;
  reviewerHandle: string;
  rating: number;
  body: string;
  isPublic: boolean;
  createdAt: string;
}

export interface ServiceReviewRow {
  id: string;
  order_id: string;
  listing_id: string;
  reviewer_id: string;
  rating: number;
  body: string;
  is_public: number;
  created_at: string;
}

export interface ServiceSearchParams {
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

export interface ServiceProviderSummary {
  userId: string;
  handle: string;
  displayName: string;
  bio: string;
  traditions: string[];
  kycStatus: string;
  listingCount: number;
  avgRating: number;
  reviewCount: number;
}

export interface CreateListingInput {
  title: string;
  categoryId?: string;
  description?: string;
  pricingModel: PricingModel;
  priceCents?: number;
  durationMinutes?: number;
  deliveryDays?: number;
  isOnline?: boolean;
  location?: string;
  tags?: string[];
  mediaUrls?: string[];
  packages?: CreatePackageInput[];
}

export interface CreatePackageInput {
  name: string;
  description?: string;
  priceCents: number;
  deliveryDays?: number;
  inclusions?: string[];
  sortOrder?: number;
}

export interface CreateOrderInput {
  packageId?: string;
  customAmountCents?: number;
  buyerInstructions?: string;
}

export interface CreateReviewInput {
  rating: number;
  body: string;
  isPublic?: boolean;
}
