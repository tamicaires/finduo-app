import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import {
  MdAccountBalanceWallet,
  MdAttachMoney,
  MdCalendarToday,
  MdDescription,
  MdArrowBack,
} from 'react-icons/md'
import { Form } from '@presentation/components/ui/form'
import { Button } from '@presentation/components/ui/button'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { CategorySelect } from '@presentation/components/form/CategorySelect'
import { SwitchField } from '@presentation/components/form/SwitchField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { InstallmentFields } from '../../InstallmentFields'
import { RecurringFieldsOptimized } from '../../fields/RecurringFieldsOptimized'
import { VisibilityField } from '../../fields/visibility/VisibilityField'
import { TransactionType } from '@core/enums/TransactionType'
import type { TransactionMode } from '@core/types/transaction-mode'
import type { Account } from '@core/entities/Account'
import type { TransactionFormData } from '../types/form-data.types'
import { categoryService } from '@/application/services/category.service'
import { useFormStrategy } from '../hooks/use-form-strategy'

interface FormStepProps {
  transactionType: TransactionType
  transactionMode: TransactionMode
  accounts: Account[]
  allowPrivateTransactions: boolean
  isLoading?: boolean
  onSubmit: (data: TransactionFormData, mode: TransactionMode) => void
  onGoBack: () => void
}

/**
 * Step 3: Formulário de transação
 * Usa Strategy Pattern para determinar schema e campos baseado no modo
 */
export function FormStep({
  transactionType,
  transactionMode,
  accounts,
  allowPrivateTransactions,
  isLoading,
  onSubmit,
  onGoBack,
}: FormStepProps) {
  // Strategy Pattern: obter schema e defaults baseado no modo
  const strategy = useFormStrategy(transactionMode)

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(strategy.schema),
    defaultValues: strategy.getDefaultValues(transactionType),
  })

  // Reset form quando modo mudar
  useEffect(() => {
    form.reset(strategy.getDefaultValues(transactionType))
  }, [transactionMode, transactionType, strategy, form])

  // Buscar categorias
  const {
    data: categories,
    isLoading: loadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories', transactionType],
    queryFn: () => categoryService.getAll(transactionType),
    enabled: !!transactionType,
  })

  // Watch fields
  const isFreeSpending = form.watch('is_free_spending')
  const totalAmount = form.watch('total_amount') || 0
  const selectedAccountId = form.watch('account_id')

  const handleSubmit = (data: TransactionFormData) => {
    const visibility = data.is_free_spending ? 'FREE_SPENDING' : data.visibility

    // Remove campos de controle que não devem ir para o backend (apenas recurring tem has_end_date)
    if ('has_end_date' in data) {
      const { has_end_date, ...cleanData } = data
      if (!has_end_date || !cleanData.end_date) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { end_date, ...finalData } = cleanData
        onSubmit({ ...finalData, type: transactionType, visibility } as TransactionFormData, transactionMode)
        return
      }
      onSubmit({ ...cleanData, type: transactionType, visibility } as TransactionFormData, transactionMode)
      return
    }

    onSubmit({ ...data, type: transactionType, visibility } as TransactionFormData, transactionMode)
  }

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-2">
        {/* Campos Básicos */}
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

          {/* Valor - Simple e Recurring */}
          {(transactionMode === 'simple' || transactionMode === 'recurring') && (
            <>
              <InputField
                name="amount"
                label="Valor"
                type="money"
                placeholder="R$ 0,00"
                icon={MdAttachMoney}
                required
              />
              {transactionMode === 'simple' && (
                <InputField
                  name="transaction_date"
                  label="Data"
                  type="date"
                  icon={MdCalendarToday}
                />
              )}
            </>
          )}

          <CategorySelect
            name="category_id"
            label="Categoria"
            placeholder={loadingCategories ? 'Carregando...' : 'Selecione uma categoria'}
            categories={categories || []}
            disabled={loadingCategories}
            transactionType={transactionType}
            onCategoryCreated={() => refetchCategories()}
            isLoading={loadingCategories}
          />

          <InputField
            name="description"
            label="Descrição (opcional)"
            placeholder="Ex: Almoço no restaurante"
            icon={MdDescription}
          />
        </div>

        {/* Campos Específicos por Modo */}
        {transactionMode === 'installment' && <InstallmentFields totalAmount={totalAmount} />}
        {transactionMode === 'recurring' && <RecurringFieldsOptimized />}

        {/* Gasto Livre (apenas despesas) */}
        {transactionType === TransactionType.EXPENSE && (
          <SwitchField
            name="is_free_spending"
            label="Gasto Livre"
            variant="secondary"
            description="Contabilizado como gasto livre pessoal"
            tooltipMessage="Gastos livres são despesas pessoais que não afetam o orçamento compartilhado"
          />
        )}

        {/* Visibilidade Inteligente */}
        {!isFreeSpending && (
          <VisibilityField
            accountId={selectedAccountId}
            accounts={accounts}
            allowPrivateTransactions={allowPrivateTransactions}
          />
        )}

        {/* Ações */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onGoBack}
            disabled={isLoading}
          >
            <MdArrowBack className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : 'Registrar Transação'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
