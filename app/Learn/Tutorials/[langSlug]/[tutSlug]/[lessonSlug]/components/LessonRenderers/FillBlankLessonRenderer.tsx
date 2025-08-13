"use client"

import React, { useState } from "react"
import {
  CheckCircle,
  Edit3,
  Eye,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react"
import {
  Language,
  TutorialLesson,
} from "../../../../../../../types/TutorialTypes"
import CodeBlock from "./shared/CodeBlock"
import MermaidDiagram from "./shared/MermaidDiagram"

interface FillBlankLessonRendererProps {
  lesson: TutorialLesson
  fibData: any // From server Tutorial.ts fibData structure
  language: Language
}

interface BlankAnswer {
  position: number
  userAnswer: string
  isCorrect?: boolean
}

interface QuestionState {
  userAnswers: Record<number, string>
  isCompleted: boolean
  score: number
  showHints: boolean
  showSolution: boolean
}

const FillBlankLessonRenderer = ({
  lesson,
  fibData,
  language,
}: FillBlankLessonRendererProps) => {
  const [questionStates, setQuestionStates] = useState<
    Record<number, QuestionState>
  >({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // Initialize hook-dependent variables
  const questions = fibData?.questions || []
  const totalQuestions = questions.length
  const currentQuestionData = questions[currentQuestion]

  const initializeQuestionState = (questionIndex: number) => {
    if (!questionStates[questionIndex]) {
      setQuestionStates((prev) => ({
        ...prev,
        [questionIndex]: {
          userAnswers: {},
          isCompleted: false,
          score: 0,
          showHints: false,
          showSolution: false,
        },
      }))
    }
  }

  React.useEffect(() => {
    if (fibData && fibData.questions && fibData.questions.length > 0) {
      initializeQuestionState(currentQuestion)
    }
  }, [currentQuestion, fibData])

  React.useEffect(() => {
    // Add event listeners for dynamic inputs
    const handleInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement
      const position = parseInt(target.getAttribute("data-position") || "0")
      updateUserAnswer(position, target.value)
    }

    const inputs = document.querySelectorAll(".inline-blank")
    inputs.forEach((input) =>
      input.addEventListener("change", handleInputChange)
    )
    inputs.forEach((input) =>
      input.addEventListener("input", handleInputChange)
    )

    return () => {
      inputs.forEach((input) =>
        input.removeEventListener("change", handleInputChange)
      )
      inputs.forEach((input) =>
        input.removeEventListener("input", handleInputChange)
      )
    }
  }, [currentQuestion, questionStates[currentQuestion]?.isCompleted])

  const updateUserAnswer = (position: number, answer: string) => {
    const currentState = questionStates[currentQuestion]
    if (!currentState || currentState.isCompleted) return

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...currentState,
        userAnswers: {
          ...currentState.userAnswers,
          [position]: answer,
        },
      },
    }))
  }

  const checkAnswers = () => {
    const currentState = questionStates[currentQuestion]
    if (!currentState) return

    const blanks = currentQuestionData.blanks || []
    let correctCount = 0

    blanks.forEach((blank: any) => {
      const userAnswer = currentState.userAnswers[blank.position]
        ?.toLowerCase()
        .trim()
      const correctAnswer = blank.correctAnswer?.toLowerCase().trim()

      if (userAnswer === correctAnswer) {
        correctCount++
      }
    })

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...currentState,
        isCompleted: true,
        score: Math.round((correctCount / blanks.length) * 100),
      },
    }))
  }

  const resetQuestion = (questionIndex: number) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        userAnswers: {},
        isCompleted: false,
        score: 0,
        showHints: false,
        showSolution: false,
      },
    }))
  }

  const toggleHints = () => {
    const currentState = questionStates[currentQuestion]
    if (!currentState) return

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...currentState,
        showHints: !currentState.showHints,
      },
    }))
  }

  const showSolution = () => {
    const currentState = questionStates[currentQuestion]
    if (!currentState) return

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...currentState,
        showSolution: true,
      },
    }))
  }

  const getCompletedQuestions = () => {
    return Object.values(questionStates).filter((state) => state.isCompleted)
      .length
  }

  const getAverageScore = () => {
    const completedStates = Object.values(questionStates).filter(
      (state) => state.isCompleted
    )
    if (completedStates.length === 0) return 0
    return Math.round(
      completedStates.reduce((sum, state) => sum + state.score, 0) /
        completedStates.length
    )
  }

  const renderCodeWithBlanks = (
    code: string,
    blanks: any[],
    userAnswers: Record<number, string>,
    isCompleted: boolean
  ) => {
    let processedCode = code
    const sortedBlanks = [...blanks].sort((a, b) => b.position - a.position) // Process from end to start

    sortedBlanks.forEach((blank) => {
      const userAnswer = userAnswers[blank.position] || ""
      const isCorrect =
        isCompleted &&
        userAnswer.toLowerCase().trim() ===
          blank.correctAnswer?.toLowerCase().trim()
      const isIncorrect = isCompleted && userAnswer && !isCorrect

      const placeholder = `{{blank${blank.position}}}`
      let replacement = ""

      if (blank.type === "dropdown") {
        const options = blank.options || [blank.correctAnswer]
        replacement = `<select class="inline-blank dropdown ${isCompleted ? (isCorrect ? "correct" : isIncorrect ? "incorrect" : "neutral") : ""}" data-position="${blank.position}">
          <option value="">Select...</option>
          ${options.map((opt: string) => `<option value="${opt}" ${userAnswer === opt ? "selected" : ""}>${opt}</option>`).join("")}
        </select>`
      } else {
        replacement = `<input 
          type="text" 
          class="inline-blank text-input ${isCompleted ? (isCorrect ? "correct" : isIncorrect ? "incorrect" : "neutral") : ""}" 
          data-position="${blank.position}" 
          value="${userAnswer}" 
          placeholder="?" 
          ${isCompleted ? "readonly" : ""}
        />`
      }

      processedCode = processedCode.replace(placeholder, replacement)
    })

    return processedCode
  }

  const currentState = questionStates[currentQuestion] || {
    userAnswers: {},
    isCompleted: false,
    score: 0,
    showHints: false,
    showSolution: false,
  }

  const blanks = currentQuestionData?.blanks || []

  if (!fibData || !fibData.questions || fibData.questions.length === 0) {
    return (
      <div className="rounded-xl border-2 border-transparent bg-white p-8 text-center shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-4 text-4xl">✏️</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Fill in the Blanks Exercise Loading
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Code completion exercises will be available here shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Exercise Overview */}
      <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Edit3 className="mr-2 h-5 w-5 text-orange-500" />
            Fill in the Blanks
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Progress: {getCompletedQuestions()}/{totalQuestions}
            </span>
            <span>Average Score: {getAverageScore()}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-600">
            <div
              className="h-2 rounded-full bg-orange-600 transition-all duration-300"
              style={{
                width: `${(getCompletedQuestions() / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2">
          {questions.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-colors ${
                currentQuestion === index
                  ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                  : questionStates[index]?.isCompleted
                    ? questionStates[index]?.score >= 70
                      ? "border-green-300 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "border-yellow-300 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "border-gray-300 bg-white hover:bg-gray-50 dark:border-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className="rounded-xl border-2 border-transparent bg-white shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        {/* Question Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-700">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Question {currentQuestion + 1}
            </h4>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleHints}
                className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Hints</span>
              </button>

              {!currentState.isCompleted && (
                <button
                  onClick={showSolution}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Eye className="h-4 w-4" />
                  <span>Solution</span>
                </button>
              )}

              <button
                onClick={() => resetQuestion(currentQuestion)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            {currentQuestionData.scenario}
          </p>
        </div>

        {/* Mermaid Diagram (if exists) */}
        {currentQuestionData.mermaid_diagram && (
          <div className="border-b border-gray-200 p-6 dark:border-slate-600">
            <h5 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
              Code Structure:
            </h5>
            <MermaidDiagram diagram={currentQuestionData.mermaid_diagram} />
          </div>
        )}

        {/* Interactive Code Template */}
        <div className="p-6">
          <h5 className="mb-4 font-medium text-gray-900 dark:text-gray-100">
            Complete the code by filling in the blanks:
          </h5>

          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-900 dark:border-slate-600 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2 dark:border-slate-600 dark:bg-slate-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  Code Template
                </span>
              </div>
            </div>

            <div className="p-4">
              <div
                className="fill-blanks-code font-mono text-sm leading-relaxed text-gray-100 dark:text-gray-200"
                dangerouslySetInnerHTML={{
                  __html: renderCodeWithBlanks(
                    currentQuestionData.codeTemplate || "",
                    blanks,
                    currentState.userAnswers,
                    currentState.isCompleted
                  ),
                }}
              />
            </div>
          </div>

          {/* Individual Blank Inputs (Alternative UI) */}
          <div className="mb-6 grid gap-4">
            <h5 className="font-medium text-gray-900 dark:text-gray-100">
              Fill in each blank:
            </h5>
            {blanks.map((blank: any, index: number) => {
              const userAnswer = currentState.userAnswers[blank.position] || ""
              const isCorrect =
                currentState.isCompleted &&
                userAnswer.toLowerCase().trim() ===
                  blank.correctAnswer?.toLowerCase().trim()
              const isIncorrect =
                currentState.isCompleted && userAnswer && !isCorrect

              return (
                <div
                  key={blank.position}
                  className={`rounded-lg border p-4 ${
                    currentState.isCompleted
                      ? isCorrect
                        ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : isIncorrect
                          ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                          : "border-gray-300 bg-gray-50 dark:border-slate-600 dark:bg-slate-700"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Blank {blank.position}:
                    </label>
                    {currentState.isCompleted && (
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {blank.type === "dropdown" ? (
                    <select
                      value={userAnswer}
                      onChange={(e) =>
                        updateUserAnswer(blank.position, e.target.value)
                      }
                      disabled={currentState.isCompleted}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    >
                      <option value="">Select an option...</option>
                      {(blank.options || [blank.correctAnswer]).map(
                        (option: string, optIndex: number) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) =>
                        updateUserAnswer(blank.position, e.target.value)
                      }
                      disabled={currentState.isCompleted}
                      placeholder="Enter your answer..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100"
                    />
                  )}

                  {blank.hint && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      💡 Hint: {blank.hint}
                    </p>
                  )}

                  {currentState.isCompleted && blank.explanation && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      📝 {blank.explanation}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Check Answer Button */}
          {!currentState.isCompleted && (
            <button
              onClick={checkAnswers}
              className="w-full rounded-lg bg-orange-600 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-700"
            >
              Check Answers
            </button>
          )}

          {/* Result Message */}
          {currentState.isCompleted && (
            <div
              className={`rounded-lg border p-4 ${
                currentState.score >= 70
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
              }`}
            >
              <div className="mb-2 flex items-center space-x-2">
                {currentState.score >= 70 ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Edit3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                )}
                <span
                  className={`font-medium ${
                    currentState.score >= 70
                      ? "text-green-800 dark:text-green-200"
                      : "text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  Score: {currentState.score}%
                </span>
              </div>
              <p
                className={`text-sm ${
                  currentState.score >= 70
                    ? "text-green-700 dark:text-green-300"
                    : "text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {currentState.score >= 70
                  ? "Excellent work! You filled in the blanks correctly."
                  : "Good effort! Review the hints and try to improve your understanding."}
              </p>
            </div>
          )}
        </div>

        {/* Hints Section */}
        {currentState.showHints &&
          currentQuestionData.hints &&
          currentQuestionData.hints.length > 0 && (
            <div className="px-6 pb-4">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <h5 className="mb-2 flex items-center font-medium text-yellow-900 dark:text-yellow-100">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Hints
                </h5>
                <div className="space-y-2">
                  {currentQuestionData.hints.map((hint: any, index: number) => (
                    <p
                      key={index}
                      className="text-sm text-yellow-800 dark:text-yellow-200"
                    >
                      • {typeof hint === "string" ? hint : hint.hint}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Solution Section */}
        {currentState.showSolution && currentQuestionData.solution && (
          <div className="px-6 pb-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h5 className="mb-3 font-medium text-blue-900 dark:text-blue-100">
                💡 Complete Solution
              </h5>
              {currentQuestionData.solution.completeCode && (
                <CodeBlock
                  code={currentQuestionData.solution.completeCode}
                  language={language.slug}
                  title="Complete Solution"
                />
              )}
              {currentQuestionData.solution.explanation && (
                <p className="mt-3 text-sm text-blue-800 dark:text-blue-200">
                  {currentQuestionData.solution.explanation}
                </p>
              )}
              {currentQuestionData.solution.mermaid_diagram && (
                <div className="mt-4">
                  <MermaidDiagram
                    diagram={currentQuestionData.solution.mermaid_diagram}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-700">
          <div className="flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 disabled:text-gray-400 disabled:hover:text-gray-400 dark:text-gray-400 dark:hover:text-orange-400"
            >
              ← Previous
            </button>

            <button
              onClick={() =>
                setCurrentQuestion(
                  Math.min(totalQuestions - 1, currentQuestion + 1)
                )
              }
              disabled={currentQuestion === totalQuestions - 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 disabled:text-gray-400 disabled:hover:text-gray-400 dark:text-gray-400 dark:hover:text-orange-400"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Final Results */}
      {getCompletedQuestions() === totalQuestions && (
        <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
          <div className="text-center">
            <div className="mb-4 text-4xl">
              {getAverageScore() >= 80
                ? "🎉"
                : getAverageScore() >= 60
                  ? "👏"
                  : "💪"}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Exercise Complete!
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              You completed all {totalQuestions} fill-in-the-blank questions.
            </p>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              Average Score: {getAverageScore()}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Custom CSS for inline blanks
const styles = `
.fill-blanks-code .inline-blank {
  display: inline-block;
  min-width: 60px;
  margin: 0 2px;
  padding: 2px 6px;
  border: 1px solid #374151;
  border-radius: 3px;
  background: #1f2937;
  color: #f9fafb;
  font-family: inherit;
  font-size: inherit;
}

.fill-blanks-code .inline-blank.correct {
  border-color: #10b981;
  background: #064e3b;
}

.fill-blanks-code .inline-blank.incorrect {
  border-color: #ef4444;
  background: #7f1d1d;
}

.fill-blanks-code .inline-blank:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}
`

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

export default FillBlankLessonRenderer
