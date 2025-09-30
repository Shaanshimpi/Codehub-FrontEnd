// Progress tracking utilities for exercises
import type { ExerciseProgressData } from "../types/ExerciseTypes"
import { getExerciseStorageKey } from "./exerciseHelpers"

/**
 * Save exercise progress to localStorage
 */
export const saveProgress = (
  exerciseId: string | number,
  progress: number,
  additionalData?: Partial<ExerciseProgressData>
): void => {
  try {
    const progressKey = getExerciseStorageKey(exerciseId, "progress")
    const progressData: ExerciseProgressData = {
      exerciseId: exerciseId.toString(),
      progress,
      timeSpent: 0,
      attempts: 1,
      ...additionalData,
    }

    // If progress is 100%, mark as completed
    if (progress >= 100 && !progressData.completedAt) {
      progressData.completedAt = new Date()
    }

    localStorage.setItem(progressKey, JSON.stringify(progressData))
  } catch (error) {
    console.error("Error saving progress:", error)
  }
}

/**
 * Get exercise progress from localStorage
 */
export const getProgress = (
  exerciseId: string | number
): ExerciseProgressData | null => {
  try {
    const progressKey = getExerciseStorageKey(exerciseId, "progress")
    const stored = localStorage.getItem(progressKey)

    if (!stored) return null

    const data = JSON.parse(stored) as ExerciseProgressData

    // Convert completedAt string back to Date if it exists
    if (data.completedAt) {
      data.completedAt = new Date(data.completedAt)
    }

    return data
  } catch (error) {
    console.error("Error getting progress:", error)
    return null
  }
}

/**
 * Update exercise progress incrementally
 */
export const updateProgress = (
  exerciseId: string | number,
  newProgress: number
): void => {
  const existing = getProgress(exerciseId)
  const currentProgress = existing?.progress || 0

  // Only update if new progress is higher
  if (newProgress > currentProgress) {
    saveProgress(exerciseId, newProgress, {
      ...existing,
      attempts: (existing?.attempts || 0) + 1,
    })
  }
}

/**
 * Mark exercise as completed
 */
export const markCompleted = (
  exerciseId: string | number,
  timeSpent?: number
): void => {
  const existing = getProgress(exerciseId)
  saveProgress(exerciseId, 100, {
    ...existing,
    completedAt: new Date(),
    timeSpent: timeSpent || existing?.timeSpent || 0,
  })
}

/**
 * Check if exercise is completed
 */
export const isCompleted = (exerciseId: string | number): boolean => {
  const progress = getProgress(exerciseId)
  return progress?.progress === 100 && !!progress.completedAt
}

/**
 * Get completion percentage for multiple exercises
 */
export const getOverallProgress = (exerciseIds: string[]): number => {
  if (exerciseIds.length === 0) return 0

  const completedCount = exerciseIds.filter((id) => isCompleted(id)).length
  return Math.round((completedCount / exerciseIds.length) * 100)
}

/**
 * Clear progress for an exercise
 */
export const clearProgress = (exerciseId: string | number): void => {
  try {
    const progressKey = getExerciseStorageKey(exerciseId, "progress")
    localStorage.removeItem(progressKey)
  } catch (error) {
    console.error("Error clearing progress:", error)
  }
}

/**
 * Get all exercise progress data
 */
export const getAllProgress = (): Record<string, ExerciseProgressData> => {
  const progress: Record<string, ExerciseProgressData> = {}

  try {
    // Iterate through localStorage to find exercise progress keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.includes("exercise_") && key.endsWith("_progress")) {
        const data = localStorage.getItem(key)
        if (data) {
          const progressData = JSON.parse(data) as ExerciseProgressData
          progress[progressData.exerciseId] = progressData
        }
      }
    }
  } catch (error) {
    console.error("Error getting all progress:", error)
  }

  return progress
}
