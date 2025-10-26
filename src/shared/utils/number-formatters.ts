/**
 * Number formatting utilities
 * Provides formatters for currency, percentages, and general numbers
 */

/**
 * Formats a number as Brazilian Real currency
 * @param value - Numeric value to format
 * @returns Formatted currency string (e.g., "R$ 1.234,56")
 */
export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/**
 * Formats a number with Brazilian locale
 * @param value - Numeric value to format
 * @returns Formatted number string (e.g., "1.234,56")
 */
export const numberFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/**
 * Formats a decimal value as percentage
 * @param value - Decimal value (e.g., 0.15 for 15%)
 * @returns Formatted percentage string (e.g., "15%")
 */
export function formatPercentage(value: number): string {
  return `${numberFormatter.format(value * 100)}%`
}

/**
 * Parses a Brazilian formatted currency string to number
 * @param value - Formatted currency string
 * @returns Numeric value
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '')
  return cleaned ? Number(cleaned) / 100 : 0
}

/**
 * Parses a percentage string to decimal
 * @param value - Percentage string
 * @returns Decimal value (e.g., "15%" returns 0.15)
 */
export function parsePercentage(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '')
  return cleaned ? Number(cleaned) / 100 : 0
}
