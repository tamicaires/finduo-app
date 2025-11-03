import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { InputField } from '@presentation/components/form/InputField'
import { Button } from '@presentation/components/ui/button'
import { AnimatedCoupleRings } from '@presentation/components/shared/AnimatedCoupleRings'
import { apiClient } from '@infrastructure/http/api-client'
import { API_ROUTES } from '@shared/constants/api-routes'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle, Heart, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@presentation/components/ui/alert'

const acceptInviteSchema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>

export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [inviterName, setInviterName] = useState<string>('')

  const form = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (!token) {
      toast.error('Link de convite inválido')
      navigate('/login')
    }
  }, [token, navigate])

  const onSubmit = async (data: AcceptInviteFormData) => {
    if (!token) return

    try {
      setIsLoading(true)
      const response = await apiClient.post(API_ROUTES.ACCEPT_INVITE, {
        token,
        password: data.password,
      })

      setInviterName(response.data.couple.partner_name)
      setSuccess(true)
      toast.success('Conta criada com sucesso!')

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao aceitar convite'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto">
              <AnimatedCoupleRings size="lg" animate={false} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl">Bem-vindo(a) ao Fin2Couple!</CardTitle>
              <CardDescription>
                Sua conta foi criada com sucesso
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">
                Agora você e <span className="font-semibold text-foreground">{inviterName}</span> formam um casal!
              </p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">Casal criado automaticamente</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Redirecionando para o login em 3 segundos...
            </p>

            <Button onClick={() => navigate('/login')} className="w-full">
              Ir para o Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <AnimatedCoupleRings size="md" animate={true} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Aceitar Convite</CardTitle>
            <CardDescription>
              Você foi convidado(a) para criar um casal no Fin2Couple!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Crie uma senha segura para sua conta. Após isso, o casal será criado automaticamente.
            </AlertDescription>
          </Alert>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                name="password"
                label="Senha"
                type="password"
                icon={Lock}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
                required
              />

              <InputField
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                icon={Lock}
                placeholder="Digite a senha novamente"
                disabled={isLoading}
                required
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Criando conta...' : 'Criar Conta e Aceitar Convite'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/login')}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Já tem uma conta? Faça login
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
