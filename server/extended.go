package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
)

type RawEntry struct {
	Name        string          `json:"name"`
	Book        string          `json:"book"`
	Description string          `json:"description,omitempty"`
	Properties  json.RawMessage `json:"properties,omitempty"`
}

type rawEntryUpstream struct {
	RawEntry
	Publisher string `json:"publisher"`
}

const dndDataBase = "https://raw.githubusercontent.com/nick-aschenbach/dnd-data/main/data"

var extendedCategoryURLs = map[string]string{
	"backgrounds": dndDataBase + "/backgrounds.json",
	"species":     dndDataBase + "/species.json",
	"classes":     dndDataBase + "/classes.json",
	"spells":      dndDataBase + "/spells.json",
	"items":       dndDataBase + "/items.json",
}

// wotcPublishers mirrors the official-content filter the frontend used to apply itself.
var wotcPublishers = map[string]bool{
	"Wizards of the Coast":       true,
	"Wizards of the Coast, Inc.": true,
}

var (
	extendedHTTPClient = &http.Client{Timeout: 15 * time.Second}
	extendedCache       = newKeyedCache[[]RawEntry]()
)

func extendedHandler(c *echo.Context) error {
	category := c.Param("category")
	categoryURL, ok := extendedCategoryURLs[category]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "unknown category")
	}

	entries, err := extendedCache.get(category, func() ([]RawEntry, error) { return fetchExtendedCategory(categoryURL) })
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "failed to fetch content")
	}
	return c.JSON(http.StatusOK, entries)
}

// fetchExtendedCategory downloads the upstream category file once, then filters to
// official WotC content and drops duplicate names — work every client used to repeat itself.
func fetchExtendedCategory(categoryURL string) ([]RawEntry, error) {
	resp, err := extendedHTTPClient.Get(categoryURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("dnd-data: unexpected status " + resp.Status)
	}

	var raw []rawEntryUpstream
	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return nil, err
	}

	seen := make(map[string]bool, len(raw))
	entries := make([]RawEntry, 0, len(raw))
	for _, e := range raw {
		if !wotcPublishers[e.Publisher] || seen[e.Name] {
			continue
		}
		seen[e.Name] = true
		entries = append(entries, e.RawEntry)
	}
	return entries, nil
}
