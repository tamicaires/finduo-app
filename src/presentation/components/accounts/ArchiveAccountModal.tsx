import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@presentation/components/ui/alert-dialog'
import { Card, CardContent } from '@presentation/components/ui/card'
import { Badge } from '@presentation/components/ui/badge'
import { AlertIcon } from '@presentation/components/icons/AlertIcon'
import { Archive, CheckCircle2, History, EyeOff } from 'lucide-react'
import { formatCurrency } from '@shared/utils/format-currency'
import { AccountTypeLabels } from '@core/enums/AccountType'
import { useArchiveAccount } from '@application/hooks/use-archive-account'
import { useArchiveAccountDialogStore } from '@presentation/stores/use-archive-account-dialog'
import type { Account } from '@core/entities/Account'

interface ArchiveAccountModalProps {
  account: Account | null
}

export function ArchiveAccountModal({ account }: ArchiveAccountModalProps) {
  const { isOpen, closeDialog } = useArchiveAccountDialogStore()
  const { handleArchiveAccount, isArchivingAccount } = useArchiveAccount()

  const handleConfirm = () => {
    if (!account) return
    handleArchiveAccount(account.id)
  }

  if (!account) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertIcon variant="info" />
          <AlertDialogTitle className="text-center text-xl">
            Arquivar Conta
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-center">
            <p className="text-base">
              Você está prestes a arquivar a conta:
            </p>

            <Card className="border-2 border-primary/25 bg-primary/15 ">
              <CardContent className="pt-4 pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-foreground">{account.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {AccountTypeLabels[account.type]}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(account.balance)}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <EyeOff className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Ficará oculta</p>
                  <p className="text-xs text-muted-foreground">
                    Não aparecerá mais nas listagens e saldos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <History className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Histórico preservado</p>
                  <p className="text-xs text-muted-foreground">
                    Todas as transações serão mantidas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Pode ser restaurada</p>
                  <p className="text-xs text-muted-foreground">
                    É possível reativar a conta depois
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={closeDialog}
            disabled={isArchivingAccount}
            className="w-full sm:w-full"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isArchivingAccount}
            className="w-full sm:w-full bg-orange-600 hover:bg-orange-700"
          >
            <Archive className="mr-2 h-4 w-4" />
            {isArchivingAccount ? 'Arquivando...' : 'Arquivar Conta'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
