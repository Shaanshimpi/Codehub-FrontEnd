"use client"

import React from "react"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Language, Tutorial } from "../../../../../../types/TutorialTypes"

interface LessonNavigationProps {
  tutorial: Tutorial
  language: Language
  lessonIndex: number
  totalLessons: number
}

const LessonNavigation = ({
  tutorial,
  language,
  lessonIndex,
  totalLessons,
}: LessonNavigationProps) => {
  const pathname = usePathname()

  const getBasePath = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    pathSegments.pop() // Remove current lesson slug
    return "/" + pathSegments.join("/")
  }

  const basePath = getBasePath()
  const hasPrevious = lessonIndex > 0
  const hasNext = lessonIndex < totalLessons - 1

  const previousLesson = hasPrevious
    ? tutorial.lessons?.[lessonIndex - 1]
    : null
  const nextLesson = hasNext ? tutorial.lessons?.[lessonIndex + 1] : null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
      <div className="flex flex-col items-start justify-between space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        {/* Previous lesson */}
        <div className="flex-1">
          {hasPrevious && previousLesson ? (
            <Link
              href={`${basePath}/${lessonIndex}`} // 1-based indexing for URL
              className="group flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <div className="min-w-0">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Previous
                </div>
                <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                  {previousLesson.title}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href={basePath}
              className="group flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700"
            >
              <BookOpen className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Back to
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Tutorial Overview
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex-shrink-0">
          <div className="text-center">
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Progress
            </div>
            <div className="flex space-x-1">
              {Array.from({ length: totalLessons }, (_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full ${
                    i <= lessonIndex
                      ? "bg-blue-600 dark:bg-blue-400"
                      : "bg-gray-200 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {lessonIndex + 1} of {totalLessons}
            </div>
          </div>
        </div>

        {/* Next lesson */}
        <div className="flex flex-1 justify-end">
          {hasNext && nextLesson ? (
            <Link
              href={`${basePath}/${lessonIndex + 2}`} // 1-based indexing for URL
              className="group flex items-center space-x-3 rounded-lg border border-gray-200 p-4 text-right transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700"
            >
              <div className="min-w-0">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Next
                </div>
                <div className="truncate font-medium text-gray-900 dark:text-gray-100">
                  {nextLesson.title}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </Link>
          ) : (
            <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 text-right opacity-50 dark:border-slate-600">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Completed
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Final Lesson
                </div>
              </div>
              <div className="h-5 w-5 flex-shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonNavigation
