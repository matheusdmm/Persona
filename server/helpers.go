package main

import (
	"math"
	"strconv"
	"time"

	"github.com/labstack/echo/v5"
)

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

// cacheControl lets browsers/CDNs cache responses that never change at runtime
// (races, classes, armor), avoiding a refetch on every page load.
func cacheControl(maxAge time.Duration) echo.MiddlewareFunc {
	value := "public, max-age=" + strconv.Itoa(int(maxAge.Seconds()))
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			c.Response().Header().Set(echo.HeaderCacheControl, value)
			return next(c)
		}
	}
}
