import { useState } from 'react'
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
import { Input } from '@presentation/components/ui/input'
import { AlertIcon } from '@presentation/components/icons/AlertIcon'
import { useDeleteAccountDialogStore } from '@presentation/stores/use-delete-account-dialog'
import { useAccounts } from '@application/hooks/use-accounts'
import { toast } from 'sonner'

export function DeleteAccountDialog() {
  const { isOpen, closeDialog, accountId, accountName } = useDeleteAccountDialogStore()
  const { deleteAccount, isDeleting } = useAccounts()
  const [confirmText, setConfirmText] = useState('')

  const isConfirmed = confirmText === 'EXCLUIR'

  const handleDelete = () => {
    if (!accountId || !isConfirmed) return

    deleteAccount(accountId, {
      onSuccess: () => {
        closeDialog()
        setConfirmText('')
        toast.success('Conta excluída permanentemente!')
      },
      onError: () => {
        toast.error('Erro ao excluir conta')
      },
    })
  }

  const handleClose = () => {
    setConfirmText('')
    closeDialog()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertIcon />
          <AlertDialogTitle className="text-destructive">
            ⚠️ Exclusão Permanente
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Você está prestes a excluir permanentemente a conta{' '}
              <strong>{accountName}</strong>.
            </p>
            <div className="bg-destructive/10 p-3 rounded-md space-y-2 text-sm">
              <p className="font-semibold text-destructive">Esta ação irá:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Apagar permanentemente a conta</li>
                <li>Apagar TODAS as transações da conta</li>
                <li>Apagar TODOS os parcelamentos da conta</li>
              </ul>
            </div>
            <p className="font-bold text-destructive">
              ⚠️ ESTA AÇÃO NÃO PODE SER DESFEITA
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Digite <strong>EXCLUIR</strong> para confirmar:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Digite EXCLUIR"
                disabled={isDeleting}
                className="font-mono"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="w-1/2">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmed}
            className="bg-destructive hover:bg-destructive/90 text-white w-1/2"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
