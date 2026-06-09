#!/bin/bash
# MagusMe Deploy Script
# Run from Git Bash (NOT PowerShell) on Windows
# Usage: ./deploy.sh

set -e

VPS_IP="178.105.155.211"
SSH_KEY="C:/Users/torah/.ssh/id_rsa"
SSH_CMD="ssh -i $SSH_KEY root@$VPS_IP"
SCP_CMD="scp -i $SSH_KEY"

echo "🔮 MagusMe Deploy Script"
echo "========================"
echo ""

# 1. Build frontend
echo "📦 Building frontend..."
npx vite build
echo "✅ Frontend built"
echo ""

# 2. Copy production env
cp .env.production .env

# 3. Upload to VPS
echo "📤 Uploading to VPS ($VPS_IP)..."
$SCP_CMD -r dist/* root@$VPS_IP:/root/magusme/dist/
echo "   dist/ uploaded"

$SCP_CMD -r src/server root@$VPS_IP:/root/magusme/
echo "   src/server/ uploaded"

$SCP_CMD server/index.ts server/app.ts root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/routes root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/middleware root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/auth root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/lib root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/startup root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/utils root@$VPS_IP:/root/magusme/server/
$SCP_CMD -r server/types root@$VPS_IP:/root/magusme/server/
echo "   server/ uploaded"

$SCP_CMD ecosystem.config.cjs .env root@$VPS_IP:/root/magusme/
echo "   config uploaded"
echo ""

# 4. Install deps and restart on VPS
echo "🔄 Restarting server on VPS..."
$SSH_CMD "cd /root/magusme && npm install --production && npx tsc --noEmit 2>/dev/null; pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs"
echo ""

# 5. Reload Nginx
echo "🔄 Reloading Nginx..."
$SSH_CMD "systemctl reload nginx || nginx -s reload"
echo ""

echo "✅ Deploy complete!"
echo "   Frontend: http://$VPS_IP"
echo "   Backend:  http://$VPS_IP:3001"
echo "   Health:   http://$VPS_IP:3001/api/health"