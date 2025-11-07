import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { toast } from 'sonner';
import type { CreateUserData } from './types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await apiClient.post(API_ROUTES.ADMIN_REGISTER_USER, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao criar usuário';
      toast.error(errorMessage);
    },
  });

  return {
    createUser: mutation.mutateAsync,
    isCreatingUser: mutation.isPending,
  };
}
