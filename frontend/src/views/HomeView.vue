<template>
  <div class="overflow-x-hidden">

    <!-- ── HERO ── -->
    <section class="relative min-h-[calc(100vh-4rem)] max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pb-10">

      <!-- Ambient glow behind icon -->
      <div class="absolute inset-0 flex items-start justify-center pt-16 pointer-events-none" aria-hidden="true">
        <div class="w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <!-- Floating icon -->
      <div class="hero-icon relative z-10 inline-block mb-8">
        <div class="hero-icon-inner">
          <img src="/Untitled1.png" alt="" width="120" height="120" class="object-contain" />
        </div>
      </div>

      <!-- Headline -->
      <h1 class="anim anim-1 font-body text-5xl sm:text-6xl font-semibold text-parchment mb-5 tracking-wide leading-snug">
        Forge Your Legend
      </h1>

      <!-- Tagline -->
      <p class="anim anim-2 font-body text-stone-300 text-xl sm:text-2xl italic mb-4 max-w-lg mx-auto leading-relaxed">
        "Not all heroes are born.<br class="hidden sm:block" />
        Most are built — one choice at a time."
      </p>

      <!-- Description -->
      <p class="anim anim-3 text-stone-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
        Pick your race, class, and spells. Set your stats and background.
        Walk into your next session with a complete, print‑ready character sheet.
      </p>

      <!-- CTA -->
      <div class="anim anim-4">
        <RouterLink to="/create" class="cta-btn inline-flex items-center gap-2.5 px-9 py-4 text-base font-semibold rounded-lg">
          Begin Your Journey
          <span class="text-xl leading-none">→</span>
        </RouterLink>
      </div>

      <!-- Edition pills -->
      <div class="anim anim-5 flex justify-center gap-2 mt-6">
        <span class="text-xs px-2.5 py-0.5 bg-gold/10 text-gold border border-gold/30 rounded-full">5e</span>
        <span class="text-xs px-2.5 py-0.5 bg-gold/10 text-gold border border-gold/30 rounded-full">5.5e (2024)</span>
      </div>
    </section>

    <!-- ── DIVIDER ── -->
    <div class="flex items-center gap-4 max-w-xs mx-auto px-6 mb-14">
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
      <span class="text-stone-500 text-[10px] tracking-[0.4em] uppercase shrink-0">Features</span>
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
    </div>

    <!-- ── FEATURES ── -->
    <section class="max-w-4xl mx-auto px-6 pb-28">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div class="feat feat-1 card border-stone-700 !p-6 group">
          <div class="feat-icon mb-4 text-gold">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3 class="text-parchment font-semibold mb-2 text-base">Every Race & Class</h3>
          <p class="text-stone-400 text-sm leading-relaxed">
            Human to Dragonborn, Barbarian to Wizard — full SRD coverage
            with trait descriptions, ability bonuses, and starting gear.
          </p>
        </div>

        <div class="feat feat-2 card border-stone-700 !p-6 group">
          <div class="feat-icon mb-4 text-gold">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <h3 class="text-parchment font-semibold mb-2 text-base">Combat Stats, Instant</h3>
          <p class="text-stone-400 text-sm leading-relaxed">
            HP, AC, modifiers, saving throws, proficiency bonus —
            all computed the moment you finish. No spreadsheet required.
          </p>
        </div>

        <div class="feat feat-3 card border-stone-700 !p-6 group">
          <div class="feat-icon mb-4 text-gold">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h3 class="text-parchment font-semibold mb-2 text-base">Full Spell Lists</h3>
          <p class="text-stone-400 text-sm leading-relaxed">
            Browse and prepare spells filtered to your class and level —
            with school, casting time, and range, pulled live from Open5e.
          </p>
        </div>

        <div class="feat feat-4 card border-stone-700 !p-6 group">
          <div class="feat-icon mb-4 text-gold">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
          </div>
          <h3 class="text-parchment font-semibold mb-2 text-base">Print & Take It</h3>
          <p class="text-stone-400 text-sm leading-relaxed">
            Save characters locally, print a clean A4 sheet, or export
            JSON for Foundry VTT, Roll20, and any other virtual tabletop.
          </p>
        </div>

      </div>

      <!-- Also by the author -->
      <div class="also mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border border-stone-700 rounded-xl bg-stone-800/40">
        <div>
          <p class="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Other tools</p>
          <p class="text-parchment font-semibold text-sm">Tome of Changes</p>
          <p class="text-stone-400 text-xs mt-0.5">Side-by-side comparison of every rule change between D&D 5e and 5.5e (2024).</p>
        </div>
        <a
          href="https://www.tomeofchanges.com/"
          target="_blank"
          rel="noopener"
          class="shrink-0 btn-secondary text-sm !px-5 !py-2"
        >
          Visit
        </a>
      </div>

    </section>

  </div>
</template>

<script setup>
</script>

<style scoped>
/* ── Floating icon ── */
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
}

@keyframes flip {
  0%, 100% { transform: perspective(300px) rotateY(-10deg); }
  50%       { transform: perspective(300px) rotateY(10deg); }
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(184, 144, 10, 0.4)); }
  50%       { filter: drop-shadow(0 0 28px rgba(184, 144, 10, 0.75)); }
}

.hero-icon {
  animation: bob 3.6s ease-in-out infinite;
}

.hero-icon-inner {
  animation: flip 5.5s ease-in-out infinite, glow-pulse 3.6s ease-in-out infinite;
}

/* ── Fade-up stagger ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim {
  opacity: 0;
  animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.anim-1 { animation-delay: 0.05s; }
.anim-2 { animation-delay: 0.18s; }
.anim-3 { animation-delay: 0.30s; }
.anim-4 { animation-delay: 0.42s; }
.anim-5 { animation-delay: 0.52s; }

/* ── CTA button ── */
@keyframes shimmer {
  from { background-position: 200% center; }
  to   { background-position: -200% center; }
}

.cta-btn {
  background: linear-gradient(110deg, #b8900a 0%, #e0b84a 45%, #b8900a 100%);
  background-size: 250% auto;
  color: #160808;
  box-shadow: 0 0 24px rgba(184, 144, 10, 0.25);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.cta-btn:hover {
  animation: shimmer 1.8s linear infinite;
  box-shadow: 0 0 40px rgba(184, 144, 10, 0.55);
  transform: translateY(-2px);
}

/* ── Feature cards ── */
.feat {
  opacity: 0;
  animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.feat-1 { animation-delay: 0.55s; }
.feat-2 { animation-delay: 0.65s; }
.feat-3 { animation-delay: 0.75s; }
.feat-4 { animation-delay: 0.85s; }

.also {
  opacity: 0;
  animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.95s;
}

.feat:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px -4px rgba(30, 0, 14, 0.16), 0 2px 6px rgba(30, 0, 14, 0.08);
}

.feat-icon {
  transition: transform 0.3s ease;
}
.feat:hover .feat-icon {
  transform: translateX(5px);
}
</style>
