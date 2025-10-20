"use client"

import React, { useEffect, useState } from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"

interface ExerciseFormProps {
  languages: Language[]
  tutorials: Tutorial[]
  onSubmit: (exercise: any) => Promise<void>
  onCancel: () => void
  initialData?: any
  isLoading?: boolean
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  languages,
  tutorials,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    difficultyLevel: 1,
    programmingLanguage: "",
    tutorial: "",
    isLocked: false,
    index: 0,
    hints: [{ text: "", code_snippet: "" }],
    explanation: [
      {
        text: "",
        type: "text",
        code_ref: [],
      },
    ],
    solution_code: "",
    boilerplate_code: "",
    mermaid_diagram: "",
    learning_objectives: [{ objective: "" }],
    tags: [{ tag: "" }],
    visual_elements: {
      execution_steps: [
        {
          step: 1,
          line_number: 1,
          line: "",
          description: "",
          output: "",
          memory_state: [
            {
              name: "",
              value: "",
              type: "",
              changed: false,
            },
          ],
        },
      ],
      concepts: [
        {
          name: "",
          description: "",
          visual_metaphor: "",
        },
      ],
    },
  })

  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([])

  // Generate URL-friendly slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
  }

  useEffect(() => {
    if (initialData) {
      console.log("📝 Setting initial form data:", initialData)

      // Generate slug from title if slug is missing or empty
      const autoSlug =
        !initialData.slug && initialData.title
          ? generateSlug(initialData.title)
          : initialData.slug || ""

      // Ensure proper data structure when editing
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        slug: autoSlug,
        difficultyLevel: initialData.difficultyLevel || 1,
        programmingLanguage:
          initialData.programmingLanguage?.id?.toString() || "",
        tutorial: initialData.tutorial?.id?.toString() || "",
        isLocked: initialData.isLocked || false,
        index: initialData.index || 0,
        hints: initialData.hints || [{ text: "", code_snippet: "" }],
        explanation: initialData.explanation || [
          {
            text: "",
            type: "text",
            code_ref: [],
          },
        ],
        solution_code: initialData.solution_code || "",
        boilerplate_code: initialData.boilerplate_code || "",
        mermaid_diagram: initialData.mermaid_diagram || "",
        learning_objectives: initialData.learning_objectives || [
          { objective: "" },
        ],
        tags: initialData.tags || [{ tag: "" }],
        visual_elements: {
          execution_steps: initialData.visual_elements?.execution_steps || [
            {
              step: 1,
              line_number: 1,
              line: "",
              description: "",
              output: "",
              memory_state: [
                {
                  name: "",
                  value: "",
                  type: "",
                  changed: false,
                },
              ],
            },
          ],
          concepts: initialData.visual_elements?.concepts || [
            {
              name: "",
              description: "",
              visual_metaphor: "",
            },
          ],
        },
      })
    }
  }, [initialData])

  useEffect(() => {
    if (formData.programmingLanguage) {
      const filtered = tutorials.filter(
        (t) =>
          t.programmingLanguage.id.toString() === formData.programmingLanguage
      )
      setFilteredTutorials(filtered)

      // If editing and the current tutorial doesn't match the selected language, clear it
      if (
        formData.tutorial &&
        !filtered.some((t) => t.id.toString() === formData.tutorial)
      ) {
        setFormData((prev) => ({ ...prev, tutorial: "" }))
      }
    } else {
      setFilteredTutorials([])
      // Clear tutorial when no language is selected
      if (formData.tutorial) {
        setFormData((prev) => ({ ...prev, tutorial: "" }))
      }
    }
  }, [formData.programmingLanguage, tutorials, formData.tutorial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    const newSlug = generateSlug(newTitle)
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: newSlug,
    }))
  }

  const addHint = () => {
    setFormData((prev) => ({
      ...prev,
      hints: [...prev.hints, { text: "", code_snippet: "" }],
    }))
  }

  const removeHint = (index: number) => {
    const hints = [...formData.hints]
    hints.splice(index, 1)
    setFormData((prev) => ({ ...prev, hints }))
  }

  const updateHint = (index: number, field: string, value: string) => {
    const hints = [...formData.hints]
    hints[index] = { ...hints[index], [field]: value }
    setFormData((prev) => ({ ...prev, hints }))
  }

  const addExplanation = () => {
    setFormData((prev) => ({
      ...prev,
      explanation: [
        ...prev.explanation,
        { text: "", type: "text", code_ref: [] },
      ],
    }))
  }

  const removeExplanation = (index: number) => {
    const explanation = [...formData.explanation]
    explanation.splice(index, 1)
    setFormData((prev) => ({ ...prev, explanation }))
  }

  const updateExplanation = (index: number, field: string, value: any) => {
    const explanation = [...formData.explanation]
    explanation[index] = { ...explanation[index], [field]: value }
    setFormData((prev) => ({ ...prev, explanation }))
  }

  const addLearningObjective = () => {
    setFormData((prev) => ({
      ...prev,
      learning_objectives: [...prev.learning_objectives, { objective: "" }],
    }))
  }

  const removeLearningObjective = (index: number) => {
    const objectives = [...formData.learning_objectives]
    objectives.splice(index, 1)
    setFormData((prev) => ({ ...prev, learning_objectives: objectives }))
  }

  const updateLearningObjective = (index: number, value: string) => {
    const objectives = [...formData.learning_objectives]
    objectives[index] = { objective: value }
    setFormData((prev) => ({ ...prev, learning_objectives: objectives }))
  }

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, { tag: "" }],
    }))
  }

  const removeTag = (index: number) => {
    const tags = [...formData.tags]
    tags.splice(index, 1)
    setFormData((prev) => ({ ...prev, tags }))
  }

  const updateTag = (index: number, value: string) => {
    const tags = [...formData.tags]
    tags[index] = { tag: value }
    setFormData((prev) => ({ ...prev, tags }))
  }

  const addExecutionStep = () => {
    const currentSteps = formData.visual_elements.execution_steps
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        execution_steps: [
          ...currentSteps,
          {
            step: currentSteps.length + 1,
            line_number: 1,
            line: "",
            description: "",
            output: "",
            memory_state: [
              {
                name: "",
                value: "",
                type: "",
                changed: false,
              },
            ],
          },
        ],
      },
    }))
  }

  const removeExecutionStep = (index: number) => {
    const steps = [...formData.visual_elements.execution_steps]
    steps.splice(index, 1)
    // Renumber remaining steps
    const renumberedSteps = steps.map((step, i) => ({ ...step, step: i + 1 }))
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        execution_steps: renumberedSteps,
      },
    }))
  }

  const updateExecutionStep = (index: number, field: string, value: any) => {
    const steps = [...formData.visual_elements.execution_steps]
    steps[index] = { ...steps[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        execution_steps: steps,
      },
    }))
  }

  const addVariable = (stepIndex: number) => {
    const steps = [...formData.visual_elements.execution_steps]
    steps[stepIndex].memory_state.push({
      name: "",
      value: "",
      type: "",
      changed: false,
    })
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        execution_steps: steps,
      },
    }))
  }

  const removeVariable = (stepIndex: number, varIndex: number) => {
    const steps = [...formData.visual_elements.execution_steps]
    steps[stepIndex].memory_state.splice(varIndex, 1)
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        execution_steps: steps,
      },
    }))
  }

  const updateVariable = (
    stepIndex: number,
    varIndex: number,
    field: string,
    value: string
  ) => {
    const steps = [...formData.visual_elements.execution_steps]
    steps[stepIndex].memory_state[varIndex] = {
      ...steps[stepIndex].memory_state[varIndex],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        execution_steps: steps,
      },
    }))
  }

  const addConcept = () => {
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        concepts: [
          ...prev.visual_elements.concepts,
          {
            name: "",
            description: "",
            visual_metaphor: "",
          },
        ],
      },
    }))
  }

  const removeConcept = (index: number) => {
    const concepts = [...formData.visual_elements.concepts]
    concepts.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        concepts,
      },
    }))
  }

  const updateConcept = (index: number, field: string, value: string) => {
    const concepts = [...formData.visual_elements.concepts]
    concepts[index] = { ...concepts[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      visual_elements: {
        ...prev.visual_elements,
        concepts,
      },
    }))
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit Exercise" : "Create New Exercise"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Exercise Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Enter exercise title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <select
                required
                value={formData.difficultyLevel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficultyLevel: parseInt(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Intermediate</option>
                <option value="3">3 - Advanced</option>
                <option value="4">4 - Expert</option>
                <option value="5">5 - Master</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Programming Language
              </label>
              <select
                required
                value={formData.programmingLanguage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    programmingLanguage: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Select a language</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id.toString()}>
                    {lang.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tutorial (Optional)
              </label>
              <select
                value={formData.tutorial}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tutorial: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Select a tutorial</option>
                {filteredTutorials.map((tutorial) => (
                  <option key={tutorial.id} value={tutorial.id.toString()}>
                    {tutorial.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="exercise-slug"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Index
              </label>
              <input
                type="number"
                value={formData.index}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    index: parseInt(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isLocked"
                checked={formData.isLocked}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isLocked: e.target.checked,
                  }))
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
              />
              <label
                htmlFor="isLocked"
                className="ml-2 text-sm text-slate-700 dark:text-slate-300"
              >
                Lock Exercise
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Enter exercise description"
            />
          </div>

          {/* Main Content Fields */}
          <div className="space-y-6">
            {/* Code Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Solution Code *
                </label>
                <textarea
                  required
                  value={formData.solution_code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      solution_code: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Complete working code with numbered comments [1], [2], etc."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Boilerplate Code *
                </label>
                <textarea
                  required
                  value={formData.boilerplate_code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      boilerplate_code: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Starter code template with TODO comments"
                />
              </div>
            </div>

            {/* Mermaid Diagram */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mermaid Diagram *
              </label>
              <textarea
                required
                value={formData.mermaid_diagram}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mermaid_diagram: e.target.value,
                  }))
                }
                rows={6}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Educational Mermaid flowchart explaining code logic. Must start with diagram type (graph TD, flowchart TD, etc.)"
              />
            </div>

            {/* Hints */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hints *
                </label>
                <button
                  type="button"
                  onClick={addHint}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Hint
                </button>
              </div>

              <div className="space-y-4">
                {formData.hints.map((hint: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Hint {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                          Hint Text *
                        </label>
                        <textarea
                          required
                          value={hint.text}
                          onChange={(e) =>
                            updateHint(index, "text", e.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Clear, practical hint text. Use backticks for inline code."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                          Code Snippet (Optional)
                        </label>
                        <textarea
                          value={hint.code_snippet}
                          onChange={(e) =>
                            updateHint(index, "code_snippet", e.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Optional plain text code example"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanations */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Explanations *
                </label>
                <button
                  type="button"
                  onClick={addExplanation}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Explanation
                </button>
              </div>

              <div className="space-y-4">
                {formData.explanation.map((exp: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Explanation {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeExplanation(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                          Explanation Text *
                        </label>
                        <textarea
                          required
                          value={exp.text}
                          onChange={(e) =>
                            updateExplanation(index, "text", e.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Explanation text starting with [1], [2], etc."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                          Type *
                        </label>
                        <select
                          required
                          value={exp.type}
                          onChange={(e) =>
                            updateExplanation(index, "type", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="text">Text</option>
                          <option value="solution_code">Solution Code</option>
                          <option value="concept">Concept</option>
                          <option value="warning">Warning</option>
                          <option value="tip">Tip</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Learning Objectives *
                </label>
                <button
                  type="button"
                  onClick={addLearningObjective}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Objective
                </button>
              </div>

              <div className="space-y-2">
                {formData.learning_objectives.map((obj: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={obj.objective}
                      onChange={(e) =>
                        updateLearningObjective(index, e.target.value)
                      }
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Specific learning objective starting with action verb"
                    />
                    <button
                      type="button"
                      onClick={() => removeLearningObjective(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Programming Concept Tags *
                </label>
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Tag
                </button>
              </div>

              <div className="space-y-2">
                {formData.tags.map((tag: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={tag.tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Single programming concept or technique"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Elements - Execution Steps */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Execution Steps *
                </label>
                <button
                  type="button"
                  onClick={addExecutionStep}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Step
                </button>
              </div>

              <div className="space-y-4">
                {formData.visual_elements.execution_steps.map(
                  (step: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Step {step.step}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeExecutionStep(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                            Line Number
                          </label>
                          <input
                            type="number"
                            value={step.line_number}
                            onChange={(e) =>
                              updateExecutionStep(
                                index,
                                "line_number",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                            Code Line *
                          </label>
                          <input
                            type="text"
                            required
                            value={step.line}
                            onChange={(e) =>
                              updateExecutionStep(index, "line", e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="Code line being executed"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                          Step Description *
                        </label>
                        <textarea
                          required
                          value={step.description}
                          onChange={(e) =>
                            updateExecutionStep(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="What happens in this step"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                          Output
                        </label>
                        <input
                          type="text"
                          value={step.output}
                          onChange={(e) =>
                            updateExecutionStep(index, "output", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Output produced (leave empty if no output)"
                        />
                      </div>

                      {/* Memory State */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="block text-xs text-slate-600 dark:text-slate-400">
                            Memory State *
                          </label>
                          <button
                            type="button"
                            onClick={() => addVariable(index)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            <Plus className="h-3 w-3" />
                            Add Variable
                          </button>
                        </div>

                        <div className="space-y-2">
                          {step.memory_state.map(
                            (variable: any, varIndex: number) => (
                              <div
                                key={varIndex}
                                className="grid grid-cols-4 items-end gap-2"
                              >
                                <div>
                                  <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                                    Variable *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={variable.name}
                                    onChange={(e) =>
                                      updateVariable(
                                        index,
                                        varIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    placeholder="name"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                                    Value *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={variable.value}
                                    onChange={(e) =>
                                      updateVariable(
                                        index,
                                        varIndex,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    placeholder="value"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                                    Type *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={variable.type}
                                    onChange={(e) =>
                                      updateVariable(
                                        index,
                                        varIndex,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    placeholder="string"
                                  />
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeVariable(index, varIndex)
                                    }
                                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Visual Elements - Concepts */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Key Programming Concepts *
                </label>
                <button
                  type="button"
                  onClick={addConcept}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Concept
                </button>
              </div>

              <div className="space-y-4">
                {formData.visual_elements.concepts.map(
                  (concept: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Concept {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeConcept(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                            Concept Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={concept.name}
                            onChange={(e) =>
                              updateConcept(index, "name", e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="e.g., Variables, Loops, Functions"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                            Description *
                          </label>
                          <textarea
                            required
                            value={concept.description}
                            onChange={(e) =>
                              updateConcept(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="Clear explanation of the concept"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">
                            Visual Metaphor *
                          </label>
                          <textarea
                            required
                            value={concept.visual_metaphor}
                            onChange={(e) =>
                              updateConcept(
                                index,
                                "visual_metaphor",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="Real-world analogy or metaphor"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {initialData ? "Update Exercise" : "Create Exercise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExerciseForm
