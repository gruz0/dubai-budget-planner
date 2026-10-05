const numberFormatter = new Intl.NumberFormat('en-US')

/**
 * Formats a number with thousand separators using en-US locale.
 * Always produces consistent output like "15,000" regardless of user's locale.
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value))
}
