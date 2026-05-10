<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <StepIndicator :steps="STEPS" :current="store.currentStep" class="mb-10" />

    <div v-if="store.loading" class="text-center py-20 text-stone-400">Loading...</div>
    <div v-else-if="store.error" class="text-center py-10 text-red-500">{{ store.error }}</div>

    <div v-else class="bg-white rounded-2xl border border-stone-700 p-8 shadow-card">
      <DetailsStep   v-if="store.currentStep === 0" v-model="store.draft" />
      <RaceSelector  v-else-if="store.currentStep === 1" :races="store.races" v-model:selected="store.draft.race" />
      <ClassSelector v-else-if="store.currentStep === 2" :classes="store.classes" v-model:selected="store.draft.class" />
      <SkillsStep    v-else-if="store.currentStep === 3" v-model="store.draft" />
      <AbilitiesStep v-else-if="store.currentStep === 4" v-model="store.draft.abilities" />
      <ExtrasStep    v-else-if="store.currentStep === 5" v-model="store.draft" />
      <SpellsStep    v-else-if="store.currentStep === 6" v-model="store.draft" />
    </div>

    <div class="flex justify-between mt-6">
      <button v-if="store.currentStep > 0" class="btn-secondary" @click="store.prevStep()">
        ← Back
      </button>
      <div v-else />

      <button
        v-if="store.currentStep < STEPS.length - 1"
        class="btn-primary"
        :disabled="!canProceed"
        @click="store.nextStep()"
      >
        Next →
      </button>
      <button v-else class="btn-primary" :disabled="!store.isComplete" @click="finish()">
        Create Character
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character.js'
import StepIndicator from '@/components/ui/StepIndicator.vue'
import DetailsStep   from '@/components/character/DetailsStep.vue'
import RaceSelector  from '@/components/character/RaceSelector.vue'
import ClassSelector from '@/components/character/ClassSelector.vue'
import SkillsStep    from '@/components/character/SkillsStep.vue'
import AbilitiesStep from '@/components/character/AbilitiesStep.vue'
import ExtrasStep    from '@/components/character/ExtrasStep.vue'
import SpellsStep    from '@/components/character/SpellsStep.vue'

const STEPS = ['Details', 'Race', 'Class', 'Skills', 'Abilities', 'Extras', 'Spells']

const store = useCharacterStore()
const router = useRouter()

onMounted(() => {
  if (!store.races.length) store.loadData()
})

const canProceed = computed(() => {
  switch (store.currentStep) {
    case 0: return !!store.draft.name
    case 1: return !!store.draft.race
    case 2: return !!store.draft.class
    case 3: return store.draft.skills.length === (store.selectedClass?.skill_choices ?? 0)
    default: return true
  }
})

async function finish() {
  await store.calculate()
  router.push('/sheet')
}
</script>
