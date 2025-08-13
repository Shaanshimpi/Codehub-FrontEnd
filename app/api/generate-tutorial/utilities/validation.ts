// app/api/generate-tutorial/utilities/validation.ts
// Validation utilities for tutorial generation
import type { ProgrammingTutorial } from "../interfaces/types"

// ==================== VALIDATION FUNCTIONS ====================

export const validateTutorial = (
  tutorial: ProgrammingTutorial
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Basic validation
  if (!tutorial.id || tutorial.id.trim().length === 0) {
    errors.push("Tutorial ID is required")
  }

  if (!tutorial.title || tutorial.title.trim().length === 0) {
    errors.push("Tutorial title is required")
  }

  // Validate reference field (required)
  if (!tutorial.reference) {
    errors.push("Tutorial reference field is required")
  } else {
    if (
      !tutorial.reference.title ||
      tutorial.reference.title.trim().length === 0
    ) {
      errors.push("Reference title is required")
    }
    if (
      !tutorial.reference.subtitle ||
      tutorial.reference.subtitle.trim().length === 0
    ) {
      errors.push("Reference subtitle is required")
    }
    if (
      !tutorial.reference.introduction ||
      tutorial.reference.introduction.trim().length === 0
    ) {
      errors.push("Reference introduction is required")
    }
    if (
      !tutorial.reference.examples ||
      tutorial.reference.examples.length < 3
    ) {
      errors.push("Reference must have at least 3 examples")
    }
    if (
      !tutorial.reference.key_points ||
      tutorial.reference.key_points.length < 3
    ) {
      errors.push("Reference must have at least 3 key points")
    }
    if (
      !tutorial.reference.common_mistakes ||
      tutorial.reference.common_mistakes.length < 2
    ) {
      errors.push("Reference must have at least 2 common mistakes")
    }
  }

  if (!tutorial.lessons || tutorial.lessons.length < 5) {
    errors.push("Tutorial must have at least 5 lessons")
  }

  if (tutorial.lessons && tutorial.lessons.length > 20) {
    errors.push("Tutorial should not exceed 20 lessons")
  }

  // Validate lesson types and content structure
  const validLessonTypes = [
    "concept",
    "mcq",
    "codeblock_rearranging",
    "fill_in_blanks",
  ]
  tutorial.lessons?.forEach((lesson, index) => {
    if (!validLessonTypes.includes(lesson.type)) {
      errors.push(`Lesson ${index + 1} has invalid type: ${lesson.type}`)
    }

    if (lesson.estimatedTime < 5 || lesson.estimatedTime > 45) {
      errors.push(
        `Lesson ${index + 1} estimated time should be between 5-45 minutes`
      )
    }

    // Validate lesson content matches its type
    const contentValidation = validateLessonContent(lesson.content, lesson.type)
    if (!contentValidation.isValid) {
      contentValidation.errors.forEach((error) => {
        errors.push(`Lesson ${index + 1} content error: ${error}`)
      })
    }
  })

  // Validate difficulty levels
  if (![1, 2, 3].includes(tutorial.difficulty)) {
    errors.push("Tutorial difficulty must be 1, 2, or 3")
  }

  // Validate learning objectives
  if (!tutorial.learningObjectives || tutorial.learningObjectives.length < 3) {
    errors.push("Tutorial must have at least 3 learning objectives")
  }

  if (tutorial.learningObjectives && tutorial.learningObjectives.length > 8) {
    errors.push("Tutorial should not exceed 8 learning objectives")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateAPIResponse = (
  response: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Modern English-only structure validation
  const requiredFields = [
    "id",
    "title",
    "description",
    "learningObjectives",
    "keyTopics",
    "difficulty",
    "lessons",
    "practicalApplications",
    "tags",
  ]

  requiredFields.forEach((field) => {
    if (!response[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  })

  // Ensure title and description are strings, not objects
  if (response.title && typeof response.title === "object") {
    errors.push("Title should be a string, not an object")
  }

  if (response.description && typeof response.description === "object") {
    errors.push("Description should be a string, not an object")
  }

  // Lessons validation
  if (response.lessons && Array.isArray(response.lessons)) {
    if (response.lessons.length < 5) {
      errors.push("Must have at least 5 lessons")
    }

    response.lessons.forEach((lesson: any, index: number) => {
      const validTypes = [
        "concept",
        "mcq",
        "codeblock_rearranging",
        "fill_in_blanks",
      ]
      if (!validTypes.includes(lesson.type)) {
        errors.push(`Lesson ${index + 1} has invalid type: ${lesson.type}`)
      }

      if (!lesson.title) {
        errors.push(`Lesson ${index + 1} missing title`)
      }

      if (!lesson.content || typeof lesson.content !== "object") {
        errors.push(`Lesson ${index + 1} missing or invalid content`)
      }

      if (!lesson.id) {
        errors.push(`Lesson ${index + 1} missing id`)
      }

      if (
        !lesson.learningObjectives ||
        !Array.isArray(lesson.learningObjectives)
      ) {
        errors.push(`Lesson ${index + 1} missing or invalid learningObjectives`)
      }

      if (typeof lesson.order !== "number") {
        errors.push(`Lesson ${index + 1} missing or invalid order`)
      }
    })
  } else {
    errors.push("Lessons must be an array")
  }

  // Difficulty validation
  if (![1, 2, 3].includes(response.difficulty)) {
    errors.push("Difficulty must be 1, 2, or 3")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ==================== CONTENT VALIDATION ====================

export const validateConceptContent = (
  content: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!content.explanation) errors.push("Concept content missing explanation")
  if (
    !content.keyPoints ||
    !Array.isArray(content.keyPoints) ||
    content.keyPoints.length < 3
  ) {
    errors.push("Concept content must have at least 3 key points")
  }
  if (
    !content.codeExamples ||
    !Array.isArray(content.codeExamples) ||
    content.codeExamples.length < 1
  ) {
    errors.push("Concept content must have at least 1 code example")
  }
  if (
    !content.practiceHints ||
    !Array.isArray(content.practiceHints) ||
    content.practiceHints.length < 2
  ) {
    errors.push("Concept content must have at least 2 practice hints")
  }

  return { isValid: errors.length === 0, errors }
}

export const validateMCQContent = (
  content: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (
    !content.questions ||
    !Array.isArray(content.questions) ||
    content.questions.length < 1
  ) {
    errors.push("MCQ content must have at least 1 question")
  }

  content.questions?.forEach((question: any, index: number) => {
    if (!question.question)
      errors.push(`Question ${index + 1} missing question text`)
    if (
      !question.options ||
      !Array.isArray(question.options) ||
      question.options.length !== 4
    ) {
      errors.push(`Question ${index + 1} must have exactly 4 options`)
    }
    if (!question.explanation)
      errors.push(`Question ${index + 1} missing explanation`)

    // Check that exactly one option is correct
    const correctOptions =
      question.options?.filter((opt: any) => opt.isCorrect) || []
    if (correctOptions.length !== 1) {
      errors.push(`Question ${index + 1} must have exactly one correct answer`)
    }
  })

  return { isValid: errors.length === 0, errors }
}

export const validateCodeBlockRearrangingContent = (
  content: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!content.scenario)
    errors.push("Code rearranging content missing scenario")
  if (!content.targetCode)
    errors.push("Code rearranging content missing target code")
  if (
    !content.codeBlocks ||
    !Array.isArray(content.codeBlocks) ||
    content.codeBlocks.length < 3
  ) {
    errors.push("Code rearranging content must have at least 3 code blocks")
  }
  if (!content.correctOrder || !Array.isArray(content.correctOrder)) {
    errors.push("Code rearranging content missing correct order")
  }

  return { isValid: errors.length === 0, errors }
}

export const validateFillInBlanksContent = (
  content: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!content.scenario) errors.push("Fill in blanks content missing scenario")
  if (!content.codeTemplate)
    errors.push("Fill in blanks content missing code template")
  if (
    !content.blanks ||
    !Array.isArray(content.blanks) ||
    content.blanks.length < 1
  ) {
    errors.push("Fill in blanks content must have at least 1 blank")
  }
  if (!content.solution || !content.solution.completeCode) {
    errors.push("Fill in blanks content must have complete solution")
  }

  return { isValid: errors.length === 0, errors }
}

// ==================== HELPER FUNCTIONS ====================

// Removed multilingual validation - no longer needed

export const isValidLessonType = (
  type: any
): type is "concept" | "mcq" | "codeblock_rearranging" | "fill_in_blanks" => {
  return ["concept", "mcq", "codeblock_rearranging", "fill_in_blanks"].includes(
    type
  )
}

export const isValidDifficulty = (difficulty: any): difficulty is 1 | 2 | 3 => {
  return [1, 2, 3].includes(difficulty)
}

// ==================== LESSON CONTENT VALIDATION ====================

export const validateLessonContent = (
  content: any,
  lessonType: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!content || typeof content !== "object") {
    errors.push("Lesson content is required and must be an object")
    return { isValid: false, errors }
  }

  switch (lessonType) {
    case "concept":
      const conceptValidation = validateConceptContent(content)
      return conceptValidation

    case "mcq":
      const mcqValidation = validateMCQContent(content)
      return mcqValidation

    case "codeblock_rearranging":
      const codeBlockValidation = validateCodeBlockRearrangingContent(content)
      return codeBlockValidation

    case "fill_in_blanks":
      const fillBlanksValidation = validateFillInBlanksContent(content)
      return fillBlanksValidation

    default:
      errors.push(`Unknown lesson type: ${lessonType}`)
      return { isValid: false, errors }
  }
}
