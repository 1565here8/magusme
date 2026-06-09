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
`;
