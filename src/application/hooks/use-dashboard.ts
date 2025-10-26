import { useQuery } from '@tanstack/react-query'
import { dashboardRepository } from '@infrastructure/repositories/dashboard.repository'
import { QUERY_KEYS } from '@shared/constants/app-config'

export function useDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: () => dashboardRepository.getDashboard(),
  })

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
  }
}
