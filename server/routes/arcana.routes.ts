import type { Express } from "express";

import { z } from "zod";

import { getDb } from "../../src/server/db";

import { getArcanaDb } from "../../src/server/arcana/arcanaDb";

import { generateArcanaPlan, generateSpellDetail, runArcanaConsultation, streamArcanaConsultation } from "../../src/server/arcana/consult";
import { getArcanaIndexStatus } from "../../src/server/arcana/indexer";
import { ARCANA_FULL_DISCLAIMER, ARCANA_PATH_ACKNOWLEDGMENT, ARCANA_PRIVACY_NOTICE } from "../../src/server/arcana/disclaimers";
import { getArcanaPrivacyManifest } from "../../src/server/arcana/privacy";
import { buildAstroSnapshot, buildNatalChart } from "../../src/server/arcana/astro/snapshot";
import { buildDeepAstroProfile } from "../../src/server/arcana/astro/deepProfile";
import { DIVINATION_CATALOG, divinationsByCategory } from "../../src/server/arcana/divinationCatalog";
import {
  prepareDivinationReading,
  prepareReadingMeta,
  streamMerlianReading,
  buildPersonalizationBundle,
  personalProfileFromBody,
  type ReadingType,
} from "../../src/server/arcana/readings/llmReadings";
import { runArcanaIndexer } from "../../src/server/arcana/indexer";
import { computeNumerology } from "../../src/server/arcana/readings/numerology";
import { KABBALAH_DANGER_BANNER, KABBALAH_DIVINATIONS, KABBALAH_VAULT_ACKNOWLEDGMENT } from "../../src/server/arcana/contentPolicy";
import { streamKabbalahConsultation } from "../../src/server/arcana/kabbalahConsult";
import {
  prepareKabbalahDivinationReading,
  streamKabbalahDivination,
} from "../../src/server/arcana/readings/llmReadings";

import {

  arcanaDevUnlockEnabled,

  arcanaPlanPriceCents,

  arcanaSourcePriceCents,

  arcanaSpellPriceCents,

} from "../../src/server/arcana/pricing";
import {
  consumeSearchQuota,
  formatSearchCents,
  getSearchQuotaStatus,
  grantMonthlySearchPack,
  arcanaSearchPriceCents,
  arcanaMonthlyPriceCents,
} from "../../src/server/arcana/searchQuota";
import { streamMagubrainSearch } from "../../src/server/arcana/searchEngine";
import {
  arcanaBtcpayConfigured,
  createArcanaSearchBtcpayCheckout,
} from "../../src/server/arcana/billing/btcpayCheckout";

import { requireAuth } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";



const ConsultBody = z.object({ query: z.string().min(3).max(8000) });

const SearchBody = z.object({
  query: z.string().min(2).max(4000),
  paidSingle: z.boolean().optional(),
});

const PurchaseBody = z.object({

  entryId: z.string().min(1),

  purchaseType: z.enum(["spell", "source"]),

});

const PlanBody = z.object({ consultationId: z.string().min(1) });

const SpellDetailBody = z.object({
  pathChoice: z.enum(["peaceful", "violent"]),
  consultationId: z.string().optional(),
});

const AstroNowQuery = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  label: z.string().max(120).optional(),
  at: z.string().datetime().optional(),
});

const NatalBody = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  label: z.string().max(120).optional(),
});

const DeepProfileBody = NatalBody.extend({
  fullName: z.string().min(1).max(200),
});

const PersonalizationFields = {
  culturalBackground: z.string().max(2000).optional(),
  heritageCommunity: z.string().max(500).optional(),
  destinationPlace: z.string().max(500).optional(),
  growthAreas: z.string().max(2000).optional(),
  includeTarotAnchor: z.boolean().optional(),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
};

const DivinationStreamBody = z.object({
  divinationId: z.string().min(1),
  question: z.string().max(2000).optional(),
  description: z.string().max(8000).optional(),
  birthDate: z.string().optional(),
  fullName: z.string().max(200).optional(),
  spread: z.enum(["single", "three", "cross"]).optional(),
  cast: z.enum(["single", "three", "five"]).optional(),
  dominantHand: z.enum(["left", "right"]).optional(),
  ...PersonalizationFields,
});

const NumerologyBody = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fullName: z.string().min(1).max(200),
});

const KabbalahConsultBody = z.object({
  query: z.string().min(3).max(8000),
  vaultAcknowledged: z.literal(true),
});

const KabbalahDivinationBody = z.object({
  divinationId: z.string().min(1),
  vaultAcknowledged: z.literal(true),
  question: z.string().max(2000).optional(),
  description: z.string().max(8000).optional(),
});

const READING_TYPES = new Set<ReadingType>(["tarot", "rune", "coffee", "palm", "face", "numerology", "generic"]);



function formatCents(cents: number) {

  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

}



export function registerArcanaRoutes(app: Express) {

  app.get(

    "/api/arcana/status",

    asyncHandler(async (_req, res) => {

      const status = await getArcanaIndexStatus();

      res.json({

        ...status,

        pricing: {

          spell: { cents: arcanaSpellPriceCents(), label: formatCents(arcanaSpellPriceCents()) },

          source: { cents: arcanaSourcePriceCents(), label: formatCents(arcanaSourcePriceCents()) },

          plan: { cents: arcanaPlanPriceCents(), label: formatCents(arcanaPlanPriceCents()) },

        },

        disclaimer: ARCANA_FULL_DISCLAIMER,

        privacyNotice: ARCANA_PRIVACY_NOTICE,

        privacy: getArcanaPrivacyManifest(),

        pathAcknowledgment: ARCANA_PATH_ACKNOWLEDGMENT,

      });

    }),

  );



  app.get(
    "/api/arcana/search/quota",
    requireAuth,
    asyncHandler(async (req, res) => {
      const quota = await getSearchQuotaStatus(req.session!.sub);
      res.json({
        ...quota,
        payPerSearchLabel: formatSearchCents(quota.payPerSearchCents),
        monthlyPriceLabel: formatSearchCents(quota.monthlyPriceCents),
        btcpayConfigured: arcanaBtcpayConfigured(),
      });
    }),
  );

  app.post(
    "/api/arcana/search/btcpay/checkout",
    requireAuth,
    asyncHandler(async (req, res) => {
      const kind = z.enum(["single", "monthly"]).parse(req.body?.kind);
      const userId = req.session!.sub;
      const product = kind === "monthly" ? "search_monthly" : "search_single";

      if (arcanaBtcpayConfigured()) {
        const invoice = await createArcanaSearchBtcpayCheckout({
          userId,
          product,
        });
        res.json({
          ok: true,
          checkoutUrl: invoice.checkoutUrl,
          invoiceId: invoice.invoiceId,
          amountUsd: invoice.amountUsd,
        });
        return;
      }

      if (arcanaDevUnlockEnabled()) {
        if (kind === "monthly") {
          const quota = await grantMonthlySearchPack(userId);
          res.json({
            ok: true,
            message: `Monthly search pack active (${formatSearchCents(arcanaMonthlyPriceCents())} dev unlock).`,
            quota,
          });
          return;
        }
        res.json({
          ok: true,
          message: `Single search unlocked (${formatSearchCents(arcanaSearchPriceCents())} dev unlock).`,
          paidSingleReady: true,
        });
        return;
      }

      res.status(503).json({
        error: "Bitcoin checkout not configured. Set BTCPAY_URL, BTCPAY_API_KEY_ALLMAGUS, BTCPAY_STORE_ID_ALLMAGUS.",
      });
    }),
  );

  /** @deprecated use /api/arcana/search/btcpay/checkout */
  app.post(
    "/api/arcana/search/purchase",
    requireAuth,
    asyncHandler(async (req, res) => {
      const kind = z.enum(["single", "monthly"]).parse(req.body?.kind);
      const userId = req.session!.sub;
      if (kind === "monthly") {
        const quota = await grantMonthlySearchPack(userId);
        res.json({
          ok: true,
          message: `Monthly search pack active (${formatSearchCents(arcanaMonthlyPriceCents())} dev unlock).`,
          quota,
        });
        return;
      }
      res.json({
        ok: true,
        message: `Single search unlocked (${formatSearchCents(arcanaSearchPriceCents())} dev unlock). Use paidSingle on next search.`,
        paidSingleReady: true,
      });
    }),
  );

  app.post(
    "/api/arcana/search/stream",
    requireAuth,
    asyncHandler(async (req, res) => {
      const parsed = SearchBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid search query." });
        return;
      }
      const userId = req.session!.sub;
      try {
        await consumeSearchQuota(userId, { paidSingle: parsed.data.paidSingle });
      } catch (err) {
        if (err instanceof Error && err.message === "SEARCH_PAYMENT_REQUIRED") {
          const status = (err as Error & { status?: Awaited<ReturnType<typeof getSearchQuotaStatus>> }).status;
          res.status(402).json({
            error: "Free searches used. Pay per search or subscribe monthly.",
            quota: status,
          });
          return;
        }
        throw err;
      }

      const controller = new AbortController();
      req.on("close", () => controller.abort());
      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");

      try {
        for await (const text of streamMagubrainSearch(parsed.data.query.trim(), controller.signal)) {
          res.write(`${JSON.stringify({ type: "chunk", text })}\n`);
        }
        const quota = await getSearchQuotaStatus(userId);
        res.write(`${JSON.stringify({ type: "done", quota })}\n`);
        res.end();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Search failed.";
        if (!res.headersSent) res.status(500).json({ error: message });
        else {
          res.write(`${JSON.stringify({ type: "error", message })}\n`);
          res.end();
        }
      }
    }),
  );



  app.get(

    "/api/arcana/corpus",

    asyncHandler(async (_req, res) => {

      const db = getArcanaDb();

      const entries = await db.listGeneralEntries();

      res.json({

        total: entries.length,

        kabbalahVaultTotal: await db.countKabbalisticEntries(),

        traditions: [...new Set(entries.map((e) => e.tradition))].sort(),

        categories: [...new Set(entries.map((e) => e.category))].sort(),

        entries: entries.map((e) => ({

          id: e.id,

          title: e.title,

          tradition: e.tradition,

          category: e.category,

          isBaneful: e.isBaneful,

          summary: e.summary,

        })),

      });

    }),

  );



  app.post(

    "/api/arcana/consult",

    requireAuth,

    asyncHandler(async (req, res) => {

      const parsed = ConsultBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid consultation query." });

        return;

      }

      const result = await runArcanaConsultation({

        userId: req.session!.sub,

        query: parsed.data.query.trim(),

        personalProfile: personalProfileFromBody(parsed.data),

      });

      res.json(result);

    }),

  );



  app.post(

    "/api/arcana/consult/stream",

    requireAuth,

    asyncHandler(async (req, res) => {

      const parsed = ConsultBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid consultation query." });

        return;

      }

      const controller = new AbortController();

      req.on("close", () => controller.abort());

      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");

      res.setHeader("Cache-Control", "no-cache, no-transform");

      res.setHeader("X-Accel-Buffering", "no");

      try {

        for await (const event of streamArcanaConsultation({

          userId: req.session!.sub,

          query: parsed.data.query.trim(),

          personalProfile: personalProfileFromBody(parsed.data),

          signal: controller.signal,

        })) {

          res.write(`${JSON.stringify(event)}\n`);

        }

        res.end();

      } catch (err) {

        const message = err instanceof Error ? err.message : "Stream failed.";

        if (!res.headersSent) {

          res.status(500).json({ error: message });

        } else {

          res.write(`${JSON.stringify({ type: "error", message })}\n`);

          res.end();

        }

      }

    }),

  );



  app.get(

    "/api/arcana/entry/:id",

    requireAuth,

    asyncHandler(async (req, res) => {

      const db = getArcanaDb();

      const entry = await db.getEntry(req.params.id);

      if (!entry) {

        res.status(404).json({ error: "Entry not found." });

        return;

      }

      const userId = req.session!.sub;

      const spellUnlocked = await db.userHasPurchase(userId, entry.id, "spell");

      const sourceUnlocked = await db.userHasPurchase(userId, entry.id, "source");



      res.json({

        preview: db.toPreview(entry, { spell: spellUnlocked, source: sourceUnlocked }),

        fullText: spellUnlocked ? entry.fullText : null,

        backlash: entry.backlashText,

        alternatives: entry.alternativesText,

        planetaryTiming: entry.planetaryTiming,

        source: sourceUnlocked

          ? entry.source

          : { title: entry.source.title, institution: entry.source.institution },

      });

    }),

  );



  app.post(

    "/api/arcana/entry/:id/detail",

    requireAuth,

    asyncHandler(async (req, res) => {

      const parsed = SpellDetailBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid detail request." });

        return;

      }

      const detail = await generateSpellDetail({

        userId: req.session!.sub,

        entryId: req.params.id,

        pathChoice: parsed.data.pathChoice,

        consultationId: parsed.data.consultationId,

      });

      res.json(detail);

    }),

  );



  app.post(

    "/api/arcana/purchase",

    requireAuth,

    asyncHandler(async (req, res) => {

      const parsed = PurchaseBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid purchase request." });

        return;

      }



      const db = getArcanaDb();

      const store = getDb();

      const userId = req.session!.sub;

      const { entryId, purchaseType } = parsed.data;



      const entry = await db.getEntry(entryId);

      if (!entry) {

        res.status(404).json({ error: "Entry not found." });

        return;

      }



      if (purchaseType === "source") {

        const hasSpell = await db.userHasPurchase(userId, entryId, "spell");

        if (!hasSpell) {

          res.status(400).json({ error: "Unlock the spell first ($5) before purchasing source citation ($2)." });

          return;

        }

      }



      const already = await db.userHasPurchase(userId, entryId, purchaseType);

      if (already) {

        res.json({ ok: true, alreadyOwned: true });

        return;

      }



      const amountCents =

        purchaseType === "spell" ? arcanaSpellPriceCents() : arcanaSourcePriceCents();



      if (!arcanaDevUnlockEnabled()) {

        res.status(501).json({

          error: "Payment processor not configured. Set ARCANA_DEV_UNLOCK=true for development unlocks.",

          amountCents,

        });

        return;

      }



      await db.recordPurchase({ userId, entryId, purchaseType, amountCents });

      await store.refundTokens(userId, 0); // no-op anchor for audit trail extension



      res.json({

        ok: true,

        purchaseType,

        amountCents,

        message: `Unlocked ${purchaseType} for ${formatCents(amountCents)} (dev mode).`,

      });

    }),

  );



  app.post(

    "/api/arcana/plan",

    requireAuth,

    asyncHandler(async (req, res) => {

      const parsed = PlanBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid plan request." });

        return;

      }



      const db = getArcanaDb();

      const userId = req.session!.sub;

      const { consultationId } = parsed.data;



      const consultation = await db.getConsultation(consultationId);

      if (!consultation || consultation.userId !== userId) {

        res.status(404).json({ error: "Consultation not found." });

        return;

      }



      const hasPlan = await db.userHasPlan(userId, consultationId);

      if (hasPlan) {

        const existing = await db.getPlan(userId, consultationId);

        res.json({ ok: true, planMarkdown: existing, alreadyOwned: true });

        return;

      }



      const amountCents = arcanaPlanPriceCents();

      if (!arcanaDevUnlockEnabled()) {

        res.status(501).json({

          error: "Payment processor not configured. Set ARCANA_DEV_UNLOCK=true for development.",

          amountCents,

        });

        return;

      }



      const planMarkdown = await generateArcanaPlan({ userId, consultationId });

      await db.savePlan({ userId, consultationId, planMarkdown, amountCents });

      await db.recordPurchase({
        userId,
        purchaseType: "plan",
        amountCents,
        consultationId,
      });



      res.json({ ok: true, planMarkdown, amountCents });

    }),

  );



  app.get(

    "/api/arcana/astro/now",

    asyncHandler(async (req, res) => {

      const parsed = AstroNowQuery.safeParse(req.query);

      if (!parsed.success) {

        res.status(400).json({ error: "Provide lat and lon query parameters (-90..90, -180..180)." });

        return;

      }

      const at = parsed.data.at ? new Date(parsed.data.at) : new Date();

      const snapshot = buildAstroSnapshot({

        date: at,

        lat: parsed.data.lat,

        lon: parsed.data.lon,

        label: parsed.data.label,

      });

      res.json(snapshot);

    }),

  );



  app.post(

    "/api/arcana/astro/natal",

    asyncHandler(async (req, res) => {

      const parsed = NatalBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid natal chart data." });

        return;

      }

      const chart = buildNatalChart(parsed.data);

      res.json(chart);

    }),

  );



  app.post(

    "/api/arcana/astro/deep-profile",

    asyncHandler(async (req, res) => {

      const parsed = DeepProfileBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid deep profile data — birth date, full name, lat, and lon required." });

        return;

      }

      const profile = buildDeepAstroProfile(parsed.data);

      res.json(profile);

    }),

  );



  app.get(

    "/api/arcana/divinations",

    asyncHandler(async (_req, res) => {

      const grouped = Object.fromEntries(divinationsByCategory());

      res.json({

        total: DIVINATION_CATALOG.length,

        categories: grouped,

        catalog: DIVINATION_CATALOG,

      });

    }),

  );



  app.post(

    "/api/arcana/numerology/compute",

    asyncHandler(async (req, res) => {

      const parsed = NumerologyBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid numerology input." });

        return;

      }

      res.json(computeNumerology(parsed.data.birthDate, parsed.data.fullName));

    }),

  );



  app.post(

    "/api/arcana/library/reindex",

    requireAuth,

    asyncHandler(async (_req, res) => {

      const result = await runArcanaIndexer();

      res.json({ ok: true, ...result });

    }),

  );



  app.post(

    "/api/arcana/divination/stream",

    asyncHandler(async (req, res) => {

      const parsed = DivinationStreamBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid divination request." });

        return;

      }

      let readingType: ReadingType;

      let question: string;

      let meta;

      let divinationId: string;

      try {

        ({ readingType, question, meta, divinationId } = prepareDivinationReading(

          parsed.data.divinationId,

          parsed.data,

        ));

      } catch (err) {

        res.status(400).json({ error: err instanceof Error ? err.message : "Invalid reading." });

        return;

      }

      const personalization = buildPersonalizationBundle(personalProfileFromBody(parsed.data));

      const controller = new AbortController();

      res.on("close", () => controller.abort());

      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");

      res.setHeader("Cache-Control", "no-cache, no-transform");

      res.setHeader("X-Accel-Buffering", "no");

      try {

        for await (const event of streamMerlianReading({

          type: readingType,

          question,

          meta,

          divinationId,

          personalization,

          signal: controller.signal,

        })) {

          res.write(`${JSON.stringify(event)}\n`);

        }

        res.end();

      } catch (err) {

        const message = err instanceof Error ? err.message : "Stream failed.";

        if (!res.headersSent) {

          res.status(500).json({ error: message });

        } else {

          res.write(`${JSON.stringify({ type: "error", message })}\n`);

          res.end();

        }

      }

    }),

  );



  app.post(

    "/api/arcana/readings/:type/stream",

    asyncHandler(async (req, res) => {

      const type = req.params.type as ReadingType;

      if (!READING_TYPES.has(type)) {

        res.status(400).json({ error: "Unknown reading type." });

        return;

      }

      const parsed = DivinationStreamBody.safeParse(req.body);

      if (!parsed.success) {

        res.status(400).json({ error: "Invalid reading request." });

        return;

      }

      let question: string;

      let meta;

      try {

        ({ question, meta } = prepareReadingMeta(type, parsed.data));

      } catch (err) {

        res.status(400).json({ error: err instanceof Error ? err.message : "Invalid reading." });

        return;

      }

      const personalization = buildPersonalizationBundle(personalProfileFromBody(parsed.data));

      const controller = new AbortController();

      res.on("close", () => controller.abort());

      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");

      res.setHeader("Cache-Control", "no-cache, no-transform");

      res.setHeader("X-Accel-Buffering", "no");

      try {

        for await (const event of streamMerlianReading({

          type,

          question,

          meta,

          personalization,

          signal: controller.signal,

        })) {

          res.write(`${JSON.stringify(event)}\n`);

        }

        res.end();

      } catch (err) {

        const message = err instanceof Error ? err.message : "Stream failed.";

        if (!res.headersSent) {

          res.status(500).json({ error: message });

        } else {

          res.write(`${JSON.stringify({ type: "error", message })}\n`);

          res.end();

        }

      }

    }),

  );

  app.get(
    "/api/arcana/kabbalah/status",
    asyncHandler(async (_req, res) => {
      const db = getArcanaDb();
      const entries = await db.listKabbalisticEntries();
      res.json({
        dangerBanner: KABBALAH_DANGER_BANNER,
        vaultAcknowledgment: KABBALAH_VAULT_ACKNOWLEDGMENT,
        totalEntries: entries.length,
        divinations: KABBALAH_DIVINATIONS,
        separated: true,
        classification: "most_dangerous",
        entries: entries.map((e) => ({
          id: e.id,
          title: e.title,
          tradition: e.tradition,
          isBaneful: e.isBaneful,
          summary: e.summary,
        })),
      });
    }),
  );

  app.post(
    "/api/arcana/kabbalah/consult/stream",
    requireAuth,
    asyncHandler(async (req, res) => {
      const parsed = KabbalahConsultBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Vault acknowledgment required. Kabbalistic magic is the most dangerous category." });
        return;
      }

      const controller = new AbortController();
      req.on("close", () => controller.abort());
      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");

      try {
        for await (const event of streamKabbalahConsultation({
          userId: req.session!.sub,
          query: parsed.data.query.trim(),
          signal: controller.signal,
        })) {
          res.write(`${JSON.stringify(event)}\n`);
        }
        res.end();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Vault stream failed.";
        if (!res.headersSent) {
          res.status(500).json({ error: message });
        } else {
          res.write(`${JSON.stringify({ type: "error", message })}\n`);
          res.end();
        }
      }
    }),
  );

  app.post(
    "/api/arcana/kabbalah/divination/stream",
    requireAuth,
    asyncHandler(async (req, res) => {
      const parsed = KabbalahDivinationBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Vault acknowledgment required." });
        return;
      }

      let prepared;
      try {
        prepared = prepareKabbalahDivinationReading(parsed.data.divinationId, parsed.data);
      } catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : "Invalid vault reading." });
        return;
      }

      const controller = new AbortController();
      req.on("close", () => controller.abort());
      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");

      try {
        for await (const event of streamKabbalahDivination({
          divinationId: parsed.data.divinationId,
          question: prepared.question,
          label: prepared.label,
          focus: prepared.focus,
          signal: controller.signal,
        })) {
          res.write(`${JSON.stringify(event)}\n`);
        }
        res.end();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Vault reading failed.";
        if (!res.headersSent) {
          res.status(500).json({ error: message });
        } else {
          res.write(`${JSON.stringify({ type: "error", message })}\n`);
          res.end();
        }
      }
    }),
  );

}

