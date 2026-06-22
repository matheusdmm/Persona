<template>
  <div class="min-h-screen bg-stone-950 flex flex-col" @mousemove="onMouseMove">

    <!-- Mouse glow -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="mouse-glow" :style="{ transform: `translate(${x}px, ${y}px)` }" />
    </div>

    <AppHeader />
    <main class="flex-1 relative z-10">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const x = ref(-1000)
const y = ref(-1000)

function onMouseMove(e) {
  x.value = e.clientX
  y.value = e.clientY
}
</script>

<style scoped>
.mouse-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  margin-left: -350px;
  margin-top: -350px;
  background: radial-gradient(circle, var(--glow-color) 0%, transparent 65%);
  pointer-events: none;
}
</style>
