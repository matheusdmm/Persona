<template>
  <div class="max-w-5xl mx-auto px-4 py-8">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-parchment mb-2">Content Library</h1>
      <p class="text-stone-400 text-sm max-w-xl leading-relaxed">
        Official Wizards of the Coast content for D&D 5e. Tap any entry to read more.
      </p>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-2 flex-wrap mb-6">
      <button
        v-for="cat in CATEGORIES"
        :key="cat.key"
        @click="select(cat.key)"
        :class="[
          'px-4 py-1.5 text-sm font-semibold rounded-full border transition-colors',
          active === cat.key
            ? 'bg-gold/20 text-gold border-gold/60'
            : 'text-stone-400 border-stone-700 hover:text-parchment hover:border-stone-500'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24 text-stone-500 gap-3">
      <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <span class="text-sm">Loading {{ activeLabel }}…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-24">
      <p class="text-crimson text-sm">{{ error }}</p>
      <button class="btn-secondary text-sm mt-4" @click="select(active)">Retry</button>
    </div>

    <!-- Idle -->
    <div v-else-if="!active" class="text-center py-24 text-stone-500 text-sm">
      Select a category above to browse content.
    </div>

    <!-- Grid -->
    <div v-else>
      <p class="text-xs text-stone-500 mb-4">{{ entries.length }} entries · Official WotC content only</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="item in entries"
          :key="item.name"
          class="card !p-5 flex flex-col gap-2 text-left hover:-translate-y-0.5 active:scale-[0.98] transition-transform cursor-pointer w-full"
          @click="open(item)"
        >
          <h2 class="text-parchment font-semibold leading-tight">{{ item.name }}</h2>
          <p class="text-xs text-gold/80 font-medium">{{ item.book }}</p>
          <p class="text-stone-400 text-sm leading-relaxed line-clamp-3">
            {{ item.description || 'No description available.' }}
          </p>
          <p class="text-xs text-stone-600 mt-auto pt-2">Tap to read more →</p>
        </button>
      </div>
    </div>

  </div>

  <!-- ── Modal ── -->
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="selected" class="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-6">

        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <div class="panel relative bg-stone-900 border border-stone-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[88vh] sm:max-h-[82vh] flex flex-col shadow-2xl">

          <!-- Drag handle (mobile only) -->
          <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div class="w-10 h-1 rounded-full bg-stone-600" />
          </div>

          <!-- Header -->
          <div class="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-stone-700 shrink-0">
            <div class="min-w-0">
              <h2 class="text-parchment font-semibold text-lg leading-snug">{{ selected.name }}</h2>
              <p class="text-gold/80 text-xs font-medium mt-0.5">{{ selected.book }}</p>
            </div>
            <button
              @click="close"
              class="shrink-0 p-1 -mr-1 text-stone-500 hover:text-parchment transition-colors rounded-md"
              aria-label="Close"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="overflow-y-auto px-5 py-5 flex flex-col gap-5">

            <!-- Description -->
            <p class="text-stone-300 text-sm leading-relaxed">
              {{ selected.description || 'No description available.' }}
            </p>

            <!-- Properties -->
            <div v-if="propEntries(selected).length" class="flex flex-col gap-3 pt-1 border-t border-stone-800">
              <p class="section-title mt-3">Details</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div v-for="[key, val] in propEntries(selected)" :key="key">
                  <p class="text-xs text-stone-500 uppercase tracking-wider mb-1.5">{{ formatKey(key) }}</p>
                  <ul v-if="Array.isArray(parseVal(val))" class="space-y-1">
                    <li v-for="(v, i) in parseVal(val)" :key="i" class="text-stone-300 text-sm leading-relaxed flex gap-1.5">
                      <span class="text-gold/50 shrink-0">·</span>{{ v }}
                    </li>
                  </ul>
                  <p v-else class="text-stone-300 text-sm leading-relaxed">{{ parseVal(val) }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useExtendedData } from '@/composables/useExtendedData.js'

const CATEGORIES = [
  { key: 'backgrounds', label: 'Backgrounds' },
  { key: 'species',     label: 'Species' },
  { key: 'classes',     label: 'Classes' },
  { key: 'spells',      label: 'Spells' },
  { key: 'items',       label: 'Items' },
]

const active      = ref(null)
const activeLabel = computed(() => CATEGORIES.find(c => c.key === active.value)?.label ?? '')
const selected    = ref(null)

const { entries, loading, error, load } = useExtendedData()

function select(key) {
  active.value = key
  load(key)
}

function open(item)  { selected.value = item }
function close()     { selected.value = null }

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

onMounted(()   => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watchEffect(() => {
  document.body.style.overflow = selected.value ? 'hidden' : ''
})

function formatKey(key) {
  return key.replace(/^data-/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function parseVal(val) {
  if (typeof val !== 'string') return val
  const t = val.trim()
  if (t.startsWith('[') || t.startsWith('{')) {
    try { return JSON.parse(t) } catch {}
  }
  return val
}

function propEntries(item) {
  if (!item?.properties) return []
  return Object.entries(item.properties).filter(([, v]) => v !== null && v !== '' && v !== undefined)
}
</script>

<style scoped>
/* Overlay: fade the whole backdrop+panel group */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.22s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Panel: slide up on mobile, scale-fade on desktop */
.panel {
  animation: panel-desktop 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes panel-desktop {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 639px) {
  .panel {
    animation: panel-mobile 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  }
  @keyframes panel-mobile {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
}
</style>
