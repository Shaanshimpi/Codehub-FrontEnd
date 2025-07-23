// app/api/submit-exercise/route.ts - Updated for separate fields
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const exerciseData = await request.json()

    console.log("📥 Received exercise submission:")

    // Validate required fields
    const requiredFields = [
      "title_en",
      "slug",
      "programmingLanguage",
      "tutorial",
    ]
    const missingFields = requiredFields.filter((field) => !exerciseData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // The data should already be transformed by the submitExercise function
    // but we'll ensure proper structure here as well
    const payloadData = {
      // Basic fields
      index: exerciseData.index || 1,
      slug: exerciseData.slug,

      // Code fields
      solution_code: exerciseData.solution_code || "",
      boilerplate_code: exerciseData.boilerplate_code || "",
      mermaid_diagram: exerciseData.mermaid_diagram || "",

      // Array fields (already transformed)
      learning_objectives: exerciseData.learning_objectives || [],
      tags: exerciseData.tags || [],

      // Multi-language titles
      title_en: exerciseData.title_en,
      title_hi: exerciseData.title_hi || "",
      title_mr: exerciseData.title_mr || "",

      // Multi-language hints and explanations (already transformed)
      hints_en: exerciseData.hints_en || [],
      hints_hi: exerciseData.hints_hi || [],
      hints_mr: exerciseData.hints_mr || [],
      explanation_en: exerciseData.explanation_en || [],
      explanation_hi: exerciseData.explanation_hi || [],
      explanation_mr: exerciseData.explanation_mr || [],

      // Visual elements as separate arrays
      memory_states: exerciseData.memory_states || [],
      execution_steps: exerciseData.execution_steps || [],
      concepts: exerciseData.concepts || [],

      // Relationships (ensure they're numbers)
      programmingLanguage: Number(exerciseData.programmingLanguage),
      tutorial: Number(exerciseData.tutorial),

      // Settings
      difficultyLevel: Number(exerciseData.difficultyLevel) || 1,
      isLocked: Boolean(exerciseData.isLocked),
    }

    // console.log('🔄 Final payload for Payload CMS:', JSON.stringify(payloadData, null, 2))

    // Submit to Payload CMS
    const payloadResponse = await fetch(
      `${process.env.PAYLOAD_API_URL || "http://localhost:3001/api"}/exercises`,
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
    console.log("✅ Exercise created in Payload:", result)

    return NextResponse.json({
      success: true,
      message: "Exercise submitted successfully",
      data: result,
    })
  } catch (error) {
    console.error("❌ Error submitting exercise:", error)

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
