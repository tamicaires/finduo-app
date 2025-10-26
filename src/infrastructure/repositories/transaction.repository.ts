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

interface ListTransactionsResponse {
  transactions: Transaction[]
  nextCursor: string | null
}

export const transactionRepository = {
  async list(): Promise<Transaction[]> {
    const response = await apiClient.get<ListTransactionsResponse>(API_ROUTES.LIST_TRANSACTIONS)
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
}
