import { NextRequest, NextResponse } from "next/server"

// Cache for models data (in-memory cache)
let modelsCache: {
  data: any[] | null
  lastFetch: number
  ttl: number
} = {
  data: null,
  lastFetch: 0,
  ttl: 3600000, // 1 hour in milliseconds
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now()

    // Check if we have valid cached data
    if (modelsCache.data && now - modelsCache.lastFetch < modelsCache.ttl) {
      console.log("✅ Returning cached models data")
      return NextResponse.json({
        models: modelsCache.data,
        cached: true,
        lastUpdate: new Date(modelsCache.lastFetch).toISOString(),
      })
    }

    console.log("🔄 Fetching fresh models data from OpenRouter...")

    // Fetch models from OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": process.env.SITE_NAME || "Codehub Vivy",
      },
    })

    if (!response.ok) {
      console.error(
        `❌ OpenRouter Models API Error: ${response.status} ${response.statusText}`
      )

      // Return fallback models if API fails
      if (modelsCache.data) {
        console.log("⚠️ API failed, returning stale cache")
        return NextResponse.json({
          models: modelsCache.data,
          cached: true,
          stale: true,
          error: `API returned ${response.status}`,
        })
      }

      return NextResponse.json(
        { error: "Failed to fetch models from OpenRouter" },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      console.error("❌ Invalid response format from OpenRouter")
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 }
      )
    }

    console.log(`✅ Fetched ${data.data.length} models from OpenRouter`)

    // Process and filter models for our use case
    const processedModels = data.data
      .filter((model: any) => {
        // Filter for chat-capable models
        return (
          model.context_length > 0 &&
          !model.id.includes("embed") &&
          !model.id.includes("whisper") &&
          !model.id.includes("dall-e") &&
          !model.id.includes("auto") &&
          !model.id.includes("/auto") &&
          !model.name.toLowerCase().includes("auto") &&
          model.pricing?.prompt !== undefined
        )
      })
      .map((model: any) => ({
        id: model.id,
        name: model.name,
        description:
          model.description || `${model.name} by ${extractProvider(model.id)}`,
        provider: extractProvider(model.id),
        contextLength: model.context_length,
        pricing: {
          input: model.pricing.prompt * 1000000, // Convert to per million tokens
          output: model.pricing.completion * 1000000,
          display: formatPricing(
            model.pricing.prompt,
            model.pricing.completion
          ),
        },
        capabilities: {
          chat: true,
          reasoning: model.id.includes("o1") || model.id.includes("reasoning"),
          coding:
            model.id.includes("code") ||
            model.id.includes("deepseek") ||
            model.name.toLowerCase().includes("code"),
          multimodal:
            model.architecture?.modality?.includes("image") ||
            model.id.includes("vision") ||
            model.name.toLowerCase().includes("vision"),
        },
        tier: calculateTier(model.pricing.prompt),
        isActive: true,
        architecture: model.architecture,
        topProvider: model.top_provider,
        perRequestLimits: model.per_request_limits,
      }))
      .sort((a: any, b: any) => {
        // Sort by tier (budget first), then by popularity/pricing
        const tierOrder = { budget: 0, mid: 1, premium: 2 }
        if (a.tier !== b.tier) {
          return (
            tierOrder[a.tier as keyof typeof tierOrder] -
            tierOrder[b.tier as keyof typeof tierOrder]
          )
        }
        return a.pricing.input - b.pricing.input
      })

    // Update cache
    modelsCache = {
      data: processedModels,
      lastFetch: now,
      ttl: modelsCache.ttl,
    }

    console.log(`✅ Processed and cached ${processedModels.length} models`)

    return NextResponse.json({
      models: processedModels,
      cached: false,
      lastUpdate: new Date(now).toISOString(),
      totalFound: data.data.length,
      filtered: processedModels.length,
    })
  } catch (error) {
    console.error("❌ Models API Error:", error)

    // Return cached data if available during error
    if (modelsCache.data) {
      console.log("⚠️ Error occurred, returning stale cache")
      return NextResponse.json({
        models: modelsCache.data,
        cached: true,
        stale: true,
        error: "API error, using cached data",
      })
    }

    return NextResponse.json(
      {
        error: "Failed to fetch models",
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

// Utility functions
function extractProvider(modelId: string): string {
  if (modelId.includes("/")) {
    return modelId.split("/")[0]
  }

  if (modelId.startsWith("gpt")) return "openai"
  if (modelId.startsWith("claude")) return "anthropic"
  if (modelId.startsWith("gemini")) return "google"
  if (modelId.startsWith("llama")) return "meta"
  if (modelId.includes("deepseek")) return "deepseek"

  return "unknown"
}

function formatPricing(inputPrice: number, outputPrice: number): string {
  const formatPrice = (price: number) => {
    const perMillion = price * 1000000
    if (perMillion === 0) return "Free"
    if (perMillion < 1) return `$${perMillion.toFixed(3)}`
    if (perMillion < 10) return `$${perMillion.toFixed(2)}`
    return `$${perMillion.toFixed(1)}`
  }

  const input = formatPrice(inputPrice)
  const output = formatPrice(outputPrice)

  if (input === "Free" && output === "Free") return "Free"
  if (input === output) return input
  return `${input}/${output}`
}

function calculateTier(inputPrice: number): "budget" | "mid" | "premium" {
  const perMillion = inputPrice * 1000000

  if (perMillion <= 1) return "budget"
  if (perMillion <= 5) return "mid"
  return "premium"
}

// Add endpoint to clear cache (useful for development)
export async function DELETE() {
  modelsCache = {
    data: null,
    lastFetch: 0,
    ttl: modelsCache.ttl,
  }

  return NextResponse.json({ message: "Models cache cleared" })
}
