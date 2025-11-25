import { MdAccountBalanceWallet, MdCreditCard } from 'react-icons/md'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@presentation/components/ui/responsive-dialog'
import { Button } from '@presentation/components/ui/button'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form/InputField'
import { SelectField } from '@presentation/components/form/SelectField'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { DialogWrapper } from '@presentation/components/shared/DialogWrapper'
import { MultiStepForm } from '@presentation/components/ui/multi-step-form'
import { AccountTypeLabels } from '@core/enums/AccountType'
import { useUpdateAccount } from '@application/hooks/use-update-account'
import { useUpdateAccountDialogStore } from '@presentation/stores/use-update-account-dialog'
import { useIsMobile } from '@presentation/hooks/use-is-mobile'
import { useHaptics } from '@presentation/hooks/use-haptics'
import type { Account } from '@core/entities/Account'

interface UpdateAccountDialogProps {
  account: Account | null
}

export function UpdateAccountDialog({ account }: UpdateAccountDialogProps) {
  const { isOpen } = useUpdateAccountDialogStore()
  const { form, handleSubmit, handleClose, isPending, canSubmit } = useUpdateAccount(account)
  const isMobile = useIsMobile()
  const haptics = useHaptics()

  const accountTypeOptions = Object.entries(AccountTypeLabels).map(([value, label]) => ({
    value,
    label,
  }))

  if (!account) return null

  const onSubmit = (e: React.FormEvent) => {
    haptics.medium()
    handleSubmit(e)
  }

  // Step contents for mobile multi-step form
  const step1Content = (
    <InputField
      name="name"
      label="Nome da Conta"
      placeholder="Ex: Conta Corrente Nubank"
      icon={MdAccountBalanceWallet}
      required
    />
  )

  const step2Content = (
    <SelectField
      name="type"
      label="Tipo de Conta"
      placeholder="Selecione o tipo"
      options={accountTypeOptions}
      icon={MdCreditCard}
      required
    />
  )

  const mobileSteps = [
    {
      title: 'Nome da Conta',
      description: 'Como você identifica esta conta',
      content: step1Content,
      validate: async () => {
        const name = form.getValues('name')
        return !!(name && name.trim().length > 0)
      },
    },
    {
      title: 'Tipo de Conta',
      description: 'Categoria desta conta',
      content: step2Content,
    },
  ]

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={handleClose}>
      <ResponsiveDialogContent className={isMobile ? 'p-0' : ''}>
        {!isMobile && (
          <ResponsiveDialogHeader>
            <DialogWrapper
              icon={MdAccountBalanceWallet}
              description="Atualize as informações da sua conta financeira"
            >
              <ResponsiveDialogTitle>Editar Conta</ResponsiveDialogTitle>
            </DialogWrapper>
          </ResponsiveDialogHeader>
        )}

        <Form {...form}>
          <form id="update-account-form" onSubmit={onSubmit} className={isMobile ? '' : 'space-y-4'}>
            {isMobile ? (
              <MultiStepForm
                steps={mobileSteps}
                onComplete={() => {
                  const formElement = document.getElementById('update-account-form') as HTMLFormElement
                  formElement?.requestSubmit()
                }}
                onCancel={handleClose}
              />
            ) : (
              <>
                {step1Content}
                {step2Content}

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
              </>
            )}
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
