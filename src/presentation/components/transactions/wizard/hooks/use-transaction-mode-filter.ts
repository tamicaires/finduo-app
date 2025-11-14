import { useMemo } from 'react'
import { TransactionType } from '@core/enums/TransactionType'
import type { TransactionMode } from '@core/types/transaction-mode'

/**
 * Hook para filtrar modos de transação disponíveis baseado no tipo
 *
 * Regras de negócio:
 * - RECEITA: Apenas Simple e Recurring (parcelamento não faz sentido)
 * - DESPESA: Todos os modos (Simple, Installment, Recurring)
 */
export function useTransactionModeFilter(transactionType: TransactionType | null) {
  const availableModes = useMemo((): TransactionMode[] => {
    if (!transactionType) {
      return ['simple', 'installment', 'recurring']
    }

    if (transactionType === TransactionType.INCOME) {
      // Receitas raramente são parceladas em finanças pessoais
      return ['simple', 'recurring']
    }

    // Despesas podem usar todos os modos
    return ['simple', 'installment', 'recurring']
  }, [transactionType])

  const isInstallmentAvailable = useMemo(() => {
    return availableModes.includes('installment')
  }, [availableModes])

  return {
    availableModes,
    isInstallmentAvailable,
  }
}
