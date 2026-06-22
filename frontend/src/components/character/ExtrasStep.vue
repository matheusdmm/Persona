<template>
  <div>
    <h2 class="font-display text-2xl font-bold text-parchment tracking-wide mb-1">Equipment & Details</h2>
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

      <!-- Armor -->
      <section>
        <h3 class="text-gold text-xs tracking-widest uppercase font-semibold mb-3 border-b border-stone-700 pb-2">
          Armor
        </h3>

        <div v-if="!modelValue.class" class="text-stone-500 text-sm italic">No class selected.</div>

        <div v-else class="space-y-3">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              @click="selectArmor('')"
              class="text-left px-3 py-2 border rounded-md transition-all duration-150 text-sm"
              :class="!modelValue.armor
                ? 'border-gold bg-gold/10 text-parchment'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'"
            >
              <div class="font-semibold leading-tight">Unarmored</div>
              <div class="text-xs opacity-70 mt-0.5">{{ unarmoredLabel }}</div>
            </button>

            <button
              v-for="a in proficientArmor"
              :key="a.id"
              @click="selectArmor(a.id)"
              class="text-left px-3 py-2 border rounded-md transition-all duration-150 text-sm"
              :class="modelValue.armor === a.id
                ? 'border-gold bg-gold/10 text-parchment'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'"
            >
              <div class="font-semibold leading-tight">{{ a.name }}</div>
              <div class="text-xs opacity-70 mt-0.5">AC {{ a.base }} · {{ a.type }}</div>
            </button>
          </div>

          <div v-if="hasShieldProficiency">
            <button
              @click="toggleShield"
              class="px-3 py-2 border rounded-md transition-all duration-150 text-sm"
              :class="modelValue.shield
                ? 'border-gold bg-gold/10 text-parchment'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'"
            >
              <span class="font-semibold">Shield</span>
              <span class="text-xs opacity-70 ml-1.5">+2 AC</span>
            </button>
          </div>

          <p class="text-xs text-stone-500">
            Estimated AC: <strong class="text-stone-300">{{ acPreview }}</strong>
          </p>
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
            @input="update('gold', Number(($event.target as HTMLInputElement).value))"
            min="0"
            class="w-28 bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                   focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                   text-center text-xl font-semibold rounded-md shadow-input transition-shadow"
          />
          <span class="text-stone-400">gp</span>
          <button v-if="goldFormula" @click="rollGold" class="btn-secondary text-sm px-3 py-2">
            Roll {{ goldFormula }}
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
            class="flex items-center gap-1.5 px-3 py-1 bg-stone-800 border text-sm rounded-full"
            :class="lang === 'Common'
              ? 'border-stone-600 text-stone-400'
              : 'border-stone-600 text-parchment'"
          >
            {{ lang }}
            <button
              v-if="lang !== 'Common'"
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

        <!-- Extended items browser -->
        <div class="mt-3">
          <ExtendedToggle
            :model-value="extItemsOn"
            :loading="extItemsLoading"
            label="Browse extended items (WotC)"
            @update:model-value="toggleExtItems"
          />

          <div v-if="extItemsOn" class="mt-2">
            <input
              v-model="extItemSearch"
              type="text"
              placeholder="Search WotC items…"
              class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                     focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                     placeholder-stone-500 rounded-md shadow-input text-sm transition-shadow"
            />
            <ul
              v-if="filteredExtItems.length"
              class="mt-1 max-h-64 overflow-y-auto rounded-md border border-stone-700 divide-y divide-stone-800 bg-stone-900 shadow-xl"
            >
              <li
                v-for="item in filteredExtItems"
                :key="item.name"
                @mousedown.prevent="addExtItem(item)"
                class="px-3 py-2.5 cursor-pointer transition-colors hover:bg-stone-800 hover:text-parchment text-stone-300"
              >
                <div class="text-sm font-medium leading-tight">{{ item.name }}</div>
                <div class="flex flex-wrap gap-x-2 mt-0.5">
                  <span v-if="item.damage && item.damageType" class="text-xs text-gold/80">
                    {{ item.damage }} {{ item.damageType }}
                  </span>
                  <span v-else-if="item.armorClass" class="text-xs text-gold/80">
                    AC {{ item.armorClass }}<span v-if="item.armorType"> · {{ item.armorType }}</span>
                  </span>
                  <span v-if="item.weaponProps" class="text-xs text-stone-500">{{ item.weaponProps }}</span>
                  <span v-if="item.cost" class="text-xs text-stone-500">{{ item.cost }}</span>
                  <span v-if="!item.damage && !item.armorClass && !item.cost && item.category" class="text-xs text-stone-500">{{ item.category }}</span>
                </div>
              </li>
            </ul>
            <p v-else-if="extItemSearch.trim()" class="mt-1 text-xs text-stone-500">
              No items match "{{ extItemSearch }}"
            </p>
          </div>
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
              @input="update(field.key, ($event.target as HTMLTextAreaElement).value)"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ExtendedToggle from '@/components/ui/ExtendedToggle.vue'
import {
  ALL_LANGUAGES, RACE_LANGUAGES,
  CLASS_GOLD_ROLLS, CLASS_STARTING_EQUIPMENT,
  WEAPONS, isProficientWith,
} from '@/types'
import { useCharacterStore } from '@/stores/character'
import { getExtendedItems } from '@/composables/useExtendedData'
import type { CharacterDraft, ExtendedItem } from '@/types'

const props = defineProps<{ modelValue: CharacterDraft }>()
const emit = defineEmits<{ 'update:modelValue': [CharacterDraft] }>()
const store = useCharacterStore()

function update(field: keyof CharacterDraft, value: unknown): void {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const proficientWeapons = computed(() => {
  const profs = store.selectedClass?.weapon_proficiencies ?? []
  return WEAPONS.filter(w => isProficientWith(w, profs))
})

const proficientArmor = computed(() => {
  const profs = store.selectedClass?.armor_proficiencies ?? []
  if (!profs.length) return []
  if (profs.includes('all')) return store.armors
  return store.armors.filter(a => profs.includes(a.proficiency))
})

const hasShieldProficiency = computed(() => {
  const profs = store.selectedClass?.armor_proficiencies ?? []
  return profs.some(p => p === 'all' || p === 'shields' || p === 'shields_non_metal')
})

const unarmoredLabel = computed(() => {
  if (props.modelValue.class === 'barbarian') return '10 + DEX + CON'
  if (props.modelValue.class === 'monk') return '10 + DEX + WIS'
  return '10 + DEX'
})

const acPreview = computed(() => {
  const raceBonuses = store.selectedRace?.ability_bonuses ?? []
  function bonused(ability: string, base: number) {
    return base + (raceBonuses.find(b => b.ability === ability)?.bonus ?? 0)
  }
  function mod(score: number) { return Math.floor((score - 10) / 2) }

  const dexMod = mod(bonused('dexterity', props.modelValue.abilities.dexterity))
  const conMod = mod(bonused('constitution', props.modelValue.abilities.constitution))
  const wisMod = mod(bonused('wisdom', props.modelValue.abilities.wisdom))

  const armor = store.armors.find(a => a.id === props.modelValue.armor)
  let ac: number
  if (armor) {
    if (armor.type === 'light') ac = armor.base + dexMod
    else if (armor.type === 'medium') ac = armor.base + Math.min(dexMod, 2)
    else ac = armor.base
  } else if (props.modelValue.class === 'barbarian') {
    ac = 10 + dexMod + conMod
  } else if (props.modelValue.class === 'monk') {
    ac = 10 + dexMod + wisMod
  } else {
    ac = 10 + dexMod
  }
  if (props.modelValue.shield) ac += 2
  return ac
})

function selectArmor(id: string): void {
  update('armor', id)
}

function toggleShield(): void {
  update('shield', !props.modelValue.shield)
}

function toggleWeapon(id: string): void {
  const current = props.modelValue.weapons ?? []
  const next = current.includes(id) ? current.filter(w => w !== id) : [...current, id]
  update('weapons', next)
}

onMounted(() => {
  const langs = props.modelValue.languages.length
    ? props.modelValue.languages
    : (RACE_LANGUAGES[props.modelValue.race] ?? ['Common'])
  if (!langs.includes('Common')) {
    update('languages', ['Common', ...langs])
  } else if (!props.modelValue.languages.length) {
    update('languages', langs)
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

function removeLanguage(lang: string): void {
  update('languages', props.modelValue.languages.filter(l => l !== lang))
}

const newItem = ref('')

function addItem() {
  const trimmed = newItem.value.trim()
  if (!trimmed) return
  update('equipment', [...props.modelValue.equipment, trimmed])
  newItem.value = ''
}

function removeItem(i: number): void {
  update('equipment', props.modelValue.equipment.filter((_, idx) => idx !== i))
}

// Extended items
const extItemsOn      = ref(localStorage.getItem('hs_ext_items') === '1')
const extItemsLoading = ref(false)
const extItemSearch   = ref('')
const allExtItems     = ref<ExtendedItem[]>([])

const filteredExtItems = computed(() => {
  const q = extItemSearch.value.toLowerCase().trim()
  if (!q) return []
  return allExtItems.value.filter(item => item.name.toLowerCase().includes(q)).slice(0, 40)
})

async function loadExtItems() {
  if (allExtItems.value.length > 0) return
  extItemsLoading.value = true
  try { allExtItems.value = await getExtendedItems() } catch {}
  extItemsLoading.value = false
}

async function toggleExtItems() {
  extItemsOn.value = !extItemsOn.value
  localStorage.setItem('hs_ext_items', extItemsOn.value ? '1' : '0')
  if (extItemsOn.value) await loadExtItems()
  if (!extItemsOn.value) extItemSearch.value = ''
}

function addExtItem(item: ExtendedItem): void {
  if (!item) return
  if (!props.modelValue.equipment.includes(item.name)) {
    update('equipment', [...props.modelValue.equipment, item.name])
  }
  extItemSearch.value = ''
}

if (extItemsOn.value) loadExtItems()

const personalityFields: Array<{ key: 'trait' | 'ideal' | 'bond' | 'flaw'; label: string; placeholder: string }> = [
  { key: 'trait', label: 'Personality Trait', placeholder: 'How does your character behave?' },
  { key: 'ideal', label: 'Ideal',             placeholder: 'What principle drives them?' },
  { key: 'bond',  label: 'Bond',              placeholder: 'What ties them to the world?' },
  { key: 'flaw',  label: 'Flaw',              placeholder: 'What weakness holds them back?' },
]
</script>
