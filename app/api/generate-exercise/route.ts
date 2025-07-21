// app/api/generate-exercise/route.ts (Updated for Plain Text Code)
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
                "You are an expert programming instructor. Generate complete, educational programming exercises with rich visual content for enhanced learning. You MUST always include comprehensive visual elements including memory states, execution steps, and key concepts for every exercise. Additionally, determine if the exercise is suitable for automated testing and provide test cases and boilerplate code when appropriate. IMPORTANT: Always generate PLAIN TEXT code for the main code field - never use HTML formatting.",
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
                    description:
                      "Exercise question in brief couple of lines in English",
                  },
                  title_hi: {
                    type: "string",
                    description:
                      "Exercise question in brief couple of lines in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                  },
                  title_mr: {
                    type: "string",
                    description:
                      "Exercise question in brief couple of lines in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                  },
                  code: {
                    type: "string",
                    description:
                      "Complete working PLAIN TEXT code with numbered comments [1], [2], etc. NO HTML formatting - just clean, copyable code that can be executed directly.",
                  },
                  mermaid_diagram: {
                    type: "string",
                    description:
                      "Educational Mermaid flowchart explaining the code logic. Must start with diagram type (graph TD, flowchart TD, etc.) and use proper syntax without special characters in node labels.",
                  },
                  hints_en: {
                    type: "array",
                    description: "Practical hints array in English",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Clear, practical hint text. Use backticks for inline code.",
                        },
                        code_snippet: {
                          type: "string",
                          description: "Optional plain text code example",
                        },
                      },
                      required: ["text"],
                      additionalProperties: false,
                    },
                  },
                  explanation_en: {
                    type: "array",
                    description: "Detailed explanation array in English",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Explanation text starting with [1], [2], etc.",
                        },
                        type: {
                          type: "string",
                          enum: ["text", "code", "concept", "warning", "tip"],
                          description:
                            "Type of explanation for proper formatting",
                        },
                        code_ref: {
                          type: "array",
                          items: { type: "number" },
                          description:
                            "Array of comment numbers this explanation refers to",
                        },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  hints_hi: {
                    type: "array",
                    description:
                      "Practical hints array in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description: "Clear, practical hint text",
                        },
                        code_snippet: {
                          type: "string",
                          description: "Optional plain text code example",
                        },
                      },
                      required: ["text"],
                      additionalProperties: false,
                    },
                  },
                  explanation_hi: {
                    type: "array",
                    description:
                      "Detailed explanation array in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Explanation text starting with [1], [2], etc.",
                        },
                        type: {
                          type: "string",
                          enum: ["text", "code", "concept", "warning", "tip"],
                          description:
                            "Type of explanation for proper formatting",
                        },
                        code_ref: {
                          type: "array",
                          items: { type: "number" },
                          description:
                            "Array of comment numbers this explanation refers to",
                        },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  hints_mr: {
                    type: "array",
                    description:
                      "Practical hints array in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description: "Clear, practical hint text",
                        },
                        code_snippet: {
                          type: "string",
                          description: "Optional plain text code example",
                        },
                      },
                      required: ["text"],
                      additionalProperties: false,
                    },
                  },
                  explanation_mr: {
                    type: "array",
                    description:
                      "Detailed explanation array in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                    items: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          description:
                            "Explanation text starting with [1], [2], etc.",
                        },
                        type: {
                          type: "string",
                          enum: ["text", "code", "concept", "warning", "tip"],
                          description:
                            "Type of explanation for proper formatting",
                        },
                        code_ref: {
                          type: "array",
                          items: { type: "number" },
                          description:
                            "Array of comment numbers this explanation refers to",
                        },
                      },
                      required: ["text", "type"],
                      additionalProperties: false,
                    },
                  },
                  visual_elements: {
                    type: "object",
                    description: "Required visual learning elements",
                    properties: {
                      memory_states: {
                        type: "array",
                        description: "Memory state visualization",
                        items: {
                          type: "object",
                          properties: {
                            step: {
                              type: "string",
                              description: "Step identifier",
                            },
                            variables: {
                              type: "array",
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
                                    description: "Data type",
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
                        description: "Step-by-step execution trace",
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
                              description: "Any output produced",
                            },
                          },
                          required: ["step", "line", "description", "output"],
                          additionalProperties: false,
                        },
                      },
                      concepts: {
                        type: "array",
                        description: "Key programming concepts demonstrated",
                        items: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              description: "Concept name",
                            },
                            description: {
                              type: "string",
                              description: "Clear explanation of the concept",
                            },
                            visual_metaphor: {
                              type: "string",
                              description: "Real-world analogy or metaphor",
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
                  // Test case structure
                  is_testable: {
                    type: "boolean",
                    description:
                      "Whether this exercise can be automatically tested",
                  },
                  test_reason: {
                    type: "string",
                    description:
                      "Brief explanation of why the exercise is testable or not",
                  },
                  test_cases: {
                    type: "array",
                    description:
                      "Array of test cases (only if is_testable is true)",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description: "Descriptive name for the test case",
                        },
                        input: {
                          type: "string",
                          description: "Plain text input data for the test",
                        },
                        expected_output: {
                          type: "string",
                          description: "Plain text expected output",
                        },
                        is_hidden: {
                          type: "boolean",
                          description:
                            "Whether this test case is hidden from students",
                        },
                      },
                      required: [
                        "name",
                        "input",
                        "expected_output",
                        "is_hidden",
                      ],
                      additionalProperties: false,
                    },
                  },
                  boilerplate_code: {
                    type: "string",
                    description:
                      "PLAIN TEXT starter code template for students (only if is_testable is true). Must be clean, copyable code that can be executed directly.",
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
                  "is_testable",
                  "test_reason",
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

    try {
      const parsedContent = JSON.parse(content)

      // Validate that visual_elements are present
      if (!parsedContent.visual_elements) {
        console.error("Missing visual_elements in response")
        return NextResponse.json(
          { error: "Response missing required visual elements" },
          { status: 500 }
        )
      }

      const visualElements = parsedContent.visual_elements

      // Check for required visual elements with simplified validation
      if (
        !visualElements.memory_states ||
        !Array.isArray(visualElements.memory_states)
      ) {
        console.error("Missing or invalid memory_states")
        return NextResponse.json(
          { error: "Response missing required memory states visualization" },
          { status: 500 }
        )
      }

      if (
        !visualElements.execution_steps ||
        !Array.isArray(visualElements.execution_steps)
      ) {
        console.error("Missing or invalid execution_steps")
        return NextResponse.json(
          { error: "Response missing required execution steps" },
          { status: 500 }
        )
      }

      if (!visualElements.concepts || !Array.isArray(visualElements.concepts)) {
        console.error("Missing or invalid concepts")
        return NextResponse.json(
          { error: "Response missing required concepts" },
          { status: 500 }
        )
      }

      // Validate that code is plain text (not HTML)
      if (
        parsedContent.code &&
        (parsedContent.code.includes("<pre>") ||
          parsedContent.code.includes("<code>"))
      ) {
        console.warn(
          "⚠️ Main code contains HTML formatting - this should be plain text"
        )
        // Could optionally strip HTML here if needed
      }

      if (
        parsedContent.boilerplate_code &&
        (parsedContent.boilerplate_code.includes("<pre>") ||
          parsedContent.boilerplate_code.includes("<code>"))
      ) {
        console.warn(
          "⚠️ Boilerplate code contains HTML formatting - this should be plain text"
        )
      }

      console.log("✅ All validations passed:", {
        memoryStates: visualElements.memory_states.length,
        executionSteps: visualElements.execution_steps.length,
        concepts: visualElements.concepts.length,
        isTestable: parsedContent.is_testable,
        testCasesCount: parsedContent.test_cases?.length || 0,
        hasBoilerplate: !!parsedContent.boilerplate_code,
        codeFormat: parsedContent.code?.includes("<") ? "HTML" : "Plain Text",
        boilerplateFormat: parsedContent.boilerplate_code?.includes("<")
          ? "HTML"
          : "Plain Text",
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
