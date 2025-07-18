"use client"

import React, { useEffect, useState } from "react"
import type { ExerciseAIData, Language } from "@/app/Learn/types/TutorialTypes"
import { generateExercise, getLanguages } from "@/lib/getData"
import { ChevronDown, Edit3, Loader2 } from "lucide-react"

// AI Models array
const AI_MODELS = [
  { name: "Google: Gemini 2.0 Flash", slug: "google/gemini-2.0-flash-001" },
  { name: "Mistral: Devstral Small 1.1", slug: "mistralai/devstral-small" },
  { name: "GPT-4 Mini", slug: "openai/gpt-4o-mini" },
]

interface ExerciseFormProps {
  onGenerate: (data: ExerciseAIData, formData: any) => void
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onGenerate }) => {
  const [questionInput, setQuestionInput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [difficulty, setDifficulty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [languagesLoading, setLanguagesLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].slug)

  // Load languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch (error) {
        console.error("Error fetching languages:", error)
      } finally {
        setLanguagesLoading(false)
      }
    }
    fetchLanguages()
  }, [])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Handle AI generation
  const handleGenerateExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedLangObj = languages.find(
        (lang) => lang.id === parseInt(selectedLanguage)
      )
      const langSlug = selectedLangObj?.slug || "c"

      const exerciseResponse = await generateExercise(
        questionInput,
        langSlug,
        difficulty,
        selectedModel
      )

      const formData = {
        selectedLanguage,
        difficulty,
        selectedModel,
        slug: generateSlug(exerciseResponse.title_en),
      }

      onGenerate(exerciseResponse, formData)
    } catch (err) {
      console.error("Error generating exercise:", err)
      alert("Error generating exercise. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 dark:bg-slate-900">
      <h1 className="mb-6 text-3xl font-extrabold text-white">
        Generate Programming Exercise
      </h1>

      <form onSubmit={handleGenerateExercise} className="space-y-6">
        <div>
          <label
            htmlFor="programming-language"
            className="mb-2 block text-sm font-medium text-sky-100"
          >
            Programming Language
          </label>
          {languagesLoading ? (
            <div className="flex items-center justify-center py-2 text-sky-100">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Loading languages...</span>
            </div>
          ) : (
            <div className="relative">
              <select
                id="programming-language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id.toString()}>
                    {lang.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="difficulty-level"
            className="mb-2 block text-sm font-medium text-sky-100"
          >
            Difficulty Level
          </label>
          <div className="relative">
            <select
              id="difficulty-level"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
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

        <div>
          <label
            htmlFor="ai-model"
            className="mb-2 block text-sm font-medium text-sky-100"
          >
            AI Model
          </label>
          <div className="relative">
            <select
              id="ai-model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AI_MODELS.map((model) => (
                <option key={model.slug} value={model.slug}>
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div>
          <label
            htmlFor="exercise-description"
            className="mb-2 block text-sm font-medium text-sky-100"
          >
            Exercise Description
          </label>
          <textarea
            id="exercise-description"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Describe the programming exercise you want to create..."
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !questionInput.trim() || !selectedLanguage}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-lg font-semibold text-white hover:from-blue-700 hover:to-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Edit3 className="h-5 w-5" />
              Generate Exercise
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ExerciseForm
