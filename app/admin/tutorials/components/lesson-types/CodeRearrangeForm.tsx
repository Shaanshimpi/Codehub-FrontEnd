"use client"

import React, { useEffect, useState } from "react"
import { CodeRearrangeData } from "@/app/Learn/types/TutorialTypes"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Code,
  Plus,
  Trash2,
} from "lucide-react"

interface CodeRearrangeFormProps {
  data: CodeRearrangeData | any
  onChange: (data: CodeRearrangeData) => void
}

const CodeRearrangeForm: React.FC<CodeRearrangeFormProps> = ({
  data,
  onChange,
}) => {
  const [questions, setQuestions] = useState(
    data?.questions || [
      {
        id: crypto.randomUUID(),
        scenario: "",
        targetCode: "",
        mermaid_diagram: "",
        blocks: [
          {
            id: crypto.randomUUID(),
            code: "",
            correctOrder: 1,
          },
        ],
        hints: [""],
        difficulty: 1,
      },
    ]
  )

  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    onChange({
      questions: questions.filter(
        (q) =>
          q.scenario.trim() ||
          q.targetCode.trim() ||
          q.blocks.some((b) => b.code.trim())
      ),
    })
  }, [questions, onChange])

  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      scenario: "",
      targetCode: "",
      mermaid_diagram: "",
      blocks: [
        {
          id: crypto.randomUUID(),
          code: "",
          correctOrder: 1,
        },
      ],
      hints: [""],
      difficulty: 1,
    }
    setQuestions((prev) => [...prev, newQuestion])
    setExpandedQuestions((prev) => ({ ...prev, [newQuestion.id]: true }))
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    setExpandedQuestions((prev) => {
      const newExpanded = { ...prev }
      delete newExpanded[id]
      return newExpanded
    })
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    )
  }

  const addBlock = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            blocks: [
              ...q.blocks,
              {
                id: crypto.randomUUID(),
                code: "",
                correctOrder: q.blocks.length + 1,
              },
            ],
          }
        }
        return q
      })
    )
  }

  const removeBlock = (questionId: string, blockId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updatedBlocks = q.blocks.filter((block) => block.id !== blockId)
          // Reorder the remaining blocks
          const reorderedBlocks = updatedBlocks.map((block, index) => ({
            ...block,
            correctOrder: index + 1,
          }))
          return {
            ...q,
            blocks: reorderedBlocks,
          }
        }
        return q
      })
    )
  }

  const updateBlock = (
    questionId: string,
    blockId: string,
    field: string,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            blocks: q.blocks.map((block) =>
              block.id === blockId ? { ...block, [field]: value } : block
            ),
          }
        }
        return q
      })
    )
  }

  const moveBlock = (
    questionId: string,
    blockId: string,
    direction: "up" | "down"
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const blocks = [...q.blocks]
          const currentIndex = blocks.findIndex((block) => block.id === blockId)

          if (
            (direction === "up" && currentIndex > 0) ||
            (direction === "down" && currentIndex < blocks.length - 1)
          ) {
            const targetIndex =
              direction === "up" ? currentIndex - 1 : currentIndex + 1
            const [moved] = blocks.splice(currentIndex, 1)
            blocks.splice(targetIndex, 0, moved)

            // Update correctOrder for all blocks
            const reorderedBlocks = blocks.map((block, index) => ({
              ...block,
              correctOrder: index + 1,
            }))

            return {
              ...q,
              blocks: reorderedBlocks,
            }
          }
        }
        return q
      })
    )
  }

  const addHint = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            hints: [...q.hints, ""],
          }
        }
        return q
      })
    )
  }

  const removeHint = (questionId: string, hintIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            hints: q.hints.filter((_, i) => i !== hintIndex),
          }
        }
        return q
      })
    )
  }

  const updateHint = (questionId: string, hintIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newHints = [...q.hints]
          newHints[hintIndex] = value
          return {
            ...q,
            hints: newHints,
          }
        }
        return q
      })
    )
  }

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Code Block Rearranging Questions ({questions.length}/5)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create multiple code rearranging exercises for comprehensive
            learning
          </p>
        </div>
        <button
          onClick={addQuestion}
          disabled={questions.length >= 5}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <div
              className="flex cursor-pointer items-center justify-between p-4"
              onClick={() => toggleQuestion(question.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && toggleQuestion(question.id)
              }
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  {questionIndex + 1}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    Question {questionIndex + 1}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {question.scenario?.substring(0, 50) ||
                      "No scenario provided"}
                    {question.scenario && question.scenario.length > 50
                      ? "..."
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={question.difficulty}
                  onChange={(e) =>
                    updateQuestion(
                      question.id,
                      "difficulty",
                      parseInt(e.target.value)
                    )
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value={1}>Easy</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Hard</option>
                </select>
                {questions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeQuestion(question.id)
                    }}
                    className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {expandedQuestions[question.id] ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>
            </div>

            {expandedQuestions[question.id] && (
              <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Exercise Scenario
                    </label>
                    <textarea
                      value={question.scenario}
                      onChange={(e) =>
                        updateQuestion(question.id, "scenario", e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Describe what students need to do with the code blocks..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Target Code (Expected Result)
                    </label>
                    <div className="relative">
                      <textarea
                        value={question.targetCode}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "targetCode",
                            e.target.value
                          )
                        }
                        rows={8}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Enter the complete, working code that students should create..."
                      />
                      <Code className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Mermaid Diagram (Optional)
                    </label>
                    <textarea
                      value={question.mermaid_diagram}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "mermaid_diagram",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder={`flowchart TD\n  A["Start"] --> B["Process"]\n  B --> C["End"]`}
                    />
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Code Blocks ({question.blocks.length})
                      </label>
                      <button
                        onClick={() => addBlock(question.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Block
                      </button>
                    </div>

                    <div className="space-y-3">
                      {question.blocks
                        .sort((a, b) => a.correctOrder - b.correctOrder)
                        .map((block, blockIndex) => (
                          <div
                            key={block.id}
                            className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                  {block.correctOrder}
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Block #{block.correctOrder}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    moveBlock(question.id, block.id, "up")
                                  }
                                  disabled={blockIndex === 0}
                                  className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    moveBlock(question.id, block.id, "down")
                                  }
                                  disabled={
                                    blockIndex === question.blocks.length - 1
                                  }
                                  className="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                                {question.blocks.length > 1 && (
                                  <button
                                    onClick={() =>
                                      removeBlock(question.id, block.id)
                                    }
                                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              value={block.code}
                              onChange={(e) =>
                                updateBlock(
                                  question.id,
                                  block.id,
                                  "code",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              placeholder={`Enter code for block ${block.correctOrder}...`}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Hints (Optional)
                      </label>
                      <button
                        onClick={() => addHint(question.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Hint
                      </button>
                    </div>
                    <div className="space-y-2">
                      {question.hints.map((hint, hintIndex) => (
                        <div
                          key={hintIndex}
                          className="flex items-center gap-2"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                            💡
                          </div>
                          <input
                            type="text"
                            value={hint}
                            onChange={(e) =>
                              updateHint(question.id, hintIndex, e.target.value)
                            }
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="Progressive hint to help students..."
                          />
                          {question.hints.length > 1 && (
                            <button
                              onClick={() => removeHint(question.id, hintIndex)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {question.blocks.some((block) => block.code.trim()) && (
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <h4 className="mb-2 font-medium text-green-900 dark:text-green-200">
                        Code Blocks Preview (Student View - Randomized Order)
                      </h4>
                      <div className="space-y-2">
                        {question.blocks
                          .filter((block) => block.code.trim())
                          .map((block, index) => (
                            <div
                              key={block.id}
                              className="rounded border border-green-200 bg-white p-2 dark:border-green-800 dark:bg-green-900/10"
                            >
                              <div className="text-xs text-green-600 dark:text-green-400">
                                Block {index + 1}
                              </div>
                              <pre className="whitespace-pre-wrap font-mono text-sm text-green-800 dark:text-green-300">
                                {block.code}
                              </pre>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-slate-300 py-8 text-center dark:border-slate-600">
          <p className="text-slate-500 dark:text-slate-400">
            No questions added yet. Click &quot;Add Question&quot; to get
            started.
          </p>
        </div>
      )}
    </div>
  )
}

export default CodeRearrangeForm
