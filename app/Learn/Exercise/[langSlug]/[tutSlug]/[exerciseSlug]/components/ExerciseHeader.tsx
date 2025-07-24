// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseHeader.tsx
"use client"

import React from "react"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import { ChevronLeft, ChevronRight } from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseHeader.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseHeader.tsx

interface ExerciseHeaderProps {
  exercise: any
  language: any
  tutorial: any
  params: {
    langSlug: string
    tutSlug: string
    exerciseSlug: string
  }
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  exercise,
  language,
  tutorial,
  params,
}) => {
  const { langSlug, tutSlug, exerciseSlug } = params
  const { language: currentLanguage } = useLanguage()

  // Get localized content based on selected language
  const content = getLocalizedContent(exercise, currentLanguage)

  return (
    <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
        {/* Compact Single Row Layout */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title + Context */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white lg:text-xl">
              {content.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="truncate">{tutorial.title}</span>
              <span>•</span>
              <span>{language.title}</span>
              <span>•</span>
              <span>Exercise {exercise.index}</span>
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              disabled
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              disabled
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseHeader
