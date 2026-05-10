# D&D Character Creator

Stack: **Go** (Vercel Serverless) · **Vue 3** · **Tailwind CSS** · **Pinia**

## Features

- Multi-step character creation wizard (race, class, abilities, details)
- Supports **5e** and **5.5e** editions with edition filter on races/classes
- Ability scores via manual input, standard array, or point buy
- Server-side character sheet calculation (modifiers, HP, AC, initiative, proficiency bonus)
- **Save characters** to localStorage — star/favorite from the sheet, browse at `/saved`
- **Save as PDF** via browser print (native quality, custom fonts, compact A4 layout)
- **Export JSON** for backup or external use

## Project Structure

```
dnd-character-creator/
├── vercel.json                   # Build & rewrite config
├── api/                          # Go serverless functions
│   ├── go.mod
│   ├── classes.go                # GET /api/classes
│   ├── races.go                  # GET /api/races
│   ├── calculate.go              # POST /api/calculate
│   └── data/
│       └── data.go               # Races, classes, structs (SRD data)
└── frontend/                     # Vue 3 app
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.js
        ├── App.vue
        ├── router/
        │   └── index.js           # /, /create, /sheet, /saved
        ├── stores/
        │   └── character.js       # Pinia store — draft, sheet, savedCharacters (localStorage)
        ├── composables/
        │   ├── useApi.js          # fetch wrappers for the Go API
        │   └── useAbilityScores.js # modifier calc, point buy, standard array
        ├── types/
        │   └── index.js           # JSDoc types, constants, emptyCharacter()
        ├── assets/
        │   └── main.css           # Tailwind + @media print layout (3-column A4)
        ├── views/
        │   ├── HomeView.vue
        │   ├── CharacterCreatorView.vue   # Multi-step wizard
        │   ├── CharacterSheetView.vue     # Sheet, PDF export, JSON export, save/favorite
        │   └── SavedCharactersView.vue    # Saved characters grid with load/delete
        └── components/
            ├── layout/
            │   └── AppHeader.vue          # Nav with saved-count badge
            ├── ui/
            │   ├── BaseCard.vue
            │   ├── AbilityScoreInput.vue
            │   ├── StatBox.vue
            │   └── StepIndicator.vue
            └── character/
                ├── RaceSelector.vue
                ├── ClassSelector.vue
                ├── AbilitiesStep.vue
                └── DetailsStep.vue
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

Vercel runs the Go handlers as serverless functions and serves the Vue build from `frontend/dist`. The `node_modules/` directory must not be committed — it causes permission errors on Vercel's Linux runtime.

## PDF Export

Uses `window.print()` with a custom `@media print` block in `main.css`. The print CSS forces a 3-column layout (overriding Tailwind's `lg:` breakpoint which doesn't fire at A4 width), compacts fonts and spacing, and clears cream backgrounds to white. Do **not** replace this with html2pdf.js or html2canvas — they cause font clipping and page-split artifacts with the custom web fonts used in this project.

## Next Steps

- [ ] Skill proficiency selection (based on class + background)
- [ ] Spell list per class/level
- [ ] 5.5e-specific features (species, background ASI flexibility)
- [ ] Cloud save (Supabase) to sync characters across devices
