import type { TransactionType } from '@core/enums/TransactionType'
import type { TransactionMode } from '@core/types/transaction-mode'

/**
 * Wizard State Machine Types
 * Representa os estados possíveis do wizard de forma type-safe
 */

export type WizardStep = 'type' | 'mode' | 'form'

export type WizardState =
  | { step: 'type'; selectedType: undefined; selectedMode: undefined }
  | { step: 'mode'; selectedType: TransactionType; selectedMode: undefined }
  | { step: 'form'; selectedType: TransactionType; selectedMode: TransactionMode }

export type WizardEvent =
  | { type: 'SELECT_TYPE'; payload: TransactionType }
  | { type: 'SELECT_MODE'; payload: TransactionMode }
  | { type: 'GO_BACK' }
  | { type: 'RESET' }

export interface WizardContext {
  currentStep: WizardStep
  selectedType: TransactionType | undefined
  selectedMode: TransactionMode | undefined
  canGoBack: boolean
  isComplete: boolean
}
