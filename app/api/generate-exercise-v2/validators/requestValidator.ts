// validators/requestValidator.ts - Request validation functions
import { GenerateExerciseRequest } from "../interfaces/types"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates the incoming request for exercise generation
 */
export function validateExerciseRequest(request: any): ValidationResult {
  const errors: string[] = []

  // Check required fields
  if (!request.questionInput || typeof request.questionInput !== "string") {
    errors.push("questionInput is required and must be a string")
  }

  if (
    !request.selectedLanguage ||
    typeof request.selectedLanguage !== "string"
  ) {
    errors.push("selectedLanguage is required and must be a string")
  }

  if (request.difficulty === undefined || request.difficulty === null) {
    errors.push("difficulty is required")
  } else if (
    typeof request.difficulty !== "number" ||
    request.difficulty < 1 ||
    request.difficulty > 5
  ) {
    errors.push("difficulty must be a number between 1 and 5")
  }

  if (!request.selectedModel || typeof request.selectedModel !== "string") {
    errors.push("selectedModel is required and must be a string")
  }

  // Optional fields validation
  if (request.exclusions && typeof request.exclusions !== "string") {
    errors.push("exclusions must be a string if provided")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitizes and normalizes the request
 */
export function sanitizeRequest(request: any): GenerateExerciseRequest {
  return {
    questionInput: String(request.questionInput || "").trim(),
    selectedLanguage: String(request.selectedLanguage || "").trim(),
    difficulty: Number(request.difficulty) || 1,
    selectedModel: String(request.selectedModel || "").trim(),
    exclusions: request.exclusions
      ? String(request.exclusions).trim()
      : undefined,
  }
}

/**
 * Validates exercise generation parameters
 */
export function validateGenerationParams(
  params: GenerateExerciseRequest
): ValidationResult {
  const errors: string[] = []

  if (params.questionInput.length < 3) {
    errors.push("Question input must be at least 3 characters long")
  }

  if (params.questionInput.length > 500) {
    errors.push("Question input must be less than 500 characters")
  }

  if (params.selectedLanguage.length < 1) {
    errors.push("Programming language must be specified")
  }

  const validModels = [
    "google/gemini-2.5-flash-lite",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-pro",
    "qwen/qwen-2.5-72b-instruct",
    "google/gemini-1.5-pro",
    "openai/gpt-4o",
    "anthropic/claude-3.5-sonnet",
    "microsoft/wizardlm-2-8x22b",
  ]

  if (!validModels.includes(params.selectedModel)) {
    errors.push(
      `Invalid model selected. Must be one of: ${validModels.join(", ")}`
    )
  }

  if (params.exclusions && params.exclusions.length > 1000) {
    errors.push("Exclusions text must be less than 1000 characters")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
