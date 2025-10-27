import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Label } from '@presentation/components/ui/label'
import { Input } from '@presentation/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@presentation/components/ui/select'

interface CoupleInfo {
  couple: {
    id: string
    created_at: string
    reset_day: number
  }
  currentUser: {
    id: string
    name: string
    email: string
    free_spending_monthly: number
    free_spending_remaining: number
  }
  partner: {
    id: string
    name: string
    email: string
    free_spending_monthly: number
    free_spending_remaining: number
  }
}

export function SettingsPage() {
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null)
  const [resetDay, setResetDay] = useState<number>(1)
  const [myFreeSpending, setMyFreeSpending] = useState<number>(0)
  const [partnerFreeSpending, setPartnerFreeSpending] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchCoupleInfo()
  }, [])

  const fetchCoupleInfo = async () => {
    try {
      setIsFetching(true)
      const response = await apiClient.get<CoupleInfo>(API_ROUTES.GET_COUPLE_INFO)
      setCoupleInfo(response.data)
      setResetDay(response.data.couple.reset_day)
      setMyFreeSpending(response.data.currentUser.free_spending_monthly)
      setPartnerFreeSpending(response.data.partner.free_spending_monthly)
    } catch (err) {
      toast.error('Erro ao carregar configurações')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true)
      await apiClient.patch(API_ROUTES.UPDATE_COUPLE_SETTINGS, {
        reset_day: resetDay,
      })
      toast.success('Configurações salvas com sucesso!')
    } catch (err) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMyFreeSpending = async () => {
    try {
      setIsLoading(true)
      await apiClient.put(API_ROUTES.UPDATE_FREE_SPENDING, {
        new_monthly_amount: myFreeSpending,
      })
      toast.success('Seu limite de gasto livre atualizado com sucesso!')
      await fetchCoupleInfo()
    } catch (err) {
      toast.error('Erro ao atualizar seu limite de gasto livre')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  if (isFetching) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground mb-6">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground mb-6">
          Gerencie as configurações do casal
        </p>

        <div className="space-y-6">
          {/* Configuração de Gasto Livre */}
          <Card>
            <CardHeader>
              <CardTitle>Gasto Livre</CardTitle>
              <CardDescription>
                Configure quando o gasto livre deve ser renovado a cada mês
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-day">Dia de Renovação</Label>
                <Select
                  value={resetDay.toString()}
                  onValueChange={(value) => setResetDay(Number(value))}
                >
                  <SelectTrigger id="reset-day">
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfMonth.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        Dia {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  O gasto livre será renovado automaticamente neste dia de cada mês
                </p>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Salvando...' : 'Salvar Dia de Renovação'}
              </Button>
            </CardContent>
          </Card>

          {/* Limites de Gasto Livre Individual */}
          <Card>
            <CardHeader>
              <CardTitle>Limites de Gasto Livre</CardTitle>
              <CardDescription>
                Configure o valor mensal de gasto livre para você e seu parceiro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Meu Limite */}
              <div className="space-y-4 p-4 border rounded-lg bg-orange-500/5 border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-orange-700 dark:text-orange-400">
                      {coupleInfo?.currentUser.name || 'Você'}
                    </h3>
                    <p className="text-sm text-muted-foreground">Seu limite mensal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Disponível</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(coupleInfo?.currentUser.free_spending_remaining || 0)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="my-limit">Limite Mensal (R$)</Label>
                  <Input
                    id="my-limit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={myFreeSpending}
                    onChange={(e) => setMyFreeSpending(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleUpdateMyFreeSpending}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? 'Salvando...' : 'Atualizar Meu Limite'}
                </Button>
              </div>

              {/* Limite do Parceiro - Apenas Visualização */}
              <div className="space-y-4 p-4 border rounded-lg bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                      {coupleInfo?.partner.name || 'Parceiro(a)'}
                    </h3>
                    <p className="text-sm text-muted-foreground">Limite mensal do parceiro</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Disponível</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(coupleInfo?.partner.free_spending_remaining || 0)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner-limit">Limite Mensal (R$)</Label>
                  <Input
                    id="partner-limit"
                    type="number"
                    value={partnerFreeSpending}
                    disabled
                    className="w-full bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Apenas o parceiro pode alterar seu próprio limite
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
