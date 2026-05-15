import { ref } from 'vue'

const BASE_URL = 'https://raw.githubusercontent.com/nick-aschenbach/dnd-data/main/data'

const WOTC_PUBLISHERS = new Set(['Wizards of the Coast', 'Wizards of the Coast, Inc.'])

export const CATEGORY_ENDPOINTS = {
  backgrounds: `${BASE_URL}/backgrounds.json`,
  species:     `${BASE_URL}/species.json`,
  classes:     `${BASE_URL}/classes.json`,
  spells:      `${BASE_URL}/spells.json`,
  items:       `${BASE_URL}/items.json`,
}

const cache = {}

function dedup(arr) {
  const seen = new Set()
  return arr.filter(e => {
    if (seen.has(e.name)) return false
    seen.add(e.name)
    return true
  })
}

async function fetchCategory(category) {
  if (cache[category]) return cache[category]
  const res = await fetch(CATEGORY_ENDPOINTS[category])
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw = await res.json()
  const filtered = dedup(raw.filter(e => WOTC_PUBLISHERS.has(e.publisher)))
  cache[category] = filtered
  return filtered
}

// Maps an external spell entry to our internal spell shape.
function mapSpell(e) {
  const p   = e.properties ?? {}
  const slug = e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    slug,
    name:         e.name,
    level_int:    typeof p.Level === 'number' ? p.Level : 0,
    school:       (p.School ?? '').toLowerCase(),
    casting_time: p['Casting Time'] ?? '',
    range:        p['data-RangeAoe'] ?? p.Range ?? '',
    components:   p.Components ?? '',
    book:         e.book,
    extended:     true,
  }
}

// Books whose content is already covered by Open5e — exclude from extended spells.
const EXCLUDED_SPELL_BOOKS = new Set([
  'Free Basic Rules (2014)',
  'Free Basic Rules (2024)',
])

// Returns WotC spells that list the given class, mapped to internal spell shape.
export async function getExtendedSpells(className) {
  const all = await fetchCategory('spells')
  const cls = className.toLowerCase()
  return all
    .filter(e => {
      if (EXCLUDED_SPELL_BOOKS.has(e.book)) return false
      const classes = (e.properties?.Classes ?? '')
        .split(',').map(c => c.trim().toLowerCase())
      return classes.includes(cls)
    })
    .map(mapSpell)
}

// Returns WotC item names (strings), optionally filtered by a query.
export async function getExtendedItems() {
  const all = await fetchCategory('items')
  return all.map(e => e.name).sort()
}

// Generic composable used by ContentLibraryView.
export function useExtendedData() {
  const entries = ref([])
  const loading = ref(false)
  const error   = ref(null)

  async function load(category) {
    loading.value = true
    error.value   = null
    try {
      entries.value = await fetchCategory(category)
    } catch {
      error.value = 'Failed to load content. Check your connection and try again.'
    } finally {
      loading.value = false
    }
  }

  return { entries, loading, error, load }
}
