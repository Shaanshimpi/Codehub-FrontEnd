/**
 * JSON to Mermaid Converter for CodeHub Complete Platform
 * Step 3: Create JSON-to-Mermaid Converter based on validated real API data
 *
 * Converts educational JSON diagram data to Mermaid syntax strings
 * Based on MERMAID_DIAGRAM_SCHEMA structure from API validation
 */

// TypeScript interfaces based on validated API data structure
export interface MermaidDiagramData {
  type: "class" | "flowchart"
  title?: string
  direction?: "TD" | "LR" | "BT" | "RL" // For flowcharts only

  // For flowcharts
  nodes?: Array<{
    id: string
    label: string
    type: "start" | "end" | "process" | "decision"
    shape?: "rectangle" | "circle" | "diamond" | "stadium" | "rounded"
    description: string
    color?: string // Optional color theme hint
    difficulty?: 1 | 2 | 3 // Optional difficulty level for educational coloring
  }>
  connections?: Array<{
    from: string
    to: string
    label: string
    type: "arrow" | "dotted"
    condition?: string
    description: string
    color?: string // Optional connection color theme
  }>

  // For class diagrams
  classes?: Array<{
    id: string
    label: string
    type: "class" | "interface" | "abstract"
    description: string
    attributes: Array<{
      name: string
      type: string
      visibility:
        | "+"
        | "-"
        | "#"
        | "~"
        | "public"
        | "private"
        | "protected"
        | "package"
      description: string
    }>
    methods: Array<{
      name: string
      returnType: string
      visibility:
        | "+"
        | "-"
        | "#"
        | "~"
        | "public"
        | "private"
        | "protected"
        | "package"
      description: string
    }>
    color?: string // Optional color theme hint
    difficulty?: 1 | 2 | 3 // Optional difficulty level for educational coloring
  }>
  relationships?: Array<{
    from: string
    to: string
    label: string
    type:
      | "inheritance"
      | "composition"
      | "aggregation"
      | "association"
      | "dependency"
    description: string
    color?: string // Optional connection color theme
  }>
}

// Validation interface for input checking
interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Educational color themes aligned with CodeHub platform design
interface ColorTheme {
  fill: string
  stroke: string
  strokeWidth?: string
  color?: string
}

const EDUCATIONAL_COLOR_THEMES = {
  // Difficulty-based colors (matching ExerciseCard.tsx)
  beginner: {
    fill: "#dcfce7",
    stroke: "#16a34a",
    strokeWidth: "2px",
    color: "#15803d",
  }, // green
  intermediate: {
    fill: "#fef3c7",
    stroke: "#d97706",
    strokeWidth: "2px",
    color: "#b45309",
  }, // yellow/amber
  advanced: {
    fill: "#fee2e2",
    stroke: "#dc2626",
    strokeWidth: "2px",
    color: "#b91c1c",
  }, // red

  // Node type colors (matching platform design)
  start: {
    fill: "#dbeafe",
    stroke: "#2563eb",
    strokeWidth: "2px",
    color: "#1d4ed8",
  }, // blue
  end: {
    fill: "#f3e8ff",
    stroke: "#7c3aed",
    strokeWidth: "2px",
    color: "#6d28d9",
  }, // purple
  process: {
    fill: "#f0f9ff",
    stroke: "#0284c7",
    strokeWidth: "2px",
    color: "#0369a1",
  }, // sky blue
  decision: {
    fill: "#fef3c7",
    stroke: "#d97706",
    strokeWidth: "2px",
    color: "#b45309",
  }, // amber

  // Educational context colors
  concept: {
    fill: "#ecfdf5",
    stroke: "#10b981",
    strokeWidth: "2px",
    color: "#047857",
  }, // emerald
  exercise: {
    fill: "#eff6ff",
    stroke: "#3b82f6",
    strokeWidth: "2px",
    color: "#1e40af",
  }, // blue
  warning: {
    fill: "#fefce8",
    stroke: "#eab308",
    strokeWidth: "2px",
    color: "#ca8a04",
  }, // yellow
  success: {
    fill: "#f0fdf4",
    stroke: "#22c55e",
    strokeWidth: "2px",
    color: "#16a34a",
  }, // green
  error: {
    fill: "#fef2f2",
    stroke: "#ef4444",
    strokeWidth: "2px",
    color: "#dc2626",
  }, // red

  // Default neutral
  default: {
    fill: "#f8fafc",
    stroke: "#64748b",
    strokeWidth: "2px",
    color: "#475569",
  }, // slate
}

/**
 * Main conversion function - converts JSON diagram data to Mermaid syntax
 * @param diagramData - Validated JSON diagram data from API
 * @returns Mermaid syntax string ready for rendering
 */
export function convertJSONToMermaid(diagramData: MermaidDiagramData): string {
  // Additional safeguard: prevent arrays from reaching this function
  if (Array.isArray(diagramData)) {
    // Extract first valid diagram as emergency fallback
    const validDiagram = diagramData.find(
      (d) => d && typeof d === "object" && d.type
    )
    if (validDiagram) {
      return convertJSONToMermaid(validDiagram)
    } else {
      return generateErrorDiagram(["Array contains no valid diagram objects"])
    }
  }

  try {
    // Handle null, empty, or unnecessary diagram data
    if (
      !diagramData ||
      Object.keys(diagramData).length === 0 ||
      diagramData === null ||
      diagramData === undefined
    ) {
      // Return empty string for cases where diagram is not needed
      return ""
    }

    // Validate input structure
    const validation = validateDiagramData(diagramData)
    if (!validation.isValid) {
      return generateErrorDiagram(validation.errors)
    }

    // Convert based on diagram type
    let result: string

    switch (diagramData.type) {
      case "class":
        result = convertToMermaidClass(diagramData)
        break
      case "flowchart":
        result = convertToMermaidFlowchart(diagramData)
        break
      default:
        result = generateErrorDiagram([
          `Unsupported diagram type: ${diagramData.type}`,
        ])
        break
    }

    return result
  } catch (error) {
    return generateErrorDiagram([
      `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    ])
  }
}

/**
 * Convert to Mermaid Class Diagram
 * Based on validated API structure for object-oriented concepts
 */
function convertToMermaidClass(data: MermaidDiagramData): string {
  const lines: string[] = []

  // Header
  lines.push("classDiagram")

  // Add title as comment if provided
  if (data.title) {
    lines.push(`    %% ${data.title}`)
  }

  if (!data.classes || data.classes.length === 0) {
    return generateErrorDiagram(["Class diagram must have classes array"])
  }

  // Add class definitions with attributes and methods
  data.classes.forEach((cls) => {
    const safeId = getSafeNodeId(cls.id)
    const safeLabel = cleanText(cls.label)

    lines.push(`    class ${safeId} {`)

    // Add attributes
    if (cls.attributes && cls.attributes.length > 0) {
      cls.attributes.forEach((attr) => {
        const safeAttrName = cleanText(attr.name)
        const safeAttrType = cleanText(attr.type)
        const visibility = formatVisibility(attr.visibility)
        lines.push(`        ${visibility}${safeAttrType} ${safeAttrName}`)
      })
    }

    // Add methods
    if (cls.methods && cls.methods.length > 0) {
      cls.methods.forEach((method) => {
        const safeMethodName = cleanMethodName(method.name)
        const safeReturnType = cleanText(method.returnType)
        const visibility = formatVisibility(method.visibility)
        lines.push(`        ${visibility}${safeMethodName} ${safeReturnType}`)
      })
    }

    // Add constructors (if provided separately from methods)
    if ((cls as any).constructor && Array.isArray((cls as any).constructor)) {
      ;(cls as any).constructor.forEach((constructor: any) => {
        const safeConstructorName = cleanMethodName(constructor.name)
        const visibility = formatVisibility(constructor.visibility)
        lines.push(`        ${visibility}${safeConstructorName} void`)
      })
    }

    lines.push(`    }`)

    // Skip adding redundant class labels for inheritance examples to keep diagrams clean
    // Class names will be shown in the class definition itself
  })

  // Add empty line for readability
  lines.push("")

  // Add relationships
  if (data.relationships && data.relationships.length > 0) {
    data.relationships.forEach((rel) => {
      const fromId = getSafeNodeId(rel.from)
      const toId = getSafeNodeId(rel.to)
      const arrow = getClassDiagramArrow(rel.type)
      const label = rel.label ? ` : ${cleanText(rel.label)}` : ""

      // For inheritance, reverse the direction so child inherits from parent
      // Standard UML: Child <|-- Parent (child inherits from parent)
      if (rel.type === "inheritance") {
        lines.push(`    ${toId} ${arrow} ${fromId}${label}`)
      } else {
        lines.push(`    ${fromId} ${arrow} ${toId}${label}`)
      }
    })
  }

  // Add styling section for educational coloring
  const styleLines = generateClassStyling(data)
  if (styleLines.length > 0) {
    lines.push("")
    lines.push("    %% Educational styling")
    lines.push(...styleLines)
  }

  const result = lines.join("\n")

  // Console log the generated Mermaid code for debugging
  console.log("🎨 Generated Mermaid Class Diagram:", {
    title: data.title,
    classCount: data.classes?.length || 0,
    relationshipCount: data.relationships?.length || 0,
    generatedCode: result,
  })

  return result
}

/**
 * Convert to Mermaid Flowchart
 * Based on validated API structure for process flows
 */
function convertToMermaidFlowchart(data: MermaidDiagramData): string {
  const lines: string[] = []

  // Header with direction
  const direction = data.direction || "TD"
  lines.push(`flowchart ${direction}`)

  // Add title as comment if provided
  if (data.title) {
    lines.push(`    %% ${data.title}`)
  }

  // Add nodes with proper shapes
  data.nodes.forEach((node) => {
    const nodeId = getSafeNodeId(node.id)
    const shape = getFlowchartShape(node)
    lines.push(`    ${nodeId}${shape}`)
  })

  // Add empty line for readability
  lines.push("")

  // Add connections
  data.connections.forEach((conn) => {
    const arrow = getFlowchartArrow(conn.type)
    const label = conn.label ? `|${cleanText(conn.label)}|` : ""
    const fromId = getSafeNodeId(conn.from)
    const toId = getSafeNodeId(conn.to)
    lines.push(`    ${fromId} ${arrow}${label} ${toId}`)
  })

  // Add styling section
  const styleLines = generateMermaidStyling(data)
  if (styleLines.length > 0) {
    lines.push("")
    lines.push("    %% Educational styling")
    lines.push(...styleLines)
  }

  return lines.join("\n")
}

/**
 * Convert visibility string to Mermaid symbol
 */
function formatVisibility(visibility: string): string {
  switch (visibility) {
    case "public":
    case "+":
      return "+"
    case "private":
    case "-":
      return "-"
    case "protected":
    case "#":
      return "#"
    case "package":
    case "~":
      return "~"
    default:
      return "+" // Default to public if unknown
  }
}

/**
 * Clean method name for class diagrams (no quotes around parentheses)
 */
function cleanMethodName(methodName: string): string {
  // Just clean whitespace and ensure proper formatting
  return methodName
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Get Mermaid class diagram relationship syntax
 */
function getClassDiagramArrow(relationshipType: string): string {
  switch (relationshipType) {
    case "inheritance":
      return "<|--"
    case "composition":
      return "*--"
    case "aggregation":
      return "o--"
    case "association":
      return "-->"
    case "dependency":
      return "..>"
    default:
      return "-->"
  }
}

/**
 * Get Mermaid flowchart arrow syntax
 */
function getFlowchartArrow(connectionType: string): string {
  switch (connectionType) {
    case "dotted":
      return "-..->"
    case "sync":
    case "async":
    case "return":
    case "activation":
      return "-->"
    case "arrow":
    default:
      return "-->"
  }
}

/**
 * Get Mermaid flowchart node shape syntax
 */
function getFlowchartShape(node: MermaidDiagramData["nodes"][0]): string {
  const label = cleanText(node.label)

  // Use shape if provided, otherwise infer from type
  const shape = node.shape || inferShapeFromType(node.type)

  switch (shape) {
    case "stadium":
      return `([${label}])`
    case "diamond":
      return `{${label}}`
    case "circle":
      return `((${label}))`
    case "rounded":
      return `(${label})`
    case "rectangle":
    default:
      return `[${label}]`
  }
}

/**
 * Infer shape from node type for flowcharts
 */
function inferShapeFromType(nodeType: string): string {
  switch (nodeType) {
    case "start":
    case "end":
      return "stadium"
    case "decision":
      return "diamond"
    case "process":
    default:
      return "rectangle"
  }
}

/**
 * Clean and escape text for Mermaid syntax
 * Handles quotes properly by wrapping in double quotes and using single quotes inside
 */
function cleanText(text: string): string {
  // Clean up whitespace and line breaks
  let cleanedText = text
    .replace(/\n/g, " ")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim()

  // Handle quotes: if text contains double quotes, convert them to single quotes
  // and wrap the entire text in double quotes
  if (cleanedText.includes('"')) {
    cleanedText = cleanedText.replace(/"/g, "'")
    return `"${cleanedText}"`
  }

  // If text contains special characters, spaces, or reserved keywords, wrap in quotes
  const hasSpecialChars = /[&<>(){}[\]|\\:;,.*+=~`!@#$%^]/.test(cleanedText)
  const hasSpaces = cleanedText.includes(" ")
  const isReservedKeyword = ["end", "start", "click", "call", "href"].includes(
    cleanedText.toLowerCase()
  )

  if (hasSpecialChars || hasSpaces || isReservedKeyword) {
    return `"${cleanedText}"`
  }

  return cleanedText
}

/**
 * Get safe node ID for Mermaid syntax
 * Handles reserved keywords and special characters in node IDs
 */
function getSafeNodeId(nodeId: string): string {
  // List of Mermaid reserved keywords that need modification
  const reservedKeywords = [
    "end",
    "start",
    "graph",
    "subgraph",
    "click",
    "call",
    "href",
  ]

  // Clean the node ID
  let safeId = nodeId.toLowerCase().trim()

  // If it's a reserved keyword, append suffix
  if (reservedKeywords.includes(safeId)) {
    return `${safeId}_node`
  }

  // Replace special characters that could cause issues
  safeId = safeId
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^[0-9]/, "n$&") // Prefix numbers with 'n'
    .replace(/_+/g, "_") // Remove multiple underscores
    .replace(/^_|_$/g, "") // Remove leading/trailing underscores

  // Ensure it's not empty
  if (!safeId) {
    safeId = "node"
  }

  return safeId
}

/**
 * Get educational color theme for a node based on type, difficulty, or explicit color
 */
function getNodeColorTheme(node: MermaidDiagramData["nodes"][0]): ColorTheme {
  // Explicit color takes precedence
  if (
    node.color &&
    EDUCATIONAL_COLOR_THEMES[
      node.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ]
  ) {
    return EDUCATIONAL_COLOR_THEMES[
      node.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ]
  }

  // Difficulty-based coloring
  if (node.difficulty) {
    switch (node.difficulty) {
      case 1:
        return EDUCATIONAL_COLOR_THEMES.beginner
      case 2:
        return EDUCATIONAL_COLOR_THEMES.intermediate
      case 3:
        return EDUCATIONAL_COLOR_THEMES.advanced
    }
  }

  // Node type-based coloring
  switch (node.type) {
    case "start":
      return EDUCATIONAL_COLOR_THEMES.start
    case "end":
      return EDUCATIONAL_COLOR_THEMES.end
    case "process":
      return EDUCATIONAL_COLOR_THEMES.process
    case "decision":
      return EDUCATIONAL_COLOR_THEMES.decision
    default:
      return EDUCATIONAL_COLOR_THEMES.default
  }
}

/**
 * Get educational color theme for a class based on type, difficulty, or explicit color
 */
function getClassColorTheme(cls: MermaidDiagramData["classes"][0]): ColorTheme {
  // Explicit color takes precedence
  if (
    cls.color &&
    EDUCATIONAL_COLOR_THEMES[cls.color as keyof typeof EDUCATIONAL_COLOR_THEMES]
  ) {
    return EDUCATIONAL_COLOR_THEMES[
      cls.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ]
  }

  // Difficulty-based coloring
  if (cls.difficulty) {
    switch (cls.difficulty) {
      case 1:
        return EDUCATIONAL_COLOR_THEMES.beginner
      case 2:
        return EDUCATIONAL_COLOR_THEMES.intermediate
      case 3:
        return EDUCATIONAL_COLOR_THEMES.advanced
    }
  }

  // Class type-based coloring
  switch (cls.type) {
    case "class":
      return EDUCATIONAL_COLOR_THEMES.concept
    case "interface":
      return EDUCATIONAL_COLOR_THEMES.exercise
    case "abstract":
      return EDUCATIONAL_COLOR_THEMES.warning
    default:
      return EDUCATIONAL_COLOR_THEMES.default
  }
}

/**
 * Get connection color based on type or explicit color
 */
function getConnectionColor(
  connection: MermaidDiagramData["connections"][0]
): string {
  // Explicit color takes precedence
  if (
    connection.color &&
    EDUCATIONAL_COLOR_THEMES[
      connection.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ]
  ) {
    return EDUCATIONAL_COLOR_THEMES[
      connection.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ].stroke
  }

  // Connection type-based coloring for flowcharts
  switch (connection.type) {
    case "arrow":
      return EDUCATIONAL_COLOR_THEMES.process.stroke
    case "dotted":
      return EDUCATIONAL_COLOR_THEMES.warning.stroke
    default:
      return EDUCATIONAL_COLOR_THEMES.default.stroke
  }
}

/**
 * Get relationship color based on type or explicit color
 */
function getRelationshipColor(
  relationship: MermaidDiagramData["relationships"][0]
): string {
  // Explicit color takes precedence
  if (
    relationship.color &&
    EDUCATIONAL_COLOR_THEMES[
      relationship.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ]
  ) {
    return EDUCATIONAL_COLOR_THEMES[
      relationship.color as keyof typeof EDUCATIONAL_COLOR_THEMES
    ].stroke
  }

  // Relationship type-based coloring for class diagrams
  switch (relationship.type) {
    case "inheritance":
      return EDUCATIONAL_COLOR_THEMES.concept.stroke
    case "composition":
      return EDUCATIONAL_COLOR_THEMES.success.stroke
    case "aggregation":
      return EDUCATIONAL_COLOR_THEMES.exercise.stroke
    case "association":
      return EDUCATIONAL_COLOR_THEMES.process.stroke
    case "dependency":
      return EDUCATIONAL_COLOR_THEMES.warning.stroke
    default:
      return EDUCATIONAL_COLOR_THEMES.default.stroke
  }
}

/**
 * Generate Mermaid styling classes and style definitions
 */
function generateMermaidStyling(data: MermaidDiagramData): string[] {
  const styleLines: string[] = []
  const nodeStyles = new Map<string, ColorTheme>()

  // Collect unique node styles
  data.nodes.forEach((node) => {
    const safeId = getSafeNodeId(node.id)
    const theme = getNodeColorTheme(node)
    nodeStyles.set(safeId, theme)
  })

  // Generate style definitions for each node
  nodeStyles.forEach((theme, nodeId) => {
    styleLines.push(
      `    style ${nodeId} fill:${theme.fill},stroke:${theme.stroke},stroke-width:${theme.strokeWidth || "2px"},color:${theme.color || theme.stroke}`
    )
  })

  // Generate link styles for connections with colors
  if (data.connections) {
    data.connections.forEach((conn, index) => {
      const color = getConnectionColor(conn)
      if (color !== EDUCATIONAL_COLOR_THEMES.default.stroke) {
        styleLines.push(
          `    linkStyle ${index} stroke:${color},stroke-width:2px;`
        )
      }
    })
  }

  return styleLines
}

/**
 * Generate Mermaid styling for class diagrams
 */
function generateClassStyling(data: MermaidDiagramData): string[] {
  const styleLines: string[] = []

  if (!data.classes) return styleLines

  const classStyles = new Map<string, ColorTheme>()

  // Collect unique class styles
  data.classes.forEach((cls) => {
    const safeId = getSafeNodeId(cls.id)
    const theme = getClassColorTheme(cls)
    classStyles.set(safeId, theme)
  })

  // Generate style definitions for each class
  classStyles.forEach((theme, classId) => {
    styleLines.push(
      `    style ${classId} fill:${theme.fill},stroke:${theme.stroke},stroke-width:${theme.strokeWidth || "2px"},color:${theme.color || theme.stroke}`
    )
  })

  // Note: linkStyle is not supported in class diagrams
  // Class diagram relationships are styled through the relationship arrows themselves
  // and individual class styling via the style keyword

  return styleLines
}

/**
 * Validate diagram data structure
 */
function validateDiagramData(data: any): ValidationResult {
  const errors: string[] = []

  if (!data) {
    errors.push("Diagram data is required")
    return { isValid: false, errors }
  }

  if (!data.type) {
    errors.push("Diagram type is required")
  } else if (!["class", "flowchart"].includes(data.type)) {
    errors.push(`Unsupported diagram type: ${data.type}`)
  }

  // Type-specific validation
  if (data.type === "flowchart") {
    if (!data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0) {
      errors.push(
        "Flowchart diagrams require nodes array and must not be empty"
      )
    } else {
      // Validate flowchart nodes
      data.nodes.forEach((node: any, index: number) => {
        if (!node.id) {
          errors.push(`Node at index ${index} missing required 'id' field`)
        }
        if (!node.label) {
          errors.push(`Node '${node.id}' missing required 'label' field`)
        }
        if (!node.type) {
          errors.push(`Node '${node.id}' missing required 'type' field`)
        }
      })
    }

    if (!data.connections || !Array.isArray(data.connections)) {
      errors.push("Flowchart diagrams require connections array")
    } else {
      // Validate connections
      data.connections.forEach((conn: any, index: number) => {
        if (!conn.from || !conn.to) {
          errors.push(
            `Connection at index ${index} missing 'from' or 'to' field`
          )
        }

        // Check if referenced nodes exist
        if (data.nodes) {
          const fromExists = data.nodes.some(
            (node: any) => node.id === conn.from
          )
          const toExists = data.nodes.some((node: any) => node.id === conn.to)

          if (!fromExists) {
            errors.push(`Connection references non-existent node: ${conn.from}`)
          }
          if (!toExists) {
            errors.push(`Connection references non-existent node: ${conn.to}`)
          }
        }
      })
    }
  } else if (data.type === "class") {
    if (
      !data.classes ||
      !Array.isArray(data.classes) ||
      data.classes.length === 0
    ) {
      errors.push("Class diagrams require classes array and must not be empty")
    } else {
      // Validate classes
      data.classes.forEach((cls: any, index: number) => {
        if (!cls.id) {
          errors.push(`Class at index ${index} missing required 'id' field`)
        }
        if (!cls.label) {
          errors.push(`Class '${cls.id}' missing required 'label' field`)
        }
        if (!cls.type) {
          errors.push(`Class '${cls.id}' missing required 'type' field`)
        }
      })
    }

    if (data.relationships && Array.isArray(data.relationships)) {
      // Validate relationships
      data.relationships.forEach((rel: any, index: number) => {
        if (!rel.from || !rel.to) {
          errors.push(
            `Relationship at index ${index} missing 'from' or 'to' field`
          )
        }

        // Check if referenced classes exist
        if (data.classes) {
          const fromExists = data.classes.some(
            (cls: any) => cls.id === rel.from
          )
          const toExists = data.classes.some((cls: any) => cls.id === rel.to)

          if (!fromExists) {
            errors.push(
              `Relationship references non-existent class: ${rel.from}`
            )
          }
          if (!toExists) {
            errors.push(`Relationship references non-existent class: ${rel.to}`)
          }
        }
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Generate error diagram for invalid data
 */
function generateErrorDiagram(errors: string[]): string {
  const lines = [
    "flowchart TD",
    "    %% Error: Invalid diagram data",
    "    error[Diagram Error]",
    "    error --> details[Check console for details]",
  ]

  return lines.join("\n")
}

/**
 * Utility function to check if data is valid Mermaid diagram data
 */
export function isMermaidDiagramData(data: any): data is MermaidDiagramData {
  const validation = validateDiagramData(data)
  return validation.isValid
}

/**
 * Get converter information and supported features
 */
export function getConverterInfo() {
  return {
    version: "1.3.0",
    supportedDiagramTypes: ["class", "flowchart"] as const,
    supportedNodeTypes: ["start", "end", "process", "decision"] as const,
    supportedClassTypes: ["class", "interface", "abstract"] as const,
    supportedShapes: [
      "rectangle",
      "circle",
      "diamond",
      "stadium",
      "rounded",
    ] as const,
    supportedConnectionTypes: ["arrow", "dotted"] as const,
    supportedRelationshipTypes: [
      "inheritance",
      "composition",
      "aggregation",
      "association",
      "dependency",
    ] as const,
    supportedDirections: ["TD", "LR", "BT", "RL"] as const,
    supportedColorThemes: Object.keys(EDUCATIONAL_COLOR_THEMES),
    features: [
      "TypeScript support",
      "Input validation",
      "Error handling",
      "Educational diagram optimization",
      "Real API data structure support",
      "Next.js compatibility",
      "Proper quote handling and escaping",
      "Reserved keyword protection",
      "Special character sanitization",
      "Educational color theming",
      "Difficulty-based automatic coloring",
      "Node type-based styling",
      "Class diagram support with OOP concepts",
      "Connection color coding",
      "Class relationship visualization",
      "Method and attribute visibility support",
    ],
  }
}

/**
 * Get available color themes for educational diagrams
 */
export function getAvailableColorThemes(): Record<string, ColorTheme> {
  return { ...EDUCATIONAL_COLOR_THEMES }
}

/**
 * Create a node with educational styling
 * Helper function for developers creating diagram data
 */
export function createStyledNode(
  id: string,
  label: string,
  type: MermaidDiagramData["nodes"][0]["type"],
  options?: {
    description?: string
    difficulty?: 1 | 2 | 3
    color?: keyof typeof EDUCATIONAL_COLOR_THEMES
    shape?: MermaidDiagramData["nodes"][0]["shape"]
  }
): MermaidDiagramData["nodes"][0] {
  return {
    id,
    label,
    type,
    description: options?.description || `${type} node: ${label}`,
    ...(options?.difficulty && { difficulty: options.difficulty }),
    ...(options?.color && { color: options.color }),
    ...(options?.shape && { shape: options.shape }),
  }
}

/**
 * Create a class with educational styling
 * Helper function for developers creating class diagram data
 */
export function createStyledClass(
  id: string,
  label: string,
  type: MermaidDiagramData["classes"][0]["type"],
  options?: {
    description?: string
    attributes?: MermaidDiagramData["classes"][0]["attributes"]
    methods?: MermaidDiagramData["classes"][0]["methods"]
    difficulty?: 1 | 2 | 3
    color?: keyof typeof EDUCATIONAL_COLOR_THEMES
  }
): MermaidDiagramData["classes"][0] {
  return {
    id,
    label,
    type,
    description: options?.description || `${type}: ${label}`,
    attributes: options?.attributes || [],
    methods: options?.methods || [],
    ...(options?.difficulty && { difficulty: options.difficulty }),
    ...(options?.color && { color: options.color }),
  }
}

/**
 * Create a connection with educational styling
 * Helper function for developers creating diagram data
 */
export function createStyledConnection(
  from: string,
  to: string,
  label: string,
  type: MermaidDiagramData["connections"][0]["type"],
  options?: {
    description?: string
    condition?: string
    color?: keyof typeof EDUCATIONAL_COLOR_THEMES
  }
): MermaidDiagramData["connections"][0] {
  return {
    from,
    to,
    label,
    type,
    description:
      options?.description || `${type} connection from ${from} to ${to}`,
    ...(options?.condition && { condition: options.condition }),
    ...(options?.color && { color: options.color }),
  }
}

/**
 * Create a relationship with educational styling
 * Helper function for developers creating class diagram data
 */
export function createStyledRelationship(
  from: string,
  to: string,
  label: string,
  type: MermaidDiagramData["relationships"][0]["type"],
  options?: {
    description?: string
    color?: keyof typeof EDUCATIONAL_COLOR_THEMES
  }
): MermaidDiagramData["relationships"][0] {
  return {
    from,
    to,
    label,
    type,
    description:
      options?.description || `${type} relationship from ${from} to ${to}`,
    ...(options?.color && { color: options.color }),
  }
}
