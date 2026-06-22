export type CategoryKey = 'backgrounds' | 'species' | 'classes' | 'spells' | 'items'

export interface RawEntry {
  name: string
  publisher: string
  book: string
  description?: string
  properties?: Record<string, unknown>
}

export interface ExtendedSpell {
  slug: string
  name: string
  level_int: number
  school: string
  casting_time: string
  range: string
  components: string
  book: string
  extended: true
}

export interface ExtendedItem {
  name: string
  description: string
  book: string
  damage: string | null
  damageType: string | null
  category: string | null
  weaponProps: string | null
  cost: string | null
  weight: string | null
  armorClass: string | null
  armorType: string | null
}
