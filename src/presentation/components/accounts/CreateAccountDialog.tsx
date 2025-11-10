import { MdAccountBalanceWallet, MdCreditCard, MdAttachMoney, MdPeople, MdPerson, MdInfo } from 'react-icons/md'
import { Dialog, DialogContent, DialogTitle } from '@presentation/components/ui/dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'
import { Label } from '@presentation/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@presentation/components/ui/radio-group'
import { AccountTypeLabels } from '@core/enums/AccountType'
import { useCreateAccount } from '@application/hooks/use-create-account'
import { useCreateAccountDialogStore } from '@presentation/stores/use-create-account-dialog'
import { useDashboard } from '@application/hooks/use-dashboard'

export function CreateAccountDialog() {
  const { isOpen } = useCreateAccountDialogStore()
  const { form, handleSubmit, handleClose, isPending, canSubmit } = useCreateAccount()
  const { dashboardData } = useDashboard()

  const accountTypeOptions = Object.entries(AccountTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  const allowPersonalAccounts = dashboardData?.couple?.allow_personal_accounts ?? false

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogWrapper
          icon={MdAccountBalanceWallet}
          description="Crie uma nova conta para gerenciar suas finanças do casal"
        >
          <DialogTitle>Nova Conta</DialogTitle>
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

            {/* Ownership Selection */}
            <div className="space-y-3">
              <Label>Titularidade da Conta</Label>
              {allowPersonalAccounts ? (
                <RadioGroup
                  value={form.watch('ownership')}
                  onValueChange={(value) => form.setValue('ownership', value as 'joint' | 'personal')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="joint" id="joint" />
                    <Label htmlFor="joint" className="font-normal cursor-pointer flex items-center gap-2">
                      <MdPeople className="h-4 w-4" />
                      Conta Conjunta (ambos têm acesso)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal" className="font-normal cursor-pointer flex items-center gap-2">
                      <MdPerson className="h-4 w-4" />
                      Conta Pessoal (apenas você tem acesso)
                    </Label>
                  </div>
                </RadioGroup>
              ) : (
                <>
                  <Alert>
                    <MdInfo className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Apenas contas conjuntas estão disponíveis no seu modelo financeiro atual.
                    </AlertDescription>
                  </Alert>
                  <input type="hidden" {...form.register('ownership')} value="joint" />
                </>
              )}
            </div>

            <InputField
              name="initial_balance"
              label="Saldo Inicial"
              type="number"
              step="0.01"
              placeholder="0.00"
              icon={MdAttachMoney}
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
                {isPending ? <LoadingSpinner size="sm" /> : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
