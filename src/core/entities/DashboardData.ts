export interface DashboardData {
  couple: {
    id: string
    reset_day: number
  }
  total_balance: number
  monthly_income: number
  monthly_expenses: number
  couple_expenses: number
  free_spending: {
    user_a: {
      monthly: number
      remaining: number
      used: number
      percentage_used: number
    }
    user_b: {
      monthly: number
      remaining: number
      used: number
      percentage_used: number
    }
    current_user_is_a: boolean
  }
}
