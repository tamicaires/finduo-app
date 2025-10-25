export interface Couple {
  id: string
  user_id_a: string
  user_id_b: string | null
  free_spending_a_limit: number
  free_spending_a_remaining: number
  free_spending_b_limit: number
  free_spending_b_remaining: number
  created_at: Date
}

export interface DashboardData {
  couple: Couple
  totalBalance: number
  totalIncome: number
  totalExpense: number
  accounts: Array<{
    id: string
    name: string
    type: string
    balance: number
  }>
  recentTransactions: Array<{
    id: string
    type: string
    amount: number
    category: string
    description: string | null
    transaction_date: Date
  }>
}
