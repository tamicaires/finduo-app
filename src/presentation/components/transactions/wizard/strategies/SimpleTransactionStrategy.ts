import { z } from 'zod'
import { TransactionType } from '@core/enums/TransactionType'
import type { TransactionFormStrategy } from './TransactionFormStrategy.interface'

const baseTransactionFields = {
  account_id: z.string().min(1, 'Conta é obrigatória'),
  category_id: z.string().optional(),
  description: z.string().optional(),
  is_free_spending: z.boolean().default(false),
  visibility: z.enum(['SHARED', 'FREE_SPENDING', 'PRIVATE']).default('SHARED'),
}

const simpleTransactionSchema = z.object({
  ...baseTransactionFields,
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive('Valor deve ser maior que zero'),
  transaction_date: z.string().optional(),
})

export type SimpleTransactionFormData = z.infer<typeof simpleTransactionSchema>

/**
 * Strategy para transações simples (uma única transação)
 */
export class SimpleTransactionStrategy
  implements TransactionFormStrategy<SimpleTransactionFormData>
{
  readonly mode = 'simple' as const

  readonly schema = simpleTransactionSchema

  getDefaultValues(type: string): SimpleTransactionFormData {
    return {
      account_id: '',
      category_id: '',
      description: '',
      is_free_spending: false,
      visibility: 'SHARED',
      type: type as TransactionType,
      amount: 0,
      transaction_date: new Date().toISOString().split('T')[0],
    }
  }
}
