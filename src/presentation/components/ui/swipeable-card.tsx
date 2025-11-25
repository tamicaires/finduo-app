import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { Trash2, Edit, Archive } from 'lucide-react'
import { cn } from '@shared/utils'
import { useHaptics } from '@presentation/hooks/use-haptics'

export interface SwipeAction {
  icon: ReactNode
  label: string
  onClick: () => void
  color: 'destructive' | 'warning' | 'primary'
}

interface SwipeableCardProps {
  children: ReactNode
  onDelete?: () => void
  onEdit?: () => void
  onArchive?: () => void
  customActions?: SwipeAction[]
  className?: string
  disabled?: boolean
}

/**
 * Card com gestos de swipe para ações rápidas
 * Swipe esquerda: Revela ações (editar, deletar, etc)
 * 
 * Inspirado em: iOS Mail, Gmail
 */
export function SwipeableCard({
  children,
  onDelete,
  onEdit,
  onArchive,
  customActions,
  className,
  disabled = false,
}: SwipeableCardProps) {
  const haptics = useHaptics()
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Definir ações baseado nas props
  const actions: SwipeAction[] = customActions || []
  
  if (onEdit && !customActions) {
    actions.push({
      icon: <Edit className="h-4 w-4" />,
      label: 'Editar',
      onClick: onEdit,
      color: 'primary',
    })
  }

  if (onArchive && !customActions) {
    actions.push({
      icon: <Archive className="h-4 w-4" />,
      label: 'Arquivar',
      onClick: onArchive,
      color: 'warning',
    })
  }

  if (onDelete && !customActions) {
    actions.push({
      icon: <Trash2 className="h-4 w-4" />,
      label: 'Deletar',
      onClick: onDelete,
      color: 'destructive',
    })
  }

  // Background color baseado no swipe
  const backgroundColor = useTransform(
    x,
    [-150, -75, 0],
    ['rgb(239 68 68)', 'rgb(251 146 60)', 'transparent']
  )

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = -100

    if (info.offset.x < threshold) {
      // Swipe significativo - manter aberto
      haptics.light()
    } else {
      // Voltar ao normal
      x.set(0)
    }
  }

  const handleActionClick = (action: SwipeAction) => {
    haptics.medium()
    action.onClick()
    x.set(0) // Fecha após ação
  }

  if (disabled || actions.length === 0) {
    return <div className={className}>{children}</div>
  }

  const maxDrag = -(actions.length * 80)

  return (
    <div className={cn('relative overflow-hidden', className)} ref={containerRef}>
      {/* Ações reveladas por baixo */}
      <div className="absolute inset-y-0 right-0 flex items-stretch">
        {actions.map((action, index) => {
          const colorClasses = {
            destructive: 'bg-red-500 hover:bg-red-600 text-white',
            warning: 'bg-orange-500 hover:bg-orange-600 text-white',
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
          }

          return (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                'flex flex-col items-center justify-center px-5 gap-1 min-w-[80px]',
                'transition-colors active:scale-95',
                colorClasses[action.color]
              )}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Card deslizável */}
      <motion.div
        drag="x"
        dragConstraints={{ left: maxDrag, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ x, backgroundColor }}
        onDragEnd={handleDragEnd}
        className="relative bg-background cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  )
}
