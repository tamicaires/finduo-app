import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { toast } from 'sonner';
import type { UnlinkCoupleData } from './types';

export function useUnlinkCouple() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UnlinkCoupleData) => {
      const response = await apiClient.delete(
        API_ROUTES.ADMIN_UNLINK_COUPLE(data.coupleId),
        { data: { reason: data.reason } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Casal desvinculado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage = errorObj.response?.data?.message || 'Erro ao desvincular casal';
      toast.error(errorMessage);
    },
  });

  return {
    unlinkCouple: mutation.mutateAsync,
    isUnlinkingCouple: mutation.isPending,
  };
}
