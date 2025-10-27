export const API_ROUTES = {
  // Auth
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',

  // Couple
  CREATE_COUPLE: '/couple',
  GET_COUPLE_INFO: '/couple/info',
  GET_DASHBOARD: '/couple/dashboard',
  UPDATE_FREE_SPENDING: '/couple/free-spending',

  // Accounts
  CREATE_ACCOUNT: '/accounts',
  LIST_ACCOUNTS: '/accounts',
  UPDATE_ACCOUNT: (id: string) => `/accounts/${id}`,
  DELETE_ACCOUNT: (id: string) => `/accounts/${id}`,

  // Transactions
  REGISTER_TRANSACTION: '/transactions',
  LIST_TRANSACTIONS: '/transactions',
  DELETE_TRANSACTION: (id: string) => `/transactions/${id}`,
} as const
