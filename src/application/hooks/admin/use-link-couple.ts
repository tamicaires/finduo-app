import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { toast } from 'sonner';
import type { LinkCoupleData } from './types';

export function useLinkCouple() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: LinkCoupleData) => {
      const response = await apiClient.post(API_ROUTES.ADMIN_LINK_COUPLE, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Casal vinculado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage = errorObj.response?.data?.message || 'Erro ao vincular casal';
      toast.error(errorMessage);
    },
  });

  return {
    linkCouple: mutation.mutateAsync,
    isLinkingCouple: mutation.isPending,
  };
}
