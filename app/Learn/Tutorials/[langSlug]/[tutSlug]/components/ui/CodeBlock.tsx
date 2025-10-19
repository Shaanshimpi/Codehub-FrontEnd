/**
 * Enhanced code block component with syntax highlighting and copy functionality
 */
"use client"

import React, { useState } from "react"
import { processCodeExample } from "../../helpers/contentHelpers"

/**
 * Enhanced code block component with syntax highlighting and copy functionality
 */

/**
 * Enhanced code block component with syntax highlighting and copy functionality
 */

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  copyable?: boolean
  showLanguageLabel?: boolean
  highlightLines?: number[]
  maxHeight?: string
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  title,
  showLineNumbers = false,
  copyable = true,
  showLanguageLabel = true,
  highlightLines = [],
  maxHeight = "400px",
  className = "",
}) => {
  const [copied, setCopied] = useState(false)
  const { formatted, lineCount } = processCodeExample(code, language)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail if clipboard access is denied
      setCopied(false)
    }
  }

  const lines = formatted.split("\n")

  const getLanguageLabel = (lang: string): string => {
    const languageLabels: { [key: string]: string } = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      html: "HTML",
      css: "CSS",
      sql: "SQL",
      json: "JSON",
      bash: "Bash",
      shell: "Shell",
    }
    return languageLabels[lang.toLowerCase()] || lang.toUpperCase()
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      {(title || copyable || showLanguageLabel) && (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            {title && (
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {title}
              </h4>
            )}
            {showLanguageLabel && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                {getLanguageLabel(language)}
              </span>
            )}
            {lineCount > 1 && showLanguageLabel && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lineCount} lines
              </span>
            )}
          </div>
          {copyable && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Copy code"
            >
              {copied ? (
                <>
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Code Content */}
      <div
        className="relative overflow-auto bg-gray-900 text-gray-100"
        style={{ maxHeight }}
      >
        <pre className="p-4 text-sm">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, index) => (
                    <tr
                      key={index}
                      className={
                        highlightLines.includes(index + 1)
                          ? "bg-yellow-900/20"
                          : ""
                      }
                    >
                      <td className="w-8 select-none pr-4 text-right text-gray-500">
                        {index + 1}
                      </td>
                      <td className="text-gray-100">
                        {line || "\u00A0"}{" "}
                        {/* Non-breaking space for empty lines */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              formatted
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock
