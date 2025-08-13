"use client"

import React from "react"
import { ArrowLeft, BookOpen, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Language,
  Tutorial,
  TutorialLesson,
} from "../../../../../../types/TutorialTypes"

interface LessonHeaderProps {
  lesson: TutorialLesson
  tutorial: Tutorial
  language: Language
  lessonIndex: number
  totalLessons: number
}

const LessonHeader = ({
  lesson,
  tutorial,
  language,
  lessonIndex,
  totalLessons,
}: LessonHeaderProps) => {
  const pathname = usePathname()

  const getTutorialPath = () => {
    // Navigate back to tutorial overview
    const pathSegments = pathname.split("/").filter(Boolean)
    pathSegments.pop() // Remove lesson slug
    return "/" + pathSegments.join("/")
  }

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "concept":
        return "📖"
      case "mcq":
        return "❓"
      case "codeblock_rearranging":
        return "🧩"
      case "fill_in_blanks":
        return "✏️"
      default:
        return "📝"
    }
  }

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case "concept":
        return "Concept Explanation"
      case "mcq":
        return "Multiple Choice Quiz"
      case "codeblock_rearranging":
        return "Code Block Rearranging"
      case "fill_in_blanks":
        return "Fill in the Blanks"
      default:
        return "Interactive Lesson"
    }
  }

  const getDifficultyColor = (difficulty: string | number) => {
    switch (difficulty?.toString()) {
      case "1":
        return "bg-green-100 text-green-800 border-green-200"
      case "2":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "3":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyLabel = (difficulty: string | number) => {
    switch (difficulty?.toString()) {
      case "1":
        return "Beginner"
      case "2":
        return "Intermediate"
      case "3":
        return "Advanced"
      default:
        return "Unknown"
    }
  }

  const tutorialPath = getTutorialPath()

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-8 text-white dark:from-slate-800 dark:to-slate-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center text-sm text-sky-100 dark:text-sky-200">
            <Link
              href="/Learn/Tutorials"
              className="transition-colors hover:text-white dark:hover:text-gray-50"
            >
              Tutorials
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/Learn/Tutorials/${language.slug}`}
              className="transition-colors hover:text-white dark:hover:text-gray-50"
            >
              {language.title}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={tutorialPath}
              className="transition-colors hover:text-white dark:hover:text-gray-50"
            >
              {tutorial.title}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white dark:text-gray-50">
              Lesson {lessonIndex + 1}
            </span>
          </div>
        </nav>

        <Link
          href={tutorialPath}
          className="mb-6 inline-flex items-center text-sky-100 transition-colors hover:text-white dark:text-sky-200 dark:hover:text-gray-50"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Tutorial Overview
        </Link>

        <div className="flex items-start space-x-6">
          {language.logo && (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2 dark:bg-slate-700">
              <Image
                src={
                  typeof language.logo === "string"
                    ? language.logo
                    : language.logo.url
                }
                alt={`${language.title} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* Lesson type and progress */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {getLessonTypeIcon(lesson.type)}
                </span>
                <span className="text-sm font-medium text-sky-200">
                  {getLessonTypeLabel(lesson.type)}
                </span>
              </div>

              <div className="text-sky-300">|</div>

              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-sky-200" />
                <span className="text-sm text-sky-200">
                  Lesson {lessonIndex + 1} of {totalLessons}
                </span>
              </div>

              {lesson.difficulty && (
                <>
                  <div className="text-sky-300">|</div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}
                  >
                    {getDifficultyLabel(lesson.difficulty)}
                  </span>
                </>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-bold dark:text-gray-100 md:text-4xl">
              {lesson.title}
            </h1>

            <div className="flex items-center space-x-4 text-sky-100 dark:text-sky-200">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  ~
                  {Math.max(
                    5,
                    Math.ceil((lesson.description?.length || 0) / 100)
                  )}{" "}
                  min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonHeader
