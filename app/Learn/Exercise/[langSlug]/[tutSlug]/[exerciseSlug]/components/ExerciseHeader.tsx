// Enhanced ExerciseHeader with back to tutorial navigation
// Server Component - No 'use client' directive
import React from "react"
import { Text } from "@/app/Learn/Exercise/design/UnifiedComponents"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
  const { langSlug, tutSlug } = params

  // Use exercise data directly (no multi-language support)
  const content = {
    title: exercise.title,
  }

  return (
    <div className="border-b border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6">
        {/* Compact Single Row Layout */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title + Context */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-black dark:text-white lg:text-xl">
              {content.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-black dark:text-white">
              <Text
                variant="tiny"
                className="truncate font-medium text-blue-900 dark:text-blue-100"
              >
                {tutorial.title}
              </Text>
              <span>•</span>
              <Text
                variant="tiny"
                className="font-medium text-black dark:text-white"
              >
                {language.title}
              </Text>
            </div>
          </div>

          {/* Right: Back to Tutorial Button */}
          <div className="flex items-center gap-2">
            <Link
              href={`/Learn/Exercise/${langSlug}/${tutSlug}`}
              className="flex min-h-[44px] touch-manipulation items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-blue-900"
              title="Back to Tutorial"
              aria-label="Back to Tutorial page"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Exercises</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExerciseHeader
