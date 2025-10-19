"use client"

import React, { useState } from "react"
import { useTheme } from "../../hooks/useTheme"
import MermaidRenderer from "../MermaidRenderer"
import { Icon } from "../ui"

interface CodeBlockItem {
  code: string
  correctOrder: number
}

interface CodeRearrangeQuestion {
  scenario: string
  targetCode: string
  mermaid_code?: Array<{ code: string } | string>
  blocks: CodeBlockItem[]
  hints: Array<{ hint: string } | string>
  difficulty: string
}

interface CodeRearrangeData {
  questions: CodeRearrangeQuestion[]
}

interface CodeRearrangeLessonProps {
  data: CodeRearrangeData
  lessonTitle: string
}

const CodeRearrangeLesson: React.FC<CodeRearrangeLessonProps> = ({
  data,
  lessonTitle: _lessonTitle,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const theme = useTheme()
  const [userOrder, setUserOrder] = useState<string[]>([])
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([])
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [selectedAvailableBlock, setSelectedAvailableBlock] = useState<
    string | null
  >(null)

  React.useEffect(() => {
    if (data.questions.length > 0) {
      resetQuestion()
    }
    // Scroll to top when question changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentQuestion, data.questions])

  const resetQuestion = () => {
    const currentQ = data.questions[currentQuestion]
    if (currentQ) {
      // Shuffle the blocks for the available pool
      const shuffled = [...currentQ.blocks]
        .sort(() => Math.random() - 0.5)
        .map((block) => block.code)

      setAvailableBlocks(shuffled)
      setUserOrder([])
      setShowHints(false)
      setShowSolution(false)
      setIsComplete(false)
      setSelectedBlock(null)
      setSelectedAvailableBlock(null)
    }
  }

  const handleDragStart = (
    e: React.DragEvent,
    blockCode: string,
    source: "available" | "solution"
  ) => {
    e.dataTransfer.setData("text/plain", blockCode)
    e.dataTransfer.setData("source", source)
  }

  const handleDrop = (
    e: React.DragEvent,
    target: "available" | "solution",
    index?: number
  ) => {
    e.preventDefault()
    const blockCode = e.dataTransfer.getData("text/plain")
    const source = e.dataTransfer.getData("source") as "available" | "solution"

    if (target === "available" && source === "solution") {
      // Move from solution back to available
      setUserOrder((prev) => prev.filter((code) => code !== blockCode))
      setAvailableBlocks((prev) => [...prev, blockCode])
      setSelectedBlock(null)
      setSelectedAvailableBlock(null)
    } else if (target === "solution" && source === "available") {
      setAvailableBlocks((prev) => prev.filter((code) => code !== blockCode))
      if (index !== undefined) {
        setUserOrder((prev) => {
          const newOrder = [...prev]
          newOrder.splice(index, 0, blockCode)
          return newOrder
        })
      } else {
        setUserOrder((prev) => [...prev, blockCode])
      }
      setSelectedBlock(null)
      setSelectedAvailableBlock(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const moveBlock = (blockCode: string, direction: "up" | "down") => {
    setUserOrder((prev) => {
      const currentIndex = prev.indexOf(blockCode)
      if (currentIndex === -1) return prev

      const newOrder = [...prev]
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

      if (newIndex >= 0 && newIndex < newOrder.length) {
        //no semicolon here
        [newOrder[currentIndex], newOrder[newIndex]] = [
          newOrder[newIndex],
          newOrder[currentIndex],
        ]
      }

      return newOrder
    })
  }

  const removeFromSolution = (blockCode: string) => {
    setUserOrder((prev) => prev.filter((code) => code !== blockCode))
    setAvailableBlocks((prev) => [...prev, blockCode])
    if (selectedBlock === blockCode) {
      setSelectedBlock(null)
    }
  }

  const moveToSolution = (blockCode: string) => {
    setAvailableBlocks((prev) => prev.filter((code) => code !== blockCode))
    setUserOrder((prev) => [...prev, blockCode])
    setSelectedAvailableBlock(null)
  }

  const checkSolution = () => {
    const currentQ = data.questions[currentQuestion]
    const correctOrder = currentQ.blocks
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map((block) => block.code)

    const isCorrect =
      userOrder.length === correctOrder.length &&
      userOrder.every((code, index) => code === correctOrder[index])

    if (isCorrect) {
      setIsComplete(true)
    } else {
      setShowSolution(true)
    }
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
          No code rearrangement questions available.
        </p>
      </div>
    )
  }

  const currentQ = data.questions[currentQuestion]

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
          🧩 Code Rearrangement: Arrange the Blocks
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

        {/* Target Output */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            🎯 Target Output:
          </h4>
          <div className="rounded-lg bg-gray-900 p-3 sm:p-4">
            <pre className="overflow-x-auto text-sm text-gray-100">
              <code>{currentQ.targetCode}</code>
            </pre>
          </div>
        </div>

        {/* Mermaid Diagram */}
        {currentQ.mermaid_code && renderMermaidDiagram(currentQ.mermaid_code)}

        {/* Drag and Drop Area */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Available Blocks */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Available Blocks:
            </h4>
            <div
              className="min-h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700 sm:p-4"
              onDrop={(e) => handleDrop(e, "available")}
              onDragOver={handleDragOver}
            >
              <div className="space-y-2">
                {availableBlocks.map((blockCode, index) => {
                  const isSelected = selectedAvailableBlock === blockCode
                  return (
                    <div
                      key={`${blockCode}-${index}`}
                      draggable
                      role="button"
                      tabIndex={0}
                      onDragStart={(e) =>
                        handleDragStart(e, blockCode, "available")
                      }
                      onClick={() =>
                        setSelectedAvailableBlock(isSelected ? null : blockCode)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedAvailableBlock(
                            isSelected ? null : blockCode
                          )
                        }
                      }}
                      className={`cursor-pointer touch-manipulation select-none rounded border p-3 transition-all hover:shadow-md ${
                        isSelected
                          ? "border-green-500 bg-green-100 shadow-lg ring-2 ring-green-400 dark:border-green-400 dark:bg-green-900/30 dark:ring-green-500"
                          : "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <code className="select-none text-sm text-gray-800 dark:text-gray-200">
                          {blockCode}
                        </code>
                        {isSelected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveToSolution(blockCode)
                            }}
                            className="flex touch-manipulation items-center justify-center gap-2 rounded bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                          >
                            <span>Move to Solution</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Solution Area */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Your Solution:
            </h4>
            <div
              className="min-h-32 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/20 sm:p-4"
              onDrop={(e) => handleDrop(e, "solution")}
              onDragOver={handleDragOver}
            >
              <div className="space-y-2">
                {userOrder.map((blockCode, index) => {
                  const isSelected = selectedBlock === blockCode
                  return (
                    <div
                      key={`${blockCode}-${index}`}
                      draggable
                      role="button"
                      tabIndex={0}
                      onDragStart={(e) =>
                        handleDragStart(e, blockCode, "solution")
                      }
                      onClick={() =>
                        setSelectedBlock(isSelected ? null : blockCode)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedBlock(isSelected ? null : blockCode)
                        }
                      }}
                      className={`group cursor-pointer touch-manipulation select-none rounded border p-3 transition-all hover:shadow-md ${
                        isSelected
                          ? "border-blue-500 bg-blue-200 shadow-lg ring-2 ring-blue-400 dark:border-blue-400 dark:bg-blue-700 dark:ring-blue-500"
                          : "border-blue-200 bg-blue-100 dark:border-blue-600 dark:bg-blue-800"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                          <span className="select-none text-sm text-blue-900 dark:text-blue-100">
                            {index + 1}.
                          </span>
                          <code className="flex-1 select-none break-all text-sm text-blue-800 dark:text-blue-200">
                            {blockCode}
                          </code>
                        </div>
                        {isSelected && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                moveBlock(blockCode, "up")
                              }}
                              disabled={index === 0}
                              className="flex h-9 flex-1 touch-manipulation items-center justify-center gap-1 rounded bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-30 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                              <span className="text-base">↑</span>
                              <span className="hidden sm:inline">Up</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                moveBlock(blockCode, "down")
                              }}
                              disabled={index === userOrder.length - 1}
                              className="flex h-9 flex-1 touch-manipulation items-center justify-center gap-1 rounded bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-30 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                              <span className="text-base">↓</span>
                              <span className="hidden sm:inline">Down</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFromSolution(blockCode)
                              }}
                              className="flex h-9 flex-1 touch-manipulation items-center justify-center gap-1 rounded bg-red-600 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                            >
                              <span className="text-lg">×</span>
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {userOrder.length === 0 && (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    Drag code blocks here to build your solution
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Progress: {userOrder.length}/{currentQ.blocks.length} blocks
              placed
            </div>
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
            disabled={userOrder.length !== currentQ.blocks.length || isComplete}
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
                  You&apos;ve correctly arranged all the code blocks. Great job!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Solution Display */}
        {showSolution && !isComplete && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20 sm:mt-6 sm:p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-red-500">💡</span>
              <div>
                <h4 className="mb-2 font-medium text-red-900 dark:text-red-100">
                  Here&apos;s the correct solution:
                </h4>
                <div className="mb-3 rounded bg-gray-900 p-3">
                  <pre className="text-sm text-gray-100">
                    <code>
                      {currentQ.blocks
                        .sort((a, b) => a.correctOrder - b.correctOrder)
                        .map((block) => block.code)
                        .join("\n")}
                    </code>
                  </pre>
                </div>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Try to understand the correct order and attempt again!
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
          <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 dark:bg-purple-900/30">
            <Icon name="code" className="text-purple-600" size="sm" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
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

export default CodeRearrangeLesson
