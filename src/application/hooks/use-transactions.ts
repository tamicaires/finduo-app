import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionRepository } from '@infrastructure/repositories/transaction.repository'
import type { RegisterTransactionDto } from '@infrastructure/repositories/transaction.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'

export function useTransactions() {
  const queryClient = useQueryClient()

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: () => transactionRepository.list(),
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterTransactionDto) => transactionRepository.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] })
    },
  })

  return {
    transactions,
    isLoading,
    error,
    refetch,
    registerTransaction: registerMutation.mutate,
    deleteTransaction: deleteMutation.mutate,
    isRegistering: registerMutation.isPending,
    isDeleting: deleteMutation.isPending,
    registerError: registerMutation.error,
    deleteError: deleteMutation.error,
  }
}
