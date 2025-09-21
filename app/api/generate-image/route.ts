import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "google/gemini-2.5-flash-image-preview" } =
      await request.json()

    // Validate input
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      )
    }

    // Environment variables
    const openRouterApiKey = process.env.AI_CHATBOT_API_KEY
    const siteUrl = process.env.SITE_URL || "http://localhost:3000"
    const siteName = process.env.SITE_NAME || "Codehub Platform"

    if (!openRouterApiKey) {
      console.error("❌ AI_CHATBOT_API_KEY environment variable not configured")
      return NextResponse.json(
        {
          error:
            "API configuration error. Please check your environment variables.",
        },
        { status: 500 }
      )
    }

    console.log(`🎨 Generating image with model: ${model}`)
    console.log(`📝 Prompt: ${prompt}`)

    // Call OpenRouter API for image generation
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
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ["image", "text"],
          max_tokens: 1000,
          temperature: 0.7,
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

      let errorMessage = "Image generation service temporarily unavailable"
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
          errorMessage = "Image generation service temporarily unavailable"
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("✅ Image generation response received successfully")

    // Extract the generated images
    const images = data.choices?.[0]?.message?.images
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.error("❌ No images in response:", data)
      return NextResponse.json(
        { error: "No images generated" },
        { status: 500 }
      )
    }

    // Extract text content if available
    const textContent = data.choices?.[0]?.message?.content || ""

    // Extract token usage if available
    const usage = data.usage || {}
    const tokens = {
      prompt: usage.prompt_tokens || 0,
      completion: usage.completion_tokens || 0,
      total: usage.total_tokens || 0,
    }

    return NextResponse.json({
      images: images.map((img: any) => ({
        url: img.image_url?.url || img.url,
        type: img.type || "image_url",
      })),
      textContent,
      tokens,
      model,
      id: data.id,
      created: data.created,
      prompt,
    })
  } catch (error) {
    console.error("❌ Image Generation API Error:", error)
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
