# HeroScribe

> A free, no-account D&D character creator for 5e and 5.5e (2024).

**Stack:** Go (Vercel Serverless) · Vue 3 · Tailwind CSS · Pinia

---

## Features

- Multi-step character creation wizard (Details, Race, Class, Skills, Abilities, Extras, Spells)
- Supports **5e** and **5.5e (2024)** editions with per-edition filtering on races and classes
- Ability scores via manual input, standard array, or point buy
- Skill proficiency selection based on class choices
- Weapon selection with attack bonus, damage dice, and proficiency indicator
- **Spell list** — browse and select spells filtered by class and level, powered by the [Open5e API](https://api.open5e.com)
- Server-side character sheet calculation (modifiers, HP, AC, initiative, proficiency bonus, spell save DC)
- **Save characters** to localStorage — star/favorite from the sheet, browse at `/saved`
- **Save as PDF** via browser print (custom A4 layout, no external libraries)
- **Export JSON** for backup or use in Foundry VTT, Roll20, etc.
- Fully responsive — mobile hamburger nav, compact step indicator on small screens
- Vercel Analytics integration

## Project Structure

```
herscribe/
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
    └── src/
        ├── main.js
        ├── App.vue
        ├── router/
        │   └── index.js               # /, /create, /sheet, /saved
        ├── stores/
        │   └── character.js           # Pinia store — draft, sheet, spells, savedCharacters
        ├── composables/
        │   ├── useApi.js              # fetch wrappers (races, classes, calculate, spells)
        │   └── useAbilityScores.js    # modifier calc, point buy, standard array
        ├── types/
        │   └── index.js               # JSDoc types, constants, emptyCharacter()
        ├── assets/
        │   └── main.css               # Tailwind + @media print layout
        ├── views/
        │   ├── HomeView.vue           # Landing page with animations
        │   ├── CharacterCreatorView.vue
        │   ├── CharacterSheetView.vue
        │   └── SavedCharactersView.vue
        └── components/
            ├── layout/
            │   ├── AppHeader.vue      # Responsive nav with mobile hamburger
            │   └── AppFooter.vue
            ├── ui/
            │   ├── BaseCard.vue
            │   ├── AbilityScoreInput.vue
            │   ├── StatBox.vue
            │   └── StepIndicator.vue  # Progress bar on mobile, bubbles on desktop
            └── character/
                ├── DetailsStep.vue
                ├── RaceSelector.vue
                ├── ClassSelector.vue
                ├── SkillsStep.vue
                ├── AbilitiesStep.vue
                ├── ExtrasStep.vue     # Weapons, gold, languages, equipment, personality
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
- Tailwind's stone color scale is **inverted**: `stone-950` = `#fdf8ef` (cream page background), not dark.
