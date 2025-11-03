import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Badge } from '@presentation/components/ui/badge'
import { TransactionType, TransactionTypeLabels } from '@core/enums/TransactionType'
import { TransactionCategoryLabels } from '@core/enums/TransactionCategory'
import { formatCurrency } from '@shared/utils/format-currency'
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import type { Transaction } from '@core/entities/Transaction'

interface RecentTransactionsProps {
  transactions: Transaction[]
  maxItems?: number
}

export function RecentTransactions({ transactions, maxItems = 5 }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, maxItems)

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - d.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Transações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma transação recente
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === TransactionType.INCOME
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : 'bg-rose-100 dark:bg-rose-900/30'
                      }`}
                    >
                      {transaction.type === TransactionType.INCOME ? (
                        <ArrowDownRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {transaction.description || (typeof transaction.category === 'object' ? transaction.category?.name : transaction.category ? TransactionCategoryLabels[transaction.category] : 'Sem categoria')}
                        </p>
                        {transaction.is_free_spending && (
                          <Badge variant="secondary" className="text-xs">
                            Gasto Livre
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{TransactionTypeLabels[transaction.type]}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.transaction_date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        transaction.type === TransactionType.INCOME
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {typeof transaction.category === 'object' ? transaction.category?.name : transaction.category ? TransactionCategoryLabels[transaction.category] : 'Sem categoria'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
