import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, model } = await request.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 })
    }

    // Environment variables
    const openRouterApiKey = process.env.AI_CHATBOT_API_KEY
    const siteUrl = process.env.SITE_URL || "http://localhost:3000"
    const siteName = process.env.SITE_NAME || "Codehub Vivy"

    if (!openRouterApiKey) {
      console.error("❌ OPENROUTER_API_KEY environment variable not configured")
      return NextResponse.json(
        {
          error:
            "API configuration error. Please check your environment variables.",
        },
        { status: 500 }
      )
    }

    // Add system message to request markdown formatting
    const systemMessage = {
      role: "system",
      content:
        "You are Vivy, a helpful AI assistant. Please format your responses using proper markdown syntax including:\n- **Bold text** for emphasis\n- *Italic text* for subtle emphasis\n- `inline code` for code snippets\n- ```language code blocks for multi-line code\n- # Headers for structuring content\n- - Bullet points for lists\n- > Blockquotes for important notes\n- Tables when appropriate\n- Links when referencing external resources\n\nAlways provide well-structured, readable responses that make good use of markdown formatting to enhance clarity and readability.",
    }

    // Format messages for OpenRouter API
    const formattedMessages = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    console.log(`🤖 Sending request to ${model}`)
    console.log(`📝 Message count: ${formattedMessages.length}`)

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: formattedMessages,
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `❌ OpenRouter API Error: ${response.status} ${response.statusText}`
      )
      console.error("❌ Error details:", errorText)

      let errorMessage = "AI service temporarily unavailable"
      try {
        const errorObj = JSON.parse(errorText)
        errorMessage =
          errorObj.error?.message || errorObj.message || errorMessage
      } catch {
        if (response.status === 401) {
          errorMessage = "Invalid API key"
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again in a moment."
        } else if (response.status >= 500) {
          errorMessage = "AI service temporarily unavailable"
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("✅ Chat response received successfully")
    console.log("📊 Full AI Response Object:", JSON.stringify(data, null, 2))

    // Extract the response content - handle both standard content and reasoning models
    const messageChoice = data.choices?.[0]?.message
    let content = messageChoice?.content

    // Some models (like reasoning models) put the actual content in the reasoning field
    if (!content || content.trim() === "") {
      content = messageChoice?.reasoning
    }

    if (!content) {
      console.error("❌ No content in response:", data)
      return NextResponse.json(
        { error: "No response content received from AI" },
        { status: 500 }
      )
    }

    // Extract token usage if available
    const usage = data.usage || {}
    const tokens = {
      prompt: usage.prompt_tokens || 0,
      completion: usage.completion_tokens || 0,
      total: usage.total_tokens || 0,
    }

    return NextResponse.json({
      content,
      tokens,
      model,
      id: data.id,
      created: data.created,
    })
  } catch (error) {
    console.error("❌ Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
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
