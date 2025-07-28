/* eslint-disable jsx-a11y/label-has-associated-control */
"use client"

import React, { useEffect, useState } from "react"
import { getLanguages, getTutorialsByLanguageId } from "@/lib/getData"
import { submitExercise } from "@/lib/submitData"
import { ChevronDown, Eye, EyeOff, Plus, Save, Trash2, X } from "lucide-react"
import ExercisePreview from "./ExercisePreview"

/* eslint-disable jsx-a11y/label-has-associated-control */

interface Language {
  id: number
  title: string
  slug: string
}

interface Tutorial {
  id: number
  title: string
  slug: string
}

interface ManualExerciseFormProps {
  onCancel: () => void
  onSuccess: () => void
}

interface ExerciseFormData {
  // Basic Info
  title_en: string
  title_hi: string
  title_mr: string
  slug: string
  difficultyLevel: number
  programmingLanguage: string
  tutorial: string
  isLocked: boolean

  // Code
  solution_code: string
  boilerplate_code: string
  mermaid_diagram: string

  // Learning Elements
  learning_objectives: string[]
  tags: string[]

  // Hints (English)
  hints_en: Array<{
    text: string
    code_snippet?: string
  }>

  // Hints (Hindi)
  hints_hi: Array<{
    text: string
    code_snippet?: string
  }>

  // Hints (Marathi)
  hints_mr: Array<{
    text: string
    code_snippet?: string
  }>

  // Explanations (English)
  explanation_en: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>

  // Explanations (Hindi)
  explanation_hi: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>

  // Explanations (Marathi)
  explanation_mr: Array<{
    text: string
    type: "text" | "concept" | "warning" | "tip"
    code_ref?: number[]
  }>

  // Visual Elements
  visual_elements: {
    execution_steps: Array<{
      step: number
      line_number?: number
      line: string
      description: string
      output: string
      memory_state: Array<{
        name: string
        value: string
        type: string
        changed: boolean
      }>
    }>
    concepts: Array<{
      name: string
      description: string
      visual_metaphor: string
    }>
  }
}

const ManualExerciseForm: React.FC<ManualExerciseFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(false)
  const [languagesLoading, setLanguagesLoading] = useState(true)
  const [tutorialsLoading, setTutorialsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("basic")
  const [activeLanguageTab, setActiveLanguageTab] = useState<
    "en" | "hi" | "mr"
  >("en")
  const [showPreview, setShowPreview] = useState<{ [key: string]: boolean }>({})
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})
  const [showExercisePreview, setShowExercisePreview] = useState(false)

  const [formData, setFormData] = useState<ExerciseFormData>({
    title_en: "",
    title_hi: "",
    title_mr: "",
    slug: "",
    difficultyLevel: 1,
    programmingLanguage: "",
    tutorial: "",
    isLocked: false,
    solution_code: "",
    boilerplate_code: "",
    mermaid_diagram: "",
    learning_objectives: [""],
    tags: [""],
    hints_en: [{ text: "" }],
    hints_hi: [{ text: "" }],
    hints_mr: [{ text: "" }],
    explanation_en: [{ text: "", type: "text" }],
    explanation_hi: [{ text: "", type: "text" }],
    explanation_mr: [{ text: "", type: "text" }],
    visual_elements: {
      execution_steps: [
        {
          step: 1,
          line: "",
          description: "",
          output: "",
          memory_state: [{ name: "", value: "", type: "", changed: false }],
        },
      ],
      concepts: [{ name: "", description: "", visual_metaphor: "" }],
    },
  })

  // Load languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch (error) {
        // Error loading languages
      } finally {
        setLanguagesLoading(false)
      }
    }
    fetchLanguages()
  }, [])

  // Load tutorials when language changes
  useEffect(() => {
    if (formData.programmingLanguage) {
      const fetchTutorials = async () => {
        setTutorialsLoading(true)
        try {
          const tutorialData = await getTutorialsByLanguageId(
            parseInt(formData.programmingLanguage)
          )
          setTutorials(tutorialData)
          setFormData((prev) => ({ ...prev, tutorial: "" }))
        } catch (error) {
          // Error loading tutorials
        } finally {
          setTutorialsLoading(false)
        }
      }
      fetchTutorials()
    }
  }, [formData.programmingLanguage])

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.title_en) {
      const slug = formData.title_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title_en])

  const handleInputChange = (field: keyof ExerciseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayAdd = (field: keyof ExerciseFormData, item: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), item],
    }))
  }

  const handleArrayRemove = (field: keyof ExerciseFormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }))
  }

  const handleArrayUpdate = (
    field: keyof ExerciseFormData,
    index: number,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) =>
        i === index ? value : item
      ),
    }))
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // Clear previous errors
    setValidationErrors({})

    // Validate required fields
    if (!formData.title_en.trim()) {
      errors["title_en"] = "English title is required"
    }
    if (!formData.title_hi.trim()) {
      errors["title_hi"] = "Hindi title is required"
    }
    if (!formData.title_mr.trim()) {
      errors["title_mr"] = "Marathi title is required"
    }
    if (!formData.solution_code.trim()) {
      errors["solution_code"] = "Solution code is required"
    }
    if (!formData.boilerplate_code.trim()) {
      errors["boilerplate_code"] = "Boilerplate code is required"
    }
    if (!formData.mermaid_diagram.trim()) {
      errors["mermaid_diagram"] = "Mermaid diagram is required"
    }

    // Validate learning objectives
    const validObjectives = formData.learning_objectives.filter(
      (obj) => obj.trim() !== ""
    )
    if (validObjectives.length < 2) {
      errors["learning_objectives"] =
        "At least 2 learning objectives are required"
    }

    // Validate tags
    const validTags = formData.tags.filter((tag) => tag.trim() !== "")
    if (validTags.length < 3) {
      errors["tags"] = "At least 3 programming tags are required"
    }

    // Validate hints for all languages
    if (!formData.hints_en[0]?.text?.trim()) {
      errors["hints_en"] = "At least one English hint is required"
    }
    if (!formData.hints_hi[0]?.text?.trim()) {
      errors["hints_hi"] = "At least one Hindi hint is required"
    }
    if (!formData.hints_mr[0]?.text?.trim()) {
      errors["hints_mr"] = "At least one Marathi hint is required"
    }

    // Validate explanations for all languages
    if (!formData.explanation_en[0]?.text?.trim()) {
      errors["explanation_en"] = "At least one English explanation is required"
    }
    if (!formData.explanation_hi[0]?.text?.trim()) {
      errors["explanation_hi"] = "At least one Hindi explanation is required"
    }
    if (!formData.explanation_mr[0]?.text?.trim()) {
      errors["explanation_mr"] = "At least one Marathi explanation is required"
    }

    // Validate visual elements
    if (!formData.visual_elements.execution_steps[0]?.line?.trim()) {
      errors["execution_steps"] = "At least one execution step is required"
    }
    if (!formData.visual_elements.concepts[0]?.name?.trim()) {
      errors["concepts"] = "At least one programming concept is required"
    }

    // Validate relationships
    if (!formData.programmingLanguage) {
      errors["programmingLanguage"] = "Programming language is required"
    }
    if (!formData.tutorial) {
      errors["tutorial"] = "Tutorial is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      alert("Please fix the validation errors before submitting.")
      return
    }

    setLoading(true)

    try {
      // Transform the form data to match the expected backend schema
      const validObjectives = formData.learning_objectives.filter(
        (obj) => obj.trim() !== ""
      )
      const validTags = formData.tags.filter((tag) => tag.trim() !== "")

      const transformedData = {
        ...formData,
        // Ensure learning objectives have at least 2 items - correct structure
        learning_objectives:
          validObjectives.length >= 2
            ? validObjectives.map((obj) => ({ objective: obj }))
            : [
                { objective: "Default learning objective 1" },
                { objective: "Default learning objective 2" },
              ],

        // Ensure tags have at least 3 items - correct structure
        tags:
          validTags.length >= 3
            ? validTags.map((tag) => ({ tag }))
            : [{ tag: "programming" }, { tag: "coding" }, { tag: "basics" }],

        // Use actual values, no fallbacks since validation ensures they exist
        title_hi: formData.title_hi.trim(),
        title_mr: formData.title_mr.trim(),

        // Ensure hints for all languages
        hints_hi:
          formData.hints_hi.length > 0 && formData.hints_hi[0].text
            ? formData.hints_hi
            : [{ text: formData.hints_en[0]?.text || "Default hint in Hindi" }],

        hints_mr:
          formData.hints_mr.length > 0 && formData.hints_mr[0].text
            ? formData.hints_mr
            : [
                {
                  text: formData.hints_en[0]?.text || "Default hint in Marathi",
                },
              ],

        // Ensure explanations for all languages
        explanation_hi:
          formData.explanation_hi.length > 0 && formData.explanation_hi[0].text
            ? formData.explanation_hi
            : [
                {
                  text:
                    formData.explanation_en[0]?.text ||
                    "Default explanation in Hindi",
                  type: "text",
                },
              ],

        explanation_mr:
          formData.explanation_mr.length > 0 && formData.explanation_mr[0].text
            ? formData.explanation_mr
            : [
                {
                  text:
                    formData.explanation_en[0]?.text ||
                    "Default explanation in Marathi",
                  type: "text",
                },
              ],
      }

      await submitExercise(transformedData)
      onSuccess()
    } catch (error: any) {
      let errorMessage = "Error creating exercise. Please try again."

      try {
        // Try to parse validation errors from backend
        const errorData = JSON.parse(error.message)
        if (errorData.errors) {
          const backendErrors: { [key: string]: string } = {}
          errorData.errors.forEach((err: any) => {
            backendErrors[err.path] = err.message
          })
          setValidationErrors(backendErrors)
          errorMessage = "Please fix the validation errors highlighted below."
        }
      } catch {
        // If parsing fails, use the original error message
      }

      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "content", label: "Content" },
    { id: "code", label: "Code" },
    { id: "visual", label: "Visual Elements" },
  ]

  const togglePreview = (field: string) => {
    setShowPreview((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePreviewExercise = () => {
    // Basic validation before preview
    if (!formData.title_en.trim()) {
      alert("Please enter an English title before previewing")
      return
    }
    if (!formData.solution_code.trim()) {
      alert("Please enter solution code before previewing")
      return
    }
    setShowExercisePreview(true)
  }

  const handlePreviewSave = async () => {
    // Validate and save the exercise
    if (!validateForm()) {
      alert("Please fix the validation errors before saving.")
      return
    }

    setLoading(true)
    try {
      const validObjectives = formData.learning_objectives.filter(
        (obj) => obj.trim() !== ""
      )
      const validTags = formData.tags.filter((tag) => tag.trim() !== "")

      const transformedData = {
        ...formData,
        learning_objectives:
          validObjectives.length >= 2
            ? validObjectives.map((obj) => ({ objective: obj }))
            : [
                { objective: "Default learning objective 1" },
                { objective: "Default learning objective 2" },
              ],

        tags:
          validTags.length >= 3
            ? validTags.map((tag) => ({ tag }))
            : [{ tag: "programming" }, { tag: "coding" }, { tag: "basics" }],

        title_hi: formData.title_hi.trim(),
        title_mr: formData.title_mr.trim(),

        hints_hi:
          formData.hints_hi.length > 0 && formData.hints_hi[0].text
            ? formData.hints_hi
            : [{ text: formData.hints_en[0]?.text || "Default hint in Hindi" }],

        hints_mr:
          formData.hints_mr.length > 0 && formData.hints_mr[0].text
            ? formData.hints_mr
            : [
                {
                  text: formData.hints_en[0]?.text || "Default hint in Marathi",
                },
              ],

        explanation_hi:
          formData.explanation_hi.length > 0 && formData.explanation_hi[0].text
            ? formData.explanation_hi
            : [
                {
                  text:
                    formData.explanation_en[0]?.text ||
                    "Default explanation in Hindi",
                  type: "text",
                },
              ],

        explanation_mr:
          formData.explanation_mr.length > 0 && formData.explanation_mr[0].text
            ? formData.explanation_mr
            : [
                {
                  text:
                    formData.explanation_en[0]?.text ||
                    "Default explanation in Marathi",
                  type: "text",
                },
              ],
      }

      await submitExercise(transformedData)
      setShowExercisePreview(false)
      onSuccess()
    } catch (error: any) {
      let errorMessage = "Error creating exercise. Please try again."

      try {
        const errorData = JSON.parse(error.message)
        if (errorData.errors) {
          const backendErrors: { [key: string]: string } = {}
          errorData.errors.forEach((err: any) => {
            backendErrors[err.path] = err.message
          })
          setValidationErrors(backendErrors)
          errorMessage = "Please fix the validation errors highlighted below."
        }
      } catch {
        // If parsing fails, use the original error message
      }

      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getPreviewData = () => {
    // Get selected language and tutorial titles for preview
    const selectedLanguage = languages.find(
      (lang) => lang.id.toString() === formData.programmingLanguage
    )
    const selectedTutorial = tutorials.find(
      (tut) => tut.id.toString() === formData.tutorial
    )

    return {
      ...formData,
      programmingLanguageTitle: selectedLanguage?.title || "Unknown Language",
      tutorialTitle: selectedTutorial?.title || "Unknown Tutorial",
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Create Exercise Manually
        </h2>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>

      {/* Section Navigation */}
      <div className="mb-4 flex border-b border-slate-200 dark:border-slate-700">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`border-b-2 px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info Section */}
        {activeSection === "basic" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  English Title *
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) =>
                    handleInputChange("title_en", e.target.value)
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                    validationErrors.title_en
                      ? "border-red-500 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  required
                />
                {validationErrors.title_en && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.title_en}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hindi Title *
                </label>
                <input
                  type="text"
                  value={formData.title_hi}
                  onChange={(e) =>
                    handleInputChange("title_hi", e.target.value)
                  }
                  placeholder="हिंदी में शीर्षक"
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                    validationErrors.title_hi
                      ? "border-red-500 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  required
                />
                {validationErrors.title_hi && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.title_hi}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Marathi Title *
                </label>
                <input
                  type="text"
                  value={formData.title_mr}
                  onChange={(e) =>
                    handleInputChange("title_mr", e.target.value)
                  }
                  placeholder="मराठीतील शीर्षक"
                  className={`w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                    validationErrors.title_mr
                      ? "border-red-500 dark:border-red-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  required
                />
                {validationErrors.title_mr && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.title_mr}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auto-generated Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Programming Language *
                </label>
                {languagesLoading ? (
                  <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-700">
                    Loading languages...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={formData.programmingLanguage}
                      onChange={(e) =>
                        handleInputChange("programmingLanguage", e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tutorial *
                </label>
                {tutorialsLoading ? (
                  <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-700">
                    Loading tutorials...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={formData.tutorial}
                      onChange={(e) =>
                        handleInputChange("tutorial", e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      required
                      disabled={!formData.programmingLanguage}
                    >
                      <option value="">Select Tutorial</option>
                      {tutorials.map((tutorial) => (
                        <option
                          key={tutorial.id}
                          value={tutorial.id.toString()}
                        >
                          {tutorial.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Difficulty Level *
                </label>
                <div className="relative">
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) =>
                      handleInputChange(
                        "difficultyLevel",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    required
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Intermediate</option>
                    <option value={3}>3 - Advanced</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isLocked"
                  checked={formData.isLocked}
                  onChange={(e) =>
                    handleInputChange("isLocked", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isLocked"
                  className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Premium Exercise (Locked)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        {activeSection === "content" && (
          <div className="space-y-6">
            {/* Language Tabs for Hints and Explanations */}
            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveLanguageTab("en")}
                  className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeLanguageTab === "en"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguageTab("hi")}
                  className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeLanguageTab === "hi"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguageTab("mr")}
                  className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeLanguageTab === "mr"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  मराठी (Marathi)
                </button>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Learning Objectives *
              </label>
              {validationErrors.learning_objectives && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.learning_objectives}
                </p>
              )}
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
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  {formData.learning_objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleArrayRemove("learning_objectives", index)
                      }
                      className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd("learning_objectives", "")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Add Learning Objective
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Programming Tags *
              </label>
              {validationErrors.tags && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.tags}
                </p>
              )}
              {formData.tags.map((tag, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      handleArrayUpdate("tags", index, e.target.value)
                    }
                    placeholder="e.g., loops, conditionals, arrays"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleArrayRemove("tags", index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAdd("tags", "")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Add Tag
              </button>
            </div>

            {/* Language-specific Hints and Explanations */}

            {/* English Tab */}
            {activeLanguageTab === "en" && (
              <div className="space-y-6">
                {/* Hints (English) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hints (English) *
                  </label>
                  {formData.hints_en.map((hint, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={hint.text}
                          onChange={(e) =>
                            handleArrayUpdate("hints_en", index, {
                              ...hint,
                              text: e.target.value,
                            })
                          }
                          placeholder="Helpful hint for students..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={2}
                        />
                        {formData.hints_en.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleArrayRemove("hints_en", index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={hint.code_snippet || ""}
                        onChange={(e) =>
                          handleArrayUpdate("hints_en", index, {
                            ...hint,
                            code_snippet: e.target.value,
                          })
                        }
                        placeholder="Optional code snippet..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd("hints_en", { text: "", code_snippet: "" })
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    Add Hint
                  </button>
                </div>

                {/* Explanations (English) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Explanations (English) *
                  </label>
                  {formData.explanation_en.map((explanation, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={explanation.text}
                          onChange={(e) =>
                            handleArrayUpdate("explanation_en", index, {
                              ...explanation,
                              text: e.target.value,
                            })
                          }
                          placeholder="Step-by-step explanation..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={3}
                        />
                        {formData.explanation_en.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayRemove("explanation_en", index)
                            }
                            className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          value={explanation.type}
                          onChange={(e) =>
                            handleArrayUpdate("explanation_en", index, {
                              ...explanation,
                              type: e.target.value as any,
                            })
                          }
                          className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="text">Text</option>
                          <option value="concept">Concept</option>
                          <option value="warning">Warning</option>
                          <option value="tip">Tip</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd("explanation_en", {
                        text: "",
                        type: "text",
                      })
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    Add Explanation
                  </button>
                </div>
              </div>
            )}

            {/* Hindi Tab */}
            {activeLanguageTab === "hi" && (
              <div className="space-y-6">
                {/* Hints (Hindi) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hints (हिंदी) *
                  </label>
                  {formData.hints_hi.map((hint, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={hint.text}
                          onChange={(e) =>
                            handleArrayUpdate("hints_hi", index, {
                              ...hint,
                              text: e.target.value,
                            })
                          }
                          placeholder="छात्रों के लिए उपयोगी संकेत..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={2}
                        />
                        {formData.hints_hi.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleArrayRemove("hints_hi", index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={hint.code_snippet || ""}
                        onChange={(e) =>
                          handleArrayUpdate("hints_hi", index, {
                            ...hint,
                            code_snippet: e.target.value,
                          })
                        }
                        placeholder="Optional code snippet..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd("hints_hi", { text: "", code_snippet: "" })
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    संकेत जोड़ें
                  </button>
                </div>

                {/* Explanations (Hindi) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Explanations (हिंदी) *
                  </label>
                  {formData.explanation_hi.map((explanation, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={explanation.text}
                          onChange={(e) =>
                            handleArrayUpdate("explanation_hi", index, {
                              ...explanation,
                              text: e.target.value,
                            })
                          }
                          placeholder="चरणबद्ध व्याख्या..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={3}
                        />
                        {formData.explanation_hi.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayRemove("explanation_hi", index)
                            }
                            className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          value={explanation.type}
                          onChange={(e) =>
                            handleArrayUpdate("explanation_hi", index, {
                              ...explanation,
                              type: e.target.value as any,
                            })
                          }
                          className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="text">Text</option>
                          <option value="concept">Concept</option>
                          <option value="warning">Warning</option>
                          <option value="tip">Tip</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd("explanation_hi", {
                        text: "",
                        type: "text",
                      })
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    व्याख्या जोड़ें
                  </button>
                </div>
              </div>
            )}

            {/* Marathi Tab */}
            {activeLanguageTab === "mr" && (
              <div className="space-y-6">
                {/* Hints (Marathi) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hints (मराठी) *
                  </label>
                  {formData.hints_mr.map((hint, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={hint.text}
                          onChange={(e) =>
                            handleArrayUpdate("hints_mr", index, {
                              ...hint,
                              text: e.target.value,
                            })
                          }
                          placeholder="विद्यार्थ्यांसाठी उपयुक्त इशारे..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={2}
                        />
                        {formData.hints_mr.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleArrayRemove("hints_mr", index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={hint.code_snippet || ""}
                        onChange={(e) =>
                          handleArrayUpdate("hints_mr", index, {
                            ...hint,
                            code_snippet: e.target.value,
                          })
                        }
                        placeholder="Optional code snippet..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd("hints_mr", { text: "", code_snippet: "" })
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    इशारा जोडा
                  </button>
                </div>

                {/* Explanations (Marathi) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Explanations (मराठी) *
                  </label>
                  {formData.explanation_mr.map((explanation, index) => (
                    <div
                      key={index}
                      className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-2 flex gap-2">
                        <textarea
                          value={explanation.text}
                          onChange={(e) =>
                            handleArrayUpdate("explanation_mr", index, {
                              ...explanation,
                              text: e.target.value,
                            })
                          }
                          placeholder="टप्प्याटप्प्याने स्पष्टीकरण..."
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={3}
                        />
                        {formData.explanation_mr.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayRemove("explanation_mr", index)
                            }
                            className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          value={explanation.type}
                          onChange={(e) =>
                            handleArrayUpdate("explanation_mr", index, {
                              ...explanation,
                              type: e.target.value as any,
                            })
                          }
                          className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="text">Text</option>
                          <option value="concept">Concept</option>
                          <option value="warning">Warning</option>
                          <option value="tip">Tip</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayAdd("explanation_mr", {
                        text: "",
                        type: "text",
                      })
                    }
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    स्पष्टीकरण जोडा
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Code Section */}
        {activeSection === "code" && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Solution Code *
                </label>
                <button
                  type="button"
                  onClick={() => togglePreview("solution_code")}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {showPreview.solution_code ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showPreview.solution_code ? "Hide" : "Preview"}
                </button>
              </div>
              <textarea
                value={formData.solution_code}
                onChange={(e) =>
                  handleInputChange("solution_code", e.target.value)
                }
                placeholder="Complete working code with numbered comments [1], [2], etc..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                rows={12}
                required
              />
              {showPreview.solution_code && formData.solution_code && (
                <div className="mt-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <pre className="overflow-x-auto text-sm">
                    <code>{formData.solution_code}</code>
                  </pre>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Boilerplate Code *
                </label>
                <button
                  type="button"
                  onClick={() => togglePreview("boilerplate_code")}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {showPreview.boilerplate_code ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {showPreview.boilerplate_code ? "Hide" : "Preview"}
                </button>
              </div>
              <textarea
                value={formData.boilerplate_code}
                onChange={(e) =>
                  handleInputChange("boilerplate_code", e.target.value)
                }
                placeholder="Starter code template with TODO comments..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                rows={10}
                required
              />
              {showPreview.boilerplate_code && formData.boilerplate_code && (
                <div className="mt-2 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <pre className="overflow-x-auto text-sm">
                    <code>{formData.boilerplate_code}</code>
                  </pre>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mermaid Diagram *
              </label>
              <textarea
                value={formData.mermaid_diagram}
                onChange={(e) =>
                  handleInputChange("mermaid_diagram", e.target.value)
                }
                placeholder={`flowchart TD\n    A["Start"] --> B["Process"]\n    B --> C["End"]`}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                rows={8}
                required
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use DOUBLE QUOTES for all text labels. Start with diagram type
                (flowchart TD, graph TD, etc.)
              </p>
            </div>
          </div>
        )}

        {/* Visual Elements Section */}
        {activeSection === "visual" && (
          <div className="space-y-6">
            {/* Execution Steps */}
            <div>
              <label className="mb-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Execution Steps with Memory States *
              </label>
              {formData.visual_elements.execution_steps.map(
                (step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                  >
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Step Number
                        </label>
                        <input
                          type="number"
                          value={step.step}
                          onChange={(e) => {
                            const newSteps = [
                              ...formData.visual_elements.execution_steps,
                            ]
                            newSteps[stepIndex] = {
                              ...step,
                              step: parseInt(e.target.value) || 1,
                            }
                            handleInputChange("visual_elements", {
                              ...formData.visual_elements,
                              execution_steps: newSteps,
                            })
                          }}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Line Number (Optional)
                        </label>
                        <input
                          type="number"
                          value={step.line_number || ""}
                          onChange={(e) => {
                            const newSteps = [
                              ...formData.visual_elements.execution_steps,
                            ]
                            newSteps[stepIndex] = {
                              ...step,
                              line_number:
                                parseInt(e.target.value) || undefined,
                            }
                            handleInputChange("visual_elements", {
                              ...formData.visual_elements,
                              execution_steps: newSteps,
                            })
                          }}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Output
                        </label>
                        <input
                          type="text"
                          value={step.output}
                          onChange={(e) => {
                            const newSteps = [
                              ...formData.visual_elements.execution_steps,
                            ]
                            newSteps[stepIndex] = {
                              ...step,
                              output: e.target.value,
                            }
                            handleInputChange("visual_elements", {
                              ...formData.visual_elements,
                              execution_steps: newSteps,
                            })
                          }}
                          placeholder="Output or empty string"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Code Line
                        </label>
                        <input
                          type="text"
                          value={step.line}
                          onChange={(e) => {
                            const newSteps = [
                              ...formData.visual_elements.execution_steps,
                            ]
                            newSteps[stepIndex] = {
                              ...step,
                              line: e.target.value,
                            }
                            handleInputChange("visual_elements", {
                              ...formData.visual_elements,
                              execution_steps: newSteps,
                            })
                          }}
                          placeholder="Code line being executed"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Description
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) => {
                            const newSteps = [
                              ...formData.visual_elements.execution_steps,
                            ]
                            newSteps[stepIndex] = {
                              ...step,
                              description: e.target.value,
                            }
                            handleInputChange("visual_elements", {
                              ...formData.visual_elements,
                              execution_steps: newSteps,
                            })
                          }}
                          placeholder="What happens in this step"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Memory State */}
                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Memory State
                      </label>
                      {step.memory_state.map((variable, varIndex) => (
                        <div
                          key={varIndex}
                          className="mb-2 grid grid-cols-4 gap-2"
                        >
                          <input
                            type="text"
                            value={variable.name}
                            onChange={(e) => {
                              const newSteps = [
                                ...formData.visual_elements.execution_steps,
                              ]
                              const newMemoryState = [...step.memory_state]
                              newMemoryState[varIndex] = {
                                ...variable,
                                name: e.target.value,
                              }
                              newSteps[stepIndex] = {
                                ...step,
                                memory_state: newMemoryState,
                              }
                              handleInputChange("visual_elements", {
                                ...formData.visual_elements,
                                execution_steps: newSteps,
                              })
                            }}
                            placeholder="Variable name"
                            className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          />
                          <input
                            type="text"
                            value={variable.value}
                            onChange={(e) => {
                              const newSteps = [
                                ...formData.visual_elements.execution_steps,
                              ]
                              const newMemoryState = [...step.memory_state]
                              newMemoryState[varIndex] = {
                                ...variable,
                                value: e.target.value,
                              }
                              newSteps[stepIndex] = {
                                ...step,
                                memory_state: newMemoryState,
                              }
                              handleInputChange("visual_elements", {
                                ...formData.visual_elements,
                                execution_steps: newSteps,
                              })
                            }}
                            placeholder="Value"
                            className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          />
                          <input
                            type="text"
                            value={variable.type}
                            onChange={(e) => {
                              const newSteps = [
                                ...formData.visual_elements.execution_steps,
                              ]
                              const newMemoryState = [...step.memory_state]
                              newMemoryState[varIndex] = {
                                ...variable,
                                type: e.target.value,
                              }
                              newSteps[stepIndex] = {
                                ...step,
                                memory_state: newMemoryState,
                              }
                              handleInputChange("visual_elements", {
                                ...formData.visual_elements,
                                execution_steps: newSteps,
                              })
                            }}
                            placeholder="Type"
                            className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={variable.changed}
                              onChange={(e) => {
                                const newSteps = [
                                  ...formData.visual_elements.execution_steps,
                                ]
                                const newMemoryState = [...step.memory_state]
                                newMemoryState[varIndex] = {
                                  ...variable,
                                  changed: e.target.checked,
                                }
                                newSteps[stepIndex] = {
                                  ...step,
                                  memory_state: newMemoryState,
                                }
                                handleInputChange("visual_elements", {
                                  ...formData.visual_elements,
                                  execution_steps: newSteps,
                                })
                              }}
                              className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-slate-500">
                              Changed
                            </span>
                            {step.memory_state.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newSteps = [
                                    ...formData.visual_elements.execution_steps,
                                  ]
                                  const newMemoryState =
                                    step.memory_state.filter(
                                      (_, i) => i !== varIndex
                                    )
                                  newSteps[stepIndex] = {
                                    ...step,
                                    memory_state: newMemoryState,
                                  }
                                  handleInputChange("visual_elements", {
                                    ...formData.visual_elements,
                                    execution_steps: newSteps,
                                  })
                                }}
                                className="ml-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newSteps = [
                            ...formData.visual_elements.execution_steps,
                          ]
                          const newMemoryState = [
                            ...step.memory_state,
                            { name: "", value: "", type: "", changed: false },
                          ]
                          newSteps[stepIndex] = {
                            ...step,
                            memory_state: newMemoryState,
                          }
                          handleInputChange("visual_elements", {
                            ...formData.visual_elements,
                            execution_steps: newSteps,
                          })
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        + Add Variable
                      </button>
                    </div>

                    <div className="mt-4 flex justify-end">
                      {formData.visual_elements.execution_steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSteps =
                              formData.visual_elements.execution_steps.filter(
                                (_, i) => i !== stepIndex
                              )
                            handleInputChange("visual_elements", {
                              ...formData.visual_elements,
                              execution_steps: newSteps,
                            })
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Step
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
              <button
                type="button"
                onClick={() => {
                  const newStep = {
                    step: formData.visual_elements.execution_steps.length + 1,
                    line: "",
                    description: "",
                    output: "",
                    memory_state: [
                      { name: "", value: "", type: "", changed: false },
                    ],
                  }
                  const newSteps = [
                    ...formData.visual_elements.execution_steps,
                    newStep,
                  ]
                  handleInputChange("visual_elements", {
                    ...formData.visual_elements,
                    execution_steps: newSteps,
                  })
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Add Execution Step
              </button>
            </div>

            {/* Concepts */}
            <div>
              <label className="mb-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Key Programming Concepts *
              </label>
              {formData.visual_elements.concepts.map((concept, index) => (
                <div
                  key={index}
                  className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Concept Name
                      </label>
                      <input
                        type="text"
                        value={concept.name}
                        onChange={(e) => {
                          const newConcepts = [
                            ...formData.visual_elements.concepts,
                          ]
                          newConcepts[index] = {
                            ...concept,
                            name: e.target.value,
                          }
                          handleInputChange("visual_elements", {
                            ...formData.visual_elements,
                            concepts: newConcepts,
                          })
                        }}
                        placeholder="e.g., Conditional Statements"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Description
                      </label>
                      <textarea
                        value={concept.description}
                        onChange={(e) => {
                          const newConcepts = [
                            ...formData.visual_elements.concepts,
                          ]
                          newConcepts[index] = {
                            ...concept,
                            description: e.target.value,
                          }
                          handleInputChange("visual_elements", {
                            ...formData.visual_elements,
                            concepts: newConcepts,
                          })
                        }}
                        placeholder="Clear explanation of the concept"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Visual Metaphor
                      </label>
                      <textarea
                        value={concept.visual_metaphor}
                        onChange={(e) => {
                          const newConcepts = [
                            ...formData.visual_elements.concepts,
                          ]
                          newConcepts[index] = {
                            ...concept,
                            visual_metaphor: e.target.value,
                          }
                          handleInputChange("visual_elements", {
                            ...formData.visual_elements,
                            concepts: newConcepts,
                          })
                        }}
                        placeholder="Real-world analogy or metaphor"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {formData.visual_elements.concepts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newConcepts =
                            formData.visual_elements.concepts.filter(
                              (_, i) => i !== index
                            )
                          handleInputChange("visual_elements", {
                            ...formData.visual_elements,
                            concepts: newConcepts,
                          })
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Concept
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newConcept = {
                    name: "",
                    description: "",
                    visual_metaphor: "",
                  }
                  const newConcepts = [
                    ...formData.visual_elements.concepts,
                    newConcept,
                  ]
                  handleInputChange("visual_elements", {
                    ...formData.visual_elements,
                    concepts: newConcepts,
                  })
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="h-4 w-4" />
                Add Concept
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <button
            type="button"
            onClick={handlePreviewExercise}
            className="flex items-center gap-1.5 rounded-md border border-blue-300 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview Exercise
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Create Exercise
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Exercise Preview Modal */}
      {showExercisePreview && (
        <ExercisePreview
          exerciseData={getPreviewData()}
          onClose={() => setShowExercisePreview(false)}
          onSave={handlePreviewSave}
          onEdit={() => setShowExercisePreview(false)}
          isLoading={loading}
        />
      )}
    </div>
  )
}

export default ManualExerciseForm
