# MagusMe Roadmap (Docs Snapshot)

This file summarizes the roadmap/build plan found in:
- `MILESTONES.md`
- `MAGUSME-CONTEXT.md`
- `AUTO_START_SETUP.md`

## What’s implemented (from `MILESTONES.md`)

### Infrastructure
1. **Divination System Registry** (`src/shared/divinationSystems.ts`)
2. **Generic Divination Page** (`src/client/pages/GenericDivinationPage.tsx`)
3. **Dynamic Consult Page** (`src/client/pages/ConsultPage.tsx`)
4. **Auto-generated Routes** (`src/client/App.tsx`)

### Current state
- Working: ~50+ systems using `generic: true` (no custom pages required)
- Working (specialized pages): Tarot (`ArcanaPage.tsx`), Runes (`RuneConsultPage.tsx`), Astrology/Natal (`AstrologyConsultPage.tsx`)
- Not yet implemented: Grimoire DB population, PayRAM frontend integration, HTTPS/domain DNS, community features.

### Next build targets
1. Daily tools live data (`/tools`)
2. Spell Box component and integration into `/tools`
3. Grimoire population (42 spells across categories/traditions)
4. PayRAM frontend integration (credits display + top-up flow)
5. I Ching specialized UI (`IChingPage.tsx`)

## Product vision & architecture (from `MAGUSME-CONTEXT.md`)
MagusMe is described as “The Vault of the Universe” with ecosystem pillars: Oracle, Grimoire, Magubrain, Planetary Watch, Spell Box, History of Magic, Manifestation Library, Community, and Credits.

## Deployment/ops reference (from `AUTO_START_SETUP.md`)
macOS local automation notes (Ollama + PM2 launch agents) and verification commands.

