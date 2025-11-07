import { useState } from 'react'
import { HiPlus, HiTrash, HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import { MdLock, MdShare } from 'react-icons/md'
import { toast } from 'sonner'
import { useTransactions } from '@application/hooks/use-transactions'
import { useAccounts } from '@application/hooks/use-accounts'
import { Button } from '@presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Switch } from '@presentation/components/ui/switch'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { TransactionFormWizard } from '@presentation/components/transactions/TransactionFormWizard'
import { TransactionFilters, type TransactionFiltersState } from '@presentation/components/transactions/TransactionFilters'
import { TransactionType, TransactionTypeLabels } from '@core/enums/TransactionType'
import { TransactionCategoryLabels } from '@core/enums/TransactionCategory'
import { TransactionVisibility } from '@core/enums/TransactionVisibility'
import { formatCurrency } from '@shared/utils/format-currency'
import type {
  TransactionFiltersDto,
  RegisterTransactionDto,
  RegisterInstallmentTransactionDto,
  RegisterRecurringTransactionDto
} from '@infrastructure/repositories/transaction.repository'
import type { TransactionMode } from '@core/types/transaction-mode'

export function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState<TransactionFiltersState>({})

  // Convert local filters to API format
  const apiFilters: TransactionFiltersDto | undefined = Object.keys(filters).length > 0
    ? {
        type: filters.type,
        category: filters.category,
        search: filters.search,
        start_date: filters.startDate,
        end_date: filters.endDate,
      }
    : undefined

  const {
    transactions,
    isLoading,
    registerTransaction,
    registerInstallmentTransaction,
    registerRecurringTransaction,
    deleteTransaction,
    updateFreeSpending,
    isRegistering,
    isDeleting,
    isUpdatingFreeSpending,
  } = useTransactions(apiFilters)

  const { accounts } = useAccounts()

  const handleRegister = (
    data: RegisterTransactionDto | RegisterInstallmentTransactionDto | RegisterRecurringTransactionDto,
    mode: TransactionMode
  ) => {
    const onSuccess = () => {
      setIsDialogOpen(false)
      const messages = { simple: 'Transação registrada!', installment: 'Transação parcelada criada!', recurring: 'Transação recorrente criada!' }
      toast.success(messages[mode])
    }
    const onError = () => { toast.error('Erro ao registrar transação') }
    if (mode === 'installment') {
      registerInstallmentTransaction(data as RegisterInstallmentTransactionDto, { onSuccess, onError })
    } else if (mode === 'recurring') {
      registerRecurringTransaction(data as RegisterRecurringTransactionDto, { onSuccess, onError })
    } else {
      registerTransaction(data as RegisterTransactionDto, { onSuccess, onError })
    }
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

  const handleToggleFreeSpending = (id: string, currentValue: boolean) => {
    updateFreeSpending(
      { id, is_free_spending: !currentValue },
      {
        onSuccess: () => {
          toast.success(
            !currentValue
              ? 'Transação marcada como gasto livre!'
              : 'Transação desmarcada como gasto livre!'
          )
        },
        onError: () => {
          toast.error('Erro ao atualizar transação')
        },
      }
    )
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR')
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

  const totalFreeSpending = transactionsList
    .filter((t) => t.type === TransactionType.EXPENSE && t.is_free_spending)
    .reduce((sum, t) => sum + t.amount, 0)

  const freeSpendingCount = transactionsList.filter(
    (t) => t.type === TransactionType.EXPENSE && t.is_free_spending
  ).length

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header - Mobile otimizado */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-3xl font-bold">Transações</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {transactionsList.length} {transactionsList.length === 1 ? 'transação' : 'transações'}
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="h-10 md:h-11"
              size="sm"
            >
              <HiPlus className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Nova Transação</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>

          {/* Filtros */}
          <TransactionFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Cards de Resumo - Mobile otimizado */}
        <div className="mb-4 md:mb-6 grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1 md:gap-2">
                <HiTrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-3xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1 md:gap-2">
                <HiTrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-3xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-orange-500/5 col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1 md:gap-2">
                <HiTrendingDown className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                Gastos Livres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-3xl font-bold text-orange-600">
                {formatCurrency(totalFreeSpending)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {freeSpendingCount} {freeSpendingCount === 1 ? 'transação' : 'transações'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Transações */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {transactionsList.length === 0 ? (
                <div className="p-8 md:p-12 text-center text-muted-foreground">
                  <p className="text-sm md:text-base">Nenhuma transação registrada</p>
                  <p className="text-xs md:text-sm mt-2">Clique em "Nova" para adicionar uma transação</p>
                </div>
              ) : (
                transactionsList.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-3 md:p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        {/* Ícone */}
                        <div
                          className={`p-1.5 md:p-2 rounded-full ${
                            transaction.type === TransactionType.INCOME
                              ? 'bg-emerald-100 dark:bg-emerald-900/30'
                              : 'bg-rose-100 dark:bg-rose-900/30'
                          }`}
                        >
                          {transaction.type === TransactionType.INCOME ? (
                            <HiTrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <HiTrendingDown className="h-4 w-4 md:h-5 md:w-5 text-rose-600 dark:text-rose-400" />
                          )}
                        </div>

                        {/* Descrição e Detalhes */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-xs md:text-sm truncate">
                              {transaction.description || (typeof transaction.category === 'object' ? transaction.category?.name : transaction.category ? TransactionCategoryLabels[transaction.category] : 'Sem categoria')}
                            </p>
                            {transaction.is_free_spending && transaction.type === TransactionType.EXPENSE && (
                              <span className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 whitespace-nowrap">
                                Gasto Livre
                              </span>
                            )}
                            {transaction.visibility === TransactionVisibility.PRIVATE && (
                              <MdLock className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground" title="Transação privada" />
                            )}
                            {transaction.visibility === TransactionVisibility.SHARED && accounts && (() => {
                              const account = accounts.find(acc => acc.id === transaction.account_id)
                              return account && !account.is_joint ? (
                                <MdShare className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" title="Compartilhada pelo parceiro(a)" />
                              ) : null
                            })()}
                          </div>
                          <div className="flex items-center gap-1 md:gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="truncate">{formatDate(transaction.transaction_date)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline truncate">{typeof transaction.category === 'object' ? transaction.category?.name : transaction.category ? TransactionCategoryLabels[transaction.category] : 'Sem categoria'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Valor e Ações */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="text-right">
                          <p
                            className={`font-bold text-xs md:text-sm ${
                              transaction.type === TransactionType.INCOME
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground hidden md:block">
                            {TransactionTypeLabels[transaction.type]}
                          </p>
                        </div>

                        {/* Free Spending Toggle - Apenas para despesas */}
                        {transaction.type === TransactionType.EXPENSE && (
                          <div className="flex items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Switch
                              checked={transaction.is_free_spending}
                              onCheckedChange={() => handleToggleFreeSpending(transaction.id, transaction.is_free_spending)}
                              disabled={isUpdatingFreeSpending}
                              className="scale-75 md:scale-100"
                            />
                          </div>
                        )}

                        {/* Botão Deletar - Mobile sempre visível, Desktop hover */}
                        <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={isDeleting}
                          >
                            <HiTrash className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600" />
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

        <TransactionFormWizard
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
