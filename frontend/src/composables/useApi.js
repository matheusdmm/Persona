// composables/useApi.js
const BASE = '/api'
const OPEN5E = 'https://api.open5e.com'

function fetchWithTimeout(url, options = {}, ms = 8000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id))
}

export function useApi() {
  async function fetchRaces() {
    const res = await fetchWithTimeout(`${BASE}/races`)
    if (!res.ok) throw new Error(`Failed to fetch races: ${res.status}`)
    return res.json()
  }

  async function fetchClasses() {
    const res = await fetchWithTimeout(`${BASE}/classes`)
    if (!res.ok) throw new Error(`Failed to fetch classes: ${res.status}`)
    return res.json()
  }

  async function calculateSheet(characterInput) {
    const res = await fetchWithTimeout(`${BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterInput),
    })
    if (!res.ok) throw new Error(`Failed to calculate sheet: ${res.status}`)
    return res.json()
  }

  async function fetchSpells(className) {
    const cls = className.toLowerCase()
    // Open5e's spell_lists field only covers full casters — paladin and ranger
    // are not valid choices there, so fall back to dnd_class for them.
    const SPELL_LIST_CLASSES = new Set(['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard'])
    const filter = SPELL_LIST_CLASSES.has(cls)
      ? `spell_lists=${cls}`
      : `dnd_class=${cls.charAt(0).toUpperCase() + cls.slice(1)}`
    let url = `${OPEN5E}/v1/spells/?${filter}&ordering=level_int,name&limit=100`
    const spells = []
    let pages = 0
    const MAX_PAGES = 20
    while (url && pages < MAX_PAGES) {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to fetch spells: ${res.status}`)
      const data = await res.json()
      spells.push(...data.results)
      url = data.next
      pages++
    }
    return spells
  }

  return { fetchRaces, fetchClasses, calculateSheet, fetchSpells }
}
