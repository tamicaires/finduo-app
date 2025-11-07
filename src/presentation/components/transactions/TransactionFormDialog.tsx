import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { MdSwapHoriz, MdAccountBalanceWallet, MdSwapVert, MdAttachMoney, MdLabel, MdCalendarToday, MdDescription, MdVisibilityOff, MdPeople, MdInfo } from 'react-icons/md'
import { Dialog, DialogContent, DialogTitle } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { SwitchField } from '@presentation/components/form/SwitchField'
import { RadioGroupField } from '@presentation/components/form/RadioGroupField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import { TransactionModeSelector } from './TransactionModeSelector'
import type { TransactionMode } from '@core/types/transaction-mode'
import { InstallmentFields } from './InstallmentFields'
import { RecurringFields } from './RecurringFields'
import { TransactionType, TransactionTypeLabels } from '@core/enums/TransactionType'
import { RecurrenceFrequency } from '@core/enums/RecurrenceFrequency'
import type { Account } from '@core/entities/Account'
import { categoryService } from '@/application/services/category.service'
import { getIconComponent } from '@/shared/utils/icon-mapper'
import { useDashboard } from '@application/hooks/use-dashboard'

const baseTransactionFields = {
  account_id: z.string().min(1, 'Conta é obrigatória'),
  type: z.nativeEnum(TransactionType, {
    message: 'Tipo é obrigatório'
  }),
  category_id: z.string().optional(),
  description: z.string().optional(),
  is_free_spending: z.boolean().default(false),
  visibility: z.enum(['SHARED', 'FREE_SPENDING', 'PRIVATE']).default('SHARED'),
}

const simpleTransactionSchema = z.object({
  ...baseTransactionFields,
  amount: z.number().positive('Valor deve ser maior que zero'),
  transaction_date: z.string().optional(),
})

const installmentTransactionSchema = z.object({
  ...baseTransactionFields,
  total_amount: z.number().positive('Valor total deve ser maior que zero'),
  total_installments: z.number().min(2, 'Mínimo 2 parcelas').max(99, 'Máximo 99 parcelas'),
  first_installment_date: z.string().optional(),
})

const recurringTransactionSchema = z.object({
  ...baseTransactionFields,
  amount: z.number().positive('Valor deve ser maior que zero'),
  frequency: z.nativeEnum(RecurrenceFrequency, {
    message: 'Frequência é obrigatória'
  }),
  interval: z.number().min(1, 'Mínimo 1').max(99, 'Máximo 99').default(1),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().optional(),
  has_end_date: z.boolean().default(false),
  create_first_transaction: z.boolean().default(true),
})

type SimpleTransactionFormData = z.infer<typeof simpleTransactionSchema>
type InstallmentTransactionFormData = z.infer<typeof installmentTransactionSchema>
type RecurringTransactionFormData = z.infer<typeof recurringTransactionSchema>

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any, mode: TransactionMode) => void
  accounts?: Account[]
  isLoading?: boolean
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  accounts,
  isLoading,
}: TransactionFormDialogProps) {
  const { dashboardData } = useDashboard()
  const [transactionMode, setTransactionMode] = useState<TransactionMode>('simple')

  const getSchema = () => {
    switch (transactionMode) {
      case 'installment':
        return installmentTransactionSchema
      case 'recurring':
        return recurringTransactionSchema
      default:
        return simpleTransactionSchema
    }
  }

  const getDefaultValues = () => {
    const base = {
      account_id: '',
      type: TransactionType.EXPENSE,
      category_id: '',
      description: '',
      is_free_spending: false,
      visibility: 'SHARED' as const,
    }

    switch (transactionMode) {
      case 'installment':
        return {
          ...base,
          total_amount: 0,
          total_installments: 12,
          first_installment_date: new Date().toISOString().split('T')[0],
        }
      case 'recurring':
        return {
          ...base,
          amount: 0,
          frequency: RecurrenceFrequency.MONTHLY,
          interval: 1,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          has_end_date: false,
          create_first_transaction: true,
        }
      default:
        return {
          ...base,
          amount: 0,
          transaction_date: new Date().toISOString().split('T')[0],
        }
    }
  }

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValues(),
  })

  const selectedType = form.watch('type')
  const isFreeSpending = form.watch('is_free_spending')
  const totalAmount = form.watch('total_amount') || 0

  // Reset form when mode changes
  const handleModeChange = (mode: TransactionMode) => {
    setTransactionMode(mode)
    form.reset(getDefaultValues())
  }

  // Buscar categorias do backend
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories', selectedType],
    queryFn: () => categoryService.getAll(selectedType),
  })

  const handleSubmit = (data: SimpleTransactionFormData | InstallmentTransactionFormData | RecurringTransactionFormData) => {
    const visibility = data.is_free_spending ? 'FREE_SPENDING' : data.visibility

    const baseData = {
      account_id: data.account_id,
      type: data.type,
      category_id: data.category_id || undefined,
      description: data.description || undefined,
      is_free_spending: data.is_free_spending,
      visibility,
    }

    onSubmit(
      {
        ...baseData,
        ...data,
      },
      transactionMode
    )
  }

  const typeOptions = Object.entries(TransactionTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  const categoryOptions = (categories || []).map((category) => ({
    value: category.id,
    label: category.name,
    icon: getIconComponent(category.icon) || undefined,
  }))

  const accountOptions = (Array.isArray(accounts) ? accounts : []).map((account) => ({
    value: account.id,
    label: account.name,
  }))

  const allowPrivateTransactions = dashboardData?.couple?.allow_private_transactions ?? false

  const visibilityOptions = [
    {
      value: 'SHARED',
      label: 'Compartilhada',
      description: 'Ambos podem ver esta transação',
    },
    {
      value: 'PRIVATE',
      label: 'Privada',
      description: 'Apenas você pode ver esta transação',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogWrapper
          icon={MdSwapHoriz}
          description="Registre uma entrada ou saída de dinheiro em uma das suas contas"
        >
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogWrapper>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Transaction Mode Selector */}
            <TransactionModeSelector value={transactionMode} onChange={handleModeChange} />

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="account_id"
                label="Conta"
                placeholder="Selecione a conta"
                options={accountOptions}
                icon={MdAccountBalanceWallet}
                searchable
                required
              />

              <SelectField
                name="type"
                label="Tipo"
                placeholder="Selecione o tipo"
                options={typeOptions}
                icon={MdSwapVert}
                required
              />

              {/* Simple Transaction - Amount field */}
              {transactionMode === 'simple' && (
                <>
                  <InputField
                    name="amount"
                    label="Valor"
                    type="money"
                    placeholder="R$ 0,00"
                    icon={MdAttachMoney}
                    required
                  />

                  <InputField
                    name="transaction_date"
                    label="Data"
                    type="date"
                    icon={MdCalendarToday}
                  />
                </>
              )}

              {/* Recurring Transaction - Amount field */}
              {transactionMode === 'recurring' && (
                <InputField
                  name="amount"
                  label="Valor"
                  type="money"
                  placeholder="R$ 0,00"
                  icon={MdAttachMoney}
                  required
                />
              )}

              <SelectField
                name="category_id"
                label="Categoria"
                placeholder={loadingCategories ? "Carregando..." : "Selecione a categoria"}
                options={categoryOptions}
                icon={MdLabel}
                searchable
                disabled={loadingCategories}
              />

              <InputField
                name="description"
                label="Descrição (opcional)"
                placeholder="Ex: Almoço no restaurante"
                icon={MdDescription}
              />
            </div>

            {/* Installment Fields */}
            {transactionMode === 'installment' && (
              <InstallmentFields totalAmount={totalAmount} />
            )}

            {/* Recurring Fields */}
            {transactionMode === 'recurring' && (
              <RecurringFields />
            )}

            {/* Free Spending Switch */}
            <SwitchField
              name="is_free_spending"
              label="Gasto Livre"
              variant="secondary"
              description="Este gasto será contabilizado como gasto livre pessoal"
              tooltipMessage="Gastos livres são despesas pessoais que não afetam o orçamento compartilhado do casal. Cada parceiro tem um limite mensal definido para gastos livres."
            />

            {/* Visibility */}
            {!isFreeSpending && (
              <div className="space-y-3">
                {allowPrivateTransactions ? (
                  <RadioGroupField
                    name="visibility"
                    label="Visibilidade da Transação"
                    options={visibilityOptions}
                    orientation="vertical"
                  />
                ) : (
                  <>
                    <Alert>
                      <MdInfo className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Transações privadas não estão disponíveis no seu modelo financeiro atual.
                      </AlertDescription>
                    </Alert>
                    <input type="hidden" {...form.register('visibility')} value="SHARED" />
                  </>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : 'Registrar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
