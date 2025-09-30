// Code formatting utilities for different programming languages

/**
 * Format code based on language-specific conventions
 */
export const formatCode = (code: string, language: string): string => {
  if (!code || !code.trim()) return code

  try {
    switch (language.toLowerCase()) {
      case "javascript":
      case "typescript":
        return formatJavaScript(code)
      case "python":
        return formatPython(code)
      case "java":
        return formatJava(code)
      case "c":
      case "cpp":
      case "c++":
        return formatC(code)
      default:
        return code
    }
  } catch (error) {
    console.error("Error formatting code:", error)
    return code
  }
}

/**
 * Basic JavaScript/TypeScript formatting
 */
const formatJavaScript = (code: string): string => {
  return code
    .replace(/;\s*\n/g, ";\n") // Ensure newline after semicolons
    .replace(/\{\s*\n/g, "{\n") // Ensure newline after opening braces
    .replace(/\n\s*\}/g, "\n}") // Ensure proper closing brace formatting
    .replace(/,\s*\n/g, ",\n") // Ensure newline after commas
    .trim()
}

/**
 * Basic Python formatting
 */
const formatPython = (code: string): string => {
  return code
    .replace(/:\s*\n/g, ":\n") // Ensure newline after colons
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive blank lines
    .trim()
}

/**
 * Basic Java formatting
 */
const formatJava = (code: string): string => {
  return code
    .replace(/;\s*\n/g, ";\n")
    .replace(/\{\s*\n/g, "{\n")
    .replace(/\n\s*\}/g, "\n}")
    .trim()
}

/**
 * Basic C/C++ formatting
 */
const formatC = (code: string): string => {
  return code
    .replace(/;\s*\n/g, ";\n")
    .replace(/\{\s*\n/g, "{\n")
    .replace(/\n\s*\}/g, "\n}")
    .replace(/#include\s*</g, "#include <")
    .trim()
}

/**
 * Remove comments from code
 */
export const removeComments = (code: string, language: string): string => {
  if (!code || !code.trim()) return code

  try {
    switch (language.toLowerCase()) {
      case "javascript":
      case "typescript":
      case "java":
      case "c":
      case "cpp":
      case "c++":
        return removeJSStyleComments(code)
      case "python":
        return removePythonComments(code)
      default:
        return code
    }
  } catch (error) {
    console.error("Error removing comments:", error)
    return code
  }
}

/**
 * Remove JavaScript-style comments (//) and multi-line comments
 */
const removeJSStyleComments = (code: string): string => {
  // Remove single-line comments
  let result = code.replace(/\/\/.*$/gm, "")

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "")

  // Clean up extra whitespace
  result = result.replace(/^\s*\n/gm, "\n")

  return result.trim()
}

/**
 * Remove Python-style comments (#)
 */
const removePythonComments = (code: string): string => {
  // Remove comments but preserve strings that might contain #
  const lines = code.split("\n")
  const cleanLines = lines.map((line) => {
    // Simple comment removal (doesn't handle # in strings)
    const commentIndex = line.indexOf("#")
    if (commentIndex !== -1) {
      return line.substring(0, commentIndex).trimEnd()
    }
    return line
  })

  return cleanLines.join("\n").trim()
}

/**
 * Add proper indentation to code
 */
export const addIndentation = (
  code: string,
  language: string,
  spaces: number = 2
): string => {
  if (!code || !code.trim()) return code

  const lines = code.split("\n")
  let indentLevel = 0
  const indentChar = " ".repeat(spaces)

  const indentedLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ""

    // Decrease indent for closing braces/brackets
    if (isClosingLine(trimmed, language)) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    const indentedLine = indentChar.repeat(indentLevel) + trimmed

    // Increase indent for opening braces/brackets
    if (isOpeningLine(trimmed, language)) {
      indentLevel++
    }

    return indentedLine
  })

  return indentedLines.join("\n")
}

/**
 * Check if line contains opening characters that increase indentation
 */
const isOpeningLine = (line: string, language: string): boolean => {
  switch (language.toLowerCase()) {
    case "python":
      return line.endsWith(":")
    case "javascript":
    case "typescript":
    case "java":
    case "c":
    case "cpp":
    case "c++":
      return line.includes("{") && !line.includes("}")
    default:
      return false
  }
}

/**
 * Check if line contains closing characters that decrease indentation
 */
const isClosingLine = (line: string, language: string): boolean => {
  switch (language.toLowerCase()) {
    case "javascript":
    case "typescript":
    case "java":
    case "c":
    case "cpp":
    case "c++":
      return (
        line.startsWith("}") || line.startsWith("]") || line.startsWith(")")
      )
    default:
      return false
  }
}

/**
 * Validate if code has proper syntax structure
 */
export const validateCodeStructure = (
  code: string,
  language: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!code || !code.trim()) {
    return { isValid: true, errors: [] }
  }

  // Basic bracket matching
  const brackets = { "{": "}", "[": "]", "(": ")" }
  const stack: string[] = []

  for (const char of code) {
    if (Object.keys(brackets).includes(char)) {
      stack.push(char)
    } else if (Object.values(brackets).includes(char)) {
      const lastOpening = stack.pop()
      if (!lastOpening || brackets[lastOpening] !== char) {
        errors.push(`Mismatched bracket: ${char}`)
      }
    }
  }

  if (stack.length > 0) {
    errors.push(`Unclosed brackets: ${stack.join(", ")}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
