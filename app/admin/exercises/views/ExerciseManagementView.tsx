"use client"

import React, { useState } from "react"
import { Bot, List, Plus, Search } from "lucide-react"
import AIExerciseGenerator from "../components/AIExerciseGenerator"
import ExerciseList from "../components/ExerciseList"
import { FilterTabs } from "../components/FilterTabs"
import ManualExerciseForm from "../components/ManualExerciseForm"
import { useExerciseFilters } from "../hooks/useExerciseFilters"
import { ExerciseView } from "../types"

const ExerciseManagementView = () => {
  const [activeView, setActiveView] = useState<ExerciseView>("list")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    languages,
    tutorials,
    languagesLoading,
    tutorialsLoading,
  } = useExerciseFilters()

  const handleExerciseCreated = () => {
    setActiveView("list")
    setRefreshTrigger((prev) => prev + 1)
  }

  // Get default form values from current filters
  const getFormDefaults = () => ({
    programmingLanguage: filters.selectedLanguage || undefined,
    tutorial: filters.selectedTutorial || undefined,
  })

  const renderHeader = () => (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveView("list")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeView === "list"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          <List className="h-3.5 w-3.5" />
          All Exercises
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveView("create-manual")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeView === "create-manual"
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          Manual
        </button>

        <button
          onClick={() => setActiveView("create-ai")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeView === "create-ai"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
              : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          <Bot className="h-3.5 w-3.5" />
          AI Generate
        </button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "create-manual":
        return (
          <ManualExerciseForm
            onCancel={() => setActiveView("list")}
            onSuccess={handleExerciseCreated}
            defaultValues={getFormDefaults()}
          />
        )
      case "create-ai":
        return (
          <AIExerciseGenerator
            onCancel={() => setActiveView("list")}
            onSuccess={handleExerciseCreated}
          />
        )
      case "list":
      default:
        return (
          <ExerciseList filters={filters} refreshTrigger={refreshTrigger} />
        )
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Exercise Management
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Create and manage programming exercises
          </p>
        </div>
      </div>

      {renderHeader()}

      {activeView === "list" && (
        <div className="mb-4 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transform text-slate-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Filter Tabs */}
          <FilterTabs
            languages={languages}
            tutorials={tutorials}
            languagesLoading={languagesLoading}
            tutorialsLoading={tutorialsLoading}
            selectedLanguage={filters.selectedLanguage}
            selectedTutorial={filters.selectedTutorial}
            difficultyFilter={filters.difficultyLevel}
            statusFilter={filters.statusFilter}
            onLanguageChange={(languageId) =>
              updateFilter("selectedLanguage", languageId)
            }
            onTutorialChange={(tutorialId) =>
              updateFilter("selectedTutorial", tutorialId)
            }
            onDifficultyChange={(difficulty) =>
              updateFilter("difficultyLevel", difficulty)
            }
            onStatusChange={(status) => updateFilter("statusFilter", status)}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters()}
          />
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {renderContent()}
      </div>
    </div>
  )
}

export default ExerciseManagementView
