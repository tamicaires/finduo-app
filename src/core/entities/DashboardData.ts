import type { Account } from './Account'
import type { Transaction } from './Transaction'

export interface DashboardData {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  freeSpending: number
  accounts: Account[]
  recentTransactions: Transaction[]
}
