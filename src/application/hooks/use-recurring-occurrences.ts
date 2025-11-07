import { apiClient } from '@/infrastructure/http/api-client';
import { QUERY_KEYS } from '@/shared/constants/app-config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export interface RecurringOccurrence {
  id: string;
  template_id: string;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'SKIPPED';
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PayOccurrenceInput {
  occurrence_id: string;
  transaction_date?: string;
}

interface GenerateOccurrencesInput {
  template_id: string;
  months_ahead?: number;
}

export function useRecurringOccurrences(templateId?: string) {
  const queryClient = useQueryClient();

  // Fetch occurrences for a template
  const { data: occurrences, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.RECURRING_OCCURRENCES, templateId],
    queryFn: async () => {
      if (!templateId) return [];
      const response = await apiClient.get<RecurringOccurrence[]>(
        `/recurring-occurrences/template/${templateId}`
      );
      return response.data;
    },
    enabled: !!templateId,
  });

  // Fetch pending occurrences for a template
  const { data: pendingOccurrences } = useQuery({
    queryKey: [QUERY_KEYS.RECURRING_OCCURRENCES, templateId, 'pending'],
    queryFn: async () => {
      if (!templateId) return [];
      const response = await apiClient.get<RecurringOccurrence[]>(
        `/recurring-occurrences/template/${templateId}/pending`
      );
      return response.data;
    },
    enabled: !!templateId,
  });

  // Fetch due occurrences within date range
  const { data: dueOccurrences } = useQuery({
    queryKey: [QUERY_KEYS.RECURRING_OCCURRENCES, 'due'],
    queryFn: async () => {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Next 30 days

      const response = await apiClient.get<RecurringOccurrence[]>(
        `/recurring-occurrences/due`,
        {
          params: {
            startDate: today.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        }
      );
      return response.data;
    },
  });

  // Generate occurrences mutation
  const generateMutation = useMutation({
    mutationFn: async (input: GenerateOccurrencesInput) => {
      const response = await apiClient.post('/recurring-occurrences/generate', input);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Ocorrências geradas com sucesso!');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RECURRING_OCCURRENCES, variables.template_id],
      });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Erro ao gerar ocorrências');
    },
  });

  // Pay occurrence mutation
  const payMutation = useMutation({
    mutationFn: async (input: PayOccurrenceInput) => {
      const { occurrence_id, transaction_date } = input;
      const response = await apiClient.post(
        `/recurring-occurrences/${occurrence_id}/pay`,
        { transaction_date }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ocorrência paga com sucesso!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_OCCURRENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_TEMPLATES] });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Erro ao pagar ocorrência');
    },
  });

  // Skip occurrence mutation
  const skipMutation = useMutation({
    mutationFn: async (occurrenceId: string) => {
      const response = await apiClient.post(
        `/recurring-occurrences/${occurrenceId}/skip`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ocorrência pulada!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECURRING_OCCURRENCES] });
    },
    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Erro ao pular ocorrência');
    },
  });

  // Helper functions
  const getOccurrencesByStatus = (status: 'PENDING' | 'PAID' | 'SKIPPED') => {
    return occurrences?.filter((o) => o.status === status) || [];
  };

  const getNextPendingOccurrence = () => {
    const pending = getOccurrencesByStatus('PENDING');
    return pending.sort((a, b) =>
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    )[0];
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysDiff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 30;
  };

  return {
    // Data
    occurrences: occurrences || [],
    pendingOccurrences: pendingOccurrences || [],
    dueOccurrences: dueOccurrences || [],
    isLoading,

    // Mutations
    generateOccurrences: generateMutation.mutate,
    payOccurrence: payMutation.mutate,
    skipOccurrence: skipMutation.mutate,

    // States
    isGenerating: generateMutation.isPending,
    isPaying: payMutation.isPending,
    isSkipping: skipMutation.isPending,

    // Helpers
    getOccurrencesByStatus,
    getNextPendingOccurrence,
    isPastDue,
    isOverdue,
  };
}
