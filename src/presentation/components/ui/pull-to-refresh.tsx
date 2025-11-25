import type { ReactNode } from 'react'

interface PullToRefreshWrapperProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  disabled?: boolean
}

/**
 * Pull to Refresh simplificado
 * TODO: Implementar versão completa posteriormente
 * Por hora, retorna apenas os children
 */
export function PullToRefreshWrapper({
  children,
  disabled = false,
}: PullToRefreshWrapperProps) {
  // Implementação simplificada - retorna children sem pull to refresh
  // A implementação completa será adicionada em um PR futuro
  if (disabled) {
    return <>{children}</>
  }

  return <>{children}</>
}
