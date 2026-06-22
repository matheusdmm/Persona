<template>
  <div>
    <h2 class="text-xl font-semibold text-parchment mb-1">Character Details</h2>
    <p class="text-stone-400 text-sm mb-6">Give your character a name and background.</p>

    <div class="space-y-5 max-w-md">
      <!-- Character Name -->
      <div>
        <label class="block text-sm text-stone-400 mb-1">Character Name</label>
        <input
          type="text"
          :value="modelValue.name"
          @input="update('name', ($event.target as HTMLInputElement).value)"
          placeholder="Enter a name..."
          class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 rounded-md shadow-input placeholder-stone-500 transition-shadow"
        />
      </div>

      <!-- Player Name -->
      <div>
        <label class="block text-sm text-stone-400 mb-1">Player Name</label>
        <input
          type="text"
          :value="modelValue.playerName"
          @input="update('playerName', ($event.target as HTMLInputElement).value)"
          placeholder="Your name..."
          class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 rounded-md shadow-input placeholder-stone-500 transition-shadow"
        />
      </div>

      <!-- Background -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-sm text-stone-400">Background</label>
          <ExtendedToggle
            :model-value="extendedOn"
            :loading="extLoading"
            label="Extended content"
            @update:model-value="toggleExtended"
          />
        </div>
        <select
          :value="modelValue.background"
          @change="update('background', ($event.target as HTMLInputElement).value)"
          class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 rounded-md shadow-input transition-shadow"
        >
          <option value="">Select background...</option>
          <optgroup v-if="extendedOn" label="Core (SRD)">
            <option v-for="bg in BACKGROUNDS" :key="bg" :value="bg">{{ bg }}</option>
          </optgroup>
          <template v-else>
            <option v-for="bg in BACKGROUNDS" :key="bg" :value="bg">{{ bg }}</option>
          </template>
          <optgroup v-if="extendedOn && extBackgrounds.length" label="Extended (WotC official)">
            <option v-for="bg in extBackgrounds" :key="bg" :value="bg">{{ bg }}</option>
          </optgroup>
        </select>
        <p v-if="extError" class="text-xs text-crimson mt-1">{{ extError }}</p>
      </div>

      <!-- Alignment -->
      <div>
        <label class="block text-sm text-stone-400 mb-1">Alignment</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="al in ALIGNMENTS"
            :key="al"
            class="text-xs py-2 px-1 border rounded-md transition-all duration-150"
            :class="modelValue.alignment === al
              ? 'border-gold text-gold bg-gold/10 shadow-sm'
              : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'"
            @click="update('alignment', al)"
          >
            {{ al }}
          </button>
        </div>
      </div>

      <!-- Edition -->
      <div>
        <label class="block text-sm text-stone-400 mb-1">Edition</label>
        <div class="flex gap-2">
          <button
            v-for="ed in ['5e', '5.5e']"
            :key="ed"
            class="px-4 py-2 text-sm border rounded-md transition-all duration-150"
            :class="modelValue.edition === ed
              ? 'border-gold text-gold bg-gold/10 shadow-sm'
              : 'border-stone-600 text-stone-400 hover:border-stone-500'"
            @click="update('edition', ed)"
          >
            {{ ed }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BACKGROUNDS, ALIGNMENTS } from '@/types'
import { useExtendedData } from '@/composables/useExtendedData'
import ExtendedToggle from '@/components/ui/ExtendedToggle.vue'
import type { CharacterDraft } from '@/types/models'

const props = defineProps<{ modelValue: CharacterDraft }>()
const emit = defineEmits<{ 'update:modelValue': [CharacterDraft] }>()

function update(field: keyof CharacterDraft, value: unknown): void {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const extendedOn     = ref(localStorage.getItem('hs_ext_backgrounds') === '1')
const extBackgrounds = ref<string[]>([])
const extLoading     = ref(false)
const extError       = ref<string | null>(null)

const { entries, loading, error, load } = useExtendedData()

async function fetchExtended() {
  if (extBackgrounds.value.length > 0) return
  extLoading.value = true
  extError.value = null
  await load('backgrounds')
  extLoading.value = false
  extError.value = error.value
  const coreSet = new Set(BACKGROUNDS)
  extBackgrounds.value = entries.value
    .map(e => e.name)
    .filter(n => !coreSet.has(n))
    .sort()
}

async function toggleExtended() {
  extendedOn.value = !extendedOn.value
  localStorage.setItem('hs_ext_backgrounds', extendedOn.value ? '1' : '0')
  if (extendedOn.value) await fetchExtended()
}

if (extendedOn.value) fetchExtended()
</script>
