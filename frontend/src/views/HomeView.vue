<template>
    <div class="overflow-x-hidden">

        <!-- ── HERO ── -->
        <section class="relative max-w-6xl mx-auto px-6 pt-12 sm:pt-20 pb-20">

            <!-- Ambient glow -->
            <div class="absolute inset-x-0 top-0 flex justify-center pointer-events-none" aria-hidden="true">
                <div class="w-[34rem] h-[34rem] rounded-full bg-gold/10 blur-3xl -translate-y-1/3" />
            </div>

            <div class="relative grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">

                <!-- Left: copy + CTA -->
                <div class="min-w-0 text-center lg:text-left">
                    <p
                        class="anim anim-1 font-mono text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold/80 mb-5">
                        5e &amp; 5.5e&nbsp;·&nbsp;Character Forge
                    </p>

                    <h1
                        class="anim anim-2 font-display text-5xl sm:text-6xl xl:text-7xl font-bold text-parchment leading-[0.95] tracking-tight mb-6">
                        Forge Your<br />Legend
                    </h1>

                    <p
                        class="anim anim-3 font-body text-stone-300 text-lg sm:text-xl italic mb-4 max-w-md mx-auto lg:mx-0 leading-relaxed">
                        "Not all heroes are born.
                        Most are built — one choice at a time."
                    </p>

                    <p class="anim anim-4 text-stone-400 text-base mb-9 max-w-md mx-auto lg:mx-0 leading-relaxed">
                        Pick your race, class, and spells. Set your stats and background.
                        Walk away with a complete, print-ready character sheet.
                    </p>

                    <div
                        class="anim anim-5 flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
                        <RouterLink to="/create"
                            class="cta-btn inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold rounded-lg w-full sm:w-auto justify-center">
                            Begin Your Journey
                            <span class="text-xl leading-none">→</span>
                        </RouterLink>
                        <RouterLink to="/saved" class="btn-secondary text-sm !py-3 w-full sm:w-auto text-center">
                            View Saved
                        </RouterLink>
                    </div>
                </div>

                <!-- Right: live character dossier (the signature — a preview of what you'll build) -->
                <div class="anim anim-4 dossier-wrap min-w-0 mx-auto w-full max-w-md lg:max-w-none">
                    <article class="dossier card !p-5 sm:!p-6" aria-label="Sample character sheet preview">
                        <!-- Identity -->
                        <header class="flex items-start justify-between gap-3 pb-4 border-b border-stone-700">
                            <div class="min-w-0">
                                <h2
                                    class="font-display text-xl sm:text-2xl font-bold text-parchment leading-tight truncate">
                                    Lyra Dawnbringer
                                </h2>
                                <p class="text-sm text-stone-400 mt-1">
                                    <span class="text-crimson font-semibold">Half-Elf Paladin</span>
                                    <span class="text-stone-600"> · </span>Oath of Devotion
                                </p>
                            </div>
                            <span
                                class="shrink-0 flex flex-col items-center px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/30">
                                <span
                                    class="text-[9px] uppercase tracking-widest text-gold/70 leading-none">Level</span>
                                <span class="stat-num text-xl font-bold text-gold leading-none mt-0.5">5</span>
                            </span>
                        </header>

                        <!-- Ability stat block -->
                        <div class="grid grid-cols-6 gap-1.5 sm:gap-2 py-4">
                            <div v-for="a in abilities" :key="a.label"
                                class="flex flex-col items-center py-2 rounded-lg bg-stone-800 border border-stone-700">
                                <span class="text-[9px] text-stone-400 uppercase tracking-wider">{{ a.label }}</span>
                                <span class="stat-num text-base sm:text-lg font-bold leading-none mt-1"
                                    :class="a.mod >= 0 ? 'text-vivid' : 'text-red-500'">{{ a.mod >= 0 ? '+' + a.mod :
                                        a.mod }}</span>
                                <span class="stat-num text-[11px] font-semibold text-parchment mt-0.5 leading-none">{{
                                    a.score }}</span>
                            </div>
                        </div>

                        <!-- Combat strip -->
                        <div class="grid grid-cols-4 gap-2 py-3 border-y border-stone-700">
                            <div v-for="c in combat" :key="c.label" class="text-center">
                                <p class="stat-num text-xl sm:text-2xl font-bold text-parchment leading-none">{{ c.value
                                }}</p>
                                <p class="text-[9px] text-stone-500 uppercase tracking-widest mt-1.5">{{ c.label }}</p>
                            </div>
                        </div>

                        <!-- Prepared features -->
                        <div class="flex flex-wrap gap-1.5 pt-4">
                            <span v-for="f in features" :key="f"
                                class="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/30">{{ f
                                }}</span>
                        </div>
                    </article>
                </div>

            </div>
        </section>

        <!-- ── DIVIDER ── -->
        <div class="flex items-center gap-4 max-w-xs mx-auto px-6 mb-12">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
            <span class="font-mono text-stone-500 text-[10px] tracking-[0.35em] uppercase shrink-0">What you get</span>
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
        </div>

        <!-- ── FEATURES ── -->
        <section class="max-w-5xl mx-auto px-6 pb-28">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div v-for="(feat, i) in featureCards" :key="feat.title" class="feat card border-stone-700 !p-6 group"
                    :style="{ animationDelay: 0.5 + i * 0.1 + 's' }">
                    <div class="flex items-center justify-between mb-4">
                        <div class="feat-icon text-gold" v-html="feat.icon" />
                        <span class="font-mono text-[10px] tracking-[0.25em] uppercase text-stone-500">{{ feat.tag
                        }}</span>
                    </div>
                    <h3 class="text-parchment font-semibold mb-2 text-base">{{ feat.title }}</h3>
                    <p class="text-stone-400 text-sm leading-relaxed">{{ feat.body }}</p>
                </div>

            </div>

            <!-- Also by the author -->
            <template>
                <div class="also mt-8">
                    <p class="font-mono text-[10px] text-stone-500 uppercase tracking-[0.25em] mb-3">Other tools</p>
                    <div class="flex flex-col gap-3">
                        <div v-for="tool in tools" :key="tool.url"
                            class="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border border-stone-700 rounded-xl bg-stone-800/40">
                            <div>
                                <p class="text-parchment font-semibold text-sm">{{ tool.name }}</p>
                                <p class="text-stone-400 text-xs mt-0.5">{{ tool.description }}</p>
                            </div>
                            <a :href="tool.url" target="_blank" rel="noopener"
                                class="shrink-0 btn-secondary text-sm !px-5 !py-2">Visit</a>
                        </div>
                    </div>
                </div>
            </template>


        </section>

    </div>
</template>

<script setup lang="ts">

interface Tool {
    name: string
    description: string
    url: string
}

const tools: Tool[] = [
    {
        name: 'Tome of Changes',
        description: 'Side-by-side comparison of every rule change between D&D 5e and 5.5e (2024).',
        url: 'https://www.tomeofchanges.com/',
    },
    {
        name: 'Cantrip',
        description: 'Spell tracker and spell organizer for your D&D sessions.',
        url: 'https://cantrip.vazio.club',
    },
]

const abilities = [
    { label: 'Str', score: 16, mod: 3 },
    { label: 'Dex', score: 12, mod: 1 },
    { label: 'Con', score: 14, mod: 2 },
    { label: 'Int', score: 10, mod: 0 },
    { label: 'Wis', score: 13, mod: 1 },
    { label: 'Cha', score: 17, mod: 3 },
]

const combat = [
    { label: 'Armor', value: 18 },
    { label: 'Max HP', value: 44 },
    { label: 'Init', value: '+1' },
    { label: 'Speed', value: 30 },
]

const features = ['Divine Smite', 'Lay on Hands', 'Aura of Protection']

const featureCards = [
    {
        title: 'Every Race & Class',
        tag: 'Origins',
        body: 'Human to Dragonborn, Barbarian to Wizard — full SRD coverage with trait descriptions, ability bonuses, and starting gear.',
        icon: '<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    },
    {
        title: 'Combat Stats, Instant',
        tag: 'Auto-calc',
        body: 'HP, AC, modifiers, saving throws, proficiency bonus — all computed the moment you finish. No spreadsheet required.',
        icon: '<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    },
    {
        title: 'Full Spell Lists',
        tag: 'Grimoire',
        body: 'Browse and prepare spells filtered to your class and level — with school, casting time, and range, pulled live from Open5e.',
        icon: '<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    },
    {
        title: 'Print & Take It',
        tag: 'Export',
        body: 'Save characters locally, print a clean A4 sheet, or export JSON for Foundry VTT, Roll20, and any other virtual tabletop.',
        icon: '<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    },
]
</script>

<style scoped>
/* ── Fade-up stagger ── */
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(22px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.anim {
    opacity: 0;
    animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.anim-1 {
    animation-delay: 0.05s;
}

.anim-2 {
    animation-delay: 0.16s;
}

.anim-3 {
    animation-delay: 0.28s;
}

.anim-4 {
    animation-delay: 0.40s;
}

.anim-5 {
    animation-delay: 0.52s;
}

/* ── Dossier card ── */
.dossier-wrap {
    perspective: 1400px;
}

.dossier {
    animation: float 6s ease-in-out infinite;
    box-shadow: 0 18px 50px -18px rgba(var(--shadow-rgb), 0.55);
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotateX(0) rotateY(-2deg);
    }

    50% {
        transform: translateY(-10px) rotateX(1.5deg) rotateY(1deg);
    }
}

/* ── CTA button ── */
@keyframes shimmer {
    from {
        background-position: 200% center;
    }

    to {
        background-position: -200% center;
    }
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

.feat:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px -4px rgba(var(--shadow-rgb), 0.16), 0 2px 6px rgba(var(--shadow-rgb), 0.08);
}

.feat-icon {
    transition: transform 0.3s ease;
}

.feat:hover .feat-icon {
    transform: translateX(4px);
}

.also {
    opacity: 0;
    animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: 0.95s;
}
</style>
