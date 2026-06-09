# MagusMe — cloud launch (no VPS)

Run **magusme.com** on Railway or Render. Merlian readings use **Gemini** (fast) or **Groq** — no Ollama, no Hetzner.

---

## 1. Keys (pick one or both)

| Provider | Speed | Get key |
|----------|--------|---------|
| **Gemini Flash** | Default Merlian lane | https://aistudio.google.com/apikey |
| **xAI Grok** | Separate key (`XAI_API_KEY`) | https://console.x.ai |
| **Groq** | Fast Llama | https://console.groq.com |

---

## 2. Railway (recommended)

1. Push this repo to GitHub.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select repo.
3. **Settings → Build**: `npm run build`  
   **Start**: `npm start`  
   (or use `railway.toml` in repo root.)
4. **Variables** (copy from `.env.magusme-launch.example`):

```env
NODE_ENV=production
SERVE_CLIENT=true
TRUST_PROXY=1
CEREBELIX_V1_LAUNCH=true
JWT_SECRET=<64-char hex>
ADMIN_SECRET=<32-char random>
CORS_ORIGIN=https://magusme.com

SQLITE_DRIVER=builtin
DATA_DIR=/tmp/data

CLOUD_NO_TRAINING_ACTIVE=true
CLOUD_USE_GEMINI=true

ARCANA_ENABLED=true
ARCANA_CLOUD_LLM=true
ARCANA_CLOUD_PREFER=gemini

GEMINI_API_KEY=<google key>
DAGULAI_GEMINI_MODEL=gemini-2.0-flash

XAI_API_KEY=<xai grok key>
DAGULAI_XAI_MODEL=grok-4.3

GROQ_API_KEY=<optional fast backup>
DAGULAI_GROQ_MODEL=llama-3.1-8b-instant

SERVE_CLIENT=true

VPNIX_ENABLED=false
```

5. **Settings → Networking** → generate domain → test `https://<app>.up.railway.app/api/health`.
6. **Custom domain**: add `magusme.com` + `www` → Railway shows CNAME target.
7. At your registrar: point **A/CNAME** to Railway.
8. Set `CORS_ORIGIN=https://magusme.com` after DNS propagates.

---

## 3. Render (alternative)

- **New Web Service** → same repo.
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Instance**: free or starter (512MB+).
- Same env block as above.
- Custom domain → Render DNS instructions.

---

## 4. What you get live

| URL | Experience |
|-----|------------|
| `https://magusme.com/` | MagusMe hub (purple brand) |
| `/arcana` | Full Merlian readings UI |
| API | `/api/arcana/*` with Gemini/Groq streaming |

---

## 5. Prefer Gemini over Groq

```env
ARCANA_CLOUD_PREFER=gemini
CLOUD_USE_GEMINI=true
GEMINI_API_KEY=...
```

Keep `GROQ_API_KEY` unset or remove `ARCANA_CLOUD_PREFER=groq`.

---

## 6. Turn off VPS

When Railway health + domain work:

- Stop PM2 on Hetzner (`pm2 stop frasdaia`).
- Point `magusme.com` DNS only to Railway.
- Keep VPS only if you still host **dagulai.com** / **frasdaia.com** there.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Merlian says Ollama / blocked | `ARCANA_CLOUD_LLM=true` + `GROQ_API_KEY` or `GEMINI_API_KEY` |
| CORS errors | `CORS_ORIGIN` must match exact browser origin (https, no trailing slash) |
| Blank / "Cannot GET /" | `SERVE_CLIENT=true` + `npm run build` (creates `dist/`). |
| Slow readings | Use Groq + `llama-3.1-8b-instant` |
