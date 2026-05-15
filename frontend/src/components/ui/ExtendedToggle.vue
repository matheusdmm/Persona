<template>
  <button
    type="button"
    @click="!loading && $emit('update:modelValue', !modelValue)"
    :disabled="loading"
    class="flex items-center gap-1 text-xs transition-colors disabled:opacity-50
           focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
    :class="modelValue ? 'text-gold' : 'text-stone-500 hover:text-stone-300'"
  >
    <LoadingSpinner v-if="loading" class="w-3 h-3 shrink-0" />
    <svg
      v-else
      class="w-3 h-3 shrink-0"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
    <span>{{ loading ? 'Loading…' : modelValue ? `${label} on` : label }}</span>
  </button>
</template>

<script setup>
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

defineProps({
  modelValue: { type: Boolean, required: true },
  loading:    { type: Boolean, default: false },
  label:      { type: String, required: true },
})
defineEmits(['update:modelValue'])
</script>
