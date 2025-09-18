import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    console.log("🔄 Update tutorial API called")

    // Parse the request body
    const tutorialData = await request.json()

    // Validate required fields
    if (!tutorialData.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Tutorial ID is required for updates",
        },
        { status: 400 }
      )
    }

    if (!tutorialData.title || !tutorialData.programmingLanguage) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and programming language are required",
        },
        { status: 400 }
      )
    }

    console.log(`🔄 Updating tutorial ID: ${tutorialData.id}`)

    // Resolve programming language slug to ID if needed
    let programmingLanguageId = tutorialData.programmingLanguage

    if (typeof tutorialData.programmingLanguage === "string") {
      console.log(
        `🔍 Resolving programming language slug: ${tutorialData.programmingLanguage}`
      )

      try {
        const langResponse = await fetch(
          `${process.env.PAYLOAD_API_URL || "http://localhost:3005/api"}/programming-languages?where[slug][equals]=${tutorialData.programmingLanguage}`
        )

        if (langResponse.ok) {
          const langResult = await langResponse.json()
          if (langResult.docs && langResult.docs.length > 0) {
            programmingLanguageId = langResult.docs[0].id
            console.log(
              `✅ Resolved programming language ID: ${programmingLanguageId}`
            )
          } else {
            console.error(
              `❌ Programming language not found: ${tutorialData.programmingLanguage}`
            )
            return NextResponse.json(
              {
                success: false,
                error: `Programming language '${tutorialData.programmingLanguage}' not found`,
              },
              { status: 400 }
            )
          }
        }
      } catch (error) {
        console.error(`❌ Error resolving programming language: ${error}`)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to resolve programming language",
          },
          { status: 500 }
        )
      }
    }

    // Transform lessons data to match conditional schema structure
    const transformedLessons = tutorialData.lessons.map((lesson: any) => {
      const baseLesson = {
        id: lesson.id || crypto.randomUUID(),
        title: lesson.title || `Lesson ${lesson.order || 1}`,
        type: lesson.type || "concept",
        order: lesson.order || 1,
        learningObjectives: (lesson.learningObjectives || []).map((obj: any) =>
          typeof obj === "string" ? { objective: obj } : obj
        ),
        keyTopics: (lesson.keyTopics || []).map((topic: any) =>
          typeof topic === "string" ? { topic: topic } : topic
        ),
      }

      // Transform lesson data based on type using conditional fields
      const lessonData = lesson.data || lesson.content || {}

      switch (lesson.type) {
        case "concept":
          const conceptData = {
            explanation: lessonData.explanation || "",
            keyPoints: (lessonData.keyPoints || []).map((point: any) =>
              typeof point === "string" ? { point } : point
            ),
            commonMistakes: (lessonData.commonMistakes || []).map(
              (mistake: any) =>
                typeof mistake === "string" ? { mistake } : mistake
            ),
            bestPractices: (lessonData.bestPractices || []).map(
              (practice: any) =>
                typeof practice === "string" ? { practice } : practice
            ),
            codeExamples: (lessonData.codeExamples || []).map(
              (example: any) => ({
                title: example.title || "",
                code: example.code || "",
                explanation: example.explanation || "",
                mermaid_code: (example.mermaid_code || []).map((code: any) =>
                  typeof code === "string" ? { code } : code
                ),
              })
            ),
            practiceHints: (lessonData.practiceHints || []).map((hint: any) =>
              typeof hint === "string" ? { hint } : hint
            ),
            mermaid_code: (lessonData.mermaid_code || []).map((code: any) =>
              typeof code === "string" ? { code } : code
            ),
          }
          return {
            ...baseLesson,
            conceptData,
          }

        case "mcq":
          const mcqData = {
            questions: (lessonData.questions || []).map((q: any) => ({
              question: q.question || "",
              options: (q.options || []).map((opt: any) => ({
                text: opt.text || "",
                isCorrect: Boolean(opt.isCorrect),
              })),
              explanation: q.explanation || "",
              difficulty: q.difficulty?.toString() || "1",
              codeSnippet: q.codeSnippet || "",
              mermaid_code: (q.mermaid_code || []).map((code: any) =>
                typeof code === "string" ? { code } : code
              ),
            })),
          }
          return {
            ...baseLesson,
            mcqData,
          }

        case "codeblock_rearranging":
          const codeRearrangeData = {
            questions: (lessonData.questions || []).map((q: any) => ({
              scenario: q.scenario || "",
              targetCode: q.targetCode || "",
              difficulty: q.difficulty?.toString() || "1",
              mermaid_code: (q.mermaid_code || []).map((code: any) =>
                typeof code === "string" ? { code } : code
              ),
              blocks: (q.blocks || []).map((block: any) => ({
                code: block.code || "",
                correctOrder: block.correctOrder || 1,
              })),
              hints: (q.hints || []).map((hint: any) =>
                typeof hint === "string" ? { hint } : hint
              ),
            })),
          }
          return {
            ...baseLesson,
            codeRearrangeData,
          }

        case "fill_in_blanks":
          const fibData = {
            questions: (lessonData.questions || []).map((q: any) => ({
              scenario: q.scenario || "",
              code: q.code || "",
              difficulty: q.difficulty?.toString() || "1",
              mermaid_code: (q.mermaid_code || []).map((code: any) =>
                typeof code === "string" ? { code } : code
              ),
              blanks: (q.blanks || []).map((blank: any) => ({
                position: blank.position || 0,
                type: blank.type || "text",
                correctAnswer: blank.correctAnswer || "",
                hint: blank.hint || "",
                explanation: blank.explanation || "",
                options: blank.options || [],
              })),
              hints: (q.hints || []).map((hint: any) =>
                typeof hint === "string" ? { hint } : hint
              ),
              solution: q.solution
                ? {
                    completeCode: q.solution.completeCode || "",
                    explanation: q.solution.explanation || "",
                    mermaid_code: (q.solution.mermaid_code || []).map(
                      (code: any) =>
                        typeof code === "string" ? { code } : code
                    ),
                  }
                : undefined,
            })),
          }
          return {
            ...baseLesson,
            fibData,
          }

        default:
          return {
            ...baseLesson,
            data: lessonData,
          }
      }
    })

    // Transform the data to match the server Tutorial schema
    const payloadData = {
      id: tutorialData.id,
      title: tutorialData.title,
      slug: tutorialData.slug,
      index: tutorialData.index || 1,
      description: tutorialData.description || "",
      videoUrl: tutorialData.videoUrl || "",
      difficulty: tutorialData.difficulty?.toString() || "1",
      programmingLanguage: programmingLanguageId,
      isLocked:
        tutorialData.isLocked !== undefined ? tutorialData.isLocked : true,

      // Learning Configuration Group
      learningConfiguration: {
        learningObjectives: (tutorialData.learningObjectives || []).map(
          (obj: any) => (typeof obj === "string" ? { objective: obj } : obj)
        ),
        keyTopics: (tutorialData.keyTopics || []).map((topic: any) =>
          typeof topic === "string" ? { topic } : topic
        ),
        practicalApplications: (tutorialData.practicalApplications || []).map(
          (app: any) => (typeof app === "string" ? { application: app } : app)
        ),
        tags: (tutorialData.tags || []).map((tag: any) =>
          typeof tag === "string" ? { tag } : tag
        ),
      },

      // Lessons array
      lessons: transformedLessons,

      // Reference data
      reference: tutorialData.reference
        ? {
            title: tutorialData.reference.title || "",
            subtitle: tutorialData.reference.subtitle || "",
            introduction: tutorialData.reference.introduction || "",
            examples: (tutorialData.reference.examples || []).map(
              (example: any) => ({
                title: example.title || "",
                description: example.description || "",
                code: example.code || "",
                explanation: example.explanation || "",
                output: example.output || "",
              })
            ),
            key_points: (tutorialData.reference.key_points || []).map(
              (point: any) =>
                typeof point === "string" ? { point: point } : point
            ),
            common_mistakes: (tutorialData.reference.common_mistakes || []).map(
              (mistake: any) => ({
                mistake: mistake.mistake || "",
                why_wrong: mistake.why_wrong || "",
                correct_approach: mistake.correct_approach || "",
              })
            ),
            syntax_guide: tutorialData.reference.syntax_guide
              ? {
                  basic_syntax:
                    tutorialData.reference.syntax_guide.basic_syntax || "",
                  parameters: (
                    tutorialData.reference.syntax_guide.parameters || []
                  ).map((param: any) => ({
                    name: param.name || "",
                    description: param.description || "",
                    required: Boolean(param.required),
                  })),
                }
              : undefined,
          }
        : undefined,

      // Store complete tutorial data for debugging
      tutorialData: tutorialData,
    }

    console.log(
      `📤 Sending PATCH request to Payload for tutorial ID: ${tutorialData.id}`
    )

    // Update tutorial in Payload CMS
    const payloadResponse = await fetch(
      `${process.env.PAYLOAD_API_URL || "http://localhost:3005/api"}/tutorials/${tutorialData.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      }
    )

    if (!payloadResponse.ok) {
      const errorData = await payloadResponse.text()
      console.error("❌ Payload API Error:", errorData)

      return NextResponse.json(
        {
          success: false,
          error: `Payload API error: ${payloadResponse.status} ${payloadResponse.statusText}`,
          details: errorData,
        },
        { status: 500 }
      )
    }

    const result = await payloadResponse.json()
    console.log("✅ Tutorial updated successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Tutorial updated successfully",
      data: result,
    })
  } catch (error) {
    console.error("❌ Error updating tutorial:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
