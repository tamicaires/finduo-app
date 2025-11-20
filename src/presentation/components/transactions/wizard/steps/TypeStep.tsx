import type { TransactionType } from '@core/enums/TransactionType'
import { TransactionTypeSelector } from '../../TransactionTypeSelector'

interface TypeStepProps {
  selectedType: TransactionType | undefined
  onSelectType: (type: TransactionType) => void
}

/**
 * Step 1: Seleção do tipo de transação (Receita ou Despesa)
 */
export function TypeStep({ selectedType, onSelectType }: TypeStepProps) {
  return (
    <div className="py-4">
      <TransactionTypeSelector value={selectedType} onChange={onSelectType} />
    </div>
  )
}
