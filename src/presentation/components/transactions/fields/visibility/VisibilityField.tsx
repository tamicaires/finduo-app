import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { MdInfo } from 'react-icons/md'
import { RadioGroupField } from '@presentation/components/form/RadioGroupField'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import type { Account } from '@core/entities/Account'
import { useTransactionVisibility } from '../../wizard/hooks/use-transaction-visibility'

interface VisibilityFieldProps {
  accountId: string | undefined
  accounts: Account[]
  allowPrivateTransactions: boolean
}

/**
 * Campo de visibilidade inteligente
 *
 * Regras:
 * - Conta CONJUNTA: Não mostra campo (sempre SHARED)
 * - Conta PESSOAL: Mostra opções PRIVATE (padrão) ou SHARED
 */
export function VisibilityField({
  accountId,
  accounts,
  allowPrivateTransactions,
}: VisibilityFieldProps) {
  const { setValue } = useFormContext()

  const {
    isJoint,
    defaultVisibility,
    shouldShowVisibilityField,
    visibilityOptions,
  } = useTransactionVisibility(accountId, accounts, allowPrivateTransactions)

  // Atualizar visibility quando conta mudar
  useEffect(() => {
    if (accountId) {
      setValue('visibility', defaultVisibility)
    }
  }, [accountId, defaultVisibility, setValue])

  // Conta conjunta: não mostra campo (sempre SHARED)
  if (isJoint) {
    return null
  }

  // Plano não permite transações privadas
  if (!allowPrivateTransactions) {
    return (
      <Alert>
        <MdInfo className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Transações privadas não estão disponíveis no seu plano atual
        </AlertDescription>
      </Alert>
    )
  }

  // Conta pessoal: mostra opções
  if (!shouldShowVisibilityField) {
    return null
  }

  return (
    <div className="space-y-2">
      <RadioGroupField
        name="visibility"
        label="Visibilidade"
        options={visibilityOptions}
        orientation="horizontal"
      />
      <Alert className="bg-muted/30 py-2">
        <MdInfo className="h-3 w-3 text-muted-foreground" />
        <AlertDescription className="text-xs text-muted-foreground">
          Transações de contas pessoais são privadas por padrão
        </AlertDescription>
      </Alert>
    </div>
  )
}
