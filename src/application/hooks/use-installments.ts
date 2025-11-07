import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { QUERY_KEYS } from '@shared/constants/app-config'
import type { TransactionType } from '@core/enums/TransactionType'

interface Transaction {
  id: string
  couple_id: string
  paid_by_id: string
  account_id: string
  type: TransactionType
  amount: number
  category: string | null
  description: string | null
  transaction_date: Date
  is_couple_expense: boolean
  is_free_spending: boolean
  visibility: string
  installment_group_id: string | null
  installment_number: number | null
  total_installments: number | null
  recurring_template_id: string | null
  created_at: Date
}

export interface InstallmentGroup {
  id: string
  description: string | null
  type: TransactionType
  totalAmount: number
  installmentAmount: number
  totalInstallments: number
  paidInstallments: number
  nextInstallmentNumber: number
  nextInstallmentDate: Date | null
  installments: Transaction[]
  category: string | null
}

export function useInstallments() {
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: async () => {
      const response = await apiClient.get<{ transactions: Transaction[], nextCursor: string | null }>(API_ROUTES.LIST_TRANSACTIONS)
      return response.data
    },
  })

  // Agrupar transações por installment_group_id
  const installmentGroups: InstallmentGroup[] = []

  const transactions = response?.transactions || []

  if (transactions.length > 0) {
    const groupsMap = new Map<string, Transaction[]>()

    // Agrupar transações que têm installment_group_id
    transactions.forEach((transaction) => {
      if (transaction.installment_group_id) {
        const existing = groupsMap.get(transaction.installment_group_id) || []
        existing.push(transaction)
        groupsMap.set(transaction.installment_group_id, existing)
      }
    })

    // Converter para array de grupos
    groupsMap.forEach((installments, groupId) => {
      if (installments.length === 0) return

      // Ordenar por número da parcela
      const sortedInstallments = installments.sort(
        (a, b) => (a.installment_number || 0) - (b.installment_number || 0)
      )

      const firstInstallment = sortedInstallments[0]
      const totalInstallments = firstInstallment.total_installments || 0
      const paidInstallments = sortedInstallments.length

      // Calcular próxima parcela (a primeira com data futura)
      const now = new Date()
      const futureInstallments = sortedInstallments.filter(
        (inst) => new Date(inst.transaction_date) > now
      )
      const nextInstallment = futureInstallments[0]

      // Calcular valor total
      const totalAmount = sortedInstallments.reduce((sum, inst) => sum + inst.amount, 0)

      installmentGroups.push({
        id: groupId,
        description: firstInstallment.description,
        type: firstInstallment.type,
        totalAmount,
        installmentAmount: firstInstallment.amount,
        totalInstallments,
        paidInstallments,
        nextInstallmentNumber: nextInstallment?.installment_number || totalInstallments,
        nextInstallmentDate: nextInstallment ? new Date(nextInstallment.transaction_date) : null,
        installments: sortedInstallments,
        category: firstInstallment.category,
      })
    })
  }

  return {
    installmentGroups,
    isLoading,
    refetch,
  }
}
