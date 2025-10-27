import { useEffect, useState } from 'react'
import { HiUsers, HiCalendar, HiCurrencyDollar } from 'react-icons/hi'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { formatCurrency } from '@shared/utils/format-currency'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'

interface UserInfo {
  id: string
  name: string
  email: string
  free_spending_monthly: number
  free_spending_remaining: number
}

interface CoupleInfo {
  couple: {
    id: string
    created_at: string
    reset_day: number
  }
  currentUser: UserInfo
  partner: UserInfo
}

export function CoupleManagementPage() {
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoupleInfo()
  }, [])

  const fetchCoupleInfo = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<CoupleInfo>(API_ROUTES.GET_COUPLE_INFO)
      setCoupleInfo(response.data)
    } catch (err) {
      setError('Erro ao carregar informações do casal')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const getResetDayOrdinal = (day: number) => {
    return `Dia ${day} de cada mês`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !coupleInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>{error || 'Erro ao carregar informações'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { couple, currentUser, partner } = coupleInfo

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <HiUsers className="h-8 w-8 text-orange-600" />
            Gerenciar Casal
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Informações e configurações do relacionamento financeiro
          </p>
        </div>

        {/* Couple Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiCalendar className="h-5 w-5 text-orange-600" />
              Informações do Casal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="text-lg font-medium">{formatDate(couple.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dia de Reset dos Gastos</p>
                <p className="text-lg font-medium">{getResetDayOrdinal(couple.reset_day)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current User Card */}
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-base">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">(Você)</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{currentUser.email}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <HiCurrencyDollar className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-semibold text-muted-foreground">Gastos Livres</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Limite Mensal</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(currentUser.free_spending_monthly)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Disponível</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(currentUser.free_spending_remaining)}
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(currentUser.free_spending_remaining / currentUser.free_spending_monthly) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Card */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {partner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-base">{partner.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">(Parceiro)</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{partner.email}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <HiCurrencyDollar className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-semibold text-muted-foreground">Gastos Livres</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Limite Mensal</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(partner.free_spending_monthly)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Disponível</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(partner.free_spending_remaining)}
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(partner.free_spending_remaining / partner.free_spending_monthly) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
