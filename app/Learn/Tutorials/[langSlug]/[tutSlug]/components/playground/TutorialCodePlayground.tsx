"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { Language, Tutorial } from "@/app/Learn/types/TutorialTypes"
import { executeCode, supportsInput } from "@/app/utils/codeExecution"
import { Editor } from "@monaco-editor/react"
import { HelpCircle, Play, Terminal } from "lucide-react"
import PlaygroundAIAssistant from "../ai/PlaygroundAIAssistant"
import { Icon } from "../ui"

interface TutorialCodePlaygroundProps {
  language: Language
  lessonTitle: string // Tutorial title, not lesson title
  tutorial: Tutorial // Reserved for Phase 3 (AI context)
  lesson: any | null // Optional current lesson for Phase 3 (AI context)
  onBack: () => void
  initialCode?: string
}

/**
 * Tutorial Code Playground Component
 * Interactive code editor for students to practice coding during lessons
 */
const TutorialCodePlayground: React.FC<TutorialCodePlaygroundProps> = ({
  language,
  lessonTitle: _lessonTitle, // Not used in UI but kept for consistency
  tutorial,
  lesson,
  onBack,
  initialCode,
}) => {
  const [code, setCode] = useState(initialCode || "")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [input, setInput] = useState("")
  const [showAI, setShowAI] = useState(false)
  const [showInputSection, setShowInputSection] = useState(false)
  const editorRef = useRef<any>(null)

  // Build a stable storage key per tutorial/language
  const storageKey = useMemo(
    () => `playground:${language.slug}:${tutorial.slug}`,
    [language.slug, tutorial.slug]
  )

  // Load persisted code/input on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.code === "string") setCode(parsed.code)
        if (typeof parsed.input === "string") setInput(parsed.input)
      }
    } catch (error) {
      console.error("Error loading persisted code input:", error)
      console.error("Error loading persisted code input:", error)
    }
  }, [storageKey])

  // Persist code/input (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ code, input }))
      } catch (error) {
        console.error("Error loading persisted code/input:", error)
      }
    }, 300)
    return () => clearTimeout(id)
  }, [storageKey, code, input])

  // Get Monaco language identifier from language slug
  const getMonacoLanguage = (): string => {
    const langMap: Record<string, string> = {
      "c-programming": "c",
      c: "c",
      cpp: "cpp",
      "c++": "cpp",
      java: "java",
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
      html: "html",
      css: "css",
      json: "json",
      sql: "sql",
    }
    return langMap[language.slug.toLowerCase()] || "plaintext"
  }

  // Monaco Editor configuration
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

  const placeholder = `// Write your ${getMonacoLanguage()} code here...
// Use Ctrl+Enter to run your code quickly!

`

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (code.trim()) {
        handleRunCode()
      }
    })

    // Focus the editor
    editor.focus()
  }

  // Handle code execution with timeout and better error handling
  const handleRunCode = async () => {
    if (!code.trim() || isRunning) return

    setIsRunning(true)
    setOutput("")

    try {
      // Add timeout for execution (30 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Execution timeout (30s)")), 30000)
      )

      const result = (await Promise.race([
        executeCode({
          code: code,
          language: language.slug,
          input: input,
        }),
        timeoutPromise,
      ])) as any

      if (result.success) {
        let outputText = result.output || ""

        // Add execution info if available
        if (result.executionTime) {
          outputText += `\n\n─────────────────────\nExecution time: ${result.executionTime}ms`
        }

        setOutput(outputText)
      } else {
        // Handle execution errors with better formatting
        let errorText = "❌ Execution Failed\n\n"

        if (result.error) {
          errorText += `Error: ${result.error}\n`
        }

        if (result.stderr) {
          errorText += `\nDetails:\n${result.stderr}`
        }

        // Include stdout if available (some errors still produce output)
        if (result.output) {
          errorText += `\n\nOutput:\n${result.output}`
        }

        setOutput(errorText)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"

      if (errorMessage.includes("timeout")) {
        setOutput(
          "⏱️ Execution Timeout\n\nYour code took too long to execute (>30 seconds). Please check for infinite loops or optimize your code."
        )
      } else if (errorMessage.includes("Network")) {
        setOutput(
          `❌ Network Error\n\nFailed to execute code: ${errorMessage}\n\nPlease check your connection and try again.`
        )
      } else {
        setOutput(
          `❌ Error\n\nFailed to execute code: ${errorMessage}\n\nPlease check your code and try again.`
        )
      }
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Split View Container */}
      <div className="flex flex-1 flex-row overflow-hidden">
        {/* Code Editor Panel - full width on mobile, split on desktop */}
        <div
          className={`relative w-full overflow-hidden transition-all duration-300 ${
            showAI
              ? "hidden lg:flex lg:w-1/2 lg:flex-col lg:border-r lg:border-gray-200 lg:dark:border-gray-700"
              : "flex lg:w-full lg:flex-col"
          }`}
        >
          {/* Back Button - Floating in top-left corner */}
          <button
            onClick={onBack}
            className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Back to Tutorial"
          >
            <Icon name="chevronLeft" size="sm" />
            Back
          </button>
          <div className="relative flex-1 overflow-hidden border border-slate-200 pt-8 dark:border-slate-700">
            <Editor
              height="100%"
              language={getMonacoLanguage()}
              value={code || placeholder}
              onChange={(value) => setCode(value || "")}
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

          {/* Toolbar - Matching Exercise Toolbar Style */}
          <div className="toolbar-enter border-t border-gray-300 bg-white px-3 py-2 shadow-lg dark:border-gray-600 dark:bg-black">
            {/* Input Section - Only show when toggled */}
            {showInputSection && supportsInput(language.slug) && (
              <div className="mb-2">
                <label
                  htmlFor="program-input"
                  className="mb-0.5 block text-[10px] text-gray-600 dark:text-gray-400"
                >
                  Program Input:
                </label>
                <textarea
                  id="program-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter input for your program..."
                  disabled={isRunning}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              {/* Left: Primary Actions */}
              <div className="flex items-center gap-3">
                {/* Run Button */}
                <button
                  onClick={handleRunCode}
                  disabled={!code.trim() || isRunning || !isEditorReady}
                  className={`focus-ring toolbar-button group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg ${
                    !code.trim() || isRunning || !isEditorReady
                      ? "cursor-not-allowed bg-gray-400 opacity-50"
                      : "btn-primary btn-shimmer"
                  } ${isRunning ? "loading-pulse" : ""}`}
                  title={
                    isRunning
                      ? "Running code..."
                      : isEditorReady && code.trim()
                        ? "Run your code (Ctrl+Enter)"
                        : "Write some code first"
                  }
                  aria-label={
                    isRunning
                      ? "Code is running"
                      : isEditorReady && code.trim()
                        ? "Run your code. Keyboard shortcut: Control plus Enter"
                        : "Write some code first before running"
                  }
                  aria-describedby="run-button-status"
                >
                  <Play
                    className={`h-4 w-4 transition-transform duration-300 ${!isRunning ? "group-hover:scale-110" : "animate-spin"}`}
                  />
                  <span className="relative">
                    {isRunning ? "Running..." : "Run Code"}
                    {!isRunning && code.trim() && isEditorReady && (
                      <span className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[200%]" />
                    )}
                  </span>
                </button>

                {/* Input Toggle Button */}
                {supportsInput(language.slug) && (
                  <div className="relative">
                    <button
                      onClick={() => setShowInputSection(!showInputSection)}
                      className={`focus-ring toolbar-button group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-md ${
                        showInputSection
                          ? "btn-warning"
                          : "bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-yellow-50 hover:text-yellow-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-300"
                      }`}
                      title={
                        showInputSection
                          ? "Hide input section"
                          : "Show input section for scanf, cin, etc."
                      }
                      aria-label={
                        showInputSection
                          ? "Hide program input section"
                          : "Show program input section for scanf, cin, and similar input operations"
                      }
                      aria-expanded={showInputSection}
                    >
                      <Terminal className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span className="hidden sm:inline">Input</span>
                      {input.trim() && (
                        <div
                          className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-yellow-500 dark:border-gray-900"
                          title="Has input data"
                        />
                      )}
                    </button>
                  </div>
                )}

                {/* AI Help Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowAI(!showAI)}
                    className={`focus-ring toolbar-button group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md ${
                      showAI
                        ? "btn-success"
                        : "bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-green-50 hover:text-green-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                    }`}
                    title={
                      showAI ? "Close AI Help" : "Get AI help with your code"
                    }
                    aria-label={
                      showAI
                        ? "Close AI help"
                        : "Open AI help assistant for code assistance"
                    }
                    aria-expanded={showAI}
                    aria-haspopup="dialog"
                  >
                    <HelpCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>Need Help?</span>
                  </button>
                </div>
              </div>

              {/* Right: Code Info */}
              <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="hidden font-semibold text-blue-600 dark:text-blue-400 md:inline">
                    Ctrl+Enter to run
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Output Panel - Always visible for better UX */}
          <div className="border-t border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 px-2 py-1 dark:border-slate-700">
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                Output
              </span>
              {output && !isRunning && (
                <button
                  onClick={() => setOutput("")}
                  className="text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="max-h-32 overflow-y-auto p-2">
              {isRunning ? (
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <div className="h-2.5 w-2.5 animate-spin rounded-full border border-blue-600 border-t-transparent" />
                  <span className="text-[10px]">Executing...</span>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-slate-800 dark:text-slate-200">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Output will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Panel - full width on mobile, split on desktop */}
        {showAI && (
          <div
            className={`w-full lg:w-1/2 ${showAI ? "block" : "hidden lg:block"}`}
          >
            <PlaygroundAIAssistant
              tutorial={tutorial}
              lesson={lesson}
              language={language}
              currentCode={code}
              codeOutput={output}
              onClose={() => setShowAI(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile toggle button */}
      <div className="border-t border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900 lg:hidden">
        <button
          onClick={() => setShowAI(!showAI)}
          className="w-full rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          aria-label={
            showAI ? "Switch to code editor" : "Switch to AI assistant"
          }
        >
          {showAI ? "Switch to Code" : "Switch to AI"}
        </button>
      </div>
    </div>
  )
}

export default TutorialCodePlayground
