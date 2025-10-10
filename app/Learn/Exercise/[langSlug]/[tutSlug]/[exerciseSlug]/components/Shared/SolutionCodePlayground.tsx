// Solution code playground component exactly like StudentPlayground
"use client"

import React, { useEffect, useRef, useState } from "react"
import { removeComments } from "@/app/utils/codeCommentUtils"
import { executeCode } from "@/app/utils/codeExecution"
import { Editor } from "@monaco-editor/react"
import { Terminal } from "lucide-react"
import InstructionsModal from "./InstructionsModal"
import SimpleToolbar from "./SimpleToolbar"
import SolutionHelpMenu from "./SolutionHelpMenu"
import { ExplanationModal } from "./SolutionModals"

// Solution code playground component exactly like StudentPlayground

interface SolutionPlaygroundState {
  mode: "with-explanation" | "clean-solution"
  showHelpMenu: boolean
  showCodeWithCommentsModal: boolean
  showInstructionsModal: boolean
  showInputSection: boolean
  programInput: string
}

interface SolutionCodePlaygroundProps {
  exercise: any
  language: any
}

const SolutionCodePlayground: React.FC<SolutionCodePlaygroundProps> = ({
  exercise,
  language,
}) => {
  // Simple, predictable state matching StudentPlayground pattern
  const [playgroundState, setPlaygroundState] =
    useState<SolutionPlaygroundState>({
      mode: "clean-solution",
      showHelpMenu: false,
      showCodeWithCommentsModal: false,
      showInstructionsModal: false,
      showInputSection: false,
      programInput: "",
    })

  const [isEditorReady, setIsEditorReady] = useState(false)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [currentCode, setCurrentCode] = useState("")
  const editorRef = useRef<any>(null)

  // Get solution codes
  const solutionCode = exercise?.solution_code || ""
  const cleanSolutionCode = removeComments(
    solutionCode,
    language?.slug || "javascript"
  )

  // Initialize current code with clean solution (no comments)
  useEffect(() => {
    setCurrentCode(cleanSolutionCode)
  }, [cleanSolutionCode])

  // Handle code changes
  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCurrentCode(newCode)
    }
  }

  // Monaco editor setup (same as StudentPlayground)
  const getMonacoLanguage = () => {
    if (!language?.slug) return "javascript"

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
      default:
        return "javascript"
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Add keyboard shortcuts (same as StudentPlayground)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode()
    })
  }

  // Handle run code
  const handleRunCode = async () => {
    if (!currentCode.trim() || isRunning) return

    setIsRunning(true)
    setOutput("")

    try {
      const result = await executeCode({
        code: currentCode,
        language: language.slug,
        input: playgroundState.programInput,
      })

      if (result.success) {
        let outputText = result.output

        // Add execution info if available
        if (result.executionTime) {
          outputText += `\n\n─────────────────────\nExecution time: ${result.executionTime}ms`
        }

        setOutput(outputText)
      } else {
        // Handle execution errors
        let errorText = "❌ Execution Failed\n\n"

        if (result.error) {
          errorText += result.error
        } else if (result.output) {
          errorText += result.output
        } else {
          errorText += "An unknown error occurred during execution."
        }

        setOutput(errorText)
      }
    } catch (error) {
      console.error("Code execution error:", error)
      setOutput(
        "❌ Execution Error\n\nFailed to execute code. Please try again or check your code for syntax errors."
      )
    } finally {
      setIsRunning(false)
    }
  }

  // Editor options (same as StudentPlayground)
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
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
    readOnly: false, // Solution is now editable
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

  // State-based styling (same pattern as StudentPlayground)
  const getEditorClassName = () => {
    const baseClasses = "rounded-lg overflow-hidden"
    return `${baseClasses} border border-gray-300 dark:border-gray-600`
  }

  // Handle help menu actions
  const handleToggleHelp = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      showHelpMenu: !prev.showHelpMenu,
    }))
  }

  const handleShowCodeWithComments = () => {
    // Show the code with comments (original solution code) in a modal
    setPlaygroundState((prev) => ({
      ...prev,
      showCodeWithCommentsModal: true,
      showHelpMenu: false,
    }))
  }

  const handleShowInstructions = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      showInstructionsModal: true,
      showHelpMenu: false,
    }))
  }

  const handleLoadStarter = () => {
    // Load clean solution code (without comments)
    setCurrentCode(cleanSolutionCode)
    setPlaygroundState((prev) => ({
      ...prev,
      mode: "clean-solution",
      showHelpMenu: false,
    }))
  }

  const handleReset = () => {
    // Reset to clean solution (default state)
    setCurrentCode(cleanSolutionCode)
    setPlaygroundState((prev) => ({
      ...prev,
      mode: "clean-solution",
      showHelpMenu: false,
    }))
  }

  const handleResetToCleanSolution = () => {
    // Reset to original clean solution code
    setCurrentCode(cleanSolutionCode)
    setPlaygroundState((prev) => ({
      ...prev,
      mode: "clean-solution",
      showHelpMenu: false,
    }))
  }

  const handleToggleInput = () => {
    setPlaygroundState((prev) => ({
      ...prev,
      showInputSection: !prev.showInputSection,
    }))
  }

  const handleInputChange = (value: string) => {
    setPlaygroundState((prev) => ({
      ...prev,
      programInput: value,
    }))
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

  return (
    <div className="relative flex h-full flex-col">
      {/* Code Editor Area - Exact same structure as StudentPlayground */}
      <div className={`flex-1 ${getEditorClassName()}`}>
        <Editor
          height="100%"
          language={getMonacoLanguage()}
          value={currentCode}
          onChange={handleCodeChange}
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
              value={playgroundState.programInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={getInputPlaceholder(language?.slug || "javascript")}
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

      {/* Simple Toolbar - Exact same structure as StudentPlayground */}
      <div className="relative">
        <SimpleToolbar
          onRunCode={handleRunCode}
          onToggleHelp={handleToggleHelp}
          canRun={!!currentCode.trim() && isEditorReady}
          isRunning={isRunning}
          isHelpOpen={playgroundState.showHelpMenu}
          language={language}
          codeLength={currentCode.length}
          showInputSection={playgroundState.showInputSection}
          onToggleInput={handleToggleInput}
          hasInput={playgroundState.programInput.length > 0}
          showRunButton={true} // Show run button in solution view
          showInputButton={true} // Show input button in solution view
        />

        {/* Solution Help Menu - positioned like StudentPlayground help menu */}
        <SolutionHelpMenu
          isOpen={playgroundState.showHelpMenu}
          onClose={() =>
            setPlaygroundState((prev) => ({ ...prev, showHelpMenu: false }))
          }
          onShowCodeWithComments={handleShowCodeWithComments}
          onResetToCleanSolution={handleResetToCleanSolution}
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

      {/* Instructions Modal - same as StudentPlayground */}
      <InstructionsModal
        isOpen={playgroundState.showInstructionsModal}
        onClose={() =>
          setPlaygroundState((prev) => ({
            ...prev,
            showInstructionsModal: false,
          }))
        }
        exercise={exercise}
        language={language}
        onCopyToEditor={() => {}} // No copy functionality for solution
      />

      {/* Code with Comments Modal */}
      <ExplanationModal
        isOpen={playgroundState.showCodeWithCommentsModal}
        onClose={() =>
          setPlaygroundState((prev) => ({
            ...prev,
            showCodeWithCommentsModal: false,
          }))
        }
        exercise={exercise}
        language={language}
      />
    </div>
  )
}

export default SolutionCodePlayground
