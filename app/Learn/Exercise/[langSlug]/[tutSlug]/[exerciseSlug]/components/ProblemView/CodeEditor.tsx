// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/CodeEditor.tsx
"use client"

import React, { useRef, useState } from "react"
import { Code2, Copy, Maximize2, Play, RotateCcw, Settings } from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ProblemView/CodeEditor.tsx

interface CodeEditorProps {
  exercise: any
  language: any
  userCode: string
  onCodeChange: (code: string) => void
  onLoadBoilerplate: () => void
  onRunCode: () => void
  isBoilerplateLoaded: boolean
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  exercise,
  language,
  userCode,
  onCodeChange,
  onLoadBoilerplate,
  onRunCode,
  isBoilerplateLoaded,
}) => {
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newCode =
        userCode.substring(0, start) + "  " + userCode.substring(end)
      onCodeChange(newCode)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock output based on the voting example
      if (userCode.includes("scanf") && userCode.includes("if")) {
        setOutput("Enter your age: 25\nYou are eligible to vote.")
      } else {
        setOutput("Code executed successfully!")
      }
    } catch (error) {
      setOutput("Error: " + (error as Error).message)
    } finally {
      setIsRunning(false)
      onRunCode()
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode)
  }

  const handleResetCode = () => {
    onCodeChange("")
  }

  const getLineNumbers = () => {
    const lineCount = userCode.split("\n").length
    return Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1)
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Code Workspace
          </span>
          <span className="rounded bg-slate-200 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
            main{getLanguageFileExtension()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            disabled={!userCode}
            className="rounded p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            onClick={handleResetCode}
            disabled={!userCode}
            className="rounded p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Reset code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            className="rounded p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            className="rounded p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Maximize"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        <div className="flex-shrink-0 border-r border-slate-200 bg-slate-100/50 p-4 pr-2 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="text-right font-mono text-sm leading-6 text-slate-400 dark:text-slate-500">
            {getLineNumbers().map((num) => (
              <div key={num} className="select-none">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Code Textarea */}
        <div className="flex-1 bg-slate-900">
          <textarea
            ref={textareaRef}
            value={userCode}
            onChange={(e) => onCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-slate-200 focus:outline-none"
            placeholder={`// Click "Load Boilerplate" to get started with ${language.title} code\n// Or write your code from scratch here...`}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <label
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          htmlFor="input"
        >
          Program Input (if needed):
        </label>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Enter input values (e.g., 25 for age)"
        />
      </div>

      {/* Action Buttons */}
      <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex gap-3">
          {!isBoilerplateLoaded && (
            <button
              onClick={onLoadBoilerplate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Code2 className="h-4 w-4" />
              Load Boilerplate
            </button>
          )}

          <button
            onClick={handleRunCode}
            disabled={!userCode.trim() || isRunning}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-700">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Output
          </span>
        </div>
        <div className="h-32 overflow-y-auto p-4">
          {isRunning ? (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm">Running your code...</span>
            </div>
          ) : output ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 dark:text-slate-200">
              {output}
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Play className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">{`Click "Run Code" to see output`}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
