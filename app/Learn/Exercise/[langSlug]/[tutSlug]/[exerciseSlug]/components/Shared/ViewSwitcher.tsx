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
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-center">
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => onViewChange("problem")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                currentView === "problem"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Code className="h-4 w-4" />
              Problem & Code
            </button>

            <button
              onClick={() => onViewChange("solution")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                currentView === "solution"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Solution & Explanation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewSwitcher
