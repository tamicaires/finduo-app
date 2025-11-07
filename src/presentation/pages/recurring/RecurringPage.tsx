import { useState } from 'react'
import { MdRepeat, MdPause, MdPlayArrow, MdDelete, MdAdd, MdViewWeek, MdExpandMore, MdExpandLess } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { Badge } from '@presentation/components/ui/badge'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { useRecurringTemplates } from '@application/hooks/use-recurring-templates'
import { useInstallments } from '@application/hooks/use-installments'
import { formatCurrency } from '@shared/utils/format-currency'
import { RecurrenceFrequencyLabels } from '@core/enums/RecurrenceFrequency'
import { TransactionTypeLabels } from '@core/enums/TransactionType'
import { cn } from '@shared/utils'

export function RecurringPage() {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const {
    templates,
    isLoading,
    pauseTemplate,
    resumeTemplate,
    deleteTemplate,
    isPausing,
    isResuming,
    isDeleting,
  } = useRecurringTemplates()

  const {
    installmentGroups,
    isLoading: isLoadingInstallments,
  } = useInstallments()

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const handlePause = async (id: string) => {
    await pauseTemplate(id)
  }

  const handleResume = async (id: string) => {
    await resumeTemplate(id)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta recorrência? Esta ação não pode ser desfeita.')) {
      await deleteTemplate(id)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getFrequencyText = (frequency: string, interval: number) => {
    const label = RecurrenceFrequencyLabels[frequency as keyof typeof RecurrenceFrequencyLabels]
    return interval === 1 ? label : `A cada ${interval} ${label.toLowerCase()}`
  }

  if (isLoading || isLoadingInstallments) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const activeTemplates = templates?.filter((t) => t.is_active) || []
  const pausedTemplates = templates?.filter((t) => !t.is_active) || []

  return (
    <div className="p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">Transações Recorrentes & Parceladas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie suas transações automáticas e parceladas
              </p>
            </div>
          </div>
        </div>

        {/* Active Templates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MdRepeat className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Recorrências Ativas</h3>
            <Badge variant="secondary">{activeTemplates.length}</Badge>
          </div>

          {activeTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MdRepeat className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Nenhuma transação recorrente ativa
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Crie uma nova transação recorrente na página de transações
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {template.description || 'Sem descrição'}
                          <Badge variant={template.type === 'INCOME' ? 'default' : 'destructive'}>
                            {TransactionTypeLabels[template.type]}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getFrequencyText(template.frequency, template.interval)}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/15 text-green-500 border-green-500/25">
                        Ativa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor:</span>
                        <span className="font-semibold text-lg">
                          {formatCurrency(template.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Próxima ocorrência:</span>
                        <span className="font-medium">
                          {formatDate(template.next_occurrence)}
                        </span>
                      </div>
                      {template.end_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Termina em:</span>
                          <span>{formatDate(template.end_date)}</span>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handlePause(template.id)}
                          disabled={isPausing}
                        >
                          <MdPause className="h-4 w-4 mr-1" />
                          Pausar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDelete(template.id)}
                          disabled={isDeleting}
                        >
                          <MdDelete className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Installment Groups */}
        {installmentGroups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MdViewWeek className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Compras Parceladas</h3>
              <Badge variant="secondary">{installmentGroups.length}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {installmentGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.id)
                const progress = (group.paidInstallments / group.totalInstallments) * 100

                return (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {group.description || 'Sem descrição'}
                            <Badge variant={group.type === 'INCOME' ? 'default' : 'destructive'}>
                              {TransactionTypeLabels[group.type]}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {group.totalInstallments}x de {formatCurrency(group.installmentAmount)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            progress === 100
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          )}
                        >
                          {group.paidInstallments}/{group.totalInstallments}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Valor total:</span>
                          <span className="font-semibold text-lg">
                            {formatCurrency(group.totalAmount)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progresso</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {group.nextInstallmentDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Próxima parcela:</span>
                            <span className="font-medium">
                              {formatDate(group.nextInstallmentDate)}
                            </span>
                          </div>
                        )}

                        {/* Toggle button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => toggleGroup(group.id)}
                        >
                          {isExpanded ? (
                            <>
                              <MdExpandLess className="h-4 w-4 mr-1" />
                              Ocultar parcelas
                            </>
                          ) : (
                            <>
                              <MdExpandMore className="h-4 w-4 mr-1" />
                              Ver todas as parcelas
                            </>
                          )}
                        </Button>

                        {/* Expanded installments list */}
                        {isExpanded && (
                          <div className="mt-3 space-y-2 border-t pt-3">
                            {group.installments.map((installment) => {
                              const isPaid = new Date(installment.transaction_date) <= new Date()
                              return (
                                <div
                                  key={installment.id}
                                  className={cn(
                                    "flex justify-between items-center p-2 rounded text-sm",
                                    isPaid ? "bg-muted/50" : "bg-secondary/30"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {installment.installment_number}/{group.totalInstallments}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(installment.transaction_date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {formatCurrency(installment.amount)}
                                    </span>
                                    {isPaid && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        Paga
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Paused Templates */}
        {pausedTemplates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdPause className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Recorrências Pausadas</h3>
              <Badge variant="secondary">{pausedTemplates.length}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {pausedTemplates.map((template) => (
                <Card key={template.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {template.description || 'Sem descrição'}
                          <Badge variant={template.type === 'INCOME' ? 'default' : 'destructive'}>
                            {TransactionTypeLabels[template.type]}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getFrequencyText(template.frequency, template.interval)}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pausada
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor:</span>
                        <span className="font-semibold text-lg">
                          {formatCurrency(template.amount)}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleResume(template.id)}
                          disabled={isResuming}
                        >
                          <MdPlayArrow className="h-4 w-4 mr-1" />
                          Reativar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDelete(template.id)}
                          disabled={isDeleting}
                        >
                          <MdDelete className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
