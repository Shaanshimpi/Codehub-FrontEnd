// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ViewSwitcher.tsx
"use client"

import React from "react"
import { BookOpen, Code } from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ViewSwitcher.tsx

interface ViewSwitcherProps {
  currentView: "problem" | "solution"
  onViewChange: (view: "problem" | "solution") => void
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex max-w-full">
        <button
          onClick={() => onViewChange("problem")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            currentView === "problem"
              ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Problem</span>
        </button>

        <button
          onClick={() => onViewChange("solution")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            currentView === "solution"
              ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Code className="h-4 w-4" />
          <span>Solution</span>
        </button>
      </div>
    </div>
  )
}

export default ViewSwitcher
