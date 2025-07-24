// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/AnswerCode.tsx
"use client"

import React, { useState } from "react"
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/AnswerCode.tsx

interface AnswerCodeProps {
  code: string
  language: any
  title?: string
}

const AnswerCode: React.FC<AnswerCodeProps> = ({
  code,
  language,
  title = "Complete Solution",
}) => {
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [highlightComments, setHighlightComments] = useState(true)
  const [copied, setCopied] = useState(false)

  const getFileExtension = () => {
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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `solution${getFileExtension()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

  const getLineNumbers = () => {
    const lines = code.split("\n")
    return lines.map((_, index) => index + 1)
  }

  const formatCodeWithHighlighting = (code: string) => {
    if (!highlightComments) return code

    // Simple syntax highlighting for comments and code references
    return code
      .split("\n")
      .map((line, index) => {
        let formattedLine = line

        // Highlight comments
        if (line.trim().startsWith("//")) {
          return `<span class="text-green-400 italic">${line}</span>`
        }

        // Highlight code references like [1], [2], etc.
        formattedLine = formattedLine.replace(
          /\/\/ \[(\d+)\]/g,
          '// <span class="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full mx-1">$1</span>'
        )

        return formattedLine
      })
      .join("\n")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">
              Complete working code • {language.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
              title="Toggle line numbers"
            >
              {showLineNumbers ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={copyCode}
              disabled={copied}
              className="rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-white disabled:text-green-400"
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={downloadCode}
              className="rounded p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
              title="Download code"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-slate-700 bg-slate-800/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Font Size:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 10}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm text-slate-300">
                {fontSize}
              </span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 20}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
              <button
                onClick={resetFontSize}
                className="ml-1 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={highlightComments}
                onChange={(e) => setHighlightComments(e.target.checked)}
                className="rounded"
              />
              Highlight syntax
            </label>
          </div>
        </div>
      </div>

      {/* File Tab */}
      <div className="border-b border-slate-700 bg-slate-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 font-mono text-sm text-slate-300">
            main{getFileExtension()}
          </span>
          {copied && (
            <span className="ml-auto text-sm text-green-400">Copied!</span>
          )}
        </div>
      </div>

      {/* Code Display */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div className="flex-shrink-0 border-r border-slate-700 bg-slate-800/50 px-3 py-4">
            <div
              className="text-right font-mono leading-6 text-slate-500"
              style={{ fontSize: `${fontSize}px` }}
            >
              {getLineNumbers().map((num) => (
                <div key={num} className="select-none">
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-slate-900 p-4">
          <pre
            className="font-mono leading-6 text-slate-200"
            style={{ fontSize: `${fontSize}px` }}
          >
            {highlightComments ? (
              <code
                dangerouslySetInnerHTML={{
                  __html: formatCodeWithHighlighting(code),
                }}
              />
            ) : (
              <code>{code}</code>
            )}
          </pre>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-slate-700 bg-slate-800 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>Lines: {code.split("\n").length}</span>
            <span>Characters: {code.length}</span>
            <span>Language: {language.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Ready to run</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnswerCode
