<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-semibold text-parchment">Saved Characters</h1>
      <RouterLink to="/create" class="btn-primary text-sm">New Character</RouterLink>
    </div>

    <div v-if="store.savedCharacters.length === 0" class="text-center py-24 text-stone-400">
      <svg class="w-12 h-12 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <p class="text-lg">No saved characters yet.</p>
      <p class="text-sm mt-1">Create a character and hit <strong class="text-stone-300">Save</strong> on the sheet.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in store.savedCharacters"
        :key="c.id"
        class="card !p-5 flex flex-col gap-3"
      >
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-parchment leading-tight truncate">{{ c.draft.name || 'Unnamed' }}</h2>
          <p class="text-sm text-crimson font-semibold capitalize mt-0.5">
            {{ c.draft.class }} {{ c.draft.level }}
          </p>
          <p class="text-sm text-stone-400 capitalize">{{ c.draft.race }} · {{ c.draft.background }}</p>
          <p class="text-xs text-stone-500 mt-2">Saved {{ formatDate(c.savedAt) }}</p>
        </div>

        <div class="flex gap-2 pt-3 border-t border-stone-700">
          <button class="btn-primary text-sm flex-1" @click="open(c)">Open Sheet</button>
          <button
            class="btn-secondary text-sm px-3"
            title="Delete"
            @click="remove(c.id)"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character.js'

const store = useCharacterStore()
const router = useRouter()

function open(saved) {
  store.loadSavedCharacter(saved)
  router.push('/sheet')
}

function remove(id) {
  store.unsaveCharacter(id)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
