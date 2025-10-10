// Progressive Hint Revelation System with learning psychology principles
"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  Alert,
  Badge,
  Text,
} from "@/app/Learn/Exercise/design/UnifiedComponents"
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  EyeOff,
  Lightbulb,
  Target,
} from "lucide-react"

// Progressive Hint Revelation System with learning psychology principles

interface Hint {
  id: string
  text: string
  code_snippet?: string
  difficulty_level?: 1 | 2 | 3
  type?: "conceptual" | "implementation" | "debugging" | "optimization"
}

interface ProgressiveHintSystemProps {
  hints: Hint[]
  exerciseTitle?: string
  onHintRevealed?: (hintIndex: number, timeSpent: number) => void
  className?: string
}

interface HintState {
  index: number
  revealedAt: number
  timeSpent: number
  isRevealed: boolean
}

const ProgressiveHintSystem: React.FC<ProgressiveHintSystemProps> = ({
  hints = [],
  exerciseTitle,
  onHintRevealed,
  className = "",
}) => {
  const [hintStates, setHintStates] = useState<HintState[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionStartTime] = useState(Date.now())
  const [lastRevealTime, setLastRevealTime] = useState(0)
  const [timeUntilNext, setTimeUntilNext] = useState(0)

  // Initialize hint states
  useEffect(() => {
    setHintStates(
      hints.map((_, index) => ({
        index,
        revealedAt: 0,
        timeSpent: 0,
        isRevealed: false,
      }))
    )
  }, [hints])

  // Calculate time-based restrictions - static 15s for all hints
  const getMinTimeToNextHint = (currentHintIndex: number) => {
    return 15000 // Always 15 seconds regardless of difficulty
  }

  // Update countdown timer
  useEffect(() => {
    const revealedCount = hintStates.filter((state) => state.isRevealed).length

    if (revealedCount === 0 || revealedCount >= hints.length) {
      setTimeUntilNext(0)
      return
    }

    const interval = setInterval(() => {
      const timeSinceLastReveal = Date.now() - lastRevealTime
      const minTime = getMinTimeToNextHint(revealedCount - 1)
      const remaining = minTime - timeSinceLastReveal

      setTimeUntilNext(Math.max(0, remaining))
    }, 100)

    return () => clearInterval(interval)
  }, [hintStates, lastRevealTime, hints.length, getMinTimeToNextHint])

  const canRevealNextHint = useCallback(() => {
    const revealedCount = hintStates.filter((state) => state.isRevealed).length

    if (revealedCount === 0) return true // First hint always available
    if (revealedCount >= hints.length) return false // All hints revealed

    const timeSinceLastReveal = Date.now() - lastRevealTime
    const minTime = getMinTimeToNextHint(revealedCount - 1)

    return timeSinceLastReveal >= minTime
  }, [hintStates, lastRevealTime, hints.length])

  const revealNextHint = useCallback(() => {
    const nextIndex = hintStates.filter((state) => state.isRevealed).length

    if (nextIndex >= hints.length || !canRevealNextHint()) return

    const now = Date.now()
    const timeSpent = now - sessionStartTime

    setHintStates((prev) =>
      prev.map((state, index) =>
        index === nextIndex
          ? { ...state, isRevealed: true, revealedAt: now, timeSpent }
          : state
      )
    )

    setLastRevealTime(now)
    onHintRevealed?.(nextIndex, timeSpent)
  }, [
    hintStates,
    hints.length,
    canRevealNextHint,
    sessionStartTime,
    onHintRevealed,
  ])

  const getHintTypeIcon = (type: string = "conceptual") => {
    switch (type) {
      case "implementation":
        return <Target className="h-4 w-4" />
      case "debugging":
        return <Brain className="h-4 w-4" />
      case "optimization":
        return <Clock className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getHintTypeColor = (type: string = "conceptual") => {
    switch (type) {
      case "implementation":
        return "primary"
      case "debugging":
        return "error"
      case "optimization":
        return "warning"
      default:
        return "success"
    }
  }

  const revealedCount = hintStates.filter((state) => state.isRevealed).length
  const progressPercentage =
    hints.length > 0 ? (revealedCount / hints.length) * 100 : 0
  const nextHintIndex = revealedCount
  const timeToNextHint =
    lastRevealTime > 0
      ? Math.max(
          0,
          getMinTimeToNextHint(revealedCount - 1) -
            (Date.now() - lastRevealTime)
        )
      : 0

  if (hints.length === 0) {
    return (
      <div className={`rounded-lg border border-neutral-200 p-4 ${className}`}>
        <Text variant="small" className="text-center text-neutral-500">
          No hints available for this exercise
        </Text>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-4 ${className}`}>
      {/* Compact Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="-m-2 flex w-full items-center justify-between rounded-lg p-2 text-left transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
      >
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-blue-600 p-1 text-white shadow-sm">
            <Lightbulb className="h-3 w-3" />
          </div>
          <div>
            <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              Hints
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              {revealedCount}/{hints.length} •{" "}
              {timeUntilNext > 0
                ? `${Math.ceil(timeUntilNext / 1000)}s`
                : "Ready"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-neutral-500">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-neutral-400">
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          {/* Compact progress indicator */}
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Compact tip */}
          <div className="mb-3 rounded-lg border border-blue-200 bg-blue-100 p-2 dark:border-blue-800 dark:bg-blue-900/30">
            <Text
              variant="small"
              className="text-xs text-blue-800 dark:text-blue-200"
            >
              💡 Hints unlock every 15s to encourage problem-solving
            </Text>
          </div>

          {/* Revealed hints */}
          <div className="mb-3 space-y-2">
            {hintStates.map((state, index) => {
              const hint = hints[index]
              const isVisible = state.isRevealed

              return (
                <div
                  key={hint.id || index}
                  className={`group rounded-lg border transition-all duration-300 ${
                    isVisible
                      ? "border-warning-200 dark:border-warning-700/30 bg-white shadow-sm dark:bg-neutral-800/50"
                      : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/30"
                  }`}
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      {/* Hint number badge */}
                      <div
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${
                          isVisible
                            ? "from-warning-500 to-warning-600 bg-gradient-to-r"
                            : "bg-neutral-400"
                        }`}
                      >
                        <span className="text-sm">{index + 1}</span>
                      </div>

                      {/* Hint content */}
                      <div className="flex-1">
                        {isVisible ? (
                          <div className="space-y-2">
                            {/* Hint type and difficulty */}
                            <div className="mb-2 flex items-center gap-2">
                              <Badge
                                variant={getHintTypeColor(hint.type) as any}
                                size="sm"
                              >
                                {getHintTypeIcon(hint.type)}
                                <span className="ml-1 capitalize">
                                  {hint.type || "conceptual"}
                                </span>
                              </Badge>
                              {hint.difficulty_level && (
                                <Badge variant="neutral" size="sm">
                                  Level {hint.difficulty_level}
                                </Badge>
                              )}
                              <Badge variant="neutral" size="sm">
                                <Eye className="mr-1 h-3 w-3" />
                                Revealed
                              </Badge>
                            </div>

                            {/* Hint text */}
                            <Text variant="small" className="leading-relaxed">
                              {hint.text}
                            </Text>

                            {/* Code snippet */}
                            {hint.code_snippet && (
                              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
                                <div className="mb-2 flex items-center gap-1">
                                  <div className="h-2 w-2 rounded-full bg-neutral-500" />
                                  <Text
                                    variant="tiny"
                                    className="font-medium text-neutral-700 dark:text-neutral-300"
                                  >
                                    Code Example
                                  </Text>
                                </div>
                                <pre className="overflow-x-auto rounded bg-neutral-900 p-2 text-xs text-green-400 dark:bg-neutral-950">
                                  <code>{hint.code_snippet}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-neutral-500">
                            <EyeOff className="h-4 w-4" />
                            <Text variant="small" className="italic">
                              Hint {index + 1} - Click below to reveal when
                              ready
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Next hint button */}
          {nextHintIndex < hints.length && (
            <div className="flex justify-center">
              <button
                onClick={revealNextHint}
                disabled={!canRevealNextHint()}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  !canRevealNextHint()
                    ? "cursor-not-allowed bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <Lightbulb className="h-4 w-4" />
                {timeUntilNext > 0
                  ? `Next hint in ${Math.ceil(timeUntilNext / 1000)}s`
                  : `Reveal Hint ${nextHintIndex + 1}`}
              </button>
            </div>
          )}

          {/* Completion message */}
          {revealedCount === hints.length && (
            <Alert type="success">
              <Text variant="small">
                <strong>All hints revealed!</strong> You now have all the
                guidance available. Try implementing the solution step by step.
              </Text>
            </Alert>
          )}

          {/* Educational footer */}
          <div className="mt-4 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800/40">
            <Text
              variant="tiny"
              className="text-neutral-700 dark:text-neutral-300"
            >
              💡 <strong>Learning Strategy:</strong> Each hint builds on the
              previous one. Take time to understand each hint before revealing
              the next!
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressiveHintSystem
