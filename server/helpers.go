package main

import (
	"math"
	"strconv"
	"sync"
	"time"

	"github.com/labstack/echo/v5"
)

// keyedCache fetches and caches a value per key, collapsing concurrent
// first-requests for the same key into a single upstream fetch.
type keyedCache[T any] struct {
	mu    sync.Mutex
	data  map[string]T
	locks map[string]*sync.Mutex
}

func newKeyedCache[T any]() *keyedCache[T] {
	return &keyedCache[T]{data: make(map[string]T), locks: make(map[string]*sync.Mutex)}
}

func (kc *keyedCache[T]) get(key string, fetch func() (T, error)) (T, error) {
	kc.mu.Lock()
	if v, ok := kc.data[key]; ok {
		kc.mu.Unlock()
		return v, nil
	}
	lock, ok := kc.locks[key]
	if !ok {
		lock = &sync.Mutex{}
		kc.locks[key] = lock
	}
	kc.mu.Unlock()

	lock.Lock()
	defer lock.Unlock()

	kc.mu.Lock()
	if v, ok := kc.data[key]; ok {
		kc.mu.Unlock()
		return v, nil
	}
	kc.mu.Unlock()

	v, err := fetch()
	if err != nil {
		var zero T
		return zero, err
	}

	kc.mu.Lock()
	kc.data[key] = v
	kc.mu.Unlock()
	return v, nil
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
