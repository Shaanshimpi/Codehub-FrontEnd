"use client"

import React from "react"
import {
  Language,
  Tutorial,
  TutorialLesson,
} from "../../../../../types/TutorialTypes"

interface LessonContentProps {
  lesson: TutorialLesson
  tutorial: Tutorial
  language: Language
  lessonIndex: number
  totalLessons: number
  setActiveLesson: (index: number) => void
}

const LessonContent = ({
  lesson,
  tutorial,
  language,
  lessonIndex,
  totalLessons,
  setActiveLesson,
}: LessonContentProps) => {
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

  const renderLessonContent = () => {
    // For now, render a placeholder based on lesson type
    // Later this can be expanded to render actual interactive content
    switch (lesson.type) {
      case "concept":
        return renderConceptLesson()
      case "mcq":
        return renderMCQLesson()
      case "codeblock_rearranging":
        return renderCodeRearrangeLesson()
      case "fill_in_blanks":
        return renderFillBlanksLesson()
      default:
        return renderDefaultLesson()
    }
  }

  const renderConceptLesson = () => (
    <div className="prose max-w-none">
      <p className="mb-6 text-gray-600">
        This concept lesson will be rendered with interactive content including
        explanations, code examples, and visual diagrams.
      </p>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h4 className="mb-2 font-semibold text-blue-900">📖 Concept Lesson</h4>
        <p className="text-sm text-blue-800">
          Interactive concept explanation with code examples, key points, and
          best practices.
        </p>
      </div>
    </div>
  )

  const renderMCQLesson = () => (
    <div className="prose max-w-none">
      <p className="mb-6 text-gray-600">
        This quiz lesson will contain multiple-choice questions to test your
        understanding.
      </p>

      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h4 className="mb-2 font-semibold text-green-900">❓ Quiz Lesson</h4>
        <p className="text-sm text-green-800">
          Interactive multiple-choice questions with explanations and instant
          feedback.
        </p>
      </div>
    </div>
  )

  const renderCodeRearrangeLesson = () => (
    <div className="prose max-w-none">
      <p className="mb-6 text-gray-600">
        This lesson will challenge you to arrange code blocks in the correct
        order.
      </p>

      <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
        <h4 className="mb-2 font-semibold text-purple-900">
          🧩 Code Rearrange
        </h4>
        <p className="text-sm text-purple-800">
          Drag and drop code blocks to create working programs and understand
          code flow.
        </p>
      </div>
    </div>
  )

  const renderFillBlanksLesson = () => (
    <div className="prose max-w-none">
      <p className="mb-6 text-gray-600">
        Complete the code by filling in the missing parts to make it work
        correctly.
      </p>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
        <h4 className="mb-2 font-semibold text-orange-900">
          ✏️ Fill in the Blanks
        </h4>
        <p className="text-sm text-orange-800">
          Complete code templates by filling in missing parts with the correct
          syntax.
        </p>
      </div>
    </div>
  )

  const renderDefaultLesson = () => (
    <div className="prose max-w-none">
      <p className="mb-6 text-gray-600">
        This lesson content will be available soon with interactive learning
        materials.
      </p>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h4 className="mb-2 font-semibold text-gray-900">📝 Coming Soon</h4>
        <p className="text-sm text-gray-800">
          Interactive lesson content is being prepared for this tutorial.
        </p>
      </div>
    </div>
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Lesson Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getLessonIcon(lesson.type)}</span>
            <div>
              <div className="text-sm text-gray-500">
                Lesson {lessonIndex + 1} of {totalLessons}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {lesson.title}
              </h2>
            </div>
          </div>

          <div className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
            {lesson.type
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Learning Objectives:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {lesson.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  {typeof objective === "string"
                    ? objective
                    : objective.objective}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        {lesson.description && (
          <p className="mb-6 text-gray-600">{lesson.description}</p>
        )}

        {renderLessonContent()}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveLesson(lessonIndex - 1)}
            disabled={lessonIndex === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:hover:text-gray-400"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div className="text-sm text-gray-500">
            {lessonIndex + 1} / {totalLessons}
          </div>

          <button
            onClick={() => setActiveLesson(lessonIndex + 1)}
            disabled={lessonIndex === totalLessons - 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:hover:text-gray-400"
          >
            Next
            <svg
              className="ml-1 h-4 w-4"
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
          </button>
        </div>
      </div>
    </div>
  )
}

export default LessonContent
