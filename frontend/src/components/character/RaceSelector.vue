<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Choose your Race</h2>
    <p class="text-stone-400 text-sm mb-6">
      Your race determines your base traits and ability score bonuses.
    </p>

    <!-- Edition filter -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="ed in editions"
        :key="ed.value"
        class="px-4 py-1.5 text-sm border rounded-md transition-all duration-150"
        :class="filter === ed.value
          ? 'border-gold text-gold bg-gold/10 shadow-sm'
          : 'border-stone-600 text-stone-400 hover:border-stone-500'"
        @click="filter = ed.value"
      >
        {{ ed.label }}
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <BaseCard
        v-for="race in filteredRaces"
        :key="race.id"
        clickable
        :selected="selected === race.id"
        @click="$emit('update:selected', race.id)"
      >
        <div class="font-semibold text-parchment">{{ race.name }}</div>
        <div class="text-xs text-stone-400 mt-1">Speed {{ race.speed }} ft · {{ race.size }}</div>
        <div class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="bonus in race.ability_bonuses"
            :key="bonus.ability"
            class="text-xs px-1.5 py-0.5 bg-gold/10 text-gold border border-gold/30 rounded"
          >
            +{{ bonus.bonus }} {{ bonus.ability.slice(0, 3).toUpperCase() }}
          </span>
        </div>
      </BaseCard>
    </div>

    <!-- Selected race details -->
    <Transition name="fade">
      <div v-if="selectedRace" class="mt-4 p-5 bg-stone-800 border border-stone-700 rounded-xl shadow-card">
        <h3 class="font-semibold text-gold mb-3">{{ selectedRace.name }} Traits</h3>
        <ul class="space-y-2">
          <li v-for="trait in selectedRace.traits" :key="trait.name">
            <span class="font-semibold text-parchment text-sm">{{ trait.name }}:</span>
            <span class="text-stone-300 text-sm ml-1">{{ trait.description }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { Race } from '@/types/models'

const props = withDefaults(defineProps<{
  races: Race[]
  selected?: string
}>(), { selected: '' })

defineEmits<{ 'update:selected': [string] }>()

const filter = ref('all')
const editions = [
  { value: 'all', label: 'All' },
  { value: '5e', label: '5e' },
  { value: '5.5e', label: '5.5e' },
]

const filteredRaces = computed(() => {
  if (filter.value === 'all') return props.races
  return props.races.filter(r => r.edition === filter.value || r.edition === 'both')
})

const selectedRace = computed(() => props.races.find(r => r.id === props.selected))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
