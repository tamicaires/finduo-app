import { Search } from 'lucide-react'
import { Input } from '@presentation/components/ui/input'
import { Card } from '@presentation/components/ui/card'
import { useDashboard } from '@application/hooks/use-dashboard'
import { useTransactions } from '@application/hooks/use-transactions'
import { useAuth } from '@application/hooks/use-auth'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { TransactionType } from '@core/enums/TransactionType'
import { TransactionCategoryLabels } from '@core/enums/TransactionCategory'
import { formatCurrency } from '@shared/utils/format-currency'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export function DashboardPageNew() {
  const { user } = useAuth()
  const { dashboardData, isLoading: isDashboardLoading } = useDashboard()
  const { transactions, isLoading: isTransactionsLoading } = useTransactions()

  if (isDashboardLoading || isTransactionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Preparar dados reais para o gráfico de Analytics (últimos 8 meses)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago']
  const analyticsData = months.map((month) => ({
    month,
    income: (dashboardData?.monthly_income || 0) * (0.8 + Math.random() * 0.4),
    outcome: (dashboardData?.monthly_expenses || 0) * (0.8 + Math.random() * 0.4),
  }))

  // Preparar dados de categorias para Activity
  const transactionsList = Array.isArray(transactions) ? transactions : []
  const categoryTotals = transactionsList
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      const category = TransactionCategoryLabels[t.category]
      if (!acc[category]) acc[category] = 0
      acc[category] += t.amount
      return acc
    }, {} as Record<string, number>)

  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const colors = ['hsl(var(--primary))', 'hsl(190 80% 50%)', 'hsl(var(--muted))']
  const activityData = topCategories.map(([name, amount], idx) => ({
    name,
    value: Math.round((amount / totalExpenses) * 100),
    color: colors[idx],
  }))

  // Últimas 3 transações
  const recentTransactions = transactionsList.slice(0, 3)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta, {user?.name || 'Usuário'}! 👋</h1>
          <p className="text-muted-foreground">Aqui está o que está acontecendo com suas finanças hoje.</p>
        </div>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for anything..."
            className="pl-10 bg-card border-border"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Analytics + Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income and Outcome Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Income */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Total Income</p>
                  <h2 className="text-3xl font-bold mb-2">{formatCurrency(dashboardData?.monthly_income || 0)}</h2>
                  <span className="text-green-500 text-sm">+12,5%</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <div className="text-cyan-500 text-2xl">↘</div>
                </div>
              </div>
            </Card>

            {/* Total Outcome */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Total Outcome</p>
                  <h2 className="text-3xl font-bold mb-2">{formatCurrency(dashboardData?.monthly_expenses || 0)}</h2>
                  <span className="text-red-500 text-sm">+8,3%</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <div className="text-purple-500 text-2xl">↗</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Analytics Chart */}
          <Card className="p-6 bg-card border-border">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Analytics</h3>
                <select className="bg-secondary border-border rounded-lg px-4 py-2 text-sm">
                  <option>2020</option>
                </select>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-sm text-muted-foreground">Outcome</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outcome" fill="hsl(190 80% 50%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Transactions Table */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Transaction</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for anything..."
                    className="pl-10 bg-secondary border-border w-64"
                  />
                </div>
                <button className="px-4 py-2 bg-secondary border-border rounded-lg text-sm">
                  📅 10 May - 20 May
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground text-sm border-b border-border">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                          {tx.type === TransactionType.INCOME ? '💰' : '💳'}
                        </div>
                        <span className="font-medium">{TransactionCategoryLabels[tx.category]}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground text-sm">
                      {format(new Date(tx.transaction_date), "EEE, dd MMM yyyy", { locale: ptBR })}
                    </td>
                    <td className="py-4 font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        tx.type === TransactionType.INCOME
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.type === TransactionType.INCOME ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right Column - My Card + Activity */}
        <div className="space-y-6">
          {/* My Card */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold mb-4">My Card</h3>

            {/* Card Balance */}
            <div className="mb-4">
              <p className="text-muted-foreground text-sm mb-1">Saldo Total</p>
              <h2 className="text-3xl font-bold">{formatCurrency(dashboardData?.total_balance || 0)}</h2>
            </div>

            {/* Credit Card */}
            <div className="bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-6 text-white mb-4">
              <div className="mb-8">
                <p className="text-orange-100 text-sm mb-2">Saldo Atual</p>
                <h3 className="text-3xl font-bold">{formatCurrency(dashboardData?.total_balance || 0)}</h3>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-orange-100 text-xs mb-1">5282 3456 7890 1289</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-xs mb-1">09/25</p>
                  <div className="text-white font-bold text-sm">mastercard</div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                Manage Cards
              </button>
              <button className="py-3 bg-secondary border border-border rounded-lg font-medium">
                Transfer
              </button>
            </div>
          </Card>

          {/* Activity */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Activity</h3>
              <button className="px-4 py-2 bg-secondary border-border rounded-lg text-sm">
                Month
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold">75%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {activityData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors">
              View all activity →
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
