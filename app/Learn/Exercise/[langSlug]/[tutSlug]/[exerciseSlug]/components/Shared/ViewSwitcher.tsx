// Enhanced ViewSwitcher using unified design system
"use client"

import React, { memo, useCallback, useState } from "react"
import { LoadingSpinner } from "@/app/Learn/Exercise/design/UnifiedComponents"
import { BookOpen, Code } from "lucide-react"

// Enhanced ViewSwitcher using unified design system

// Enhanced ViewSwitcher using unified design system

interface ViewSwitcherProps {
  currentView: "problem" | "solution"
  onViewChange: (view: "problem" | "solution") => void
  isLoading?: boolean
  className?: string
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = memo(
  ({ currentView, onViewChange, isLoading = false, className = "" }) => {
    const [transitioning, setTransitioning] = useState(false)

    const handleViewChange = useCallback(
      async (newView: string) => {
        if (newView === currentView || transitioning) return

        setTransitioning(true)

        // Add a small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 100))

        onViewChange(newView as "problem" | "solution")
        setTransitioning(false)
      },
      [currentView, onViewChange, transitioning]
    )

    // Enhanced keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        switch (event.key) {
          case "ArrowLeft":
          case "ArrowRight":
            event.preventDefault()
            const newView = currentView === "problem" ? "solution" : "problem"
            handleViewChange(newView)
            break

          case "Home":
            event.preventDefault()
            handleViewChange("problem")
            break

          case "End":
            event.preventDefault()
            handleViewChange("solution")
            break

          case "1":
            if (event.ctrlKey) {
              event.preventDefault()
              handleViewChange("problem")
            }
            break

          case "2":
            if (event.ctrlKey) {
              event.preventDefault()
              handleViewChange("solution")
            }
            break
        }
      },
      [currentView, handleViewChange]
    )

    const tabs = [
      {
        id: "problem",
        label: "Problem",
        icon: <BookOpen className="h-4 w-4" />,
        content: null, // Content is handled by parent
        disabled: isLoading || transitioning,
      },
      {
        id: "solution",
        label: "Solution",
        icon: <Code className="h-4 w-4" />,
        content: null, // Content is handled by parent
        disabled: isLoading || transitioning,
      },
    ]

    return (
      <div
        role="toolbar"
        aria-label="View switcher"
        className={`bg-transparent ${className}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative flex items-center justify-center py-3">
          {/* Loading overlay */}
          {(isLoading || transitioning) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80">
              <LoadingSpinner size="sm" />
            </div>
          )}

          <div className="inline-flex w-full max-w-md items-center justify-center gap-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleViewChange(tab.id)}
                disabled={tab.disabled}
                data-view={tab.id}
                className={`focus-visible:ring-primary-500 inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${
                  index === 0
                    ? "md:rounded-l-md"
                    : index === tabs.length - 1
                      ? "md:rounded-r-md"
                      : ""
                } ${
                  currentView === tab.id
                    ? "bg-primary-600 dark:bg-primary-500 text-white shadow-sm dark:text-neutral-900"
                    : "bg-transparent text-neutral-600 hover:bg-white hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                } ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                aria-pressed={currentView === tab.id}
                aria-label={`Switch to ${tab.label} view (${tab.id === "problem" ? "Ctrl+1" : "Ctrl+2"})`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard navigation hint */}
        <div className="sr-only" aria-live="polite">
          Use arrow keys to navigate between Problem and Solution views. Current
          view: {currentView}
        </div>
      </div>
    )
  }
)

ViewSwitcher.displayName = "ViewSwitcher"

// Add custom CSS animation for fade-in effect
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 200ms ease-out forwards;
    }
  `
  document.head.appendChild(style)
}

export default ViewSwitcher
