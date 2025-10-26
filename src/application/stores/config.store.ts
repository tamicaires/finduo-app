import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type Language = 'pt-BR' | 'en-US'
export type Currency = 'BRL' | 'USD' | 'EUR'

interface ConfigState {
  theme: Theme
  language: Language
  currency: Currency
  compactMode: boolean
  showAnimations: boolean
  notificationsEnabled: boolean
}

interface ConfigActions {
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  setCurrency: (currency: Currency) => void
  setCompactMode: (enabled: boolean) => void
  setShowAnimations: (enabled: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  resetConfig: () => void
}

const defaultConfig: ConfigState = {
  theme: 'system',
  language: 'pt-BR',
  currency: 'BRL',
  compactMode: false,
  showAnimations: true,
  notificationsEnabled: true,
}

export const useConfigStore = create<ConfigState & ConfigActions>()(
  persist(
    (set) => ({
      ...defaultConfig,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setCompactMode: (enabled) => set({ compactMode: enabled }),
      setShowAnimations: (enabled) => set({ showAnimations: enabled }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      resetConfig: () => set(defaultConfig),
    }),
    {
      name: 'finduo-config',
    }
  )
)
