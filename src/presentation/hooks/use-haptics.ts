/**
 * Hook para feedback háptico (vibração)
 * Melhora UX mobile com feedback tátil em ações importantes
 */
export function useHaptics() {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch (error) {
        // Silently fail if vibration not supported
        console.debug('Vibration not supported', error)
      }
    }
  }

  return {
    /**
     * Vibração leve - Para feedback em toque/tap
     * Uso: Botões, switches, selects
     */
    light: () => vibrate(10),

    /**
     * Vibração média - Para ações importantes
     * Uso: Criar transação, editar conta
     */
    medium: () => vibrate(20),

    /**
     * Vibração forte - Para ações críticas
     * Uso: Deletar, confirmar ação importante
     */
    heavy: () => vibrate(50),

    /**
     * Vibração de sucesso - Pattern de confirmação
     * Uso: Transação criada, conta salva
     */
    success: () => vibrate([50, 100, 50]),

    /**
     * Vibração de erro - Pattern de alerta
     * Uso: Validação falhou, erro na API
     */
    error: () => vibrate([100, 50, 100, 50, 100]),

    /**
     * Vibração de warning - Pattern de aviso
     * Uso: Ação destrutiva, confirmação necessária
     */
    warning: () => vibrate([50, 50, 50]),

    /**
     * Vibração customizada
     */
    custom: vibrate,
  }
}
