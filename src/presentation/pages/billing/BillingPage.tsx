import { useQuery, useMutation } from '@tanstack/react-query'
import { subscriptionService } from '@/application/services/subscription.service'
import { useAuthStore } from '@/application/stores/auth.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { CreditCard, Crown, CheckCircle2, XCircle, Clock, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const statusConfig = {
  ACTIVE: { label: 'Ativo', color: 'bg-green-500', icon: CheckCircle2 },
  TRIAL: { label: 'Período de Teste', color: 'bg-blue-500', icon: Clock },
  EXPIRED: { label: 'Expirado', color: 'bg-red-500', icon: XCircle },
  CANCELED: { label: 'Cancelado', color: 'bg-gray-500', icon: XCircle },
}

const planFeatures = {
  FREE: [
    'Dashboard básico',
    'Até 2 contas bancárias',
    'Até 100 transações/mês',
    'Rastreamento de gastos pessoais',
  ],
  Premium: [
    'Dashboard completo com gráficos avançados',
    'Até 10 contas bancárias',
    'Transações ilimitadas',
    'Rastreamento de gastos pessoais',
    'Relatórios avançados',
    'Exportação de dados',
    'Suporte prioritário',
  ],
}

export function BillingPage() {
  const user = useAuthStore((state) => state.user)

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: () => subscriptionService.getStatus(),
  })

  const checkoutMutation = useMutation({
    mutationFn: () => {
      if (!user?.email) throw new Error('Email não encontrado')
      return subscriptionService.createCheckoutSession(user.email)
    },
    onSuccess: (data) => {
      // Redirecionar para a página de checkout do Stripe
      window.location.href = data.sessionUrl
    },
    onError: (error) => {
      toast.error('Erro ao criar sessão de checkout', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
      })
    },
  })

  const portalMutation = useMutation({
    mutationFn: () => subscriptionService.createPortalSession(),
    onSuccess: (data) => {
      // Abrir portal do Stripe em nova aba
      window.open(data.portalUrl, '_blank')
    },
    onError: (error) => {
      toast.error('Erro ao acessar portal de gerenciamento', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
      })
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-6">
        <Alert variant="destructive">
          <AlertDescription>Não foi possível carregar informações da assinatura.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const StatusIcon = statusConfig[subscription.status].icon
  const features = planFeatures[subscription.planName as keyof typeof planFeatures] || planFeatures.FREE

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Assinatura e Faturamento</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua assinatura e forme de pagamento</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {subscription.planName === 'Premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                Plano {subscription.planName}
              </CardTitle>
              <CardDescription>
                {subscription.planName === 'Premium'
                  ? 'Acesso completo a todos os recursos'
                  : 'Plano gratuito com recursos limitados'}
              </CardDescription>
            </div>
            <Badge className={statusConfig[subscription.status].color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[subscription.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Data de Início</p>
              <p className="font-medium">{new Date(subscription.startDate).toLocaleDateString('pt-BR')}</p>
            </div>
            {subscription.endDate && (
              <div>
                <p className="text-muted-foreground">Data de Renovação</p>
                <p className="font-medium">{new Date(subscription.endDate).toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>

          {subscription.daysRemaining !== null && subscription.daysRemaining > 0 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {subscription.status === 'TRIAL'
                  ? `Seu período de teste expira em ${subscription.daysRemaining} dias`
                  : `Sua assinatura renova em ${subscription.daysRemaining} dias`}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            {subscription.canUpgrade && subscription.planName !== 'Premium' && (
              <Button onClick={() => checkoutMutation.mutate()} disabled={checkoutMutation.isPending}>
                {checkoutMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Crown className="mr-2 h-4 w-4" />
                Fazer Upgrade para Premium
              </Button>
            )}

            {subscription.stripeCustomerId && (
              <Button
                variant="outline"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                {portalMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Gerenciar Assinatura
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos do Plano</CardTitle>
          <CardDescription>
            {subscription.planName === 'Premium'
              ? 'Você tem acesso a todos os recursos premium'
              : 'Recursos disponíveis no seu plano atual'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {subscription.planName !== 'Premium' && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Desbloqueie Todo o Potencial do FindUO
            </CardTitle>
            <CardDescription>
              Upgrade para Premium e tenha acesso a recursos avançados de gestão financeira para o seu casal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">R$ 29,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <Button
                size="lg"
                onClick={() => checkoutMutation.mutate()}
                disabled={checkoutMutation.isPending}
                className="w-full sm:w-auto"
              >
                {checkoutMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Crown className="mr-2 h-4 w-4" />
                Assinar Premium Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Info */}
      {subscription.stripeCustomerId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Forma de Pagamento
            </CardTitle>
            <CardDescription>Gerencie seus métodos de pagamento e faturas no portal do Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => portalMutation.mutate()} disabled={portalMutation.isPending}>
              {portalMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Acessar Portal de Pagamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
