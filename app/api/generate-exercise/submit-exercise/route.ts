// app/api/submit-exercise/route.ts - Updated for separate fields
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const exerciseData = await request.json()

    console.log("📥 Received exercise submission:")
    console.log("elements structure:", JSON.stringify(exerciseData, null, 5))

    // Validate required fields
    const requiredFields = ["title", "slug", "programmingLanguage", "tutorial"]
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
      title: exerciseData.title,
      description: exerciseData.description || "",
      index: exerciseData.index || 1,
      slug: exerciseData.slug,

      // Code fields
      solution_code: exerciseData.solution_code || "",
      boilerplate_code: exerciseData.boilerplate_code || "",
      mermaid_diagram: exerciseData.mermaid_diagram || "",

      // Array fields (already transformed)
      learning_objectives: exerciseData.learning_objectives || [],
      tags: exerciseData.tags || [],

      // Single language hints and explanations (already transformed)
      hints: exerciseData.hints || [],
      explanation: exerciseData.explanation || [],

      // Visual elements as grouped object matching Exercise.ts schema
      visual_elements: {
        execution_steps: (
          exerciseData.visual_elements?.execution_steps ||
          exerciseData.execution_steps ||
          []
        ).map((step: any) => {
          const outputValue =
            step.output && step.output.trim() !== ""
              ? step.output.trim()
              : "No output produced"
          return {
            ...step,
            output: outputValue, // Use actual output or default
            memory_state: step.memory_state || [], // Now optional, can be empty array
          }
        }),
        concepts:
          exerciseData.visual_elements?.concepts || exerciseData.concepts || [],
      },

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
