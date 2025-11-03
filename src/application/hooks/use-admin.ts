import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  has_couple: boolean;
  couple_id?: string;
  partner_name?: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  reason?: string;
}

interface UpdateEmailData {
  userId: string;
  newEmail: string;
  reason?: string;
}

interface LinkCoupleData {
  user_id_a: string;
  user_id_b: string;
  reason?: string;
}

interface UnlinkCoupleData {
  coupleId: string;
  reason?: string;
}

export function useAdmin() {
  const queryClient = useQueryClient();
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

  const createUserMutation = useMutation({
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

  const updateEmailMutation = useMutation({
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
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar email';
      toast.error(errorMessage);
    },
  });

  const linkCoupleMutation = useMutation({
    mutationFn: async (data: LinkCoupleData) => {
      const response = await apiClient.post(API_ROUTES.ADMIN_LINK_COUPLE, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Casal vinculado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao vincular casal';
      toast.error(errorMessage);
    },
  });

  const unlinkCoupleMutation = useMutation({
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
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao desvincular casal';
      toast.error(errorMessage);
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
    createUser: createUserMutation.mutateAsync,
    updateEmail: updateEmailMutation.mutateAsync,
    linkCouple: linkCoupleMutation.mutateAsync,
    unlinkCouple: unlinkCoupleMutation.mutateAsync,
    isCreatingUser: createUserMutation.isPending,
    isUpdatingEmail: updateEmailMutation.isPending,
    isLinkingCouple: linkCoupleMutation.isPending,
    isUnlinkingCouple: unlinkCoupleMutation.isPending,
  };
}
