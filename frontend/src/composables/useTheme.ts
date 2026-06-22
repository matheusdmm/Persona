import { ref } from 'vue'
import type { Ref } from 'vue'

type Theme = 'light' | 'dark'

const theme: Ref<Theme> = ref(
  typeof localStorage !== 'undefined'
    ? ((localStorage.getItem('theme') as Theme) ?? 'dark')
    : 'dark'
)

function applyTheme(t: Theme): void {
  document.documentElement.classList.toggle('dark', t === 'dark')
  localStorage.setItem('theme', t)
}

applyTheme(theme.value)

export function useTheme() {
  function toggle(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  return { theme, toggle }
}
