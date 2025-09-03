"use client"

import React, { useEffect, useState } from "react"
import {
  Language,
  MultiLessonTutorial,
  TutorialData,
  TutorialLesson,
} from "@/app/Learn/types/TutorialTypes"
import { getLanguages } from "@/lib/getData"
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Loader2,
  Plus,
  Target,
  Trash2,
} from "lucide-react"
import { convertJSONToMermaid } from "../utils/mermaidConverter"
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

  // Mermaid state management for all lessons and components
  const [mermaidCodes, setMermaidCodes] = useState<{ [key: string]: string }>(
    {}
  )

  // Helper functions for Mermaid state management
  const setLessonMermaid = (lessonId: string, code: string) => {
    setMermaidCodes((prev) => ({
      ...prev,
      [`lesson_${lessonId}`]: code,
    }))
    console.log(
      `🎨 Set Mermaid for lesson ${lessonId}:`,
      code.length,
      "characters"
    )
    console.log(`🎨 Mermaid content preview:`, code.substring(0, 100) + "...")
  }

  const setCodeExampleMermaid = (
    lessonId: string,
    exampleIndex: number,
    code: string
  ) => {
    setMermaidCodes((prev) => ({
      ...prev,
      [`lesson_${lessonId}_example_${exampleIndex}`]: code,
    }))
    console.log(
      `🎨 Set Mermaid for lesson ${lessonId} example ${exampleIndex}:`,
      code.length,
      "characters"
    )
  }

  const setQuestionMermaid = (
    lessonId: string,
    questionIndex: number,
    code: string
  ) => {
    setMermaidCodes((prev) => ({
      ...prev,
      [`lesson_${lessonId}_question_${questionIndex}`]: code,
    }))
    console.log(
      `🎨 Set Mermaid for lesson ${lessonId} question ${questionIndex}:`,
      code.length,
      "characters"
    )
  }

  const setSolutionMermaid = (
    lessonId: string,
    questionIndex: number,
    code: string
  ) => {
    setMermaidCodes((prev) => ({
      ...prev,
      [`lesson_${lessonId}_question_${questionIndex}_solution`]: code,
    }))
    console.log(
      `🎨 Set Mermaid for lesson ${lessonId} question ${questionIndex} solution:`,
      code.length,
      "characters"
    )
  }

  const [basicInfo, setBasicInfo] = useState({
    title: "",
    slug: "",
    description: "",
    videoUrl: "",
    programmingLanguage: "",
    difficulty: 1,
    focusAreas: "",
    keyTopics: [""],
    practicalApplications: [""],
    tags: [""],
    index: 1,
    isLocked: true,
    reference: {
      title: "",
      subtitle: "",
      introduction: "",
      examples: [
        {
          title: "",
          description: "",
          code: "",
          explanation: "",
          output: "",
        },
      ],
      key_points: [""],
      common_mistakes: [
        {
          mistake: "",
          why_wrong: "",
          correct_approach: "",
        },
      ],
      syntax_guide: {
        basic_syntax: "",
        parameters: [
          {
            name: "",
            description: "",
            required: false,
          },
        ],
      },
    },
  })

  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<TutorialLesson | null>(
    null
  )
  const [languages, setLanguages] = useState<Language[]>([])
  const [languagesLoading, setLanguagesLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  // Load languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch {
        // Error fetching languages
      } finally {
        setLanguagesLoading(false)
      }
    }
    fetchLanguages()
  }, [])

  // Populate form with AI-generated data when initialData is provided
  useEffect(() => {
    if (initialData && !languagesLoading) {
      console.log("🤖 Populating manual form with AI data:", initialData)

      // Convert programming language to slug if it's an ID
      let programmingLanguageSlug =
        initialData.programmingLanguage?.toString() || ""

      // If the programming language is a number (ID), find the corresponding slug
      if (
        initialData.programmingLanguage &&
        !isNaN(Number(initialData.programmingLanguage))
      ) {
        const languageId = Number(initialData.programmingLanguage)
        const foundLanguage = languages.find((lang) => lang.id === languageId)
        if (foundLanguage) {
          programmingLanguageSlug = foundLanguage.slug
        }
      }

      console.log("🔄 Programming language mapping:", {
        original: initialData.programmingLanguage,
        converted: programmingLanguageSlug,
        availableLanguages: languages.map((l) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
        })),
      })

      console.log("🔍 Reference field in AI data:", {
        hasReference: !!initialData.reference,
        referenceData: initialData.reference,
        referenceKeys: initialData.reference
          ? Object.keys(initialData.reference)
          : "None",
      })

      // Populate basic info from AI data
      const title = initialData.title || ""
      setBasicInfo({
        title: title,
        slug: initialData.slug || generateSlug(title),
        description: initialData.description || "",
        videoUrl: initialData.videoUrl || "",
        programmingLanguage: programmingLanguageSlug,
        difficulty: initialData.difficulty || 1,
        focusAreas: initialData.focusAreas || "",
        keyTopics: initialData.keyTopics || [""],
        practicalApplications: initialData.practicalApplications || [""],
        tags: initialData.tags || [""],
        index: initialData.index || 1,
        isLocked:
          initialData.isLocked !== undefined ? initialData.isLocked : true,
        reference: initialData.reference || {
          title: "",
          subtitle: "",
          introduction: "",
          examples: [
            {
              title: "",
              description: "",
              code: "",
              explanation: "",
              output: "",
            },
          ],
          key_points: [""],
          common_mistakes: [
            {
              mistake: "",
              why_wrong: "",
              correct_approach: "",
            },
          ],
          syntax_guide: {
            basic_syntax: "",
            parameters: [
              {
                name: "",
                description: "",
                required: false,
              },
            ],
          },
        },
      })

      console.log("✅ Basic info set with reference:", {
        hasReference: !!initialData.reference,
        referenceTitle: initialData.reference?.title || "No title",
        referenceExamplesCount: initialData.reference?.examples?.length || 0,
      })

      // Populate tutorial data from AI data
      // Convert AI lesson structure (content) to manual form structure (data)

      // Helper function to generate mermaid code from diagram data
      const generateMermaidCodeFromDiagramData = (diagramData: any): string => {
        if (!diagramData || Object.keys(diagramData).length === 0) {
          return ""
        }
        try {
          if (typeof diagramData === "string") {
            // If already a string, assume it's mermaid code
            return diagramData
          }
          // Convert JSON diagram data to mermaid using our converter
          return convertJSONToMermaid(diagramData)
        } catch (error) {
          console.log("🔧 DIAGRAM CONVERSION ERROR:", {
            originalData: diagramData,
            error: error.message,
            type: diagramData?.type || "unknown",
          })
          return ""
        }
      }

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
                (example: any, idx: number) => {
                  // Log diagram conversion for verification (only if meaningful data)
                  if (
                    example.diagram_data &&
                    Object.keys(example.diagram_data).length > 0
                  ) {
                    console.log(
                      `🎯 DIAGRAM CONVERSION - Code Example ${idx + 1}:`
                    )
                    console.log(
                      "📊 Original JSON:",
                      JSON.stringify(example.diagram_data, null, 2)
                    )
                    const mermaidCode =
                      example.mermaid_code ||
                      generateMermaidCodeFromDiagramData(example.diagram_data)
                    if (mermaidCode) {
                      console.log("🎨 Converted Mermaid:", mermaidCode)
                    } else {
                      console.log(
                        "⚠️ No diagram generated - likely simple content"
                      )
                    }
                    console.log("---")
                  }
                  return {
                    id: example.id || `example-${idx}`,
                    title: example.title || `Example ${idx + 1}`,
                    code: example.code || "",
                    language: programmingLanguageSlug || "javascript",
                    explanation: example.explanation || "",
                    diagram_data: example.diagram_data || "",
                    mermaid_code:
                      example.mermaid_code ||
                      generateMermaidCodeFromDiagramData(example.diagram_data),
                  }
                }
              ),
              practiceHints: lesson.content.practiceHints || [],
              diagram_data: (() => {
                // Log diagram conversion for verification (only if meaningful data)
                if (
                  lesson.content.diagram_data &&
                  Object.keys(lesson.content.diagram_data).length > 0
                ) {
                  console.log("🎯 DIAGRAM CONVERSION - Concept Lesson:")
                  console.log(
                    "📊 Original JSON:",
                    JSON.stringify(lesson.content.diagram_data, null, 2)
                  )
                  const mermaidCode =
                    lesson.content.mermaid_code ||
                    generateMermaidCodeFromDiagramData(
                      lesson.content.diagram_data
                    )
                  if (mermaidCode) {
                    console.log("🎨 Converted Mermaid:", mermaidCode)
                  } else {
                    console.log(
                      "⚠️ No diagram generated - likely simple content"
                    )
                  }
                  console.log("---")
                }
                return lesson.content.diagram_data || null
              })(),
              mermaid_code:
                lesson.content.mermaid_code ||
                generateMermaidCodeFromDiagramData(lesson.content.diagram_data),
              commonMistakes: lesson.content.commonMistakes || [],
              bestPractices: lesson.content.bestPractices || [],
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
                questions: lesson.content.questions.map((q: any) => {
                  // Log diagram conversion for verification (only if meaningful data)
                  if (
                    q.diagram_data &&
                    Object.keys(q.diagram_data).length > 0
                  ) {
                    console.log("🎯 DIAGRAM CONVERSION - MCQ Question:")
                    console.log(
                      "📊 Original JSON:",
                      JSON.stringify(q.diagram_data, null, 2)
                    )
                    const mermaidCode =
                      q.mermaid_code ||
                      generateMermaidCodeFromDiagramData(q.diagram_data)
                    if (mermaidCode) {
                      console.log("🎨 Converted Mermaid:", mermaidCode)
                    } else {
                      console.log(
                        "⚠️ No diagram generated - likely simple content"
                      )
                    }
                    console.log("---")
                  }
                  return {
                    id: q.id || crypto.randomUUID(),
                    question: q.question || "",
                    options: q.options || [],
                    explanation: q.explanation || "",
                    difficulty: q.difficulty || 1,
                    codeSnippet: q.codeSnippet || "",
                    diagram_data: q.diagram_data || "",
                    mermaid_code:
                      q.mermaid_code ||
                      generateMermaidCodeFromDiagramData(q.diagram_data),
                  }
                }),
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
                    diagram_data: "",
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
                  // Log diagram conversion for verification (only if meaningful data)
                  if (
                    q.diagram_data &&
                    Object.keys(q.diagram_data).length > 0
                  ) {
                    console.log(
                      "🎯 DIAGRAM CONVERSION - Code Rearrange Question:"
                    )
                    console.log(
                      "📊 Original JSON:",
                      JSON.stringify(q.diagram_data, null, 2)
                    )
                    const mermaidCode =
                      q.mermaid_code ||
                      generateMermaidCodeFromDiagramData(q.diagram_data)
                    if (mermaidCode) {
                      console.log("🎨 Converted Mermaid:", mermaidCode)
                    } else {
                      console.log(
                        "⚠️ No diagram generated - likely simple content"
                      )
                    }
                    console.log("---")
                  }
                  const aiCodeBlocks = q.codeBlocks || []
                  const aiCorrectOrder = q.correctOrder || []

                  return {
                    id: q.id || crypto.randomUUID(),
                    scenario: q.scenario || "",
                    targetCode: q.targetCode || "",
                    diagram_data: q.diagram_data || "",
                    mermaid_code:
                      q.mermaid_code ||
                      generateMermaidCodeFromDiagramData(q.diagram_data),
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
                    diagram_data: lesson.content.diagram_data || "",
                    mermaid_code:
                      lesson.content.mermaid_code ||
                      generateMermaidCodeFromDiagramData(
                        lesson.content.diagram_data
                      ),
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
                questions: lesson.content.questions.map((q: any) => {
                  // Log diagram conversion for verification (only if meaningful data)
                  if (
                    q.diagram_data &&
                    Object.keys(q.diagram_data).length > 0
                  ) {
                    console.log(
                      "🎯 DIAGRAM CONVERSION - Fill-in-Blanks Question:"
                    )
                    console.log(
                      "📊 Original JSON:",
                      JSON.stringify(q.diagram_data, null, 2)
                    )
                    const mermaidCode =
                      q.mermaid_code ||
                      generateMermaidCodeFromDiagramData(q.diagram_data)
                    if (mermaidCode) {
                      console.log("🎨 Converted Mermaid:", mermaidCode)
                    } else {
                      console.log(
                        "⚠️ No diagram generated - likely simple content"
                      )
                    }
                    console.log("---")
                  }

                  // Log solution diagram conversion if exists (only if meaningful data)
                  if (
                    q.solution?.diagram_data &&
                    Object.keys(q.solution.diagram_data).length > 0
                  ) {
                    console.log(
                      "🎯 DIAGRAM CONVERSION - Fill-in-Blanks Solution:"
                    )
                    console.log(
                      "📊 Original JSON:",
                      JSON.stringify(q.solution.diagram_data, null, 2)
                    )
                    const solutionMermaidCode =
                      q.solution.mermaid_code ||
                      generateMermaidCodeFromDiagramData(
                        q.solution.diagram_data
                      )
                    if (solutionMermaidCode) {
                      console.log("🎨 Converted Mermaid:", solutionMermaidCode)
                    } else {
                      console.log(
                        "⚠️ No diagram generated - likely simple content"
                      )
                    }
                    console.log("---")
                  }
                  return {
                    id: q.id || crypto.randomUUID(),
                    scenario: q.scenario || "",
                    code: q.codeTemplate || "",
                    diagram_data: q.diagram_data || "",
                    mermaid_code:
                      q.mermaid_code ||
                      generateMermaidCodeFromDiagramData(q.diagram_data),
                    blanks: (q.blanks || []).map(
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
                    hints: q.hints || [],
                    solution: q.solution
                      ? {
                          completeCode: q.solution.completeCode || "",
                          explanation: q.solution.explanation || "",
                          diagram_data: q.solution.diagram_data || "",
                          mermaid_code:
                            q.solution.mermaid_code ||
                            generateMermaidCodeFromDiagramData(
                              q.solution.diagram_data
                            ),
                        }
                      : undefined,
                    difficulty: q.difficulty || 1,
                  }
                }),
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
                    diagram_data: lesson.content.diagram_data || "",
                    mermaid_code:
                      lesson.content.mermaid_code ||
                      generateMermaidCodeFromDiagramData(
                        lesson.content.diagram_data
                      ),
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
                          diagram_data:
                            lesson.content.solution.diagram_data || "",
                          mermaid_code:
                            lesson.content.solution.mermaid_code ||
                            generateMermaidCodeFromDiagramData(
                              lesson.content.solution.diagram_data
                            ),
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
  }, [initialData, languagesLoading])

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

  const handleSave = async () => {
    if (
      !basicInfo.title ||
      tutorialData.lessons.length < 5 ||
      tutorialData.lessons.length > 20 ||
      isSaving
    ) {
      return
    }

    setIsSaving(true)

    try {
      console.log("🎨 Final Mermaid state before submission:", mermaidCodes)

      const completeTutorialData: TutorialData = {
        id: crypto.randomUUID(),
        title: basicInfo.title,
        slug: basicInfo.slug || generateSlug(basicInfo.title),
        description: basicInfo.description || "",
        videoUrl: basicInfo.videoUrl || "",
        learningObjectives: tutorialData.learningObjectives.filter(
          (obj) => obj.trim() !== ""
        ),
        keyTopics:
          basicInfo.keyTopics?.filter((topic) => topic.trim() !== "") || [],
        difficulty: basicInfo.difficulty || 1,
        lessons: tutorialData.lessons.map((lesson) => {
          const enrichedLesson = {
            ...lesson,
            type: lesson.type as
              | "concept"
              | "mcq"
              | "codeblock_rearranging"
              | "fill_in_blanks",
          }

          // Inject Mermaid codes into lesson data based on type
          if (lesson.data) {
            const lessonData = { ...lesson.data }

            // Add main lesson Mermaid code
            const mainMermaid = mermaidCodes[`lesson_${lesson.id}`]
            if (mainMermaid) {
              lessonData.mermaid_code = mainMermaid
            }

            switch (lesson.type) {
              case "concept":
                // Add Mermaid to code examples
                if (lessonData.codeExamples) {
                  lessonData.codeExamples = lessonData.codeExamples.map(
                    (example: any, index: number) => ({
                      ...example,
                      mermaid_code:
                        mermaidCodes[`lesson_${lesson.id}_example_${index}`] ||
                        example.mermaid_code ||
                        "",
                    })
                  )
                }
                break

              case "mcq":
                // Add Mermaid to questions
                if (lessonData.questions) {
                  lessonData.questions = lessonData.questions.map(
                    (question: any, index: number) => ({
                      ...question,
                      mermaid_code:
                        mermaidCodes[`lesson_${lesson.id}_question_${index}`] ||
                        question.mermaid_code ||
                        "",
                    })
                  )
                }
                break

              case "codeblock_rearranging":
                // Add Mermaid to questions
                if (lessonData.questions) {
                  lessonData.questions = lessonData.questions.map(
                    (question: any, index: number) => ({
                      ...question,
                      mermaid_code:
                        mermaidCodes[`lesson_${lesson.id}_question_${index}`] ||
                        question.mermaid_code ||
                        "",
                    })
                  )
                }
                break

              case "fill_in_blanks":
                // Add Mermaid to questions and solutions
                if (lessonData.questions) {
                  lessonData.questions = lessonData.questions.map(
                    (question: any, index: number) => {
                      const enrichedQuestion = {
                        ...question,
                        mermaid_code:
                          mermaidCodes[
                            `lesson_${lesson.id}_question_${index}`
                          ] ||
                          question.mermaid_code ||
                          "",
                      }

                      // Add Mermaid to solution if it exists
                      if (enrichedQuestion.solution) {
                        enrichedQuestion.solution = {
                          ...enrichedQuestion.solution,
                          mermaid_code:
                            mermaidCodes[
                              `lesson_${lesson.id}_question_${index}_solution`
                            ] ||
                            enrichedQuestion.solution.mermaid_code ||
                            "",
                        }
                      }

                      return enrichedQuestion
                    }
                  )
                }
                break
            }

            enrichedLesson.data = lessonData
          }

          console.log(`🚀 Enriched lesson ${lesson.id} with Mermaid codes:`, {
            mainMermaid: !!mermaidCodes[`lesson_${lesson.id}`],
            totalMermaidFields: Object.keys(mermaidCodes).filter((key) =>
              key.includes(lesson.id)
            ).length,
          })

          return enrichedLesson
        }),
        practicalApplications:
          basicInfo.practicalApplications?.filter((app) => app.trim() !== "") ||
          [],
        tags: basicInfo.tags?.filter((tag) => tag.trim() !== "") || [],
        programmingLanguage: basicInfo.programmingLanguage,
        focusAreas: basicInfo.focusAreas,
        index: basicInfo.index,
        isLocked: basicInfo.isLocked,
        reference: basicInfo.reference,
      }

      if (onSave) {
        await onSave(completeTutorialData)
      }
    } catch (error) {
      console.error("Error saving tutorial:", error)
      // You could add error handling here, like showing a toast notification
    } finally {
      setIsSaving(false)
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
        mermaidSetters={{
          setLessonMermaid,
          setCodeExampleMermaid,
          setQuestionMermaid,
          setSolutionMermaid,
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tutorial Title
            </label>
            <input
              type="text"
              value={basicInfo.title}
              onChange={(e) => {
                const newTitle = e.target.value
                setBasicInfo((prev) => ({
                  ...prev,
                  title: newTitle,
                  slug: generateSlug(newTitle),
                }))
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Introduction to Variables"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Slug
            </label>
            <input
              type="text"
              value={basicInfo.slug}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="e.g., introduction-to-variables"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Auto-generated from title, but can be customized
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Programming Language
            </label>
            {languagesLoading ? (
              <div className="flex items-center justify-center py-2 text-slate-600 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading languages...</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={basicInfo.programmingLanguage}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      programmingLanguage: e.target.value,
                    }))
                  }
                  className="w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select Language</option>
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.slug}>
                      {lang.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            )}
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

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Index (Order)
            </label>
            <input
              type="number"
              min="1"
              value={basicInfo.index}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  index: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="1"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Display order in the tutorial list
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tutorial Status
            </label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={basicInfo.isLocked}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      isLocked: e.target.checked,
                    }))
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Locked
                </span>
              </label>
            </div>
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
            Video URL (Optional)
          </label>
          <input
            type="url"
            value={basicInfo.videoUrl}
            onChange={(e) =>
              setBasicInfo((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="e.g., https://youtube.com/watch?v=example or https://vimeo.com/123456"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add a video link to supplement the tutorial content (YouTube, Vimeo,
            etc.)
          </p>
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

      {/* Tutorial Reference */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <BookOpen className="h-5 w-5" />
          Tutorial Reference (W3Schools-style)
        </h3>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Create a comprehensive reference page that teaches the complete
          concept with examples, explanations, and syntax guides.
        </p>

        <div className="space-y-4">
          {/* Reference Title & Subtitle */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Reference Title
              </label>
              <input
                type="text"
                value={basicInfo.reference.title}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    reference: {
                      ...prev.reference,
                      title: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="e.g., If Statements"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Subtitle
              </label>
              <input
                type="text"
                value={basicInfo.reference.subtitle}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    reference: {
                      ...prev.reference,
                      subtitle: e.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="e.g., Using the if Statement in C"
              />
            </div>
          </div>

          {/* Introduction */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Introduction
            </label>
            <textarea
              rows={3}
              value={basicInfo.reference.introduction}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  reference: {
                    ...prev.reference,
                    introduction: e.target.value,
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Explain the concept and its importance in programming..."
            />
          </div>

          {/* Examples */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Code Examples (3-4 recommended)
            </label>
            {basicInfo.reference.examples.map((example, index) => (
              <div
                key={index}
                className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-600"
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Example Title
                    </label>
                    <input
                      type="text"
                      value={example.title}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          reference: {
                            ...prev.reference,
                            examples: prev.reference.examples.map((ex, i) =>
                              i === index
                                ? { ...ex, title: e.target.value }
                                : ex
                            ),
                          },
                        }))
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="e.g., Basic Example: When Condition is False"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Expected Output (optional)
                    </label>
                    <input
                      type="text"
                      value={example.output}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          reference: {
                            ...prev.reference,
                            examples: prev.reference.examples.map((ex, i) =>
                              i === index
                                ? { ...ex, output: e.target.value }
                                : ex
                            ),
                          },
                        }))
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Expected output..."
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={example.description}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        reference: {
                          ...prev.reference,
                          examples: prev.reference.examples.map((ex, i) =>
                            i === index
                              ? { ...ex, description: e.target.value }
                              : ex
                          ),
                        },
                      }))
                    }
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Brief description of what this example demonstrates..."
                  />
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Code
                  </label>
                  <textarea
                    rows={4}
                    value={example.code}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        reference: {
                          ...prev.reference,
                          examples: prev.reference.examples.map((ex, i) =>
                            i === index ? { ...ex, code: e.target.value } : ex
                          ),
                        },
                      }))
                    }
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Complete, working code example..."
                  />
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Explanation
                  </label>
                  <textarea
                    rows={3}
                    value={example.explanation}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        reference: {
                          ...prev.reference,
                          examples: prev.reference.examples.map((ex, i) =>
                            i === index
                              ? { ...ex, explanation: e.target.value }
                              : ex
                          ),
                        },
                      }))
                    }
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Detailed explanation of how the code works..."
                  />
                </div>
                {basicInfo.reference.examples.length > 1 && (
                  <button
                    onClick={() =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        reference: {
                          ...prev.reference,
                          examples: prev.reference.examples.filter(
                            (_, i) => i !== index
                          ),
                        },
                      }))
                    }
                    className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Remove Example
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() =>
                setBasicInfo((prev) => ({
                  ...prev,
                  reference: {
                    ...prev.reference,
                    examples: [
                      ...prev.reference.examples,
                      {
                        title: "",
                        description: "",
                        code: "",
                        explanation: "",
                        output: "",
                      },
                    ],
                  },
                }))
              }
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <Plus className="h-4 w-4" />
              Add Example
            </button>
          </div>

          {/* Key Points */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Key Points (Optional)
              </label>
              <button
                onClick={() =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    reference: {
                      ...prev.reference,
                      key_points: [...(prev.reference?.key_points || []), ""],
                    },
                  }))
                }
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                Add Point
              </button>
            </div>
            <div className="space-y-2">
              {(basicInfo.reference?.key_points || []).map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        reference: {
                          ...prev.reference,
                          key_points: (prev.reference?.key_points || []).map(
                            (p, i) => (i === index ? e.target.value : p)
                          ),
                        },
                      }))
                    }
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Important point to remember..."
                  />
                  {(basicInfo.reference?.key_points || []).length > 1 && (
                    <button
                      onClick={() =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          reference: {
                            ...prev.reference,
                            key_points: (
                              prev.reference?.key_points || []
                            ).filter((_, i) => i !== index),
                          },
                        }))
                      }
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Common Mistakes (Optional)
              </label>
              <button
                onClick={() =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    reference: {
                      ...prev.reference,
                      common_mistakes: [
                        ...(prev.reference?.common_mistakes || []),
                        {
                          mistake: "",
                          why_wrong: "",
                          correct_approach: "",
                        },
                      ],
                    },
                  }))
                }
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                Add Mistake
              </button>
            </div>
            <div className="space-y-4">
              {(basicInfo.reference?.common_mistakes || []).map(
                (mistake, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-600"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Common Mistake {index + 1}
                      </h4>
                      {(basicInfo.reference?.common_mistakes || []).length >
                        1 && (
                        <button
                          onClick={() =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              reference: {
                                ...prev.reference,
                                common_mistakes: (
                                  prev.reference?.common_mistakes || []
                                ).filter((_, i) => i !== index),
                              },
                            }))
                          }
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Mistake Description
                        </label>
                        <input
                          type="text"
                          value={mistake.mistake}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              reference: {
                                ...prev.reference,
                                common_mistakes: (
                                  prev.reference?.common_mistakes || []
                                ).map((m, i) =>
                                  i === index
                                    ? { ...m, mistake: e.target.value }
                                    : m
                                ),
                              },
                            }))
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="What mistake do students commonly make?"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          {`Why It's Wrong`}
                        </label>
                        <textarea
                          rows={2}
                          value={mistake.why_wrong}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              reference: {
                                ...prev.reference,
                                common_mistakes: (
                                  prev.reference?.common_mistakes || []
                                ).map((m, i) =>
                                  i === index
                                    ? { ...m, why_wrong: e.target.value }
                                    : m
                                ),
                              },
                            }))
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="Explain why this approach is incorrect..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                          Correct Approach
                        </label>
                        <textarea
                          rows={2}
                          value={mistake.correct_approach}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              reference: {
                                ...prev.reference,
                                common_mistakes: (
                                  prev.reference?.common_mistakes || []
                                ).map((m, i) =>
                                  i === index
                                    ? { ...m, correct_approach: e.target.value }
                                    : m
                                ),
                              },
                            }))
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          placeholder="The correct way to handle this situation..."
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Syntax Guide */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Syntax Guide (Optional)
            </label>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Basic Syntax Template
                </label>
                <textarea
                  rows={3}
                  value={basicInfo.reference?.syntax_guide?.basic_syntax || ""}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      reference: {
                        ...prev.reference,
                        syntax_guide: {
                          ...(prev.reference?.syntax_guide || {}),
                          basic_syntax: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="if (condition) {
    // code to execute
}"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Parameters/Components
                  </label>
                  <button
                    onClick={() =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        reference: {
                          ...prev.reference,
                          syntax_guide: {
                            ...(prev.reference?.syntax_guide || {}),
                            parameters: [
                              ...(prev.reference?.syntax_guide?.parameters ||
                                []),
                              {
                                name: "",
                                description: "",
                                required: false,
                              },
                            ],
                          },
                        },
                      }))
                    }
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add Parameter
                  </button>
                </div>
                <div className="space-y-2">
                  {(basicInfo.reference?.syntax_guide?.parameters || []).map(
                    (param, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 rounded border border-slate-200 p-2 dark:border-slate-600"
                      >
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={param.name}
                            onChange={(e) =>
                              setBasicInfo((prev) => ({
                                ...prev,
                                reference: {
                                  ...prev.reference,
                                  syntax_guide: {
                                    ...(prev.reference?.syntax_guide || {}),
                                    parameters: (
                                      prev.reference?.syntax_guide
                                        ?.parameters || []
                                    ).map((p, i) =>
                                      i === index
                                        ? { ...p, name: e.target.value }
                                        : p
                                    ),
                                  },
                                },
                              }))
                            }
                            className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="Parameter name (e.g., condition)"
                          />
                          <textarea
                            rows={2}
                            value={param.description}
                            onChange={(e) =>
                              setBasicInfo((prev) => ({
                                ...prev,
                                reference: {
                                  ...prev.reference,
                                  syntax_guide: {
                                    ...(prev.reference?.syntax_guide || {}),
                                    parameters: (
                                      prev.reference?.syntax_guide
                                        ?.parameters || []
                                    ).map((p, i) =>
                                      i === index
                                        ? {
                                            ...p,
                                            description: e.target.value,
                                          }
                                        : p
                                    ),
                                  },
                                },
                              }))
                            }
                            className="w-full rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            placeholder="What this parameter/component does..."
                          />
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={param.required}
                              onChange={(e) =>
                                setBasicInfo((prev) => ({
                                  ...prev,
                                  reference: {
                                    ...prev.reference,
                                    syntax_guide: {
                                      ...(prev.reference?.syntax_guide || {}),
                                      parameters: (
                                        prev.reference?.syntax_guide
                                          ?.parameters || []
                                      ).map((p, i) =>
                                        i === index
                                          ? {
                                              ...p,
                                              required: e.target.checked,
                                            }
                                          : p
                                      ),
                                    },
                                  },
                                }))
                              }
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                            />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Required
                            </span>
                          </label>
                        </div>
                        {(basicInfo.reference?.syntax_guide?.parameters || [])
                          .length > 1 && (
                          <button
                            onClick={() =>
                              setBasicInfo((prev) => ({
                                ...prev,
                                reference: {
                                  ...prev.reference,
                                  syntax_guide: {
                                    ...(prev.reference?.syntax_guide || {}),
                                    parameters: (
                                      prev.reference?.syntax_guide
                                        ?.parameters || []
                                    ).filter((_, i) => i !== index),
                                  },
                                },
                              }))
                            }
                            className="mt-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
            tutorialData.lessons.length > 20 ||
            isSaving
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving Tutorial..." : "Save Tutorial"}
        </button>
      </div>
    </div>
  )
}

export default MultiLessonTutorialForm
