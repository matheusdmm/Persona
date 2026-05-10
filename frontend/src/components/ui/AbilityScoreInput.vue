<template>
  <div class="flex flex-col items-center gap-1">
    <label class="text-xs text-stone-400 tracking-widest uppercase">{{ label }}</label>
    <input
      type="number"
      :value="modelValue"
      @input="$emit('update:modelValue', Number($event.target.value))"
      min="1"
      max="20"
      class="w-16 h-16 text-center text-xl font-bold bg-stone-800 border border-stone-600
             text-parchment focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
             rounded-lg shadow-input transition-shadow"
    />
    <span
      class="text-sm font-semibold"
      :class="mod >= 0 ? 'text-vivid' : 'text-red-500'"
    >
      {{ formatMod(mod) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { modifier, formatMod } from '@/composables/useAbilityScores.js'

const props = defineProps({
  modelValue: { type: Number, required: true },
  label: { type: String, required: true },
})
defineEmits(['update:modelValue'])

const mod = computed(() => modifier(props.modelValue))
</script>
