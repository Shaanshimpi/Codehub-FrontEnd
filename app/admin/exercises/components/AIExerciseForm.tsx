"use client"

import React, { useEffect, useState } from "react"
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { generateExercise, getAllTutorials, getLanguages } from "@/lib/getData"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings,
  Sparkles,
} from "lucide-react"

// AI Models array with pricing (per 1M tokens)
const AI_MODELS = [
  {
    name: "google/gemini-2.5-flash-lite",
    slug: "google/gemini-2.5-flash-lite",
  },
  { name: "google/gemini-2.5-flash", slug: "google/gemini-2.5-flash" },
  { name: "google/gemini-2.5-pro", slug: "google/gemini-2.5-pro" },
  {
    name: "Qwen 2.5 72B ($1.00/$3.00)",
    slug: "qwen/qwen-2.5-72b-instruct",
  },
  {
    name: "Gemini 1.5 Pro ($1.25/$5.00)",
    slug: "google/gemini-1.5-pro",
  },
  {
    name: "GPT-4o ($2.50/$10.00)",
    slug: "openai/gpt-4o",
  },
  {
    name: "Claude 3.5 Sonnet ($3.00/$15.00)",
    slug: "anthropic/claude-3.5-sonnet",
  },
  {
    name: "WizardLM 2 8x22B ($5.00/$15.00)",
    slug: "microsoft/wizardlm-2-8x22b",
  },
]

interface AIExerciseFormProps {
  onCancel: () => void
  onGenerated?: (exercise: any) => void
}

const AIExerciseForm: React.FC<AIExerciseFormProps> = ({
  onCancel,
  onGenerated,
}) => {
  // Form state
  const [title, setTitle] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedTutorial, setSelectedTutorial] = useState("")
  const [difficulty, setDifficulty] = useState(1)
  const [selectedModel, setSelectedModel] = useState(
    "google/gemini-2.5-flash-lite"
  )
  const [focusAreas, setFocusAreas] = useState("")
  const [exclusions, setExclusions] = useState("")

  // Loading and data states
  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([])
  const [languagesLoading, setLanguagesLoading] = useState(true)
  const [tutorialsLoading, setTutorialsLoading] = useState(true)
  const [generatedExercise, setGeneratedExercise] = useState<any>(null)

  // Advanced options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Load languages and tutorials
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [languagesData, tutorialsData] = await Promise.all([
          getLanguages(),
          getAllTutorials(),
        ])
        setLanguages(languagesData)
        setTutorials(tutorialsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLanguagesLoading(false)
        setTutorialsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter tutorials by selected language
  useEffect(() => {
    if (selectedLanguage && tutorials.length > 0) {
      const filtered = tutorials.filter(
        (tutorial) =>
          tutorial.programmingLanguage.id.toString() === selectedLanguage
      )
      setFilteredTutorials(filtered)

      // Clear tutorial selection if it doesn't match the language
      if (
        selectedTutorial &&
        !filtered.some((t) => t.id.toString() === selectedTutorial)
      ) {
        setSelectedTutorial("")
      }
    } else {
      setFilteredTutorials([])
      setSelectedTutorial("")
    }
  }, [selectedLanguage, tutorials, selectedTutorial])

  // Handle AI generation
  const handleGenerateExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedLangObj = languages.find(
        (lang) => lang.id === parseInt(selectedLanguage)
      )
      const langName = selectedLangObj?.title || "JavaScript"

      console.log("🚀 Starting exercise generation...")

      const exerciseResponse = await generateExercise(
        title, // questionInput
        langName, // selectedLanguage
        difficulty,
        selectedModel,
        exclusions
      )

      console.log("✅ Exercise generated successfully:", exerciseResponse)

      // Store the generated exercise and redirect to manual form for editing
      setGeneratedExercise(exerciseResponse)

      console.log("🔄 Passing generated exercise to parent...")
      if (onGenerated) {
        // Add the selected tutorial and language IDs to the generated data
        const exerciseWithMetadata = {
          ...exerciseResponse,
          programmingLanguage: selectedLanguage,
          tutorial: selectedTutorial,
          difficultyLevel: difficulty,
        }
        onGenerated(exerciseWithMetadata)
      }
    } catch (error) {
      console.error("❌ Exercise generation failed:", error)
      alert("Error generating exercise. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Generate AI Exercise
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create a comprehensive programming exercise with AI assistance
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* AI Exercise Generation Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Sparkles className="h-5 w-5" />
          AI Exercise Generator
        </h3>

        <form onSubmit={handleGenerateExercise} className="space-y-4">
          {/* Exercise Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Exercise Title / Problem Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Create a function to calculate factorial, Build a simple calculator, Print Fibonacci sequence"
              required
            />
          </div>

          {/* Programming Language */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Programming Language
            </label>
            {languagesLoading ? (
              <div className="flex items-center justify-center py-2 text-slate-600 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading languages...</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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

          {/* Tutorial (Optional) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tutorial (Optional)
            </label>
            {tutorialsLoading ? (
              <div className="flex items-center justify-center py-2 text-slate-600 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading tutorials...</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedTutorial}
                  onChange={(e) => setSelectedTutorial(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  disabled={!selectedLanguage}
                >
                  <option value="">Select Tutorial (Optional)</option>
                  {filteredTutorials.map((tutorial) => (
                    <option key={tutorial.id} value={tutorial.id.toString()}>
                      {tutorial.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            )}
            {!selectedLanguage && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Select a programming language first to see available tutorials
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Difficulty */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value={1}>1 - Beginner</option>
                  <option value={2}>2 - Intermediate</option>
                  <option value={3}>3 - Advanced</option>
                  <option value={4}>4 - Expert</option>
                  <option value={5}>5 - Master</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* AI Model */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                AI Model
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
          </div>

          {/* Focus Areas */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Focus Areas (Optional)
            </label>
            <textarea
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Specify particular programming concepts, patterns, or learning objectives to focus on (e.g., loops, error handling, memory management, algorithm complexity)..."
            />
          </div>

          {/* Exclusions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Exclusions (Optional)
            </label>
            <textarea
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Specify concepts, techniques, or complexity levels to exclude from the exercise (e.g., advanced data structures, external libraries, topics not yet covered)..."
            />
          </div>

          {/* Advanced Options Toggle */}
          <div className="border-t border-slate-200 pt-4 dark:border-slate-600">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Advanced Options</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  (Coming Soon)
                </span>
              </div>
              {showAdvancedOptions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Advanced Options Content */}
            {showAdvancedOptions && (
              <div className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Advanced customization options for exercise generation will be
                  available here in the future. This may include custom prompts,
                  specific output formats, and detailed generation parameters.
                </p>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Exercise
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AIExerciseForm
