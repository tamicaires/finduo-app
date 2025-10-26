/**
 * Brazilian input masks utilities
 * Provides formatting functions for common Brazilian document types and formats
 */

/**
 * Formats a phone number with Brazilian pattern
 * @param value - Raw phone number string
 * @returns Formatted phone (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export function phoneMask(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return cleaned
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

/**
 * Formats a CPF (Cadastro de Pessoas Físicas)
 * @param value - Raw CPF string
 * @returns Formatted CPF XXX.XXX.XXX-XX
 */
export function cpfMask(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

/**
 * Formats a CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * @param value - Raw CNPJ string
 * @returns Formatted CNPJ XX.XXX.XXX/XXXX-XX
 */
export function cnpjMask(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  return cleaned
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

/**
 * Formats a CEP (Código de Endereçamento Postal)
 * @param value - Raw CEP string
 * @returns Formatted CEP XXXXX-XXX
 */
export function cepMask(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  return cleaned
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
}

/**
 * Formats a vehicle license plate
 * @param value - Raw plate string
 * @returns Formatted plate XXX-XXXX or XXX9X99 (Mercosul)
 */
export function plateMask(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

  if (cleaned.length <= 7) {
    return cleaned.replace(/(\w{3})(\w)/, '$1-$2')
  }

  return cleaned.substring(0, 7).replace(/(\w{3})(\w)/, '$1-$2')
}
