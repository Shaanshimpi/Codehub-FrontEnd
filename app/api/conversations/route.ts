import { NextRequest, NextResponse } from "next/server"
import {
  isTemporaryUserId,
  parseUserId,
  validatePagination,
  validateUserId,
} from "../../Learn/Vivy/utils"

const PAYLOAD_API_URL =
  process.env.PAYLOAD_API_URL || "http://localhost:3001/api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")
    const limitParam = searchParams.get("limit") || "10"
    const pageParam = searchParams.get("page") || "1"

    const limit = parseInt(limitParam)
    const page = parseInt(pageParam)

    // Validate pagination parameters
    const paginationValidation = validatePagination(page, limit)
    if (!paginationValidation.isValid) {
      return NextResponse.json(
        { error: paginationValidation.getFirstError() },
        { status: 400 }
      )
    }

    if (!userIdParam) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Validate user ID format
    const userIdValidation = validateUserId(userIdParam)
    if (!userIdValidation.isValid) {
      return NextResponse.json(
        { error: userIdValidation.getFirstError() },
        { status: 400 }
      )
    }

    // Parse and handle different user ID types
    const parsedUserId = parseUserId(userIdParam)
    let userId: number

    if (isTemporaryUserId(parsedUserId)) {
      // For temporary users, generate a consistent numeric ID
      let hash = 0
      for (let i = 0; i < (parsedUserId as string).length; i++) {
        const char = (parsedUserId as string).charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convert to 32-bit integer
      }
      userId = (Math.abs(hash) % 999999999) + 1
    } else {
      userId = parsedUserId as number
    }

    // Fetch conversations from Payload CMS
    const response = await fetch(
      `${PAYLOAD_API_URL}/chat-conversations?where[user][equals]=${userId}&limit=${limit}&page=${page}&sort=-updatedAt`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform conversations to ensure proper timestamp format
    if (data.docs) {
      data.docs = data.docs.map((conv: any) => ({
        ...conv,
        createdAt: conv.createdAt
          ? new Date(conv.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: conv.updatedAt
          ? new Date(conv.updatedAt).toISOString()
          : new Date().toISOString(),
      }))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Get Conversations Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch conversations",
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, model, messages, userId: userIdParam, tags, isPublic } = body

    // Validate required fields
    if (!model || !messages || !userIdParam) {
      return NextResponse.json(
        { error: "Model, messages, and userId are required" },
        { status: 400 }
      )
    }

    // Validate user ID
    const userIdValidation = validateUserId(userIdParam)
    if (!userIdValidation.isValid) {
      return NextResponse.json(
        { error: userIdValidation.getFirstError() },
        { status: 400 }
      )
    }

    // Parse user ID and handle temporary users
    const parsedUserId = parseUserId(userIdParam)
    let userId: number

    if (isTemporaryUserId(parsedUserId)) {
      // Generate consistent numeric ID for temporary users
      let hash = 0
      for (let i = 0; i < (parsedUserId as string).length; i++) {
        const char = (parsedUserId as string).charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      userId = (Math.abs(hash) % 999999999) + 1
    } else {
      userId = parsedUserId as number
    }

    // Calculate total tokens (basic estimation)
    const totalTokens = messages.reduce((total: number, msg: any) => {
      return total + (msg.content ? msg.content.length / 4 : 0) // Rough token estimation
    }, 0)

    // Estimate cost based on model (simplified)
    const estimatedCost = calculateEstimatedCost(model, totalTokens)

    const conversationData = {
      title: title || generateTitleFromMessages(messages),
      model,
      messages,
      user: userId,
      tags: tags || [],
      isPublic: isPublic || false,
      totalTokens: Math.round(totalTokens),
      estimatedCost,
    }

    console.log(`💾 Creating conversation: ${conversationData.title}`)

    // Create conversation in Payload CMS
    const response = await fetch(`${PAYLOAD_API_URL}/chat-conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversationData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Payload API Error:", errorText)
      throw new Error(`Payload API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Conversation created successfully")

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Create Conversation Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create conversation",
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

// Helper function to generate title from messages
function generateTitleFromMessages(messages: any[]): string {
  const firstUserMessage = messages.find((msg) => msg.role === "user")
  if (firstUserMessage && firstUserMessage.content) {
    const title = firstUserMessage.content.slice(0, 50).trim()
    return firstUserMessage.content.length > 50 ? title + "..." : title
  }
  return "New Conversation"
}

// Helper function to calculate estimated cost
function calculateEstimatedCost(model: string, tokens: number): number {
  // Simplified cost calculation based on model
  const costPerMillion = {
    "deepseek/deepseek-chat": 0,
    "openai/gpt-4o-mini": 0.6,
    "google/gemini-flash-1.5": 0.6,
    "meta-llama/llama-3.3-70b-instruct": 2.4,
    "openai/gpt-4o": 10.0,
    "anthropic/claude-3.5-sonnet": 15.0,
  }

  const cost =
    (costPerMillion[model as keyof typeof costPerMillion] || 1.0) / 1000000
  return tokens * cost
}
