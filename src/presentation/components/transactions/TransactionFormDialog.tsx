import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogTitle } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { SwitchField } from '@presentation/components/form/SwitchField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { TransactionType, TransactionTypeLabels } from '@core/enums/TransactionType'
import { TransactionCategory, TransactionCategoryLabels } from '@core/enums/TransactionCategory'
import type { Account } from '@core/entities/Account'
import {
  ArrowRightLeft,
  Wallet,
  ArrowUpDown,
  DollarSign,
  Tag,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react'

const transactionSchema = z.object({
  account_id: z.string().min(1, 'Conta é obrigatória'),
  type: z.nativeEnum(TransactionType, {
    message: 'Tipo é obrigatório'
  }),
  amount: z.number().positive('Valor deve ser maior que zero'),
  category: z.nativeEnum(TransactionCategory, {
    message: 'Categoria é obrigatória'
  }),
  description: z.string().optional(),
  transaction_date: z.string().optional(),
  is_free_spending: z.boolean().default(false),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    account_id: string
    type: TransactionType
    amount: number
    category: TransactionCategory
    description?: string
    transaction_date?: string
    is_free_spending?: boolean
  }) => void
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
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      account_id: '',
      type: TransactionType.EXPENSE,
      amount: 0,
      category: TransactionCategory.OTHER,
      description: '',
      transaction_date: new Date().toISOString().split('T')[0],
      is_free_spending: false,
    },
  })

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit({
      account_id: data.account_id,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description || undefined,
      transaction_date: data.transaction_date,
      is_free_spending: data.is_free_spending,
    })
  }

  const typeOptions = Object.entries(TransactionTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  const categoryOptions = Object.entries(TransactionCategoryLabels).map(([value, label]) => ({
    value,
    label,
  }))

  const accountOptions = (Array.isArray(accounts) ? accounts : []).map((account) => ({
    value: account.id,
    label: account.name,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogWrapper
          icon={ArrowRightLeft}
          description="Registre uma entrada ou saída de dinheiro em uma das suas contas"
        >
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogWrapper>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="account_id"
                label="Conta"
                placeholder="Selecione a conta"
                options={accountOptions}
                icon={Wallet}
                searchable
                required
              />

              <SelectField
                name="type"
                label="Tipo"
                placeholder="Selecione o tipo"
                options={typeOptions}
                icon={ArrowUpDown}
                required
              />

              <InputField
                name="amount"
                label="Valor"
                type="money"
                placeholder="R$ 0,00"
                icon={DollarSign}
                required
              />

              <SelectField
                name="category"
                label="Categoria"
                placeholder="Selecione a categoria"
                options={categoryOptions}
                icon={Tag}
                searchable
                required
              />

              <InputField
                name="transaction_date"
                label="Data"
                type="date"
                icon={Calendar}
              />

              <InputField
                name="description"
                label="Descrição (opcional)"
                placeholder="Ex: Almoço no restaurante"
                icon={FileText}
              />
            </div>

            <SwitchField
              name="is_free_spending"
              label="Gasto Livre"
              variant="secondary"
              description="Este gasto será contabilizado como gasto livre pessoal"
              tooltipMessage="Gastos livres são despesas pessoais que não afetam o orçamento compartilhado do casal. Cada parceiro tem um limite mensal definido para gastos livres."
            />

            <div className="flex justify-end gap-3 pt-4">
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
