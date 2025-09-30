// Safe HTML rendering components to replace dangerouslySetInnerHTML
"use client"

import React from "react"
import {
  parseCodeWithHighlighting,
  parseTextWithReferences,
  validateSafeContent,
} from "../utils/htmlSanitizer"

// Safe HTML rendering components to replace dangerouslySetInnerHTML

interface SafeTextWithReferencesProps {
  text: string
  className?: string
  onReferenceClick?: (number: number) => void
}

/**
 * Safely render text with reference numbers like [1], [2], etc.
 * Replaces the unsafe formatTextWithReferences function
 */
export const SafeTextWithReferences: React.FC<SafeTextWithReferencesProps> = ({
  text,
  className = "",
  onReferenceClick,
}) => {
  const parts = parseTextWithReferences(text)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "reference" && part.number) {
          return (
            <button
              key={index}
              type="button"
              className="mx-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white transition-colors hover:bg-blue-700"
              onClick={() => onReferenceClick?.(part.number!)}
              title={`Reference ${part.number}`}
            >
              {part.number}
            </button>
          )
        }
        return <span key={index}>{part.content}</span>
      })}
    </span>
  )
}

interface SafeCodeHighlightProps {
  code: string
  language?: string
  fontSize?: number
  showLineNumbers?: boolean
  className?: string
}

/**
 * Safely render code with syntax highlighting
 * Replaces the unsafe formatCodeWithHighlighting function
 */
export const SafeCodeHighlight: React.FC<SafeCodeHighlightProps> = ({
  code,
  language,
  fontSize = 14,
  showLineNumbers = true,
  className = "",
}) => {
  const lines = parseCodeWithHighlighting(code, language)

  return (
    <div className={`font-mono ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="flex">
          {showLineNumbers && (
            <span
              className="w-12 flex-shrink-0 select-none pr-4 text-right text-slate-500"
              style={{ fontSize: `${fontSize}px` }}
            >
              {line.lineNumber}
            </span>
          )}
          <span
            className={`flex-1 ${line.isComment ? "italic text-green-400" : "text-slate-200"}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {line.hasReference && line.references ? (
              <SafeTextWithReferences text={line.content} />
            ) : (
              line.content
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

interface SafeContentProps {
  content: string
  fallback?: React.ReactNode
  className?: string
}

/**
 * Generic safe content renderer with validation
 */
export const SafeContent: React.FC<SafeContentProps> = ({
  content,
  fallback = null,
  className = "",
}) => {
  const validation = validateSafeContent(content)

  if (!validation.isSafe) {
    console.warn("Unsafe content detected:", validation.issues)
    return (
      <div
        className={`rounded border bg-yellow-50 p-2 text-yellow-600 ${className}`}
      >
        ⚠️ Content cannot be displayed safely
        {fallback}
      </div>
    )
  }

  // For now, just render as plain text
  // In a more advanced implementation, you could use a safe HTML parser
  return <div className={className}>{content}</div>
}

interface CodeReferenceProps {
  number: number
  onClick?: (number: number) => void
  className?: string
}

/**
 * Safe code reference component
 */
export const CodeReference: React.FC<CodeReferenceProps> = ({
  number,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-600 text-xs font-bold text-white transition-colors hover:bg-slate-500 ${className}`}
      onClick={() => onClick?.(number)}
      title={`Code reference ${number}`}
    >
      {number}
    </button>
  )
}

interface ReferenceListProps {
  references: number[]
  onReferenceClick?: (number: number) => void
  className?: string
}

/**
 * Render a list of code references safely
 */
export const ReferenceList: React.FC<ReferenceListProps> = ({
  references,
  onReferenceClick,
  className = "",
}) => {
  if (!references || references.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
        References:
      </span>
      {references.map((ref, index) => (
        <CodeReference key={index} number={ref} onClick={onReferenceClick} />
      ))}
    </div>
  )
}

interface SafeMarkdownProps {
  content: string
  className?: string
  allowedElements?: string[]
}

/**
 * Basic safe markdown-like rendering
 * This is a simple implementation - for production use a proper markdown library
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null

  // Simple markdown parsing for basic elements
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mb-2 mt-4 text-lg font-semibold">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mb-3 mt-6 text-xl font-semibold">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="mb-4 mt-8 text-2xl font-bold">
          {line.slice(2)}
        </h1>
      )
    }
    // Code blocks
    else if (line.startsWith("```")) {
      const codeLines: string[] = []
      let j = i + 1
      while (j < lines.length && !lines[j].startsWith("```")) {
        codeLines.push(lines[j])
        j++
      }
      if (j < lines.length) {
        elements.push(
          <pre
            key={i}
            className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4"
          >
            <code className="text-sm text-slate-200">
              {codeLines.join("\n")}
            </code>
          </pre>
        )
        i = j // Skip processed lines
      }
    }
    // Bullet points
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [line.slice(2)]
      let j = i + 1
      while (
        j < lines.length &&
        (lines[j].startsWith("- ") || lines[j].startsWith("* "))
      ) {
        listItems.push(lines[j].slice(2))
        j++
      }
      elements.push(
        <ul key={i} className="my-3 list-inside list-disc space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm">
              <SafeTextWithReferences text={item} />
            </li>
          ))}
        </ul>
      )
      i = j - 1 // Adjust for the outer loop increment
    }
    // Regular paragraphs
    else if (line.trim()) {
      elements.push(
        <p key={i} className="my-2 text-sm leading-relaxed">
          <SafeTextWithReferences text={line} />
        </p>
      )
    }
    // Empty lines
    else {
      elements.push(<div key={i} className="my-1" />)
    }
  }

  return <div className={className}>{elements}</div>
}
