// app/api/generate-exercise/route.ts (Updated - Separate Variables)
import { NextResponse } from "next/server"
import { buildPrompt } from "./systemPrompts"

// Separate variable definitions for better AI understanding
const TITLE_EN_SCHEMA = {
  type: "string",
  description:
    "Exercise question in brief couple of lines in English as a statement",
}

const TITLE_HI_SCHEMA = {
  type: "string",
  description:
    "Exercise question in brief couple of lines in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script) as a statement (Roman script)",
}

const TITLE_MR_SCHEMA = {
  type: "string",
  description:
    "Exercise question in brief couple of lines in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script) as a statement (Roman script)",
}

const CODE_SCHEMA = {
  type: "string",
  description:
    "Complete working PLAIN TEXT code with numbered comments [1], [2], etc. NO HTML formatting - just clean, copyable code that can be executed directly. For BEGINNERS use SIMPLE algorithms without optimizations.",
}

const MERMAID_SCHEMA = {
  type: "string",
  description:
    "Educational Mermaid flowchart explaining the code logic. Must start with diagram type (graph TD, flowchart TD, etc.). CRITICAL: Use DOUBLE QUOTES for ALL text labels. Mathematical expressions and simple code conditions are ALLOWED: sqrt(n), if(year%4==0), arr[i], i++. AVOID only these problematic characters: [], <>, \\, ;, : in node labels.",
}

const HINTS_SCHEMA = {
  type: "array",
  description: "Practical hints array",
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
}

const EXPLANATION_SCHEMA = {
  type: "array",
  description: "Detailed explanation array",
  items: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Explanation text starting with [1], [2], etc.",
      },
      type: {
        type: "string",
        enum: ["text", "solution_code", "concept", "warning", "tip"],
        description: "Type of explanation for proper formatting",
      },
      code_ref: {
        type: "array",
        items: { type: "number" },
        description: "Array of comment numbers this explanation refers to",
      },
    },
    required: ["text", "type"],
    additionalProperties: false,
  },
}

const MEMORY_STATES_SCHEMA = {
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
              description: "Current value of the variable",
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
}

const EXECUTION_STEPS_SCHEMA = {
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
}

const CONCEPTS_SCHEMA = {
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
}

const VISUAL_ELEMENTS_SCHEMA = {
  type: "object",
  description: "Required visual learning elements",
  properties: {
    memory_states: MEMORY_STATES_SCHEMA,
    execution_steps: EXECUTION_STEPS_SCHEMA,
    concepts: CONCEPTS_SCHEMA,
  },
  required: ["memory_states", "execution_steps", "concepts"],
  additionalProperties: false,
}

const BOILERPLATE_SCHEMA = {
  type: "string",
  description:
    "PLAIN TEXT starter code template for students with TODO comments and empty implementation areas. Must be clean, copyable code that can be executed directly. Should be 20%-30% part of original code for students to get started with clear guidance.",
}

const LEARNING_OBJECTIVES_SCHEMA = {
  type: "array",
  description: "Learning objectives for the exercise",
  items: {
    type: "string",
    description: "Specific learning objective starting with action verb",
  },
  minItems: 2,
  maxItems: 4,
}

const TAGS_SCHEMA = {
  type: "array",
  description: "Programming concept tags",
  items: {
    type: "string",
    description: "Single programming concept or technique",
  },
  minItems: 3,
  maxItems: 6,
}

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
              schema: {
                type: "object",
                properties: {
                  title_en: TITLE_EN_SCHEMA,
                  title_hi: TITLE_HI_SCHEMA,
                  title_mr: TITLE_MR_SCHEMA,
                  solution_code: CODE_SCHEMA,
                  mermaid_diagram: MERMAID_SCHEMA,
                  hints_en: HINTS_SCHEMA,
                  explanation_en: EXPLANATION_SCHEMA,
                  tags: TAGS_SCHEMA,
                  learning_objectives: LEARNING_OBJECTIVES_SCHEMA,
                  hints_hi: {
                    ...HINTS_SCHEMA,
                    description:
                      "Practical hints array in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                  },
                  explanation_hi: {
                    ...EXPLANATION_SCHEMA,
                    description:
                      "Detailed explanation array in use enough Hindi grammar for a Hindi first language person to understand. Use mostly nouns in English(English script)",
                  },
                  hints_mr: {
                    ...HINTS_SCHEMA,
                    description:
                      "Practical hints array in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                  },
                  explanation_mr: {
                    ...EXPLANATION_SCHEMA,
                    description:
                      "Detailed explanation array in almost English. use enough marathi grammar for a marathi first language person to understand. Use mostly nouns in English(English script)",
                  },
                  visual_elements: VISUAL_ELEMENTS_SCHEMA,
                  boilerplate_code: BOILERPLATE_SCHEMA,
                },
                required: [
                  "title_en",
                  "title_hi",
                  "title_mr",
                  "solution_code",
                  "mermaid_diagram",
                  "hints_en",
                  "explanation_en",
                  "hints_hi",
                  "explanation_hi",
                  "hints_mr",
                  "explanation_mr",
                  "visual_elements",
                  "boilerplate_code",
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
        parsedContent.solution_code &&
        (parsedContent.solution_code.includes("<pre>") ||
          parsedContent.solution_code.includes("<code>"))
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

      // Validate Mermaid diagram for double quotes
      if (parsedContent.mermaid_diagram) {
        const mermaidContent = parsedContent.mermaid_diagram
        // Check for single quotes in node labels (potential issue)
        if (mermaidContent.includes("'") && !mermaidContent.includes('"')) {
          console.warn(
            "⚠️ Mermaid diagram may be using single quotes instead of double quotes"
          )
        }
      }

      console.log("✅ All validations passed:", {
        memoryStates: visualElements.memory_states.length,
        executionSteps: visualElements.execution_steps.length,
        concepts: visualElements.concepts.length,
        hasBoilerplate: !!parsedContent.boilerplate_code,
        codeFormat: parsedContent.solution_code?.includes("<")
          ? "HTML"
          : "Plain Text",
        boilerplateFormat: parsedContent.boilerplate_code?.includes("<")
          ? "HTML"
          : "Plain Text",
        mermaidQuotes: parsedContent.mermaid_diagram?.includes('"')
          ? "Double Quotes"
          : "Single Quotes",
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
