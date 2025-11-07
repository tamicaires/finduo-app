import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import type { User } from './types';

interface UseAdminCouplesParams {
  search?: string;
}

export function useAdminCouples(params: UseAdminCouplesParams) {
  return useQuery({
    queryKey: ['admin-couples', params.search],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);

      const response = await apiClient.get<{ users: User[] }>(
        `${API_ROUTES.ADMIN_LIST_USERS}?${queryParams.toString()}`
      );

      return {
        couples: response.data.users.filter((u) => u.has_couple)
      };
    },
    enabled: !!params.search,
  });
}
