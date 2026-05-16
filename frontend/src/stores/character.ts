import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { emptyCharacter } from '@/types'
import { useApi } from '@/composables/useApi'
import type { Race, DnDClass, CharacterDraft, CharacterSheet, Spell, SavedEntry } from '@/types/models'

export const useCharacterStore = defineStore('character', () => {
  const { fetchRaces, fetchClasses, calculateSheet, fetchSpells } = useApi()

  // State
  const draft          = ref<CharacterDraft>(emptyCharacter())
  const races          = ref<Race[]>([])
  const classes        = ref<DnDClass[]>([])
  const sheet          = ref<CharacterSheet | null>(null)
  const currentStep    = ref(0)
  const loading        = ref(false)
  const error          = ref<string | null>(null)
  const LS_KEY         = 'dnd_characters'
  const savedCharacters = ref<SavedEntry[]>(JSON.parse(localStorage.getItem(LS_KEY) || '[]'))
  const availableSpells = ref<Spell[]>([])
  const spellsLoading  = ref(false)
  const spellsCache: Record<string, Spell[]> = {}

  // Getters
  const selectedRace  = computed(() => races.value.find(r => r.id === draft.value.race))
  const selectedClass = computed(() => classes.value.find(c => c.id === draft.value.class))
  const isComplete    = computed(() =>
    draft.value.name && draft.value.race && draft.value.class && draft.value.background
  )
  const isSaved = computed(() =>
    !!draft.value.savedId && savedCharacters.value.some(c => c.id === draft.value.savedId)
  )

  // Actions
  async function loadData(): Promise<void> {
    loading.value = true
    try {
      ;[races.value, classes.value] = await Promise.all([fetchRaces(), fetchClasses()])
    } catch {
      error.value = 'Failed to load game data'
    } finally {
      loading.value = false
    }
  }

  async function calculate(): Promise<void> {
    loading.value = true
    try {
      if (!draft.value.createdAt) draft.value.createdAt = new Date().toISOString()
      sheet.value = await calculateSheet({
        race:       draft.value.race,
        class:      draft.value.class,
        level:      draft.value.level,
        abilities:  draft.value.abilities,
        background: draft.value.background,
      })
    } catch {
      error.value = 'Failed to calculate character'
    } finally {
      loading.value = false
    }
  }

  function nextStep(): void { currentStep.value++ }
  function prevStep(): void { currentStep.value-- }
  function reset(): void {
    draft.value       = emptyCharacter()
    sheet.value       = null
    currentStep.value = 0
    error.value       = null
  }

  async function loadSpells(className: string): Promise<void> {
    if (spellsCache[className]) {
      availableSpells.value = spellsCache[className]
      return
    }
    spellsLoading.value = true
    try {
      const spells = await fetchSpells(className)
      spellsCache[className] = spells
      availableSpells.value = spells
    } catch {
      error.value = 'Failed to load spells'
    } finally {
      spellsLoading.value = false
    }
  }

  function _persistSaved(): void {
    localStorage.setItem(LS_KEY, JSON.stringify(savedCharacters.value))
  }

  function saveCharacter(): void {
    const id = draft.value.savedId || String(Date.now())
    draft.value.savedId = id
    const entry: SavedEntry = { id, savedAt: new Date().toISOString(), draft: { ...draft.value }, sheet: sheet.value }
    const idx = savedCharacters.value.findIndex(c => c.id === id)
    if (idx >= 0) savedCharacters.value[idx] = entry
    else savedCharacters.value.unshift(entry)
    _persistSaved()
  }

  function importCharacter(data: Partial<SavedEntry>): void {
    const id = String(Date.now())
    const entry: SavedEntry = {
      id,
      savedAt: new Date().toISOString(),
      draft: { ...emptyCharacter(), ...data.draft, savedId: id },
      sheet: data.sheet ?? null,
    }
    savedCharacters.value.unshift(entry)
    _persistSaved()
  }

  function unsaveCharacter(id: string): void {
    savedCharacters.value = savedCharacters.value.filter(c => c.id !== id)
    if (draft.value.savedId === id) draft.value.savedId = null
    _persistSaved()
  }

  function loadSavedCharacter(saved: SavedEntry): void {
    draft.value  = { ...saved.draft }
    sheet.value  = saved.sheet
  }

  return {
    draft, races, classes, sheet, currentStep, loading, error, savedCharacters,
    availableSpells, spellsLoading,
    selectedRace, selectedClass, isComplete, isSaved,
    loadData, calculate, nextStep, prevStep, reset,
    loadSpells, saveCharacter, importCharacter, unsaveCharacter, loadSavedCharacter,
  }
})
