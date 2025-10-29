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
    console.log('🔵 [AUTH STORE] Login chamado', { token: token?.substring(0, 20) + '...', user })
    tokenStorage.setToken(token)
    tokenStorage.setUser(user)
    set({ token, user, isAuthenticated: true })
    console.log('✅ [AUTH STORE] Login concluído - isAuthenticated:', true)
  },

  logout: () => {
    console.log('🔵 [AUTH STORE] Logout chamado')
    tokenStorage.clearAll()
    set({ token: null, user: null, isAuthenticated: false })
    console.log('✅ [AUTH STORE] Logout concluído')
  },

  initialize: () => {
    console.log('🔵 [AUTH STORE] Initialize chamado')
    const token = tokenStorage.getToken()
    const user = tokenStorage.getUser()
    console.log('🔍 [AUTH STORE] Token do storage:', token?.substring(0, 20) + '...')
    console.log('🔍 [AUTH STORE] User do storage:', user)

    if (token && user) {
      set({ token, user, isAuthenticated: true })
      console.log('✅ [AUTH STORE] Initialize - usuário autenticado')
    } else {
      console.log('⚠️ [AUTH STORE] Initialize - sem token/user no storage')
    }
  },
}))
