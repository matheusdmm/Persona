<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Ability Scores</h2>
    <p class="text-stone-400 text-sm mb-4">
      Distribute your ability scores using one of the methods below.
    </p>

    <!-- Method tabs -->
    <div class="flex gap-2 mb-6">
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
    <div v-if="method === 'pointbuy'" class="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-xl flex items-center gap-4">
      <span class="text-stone-400 text-sm">Points spent:</span>
      <span class="font-bold" :class="pointsSpent > 27 ? 'text-red-500' : 'text-gold'">
        {{ pointsSpent }} / 27
      </span>
    </div>

    <!-- Standard array hint -->
    <div v-if="method === 'standard'" class="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-xl">
      <span class="text-stone-400 text-sm">Standard array: </span>
      <span class="text-parchment text-sm font-medium">15, 14, 13, 12, 10, 8</span>
    </div>

    <!-- Dice roll hint -->
    <div v-if="method === 'roll'" class="mb-4 p-3 bg-stone-800 border border-stone-700 rounded-xl">
      <span class="text-stone-400 text-sm">Click each stat to reroll — </span>
      <span class="text-parchment text-sm font-medium">2d20 drop lowest</span>
    </div>

    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <div v-for="ability in ABILITY_NAMES" :key="ability" class="flex flex-col items-center gap-1">
        <AbilityScoreInput
          :label="ABILITY_LABELS[ability]"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import AbilityScoreInput from '@/components/ui/AbilityScoreInput.vue'
import { ABILITY_NAMES, ABILITY_LABELS } from '@/types'
import { useAbilityScores } from '@/composables/useAbilityScores'
import type { AbilityScores, AbilityName } from '@/types/models'

type RollResult = { dice: number[]; droppedIdx: number; total: number }

const props = defineProps<{ modelValue: AbilityScores }>()
const emit = defineEmits<{ 'update:modelValue': [AbilityScores] }>()

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

function setMethod(value: string): void {
  method.value = value
  if (value === 'roll') rollAll()
}

function roll2d20DropLowest(): RollResult {
  const dice = Array.from({ length: 2 }, () => Math.ceil(Math.random() * 20))
  const droppedIdx = dice.indexOf(Math.min(...dice))
  const total = dice[droppedIdx === 0 ? 1 : 0]
  return { dice, droppedIdx, total }
}

function rollOne(ability: AbilityName): void {
  const result = roll2d20DropLowest()
  rollResults[ability] = result
  emit('update:modelValue', { ...props.modelValue, [ability]: result.total })
}

function rollAll(): void {
  const newScores = { ...props.modelValue } as AbilityScores
  for (const ability of ABILITY_NAMES) {
    const result = roll2d20DropLowest()
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
