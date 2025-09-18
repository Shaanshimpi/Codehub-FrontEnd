"use client"

import React, { useEffect, useState } from "react"
import { ConceptLessonData } from "@/app/Learn/types/TutorialTypes"
import { Code, Lightbulb, Plus, Trash2 } from "lucide-react"
import { MermaidSetters } from "../LessonForm"
import MermaidDiagram from "../MermaidDiagram"

interface ConceptLessonFormProps {
  data: ConceptLessonData | any
  onChange: (data: ConceptLessonData) => void
  lessonId?: string
  mermaidSetters?: MermaidSetters
}

const ConceptLessonForm: React.FC<ConceptLessonFormProps> = ({
  data,
  onChange,
  lessonId,
  mermaidSetters,
}) => {
  // Helper function to extract mermaid code strings from the data structure
  const extractMermaidCodeStrings = (mermaidData: any[]): string[] => {
    if (!Array.isArray(mermaidData)) return []

    return mermaidData.map((item) => {
      // If it's already a string, return it
      if (typeof item === "string") return item

      // If it's an object with a code property, extract the code (legacy support)
      if (item && typeof item === "object" && item.code) {
        return item.code
      }

      // Fallback: convert to string
      return String(item)
    })
  }

  const [formData, setFormData] = useState<ConceptLessonData>({
    explanation: data?.explanation || "",
    videoUrl: data?.videoUrl || "",
    keyPoints: data?.keyPoints || [""],
    codeExamples:
      data?.codeExamples?.map((example) => ({
        ...example,
        mermaid_code: extractMermaidCodeStrings(example.mermaid_code || []),
      })) || [],
    practiceHints: data?.practiceHints || [""],
    mermaid_code: extractMermaidCodeStrings(data?.mermaid_code || []),
    commonMistakes: data?.commonMistakes || [""],
    bestPractices: data?.bestPractices || [""],
  })

  useEffect(() => {
    onChange(formData)
  }, [formData, onChange])

  const updateKeyPoint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.map((point, i) =>
        i === index ? value : point
      ),
    }))
  }

  const addKeyPoint = () => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ""],
    }))
  }

  const removeKeyPoint = (index: number) => {
    if (formData.keyPoints.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index),
    }))
  }

  const updateCodeExample = (
    index: number,
    field: string,
    value: string | any[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples.map((example, i) =>
        i === index ? { ...example, [field]: value } : example
      ),
    }))
  }

  // Diagram management functions
  // Functions for managing concept-level diagrams
  const addDiagram = () => {
    setFormData((prev) => ({
      ...prev,
      mermaid_code: [
        ...(prev.mermaid_code || []),
        "graph TD\n    A[Start] --> B[End]", // Default mermaid syntax
      ],
    }))
  }

  const removeDiagram = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mermaid_code: (prev.mermaid_code || []).filter((_, i) => i !== index),
    }))
  }

  const updateDiagram = (index: number, newCode: string) => {
    setFormData((prev) => ({
      ...prev,
      mermaid_code: (prev.mermaid_code || []).map((code, i) =>
        i === index ? newCode : code
      ),
    }))
  }

  const addCodeExampleDiagram = (exampleIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples.map((example, i) =>
        i === exampleIndex
          ? {
              ...example,
              mermaid_code: [
                ...(example.mermaid_code || []),
                "graph TD\n    A[Start] --> B[End]", // Default mermaid syntax
              ],
            }
          : example
      ),
    }))
  }

  const removeCodeExampleDiagram = (
    exampleIndex: number,
    diagramIndex: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples.map((example, i) =>
        i === exampleIndex
          ? {
              ...example,
              mermaid_code: (example.mermaid_code || []).filter(
                (_, di) => di !== diagramIndex
              ),
            }
          : example
      ),
    }))
  }

  const addCodeExample = () => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: [
        ...prev.codeExamples,
        {
          id: crypto.randomUUID(),
          title: "",
          code: "",
          explanation: "",
          mermaid_code: [],
        },
      ],
    }))
  }

  const removeCodeExample = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples.filter((_, i) => i !== index),
    }))
  }

  const updatePracticeHint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      practiceHints: prev.practiceHints.map((hint, i) =>
        i === index ? value : hint
      ),
    }))
  }

  const addPracticeHint = () => {
    setFormData((prev) => ({
      ...prev,
      practiceHints: [...prev.practiceHints, ""],
    }))
  }

  const removePracticeHint = (index: number) => {
    if (formData.practiceHints.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      practiceHints: prev.practiceHints.filter((_, i) => i !== index),
    }))
  }
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Main Explanation
        </label>
        <textarea
          value={formData.explanation}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, explanation: e.target.value }))
          }
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Provide a comprehensive explanation of the concept..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Video URL (Optional)
        </label>
        <input
          type="url"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="e.g., https://youtube.com/watch?v=example"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Add a video to supplement the concept explanation
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Key Points
          </label>
          <button
            onClick={addKeyPoint}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Point
          </button>
        </div>
        <div className="space-y-2">
          {formData.keyPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                {index + 1}
              </div>
              <input
                type="text"
                value={point}
                onChange={(e) => updateKeyPoint(index, e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Key learning point..."
              />
              {formData.keyPoints.length > 1 && (
                <button
                  onClick={() => removeKeyPoint(index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Code className="h-4 w-4" />
            Code Examples
          </label>
          <button
            onClick={addCodeExample}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Example
          </button>
        </div>
        <div className="space-y-4">
          {formData.codeExamples.map((example, index) => (
            <div
              key={example.id || `example-${index}`}
              className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  Example {index + 1}
                </h4>
                <button
                  onClick={() => removeCodeExample(index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  value={example.title}
                  onChange={(e) =>
                    updateCodeExample(index, "title", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Example title..."
                />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Code
                </label>
                <textarea
                  value={example.code}
                  onChange={(e) =>
                    updateCodeExample(index, "code", e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Code example..."
                />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Explanation
                </label>
                <textarea
                  value={example.explanation}
                  onChange={(e) =>
                    updateCodeExample(index, "explanation", e.target.value)
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="Explain what this code does..."
                />
              </div>
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Code Example Diagram (Optional)
                  </label>
                </div>
                <div className="space-y-4">
                  {/* Mermaid Diagrams for Code Example */}
                  {(example.mermaid_code || []).length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Mermaid Diagrams (
                          {(example.mermaid_code || []).length})
                        </label>
                        <button
                          type="button"
                          onClick={() => addCodeExampleDiagram(index)}
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </button>
                      </div>
                      {(example.mermaid_code || []).map(
                        (diagram: string, diagramIndex: number) => (
                          <div
                            key={diagramIndex}
                            className="rounded-lg border border-slate-200 p-3 dark:border-slate-600"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Diagram {diagramIndex + 1}
                              </h5>
                              <button
                                type="button"
                                onClick={() =>
                                  removeCodeExampleDiagram(index, diagramIndex)
                                }
                                className="text-red-600 hover:text-red-700 dark:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <MermaidDiagram
                              diagramData={diagram}
                              showDebugInfo={false}
                              onMermaidChange={(code) => {
                                updateCodeExample(
                                  index,
                                  "mermaid_code",
                                  (example.mermaid_code || []).map((c, i) =>
                                    i === diagramIndex ? code : c
                                  )
                                )
                                if (mermaidSetters && lessonId) {
                                  mermaidSetters.setCodeExampleMermaid(
                                    lessonId,
                                    index,
                                    (example.mermaid_code || []).map((c, i) =>
                                      i === diagramIndex ? code : c
                                    )
                                  )
                                }
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center dark:border-slate-600">
                      <button
                        type="button"
                        onClick={() => addCodeExampleDiagram(index)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add Diagram
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Lightbulb className="h-4 w-4" />
            Practice Hints
          </label>
          <button
            onClick={addPracticeHint}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Hint
          </button>
        </div>
        <div className="space-y-2">
          {formData.practiceHints.map((hint, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                💡
              </div>
              <input
                type="text"
                value={hint}
                onChange={(e) => updatePracticeHint(index, e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Practice hint..."
              />
              {formData.practiceHints.length > 1 && (
                <button
                  onClick={() => removePracticeHint(index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Overall Concept Diagrams ({(formData.mermaid_code || []).length})
          </label>
          <button
            type="button"
            onClick={addDiagram}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Diagram
          </button>
        </div>

        {(formData.mermaid_code || []).length > 0 ? (
          <div className="space-y-4">
            {(formData.mermaid_code || []).map(
              (diagram: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Diagram {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeDiagram(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <MermaidDiagram
                    diagramData={diagram}
                    showDebugInfo={false}
                    onMermaidChange={(code) => {
                      updateDiagram(index, code)
                      if (mermaidSetters && lessonId) {
                        const allCodes = (formData.mermaid_code || []).map(
                          (c, i) => (i === index ? code : c)
                        )
                        mermaidSetters.setLessonMermaid(lessonId, allCodes)
                      }
                    }}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
            <p className="text-slate-500 dark:text-slate-400">
              No concept diagrams added yet. Click &quot;Add Diagram&quot; to
              create visual explanations for this lesson.
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Common Mistakes (Optional)
          </label>
          <button
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                commonMistakes: [...(prev.commonMistakes || []), ""],
              }))
            }
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Mistake
          </button>
        </div>
        <div className="space-y-2">
          {(formData.commonMistakes || []).map((mistake, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                ⚠️
              </div>
              <input
                type="text"
                value={mistake}
                onChange={(e) => {
                  const newMistakes = [...(formData.commonMistakes || [])]
                  newMistakes[index] = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    commonMistakes: newMistakes,
                  }))
                }}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Common mistake to avoid..."
              />
              <button
                onClick={() => {
                  const newMistakes = (formData.commonMistakes || []).filter(
                    (_, i) => i !== index
                  )
                  setFormData((prev) => ({
                    ...prev,
                    commonMistakes: newMistakes,
                  }))
                }}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Best Practices (Optional)
          </label>
          <button
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                bestPractices: [...(prev.bestPractices || []), ""],
              }))
            }
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Practice
          </button>
        </div>
        <div className="space-y-2">
          {(formData.bestPractices || []).map((practice, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400">
                ✅
              </div>
              <input
                type="text"
                value={practice}
                onChange={(e) => {
                  const newPractices = [...(formData.bestPractices || [])]
                  newPractices[index] = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    bestPractices: newPractices,
                  }))
                }}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Best practice recommendation..."
              />
              <button
                onClick={() => {
                  const newPractices = (formData.bestPractices || []).filter(
                    (_, i) => i !== index
                  )
                  setFormData((prev) => ({
                    ...prev,
                    bestPractices: newPractices,
                  }))
                }}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConceptLessonForm
