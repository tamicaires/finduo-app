import { useState, useEffect } from 'react'

// Extend Navigator interface to include iOS standalone property
interface NavigatorStandalone extends Navigator {
  standalone?: boolean
}

/**
 * Hook para detectar iOS (iPhone, iPad, iPod)
 * @returns objeto com informações sobre iOS
 */
export function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detect iOS device
    const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent)

    // Detect if app is installed (standalone mode)
    const standalone =
      (window.navigator as NavigatorStandalone).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches

    setIsIOS(iOS)
    setIsStandalone(standalone)
  }, [])

  return {
    isIOS,
    isStandalone,
    needsInstall: isIOS && !isStandalone,
  }
}
