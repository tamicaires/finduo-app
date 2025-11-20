import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'
import { usePermanentDeleteAccountDialogStore } from '@presentation/stores/use-permanent-delete-account-dialog'
import { toast } from 'sonner'

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const { closeDialog } = usePermanentDeleteAccountDialogStore()

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: (accountId: string) => accountRepository.delete(accountId),
    onSuccess: () => {
      toast.success('Conta excluída permanentemente')
      // ⚠️ CRITICAL: Permanent delete requires invalidating all related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_TEMPLATES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENT_TEMPLATES] })
      closeDialog()
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
