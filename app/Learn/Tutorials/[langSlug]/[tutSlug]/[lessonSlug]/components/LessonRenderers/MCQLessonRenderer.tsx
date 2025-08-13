"use client"

import React, { useState } from "react"
import { CheckCircle, HelpCircle, RotateCcw, XCircle } from "lucide-react"
import {
  Language,
  TutorialLesson,
} from "../../../../../../../types/TutorialTypes"
import CodeBlock from "./shared/CodeBlock"
import MermaidDiagram from "./shared/MermaidDiagram"

interface MCQLessonRendererProps {
  lesson: TutorialLesson
  mcqData: any // From server Tutorial.ts mcqData structure
  language: Language
}

interface QuestionState {
  selectedOption: string | null
  isAnswered: boolean
  isCorrect: boolean
}

const MCQLessonRenderer = ({
  lesson,
  mcqData,
  language,
}: MCQLessonRendererProps) => {
  const [questionStates, setQuestionStates] = useState<
    Record<number, QuestionState>
  >({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  if (!mcqData || !mcqData.questions || mcqData.questions.length === 0) {
    return (
      <div className="rounded-xl border-2 border-transparent bg-white p-8 text-center shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-4 text-4xl">❓</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Quiz Questions Loading
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Multiple choice questions will be available here shortly.
        </p>
      </div>
    )
  }

  const questions = mcqData.questions
  const totalQuestions = questions.length
  const currentQuestionData = questions[currentQuestion]

  const handleOptionSelect = (
    questionIndex: number,
    optionId: string,
    isCorrect: boolean
  ) => {
    if (questionStates[questionIndex]?.isAnswered) return

    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        selectedOption: optionId,
        isAnswered: true,
        isCorrect,
      },
    }))
  }

  const resetQuestion = (questionIndex: number) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        selectedOption: null,
        isAnswered: false,
        isCorrect: false,
      },
    }))
  }

  const getCompletedQuestions = () => {
    return Object.values(questionStates).filter((state) => state.isAnswered)
      .length
  }

  const getCorrectAnswers = () => {
    return Object.values(questionStates).filter((state) => state.isCorrect)
      .length
  }

  const getDifficultyColor = (difficulty: string | number) => {
    switch (difficulty?.toString()) {
      case "1":
        return "bg-green-100 text-green-800 border-green-200"
      case "2":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "3":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyLabel = (difficulty: string | number) => {
    switch (difficulty?.toString()) {
      case "1":
        return "Easy"
      case "2":
        return "Medium"
      case "3":
        return "Hard"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Quiz Overview */}
      <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
            <HelpCircle className="mr-2 h-5 w-5 text-blue-500" />
            Multiple Choice Quiz
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
            <span>
              Score: {getCorrectAnswers()}/{getCompletedQuestions()}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-600">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(getCompletedQuestions() / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mb-4 flex flex-wrap gap-2">
          {questions.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-colors ${
                currentQuestion === index
                  ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : questionStates[index]?.isAnswered
                    ? questionStates[index]?.isCorrect
                      ? "border-green-300 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "border-red-300 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1}
              </span>
              {currentQuestionData.difficulty && (
                <span
                  className={`rounded-full border px-2 py-1 text-xs font-medium ${getDifficultyColor(currentQuestionData.difficulty)}`}
                >
                  {getDifficultyLabel(currentQuestionData.difficulty)}
                </span>
              )}
            </div>

            {questionStates[currentQuestion]?.isAnswered && (
              <button
                onClick={() => resetQuestion(currentQuestion)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retry</span>
              </button>
            )}
          </div>

          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {currentQuestionData.question}
          </h4>
        </div>

        {/* Code Snippet (if exists) */}
        {currentQuestionData.codeSnippet && (
          <div className="border-b border-gray-200 p-6 dark:border-slate-600">
            <CodeBlock
              code={currentQuestionData.codeSnippet}
              language={language.slug}
              title="Code Context"
            />
          </div>
        )}

        {/* Mermaid Diagram (if exists) */}
        {currentQuestionData.mermaid_diagram && (
          <div className="border-b border-gray-200 p-6 dark:border-slate-600">
            <MermaidDiagram diagram={currentQuestionData.mermaid_diagram} />
          </div>
        )}

        {/* Answer Options */}
        <div className="p-6">
          <div className="space-y-3">
            {currentQuestionData.options?.map((option: any) => {
              const isSelected =
                questionStates[currentQuestion]?.selectedOption === option.id
              const isAnswered = questionStates[currentQuestion]?.isAnswered
              const isCorrect = option.isCorrect

              let buttonClass =
                "w-full p-4 text-left border-2 rounded-lg transition-all "

              if (isAnswered) {
                if (isSelected) {
                  buttonClass += isCorrect
                    ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-400"
                    : "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-400"
                } else if (isCorrect) {
                  buttonClass +=
                    "border-green-300 bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-400 dark:border-green-600"
                } else {
                  buttonClass +=
                    "border-gray-200 bg-gray-50 text-gray-500 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400"
                }
              } else {
                buttonClass +=
                  "border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-slate-700 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              }

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    handleOptionSelect(
                      currentQuestion,
                      option.id,
                      option.isCorrect
                    )
                  }
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium dark:bg-slate-600">
                        {option.id.toUpperCase()}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {option.text}
                      </span>
                    </div>

                    {isAnswered && (
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )
                        ) : isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {questionStates[currentQuestion]?.isAnswered &&
            currentQuestionData.explanation && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h5 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                  💡 Explanation
                </h5>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {currentQuestionData.explanation}
                </p>
              </div>
            )}
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-600 dark:bg-slate-700">
          <div className="flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:hover:text-gray-400 dark:text-gray-400 dark:hover:text-blue-400"
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
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:hover:text-gray-400 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Final Results (if all questions answered) */}
      {getCompletedQuestions() === totalQuestions && (
        <div className="rounded-xl border-2 border-transparent bg-white p-6 shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
          <div className="text-center">
            <div className="mb-4 text-4xl">
              {getCorrectAnswers() === totalQuestions
                ? "🎉"
                : getCorrectAnswers() >= totalQuestions * 0.7
                  ? "👏"
                  : "💪"}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quiz Complete!
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              You scored {getCorrectAnswers()} out of {totalQuestions} questions
              correctly.
            </p>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((getCorrectAnswers() / totalQuestions) * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MCQLessonRenderer
