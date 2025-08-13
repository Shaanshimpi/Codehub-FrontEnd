"use client"

import React, { useState } from "react"
import {
  CheckCircle,
  Eye,
  Lightbulb,
  Puzzle,
  RotateCcw,
  XCircle,
} from "lucide-react"
import {
  Language,
  TutorialLesson,
} from "../../../../../../../types/TutorialTypes"
import CodeBlock from "./shared/CodeBlock"
import MermaidDiagram from "./shared/MermaidDiagram"

interface CodeRearrangeLessonRendererProps {
  lesson: TutorialLesson
  codeRearrangeData: any // From server Tutorial.ts codeRearrangeData structure
  language: Language
}

interface QuestionState {
  userOrder: string[]
  isCompleted: boolean
  isCorrect: boolean
  showHints: boolean
  showSolution: boolean
}

const CodeRearrangeLessonRenderer = ({
  lesson: _lesson,
  codeRearrangeData,
  language,
}: CodeRearrangeLessonRendererProps) => {
  const [questionStates, setQuestionStates] = useState<
    Record<number, QuestionState>
  >({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)

  // Initialize hook-dependent variables
  const questions = codeRearrangeData?.questions || []
  const totalQuestions = questions.length
  const currentQuestionData = questions[currentQuestion]

  const initializeQuestionState = (questionIndex: number) => {
    if (!questionStates[questionIndex] && currentQuestionData) {
      const blocks = currentQuestionData.blocks || []
      const shuffledOrder = [
        ...blocks.map(
          (block: any) => block.id || `block-${block.correctOrder}`
        ),
      ].sort(() => Math.random() - 0.5)

      setQuestionStates((prev) => ({
        ...prev,
        [questionIndex]: {
          userOrder: shuffledOrder,
          isCompleted: false,
          isCorrect: false,
          showHints: false,
          showSolution: false,
        },
      }))
    }
  }

  React.useEffect(() => {
    if (
      codeRearrangeData &&
      codeRearrangeData.questions &&
      codeRearrangeData.questions.length > 0
    ) {
      initializeQuestionState(currentQuestion)
    }
  }, [currentQuestion, codeRearrangeData])

  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedBlock) return

    const currentState = questionStates[currentQuestion]
    if (!currentState || currentState.isCompleted) return

    const newOrder = [...currentState.userOrder]
    const draggedIndex = newOrder.indexOf(draggedBlock)

    if (draggedIndex !== -1) {
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedBlock)

      setQuestionStates((prev) => ({
        ...prev,
        [currentQuestion]: {
          ...currentState,
          userOrder: newOrder,
        },
      }))
    }
    setDraggedBlock(null)
  }

  const checkAnswer = () => {
    const currentState = questionStates[currentQuestion]
    if (!currentState) return

    const blocks = currentQuestionData.blocks || []
    const correctOrder = blocks
      .sort((a: any, b: any) => a.correctOrder - b.correctOrder)
      .map((block: any) => block.id || `block-${block.correctOrder}`)

    const isCorrect =
      JSON.stringify(currentState.userOrder) === JSON.stringify(correctOrder)

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion]: {
        ...currentState,
        isCompleted: true,
        isCorrect,
      },
    }))
  }

  const resetQuestion = (questionIndex: number) => {
    const blocks = questions[questionIndex]?.blocks || []
    const shuffledOrder = [
      ...blocks.map((block: any) => block.id || `block-${block.correctOrder}`),
    ].sort(() => Math.random() - 0.5)

    setQuestionStates((prev) => ({
      ...prev,
      [questionIndex]: {
        userOrder: shuffledOrder,
        isCompleted: false,
        isCorrect: false,
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

  const getCorrectAnswers = () => {
    return Object.values(questionStates).filter((state) => state.isCorrect)
      .length
  }

  const currentState = questionStates[currentQuestion] || {
    userOrder: [],
    isCompleted: false,
    isCorrect: false,
    showHints: false,
    showSolution: false,
  }
  const blocks = currentQuestionData?.blocks || []

  if (
    !codeRearrangeData ||
    !codeRearrangeData.questions ||
    codeRearrangeData.questions.length === 0
  ) {
    return (
      <div className="rounded-xl border-2 border-transparent bg-white p-8 text-center shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20">
        <div className="mb-4 text-4xl">🧩</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Code Rearranging Exercise Loading
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Drag and drop code exercises will be available here shortly.
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
            <Puzzle className="mr-2 h-5 w-5 text-purple-500" />
            Code Block Rearranging
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
              className="h-2 rounded-full bg-purple-600 transition-all duration-300"
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
                  ? "border-purple-500 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : questionStates[index]?.isCompleted
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
              Expected Code Flow:
            </h5>
            <MermaidDiagram diagram={currentQuestionData.mermaid_diagram} />
          </div>
        )}

        {/* Drag and Drop Area */}
        <div className="p-6">
          <h5 className="mb-4 font-medium text-gray-900 dark:text-gray-100">
            Arrange the code blocks in the correct order:
          </h5>

          <div className="mb-6 space-y-2">
            {currentState.userOrder.map((blockId, index) => {
              const block = blocks.find(
                (b: any) => (b.id || `block-${b.correctOrder}`) === blockId
              )
              if (!block) return null

              const isCorrectPosition =
                currentState.isCompleted &&
                blocks.find(
                  (b: any) =>
                    (b.id || `block-${b.correctOrder}`) === blockId &&
                    b.correctOrder === index + 1
                )

              return (
                <div
                  key={blockId}
                  draggable={!currentState.isCompleted}
                  onDragStart={() => handleDragStart(blockId)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`cursor-move rounded-lg border-2 border-dashed p-3 transition-all ${
                    draggedBlock === blockId
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : currentState.isCompleted
                        ? isCorrectPosition
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-red-400 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 hover:border-gray-400 dark:border-slate-600 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Position {index + 1}
                    </span>
                    {currentState.isCompleted && (
                      <div className="flex-shrink-0">
                        {isCorrectPosition ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                    {block.content || block.code}
                  </pre>
                </div>
              )
            })}
          </div>

          {/* Check Answer Button */}
          {!currentState.isCompleted && (
            <button
              onClick={checkAnswer}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700"
            >
              Check Answer
            </button>
          )}

          {/* Result Message */}
          {currentState.isCompleted && (
            <div
              className={`rounded-lg border p-4 ${
                currentState.isCorrect
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
              }`}
            >
              <div className="mb-2 flex items-center space-x-2">
                {currentState.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={`font-medium ${
                    currentState.isCorrect
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {currentState.isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p
                className={`text-sm ${
                  currentState.isCorrect
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {currentState.isCorrect
                  ? "Great job! You arranged the code blocks correctly."
                  : "Try again! The code blocks are not in the correct order."}
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
        {currentState.showSolution && currentQuestionData.targetCode && (
          <div className="px-6 pb-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h5 className="mb-3 font-medium text-blue-900 dark:text-blue-100">
                💡 Solution
              </h5>
              <CodeBlock
                code={currentQuestionData.targetCode}
                language={language.slug}
                title="Expected Result"
              />
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
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 disabled:text-gray-400 disabled:hover:text-gray-400 dark:text-gray-400 dark:hover:text-purple-400"
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
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 disabled:text-gray-400 disabled:hover:text-gray-400 dark:text-gray-400 dark:hover:text-purple-400"
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
              {getCorrectAnswers() === totalQuestions
                ? "🎉"
                : getCorrectAnswers() >= totalQuestions * 0.7
                  ? "👏"
                  : "💪"}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Exercise Complete!
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              You solved {getCorrectAnswers()} out of {totalQuestions} code
              puzzles correctly.
            </p>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round((getCorrectAnswers() / totalQuestions) * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeRearrangeLessonRenderer
