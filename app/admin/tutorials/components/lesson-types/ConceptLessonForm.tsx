"use client"

import React, { useEffect, useState } from "react"
import { ConceptLessonData } from "@/app/Learn/types/TutorialTypes"
import { Code, Lightbulb, Plus, Trash2 } from "lucide-react"
import { PlantUMLSetters } from "../LessonForm"
import PlantUMLDiagram from "../PlantUMLDiagram"

interface ConceptLessonFormProps {
  data: ConceptLessonData | any
  onChange: (data: ConceptLessonData) => void
  lessonId?: string
  plantUMLSetters?: PlantUMLSetters
}

const ConceptLessonForm: React.FC<ConceptLessonFormProps> = ({
  data,
  onChange,
  lessonId,
  plantUMLSetters,
}) => {
  const [formData, setFormData] = useState<ConceptLessonData>({
    explanation: data?.explanation || "",
    videoUrl: data?.videoUrl || "",
    keyPoints: data?.keyPoints || [""],
    codeExamples: data?.codeExamples || [],
    practiceHints: data?.practiceHints || [""],
    diagram_data: data?.diagram_data || "",
    plantuml_code: data?.plantuml_code || "",
    commonMistakes: data?.commonMistakes || [""],
    bestPractices: data?.bestPractices || [""],
    visualElements: data?.visualElements || { diagrams: [], concepts: [] },
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

  const updateCodeExample = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples.map((example, i) =>
        i === index ? { ...example, [field]: value } : example
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
          diagram_data_diagram: "",
          plantuml_code: "",
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
              {example.diagram_data && (
                <div className="mt-3">
                  <h6 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Example Diagram Preview:
                  </h6>
                  <PlantUMLDiagram
                    diagramData={example.diagram_data}
                    showDebugInfo={true}
                    onPlantUMLChange={(code) => {
                      updateCodeExample(index, "plantuml_code", code)
                      // Use the new PlantUML setter
                      if (plantUMLSetters && lessonId) {
                        plantUMLSetters.setCodeExamplePlantUML(
                          lessonId,
                          index,
                          code
                        )
                      }
                    }}
                  />
                </div>
              )}
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

      {formData.diagram_data && (
        <div>
          <h6 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Concept Diagram Preview:
          </h6>
          <PlantUMLDiagram
            diagramData={formData.diagram_data}
            showDebugInfo={true}
            onPlantUMLChange={(code) => {
              setFormData((prev) => ({ ...prev, plantuml_code: code }))
              // Use the new PlantUML setter
              if (plantUMLSetters && lessonId) {
                plantUMLSetters.setLessonPlantUML(lessonId, code)
              }
            }}
          />
        </div>
      )}

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
