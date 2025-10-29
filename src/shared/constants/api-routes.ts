export const API_ROUTES = {
  // Auth
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',

  // Couple
  CREATE_COUPLE: '/couple',
  GET_COUPLE_INFO: '/couple/info',
  GET_DASHBOARD: '/couple/dashboard',
  UPDATE_FREE_SPENDING: '/couple/free-spending',
  UPDATE_COUPLE_SETTINGS: '/couple/settings',

  // Accounts
  CREATE_ACCOUNT: '/accounts',
  LIST_ACCOUNTS: '/accounts',
  UPDATE_ACCOUNT: (id: string) => `/accounts/${id}`,
  DELETE_ACCOUNT: (id: string) => `/accounts/${id}`,

  // Transactions
  REGISTER_TRANSACTION: '/transactions',
  LIST_TRANSACTIONS: '/transactions',
  DELETE_TRANSACTION: (id: string) => `/transactions/${id}`,

  // Categories
  CREATE_CATEGORY: '/categories',
  LIST_CATEGORIES: '/categories',
  UPDATE_CATEGORY: (id: string) => `/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/categories/${id}`,

  // Gamification
  GET_GAME_PROFILE: '/gamification/profile',
  GET_COUPLE_RANKING: '/gamification/profile/couple-ranking',
  AWARD_XP: '/gamification/profile/award-xp',
  GET_ACHIEVEMENTS: '/achievements',

  // Subscription
  SUBSCRIPTION_STATUS: '/subscription/status',
  SUBSCRIPTION_CHECKOUT: '/subscription/checkout',
  SUBSCRIPTION_PORTAL: '/subscription/portal',
} as const
