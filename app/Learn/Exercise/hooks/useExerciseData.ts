// Custom hook for managing exercise data fetching and caching
import { useCallback, useEffect, useState } from "react"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import { validateExerciseData } from "../utils/exerciseHelpers"

interface UseExerciseDataProps {
  exerciseId?: string | number
  initialData?: ExerciseAIData
}

interface UseExerciseDataReturn {
  exercise: ExerciseAIData | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Custom hook for managing exercise data
 * Handles loading, caching, and validation of exercise data
 */
export const useExerciseData = ({
  exerciseId,
  initialData,
}: UseExerciseDataProps = {}): UseExerciseDataReturn => {
  const [exercise, setExercise] = useState<ExerciseAIData | null>(
    initialData || null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExercise = useCallback(async () => {
    if (!exerciseId) {
      setError("No exercise ID provided")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would make an API call
      // For now, we'll use the initialData or return an error
      if (initialData) {
        if (validateExerciseData(initialData)) {
          setExercise(initialData)
        } else {
          setError("Invalid exercise data structure")
        }
      } else {
        setError("Exercise data not available")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exercise")
    } finally {
      setIsLoading(false)
    }
  }, [exerciseId, initialData])

  const refetch = useCallback(() => {
    fetchExercise()
  }, [fetchExercise])

  useEffect(() => {
    if (exerciseId && !exercise) {
      fetchExercise()
    }
  }, [exerciseId, exercise, fetchExercise])

  // Validate exercise data when it changes
  useEffect(() => {
    if (exercise && !validateExerciseData(exercise)) {
      setError("Exercise data validation failed")
    }
  }, [exercise])

  return {
    exercise,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for caching exercise data in localStorage
 */
export const useExerciseCache = (exerciseId: string | number) => {
  const cacheKey = `exercise_cache_${exerciseId}`

  const getCachedExercise = useCallback((): ExerciseAIData | null => {
    try {
      const cached = localStorage.getItem(cacheKey)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  }, [cacheKey])

  const setCachedExercise = useCallback(
    (exercise: ExerciseAIData) => {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(exercise))
      } catch (error) {
        console.error("Failed to cache exercise:", error)
      }
    },
    [cacheKey]
  )

  const clearCachedExercise = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey)
    } catch (error) {
      console.error("Failed to clear exercise cache:", error)
    }
  }, [cacheKey])

  return {
    getCachedExercise,
    setCachedExercise,
    clearCachedExercise,
  }
}
