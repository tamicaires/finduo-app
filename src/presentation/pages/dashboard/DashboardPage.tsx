import { useDashboard } from '@application/hooks/use-dashboard'
import { useTransactions } from '@application/hooks/use-transactions'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { StatCard } from '@presentation/components/dashboard/StatCard'
import { MonthlyFlowChart } from '@presentation/components/dashboard/MonthlyFlowChart'
import { ExpensesByCategoryChart } from '@presentation/components/dashboard/ExpensesByCategoryChart'
import { RecentTransactions } from '@presentation/components/dashboard/RecentTransactions'
import { GamificationCard } from '@presentation/components/gamification/GamificationCard'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Users,
  Sparkles,
  Target
} from 'lucide-react'
import { TransactionType } from '@core/enums/TransactionType'

export function DashboardPage() {
  const { dashboardData, isLoading } = useDashboard()
  const { transactions } = useTransactions()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Preparar dados para o gráfico mensal (últimos 6 meses)
  const monthlyData = [
    { month: 'Ago', income: 11000, expenses: 7500 },
    { month: 'Set', income: 10500, expenses: 8200 },
    { month: 'Out', income: 11200, expenses: 7800 },
    { month: 'Nov', income: 10800, expenses: 8500 },
    { month: 'Dez', income: 12000, expenses: 9200 },
    { month: 'Jan', income: dashboardData?.monthly_income || 0, expenses: dashboardData?.monthly_expenses || 0 },
  ]

  // Preparar dados para o gráfico de categorias
  const transactionsList = Array.isArray(transactions) ? transactions : []
  const expensesByCategory = transactionsList
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category)
      if (existing) {
        existing.amount += t.amount
      } else {
        acc.push({ category: t.category, amount: t.amount })
      }
      return acc
    }, [] as Array<{ category: string; amount: number }>)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  const netBalance = (dashboardData?.monthly_income || 0) - (dashboardData?.monthly_expenses || 0)
  const savingsRate = dashboardData?.monthly_income
    ? ((netBalance / dashboardData.monthly_income) * 100).toFixed(1)
    : '0'

  return (
    <div className="p-6 md:p-8 space-y-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-muted-foreground">
            Aqui está o que está acontecendo com suas finanças hoje.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Saldo Total"
            value={`R$ ${(dashboardData?.total_balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            description="Soma de todas as contas"
            icon={Wallet}
            variant="info"
          />

          <StatCard
            title="Receitas do Mês"
            value={`R$ ${(dashboardData?.monthly_income || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            description="Total de entradas"
            icon={TrendingUp}
            variant="success"
            trend={{
              value: '+12.5%',
              isPositive: true
            }}
          />

          <StatCard
            title="Despesas do Mês"
            value={`R$ ${(dashboardData?.monthly_expenses || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            description="Total de saídas"
            icon={TrendingDown}
            variant="danger"
            trend={{
              value: '+8.3%',
              isPositive: false
            }}
          />

          <StatCard
            title="Taxa de Poupança"
            value={`${savingsRate}%`}
            description="Do que você ganha"
            icon={PiggyBank}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <MonthlyFlowChart data={monthlyData} />
          {expensesByCategory.length > 0 && (
            <ExpensesByCategoryChart data={expensesByCategory} />
          )}
        </div>

        {/* Free Spending Cards */}
        {dashboardData?.free_spending && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Gastos Livres
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <StatCard
                title={dashboardData.free_spending.current_user_is_a ? 'Meus Gastos Livres' : 'Gastos do Parceiro(a)'}
                value={`R$ ${dashboardData.free_spending.user_a.remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`Disponível de R$ ${dashboardData.free_spending.user_a.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={Users}
                variant="secondary"
                trend={{
                  value: `${dashboardData.free_spending.user_a.percentage_used.toFixed(0)}% usado`,
                  isPositive: dashboardData.free_spending.user_a.percentage_used < 80
                }}
              />

              <StatCard
                title={dashboardData.free_spending.current_user_is_a ? 'Gastos do Parceiro(a)' : 'Meus Gastos Livres'}
                value={`R$ ${dashboardData.free_spending.user_b.remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                description={`Disponível de R$ ${dashboardData.free_spending.user_b.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={Target}
                variant="secondary"
                trend={{
                  value: `${dashboardData.free_spending.user_b.percentage_used.toFixed(0)}% usado`,
                  isPositive: dashboardData.free_spending.user_b.percentage_used < 80
                }}
              />
            </div>
          </div>
        )}

        {/* Gamification Card */}
        <div className="mb-6">
          <GamificationCard />
        </div>

        {/* Recent Transactions */}
        {transactionsList.length > 0 && (
          <RecentTransactions transactions={transactionsList} maxItems={5} />
        )}
      </div>
    </div>
  )
}
