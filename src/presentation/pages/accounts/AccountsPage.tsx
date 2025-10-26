import { useState } from 'react'
import { Plus, Pencil, Trash2, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useAccounts } from '@application/hooks/use-accounts'
import { Button } from '@presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { AccountFormDialog } from '@presentation/components/accounts/AccountFormDialog'
import { AccountTypeLabels } from '@core/enums/AccountType'
import { formatCurrency } from '@shared/utils/format-currency'
import type { Account } from '@core/entities/Account'
import type { CreateAccountDto } from '@infrastructure/repositories/account.repository'

export function AccountsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>()

  const {
    accounts,
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAccounts()

  const handleCreate = (data: CreateAccountDto) => {
    createAccount(data, {
      onSuccess: () => {
        setIsDialogOpen(false)
        toast.success('Conta criada com sucesso!', {
          description: `${data.name} - ${AccountTypeLabels[data.type]}`
        })
      },
      onError: () => {
        toast.error('Erro ao criar conta', {
          description: 'Tente novamente mais tarde'
        })
      }
    })
  }

  const handleUpdate = (data: CreateAccountDto) => {
    if (!selectedAccount) return
    updateAccount(
      { id: selectedAccount.id, data: { name: data.name, type: data.type } },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
          toast.success('Conta atualizada com sucesso!')
        },
        onError: () => {
          toast.error('Erro ao atualizar conta')
        }
      }
    )
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      deleteAccount(id, {
        onSuccess: () => {
          toast.success('Conta excluída com sucesso!')
        },
        onError: () => {
          toast.error('Erro ao excluir conta')
        }
      })
    }
  }

  const handleOpenDialog = (account?: Account) => {
    setSelectedAccount(account)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedAccount(undefined)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const accountsList = Array.isArray(accounts) ? accounts : []
  const totalBalance = accountsList.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Contas</h2>
            <p className="text-sm text-muted-foreground">Gerencie suas contas bancárias</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        <div className="mb-4 md:mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {formatCurrency(totalBalance)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {accountsList.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma conta cadastrada
                </div>
              ) : (
                accountsList.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {account.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{AccountTypeLabels[account.type]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-sm">
                            {formatCurrency(account.balance)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Saldo atual
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(account)}
                            disabled={isDeleting}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(account.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <AccountFormDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          onSubmit={selectedAccount ? handleUpdate : handleCreate}
          account={selectedAccount}
          isLoading={isCreating || isUpdating}
        />
      </div>
    </div>
  )
}
