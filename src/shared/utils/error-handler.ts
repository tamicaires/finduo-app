import { AxiosError } from 'axios'

interface ApiErrorResponse {
  message: string
  statusCode?: number
  code?: string
}

/**
 * Extrai a mensagem de erro de forma type-safe
 * Funciona com erros do Axios e outros tipos de erro
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'Erro desconhecido'): string {
  // Se for um erro do Axios
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    return data?.message || fallbackMessage
  }

  // Se for um erro padrão do JavaScript
  if (error instanceof Error) {
    return error.message
  }

  // Se for uma string
  if (typeof error === 'string') {
    return error
  }

  // Fallback para casos desconhecidos
  return fallbackMessage
}

/**
 * Type guard para verificar se o erro é do Axios
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    error.isAxiosError === true
  )
}

/**
 * Extrai o status code HTTP de forma type-safe
 */
export function getErrorStatusCode(error: unknown): number | null {
  if (isAxiosError(error)) {
    return error.response?.status ?? null
  }
  return null
}

/**
 * Extrai o código de erro customizado da API
 */
export function getErrorCode(error: unknown): string | null {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    return data?.code ?? null
  }
  return null
}

/**
 * Verifica se o erro é de "não estar em um casal"
 * Pode receber um erro ou uma mensagem de erro diretamente
 */
export function isNoCoupleError(errorOrMessage: unknown): boolean {
  // Se for uma string, verifica diretamente
  if (typeof errorOrMessage === 'string') {
    const lower = errorOrMessage.toLowerCase()
    return lower.includes('couple') || lower.includes('casal') || lower.includes('must be in')
  }

  // Caso contrário, extrai a mensagem do erro
  const message = getErrorMessage(errorOrMessage)
  const code = getErrorCode(errorOrMessage)

  return (
    message.toLowerCase().includes('couple') ||
    message.toLowerCase().includes('casal') ||
    message.toLowerCase().includes('must be in') ||
    code === 'NO_COUPLE'
  )
}
