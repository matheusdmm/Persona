package handler

import (
	"encoding/json"
	"net/http"
)

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

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	_ = json.NewEncoder(w).Encode(classes)
}
