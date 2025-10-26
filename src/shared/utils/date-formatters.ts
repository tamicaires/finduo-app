/**
 * Date formatting utilities
 * Provides functions for formatting dates for datetime-local inputs
 */

/**
 * Formats a date value for datetime-local input
 * @param value - Date value (Date object, ISO string, or datetime-local string)
 * @returns Formatted datetime string (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(value: unknown): string {
  if (!value) return ''

  try {
    // If already in correct format, return as is
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
      return value.substring(0, 16) // Remove seconds if present
    }

    // If it's a Date object, convert to string
    if (value instanceof Date) {
      return formatDateObject(value)
    }

    // Try parsing as ISO string
    const date = new Date(value as string)
    if (!isNaN(date.getTime())) {
      return formatDateObject(date)
    }

    return ''
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return ''
  }
}

/**
 * Formats a Date object to datetime-local string
 * @param date - Date object
 * @returns Formatted datetime string (YYYY-MM-DDTHH:mm)
 */
function formatDateObject(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Parses a datetime-local string to Date object
 * @param value - Datetime-local string
 * @returns Date object or undefined if invalid
 */
export function parseDateTimeLocal(value: string): Date | undefined {
  if (!value) return undefined

  try {
    const date = new Date(value)
    return isNaN(date.getTime()) ? undefined : date
  } catch (error) {
    console.error('Error parsing datetime:', error)
    return undefined
  }
}
