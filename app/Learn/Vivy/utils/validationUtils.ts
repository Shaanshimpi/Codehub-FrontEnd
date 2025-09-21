import { ValidationError } from "../types"
import { CONVERSATION_CONFIG, ERROR_MESSAGES, USER_CONFIG } from "./constants"

/**
 * Utility functions for data validation
 */

export class ValidationResult {
  constructor(
    public isValid: boolean,
    public errors: ValidationError[] = []
  ) {}

  static success(): ValidationResult {
    return new ValidationResult(true, [])
  }

  static error(field: string, message: string, code: string): ValidationResult {
    return new ValidationResult(false, [{ field, message, code }])
  }

  static errors(errors: ValidationError[]): ValidationResult {
    return new ValidationResult(false, errors)
  }

  addError(field: string, message: string, code: string): ValidationResult {
    this.errors.push({ field, message, code })
    this.isValid = false
    return this
  }

  getFirstError(): string | null {
    return this.errors.length > 0 ? this.errors[0].message : null
  }
}

export const validateUserId = (userId: any): ValidationResult => {
  if (userId === null || userId === undefined) {
    return ValidationResult.error("userId", "User ID is required", "REQUIRED")
  }

  // Handle string user IDs (temporary users)
  if (typeof userId === "string") {
    if (userId.startsWith(USER_CONFIG.TEMP_USER_PREFIX)) {
      return ValidationResult.success()
    }

    // Try to parse as number
    const parsed = parseInt(userId, 10)
    if (isNaN(parsed)) {
      return ValidationResult.error(
        "userId",
        ERROR_MESSAGES.USER_ID_INVALID,
        "INVALID_FORMAT"
      )
    }

    return validateNumericUserId(parsed)
  }

  // Handle numeric user IDs
  if (typeof userId === "number") {
    return validateNumericUserId(userId)
  }

  return ValidationResult.error(
    "userId",
    ERROR_MESSAGES.USER_ID_INVALID,
    "INVALID_TYPE"
  )
}

const validateNumericUserId = (userId: number): ValidationResult => {
  if (!Number.isInteger(userId)) {
    return ValidationResult.error(
      "userId",
      "User ID must be an integer",
      "INVALID_FORMAT"
    )
  }

  if (userId < USER_CONFIG.MIN_USER_ID || userId > USER_CONFIG.MAX_USER_ID) {
    return ValidationResult.error(
      "userId",
      `User ID must be between ${USER_CONFIG.MIN_USER_ID} and ${USER_CONFIG.MAX_USER_ID}`,
      "OUT_OF_RANGE"
    )
  }

  return ValidationResult.success()
}

export const validateConversationTitle = (title: string): ValidationResult => {
  if (!title || typeof title !== "string") {
    return ValidationResult.error("title", "Title is required", "REQUIRED")
  }

  const trimmed = title.trim()

  if (trimmed.length < CONVERSATION_CONFIG.MIN_TITLE_LENGTH) {
    return ValidationResult.error("title", "Title cannot be empty", "TOO_SHORT")
  }

  if (trimmed.length > CONVERSATION_CONFIG.MAX_TITLE_LENGTH) {
    return ValidationResult.error(
      "title",
      ERROR_MESSAGES.TITLE_TOO_LONG,
      "TOO_LONG"
    )
  }

  return ValidationResult.success()
}

export const validateMessageContent = (content: string): ValidationResult => {
  if (!content || typeof content !== "string") {
    return ValidationResult.error(
      "content",
      "Message content is required",
      "REQUIRED"
    )
  }

  const trimmed = content.trim()

  if (trimmed.length === 0) {
    return ValidationResult.error("content", "Message cannot be empty", "EMPTY")
  }

  if (trimmed.length > CONVERSATION_CONFIG.MAX_MESSAGE_LENGTH) {
    return ValidationResult.error(
      "content",
      ERROR_MESSAGES.MESSAGE_TOO_LONG,
      "TOO_LONG"
    )
  }

  return ValidationResult.success()
}

export const validateModel = (model: string): ValidationResult => {
  if (!model || typeof model !== "string") {
    return ValidationResult.error("model", "Model is required", "REQUIRED")
  }

  const trimmed = model.trim()

  if (trimmed.length === 0) {
    return ValidationResult.error("model", "Model cannot be empty", "EMPTY")
  }

  // Basic format validation (provider/model-name)
  if (!trimmed.includes("/")) {
    return ValidationResult.error(
      "model",
      "Invalid model format",
      "INVALID_FORMAT"
    )
  }

  return ValidationResult.success()
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== "string") {
    return ValidationResult.error("email", "Email is required", "REQUIRED")
  }

  const trimmed = email.trim()

  if (trimmed.length === 0) {
    return ValidationResult.error("email", "Email cannot be empty", "EMPTY")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return ValidationResult.error(
      "email",
      "Invalid email format",
      "INVALID_FORMAT"
    )
  }

  return ValidationResult.success()
}

export const validatePagination = (
  page?: number,
  limit?: number
): ValidationResult => {
  const result = ValidationResult.success()

  if (page !== undefined) {
    if (!Number.isInteger(page) || page < 1) {
      result.addError(
        "page",
        "Page must be a positive integer",
        "INVALID_VALUE"
      )
    }
  }

  if (limit !== undefined) {
    if (!Number.isInteger(limit) || limit < 1) {
      result.addError(
        "limit",
        "Limit must be a positive integer",
        "INVALID_VALUE"
      )
    } else if (limit > CONVERSATION_CONFIG.MAX_PAGE_SIZE) {
      result.addError(
        "limit",
        `Limit cannot exceed ${CONVERSATION_CONFIG.MAX_PAGE_SIZE}`,
        "TOO_LARGE"
      )
    }
  }

  return result
}

export const validateTags = (tags: string[]): ValidationResult => {
  if (!Array.isArray(tags)) {
    return ValidationResult.error(
      "tags",
      "Tags must be an array",
      "INVALID_TYPE"
    )
  }

  const result = ValidationResult.success()

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]

    if (typeof tag !== "string") {
      result.addError(`tags[${i}]`, "Tag must be a string", "INVALID_TYPE")
      continue
    }

    const trimmed = tag.trim()
    if (trimmed.length === 0) {
      result.addError(`tags[${i}]`, "Tag cannot be empty", "EMPTY")
    } else if (trimmed.length > 50) {
      result.addError(
        `tags[${i}]`,
        "Tag is too long (max 50 characters)",
        "TOO_LONG"
      )
    }
  }

  return result
}

export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return ""

  return input
    .trim()
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0)
      return !(code >= 0 && code <= 31) && !(code >= 127 && code <= 159)
    })
    .join("")
    .slice(0, 10000) // Prevent extremely long inputs
}

export const isTemporaryUserId = (userId: string | number): boolean => {
  return (
    typeof userId === "string" &&
    userId.startsWith(USER_CONFIG.TEMP_USER_PREFIX)
  )
}

export const parseUserId = (userId: string | number): number | string => {
  if (typeof userId === "number") return userId
  if (typeof userId === "string") {
    if (isTemporaryUserId(userId)) return userId
    const parsed = parseInt(userId, 10)
    return isNaN(parsed) ? userId : parsed
  }
  throw new Error("Invalid user ID type")
}
