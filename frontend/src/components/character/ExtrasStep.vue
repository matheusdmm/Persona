<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Equipment & Details</h2>
    <p class="text-stone-400 text-sm mb-8">Starting gold, gear, languages, and personality.</p>

    <div class="space-y-10">

      <!-- Weapons -->
      <section>
        <h3 class="text-gold text-xs tracking-widest uppercase font-semibold mb-3 border-b border-stone-700 pb-2">
          Weapons
        </h3>
        <div v-if="!proficientWeapons.length" class="text-stone-500 text-sm italic">
          No class selected.
        </div>
        <div v-else>
          <div class="mb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="w in proficientWeapons"
              :key="w.id"
              @click="toggleWeapon(w.id)"
              class="text-left px-3 py-2 border rounded-md transition-all duration-150 text-sm"
              :class="modelValue.weapons?.includes(w.id)
                ? 'border-gold bg-gold/10 text-parchment'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'"
            >
              <div class="font-semibold leading-tight">{{ w.name }}</div>
              <div class="text-xs opacity-70 mt-0.5">{{ w.damage }} {{ w.damageType }}</div>
            </button>
          </div>
          <p class="text-xs text-stone-500">Showing weapons your class is proficient with. Click to equip.</p>
        </div>
      </section>

      <!-- Gold -->
      <section>
        <h3 class="text-gold text-xs tracking-widest uppercase font-semibold mb-3 border-b border-stone-700 pb-2">
          Starting Gold
        </h3>
        <div class="flex items-center gap-3">
          <input
            type="number"
            :value="modelValue.gold"
            @input="update('gold', +$event.target.value)"
            min="0"
            class="w-28 bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                   focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                   text-center text-xl font-semibold rounded-md shadow-input transition-shadow"
          />
          <span class="text-stone-400">gp</span>
          <button v-if="goldFormula" @click="rollGold" class="btn-secondary text-sm px-3 py-2">
            🎲 Roll {{ goldFormula }}
          </button>
        </div>
      </section>

      <!-- Languages -->
      <section>
        <h3 class="text-gold text-xs tracking-widest uppercase font-semibold mb-3 border-b border-stone-700 pb-2">
          Languages
        </h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="lang in modelValue.languages"
            :key="lang"
            class="flex items-center gap-1.5 px-3 py-1 bg-stone-800 border border-stone-600
                   text-parchment text-sm rounded-full"
          >
            {{ lang }}
            <button
              @click="removeLanguage(lang)"
              class="text-stone-500 hover:text-red-500 transition-colors leading-none"
            >×</button>
          </span>
          <span v-if="!modelValue.languages.length" class="text-stone-500 text-sm italic">None selected</span>
        </div>
        <div class="flex gap-2">
          <select
            v-model="newLanguage"
            class="bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                   focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                   rounded-md shadow-input text-sm transition-shadow"
          >
            <option value="">Add language…</option>
            <option v-for="lang in availableLanguages" :key="lang" :value="lang">{{ lang }}</option>
          </select>
          <button
            @click="addLanguage"
            :disabled="!newLanguage"
            class="btn-secondary text-sm px-3 py-2"
          >
            Add
          </button>
        </div>
      </section>

      <!-- Equipment -->
      <section>
        <h3 class="text-gold text-xs tracking-widest uppercase font-semibold mb-3 border-b border-stone-700 pb-2">
          Starting Equipment
        </h3>
        <ul class="space-y-2 mb-3">
          <li
            v-for="(item, i) in modelValue.equipment"
            :key="i"
            class="flex items-center gap-2"
          >
            <span class="text-gold text-xs">◆</span>
            <span class="flex-1 text-parchment text-sm">{{ item }}</span>
            <button
              @click="removeItem(i)"
              class="text-stone-500 hover:text-red-500 transition-colors text-lg leading-none"
            >×</button>
          </li>
          <li v-if="!modelValue.equipment.length" class="text-stone-500 text-sm italic">No items added</li>
        </ul>
        <div class="flex gap-2">
          <input
            v-model="newItem"
            type="text"
            placeholder="Add item…"
            @keyup.enter="addItem"
            class="flex-1 bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                   focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                   placeholder-stone-500 rounded-md shadow-input text-sm transition-shadow"
          />
          <button @click="addItem" :disabled="!newItem.trim()" class="btn-secondary text-sm px-3 py-2">
            Add
          </button>
        </div>
      </section>

      <!-- Personality -->
      <section>
        <h3 class="text-gold text-xs tracking-widest uppercase font-semibold mb-3 border-b border-stone-700 pb-2">
          Personality <span class="text-stone-500 normal-case tracking-normal font-normal">(optional)</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in personalityFields" :key="field.key">
            <label class="block text-xs text-stone-400 uppercase tracking-wide mb-1">{{ field.label }}</label>
            <textarea
              :value="modelValue[field.key]"
              @input="update(field.key, $event.target.value)"
              :placeholder="field.placeholder"
              rows="2"
              class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                     focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                     placeholder-stone-500 rounded-md shadow-input text-sm resize-none transition-shadow"
            />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ALL_LANGUAGES, RACE_LANGUAGES,
  CLASS_GOLD_ROLLS, CLASS_STARTING_EQUIPMENT,
  WEAPONS, isProficientWith,
} from '@/types/index.js'
import { useCharacterStore } from '@/stores/character.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue'])
const store = useCharacterStore()

function update(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const proficientWeapons = computed(() => {
  const profs = store.selectedClass?.weapon_proficiencies ?? []
  return WEAPONS.filter(w => isProficientWith(w, profs))
})

function toggleWeapon(id) {
  const current = props.modelValue.weapons ?? []
  const next = current.includes(id) ? current.filter(w => w !== id) : [...current, id]
  update('weapons', next)
}

onMounted(() => {
  if (!props.modelValue.languages.length) {
    update('languages', RACE_LANGUAGES[props.modelValue.race] ?? ['Common'])
  }
  if (!props.modelValue.equipment.length) {
    update('equipment', CLASS_STARTING_EQUIPMENT[props.modelValue.class] ?? [])
  }
})

const goldFormula = computed(() => CLASS_GOLD_ROLLS[props.modelValue.class]?.label)

function rollGold() {
  const f = CLASS_GOLD_ROLLS[props.modelValue.class]
  if (!f) return
  const total = Array.from({ length: f.count }, () => Math.ceil(Math.random() * f.die))
    .reduce((a, b) => a + b, 0) * f.multiplier
  update('gold', total)
}

const newLanguage = ref('')
const availableLanguages = computed(() =>
  ALL_LANGUAGES.filter(l => !props.modelValue.languages.includes(l))
)

function addLanguage() {
  if (!newLanguage.value) return
  update('languages', [...props.modelValue.languages, newLanguage.value])
  newLanguage.value = ''
}

function removeLanguage(lang) {
  update('languages', props.modelValue.languages.filter(l => l !== lang))
}

const newItem = ref('')

function addItem() {
  const trimmed = newItem.value.trim()
  if (!trimmed) return
  update('equipment', [...props.modelValue.equipment, trimmed])
  newItem.value = ''
}

function removeItem(i) {
  update('equipment', props.modelValue.equipment.filter((_, idx) => idx !== i))
}

const personalityFields = [
  { key: 'trait', label: 'Personality Trait', placeholder: 'How does your character behave?' },
  { key: 'ideal', label: 'Ideal',             placeholder: 'What principle drives them?' },
  { key: 'bond',  label: 'Bond',              placeholder: 'What ties them to the world?' },
  { key: 'flaw',  label: 'Flaw',              placeholder: 'What weakness holds them back?' },
]
</script>
