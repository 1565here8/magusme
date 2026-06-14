import type { SqlDriver } from "../db/sql/driver";
import type { ID } from "../db/models";
import type {
  ArcanaCategory,
  ArcanaEntry,
  ArcanaEntryPreview,
  ArcanaPurchaseType,
} from "./types";
import { entryLooksKabbalistic } from "./contentPolicy";

function makeId(prefix: string): ID {
  return `${prefix}_${crypto.randomUUID()}`;
}

function isoNow() {
  return new Date().toISOString();
}

type EntryRow = {
  id: string;
  title: string;
  tradition: string;
  category: string;
  intent_tags: string;
  summary: string;
  preview_text: string;
  full_text: string;
  source_title: string;
  source_author: string | null;
  source_year: string | null;
  source_institution: string | null;
  source_url: string | null;
  source_pdf_ref: string | null;
  is_baneful: number;
  is_kabbalistic?: number;
  backlash_text: string | null;
  alternatives_text: string | null;
  planetary_timing: string | null;
  created_at: string;
  indexed_at: string;
};

function rowToEntry(row: EntryRow): ArcanaEntry {
  return {
    id: row.id,
    title: row.title,
    tradition: row.tradition,
    category: row.category as ArcanaCategory,
    intentTags: JSON.parse(row.intent_tags) as string[],
    summary: row.summary,
    previewText: row.preview_text,
    fullText: row.full_text,
    source: {
      title: row.source_title,
      author: row.source_author ?? undefined,
      year: row.source_year ?? undefined,
      institution: row.source_institution ?? undefined,
      url: row.source_url ?? undefined,
      pdfRef: row.source_pdf_ref ?? undefined,
    },
    isBaneful: row.is_baneful === 1,
    isKabbalistic:
      row.is_kabbalistic === 1 ||
      entryLooksKabbalistic({
        title: row.title,
        tradition: row.tradition,
        summary: row.summary,
        previewText: row.preview_text,
        fullText: row.full_text,
        intentTags: JSON.parse(row.intent_tags) as string[],
        category: row.category,
      }),
    backlashText: row.backlash_text ?? "",
    alternativesText: row.alternatives_text ?? "",
    planetaryTiming: row.planetary_timing ?? "",
    createdAt: row.created_at,
    indexedAt: row.indexed_at,
  };
}

export class ArcanaDb {
  constructor(private readonly driver: SqlDriver) {}

  async countEntries() {
    const row = await this.driver.get<{ count: number }>(
      this.driver.dialect === "postgres"
        ? "SELECT COUNT(*)::int AS count FROM arcana_entries"
        : "SELECT COUNT(*) AS count FROM arcana_entries",
    );
    return row?.count ?? 0;
  }

  async upsertEntry(entry: ArcanaEntry) {
    const isKabbalistic = entry.isKabbalistic === true || entryLooksKabbalistic(entry);
    const params = [
      entry.id,
      entry.title,
      entry.tradition,
      entry.category,
      JSON.stringify(entry.intentTags),
      entry.summary,
      entry.previewText,
      entry.fullText,
      entry.source.title,
      entry.source.author ?? null,
      entry.source.year ?? null,
      entry.source.institution ?? null,
      entry.source.url ?? null,
      entry.source.pdfRef ?? null,
      entry.isBaneful ? 1 : 0,
      isKabbalistic ? 1 : 0,
      entry.backlashText,
      entry.alternativesText,
      entry.planetaryTiming,
      entry.createdAt,
      entry.indexedAt,
    ];

    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        `INSERT INTO arcana_entries (
          id, title, tradition, category, intent_tags, summary, preview_text, full_text,
          source_title, source_author, source_year, source_institution, source_url, source_pdf_ref,
          is_baneful, is_kabbalistic, backlash_text, alternatives_text, planetary_timing, created_at, indexed_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          preview_text = EXCLUDED.preview_text,
          full_text = EXCLUDED.full_text,
          is_kabbalistic = EXCLUDED.is_kabbalistic,
          backlash_text = EXCLUDED.backlash_text,
          alternatives_text = EXCLUDED.alternatives_text,
          planetary_timing = EXCLUDED.planetary_timing,
          indexed_at = EXCLUDED.indexed_at`,
        params,
      );
    } else {
      await this.driver.exec(
        `INSERT OR REPLACE INTO arcana_entries (
          id, title, tradition, category, intent_tags, summary, preview_text, full_text,
          source_title, source_author, source_year, source_institution, source_url, source_pdf_ref,
          is_baneful, is_kabbalistic, backlash_text, alternatives_text, planetary_timing, created_at, indexed_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        params,
      );
    }
  }

  async listAllEntries(): Promise<ArcanaEntry[]> {
    const rows = await this.driver.all<EntryRow>("SELECT * FROM arcana_entries ORDER BY title");
    return rows.map(rowToEntry);
  }

  async listGeneralEntries(): Promise<ArcanaEntry[]> {
    const all = await this.listAllEntries();
    return all.filter((e) => !e.isKabbalistic);
  }

  async listKabbalisticEntries(): Promise<ArcanaEntry[]> {
    const all = await this.listAllEntries();
    return all.filter((e) => e.isKabbalistic);
  }

  async countKabbalisticEntries() {
    const all = await this.listKabbalisticEntries();
    return all.length;
  }

  async getEntry(id: string): Promise<ArcanaEntry | null> {
    const sql =
      this.driver.dialect === "postgres"
        ? "SELECT * FROM arcana_entries WHERE id = $1"
        : "SELECT * FROM arcana_entries WHERE id = ?";
    const row = await this.driver.get<EntryRow>(sql, [id]);
    return row ? rowToEntry(row) : null;
  }

  async getEntriesByIds(ids: string[]): Promise<ArcanaEntry[]> {
    if (ids.length === 0) return [];
    const unique = [...new Set(ids)];
    if (this.driver.dialect === "postgres") {
      const placeholders = unique.map((_, i) => `$${i + 1}`).join(",");
      const rows = await this.driver.all<EntryRow>(
        `SELECT * FROM arcana_entries WHERE id IN (${placeholders})`,
        unique,
      );
      return rows.map(rowToEntry);
    }
    const placeholders = unique.map(() => "?").join(",");
    const rows = await this.driver.all<EntryRow>(
      `SELECT * FROM arcana_entries WHERE id IN (${placeholders})`,
      unique,
    );
    return rows.map(rowToEntry);
  }

  async userHasPurchase(userId: ID, entryId: string, type: ArcanaPurchaseType) {
    const sql =
      this.driver.dialect === "postgres"
        ? "SELECT id FROM arcana_purchases WHERE user_id = $1 AND entry_id = $2 AND purchase_type = $3 LIMIT 1"
        : "SELECT id FROM arcana_purchases WHERE user_id = ? AND entry_id = ? AND purchase_type = ? LIMIT 1";
    return Boolean(await this.driver.get<{ id: string }>(sql, [userId, entryId, type]));
  }

  async userHasPlan(userId: ID, consultationId: string) {
    const sql =
      this.driver.dialect === "postgres"
        ? "SELECT id FROM arcana_plans WHERE user_id = $1 AND consultation_id = $2 LIMIT 1"
        : "SELECT id FROM arcana_plans WHERE user_id = ? AND consultation_id = ? LIMIT 1";
    return Boolean(await this.driver.get<{ id: string }>(sql, [userId, consultationId]));
  }

  async recordPurchase(args: {
    userId: ID;
    entryId?: string;
    purchaseType: ArcanaPurchaseType;
    amountCents: number;
    consultationId?: string;
  }) {
    const id = makeId("ap");
    const now = isoNow();
    const params = [
      id,
      args.userId,
      args.entryId ?? null,
      args.purchaseType,
      args.amountCents,
      args.consultationId ?? null,
      now,
    ];
    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        "INSERT INTO arcana_purchases (id, user_id, entry_id, purchase_type, amount_cents, consultation_id, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        params,
      );
    } else {
      await this.driver.exec(
        "INSERT INTO arcana_purchases (id, user_id, entry_id, purchase_type, amount_cents, consultation_id, created_at) VALUES (?,?,?,?,?,?,?)",
        params,
      );
    }
    return id;
  }

  async saveConsultation(args: {
    userId: ID;
    query: string;
    responsePreview: string;
    recommendedEntryIds: string[];
  }) {
    const id = makeId("ac");
    const now = isoNow();
    const params = [id, args.userId, args.query, args.responsePreview, JSON.stringify(args.recommendedEntryIds), now];
    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        "INSERT INTO arcana_consultations (id, user_id, query, response_preview, recommended_entry_ids, created_at) VALUES ($1,$2,$3,$4,$5,$6)",
        params,
      );
    } else {
      await this.driver.exec(
        "INSERT INTO arcana_consultations (id, user_id, query, response_preview, recommended_entry_ids, created_at) VALUES (?,?,?,?,?,?)",
        params,
      );
    }
    return id;
  }

  async getConsultation(id: string) {
    const sql =
      this.driver.dialect === "postgres"
        ? "SELECT * FROM arcana_consultations WHERE id = $1"
        : "SELECT * FROM arcana_consultations WHERE id = ?";
    const row = await this.driver.get<{
      id: string;
      user_id: string;
      query: string;
      response_preview: string;
      recommended_entry_ids: string;
      created_at: string;
    }>(sql, [id]);
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      query: row.query,
      responsePreview: row.response_preview,
      recommendedEntryIds: JSON.parse(row.recommended_entry_ids) as string[],
      createdAt: row.created_at,
    };
  }

  async savePlan(args: {
    userId: ID;
    consultationId: string;
    planMarkdown: string;
    amountCents: number;
  }) {
    const id = makeId("plan");
    const now = isoNow();
    const params = [id, args.userId, args.consultationId, args.planMarkdown, args.amountCents, now];
    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        "INSERT INTO arcana_plans (id, user_id, consultation_id, plan_markdown, amount_cents, created_at) VALUES ($1,$2,$3,$4,$5,$6)",
        params,
      );
    } else {
      await this.driver.exec(
        "INSERT INTO arcana_plans (id, user_id, consultation_id, plan_markdown, amount_cents, created_at) VALUES (?,?,?,?,?,?)",
        params,
      );
    }
    return id;
  }

  async getPlan(userId: ID, consultationId: string) {
    const sql =
      this.driver.dialect === "postgres"
        ? "SELECT plan_markdown FROM arcana_plans WHERE user_id = $1 AND consultation_id = $2"
        : "SELECT plan_markdown FROM arcana_plans WHERE user_id = ? AND consultation_id = ?";
    const row = await this.driver.get<{ plan_markdown: string }>(sql, [userId, consultationId]);
    return row?.plan_markdown ?? null;
  }

  async recordIndexRun(sourcesChecked: number, entriesAdded: number) {
    const id = makeId("idx");
    const now = isoNow();
    const params = [id, sourcesChecked, entriesAdded, now];
    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        "INSERT INTO arcana_index_runs (id, sources_checked, entries_added, finished_at) VALUES ($1,$2,$3,$4)",
        params,
      );
    } else {
      await this.driver.exec(
        "INSERT INTO arcana_index_runs (id, sources_checked, entries_added, finished_at) VALUES (?,?,?,?)",
        params,
      );
    }
  }

  async getLastIndexRun() {
    const row = await this.driver.get<{
      sources_checked: number;
      entries_added: number;
      finished_at: string;
    }>(
      "SELECT sources_checked, entries_added, finished_at FROM arcana_index_runs ORDER BY finished_at DESC LIMIT 1",
    );
    if (!row) return null;
    return {
      sourcesChecked: row.sources_checked,
      entriesAdded: row.entries_added,
      finishedAt: row.finished_at,
    };
  }

  async getMeta(key: string): Promise<string | null> {
    const sql =
      this.driver.dialect === "postgres"
        ? "SELECT value FROM arcana_meta WHERE key = $1"
        : "SELECT value FROM arcana_meta WHERE key = ?";
    const row = await this.driver.get<{ value: string }>(sql, [key]);
    return row?.value ?? null;
  }

  async setMeta(key: string, value: string) {
    if (this.driver.dialect === "postgres") {
      await this.driver.exec(
        "INSERT INTO arcana_meta (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, value],
      );
    } else {
      await this.driver.exec("INSERT OR REPLACE INTO arcana_meta (key, value) VALUES (?, ?)", [key, value]);
    }
  }

  toPreview(entry: ArcanaEntry, unlocks: { spell: boolean; source: boolean }): ArcanaEntryPreview {
    return {
      id: entry.id,
      title: entry.title,
      tradition: entry.tradition,
      category: entry.category,
      intentTags: entry.intentTags,
      summary: entry.summary,
      previewText: entry.previewText,
      isBaneful: entry.isBaneful,
      isKabbalistic: entry.isKabbalistic ?? entryLooksKabbalistic(entry),
      backlashText: entry.backlashText,
      alternativesText: entry.alternativesText,
      unlocked: unlocks.spell,
      sourceUnlocked: unlocks.source,
    };
  }

  async listEntriesSinceLastScan(): Promise<Array<{ id: string; title: string; summary: string; tradition: string }>> {
    const lastRun = await this.getLastIndexRun();
    const since = lastRun?.finishedAt || new Date(0).toISOString();
    return this.driver.all<{ id: string; title: string; summary: string; tradition: string }>(
      `SELECT id, title, summary, tradition FROM arcana_entries WHERE indexed_at > ? ORDER BY indexed_at DESC`,
      [since],
    );
  }

  async updateEntryMetadata(
    id: string,
    meta: {
      dangerLevel?: number;
      difficulty?: number;
      planetaryTiming?: string;
      keywords?: string[];
      crossReferences?: string[];
      aiVerified?: boolean;
      aiVerifiedAt?: string;
    },
  ): Promise<void> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (meta.dangerLevel !== undefined) {
      updates.push(`danger_level = ?`);
      values.push(meta.dangerLevel);
    }
    if (meta.difficulty !== undefined) {
      updates.push(`difficulty = ?`);
      values.push(meta.difficulty);
    }
    if (meta.planetaryTiming !== undefined) {
      updates.push(`planetary_timing = ?`);
      values.push(meta.planetaryTiming);
    }
    if (meta.keywords !== undefined) {
      updates.push(`intent_tags = ?`);
      values.push(JSON.stringify(meta.keywords));
    }
    if (meta.aiVerified !== undefined) {
      updates.push(`ai_verified = ?`);
      values.push(meta.aiVerified ? 1 : 0);
    }

    if (updates.length === 0) return;
    values.push(id);
    await this.driver.exec(
      `UPDATE arcana_entries SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );
  }
}

let arcanaDb: ArcanaDb | null = null;

export function getArcanaDb(): ArcanaDb {
  if (!arcanaDb) throw new Error("Arcana DB not initialized.");
  return arcanaDb;
}

export function initArcanaDb(driver: SqlDriver) {
  arcanaDb = new ArcanaDb(driver);
  return arcanaDb;
}
