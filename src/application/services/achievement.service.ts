import { apiClient } from '@/infrastructure/http/api-client'
import { API_ROUTES } from '@/shared/constants/api-routes'

export interface Achievement {
  id: string
  key: string
  name: string
  description: string
  icon: string
  xp_reward: number
  category: string
  achieved_at?: Date
}

export interface UserAchievementsResponse {
  total: number
  unlocked: Achievement[]
  locked: Achievement[]
}

class AchievementService {
  async getUserAchievements(): Promise<UserAchievementsResponse> {
    const response = await apiClient.get<UserAchievementsResponse>(
      API_ROUTES.GET_ACHIEVEMENTS,
    )
    return response.data
  }
}

export const achievementService = new AchievementService()
