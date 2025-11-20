import type { SimpleTransactionFormData } from '../strategies/SimpleTransactionStrategy'
import type { InstallmentTransactionFormData } from '../strategies/InstallmentTransactionStrategy'
import type { RecurringTransactionFormData } from '../strategies/RecurringTransactionStrategy'

/**
 * Union type para todos os possíveis dados de formulário de transação
 */
export type TransactionFormData =
  | SimpleTransactionFormData
  | InstallmentTransactionFormData
  | RecurringTransactionFormData
