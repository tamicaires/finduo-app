import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@presentation/components/ui/dialog';
import { Button } from '@presentation/components/ui/button';
import { Form } from '@presentation/components/ui/form';
import { InputField } from '@presentation/components/form/InputField';
import { SelectField } from '@presentation/components/form/SelectField';
import { useAdminCouples, useAssignPlan } from '@application/hooks/admin';

const assignPlanSchema = z.object({
  couple_id: z.string().min(1, 'Selecione um casal'),
  plan_name: z.enum(['FREE', 'PREMIUM', 'UNLIMITED'] as const),
  duration_type: z.enum(['unlimited', 'days']),
  duration_days: z.number().optional(),
  reason: z.string().optional(),
});

type AssignPlanForm = z.infer<typeof assignPlanSchema>;

interface AssignPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignPlanDialog({ open, onOpenChange }: AssignPlanDialogProps) {
  const [search, setSearch] = useState('');

  const { data: couples, isLoading: loadingCouples } = useAdminCouples({ search });
  const { assignPlan, isAssigningPlan } = useAssignPlan();

  const form = useForm<AssignPlanForm>({
    resolver: zodResolver(assignPlanSchema),
    defaultValues: {
      couple_id: '',
      plan_name: 'PREMIUM',
      duration_type: 'unlimited',
      duration_days: undefined,
      reason: '',
    },
  });

  const durationType = form.watch('duration_type');

  const coupleOptions = useMemo(() => {
    if (!couples?.couples) return [];
    return couples.couples.map((couple: any) => ({
      value: couple.id,
      label: `${couple.user1_name} & ${couple.user2_name || 'Pendente'}`,
    }));
  }, [couples]);

  const planOptions = [
    { value: 'FREE', label: 'Grátis' },
    { value: 'PREMIUM', label: 'Premium' },
    { value: 'UNLIMITED', label: 'Ilimitado' },
  ];

  const durationTypeOptions = [
    { value: 'unlimited', label: 'Ilimitado' },
    { value: 'days', label: 'Específico (dias)' },
  ];

  const handleSubmit = async (data: AssignPlanForm) => {
    try {
      await assignPlan({
        couple_id: data.couple_id,
        plan_name: data.plan_name,
        duration_days: data.duration_type === 'days' ? data.duration_days : undefined,
        reason: data.reason,
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atribuir plano:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atribuir Plano</DialogTitle>
          <DialogDescription>
            Atribua um plano específico para um casal com duração customizada.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Busca de Casal */}
            <InputField
              name="search_couple"
              label="Buscar Casal"
              placeholder="Digite o nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Seleção de Casal */}
            <SelectField
              name="couple_id"
              label="Casal"
              placeholder={loadingCouples ? 'Carregando...' : 'Selecione um casal'}
              options={coupleOptions}
              required
            />

            {/* Seleção de Plano */}
            <SelectField
              name="plan_name"
              label="Plano"
              placeholder="Selecione um plano"
              options={planOptions}
              required
            />

            {/* Tipo de Duração */}
            <SelectField
              name="duration_type"
              label="Duração"
              placeholder="Selecione a duração"
              options={durationTypeOptions}
              required
            />

            {/* Dias (se tipo = days) */}
            {durationType === 'days' && (
              <InputField
                name="duration_days"
                label="Quantidade de Dias"
                type="number"
                placeholder="Ex: 30"
                required
              />
            )}

            {/* Motivo */}
            <InputField
              name="reason"
              label="Motivo (Opcional)"
              placeholder="Ex: Promoção especial"
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isAssigningPlan}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isAssigningPlan}>
                {isAssigningPlan ? 'Atribuindo...' : 'Atribuir Plano'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
