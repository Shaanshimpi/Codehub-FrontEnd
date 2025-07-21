"use client"

import React, { useEffect, useState } from "react"
import type { ExerciseAIData } from "@/app/Learn/types/TutorialTypes"
import { useLanguage } from "@/app/contexts/LanguageContext"
import { ChevronDown, ChevronUp, Eye, X } from "lucide-react"
import {
  formatExplanationArray,
  formatHintsArray,
} from "./ExercisePreview/utils/exerciseFormatter"

interface ExercisePreviewProps {
  exerciseData: ExerciseAIData
  formData: any
  onBack: () => void
  onContinue: () => void
}

const ExercisePreview: React.FC<ExercisePreviewProps> = ({
  exerciseData,
  formData,
  onBack,
  onContinue,
}) => {
  const { language } = useLanguage()
  const [showHints, setShowHints] = useState(false)
  const [showCode, setShowCode] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)

  // Add useEffect to ensure logging happens after component mounts
  useEffect(() => {
    console.log("Exercise Data:", exerciseData)
    console.log("Form Data:", formData)
  }, [exerciseData, formData])

  // Get content based on current language
  const getContent = () => {
    switch (language) {
      case "hi":
        return {
          title: exerciseData.title_hi,
          hints: exerciseData.hints_hi,
          explanation: exerciseData.explanation_hi,
        }
      case "mr":
        return {
          title: exerciseData.title_mr,
          hints: exerciseData.hints_mr,
          explanation: exerciseData.explanation_mr,
        }
      default:
        return {
          title: exerciseData.title_en,
          hints: exerciseData.hints_en,
          explanation: exerciseData.explanation_en,
        }
    }
  }

  const content = getContent()

  // Enhanced syntax highlighting function - Fixed to return JSX properly
  const highlightCode = (code: string) => {
    if (!code) return <span>No code available</span>

    // Convert \n to <br> tags for proper line breaks in HTML
    const htmlCode = code.replace(/\n/g, "<br>")

    // Since the code is already formatted as HTML with inline CSS from the AI,
    // we just need to render it directly using dangerouslySetInnerHTML
    return (
      <div
        className="font-mono text-sm leading-relaxed"
        style={{
          backgroundColor: "#111827",
          fontFamily: "'Fira Code', 'Consolas', monospace",
          padding: "1rem",
          borderRadius: "0.375rem",
          color: "white",
          whiteSpace: "pre",
          overflow: "auto",
          maxHeight: "400px",
        }}
        dangerouslySetInnerHTML={{ __html: htmlCode }}
      />
    )
  }

  // Helper function to highlight a single line
  //   const highlightLine = (line: string, lineIndex: number) => {
  //     if (!line.trim()) {
  //         return line;
  //     //   return <span className="text-gray-300">{line || '\u00A0'}</span>; // Use non-breaking space for empty lines
  //     }

  //     // Simple patterns for highlighting
  //     const patterns = [
  //       { regex: /\/\/.*$/g, className: 'text-gray-400 italic' }, // Comments
  //       { regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, className: 'text-green-300' }, // Strings
  //       { regex: /\b\d+\.?\d*\b/g, className: 'text-blue-300' }, // Numbers
  //       { regex: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|public|private|protected|static|readonly|abstract|int|main|printf|scanf|include|stdio)\b/g, className: 'text-purple-300 font-medium' }, // Keywords
  //       { regex: /\b(string|number|boolean|object|array|void|null|undefined|any|never|unknown)\b/g, className: 'text-cyan-300' }, // Types
  //       { regex: /[{}();,]/g, className: 'text-gray-400' }, // Punctuation
  //       { regex: /[=+\-*/%<>!&|]/g, className: 'text-orange-300' }, // Operators
  //     ];

  //     let result = line;
  //     let tokens = [];
  //     let lastIndex = 0;

  //     // Find all matches for all patterns
  //     let allMatches = [];
  //     patterns.forEach((pattern, patternIndex) => {
  //       let match;
  //       const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
  //       while ((match = regex.exec(line)) !== null) {
  //         allMatches.push({
  //           start: match.index,
  //           end: match.index + match[0].length,
  //           text: match[0],
  //           className: pattern.className,
  //           patternIndex
  //         });
  //       }
  //     });

  //     // Sort matches by position
  //     allMatches.sort((a, b) => a.start - b.start);

  //     // Remove overlapping matches (keep first one)
  //     const filteredMatches = [];
  //     let lastEnd = 0;
  //     for (const match of allMatches) {
  //       if (match.start >= lastEnd) {
  //         filteredMatches.push(match);
  //         lastEnd = match.end;
  //       }
  //     }

  //     // Build tokens
  //     filteredMatches.forEach((match, index) => {
  //       // Add text before match
  //       if (match.start > lastIndex) {
  //         tokens.push(
  //           <span key={`${lineIndex}-text-${index}`} className="text-gray-300">
  //             {line.substring(lastIndex, match.start)}
  //           </span>
  //         );
  //       }

  //       // Add highlighted match
  //       tokens.push(
  //         <span key={`${lineIndex}-match-${index}`} className={match.className}>
  //           {match.text}
  //         </span>
  //       );

  //       lastIndex = match.end;
  //     });

  //     // Add remaining text
  //     if (lastIndex < line.length) {
  //       tokens.push(
  //         <span key={`${lineIndex}-remaining`} className="text-gray-300">
  //           {line.substring(lastIndex)}
  //         </span>
  //       );
  //     }

  //     return tokens.length > 0 ? (
  //       <span>{tokens}</span>
  //     ) : (
  //       <span className="text-gray-300">{line}</span>
  //     );
  //   };

  // Helper function to format hints - Fixed to return JSX
  const formatHints = (hintsText: string) => {
    if (!hintsText) return <p className="text-gray-500">No hints available</p>

    const lines = hintsText.split("\n").filter((line) => line.trim())

    const isNumberedList = lines.some((line) => /^\d+\./.test(line.trim()))
    const isBulletList = lines.some((line) => line.trim().startsWith("- "))

    if (isNumberedList) {
      return (
        <div className="space-y-2">
          {lines.map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="min-w-[24px] font-medium text-blue-600">
                {index + 1}.
              </span>
              <span className="text-gray-700">
                {line.replace(/^\d+\.\s*/, "")}
              </span>
            </div>
          ))}
        </div>
      )
    } else if (isBulletList) {
      return (
        <div className="space-y-2">
          {lines.map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-1 min-w-[16px] text-blue-600">•</span>
              <div className="text-gray-700">
                {formatTextWithInlineCode(line.replace(/^-\s*/, ""))}
              </div>
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div className="whitespace-pre-line text-gray-700">
          {formatTextWithInlineCode(hintsText)}
        </div>
      )
    }
  }

  // Helper function to format text with inline code and bold - returns JSX
  const formatTextWithInlineCode = (text: string) => {
    if (!text) return text

    const parts = []
    let lastIndex = 0

    // Handle code blocks first
    const codeMatches = [...text.matchAll(/`([^`]+)`/g)]
    codeMatches.forEach((match, index) => {
      // Add text before code
      if (match.index! > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index)
        parts.push(formatBoldText(beforeText, `before-${index}`))
      }

      // Add code
      parts.push(
        <code
          key={`code-${index}`}
          className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm"
        >
          {match[1]}
        </code>
      )

      lastIndex = match.index! + match[0].length
    })

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex)
      parts.push(formatBoldText(remainingText, "remaining"))
    }

    return parts.length > 0 ? parts : text
  }

  // Helper function to format bold text - returns JSX
  const formatBoldText = (text: string, key: string) => {
    const boldMatches = [...text.matchAll(/\*\*(.*?)\*\*/g)]
    if (boldMatches.length === 0) return text

    const parts = []
    let lastIndex = 0

    boldMatches.forEach((match, index) => {
      if (match.index! > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      parts.push(
        <strong
          key={`${key}-bold-${index}`}
          className="font-semibold text-gray-800"
        >
          {match[1]}
        </strong>
      )

      lastIndex = match.index! + match[0].length
    })

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts
  }

  // Helper function to format explanations - Fixed to return JSX
  // Helper function to format explanations - Updated to handle numbered references and mermaid diagrams
  const formatExplanation = (explanationText: string) => {
    if (!explanationText)
      return <p className="text-gray-500">No explanation available</p>

    // Split by code blocks and mermaid diagrams
    const sections = explanationText.split(/(```[\s\S]*?```)/)

    return (
      <div className="space-y-4">
        {sections.map((section, index) => {
          // Check if this is a code block
          if (section.startsWith("```") && section.endsWith("```")) {
            const codeContent = section.slice(3, -3)

            // Check if it's a mermaid diagram
            if (codeContent.trim().startsWith("mermaid")) {
              const mermaidCode = codeContent.replace(/^mermaid\s*/, "").trim()
              return (
                <div
                  key={index}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-medium text-blue-600">
                      📊 Flowchart
                    </span>
                  </div>
                  <div className="whitespace-pre-line rounded border bg-white p-4 font-mono text-sm text-gray-700">
                    {mermaidCode}
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    Note: This is a flowchart representation of the program
                    logic
                  </div>
                </div>
              )
            } else {
              // Regular code block
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900"
                >
                  <div className="border-b border-gray-700 bg-gray-800 px-4 py-2 font-mono text-xs text-gray-400">
                    Code
                  </div>
                  <div className="overflow-x-auto p-4">
                    {highlightCode(codeContent)}
                  </div>
                </div>
              )
            }
          } else {
            // Regular text section
            const lines = section.split("\n")
            return (
              <div key={index} className="space-y-3">
                {lines.map((line, lineIndex) => {
                  const trimmedLine = line.trim()
                  if (!trimmedLine) return null

                  // Check for numbered references like [1], [2], etc.
                  const numberedRefMatch =
                    trimmedLine.match(/^\[(\d+)\]\s*(.*)$/)
                  if (numberedRefMatch) {
                    const [, number, restOfLine] = numberedRefMatch

                    return (
                      <div
                        key={lineIndex}
                        className="flex items-start gap-3 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3"
                      >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                          {number}
                        </span>
                        <div className="leading-relaxed text-gray-700">
                          {formatTextWithInlineCode(restOfLine)}
                        </div>
                      </div>
                    )
                  }

                  // Regular text with formatting
                  return (
                    <div
                      key={lineIndex}
                      className="leading-relaxed text-gray-700"
                    >
                      {formatTextWithInlineCode(trimmedLine)}
                    </div>
                  )
                })}
              </div>
            )
          }
        })}
      </div>
    )
  }

  const RevealButton = ({
    show,
    setShow,
    children,
    label,
  }: {
    show: boolean
    setShow: (show: boolean) => void
    children: React.ReactNode
    label: string
  }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setShow(!show)}
        className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-100"
      >
        {label}
        {show ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {show && <div className="bg-white p-4">{children}</div>}
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Exercise Preview</h1>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={onContinue}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <Eye className="h-4 w-4" />
            Continue to Submit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Exercise Title */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Exercise Title
          </h2>
          <p className="text-gray-700">
            {content.title || "No title available"}
          </p>
        </div>

        {/* Hints Section */}
        <RevealButton
          show={showHints}
          setShow={setShowHints}
          label="💡 Show Hints"
        >
          {formatHintsArray(content.hints)}
        </RevealButton>

        {/* Code Section */}
        <RevealButton
          show={showCode}
          setShow={setShowCode}
          label="💻 Show Code"
        >
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2 font-mono text-xs text-gray-400">
              <span>Code</span>
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              {highlightCode(exerciseData.code || "No code available")}
            </div>
          </div>
        </RevealButton>

        {/* Explanation Section */}
        <RevealButton
          show={showExplanation}
          setShow={setShowExplanation}
          label="📝 Show Explanation"
        >
          {formatExplanationArray(content.explanation)}
        </RevealButton>

        {/* Metadata */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-800">Difficulty</h3>
            <p className="text-gray-700">
              {formData?.difficulty === 1
                ? "Beginner"
                : formData?.difficulty === 2
                  ? "Intermediate"
                  : "Advanced"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-800">Slug</h3>
            <p className="text-gray-700">
              {formData?.slug || "No slug available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExercisePreview
