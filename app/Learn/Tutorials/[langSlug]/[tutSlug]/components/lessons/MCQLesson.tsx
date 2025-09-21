"use client"

import React, { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import MermaidRenderer from "../MermaidRenderer"

interface MCQQuestion {
  question: string
  options: Array<{
    text: string
    isCorrect: boolean
  }>
  explanation: string
  difficulty: string
  codeSnippet?: string
  mermaid_code?: Array<{ code: string } | string>
}

interface MCQData {
  questions: MCQQuestion[]
}

interface MCQLessonProps {
  data: MCQData
  lessonTitle: string
}

const MCQLesson: React.FC<MCQLessonProps> = ({ data, lessonTitle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const theme = useTheme()
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number
  }>({})
  const [showExplanations, setShowExplanations] = useState<{
    [key: number]: boolean
  }>({})
  const [quizComplete, setQuizComplete] = useState(false)

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  const handleSubmitAnswer = (questionIndex: number) => {
    setShowExplanations((prev) => ({
      ...prev,
      [questionIndex]: true,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizComplete(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getQuestionProgress = () => {
    const answeredQuestions = Object.keys(showExplanations).length
    return Math.round((answeredQuestions / data.questions.length) * 100)
  }

  const getCorrectAnswersCount = () => {
    return data.questions.reduce((count, question, index) => {
      const selectedOption = selectedAnswers[index]
      if (
        selectedOption !== undefined &&
        question.options[selectedOption]?.isCorrect
      ) {
        count++
      }
      return count
    }, 0)
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

  if (quizComplete) {
    const correctAnswers = getCorrectAnswersCount()
    const totalQuestions = data.questions.length
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="mb-4 text-6xl">
            {scorePercentage >= 80 ? "🎉" : scorePercentage >= 60 ? "👍" : "📚"}
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Quiz Complete!
          </h2>
          <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
            You scored {correctAnswers} out of {totalQuestions} questions
            correctly
          </p>
          <div className="mb-4 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {scorePercentage}%
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowExplanations({})
                setQuizComplete(false)
              }}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              🔄 Retake Quiz
            </button>
          </div>
        </div>

        {/* Review Questions */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            📝 Review Your Answers
          </h3>
          <div className="space-y-4">
            {data.questions.map((question, questionIndex) => {
              const selectedOption = selectedAnswers[questionIndex]
              const isCorrect =
                selectedOption !== undefined &&
                question.options[selectedOption]?.isCorrect

              return (
                <div
                  key={questionIndex}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <span
                      className={`text-lg ${isCorrect ? "text-green-500" : "text-red-500"}`}
                    >
                      {isCorrect ? "✅" : "❌"}
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {questionIndex + 1}. {question.question}
                    </p>
                  </div>
                  <div className="ml-8 text-sm">
                    <p className="mb-1 text-gray-600 dark:text-gray-400">
                      Your answer:{" "}
                      {selectedOption !== undefined
                        ? question.options[selectedOption].text
                        : "Not answered"}
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Correct answer:{" "}
                      {question.options.find((opt) => opt.isCorrect)?.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentQ = data.questions[currentQuestion]
  const selectedOption = selectedAnswers[currentQuestion]
  const showExplanation = showExplanations[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Question {currentQuestion + 1} of {data.questions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Progress: {getQuestionProgress()}%
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

      {/* Question */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Difficulty: {currentQ.difficulty}
            </span>
          </div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {currentQ.question}
          </h3>
        </div>

        {/* Code Context */}
        {currentQ.codeSnippet && (
          <div className="mb-6">
            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              💻 Code Context:
            </h4>
            <div className="rounded-lg bg-gray-900 p-4">
              <pre className="overflow-x-auto text-sm text-gray-100">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Mermaid Diagram */}
        {currentQ.mermaid_code && renderMermaidDiagram(currentQ.mermaid_code)}

        {/* Options */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Choose the correct answer:
          </h4>
          {currentQ.options.map((option, optionIndex) => {
            const isSelected = selectedOption === optionIndex
            const isCorrect = option.isCorrect
            const shouldShowCorrect = showExplanation && isCorrect
            const shouldShowIncorrect =
              showExplanation && isSelected && !isCorrect

            return (
              <button
                key={optionIndex}
                onClick={() =>
                  !showExplanation &&
                  handleAnswerSelect(currentQuestion, optionIndex)
                }
                disabled={showExplanation}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  shouldShowCorrect
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : shouldShowIncorrect
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      : isSelected
                        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                } ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      shouldShowCorrect
                        ? "border-green-500 bg-green-500"
                        : shouldShowIncorrect
                          ? "border-red-500 bg-red-500"
                          : isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 dark:border-gray-500"
                    }`}
                  >
                    {shouldShowCorrect && (
                      <span className="text-xs text-white">✓</span>
                    )}
                    {shouldShowIncorrect && (
                      <span className="text-xs text-white">✗</span>
                    )}
                    {isSelected && !showExplanation && (
                      <span className="text-xs text-white">•</span>
                    )}
                  </div>
                  <span
                    className={`${
                      shouldShowCorrect
                        ? "text-green-800 dark:text-green-200"
                        : shouldShowIncorrect
                          ? "text-red-800 dark:text-red-200"
                          : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + optionIndex)}) {option.text}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Submit Button */}
        {!showExplanation && selectedOption !== undefined && (
          <button
            onClick={() => handleSubmitAnswer(currentQuestion)}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Submit Answer
          </button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-blue-500">💡</span>
              <div>
                <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                  {selectedOption !== undefined &&
                  currentQ.options[selectedOption].isCorrect
                    ? "Correct!"
                    : "Explanation:"}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {showExplanation && (
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            ◀️ Previous Question
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuestion + 1} of {data.questions.length}
          </span>

          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {currentQuestion === data.questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}{" "}
            ▶️
          </button>
        </div>
      )}
    </div>
  )
}

export default MCQLesson
