import { useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { useTransactions } from '@application/hooks/use-transactions'
import { useAccounts } from '@application/hooks/use-accounts'
import { Button } from '@presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { TransactionFormDialog } from '@presentation/components/transactions/TransactionFormDialog'
import { TransactionType, TransactionTypeLabels } from '@core/enums/TransactionType'
import { TransactionCategoryLabels } from '@core/enums/TransactionCategory'
import { formatCurrency } from '@shared/utils/format-currency'
import type { RegisterTransactionDto } from '@infrastructure/repositories/transaction.repository'

export function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    transactions,
    isLoading,
    registerTransaction,
    deleteTransaction,
    isRegistering,
    isDeleting,
  } = useTransactions()

  const { accounts } = useAccounts()

  const handleRegister = (data: RegisterTransactionDto) => {
    registerTransaction(data, {
      onSuccess: () => {
        setIsDialogOpen(false)
        toast.success('Transação registrada com sucesso!', {
          description: `${TransactionTypeLabels[data.type]} de ${formatCurrency(data.amount)}`
        })
      },
      onError: () => {
        toast.error('Erro ao registrar transação', {
          description: 'Tente novamente mais tarde'
        })
      }
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id, {
        onSuccess: () => {
          toast.success('Transação excluída com sucesso!')
        },
        onError: () => {
          toast.error('Erro ao excluir transação')
        }
      })
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR')
  }

  const getAccountName = (accountId: string) => {
    return accounts?.find((acc) => acc.id === accountId)?.name || 'Desconhecida'
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const transactionsList = Array.isArray(transactions) ? transactions : []

  const totalIncome = transactionsList
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactionsList
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Transações</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie suas receitas e despesas
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <div className="mb-4 md:mb-6 grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {transactionsList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma transação registrada
                </div>
              ) : (
                transactionsList.map((transaction) => (
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
                            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {transaction.description || TransactionCategoryLabels[transaction.category]}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatDate(transaction.transaction_date)}</span>
                            <span>•</span>
                            <span>{TransactionCategoryLabels[transaction.category]}</span>
                            <span>•</span>
                            <span>{getAccountName(transaction.account_id)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
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
                          <p className="text-xs text-muted-foreground">
                            {TransactionTypeLabels[transaction.type]}
                          </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <TransactionFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleRegister}
          accounts={accounts}
          isLoading={isRegistering}
        />
      </div>
    </div>
  )
}
