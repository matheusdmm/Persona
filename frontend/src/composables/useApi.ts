import type { Race, DnDClass, CharacterInput, CharacterSheet, Spell, ArmorItem } from '@/types/models'

const BASE = '/api'
const OPEN5E = 'https://api.open5e.com'

function fetchWithTimeout(url: string, options: RequestInit = {}, ms = 8000): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id))
}

export function useApi() {
  async function fetchRaces(): Promise<Race[]> {
    const res = await fetchWithTimeout(`${BASE}/races`)
    if (!res.ok) throw new Error(`Failed to fetch races: ${res.status}`)
    return res.json()
  }

  async function fetchClasses(): Promise<DnDClass[]> {
    const res = await fetchWithTimeout(`${BASE}/classes`)
    if (!res.ok) throw new Error(`Failed to fetch classes: ${res.status}`)
    return res.json()
  }

  async function fetchArmor(): Promise<ArmorItem[]> {
    const res = await fetchWithTimeout(`${BASE}/armor`)
    if (!res.ok) throw new Error(`Failed to fetch armor: ${res.status}`)
    return res.json()
  }

  async function calculateSheet(input: CharacterInput): Promise<CharacterSheet> {
    const res = await fetchWithTimeout(`${BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error(`Failed to calculate sheet: ${res.status}`)
    return res.json()
  }

  async function fetchSpells(className: string): Promise<Spell[]> {
    // Open5e does not include paladin in the spell_lists index — fall back to dnd_class
    const filter = className === 'paladin'
      ? `dnd_class=Paladin`
      : `spell_lists=${className}`
    let url: string | null = `${OPEN5E}/v1/spells/?${filter}&ordering=level_int,name&limit=100`
    const spells: Spell[] = []
    let pages = 0
    const MAX_PAGES = 20
    while (url && pages < MAX_PAGES) {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to fetch spells: ${res.status}`)
      const data: { results: Spell[]; next: string | null } = await res.json()
      spells.push(...data.results)
      url = data.next
      pages++
    }
    return spells
  }

  return { fetchRaces, fetchClasses, fetchArmor, calculateSheet, fetchSpells }
}
