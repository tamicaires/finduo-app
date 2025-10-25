import { APP_CONFIG } from '@shared/constants/app-config'
import type { User } from '@core/entities/User'

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(APP_CONFIG.TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, token)
  },

  removeToken(): void {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY)
  },

  getUser(): User | null {
    const userJson = localStorage.getItem(APP_CONFIG.USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  },

  setUser(user: User): void {
    localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user))
  },

  removeUser(): void {
    localStorage.removeItem(APP_CONFIG.USER_KEY)
  },

  clearAll(): void {
    this.removeToken()
    this.removeUser()
  },
}
