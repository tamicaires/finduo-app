import { z } from 'zod'
import { AccountType } from '@core/enums/AccountType'

export const createAccountSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  type: z.nativeEnum(AccountType, {
    message: 'Tipo de conta inválido',
  }),
  initial_balance: z.number().min(0, 'Saldo inicial não pode ser negativo').optional(),
})

export type CreateAccountInput = z.infer<typeof createAccountSchema>
