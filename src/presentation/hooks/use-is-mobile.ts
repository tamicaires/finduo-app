import { useMediaQuery } from './use-media-query'

/**
 * Hook para detectar se está em dispositivo mobile
 * Breakpoint: < 1024px (tailwind lg)
 * @returns boolean indicando se é mobile
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)')
}
