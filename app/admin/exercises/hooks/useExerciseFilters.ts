import { useState } from "react"
import { useLanguagesAndTutorials } from "./useLanguagesAndTutorials"

export interface ExerciseFilters {
  searchTerm: string
  selectedLanguage: number | null
  selectedTutorial: number | null
  difficultyLevel: number | null
  statusFilter: string | null
}

export const useExerciseFilters = () => {
  const [filters, setFilters] = useState<ExerciseFilters>({
    searchTerm: "",
    selectedLanguage: null,
    selectedTutorial: null,
    difficultyLevel: null,
    statusFilter: null,
  })

  const { languages, tutorials, languagesLoading, tutorialsLoading } =
    useLanguagesAndTutorials(filters.selectedLanguage || undefined)

  const updateFilter = <K extends keyof ExerciseFilters>(
    key: K,
    value: ExerciseFilters[K]
  ) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value }

      // Reset tutorial when language changes
      if (key === "selectedLanguage") {
        updated.selectedTutorial = null
      }

      return updated
    })
  }

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedLanguage: null,
      selectedTutorial: null,
      difficultyLevel: null,
      statusFilter: null,
    })
  }

  const hasActiveFilters = () => {
    return (
      filters.searchTerm !== "" ||
      filters.selectedLanguage !== null ||
      filters.selectedTutorial !== null ||
      filters.difficultyLevel !== null ||
      filters.statusFilter !== null
    )
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    languages,
    tutorials,
    languagesLoading,
    tutorialsLoading,
  }
}
