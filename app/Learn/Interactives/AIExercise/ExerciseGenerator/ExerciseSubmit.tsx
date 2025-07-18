"use client"

import React, { useEffect, useState } from "react"
import type { Tutorial } from "@/app/Learn/types/TutorialTypes"
import { getTutorialsByLanguageId } from "@/lib/getData"
import { ChevronDown, Loader2, Send, X } from "lucide-react"

interface SubmissionData {
  index: number
  slug: string
  programmingLanguage: string
  tutorial: string
  difficulty: number
  isLocked: boolean
}

interface ExerciseSubmitProps {
  formData: any
  onBack: () => void
  onSubmit: (data: SubmissionData) => void
}

const ExerciseSubmit: React.FC<ExerciseSubmitProps> = ({
  formData,
  onBack,
  onSubmit,
}) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [tutorialsLoading, setTutorialsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    index: 1,
    slug: formData.slug,
    programmingLanguage: formData.selectedLanguage,
    tutorial: "",
    difficulty: formData.difficulty,
    isLocked: true,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(submissionData)
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 dark:bg-slate-900">
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
                index: parseInt(e.target.value),
              }))
            }
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              setSubmissionData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={tutorials.length === 0}
              >
                {tutorials.length === 0 ? (
                  <option value="">
                    No tutorials available for selected language
                  </option>
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

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label
              htmlFor="exercise-difficulty"
              className="mb-2 block text-sm font-medium text-sky-100"
            >
              Difficulty
            </label>
            <div className="relative">
              <select
                id="exercise-difficulty"
                value={submissionData.difficulty}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    difficulty: parseInt(e.target.value),
                  }))
                }
                className="w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Intermediate</option>
                <option value={3}>3 - Advanced</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="mt-5 flex items-center">
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
              className="h-4 w-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isLocked"
              className="ml-2 block text-sm text-sky-100"
            >
              Locked
            </label>
          </div>
        </div>

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
      </form>
    </div>
  )
}

export default ExerciseSubmit
