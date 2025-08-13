"use client"

import React, { useState } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Code,
  Eye,
  EyeOff,
  Lightbulb,
} from "lucide-react"
import {
  Language,
  TutorialLesson,
} from "../../../../../../../types/TutorialTypes"
import CodeBlock from "./shared/CodeBlock"
import MermaidDiagram from "./shared/MermaidDiagram"

interface ConceptLessonRendererProps {
  lesson: TutorialLesson
  conceptData: any // From server Tutorial.ts conceptData structure
  language: Language
}

const ConceptLessonRenderer = ({
  lesson,
  conceptData,
  language,
}: ConceptLessonRendererProps) => {
  const [activeTab, setActiveTab] = useState<
    "explanation" | "examples" | "practices"
  >("explanation")
  const [expandedExample, setExpandedExample] = useState<number | null>(null)

  if (!conceptData) {
    return (
      <div className="rounded-xl border-2 border-transparent bg-white p-8 text-center shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-4 text-4xl">📖</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Concept Content Loading
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          The concept explanation will be available here shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="rounded-xl border-2 border-transparent bg-white shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="border-b border-gray-200 dark:border-slate-600">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("explanation")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "explanation"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              📖 Explanation
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "examples"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              💻 Code Examples
            </button>
            <button
              onClick={() => setActiveTab("practices")}
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "practices"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              🎯 Best Practices
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Explanation Tab */}
          {activeTab === "explanation" && (
            <div className="space-y-6">
              {/* Main Explanation */}
              {conceptData.explanation && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Understanding the Concept
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {conceptData.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Points */}
              {conceptData.keyPoints && conceptData.keyPoints.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                    Key Points to Remember
                  </h3>
                  <div className="grid gap-3">
                    {conceptData.keyPoints.map((point: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 rounded-lg bg-blue-50 p-3 dark:bg-slate-700"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {typeof point === "string" ? point : point.point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Mermaid Diagram */}
              {conceptData.mermaid && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Concept Overview
                  </h3>
                  <MermaidDiagram diagram={conceptData.mermaid} />
                </div>
              )}
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === "examples" && (
            <div className="space-y-6">
              {conceptData.codeExamples &&
              conceptData.codeExamples.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <Code className="mr-2 h-5 w-5 text-green-500" />
                    Code Examples
                  </h3>
                  {conceptData.codeExamples.map(
                    (example: any, index: number) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-600"
                      >
                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                        <div
                          className="flex cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-700"
                          onClick={() =>
                            setExpandedExample(
                              expandedExample === index ? null : index
                            )
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            setExpandedExample(
                              expandedExample === index ? null : index
                            )
                          }
                          role="button"
                          tabIndex={0}
                          aria-expanded={expandedExample === index}
                          aria-label={`${expandedExample === index ? "Collapse" : "Expand"} example: ${example.title}`}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {example.title}
                          </h4>
                          {expandedExample === index ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </div>

                        {expandedExample === index && (
                          <div className="space-y-4 p-4">
                            {example.code && (
                              <CodeBlock
                                code={example.code}
                                language={language.slug}
                                title="Code Example"
                              />
                            )}

                            {example.explanation && (
                              <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {example.explanation}
                                </p>
                              </div>
                            )}

                            {example.mermaid_diagram && (
                              <MermaidDiagram
                                diagram={example.mermaid_diagram}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Code className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No code examples available for this concept yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Best Practices Tab */}
          {activeTab === "practices" && (
            <div className="space-y-6">
              {/* Best Practices */}
              {conceptData.bestPractices &&
                conceptData.bestPractices.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      Best Practices
                    </h3>
                    <div className="space-y-3">
                      {conceptData.bestPractices.map(
                        (practice: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
                          >
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {typeof practice === "string"
                                ? practice
                                : practice.practice}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Common Mistakes */}
              {conceptData.commonMistakes &&
                conceptData.commonMistakes.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                      Common Mistakes to Avoid
                    </h3>
                    <div className="space-y-3">
                      {conceptData.commonMistakes.map(
                        (mistake: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                          >
                            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {typeof mistake === "string"
                                ? mistake
                                : mistake.mistake}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Practice Hints */}
              {conceptData.practiceHints &&
                conceptData.practiceHints.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                      Practice Hints
                    </h3>
                    <div className="space-y-3">
                      {conceptData.practiceHints.map(
                        (hint: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20"
                          >
                            <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {typeof hint === "string" ? hint : hint.hint}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Show message if no practices available */}
              {!conceptData.bestPractices?.length &&
                !conceptData.commonMistakes?.length &&
                !conceptData.practiceHints?.length && (
                  <div className="py-8 text-center">
                    <CheckCircle className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Best practices and guidelines will be available here.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConceptLessonRenderer
