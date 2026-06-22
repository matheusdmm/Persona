package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/labstack/echo/v5"
)

type Spell struct {
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	LevelInt    int    `json:"level_int"`
	School      string `json:"school"`
	CastingTime string `json:"casting_time"`
	Range       string `json:"range"`
	Components  string `json:"components"`
}

type open5eSpellPage struct {
	Count   int     `json:"count"`
	Results []Spell `json:"results"`
}

const (
	open5eBase     = "https://api.open5e.com"
	spellPageLimit = 100
	maxSpellPages  = 20
)

var (
	spellHTTPClient = &http.Client{Timeout: 8 * time.Second}
	spellCache      = newKeyedCache[[]Spell]()
)

func spellsHandler(c *echo.Context) error {
	class := c.QueryParam("class")
	if class == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "class is required")
	}

	spells, err := spellCache.get(class, func() ([]Spell, error) { return fetchOpen5eSpells(class) })
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "failed to fetch spells")
	}
	return c.JSON(http.StatusOK, spells)
}

// fetchOpen5eSpells fetches the first page to learn the total count, then
// fetches any remaining pages concurrently rather than awaiting them one at a time.
func fetchOpen5eSpells(class string) ([]Spell, error) {
	filterParam, filterValue := "spell_lists", class
	// Open5e does not include paladin in the spell_lists index — fall back to dnd_class.
	if class == "paladin" {
		filterParam, filterValue = "dnd_class", "Paladin"
	}

	first, err := fetchOpen5eSpellPage(filterParam, filterValue, 0)
	if err != nil {
		return nil, err
	}

	totalPages := min((first.Count+spellPageLimit-1)/spellPageLimit, maxSpellPages)
	if totalPages <= 1 {
		return first.Results, nil
	}

	type pageResult struct {
		index   int
		results []Spell
		err     error
	}
	resultsCh := make(chan pageResult, totalPages-1)
	for page := 1; page < totalPages; page++ {
		go func(page int) {
			p, err := fetchOpen5eSpellPage(filterParam, filterValue, page*spellPageLimit)
			if err != nil {
				resultsCh <- pageResult{index: page, err: err}
				return
			}
			resultsCh <- pageResult{index: page, results: p.Results}
		}(page)
	}

	pages := make([][]Spell, totalPages)
	pages[0] = first.Results
	for i := 1; i < totalPages; i++ {
		r := <-resultsCh
		if r.err != nil {
			return nil, r.err
		}
		pages[r.index] = r.results
	}

	spells := make([]Spell, 0, first.Count)
	for _, p := range pages {
		spells = append(spells, p...)
	}
	return spells, nil
}

func fetchOpen5eSpellPage(filterParam, filterValue string, offset int) (*open5eSpellPage, error) {
	q := url.Values{}
	q.Set(filterParam, filterValue)
	q.Set("ordering", "level_int,name")
	q.Set("limit", fmt.Sprintf("%d", spellPageLimit))
	if offset > 0 {
		q.Set("offset", fmt.Sprintf("%d", offset))
	}

	resp, err := spellHTTPClient.Get(open5eBase + "/v1/spells/?" + q.Encode())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("open5e: unexpected status " + resp.Status)
	}

	var page open5eSpellPage
	if err := json.NewDecoder(resp.Body).Decode(&page); err != nil {
		return nil, err
	}
	return &page, nil
}
