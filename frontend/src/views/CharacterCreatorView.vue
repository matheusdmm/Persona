<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
    <!-- Resumed an in-progress draft -->
    <div
      v-if="showResume"
      class="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/30 bg-gold/10 text-sm"
    >
      <span class="text-gold">✦</span>
      <span class="text-parchment flex-1">Picked up your character in progress.</span>
      <button class="text-stone-400 hover:text-parchment underline underline-offset-2" @click="startOver">
        Start over
      </button>
      <button class="text-stone-500 hover:text-parchment text-lg leading-none" aria-label="Dismiss" @click="showResume = false">
        ×
      </button>
    </div>

    <StepIndicator :steps="STEPS" :current="store.currentStep" class="mb-10" />

    <div v-if="store.loading" class="flex justify-center py-20 text-stone-400">
      <LoadingSpinner class="w-8 h-8" />
    </div>
    <div v-else-if="store.error" class="text-center py-10">
      <p class="text-red-500 mb-4">{{ store.error }}</p>
      <button class="btn-primary" @click="store.loadData()">Retry</button>
    </div>

    <div v-else class="bg-stone-900 rounded-2xl border border-stone-700 p-8 shadow-card">
      <DetailsStep   v-if="store.currentStep === 0" v-model="store.draft" />
      <RaceSelector  v-else-if="store.currentStep === 1" :races="store.races" v-model:selected="store.draft.race" />
      <ClassSelector v-else-if="store.currentStep === 2" :classes="store.classes" v-model:level="store.draft.level" v-model:selected="store.draft.class" v-model:selectedSubclass="store.draft.subclass" />
      <AbilitiesStep v-else-if="store.currentStep === 3" v-model="store.draft.abilities" />
      <SkillsStep    v-else-if="store.currentStep === 4" v-model="store.draft" />
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

    <p v-if="proceedHint" class="text-center text-xs text-stone-500 mt-3">
      {{ proceedHint }}
    </p>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character'
import StepIndicator from '@/components/ui/StepIndicator.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import DetailsStep   from '@/components/character/DetailsStep.vue'
import RaceSelector  from '@/components/character/RaceSelector.vue'
import ClassSelector from '@/components/character/ClassSelector.vue'
import SkillsStep    from '@/components/character/SkillsStep.vue'
import AbilitiesStep from '@/components/character/AbilitiesStep.vue'
import ExtrasStep    from '@/components/character/ExtrasStep.vue'
import SpellsStep    from '@/components/character/SpellsStep.vue'

const STEPS = ['Details', 'Race', 'Class', 'Abilities', 'Skills', 'Extras', 'Spells']

const store = useCharacterStore()
const router = useRouter()

const showResume = ref(store.resumedDraft)

function startOver() {
  store.reset()
  showResume.value = false
}

onMounted(() => {
  if (!store.races.length) store.loadData()
})

const canProceed = computed(() => {
  switch (store.currentStep) {
    case 0: return !!store.draft.name
    case 1: return !!store.draft.race
    case 2: {
      if (!store.draft.class) return false
      const cls = store.selectedClass
      if (cls?.subclasses?.length && store.draft.level >= cls.subclasses[0].level_gained) {
        return !!store.draft.subclass
      }
      return true
    }
    case 4: return store.draft.skills.length === (store.selectedClass?.skill_choices ?? 0)
    default: return true
  }
})

const proceedHint = computed(() => {
  if (store.currentStep < STEPS.length - 1) {
    if (canProceed.value) return ''
    switch (store.currentStep) {
      case 0: return 'Enter a character name to continue'
      case 1: return 'Select a race to continue'
      case 2: {
        if (!store.draft.class) return 'Select a class to continue'
        return 'Choose a subclass to continue'
      }
      case 4: {
        const need = (store.selectedClass?.skill_choices ?? 0) - store.draft.skills.length
        return `Choose ${need} more skill${need !== 1 ? 's' : ''} to continue`
      }
    }
  } else {
    if (store.isComplete) return ''
    const sp = store.spellProgress
    if (sp) {
      const needC = Math.max(0, sp.maxC - sp.cantripCnt)
      const needS = Math.max(0, sp.maxS - sp.spellCnt)
      const parts = []
      if (needC > 0) parts.push(`${needC} more cantrip${needC !== 1 ? 's' : ''}`)
      if (needS > 0) parts.push(`${needS} more spell${needS !== 1 ? 's' : ''}`)
      if (parts.length) return `Choose ${parts.join(' and ')} to continue`
    }
    return 'Complete the required selections to continue'
  }
  return ''
})

async function finish() {
  await store.calculate()
  router.push('/sheet')
}
</script>
