// route.ts - Main API route for exercise generation (v2 - Modular Architecture)
import { NextResponse } from "next/server"
import { ExerciseResponse } from "./interfaces/types"
import { buildPrompt } from "./prompts/systemPrompts"
// Import modular components
import { EXERCISE_RESPONSE_SCHEMA } from "./schemas/ExerciseSchemas"
import {
  createValidationSummary,
  logValidationResults,
} from "./utilities/helpers"
import {
  sanitizeRequest,
  validateExerciseRequest,
  validateGenerationParams,
} from "./validators/requestValidator"

/**
 * POST /api/generate-exercise-v2
 * Generate a comprehensive programming exercise using AI
 */
export async function POST(request: Request) {
  try {
    // Parse and validate request
    const rawBody = await request.json()

    // Initial request validation
    const requestValidation = validateExerciseRequest(rawBody)
    if (!requestValidation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid request parameters",
          details: requestValidation.errors,
        },
        { status: 400 }
      )
    }

    // Sanitize and normalize request
    const sanitizedRequest = sanitizeRequest(rawBody)

    // Advanced parameter validation
    const paramsValidation = validateGenerationParams(sanitizedRequest)
    if (!paramsValidation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid generation parameters",
          details: paramsValidation.errors,
        },
        { status: 400 }
      )
    }

    const {
      questionInput,
      selectedLanguage,
      difficulty,
      selectedModel,
      exclusions,
    } = sanitizedRequest

    // Build system prompt
    const prompt = buildPrompt(
      questionInput,
      selectedLanguage,
      difficulty,
      exclusions
    )

    // Make API call to OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_CHATBOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 12000,
          temperature: 0.3,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          messages: [
            {
              role: "system",
              content:
                "You are an expert programming instructor. Generate complete, educational programming exercises with rich visual content for enhanced learning. You MUST always include comprehensive visual elements including memory states, execution steps, and key concepts for every exercise. For BEGINNERS use SIMPLE algorithms, not optimized ones. IMPORTANT: Always generate PLAIN TEXT code for the main code field - never use HTML formatting. In Mermaid diagrams, use DOUBLE QUOTES for all text. Mathematical expressions like sqrt(n), if(year%4==0), arr[i] are ALLOWED in Mermaid nodes.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "exercise_schema",
              strict: true,
              schema: EXERCISE_RESPONSE_SCHEMA,
            },
          },
        }),
      }
    )

    // Handle API errors
    if (!response.ok) {
      console.error(
        "OpenRouter API Error:",
        response.status,
        response.statusText
      )
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return NextResponse.json(
        { error: `AI API request failed: ${response.status}` },
        { status: response.status }
      )
    }

    // Parse AI response
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error("No content received from AI. Full response:", data)
      return NextResponse.json(
        { error: "No content received from AI API" },
        { status: 500 }
      )
    }

    // Parse and validate AI response
    let parsedContent: ExerciseResponse
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw content:", content)
      return NextResponse.json(
        { error: "Failed to parse AI response JSON" },
        { status: 500 }
      )
    }

    // Comprehensive validation using modular helpers
    const validation = createValidationSummary(parsedContent, selectedLanguage)

    if (!validation.isValid) {
      console.error("❌ Exercise validation failed:", validation.error)
      return NextResponse.json({ error: validation.error }, { status: 500 })
    }

    // Log validation results (warnings and summary)
    logValidationResults(validation)

    // Return successful response
    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error("❌ Unexpected error in generate-exercise-v2:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
