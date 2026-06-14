#!/bin/bash
# ⚡ Deploy Pipeline — One script, any project, safe rollbacks
# Usage:
#   ./pipeline/deploy.sh                    # Deploy current project
#   ./pipeline/deploy.sh --watch            # Watch & auto-deploy on changes
#   ./pipeline/deploy.sh --rollback         # Rollback to previous version
#   ./pipeline/deploy.sh --status           # Check VPS status
#
# Config: deploy.config.json in project root
# Requires: ssh key access to VPS, rsync, fswatch (for --watch)

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[pipeline]${NC} $1"; }
ok()   { echo -e "${GREEN}✅${NC} $1"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }

# ── Config ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG="$PROJECT_DIR/deploy.config.json"
VPS_CONFIG="$PROJECT_DIR/.vps-config.json"

[ -f "$CONFIG" ] || fail "deploy.config.json not found in $PROJECT_DIR"
[ -f "$VPS_CONFIG" ] || fail ".vps-config.json not found in $PROJECT_DIR (create from .vps-config.json.example)"

read_config() {
  jq -r "$1" "$CONFIG" 2>/dev/null || fail "Failed to read config key: $1"
}
read_vps() {
  jq -r "$1" "$VPS_CONFIG" 2>/dev/null || fail "Failed to read VPS config key: $1"
}

PROJECT=$(read_config '.project')
VPS_HOST=$(read_vps '.vps.host')
VPS_USER=$(read_vps '.vps.user')
VPS_PATH=$(read_vps '.vps.path')
SSH_KEY=$(read_vps '.vps.sshKey')
VPS="$VPS_USER@$VPS_HOST"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${VPS_PATH}.bak.$TIMESTAMP"

# ── Helpers ───────────────────────────────────────────────────────────
build_frontend() {
  log "Building frontend..."
  (cd "$PROJECT_DIR" && eval "$(read_config '.build.build_command')") 2>&1 | tail -3
  ok "Frontend built"
}

upload() {
  log "Creating archive..."
  local ARCHIVE="/tmp/deploy-$PROJECT-$TIMESTAMP.tar.gz"
  cd "$PROJECT_DIR"
  
  # Collect include patterns, excluding node_modules etc
  local INCLUDE=""
  for item in $(read_config '.deploy.include[]'); do
    INCLUDE="$INCLUDE $item"
  done
  
  COPYFILE_DISABLE=1 tar czf "$ARCHIVE" $INCLUDE 2>/dev/null
  ok "Archive: $(du -h "$ARCHIVE" | cut -f1)"
  
  local SSH_OPTS="-o ConnectTimeout=30 -i ${SSH_KEY/#\~/$HOME}"
  
  # Upload
  log "Uploading to $VPS..."
  scp $SSH_OPTS "$ARCHIVE" "$VPS:$ARCHIVE" 2>&1 | tail -1
  ok "Archive uploaded"
  
  # Backup current deployment
  log "Backing up current deployment..."
  ssh $SSH_OPTS -o ConnectTimeout=15 "$VPS" "
    [ -d '$VPS_PATH/dist' ] && mv '$VPS_PATH' '$BACKUP_PATH' 2>/dev/null; mkdir -p '$VPS_PATH'
  " 2>&1 | tail -1
  ok "Backup saved to $BACKUP_PATH"
  
  # Extract
  log "Extracting on VPS..."
  ssh $SSH_OPTS -o ConnectTimeout=30 "$VPS" "
    cd '$VPS_PATH' && tar xzf '$ARCHIVE' && rm -f '$ARCHIVE'
    chmod -R 755 . 2>/dev/null || true
  " 2>&1 | tail -1
  ok "Files deployed"
  
  # Fix permissions for www-data
  ssh $SSH_OPTS -o ConnectTimeout=15 "$VPS" "
    if [ -d /var/www/${PROJECT,,} ]; then
      cp -r '$VPS_PATH/dist/'* /var/www/${PROJECT,,}/ 2>/dev/null || true
      chown -R www-data:www-data /var/www/${PROJECT,,}/ 2>/dev/null || true
    fi
  " 2>&1 | tail -1
}

restart_server() {
  local CMD=$(read_config '.deploy.restart_command')
  log "Restarting server..."
  ssh $SSH_OPTS "cd '$VPS_PATH' && npm install --production 2>&1 | tail -2 && $CMD 2>&1 | head -5" 2>&1
  ok "Server restarted"
}

health_check() {
  local ENDPOINT=$(read_config '.deploy.health_endpoint')
  log "Running health check..."
  sleep 3
  local RESULT=$(curl -s --connect-timeout 10 "http://$VPS_HOST:3001$ENDPOINT" 2>&1 || echo "failed")
  if echo "$RESULT" | grep -q '"ok":true'; then
    ok "Health check passed"
    return 0
  else
    warn "Health check: $RESULT"
    return 1
  fi
}

rollback() {
  log "Rolling back to previous version..."
  ssh $SSH_OPTS -o ConnectTimeout=15 "$VPS" "
    BACKUP=\$(ls -d ${VPS_PATH}.bak.* 2>/dev/null | sort | tail -1)
    if [ -n \"\$BACKUP\" ]; then
      rm -rf '$VPS_PATH'
      mv \"\$BACKUP\" '$VPS_PATH'
      echo 'Restored from backup'
    else
      echo 'No backup found'
    fi
  " 2>&1 | tail -1
  restart_server
  health_check && ok "Rollback successful" || fail "Rollback failed"
}

# ── Commands ──────────────────────────────────────────────────────────
cmd_deploy() {
  log "Deploying $PROJECT to $VPS:$VPS_PATH"
  echo ""
  
  local SHOULD_BUILD=$(read_config '.build.frontend')
  [ "$SHOULD_BUILD" = "true" ] && build_frontend
  
  upload
  restart_server
  
  if health_check; then
    echo ""
    ok "Deployment complete!"
    echo "   https://$VPS_HOST"
    echo "   http://$VPS_HOST:3001$ENDPOINT"
  else
    warn "Deploy failed health check. Rolling back..."
    rollback
  fi
}

cmd_watch() {
  if ! command -v fswatch &>/dev/null; then
    warn "fswatch not found. Install: brew install fswatch"
    log "Falling back to polling every 10s..."
    while true; do
      inotifywait -r -e modify,create,delete "$PROJECT_DIR/src" 2>/dev/null || sleep 10
      cmd_deploy
    done
  fi
  
  log "Watching $PROJECT_DIR/src for changes..."
  fswatch -o "$PROJECT_DIR/src" | while read; do
    log "Change detected! Deploying..."
    cmd_deploy
    echo ""
  done
}

cmd_status() {
  log "$PROJECT — VPS Status"
  echo ""
  ssh $SSH_OPTS -o ConnectTimeout=10 "$VPS" "
    echo '📦 PM2:'
    pm2 status 2>/dev/null | grep -E 'magusme|online|name' | head -5
    echo ''
    echo '💾 Disk:'
    df -h / | tail -1 | awk '{print \"  Used: \" \$3 \" / \" \$2 \" (\" \$5 \")\"}'
    echo ''
    echo '🌐 Web:'
  " 2>&1
  curl -s -o /dev/null -w "  HTTP %{http_code} — https://$VPS_HOST\n" --connect-timeout 5 "https://$VPS_HOST" 2>&1 || echo "  Offline"
  curl -s -o /dev/null -w "  API  %{http_code} — http://$VPS_HOST:3001/api/health\n" --connect-timeout 5 "http://$VPS_HOST:3001/api/health" 2>&1 || echo "  Offline"
}

# ── Main ──────────────────────────────────────────────────────────────
case "${1:-deploy}" in
  deploy)    cmd_deploy ;;
  --deploy)  cmd_deploy ;;
  --watch)   cmd_watch ;;
  watch)     cmd_watch ;;
  -w)        cmd_watch ;;
  --rollback) rollback ;;
  rollback)  rollback ;;
  --status)  cmd_status ;;
  status)    cmd_status ;;
  *)
    echo "Usage: ./pipeline/deploy.sh [--watch|--rollback|--status]"
    exit 1
    ;;
esac
