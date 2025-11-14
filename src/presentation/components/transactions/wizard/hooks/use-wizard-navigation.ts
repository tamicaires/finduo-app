import { useReducer, useCallback, useEffect } from 'react'
import type { TransactionType } from '@core/enums/TransactionType'
import type { TransactionMode } from '@core/types/transaction-mode'
import {
  wizardReducer,
  initialWizardState,
  getWizardContext,
} from '../reducers/wizard-reducer'

/**
 * Hook para gerenciar navegação do wizard usando State Machine
 * Garante transições determinísticas entre os steps
 */
export function useWizardNavigation(isOpen: boolean) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState)
  const context = getWizardContext(state)

  // Reset quando o wizard fecha
  useEffect(() => {
    if (!isOpen) {
      dispatch({ type: 'RESET' })
    }
  }, [isOpen])

  const selectType = useCallback((type: TransactionType) => {
    dispatch({ type: 'SELECT_TYPE', payload: type })
  }, [])

  const selectMode = useCallback((mode: TransactionMode) => {
    dispatch({ type: 'SELECT_MODE', payload: mode })
  }, [])

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    // State
    currentStep: context.currentStep,
    selectedType: context.selectedType,
    selectedMode: context.selectedMode,
    canGoBack: context.canGoBack,
    isComplete: context.isComplete,

    // Actions
    selectType,
    selectMode,
    goBack,
    reset,
  }
}
