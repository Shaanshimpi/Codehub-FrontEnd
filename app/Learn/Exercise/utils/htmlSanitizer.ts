// HTML sanitization utilities to prevent XSS attacks
// This provides safe alternatives to dangerouslySetInnerHTML

/**
 * List of allowed HTML tags for content rendering
 */
const ALLOWED_TAGS = [
  "span",
  "div",
  "p",
  "br",
  "strong",
  "em",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]

/**
 * List of allowed HTML attributes
 */
const ALLOWED_ATTRIBUTES = ["class", "className", "style", "id", "data-*"]

/**
 * Allowed CSS properties for style attributes
 */
const ALLOWED_STYLES = [
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "text-align",
  "margin",
  "padding",
  "border",
  "border-radius",
]

/**
 * Sanitize HTML content by removing potentially dangerous elements
 * This is a basic implementation - in production, use a library like DOMPurify
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== "string") {
    return ""
  }

  // Remove script tags and their content
  let sanitized = html.replace(/<script[^>]*>.*?<\/script>/gi, "")

  // Remove event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")

  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, "")

  // Remove data: protocols (except for safe data URLs)
  sanitized = sanitized.replace(
    /data:(?!image\/[png|jpg|jpeg|gif|svg|webp])/gi,
    ""
  )

  // Remove style attributes with potentially dangerous content
  sanitized = sanitized.replace(/style\s*=\s*["'][^"']*["']/gi, (match) => {
    const styleContent = match.match(/["']([^"']*)["']/)?.[1] || ""
    const allowedStyleContent = styleContent
      .split(";")
      .filter((style) => {
        const property = style.split(":")[0]?.trim()
        return (
          property &&
          ALLOWED_STYLES.some(
            (allowed) => property.startsWith(allowed) || allowed.includes("*")
          )
        )
      })
      .join(";")

    return allowedStyleContent ? `style="${allowedStyleContent}"` : ""
  })

  return sanitized
}

/**
 * Parse text and safely render reference numbers like [1], [2] etc.
 */
export const parseTextWithReferences = (
  text: string
): Array<{
  type: "text" | "reference"
  content: string
  number?: number
}> => {
  if (!text) return []

  const parts: Array<{
    type: "text" | "reference"
    content: string
    number?: number
  }> = []
  const regex = /\[(\d+)\]/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the reference
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      })
    }

    // Add the reference
    parts.push({
      type: "reference",
      content: match[0],
      number: parseInt(match[1], 10),
    })

    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    })
  }

  return parts
}

/**
 * Safely format code with basic syntax highlighting
 * Returns structured data instead of HTML strings
 */
export const parseCodeWithHighlighting = (
  code: string,
  language?: string
): Array<{
  lineNumber: number
  content: string
  isComment: boolean
  hasReference: boolean
  references?: number[]
}> => {
  if (!code) return []

  return code.split("\n").map((line, index) => {
    const trimmedLine = line.trim()
    const isComment =
      trimmedLine.startsWith("//") ||
      trimmedLine.startsWith("#") ||
      trimmedLine.startsWith("/*")

    // Extract reference numbers from comments
    const referenceMatches = line.match(/\[(\d+)\]/g)
    const references = referenceMatches?.map((match) =>
      parseInt(match.slice(1, -1), 10)
    )

    return {
      lineNumber: index + 1,
      content: line,
      isComment,
      hasReference: !!references?.length,
      references,
    }
  })
}

/**
 * Validate that content is safe for rendering
 */
export const validateSafeContent = (
  content: string
): {
  isSafe: boolean
  issues: string[]
} => {
  const issues: string[] = []

  if (!content) {
    return { isSafe: true, issues: [] }
  }

  // Check for script tags
  if (/<script/i.test(content)) {
    issues.push("Contains script tags")
  }

  // Check for event handlers
  if (/\s*on\w+\s*=/i.test(content)) {
    issues.push("Contains event handlers")
  }

  // Check for javascript: protocols
  if (/javascript:/i.test(content)) {
    issues.push("Contains javascript: protocol")
  }

  // Check for suspicious data URLs
  if (/data:(?!image\/)/i.test(content)) {
    issues.push("Contains suspicious data URLs")
  }

  return {
    isSafe: issues.length === 0,
    issues,
  }
}

/**
 * Clean and normalize text content
 */
export const cleanText = (text: string): string => {
  if (!text || typeof text !== "string") {
    return ""
  }

  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim()
}

/**
 * Escape HTML entities to prevent XSS
 */
export const escapeHTML = (text: string): string => {
  if (!text || typeof text !== "string") {
    return ""
  }

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * Check if content requires sanitization
 */
export const needsSanitization = (content: string): boolean => {
  if (!content) return false

  return (
    /<[^>]*>/g.test(content) || // Contains HTML tags
    /&\w+;/g.test(content) || // Contains HTML entities
    /javascript:/i.test(content)
  ) // Contains javascript protocol
}
