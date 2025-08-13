"use client"

import React from "react"
import { Language, Tutorial } from "../../../../types/TutorialTypes"

interface ReferenceContentProps {
  reference: any
  tutorial: Tutorial
  language: Language
}

const ReferenceContent = ({
  reference,
  tutorial,
  language,
}: ReferenceContentProps) => {
  if (!reference) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {reference.title || `${tutorial.title} Reference`}
            </h2>
            {reference.subtitle && (
              <p className="mt-1 text-sm text-gray-600">{reference.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {/* Introduction */}
        {reference.introduction && (
          <div className="prose max-w-none">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Introduction
            </h3>
            <p className="leading-relaxed text-gray-700">
              {reference.introduction}
            </p>
          </div>
        )}

        {/* Syntax Guide */}
        {reference.syntax_guide && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Syntax</h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {reference.syntax_guide.basic_syntax}
              </pre>
            </div>

            {reference.syntax_guide.parameters &&
              reference.syntax_guide.parameters.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 font-medium text-gray-900">
                    Parameters:
                  </h4>
                  <div className="space-y-2">
                    {reference.syntax_guide.parameters.map(
                      (param: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 text-sm"
                        >
                          <span
                            className={`rounded px-2 py-1 font-mono text-xs ${
                              param.required
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {param.name}
                          </span>
                          <div>
                            <p className="text-gray-700">{param.description}</p>
                            {param.required && (
                              <span className="text-xs text-red-600">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Examples */}
        {reference.examples && reference.examples.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Examples
            </h3>
            <div className="space-y-6">
              {reference.examples.map((example: any, index: number) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h4 className="font-medium text-gray-900">
                      {example.title}
                    </h4>
                    {example.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {example.description}
                      </p>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-4 rounded-lg bg-gray-900 p-4">
                      <pre className="overflow-x-auto text-sm text-gray-100">
                        <code>{example.code}</code>
                      </pre>
                    </div>

                    {example.output && (
                      <div className="mb-3">
                        <h5 className="mb-2 text-sm font-medium text-gray-700">
                          Output:
                        </h5>
                        <div className="rounded border border-green-200 bg-green-50 p-3">
                          <pre className="whitespace-pre-wrap text-sm text-green-800">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700">{example.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Points */}
        {reference.key_points && reference.key_points.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Key Points
            </h3>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <ul className="space-y-2">
                {reference.key_points.map((point: any, index: number) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-3 mt-0.5 text-blue-500">•</span>
                    <span className="text-blue-900">
                      {typeof point === "string" ? point : point.point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {reference.common_mistakes && reference.common_mistakes.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Common Mistakes
            </h3>
            <div className="space-y-4">
              {reference.common_mistakes.map((mistake: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 bg-red-50 p-4"
                >
                  <h4 className="mb-2 font-medium text-red-900">
                    ❌ {mistake.mistake}
                  </h4>
                  <p className="mb-2 text-sm text-red-800">
                    <strong>{`Why it's wrong:`}</strong> {mistake.why_wrong}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Correct approach:</strong>{" "}
                    {mistake.correct_approach}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferenceContent
