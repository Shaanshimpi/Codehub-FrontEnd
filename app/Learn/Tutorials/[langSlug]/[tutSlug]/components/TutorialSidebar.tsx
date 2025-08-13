"use client"

import React from "react"
import { Tutorial } from "../../../../types/TutorialTypes"

interface TutorialSidebarProps {
  tutorial: Tutorial
  activeLesson: number
  setActiveLesson: (index: number) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const TutorialSidebar = ({
  tutorial,
  activeLesson,
  setActiveLesson,
  sidebarOpen,
  setSidebarOpen,
}: TutorialSidebarProps) => {
  const lessons = tutorial.lessons || []

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
        return "Code Rearrange"
      case "fill_in_blanks":
        return "Fill Blanks"
      default:
        return "Lesson"
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 transform border-r border-gray-200 bg-white transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-30 lg:translate-x-0`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="truncate font-semibold text-gray-900">
              {tutorial.title}
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </div>
        </div>

        {/* Lesson List */}
        <div
          className="space-y-2 overflow-y-auto p-4"
          style={{ height: "calc(100vh - 120px)" }}
        >
          {lessons.map((lesson, index) => {
            const isActive = activeLesson === index

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setActiveLesson(index)
                  setSidebarOpen(false)
                }}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                } `}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getLessonIcon(lesson.type)}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      Lesson {index + 1}
                    </span>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {getLessonTypeLabel(lesson.type)}
                  </span>
                </div>

                <h3 className="mb-1 line-clamp-2 text-sm font-medium">
                  {lesson.title}
                </h3>

                {lesson.description && (
                  <p className="line-clamp-2 text-xs text-gray-500">
                    {lesson.description}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TutorialSidebar
