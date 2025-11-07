import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdRepeat, MdViewWeek } from 'react-icons/md'
import { Badge } from '@presentation/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@presentation/components/ui/tabs'
import { LoadingSpinner } from '@presentation/components/shared/LoadingSpinner'
import { OccurrenceFilters, type FilterType } from './components/OccurrenceFilters'
import { OccurrencesList } from './components/OccurrencesList'
import { InstallmentsList } from './components/InstallmentsList'
import { useRecurringTemplates } from '@application/hooks/use-recurring-templates'
import { useRecurringOccurrences } from '@application/hooks/use-recurring-occurrences'
import { useInstallmentTemplates } from '@application/hooks/use-installment-templates'

export function RecurringPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [showInactive, setShowInactive] = useState(false)
  const [activeTab, setActiveTab] = useState('occurrences')
  
  // Recurring hooks
  const { templates: recurringTemplates, isLoading: isLoadingRecurring } = useRecurringTemplates()
  const {
    dueOccurrences,
    payOccurrence,
    skipOccurrence,
    isPaying,
    isSkipping,
    isPastDue,
    isOverdue,
  } = useRecurringOccurrences()

  // Installment hooks
  const {
    templates: installmentTemplates,
    hasInactiveTemplates,
    isLoading: isLoadingInstallments,
    activateTemplate,
    deactivateTemplate,
    deleteTemplate,
    isActivating,
    isDeactivating,
    isDeleting,
  } = useInstallmentTemplates(showInactive)

  // Memoized computed values
  const occurrencesWithMeta = useMemo(
    () =>
      dueOccurrences.map((occ) => {
        const template = recurringTemplates?.find((t) => t.id === occ.template_id)
        return {
          ...occ,
          description: template?.description || 'Sem descrição',
          amount: template?.amount || 0,
        }
      }),
    [dueOccurrences, recurringTemplates]
  )

  const filteredOccurrences = useMemo(() => {
    return occurrencesWithMeta.filter((occ) => {
      const matchesSearch = occ.description.toLowerCase().includes(searchTerm.toLowerCase())
      if (!matchesSearch) return false

      if (filter === 'all') return true
      if (filter === 'pending') return occ.status === 'PENDING'
      if (filter === 'paid') return occ.status === 'PAID'
      if (filter === 'overdue') return isOverdue(occ.due_date)

      return true
    })
  }, [occurrencesWithMeta, searchTerm, filter, isOverdue])

  // Handlers
  const handlePayOccurrence = (occurrenceId: string, transactionDate?: string) => {
    payOccurrence({ occurrence_id: occurrenceId, transaction_date: transactionDate })
  }

  const handleSkipOccurrence = (occurrenceId: string) => {
    skipOccurrence(occurrenceId)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja excluir este parcelamento? Esta ação não pode ser desfeita.')) {
      deleteTemplate(templateId)
    }
  }

  if (isLoadingRecurring || isLoadingInstallments) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <MdRepeat className="h-8 w-8 text-primary" />
                Transações Recorrentes
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Gerencie suas transações automáticas e parceladas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="occurrences" className="flex items-center gap-2">
              <MdRepeat className="h-4 w-4" />
              Recorrências
              <Badge variant="secondary" className="ml-1">
                {filteredOccurrences.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="installments" className="flex items-center gap-2">
              <MdViewWeek className="h-4 w-4" />
              Parcelamentos
              <Badge variant="secondary" className="ml-1">
                {installmentTemplates.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Occurrences Tab */}
          <TabsContent value="occurrences" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <OccurrenceFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filter={filter}
                onFilterChange={setFilter}
              />
            </motion.div>

            <OccurrencesList
              occurrences={filteredOccurrences}
              searchTerm={searchTerm}
              onPay={handlePayOccurrence}
              onSkip={handleSkipOccurrence}
              isPaying={isPaying}
              isSkipping={isSkipping}
              isPastDue={isPastDue}
              isOverdue={isOverdue}
            />
          </TabsContent>

          {/* Installments Tab */}
          <TabsContent value="installments" className="space-y-4">
            <InstallmentsList
              templates={installmentTemplates}
              hasInactiveTemplates={hasInactiveTemplates}
              showInactive={showInactive}
              onToggleInactive={() => setShowInactive(!showInactive)}
              onActivateTemplate={activateTemplate}
              onDeactivateTemplate={deactivateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              isActivating={isActivating}
              isDeactivating={isDeactivating}
              isDeleting={isDeleting}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
