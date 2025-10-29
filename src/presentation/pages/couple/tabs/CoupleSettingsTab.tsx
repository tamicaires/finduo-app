import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'
import { Label } from '@presentation/components/ui/label'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { toast } from 'sonner'

interface CoupleSettings {
  free_spending_a_monthly: number
  free_spending_b_monthly: number
  reset_day: number
}

export function CoupleSettingsTab() {
  const [settings, setSettings] = useState<CoupleSettings>({
    free_spending_a_monthly: 0,
    free_spending_b_monthly: 0,
    reset_day: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(API_ROUTES.GET_COUPLE_INFO)
      const { couple, currentUser, partner } = response.data

      setSettings({
        free_spending_a_monthly: currentUser.free_spending_monthly,
        free_spending_b_monthly: partner.free_spending_monthly,
        reset_day: couple.reset_day,
      })
    } catch (error) {
      toast.error('Erro ao carregar configurações')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await apiClient.patch(API_ROUTES.UPDATE_COUPLE_SETTINGS, settings)
      toast.success('Configurações atualizadas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Casal</CardTitle>
          <CardDescription>
            Ajuste os limites de gastos livres e o dia de reset mensal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Free Spending Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Gastos Livres Mensais</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user_a">Seu Limite Mensal</Label>
                <Input
                  id="user_a"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.free_spending_a_monthly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      free_spending_a_monthly: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_b">Limite do Parceiro</Label>
                <Input
                  id="user_b"
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.free_spending_b_monthly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      free_spending_b_monthly: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Reset Day Setting */}
          <div className="space-y-2">
            <Label htmlFor="reset_day">Dia de Reset Mensal</Label>
            <Input
              id="reset_day"
              type="number"
              min="1"
              max="28"
              value={settings.reset_day}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  reset_day: parseInt(e.target.value) || 1,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Dia do mês em que os gastos livres serão resetados (1-28)
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
