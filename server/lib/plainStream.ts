import type { Response } from "express";

export async function runPlainTextStream(
  res: Response,
  stream: AsyncGenerator<string>,
): Promise<void> {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  try {
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(503).json({
        error: err instanceof Error ? err.message : "Stream failed",
      });
      return;
    }
    res.end();
  }
}
