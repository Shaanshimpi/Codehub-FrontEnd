"use client"

import React, { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import MermaidRenderer from "../MermaidRenderer"
import { Icon } from "../ui"

interface Blank {
  position: number
  type: string
  correctAnswer: string
  options?: Array<{ option: string } | string>
  hint: string
  explanation: string
}

interface Solution {
  completeCode: string
  explanation: string
  mermaid_code?: Array<{ code: string } | string>
}

interface FillBlanksQuestion {
  scenario: string
  code: string
  mermaid_code?: Array<{ code: string } | string>
  blanks: Blank[]
  hints: Array<{ hint: string } | string>
  solution?: Solution
  difficulty: string
}

interface FillBlanksData {
  questions: FillBlanksQuestion[]
}

interface FillBlanksLessonProps {
  data: FillBlanksData
  lessonTitle: string
}

const FillBlanksLesson: React.FC<FillBlanksLessonProps> = ({
  data,
  lessonTitle: _lessonTitle,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const theme = useTheme()
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [checkedBlanks, setCheckedBlanks] = useState<{
    [key: number]: boolean
  }>({})
  const [activeHint, setActiveHint] = useState<number | null>(null)

  React.useEffect(() => {
    resetQuestion()
    // Scroll to top when question changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentQuestion])

  const resetQuestion = () => {
    setUserAnswers({})
    setShowHints(false)
    setShowSolution(false)
    setIsComplete(false)
    setCheckedBlanks({})
    setActiveHint(null)
  }

  const handleAnswerChange = (blankIndex: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [blankIndex]: value,
    }))
  }

  const checkSolution = () => {
    const currentQ = data.questions[currentQuestion]
    const allCorrect = currentQ.blanks.every((blank, index) => {
      const userAnswer = userAnswers[index]?.trim().toLowerCase()
      const correctAnswer = blank.correctAnswer.trim().toLowerCase()
      return userAnswer === correctAnswer
    })

    if (allCorrect) {
      setIsComplete(true)
      setCheckedBlanks(
        currentQ.blanks.reduce(
          (acc, _, index) => ({ ...acc, [index]: true }),
          {}
        )
      )
    } else {
      // Mark individual blanks as correct/incorrect
      const newCheckedBlanks: { [key: number]: boolean } = {}
      currentQ.blanks.forEach((blank, index) => {
        const userAnswer = userAnswers[index]?.trim().toLowerCase()
        const correctAnswer = blank.correctAnswer.trim().toLowerCase()
        newCheckedBlanks[index] = userAnswer === correctAnswer
      })
      setCheckedBlanks(newCheckedBlanks)
      setShowSolution(true)
    }
  }

  const getBlankStatus = (blankIndex: number) => {
    if (!Object.prototype.hasOwnProperty.call(checkedBlanks, blankIndex))
      return "default"
    return checkedBlanks[blankIndex] ? "correct" : "incorrect"
  }

  const handleNextQuestion = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const renderCodeWithBlanks = (code: string, blanks: Blank[]) => {
    // Use {{blank1}}, {{blank2}}, etc. as placeholders in the code
    const lines = code.split("\n")

    return lines.map((line, lineIndex) => {
      const parts: React.ReactNode[] = []
      let partIndex = 0

      // Find all {{blankN}} patterns in the line
      const blankPattern = /\{\{blank(\d+)\}\}/g
      let match
      let lastIndex = 0

      while ((match = blankPattern.exec(line)) !== null) {
        const blankNumber = parseInt(match[1])
        const blankIndex = blankNumber - 1 // Convert to 0-based index

        // Add text before the blank
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${lineIndex}-${partIndex++}`}>
              {line.substring(lastIndex, match.index)}
            </span>
          )
        }

        // Add the blank input/select with hint button
        if (blankIndex < blanks.length) {
          const blank = blanks[blankIndex]
          const status = getBlankStatus(blankIndex)

          parts.push(
            <span
              key={`blank-${lineIndex}-${blankIndex}`}
              className="relative inline-flex items-center gap-1"
            >
              {blank.type === "dropdown" && blank.options ? (
                <select
                  value={userAnswers[blankIndex] || ""}
                  onChange={(e) =>
                    handleAnswerChange(blankIndex, e.target.value)
                  }
                  className={`inline-block rounded border px-2 py-1 text-sm ${
                    status === "correct"
                      ? "border-green-400 bg-green-100 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-100"
                      : status === "incorrect"
                        ? "border-red-400 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-100"
                        : "border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  <option value="">Choose...</option>
                  {blank.options.map((opt, optIndex) => {
                    const optionText =
                      typeof opt === "string" ? opt : opt.option
                    return (
                      <option key={optIndex} value={optionText}>
                        {optionText}
                      </option>
                    )
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  value={userAnswers[blankIndex] || ""}
                  onChange={(e) =>
                    handleAnswerChange(blankIndex, e.target.value)
                  }
                  placeholder="Fill here"
                  className={`inline-block w-28 rounded border px-2 py-1 text-sm ${
                    status === "correct"
                      ? "border-green-400 bg-green-100 text-green-900 dark:border-green-600 dark:bg-green-900/30 dark:text-green-100"
                      : status === "incorrect"
                        ? "border-red-400 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900/30 dark:text-red-100"
                        : "border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                />
              )}
              {blank.hint && (
                <span className="relative inline-flex">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHint(
                        activeHint === blankIndex ? null : blankIndex
                      )
                    }
                    onMouseEnter={() => setActiveHint(blankIndex)}
                    onMouseLeave={() => setActiveHint(null)}
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    i
                  </button>
                  {activeHint === blankIndex && (
                    <div className="absolute left-0 top-full z-10 mt-1 max-w-xs rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 shadow-lg dark:border-blue-700 dark:bg-blue-900/90 dark:text-blue-100 sm:w-64">
                      <div className="font-medium">💡 Hint:</div>
                      <div className="mt-1 whitespace-normal break-words">
                        {blank.hint}
                      </div>
                    </div>
                  )}
                </span>
              )}
            </span>
          )
        }

        lastIndex = match.index + match[0].length
      }

      // Add remaining text after last blank
      if (lastIndex < line.length) {
        parts.push(
          <span key={`text-${lineIndex}-end`}>{line.substring(lastIndex)}</span>
        )
      }

      // If no blanks were found, just render the line
      if (parts.length === 0) {
        parts.push(<span key={`line-${lineIndex}`}>{line}</span>)
      }

      return (
        <div key={lineIndex} className="leading-7">
          {parts}
        </div>
      )
    })
  }

  const renderMermaidDiagram = (
    mermaidCode: Array<{ code: string } | string>
  ) => {
    if (!mermaidCode || mermaidCode.length === 0) return null

    const code =
      typeof mermaidCode[0] === "string" ? mermaidCode[0] : mermaidCode[0].code

    return (
      <div className="my-4">
        <MermaidRenderer code={code} theme={theme} />
      </div>
    )
  }

  if (!data.questions.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No fill-in-the-blanks questions available.
        </p>
      </div>
    )
  }

  const currentQ = data.questions[currentQuestion]
  const allBlanksFilled = currentQ.blanks.every((_, index) =>
    userAnswers[index]?.trim()
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Bar */}
      <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Question {currentQuestion + 1} of {data.questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Difficulty: {currentQ.difficulty}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / data.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          ✏️ Fill in the Blanks: Complete the Program
        </h3>

        {/* Scenario */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            📋 Scenario:
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {currentQ.scenario}
          </p>
        </div>

        {/* Mermaid Diagram */}
        {currentQ.mermaid_code && renderMermaidDiagram(currentQ.mermaid_code)}

        {/* Interactive Code Template */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            💻 Code Template:
          </h4>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            Fill in the blanks directly in the code. Hover or click the{" "}
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              i
            </span>{" "}
            button for hints.
          </p>
          <div className="overflow-x-auto rounded-lg bg-gray-900 p-3 sm:p-4">
            <pre className="text-sm text-gray-100">
              <code className="block">
                {renderCodeWithBlanks(currentQ.code, currentQ.blanks)}
              </code>
            </pre>
          </div>
        </div>

        {/* Hints */}
        {currentQ.hints && currentQ.hints.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-800 transition-colors hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:hover:bg-yellow-900/30"
            >
              💡 {showHints ? "Hide" : "Show"} Hints
            </button>
            {showHints && (
              <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20 sm:p-4">
                <ul className="space-y-2">
                  {currentQ.hints.map((hint, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-yellow-600 dark:text-yellow-400">
                        •
                      </span>
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        {typeof hint === "string" ? hint : hint.hint}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={checkSolution}
            disabled={!allBlanksFilled || isComplete}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Solution
          </button>
          <button
            onClick={resetQuestion}
            className="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Success Message */}
        {isComplete && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-green-500">🎉</span>
              <div>
                <h4 className="mb-2 font-medium text-green-900 dark:text-green-100">
                  Excellent! Perfect Solution!
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You&apos;ve correctly filled in all the blanks. Great job!
                </p>
                {currentQ.solution && (
                  <div className="mt-4">
                    <h5 className="mb-2 font-medium text-green-900 dark:text-green-100">
                      Complete Solution:
                    </h5>
                    <div className="mb-2 overflow-x-auto rounded bg-gray-900 p-3">
                      <pre className="text-sm text-gray-100">
                        <code className="block">
                          {currentQ.solution.completeCode}
                        </code>
                      </pre>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {currentQ.solution.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Solution Display */}
        {showSolution && !isComplete && (
          <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-orange-500">💡</span>
              <div>
                <h4 className="mb-2 font-medium text-orange-900 dark:text-orange-100">
                  Some answers need correction:
                </h4>
                <div className="mb-3 space-y-2">
                  {currentQ.blanks.map((blank, index) => {
                    const isCorrect = getBlankStatus(index) === "correct"
                    if (isCorrect) return null

                    return (
                      <div key={index} className="text-sm">
                        <span className="text-orange-800 dark:text-orange-200">
                          Blank {index + 1}:{" "}
                          <code className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
                            {blank.correctAnswer}
                          </code>
                        </span>
                        {blank.explanation && (
                          <div className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                            {blank.explanation}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Review the corrections above and try again!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="space-y-4">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 dark:bg-green-900/30">
            <Icon name="edit" className="text-green-600" size="sm" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Question {currentQuestion + 1} of {data.questions.length}
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex min-h-[48px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Icon name="chevronLeft" size="sm" />
            <span className="hidden sm:inline">Previous Question</span>
            <span className="sm:hidden">Previous</span>
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestion >= data.questions.length - 1}
            className="flex min-h-[48px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="hidden sm:inline">Next Question</span>
            <span className="sm:hidden">Next</span>
            <Icon name="chevronRight" size="sm" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FillBlanksLesson
