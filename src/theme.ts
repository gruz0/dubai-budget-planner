import { useEffect, useState } from 'react'

export type Theme = 'system' | 'light' | 'dark'

// Keep in sync with the inline script in index.html, which applies the theme before first paint
const STORAGE_KEY = 'dubai-budget-planner:theme'
const systemDark = '(prefers-color-scheme: dark)'

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage is unavailable; follow the system
  }
  return 'system'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return window.matchMedia(systemDark).matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme))

  useEffect(() => {
    function apply() {
      const resolved = resolveTheme(theme)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
      setResolvedTheme(resolved)
    }

    apply()
    if (theme !== 'system') return

    const media = window.matchMedia(systemDark)
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  function setTheme(next: Theme) {
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The choice lasts for this visit only
    }
    setThemeState(next)
  }

  return { theme, resolvedTheme, setTheme }
}
