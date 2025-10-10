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

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("❌ Chat proxy error:", error)
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
