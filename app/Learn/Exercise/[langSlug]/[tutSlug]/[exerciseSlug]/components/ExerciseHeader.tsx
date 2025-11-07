// Enhanced ExerciseHeader with view controls and full-width layout
"use client"

import React, { useCallback, useMemo } from "react"
import { Text } from "@/app/Learn/Exercise/design/UnifiedComponents"
import { ArrowLeft, BookOpen, Code, Maximize2, Minimize2 } from "lucide-react"
import Link from "next/link"

// Enhanced ExerciseHeader with view controls and full-width layout

interface ExerciseHeaderProps {
  exercise: any
  language: any
  tutorial: any
  params: {
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }
  currentView?: "problem" | "solution"
  onViewChange?: (view: "problem" | "solution") => void
  isSwitchDisabled?: boolean
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  exercise,
  language,
  tutorial,
  params,
  currentView = "problem",
  onViewChange,
  isSwitchDisabled = false,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const { langSlug, tutSlug } = params

  // Use exercise data directly (no multi-language support)
  const content = {
    title: exercise.title,
  }

  const tabs = useMemo(
    () => [
      {
        id: "problem" as const,
        label: "Problem",
        icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
      },
      {
        id: "solution" as const,
        label: "Solution",
        icon: <Code className="h-4 w-4" aria-hidden="true" />,
      },
    ],
    []
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onViewChange || isSwitchDisabled) return

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight": {
          event.preventDefault()
          const nextView = currentView === "problem" ? "solution" : "problem"
          onViewChange(nextView)
          break
        }
        case "Home":
        case "1": {
          if (event.key === "1" && !event.ctrlKey) break
          event.preventDefault()
          onViewChange("problem")
          break
        }
        case "End":
        case "2": {
          if (event.key === "2" && !event.ctrlKey) break
          event.preventDefault()
          onViewChange("solution")
          break
        }
        default:
          break
      }
    },
    [currentView, onViewChange, isSwitchDisabled]
  )

  return (
    <div className="w-full border-b border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-black">
      <div className="w-full px-4 py-3 sm:px-6">
        {/* Flexible Layout */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Title & context */}
          <div className="order-1 min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-black dark:text-white lg:text-xl">
              {content.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-black dark:text-white">
              <Text
                variant="tiny"
                className="truncate font-medium text-blue-900 dark:text-blue-100"
              >
                {tutorial.title}
              </Text>
              <span className="hidden text-gray-400 dark:text-gray-500 sm:inline">
                •
              </span>
              <Text
                variant="tiny"
                className="font-medium text-black dark:text-white"
              >
                {language.title}
              </Text>
            </div>
          </div>

          {/* Centered view toggle */}
          <div
            className="order-3 flex w-full justify-center lg:order-2 lg:w-auto"
            role="toolbar"
            aria-label="Exercise view switcher"
            tabIndex={onViewChange && !isSwitchDisabled ? 0 : -1}
            onKeyDown={handleKeyDown}
          >
            <div className="inline-flex w-full max-w-sm flex-shrink-0 items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              {tabs.map((tab) => {
                const isActive = currentView === tab.id
                const isDisabled = !onViewChange || isSwitchDisabled
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onViewChange && onViewChange(tab.id)}
                    disabled={isDisabled}
                    aria-pressed={isActive}
                    aria-label={`Switch to ${tab.label} view`}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-100/50 dark:focus-visible:ring-offset-neutral-900 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500 dark:text-neutral-900"
                        : "bg-transparent text-neutral-600 hover:bg-white hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="sr-only" aria-live="polite">
              Current view: {currentView}
            </div>
          </div>

          {/* Back & fullscreen controls */}
          <div className="order-2 flex items-center gap-2 lg:order-3">
            <Link
              href={`/Learn/Exercise/${langSlug}/${tutSlug}`}
              className="flex min-h-[40px] touch-manipulation items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-black shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-blue-900"
              title="Back to Exercises"
              aria-label="Back to Exercises"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Exercises</span>
            </Link>

            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-black shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-blue-900"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                aria-label={
                  isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseHeader
