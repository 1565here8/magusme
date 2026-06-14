import type { Express, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";

export function registerInferenceRoutes(app: Express) {
  app.get(
    "/api/local/ollama-status",
    asyncHandler(async (_req: Request, res: Response) => {
      const defaultHost = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
      try {
        const resp = await fetch(`${defaultHost}/api/tags`, { signal: AbortSignal.timeout(3000) });
        if (!resp.ok) throw new Error(`Ollama returned ${resp.status}`);
        const body = (await resp.json()) as { models: Array<{ name: string }> };
        res.json({
          reachable: true,
          host: defaultHost,
          model: body.models[0]?.name ?? "none",
          models: body.models.map((m) => m.name),
        });
      } catch (err) {
        res.json({
          reachable: false,
          host: defaultHost,
          model: "unreachable",
          models: [],
          error: err instanceof Error ? err.message : "Connection failed",
        });
      }
    }),
  );

  app.post(
    "/api/cloudCore",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { query } = req.body ?? {};
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Missing query" });
        return;
      }
      const provider = process.env.GEMINI_API_KEY ? "gemini" : null;
      if (!provider) {
        res.status(503).json({ error: "No cloud AI provider configured" });
        return;
      }
      res.json({ ok: true, mode: "cloud", message: "Cloud core endpoint ready" });
    }),
  );

  app.post(
    "/api/localCore",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { query } = req.body ?? {};
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Missing query" });
        return;
      }
      res.json({ ok: true, mode: "local", message: "Local core endpoint ready" });
    }),
  );

  app.post(
    "/api/mesh/compute",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { query } = req.body ?? {};
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Missing query" });
        return;
      }
      res.json({ ok: true, mode: "mesh", message: "Mesh compute endpoint ready" });
    }),
  );

  app.get(
    "/api/inference/lanes",
    asyncHandler(async (_req: Request, res: Response) => {
      const geminiKey = process.env.GEMINI_API_KEY;
      res.json({
        defaultLane: geminiKey ? "cloud" : "local",
        demoMode: !geminiKey,
        geminiConfigured: !!geminiKey,
        corporateAvailable: false,
        cloud: {
          lane: "cloud",
          label: "Cloud Intelligence",
          zeroVpsCost: true,
          provider: geminiKey ? "gemini" : "demo",
          model: geminiKey ? "gemini-2.0-flash" : "none (demo)",
          host: "api.gemini.google.com",
          thirdPartyVendor: true,
          promptsLeaveDevice: true,
          corporateInHouse: false,
          demoMode: !geminiKey,
        },
        corporate: {
          lane: "corporate",
          label: "Corporate Private",
          zeroVpsCost: false,
          provider: "ollama",
          model: "custom",
          host: process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434",
          thirdPartyVendor: false,
          promptsLeaveDevice: false,
          corporateInHouse: true,
          demoMode: false,
        },
        pricing: {
          cloud: { priceFromUsd: 0, product: "free-tier", infra: "gemini" },
          corporate: { priceFromUsd: 49, product: "corporate-license", infra: "self-hosted" },
        },
      });
    }),
  );
}
