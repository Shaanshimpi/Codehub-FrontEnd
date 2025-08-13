"use client"

import React, { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

const CodeBlock = ({
  code,
  language,
  title,
  showLineNumbers = true,
  className = "",
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const getLanguageLabel = (lang: string) => {
    const langMap: Record<string, string> = {
      javascript: "JavaScript",
      js: "JavaScript",
      typescript: "TypeScript",
      ts: "TypeScript",
      python: "Python",
      py: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      csharp: "C#",
      cs: "C#",
      php: "PHP",
      ruby: "Ruby",
      go: "Go",
      rust: "Rust",
      kotlin: "Kotlin",
      swift: "Swift",
      html: "HTML",
      css: "CSS",
      sql: "SQL",
      bash: "Bash",
      shell: "Shell",
      json: "JSON",
      xml: "XML",
      yaml: "YAML",
      markdown: "Markdown",
      md: "Markdown",
    }
    return langMap[lang.toLowerCase()] || lang.toUpperCase()
  }

  const lines = code.split("\n")

  return (
    <div className={`code-block-container ${className}`}>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-900 dark:border-slate-600 dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2 dark:border-slate-600 dark:bg-slate-700">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            {title && (
              <span className="ml-2 text-sm text-gray-300 dark:text-gray-400">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400 dark:bg-slate-600 dark:text-gray-500">
              {getLanguageLabel(language)}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-gray-300 transition-colors hover:text-white dark:text-gray-400 dark:hover:text-gray-200"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code content */}
        <div className="relative">
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
            <code className="text-gray-100 dark:text-gray-200">
              {showLineNumbers ? (
                <div className="table w-full">
                  {lines.map((line, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell w-8 select-none pr-4 text-right font-mono text-xs text-gray-500 dark:text-gray-600">
                        {index + 1}
                      </div>
                      <div className="table-cell">
                        <span className="whitespace-pre">
                          {line || "\u00A0"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="whitespace-pre">{code}</span>
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CodeBlock
