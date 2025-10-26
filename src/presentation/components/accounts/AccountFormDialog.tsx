import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MdAccountBalanceWallet, MdCreditCard, MdAttachMoney } from 'react-icons/md'
import { Dialog, DialogContent, DialogTitle } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { AccountType, AccountTypeLabels } from '@core/enums/AccountType'
import type { Account } from '@core/entities/Account'

const accountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(AccountType, {
    message: 'Tipo é obrigatório'
  }),
  initial_balance: z.string().min(1, 'Saldo inicial é obrigatório'),
})

type AccountFormData = z.infer<typeof accountSchema>

interface AccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; type: AccountType; initial_balance: number }) => void
  account?: Account
  isLoading?: boolean
}

export function AccountFormDialog({
  open,
  onOpenChange,
  onSubmit,
  account,
  isLoading,
}: AccountFormDialogProps) {
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: AccountType.CHECKING,
      initial_balance: '0',
    },
  })

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
        initial_balance: account.balance.toString(),
      })
    } else {
      form.reset({
        name: '',
        type: AccountType.CHECKING,
        initial_balance: '0',
      })
    }
  }, [account, form])

  const handleSubmit = (data: AccountFormData) => {
    onSubmit({
      name: data.name,
      type: data.type,
      initial_balance: parseFloat(data.initial_balance),
    })
  }

  const accountTypeOptions = Object.entries(AccountTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogWrapper
          icon={MdAccountBalanceWallet}
          description={
            account
              ? 'Atualize as informações da sua conta financeira'
              : 'Crie uma nova conta para gerenciar suas finanças do casal'
          }
        >
          <DialogTitle>{account ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
        </DialogWrapper>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InputField
              name="name"
              label="Nome da Conta"
              placeholder="Ex: Conta Corrente Nubank"
              icon={MdAccountBalanceWallet}
              required
            />

            <SelectField
              name="type"
              label="Tipo de Conta"
              placeholder="Selecione o tipo"
              options={accountTypeOptions}
              icon={MdCreditCard}
              required
            />

            {!account && (
              <InputField
                name="initial_balance"
                label="Saldo Inicial"
                type="number"
                step="0.01"
                placeholder="0.00"
                icon={MdAttachMoney}
                required
              />
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : account ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
