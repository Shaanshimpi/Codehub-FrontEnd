// Exercise-specific utility functions
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"

/**
 * Get exercise content
 * Multi-language support has been removed
 */
export const getLocalizedContent = (exerciseData: ExerciseAIData) => {
  return {
    title: exerciseData.title,
    hints: exerciseData.hints,
    explanation: exerciseData.explanation,
  }
}

/**
 * Get difficulty label for display
 */
export const getDifficultyLabel = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    default:
      return "Unknown"
  }
}

/**
 * Get difficulty color class for styling
 */
export const getDifficultyColor = (level: number) => {
  switch (level) {
    case 1:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    case 2:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    case 3:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
  }
}

/**
 * Calculate exercise completion percentage based on various factors
 */
export const calculateProgress = ({
  hasViewedProblem = false,
  hasLoadedBoilerplate = false,
  hasWrittenCode = false,
  hasRunCode = false,
  hasViewedSolution = false,
  isCompleted = false,
}: {
  hasViewedProblem?: boolean
  hasLoadedBoilerplate?: boolean
  hasWrittenCode?: boolean
  hasRunCode?: boolean
  hasViewedSolution?: boolean
  isCompleted?: boolean
}) => {
  if (isCompleted) return 100

  let progress = 0
  if (hasViewedProblem) progress += 10
  if (hasLoadedBoilerplate) progress += 15
  if (hasWrittenCode) progress += 25
  if (hasRunCode) progress += 25
  if (hasViewedSolution) progress += 25

  return Math.min(progress, 95) // Cap at 95% until explicitly completed
}

/**
 * Format time duration for display
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Validate exercise data structure
 */
export const validateExerciseData = (exercise: any): boolean => {
  return !!(
    exercise &&
    exercise.title &&
    exercise.slug &&
    (exercise.solution_code || exercise.boilerplate_code)
  )
}

/**
 * Generate unique storage key for exercise data
 */
export const getExerciseStorageKey = (
  exerciseId: string | number,
  dataType: "state" | "progress" | "settings" = "state"
): string => {
  return `exercise_${exerciseId}_${dataType}`
}
