export const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  token_balance INTEGER NOT NULL,
  tokens_updated_at TEXT NOT NULL,
  created_from_ip TEXT
);

CREATE TABLE IF NOT EXISTS text_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  finished_at TEXT,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS admin_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tokens_delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ip_bootstrap (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS revoked_tokens (
  jti TEXT PRIMARY KEY,
  revoked_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_mode_status ON jobs(mode, status);
CREATE INDEX IF NOT EXISTS idx_jobs_finished_at ON jobs(finished_at);
CREATE INDEX IF NOT EXISTS idx_text_history_user_created ON text_history(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_revoked_at ON revoked_tokens(revoked_at);

CREATE TABLE IF NOT EXISTS arcana_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tradition TEXT NOT NULL,
  category TEXT NOT NULL,
  intent_tags TEXT NOT NULL,
  summary TEXT NOT NULL,
  preview_text TEXT NOT NULL,
  full_text TEXT NOT NULL,
  source_title TEXT NOT NULL,
  source_author TEXT,
  source_year TEXT,
  source_institution TEXT,
  source_url TEXT,
  source_pdf_ref TEXT,
  is_baneful INTEGER NOT NULL DEFAULT 0,
  is_kabbalistic INTEGER NOT NULL DEFAULT 0,
  backlash_text TEXT NOT NULL DEFAULT '',
  alternatives_text TEXT NOT NULL DEFAULT '',
  planetary_timing TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  indexed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arcana_consultations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  query TEXT NOT NULL,
  response_preview TEXT NOT NULL,
  recommended_entry_ids TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arcana_purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  entry_id TEXT,
  purchase_type TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  consultation_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arcana_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  consultation_id TEXT NOT NULL,
  plan_markdown TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arcana_index_runs (
  id TEXT PRIMARY KEY,
  sources_checked INTEGER NOT NULL,
  entries_added INTEGER NOT NULL,
  finished_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS arcana_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_arcana_entries_tradition ON arcana_entries(tradition);
CREATE INDEX IF NOT EXISTS idx_arcana_entries_category ON arcana_entries(category);
CREATE INDEX IF NOT EXISTS idx_arcana_purchases_user ON arcana_purchases(user_id, purchase_type);
CREATE INDEX IF NOT EXISTS idx_arcana_consultations_user ON arcana_consultations(user_id, created_at);

CREATE TABLE IF NOT EXISTS social_profiles (
  user_id TEXT PRIMARY KEY,
  handle TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  interests TEXT NOT NULL DEFAULT '[]',
  traditions TEXT NOT NULL DEFAULT '[]',
  is_service_provider INTEGER NOT NULL DEFAULT 0,
  kyc_status TEXT NOT NULL DEFAULT 'none',
  kyc_provider TEXT,
  kyc_ref TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS social_bans (
  user_id TEXT PRIMARY KEY,
  reason TEXT NOT NULL,
  banned_at TEXT NOT NULL,
  banned_by TEXT NOT NULL DEFAULT 'system'
);

CREATE TABLE IF NOT EXISTS social_friendships (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  addressee_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(requester_id, addressee_id)
);

CREATE TABLE IF NOT EXISTS social_groups (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  owner_id TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 1,
  emoji TEXT NOT NULL DEFAULT '🌙',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS social_group_members (
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TEXT NOT NULL,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS social_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  group_id TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS social_conversations (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS social_conversation_members (
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_read_at TEXT,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS social_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  flagged INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS social_moderation_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT,
  verdict TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_social_posts_created ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_group ON social_posts(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_author ON social_posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_messages_conv ON social_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_social_friendships_users ON social_friendships(requester_id, addressee_id);
CREATE INDEX IF NOT EXISTS idx_social_profiles_handle ON social_profiles(handle);

-- Reviews table
CREATE TABLE IF NOT EXISTS arcana_reviews (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  body TEXT NOT NULL,
  experience TEXT,
  verified INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_arcana_reviews_entry ON arcana_reviews(entry_id, created_at DESC);

-- Spell traditions
CREATE TABLE IF NOT EXISTS spell_traditions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL
);

-- Spell sources
CREATE TABLE IF NOT EXISTS spell_sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  year TEXT,
  institution TEXT,
  url TEXT,
  pdf_ref TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Spell categories
CREATE TABLE IF NOT EXISTS spell_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- Spells
CREATE TABLE IF NOT EXISTS spells (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tradition_id TEXT REFERENCES spell_traditions(id),
  source_id TEXT REFERENCES spell_sources(id),
  category_id TEXT REFERENCES spell_categories(id),
  rating REAL NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT,
  difficulty_level INTEGER DEFAULT 1,
  danger TEXT,
  danger_level INTEGER DEFAULT 0,
  element TEXT,
  timing TEXT,
  counter_spell TEXT,
  warning TEXT,
  summary TEXT,
  tags TEXT,
  full_text TEXT,
  reference_link TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_source TEXT,
  verified_by TEXT,
  verified_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_spells_category ON spells(category_id);
CREATE INDEX IF NOT EXISTS idx_spells_tradition ON spells(tradition_id);
CREATE INDEX IF NOT EXISTS idx_spells_rating ON spells(rating DESC);
CREATE INDEX IF NOT EXISTS idx_spells_created ON spells(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spells_verification ON spells(verification_status);
CREATE INDEX IF NOT EXISTS idx_spells_verified ON spells(verified);

CREATE TABLE IF NOT EXISTS spell_reviews (
  id TEXT PRIMARY KEY,
  spell_id TEXT NOT NULL REFERENCES spells(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_spell_reviews_spell ON spell_reviews(spell_id, created_at DESC);

-- Marketplace: service categories (seeded, not user-created)
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

-- Marketplace: service listings (one provider can have many)
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
  updated_at TEXT NOT NULL,
  scheduled_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_svc_listings_provider ON service_listings(provider_id);
CREATE INDEX IF NOT EXISTS idx_svc_listings_category ON service_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_svc_listings_status ON service_listings(status);
CREATE INDEX IF NOT EXISTS idx_svc_listings_rating ON service_listings(rating DESC);

-- Marketplace: service packages (tiered offerings per listing)
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

-- Marketplace: orders (transaction record)
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
  auto_release_at TEXT,
  created_at TEXT NOT NULL,
  confirmed_at TEXT,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_svc_orders_buyer ON service_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_svc_orders_listing ON service_orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_svc_orders_status ON service_orders(status);

-- Marketplace: order-gated messages
CREATE TABLE IF NOT EXISTS service_order_messages (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES service_orders(id),
  sender_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_svc_msgs_order ON service_order_messages(order_id, created_at);

-- Marketplace: reviews (one per order, gated to completed)
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

-- Marketplace: payout accounts (sellers register to receive funds)
CREATE TABLE IF NOT EXISTS marketplace_payout_accounts (
  user_id TEXT PRIMARY KEY REFERENCES social_profiles(user_id),
  email TEXT NOT NULL,
  blockchain_code TEXT NOT NULL DEFAULT 'BASE',
  currency_code TEXT NOT NULL DEFAULT 'USDC',
  wallet_address TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Marketplace: payment invoices for orders
CREATE TABLE IF NOT EXISTS marketplace_invoices (
  reference_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES service_orders(id),
  buyer_id TEXT NOT NULL REFERENCES users(id),
  seller_id TEXT NOT NULL REFERENCES users(id),
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL DEFAULT 0,
  seller_payout_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','settled','refunded','expired')),
  checkout_url TEXT,
  paid_at TEXT,
  settled_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mkt_invoices_order ON marketplace_invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_mkt_invoices_buyer ON marketplace_invoices(buyer_id);
CREATE INDEX IF NOT EXISTS idx_mkt_invoices_seller ON marketplace_invoices(seller_id);
CREATE INDEX IF NOT EXISTS idx_mkt_invoices_status ON marketplace_invoices(status);

-- Marketplace: user notifications
CREATE TABLE IF NOT EXISTS marketplace_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mkt_notif_user ON marketplace_notifications(user_id, is_read);
`;
