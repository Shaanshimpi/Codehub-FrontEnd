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
    // Get the authenticated user from the request
    // We'll use the existing Payload session management
    const meResponse = await fetch(`${payloadApiUrl}/users/me`, {
      headers: {
        // Forward any authentication headers from the original request
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userData = await meResponse.json()
    const user = userData.user

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    console.log(`🎯 Recording Gold application intent for user: ${user.email}`)

    // Update the user's gold application status to 'interested'
    const updateResponse = await fetch(`${payloadApiUrl}/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        goldApplicationStatus: "interested",
        goldApplicationDate: new Date().toISOString(),
      }),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("❌ Failed to update user:", errorText)
      throw new Error(`HTTP error ${updateResponse.status}: ${errorText}`)
    }

    const updatedUser = await updateResponse.json()
    console.log(
      `✅ Successfully recorded Gold application intent for user: ${user.email}`
    )

    return NextResponse.json({
      success: true,
      message: "Gold application intent recorded successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        goldApplicationStatus: updatedUser.goldApplicationStatus,
        goldApplicationDate: updatedUser.goldApplicationDate,
      },
    })
  } catch (error) {
    console.error("❌ Error recording Gold application intent:", error)
    return NextResponse.json(
      {
        error: "Failed to record application intent",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  try {
    // Get the authenticated user's application status
    const meResponse = await fetch(`${payloadApiUrl}/users/me`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userData = await meResponse.json()
    const user = userData.user

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        goldApplicationStatus: user.goldApplicationStatus || "none",
        goldApplicationDate: user.goldApplicationDate,
        goldApplicationData: user.goldApplicationData,
      },
    })
  } catch (error) {
    console.error("❌ Error fetching Gold application status:", error)
    return NextResponse.json(
      { error: "Failed to fetch application status" },
      { status: 500 }
    )
  }
}
