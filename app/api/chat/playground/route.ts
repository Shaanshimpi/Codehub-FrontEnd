import { logger } from "@/utils/logger"
import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy playground chat requests to the Payload server
 * Adds support for systemContext forwarding while keeping cookies/auth
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const serverUrl =
      process.env.PAYLOAD_API_URL?.replace("/api", "") ||
      "http://localhost:3001"
    const chatEndpoint = `${serverUrl}/api/chat/playground`

    logger.debug("===== CLIENT PLAYGROUND PROXY DEBUG =====")
    logger.debug("Server URL:", serverUrl)
    logger.debug("Endpoint:", chatEndpoint)
    logger.debug("Model:", body.model)
    logger.debug("Messages:", body.messages?.length || 0)
    logger.debug("Has systemContext:", !!body.systemContext)

    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      logger.error("Server returned error for playground chat:", data)
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error("Client playground proxy error:", error)
    return NextResponse.json(
      {
        error: "Failed to communicate with playground chat service",
      },
      { status: 500 }
    )
  }
}
