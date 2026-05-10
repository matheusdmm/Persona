// composables/useAbilityScores.js

export function modifier(score) {
  return Math.floor((score - 10) / 2)
}

export function formatMod(n) {
  return n >= 0 ? `+${n}` : `${n}`
}

export function useAbilityScores() {
  // Point buy: each score costs points (base 8, max 15)
  const POINT_BUY_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }

  function pointBuyCost(scores) {
    return Object.values(scores).reduce((total, s) => total + (POINT_BUY_COSTS[s] ?? 0), 0)
  }

  const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]

  return { pointBuyCost, STANDARD_ARRAY }
}
