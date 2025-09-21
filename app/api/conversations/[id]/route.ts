import { NextRequest, NextResponse } from "next/server"

const PAYLOAD_API_URL =
  process.env.PAYLOAD_API_URL || "http://localhost:3001/api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch specific conversation from Payload CMS
    const response = await fetch(
      `${PAYLOAD_API_URL}/chat-conversations/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        )
      }
      throw new Error(`Payload API error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure proper timestamp format
    if (data) {
      data.createdAt = data.createdAt
        ? new Date(data.createdAt).toISOString()
        : new Date().toISOString()
      data.updatedAt = data.updatedAt
        ? new Date(data.updatedAt).toISOString()
        : new Date().toISOString()
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Get Conversation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch conversation",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    console.log(`📝 Updating conversation: ${id}`)

    // Update conversation in Payload CMS
    const response = await fetch(
      `${PAYLOAD_API_URL}/chat-conversations/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        )
      }
      const errorText = await response.text()
      console.error("❌ Payload API Error:", errorText)
      throw new Error(`Payload API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Conversation updated successfully")

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Update Conversation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to update conversation",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log(`🗑️ Deleting conversation: ${id}`)

    // Delete conversation from Payload CMS
    const response = await fetch(
      `${PAYLOAD_API_URL}/chat-conversations/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        )
      }
      throw new Error(`Payload API error: ${response.status}`)
    }

    console.log("✅ Conversation deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Delete Conversation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete conversation",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    )
  }
}
