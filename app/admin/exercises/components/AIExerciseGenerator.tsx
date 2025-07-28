"use client"

import React, { useState } from "react"
import ExerciseForm from "@/app/Learn/Interactives/AIExercise/ExerciseGenerator/ExerciseForm"
import ExerciseSubmit from "@/app/Learn/Interactives/AIExercise/ExerciseGenerator/ExerciseSubmit"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import { ArrowLeft, Bot, Eye, Sparkles } from "lucide-react"
import ExercisePreview from "./ExercisePreview"

interface AIExerciseGeneratorProps {
  onCancel: () => void
  onSuccess: () => void
}

type GenerationStep = "form" | "review" | "preview"

const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<GenerationStep>("form")
  const [exerciseData, setExerciseData] = useState<ExerciseAIData | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGenerate = (data: ExerciseAIData, formValues: any) => {
    setExerciseData(data)
    setFormData(formValues)
    setCurrentStep("review")
  }

  const handleSubmit = async (_submissionData: any) => {
    try {
      setIsSubmitting(true)
      // The ExerciseSubmit component handles the actual submission
      onSuccess()
    } catch {
      // Error handled by ExerciseSubmit component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    setCurrentStep("preview")
  }

  const handleBack = () => {
    if (currentStep === "preview") {
      setCurrentStep("review")
    } else if (currentStep === "review") {
      setCurrentStep("form")
      setExerciseData(null)
      setFormData(null)
    } else {
      onCancel()
    }
  }

  const getPreviewData = () => {
    if (!exerciseData || !formData) return null

    return {
      ...exerciseData,
      programmingLanguageTitle:
        formData.selectedLangObj?.title || "Unknown Language",
      tutorialTitle: formData.selectedTutorialObj?.title || "Unknown Tutorial",
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            currentStep === "form"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-300 bg-blue-100 text-blue-600 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          }`}
        >
          <Bot className="h-3 w-3" />
        </div>
        <div
          className={`h-0.5 w-12 ${
            currentStep === "review" || currentStep === "preview"
              ? "bg-blue-600"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            currentStep === "review"
              ? "border-blue-600 bg-blue-600 text-white"
              : currentStep === "preview"
                ? "border-blue-300 bg-blue-100 text-blue-600 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                : "border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-600 dark:bg-slate-800"
          }`}
        >
          <Sparkles className="h-3 w-3" />
        </div>
        <div
          className={`h-0.5 w-12 ${
            currentStep === "preview"
              ? "bg-blue-600"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
            currentStep === "preview"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-600 dark:bg-slate-800"
          }`}
        >
          <Eye className="h-3 w-3" />
        </div>
      </div>
    </div>
  )

  const renderHeader = () => (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {currentStep === "form"
            ? "Generate Exercise with AI"
            : currentStep === "review"
              ? "Review & Submit Exercise"
              : "Preview Exercise"}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {currentStep === "form"
            ? "Describe your exercise requirements and let AI create it for you"
            : currentStep === "review"
              ? "Review the generated exercise and configure submission settings"
              : "See how your exercise will appear to students"}
        </p>
      </div>
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {currentStep === "form" ? "Cancel" : "Back"}
      </button>
    </div>
  )

  const renderContent = () => {
    switch (currentStep) {
      case "form":
        return (
          <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <ExerciseForm onGenerate={handleGenerate} />
          </div>
        )

      case "review":
        return exerciseData && formData ? (
          <div className="space-y-6">
            {/* Generated Exercise Preview */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Generated Exercise Preview
              </h3>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Exercise Info */}
                <div className="space-y-4">
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Title (English)
                    </label>
                    <div className="rounded-lg bg-slate-50 p-3 text-slate-900 dark:bg-slate-700 dark:text-white">
                      {exerciseData.title_en}
                    </div>
                  </div>

                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Programming Language
                    </label>
                    <div className="rounded-lg bg-slate-50 p-3 text-slate-900 dark:bg-slate-700 dark:text-white">
                      {formData.selectedLangObj?.title || "Unknown"}
                    </div>
                  </div>

                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Difficulty Level
                    </label>
                    <div className="rounded-lg bg-slate-50 p-3 text-slate-900 dark:bg-slate-700 dark:text-white">
                      Level {formData.difficulty} -{" "}
                      {formData.difficulty === 1
                        ? "Beginner"
                        : formData.difficulty === 2
                          ? "Intermediate"
                          : "Advanced"}
                    </div>
                  </div>

                  {formData.exclusions && (
                    <div>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Excluded Concepts
                      </label>
                      <div className="rounded-lg bg-slate-50 p-3 text-slate-900 dark:bg-slate-700 dark:text-white">
                        {formData.exclusions}
                      </div>
                    </div>
                  )}
                </div>

                {/* Code Preview */}
                <div className="space-y-4">
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Solution Code (Preview)
                    </label>
                    <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-slate-900 dark:text-white">
                        {exerciseData.solution_code?.substring(0, 500)}
                        {exerciseData.solution_code &&
                          exerciseData.solution_code.length > 500 &&
                          "..."}
                      </pre>
                    </div>
                  </div>

                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Generated Elements
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Execution Steps:{" "}
                        {exerciseData.visual_elements?.execution_steps
                          ?.length || 0}
                      </div>
                      <div className="flex items-center gap-2 rounded bg-blue-50 p-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        Programming Concepts:{" "}
                        {exerciseData.visual_elements?.concepts?.length || 0}
                      </div>
                      <div className="flex items-center gap-2 rounded bg-purple-50 p-2 text-sm text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        Learning Objectives:{" "}
                        {exerciseData.learning_objectives?.length || 0}
                      </div>
                      <div className="flex items-center gap-2 rounded bg-orange-50 p-2 text-sm text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        Hints: {exerciseData.hints_en?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Configuration */}
            <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={handlePreview}
                    className="flex items-center gap-1.5 rounded-md border border-blue-300 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview Exercise
                  </button>
                </div>
                <ExerciseSubmit
                  formData={formData}
                  exerciseData={exerciseData}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        ) : null

      case "preview": {
        const previewData = getPreviewData()
        return previewData ? (
          <ExercisePreview
            exerciseData={previewData}
            onClose={handleBack}
            onSave={handleSubmit}
            onEdit={handleBack}
            isLoading={isSubmitting}
          />
        ) : null
      }

      default:
        return null
    }
  }

  return (
    <div className={currentStep === "preview" ? "" : "p-4"}>
      {currentStep !== "preview" && (
        <>
          {renderHeader()}
          {renderStepIndicator()}
        </>
      )}
      {renderContent()}
    </div>
  )
}

export default AIExerciseGenerator
