"use client"

import React, { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import MermaidRenderer from "../MermaidRenderer"
import { Badge, Button, CodeBlock, Icon, ProgressBar } from "../ui"

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

const MCQLesson: React.FC<MCQLessonProps> = ({
  data,
  lessonTitle: _lessonTitle,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const theme = useTheme()
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number
  }>({})
  const [showExplanations, setShowExplanations] = useState<{
    [key: number]: boolean
  }>({})
  const [quizComplete, setQuizComplete] = useState(false)

  // Scroll to top when question changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentQuestion])

  // Scroll to top when quiz completes
  React.useEffect(() => {
    if (quizComplete) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [quizComplete])

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
          <div className="mb-4 flex justify-center">
            <Icon
              name={
                scorePercentage >= 80
                  ? "trophy"
                  : scorePercentage >= 60
                    ? "check"
                    : "book"
              }
              className={`${scorePercentage >= 80 ? "text-yellow-500" : scorePercentage >= 60 ? "text-green-500" : "text-blue-500"}`}
              size="xl"
            />
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
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowExplanations({})
                setQuizComplete(false)
              }}
              icon={<Icon name="clock" size="sm" />}
            >
              Retake Quiz
            </Button>
          </div>
        </div>

        {/* Review Questions */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Icon name="notes" className="text-blue-500" size="sm" />
            Review Your Answers
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
                    <Icon
                      name={isCorrect ? "check" : "x"}
                      className={`text-lg ${isCorrect ? "text-green-500" : "text-red-500"}`}
                      size="sm"
                    />
                    <p className="font-medium text-gray-900 dark:text-white">
                      {questionIndex + 1}. {question.question}
                    </p>
                  </div>
                  <div className="ml-8 text-sm">
                    <p className="mb-1 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      Your answer:{" "}
                      {selectedOption !== undefined
                        ? question.options[selectedOption].text
                        : "Not answered"}
                    </p>
                    <p className="whitespace-pre-wrap text-green-600 dark:text-green-400">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Bar */}
      <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="info" size="sm">
            Question {currentQuestion + 1} of {data.questions.length}
          </Badge>
          <Badge variant="success" size="sm">
            Progress: {getQuestionProgress()}%
          </Badge>
        </div>
        <ProgressBar
          progress={((currentQuestion + 1) / data.questions.length) * 100}
          size="md"
          animated
          showLabel={false}
        />
      </div>

      {/* Question */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
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
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <Icon name="code" className="text-green-500" size="sm" />
              Code Context:
            </h4>
            <CodeBlock
              code={currentQ.codeSnippet}
              language="javascript"
              copyable
              showLineNumbers
              showLanguageLabel={false}
            />
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
                className={`w-full rounded-lg border p-3 text-left transition-colors sm:p-4 ${
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
                    className={`whitespace-pre-wrap ${
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
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleSubmitAnswer(currentQuestion)}
            fullWidth
          >
            Submit Answer
          </Button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-3">
              <Icon name="star" className="mt-1 text-blue-500" size="sm" />
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
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
              <Icon name="helpCircle" className="text-blue-600" size="sm" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Question {currentQuestion + 1} of {data.questions.length}
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              icon={<Icon name="chevronLeft" size="sm" />}
              className="min-h-[48px] flex-1 touch-manipulation text-sm font-medium"
            >
              <span className="hidden sm:inline">Previous Question</span>
              <span className="sm:hidden">Previous</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleNextQuestion}
              icon={<Icon name="chevronRight" size="sm" />}
              iconPosition="right"
              className="min-h-[48px] flex-1 touch-manipulation text-sm font-medium"
            >
              <span className="hidden sm:inline">
                {currentQuestion === data.questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </span>
              <span className="sm:hidden">
                {currentQuestion === data.questions.length - 1
                  ? "Finish"
                  : "Next"}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MCQLesson
