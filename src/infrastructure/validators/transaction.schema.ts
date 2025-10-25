import { z } from 'zod'
import { TransactionType } from '@core/enums/TransactionType'
import { TransactionCategory } from '@core/enums/TransactionCategory'

export const registerTransactionSchema = z.object({
  account_id: z.string().min(1, 'Conta é obrigatória'),
  type: z.nativeEnum(TransactionType, {
    message: 'Tipo de transação inválido',
  }),
  amount: z.number().positive('Valor deve ser positivo'),
  category: z.nativeEnum(TransactionCategory, {
    message: 'Categoria inválida',
  }),
  description: z.string().optional(),
  transaction_date: z.date().optional(),
  is_free_spending: z.boolean().optional(),
})

export type RegisterTransactionInput = z.infer<typeof registerTransactionSchema>
