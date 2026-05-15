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
          @input="update('name', $event.target.value)"
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
          @input="update('playerName', $event.target.value)"
          placeholder="Your name..."
          class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 rounded-md shadow-input placeholder-stone-500 transition-shadow"
        />
      </div>

      <!-- Level -->
      <div>
        <label class="block text-sm text-stone-400 mb-1">Starting Level</label>
        <input
          type="number"
          :value="modelValue.level"
          @input="update('level', Number($event.target.value))"
          min="1"
          max="20"
          class="w-24 bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 rounded-md shadow-input transition-shadow"
        />
      </div>

      <!-- Background -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-sm text-stone-400">Background</label>
          <button
            type="button"
            @click="toggleExtended"
            :disabled="extLoading"
            class="flex items-center gap-1 text-xs transition-colors disabled:opacity-50"
            :class="extendedOn ? 'text-gold' : 'text-stone-500 hover:text-stone-300'"
          >
            <svg v-if="extLoading" class="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <svg v-else class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            {{ extLoading ? 'Loading…' : extendedOn ? 'Extended on' : 'Extended content' }}
          </button>
        </div>
        <select
          :value="modelValue.background"
          @change="update('background', $event.target.value)"
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

<script setup>
import { ref } from 'vue'
import { BACKGROUNDS, ALIGNMENTS } from '@/types/index.js'
import { useExtendedData } from '@/composables/useExtendedData.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue'])

function update(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const extendedOn    = ref(localStorage.getItem('hs_ext_backgrounds') === '1')
const extBackgrounds = ref([])
const extLoading    = ref(false)
const extError      = ref(null)

const { entries, loading, error, load } = useExtendedData()

async function toggleExtended() {
  extendedOn.value = !extendedOn.value
  localStorage.setItem('hs_ext_backgrounds', extendedOn.value ? '1' : '0')
  if (extendedOn.value && extBackgrounds.value.length === 0) {
    extLoading.value = true
    extError.value = null
    await load('backgrounds')
    extLoading.value = loading.value
    extError.value = error.value
    const coreSet = new Set(BACKGROUNDS)
    extBackgrounds.value = entries.value
      .map(e => e.name)
      .filter(n => !coreSet.has(n))
      .sort()
  }
}

// Auto-load if toggle was already on from a previous session
if (extendedOn.value) toggleExtended()
</script>
