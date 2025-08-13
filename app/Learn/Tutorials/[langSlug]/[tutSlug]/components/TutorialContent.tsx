"use client"

import React from "react"
import { Language, Tutorial } from "../../../../types/TutorialTypes"
import ReferenceContent from "./ReferenceContent"

interface TutorialContentProps {
  tutorial: Tutorial
  language: Language
  activeLesson: number
  setActiveLesson: (index: number) => void
  showReference: boolean
}

const TutorialContent = ({
  tutorial,
  language,
  activeLesson,
  setActiveLesson,
  showReference,
}: TutorialContentProps) => {
  const lessons = tutorial.lessons || []
  const hasLessons = lessons.length > 0

  // If no lessons and no reference, show enhanced tutorial info matching Exercise UI
  if (!hasLessons && !showReference) {
    return (
      <div className="space-y-6">
        {/* Main Tutorial Info - matching Exercise dark theme */}
        <div className="rounded-xl border-2 border-transparent bg-white p-8 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
          <div className="text-center">
            <div className="mb-4 text-4xl">📚</div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {tutorial.title}
            </h1>

            {tutorial.description && (
              <p className="mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {tutorial.description}
              </p>
            )}

            {/* Tutorial Metadata */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {tutorial.difficulty && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="mb-2 text-2xl">⭐</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Difficulty
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    {tutorial.difficulty === "1"
                      ? "Beginner"
                      : tutorial.difficulty === "2"
                        ? "Intermediate"
                        : "Advanced"}
                  </div>
                </div>
              )}

              {tutorial.keyTopics && tutorial.keyTopics.length > 0 && (
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-2 text-2xl">🎯</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    Topics
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    {tutorial.keyTopics.length} key topics
                  </div>
                </div>
              )}

              {tutorial.practicalApplications &&
                tutorial.practicalApplications.length > 0 && (
                  <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                    <div className="mb-2 text-2xl">💼</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      Applications
                    </div>
                    <div className="text-purple-600 dark:text-purple-400">
                      Real-world use cases
                    </div>
                  </div>
                )}
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-blue-800 dark:text-blue-200">
                This tutorial content is being prepared. Please check back later
                for interactive lessons and comprehensive learning materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tutorial Overview - Enhanced like Exercise UI */}
      <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-8 text-center">
          <div className="mb-4 text-4xl">📚</div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {tutorial.title}
          </h1>

          {tutorial.description && (
            <p className="mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {tutorial.description}
            </p>
          )}

          {/* Tutorial Metadata Grid */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {tutorial.difficulty && (
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="mb-2 text-2xl">⭐</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Difficulty
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {tutorial.difficulty === "1"
                    ? "Beginner"
                    : tutorial.difficulty === "2"
                      ? "Intermediate"
                      : "Advanced"}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="mb-2 text-2xl">📖</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Lessons
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {hasLessons ? `${lessons.length} interactive` : "Coming soon"}
              </div>
            </div>

            {tutorial.keyTopics && tutorial.keyTopics.length > 0 && (
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <div className="mb-2 text-2xl">🎯</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Topics
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {tutorial.keyTopics.length} key areas
                </div>
              </div>
            )}

            {showReference && (
              <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                <div className="mb-2 text-2xl">📋</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Reference
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Complete guide
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        {tutorial.learningObjectives &&
          tutorial.learningObjectives.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
                {`🎯 What You'll Learn`}
              </h3>
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
                {tutorial.learningObjectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {typeof objective === "string"
                        ? objective
                        : objective.objective}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Key Topics */}
        {tutorial.keyTopics && tutorial.keyTopics.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
              📚 Key Topics Covered
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {tutorial.keyTopics.map((topic, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                >
                  {typeof topic === "string" ? topic : topic.topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Practical Applications */}
        {tutorial.practicalApplications &&
          tutorial.practicalApplications.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
                💼 Real-World Applications
              </h3>
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
                {tutorial.practicalApplications.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                      💼
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {typeof app === "string" ? app : app.application}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Navigation buttons for lessons */}
        {hasLessons && (
          <div className="border-t border-gray-200 pt-6 dark:border-slate-600">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
              Choose Your Learning Path
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveLesson(-1)}
                className={`rounded-lg px-6 py-3 font-medium transition-all ${
                  activeLesson === -1
                    ? "scale-105 transform bg-blue-600 text-white shadow-lg"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
                }`}
              >
                📖 Overview
              </button>

              {showReference && (
                <button
                  onClick={() => setActiveLesson(-2)}
                  className={`rounded-lg px-6 py-3 font-medium transition-all ${
                    activeLesson === -2
                      ? "scale-105 transform bg-green-600 text-white shadow-lg"
                      : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40"
                  }`}
                >
                  📋 Reference Guide
                </button>
              )}

              {lessons.length > 0 && (
                <button
                  onClick={() => setActiveLesson(0)}
                  className={`rounded-lg px-6 py-3 font-medium transition-all ${
                    activeLesson >= 0
                      ? "scale-105 transform bg-purple-600 text-white shadow-lg"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40"
                  }`}
                >
                  🚀 Start Learning
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content based on active selection */}
      {hasLessons && activeLesson >= 0 && (
        <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              📚 Tutorial Lessons
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a lesson to start your interactive learning journey
            </p>
          </div>

          {/* Lessons Grid - matching Exercise system */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson, index) => {
              const getLessonIcon = (type: string) => {
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
                    return "Concept"
                  case "mcq":
                    return "Quiz"
                  case "codeblock_rearranging":
                    return "Code Puzzle"
                  case "fill_in_blanks":
                    return "Fill Blanks"
                  default:
                    return "Lesson"
                }
              }

              return (
                //eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={index}
                  className="group flex h-full cursor-pointer flex-col rounded-xl border-2 border-transparent bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/10 dark:bg-slate-800 dark:hover:border-blue-400 dark:hover:shadow-blue-400/10"
                  onClick={() =>
                    (window.location.href = `${window.location.pathname}/${index + 1}`)
                  }
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    (window.location.href = `${window.location.pathname}/${index + 1}`)
                  }
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to lesson ${index + 1}: ${lesson.title}`}
                >
                  {/* Header with index and lesson type */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-lg font-bold text-white dark:from-blue-500 dark:to-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <span className="text-sm">
                        {getLessonIcon(lesson.type)}
                      </span>
                      {getLessonTypeLabel(lesson.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {lesson.title}
                    </h3>

                    {lesson.description && (
                      <p className="mb-4 line-clamp-3 text-slate-600 dark:text-slate-300">
                        {lesson.description.length > 120
                          ? `${lesson.description.substring(0, 120)}...`
                          : lesson.description}
                      </p>
                    )}

                    {/* Learning Objectives Tags */}
                    {lesson.learningObjectives &&
                      lesson.learningObjectives.length > 0 && (
                        <div className="mb-4">
                          <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            🎯 {lesson.learningObjectives.length} objective
                            {lesson.learningObjectives.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <span className="mr-1 text-sm">
                          {getLessonIcon(lesson.type)}
                        </span>
                        <span>Lesson</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          ~
                          {Math.max(
                            5,
                            Math.ceil((lesson.description?.length || 0) / 100)
                          )}{" "}
                          min
                        </span>
                      </div>
                    </div>

                    <div className="text-blue-600 transition-colors group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Back to Overview Button */}
          <div className="mt-6 border-t border-gray-200 pt-6 text-center dark:border-slate-600">
            <button
              onClick={() => setActiveLesson(-1)}
              className="rounded-lg bg-gray-100 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      )}

      {/* Reference content */}
      {showReference && activeLesson === -2 && (
        <ReferenceContent
          reference={tutorial.reference}
          tutorial={tutorial}
          language={language}
        />
      )}
    </div>
  )
}

export default TutorialContent
