import type { WizardState, WizardEvent } from '../types/wizard-state.types'

/**
 * Wizard State Machine Reducer
 * Gerencia as transições de estado do wizard de forma determinística
 */

export const initialWizardState: WizardState = {
  step: 'type',
  selectedType: undefined,
  selectedMode: undefined,
}

export function wizardReducer(state: WizardState, event: WizardEvent): WizardState {
  switch (event.type) {
    case 'SELECT_TYPE':
      // Transição: type -> mode
      return {
        step: 'mode',
        selectedType: event.payload,
        selectedMode: undefined,
      }

    case 'SELECT_MODE':
      // Transição: mode -> form
      if (state.step !== 'mode') {
        console.warn('SELECT_MODE só é válido no step "mode"')
        return state
      }
      return {
        step: 'form',
        selectedType: state.selectedType,
        selectedMode: event.payload,
      }

    case 'GO_BACK':
      // Transições: form -> mode, mode -> type
      if (state.step === 'form') {
        return {
          step: 'mode',
          selectedType: state.selectedType,
          selectedMode: undefined,
        }
      }
      if (state.step === 'mode') {
        return {
          step: 'type',
          selectedType: undefined,
          selectedMode: undefined,
        }
      }
      return state

    case 'RESET':
      // Volta ao estado inicial
      return initialWizardState

    default:
      return state
  }
}

/**
 * Helper para obter contexto derivado do state
 */
export function getWizardContext(state: WizardState) {
  return {
    currentStep: state.step,
    selectedType: state.selectedType,
    selectedMode: state.selectedMode,
    canGoBack: state.step !== 'type',
    isComplete: state.step === 'form',
  }
}
