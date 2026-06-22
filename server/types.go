package main

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

type Subclass struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Edition     string `json:"edition"`
	LevelGained int    `json:"level_gained"`
	Description string `json:"description"`
}

type Class struct {
	ID                  string     `json:"id"`
	Name                string     `json:"name"`
	Edition             string     `json:"edition"`
	HitDie              int        `json:"hit_die"`
	PrimaryAbility      string     `json:"primary_ability"`
	SavingThrows        []string   `json:"saving_throws"`
	SkillChoices        int        `json:"skill_choices"`
	AvailableSkills     []string   `json:"available_skills"`
	ArmorProficiencies  []string   `json:"armor_proficiencies"`
	WeaponProficiencies []string   `json:"weapon_proficiencies"`
	Subclasses          []Subclass `json:"subclasses"`
}

type Armor struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Base        int    `json:"base"`
	Proficiency string `json:"proficiency"`
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
