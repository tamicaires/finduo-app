import { useEffect, useState } from 'react'
import { Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { LoadingWithLogo } from '@presentation/components/shared/LoadingWithLogo'
import { NoCoupleCard } from '@presentation/components/couple/NoCoupleCard'
import { formatCurrency } from '@shared/utils/format-currency'
import { getErrorMessage, isNoCoupleError } from '@shared/utils/error-handler'
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

export function CoupleInfoTab() {
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
      const errorMessage = getErrorMessage(err, 'Erro ao carregar informações do casal')
      setError(errorMessage)
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

  if (isLoading) {
    return <LoadingWithLogo message="Carregando informações do casal..." />
  }

  if (error || !coupleInfo || !coupleInfo.couple) {
    // Se o erro for de não ter casal, mostra o card bonito
    if (error && isNoCoupleError(error)) {
      return (
        <NoCoupleCard
          onInviteClick={() => {
            // TODO: Implementar lógica de criar casal
            console.log('Criar casal')
          }}
        />
      )
    }

    // Para outros erros, mostra mensagem genérica
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>{error || 'Erro ao carregar informações'}</p>
        </CardContent>
      </Card>
    )
  }

  const { couple, currentUser, partner } = coupleInfo

  return (
    <div className="space-y-6">
      {/* Couple Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
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
              <p className="text-lg font-medium">Dia {couple.reset_day} de cada mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current User Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
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
                <DollarSign className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Gastos Livres</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Limite Mensal</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(currentUser.free_spending_monthly)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Disponível</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(currentUser.free_spending_remaining)}
                  </p>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">
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
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-semibold text-muted-foreground">Gastos Livres</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Limite Mensal</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(partner.free_spending_monthly)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Disponível</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(partner.free_spending_remaining)}
                  </p>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-foreground h-2 rounded-full transition-all"
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
  )
}
