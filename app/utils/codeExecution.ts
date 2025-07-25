// app/utils/codeExecution.ts

interface CodeExecutionRequest {
  code: string
  language: string
  input?: string
}

interface CodeExecutionResponse {
  success: boolean
  output: string
  error?: string
  stderr?: string
  executionTime?: number
}

// OneCompiler API response format
interface OneCompilerResponse {
  stdout?: string
  stderr?: string
  exception?: string
  status?: string
  executionTime?: string
  memory?: string
}

/**
 * Execute code using the existing /api/run-code endpoint (OneCompiler)
 */
export async function executeCode({
  code,
  language,
  input = "",
}: CodeExecutionRequest): Promise<CodeExecutionResponse> {
  try {
    const response = await fetch("/api/run-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: normalizeLanguage(language),
        stdin: input.trim(),
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code.trim(),
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result: OneCompilerResponse = await response.json()

    // Handle OneCompiler response format
    // Show stderr/exception as output even if there's also stdout
    if (result.stderr || result.exception) {
      // Code had compilation or runtime errors
      return {
        success: false,
        output: result.stdout || "",
        error: result.exception || result.stderr || "Execution failed",
        stderr: result.stderr,
        executionTime: result.executionTime
          ? parseFloat(result.executionTime)
          : undefined,
      }
    } else if (result.status === "success" || result.stdout) {
      // Code executed successfully
      return {
        success: true,
        output: result.stdout || "",
        executionTime: result.executionTime
          ? parseFloat(result.executionTime)
          : undefined,
      }
    } else {
      // No output and no explicit errors
      return {
        success: false,
        output: "",
        error: "No output generated",
        stderr: result.stderr,
      }
    }
  } catch (error) {
    console.error("Code execution failed:", error)

    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

/**
 * Normalize language slugs to match your existing langMap
 */
function normalizeLanguage(languageSlug: string): string {
  // Import and use your existing langMap
  const langMap: Record<string, string> = {
    javascript: "javascript",
    python: "python",
    cpp: "cpp",
    java: "java",
    "c programming": "c",
    "c-programming": "c",
    c: "c",
    "c++": "cpp",
    "c#": "csharp",
    csharp: "csharp",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "rb",
    swift: "swift",
    kotlin: "kt",
    scala: "scala",
    typescript: "ts",
    html: "html",
    nodejs: "js",
  }

  return langMap[languageSlug.toLowerCase()] || languageSlug.toLowerCase()
}

/**
 * Get appropriate file extension for language using your existing extMap
 */
export function getFileExtension(languageSlug: string): string {
  const extMap: Record<string, string> = {
    javascript: "js",
    python: "py",
    cpp: "cpp",
    java: "java",
    "c programming": "c",
    "c-programming": "c",
    c: "c",
    csharp: "cs",
    go: "go",
    rust: "rs",
    php: "php",
    rb: "rb",
    swift: "swift",
    kt: "kt",
    scala: "scala",
    ts: "ts",
    html: "html",
    js: "js",
  }

  const normalizedLang = normalizeLanguage(languageSlug)
  return extMap[normalizedLang] || "txt"
}

/**
 * Check if language supports input
 */
export function supportsInput(languageSlug: string): boolean {
  const supportedLanguages = [
    "c",
    "c-programming",
    "cpp",
    "c++",
    "java",
    "python",
  ]
  return supportedLanguages.includes(languageSlug.toLowerCase())
}

/**
 * Get example input for language (for testing)
 */
export function getExampleInput(languageSlug: string): string {
  const exampleInputs: Record<string, string> = {
    c: "42\nHello World",
    "c-programming": "42\nHello World",
    cpp: "42\nHello World",
    "c++": "42\nHello World",
    java: "42\nHello World",
    python: "42\nHello World",
    javascript: "",
    typescript: "",
  }

  return exampleInputs[languageSlug.toLowerCase()] || ""
}
