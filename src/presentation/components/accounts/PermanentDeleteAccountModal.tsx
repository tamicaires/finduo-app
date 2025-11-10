import { useState } from "react";
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
import { Card, CardContent } from "@presentation/components/ui/card";
import { Badge } from "@presentation/components/ui/badge";
import { Input } from "@presentation/components/ui/input";
import { AlertIcon } from "@presentation/components/icons/AlertIcon";
import { Trash2, Zap, Shield } from "lucide-react";
import type { Account } from "@core/entities/Account";
import { formatCurrency } from "@shared/utils/format-currency";
import { AccountTypeLabels } from "@core/enums/AccountType";
import { useDeleteAccount } from "@application/hooks/use-delete-account";
import { usePermanentDeleteAccountDialogStore } from "@presentation/stores/use-permanent-delete-account-dialog";

interface PermanentDeleteAccountModalProps {
  account: Account | null;
}

export function PermanentDeleteAccountModal({
  account,
}: PermanentDeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const { isOpen, closeDialog } = usePermanentDeleteAccountDialogStore();
  const { handleDeleteAccount, isDeletingAccount } = useDeleteAccount();

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText("");
      closeDialog();
    }
  };

  const handleConfirm = () => {
    if (!account) return;
    handleDeleteAccount(account.id);
    setConfirmText("");
  };

  if (!account) return null;

  const isConfirmed = confirmText === "EXCLUIR";

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-lg border-2 border-red-200 dark:border-red-900">
        <AlertDialogHeader>
          <AlertIcon variant="destructive" />
          <AlertDialogTitle className="text-center text-xl text-red-600 dark:text-red-400">
            ⚠️ Atenção
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="text-center space-y-2">
              {/* <p className="text-base font-semibold text-foreground">
                EXCLUSÃO PERMANENTE E IRREVERSÍVEL
              </p> */}
              <p className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita. Todos os dados serão perdidos
                para sempre.
              </p>
            </div>

            <Card className="border-2 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
              <CardContent className="pt-4 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-foreground">
                    {account.name}
                  </p>
                  <Badge variant="destructive" className="text-xs">
                    {AccountTypeLabels[account.type]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Saldo atual</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-lg p-4 space-y-3">
              <p className="font-bold text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                {/* <XCircle className="h-5 w-5" /> */}O que será DELETADO
                PERMANENTEMENTE:
              </p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-md bg-red-100 dark:bg-red-950">
                    <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      A conta completa
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Incluindo todas as configurações e saldo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-md bg-red-100 dark:bg-red-950">
                    <Zap className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      TODAS as transações
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Histórico completo será apagado
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-md bg-red-100 dark:bg-red-950">
                    <Shield className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      Parcelamentos ativos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Todos os templates de parcelamento
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground">
                Para confirmar, digite{" "}
                <code className="px-2 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 rounded font-bold text-base">
                  EXCLUIR
                </code>
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Digite EXCLUIR"
                disabled={isDeletingAccount}
                className={`font-bold text-center text-lg ${
                  isConfirmed
                    ? "border-red-500 bg-red-50 dark:bg-red-950/50"
                    : "border-gray-300"
                }`}
                autoComplete="off"
                autoFocus
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={closeDialog}
            disabled={isDeletingAccount}
            className="w-full sm:w-full"
          >
            Cancelar e Manter Seguro
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeletingAccount}
            className="w-full sm:w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeletingAccount ? "Deletando..." : "Sim, Deletar Permanentemente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
