import { z } from 'zod'
import { TransactionType } from '@core/enums/TransactionType'
import { RecurrenceFrequency } from '@core/enums/RecurrenceFrequency'
import type { TransactionFormStrategy } from './TransactionFormStrategy.interface'

const baseTransactionFields = {
  account_id: z.string().min(1, 'Conta é obrigatória'),
  category_id: z.string().optional(),
  description: z.string().optional(),
  is_free_spending: z.boolean().default(false),
  visibility: z.enum(['SHARED', 'FREE_SPENDING', 'PRIVATE']).default('SHARED'),
}

const recurringTransactionSchema = z.object({
  ...baseTransactionFields,
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive('Valor deve ser maior que zero'),
  frequency: z.nativeEnum(RecurrenceFrequency),
  interval: z.number().min(1).max(99).default(1),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().optional(),
  has_end_date: z.boolean().default(false),
  create_first_transaction: z.boolean().default(true),
})

export type RecurringTransactionFormData = z.infer<typeof recurringTransactionSchema>

/**
 * Strategy para transações recorrentes (repetem periodicamente)
 */
export class RecurringTransactionStrategy
  implements TransactionFormStrategy<RecurringTransactionFormData>
{
  readonly mode = 'recurring' as const

  readonly schema = recurringTransactionSchema

  getDefaultValues(type: string): RecurringTransactionFormData {
    return {
      account_id: '',
      category_id: '',
      description: '',
      is_free_spending: false,
      visibility: 'SHARED',
      type: type as TransactionType,
      amount: 0,
      frequency: RecurrenceFrequency.MONTHLY,
      interval: 1,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      has_end_date: false,
      create_first_transaction: true,
    }
  }
}
