import { useEffect, useState } from "react"

export interface Tutorial {
  id: string
  title: string
  slug: string
  description?: string
  videoUrl?: string
  programmingLanguage: {
    id: number
    title: string
    slug: string
  }
  difficulty: string
  index: number
  isLocked: boolean
  lessons: any[]
  learningConfiguration?: {
    learningObjectives?: { objective: string }[]
    keyTopics?: { topic: string }[]
    practicalApplications?: { application: string }[]
    tags?: { tag: string }[]
  }
  reference?: {
    title: string
    subtitle: string
    introduction: string
    examples: {
      title: string
      description: string
      code: string
      explanation: string
      output?: string
    }[]
    key_points: string[]
    common_mistakes: {
      mistake: string
      why_wrong: string
      correct_approach: string
    }[]
    syntax_guide: {
      basic_syntax: string
      parameters: {
        name: string
        description: string
        required: boolean
      }[]
    }
  }
  createdAt: string
  updatedAt: string
}

export interface TutorialsResponse {
  docs: Tutorial[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface UseTutorialsOptions {
  page?: number
  limit?: number
  sort?: string
  programmingLanguage?: string
  search?: string
}

export const useTutorials = (options: UseTutorialsOptions = {}) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalDocs, setTotalDocs] = useState(0)

  const fetchTutorials = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (options.page) params.append("page", options.page.toString())
      if (options.limit) params.append("limit", options.limit.toString())
      if (options.sort) params.append("sort", options.sort)
      if (options.programmingLanguage) {
        params.append(
          "where[programmingLanguage][equals]",
          options.programmingLanguage
        )
      }
      if (options.search) {
        params.append("where[or][0][title][contains]", options.search)
        params.append("where[or][1][description][contains]", options.search)
      }

      // Use proxy API route (same pattern as admin/exercises)
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

      const url = `${baseUrl}/api/payload/tutorials?${params.toString()}`
      console.log("🔗 Fetching tutorials from proxy:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch tutorials: ${response.statusText}`)
      }

      const data: TutorialsResponse = await response.json()

      setTutorials(data.docs)
      setTotalPages(data.totalPages)
      setTotalDocs(data.totalDocs)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching tutorials:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutorials()
  }, [
    options.page,
    options.limit,
    options.sort,
    options.programmingLanguage,
    options.search,
  ])

  const deleteTutorial = async (id: string) => {
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

      const response = await fetch(`${baseUrl}/api/payload/tutorials/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete tutorial: ${response.statusText}`)
      }

      // Refresh tutorials list
      await fetchTutorials()
    } catch (err) {
      console.error("Error deleting tutorial:", err)
      throw err
    }
  }

  const bulkDelete = async (ids: string[]) => {
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

      await Promise.all(
        ids.map((id) =>
          fetch(`${baseUrl}/api/payload/tutorials/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
        )
      )

      // Refresh tutorials list
      await fetchTutorials()
    } catch (err) {
      console.error("Error bulk deleting tutorials:", err)
      throw err
    }
  }

  const bulkUpdate = async (ids: string[], updates: Partial<Tutorial>) => {
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

      await Promise.all(
        ids.map((id) =>
          fetch(`${baseUrl}/api/payload/tutorials/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          })
        )
      )

      // Refresh tutorials list
      await fetchTutorials()
    } catch (err) {
      console.error("Error bulk updating tutorials:", err)
      throw err
    }
  }

  return {
    tutorials,
    loading,
    error,
    totalPages,
    totalDocs,
    refetch: fetchTutorials,
    deleteTutorial,
    bulkDelete,
    bulkUpdate,
  }
}
