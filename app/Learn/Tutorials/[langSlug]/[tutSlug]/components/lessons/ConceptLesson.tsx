"use client"

import React, { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import MermaidRenderer from "../MermaidRenderer"
import { Badge, Button, Icon } from "../ui"

interface ConceptData {
  explanation: string
  keyPoints?: Array<{ point: string } | string>
  codeExamples?: Array<{
    title: string
    description?: string
    code: string
    output?: string
    explanation: string
    mermaid_code?: Array<{ code: string } | string>
  }>
  practiceHints?: Array<{ hint: string } | string>
  mermaid_code?: Array<{ code: string } | string>
  commonMistakes?: Array<{ mistake: string } | string>
  bestPractices?: Array<{ practice: string } | string>
}

interface ConceptLessonProps {
  data: ConceptData
  lessonTitle: string
}

const ConceptLesson: React.FC<ConceptLessonProps> = ({
  data,
  lessonTitle: _lessonTitle,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const theme = useTheme()

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const renderMermaidDiagram = (
    mermaidCode: Array<{ code: string } | string>
  ) => {
    if (!mermaidCode || mermaidCode.length === 0) return null

    const code =
      typeof mermaidCode[0] === "string" ? mermaidCode[0] : mermaidCode[0].code

    return (
      <div className="my-4 lg:my-6">
        <MermaidRenderer code={code} theme={theme} />
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Main Explanation - Enhanced */}
      {data.explanation && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20 sm:p-4 lg:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100 sm:text-xl">
            <Icon
              name="book"
              className="text-blue-600 dark:text-blue-400"
              size="sm"
            />
            Explanation
          </h3>
          <div className="prose prose-sm prose-blue dark:prose-invert sm:prose-base max-w-none">
            <p className="leading-relaxed text-blue-800 dark:text-blue-200">
              {data.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Main Mermaid Diagram */}
      {data.mermaid_code &&
        data.mermaid_code.length > 0 &&
        renderMermaidDiagram(data.mermaid_code)}

      {/* Key Points - Responsive Grid */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl lg:mb-4">
            <Icon name="star" className="text-yellow-500" size="sm" />
            Key Points
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
            {data.keyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20 lg:p-4"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  {index + 1}
                </div>
                <span className="text-sm text-yellow-800 dark:text-yellow-200 sm:text-base">
                  {typeof point === "string" ? point : point.point}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Code Examples - Like Reference Design */}
      {data.codeExamples && data.codeExamples.length > 0 && (
        <div className="space-y-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg">
              <Icon name="code" size="md" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Interactive Code Examples
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Practice with real working code
              </p>
            </div>
          </div>

          {data.codeExamples.length > 1 ? (
            <div className="space-y-6">
              {/* Example Navigation */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">
                    Example {currentExampleIndex + 1} of{" "}
                    {data.codeExamples.length}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Use arrows to navigate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentExampleIndex(
                        Math.max(0, currentExampleIndex - 1)
                      )
                    }
                    disabled={currentExampleIndex === 0}
                    icon={<Icon name="chevronLeft" size="sm" />}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentExampleIndex(
                        Math.min(
                          data.codeExamples.length - 1,
                          currentExampleIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentExampleIndex >= data.codeExamples.length - 1
                    }
                    icon={<Icon name="chevronRight" size="sm" />}
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Current Example */}
              {(() => {
                const example = data.codeExamples[currentExampleIndex]
                if (!example) return null

                return (
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    {/* Enhanced Example Header */}
                    <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 px-4 py-6 dark:border-gray-700 dark:from-green-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            Example {currentExampleIndex + 1}: {example.title}
                          </h4>
                          {example.description && (
                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                              {example.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="info"
                          size="sm"
                          className="ml-4 flex-shrink-0"
                        >
                          Interactive
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 sm:p-6 lg:p-8">
                      {/* Responsive Layout - Stack on mobile, side-by-side on larger screens */}
                      <div className="space-y-6 lg:space-y-8">
                        {/* Code Section */}
                        <div className="space-y-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                              <Icon
                                name="code"
                                className="text-green-500"
                                size="sm"
                              />
                              Source Code
                            </h5>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(example.code)
                              }
                              icon={<Icon name="bookmark" size="sm" />}
                              className="w-fit"
                            >
                              Copy Code
                            </Button>
                          </div>
                          <div className="rounded-xl bg-gray-900 p-4 shadow-inner sm:p-6">
                            <pre className="overflow-x-auto text-sm leading-relaxed text-gray-100 sm:text-base">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        </div>

                        {/* Diagram Section */}
                        {example.mermaid_code &&
                          example.mermaid_code.length > 0 && (
                            <div className="space-y-4">
                              <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <Icon
                                  name="puzzle"
                                  className="text-purple-500"
                                  size="sm"
                                />
                                Visual Flow
                              </h5>
                              <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
                                <MermaidRenderer
                                  code={
                                    Array.isArray(example.mermaid_code)
                                      ? typeof example.mermaid_code[0] ===
                                        "string"
                                        ? example.mermaid_code[0]
                                        : example.mermaid_code[0]?.code || ""
                                      : typeof example.mermaid_code === "string"
                                        ? example.mermaid_code
                                        : example.mermaid_code?.code || ""
                                  }
                                  theme={theme}
                                />
                              </div>
                            </div>
                          )}

                        {/* Output and Explanation Grid */}
                        <div className="grid gap-6 lg:grid-cols-2">
                          {/* Output Section */}
                          {example.output && (
                            <div className="space-y-4">
                              <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <Icon
                                  name="chevronRight"
                                  className="text-blue-500"
                                  size="sm"
                                />
                                Expected Output
                              </h5>
                              <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm dark:border-green-800 dark:bg-green-900/20 sm:p-6">
                                <pre className="overflow-x-auto text-sm leading-relaxed text-green-800 dark:text-green-200 sm:text-base">
                                  <code>{example.output}</code>
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* Explanation Section */}
                          {example.explanation && (
                            <div className="space-y-4">
                              <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                                <Icon
                                  name="star"
                                  className="text-blue-500"
                                  size="sm"
                                />
                                Explanation
                              </h5>
                              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800 dark:bg-blue-900/20 sm:p-6">
                                <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200 sm:text-base">
                                  {example.explanation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Enhanced Example Indicators */}
              <div className="flex justify-center space-x-3">
                {data.codeExamples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExampleIndex(index)}
                    className={`h-3 w-12 rounded-full transition-all duration-300 ${
                      index === currentExampleIndex
                        ? "scale-110 bg-gradient-to-r from-blue-500 to-green-500 shadow-lg"
                        : "bg-gray-300 hover:scale-105 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Go to example ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Single Example - Enhanced Layout */
            (() => {
              const example = data.codeExamples[0]
              return (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {/* Enhanced Example Header */}
                  <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 px-4 py-6 dark:border-gray-700 dark:from-green-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                          {example.title}
                        </h4>
                        {example.description && (
                          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {example.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="info"
                        size="sm"
                        className="ml-4 flex-shrink-0"
                      >
                        Interactive
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 sm:p-6 lg:p-8">
                    <div className="space-y-6 lg:space-y-8">
                      {/* Code Section */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <Icon
                              name="code"
                              className="text-green-500"
                              size="sm"
                            />
                            Source Code
                          </h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(example.code)
                            }
                            icon={<Icon name="bookmark" size="sm" />}
                            className="w-fit"
                          >
                            Copy Code
                          </Button>
                        </div>
                        <div className="rounded-xl bg-gray-900 p-4 shadow-inner sm:p-6">
                          <pre className="overflow-x-auto text-sm leading-relaxed text-gray-100 sm:text-base">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Diagram Section */}
                      {example.mermaid_code &&
                        example.mermaid_code.length > 0 && (
                          <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                              <Icon
                                name="puzzle"
                                className="text-purple-500"
                                size="sm"
                              />
                              Visual Flow
                            </h5>
                            <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
                              <MermaidRenderer
                                code={
                                  Array.isArray(example.mermaid_code)
                                    ? typeof example.mermaid_code[0] ===
                                      "string"
                                      ? example.mermaid_code[0]
                                      : example.mermaid_code[0]?.code || ""
                                    : typeof example.mermaid_code === "string"
                                      ? example.mermaid_code
                                      : example.mermaid_code?.code || ""
                                }
                                theme={theme}
                              />
                            </div>
                          </div>
                        )}

                      {/* Output and Explanation Grid */}
                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* Output Section */}
                        {example.output && (
                          <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                              <Icon
                                name="chevronRight"
                                className="text-blue-500"
                                size="sm"
                              />
                              Expected Output
                            </h5>
                            <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm dark:border-green-800 dark:bg-green-900/20 sm:p-6">
                              <pre className="overflow-x-auto text-sm leading-relaxed text-green-800 dark:text-green-200 sm:text-base">
                                <code>{example.output}</code>
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Explanation Section */}
                        {example.explanation && (
                          <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                              <Icon
                                name="star"
                                className="text-blue-500"
                                size="sm"
                              />
                              Explanation
                            </h5>
                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800 dark:bg-blue-900/20 sm:p-6">
                              <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200 sm:text-base">
                                {example.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()
          )}
        </div>
      )}

      {/* Common Mistakes - Enhanced Accordion */}
      {data.commonMistakes && data.commonMistakes.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("mistakes")}
            className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition-all duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30"
            aria-expanded={expandedSections.includes("mistakes")}
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-900 dark:text-red-100 sm:text-xl">
              <Icon name="x" className="text-red-500" size="sm" />
              Common Mistakes
              <span className="ml-2 rounded-full bg-red-200 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-300">
                {data.commonMistakes.length}
              </span>
            </h3>
            <Icon
              name={
                expandedSections.includes("mistakes") ? "x" : "chevronRight"
              }
              className={`text-red-600 transition-transform duration-200 dark:text-red-400 ${
                expandedSections.includes("mistakes") ? "rotate-180" : ""
              }`}
              size="sm"
            />
          </button>
          {expandedSections.includes("mistakes") && (
            <div className="mt-3 space-y-3 lg:mt-4">
              {data.commonMistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20 lg:p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200 text-xs font-bold text-red-700 dark:bg-red-800 dark:text-red-300">
                      {index + 1}
                    </div>
                    <span className="text-sm text-red-800 dark:text-red-200 sm:text-base">
                      {typeof mistake === "string" ? mistake : mistake.mistake}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Best Practices - Enhanced Accordion */}
      {data.bestPractices && data.bestPractices.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("practices")}
            className="flex w-full items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition-all duration-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30"
            aria-expanded={expandedSections.includes("practices")}
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900 dark:text-green-100 sm:text-xl">
              <Icon name="check" className="text-green-500" size="sm" />
              Best Practices
              <span className="ml-2 rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-800 dark:text-green-300">
                {data.bestPractices.length}
              </span>
            </h3>
            <Icon
              name={
                expandedSections.includes("practices") ? "x" : "chevronRight"
              }
              className={`text-green-600 transition-transform duration-200 dark:text-green-400 ${
                expandedSections.includes("practices") ? "rotate-180" : ""
              }`}
              size="sm"
            />
          </button>
          {expandedSections.includes("practices") && (
            <div className="mt-3 space-y-3 lg:mt-4">
              {data.bestPractices.map((practice, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20 lg:p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-700 dark:bg-green-800 dark:text-green-300">
                      ✓
                    </div>
                    <span className="text-sm text-green-800 dark:text-green-200 sm:text-base">
                      {typeof practice === "string"
                        ? practice
                        : practice.practice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Practice Hints - Enhanced Accordion */}
      {data.practiceHints && data.practiceHints.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("hints")}
            className="flex w-full items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
            aria-expanded={expandedSections.includes("hints")}
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100 sm:text-xl">
              <Icon name="star" className="text-blue-500" size="sm" />
              Practice Hints
              <span className="ml-2 rounded-full bg-blue-200 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                {data.practiceHints.length}
              </span>
            </h3>
            <Icon
              name={expandedSections.includes("hints") ? "x" : "chevronRight"}
              className={`text-blue-600 transition-transform duration-200 dark:text-blue-400 ${
                expandedSections.includes("hints") ? "rotate-180" : ""
              }`}
              size="sm"
            />
          </button>
          {expandedSections.includes("hints") && (
            <div className="mt-3 space-y-3 lg:mt-4">
              {data.practiceHints.map((hint, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20 lg:p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                      💡
                    </div>
                    <span className="text-sm text-blue-800 dark:text-blue-200 sm:text-base">
                      {typeof hint === "string" ? hint : hint.hint}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ConceptLesson
