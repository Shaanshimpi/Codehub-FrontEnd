// app/api/generate-tutorial/utilities/helpers.ts
// Helper functions for tutorial generation
import type { ProgrammingTutorial, TutorialLesson } from "../interfaces/types"

// ==================== TUTORIAL HELPER FUNCTIONS ====================

export const createEmptyTutorial = (): Partial<any> => ({
  title: "",
  description: "",
  learningObjectives: [],
  keyTopics: [],
  difficulty: 1,
  lessons: [],
  conceptualFlow: [],
  practicalApplications: [],
  tags: [],
  estimatedTime: 0,
})

export const calculateTotalTime = (tutorial: ProgrammingTutorial): number => {
  return tutorial.lessons.reduce(
    (total, lesson) => total + lesson.estimatedTime,
    0
  )
}

export const getLessonsByType = (
  tutorial: ProgrammingTutorial,
  type: string
): TutorialLesson[] => {
  return tutorial.lessons.filter((lesson) => lesson.type === type)
}

export const getTutorialProgress = (
  tutorial: ProgrammingTutorial,
  completedLessons: string[]
): { percentage: number; completedCount: number; totalCount: number } => {
  const totalCount = tutorial.lessons.length
  const completedCount = completedLessons.length
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return { percentage, completedCount, totalCount }
}

// ==================== CONTENT GENERATION HELPERS ====================

export const generateLessonId = (index: number, title: string): string => {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .trim()
  return `lesson-${index + 1}-${cleanTitle}`
}

export const generateTutorialId = (title: string, language: string): string => {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .trim()
  return `${language}-${cleanTitle}-${Date.now()}`
}

// Removed multilingual support - now just returns English text
export const createSingleLanguageText = (text: string): string => text

// ==================== DIFFICULTY HELPERS ====================

export const getDifficultyLabel = (difficulty: 1 | 2 | 3): string => {
  switch (difficulty) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    default:
      return "Unknown"
  }
}

export const getEstimatedTimeLabel = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`
  }
  return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minutes`
}

// ==================== VALIDATION HELPERS ====================

export const isValidDifficulty = (difficulty: any): difficulty is 1 | 2 | 3 => {
  return [1, 2, 3].includes(difficulty)
}

export const isValidLessonType = (
  type: any
): type is "concept" | "mcq" | "codeblock_rearranging" | "fill_in_blanks" => {
  return ["concept", "mcq", "codeblock_rearranging", "fill_in_blanks"].includes(
    type
  )
}

// Removed multilingual validation - no longer needed

// ==================== FORMATTING HELPERS ====================

export const formatLessonTitle = (title: string): string => {
  return title.trim().replace(/^\d+\.\s*/, "") // Remove lesson numbers if present
}

export const formatCodeSnippet = (code: string): string => {
  return code.trim().replace(/^\s*```\w*\n?|\n?```\s*$/g, "") // Remove markdown code blocks
}

export const repairJsonContent = (content: string): string => {
  let repaired = content

  // Fix common JSON syntax errors
  // 1. Fix trailing commas in objects and arrays
  repaired = repaired.replace(/,(\s*[}\]])/g, "$1")

  // 2. Fix missing commas between object properties
  repaired = repaired.replace(/"\s*\n\s*"/g, '",\n"')
  repaired = repaired.replace(/}\s*\n\s*"/g, '},\n"')
  repaired = repaired.replace(/]\s*\n\s*"/g, '],\n"')

  // 3. Fix missing commas between array elements
  repaired = repaired.replace(/}\s*\n\s*{/g, "},\n{")
  repaired = repaired.replace(/]\s*\n\s*\[/g, "],\n[")

  // 4. Fix unescaped quotes in strings
  repaired = repaired.replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":')

  // 5. Fix incomplete arrays or objects at the end
  let openBraces = 0
  let openBrackets = 0
  let inString = false
  let escaped = false

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i]

    if (!inString) {
      if (char === "{") openBraces++
      else if (char === "}") openBraces--
      else if (char === "[") openBrackets++
      else if (char === "]") openBrackets--
      else if (char === '"') inString = true
    } else {
      if (!escaped && char === '"') inString = false
      escaped = !escaped && char === "\\"
    }
  }

  // Close unclosed braces and brackets
  while (openBraces > 0) {
    repaired += "}"
    openBraces--
  }
  while (openBrackets > 0) {
    repaired += "]"
    openBrackets--
  }

  return repaired
}

export const cleanJsonContent = (content: string): string => {
  let cleaned = content.trim()

  // Remove markdown code blocks
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "")
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "")
  }

  // Remove common AI response prefixes
  const prefixes = [
    "Here's the tutorial:",
    "Here is the tutorial:",
    "Tutorial:",
    "JSON:",
    "The tutorial is:",
    "Response:",
  ]

  for (const prefix of prefixes) {
    if (cleaned.toLowerCase().startsWith(prefix.toLowerCase())) {
      cleaned = cleaned.substring(prefix.length).trim()
    }
  }

  // Find the first { and last } to extract just the JSON object
  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }

  // Remove any trailing text after the JSON
  const jsonEndIndex = cleaned.lastIndexOf("}")
  if (jsonEndIndex !== -1 && jsonEndIndex < cleaned.length - 1) {
    cleaned = cleaned.substring(0, jsonEndIndex + 1)
  }

  // Apply JSON repair
  cleaned = repairJsonContent(cleaned)

  return cleaned
}

export const parseJsonWithFallbacks = (content: string): any => {
  const strategies = [
    // Strategy 1: Try parsing as-is
    (json: string) => JSON.parse(json),

    // Strategy 0.5: Try fixing unterminated strings at the end
    (json: string) => {
      let fixed = json.trim()

      // If it ends with an unterminated string, try to close it
      if (fixed.endsWith('"lesso') || fixed.match(/"[^"]*$/)) {
        // Find the last quote and truncate there
        const lastQuoteIndex = fixed.lastIndexOf('"')
        if (lastQuoteIndex > 0) {
          fixed = fixed.substring(0, lastQuoteIndex)
          // Add closing braces to make it valid JSON
          let openBraces = 0
          let openBrackets = 0
          for (let i = 0; i < fixed.length; i++) {
            const char = fixed[i]
            if (char === "{") openBraces++
            else if (char === "}") openBraces--
            else if (char === "[") openBrackets++
            else if (char === "]") openBrackets--
          }
          // Close open structures
          while (openBrackets > 0) {
            fixed += "]"
            openBrackets--
          }
          while (openBraces > 0) {
            fixed += "}"
            openBraces--
          }
        }
      }

      return JSON.parse(fixed)
    },

    // Strategy 2: Try with basic cleaning
    (json: string) => JSON.parse(cleanJsonContent(json)),

    // Strategy 2.5: Try removing potential AI text wrapper
    (json: string) => {
      let cleaned = json
      // Remove common AI response wrappers
      const patterns = [
        /^Here's the tutorial.*?:\s*/i,
        /^Here is the tutorial.*?:\s*/i,
        /^Tutorial response:\s*/i,
        /^JSON response:\s*/i,
        /^The following is.*?:\s*/i,
      ]

      for (const pattern of patterns) {
        cleaned = cleaned.replace(pattern, "")
      }

      return JSON.parse(cleanJsonContent(cleaned))
    },

    // Strategy 3: Try fixing specific JSON errors at error position
    (json: string) => {
      try {
        return JSON.parse(json)
      } catch (error) {
        if (error.message.includes("position")) {
          const match = error.message.match(/position (\d+)/)
          if (match) {
            const position = parseInt(match[1])
            let fixed = json.slice(0, position) + json.slice(position + 1)
            return JSON.parse(fixed)
          }
        }
        throw error
      }
    },

    // Strategy 4: Try removing invalid characters around error position
    (json: string) => {
      try {
        return JSON.parse(json)
      } catch (error) {
        if (error.message.includes("position")) {
          const match = error.message.match(/position (\d+)/)
          if (match) {
            const position = parseInt(match[1])
            // Try inserting missing comma
            let fixed = json.slice(0, position) + "," + json.slice(position)
            try {
              return JSON.parse(fixed)
            } catch {
              // Try removing character at position
              fixed = json.slice(0, position) + json.slice(position + 1)
              return JSON.parse(fixed)
            }
          }
        }
        throw error
      }
    },

    // Strategy 5: Try truncating at the last valid closing brace
    (json: string) => {
      let lastValidEnd = -1
      let braceCount = 0
      let inString = false
      let escaped = false

      for (let i = 0; i < json.length; i++) {
        const char = json[i]

        if (!inString) {
          if (char === "{") {
            braceCount++
          } else if (char === "}") {
            braceCount--
            if (braceCount === 0) {
              lastValidEnd = i
            }
          } else if (char === '"') {
            inString = true
          }
        } else {
          if (!escaped && char === '"') {
            inString = false
          }
          escaped = !escaped && char === "\\"
        }
      }

      if (lastValidEnd > 0) {
        const truncated = json.substring(0, lastValidEnd + 1)
        return JSON.parse(truncated)
      }

      throw new Error("No valid JSON structure found")
    },

    // Strategy 6: Try extracting JSON from text that might contain additional content
    (json: string) => {
      // Find all potential JSON objects in the text
      const jsonObjects = []
      let current = ""
      let braceCount = 0
      let inString = false
      let escaped = false
      let jsonStarted = false

      for (let i = 0; i < json.length; i++) {
        const char = json[i]

        if (!inString) {
          if (char === "{") {
            if (!jsonStarted) {
              current = "{"
              jsonStarted = true
            } else {
              current += char
            }
            braceCount++
          } else if (char === "}") {
            if (jsonStarted) {
              current += char
              braceCount--
              if (braceCount === 0) {
                jsonObjects.push(current)
                current = ""
                jsonStarted = false
              }
            }
          } else if (jsonStarted) {
            current += char
            if (char === '"') {
              inString = true
            }
          }
        } else {
          if (jsonStarted) {
            current += char
          }
          if (!escaped && char === '"') {
            inString = false
          }
          escaped = !escaped && char === "\\"
        }
      }

      // Try parsing each found JSON object
      for (const jsonObj of jsonObjects) {
        try {
          return JSON.parse(jsonObj)
        } catch (e) {
          continue
        }
      }

      throw new Error("No valid JSON objects found in content")
    },
  ]

  let lastError: Error | null = null

  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`🔧 Trying JSON parsing strategy ${i + 1}...`)

      // Show what each strategy is working with
      let strategyInput = content
      if (i === 1) {
        // Basic cleaning strategy
        strategyInput = cleanJsonContent(content)
        console.log(
          `🧹 Strategy ${i + 1} cleaned content (first 500 chars):`,
          strategyInput.substring(0, 500)
        )
      } else if (i === 2) {
        // AI wrapper removal strategy
        const patterns = [
          /^Here's the tutorial.*?:\s*/i,
          /^Here is the tutorial.*?:\s*/i,
          /^Tutorial response:\s*/i,
          /^JSON response:\s*/i,
          /^The following is.*?:\s*/i,
        ]
        strategyInput = content
        for (const pattern of patterns) {
          strategyInput = strategyInput.replace(pattern, "")
        }
        strategyInput = cleanJsonContent(strategyInput)
        console.log(
          `🤖 Strategy ${i + 1} after AI wrapper removal (first 500 chars):`,
          strategyInput.substring(0, 500)
        )
      }

      const result = strategies[i](content)
      console.log(`✅ JSON parsing strategy ${i + 1} succeeded!`)
      return result
    } catch (error) {
      console.log(`❌ JSON parsing strategy ${i + 1} failed:`, error.message)
      lastError = error
      continue
    }
  }

  throw lastError || new Error("All JSON parsing strategies failed")
}

// ==================== MERMAID HELPERS ====================

export const validateMermaidDiagram = (
  diagram: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!diagram.trim()) {
    return { isValid: true, errors } // Empty is valid (optional)
  }

  // Check for diagram type
  const diagramTypes = [
    "graph",
    "flowchart",
    "sequenceDiagram",
    "classDiagram",
    "stateDiagram",
  ]
  const hasValidType = diagramTypes.some((type) =>
    diagram.toLowerCase().includes(type.toLowerCase())
  )

  if (!hasValidType) {
    errors.push(
      "Mermaid diagram should start with a valid diagram type (graph, flowchart, etc.)"
    )
  }

  // Check for problematic characters in labels
  const problematicPatterns = [
    /\[[^\]]*;[^\]]*\]/g, // Semicolons in brackets
    /\[[^\]]*<[^\]]*\]/g, // Angle brackets in brackets
    /\[[^\]]*\\[^\]]*\]/g, // Backslashes in brackets
  ]

  for (const pattern of problematicPatterns) {
    if (pattern.test(diagram)) {
      errors.push(
        "Mermaid diagram contains problematic characters in node labels"
      )
      break
    }
  }

  // Check for single quotes (should use double quotes)
  if (diagram.includes("'") && !diagram.includes('"')) {
    errors.push(
      "Mermaid diagram should use double quotes for text labels, not single quotes"
    )
  }

  return { isValid: errors.length === 0, errors }
}

export const generateDefaultMermaidDiagram = (
  lessons: TutorialLesson[]
): string => {
  const lessonNodes = lessons
    .slice(0, 6)
    .map((lesson, index) => {
      const id = String.fromCharCode(65 + index) // A, B, C, etc.
      const title =
        lesson.title.substring(0, 20) + (lesson.title.length > 20 ? "..." : "")
      return `  ${id}["${title}"]`
    })
    .join("\n")

  const connections = lessons
    .slice(0, 5)
    .map((_, index) => {
      const current = String.fromCharCode(65 + index)
      const next = String.fromCharCode(65 + index + 1)
      return `  ${current} --> ${next}`
    })
    .join("\n")

  return `flowchart TD\n${lessonNodes}\n${connections}`
}

// ==================== ERROR HANDLING HELPERS ====================

export const createErrorResponse = (message: string, status: number = 500) => {
  return {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  }
}

export const logError = (context: string, error: any, additionalInfo?: any) => {
  console.error(`❌ Error in ${context}:`, error.message || error)
  if (error.stack) {
    console.error("Stack trace:", error.stack)
  }
  if (additionalInfo) {
    console.error("Additional info:", additionalInfo)
  }
}

// ==================== DEFAULT CONTENT GENERATORS ====================

export const generateDefaultConceptContent = (title: string): any => ({
  explanation: `Learn about ${title} concepts and their practical applications in programming.`,
  keyPoints: [
    "Understand the fundamental concepts",
    "Learn practical implementation",
    "Apply knowledge in real scenarios",
  ],
  codeExamples: [
    {
      title: "Basic Example",
      code: "// Example code will be provided",
      explanation: "This example demonstrates the basic concept",
    },
  ],
  practiceHints: [
    "Practice with simple examples first",
    "Build upon previous knowledge",
  ],
})

export const generateDefaultMCQContent = (title: string): any => ({
  questions: [
    {
      id: "q1",
      question: `What is the main purpose of ${title}?`,
      options: [
        { id: "a", text: "Option A", isCorrect: true },
        { id: "b", text: "Option B", isCorrect: false },
        { id: "c", text: "Option C", isCorrect: false },
        { id: "d", text: "Option D", isCorrect: false },
      ],
      explanation:
        "The correct answer demonstrates understanding of the concept.",
      difficulty: 1,
    },
  ],
})

// ==================== TRANSFORMATION HELPERS ====================

// Helper function to extract English text from multilingual objects or return string as-is
const extractEnglishText = (text: any): string => {
  if (typeof text === "string") {
    return text
  }
  if (text && typeof text === "object" && text.en) {
    return text.en
  }
  return String(text || "")
}

// Helper function to extract English text from array of multilingual objects
const extractEnglishArray = (arr: any[]): string[] => {
  if (!Array.isArray(arr)) return []
  return arr.map(extractEnglishText)
}

// Generate a default reference structure if missing from AI response
const generateDefaultReference = (
  title: string,
  language: string,
  keyTopics: string[]
): any => {
  return {
    title: title || "Programming Concept Reference",
    subtitle: `Comprehensive ${language} Reference Guide`,
    introduction: `This reference guide provides a complete overview of ${title.toLowerCase()} in ${language}, including syntax, examples, and best practices.`,
    examples: [
      {
        title: "Basic Example",
        description: `A simple example demonstrating ${title.toLowerCase()} usage.`,
        code: `// Example ${language} code will be provided here\n// This is a placeholder for the basic concept`,
        explanation: `This example shows the fundamental usage of ${title.toLowerCase()} in ${language}.`,
        output: "// Expected output will be shown here",
      },
      {
        title: "Practical Example",
        description: `A real-world example of ${title.toLowerCase()}.`,
        code: `// Practical ${language} implementation\n// This demonstrates common use cases`,
        explanation: `This example illustrates how ${title.toLowerCase()} is used in practical scenarios.`,
      },
    ],
    key_points: [
      `${title} is a fundamental concept in ${language} programming`,
      "Understanding this concept is essential for writing effective code",
      "Practice with different examples to master this concept",
    ],
    common_mistakes: [
      {
        mistake: "Not following proper syntax rules",
        why_wrong:
          "Incorrect syntax leads to errors and prevents code execution",
        correct_approach:
          "Always follow the language-specific syntax guidelines",
      },
      {
        mistake: "Not understanding the basic concept",
        why_wrong:
          "Without proper understanding, it's difficult to apply the concept correctly",
        correct_approach:
          "Study the fundamentals and practice with simple examples first",
      },
    ],
    syntax_guide: {
      basic_syntax: `// Basic ${language} syntax for ${title.toLowerCase()}\n// Replace this with actual syntax`,
      parameters: [
        {
          name: "concept",
          description: "The main programming concept being demonstrated",
          required: true,
        },
      ],
    },
  }
}

// Convert to modern English-only format matching updated schema structure
export const convertToModernFormat = (tutorial: any): any => {
  // Generate default reference if missing from AI response
  const reference =
    tutorial.reference ||
    generateDefaultReference(
      tutorial.title || "Programming Concept",
      "Programming Language", // You might want to extract this from context
      tutorial.keyTopics || []
    )

  return {
    id: tutorial.id || `tutorial-${Date.now()}`,
    title: extractEnglishText(tutorial.title),
    description: extractEnglishText(tutorial.description),
    learningObjectives: extractEnglishArray(tutorial.learningObjectives || []),
    keyTopics: tutorial.keyTopics || [],
    difficulty: tutorial.difficulty || 1,
    lessons:
      tutorial.lessons?.map((lesson: any, index: number) => ({
        id: lesson.id || `lesson-${index + 1}`,
        title: extractEnglishText(lesson.title),
        type: lesson.type,
        content: lesson.content,
        learningObjectives: extractEnglishArray(
          lesson.learningObjectives || []
        ),
        order: lesson.order !== undefined ? lesson.order : index + 1,
      })) || [],
    practicalApplications: extractEnglishArray(
      tutorial.practicalApplications || []
    ),
    tags: tutorial.tags || [],
    reference: reference,
  }
}

// Legacy function kept for backward compatibility but now calls modern format
export const convertToLegacyFormat = (tutorial: any): any => {
  const modern = convertToModernFormat(tutorial)
  return {
    ...modern,
    title_en: modern.title,
    description_en: modern.description,
    // Remove empty multilingual fields that were causing issues
  }
}
