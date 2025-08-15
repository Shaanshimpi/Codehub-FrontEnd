"use client"

import React, { useEffect, useState } from "react"
import { MCQOption } from "@/app/Learn/types/TutorialTypes"
import { CheckCircle, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import PlantUMLDiagram from "../PlantUMLDiagram"

interface MCQQuestion {
  id: string
  question: string
  options: MCQOption[]
  explanation: string
  difficulty: 1 | 2 | 3
  codeSnippet?: string
  diagram_data?: string
  plantuml_code?: string
}

interface MCQData {
  videoUrl?: string
  questions: MCQQuestion[]
}

interface MCQFormProps {
  data: MCQData | MCQOption[] | any
  onChange: (data: MCQData) => void
}

const MCQForm: React.FC<MCQFormProps> = ({ data, onChange }) => {
  // Initialize questions from different data structures
  const [questions, setQuestions] = useState<MCQQuestion[]>(() => {
    if (data && typeof data === "object" && "questions" in data) {
      // New MCQData structure
      return (data as MCQData).questions || []
    } else if (Array.isArray(data)) {
      // Legacy MCQOption[] structure - convert to single question
      return [
        {
          id: crypto.randomUUID(),
          question: "",
          options: data,
          explanation: "",
          difficulty: 1 as 1 | 2 | 3,
          codeSnippet: "",
          diagram_data: "",
        },
      ]
    } else {
      // No data - start with one empty question
      return [
        {
          id: crypto.randomUUID(),
          question: "",
          options: [
            { id: crypto.randomUUID(), text: "", isCorrect: false },
            { id: crypto.randomUUID(), text: "", isCorrect: false },
          ],
          explanation: "",
          difficulty: 1 as 1 | 2 | 3,
          codeSnippet: "",
          diagram_data: "",
        },
      ]
    }
  })

  const [videoUrl, setVideoUrl] = useState<string>(
    data && typeof data === "object" && "videoUrl" in data
      ? (data as MCQData).videoUrl || ""
      : ""
  )

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    if (questions.length > 0) {
      onChange({ videoUrl, questions })
    }
  }, [questions, videoUrl, onChange])

  const addQuestion = () => {
    const newQuestion: MCQQuestion = {
      id: crypto.randomUUID(),
      question: "",
      options: [
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
      explanation: "",
      difficulty: 1,
      codeSnippet: "",
      diagram_data: "",
    }
    setQuestions((prev) => [...prev, newQuestion])
    setExpandedQuestions((prev) => new Set([...prev, newQuestion.id]))
  }

  const removeQuestion = (questionId: string) => {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((q) => q.id !== questionId))
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(questionId)
      return newSet
    })
  }

  const updateQuestion = (
    questionId: string,
    field: keyof MCQQuestion,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    )
  }

  const addOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: crypto.randomUUID(), text: "", isCorrect: false },
              ],
            }
          : q
      )
    )
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId && q.options.length > 2
          ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) }
          : q
      )
    )
  }

  const updateOption = (
    questionId: string,
    optionId: string,
    field: keyof MCQOption,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId
                  ? { ...opt, [field]: value }
                  : field === "isCorrect" && value
                    ? { ...opt, isCorrect: false }
                    : opt
              ),
            }
          : q
      )
    )
  }

  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-slate-900 dark:text-white">
            MCQ Questions ({questions.length})
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create multiple choice questions with options, explanations, and
            difficulty levels
          </p>
        </div>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="e.g., https://youtube.com/watch?v=example"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Add a video to introduce the MCQ section
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, questionIndex) => {
          const isExpanded = expandedQuestions.has(question.id)
          return (
            <div
              key={question.id}
              className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {questionIndex + 1}
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 dark:text-white">
                      {question.question || `Question ${questionIndex + 1}`}
                    </h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Difficulty: {question.difficulty} | Options:{" "}
                      {question.options.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleQuestionExpanded(question.id)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Content */}
              {isExpanded && (
                <div className="space-y-4 p-4">
                  {/* Question Text */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Question Text
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(question.id, "question", e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Enter your multiple choice question here..."
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Difficulty Level
                    </label>
                    <select
                      value={question.difficulty}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "difficulty",
                          parseInt(e.target.value) as 1 | 2 | 3
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Intermediate</option>
                      <option value={3}>3 - Advanced</option>
                    </select>
                  </div>

                  {/* Code Snippet */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Code Snippet (Optional)
                    </label>
                    <textarea
                      value={question.codeSnippet || ""}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "codeSnippet",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Optional code context for the question..."
                    />
                  </div>

                  {/* PlantUML Diagram Preview */}
                  {question.diagram_data && (
                    <div>
                      <h6 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question Diagram Preview:
                      </h6>
                      <PlantUMLDiagram
                        diagramData={question.diagram_data}
                        showDebugInfo={true}
                        onPlantUMLChange={(code) =>
                          updateQuestion(question.id, "plantuml_code", code)
                        }
                      />
                    </div>
                  )}

                  {/* Answer Options */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Answer Options
                      </label>
                      <button
                        onClick={() => addOption(question.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-start gap-3">
                          <div className="flex h-10 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {String.fromCharCode(65 + optionIndex)}
                          </div>

                          <div className="flex-1">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  option.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                          </div>

                          <button
                            onClick={() =>
                              updateOption(
                                question.id,
                                option.id,
                                "isCorrect",
                                !option.isCorrect
                              )
                            }
                            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${
                              option.isCorrect
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                            }`}
                          >
                            <CheckCircle className="h-4 w-4" />
                            {option.isCorrect ? "Correct" : "Mark Correct"}
                          </button>

                          {question.options.length > 2 && (
                            <button
                              onClick={() =>
                                removeOption(question.id, option.id)
                              }
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {!question.options.some((opt) => opt.isCorrect) &&
                      question.options.some((opt) => opt.text.trim()) && (
                        <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                          Please mark at least one option as correct
                        </p>
                      )}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Explanation
                    </label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "explanation",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Explain why the correct answer is right and provide additional context..."
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
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

export default MCQForm
