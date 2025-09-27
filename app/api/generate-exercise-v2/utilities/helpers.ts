// utilities/helpers.ts - Helper functions for exercise generation
import { ExerciseResponse } from "../interfaces/types"

/**
 * Validates that visual_elements are present and properly structured
 */
export function validateVisualElements(exercise: ExerciseResponse): {
  isValid: boolean
  error?: string
} {
  if (!exercise.visual_elements) {
    return {
      isValid: false,
      error: "Response missing required visual elements",
    }
  }

  const visualElements = exercise.visual_elements

  // Check for required execution steps
  if (
    !visualElements.execution_steps ||
    !Array.isArray(visualElements.execution_steps)
  ) {
    return {
      isValid: false,
      error: "Response missing required execution steps with memory states",
    }
  }

  // Check for required concepts
  if (!visualElements.concepts || !Array.isArray(visualElements.concepts)) {
    return {
      isValid: false,
      error: "Response missing required concepts",
    }
  }

  return { isValid: true }
}

/**
 * Validates that code is plain text (not HTML)
 */
export function validateCodeFormat(exercise: ExerciseResponse): {
  warnings: string[]
} {
  const warnings: string[] = []

  // Check solution code for HTML formatting
  if (
    exercise.solution_code &&
    (exercise.solution_code.includes("<pre>") ||
      exercise.solution_code.includes("<code>"))
  ) {
    warnings.push(
      "⚠️ Solution code contains HTML formatting - this should be plain text"
    )
  }

  // Check boilerplate code for HTML formatting
  if (
    exercise.boilerplate_code &&
    (exercise.boilerplate_code.includes("<pre>") ||
      exercise.boilerplate_code.includes("<code>"))
  ) {
    warnings.push(
      "⚠️ Boilerplate code contains HTML formatting - this should be plain text"
    )
  }

  return { warnings }
}

/**
 * Validates code completeness
 */
export function validateCodeCompleteness(
  exercise: ExerciseResponse,
  selectedLanguage: string
): {
  warnings: string[]
} {
  const warnings: string[] = []

  if (exercise.solution_code) {
    const codeLength = exercise.solution_code.length
    const hasMain =
      exercise.solution_code.includes("main(") ||
      exercise.solution_code.includes("main ")
    const hasReturn = exercise.solution_code.includes("return")

    if (codeLength < 50) {
      warnings.push("⚠️ Solution code seems too short - may be incomplete")
    }

    const language = (selectedLanguage || "").toLowerCase()
    if (!hasMain && (language.includes("c") || language.includes("java"))) {
      warnings.push(
        "⚠️ Solution code missing main function for compiled language"
      )
    }

    if (!hasReturn) {
      warnings.push("⚠️ Solution code missing return statements")
    }
  }

  if (exercise.boilerplate_code) {
    const boilerplateLength = exercise.boilerplate_code.length
    const hasStructure =
      exercise.boilerplate_code.includes("TODO") ||
      exercise.boilerplate_code.includes("todo")

    if (boilerplateLength < 30) {
      warnings.push("⚠️ Boilerplate code seems too short - may be incomplete")
    }

    if (!hasStructure) {
      warnings.push("⚠️ Boilerplate code missing TODO comments for guidance")
    }
  }

  return { warnings }
}

/**
 * Validates Mermaid diagram for proper formatting
 */
export function validateMermaidDiagram(exercise: ExerciseResponse): {
  warnings: string[]
} {
  const warnings: string[] = []

  if (exercise.mermaid_diagram) {
    const mermaidContent = exercise.mermaid_diagram
    // Check for single quotes in node labels (potential issue)
    if (mermaidContent.includes("'") && !mermaidContent.includes('"')) {
      warnings.push(
        "⚠️ Mermaid diagram may be using single quotes instead of double quotes"
      )
    }
  }

  return { warnings }
}

/**
 * Creates a comprehensive validation summary
 */
export function createValidationSummary(
  exercise: ExerciseResponse,
  selectedLanguage: string
): {
  isValid: boolean
  error?: string
  warnings: string[]
  summary: Record<string, any>
} {
  const visualValidation = validateVisualElements(exercise)
  if (!visualValidation.isValid) {
    return {
      isValid: false,
      error: visualValidation.error,
      warnings: [],
      summary: {},
    }
  }

  const codeFormatValidation = validateCodeFormat(exercise)
  const codeCompletenessValidation = validateCodeCompleteness(
    exercise,
    selectedLanguage
  )
  const mermaidValidation = validateMermaidDiagram(exercise)

  const allWarnings = [
    ...codeFormatValidation.warnings,
    ...codeCompletenessValidation.warnings,
    ...mermaidValidation.warnings,
  ]

  const summary = {
    executionStepsWithMemory: exercise.visual_elements.execution_steps.length,
    concepts: exercise.visual_elements.concepts.length,
    hasBoilerplate: !!exercise.boilerplate_code,
    codeFormat: exercise.solution_code?.includes("<") ? "HTML" : "Plain Text",
    boilerplateFormat: exercise.boilerplate_code?.includes("<")
      ? "HTML"
      : "Plain Text",
    mermaidQuotes: exercise.mermaid_diagram?.includes('"')
      ? "Double Quotes"
      : "Single Quotes",
  }

  return {
    isValid: true,
    warnings: allWarnings,
    summary,
  }
}

/**
 * Logs validation results
 */
export function logValidationResults(
  validation: ReturnType<typeof createValidationSummary>
): void {
  if (!validation.isValid) {
    console.error("❌ Validation failed:", validation.error)
    return
  }

  validation.warnings.forEach((warning) => {
    console.warn(warning)
  })

  console.log("✅ All validations passed:", validation.summary)
}
