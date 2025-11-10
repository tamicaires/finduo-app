import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { AccountType, AccountTypeLabels } from '@core/enums/AccountType'
import { useDashboard } from '@application/hooks/use-dashboard'
import type { Account } from '@core/entities/Account'

const accountSchema = z.object({
  name: z.string({
    error: "Nome da conta é obrigatório",
  }),
  type: z.nativeEnum(AccountType, {
    message: "Tipo é obrigatório",
  }),
  initial_balance: z
    .string({
      error: "Saldo inicial é obrigatório",
    }),
  ownership: z.enum(["joint", "personal"]),
});

type AccountFormData = z.infer<typeof accountSchema>

interface AccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; type: AccountType; initial_balance?: number; is_personal?: boolean }) => void
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
  const { dashboardData } = useDashboard()

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: AccountType.CHECKING,
      initial_balance: '0',
      ownership: 'joint',
    },
  })

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
        initial_balance: account.balance.toString(),
        ownership: account.owner_id ? 'personal' : 'joint',
      })
    } else {
      form.reset({
        name: '',
        type: AccountType.CHECKING,
        initial_balance: '0',
        ownership: 'joint',
      })
    }
  }, [account, form])

  const handleSubmit = (data: AccountFormData) => {
    const is_personal = data.ownership === 'personal'

    onSubmit({
      name: data.name,
      type: data.type,
      initial_balance: parseFloat(data.initial_balance) || 0,
      is_personal,
    })
  }

  const accountTypeOptions = Object.entries(AccountTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  const allowPersonalAccounts = dashboardData?.couple?.allow_personal_accounts ?? false

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

            {!account && (
              <InputField
                name="initial_balance"
                label="Saldo Inicial"
                type="money"
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
