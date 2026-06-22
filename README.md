# Persona

> D&D character creator for 5e and 5.5e (2024). Live at [persona.vazio.club](https://persona.vazio.club)

**Stack:** Go (Echo v5) · Vue 3 · TypeScript · HeadlessUI · Tailwind CSS · Pinia · Vitest · Bun · Docker / Coolify

---

## Features

- Multi-step character creation wizard — Details, Race, Class, Abilities, Skills, Extras, Spells
- Supports **5e** and **5.5e (2024)** with per-edition filtering on races and classes
- Ability scores via manual input, standard array, point buy, or dice roll
- Skill proficiency selection scoped to your class choices
- Weapon selection with attack bonus, damage dice, and proficiency indicator
- **Spell browser** — filter by class and level via the [Open5e API](https://api.open5e.com)
- **Extended WotC content** — optional toggle to load 5,000+ items, spells, and backgrounds from the official WotC dataset
- **Content Library** — `/library` page to browse all extended content with source filter toggles
- Server-side character sheet calculation (HP, AC, modifiers, initiative, proficiency bonus)
- **Save characters** to localStorage — star/favorite, browse at `/saved`
- **Print to PDF** via browser print (custom A4 layout with no external libraries)
- **Export JSON** for backup or sharing locally
- **Encoded share feature** for URL share through social media
- Fully responsive — mobile nav, compact step indicator on small screens

---

## Project Structure

```
persona/
├── Dockerfile                   # Multi-stage build: Bun (frontend) + Go (backend) → single image
├── docker-compose.yml           # Local image build/run for parity with Coolify
├── server/
│   └── main.go                  # Go HTTP server (Echo v5) — API routes + static file serving (SPA fallback)
└── frontend/
    ├── tsconfig.json
    ├── tests/
    │   ├── features.test.js     # Spell slots, emptyCharacter, Open5e, extended content
    │   └── validations.test.js  # Ability score math, point buy, step nav, store logic
    └── src/
        ├── types/
        │   ├── models.ts        # Core interfaces (CharacterDraft, Spell, Race, DnDClass…)
        │   ├── extended.ts      # External WotC API shapes (ExtendedSpell, ExtendedItem)
        │   └── index.ts         # Constants, game data, re-exports
        ├── stores/
        │   └── character.ts     # Pinia store — draft, sheet, spells, savedCharacters
        ├── composables/
        │   ├── useApi.ts        # fetch wrappers (races, classes, calculate, spells)
        │   ├── useAbilityScores.ts
        │   ├── useExtendedData.ts
        │   └── useTheme.ts
        ├── views/
        │   ├── HomeView.vue
        │   ├── CharacterCreatorView.vue
        │   ├── CharacterSheetView.vue
        │   ├── SavedCharactersView.vue
        │   └── ContentLibraryView.vue
        └── components/
            ├── layout/          # AppHeader, AppFooter
            ├── ui/              # BaseCard, AbilityScoreInput, StepIndicator, ExtendedToggle…
            └── character/       # DetailsStep, RaceSelector, ClassSelector, SkillsStep,
                                 # AbilitiesStep, ExtrasStep, SpellsStep
```

---

## Local Development

```bash
# Frontend only
cd frontend
bun install
bun run dev          # http://localhost:5173

# Go API
cd server
go run .             # http://localhost:3000
```

Or from the repo root, run both at once: `bun run dev` (or `bun run frontend` / `bun run backend` to run individual sessions/detached).

---

## Testing

```bash
cd frontend
bun run test
```

167 tests across two files:

| File                  | What it covers                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `features.test.js`    | Spell slot tables, `emptyCharacter`, race languages, weapon proficiency, Go API endpoints, Open5e spell filter, extended WotC content |
| `validations.test.js` | `modifier()` / `formatMod()`, point buy cost table, step navigation, Pinia store, save / load / delete / import                       |

> **Note:** Go API tests require the Go server running on `:3000` (`cd server && go run .`). Open5e and extended content tests require internet access. All pure-logic tests run offline.

---

## Deploy

Self-hosted on [Coolify](https://coolify.io) from the included `Dockerfile` — no separate frontend/backend services needed.

The image is a multi-stage build: Bun builds the Vue frontend (`frontend/dist`), Go builds the backend binary, and the final container runs a single Go process that serves `/api/*` routes and the built frontend (with SPA fallback to `index.html` for client-side routing).

To test the production image locally before deploying:

```bash
docker compose up --build
```

---
