import { create } from 'zustand'
import type { User } from '@core/entities/User'
import { tokenStorage } from '@infrastructure/storage/token.storage'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    tokenStorage.setToken(token)
    tokenStorage.setUser(user)
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    tokenStorage.clearAll()
    set({ token: null, user: null, isAuthenticated: false })
  },

  initialize: () => {
    const token = tokenStorage.getToken()
    const user = tokenStorage.getUser()

    if (token && user) {
      set({ token, user, isAuthenticated: true })
    }
  },
}))
