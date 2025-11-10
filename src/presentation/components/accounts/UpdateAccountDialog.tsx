import { MdAccountBalanceWallet, MdCreditCard } from 'react-icons/md'
import { Dialog, DialogContent, DialogTitle } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { AccountTypeLabels } from '@core/enums/AccountType'
import { useUpdateAccount } from '@application/hooks/use-update-account'
import { useUpdateAccountDialogStore } from '@presentation/stores/use-update-account-dialog'
import type { Account } from '@core/entities/Account'

interface UpdateAccountDialogProps {
  account: Account | null
}

export function UpdateAccountDialog({ account }: UpdateAccountDialogProps) {
  const { isOpen } = useUpdateAccountDialogStore()
  const { form, handleSubmit, handleClose, isPending, canSubmit } = useUpdateAccount(account)

  const accountTypeOptions = Object.entries(AccountTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  if (!account) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogWrapper
          icon={MdAccountBalanceWallet}
          description="Atualize as informações da sua conta financeira"
        >
          <DialogTitle>Editar Conta</DialogTitle>
        </DialogWrapper>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || !canSubmit}>
                {isPending ? <LoadingSpinner size="sm" /> : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
