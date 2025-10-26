import { useAuth } from '@application/hooks/use-auth'
import { useDashboard } from '@application/hooks/use-dashboard'
import { Button } from '@presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { ExpensesChart } from '@presentation/components/charts/ExpensesChart'
import { formatCurrency } from '@shared/utils/format-currency'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const { dashboardData, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">FINDUO</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Bem-vindo ao FINDUO!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(dashboardData?.total_balance ?? 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receitas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(dashboardData?.monthly_income ?? 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(dashboardData?.monthly_expenses ?? 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {dashboardData && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mx-auto max-w-md">
                  <ExpensesChart
                    coupleExpenses={dashboardData.couple_expenses}
                    userAExpenses={dashboardData.free_spending.user_a.used}
                    userBExpenses={dashboardData.free_spending.user_b.used}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {dashboardData?.free_spending && (
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-bold">Gastos Livres</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {dashboardData.free_spending.current_user_is_a ? 'Meus Gastos' : 'Parceiro(a)'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Limite:</span>
                      <span className="font-medium">
                        {formatCurrency(dashboardData.free_spending.user_a.monthly)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Usado:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(dashboardData.free_spending.user_a.used)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Disponível:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(dashboardData.free_spending.user_a.remaining)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${dashboardData.free_spending.user_a.percentage_used}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {dashboardData.free_spending.current_user_is_a ? 'Parceiro(a)' : 'Meus Gastos'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Limite:</span>
                      <span className="font-medium">
                        {formatCurrency(dashboardData.free_spending.user_b.monthly)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Usado:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(dashboardData.free_spending.user_b.used)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Disponível:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(dashboardData.free_spending.user_b.remaining)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${dashboardData.free_spending.user_b.percentage_used}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
