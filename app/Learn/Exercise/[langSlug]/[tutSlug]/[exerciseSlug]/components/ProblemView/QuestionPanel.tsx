// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/QuestionPanel.tsx
"use client"

import React, { useState } from "react"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Lightbulb,
  Tag,
  Target,
} from "lucide-react"

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
    <div className="flex h-full flex-col overflow-y-auto p-6">
      {/* Exercise Title & Difficulty */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getDifficultyColor(exercise.difficultyLevel)}`}
          >
            {getDifficultyLabel(exercise.difficultyLevel)}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Exercise {exercise.index}
          </span>
        </div>

        <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
          {content.title}
        </h1>
      </div>

      {/* Learning Objectives */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Learning Objectives
        </h2>
        <div className="space-y-3">
          {exercise.learning_objectives?.map(
            (objective: any, index: number) => (
              <div
                key={objective.id || index}
                className="flex items-start gap-3"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {objective.objective}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
          <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {exercise.tags?.map((tagObj: any, index: number) => (
            <span
              key={tagObj.id || index}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <Tag className="h-3 w-3" />
              {tagObj.tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hints Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowHints(!showHints)}
          className="mb-3 flex w-full items-center justify-between rounded-lg bg-yellow-50 p-3 text-left font-medium text-yellow-800 transition-colors hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-200 dark:hover:bg-yellow-900/30"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <span>Hints ({content.hints?.length || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            {showHints ? (
              <>
                <EyeOff className="h-4 w-4" />
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </div>
        </button>

        {showHints && (
          <div className="space-y-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
            {content.hints?.map((hint: any, index: number) => (
              <div key={hint.id || index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-200">
                    {hint.text}
                  </p>
                </div>
                {hint.code_snippet && (
                  <div className="ml-9">
                    <pre className="rounded bg-yellow-100 p-2 font-mono text-xs text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-100">
                      <code>{hint.code_snippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
          Instructions
        </h3>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>• Read the problem statement carefully</li>
          <li>• Review the learning objectives</li>
          <li>• {`Click "Load Boilerplate" to get starter code`}</li>
          <li>• Complete the TODO sections in the code</li>
          <li>• Test your solution by running the code</li>
        </ul>
      </div>
    </div>
  )
}

export default QuestionPanel
