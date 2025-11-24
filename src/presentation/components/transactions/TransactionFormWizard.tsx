import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { MdSwapHoriz, MdAccountBalanceWallet, MdAttachMoney, MdCalendarToday, MdDescription, MdInfo, MdArrowBack } from 'react-icons/md'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
} from '@presentation/components/ui/responsive-dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { CategorySelect } from '@presentation/components/form/CategorySelect'
import { SwitchField } from '@presentation/components/form/SwitchField'
import { RadioGroupField } from '@presentation/components/form/RadioGroupField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import { TransactionTypeSelector } from './TransactionTypeSelector'
import { TransactionModeSelector } from './TransactionModeSelector'
import { InstallmentFields } from './InstallmentFields'
import { RecurringFields } from './RecurringFields'
import { TransactionType } from '@core/enums/TransactionType'
import { RecurrenceFrequency } from '@core/enums/RecurrenceFrequency'
import type { TransactionMode } from '@core/types/transaction-mode'
import type { Account } from '@core/entities/Account'
import { categoryService } from '@/application/services/category.service'
import { useDashboard } from '@application/hooks/use-dashboard'
import { useIsMobile } from '@presentation/hooks/use-is-mobile'
import { useHaptics } from '@presentation/hooks/use-haptics'

const baseTransactionFields = {
  account_id: z.string().min(1, 'Conta é obrigatória'),
  category_id: z.string().optional(),
  description: z.string().optional(),
  is_free_spending: z.boolean().default(false),
  visibility: z.enum(['SHARED', 'FREE_SPENDING', 'PRIVATE']).default('SHARED'),
}

const simpleTransactionSchema = z.object({
  ...baseTransactionFields,
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive('Valor deve ser maior que zero'),
  transaction_date: z.string().optional(),
})

const installmentTransactionSchema = z.object({
  ...baseTransactionFields,
  type: z.nativeEnum(TransactionType),
  total_amount: z.number().positive('Valor total deve ser maior que zero'),
  total_installments: z.number().min(2, 'Mínimo 2 parcelas').max(99, 'Máximo 99 parcelas'),
  first_installment_date: z.string().optional(),
})

const recurringTransactionSchema = z.object({
  ...baseTransactionFields,
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive('Valor deve ser maior que zero'),
  frequency: z.nativeEnum(RecurrenceFrequency),
  interval: z.number().min(1).max(99).default(1),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().optional(),
  has_end_date: z.boolean().default(false),
  create_first_transaction: z.boolean().default(true),
})

type SimpleTransactionFormData = z.infer<typeof simpleTransactionSchema>
type InstallmentTransactionFormData = z.infer<typeof installmentTransactionSchema>
type RecurringTransactionFormData = z.infer<typeof recurringTransactionSchema>

interface TransactionFormWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SimpleTransactionFormData | InstallmentTransactionFormData | RecurringTransactionFormData, mode: TransactionMode) => void
  accounts?: Account[]
  isLoading?: boolean
}

export function TransactionFormWizard({
  open,
  onOpenChange,
  onSubmit,
  accounts,
  isLoading,
}: TransactionFormWizardProps) {
  const { dashboardData } = useDashboard()
  const isMobile = useIsMobile()
  const haptics = useHaptics()
  const [step, setStep] = useState<'type' | 'mode' | 'form'>('type')
  const [selectedType, setSelectedType] = useState<TransactionType>()
  const [selectedMode, setSelectedMode] = useState<TransactionMode>('simple')

  const getSchema = () => {
    switch (selectedMode) {
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
      category_id: '',
      description: '',
      is_free_spending: false,
      visibility: 'SHARED' as const,
      type: selectedType || TransactionType.EXPENSE,
    }

    switch (selectedMode) {
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

  const isFreeSpending = form.watch('is_free_spending')
  const totalAmount = form.watch('total_amount') || 0
  const selectedAccountId = form.watch('account_id')

  // Verificar se a conta selecionada é conjunta ou pessoal
  const selectedAccount = accounts?.find(acc => acc.id === selectedAccountId)
  const isAccountJoint = selectedAccount?.is_joint ?? true

  // Reset quando o dialog fecha
  useEffect(() => {
    if (!open) {
      setStep('type')
      setSelectedType(undefined)
      setSelectedMode('simple')
      form.reset(getDefaultValues())
    }
  }, [open])

  // Reset form quando muda o modo
  useEffect(() => {
    form.reset(getDefaultValues())
  }, [selectedMode])

  // Atualizar visibility quando a conta mudar
  useEffect(() => {
    if (selectedAccountId) {
      const account = accounts?.find(acc => acc.id === selectedAccountId)
      // Se mudar de conta conjunta para pessoal ou vice-versa, ajustar visibility
      if (account && !isFreeSpending) {
        const currentVisibility = form.getValues('visibility')
        // Se conta pessoal e visibility é SHARED, manter
        // Se conta conjunta e visibility é PRIVATE, manter
        // Caso contrário, ajustar o padrão
        if (account.is_joint && currentVisibility !== 'PRIVATE') {
          form.setValue('visibility', 'SHARED')
        } else if (!account.is_joint && currentVisibility !== 'SHARED') {
          form.setValue('visibility', 'PRIVATE')
        }
      }
    }
  }, [selectedAccountId, accounts, form, isFreeSpending])

  // Buscar categorias
  const { data: categories, isLoading: loadingCategories, refetch: refetchCategories } = useQuery({
    queryKey: ['categories', selectedType],
    queryFn: () => categoryService.getAll(selectedType!),
    enabled: !!selectedType && step === 'form',
  })

  const handleTypeSelect = (type: TransactionType) => {
    haptics.light()
    setSelectedType(type)
    setStep('mode')
  }

  const handleModeSelect = (mode: TransactionMode) => {
    haptics.light()
    setSelectedMode(mode)
    setStep('form')
  }

  const handleBack = () => {
    haptics.light()
    if (step === 'form') {
      setStep('mode')
    } else if (step === 'mode') {
      setStep('type')
    }
  }

  const handleSubmit = (data: SimpleTransactionFormData | InstallmentTransactionFormData | RecurringTransactionFormData) => {
    haptics.medium()
    const visibility = data.is_free_spending ? 'FREE_SPENDING' : data.visibility

    // Remove campos de controle que não devem ir para o backend (apenas para RecurringTransactionFormData)
    if ('has_end_date' in data) {
      const { has_end_date, ...cleanData } = data
      // Se não tem end_date, remove do payload
      if (!has_end_date || !cleanData.end_date) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { end_date, ...finalData } = cleanData
        onSubmit({ ...finalData, type: selectedType!, visibility } as RecurringTransactionFormData, selectedMode)
        return
      }
      onSubmit({ ...cleanData, type: selectedType!, visibility } as RecurringTransactionFormData, selectedMode)
      return
    }

    onSubmit({ ...data, type: selectedType!, visibility }, selectedMode)
  }


  const accountOptions = (Array.isArray(accounts) ? accounts : []).map((account) => ({
    value: account.id,
    label: account.name,
  }))

  const allowPrivateTransactions = dashboardData?.couple?.allow_private_transactions ?? false

  // Opções de visibilidade baseadas no tipo de conta
  const visibilityOptions = isAccountJoint
    ? [
        {
          value: 'SHARED',
          label: 'Compartilhada',
          description: 'Ambos podem ver',
        },
        {
          value: 'PRIVATE',
          label: 'Privada',
          description: 'Apenas você vê',
        },
      ]
    : [
        {
          value: 'PRIVATE',
          label: 'Privada',
          description: 'Apenas você vê',
        },
        {
          value: 'SHARED',
          label: 'Compartilhar',
          description: 'Parceiro(a) também vê',
        },
      ]

  const getStepTitle = () => {
    switch (step) {
      case 'type':
        return 'Nova Transação'
      case 'mode':
        return selectedType === TransactionType.INCOME ? 'Como deseja registrar a receita?' : 'Como deseja registrar a despesa?'
      case 'form': {
        const modeLabels = {
          simple: 'Transação Simples',
          installment: 'Transação Parcelada',
          recurring: 'Transação Recorrente',
        }
        return modeLabels[selectedMode]
      }
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className={isMobile ? 'p-0 h-[95vh]' : 'max-w-3xl max-h-[90vh] overflow-y-auto'}>
        <div className={isMobile ? 'sticky top-0 z-10 bg-background border-b px-4 py-3' : ''}>
          <DialogWrapper
            icon={MdSwapHoriz}
            description={
              step === "type"
                ? "Registre uma entrada ou saída de dinheiro"
                : step === "mode"
                ? "Escolha como deseja organizar esta transação"
                : "Preencha os detalhes da transação"
            }
          >
            <div className="flex items-center gap-3">
              {step !== "type" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                >
                  <MdArrowBack className="h-5 w-5" />
                </Button>
              )}
              <ResponsiveDialogTitle>{getStepTitle()}</ResponsiveDialogTitle>
            </div>
          </DialogWrapper>
        </div>

        <div className={isMobile ? 'flex-1 overflow-y-auto' : ''}>
          {/* Step 1: Tipo */}
          {step === "type" && (
            <div className={isMobile ? 'p-4' : 'py-4'}>
              <TransactionTypeSelector
                value={selectedType}
                onChange={handleTypeSelect}
              />
            </div>
          )}

          {/* Step 2: Modo */}
          {step === "mode" && (
            <div className={isMobile ? 'p-4' : 'py-4'}>
              <TransactionModeSelector
                value={selectedMode}
                onChange={handleModeSelect}
              />
            </div>
          )}

          {/* Step 3: Formulário */}
          {step === "form" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={isMobile ? 'space-y-5 p-4' : 'space-y-5 py-2'}
              >
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

                {selectedMode === "simple" && (
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

                {selectedMode === "recurring" && (
                  <InputField
                    name="amount"
                    label="Valor"
                    type="money"
                    placeholder="R$ 0,00"
                    icon={MdAttachMoney}
                    required
                  />
                )}

                <CategorySelect
                  name="category_id"
                  label="Categoria"
                  placeholder={
                    loadingCategories
                      ? "Carregando..."
                      : "Selecione uma categoria"
                  }
                  categories={categories || []}
                  disabled={loadingCategories}
                  transactionType={selectedType!}
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

              {selectedMode === "installment" && (
                <InstallmentFields totalAmount={totalAmount} />
              )}

              {selectedMode === "recurring" && <RecurringFields />}

              {selectedType === TransactionType.EXPENSE && (
                <SwitchField
                  name="is_free_spending"
                  label="Gasto Livre"
                  variant="secondary"
                  description="Contabilizado como gasto livre pessoal"
                  tooltipMessage="Gastos livres são despesas pessoais que não afetam o orçamento compartilhado"
                />

              )}

              {!isFreeSpending && (
                <div className="space-y-3">
                  {allowPrivateTransactions ? (
                    <RadioGroupField
                      name="visibility"
                      label="Visibilidade"
                      options={visibilityOptions}
                      orientation="horizontal"
                    />
                  ) : (
                    <Alert>
                      <MdInfo className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Transações privadas não estão disponíveis no seu plano
                        atual
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

                <div className={isMobile ? 'flex gap-3 pt-4 sticky bottom-0 bg-background border-t pb-4' : 'flex justify-between gap-3 pt-4 border-t'}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isLoading}
                    className={isMobile ? 'flex-1 h-11' : ''}
                  >
                    <MdArrowBack className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={isMobile ? 'flex-1 h-11' : ''}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "Registrar Transação"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
