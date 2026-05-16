# HeroScribe

> A free, no-account D&D character creator for 5e and 5.5e (2024).

**Stack:** Go (Vercel Serverless) · Vue 3 · TypeScript · HeadlessUI · Tailwind CSS · Pinia · Vitest

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
heroscribe/
├── vercel.json                  # Build & rewrite config
├── api/                         # Go serverless functions
│   ├── classes.go               # GET /api/classes
│   ├── races.go                 # GET /api/races
│   ├── calculate.go             # POST /api/calculate
│   └── data/data.go             # All SRD game data (races, classes, structs)
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
npm install
npm run dev          # http://localhost:5173

# Full stack (frontend + Go API)
npm i -g vercel
vercel dev           # http://localhost:3000
```

---

## Testing

```bash
cd frontend
npm test
```

100 tests across two files:

| File | What it covers |
|---|---|
| `features.test.js` | Spell slot tables, `emptyCharacter`, race languages, weapon proficiency, Go API endpoints, Open5e spell filter, extended WotC content |
| `validations.test.js` | `modifier()` / `formatMod()`, point buy cost table, step navigation, Pinia store, save / load / delete / import |

> **Note:** Go API tests require `vercel dev` running on `:3000`. Open5e and extended content tests require internet access. All pure-logic tests run offline.

---

## Deploy

```bash
vercel
```

Vercel builds the Vue app from `frontend/dist` and runs the Go handlers as serverless functions. Routes under `/api/*` hit Go; everything else falls through to `index.html` for client-side routing.

---

## Key Conventions

**Editions** — the `edition` field on races and classes is `"5e"`, `"5.5e"`, or `"both"`. Selectors filter by the draft's `edition` field.

**HP formula** — `hitDie + CON_mod + (level - 1) × (floor(hitDie / 2) + 1 + CON_mod)` — computed server-side in `calculate.go`.

**Point buy** — non-linear cost table (scores 8–15, cost 0–9 points) in `useAbilityScores.ts`.

**Spell slots** — computed client-side via `getSpellSlots(className, level)` in `types/index.ts`, using SRD tables for full casters, half casters, and warlock pact magic.

**Open5e spell filter** — uses `spell_lists=<class>` (indexed field). Paladin is an exception: `spell_lists=paladin` returns HTTP 400, so it falls back to `dnd_class=Paladin`.

**Extended content** — toggle state persists via localStorage keys (`hs_ext_items`, `hs_ext_spells`, `hs_ext_backgrounds`). Data is loaded once on first toggle and cached in memory.

**Theming** — Tailwind's stone scale is inverted: `stone-950` = `#fdf8ef` (cream). Never use `bg-white` — use theme-aware classes like `bg-stone-900` so light and dark themes resolve correctly via CSS variables in `main.css`.

**PDF export** — uses `window.print()` with a custom `@media print` block. Do not replace with html2pdf.js or html2canvas — they cause font clipping and page-split artifacts with the custom web fonts (Crimson Text, MedievalSharp).
