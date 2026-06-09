// PM2 Ecosystem for MagusMe production deployment
// Uses tsx to run TypeScript server directly (no compile step needed)
// Client is served via Nginx reverse proxy to port 3001

module.exports = {
  apps: [{
    name: "magusme",
    script: "node_modules/.bin/tsx",
    args: "server/index.ts",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3001,
    },
    error_file: ".data/pm2-error.log",
    out_file: ".data/pm2-out.log",
    time: true,
    max_restarts: 10,
    restart_delay: 5000,
  }],
};
