package handler

import (
	"encoding/json"
	"math"
	"net/http"
)

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
	Armor      string        `json:"armor"`
	Shield     bool          `json:"shield"`
}

type CharacterSheet struct {
	Input            CharacterInput `json:"input"`
	Modifiers        AbilityScores  `json:"modifiers"`
	ProficiencyBonus int            `json:"proficiency_bonus"`
	MaxHP            int            `json:"max_hp"`
	Initiative       int            `json:"initiative"`
	ArmorClass       int            `json:"armor_class"`
}

type armorEntry struct {
	armorType string
	base      int
}

// armorData mirrors armor.ts on the frontend; kept inline for the same reason as raceAbilityBonuses.
var armorData = map[string]armorEntry{
	"padded":      {"light", 11},
	"leather":     {"light", 11},
	"studded":     {"light", 12},
	"hide":        {"medium", 12},
	"chain_shirt": {"medium", 13},
	"scale_mail":  {"medium", 14},
	"breastplate": {"medium", 14},
	"half_plate":  {"medium", 15},
	"ring_mail":   {"heavy", 14},
	"chain_mail":  {"heavy", 16},
	"splint":      {"heavy", 17},
	"plate":       {"heavy", 18},
}

// raceAbilityBonuses mirrors the data in races.go; kept inline because Vercel
// compiles each handler file independently and cannot share .go files.
var raceAbilityBonuses = map[string]map[string]int{
	"human":      {"strength": 1, "dexterity": 1, "constitution": 1, "intelligence": 1, "wisdom": 1, "charisma": 1},
	"elf":        {"dexterity": 2},
	"dwarf":      {"constitution": 2},
	"halfling":   {"dexterity": 2},
	"dragonborn": {"strength": 2, "charisma": 1},
	"gnome":      {"intelligence": 2},
	"half-elf":   {"charisma": 2},
	"tiefling":   {"charisma": 2, "intelligence": 1},
}

func applyRaceBonuses(abilities *AbilityScores, race string) {
	bonuses := raceAbilityBonuses[race]
	abilities.Strength += bonuses["strength"]
	abilities.Dexterity += bonuses["dexterity"]
	abilities.Constitution += bonuses["constitution"]
	abilities.Intelligence += bonuses["intelligence"]
	abilities.Wisdom += bonuses["wisdom"]
	abilities.Charisma += bonuses["charisma"]
}

func modifier(score int) int {
	return int(math.Floor(float64(score-10) / 2.0))
}

func proficiencyBonus(level int) int {
	return (level-1)/4 + 2
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
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
			http.Error(w, "ability scores must be between 3 and 20", http.StatusBadRequest)
			return
		}
	}

	if input.Level < 1 {
		input.Level = 1
	}
	if input.Level > 20 {
		input.Level = 20
	}

	applyRaceBonuses(&input.Abilities, input.Race)

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
	// floor(hitDie/2)+1 is the average roll on a hit die, used for levels 2+
	maxHP := hitDie + mods.Constitution + (input.Level-1)*(hitDie/2+1+mods.Constitution)

	var armorClass int
	if entry, ok := armorData[input.Armor]; ok {
		switch entry.armorType {
		case "light":
			armorClass = entry.base + mods.Dexterity
		case "medium":
			dexCap := mods.Dexterity
			if dexCap > 2 {
				dexCap = 2
			}
			armorClass = entry.base + dexCap
		case "heavy":
			armorClass = entry.base
		}
	} else {
		// Unarmored — Barbarian and Monk get special formulas
		switch input.Class {
		case "barbarian":
			armorClass = 10 + mods.Dexterity + mods.Constitution
		case "monk":
			armorClass = 10 + mods.Dexterity + mods.Wisdom
		default:
			armorClass = 10 + mods.Dexterity
		}
	}
	if input.Shield {
		armorClass += 2
	}

	sheet := CharacterSheet{
		Input:            input,
		Modifiers:        mods,
		ProficiencyBonus: proficiencyBonus(input.Level),
		MaxHP:            maxHP,
		Initiative:       mods.Dexterity,
		ArmorClass:       armorClass,
	}

	_ = json.NewEncoder(w).Encode(sheet)
}
