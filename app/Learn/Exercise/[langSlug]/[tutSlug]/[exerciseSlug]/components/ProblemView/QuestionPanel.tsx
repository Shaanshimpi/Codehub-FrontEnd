// Enhanced QuestionPanel with unified design system and progressive hints
"use client"

import React, { useCallback, useMemo } from "react"
import ProgressiveHintSystem from "@/app/Learn/Exercise/components/ProgressiveHints/ProgressiveHintSystem"
import {
  Badge,
  DifficultyBadge,
} from "@/app/Learn/Exercise/design/UnifiedComponents"
import { Code, Tag, Target } from "lucide-react"

// Enhanced QuestionPanel with unified design system and progressive hints

interface QuestionPanelProps {
  exercise: any
  language: any
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  exercise,
  language: _language,
}) => {
  // Use exercise data directly (no multi-language support)
  const content = {
    title: exercise.title,
    description: exercise.description,
    hints: exercise.hints,
  }

  // Map exercise difficulty to our unified system
  const getDifficultyLevel = (level: number) => {
    switch (level) {
      case 1:
        return "beginner"
      case 2:
        return "intermediate"
      case 3:
        return "advanced"
      default:
        return "beginner"
    }
  }

  // Handle hint revelation tracking
  const handleHintRevealed = useCallback(
    (_hintIndex: number, _timeSpent: number) => {
      // TODO: Track hint usage for analytics
      // Analytics tracking will be implemented here
    },
    []
  )

  // Process hints to match our progressive system format
  // Memoized to prevent resetting hint states on every render
  const processedHints = useMemo(
    () =>
      (content.hints || []).map((hint: any, index: number) => ({
        id: hint.id || `hint-${index}`,
        text: hint.text,
        code_snippet: hint.code_snippet,
        difficulty_level: Math.min(3, Math.max(1, index + 1)) as 1 | 2 | 3,
        type:
          hint.type || (hint.code_snippet ? "implementation" : "conceptual"),
      })),
    [content.hints]
  )

  return (
    <div
      className="relative flex h-full flex-col overflow-y-auto bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
      role="main"
      aria-label="Exercise problem statement"
      id="problem-statement"
    >
      {/* Content container with modern design */}
      <div className="relative h-full">
        <div className="flex min-h-full flex-col space-y-3 p-2 pb-4 lg:p-3 lg:pb-6">
          {/* Compact Modern Header */}
          <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-black">
            {/* Header row with badges */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DifficultyBadge
                  difficulty={getDifficultyLevel(exercise.difficultyLevel)}
                />
                <Badge variant="primary" size="sm" className="text-xs">
                  #{exercise.index}
                </Badge>
              </div>
            </div>

            {/* Title */}
            <h1
              className="mb-1 text-lg font-bold leading-tight text-black dark:text-white"
              id="exercise-title"
              tabIndex={-1}
            >
              {content.title}
            </h1>

            {/* Description */}
            {content.description && (
              <div
                className="text-sm leading-relaxed text-black dark:text-white"
                role="region"
                aria-labelledby="exercise-title"
              >
                {content.description}
              </div>
            )}
          </div>

          {/* Compact Learning Objectives */}
          {exercise.learning_objectives &&
            exercise.learning_objectives.length > 0 && (
              <section
                className="rounded-lg border border-blue-200 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-blue-800 dark:bg-gray-900"
                aria-labelledby="learning-objectives-heading"
              >
                {/* Section header */}
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black"
                    aria-hidden="true"
                  >
                    <Target className="h-3 w-3" />
                  </div>
                  <h2
                    id="learning-objectives-heading"
                    className="text-sm font-bold text-blue-900 dark:text-blue-100"
                  >
                    Learning Objectives
                  </h2>
                </div>

                {/* Compact objectives list */}
                <ol
                  className="space-y-1.5"
                  aria-label="Learning objectives for this exercise"
                >
                  {exercise.learning_objectives.map(
                    (objective: any, index: number) => (
                      <li
                        key={
                          typeof objective === "string"
                            ? `${objective}-${index}`
                            : objective.id || index
                        }
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                          {index + 1}
                        </div>
                        <span className="font-medium leading-relaxed text-black dark:text-white">
                          {typeof objective === "string"
                            ? objective
                            : objective.objective}
                        </span>
                      </li>
                    )
                  )}
                </ol>
              </section>
            )}

          {/* Compact Topics */}
          {exercise.tags && exercise.tags.length > 0 && (
            <section
              className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900"
              aria-labelledby="topics-heading"
            >
              {/* Section header */}
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black"
                  aria-hidden="true"
                >
                  <Tag className="h-3 w-3" />
                </div>
                <h2
                  id="topics-heading"
                  className="text-sm font-bold text-black dark:text-white"
                >
                  Topics
                </h2>
              </div>

              {/* Compact tags */}
              <ul
                className="flex list-none flex-wrap gap-1.5"
                aria-label="Programming topics covered in this exercise"
              >
                {exercise.tags.map((tag: any, index: number) => (
                  <li
                    key={
                      typeof tag === "string"
                        ? `${tag}-${index}`
                        : tag.id || index
                    }
                    className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-100"
                    title={`Topic: ${typeof tag === "string" ? tag : tag.tag}`}
                  >
                    {typeof tag === "string" ? tag : tag.tag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Progressive Hints System */}
          {processedHints.length > 0 && (
            <ProgressiveHintSystem
              hints={processedHints}
              exerciseTitle={content.title}
              onHintRevealed={handleHintRevealed}
              className="rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm backdrop-blur-sm dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50"
            />
          )}

          {/* Compact Getting Started */}
          <section
            className="mt-auto rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900"
            aria-labelledby="getting-started-heading"
          >
            {/* Section header */}
            <div className="mb-2 flex items-center gap-2">
              <div
                className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black"
                aria-hidden="true"
              >
                <Code className="h-3 w-3" />
              </div>
              <h2
                id="getting-started-heading"
                className="text-sm font-bold text-black dark:text-white"
              >
                Quick Start
              </h2>
            </div>

            {/* Compact steps */}
            <ol
              className="space-y-1.5"
              aria-label="Steps to complete the exercise"
            >
              {[
                { text: "Load boilerplate code", icon: "1" },
                { text: "Complete TODO sections", icon: "2" },
                { text: "Test your solution", icon: "3" },
              ].map((step, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div
                    className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-white dark:text-black"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                  <span className="font-medium text-black dark:text-white">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}

export default QuestionPanel
