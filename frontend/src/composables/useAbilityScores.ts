import type { AbilityScores } from '@/types/models'

export function modifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

const POINT_BUY_COSTS: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }

export const STANDARD_ARRAY: number[] = [15, 14, 13, 12, 10, 8]

export function useAbilityScores() {
  function pointBuyCost(scores: AbilityScores): number {
    return Object.values(scores).reduce((total, s) => total + (POINT_BUY_COSTS[s] ?? 0), 0)
  }

  return { pointBuyCost, STANDARD_ARRAY }
}
