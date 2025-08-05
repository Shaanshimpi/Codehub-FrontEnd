"use client"

import React, { useEffect, useState } from "react"
import {
  MultiLessonTutorial,
  TutorialData,
  TutorialLesson,
} from "@/app/Learn/types/TutorialTypes"
import { ArrowLeft, BookOpen, Plus, Target } from "lucide-react"
import LessonForm from "./LessonForm"

interface MultiLessonTutorialFormProps {
  onCancel: () => void
  onSave?: (tutorialData: TutorialData) => void
  initialData?: TutorialData | null
}

const MultiLessonTutorialForm: React.FC<MultiLessonTutorialFormProps> = ({
  onCancel,
  onSave,
  initialData,
}) => {
  const [tutorialData, setTutorialData] = useState<MultiLessonTutorial>({
    lessons: [],
    learningObjectives: [""],
  })

  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
    programmingLanguage: "",
    difficulty: 1,
    focusAreas: "",
    keyTopics: [""],
    practicalApplications: [""],
    tags: [""],
  })

  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<TutorialLesson | null>(
    null
  )

  // Populate form with AI-generated data when initialData is provided
  useEffect(() => {
    if (initialData) {
      console.log("🤖 Populating manual form with AI data:", initialData)

      // Populate basic info from AI data
      setBasicInfo({
        title: initialData.title || "",
        description: initialData.description || "",
        programmingLanguage: initialData.programmingLanguage?.toString() || "",
        difficulty: initialData.difficulty || 1,
        focusAreas: initialData.focusAreas || "",
        keyTopics: initialData.keyTopics || [""],
        practicalApplications: initialData.practicalApplications || [""],
        tags: initialData.tags || [""],
      })

      // Populate tutorial data from AI data
      // Convert AI lesson structure (content) to manual form structure (data)
      const convertAILessonToManualForm = (lesson: any): any => {
        if (!lesson.content) {
          // Already in manual form or no content
          return lesson
        }

        let convertedData = null
        let lessonDescription = lesson.description || ""

        switch (lesson.type) {
          case "concept":
            convertedData = {
              explanation: lesson.content.explanation || "",
              keyPoints: lesson.content.keyPoints || [],
              codeExamples: (lesson.content.codeExamples || []).map(
                (example: any, idx: number) => ({
                  id: example.id || `example-${idx}`,
                  title: example.title || `Example ${idx + 1}`,
                  code: example.code || "",
                  language:
                    initialData.programmingLanguage?.toString() || "javascript",
                  explanation: example.explanation || "",
                  mermaid_diagram: example.mermaid_diagram || "",
                })
              ),
              practiceHints: lesson.content.practiceHints || [],
              mermaid: lesson.content.mermaid || "",
              commonMistakes: lesson.content.commonMistakes || [],
              bestPractices: lesson.content.bestPractices || [],
              visualElements: {
                diagrams: lesson.content.mermaid
                  ? [lesson.content.mermaid]
                  : [],
                concepts: [],
              },
            }
            break

          case "mcq":
            // AI generates full questions array with multiple questions
            // Manual form now supports the same structure
            if (
              lesson.content.questions &&
              lesson.content.questions.length > 0
            ) {
              convertedData = {
                questions: lesson.content.questions.map((q: any) => ({
                  id: q.id || crypto.randomUUID(),
                  question: q.question || "",
                  options: q.options || [],
                  explanation: q.explanation || "",
                  difficulty: q.difficulty || 1,
                  codeSnippet: q.codeSnippet || "",
                  mermaid_diagram: q.mermaid_diagram || "",
                })),
              }
              // Set lesson description to first question for summary
              lessonDescription =
                lesson.content.questions[0]?.question || lessonDescription
            } else {
              // No questions - create default structure
              convertedData = {
                questions: [
                  {
                    id: crypto.randomUUID(),
                    question: "",
                    options: [
                      { id: crypto.randomUUID(), text: "", isCorrect: false },
                      { id: crypto.randomUUID(), text: "", isCorrect: false },
                    ],
                    explanation: "",
                    difficulty: 1,
                    codeSnippet: "",
                    mermaid_diagram: "",
                  },
                ],
              }
            }
            break

          case "codeblock_rearranging":
            // AI generates questions[] array, manual form expects same structure
            if (
              lesson.content.questions &&
              lesson.content.questions.length > 0
            ) {
              convertedData = {
                questions: lesson.content.questions.map((q: any) => {
                  const aiCodeBlocks = q.codeBlocks || []
                  const aiCorrectOrder = q.correctOrder || []

                  return {
                    id: q.id || crypto.randomUUID(),
                    scenario: q.scenario || "",
                    targetCode: q.targetCode || "",
                    mermaid_diagram: q.mermaid_diagram || "",
                    blocks: aiCodeBlocks.map((block: any, index: number) => {
                      // Find the correct order for this block
                      const orderIndex = aiCorrectOrder.indexOf(block.id)
                      return {
                        id: block.id || `block-${index}`,
                        code: block.content || "",
                        correctOrder:
                          orderIndex >= 0 ? orderIndex + 1 : index + 1,
                      }
                    }),
                    hints: q.hints || [],
                    difficulty: q.difficulty || 1,
                  }
                }),
              }
              // Set lesson description to first question's scenario for summary
              lessonDescription =
                lesson.content.questions[0]?.scenario || lessonDescription
            } else {
              // Handle legacy single question format or create default structure
              const aiCodeBlocks = lesson.content.codeBlocks || []
              const aiCorrectOrder = lesson.content.correctOrder || []

              convertedData = {
                questions: [
                  {
                    id: crypto.randomUUID(),
                    scenario: lesson.content.scenario || "",
                    targetCode: lesson.content.targetCode || "",
                    mermaid_diagram: lesson.content.mermaid_diagram || "",
                    blocks: aiCodeBlocks.map((block: any, index: number) => {
                      const orderIndex = aiCorrectOrder.indexOf(block.id)
                      return {
                        id: block.id || `block-${index}`,
                        code: block.content || "",
                        correctOrder:
                          orderIndex >= 0 ? orderIndex + 1 : index + 1,
                      }
                    }),
                    hints: lesson.content.hints || [],
                    difficulty: 1,
                  },
                ],
              }
            }
            break

          case "fill_in_blanks":
            // AI generates questions[] array, manual form expects same structure
            if (
              lesson.content.questions &&
              lesson.content.questions.length > 0
            ) {
              convertedData = {
                questions: lesson.content.questions.map((q: any) => ({
                  id: q.id || crypto.randomUUID(),
                  scenario: q.scenario || "",
                  code: q.codeTemplate || "",
                  mermaid_diagram: q.mermaid_diagram || "",
                  blanks: (q.blanks || []).map((blank: any, index: number) => ({
                    id: blank.id || `blank-${index}`,
                    position: blank.position || index,
                    type: blank.type || "text",
                    correctAnswer: blank.correctAnswer || "",
                    options: blank.options || [],
                    hint: blank.hint || "",
                    explanation: blank.explanation || "",
                  })),
                  hints: q.hints || [],
                  solution: q.solution
                    ? {
                        completeCode: q.solution.completeCode || "",
                        explanation: q.solution.explanation || "",
                        mermaid_diagram: q.solution.mermaid_diagram || "",
                      }
                    : undefined,
                  difficulty: q.difficulty || 1,
                })),
              }
              // Set lesson description to first question's scenario for summary
              lessonDescription =
                lesson.content.questions[0]?.scenario || lessonDescription
            } else {
              // Handle legacy single question format or create default structure
              convertedData = {
                questions: [
                  {
                    id: crypto.randomUUID(),
                    scenario: lesson.content.scenario || "",
                    code: lesson.content.codeTemplate || "",
                    mermaid_diagram: lesson.content.mermaid_diagram || "",
                    blanks: (lesson.content.blanks || []).map(
                      (blank: any, index: number) => ({
                        id: blank.id || `blank-${index}`,
                        position: blank.position || index,
                        type: blank.type || "text",
                        correctAnswer: blank.correctAnswer || "",
                        options: blank.options || [],
                        hint: blank.hint || "",
                        explanation: blank.explanation || "",
                      })
                    ),
                    hints: lesson.content.hints || [],
                    solution: lesson.content.solution
                      ? {
                          completeCode:
                            lesson.content.solution.completeCode || "",
                          explanation:
                            lesson.content.solution.explanation || "",
                          mermaid_diagram:
                            lesson.content.solution.mermaid_diagram || "",
                        }
                      : undefined,
                    difficulty: 1,
                  },
                ],
              }
            }
            break

          default:
            convertedData = lesson.content
        }

        return {
          ...lesson,
          description: lessonDescription, // Use updated description with question text for MCQ
          data: convertedData,
          content: undefined, // Remove content to avoid confusion
        }
      }

      const convertedLessons = (initialData.lessons || []).map((lesson: any) =>
        convertAILessonToManualForm(lesson)
      )

      setTutorialData({
        lessons: convertedLessons,
        learningObjectives: initialData.learningObjectives || [""],
      })
    }
  }, [initialData])

  const handleAddLesson = () => {
    setEditingLesson(null)
    setShowLessonForm(true)
  }

  const handleEditLesson = (lesson: TutorialLesson) => {
    setEditingLesson(lesson)
    setShowLessonForm(true)
  }

  const handleSaveLesson = (lesson: TutorialLesson) => {
    if (editingLesson) {
      setTutorialData((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => (l.id === lesson.id ? lesson : l)),
      }))
    } else {
      setTutorialData((prev) => ({
        ...prev,
        lessons: [
          ...prev.lessons,
          { ...lesson, order: prev.lessons.length + 1 },
        ],
      }))
    }
    setShowLessonForm(false)
    setEditingLesson(null)
  }

  const handleDeleteLesson = (lessonId: string) => {
    setTutorialData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((l) => l.id !== lessonId),
    }))
  }

  const updateArrayField = (
    field: "learningObjectives",
    index: number,
    value: string
  ) => {
    setTutorialData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayField = (field: "learningObjectives") => {
    setTutorialData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayField = (field: "learningObjectives", index: number) => {
    setTutorialData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const updateBasicArrayField = (
    field: "keyTopics" | "practicalApplications" | "tags",
    index: number,
    value: string
  ) => {
    setBasicInfo((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addBasicArrayField = (
    field: "keyTopics" | "practicalApplications" | "tags"
  ) => {
    setBasicInfo((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeBasicArrayField = (
    field: "keyTopics" | "practicalApplications" | "tags",
    index: number
  ) => {
    setBasicInfo((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    if (
      !basicInfo.title ||
      tutorialData.lessons.length < 5 ||
      tutorialData.lessons.length > 20
    ) {
      return
    }

    const completeTutorialData: TutorialData = {
      id: crypto.randomUUID(),
      title: basicInfo.title,
      description: basicInfo.description || "",
      learningObjectives: tutorialData.learningObjectives.filter(
        (obj) => obj.trim() !== ""
      ),
      keyTopics:
        basicInfo.keyTopics?.filter((topic) => topic.trim() !== "") || [],
      difficulty: basicInfo.difficulty || 1,
      lessons: tutorialData.lessons.map((lesson) => ({
        ...lesson,
        type: lesson.type as
          | "concept"
          | "mcq"
          | "codeblock_rearranging"
          | "fill_in_blanks",
      })),
      practicalApplications:
        basicInfo.practicalApplications?.filter((app) => app.trim() !== "") ||
        [],
      tags: basicInfo.tags?.filter((tag) => tag.trim() !== "") || [],
      programmingLanguage: basicInfo.programmingLanguage,
      focusAreas: basicInfo.focusAreas,
    }

    if (onSave) {
      onSave(completeTutorialData)
    }
  }

  if (showLessonForm) {
    return (
      <LessonForm
        lesson={editingLesson}
        onSave={handleSaveLesson}
        onCancel={() => {
          setShowLessonForm(false)
          setEditingLesson(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData
              ? "Edit AI-Generated Tutorial"
              : "Create Multi-Lesson Tutorial"}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {initialData
              ? "Review and edit the AI-generated tutorial content before submitting"
              : "Build a comprehensive tutorial with multiple interactive lessons"}
          </p>
          {initialData && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
                <span className="text-xs">🤖</span>
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                This tutorial was pre-filled with AI-generated content
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <BookOpen className="h-5 w-5" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tutorial Title
            </label>
            <input
              type="text"
              value={basicInfo.title}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Introduction to Variables"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Programming Language
            </label>
            <select
              value={basicInfo.programmingLanguage}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  programmingLanguage: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select Language</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Difficulty Level
            </label>
            <select
              value={basicInfo.difficulty}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  difficulty: parseInt(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value={1}>1 - Beginner</option>
              <option value={2}>2 - Intermediate</option>
              <option value={3}>3 - Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            value={basicInfo.description}
            onChange={(e) =>
              setBasicInfo((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Describe what students will learn in this tutorial..."
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Focus Areas (Optional)
          </label>
          <textarea
            value={basicInfo.focusAreas}
            onChange={(e) =>
              setBasicInfo((prev) => ({ ...prev, focusAreas: e.target.value }))
            }
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder={
              "Specify particular areas to focus on or teaching approaches you'd like to emphasize..."
            }
          />
        </div>
      </div>

      {/* Key Topics */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Target className="h-5 w-5" />
          Key Topics
        </h3>

        {basicInfo.keyTopics.map((topic, index) => (
          <div key={index} className="mb-3 flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) =>
                updateBasicArrayField("keyTopics", index, e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Variables, Functions, Loops"
            />
            {basicInfo.keyTopics.length > 1 && (
              <button
                onClick={() => removeBasicArrayField("keyTopics", index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => addBasicArrayField("keyTopics")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Add Topic
        </button>
      </div>

      {/* Practical Applications */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Target className="h-5 w-5" />
          Practical Applications
        </h3>

        {basicInfo.practicalApplications.map((application, index) => (
          <div key={index} className="mb-3 flex gap-2">
            <input
              type="text"
              value={application}
              onChange={(e) =>
                updateBasicArrayField(
                  "practicalApplications",
                  index,
                  e.target.value
                )
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Building web forms, Data processing, API development"
            />
            {basicInfo.practicalApplications.length > 1 && (
              <button
                onClick={() =>
                  removeBasicArrayField("practicalApplications", index)
                }
                className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => addBasicArrayField("practicalApplications")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Tags */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Target className="h-5 w-5" />
          Tags
        </h3>

        {basicInfo.tags.map((tag, index) => (
          <div key={index} className="mb-3 flex gap-2">
            <input
              type="text"
              value={tag}
              onChange={(e) =>
                updateBasicArrayField("tags", index, e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., beginner, syntax, programming"
            />
            {basicInfo.tags.length > 1 && (
              <button
                onClick={() => removeBasicArrayField("tags", index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => addBasicArrayField("tags")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </button>
      </div>

      {/* Learning Objectives */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Target className="h-5 w-5" />
          Learning Objectives
        </h3>

        {tutorialData.learningObjectives.map((objective, index) => (
          <div key={index} className="mb-3 flex gap-2">
            <input
              type="text"
              value={objective}
              onChange={(e) =>
                updateArrayField("learningObjectives", index, e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Understand variable declaration and assignment"
            />
            {tutorialData.learningObjectives.length > 1 && (
              <button
                onClick={() => removeArrayField("learningObjectives", index)}
                className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => addArrayField("learningObjectives")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Add Objective
        </button>
      </div>

      {/* Lessons */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              Lessons ({tutorialData.lessons.length}/20)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tutorialData.lessons.length < 5
                ? `Add ${5 - tutorialData.lessons.length} more lesson(s) (minimum 5 required)`
                : `${20 - tutorialData.lessons.length} lesson(s) remaining (maximum 20)`}
            </p>
          </div>
          <button
            onClick={handleAddLesson}
            disabled={tutorialData.lessons.length >= 20}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </button>
        </div>

        {tutorialData.lessons.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 py-8 text-center dark:border-slate-600">
            <p className="text-slate-500 dark:text-slate-400">
              No lessons added yet. Click &quot;Add Lesson&quot; to get started.
            </p>
            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
              Minimum 5 lessons required to save tutorial
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tutorialData.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Type:{" "}
                        {lesson.type === "concept"
                          ? "Concept Explanation"
                          : lesson.type === "mcq"
                            ? "Multiple Choice Question"
                            : lesson.type === "codeblock_rearranging"
                              ? "Code Block Rearranging"
                              : lesson.type === "fill_in_blanks"
                                ? "Fill in the Blanks"
                                : lesson.type.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Lesson count warning */}
        {tutorialData.lessons.length > 0 && tutorialData.lessons.length < 5 && (
          <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Warning:</strong> You need at least{" "}
              {5 - tutorialData.lessons.length} more lesson(s) to save this
              tutorial.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={
            !basicInfo.title ||
            tutorialData.lessons.length < 5 ||
            tutorialData.lessons.length > 20
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Tutorial
        </button>
      </div>
    </div>
  )
}

export default MultiLessonTutorialForm
