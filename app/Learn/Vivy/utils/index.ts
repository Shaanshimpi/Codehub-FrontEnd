// Re-export all utilities
export * from "./constants"
export * from "./dateUtils"
export * from "./tokenUtils"
export * from "./validationUtils"
export * from "./budget"

// User ID validation functions for API compatibility
export const validateUserId = (
  userId: string
): { isValid: boolean; getFirstError: () => string } => {
  if (!userId || typeof userId !== "string") {
    return {
      isValid: false,
      getFirstError: () => "User ID is required and must be a string",
    }
  }

  if (userId.trim().length === 0) {
    return {
      isValid: false,
      getFirstError: () => "User ID cannot be empty",
    }
  }

  return { isValid: true, getFirstError: () => "" }
}

export const validatePagination = (
  page: number,
  limit: number
): { isValid: boolean; getFirstError: () => string } => {
  if (!Number.isInteger(page) || page < 1) {
    return {
      isValid: false,
      getFirstError: () => "Page must be a positive integer",
    }
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return {
      isValid: false,
      getFirstError: () => "Limit must be between 1 and 100",
    }
  }

  return { isValid: true, getFirstError: () => "" }
}

export const parseUserId = (userId: string): string | number => {
  // Try to parse as number first
  const numericId = parseInt(userId, 10)
  if (!isNaN(numericId) && numericId.toString() === userId) {
    return numericId
  }

  // Return as string if not a valid number
  return userId
}

export const isTemporaryUserId = (userId: string | number): boolean => {
  if (typeof userId === "number") return false
  return typeof userId === "string" && userId.startsWith("temp_")
}

// Common utility functions
export const createId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < attempts - 1) {
        await sleep(delay * Math.pow(2, i)) // Exponential backoff
      }
    }
  }

  throw lastError!
}

export const safeParseJSON = <T = any>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const isEmpty = (value: any): boolean => {
  if (value == null) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.keys(value).length === 0
  return false
}

export const scrollToBottom = (
  element: HTMLElement | null,
  smooth = true
): void => {
  if (!element) return

  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? "smooth" : "auto",
  })
}

export const generateTitle = (text: string, maxLength = 50): string => {
  if (!text || typeof text !== "string") return "New Conversation"

  const trimmed = text.trim()
  if (trimmed.length === 0) return "New Conversation"

  if (trimmed.length <= maxLength) return trimmed

  // Try to break at word boundary
  const truncated = trimmed.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + "..."
  }

  return truncated + "..."
}
