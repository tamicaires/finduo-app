import { useState, useMemo } from 'react'
import { MdPeople, MdPerson, MdSwapHoriz, MdAccountBalanceWallet } from 'react-icons/md'
import { Dialog, DialogContent } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { Badge } from '@presentation/components/ui/badge'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import type { Account } from '@core/entities/Account'
import { AccountTypeLabels } from '@core/enums/AccountType'

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
      <DialogContent className="max-w-2xl p-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-orange-600 text-white rounded-t-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <MdSwapHoriz className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Alterar Visibilidade</h3>
              <p className="text-sm text-white/80">Escolha quem pode acessar esta conta</p>
            </div>
          </div>
        </div>

        {/* Account Info Banner */}
        <div className="px-6 pt-6">
          <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MdAccountBalanceWallet className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Conta
                </p>
                <p className="font-bold text-lg truncate">{account.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {AccountTypeLabels[account.type]}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  {account.is_joint ? (
                    <Badge variant="default" className="text-xs">
                      <MdPeople className="mr-1 h-3 w-3" />
                      Conjunta
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <MdPerson className="mr-1 h-3 w-3" />
                      Pessoal
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Horizontal Layout: Current -> Arrow -> New */}
          <div className="flex items-stretch gap-4">
            {/* Current State */}
            {currentOption && (
              <div className="flex-1 bg-muted/50 rounded-lg px-4 pb-4 border-2 border-muted">
                <div className="flex flex-col h-full">
                  <Badge variant="secondary" className="text-xs w-fit rounded-none rounded-r-lg -ml-4">
                    Atual
                  </Badge>
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${account.is_joint ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}`}>
                      {currentOption.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{currentOption.label}</p>
                      <p className="text-xs text-muted-foreground">{currentOption.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Arrow Separator */}
            <div className="flex items-center justify-center">
              <div className="p-3 rounded-full bg-muted">
                <MdSwapHoriz className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>

            {/* New Option */}
            {visibilityOptions
              .filter((option) => option.id !== currentOption?.id)
              .map((option) => {
                const isSelected = option.id === selectedOptionId

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    disabled={isPending}
                    className={`flex-1 text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-3 h-full">
                      <div className={`p-2 rounded-lg ${option.id === 'joint' ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-secondary-foreground'}`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>

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
        </div>
      </DialogContent>
    </Dialog>
  )
}
