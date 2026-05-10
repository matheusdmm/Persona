// types/index.js
// Using JSDoc for type hints without requiring TypeScript setup

/**
 * @typedef {Object} AbilityScores
 * @property {number} strength
 * @property {number} dexterity
 * @property {number} constitution
 * @property {number} intelligence
 * @property {number} wisdom
 * @property {number} charisma
 */

/**
 * @typedef {Object} Trait
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} AbilityBonus
 * @property {string} ability
 * @property {number} bonus
 */

/**
 * @typedef {Object} Race
 * @property {string} id
 * @property {string} name
 * @property {string} edition
 * @property {number} speed
 * @property {string} size
 * @property {Trait[]} traits
 * @property {AbilityBonus[]} ability_bonuses
 */

/**
 * @typedef {Object} Class
 * @property {string} id
 * @property {string} name
 * @property {string} edition
 * @property {number} hit_die
 * @property {string} primary_ability
 * @property {string[]} saving_throws
 * @property {number} skill_choices
 * @property {string[]} available_skills
 */

/**
 * @typedef {Object} CharacterDraft
 * @property {string} name
 * @property {string} race
 * @property {string} class
 * @property {number} level
 * @property {string} background
 * @property {string} edition
 * @property {AbilityScores} abilities
 * @property {string[]} skills
 * @property {string} alignment
 */

export const ABILITY_NAMES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

export const SPELL_LEVEL_LABELS = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']

export const ABILITY_LABELS = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
}

export const SKILL_MAP = [
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

export const ALL_LANGUAGES = [
  'Abyssal', 'Celestial', 'Common', 'Draconic', 'Deep Speech',
  'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Infernal', 'Orc', 'Primordial', 'Sylvan', 'Undercommon',
]

export const RACE_LANGUAGES = {
  human:      ['Common'],
  elf:        ['Common', 'Elvish'],
  dwarf:      ['Common', 'Dwarvish'],
  halfling:   ['Common'],
  dragonborn: ['Common', 'Draconic'],
  gnome:      ['Common', 'Gnomish'],
  'half-elf': ['Common', 'Elvish'],
  tiefling:   ['Common', 'Infernal'],
}

export const CLASS_GOLD_ROLLS = {
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

export const CLASS_STARTING_EQUIPMENT = {
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

export const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
]

export const BACKGROUNDS = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer',
  'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble',
  'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin',
]

export const WEAPONS = [
  // ── Simple Melee ──
  { id: 'club',          name: 'Club',           category: 'simple',  damage: '1d4',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'dagger',        name: 'Dagger',          category: 'simple',  damage: '1d4',  damageType: 'piercing',    ranged: false, finesse: true  },
  { id: 'greatclub',     name: 'Greatclub',       category: 'simple',  damage: '1d8',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'handaxe',       name: 'Handaxe',         category: 'simple',  damage: '1d6',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'javelin',       name: 'Javelin',          category: 'simple',  damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'light_hammer',  name: 'Light Hammer',    category: 'simple',  damage: '1d4',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'mace',          name: 'Mace',            category: 'simple',  damage: '1d6',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'quarterstaff',  name: 'Quarterstaff',    category: 'simple',  damage: '1d6',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'sickle',        name: 'Sickle',          category: 'simple',  damage: '1d4',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'spear',         name: 'Spear',           category: 'simple',  damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: false },
  // ── Simple Ranged ──
  { id: 'dart',          name: 'Dart',            category: 'simple',  damage: '1d4',  damageType: 'piercing',    ranged: true,  finesse: true  },
  { id: 'light_crossbow',name: 'Light Crossbow',  category: 'simple',  damage: '1d8',  damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'shortbow',      name: 'Shortbow',        category: 'simple',  damage: '1d6',  damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'sling',         name: 'Sling',           category: 'simple',  damage: '1d4',  damageType: 'bludgeoning', ranged: true,  finesse: false },
  // ── Martial Melee ──
  { id: 'battleaxe',     name: 'Battleaxe',       category: 'martial', damage: '1d8',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'flail',         name: 'Flail',           category: 'martial', damage: '1d8',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'glaive',        name: 'Glaive',          category: 'martial', damage: '1d10', damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'greataxe',      name: 'Greataxe',        category: 'martial', damage: '1d12', damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'greatsword',    name: 'Greatsword',      category: 'martial', damage: '2d6',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'halberd',       name: 'Halberd',         category: 'martial', damage: '1d10', damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'longsword',     name: 'Longsword',       category: 'martial', damage: '1d8',  damageType: 'slashing',    ranged: false, finesse: false },
  { id: 'maul',          name: 'Maul',            category: 'martial', damage: '2d6',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'morningstar',   name: 'Morningstar',     category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'rapier',        name: 'Rapier',          category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: false, finesse: true  },
  { id: 'scimitar',      name: 'Scimitar',        category: 'martial', damage: '1d6',  damageType: 'slashing',    ranged: false, finesse: true  },
  { id: 'shortsword',    name: 'Shortsword',      category: 'martial', damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: true  },
  { id: 'trident',       name: 'Trident',         category: 'martial', damage: '1d6',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'war_pick',      name: 'War Pick',        category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: false, finesse: false },
  { id: 'warhammer',     name: 'Warhammer',       category: 'martial', damage: '1d8',  damageType: 'bludgeoning', ranged: false, finesse: false },
  { id: 'whip',          name: 'Whip',            category: 'martial', damage: '1d4',  damageType: 'slashing',    ranged: false, finesse: true  },
  // ── Martial Ranged ──
  { id: 'hand_crossbow', name: 'Hand Crossbow',   category: 'martial', damage: '1d6',  damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'heavy_crossbow',name: 'Heavy Crossbow',  category: 'martial', damage: '1d10', damageType: 'piercing',    ranged: true,  finesse: false },
  { id: 'longbow',       name: 'Longbow',         category: 'martial', damage: '1d8',  damageType: 'piercing',    ranged: true,  finesse: false },
]

export function isProficientWith(weapon, classProficiencies) {
  if (!classProficiencies?.length) return false
  return (
    classProficiencies.includes(weapon.category) ||
    classProficiencies.includes(weapon.id) ||
    classProficiencies.includes(weapon.id + 's')
  )
}

export const SPELLCASTING_CLASSES = new Set([
  'bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard',
])

export const SPELLCASTING_ABILITY = {
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
const FULL_SLOTS = [
  [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0], [4,3,3,3,2,1,0,0,0], [4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,0,0], [4,3,3,3,2,1,1,1,0], [4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1], [4,3,3,3,3,1,1,1,1], [4,3,3,3,3,2,1,1,1], [4,3,3,3,3,2,2,1,1],
]

const HALF_SLOTS = [
  [0,0,0,0,0,0,0,0,0], [2,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0], [3,0,0,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0], [4,2,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0], [4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0], [4,3,2,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0], [4,3,3,0,0,0,0,0,0],
  [4,3,3,1,0,0,0,0,0], [4,3,3,1,0,0,0,0,0], [4,3,3,2,0,0,0,0,0], [4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0], [4,3,3,3,1,0,0,0,0], [4,3,3,3,2,0,0,0,0], [4,3,3,3,2,0,0,0,0],
]

// Warlock pact magic: [slotCount, slotLevel] per character level
const WARLOCK_PACT = [
  [1,1],[2,1],[2,2],[2,2],[2,3],[2,3],[2,4],[2,4],[2,5],[2,5],
  [3,5],[3,5],[3,5],[3,5],[3,5],[3,5],[4,5],[4,5],[4,5],[4,5],
]

/** Returns an array of 9 slot counts (index 0 = 1st level), or null for non-casters. */
export function getSpellSlots(className, level) {
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

/** @returns {CharacterDraft} */
export function emptyCharacter() {
  return {
    name: '',
    race: '',
    class: '',
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
    languages: [],
    equipment: [],
    weapons: [],
    spells: [],
    trait: '',
    ideal: '',
    bond: '',
    flaw: '',
    savedId: null,
  }
}
