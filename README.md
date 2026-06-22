# Persona

> A free, no-account D&D character creator for 5e and 5.5e (2024). Live at [persona.vazio.club](https://persona.vazio.club).

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
- **Print to PDF** via browser print (custom A4 layout, no external libraries)
- **Export JSON** for Foundry VTT, Roll20, or backup
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
# Frontend only (proxies /api → :3000)
cd frontend
bun install
bun run dev          # http://localhost:5173

# Go API (in another terminal)
cd server
go run .             # http://localhost:3000
```

Or from the repo root, run both at once: `bun run dev` (or individually: `bun run frontend` / `bun run backend`).

---

## Testing

```bash
cd frontend
bun run test
```

167 tests across two files:

| File | What it covers |
|---|---|
| `features.test.js` | Spell slot tables, `emptyCharacter`, race languages, weapon proficiency, Go API endpoints, Open5e spell filter, extended WotC content |
| `validations.test.js` | `modifier()` / `formatMod()`, point buy cost table, step navigation, Pinia store, save / load / delete / import |

> **Note:** Go API tests require the Go server running on `:3000` (`cd server && go run .`). Open5e and extended content tests require internet access. All pure-logic tests run offline.

> **Known issue:** `bun run typecheck` (and the `vue-tsc` step in `bun run build`) currently fails to resolve `.vue` module types under Bun — `vue-tsc`/Volar monkey-patches the TypeScript compiler module in a way that doesn't appear to survive Bun's module loader. This does **not** affect the actual production bundle: `vite build` itself (and the Dockerfile, which calls `vite build` directly) works correctly. Run `vue-tsc --noEmit` under Node if you need a full typecheck until upstream catches up.

---

## Deploy

Self-hosted on [Coolify](https://coolify.io) from the included `Dockerfile` — no separate frontend/backend services needed.

The image is a multi-stage build: Bun builds the Vue frontend (`frontend/dist`), Go builds the backend binary, and the final container runs a single Go process that serves `/api/*` routes and the built frontend (with SPA fallback to `index.html` for client-side routing).

1. In Coolify, create a new application from this Git repo with the **Dockerfile** build pack.
2. (Optional) Set `VITE_UMAMI_URL` and `VITE_UMAMI_WEBSITE_ID` as **build-time** variables if you're using self-hosted [Umami](https://umami.is) analytics — see `frontend/.env.example`. Leave unset to disable analytics.
3. Deploy. Coolify exposes the container's port `3000` behind its proxy.

To test the production image locally before deploying:

```bash
docker compose up --build
```

---

## Key Conventions

**Editions** — the `edition` field on races and classes is `"5e"`, `"5.5e"`, or `"both"`. Selectors filter by the draft's `edition` field.

**HP formula** — `hitDie + CON_mod + (level - 1) × (floor(hitDie / 2) + 1 + CON_mod)` — computed server-side in `server/main.go`.

**Point buy** — non-linear cost table (scores 8–15, cost 0–9 points) in `useAbilityScores.ts`.

**Spell slots** — computed client-side via `getSpellSlots(className, level)` in `types/index.ts`, using SRD tables for full casters, half casters, and warlock pact magic.

**Open5e spell filter** — uses `spell_lists=<class>` (indexed field). Paladin is an exception: `spell_lists=paladin` returns HTTP 400, so it falls back to `dnd_class=Paladin`.

**Extended content** — toggle state persists via localStorage keys (`hs_ext_items`, `hs_ext_spells`, `hs_ext_backgrounds`). Data is loaded once on first toggle and cached in memory.

**Theming** — Tailwind's stone scale is inverted: `stone-950` = `#fdf8ef` (cream). Never use `bg-white` — use theme-aware classes like `bg-stone-900` so light and dark themes resolve correctly via CSS variables in `main.css`.

**PDF export** — uses `window.print()` with a custom `@media print` block. Do not replace with html2pdf.js or html2canvas — they cause font clipping and page-split artifacts with the custom web fonts (Crimson Text, MedievalSharp).
