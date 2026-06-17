import type { Express } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { requireServiceProvider } from "../middleware/provider";
import { getMarketplaceDb } from "../../src/server/marketplace/marketplaceDb";
import { getSocialDb } from "../../src/server/social/socialDb";
import { getDb } from "../../src/server/db";
import {
  getPayoutAccount,
  upsertPayoutAccount,
  validatePayoutInput,
  createMarketplaceInvoice,
  getInvoiceByOrder,
  getMarketplaceInvoice,
  payramConfigured,
  processEscrowReleases,
} from "../../src/server/marketplace/marketplacePayments";
import {
  createNotification,
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../src/server/marketplace/marketplaceNotifications";
import type {
  ServiceListingId,
  ServiceOrderId,
  PricingModel,
  ListingStatus,
  OrderStatus,
} from "../../src/server/marketplace/types";

function parseIntParam(val: unknown, fallback: number): number {
  const n = typeof val === "string" ? parseInt(val) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function parseStr(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function parseBool(val: unknown): boolean | undefined {
  if (val === "true" || val === "1") return true;
  if (val === "false" || val === "0") return false;
  return undefined;
}

function parseNum(val: unknown): number | undefined {
  const n = typeof val === "string" ? parseFloat(val) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

const VALID_PRICING_MODELS: PricingModel[] = ["fixed", "hourly", "package", "contact"];
const VALID_LISTING_STATUSES: ListingStatus[] = ["draft", "active", "paused", "archived"];
const VALID_ORDER_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "in_progress", "completed", "cancelled", "disputed", "refunded",
];

export function registerMarketplaceRoutes(app: Express) {

  // ── Categories ────────────────────────────────────────────────────

  app.get(
    "/api/marketplace/categories",
    asyncHandler(async (_req, res) => {
      const categories = await getMarketplaceDb().getCategories();
      res.json(categories);
    }),
  );

  app.get(
    "/api/marketplace/categories/:slug",
    asyncHandler(async (req, res) => {
      const category = await getMarketplaceDb().getCategoryBySlug(req.params.slug);
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.json(category);
    }),
  );

  // ── Browse Listings ──────────────────────────────────────────────

  app.get(
    "/api/marketplace/listings",
    asyncHandler(async (req, res) => {
      const result = await getMarketplaceDb().searchListings({
        query: parseStr(req.query.query),
        category: parseStr(req.query.category),
        tradition: parseStr(req.query.tradition),
        pricingModel: parseStr(req.query.pricingModel),
        minPrice: parseNum(req.query.minPrice),
        maxPrice: parseNum(req.query.maxPrice),
        isOnline: parseBool(req.query.isOnline),
        sort: parseStr(req.query.sort),
        limit: parseIntParam(req.query.limit, 20),
        offset: parseIntParam(req.query.offset, 0),
      });
      res.json(result);
    }),
  );

  app.get(
    "/api/marketplace/listings/featured",
    asyncHandler(async (req, res) => {
      const limit = Math.min(parseIntParam(req.query.limit, 6), 20);
      const listings = await getMarketplaceDb().getFeaturedListings(limit);
      res.json({ listings });
    }),
  );

  app.get(
    "/api/marketplace/listings/:slug",
    asyncHandler(async (req, res) => {
      const listing = await getMarketplaceDb().getListingBySlug(req.params.slug);
      if (!listing) {
        res.status(404).json({ error: "Listing not found" });
        return;
      }
      await getMarketplaceDb().incrementViewCount(listing.id);
      res.json(listing);
    }),
  );

  app.get(
    "/api/marketplace/listings/:slug/reviews",
    asyncHandler(async (req, res) => {
      const listing = await getMarketplaceDb().getListingBySlug(req.params.slug);
      if (!listing) {
        res.status(404).json({ error: "Listing not found" });
        return;
      }
      const reviews = await getMarketplaceDb().getListingReviews(listing.id);
      res.json(reviews);
    }),
  );

  // ── Provider Listings ───────────────────────────────────────────

  app.get(
    "/api/marketplace/provider/listings",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const status = parseStr(req.query.status) as ListingStatus | undefined;
      if (status && !VALID_LISTING_STATUSES.includes(status)) {
        res.status(400).json({ error: `Invalid status. Valid: ${VALID_LISTING_STATUSES.join(", ")}` });
        return;
      }
      const listings = await getMarketplaceDb().getProviderListings(req.session!.sub, status);
      res.json({ listings });
    }),
  );

  // ── Create / Update Listings ─────────────────────────────────────

  app.post(
    "/api/marketplace/listings",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const body = req.body as Record<string, unknown>;
      const errors: string[] = [];

      if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3) {
        errors.push("Title is required (min 3 characters).");
      }
      if (body.pricingModel && !VALID_PRICING_MODELS.includes(body.pricingModel as PricingModel)) {
        errors.push(`Invalid pricing model. Valid: ${VALID_PRICING_MODELS.join(", ")}`);
      }
      if (body.packages && !Array.isArray(body.packages)) {
        errors.push("Packages must be an array.");
      }
      if (errors.length > 0) {
        res.status(400).json({ error: errors.join(" ") });
        return;
      }

      const id = await getMarketplaceDb().createListing(req.session!.sub, {
        title: body.title as string,
        categoryId: parseStr(body.categoryId),
        description: parseStr(body.description) ?? "",
        pricingModel: (body.pricingModel as PricingModel) ?? "fixed",
        priceCents: typeof body.priceCents === "number" ? body.priceCents : 0,
        durationMinutes: typeof body.durationMinutes === "number" ? body.durationMinutes : undefined,
        deliveryDays: typeof body.deliveryDays === "number" ? body.deliveryDays : undefined,
        isOnline: body.isOnline !== false,
        location: parseStr(body.location),
        tags: Array.isArray(body.tags) ? body.tags as string[] : [],
        mediaUrls: Array.isArray(body.mediaUrls) ? body.mediaUrls as string[] : [],
        packages: Array.isArray(body.packages) ? body.packages as Array<{
          name: string; description?: string; priceCents: number;
          deliveryDays?: number; inclusions?: string[]; sortOrder?: number;
        }> : undefined,
      });

      res.status(201).json({ id, slug: id });
    }),
  );

  app.put(
    "/api/marketplace/listings/:id",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceListingId;
      const body = req.body as Record<string, unknown>;
      const db = getMarketplaceDb();

      if (body.pricingModel && !VALID_PRICING_MODELS.includes(body.pricingModel as PricingModel)) {
        res.status(400).json({ error: `Invalid pricing model. Valid: ${VALID_PRICING_MODELS.join(", ")}` });
        return;
      }

      await db.updateListing(id, req.session!.sub, {
        title: parseStr(body.title),
        categoryId: parseStr(body.categoryId),
        description: parseStr(body.description),
        pricingModel: body.pricingModel as PricingModel | undefined,
        priceCents: typeof body.priceCents === "number" ? body.priceCents : undefined,
        durationMinutes: typeof body.durationMinutes === "number" ? body.durationMinutes : undefined,
        deliveryDays: typeof body.deliveryDays === "number" ? body.deliveryDays : undefined,
        isOnline: typeof body.isOnline === "boolean" ? body.isOnline : undefined,
        location: parseStr(body.location),
        tags: Array.isArray(body.tags) ? body.tags as string[] : undefined,
        mediaUrls: Array.isArray(body.mediaUrls) ? body.mediaUrls as string[] : undefined,
        packages: Array.isArray(body.packages) ? body.packages as Array<{
          name: string; description?: string; priceCents: number;
          deliveryDays?: number; inclusions?: string[]; sortOrder?: number;
        }> : undefined,
      });

      res.json({ ok: true });
    }),
  );

  app.put(
    "/api/marketplace/listings/:id/status",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceListingId;
      const { status } = req.body as { status?: string };
      if (!status || !VALID_LISTING_STATUSES.includes(status as ListingStatus)) {
        res.status(400).json({ error: `Invalid status. Valid: ${VALID_LISTING_STATUSES.join(", ")}` });
        return;
      }
      await getMarketplaceDb().updateListingStatus(id, req.session!.sub, status as ListingStatus);
      res.json({ ok: true });
    }),
  );

  app.put(
    "/api/marketplace/listings/:id/packages",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceListingId;
      const { packages } = req.body as { packages?: Array<{
        name: string; description?: string; priceCents: number;
        deliveryDays?: number; inclusions?: string[]; sortOrder?: number;
      }> };
      if (!Array.isArray(packages) || packages.length === 0) {
        res.status(400).json({ error: "Packages array is required." });
        return;
      }
      for (const pkg of packages) {
        if (!pkg.name || pkg.priceCents === undefined || pkg.priceCents < 0) {
          res.status(400).json({ error: "Each package requires a name and price_cents." });
          return;
        }
      }
      await getMarketplaceDb().setPackages(id, packages);
      res.json({ ok: true });
    }),
  );

  // ── Place Orders ────────────────────────────────────────────────

  app.post(
    "/api/marketplace/listings/:slug/order",
    requireAuth,
    asyncHandler(async (req, res) => {
      const listing = await getMarketplaceDb().getListingBySlug(req.params.slug);
      if (!listing) {
        res.status(404).json({ error: "Listing not found." });
        return;
      }
      if (listing.providerId === req.session!.sub) {
        res.status(400).json({ error: "Cannot order your own service." });
        return;
      }

      const body = req.body as Record<string, unknown>;
      if (body.packageId && body.customAmountCents) {
        res.status(400).json({ error: "Provide either packageId OR customAmountCents, not both." });
        return;
      }

      const orderId = await getMarketplaceDb().createOrder(req.session!.sub, listing.id, {
        packageId: parseStr(body.packageId),
        customAmountCents: typeof body.customAmountCents === "number" ? body.customAmountCents : undefined,
        buyerInstructions: parseStr(body.buyerInstructions) ?? "",
      });

      // Notify seller of new order
      await createNotification(getDb().getDriver(), listing.providerId, "new_order", "New Order Received", `New booking for "${listing.title}"`, `/marketplace/orders/${orderId}`);

      res.status(201).json({ id: orderId });
    }),
  );

  // ── My Orders (Buyer) ───────────────────────────────────────────

  app.get(
    "/api/marketplace/orders",
    requireAuth,
    asyncHandler(async (req, res) => {
      const status = parseStr(req.query.status) as OrderStatus | undefined;
      if (status && !VALID_ORDER_STATUSES.includes(status)) {
        res.status(400).json({ error: `Invalid status filter. Valid: ${VALID_ORDER_STATUSES.join(", ")}` });
        return;
      }
      const orders = await getMarketplaceDb().getBuyerOrders(req.session!.sub, status);
      res.json({ orders });
    }),
  );

  // ── Incoming Orders (Seller) ────────────────────────────────────

  app.get(
    "/api/marketplace/orders/incoming",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const status = parseStr(req.query.status) as OrderStatus | undefined;
      if (status && !VALID_ORDER_STATUSES.includes(status)) {
        res.status(400).json({ error: `Invalid status filter. Valid: ${VALID_ORDER_STATUSES.join(", ")}` });
        return;
      }
      const orders = await getMarketplaceDb().getSellerOrders(req.session!.sub, status);
      res.json({ orders });
    }),
  );

  // ── Order Detail ────────────────────────────────────────────────

  app.get(
    "/api/marketplace/orders/:id",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      res.json(order);
    }),
  );

  // ── Update Order Status (Seller) ────────────────────────────────

  app.put(
    "/api/marketplace/orders/:id/status",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const { status, sellerNotes, deliveryNotes } = req.body as {
        status?: string; sellerNotes?: string; deliveryNotes?: string;
      };

      if (!status || !VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
        res.status(400).json({ error: `Invalid status. Valid: ${VALID_ORDER_STATUSES.join(", ")}` });
        return;
      }

      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      if (order.sellerId !== req.session!.sub) {
        res.status(403).json({ error: "Only the seller can update order status." });
        return;
      }

      const transitionAllowed = ((current: string, next: string) => {
        const transitions: Record<string, string[]> = {
          pending: ["confirmed", "cancelled"],
          confirmed: ["in_progress", "cancelled"],
          in_progress: ["completed", "cancelled"],
          completed: [],
          cancelled: [],
          disputed: ["refunded", "completed"],
          refunded: [],
        };
        return transitions[current]?.includes(next) ?? false;
      })(order.status, status);

      if (!transitionAllowed) {
        res.status(400).json({
          error: `Cannot transition from '${order.status}' to '${status}'.`,
          allowedTransitions: (() => {
            const t: Record<string, string[]> = {
              pending: ["confirmed", "cancelled"],
              confirmed: ["in_progress", "cancelled"],
              in_progress: ["completed", "cancelled"],
              completed: [],
              cancelled: [],
              disputed: ["refunded", "completed"],
              refunded: [],
            };
            return t[order.status] ?? [];
          })(),
        });
        return;
      }

      await getMarketplaceDb().updateOrderStatus(id, req.session!.sub, status as OrderStatus, {
        sellerNotes,
        deliveryNotes,
      });

      // Notify buyer of status change
      const statusLabels: Record<string, string> = { confirmed: "Confirmed", in_progress: "In Progress", completed: "Completed", cancelled: "Cancelled" };
      await createNotification(getDb().getDriver(), order.buyerId, "order_status", `Order ${statusLabels[status] ?? status}`, `"${order.listingTitle}" is now ${statusLabels[status] ?? status}`, `/marketplace/orders/${id}`);

      res.json({ ok: true });
    }),
  );

  // ── Cancel Order (Buyer) ────────────────────────────────────────

  app.put(
    "/api/marketplace/orders/:id/cancel",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      if (order.buyerId !== req.session!.sub) {
        res.status(403).json({ error: "Only the buyer can cancel this order." });
        return;
      }
      if (!["pending", "confirmed"].includes(order.status)) {
        res.status(400).json({ error: `Cannot cancel an order with status '${order.status}'.` });
        return;
      }
      await getMarketplaceDb().updateOrderStatus(id, req.session!.sub, "cancelled");
      await createNotification(getDb().getDriver(), order.sellerId, "order_cancelled", "Order Cancelled", `"${order.listingTitle}" was cancelled by the buyer`, `/marketplace/orders/${id}`);
      res.json({ ok: true });
    }),
  );

  // ── Order Messages ─────────────────────────────────────────────

  app.get(
    "/api/marketplace/orders/:id/messages",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      const messages = await getMarketplaceDb().getOrderMessages(id, req.session!.sub);
      res.json({ messages });
    }),
  );

  app.post(
    "/api/marketplace/orders/:id/message",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      const { body } = req.body as { body?: string };
      if (!body || typeof body !== "string" || body.trim().length === 0) {
        res.status(400).json({ error: "Message body is required." });
        return;
      }
      if (body.length > 5000) {
        res.status(400).json({ error: "Message must be under 5000 characters." });
        return;
      }
      const message = await getMarketplaceDb().addOrderMessage(id, req.session!.sub, body.trim());

      // Notify the other participant
      const recipientId = order.buyerId === req.session!.sub ? order.sellerId : order.buyerId;
      await createNotification(getDb().getDriver(), recipientId, "new_message", "New Message", `New message on "${order.listingTitle}"`, `/marketplace/orders/${id}`);

      res.status(201).json(message);
    }),
  );

  // ── Reviews ─────────────────────────────────────────────────────

  app.post(
    "/api/marketplace/orders/:id/review",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      if (order.buyerId !== req.session!.sub) {
        res.status(403).json({ error: "Only the buyer can review this order." });
        return;
      }
      if (order.status !== "completed") {
        res.status(400).json({ error: "Can only review completed orders." });
        return;
      }

      const existing = await getMarketplaceDb().getReviewByOrder(id);
      if (existing) {
        res.status(409).json({ error: "You have already reviewed this order." });
        return;
      }

      const { rating, body, isPublic } = req.body as { rating?: number; body?: string; isPublic?: boolean };
      if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
        res.status(400).json({ error: "Rating must be a number between 1 and 5." });
        return;
      }
      if (!body || typeof body !== "string" || body.trim().length < 10) {
        res.status(400).json({ error: "Review body must be at least 10 characters." });
        return;
      }

      const review = await getMarketplaceDb().createReview(id, req.session!.sub, {
        rating,
        body: body.trim(),
        isPublic: isPublic !== false,
      });
      res.status(201).json(review);
    }),
  );

  // ── Search Providers ────────────────────────────────────────────

  app.get(
    "/api/marketplace/providers",
    asyncHandler(async (req, res) => {
      const query = parseStr(req.query.query) ?? "";
      const limit = Math.min(parseIntParam(req.query.limit, 20), 50);
      const providers = await getMarketplaceDb().searchProviders(query, limit);
      res.json({ providers });
    }),
  );

  // ── Provider Profile (public) ───────────────────────────────────

  app.get(
    "/api/marketplace/providers/:handle",
    asyncHandler(async (req, res) => {
      const profile = await getSocialDb().getProfileByHandle(req.params.handle);
      if (!profile || !profile.isServiceProvider) {
        res.status(404).json({ error: "Provider not found." });
        return;
      }
      const listings = await getMarketplaceDb().getProviderListings(profile.userId, "active");
      res.json({
        profile: {
          userId: profile.userId,
          handle: profile.handle,
          displayName: profile.displayName,
          bio: profile.bio,
          interests: profile.interests,
          traditions: profile.traditions,
          kycStatus: profile.kycStatus,
        },
        listings,
      });
    }),
  );

  // ── Admin Endpoints ─────────────────────────────────────────────

  app.get(
    "/api/admin/marketplace/providers",
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const db = getMarketplaceDb();
      const providers = await db.searchProviders("", 200);
      res.json({ providers });
    }),
  );

  app.get(
    "/api/admin/marketplace/disputes",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const status = "disputed" as OrderStatus;
      const { orders: disputed } = await getMarketplaceDb().getSellerOrders("", status);
      res.json({ disputes: disputed });
    }),
  );

  app.put(
    "/api/admin/marketplace/disputes/:id/resolve",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const { resolution } = req.body as { resolution?: "completed" | "refunded" };
      if (!resolution || !["completed", "refunded"].includes(resolution)) {
        res.status(400).json({ error: "Resolution must be 'completed' or 'refunded'." });
        return;
      }
      await getMarketplaceDb().updateOrderStatus(id, req.session!.sub, resolution);
      res.json({ ok: true });
    }),
  );

  // ── Admin KYC Management ────────────────────────────────────────

  app.put(
    "/api/admin/marketplace/kyc/:userId",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const userId = req.params.userId;
      const { status } = req.body as { status?: string };
      if (!status || !["verified", "rejected", "none"].includes(status)) {
        res.status(400).json({ error: "Status must be 'verified', 'rejected', or 'none'." });
        return;
      }
      await getSocialDb().updateKycStatus(userId, status as any, "admin");
      res.json({ ok: true });
    }),
  );

  // ── KYC Provider Status (for profile page) ──────────────────────

  app.get(
    "/api/marketplace/kyc/status",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const profile = await getSocialDb().getProfile(req.session!.sub);
      res.json({
        kycStatus: profile?.kycStatus ?? "none",
        kycProvider: profile?.kycProvider,
        isServiceProvider: profile?.isServiceProvider ?? false,
      });
    }),
  );

  // ── Seller Notes / Delivery Notes ──────────────────────────────

  app.put(
    "/api/marketplace/orders/:id/notes",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const id = req.params.id as ServiceOrderId;
      const order = await getMarketplaceDb().getOrder(id, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      if (order.sellerId !== req.session!.sub) {
        res.status(403).json({ error: "Only the seller can update order notes." });
        return;
      }
      const { sellerNotes, deliveryNotes } = req.body as { sellerNotes?: string; deliveryNotes?: string };
      await getMarketplaceDb().updateOrderStatus(id, req.session!.sub, order.status, {
        sellerNotes,
        deliveryNotes,
      });
      res.json({ ok: true });
    }),
  );

  // ── Payment: Payram Status ─────────────────────────────────────

  app.get(
    "/api/marketplace/payments/status",
    asyncHandler(async (_req, res) => {
      res.json({
        payramConfigured: payramConfigured(),
        platformFeePercent: 5,
        currency: "USD",
      });
    }),
  );

  // ── Payment: Seller Payout Account ─────────────────────────────

  app.get(
    "/api/marketplace/payments/payout-account",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const account = await getPayoutAccount(getDb().getDriver(), req.session!.sub);
      res.json({ account: account ?? null });
    }),
  );

  app.put(
    "/api/marketplace/payments/payout-account",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const body = req.body as {
        email?: string;
        blockchainCode?: string;
        currencyCode?: string;
        walletAddress?: string;
      };
      const error = validatePayoutInput({
        email: body.email ?? "",
        blockchainCode: body.blockchainCode ?? "",
        currencyCode: body.currencyCode ?? "",
        walletAddress: body.walletAddress ?? "",
      });
      if (error) {
        res.status(400).json({ error });
        return;
      }
      const account = await upsertPayoutAccount(getDb().getDriver(), req.session!.sub, {
        email: body.email!,
        blockchainCode: body.blockchainCode!,
        currencyCode: body.currencyCode!,
        walletAddress: body.walletAddress!,
      });
      res.json({ account });
    }),
  );

  // ── Payment: Checkout for Order ────────────────────────────────

  app.post(
    "/api/marketplace/payments/create-checkout",
    requireAuth,
    asyncHandler(async (req, res) => {
      const { orderId } = req.body as { orderId?: string };
      if (!orderId) {
        res.status(400).json({ error: "orderId is required." });
        return;
      }

      const db = getDb().getDriver();
      const order = await getMarketplaceDb().getOrder(orderId as ServiceOrderId, req.session!.sub);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      if (order.buyerId !== req.session!.sub) {
        res.status(403).json({ error: "Only the buyer can pay for this order." });
        return;
      }
      if (order.status !== "pending") {
        res.status(400).json({ error: `Cannot pay for an order with status '${order.status}'.` });
        return;
      }

      // Check if invoice already exists
      const existing = await getInvoiceByOrder(db, orderId);
      if (existing && existing.status === "pending") {
        res.json({
          checkoutUrl: existing.checkoutUrl,
          referenceId: existing.referenceId,
          amountInUSD: existing.amountCents / 100,
          status: existing.status,
        });
        return;
      }
      if (existing && existing.status === "paid") {
        res.status(400).json({ error: "This order has already been paid." });
        return;
      }

      const invoice = await createMarketplaceInvoice(
        db,
        orderId,
        req.session!.sub,
        order.sellerId,
        order.amountCents,
      );

      res.status(201).json({
        checkoutUrl: invoice.checkoutUrl,
        referenceId: invoice.referenceId,
        amountInUSD: invoice.amountCents / 100,
        platformFeePercent: 5,
        sellerGets: invoice.sellerPayoutCents / 100,
        status: invoice.status,
      });
    }),
  );

  // ── Payment: Get Invoice for Order ─────────────────────────────

  app.get(
    "/api/marketplace/payments/invoice/:orderId",
    requireAuth,
    asyncHandler(async (req, res) => {
      const invoice = await getInvoiceByOrder(getDb().getDriver(), req.params.orderId);
      if (!invoice) {
        res.status(404).json({ error: "No invoice found for this order." });
        return;
      }
      // Only buyer and seller can view
      if (invoice.buyerId !== req.session!.sub && invoice.sellerId !== req.session!.sub) {
        res.status(403).json({ error: "Access denied." });
        return;
      }
      res.json({
        referenceId: invoice.referenceId,
        orderId: invoice.orderId,
        amountCents: invoice.amountCents,
        platformFeeCents: invoice.platformFeeCents,
        sellerPayoutCents: invoice.sellerPayoutCents,
        status: invoice.status,
        checkoutUrl: invoice.checkoutUrl,
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt,
      });
    }),
  );

  // ── Divination Provider Recommendations ──────────────────────────

  app.get(
    "/api/marketplace/divination-providers",
    asyncHandler(async (req, res) => {
      const q = (req.query.q as string ?? "").trim().slice(0, 100);
      const limit = Math.min(Number(req.query.limit) || 6, 20);
      if (!q) {
        // Return top-rated providers when no query
        const providers = await getMarketplaceDb().searchProviders("", limit);
        res.json({ providers });
        return;
      }
      const traditions = q.split(",").map((t) => t.trim()).filter(Boolean);
      const providers = await getMarketplaceDb().searchProvidersByTraditions(traditions, limit);
      // Fallback: if traditions search returns nothing, try text search
      if (providers.length === 0) {
        const fallback = await getMarketplaceDb().searchProviders(q, limit);
        res.json({ providers: fallback });
        return;
      }
      res.json({ providers });
    }),
  );

  // ── Seller Analytics ──────────────────────────────────────────

  app.get(
    "/api/marketplace/analytics",
    requireServiceProvider,
    asyncHandler(async (req, res) => {
      const analytics = await getMarketplaceDb().getSellerAnalytics(req.session!.sub);
      res.json(analytics);
    }),
  );

  // ── Escrow / Auto-Release ────────────────────────────────────────

  app.post(
    "/api/admin/marketplace/process-releases",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const driver = getDb().getDriver();
      const result = await processEscrowReleases(driver);
      res.json(result);
    }),
  );

  // ── Notifications ────────────────────────────────────────────────

  app.get(
    "/api/marketplace/notifications",
    requireAuth,
    asyncHandler(async (req, res) => {
      const driver = getDb().getDriver();
      const [notifications, unread] = await Promise.all([
        getNotifications(driver, req.session!.sub),
        getUnreadCount(driver, req.session!.sub),
      ]);
      res.json({ notifications, unread });
    }),
  );

  app.put(
    "/api/marketplace/notifications/:id/read",
    requireAuth,
    asyncHandler(async (req, res) => {
      await markNotificationRead(getDb().getDriver(), req.params.id, req.session!.sub);
      res.json({ ok: true });
    }),
  );

  app.put(
    "/api/marketplace/notifications/read-all",
    requireAuth,
    asyncHandler(async (req, res) => {
      await markAllNotificationsRead(getDb().getDriver(), req.session!.sub);
      res.json({ ok: true });
    }),
  );
}
