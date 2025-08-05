"use client"

import React, { useEffect, useState } from "react"
import { QuestionToCodeData } from "@/app/Learn/types/TutorialTypes"
import { Code, FileText, Lightbulb, Plus, Trash2 } from "lucide-react"

interface QuestionToCodeFormProps {
  data: QuestionToCodeData | any
  onChange: (data: QuestionToCodeData) => void
}

const QuestionToCodeForm: React.FC<QuestionToCodeFormProps> = ({
  data,
  onChange,
}) => {
  const [formData, setFormData] = useState({
    question: data?.question || "",
    expectedPseudocode: data?.expectedPseudocode || [""],
    expectedCode: data?.expectedCode || "",
    hints: data?.hints || [""],
  })

  useEffect(() => {
    if (formData.question.trim()) {
      onChange({
        ...formData,
        expectedPseudocode: formData.expectedPseudocode.filter((step) =>
          step.trim()
        ),
        hints: formData.hints.filter((hint) => hint.trim()),
      })
    }
  }, [formData, onChange])

  const updateField = (field: keyof QuestionToCodeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateArrayField = (
    field: "expectedPseudocode" | "hints",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayField = (field: "expectedPseudocode" | "hints") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayField = (
    field: "expectedPseudocode" | "hints",
    index: number
  ) => {
    const currentArray = formData[field]
    if (currentArray.length <= 1) return

    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Problem Statement / Question
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => updateField("question", e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder={
            "Describe the problem or question that students need to solve with code. For example: 'Write a function that calculates the factorial of a number.'"
          }
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <FileText className="h-4 w-4" />
            Expected Pseudocode Steps
          </label>
          <button
            onClick={() => addArrayField("expectedPseudocode")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {formData.expectedPseudocode.map((step, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 p-3 dark:border-slate-600"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Step {index + 1}
                  </span>
                </div>
                {formData.expectedPseudocode.length > 1 && (
                  <button
                    onClick={() =>
                      removeArrayField("expectedPseudocode", index)
                    }
                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={step}
                onChange={(e) =>
                  updateArrayField("expectedPseudocode", index, e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="e.g., Initialize a variable to store the result"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Expected Code Solution
        </label>
        <div className="relative">
          <textarea
            value={formData.expectedCode}
            onChange={(e) => updateField("expectedCode", e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Enter the complete code solution that implements the pseudocode..."
          />
          <Code className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Hints
          </label>
          <button
            onClick={() => addArrayField("hints")}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Hint
          </button>
        </div>

        <div className="space-y-3">
          {formData.hints.map((hint, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 p-3 dark:border-slate-600"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Hint #{index + 1}
                </span>
                {formData.hints.length > 1 && (
                  <button
                    onClick={() => removeArrayField("hints", index)}
                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <textarea
                value={hint}
                onChange={(e) =>
                  updateArrayField("hints", index, e.target.value)
                }
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Provide a helpful hint to guide students..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preview Sections */}
      {formData.expectedPseudocode.filter((step) => step.trim()).length > 0 && (
        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <h4 className="mb-2 font-medium text-purple-900 dark:text-purple-200">
            Pseudocode Preview:
          </h4>
          <ol className="space-y-1 text-sm text-purple-800 dark:text-purple-300">
            {formData.expectedPseudocode
              .filter((step) => step.trim())
              .map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-medium">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
          </ol>
        </div>
      )}

      {formData.expectedCode.trim() && (
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <h4 className="mb-2 font-medium text-green-900 dark:text-green-200">
            Code Solution Preview:
          </h4>
          <pre className="whitespace-pre-wrap font-mono text-sm text-green-800 dark:text-green-300">
            {formData.expectedCode}
          </pre>
        </div>
      )}
    </div>
  )
}

export default QuestionToCodeForm
