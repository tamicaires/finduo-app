import { useQuery } from '@tanstack/react-query'
import { accountRepository } from '@infrastructure/repositories/account.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'

export function useAccountsQuery() {
  const {
    data: accounts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => accountRepository.list(),
  })

  return {
    accounts: accounts || [],
    isLoading,
    error,
    refetch,
  }
}
