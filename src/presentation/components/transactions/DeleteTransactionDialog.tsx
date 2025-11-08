import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@presentation/components/ui/alert-dialog";
import { AlertIcon } from "@presentation/components/icons/AlertIcon";
import { useDeleteTransactionDialogStore } from "@presentation/stores/use-delete-transaction-dialog";
import { useTransactions } from "@application/hooks/use-transactions";
import { toast } from "sonner";

export function DeleteTransactionDialog() {
  const { isOpen, closeDialog, transactionId } =
    useDeleteTransactionDialogStore();
  const { deleteTransaction, isDeleting } = useTransactions();

  const handleDelete = () => {
    if (!transactionId) return;

    deleteTransaction(transactionId, {
      onSuccess: () => {
        closeDialog();
        toast.success("Transação excluída com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao excluir transação");
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertIcon />
          <AlertDialogTitle>Confirmar Exclusão de Transação?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita. A transação será excluída
            permanentemente.
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
