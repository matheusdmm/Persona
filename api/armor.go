package handler

import (
	"encoding/json"
	"net/http"
)

type Armor struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Base        int    `json:"base"`
	Proficiency string `json:"proficiency"`
}

var armors = []Armor{
	{ID: "padded",      Name: "Padded",         Type: "light",  Base: 11, Proficiency: "light"},
	{ID: "leather",     Name: "Leather",         Type: "light",  Base: 11, Proficiency: "light"},
	{ID: "studded",     Name: "Studded Leather", Type: "light",  Base: 12, Proficiency: "light"},
	{ID: "hide",        Name: "Hide",            Type: "medium", Base: 12, Proficiency: "medium"},
	{ID: "chain_shirt", Name: "Chain Shirt",     Type: "medium", Base: 13, Proficiency: "medium"},
	{ID: "scale_mail",  Name: "Scale Mail",      Type: "medium", Base: 14, Proficiency: "medium"},
	{ID: "breastplate", Name: "Breastplate",     Type: "medium", Base: 14, Proficiency: "medium"},
	{ID: "half_plate",  Name: "Half Plate",      Type: "medium", Base: 15, Proficiency: "medium"},
	{ID: "ring_mail",   Name: "Ring Mail",       Type: "heavy",  Base: 14, Proficiency: "heavy"},
	{ID: "chain_mail",  Name: "Chain Mail",      Type: "heavy",  Base: 16, Proficiency: "heavy"},
	{ID: "splint",      Name: "Splint",          Type: "heavy",  Base: 17, Proficiency: "heavy"},
	{ID: "plate",       Name: "Plate",           Type: "heavy",  Base: 18, Proficiency: "heavy"},
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	_ = json.NewEncoder(w).Encode(armors)
}
