<template>
  <header class="border-b border-stone-600 bg-stone-950/80 backdrop-blur sticky top-0 z-50 shadow-sm no-print">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="font-body text-lg font-semibold text-parchment tracking-wide">
          HeroScribe
        </span>
      </RouterLink>
      <nav class="flex items-center gap-6">
        <RouterLink to="/" class="text-stone-400 hover:text-parchment transition-colors text-sm">
          Home
        </RouterLink>
        <RouterLink to="/saved" class="flex items-center gap-1.5 text-stone-400 hover:text-parchment transition-colors text-sm">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          Saved
          <span v-if="savedCount > 0" class="text-xs bg-gold/20 text-gold border border-gold/30 rounded-full px-1.5 py-0.5 leading-none">
            {{ savedCount }}
          </span>
        </RouterLink>
        <RouterLink to="/create" class="btn-primary text-sm">
          New Character
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character.js'

const store = useCharacterStore()
const savedCount = computed(() => store.savedCharacters.length)
</script>
