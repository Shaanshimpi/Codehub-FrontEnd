"use client"

import React, { useEffect, useState } from "react"
import { FillInTheBlankData } from "@/app/Learn/types/TutorialTypes"
import { ChevronDown, ChevronUp, Code, Plus, Trash2 } from "lucide-react"
import MermaidDiagram from "../MermaidDiagram"

interface FIBFormProps {
  data: FillInTheBlankData | any
  onChange: (data: FillInTheBlankData) => void
}

const FIBForm: React.FC<FIBFormProps> = ({ data, onChange }) => {
  const [videoUrl, setVideoUrl] = useState<string>(data?.videoUrl || "")

  // Helper function to extract mermaid code strings from the data structure
  const extractMermaidCodeStrings = (mermaidData: any[]): string[] => {
    if (!Array.isArray(mermaidData)) return []

    return mermaidData.map((item) => {
      // If it's already a string, return it
      if (typeof item === "string") return item

      // If it's an object with a code property, extract the code
      if (item && typeof item === "object" && item.code) {
        return item.code
      }

      // Fallback: convert to string
      return String(item)
    })
  }

  const [questions, setQuestions] = useState(
    data?.questions?.map((q: any) => ({
      ...q,
      mermaid_code: extractMermaidCodeStrings(q.mermaid_code || []),
      solution: {
        ...q.solution,
        mermaid_code: extractMermaidCodeStrings(q.solution?.mermaid_code || []),
      },
    })) || [
      {
        id: crypto.randomUUID(),
        scenario: "",
        code: "",
        diagram_data: [],
        mermaid_code: [],
        blanks: [
          {
            id: crypto.randomUUID(),
            position: 0,
            type: "text",
            correctAnswer: "",
            options: [],
            hint: "",
            explanation: "",
          },
        ],
        hints: [],
        solution: {
          completeCode: "",
          explanation: "",
          diagram_data: [],
          mermaid_code: [],
        },
        difficulty: 1,
      },
    ]
  )

  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    onChange({
      videoUrl,
      questions: questions.filter((q) => q.code.trim() || q.scenario.trim()),
    })
  }, [questions, videoUrl, onChange])

  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      scenario: "",
      code: "",
      diagram_data: [],
      mermaid_code: [],
      blanks: [
        {
          id: crypto.randomUUID(),
          position: 0,
          type: "text",
          correctAnswer: "",
          options: [],
          hint: "",
          explanation: "",
        },
      ],
      hints: [],
      solution: {
        completeCode: "",
        explanation: "",
        diagram_data: [],
        mermaid_code: [],
      },
      difficulty: 1,
    }
    setQuestions((prev) => [...prev, newQuestion])
    setExpandedQuestions((prev) => ({ ...prev, [newQuestion.id]: true }))
  }

  // Diagram management functions
  const addQuestionDiagram = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              diagram_data: [
                ...(q.diagram_data || []),
                {
                  type: "flowchart",
                  title: "New Blank Filling Diagram",
                  direction: "TD",
                  nodes: [],
                  connections: [],
                },
              ],
            }
          : q
      )
    )
  }

  const removeQuestionDiagram = (
    questionIndex: number,
    diagramIndex: number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              diagram_data: (q.diagram_data || []).filter(
                (_, di) => di !== diagramIndex
              ),
            }
          : q
      )
    )
  }

  const addSolutionDiagram = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              solution: {
                ...q.solution,
                diagram_data: [
                  ...(q.solution?.diagram_data || []),
                  {
                    type: "flowchart",
                    title: "Solution Diagram",
                    direction: "TD",
                    nodes: [],
                    connections: [],
                  },
                ],
              },
            }
          : q
      )
    )
  }

  const removeSolutionDiagram = (
    questionIndex: number,
    diagramIndex: number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              solution: {
                ...q.solution,
                diagram_data: (q.solution?.diagram_data || []).filter(
                  (_, di) => di !== diagramIndex
                ),
              },
            }
          : q
      )
    )
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

  const addBlank = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            blanks: [
              ...q.blanks,
              {
                id: crypto.randomUUID(),
                position: q.blanks.length,
                type: "text",
                correctAnswer: "",
                options: [],
                hint: "",
                explanation: "",
              },
            ],
          }
        }
        return q
      })
    )
  }

  const removeBlank = (questionId: string, blankId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            blanks: q.blanks.filter((blank) => blank.id !== blankId),
          }
        }
        return q
      })
    )
  }

  const updateBlank = (
    questionId: string,
    blankId: string,
    field: string,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            blanks: q.blanks.map((blank) =>
              blank.id === blankId ? { ...blank, [field]: value } : blank
            ),
          }
        }
        return q
      })
    )
  }

  const updateBlankOptions = (
    questionId: string,
    blankId: string,
    optionsText: string
  ) => {
    const options = optionsText
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt)
    updateBlank(questionId, blankId, "options", options)
  }

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Fill-in-the-Blanks Questions ({questions.length}/5)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create multiple fill-in-the-blank exercises for comprehensive
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

      {/* Video URL */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Video URL (Optional)
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="e.g., https://youtube.com/watch?v=example"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Add a video to introduce the fill-in-the-blank exercises
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
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
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {expandedQuestions[question.id] ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
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
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Describe the context and what students need to complete..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Code Template
                    </label>
                    <div className="relative">
                      <textarea
                        value={question.code}
                        onChange={(e) =>
                          updateQuestion(question.id, "code", e.target.value)
                        }
                        rows={8}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Enter your code template here. Use {{blank1}}, {{blank2}} to mark blanks..."
                      />
                      <Code className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {`Use {{blank1}}, {{blank2}}, etc. to indicate where students should fill in the blanks`}
                    </p>
                  </div>

                  <div className="mt-3">
                    {/* Multiple Question Diagrams */}
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Question Diagrams (
                        {(question.diagram_data || []).length})
                      </label>
                      <button
                        type="button"
                        onClick={() => addQuestionDiagram(questionIndex)}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        <Plus className="h-3 w-3" />
                        Add Diagram
                      </button>
                    </div>
                    {(question.diagram_data || []).length > 0 ? (
                      <div className="space-y-3">
                        {(question.diagram_data || []).map(
                          (diagram: any, diagramIndex: number) => (
                            <div
                              key={diagramIndex}
                              className="rounded-lg border border-slate-200 p-3 dark:border-slate-600"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                  Template Diagram {diagramIndex + 1}:{" "}
                                  {diagram.title || "Untitled"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeQuestionDiagram(
                                      questionIndex,
                                      diagramIndex
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <MermaidDiagram
                                diagramData={diagram}
                                showDebugInfo={false}
                                onMermaidChange={(code) =>
                                  updateQuestion(
                                    question.id,
                                    "mermaid_code",
                                    code
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center dark:border-slate-600">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No template diagrams added yet. Click &quot;Add
                          Diagram&quot; to create visual explanations for the
                          blank-filling exercise.
                        </p>
                      </div>
                    )}

                    {/* Mermaid Code Diagrams */}
                    {(question.mermaid_code || []).length > 0 && (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Mermaid Diagrams (
                            {(question.mermaid_code || []).length})
                          </label>
                        </div>
                        {(question.mermaid_code || []).map(
                          (mermaidCode: string, mermaidIndex: number) => (
                            <div
                              key={mermaidIndex}
                              className="rounded-lg border border-slate-200 p-3 dark:border-slate-600"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Mermaid Diagram {mermaidIndex + 1}
                                </h5>
                              </div>
                              <MermaidDiagram
                                diagramData={mermaidCode}
                                showDebugInfo={false}
                                onMermaidChange={(code) =>
                                  updateQuestion(
                                    question.id,
                                    "mermaid_code",
                                    (question.mermaid_code || []).map((c, i) =>
                                      i === mermaidIndex ? code : c
                                    )
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Fill-in-the-Blank Configuration
                      </label>
                      <button
                        onClick={() => addBlank(question.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Blank
                      </button>
                    </div>

                    <div className="space-y-4">
                      {question.blanks.map((blank, blankIndex) => (
                        <div
                          key={blank.id}
                          className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              Blank #{blankIndex + 1}
                            </h4>
                            {question.blanks.length > 1 && (
                              <button
                                onClick={() =>
                                  removeBlank(question.id, blank.id)
                                }
                                className="rounded-lg p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Type
                              </label>
                              <select
                                value={blank.type}
                                onChange={(e) =>
                                  updateBlank(
                                    question.id,
                                    blank.id,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              >
                                <option value="text">Text Input</option>
                                <option value="dropdown">Dropdown</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Correct Answer
                              </label>
                              <input
                                type="text"
                                value={blank.correctAnswer}
                                onChange={(e) =>
                                  updateBlank(
                                    question.id,
                                    blank.id,
                                    "correctAnswer",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="e.g., variable_name"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Hint (Optional)
                              </label>
                              <input
                                type="text"
                                value={blank.hint || ""}
                                onChange={(e) =>
                                  updateBlank(
                                    question.id,
                                    blank.id,
                                    "hint",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Hint for this blank..."
                              />
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Explanation
                              </label>
                              <input
                                type="text"
                                value={blank.explanation || ""}
                                onChange={(e) =>
                                  updateBlank(
                                    question.id,
                                    blank.id,
                                    "explanation",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="Explanation for this answer..."
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Multiple Choice Options (Optional)
                              </label>
                              <input
                                type="text"
                                value={blank.options?.join(", ") || ""}
                                onChange={(e) =>
                                  updateBlankOptions(
                                    question.id,
                                    blank.id,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="option1, option2, option3"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hints for this question */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        General Hints (Optional)
                      </label>
                      <button
                        onClick={() =>
                          updateQuestion(question.id, "hints", [
                            ...question.hints,
                            "",
                          ])
                        }
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
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            💡
                          </div>
                          <input
                            type="text"
                            value={hint}
                            onChange={(e) => {
                              const newHints = [...question.hints]
                              newHints[hintIndex] = e.target.value
                              updateQuestion(question.id, "hints", newHints)
                            }}
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="Progressive hint to help students..."
                          />
                          <button
                            onClick={() =>
                              updateQuestion(
                                question.id,
                                "hints",
                                question.hints.filter((_, i) => i !== hintIndex)
                              )
                            }
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solution for this question */}
                  <div>
                    <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                      Solution (Optional)
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Complete Code
                        </label>
                        <textarea
                          value={question.solution?.completeCode || ""}
                          onChange={(e) =>
                            updateQuestion(question.id, "solution", {
                              ...question.solution,
                              completeCode: e.target.value,
                            })
                          }
                          rows={6}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Complete working code with all blanks filled..."
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Solution Explanation
                        </label>
                        <textarea
                          value={question.solution?.explanation || ""}
                          onChange={(e) =>
                            updateQuestion(question.id, "solution", {
                              ...question.solution,
                              explanation: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Comprehensive explanation of the solution..."
                        />
                      </div>

                      {/* Solution Diagrams */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Solution Diagrams (
                            {(question.solution?.diagram_data || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => addSolutionDiagram(questionIndex)}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                          >
                            <Plus className="h-3 w-3" />
                            Add Solution Diagram
                          </button>
                        </div>
                        {(question.solution?.diagram_data || []).length > 0 ? (
                          <div className="space-y-3">
                            {(question.solution?.diagram_data || []).map(
                              (diagram: any, diagramIndex: number) => (
                                <div
                                  key={diagramIndex}
                                  className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
                                >
                                  <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                      Solution Diagram {diagramIndex + 1}:{" "}
                                      {diagram.title || "Untitled"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSolutionDiagram(
                                          questionIndex,
                                          diagramIndex
                                        )
                                      }
                                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <MermaidDiagram
                                    diagramData={diagram}
                                    showDebugInfo={false}
                                    onMermaidChange={(code) => {
                                      // Update solution mermaid code if needed
                                      updateQuestion(question.id, "solution", {
                                        ...question.solution,
                                        mermaid_code: code,
                                      })
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="rounded-lg border-2 border-dashed border-green-300 p-4 text-center dark:border-green-600">
                            <p className="text-sm text-green-600 dark:text-green-400">
                              No solution diagrams added yet. Click &quot;Add
                              Solution Diagram&quot; to create visual
                              explanations for the complete solution.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {question.code.includes("{{") && (
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-200">
                        Preview
                      </h4>
                      <pre className="whitespace-pre-wrap font-mono text-sm text-blue-800 dark:text-blue-300">
                        {question.code}
                      </pre>
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

export default FIBForm
