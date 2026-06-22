<template>
  <div>
    <h2 class="font-display text-2xl font-bold text-parchment tracking-wide mb-1">Ability Scores</h2>
    <p class="text-stone-400 text-sm mb-1">
      Distribute your ability scores using one of the methods below.
    </p>
    <p v-if="hasRaceBonus" class="text-xs text-gold/80 mb-4">
      Scores below include your <span class="capitalize">{{ store.selectedRace?.name }}</span> ability bonuses
      <span class="text-stone-500">(shown as a +N badge and final score).</span>
    </p>
    <div v-else class="mb-4" />

    <!-- Method tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="m in methods"
        :key="m.value"
        class="px-3 py-1.5 text-sm border rounded-md transition-all duration-150"
        :class="method === m.value
          ? 'border-gold text-gold bg-gold/10 shadow-sm'
          : 'border-stone-600 text-stone-400 hover:border-stone-500'"
        @click="setMethod(m.value)"
      >
        {{ m.label }}
      </button>
    </div>

    <!-- Point buy budget -->
    <div v-if="method === 'pointbuy'" class="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-xl flex flex-wrap items-center gap-x-4 gap-y-1">
      <span class="text-stone-400 text-sm">Points spent:</span>
      <span class="font-bold" :class="pointsSpent > 27 ? 'text-red-500' : 'text-gold'">
        {{ pointsSpent }} / 27
      </span>
      <span class="text-stone-500 text-xs">Each score 8–15 before racial bonuses.</span>
    </div>

    <!-- Standard array hint -->
    <div v-if="method === 'standard'" class="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-xl">
      <span class="text-stone-400 text-sm">Standard array: </span>
      <span class="text-parchment text-sm font-medium">15, 14, 13, 12, 10, 8</span>
      <span class="text-stone-500 text-xs"> — assign each value once (pick a value to swap it).</span>
    </div>

    <!-- Dice roll hint -->
    <div v-if="method === 'roll'" class="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-xl">
      <span class="text-stone-400 text-sm">Click each stat to reroll — </span>
      <span class="text-parchment text-sm font-medium">4d6 drop lowest</span>
    </div>

    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <div v-for="ability in ABILITY_NAMES" :key="ability" class="flex flex-col items-center gap-1">

        <!-- Manual / Dice Roll: editable number input -->
        <template v-if="method === 'manual' || method === 'roll'">
          <AbilityScoreInput
            :label="ABILITY_LABELS[ability]"
            :bonus="raceBonus(ability)"
            :model-value="scores[ability]"
            @update:model-value="onManualInput(ability, $event)"
          />
          <template v-if="method === 'roll'">
            <button
              @click="rollOne(ability)"
              class="px-2 py-0.5 text-xs border border-stone-600 text-stone-400
                     rounded hover:border-gold hover:text-gold transition-all duration-150"
            >
              Roll
            </button>
            <div v-if="rollResults[ability]" class="flex gap-1 text-xs">
              <span
                v-for="(d, i) in rollResults[ability].dice"
                :key="i"
                :class="i === rollResults[ability].droppedIdx
                  ? 'line-through text-stone-500'
                  : 'text-stone-300 font-medium'"
              >{{ d }}</span>
            </div>
          </template>
        </template>

        <!-- Standard Array: assign-with-swap dropdown -->
        <template v-else-if="method === 'standard'">
          <label class="text-xs text-stone-400 tracking-widest uppercase">{{ ABILITY_LABELS[ability] }}</label>
          <div class="relative">
            <select
              :value="scores[ability]"
              @change="setStandard(ability, Number(($event.target as HTMLSelectElement).value))"
              class="w-16 h-16 text-center text-xl font-bold bg-stone-800 border border-stone-600
                     text-parchment rounded-lg appearance-none cursor-pointer
                     focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            >
              <option v-for="v in STANDARD_ARRAY" :key="v" :value="v">{{ v }}</option>
            </select>
            <span
              v-if="raceBonus(ability) > 0"
              class="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                     bg-gold/20 text-gold border border-gold/40 pointer-events-none"
            >+{{ raceBonus(ability) }}</span>
          </div>
          <span class="text-sm font-semibold" :class="finalMod(ability) >= 0 ? 'text-vivid' : 'text-red-500'">
            {{ formatMod(finalMod(ability)) }}
            <span v-if="raceBonus(ability) > 0" class="text-stone-500 font-normal text-xs ml-0.5">({{ finalScore(ability) }})</span>
          </span>
        </template>

        <!-- Point Buy: stepper -->
        <template v-else-if="method === 'pointbuy'">
          <label class="text-xs text-stone-400 tracking-widest uppercase">{{ ABILITY_LABELS[ability] }}</label>
          <div class="relative">
            <div class="w-16 h-16 flex items-center justify-center text-xl font-bold
                        bg-stone-800 border border-stone-600 text-parchment rounded-lg">
              {{ scores[ability] }}
            </div>
            <span
              v-if="raceBonus(ability) > 0"
              class="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                     bg-gold/20 text-gold border border-gold/40"
            >+{{ raceBonus(ability) }}</span>
          </div>
          <div class="flex gap-1">
            <button
              @click="dec(ability)"
              :disabled="!canDec(ability)"
              class="w-7 h-6 flex items-center justify-center text-sm border border-stone-600 text-stone-300
                     rounded hover:border-gold hover:text-gold transition-all duration-150
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-stone-600 disabled:hover:text-stone-300"
              aria-label="Decrease"
            >−</button>
            <button
              @click="inc(ability)"
              :disabled="!canInc(ability)"
              class="w-7 h-6 flex items-center justify-center text-sm border border-stone-600 text-stone-300
                     rounded hover:border-gold hover:text-gold transition-all duration-150
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-stone-600 disabled:hover:text-stone-300"
              aria-label="Increase"
            >+</button>
          </div>
          <span class="text-sm font-semibold" :class="finalMod(ability) >= 0 ? 'text-vivid' : 'text-red-500'">
            {{ formatMod(finalMod(ability)) }}
            <span v-if="raceBonus(ability) > 0" class="text-stone-500 font-normal text-xs ml-0.5">({{ finalScore(ability) }})</span>
          </span>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import AbilityScoreInput from '@/components/ui/AbilityScoreInput.vue'
import { ABILITY_NAMES, ABILITY_LABELS } from '@/types'
import { modifier, formatMod, STANDARD_ARRAY, useAbilityScores } from '@/composables/useAbilityScores'
import { useCharacterStore } from '@/stores/character'
import type { AbilityScores, AbilityName } from '@/types/models'

type RollResult = { dice: number[]; droppedIdx: number; total: number }

const props = defineProps<{ modelValue: AbilityScores }>()
const emit = defineEmits<{ 'update:modelValue': [AbilityScores] }>()
const store = useCharacterStore()

const scores = computed({
  get: () => props.modelValue,
  set: (val: AbilityScores) => emit('update:modelValue', val),
})

const method = ref('manual')
const methods = [
  { value: 'manual', label: 'Manual' },
  { value: 'standard', label: 'Standard Array' },
  { value: 'pointbuy', label: 'Point Buy' },
  { value: 'roll', label: 'Dice Roll' },
]

const { pointBuyCost } = useAbilityScores()
const pointsSpent = computed(() => pointBuyCost(scores.value))

const rollResults = reactive<Partial<Record<AbilityName, RollResult | null>>>({})

// ── Racial bonuses ──
function raceBonus(ability: string): number {
  return store.selectedRace?.ability_bonuses?.find(b => b.ability === ability)?.bonus ?? 0
}
function finalScore(ability: AbilityName): number {
  return scores.value[ability] + raceBonus(ability)
}
function finalMod(ability: AbilityName): number {
  return modifier(finalScore(ability))
}
const hasRaceBonus = computed(() => ABILITY_NAMES.some(a => raceBonus(a) > 0))

function setMethod(value: string): void {
  method.value = value
  if (value === 'roll') rollAll()
  else if (value === 'standard') {
    const next = { ...props.modelValue } as AbilityScores
    ABILITY_NAMES.forEach((a, i) => { next[a] = STANDARD_ARRAY[i] })
    emit('update:modelValue', next)
  } else if (value === 'pointbuy') {
    const next = { ...props.modelValue } as AbilityScores
    ABILITY_NAMES.forEach(a => { next[a] = 8 })
    emit('update:modelValue', next)
  }
}

// ── Standard array (assign with swap) ──
function setStandard(ability: AbilityName, value: number): void {
  const cur = props.modelValue
  const prev = cur[ability]
  const other = ABILITY_NAMES.find(a => a !== ability && cur[a] === value)
  const next = { ...cur, [ability]: value } as AbilityScores
  if (other) next[other] = prev
  emit('update:modelValue', next)
}

// ── Point buy steppers ──
function canDec(ability: AbilityName): boolean {
  return scores.value[ability] > 8
}
function canInc(ability: AbilityName): boolean {
  const s = scores.value[ability]
  if (s >= 15) return false
  return pointBuyCost({ ...scores.value, [ability]: s + 1 }) <= 27
}
function inc(ability: AbilityName): void {
  if (!canInc(ability)) return
  emit('update:modelValue', { ...props.modelValue, [ability]: props.modelValue[ability] + 1 })
}
function dec(ability: AbilityName): void {
  if (!canDec(ability)) return
  emit('update:modelValue', { ...props.modelValue, [ability]: props.modelValue[ability] - 1 })
}

// ── Dice roll ──
function roll4d6DropLowest(): RollResult {
  const dice = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6))
  const droppedIdx = dice.indexOf(Math.min(...dice))
  const total = dice.reduce((sum, d, i) => (i === droppedIdx ? sum : sum + d), 0)
  return { dice, droppedIdx, total }
}

function rollOne(ability: AbilityName): void {
  const result = roll4d6DropLowest()
  rollResults[ability] = result
  emit('update:modelValue', { ...props.modelValue, [ability]: result.total })
}

function rollAll(): void {
  const newScores = { ...props.modelValue } as AbilityScores
  for (const ability of ABILITY_NAMES) {
    const result = roll4d6DropLowest()
    rollResults[ability] = result
    newScores[ability] = result.total
  }
  emit('update:modelValue', newScores)
}

function onManualInput(ability: AbilityName, value: number): void {
  rollResults[ability] = null
  emit('update:modelValue', { ...props.modelValue, [ability]: value })
}
</script>
