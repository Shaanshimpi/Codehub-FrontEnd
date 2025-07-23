"use client"

import React, { useEffect, useState } from "react"
import type { Tutorial } from "@/app/Learn/types/TutorialTypes"
import { getTutorialsByLanguageId } from "@/lib/getData"
import { ChevronDown, Eye, EyeOff, Loader2, Send, X } from "lucide-react"

interface SubmissionData {
  index: number
  slug: string
  programmingLanguage: string
  tutorial: string
  difficultyLevel: number
  isLocked: boolean
}

interface ExerciseSubmitProps {
  formData: any
  exerciseData: any // The complete AI-generated exercise data
  onBack: () => void
  onSubmit: (data: any) => void
}

interface FieldConfig {
  enabled: boolean
  label: string
  required?: boolean
}

const ExerciseSubmit: React.FC<ExerciseSubmitProps> = ({
  formData,
  exerciseData,
  onBack,
  onSubmit,
}) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [tutorialsLoading, setTutorialsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState<{ [key: string]: boolean }>({})

  // Submission metadata
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    index: 1,
    slug: formData?.slug || "",
    programmingLanguage: formData?.selectedLanguage || "",
    tutorial: "",
    difficultyLevel: formData?.difficulty || 1,
    isLocked: false,
  })

  // Field configuration - controls what gets submitted
  const [fieldConfig, setFieldConfig] = useState<{
    [key: string]: FieldConfig
  }>({
    // Core fields
    title_en: { enabled: true, label: "English Title", required: true },
    title_hi: { enabled: true, label: "Hindi Title" },
    title_mr: { enabled: true, label: "Marathi Title" },

    // Code fields
    solution_code: { enabled: true, label: "Solution Code", required: true },
    boilerplate_code: {
      enabled: true,
      label: "Boilerplate Code",
      required: true,
    },
    mermaid_diagram: { enabled: true, label: "Mermaid Diagram" },

    // Hints
    hints_en: { enabled: true, label: "English Hints" },
    hints_hi: { enabled: true, label: "Hindi Hints" },
    hints_mr: { enabled: true, label: "Marathi Hints" },

    // Explanations
    explanation_en: { enabled: true, label: "English Explanation" },
    explanation_hi: { enabled: true, label: "Hindi Explanation" },
    explanation_mr: { enabled: true, label: "Marathi Explanation" },

    // Metadata
    learning_objectives: { enabled: true, label: "Learning Objectives" },
    tags: { enabled: true, label: "Programming Tags" },
    visual_elements: { enabled: true, label: "Visual Elements" },
  })

  // Load tutorials when component mounts
  useEffect(() => {
    if (formData.selectedLanguage) {
      const fetchTutorials = async () => {
        setTutorialsLoading(true)
        try {
          const tutorialData = await getTutorialsByLanguageId(
            parseInt(formData.selectedLanguage)
          )
          setTutorials(tutorialData)
          setSubmissionData((prev) => ({
            ...prev,
            tutorial:
              tutorialData.length > 0 ? tutorialData[0].id.toString() : "",
          }))
        } catch (error) {
          console.error("Error fetching tutorials:", error)
          setTutorials([])
        } finally {
          setTutorialsLoading(false)
        }
      }
      fetchTutorials()
    }
  }, [formData.selectedLanguage])

  const toggleFieldConfig = (fieldName: string) => {
    setFieldConfig((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        enabled: !prev[fieldName].enabled,
      },
    }))
  }

  const togglePreview = (fieldName: string) => {
    setShowPreview((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const renderPreview = (fieldName: string, data: any) => {
    if (!showPreview[fieldName]) return null

    return (
      <div className="mt-2 rounded-md bg-slate-800 p-3">
        <div className="max-h-32 overflow-y-auto text-sm text-slate-300">
          {typeof data === "string" ? (
            <pre className="whitespace-pre-wrap">{data}</pre>
          ) : (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Build the payload with only enabled fields
      const payload = {
        // Always include basic submission data
        index: submissionData.index,
        slug: submissionData.slug,
        programmingLanguage: parseInt(submissionData.programmingLanguage),
        tutorial: parseInt(submissionData.tutorial),
        difficultyLevel: submissionData.difficultyLevel,
        isLocked: submissionData.isLocked,
      }

      // Add enabled fields from exercise data
      Object.keys(fieldConfig).forEach((fieldName) => {
        if (fieldConfig[fieldName].enabled && exerciseData[fieldName]) {
          payload[fieldName] = exerciseData[fieldName]
        }
      })

      console.log("Submitting payload:", payload)
      await onSubmit(payload)
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Submit Exercise</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-md border border-sky-200 px-4 py-2 text-sky-100 hover:bg-sky-100 hover:text-slate-900"
        >
          <X className="h-4 w-4" />
          Back to Preview
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Metadata */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <h2 className="mb-4 text-xl font-bold text-white">
            Submission Settings
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="exercise-index"
                className="mb-2 block text-sm font-medium text-sky-100"
              >
                Index
              </label>
              <input
                id="exercise-index"
                type="number"
                value={submissionData.index}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    index: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label
                htmlFor="exercise-slug"
                className="mb-2 block text-sm font-medium text-sky-100"
              >
                Slug
              </label>
              <input
                id="exercise-slug"
                type="text"
                value={submissionData.slug}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="exercise-tutorial"
                className="mb-2 block text-sm font-medium text-sky-100"
              >
                Tutorial
              </label>
              {tutorialsLoading ? (
                <div className="flex items-center justify-center py-2 text-sky-100">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Loading tutorials...</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    id="exercise-tutorial"
                    value={submissionData.tutorial}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        tutorial: e.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={tutorials.length === 0}
                  >
                    {tutorials.length === 0 ? (
                      <option value="">No tutorials available</option>
                    ) : (
                      <>
                        <option value="">Select Tutorial</option>
                        {tutorials.map((tut) => (
                          <option key={tut.id} value={tut.id.toString()}>
                            {tut.title}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="exercise-difficulty"
                className="mb-2 block text-sm font-medium text-sky-100"
              >
                Difficulty
              </label>
              <div className="relative">
                <select
                  id="exercise-difficulty"
                  value={submissionData.difficultyLevel}
                  onChange={(e) =>
                    setSubmissionData((prev) => ({
                      ...prev,
                      difficultyLevel: parseInt(e.target.value),
                    }))
                  }
                  className="w-full appearance-none rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={1}>1 - Beginner</option>
                  <option value={2}>2 - Intermediate</option>
                  <option value={3}>3 - Advanced</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isLocked"
              checked={submissionData.isLocked}
              onChange={(e) =>
                setSubmissionData((prev) => ({
                  ...prev,
                  isLocked: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isLocked"
              className="ml-2 block text-sm text-sky-100"
            >
              Locked Exercise
            </label>
          </div>
        </div>

        {/* Field Selection */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <h2 className="mb-4 text-xl font-bold text-white">
            Exercise Content
          </h2>
          <p className="mb-4 text-sm text-slate-400">
            Select which fields to include in the submission. You can preview
            the content before submitting.
          </p>

          <div className="space-y-4">
            {Object.entries(fieldConfig).map(([fieldName, config]) => (
              <div
                key={fieldName}
                className="rounded-lg border border-slate-600 bg-slate-700 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`field-${fieldName}`}
                      checked={config.enabled}
                      onChange={() => toggleFieldConfig(fieldName)}
                      className="h-4 w-4 rounded border-slate-500 bg-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`field-${fieldName}`}
                      className={`text-sm font-medium ${
                        config.enabled ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {config.label}
                      {config.required && (
                        <span className="ml-1 text-red-400">*</span>
                      )}
                    </label>
                    {!exerciseData[fieldName] && (
                      <span className="text-xs text-red-400">(No data)</span>
                    )}
                  </div>

                  {exerciseData[fieldName] && (
                    <button
                      type="button"
                      onClick={() => togglePreview(fieldName)}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-600 hover:text-white"
                    >
                      {showPreview[fieldName] ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          Preview
                        </>
                      )}
                    </button>
                  )}
                </div>

                {renderPreview(fieldName, exerciseData[fieldName])}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !submissionData.tutorial}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-lg font-semibold text-white hover:from-blue-700 hover:to-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Exercise
            </>
          )}
        </button>

        {/* Summary */}
        <div className="rounded-lg border border-slate-600 bg-slate-800 p-4">
          <h3 className="mb-2 text-sm font-medium text-slate-300">
            Submission Summary
          </h3>
          <div className="text-xs text-slate-400">
            <div>
              Enabled fields:{" "}
              {Object.values(fieldConfig).filter((f) => f.enabled).length}
            </div>
            <div>
              Required fields:{" "}
              {
                Object.values(fieldConfig).filter(
                  (f) => f.required && f.enabled
                ).length
              }
            </div>
            <div>
              Tutorial:{" "}
              {tutorials.find(
                (t) => t.id.toString() === submissionData.tutorial
              )?.title || "Not selected"}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExerciseSubmit
