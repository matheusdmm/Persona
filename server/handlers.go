package main

import (
	"net/http"

	"github.com/labstack/echo/v5"
)

func racesHandler(c *echo.Context) error {
	return c.JSON(http.StatusOK, races)
}

func classesHandler(c *echo.Context) error {
	return c.JSON(http.StatusOK, classes)
}

func armorHandler(c *echo.Context) error {
	return c.JSON(http.StatusOK, armors)
}

func calculateHandler(c *echo.Context) error {
	var input CharacterInput
	if err := c.Bind(&input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid input")
	}
	if input.Race == "" || input.Class == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "race and class are required")
	}
	for _, score := range []int{
		input.Abilities.Strength, input.Abilities.Dexterity, input.Abilities.Constitution,
		input.Abilities.Intelligence, input.Abilities.Wisdom, input.Abilities.Charisma,
	} {
		if score < 1 || score > 20 {
			return echo.NewHTTPError(http.StatusBadRequest, "ability scores must be between 1 and 20")
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
			armorClass = entry.base + min(mods.Dexterity, 2)
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

	return c.JSON(http.StatusOK, CharacterSheet{
		Input:            input,
		Modifiers:        mods,
		ProficiencyBonus: proficiencyBonus(input.Level),
		MaxHP:            maxHP,
		Initiative:       mods.Dexterity,
		ArmorClass:       armorClass,
	})
}
