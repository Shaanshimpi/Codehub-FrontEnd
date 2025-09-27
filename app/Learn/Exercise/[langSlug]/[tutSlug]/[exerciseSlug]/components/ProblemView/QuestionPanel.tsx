// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/QuestionPanel.tsx
"use client"

import React, { useState } from "react"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import { ChevronDown, ChevronUp, Lightbulb, Tag, Target } from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/QuestionPanel.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/QuestionPanel.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/QuestionPanel.tsx

interface QuestionPanelProps {
  exercise: any
  language: any
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  exercise,
  language,
}) => {
  const [showHints, setShowHints] = useState(false)
  const { language: currentLanguage } = useLanguage()

  // Get localized content based on selected language

  const content = getLocalizedContent(exercise, currentLanguage)

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case 2:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case 3:
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    }
  }

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner"
      case 2:
        return "Intermediate"
      case 3:
        return "Advanced"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-2 lg:p-3">
      {/* Compact Title & Difficulty */}
      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${getDifficultyColor(exercise.difficultyLevel)}`}
          >
            {getDifficultyLabel(exercise.difficultyLevel)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ex {exercise.index}
          </span>
        </div>

        <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
          {content.title}
        </h1>
      </div>

      {/* Compact Learning Objectives */}
      <div className="mb-3">
        <h2 className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Objectives
        </h2>
        <div className="space-y-2">
          {exercise.learning_objectives?.map(
            (objective: any, index: number) => (
              <div
                key={
                  typeof objective === "string"
                    ? `${objective}-${index}`
                    : objective.id || index
                }
                className="flex items-start gap-2"
              >
                <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {typeof objective === "string"
                    ? objective
                    : objective.objective}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Compact Tags */}
      <div className="mb-3">
        <h2 className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Topics
        </h2>
        <div className="flex flex-wrap gap-1">
          {exercise.tags?.map((tag: any, index: number) => (
            <span
              key={
                typeof tag === "string" ? `${tag}-${index}` : tag.id || index
              }
              className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            >
              {typeof tag === "string" ? tag : tag.tag}
            </span>
          ))}
        </div>
      </div>

      {/* Enhanced Hints Section - Made to Stand Out */}
      <div className="mb-4 rounded-lg border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-md dark:border-amber-700/50 dark:from-amber-900/30 dark:to-yellow-900/30">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex w-full items-center justify-between rounded-t-lg bg-gradient-to-r from-amber-500 to-yellow-500 p-3 text-left font-bold text-white shadow-sm transition-all duration-200 hover:from-amber-600 hover:to-yellow-600 hover:shadow-lg dark:from-amber-600 dark:to-yellow-600 dark:hover:from-amber-700 dark:hover:to-yellow-700"
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/20 p-1">
              <Lightbulb className="h-5 w-5 flex-shrink-0 text-white" />
            </div>
            <div>
              <span className="text-base font-bold">💡 Hints Available</span>
              <div className="text-xs font-medium opacity-90">
                {content.hints?.length || 0} helpful tip
                {(content.hints?.length || 0) !== 1 ? "s" : ""} to guide you
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="text-xs font-medium opacity-90">
              {showHints ? "Hide" : "Show"}
            </span>
            <div className="rounded-full bg-white/20 p-1">
              {showHints ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </button>

        {showHints && (
          <div className="border-t-2 border-amber-200 bg-white/50 p-4 dark:border-amber-700/50 dark:bg-black/20">
            <div className="space-y-4">
              {content.hints?.map((hint: any, index: number) => (
                <div
                  key={hint.id || index}
                  className="group rounded-lg border border-amber-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-amber-300 hover:shadow-md dark:border-amber-700/30 dark:bg-slate-800/50 dark:hover:border-amber-600/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 font-bold text-white shadow-sm">
                      <span className="text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                        {hint.text}
                      </p>
                      {hint.code_snippet && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-700/30 dark:bg-amber-900/20">
                          <div className="mb-2 flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                              Code Example
                            </span>
                          </div>
                          <pre className="overflow-x-auto rounded bg-slate-900 p-2 text-xs text-green-400 dark:bg-slate-950">
                            <code>{hint.code_snippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Helpful tip at bottom */}
            <div className="mt-4 rounded-lg bg-amber-100 p-3 dark:bg-amber-900/40">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  💡 Pro tip: Try implementing the solution step by step using
                  these hints as your guide!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact Instructions */}
      <div className="rounded bg-blue-50 p-2 dark:bg-blue-900/20">
        <ul className="space-y-0.5 text-xs text-blue-700 dark:text-blue-300">
          <li>• Load boilerplate code</li>
          <li>• Complete TODO sections</li>
          <li>• Run and test your solution</li>
        </ul>
      </div>
    </div>
  )
}

export default QuestionPanel
