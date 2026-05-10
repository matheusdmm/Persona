<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Choose your Class</h2>
    <p class="text-stone-400 text-sm mb-6">
      Your class defines your role in combat and adventure.
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
        v-for="cls in filteredClasses"
        :key="cls.id"
        clickable
        :selected="selected === cls.id"
        @click="$emit('update:selected', cls.id)"
      >
        <div class="font-semibold text-parchment">{{ cls.name }}</div>
        <div class="text-xs text-stone-400 mt-1">
          d{{ cls.hit_die }} · {{ cls.primary_ability }}
        </div>
        <div class="flex gap-1 mt-2 flex-wrap">
          <span
            v-for="save in cls.saving_throws"
            :key="save"
            class="text-xs px-1.5 py-0.5 bg-stone-700 text-stone-300 rounded"
          >
            {{ save.slice(0, 3).toUpperCase() }}
          </span>
        </div>
      </BaseCard>
    </div>

    <Transition name="fade">
      <div v-if="selectedClass" class="mt-4 p-5 bg-stone-800 border border-stone-700 rounded-xl shadow-card">
        <h3 class="font-semibold text-gold mb-3">{{ selectedClass.name }} Details</h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-stone-400">Hit Die:</span>
            <span class="text-parchment ml-2 font-medium">d{{ selectedClass.hit_die }}</span>
          </div>
          <div>
            <span class="text-stone-400">Primary Ability:</span>
            <span class="text-parchment ml-2 capitalize font-medium">{{ selectedClass.primary_ability }}</span>
          </div>
          <div>
            <span class="text-stone-400">Saving Throws:</span>
            <span class="text-parchment ml-2 capitalize font-medium">{{ selectedClass.saving_throws.join(', ') }}</span>
          </div>
          <div>
            <span class="text-stone-400">Skill Choices:</span>
            <span class="text-parchment ml-2 font-medium">{{ selectedClass.skill_choices }}</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-stone-700">
          <span class="text-stone-400 text-sm">Armor:</span>
          <span class="text-parchment text-sm ml-2 capitalize font-medium">
            {{ selectedClass.armor_proficiencies.join(', ') || 'None' }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const props = defineProps({
  classes: { type: Array, required: true },
  selected: { type: String, default: '' },
})
defineEmits(['update:selected'])

const filter = ref('all')
const editions = [
  { value: 'all', label: 'All' },
  { value: '5e', label: '5e' },
  { value: '5.5e', label: '5.5e' },
]

const filteredClasses = computed(() => {
  if (filter.value === 'all') return props.classes
  return props.classes.filter(c => c.edition === filter.value || c.edition === 'both')
})

const selectedClass = computed(() => props.classes.find(c => c.id === props.selected))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
