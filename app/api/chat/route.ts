import { logger } from "@/utils/logger"
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

    logger.debug("===== CLIENT PROXY DEBUG =====")
    logger.debug("Environment:", process.env.NODE_ENV)
    logger.debug("PAYLOAD_API_URL:", process.env.PAYLOAD_API_URL || "NOT SET")
    logger.debug("Server URL:", serverUrl)
    logger.debug("Chat Endpoint:", chatEndpoint)
    logger.debug("Model:", body.model)
    logger.debug("Messages:", body.messages?.length || 0)
    logger.debug("Cookie present:", !!request.headers.get("cookie"))

    logger.log(`Proxying chat request to: ${chatEndpoint}`)

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

    logger.debug("Server response status:", response.status)
    logger.debug("Server response ok:", response.ok)

    const data = await response.json()

    if (!response.ok) {
      logger.error("Server returned error response:", data)
    } else {
      logger.debug("Server response successful")
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error("===== CLIENT PROXY ERROR DEBUG =====")
    logger.error("Error Type:", error?.constructor?.name)
    logger.error(
      "Error Message:",
      error instanceof Error ? error.message : String(error)
    )
    logger.error("Stack:", error instanceof Error ? error.stack : "N/A")

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
