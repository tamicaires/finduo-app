import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from "@presentation/components/ui/responsive-dialog";
import { Button } from "@presentation/components/ui/button";
import { AlertIcon } from "@presentation/components/icons/AlertIcon";
import { useDeleteTransactionDialogStore } from "@presentation/stores/use-delete-transaction-dialog";
import { useTransactions } from "@application/hooks/use-transactions";
import { useHaptics } from "@presentation/hooks/use-haptics";
import { useIsMobile } from "@presentation/hooks/use-is-mobile";
import { toast } from "sonner";

export function DeleteTransactionDialog() {
  const { isOpen, closeDialog, transactionId } =
    useDeleteTransactionDialogStore();
  const { deleteTransaction, isDeleting } = useTransactions();
  const haptics = useHaptics();
  const isMobile = useIsMobile();

  const handleDelete = () => {
    if (!transactionId) return;

    haptics.medium();
    deleteTransaction(transactionId, {
      onSuccess: () => {
        haptics.success();
        closeDialog();
        toast.success("Transação excluída com sucesso!");
      },
      onError: () => {
        haptics.error();
        toast.error("Erro ao excluir transação");
      },
    });
  };

  const handleCancel = () => {
    haptics.light();
    closeDialog();
  };

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={closeDialog}>
      <ResponsiveDialogContent className={isMobile ? 'p-0' : ''}>
        <ResponsiveDialogHeader className={isMobile ? 'px-4 pt-4' : ''}>
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertIcon />
            <ResponsiveDialogTitle>
              Confirmar Exclusão de Transação?
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Essa ação não poderá ser desfeita. A transação será excluída
              permanentemente.
            </ResponsiveDialogDescription>
          </div>
        </ResponsiveDialogHeader>

        <div className={isMobile ? 'flex flex-col gap-3 p-4' : 'flex gap-3 justify-end mt-6'}>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className={isMobile ? 'w-full h-11' : 'w-1/2'}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={isMobile ? 'w-full h-11 bg-red-600 hover:bg-red-700' : 'w-1/2 bg-red-600 hover:bg-red-700'}
          >
            {isDeleting ? "Excluindo..." : "Sim, Excluir"}
          </Button>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
