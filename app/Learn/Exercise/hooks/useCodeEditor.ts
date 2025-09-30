// Custom hook for managing code editor state and operations
import { useCallback, useEffect, useRef, useState } from "react"
import { formatCode, validateCodeStructure } from "../utils/codeFormatter"

interface UseCodeEditorProps {
  initialCode?: string
  language: string
  onChange?: (code: string) => void
  onRun?: (code: string) => void
}

interface UseCodeEditorReturn {
  code: string
  output: string
  isRunning: boolean
  fontSize: number
  showLineNumbers: boolean
  isEditorReady: boolean
  errors: string[]
  setCode: (code: string) => void
  runCode: () => void
  formatCode: () => void
  resetCode: () => void
  setOutput: (output: string) => void
  setFontSize: (size: number) => void
  toggleLineNumbers: () => void
  copyCode: () => Promise<boolean>
  validateCode: () => { isValid: boolean; errors: string[] }
  editorRef: React.MutableRefObject<any>
}

/**
 * Custom hook for managing Monaco code editor state and operations
 */
export const useCodeEditor = ({
  initialCode = "",
  language,
  onChange,
  onRun,
}: UseCodeEditorProps): UseCodeEditorReturn => {
  const [code, setCodeState] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const editorRef = useRef<any>(null)

  // Handle code changes
  const setCode = useCallback(
    (newCode: string) => {
      setCodeState(newCode)
      onChange?.(newCode)

      // Validate code structure
      const validation = validateCodeStructure(newCode, language)
      setErrors(validation.errors)
    },
    [onChange, language]
  )

  // Run code with loading state
  const runCode = useCallback(async () => {
    if (!code.trim() || isRunning) return

    setIsRunning(true)
    setOutput("")
    setErrors([])

    try {
      // Call the parent's onRun callback
      onRun?.(code)
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, onRun])

  // Format code using language-specific formatting
  const formatCodeContent = useCallback(() => {
    if (code.trim()) {
      const formatted = formatCode(code, language)
      setCode(formatted)
    }
  }, [code, language, setCode])

  // Reset code to initial state
  const resetCode = useCallback(() => {
    setCode(initialCode)
    setOutput("")
    setErrors([])
  }, [initialCode, setCode])

  // Font size controls
  const updateFontSize = useCallback((size: number) => {
    const clampedSize = Math.min(Math.max(size, 10), 24)
    setFontSize(clampedSize)
  }, [])

  // Toggle line numbers
  const toggleLineNumbers = useCallback(() => {
    setShowLineNumbers((prev) => !prev)
  }, [])

  // Copy code to clipboard
  const copyCode = useCallback(async (): Promise<boolean> => {
    if (!code) return false

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.select()
        const success = document.execCommand("copy")
        document.body.removeChild(textArea)
        return success
      }
    } catch (error) {
      console.error("Failed to copy code:", error)
      return false
    }
  }, [code])

  // Validate code structure
  const validateCode = useCallback(() => {
    return validateCodeStructure(code, language)
  }, [code, language])

  // Update code when initialCode changes
  useEffect(() => {
    if (initialCode !== code) {
      setCodeState(initialCode)
    }
  }, [initialCode]) // Intentionally omit 'code' to prevent loops

  return {
    code,
    output,
    isRunning,
    fontSize,
    showLineNumbers,
    isEditorReady,
    errors,
    setCode,
    runCode,
    formatCode: formatCodeContent,
    resetCode,
    setOutput,
    setFontSize: updateFontSize,
    toggleLineNumbers,
    copyCode,
    validateCode,
    editorRef,
  }
}

/**
 * Hook for managing Monaco editor configuration
 */
export const useMonacoConfig = (language: string) => {
  const getMonacoLanguage = useCallback(() => {
    switch (language.toLowerCase()) {
      case "c-programming":
      case "c":
        return "c"
      case "cpp":
      case "c++":
        return "cpp"
      case "java":
        return "java"
      case "python":
        return "python"
      case "javascript":
        return "javascript"
      case "typescript":
        return "typescript"
      case "html":
        return "html"
      case "css":
        return "css"
      case "json":
        return "json"
      case "sql":
        return "sql"
      default:
        return "plaintext"
    }
  }, [language])

  const getFileExtension = useCallback(() => {
    switch (language.toLowerCase()) {
      case "c-programming":
      case "c":
        return ".c"
      case "cpp":
      case "c++":
        return ".cpp"
      case "java":
        return ".java"
      case "python":
        return ".py"
      case "javascript":
        return ".js"
      case "typescript":
        return ".ts"
      case "html":
        return ".html"
      case "css":
        return ".css"
      case "json":
        return ".json"
      case "sql":
        return ".sql"
      default:
        return ".txt"
    }
  }, [language])

  const getBoilerplate = useCallback(() => {
    switch (language.toLowerCase()) {
      case "c-programming":
      case "c":
        return `#include <stdio.h>\n\nint main() {\n    // TODO: Write your solution here\n    \n    return 0;\n}`
      case "cpp":
      case "c++":
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // TODO: Write your solution here\n    \n    return 0;\n}`
      case "java":
        return `public class Solution {\n    public static void main(String[] args) {\n        // TODO: Write your solution here\n        \n    }\n}`
      case "python":
        return `# TODO: Write your solution here\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`
      case "javascript":
        return `// TODO: Write your solution here\n\nfunction main() {\n    \n}\n\nmain();`
      case "typescript":
        return `// TODO: Write your solution here\n\nfunction main(): void {\n    \n}\n\nmain();`
      default:
        return "// TODO: Write your solution here"
    }
  }, [language])

  return {
    getMonacoLanguage,
    getFileExtension,
    getBoilerplate,
  }
}

/**
 * Hook for managing editor themes and appearance
 */
export const useEditorTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [customSettings, setCustomSettings] = useState({
    minimap: false,
    wordWrap: true,
    bracketPairColorization: true,
    smoothScrolling: true,
  })

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [])

  const updateSetting = useCallback((key: string, value: any) => {
    setCustomSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  return {
    theme,
    setTheme,
    toggleTheme,
    customSettings,
    updateSetting,
  }
}

/**
 * Hook for code execution with enhanced error handling
 */
export const useCodeExecution = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState("")
  const [executionHistory, setExecutionHistory] = useState<string[]>([])

  const executeCode = useCallback(
    async (code: string, language: string, input?: string) => {
      if (!code.trim() || isRunning) return

      setIsRunning(true)
      setOutput("")

      try {
        // This would be replaced with actual code execution logic
        const mockResult = {
          success: true,
          output: `Mock execution output for ${language}\nCode: ${code.slice(0, 50)}...`,
          executionTime: Math.random() * 1000,
        }

        if (mockResult.success) {
          let outputText = mockResult.output
          if (mockResult.executionTime) {
            outputText += `\n\n─────────────────────\nExecution time: ${mockResult.executionTime.toFixed(0)}ms`
          }
          setOutput(outputText)
          setExecutionHistory((prev) => [outputText, ...prev.slice(0, 9)]) // Keep last 10
        } else {
          setOutput("❌ Execution Failed\n\nCheck your code and try again.")
        }
      } catch (error) {
        setOutput(
          `❌ Network Error\n\nFailed to execute code: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      } finally {
        setIsRunning(false)
      }
    },
    [isRunning]
  )

  const clearOutput = useCallback(() => {
    setOutput("")
  }, [])

  const clearHistory = useCallback(() => {
    setExecutionHistory([])
  }, [])

  return {
    isRunning,
    output,
    executionHistory,
    executeCode,
    clearOutput,
    clearHistory,
    setOutput,
  }
}
