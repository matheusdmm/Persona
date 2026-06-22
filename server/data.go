package main

var races = []Race{
	{
		ID: "human", Name: "Human", Edition: "both", Speed: 30, Size: "Medium",
		AbilityBonuses: []AbilityBonus{
			{Ability: "strength", Bonus: 1}, {Ability: "dexterity", Bonus: 1},
			{Ability: "constitution", Bonus: 1}, {Ability: "intelligence", Bonus: 1},
			{Ability: "wisdom", Bonus: 1}, {Ability: "charisma", Bonus: 1},
		},
		Traits: []Trait{
			{Name: "Extra Language", Description: "You can speak, read, and write one extra language."},
		},
	},
	{
		ID: "elf", Name: "Elf", Edition: "both", Speed: 30, Size: "Medium",
		AbilityBonuses: []AbilityBonus{{Ability: "dexterity", Bonus: 2}},
		Traits: []Trait{
			{Name: "Darkvision", Description: "60 ft."},
			{Name: "Fey Ancestry", Description: "Advantage on saves against charm. Can't be put to sleep by magic."},
			{Name: "Trance", Description: "Elves don't need to sleep. Instead, they meditate deeply for 4 hours a day."},
		},
	},
	{
		ID: "dwarf", Name: "Dwarf", Edition: "both", Speed: 25, Size: "Medium",
		AbilityBonuses: []AbilityBonus{{Ability: "constitution", Bonus: 2}},
		Traits: []Trait{
			{Name: "Darkvision", Description: "60 ft."},
			{Name: "Dwarven Resilience", Description: "Advantage on saving throws against poison."},
			{Name: "Stonecunning", Description: "Proficiency in History checks related to stonework."},
		},
	},
	{
		ID: "halfling", Name: "Halfling", Edition: "both", Speed: 25, Size: "Small",
		AbilityBonuses: []AbilityBonus{{Ability: "dexterity", Bonus: 2}},
		Traits: []Trait{
			{Name: "Lucky", Description: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die."},
			{Name: "Brave", Description: "Advantage on saving throws against being frightened."},
			{Name: "Halfling Nimbleness", Description: "You can move through the space of any creature that is of a size larger than yours."},
		},
	},
	{
		ID: "dragonborn", Name: "Dragonborn", Edition: "both", Speed: 30, Size: "Medium",
		AbilityBonuses: []AbilityBonus{{Ability: "strength", Bonus: 2}, {Ability: "charisma", Bonus: 1}},
		Traits: []Trait{
			{Name: "Draconic Ancestry", Description: "You have draconic ancestry. Choose one dragon type."},
			{Name: "Breath Weapon", Description: "Exhale destructive energy as an action."},
			{Name: "Damage Resistance", Description: "Resistance to the damage type associated with your draconic ancestry."},
		},
	},
	{
		ID: "gnome", Name: "Gnome", Edition: "both", Speed: 25, Size: "Small",
		AbilityBonuses: []AbilityBonus{{Ability: "intelligence", Bonus: 2}},
		Traits: []Trait{
			{Name: "Darkvision", Description: "60 ft."},
			{Name: "Gnome Cunning", Description: "Advantage on Intelligence, Wisdom, and Charisma saving throws against magic."},
		},
	},
	{
		ID: "half-elf", Name: "Half-Elf", Edition: "5e", Speed: 30, Size: "Medium",
		AbilityBonuses: []AbilityBonus{{Ability: "charisma", Bonus: 2}},
		Traits: []Trait{
			{Name: "Darkvision", Description: "60 ft."},
			{Name: "Fey Ancestry", Description: "Advantage on saves against charm. Can't be put to sleep by magic."},
			{Name: "Skill Versatility", Description: "Proficiency in two skills of your choice."},
		},
	},
	{
		ID: "tiefling", Name: "Tiefling", Edition: "both", Speed: 30, Size: "Medium",
		AbilityBonuses: []AbilityBonus{{Ability: "charisma", Bonus: 2}, {Ability: "intelligence", Bonus: 1}},
		Traits: []Trait{
			{Name: "Darkvision", Description: "60 ft."},
			{Name: "Hellish Resistance", Description: "Resistance to fire damage."},
			{Name: "Infernal Legacy", Description: "You know the Thaumaturgy cantrip."},
		},
	},
}

var classes = []Class{
	{
		ID: "barbarian", Name: "Barbarian", Edition: "both", HitDie: 12,
		PrimaryAbility: "strength", SavingThrows: []string{"strength", "constitution"},
		SkillChoices: 2, AvailableSkills: []string{"animal_handling", "athletics", "intimidation", "nature", "perception", "survival"},
		ArmorProficiencies: []string{"light", "medium", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
		Subclasses: []Subclass{
			{ID: "berserker", Name: "Path of the Berserker", Edition: "5e", LevelGained: 3,
				Description: "Channel your rage into a frenzied bloodlust, making bonus attacks at the cost of exhaustion after battle."},
			{ID: "totem_warrior", Name: "Path of the Totem Warrior", Edition: "5e", LevelGained: 3,
				Description: "Draw power from a spirit animal totem — bear, eagle, or wolf — gaining supernatural abilities tied to its nature."},
		},
	},
	{
		ID: "bard", Name: "Bard", Edition: "both", HitDie: 8,
		PrimaryAbility: "charisma", SavingThrows: []string{"dexterity", "charisma"},
		SkillChoices: 3, AvailableSkills: []string{"any"},
		ArmorProficiencies: []string{"light"}, WeaponProficiencies: []string{"simple", "hand_crossbow", "longsword", "rapier", "shortsword"},
		Subclasses: []Subclass{
			{ID: "lore", Name: "College of Lore", Edition: "5e", LevelGained: 3,
				Description: "Plumb the depths of magical knowledge, cutting down foes with Cutting Words and unlocking bonus magical secrets."},
			{ID: "valor", Name: "College of Valor", Edition: "5e", LevelGained: 3,
				Description: "Inspire allies on the front lines — gain martial weapon and medium armor proficiency and eventually grant allies extra attacks."},
		},
	},
	{
		ID: "cleric", Name: "Cleric", Edition: "both", HitDie: 8,
		PrimaryAbility: "wisdom", SavingThrows: []string{"wisdom", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"history", "insight", "medicine", "persuasion", "religion"},
		ArmorProficiencies: []string{"light", "medium", "shields"}, WeaponProficiencies: []string{"simple"},
		Subclasses: []Subclass{
			{ID: "knowledge", Name: "Knowledge Domain", Edition: "5e", LevelGained: 1,
				Description: "Deities of knowledge grant mastery over lore and arcane secrets, adding Intelligence-based skills and spells of divination."},
			{ID: "life", Name: "Life Domain", Edition: "5e", LevelGained: 1,
				Description: "Channel the positive energy of life itself — enhanced healing spells and heavy armor proficiency from the very first level."},
			{ID: "light", Name: "Light Domain", Edition: "5e", LevelGained: 1,
				Description: "Wield radiant fire and blinding flashes of light, fueled by deities of sun and beauty."},
			{ID: "nature", Name: "Nature Domain", Edition: "5e", LevelGained: 1,
				Description: "Serve deities of nature and gain druid cantrips, heavy armor proficiency, and power over animals and plants."},
			{ID: "tempest", Name: "Tempest Domain", Edition: "5e", LevelGained: 1,
				Description: "Command storms, thunder, and lightning — heavy armor proficiency and the ability to maximize thunder damage."},
			{ID: "trickery", Name: "Trickery Domain", Edition: "5e", LevelGained: 1,
				Description: "Deities of trickery grant illusions, duplicates, and the ability to grant allies Uncanny Dodge."},
			{ID: "war", Name: "War Domain", Edition: "5e", LevelGained: 1,
				Description: "Devoted to gods of conflict — gain martial weapon and heavy armor proficiency and fuel combat with War Priest bonus attacks."},
		},
	},
	{
		ID: "druid", Name: "Druid", Edition: "both", HitDie: 8,
		PrimaryAbility: "wisdom", SavingThrows: []string{"intelligence", "wisdom"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "animal_handling", "insight", "medicine", "nature", "perception", "religion", "survival"},
		ArmorProficiencies: []string{"light", "medium", "shields_non_metal"}, WeaponProficiencies: []string{"clubs", "daggers", "darts", "javelins", "maces", "quarterstaffs", "scimitars", "sickles", "slings", "spears"},
		Subclasses: []Subclass{
			{ID: "land", Name: "Circle of the Land", Edition: "5e", LevelGained: 2,
				Description: "Connected to a specific terrain — arctic, coast, desert, forest, grassland, mountain, swamp, or Underdark — gaining terrain-themed bonus spells."},
			{ID: "moon", Name: "Circle of the Moon", Edition: "5e", LevelGained: 2,
				Description: "Wild Shape into powerful beasts including CR 1 forms at level 2, and later elementals — making you a formidable frontline shapeshifter."},
		},
	},
	{
		ID: "fighter", Name: "Fighter", Edition: "both", HitDie: 10,
		PrimaryAbility: "strength", SavingThrows: []string{"strength", "constitution"},
		SkillChoices: 2, AvailableSkills: []string{"acrobatics", "animal_handling", "athletics", "history", "insight", "intimidation", "perception", "survival"},
		ArmorProficiencies: []string{"all", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
		Subclasses: []Subclass{
			{ID: "champion", Name: "Champion", Edition: "5e", LevelGained: 3,
				Description: "Maximize physical prowess — an expanded critical hit range, athletic proficiency, and additional fighting styles."},
			{ID: "battle_master", Name: "Battle Master", Edition: "5e", LevelGained: 3,
				Description: "Employ precise combat maneuvers fueled by superiority dice — trip, disarm, redirect, and inspire allies with tactical precision."},
			{ID: "eldritch_knight", Name: "Eldritch Knight", Edition: "5e", LevelGained: 3,
				Description: "Blend martial skill with arcane study, learning abjuration and evocation spells and eventually bonding a weapon to your hand."},
		},
	},
	{
		ID: "monk", Name: "Monk", Edition: "both", HitDie: 8,
		PrimaryAbility: "dexterity", SavingThrows: []string{"strength", "dexterity"},
		SkillChoices: 2, AvailableSkills: []string{"acrobatics", "athletics", "history", "insight", "religion", "stealth"},
		ArmorProficiencies: []string{}, WeaponProficiencies: []string{"simple", "shortswords"},
		Subclasses: []Subclass{
			{ID: "open_hand", Name: "Way of the Open Hand", Edition: "5e", LevelGained: 3,
				Description: "Master unarmed combat — knock foes prone, push them back, or deny their reactions with Flurry of Blows techniques."},
			{ID: "shadow", Name: "Way of Shadow", Edition: "5e", LevelGained: 3,
				Description: "Operate in the darkness like a ninja — teleport between shadows, silence areas, and turn invisible in dim light."},
			{ID: "four_elements", Name: "Way of the Four Elements", Edition: "5e", LevelGained: 3,
				Description: "Harness elemental power through ki, hurling waves of fire, walls of water, and blasts of air or earth."},
		},
	},
	{
		ID: "paladin", Name: "Paladin", Edition: "both", HitDie: 10,
		PrimaryAbility: "strength", SavingThrows: []string{"wisdom", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"athletics", "insight", "intimidation", "medicine", "persuasion", "religion"},
		ArmorProficiencies: []string{"all", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
		Subclasses: []Subclass{
			{ID: "devotion", Name: "Oath of Devotion", Edition: "5e", LevelGained: 3,
				Description: "The classic paladin — sacred weapon, holy nimbus, and spells of protection and compulsion in service of law and good."},
			{ID: "ancients", Name: "Oath of the Ancients", Edition: "5e", LevelGained: 3,
				Description: "Side with the light of nature and fey magic, gaining resistance to spells and enchantment-themed oaths."},
			{ID: "vengeance", Name: "Oath of Vengeance", Edition: "5e", LevelGained: 3,
				Description: "Hunt down the wicked — Vow of Enmity grants advantage against a foe, and spells like Hold Person and Misty Step fuel relentless pursuit."},
		},
	},
	{
		ID: "ranger", Name: "Ranger", Edition: "both", HitDie: 10,
		PrimaryAbility: "dexterity", SavingThrows: []string{"strength", "dexterity"},
		SkillChoices: 3, AvailableSkills: []string{"animal_handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"},
		ArmorProficiencies: []string{"light", "medium", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
		Subclasses: []Subclass{
			{ID: "hunter", Name: "Hunter", Edition: "5e", LevelGained: 3,
				Description: "Specialize in hunting prey — choose from Colossus Slayer, Giant Killer, or Horde Breaker to define your combat approach."},
			{ID: "beast_master", Name: "Beast Master", Edition: "5e", LevelGained: 3,
				Description: "Form a bond with an animal companion that fights alongside you, sharing your actions to overwhelm enemies."},
		},
	},
	{
		ID: "rogue", Name: "Rogue", Edition: "both", HitDie: 8,
		PrimaryAbility: "dexterity", SavingThrows: []string{"dexterity", "intelligence"},
		SkillChoices: 4, AvailableSkills: []string{"acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleight_of_hand", "stealth"},
		ArmorProficiencies: []string{"light"}, WeaponProficiencies: []string{"simple", "hand_crossbow", "longsword", "rapier", "shortsword"},
		Subclasses: []Subclass{
			{ID: "thief", Name: "Thief", Edition: "5e", LevelGained: 3,
				Description: "Fast Hands and Second-Story Work make you the ultimate burglar — nimble climber, item user, and ambush specialist."},
			{ID: "assassin", Name: "Assassin", Edition: "5e", LevelGained: 3,
				Description: "Strike first and strike hard — bonus proficiencies in disguise and poison, and automatic crits against surprised foes."},
			{ID: "arcane_trickster", Name: "Arcane Trickster", Edition: "5e", LevelGained: 3,
				Description: "Augment roguery with illusion and enchantment spells — Mage Hand Legerdemain lets you pick locks and pilfer items from a distance."},
		},
	},
	{
		ID: "sorcerer", Name: "Sorcerer", Edition: "both", HitDie: 6,
		PrimaryAbility: "charisma", SavingThrows: []string{"constitution", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "deception", "insight", "intimidation", "persuasion", "religion"},
		ArmorProficiencies: []string{}, WeaponProficiencies: []string{"daggers", "darts", "slings", "quarterstaffs", "light_crossbows"},
		Subclasses: []Subclass{
			{ID: "draconic_bloodline", Name: "Draconic Bloodline", Edition: "5e", LevelGained: 1,
				Description: "Trace your magic to a dragon ancestor — natural armor (AC 13 + DEX), bonus HP, and a damage affinity tied to your dragon's color."},
			{ID: "wild_magic", Name: "Wild Magic", Edition: "5e", LevelGained: 1,
				Description: "Your magic is unstable and unpredictable — Wild Magic Surges and Tides of Chaos make every spell a potential chaos event."},
		},
	},
	{
		ID: "warlock", Name: "Warlock", Edition: "both", HitDie: 8,
		PrimaryAbility: "charisma", SavingThrows: []string{"wisdom", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"},
		ArmorProficiencies: []string{"light"}, WeaponProficiencies: []string{"simple"},
		Subclasses: []Subclass{
			{ID: "archfey", Name: "The Archfey", Edition: "5e", LevelGained: 1,
				Description: "Bound to a powerful fey lord — Fey Presence lets you charm or frighten all nearby creatures, and Misty Escape lets you vanish when struck."},
			{ID: "fiend", Name: "The Fiend", Edition: "5e", LevelGained: 1,
				Description: "Pact with a devil or demon — Dark One's Blessing grants temporary HP on kills, and your expanded list includes devastating fire spells."},
			{ID: "great_old_one", Name: "The Great Old One", Edition: "5e", LevelGained: 1,
				Description: "Touched by an alien intelligence beyond comprehension — telepathy, mind-reading, and an expanded list of psychic and detection spells."},
		},
	},
	{
		ID: "wizard", Name: "Wizard", Edition: "both", HitDie: 6,
		PrimaryAbility: "intelligence", SavingThrows: []string{"intelligence", "wisdom"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "history", "insight", "investigation", "medicine", "religion"},
		ArmorProficiencies: []string{}, WeaponProficiencies: []string{"daggers", "darts", "slings", "quarterstaffs", "light_crossbows"},
		Subclasses: []Subclass{
			{ID: "abjuration", Name: "School of Abjuration", Edition: "5e", LevelGained: 2,
				Description: "Specialize in protective magic — an Arcane Ward absorbs damage for you, and you can interpose it to shield allies."},
			{ID: "conjuration", Name: "School of Conjuration", Edition: "5e", LevelGained: 2,
				Description: "Master the art of summoning — teleport objects and creatures, and eventually create permanent minor objects from nothing."},
			{ID: "divination", Name: "School of Divination", Edition: "5e", LevelGained: 2,
				Description: "See what others cannot — Portent lets you roll two dice each day and replace any roll in the game with those results."},
			{ID: "enchantment", Name: "School of Enchantment", Edition: "5e", LevelGained: 2,
				Description: "Bend minds to your will — Hypnotic Gaze incapacitates a creature each turn, and Instinctive Charm redirects attacks to other targets."},
			{ID: "evocation", Name: "School of Evocation", Edition: "5e", LevelGained: 2,
				Description: "Shape destruction to spare allies — Sculpt Spells lets you exclude friends from fireball and other area effects."},
			{ID: "illusion", Name: "School of Illusion", Edition: "5e", LevelGained: 2,
				Description: "Weave false realities — Improved Minor Illusion and Malleable Illusions let you craft and reshape deceptions on the fly."},
			{ID: "necromancy", Name: "School of Necromancy", Edition: "5e", LevelGained: 2,
				Description: "Harvest life energy and command the dead — Grim Harvest restores HP when you kill with spells, and undead you raise are stronger."},
			{ID: "transmutation", Name: "School of Transmutation", Edition: "5e", LevelGained: 2,
				Description: "Reshape matter and form — a Transmuter's Stone grants ongoing benefits, and you can eventually transform creatures or turn lead to gold."},
		},
	},
}

var armors = []Armor{
	{ID: "padded", Name: "Padded", Type: "light", Base: 11, Proficiency: "light"},
	{ID: "leather", Name: "Leather", Type: "light", Base: 11, Proficiency: "light"},
	{ID: "studded", Name: "Studded Leather", Type: "light", Base: 12, Proficiency: "light"},
	{ID: "hide", Name: "Hide", Type: "medium", Base: 12, Proficiency: "medium"},
	{ID: "chain_shirt", Name: "Chain Shirt", Type: "medium", Base: 13, Proficiency: "medium"},
	{ID: "scale_mail", Name: "Scale Mail", Type: "medium", Base: 14, Proficiency: "medium"},
	{ID: "breastplate", Name: "Breastplate", Type: "medium", Base: 14, Proficiency: "medium"},
	{ID: "half_plate", Name: "Half Plate", Type: "medium", Base: 15, Proficiency: "medium"},
	{ID: "ring_mail", Name: "Ring Mail", Type: "heavy", Base: 14, Proficiency: "heavy"},
	{ID: "chain_mail", Name: "Chain Mail", Type: "heavy", Base: 16, Proficiency: "heavy"},
	{ID: "splint", Name: "Splint", Type: "heavy", Base: 17, Proficiency: "heavy"},
	{ID: "plate", Name: "Plate", Type: "heavy", Base: 18, Proficiency: "heavy"},
}

// armorData, raceAbilityBonuses, and hitDieByClass are lookup-friendly views
// derived from armors/races/classes above, so AC/HP calculation can never drift
// out of sync with the content lists.
var armorData = buildArmorData()

var raceAbilityBonuses = buildRaceAbilityBonuses()

var hitDieByClass = buildHitDieByClass()

func buildArmorData() map[string]armorEntry {
	m := make(map[string]armorEntry, len(armors))
	for _, a := range armors {
		m[a.ID] = armorEntry{armorType: a.Type, base: a.Base}
	}
	return m
}

func buildRaceAbilityBonuses() map[string]map[string]int {
	m := make(map[string]map[string]int, len(races))
	for _, r := range races {
		bonuses := make(map[string]int, len(r.AbilityBonuses))
		for _, b := range r.AbilityBonuses {
			bonuses[b.Ability] = b.Bonus
		}
		m[r.ID] = bonuses
	}
	return m
}

func buildHitDieByClass() map[string]int {
	m := make(map[string]int, len(classes))
	for _, c := range classes {
		m[c.ID] = c.HitDie
	}
	return m
}
