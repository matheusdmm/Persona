// composables/useApi.js
const BASE = '/api'
const OPEN5E = 'https://api.open5e.com'

export function useApi() {
  async function fetchRaces() {
    const res = await fetch(`${BASE}/races`)
    if (!res.ok) throw new Error(`Failed to fetch races: ${res.status}`)
    return res.json()
  }

  async function fetchClasses() {
    const res = await fetch(`${BASE}/classes`)
    if (!res.ok) throw new Error(`Failed to fetch classes: ${res.status}`)
    return res.json()
  }

  async function calculateSheet(characterInput) {
    const res = await fetch(`${BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterInput),
    })
    if (!res.ok) throw new Error(`Failed to calculate sheet: ${res.status}`)
    return res.json()
  }

  async function fetchSpells(className) {
    const name = className.charAt(0).toUpperCase() + className.slice(1)
    let url = `${OPEN5E}/v1/spells/?dnd_class=${name}&ordering=level_int,name&limit=100`
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
