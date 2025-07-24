// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/ProgressBar.tsx
"use client"

import React from "react"
import { BookOpen, CheckCircle, Circle, Play } from "lucide-react"

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
    <div className="border-b border-slate-200 bg-white py-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Progress:
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {getProgressLabel()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(progress)}% Complete
            </span>
            <div
              className={`rounded-full p-1 ${
                currentView === "problem"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              }`}
            >
              {currentView === "problem" ? (
                <Play className="h-4 w-4" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Milestone Markers */}
          <div className="absolute -top-1 flex w-full justify-between">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isActive = progress >= milestone.value
              const isCurrent =
                progress >= milestone.value &&
                (index === milestones.length - 1 ||
                  progress < milestones[index + 1].value)

              return (
                <div
                  key={milestone.value}
                  className="flex flex-col items-center"
                  style={{
                    marginLeft: index === 0 ? "0" : "-12px",
                    marginRight:
                      index === milestones.length - 1 ? "0" : "-12px",
                  }}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 dark:bg-slate-900 ${
                      isActive
                        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-slate-300 text-slate-400 dark:border-slate-600"
                    } ${isCurrent ? "scale-125 shadow-lg" : "scale-100"}`}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {milestone.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
