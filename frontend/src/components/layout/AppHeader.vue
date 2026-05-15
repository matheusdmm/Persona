<template>
  <header class="border-b border-stone-600 bg-stone-950/80 backdrop-blur sticky top-0 z-50 shadow-sm no-print">

    <!-- Main bar -->
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <RouterLink to="/" class="font-body text-3xl font-semibold text-parchment tracking-wide" @click="close">
        HeroScribe
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden sm:flex items-center gap-6">
        <RouterLink to="/" class="text-stone-400 hover:text-parchment transition-colors text-sm">
          Home
        </RouterLink>
        <RouterLink to="/library" class="flex items-center gap-1.5 text-stone-400 hover:text-parchment transition-colors text-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Library
        </RouterLink>
        <RouterLink to="/saved" class="flex items-center gap-1.5 text-stone-400 hover:text-parchment transition-colors text-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Saved
          <span v-if="savedCount > 0"
            class="text-xs bg-gold/20 text-gold border border-gold/30 rounded-full px-1.5 py-0.5 leading-none">
            {{ savedCount }}
          </span>
        </RouterLink>

        <!-- Theme toggle -->
        <button
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          class="p-1.5 rounded-md text-stone-400 hover:text-parchment hover:bg-stone-800 transition-colors"
        >
          <!-- Sun (shown in dark mode) -->
          <svg v-if="theme === 'dark'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon (shown in light mode) -->
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <RouterLink to="/create" class="btn-primary text-sm">New Character</RouterLink>
      </nav>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="sm:hidden flex items-center gap-1">
        <button
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          class="p-2 text-stone-400 hover:text-parchment transition-colors"
        >
          <svg v-if="theme === 'dark'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button
          class="-mr-2 p-2 text-stone-400 hover:text-parchment transition-colors"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
        <svg v-if="!menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        </button>
      </div><!-- /mobile buttons -->
    </div><!-- /main bar -->

    <!-- Mobile dropdown -->
    <Transition name="slide">
      <div v-if="menuOpen" class="sm:hidden border-t border-stone-700 bg-stone-950 px-6 py-3 flex flex-col">
        <RouterLink to="/" @click="close"
          class="py-3.5 text-stone-300 hover:text-parchment transition-colors border-b border-stone-800 text-sm">
          Home
        </RouterLink>
        <RouterLink to="/library" @click="close"
          class="py-3.5 flex items-center gap-2 text-stone-300 hover:text-parchment transition-colors border-b border-stone-800 text-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Library
        </RouterLink>
        <RouterLink to="/saved" @click="close"
          class="py-3.5 flex items-center gap-2 text-stone-300 hover:text-parchment transition-colors border-b border-stone-800 text-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Saved Characters
          <span v-if="savedCount > 0"
            class="text-xs bg-gold/20 text-gold border border-gold/30 rounded-full px-1.5 py-0.5 leading-none">
            {{ savedCount }}
          </span>
        </RouterLink>
        <RouterLink to="/create" class="btn-primary text-sm text-center mt-4 mb-1" @click="close">
          New Character
        </RouterLink>
      </div>
    </Transition>

  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCharacterStore } from '@/stores/character.js'
import { useTheme } from '@/composables/useTheme.js'

const store = useCharacterStore()
const savedCount = computed(() => store.savedCharacters.length)

const menuOpen = ref(false)
const route = useRoute()

function close() { menuOpen.value = false }
watch(() => route.path, close)

const { theme, toggle: toggleTheme } = useTheme()
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
