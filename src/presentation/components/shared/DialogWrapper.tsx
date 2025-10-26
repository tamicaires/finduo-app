import { cn } from '@shared/utils'
import { DialogDescription, DialogHeader } from '@presentation/components/ui/dialog'
import { RippleBackground, RippleWrapper } from '@presentation/components/ui/ripple'

type DialogWrapperProps = {
  children?: React.ReactNode
  className?: string
  icon?: React.ElementType<{ className?: string }>
  isActive?: boolean
  description?: string
}

export function DialogWrapper({
  children,
  className,
  icon: Icon,
  isActive,
  description,
}: DialogWrapperProps) {
  if (!Icon) {
    return (
      <DialogHeader className={`flex flex-col justify-between px-0 ${className}`}>
        <RippleBackground
          position="top-right"
          size="xl"
          color="primary"
          intensity="light"
          rings={5}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="w-full">{children}</div>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </div>
      </DialogHeader>
    )
  }

  return (
    <DialogHeader className="flex flex-col justify-between px-0 pb-3">
      <RippleBackground
        position="top-right"
        size="xl"
        color="primary"
        intensity="light"
        rings={5}
      />
      <div className={cn('flex items-start gap-2 w-full', className)}>
        <RippleWrapper
          rippleProps={{
            size: 'md',
            color: 'primary',
            intensity: 'light',
            rings: 3,
          }}
        >
          <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/25 mr-2">
            <Icon className="h-5 w-5 text-white" />
          </div>
          {isActive !== undefined && (
            <div
              className={`absolute -top-1 -right-0 w-4 h-4 ${
                isActive ? 'bg-green-500' : 'bg-slate-500'
              } rounded-full border-2 border-white/70 shadow-sm z-20`}
            />
          )}
        </RippleWrapper>
        <div className="flex flex-col gap-1.5 w-full pt-1">
          {children}
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </div>
      </div>
    </DialogHeader>
  )
}
