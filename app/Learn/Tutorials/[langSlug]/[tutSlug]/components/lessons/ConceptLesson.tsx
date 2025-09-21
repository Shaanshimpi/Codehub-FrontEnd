"use client"

import React, { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import MermaidRenderer from "../MermaidRenderer"

interface ConceptData {
  explanation: string
  keyPoints?: Array<{ point: string } | string>
  codeExamples?: Array<{
    title: string
    code: string
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

const ConceptLesson: React.FC<ConceptLessonProps> = ({ data, lessonTitle }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
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
      <div className="my-6">
        <MermaidRenderer code={code} theme={theme} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Explanation */}
      {data.explanation && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            📝 Explanation
          </h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {data.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Main Mermaid Diagram */}
      {data.mermaid_code && renderMermaidDiagram(data.mermaid_code)}

      {/* Key Points */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            💡 Key Points
          </h3>
          <ul className="space-y-3">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1 text-lg text-blue-500">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {typeof point === "string" ? point : point.point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Examples */}
      {data.codeExamples && data.codeExamples.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            💻 Code Examples
          </h3>
          <div className="space-y-6">
            {data.codeExamples.map((example, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Example {index + 1}: {example.title}
                  </h4>
                </div>
                <div className="p-4">
                  {/* Code Block */}
                  <div className="mb-4 rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-sm text-gray-100">
                      <code>{example.code}</code>
                    </pre>
                  </div>

                  {/* Explanation */}
                  {example.explanation && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {example.explanation}
                      </p>
                    </div>
                  )}

                  {/* Example Mermaid Diagram */}
                  {example.mermaid_code &&
                    renderMermaidDiagram(example.mermaid_code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {data.commonMistakes && data.commonMistakes.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("mistakes")}
            className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30"
          >
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
              ⚠️ Common Mistakes
            </h3>
            <span className="text-red-600 dark:text-red-400">
              {expandedSections.includes("mistakes") ? "−" : "+"}
            </span>
          </button>
          {expandedSections.includes("mistakes") && (
            <div className="mt-4 space-y-3">
              {data.commonMistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-red-500">⚠️</span>
                    <span className="text-red-800 dark:text-red-200">
                      {typeof mistake === "string" ? mistake : mistake.mistake}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Best Practices */}
      {data.bestPractices && data.bestPractices.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("practices")}
            className="flex w-full items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30"
          >
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              ✅ Best Practices
            </h3>
            <span className="text-green-600 dark:text-green-400">
              {expandedSections.includes("practices") ? "−" : "+"}
            </span>
          </button>
          {expandedSections.includes("practices") && (
            <div className="mt-4 space-y-3">
              {data.bestPractices.map((practice, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-green-500">✅</span>
                    <span className="text-green-800 dark:text-green-200">
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

      {/* Practice Hints */}
      {data.practiceHints && data.practiceHints.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection("hints")}
            className="flex w-full items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              💡 Practice Hints
            </h3>
            <span className="text-blue-600 dark:text-blue-400">
              {expandedSections.includes("hints") ? "−" : "+"}
            </span>
          </button>
          {expandedSections.includes("hints") && (
            <div className="mt-4 space-y-3">
              {data.practiceHints.map((hint, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-blue-500">💡</span>
                    <span className="text-blue-800 dark:text-blue-200">
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
