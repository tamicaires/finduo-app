import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdExpandMore,
  MdExpandLess,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdPayment,
  MdWarning,
  MdMoreVert,
  MdDelete,
  MdPause,
  MdPlayArrow,
} from 'react-icons/md'
import { Card, CardContent, CardHeader } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Badge } from '@presentation/components/ui/badge'
import { Progress } from '@presentation/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@presentation/components/ui/dropdown-menu'
import { formatCurrency } from '@shared/utils/format-currency'
import { cn } from '@shared/utils'
import type { InstallmentTemplate, Installment } from '@application/hooks/use-installment-templates'

interface InstallmentGroupCardProps {
  template: InstallmentTemplate
  installments: Installment[]
  progress: number
  onPayInstallment: (installmentId: string) => void
  onSkipInstallment: (installmentId: string) => void
  onActivateTemplate: (templateId: string) => void
  onDeactivateTemplate: (templateId: string) => void
  onDeleteTemplate: (templateId: string) => void
  isPaying?: boolean
  isSkipping?: boolean
  isActivating?: boolean
  isDeactivating?: boolean
  isDeleting?: boolean
}

export function InstallmentGroupCard({
  template,
  installments,
  progress,
  onPayInstallment,
  onSkipInstallment,
  onActivateTemplate,
  onDeactivateTemplate,
  onDeleteTemplate,
  isPaying,
  isSkipping,
  isActivating,
  isDeactivating,
  isDeleting,
}: InstallmentGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<string | null>(null)

  const paidCount = installments.filter((i) => i.status === 'PAID').length
  const pendingCount = installments.filter((i) => i.status === 'PENDING').length
  const skippedCount = installments.filter((i) => i.status === 'SKIPPED').length

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const isOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const daysDiff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff > 30
  }

  const getInstallmentStatus = (installment: Installment) => {
    if (installment.status === 'PAID') {
      return {
        icon: MdCheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-500/15',
        label: 'Pago',
      }
    }
    if (installment.status === 'SKIPPED') {
      return {
        icon: MdCancel,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        label: 'Pulado',
      }
    }
    if (isOverdue(installment.due_date)) {
      return {
        icon: MdWarning,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: 'Vencido',
      }
    }
    if (isPastDue(installment.due_date)) {
      return {
        icon: MdWarning,
        color: 'text-red-600',
        bgColor: 'bg-red-500/15',
        label: 'Atrasado',
      }
    }
    return {
      icon: MdSchedule,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      label: 'Pendente',
    }
  }

  const handlePayInstallment = (installmentId: string) => {
    const installment = installments.find((i) => i.id === installmentId)
    if (installment && installment.status === 'PENDING' && !isOverdue(installment.due_date)) {
      onPayInstallment(installmentId)
    }
  }

  const handleSkipInstallment = (installmentId: string) => {
    const installment = installments.find((i) => i.id === installmentId)
    if (installment && installment.status === 'PENDING') {
      onSkipInstallment(installmentId)
    }
  }

  const toggleInstallmentActions = (installmentId: string) => {
    setSelectedInstallment(selectedInstallment === installmentId ? null : installmentId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300 hover:shadow-md',
          template.is_active ? 'border-primary/20' : 'border-gray-500/20',
          'border-l-4'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Template Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-base truncate">
                  {template.description || 'Sem descrição'}
                </h3>
                <Badge variant={template.is_active ? 'default' : 'secondary'} className="text-xs">
                  {template.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="font-semibold text-foreground">
                  {formatCurrency(Number(template.total_amount))}
                </span>
                <span>
                  {template.total_installments}x de {formatCurrency(Number(template.total_amount) / template.total_installments)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {paidCount} de {template.total_installments} pagas
                  </span>
                  <span className="font-medium text-foreground">{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Status Summary */}
              <div className="flex items-center gap-3 mt-3">
                {paidCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <MdCheckCircle className="h-3.5 w-3.5" />
                    {paidCount} paga{paidCount > 1 ? 's' : ''}
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-blue-600">
                    <MdSchedule className="h-3.5 w-3.5" />
                    {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                  </span>
                )}
                {skippedCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <MdCancel className="h-3.5 w-3.5" />
                    {skippedCount} pulada{skippedCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <MdExpandLess className="h-5 w-5" />
                ) : (
                  <MdExpandMore className="h-5 w-5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MdMoreVert className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {template.is_active ? (
                    <DropdownMenuItem
                      onClick={() => onDeactivateTemplate(template.id)}
                      disabled={isDeactivating}
                    >
                      <MdPause className="mr-2 h-4 w-4" />
                      Desativar
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => onActivateTemplate(template.id)}
                      disabled={isActivating}
                    >
                      <MdPlayArrow className="mr-2 h-4 w-4" />
                      Ativar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDeleteTemplate(template.id)}
                    disabled={isDeleting}
                    className="text-red-600 focus:text-red-600"
                  >
                    <MdDelete className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        {/* Expandable Installments List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                <div className="border-t pt-3 space-y-2">
                  {installments.map((installment) => {
                    const status = getInstallmentStatus(installment)
                    const StatusIcon = status.icon
                    const isPending = installment.status === 'PENDING'
                    const showActions = selectedInstallment === installment.id

                    const dueDate = new Date(installment.due_date)
                    const formattedDate = dueDate.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })

                    return (
                      <motion.div
                        key={installment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'p-3 rounded-lg border transition-all',
                          status.bgColor,
                          'hover:shadow-sm'
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Left: Installment Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={cn('p-1.5 rounded', status.bgColor)}>
                              <StatusIcon className={cn('h-4 w-4', status.color)} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Parcela {installment.installment_number}/{template.total_installments}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {status.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span>{formattedDate}</span>
                                <span className="font-medium text-foreground">
                                  {formatCurrency(Number(installment.amount))}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2">
                            <AnimatePresence>
                              {showActions && isPending && (
                                <motion.div
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="flex items-center gap-2"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSkipInstallment(installment.id)}
                                    disabled={isSkipping}
                                    className="h-7 text-xs"
                                  >
                                    <MdCancel className="h-3 w-3 mr-1" />
                                    Pular
                                  </Button>

                                  {!isOverdue(installment.due_date) && (
                                    <Button
                                      size="sm"
                                      onClick={() => handlePayInstallment(installment.id)}
                                      disabled={isPaying}
                                      className="h-7 text-xs"
                                    >
                                      <MdPayment className="h-3 w-3 mr-1" />
                                      {isPaying ? 'Pagando...' : 'Pagar'}
                                    </Button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {isPending && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleInstallmentActions(installment.id)}
                                className="h-7 w-7 p-0"
                              >
                                <MdMoreVert className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Overdue Warning */}
                        {isPending && isOverdue(installment.due_date) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 pt-2 border-t border-red-200"
                          >
                            <p className="text-xs text-red-600 flex items-start gap-1.5">
                              <MdWarning className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                              <span>Vencida há mais de 30 dias</span>
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
