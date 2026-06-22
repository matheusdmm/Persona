/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Colors use space-separated RGB vars so Tailwind opacity modifiers work (bg-gold/20, etc.)
        stone: {
          950: 'rgb(var(--c-950) / <alpha-value>)',
          900: 'rgb(var(--c-900) / <alpha-value>)',
          800: 'rgb(var(--c-800) / <alpha-value>)',
          700: 'rgb(var(--c-700) / <alpha-value>)',
          600: 'rgb(var(--c-600) / <alpha-value>)',
          500: 'rgb(var(--c-500) / <alpha-value>)',
          400: 'rgb(var(--c-400) / <alpha-value>)',
          300: 'rgb(var(--c-300) / <alpha-value>)',
          200: 'rgb(var(--c-200) / <alpha-value>)',
          100: 'rgb(var(--c-100) / <alpha-value>)',
          50:  'rgb(var(--c-50)  / <alpha-value>)',
        },
        parchment: 'rgb(var(--c-parchment) / <alpha-value>)',
        ink:       'rgb(var(--c-ink)       / <alpha-value>)',
        gold:      'rgb(var(--c-gold)      / <alpha-value>)',
        crimson:   'rgb(var(--c-crimson)   / <alpha-value>)',
        vivid:     'rgb(var(--c-vivid)     / <alpha-value>)',
      },
      fontFamily: {
        // Cinzel — engraved Roman caps, used with restraint for headlines & the wordmark
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"Redaction 10"', '"Crimson Text"', 'Georgia', 'serif'],
        // Spline Sans Mono — the numeric vernacular of a character sheet (scores, mods, dice, AC/HP)
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm:   '0.25rem',
        md:   '0.5rem',
        lg:   '0.625rem',
        xl:   '0.875rem',
        '2xl':'1.25rem',
        '3xl':'1.75rem',
        full: '9999px',
      },
      boxShadow: {
        // --shadow-rgb stays comma-separated because it's used in rgba(), not rgb()/<alpha-value>
        card:        '0 2px 12px -3px rgba(var(--shadow-rgb), 0.10), 0 1px 4px rgba(var(--shadow-rgb), 0.06)',
        'card-hover':'0 6px 20px -4px rgba(var(--shadow-rgb), 0.16), 0 2px 6px rgba(var(--shadow-rgb), 0.08)',
        stat:        '0 1px 6px rgba(var(--shadow-rgb), 0.08)',
        btn:         '0 1px 3px rgba(var(--shadow-rgb), 0.14)',
        input:       'inset 0 1px 3px rgba(var(--shadow-rgb), 0.05)',
      },
    }
  },
  plugins: []
}
