// app/api/generate-tutorial/route.ts - Precise Tutorial Generation API
import { NextResponse } from "next/server"
import {
  buildCustomTutorialPrompt,
  buildTutorialPrompt,
} from "./prompts/systemPrompts"
import {
  cleanJsonContent,
  convertToModernFormat,
  createErrorResponse,
  logError,
  parseJsonWithFallbacks,
} from "./utilities/helpers"
import { validateAPIResponse } from "./utilities/validation"

// All schema definitions are now in the organized structure:
// - schemas/ProgrammingTutorialSchema.ts
// - interfaces/types.ts
// - utilities/validation.ts
// - utilities/helpers.ts
// - prompts/systemPrompts.ts

// All interfaces are now imported from the organized structure

// Validation functions are now imported from utilities/validation.ts

// Helper functions are now imported from utilities/helpers.ts

// Types are now imported from interfaces/types.ts

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
          max_tokens: 12000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          messages: [
            {
              role: "system",
              content: `You are an expert programming instructor. Create comprehensive, well-structured tutorials with diverse lesson types and engaging content in English only. CRITICAL: ALL CODE EXAMPLES AND PROGRAMMING CONTENT MUST BE IN ${language.toUpperCase()} - use ${language} syntax, ${language} conventions, and ${language}-specific features. Each lesson content MUST match its lesson type exactly: 'concept' lessons need explanation, keyPoints, codeExamples, practiceHints; 'mcq' lessons need questions array with 4 options each; 'codeblock_rearranging' lessons need scenario, targetCode, codeBlocks array, correctOrder; 'fill_in_blanks' lessons need scenario, codeTemplate with {{blank_id}} placeholders, blanks array, solution. ALWAYS use DOUBLE QUOTES in Mermaid diagrams and ensure all code examples are complete and functional ${language} code. Return valid JSON matching the exact schema structure with English content only but ${language} code examples.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_object",
          },
        }),
      })
    } catch (fetchError) {
      console.error("❌ Fetch error with model:", attemptedModel)
      console.error("❌ Fetch error details:", fetchError)
      console.error("❌ Error message:", fetchError.message)
      throw fetchError
    }

    if (!response.ok) {
      console.error(
        "❌ API Response Error:",
        response.status,
        response.statusText
      )
      const errorText = await response.text()
      console.error("❌ Error details:", errorText)
      console.error("❌ Failed model:", attemptedModel)
      console.error("❌ Request that failed - Model:", attemptedModel)
      console.error("❌ Request that failed - Topic:", topic)
      console.error("❌ Request that failed - Language:", language)

      // Try fallback to GPT-4o-mini if original model failed
      if (attemptedModel !== "openai/gpt-4o-mini") {
        console.log("🔄 Trying fallback model: openai/gpt-4o-mini")
        try {
          response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.AI_CHATBOT_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                max_tokens: 12000,
                temperature: 0.7,
                messages: [
                  {
                    role: "system",
                    content: `You are an expert programming instructor. Create comprehensive, well-structured tutorials with diverse lesson types and engaging content in English only. CRITICAL: ALL CODE EXAMPLES AND PROGRAMMING CONTENT MUST BE IN ${language.toUpperCase()} - use ${language} syntax, ${language} conventions, and ${language}-specific features. Your response MUST be valid JSON only - no additional text, comments, or explanations outside the JSON object. Each lesson content MUST match its lesson type exactly: 'concept' lessons need explanation, keyPoints, codeExamples, practiceHints; 'mcq' lessons need questions array with 4 options each; 'codeblock_rearranging' lessons need scenario, targetCode, codeBlocks array, correctOrder; 'fill_in_blanks' lessons need scenario, codeTemplate with {{blank_id}} placeholders, blanks array, solution. ALWAYS use DOUBLE QUOTES in Mermaid diagrams and ensure all code examples are complete and functional ${language} code. Return only valid JSON matching the exact schema structure with English content only but ${language} code examples.`,
                  },
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
                response_format: {
                  type: "json_object",
                },
              }),
            }
          )

          if (!response.ok) {
            const fallbackErrorText = await response.text()
            console.error("Fallback model also failed:", fallbackErrorText)
            return NextResponse.json(
              {
                error: `Both primary and fallback models failed: ${response.status}`,
              },
              { status: response.status }
            )
          }
        } catch (fallbackError) {
          console.error("Fallback model error:", fallbackError)
          return NextResponse.json(
            { error: `API request failed with fallback: ${response.status}` },
            { status: response.status }
          )
        }
      } else {
        return NextResponse.json(
          { error: `API request failed: ${response.status}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    console.log("✅ API call successful!")
    console.log("📥 Raw API response data keys:", Object.keys(data))
    console.log("📥 Choices array length:", data.choices?.length)
    console.log("📥 Content length:", content?.length)
    console.log(
      "📥 Content preview (first 500 chars):",
      content?.substring(0, 500)
    )

    if (!content) {
      logError("API Response", "No content received", data)
      return NextResponse.json(
        createErrorResponse("No content received from API"),
        { status: 500 }
      )
    }

    console.log("🔍 Attempting to parse JSON content...")
    console.log("📏 Content length:", content.length)
    console.log("📄 Raw content (FULL):", content)
    console.log("📄 Content starts with:", content.substring(0, 100))
    console.log(
      "📄 Content ends with:",
      content.substring(Math.max(0, content.length - 100))
    )
    console.log("🔍 Looking for JSON patterns...")
    console.log("- Contains '{' at position:", content.indexOf("{"))
    console.log("- Contains '}' at position:", content.lastIndexOf("}"))
    console.log("- Contains 'title' keyword:", content.includes("title"))
    console.log("- Contains 'lessons' keyword:", content.includes("lessons"))

    try {
      // Use fallback JSON parsing with multiple strategies
      console.log("🔧 Using advanced JSON parsing with fallback strategies...")
      const parsedContent = parseJsonWithFallbacks(content)

      console.log("✅ JSON parsing successful!")
      console.log("📋 Parsed content keys:", Object.keys(parsedContent))
      console.log(
        "🔍 Parsed content title type:",
        typeof parsedContent.title,
        parsedContent.title
      )
      console.log(
        "🔍 Parsed content description type:",
        typeof parsedContent.description
      )
      console.log(
        "🔍 First lesson title type:",
        typeof parsedContent.lessons?.[0]?.title,
        parsedContent.lessons?.[0]?.title
      )

      // Validate API response structure
      const apiValidation = validateAPIResponse(parsedContent)
      if (!apiValidation.isValid) {
        console.warn("API response validation issues:", apiValidation.errors)
        // Continue with processing but log warnings
      }

      // Convert to modern English-only format matching TutorialAIData interface
      const finalContent = convertToModernFormat(parsedContent)

      console.log("🔄 After conversion:")
      console.log(
        "🔍 Final content title type:",
        typeof finalContent.title,
        finalContent.title
      )
      console.log(
        "🔍 Final content description type:",
        typeof finalContent.description
      )
      console.log(
        "🔍 Final first lesson title type:",
        typeof finalContent.lessons?.[0]?.title,
        finalContent.lessons?.[0]?.title
      )

      console.log("✅ Tutorial processing completed:", {
        totalLessons: finalContent.lessons?.length || 0,
        lessonTypes: finalContent.lessons?.map((l: any) => l.type) || [],
        hasMermaidDiagram: !!finalContent.mermaid_diagram,
        estimatedTime: finalContent.estimatedTime,
        difficulty: finalContent.difficulty,
      })

      return NextResponse.json(finalContent)
    } catch (parseError) {
      console.error("❌ All JSON Parsing Strategies Failed!")
      console.error("- Final error message:", parseError.message)
      console.error("- Content length:", content.length)
      console.error(
        "- Content preview (first 500 chars):",
        content.substring(0, 500)
      )
      console.error(
        "- Content end (last 500 chars):",
        content.substring(Math.max(0, content.length - 500))
      )

      // Try to identify the specific error location
      if (parseError.message.includes("position")) {
        const match = parseError.message.match(/position (\d+)/)
        if (match) {
          const position = parseInt(match[1])
          const start = Math.max(0, position - 50)
          const end = Math.min(content.length, position + 50)
          console.error(
            `- Error context around position ${position}:`,
            content.substring(start, end)
          )
        }
      }

      logError("JSON Parsing - All Strategies Failed", parseError, {
        contentLength: content.length,
        contentPreview: content.substring(0, 200),
        cleanedContentPreview: cleanJsonContent(content).substring(0, 200),
        parseStrategiesUsed: 6,
      })

      // Last resort: create a fallback tutorial structure
      console.log(
        "🆘 Creating fallback tutorial structure due to JSON parsing failure"
      )
      console.log("📊 Requested number of lessons:", numLessons)

      // Generate realistic educational lessons based on programming topic and language
      const generateFallbackLessons = (
        count: number,
        topic: string,
        language: string
      ) => {
        const lessonTypes = [
          "concept",
          "mcq",
          "fill_in_blanks",
          "codeblock_rearranging",
        ]
        const lessons = []

        // Create educational content based on the actual programming topic
        const getEducationalContent = (
          lessonType: string,
          lessonNumber: number,
          topic: string,
          language: string
        ) => {
          // Map common topics to educational content
          const topicMappings: Record<string, any> = {
            "while loop": {
              concept: {
                explanation:
                  lessonNumber === 1
                    ? `A while loop is a fundamental control structure in ${language} that repeatedly executes a block of code as long as a specified condition remains true. It's one of the most important concepts in programming for creating repetitive tasks.`
                    : lessonNumber <= count / 2
                      ? `While loops are essential for creating programs that can handle repetitive tasks efficiently. Understanding how to control loop execution and avoid common pitfalls is crucial for writing robust code.`
                      : `Advanced while loop techniques include nested loops, complex conditions, and optimization strategies. Mastering these concepts will make you a more effective programmer.`,
                keyPoints:
                  lessonNumber === 1
                    ? [
                        "While loops check a condition before each iteration",
                        "The loop body executes only when the condition is true",
                        "The condition must eventually become false to avoid infinite loops",
                        "Loop variables should be initialized before the loop",
                      ]
                    : lessonNumber <= count / 2
                      ? [
                          "Always ensure the loop condition will eventually become false",
                          "Initialize loop control variables properly",
                          "Update loop variables inside the loop body",
                          "Use meaningful variable names for better readability",
                        ]
                      : [
                          "Optimize loop conditions for better performance",
                          "Consider using other loop types when appropriate",
                          "Handle edge cases and boundary conditions",
                          "Use nested loops carefully to avoid complexity",
                        ],
                codeExamples: [
                  {
                    title:
                      lessonNumber === 1
                        ? "Basic While Loop Syntax"
                        : `While Loop Example ${lessonNumber}`,
                    code:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int count = 1;\n    \n    while (count <= 5) {\n        printf("Count: %d\\n", count);\n        count++;  // Important: increment to avoid infinite loop\n    }\n    \n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int number, sum = 0;\n    \n    printf("Enter numbers (0 to stop): ");\n    scanf("%d", &number);\n    \n    while (number != 0) {\n        sum += number;\n        printf("Enter next number: ");\n        scanf("%d", &number);\n    }\n    \n    printf("Total sum: %d\\n", sum);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int n = 10;\n    \n    // Nested while loops\n    int i = 1;\n    while (i <= n) {\n        int j = 1;\n        while (j <= i) {\n            printf("* ");\n            j++;\n        }\n        printf("\\n");\n        i++;\n    }\n    \n    return 0;\n}`
                        : language === "cpp" || language === "c++"
                          ? lessonNumber === 1
                            ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int count = 1;\n    \n    while (count <= 5) {\n        cout << "Count: " << count << endl;\n        count++;  // Important: increment to avoid infinite loop\n    }\n    \n    return 0;\n}`
                            : lessonNumber <= count / 2
                              ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int number, sum = 0;\n    \n    cout << "Enter numbers (0 to stop): ";\n    cin >> number;\n    \n    while (number != 0) {\n        sum += number;\n        cout << "Enter next number: ";\n        cin >> number;\n    }\n    \n    cout << "Total sum: " << sum << endl;\n    return 0;\n}`
                              : `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 10;\n    \n    // Nested while loops\n    int i = 1;\n    while (i <= n) {\n        int j = 1;\n        while (j <= i) {\n            cout << "* ";\n            j++;\n        }\n        cout << endl;\n        i++;\n    }\n    \n    return 0;\n}`
                          : language === "java"
                            ? lessonNumber === 1
                              ? `public class WhileExample {\n    public static void main(String[] args) {\n        int count = 1;\n        \n        while (count <= 5) {\n            System.out.println("Count: " + count);\n            count++;  // Important: increment to avoid infinite loop\n        }\n    }\n}`
                              : lessonNumber <= count / 2
                                ? `import java.util.Scanner;\n\npublic class SumExample {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int number, sum = 0;\n        \n        System.out.print("Enter numbers (0 to stop): ");\n        number = scanner.nextInt();\n        \n        while (number != 0) {\n            sum += number;\n            System.out.print("Enter next number: ");\n            number = scanner.nextInt();\n        }\n        \n        System.out.println("Total sum: " + sum);\n        scanner.close();\n    }\n}`
                                : `public class PatternExample {\n    public static void main(String[] args) {\n        int n = 10;\n        \n        // Nested while loops\n        int i = 1;\n        while (i <= n) {\n            int j = 1;\n            while (j <= i) {\n                System.out.print("* ");\n                j++;\n            }\n            System.out.println();\n            i++;\n        }\n    }\n}`
                            : language === "python"
                              ? lessonNumber === 1
                                ? `# While loop in Python\ncount = 1\n\nwhile count <= 5:\n    print(f"Count: {count}")\n    count += 1  # Important: increment to avoid infinite loop`
                                : lessonNumber <= count / 2
                                  ? `# Python while loop with user input\nnumber = int(input("Enter numbers (0 to stop): "))\nsum_total = 0\n\nwhile number != 0:\n    sum_total += number\n    number = int(input("Enter next number: "))\n\nprint(f"Total sum: {sum_total}")`
                                  : `# Nested while loops in Python\nn = 10\n\ni = 1\nwhile i <= n:\n    j = 1\n    while j <= i:\n        print("* ", end="")\n        j += 1\n    print()\n    i += 1`
                              : `// While loop in ${language}\nlet count = 1;\n\nwhile (count <= 5) {\n    console.log("Count: " + count);\n    count++;\n}`,
                    explanation:
                      lessonNumber === 1
                        ? "This example shows the basic structure of a while loop. The condition (count <= 5) is checked before each iteration, and the loop body executes as long as it's true."
                        : lessonNumber <= count / 2
                          ? "This while loop continues reading numbers until the user enters 0, demonstrating how while loops are perfect for input validation and accumulation."
                          : "This advanced example uses nested while loops to create a pattern, showing how while loops can be combined for complex logic.",
                  },
                ],
                practiceHints: [
                  "Always initialize your loop control variable before the while loop",
                  "Make sure to modify the loop variable inside the loop to avoid infinite loops",
                  "Test your loop with different input values",
                  "Use clear and meaningful variable names",
                ],
              },
              mcq: {
                questions:
                  lessonNumber === 1
                    ? [
                        {
                          id: `mcq-${lessonNumber}-1`,
                          question:
                            "What is the basic syntax of a while loop in C?",
                          options: [
                            {
                              id: "a",
                              text: "while (condition) { statements; }",
                              isCorrect: true,
                            },
                            {
                              id: "b",
                              text: "while { condition } (statements)",
                              isCorrect: false,
                            },
                            {
                              id: "c",
                              text: "loop while (condition) { statements; }",
                              isCorrect: false,
                            },
                            {
                              id: "d",
                              text: "while: condition { statements; }",
                              isCorrect: false,
                            },
                          ],
                          explanation:
                            "The correct syntax is 'while (condition) { statements; }' where the condition is in parentheses and the body is in curly braces.",
                          difficulty: 1,
                        },
                        {
                          id: `mcq-${lessonNumber}-2`,
                          question:
                            "What happens if the condition in a while loop is initially false?",
                          options: [
                            {
                              id: "a",
                              text: "The loop body executes once",
                              isCorrect: false,
                            },
                            {
                              id: "b",
                              text: "The loop body never executes",
                              isCorrect: true,
                            },
                            {
                              id: "c",
                              text: "The program crashes",
                              isCorrect: false,
                            },
                            {
                              id: "d",
                              text: "The condition becomes true",
                              isCorrect: false,
                            },
                          ],
                          explanation:
                            "If the while loop condition is false when first checked, the loop body is skipped entirely and never executes.",
                          difficulty: 1,
                        },
                        {
                          id: `mcq-${lessonNumber}-3`,
                          question:
                            "Which part of a while loop is checked first?",
                          options: [
                            {
                              id: "a",
                              text: "The loop body",
                              isCorrect: false,
                            },
                            { id: "b", text: "The condition", isCorrect: true },
                            {
                              id: "c",
                              text: "The increment statement",
                              isCorrect: false,
                            },
                            {
                              id: "d",
                              text: "The initialization",
                              isCorrect: false,
                            },
                          ],
                          explanation:
                            "The condition is always checked first before executing the loop body. This is what makes it a 'pre-test' loop.",
                          difficulty: 1,
                        },
                        {
                          id: `mcq-${lessonNumber}-4`,
                          question:
                            "What must happen inside a while loop to prevent infinite loops?",
                          options: [
                            {
                              id: "a",
                              text: "Print statements",
                              isCorrect: false,
                            },
                            {
                              id: "b",
                              text: "Variable declarations",
                              isCorrect: false,
                            },
                            {
                              id: "c",
                              text: "The loop variable must be modified",
                              isCorrect: true,
                            },
                            {
                              id: "d",
                              text: "Function calls",
                              isCorrect: false,
                            },
                          ],
                          explanation:
                            "The loop variable or condition must be modified inside the loop body so that eventually the condition becomes false.",
                          difficulty: 1,
                        },
                      ]
                    : lessonNumber <= count / 2
                      ? [
                          {
                            id: `mcq-${lessonNumber}-1`,
                            question: "What will be the output of this code?",
                            options: [
                              { id: "a", text: "5 4 3 2 1 ", isCorrect: true },
                              { id: "b", text: "1 2 3 4 5 ", isCorrect: false },
                              { id: "c", text: "5 5 5 5 5 ", isCorrect: false },
                              { id: "d", text: "No output", isCorrect: false },
                            ],
                            explanation:
                              "The loop starts with x=5, prints 5, decrements to 4, prints 4, and so on until x becomes 0, then stops.",
                            difficulty: 2,
                            codeSnippet:
                              language === "java"
                                ? 'int x = 5;\nwhile (x > 0) {\n    System.out.print(x + " ");\n    x--;\n}'
                                : language === "cpp" || language === "c++"
                                  ? 'int x = 5;\nwhile (x > 0) {\n    cout << x << " ";\n    x--;\n}'
                                  : 'int x = 5;\nwhile (x > 0) {\n    printf("%d ", x);\n    x--;\n}',
                          },
                          {
                            id: `mcq-${lessonNumber}-2`,
                            question:
                              "How many times will this while loop execute?",
                            options: [
                              { id: "a", text: "2 times", isCorrect: false },
                              { id: "b", text: "3 times", isCorrect: true },
                              { id: "c", text: "4 times", isCorrect: false },
                              {
                                id: "d",
                                text: "Infinite times",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "The loop runs when i=1, i=2, and i=3. When i becomes 4, the condition (i <= 3) becomes false.",
                            difficulty: 2,
                            codeSnippet:
                              language === "java"
                                ? 'int i = 1;\nwhile (i <= 3) {\n    System.out.print("Hello");\n    i++;\n}'
                                : language === "cpp" || language === "c++"
                                  ? 'int i = 1;\nwhile (i <= 3) {\n    cout << "Hello";\n    i++;\n}'
                                  : 'int i = 1;\nwhile (i <= 3) {\n    printf("Hello");\n    i++;\n}',
                          },
                          {
                            id: `mcq-${lessonNumber}-3`,
                            question:
                              "What is the value of sum after this code executes?",
                            options: [
                              { id: "a", text: "8", isCorrect: false },
                              { id: "b", text: "10", isCorrect: true },
                              { id: "c", text: "15", isCorrect: false },
                              { id: "d", text: "6", isCorrect: false },
                            ],
                            explanation:
                              "sum = 0 + 1 + 2 + 3 + 4 = 10. Each iteration adds the current value of i to sum.",
                            difficulty: 2,
                            codeSnippet:
                              language === "java"
                                ? "int sum = 0, i = 1;\nwhile (i <= 4) {\n    sum += i;\n    i++;\n}"
                                : language === "cpp" || language === "c++"
                                  ? "int sum = 0, i = 1;\nwhile (i <= 4) {\n    sum += i;\n    i++;\n}"
                                  : "int sum = 0, i = 1;\nwhile (i <= 4) {\n    sum += i;\n    i++;\n}",
                          },
                          {
                            id: `mcq-${lessonNumber}-4`,
                            question:
                              "Which condition would create an infinite loop?",
                            options: [
                              {
                                id: "a",
                                text: "while (x > 0) with x starting at 5 and x-- in body",
                                isCorrect: false,
                              },
                              {
                                id: "b",
                                text: "while (true) with no break statement",
                                isCorrect: true,
                              },
                              {
                                id: "c",
                                text: "while (i < 10) with i starting at 0 and i++ in body",
                                isCorrect: false,
                              },
                              {
                                id: "d",
                                text: "while (count != 0) with count starting at 5 and count-- in body",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "while (true) creates an infinite loop because the condition is always true and there's no way to exit.",
                            difficulty: 2,
                          },
                          {
                            id: `mcq-${lessonNumber}-5`,
                            question:
                              "What happens if you forget the increment statement in a counting loop?",
                            options: [
                              {
                                id: "a",
                                text: "The loop runs faster",
                                isCorrect: false,
                              },
                              {
                                id: "b",
                                text: "The loop creates an infinite loop",
                                isCorrect: true,
                              },
                              {
                                id: "c",
                                text: "The program crashes immediately",
                                isCorrect: false,
                              },
                              {
                                id: "d",
                                text: "The loop runs only once",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "Without incrementing the loop variable, the condition never changes, creating an infinite loop.",
                            difficulty: 2,
                          },
                        ]
                      : [
                          {
                            id: `mcq-${lessonNumber}-1`,
                            question:
                              "Which of the following can cause an infinite loop?",
                            options: [
                              {
                                id: "a",
                                text: "Forgetting to initialize the loop variable",
                                isCorrect: false,
                              },
                              {
                                id: "b",
                                text: "Not updating the loop variable inside the loop",
                                isCorrect: true,
                              },
                              {
                                id: "c",
                                text: "Using the wrong comparison operator",
                                isCorrect: false,
                              },
                              {
                                id: "d",
                                text: "Having too many statements in the loop body",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "An infinite loop occurs when the loop variable is never updated inside the loop body, so the condition never becomes false.",
                            difficulty: 3,
                          },
                          {
                            id: `mcq-${lessonNumber}-2`,
                            question:
                              "What is the time complexity of this nested while loop?",
                            options: [
                              { id: "a", text: "O(n)", isCorrect: false },
                              { id: "b", text: "O(n²)", isCorrect: true },
                              { id: "c", text: "O(log n)", isCorrect: false },
                              { id: "d", text: "O(n log n)", isCorrect: false },
                            ],
                            explanation:
                              "The outer loop runs n times, and for each iteration, the inner loop also runs n times, giving O(n²) complexity.",
                            difficulty: 3,
                            codeSnippet:
                              language === "java"
                                ? "int i = 1;\nwhile (i <= n) {\n    int j = 1;\n    while (j <= n) {\n        // some operation\n        j++;\n    }\n    i++;\n}"
                                : language === "cpp" || language === "c++"
                                  ? "int i = 1;\nwhile (i <= n) {\n    int j = 1;\n    while (j <= n) {\n        // some operation\n        j++;\n    }\n    i++;\n}"
                                  : "int i = 1;\nwhile (i <= n) {\n    int j = 1;\n    while (j <= n) {\n        // some operation\n        j++;\n    }\n    i++;\n}",
                          },
                          {
                            id: `mcq-${lessonNumber}-3`,
                            question:
                              "In which scenario is a while loop preferred over a for loop?",
                            options: [
                              {
                                id: "a",
                                text: "When you know the exact number of iterations",
                                isCorrect: false,
                              },
                              {
                                id: "b",
                                text: "When the number of iterations is unknown",
                                isCorrect: true,
                              },
                              {
                                id: "c",
                                text: "When working with arrays",
                                isCorrect: false,
                              },
                              {
                                id: "d",
                                text: "When you need better performance",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "While loops are ideal when the number of iterations depends on a condition that may change unpredictably during execution.",
                            difficulty: 3,
                          },
                          {
                            id: `mcq-${lessonNumber}-4`,
                            question: "What will be the output of this code?",
                            options: [
                              { id: "a", text: "10 7 4 1", isCorrect: false },
                              { id: "b", text: "10 4", isCorrect: true },
                              { id: "c", text: "10 7 4", isCorrect: false },
                              { id: "d", text: "10", isCorrect: false },
                            ],
                            explanation:
                              "x starts at 10 (even, prints), becomes 7 (odd, no print), becomes 4 (even, prints), becomes 1 (odd, no print), becomes -2 (loop ends).",
                            difficulty: 3,
                            codeSnippet:
                              language === "java"
                                ? 'int x = 10;\nwhile (x > 0) {\n    if (x % 2 == 0) {\n        System.out.print(x + " ");\n    }\n    x -= 3;\n}'
                                : language === "cpp" || language === "c++"
                                  ? 'int x = 10;\nwhile (x > 0) {\n    if (x % 2 == 0) {\n        cout << x << " ";\n    }\n    x -= 3;\n}'
                                  : 'int x = 10;\nwhile (x > 0) {\n    if (x % 2 == 0) {\n        printf("%d ", x);\n    }\n    x -= 3;\n}',
                          },
                          {
                            id: `mcq-${lessonNumber}-5`,
                            question:
                              "Which technique can optimize a while loop's performance?",
                            options: [
                              {
                                id: "a",
                                text: "Moving invariant calculations outside the loop",
                                isCorrect: true,
                              },
                              {
                                id: "b",
                                text: "Adding more variables inside the loop",
                                isCorrect: false,
                              },
                              {
                                id: "c",
                                text: "Using nested loops instead",
                                isCorrect: false,
                              },
                              {
                                id: "d",
                                text: "Increasing the number of iterations",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "Moving calculations that don't change with each iteration outside the loop reduces unnecessary repeated computations.",
                            difficulty: 3,
                          },
                          {
                            id: `mcq-${lessonNumber}-6`,
                            question:
                              "What is a common debugging technique for while loops?",
                            options: [
                              {
                                id: "a",
                                text: "Adding print statements to track variable values",
                                isCorrect: true,
                              },
                              {
                                id: "b",
                                text: "Removing all comments",
                                isCorrect: false,
                              },
                              {
                                id: "c",
                                text: "Making the loop condition more complex",
                                isCorrect: false,
                              },
                              {
                                id: "d",
                                text: "Using only global variables",
                                isCorrect: false,
                              },
                            ],
                            explanation:
                              "Adding print statements helps track how variables change during each iteration, making it easier to identify logic errors.",
                            difficulty: 3,
                          },
                        ],
              },
              fill_in_blanks: {
                questions: [
                  {
                    id: `fib-${lessonNumber}-1`,
                    scenario:
                      lessonNumber === 1
                        ? "Complete this basic while loop that counts from 1 to 10:"
                        : lessonNumber <= count / 2
                          ? "Complete this while loop that calculates the factorial of a number:"
                          : "Complete this while loop that finds the largest digit in a number:",
                    codeTemplate:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int i = {{blank_1}};\n    \n    while (i <= {{blank_2}}) {\n        printf("%d ", i);\n        {{blank_3}};\n    }\n    \n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int n = 5, factorial = 1, i = 1;\n    \n    while ({{blank_1}}) {\n        factorial *= {{blank_2}};\n        {{blank_3}};\n    }\n    \n    printf("Factorial: %d", factorial);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int number = 3874, largest = 0, digit;\n    \n    while ({{blank_1}}) {\n        digit = number % 10;\n        if ({{blank_2}}) {\n            largest = digit;\n        }\n        number /= {{blank_3}};\n    }\n    \n    printf("Largest digit: %d", largest);\n    return 0;\n}`
                        : language === "cpp" || language === "c++"
                          ? lessonNumber === 1
                            ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int i = {{blank_1}};\n    \n    while (i <= {{blank_2}}) {\n        cout << i << " ";\n        {{blank_3}};\n    }\n    \n    return 0;\n}`
                            : lessonNumber <= count / 2
                              ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 5, factorial = 1, i = 1;\n    \n    while ({{blank_1}}) {\n        factorial *= {{blank_2}};\n        {{blank_3}};\n    }\n    \n    cout << "Factorial: " << factorial << endl;\n    return 0;\n}`
                              : `#include <iostream>\nusing namespace std;\n\nint main() {\n    int number = 3874, largest = 0, digit;\n    \n    while ({{blank_1}}) {\n        digit = number % 10;\n        if ({{blank_2}}) {\n            largest = digit;\n        }\n        number /= {{blank_3}};\n    }\n    \n    cout << "Largest digit: " << largest << endl;\n    return 0;\n}`
                          : language === "java"
                            ? lessonNumber === 1
                              ? `public class WhileLoop {\n    public static void main(String[] args) {\n        int i = {{blank_1}};\n        \n        while (i <= {{blank_2}}) {\n            System.out.print(i + " ");\n            {{blank_3}};\n        }\n    }\n}`
                              : lessonNumber <= count / 2
                                ? `public class Factorial {\n    public static void main(String[] args) {\n        int n = 5, factorial = 1, i = 1;\n        \n        while ({{blank_1}}) {\n            factorial *= {{blank_2}};\n            {{blank_3}};\n        }\n        \n        System.out.println("Factorial: " + factorial);\n    }\n}`
                                : `public class LargestDigit {\n    public static void main(String[] args) {\n        int number = 3874, largest = 0, digit;\n        \n        while ({{blank_1}}) {\n            digit = number % 10;\n            if ({{blank_2}}) {\n                largest = digit;\n            }\n            number /= {{blank_3}};\n        }\n        \n        System.out.println("Largest digit: " + largest);\n    }\n}`
                            : language === "python"
                              ? lessonNumber === 1
                                ? `i = {{blank_1}}\n\nwhile i <= {{blank_2}}:\n    print(i, end=" ")\n    {{blank_3}}`
                                : lessonNumber <= count / 2
                                  ? `n = 5\nfactorial = 1\ni = 1\n\nwhile {{blank_1}}:\n    factorial *= {{blank_2}}\n    {{blank_3}}\n\nprint(f"Factorial: {factorial}")`
                                  : `number = 3874\nlargest = 0\n\nwhile {{blank_1}}:\n    digit = number % 10\n    if {{blank_2}}:\n        largest = digit\n    number //= {{blank_3}}\n\nprint(f"Largest digit: {largest}")`
                              : `let i = {{blank_1}};\n\nwhile (i <= {{blank_2}}) {\n    console.log(i);\n    {{blank_3}};\n}`,
                    blanks:
                      lessonNumber === 1
                        ? [
                            {
                              id: "blank_1",
                              type: "text" as const,
                              correctAnswer: "1",
                              explanation:
                                "Initialize the counter variable to 1 to start counting from 1.",
                            },
                            {
                              id: "blank_2",
                              type: "text" as const,
                              correctAnswer: "10",
                              explanation:
                                "Set the condition to continue while i is less than or equal to 10.",
                            },
                            {
                              id: "blank_3",
                              type: "text" as const,
                              correctAnswer: "i++",
                              explanation:
                                "Increment i to eventually make the condition false and avoid infinite loop.",
                            },
                          ]
                        : lessonNumber <= count / 2
                          ? [
                              {
                                id: "blank_1",
                                type: "text" as const,
                                correctAnswer: "i <= n",
                                explanation:
                                  "Continue the loop while i is less than or equal to n.",
                              },
                              {
                                id: "blank_2",
                                type: "text" as const,
                                correctAnswer: "i",
                                explanation:
                                  "Multiply factorial by the current value of i.",
                              },
                              {
                                id: "blank_3",
                                type: "text" as const,
                                correctAnswer: "i++",
                                explanation:
                                  "Increment i to move to the next number.",
                              },
                            ]
                          : [
                              {
                                id: "blank_1",
                                type: "text" as const,
                                correctAnswer: "number > 0",
                                explanation:
                                  "Continue while there are still digits to process.",
                              },
                              {
                                id: "blank_2",
                                type: "text" as const,
                                correctAnswer: "digit > largest",
                                explanation:
                                  "Update largest if current digit is bigger.",
                              },
                              {
                                id: "blank_3",
                                type: "text" as const,
                                correctAnswer: "10",
                                explanation:
                                  "Remove the last digit by dividing by 10.",
                              },
                            ],
                    hints: [
                      "Think about what values the loop variable should start and end with",
                      "Remember to update the loop variable to avoid infinite loops",
                    ],
                    solution: {
                      completeCode:
                        language === "c-programming" || language === "c"
                          ? lessonNumber === 1
                            ? `#include <stdio.h>\n\nint main() {\n    int i = 1;\n    \n    while (i <= 10) {\n        printf("%d ", i);\n        i++;\n    }\n    \n    return 0;\n}`
                            : lessonNumber <= count / 2
                              ? `#include <stdio.h>\n\nint main() {\n    int n = 5, factorial = 1, i = 1;\n    \n    while (i <= n) {\n        factorial *= i;\n        i++;\n    }\n    \n    printf("Factorial: %d", factorial);\n    return 0;\n}`
                              : `#include <stdio.h>\n\nint main() {\n    int number = 3874, largest = 0, digit;\n    \n    while (number > 0) {\n        digit = number % 10;\n        if (digit > largest) {\n            largest = digit;\n        }\n        number /= 10;\n    }\n    \n    printf("Largest digit: %d", largest);\n    return 0;\n}`
                          : language === "cpp" || language === "c++"
                            ? lessonNumber === 1
                              ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int i = 1;\n    \n    while (i <= 10) {\n        cout << i << " ";\n        i++;\n    }\n    \n    return 0;\n}`
                              : lessonNumber <= count / 2
                                ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 5, factorial = 1, i = 1;\n    \n    while (i <= n) {\n        factorial *= i;\n        i++;\n    }\n    \n    cout << "Factorial: " << factorial << endl;\n    return 0;\n}`
                                : `#include <iostream>\nusing namespace std;\n\nint main() {\n    int number = 3874, largest = 0, digit;\n    \n    while (number > 0) {\n        digit = number % 10;\n        if (digit > largest) {\n            largest = digit;\n        }\n        number /= 10;\n    }\n    \n    cout << "Largest digit: " << largest << endl;\n    return 0;\n}`
                            : language === "java"
                              ? lessonNumber === 1
                                ? `public class WhileLoop {\n    public static void main(String[] args) {\n        int i = 1;\n        \n        while (i <= 10) {\n            System.out.print(i + " ");\n            i++;\n        }\n    }\n}`
                                : lessonNumber <= count / 2
                                  ? `public class Factorial {\n    public static void main(String[] args) {\n        int n = 5, factorial = 1, i = 1;\n        \n        while (i <= n) {\n            factorial *= i;\n            i++;\n        }\n        \n        System.out.println("Factorial: " + factorial);\n    }\n}`
                                  : `public class LargestDigit {\n    public static void main(String[] args) {\n        int number = 3874, largest = 0, digit;\n        \n        while (number > 0) {\n            digit = number % 10;\n            if (digit > largest) {\n                largest = digit;\n            }\n            number /= 10;\n        }\n        \n        System.out.println("Largest digit: " + largest);\n    }\n}`
                              : language === "python"
                                ? lessonNumber === 1
                                  ? `i = 1\nwhile i <= 10:\n    print(i)\n    i += 1`
                                  : lessonNumber <= count / 2
                                    ? `n = 5\nfactorial = 1\ni = 1\nwhile i <= n:\n    factorial *= i\n    i += 1\nprint(f"Factorial: {factorial}")`
                                    : `number = 3874\nlargest = 0\nwhile number > 0:\n    digit = number % 10\n    if digit > largest:\n        largest = digit\n    number //= 10\nprint(f"Largest digit: {largest}")`
                                : `let i = 1;\n\nwhile (i <= 10) {\n    console.log(i);\n    i++;\n}`,
                      explanation:
                        "This solution demonstrates proper while loop structure with initialization, condition checking, and variable updating.",
                    },
                    difficulty:
                      lessonNumber === 1
                        ? 1
                        : lessonNumber <= count / 2
                          ? 2
                          : 3,
                  },
                  {
                    id: `fib-${lessonNumber}-2`,
                    scenario:
                      lessonNumber === 1
                        ? "Complete this while loop that calculates the sum of numbers from 1 to n:"
                        : lessonNumber <= count / 2
                          ? "Complete this while loop that finds the GCD of two numbers:"
                          : "Complete this while loop that checks if a number is palindrome:",
                    codeTemplate:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int n = {{blank1}}, sum = 0, i = 1;\n    \n    while ({{blank2}}) {\n        sum += {{blank3}};\n        {{blank4}};\n    }\n    \n    printf("Sum: %d", sum);\n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int a = {{blank1}}, b = {{blank2}};\n    \n    while ({{blank3}}) {\n        int temp = b;\n        b = {{blank4}};\n        a = temp;\n    }\n    \n    printf("GCD: %d", a);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int num = 12321, original = num, reversed = 0;\n    \n    while ({{blank1}}) {\n        reversed = {{blank2}};\n        num {{blank3}};\n    }\n    \n    printf("%s", (original == reversed) ? "Palindrome" : "Not Palindrome");\n    return 0;\n}`
                        : language === "python"
                          ? lessonNumber === 1
                            ? `n = {{blank1}}\nsum_val = 0\ni = 1\n\nwhile {{blank2}}:\n    sum_val += {{blank3}}\n    {{blank4}}\n\nprint(f"Sum: {sum_val}")`
                            : lessonNumber <= count / 2
                              ? `a = {{blank1}}\nb = {{blank2}}\n\nwhile {{blank3}}:\n    a, b = b, {{blank4}}\n\nprint(f"GCD: {a}")`
                              : `num = 12321\noriginal = num\nreversed_num = 0\n\nwhile {{blank1}}:\n    reversed_num = {{blank2}}\n    num {{blank3}}\n\nprint("Palindrome" if original == reversed_num else "Not Palindrome")`
                          : `let n = {{blank1}}, sum = 0, i = 1;\n\nwhile ({{blank2}}) {\n    sum += {{blank3}};\n    {{blank4}};\n}\n\nconsole.log("Sum:", sum);`,
                    blanks:
                      lessonNumber === 1
                        ? [
                            {
                              id: "blank1",
                              type: "text",
                              correctAnswer: "5",
                              explanation:
                                "Set the upper limit for the sum calculation",
                            },
                            {
                              id: "blank2",
                              type: "text",
                              correctAnswer: "i <= n",
                              explanation:
                                "Loop condition to continue while i is less than or equal to n",
                            },
                            {
                              id: "blank3",
                              type: "text",
                              correctAnswer: "i",
                              explanation:
                                "Add the current value of i to the sum",
                            },
                            {
                              id: "blank4",
                              type: "text",
                              correctAnswer: "i++",
                              explanation:
                                "Increment i to move to the next number",
                            },
                          ]
                        : lessonNumber <= count / 2
                          ? [
                              {
                                id: "blank1",
                                type: "text",
                                correctAnswer: "48",
                                explanation: "First number for GCD calculation",
                              },
                              {
                                id: "blank2",
                                type: "text",
                                correctAnswer: "18",
                                explanation:
                                  "Second number for GCD calculation",
                              },
                              {
                                id: "blank3",
                                type: "text",
                                correctAnswer: "b != 0",
                                explanation:
                                  "Continue while b is not zero (Euclidean algorithm)",
                              },
                              {
                                id: "blank4",
                                type: "text",
                                correctAnswer: "a % b",
                                explanation:
                                  "Set b to the remainder of a divided by b",
                              },
                            ]
                          : [
                              {
                                id: "blank1",
                                type: "text",
                                correctAnswer: "num > 0",
                                explanation:
                                  "Continue while there are digits to process",
                              },
                              {
                                id: "blank2",
                                type: "text",
                                correctAnswer: "reversed * 10 + num % 10",
                                explanation:
                                  "Build the reversed number digit by digit",
                              },
                              {
                                id: "blank3",
                                type: "text",
                                correctAnswer: "/= 10",
                                explanation: "Remove the last digit from num",
                              },
                            ],
                    hints: [
                      "Think about what values need to be updated in each iteration",
                      "The loop condition should eventually become false",
                    ],
                    solution: {
                      completeCode:
                        language === "c-programming" || language === "c"
                          ? lessonNumber === 1
                            ? `#include <stdio.h>\n\nint main() {\n    int n = 5, sum = 0, i = 1;\n    \n    while (i <= n) {\n        sum += i;\n        i++;\n    }\n    \n    printf("Sum: %d", sum);\n    return 0;\n}`
                            : lessonNumber <= count / 2
                              ? `#include <stdio.h>\n\nint main() {\n    int a = 48, b = 18;\n    \n    while (b != 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    \n    printf("GCD: %d", a);\n    return 0;\n}`
                              : `#include <stdio.h>\n\nint main() {\n    int num = 12321, original = num, reversed = 0;\n    \n    while (num > 0) {\n        reversed = reversed * 10 + num % 10;\n        num /= 10;\n    }\n    \n    printf("%s", (original == reversed) ? "Palindrome" : "Not Palindrome");\n    return 0;\n}`
                          : language === "python"
                            ? lessonNumber === 1
                              ? `n = 5\nsum_val = 0\ni = 1\n\nwhile i <= n:\n    sum_val += i\n    i += 1\n\nprint(f"Sum: {sum_val}")`
                              : lessonNumber <= count / 2
                                ? `a = 48\nb = 18\n\nwhile b != 0:\n    a, b = b, a % b\n\nprint(f"GCD: {a}")`
                                : `num = 12321\noriginal = num\nreversed_num = 0\n\nwhile num > 0:\n    reversed_num = reversed_num * 10 + num % 10\n    num //= 10\n\nprint("Palindrome" if original == reversed_num else "Not Palindrome")`
                            : `let n = 5, sum = 0, i = 1;\n\nwhile (i <= n) {\n    sum += i;\n    i++;\n}\n\nconsole.log("Sum:", sum);`,
                      explanation:
                        "This solution demonstrates proper while loop usage with variable initialization, condition checking, and updates.",
                    },
                    difficulty:
                      lessonNumber === 1
                        ? 2
                        : lessonNumber <= count / 2
                          ? 3
                          : 3,
                  },
                  {
                    id: `fib-${lessonNumber}-3`,
                    scenario:
                      lessonNumber === 1
                        ? "Complete this while loop that prints multiplication table of 3:"
                        : lessonNumber <= count / 2
                          ? "Complete this while loop that counts digits in a number:"
                          : "Complete this while loop that finds the power of a number:",
                    codeTemplate:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int i = {{blank1}};\n    \n    while ({{blank2}}) {\n        printf("%d x 3 = %d\\n", i, {{blank3}});\n        {{blank4}};\n    }\n    \n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int num = {{blank1}}, count = 0;\n    \n    while ({{blank2}}) {\n        {{blank3}};\n        {{blank4}};\n    }\n    \n    printf("Digits: %d", count);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int base = {{blank1}}, exp = {{blank2}}, result = 1;\n    \n    while ({{blank3}}) {\n        result *= {{blank4}};\n        exp--;\n    }\n    \n    printf("Result: %d", result);\n    return 0;\n}`
                        : language === "python"
                          ? lessonNumber === 1
                            ? `i = {{blank1}}\n\nwhile {{blank2}}:\n    print(f"{i} x 3 = {{blank3}}")\n    {{blank4}}`
                            : lessonNumber <= count / 2
                              ? `num = {{blank1}}\ncount = 0\n\nwhile {{blank2}}:\n    {{blank3}}\n    {{blank4}}\n\nprint(f"Digits: {count}")`
                              : `base = {{blank1}}\nexp = {{blank2}}\nresult = 1\n\nwhile {{blank3}}:\n    result *= {{blank4}}\n    exp -= 1\n\nprint(f"Result: {result}")`
                          : `let i = {{blank1}};\n\nwhile ({{blank2}}) {\n    console.log(\`\${i} x 3 = {{blank3}}\`);\n    {{blank4}};\n}`,
                    blanks:
                      lessonNumber === 1
                        ? [
                            {
                              id: "blank1",
                              type: "text",
                              correctAnswer: "1",
                              explanation:
                                "Start the multiplication table from 1",
                            },
                            {
                              id: "blank2",
                              type: "text",
                              correctAnswer: "i <= 10",
                              explanation: "Continue until we reach 10",
                            },
                            {
                              id: "blank3",
                              type: "text",
                              correctAnswer: "i * 3",
                              explanation: "Calculate the product of i and 3",
                            },
                            {
                              id: "blank4",
                              type: "text",
                              correctAnswer: "i++",
                              explanation: "Move to the next number",
                            },
                          ]
                        : lessonNumber <= count / 2
                          ? [
                              {
                                id: "blank1",
                                type: "text",
                                correctAnswer: "12345",
                                explanation: "Number to count digits in",
                              },
                              {
                                id: "blank2",
                                type: "text",
                                correctAnswer: "num > 0",
                                explanation:
                                  "Continue while there are digits left",
                              },
                              {
                                id: "blank3",
                                type: "text",
                                correctAnswer: "count++",
                                explanation: "Increment the digit counter",
                              },
                              {
                                id: "blank4",
                                type: "text",
                                correctAnswer: "num /= 10",
                                explanation: "Remove the last digit",
                              },
                            ]
                          : [
                              {
                                id: "blank1",
                                type: "text",
                                correctAnswer: "2",
                                explanation:
                                  "Base number for power calculation",
                              },
                              {
                                id: "blank2",
                                type: "text",
                                correctAnswer: "5",
                                explanation: "Exponent for power calculation",
                              },
                              {
                                id: "blank3",
                                type: "text",
                                correctAnswer: "exp > 0",
                                explanation:
                                  "Continue while exponent is positive",
                              },
                              {
                                id: "blank4",
                                type: "text",
                                correctAnswer: "base",
                                explanation:
                                  "Multiply result by base each iteration",
                              },
                            ],
                    hints: [
                      "Initialize your variables properly before the loop",
                      "Make sure the loop variable changes in each iteration",
                    ],
                    solution: {
                      completeCode:
                        language === "c-programming" || language === "c"
                          ? lessonNumber === 1
                            ? `#include <stdio.h>\n\nint main() {\n    int i = 1;\n    \n    while (i <= 10) {\n        printf("%d x 3 = %d\\n", i, i * 3);\n        i++;\n    }\n    \n    return 0;\n}`
                            : lessonNumber <= count / 2
                              ? `#include <stdio.h>\n\nint main() {\n    int num = 12345, count = 0;\n    \n    while (num > 0) {\n        count++;\n        num /= 10;\n    }\n    \n    printf("Digits: %d", count);\n    return 0;\n}`
                              : `#include <stdio.h>\n\nint main() {\n    int base = 2, exp = 5, result = 1;\n    \n    while (exp > 0) {\n        result *= base;\n        exp--;\n    }\n    \n    printf("Result: %d", result);\n    return 0;\n}`
                          : language === "python"
                            ? lessonNumber === 1
                              ? `i = 1\n\nwhile i <= 10:\n    print(f"{i} x 3 = {i * 3}")\n    i += 1`
                              : lessonNumber <= count / 2
                                ? `num = 12345\ncount = 0\n\nwhile num > 0:\n    count += 1\n    num //= 10\n\nprint(f"Digits: {count}")`
                                : `base = 2\nexp = 5\nresult = 1\n\nwhile exp > 0:\n    result *= base\n    exp -= 1\n\nprint(f"Result: {result}")`
                            : `let i = 1;\n\nwhile (i <= 10) {\n    console.log(\`\${i} x 3 = \${i * 3}\`);\n    i++;\n}`,
                      explanation:
                        "This solution shows how to use while loops for iterative calculations and output formatting.",
                    },
                    difficulty:
                      lessonNumber === 1
                        ? 1
                        : lessonNumber <= count / 2
                          ? 2
                          : 3,
                  },
                ],
              },
              codeblock_rearranging: {
                questions: [
                  {
                    id: `cbr-${lessonNumber}-1`,
                    scenario:
                      lessonNumber === 1
                        ? "Arrange these code blocks to create a working while loop that prints numbers 1 to 5:"
                        : lessonNumber <= count / 2
                          ? "Arrange these blocks to create a while loop that reads and validates user input:"
                          : "Arrange these blocks to create a while loop that reverses a number:",
                    targetCode:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int count = 1;\n    while (count <= 5) {\n        printf("%d\\n", count);\n        count++;\n    }\n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int num;\n    do {\n        printf("Enter positive number: ");\n        scanf("%d", &num);\n    } while (num <= 0);\n    printf("Valid number: %d", num);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int num = 12345, reversed = 0;\n    while (num > 0) {\n        reversed = reversed * 10 + num % 10;\n        num /= 10;\n    }\n    printf("Reversed: %d", reversed);\n    return 0;\n}`
                        : language === "cpp" || language === "c++"
                          ? lessonNumber === 1
                            ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int count = 1;\n    while (count <= 5) {\n        cout << count << endl;\n        count++;\n    }\n    return 0;\n}`
                            : lessonNumber <= count / 2
                              ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    int num;\n    do {\n        cout << "Enter positive number: ";\n        cin >> num;\n    } while (num <= 0);\n    cout << "Valid number: " << num << endl;\n    return 0;\n}`
                              : `#include <iostream>\nusing namespace std;\n\nint main() {\n    int num = 12345, reversed = 0;\n    while (num > 0) {\n        reversed = reversed * 10 + num % 10;\n        num /= 10;\n    }\n    cout << "Reversed: " << reversed << endl;\n    return 0;\n}`
                          : language === "java"
                            ? lessonNumber === 1
                              ? `public class WhileExample {\n    public static void main(String[] args) {\n        int count = 1;\n        while (count <= 5) {\n            System.out.println(count);\n            count++;\n        }\n    }\n}`
                              : lessonNumber <= count / 2
                                ? `import java.util.Scanner;\n\npublic class InputValidation {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int num;\n        do {\n            System.out.print("Enter positive number: ");\n            num = scanner.nextInt();\n        } while (num <= 0);\n        System.out.println("Valid number: " + num);\n        scanner.close();\n    }\n}`
                                : `public class ReverseNumber {\n    public static void main(String[] args) {\n        int num = 12345, reversed = 0;\n        while (num > 0) {\n            reversed = reversed * 10 + num % 10;\n            num /= 10;\n        }\n        System.out.println("Reversed: " + reversed);\n    }\n}`
                            : language === "python"
                              ? lessonNumber === 1
                                ? `count = 1\nwhile count <= 5:\n    print(count)\n    count += 1`
                                : lessonNumber <= count / 2
                                  ? `while True:\n    num = int(input("Enter positive number: "))\n    if num > 0:\n        break\nprint(f"Valid number: {num}")`
                                  : `num = 12345\nreversed_num = 0\nwhile num > 0:\n    reversed_num = reversed_num * 10 + num % 10\n    num //= 10\nprint(f"Reversed: {reversed_num}")`
                              : `let count = 1;\nwhile (count <= 5) {\n    console.log(count);\n    count++;\n}`,
                    codeBlocks:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? [
                              {
                                id: `block-${lessonNumber}-1`,
                                content: "#include <stdio.h>",
                              },
                              {
                                id: `block-${lessonNumber}-2`,
                                content: "int main() {",
                              },
                              {
                                id: `block-${lessonNumber}-3`,
                                content: "    int count = 1;",
                              },
                              {
                                id: `block-${lessonNumber}-4`,
                                content: "    while (count <= 5) {",
                              },
                              {
                                id: `block-${lessonNumber}-5`,
                                content: '        printf("%d\\n", count);',
                              },
                              {
                                id: `block-${lessonNumber}-6`,
                                content: "        count++;",
                              },
                              {
                                id: `block-${lessonNumber}-7`,
                                content: "    }",
                              },
                              {
                                id: `block-${lessonNumber}-8`,
                                content: "    return 0;",
                              },
                              { id: `block-${lessonNumber}-9`, content: "}" },
                            ]
                          : [
                              {
                                id: `block-${lessonNumber}-1`,
                                content: "int num = 12345, reversed = 0;",
                              },
                              {
                                id: `block-${lessonNumber}-2`,
                                content: "while (num > 0) {",
                              },
                              {
                                id: `block-${lessonNumber}-3`,
                                content:
                                  "    reversed = reversed * 10 + num % 10;",
                              },
                              {
                                id: `block-${lessonNumber}-4`,
                                content: "    num /= 10;",
                              },
                              { id: `block-${lessonNumber}-5`, content: "}" },
                            ]
                        : language === "cpp" || language === "c++"
                          ? lessonNumber === 1
                            ? [
                                {
                                  id: `block-${lessonNumber}-1`,
                                  content: "#include <iostream>",
                                },
                                {
                                  id: `block-${lessonNumber}-2`,
                                  content: "using namespace std;",
                                },
                                {
                                  id: `block-${lessonNumber}-3`,
                                  content: "int main() {",
                                },
                                {
                                  id: `block-${lessonNumber}-4`,
                                  content: "    int count = 1;",
                                },
                                {
                                  id: `block-${lessonNumber}-5`,
                                  content: "    while (count <= 5) {",
                                },
                                {
                                  id: `block-${lessonNumber}-6`,
                                  content: "        cout << count << endl;",
                                },
                                {
                                  id: `block-${lessonNumber}-7`,
                                  content: "        count++;",
                                },
                                {
                                  id: `block-${lessonNumber}-8`,
                                  content: "    }",
                                },
                                {
                                  id: `block-${lessonNumber}-9`,
                                  content: "    return 0;",
                                },
                                {
                                  id: `block-${lessonNumber}-10`,
                                  content: "}",
                                },
                              ]
                            : [
                                {
                                  id: `block-${lessonNumber}-1`,
                                  content: "int num = 12345, reversed = 0;",
                                },
                                {
                                  id: `block-${lessonNumber}-2`,
                                  content: "while (num > 0) {",
                                },
                                {
                                  id: `block-${lessonNumber}-3`,
                                  content:
                                    "    reversed = reversed * 10 + num % 10;",
                                },
                                {
                                  id: `block-${lessonNumber}-4`,
                                  content: "    num /= 10;",
                                },
                                { id: `block-${lessonNumber}-5`, content: "}" },
                              ]
                          : language === "java"
                            ? lessonNumber === 1
                              ? [
                                  {
                                    id: `block-${lessonNumber}-1`,
                                    content: "public class WhileExample {",
                                  },
                                  {
                                    id: `block-${lessonNumber}-2`,
                                    content:
                                      "    public static void main(String[] args) {",
                                  },
                                  {
                                    id: `block-${lessonNumber}-3`,
                                    content: "        int count = 1;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-4`,
                                    content: "        while (count <= 5) {",
                                  },
                                  {
                                    id: `block-${lessonNumber}-5`,
                                    content:
                                      "            System.out.println(count);",
                                  },
                                  {
                                    id: `block-${lessonNumber}-6`,
                                    content: "            count++;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-7`,
                                    content: "        }",
                                  },
                                  {
                                    id: `block-${lessonNumber}-8`,
                                    content: "    }",
                                  },
                                  {
                                    id: `block-${lessonNumber}-9`,
                                    content: "}",
                                  },
                                ]
                              : [
                                  {
                                    id: `block-${lessonNumber}-1`,
                                    content: "int num = 12345, reversed = 0;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-2`,
                                    content: "while (num > 0) {",
                                  },
                                  {
                                    id: `block-${lessonNumber}-3`,
                                    content:
                                      "    reversed = reversed * 10 + num % 10;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-4`,
                                    content: "    num /= 10;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-5`,
                                    content: "}",
                                  },
                                ]
                            : language === "python"
                              ? lessonNumber === 1
                                ? [
                                    {
                                      id: `block-${lessonNumber}-1`,
                                      content: "count = 1",
                                    },
                                    {
                                      id: `block-${lessonNumber}-2`,
                                      content: "while count <= 5:",
                                    },
                                    {
                                      id: `block-${lessonNumber}-3`,
                                      content: "    print(count)",
                                    },
                                    {
                                      id: `block-${lessonNumber}-4`,
                                      content: "    count += 1",
                                    },
                                  ]
                                : [
                                    {
                                      id: `block-${lessonNumber}-1`,
                                      content: "num = 12345",
                                    },
                                    {
                                      id: `block-${lessonNumber}-2`,
                                      content: "reversed_num = 0",
                                    },
                                    {
                                      id: `block-${lessonNumber}-3`,
                                      content: "while num > 0:",
                                    },
                                    {
                                      id: `block-${lessonNumber}-4`,
                                      content:
                                        "    reversed_num = reversed_num * 10 + num % 10",
                                    },
                                    {
                                      id: `block-${lessonNumber}-5`,
                                      content: "    num //= 10",
                                    },
                                  ]
                              : [
                                  {
                                    id: `block-${lessonNumber}-1`,
                                    content: "let count = 1;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-2`,
                                    content: "while (count <= 5) {",
                                  },
                                  {
                                    id: `block-${lessonNumber}-3`,
                                    content: "    console.log(count);",
                                  },
                                  {
                                    id: `block-${lessonNumber}-4`,
                                    content: "    count++;",
                                  },
                                  {
                                    id: `block-${lessonNumber}-5`,
                                    content: "}",
                                  },
                                ],
                    correctOrder:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? [
                              `block-${lessonNumber}-1`,
                              `block-${lessonNumber}-2`,
                              `block-${lessonNumber}-3`,
                              `block-${lessonNumber}-4`,
                              `block-${lessonNumber}-5`,
                              `block-${lessonNumber}-6`,
                              `block-${lessonNumber}-7`,
                              `block-${lessonNumber}-8`,
                              `block-${lessonNumber}-9`,
                            ]
                          : [
                              `block-${lessonNumber}-1`,
                              `block-${lessonNumber}-2`,
                              `block-${lessonNumber}-3`,
                              `block-${lessonNumber}-4`,
                              `block-${lessonNumber}-5`,
                            ]
                        : language === "cpp" || language === "c++"
                          ? lessonNumber === 1
                            ? [
                                `block-${lessonNumber}-1`,
                                `block-${lessonNumber}-2`,
                                `block-${lessonNumber}-3`,
                                `block-${lessonNumber}-4`,
                                `block-${lessonNumber}-5`,
                                `block-${lessonNumber}-6`,
                                `block-${lessonNumber}-7`,
                                `block-${lessonNumber}-8`,
                                `block-${lessonNumber}-9`,
                                `block-${lessonNumber}-10`,
                              ]
                            : [
                                `block-${lessonNumber}-1`,
                                `block-${lessonNumber}-2`,
                                `block-${lessonNumber}-3`,
                                `block-${lessonNumber}-4`,
                                `block-${lessonNumber}-5`,
                              ]
                          : language === "java"
                            ? lessonNumber === 1
                              ? [
                                  `block-${lessonNumber}-1`,
                                  `block-${lessonNumber}-2`,
                                  `block-${lessonNumber}-3`,
                                  `block-${lessonNumber}-4`,
                                  `block-${lessonNumber}-5`,
                                  `block-${lessonNumber}-6`,
                                  `block-${lessonNumber}-7`,
                                  `block-${lessonNumber}-8`,
                                  `block-${lessonNumber}-9`,
                                ]
                              : [
                                  `block-${lessonNumber}-1`,
                                  `block-${lessonNumber}-2`,
                                  `block-${lessonNumber}-3`,
                                  `block-${lessonNumber}-4`,
                                  `block-${lessonNumber}-5`,
                                ]
                            : language === "python"
                              ? lessonNumber === 1
                                ? [
                                    `block-${lessonNumber}-1`,
                                    `block-${lessonNumber}-2`,
                                    `block-${lessonNumber}-3`,
                                    `block-${lessonNumber}-4`,
                                  ]
                                : [
                                    `block-${lessonNumber}-1`,
                                    `block-${lessonNumber}-2`,
                                    `block-${lessonNumber}-3`,
                                    `block-${lessonNumber}-4`,
                                    `block-${lessonNumber}-5`,
                                  ]
                              : [
                                  `block-${lessonNumber}-1`,
                                  `block-${lessonNumber}-2`,
                                  `block-${lessonNumber}-3`,
                                  `block-${lessonNumber}-4`,
                                  `block-${lessonNumber}-5`,
                                ],
                    hints: [
                      "Start with variable declarations and initialization",
                      "The while condition comes before the loop body",
                      "Don't forget to update the loop variable inside the loop",
                      "Remember proper C program structure with includes and main function",
                    ],
                    difficulty:
                      lessonNumber === 1
                        ? 1
                        : lessonNumber <= count / 2
                          ? 2
                          : 3,
                  },
                  {
                    id: `cbr-${lessonNumber}-2`,
                    scenario:
                      lessonNumber === 1
                        ? "Arrange these code blocks to create a while loop that calculates sum of first 5 numbers:"
                        : lessonNumber <= count / 2
                          ? "Arrange these blocks to create a while loop that finds the maximum in an array:"
                          : "Arrange these blocks to create a while loop that checks if a number is prime:",
                    targetCode:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int i = 1, sum = 0;\n    while (i <= 5) {\n        sum += i;\n        i++;\n    }\n    printf("Sum: %d", sum);\n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int arr[] = {3, 7, 2, 9, 1};\n    int max = arr[0], i = 1;\n    while (i < 5) {\n        if (arr[i] > max) max = arr[i];\n        i++;\n    }\n    printf("Max: %d", max);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int num = 17, i = 2, isPrime = 1;\n    while (i <= num/2) {\n        if (num % i == 0) {\n            isPrime = 0;\n            break;\n        }\n        i++;\n    }\n    printf("%s", isPrime ? "Prime" : "Not Prime");\n    return 0;\n}`
                        : language === "python"
                          ? lessonNumber === 1
                            ? `i = 1\nsum_val = 0\nwhile i <= 5:\n    sum_val += i\n    i += 1\nprint(f"Sum: {sum_val}")`
                            : lessonNumber <= count / 2
                              ? `arr = [3, 7, 2, 9, 1]\nmax_val = arr[0]\ni = 1\nwhile i < len(arr):\n    if arr[i] > max_val:\n        max_val = arr[i]\n    i += 1\nprint(f"Max: {max_val}")`
                              : `num = 17\ni = 2\nis_prime = True\nwhile i <= num // 2:\n    if num % i == 0:\n        is_prime = False\n        break\n    i += 1\nprint("Prime" if is_prime else "Not Prime")`
                          : `let i = 1, sum = 0;\nwhile (i <= 5) {\n    sum += i;\n    i++;\n}\nconsole.log("Sum:", sum);`,
                    codeBlocks:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? [
                              {
                                id: `block-${lessonNumber}-2-1`,
                                content: "#include <stdio.h>",
                              },
                              {
                                id: `block-${lessonNumber}-2-2`,
                                content: "int main() {",
                              },
                              {
                                id: `block-${lessonNumber}-2-3`,
                                content: "    int i = 1, sum = 0;",
                              },
                              {
                                id: `block-${lessonNumber}-2-4`,
                                content: "    while (i <= 5) {",
                              },
                              {
                                id: `block-${lessonNumber}-2-5`,
                                content: "        sum += i;",
                              },
                              {
                                id: `block-${lessonNumber}-2-6`,
                                content: "        i++;",
                              },
                              {
                                id: `block-${lessonNumber}-2-7`,
                                content: "    }",
                              },
                              {
                                id: `block-${lessonNumber}-2-8`,
                                content: '    printf("Sum: %d", sum);',
                              },
                              {
                                id: `block-${lessonNumber}-2-9`,
                                content: "    return 0;\n}",
                              },
                            ]
                          : [
                              {
                                id: `block-${lessonNumber}-2-1`,
                                content: "int arr[] = {3, 7, 2, 9, 1};",
                              },
                              {
                                id: `block-${lessonNumber}-2-2`,
                                content: "int max = arr[0], i = 1;",
                              },
                              {
                                id: `block-${lessonNumber}-2-3`,
                                content: "while (i < 5) {",
                              },
                              {
                                id: `block-${lessonNumber}-2-4`,
                                content: "    if (arr[i] > max) max = arr[i];",
                              },
                              {
                                id: `block-${lessonNumber}-2-5`,
                                content: "    i++;",
                              },
                              { id: `block-${lessonNumber}-2-6`, content: "}" },
                            ]
                        : language === "python"
                          ? lessonNumber === 1
                            ? [
                                {
                                  id: `block-${lessonNumber}-2-1`,
                                  content: "i = 1",
                                },
                                {
                                  id: `block-${lessonNumber}-2-2`,
                                  content: "sum_val = 0",
                                },
                                {
                                  id: `block-${lessonNumber}-2-3`,
                                  content: "while i <= 5:",
                                },
                                {
                                  id: `block-${lessonNumber}-2-4`,
                                  content: "    sum_val += i",
                                },
                                {
                                  id: `block-${lessonNumber}-2-5`,
                                  content: "    i += 1",
                                },
                                {
                                  id: `block-${lessonNumber}-2-6`,
                                  content: 'print(f"Sum: {sum_val}")',
                                },
                              ]
                            : [
                                {
                                  id: `block-${lessonNumber}-2-1`,
                                  content: "num = 17",
                                },
                                {
                                  id: `block-${lessonNumber}-2-2`,
                                  content: "i = 2",
                                },
                                {
                                  id: `block-${lessonNumber}-2-3`,
                                  content: "is_prime = True",
                                },
                                {
                                  id: `block-${lessonNumber}-2-4`,
                                  content: "while i <= num // 2:",
                                },
                                {
                                  id: `block-${lessonNumber}-2-5`,
                                  content: "    if num % i == 0:",
                                },
                                {
                                  id: `block-${lessonNumber}-2-6`,
                                  content: "        is_prime = False",
                                },
                                {
                                  id: `block-${lessonNumber}-2-7`,
                                  content: "        break",
                                },
                                {
                                  id: `block-${lessonNumber}-2-8`,
                                  content: "    i += 1",
                                },
                              ]
                          : [
                              {
                                id: `block-${lessonNumber}-2-1`,
                                content: "let i = 1, sum = 0;",
                              },
                              {
                                id: `block-${lessonNumber}-2-2`,
                                content: "while (i <= 5) {",
                              },
                              {
                                id: `block-${lessonNumber}-2-3`,
                                content: "    sum += i;",
                              },
                              {
                                id: `block-${lessonNumber}-2-4`,
                                content: "    i++;",
                              },
                              { id: `block-${lessonNumber}-2-5`, content: "}" },
                              {
                                id: `block-${lessonNumber}-2-6`,
                                content: 'console.log("Sum:", sum);',
                              },
                            ],
                    correctOrder:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? [
                              `block-${lessonNumber}-2-1`,
                              `block-${lessonNumber}-2-2`,
                              `block-${lessonNumber}-2-3`,
                              `block-${lessonNumber}-2-4`,
                              `block-${lessonNumber}-2-5`,
                              `block-${lessonNumber}-2-6`,
                              `block-${lessonNumber}-2-7`,
                              `block-${lessonNumber}-2-8`,
                              `block-${lessonNumber}-2-9`,
                            ]
                          : [
                              `block-${lessonNumber}-2-1`,
                              `block-${lessonNumber}-2-2`,
                              `block-${lessonNumber}-2-3`,
                              `block-${lessonNumber}-2-4`,
                              `block-${lessonNumber}-2-5`,
                              `block-${lessonNumber}-2-6`,
                            ]
                        : language === "python"
                          ? lessonNumber === 1
                            ? [
                                `block-${lessonNumber}-2-1`,
                                `block-${lessonNumber}-2-2`,
                                `block-${lessonNumber}-2-3`,
                                `block-${lessonNumber}-2-4`,
                                `block-${lessonNumber}-2-5`,
                                `block-${lessonNumber}-2-6`,
                              ]
                            : [
                                `block-${lessonNumber}-2-1`,
                                `block-${lessonNumber}-2-2`,
                                `block-${lessonNumber}-2-3`,
                                `block-${lessonNumber}-2-4`,
                                `block-${lessonNumber}-2-5`,
                                `block-${lessonNumber}-2-6`,
                                `block-${lessonNumber}-2-7`,
                                `block-${lessonNumber}-2-8`,
                              ]
                          : [
                              `block-${lessonNumber}-2-1`,
                              `block-${lessonNumber}-2-2`,
                              `block-${lessonNumber}-2-3`,
                              `block-${lessonNumber}-2-4`,
                              `block-${lessonNumber}-2-5`,
                              `block-${lessonNumber}-2-6`,
                            ],
                    hints: [
                      "Initialize variables before the loop",
                      "Make sure the loop condition eventually becomes false",
                      "Update the loop variable inside the loop body",
                    ],
                    difficulty:
                      lessonNumber === 1
                        ? 1
                        : lessonNumber <= count / 2
                          ? 2
                          : 3,
                  },
                  {
                    id: `cbr-${lessonNumber}-3`,
                    scenario:
                      lessonNumber === 1
                        ? "Arrange these code blocks to create a while loop that prints even numbers from 2 to 10:"
                        : lessonNumber <= count / 2
                          ? "Arrange these blocks to create a while loop that calculates factorial:"
                          : "Arrange these blocks to create a while loop that converts decimal to binary:",
                    targetCode:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? `#include <stdio.h>\n\nint main() {\n    int num = 2;\n    while (num <= 10) {\n        printf("%d ", num);\n        num += 2;\n    }\n    return 0;\n}`
                          : lessonNumber <= count / 2
                            ? `#include <stdio.h>\n\nint main() {\n    int n = 5, fact = 1, i = 1;\n    while (i <= n) {\n        fact *= i;\n        i++;\n    }\n    printf("Factorial: %d", fact);\n    return 0;\n}`
                            : `#include <stdio.h>\n\nint main() {\n    int num = 10, binary[32], i = 0;\n    while (num > 0) {\n        binary[i] = num % 2;\n        num /= 2;\n        i++;\n    }\n    while (--i >= 0) printf("%d", binary[i]);\n    return 0;\n}`
                        : language === "python"
                          ? lessonNumber === 1
                            ? `num = 2\nwhile num <= 10:\n    print(num, end=" ")\n    num += 2`
                            : lessonNumber <= count / 2
                              ? `n = 5\nfact = 1\ni = 1\nwhile i <= n:\n    fact *= i\n    i += 1\nprint(f"Factorial: {fact}")`
                              : `num = 10\nbinary = []\nwhile num > 0:\n    binary.append(num % 2)\n    num //= 2\nprint(''.join(map(str, binary[::-1])))`
                          : `let num = 2;\nwhile (num <= 10) {\n    console.log(num);\n    num += 2;\n}`,
                    codeBlocks:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? [
                              {
                                id: `block-${lessonNumber}-3-1`,
                                content: "#include <stdio.h>",
                              },
                              {
                                id: `block-${lessonNumber}-3-2`,
                                content: "int main() {",
                              },
                              {
                                id: `block-${lessonNumber}-3-3`,
                                content: "    int num = 2;",
                              },
                              {
                                id: `block-${lessonNumber}-3-4`,
                                content: "    while (num <= 10) {",
                              },
                              {
                                id: `block-${lessonNumber}-3-5`,
                                content: '        printf("%d ", num);',
                              },
                              {
                                id: `block-${lessonNumber}-3-6`,
                                content: "        num += 2;",
                              },
                              {
                                id: `block-${lessonNumber}-3-7`,
                                content: "    }",
                              },
                              {
                                id: `block-${lessonNumber}-3-8`,
                                content: "    return 0;\n}",
                              },
                            ]
                          : [
                              {
                                id: `block-${lessonNumber}-3-1`,
                                content: "int n = 5, fact = 1, i = 1;",
                              },
                              {
                                id: `block-${lessonNumber}-3-2`,
                                content: "while (i <= n) {",
                              },
                              {
                                id: `block-${lessonNumber}-3-3`,
                                content: "    fact *= i;",
                              },
                              {
                                id: `block-${lessonNumber}-3-4`,
                                content: "    i++;",
                              },
                              { id: `block-${lessonNumber}-3-5`, content: "}" },
                              {
                                id: `block-${lessonNumber}-3-6`,
                                content: 'printf("Factorial: %d", fact);',
                              },
                            ]
                        : language === "python"
                          ? lessonNumber === 1
                            ? [
                                {
                                  id: `block-${lessonNumber}-3-1`,
                                  content: "num = 2",
                                },
                                {
                                  id: `block-${lessonNumber}-3-2`,
                                  content: "while num <= 10:",
                                },
                                {
                                  id: `block-${lessonNumber}-3-3`,
                                  content: '    print(num, end=" ")',
                                },
                                {
                                  id: `block-${lessonNumber}-3-4`,
                                  content: "    num += 2",
                                },
                              ]
                            : [
                                {
                                  id: `block-${lessonNumber}-3-1`,
                                  content: "num = 10",
                                },
                                {
                                  id: `block-${lessonNumber}-3-2`,
                                  content: "binary = []",
                                },
                                {
                                  id: `block-${lessonNumber}-3-3`,
                                  content: "while num > 0:",
                                },
                                {
                                  id: `block-${lessonNumber}-3-4`,
                                  content: "    binary.append(num % 2)",
                                },
                                {
                                  id: `block-${lessonNumber}-3-5`,
                                  content: "    num //= 2",
                                },
                                {
                                  id: `block-${lessonNumber}-3-6`,
                                  content:
                                    "print(''.join(map(str, binary[::-1])))",
                                },
                              ]
                          : [
                              {
                                id: `block-${lessonNumber}-3-1`,
                                content: "let num = 2;",
                              },
                              {
                                id: `block-${lessonNumber}-3-2`,
                                content: "while (num <= 10) {",
                              },
                              {
                                id: `block-${lessonNumber}-3-3`,
                                content: "    console.log(num);",
                              },
                              {
                                id: `block-${lessonNumber}-3-4`,
                                content: "    num += 2;",
                              },
                              { id: `block-${lessonNumber}-3-5`, content: "}" },
                            ],
                    correctOrder:
                      language === "c-programming" || language === "c"
                        ? lessonNumber === 1
                          ? [
                              `block-${lessonNumber}-3-1`,
                              `block-${lessonNumber}-3-2`,
                              `block-${lessonNumber}-3-3`,
                              `block-${lessonNumber}-3-4`,
                              `block-${lessonNumber}-3-5`,
                              `block-${lessonNumber}-3-6`,
                              `block-${lessonNumber}-3-7`,
                              `block-${lessonNumber}-3-8`,
                            ]
                          : [
                              `block-${lessonNumber}-3-1`,
                              `block-${lessonNumber}-3-2`,
                              `block-${lessonNumber}-3-3`,
                              `block-${lessonNumber}-3-4`,
                              `block-${lessonNumber}-3-5`,
                              `block-${lessonNumber}-3-6`,
                            ]
                        : language === "python"
                          ? lessonNumber === 1
                            ? [
                                `block-${lessonNumber}-3-1`,
                                `block-${lessonNumber}-3-2`,
                                `block-${lessonNumber}-3-3`,
                                `block-${lessonNumber}-3-4`,
                              ]
                            : [
                                `block-${lessonNumber}-3-1`,
                                `block-${lessonNumber}-3-2`,
                                `block-${lessonNumber}-3-3`,
                                `block-${lessonNumber}-3-4`,
                                `block-${lessonNumber}-3-5`,
                                `block-${lessonNumber}-3-6`,
                              ]
                          : [
                              `block-${lessonNumber}-3-1`,
                              `block-${lessonNumber}-3-2`,
                              `block-${lessonNumber}-3-3`,
                              `block-${lessonNumber}-3-4`,
                              `block-${lessonNumber}-3-5`,
                            ],
                    hints: [
                      "Start with variable initialization",
                      "Check the loop condition carefully",
                      "Don't forget to update variables in the loop",
                    ],
                    difficulty:
                      lessonNumber === 1
                        ? 2
                        : lessonNumber <= count / 2
                          ? 3
                          : 3,
                  },
                ],
              },
            },
          }

          // Get content for the specific topic, or use generic content if topic not found
          const topicContent =
            topicMappings[topic.toLowerCase()] || topicMappings["while loop"]
          return (
            topicContent[lessonType] || topicMappings["while loop"][lessonType]
          )
        }

        for (let i = 0; i < count; i++) {
          const lessonNumber = i + 1
          const lessonType = lessonTypes[i % lessonTypes.length] as
            | "concept"
            | "mcq"
            | "fill_in_blanks"
            | "codeblock_rearranging"

          const lessonContent = getEducationalContent(
            lessonType,
            lessonNumber,
            topic,
            language
          )

          lessons.push({
            id: `lesson-${lessonNumber}`,
            title:
              i === 0
                ? `Introduction to ${topic}`
                : i === count - 1
                  ? `Advanced ${topic} Concepts`
                  : lessonType === "mcq"
                    ? `${topic} Knowledge Check`
                    : lessonType === "fill_in_blanks"
                      ? `${topic} Coding Practice`
                      : lessonType === "codeblock_rearranging"
                        ? `${topic} Code Assembly`
                        : `${topic} Deep Dive`,
            type: lessonType,
            content: lessonContent,
            learningObjectives: [
              lessonNumber === 1
                ? `Understand the fundamentals of ${topic}`
                : lessonNumber <= count / 2
                  ? `Apply ${topic} in practical scenarios`
                  : `Master advanced ${topic} techniques`,
            ],
            order: lessonNumber,
          })
        }

        return lessons
      }

      const fallbackTutorial = {
        id: `tutorial-${Date.now()}`,
        title: topic || "Generated Tutorial",
        description: `A comprehensive tutorial about ${topic} in ${language} programming`,
        learningObjectives: [
          `Learn the basics of ${topic}`,
          `Understand key concepts and principles`,
          `Apply knowledge in practical scenarios`,
          `Build confidence through hands-on practice`,
        ],
        keyTopics: [
          topic,
          language,
          "programming",
          "fundamentals",
          "best-practices",
        ],
        difficulty: difficulty || 1,
        lessons: generateFallbackLessons(
          numLessons || 5,
          topic || "programming",
          language || "javascript"
        ),
        practicalApplications: [
          `Building ${language} applications using ${topic}`,
          "Solving real-world programming challenges",
          "Improving code quality and maintainability",
        ],
        tags: [
          topic,
          language,
          "tutorial",
          "learning",
          "programming",
          "fundamentals",
        ],
      }

      console.log("✅ Fallback tutorial created:", fallbackTutorial)
      return NextResponse.json(fallbackTutorial)
    }
  } catch (error) {
    logError("generate-tutorial POST", error)
    return NextResponse.json(createErrorResponse("Internal server error"), {
      status: 500,
    })
  }
}
