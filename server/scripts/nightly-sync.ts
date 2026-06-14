import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const PROJECT_DIR = "/Users/mymac/Desktop/magusme-main";
const LOG_DIR = `${PROJECT_DIR}/.data/logs`;
const DB_PATH = `${PROJECT_DIR}/.data/store.sqlite`;
const VPS_HOST = "178.105.155.211";
const VPS_USER = "root";
const VPS_DB_PATH = "/var/www/magusme/.data/store.sqlite";
const VPS_BACKUP_DIR = "/var/www/magusme/.data/backups";
const SSH_KEY = "/Users/mymac/.ssh/magusme-vps";

function log(msg: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
}

function runCmd(cmd: string, args: string[], opts = {}) {
  log(`Running: ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { ...opts, encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  if (result.stdout) log(`stdout: ${result.stdout}`);
  if (result.stderr) log(`stderr: ${result.stderr}`);
  if (result.error) log(`error: ${result.error.message}`);
  if (result.status !== 0) log(`exit code: ${result.status}`);
  return result;
}

function ssh(args: string[]) {
  return runCmd("ssh", ["-i", SSH_KEY, "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", ...args]);
}

function rsync(args: string[]) {
  return runCmd("rsync", ["-e", `ssh -i ${SSH_KEY} -o BatchMode=yes`, ...args]);
}

async function main() {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

  log("=== Nightly MagusMe Spell Generation & Sync Started ===");

  log("Step 1: Generating spells locally...");
  const genResult = runCmd("npx", ["tsx", "server/scripts/bulk-generate-spells.ts"], { cwd: PROJECT_DIR });
  if (genResult.status !== 0) {
    log("Generation failed, aborting sync");
    process.exit(1);
  }

  if (!existsSync(DB_PATH)) {
    log("Database not found after generation");
    process.exit(1);
  }

  log("Step 2: Testing SSH connection to VPS...");
  const sshTest = ssh([`${VPS_USER}@${VPS_HOST}`, "echo 'SSH OK'"]);

  if (sshTest.status !== 0) {
    log("⚠️  SSH key not working for VPS. Skipping VPS sync.");
    log("   Database updated locally at:", DB_PATH);
    log("=== Nightly MagusMe Spell Generation Complete (local only) ===");
    return;
  }

  log("Step 3: Creating backup on VPS...");
  ssh([`${VPS_USER}@${VPS_HOST}`, `mkdir -p ${VPS_BACKUP_DIR} && cp ${VPS_DB_PATH} ${VPS_BACKUP_DIR}/store.sqlite.$(date +%F_%H-%M-%S)`]);

  log("Step 4: Syncing database to VPS...");
  const syncResult = rsync(["-avz", "--progress", DB_PATH, `${VPS_USER}@${VPS_HOST}:${VPS_DB_PATH}`]);

  if (syncResult.status !== 0) {
    log("Rsync failed!");
    process.exit(1);
  }

  log("Step 5: Restarting PM2 on VPS...");
  ssh([`${VPS_USER}@${VPS_HOST}`, `cd /root/magusme && pm2 restart ecosystem.config.cjs --update-env`]);

  log("=== Nightly MagusMe Spell Generation & Sync Complete ===");
}

main().catch((err) => {
  log(`Fatal error: ${err}`);
  process.exit(1);
});