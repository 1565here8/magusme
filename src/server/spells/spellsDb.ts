import { randomUUID } from "node:crypto";
import type { SqlDriver } from "../db/sql/driver";
import type {
  SpellId,
  SpellRow,
  SpellTraditionRow,
  SpellSourceRow,
  SpellCategoryRow,
  SpellListItem,
  SpellReviewWithUser,
  SpellSearchParams,
} from "./types";

function makeId(prefix: string): SpellId {
  return `${prefix}_${randomUUID()}` as SpellId;
}

function isoNow(): string {
  return new Date().toISOString();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export class SpellsDb {
  constructor(private readonly driver: SqlDriver) {}

  private pg(
    sql: string,
    params: unknown[],
  ): { sql: string; params: unknown[] } {
    if (this.driver.dialect === "postgres") {
      let i = 0;
      return { sql: sql.replace(/\?/g, () => `$${++i}`), params };
    }
    return { sql, params };
  }

  private verifiedWhere(): string {
    return "s.verification_status = 'verified'";
  }

  async getSpells(
    params: SpellSearchParams,
  ): Promise<{ spells: SpellListItem[]; total: number }> {
    type SpellRow = Omit<SpellListItem, "tags"> & { tags: string };
    const conditions: string[] = [this.verifiedWhere()];
    const values: unknown[] = [];

    if (params.query) {
      conditions.push("(s.title LIKE ? OR s.summary LIKE ? OR s.tags LIKE ?)");
      values.push(
        `%${params.query}%`,
        `%${params.query}%`,
        `%${params.query}%`,
      );
    }
    if (params.category && params.category !== "all") {
      conditions.push("sc.slug = ?");
      values.push(params.category);
    }
    if (params.tradition && params.tradition !== "All") {
      conditions.push("st.name = ?");
      values.push(params.tradition);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;

    const orderBy = (() => {
      switch (params.sort) {
        case "Popularity":
          return "s.review_count DESC";
        case "Highest Rated":
          return "s.rating DESC";
        case "Difficulty (Easy first)":
          return "s.difficulty_level ASC";
        case "Danger Level":
          return "s.danger_level DESC";
        case "Newest":
          return "s.created_at DESC";
        default:
          return "s.rating DESC, s.review_count DESC";
      }
    })();

    const limit = Math.min(params.limit ?? 20, 100);
    const offset = params.offset ?? 0;

    const countSql = `SELECT COUNT(*) AS total FROM spells s LEFT JOIN spell_categories sc ON s.category_id = sc.id LEFT JOIN spell_traditions st ON s.tradition_id = st.id ${where}`;
    const { sql: countSqlFinal, params: countParams } = this.pg(
      countSql,
      values,
    );
    const { total } = (await this.driver.get<{ total: number }>(
      countSqlFinal,
      countParams,
    )) ?? { total: 0 };

    const querySql = `SELECT s.id, s.title, s.slug, st.name AS tradition, sc.name AS category, s.rating, s.review_count, s.difficulty, s.danger, s.element, s.timing, s.counter_spell, s.warning, ss.title AS source, s.tags, s.summary, s.reference_link, s.verified, s.verification_status, s.verification_source FROM spells s LEFT JOIN spell_traditions st ON s.tradition_id = st.id LEFT JOIN spell_categories sc ON s.category_id = sc.id LEFT JOIN spell_sources ss ON s.source_id = ss.id ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    const { sql: querySqlFinal, params: queryParams } = this.pg(querySql, [
      ...values,
      limit,
      offset,
    ]);
    const rows = await this.driver.all<SpellRow>(querySqlFinal, queryParams);

    return {
      spells: rows.map((r) => ({
        ...r,
        tags: r.tags ? r.tags.split(",") : [],
      })),
      total,
    };
  }

  async getSpellBySlug(slug: string): Promise<
    | (SpellListItem & {
        difficulty_level: number;
        danger_level: number;
        full_text: string | null;
      })
    | undefined
  > {
    const { sql, params } = this.pg(
      `SELECT s.id, s.title, s.slug, st.name AS tradition, sc.name AS category, s.rating, s.review_count, s.difficulty, s.danger, s.difficulty_level, s.danger_level, s.element, s.timing, s.counter_spell, s.warning, ss.title AS source, s.tags, s.summary, s.full_text, s.reference_link, s.verified, s.verification_status, s.verification_source, s.verified_by, s.verified_at FROM spells s LEFT JOIN spell_traditions st ON s.tradition_id = st.id LEFT JOIN spell_categories sc ON s.category_id = sc.id LEFT JOIN spell_sources ss ON s.source_id = ss.id WHERE s.slug = ? AND ${this.verifiedWhere()}`,
      [slug],
    );
    const row = await this.driver.get<
      Omit<SpellListItem, "tags"> & {
        tags: string;
        difficulty_level: number;
        danger_level: number;
        full_text: string | null;
      }
    >(sql, params);
    if (!row) return undefined;
    return { ...row, tags: row.tags ? row.tags.split(",") : [] };
  }

  async getCategories(): Promise<SpellCategoryRow[]> {
    return this.driver.all<SpellCategoryRow>(
      "SELECT * FROM spell_categories ORDER BY sort_order ASC",
    );
  }

  async getCategoriesWithCounts(): Promise<
    (SpellCategoryRow & { count: number })[]
  > {
    return this.driver.all<SpellCategoryRow & { count: number }>(
      `SELECT sc.*, COUNT(s.id) AS count FROM spell_categories sc LEFT JOIN spells s ON s.category_id = sc.id AND ${this.verifiedWhere()} GROUP BY sc.id ORDER BY sc.sort_order ASC`,
    );
  }

  async getTraditions(): Promise<SpellTraditionRow[]> {
    return this.driver.all<SpellTraditionRow>(
      "SELECT * FROM spell_traditions ORDER BY name ASC",
    );
  }

  async upsertTradition(name: string): Promise<string> {
    const slug = slugify(name);
    const existing = await this.driver.get<SpellTraditionRow>(
      "SELECT * FROM spell_traditions WHERE slug = ?",
      [slug],
    );
    if (existing) return existing.id;
    const id = makeId("trad");
    try {
      await this.driver.exec(
        "INSERT INTO spell_traditions (id, name, slug, created_at) VALUES (?, ?, ?, ?)",
        [id, name, slug, isoNow()],
      );
    } catch {
      const retry = await this.driver.get<SpellTraditionRow>(
        "SELECT * FROM spell_traditions WHERE slug = ?",
        [slug],
      );
      if (retry) return retry.id;
      throw new Error(`Failed to upsert tradition: ${name}`);
    }
    return id;
  }

  async upsertSource(
    title: string,
    author?: string,
    verified?: boolean,
  ): Promise<string> {
    const existing = await this.driver.get<SpellSourceRow>(
      "SELECT * FROM spell_sources WHERE title = ?",
      [title],
    );
    if (existing) return existing.id;
    const id = makeId("src");
    try {
      await this.driver.exec(
        "INSERT INTO spell_sources (id, title, author, verified, created_at) VALUES (?, ?, ?, ?, ?)",
        [id, title, author ?? null, verified ? 1 : 0, isoNow()],
      );
    } catch {
      const retry = await this.driver.get<SpellSourceRow>(
        "SELECT * FROM spell_sources WHERE title = ?",
        [title],
      );
      if (retry) return retry.id;
      throw new Error(`Failed to upsert source: ${title}`);
    }
    return id;
  }

  async upsertCategory(name: string, sortOrder?: number): Promise<string> {
    const slug = slugify(name);
    const existing = await this.driver.get<SpellCategoryRow>(
      "SELECT * FROM spell_categories WHERE slug = ?",
      [slug],
    );
    if (existing) return existing.id;
    const id = makeId("cat");
    try {
      await this.driver.exec(
        "INSERT INTO spell_categories (id, name, slug, sort_order, created_at) VALUES (?, ?, ?, ?, ?)",
        [id, name, slug, sortOrder ?? 0, isoNow()],
      );
    } catch {
      const retry = await this.driver.get<SpellCategoryRow>(
        "SELECT * FROM spell_categories WHERE slug = ?",
        [slug],
      );
      if (retry) return retry.id;
      throw new Error(`Failed to upsert category: ${name}`);
    }
    return id;
  }

  async upsertSpell(spell: {
    title: string;
    traditionId: string | null;
    sourceId: string | null;
    categoryId: string | null;
    rating: number;
    reviewCount: number;
    difficulty: string;
    difficultyLevel: number;
    danger: string;
    dangerLevel: number;
    element: string | null;
    timing: string | null;
    counterSpell: string | null;
    warning: string | null;
    summary: string | null;
    tags: string[];
    fullText?: string | null;
    referenceLink?: string | null;
    verified?: boolean;
    verificationStatus?: "pending" | "verified" | "rejected";
    verificationSource?: string | null;
  }): Promise<string> {
    const slug = slugify(spell.title);
    const existing = await this.driver.get<SpellRow>(
      "SELECT id FROM spells WHERE slug = ?",
      [slug],
    );
    const now = isoNow();

    const isVerified = spell.verified === true;
    const verificationStatus =
      spell.verificationStatus ?? (isVerified ? "verified" : "pending");
    const verificationSource = spell.verificationSource ?? null;
    const verifiedBy = isVerified ? "system" : null;
    const verifiedAt = isVerified ? now : null;

    if (existing) {
      await this.driver.exec(
        `UPDATE spells SET tradition_id=?, source_id=?, category_id=?, rating=?, review_count=?, difficulty=?, difficulty_level=?, danger=?, danger_level=?, element=?, timing=?, counter_spell=?, warning=?, summary=?, tags=?, full_text=?, reference_link=?, verified=?, verification_status=?, verification_source=?, verified_by=?, verified_at=?, updated_at=? WHERE slug=?`,
        [
          spell.traditionId,
          spell.sourceId,
          spell.categoryId,
          spell.rating,
          spell.reviewCount,
          spell.difficulty,
          spell.difficultyLevel,
          spell.danger,
          spell.dangerLevel,
          spell.element,
          spell.timing,
          spell.counterSpell,
          spell.warning,
          spell.summary,
          spell.tags.join(","),
          spell.fullText ?? null,
          spell.referenceLink ?? null,
          isVerified ? 1 : 0,
          verificationStatus,
          verificationSource,
          verifiedBy,
          verifiedAt,
          now,
          slug,
        ],
      );
      return existing.id;
    }

    const id = makeId("sp");
    try {
      await this.driver.exec(
        `INSERT INTO spells (id, title, slug, tradition_id, source_id, category_id, rating, review_count, difficulty, difficulty_level, danger, danger_level, element, timing, counter_spell, warning, summary, tags, full_text, reference_link, verified, verification_status, verification_source, verified_by, verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          spell.title,
          slug,
          spell.traditionId,
          spell.sourceId,
          spell.categoryId,
          spell.rating,
          spell.reviewCount,
          spell.difficulty,
          spell.difficultyLevel,
          spell.danger,
          spell.dangerLevel,
          spell.element,
          spell.timing,
          spell.counterSpell,
          spell.warning,
          spell.summary,
          spell.tags.join(","),
          spell.fullText ?? null,
          spell.referenceLink ?? null,
          isVerified ? 1 : 0,
          verificationStatus,
          verificationSource,
          verifiedBy,
          verifiedAt,
          now,
          now,
        ],
      );
    } catch {
      const retry = await this.driver.get<{ id: string }>(
        "SELECT id FROM spells WHERE slug = ?",
        [slug],
      );
      if (retry) return retry.id;
      throw new Error(`Failed to upsert spell: ${spell.title}`);
    }
    return id;
  }

  async getRandomSpell(params: {
    element?: string;
    category?: string;
  }): Promise<SpellListItem | undefined> {
    const conditions: string[] = [this.verifiedWhere()];
    const values: unknown[] = [];

    if (params.element && params.element !== "All") {
      conditions.push("s.element LIKE ?");
      values.push(`%${params.element}%`);
    }
    if (params.category && params.category !== "all") {
      conditions.push("sc.slug = ?");
      values.push(params.category);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;
    const { sql, params: queryParams } = this.pg(
      `SELECT s.id, s.title, s.slug, st.name AS tradition, sc.name AS category, s.rating, s.review_count, s.difficulty, s.danger, s.element, s.timing, s.counter_spell, s.warning, ss.title AS source, s.tags, s.summary, s.reference_link, s.verified, s.verification_status, s.verification_source FROM spells s LEFT JOIN spell_traditions st ON s.tradition_id = st.id LEFT JOIN spell_categories sc ON s.category_id = sc.id LEFT JOIN spell_sources ss ON s.source_id = ss.id ${where} ORDER BY RANDOM() LIMIT 1`,
      values,
    );
    const row = await this.driver.get<
      Omit<SpellListItem, "tags"> & { tags: string }
    >(sql, queryParams);
    if (!row) return undefined;
    return { ...row, tags: row.tags ? row.tags.split(",") : [] };
  }

  async updateFullText(slug: string, fullText: string): Promise<void> {
    const { sql, params } = this.pg(
      "UPDATE spells SET full_text = ?, updated_at = ? WHERE slug = ?",
      [fullText, isoNow(), slug],
    );
    await this.driver.exec(sql, params);
  }

  async count(): Promise<number> {
    const row = await this.driver.get<{ count: number }>(
      `SELECT COUNT(*) AS count FROM spells AS s WHERE ${this.verifiedWhere()}`,
    );
    return row?.count ?? 0;
  }

  async getAllSpellSlugs(): Promise<string[]> {
    const rows = await this.driver.all<{ slug: string }>(
      `SELECT slug FROM spells AS s WHERE ${this.verifiedWhere()} ORDER BY slug`,
    );
    return rows.map((r) => r.slug);
  }

  async getSpellsWithReferences(
    limit = 100,
    offset = 0,
  ): Promise<{ spells: SpellListItem[]; total: number }> {
    const where = `WHERE s.reference_link IS NOT NULL AND s.reference_link != '' AND ${this.verifiedWhere()}`;
    const countResult = await this.driver.get<{ total: number }>(
      `SELECT COUNT(*) AS total FROM spells s ${where}`,
    );
    const total = countResult?.total ?? 0;
    const rows = await this.driver.all<
      Omit<SpellListItem, "tags"> & { tags: string }
    >(
      `SELECT s.id, s.title, s.slug, st.name AS tradition, sc.name AS category, s.rating, s.review_count, s.difficulty, s.danger, s.element, s.timing, s.counter_spell, s.warning, ss.title AS source, s.tags, s.summary, s.reference_link, s.verified, s.verification_status, s.verification_source FROM spells s LEFT JOIN spell_traditions st ON s.tradition_id = st.id LEFT JOIN spell_categories sc ON s.category_id = sc.id LEFT JOIN spell_sources ss ON s.source_id = ss.id ${where} ORDER BY s.title ASC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return {
      spells: rows.map((r) => ({
        ...r,
        tags: r.tags ? r.tags.split(",") : [],
      })),
      total,
    };
  }

  async getReviewsBySpellId(
    spellId: string,
    limit = 20,
    offset = 0,
  ): Promise<{ reviews: SpellReviewWithUser[]; total: number }> {
    const countResult = await this.driver.get<{ total: number }>(
      "SELECT COUNT(*) AS total FROM spell_reviews WHERE spell_id = ?",
      [spellId],
    );
    const total = countResult?.total ?? 0;
    const rows = await this.driver.all<SpellReviewWithUser>(
      `SELECT r.id, r.spell_id, r.user_id, r.rating, r.body, r.created_at, u.created_at AS user_created_at
       FROM spell_reviews r JOIN users u ON r.user_id = u.id
       WHERE r.spell_id = ? ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [spellId, limit, offset],
    );
    return { reviews: rows, total };
  }

  async addReview(
    spellId: string,
    userId: string,
    rating: number,
    body: string,
  ): Promise<SpellReviewWithUser> {
    const id = makeId("rev");
    const now = isoNow();
    await this.driver.exec(
      "INSERT INTO spell_reviews (id, spell_id, user_id, rating, body, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, spellId, userId, rating, body, now],
    );
    const agg = await this.driver.get<{
      avg_rating: number;
      review_count: number;
    }>(
      "SELECT AVG(CAST(rating AS REAL)) AS avg_rating, COUNT(*) AS review_count FROM spell_reviews WHERE spell_id = ?",
      [spellId],
    );
    if (agg) {
      await this.driver.exec(
        "UPDATE spells SET rating = ?, review_count = ?, updated_at = ? WHERE id = ?",
        [Math.round(agg.avg_rating * 10) / 10, agg.review_count, now, spellId],
      );
    }
    return {
      id,
      spell_id: spellId,
      user_id: userId,
      rating,
      body,
      created_at: now,
      user_created_at: "",
    };
  }

  async getSpellIdBySlug(slug: string): Promise<string | undefined> {
    const row = await this.driver.get<{ id: string }>(
      `SELECT id FROM spells AS s WHERE slug = ? AND ${this.verifiedWhere()}`,
      [slug],
    );
    return row?.id;
  }

  async getPendingSpells(
    limit = 100,
    offset = 0,
  ): Promise<{ spells: SpellListItem[]; total: number }> {
    const where = "WHERE s.verification_status = 'pending'";
    const countResult = await this.driver.get<{ total: number }>(
      `SELECT COUNT(*) AS total FROM spells s ${where}`,
    );
    const total = countResult?.total ?? 0;
    const rows = await this.driver.all<
      Omit<SpellListItem, "tags"> & {
        tags: string;
        verification_status: string;
        verification_source: string | null;
      }
    >(
      `SELECT s.id, s.title, s.slug, st.name AS tradition, sc.name AS category, s.rating, s.review_count, s.difficulty, s.danger, s.element, s.timing, s.counter_spell, s.warning, ss.title AS source, s.tags, s.summary, s.reference_link, s.verified, s.verification_status, s.verification_source FROM spells s LEFT JOIN spell_traditions st ON s.tradition_id = st.id LEFT JOIN spell_categories sc ON s.category_id = sc.id LEFT JOIN spell_sources ss ON s.source_id = ss.id ${where} ORDER BY s.created_at ASC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return {
      spells: rows.map((r) => ({
        ...r,
        tags: r.tags ? r.tags.split(",") : [],
      })),
      total,
    };
  }

  async verifySpell(
    slug: string,
    verifiedBy: string,
    verificationSource: string,
  ): Promise<void> {
    const now = isoNow();
    await this.driver.exec(
      `UPDATE spells SET verified = 1, verification_status = 'verified', verification_source = ?, verified_by = ?, verified_at = ?, updated_at = ? WHERE slug = ?`,
      [verificationSource, verifiedBy, now, now, slug],
    );
  }

  async rejectSpell(
    slug: string,
    verifiedBy: string,
    reason: string,
  ): Promise<void> {
    const now = isoNow();
    await this.driver.exec(
      `UPDATE spells SET verified = 0, verification_status = 'rejected', verification_source = ?, verified_by = ?, verified_at = ?, updated_at = ? WHERE slug = ?`,
      [reason, verifiedBy, now, now, slug],
    );
  }
}

let instance: SpellsDb | null = null;

export function initSpellsDb(driver: SqlDriver): SpellsDb {
  instance = new SpellsDb(driver);
  return instance;
}

export function getSpellsDb(): SpellsDb {
  if (!instance)
    throw new Error("SpellsDb not initialized. Call initSpellsDb() first.");
  return instance;
}
