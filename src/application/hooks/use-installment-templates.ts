import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@infrastructure/http/api-client';
import { toast } from 'react-hot-toast';
import { QUERY_KEYS } from '@/shared/constants/app-config';
import type { AxiosError } from 'axios';

export interface InstallmentTemplate {
  id: string;
  couple_id: string;
  description: string | null;
  total_amount: number;
  total_installments: number;
  paid_by_id: string;
  account_id: string;
  category_id: string | null;
  is_couple_expense: boolean;
  is_free_spending: boolean;
  visibility: string;
  first_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Installment {
  id: string;
  template_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'SKIPPED';
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PayInstallmentInput {
  installment_id: string;
  transaction_date?: string;
}

interface InstallmentTemplatesResponse {
  data: InstallmentTemplate[];
  nextCursor: string | null;
  hasMore: boolean;
  hasInactiveTemplates: boolean;
}

interface ApiErrorResponse {
  message: string;
}

export function useInstallmentTemplates(showInactive: boolean = false) {
  const queryClient = useQueryClient();

  // Fetch templates with pagination and filtering
  const { data: templatesResponse, isLoading: isLoadingTemplates } = useQuery({
    queryKey: [QUERY_KEYS.INSTALLMENT_TEMPLATES, showInactive ? 'all' : 'active'],
    queryFn: async () => {
      // Use showInactive parameter to get all or just active
      const params: Record<string, string | number> = { limit: 20 };
      if (showInactive) {
        params.showInactive = 'true';
      }

      const response = await apiClient.get<InstallmentTemplatesResponse>('/installments/templates', { params });

      // Response structure: { data: [], nextCursor, hasMore, hasInactiveTemplates }
      return response.data;
    },
  });

  const templates = Array.isArray(templatesResponse?.data) ? templatesResponse.data : [];
  const hasInactiveTemplates = templatesResponse?.hasInactiveTemplates || false;

  // Deactivate template
  const deactivateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.post(`/installments/templates/${templateId}/deactivate`);
    },
    onSuccess: () => {
      toast.success('Template desativado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENT_TEMPLATES] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Erro ao desativar template');
    },
  });

  // Activate template
  const activateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.post(`/installments/templates/${templateId}/activate`);
    },
    onSuccess: () => {
      toast.success('Template ativado!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENT_TEMPLATES] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Erro ao ativar template');
    },
  });

  // Delete template
  const deleteMutation = useMutation({
    mutationFn: async (templateId: string) => {
      await apiClient.delete(`/installments/templates/${templateId}`);
    },
    onSuccess: () => {
      toast.success('Template excluído!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENT_TEMPLATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENTS] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Erro ao excluir template');
    },
  });

  return {
    templates,
    hasInactiveTemplates,
    isLoading: isLoadingTemplates,
    deactivateTemplate: deactivateMutation.mutate,
    activateTemplate: activateMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
    isDeactivating: deactivateMutation.isPending,
    isActivating: activateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useInstallments(templateId?: string) {
  const queryClient = useQueryClient();

  // Fetch installments for a template
  const { data: installments, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INSTALLMENTS, templateId],
    queryFn: async () => {
      if (!templateId) return [];
      const response = await apiClient.get<Installment[]>(
        `/installments/template/${templateId}`
      );
      return response.data;
    },
    enabled: !!templateId,
  });

  // Fetch pending installments
  const { data: pendingInstallments } = useQuery({
    queryKey: [QUERY_KEYS.INSTALLMENTS, templateId, 'pending'],
    queryFn: async () => {
      if (!templateId) return [];
      const response = await apiClient.get<Installment[]>(
        `/installments/template/${templateId}/pending`
      );
      return response.data;
    },
    enabled: !!templateId,
  });

  // Fetch due installments
  const { data: dueInstallments } = useQuery({
    queryKey: [QUERY_KEYS.INSTALLMENTS, 'due'],
    queryFn: async () => {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const response = await apiClient.get<Installment[]>('/installments/due', {
        params: {
          startDate: today.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      });
      return response.data;
    },
  });

  // Pay installment mutation
  const payMutation = useMutation({
    mutationFn: async (input: PayInstallmentInput) => {
      const { installment_id, transaction_date } = input;
      const response = await apiClient.post(
        `/installments/${installment_id}/pay`,
        { transaction_date }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Parcela paga com sucesso!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENT_TEMPLATES] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Erro ao pagar parcela');
    },
  });

  // Skip installment mutation
  const skipMutation = useMutation({
    mutationFn: async (installmentId: string) => {
      await apiClient.post(`/installments/${installmentId}/skip`);
    },
    onSuccess: () => {
      toast.success('Parcela pulada!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSTALLMENTS] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Erro ao pular parcela');
    },
  });

  // Helper functions
  const getProgress = () => {
    if (!installments) return 0;
    const paid = installments.filter((i) => i.status === 'PAID').length;
    return (paid / installments.length) * 100;
  };

  const getNextPending = () => {
    return pendingInstallments?.sort((a, b) =>
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    )[0];
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return {
    installments: installments || [],
    pendingInstallments: pendingInstallments || [],
    dueInstallments: dueInstallments || [],
    isLoading,
    payInstallment: payMutation.mutate,
    skipInstallment: skipMutation.mutate,
    isPaying: payMutation.isPending,
    isSkipping: skipMutation.isPending,
    getProgress,
    getNextPending,
    isPastDue,
  };
}
