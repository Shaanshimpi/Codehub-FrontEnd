// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/UnifiedCodeEditor.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { executeCode, supportsInput } from "@/app/utils/codeExecution"
import { Editor } from "@monaco-editor/react"
import {
  Code2,
  Copy,
  Minus,
  Play,
  Plus,
  RefreshCcw,
  RotateCcw,
  Settings,
  Terminal,
} from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/UnifiedCodeEditor.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/UnifiedCodeEditor.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/UnifiedCodeEditor.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/UnifiedCodeEditor.tsx

interface UnifiedCodeEditorProps {
  exercise: any
  language: any
  code: string
  onCodeChange?: (code: string) => void
  onLoadBoilerplate?: () => void
  onRunCode?: () => void
  isBoilerplateLoaded?: boolean
  onBoilerplateStatusChange?: (loaded: boolean) => void
  mode?: "problem" | "solution"
  isReadOnly?: boolean
}

const UnifiedCodeEditor: React.FC<UnifiedCodeEditorProps> = ({
  exercise,
  language,
  code,
  onCodeChange,
  onLoadBoilerplate,
  onRunCode,
  isBoilerplateLoaded = false,
  onBoilerplateStatusChange,
  mode = "problem",
  isReadOnly = false,
}) => {
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState("")
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [editorFontSize, setEditorFontSize] = useState(14)
  const [outputFontSize, setOutputFontSize] = useState(12)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)
  const [showBoilerplatePreview, setShowBoilerplatePreview] = useState(false)
  const [previewTimeout, setPreviewTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [showInstructions, setShowInstructions] = useState(false)
  const [showPreviewSuccess, setShowPreviewSuccess] = useState(false)
  const [userCodeBackup, setUserCodeBackup] = useState<string>("")
  const editorRef = useRef<any>(null)

  // Local state to track if boilerplate was loaded in this session (problem mode only)
  const [localBoilerplateLoaded, setLocalBoilerplateLoaded] =
    useState(isBoilerplateLoaded)

  // Update local state when prop changes
  useEffect(() => {
    setLocalBoilerplateLoaded(isBoilerplateLoaded)
  }, [isBoilerplateLoaded])

  const handleRunCode = async () => {
    if (!code.trim() || isRunning) return

    setIsRunning(true)
    setOutput("")

    try {
      const result = await executeCode({
        code,
        language: language.slug,
        input: input,
      })

      if (result.success) {
        let outputText = result.output

        // Add execution info if available
        if (result.executionTime) {
          outputText += `\n\n─────────────────────\nExecution time: ${result.executionTime}ms`
        }

        setOutput(outputText)

        // Call parent callback for progress tracking
        if (onRunCode) onRunCode()
      } else {
        // Handle execution errors
        let errorText = "❌ Execution Failed\n\n"

        if (result.error) {
          errorText += `Error: ${result.error}\n`
        }

        if (result.stderr) {
          errorText += `\nDetails:\n${result.stderr}`
        }

        setOutput(errorText)
      }
    } catch (error) {
      setOutput(
        `❌ Network Error\n\nFailed to execute code: ${error instanceof Error ? error.message : "Unknown error"}\n\nPlease check your connection and try again.`
      )
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopyCode = () => {
    if (code) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
          .catch((error) => {
            console.error("Failed to copy code:", error)
          })
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleResetCode = () => {
    if (onCodeChange) onCodeChange("") // Clear the code
    if (mode === "problem") {
      setLocalBoilerplateLoaded(false) // Reset boilerplate status locally
      // Notify parent component about boilerplate status change
      if (onBoilerplateStatusChange) {
        onBoilerplateStatusChange(false)
      }
    }
    setOutput("") // Clear output
  }

  const handleLoadBoilerplate = () => {
    if (isInitialLoad) {
      // Initial load: Backup current user code before showing boilerplate
      setUserCodeBackup(code)

      // Load CLEAN boilerplate (without comments) by default
      if (exercise.boilerplate_code) {
        const cleanBoilerplate = removeComments(exercise.boilerplate_code)
        if (onCodeChange) onCodeChange(cleanBoilerplate)
      } else {
        // Generate clean boilerplate based on language
        const boilerplate = getBoilerplateCode()
        const cleanBoilerplate = removeComments(boilerplate)
        if (onCodeChange) onCodeChange(cleanBoilerplate)
      }
      setLocalBoilerplateLoaded(true)
      if (onBoilerplateStatusChange) {
        onBoilerplateStatusChange(true)
      }

      // Show success message after loading clean code
      setShowInstructions(true)
      setTimeout(() => setShowInstructions(false), 4000) // Hide after 4 seconds
    } else {
      // After boilerplate is loaded: Show another clean preview temporarily
      setUserCodeBackup(code)

      // Show clean version again
      if (exercise.boilerplate_code) {
        const cleanBoilerplate = removeComments(exercise.boilerplate_code)
        if (onCodeChange) onCodeChange(cleanBoilerplate)
      } else {
        const boilerplate = getBoilerplateCode()
        const cleanBoilerplate = removeComments(boilerplate)
        if (onCodeChange) onCodeChange(cleanBoilerplate)
      }

      // Show preview success message
      setShowPreviewSuccess(true)
      setTimeout(() => setShowPreviewSuccess(false), 3000)

      // Auto-restore after 3 seconds
      setTimeout(() => {
        if (userCodeBackup && onCodeChange) {
          onCodeChange(userCodeBackup)
        }
      }, 3000)
    }
  }

  const handlePreviewStart = () => {
    if (exercise.boilerplate_code || !shouldShowLoadButton) {
      setShowBoilerplatePreview(true)
      const timeout = setTimeout(() => {
        setShowBoilerplatePreview(false)
        // Restore user code when preview ends
        if (userCodeBackup && onCodeChange) {
          onCodeChange(userCodeBackup)
        }
      }, 3000) // Show for 3 seconds
      setPreviewTimeout(timeout)
    }
  }

  const handlePreviewEnd = () => {
    if (previewTimeout) {
      clearTimeout(previewTimeout)
      setPreviewTimeout(null)
    }
    setShowBoilerplatePreview(false)

    // Restore user code when preview ends
    if (userCodeBackup && onCodeChange) {
      onCodeChange(userCodeBackup)
    }
  }

  const getBoilerplateCode = () => {
    // If exercise has specific boilerplate, use it
    if (exercise.boilerplate_code) {
      return exercise.boilerplate_code
    }

    // Otherwise generate based on language
    switch (language.slug) {
      case "c-programming":
      case "c":
        return `#include <stdio.h>

int main() {
    // TODO: Write your solution here

    return 0;
}`
      case "cpp":
      case "c++":
        return `#include <iostream>
using namespace std;

int main() {
    // TODO: Write your solution here

    return 0;
}`
      case "java":
        return `public class Solution {
    public static void main(String[] args) {
        // TODO: Write your solution here

    }
}`
      case "python":
        return `# TODO: Write your solution here

def main():
    pass

if __name__ == "__main__":
    main()`
      case "javascript":
        return `// TODO: Write your solution here

function main() {

}

main();`
      case "typescript":
        return `// TODO: Write your solution here

function main(): void {

}

main();`
      default:
        return `// TODO: Write your solution here`
    }
  }

  const getMonacoLanguage = () => {
    switch (language.slug) {
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
  }

  const getLanguageFileExtension = () => {
    switch (language.slug) {
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
      default:
        return ".txt"
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save shortcut pressed
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (code.trim() && !isReadOnly && !isRunning) {
        handleRunCode()
      }
    })

    // Focus the editor if not read-only
    if (!isReadOnly) {
      editor.focus()
    }
  }

  const adjustEditorFontSize = (delta: number) => {
    setEditorFontSize((size) => Math.min(30, Math.max(10, size + delta)))
  }

  const adjustOutputFontSize = (delta: number) => {
    setOutputFontSize((size) => Math.min(24, Math.max(10, size + delta)))
  }

  const resetZoom = () => {
    setEditorFontSize(14)
    setOutputFontSize(12)
  }

  // Clean code functionality - removes comments based on language
  const removeComments = (code: string) => {
    if (!code) return code

    const lang = language.slug
    let cleanCode = code

    try {
      switch (lang) {
        case "javascript":
        case "typescript":
        case "java":
        case "c":
        case "c-programming":
        case "cpp":
        case "c++":
          // Remove single-line comments (//)
          cleanCode = cleanCode.replace(/\/\/.*$/gm, "")
          // Remove multi-line comments (/* */)
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
          break
        case "python":
          // Remove single-line comments (#)
          cleanCode = cleanCode.replace(/#.*$/gm, "")
          // Remove multi-line strings used as comments (""" or ''')
          cleanCode = cleanCode.replace(/"""[\s\S]*?"""/g, "")
          cleanCode = cleanCode.replace(/'''[\s\S]*?'''/g, "")
          break
        case "html":
          // Remove HTML comments
          cleanCode = cleanCode.replace(/<!--[\s\S]*?-->/g, "")
          break
        case "css":
          // Remove CSS comments
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
          break
        case "sql":
          // Remove SQL comments
          cleanCode = cleanCode.replace(/--.*$/gm, "")
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
          break
        default:
          // Default: remove // and /* */ style comments
          cleanCode = cleanCode.replace(/\/\/.*$/gm, "")
          cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, "")
      }

      // Clean up extra whitespace but preserve basic formatting
      cleanCode = cleanCode
        .replace(/\n\s*\n\s*\n/g, "\n\n") // Replace multiple empty lines with double line breaks
        .replace(/^\s*\n/gm, "") // Remove leading whitespace on empty lines
        .trim() // Remove leading/trailing whitespace

      return cleanCode
    } catch (error) {
      console.error("Error removing comments:", error)
      return code // Return original code if error
    }
  }

  const getDisplayCode = () => {
    if (showBoilerplatePreview) {
      // Show original boilerplate WITH comments when previewing
      if (exercise.boilerplate_code) {
        return exercise.boilerplate_code
      } else {
        const boilerplate = getBoilerplateCode()
        return boilerplate
      }
    }
    return code
  }

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: editorFontSize,
    lineHeight: Math.round(editorFontSize * 1.4),
    fontFamily:
      "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderLineHighlight: "gutter",
    selectOnLineNumbers: true,
    lineNumbers: showLineNumbers ? "on" : "off",
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    renderWhitespace: "selection",
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    parameterHints: { enabled: true },
    hover: { enabled: true },
    contextmenu: true,
    mouseWheelZoom: true,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    readOnly: isReadOnly,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  }

  const placeholder = `// Click "Load Boilerplate" to get started
// Or write your ${getMonacoLanguage()} code from scratch...`

  // Determine if we should show the Load button (problem mode only)
  const shouldShowLoadButton = mode === "problem"

  // Determine button behavior based on state
  const isInitialLoad = !localBoilerplateLoaded && !code.trim()
  const buttonText = isInitialLoad ? "Load Boilerplate" : "Preview Clean"

  return (
    <div className="flex h-full flex-col">
      {/* Code Editor Area */}
      <div className="flex-1 overflow-hidden border border-gray-300 dark:border-gray-600">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          value={getDisplayCode() || (mode === "problem" ? placeholder : "")}
          onChange={(value) =>
            !showBoilerplatePreview && onCodeChange && onCodeChange(value || "")
          }
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            ...editorOptions,
            readOnly: showBoilerplatePreview || isReadOnly, // Make read-only when showing preview
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-slate-900">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                <span className="text-sm">Loading Monaco Editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Streamlined Compact Toolbar - Single Row */}
      <div className="border-t border-gray-300 bg-white px-2 py-1.5 shadow-lg dark:border-gray-600 dark:bg-black">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {shouldShowLoadButton && (
              <button
                onClick={handleLoadBoilerplate}
                onMouseDown={handlePreviewStart}
                onMouseUp={handlePreviewEnd}
                onMouseLeave={handlePreviewEnd}
                onTouchStart={handlePreviewStart}
                onTouchEnd={handlePreviewEnd}
                className={`group relative flex select-none items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${
                  showBoilerplatePreview
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                    : isInitialLoad
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25"
                }`}
                title={
                  showBoilerplatePreview
                    ? "Showing boilerplate with instructions/comments"
                    : isInitialLoad
                      ? "Click to load clean boilerplate. Hold to preview with comments."
                      : "Click to reload clean version. Hold to preview with comments."
                }
              >
                <Code2
                  className={`h-3 w-3 transition-transform duration-300 group-hover:scale-110 ${showBoilerplatePreview ? "scale-110" : ""}`}
                />
                <span className="relative">
                  {showBoilerplatePreview ? "With Comments" : buttonText}
                  <span className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[200%]" />
                </span>
                {showBoilerplatePreview && (
                  <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-purple-600 px-2 py-1 text-xs text-white">
                    With Comments
                  </span>
                )}
                {showInstructions && (
                  <div className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2 animate-pulse whitespace-nowrap rounded bg-green-600 px-3 py-2 text-xs text-white">
                    ✨ Clean code loaded! Hold button to see comments
                  </div>
                )}
                {showPreviewSuccess && (
                  <div className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2 animate-pulse whitespace-nowrap rounded bg-emerald-600 px-3 py-2 text-xs text-white">
                    ✨ Clean code reloaded! Code will auto-restore
                  </div>
                )}
              </button>
            )}

            <button
              onClick={handleRunCode}
              disabled={!code.trim() || isRunning || !isEditorReady}
              className={`group relative flex items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-all duration-300 ${
                !code.trim() || isRunning || !isEditorReady
                  ? "cursor-not-allowed bg-gray-400 opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-110 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
              } ${isRunning ? "animate-pulse" : ""}`}
              title="Run code"
              aria-label={
                isRunning
                  ? "Code is running"
                  : !code.trim() || !isEditorReady
                    ? "Write some code first"
                    : "Run code"
              }
            >
              <Play
                className={`h-3 w-3 transition-transform duration-300 ${!isRunning ? "group-hover:scale-110" : "animate-spin"}`}
              />
              <span className="relative">
                {isRunning ? "Running..." : "Run"}
                {!isRunning && (
                  <span className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[200%]" />
                )}
              </span>
            </button>
          </div>

          {/* Right: Secondary Actions + Advanced Toggle */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 rounded border border-gray-300 p-1 text-slate-600 dark:border-gray-600 dark:text-slate-300">
              <button
                onClick={() => adjustEditorFontSize(-1)}
                className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                title="Zoom out editor"
                aria-label="Zoom out editor"
                disabled={!isEditorReady}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => adjustEditorFontSize(1)}
                className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                title="Zoom in editor"
                aria-label="Zoom in editor"
                disabled={!isEditorReady}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-600" />
              <button
                onClick={() => adjustOutputFontSize(-1)}
                className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                title="Zoom out output"
                aria-label="Zoom out output"
              >
                <Minus className="h-3 w-3" />
              </button>
              <button
                onClick={() => adjustOutputFontSize(1)}
                className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                title="Zoom in output"
                aria-label="Zoom in output"
              >
                <Plus className="h-3 w-3" />
              </button>
              <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-600" />
              <button
                onClick={resetZoom}
                className="rounded p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              disabled={!code || !isEditorReady}
              className="group relative rounded-lg p-1.5 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:text-blue-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-blue-900 dark:hover:text-blue-100"
              title="Copy code"
            >
              <Copy className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white">
                  Copied!
                </span>
              )}
            </button>

            <button
              onClick={handleResetCode}
              disabled={!code || !isEditorReady}
              className="group rounded-lg p-1.5 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:text-blue-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-blue-900 dark:hover:text-blue-100"
              title="Reset code"
            >
              <RotateCcw className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" />
            </button>

            <button
              onClick={() => setShowAdvancedControls(!showAdvancedControls)}
              className={`group rounded-lg p-1.5 text-black transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:text-blue-900 hover:shadow-md dark:text-white dark:hover:bg-blue-900 dark:hover:text-blue-100 ${showAdvancedControls ? "bg-blue-100 dark:bg-blue-800" : ""}`}
              title="Advanced settings"
            >
              <Settings
                className={`h-3 w-3 transition-transform duration-300 group-hover:scale-110 ${showAdvancedControls ? "rotate-90" : "group-hover:rotate-90"}`}
              />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Controls */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdvancedControls ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="mt-2 space-y-3 border-t border-gray-200 pt-3 dark:border-gray-700">
            {/* Font Size Controls */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span className="text-xs font-semibold text-black dark:text-white">
                  Editor font
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustEditorFontSize(-1)}
                    className="rounded p-1 text-black transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-blue-800"
                    disabled={editorFontSize <= 10}
                    aria-label="Decrease editor font"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 rounded bg-white px-1 py-0.5 text-center text-xs font-bold tabular-nums text-black shadow-sm dark:bg-gray-900 dark:text-white">
                    {editorFontSize}px
                  </span>
                  <button
                    onClick={() => adjustEditorFontSize(1)}
                    className="rounded p-1 text-black transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-blue-800"
                    disabled={editorFontSize >= 30}
                    aria-label="Increase editor font"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span className="text-xs font-semibold text-black dark:text-white">
                  Output font
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustOutputFontSize(-1)}
                    className="rounded p-1 text-black transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-blue-800"
                    disabled={outputFontSize <= 10}
                    aria-label="Decrease output font"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 rounded bg-white px-1 py-0.5 text-center text-xs font-bold tabular-nums text-black shadow-sm dark:bg-gray-900 dark:text-white">
                    {outputFontSize}px
                  </span>
                  <button
                    onClick={() => adjustOutputFontSize(1)}
                    className="rounded p-1 text-black transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-blue-800"
                    disabled={outputFontSize >= 24}
                    aria-label="Increase output font"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={resetZoom}
                className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-900 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Reset zoom
              </button>
            </div>

            {/* Input Controls - Only show for supported languages */}
            {supportsInput(language.slug) && (
              <div>
                <label className="mb-1 block text-xs font-bold text-black dark:text-white">
                  Program Input:
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  placeholder="Enter input for your program..."
                  disabled={isRunning}
                />
              </div>
            )}

            {/* Status Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-black dark:text-white">
              <span>Characters: {code.length}</span>
              {showBoilerplatePreview && (
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  Previewing with comments
                </span>
              )}
              {showInstructions && (
                <span className="font-bold text-green-600 dark:text-green-400">
                  Clean code loaded
                </span>
              )}
              {showPreviewSuccess && (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Clean code restored
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined Output Terminal */}
      {(output || isRunning) && (
        <div className="border-t border-gray-300 bg-blue-50 shadow-lg dark:border-gray-600 dark:bg-blue-900">
          {/* Compact Header */}
          <div className="flex items-center justify-between border-b border-blue-200 bg-blue-100 px-2 py-1 dark:border-blue-700 dark:bg-blue-800">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3 text-blue-900 dark:text-blue-100" />
              <span className="text-xs font-bold text-blue-900 dark:text-blue-100">
                Output
              </span>
            </div>
            {output && !isRunning && (
              <button
                onClick={() => setOutput("")}
                className="rounded px-2 py-0.5 text-xs font-bold text-blue-900 transition-colors hover:bg-blue-200 hover:text-black dark:text-blue-100 dark:hover:bg-blue-700 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Terminal Content */}
          <div className="max-h-32 overflow-y-auto bg-gray-900 p-2 dark:bg-gray-100">
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <span className="text-xs font-bold text-blue-400 dark:text-blue-600">
                  Running {getMonacoLanguage()} code...
                </span>
              </div>
            ) : (
              <pre
                className="whitespace-pre-wrap font-mono text-green-400 dark:text-green-600"
                style={{
                  fontSize: `${outputFontSize}px`,
                  lineHeight: `${Math.round(outputFontSize * 1.4)}px`,
                }}
              >
                {output}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UnifiedCodeEditor
