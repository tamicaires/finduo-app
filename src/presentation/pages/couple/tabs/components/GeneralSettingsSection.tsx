import { Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Input } from '@presentation/components/ui/input'
import { Label } from '@presentation/components/ui/label'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'

interface GeneralSettingsSectionProps {
  freeSpendingA: number
  freeSpendingB: number
  resetDay: number
  isSaving: boolean
  onFreeSpendingAChange: (value: number) => void
  onFreeSpendingBChange: (value: number) => void
  onResetDayChange: (value: number) => void
  onSave: () => void
}

export function GeneralSettingsSection({
  freeSpendingA,
  freeSpendingB,
  resetDay,
  isSaving,
  onFreeSpendingAChange,
  onFreeSpendingBChange,
  onResetDayChange,
  onSave,
}: GeneralSettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
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
                value={freeSpendingA}
                onChange={(e) => onFreeSpendingAChange(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_b">Limite do Parceiro</Label>
              <Input
                id="user_b"
                type="number"
                min="0"
                step="0.01"
                value={freeSpendingB}
                onChange={(e) => onFreeSpendingBChange(parseFloat(e.target.value) || 0)}
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
            value={resetDay}
            onChange={(e) => onResetDayChange(parseInt(e.target.value) || 1)}
          />
          <p className="text-xs text-muted-foreground">
            Dia do mês em que os gastos livres serão resetados (1-28)
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
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
  )
}
