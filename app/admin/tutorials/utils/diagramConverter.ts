// Utility functions to convert JSON diagram data to PlantUML syntax
import pako from "pako"

export interface DiagramNode {
  id: string
  label: string
  type?:
    | "start"
    | "end"
    | "activity"
    | "decision"
    | "process"
    | "component"
    | "class"
    | "actor"
    | "participant"
    | "boundary"
    | "control"
    | "entity"
    | "database"
  properties?: {
    fields?: Array<
      | {
          name: string
          type?: string
          visibility?: "+" | "-" | "#" | "~"
        }
      | string
    >
    methods?: Array<
      | {
          name: string
          parameters?: string[]
          returnType?: string
          visibility?: "+" | "-" | "#" | "~"
        }
      | string
    >
    type?: string
    [key: string]: any
  }
}

export interface DiagramConnection {
  from: string
  to: string
  label?: string
  type?:
    | "arrow"
    | "dashed"
    | "dotted"
    | "extends"
    | "implements"
    | "aggregation"
    | "composition"
    | "bidirectional"
    | "association"
    | "return"
    | "async"
    | "self"
}

export interface DiagramData {
  type: "activity" | "component" | "class" | "sequence" | "flowchart"
  title?: string
  nodes: DiagramNode[]
  connections: DiagramConnection[]
  description?: string
}

/**
 * Converts JSON diagram data to PlantUML syntax with blue-gray theme
 */
export function convertJSONToPlantUML(
  diagramData: DiagramData | null | undefined
): string {
  console.log("🔍 convertJSONToPlantUML called with:", diagramData)

  if (
    !diagramData ||
    !diagramData.type ||
    !diagramData.nodes ||
    diagramData.nodes.length === 0
  ) {
    console.log("❌ Invalid diagram data provided:", {
      hasData: !!diagramData,
      hasType: !!diagramData?.type,
      hasNodes: !!diagramData?.nodes,
      nodeCount: diagramData?.nodes?.length || 0,
    })
    return ""
  }

  const { type, title, nodes, connections } = diagramData

  console.log("📊 Processing diagram:", {
    type,
    title,
    nodeCount: nodes.length,
    connectionCount: connections.length,
    nodes: nodes.map((n) => ({ id: n.id, label: n.label, type: n.type })),
    connections: connections.map((c) => ({
      from: c.from,
      to: c.to,
      label: c.label,
    })),
  })

  let plantuml = "@startuml\n!theme bluegray\n"

  if (title) {
    plantuml += `title ${title}\n`
  }

  plantuml += "\n"

  try {
    switch (type) {
      case "activity":
        plantuml += convertToActivityDiagram(nodes, connections)
        break
      case "component":
        plantuml += convertToComponentDiagram(nodes, connections)
        break
      case "class":
        plantuml += convertToClassDiagram(nodes, connections)
        break
      case "sequence":
        plantuml += convertToSequenceDiagram(nodes, connections)
        break
      case "flowchart":
        plantuml += convertToFlowchartDiagram(nodes, connections)
        break
      default:
        console.log(
          "⚠️ Unknown diagram type, falling back to activity diagram:",
          type
        )
        // Fallback to simple activity diagram
        plantuml += convertToActivityDiagram(nodes, connections)
    }
  } catch (error) {
    console.error("❌ Error converting diagram data to PlantUML:", error)
    console.error("❌ Diagram data that caused error:", diagramData)
    // Return a simple fallback diagram
    plantuml += "start\n:Processing;\nstop\n"
  }

  plantuml += "\n@enduml"

  console.log("✅ Generated PlantUML code:", plantuml)

  return plantuml
}

function convertToActivityDiagram(
  nodes: DiagramNode[],
  connections: DiagramConnection[]
): string {
  console.log("🚀 Starting activity diagram conversion")
  console.log(
    "📊 Nodes:",
    nodes.map((n) => ({ id: n.id, label: n.label, type: n.type }))
  )
  console.log(
    "🔗 Connections:",
    connections.map((c) => ({ from: c.from, to: c.to, label: c.label }))
  )

  let content = ""

  // Find start nodes
  const startNodes = nodes.filter((n) => n.type === "start")
  const endNodes = nodes.filter((n) => n.type === "end")

  console.log(
    "🎯 Start nodes:",
    startNodes.map((n) => n.id)
  )
  console.log(
    "🏁 End nodes:",
    endNodes.map((n) => n.id)
  )

  // If no explicit start nodes, find nodes with no incoming connections
  let actualStartNodes = startNodes
  if (actualStartNodes.length === 0) {
    const nodeIdsWithIncoming = new Set(connections.map((c) => c.to))
    actualStartNodes = nodes.filter((n) => !nodeIdsWithIncoming.has(n.id))
    console.log(
      "🔍 No explicit start nodes, using nodes without incoming connections:",
      actualStartNodes.map((n) => n.id)
    )
  }

  // Build adjacency map for easy traversal
  const adjacencyMap = new Map<string, DiagramConnection[]>()
  connections.forEach((conn) => {
    if (!adjacencyMap.has(conn.from)) {
      adjacencyMap.set(conn.from, [])
    }
    adjacencyMap.get(conn.from)!.push(conn)
  })

  console.log("🗺️ Adjacency map:", Object.fromEntries(adjacencyMap))

  // Track visited nodes globally to prevent infinite loops and duplicates
  const globalVisited = new Set<string>()

  // Add PlantUML start
  content += "start\n"

  // Process flow starting from the first start node
  if (actualStartNodes.length > 0) {
    content += processLinearFlow(
      actualStartNodes[0].id,
      nodes,
      adjacencyMap,
      globalVisited,
      endNodes
    )
  } else {
    // Fallback: if no clear start, just create a simple flow
    console.log("⚠️ No start nodes found, creating simple sequential flow")
    nodes.forEach((node) => {
      const label = sanitizeLabel(node.label)
      if (node.type !== "end") {
        content += `:${label};\n`
      }
    })
  }

  // Add PlantUML stop
  content += "stop\n"

  console.log("✅ Generated activity diagram content:", content)
  return content
}

function processLinearFlow(
  startNodeId: string,
  nodes: DiagramNode[],
  adjacencyMap: Map<string, DiagramConnection[]>,
  globalVisited: Set<string>,
  endNodes: DiagramNode[]
): string {
  console.log(`🚀 Processing linear flow from: ${startNodeId}`)

  let content = ""
  let currentNodeId = startNodeId

  while (currentNodeId && !globalVisited.has(currentNodeId)) {
    const node = nodes.find((n) => n.id === currentNodeId)
    if (!node) {
      console.log(`❌ Node ${currentNodeId} not found`)
      break
    }

    globalVisited.add(currentNodeId)
    console.log(`⚡ Processing node: ${currentNodeId} - ${node.label}`)

    const outgoingConnections = adjacencyMap.get(currentNodeId) || []

    if (node.type === "start") {
      // Start nodes don't generate content, just move to next
      if (outgoingConnections.length > 0) {
        currentNodeId = outgoingConnections[0].to
      } else {
        break
      }
    } else if (node.type === "end") {
      // End nodes mark completion
      console.log(`🏁 Reached end node: ${currentNodeId}`)
      break
    } else if (node.type === "decision") {
      // Handle decision nodes with proper flow continuation
      const result = handleLinearDecision(
        node,
        outgoingConnections,
        nodes,
        adjacencyMap,
        globalVisited,
        endNodes
      )
      content += result.content
      currentNodeId = result.nextNodeId
    } else {
      // Regular activity/process node
      const label = sanitizeLabel(node.label)
      content += `:${label};\n`

      // Move to next node
      if (outgoingConnections.length > 0) {
        currentNodeId = outgoingConnections[0].to
      } else {
        break
      }
    }
  }

  console.log(`✅ Linear flow processing complete`)
  return content
}

function handleLinearDecision(
  decisionNode: DiagramNode,
  outgoingConnections: DiagramConnection[],
  nodes: DiagramNode[],
  adjacencyMap: Map<string, DiagramConnection[]>,
  globalVisited: Set<string>,
  endNodes: DiagramNode[]
): { content: string; nextNodeId: string | null } {
  const label = sanitizeLabel(decisionNode.label)
  console.log(
    `🤔 Handling linear decision: ${label} with ${outgoingConnections.length} branches`
  )

  let content = ""
  let nextNodeId: string | null = null

  if (outgoingConnections.length === 0) {
    // No outgoing connections, just create a simple decision
    content += `if (${label}?) then (yes)\nelse (no)\nendif\n`
    return { content, nextNodeId }
  }

  if (outgoingConnections.length === 2) {
    // Binary decision - find which paths go where
    const [firstConn, secondConn] = outgoingConnections

    // Determine which is the "yes" and "no" path based on labels
    let yesConn = firstConn
    let noConn = secondConn

    if (
      firstConn.label &&
      (firstConn.label.toLowerCase().includes("no") ||
        firstConn.label.toLowerCase().includes("false"))
    ) {
      yesConn = secondConn
      noConn = firstConn
    }

    console.log(`✅ Yes path: ${yesConn.to}, ❌ No path: ${noConn.to}`)

    content += `if (${label}?) then (yes)\n`

    // Process yes path
    const yesPath = processLinearFlow(
      yesConn.to,
      nodes,
      adjacencyMap,
      new Set(globalVisited),
      endNodes
    )
    content += yesPath

    content += `else (no)\n`

    // Process no path
    const noPath = processLinearFlow(
      noConn.to,
      nodes,
      adjacencyMap,
      new Set(globalVisited),
      endNodes
    )
    content += noPath

    content += `endif\n`

    // Find the merge point or determine next node
    const yesTarget = nodes.find((n) => n.id === yesConn.to)
    const noTarget = nodes.find((n) => n.id === noConn.to)

    // Look for a common merge point after both branches
    nextNodeId = findMergePoint(yesConn.to, noConn.to, nodes, adjacencyMap)
  } else if (outgoingConnections.length === 1) {
    // Single branch decision
    const conn = outgoingConnections[0]
    const branchLabel = conn.label || "continue"

    content += `if (${label}?) then (${branchLabel})\n`
    const branchPath = processLinearFlow(
      conn.to,
      nodes,
      adjacencyMap,
      new Set(globalVisited),
      endNodes
    )
    content += branchPath
    content += `endif\n`

    nextNodeId = conn.to
  } else {
    // Multiple branches - use switch-like structure
    console.log(
      `🔀 Multiple branches detected (${outgoingConnections.length}), creating switch structure`
    )

    content += `switch (${label}?)\n`

    outgoingConnections.forEach((conn, index) => {
      const branchLabel = conn.label || `option${index + 1}`
      content += `case (${branchLabel})\n`
      const branchPath = processLinearFlow(
        conn.to,
        nodes,
        adjacencyMap,
        new Set(globalVisited),
        endNodes
      )
      content += branchPath
    })

    content += `endswitch\n`

    // For switch, next node would be a merge point after all branches
    nextNodeId = findCommonMergePoint(
      outgoingConnections.map((c) => c.to),
      nodes,
      adjacencyMap
    )
  }

  return { content, nextNodeId }
}

function findMergePoint(
  nodeId1: string,
  nodeId2: string,
  nodes: DiagramNode[],
  adjacencyMap: Map<string, DiagramConnection[]>
): string | null {
  // Simple heuristic: find if both paths eventually lead to the same node
  const path1Descendants = getDescendants(nodeId1, adjacencyMap, new Set())
  const path2Descendants = getDescendants(nodeId2, adjacencyMap, new Set())

  // Find first common descendant
  for (const descendant of path1Descendants) {
    if (path2Descendants.has(descendant)) {
      return descendant
    }
  }

  return null
}

function findCommonMergePoint(
  nodeIds: string[],
  nodes: DiagramNode[],
  adjacencyMap: Map<string, DiagramConnection[]>
): string | null {
  if (nodeIds.length === 0) return null

  // Get descendants for first path
  let commonDescendants = getDescendants(nodeIds[0], adjacencyMap, new Set())

  // Find intersection with all other paths
  for (let i = 1; i < nodeIds.length; i++) {
    const pathDescendants = getDescendants(nodeIds[i], adjacencyMap, new Set())
    commonDescendants = new Set(
      [...commonDescendants].filter((x) => pathDescendants.has(x))
    )
  }

  // Return first common descendant
  return commonDescendants.size > 0 ? [...commonDescendants][0] : null
}

function getDescendants(
  nodeId: string,
  adjacencyMap: Map<string, DiagramConnection[]>,
  visited: Set<string>
): Set<string> {
  if (visited.has(nodeId)) return new Set()

  visited.add(nodeId)
  const descendants = new Set<string>()
  const connections = adjacencyMap.get(nodeId) || []

  connections.forEach((conn) => {
    descendants.add(conn.to)
    const childDescendants = getDescendants(conn.to, adjacencyMap, visited)
    childDescendants.forEach((desc) => descendants.add(desc))
  })

  return descendants
}

function convertToComponentDiagram(
  nodes: DiagramNode[],
  connections: DiagramConnection[]
): string {
  let content = ""

  // Add components with proper styling
  nodes.forEach((node) => {
    const label = sanitizeLabel(node.label)
    const id = sanitizeId(node.id)

    // Determine component type based on node type or properties
    let componentType = "component"
    if (node.type === "actor") {
      componentType = "actor"
    } else if (node.type === "database") {
      componentType = "database"
    } else if (node.properties && node.properties.type) {
      componentType = node.properties.type
    }

    content += `${componentType} "${label}" as ${id}\n`
  })

  content += "\n"

  // Add connections with better arrow types
  connections.forEach((conn) => {
    const fromId = sanitizeId(conn.from)
    const toId = sanitizeId(conn.to)

    // Choose arrow type based on connection type
    let arrow = "-->"
    if (conn.type === "dashed") {
      arrow = "..>"
    } else if (conn.type === "bidirectional") {
      arrow = "<-->"
    } else if (conn.type === "association") {
      arrow = "--"
    }

    const label = conn.label ? ` : ${sanitizeLabel(conn.label)}` : ""
    content += `${fromId} ${arrow} ${toId}${label}\n`
  })

  return content
}

function convertToClassDiagram(
  nodes: DiagramNode[],
  connections: DiagramConnection[]
): string {
  console.log("🚀 Converting class diagram")
  console.log(
    "📊 Nodes:",
    nodes.map((n) => ({ id: n.id, label: n.label, type: n.type }))
  )
  console.log(
    "🔗 Connections:",
    connections.map((c) => ({
      from: c.from,
      to: c.to,
      label: c.label,
      type: c.type,
    }))
  )

  let content = ""

  // Add classes
  nodes.forEach((node) => {
    const className = sanitizeId(node.id)
    console.log(`🏗️ Processing class: ${className}`)

    // Parse class structure from label or properties
    const classStructure = parseClassStructure(node)
    console.log(`📋 Parsed structure:`, classStructure)

    // Start class definition
    content += `class ${className}`

    // Add class alias if we have a clean class name
    if (classStructure.name && classStructure.name !== node.id) {
      content += ` as "${classStructure.name}"`
    }

    // Add class body if we have fields or methods
    if (classStructure.fields.length > 0 || classStructure.methods.length > 0) {
      content += " {\n"

      // Add fields
      classStructure.fields.forEach((field) => {
        content += `  ${field.visibility} ${field.name}${field.type ? ": " + field.type : ""}\n`
      })

      // Add separator if we have both fields and methods
      if (
        classStructure.fields.length > 0 &&
        classStructure.methods.length > 0
      ) {
        content += "  --\n"
      }

      // Add methods
      classStructure.methods.forEach((method) => {
        const params =
          method.parameters.length > 0 ? method.parameters.join(", ") : ""
        const returnType = method.returnType ? `: ${method.returnType}` : ""
        content += `  ${method.visibility} ${method.name}(${params})${returnType}\n`
      })

      content += "}\n"
    } else {
      content += "\n"
    }
  })

  content += "\n"

  // Add relationships with proper notation
  connections.forEach((conn) => {
    const fromId = sanitizeId(conn.from)
    const toId = sanitizeId(conn.to)

    // Determine relationship type based on connection type or label
    let arrow = "-->"
    if (
      conn.type === "inheritance" ||
      conn.type === "extends" ||
      (conn.label && conn.label.toLowerCase().includes("extend"))
    ) {
      arrow = "--|>" // Inheritance
    } else if (
      conn.type === "implements" ||
      (conn.label && conn.label.toLowerCase().includes("implement"))
    ) {
      arrow = "..|>" // Implementation
    } else if (
      conn.type === "aggregation" ||
      (conn.label && conn.label.toLowerCase().includes("aggregat"))
    ) {
      arrow = "o--" // Aggregation
    } else if (
      conn.type === "composition" ||
      (conn.label && conn.label.toLowerCase().includes("compos"))
    ) {
      arrow = "*--" // Composition
    } else if (conn.type === "association") {
      arrow = "--"
    }

    const label = conn.label ? ` : ${sanitizeLabel(conn.label)}` : ""
    content += `${fromId} ${arrow} ${toId}${label}\n`

    console.log(`🔗 Added relationship: ${fromId} ${arrow} ${toId}${label}`)
  })

  console.log("✅ Class diagram content generated:", content)
  return content
}

function parseClassStructure(node: DiagramNode): {
  name: string
  fields: Array<{ name: string; type?: string; visibility: string }>
  methods: Array<{
    name: string
    parameters: string[]
    returnType?: string
    visibility: string
  }>
} {
  const structure = {
    name: node.id,
    fields: [] as Array<{ name: string; type?: string; visibility: string }>,
    methods: [] as Array<{
      name: string
      parameters: string[]
      returnType?: string
      visibility: string
    }>,
  }

  // First, try to parse from properties if they exist
  if (node.properties) {
    if (node.properties.fields) {
      node.properties.fields.forEach((field: any) => {
        if (typeof field === "string") {
          structure.fields.push({
            name: field,
            visibility: "+",
          })
        } else {
          structure.fields.push({
            name: field.name || field,
            type: field.type,
            visibility: field.visibility || "+",
          })
        }
      })
    }

    if (node.properties.methods) {
      node.properties.methods.forEach((method: any) => {
        if (typeof method === "string") {
          structure.methods.push({
            name: method,
            parameters: [],
            visibility: "+",
          })
        } else {
          structure.methods.push({
            name: method.name || method,
            parameters: method.parameters || [],
            returnType: method.returnType,
            visibility: method.visibility || "+",
          })
        }
      })
    }
  }

  // If no properties, try to parse from label
  if (
    structure.fields.length === 0 &&
    structure.methods.length === 0 &&
    node.label
  ) {
    console.log(`🔍 Parsing label: "${node.label}"`)

    // Split by newlines and process each line
    const lines = node.label
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)

    let currentSection = "name"
    let className = lines[0] || node.id

    // Extract just the class name (before any separators)
    if (className.includes("\\n")) {
      className = className.split("\\n")[0]
    }
    structure.name = className

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Skip separators and class name
      if (line === "--" || line === className) {
        continue
      }

      // Parse methods (look for parentheses)
      if (line.includes("(") && line.includes(")")) {
        const methodMatch = line.match(/^([+\-#~])?\s*(.+?)\((.*?)\)(.*)$/)
        if (methodMatch) {
          const [, visibility = "+", methodName, params, returnType] =
            methodMatch
          const parameters = params
            ? params
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p)
            : []

          structure.methods.push({
            name: methodName.trim(),
            parameters,
            returnType: returnType
              ? returnType.replace(":", "").trim()
              : undefined,
            visibility,
          })
          console.log(
            `📝 Found method: ${methodName}(${parameters.join(", ")})`
          )
        }
      }
      // Parse fields (no parentheses)
      else if (
        line.match(/^[+\-#~]/) ||
        (!line.includes("(") && line.length > 0)
      ) {
        const fieldMatch = line.match(/^([+\-#~])?\s*(.+?)(:(.+))?$/)
        if (fieldMatch) {
          const [, visibility = "+", fieldName, , fieldType] = fieldMatch

          structure.fields.push({
            name: fieldName.trim(),
            type: fieldType ? fieldType.trim() : undefined,
            visibility,
          })
          console.log(
            `📝 Found field: ${fieldName}${fieldType ? ": " + fieldType : ""}`
          )
        }
      }
    }
  }

  return structure
}

function convertToSequenceDiagram(
  nodes: DiagramNode[],
  connections: DiagramConnection[]
): string {
  let content = ""

  // Add participants/actors
  nodes.forEach((node) => {
    const label = sanitizeLabel(node.label)
    const id = sanitizeId(node.id)

    // Determine participant type
    let participantType = "participant"
    if (node.type === "actor") {
      participantType = "actor"
    } else if (node.type === "boundary") {
      participantType = "boundary"
    } else if (node.type === "control") {
      participantType = "control"
    } else if (node.type === "entity") {
      participantType = "entity"
    } else if (node.type === "database") {
      participantType = "database"
    }

    content += `${participantType} "${label}" as ${id}\n`
  })

  content += "\n"

  // Add interactions with proper arrow types
  connections.forEach((conn) => {
    const fromId = sanitizeId(conn.from)
    const toId = sanitizeId(conn.to)
    const label = conn.label ? sanitizeLabel(conn.label) : "message"

    // Choose arrow type based on connection type
    let arrow = "->"
    if (
      conn.type === "return" ||
      (conn.label && conn.label.toLowerCase().includes("return"))
    ) {
      arrow = "-->"
    } else if (
      conn.type === "async" ||
      (conn.label && conn.label.toLowerCase().includes("async"))
    ) {
      arrow = "->>'"
    } else if (conn.type === "self") {
      arrow = "->"
    }

    content += `${fromId} ${arrow} ${toId} : ${label}\n`
  })

  return content
}

function convertToFlowchartDiagram(
  nodes: DiagramNode[],
  connections: DiagramConnection[]
): string {
  // For flowchart, we'll use activity diagram syntax as it's more flexible
  return convertToActivityDiagram(nodes, connections)
}

/**
 * Sanitizes labels for PlantUML (removes problematic characters)
 */
function sanitizeLabel(label: string): string {
  if (!label) return "Step"

  // Remove or replace problematic characters for PlantUML
  return label
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/[{}]/g, "") // Remove curly braces
    .replace(/[[\]]/g, "") // Remove square brackets
    .replace(/;/g, ",") // Replace semicolons with commas
    .replace(/\\/g, " or ") // Replace backslashes with " or "
    .replace(/\//g, " or ") // Replace forward slashes with " or "
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .trim()
}

/**
 * Sanitizes IDs for PlantUML (alphanumeric and underscores only)
 */
function sanitizeId(id: string): string {
  if (!id) return "node"

  return id
    .replace(/[^a-zA-Z0-9_]/g, "_") // Replace non-alphanumeric chars with underscores
    .replace(/^[0-9]/, "n$&") // Prefix with 'n' if starts with number
    .toLowerCase()
}

/**
 * Validates if diagram data has the minimum required structure
 */
export function validateDiagramData(data: any): data is DiagramData {
  return (
    data &&
    typeof data === "object" &&
    typeof data.type === "string" &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.connections)
  )
}

/**
 * Creates a simple fallback diagram when no data is provided
 */
export function createFallbackDiagram(title: string = "Diagram"): string {
  return `@startuml
!theme bluegray
title ${title}

start
:Processing;
stop

@enduml`
}

const plantumlAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"

// Custom encoding function
function plantumlEncode(data) {
  let res = ""
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 === data.length) {
      let b1 = data[i]
      let b2 = data[i + 1]
      res += plantumlAlphabet[b1 >> 2]
      res += plantumlAlphabet[((b1 & 0x3) << 4) | (b2 >> 4)]
      res += plantumlAlphabet[(b2 & 0xf) << 2]
    } else if (i + 1 === data.length) {
      let b1 = data[i]
      res += plantumlAlphabet[b1 >> 2]
      res += plantumlAlphabet[(b1 & 0x3) << 4]
    } else {
      let b1 = data[i]
      let b2 = data[i + 1]
      let b3 = data[i + 2]
      res += plantumlAlphabet[b1 >> 2]
      res += plantumlAlphabet[((b1 & 0x3) << 4) | (b2 >> 4)]
      res += plantumlAlphabet[((b2 & 0xf) << 2) | (b3 >> 6)]
      res += plantumlAlphabet[b3 & 0x3f]
    }
  }
  return res
}

// Compress text using pako (zlib/deflate library for JS)
export function plantumlUrl(umlText) {
  const compressed = pako.deflateRaw(new TextEncoder().encode(umlText)) // raw DEFLATE
  const encoded = plantumlEncode(compressed)
  console.log(encoded)
  return `https://www.plantuml.com/plantuml/png/${encoded}`
}
