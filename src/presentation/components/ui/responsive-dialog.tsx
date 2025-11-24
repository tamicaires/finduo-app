import * as React from 'react'
import { useIsMobile } from '@presentation/hooks/use-is-mobile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { cn } from '@shared/utils'

interface ResponsiveDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ResponsiveDialogContentProps {
  children: React.ReactNode
  className?: string
}

interface ResponsiveDialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface ResponsiveDialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface ResponsiveDialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface ResponsiveDialogFooterProps {
  children: React.ReactNode
  className?: string
}

interface ResponsiveDialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface ResponsiveDialogCloseProps {
  children: React.ReactNode
  asChild?: boolean
}

/**
 * ResponsiveDialog - Wrapper inteligente
 * Desktop: Usa Dialog padrão
 * Mobile: Usa Drawer (bottom sheet)
 */
export function ResponsiveDialog({
  children,
  ...props
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <Drawer {...props}>{children}</Drawer>
  }

  return <Dialog {...props}>{children}</Dialog>
}

/**
 * ResponsiveDialogTrigger
 */
export function ResponsiveDialogTrigger({
  children,
  ...props
}: ResponsiveDialogTriggerProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <DrawerTrigger {...props}>{children}</DrawerTrigger>
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

/**
 * ResponsiveDialogClose
 */
export function ResponsiveDialogClose({
  children,
  ...props
}: ResponsiveDialogCloseProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <DrawerClose {...props}>{children}</DrawerClose>
  }

  // Dialog doesn't have a separate Close component, use DialogClose if needed
  return <>{children}</>
}

/**
 * ResponsiveDialogContent
 */
export function ResponsiveDialogContent({
  children,
  className,
  ...props
}: ResponsiveDialogContentProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerContent className={cn('max-h-[96vh]', className)} {...props}>
        {children}
      </DrawerContent>
    )
  }

  return (
    <DialogContent className={className} {...props}>
      {children}
    </DialogContent>
  )
}

/**
 * ResponsiveDialogHeader
 */
export function ResponsiveDialogHeader({
  children,
  className,
  ...props
}: ResponsiveDialogHeaderProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerHeader className={className} {...props}>
        {children}
      </DrawerHeader>
    )
  }

  return (
    <DialogHeader className={className} {...props}>
      {children}
    </DialogHeader>
  )
}

/**
 * ResponsiveDialogTitle
 */
export function ResponsiveDialogTitle({
  children,
  className,
  ...props
}: ResponsiveDialogTitleProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerTitle className={className} {...props}>
        {children}
      </DrawerTitle>
    )
  }

  return (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  )
}

/**
 * ResponsiveDialogDescription
 */
export function ResponsiveDialogDescription({
  children,
  className,
  ...props
}: ResponsiveDialogDescriptionProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerDescription className={className} {...props}>
        {children}
      </DrawerDescription>
    )
  }

  return (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  )
}

/**
 * ResponsiveDialogFooter
 */
export function ResponsiveDialogFooter({
  children,
  className,
  ...props
}: ResponsiveDialogFooterProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerFooter className={className} {...props}>
        {children}
      </DrawerFooter>
    )
  }

  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>{children}</div>
}

/**
 * Handle visual para Drawer (barrinha de arrastar)
 */
export function DrawerHandle() {
  return (
    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-4" />
  )
}
