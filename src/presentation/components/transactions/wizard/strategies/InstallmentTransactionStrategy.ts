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

const installmentTransactionSchema = z.object({
  ...baseTransactionFields,
  type: z.nativeEnum(TransactionType),
  total_amount: z.number().positive('Valor total deve ser maior que zero'),
  total_installments: z.number().min(2, 'Mínimo 2 parcelas').max(99, 'Máximo 99 parcelas'),
  first_installment_date: z.string().optional(),
})

export type InstallmentTransactionFormData = z.infer<typeof installmentTransactionSchema>

/**
 * Strategy para transações parceladas (divididas em múltiplas parcelas)
 */
export class InstallmentTransactionStrategy
  implements TransactionFormStrategy<InstallmentTransactionFormData>
{
  readonly mode = 'installment' as const

  readonly schema = installmentTransactionSchema

  getDefaultValues(type: string): InstallmentTransactionFormData {
    return {
      account_id: '',
      category_id: '',
      description: '',
      is_free_spending: false,
      visibility: 'SHARED',
      type: type as TransactionType,
      total_amount: 0,
      total_installments: 12,
      first_installment_date: new Date().toISOString().split('T')[0],
    }
  }
}

