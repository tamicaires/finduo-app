import { useState, useMemo } from 'react'
import { MdPeople, MdPerson, MdSwapHoriz } from 'react-icons/md'
import { Dialog, DialogContent } from '@presentation/components/ui/dialog'
import { Card, CardContent, CardHeader } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Badge } from '@presentation/components/ui/badge'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import type { Account } from '@core/entities/Account'

interface VisibilityOption {
  id: 'joint' | 'personal'
  label: string
  description: string
  icon: React.ReactNode
  value: boolean // is_personal value
}

const visibilityOptions: VisibilityOption[] = [
  {
    id: 'joint',
    label: 'Conta Conjunta',
    description: 'Ambos os parceiros podem visualizar e gerenciar',
    icon: <MdPeople className="w-5 h-5" />,
    value: false, // is_personal = false
  },
  {
    id: 'personal',
    label: 'Conta Pessoal',
    description: 'Apenas você pode visualizar e gerenciar',
    icon: <MdPerson className="w-5 h-5" />,
    value: true, // is_personal = true
  },
]

interface AccountVisibilityDialogProps {
  account: Account | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (accountId: string, isPersonal: boolean) => void
  isPending?: boolean
}

export function AccountVisibilityDialog({
  account,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: AccountVisibilityDialogProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<'joint' | 'personal' | null>(null)

  const currentOption = useMemo(() => {
    if (!account) return null
    return visibilityOptions.find((opt) => opt.value === !account.is_joint)
  }, [account])

  const selectedOption = useMemo(() => {
    return visibilityOptions.find((opt) => opt.id === selectedOptionId)
  }, [selectedOptionId])

  const handleConfirm = () => {
    if (account && selectedOption) {
      onConfirm(account.id, selectedOption.value)
    }
  }

  const handleCancel = () => {
    setSelectedOptionId(null)
    onOpenChange(false)
  }

  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <Card className="border-0 shadow-none">
          <CardHeader className="bg-gradient-to-br from-primary to-orange-600 text-white rounded-t-lg pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/20">
                <MdSwapHoriz className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Alterar Visibilidade</h3>
                <p className="text-sm text-white/80">Escolha quem pode acessar esta conta</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80 mb-1">Conta</p>
              <p className="font-bold text-lg">{account.name}</p>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Current Visibility */}
            {currentOption && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Visibilidade Atual</p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${account.is_joint ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}`}>
                    {currentOption.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{currentOption.label}</p>
                    <p className="text-sm text-muted-foreground">{currentOption.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Escolha a nova visibilidade:</p>
              {visibilityOptions.map((option) => {
                const isCurrent = option.id === currentOption?.id
                const isSelected = option.id === selectedOptionId

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    disabled={isPending || isCurrent}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : isCurrent
                        ? 'border-muted bg-muted/30 cursor-not-allowed'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${option.id === 'joint' ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{option.label}</p>
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Summary */}
            {selectedOption && selectedOption.id !== currentOption?.id && (
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Resumo da Alteração</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">{currentOption?.label}</span>
                  <MdSwapHoriz className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">{selectedOption.label}</span>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isPending || !selectedOption || selectedOption.id === currentOption?.id}
              >
                {isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Alterando...
                  </>
                ) : (
                  'Confirmar Alteração'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
