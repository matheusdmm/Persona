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
        <label class="block text-sm text-stone-400 mb-1">Background</label>
        <select
          :value="modelValue.background"
          @change="update('background', $event.target.value)"
          class="w-full bg-stone-800 border border-stone-600 text-parchment px-3 py-2
                 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20
                 rounded-md shadow-input transition-shadow"
        >
          <option value="">Select background...</option>
          <option v-for="bg in BACKGROUNDS" :key="bg" :value="bg">{{ bg }}</option>
        </select>
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
import { BACKGROUNDS, ALIGNMENTS } from '@/types/index.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue'])

function update(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
