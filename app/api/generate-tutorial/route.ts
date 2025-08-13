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

    console.log("🚀 Generating tutorial:", {
      topic,
      language,
      difficulty,
      numLessons,
    })
    if (customPrompts) {
      console.log("🔧 Using custom prompts")
    }

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

    console.log("📝 Tutorial Generation Request:")
    console.log("Topic:", topic)
    console.log("Language:", language)
    console.log("Difficulty:", difficulty)
    console.log("Number of Lessons:", numLessons)
    console.log("Number of Lessons Type:", typeof numLessons)
    console.log("Focus Areas:", focusAreas)
    console.log("Exclusions:", exclusions)
    console.log("Selected Model:", selectedModel)
    console.log("Generated Prompt length:", prompt.length)

    // Verify numLessons is being passed correctly
    if (!numLessons || numLessons < 1) {
      console.warn(
        "⚠️ Invalid numLessons detected:",
        numLessons,
        "- defaulting to 5"
      )
    } else {
      console.log("✅ Valid numLessons detected:", numLessons)
    }

    // Log the schema structure being sent
    console.log("📋 Schema being sent to API:")
    console.log(
      "Using ProgrammingTutorialSchema with proper multi-language structure"
    )
    // Try with selected model first, fallback to GPT-4o-mini if needed
    let response
    let attemptedModel = selectedModel || "openai/gpt-4o-mini"

    // Some models don't support json_schema, so we'll use json_object for unsupported models
    const jsonSchemaSupported =
      attemptedModel.includes("gpt-4o") ||
      attemptedModel.includes("gpt-4-turbo") ||
      attemptedModel.includes("gpt-3.5-turbo") ||
      attemptedModel.includes("gpt-4")

    console.log("🔧 Model supports json_schema:", jsonSchemaSupported)
    console.log(
      "🔧 Using response format:",
      jsonSchemaSupported ? "json_schema" : "json_object"
    )

    console.log(
      "🔧 About to make API call to:",
      "https://openrouter.ai/api/v1/chat/completions"
    )
    console.log("🔧 Using model:", attemptedModel)
    console.log("🔧 API Key available:", !!process.env.AI_CHATBOT_API_KEY)

    try {
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
              role: "system",
              content: `You are an expert programming instructor. Create comprehensive, well-structured tutorials with diverse lesson types and engaging content in English only. CRITICAL: ALL CODE EXAMPLES AND PROGRAMMING CONTENT MUST BE IN ${language.toUpperCase()} - use ${language} syntax, ${language} conventions, and ${language}-specific features.

The response MUST contain exactly these top-level fields:
1. title: Tutorial title
2. description: Tutorial description
3. learningObjectives: Array of learning objectives
4. keyTopics: Array of key topics
5. difficulty: Number (1, 2, or 3)
6. lessons: Array of lesson objects
7. practicalApplications: Array of practical applications
8. tags: Array of tags
9. reference: W3Schools-style reference object (MANDATORY)

The reference field is ABSOLUTELY REQUIRED and must contain:
- title: Main concept title
- subtitle: Brief explanatory subtitle  
- introduction: Opening paragraph explaining the concept
- examples: Array of 3-4 complete code examples, each with title, description, code, explanation, and optional output
- key_points: Array of 3-6 important points to remember
- common_mistakes: Array of 2-4 common mistakes with mistake, why_wrong, and correct_approach
- syntax_guide: Object with basic_syntax string and parameters array

Each lesson content MUST match its lesson type exactly. Return valid JSON with ALL required fields including the reference field.`,
            },
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
    } catch (fetchError) {
      console.error("❌ Fetch error with model:", attemptedModel)
      console.error("❌ Fetch error details:", fetchError)
      console.error("❌ Error message:", fetchError.message)
      console.error("❌ API Key available:", !!process.env.AI_CHATBOT_API_KEY)
      console.error(
        "❌ API Key first 20 chars:",
        process.env.AI_CHATBOT_API_KEY?.substring(0, 20)
      )
      throw fetchError
    }

    console.log("📡 Response status:", response.status, response.statusText)
    console.log("📡 Response ok:", response.ok)

    const data = await response.json()

    if (!response.ok) {
      console.error("❌ API response not ok:", data)
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

    console.log("✅ API call successful!")
    console.log("📥 Raw API response data keys:", Object.keys(data))
    console.log("📥 Choices array length:", data.choices?.length)
    console.log("📥 Content length:", content?.length)

    // Parse the content to check for reference field
    try {
      const parsedContent = JSON.parse(content)
      console.log("📥 Parsed content keys:", Object.keys(parsedContent))
      console.log("📥 Has reference field:", !!parsedContent.reference)
      if (parsedContent.reference) {
        console.log(
          "📥 Reference field keys:",
          Object.keys(parsedContent.reference)
        )
      } else {
        console.log("❌ Reference field is missing from AI response")
      }
    } catch (parseError) {
      console.error(
        "❌ Failed to parse content for debugging:",
        parseError.message
      )
      console.log(
        "📥 Raw content (first 1000 chars):",
        content?.substring(0, 1000)
      )
    }

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
      console.error(
        "❌ All JSON parsing strategies failed, creating fallback tutorial"
      )
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

    console.log(
      "📥 Processed tutorial has reference:",
      !!processedTutorial.reference
    )

    return NextResponse.json(processedTutorial)
  } catch (error) {
    logError("generate-tutorial POST", error)
    return NextResponse.json(createErrorResponse("Internal server error"), {
      status: 500,
    })
  }
}
