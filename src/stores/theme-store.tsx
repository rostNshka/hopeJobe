import { makeAutoObservable } from 'mobx'

export type ThemeMode = 'light' | 'dark' | 'system'

class ThemeStore {
  theme: ThemeMode = 'system'
  private readonly STORAGE_KEY = 'app-theme'

  constructor() {
    makeAutoObservable(this)

    this.loadFromStorage()
    this.applyTheme()
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        this.theme = saved as ThemeMode
      }
    } catch (error) {
      console.error('Ошибка загрузки темы:', error)
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.theme)
    } catch (error) {
      console.error('Ошибка сохранения темы:', error)
    }
  }

  setTheme(theme: ThemeMode) {
    this.theme = theme
    this.saveToStorage()
    this.applyTheme()
  }

  toggleTheme() {
    const cycle: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    }
    this.setTheme(cycle[this.theme])
  }

  applyTheme() {
    const root = document.documentElement
    let resolvedTheme: 'light' | 'dark'

    if (this.theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      resolvedTheme = this.theme
    }

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }

  get resolvedTheme(): 'light' | 'dark' {
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return this.theme
  }

  get themeLabel(): string {
    const labels: Record<ThemeMode, string> = {
      light: 'Светлая',
      dark: 'Тёмная',
      system: 'Системная',
    }
    return labels[this.theme]
  }

  initSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = () => {
      if (this.theme === 'system') {
        this.applyTheme()
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
    } else {
      mediaQuery.addListener(handler)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler)
      } else {
        mediaQuery.removeListener(handler)
      }
    }
  }
}

export const themeStore = new ThemeStore()
