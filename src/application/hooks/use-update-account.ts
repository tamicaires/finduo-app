import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMemo, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'
import { useUpdateAccountDialogStore } from '@presentation/stores/use-update-account-dialog'
import { AccountType } from '@core/enums/AccountType'
import { toast } from 'sonner'
import type { Account } from '@core/entities/Account'

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Nome da conta é obrigatório'),
  type: z.nativeEnum(AccountType, {
    message: 'Tipo é obrigatório',
  }),
})

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>

const updateAccountDefaultValues: UpdateAccountFormData = {
  name: '',
  type: AccountType.CHECKING,
}

export function useUpdateAccount(account: Account | null) {
  const queryClient = useQueryClient()
  const { closeDialog } = useUpdateAccountDialogStore()

  const form = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: updateAccountDefaultValues,
  })

  const values = form.watch()

  // Reset form when account changes
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
      })
    } else {
      form.reset(updateAccountDefaultValues)
    }
  }, [account, form])

  const { mutate: updateAccount, isPending } = useMutation({
    mutationFn: (data: UpdateAccountFormData) => {
      if (!account) throw new Error('No account selected')
      return accountRepository.update(account.id, {
        name: data.name,
        type: data.type,
      })
    },
    onSuccess: () => {
      toast.success('Conta atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
      handleClose()
    },
    onError: () => {
      toast.error('Erro ao atualizar conta')
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    updateAccount(data)
  })

  const handleClose = () => {
    closeDialog()
    form.reset()
  }

  const canSubmit = useMemo(() => {
    return updateAccountSchema.safeParse(values).success && account !== null
  }, [values, account])

  return {
    form,
    handleSubmit,
    handleClose,
    isPending,
    canSubmit,
  }
}
