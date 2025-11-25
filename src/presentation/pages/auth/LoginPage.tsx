import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@infrastructure/validators/auth.schema'
import { useAuth } from '@application/hooks/use-auth'
import { Button } from '@presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@presentation/components/ui/card'
import { Form } from '@presentation/components/ui/form'
import { InputField } from '@presentation/components/form'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { ErrorMessage } from '@presentation/components/shared/ErrorMessage'
import { Logo } from '@presentation/components/ui/logo'

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <Logo width={240} />
          </div>
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

              <Button type="submit" className="w-full" disabled={isSigningIn} variant="default">
                {isSigningIn ? <LoadingSpinner size="sm" /> : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
