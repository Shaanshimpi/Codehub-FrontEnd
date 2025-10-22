/**
 * Helper functions for processing and rendering tutorial content
 */

/**
 * Extract and format mermaid diagram code
 */
export const extractMermaidCode = (
  mermaidData: Array<{ code: string } | string> | undefined
): string | null => {
  if (!mermaidData || mermaidData.length === 0) return null

  const firstItem = mermaidData[0]
  return typeof firstItem === "string" ? firstItem : firstItem.code
}

/**
 * Process code examples for display
 */
export const processCodeExample = (
  code: string,
  language: string = "javascript"
) => {
  // JSON parsing already handles escape sequences correctly
  // No need to process further - display code as-is
  const formattedCode = code

  return {
    formatted: formattedCode,
    language: language.toLowerCase(),
    lineCount: formattedCode.split("\n").length,
    hasMultipleLines: formattedCode.includes("\n"),
  }
}

/**
 * Extract key points from various formats
 */
export const extractKeyPoints = (
  keyPoints: Array<{ point: string } | string> | undefined
): string[] => {
  if (!keyPoints) return []

  return keyPoints.map((point) =>
    typeof point === "string" ? point : point.point
  )
}

/**
 * Process learning objectives
 */
export const extractLearningObjectives = (
  objectives: Array<{ objective: string } | string> | undefined
): string[] => {
  if (!objectives) return []

  return objectives.map((obj) =>
    typeof obj === "string" ? obj : obj.objective
  )
}

/**
 * Generate reading time estimate
 */
export const estimateReadingTime = (content: {
  explanation?: string
  keyPoints?: any[]
  codeExamples?: any[]
  practiceHints?: any[]
}): { minutes: number; words: number } => {
  let totalWords = 0

  // Count words in explanation
  if (content.explanation) {
    totalWords += content.explanation.split(/\s+/).length
  }

  // Count words in key points
  if (content.keyPoints) {
    content.keyPoints.forEach((point) => {
      const text = typeof point === "string" ? point : point.point || ""
      totalWords += text.split(/\s+/).length
    })
  }

  // Count words in code examples (comments and explanations)
  if (content.codeExamples) {
    content.codeExamples.forEach((example) => {
      if (example.explanation) {
        totalWords += example.explanation.split(/\s+/).length
      }
      // Code is read slower, so count it with reduced weight
      if (example.code) {
        totalWords += Math.floor(example.code.split(/\s+/).length * 0.5)
      }
    })
  }

  // Count words in practice hints
  if (content.practiceHints) {
    content.practiceHints.forEach((hint) => {
      const text = typeof hint === "string" ? hint : hint.hint || ""
      totalWords += text.split(/\s+/).length
    })
  }

  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(totalWords / 200)

  return { minutes: Math.max(1, minutes), words: totalWords }
}

/**
 * Sanitize and format text content
 */
export const sanitizeContent = (content: string): string => {
  return content
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

/**
 * Check if content has interactive elements
 */
export const analyzeContentComplexity = (
  lessonContent: any
): {
  hasCode: boolean
  hasDiagrams: boolean
  hasInteractivity: boolean
  complexity: "simple" | "medium" | "complex"
} => {
  const hasCode = !!(
    lessonContent.codeExamples?.length > 0 ||
    lessonContent.codeSnippet ||
    lessonContent.codeTemplate
  )

  const hasDiagrams = !!(
    lessonContent.mermaid_code || lessonContent.diagram_data
  )

  const hasInteractivity = !!(
    lessonContent.questions?.length > 0 ||
    lessonContent.blanks?.length > 0 ||
    lessonContent.codeBlocks?.length > 0
  )

  let complexity: "simple" | "medium" | "complex" = "simple"

  if (hasCode && hasDiagrams && hasInteractivity) {
    complexity = "complex"
  } else if (
    (hasCode && hasInteractivity) ||
    (hasDiagrams && hasInteractivity)
  ) {
    complexity = "medium"
  }

  return {
    hasCode,
    hasDiagrams,
    hasInteractivity,
    complexity,
  }
}

/**
 * Generate content preview for lesson cards
 */
export const generateContentPreview = (
  lessonContent: any,
  maxLength: number = 100
): string => {
  let preview = ""

  if (lessonContent.explanation) {
    preview = lessonContent.explanation
  } else if (lessonContent.questions && lessonContent.questions[0]) {
    preview = lessonContent.questions[0].question || ""
  } else if (lessonContent.scenario) {
    preview = lessonContent.scenario
  } else {
    preview = "Interactive lesson content"
  }

  if (preview.length > maxLength) {
    preview = preview.substring(0, maxLength - 3) + "..."
  }

  return sanitizeContent(preview)
}
