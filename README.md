# HeroScribe

> A free, no-account D&D character creator for 5e and 5.5e (2024).

**Stack:** Go (Vercel Serverless) · Vue 3 · HeadlessUI · Tailwind CSS · Pinia · Vitest

---

## Features

- Multi-step character creation wizard (Details, Race, Class, Skills, Abilities, Extras, Spells)
- Supports **5e** and **5.5e (2024)** editions with per-edition filtering on races and classes
- Ability scores via manual input, standard array, or point buy
- Skill proficiency selection based on class choices
- Weapon selection with attack bonus, damage dice, and proficiency indicator
- **Spell list** — browse and select spells filtered by class and level, powered by the [Open5e API](https://api.open5e.com); full casters use the `spell_lists` relational field, paladin/ranger fall back to `dnd_class`
- **Extended WotC content** — optional toggle to load 5,000+ items (weapons, armor, gear) from the WotC dataset; shows damage dice, AC, properties, and cost inline in search results
- **Content Library** — `/library` page to browse all extended items and extended races/classes, with source filter toggles persisted in localStorage
- Server-side character sheet calculation (modifiers, HP, AC, initiative, proficiency bonus, spell save DC)
- **Save characters** to localStorage — star/favorite from the sheet, browse at `/saved`
- **Save as PDF** via browser print (custom A4 layout, no external libraries)
- **Export JSON** for backup or use in Foundry VTT, Roll20, etc.
- Fully responsive — mobile hamburger nav, compact step indicator on small screens
- Vercel Analytics integration

## Project Structure

```
heroscribe/
├── vercel.json                        # Build & rewrite config
├── api/                               # Go serverless functions
│   ├── go.mod
│   ├── classes.go                     # GET /api/classes
│   ├── races.go                       # GET /api/races
│   ├── calculate.go                   # POST /api/calculate
│   └── data/
│       └── data.go                    # Races, classes, structs (SRD data)
└── frontend/                          # Vue 3 app
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── public/                        # Static assets (favicon, etc.)
    ├── tests/
    │   ├── features.test.js           # 50 tests: spell slots, emptyCharacter, languages, weapons, Go API, Open5e, extended items
    │   └── validations.test.js        # 49 tests: ability score math, step nav, store save/load/reset
    └── src/
        ├── main.js
        ├── App.vue
        ├── router/
        │   └── index.js               # /, /create, /sheet, /saved, /library
        ├── stores/
        │   └── character.js           # Pinia store — draft, sheet, spells, savedCharacters
        ├── composables/
        │   ├── useApi.js              # fetch wrappers (races, classes, calculate, spells)
        │   ├── useAbilityScores.js    # modifier calc, point buy, standard array
        │   └── useExtendedData.js     # WotC extended items fetch + parse
        ├── types/
        │   └── index.js               # JSDoc types, constants, emptyCharacter(), getSpellSlots()
        ├── assets/
        │   └── main.css               # Tailwind + @media print layout
        ├── views/
        │   ├── HomeView.vue
        │   ├── CharacterCreatorView.vue
        │   ├── CharacterSheetView.vue
        │   ├── SavedCharactersView.vue
        │   └── ContentLibraryView.vue # /library — browse extended content
        └── components/
            ├── layout/
            │   ├── AppHeader.vue      # Responsive nav with mobile hamburger
            │   └── AppFooter.vue
            ├── ui/
            │   ├── BaseCard.vue
            │   ├── AbilityScoreInput.vue
            │   ├── StatBox.vue
            │   ├── StepIndicator.vue
            │   ├── LoadingSpinner.vue # Animated SVG spinner
            │   └── ExtendedToggle.vue # HeadlessUI Switch for WotC content toggles
            └── character/
                ├── DetailsStep.vue
                ├── RaceSelector.vue
                ├── ClassSelector.vue
                ├── SkillsStep.vue
                ├── AbilitiesStep.vue
                ├── ExtrasStep.vue     # Weapons, gold, languages, equipment (with item detail display)
                └── SpellsStep.vue     # Spell browser + selection (Open5e API)
```

## Local Development

```bash
# Frontend only
cd frontend
npm install
npm run dev        # :5173, proxies /api → :3000

# Full stack (frontend + Go API)
npm i -g vercel
vercel dev         # :3000
```

## Testing

```bash
cd frontend
npm test
```

Runs 99 tests across two files:

| File | What it covers |
|---|---|
| `tests/features.test.js` | Spell slot tables, `emptyCharacter`, race languages, weapon proficiency, `SPELLCASTING_CLASSES`, Go API endpoints, Open5e spell filter, extended WotC items |
| `tests/validations.test.js` | `modifier()` / `formatMod()`, point buy cost table, step navigation (`canProceed`), Pinia store navigation, `isComplete`, save / load / delete / import |

The Go API tests (`describe('Go API …')`) require `vercel dev` running on `:3000`. The Open5e and extended items tests require internet access. All pure-logic tests run offline.

## Deploy

```bash
vercel
```

Vercel runs the Go handlers as serverless functions and serves the Vue build from `frontend/dist`.

## PDF Export

Uses `window.print()` with a custom `@media print` block in `main.css`. The print CSS forces a 3-column A4 layout by overriding Tailwind's `lg:` breakpoint (which never fires at A4 portrait width ~794px). Do **not** replace this with html2pdf.js or html2canvas — they cause font clipping and page-split artifacts with the custom web fonts used here (Crimson Text, MedievalSharp).

## Key Conventions

- The `edition` field on races and classes is `"5e"`, `"5.5e"`, or `"both"`. The frontend filters by the draft's `edition` field.
- HP formula: `hitDie + CON_mod + (level-1) × (floor(hitDie/2) + 1 + CON_mod)` — computed server-side in `calculate.go`.
- Point buy uses a non-linear cost table (scores 8–15, cost 0–9 points) in `useAbilityScores.js`.
- Spell slots are computed client-side via `getSpellSlots(className, level)` in `types/index.js` using SRD tables for full casters, half casters, and warlock pact magic.
- Extended content toggles persist via localStorage keys (`hs_ext_items`, `hs_ext_races`). On mount, if the toggle was saved as on, data is loaded directly — the toggle state is not flipped again.
- Tailwind's stone color scale is **inverted**: `stone-950` = `#fdf8ef` (cream page background), not dark.
- Never use hardcoded `bg-white` — use theme-aware classes like `bg-stone-900` so both light and dark themes resolve correctly via the CSS variable palette in `main.css`.
