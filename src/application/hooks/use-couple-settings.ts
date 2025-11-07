import { useState, useCallback } from 'react'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { toast } from 'sonner'
import type { FinancialModel } from '@core/entities/Couple'

interface ApiErrorResponse {
  message: string
}

interface CoupleSettings {
  free_spending_a_monthly: number
  free_spending_b_monthly: number
  reset_day: number
  financial_model: FinancialModel
  allow_personal_accounts: boolean
  allow_private_transactions: boolean
}

interface UpdateSettingsPayload {
  free_spending_a_monthly: number
  free_spending_b_monthly: number
  reset_day: number
}

interface UpdateFinancialModelPayload {
  financial_model: FinancialModel
  reason?: string
}

export function useCoupleSettings() {
  const [settings, setSettings] = useState<CoupleSettings>({
    free_spending_a_monthly: 0,
    free_spending_b_monthly: 0,
    reset_day: 1,
    financial_model: 'CUSTOM',
    allow_personal_accounts: true,
    allow_private_transactions: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get(API_ROUTES.GET_COUPLE_INFO)
      const { couple, currentUser, partner } = response.data

      // Verifica se os dados existem antes de acessar
      if (!couple || !currentUser || !partner) {
        throw new Error('Dados do casal incompletos')
      }

      setSettings({
        free_spending_a_monthly: currentUser.free_spending_monthly,
        free_spending_b_monthly: partner.free_spending_monthly,
        reset_day: couple.reset_day,
        financial_model: couple.financial_model,
        allow_personal_accounts: couple.allow_personal_accounts,
        allow_private_transactions: couple.allow_private_transactions,
      })
    } catch (err) {
      const error = err as { response?: { data?: ApiErrorResponse; status?: number }; message?: string }
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao carregar configurações'
      setError(errorMessage)
      // Só mostra toast se não for erro de não ter casal (403)
      if (error.response?.status !== 403) {
        toast.error(errorMessage)
      }
      console.error('Failed to fetch couple settings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (payload: UpdateSettingsPayload) => {
    try {
      setIsSaving(true)
      await apiClient.patch(API_ROUTES.UPDATE_COUPLE_SETTINGS, payload)
      toast.success('Configurações atualizadas com sucesso!')

      // Atualiza o estado local
      setSettings(prev => ({
        ...prev,
        ...payload,
      }))
    } catch (error) {
      toast.error('Erro ao salvar configurações')
      console.error('Failed to update couple settings:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [])

  const updateFinancialModel = useCallback(async (payload: UpdateFinancialModelPayload) => {
    try {
      await apiClient.patch(API_ROUTES.UPDATE_COUPLE_FINANCIAL_MODEL, payload)
      toast.success('Modelo financeiro atualizado com sucesso!')

      // Recarrega as configurações para pegar os novos valores de allow_*
      await fetchSettings()
    } catch (error) {
      toast.error('Erro ao atualizar modelo financeiro')
      console.error('Failed to update financial model:', error)
      throw error
    }
  }, [fetchSettings])

  return {
    settings,
    isLoading,
    isSaving,
    error,
    fetchSettings,
    updateSettings,
    updateFinancialModel,
  }
}
