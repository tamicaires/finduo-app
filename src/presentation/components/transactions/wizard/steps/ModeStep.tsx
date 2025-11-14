import type { TransactionType } from '@core/enums/TransactionType'
import type { TransactionMode } from '@core/types/transaction-mode'
import { TransactionModeSelector } from '../../TransactionModeSelector'

interface ModeStepProps {
  selectedMode: TransactionMode | undefined
  transactionType: TransactionType
  onSelectMode: (mode: TransactionMode) => void
}

/**
 * Step 2: Seleção do modo de transação (Simples, Parcelada, Recorrente)
 * Filtra automaticamente os modos disponíveis baseado no tipo
 */
export function ModeStep({ selectedMode, transactionType, onSelectMode }: ModeStepProps) {
  return (
    <div className="py-4">
      <TransactionModeSelector
        value={selectedMode || 'simple'}
        onChange={onSelectMode}
        transactionType={transactionType}
      />
    </div>
  )
}
