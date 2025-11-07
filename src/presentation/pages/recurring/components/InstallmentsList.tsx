import { motion, AnimatePresence } from 'framer-motion'
import { MdViewWeek, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { Card, CardContent } from '@presentation/components/ui/card'
import { Button } from '@presentation/components/ui/button'
import { InstallmentGroupCardWrapper } from '@presentation/components/installments/InstallmentGroupCardWrapper'
import type { InstallmentTemplate } from '@application/hooks/use-installment-templates'

interface InstallmentsListProps {
  templates: InstallmentTemplate[]
  hasInactiveTemplates: boolean
  showInactive: boolean
  onToggleInactive: () => void
  onActivateTemplate: (templateId: string) => void
  onDeactivateTemplate: (templateId: string) => void
  onDeleteTemplate: (templateId: string) => void
  isActivating: boolean
  isDeactivating: boolean
  isDeleting: boolean
}

export function InstallmentsList({
  templates,
  hasInactiveTemplates,
  showInactive,
  onToggleInactive,
  onActivateTemplate,
  onDeactivateTemplate,
  onDeleteTemplate,
  isActivating,
  isDeactivating,
  isDeleting,
}: InstallmentsListProps) {
  // Show empty state only when there are NO templates and NO inactive templates
  const hasNoTemplates = templates.length === 0 && !hasInactiveTemplates

  if (hasNoTemplates) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MdViewWeek className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Nenhum parcelamento criado</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Crie um novo parcelamento na página de transações
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Toggle - Show if there are inactive templates */}
      {hasInactiveTemplates && (
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleInactive}
            className="gap-2"
          >
            {showInactive ? (
              <>
                <MdVisibilityOff className="h-4 w-4" />
                Ocultar inativos
              </>
            ) : (
              <>
                <MdVisibility className="h-4 w-4" />
                Mostrar inativos
              </>
            )}
          </Button>
        </div>
      )}

      {/* List or Empty State for Current Filter */}
      {templates.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MdViewWeek className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhum parcelamento ativo
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {hasInactiveTemplates
                  ? 'Clique em "Mostrar inativos" para ver os parcelamentos desativados'
                  : 'Crie um novo parcelamento na página de transações'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4">
            {templates.map((template, index) => (
              <InstallmentGroupCardWrapper
                key={template.id}
                template={template}
                index={index}
                onActivateTemplate={onActivateTemplate}
                onDeactivateTemplate={onDeactivateTemplate}
                onDeleteTemplate={onDeleteTemplate}
                isActivating={isActivating}
                isDeactivating={isDeactivating}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
