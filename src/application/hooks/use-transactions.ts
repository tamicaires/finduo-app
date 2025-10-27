import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionRepository } from '@infrastructure/repositories/transaction.repository'
import type { RegisterTransactionDto, TransactionFiltersDto } from '@infrastructure/repositories/transaction.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'

export function useTransactions(filters?: TransactionFiltersDto) {
  const queryClient = useQueryClient()

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, filters],
    queryFn: () => transactionRepository.list(filters),
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

  const updateFreeSpendingMutation = useMutation({
    mutationFn: ({ id, is_free_spending }: { id: string; is_free_spending: boolean }) =>
      transactionRepository.updateFreeSpending(id, is_free_spending),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
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
    updateFreeSpending: updateFreeSpendingMutation.mutate,
    isRegistering: registerMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingFreeSpending: updateFreeSpendingMutation.isPending,
    registerError: registerMutation.error,
    deleteError: deleteMutation.error,
  }
}
