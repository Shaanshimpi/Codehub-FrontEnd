import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apiUrl = process.env.PAYLOAD_API_URL || "http://localhost:3001/api"
    const url = `${apiUrl}/tutorials/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch tutorial: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error fetching tutorial:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("🔍 PATCH route received ID:", id)

    const tutorialData = await request.json()
    const apiUrl = process.env.PAYLOAD_API_URL || "http://localhost:3001/api"
    const url = `${apiUrl}/tutorials/${id}`

    console.log("🔄 Updating tutorial:", id)
    console.log("🔗 Payload URL:", url)

    // Transform the data to match Payload schema (same as submit-tutorial)
    const transformedData: any = {}

    // Only include fields that are present in the update
    if (tutorialData.title !== undefined)
      transformedData.title = tutorialData.title
    if (tutorialData.slug !== undefined)
      transformedData.slug = tutorialData.slug
    if (tutorialData.description !== undefined) {
      transformedData.content = tutorialData.description
      transformedData.description = tutorialData.description
    }
    if (tutorialData.difficulty !== undefined)
      transformedData.difficulty = tutorialData.difficulty?.toString()
    if (tutorialData.index !== undefined)
      transformedData.index = tutorialData.index
    if (tutorialData.isLocked !== undefined)
      transformedData.isLocked = Boolean(tutorialData.isLocked)

    // Transform array fields from strings to objects
    if (tutorialData.learningObjectives !== undefined) {
      transformedData.learningObjectives = (
        tutorialData.learningObjectives || []
      ).map((obj: string) => ({ objective: obj }))
    }
    if (tutorialData.keyTopics !== undefined) {
      transformedData.keyTopics = (tutorialData.keyTopics || []).map(
        (topic: string) => ({
          topic,
        })
      )
    }
    if (tutorialData.practicalApplications !== undefined) {
      transformedData.practicalApplications = (
        tutorialData.practicalApplications || []
      ).map((app: string) => ({ application: app }))
    }
    if (tutorialData.tags !== undefined) {
      transformedData.tags = (tutorialData.tags || []).map((tag: string) => ({
        tag,
      }))
    }

    // Handle reference field
    if (tutorialData.reference !== undefined) {
      transformedData.reference = tutorialData.reference
    }

    // Handle programming language conversion
    if (tutorialData.programmingLanguage !== undefined) {
      let languageId = tutorialData.programmingLanguage

      // If it's a string that can be parsed as a number, parse it
      if (typeof languageId === "string") {
        const parsed = parseInt(languageId)
        if (!isNaN(parsed)) {
          languageId = parsed
        }
      }

      transformedData.programmingLanguage = languageId
    }

    // Handle lessons transformation if provided
    if (tutorialData.lessons !== undefined) {
      transformedData.lessons = tutorialData.lessons.map((lesson: any) => {
        const baseLesson = {
          id: lesson.id || crypto.randomUUID(),
          title: lesson.title || `Lesson ${lesson.order || 1}`,
          type: lesson.type || "concept",
          order: lesson.order || 1,
          description: lesson.description || "",
          difficulty: lesson.difficulty?.toString() || "1",
          learningObjectives: (lesson.learningObjectives || []).map(
            (obj: string) => ({ objective: obj })
          ),
        }

        const lessonData = lesson.data || lesson.content || {}

        switch (lesson.type) {
          case "concept":
            return {
              ...baseLesson,
              conceptData: {
                explanation: lessonData.explanation || "",
                keyPoints: (lessonData.keyPoints || []).map(
                  (point: string) => ({ point })
                ),
                codeExamples: (lessonData.codeExamples || []).map(
                  (example: any) => ({
                    title: example.title || "",
                    code: example.code || "",
                    explanation: example.explanation || "",
                    mermaid_diagram: example.mermaid_diagram || "",
                  })
                ),
                practiceHints: (lessonData.practiceHints || []).map(
                  (hint: string) => ({ hint })
                ),
                mermaid: lessonData.mermaid || "",
                commonMistakes: (lessonData.commonMistakes || []).map(
                  (mistake: string) => ({ mistake })
                ),
                bestPractices: (lessonData.bestPractices || []).map(
                  (practice: string) => ({ practice })
                ),
                visualElements: {
                  diagrams: (lessonData.visualElements?.diagrams || []).map(
                    (diagram: string) => ({ diagram })
                  ),
                  concepts: (lessonData.visualElements?.concepts || []).map(
                    (concept: string) => ({ concept })
                  ),
                },
              },
            }
          case "mcq":
            return {
              ...baseLesson,
              mcqData: {
                questions: (lessonData.questions || []).map((q: any) => ({
                  question: q.question || "",
                  options: (q.options || []).map((opt: any) => ({
                    text: opt.text || "",
                    isCorrect: Boolean(opt.isCorrect),
                  })),
                  explanation: q.explanation || "",
                  difficulty: q.difficulty?.toString() || "1",
                  codeSnippet: q.codeSnippet || "",
                  mermaid_diagram: q.mermaid_diagram || "",
                })),
              },
            }
          case "codeblock_rearranging":
            return {
              ...baseLesson,
              codeRearrangeData: {
                questions: (lessonData.questions || []).map((q: any) => ({
                  scenario: q.scenario || "",
                  targetCode: q.targetCode || "",
                  mermaid_diagram: q.mermaid_diagram || "",
                  blocks: (q.blocks || []).map((block: any) => ({
                    code: block.code || "",
                    correctOrder: block.correctOrder || 1,
                  })),
                  hints: (q.hints || []).map((hint: string) => ({ hint })),
                  difficulty: q.difficulty?.toString() || "1",
                })),
              },
            }
          case "fill_in_blanks":
            return {
              ...baseLesson,
              fibData: {
                questions: (lessonData.questions || []).map((q: any) => ({
                  scenario: q.scenario || "",
                  code: q.code || "",
                  mermaid_diagram: q.mermaid_diagram || "",
                  blanks: (q.blanks || []).map((blank: any) => ({
                    position: blank.position || 0,
                    type: blank.type || "text",
                    correctAnswer: blank.correctAnswer || "",
                    options: (blank.options || []).map((option: string) => ({
                      option,
                    })),
                    hint: blank.hint || "",
                    explanation: blank.explanation || "",
                  })),
                  hints: (q.hints || []).map((hint: string) => ({ hint })),
                  solution: q.solution
                    ? {
                        completeCode: q.solution.completeCode || "",
                        explanation: q.solution.explanation || "",
                        mermaid_diagram: q.solution.mermaid_diagram || "",
                      }
                    : undefined,
                  difficulty: q.difficulty?.toString() || "1",
                })),
              },
            }
          default:
            return {
              ...baseLesson,
              data: lessonData,
            }
        }
      })
    }

    console.log(
      "🔄 Transformed data for Payload:",
      JSON.stringify(transformedData, null, 2)
    )

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ Payload API Error:", errorData)
      return NextResponse.json(
        { error: `Failed to update tutorial: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error updating tutorial:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apiUrl = process.env.PAYLOAD_API_URL || "http://localhost:3001/api"
    const url = `${apiUrl}/tutorials/${id}`

    console.log("🗑️ Deleting tutorial:", id)

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to delete tutorial: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error deleting tutorial:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
