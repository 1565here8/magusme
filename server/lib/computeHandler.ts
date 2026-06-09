import type { Request, Response } from "express";
import { getDb } from "../../src/server/db";
import { incrementMetric } from "../../src/server/metrics";
import type { NetworkCoreMode } from "../../src/server/db/models";
import { shouldLogChatHistory } from "../../src/server/localPrivacy";

export async function runMeteredStream(args: {
  req: Request;
  res: Response;
  mode: NetworkCoreMode;
  query: string;
  stream: AsyncGenerator<string>;
}) {
  const userId = args.req.session!.sub;
  const db = getDb();
  const cost = db.estimateTokenCost(args.query);
  const user = await db.getUser(userId);
  if (!user) {
    args.res.status(401).json({ error: "Session invalid." });
    return;
  }

  const chargeAmount = Math.min(cost, user.tokens.balance);
  if (chargeAmount <= 0) {
    args.res.status(402).json({ error: "Insufficient token balance." });
    return;
  }

  const reserved = await db.tryConsumeTokens(userId, chargeAmount);
  if (!reserved.success) {
    args.res.status(402).json({ error: "Insufficient token balance." });
    return;
  }
  incrementMetric("billing.charges");

  const job = await db.createJob({ userId, mode: args.mode, status: "running" });
  args.res.setHeader("Content-Type", "text/plain; charset=utf-8");
  args.res.setHeader("Cache-Control", "no-cache, no-transform");
  args.res.setHeader("X-Accel-Buffering", "no");

  const controller = new AbortController();
  args.req.on("close", () => controller.abort());

  const logHistory = shouldLogChatHistory(args.mode);
  let assistantText = "";
  try {
    if (logHistory) await db.appendTextHistory({ userId, role: "user", content: args.query });
    for await (const chunk of args.stream) {
      assistantText += chunk;
      args.res.write(chunk);
    }
    if (logHistory) {
      await db.appendTextHistory({ userId, role: "assistant", content: assistantText });
    }
    await db.finishJob(job.id, "completed");
    args.res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Streaming failed.";
    if (assistantText.length === 0) {
      await db.refundTokens(userId, chargeAmount);
      incrementMetric("billing.refunds");
    }
    await db.finishJob(job.id, "failed", message);
    if (!args.res.headersSent) {
      args.res.status(500).json({ error: message });
    } else {
      args.res.write(`\n\n[Error] ${message}`);
      args.res.end();
    }
  }
}
