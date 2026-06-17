# Magic Shop — Agent Reference

## Quick Start
All roadmap and architecture: **`MAGIC_SHOP_ROADMAP.md`**

## Files Created So Far (Phase 0)

| File | Purpose |
|------|---------|
| `src/server/marketplace/types.ts` | All TypeScript interfaces |
| `src/server/db/sql/schema.ts` | Marketplace DDL (appended at bottom) |
| `src/server/marketplace/marketplaceDb.ts` | Full CRUD database class |
| `src/server/marketplace/init.ts` | Module initializer, seeds categories |
| `server/app.ts` | Calls `initMarketplaceModule()` on startup |

## Completed Phases

### Phase 0 — Foundation ✅
- `src/server/marketplace/types.ts` — all TypeScript interfaces
- `src/server/db/sql/schema.ts` — 6 marketplace tables appended
- `src/server/marketplace/marketplaceDb.ts` — full CRUD (25+ methods)
- `src/server/marketplace/init.ts` — init + seed 10 categories
- `server/app.ts` — registers module on startup

### Phase 1 — Server API ✅
- `server/routes/marketplace.routes.ts` — all routes:
  - Categories: GET list, GET by slug
  - Browse: search, featured, detail, reviews
  - Listings CRUD: create, update, status, packages (all requireServiceProvider)
  - Orders: place (auth), cancel (buyer), status update (seller, with state machine validation)
  - Messages: list, send (auth, order participants)
  - Reviews: create (buyer, order-gated, unique per order)
  - Providers: search, profile by handle
  - Admin: provider list, disputes, resolve disputes
  - KYC status check
  - Notes update (seller)
- `server/middleware/provider.ts` — requireServiceProvider (checks auth + isServiceProvider + kyc verified)
- `src/client/api/marketplaceClient.ts` — complete frontend API client

### Phase 2 — Frontend Pages ✅
- `src/client/pages/MarketplaceHome.tsx` — hero, category grid, featured, new listings, provider CTA
- `src/client/pages/MarketplaceSearch.tsx` — search with filters (category, pricing model, sort, query)
- `src/client/pages/MarketplaceListingDetail.tsx` — full detail with image carousel, packages, booking form, reviews, provider card
- `src/client/pages/MarketplaceCreateListing.tsx` — 4-step form (basics, pricing, packages, review)
- `src/client/pages/MarketplaceOrders.tsx` — buying/selling tabs with status filters
- `src/client/pages/MarketplaceOrderDetail.tsx` — status timeline, message thread, actions, review form
- `src/client/App.tsx` — routes at `/marketplace/*`
- `src/client/components/MagusMeHeader.tsx` — "Shop" nav item

### Phase 6 — Payments ✅
- `src/server/db/sql/schema.ts` — `marketplace_payout_accounts` + `marketplace_invoices` tables (added `settled_at` column)
- `src/server/marketplace/marketplacePayments.ts` — payout account CRUD, invoice creation, 5% fee calc, webhook handler, auto-payout trigger, `settledAt` tracking
- `server/routes/marketplace.routes.ts` — GET/PUT `/payout-account`, POST `/create-checkout`, GET `/invoice/:orderId`, GET `/status`
- `server/routes/payments.routes.ts` — webhook dispatches to `handleMarketplaceWebhook()` for marketplace invoices
- `src/client/pages/MarketplaceOrderDetail.tsx` — payment section with buyer "Pay Now", seller payout info (status, amount, settlement date)
- `src/client/pages/MarketplacePayoutSetup.tsx` — seller payout config (email, blockchain, currency, wallet)
- `src/client/pages/MarketplaceOrders.tsx` — "Payout Setup" link in header
- `src/client/App.tsx` — route `/marketplace/payments/payout`
- `src/server/marketplace/init.ts` — migration: `ALTER TABLE marketplace_invoices ADD COLUMN settled_at TEXT`

### Phase 8 — Admin Marketplace ✅
- `server/routes/marketplace.routes.ts` — `PUT /api/admin/marketplace/kyc/:userId` (approve/reject KYC)
- `src/server/social/socialDb.ts` — `updateKycStatus()` method for admin KYC management
- `src/client/pages/AdminMarketplace.tsx` — admin page with:
  - **Disputes tab**: list disputed orders, resolve as "completed" or "refunded", link to order detail
  - **Providers tab**: search providers, approve/reject/revoke KYC with status badges
- `src/client/api/marketplaceClient.ts` — `fetchAdminProviders`, `fetchAdminDisputes`, `resolveDispute`, `updateKycStatus`
- `src/client/App.tsx` — route `/marketplace/admin`

### Phase 9 — Divination Integration ✅
- `src/server/marketplace/marketplaceDb.ts` — `searchProvidersByTraditions()` method matching providers by tradition tags
- `server/routes/marketplace.routes.ts` — `GET /api/marketplace/divination-providers?q=...&limit=...`
- `src/client/api/marketplaceClient.ts` — `fetchDivinationProviders()`
- `src/client/pages/GenericDivinationPage.tsx` — "Recommended Service Providers" section below interpretation, filtered by divination system's category/tradition

### Pre-existing (unrelated)
- TypeScript errors in `oracleCardsData.ts`, `elderFuthark.ts`, `MarketplaceCreateListing.tsx` — pre-existing

## Patterns
- All DB methods follow `spellsDb.ts` / `socialDb.ts` patterns
- Auth via `req.session!.sub` (userId)
- Provider check via `getSocialDb().getProfile(userId)` → `isServiceProvider`
- KYC status: `none → pending → verified | rejected`
- SQLite-compatible with `pg()` helper for Postgres
- IDs: `makeId("svc")`, `makeId("ord")`, `makeId("svcp")`, `makeId("svcr")`, `makeId("svcm")`
