import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@presentation/components/ui/dialog'
import { InputField } from '@presentation/components/form/InputField'
import { Input } from '@presentation/components/ui/input'
import { Button } from '@presentation/components/ui/button'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { toast } from 'sonner'
import { Copy, Check, Mail, UserPlus, Link2, User } from 'lucide-react'
import { Card, CardContent } from '@presentation/components/ui/card'

const createInviteSchema = z.object({
  invitee_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  invitee_email: z.string().email('Email inválido'),
})

type CreateInviteFormData = z.infer<typeof createInviteSchema>

interface CreateCoupleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateCoupleDialog({ open, onOpenChange, onSuccess }: CreateCoupleDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm<CreateInviteFormData>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      invitee_name: '',
      invitee_email: '',
    },
  })

  const handleCopyLink = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast.success('Link copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setInviteLink(null)
    form.reset()
    onOpenChange(false)
    if (inviteLink && onSuccess) {
      onSuccess()
    }
  }

  const onSubmit = async (data: CreateInviteFormData) => {
    try {
      setIsLoading(true)
      const response = await apiClient.post(API_ROUTES.CREATE_INVITE, data)

      setInviteLink(response.data.invite.invite_link)
      toast.success('Convite criado com sucesso!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar convite'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Criar Casal
          </DialogTitle>
          <DialogDescription>
            {inviteLink
              ? 'Compartilhe o link abaixo com seu parceiro(a)'
              : 'Informe os dados do seu parceiro(a) para gerar o convite'
            }
          </DialogDescription>
        </DialogHeader>

        {!inviteLink ? (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                name="invitee_name"
                label="Nome do parceiro(a)"
                icon={User}
                placeholder="Maria Santos"
                disabled={isLoading}
                required
              />

              <InputField
                name="invitee_email"
                label="Email do parceiro(a)"
                icon={Mail}
                type="email"
                placeholder="maria@exemplo.com"
                disabled={isLoading}
                required
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Gerando convite...' : 'Gerar Convite'}
                </Button>
              </div>
            </form>
          </FormProvider>
        ) : (
          <div className="space-y-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link2 className="h-4 w-4" />
                  <span>Link do convite</span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Este link expira em 7 dias
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Próximos passos:
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Compartilhe o link com seu parceiro(a)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Ele(a) criará a conta através do link</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>O casal será criado automaticamente</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Vocês poderão gerenciar as finanças juntos!</span>
                </li>
              </ol>
            </div>

            <Button onClick={handleClose} className="w-full">
              Concluir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
