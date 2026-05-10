package handler

import (
	"encoding/json"
	"net/http"
)

type Race struct {
	ID             string        `json:"id"`
	Name           string        `json:"name"`
	Edition        string        `json:"edition"`
	Speed          int           `json:"speed"`
	Size           string        `json:"size"`
	Traits         []Trait       `json:"traits"`
	AbilityBonuses []AbilityBonus `json:"ability_bonuses"`
}

type AbilityBonus struct {
	Ability string `json:"ability"`
	Bonus   int    `json:"bonus"`
}

type Trait struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

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

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	_ = json.NewEncoder(w).Encode(races)
}
