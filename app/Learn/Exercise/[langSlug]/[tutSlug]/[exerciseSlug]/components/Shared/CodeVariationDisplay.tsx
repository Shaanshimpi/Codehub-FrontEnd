"use client"

import React, { useMemo, useState } from "react"
import {
  getCodeStats,
  hasInstructionalComments,
  removeComments,
  removeInstructionalComments,
} from "@/app/utils/codeCommentUtils"
import { Check, Copy, Download, Info } from "lucide-react"
import CommentToggle from "./CommentToggle"

interface CodeVariationDisplayProps {
  code: string
  language: string
  title?: string
  showToggle?: boolean
  defaultShowComments?: boolean
  readOnly?: boolean
  className?: string
  onCodeChange?: (code: string) => void
  variant?: "full" | "instructional" // full removes all comments, instructional removes only [1], [2] style
}

const CodeVariationDisplay: React.FC<CodeVariationDisplayProps> = ({
  code,
  language,
  title,
  showToggle = true,
  defaultShowComments = true,
  readOnly = true,
  className = "",
  onCodeChange,
  variant = "instructional",
}) => {
  const [showComments, setShowComments] = useState(defaultShowComments)
  const [copied, setCopied] = useState(false)

  // Memoize code transformations for performance
  const processedCode = useMemo(() => {
    if (showComments) return code

    return variant === "full"
      ? removeComments(code, language)
      : removeInstructionalComments(code, language)
  }, [code, language, showComments, variant])

  const codeStats = useMemo(
    () => getCodeStats(code, language),
    [code, language]
  )

  const hasComments = useMemo(
    () =>
      hasInstructionalComments(code, language) || codeStats.commentLines > 0,
    [code, language, codeStats.commentLines]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const handleDownload = () => {
    const extension = getFileExtension(language)
    const filename = `code.${extension}`
    const blob = new Blob([processedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCodeChange = (value: string) => {
    onCodeChange?.(value)
  }

  return (
    <div
      className={`rounded-lg border border-slate-700 bg-slate-800 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 p-4">
        <div className="flex items-center gap-3">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{language.toUpperCase()}</span>
            <span>{codeStats.totalLines} lines</span>
            {codeStats.commentLines > 0 && (
              <span>{codeStats.commentLines} comments</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Comment Toggle */}
          {showToggle && hasComments && (
            <CommentToggle
              showComments={showComments}
              onToggle={setShowComments}
              hasComments={hasComments}
              size="sm"
              variant="switch"
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              title="Copy code"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
              title="Download code"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        {!showComments && hasComments && (
          <div className="absolute right-2 top-2 z-10">
            <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs text-white">
              <Info className="h-3 w-3" />
              <span>Comments hidden</span>
            </div>
          </div>
        )}

        <div className="p-4">
          {readOnly ? (
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-slate-200">
              <code>{processedCode}</code>
            </pre>
          ) : (
            <textarea
              value={processedCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="h-64 w-full resize-none rounded border border-slate-600 bg-slate-900 p-3 font-mono text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
              placeholder={`Enter your ${language} code here...`}
            />
          )}
        </div>
      </div>

      {/* Footer Stats */}
      {codeStats.totalLines > 0 && (
        <div className="bg-slate-750 border-t border-slate-700 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Code: {codeStats.codeLines} lines</span>
              {codeStats.commentLines > 0 && (
                <span>Comments: {codeStats.commentLines} lines</span>
              )}
              {codeStats.emptyLines > 0 && (
                <span>Empty: {codeStats.emptyLines} lines</span>
              )}
            </div>
            {codeStats.hasInstructionalComments && (
              <div className="flex items-center gap-1 text-blue-400">
                <Info className="h-3 w-3" />
                <span>Has instructional comments</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get file extension for different languages
const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rust: "rs",
    php: "php",
    ruby: "rb",
    swift: "swift",
    kotlin: "kt",
  }
  return extensions[language.toLowerCase()] || "txt"
}

export default CodeVariationDisplay
