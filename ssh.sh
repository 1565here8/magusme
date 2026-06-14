#!/bin/bash
# Source VPS config from .vps-config.json
VPS_HOST=$(jq -r '.vps.host' "$(dirname "$0")/.vps-config.json" 2>/dev/null || echo "178.105.155.211")
VPS_USER=$(jq -r '.vps.user' "$(dirname "$0")/.vps-config.json" 2>/dev/null || echo "root")
SSH_KEY=$(jq -r '.vps.sshKey' "$(dirname "$0")/.vps-config.json" 2>/dev/null || echo "~/.ssh/magusme-vps")

ssh -i "${SSH_KEY/#\~/$HOME}" "${VPS_USER}@${VPS_HOST}" "$@"