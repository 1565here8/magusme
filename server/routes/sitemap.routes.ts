import type { Express } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { getSpellsDb } from "../../src/server/spells/spellsDb";

const STATIC_ROUTES = [
  "/",
  "/consult",
  "/learn",
  "/create",
  "/reading",
  "/tools",
  "/human-map",
  "/terms",
  "/privacy",
];

const CONSULT_ROUTES = [
  "/consult/tarot",
  "/consult/runes",
  "/consult/astrology",
  "/consult/iching",
  "/consult/astro-watch",
  "/consult/numerology",
  "/consult/palm-reading",
  "/consult/face-reading",
  "/consult/foot-reading",
  "/consult/coffee-cup",
  "/consult/tea-leaves",
  "/consult/crystal-scrying",
  "/consult/mirror-scrying",
  "/consult/water-scrying",
  "/consult/smoke-reading",
  "/consult/fire-gazing",
  "/consult/cloud-reading",
  "/consult/bone-reading",
  "/consult/egg-cleanse",
  "/consult/oracle-cards",
  "/consult/lenormand",
  "/consult/kipper",
  "/consult/playing-cards",
  "/consult/domino",
  "/consult/dice",
  "/consult/mahjong",
  "/consult/iching",
  "/consult/geomancy",
  "/consult/horary",
  "/consult/electional",
  "/consult/synastry",
  "/consult/vedic",
  "/consult/panchang",
  "/consult/prashna",
  "/consult/ramayana",
  "/consult/ancestor",
  "/consult/mediumship",
  "/consult/dreams",
  "/consult/hypnagogic",
  "/consult/animal-omen",
  "/consult/weather-omen",
  "/consult/augury",
  "/consult/automatic-writing",
  "/consult/bibliomancy",
  "/consult/poem-oracle",
  "/consult/sacred-lots",
  "/consult/torah-lots",
  "/consult/istikhara",
  "/consult/name-analysis",
  "/consult/phrenology",
  "/consult/iridology",
  "/consult/angel-numbers",
  "/consult/chinese-zodiac",
  "/consult/enochian",
  "/consult/ogham",
  "/consult/kikongo",
  "/consult/ifa",
  "/consult/planetary-oracle",
  "/consult/pendulum",
];

export function registerSitemapRoutes(app: Express) {
  app.get("/sitemap.xml", asyncHandler(async (_req, res) => {
    const learnRoutes = (await getSpellsDb().getAllSpellSlugs()).map((slug) => `/learn/${slug}`);
    const allRoutes = [...STATIC_ROUTES, ...CONSULT_ROUTES, ...learnRoutes];
    const urls = allRoutes
      .map((route) => `  <url><loc>https://magusme.com${route}</loc></url>`)
      .join("\n");

    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
  }));
}
