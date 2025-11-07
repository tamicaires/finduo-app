import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@shared/constants/app-config'

interface RecurringTemplate {
  id: string
  couple_id: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description: string | null
  paid_by_id: string
  account_id: string
  is_couple_expense: boolean
  is_free_spending: boolean
  visibility: string
  category_id: string | null
  frequency: string
  interval: number
  start_date: Date
  end_date: Date | null
  next_occurrence: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export function useRecurringTemplates() {
  const queryClient = useQueryClient()

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.RECURRING_TEMPLATES],
    queryFn: async () => {
      const response = await apiClient.get<{ data: RecurringTemplate[], nextCursor: string | null, hasMore: boolean }>(API_ROUTES.RECURRING_TEMPLATES)
      return response.data
    },
  })

  const templates = response?.data || []

  const pauseMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.post(API_ROUTES.PAUSE_RECURRING_TEMPLATE(templateId))
    },
    onSuccess: () => {
      toast.success('Recorrência pausada!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_TEMPLATES] })
    },
    onError: () => {
      toast.error('Erro ao pausar recorrência')
    },
  })

  const resumeMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.post(API_ROUTES.RESUME_RECURRING_TEMPLATE(templateId))
    },
    onSuccess: () => {
      toast.success('Recorrência reativada!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_TEMPLATES] })
    },
    onError: () => {
      toast.error('Erro ao reativar recorrência')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.delete(API_ROUTES.DELETE_RECURRING_TEMPLATE(templateId))
    },
    onSuccess: () => {
      toast.success('Recorrência excluída!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_TEMPLATES] })
    },
    onError: () => {
      toast.error('Erro ao excluir recorrência')
    },
  })

  return {
    templates,
    isLoading,
    error,
    refetch,
    pauseTemplate: pauseMutation.mutateAsync,
    resumeTemplate: resumeMutation.mutateAsync,
    deleteTemplate: deleteMutation.mutateAsync,
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
