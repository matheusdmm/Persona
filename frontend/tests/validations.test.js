/**
 * Frontend validation tests.
 * Run: npm test  (from frontend/)
 *
 * Groups:
 *   1. Ability score math   — modifier, formatMod, point buy, standard array
 *   2. Step navigation      — canProceed rules for each wizard step
 *   3. Character store      — save / load / reset / import (no API calls)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { modifier, formatMod, useAbilityScores } from '../src/composables/useAbilityScores.js'
import { emptyCharacter } from '../src/types/index.js'
import { useCharacterStore } from '../src/stores/character.js'

// localStorage mock — must be set before any store is instantiated
const _storage = {}
global.localStorage = {
  getItem:    k => _storage[k] ?? null,
  setItem:    (k, v) => { _storage[k] = String(v) },
  removeItem: k => { delete _storage[k] },
}

// ── 1. Ability score math ─────────────────────────────────────────────────────

describe('modifier(score)', () => {
  const cases = [
    [1, -5], [4, -3], [7, -2], [8, -1], [9, -1],
    [10, 0], [11, 0], [12, 1], [14, 2], [15, 2],
    [18, 4], [20, 5],
  ]
  for (const [score, expected] of cases) {
    it(`${score} → ${expected >= 0 ? '+' : ''}${expected}`, () => {
      expect(modifier(score)).toBe(expected)
    })
  }
})

describe('formatMod(n)', () => {
  it('positive gets + prefix', () => expect(formatMod(3)).toBe('+3'))
  it('zero gets + prefix',     () => expect(formatMod(0)).toBe('+0'))
  it('negative keeps - sign',  () => expect(formatMod(-2)).toBe('-2'))
})

describe('Point buy', () => {
  const { pointBuyCost, STANDARD_ARRAY } = useAbilityScores()
  const base = () => ({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 })

  it('STANDARD_ARRAY is [15,14,13,12,10,8]', () => {
    expect(STANDARD_ARRAY).toEqual([15, 14, 13, 12, 10, 8])
  })

  it('all 8s costs 0 points', () => {
    expect(pointBuyCost(base())).toBe(0)
  })

  it('all 10s costs 12 points (6 × 2)', () => {
    const scores = Object.fromEntries(Object.keys(base()).map(k => [k, 10]))
    expect(pointBuyCost(scores)).toBe(12)
  })

  it('score 14 costs 7 pts (non-linear above 13)', () => {
    expect(pointBuyCost({ ...base(), str: 14 })).toBe(7)
  })

  it('score 15 costs 9 pts', () => {
    expect(pointBuyCost({ ...base(), str: 15 })).toBe(9)
  })

  it('jump from 13→14 costs more than 12→13 (non-linear)', () => {
    const to13 = pointBuyCost({ ...base(), str: 13 }) - pointBuyCost({ ...base(), str: 12 })
    const to14 = pointBuyCost({ ...base(), str: 14 }) - pointBuyCost({ ...base(), str: 13 })
    expect(to14).toBeGreaterThan(to13)
  })

  it('standard array cost does not exceed the 27-point budget', () => {
    const scores = Object.fromEntries(STANDARD_ARRAY.map((v, i) => [i, v]))
    expect(pointBuyCost(scores)).toBeLessThanOrEqual(27)
  })
})

// ── 2. Step navigation (canProceed) ───────────────────────────────────────────

describe('Step navigation validation', () => {
  // Mirrors CharacterCreatorView canProceed computed
  function canProceed(step, draft, selectedClass = null) {
    switch (step) {
      case 0: return !!draft.name
      case 1: return !!draft.race
      case 2: return !!draft.class
      case 3: return draft.skills.length === (selectedClass?.skill_choices ?? 0)
      default: return true
    }
  }

  const blank = emptyCharacter()

  it('step 0: blocked without name', () => expect(canProceed(0, blank)).toBe(false))
  it('step 0: passes with name',     () => expect(canProceed(0, { ...blank, name: 'Aragorn' })).toBe(true))

  it('step 1: blocked without race', () => expect(canProceed(1, blank)).toBe(false))
  it('step 1: passes with race',     () => expect(canProceed(1, { ...blank, race: 'elf' })).toBe(true))

  it('step 2: blocked without class', () => expect(canProceed(2, blank)).toBe(false))
  it('step 2: passes with class',     () => expect(canProceed(2, { ...blank, class: 'wizard' })).toBe(true))

  it('step 3: blocked if too few skills', () => {
    expect(canProceed(3, { ...blank, skills: ['arcana'] }, { skill_choices: 2 })).toBe(false)
  })
  it('step 3: passes when exactly skill_choices are selected', () => {
    expect(canProceed(3, { ...blank, skills: ['arcana', 'history'] }, { skill_choices: 2 })).toBe(true)
  })
  it('step 3: blocked if too many skills selected', () => {
    expect(canProceed(3, { ...blank, skills: ['arcana', 'history', 'insight'] }, { skill_choices: 2 })).toBe(false)
  })
  it('step 3: passes with no class (0 required, 0 selected)', () => {
    expect(canProceed(3, blank, null)).toBe(true)
  })

  it('steps 4–6 always pass', () => {
    for (const step of [4, 5, 6])
      expect(canProceed(step, blank)).toBe(true)
  })
})

// ── 3. Character store — pure logic ───────────────────────────────────────────

describe('Character store — navigation', () => {
  let store

  beforeEach(() => {
    Object.keys(_storage).forEach(k => delete _storage[k])
    setActivePinia(createPinia())
    store = useCharacterStore()
  })

  it('starts at step 0', () => expect(store.currentStep).toBe(0))

  it('nextStep increments', () => {
    store.nextStep()
    store.nextStep()
    expect(store.currentStep).toBe(2)
  })

  it('prevStep decrements', () => {
    store.currentStep = 3
    store.prevStep()
    expect(store.currentStep).toBe(2)
  })

  it('reset returns to step 0 and clears draft', () => {
    store.draft.name = 'Gandalf'
    store.currentStep = 4
    store.reset()
    expect(store.currentStep).toBe(0)
    expect(store.draft.name).toBe('')
  })
})

describe('Character store — isComplete', () => {
  let store

  beforeEach(() => {
    Object.keys(_storage).forEach(k => delete _storage[k])
    setActivePinia(createPinia())
    store = useCharacterStore()
  })

  it('falsy when all fields missing', () => expect(store.isComplete).toBeFalsy())

  it('falsy when only name is set', () => {
    store.draft.name = 'Legolas'
    expect(store.isComplete).toBeFalsy()
  })

  it('falsy with name + race + class but no background', () => {
    store.draft.name  = 'Legolas'
    store.draft.race  = 'elf'
    store.draft.class = 'ranger'
    expect(store.isComplete).toBeFalsy()
  })

  it('truthy when name, race, class, and background are all set', () => {
    store.draft.name       = 'Legolas'
    store.draft.race       = 'elf'
    store.draft.class      = 'ranger'
    store.draft.background = 'Outlander'
    expect(store.isComplete).toBeTruthy()
  })
})

describe('Character store — save / load / delete', () => {
  let store

  beforeEach(() => {
    Object.keys(_storage).forEach(k => delete _storage[k])
    setActivePinia(createPinia())
    store = useCharacterStore()
  })

  const fillDraft = (s) => {
    s.draft.name = 'Frodo'; s.draft.race = 'halfling'
    s.draft.class = 'rogue'; s.draft.background = 'Urchin'
  }

  it('saveCharacter adds entry to savedCharacters', () => {
    fillDraft(store)
    store.saveCharacter()
    expect(store.savedCharacters).toHaveLength(1)
    expect(store.savedCharacters[0].draft.name).toBe('Frodo')
  })

  it('saveCharacter updates existing entry on re-save', () => {
    fillDraft(store)
    store.saveCharacter()
    store.draft.name = 'Frodo Baggins'
    store.saveCharacter()
    expect(store.savedCharacters).toHaveLength(1)
    expect(store.savedCharacters[0].draft.name).toBe('Frodo Baggins')
  })

  it('isSaved is true after saving and false after reset', () => {
    fillDraft(store)
    store.saveCharacter()
    expect(store.isSaved).toBe(true)
    store.reset()
    expect(store.isSaved).toBe(false)
  })

  it('loadSavedCharacter restores draft and sheet', () => {
    const saved = {
      id: 'abc',
      savedAt: new Date().toISOString(),
      draft:   { ...emptyCharacter(), name: 'Bilbo', race: 'halfling', savedId: 'abc' },
      sheet:   { max_hp: 9 },
    }
    store.loadSavedCharacter(saved)
    expect(store.draft.name).toBe('Bilbo')
    expect(store.sheet.max_hp).toBe(9)
  })

  it('unsaveCharacter removes the entry', () => {
    fillDraft(store)
    store.saveCharacter()
    const id = store.savedCharacters[0].id
    store.unsaveCharacter(id)
    expect(store.savedCharacters).toHaveLength(0)
  })

  it('unsaveCharacter clears savedId from draft if it was the active character', () => {
    fillDraft(store)
    store.saveCharacter()
    const id = store.draft.savedId
    store.unsaveCharacter(id)
    expect(store.draft.savedId).toBeNull()
  })

  it('importCharacter adds a new entry with a generated id', () => {
    store.importCharacter({
      draft: { name: 'Gimli', race: 'dwarf', class: 'fighter', background: 'Soldier' },
      sheet: null,
    })
    expect(store.savedCharacters).toHaveLength(1)
    expect(store.savedCharacters[0].draft.name).toBe('Gimli')
    expect(store.savedCharacters[0].id).toBeTruthy()
  })

  it('importCharacter coexists with existing saves', () => {
    fillDraft(store)
    store.saveCharacter()
    store.importCharacter({
      draft: { name: 'Gimli', race: 'dwarf', class: 'fighter', background: 'Soldier' },
      sheet: null,
    })
    expect(store.savedCharacters).toHaveLength(2)
  })
})
