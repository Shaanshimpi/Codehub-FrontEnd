// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/Shared/UnifiedCodeEditor.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { executeCode, supportsInput } from "@/app/utils/codeExecution"
import { Editor } from "@monaco-editor/react"
import {
  Code2,
  Copy,
  Play,
  RotateCcw,
  Settings,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

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
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [copied, setCopied] = useState(false)
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
    setLocalBoilerplateLoaded(true) // Set local state
    if (onLoadBoilerplate) onLoadBoilerplate() // Call parent handler

    // Notify parent component about boilerplate status change
    if (onBoilerplateStatusChange) {
      onBoilerplateStatusChange(true)
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

  const increaseFontSize = () => {
    setFontSize(Math.min(fontSize + 2, 20))
  }

  const decreaseFontSize = () => {
    setFontSize(Math.max(fontSize - 2, 10))
  }

  const resetFontSize = () => {
    setFontSize(14)
  }

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: fontSize,
    lineHeight: 20,
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
// Or write your ${getMonacoLanguage()} code from scratch...

// Pro tip: Use Ctrl+Enter to run your code quickly!`

  // Determine if we should show the Load button (problem mode only)
  const shouldShowLoadButton =
    mode === "problem" && !localBoilerplateLoaded && !code.trim()

  return (
    <div className="flex h-full flex-col">
      {/* Code Editor Area */}
      <div className="flex-1 overflow-hidden border border-slate-200 dark:border-slate-700">
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          value={code || (mode === "problem" ? placeholder : "")}
          onChange={(value) => onCodeChange && onCodeChange(value || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={editorOptions}
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

      {/* Compact Bottom Section - Input + Actions */}
      <div className="border-t border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
        {/* Font Size Controls */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Font Size:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 10}
                className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-xs text-slate-600 dark:text-slate-300">
                {fontSize}
              </span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 20}
                className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
              <button
                onClick={resetFontSize}
                className="ml-1 rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                title="Reset font size"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Input Row - Only show for languages that support input */}
        {supportsInput(language.slug) && (
          <div className="mb-2">
            <label
              htmlFor="input"
              className="mb-1 block text-xs text-slate-600 dark:text-slate-400"
            >
              Program Input:
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Enter input for your program (each line will be passed as input)"
              disabled={isRunning}
            />
          </div>
        )}

        {/* Action Row */}
        <div className="flex gap-2">
          {/* Primary Actions */}
          {shouldShowLoadButton && (
            <button
              onClick={handleLoadBoilerplate}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:flex-none"
            >
              <Code2 className="h-3.5 w-3.5" />
              Load Boilerplate
            </button>
          )}

          <button
            onClick={handleRunCode}
            disabled={!code.trim() || isRunning || !isEditorReady}
            className="flex flex-1 items-center justify-center gap-1 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            title="Ctrl+Enter to run"
          >
            <Play className="h-3.5 w-3.5" />
            {isRunning ? "Running..." : "Run Code"}
          </button>

          {/* Secondary Actions */}
          <button
            onClick={handleCopyCode}
            disabled={!code || !isEditorReady}
            className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Copy code"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleResetCode}
            disabled={!code || !isEditorReady}
            className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Reset code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              // Theme toggle - feature coming soon
            }}
            disabled={!isEditorReady}
            className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Toggle theme"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Editor Status */}
        {isEditorReady && (
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span>Language: {getMonacoLanguage()}</span>
              <span>Lines: {code.split("\n").length}</span>
              <span>Characters: {code.length}</span>
            </div>
            <div className="text-xs opacity-70">
              Ctrl+Enter to run • Ctrl+S to save
            </div>
          </div>
        )}
      </div>

      {/* Compact Output Section - Only show when there's output */}
      {(output || isRunning) && (
        <div className="border-t border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 px-2 py-1 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Output
            </span>
            {output && !isRunning && (
              <button
                onClick={() => setOutput("")}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-40 overflow-y-auto p-2">
            {isRunning ? (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent" />
                <span className="text-xs">
                  Executing {getMonacoLanguage()} code...
                </span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 dark:text-slate-200">
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
