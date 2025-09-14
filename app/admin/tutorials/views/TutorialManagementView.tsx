"use client"

import React, { useEffect, useState } from "react"
import type { Language, TutorialData } from "@/app/Learn/types/TutorialTypes"
import { getLanguages } from "@/lib/getData"
import { Sparkles } from "lucide-react"
import AITutorialForm from "../components/AITutorialForm"
import MultiLessonTutorialForm from "../components/MultiLessonTutorialForm"
import TutorialList from "../components/TutorialList"
import { Tutorial } from "../hooks/useTutorials"

const TutorialManagementView: React.FC = () => {
  const [showForm, setShowForm] = useState<"manual" | "ai" | false>(false)
  const [aiGeneratedData, setAiGeneratedData] = useState<TutorialData | null>(
    null
  )
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null)
  const [languages, setLanguages] = useState<Language[]>([])
  const [languagesLoading, setLanguagesLoading] = useState(true)

  // Load languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch (error) {
        console.error("Error fetching languages:", error)
      } finally {
        setLanguagesLoading(false)
      }
    }
    fetchLanguages()
  }, [])

  const handleAIGenerated = (data: TutorialData) => {
    console.log("🤖 AI generated tutorial data:", data)
    setAiGeneratedData(data)
    setShowForm("manual") // Switch to manual form with AI data
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setAiGeneratedData(null) // Clear AI data when canceling
    setEditingTutorial(null) // Clear editing tutorial
  }

  const handleCreateTutorial = () => {
    setAiGeneratedData(null)
    setEditingTutorial(null)
    setShowForm("manual")
  }

  const handleEditTutorial = (tutorial: Tutorial) => {
    console.log("🔍 Editing tutorial with ID:", tutorial.id)
    console.log("🔍 Full tutorial data:", tutorial)

    // Convert Tutorial to TutorialData format for editing
    const tutorialData: TutorialData = {
      id: tutorial.id,
      title: tutorial.title,
      slug: tutorial.slug,
      description: tutorial.description || "",
      videoUrl: tutorial.videoUrl || "",
      programmingLanguage: tutorial.programmingLanguage.id.toString(),
      difficulty: parseInt(tutorial.difficulty) || 1,
      index: tutorial.index,
      isLocked: tutorial.isLocked,
      learningObjectives:
        tutorial.learningObjectives?.map((obj) => obj.objective) || [],
      keyTopics: Array.isArray(tutorial.keyTopics)
        ? tutorial.keyTopics.map((topic) =>
            typeof topic === "string" ? topic : topic.topic || ""
          )
        : [],
      practicalApplications:
        tutorial.practicalApplications?.map((app) => app.application) || [],
      tags: tutorial.tags?.map((tag) => tag.tag) || [],

      // Fix lesson data mapping - extract actual lesson content
      lessons: (tutorial.lessons || []).map((lesson: any) => {
        console.log(`🔍 Processing lesson ${lesson.id}:`, lesson)

        // Extract lesson data based on lesson type
        let lessonData = null

        switch (lesson.type) {
          case "concept":
            if (lesson.conceptData) {
              lessonData = {
                explanation: lesson.conceptData.explanation || "",
                keyPoints: (lesson.conceptData.keyPoints || []).map(
                  (kp: any) => (typeof kp === "string" ? kp : kp.point || "")
                ),
                codeExamples: (lesson.conceptData.codeExamples || []).map(
                  (ex: any) => ({
                    id: ex.id || crypto.randomUUID(),
                    title: ex.title || "",
                    code: ex.code || "",
                    language: "javascript", // Default or detect from context
                    explanation: ex.explanation || "",
                    diagram_data: ex.diagram_data || "",
                  })
                ),
                practiceHints: (lesson.conceptData.practiceHints || []).map(
                  (hint: any) =>
                    typeof hint === "string" ? hint : hint.hint || ""
                ),
                diagram_data: lesson.conceptData.diagram_data || "",
                commonMistakes: (lesson.conceptData.commonMistakes || []).map(
                  (mistake: any) =>
                    typeof mistake === "string"
                      ? mistake
                      : mistake.mistake || ""
                ),
                bestPractices: (lesson.conceptData.bestPractices || []).map(
                  (practice: any) =>
                    typeof practice === "string"
                      ? practice
                      : practice.practice || ""
                ),
                visualElements: lesson.conceptData.visualElements || {
                  diagrams: [],
                  concepts: [],
                },
              }
            }
            break

          case "mcq":
            if (lesson.mcqData) {
              lessonData = {
                questions: (lesson.mcqData.questions || []).map((q: any) => ({
                  id: q.id || crypto.randomUUID(),
                  question: q.question || "",
                  options: q.options || [],
                  explanation: q.explanation || "",
                  difficulty: q.difficulty || 1,
                  codeSnippet: q.codeSnippet || "",
                  diagram_data: q.diagram_data || "",
                })),
              }
            }
            break

          case "codeblock_rearranging":
            if (lesson.codeRearrangeData) {
              lessonData = {
                questions: (lesson.codeRearrangeData.questions || []).map(
                  (q: any) => ({
                    id: q.id || crypto.randomUUID(),
                    scenario: q.scenario || "",
                    targetCode: q.targetCode || "",
                    diagram_data: q.diagram_data || "",
                    blocks: q.blocks || [],
                    hints: (q.hints || []).map((hint: any) =>
                      typeof hint === "string" ? hint : hint.hint || ""
                    ),
                    difficulty: q.difficulty || 1,
                  })
                ),
              }
            }
            break

          case "fill_in_blanks":
            if (lesson.fibData) {
              lessonData = {
                questions: (lesson.fibData.questions || []).map((q: any) => ({
                  id: q.id || crypto.randomUUID(),
                  scenario: q.scenario || "",
                  code: q.code || "",
                  diagram_data: q.diagram_data || "",
                  blanks: (q.blanks || []).map((blank: any) => ({
                    id: blank.id || crypto.randomUUID(),
                    position: blank.position || 0,
                    type: blank.type || "text",
                    correctAnswer: blank.correctAnswer || "",
                    options: Array.isArray(blank.options)
                      ? blank.options.map((opt: any) =>
                          typeof opt === "string"
                            ? opt
                            : opt.option || opt.text || ""
                        )
                      : [],
                    hint: blank.hint || "",
                    explanation: blank.explanation || "",
                  })),
                  hints: (q.hints || []).map((hint: any) =>
                    typeof hint === "string" ? hint : hint.hint || ""
                  ),
                  solution: q.solution
                    ? {
                        completeCode: q.solution.completeCode || "",
                        explanation: q.solution.explanation || "",
                        diagram_data: q.solution.diagram_data || "",
                      }
                    : undefined,
                  difficulty: q.difficulty || 1,
                })),
              }
            }
            break
        }

        return {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          order: lesson.order,
          description: lesson.description || "",
          learningObjectives: (lesson.learningObjectives || []).map(
            (obj: any) => (typeof obj === "string" ? obj : obj.objective || "")
          ),
          keyTopics: (lesson.keyTopics || []).map((topic: any) =>
            typeof topic === "string" ? topic : topic.topic || ""
          ),
          difficulty: lesson.difficulty || 1,
          data: lessonData,
        }
      }),

      focusAreas: "", // This field might not be in the API response

      // Map reference data properly
      reference: tutorial.reference
        ? {
            title: tutorial.reference.title || "",
            subtitle: tutorial.reference.subtitle || "",
            introduction: tutorial.reference.introduction || "",
            examples: (tutorial.reference.examples || []).map((ex: any) => ({
              title: ex.title || "",
              description: ex.description || "",
              code: ex.code || "",
              explanation: ex.explanation || "",
              output: ex.output || "",
            })),
            key_points:
              typeof tutorial.reference.key_points === "string"
                ? tutorial.reference.key_points
                    .split("\n")
                    .filter((p) => p.trim())
                : (tutorial.reference.key_points || []).map((kp: any) =>
                    typeof kp === "string" ? kp : kp.point || ""
                  ),
            common_mistakes: (tutorial.reference.common_mistakes || []).map(
              (mistake: any) => ({
                mistake: mistake.mistake || "",
                why_wrong: mistake.why_wrong || "",
                correct_approach: mistake.correct_approach || "",
              })
            ),
            syntax_guide: tutorial.reference.syntax_guide
              ? {
                  basic_syntax:
                    tutorial.reference.syntax_guide.basic_syntax || "",
                  parameters: (
                    tutorial.reference.syntax_guide.parameters || []
                  ).map((param: any) => ({
                    name: param.name || "",
                    description: param.description || "",
                    required: Boolean(param.required),
                  })),
                }
              : {
                  basic_syntax: "",
                  parameters: [],
                },
          }
        : undefined,
    }

    console.log("✅ Converted tutorial data for editing:", tutorialData)

    setEditingTutorial(tutorial)
    setAiGeneratedData(tutorialData)
    setShowForm("manual")
  }

  const handleTutorialSave = async (tutorialData: TutorialData) => {
    try {
      console.log("💾 Submitting tutorial:", tutorialData)

      // Determine if this is an edit or create operation
      const isEdit = editingTutorial && tutorialData.id

      let url: string
      if (isEdit) {
        console.log("🔗 Constructing edit URL for ID:", tutorialData.id)

        // Use proxy route for editing (keeps API private)
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        url = `${baseUrl}/api/payload/tutorials/${tutorialData.id}`

        console.log("🔗 Final edit URL:", url)
      } else {
        // Use existing submit route for creation
        url = "/api/generate-tutorial/submit-tutorial"
      }

      const method = isEdit ? "PATCH" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tutorialData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Tutorial submission failed:", errorData)
        alert(`Error saving tutorial: ${errorData.error || "Unknown error"}`)
        return
      }

      const result = await response.json()
      console.log("✅ Tutorial saved successfully:", result)
      alert(`Tutorial ${isEdit ? "updated" : "created"} successfully!`)

      // Clear form and go back to main view
      setShowForm(false)
      setAiGeneratedData(null)
      setEditingTutorial(null)
    } catch (error) {
      console.error("❌ Error submitting tutorial:", error)
      alert("Error saving tutorial. Please try again.")
    }
  }

  return (
    <div className="p-6">
      {showForm === "manual" ? (
        <MultiLessonTutorialForm
          onCancel={handleFormCancel}
          onSave={handleTutorialSave}
          initialData={aiGeneratedData}
        />
      ) : showForm === "ai" ? (
        <AITutorialForm
          onCancel={handleFormCancel}
          onGenerated={handleAIGenerated}
        />
      ) : (
        <div>
          {/* Header with AI Generate Button */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Tutorial Management
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create and manage multi-lesson programming tutorials
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm("ai")}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="h-4 w-4" />
                AI Generate
              </button>
            </div>
          </div>

          {/* Tutorial List */}
          {languagesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="text-slate-600 dark:text-slate-400">Loading...</p>
              </div>
            </div>
          ) : (
            <TutorialList
              languages={languages}
              onEdit={handleEditTutorial}
              onCreate={handleCreateTutorial}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default TutorialManagementView
