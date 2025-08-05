"use client"

import React, { useEffect, useState } from "react"
import { PracticalExampleData } from "@/app/Learn/types/TutorialTypes"
import { AlertTriangle, Lightbulb, Play, Plus, Trash2 } from "lucide-react"

interface PracticalExampleFormProps {
  data: PracticalExampleData | any
  onChange: (data: PracticalExampleData) => void
}

const PracticalExampleForm: React.FC<PracticalExampleFormProps> = ({
  data,
  onChange,
}) => {
  const [formData, setFormData] = useState<PracticalExampleData>({
    scenario: data?.scenario || "",
    problem: data?.problem || "",
    stepByStepSolution: data?.stepByStepSolution || [
      {
        step: 1,
        description: "",
        code: "",
        output: "",
      },
    ],
    keyLearnings: data?.keyLearnings || [""],
    commonMistakes: data?.commonMistakes || [""],
    relatedConcepts: data?.relatedConcepts || [""],
  })

  useEffect(() => {
    onChange(formData)
  }, [formData, onChange])

  const updateStepSolution = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      stepByStepSolution: prev.stepByStepSolution.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }))
  }

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      stepByStepSolution: [
        ...prev.stepByStepSolution,
        {
          step: prev.stepByStepSolution.length + 1,
          description: "",
          code: "",
          output: "",
        },
      ],
    }))
  }

  const removeStep = (index: number) => {
    if (formData.stepByStepSolution.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      stepByStepSolution: prev.stepByStepSolution
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step: i + 1 })),
    }))
  }

  const updateArrayField = (
    fieldName: "keyLearnings" | "commonMistakes" | "relatedConcepts",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item: string, i: number) =>
        i === index ? value : item
      ),
    }))
  }

  const addArrayField = (
    fieldName: "keyLearnings" | "commonMistakes" | "relatedConcepts"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""],
    }))
  }

  const removeArrayField = (
    fieldName: "keyLearnings" | "commonMistakes" | "relatedConcepts",
    index: number
  ) => {
    if (formData[fieldName].length <= 1) return
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Scenario */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Real-World Scenario
        </label>
        <textarea
          value={formData.scenario}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, scenario: e.target.value }))
          }
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Describe a real-world scenario where this concept is applied..."
        />
      </div>

      {/* Problem Statement */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Problem Statement
        </label>
        <textarea
          value={formData.problem}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, problem: e.target.value }))
          }
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Define the specific problem to be solved..."
        />
      </div>

      {/* Step-by-Step Solution */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Play className="h-4 w-4" />
            Step-by-Step Solution
          </label>
          <button
            onClick={addStep}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Step
          </button>
        </div>
        <div className="space-y-4">
          {formData.stepByStepSolution.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {step.step}
                  </div>
                  Step {step.step}
                </h4>
                {formData.stepByStepSolution.length > 1 && (
                  <button
                    onClick={() => removeStep(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Description
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateStepSolution(index, "description", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Describe what happens in this step..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Code (Optional)
                    </label>
                    <textarea
                      value={step.code || ""}
                      onChange={(e) =>
                        updateStepSolution(index, "code", e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Code for this step..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Output (Optional)
                    </label>
                    <textarea
                      value={step.output || ""}
                      onChange={(e) =>
                        updateStepSolution(index, "output", e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Expected output..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Learnings */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Lightbulb className="h-4 w-4" />
            Key Learnings
          </label>
          <button
            onClick={() => addArrayField("keyLearnings")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Learning
          </button>
        </div>
        <div className="space-y-2">
          {formData.keyLearnings.map((learning, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400">
                ✓
              </div>
              <input
                type="text"
                value={learning}
                onChange={(e) =>
                  updateArrayField("keyLearnings", index, e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Key learning point..."
              />
              {formData.keyLearnings.length > 1 && (
                <button
                  onClick={() => removeArrayField("keyLearnings", index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <AlertTriangle className="h-4 w-4" />
            Common Mistakes
          </label>
          <button
            onClick={() => addArrayField("commonMistakes")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Mistake
          </button>
        </div>
        <div className="space-y-2">
          {formData.commonMistakes.map((mistake, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                ⚠
              </div>
              <input
                type="text"
                value={mistake}
                onChange={(e) =>
                  updateArrayField("commonMistakes", index, e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Common mistake to avoid..."
              />
              {formData.commonMistakes.length > 1 && (
                <button
                  onClick={() => removeArrayField("commonMistakes", index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Concepts */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Related Concepts
          </label>
          <button
            onClick={() => addArrayField("relatedConcepts")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Concept
          </button>
        </div>
        <div className="space-y-2">
          {formData.relatedConcepts.map((concept, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                #
              </div>
              <input
                type="text"
                value={concept}
                onChange={(e) =>
                  updateArrayField("relatedConcepts", index, e.target.value)
                }
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Related concept..."
              />
              {formData.relatedConcepts.length > 1 && (
                <button
                  onClick={() => removeArrayField("relatedConcepts", index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PracticalExampleForm
