import { Dialog, DialogContent, DialogTitle } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { MdSwapHoriz, MdArrowBack } from 'react-icons/md'
import { useDashboard } from '@application/hooks/use-dashboard'
import { TransactionType } from '@core/enums/TransactionType'
import type { TransactionMode } from '@core/types/transaction-mode'
import type { Account } from '@core/entities/Account'
import type { TransactionFormData } from './types/form-data.types'
import { useWizardNavigation } from './hooks/use-wizard-navigation'
import { TypeStep } from './steps/TypeStep'
import { ModeStep } from './steps/ModeStep'
import { FormStep } from './steps/FormStep'

interface TransactionWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TransactionFormData, mode: TransactionMode) => void
  accounts?: Account[]
  isLoading?: boolean
}

/**
 * Transaction Wizard Container
 *
 * Arquitetura:
 * - State Machine para gerenciar navegação (determinístico)
 * - Strategy Pattern para schemas por modo
 * - Custom Hooks para lógica de negócio
 * - Componentes separados por responsabilidade
 *
 * Fluxo:
 * 1. TypeStep: Seleciona INCOME ou EXPENSE
 * 2. ModeStep: Seleciona Simple/Installment/Recurring (filtrado por tipo)
 * 3. FormStep: Preenche dados (schema dinâmico por strategy)
 */
export function TransactionWizard({
  open,
  onOpenChange,
  onSubmit,
  accounts = [],
  isLoading = false,
}: TransactionWizardProps) {
  const { dashboardData } = useDashboard()

  // State Machine para navegação
  const {
    currentStep,
    selectedType,
    selectedMode,
    canGoBack,
    selectType,
    selectMode,
    goBack,
  } = useWizardNavigation(open)

  const allowPrivateTransactions = dashboardData?.couple?.allow_private_transactions ?? false

  const getStepTitle = () => {
    switch (currentStep) {
      case 'type':
        return 'Nova Transação'
      case 'mode':
        return selectedType === TransactionType.INCOME
          ? 'Como deseja registrar a receita?'
          : 'Como deseja registrar a despesa?'
      case 'form': {
        const modeLabels = {
          simple: 'Transação Simples',
          installment: 'Transação Parcelada',
          recurring: 'Transação Recorrente',
        }
        return selectedMode ? modeLabels[selectedMode] : 'Transação'
      }
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'type':
        return 'Registre uma entrada ou saída de dinheiro'
      case 'mode':
        return 'Escolha como deseja organizar esta transação'
      case 'form':
        return 'Preencha os detalhes da transação'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogWrapper icon={MdSwapHoriz} description={getStepDescription()}>
          <div className="flex items-center gap-3">
            {canGoBack && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="h-8 w-8 p-0"
              >
                <MdArrowBack className="h-5 w-5" />
              </Button>
            )}
            <DialogTitle>{getStepTitle()}</DialogTitle>
          </div>
        </DialogWrapper>

        {/* Step 1: Tipo (Receita/Despesa) */}
        {currentStep === 'type' && (
          <TypeStep selectedType={selectedType} onSelectType={selectType} />
        )}

        {/* Step 2: Modo (Simples/Parcelada/Recorrente) */}
        {currentStep === 'mode' && selectedType && (
          <ModeStep
            selectedMode={selectedMode}
            transactionType={selectedType}
            onSelectMode={selectMode}
          />
        )}

        {/* Step 3: Formulário */}
        {currentStep === 'form' && selectedType && selectedMode && (
          <FormStep
            transactionType={selectedType}
            transactionMode={selectedMode}
            accounts={accounts}
            allowPrivateTransactions={allowPrivateTransactions}
            isLoading={isLoading}
            onSubmit={onSubmit}
            onGoBack={goBack}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
