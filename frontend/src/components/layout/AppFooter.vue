<template>
    <footer class="no-print border-t border-stone-700 bg-stone-950 mt-10">
        <div class="max-w-6xl mx-auto px-6 py-10">
            <!-- Top row -->
            <div class="flex flex-col sm:flex-row justify-between gap-8 mb-8">
                <!-- Brand -->
                <div class="max-w-xs">
                    <p
                        class="font-body text-lg font-semibold text-parchment tracking-wide mb-2"
                    >
                        HeroScribe
                    </p>
                    <p class="text-stone-400 text-sm leading-relaxed">
                        A free character creator for D&D 5e and 5.5e. No account
                        required.
                    </p>
                </div>

                <!-- Links -->
                <nav class="flex gap-12 text-sm">
                    <div class="flex flex-col gap-2.5">
                        <p
                            class="text-[10px] text-stone-500 uppercase tracking-widest mb-1"
                        >
                            App
                        </p>
                        <RouterLink
                            to="/"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >Home</RouterLink
                        >
                        <RouterLink
                            to="/create"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >New Character</RouterLink
                        >
                        <RouterLink
                            to="/saved"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >Saved Characters</RouterLink
                        >
                    </div>
                    <div class="flex flex-col gap-2.5">
                        <p
                            class="text-[10px] text-stone-500 uppercase tracking-widest mb-1"
                        >
                            Also by Matheus
                        </p>
                        <a
                            href="https://www.tomeofchanges.com/"
                            target="_blank"
                            rel="noopener"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >Tome of Changes</a
                        >
                        <a
                            href="https://matheusdmm.dev"
                            target="_blank"
                            rel="noopener"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >matheusdmm.dev</a
                        >
                    </div>
                    <div class="flex flex-col gap-2.5">
                        <p
                            class="text-[10px] text-stone-500 uppercase tracking-widest mb-1"
                        >
                            Resources
                        </p>
                        <a
                            href="https://api.open5e.com"
                            target="_blank"
                            rel="noopener"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >Open5e API</a
                        >
                        <a
                            href="https://dnd.wizards.com/resources/systems-reference-document"
                            target="_blank"
                            rel="noopener"
                            class="text-stone-400 hover:text-parchment transition-colors"
                            >SRD (WotC)</a
                        >
                    </div>
                </nav>
            </div>

            <!-- Divider -->
            <div
                class="border-t border-stone-700 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-stone-500"
            >
                <p>
                    © {{ year }} HeroScribe. Built by
                    <a
                        href="https://matheusdmm.dev"
                        target="_blank"
                        rel="noopener"
                        class="underline hover:text-stone-400 transition-colors"
                        >Matheus</a
                    >.
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
