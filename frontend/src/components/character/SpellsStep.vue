<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Spells</h2>
    <p class="text-stone-400 text-sm mb-8">Choose your known spells and cantrips.</p>

    <!-- Non-caster -->
    <div v-if="!isSpellcaster" class="text-center py-16">
      <p class="text-stone-400 text-lg capitalize">{{ modelValue.class || 'This class' }} doesn't use spells.</p>
      <p class="text-stone-500 text-sm mt-2">Click "Create Character" to finish.</p>
    </div>

    <!-- Loading -->
    <div v-else-if="store.spellsLoading" class="flex items-center justify-center py-16 text-stone-500 gap-3" aria-live="polite">
      <LoadingSpinner class="w-5 h-5" />
      <span class="text-sm">Loading spells…</span>
    </div>

    <!-- No spells available at this level -->
    <div v-else-if="!filteredSpells.length && !search" class="text-center py-16">
      <p class="text-stone-400">No spells available at level {{ modelValue.level }} yet.</p>
      <p class="text-stone-500 text-sm mt-1">Your class gains spells at a higher level.</p>
    </div>

    <!-- Spell selector -->
    <div v-else>
      <!-- Info row -->
      <div class="flex flex-wrap gap-4 mb-5 p-3 bg-stone-800 border border-stone-700 rounded-lg text-sm">
        <span class="text-stone-400">
          Spellcasting ability:
          <strong class="text-parchment capitalize">{{ spellAbility }}</strong>
        </span>
        <span class="text-stone-600">·</span>
        <span class="text-stone-400">
          Selected: <strong class="text-gold">{{ selectedCount }}</strong>
        </span>
        <span class="text-stone-600">·</span>
        <ExtendedToggle
          :model-value="extendedOn"
          :loading="extLoading"
          label="Extended content"
          @update:model-value="toggleExtended"
        />
      </div>

      <!-- Search + level tabs -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name or school…"
          class="flex-1 bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 placeholder-stone-500 rounded-md text-sm"
        />
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="tab in levelTabs"
            :key="tab"
            @click="activeLevel = tab"
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors border"
            :class="activeLevel === tab
              ? 'bg-gold/20 text-gold border-gold/40'
              : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-300'"
          >
            {{ tab === -1 ? 'All' : SPELL_LEVEL_LABELS[tab] }}
          </button>
        </div>
      </div>

      <p class="text-xs text-stone-500 mb-3">
        {{ filteredSpells.length }} spell{{ filteredSpells.length !== 1 ? 's' : '' }}
        <template v-if="activeLevel >= 0 && selectedInLevel > 0">
          · <span class="text-gold">{{ selectedInLevel }} selected</span>
        </template>
      </p>

      <!-- Spell grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          v-for="spell in filteredSpells"
          :key="spell.slug"
          @click="toggleSpell(spell)"
          class="text-left px-3 py-2.5 border rounded-md transition-all duration-150"
          :class="isSelected(spell)
            ? 'border-gold bg-gold/10 text-parchment'
            : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'"
        >
          <div class="font-semibold text-sm leading-tight">{{ spell.name }}</div>
          <div class="text-xs opacity-60 mt-0.5">
            {{ SPELL_LEVEL_LABELS[spell.level_int] }} · {{ spell.school }}
          </div>
          <div class="text-xs opacity-40 mt-0.5">{{ spell.casting_time }}</div>
          <div v-if="spell.extended" class="text-xs text-gold/50 mt-0.5 truncate">{{ spell.book }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { SPELLCASTING_CLASSES, SPELLCASTING_ABILITY, getSpellSlots, SPELL_LEVEL_LABELS } from '@/types'
import { useCharacterStore } from '@/stores/character'
import { getExtendedSpells } from '@/composables/useExtendedData'
import ExtendedToggle from '@/components/ui/ExtendedToggle.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { CharacterDraft, Spell } from '@/types/models'

const props = defineProps<{ modelValue: CharacterDraft }>()
const emit = defineEmits<{ 'update:modelValue': [CharacterDraft] }>()
const store = useCharacterStore()

const search = ref('')
const activeLevel = ref(-1)

const isSpellcaster = computed(() => SPELLCASTING_CLASSES.has(props.modelValue.class))
const spellAbility = computed(() => SPELLCASTING_ABILITY[props.modelValue.class] ?? '—')

const maxSpellLevel = computed(() => {
  const slots = getSpellSlots(props.modelValue.class, props.modelValue.level)
  if (!slots) return 0
  for (let i = 8; i >= 0; i--) {
    if (slots[i] > 0) return i + 1
  }
  return 0
})

// Extended spells
const extendedOn      = ref(localStorage.getItem('hs_ext_spells') === '1')
const extSpells       = ref<Spell[]>([])
const extLoading      = ref(false)

async function loadExtended(className: string): Promise<void> {
  if (!className || !extendedOn.value) return
  extLoading.value = true
  try {
    const raw = await getExtendedSpells(className)
    // dedup against Open5e spells by normalised name
    const existingNames = new Set(store.availableSpells.map(s => s.name.toLowerCase()))
    extSpells.value = raw.filter(s => !existingNames.has(s.name.toLowerCase()))
  } catch {
    extSpells.value = []
  } finally {
    extLoading.value = false
  }
}

async function toggleExtended() {
  extendedOn.value = !extendedOn.value
  localStorage.setItem('hs_ext_spells', extendedOn.value ? '1' : '0')
  if (extendedOn.value) await loadExtended(props.modelValue.class)
  else extSpells.value = []
}

const accessibleSpells = computed(() => {
  const base = store.availableSpells.filter(s => s.level_int === 0 || s.level_int <= maxSpellLevel.value)
  if (!extendedOn.value) return base
  const ext  = extSpells.value.filter(s => s.level_int === 0 || s.level_int <= maxSpellLevel.value)
  return [...base, ...ext]
})

const levelTabs = computed(() => {
  const levels = [...new Set(accessibleSpells.value.map(s => s.level_int))].sort((a, b) => a - b)
  return levels.length ? [-1, ...levels] : []
})

const filteredSpells = computed(() => {
  let list = accessibleSpells.value
  if (activeLevel.value >= 0) list = list.filter(s => s.level_int === activeLevel.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.school.toLowerCase().includes(q))
  }
  return list
})

const selectedCount = computed(() => (props.modelValue.spells ?? []).length)

const selectedInLevel = computed(() =>
  (props.modelValue.spells ?? []).filter(s => s.level === activeLevel.value).length
)

function isSelected(spell: Spell): boolean {
  return (props.modelValue.spells ?? []).some(s => s.slug === spell.slug)
}

function toggleSpell(spell: Spell): void {
  const current = props.modelValue.spells ?? []
  const next = isSelected(spell)
    ? current.filter(s => s.slug !== spell.slug)
    : [...current, {
        slug:         spell.slug,
        name:         spell.name,
        level:        spell.level_int,
        school:       spell.school,
        casting_time: spell.casting_time,
        range:        spell.range,
        components:   spell.components,
      }]
  emit('update:modelValue', { ...props.modelValue, spells: next })
}

watch(
  () => props.modelValue.class,
  (className, oldClass) => {
    if (oldClass && className !== oldClass) {
      emit('update:modelValue', { ...props.modelValue, spells: [] })
      extSpells.value = []
    }
    search.value = ''
    activeLevel.value = -1
    if (className && SPELLCASTING_CLASSES.has(className)) {
      store.loadSpells(className)
      loadExtended(className)
    }
  },
  { immediate: true },)
</script>
