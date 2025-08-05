// app/api/generate-tutorial/submit-tutorial/route.ts - Tutorial submission API
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const tutorialData = await request.json()

    console.log("📥 Received tutorial submission:")
    console.log("Tutorial structure:", JSON.stringify(tutorialData, null, 2))

    // Validate required fields
    const requiredFields = ["title", "slug", "programmingLanguage"]
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

    // Transform the data to match the server Tutorial schema
    const payloadData = {
      // Basic required fields
      title: tutorialData.title,
      slug: tutorialData.slug,
      index: tutorialData.index || 1,

      // Content fields
      content: tutorialData.description || "",
      description: tutorialData.description || "",

      // New schema fields
      learningObjectives: (tutorialData.learningObjectives || []).map(
        (obj: string) => ({ objective: obj })
      ),
      keyTopics: (tutorialData.keyTopics || []).map((topic: string) => ({
        topic,
      })),
      practicalApplications: (tutorialData.practicalApplications || []).map(
        (app: string) => ({ application: app })
      ),
      tags: (tutorialData.tags || []).map((tag: string) => ({ tag })),
      prerequisites: (tutorialData.prerequisites || []).map(
        (prereq: string) => ({ prerequisite: prereq })
      ),

      // Single value fields
      difficulty: tutorialData.difficulty?.toString() || "1",
      focusAreas: tutorialData.focusAreas || "",

      // Complete tutorial data as JSON
      tutorialData: tutorialData,

      // Relationships (ensure they're numbers)
      programmingLanguage: Number(tutorialData.programmingLanguage),

      // Settings
      isLocked: Boolean(tutorialData.isLocked ?? true),
    }

    console.log(
      "🔄 Final payload for Payload CMS:",
      JSON.stringify(payloadData, null, 2)
    )

    // Submit to Payload CMS
    const payloadResponse = await fetch(
      `${process.env.PAYLOAD_API_URL || "http://localhost:3001/api"}/tutorials`,
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
