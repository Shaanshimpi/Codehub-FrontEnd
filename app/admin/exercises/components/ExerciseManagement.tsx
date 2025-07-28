"use client"

import React, { useState } from "react"
import { Bot, Filter, List, Plus, Search } from "lucide-react"
import AIExerciseGenerator from "./AIExerciseGenerator"
import ExerciseList from "./ExerciseList"
import ManualExerciseForm from "./ManualExerciseForm"

type ExerciseView = "list" | "create-manual" | "create-ai"

const ExerciseManagement = () => {
  const [activeView, setActiveView] = useState<ExerciseView>("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleExerciseCreated = () => {
    setActiveView("list")
    // Trigger refresh of exercise list
    setRefreshTrigger((prev) => prev + 1)
  }

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
          <ExerciseList
            searchTerm={searchTerm}
            refreshTrigger={refreshTrigger}
          />
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
        <div className="mb-4 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transform text-slate-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {renderContent()}
      </div>
    </div>
  )
}

export default ExerciseManagement
