"use client"

import React, { useState } from "react"
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation"
import { useTutorialProgress } from "../hooks/useTutorialProgress"
import BookmarkNotesPanel from "./BookmarkNotesPanel"
import CodeRearrangeLesson from "./lessons/CodeRearrangeLesson"
import ConceptLesson from "./lessons/ConceptLesson"
import FillBlanksLesson from "./lessons/FillBlanksLesson"
import MCQLesson from "./lessons/MCQLesson"

interface TutorialPageContainerProps {
  tutorial: Tutorial
  language: Language
  langSlug: string
  tutSlug: string
}

const TutorialPageContainer: React.FC<TutorialPageContainerProps> = ({
  tutorial,
  language,
  langSlug,
  tutSlug,
}) => {
  const [showReference, setShowReference] = useState(true)
  const [showBookmarkPanel, setShowBookmarkPanel] = useState(false)

  // Initialize progress tracking
  const {
    progress,
    updateCurrentLesson,
    markLessonCompleted,
    toggleBookmark,
    getProgressStats,
    isLessonCompleted,
    getLessonScore,
  } = useTutorialProgress(tutorial.id.toString(), tutorial.lessons?.length || 0)

  const [currentLessonIndex, setCurrentLessonIndex] = useState(
    progress.currentLessonIndex
  )
  const currentLesson = tutorial.lessons?.[currentLessonIndex]
  const stats = getProgressStats()

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const newIndex = currentLessonIndex - 1
      setCurrentLessonIndex(newIndex)
      updateCurrentLesson(newIndex)
    }
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < (tutorial.lessons?.length || 0) - 1) {
      const newIndex = currentLessonIndex + 1
      setCurrentLessonIndex(newIndex)
      updateCurrentLesson(newIndex)
    }
  }

  const handleLessonSelect = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex)
    updateCurrentLesson(lessonIndex)
  }

  const handleLessonComplete = (score?: number, answers?: any) => {
    if (currentLesson) {
      markLessonCompleted(currentLesson.id, score, answers)
    }
  }

  const handleStartLessons = () => {
    setShowReference(false)
    // Start from saved progress or beginning
    const startIndex = progress.currentLessonIndex
    setCurrentLessonIndex(startIndex)
    updateCurrentLesson(startIndex)
  }

  const handleBackToReference = () => {
    setShowReference(true)
  }

  // Keyboard navigation
  const { showKeyboardShortcutsHelp } = useKeyboardNavigation({
    onPreviousLesson: handlePreviousLesson,
    onNextLesson: handleNextLesson,
    onToggleBookmark: toggleBookmark,
    onOpenNotes: () => setShowBookmarkPanel(true),
    onBackToReference: handleBackToReference,
    isLessonMode: !showReference,
    canGoNext: currentLessonIndex < (tutorial.lessons?.length || 0) - 1,
    canGoPrevious: currentLessonIndex > 0,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              🏠 Home
            </a>
            <span className="text-gray-400">&gt;</span>
            <a
              href="/Learn/Tutorials"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              💻 Tutorials
            </a>
            <span className="text-gray-400">&gt;</span>
            <a
              href={`/Learn/Tutorials/${langSlug}`}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {language.title}
            </a>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {tutorial.title}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowBookmarkPanel(true)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📚</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {tutorial.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {showReference
                      ? "Reference"
                      : `Lesson ${currentLessonIndex + 1}/${tutorial.lessons?.length || 0}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${stats.progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.progressPercentage}%
                </span>
              </div>
            </button>
          </div>

          {/* Sidebar */}
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {/* Tutorial Header */}
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  📚 {tutorial.title}
                </h2>

                {showReference ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="mb-2 flex items-center gap-2">
                      <span>📖</span>
                      <span>
                        {tutorial.lessons?.length || 0} Interactive Lessons
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span>⭐</span>
                      <span>Difficulty: {tutorial.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      <span>{language.title}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      Progress: {stats.completedCount}/
                      {tutorial.lessons?.length || 0} completed
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${stats.progressPercentage}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {stats.progressPercentage}%
                    </div>
                    {stats.averageScore > 0 && (
                      <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Avg Score: {stats.averageScore}%
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!showReference && (
                /* Lesson List - Only show when in lesson mode */
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    Lessons:
                  </h3>
                  <div className="space-y-2">
                    {tutorial.lessons?.map((lesson, index) => {
                      const isCompleted = isLessonCompleted(lesson.id)
                      const lessonScore = getLessonScore(lesson.id)

                      return (
                        <button
                          key={lesson.id || index}
                          onClick={() => handleLessonSelect(index)}
                          className={`w-full rounded-lg p-3 text-left text-sm transition-colors ${
                            index === currentLessonIndex
                              ? "border border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-100"
                              : isCompleted
                                ? "bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-100"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>
                              {isCompleted
                                ? "✅"
                                : index === currentLessonIndex
                                  ? "🔵"
                                  : "⚪"}
                            </span>
                            <span className="flex-1 font-medium">
                              {index + 1}. {lesson.title}
                            </span>
                            {lessonScore !== undefined && (
                              <span className="rounded bg-green-200 px-1.5 py-0.5 text-xs text-green-800 dark:bg-green-800 dark:text-green-200">
                                {lessonScore}%
                              </span>
                            )}
                          </div>
                          <div className="ml-6 mt-1 flex items-center justify-between">
                            {lesson.type && (
                              <div className="text-xs opacity-75">
                                {lesson.type === "concept" && "📖 Concept"}
                                {lesson.type === "mcq" && "🎯 Quiz"}
                                {lesson.type === "codeblock_rearranging" &&
                                  "🧩 Code Rearrange"}
                                {lesson.type === "fill_in_blanks" &&
                                  "✏️ Fill Blanks"}
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {showReference && (
                /* Reference Mode - Show tutorial overview */
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    What You&apos;ll Learn:
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {tutorial.lessons?.slice(0, 5).map((lesson, index) => (
                      <div
                        key={lesson.id || index}
                        className="flex items-start gap-2"
                      >
                        <span className="mt-1 text-xs text-blue-500">•</span>
                        <span>{lesson.title}</span>
                      </div>
                    ))}
                    {(tutorial.lessons?.length || 0) > 5 && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="mt-1 text-blue-500">•</span>
                        <span>
                          And {(tutorial.lessons?.length || 0) - 5} more
                          lessons...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tutorial Navigation */}
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Tutorial Navigation:
                </h3>
                <div className="space-y-2">
                  <button className="w-full rounded p-2 text-left text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    ◀️ Previous Tutorial
                  </button>
                  <button className="w-full rounded p-2 text-left text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    Next Tutorial ▶️
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Quick Actions:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowBookmarkPanel(true)}
                    className={`rounded px-3 py-1 text-xs transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 ${
                      stats.hasNotes || stats.isBookmarked
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    📝 Notes & Progress
                  </button>
                  <button
                    onClick={toggleBookmark}
                    className={`rounded px-3 py-1 text-xs transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 ${
                      stats.isBookmarked
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {stats.isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
                  </button>
                  <button
                    onClick={showKeyboardShortcutsHelp}
                    className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    title="Keyboard shortcuts (Press ? for help)"
                    aria-label="Show keyboard shortcuts help"
                  >
                    ⌨️ Shortcuts
                  </button>
                  <a
                    href="/"
                    className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    🏠 Home
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {showReference ? (
                /* Reference Content */
                <div className="p-8">
                  <div className="mb-8">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                      📚 {tutorial.title}
                    </h1>

                    {tutorial.description && (
                      <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                        {tutorial.description}
                      </p>
                    )}

                    {/* Tutorial Stats */}
                    <div className="mb-8 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span>📖</span>
                        <span>{tutorial.lessons?.length || 0} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>Difficulty: {tutorial.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💻</span>
                        <span>{language.title}</span>
                      </div>
                    </div>

                    {/* Learn Interactively Button */}
                    <button
                      onClick={handleStartLessons}
                      className="mb-8 flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Start interactive lessons"
                    >
                      <span className="text-xl" aria-hidden="true">
                        🚀
                      </span>
                      <span>Learn Interactively</span>
                    </button>
                  </div>

                  {/* Reference Content */}
                  {tutorial.reference ? (
                    <div className="space-y-8">
                      {/* Introduction */}
                      {tutorial.reference.introduction && (
                        <div>
                          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                            📋 Introduction
                          </h2>
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                              {tutorial.reference.introduction}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Key Points */}
                      {tutorial.reference.key_points &&
                        tutorial.reference.key_points.length > 0 && (
                          <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                              💡 Key Points
                            </h2>
                            <ul className="space-y-2">
                              {tutorial.reference.key_points.map(
                                (point, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="mt-1 text-blue-500">
                                      •
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                      {typeof point === "string"
                                        ? point
                                        : point.point}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Code Examples */}
                      {tutorial.reference.examples &&
                        tutorial.reference.examples.length > 0 && (
                          <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                              💻 Code Examples
                            </h2>
                            <div className="space-y-6">
                              {tutorial.reference.examples.map(
                                (example, index) => (
                                  <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
                                  >
                                    <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                                      {example.title}
                                    </h3>
                                    {example.description && (
                                      <p className="mb-4 text-gray-600 dark:text-gray-400">
                                        {example.description}
                                      </p>
                                    )}
                                    <div className="mb-4 rounded-lg bg-gray-900 p-4">
                                      <pre className="overflow-x-auto text-sm text-gray-100">
                                        <code>{example.code}</code>
                                      </pre>
                                    </div>
                                    {example.output && (
                                      <div>
                                        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                          Output:
                                        </h4>
                                        <div className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                                          <code className="text-sm text-gray-800 dark:text-gray-200">
                                            {example.output}
                                          </code>
                                        </div>
                                      </div>
                                    )}
                                    {example.explanation && (
                                      <p className="mt-4 text-gray-600 dark:text-gray-400">
                                        {example.explanation}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Common Mistakes */}
                      {tutorial.reference.common_mistakes &&
                        tutorial.reference.common_mistakes.length > 0 && (
                          <div>
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                              ⚠️ Common Mistakes
                            </h2>
                            <div className="space-y-4">
                              {tutorial.reference.common_mistakes.map(
                                (mistake, index) => (
                                  <div
                                    key={index}
                                    className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                                  >
                                    <h4 className="mb-2 font-medium text-red-900 dark:text-red-100">
                                      {mistake.mistake}
                                    </h4>
                                    {mistake.why_wrong && (
                                      <p className="mb-2 text-sm text-red-700 dark:text-red-300">
                                        <strong>Why it&apos;s wrong:</strong>{" "}
                                        {mistake.why_wrong}
                                      </p>
                                    )}
                                    {mistake.correct_approach && (
                                      <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Correct approach:</strong>{" "}
                                        {mistake.correct_approach}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Syntax Guide */}
                      {tutorial.reference.syntax_guide && (
                        <div>
                          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                            📖 Syntax Guide
                          </h2>
                          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                            {tutorial.reference.syntax_guide.basic_syntax && (
                              <div className="mb-4">
                                <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                                  Basic Syntax:
                                </h4>
                                <div className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                                  <code className="text-sm text-gray-800 dark:text-gray-200">
                                    {
                                      tutorial.reference.syntax_guide
                                        .basic_syntax
                                    }
                                  </code>
                                </div>
                              </div>
                            )}
                            {tutorial.reference.syntax_guide.parameters &&
                              tutorial.reference.syntax_guide.parameters
                                .length > 0 && (
                                <div>
                                  <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                                    Parameters:
                                  </h4>
                                  <div className="space-y-2">
                                    {tutorial.reference.syntax_guide.parameters.map(
                                      (param, index) => (
                                        <div key={index} className="flex gap-4">
                                          <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-700">
                                            {param.name}
                                          </span>
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {param.description}{" "}
                                            {param.required && "(Required)"}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="mb-4 text-gray-500 dark:text-gray-400">
                        No reference content available for this tutorial.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Lesson Content */
                <div>
                  <div className="p-8">
                    {currentLesson ? (
                      <div>
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                              {currentLesson.type === "concept" && "📖"}
                              {currentLesson.type === "mcq" && "🎯"}
                              {currentLesson.type === "codeblock_rearranging" &&
                                "🧩"}
                              {currentLesson.type === "fill_in_blanks" && "✏️"}{" "}
                              Lesson {currentLessonIndex + 1}:{" "}
                              {currentLesson.title}
                            </h1>
                          </div>
                          <button
                            onClick={handleBackToReference}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            ← Back to Reference
                          </button>
                        </div>

                        {/* Learning Objectives */}
                        {currentLesson.learningObjectives &&
                          currentLesson.learningObjectives.length > 0 && (
                            <div className="mb-4">
                              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                🎯 Learning Objectives:
                              </h3>
                              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {currentLesson.learningObjectives.map(
                                  (obj, index) => (
                                    <li key={index}>
                                      {typeof obj === "string"
                                        ? obj
                                        : obj.objective}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Lesson Content */}
                        <div className="mb-6">
                          {currentLesson.type === "concept" &&
                            currentLesson.conceptData && (
                              <ConceptLesson
                                data={currentLesson.conceptData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {currentLesson.type === "mcq" &&
                            currentLesson.mcqData && (
                              <MCQLesson
                                data={currentLesson.mcqData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {currentLesson.type === "codeblock_rearranging" &&
                            currentLesson.codeRearrangeData && (
                              <CodeRearrangeLesson
                                data={currentLesson.codeRearrangeData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {currentLesson.type === "fill_in_blanks" &&
                            currentLesson.fibData && (
                              <FillBlanksLesson
                                data={currentLesson.fibData}
                                lessonTitle={currentLesson.title}
                              />
                            )}

                          {/* Fallback for unknown lesson types */}
                          {![
                            "concept",
                            "mcq",
                            "codeblock_rearranging",
                            "fill_in_blanks",
                          ].includes(currentLesson.type) && (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
                              <div className="flex items-start gap-3">
                                <span className="text-lg text-yellow-500">
                                  ⚠️
                                </span>
                                <div>
                                  <h3 className="mb-2 font-medium text-yellow-900 dark:text-yellow-100">
                                    Unknown Lesson Type
                                  </h3>
                                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    This lesson type &quot;{currentLesson.type}
                                    &quot; is not yet supported. Please contact
                                    support if you believe this is an error.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          No lesson content available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="border-t border-gray-200 p-4 dark:border-gray-700 sm:p-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <button
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:w-auto"
                        aria-label="Go to previous lesson"
                        title="Previous lesson (←)"
                      >
                        <span aria-hidden="true">◀️</span> Previous Lesson
                      </button>

                      <span className="order-first text-sm text-gray-500 dark:text-gray-400 sm:order-none">
                        {currentLessonIndex + 1} of{" "}
                        {tutorial.lessons?.length || 0}
                      </span>

                      <button
                        onClick={handleNextLesson}
                        disabled={
                          currentLessonIndex >=
                          (tutorial.lessons?.length || 0) - 1
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        aria-label="Go to next lesson"
                        title="Next lesson (→)"
                      >
                        Next Lesson <span aria-hidden="true">▶️</span>
                      </button>
                    </div>

                    {/* Mobile Quick Actions */}
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700 lg:hidden">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={handleBackToReference}
                          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          📖 Reference
                        </button>
                        <button
                          onClick={toggleBookmark}
                          className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                            stats.isBookmarked
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          🔖 Bookmark
                        </button>
                        <button
                          onClick={() => setShowBookmarkPanel(true)}
                          className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                            stats.hasNotes
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          📝 Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bookmark & Notes Panel */}
      {showBookmarkPanel && (
        <BookmarkNotesPanel
          tutorialId={tutorial.id.toString()}
          tutorialTitle={tutorial.title}
          onClose={() => setShowBookmarkPanel(false)}
        />
      )}
    </div>
  )
}

export default TutorialPageContainer
