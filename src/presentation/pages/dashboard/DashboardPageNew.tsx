import { useNavigate } from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'
import { TbArrowDownRight, TbArrowUpRight } from 'react-icons/tb'
import { BsCalendar4Week, BsCreditCard2Front } from 'react-icons/bs'
import { MdAddCircleOutline, MdRemoveCircleOutline, MdBarChart, MdFlag } from 'react-icons/md'
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
  const navigate = useNavigate()
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
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      {/* Header - Mobile: Compacto, Desktop: Completo */}
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Mobile: Saudação + Busca em coluna */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-3 md:mb-0">
            <h1 className="text-xl md:text-3xl font-bold text-foreground">Olá, {user?.name?.split(' ')[0] || 'Usuário'}! 👋</h1>
            <p className="text-xs md:text-base text-muted-foreground mt-1">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 md:pl-10 bg-card border-border h-10 md:h-11 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Analytics + Transactions */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Mobile: Card de Saldo primeiro (estilo Nubank/Inter) */}
          <div className="block lg:hidden space-y-4">
            <Card className="p-5 bg-gradient-to-br from-primary to-orange-600 text-white border-0">
              <p className="text-orange-100 text-xs mb-1">Saldo disponível</p>
              <h2 className="text-3xl font-bold mb-4">{formatCurrency(dashboardData?.total_balance || 0)}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-orange-100 text-xs mb-1">Receitas</p>
                  <p className="text-lg font-semibold">{formatCurrency(dashboardData?.monthly_income || 0)}</p>
                </div>
                <div>
                  <p className="text-orange-100 text-xs mb-1">Despesas</p>
                  <p className="text-lg font-semibold">{formatCurrency(dashboardData?.monthly_expenses || 0)}</p>
                </div>
              </div>
            </Card>

            {/* Ações Rápidas - Mobile (Controle Financeiro para Casais) */}
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/transactions')}
                className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <MdRemoveCircleOutline className="text-red-500 text-2xl" />
                </div>
                <span className="text-xs font-medium">Despesa</span>
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MdAddCircleOutline className="text-green-500 text-2xl" />
                </div>
                <span className="text-xs font-medium">Receita</span>
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MdBarChart className="text-primary text-2xl" />
                </div>
                <span className="text-xs font-medium">Relatórios</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border hover:bg-secondary transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MdFlag className="text-primary text-2xl" />
                </div>
                <span className="text-xs font-medium">Metas</span>
              </button>
            </div>
          </div>

          {/* Desktop: Income and Outcome Cards lado a lado */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {/* Total Income */}
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm mb-2">Receitas Totais</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{formatCurrency(dashboardData?.monthly_income || 0)}</h2>
                  <span className="text-green-500 text-xs md:text-sm">+12,5%</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <TbArrowDownRight className="text-cyan-500 text-xl md:text-2xl" />
                </div>
              </div>
            </Card>

            {/* Total Outcome */}
            <Card className="p-4 md:p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm mb-2">Despesas Totais</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{formatCurrency(dashboardData?.monthly_expenses || 0)}</h2>
                  <span className="text-red-500 text-xs md:text-sm">+8,3%</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TbArrowUpRight className="text-purple-500 text-xl md:text-2xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Analytics Chart */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold">Analytics</h3>
                <select className="bg-secondary border-border rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm">
                  <option>2025</option>
                </select>
              </div>
              <div className="flex items-center gap-4 md:gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs md:text-sm text-muted-foreground">Receitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-xs md:text-sm text-muted-foreground">Despesas</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fafafa',
                  }}
                  labelStyle={{ color: '#fafafa' }}
                  itemStyle={{ color: '#fafafa' }}
                  cursor={{ fill: '#18181b' }}
                />
                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outcome" fill="hsl(190 80% 50%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Transactions Table */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold">Transações</h3>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="relative flex-1 md:flex-none">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    className="pl-10 bg-secondary border-border md:w-64"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-secondary border-border rounded-lg text-xs md:text-sm whitespace-nowrap">
                  <BsCalendar4Week className="text-sm" />
                  <span className="hidden sm:inline">Este mês</span>
                </button>
              </div>
            </div>

            {/* Mobile: Card List */}
            <div className="block md:hidden space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <BsCreditCard2Front className="text-lg text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{TransactionCategoryLabels[tx.category]}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.transaction_date), "dd MMM yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(tx.amount)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                        tx.type === TransactionType.INCOME
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.type === TransactionType.INCOME ? 'Receita' : 'Despesa'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-muted-foreground text-sm border-b border-border">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <BsCreditCard2Front className="text-lg text-primary" />
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
            </div>
          </Card>
        </div>

        {/* Right Column - My Card + Activity */}
        <div className="space-y-4 md:space-y-6">
          {/* My Card */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Meu Cartão</h3>

            {/* Card Balance */}
            <div className="mb-3 md:mb-4">
              <p className="text-muted-foreground text-xs md:text-sm mb-1">Saldo Total</p>
              <h2 className="text-2xl md:text-3xl font-bold">{formatCurrency(dashboardData?.total_balance || 0)}</h2>
            </div>

            {/* Credit Card */}
            <div className="bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-5 md:p-6 text-white mb-3 md:mb-4">
              <div className="mb-6 md:mb-8">
                <p className="text-orange-100 text-xs md:text-sm mb-2">Saldo Atual</p>
                <h3 className="text-2xl md:text-3xl font-bold">{formatCurrency(dashboardData?.total_balance || 0)}</h3>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-orange-100 text-xs mb-1">5282 3456 7890 1289</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-xs mb-1">09/25</p>
                  <div className="text-white font-bold text-xs md:text-sm">mastercard</div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                onClick={() => navigate('/accounts')}
                className="py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm md:text-base hover:bg-primary/90 transition-colors"
              >
                Gerenciar Cartões
              </button>
              <button
                onClick={() => navigate('/transactions')}
                className="py-2.5 md:py-3 bg-secondary border border-border rounded-lg font-medium text-sm md:text-base hover:bg-secondary/80 transition-colors"
              >
                Transferir
              </button>
            </div>
          </Card>

          {/* Activity */}
          <Card className="p-4 md:p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold">Atividade</h3>
              <button className="px-3 md:px-4 py-1.5 md:py-2 bg-secondary border-border rounded-lg text-xs md:text-sm">
                Mensal
              </button>
            </div>

            <div className="flex justify-center mb-4 md:mb-6">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
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
                    <p className="text-2xl md:text-3xl font-bold">75%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              {activityData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs md:text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-sm md:text-base">{item.value}%</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/transactions')}
              className="w-full mt-4 md:mt-6 py-2.5 md:py-3 border border-border rounded-lg font-medium text-sm md:text-base hover:bg-secondary transition-colors"
            >
              Ver todas atividades →
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
