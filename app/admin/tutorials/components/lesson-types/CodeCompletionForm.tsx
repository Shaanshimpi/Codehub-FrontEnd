"use client"

import React, { useEffect, useState } from "react"
import { CodeCompletionData } from "@/app/Learn/types/TutorialTypes"
import { Code, Lightbulb, Plus, Trash2 } from "lucide-react"

interface CodeCompletionFormProps {
  data: CodeCompletionData | any
  onChange: (data: CodeCompletionData) => void
}

const CodeCompletionForm: React.FC<CodeCompletionFormProps> = ({
  data,
  onChange,
}) => {
  const [formData, setFormData] = useState({
    description: data?.description || "",
    starterCode: data?.starterCode || "",
    expectedOutput: data?.expectedOutput || "",
    hints: data?.hints || [""],
  })

  useEffect(() => {
    if (formData.description.trim() && formData.starterCode.trim()) {
      onChange({
        ...formData,
        hints: formData.hints.filter((hint) => hint.trim()),
      })
    }
  }, [formData, onChange])

  const updateField = (field: keyof CodeCompletionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateHint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hints: prev.hints.map((hint, i) => (i === index ? value : hint)),
    }))
  }

  const addHint = () => {
    setFormData((prev) => ({
      ...prev,
      hints: [...prev.hints, ""],
    }))
  }

  const removeHint = (index: number) => {
    if (formData.hints.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Problem Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Describe what the student needs to complete in the code..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Starter Code
        </label>
        <div className="relative">
          <textarea
            value={formData.starterCode}
            onChange={(e) => updateField("starterCode", e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Enter the incomplete code that students will need to complete..."
          />
          <Code className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Use comments like &quot;// TODO: Complete this function&quot; to
          indicate where students should add code
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Expected Output (Optional)
        </label>
        <textarea
          value={formData.expectedOutput}
          onChange={(e) => updateField("expectedOutput", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="What should the completed code output when run? (Leave empty if not applicable)"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Hints
          </label>
          <button
            onClick={addHint}
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
              className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hint #{index + 1}
                  </span>
                </div>
                {formData.hints.length > 1 && (
                  <button
                    onClick={() => removeHint(index)}
                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <textarea
                value={hint}
                onChange={(e) => updateHint(index, e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Enter a helpful hint for students..."
              />
            </div>
          ))}
        </div>
      </div>

      {formData.starterCode.trim() && (
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-200">
            Starter Code Preview:
          </h4>
          <pre className="whitespace-pre-wrap font-mono text-sm text-blue-800 dark:text-blue-300">
            {formData.starterCode}
          </pre>
        </div>
      )}

      {formData.expectedOutput.trim() && (
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <h4 className="mb-2 font-medium text-green-900 dark:text-green-200">
            Expected Output:
          </h4>
          <pre className="whitespace-pre-wrap font-mono text-sm text-green-800 dark:text-green-300">
            {formData.expectedOutput}
          </pre>
        </div>
      )}
    </div>
  )
}

export default CodeCompletionForm
