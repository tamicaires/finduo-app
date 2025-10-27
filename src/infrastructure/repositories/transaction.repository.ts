import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import type { Transaction } from '@core/entities/Transaction'
import type { TransactionType } from '@core/enums/TransactionType'
import type { TransactionCategory } from '@core/enums/TransactionCategory'

export interface RegisterTransactionDto {
  account_id: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  description?: string
  transaction_date?: string
  is_free_spending?: boolean
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

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.DELETE_TRANSACTION(id))
  },

  async updateFreeSpending(id: string, is_free_spending: boolean): Promise<void> {
    await apiClient.patch(`${API_ROUTES.REGISTER_TRANSACTION}/${id}/free-spending`, {
      is_free_spending,
    })
  },
}
