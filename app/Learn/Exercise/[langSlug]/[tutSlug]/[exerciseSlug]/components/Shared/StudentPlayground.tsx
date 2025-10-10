// New simplified student playground component
"use client"

import React, { useEffect, useRef, useState } from "react"
import { executeCode } from "@/app/utils/codeExecution"
import { Editor } from "@monaco-editor/react"
import { Terminal } from "lucide-react"
import { BoilerplateGenerator } from "./BoilerplateGenerator"
import HelpMenu from "./HelpMenu"
import InstructionsModal from "./InstructionsModal"
import SimpleToolbar from "./SimpleToolbar"

// New simplified student playground component

interface PlaygroundState {
  mode: "empty" | "starter" | "working"
  code: string
  showHelpMenu: boolean
  showInstructionsModal: boolean
  userInput: string
  showInputSection: boolean
}

interface StudentPlaygroundProps {
  exercise: any
  language: any
  code: string
  onCodeChange?: (code: string) => void
  onRunCode?: () => void
  mode?: "problem" | "solution"
  isReadOnly?: boolean
}

const StudentPlayground: React.FC<StudentPlaygroundProps> = ({
  exercise,
  language,
  code,
  onCodeChange,
  onRunCode,
  mode = "problem",
  isReadOnly = false,
}) => {
  // Simple, predictable state
  const [playgroundState, setPlaygroundState] = useState<PlaygroundState>({
    mode: code.trim() ? "working" : "empty",
    code: code || "",
    showHelpMenu: false,
    showInstructionsModal: false,
    userInput: "",
    showInputSection: false,
  })

  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const editorRef = useRef<any>(null)

  // Update internal state when external code changes
  useEffect(() => {
    setPlaygroundState((prev) => ({
      ...prev,
      code: code || "",
      mode: code?.trim() ? "working" : "empty",
    }))
  }, [code])

  // Smart detection for input requirements
  useEffect(() => {
    const needsInput = detectInputRequirement(
      playgroundState.code,
      language.slug
    )
    setPlaygroundState((prev) => ({
      ...prev,
      showInputSection: needsInput,
    }))
  }, [playgroundState.code, language.slug])

  // Function to detect if code requires input
  const detectInputRequirement = (
    code: string,
    languageSlug: string
  ): boolean => {
    if (!code.trim()) return false

    const inputPatterns: Record<string, RegExp[]> = {
      c: [/scanf\s*\(/, /gets\s*\(/, /getchar\s*\(/],
      "c-programming": [/scanf\s*\(/, /gets\s*\(/, /getchar\s*\(/],
      cpp: [/cin\s*>>/, /scanf\s*\(/, /gets\s*\(/, /getline\s*\(/],
      "c++": [/cin\s*>>/, /scanf\s*\(/, /gets\s*\(/, /getline\s*\(/],
      python: [/input\s*\(/, /sys\.stdin/, /raw_input\s*\(/],
      java: [
        /Scanner/,
        /System\.in/,
        /BufferedReader/,
        /nextInt\s*\(/,
        /nextLine\s*\(/,
        /next\s*\(/,
      ],
      javascript: [/prompt\s*\(/, /readline/, /process\.stdin/],
      typescript: [/prompt\s*\(/, /readline/, /process\.stdin/],
    }

    const patterns = inputPatterns[languageSlug] || []
    return patterns.some((pattern) => pattern.test(code))
  }

  // Get input placeholder and examples based on language
  const getInputPlaceholder = (languageSlug: string): string => {
    const examples: Record<string, string> = {
      c: `Enter input values here...\n\nFor scanf examples:\n• scanf("%d", &num) → 42\n• scanf("%d %d", &a, &b) → 10 20\n• scanf("%s", str) → Hello\n• Multiple lines:\n5\n10\nJohn`,
      "c-programming": `Enter input values here...\n\nFor scanf examples:\n• scanf("%d", &num) → 42\n• scanf("%d %d", &a, &b) → 10 20\n• scanf("%s", str) → Hello\n• Multiple lines:\n5\n10\nJohn`,
      cpp: `Enter input values here...\n\nFor cin examples:\n• cin >> num → 42\n• cin >> a >> b → 10 20\n• getline(cin, str) → Hello World\n• Multiple lines:\n5\n10\nJohn Doe`,
      "c++": `Enter input values here...\n\nFor cin examples:\n• cin >> num → 42\n• cin >> a >> b → 10 20\n• getline(cin, str) → Hello World\n• Multiple lines:\n5\n10\nJohn Doe`,
      python: `Enter input values here...\n\nFor input() examples:\n• input() → Hello World\n• int(input()) → 42\n• Multiple inputs:\n5\n10\nJohn\nDoe`,
      java: `Enter input values here...\n\nFor Scanner examples:\n• nextInt() → 42\n• next() → Hello\n• nextLine() → Hello World\n• Multiple lines:\n5\n10\nJohn Doe`,
      javascript: `Enter input values here...\n\nFor prompt examples:\n• Single input → Hello World\n• Multiple lines:\nHello\nWorld\n42`,
      typescript: `Enter input values here...\n\nFor prompt examples:\n• Single input → Hello World\n• Multiple lines:\nHello\nWorld\n42`,
    }

    return (
      examples[languageSlug] ||
      `Enter input values here...\n\nFor multiple inputs, separate with spaces or new lines:\n5 10\nHello World\n25`
    )
  }

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    const updatedState = {
      ...playgroundState,
      code: newCode,
      mode: newCode.trim() ? "working" : ("empty" as const),
    }
    setPlaygroundState(updatedState)
    if (onCodeChange) onCodeChange(newCode)
  }

  // Handle run code
  const handleRunCode = async () => {
    if (!playgroundState.code.trim() || isRunning) return

    setIsRunning(true)
    setOutput("")

    try {
      const result = await executeCode({
        code: playgroundState.code,
        language: language.slug,
        input: playgroundState.userInput,
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

  // Help menu actions
  const handleLoadStarter = () => {
    const boilerplate = BoilerplateGenerator.generate(exercise, language)
    handleCodeChange(boilerplate.clean)
    setPlaygroundState((prev) => ({
      ...prev,
      mode: "starter",
      showHelpMenu: false,
    }))
  }

  const handleShowInstructions = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      showHelpMenu: false,
      showInstructionsModal: true,
    }))
  }

  const handleCloseInstructions = () => {
    setPlaygroundState((prev) => ({ ...prev, showInstructionsModal: false }))
  }

  const handleCopyToEditor = (code: string) => {
    handleCodeChange(code)
    setPlaygroundState((prev) => ({
      ...prev,
      mode: "working",
      showInstructionsModal: false,
    }))
  }

  const handleReset = () => {
    handleCodeChange("")
    setOutput("")
    setPlaygroundState((prev) => ({
      ...prev,
      mode: "empty",
      showHelpMenu: false,
    }))
  }

  const handleToggleHelp = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      showHelpMenu: !prev.showHelpMenu,
    }))
  }

  const handleInputChange = (newInput: string) => {
    setPlaygroundState((prev) => ({ ...prev, userInput: newInput }))
  }

  const handleToggleInput = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      showInputSection: !prev.showInputSection,
    }))
  }

  // Monaco editor setup
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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (playgroundState.code.trim() && !isReadOnly && !isRunning) {
        handleRunCode()
      }
    })

    // Focus the editor if not read-only
    if (!isReadOnly) {
      editor.focus()
    }
  }

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: fontSize,
    lineHeight: 20,
    fontFamily:
      "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    wordWrap: "on" as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderLineHighlight: "gutter" as const,
    selectOnLineNumbers: true,
    lineNumbers: "on" as const,
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    renderWhitespace: "selection" as const,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on" as const,
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    parameterHints: { enabled: true },
    hover: { enabled: true },
    contextmenu: true,
    mouseWheelZoom: true,
    cursorBlinking: "blink" as const,
    cursorSmoothCaretAnimation: "on" as const,
    smoothScrolling: true,
    readOnly: isReadOnly,
    scrollbar: {
      vertical: "visible" as const,
      horizontal: "visible" as const,
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  }

  // State-based styling with animations
  const getEditorClassName = () => {
    const baseClasses = "rounded-lg overflow-hidden"
    switch (playgroundState.mode) {
      case "empty":
        return `${baseClasses} playground-empty`
      case "starter":
        return `${baseClasses} playground-starter`
      case "working":
        return `${baseClasses} playground-working`
      default:
        return `${baseClasses} border border-gray-300 dark:border-gray-600`
    }
  }

  const placeholder =
    playgroundState.mode === "empty"
      ? `// Welcome to the coding playground!
// Start typing your ${getMonacoLanguage()} code here...

// Need help getting started?
// Click "Need Help?" below for starter code and instructions

// Pro tip: Use Ctrl+Enter to run your code quickly!`
      : ""

  return (
    <div className="relative flex h-full flex-col">
      {/* Code Editor Area */}
      <div className={`flex-1 ${getEditorClassName()}`}>
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          value={playgroundState.code || placeholder}
          onChange={(value) => handleCodeChange(value || "")}
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

      {/* Input Section */}
      {playgroundState.showInputSection && (
        <div className="input-section-enter border-t border-gray-300 bg-yellow-50 dark:border-gray-600 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between border-b border-yellow-200 bg-yellow-100 px-3 py-2 dark:border-yellow-700 dark:bg-yellow-800/30">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-600 dark:bg-yellow-400" />
              <span className="text-xs font-bold text-yellow-900 dark:text-yellow-100">
                Program Input
              </span>
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              Enter input for scanf, cin, input(), etc.
            </div>
          </div>
          <div className="p-3">
            <textarea
              value={playgroundState.userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={getInputPlaceholder(language.slug)}
              className="h-24 w-full resize-none rounded-lg border border-yellow-300 bg-white px-3 py-2 font-mono text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:border-yellow-600 dark:bg-gray-800 dark:text-white"
              aria-label="Program input values"
              aria-describedby="input-help-text"
            />
            <div
              id="input-help-text"
              className="mt-2 text-xs text-yellow-700 dark:text-yellow-300"
            >
              💡 <strong>Tip:</strong> Each line represents one input. For
              space-separated values, put them on the same line.
            </div>
          </div>
        </div>
      )}

      {/* Simple Toolbar */}
      <div className="relative">
        <SimpleToolbar
          onRunCode={handleRunCode}
          onToggleHelp={handleToggleHelp}
          canRun={!!playgroundState.code.trim() && isEditorReady}
          isRunning={isRunning}
          isHelpOpen={playgroundState.showHelpMenu}
          language={language}
          codeLength={playgroundState.code.length}
          showInputSection={playgroundState.showInputSection}
          onToggleInput={handleToggleInput}
          hasInput={!!playgroundState.userInput.trim()}
        />

        {/* Help Menu */}
        <HelpMenu
          isOpen={playgroundState.showHelpMenu}
          onClose={() =>
            setPlaygroundState((prev) => ({ ...prev, showHelpMenu: false }))
          }
          onLoadStarter={handleLoadStarter}
          onShowInstructions={handleShowInstructions}
          onReset={handleReset}
        />
      </div>

      {/* Output Terminal */}
      {(output || isRunning) && (
        <div
          className="output-terminal-enter border-t border-gray-300 bg-blue-50 shadow-lg dark:border-gray-600 dark:bg-blue-900"
          role="region"
          aria-labelledby="output-header"
          aria-live="polite"
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between border-b border-blue-200 bg-blue-100 px-3 py-1.5 dark:border-blue-700 dark:bg-blue-800">
            <div className="flex items-center gap-2">
              <Terminal
                className="h-3 w-3 text-blue-900 dark:text-blue-100"
                aria-hidden="true"
              />
              <span
                id="output-header"
                className="text-xs font-bold text-blue-900 dark:text-blue-100"
              >
                Output
              </span>
            </div>
            {output && !isRunning && (
              <button
                onClick={() => setOutput("")}
                className="focus-ring rounded px-2 py-0.5 text-xs font-bold text-blue-900 transition-colors hover:bg-blue-200 hover:text-black dark:text-blue-100 dark:hover:bg-blue-700 dark:hover:text-white"
                aria-label="Clear output console"
              >
                Clear
              </button>
            )}
          </div>

          {/* Terminal Content */}
          <div
            className="max-h-32 overflow-y-auto bg-gray-900 p-3 dark:bg-gray-100"
            role="log"
            aria-label="Code execution output"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
                  role="status"
                  aria-label="Loading"
                />
                <span className="text-xs font-bold text-blue-400 dark:text-blue-600">
                  Running {getMonacoLanguage()} code...
                </span>
              </div>
            ) : (
              <pre
                className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-green-400 dark:text-green-600"
                aria-label="Code execution results"
              >
                {output}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={playgroundState.showInstructionsModal}
        exercise={exercise}
        language={language}
        onClose={handleCloseInstructions}
        onCopyToEditor={handleCopyToEditor}
      />
    </div>
  )
}

export default StudentPlayground
