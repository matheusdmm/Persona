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

// Required-field rules per step, in priority order. canProceed and proceedHint
// both read from this single table so they can't drift out of sync with each other.
const stepRules = computed(() => [
  [ // 0: Details
    { valid: () => !!store.draft.name, message: () => 'Enter a character name to continue' },
    { valid: () => !!store.draft.background, message: () => 'Select a background to continue' },
  ],
  [ // 1: Race
    { valid: () => !!store.draft.race, message: () => 'Select a race to continue' },
  ],
  [ // 2: Class
    { valid: () => !!store.draft.class, message: () => 'Select a class to continue' },
    {
      valid: () => {
        const cls = store.selectedClass
        if (!cls?.subclasses?.length || store.draft.level < cls.subclasses[0].level_gained) return true
        return !!store.draft.subclass
      },
      message: () => 'Choose a subclass to continue',
    },
  ],
  [], // 3: Abilities — always has a value, nothing to require
  [ // 4: Skills
    {
      valid: () => store.draft.skills.length === (store.selectedClass?.skill_choices ?? 0),
      message: () => {
        const need = (store.selectedClass?.skill_choices ?? 0) - store.draft.skills.length
        return `Choose ${need} more skill${need !== 1 ? 's' : ''} to continue`
      },
    },
  ],
  [], // 5: Extras — nothing required
])

const canProceed = computed(() =>
  (stepRules.value[store.currentStep] ?? []).every(r => r.valid())
)

const proceedHint = computed(() => {
  if (store.currentStep < STEPS.length - 1) {
    const failed = (stepRules.value[store.currentStep] ?? []).find(r => !r.valid())
    return failed ? failed.message() : ''
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
