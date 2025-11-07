import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import type { UsersResponse } from './types';

export function useAdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) params.append('search', search);

      const response = await apiClient.get<UsersResponse>(
        `${API_ROUTES.ADMIN_LIST_USERS}?${params.toString()}`
      );
      return response.data;
    },
  });

  return {
    users: data?.users || [],
    totalPages: data?.totalPages || 1,
    page,
    search,
    isLoading,
    setPage,
    setSearch,
    refetch,
  };
}
