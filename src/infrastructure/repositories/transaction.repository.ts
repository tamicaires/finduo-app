import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import type { Transaction } from '@core/entities/Transaction'
import type { TransactionType } from '@core/enums/TransactionType'
import type { TransactionCategory } from '@core/enums/TransactionCategory'
import type { RecurrenceFrequency } from '@core/enums/RecurrenceFrequency'

export interface RegisterTransactionDto {
  account_id: string
  type: TransactionType
  amount: number
  category?: TransactionCategory
  category_id?: string
  description?: string
  transaction_date?: string
  is_free_spending?: boolean
  visibility?: string
}

export interface RegisterInstallmentTransactionDto {
  account_id: string
  type: TransactionType
  total_amount: number
  total_installments: number
  category_id?: string
  description?: string
  first_installment_date?: string
  is_couple_expense?: boolean
  is_free_spending?: boolean
  visibility?: string
}

export interface RegisterRecurringTransactionDto {
  account_id: string
  type: TransactionType
  amount: number
  frequency: RecurrenceFrequency
  interval?: number
  start_date: string
  end_date?: string
  create_first_transaction?: boolean
  category_id?: string
  description?: string
  is_couple_expense?: boolean
  is_free_spending?: boolean
  visibility?: string
}

export interface TransactionFiltersDto {
  type?: TransactionType
  category?: TransactionCategory
  account_id?: string
  start_date?: string
  end_date?: string
  search?: string
}

interface ListTransactionsResponse {
  transactions: Transaction[]
  nextCursor: string | null
}

interface RecurringTemplate {
  id: string
  couple_id: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string | null
  paid_by_id: string
  account_id: string
  is_couple_expense: boolean
  is_free_spending: boolean
  visibility: string
  category_id: string | null
  frequency: string
  interval: number
  start_date: Date
  end_date: Date | null
  next_occurrence: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}

interface RecurringOccurrence {
  id: string
  template_id: string
  due_date: string
  status: 'PENDING' | 'PAID' | 'SKIPPED'
  transaction_id: string | null
  created_at: string
  updated_at: string
}

interface CreateRecurringTransactionResponse {
  template: RecurringTemplate
  occurrences: RecurringOccurrence[]
  first_transaction: Transaction | null
}

export const transactionRepository = {
  async list(filters?: TransactionFiltersDto): Promise<Transaction[]> {
    const params = new URLSearchParams()

    if (filters?.type) params.append('type', filters.type)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.account_id) params.append('account_id', filters.account_id)
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    if (filters?.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = queryString ? `${API_ROUTES.LIST_TRANSACTIONS}?${queryString}` : API_ROUTES.LIST_TRANSACTIONS

    const response = await apiClient.get<ListTransactionsResponse>(url)
    return response.data.transactions
  },

  async register(data: RegisterTransactionDto): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(
      API_ROUTES.REGISTER_TRANSACTION,
      data
    )
    return response.data
  },

  async registerInstallment(data: RegisterInstallmentTransactionDto): Promise<Transaction[]> {
    const response = await apiClient.post<Transaction[]>(
      API_ROUTES.REGISTER_INSTALLMENT_TRANSACTION,
      data
    )
    return response.data
  },

  async registerRecurring(data: RegisterRecurringTransactionDto): Promise<CreateRecurringTransactionResponse> {
    const response = await apiClient.post<CreateRecurringTransactionResponse>(
      API_ROUTES.REGISTER_RECURRING_TRANSACTION,
      data
    )
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.DELETE_TRANSACTION(id))
  },

  async updateFreeSpending(id: string, is_free_spending: boolean): Promise<void> {
    await apiClient.patch(`${API_ROUTES.REGISTER_TRANSACTION}/${id}/free-spending`, {
      is_free_spending,
    })
  },
}
