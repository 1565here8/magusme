import type { Express } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import { readFileSync, writeFileSync, unlinkSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const STAGING_DIR = "/Users/magusme/Desktop/magusme-staging";

interface StagedSpell {
  id: string;
  slug: string;
  title: string;
  tradition: string;
  category: string;
  element: string;
  timing: string;
  materials: string[];
  steps: string[];
  warnings: string[];
  counterSpell: string;
  sourceCitation: {
    author: string;
    title: string;
    year: string;
    page: string;
    archiveUrl: string;
  };
  summary: string;
  dangerLevel: number;
  difficultyLevel: number;
  fullText: string;
  sourceTextPreview: string;
  archiveIdentifier: string;
  status: "pending_review" | "approved" | "rejected";
  createdAt: string;
}

function readStaging(): StagedSpell[] {
  if (!existsSync(STAGING_DIR)) return [];
  const files = readdirSync(STAGING_DIR).filter(f => f.endsWith(".json"));
  return files.map(f => {
    const data = readFileSync(join(STAGING_DIR, f), "utf8");
    return JSON.parse(data) as StagedSpell;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function writeStaging(spell: StagedSpell) {
  if (!existsSync(STAGING_DIR)) return;
  const file = join(STAGING_DIR, `${spell.slug}.json`);
  writeFileSync(file, JSON.stringify(spell, null, 2));
}

function deleteStaging(slug: string) {
  const file = join(STAGING_DIR, `${slug}.json`);
  if (existsSync(file)) unlinkSync(file);
}

export function registerCurationStagingRoutes(app: Express) {
  app.get(
    "/api/curation/staging",
    requireAuth,
    asyncHandler(async (_req, res) => {
      const spells = readStaging();
      res.json({ spells, total: spells.length });
    })
  );

  app.get(
    "/api/curation/staging/:slug",
    requireAuth,
    asyncHandler(async (req, res) => {
      const spells = readStaging();
      const spell = spells.find(s => s.slug === req.params.slug);
      if (!spell) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(spell);
    })
  );

  app.post(
    "/api/curation/staging/:slug/approve",
    requireAuth,
    asyncHandler(async (req, res) => {
      const spells = readStaging();
      const idx = spells.findIndex(s => s.slug === req.params.slug);
      if (idx === -1) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      spells[idx].status = "approved";
      spells[idx].approvedAt = new Date().toISOString();
      spells[idx].approvedBy = req.session!.sub;
      writeStaging(spells[idx]);
      res.json({ ok: true, spell: spells[idx] });
    })
  );

  app.post(
    "/api/curation/staging/:slug/reject",
    requireAuth,
    asyncHandler(async (req, res) => {
      const spells = readStaging();
      const idx = spells.findIndex(s => s.slug === req.params.slug);
      if (idx === -1) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      spells[idx].status = "rejected";
      spells[idx].rejectedAt = new Date().toISOString();
      spells[idx].rejectedBy = req.session!.sub;
      spells[idx].rejectReason = req.body.reason || "No reason given";
      writeStaging(spells[idx]);
      res.json({ ok: true });
    })
  );

  app.post(
    "/api/curation/staging/approve-all",
    requireAuth,
    asyncHandler(async (req, res) => {
      const spells = readStaging();
      const pending = spells.filter(s => s.status === "pending_review");
      for (const spell of pending) {
        spell.status = "approved";
        spell.approvedAt = new Date().toISOString();
        spell.approvedBy = req.session!.sub;
        writeStaging(spell);
      }
      res.json({ ok: true, approved: pending.length });
    })
  );

  app.get(
    "/api/curation/staging/stats",
    requireAuth,
    asyncHandler(async (_req, res) => {
      const spells = readStaging();
      const stats = {
        total: spells.length,
        pending: spells.filter(s => s.status === "pending_review").length,
        approved: spells.filter(s => s.status === "approved").length,
        rejected: spells.filter(s => s.status === "rejected").length,
      };
      res.json(stats);
    })
  );
}