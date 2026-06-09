# MagusMe — The Vault of the Universe

> **Single source of truth**: Everything about MagusMe — vision, architecture, deployment, decisions, and current state.

---

## 1. Vision

**MagusMe is the Void — the Vault of the Universe.**

Everything that has ever been known to humanity about changing the course of nature to your favor. Magic, divination, astrology, psychology, manifestation, occult knowledge — all in one place.

- **No more bullshit era.** Real magic, real spells, no scammers, no pay-to-hear-stories.
- **No censorship.** Every tradition from white to black. Every spell shown in full with full price disclosure.
- **Self-worth is the greatest revenge.** The oracle teaches this through experience, not lecture.
- **The AI believes in magic.** Not a generic chatbot — a practitioner's assistant.

### What MagusMe is NOT
- NOT an AI tier marketplace (Cloud/Pocket/Corporate — those belong to AllMagus/Curionilabs)
- NOT a generic chatbot platform
- NOT a pay-to-hear-stories scam

---

## 2. Design Language

**Tesla-inspired minimalism.** Clean, dark-first, premium.

- **Typography**: Inter (400/500/600/700) for body, serif for oracle titles
- **Colors**: Purple violet accent (#7c3aed light / #a78bfa dark), zinc neutrals
- **Brand mark**: Star of David hexagram (hexagram) — animated SVG with purple/gold gradients, glow filters, slow rotation pulse. Represents the 6 pillars of the ecosystem + the center = the Void.
- **Spacing**: Generous whitespace, nothing cramped
- **Borders**: 1px solid rgba(255,255,255,0.06) dark / rgba(0,0,0,0.06) light
- **Radius**: 12px cards, 16px panels, 9999px buttons/badges
- **Shadows**: Layered (xs/sm/md/lg/xl), subtle
- **Animations**: fade-in, slide-up, scale-in — 200-300ms cubic-bezier(0.16, 1, 0.3, 1)
- **Glass morphism**: Backdrop blur on header, card hover states

---

## 3. Ecosystem Pillars

### 3.1 Oracle — All Divination, One Place
- **Tarot**: Rider-Waite, Thoth, Marseille, Shadow, Vampire, Gothic, Norse, Egyptian, Anime — plus Lenormand, Kipper, Gypsy, Sibilla, Angel cards
- **Spreads**: 3-card, Celtic Cross, horseshoe, relationship, career, yes/no, year ahead, chakra
- **Reversals**, combinations, AI contextual readings, save/share
- **Rune Casting**: Elder Futhark, Anglo-Saxon, Younger Futhark, blank rune, spreads
- **Astrology**: Natal charts, Vedic, Chinese BaZi, Celtic tree signs, Norse runes-by-birth
- **Bone Reading (Osteomancy)**: Throw bones, AI pattern analysis, photo upload
- **Animal Oracle**: Spirit animals, totems, cross-cultural meanings
- **Scrying**: Crystal ball, obsidian mirror, water/fire gazing
- **Pendulum**: Dowsing, yes/no, body mapping, spirit communication
- **I Ching**: Coin toss, yarrow stalks, hexagram interpretation
- **Geomancy**: Earth divination, shield charts, house charts
- **Numerology**: Life path, destiny numbers, name analysis
- **Tasseography**: Tea leaf/coffee cup reading — photo upload, AI analysis
- **Cartomancy**: Lenormand, Kipper, playing cards, Sibilla
- **Augury**: Bird flight, cloud patterns, natural signs
- **Oneiromancy**: Dream interpretation, lucid dreaming guidance
- **Bibliomancy**: Random book passage divination
- **Cleromancy**: Dice, stones, random casting

### 3.2 Grimoire — The Living Library
- **Interconnected**: every spell links to its counter
- **Evil eye & protection hub** — dedicated, universal
- **Counter-spell linking**: harmful spells → protection/removal links
- **Living**: grows daily via AI scanner + community submissions
- **All legitimate books**: Book of Shadows, Key of Solomon, Goetia, Eddas, Atharva Veda, etc.
- **Organized by**: tradition, era, difficulty, danger level, purpose

### 3.3 Magubrain — AI Search
- Natural language: "sex spell" → results
- Optional filters: elements, colors, times, days, planetary hours, moon phases, traditions, difficulty, danger, purpose
- Voice input, search suggestions, cross-tradition results
- The AI believes in magic — no bullshit, no "explaining away"

### 3.4 Planetary Watch — Live
- Real-time display of current planetary hour
- Today's full schedule — hour-by-hour breakdown
- Countdown timer — minutes remaining
- What magic is strongest NOW — AI top 5
- Notifications when key planets rise
- Integration with search: "fire spells in next hour of Mars"

### 3.5 Spell Box — Random Spell Puller
- AI pulls random relevant spells based on request
- Shows: materials, steps, difficulty, tradition, safety warnings
- Every spell links to its counter
- Every destructive spell shows: karmic price, blowback, better option
- Planetary hour filter, element + color + time + purpose combinable
- Categories: love, money, protection, revenge, evil eye, destruction, healing, knowledge, power, self-mastery, letting go, transmutation

### 3.6 History of Magic — Verified Evidence
- Timeline from prehistory to present
- Archaeological evidence, written records, scientific studies
- Court records, royal practitioners, institutional magic
- Interactive timeline — zoom into any era
- **History Bar**: Progressive learning (0→100) per tradition, with lessons, quizzes, mastery badges

### 3.7 Manifestation Library (East + West)
- LOA, Vedic, Buddhist, Taoist, Chaos, Hoodoo, Wiccan, Herbal, Blood/Offering, Psychological, Sexual, Death/Boundary
- Step-by-step, difficulty, timing, tradition origin

### 3.8 Community
- Groups by tradition/intention
- Real-time chat rooms, private messaging
- Community verification, moderation tools
- Events — group meditation, collective rituals

### 3.9 Credits (Payments)
- **PayRAM only** — self-hosted crypto gateway, no Stripe
- **Prepay model**: buy credits → spend → never overdraft
- Free tier: search, community, basic grimoire, 3 oracle readings/day
- Paid: AI readings, spell box, advanced content
- $0.10/credit. Oracle reading: 5cr, Spell box: 3cr, Coffee cup: 10cr, Full grimoire: 20cr/session

---

## 4. Actual Tech Stack (Current)

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + tsx (hot reload dev) |
| Database | SQLite via better-sqlite3 (NOT PostgreSQL) — `.data/magusme.db`, WAL mode |
| Auth | PBKDF2 + JWT (`nc_token` httpOnly cookie) + CSRF (`nc_csrf` double-submit) |
| AI Streaming | SSE (server-sent events) — provider chain: Gemini → Groq → xAI → OpenRouter → Mock |
| Payments | PayRAM self-hosted (Docker: payramapp/payram:latest, internal PostgreSQL) |
| Premium AI | Free users: `google/gemma-4-31b-it:free` on OpenRouter; Premium: `openai/gpt-4o-mini` |
| Process Manager | PM2 via `ecosystem.config.cjs` (`.cjs` required — project uses `"type": "module"`) |
| Reverse Proxy | Nginx (serves `dist/`, proxies `/api/` to 3001, no buffering for SSE) |
| Deployment | Hetzner Cloud VPS + Python paramiko scripts |

---

## 5. Server

| Item | Value |
|------|-------|
| Provider | Hetzner Cloud |
| Name | `magusme-prod` |
| ID | `138334086` |
| Type | cx23 (2 vCPU, 4GB RAM, 40GB disk) |
| IP | `178.105.155.211` |
| Region | Falkenstein (fsn1) |
| OS | Ubuntu 24.04 |
| Root password | `P9cg3d3pxtLH` |
| App location | `/var/www/MagusMe/` |
| Node.js port | `3001` |
| Nginx config | `/etc/nginx/sites-available/magusme` |
| PM2 config | `/var/www/MagusMe/ecosystem.config.cjs` |
| Database | `/var/www/MagusMe/.data/magusme.db` |
| PayRAM | Docker container — ports 8080 (API), 8081 (frontend), internal PostgreSQL |
| PayRAM env | `/root/payram/.env` (AES key + PG password) |
| iptables | Ports 8080/8081 blocked to external — only localhost + Cloudflare tunnel + Nginx proxy (8444) |

**CRITICAL**: Windows OpenSSH hangs after auth. Use Python paramiko for all remote operations.

---

## 6. Database (SQLite — 16 Tables)

### 6.1 Schema
```sql
-- Users & auth
users             -- id, email, password_hash, display_name, avatar_url, role, credits,
                  --    created_at, last_seen_at, premium_until, premium_model
sessions          -- id, user_id, token_hash, refresh_token_hash, csrf_token,
                  --    ip_address, user_agent, expires_at
bans              -- id, type(user|ip|email), value, reason, banned_by, banned_at

-- Content
spells            -- id, title, tradition, category, content, difficulty, danger_level,
                  --    elements[], colors[], planetary_hours[], moon_phases[], purpose[],
                  --    is_baneful, counter_spell_id, source, submitted_by, status,
                  --    verified_by, timestamps
tarot_decks       -- id, name, tradition, card_count, artwork_url
tarot_cards       -- id, deck_id, name, number, suit, meaning_upright, meaning_reversed, description
readings          -- id, user_id, type, spread_type, cards JSONB, interpretation, credits_spent
grimoire_books    -- id, title, tradition, era, author, summary, content, difficulty, is_free
practices         -- id, name, tradition, region, spectrum_level, history, key_figures,
                  --    techniques, safety_notes, related_texts[], difficulty

-- Community
groups            -- id, name, type(tradition|intention), description, created_by
group_members     -- group_id, user_id, role, joined_at
messages          -- id, group_id, user_id, content, created_at

-- Payments
transactions      -- id, user_id, type(topup|spend|refund), amount, credits, method(payram),
                  --    status(pending|completed|failed), external_id, created_at

-- Learning
tradition_progress -- user_id, tradition, level(0-100), lessons_completed, quizzes_passed

-- Moderation
submissions        -- id, user_id, spell_id, title, tradition, content, status, verified_by
scanner_runs       -- id, started_at, finished_at, spells_found, errors, sources JSONB, log
```

### 6.2 Seed Data
- **Admin user**: admin@magusme.com / admin123
- **10 spells** across love, money, protection, baneful categories
- **3 practices**: Divination (egyptian), Ceremonial Magic (european), Divination (norse)
- **3 tarot decks**: Rider-Waite, Thoth, Marseille
- **1 grimoire book**: The Lesser Key of Solomon (medieval, ceremonial)

---

## 7. Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `BrandHome` → `EcosystemHub` | Ecosystem hub with hexagram brand mark |
| `/merlian`, `/arcana` | `ArcanaPage` | Oracle — tarot, runes, AI readings, PremiumPanel |
| `/cloud` | `CloudCorePage` | (legacy, not part of MagusMe vision) |
| `/pocket` | `LocalCorePage` | (legacy, not part of MagusMe vision) |
| `/local` | `LocalCorePage` | (legacy, not part of MagusMe vision) |
| `/admin` | `AdminPage` | Dashboard, users, payments, content, scanner |
| `/terms` | `TermsPage` | Terms of service |
| `/privacy` | `PrivacyPage` | Privacy policy |

### Key Components
- **`EcosystemHexagram`**: Animated SVG hexagram — centerpiece of the brand, 6 edges represent ecosystem pillars
- **`EcosystemHub`**: Hero + manifesto + 9 pillar cards + CTA — replaces old AI tier landing
- **`ArcanaPage`**: Oracle page with decorative `TarotSpread`, `PremiumPanel` sidebar, rune glyphs in output
- **`PremiumPanel`**: Premium status card — subscribe button, model info, days-remaining countdown
- **`BrandSiteHeader`**: Nav = Home, Oracle (no Cloud/Pocket/Corporate)
- **`TarotSpread`**: Decorative 12-card spread for the oracle page header

---

## 8. Backend API

### 8.1 Auth
```
POST   /api/auth/bootstrap       # Create anonymous session
POST   /api/auth/register        # Email/password register
POST   /api/auth/login           # Email/password login
POST   /api/auth/logout          # Clear session
GET    /api/auth/csrf            # Get CSRF token
GET    /api/me                   # Get current user (includes premium status)
PUT    /api/me                   # Update profile
GET    /api/billing              # Get billing info + premium status
```

### 8.2 Arcana (Oracle)
```
POST   /api/arcana/consult/stream  # SSE — oracle consultation (tarot, runes, etc.)
POST   /api/arcana/search/stream   # SSE — AI search (Magubrain)
```

### 8.3 Payments (PayRAM)
```
POST   /api/payments/create-checkout  # Create PayRAM checkout → returns URL
POST   /api/payments/webhook          # PayRAM webhook (credits user on success)
GET    /api/payments/status           # Check transaction status
GET    /api/payments/transactions     # Transaction history
GET    /api/payments/health           # PayRAM health check
```

### 8.4 Health
```
GET    /api/health                 # Server health
```

### 8.5 Planned (from blueprint, not implemented)
```
GET    /api/grimoire/spells        # Search spells
GET    /api/grimoire/spell/:id     # Full spell
GET    /api/grimoire/books         # List books
GET    /api/oracle/planetary-hours # Live planetary hours
POST   /api/oracle/spell-box       # Random spell pull
GET    /api/groups                 # Community groups
POST   /api/groups/:id/messages    # Chat
POST   /api/history/lesson/complete
POST   /api/admin/metrics          # Admin dashboard
```

---

## 9. AI System

### 9.1 Personality
- Believes in magic — as force, not metaphor
- Doesn't explain away — says "here's the tradition, here's the technique"
- Practitioner's assistant — knows planetary hours, herbs, sigils
- Opinionated — "this spell is weak, try this instead"
- Grounded — knows grimoire entries from Reddit posts
- Connects everything — fire magic shows Norse, Hindu, Chaos, Hoodoo, Ceremonial
- Never judges your path
- Learns from every interaction

### 9.2 Provider Chain (fallback order)
1. **Gemini** (`google/gemini-1.5-flash-latest`) — primary, fast
2. **Groq** (`llama-3.1-70b-versatile`) — fallback
3. **xAI** (`grok-2-1212`) — fallback
4. **OpenRouter** (free model for free users, premium model for premium) — fallback
5. **Mock** — last resort, returns canned response

Controlled by `ARCANA_CLOUD_PREFER` env var (e.g. `gemini` | `groq` | `xai` | `openrouter` | `mock`).

### 9.3 Premium AI Routing
- **Free tier**: `google/gemma-4-31b-it:free` on OpenRouter (known 429 rate limit issue)
- **Premium tier** ($20/day): `openai/gpt-4o-mini` (~$0.15-0.60/M tokens, ~$3/day budget covers thousands of queries)
- Routing logic: `streamAiResponse()` accepts `{ premium?: boolean }` — backend resolves model and passes it to `streamFromOpenRouter()`
- Premium status tracked via DB column `users.premium_until`

### 9.4 Known Issues
- Free OpenRouter model `google/gemma-4-31b-it:free` gets 429 rate-limited — needs retry logic or switch to reliable free model (`google/gemini-2.0-flash-lite-preview-02-05:free` might work)

---

## 10. PayRAM — Self-Hosted Crypto Payments

### 10.1 Architecture
- **Docker container**: `payramapp/payram:latest` running on the same VPS
- **Internal services**: PostgreSQL (within Docker compose), PayRAM API + frontend
- **Golang backend**: handles BTC/ETH/USDC/USDT payments
- **Config files**: `/root/payram/docker-compose.yml`, `/root/payram/.env`
- **Setup script**: `payram/setup.sh` — installs Docker, generates AES key + PG password, starts containers

### 10.2 Ports & Access
| Port | Service | Access |
|------|---------|--------|
| 8080 | PayRAM API | Localhost only (iptables) |
| 8081 | PayRAM Admin UI | Localhost only (iptables) |
| 8444 | PayRAM via Nginx HTTPS | External (self-signed cert) |
| 8082 | PayRAM via Nginx HTTP | Redirects to 8444 |
| Tunnel | PayRAM Admin UI | Cloudflare tunnel URL with real SSL |

### 10.3 Cloudflare Tunnel
- **Command**: `cloudflared tunnel --url http://localhost:8081`
- **Current URL**: `https://engineer-ram-seem-albums.trycloudflare.com` (random, changes each restart)
- **Purpose**: Temporary HTTPS access to create PayRAM admin account (signup + generate API key)
- **After setup**: Tunnel not needed — API key goes into MagusMe `.env`

### 10.4 Setup Status
- [x] Docker containers running
- [x] iptables blocking 8080/8081 externally
- [x] Nginx proxy (8082→301, 8444→proxy to 8081)
- [x] Cloudflare tunnel active
- [ ] **Root account needs creation** — visit tunnel URL /signup, create email+password
- [ ] **API key generation** — from PayRAM admin dashboard
- [ ] **Set `PAYRAM_API_KEY` and `PAYRAM_BASE_URL`** in MagusMe `.env` on VPS

---

## 11. Nginx Configuration

### 11.1 Main Site (`/etc/nginx/sites-available/magusme`)
```
server {
    listen 80;
    server_name _;
    root /var/www/MagusMe/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri /index.html;
    }

    # API proxy — no buffering for SSE
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
    }
}
```

### 11.2 PayRAM Proxy Blocks (in same file)
```
# PayRAM HTTP → redirect to HTTPS
server {
    listen 8082;
    return 301 https://$host:8444$request_uri;
}

# PayRAM HTTPS with self-signed cert
server {
    listen 8444 ssl;
    ssl_certificate /etc/nginx/ssl/payram.crt;
    ssl_certificate_key /etc/nginx/ssl/payram.key;
    location / { proxy_pass http://127.0.0.1:8081; }
}
```

---

## 12. AI Streaming (SSE) Flow

```
User Query → ArcanaPage frontend
  → POST /api/arcana/consult/stream { query, context, premium? }
    → streamsAiResponse() in ai.ts
      → determine provider order from ARCANA_CLOUD_PREFER
      → fallback chain: gemini → groq → xai → openrouter → mock
      → if premium: pass model override to streamFromOpenRouter()
      → each chunk sent as SSE event to client
  → ArcanaPage accumulates chunks in state, renders streamed text
```

---

## 13. Deployment

### 13.1 Build & Deploy
```bash
# Local
npm run build              # Vite → dist/

# Upload to VPS (use Python paramiko — Windows SSH is broken)
python scripts/deploy_frontend.py   # Uploads dist/, restarts PM2, reloads Nginx

# On server
cd /var/www/MagusMe
npm install
npm run build
pm2 restart ecosystem.config.cjs
systemctl reload nginx
```

### 13.2 PM2 Config (`ecosystem.config.cjs`)
```js
module.exports = {
  apps: [{
    name: 'magusme',
    script: 'tsx',
    args: 'src/server/index.ts',
    cwd: '/var/www/MagusMe',
    env: { NODE_ENV: 'production' }
  }]
};
```
Must be `.cjs` — project uses `"type": "module"` in package.json.

### 13.3 Environment Variables (`.env` at project root)
```
JWT_SECRET=...
CSRF_SECRET=...
GEMINI_API_KEY=...
GROQ_API_KEY=...
XAI_API_KEY=...
OPENROUTER_API_KEY=...
ARCANA_CLOUD_PREFER=gemini
PAYRAM_API_URL=http://localhost:8080  # self-hosted PayRAM
PAYRAM_API_KEY=...                     # pending — needs PayRAM root setup first
```

---

## 14. Security

- JWT (`nc_token`) httpOnly cookie + CSRF (`nc_csrf`) double-submit pattern
- Rate limiting: token-bucket per IP (10 immediate, 60/h replenish)
- Input validation: Zod schemas on all endpoints
- SQL injection: parameterized via better-sqlite3
- XSS: React escapes by default
- iptables: external ports 8080/8081 blocked, only Nginx (80/443/8444) + tunnel exposed
- Admin role check middleware

---

## 15. Build Order (Remaining)

### Phase 1 — Core (DONE)
- [x] Brand identity (hexagram, routes, tagline, theming)
- [x] Backend server running (Express, SQLite, 3001)
- [x] Auth system (bootstrap, register, login, JWT+CSRF)
- [x] Database schema (16 tables) + seeds
- [x] Nginx + PM2 deployment
- [x] Admin panel UI
- [x] PayRAM Docker deployment
- [x] Cloudflare tunnel for PayRAM setup
- [x] Ecosystem hub home page (hexagram + 9 pillars)

### Phase 2 — Oracle (PARTIALLY DONE)
- [x] AI streaming (SSE, provider chain, premium routing)
- [x] ArcanaPage with TarotSpread decoration
- [x] PremiumPanel component
- [ ] Tarot card data + deck selection UI
- [ ] Rune casting UI
- [ ] Astrology chart UI
- [ ] Planetary hours live display
- [ ] Spell box UI
- [ ] All other divination systems

### Phase 3 — Content (NOT STARTED)
- [ ] Grimoire database full population
- [ ] Magic scale index UI
- [ ] Practices index UI
- [ ] Counter-spell linking
- [ ] History of magic timeline

### Phase 4 — Community (NOT STARTED)
- [ ] Groups & chat (schema exists, endpoints planned)
- [ ] Community submissions
- [ ] Verification system

### Phase 5 — Payments (BLOCKED)
- [ ] **PayRAM root account creation** (user must visit tunnel /signup)
- [ ] **API key configuration** in `.env`
- [ ] Credits UI (balance display, top-up flow)
- [ ] Prepay flow end-to-end

### Phase 6 — Polish (NOT STARTED)
- [ ] AI scanner cron job
- [ ] History bar (learning tracks)
- [ ] Animations & transitions
- [ ] Analytics
- [ ] Security audit

---

## 16. Known Issues

1. **Windows OpenSSH broken** — use Python paramiko for VPS access
2. **Free AI model rate-limited** — `google/gemma-4-31b-it:free` returns 429 — needs retry or fallback model
3. **PayRAM setup blocked** — needs manual browser signup via Cloudflare tunnel
4. **No domain DNS** — site accessible by IP only, no HTTPS for main site
5. **Pre-existing TS errors** — `frasdaiaBrand.ts:36` (route type mismatch), `payments.ts:40` (`amountInUsd` vs `amountInUSD`)
6. **No iptables persistence check** — rules might not survive VPS reboot
7. **Self-signed cert for PayRAM** — browser shows warning on port 8444

---

## 17. Important Decisions & Conventions

- **TypeScript `"type": "module"`** — PM2 config MUST be `.cjs`
- **PayRAM sole payment processor** — Stripe was removed, no third-party
- **Premium model**: `openai/gpt-4o-mini` — cost ~$0.15-0.60/M tokens, $20/day user pays $3/day cost
- **Free model**: OpenRouter free tier — `google/gemma-4-31b-it:free` (needs better fallback)
- **Credit economy**: $0.10/credit, prepay model (never overdraft)
- **"Corporate" tier rejected** — not part of the magic/spiritual vision
- **Hexagram brand mark** — 6 ecosystem pillars + center = the Void
- **Cookies**: `nc_token` (httpOnly JWT) + `nc_csrf` (client-readable)
- **AI provider control**: env var `ARCANA_CLOUD_PREFER` sets preferred provider
- **SSE for streaming** — not WebSocket, not REST polling
- **Ecosystem hub (not oracle dump)** at `/` — hexagram hero + pillar cards + manifesto

