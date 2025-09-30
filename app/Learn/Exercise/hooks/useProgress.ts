// Custom hook for managing exercise progress
import { useCallback, useEffect, useState } from "react"
import type { ExerciseProgressData } from "../types/ExerciseTypes"
import {
  clearProgress,
  getProgress,
  markCompleted,
  saveProgress,
  updateProgress,
} from "../utils/progressTracker"

interface UseProgressProps {
  exerciseId: string | number
  autoSave?: boolean
}

interface UseProgressReturn {
  progress: number
  progressData: ExerciseProgressData | null
  isCompleted: boolean
  updateProgress: (newProgress: number) => void
  markAsCompleted: (timeSpent?: number) => void
  resetProgress: () => void
  incrementAttempts: () => void
}

/**
 * Custom hook for managing exercise progress with localStorage persistence
 */
export const useProgress = ({
  exerciseId,
  autoSave = true,
}: UseProgressProps): UseProgressReturn => {
  const [progress, setProgress] = useState(0)
  const [progressData, setProgressData] = useState<ExerciseProgressData | null>(
    null
  )
  const [completed, setCompleted] = useState(false)

  // Load initial progress from localStorage
  useEffect(() => {
    const saved = getProgress(exerciseId)
    if (saved) {
      setProgress(saved.progress)
      setProgressData(saved)
      setCompleted(saved.progress === 100 && !!saved.completedAt)
    }
  }, [exerciseId])

  // Update progress with optional auto-save
  const handleUpdateProgress = useCallback(
    (newProgress: number) => {
      const clampedProgress = Math.min(Math.max(newProgress, 0), 100)
      setProgress(clampedProgress)

      if (autoSave) {
        updateProgress(exerciseId, clampedProgress)
        // Refresh progress data
        const updated = getProgress(exerciseId)
        if (updated) {
          setProgressData(updated)
        }
      }
    },
    [exerciseId, autoSave]
  )

  // Mark exercise as completed
  const markAsCompleted = useCallback(
    (timeSpent?: number) => {
      setProgress(100)
      setCompleted(true)
      markCompleted(exerciseId, timeSpent)

      // Refresh progress data
      const updated = getProgress(exerciseId)
      if (updated) {
        setProgressData(updated)
      }
    },
    [exerciseId]
  )

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress(0)
    setCompleted(false)
    setProgressData(null)
    clearProgress(exerciseId)
  }, [exerciseId])

  // Increment attempt counter
  const incrementAttempts = useCallback(() => {
    const current = getProgress(exerciseId)
    saveProgress(exerciseId, progress, {
      ...current,
      attempts: (current?.attempts || 0) + 1,
    })

    // Refresh progress data
    const updated = getProgress(exerciseId)
    if (updated) {
      setProgressData(updated)
    }
  }, [exerciseId, progress])

  return {
    progress,
    progressData,
    isCompleted: completed,
    updateProgress: handleUpdateProgress,
    markAsCompleted,
    resetProgress,
    incrementAttempts,
  }
}

/**
 * Hook for tracking time spent on exercise
 */
export const useTimeTracker = () => {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [totalTime, setTotalTime] = useState(0)
  const [isTracking, setIsTracking] = useState(false)

  const startTracking = useCallback(() => {
    setStartTime(new Date())
    setIsTracking(true)
  }, [])

  const stopTracking = useCallback(() => {
    if (startTime && isTracking) {
      const elapsed = new Date().getTime() - startTime.getTime()
      setTotalTime((prev) => prev + elapsed)
      setIsTracking(false)
      setStartTime(null)
    }
  }, [startTime, isTracking])

  const resetTime = useCallback(() => {
    setTotalTime(0)
    setStartTime(null)
    setIsTracking(false)
  }, [])

  const getCurrentTime = useCallback(() => {
    if (startTime && isTracking) {
      const current = new Date().getTime() - startTime.getTime()
      return totalTime + current
    }
    return totalTime
  }, [startTime, isTracking, totalTime])

  return {
    startTracking,
    stopTracking,
    resetTime,
    getCurrentTime,
    isTracking,
    totalTime,
  }
}

/**
 * Hook for managing progress milestones
 */
export const useProgressMilestones = (exerciseId: string | number) => {
  const [milestones, setMilestones] = useState({
    viewedProblem: false,
    loadedBoilerplate: false,
    writtenCode: false,
    ranCode: false,
    viewedSolution: false,
  })

  const markMilestone = useCallback(
    (milestone: keyof typeof milestones) => {
      setMilestones((prev) => {
        const updated = { ...prev, [milestone]: true }

        // Calculate progress based on milestones
        const progressMap = {
          viewedProblem: 10,
          loadedBoilerplate: 25,
          writtenCode: 50,
          ranCode: 75,
          viewedSolution: 90,
        }

        const currentProgress = Object.entries(updated)
          .filter(([_, achieved]) => achieved)
          .reduce(
            (total, [key]) =>
              total + progressMap[key as keyof typeof progressMap],
            0
          )

        updateProgress(exerciseId, currentProgress)

        return updated
      })
    },
    [exerciseId]
  )

  const resetMilestones = useCallback(() => {
    setMilestones({
      viewedProblem: false,
      loadedBoilerplate: false,
      writtenCode: false,
      ranCode: false,
      viewedSolution: false,
    })
  }, [])

  return {
    milestones,
    markMilestone,
    resetMilestones,
  }
}
