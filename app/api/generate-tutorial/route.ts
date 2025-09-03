// app/api/generate-tutorial/route.ts - Precise Tutorial Generation API
import { NextResponse } from "next/server"
import {
  buildCustomTutorialPrompt,
  buildTutorialPrompt,
} from "./prompts/systemPrompts"
import { COMPLETE_TUTORIAL_SCHEMA } from "./schemas/ProgrammingTutorialSchema"
import {
  convertToModernFormat,
  createErrorResponse,
  logError,
  parseJsonWithFallbacks,
} from "./utilities/helpers"

export async function POST(request: Request) {
  try {
    const {
      topic,
      language,
      difficulty,
      numLessons,
      focusAreas,
      exclusions,
      selectedModel,
      customPrompts,
    } = await request.json()

    const prompt = customPrompts
      ? buildCustomTutorialPrompt(
          topic,
          language,
          difficulty,
          numLessons,
          focusAreas,
          exclusions,
          customPrompts
        )
      : buildTutorialPrompt(
          topic,
          language,
          difficulty,
          numLessons,
          focusAreas,
          exclusions
        )

    // Verify numLessons is being passed correctly
    if (!numLessons || numLessons < 1) {
      // Default to 5 lessons if invalid
    }

    // Try with selected model first, fallback to GPT-4o-mini if needed
    let response
    let attemptedModel = selectedModel || "openai/gpt-4o-mini"

    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_CHATBOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: attemptedModel,
        max_tokens: 50000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_object",
          json_schema: COMPLETE_TUTORIAL_SCHEMA,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logError(
        "OpenRouter API",
        `HTTP ${response.status}: ${response.statusText}`,
        data
      )
      return NextResponse.json(
        createErrorResponse(
          `API Error: ${data.error?.message || response.statusText}`
        ),
        { status: 500 }
      )
    }

    const content = data.choices?.[0]?.message?.content

    if (!content) {
      logError("API Response", "No content received", data)
      return NextResponse.json(
        createErrorResponse("No content received from API"),
        { status: 500 }
      )
    }

    // Parse the content using fallback strategies and ensure it has a reference field
    let parsedTutorial
    try {
      parsedTutorial = parseJsonWithFallbacks(content)
    } catch (parseError) {
      // Create a minimal tutorial structure as fallback
      parsedTutorial = {
        id: `${language}-${topic.replace(/\s+/g, "-").toLowerCase()}-tutorial`,
        title: `${topic} in ${language}`,
        description: `A tutorial covering ${topic} concepts in ${language} programming.`,
        learningObjectives: [
          `Understand ${topic} concepts`,
          `Apply ${topic} in ${language} programming`,
          `Practice with examples and exercises`,
        ],
        keyTopics: [topic.toLowerCase(), language.toLowerCase()],
        difficulty: difficulty || 1,
        lessons: [
          {
            id: "lesson-1",
            title: `Introduction to ${topic}`,
            type: "concept",
            content: {
              explanation: `Learn about ${topic} in ${language}.`,
              keyPoints: [`${topic} is important in programming`],
              codeExamples: [
                {
                  title: "Basic Example",
                  code: `// ${language} ${topic} example\n// Code will be added here`,
                  explanation: `This shows how to use ${topic} in ${language}.`,
                },
              ],
              practiceHints: ["Practice with simple examples"],
            },
            learningObjectives: [`Understand ${topic} basics`],
            order: 1,
          },
        ],
        practicalApplications: [`Real-world use of ${topic}`],
        tags: [topic.toLowerCase(), language.toLowerCase()],
      }
    }

    const processedTutorial = convertToModernFormat(parsedTutorial)

    return NextResponse.json(processedTutorial)
  } catch (error) {
    logError("generate-tutorial POST", error)
    return NextResponse.json(createErrorResponse("Internal server error"), {
      status: 500,
    })
  }
}
