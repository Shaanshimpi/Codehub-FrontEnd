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
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing IDs array" },
        { status: 400 }
      )
    }

    console.log(`🗑️ Bulk deleting ${ids.length} exercises`)

    const deletePromises = ids.map(async (id: string) => {
      try {
        const response = await fetch(`${payloadApiUrl}/exercises/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          console.error(
            `❌ Failed to delete exercise ${id}: ${response.status}`
          )
          return { id, success: false, error: `HTTP ${response.status}` }
        }

        return { id, success: true }
      } catch (error) {
        console.error(`❌ Error deleting exercise ${id}:`, error)
        return {
          id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    const results = await Promise.all(deletePromises)
    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success)

    console.log(
      `✅ Bulk delete completed: ${successful} successful, ${failed.length} failed`
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
    console.error("❌ Error in bulk delete:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to bulk delete exercises",
      },
      { status: 500 }
    )
  }
}
