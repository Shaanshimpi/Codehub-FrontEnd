/**
 * String utility functions for the Learn platform
 */

/**
 * Creates a URL-friendly slug from a given name
 */
export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Capitalizes the first letter of a string
 */
export const capitalizeFirst = (str: string): string => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Gets initials from a name (first letter of each word)
 */
export const getInitials = (name: string): string => {
  if (!name) return ""
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Validates if a string is a valid slug format
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug) return false
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Formats a number as a readable string (e.g., 1000 -> "1K")
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString()
  if (num < 1000000) return (num / 1000).toFixed(1) + "K"
  return (num / 1000000).toFixed(1) + "M"
}

/**
 * Calculates estimated read time for content
 */
export const calculateReadTime = (content: string): number => {
  if (!content) return 0
  return Math.ceil(content.length / 500)
}

/**
 * Removes HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "")
}

/**
 * Converts camelCase to kebab-case
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Converts kebab-case to camelCase
 */
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}
