<template>
  <div class="flex flex-col items-center gap-1">
    <label class="text-xs text-stone-400 tracking-widest uppercase">{{ label }}</label>
    <div class="relative">
      <input
        type="number"
        :value="modelValue"
        @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
        min="1"
        max="20"
        class="w-16 h-16 text-center text-xl font-bold bg-stone-800 border border-stone-600
               text-parchment focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
               rounded-lg shadow-input transition-shadow"
      />
      <span
        v-if="bonus > 0"
        class="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full
               bg-gold/20 text-gold border border-gold/40"
        :title="`+${bonus} racial bonus`"
      >+{{ bonus }}</span>
    </div>
    <span class="text-sm font-semibold" :class="mod >= 0 ? 'text-vivid' : 'text-red-500'">
      {{ formatMod(mod) }}
      <span v-if="bonus > 0" class="text-stone-500 font-normal text-xs ml-0.5">({{ finalScore }})</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { modifier, formatMod } from '@/composables/useAbilityScores'

const props = withDefaults(defineProps<{
  modelValue: number
  label: string
  bonus?: number
}>(), { bonus: 0 })

defineEmits<{ 'update:modelValue': [number] }>()

const finalScore = computed(() => props.modelValue + props.bonus)
const mod = computed(() => modifier(finalScore.value))
</script>
