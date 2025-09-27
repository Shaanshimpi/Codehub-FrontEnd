import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  try {
    const { ids, data } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing IDs array" },
        { status: 400 }
      )
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid or missing data object" },
        { status: 400 }
      )
    }

    console.log(`🔄 Bulk updating ${ids.length} exercises`)

    const updatePromises = ids.map(async (id: string) => {
      try {
        const response = await fetch(`${payloadApiUrl}/exercises/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(
            `❌ Failed to update exercise ${id}: ${response.status} ${errorText}`
          )
          return {
            id,
            success: false,
            error: `HTTP ${response.status}: ${errorText}`,
          }
        }

        const updatedExercise = await response.json()
        return { id, success: true, data: updatedExercise }
      } catch (error) {
        console.error(`❌ Error updating exercise ${id}:`, error)
        return {
          id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    const results = await Promise.all(updatePromises)
    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success)

    console.log(
      `✅ Bulk update completed: ${successful} successful, ${failed.length} failed`
    )

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: ids.length,
        successful,
        failed: failed.length,
      },
    })
  } catch (error) {
    console.error("❌ Error in bulk update:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to bulk update exercises",
      },
      { status: 500 }
    )
  }
}
