package handler

import (
	"encoding/json"
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
}

type CharacterSheet struct {
	Input            CharacterInput `json:"input"`
	Modifiers        AbilityScores  `json:"modifiers"`
	ProficiencyBonus int            `json:"proficiency_bonus"`
	MaxHP            int            `json:"max_hp"`
	Initiative       int            `json:"initiative"`
	ArmorClass       int            `json:"armor_class"`
}

func modifier(score int) int {
	return (score - 10) / 2
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

	sheet := CharacterSheet{
		Input:            input,
		Modifiers:        mods,
		ProficiencyBonus: proficiencyBonus(input.Level),
		MaxHP:            maxHP,
		Initiative:       mods.Dexterity,
		ArmorClass:       10 + mods.Dexterity,
	}

	_ = json.NewEncoder(w).Encode(sheet)
}
