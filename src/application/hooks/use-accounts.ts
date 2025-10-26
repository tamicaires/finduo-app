import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import type { CreateAccountDto, UpdateAccountDto } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'

export function useAccounts() {
  const queryClient = useQueryClient()

  const {
    data: accounts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: async () => {
      const data = await accountRepository.list()
      console.log('Accounts fetched:', data)
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateAccountDto) => accountRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
      accountRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })

  return {
    accounts,
    isLoading,
    error,
    refetch,
    createAccount: createMutation.mutate,
    updateAccount: updateMutation.mutate,
    deleteAccount: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}
