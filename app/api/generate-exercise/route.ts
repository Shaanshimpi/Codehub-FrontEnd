import { NextResponse } from "next/server"
import { buildPrompt } from "./systemPrompts"

export async function POST(request: Request) {
  try {
    const { questionInput, selectedLanguage, difficulty, selectedModel } =
      await request.json()

    const prompt = buildPrompt(questionInput, selectedLanguage, difficulty)

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
          max_tokens: 8000, // Optimized for better response completeness
          temperature: 0.3, // Consistent, focused responses
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,

          messages: [
            {
              role: "system",
              content:
                "You are an expert programming instructor. Generate complete, educational programming exercises following the detailed instructions. Focus on concept clarity and practical understanding.",
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
              schema: {
                type: "object",
                properties: {
                  title_en: {
                    type: "string",
                    description: "Exercise title in English (20-40 words)",
                  },
                  title_hi: {
                    type: "string",
                    description:
                      "Exercise title in Hindi (English script with Hindi structure)",
                  },
                  title_mr: {
                    type: "string",
                    description:
                      "Exercise title in Marathi (English script with Marathi structure)",
                  },
                  code: {
                    type: "string",
                    description:
                      "Complete working code with numbered comments [1], [2], etc. formatted as HTML with inline CSS syntax highlighting",
                  },
                  mermaid_diagram: {
                    type: "string",
                    description:
                      "Pure Mermaid code for educational diagram (flowchart, sequence, or class diagram with colorful styling)",
                  },
                  hints_en: {
                    type: "string",
                    description:
                      "10-20 practical hints in English with markdown formatting",
                  },
                  explanation_en: {
                    type: "string",
                    description:
                      "Clear explanation in English referencing numbered code parts",
                  },
                  hints_hi: {
                    type: "string",
                    description:
                      "10-20 hints in Hindi (English script with Hindi structure, technical terms in English)",
                  },
                  explanation_hi: {
                    type: "string",
                    description:
                      "Explanation in Hindi (English script with Hindi structure, technical terms in English)",
                  },
                  hints_mr: {
                    type: "string",
                    description:
                      "10-20 hints in Marathi (English script with Marathi structure, technical terms in English)",
                  },
                  explanation_mr: {
                    type: "string",
                    description:
                      "Explanation in Marathi (English script with Marathi structure, technical terms in English)",
                  },
                },
                required: [
                  "title_en",
                  "title_hi",
                  "title_mr",
                  "code",
                  "mermaid_diagram",
                  "hints_en",
                  "explanation_en",
                  "hints_hi",
                  "explanation_hi",
                  "hints_mr",
                  "explanation_mr",
                ],
                additionalProperties: false,
              },
            },
          },
        }),
      }
    )

    if (!response.ok) {
      console.error("API Response Error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error("No content received. Full response:", data)
      return NextResponse.json(
        { error: "No content received from API" },
        { status: 500 }
      )
    }

    if (data.choices?.[0]?.finish_reason === "length") {
      console.warn("Response was truncated due to max_tokens limit")
    }

    try {
      const parsedContent = JSON.parse(content)
      return NextResponse.json(parsedContent)
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw content:", content)
      return NextResponse.json(
        { error: "Failed to parse response JSON" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in generate-exercise:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
