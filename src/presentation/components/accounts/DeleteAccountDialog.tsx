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
import { AlertIcon } from '@presentation/components/icons/AlertIcon'
import { useDeleteAccountDialogStore } from '@presentation/stores/use-delete-account-dialog'
import { useAccounts } from '@application/hooks/use-accounts'
import { toast } from 'sonner'

export function DeleteAccountDialog() {
  const { isOpen, closeDialog, accountId, accountName } = useDeleteAccountDialogStore()
  const { deleteAccount, isDeleting } = useAccounts()

  const handleDelete = () => {
    if (!accountId) return

    deleteAccount(accountId, {
      onSuccess: () => {
        closeDialog()
        toast.success('Conta excluída com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao excluir conta')
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertIcon />
          <AlertDialogTitle>Confirmar Exclusão de Conta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita. A conta{" "}
            <strong>{accountName}</strong> será excluída permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="w-1/2">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white w-1/2"
          >
            {isDeleting ? "Excluindo..." : "Sim, Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
