export type AbilityName = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'
export type Edition = '5e' | '5.5e' | 'both'
export type WeaponCategory = 'simple' | 'martial'

export interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface Trait {
  name: string
  description: string
}

export interface AbilityBonus {
  ability: AbilityName
  bonus: number
}

export interface Race {
  id: string
  name: string
  edition: Edition
  speed: number
  size: string
  traits: Trait[]
  ability_bonuses: AbilityBonus[]
}

export interface Subclass {
  id: string
  name: string
  edition: Edition
  level_gained: number
  description: string
}

export interface DnDClass {
  id: string
  name: string
  edition: Edition
  hit_die: number
  primary_ability: AbilityName
  saving_throws: AbilityName[]
  skill_choices: number
  available_skills: string[]
  weapon_proficiencies: string[]
  armor_proficiencies: string[]
  subclasses: Subclass[]
}

export interface SelectedSpell {
  slug: string
  name: string
  level: number
  school: string
  casting_time: string
  range: string
  components: string
}

export interface Spell {
  slug: string
  name: string
  level_int: number
  school: string
  casting_time: string
  range: string
  components: string
  extended?: boolean
  book?: string
}

export interface CharacterInput {
  race: string
  class: string
  level: number
  abilities: AbilityScores
  background: string
  armor: string
  shield: boolean
}

export interface CharacterDraft {
  name: string
  race: string
  class: string
  subclass: string
  level: number
  background: string
  edition: '5e' | '5.5e'
  alignment: string
  skills: string[]
  abilities: AbilityScores
  playerName: string
  createdAt: string | null
  gold: number
  languages: string[]
  equipment: string[]
  weapons: string[]
  armor: string
  shield: boolean
  spells: SelectedSpell[]
  trait: string
  ideal: string
  bond: string
  flaw: string
  savedId: string | null
}

export interface CharacterSheet {
  input: CharacterDraft
  modifiers: Record<AbilityName, number>
  max_hp: number
  armor_class: number
  initiative: number
  proficiency_bonus: number
}

export interface SavedEntry {
  id: string
  savedAt: string
  draft: CharacterDraft
  sheet: CharacterSheet | null
}

export interface Weapon {
  id: string
  name: string
  category: WeaponCategory
  damage: string
  damageType: string
  ranged: boolean
  finesse: boolean
}

export interface ArmorItem {
  id: string
  name: string
  type: 'light' | 'medium' | 'heavy'
  base: number
  proficiency: 'light' | 'medium' | 'heavy'
}

export interface SkillEntry {
  name: string
  ability: AbilityName
  key: string
}

export interface GoldRoll {
  count: number
  die: number
  multiplier: number
  label: string
}
