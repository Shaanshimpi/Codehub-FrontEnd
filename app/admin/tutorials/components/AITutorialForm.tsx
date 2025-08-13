"use client"

import React, { useEffect, useState } from "react"
import type { Language, TutorialData } from "@/app/Learn/types/TutorialTypes"
import {
  CONTENT_QUALITY_STANDARDS,
  CORE_TUTORIAL_REQUIREMENTS,
  JSON_STRUCTURE_REQUIREMENTS,
  LESSON_PROGRESSION_GUIDELINES,
} from "@/app/api/generate-tutorial/prompts/systemPrompts"
import { generateTutorial, getLanguages } from "@/lib/getData"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings,
  Sparkles,
} from "lucide-react"
import TutorialPreview from "./TutorialPreview"

// AI Models array
const AI_MODELS = [
  {
    name: "Google: Gemini 2.5 Flash Lite",
    slug: "google/gemini-2.5-flash-lite",
  },
  { name: "Qwen3 Coder", slug: "qwen/qwen3-coder" },
  { name: "Mistral: Codestral", slug: "mistralai/codestral-2508" },
  { name: "GPT-5 Nano", slug: "openai/gpt-5-nano" },
]

interface AITutorialFormProps {
  onCancel: () => void
  onGenerated?: (data: TutorialData) => void
}

const AITutorialForm: React.FC<AITutorialFormProps> = ({
  onCancel,
  onGenerated,
}) => {
  const [topic, setTopic] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [difficulty, setDifficulty] = useState(1)
  const [numLessons, setNumLessons] = useState(7)
  const [focusAreas, setFocusAreas] = useState("")
  const [exclusions, setExclusions] = useState("")
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].slug)
  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [languagesLoading, setLanguagesLoading] = useState(true)
  const [generatedTutorial, setGeneratedTutorial] =
    useState<TutorialData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [customPrompts, setCustomPrompts] = useState({
    coreRequirements: CORE_TUTORIAL_REQUIREMENTS,
    lessonProgression: LESSON_PROGRESSION_GUIDELINES,
    contentQuality: CONTENT_QUALITY_STANDARDS,
    jsonStructure: JSON_STRUCTURE_REQUIREMENTS,
  })

  // Load languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch {
        // Error fetching languages
      } finally {
        setLanguagesLoading(false)
      }
    }
    fetchLanguages()
  }, [])

  // Handle AI generation
  const handleGenerateTutorial = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedLangObj = languages.find(
        (lang) => lang.id === parseInt(selectedLanguage)
      )
      const langSlug = selectedLangObj?.slug || "javascript"

      console.log("🚀 Starting tutorial generation...")

      const tutorialResponse = await generateTutorial(
        topic,
        langSlug,
        difficulty,
        numLessons,
        selectedModel,
        focusAreas,
        exclusions,
        customPrompts
      )

      console.log("✅ Tutorial generated successfully:", tutorialResponse)
      console.log("📊 Tutorial Structure:")
      console.log("- Title:", tutorialResponse.title)
      console.log("- Total Lessons:", tutorialResponse.lessons?.length)
      console.log(
        "- Lesson Types:",
        tutorialResponse.lessons?.map((l) => l.type).join(", ")
      )
      console.log("- Difficulty Level:", tutorialResponse.difficulty)
      console.log("- Key Topics:", tutorialResponse.keyTopics?.length || 0)

      // Store the generated tutorial and redirect to manual form for editing
      setGeneratedTutorial(tutorialResponse)

      console.log("🔄 Redirecting to manual form for editing...")
      if (onGenerated) {
        onGenerated(tutorialResponse)
      }
    } catch (error) {
      console.error("❌ Tutorial generation failed:", error)
      alert("Error generating tutorial. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Tutorial Preview Modal */}
      {showPreview && generatedTutorial && (
        <TutorialPreview
          tutorial={generatedTutorial}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Generate AI Tutorial
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a comprehensive tutorial with AI assistance
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

        {/* AI Tutorial Generation Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
            <Sparkles className="h-5 w-5" />
            AI Tutorial Generator
          </h3>

          <form onSubmit={handleGenerateTutorial} className="space-y-4">
            {/* Topic */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tutorial Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="e.g., Variables and Data Types, Functions, Object-Oriented Programming"
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
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Number of Lessons */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Number of Lessons
                </label>
                <input
                  type="number"
                  value={numLessons}
                  onChange={(e) => setNumLessons(parseInt(e.target.value) || 7)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  min="5"
                  max="20"
                />
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
                placeholder={
                  "Specify particular areas to focus on or teaching approaches you'd like to emphasize..."
                }
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
                placeholder="Specify concepts, topics, or techniques to exclude from the tutorial (e.g., advanced patterns not yet taught, unnecessary complexity)..."
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
                    (Edit System Prompts)
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
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Customize the system prompts used for AI generation. Leave
                    unchanged to use default values.
                  </p>

                  {/* Core Tutorial Requirements */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Core Tutorial Requirements
                    </label>
                    <textarea
                      value={customPrompts.coreRequirements}
                      onChange={(e) =>
                        setCustomPrompts((prev) => ({
                          ...prev,
                          coreRequirements: e.target.value,
                        }))
                      }
                      rows={6}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Core tutorial generation requirements..."
                    />
                  </div>

                  {/* Lesson Progression Guidelines */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Lesson Progression Guidelines
                    </label>
                    <textarea
                      value={customPrompts.lessonProgression}
                      onChange={(e) =>
                        setCustomPrompts((prev) => ({
                          ...prev,
                          lessonProgression: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Lesson progression strategy..."
                    />
                  </div>

                  {/* Content Quality Standards */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Content Quality Standards
                    </label>
                    <textarea
                      value={customPrompts.contentQuality}
                      onChange={(e) =>
                        setCustomPrompts((prev) => ({
                          ...prev,
                          contentQuality: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Content quality requirements..."
                    />
                  </div>

                  {/* JSON Structure Requirements */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      JSON Structure Requirements
                    </label>
                    <textarea
                      value={customPrompts.jsonStructure}
                      onChange={(e) =>
                        setCustomPrompts((prev) => ({
                          ...prev,
                          jsonStructure: e.target.value,
                        }))
                      }
                      rows={8}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="JSON structure requirements..."
                    />
                  </div>

                  {/* Reset to Defaults Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setCustomPrompts({
                        coreRequirements: CORE_TUTORIAL_REQUIREMENTS,
                        lessonProgression: LESSON_PROGRESSION_GUIDELINES,
                        contentQuality: CONTENT_QUALITY_STANDARDS,
                        jsonStructure: JSON_STRUCTURE_REQUIREMENTS,
                      })
                    }
                    className="px-3 py-1.5 text-xs text-slate-600 underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Reset to Default Prompts
                  </button>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !topic.trim() || !selectedLanguage}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Tutorial...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate AI Tutorial
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-200">
            What this will generate for you to edit:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300">
            <li>
              • <strong>Concept Lessons:</strong> In-depth explanations with
              code examples and key points
            </li>
            <li>
              • <strong>MCQ Quizzes:</strong> Multiple choice questions with
              detailed explanations
            </li>
            <li>
              • <strong>Code Rearranging:</strong> Interactive exercises to
              arrange code blocks
            </li>
            <li>
              • <strong>Fill-in-Blanks:</strong> Code completion exercises with
              hints
            </li>
            <li>
              • <strong>Multi-language Support:</strong> Content in English,
              Hindi (Roman), and Marathi (Roman)
            </li>
            <li>
              • <strong>Visual Elements:</strong> Mermaid diagrams for concept
              visualization
            </li>
            <li>
              • <strong>Progressive Learning:</strong> Structured lesson flow
              with time estimates
            </li>
          </ul>
        </div>

        {/* Additional Features Section */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="mb-2 font-medium text-green-900 dark:text-green-200">
            Enhanced Features:
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-300">
            <li>
              • <strong>Learning Objectives:</strong> Clear goals for each
              lesson and overall tutorial
            </li>
            <li>
              • <strong>Practical Applications:</strong> Real-world use cases
              and examples
            </li>
            <li>
              • <strong>Best Practices:</strong> Industry-standard coding
              practices and common mistakes to avoid
            </li>
            <li>
              • <strong>Difficulty Progression:</strong> Lessons organized from
              beginner to advanced concepts
            </li>
            <li>
              • <strong>Interactive Elements:</strong> Hands-on exercises for
              better understanding
            </li>
          </ul>
        </div>

        {/* Workflow Info */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <h4 className="mb-2 font-medium text-amber-900 dark:text-amber-200">
            📝 How it works:
          </h4>
          <ol className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
            <li>
              <strong>1.</strong> AI generates complete tutorial content based
              on your specifications
            </li>
            <li>
              <strong>2.</strong> You&apos;ll be redirected to the editing form
              with pre-filled content
            </li>
            <li>
              <strong>3.</strong> Review, edit, and customize any part of the
              generated tutorial
            </li>
            <li>
              <strong>4.</strong> Submit the final tutorial after making your
              changes
            </li>
          </ol>
        </div>

        {/* Generated Tutorial Actions */}
        {generatedTutorial && !showPreview && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <h4 className="mb-2 font-medium text-green-900 dark:text-green-200">
              Tutorial Generated Successfully!
            </h4>
            <p className="mb-3 text-sm text-green-800 dark:text-green-300">
              Your tutorial &quot;{generatedTutorial.title_en || "Untitled"}
              &quot; with {generatedTutorial.lessons?.length || 0} lessons has
              been generated.
            </p>
            <button
              onClick={() => setShowPreview(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              View Preview
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default AITutorialForm
