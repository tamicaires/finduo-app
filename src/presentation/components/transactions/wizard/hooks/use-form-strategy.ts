import { useMemo } from 'react'
import type { TransactionMode } from '@core/types/transaction-mode'
import { SimpleTransactionStrategy } from '../strategies/SimpleTransactionStrategy'
import { InstallmentTransactionStrategy } from '../strategies/InstallmentTransactionStrategy'
import { RecurringTransactionStrategy } from '../strategies/RecurringTransactionStrategy'

/**
 * Hook para selecionar a strategy correta baseado no modo de transação
 * Implementa o Strategy Pattern para formulários
 */
export function useFormStrategy(
  mode: TransactionMode
): SimpleTransactionStrategy | InstallmentTransactionStrategy | RecurringTransactionStrategy {
  const strategy = useMemo(() => {
    switch (mode) {
      case 'simple':
        return new SimpleTransactionStrategy()
      case 'installment':
        return new InstallmentTransactionStrategy()
      case 'recurring':
        return new RecurringTransactionStrategy()
      default:
        return new SimpleTransactionStrategy()
    }
  }, [mode])

  return strategy
}
