import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { emptyCharacter, SPELLCASTING_CLASSES, getMaxCantrips, getMaxSpells, getSpellSlots } from '@/types'
import { useApi } from '@/composables/useApi'
import type { Race, DnDClass, CharacterDraft, CharacterSheet, Spell, SavedEntry, ArmorItem } from '@/types/models'

export const useCharacterStore = defineStore('character', () => {
  const { fetchRaces, fetchClasses, fetchArmor, calculateSheet, fetchSpells } = useApi()

  // Draft autosave — survive an accidental refresh mid-creation
  const DRAFT_KEY = 'dnd_draft'
  const persistedDraft = (() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      return raw ? (JSON.parse(raw) as { draft: CharacterDraft; step: number }) : null
    } catch { return null }
  })()

  // State
  const draft          = ref<CharacterDraft>(persistedDraft?.draft ?? emptyCharacter())
  const races          = ref<Race[]>([])
  const classes        = ref<DnDClass[]>([])
  const armors         = ref<ArmorItem[]>([])
  const sheet          = ref<CharacterSheet | null>(null)
  const currentStep    = ref(persistedDraft?.step ?? 0)
  // True when we restored an in-progress draft (has a name or is past step 0)
  const resumedDraft   = ref(!!persistedDraft && (!!persistedDraft.draft?.name || (persistedDraft.step ?? 0) > 0))
  const loading        = ref(false)
  const error          = ref<string | null>(null)
  const LS_KEY         = 'dnd_characters'
  const savedCharacters = ref<SavedEntry[]>(JSON.parse(localStorage.getItem(LS_KEY) || '[]'))
  const availableSpells = ref<Spell[]>([])
  const spellsLoading  = ref(false)
  const spellsCache: Record<string, Spell[]> = {}

  // Autosave draft + step on every change
  watch([draft, currentStep], () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft: draft.value, step: currentStep.value }))
  }, { deep: true })

  // Getters
  const selectedRace  = computed(() => races.value.find(r => r.id === draft.value.race))
  const selectedClass = computed(() => classes.value.find(c => c.id === draft.value.class))
  // Spell selection requirement for the current draft, or null for non-casters
  const spellProgress = computed(() => {
    const d = draft.value
    if (!SPELLCASTING_CLASSES.has(d.class)) return null
    const raceBonus = (ab: string) =>
      selectedRace.value?.ability_bonuses?.find(b => b.ability === ab)?.bonus ?? 0
    const wisMod = Math.floor((d.abilities.wisdom   + raceBonus('wisdom')   - 10) / 2)
    const chaMod = Math.floor((d.abilities.charisma + raceBonus('charisma') - 10) / 2)
    const slots = getSpellSlots(d.class, d.level)
    const hasSlots = slots ? slots.some(s => s > 0) : false
    const maxC = getMaxCantrips(d.class, d.edition)
    const maxS = hasSlots ? getMaxSpells(d.class, d.level, wisMod, chaMod) : 0
    const spells = d.spells ?? []
    const cantripCnt = spells.filter(s => s.level === 0).length
    const spellCnt   = spells.filter(s => s.level  > 0).length
    return { maxC, maxS, cantripCnt, spellCnt, complete: cantripCnt >= maxC && spellCnt >= maxS }
  })

  const isComplete = computed(() => {
    const d = draft.value
    if (!d.name || !d.race || !d.class || !d.background) return false
    if (spellProgress.value && !spellProgress.value.complete) return false
    return true
  })
  const isSaved = computed(() =>
    !!draft.value.savedId && savedCharacters.value.some(c => c.id === draft.value.savedId)
  )

  // Actions
  async function loadData(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      ;[races.value, classes.value, armors.value] = await Promise.all([fetchRaces(), fetchClasses(), fetchArmor()])
    } catch {
      error.value = 'Failed to load game data'
    } finally {
      loading.value = false
    }
  }

  async function calculate(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      if (!draft.value.createdAt) draft.value.createdAt = new Date().toISOString()
      sheet.value = await calculateSheet({
        race:       draft.value.race,
        class:      draft.value.class,
        level:      draft.value.level,
        abilities:  draft.value.abilities,
        background: draft.value.background,
        armor:      draft.value.armor,
        shield:     draft.value.shield,
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
    draft.value        = emptyCharacter()
    sheet.value        = null
    currentStep.value  = 0
    error.value        = null
    resumedDraft.value = false
    localStorage.removeItem(DRAFT_KEY)
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
    draft, races, classes, armors, sheet, currentStep, resumedDraft, loading, error, savedCharacters,
    availableSpells, spellsLoading,
    selectedRace, selectedClass, isComplete, isSaved, spellProgress,
    loadData, calculate, nextStep, prevStep, reset,
    loadSpells, saveCharacter, importCharacter, unsaveCharacter, loadSavedCharacter,
  }
})
