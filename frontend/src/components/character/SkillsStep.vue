<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Skill Proficiencies</h2>
    <p class="text-stone-400 text-sm mb-4">
      Choose <strong class="text-parchment">{{ limit }}</strong> skill{{ limit !== 1 ? 's' : '' }}
      from your {{ store.selectedClass?.name }} list.
    </p>

    <!-- Progress -->
    <div class="flex items-center gap-3 mb-6">
      <div class="flex gap-1.5">
        <span
          v-for="i in limit"
          :key="i"
          class="w-3 h-3 rounded-full border-2 transition-colors duration-150"
          :class="i <= modelValue.skills.length ? 'bg-crimson border-crimson' : 'border-stone-500'"
        />
      </div>
      <span class="text-sm" :class="modelValue.skills.length === limit ? 'text-vivid' : 'text-stone-400'">
        {{ modelValue.skills.length }} / {{ limit }} chosen
      </span>
    </div>

    <!-- Skill grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <button
        v-for="skill in availableSkills"
        :key="skill.key"
        @click="toggle(skill.key)"
        :disabled="!isSelected(skill.key) && modelValue.skills.length >= limit"
        class="flex items-center gap-3 px-4 py-3 border rounded-xl text-left transition-all duration-150"
        :class="isSelected(skill.key)
          ? 'border-gold bg-gold/10 shadow-sm'
          : modelValue.skills.length >= limit
          ? 'border-stone-700 opacity-40 cursor-not-allowed'
          : 'border-stone-600 hover:border-stone-400 hover:shadow-sm cursor-pointer'"
      >
        <!-- Proficiency dot -->
        <span
          class="w-3 h-3 rounded-full border-2 shrink-0 transition-colors"
          :class="isSelected(skill.key) ? 'bg-crimson border-crimson' : 'border-stone-500'"
        />

        <!-- Skill info -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-parchment">{{ skill.name }}</div>
          <div class="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
            <span class="uppercase tracking-wide">{{ ABILITY_LABELS[skill.ability] }}</span>
            <span class="text-stone-600">·</span>
            <span :class="abilityMod(skill.ability) >= 0 ? 'text-vivid' : 'text-red-500'">
              {{ formatMod(abilityMod(skill.ability)) }}
            </span>
            <template v-if="isSelected(skill.key)">
              <span class="text-stone-600">→</span>
              <span class="text-gold font-semibold">
                {{ formatMod(abilityMod(skill.ability) + profBonus) }}
              </span>
            </template>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { SKILL_MAP, ABILITY_LABELS } from '@/types'
import { modifier, formatMod } from '@/composables/useAbilityScores'
import type { CharacterDraft, AbilityName } from '@/types/models'

const props = defineProps<{ modelValue: CharacterDraft }>()
const emit = defineEmits<{ 'update:modelValue': [CharacterDraft] }>()

const store = useCharacterStore()

const limit = computed(() => store.selectedClass?.skill_choices ?? 2)

const availableSkills = computed(() => {
  const cls = store.selectedClass
  if (!cls) return []
  if (cls.available_skills.includes('any')) return SKILL_MAP
  return SKILL_MAP.filter(s => cls.available_skills.includes(s.key))
})

const profBonus = computed(() => {
  const level = props.modelValue.level ?? 1
  return Math.floor((level - 1) / 4) + 2
})

function abilityMod(ability: AbilityName): number {
  return modifier(props.modelValue.abilities?.[ability] ?? 10)
}

function isSelected(key: string): boolean {
  return props.modelValue.skills.includes(key)
}

function toggle(key: string): void {
  const current = props.modelValue.skills
  const next = isSelected(key)
    ? current.filter(k => k !== key)
    : current.length < limit.value ? [...current, key] : current
  emit('update:modelValue', { ...props.modelValue, skills: next })
}

// Clear any skills that are no longer valid if the class changed
onMounted(() => {
  const valid = new Set(availableSkills.value.map(s => s.key))
  const filtered = props.modelValue.skills.filter(k => valid.has(k))
  if (filtered.length !== props.modelValue.skills.length) {
    emit('update:modelValue', { ...props.modelValue, skills: filtered })
  }
})
</script>
