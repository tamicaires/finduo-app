import { UserPlus, Link2 } from 'lucide-react'
import { Card, CardContent } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { AnimatedCoupleRings } from '@presentation/components/shared/AnimatedCoupleRings'
import { CreateCoupleDialog } from './CreateCoupleDialog'
import { useState } from 'react'

interface NoCoupleCardProps {
  onInviteClick?: () => void
  showInviteButton?: boolean
  onInviteSuccess?: () => void
}

export function NoCoupleCard({ onInviteClick, showInviteButton = true, onInviteSuccess }: NoCoupleCardProps) {
  const [showInviteInfo, setShowInviteInfo] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleInviteClick = () => {
    if (onInviteClick) {
      onInviteClick()
    } else {
      setShowCreateDialog(true)
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-12">
        {/* Logo estática (sem animação) */}
        <div className="mb-6">
          <AnimatedCoupleRings size="lg" animate={false} />
        </div>

        <h3 className="text-xl font-semibold mb-2 text-foreground">
          Você ainda não possui um parceiro vinculado
        </h3>

        <p className="text-sm mb-6 max-w-md text-muted-foreground">
          Para começar a gerenciar as finanças em conjunto, você precisa criar um casal e convidar seu parceiro(a).
        </p>

        {showInviteButton && (
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button
              onClick={handleInviteClick}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Criar Casal
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowInviteInfo(!showInviteInfo)}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Como funciona?
            </Button>
          </div>
        )}

        {showInviteInfo && (
          <div className="mt-6 p-4 bg-card border rounded-lg text-left w-full max-w-md">
            <h4 className="font-semibold text-sm mb-3">Como criar um casal:</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">1.</span>
                <span>Clique em "Criar Casal" para iniciar</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">2.</span>
                <span>Informe o nome e email do seu parceiro(a)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">3.</span>
                <span>Compartilhe o link gerado com ele(a)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">4.</span>
                <span>Aguarde ele(a) criar a conta através do link</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">5.</span>
                <span>O casal será criado automaticamente!</span>
              </li>
            </ol>
          </div>
        )}
      </CardContent>

      <CreateCoupleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={onInviteSuccess}
      />
    </Card>
  )
}
