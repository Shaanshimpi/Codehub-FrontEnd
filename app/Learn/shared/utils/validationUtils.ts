/**
 * Validation utility functions for the Learn platform
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates if a value is not empty
 */
export const isNotEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === "object") return Object.keys(value).length > 0
  return true
}

/**
 * Validates minimum length for strings
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value && value.length >= minLength
}

/**
 * Validates maximum length for strings
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return !value || value.length <= maxLength
}

/**
 * Validates if a number is within a range
 */
export const isInRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max
}

/**
 * Validates if a value is a positive number
 */
export const isPositiveNumber = (value: any): boolean => {
  const num = Number(value)
  return !isNaN(num) && num > 0
}

/**
 * Validates if a value is a non-negative number (including zero)
 */
export const isNonNegativeNumber = (value: any): boolean => {
  const num = Number(value)
  return !isNaN(num) && num >= 0
}

/**
 * Validates programming language slug format
 */
export const isValidLanguageSlug = (slug: string): boolean => {
  if (!slug) return false
  // Allow lowercase letters, numbers, hyphens, and plus signs (for c++)
  return /^[a-z0-9+]+(?:-[a-z0-9+]+)*$/.test(slug)
}

/**
 * Validates difficulty level (1-5)
 */
export const isValidDifficultyLevel = (level: any): boolean => {
  const num = Number(level)
  return !isNaN(num) && isInRange(num, 1, 5)
}

/**
 * Validates if a string contains only safe characters (no XSS)
 */
export const isSafeString = (value: string): boolean => {
  if (!value) return true
  // Basic XSS prevention - no script tags or javascript: protocol
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ]
  return !dangerousPatterns.some((pattern) => pattern.test(value))
}

/**
 * Validates file extension for code files
 */
export const isValidCodeFileExtension = (filename: string): boolean => {
  if (!filename) return false
  const validExtensions = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".go",
    ".rs",
    ".php",
    ".rb",
    ".swift",
    ".kt",
    ".scala",
    ".html",
    ".css",
  ]
  return validExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
}
