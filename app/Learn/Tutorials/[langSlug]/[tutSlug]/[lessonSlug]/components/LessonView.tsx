"use client"

import React from "react"
import HeaderClient from "@/app/Learn/layouts/HeaderClient"
import {
  Language,
  Tutorial,
  TutorialLesson,
} from "../../../../../../types/TutorialTypes"
import LessonHeader from "./LessonHeader"
import LessonNavigation from "./LessonNavigation"
import CodeRearrangeLessonRenderer from "./LessonRenderers/CodeRearrangeLessonRenderer"
import ConceptLessonRenderer from "./LessonRenderers/ConceptLessonRenderer"
import FillBlankLessonRenderer from "./LessonRenderers/FillBlankLessonRenderer"
import MCQLessonRenderer from "./LessonRenderers/MCQLessonRenderer"

interface LessonViewProps {
  lesson: TutorialLesson
  tutorial: Tutorial
  language: Language
  lessonIndex: number
  totalLessons: number
  languages: Language[]
}

const LessonView = ({
  lesson,
  tutorial,
  language,
  lessonIndex,
  totalLessons,
  languages,
}: LessonViewProps) => {
  const renderLessonContent = () => {
    const lessonData = lesson as any // Type assertion for server data structure

    switch (lesson.type) {
      case "concept":
        return (
          <ConceptLessonRenderer
            lesson={lesson}
            conceptData={lessonData.conceptData}
            language={language}
          />
        )
      case "mcq":
        return (
          <MCQLessonRenderer
            lesson={lesson}
            mcqData={lessonData.mcqData}
            language={language}
          />
        )
      case "codeblock_rearranging":
        return (
          <CodeRearrangeLessonRenderer
            lesson={lesson}
            codeRearrangeData={lessonData.codeRearrangeData}
            language={language}
          />
        )
      case "fill_in_blanks":
        return (
          <FillBlankLessonRenderer
            lesson={lesson}
            fibData={lessonData.fibData}
            language={language}
          />
        )
      default:
        return (
          <div className="rounded-lg bg-white p-8 text-center dark:bg-slate-800">
            <div className="mb-4 text-4xl">🚧</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Lesson Content Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This lesson type ({lesson.type}) is being developed. Please check
              back later.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="bg-slate-900">
      {/* Header matching Exercise system */}
      <HeaderClient languages={languages} />

      {/* Lesson Header */}
      <LessonHeader
        lesson={lesson}
        tutorial={tutorial}
        language={language}
        lessonIndex={lessonIndex}
        totalLessons={totalLessons}
      />

      {/* Main content matching Exercise layout */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-8">
          {/* Lesson description and objectives */}
          {lesson.description && (
            <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                About This Lesson
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {lesson.description}
              </p>

              {/* Learning Objectives */}
              {lesson.learningObjectives &&
                lesson.learningObjectives.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                      {`What You'll Learn:`}
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {lesson.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 text-blue-500">•</span>
                          {typeof objective === "string"
                            ? objective
                            : objective.objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Interactive lesson content */}
          {renderLessonContent()}

          {/* Navigation to previous/next lessons */}
          <LessonNavigation
            tutorial={tutorial}
            language={language}
            lessonIndex={lessonIndex}
            totalLessons={totalLessons}
          />
        </div>
      </div>
    </div>
  )
}

export default LessonView
