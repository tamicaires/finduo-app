import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'
import { toast } from 'sonner'

export function useToggleAccountVisibility() {
  const queryClient = useQueryClient()

  const { mutate: toggleVisibility, isPending } = useMutation({
    mutationFn: ({ id, isPersonal }: { id: string; isPersonal: boolean }) =>
      accountRepository.toggleVisibility(id, isPersonal),
    onSuccess: () => {
      toast.success('Visibilidade da conta alterada com sucesso!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
    onError: () => {
      toast.error('Erro ao alterar visibilidade da conta')
    },
  })

  const handleToggleVisibility = useCallback(
    (id: string, isPersonal: boolean) => {
      toggleVisibility({ id, isPersonal })
    },
    [toggleVisibility]
  )

  return {
    handleToggleVisibility,
    isTogglingVisibility: isPending,
  }
}
