import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'
import { toast } from 'sonner'

export function useArchiveAccount() {
  const queryClient = useQueryClient()

  const { mutate: archiveAccount, isPending } = useMutation({
    mutationFn: (accountId: string) => accountRepository.archive(accountId),
    onSuccess: () => {
      toast.success('Conta arquivada com sucesso!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
    onError: () => {
      toast.error('Erro ao arquivar conta')
    },
  })

  const handleArchiveAccount = useCallback(
    (id: string) => {
      archiveAccount(id)
    },
    [archiveAccount]
  )

  return {
    handleArchiveAccount,
    isArchivingAccount: isPending,
  }
}
