import { useState, useEffect } from 'react'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'

interface GameProfile {
  profile: {
    id: string
    user_id: string
    current_xp: number
    total_xp: number
    level: number
    current_streak: number
    longest_streak: number
    last_activity_at: string
    created_at: string
    updated_at: string
  }
  xpForNextLevel: number
  progressPercentage: number
  levelName: string
}

export function useGameProfile() {
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGameProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<GameProfile>(API_ROUTES.GET_GAME_PROFILE)
      setGameProfile(response.data)
    } catch (err: any) {
      console.error('Error fetching game profile:', err)
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro desconhecido'
      setError(`Erro ao carregar perfil: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGameProfile()
  }, [])

  return {
    gameProfile,
    isLoading,
    error,
    refetch: fetchGameProfile,
  }
}
