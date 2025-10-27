import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy chat requests to the Payload server
 * The actual chat logic with auth, spending limits, and OpenRouter calls
 * is handled by the server at /api/chat
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const serverUrl =
      process.env.PAYLOAD_API_URL?.replace("/api", "") ||
      "http://localhost:3001"
    const chatEndpoint = `${serverUrl}/api/chat`

    // Debug logs for production troubleshooting
    console.log("🔍 ===== CLIENT PROXY DEBUG =====")
    console.log("📍 Environment:", process.env.NODE_ENV)
    console.log("🔗 PAYLOAD_API_URL:", process.env.PAYLOAD_API_URL || "NOT SET")
    console.log("🌐 Server URL:", serverUrl)
    console.log("📡 Chat Endpoint:", chatEndpoint)
    console.log("🤖 Model:", body.model)
    console.log("💬 Messages:", body.messages?.length || 0)
    console.log("🍪 Cookie present:", !!request.headers.get("cookie"))
    console.log("=================================")

    console.log(`🔄 Proxying chat request to: ${chatEndpoint}`)

    // Forward the request to the server with cookies for authentication
    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies for Payload authentication
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    })

    console.log("📥 Server response status:", response.status)
    console.log("📥 Server response ok:", response.ok)

    const data = await response.json()

    if (!response.ok) {
      console.error("❌ Server returned error response:", data)
    } else {
      console.log("✅ Server response successful")
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("❌ ===== CLIENT PROXY ERROR DEBUG =====")
    console.error("📍 Error Type:", error?.constructor?.name)
    console.error(
      "💬 Error Message:",
      error instanceof Error ? error.message : String(error)
    )
    console.error("🔗 Stack:", error instanceof Error ? error.stack : "N/A")
    console.error("=======================================")

    return NextResponse.json(
      {
        error: "Failed to communicate with chat service",
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
