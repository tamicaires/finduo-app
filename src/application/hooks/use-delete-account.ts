import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'
import { toast } from 'sonner'

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: (accountId: string) => accountRepository.delete(accountId),
    onSuccess: () => {
      toast.success('Conta excluída permanentemente')
      // Permanent delete requires invalidating transactions too
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
    },
    onError: () => {
      toast.error('Erro ao excluir conta')
    },
  })

  const handleDeleteAccount = useCallback(
    (id: string) => {
      deleteAccount(id)
    },
    [deleteAccount]
  )

  return {
    handleDeleteAccount,
    isDeletingAccount: isPending,
  }
}
