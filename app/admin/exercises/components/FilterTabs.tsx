import React from "react"
import { ChevronDown, X } from "lucide-react"
import { DIFFICULTY_LEVELS } from "../constants"
import { AdminLanguage, AdminTutorial } from "../types"
import { LoadingState } from "./ui"

interface FilterTabsProps {
  languages: AdminLanguage[]
  tutorials: AdminTutorial[]
  languagesLoading: boolean
  tutorialsLoading: boolean
  selectedLanguage: number | null
  selectedTutorial: number | null
  difficultyFilter: number | null
  statusFilter: string | null
  onLanguageChange: (languageId: number | null) => void
  onTutorialChange: (tutorialId: number | null) => void
  onDifficultyChange: (difficulty: number | null) => void
  onStatusChange: (status: string | null) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  languages,
  tutorials,
  languagesLoading,
  tutorialsLoading,
  selectedLanguage,
  selectedTutorial,
  difficultyFilter,
  statusFilter,
  onLanguageChange,
  onTutorialChange,
  onDifficultyChange,
  onStatusChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const selectedLanguageData = languages.find(
    (lang) => lang.id === selectedLanguage
  )
  const selectedTutorialData = tutorials.find(
    (tut) => tut.id === selectedTutorial
  )

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Programming Language Filter */}
        <div className="relative">
          {languagesLoading ? (
            <LoadingState message="Loading languages..." />
          ) : (
            <div className="relative">
              <select
                value={selectedLanguage || ""}
                onChange={(e) =>
                  onLanguageChange(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>
          )}
        </div>

        {/* Tutorial Filter (only show if language is selected) */}
        {selectedLanguage && (
          <div className="relative">
            {tutorialsLoading ? (
              <LoadingState message="Loading tutorials..." />
            ) : (
              <div className="relative">
                <select
                  value={selectedTutorial || ""}
                  onChange={(e) =>
                    onTutorialChange(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">
                    All {selectedLanguageData?.title} Tutorials
                  </option>
                  {tutorials.map((tutorial) => (
                    <option key={tutorial.id} value={tutorial.id}>
                      {tutorial.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </div>
            )}
          </div>
        )}

        {/* Difficulty Filter */}
        <div className="relative">
          <select
            value={difficultyFilter || ""}
            onChange={(e) =>
              onDifficultyChange(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Difficulties</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.displayName}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter || ""}
            onChange={(e) => onStatusChange(e.target.value || null)}
            className="appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedLanguageData && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {selectedLanguageData.title}
              <button
                onClick={() => onLanguageChange(null)}
                className="hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedTutorialData && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {selectedTutorialData.title}
              <button
                onClick={() => onTutorialChange(null)}
                className="hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {difficultyFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              {
                DIFFICULTY_LEVELS.find((d) => d.value === difficultyFilter)
                  ?.label
              }
              <button
                onClick={() => onDifficultyChange(null)}
                className="hover:text-yellow-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {statusFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              {statusFilter === "free" ? "Free" : "Premium"}
              <button
                onClick={() => onStatusChange(null)}
                className="hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
