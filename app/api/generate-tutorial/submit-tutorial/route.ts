// app/api/generate-tutorial/submit-tutorial/route.ts - Tutorial submission API
import { NextRequest, NextResponse } from "next/server"

// Helper function to convert language slug to ID
async function convertLanguageToId(
  programmingLanguage: string | number
): Promise<number> {
  // If already a number, return it
  if (typeof programmingLanguage === "number") {
    return programmingLanguage
  }

  // If it's a string that can be parsed as a number, parse it
  const parsed = parseInt(programmingLanguage)
  if (!isNaN(parsed)) {
    return parsed
  }

  // If it's a slug, fetch the language to get the ID
  const response = await fetch(
    `${process.env.PAYLOAD_API_URL || "http://localhost:3005/api"}/programming-languages?where[slug][equals]=${programmingLanguage}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (response.ok) {
    const data = await response.json()
    if (data.docs && data.docs.length > 0) {
      return data.docs[0].id
    }
  }

  // Default fallback
  return 1
}

export async function POST(request: NextRequest) {
  try {
    const tutorialData = await request.json()

    // Generate slug if not provided
    if (!tutorialData.slug && tutorialData.title) {
      tutorialData.slug = tutorialData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim()
    }

    // Validate required fields based on updated TutorialData interface
    const requiredFields = ["title", "programmingLanguage"]
    const missingFields = requiredFields.filter((field) => !tutorialData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Validate reference structure if provided
    if (
      tutorialData.reference &&
      (!tutorialData.reference.title ||
        !tutorialData.reference.subtitle ||
        !tutorialData.reference.introduction)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Reference content must include title, subtitle, and introduction",
        },
        { status: 400 }
      )
    }

    // Validate lessons structure
    if (!tutorialData.lessons || !Array.isArray(tutorialData.lessons)) {
      return NextResponse.json(
        {
          success: false,
          error: "Tutorial must contain lessons array",
        },
        { status: 400 }
      )
    }

    if (tutorialData.lessons.length > 20) {
      return NextResponse.json(
        {
          success: false,
          error: "Tutorial cannot have more than 20 lessons",
        },
        { status: 400 }
      )
    }

    // Validate each lesson has required fields
    const lessonValidationErrors = []
    tutorialData.lessons.forEach((lesson, index) => {
      if (!lesson.title)
        lessonValidationErrors.push(`Lesson ${index + 1}: missing title`)
      if (!lesson.type)
        lessonValidationErrors.push(`Lesson ${index + 1}: missing type`)
      if (
        !lesson.learningObjectives ||
        lesson.learningObjectives.length === 0
      ) {
        lessonValidationErrors.push(
          `Lesson ${index + 1}: missing learning objectives`
        )
      }
      if (!lesson.keyTopics || lesson.keyTopics.length === 0) {
        lessonValidationErrors.push(`Lesson ${index + 1}: missing key topics`)
      }
    })

    if (lessonValidationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Lesson validation errors: ${lessonValidationErrors.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Transform lessons data to match conditional schema structure
    console.log(
      "🔍 Raw lesson data before transformation:",
      JSON.stringify(tutorialData.lessons, null, 2)
    )

    const transformedLessons = tutorialData.lessons.map((lesson: any) => {
      // Debug lesson type
      console.log(`🔍 Lesson ${lesson.order || "unknown"} type validation:`, {
        originalType: lesson.type,
        typeOf: typeof lesson.type,
        isValidType: [
          "concept",
          "mcq",
          "codeblock_rearranging",
          "fill_in_blanks",
        ].includes(lesson.type),
        fallbackType: lesson.type || "concept",
      })

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
      console.log(
        `🎯 Lesson ${lesson.id} (${lesson.type}) data:`,
        JSON.stringify(lessonData, null, 2)
      )
      console.log(`🔍 Diagram data in lesson data:`, lessonData.diagram_data)

      switch (lesson.type) {
        case "concept":
          const conceptData = {
            explanation: lessonData.explanation || "",
            keyPoints: (lessonData.keyPoints || []).map((point: any) =>
              typeof point === "string" ? { point } : point
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
            commonMistakes: (lessonData.commonMistakes || []).map(
              (mistake: any) =>
                typeof mistake === "string" ? { mistake } : mistake
            ),
            bestPractices: (lessonData.bestPractices || []).map(
              (practice: any) =>
                typeof practice === "string" ? { practice } : practice
            ),
          }
          console.log(
            `✅ Transformed concept data:`,
            JSON.stringify(conceptData, null, 2)
          )
          return {
            ...baseLesson,
            conceptData,
          }

        case "mcq":
          const mcqData = {
            questions: (lessonData.questions || []).map((q: any) => {
              console.log(`🎯 MCQ Question Diagram:`, q.mermaid_code)
              return {
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
              }
            }),
          }
          console.log(
            `✅ Transformed MCQ data:`,
            JSON.stringify(mcqData, null, 2)
          )
          return {
            ...baseLesson,
            mcqData,
          }

        case "codeblock_rearranging":
          return {
            ...baseLesson,
            codeRearrangeData: {
              questions: (lessonData.questions || []).map((q: any) => ({
                scenario: q.scenario || "",
                targetCode: q.targetCode || "",
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
                mermaid_code: (q.mermaid_code || []).map((code: any) =>
                  typeof code === "string" ? { code } : code
                ),
                blanks: (q.blanks || []).map((blank: any) => ({
                  position: blank.position || 0,
                  type: blank.type || "text",
                  correctAnswer: blank.correctAnswer || "",
                  options: (blank.options || []).map((option: any) =>
                    typeof option === "string" ? { option } : option
                  ),
                  hint: blank.hint || "",
                  explanation: blank.explanation || "",
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
                difficulty: q.difficulty?.toString() || "1",
              })),
            },
          }

        default:
          // For unknown types, store data as-is in a generic field
          return {
            ...baseLesson,
            data: lessonData,
          }
      }
    })

    // Transform the data to match the server Tutorial schema
    const payloadData: any = {
      // Basic required fields
      title: tutorialData.title,
      slug: tutorialData.slug,
      index: tutorialData.index || 1,

      // Content fields
      description: tutorialData.description || "",
      videoUrl: tutorialData.videoUrl || "",

      // Single value fields
      difficulty: tutorialData.difficulty?.toString() || "1",

      // Learning Configuration Group (nested structure for server)
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

      // Lessons array with transformed structure
      lessons: transformedLessons,

      // Complete tutorial data as JSON (legacy support)
      tutorialData: tutorialData,

      // Relationships - convert language slug to ID if needed
      programmingLanguage: await convertLanguageToId(
        tutorialData.programmingLanguage
      ),

      // Settings
      isLocked: Boolean(tutorialData.isLocked ?? true),

      // Reference tutorial - format according to server schema (optional field)
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
              : {
                  basic_syntax: "",
                  parameters: [],
                },
          }
        : null,
    }

    console.log(
      "🔄 Final payload for Payload CMS:",
      JSON.stringify(payloadData, null, 2)
    )

    // Specifically log diagram fields for verification
    console.log("🎯 Diagram Fields in Payload:")
    payloadData.lessons?.forEach((lesson: any, index: number) => {
      console.log(`Lesson ${index + 1} (${lesson.type}):`)
      if (lesson.conceptData?.diagram_data) {
        const diagramData =
          typeof lesson.conceptData.diagram_data === "string"
            ? lesson.conceptData.diagram_data.substring(0, 100)
            : JSON.stringify(lesson.conceptData.diagram_data).substring(0, 100)
        console.log(`  - Concept Diagram: ${diagramData}...`)
      }
      if (lesson.conceptData?.codeExamples) {
        lesson.conceptData.codeExamples.forEach((ex: any, i: number) => {
          if (ex.diagram_data) {
            const diagramData =
              typeof ex.diagram_data === "string"
                ? ex.diagram_data.substring(0, 50)
                : JSON.stringify(ex.diagram_data).substring(0, 50)
            console.log(`  - Code Example ${i + 1} Diagram: ${diagramData}...`)
          }
        })
      }
      if (lesson.mcqData?.questions) {
        lesson.mcqData.questions.forEach((q: any, i: number) => {
          if (q.diagram_data) {
            const diagramData =
              typeof q.diagram_data === "string"
                ? q.diagram_data.substring(0, 50)
                : JSON.stringify(q.diagram_data).substring(0, 50)
            console.log(`  - MCQ Question ${i + 1} Diagram: ${diagramData}...`)
          }
        })
      }
    })

    // Submit to Payload CMS
    const payloadResponse = await fetch(
      `${process.env.PAYLOAD_API_URL || "http://localhost:3005/api"}/tutorials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication if needed
          // 'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
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
    console.log("✅ Tutorial created in Payload:", result)

    return NextResponse.json({
      success: true,
      message: "Tutorial submitted successfully",
      data: result,
    })
  } catch (error) {
    console.error("❌ Error submitting tutorial:", error)

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
