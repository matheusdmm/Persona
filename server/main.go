package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

// ── Types ─────────────────────────────────────────────────────────────────────

type AbilityBonus struct {
	Ability string `json:"ability"`
	Bonus   int    `json:"bonus"`
}

type Trait struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Race struct {
	ID             string         `json:"id"`
	Name           string         `json:"name"`
	Edition        string         `json:"edition"`
	Speed          int            `json:"speed"`
	Size           string         `json:"size"`
	Traits         []Trait        `json:"traits"`
	AbilityBonuses []AbilityBonus `json:"ability_bonuses"`
}

type Class struct {
	ID                  string   `json:"id"`
	Name                string   `json:"name"`
	Edition             string   `json:"edition"`
	HitDie              int      `json:"hit_die"`
	PrimaryAbility      string   `json:"primary_ability"`
	SavingThrows        []string `json:"saving_throws"`
	SkillChoices        int      `json:"skill_choices"`
	AvailableSkills     []string `json:"available_skills"`
	ArmorProficiencies  []string `json:"armor_proficiencies"`
	WeaponProficiencies []string `json:"weapon_proficiencies"`
}

type AbilityScores struct {
	Strength     int `json:"strength"`
	Dexterity    int `json:"dexterity"`
	Constitution int `json:"constitution"`
	Intelligence int `json:"intelligence"`
	Wisdom       int `json:"wisdom"`
	Charisma     int `json:"charisma"`
}

type CharacterInput struct {
	Race       string        `json:"race"`
	Class      string        `json:"class"`
	Level      int           `json:"level"`
	Abilities  AbilityScores `json:"abilities"`
	Background string        `json:"background"`
}

type CharacterSheet struct {
	Input            CharacterInput `json:"input"`
	Modifiers        AbilityScores  `json:"modifiers"`
	ProficiencyBonus int            `json:"proficiency_bonus"`
	MaxHP            int            `json:"max_hp"`
	Initiative       int            `json:"initiative"`
	ArmorClass       int            `json:"armor_class"`
}

// ── Data ──────────────────────────────────────────────────────────────────────

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
	},
	{
		ID: "bard", Name: "Bard", Edition: "both", HitDie: 8,
		PrimaryAbility: "charisma", SavingThrows: []string{"dexterity", "charisma"},
		SkillChoices: 3, AvailableSkills: []string{"any"},
		ArmorProficiencies: []string{"light"}, WeaponProficiencies: []string{"simple", "hand_crossbow", "longsword", "rapier", "shortsword"},
	},
	{
		ID: "cleric", Name: "Cleric", Edition: "both", HitDie: 8,
		PrimaryAbility: "wisdom", SavingThrows: []string{"wisdom", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"history", "insight", "medicine", "persuasion", "religion"},
		ArmorProficiencies: []string{"light", "medium", "shields"}, WeaponProficiencies: []string{"simple"},
	},
	{
		ID: "druid", Name: "Druid", Edition: "both", HitDie: 8,
		PrimaryAbility: "wisdom", SavingThrows: []string{"intelligence", "wisdom"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "animal_handling", "insight", "medicine", "nature", "perception", "religion", "survival"},
		ArmorProficiencies: []string{"light", "medium", "shields_non_metal"}, WeaponProficiencies: []string{"clubs", "daggers", "darts", "javelins", "maces", "quarterstaffs", "scimitars", "sickles", "slings", "spears"},
	},
	{
		ID: "fighter", Name: "Fighter", Edition: "both", HitDie: 10,
		PrimaryAbility: "strength", SavingThrows: []string{"strength", "constitution"},
		SkillChoices: 2, AvailableSkills: []string{"acrobatics", "animal_handling", "athletics", "history", "insight", "intimidation", "perception", "survival"},
		ArmorProficiencies: []string{"all", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
	},
	{
		ID: "monk", Name: "Monk", Edition: "both", HitDie: 8,
		PrimaryAbility: "dexterity", SavingThrows: []string{"strength", "dexterity"},
		SkillChoices: 2, AvailableSkills: []string{"acrobatics", "athletics", "history", "insight", "religion", "stealth"},
		ArmorProficiencies: []string{}, WeaponProficiencies: []string{"simple", "shortswords"},
	},
	{
		ID: "paladin", Name: "Paladin", Edition: "both", HitDie: 10,
		PrimaryAbility: "strength", SavingThrows: []string{"wisdom", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"athletics", "insight", "intimidation", "medicine", "persuasion", "religion"},
		ArmorProficiencies: []string{"all", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
	},
	{
		ID: "ranger", Name: "Ranger", Edition: "both", HitDie: 10,
		PrimaryAbility: "dexterity", SavingThrows: []string{"strength", "dexterity"},
		SkillChoices: 3, AvailableSkills: []string{"animal_handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"},
		ArmorProficiencies: []string{"light", "medium", "shields"}, WeaponProficiencies: []string{"simple", "martial"},
	},
	{
		ID: "rogue", Name: "Rogue", Edition: "both", HitDie: 8,
		PrimaryAbility: "dexterity", SavingThrows: []string{"dexterity", "intelligence"},
		SkillChoices: 4, AvailableSkills: []string{"acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleight_of_hand", "stealth"},
		ArmorProficiencies: []string{"light"}, WeaponProficiencies: []string{"simple", "hand_crossbow", "longsword", "rapier", "shortsword"},
	},
	{
		ID: "sorcerer", Name: "Sorcerer", Edition: "both", HitDie: 6,
		PrimaryAbility: "charisma", SavingThrows: []string{"constitution", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "deception", "insight", "intimidation", "persuasion", "religion"},
		ArmorProficiencies: []string{}, WeaponProficiencies: []string{"daggers", "darts", "slings", "quarterstaffs", "light_crossbows"},
	},
	{
		ID: "warlock", Name: "Warlock", Edition: "both", HitDie: 8,
		PrimaryAbility: "charisma", SavingThrows: []string{"wisdom", "charisma"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"},
		ArmorProficiencies: []string{"light"}, WeaponProficiencies: []string{"simple"},
	},
	{
		ID: "wizard", Name: "Wizard", Edition: "both", HitDie: 6,
		PrimaryAbility: "intelligence", SavingThrows: []string{"intelligence", "wisdom"},
		SkillChoices: 2, AvailableSkills: []string{"arcana", "history", "insight", "investigation", "medicine", "religion"},
		ArmorProficiencies: []string{}, WeaponProficiencies: []string{"daggers", "darts", "slings", "quarterstaffs", "light_crossbows"},
	},
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func modifier(score int) int {
	return (score - 10) / 2
}

func proficiencyBonus(level int) int {
	return (level-1)/4 + 2
}

func cors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}

// ── Handlers ──────────────────────────────────────────────────────────────────

func racesHandler(w http.ResponseWriter, r *http.Request) {
	cors(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	writeJSON(w, races)
}

func classesHandler(w http.ResponseWriter, r *http.Request) {
	cors(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	writeJSON(w, classes)
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
	cors(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	var input CharacterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid input", http.StatusBadRequest)
		return
	}
	if input.Race == "" || input.Class == "" {
		http.Error(w, "race and class are required", http.StatusBadRequest)
		return
	}
	for _, score := range []int{
		input.Abilities.Strength, input.Abilities.Dexterity, input.Abilities.Constitution,
		input.Abilities.Intelligence, input.Abilities.Wisdom, input.Abilities.Charisma,
	} {
		if score < 1 || score > 20 {
			http.Error(w, "ability scores must be between 1 and 20", http.StatusBadRequest)
			return
		}
	}
	if input.Level < 1 {
		input.Level = 1
	}
	if input.Level > 20 {
		input.Level = 20
	}

	mods := AbilityScores{
		Strength:     modifier(input.Abilities.Strength),
		Dexterity:    modifier(input.Abilities.Dexterity),
		Constitution: modifier(input.Abilities.Constitution),
		Intelligence: modifier(input.Abilities.Intelligence),
		Wisdom:       modifier(input.Abilities.Wisdom),
		Charisma:     modifier(input.Abilities.Charisma),
	}

	hitDieByClass := map[string]int{
		"barbarian": 12, "fighter": 10, "paladin": 10, "ranger": 10,
		"bard": 8, "cleric": 8, "druid": 8, "monk": 8, "rogue": 8, "warlock": 8,
		"sorcerer": 6, "wizard": 6,
	}
	hitDie := hitDieByClass[input.Class]
	if hitDie == 0 {
		hitDie = 8
	}
	maxHP := hitDie + mods.Constitution + (input.Level-1)*(hitDie/2+1+mods.Constitution)

	writeJSON(w, CharacterSheet{
		Input:            input,
		Modifiers:        mods,
		ProficiencyBonus: proficiencyBonus(input.Level),
		MaxHP:            maxHP,
		Initiative:       mods.Dexterity,
		ArmorClass:       10 + mods.Dexterity,
	})
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/races", racesHandler)
	mux.HandleFunc("/api/classes", classesHandler)
	mux.HandleFunc("/api/calculate", calculateHandler)

	log.Printf("backend listening on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
