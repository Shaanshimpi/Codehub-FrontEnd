/**
 * Validation utilities for tutorial data
 */
import type { Lesson, Tutorial } from "@/app/Learn/types/TutorialTypes"

/**
 * Validate tutorial structure
 */
export const validateTutorial = (
  tutorial: Tutorial
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!tutorial.id) {
    errors.push("Tutorial ID is required")
  }

  if (!tutorial.title || tutorial.title.trim().length === 0) {
    errors.push("Tutorial title is required")
  }

  if (!tutorial.lessons || tutorial.lessons.length === 0) {
    errors.push("Tutorial must have at least one lesson")
  }

  if (
    tutorial.difficulty &&
    (tutorial.difficulty < 1 || tutorial.difficulty > 3)
  ) {
    errors.push("Tutorial difficulty must be between 1 and 3")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate lesson structure
 */
export const validateLesson = (
  lesson: Lesson
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!lesson.id) {
    errors.push("Lesson ID is required")
  }

  if (!lesson.title || lesson.title.trim().length === 0) {
    errors.push("Lesson title is required")
  }

  if (!lesson.type) {
    errors.push("Lesson type is required")
  }

  const validTypes = [
    "concept",
    "mcq",
    "codeblock_rearranging",
    "fill_in_blanks",
  ]
  if (lesson.type && !validTypes.includes(lesson.type)) {
    errors.push(`Invalid lesson type: ${lesson.type}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check if lesson has required content based on type
 */
export const validateLessonContent = (
  lesson: Lesson
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  switch (lesson.type) {
    case "concept":
      if (!lesson.conceptData) {
        errors.push("Concept lesson must have conceptData")
      }
      break
    case "mcq":
      if (
        !lesson.mcqData ||
        !lesson.mcqData.questions ||
        lesson.mcqData.questions.length === 0
      ) {
        errors.push("MCQ lesson must have questions")
      }
      break
    case "codeblock_rearranging":
      if (
        !lesson.codeRearrangeData ||
        !lesson.codeRearrangeData.questions ||
        lesson.codeRearrangeData.questions.length === 0
      ) {
        errors.push("Code rearrange lesson must have questions")
      }
      break
    case "fill_in_blanks":
      if (
        !lesson.fibData ||
        !lesson.fibData.questions ||
        lesson.fibData.questions.length === 0
      ) {
        errors.push("Fill in blanks lesson must have questions")
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate progress data
 */
export const validateProgressData = (progress: any): boolean => {
  return !!(
    progress &&
    typeof progress === "object" &&
    progress.tutorialId &&
    typeof progress.currentLessonIndex === "number" &&
    Array.isArray(progress.completedLessons) &&
    typeof progress.totalTimeSpent === "number" &&
    typeof progress.lastAccessed === "number" &&
    typeof progress.bookmarked === "boolean" &&
    typeof progress.notes === "string"
  )
}
