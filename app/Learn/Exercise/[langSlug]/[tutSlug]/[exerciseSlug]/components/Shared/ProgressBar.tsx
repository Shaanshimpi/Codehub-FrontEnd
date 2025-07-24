// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ProgressBar.tsx
"use client"

import React from "react"
import { BookOpen, CheckCircle, Circle, Play } from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ProgressBar.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ProgressBar.tsx

interface ProgressBarProps {
  progress: number // 0-100
  currentView: "problem" | "solution"
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, currentView }) => {
  const getProgressLabel = () => {
    if (progress === 0) return "Not Started"
    if (progress < 25) return "Getting Started"
    if (progress < 50) return "Working on Problem"
    if (progress < 75) return "Reviewing Solution"
    if (progress < 100) return "Almost Complete"
    return "Completed"
  }

  const milestones = [
    { label: "Start", value: 0, icon: Circle },
    { label: "Code Loaded", value: 25, icon: Play },
    { label: "Solution Viewed", value: 50, icon: Play },
    { label: "Complete", value: 100, icon: CheckCircle },
  ]

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {Math.round(progress)}%
            </span>
            <div className="h-1.5 w-24 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={`rounded p-0.5 ${
              currentView === "problem"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
            }`}
          >
            {currentView === "problem" ? (
              <Play className="h-3 w-3" />
            ) : (
              <BookOpen className="h-3 w-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
