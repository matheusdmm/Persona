import { ref } from 'vue'
import type { CategoryKey, RawEntry, ExtendedSpell, ExtendedItem } from '@/types/extended'

const BASE_URL = 'https://raw.githubusercontent.com/nick-aschenbach/dnd-data/main/data'

const WOTC_PUBLISHERS = new Set(['Wizards of the Coast', 'Wizards of the Coast, Inc.'])

export const CATEGORY_ENDPOINTS: Record<CategoryKey, string> = {
  backgrounds: `${BASE_URL}/backgrounds.json`,
  species:     `${BASE_URL}/species.json`,
  classes:     `${BASE_URL}/classes.json`,
  spells:      `${BASE_URL}/spells.json`,
  items:       `${BASE_URL}/items.json`,
}

const cache: Partial<Record<CategoryKey, RawEntry[]>> = {}

function dedup(arr: RawEntry[]): RawEntry[] {
  const seen = new Set<string>()
  return arr.filter(e => {
    if (seen.has(e.name)) return false
    seen.add(e.name)
    return true
  })
}

async function fetchCategory(category: CategoryKey): Promise<RawEntry[]> {
  if (cache[category]) return cache[category]!
  const res = await fetch(CATEGORY_ENDPOINTS[category])
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw: RawEntry[] = await res.json()
  const filtered = dedup(raw.filter(e => WOTC_PUBLISHERS.has(e.publisher)))
  cache[category] = filtered
  return filtered
}

function mapSpell(e: RawEntry): ExtendedSpell {
  const p = (e.properties ?? {}) as Record<string, unknown>
  const slug = e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    slug,
    name:         e.name,
    level_int:    typeof p['Level'] === 'number' ? p['Level'] : 0,
    school:       (typeof p['School'] === 'string' ? p['School'] : '').toLowerCase(),
    casting_time: typeof p['Casting Time'] === 'string' ? p['Casting Time'] : '',
    range:        typeof p['data-RangeAoe'] === 'string' ? p['data-RangeAoe'] : (typeof p['Range'] === 'string' ? p['Range'] : ''),
    components:   typeof p['Components'] === 'string' ? p['Components'] : '',
    book:         e.book,
    extended:     true,
  }
}

const EXCLUDED_SPELL_BOOKS = new Set([
  'Free Basic Rules (2014)',
  'Free Basic Rules (2024)',
])

export async function getExtendedSpells(className: string): Promise<ExtendedSpell[]> {
  const all = await fetchCategory('spells')
  const cls = className.toLowerCase()
  return all
    .filter(e => {
      if (EXCLUDED_SPELL_BOOKS.has(e.book)) return false
      const classes = (typeof (e.properties as Record<string, unknown>)?.['Classes'] === 'string'
        ? (e.properties as Record<string, unknown>)['Classes'] as string
        : ''
      ).split(',').map(c => c.trim().toLowerCase())
      return classes.includes(cls)
    })
    .map(mapSpell)
}

function parseProps(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v === null || v === '' || v === undefined) continue
    if (typeof v === 'string') {
      const t = v.trim()
      if (t.startsWith('[') || t.startsWith('{')) {
        try { out[k] = JSON.parse(t); continue } catch {}
      }
    }
    out[k] = v
  }
  return out
}

function str(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function mapItem(e: RawEntry): ExtendedItem {
  const p = parseProps(e.properties)
  return {
    name:        e.name,
    description: e.description || '',
    book:        e.book,
    damage:      str(p['Damage']),
    damageType:  str(p['Damage Type']),
    category:    str(p['Category']),
    weaponProps: str(p['Properties']),
    cost:        str(p['Cost']),
    weight:      str(p['Weight']),
    armorClass:  str(p['Armor Class']),
    armorType:   str(p['Armor Type']),
  }
}

export async function getExtendedItems(): Promise<ExtendedItem[]> {
  const all = await fetchCategory('items')
  return all.map(mapItem).sort((a, b) => a.name.localeCompare(b.name))
}

export function useExtendedData() {
  const entries = ref<RawEntry[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  async function load(category: CategoryKey): Promise<void> {
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
