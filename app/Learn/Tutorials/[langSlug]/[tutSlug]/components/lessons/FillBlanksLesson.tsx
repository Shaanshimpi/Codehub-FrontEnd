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

  React.useEffect(() => {
    resetQuestion()
  }, [currentQuestion])

  const resetQuestion = () => {
    setUserAnswers({})
    setShowHints(false)
    setShowSolution(false)
    setIsComplete(false)
    setCheckedBlanks({})
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
    const lines = code.split("\n")

    return lines.map((line, lineIndex) => {
      let modifiedLine = line
      const lineBlanks = blanks.filter((blank) => {
        // Simple position-based blank detection
        const linePosition =
          lines.slice(0, lineIndex).join("\n").length + lineIndex
        return (
          blank.position >= linePosition &&
          blank.position <= linePosition + line.length
        )
      })

      // Replace blanks in reverse order to maintain position accuracy
      lineBlanks.reverse().forEach((blank, _blankIndex) => {
        const globalBlankIndex = blanks.indexOf(blank)
        const status = getBlankStatus(globalBlankIndex)

        if (blank.type === "dropdown" && blank.options) {
          const selectClass = `inline-block mx-1 px-2 py-1 border rounded text-sm ${
            status === "correct"
              ? "bg-green-100 border-green-300 text-green-800"
              : status === "incorrect"
                ? "bg-red-100 border-red-300 text-red-800"
                : "bg-yellow-100 border-yellow-300 text-gray-800"
          }`

          const options = blank.options.map((opt) =>
            typeof opt === "string" ? opt : opt.option
          )

          modifiedLine = modifiedLine.replace(
            "_____",
            `<select class="${selectClass}" data-blank="${globalBlankIndex}">
              <option value="">Choose...</option>
              ${options
                .map(
                  (option) =>
                    `<option value="${option}" ${userAnswers[globalBlankIndex] === option ? "selected" : ""}>
                  ${option}
                </option>`
                )
                .join("")}
            </select>`
          )
        } else {
          const inputClass = `inline-block mx-1 px-2 py-1 border rounded text-sm ${
            status === "correct"
              ? "bg-green-100 border-green-300 text-green-800"
              : status === "incorrect"
                ? "bg-red-100 border-red-300 text-red-800"
                : "bg-yellow-100 border-yellow-300 text-gray-800"
          }`

          modifiedLine = modifiedLine.replace(
            "_____",
            `<input type="text"
              class="${inputClass}"
              placeholder="Fill here"
              data-blank="${globalBlankIndex}"
              value="${userAnswers[globalBlankIndex] || ""}"
              style="width: 120px;"
            />`
          )
        }
      })

      return (
        <div key={lineIndex} className="leading-6">
          <div
            role="presentation"
            dangerouslySetInnerHTML={{ __html: modifiedLine }}
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (target.tagName === "INPUT") {
                const input = target as HTMLInputElement
                const blankIndex = parseInt(input.dataset.blank || "0")
                input.addEventListener("input", (event) => {
                  const inputTarget = event.target as HTMLInputElement
                  handleAnswerChange(blankIndex, inputTarget.value)
                })
              } else if (target.tagName === "SELECT") {
                const select = target as HTMLSelectElement
                const blankIndex = parseInt(select.dataset.blank || "0")
                select.addEventListener("change", (event) => {
                  const selectTarget = event.target as HTMLSelectElement
                  handleAnswerChange(blankIndex, selectTarget.value)
                })
              }
            }}
          />
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
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
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
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
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
          <div className="overflow-x-auto rounded-lg bg-gray-900 p-4">
            <pre className="text-sm text-gray-100">
              <code>
                {renderCodeWithBlanks(currentQ.code, currentQ.blanks)}
              </code>
            </pre>
          </div>
        </div>

        {/* Fill in the Blanks Form */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Fill in the blanks:
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentQ.blanks.map((blank, index) => {
              const status = getBlankStatus(index)
              return (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blank {index + 1}:
                    {blank.hint && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        💡 {blank.hint}
                      </span>
                    )}
                  </label>

                  {blank.type === "dropdown" && blank.options ? (
                    <select
                      value={userAnswers[index] || ""}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      className={`w-full rounded-lg border px-3 py-2 ${
                        status === "correct"
                          ? "border-green-300 bg-green-50 text-green-800"
                          : status === "incorrect"
                            ? "border-red-300 bg-red-50 text-red-800"
                            : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
                      }`}
                    >
                      <option value="">Choose an option...</option>
                      {blank.options.map((option, optIndex) => {
                        const optionText =
                          typeof option === "string" ? option : option.option
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
                      value={userAnswers[index] || ""}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      placeholder="Enter your answer"
                      className={`w-full rounded-lg border px-3 py-2 ${
                        status === "correct"
                          ? "border-green-300 bg-green-50 text-green-800"
                          : status === "incorrect"
                            ? "border-red-300 bg-red-50 text-red-800"
                            : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
                      }`}
                    />
                  )}

                  {status === "incorrect" && blank.explanation && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {blank.explanation}
                    </p>
                  )}
                </div>
              )
            })}
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
              <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
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
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
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
                    <div className="mb-2 rounded bg-gray-900 p-3">
                      <pre className="overflow-x-auto text-sm text-gray-100">
                        <code>{currentQ.solution.completeCode}</code>
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
          <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
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
