"use client"

import React, { useEffect, useState } from "react"
import { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { getAllTutorials, getLanguages } from "@/lib/getData"
import AIExerciseForm from "../components/AIExerciseForm"
import ExerciseForm from "../components/ExerciseForm"
import ExerciseList from "../components/ExerciseList"
import { Exercise } from "../hooks/useExercises"

type ViewMode = "list" | "create" | "edit" | "ai-generate"

const ExerciseManagementView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [languages, setLanguages] = useState<Language[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

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
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreate = () => {
    setSelectedExercise(null)
    setViewMode("create")
  }

  const handleAIGenerate = () => {
    setSelectedExercise(null)
    setViewMode("ai-generate")
  }

  const handleEdit = (exercise: Exercise) => {
    // Transform server data format to form format
    const transformedExercise = {
      ...exercise,
      // Ensure all basic fields have fallback values
      title: exercise.title || "",
      description: exercise.description || "",
      slug: exercise.slug || "",
      solution_code: exercise.solution_code || "",
      boilerplate_code: exercise.boilerplate_code || "",
      mermaid_diagram: exercise.mermaid_diagram || "",
      difficultyLevel: exercise.difficultyLevel || 1,
      index: exercise.index || 0,
      isLocked: exercise.isLocked || false,
      // Convert string arrays to object arrays for form compatibility
      learning_objectives: Array.isArray(exercise.learning_objectives)
        ? exercise.learning_objectives.map((objective: any) =>
            typeof objective === "string" ? { objective } : objective
          )
        : [{ objective: "" }],
      tags: Array.isArray(exercise.tags)
        ? exercise.tags.map((tag: any) =>
            typeof tag === "string" ? { tag } : tag
          )
        : [{ tag: "" }],
      // Ensure hints array has proper structure
      hints: Array.isArray(exercise.hints)
        ? exercise.hints.map((hint: any) => ({
            text: hint.text || "",
            code_snippet: hint.code_snippet || "",
          }))
        : [{ text: "", code_snippet: "" }],
      // Ensure explanation array has proper structure
      explanation: Array.isArray(exercise.explanation)
        ? exercise.explanation.map((exp: any) => ({
            text: exp.text || "",
            type: exp.type || "text",
            code_ref: Array.isArray(exp.code_ref)
              ? exp.code_ref.map((ref: any) =>
                  typeof ref === "object" && ref.ref_number
                    ? ref.ref_number
                    : ref
                )
              : [],
          }))
        : [{ text: "", type: "text", code_ref: [] }],
      // Ensure visual elements have proper structure
      visual_elements: {
        execution_steps: Array.isArray(
          exercise.visual_elements?.execution_steps
        )
          ? exercise.visual_elements.execution_steps.map((step: any) => ({
              step: step.step || 1,
              line_number: step.line_number || 1,
              line: step.line || "",
              description: step.description || "",
              output: step.output || "",
              memory_state: Array.isArray(step.memory_state)
                ? step.memory_state.map((mem: any) => ({
                    name: mem.name || "",
                    value: mem.value || "",
                    type: mem.type || "",
                    changed: mem.changed || false,
                  }))
                : [{ name: "", value: "", type: "", changed: false }],
            }))
          : [
              {
                step: 1,
                line_number: 1,
                line: "",
                description: "",
                output: "",
                memory_state: [
                  { name: "", value: "", type: "", changed: false },
                ],
              },
            ],
        concepts: Array.isArray(exercise.visual_elements?.concepts)
          ? exercise.visual_elements.concepts.map((concept: any) => ({
              name: concept.name || "",
              description: concept.description || "",
              visual_metaphor: concept.visual_metaphor || "",
            }))
          : [{ name: "", description: "", visual_metaphor: "" }],
      },
      // Ensure metadata fields are properly formatted
      programmingLanguage:
        exercise.programmingLanguage?.id?.toString() ||
        exercise.programmingLanguage ||
        "",
      tutorial: exercise.tutorial?.id?.toString() || exercise.tutorial || "",
    }

    setSelectedExercise(transformedExercise)
    setViewMode("edit")
  }

  const handleCancel = () => {
    setSelectedExercise(null)
    setViewMode("list")
  }

  const handleAIGenerated = (generatedExercise: any) => {
    console.log("🤖 AI Generated Exercise:", generatedExercise)

    // Transform AI response format to match ExerciseForm expectations
    const transformedExercise = {
      ...generatedExercise,
      // Ensure all required form fields are present with defaults
      title: generatedExercise.title || "",
      description: generatedExercise.description || "",
      slug: generatedExercise.slug || "",
      solution_code: generatedExercise.solution_code || "",
      boilerplate_code: generatedExercise.boilerplate_code || "",
      mermaid_diagram: generatedExercise.mermaid_diagram || "",
      hints: generatedExercise.hints || [{ text: "", code_snippet: "" }],
      explanation: Array.isArray(generatedExercise.explanation)
        ? generatedExercise.explanation.map((exp: any) => ({
            text: exp.text || "",
            type: exp.type || "text",
            code_ref: Array.isArray(exp.code_ref) ? exp.code_ref : [],
          }))
        : [{ text: "", type: "text", code_ref: [] }],
      visual_elements: generatedExercise.visual_elements || {
        execution_steps: [
          {
            step: 1,
            line_number: 1,
            line: "",
            description: "",
            output: "",
            memory_state: [{ name: "", value: "", type: "", changed: false }],
          },
        ],
        concepts: [{ name: "", description: "", visual_metaphor: "" }],
      },
      // Convert string arrays to object arrays for form compatibility
      learning_objectives: Array.isArray(generatedExercise.learning_objectives)
        ? generatedExercise.learning_objectives.map((objective: any) =>
            typeof objective === "string" ? { objective } : objective
          )
        : [{ objective: "" }],
      tags: Array.isArray(generatedExercise.tags)
        ? generatedExercise.tags.map((tag: any) =>
            typeof tag === "string" ? { tag } : tag
          )
        : [{ tag: "" }],
      // Ensure metadata fields are present (handle both string IDs and relationship objects)
      programmingLanguage:
        generatedExercise.programmingLanguage?.id?.toString() ||
        generatedExercise.programmingLanguage ||
        "",
      tutorial:
        generatedExercise.tutorial?.id?.toString() ||
        generatedExercise.tutorial ||
        "",
      difficultyLevel: generatedExercise.difficultyLevel || 1,
      isLocked: generatedExercise.isLocked || false,
      index: generatedExercise.index || 0,
    }

    console.log("🔄 Transformed exercise for form:", transformedExercise)

    // Set the transformed exercise as the initial data and switch to create mode
    setSelectedExercise(transformedExercise)
    setViewMode("create")
  }

  const handleSubmit = async (exerciseData: any) => {
    setSubmitLoading(true)

    try {
      // Log the data being sent for debugging
      console.log(
        "🔍 Form data being submitted:",
        JSON.stringify(exerciseData, null, 2)
      )

      // Convert string IDs to numbers and ensure required fields are set
      const processedData = {
        ...exerciseData,
        programmingLanguage: parseInt(exerciseData.programmingLanguage),
        tutorial: parseInt(exerciseData.tutorial),
        difficultyLevel: parseInt(exerciseData.difficultyLevel) || 1,
        // Convert form object arrays back to simple arrays for server
        learning_objectives:
          exerciseData.learning_objectives
            ?.map((obj: any) => (typeof obj === "string" ? obj : obj.objective))
            .filter(Boolean) || [],
        tags:
          exerciseData.tags
            ?.map((obj: any) => (typeof obj === "string" ? obj : obj.tag))
            .filter(Boolean) || [],
        // Transform explanation array to ensure code_ref has proper format
        explanation:
          exerciseData.explanation?.map((exp: any) => ({
            text: exp.text || "",
            type: exp.type || "text",
            code_ref: Array.isArray(exp.code_ref)
              ? exp.code_ref.map((ref: any) =>
                  typeof ref === "number" ? { ref_number: ref } : ref
                )
              : [],
          })) || [],
        // Ensure visual elements have required fields filled
        visual_elements: {
          execution_steps: exerciseData.visual_elements.execution_steps.map(
            (step: any) => ({
              ...step,
              line: step.line || "console.log('Hello World');",
              description: step.description || "Prints hello world to console",
              output: step.output || "",
              memory_state:
                step.memory_state.length > 0
                  ? step.memory_state.map((mem: any) => ({
                      ...mem,
                      name: mem.name || "msg",
                      value: mem.value || "Hello World",
                      type: mem.type || "string",
                    }))
                  : [
                      {
                        name: "msg",
                        value: "Hello World",
                        type: "string",
                        changed: false,
                      },
                    ],
            })
          ),
          concepts: exerciseData.visual_elements.concepts.map(
            (concept: any) => ({
              ...concept,
              name: concept.name || "Variables",
              description:
                concept.description ||
                "Storage containers for data in programming",
              visual_metaphor:
                concept.visual_metaphor ||
                "Like labeled boxes that hold information",
            })
          ),
        },
      }

      console.log(
        "🔍 Processed data being sent:",
        JSON.stringify(processedData, null, 2)
      )

      const method = selectedExercise?.id ? "PUT" : "POST"
      const url = selectedExercise?.id
        ? `/api/exercises/${selectedExercise.id}`
        : "/api/exercises"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(
          `Failed to ${selectedExercise ? "update" : "create"} exercise: ${errorData}`
        )
      }

      const result = await response.json()
      console.log("Exercise saved successfully:", result)

      // Return to list view
      setViewMode("list")
      setSelectedExercise(null)

      // Show success message
      alert(
        `Exercise ${selectedExercise?.id ? "updated" : "created"} successfully!`
      )
    } catch (error) {
      console.error("Error submitting exercise:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {viewMode === "list" && (
          <ExerciseList
            languages={languages}
            onEdit={handleEdit}
            onCreate={handleCreate}
            onAIGenerate={handleAIGenerate}
          />
        )}

        {viewMode === "ai-generate" && (
          <AIExerciseForm
            onCancel={handleCancel}
            onGenerated={handleAIGenerated}
          />
        )}

        {(viewMode === "create" || viewMode === "edit") && (
          <ExerciseForm
            languages={languages}
            tutorials={tutorials}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={selectedExercise}
            isLoading={submitLoading}
          />
        )}
      </div>
    </div>
  )
}

export default ExerciseManagementView
