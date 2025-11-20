import { z } from 'zod'
import type { TransactionMode } from '@core/types/transaction-mode'

/**
 * Interface Strategy para formulários de transação
 * Cada modo (Simple, Installment, Recurring) implementa esta interface
 */
export interface TransactionFormStrategy<T extends Record<string, unknown>> {
  mode: TransactionMode
  schema: z.ZodType<T>
  getDefaultValues: (type: string) => T
}

/**
 * Tipo para os dados base compartilhados por todos os modos
 */
export interface BaseTransactionData {
  account_id: string
  category_id?: string
  description?: string
  is_free_spending: boolean
  visibility: 'SHARED' | 'FREE_SPENDING' | 'PRIVATE'
  type: string
}
