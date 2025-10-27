import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Label } from '@presentation/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@presentation/components/ui/select'

interface CoupleSettings {
  id: string
  reset_day: number
  updated_at: string
}

export function SettingsPage() {
  const [resetDay, setResetDay] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchCoupleInfo()
  }, [])

  const fetchCoupleInfo = async () => {
    try {
      setIsFetching(true)
      const response = await apiClient.get(API_ROUTES.GET_COUPLE_INFO)
      setResetDay(response.data.couple.reset_day)
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
                {isLoading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
