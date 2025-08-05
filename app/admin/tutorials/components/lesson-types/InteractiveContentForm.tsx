"use client"

import React, { useEffect, useState } from "react"
import { InteractiveContentData } from "@/app/Learn/types/TutorialTypes"
import {
  BarChart3,
  Code,
  HelpCircle,
  Plus,
  Trash2,
  Type,
  Zap,
} from "lucide-react"

interface InteractiveContentFormProps {
  data: InteractiveContentData | any
  onChange: (data: InteractiveContentData) => void
}

const InteractiveContentForm: React.FC<InteractiveContentFormProps> = ({
  data,
  onChange,
}) => {
  const [formData, setFormData] = useState<InteractiveContentData>({
    contentType: data?.contentType || "text",
    content: data?.content || "",
    interactiveElements: data?.interactiveElements || [],
  })

  useEffect(() => {
    onChange(formData)
  }, [formData, onChange])

  const updateInteractiveElement = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      interactiveElements:
        prev.interactiveElements?.map((element, i) =>
          i === index ? { ...element, [field]: value } : element
        ) || [],
    }))
  }

  const addInteractiveElement = () => {
    setFormData((prev) => ({
      ...prev,
      interactiveElements: [
        ...(prev.interactiveElements || []),
        {
          type: "input",
          question: "",
          correctAnswer: "",
          options: [],
        },
      ],
    }))
  }

  const removeInteractiveElement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      interactiveElements:
        prev.interactiveElements?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateOptions = (
    elementIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      interactiveElements:
        prev.interactiveElements?.map((element, i) =>
          i === elementIndex
            ? {
                ...element,
                options:
                  element.options?.map((option, j) =>
                    j === optionIndex ? value : option
                  ) || [],
              }
            : element
        ) || [],
    }))
  }

  const addOption = (elementIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      interactiveElements:
        prev.interactiveElements?.map((element, i) =>
          i === elementIndex
            ? {
                ...element,
                options: [...(element.options || []), ""],
              }
            : element
        ) || [],
    }))
  }

  const removeOption = (elementIndex: number, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      interactiveElements:
        prev.interactiveElements?.map((element, i) =>
          i === elementIndex
            ? {
                ...element,
                options:
                  element.options?.filter((_, j) => j !== optionIndex) || [],
              }
            : element
        ) || [],
    }))
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      case "diagram":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Type className="h-4 w-4" />
    }
  }

  const getInteractiveTypeIcon = (type: string) => {
    switch (type) {
      case "input":
        return <Type className="h-4 w-4" />
      case "select":
        return <HelpCircle className="h-4 w-4" />
      case "drag":
        return <Zap className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Content Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Content Type
        </label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {["text", "code", "quiz", "diagram"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, contentType: type as any }))
              }
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                formData.contentType === type
                  ? "border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {getContentTypeIcon(type)}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Main Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={formData.contentType === "code" ? 6 : 4}
          className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white ${
            formData.contentType === "code" ? "font-mono text-sm" : ""
          }`}
          placeholder={
            formData.contentType === "text"
              ? "Enter the main text content..."
              : formData.contentType === "code"
                ? "Enter the code content..."
                : formData.contentType === "quiz"
                  ? "Enter quiz instructions..."
                  : "Enter diagram description or mermaid code..."
          }
        />
        {formData.contentType === "diagram" && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            You can use Mermaid syntax for diagrams. Example: graph TD; A--{">"}
            B; B--{">"}C;
          </p>
        )}
      </div>

      {/* Interactive Elements */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Zap className="h-4 w-4" />
            Interactive Elements
          </label>
          <button
            onClick={addInteractiveElement}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Element
          </button>
        </div>

        {formData.interactiveElements &&
        formData.interactiveElements.length > 0 ? (
          <div className="space-y-4">
            {formData.interactiveElements.map((element, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                    {getInteractiveTypeIcon(element.type)}
                    Interactive Element {index + 1}
                  </h4>
                  <button
                    onClick={() => removeInteractiveElement(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Element Type */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Element Type
                    </label>
                    <select
                      value={element.type}
                      onChange={(e) =>
                        updateInteractiveElement(index, "type", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="input">Text Input</option>
                      <option value="select">Multiple Choice</option>
                      <option value="drag">Drag & Drop</option>
                    </select>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Question or Prompt
                    </label>
                    <input
                      type="text"
                      value={element.question}
                      onChange={(e) =>
                        updateInteractiveElement(
                          index,
                          "question",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Enter the question or prompt..."
                    />
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={element.correctAnswer}
                      onChange={(e) =>
                        updateInteractiveElement(
                          index,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Enter the correct answer..."
                    />
                  </div>

                  {/* Options (for select type) */}
                  {element.type === "select" && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          Options
                        </label>
                        <button
                          onClick={() => addOption(index)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          <Plus className="h-3 w-3" />
                          Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {element.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOptions(
                                  index,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                            {element.options && element.options.length > 1 && (
                              <button
                                onClick={() => removeOption(index, optionIndex)}
                                className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )) || []}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-slate-300 py-8 text-center dark:border-slate-600">
            <Zap className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No interactive elements added yet. Click &quot;Add Element&quot;
              to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveContentForm
