import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import type { DashboardData } from '@core/entities/DashboardData'

export const dashboardRepository = {
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>(API_ROUTES.GET_DASHBOARD)
    return response.data
  },
}
