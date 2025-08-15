"use client"

import React, { useState } from "react"
import type { TutorialData } from "@/app/Learn/types/TutorialTypes"
import { submitTutorial } from "@/lib/submitData"
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Code2,
  Eye,
  FileText,
  HelpCircle,
  Loader2,
  Send,
  Shuffle,
  Tag,
  Target,
  X,
} from "lucide-react"
import PlantUMLDiagram from "./PlantUMLDiagram"

interface TutorialPreviewProps {
  tutorial: TutorialData
  onClose?: () => void
}

const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case "concept":
      return <BookOpen className="h-4 w-4" />
    case "mcq":
      return <HelpCircle className="h-4 w-4" />
    case "codeblock_rearranging":
      return <Shuffle className="h-4 w-4" />
    case "fill_in_blanks":
      return <FileText className="h-4 w-4" />
    default:
      return <Code2 className="h-4 w-4" />
  }
}

const getLessonTypeName = (type: string) => {
  switch (type) {
    case "concept":
      return "Concept Lesson"
    case "mcq":
      return "Multiple Choice Quiz"
    case "codeblock_rearranging":
      return "Code Rearranging"
    case "fill_in_blanks":
      return "Fill in the Blanks"
    default:
      return "Interactive Content"
  }
}

const getDifficultyColor = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
    case 2:
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
    case 3:
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20"
  }
}

const getDifficultyText = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    default:
      return "Unknown"
  }
}

const TutorialPreview: React.FC<TutorialPreviewProps> = ({
  tutorial,
  onClose,
}) => {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const toggleLessonExpansion = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      console.log("🚀 Submitting tutorial:", tutorial)
      const result = await submitTutorial(tutorial)

      setSubmitStatus("success")
      setSubmitMessage("Tutorial submitted successfully!")
      console.log("✅ Tutorial submission successful:", result)

      // Optionally close the preview after successful submission
      setTimeout(() => {
        if (onClose) onClose()
      }, 2000)
    } catch (error) {
      console.error("❌ Tutorial submission failed:", error)
      setSubmitStatus("error")
      setSubmitMessage(
        error instanceof Error ? error.message : "Failed to submit tutorial"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tutorial Preview
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {/* Tutorial Overview */}
          <div className="mb-8">
            <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              {tutorial.title}
            </h1>

            <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {tutorial.description}
            </p>

            {/* Tutorial Metadata */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                <div className="mb-1 flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                    Difficulty
                  </span>
                </div>
                <span
                  className={`rounded px-2 py-1 text-sm ${getDifficultyColor(tutorial.difficulty || 1)}`}
                >
                  {getDifficultyText(tutorial.difficulty || 1)}
                </span>
              </div>

              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <div className="mb-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-200">
                    Lessons
                  </span>
                </div>
                <span className="text-sm text-green-700 dark:text-green-300">
                  {tutorial.lessons?.length || 0}
                </span>
              </div>

              <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
                <div className="mb-1 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-200">
                    Topics
                  </span>
                </div>
                <span className="text-sm text-orange-700 dark:text-orange-300">
                  {tutorial.keyTopics?.length || 0}
                </span>
              </div>
            </div>

            {/* Learning Objectives */}
            {tutorial.learningObjectives &&
              tutorial.learningObjectives.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {tutorial.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {objective}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Key Topics */}
            {tutorial.keyTopics && tutorial.keyTopics.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Key Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutorial.keyTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Applications */}
            {tutorial.practicalApplications &&
              tutorial.practicalApplications.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Practical Applications
                  </h3>
                  <ul className="space-y-2">
                    {tutorial.practicalApplications.map(
                      (application, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 text-purple-600 dark:text-purple-400">
                            🚀
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {application}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>

          {/* Lessons Preview */}
          {tutorial.lessons && tutorial.lessons.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Lessons Overview
              </h3>
              <div className="space-y-3">
                {tutorial.lessons.map((lesson, index) => (
                  <div
                    key={`lesson-${index}`}
                    className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleLessonExpansion(`lesson-${index}`)}
                      className="w-full bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="min-w-[2rem] text-sm font-medium text-gray-500 dark:text-gray-400">
                            {index + 1}.
                          </span>
                          {getLessonTypeIcon(lesson.type)}
                          <div className="text-left">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {lesson.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-3">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {getLessonTypeName(lesson.type)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {expandedLesson === `lesson-${index}` ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedLesson === `lesson-${index}` && (
                      <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-800">
                        {/* Lesson Learning Objectives */}
                        {lesson.learningObjectives &&
                          lesson.learningObjectives.length > 0 && (
                            <div className="mb-4">
                              <h5 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Learning Objectives:
                              </h5>
                              <ul className="space-y-1">
                                {lesson.learningObjectives.map(
                                  (objective, objIndex) => (
                                    <li
                                      key={objIndex}
                                      className="flex items-start gap-2"
                                    >
                                      <CheckCircle className="mt-1 h-3 w-3 flex-shrink-0 text-green-600" />
                                      <span className="text-xs text-gray-600 dark:text-gray-300">
                                        {objective}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Detailed Lesson Content based on type */}
                        <div className="space-y-4">
                          {/* CONCEPT LESSON CONTENT */}
                          {lesson.type === "concept" && lesson.content && (
                            <div className="space-y-4">
                              {/* Explanation */}
                              {lesson.content.explanation && (
                                <div>
                                  <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    Explanation:
                                  </h6>
                                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                                    {lesson.content.explanation}
                                  </p>
                                </div>
                              )}

                              {/* Key Points */}
                              {lesson.content.keyPoints &&
                                lesson.content.keyPoints.length > 0 && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Key Points:
                                    </h6>
                                    <ul className="space-y-1">
                                      {lesson.content.keyPoints.map(
                                        (point, pointIndex) => (
                                          <li
                                            key={pointIndex}
                                            className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                                          >
                                            <span className="mt-1 text-blue-600 dark:text-blue-400">
                                              •
                                            </span>
                                            {point}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* Code Examples */}
                              {lesson.content.codeExamples &&
                                lesson.content.codeExamples.length > 0 && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Code Examples:
                                    </h6>
                                    <div className="space-y-3">
                                      {lesson.content.codeExamples.map(
                                        (example, exampleIndex) => (
                                          <div
                                            key={exampleIndex}
                                            className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-600"
                                          >
                                            <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {example.title}
                                              </span>
                                            </div>
                                            <pre className="overflow-x-auto bg-gray-900 p-3 text-xs text-green-400">
                                              <code>{example.code}</code>
                                            </pre>
                                            <div className="bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                                              <p className="text-xs text-blue-800 dark:text-blue-300">
                                                {example.explanation}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Practice Hints */}
                              {lesson.content.practiceHints &&
                                lesson.content.practiceHints.length > 0 && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Practice Hints:
                                    </h6>
                                    <ul className="space-y-1">
                                      {lesson.content.practiceHints.map(
                                        (hint, hintIndex) => (
                                          <li
                                            key={hintIndex}
                                            className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                                          >
                                            <span className="mt-1 text-green-600 dark:text-green-400">
                                              💡
                                            </span>
                                            {hint}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* Common Mistakes */}
                              {lesson.content.commonMistakes &&
                                lesson.content.commonMistakes.length > 0 && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Common Mistakes:
                                    </h6>
                                    <ul className="space-y-1">
                                      {lesson.content.commonMistakes.map(
                                        (mistake, mistakeIndex) => (
                                          <li
                                            key={mistakeIndex}
                                            className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400"
                                          >
                                            <span className="mt-1 text-red-600 dark:text-red-400">
                                              ⚠️
                                            </span>
                                            {mistake}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* Best Practices */}
                              {lesson.content.bestPractices &&
                                lesson.content.bestPractices.length > 0 && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Best Practices:
                                    </h6>
                                    <ul className="space-y-1">
                                      {lesson.content.bestPractices.map(
                                        (practice, practiceIndex) => (
                                          <li
                                            key={practiceIndex}
                                            className="flex items-start gap-2 text-xs text-green-600 dark:text-green-400"
                                          >
                                            <span className="mt-1 text-green-600 dark:text-green-400">
                                              ✅
                                            </span>
                                            {practice}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* PlantUML Diagram */}
                              {lesson.content.diagram_data && (
                                <div>
                                  <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    Concept Diagram:
                                  </h6>
                                  <div className="rounded border bg-gray-50 p-3 dark:bg-gray-800">
                                    <PlantUMLDiagram
                                      diagramData={lesson.content.diagram_data}
                                      showDebugInfo={true}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* MCQ LESSON CONTENT */}
                          {lesson.type === "mcq" &&
                            lesson.content?.questions && (
                              <div className="space-y-4">
                                <h6 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                                  Quiz Questions (
                                  {lesson.content.questions.length} questions):
                                </h6>
                                <div className="space-y-4">
                                  {lesson.content.questions.map(
                                    (question, qIndex) => (
                                      <div
                                        key={question.id || qIndex}
                                        className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600"
                                      >
                                        {/* Question Header */}
                                        <div className="border-b border-gray-200 bg-blue-50 px-4 py-3 dark:border-gray-600 dark:bg-blue-900/20">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                                              Question {qIndex + 1}
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <span
                                                className={`rounded px-2 py-1 text-xs ${getDifficultyColor(question.difficulty || 1)}`}
                                              >
                                                {getDifficultyText(
                                                  question.difficulty || 1
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                            {question.question}
                                          </p>
                                        </div>

                                        {/* Code Snippet if available */}
                                        {question.codeSnippet && (
                                          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-800">
                                            <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                                              <code>
                                                {question.codeSnippet}
                                              </code>
                                            </pre>
                                          </div>
                                        )}

                                        {/* Options */}
                                        <div className="px-4 py-3">
                                          <div className="space-y-2">
                                            {question.options.map(
                                              (option, optIndex) => (
                                                <div
                                                  key={option.id || optIndex}
                                                  className={`flex items-center gap-3 rounded border p-2 ${
                                                    option.isCorrect
                                                      ? "border-green-200 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
                                                      : "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
                                                  }`}
                                                >
                                                  <span
                                                    className={`rounded px-2 py-1 text-xs font-medium ${
                                                      option.isCorrect
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                                                    }`}
                                                  >
                                                    {option.id ||
                                                      String.fromCharCode(
                                                        65 + optIndex
                                                      )}
                                                  </span>
                                                  <span
                                                    className={`text-xs ${
                                                      option.isCorrect
                                                        ? "font-medium text-green-700 dark:text-green-300"
                                                        : "text-gray-600 dark:text-gray-300"
                                                    }`}
                                                  >
                                                    {option.text}
                                                  </span>
                                                  {option.isCorrect && (
                                                    <span className="ml-auto text-green-600 dark:text-green-400">
                                                      ✓
                                                    </span>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>

                                        {/* Explanation */}
                                        {question.explanation && (
                                          <div className="border-t border-gray-200 bg-yellow-50 px-4 py-3 dark:border-gray-600 dark:bg-yellow-900/20">
                                            <div className="flex items-start gap-2">
                                              <span className="mt-1 text-yellow-600 dark:text-yellow-400">
                                                💡
                                              </span>
                                              <div>
                                                <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                                                  Explanation:
                                                </span>
                                                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                                                  {question.explanation}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* CODE REARRANGING LESSON CONTENT */}
                          {lesson.type === "codeblock_rearranging" &&
                            lesson.content && (
                              <div className="space-y-4">
                                {/* Scenario */}
                                {lesson.content.scenario && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Exercise Scenario:
                                    </h6>
                                    <p className="rounded bg-blue-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-blue-900/20 dark:text-gray-300">
                                      {lesson.content.scenario}
                                    </p>
                                  </div>
                                )}

                                {/* Target Code */}
                                {lesson.content.targetCode && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Expected Solution:
                                    </h6>
                                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
                                      <div className="border-b border-gray-200 bg-green-50 px-3 py-2 dark:border-gray-600 dark:bg-green-900/20">
                                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                          Target Code
                                        </span>
                                      </div>
                                      <pre className="overflow-x-auto bg-gray-900 p-3 text-xs text-green-400">
                                        <code>{lesson.content.targetCode}</code>
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {/* Code Blocks */}
                                {lesson.content.codeBlocks &&
                                  lesson.content.codeBlocks.length > 0 && (
                                    <div>
                                      <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        Code Blocks to Rearrange (
                                        {lesson.content.codeBlocks.length}{" "}
                                        blocks):
                                      </h6>
                                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        {lesson.content.codeBlocks.map(
                                          (block, blockIndex) => (
                                            <div
                                              key={block.id || blockIndex}
                                              className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-600"
                                            >
                                              <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                  Block{" "}
                                                  {block.id || blockIndex + 1}
                                                </span>
                                              </div>
                                              <pre className="bg-gray-100 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                <code>{block.content}</code>
                                              </pre>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Correct Order */}
                                {lesson.content.correctOrder &&
                                  lesson.content.correctOrder.length > 0 && (
                                    <div>
                                      <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        Correct Order:
                                      </h6>
                                      <div className="flex flex-wrap gap-2">
                                        {lesson.content.correctOrder.map(
                                          (blockId, orderIndex) => (
                                            <span
                                              key={orderIndex}
                                              className="rounded bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                            >
                                              {orderIndex + 1}. {blockId}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Hints */}
                                {lesson.content.hints &&
                                  lesson.content.hints.length > 0 && (
                                    <div>
                                      <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        Hints:
                                      </h6>
                                      <ul className="space-y-1">
                                        {lesson.content.hints.map(
                                          (hint, hintIndex) => (
                                            <li
                                              key={hintIndex}
                                              className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                                            >
                                              <span className="mt-1 text-yellow-600 dark:text-yellow-400">
                                                💡
                                              </span>
                                              {hint}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            )}

                          {/* FILL IN BLANKS LESSON CONTENT */}
                          {lesson.type === "fill_in_blanks" &&
                            lesson.content && (
                              <div className="space-y-4">
                                {/* Scenario */}
                                {lesson.content.scenario && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Exercise Scenario:
                                    </h6>
                                    <p className="rounded bg-blue-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-blue-900/20 dark:text-gray-300">
                                      {lesson.content.scenario}
                                    </p>
                                  </div>
                                )}

                                {/* Code Template */}
                                {lesson.content.codeTemplate && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Code Template:
                                    </h6>
                                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
                                      <div className="border-b border-gray-200 bg-orange-50 px-3 py-2 dark:border-gray-600 dark:bg-orange-900/20">
                                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                          Template with Blanks
                                        </span>
                                      </div>
                                      <pre className="overflow-x-auto bg-gray-900 p-3 text-xs text-orange-400">
                                        <code>
                                          {lesson.content.codeTemplate}
                                        </code>
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {/* Blanks */}
                                {lesson.content.blanks &&
                                  lesson.content.blanks.length > 0 && (
                                    <div>
                                      <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        Blanks to Fill (
                                        {lesson.content.blanks.length} blanks):
                                      </h6>
                                      <div className="space-y-3">
                                        {lesson.content.blanks.map(
                                          (blank, blankIndex) => (
                                            <div
                                              key={blank.id || blankIndex}
                                              className="rounded-lg border border-gray-200 p-4 dark:border-gray-600"
                                            >
                                              <div className="mb-2 flex items-center gap-3">
                                                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-700 dark:text-blue-300">
                                                  {blank.id}
                                                </span>
                                                <span
                                                  className={`rounded px-2 py-1 text-xs ${
                                                    blank.type === "text"
                                                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                                      : blank.type ===
                                                          "dropdown"
                                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                  }`}
                                                >
                                                  {blank.type}
                                                </span>
                                              </div>

                                              <div className="space-y-2">
                                                <div>
                                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    Correct Answer:
                                                  </span>
                                                  <span className="ml-2 rounded bg-green-100 px-2 py-1 font-mono text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                                    {blank.correctAnswer}
                                                  </span>
                                                </div>

                                                {blank.options &&
                                                  blank.options.length > 0 && (
                                                    <div>
                                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Options:
                                                      </span>
                                                      <div className="mt-1 flex flex-wrap gap-1">
                                                        {blank.options.map(
                                                          (
                                                            option,
                                                            optIndex
                                                          ) => (
                                                            <span
                                                              key={optIndex}
                                                              className={`rounded px-2 py-1 text-xs ${
                                                                option ===
                                                                blank.correctAnswer
                                                                  ? "bg-green-100 font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                                                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                              }`}
                                                            >
                                                              {option}
                                                              {option ===
                                                                blank.correctAnswer &&
                                                                " ✓"}
                                                            </span>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                {blank.hint && (
                                                  <div className="flex items-start gap-2">
                                                    <span className="mt-1 text-yellow-600 dark:text-yellow-400">
                                                      💡
                                                    </span>
                                                    <div>
                                                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                                                        Hint:
                                                      </span>
                                                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                                        {blank.hint}
                                                      </p>
                                                    </div>
                                                  </div>
                                                )}

                                                {blank.explanation && (
                                                  <div>
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                      Explanation:
                                                    </span>
                                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                      {blank.explanation}
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* General Hints */}
                                {lesson.content.hints &&
                                  lesson.content.hints.length > 0 && (
                                    <div>
                                      <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        General Hints:
                                      </h6>
                                      <ul className="space-y-1">
                                        {lesson.content.hints.map(
                                          (hint, hintIndex) => (
                                            <li
                                              key={hintIndex}
                                              className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300"
                                            >
                                              <span className="mt-1 text-yellow-600 dark:text-yellow-400">
                                                💡
                                              </span>
                                              {hint}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Solution */}
                                {lesson.content.solution && (
                                  <div>
                                    <h6 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                      Complete Solution:
                                    </h6>
                                    <div className="space-y-3">
                                      {lesson.content.solution.completeCode && (
                                        <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
                                          <div className="border-b border-gray-200 bg-green-50 px-3 py-2 dark:border-gray-600 dark:bg-green-900/20">
                                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                              Complete Code
                                            </span>
                                          </div>
                                          <pre className="overflow-x-auto bg-gray-900 p-3 text-xs text-green-400">
                                            <code>
                                              {
                                                lesson.content.solution
                                                  .completeCode
                                              }
                                            </code>
                                          </pre>
                                        </div>
                                      )}

                                      {lesson.content.solution.explanation && (
                                        <div className="rounded bg-blue-50 p-3 dark:bg-blue-900/20">
                                          <div className="flex items-start gap-2">
                                            <span className="mt-1 text-blue-600 dark:text-blue-400">
                                              📝
                                            </span>
                                            <div>
                                              <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                                                Solution Explanation:
                                              </span>
                                              <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                                                {
                                                  lesson.content.solution
                                                    .explanation
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Fallback for unknown lesson types */}
                          {!lesson.content && (
                            <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                              <span className="text-xs">
                                Content not available for preview
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Lesson Type Badge */}
                        <div className="mt-3">
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-700 dark:text-blue-400">
                            {getLessonTypeName(lesson.type)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message if no lessons */}
          {(!tutorial.lessons || tutorial.lessons.length === 0) && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No lessons available in this tutorial.</p>
            </div>
          )}

          {/* Submit Button Section */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
            {/* Submit Status Messages */}
            {submitStatus === "success" && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-600 dark:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {submitMessage}
                  </span>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/20">
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    {submitMessage}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close Preview
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || submitStatus === "success"}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submitted
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Tutorial
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialPreview
