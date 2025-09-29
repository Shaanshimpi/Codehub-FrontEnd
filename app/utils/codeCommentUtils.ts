// Code Comment Utilities for Exercise System
// Handles comment removal and code cleaning across different programming languages

export interface CommentConfig {
  singleLine: string[]
  multiLine?: {
    start: string
    end: string
  }[]
}

// Language-specific comment configurations
export const LANGUAGE_COMMENT_CONFIGS: Record<string, CommentConfig> = {
  javascript: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  typescript: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  java: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  cpp: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  c: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  python: {
    singleLine: ["#"],
    multiLine: [
      { start: '"""', end: '"""' },
      { start: "'''", end: "'''" },
    ],
  },
  go: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  rust: {
    singleLine: ["//"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
  php: {
    singleLine: ["//", "#"],
    multiLine: [{ start: "/*", end: "*/" }],
  },
}

/**
 * Remove all comments from code while preserving string literals
 */
export const removeComments = (code: string, language: string): string => {
  if (!code?.trim()) return code

  const config = LANGUAGE_COMMENT_CONFIGS[language.toLowerCase()]
  if (!config) return code

  let result = code

  // Remove single-line comments
  for (const commentStart of config.singleLine) {
    // Regex to match single-line comments but not inside strings
    const regex = new RegExp(
      `(?<!["'\`])\\s*${escapeRegex(commentStart)}.*?(?=\\n|$)`,
      "gm"
    )
    result = result.replace(regex, "")
  }

  // Remove multi-line comments
  if (config.multiLine) {
    for (const { start, end } of config.multiLine) {
      const regex = new RegExp(
        `${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`,
        "g"
      )
      result = result.replace(regex, "")
    }
  }

  // Clean up extra whitespace while preserving code structure
  result = result
    .split("\n")
    .map((line) => line.trimRight())
    .filter((line, index, arr) => {
      // Remove empty lines only if they're not part of code structure
      if (line.trim() === "") {
        // Keep empty line if it's between code blocks
        const prevLine = arr[index - 1]?.trim()
        const nextLine = arr[index + 1]?.trim()
        return (
          prevLine &&
          nextLine &&
          (prevLine.endsWith("{") || nextLine.startsWith("}"))
        )
      }
      return true
    })
    .join("\n")

  return result
}

/**
 * Remove only instructional comments (numbered comments like [1], [2])
 */
export const removeInstructionalComments = (
  code: string,
  language: string
): string => {
  if (!code?.trim()) return code

  const config = LANGUAGE_COMMENT_CONFIGS[language.toLowerCase()]
  if (!config) return code

  let result = code

  // Remove instructional comments with numbered references
  for (const commentStart of config.singleLine) {
    // Match comments that contain [number] patterns
    const regex = new RegExp(
      `(?<!["'\`])\\s*${escapeRegex(commentStart)}\\s*\\[\\d+\\].*?(?=\\n|$)`,
      "gm"
    )
    result = result.replace(regex, "")
  }

  // Clean up extra whitespace
  result = result
    .split("\n")
    .map((line) => line.trimRight())
    .filter((line) => line.trim() !== "")
    .join("\n")

  return result
}

/**
 * Extract all comments from code
 */
export const extractComments = (code: string, language: string): string[] => {
  if (!code?.trim()) return []

  const config = LANGUAGE_COMMENT_CONFIGS[language.toLowerCase()]
  if (!config) return []

  const comments: string[] = []

  // Extract single-line comments
  for (const commentStart of config.singleLine) {
    const regex = new RegExp(
      `(?<!["'\`])\\s*${escapeRegex(commentStart)}\\s*(.*)`,
      "gm"
    )
    let match
    while ((match = regex.exec(code)) !== null) {
      const comment = match[1].trim()
      if (comment) comments.push(comment)
    }
  }

  // Extract multi-line comments
  if (config.multiLine) {
    for (const { start, end } of config.multiLine) {
      const regex = new RegExp(
        `${escapeRegex(start)}([\\s\\S]*?)${escapeRegex(end)}`,
        "g"
      )
      let match
      while ((match = regex.exec(code)) !== null) {
        const comment = match[1].trim()
        if (comment) comments.push(comment)
      }
    }
  }

  return comments
}

/**
 * Highlight code references like [1], [2] in comments
 */
export const highlightCodeReferences = (text: string): string => {
  return text.replace(/\[(\d+)\]/g, '<span class="code-ref">[$1]</span>')
}

/**
 * Check if code contains instructional comments
 */
export const hasInstructionalComments = (
  code: string,
  language: string
): boolean => {
  if (!code?.trim()) return false

  const config = LANGUAGE_COMMENT_CONFIGS[language.toLowerCase()]
  if (!config) return false

  for (const commentStart of config.singleLine) {
    const regex = new RegExp(`${escapeRegex(commentStart)}\\s*\\[\\d+\\]`, "gm")
    if (regex.test(code)) return true
  }

  return false
}

/**
 * Get code statistics
 */
export const getCodeStats = (code: string, language: string) => {
  const lines = code.split("\n")
  const comments = extractComments(code, language)
  const codeWithoutComments = removeComments(code, language)
  const codeLines = codeWithoutComments
    .split("\n")
    .filter((line) => line.trim()).length

  return {
    totalLines: lines.length,
    codeLines,
    commentLines: comments.length,
    emptyLines: lines.length - codeLines - comments.length,
    hasInstructionalComments: hasInstructionalComments(code, language),
  }
}

/**
 * Utility function to escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Format code for display (add syntax highlighting classes)
 */
export const formatCodeForDisplay = (
  code: string,
  language: string
): string => {
  // This is a placeholder for syntax highlighting
  // In a real implementation, you might use a library like Prism.js or highlight.js
  return code
}

/**
 * Validate if code is syntactically correct (basic check)
 */
export const isValidCode = (code: string, language: string): boolean => {
  try {
    // Basic validation - check for balanced brackets
    const brackets = { "(": ")", "[": "]", "{": "}" }
    const stack: string[] = []

    for (const char of code) {
      if (char in brackets) {
        stack.push(brackets[char as keyof typeof brackets])
      } else if (Object.values(brackets).includes(char)) {
        if (stack.pop() !== char) return false
      }
    }

    return stack.length === 0
  } catch {
    return false
  }
}
