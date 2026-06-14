import type { Express } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAdmin } from "../middleware/admin";
import { requireAuth } from "../middleware/auth";
import { getSpellsDb } from "../../src/server/spells/spellsDb";

export function registerSpellsRoutes(app: Express) {
  app.post(
    "/api/admin/spells/update-fulltext",
    requireAdmin,
    asyncHandler(async (req, res) => {
      const updates = req.body as Array<{ slug: string; full_text: string }>;
      if (!Array.isArray(updates) || updates.length === 0) {
        res.status(400).json({ error: "Expected array of {slug, full_text}" });
        return;
      }
      const db = getSpellsDb();
      let updated = 0;
      for (const u of updates) {
        if (u.slug && u.full_text) {
          // Only update verified spells
          const spellId = await db.getSpellIdBySlug(u.slug);
          if (spellId) {
            await db.updateFullText(u.slug, u.full_text);
            updated++;
          }
        }
      }
      res.json({ ok: true, updated });
    }),
  );

  app.get(
    "/api/spells",
    asyncHandler(async (req, res) => {
      const { query, category, tradition, sort, limit, offset } = req.query;
      const result = await getSpellsDb().getSpells({
        query: typeof query === "string" ? query : undefined,
        category: typeof category === "string" ? category : undefined,
        tradition: typeof tradition === "string" ? tradition : undefined,
        sort: typeof sort === "string" ? sort : undefined,
        limit: typeof limit === "string" ? parseInt(limit) : undefined,
        offset: typeof offset === "string" ? parseInt(offset) : undefined,
      });
      res.json(result);
    }),
  );

  app.get(
    "/api/spells/categories",
    asyncHandler(async (_req, res) => {
      const categories = await getSpellsDb().getCategoriesWithCounts();
      res.json(categories);
    }),
  );

  app.get(
    "/api/spells/traditions",
    asyncHandler(async (_req, res) => {
      const traditions = await getSpellsDb().getTraditions();
      res.json(traditions);
    }),
  );

  app.get(
    "/api/spells/random",
    asyncHandler(async (req, res) => {
      const { element, category } = req.query;
      const spell = await getSpellsDb().getRandomSpell({
        element: typeof element === "string" ? element : undefined,
        category: typeof category === "string" ? category : undefined,
      });
      if (!spell) {
        res.status(404).json({ error: "No spells found matching filters." });
        return;
      }
      res.json(spell);
    }),
  );

  app.get(
    "/api/spells/:slug/reviews",
    asyncHandler(async (req, res) => {
      const spellId = await getSpellsDb().getSpellIdBySlug(req.params.slug);
      if (!spellId) { res.status(404).json({ error: "Spell not found" }); return; }
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await getSpellsDb().getReviewsBySpellId(spellId, limit, offset);
      res.json(result);
    }),
  );

  app.post(
    "/api/spells/:slug/reviews",
    requireAuth,
    asyncHandler(async (req, res) => {
      const spellId = await getSpellsDb().getSpellIdBySlug(req.params.slug);
      if (!spellId) { res.status(404).json({ error: "Spell not found" }); return; }
      const { rating, body } = req.body as { rating?: number; body?: string };
      if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
        res.status(400).json({ error: "Rating must be a number between 1 and 5" });
        return;
      }
      if (!body || typeof body !== "string" || body.trim().length < 10) {
        res.status(400).json({ error: "Review body must be at least 10 characters" });
        return;
      }
      const review = await getSpellsDb().addReview(spellId, req.session!.sub, rating, body.trim());
      res.status(201).json(review);
    }),
  );

  app.get(
    "/api/spells/references",
    asyncHandler(async (req, res) => {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const offset = parseInt(req.query.offset as string) || 0;
      const result = await getSpellsDb().getSpellsWithReferences(limit, offset);
      res.json(result);
    }),
  );

  app.get(
    "/api/spells/:slug",
    asyncHandler(async (req, res) => {
      const spell = await getSpellsDb().getSpellBySlug(req.params.slug);
      if (!spell) {
        res.status(404).json({ error: "Spell not found" });
        return;
      }
      res.json(spell);
    }),
  );
}
