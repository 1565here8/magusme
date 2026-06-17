# 🏪 MagusMe Magic Shop — Marketplace Roadmap

> **Mission**: Build the world's first magical services marketplace where verified spell casters, diviners, and ritual practitioners offer their services. Like Etsy/Fiverr/eBay but purpose-built for the occult community — with built-in divination trust layer, tradition-based discovery, KYC-verified practitioners, and integrated token/fiat payments.

---

## 📋 Status Dashboard

| Phase | Status | Description |
|-------|--------|-------------|
| **0 — Foundation** | ✅ Complete | Schema, DB layer, types, init |
| **1 — Server API** | ✅ Complete | Route handlers for listings, orders, reviews, DMs, admin |
| **2 — Provider Onboarding** | 🟡 Partial | Create listing form done; provider profile page TBD |
| **3 — Browse & Discovery** | ✅ Complete | MarketplaceHome, category grid, search, featured, filters |
| **4 — Listing Detail** | ✅ Complete | Full listing page with packages, reviews, booking, provider card |
| **5 — Order Workflow** | ✅ Complete | Order lifecycle (pending→confirmed→in_progress→completed), chat, cancel, reviews |
| **6 — Payments** | 🔲 Not Started | Payram/Stripe integration for marketplace orders |
| **7 — Reviews & Trust** | 🔲 Not Started | Rating system, order-gated reviews, seller badges |
| **8 — Admin Moderation** | 🔲 Not Started | Flag listings, dispute resolution, payout management |
| **9 — Divination Integration** | 🔲 Not Started | `/reading` recommends listings, oracle cross-reference on sellers |
| **10 — Polish & Launch** | 🔲 Not Started | Nav integration, mobile responsive, SEO |

---

## 🏗 Architecture Overview

### Data Model

```
social_profiles (existing)
  ├── is_service_provider: boolean
  ├── kyc_status: none | pending | verified | rejected
  └── traditions: string[]          ← used for marketplace filtering

service_categories                 ← browse taxonomy
  ├── id, slug, name, description
  ├── icon, sort_order
  └── parent_id (nullable, for subcategories)

service_listings                   ← the core listing
  ├── id, provider_id → social_profiles
  ├── category_id → service_categories
  ├── title, slug, description (rich text / markdown)
  ├── pricing_model: fixed | hourly | package
  ├── price_cents (for fixed pricing)
  ├── duration_minutes
  ├── delivery_days (estimated)
  ├── is_online (boolean, remote service)
  ├── location (optional, for in-person)
  ├── tags (JSON array)
  ├── media_urls (JSON array of images)
  ├── status: draft | active | paused | archived
  ├── created_at, updated_at

service_packages                   ← tiered offerings per listing
  ├── id, listing_id → service_listings
  ├── name (e.g. "Basic", "Standard", "Premium")
  ├── description
  ├── price_cents
  ├── delivery_days
  └── inclusions (JSON array of what's included)

service_orders                     ← transaction record
  ├── id, listing_id → service_listings
  ├── buyer_id → users
  ├── package_id → service_packages (nullable)
  ├── custom_amount_cents (if no package)
  ├── status: pending | confirmed | in_progress | completed | cancelled | disputed | refunded
  ├── buyer_instructions (text, what the buyer wants)
  ├── seller_notes (text, internal to seller)
  ├── delivery_notes (text, seller delivers result)
  ├── created_at, confirmed_at, completed_at

service_order_messages             ← order-specific chat
  ├── id, order_id → service_orders
  ├── sender_id → users
  ├── body (text)
  └── created_at

service_reviews                    ← order-gated reviews
  ├── id, order_id → service_orders (unique)
  ├── listing_id → service_listings
  ├── reviewer_id → users
  ├── rating (1-5)
  ├── body (text)
  ├── is_public (boolean, default true)
  └── created_at

service_availability               ← scheduling (future)
  ├── id, listing_id → service_listings
  ├── day_of_week (0-6)
  ├── start_time, end_time
  └── timezone
```

### Key Differentiators — "Much Better Than Etsy/Fiverr"

| Feature | Etsy/Fiverr | MagusMe |
|---------|-------------|---------|
| **Discovery via divination** | ❌ Search only | ✅ Oracle can recommend listings matching your question |
| **Tradition matching** | ❌ General categories | ✅ Filter by Hermetic, Norse, Folk, Kabbalistic, etc. |
| **Provider verification** | ❌ None | ✅ KYC via ID.me + tradition knowledge verification |
| **Token payments** | ❌ Fiat only | ✅ Pay with MagusMe tokens for small services |
| **Integrated consultation** | ❌ Separate | ✅ Buyers can consult oracle about seller before ordering |
| **Community trust** | ❌ Generic reviews | ✅ Reviews gated to verified orders, cross-referenced with divination reputation |
| **Built-in chat** | ❌ Separate DMs | ✅ Order-specific messages via existing social DMs |

---

## 🧩 Phase 0 — Foundation (Step 1 in code)

### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/server/marketplace/types.ts` | **CREATE** | All TypeScript interfaces for marketplace entities |
| `src/server/db/sql/schema.ts` | **MODIFY** | Add marketplace table DDL |
| `src/server/marketplace/marketplaceDb.ts` | **CREATE** | Full CRUD database class (follows `spellsDb.ts` pattern) |
| `src/server/marketplace/init.ts` | **CREATE** | Module initializer (follows `social/init.ts` pattern) |
| `server/app.ts` | **MODIFY** | Register `initMarketplaceModule()` on startup |
| `src/client/api/marketplaceClient.ts` | **CREATE** | API client functions (follows `spellsClient.ts` pattern) |

### Database Schema Definitions

```sql
-- Categories are seeded, not user-created
CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  parent_id TEXT REFERENCES service_categories(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Core listing — every service provider can create multiple
CREATE TABLE IF NOT EXISTS service_listings (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES social_profiles(user_id),
  category_id TEXT REFERENCES service_categories(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  pricing_model TEXT NOT NULL DEFAULT 'fixed' CHECK(pricing_model IN ('fixed','hourly','package','contact')),
  price_cents INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  delivery_days INTEGER,
  is_online INTEGER NOT NULL DEFAULT 1,
  location TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  media_urls TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','paused','archived')),
  view_count INTEGER NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_svc_listings_provider ON service_listings(provider_id);
CREATE INDEX IF NOT EXISTS idx_svc_listings_category ON service_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_svc_listings_status ON service_listings(status);
CREATE INDEX IF NOT EXISTS idx_svc_listings_rating ON service_listings(rating DESC);

-- Tiered packages for a listing (e.g. Basic / Standard / Premium)
CREATE TABLE IF NOT EXISTS service_packages (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES service_listings(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  delivery_days INTEGER,
  inclusions TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_svc_packages_listing ON service_packages(listing_id);

-- Order = a purchase/booking of a service
CREATE TABLE IF NOT EXISTS service_orders (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES service_listings(id),
  buyer_id TEXT NOT NULL REFERENCES users(id),
  package_id TEXT REFERENCES service_packages(id),
  custom_amount_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','in_progress','completed','cancelled','disputed','refunded')),
  buyer_instructions TEXT NOT NULL DEFAULT '',
  seller_notes TEXT NOT NULL DEFAULT '',
  delivery_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  confirmed_at TEXT,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_svc_orders_buyer ON service_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_svc_orders_listing ON service_orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_svc_orders_status ON service_orders(status);

-- Order-gated messages (uses existing social_conversations for DMs, this is for order context)
CREATE TABLE IF NOT EXISTS service_order_messages (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES service_orders(id),
  sender_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_svc_msgs_order ON service_order_messages(order_id, created_at);

-- Reviews are one per order, gated to completed orders only
CREATE TABLE IF NOT EXISTS service_reviews (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES service_orders(id),
  listing_id TEXT NOT NULL REFERENCES service_listings(id),
  reviewer_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_svc_reviews_listing ON service_reviews(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_svc_reviews_reviewer ON service_reviews(reviewer_id);
```

### marketplaceDb.ts Public Methods

```
Listings:
  createListing(providerId, data) → id
  updateListing(id, providerId, data) → void
  getListingBySlug(slug) → ListingDetail | null
  searchListings(filters) → { listings, total }
  getProviderListings(providerId, status?) → ListingSummary[]
  getFeaturedListings() → ListingSummary[]
  incrementViewCount(id) → void

Packages:
  setPackages(listingId, packages[]) → void  (replace all)
  getPackages(listingId) → ServicePackage[]

Orders:
  createOrder(buyerId, listingId, data) → id
  getOrder(id, userId) → OrderDetail | null   (buyer or seller)
  getBuyerOrders(userId, status?) → OrderSummary[]
  getSellerOrders(providerId, status?) → OrderSummary[]
  updateOrderStatus(id, userId, status, notes?) → void
  addOrderMessage(orderId, senderId, body) → OrderMessage
  getOrderMessages(orderId, userId) → OrderMessage[]

Reviews:
  createReview(orderId, reviewerId, data) → Review
  getListingReviews(listingId) → { reviews, avgRating, total }
  getReviewByOrder(orderId) → Review | null

Categories:
  getCategories() → ServiceCategory[]
  getCategoryBySlug(slug) → ServiceCategory | null
```

### API Routes (Phase 1)

```
BROWSE:
  GET    /api/marketplace/categories              → categories list
  GET    /api/marketplace/listings                → search (query, category, tradition, pricing_model, min_price, max_price, sort, limit, offset)
  GET    /api/marketplace/listings/featured       → featured listings
  GET    /api/marketplace/listings/:slug          → listing detail (includes packages, provider profile, reviews summary)
  GET    /api/marketplace/providers               → search service providers
  GET    /api/marketplace/listings/:slug/reviews  → paginated reviews

PROVIDER (requireAuth + isServiceProvider):
  POST   /api/marketplace/listings                → create listing
  PUT    /api/marketplace/listings/:id            → update listing
  PUT    /api/marketplace/listings/:id/packages   → set packages (replaces all)
  PUT    /api/marketplace/listings/:id/status     → pause/activate/archive
  GET    /api/marketplace/provider/listings       → my listings
  GET    /api/marketplace/orders/incoming         → orders I need to fulfill

BUYER (requireAuth):
  POST   /api/marketplace/listings/:slug/order    → place order
  PUT    /api/marketplace/orders/:id/cancel       → cancel own order
  GET    /api/marketplace/orders                  → my orders
  GET    /api/marketplace/orders/:id              → order detail
  POST   /api/marketplace/orders/:id/message      → send message
  GET    /api/marketplace/orders/:id/messages     → get messages

SELLER (requireAuth + isServiceProvider):
  PUT    /api/marketplace/orders/:id/status       → confirm, start, deliver, complete
  PUT    /api/marketplace/orders/:id/notes        → update seller notes / delivery notes

REVIEWS (requireAuth, gated to completed order participants):
  POST   /api/marketplace/orders/:id/review       → leave review
```

---

## 📐 Phase 1 — Server API Implementation

### Route File: `server/routes/marketplace.routes.ts`

Follow the pattern from `spells.routes.ts`:
- Import `asyncHandler`, `requireAuth`, `requireAdmin` from middleware
- Import `getMarketplaceDb()` from the module
- Each handler: validate input → call DB → return JSON
- Use `/api/marketplace/*` prefix for all routes

### Middleware: `requireServiceProvider`

Create `server/middleware/provider.ts` that:
1. Calls `requireAuth` first (must be logged in)
2. Loads social profile via `getSocialDb().getProfile(req.session.sub)`
3. Returns 403 if `!profile.isServiceProvider || profile.kycStatus !== 'verified'`
4. Adds `req.provider` to the request

### Order Flow State Machine

```
pending → confirmed → in_progress → completed
  |          |             |
  v          v             v
cancelled  cancelled   disputed
                        |
                        v
                     refunded
```

- **pending**: buyer placed order, awaiting seller confirmation
- **confirmed**: seller accepted, work begins
- **in_progress**: seller started (optional, for services with delivery)
- **completed**: seller marks delivered OR buyer confirms done
- **cancelled**: buyer or seller cancels before completion
- **disputed**: buyer disputes after completion
- **refunded**: admin resolves dispute, refund issued

---

## 🖥 Phase 2 — Frontend Pages

### Page Structure

```
/marketplace                    → MarketplaceHome (hero, featured listings, category grid)
/marketplace/c/:slug            → CategoryPage (listings filtered by category)
/marketplace/s/:handle          → ProviderProfile (provider's profile + all listings)
/marketplace/l/:slug            → ListingDetail (full listing, packages, reviews, book CTA)
/marketplace/create             → CreateListing (multi-step form: info, packages, media, publish)
/marketplace/edit/:id           → EditListing (same form, pre-filled)
/marketplace/orders             → OrderDashboard (tabs: buying | selling)
/marketplace/orders/:id         → OrderDetail (status timeline, messages, delivery notes)
```

### Component Tree

```
MarketplaceHome
├── HeroSection (search bar, tagline)
├── FeaturedListings (horizontal scroll, 6-8 cards)
└── CategoryGrid (all categories as icon cards)

ListingCard (reusable, used everywhere)
├── Provider avatar + name
├── Title, price badge
├── Rating stars + review count
├── Tags (tradition, online/in-person)
└── Status indicator

ListingDetail
├── Image carousel
├── Title, provider info (link to profile)
├── Description (markdown rendered)
├── PackageSelector (if packages, show radio cards)
│   └── PackageCard × N (name, price, delivery, inclusions list)
├── CustomOfferSection (pricing_model === "contact" | "hourly")
├── BookButton → opens order form modal
├── ReviewSection
│   └── ReviewCard × N
└── Seller Info (profile card, traditions, KYC badge)

CreateListing (multi-step form)
├── Step 1: Basic Info (title, category, description)
├── Step 2: Pricing (model, price, delivery time)
├── Step 3: Packages (add/remove packages)
├── Step 4: Media (image uploads)
└── Step 5: Review & Publish

OrderDashboard
├── Tab: Buying (orders I placed)
├── Tab: Selling (orders to fulfill)
└── OrderCard × N (listing image, title, status badge, last message preview)

OrderDetail
├── Status timeline (visual step indicator)
├── Order info (listing, package, amount)
├── Buyer/Seller info
├── MessageThread (chat-like interface using existing DM patterns)
└── Action buttons (cancel, confirm delivery, complete, etc.)
```

---

## 💳 Phase 6 — Payment Integration

### Flow
1. Buyer clicks "Book Now" → order created with `status: pending`
2. Order shows "Awaiting Payment" with amount
3. Buyer clicks "Pay Now" → goes through existing `/api/payments/create-checkout`
4. On webhook success → order status → `confirmed`, seller notified
5. On completion → funds held in escrow (future) or released (MVP: release on confirm)

### Integration Points
- Use existing `payments.routes.ts` webhook pattern
- Add `order_id` metadata to checkout session
- On `payment_intent.succeeded` webhook, find order and update status to `confirmed`
- On `payment_intent.refunded`, update status to `refunded`

---

## 🔮 Phase 9 — Divination Integration (The "Much Better" Part)

### Oracle Recommends Providers
- When a user gets a `/reading`, the response can include: "The cards suggest you may benefit from a protection ritual. Here are 3 verified providers offering protection services."
- This uses the existing arcana/divination response format, appending marketplace results

### Seller Profile in Divination
- A seller's `traditions` array (from social profile) is cross-referenced with divination systems
- When viewing a Tarot reading, users see: "Need a deeper personal reading? Consult with @CelestialSeer — verified Tarot practitioner"

### Divination Before Ordering
- On a listing detail page, a small CTA: "Not sure? Consult the oracle about this provider first"
- Clicking opens a quick divination modal that uses the seller's profile data as context

---

## 🛠 Phase 8 — Admin & Moderation

### Admin Endpoints
```
GET    /api/admin/marketplace/listings/pending   → listings needing review (flagged)
POST   /api/admin/marketplace/listings/:id/flag  → flag for content review
POST   /api/admin/marketplace/listings/:id/ban   → remove listing, notify provider
GET    /api/admin/marketplace/disputes           → open disputes
POST   /api/admin/marketplace/disputes/:id/resolve → resolve in favor of buyer/seller
GET    /api/admin/marketplace/providers          → all providers with KYC status
POST   /api/admin/marketplace/providers/:id/kyc  → manually verify KYC
```

### Content Guidelines
- No harmful magical services (curses, love spells targeting specific individuals without consent)
- Providers must disclose traditions and methods honestly
- All listings must include clear what's-included / what's-not-included
- Prohibited: promises of specific outcomes ("guaranteed to make X fall in love with you")

---

## 🧪 Test Commands

```bash
# Verify marketplace module loads
npm run dev:server | grep "marketplace"

# Test listing creation
curl -s -X POST http://localhost:3001/api/marketplace/listings \
  -H "Content-Type: application/json" \
  -d '{"title":"Full Tarot Reading","category":"divination","description":"3-card spread with detailed analysis","pricing_model":"package","packages":[{"name":"Basic","price_cents":1500,"delivery_days":2,"inclusions":["3 cards","written analysis"]}]}'

# Test search
curl -s "http://localhost:3001/api/marketplace/listings?category=divination&sort=rating"

# Type check
npm run typecheck

# Build
npm run build
```

---

## 🚫 Anti-Patterns

| Anti-Pattern | Why | Instead |
|-------------|-----|---------|
| Allow anyone to list without verification | Risk of scams, unsafe practices | Require KYC + profile + tradition selection |
| Generic categories like "Spiritual Services" | Hard to discover | Tradition-based taxonomy (Hermetic, Norse, Folk, Kabbalistic, etc.) |
| Free-text pricing only | Confusing, no comparison | Structured pricing (fixed, hourly, package, contact) |
| Reviews from anyone | Fake reviews possible | Order-gated reviews only |
| No order communication trail | Disputes unresolvable | All messages scoped to order |
| Seller sets their own payout | Payment complexity | Use platform rate, escrow-held until completion |

---

## 📋 Implementation Notes for AI Agents

### Pattern Reference
All marketplace files follow the same patterns as existing code:

| Existing File | Marketplace Equivalent |
|---|---|
| `src/server/spells/types.ts` | `src/server/marketplace/types.ts` |
| `src/server/spells/spellsDb.ts` | `src/server/marketplace/marketplaceDb.ts` |
| `src/server/spells/init.ts` | `src/server/marketplace/init.ts` |
| `server/routes/spells.routes.ts` | `server/routes/marketplace.routes.ts` |
| `src/client/api/spellsClient.ts` | `src/client/api/marketplaceClient.ts` |

### Key Conventions
- IDs generated with `makeId("svc")` / `makeId("ord")` / etc.
- `isoNow()` for timestamps
- SQLite-compatible SQL (use `?` params, `pg()` helper for Postgres translation)
- All user IDs from `req.session!.sub`
- Dark theme UI with Tailwind classes following existing patterns (zinc/purple palette)
- `useSession()` / `useUserIdentity()` for auth context on frontend
- Zod schemas for server-side input validation (following existing API patterns)

### Provider Status Checks
When checking if user is a provider, call `getSocialDb().getProfile(userId)` and check:
- `profile.isServiceProvider === true`
- `profile.kycStatus === 'verified'` (for monetary transactions; tokens-only can skip KYC)

---

*Last updated: 2026-06-17*
*Next step: Phase 0 — Schema + DB layer*
