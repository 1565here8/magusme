import type { SqlDriver } from "../db/sql/driver";
import type {
  ServiceListingId,
  ServiceOrderId,
  ServiceCategoryId,
  ServicePackageId,
  ServiceCategory,
  ServiceCategoryRow,
  ServiceListingRow,
  ServiceListingSummary,
  ServiceListingDetail,
  ServicePackage,
  ServicePackageRow,
  ServiceOrderRow,
  ServiceOrderSummary,
  ServiceOrderDetail,
  ServiceOrderMessage,
  ServiceOrderMessageRow,
  ServiceReview,
  ServiceReviewRow,
  ServiceSearchParams,
  ServiceProviderSummary,
  CreateListingInput,
  CreatePackageInput,
  CreateOrderInput,
  CreateReviewInput,
  PricingModel,
  ListingStatus,
  OrderStatus,
} from "./types";

function makeId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function isoNow(): string {
  return new Date().toISOString();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "listing";
}

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export class MarketplaceDb {
  constructor(private readonly driver: SqlDriver) {}

  private pg(sql: string, params: unknown[]): { sql: string; params: unknown[] } {
    if (this.driver.dialect === "postgres") {
      let i = 0;
      return { sql: sql.replace(/\?/g, () => `$${++i}`), params };
    }
    return { sql, params };
  }

  // ── Categories ──────────────────────────────────────────

  async getCategories(): Promise<ServiceCategory[]> {
    const rows = await this.driver.all<ServiceCategoryRow & { count: number }>(
      `SELECT sc.*, COUNT(sl.id) AS count
       FROM service_categories sc
       LEFT JOIN service_listings sl ON sl.category_id = sc.id AND sl.status = 'active'
       GROUP BY sc.id
       ORDER BY sc.sort_order ASC`,
    );
    return rows.map((r) => ({
      id: r.id as ServiceCategoryId,
      slug: r.slug,
      name: r.name,
      description: r.description,
      icon: r.icon,
      parentId: r.parent_id as ServiceCategoryId | null,
      sortOrder: r.sort_order,
      count: r.count,
    }));
  }

  async getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
    const row = await this.driver.get<ServiceCategoryRow & { count: number }>(
      `SELECT sc.*, COUNT(sl.id) AS count
       FROM service_categories sc
       LEFT JOIN service_listings sl ON sl.category_id = sc.id AND sl.status = 'active'
       WHERE sc.slug = ?
       GROUP BY sc.id`,
      [slug],
    );
    if (!row) return null;
    return {
      id: row.id as ServiceCategoryId,
      slug: row.slug,
      name: row.name,
      description: row.description,
      icon: row.icon,
      parentId: row.parent_id as ServiceCategoryId | null,
      sortOrder: row.sort_order,
      count: row.count,
    };
  }

  async seedCategories(): Promise<void> {
    const defaults = [
      { slug: "divination-reading", name: "Divination & Readings", icon: "Sparkles", sort: 1 },
      { slug: "ritual-spellwork", name: "Ritual & Spellwork", icon: "Wand2", sort: 2 },
      { slug: "astrology-charting", name: "Astrology & Charting", icon: "Stars", sort: 3 },
      { slug: "meditation-energy", name: "Meditation & Energy Work", icon: "Brain", sort: 4 },
      { slug: "herbal-alchemy", name: "Herbal & Alchemy", icon: "Flask", sort: 5 },
      { slug: "divination-teaching", name: "Teaching & Mentorship", icon: "BookOpen", sort: 6 },
      { slug: "crafted-items", name: "Crafted Magical Items", icon: "Gem", sort: 7 },
      { slug: "cleansing-banishing", name: "Cleansing & Banishing", icon: "Wind", sort: 8 },
      { slug: "protection-warding", name: "Protection & Warding", icon: "Shield", sort: 9 },
      { slug: "custom-service", name: "Custom Occult Service", icon: "Star", sort: 10 },
    ];
    for (const cat of defaults) {
      const existing = await this.driver.get<{ id: string }>(
        this.pg("SELECT id FROM service_categories WHERE slug = ?", [cat.slug]).sql,
        [cat.slug],
      );
      if (existing) continue;
      await this.driver.exec(
        this.pg(
          "INSERT INTO service_categories (id, slug, name, icon, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          [makeId("svcc"), cat.slug, cat.name, cat.icon, cat.sort, isoNow()],
        ).sql,
        [makeId("svcc"), cat.slug, cat.name, cat.icon, cat.sort, isoNow()],
      );
    }
  }

  // ── Listings ────────────────────────────────────────────

  async createListing(providerId: string, input: CreateListingInput): Promise<ServiceListingId> {
    const id = makeId("svc") as ServiceListingId;
    const slug = slugify(input.title) + "-" + id.slice(-6);
    const now = isoNow();
    const isOnline = input.isOnline !== false ? 1 : 0;
    await this.driver.exec(
      this.pg(
        `INSERT INTO service_listings
         (id, provider_id, category_id, title, slug, description, pricing_model, price_cents,
          duration_minutes, delivery_days, is_online, location, tags, media_urls, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
        [
          id, providerId, input.categoryId ?? null, input.title, slug,
          input.description ?? "", input.pricingModel, input.priceCents ?? 0,
          input.durationMinutes ?? null, input.deliveryDays ?? null,
          isOnline, input.location ?? null,
          JSON.stringify(input.tags ?? []), JSON.stringify(input.mediaUrls ?? []),
          now, now,
        ],
      ).sql,
      [
        id, providerId, input.categoryId ?? null, input.title, slug,
        input.description ?? "", input.pricingModel, input.priceCents ?? 0,
        input.durationMinutes ?? null, input.deliveryDays ?? null,
        isOnline, input.location ?? null,
        JSON.stringify(input.tags ?? []), JSON.stringify(input.mediaUrls ?? []),
        now, now,
      ],
    );
    if (input.packages && input.packages.length > 0) {
      await this.setPackages(id, input.packages);
    }
    return id;
  }

  async updateListing(
    id: ServiceListingId,
    providerId: string,
    input: Partial<CreateListingInput>,
  ): Promise<void> {
    const sets: string[] = [];
    const values: unknown[] = [];

    if (input.title !== undefined) {
      const slug = slugify(input.title) + "-" + id.slice(-6);
      sets.push("title = ?", "slug = ?");
      values.push(input.title, slug);
    }
    if (input.categoryId !== undefined) { sets.push("category_id = ?"); values.push(input.categoryId); }
    if (input.description !== undefined) { sets.push("description = ?"); values.push(input.description); }
    if (input.pricingModel !== undefined) { sets.push("pricing_model = ?"); values.push(input.pricingModel); }
    if (input.priceCents !== undefined) { sets.push("price_cents = ?"); values.push(input.priceCents); }
    if (input.durationMinutes !== undefined) { sets.push("duration_minutes = ?"); values.push(input.durationMinutes); }
    if (input.deliveryDays !== undefined) { sets.push("delivery_days = ?"); values.push(input.deliveryDays); }
    if (input.isOnline !== undefined) { sets.push("is_online = ?"); values.push(input.isOnline ? 1 : 0); }
    if (input.location !== undefined) { sets.push("location = ?"); values.push(input.location); }
    if (input.tags !== undefined) { sets.push("tags = ?"); values.push(JSON.stringify(input.tags)); }
    if (input.mediaUrls !== undefined) { sets.push("media_urls = ?"); values.push(JSON.stringify(input.mediaUrls)); }

    if (sets.length === 0) return;
    sets.push("updated_at = ?");
    values.push(isoNow());
    values.push(id);
    values.push(providerId);

    await this.driver.exec(
      this.pg(
        `UPDATE service_listings SET ${sets.join(", ")} WHERE id = ? AND provider_id = ?`,
        values,
      ).sql,
      values,
    );

    if (input.packages) {
      await this.setPackages(id, input.packages);
    }
  }

  async updateListingStatus(id: ServiceListingId, providerId: string, status: ListingStatus): Promise<void> {
    const now = isoNow();
    await this.driver.exec(
      this.pg(
        "UPDATE service_listings SET status = ?, updated_at = ? WHERE id = ? AND provider_id = ?",
        [status, now, id, providerId],
      ).sql,
      [status, now, id, providerId],
    );
  }

  async getListingBySlug(slug: string): Promise<ServiceListingDetail | null> {
    const row = await this.driver.get<(ServiceListingRow & {
      handle: string;
      display_name: string;
      kyc_status: string;
      bio: string;
      traditions: string;
      category_name: string | null;
      category_slug: string | null;
    })>(
      this.pg(
        `SELECT sl.*, sp.handle, sp.display_name, sp.kyc_status, sp.bio, sp.traditions,
                sc.name AS category_name, sc.slug AS category_slug
         FROM service_listings sl
         JOIN social_profiles sp ON sp.user_id = sl.provider_id
         LEFT JOIN service_categories sc ON sc.id = sl.category_id
         WHERE sl.slug = ? AND sl.status = 'active'`,
        [slug],
      ).sql,
      [slug],
    );
    if (!row) return null;

    const packages = await this.getPackages(row.id as ServiceListingId);

    return {
      id: row.id as ServiceListingId,
      providerId: row.provider_id,
      providerHandle: row.handle,
      providerDisplayName: row.display_name,
      providerKycStatus: row.kyc_status,
      categoryId: row.category_id,
      categoryName: row.category_name ?? null,
      categorySlug: row.category_slug ?? null,
      title: row.title,
      slug: row.slug,
      description: row.description,
      pricingModel: row.pricing_model,
      priceCents: row.price_cents,
      durationMinutes: row.duration_minutes,
      deliveryDays: row.delivery_days,
      isOnline: row.is_online === 1,
      location: row.location,
      tags: parseJsonArray(row.tags),
      mediaUrls: parseJsonArray(row.media_urls),
      status: row.status,
      viewCount: row.view_count,
      orderCount: row.order_count,
      rating: row.rating,
      reviewCount: row.review_count,
      providerBio: row.bio,
      providerTraditions: parseJsonArray(row.traditions),
      packages,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async searchListings(params: ServiceSearchParams): Promise<{ listings: ServiceListingSummary[]; total: number }> {
    const conditions: string[] = ["sl.status = 'active'"];
    const values: unknown[] = [];

    if (params.query) {
      conditions.push("(sl.title LIKE ? OR sl.description LIKE ? OR sl.tags LIKE ?)");
      values.push(`%${params.query}%`, `%${params.query}%`, `%${params.query}%`);
    }
    if (params.category) {
      conditions.push("(sc.slug = ? OR sc.id = ?)");
      values.push(params.category, params.category);
    }
    if (params.tradition) {
      conditions.push("sp.traditions LIKE ?");
      values.push(`%"${params.tradition}"%`);
    }
    if (params.pricingModel) {
      conditions.push("sl.pricing_model = ?");
      values.push(params.pricingModel);
    }
    if (params.minPrice !== undefined) {
      conditions.push("sl.price_cents >= ?");
      values.push(params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      conditions.push("sl.price_cents <= ?");
      values.push(params.maxPrice);
    }
    if (params.isOnline !== undefined) {
      conditions.push("sl.is_online = ?");
      values.push(params.isOnline ? 1 : 0);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;

    const orderBy = (() => {
      switch (params.sort) {
        case "newest": return "sl.created_at DESC";
        case "price_asc": return "sl.price_cents ASC";
        case "price_desc": return "sl.price_cents DESC";
        case "orders": return "sl.order_count DESC";
        case "rating": return "sl.rating DESC";
        default: return "sl.rating DESC, sl.order_count DESC";
      }
    })();

    const limit = Math.min(params.limit ?? 20, 100);
    const offset = params.offset ?? 0;

    const countSql = `SELECT COUNT(*) AS total FROM service_listings sl
      JOIN social_profiles sp ON sp.user_id = sl.provider_id
      LEFT JOIN service_categories sc ON sc.id = sl.category_id ${where}`;
    const { sql: countSqlFinal, params: countParams } = this.pg(countSql, values);
    const { total } = (await this.driver.get<{ total: number }>(countSqlFinal, countParams)) ?? { total: 0 };

    const querySql = `SELECT sl.*, sp.handle, sp.display_name, sp.kyc_status,
      sc.name AS category_name, sc.slug AS category_slug
      FROM service_listings sl
      JOIN social_profiles sp ON sp.user_id = sl.provider_id
      LEFT JOIN service_categories sc ON sc.id = sl.category_id
      ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    const { sql: querySqlFinal, params: queryParams } = this.pg(querySql, [...values, limit, offset]);
    const rows = await this.driver.all<ServiceListingRow & {
      handle: string;
      display_name: string;
      kyc_status: string;
      category_name: string | null;
      category_slug: string | null;
    }>(querySqlFinal, queryParams);

    return {
      listings: rows.map((r) => ({
        id: r.id as ServiceListingId,
        providerId: r.provider_id,
        providerHandle: r.handle,
        providerDisplayName: r.display_name,
        providerKycStatus: r.kyc_status,
        categoryId: r.category_id,
        categoryName: r.category_name ?? null,
        categorySlug: r.category_slug ?? null,
        title: r.title,
        slug: r.slug,
        pricingModel: r.pricing_model,
        priceCents: r.price_cents,
        durationMinutes: r.duration_minutes,
        deliveryDays: r.delivery_days,
        isOnline: r.is_online === 1,
        location: r.location,
        tags: parseJsonArray(r.tags),
        mediaUrls: parseJsonArray(r.media_urls),
        status: r.status,
        viewCount: r.view_count,
        orderCount: r.order_count,
        rating: r.rating,
        reviewCount: r.review_count,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
      total,
    };
  }

  async getProviderListings(providerId: string, status?: ListingStatus): Promise<ServiceListingSummary[]> {
    const conditions = ["sl.provider_id = ?"];
    const values: unknown[] = [providerId];
    if (status) {
      conditions.push("sl.status = ?");
      values.push(status);
    }
    const where = `WHERE ${conditions.join(" AND ")}`;
    const rows = await this.driver.all<ServiceListingRow & {
      handle: string;
      display_name: string;
      kyc_status: string;
      category_name: string | null;
      category_slug: string | null;
    }>(
      this.pg(
        `SELECT sl.*, sp.handle, sp.display_name, sp.kyc_status,
                sc.name AS category_name, sc.slug AS category_slug
         FROM service_listings sl
         JOIN social_profiles sp ON sp.user_id = sl.provider_id
         LEFT JOIN service_categories sc ON sc.id = sl.category_id
         ${where} ORDER BY sl.updated_at DESC`,
        values,
      ).sql,
      values,
    );
    return rows.map((r) => ({
      id: r.id as ServiceListingId,
      providerId: r.provider_id,
      providerHandle: r.handle,
      providerDisplayName: r.display_name,
      providerKycStatus: r.kyc_status,
      categoryId: r.category_id,
      categoryName: r.category_name ?? null,
      categorySlug: r.category_slug ?? null,
      title: r.title,
      slug: r.slug,
      pricingModel: r.pricing_model,
      priceCents: r.price_cents,
      durationMinutes: r.duration_minutes,
      deliveryDays: r.delivery_days,
      isOnline: r.is_online === 1,
      location: r.location,
      tags: parseJsonArray(r.tags),
      mediaUrls: parseJsonArray(r.media_urls),
      status: r.status,
      viewCount: r.view_count,
      orderCount: r.order_count,
      rating: r.rating,
      reviewCount: r.review_count,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getFeaturedListings(limit = 6): Promise<ServiceListingSummary[]> {
    const result = await this.searchListings({ sort: "rating", limit });
    return result.listings;
  }

  async incrementViewCount(id: ServiceListingId): Promise<void> {
    await this.driver.exec(
      this.pg("UPDATE service_listings SET view_count = view_count + 1 WHERE id = ?", [id]).sql,
      [id],
    );
  }

  // ── Packages ────────────────────────────────────────────

  async setPackages(listingId: ServiceListingId, packages: CreatePackageInput[]): Promise<void> {
    await this.driver.exec(
      this.pg("DELETE FROM service_packages WHERE listing_id = ?", [listingId]).sql,
      [listingId],
    );
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      await this.driver.exec(
        this.pg(
          `INSERT INTO service_packages (id, listing_id, name, description, price_cents, delivery_days, inclusions, sort_order, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            makeId("svcp"), listingId, pkg.name, pkg.description ?? "",
            pkg.priceCents, pkg.deliveryDays ?? null,
            JSON.stringify(pkg.inclusions ?? []), pkg.sortOrder ?? i, isoNow(),
          ],
        ).sql,
        [
          makeId("svcp"), listingId, pkg.name, pkg.description ?? "",
          pkg.priceCents, pkg.deliveryDays ?? null,
          JSON.stringify(pkg.inclusions ?? []), pkg.sortOrder ?? i, isoNow(),
        ],
      );
    }
  }

  async getPackages(listingId: ServiceListingId): Promise<ServicePackage[]> {
    const rows = await this.driver.all<ServicePackageRow>(
      this.pg(
        "SELECT * FROM service_packages WHERE listing_id = ? ORDER BY sort_order ASC",
        [listingId],
      ).sql,
      [listingId],
    );
    return rows.map((r) => ({
      id: r.id as ServicePackageId,
      listingId: r.listing_id as ServiceListingId,
      name: r.name,
      description: r.description,
      priceCents: r.price_cents,
      deliveryDays: r.delivery_days,
      inclusions: parseJsonArray(r.inclusions),
      sortOrder: r.sort_order,
    }));
  }

  // ── Orders ──────────────────────────────────────────────

  async createOrder(buyerId: string, listingId: ServiceListingId, input: CreateOrderInput): Promise<ServiceOrderId> {
    const id = makeId("ord") as ServiceOrderId;
    const now = isoNow();

    let amountCents = input.customAmountCents ?? 0;
    if (input.packageId) {
      const pkg = await this.driver.get<ServicePackageRow>(
        this.pg("SELECT * FROM service_packages WHERE id = ?", [input.packageId]).sql,
        [input.packageId],
      );
      if (pkg) amountCents = pkg.price_cents;
    }

    await this.driver.exec(
      this.pg(
        `INSERT INTO service_orders
         (id, listing_id, buyer_id, package_id, custom_amount_cents, status, buyer_instructions, created_at)
         VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
        [id, listingId, buyerId, input.packageId ?? null, input.customAmountCents ?? null, input.buyerInstructions ?? "", now],
      ).sql,
      [id, listingId, buyerId, input.packageId ?? null, input.customAmountCents ?? null, input.buyerInstructions ?? "", now],
    );

    await this.driver.exec(
      this.pg("UPDATE service_listings SET order_count = order_count + 1 WHERE id = ?", [listingId]).sql,
      [listingId],
    );

    return id;
  }

  async getOrder(id: ServiceOrderId, userId: string): Promise<ServiceOrderDetail | null> {
    const row = await this.driver.get<(ServiceOrderRow & {
      listing_title: string;
      listing_slug: string;
      buyer_handle: string | null;
      seller_id: string;
      seller_handle: string | null;
      package_name: string | null;
      package_description: string | null;
      package_inclusions: string | null;
      listing_media_urls: string;
    })>(
      this.pg(
        `SELECT ord.*, sl.title AS listing_title, sl.slug AS listing_slug, sl.media_urls AS listing_media_urls,
                sl.provider_id AS seller_id,
                buyer.handle AS buyer_handle,
                seller.handle AS seller_handle,
                pkg.name AS package_name, pkg.description AS package_description, pkg.inclusions AS package_inclusions
         FROM service_orders ord
         JOIN service_listings sl ON sl.id = ord.listing_id
         LEFT JOIN social_profiles buyer ON buyer.user_id = ord.buyer_id
         LEFT JOIN social_profiles seller ON seller.user_id = sl.provider_id
         LEFT JOIN service_packages pkg ON pkg.id = ord.package_id
         WHERE ord.id = ? AND (ord.buyer_id = ? OR sl.provider_id = ?)`,
        [id, userId, userId],
      ).sql,
      [id, userId, userId],
    );
    if (!row) return null;

    const lastMsg = await this.driver.get<{ body: string; created_at: string }>(
      this.pg(
        "SELECT body, created_at FROM service_order_messages WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
        [id],
      ).sql,
      [id],
    );

    const amountCents = row.custom_amount_cents ?? (row.package_id ? await this.getPackagePrice(row.package_id) : 0);
    const sellerId = row.seller_id;
    const buyerId = row.buyer_id;

    const lastMsgRow = lastMsg;

    return {
      id: row.id as ServiceOrderId,
      listingId: row.listing_id as ServiceListingId,
      listingTitle: row.listing_title,
      listingSlug: row.listing_slug,
      buyerId,
      buyerHandle: row.buyer_handle ?? null,
      sellerId,
      sellerHandle: row.seller_handle ?? null,
      packageName: row.package_name ?? null,
      amountCents,
      status: row.status as OrderStatus,
      buyerInstructions: row.buyer_instructions,
      sellerNotes: row.seller_notes,
      deliveryNotes: row.delivery_notes,
      lastMessage: lastMsgRow?.body ?? null,
      lastMessageAt: lastMsgRow?.created_at ?? null,
      confirmedAt: row.confirmed_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.created_at,
      listingMediaUrls: parseJsonArray(row.listing_media_urls),
      packageDescription: row.package_description ?? null,
      packageInclusions: row.package_inclusions ? parseJsonArray(row.package_inclusions) : [],
    };
  }

  private async getPackagePrice(packageId: string): Promise<number> {
    const row = await this.driver.get<{ price_cents: number }>(
      this.pg("SELECT price_cents FROM service_packages WHERE id = ?", [packageId]).sql,
      [packageId],
    );
    return row?.price_cents ?? 0;
  }

  async getBuyerOrders(userId: string, statusFilter?: OrderStatus): Promise<ServiceOrderSummary[]> {
    const conditions = ["ord.buyer_id = ?"];
    const values: unknown[] = [userId];
    if (statusFilter) {
      conditions.push("ord.status = ?");
      values.push(statusFilter);
    }
    const where = `WHERE ${conditions.join(" AND ")}`;
    return this.queryOrderSummaries(where, values);
  }

  async getSellerOrders(providerId: string, statusFilter?: OrderStatus): Promise<ServiceOrderSummary[]> {
    const conditions = ["sl.provider_id = ?"];
    const values: unknown[] = [providerId];
    if (statusFilter) {
      conditions.push("ord.status = ?");
      values.push(statusFilter);
    }
    const where = `WHERE ${conditions.join(" AND ")}`;
    return this.queryOrderSummaries(where, values);
  }

  private async queryOrderSummaries(where: string, values: unknown[]): Promise<ServiceOrderSummary[]> {
    const rows = await this.driver.all<(ServiceOrderRow & {
      listing_title: string;
      listing_slug: string;
      buyer_handle: string | null;
      seller_id: string;
      seller_handle: string | null;
      package_name: string | null;
    })>(
      this.pg(
        `SELECT ord.*, sl.title AS listing_title, sl.slug AS listing_slug,
                sl.provider_id AS seller_id,
                buyer.handle AS buyer_handle,
                seller.handle AS seller_handle,
                pkg.name AS package_name
         FROM service_orders ord
         JOIN service_listings sl ON sl.id = ord.listing_id
         LEFT JOIN social_profiles buyer ON buyer.user_id = ord.buyer_id
         LEFT JOIN social_profiles seller ON seller.user_id = sl.provider_id
         LEFT JOIN service_packages pkg ON pkg.id = ord.package_id
         ${where}
         ORDER BY ord.created_at DESC
         LIMIT 50`,
        values,
      ).sql,
      values,
    );

    const summaries: ServiceOrderSummary[] = [];
    for (const r of rows) {
      const lastMsg = await this.driver.get<{ body: string; created_at: string }>(
        this.pg(
          "SELECT body, created_at FROM service_order_messages WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
          [r.id],
        ).sql,
        [r.id],
      );
      const amountCents = r.custom_amount_cents ?? 0;
      summaries.push({
        id: r.id as ServiceOrderId,
        listingId: r.listing_id as ServiceListingId,
        listingTitle: r.listing_title,
        listingSlug: r.listing_slug,
        buyerId: r.buyer_id,
        buyerHandle: r.buyer_handle ?? null,
        sellerId: r.seller_id,
        sellerHandle: r.seller_handle ?? null,
        packageName: r.package_name ?? null,
        amountCents,
        status: r.status as OrderStatus,
        lastMessage: lastMsg?.body ?? null,
        lastMessageAt: lastMsg?.created_at ?? null,
        createdAt: r.created_at,
        updatedAt: r.created_at,
      });
    }
    return summaries;
  }

  async updateOrderStatus(
    id: ServiceOrderId,
    userId: string,
    status: OrderStatus,
    notes?: { sellerNotes?: string; deliveryNotes?: string },
  ): Promise<void> {
    const now = isoNow();
    const sets: string[] = ["status = ?"];
    const values: unknown[] = [status];

    if (status === "confirmed" || status === "in_progress") {
      sets.push("confirmed_at = COALESCE(confirmed_at, ?)");
      values.push(now);
    }
    if (status === "completed") {
      sets.push("completed_at = ?");
      values.push(now);
      // Set auto-release 3 days from now (escrow period for buyer dispute)
      const releaseAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      sets.push("auto_release_at = ?");
      values.push(releaseAt);
    }
    if (notes?.sellerNotes !== undefined) {
      sets.push("seller_notes = ?");
      values.push(notes.sellerNotes);
    }
    if (notes?.deliveryNotes !== undefined) {
      sets.push("delivery_notes = ?");
      values.push(notes.deliveryNotes);
    }

    values.push(id);

    await this.driver.exec(
      this.pg(
        `UPDATE service_orders SET ${sets.join(", ")} WHERE id = ?`,
        values,
      ).sql,
      values,
    );
  }

  // ── Order Messages ──────────────────────────────────────

  async addOrderMessage(orderId: ServiceOrderId, senderId: string, body: string): Promise<ServiceOrderMessage> {
    const id = makeId("svcm");
    const now = isoNow();
    await this.driver.exec(
      this.pg(
        "INSERT INTO service_order_messages (id, order_id, sender_id, body, created_at) VALUES (?, ?, ?, ?, ?)",
        [id, orderId, senderId, body, now],
      ).sql,
      [id, orderId, senderId, body, now],
    );
    const sender = await this.driver.get<{ handle: string }>(
      this.pg("SELECT handle FROM social_profiles WHERE user_id = ?", [senderId]).sql,
      [senderId],
    );
    return {
      id,
      orderId,
      senderId,
      senderHandle: sender?.handle ?? "unknown",
      body,
      createdAt: now,
    };
  }

  async getOrderMessages(orderId: ServiceOrderId, userId: string): Promise<ServiceOrderMessage[]> {
    const rows = await this.driver.all<(ServiceOrderMessageRow & { handle: string })>(
      this.pg(
        `SELECT m.*, sp.handle
         FROM service_order_messages m
         JOIN social_profiles sp ON sp.user_id = m.sender_id
         WHERE m.order_id = ?
         ORDER BY m.created_at ASC`,
        [orderId],
      ).sql,
      [orderId],
    );
    return rows.map((r) => ({
      id: r.id,
      orderId: r.order_id as ServiceOrderId,
      senderId: r.sender_id,
      senderHandle: r.handle,
      body: r.body,
      createdAt: r.created_at,
    }));
  }

  // ── Reviews ─────────────────────────────────────────────

  async createReview(orderId: ServiceOrderId, reviewerId: string, input: CreateReviewInput): Promise<ServiceReview> {
    const id = makeId("svcr");
    const now = isoNow();

    const order = await this.driver.get<{ listing_id: string; status: string }>(
      this.pg("SELECT listing_id, status FROM service_orders WHERE id = ?", [orderId]).sql,
      [orderId],
    );
    if (!order || order.status !== "completed") {
      throw new Error("Can only review completed orders.");
    }

    await this.driver.exec(
      this.pg(
        "INSERT INTO service_reviews (id, order_id, listing_id, reviewer_id, rating, body, is_public, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, orderId, order.listing_id, reviewerId, input.rating, input.body, input.isPublic !== false ? 1 : 0, now],
      ).sql,
      [id, orderId, order.listing_id, reviewerId, input.rating, input.body, input.isPublic !== false ? 1 : 0, now],
    );

    const agg = await this.driver.get<{ avg_rating: number; review_count: number }>(
      this.pg(
        "SELECT AVG(CAST(rating AS REAL)) AS avg_rating, COUNT(*) AS review_count FROM service_reviews WHERE listing_id = ?",
        [order.listing_id],
      ).sql,
      [order.listing_id],
    );
    if (agg) {
      await this.driver.exec(
        this.pg(
          "UPDATE service_listings SET rating = ?, review_count = ?, updated_at = ? WHERE id = ?",
          [Math.round(agg.avg_rating * 10) / 10, agg.review_count, now, order.listing_id],
        ).sql,
        [Math.round(agg.avg_rating * 10) / 10, agg.review_count, now, order.listing_id],
      );
    }

    const reviewer = await this.driver.get<{ handle: string }>(
      this.pg("SELECT handle FROM social_profiles WHERE user_id = ?", [reviewerId]).sql,
      [reviewerId],
    );

    return {
      id,
      orderId,
      listingId: order.listing_id as ServiceListingId,
      reviewerId,
      reviewerHandle: reviewer?.handle ?? "unknown",
      rating: input.rating,
      body: input.body,
      isPublic: input.isPublic !== false,
      createdAt: now,
    };
  }

  async getListingReviews(listingId: ServiceListingId): Promise<{
    reviews: ServiceReview[];
    avgRating: number;
    total: number;
  }> {
    const agg = await this.driver.get<{ avg_rating: number; total: number }>(
      this.pg(
        "SELECT AVG(CAST(rating AS REAL)) AS avg_rating, COUNT(*) AS total FROM service_reviews WHERE listing_id = ? AND is_public = 1",
        [listingId],
      ).sql,
      [listingId],
    );
    const rows = await this.driver.all<(ServiceReviewRow & { handle: string })>(
      this.pg(
        `SELECT r.*, sp.handle
         FROM service_reviews r
         JOIN social_profiles sp ON sp.user_id = r.reviewer_id
         WHERE r.listing_id = ? AND r.is_public = 1
         ORDER BY r.created_at DESC
         LIMIT 50`,
        [listingId],
      ).sql,
      [listingId],
    );
    return {
      reviews: rows.map((r) => ({
        id: r.id,
        orderId: r.order_id as ServiceOrderId,
        listingId: r.listing_id as ServiceListingId,
        reviewerId: r.reviewer_id,
        reviewerHandle: r.handle,
        rating: r.rating,
        body: r.body,
        isPublic: r.is_public === 1,
        createdAt: r.created_at,
      })),
      avgRating: agg?.avg_rating ?? 0,
      total: agg?.total ?? 0,
    };
  }

  async getReviewByOrder(orderId: ServiceOrderId): Promise<ServiceReview | null> {
    const row = await this.driver.get<(ServiceReviewRow & { handle: string })>(
      this.pg(
        `SELECT r.*, sp.handle
         FROM service_reviews r
         JOIN social_profiles sp ON sp.user_id = r.reviewer_id
         WHERE r.order_id = ?`,
        [orderId],
      ).sql,
      [orderId],
    );
    if (!row) return null;
    return {
      id: row.id,
      orderId: row.order_id as ServiceOrderId,
      listingId: row.listing_id as ServiceListingId,
      reviewerId: row.reviewer_id,
      reviewerHandle: row.handle,
      rating: row.rating,
      body: row.body,
      isPublic: row.is_public === 1,
      createdAt: row.created_at,
    };
  }

  // ── Provider Search ─────────────────────────────────────

  async searchProviders(query: string, limit = 20): Promise<ServiceProviderSummary[]> {
    const q = `%${query.toLowerCase()}%`;
    const rows = await this.driver.all<{
      user_id: string;
      handle: string;
      display_name: string;
      bio: string;
      traditions: string;
      kyc_status: string;
      listing_count: number;
      avg_rating: number;
      review_count: number;
    }>(
      this.pg(
        `SELECT sp.user_id, sp.handle, sp.display_name, sp.bio, sp.traditions, sp.kyc_status,
                COUNT(sl.id) AS listing_count,
                COALESCE(AVG(sl.rating), 0) AS avg_rating,
                COALESCE(SUM(sl.review_count), 0) AS review_count
         FROM social_profiles sp
         LEFT JOIN service_listings sl ON sl.provider_id = sp.user_id AND sl.status = 'active'
         WHERE sp.is_service_provider = 1
           AND sp.kyc_status = 'verified'
           AND (LOWER(sp.handle) LIKE ? OR LOWER(sp.display_name) LIKE ?)
         GROUP BY sp.user_id
         ORDER BY avg_rating DESC
         LIMIT ?`,
        [q, q, limit],
      ).sql,
      [q, q, limit],
    );
    return rows.map((r) => ({
      userId: r.user_id,
      handle: r.handle,
      displayName: r.display_name,
      bio: r.bio,
      traditions: parseJsonArray(r.traditions),
      kycStatus: r.kyc_status,
      listingCount: r.listing_count,
      avgRating: r.avg_rating,
      reviewCount: r.review_count,
    }));
  }

  async searchProvidersByTraditions(traditions: string[], limit = 6): Promise<ServiceProviderSummary[]> {
    if (traditions.length === 0) return [];
    // Match providers whose traditions array (stored as JSON) contains any of the given traditions
    const conditions = traditions.map(() => "LOWER(sp.traditions) LIKE ?").join(" OR ");
    const params: string[] = [];
    for (const t of traditions) {
      params.push(`%${t.toLowerCase()}%`);
    }
    params.push(String(limit));
    const rows = await this.driver.all<{
      user_id: string;
      handle: string;
      display_name: string;
      bio: string;
      traditions: string;
      kyc_status: string;
      listing_count: number;
      avg_rating: number;
      review_count: number;
    }>(
      this.pg(
        `SELECT sp.user_id, sp.handle, sp.display_name, sp.bio, sp.traditions, sp.kyc_status,
                COUNT(sl.id) AS listing_count,
                COALESCE(AVG(sl.rating), 0) AS avg_rating,
                COALESCE(SUM(sl.review_count), 0) AS review_count
         FROM social_profiles sp
         LEFT JOIN service_listings sl ON sl.provider_id = sp.user_id AND sl.status = 'active'
         WHERE sp.is_service_provider = 1
           AND sp.kyc_status = 'verified'
           AND (${conditions})
         GROUP BY sp.user_id
         ORDER BY avg_rating DESC
         LIMIT ?`,
        params,
      ).sql,
      params,
    );
    return rows.map((r) => ({
      userId: r.user_id,
      handle: r.handle,
      displayName: r.display_name,
      bio: r.bio,
      traditions: parseJsonArray(r.traditions),
      kycStatus: r.kyc_status,
      listingCount: r.listing_count,
      avgRating: r.avg_rating,
      reviewCount: r.review_count,
    }));
  }
  // ── Escrow / Auto-Release ────────────────────────────────

  async findOrdersPendingRelease(limit = 50): Promise<{ id: string; sellerId: string }[]> {
    const now = isoNow();
    const rows = await this.driver.all<{ id: string; seller_id: string }>(
      this.pg(
        `SELECT so.id, sl.provider_id AS seller_id
         FROM service_orders so
         JOIN service_listings sl ON sl.id = so.listing_id
         WHERE so.status = 'completed'
           AND so.auto_release_at IS NOT NULL
           AND so.auto_release_at <= ?
         LIMIT ?`,
        [now, limit],
      ).sql,
      [now, limit],
    );
    return rows.map((r) => ({ id: r.id, sellerId: r.seller_id }));
  }

  async confirmOrderRelease(id: ServiceOrderId): Promise<void> {
    const now = isoNow();
    await this.driver.exec(
      this.pg(`UPDATE service_orders SET status = 'confirmed', confirmed_at = COALESCE(confirmed_at, ?) WHERE id = ? AND status = 'completed'`, [now, id]).sql,
      [now, id],
    );
  }

  // ── Seller Analytics ─────────────────────────────────────────

  async getSellerAnalytics(providerId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    totalRevenueCents: number;
    platformFeesCents: number;
    netRevenueCents: number;
    avgRating: number;
    reviewCount: number;
    ordersByStatus: Record<string, number>;
    recentOrders: { id: string; title: string; amountCents: number; status: string; createdAt: string }[];
  }> {
    const [stats, byStatus, recent] = await Promise.all([
      this.driver.get<{
        total: number;
        completed: number;
        revenue: number;
        avgRating: number;
        reviewCount: number;
      }>(
        this.pg(
          `SELECT COUNT(*) AS total,
                  SUM(CASE WHEN ord.status = 'completed' THEN 1 ELSE 0 END) AS completed,
                  COALESCE(SUM(COALESCE(ord.custom_amount_cents, pk.price_cents, 0)), 0) AS revenue,
                  COALESCE(AVG(sl.rating), 0) AS avgRating,
                  COALESCE(SUM(sl.review_count), 0) AS reviewCount
           FROM service_orders ord
           JOIN service_listings sl ON sl.id = ord.listing_id
           LEFT JOIN service_packages pk ON pk.id = ord.package_id
           WHERE sl.provider_id = ?`,
          [providerId],
        ).sql,
        [providerId],
      ),
      this.driver.all<{ status: string; count: number }>(
        this.pg(
          `SELECT ord.status, COUNT(*) AS count
           FROM service_orders ord
           JOIN service_listings sl ON sl.id = ord.listing_id
           WHERE sl.provider_id = ?
           GROUP BY ord.status`,
          [providerId],
        ).sql,
        [providerId],
      ),
      this.driver.all<{ id: string; title: string; amount: number; status: string; created_at: string }>(
        this.pg(
          `SELECT ord.id, sl.title, COALESCE(ord.custom_amount_cents, pk.price_cents, 0) AS amount, ord.status, ord.created_at
           FROM service_orders ord
           JOIN service_listings sl ON sl.id = ord.listing_id
           LEFT JOIN service_packages pk ON pk.id = ord.package_id
           WHERE sl.provider_id = ?
           ORDER BY ord.created_at DESC
           LIMIT 10`,
          [providerId],
        ).sql,
        [providerId],
      ),
    ]);

    const ordersByStatus: Record<string, number> = {};
    for (const r of byStatus) ordersByStatus[r.status] = r.count;

    const totalRevenueCents = stats?.revenue ?? 0;
    const platformFeesCents = Math.round(totalRevenueCents * 0.05);
    const netRevenueCents = totalRevenueCents - platformFeesCents;

    return {
      totalOrders: stats?.total ?? 0,
      completedOrders: stats?.completed ?? 0,
      totalRevenueCents,
      platformFeesCents,
      netRevenueCents,
      avgRating: stats?.avgRating ?? 0,
      reviewCount: stats?.reviewCount ?? 0,
      ordersByStatus,
      recentOrders: (recent ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        amountCents: r.amount,
        status: r.status,
        createdAt: r.created_at,
      })),
    };
  }

  // ── Escrow / Auto-Release ────────────────────────────────
}

let instance: MarketplaceDb | null = null;

export function initMarketplaceDb(driver: SqlDriver): MarketplaceDb {
  instance = new MarketplaceDb(driver);
  return instance;
}

export function getMarketplaceDb(): MarketplaceDb {
  if (!instance) throw new Error("MarketplaceDb not initialized. Call initMarketplaceDb() first.");
  return instance;
}
