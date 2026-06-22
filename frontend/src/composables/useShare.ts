import LZString from 'lz-string'
import type { CharacterDraft } from '@/types/models'

export function encodeCharacter(draft: CharacterDraft): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(draft))
}

export function decodeCharacter(encoded: string): CharacterDraft | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    return JSON.parse(json) as CharacterDraft
  } catch {
    return null
  }
}

export function buildShareUrl(draft: CharacterDraft): string {
  return `${window.location.origin}/share?c=${encodeCharacter(draft)}`
}
