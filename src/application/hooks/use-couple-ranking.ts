import { useState, useEffect } from 'react'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { getErrorMessage } from '@shared/utils/error-handler'

interface UserRanking {
  userId: string
  userName: string
  level: number
  totalXp: number
  currentStreak: number
  longestStreak: number
  levelName: string
  isWinner: boolean
}

interface CoupleRanking {
  currentUser: UserRanking
  partner: UserRanking
  winner: 'current' | 'partner' | 'tie'
  comparison: {
    xpDifference: number
    levelDifference: number
    streakDifference: number
  }
}

export function useCoupleRanking() {
  const [ranking, setRanking] = useState<CoupleRanking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRanking = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<CoupleRanking>(API_ROUTES.GET_COUPLE_RANKING)
      setRanking(response.data)
    } catch (err) {
      console.error('Error fetching couple ranking:', err)
      const errorMessage = getErrorMessage(err, 'Erro desconhecido')
      setError(`Erro ao carregar ranking: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRanking()
  }, [])

  return {
    ranking,
    isLoading,
    error,
    refetch: fetchRanking,
  }
}
