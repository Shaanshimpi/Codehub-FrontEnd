// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/KeyConceptsPanel.tsx
"use client"

import React, { useState } from "react"
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Tag,
  Target,
} from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/KeyConceptsPanel.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/KeyConceptsPanel.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/KeyConceptsPanel.tsx

interface KeyConceptsPanelProps {
  concepts: any[]
  tags: any[]
  objectives: any[]
  title?: string
}

const KeyConceptsPanel: React.FC<KeyConceptsPanelProps> = ({
  concepts,
  tags,
  objectives,
  title = "Key Concepts",
}) => {
  const [expandedConcept, setExpandedConcept] = useState<number | null>(0)

  const toggleConcept = (index: number) => {
    setExpandedConcept(expandedConcept === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-black dark:text-white">
          {title}
        </h3>
        <p className="text-sm font-medium text-black dark:text-white">
          Master the fundamental programming concepts used in this exercise
        </p>
      </div>

      {/* Learning Objectives */}
      {objectives && objectives.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-white p-3 shadow-lg dark:border-blue-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black">
              <Target className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100">
              Learning Objectives Achieved
            </h4>
          </div>
          <div className="space-y-2">
            {objectives.map((objective: any, index: number) => (
              <div
                key={
                  typeof objective === "string"
                    ? `${objective}-${index}`
                    : objective.id || index
                }
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium leading-relaxed text-black dark:text-white">
                  {typeof objective === "string"
                    ? objective
                    : objective.objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Programming Tags */}
      {tags && tags.length > 0 && (
        <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black">
              <Tag className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-black dark:text-white">
              Programming Topics
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag: any, index: number) => (
              <span
                key={
                  typeof tag === "string" ? `${tag}-${index}` : tag.id || index
                }
                className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-100"
              >
                {typeof tag === "string" ? tag : tag.tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Core Concepts */}
      {concepts && concepts.length > 0 ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black">
                <Brain className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-black dark:text-white">
                Core Programming Concepts
              </h4>
            </div>
          </div>

          <div className="space-y-2">
            {concepts.map((concept: any, index: number) => (
              <div
                key={concept.name || index}
                className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-900"
              >
                <button
                  onClick={() => toggleConcept(index)}
                  className="w-full p-3 text-left transition-colors hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white shadow-sm dark:bg-white dark:text-black">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-black dark:text-white">
                          {concept.name}
                        </h5>
                        <p className="text-xs font-medium text-black dark:text-white">
                          Click to learn more
                        </p>
                      </div>
                    </div>
                    {expandedConcept === index ? (
                      <ChevronUp className="h-5 w-5 text-black dark:text-white" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-black dark:text-white" />
                    )}
                  </div>
                </button>

                {expandedConcept === index && (
                  <div className="border-t border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-black">
                    <div className="space-y-3">
                      <div>
                        <h6 className="mb-2 font-bold text-black dark:text-white">
                          Description
                        </h6>
                        <p className="text-sm font-medium leading-relaxed text-black dark:text-white">
                          {concept.description}
                        </p>
                      </div>

                      {concept.visual_metaphor && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <span className="text-lg">💭</span>
                            </div>
                            <div>
                              <h6 className="mb-1 font-bold text-blue-900 dark:text-blue-100">
                                Think of it like this:
                              </h6>
                              <p className="text-sm font-medium italic text-black dark:text-white">
                                {concept.visual_metaphor}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Fallback when no concepts are provided */
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-black p-1 text-white shadow-sm dark:bg-white dark:text-black">
                <Brain className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-black dark:text-white">
                Core Programming Concepts
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KeyConceptsPanel
