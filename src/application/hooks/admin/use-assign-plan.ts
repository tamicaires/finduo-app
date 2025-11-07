import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { toast } from 'sonner';
import type { AssignPlanData } from './types';

export function useAssignPlan() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: AssignPlanData) => {
      const response = await apiClient.post(API_ROUTES.ADMIN_ASSIGN_PLAN, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Plano atribuído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-couples'] });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage: string = errorObj.response?.data?.message || 'Erro ao atribuir plano';
      toast.error(errorMessage);
    },
  });

  return {
    assignPlan: mutation.mutateAsync,
    isAssigningPlan: mutation.isPending,
  };
}
