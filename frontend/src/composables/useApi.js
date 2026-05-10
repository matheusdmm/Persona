// composables/useApi.js
const BASE = '/api'
const OPEN5E = 'https://api.open5e.com'

export function useApi() {
  async function fetchRaces() {
    const res = await fetch(`${BASE}/races`)
    return res.json()
  }

  async function fetchClasses() {
    const res = await fetch(`${BASE}/classes`)
    return res.json()
  }

  async function calculateSheet(characterInput) {
    const res = await fetch(`${BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterInput),
    })
    return res.json()
  }

  async function fetchSpells(className) {
    const name = className.charAt(0).toUpperCase() + className.slice(1)
    let url = `${OPEN5E}/spells/?dnd_class=${name}&ordering=level_int,name&limit=100`
    const spells = []
    while (url) {
      const res = await fetch(url)
      const data = await res.json()
      spells.push(...data.results)
      url = data.next
    }
    return spells
  }

  return { fetchRaces, fetchClasses, calculateSheet, fetchSpells }
}
