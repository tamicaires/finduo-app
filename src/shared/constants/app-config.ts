export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  APP_NAME: 'FINDUO',
  APP_DESCRIPTION: 'Gestão financeira para casais',
  TOKEN_KEY: '@finduo:token',
  USER_KEY: '@finduo:user',
} as const

export const QUERY_KEYS = {
  DASHBOARD: 'dashboard',
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  USER: 'user',
} as const
