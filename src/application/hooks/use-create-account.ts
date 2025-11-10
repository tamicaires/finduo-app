import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'
import { useCreateAccountDialogStore } from '@presentation/stores/use-create-account-dialog'
import { AccountType } from '@core/enums/AccountType'
import { toast } from 'sonner'

const createAccountSchema = z.object({
  name: z.string().min(1, 'Nome da conta é obrigatório'),
  type: z.nativeEnum(AccountType, {
    message: 'Tipo é obrigatório',
  }),
  initial_balance: z.coerce.string().min(1, 'Saldo inicial é obrigatório'),
  ownership: z.enum(['joint', 'personal']),
})

export type CreateAccountFormData = z.infer<typeof createAccountSchema>

const createAccountDefaultValues: CreateAccountFormData = {
  name: '',
  type: AccountType.CHECKING,
  initial_balance: '0',
  ownership: 'joint',
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  const { closeDialog } = useCreateAccountDialogStore()

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: createAccountDefaultValues,
  })

  const values = form.watch()

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: (data: CreateAccountFormData) => {
      const is_personal = data.ownership === 'personal'
      return accountRepository.create({
        name: data.name,
        type: data.type,
        initial_balance: parseFloat(data.initial_balance) || 0,
        is_personal,
      })
    },
    onSuccess: () => {
      toast.success('Conta criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
      handleClose()
    },
    onError: () => {
      toast.error('Erro ao criar conta', {
        description: 'Tente novamente mais tarde',
      })
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    createAccount(data)
  })

  const handleClose = () => {
    closeDialog()
    form.reset()
  }

  const canSubmit = useMemo(() => {
    return createAccountSchema.safeParse(values).success
  }, [values])

  return {
    form,
    handleSubmit,
    handleClose,
    isPending,
    canSubmit,
  }
}
