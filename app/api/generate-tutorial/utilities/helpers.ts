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

export const sanitizeControlCharacters = (content: string): string => {
  // Smart control character replacement that preserves JSON structure
  let sanitized = content

  // Remove the most problematic control characters
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")

  // Only escape control characters that are inside string values
  // We need to be careful not to break JSON structure
  const lines = sanitized.split("\n")
  const processedLines = lines.map((line) => {
    // Skip lines that are pure JSON structure (braces, brackets, commas)
    // eslint-disable-next-line no-useless-escape
    if (/^\s*[{}\[\],]*\s*$/.test(line)) {
      return line
    }

    // For lines with string values, escape problematic characters within quotes
    return line.replace(
      /"([^"]*)"(\s*:\s*"[^"]*")?/g,
      (match, key, valueMatch) => {
        if (valueMatch) {
          // This is a key-value pair, sanitize the value part
          const [keyPart, valuePart] = match.split(":", 2)
          const cleanValue = valuePart
            .replace(/\\/g, "\\\\") // Escape backslashes
            .replace(/\t/g, "\\t") // Escape tabs
            .replace(/\r/g, "\\r") // Escape carriage returns
            .replace(/\f/g, "\\f") // Escape form feeds
            .replace(/\b/g, "\\b") // Escape backspaces
          return `${keyPart}:${cleanValue}`
        }
        return match
      }
    )
  })

  return processedLines.join("\n")
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

  // More robust JSON extraction - look for complete JSON objects
  // Handle cases where there might be mermaid diagrams or other text before/after JSON
  const lines = cleaned.split("\n")
  let jsonStart = -1
  let jsonEnd = -1
  let braceCount = 0
  let inJson = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip obvious non-JSON lines (mermaid diagram content)
    if (
      line.startsWith("flowchart") ||
      line.startsWith("graph") ||
      line.includes("-->") ||
      line.includes("style ") ||
      line.startsWith("%%") ||
      line.includes("fill:") ||
      line.includes("stroke:")
    ) {
      continue
    }

    // Look for the start of JSON object
    if (!inJson && line.includes("{")) {
      // Check if this line looks like the start of a JSON object
      if (
        line.includes('"id"') ||
        line.includes('"title"') ||
        line.includes('"type"') ||
        line.trim() === "{"
      ) {
        jsonStart = i
        inJson = true
        braceCount =
          (line.match(/{/g) || []).length - (line.match(/}/g) || []).length
      }
    } else if (inJson) {
      braceCount +=
        (line.match(/{/g) || []).length - (line.match(/}/g) || []).length
      if (braceCount === 0) {
        jsonEnd = i
        break
      }
    }
  }

  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = lines.slice(jsonStart, jsonEnd + 1).join("\n")
  } else {
    // Fallback to original method
    const firstBrace = cleaned.indexOf("{")
    const lastBrace = cleaned.lastIndexOf("}")

    if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1)
    }
  }

  // Apply minimal sanitization only for the most problematic characters
  cleaned = sanitizeControlCharacters(cleaned)

  // Apply JSON repair
  cleaned = repairJsonContent(cleaned)

  return cleaned
}

export const parseJsonWithFallbacks = (content: string): any => {
  const strategies = [
    // Strategy 1: Try parsing as-is
    (json: string) => JSON.parse(json),

    // Strategy 1.5: Try aggressive control character removal
    (json: string) => {
      const cleaned = json
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove all control chars
        .replace(/\r\n/g, " ") // Replace Windows line endings
        .replace(/\n/g, " ") // Replace Unix line endings
        .replace(/\r/g, " ") // Replace Mac line endings
        .replace(/\t/g, " ") // Replace tabs with spaces
        .replace(/\s+/g, " ") // Collapse multiple spaces
      return JSON.parse(cleaned)
    },

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

// ==================== PLANTUML HELPERS ====================

export const validatePlantUMLDiagram = (
  diagram: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!diagram.trim()) {
    return { isValid: true, errors } // Empty is valid (optional)
  }

  // Check for @startuml and @enduml tags
  if (!diagram.includes("@startuml")) {
    errors.push("PlantUML diagram must start with @startuml tag")
  }

  if (!diagram.includes("@enduml")) {
    errors.push("PlantUML diagram must end with @enduml tag")
  }

  // Check for blue-gray theme
  if (!diagram.includes("!theme blue-gray")) {
    errors.push(
      "PlantUML diagram should include !theme blue-gray directive for consistent theming"
    )
  }

  // Check for valid PlantUML diagram types
  const diagramKeywords = [
    "activity",
    "component",
    "class",
    "sequence",
    "usecase",
    "state",
    "object",
    "start",
    "participant",
    "actor",
  ]

  const hasValidContent = diagramKeywords.some((keyword) =>
    diagram.toLowerCase().includes(keyword.toLowerCase())
  )

  if (!hasValidContent) {
    errors.push(
      "PlantUML diagram should contain valid PlantUML elements (activity, component, class, sequence, etc.)"
    )
  }

  return { isValid: errors.length === 0, errors }
}

export const generateDefaultPlantUMLDiagram = (
  lessons: TutorialLesson[]
): string => {
  const lessonSteps = lessons
    .slice(0, 6)
    .map((lesson) => {
      const title =
        lesson.title.substring(0, 30) + (lesson.title.length > 30 ? "..." : "")
      return `:${title};`
    })
    .join("\n")

  return `@startuml
!theme blue-gray
start
${lessonSteps}
stop
@enduml`
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

// Note: generateDefaultReference function removed - AI now always generates proper reference content
// with enhanced prompts ensuring no placeholder content is created

// Proven convertJSONToMermaid function from MultiLessonTutorialForm
const convertJSONToMermaidString = (diagramData: any): string => {
  // Use the exact same logic as convertJSONToMermaid from MultiLessonTutorialForm
  if (!diagramData || typeof diagramData !== "object" || !diagramData.type) {
    return ""
  }

  try {
    const {
      type,
      nodes = [],
      connections = [],
      classes = [],
      relationships = [],
    } = diagramData

    switch (type) {
      case "flowchart":
        let flowchartCode = "flowchart TD\n"

        // Helper function to properly escape Mermaid labels
        const escapeMermaidLabel = (label: string): string => {
          if (!label) return '""'

          // Clean the label
          let cleanedLabel = label.trim()

          // Always wrap complex labels in double quotes for safety
          const needsQuotes =
            cleanedLabel.includes(" ") ||
            cleanedLabel.includes("'") ||
            cleanedLabel.includes('"') ||
            cleanedLabel.includes(".") ||
            cleanedLabel.includes("?") ||
            cleanedLabel.includes("!") ||
            cleanedLabel.includes(">") ||
            cleanedLabel.includes("<") ||
            cleanedLabel.includes("=") ||
            cleanedLabel.includes("&") ||
            cleanedLabel.includes("|") ||
            cleanedLabel.includes("#") ||
            cleanedLabel.includes("%") ||
            cleanedLabel.includes("(") ||
            cleanedLabel.includes(")") ||
            cleanedLabel.includes("[") ||
            cleanedLabel.includes("]") ||
            cleanedLabel.includes("{") ||
            cleanedLabel.includes("}")

          if (needsQuotes) {
            // For robust escaping, replace problematic quotes with appropriate alternatives
            cleanedLabel = cleanedLabel
              .replace(/"/g, "'") // Double quotes → single quotes
              .replace(/\\/g, "/") // Backslashes → forward slashes (safer for display)
            return `"${cleanedLabel}"`
          }

          return cleanedLabel
        }

        // Add nodes with proper shapes
        nodes.forEach((node: any) => {
          let nodeId = node.id || "node"
          const nodeLabel = escapeMermaidLabel(node.label || node.text || "")
          const nodeType = node.type || "process"

          // Handle reserved keywords - use start_node and end_node instead of start and end
          if (nodeId.toLowerCase() === "start") {
            nodeId = "start_node"
          } else if (nodeId.toLowerCase() === "end") {
            nodeId = "end_node"
          }

          switch (nodeType) {
            case "start":
              flowchartCode += `    ${nodeId}([${nodeLabel}])\n`
              break
            case "end":
              flowchartCode += `    ${nodeId}([${nodeLabel}])\n`
              break
            case "decision":
              flowchartCode += `    ${nodeId}{${nodeLabel}}\n`
              break
            case "process":
            default:
              flowchartCode += `    ${nodeId}[${nodeLabel}]\n`
              break
          }
        })

        // Add connections
        connections.forEach((conn: any) => {
          let from = conn.from || conn.source
          let to = conn.to || conn.target
          const label = conn.label || ""

          // Handle reserved keywords in connections too
          if (from && from.toLowerCase() === "start") {
            from = "start_node"
          } else if (from && from.toLowerCase() === "end") {
            from = "end_node"
          }

          if (to && to.toLowerCase() === "start") {
            to = "start_node"
          } else if (to && to.toLowerCase() === "end") {
            to = "end_node"
          }

          if (from && to) {
            if (label) {
              // Escape connection labels properly
              const escapedLabel = label.replace(/"/g, "'").trim()
              flowchartCode += `    ${from} -->|"${escapedLabel}"| ${to}\n`
            } else {
              flowchartCode += `    ${from} --> ${to}\n`
            }
          }
        })

        return flowchartCode

      case "class":
        let classCode = "classDiagram\n"

        classes.forEach((cls: any) => {
          const className = cls.id || cls.label
          classCode += `    class ${className} {\n`

          if (cls.attributes) {
            cls.attributes.forEach((attr: any) => {
              classCode += `        ${attr.type || "string"} ${attr.name}\n`
            })
          }

          if (cls.methods) {
            cls.methods.forEach((method: any) => {
              classCode += `        ${method.name}()\n`
            })
          }

          classCode += `    }\n`
        })

        relationships.forEach((rel: any) => {
          const from = rel.from
          const to = rel.to

          switch (rel.type) {
            case "inheritance":
              classCode += `    ${from} <|-- ${to}\n`
              break
            case "composition":
              classCode += `    ${from} *-- ${to}\n`
              break
            case "aggregation":
              classCode += `    ${from} o-- ${to}\n`
              break
            default:
              classCode += `    ${from} --> ${to}\n`
              break
          }
        })

        return classCode

      default:
        return ""
    }
  } catch (error) {
    console.error("Error converting JSON to mermaid:", error)
    return ""
  }
}

// Helper function to convert diagram_data to mermaid_code format
const convertDiagramDataToMermaidCode = (diagramData: any): string[] => {
  if (!diagramData) return []

  // If it's already an array, map it to the new format
  if (Array.isArray(diagramData)) {
    return diagramData.map((item) =>
      convertJSONToMermaidString(
        typeof item === "object" && item.code ? item.code : item
      )
    )
  }

  // If it's a single item, convert and wrap in array
  return [convertJSONToMermaidString(diagramData)]
}

// Helper function to recursively convert diagram_data fields to mermaid_code
const convertLessonContent = (content: any): any => {
  if (!content || typeof content !== "object") return content

  const converted = { ...content }

  // Handle diagram_data at root level - keep diagram_data and create mermaid_code
  if (content.diagram_data !== undefined) {
    converted.mermaid_code = convertDiagramDataToMermaidCode(
      content.diagram_data
    )
    // Keep diagram_data for form display, don't delete it
  }

  // Handle nested objects and arrays
  for (const [key, value] of Object.entries(content)) {
    if (key === "diagram_data") continue // Already handled above

    if (Array.isArray(value)) {
      converted[key] = value.map((item) => {
        if (
          item &&
          typeof item === "object" &&
          item.diagram_data !== undefined
        ) {
          const convertedItem = { ...item }
          convertedItem.mermaid_code = convertDiagramDataToMermaidCode(
            item.diagram_data
          )
          // Keep diagram_data for form display, don't delete it
          return convertLessonContent(convertedItem) // Recursively convert nested content
        }
        return convertLessonContent(item)
      })
    } else if (value && typeof value === "object") {
      converted[key] = convertLessonContent(value)
    }
  }

  return converted
}

// Helper to generate default learning objectives based on lesson content
const generateDefaultLearningObjectives = (lesson: any): string[] => {
  const title = lesson.title?.toLowerCase() || ""
  const type = lesson.type || ""

  const defaults = []

  if (title.includes("introduction") || title.includes("introduction to")) {
    defaults.push("Understand the fundamental concepts and terminology")
    defaults.push("Learn basic syntax and structure")
  } else if (title.includes("practice") || title.includes("quiz")) {
    defaults.push("Test understanding of key concepts")
    defaults.push("Apply knowledge through practical exercises")
  } else if (title.includes("rearrang") || title.includes("structure")) {
    defaults.push("Organize code blocks in logical sequence")
    defaults.push("Practice code structure and flow control")
  } else {
    defaults.push("Master the core programming concepts")
    defaults.push("Apply knowledge in practical scenarios")
  }

  if (type === "mcq") {
    defaults.push("Assess comprehension through multiple choice questions")
  } else if (type === "codeblock_rearranging") {
    defaults.push("Develop code organization skills")
  } else if (type === "fill_in_blanks") {
    defaults.push("Complete code templates accurately")
  }

  return defaults.slice(0, 3) // Return 2-3 items
}

// Helper to generate default key topics based on lesson content
const generateDefaultKeyTopics = (lesson: any): string[] => {
  const title = lesson.title?.toLowerCase() || ""
  const type = lesson.type || ""

  const defaults = []

  // Extract keywords from title
  const keywords = title
    .replace(/^(introduction\s+to|learn|understanding|practice\s+with)/, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && !["the", "a", "an", "and", "or", "of"].includes(word)
    )
    .slice(0, 3)

  if (keywords.length > 0) {
    defaults.push(...keywords)
  }

  // Add type-specific topics
  if (type === "mcq" && defaults.length === 0) {
    defaults.push("assessment", "evaluation", "understanding")
  } else if (type === "codeblock_rearranging" && defaults.length === 0) {
    defaults.push("code organization", "syntax", "structure")
  } else if (type === "fill_in_blanks" && defaults.length === 0) {
    defaults.push(
      "syntax completion",
      "code templates",
      "practical application"
    )
  }

  return defaults.length >= 2
    ? defaults
    : ["programming concepts", "syntax", "implementation"].slice(0, 3)
}

// Convert to modern English-only format matching updated schema structure
export const convertToModernFormat = (tutorial: any): any => {
  // Use AI-generated reference directly - our enhanced prompts ensure this is always present

  return {
    id: tutorial.id || `tutorial-${Date.now()}`,
    title: extractEnglishText(tutorial.title),
    description: extractEnglishText(tutorial.description),
    learningObjectives: extractEnglishArray(tutorial.learningObjectives || []),
    keyTopics: tutorial.keyTopics || [],
    difficulty: tutorial.difficulty || 1,
    lessons:
      tutorial.lessons?.map((lesson: any, index: number) => {
        // Validate and fix missing learningObjectives
        let learningObjectives = extractEnglishArray(
          lesson.learningObjectives || []
        )
        if (learningObjectives.length < 2) {
          console.warn(
            `⚠️ Lesson "${lesson.title}" missing learningObjectives, generating defaults`
          )
          learningObjectives = generateDefaultLearningObjectives(lesson)
        }

        // Validate and fix missing keyTopics
        let keyTopics = lesson.keyTopics || []
        if (keyTopics.length < 2) {
          console.warn(
            `⚠️ Lesson "${lesson.title}" missing keyTopics, generating defaults`
          )
          keyTopics = generateDefaultKeyTopics(lesson)
        }

        return {
          id: lesson.id || `lesson-${index + 1}`,
          title: extractEnglishText(lesson.title),
          type: lesson.type,
          content: convertLessonContent(lesson.content), // Convert diagram_data to mermaid_code
          learningObjectives,
          keyTopics,
          order: lesson.order !== undefined ? lesson.order : index + 1,
        }
      }) || [],
    practicalApplications: extractEnglishArray(
      tutorial.practicalApplications || []
    ),
    tags: tutorial.tags || [],
    reference: tutorial.reference,
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
