// app/api/generate-exercise/route.ts (updated schema portion)
// app/api/generate-exercise/route.ts
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
          max_tokens: 8000,
          temperature: 0.3,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,

          messages: [
            {
              role: "system",
              content:
                "You are an expert programming instructor. Generate complete, educational programming exercises with rich visual content for enhanced learning. You MUST always include comprehensive visual elements including memory states, execution steps, and key concepts for every exercise.",
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
                      "Complete working code with numbered comments [1], [2], etc. HTML formatted with VS Code styling",
                  },
                  mermaid_diagram: {
                    type: "string",
                    description:
                      "Pure Mermaid code for educational diagram (no semicolons or quotes)",
                  },
                  hints_en: {
                    type: "array",
                    description: "8-10 practical hints in English",
                    minItems: 8,
                    maxItems: 10,
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description: "The hint text",
                        },
                        code_snippet: {
                          type: "string",
                          description:
                            "Optional code snippet related to this hint",
                        },
                      },
                      required: ["text"],
                      additionalProperties: false,
                    },
                  },
                  explanation_en: {
                    type: "array",
                    description:
                      "Clear explanation in English with code references",
                    minItems: 3,
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Explanation text, can include [1], [2] references",
                        },
                        type: {
                          type: "string",
                          enum: ["text", "code", "concept", "warning", "tip"],
                          description: "Type of explanation block",
                        },
                        code_ref: {
                          type: "array",
                          description:
                            "Array of code comment numbers this explanation refers to",
                          items: { type: "number" },
                        },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  hints_hi: {
                    type: "array",
                    description: "8-10 practical hints in Hindi",
                    minItems: 8,
                    maxItems: 10,
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "The hint text in Hindi (English script)",
                        },
                        code_snippet: {
                          type: "string",
                          description: "Optional code snippet",
                        },
                      },
                      required: ["text"],
                      additionalProperties: false,
                    },
                  },
                  explanation_hi: {
                    type: "array",
                    description:
                      "Clear explanation in Hindi with code references",
                    minItems: 3,
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Explanation text in Hindi (English script)",
                        },
                        type: {
                          type: "string",
                          enum: ["text", "code", "concept", "warning", "tip"],
                        },
                        code_ref: {
                          type: "array",
                          items: { type: "number" },
                        },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  hints_mr: {
                    type: "array",
                    description: "8-10 practical hints in Marathi",
                    minItems: 8,
                    maxItems: 10,
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "The hint text in Marathi (English script)",
                        },
                        code_snippet: {
                          type: "string",
                          description: "Optional code snippet",
                        },
                      },
                      required: ["text"],
                      additionalProperties: false,
                    },
                  },
                  explanation_mr: {
                    type: "array",
                    description:
                      "Clear explanation in Marathi with code references",
                    minItems: 3,
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Explanation text in Marathi (English script)",
                        },
                        type: {
                          type: "string",
                          enum: ["text", "code", "concept", "warning", "tip"],
                        },
                        code_ref: {
                          type: "array",
                          items: { type: "number" },
                        },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  visual_elements: {
                    type: "object",
                    description:
                      "Required visual learning elements - MUST be provided for every exercise",
                    properties: {
                      memory_states: {
                        type: "array",
                        description:
                          "Memory state visualization showing variable changes through execution",
                        minItems: 1,
                        items: {
                          type: "object",
                          properties: {
                            step: {
                              type: "string",
                              description:
                                "Step identifier (e.g., 'Initial', 'After line 5', 'Final')",
                            },
                            variables: {
                              type: "array",
                              minItems: 1,
                              items: {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    description: "Variable name",
                                  },
                                  value: {
                                    type: "string",
                                    description:
                                      "Current value of the variable",
                                  },
                                  type: {
                                    type: "string",
                                    description:
                                      "Data type (int, string, array, etc.)",
                                  },
                                },
                                required: ["name", "value", "type"],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ["step", "variables"],
                          additionalProperties: false,
                        },
                      },
                      execution_steps: {
                        type: "array",
                        description:
                          "Step-by-step execution trace of the program",
                        minItems: 3,
                        items: {
                          type: "object",
                          properties: {
                            step: {
                              type: "number",
                              description: "Sequential step number",
                            },
                            line: {
                              type: "string",
                              description: "Code line being executed",
                            },
                            description: {
                              type: "string",
                              description: "What happens in this step",
                            },
                            output: {
                              type: "string",
                              description:
                                "Any output produced (empty string if no output)",
                            },
                          },
                          required: ["step", "line", "description", "output"],
                          additionalProperties: false,
                        },
                      },
                      concepts: {
                        type: "array",
                        description:
                          "Key programming concepts demonstrated in the exercise",
                        minItems: 2,
                        items: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              description:
                                "Concept name (e.g., 'Loops', 'Arrays', 'Functions')",
                            },
                            description: {
                              type: "string",
                              description: "Clear explanation of the concept",
                            },
                            visual_metaphor: {
                              type: "string",
                              description:
                                "Real-world analogy or metaphor to explain the concept",
                            },
                          },
                          required: ["name", "description", "visual_metaphor"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["memory_states", "execution_steps", "concepts"],
                    additionalProperties: false,
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
                  "visual_elements",
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
    console.log(data)
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error("No content received. Full response:", data)
      return NextResponse.json(
        { error: "No content received from API" },
        { status: 500 }
      )
    }

    try {
      const parsedContent = JSON.parse(content)

      // Validate that visual_elements are present and have required content
      if (!parsedContent.visual_elements) {
        console.error("Missing visual_elements in response")
        return NextResponse.json(
          { error: "Response missing required visual elements" },
          { status: 500 }
        )
      }

      const visualElements = parsedContent.visual_elements

      // Check for required visual elements
      if (
        !visualElements.memory_states ||
        !Array.isArray(visualElements.memory_states) ||
        visualElements.memory_states.length === 0
      ) {
        console.error("Missing or empty memory_states")
        return NextResponse.json(
          { error: "Response missing required memory states visualization" },
          { status: 500 }
        )
      }

      if (
        !visualElements.execution_steps ||
        !Array.isArray(visualElements.execution_steps) ||
        visualElements.execution_steps.length < 3
      ) {
        console.error("Missing or insufficient execution_steps")
        return NextResponse.json(
          {
            error:
              "Response missing required execution steps (minimum 3 steps)",
          },
          { status: 500 }
        )
      }

      if (
        !visualElements.concepts ||
        !Array.isArray(visualElements.concepts) ||
        visualElements.concepts.length < 2
      ) {
        console.error("Missing or insufficient concepts")
        return NextResponse.json(
          { error: "Response missing required concepts (minimum 2 concepts)" },
          { status: 500 }
        )
      }

      // Additional validation for content quality
      const hasValidMemoryStates = visualElements.memory_states.every(
        (state) =>
          state.step &&
          state.variables &&
          Array.isArray(state.variables) &&
          state.variables.length > 0
      )

      const hasValidExecutionSteps = visualElements.execution_steps.every(
        (step) =>
          typeof step.step === "number" &&
          step.line &&
          step.description &&
          step.output !== undefined
      )

      const hasValidConcepts = visualElements.concepts.every(
        (concept) =>
          concept.name && concept.description && concept.visual_metaphor
      )

      if (!hasValidMemoryStates) {
        console.error("Invalid memory states structure")
        return NextResponse.json(
          { error: "Invalid memory states structure in response" },
          { status: 500 }
        )
      }

      if (!hasValidExecutionSteps) {
        console.error("Invalid execution steps structure")
        return NextResponse.json(
          { error: "Invalid execution steps structure in response" },
          { status: 500 }
        )
      }

      if (!hasValidConcepts) {
        console.error("Invalid concepts structure")
        return NextResponse.json(
          { error: "Invalid concepts structure in response" },
          { status: 500 }
        )
      }

      console.log("✅ Visual elements validation passed:", {
        memoryStates: visualElements.memory_states.length,
        executionSteps: visualElements.execution_steps.length,
        concepts: visualElements.concepts.length,
      })

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
