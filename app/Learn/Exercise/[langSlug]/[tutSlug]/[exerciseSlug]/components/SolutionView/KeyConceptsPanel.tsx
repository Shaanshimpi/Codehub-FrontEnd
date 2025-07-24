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
  Zap,
} from "lucide-react"

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Master the fundamental programming concepts used in this exercise
        </p>
      </div>

      {/* Learning Objectives */}
      {objectives && objectives.length > 0 && (
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-sky-50 p-6 dark:from-blue-900/20 dark:to-sky-900/20">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Learning Objectives Achieved
            </h4>
          </div>
          <div className="space-y-3">
            {objectives.map((objective: any, index: number) => (
              <div
                key={objective.id || index}
                className="flex items-start gap-3"
              >
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
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
                <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300">
                  {objective.objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Programming Tags */}
      {tags && tags.length > 0 && (
        <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-6 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200">
              Programming Topics
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tagObj: any, index: number) => (
              <span
                key={tagObj.id || index}
                className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
              >
                <Zap className="h-3 w-3" />
                {tagObj.tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Core Concepts */}
      {concepts && concepts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Core Programming Concepts
            </h4>
          </div>

          <div className="space-y-3">
            {concepts.map((concept: any, index: number) => (
              <div
                key={concept.name || index}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
              >
                <button
                  onClick={() => toggleConcept(index)}
                  className="w-full p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 dark:text-white">
                          {concept.name}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Click to learn more
                        </p>
                      </div>
                    </div>
                    {expandedConcept === index ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {expandedConcept === index && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                    <div className="space-y-4">
                      <div>
                        <h6 className="mb-2 font-medium text-slate-900 dark:text-white">
                          Description
                        </h6>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {concept.description}
                        </p>
                      </div>

                      {concept.visual_metaphor && (
                        <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:from-yellow-900/20 dark:to-orange-900/20">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <span className="text-lg">💭</span>
                            </div>
                            <div>
                              <h6 className="mb-1 font-medium text-orange-800 dark:text-orange-200">
                                Think of it like this:
                              </h6>
                              <p className="text-sm italic text-orange-700 dark:text-orange-300">
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Core Programming Concepts
            </h4>
          </div>
        </div>
      )}
    </div>
  )
}

export default KeyConceptsPanel
