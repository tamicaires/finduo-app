import { useState } from "react";
import { HiPlus, HiPencil, HiDotsVertical } from "react-icons/hi";
import {
  MdAccountBalance,
  MdCreditCard,
  MdSavings,
  MdWallet,
  MdPeople,
  MdPerson,
  MdSwapHoriz,
} from "react-icons/md";
import { Archive, Trash2 } from "lucide-react";

// Hooks
import { useAccountsQuery } from "@application/hooks/use-accounts-query";
import { useToggleAccountVisibility } from "@application/hooks/use-toggle-account-visibility";

// Stores
import { useCreateAccountDialogStore } from "@presentation/stores/use-create-account-dialog";
import { useUpdateAccountDialogStore } from "@presentation/stores/use-update-account-dialog";
import { useArchiveAccountDialogStore } from "@presentation/stores/use-archive-account-dialog";
import { usePermanentDeleteAccountDialogStore } from "@presentation/stores/use-permanent-delete-account-dialog";
import { useAccountVisibilityDialogStore } from "@presentation/stores/use-account-visibility-dialog";

// Components
import { Button } from "@presentation/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@presentation/components/ui/card";
import { Badge } from "@presentation/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@presentation/components/ui/dropdown-menu";
import { LoadingSpinner } from "@presentation/components/shared/LoadingSpinner";
import { CreateAccountDialog } from "@presentation/components/accounts/CreateAccountDialog";
import { UpdateAccountDialog } from "@presentation/components/accounts/UpdateAccountDialog";
import { AccountVisibilityDialog } from "@presentation/components/accounts/AccountVisibilityDialog";
import { ArchiveAccountModal } from "@presentation/components/accounts/ArchiveAccountModal";
import { PermanentDeleteAccountModal } from "@presentation/components/accounts/PermanentDeleteAccountModal";

// Types & Utils
import { AccountType, AccountTypeLabels } from "@core/enums/AccountType";
import { formatCurrency } from "@shared/utils/format-currency";
import type { Account } from "@core/entities/Account";

export function AccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Stores
  const { openDialog: openCreateDialog } = useCreateAccountDialogStore();
  const { openDialog: openUpdateDialog } = useUpdateAccountDialogStore();
  const { openDialog: openArchiveDialog } = useArchiveAccountDialogStore();
  const { openDialog: openDeleteDialog } = usePermanentDeleteAccountDialogStore();
  const { openDialog: openVisibilityDialog, closeDialog: closeVisibilityDialog } = useAccountVisibilityDialogStore();

  // Query
  const { accounts, isLoading } = useAccountsQuery();

  // Mutations
  const { handleToggleVisibility, isTogglingVisibility } = useToggleAccountVisibility();

  // Handlers
  const handleOpenCreateDialog = () => {
    setSelectedAccount(null);
    openCreateDialog();
  };

  const handleOpenUpdateDialog = (account: Account) => {
    setSelectedAccount(account);
    openUpdateDialog();
  };

  const handleOpenArchiveModal = (account: Account) => {
    setSelectedAccount(account);
    openArchiveDialog();
  };

  const handleOpenDeleteModal = (account: Account) => {
    setSelectedAccount(account);
    openDeleteDialog();
  };

  const handleOpenVisibilityDialog = (account: Account) => {
    setSelectedAccount(account);
    openVisibilityDialog();
  };

  const handleConfirmVisibilityChange = (accountId: string, isPersonal: boolean) => {
    handleToggleVisibility(accountId, isPersonal);
    closeVisibilityDialog();
    setSelectedAccount(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const accountsList = Array.isArray(accounts) ? accounts : [];
  const totalBalance = accountsList.reduce((sum, account) => sum + account.balance, 0);

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.CHECKING:
        return <MdAccountBalance className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
      case AccountType.SAVINGS:
        return <MdSavings className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
      case AccountType.INVESTMENT:
        return <MdCreditCard className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
      case AccountType.WALLET:
        return <MdWallet className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
      default:
        return <MdWallet className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold">Contas</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {accountsList.length} {accountsList.length === 1 ? "conta" : "contas"}
            </p>
          </div>
          <Button onClick={handleOpenCreateDialog} className="h-10 md:h-11" size="sm">
            <HiPlus className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Cadastrar Conta</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        {/* Card de Saldo Total */}
        <div className="mb-4 md:mb-6">
          <Card className="bg-primary text-white border-0">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-orange-100 flex items-center gap-2">
                <MdWallet className="h-4 w-4" />
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl md:text-4xl font-bold">{formatCurrency(totalBalance)}</p>
              <p className="text-xs md:text-sm text-orange-100 mt-2">Soma de todas as contas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {accountsList.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-8 md:p-12 text-center text-muted-foreground">
                <MdWallet className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-sm md:text-base">Nenhuma conta cadastrada</p>
                <p className="text-xs md:text-sm mt-2">Clique em "Nova" para adicionar uma conta</p>
              </CardContent>
            </Card>
          ) : (
            accountsList.map((account) => (
              <Card key={account.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                <CardContent className="px-4 md:px-5">
                  <div className="flex justify-end -mr-5">
                    {account.is_joint ? (
                      <Badge variant="default" className="text-xs flex items-center gap-1 rounded-none rounded-bl-lg">
                        <MdPeople className="h-3 w-3" />
                        Conjunta
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1 rounded-none rounded-bl-lg">
                        <MdPerson className="h-3 w-3" />
                        Pessoal
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                        {getAccountIcon(account.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm md:text-base truncate">{account.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{AccountTypeLabels[account.type]}</p>
                      </div>
                    </div>

                    {/* Ações - Dropdown Menu */}
                    <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8"
                            disabled={isTogglingVisibility}
                          >
                            <HiDotsVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenUpdateDialog(account)}>
                            <HiPencil className="mr-2 h-4 w-4" />
                            Editar conta
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenVisibilityDialog(account)}>
                            <MdSwapHoriz className="mr-2 h-4 w-4" />
                            Alterar Visibilidade
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenArchiveModal(account)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Arquivar conta
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDeleteModal(account)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir permanentemente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Saldo */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Saldo atual</p>
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Dialogs */}
        <CreateAccountDialog />
        <UpdateAccountDialog account={selectedAccount} />

        <AccountVisibilityDialog
          account={selectedAccount}
          open={false}
          onOpenChange={closeVisibilityDialog}
          onConfirm={handleConfirmVisibilityChange}
          isPending={isTogglingVisibility}
        />

        <ArchiveAccountModal account={selectedAccount} />

        <PermanentDeleteAccountModal account={selectedAccount} />
      </div>
    </div>
  );
}
