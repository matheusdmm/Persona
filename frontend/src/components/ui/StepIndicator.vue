<template>
  <div>
    <!-- Mobile: progress bar + label -->
    <div class="sm:hidden">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-stone-500 uppercase tracking-widest">
          Step {{ current + 1 }} of {{ steps.length }}
        </span>
        <span class="text-sm font-semibold text-parchment">{{ steps[current] }}</span>
      </div>
      <div class="h-1.5 bg-stone-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gold rounded-full transition-all duration-300"
          :style="{ width: `${((current + 1) / steps.length) * 100}%` }"
        />
      </div>
    </div>

    <!-- Desktop: bubble indicators -->
    <div class="hidden sm:flex items-center justify-center gap-0">
      <template v-for="(step, i) in steps" :key="i">
        <div class="flex flex-col items-center">
          <div
            class="w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full border-2 transition-all duration-200"
            :class="
              i < current
                ? 'bg-crimson border-crimson text-white'
                : i === current
                ? 'bg-gold border-gold text-ink shadow-btn'
                : 'bg-transparent border-stone-600 text-stone-500'
            "
          >
            {{ i < current ? '✓' : i + 1 }}
          </div>
          <span class="text-xs mt-1 text-stone-400">{{ step }}</span>
        </div>
        <div
          v-if="i < steps.length - 1"
          class="w-8 h-0.5 mb-5 rounded-full transition-colors duration-200"
          :class="i < current ? 'bg-gold/60' : 'bg-stone-700'"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: string[]
  current: number
}>()
</script>
