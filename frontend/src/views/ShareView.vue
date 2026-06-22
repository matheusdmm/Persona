<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div v-if="error" class="text-center space-y-4">
      <p class="text-stone-400 text-lg">This share link is invalid or corrupted.</p>
      <RouterLink to="/" class="btn-primary">Go Home</RouterLink>
    </div>
    <div v-else class="flex items-center gap-3 text-stone-400">
      <LoadingSpinner class="w-5 h-5" />
      <span>Loading character…</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCharacterStore } from '@/stores/character'
import { decodeCharacter } from '@/composables/useShare'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const router = useRouter()
const route  = useRoute()
const store  = useCharacterStore()
const error  = ref(false)

onMounted(async () => {
  const encoded = route.query.c as string | undefined
  if (!encoded) { error.value = true; return }

  const draft = decodeCharacter(encoded)
  if (!draft) { error.value = true; return }

  if (!store.races.length) await store.loadData()
  store.draft = { ...draft }
  await store.calculate()
  router.replace('/sheet')
})
</script>
