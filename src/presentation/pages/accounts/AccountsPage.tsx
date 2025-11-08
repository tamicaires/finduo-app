import { useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiDotsVertical } from "react-icons/hi";
import {
  MdAccountBalance,
  MdCreditCard,
  MdSavings,
  MdWallet,
  MdPeople,
  MdPerson,
  MdSwapHoriz,
} from "react-icons/md";
import { toast } from "sonner";
import { useAccounts } from "@application/hooks/use-accounts";
import { Button } from "@presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@presentation/components/ui/card";
import { Badge } from "@presentation/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@presentation/components/ui/dropdown-menu";
import { LoadingSpinner } from "@presentation/components/shared/LoadingSpinner";
import { AccountFormDialog } from "@presentation/components/accounts/AccountFormDialog";
import { AccountVisibilityDialog } from "@presentation/components/accounts/AccountVisibilityDialog";
import { DeleteAccountDialog } from "@presentation/components/accounts/DeleteAccountDialog";
import { useDeleteAccountDialogStore } from "@presentation/stores/use-delete-account-dialog";
import { AccountType, AccountTypeLabels } from "@core/enums/AccountType";
import { formatCurrency } from "@shared/utils/format-currency";
import type { Account } from "@core/entities/Account";
import type { CreateAccountDto } from "@infrastructure/repositories/account.repository";

export function AccountsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();

  const { openDialog: openDeleteDialog } = useDeleteAccountDialogStore();

  const {
    accounts,
    isLoading,
    createAccount,
    updateAccount,
    toggleVisibility,
    isCreating,
    isUpdating,
    isTogglingVisibility,
  } = useAccounts();

  const handleCreate = (data: CreateAccountDto) => {
    createAccount(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        toast.success("Conta criada com sucesso!", {
          description: `${data.name} - ${AccountTypeLabels[data.type]}`,
        });
      },
      onError: () => {
        toast.error("Erro ao criar conta", {
          description: "Tente novamente mais tarde",
        });
      },
    });
  };

  const handleUpdate = (data: CreateAccountDto) => {
    if (!selectedAccount) return;
    updateAccount(
      { id: selectedAccount.id, data: { name: data.name, type: data.type } },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast.success("Conta atualizada com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao atualizar conta");
        },
      }
    );
  };

  const handleDelete = (account: Account) => {
    openDeleteDialog(account.id, account.name);
  };

  const handleOpenDialog = (account?: Account) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAccount(undefined);
  };

  const handleOpenVisibilityDialog = (account: Account) => {
    setSelectedAccount(account);
    setIsVisibilityDialogOpen(true);
  };

  const handleToggleVisibility = (accountId: string, isPersonal: boolean) => {
    toggleVisibility(
      { id: accountId, isPersonal },
      {
        onSuccess: () => {
          setIsVisibilityDialogOpen(false);
          setSelectedAccount(undefined);
          toast.success("Visibilidade da conta alterada com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao alterar visibilidade da conta");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const accountsList = Array.isArray(accounts) ? accounts : [];
  const totalBalance = accountsList.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  // Helper para retornar o ícone correto baseado no tipo de conta
  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.CHECKING:
        return (
          <MdAccountBalance className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        );
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
        {/* Header - Mobile otimizado */}
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold">Contas</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {accountsList.length}{" "}
              {accountsList.length === 1 ? "conta" : "contas"}
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="h-10 md:h-11"
            size="sm"
          >
            <HiPlus className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Cadastrar Conta</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        {/* Card de Saldo Total - Mobile otimizado */}
        <div className="mb-4 md:mb-6">
          <Card className="bg-gradient-to-br from-primary to-orange-600 text-white border-0">
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-orange-100 flex items-center gap-2">
                <MdWallet className="h-4 w-4" />
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl md:text-4xl font-bold">
                {formatCurrency(totalBalance)}
              </p>
              <p className="text-xs md:text-sm text-orange-100 mt-2">
                Soma de todas as contas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas - Mobile em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {accountsList.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-8 md:p-12 text-center text-muted-foreground">
                <MdWallet className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-sm md:text-base">Nenhuma conta cadastrada</p>
                <p className="text-xs md:text-sm mt-2">
                  Clique em "Nova" para adicionar uma conta
                </p>
              </CardContent>
            </Card>
          ) : (
            accountsList.map((account) => (
              <Card
                key={account.id}
                className="overflow-hidden hover:shadow-md transition-shadow group"
              >
                <CardContent className="px-4 md:px-5">
                  <div className=" flex justify-end -mr-5">
                    {account.is_joint ? (
                      <Badge
                        variant="default"
                        className="text-xs flex items-center gap-1 rounded-none rounded-bl-lg"
                      >
                        <MdPeople className="h-3 w-3" />
                        Conjunta
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1 rounded-none rounded-bl-lg"
                      >
                        <MdPerson className="h-3 w-3" />
                        Pessoal
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    {/* Ícone e Nome */}

                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                        {getAccountIcon(account.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center  justify-between gap-2">
                          <p className="font-bold text-sm md:text-base truncate">
                            {account.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {AccountTypeLabels[account.type]}
                        </p>
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
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(account)}
                          >
                            <HiPencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenVisibilityDialog(account)}
                          >
                            <MdSwapHoriz className="mr-2 h-4 w-4" />
                            Alterar Visibilidade
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(account)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <HiTrash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Saldo */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Saldo atual
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <AccountFormDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          onSubmit={selectedAccount ? handleUpdate : handleCreate}
          account={selectedAccount}
          isLoading={isCreating || isUpdating}
        />

        <AccountVisibilityDialog
          account={selectedAccount || null}
          open={isVisibilityDialogOpen}
          onOpenChange={setIsVisibilityDialogOpen}
          onConfirm={handleToggleVisibility}
          isPending={isTogglingVisibility}
        />

        <DeleteAccountDialog />
      </div>
    </div>
  );
}
