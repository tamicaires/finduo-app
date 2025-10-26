import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@infrastructure/validators/auth.schema'
import { useAuth } from '@application/hooks/use-auth'
import { Button } from '@presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { ErrorMessage } from '@presentation/components/shared/ErrorMessage'

export function LoginPage() {
  const { signIn, isSigningIn, signInError } = useAuth()

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: SignInInput) => {
    signIn(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">FINDUO</CardTitle>
          <CardDescription className="text-center">
            Gestão financeira para casais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {signInError && (
                <ErrorMessage message="Credenciais inválidas. Tente novamente." />
              )}

              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="seu@email.com"
              />

              <InputField
                name="password"
                label="Senha"
                type="password"
                placeholder="••••••••"
              />

              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? <LoadingSpinner size="sm" /> : 'Entrar'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Credenciais de teste:
              <br />
              <code className="text-xs">joao@test.com / 123456</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
