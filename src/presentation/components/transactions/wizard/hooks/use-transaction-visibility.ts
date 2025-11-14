import { useMemo } from 'react'
import type { Account } from '@core/entities/Account'

/**
 * Hook para gerenciar lógica de visibilidade baseada no tipo de conta
 *
 * Regras de negócio:
 * - Conta CONJUNTA: Sempre SHARED (não mostra campo)
 * - Conta PESSOAL: Switch para escolher PRIVATE (padrão) ou SHARED
 */
export function useTransactionVisibility(
  accountId: string | undefined,
  accounts: Account[] | undefined,
  allowPrivateTransactions: boolean
) {
  const account = useMemo(() => {
    if (!accountId || !accounts) return null
    return accounts.find(acc => acc.id === accountId)
  }, [accountId, accounts])

  const isJoint = account?.is_joint ?? true

  const defaultVisibility = useMemo(() => {
    return isJoint ? 'SHARED' : 'PRIVATE'
  }, [isJoint])

  const shouldShowVisibilityField = useMemo(() => {
    // Não mostra se:
    // 1. Conta é conjunta (sempre SHARED)
    // 2. Transações privadas não permitidas no plano
    if (isJoint) return false
    if (!allowPrivateTransactions) return false
    return true
  }, [isJoint, allowPrivateTransactions])

  const visibilityOptions = useMemo(() => {
    return isJoint
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
  }, [isJoint])

  return {
    isJoint,
    accountName: account?.name,
    defaultVisibility,
    shouldShowVisibilityField,
    visibilityOptions,
    allowPrivateTransactions,
  }
}
