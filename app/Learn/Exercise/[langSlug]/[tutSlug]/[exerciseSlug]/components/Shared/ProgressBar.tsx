// Enhanced ProgressBar with modern gradient aesthetics
"use client"

import React, { memo, useEffect, useMemo, useState } from "react"
import {
  Badge,
  Text,
} from "@/app/Learn/Exercise/design/UnifiedComponents"
import {
  BookOpen,
  CheckCircle,
  Code,
  FileText,
  Play,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react"

// Enhanced ProgressBar with modern gradient aesthetics

interface ProgressBarProps {
  progress: number // 0-100
  currentView: "problem" | "solution"
  showMilestones?: boolean
  showLabel?: boolean
  className?: string
}

interface Milestone {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const ExerciseProgressBar: React.FC<ProgressBarProps> = memo(
  ({
    progress,
    currentView,
    showMilestones = false,
    showLabel: _showLabel = true,
    className = "",
  }) => {
    // Define progress milestones with clear meaning
    const milestones: Milestone[] = useMemo(
      () => [
        {
          label: "Started",
          value: 0,
          icon: Play,
          description: "Exercise begun",
        },
        {
          label: "Code Loaded",
          value: 25,
          icon: Code,
          description: "Boilerplate code loaded",
        },
        {
          label: "First Run",
          value: 50,
          icon: FileText,
          description: "Code executed successfully",
        },
        {
          label: "Solution Viewed",
          value: 75,
          icon: BookOpen,
          description: "Solution has been revealed",
        },
        {
          label: "Complete",
          value: 100,
          icon: Trophy,
          description: "Exercise completed",
        },
      ],
      []
    )

    // Get current milestone and progress variant
    const { currentMilestone, progressVariant, progressLabel } = useMemo(() => {
      let milestone = milestones[0]
      let variant: "primary" | "success" | "warning" | "error" = "primary"
      let label = "Not Started"

      // Find the current milestone
      for (let i = milestones.length - 1; i >= 0; i--) {
        if (progress >= milestones[i].value) {
          milestone = milestones[i]
          break
        }
      }

      // Determine progress variant and label
      if (progress === 0) {
        variant = "primary"
        label = "Not Started"
      } else if (progress < 25) {
        variant = "primary"
        label = "Getting Started"
      } else if (progress < 50) {
        variant = "primary"
        label = "Working on Problem"
      } else if (progress < 75) {
        variant = "warning"
        label =
          currentView === "solution" ? "Reviewing Solution" : "Making Progress"
      } else if (progress < 100) {
        variant = "warning"
        label = "Almost Complete"
      } else {
        variant = "success"
        label = "Completed"
      }

      return {
        currentMilestone: milestone,
        progressVariant: variant,
        progressLabel: label,
      }
    }, [progress, milestones, currentView])

    // Get view indicator
    const viewIndicator = useMemo(() => {
      const isOnSolution = currentView === "solution"
      return {
        icon: isOnSolution ? BookOpen : Code,
        label: isOnSolution ? "Solution" : "Problem",
        variant: isOnSolution ? "warning" : "primary",
      }
    }, [currentView])

    const [animatedProgress, setAnimatedProgress] = useState(0)

    // Animate progress changes
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    }, [progress])

    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Animated background gradient */}
        <div className="from-primary-50 to-accent-50 dark:from-primary-950/30 dark:to-accent-950/30 absolute inset-0 bg-gradient-to-r via-white dark:via-neutral-900" />

        {/* Glass morphism overlay */}
        <div className="border-primary-200/50 dark:border-primary-700/30 relative border-b bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
            {/* Enhanced progress section with animations */}
            <div className="mb-2 flex items-center justify-between">
              {/* Modern progress bar container */}
              <div className="mr-6 flex-1">
                <div className="relative">
                  {/* Progress label with gradient text */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="from-primary-600 bg-gradient-to-r to-purple-600 bg-clip-text text-sm font-semibold text-transparent">
                      {progressLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      {progress >= 75 && (
                        <div className="text-success-500 flex items-center gap-1">
                          <Star className="h-3 w-3 animate-pulse" />
                          <span className="text-xs font-medium">
                            Almost there!
                          </span>
                        </div>
                      )}
                      <span className="from-primary-600 to-accent-600 bg-gradient-to-r bg-clip-text text-sm font-bold text-transparent">
                        {Math.round(animatedProgress)}%
                      </span>
                    </div>
                  </div>

                  {/* Modern progress bar with gradient */}
                  <div className="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 shadow-inner dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800">
                    {/* Animated progress fill with gradient */}
                    <div
                      className={`relative h-full overflow-hidden rounded-full transition-all duration-700 ease-out ${
                        progressVariant === "success"
                          ? "from-success-400 via-success-500 to-success-600 bg-gradient-to-r"
                          : progressVariant === "warning"
                            ? "from-warning-400 via-warning-500 to-warning-600 bg-gradient-to-r"
                            : progressVariant === "error"
                              ? "from-error-400 via-error-500 to-error-600 bg-gradient-to-r"
                              : "from-primary-400 via-primary-500 to-primary-600 bg-gradient-to-r"
                      }`}
                      style={{ width: `${animatedProgress}%` }}
                    >
                      {/* Animated shimmer effect */}
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                      {/* Glow effect for high progress */}
                      {animatedProgress >= 50 && (
                        <div className="absolute inset-0 animate-ping bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}
                    </div>
                  </div>

                  {/* Progress sparkles for milestones */}
                  {animatedProgress >= 25 && animatedProgress < 100 && (
                    <Sparkles
                      className="text-primary-500 absolute -top-1 right-0 h-4 w-4 animate-bounce"
                      style={{ right: `${100 - animatedProgress}%` }}
                    />
                  )}
                </div>
              </div>

              {/* Enhanced view indicator with gradient */}
              <div className="flex items-center gap-2">
                <div
                  className={`relative rounded-lg border px-3 py-2 backdrop-blur-sm ${
                    viewIndicator.variant === "warning"
                      ? "from-warning-100/80 to-warning-200/80 dark:from-warning-900/40 dark:to-warning-800/40 border-warning-300/50 dark:border-warning-700/50 bg-gradient-to-r"
                      : "from-primary-100/80 to-primary-200/80 dark:from-primary-900/40 dark:to-primary-800/40 border-primary-300/50 dark:border-primary-700/50 bg-gradient-to-r"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <viewIndicator.icon
                      className={`h-4 w-4 ${
                        viewIndicator.variant === "warning"
                          ? "text-warning-600 dark:text-warning-400"
                          : "text-primary-600 dark:text-primary-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        viewIndicator.variant === "warning"
                          ? "text-warning-700 dark:text-warning-300"
                          : "text-primary-700 dark:text-primary-300"
                      }`}
                    >
                      {viewIndicator.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced milestone indicators with animations */}
            {showMilestones && (
              <div className="mt-6">
                {/* Milestone timeline */}
                <div className="relative">
                  {/* Timeline line with gradient */}
                  <div className="absolute left-0 right-0 top-6 h-0.5 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700" />

                  {/* Active progress line */}
                  <div
                    className="from-primary-500 to-accent-500 absolute left-0 top-6 h-0.5 bg-gradient-to-r transition-all duration-1000 ease-out"
                    style={{
                      width: `${(currentMilestone.value / 100) * 100}%`,
                    }}
                  />

                  <div className="relative flex items-start justify-between">
                    {milestones.map((milestone, _index) => {
                      const isCompleted = progress >= milestone.value
                      const isCurrent =
                        currentMilestone.value === milestone.value
                      const Icon = milestone.icon

                      return (
                        <div
                          key={milestone.value}
                          className="group relative flex flex-col items-center"
                          title={milestone.description}
                        >
                          {/* Milestone icon with enhanced styling */}
                          <div
                            className={`relative z-10 transform rounded-full p-3 transition-all duration-500 hover:scale-110 ${
                              isCompleted
                                ? "from-success-400 to-success-600 shadow-success-500/30 bg-gradient-to-br text-white shadow-lg"
                                : isCurrent
                                  ? "from-primary-400 to-primary-600 shadow-primary-500/30 animate-pulse bg-gradient-to-br text-white shadow-lg"
                                  : "bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-500 dark:from-neutral-700 dark:to-neutral-800 dark:text-neutral-400"
                            } `}
                          >
                            <Icon className="h-5 w-5" />

                            {/* Completion checkmark overlay */}
                            {isCompleted && (
                              <div className="bg-success-500 absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            )}

                            {/* Current milestone indicator */}
                            {isCurrent && (
                              <div className="from-primary-400 to-primary-600 absolute inset-0 animate-ping rounded-full bg-gradient-to-br opacity-75" />
                            )}
                          </div>

                          {/* Milestone label with enhanced styling */}
                          <div className="mt-3 text-center">
                            <Text
                              variant="tiny"
                              className={`font-semibold transition-all duration-300 ${
                                isCompleted
                                  ? "text-success-600 dark:text-success-400"
                                  : isCurrent
                                    ? "text-primary-600 dark:text-primary-400"
                                    : "text-neutral-500 dark:text-neutral-400"
                              } `}
                            >
                              {milestone.label}
                            </Text>

                            {/* Progress percentage badge */}
                            <Badge
                              variant={
                                isCompleted
                                  ? "success"
                                  : isCurrent
                                    ? "primary"
                                    : "neutral"
                              }
                              size="sm"
                              className="mt-1"
                            >
                              {milestone.value}%
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current milestone description with enhanced styling */}
                <div className="mt-6 text-center">
                  <div className="from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50 border-primary-200/50 dark:border-primary-700/30 inline-flex items-center gap-2 rounded-lg border bg-gradient-to-r px-4 py-2">
                    <div className="bg-primary-500 h-2 w-2 animate-pulse rounded-full" />
                    <Text
                      variant="small"
                      className="text-primary-700 dark:text-primary-300 font-medium"
                    >
                      {currentMilestone.description}
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced progress statistics with animations */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                {/* Progress stats with gradient styling */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        progress >= 100
                          ? "bg-success-500 animate-ping"
                          : progress >= 75
                            ? "bg-warning-500 animate-pulse"
                            : progress >= 25
                              ? "bg-primary-500 animate-pulse"
                              : "bg-neutral-400"
                      }`}
                    />
                    <Text
                      variant="small"
                      className="font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      {progress > 0
                        ? `${Math.round(progress)}% complete`
                        : "Ready to start"}
                    </Text>
                  </div>
                </div>

                {/* Motivational message with enhanced styling */}
                <div className="flex items-center gap-2">
                  {progress === 100 && (
                    <Trophy className="text-warning-500 h-4 w-4 animate-bounce" />
                  )}
                  {progress >= 75 && progress < 100 && (
                    <Zap className="text-warning-500 h-4 w-4 animate-pulse" />
                  )}
                  {progress >= 50 && progress < 75 && (
                    <Star className="text-primary-500 h-4 w-4 animate-pulse" />
                  )}

                  <span
                    className={`text-sm font-medium ${
                      progress === 100
                        ? "text-success-600 dark:text-success-400"
                        : progress >= 75
                          ? "text-warning-600 dark:text-warning-400"
                          : progress >= 50
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {progress === 100
                      ? "🎉 Exercise completed!"
                      : progress >= 75
                        ? "✨ Almost there!"
                        : progress >= 50
                          ? "💫 Good progress!"
                          : progress >= 25
                            ? "🚀 Getting started!"
                            : "Let's begin your journey!"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ExerciseProgressBar.displayName = "ExerciseProgressBar"

export default ExerciseProgressBar
