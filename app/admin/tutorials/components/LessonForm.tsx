"use client"

import React, { useState } from "react"
import { LessonType, TutorialLesson } from "@/app/Learn/types/TutorialTypes"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import CodeRearrangeForm from "./lesson-types/CodeRearrangeForm"
import ConceptLessonForm from "./lesson-types/ConceptLessonForm"
import FIBForm from "./lesson-types/FIBForm"
import MCQForm from "./lesson-types/MCQForm"

export interface MermaidSetters {
  setLessonMermaid: (lessonId: string, code: string) => void
  setCodeExampleMermaid: (
    lessonId: string,
    exampleIndex: number,
    code: string
  ) => void
  setQuestionMermaid: (
    lessonId: string,
    questionIndex: number,
    code: string
  ) => void
  setSolutionMermaid: (
    lessonId: string,
    questionIndex: number,
    code: string
  ) => void
}

interface LessonFormProps {
  lesson: TutorialLesson | null
  onSave: (lesson: TutorialLesson) => void
  onCancel: () => void
  mermaidSetters?: MermaidSetters
}

const LessonForm: React.FC<LessonFormProps> = ({
  lesson,
  onSave,
  onCancel,
  mermaidSetters,
}) => {
  const [formData, setFormData] = useState({
    id: lesson?.id || crypto.randomUUID(),
    title: lesson?.title || "",
    type: lesson?.type || ("concept" as LessonType),
    description: lesson?.description || "",
    videoUrl: lesson?.videoUrl || "",
    order: lesson?.order || 1,
    learningObjectives: lesson?.learningObjectives?.length
      ? lesson.learningObjectives
      : [""],
    keyTopics: lesson?.keyTopics?.length ? lesson.keyTopics : [""],
    difficulty: lesson?.difficulty || (1 as 1 | 2 | 3),
  })

  // Convert AI content structure to manual form data structure
  const convertAIContentToManualData = (lesson: any): any => {
    if (!lesson.content) {
      return null
    }

    let convertedData = null

    switch (lesson.type) {
      case "concept":
        convertedData = {
          explanation: lesson.content.explanation || "",
          keyPoints: lesson.content.keyPoints || [],
          codeExamples: (lesson.content.codeExamples || []).map(
            (example: any, idx: number) => {
              return {
                id: example.id || `example-${idx}`,
                title: example.title || `Example ${idx + 1}`,
                code: example.code || "",
                language: "javascript", // Default language
                explanation: example.explanation || "",
                mermaid_code: example.mermaid_code || [],
              }
            }
          ),
          practiceHints: lesson.content.practiceHints || [],
          mermaid_code: lesson.content.mermaid_code || [],
          commonMistakes: lesson.content.commonMistakes || [],
          bestPractices: lesson.content.bestPractices || [],
        }
        break

      case "mcq":
        if (lesson.content.questions && lesson.content.questions.length > 0) {
          convertedData = {
            questions: lesson.content.questions.map((q: any) => {
              return {
                id: q.id || crypto.randomUUID(),
                question: q.question || "",
                options: q.options || [],
                explanation: q.explanation || "",
                difficulty: q.difficulty || 1,
                codeSnippet: q.codeSnippet || "",
                mermaid_code: q.mermaid_code || [],
              }
            }),
          }
        } else {
          convertedData = {
            questions: [
              {
                id: crypto.randomUUID(),
                question: "",
                options: [
                  { id: crypto.randomUUID(), text: "", isCorrect: false },
                  { id: crypto.randomUUID(), text: "", isCorrect: false },
                ],
                explanation: "",
                difficulty: 1,
                codeSnippet: "",
              },
            ],
          }
        }
        break

      case "codeblock_rearranging":
        if (lesson.content.questions && lesson.content.questions.length > 0) {
          convertedData = {
            questions: lesson.content.questions.map((q: any) => {
              const aiCodeBlocks = q.codeBlocks || []
              const aiCorrectOrder = q.correctOrder || []

              return {
                id: q.id || crypto.randomUUID(),
                scenario: q.scenario || "",
                targetCode: q.targetCode || "",
                mermaid_code: q.mermaid_code || [],
                blocks: aiCodeBlocks.map((block: any, index: number) => {
                  const orderIndex = aiCorrectOrder.indexOf(block.id)
                  return {
                    id: block.id || `block-${index}`,
                    code: block.content || "",
                    correctOrder: orderIndex >= 0 ? orderIndex + 1 : index + 1,
                  }
                }),
                hints: q.hints || [],
                difficulty: q.difficulty || 1,
              }
            }),
          }
        } else {
          const aiCodeBlocks = lesson.content.codeBlocks || []
          const aiCorrectOrder = lesson.content.correctOrder || []

          convertedData = {
            questions: [
              {
                id: crypto.randomUUID(),
                scenario: lesson.content.scenario || "",
                targetCode: lesson.content.targetCode || "",
                mermaid_code: lesson.content.mermaid_code || [],
                blocks: aiCodeBlocks.map((block: any, index: number) => {
                  const orderIndex = aiCorrectOrder.indexOf(block.id)
                  return {
                    id: block.id || `block-${index}`,
                    code: block.content || "",
                    correctOrder: orderIndex >= 0 ? orderIndex + 1 : index + 1,
                  }
                }),
                hints: lesson.content.hints || [],
                difficulty: 1,
              },
            ],
          }
        }
        break

      case "fill_in_blanks":
        if (lesson.content.questions && lesson.content.questions.length > 0) {
          convertedData = {
            questions: lesson.content.questions.map((q: any) => {
              return {
                id: q.id || crypto.randomUUID(),
                scenario: q.scenario || "",
                code: q.codeTemplate || "",
                mermaid_code: q.mermaid_code || [],
                blanks: (q.blanks || []).map((blank: any, index: number) => ({
                  id: blank.id || `blank-${index}`,
                  position: blank.position || index,
                  type: blank.type || "text",
                  correctAnswer: blank.correctAnswer || "",
                  options: blank.options || [],
                  hint: blank.hint || "",
                  explanation: blank.explanation || "",
                })),
                hints: q.hints || [],
                solution: q.solution
                  ? {
                      completeCode: q.solution.completeCode || "",
                      explanation: q.solution.explanation || "",
                      mermaid_code: q.solution.mermaid_code || [],
                    }
                  : undefined,
                difficulty: q.difficulty || 1,
              }
            }),
          }
        } else {
          convertedData = {
            questions: [
              {
                id: crypto.randomUUID(),
                scenario: lesson.content.scenario || "",
                code: lesson.content.codeTemplate || "",
                mermaid_code: lesson.content.mermaid_code || [],
                blanks: (lesson.content.blanks || []).map(
                  (blank: any, index: number) => ({
                    id: blank.id || `blank-${index}`,
                    position: blank.position || index,
                    type: blank.type || "text",
                    correctAnswer: blank.correctAnswer || "",
                    options: blank.options || [],
                    hint: blank.hint || "",
                    explanation: blank.explanation || "",
                  })
                ),
                hints: lesson.content.hints || [],
                solution: lesson.content.solution
                  ? {
                      completeCode: lesson.content.solution.completeCode || "",
                      explanation: lesson.content.solution.explanation || "",
                      mermaid_code: lesson.content.solution.mermaid_code || [],
                    }
                  : undefined,
                difficulty: 1,
              },
            ],
          }
        }
        break

      default:
        convertedData = lesson.content
    }

    return convertedData
  }

  // Handle both manual form structure (data) and AI-generated structure (content)
  const [lessonData, setLessonData] = useState(() => {
    if (lesson?.data) {
      return lesson.data
    } else if (lesson?.content) {
      // Convert AI content structure to manual form data structure
      return convertAIContentToManualData(lesson)
    }
    return null
  })

  const handleSave = () => {
    if (!formData.title || !lessonData) return

    onSave({
      ...formData,
      data: lessonData,
    })
  }

  const renderLessonTypeForm = () => {
    switch (formData.type) {
      case "concept":
        return (
          <ConceptLessonForm
            data={lessonData}
            onChange={setLessonData}
            lessonId={formData.id}
            mermaidSetters={mermaidSetters}
          />
        )
      case "mcq":
        return (
          <MCQForm
            data={lessonData}
            onChange={setLessonData}
            lessonId={formData.id}
            mermaidSetters={mermaidSetters}
          />
        )
      case "codeblock_rearranging":
        return (
          <CodeRearrangeForm
            data={lessonData}
            onChange={setLessonData}
            lessonId={formData.id}
            mermaidSetters={mermaidSetters}
          />
        )
      case "fill_in_blanks":
        return (
          <FIBForm
            data={lessonData}
            onChange={setLessonData}
            lessonId={formData.id}
            mermaidSetters={mermaidSetters}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {lesson ? "Edit Lesson" : "Create New Lesson"}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure the lesson content and interactive elements
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorial
        </button>
      </div>

      {/* Basic Lesson Information */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Lesson Title
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Understanding Variables"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Lesson Type
            </label>
            <select
              value={formData.type || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as LessonType,
                }))
                setLessonData(null) // Reset lesson data when type changes
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="concept">Concept Explanation</option>
              <option value="mcq">Multiple Choice Question</option>
              <option value="codeblock_rearranging">
                Code Block Rearranging
              </option>
              <option value="fill_in_blanks">Fill in the Blanks</option>
            </select>
          </div>
        </div>

        {/* <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description (Optional)
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Brief description of what this lesson covers..."
          />
        </div> */}

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Video URL (Optional)
          </label>
          <input
            type="url"
            value={formData.videoUrl || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="e.g., https://youtube.com/watch?v=example"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add a video link to supplement this lesson (YouTube, Vimeo, etc.)
          </p>
        </div>

        {/* Lesson metadata */}
        <div className="mt-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Difficulty Level
            </label>
            <select
              value={formData.difficulty || 1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  difficulty: parseInt(e.target.value) as 1 | 2 | 3,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value={1}>1 - Beginner</option>
              <option value={2}>2 - Intermediate</option>
              <option value={3}>3 - Advanced</option>
            </select>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Learning Objectives
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  learningObjectives: [...prev.learningObjectives, ""],
                }))
              }
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <Plus className="h-4 w-4" />
              Add Objective
            </button>
          </div>
          <div className="space-y-2">
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={objective || ""}
                  onChange={(e) => {
                    const newObjectives = [...formData.learningObjectives]
                    newObjectives[index] = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      learningObjectives: newObjectives,
                    }))
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Learning objective..."
                />
                {formData.learningObjectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newObjectives = formData.learningObjectives.filter(
                        (_, i) => i !== index
                      )
                      setFormData((prev) => ({
                        ...prev,
                        learningObjectives: newObjectives,
                      }))
                    }}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Topics */}
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Key Topics
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  keyTopics: [...prev.keyTopics, ""],
                }))
              }
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <Plus className="h-4 w-4" />
              Add Topic
            </button>
          </div>
          <div className="space-y-2">
            {formData.keyTopics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={topic || ""}
                  onChange={(e) => {
                    const newTopics = [...formData.keyTopics]
                    newTopics[index] = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      keyTopics: newTopics,
                    }))
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Key topic..."
                />
                {formData.keyTopics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newTopics = formData.keyTopics.filter(
                        (_, i) => i !== index
                      )
                      setFormData((prev) => ({
                        ...prev,
                        keyTopics: newTopics,
                      }))
                    }}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Type Specific Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Lesson Content
        </h3>
        {renderLessonTypeForm()}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!formData.title || !lessonData}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Lesson
        </button>
      </div>
    </div>
  )
}

export default LessonForm
