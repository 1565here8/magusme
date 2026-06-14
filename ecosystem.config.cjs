// PM2 Ecosystem for MagusMe production deployment
// Main server + Nightly content adder

module.exports = {
  apps: [
    {
      name: "magusme",
      script: "node_modules/.bin/tsx",
      args: "server/index.ts",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        OLLAMA_HOST: "http://127.0.0.1:11434",
        OLLAMA_MODEL: "qwen2.5:3b",
        OLLAMA_KEEP_ALIVE: "-1",
      },
      error_file: ".data/pm2-magusme-error.log",
      out_file: ".data/pm2-magusme-out.log",
      time: true,
      max_restarts: 10,
      restart_delay: 5000,
      autorestart: true,
    },
    {
      name: "nightly-content-adder",
      script: "node_modules/.bin/tsx",
      args: "server/scripts/nightly-content-adder.ts",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        OLLAMA_HOST: "http://127.0.0.1:11434",
        OLLAMA_MODEL: "qwen2.5:3b",
        OLLAMA_KEEP_ALIVE: "-1",
        ARCANA_LIVE_INDEX: "true",
        ARCANA_COMPREHENSIVE_INDEX: "false",
        ARCANA_INGEST_MAX: "12",
        ARCANA_INGEST_DOCS: "8",
      },
      error_file: ".data/pm2-nightly-error.log",
      out_file: ".data/pm2-nightly-out.log",
      time: true,
      max_restarts: 10,
      restart_delay: 10000,
      autorestart: true,
      cron_restart: "0 3 * * *", // Restart at 3 AM daily to ensure fresh run
    },
  ],
};