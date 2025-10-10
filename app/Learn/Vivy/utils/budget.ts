/**
 * Budget utility functions
 * Converts between dollars (backend) and credits (frontend)
 *
 * Conversion: 1 credit = $0.0001
 * - $0.80 = 8000 credits
 * - $0.0001 = 1 credit
 */

const CREDIT_TO_DOLLAR_RATIO = 0.0001

/**
 * Convert dollars to credits for display
 * @param dollars Amount in dollars
 * @returns Amount in credits
 */
export function dollarsToCredits(dollars: number): number {
  return Math.round(dollars / CREDIT_TO_DOLLAR_RATIO)
}

/**
 * Convert credits to dollars for API calls
 * @param credits Amount in credits
 * @returns Amount in dollars
 */
export function creditsToDollars(credits: number): number {
  return credits * CREDIT_TO_DOLLAR_RATIO
}

/**
 * Format credits for display
 * @param credits Amount in credits
 * @returns Formatted string (e.g. "8,000" or "1,234")
 */
export function formatCredits(credits: number): string {
  return credits.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })
}

/**
 * Format dollars for display (used in debug/admin views)
 * @param dollars Amount in dollars
 * @returns Formatted string (e.g. "$0.0123")
 */
export function formatDollars(dollars: number): string {
  return `$${dollars.toFixed(4)}`
}
