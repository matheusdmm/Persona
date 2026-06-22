<template>
  <div
    class="bg-stone-900 border p-4 rounded-xl transition-all duration-200"
    :class="[
      selected
        ? 'border-gold ring-1 ring-gold/40 shadow-card-hover'
        : 'border-stone-600 shadow-card hover:shadow-card-hover hover:border-stone-500',
      clickable ? 'cursor-pointer' : ''
    ]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  selected?: boolean
  clickable?: boolean
}>(), {
  selected: false,
  clickable: false,
})
</script>
