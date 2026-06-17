import type { SqlDriver } from "../db/sql/driver";
import type {
  Conversation,
  Friendship,
  KycStatus,
  SocialGroup,
  SocialMessage,
  SocialPost,
  SocialProfile,
  SocialProfilePublic,
} from "./types";

let socialDb: SocialDb | null = null;

export function initSocialDb(driver: SqlDriver) {
  socialDb = new SocialDb(driver);
  return socialDb;
}

export function getSocialDb(): SocialDb {
  if (!socialDb) throw new Error("Social DB not initialized.");
  return socialDb;
}

function isoNow() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "group";
}

type ProfileRow = {
  user_id: string;
  handle: string;
  display_name: string;
  bio: string;
  interests: string;
  traditions: string;
  is_service_provider: number;
  kyc_status: string;
  kyc_provider: string | null;
  created_at: string;
  updated_at: string;
};

function rowToProfile(row: ProfileRow): SocialProfile {
  return {
    userId: row.user_id,
    handle: row.handle,
    displayName: row.display_name,
    bio: row.bio,
    interests: JSON.parse(row.interests) as string[],
    traditions: JSON.parse(row.traditions) as string[],
    isServiceProvider: row.is_service_provider === 1,
    kycStatus: row.kyc_status as KycStatus,
    kycProvider: row.kyc_provider ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPublic(p: SocialProfile): SocialProfilePublic {
  return {
    userId: p.userId,
    handle: p.handle,
    displayName: p.displayName,
    bio: p.bio,
    interests: p.interests,
    traditions: p.traditions,
    isServiceProvider: p.isServiceProvider,
    kycStatus: p.kycStatus,
  };
}

const DEFAULT_GROUPS = [
  { slug: "manifestation", name: "Manifestation & Growth", emoji: "✨", description: "Law of attraction, scripting, vision boards, daily practice." },
  { slug: "tarot-oracles", name: "Tarot & Oracles", emoji: "🔮", description: "Readings, spreads, deck love, symbol study." },
  { slug: "meditation", name: "Meditation & Mind", emoji: "🧘", description: "Breathwork, hypnosis, NLP, shadow work." },
  { slug: "folk-magic", name: "Folk & Herbal Magic", emoji: "🌿", description: "Hoodoo, kitchen witchery, cunning craft, ancestors." },
  { slug: "astro-numerology", name: "Astro & Numerology", emoji: "⭐", description: "Charts, transits, life path, cosmic timing." },
];

export class SocialDb {
  constructor(private readonly driver: SqlDriver) {}

  private pg(sql: string, params: unknown[]) {
    if (this.driver.dialect === "postgres") {
      let i = 0;
      return { sql: sql.replace(/\?/g, () => `$${++i}`), params };
    }
    return { sql, params };
  }

  async seedDefaultGroups(systemUserId: string) {
    for (const g of DEFAULT_GROUPS) {
      const existing = await this.driver.get<{ id: string }>(
        this.pg("SELECT id FROM social_groups WHERE slug = ?", [g.slug]).sql,
        [g.slug],
      );
      if (existing) continue;
      const gid = id("grp");
      const now = isoNow();
      const { sql, params } = this.pg(
        "INSERT INTO social_groups (id, slug, name, description, owner_id, is_public, emoji, created_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)",
        [gid, g.slug, g.name, g.description, systemUserId, g.emoji, now],
      );
      await this.driver.exec(sql, params);
    }
  }

  async isBanned(userId: string) {
    const { sql, params } = this.pg("SELECT user_id FROM social_bans WHERE user_id = ?", [userId]);
    return Boolean(await this.driver.get(sql, params));
  }

  async banUser(userId: string, reason: string, bannedBy = "system") {
    const now = isoNow();
    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        "INSERT INTO social_bans (user_id, reason, banned_at, banned_by) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET reason = EXCLUDED.reason, banned_at = EXCLUDED.banned_at",
        [userId, reason, now, bannedBy],
      );
    } else {
      await this.driver.exec(
        "INSERT OR REPLACE INTO social_bans (user_id, reason, banned_at, banned_by) VALUES (?, ?, ?, ?)",
        [userId, reason, now, bannedBy],
      );
    }
  }

  async logModeration(args: {
    userId: string;
    contentType: string;
    contentId?: string;
    verdict: string;
    reason: string;
  }) {
    const { sql, params } = this.pg(
      "INSERT INTO social_moderation_events (id, user_id, content_type, content_id, verdict, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id("mod"), args.userId, args.contentType, args.contentId ?? null, args.verdict, args.reason, isoNow()],
    );
    await this.driver.exec(sql, params);
  }

  async getProfile(userId: string): Promise<SocialProfile | null> {
    const { sql, params } = this.pg("SELECT * FROM social_profiles WHERE user_id = ?", [userId]);
    const row = await this.driver.get<ProfileRow>(sql, params);
    return row ? rowToProfile(row) : null;
  }

  async getProfileByHandle(handle: string): Promise<SocialProfile | null> {
    const h = handle.toLowerCase().replace(/^@/, "");
    const { sql, params } = this.pg("SELECT * FROM social_profiles WHERE handle = ?", [h]);
    const row = await this.driver.get<ProfileRow>(sql, params);
    return row ? rowToProfile(row) : null;
  }

  async upsertProfile(userId: string, data: {
    handle: string;
    displayName: string;
    bio?: string;
    interests?: string[];
    traditions?: string[];
    isServiceProvider?: boolean;
  }): Promise<SocialProfile> {
    const handle = data.handle.toLowerCase().replace(/^@/, "").replace(/[^a-z0-9_]/g, "_").slice(0, 32);
    if (handle.length < 3) throw new Error("Handle must be at least 3 characters.");
    const now = isoNow();
    const existing = await this.getProfile(userId);
    if (existing) {
      const taken = await this.getProfileByHandle(handle);
      if (taken && taken.userId !== userId) throw new Error("Handle already taken.");
      const { sql, params } = this.pg(
        `UPDATE social_profiles SET handle = ?, display_name = ?, bio = ?, interests = ?, traditions = ?,
         is_service_provider = ?, updated_at = ? WHERE user_id = ?`,
        [
          handle,
          data.displayName.slice(0, 80),
          (data.bio ?? existing.bio).slice(0, 2000),
          JSON.stringify(data.interests ?? existing.interests),
          JSON.stringify(data.traditions ?? existing.traditions),
          data.isServiceProvider ? 1 : existing.isServiceProvider ? 1 : 0,
          now,
          userId,
        ],
      );
      await this.driver.exec(sql, params);
    } else {
      const taken = await this.getProfileByHandle(handle);
      if (taken) throw new Error("Handle already taken.");
      const { sql, params } = this.pg(
        `INSERT INTO social_profiles (user_id, handle, display_name, bio, interests, traditions, is_service_provider, kyc_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'none', ?, ?)`,
        [
          userId,
          handle,
          data.displayName.slice(0, 80),
          (data.bio ?? "").slice(0, 2000),
          JSON.stringify(data.interests ?? []),
          JSON.stringify(data.traditions ?? []),
          data.isServiceProvider ? 1 : 0,
          now,
          now,
        ],
      );
      await this.driver.exec(sql, params);
    }
    return (await this.getProfile(userId))!;
  }

  async searchProfiles(query: string, limit = 20): Promise<SocialProfilePublic[]> {
    const q = `%${query.toLowerCase()}%`;
    const { sql, params } = this.pg(
      "SELECT * FROM social_profiles WHERE lower(handle) LIKE ? OR lower(display_name) LIKE ? LIMIT ?",
      [q, q, limit],
    );
    const rows = await this.driver.all<ProfileRow>(sql, params);
    return rows.map((r) => toPublic(rowToProfile(r)));
  }

  async wipeUserData(userId: string) {
    const convs = await this.driver.all<{ conversation_id: string }>(
      this.pg("SELECT conversation_id FROM social_conversation_members WHERE user_id = ?", [userId]).sql,
      [userId],
    );
    for (const c of convs) {
      await this.driver.exec(
        this.pg("DELETE FROM social_messages WHERE conversation_id = ?", [c.conversation_id]).sql,
        [c.conversation_id],
      );
      await this.driver.exec(
        this.pg("DELETE FROM social_conversation_members WHERE conversation_id = ?", [c.conversation_id]).sql,
        [c.conversation_id],
      );
      await this.driver.exec(
        this.pg("DELETE FROM social_conversations WHERE id = ?", [c.conversation_id]).sql,
        [c.conversation_id],
      );
    }
    const tables = [
      ["DELETE FROM social_posts WHERE author_id = ?", [userId]],
      ["DELETE FROM social_group_members WHERE user_id = ?", [userId]],
      ["DELETE FROM social_friendships WHERE requester_id = ? OR addressee_id = ?", [userId, userId]],
      ["DELETE FROM social_moderation_events WHERE user_id = ?", [userId]],
      ["DELETE FROM social_profiles WHERE user_id = ?", [userId]],
      ["DELETE FROM social_bans WHERE user_id = ?", [userId]],
    ] as const;
    for (const [sql, params] of tables) {
      const q = this.pg(sql, [...params]);
      await this.driver.exec(q.sql, q.params);
    }
  }

  async requestFriend(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) throw new Error("Cannot friend yourself.");
    const { sql, params } = this.pg(
      "SELECT * FROM social_friendships WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)",
      [requesterId, addresseeId, addresseeId, requesterId],
    );
    const existing = await this.driver.get<{ id: string; status: string }>(sql, params);
    if (existing) throw new Error("Friendship already exists.");
    const now = isoNow();
    const fid = id("fr");
    const ins = this.pg(
      "INSERT INTO social_friendships (id, requester_id, addressee_id, status, created_at, updated_at) VALUES (?, ?, ?, 'pending', ?, ?)",
      [fid, requesterId, addresseeId, now, now],
    );
    await this.driver.exec(ins.sql, ins.params);
    return fid;
  }

  async respondFriend(userId: string, friendshipId: string, accept: boolean) {
    const row = await this.driver.get<{ addressee_id: string; status: string }>(
      this.pg("SELECT addressee_id, status FROM social_friendships WHERE id = ?", [friendshipId]).sql,
      [friendshipId],
    );
    if (!row || row.addressee_id !== userId) throw new Error("Friend request not found.");
    if (row.status !== "pending") throw new Error("Request already handled.");
    const status = accept ? "accepted" : "blocked";
    await this.driver.exec(
      this.pg("UPDATE social_friendships SET status = ?, updated_at = ? WHERE id = ?", [status, isoNow(), friendshipId]).sql,
      [status, isoNow(), friendshipId],
    );
  }

  async listFriends(userId: string): Promise<Friendship[]> {
    const { sql, params } = this.pg(
      `SELECT * FROM social_friendships WHERE (requester_id = ? OR addressee_id = ?) AND status = 'accepted' ORDER BY updated_at DESC`,
      [userId, userId],
    );
    const rows = await this.driver.all<{
      id: string;
      requester_id: string;
      addressee_id: string;
      status: string;
      created_at: string;
    }>(sql, params);
    const out: Friendship[] = [];
    for (const r of rows) {
      const peerId = r.requester_id === userId ? r.addressee_id : r.requester_id;
      const peer = await this.getProfile(peerId);
      out.push({
        id: r.id,
        requesterId: r.requester_id,
        addresseeId: r.addressee_id,
        status: "accepted",
        createdAt: r.created_at,
        peer: peer ? toPublic(peer) : undefined,
      });
    }
    return out;
  }

  async listPendingRequests(userId: string): Promise<Friendship[]> {
    const { sql, params } = this.pg(
      "SELECT * FROM social_friendships WHERE addressee_id = ? AND status = 'pending' ORDER BY created_at DESC",
      [userId],
    );
    const rows = await this.driver.all<{
      id: string;
      requester_id: string;
      addressee_id: string;
      created_at: string;
    }>(sql, params);
    const out: Friendship[] = [];
    for (const r of rows) {
      const peer = await this.getProfile(r.requester_id);
      out.push({
        id: r.id,
        requesterId: r.requester_id,
        addresseeId: r.addressee_id,
        status: "pending",
        createdAt: r.created_at,
        peer: peer ? toPublic(peer) : undefined,
      });
    }
    return out;
  }

  async listGroups(userId: string): Promise<SocialGroup[]> {
    const { sql, params } = this.pg("SELECT * FROM social_groups ORDER BY name ASC", []);
    const rows = await this.driver.all<{
      id: string;
      slug: string;
      name: string;
      description: string;
      owner_id: string;
      is_public: number;
      emoji: string;
      created_at: string;
    }>(sql, params);
    const out: SocialGroup[] = [];
    for (const r of rows) {
      const mc = await this.driver.get<{ c: number }>(
        this.pg("SELECT COUNT(*) as c FROM social_group_members WHERE group_id = ?", [r.id]).sql,
        [r.id],
      );
      const joined = Boolean(
        await this.driver.get(
          this.pg("SELECT user_id FROM social_group_members WHERE group_id = ? AND user_id = ?", [r.id, userId]).sql,
          [r.id, userId],
        ),
      );
      out.push({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        ownerId: r.owner_id,
        isPublic: r.is_public === 1,
        emoji: r.emoji,
        memberCount: mc?.c ?? 0,
        joined,
        createdAt: r.created_at,
      });
    }
    return out;
  }

  async joinGroup(userId: string, groupId: string) {
    const now = isoNow();
    const sql =
      this.driver.dialect === "postgres"
        ? "INSERT INTO social_group_members (group_id, user_id, role, joined_at) VALUES ($1, $2, 'member', $3) ON CONFLICT DO NOTHING"
        : "INSERT OR IGNORE INTO social_group_members (group_id, user_id, role, joined_at) VALUES (?, ?, 'member', ?)";
    await this.driver.exec(sql, [groupId, userId, now]);
  }

  async createGroup(userId: string, data: { name: string; description?: string; emoji?: string }) {
    const gid = id("grp");
    const slug = slugify(data.name) + "-" + gid.slice(-6);
    const now = isoNow();
    const ins = this.pg(
      "INSERT INTO social_groups (id, slug, name, description, owner_id, is_public, emoji, created_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)",
      [gid, slug, data.name.slice(0, 80), (data.description ?? "").slice(0, 500), userId, data.emoji ?? "🌙", now],
    );
    await this.driver.exec(ins.sql, ins.params);
    await this.joinGroup(userId, gid);
    return gid;
  }

  async createPost(userId: string, body: string, groupId?: string | null): Promise<SocialPost> {
    const pid = id("post");
    const now = isoNow();
    const ins = this.pg(
      "INSERT INTO social_posts (id, author_id, group_id, body, created_at) VALUES (?, ?, ?, ?, ?)",
      [pid, userId, groupId ?? null, body, now],
    );
    await this.driver.exec(ins.sql, ins.params);
    const posts = await this.getPostsByIds([pid], userId);
    return posts[0]!;
  }

  async getFeed(userId: string, limit = 50): Promise<SocialPost[]> {
    const friends = await this.listFriends(userId);
    const friendIds = friends.map((f) => (f.requesterId === userId ? f.addresseeId : f.requesterId));
    const groups = await this.driver.all<{ group_id: string }>(
      this.pg("SELECT group_id FROM social_group_members WHERE user_id = ?", [userId]).sql,
      [userId],
    );
    const groupIds = groups.map((g) => g.group_id);

    const clauses: string[] = [];
    const params: unknown[] = [];
    if (friendIds.length) {
      clauses.push(`author_id IN (${friendIds.map(() => "?").join(",")})`);
      params.push(...friendIds);
    }
    if (groupIds.length) {
      clauses.push(`group_id IN (${groupIds.map(() => "?").join(",")})`);
      params.push(...groupIds);
    }
    if (!clauses.length) {
      const { sql, params: p } = this.pg(
        "SELECT id FROM social_posts WHERE deleted_at IS NULL AND author_id = ? ORDER BY created_at DESC LIMIT ?",
        [userId, limit],
      );
      const ids = await this.driver.all<{ id: string }>(sql, p);
      return this.getPostsByIds(ids.map((i) => i.id), userId);
    }

    const where = clauses.join(" OR ");
    params.push(limit);
    const { sql, params: finalParams } = this.pg(
      `SELECT id FROM social_posts WHERE deleted_at IS NULL AND (${where}) ORDER BY created_at DESC LIMIT ?`,
      params,
    );
    const ids = await this.driver.all<{ id: string }>(sql, finalParams);
    return this.getPostsByIds(ids.map((i) => i.id), userId);
  }

  async getGroupPosts(groupId: string, userId: string, limit = 50): Promise<SocialPost[]> {
    const { sql, params } = this.pg(
      "SELECT id FROM social_posts WHERE group_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ?",
      [groupId, limit],
    );
    const ids = await this.driver.all<{ id: string }>(sql, params);
    return this.getPostsByIds(
      ids.map((i) => i.id),
      userId,
    );
  }

  private async getPostsByIds(postIds: string[], viewerId: string): Promise<SocialPost[]> {
    if (!postIds.length) return [];
    const placeholders = postIds.map(() => "?").join(",");
    const { sql, params } = this.pg(
      `SELECT p.*, g.name as group_name FROM social_posts p LEFT JOIN social_groups g ON g.id = p.group_id WHERE p.id IN (${placeholders}) ORDER BY p.created_at DESC`,
      postIds,
    );
    const rows = await this.driver.all<{
      id: string;
      author_id: string;
      group_id: string | null;
      body: string;
      created_at: string;
      group_name: string | null;
    }>(sql, params);
    const out: SocialPost[] = [];
    for (const r of rows) {
      const author = await this.getProfile(r.author_id);
      out.push({
        id: r.id,
        authorId: r.author_id,
        groupId: r.group_id,
        body: r.body,
        createdAt: r.created_at,
        author: author ? toPublic(author) : undefined,
        groupName: r.group_name ?? undefined,
      });
    }
    return out;
  }

  async findOrCreateDm(userId: string, peerId: string): Promise<string> {
    if (userId === peerId) throw new Error("Cannot message yourself.");
    const { sql, params } = this.pg(
      `SELECT c.id FROM social_conversations c
       JOIN social_conversation_members m1 ON m1.conversation_id = c.id AND m1.user_id = ?
       JOIN social_conversation_members m2 ON m2.conversation_id = c.id AND m2.user_id = ?`,
      [userId, peerId],
    );
    const existing = await this.driver.get<{ id: string }>(sql, params);
    if (existing) return existing.id;
    const cid = id("conv");
    const now = isoNow();
    await this.driver.exec(
      this.pg("INSERT INTO social_conversations (id, created_at, updated_at) VALUES (?, ?, ?)", [cid, now, now]).sql,
      [cid, now, now],
    );
    for (const uid of [userId, peerId]) {
      await this.driver.exec(
        this.pg("INSERT INTO social_conversation_members (conversation_id, user_id, last_read_at) VALUES (?, ?, ?)", [
          cid,
          uid,
          now,
        ]).sql,
        [cid, uid, now],
      );
    }
    return cid;
  }

  async listConversations(userId: string): Promise<Conversation[]> {
    const { sql, params } = this.pg(
      "SELECT conversation_id FROM social_conversation_members WHERE user_id = ?",
      [userId],
    );
    const memberships = await this.driver.all<{ conversation_id: string }>(sql, params);
    const out: Conversation[] = [];
    for (const m of memberships) {
      const conv = await this.driver.get<{ id: string; updated_at: string }>(
        this.pg("SELECT id, updated_at FROM social_conversations WHERE id = ?", [m.conversation_id]).sql,
        [m.conversation_id],
      );
      if (!conv) continue;
      const members = await this.driver.all<{ user_id: string }>(
        this.pg("SELECT user_id FROM social_conversation_members WHERE conversation_id = ?", [m.conversation_id]).sql,
        [m.conversation_id],
      );
      const peers: SocialProfilePublic[] = [];
      for (const mem of members) {
        if (mem.user_id === userId) continue;
        const p = await this.getProfile(mem.user_id);
        if (p) peers.push(toPublic(p));
      }
      const last = await this.driver.get<{ body: string; created_at: string; sender_id: string }>(
        this.pg(
          "SELECT body, created_at, sender_id FROM social_messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1",
          [m.conversation_id],
        ).sql,
        [m.conversation_id],
      );
      const myRead = await this.driver.get<{ last_read_at: string | null }>(
        this.pg("SELECT last_read_at FROM social_conversation_members WHERE conversation_id = ? AND user_id = ?", [
          m.conversation_id,
          userId,
        ]).sql,
        [m.conversation_id, userId],
      );
      out.push({
        id: conv.id,
        updatedAt: conv.updated_at,
        peers,
        lastMessage: last ? { body: last.body, createdAt: last.created_at, senderId: last.sender_id } : undefined,
        unread: Boolean(last && last.sender_id !== userId && (!myRead?.last_read_at || last.created_at > myRead.last_read_at)),
      });
    }
    return out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getMessages(userId: string, conversationId: string, limit = 100): Promise<SocialMessage[]> {
    const member = await this.driver.get(
      this.pg("SELECT user_id FROM social_conversation_members WHERE conversation_id = ? AND user_id = ?", [
        conversationId,
        userId,
      ]).sql,
      [conversationId, userId],
    );
    if (!member) throw new Error("Not a member of this conversation.");
    const now = isoNow();
    await this.driver.exec(
      this.pg("UPDATE social_conversation_members SET last_read_at = ? WHERE conversation_id = ? AND user_id = ?", [
        now,
        conversationId,
        userId,
      ]).sql,
      [now, conversationId, userId],
    );
    const { sql, params } = this.pg(
      "SELECT * FROM social_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?",
      [conversationId, limit],
    );
    const rows = await this.driver.all<{
      id: string;
      conversation_id: string;
      sender_id: string;
      body: string;
      created_at: string;
    }>(sql, params);
    const out: SocialMessage[] = [];
    for (const r of rows) {
      const sender = await this.getProfile(r.sender_id);
      out.push({
        id: r.id,
        conversationId: r.conversation_id,
        senderId: r.sender_id,
        body: r.body,
        createdAt: r.created_at,
        sender: sender ? toPublic(sender) : undefined,
      });
    }
    return out;
  }

  async sendMessage(userId: string, conversationId: string, body: string): Promise<SocialMessage> {
    const member = await this.driver.get(
      this.pg("SELECT user_id FROM social_conversation_members WHERE conversation_id = ? AND user_id = ?", [
        conversationId,
        userId,
      ]).sql,
      [conversationId, userId],
    );
    if (!member) throw new Error("Not a member of this conversation.");
    const mid = id("msg");
    const now = isoNow();
    await this.driver.exec(
      this.pg("INSERT INTO social_messages (id, conversation_id, sender_id, body, created_at) VALUES (?, ?, ?, ?, ?)", [
        mid,
        conversationId,
        userId,
        body,
        now,
      ]).sql,
      [mid, conversationId, userId, body, now],
    );
    await this.driver.exec(
      this.pg("UPDATE social_conversations SET updated_at = ? WHERE id = ?", [now, conversationId]).sql,
      [now, conversationId],
    );
    const sender = await this.getProfile(userId);
    return {
      id: mid,
      conversationId,
      senderId: userId,
      body,
      createdAt: now,
      sender: sender ? toPublic(sender) : undefined,
    };
  }

  async startKyc(userId: string, provider = "id.me") {
    const profile = await this.getProfile(userId);
    if (!profile) throw new Error("Create a profile first.");
    if (!profile.isServiceProvider) throw new Error("KYC is for magical service providers only.");
    const ref = `kyc_${userId.slice(0, 8)}_${Date.now()}`;
    await this.driver.exec(
      this.pg(
        "UPDATE social_profiles SET kyc_status = 'pending', kyc_provider = ?, kyc_ref = ?, updated_at = ? WHERE user_id = ?",
        [provider, ref, isoNow(), userId],
      ).sql,
      [provider, ref, isoNow(), userId],
    );
    const baseUrl = process.env.KYC_PROVIDER_URL ?? "https://api.id.me/oauth/authorize";
    return {
      provider,
      ref,
      status: "pending" as KycStatus,
      redirectUrl: `${baseUrl}?client_id=${process.env.KYC_CLIENT_ID ?? "CONFIGURE_ME"}&redirect_uri=${encodeURIComponent(process.env.KYC_REDIRECT_URI ?? "http://localhost:5173/circle/kyc/callback")}&state=${ref}`,
      note: "Configure KYC_CLIENT_ID and KYC_REDIRECT_URI for production. Verification handled externally — we never store ID documents.",
    };
  }

  async updateKycStatus(userId: string, status: KycStatus, provider?: string): Promise<void> {
    if (status === "verified") {
      await this.driver.exec(
        this.pg(
          "UPDATE social_profiles SET kyc_status = ?, kyc_provider = COALESCE(?, kyc_provider), updated_at = ? WHERE user_id = ?",
          [status, provider ?? null, isoNow(), userId],
        ).sql,
        [status, provider ?? null, isoNow(), userId],
      );
    } else {
      await this.driver.exec(
        this.pg(
          "UPDATE social_profiles SET kyc_status = ?, updated_at = ? WHERE user_id = ?",
          [status, isoNow(), userId],
        ).sql,
        [status, isoNow(), userId],
      );
    }
  }
}
