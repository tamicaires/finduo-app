import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { MdHandshake, MdSwapHoriz, MdTune, MdWarning } from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'
import { FINANCIAL_MODEL_LABELS, FINANCIAL_MODEL_DESCRIPTIONS } from '@/shared/constants/financial-model'
import type { FinancialModel } from '@/core/entities/Couple'

interface ChangeFinancialModelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentModel: FinancialModel
  onConfirm: (newModel: FinancialModel, reason?: string) => Promise<void>
}

const MODEL_ICONS: Record<FinancialModel, React.ComponentType<{ className?: string }>> = {
  TRANSPARENT: MdHandshake,
  AUTONOMOUS: MdSwapHoriz,
  CUSTOM: MdTune,
}

export function ChangeFinancialModelDialog({
  open,
  onOpenChange,
  currentModel,
  onConfirm,
}: ChangeFinancialModelDialogProps) {
  const [newModel, setNewModel] = useState<FinancialModel>(currentModel)
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm(newModel, reason || undefined)
      onOpenChange(false)
      setReason('')
    } catch (error) {
      console.error('Failed to update financial model:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanged = newModel !== currentModel

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Mudar Modelo Financeiro
          </DialogTitle>
          <DialogDescription>
            Esta mudança afetará quais recursos estão disponíveis para o casal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Modelo Atual</Label>
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = MODEL_ICONS[currentModel]
                return <Icon className="h-4 w-4 text-primary" />
              })()}
              <Badge variant="secondary" className="text-sm">
                {FINANCIAL_MODEL_LABELS[currentModel]}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-model">Novo Modelo</Label>
            <Select value={newModel} onValueChange={(value) => setNewModel(value as FinancialModel)}>
              <SelectTrigger id="new-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRANSPARENT">
                  <div className="flex items-center gap-2">
                    <MdHandshake className="h-4 w-4" />
                    {FINANCIAL_MODEL_LABELS.TRANSPARENT}
                  </div>
                </SelectItem>
                <SelectItem value="AUTONOMOUS">
                  <div className="flex items-center gap-2">
                    <MdSwapHoriz className="h-4 w-4" />
                    {FINANCIAL_MODEL_LABELS.AUTONOMOUS}
                  </div>
                </SelectItem>
                <SelectItem value="CUSTOM">
                  <div className="flex items-center gap-2">
                    <MdTune className="h-4 w-4" />
                    {FINANCIAL_MODEL_LABELS.CUSTOM}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {hasChanged && (
              <p className="text-sm text-muted-foreground">
                {FINANCIAL_MODEL_DESCRIPTIONS[newModel]}
              </p>
            )}
          </div>

          {hasChanged && (
            <>
              <Alert>
                <MdWarning className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Seu parceiro(a) será notificado sobre essa mudança
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo da mudança (opcional)</Label>
                <Input
                  id="reason"
                  placeholder="Ex: Decidimos ter mais autonomia financeira"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {reason.length}/200 caracteres
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasChanged || isLoading}
          >
            {isLoading ? 'Salvando...' : 'Confirmar Mudança'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
