#!/bin/bash
# Nightly spell content filler - runs every night via cron
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$(dirname "$DIR")"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG="$DIR/output/nightly_$TIMESTAMP.log"
exec > >(tee -a "$LOG") 2>&1

echo "[$(date)] Starting nightly spell fill..."

# Source ADMIN_SECRET from .env
if [[ -f .env ]]; then
  source .env 2>/dev/null || true
fi
export ADMIN_SECRET

# Run the Python filler
python3 "$DIR/fill-spells.py" --auto

echo "[$(date)] Nightly spell fill complete."
