#!/bin/bash
# MagusMe Deploy Script
# Usage: ./deploy.sh

set -e

VPS_IP="178.105.155.211"
SSH_KEY="$HOME/.ssh/magusme-vps"
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

# 5. Configure Nginx
echo "🔄 Configuring Nginx..."
$SSH_CMD "
cat > /etc/nginx/sites-available/magusme << 'EOF'
server {
    listen 80;
    server_name magusme.com;

    root /root/magusme/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/magusme /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
"
echo "✅ Nginx configured"

echo "✅ Deploy complete!"
echo "   Frontend: http://$VPS_IP"
echo "   Backend:  http://$VPS_IP:3001"
echo "   Health:   http://$VPS_IP:3001/api/health"