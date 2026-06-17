import type { NextFunction, Request, Response } from "express";
import { requireAuth } from "./auth";
import { getSocialDb } from "../../src/server/social/socialDb";

export function requireServiceProvider(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, async () => {
    try {
      const profile = await getSocialDb().getProfile(req.session!.sub);
      if (!profile) {
        res.status(403).json({ error: "Create a social profile first." });
        return;
      }
      if (!profile.isServiceProvider) {
        res.status(403).json({ error: "Service provider status required. Enable it in your profile settings." });
        return;
      }
      if (profile.kycStatus !== "verified") {
        res.status(403).json({ error: "KYC verification required to offer services. Complete verification in your profile settings." });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  });
}
