/* eslint-disable jsx-a11y/label-has-associated-control */
"use client"

import React, { useEffect, useState } from "react"
import { Eye, Save, X } from "lucide-react"
import ExercisePreview from "./ExercisePreview"

/* eslint-disable jsx-a11y/label-has-associated-control */

interface EditExerciseModalProps {
  exercise: any
  onClose: () => void
  onSave: (updatedExercise: any) => void
}

interface FormData {
  title_en: string
  title_hi: string
  title_mr: string
  slug: string
  problem_statement_en: string
  problem_statement_hi: string
  problem_statement_mr: string
  difficultyLevel: number
  programmingLanguage: number
  tutorial: number
  isLocked: boolean
  boilerplate_code: string
  solution_code: string
  learning_objectives: string[]
  tags: string[]
  hints_en: { text: string }[]
  hints_hi: { text: string }[]
  hints_mr: { text: string }[]
}

const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  exercise,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title_en: "",
    title_hi: "",
    title_mr: "",
    slug: "",
    problem_statement_en: "",
    problem_statement_hi: "",
    problem_statement_mr: "",
    difficultyLevel: 1,
    programmingLanguage: 1,
    tutorial: 1,
    isLocked: false,
    boilerplate_code: "",
    solution_code: "",
    learning_objectives: [""],
    tags: [""],
    hints_en: [{ text: "" }],
    hints_hi: [{ text: "" }],
    hints_mr: [{ text: "" }],
  })

  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (exercise) {
      setFormData({
        title_en: exercise.title_en || "",
        title_hi: exercise.title_hi || "",
        title_mr: exercise.title_mr || "",
        slug: exercise.slug || "",
        problem_statement_en: exercise.problem_statement_en || "",
        problem_statement_hi: exercise.problem_statement_hi || "",
        problem_statement_mr: exercise.problem_statement_mr || "",
        difficultyLevel: exercise.difficultyLevel || 1,
        programmingLanguage: exercise.programmingLanguage?.id || 1,
        tutorial: exercise.tutorial?.id || 1,
        isLocked: exercise.isLocked || false,
        boilerplate_code: exercise.boilerplate_code || "",
        solution_code: exercise.solution_code || "",
        learning_objectives: exercise.learning_objectives?.map((obj: any) =>
          typeof obj === "string" ? obj : obj.objective || ""
        ) || [""],
        tags: exercise.tags?.map((tag: any) =>
          typeof tag === "string" ? tag : tag.tag || ""
        ) || [""],
        hints_en: exercise.hints_en?.map((hint: any) =>
          typeof hint === "string" ? { text: hint } : hint
        ) || [{ text: "" }],
        hints_hi: exercise.hints_hi?.map((hint: any) =>
          typeof hint === "string" ? { text: hint } : hint
        ) || [{ text: "" }],
        hints_mr: exercise.hints_mr?.map((hint: any) =>
          typeof hint === "string" ? { text: hint } : hint
        ) || [{ text: "" }],
      })
    }
  }, [exercise])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayUpdate = (
    field: "learning_objectives" | "tags",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleArrayAdd = (field: "learning_objectives" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const handleArrayRemove = (
    field: "learning_objectives" | "tags",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleHintUpdate = (
    lang: "en" | "hi" | "mr",
    index: number,
    value: string
  ) => {
    const field = `hints_${lang}` as keyof FormData
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as { text: string }[]).map((hint, i) =>
        i === index ? { text: value } : hint
      ),
    }))
  }

  const handleHintAdd = (lang: "en" | "hi" | "mr") => {
    const field = `hints_${lang}` as keyof FormData
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as { text: string }[]), { text: "" }],
    }))
  }

  const handleHintRemove = (lang: "en" | "hi" | "mr", index: number) => {
    const field = `hints_${lang}` as keyof FormData
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as { text: string }[]).filter(
        (_, i) => i !== index
      ),
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Transform data for submission
      const validObjectives = formData.learning_objectives.filter(
        (obj) => obj.trim() !== ""
      )
      const validTags = formData.tags.filter((tag) => tag.trim() !== "")

      const transformedData = {
        ...formData,
        learning_objectives: validObjectives.map((obj) => ({ objective: obj })),
        tags: validTags.map((tag) => ({ tag: tag })),
        hints_en: formData.hints_en.filter((hint) => hint.text.trim() !== ""),
        hints_hi: formData.hints_hi.filter((hint) => hint.text.trim() !== ""),
        hints_mr: formData.hints_mr.filter((hint) => hint.text.trim() !== ""),
      }

      await onSave({ ...exercise, ...transformedData })
    } catch (error) {
      console.error("Error saving exercise:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPreviewData = () => ({
    ...exercise,
    ...formData,
    programmingLanguageTitle:
      exercise.programmingLanguage?.title || "Unknown Language",
    tutorialTitle: exercise.tutorial?.title || "Unknown Tutorial",
  })

  if (showPreview) {
    return (
      <ExercisePreview
        exerciseData={getPreviewData()}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        onEdit={() => setShowPreview(false)}
        isLoading={loading}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Edit Exercise
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 rounded-md border border-blue-300 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) =>
                    handleInputChange("title_en", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            {/* Difficulty and Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "difficultyLevel",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Programming Language ID
                </label>
                <input
                  type="number"
                  value={formData.programmingLanguage}
                  onChange={(e) =>
                    handleInputChange(
                      "programmingLanguage",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isLocked}
                    onChange={(e) =>
                      handleInputChange("isLocked", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Premium Exercise
                </label>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Learning Objectives *
              </label>
              {formData.learning_objectives.map((objective, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) =>
                      handleArrayUpdate(
                        "learning_objectives",
                        index,
                        e.target.value
                      )
                    }
                    placeholder="e.g., Understand basic conditional statements"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  {formData.learning_objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleArrayRemove("learning_objectives", index)
                      }
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd("learning_objectives")}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Objective
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tags *
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      handleArrayUpdate("tags", index, e.target.value)
                    }
                    placeholder="e.g., loops, conditionals"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleArrayRemove("tags", index)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd("tags")}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Tag
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditExerciseModal
