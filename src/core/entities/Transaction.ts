import { TransactionType } from '../enums/TransactionType'
import { TransactionCategory } from '../enums/TransactionCategory'

export interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
  color: string
  icon: string
}

export interface Transaction {
  id: string
  couple_id: string
  account_id: string
  paid_by_id: string
  type: TransactionType
  amount: number
  category?: Category | TransactionCategory // Pode ser objeto Category ou enum (retrocompatibilidade)
  description: string | null
  transaction_date: Date
  is_free_spending: boolean
  is_couple_expense: boolean
  created_at: Date
}
