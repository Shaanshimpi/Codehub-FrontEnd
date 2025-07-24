// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseHeader.tsx
"use client"

import React from "react"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { getLocalizedContent } from "@/app/utils/exerciseHelpers"
import { Book, ChevronLeft, ChevronRight, Code, Home } from "lucide-react"
import Link from "next/link"

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
    <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-800 text-white dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-4">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center space-x-2 text-sm">
          <Link
            href="/Learn"
            className="flex items-center gap-1 text-sky-100 transition-colors hover:text-white"
          >
            <Home className="h-4 w-4" />
            Learn
          </Link>
          <ChevronRight className="h-4 w-4 text-sky-200" />

          <Link
            href={`/Learn/Exercise/${langSlug}`}
            className="flex items-center gap-1 text-sky-100 transition-colors hover:text-white"
          >
            <span>{language.title}</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-sky-200" />

          <Link
            href={`/Learn/Exercise/${langSlug}/${tutSlug}`}
            className="flex items-center gap-1 text-sky-100 transition-colors hover:text-white"
          >
            <Book className="h-4 w-4" />
            <span>{tutorial.title}</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-sky-200" />

          <span className="flex items-center gap-1 text-white">
            <Code className="h-4 w-4" />
            Exercise {exercise.index}
          </span>
        </nav>

        {/* Exercise Title and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{content.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-sky-100">
              <span className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                {tutorial.title}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                {language.title}
              </span>
              <span>•</span>
              <span>Exercise {exercise.index}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/30"
              disabled // In real implementation, check if previous exercise exists
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/30"
              disabled // In real implementation, check if next exercise exists
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseHeader
