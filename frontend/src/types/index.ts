export type { AbilityName, Edition, WeaponCategory, AbilityScores, Trait, AbilityBonus, Race, DnDClass, Subclass, CharacterDraft, CharacterSheet, CharacterInput, SelectedSpell, Spell, SavedEntry, Weapon, SkillEntry, GoldRoll, ArmorItem } from './models'
export type { CategoryKey, RawEntry, ExtendedSpell, ExtendedItem } from './extended'
import type { AbilityName, Weapon, SkillEntry, GoldRoll } from './models'

export const ABILITY_NAMES: AbilityName[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

export const SPELL_LEVEL_LABELS: string[] = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']

export const ABILITY_LABELS: Record<AbilityName, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
}

export const SKILL_MAP: SkillEntry[] = [
  { name: 'Acrobatics',      ability: 'dexterity',   key: 'acrobatics' },
  { name: 'Animal Handling', ability: 'wisdom',       key: 'animal_handling' },
  { name: 'Arcana',          ability: 'intelligence', key: 'arcana' },
  { name: 'Athletics',       ability: 'strength',     key: 'athletics' },
  { name: 'Deception',       ability: 'charisma',     key: 'deception' },
  { name: 'History',         ability: 'intelligence', key: 'history' },
  { name: 'Insight',         ability: 'wisdom',       key: 'insight' },
  { name: 'Intimidation',    ability: 'charisma',     key: 'intimidation' },
  { name: 'Investigation',   ability: 'intelligence', key: 'investigation' },
  { name: 'Medicine',        ability: 'wisdom',       key: 'medicine' },
  { name: 'Nature',          ability: 'intelligence', key: 'nature' },
  { name: 'Perception',      ability: 'wisdom',       key: 'perception' },
  { name: 'Performance',     ability: 'charisma',     key: 'performance' },
  { name: 'Persuasion',      ability: 'charisma',     key: 'persuasion' },
  { name: 'Religion',        ability: 'intelligence', key: 'religion' },
  { name: 'Sleight of Hand', ability: 'dexterity',    key: 'sleight_of_hand' },
  { name: 'Stealth',         ability: 'dexterity',    key: 'stealth' },
  { name: 'Survival',        ability: 'wisdom',       key: 'survival' },
]

export const ALL_LANGUAGES: string[] = [
  'Abyssal', 'Celestial', 'Common', 'Draconic', 'Deep Speech',
  'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Infernal', 'Orc', 'Primordial', 'Sylvan', 'Undercommon',
]

export const RACE_LANGUAGES: Record<string, string[]> = {
  human:      ['Common'],
  elf:        ['Common', 'Elvish'],
  dwarf:      ['Common', 'Dwarvish'],
  halfling:   ['Common'],
  dragonborn: ['Common', 'Draconic'],
  gnome:      ['Common', 'Gnomish'],
  'half-elf': ['Common', 'Elvish'],
  tiefling:   ['Common', 'Infernal'],
}

export const CLASS_GOLD_ROLLS: Record<string, GoldRoll> = {
  barbarian: { count: 2, die: 4, multiplier: 10, label: '2d4×10' },
  bard:      { count: 5, die: 4, multiplier: 10, label: '5d4×10' },
  cleric:    { count: 5, die: 4, multiplier: 10, label: '5d4×10' },
  druid:     { count: 2, die: 4, multiplier: 10, label: '2d4×10' },
  fighter:   { count: 5, die: 4, multiplier: 10, label: '5d4×10' },
  monk:      { count: 5, die: 4, multiplier:  1, label: '5d4' },
  paladin:   { count: 5, die: 4, multiplier: 10, label: '5d4×10' },
  ranger:    { count: 5, die: 4, multiplier: 10, label: '5d4×10' },
  rogue:     { count: 4, die: 4, multiplier: 10, label: '4d4×10' },
  sorcerer:  { count: 3, die: 4, multiplier: 10, label: '3d4×10' },
  warlock:   { count: 4, die: 4, multiplier: 10, label: '4d4×10' },
  wizard:    { count: 4, die: 4, multiplier: 10, label: '4d4×10' },
}

export const CLASS_STARTING_EQUIPMENT: Record<string, string[]> = {
  barbarian: ['Greataxe', 'Two handaxes', "Explorer's pack", '4 javelins'],
  bard:      ['Rapier', "Diplomat's pack", 'Lute', 'Leather armor', 'Dagger'],
  cleric:    ['Mace', 'Scale mail', 'Light crossbow & 20 bolts', "Priest's pack", 'Shield', 'Holy symbol'],
  druid:     ['Wooden shield', 'Scimitar', 'Leather armor', "Explorer's pack", 'Druidic focus'],
  fighter:   ['Chain mail', 'Martial weapon & shield', 'Light crossbow & 20 bolts', "Dungeoneer's pack"],
  monk:      ['Shortsword', "Dungeoneer's pack", '10 darts'],
  paladin:   ['Martial weapon & shield', 'Chain mail', 'Holy symbol', "Priest's pack"],
  ranger:    ['Scale mail', 'Two shortswords', "Dungeoneer's pack", 'Longbow & 20 arrows'],
  rogue:     ['Rapier', 'Shortbow & 20 arrows', "Burglar's pack", 'Leather armor', 'Two daggers', "Thieves' tools"],
  sorcerer:  ['Light crossbow & 20 bolts', 'Component pouch', "Dungeoneer's pack", '2 daggers'],
  warlock:   ['Light crossbow & 20 bolts', 'Arcane focus', "Scholar's pack", 'Leather armor', 'Two daggers'],
  wizard:    ['Quarterstaff', 'Component pouch', "Scholar's pack", 'Spellbook'],
}

export const ALIGNMENTS: string[] = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
]

export const BACKGROUNDS: string[] = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer',
  'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble',
  'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin',
]

export const WEAPONS: Weapon[] = [
  // ── Simple Melee ──
  { id: 'club',          name: 'Club',          category: 'simple',  damage: '1d4',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'dagger',        name: 'Dagger',        category: 'simple',  damage: '1d4',  damageType: 'piercing',    ranged: false, finesse: true  },
  { id: 'greatclub',     name: 'Greatclub',     category: 'simple',  damage: '1d8',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'handaxe',       name: 'Handaxe',       category: 'simple',  damage: '1d6',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'javelin',       name: 'Javelin',       category: 'simple',  damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'light_hammer',  name: 'Light Hammer',  category: 'simple',  damage: '1d4',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'mace',          name: 'Mace',          category: 'simple',  damage: '1d6',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'quarterstaff',  name: 'Quarterstaff',  category: 'simple',  damage: '1d6',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'sickle',        name: 'Sickle',        category: 'simple',  damage: '1d4',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'spear',         name: 'Spear',         category: 'simple',  damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: false },
  // ── Simple Ranged ──
  { id: 'dart',          name: 'Dart',          category: 'simple',  damage: '1d4',  damageType: 'piercing',    ranged: true,  finesse: true  },
  { id: 'light_crossbow',name: 'Light Crossbow',category: 'simple',  damage: '1d8',  damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'shortbow',      name: 'Shortbow',      category: 'simple',  damage: '1d6',  damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'sling',         name: 'Sling',         category: 'simple',  damage: '1d4',  damageType: 'bludgeoning', ranged: true,  finesse: false },
  // ── Martial Melee ──
  { id: 'battleaxe',     name: 'Battleaxe',     category: 'martial', damage: '1d8',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'flail',         name: 'Flail',         category: 'martial', damage: '1d8',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'glaive',        name: 'Glaive',        category: 'martial', damage: '1d10', damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'greataxe',      name: 'Greataxe',      category: 'martial', damage: '1d12', damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'greatsword',    name: 'Greatsword',    category: 'martial', damage: '2d6',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'halberd',       name: 'Halberd',       category: 'martial', damage: '1d10', damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'longsword',     name: 'Longsword',     category: 'martial', damage: '1d8',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'maul',          name: 'Maul',          category: 'martial', damage: '2d6',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'morningstar',   name: 'Morningstar',   category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'rapier',        name: 'Rapier',        category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: false, finesse: true  },
  { id: 'scimitar',      name: 'Scimitar',      category: 'martial', damage: '1d6',  damageType: 'slashing',    ranged: false, finesse: true  },
  { id: 'shortsword',    name: 'Shortsword',    category: 'martial', damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: true  },
  { id: 'trident',       name: 'Trident',       category: 'martial', damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'war_pick',      name: 'War Pick',      category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'warhammer',     name: 'Warhammer',     category: 'martial', damage: '1d8',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'whip',          name: 'Whip',          category: 'martial', damage: '1d4',  damageType: 'slashing',    ranged: false, finesse: true  },
  // ── Martial Ranged ──
  { id: 'hand_crossbow', name: 'Hand Crossbow', category: 'martial', damage: '1d6',  damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'heavy_crossbow',name: 'Heavy Crossbow',category: 'martial', damage: '1d10', damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'longbow',       name: 'Longbow',       category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: true,  finesse: false },
]

export function isProficientWith(weapon: Weapon, classProficiencies: string[]): boolean {
  if (!classProficiencies?.length) return false
  return (
    classProficiencies.includes(weapon.category) ||
    classProficiencies.includes(weapon.id) ||
    classProficiencies.includes(weapon.id + 's')
  )
}

export const SPELLCASTING_CLASSES = new Set<string>([
  'bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard',
])

export const SPELLCASTING_ABILITY: Record<string, AbilityName> = {
  bard:     'charisma',
  cleric:   'wisdom',
  druid:    'wisdom',
  paladin:  'charisma',
  ranger:   'wisdom',
  sorcerer: 'charisma',
  warlock:  'charisma',
  wizard:   'intelligence',
}

export const MIN_LEVEL = 1
export const MAX_LEVEL = 20

// Spell slots per character level — row index is (level-1), column index is (spellLevel-1)
const FULL_SLOTS: number[][] = [
  [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1],
]

const HALF_SLOTS: number[][] = [
  [0,0,0,0,0,0,0,0,0], [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0], [4,3,3,3,2,0,0,0,0],
]

// Warlock pact magic: [slotCount, slotLevel] per character level
const WARLOCK_PACT: [number, number][] = [
  [1,1],[2,1],[2,2],[2,2],[2,3],[2,3],[2,4],[2,4],[2,5],[2,5],
  [3,5],[3,5],[3,5],[3,5],[3,5],[3,5],[4,5],[4,5],[4,5],[4,5],
]

/** Max cantrips a class can know at character creation. Rangers get 2 in 5.5e, 0 in 5e. */
export function getMaxCantrips(className: string, edition: string): number {
  const table: Record<string, number> = {
    bard: 2, cleric: 3, druid: 2, paladin: 0,
    ranger: edition === '5.5e' ? 2 : 0,
    sorcerer: 4, warlock: 2, wizard: 3,
  }
  return table[className] ?? 0
}

/**
 * Max spells a class can know/prepare at character creation.
 * Known casters: fixed values. Prepared casters: ability mod + level (min 1).
 * Wizard is simplified to spellbook size (6). Non-casters return 0.
 * @param wisMod — already includes race bonus
 * @param chaMod — already includes race bonus
 */
export function getMaxSpells(className: string, level: number, wisMod: number, chaMod: number): number {
  switch (className) {
    case 'bard':     return 4
    case 'cleric':   return Math.max(1, wisMod + level)
    case 'druid':    return Math.max(1, wisMod + level)
    case 'paladin':  return Math.max(1, chaMod + Math.floor(level / 2))
    case 'ranger':   return 2
    case 'sorcerer': return 2
    case 'warlock':  return 2
    case 'wizard':   return 6
    default:         return 0
  }
}

/** Returns an array of 9 slot counts (index 0 = 1st level), or null for non-casters. */
export function getSpellSlots(className: string, level: number): number[] | null {
  const idx = Math.min(Math.max(level, MIN_LEVEL), MAX_LEVEL) - 1
  if (['bard', 'cleric', 'druid', 'sorcerer', 'wizard'].includes(className)) return FULL_SLOTS[idx]
  if (['paladin', 'ranger'].includes(className)) return HALF_SLOTS[idx]
  if (className === 'warlock') {
    const [count, slotLevel] = WARLOCK_PACT[idx]
    const result = [0,0,0,0,0,0,0,0,0]
    result[slotLevel - 1] = count
    return result
  }
  return null
}

import type { CharacterDraft } from './models'

export function emptyCharacter(): CharacterDraft {
  return {
    name: '',
    race: '',
    class: '',
    subclass: '',
    level: 1,
    background: '',
    edition: '5e',
    alignment: '',
    skills: [],
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    playerName: '',
    createdAt: null,
    gold: 0,
    languages: ['Common'],
    equipment: [],
    weapons: [],
    armor: '',
    shield: false,
    spells: [],
    trait: '',
    ideal: '',
    bond: '',
    flaw: '',
    savedId: null,
  }
}
