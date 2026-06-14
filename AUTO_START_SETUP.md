# MagusMe 24/7 Automated Setup Reference

## Overview
Complete automated system for running magusme.com with local Ollama AI on macOS. **Real content only - no fake generated spells.**

## Services Running 24/7

| Service | Manager | Auto-Start | Purpose |
|---------|---------|------------|---------|
| **Ollama** | launchd | `com.ollama.server.plist` | Local LLM server (port 11434) |
| **Ollama Env** | launchd | `com.ollama.env.plist` | Keeps models loaded forever |
| **MagusMe Server** | PM2 | `com.magusme.pm2.plist` | Main web server (port 3001) |

## Launch Agents (Auto-Start on Boot)

### 1. Ollama Server
**File:** `~/Library/LaunchAgents/com.ollama.server.plist`
```xml
- Runs: /Applications/Ollama.app/Contents/Resources/ollama serve
- KeepAlive: true (restarts on crash)
- OLLAMA_KEEP_ALIVE=-1 (models never unload)
- OLLAMA_HOST=127.0.0.1:11434
- OLLAMA_NUM_PARALLEL=4
```

### 2. Ollama Environment
**File:** `~/Library/LaunchAgents/com.ollama.env.plist`
```xml
- Sets: OLLAMA_KEEP_ALIVE=-1 globally
- RunAtLoad: true
```

### 3. PM2 Process Manager
**File:** `~/Library/LaunchAgents/com.magusme.pm2.plist`
```xml
- Runs: pm2 resurrect
- Restores all saved PM2 processes on boot
```

## PM2 Processes

**Config:** `ecosystem.config.cjs`
```javascript
apps: [{
  name: "magusme",
  script: "tsx server/index.ts",
  port: 3001,
  autorestart: true,
  max_restarts: 10,
  env: {
    OLLAMA_HOST: "http://127.0.0.1:11434",
    OLLAMA_MODEL: "qwen2.5:3b",
    OLLAMA_KEEP_ALIVE: "-1"
  }
}]
```

**Current State:**
```bash
npx pm2 status
# magusme: online, port 3001
```

## Verification Commands

```bash
# Check Ollama
curl http://127.0.0.1:11434/api/tags

# Check MagusMe server
curl http://localhost:3001/api/local/ollama-status

# Check spell count (real only)
curl "http://localhost:3001/api/spells?limit=1"

# Check arcana corpus (real only)
curl http://localhost:3001/api/arcana/corpus

# Check PM2
npx pm2 status

# Check launch agents
launchctl list | grep -E "ollama|magusme|pm2"
```

## Content (Real Only - Verified)

| Type | Count | Source |
|------|-------|--------|
| **Spells** | 14 | Hand-written from authentic grimoires |
| **Arcana Entries** | 275 | 101 global sources, 72 traditions |
| **LLM** | qwen2.5:3b | Local Ollama (private) |

### Authentic Spells (14 Verified)
1. **Lesser Banishing Ritual of the Pentagram** — *Key of Solomon* (Ceremonial)
2. **Love Drawing Ritual** — *Hyatt Collection* (Hoodoo)
3. **Mirror Shield Charm** — *Cunningham's Encyclopedia* (Wiccan)
4. **Mojo Bag** — *Hyatt Collection* (Hoodoo)
5. **Witch's Bottle** — *Traditional* (Wiccan)
6. **Honey Jar Sweetening** — *Hyatt Collection* (Hoodoo)
7. **Rose Quartz Heart Opening** — *Modern Practice* (Modern)
8. **Ocean Release** — *Traditional* (Greek)
9. **Psychic Shield** — *Modern Practice* (Ceremonial)
10. **Solar Plexus Empowerment** — *Tantra* (Tantra)
11. **Binding of the Hexer** — *Hyatt Collection* (Hoodoo)
12. **Sekhmet's Wrath** — *Egyptian Book of the Dead* (Egyptian)
13. **Aphrodite's Flame** — *Traditional* (Greek)
14. **Lover's Knot** — *Traditional* (Greek)

### Arcana Corpus (275 Real Entries)
Sources include:
- Yale Beinecke Library manuscripts
- Greek Magical Papyri (PGM)
- Egyptian Book of the Dead
- Key of Solomon / Clavicula Salomonis
- Hyatt Collection (Hoodoo)
- Agrippa's Three Books
- And 95+ more global sources

## Manual Commands

```bash
# Start everything manually
launchctl load ~/Library/LaunchAgents/com.ollama.server.plist
launchctl load ~/Library/LaunchAgents/com.ollama.env.plist
launchctl load ~/Library/LaunchAgents/com.magusme.pm2.plist

# Or use PM2 directly
cd /Users/mymac/Desktop/magusme-main
npx pm2 start ecosystem.config.cjs

# Restart server
npx pm2 restart magusme

# View logs
npx pm2 logs magusme
tail -f /tmp/ollama-serve.log
```

## On Reboot
Everything starts automatically via launchd:
1. launchd loads `com.ollama.server.plist` → starts Ollama
2. launchd loads `com.ollama.env.plist` → sets KEEP_ALIVE
3. launchd loads `com.magusme.pm2.plist` → runs `pm2 resurrect`
4. PM2 restores `magusme` process → server on port 3001

## Ports
- **3001** - MagusMe web server (HTTPS via nginx in production)
- **11434** - Ollama API (localhost only)

## Privacy
- `promptsLeaveDevice: false` - all AI runs locally
- `thirdPartyAiVendors: false` - no external APIs
- `dataSold: false` - no data collection
- `usedForModelTraining: false` - your data stays yours