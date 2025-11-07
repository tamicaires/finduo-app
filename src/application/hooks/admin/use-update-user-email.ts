import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { toast } from 'sonner';
import type { UpdateEmailData } from './types';

export function useUpdateUserEmail() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateEmailData) => {
      const response = await apiClient.patch(
        API_ROUTES.ADMIN_UPDATE_USER_EMAIL(data.userId),
        { newEmail: data.newEmail, reason: data.reason }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Email atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage = errorObj.response?.data?.message || 'Erro ao atualizar email';
      toast.error(errorMessage);
    },
  });

  return {
    updateEmail: mutation.mutateAsync,
    isUpdatingEmail: mutation.isPending,
  };
}
