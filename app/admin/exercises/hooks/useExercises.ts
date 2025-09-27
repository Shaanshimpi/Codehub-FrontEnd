import { useCallback, useEffect, useMemo, useState } from "react"

export interface Exercise {
  id: string
  title: string
  description: string
  difficultyLevel: number
  index: number
  isLocked: boolean
  slug: string
  programmingLanguage: {
    id: string
    title: string
    slug: string
  }
  tutorial?: {
    id: string
    title: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

interface UseExercisesParams {
  programmingLanguage?: string
  tutorial?: string
  search?: string
  sort?: string
  limit?: number
  page?: number
}

interface UseExercisesReturn {
  exercises: Exercise[]
  loading: boolean
  error: string | null
  totalDocs: number
  totalPages: number
  page: number
  hasPrevPage: boolean
  hasNextPage: boolean
  refetch: () => void
  deleteExercise: (id: string) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
  bulkUpdate: (ids: string[], data: Partial<Exercise>) => Promise<void>
}

export const useExercises = (
  params: UseExercisesParams = {}
): UseExercisesReturn => {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

  // Memoize the API URL to prevent unnecessary re-renders
  const apiUrl = useMemo(() => {
    const searchParams = new URLSearchParams()

    if (params.programmingLanguage) {
      searchParams.append(
        "where[programmingLanguage][equals]",
        params.programmingLanguage
      )
    }

    if (params.tutorial) {
      searchParams.append("where[tutorial][equals]", params.tutorial)
    }

    if (params.search) {
      searchParams.append("where[or][0][title][contains]", params.search)
      searchParams.append("where[or][1][description][contains]", params.search)
    }

    if (params.sort) {
      searchParams.append("sort", params.sort)
    }

    if (params.limit) {
      searchParams.append("limit", params.limit.toString())
    }

    if (params.page) {
      searchParams.append("page", params.page.toString())
    }

    // Add depth for related data
    searchParams.append("depth", "2")

    return `/api/exercises${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  }, [
    params.programmingLanguage,
    params.tutorial,
    params.search,
    params.sort,
    params.limit,
    params.page,
  ])

  const fetchExercises = useCallback(async () => {
    console.log("🔄 Fetching exercises from:", apiUrl)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Exercises fetched:", data)

      setExercises(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
      setTotalPages(data.totalPages || 0)
      setPage(data.page || 1)
      setHasPrevPage(data.hasPrevPage || false)
      setHasNextPage(data.hasNextPage || false)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("❌ Error fetching exercises:", err)
    } finally {
      setLoading(false)
    }
  }, [apiUrl])

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  const deleteExercise = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete exercise")
      }

      // Refetch exercises after deletion
      await fetchExercises()
    },
    [fetchExercises]
  )

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      const response = await fetch("/api/exercises/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete exercises")
      }

      // Refetch exercises after deletion
      await fetchExercises()
    },
    [fetchExercises]
  )

  const bulkUpdate = useCallback(
    async (ids: string[], data: Partial<Exercise>) => {
      const response = await fetch("/api/exercises/bulk-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, data }),
      })

      if (!response.ok) {
        throw new Error("Failed to update exercises")
      }

      // Refetch exercises after update
      await fetchExercises()
    },
    [fetchExercises]
  )

  return {
    exercises,
    loading,
    error,
    totalDocs,
    totalPages,
    page,
    hasPrevPage,
    hasNextPage,
    refetch: fetchExercises,
    deleteExercise,
    bulkDelete,
    bulkUpdate,
  }
}
