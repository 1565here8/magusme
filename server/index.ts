import dotenv from "dotenv";
import { createApp } from "./app";
import { startNightlyScanner } from "../src/server/arcana/scannerBot";

dotenv.config();

const port = Number(process.env.PORT ?? 3001);

const app = await createApp();

// Start the nightly AI scanner bot
startNightlyScanner().catch(err => console.error("[scanner] failed to start:", err));

app.listen(port, () => {
  console.log(`[magusme] server http://localhost:${port}`);
  console.log("[magusme] ollama AI scanner bot is running (24h cycle)");
});
