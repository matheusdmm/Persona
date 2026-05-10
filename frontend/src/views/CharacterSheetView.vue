<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="!store.sheet" class="text-center py-20 text-stone-400">
      No character data. <RouterLink to="/create" class="text-gold underline">Create one</RouterLink>.
    </div>

    <div v-else id="sheet-content" class="space-y-5">

      <!-- ── HEADER ── -->
      <div class="card !p-5 flex items-start justify-between gap-6 flex-wrap">
        <div class="flex-1 min-w-0">
          <h1 class="text-4xl font-semibold text-parchment leading-tight truncate">
            {{ store.draft.name }}
          </h1>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm">
            <span class="capitalize font-semibold text-crimson">
              {{ store.sheet.input.class }} {{ store.sheet.input.level }}
            </span>
            <span class="text-stone-600">·</span>
            <span class="text-stone-400 capitalize">{{ store.sheet.input.race }}</span>
            <span class="text-stone-600">·</span>
            <span class="text-stone-400">{{ store.draft.background }}</span>
            <span class="text-stone-600">·</span>
            <span class="text-stone-400">{{ store.draft.alignment }}</span>
            <span class="px-2 py-0.5 bg-gold/10 text-gold border border-gold/30 rounded text-xs font-medium">
              {{ store.draft.edition }}
            </span>
          </div>
          <!-- Player name & creation date -->
          <div class="flex gap-4 mt-2 text-xs text-stone-500">
            <span v-if="store.draft.playerName">
              Player: <strong class="text-stone-400">{{ store.draft.playerName }}</strong>
            </span>
            <span v-if="store.draft.createdAt">
              Created: <strong class="text-stone-400">{{ createdDate }}</strong>
            </span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 shrink-0 no-print">
          <button class="btn-secondary text-sm !px-3 sm:!px-6" @click="exportJSON">
            <span class="sm:hidden">JSON</span>
            <span class="hidden sm:inline">Export JSON</span>
          </button>
          <button class="btn-secondary text-sm !px-3 sm:!px-6" @click="savePDF">
            <span class="sm:hidden">PDF</span>
            <span class="hidden sm:inline">Save as PDF</span>
          </button>
          <button
            class="btn-secondary text-sm !px-3 sm:!px-6 flex items-center gap-1.5"
            :class="store.isSaved ? 'text-gold border-gold' : ''"
            @click="toggleSave"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path v-if="store.isSaved" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              <path v-else d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ store.isSaved ? 'Saved' : 'Save' }}
          </button>
          <RouterLink to="/create" class="btn-primary text-sm !px-3 sm:!px-6">
            <span class="sm:hidden">New</span>
            <span class="hidden sm:inline">New Character</span>
          </RouterLink>
        </div>
      </div>

      <!-- ── 3-COLUMN BODY ── -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        <!-- ── LEFT: Abilities / Saves / Skills ── -->
        <div class="lg:col-span-3 space-y-4">

          <!-- Ability Scores -->
          <div class="card !p-4">
            <h2 class="section-title">Ability Scores</h2>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="ability in ABILITY_NAMES"
                :key="ability"
                class="flex flex-col items-center py-3 bg-stone-800 border border-stone-700 rounded-xl"
              >
                <span class="text-[10px] text-stone-400 uppercase tracking-widest">{{ ABILITY_LABELS[ability] }}</span>
                <span
                  class="text-2xl font-bold leading-none mt-1"
                  :class="store.sheet.modifiers[ability] >= 0 ? 'text-vivid' : 'text-red-500'"
                >
                  {{ formatMod(store.sheet.modifiers[ability]) }}
                </span>
                <span class="text-sm font-semibold text-parchment mt-1 leading-none">
                  {{ store.sheet.input.abilities[ability] }}
                </span>
              </div>
            </div>
          </div>

          <!-- Saving Throws -->
          <div class="card !p-4">
            <h2 class="section-title">Saving Throws</h2>
            <ul class="space-y-1.5">
              <li v-for="save in savingThrows" :key="save.ability" class="flex items-center gap-2 text-sm">
                <span
                  class="w-3 h-3 rounded-full border-2 shrink-0 transition-colors"
                  :class="save.isProficient ? 'bg-crimson border-crimson' : 'border-stone-500'"
                />
                <span class="w-8 text-right font-semibold shrink-0"
                  :class="save.bonus >= 0 ? 'text-parchment' : 'text-red-500'">
                  {{ formatMod(save.bonus) }}
                </span>
                <span class="text-stone-400 capitalize text-xs">{{ save.ability }}</span>
              </li>
            </ul>
          </div>

          <!-- Skills -->
          <div class="card !p-4">
            <h2 class="section-title">Skills</h2>
            <ul class="space-y-1">
              <li v-for="skill in skills" :key="skill.name" class="flex items-center gap-1.5 text-xs">
                <span
                  class="w-2.5 h-2.5 rounded-full border-2 shrink-0"
                  :class="skill.isProficient ? 'bg-crimson border-crimson' : 'border-stone-600'"
                />
                <span class="w-6 text-right font-semibold shrink-0"
                  :class="skill.modifier >= 0 ? 'text-parchment' : 'text-red-500'">
                  {{ formatMod(skill.modifier) }}
                </span>
                <span class="text-stone-400 flex-1 truncate">{{ skill.name }}</span>
                <span class="text-stone-600 uppercase text-[10px] shrink-0">{{ ABILITY_LABELS[skill.ability] }}</span>
              </li>
            </ul>
            <div class="mt-3 pt-2 border-t border-stone-700 flex justify-between text-xs">
              <span class="text-stone-400">Passive Perception</span>
              <span class="font-semibold text-parchment">{{ passivePerception }}</span>
            </div>
          </div>

        </div>

        <!-- ── CENTER: Combat / HP / Equipment ── -->
        <div class="lg:col-span-5 space-y-4">

          <!-- Core combat stats -->
          <div class="grid grid-cols-3 gap-3">
            <div class="card !p-4 text-center">
              <span class="text-3xl font-bold text-parchment">{{ store.sheet.armor_class }}</span>
              <div class="section-title !mb-0 mt-1">Armor Class</div>
            </div>
            <div class="card !p-4 text-center">
              <span class="text-3xl font-bold"
                :class="store.sheet.initiative >= 0 ? 'text-parchment' : 'text-red-500'">
                {{ formatMod(store.sheet.initiative) }}
              </span>
              <div class="section-title !mb-0 mt-1">Initiative</div>
            </div>
            <div class="card !p-4 text-center">
              <span class="text-3xl font-bold text-parchment">
                {{ store.selectedRace?.speed ?? '—' }}
              </span>
              <div class="section-title !mb-0 mt-1">Speed (ft)</div>
            </div>
          </div>

          <!-- HP / Hit Dice / Prof Bonus -->
          <div class="grid grid-cols-3 gap-3">
            <div class="card !p-4 col-span-1">
              <div class="section-title">Max HP</div>
              <span class="text-4xl font-bold text-parchment">{{ store.sheet.max_hp }}</span>
              <!-- HP breakdown -->
              <div v-if="hpBreakdown" class="mt-2 pt-2 border-t border-stone-700 space-y-0.5 text-[11px] text-stone-500 leading-relaxed">
                <div>
                  Lv 1: d{{ hpBreakdown.hitDie }}
                  <span v-if="hpBreakdown.conMod !== 0">
                    {{ hpBreakdown.conMod > 0 ? '+' : '' }}{{ hpBreakdown.conMod }} CON
                  </span>
                  = <span class="text-stone-400 font-medium">{{ hpBreakdown.level1HP }}</span>
                </div>
                <div v-if="hpBreakdown.additionalLevels > 0">
                  Lv 2+: {{ hpBreakdown.avgPerLevel }}
                  <span v-if="hpBreakdown.conMod !== 0">
                    {{ hpBreakdown.conMod > 0 ? '+' : '' }}{{ hpBreakdown.conMod }} CON
                  </span>
                  = {{ hpBreakdown.perLevel }}
                  <span class="text-stone-600">× {{ hpBreakdown.additionalLevels }}</span>
                  = <span class="text-stone-400 font-medium">{{ hpBreakdown.additionalHP }}</span>
                </div>
              </div>
            </div>
            <div class="card !p-4 col-span-1">
              <div class="section-title">Hit Dice</div>
              <span class="text-2xl font-bold text-parchment">
                {{ store.sheet.input.level }}d{{ store.selectedClass?.hit_die ?? '8' }}
              </span>
              <div class="mt-2 text-[11px] text-stone-500">
                Max per die: {{ store.selectedClass?.hit_die ?? '8' }}<br/>
                Avg per die: {{ hpBreakdown?.avgPerLevel ?? '—' }}
              </div>
            </div>
            <div class="card !p-4 col-span-1">
              <div class="section-title">Prof. Bonus</div>
              <span class="text-2xl font-bold text-gold">
                {{ formatMod(store.sheet.proficiency_bonus) }}
              </span>
            </div>
          </div>

          <!-- Attacks -->
          <div v-if="attacks.length" class="card !p-4">
            <h2 class="section-title">Attacks</h2>
            <table class="w-full text-xs">
              <thead>
                <tr class="text-stone-500 uppercase tracking-wider border-b border-stone-700">
                  <th class="text-left pb-1 font-semibold">Weapon</th>
                  <th class="text-center pb-1 font-semibold w-16">Bonus</th>
                  <th class="text-center pb-1 font-semibold w-20">Damage</th>
                  <th class="text-left pb-1 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-700">
                <tr v-for="atk in attacks" :key="atk.name" class="text-parchment">
                  <td class="py-1.5 pr-2 font-semibold">
                    {{ atk.name }}
                    <span v-if="!atk.proficient" class="text-stone-500 font-normal"> *</span>
                  </td>
                  <td class="py-1.5 text-center font-bold" :class="atk.attackBonus >= 0 ? 'text-vivid' : 'text-red-500'">
                    {{ formatMod(atk.attackBonus) }}
                  </td>
                  <td class="py-1.5 text-center text-gold font-semibold">{{ atk.damageStr }}</td>
                  <td class="py-1.5 text-stone-400 capitalize">{{ atk.damageType }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="attacks.some(a => !a.proficient)" class="text-stone-500 text-[10px] mt-2">* not proficient — no proficiency bonus to attack</p>
          </div>

          <!-- Death Saves -->
          <div class="card !p-4">
            <h2 class="section-title">Death Saves</h2>
            <div class="flex gap-8">
              <div class="flex items-center gap-2">
                <span class="text-xs text-stone-400">Successes</span>
                <div class="flex gap-1.5">
                  <div v-for="i in 3" :key="i"
                    class="w-4 h-4 rounded-full border-2 border-stone-600" />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-stone-400">Failures</span>
                <div class="flex gap-1.5">
                  <div v-for="i in 3" :key="i"
                    class="w-4 h-4 rounded-full border-2 border-stone-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Equipment -->
          <div v-if="store.draft.equipment?.length || store.draft.gold" class="card !p-4">
            <h2 class="section-title">Equipment</h2>
            <ul class="space-y-1.5 mb-3">
              <li v-for="item in store.draft.equipment" :key="item"
                class="flex items-center gap-2 text-sm">
                <span class="text-gold text-xs shrink-0">◆</span>
                <span class="text-parchment">{{ item }}</span>
              </li>
            </ul>
            <div class="flex items-center gap-2 pt-3 border-t border-stone-700">
              <span class="text-xl font-bold text-gold">{{ store.draft.gold }}</span>
              <span class="text-stone-400 text-sm">gp</span>
            </div>
          </div>

          <!-- Proficiencies -->
          <div v-if="store.selectedClass" class="card !p-4">
            <h2 class="section-title">Proficiencies & Languages</h2>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Armor</p>
                <p class="text-parchment capitalize">
                  {{ store.selectedClass.armor_proficiencies.join(', ') || 'None' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Weapons</p>
                <p class="text-parchment capitalize">
                  {{ store.selectedClass.weapon_proficiencies.join(', ') }}
                </p>
              </div>
              <div v-if="store.draft.languages?.length">
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Languages</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="lang in store.draft.languages" :key="lang"
                    class="text-xs px-2 py-0.5 bg-stone-800 border border-stone-700 text-parchment rounded-full"
                  >{{ lang }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ── RIGHT: Personality / Traits / Class ── -->
        <div class="lg:col-span-4 space-y-4">

          <!-- Personality -->
          <div class="card !p-4">
            <h2 class="section-title">Personality</h2>
            <div class="space-y-3">
              <div v-for="f in personalityFields" :key="f.key">
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">{{ f.label }}</p>
                <p class="text-sm text-parchment leading-relaxed min-h-[1.25rem]">
                  {{ store.draft[f.key] || '—' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Race Traits -->
          <div v-if="store.selectedRace" class="card !p-4">
            <h2 class="section-title">{{ store.selectedRace.name }} Traits</h2>
            <ul class="space-y-2 mb-3">
              <li v-for="trait in store.selectedRace.traits" :key="trait.name" class="text-sm">
                <span class="font-semibold text-parchment">{{ trait.name }}.</span>
                <span class="text-stone-300 ml-1">{{ trait.description }}</span>
              </li>
            </ul>
            <div class="pt-3 border-t border-stone-700 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400">
              <span>Size: <strong class="text-parchment">{{ store.selectedRace.size }}</strong></span>
              <span>Speed: <strong class="text-parchment">{{ store.selectedRace.speed }} ft</strong></span>
            </div>
            <div v-if="store.selectedRace.ability_bonuses?.length" class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="b in store.selectedRace.ability_bonuses" :key="b.ability"
                class="text-xs px-1.5 py-0.5 bg-gold/10 text-gold border border-gold/30 rounded"
              >+{{ b.bonus }} {{ b.ability.slice(0,3).toUpperCase() }}</span>
            </div>
          </div>

          <!-- Class Features -->
          <div v-if="store.selectedClass" class="card !p-4">
            <h2 class="section-title">{{ store.selectedClass.name }} Features</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-stone-400">Hit Die</span>
                <span class="font-semibold text-parchment">d{{ store.selectedClass.hit_die }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-400">Primary Ability</span>
                <span class="font-semibold text-parchment capitalize">{{ store.selectedClass.primary_ability }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-400">Saving Throws</span>
                <span class="font-semibold text-parchment capitalize text-right">
                  {{ store.selectedClass.saving_throws.join(', ') }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-400">Skill Choices</span>
                <span class="font-semibold text-parchment">{{ store.selectedClass.skill_choices }}</span>
              </div>
              <div class="pt-2 border-t border-stone-700">
                <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Available Skills</p>
                <p class="text-parchment capitalize text-xs leading-relaxed">
                  {{ store.selectedClass.available_skills.join(', ').replace(/_/g, ' ') }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── SPELLS ── -->
      <div v-if="isSpellcaster && store.sheet" class="card !p-4">
        <h2 class="section-title">Spells</h2>

        <!-- Header stats -->
        <div class="flex flex-wrap gap-6 mb-4">
          <div>
            <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Spell Save DC</p>
            <p class="text-3xl font-bold text-parchment">{{ spellSaveDC }}</p>
          </div>
          <div>
            <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Spell Attack</p>
            <p class="text-3xl font-bold" :class="spellAttackBonus >= 0 ? 'text-parchment' : 'text-red-500'">
              {{ formatMod(spellAttackBonus) }}
            </p>
          </div>
          <div class="self-end mb-1">
            <p class="text-xs text-stone-500 capitalize">
              via <strong class="text-stone-400">{{ SPELLCASTING_ABILITY[store.draft.class] }}</strong>
              <template v-if="store.draft.class === 'warlock'">
                &nbsp;·&nbsp;<span class="text-gold/80">Pact Magic (short rest)</span>
              </template>
            </p>
          </div>
        </div>

        <!-- Spell slots -->
        <div v-if="spellSlots && spellSlots.some(s => s > 0)" class="mb-4">
          <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-2">Spell Slots</p>
          <div class="flex flex-wrap gap-4">
            <div v-for="(count, i) in spellSlots" :key="i" v-show="count > 0">
              <p class="text-[10px] text-stone-500 mb-1 text-center">{{ SPELL_LEVEL_LABELS[i + 1] }}</p>
              <div class="flex gap-1">
                <div v-for="j in count" :key="j"
                  class="w-4 h-4 rounded-full border-2 border-stone-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Selected spells -->
        <div v-if="selectedSpells.length">
          <p class="text-[10px] text-stone-400 uppercase tracking-widest mb-3">Known Spells</p>
          <div v-for="[level, spells] in spellsByLevel" :key="level" class="mb-4">
            <p class="text-xs font-semibold text-gold mb-2 uppercase tracking-wide">
              {{ level === 0 ? 'Cantrips' : SPELL_LEVEL_LABELS[level] + ' Level' }}
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1.5">
              <div v-for="spell in spells" :key="spell.slug" class="text-sm">
                <span class="text-parchment font-medium">{{ spell.name }}</span>
                <span v-if="spell.components" class="text-stone-500 text-xs ml-1">
                  ({{ spell.components }})
                </span>
                <div v-if="spell.casting_time || spell.range" class="text-[10px] text-stone-600 leading-tight">
                  {{ [spell.casting_time, spell.range].filter(Boolean).join(' · ') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="text-stone-500 text-sm italic">No spells selected.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character.js'
import {
  ABILITY_NAMES, ABILITY_LABELS, SKILL_MAP, WEAPONS, isProficientWith,
  SPELLCASTING_CLASSES, SPELLCASTING_ABILITY, getSpellSlots, SPELL_LEVEL_LABELS,
} from '@/types/index.js'
import { formatMod } from '@/composables/useAbilityScores.js'

const store = useCharacterStore()

const savingThrows = computed(() => {
  if (!store.sheet || !store.selectedClass) return []
  return ABILITY_NAMES.map(ability => {
    const isProficient = store.selectedClass.saving_throws.includes(ability)
    const bonus = store.sheet.modifiers[ability] + (isProficient ? store.sheet.proficiency_bonus : 0)
    return { ability, isProficient, bonus }
  })
})

const skills = computed(() => {
  if (!store.sheet) return []
  return SKILL_MAP.map(s => {
    const isProficient = store.draft.skills?.includes(s.key) ?? false
    const modifier = store.sheet.modifiers[s.ability] + (isProficient ? store.sheet.proficiency_bonus : 0)
    return { ...s, modifier, isProficient }
  })
})

const passivePerception = computed(() =>
  store.sheet ? 10 + store.sheet.modifiers.wisdom : 10
)

const hpBreakdown = computed(() => {
  if (!store.sheet || !store.selectedClass) return null
  const hitDie   = store.selectedClass.hit_die
  const conMod   = store.sheet.modifiers.constitution
  const level    = store.sheet.input.level
  const avgPerLevel    = Math.floor(hitDie / 2) + 1
  const perLevel       = avgPerLevel + conMod
  const level1HP       = hitDie + conMod
  const additionalLevels = level - 1
  return { hitDie, conMod, level, avgPerLevel, perLevel, level1HP, additionalLevels, additionalHP: perLevel * additionalLevels }
})

const attacks = computed(() => {
  if (!store.sheet || !store.selectedClass) return []
  const mods = store.sheet.modifiers
  const prof = store.sheet.proficiency_bonus
  const profs = store.selectedClass.weapon_proficiencies

  return (store.draft.weapons ?? []).map(id => {
    const w = WEAPONS.find(x => x.id === id)
    if (!w) return null
    const proficient = isProficientWith(w, profs)
    const abilityMod = w.ranged
      ? mods.dexterity
      : w.finesse
        ? Math.max(mods.strength, mods.dexterity)
        : mods.strength
    const attackBonus = abilityMod + (proficient ? prof : 0)
    const damageStr = abilityMod === 0 ? w.damage : `${w.damage} ${formatMod(abilityMod)}`
    return { name: w.name, attackBonus, damageStr, damageType: w.damageType, proficient }
  }).filter(Boolean)
})

const createdDate = computed(() => {
  if (!store.draft.createdAt) return ''
  return new Date(store.draft.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})

const personalityFields = [
  { key: 'trait', label: 'Personality Trait' },
  { key: 'ideal', label: 'Ideal' },
  { key: 'bond',  label: 'Bond' },
  { key: 'flaw',  label: 'Flaw' },
]

const isSpellcaster = computed(() => SPELLCASTING_CLASSES.has(store.draft.class))

const spellSlots = computed(() => {
  if (!isSpellcaster.value || !store.sheet) return null
  return getSpellSlots(store.draft.class, store.sheet.input.level)
})

const spellSaveDC = computed(() => {
  if (!store.sheet || !isSpellcaster.value) return 0
  const ability = SPELLCASTING_ABILITY[store.draft.class]
  return 8 + store.sheet.proficiency_bonus + store.sheet.modifiers[ability]
})

const spellAttackBonus = computed(() => {
  if (!store.sheet || !isSpellcaster.value) return 0
  const ability = SPELLCASTING_ABILITY[store.draft.class]
  return store.sheet.proficiency_bonus + store.sheet.modifiers[ability]
})

const selectedSpells = computed(() => store.draft.spells ?? [])

const spellsByLevel = computed(() => {
  const grouped = new Map()
  for (const spell of selectedSpells.value) {
    if (!grouped.has(spell.level)) grouped.set(spell.level, [])
    grouped.get(spell.level).push(spell)
  }
  return [...grouped.entries()].sort(([a], [b]) => a - b)
})

function toggleSave() {
  if (store.isSaved) store.unsaveCharacter(store.draft.savedId)
  else store.saveCharacter()
}

function savePDF() {
  const name   = store.draft.name || 'Character'
  const player = store.draft.playerName ? ` — ${store.draft.playerName}` : ''
  const date   = createdDate.value ? ` (${createdDate.value})` : ''
  const prev   = document.title
  document.title = `${name}${player}${date}`
  window.print()
  document.title = prev
}

function exportJSON() {
  const data = JSON.stringify({ draft: store.draft, sheet: store.sheet }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.draft.name || 'character'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
