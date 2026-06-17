# MagusMe Verified Content Pipeline — Roadmap

**Principle:** Zero AI generation. Zero auto-verified content. Every spell/entry is human-curated from primary sources with academic citations.

---

## ✅ DONE — Infrastructure

| Task | Status |
|------|--------|
| Verification schema (pending/verified/rejected) | ✅ |
| Spells DB filters only `verified = true` | ✅ |
| 15 hand-written spells with full citations | ✅ |
| Admin verification endpoints | ✅ |
| Spell detail page shows verification badge + citation | ✅ |
| All auto-generation scripts **disabled** | ✅ |

---

## 🔧 CURRENT — Manual Curation Tools (Ready Now)

### 1. Fetch Archive.org Full Text
```bash
npx tsx server/scripts/fetch-archive-text.ts <identifier>
```
- Downloads text files or PDF from archive.org
- Extracts text with `pdftotext` (no AI)
- Chunks by headings for review
- Saves to `~/Desktop/magusme-archive-corpus/`

### 2. Curate Spell from Fetched Text
```bash
npx tsx server/scripts/curate-spell.ts
```
- Lists fetched documents
- Shows chunks with headings
- Interactive prompts for all spell fields
- Requires **full academic citation** before insert
- Inserts as `verified = true` with citation stored

---

## 📋 NEXT — This Week

| Priority | Task | Description |
|----------|------|-------------|
| 🔴 HIGH | Desktop launchers | `Fetch Archive.command` + `Curate Spell.command` on Desktop |
| 🔴 HIGH | Add 50+ verified spells | Use tools to populate from Key of Solomon, Hyatt, Picatrix, etc. |
| 🟡 MED | Arcana/Grimoire same pipeline | Adapt curation tools for `arcana_entries` table |
| 🟡 MED | Batch citation template | Pre-fill citations for known sources (Hyatt, Cunningham, etc.) |

---

## 📅 THIS MONTH

| Priority | Task | Description |
|----------|------|-------------|
| 🟡 MED | Source library management | Track which archive.org IDs harvested, which books done |
| 🟢 LOW | Review queue UI | Web admin page to approve/reject pending (if needed) |
| 🟢 LOW | Spell variant tracking | Link related spells across traditions |

---

## 🚫 NEVER — Hard Constraints

| Rule | Enforcement |
|------|-------------|
| No LLM generates spell content | All generation scripts disabled |
| No auto-verify | `verified` only set by human via curation tool |
| No content without citation | `verification_source` required for `verified = true` |
| No procedural templates | `bulk-generate-spells.ts` deleted |
| No AI enrichment | `nightly-content-adder.ts` AI step removed |

---

## 🎯 Content Targets (Verified Spells)

| Source | Target Spells | Status |
|--------|---------------|--------|
| *Key of Solomon* (Mathers) | 20 | 🔲 |
| *Hyatt Collection* (Hoodoo) | 30 | 🔲 |
| *Picatrix* (Greer/Warnock) | 15 | 🔲 |
| *Cunningham's Encyclopedia* | 25 | 🔲 |
| *Egyptian Book of the Dead* | 10 | 🔲 |
| *Greek Magical Papyri* | 15 | 🔲 |
| *Norse Sagas/Eddas* | 10 | 🔲 |
| *Celtic/Mabinogion* | 10 | 🔲 |
| **Total** | **135+** | **15 done** |

---

## 🛠 Usage Workflow

```bash
# 1. Find a book on archive.org (e.g., "keyofsolomon00math")
npx tsx server/scripts/fetch-archive-text.ts keyofsolomon00math

# 2. Review chunks, pick one, fill citation, insert
npx tsx server/scripts/curate-spell.ts

# 3. Repeat. Each spell is live immediately on magusme.com/learn/<slug>
```

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `server/scripts/fetch-archive-text.ts` | Downloads full text from archive.org |
| `server/scripts/curate-spell.ts` | Interactive curation + verified insert |
| `~/Desktop/magusme-archive-corpus/` | Local cache of fetched texts |
| `src/server/spells/seed.ts` | 15 canonical hand-written spells |

---

*Last updated: 2026-06-17*