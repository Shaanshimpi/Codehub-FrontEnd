// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExplanationTabs.tsx
"use client"

import React from "react"
import {
  ReferenceList,
  SafeTextWithReferences,
} from "@/app/Learn/Exercise/components/SafeHTML"
import { AlertTriangle, Code, FileText, Lightbulb, Target } from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExplanationTabs.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExplanationTabs.tsx

interface ExplanationTabsProps {
  explanation: any[]
}

const ExplanationTabs: React.FC<ExplanationTabsProps> = ({ explanation }) => {
  if (!explanation || explanation.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
        <div>
          <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No Explanation Available</p>
          <p className="mt-2 text-sm">
            The explanation content is not available for the selected language.
          </p>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code":
      case "solution_code":
        return Code
      case "warning":
        return AlertTriangle
      case "tip":
        return Lightbulb
      case "concept":
        return Target
      default:
        return FileText
    }
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "code":
      case "solution_code":
        return {
          container:
            "bg-blue-50 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-800 dark:text-blue-200",
        }
      case "warning":
        return {
          container:
            "bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20 dark:border-red-400",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-800 dark:text-red-200",
        }
      case "tip":
        return {
          container:
            "bg-green-50 border-l-4 border-green-500 dark:bg-green-900/20 dark:border-green-400",
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-800 dark:text-green-200",
        }
      case "concept":
        return {
          container:
            "bg-purple-50 border-l-4 border-purple-500 dark:bg-purple-900/20 dark:border-purple-400",
          icon: "text-purple-600 dark:text-purple-400",
          text: "text-purple-800 dark:text-purple-200",
        }
      default:
        return {
          container:
            "bg-slate-50 border-l-4 border-slate-300 dark:bg-slate-800/50 dark:border-slate-600",
          icon: "text-slate-600 dark:text-slate-400",
          text: "text-slate-800 dark:text-slate-200",
        }
    }
  }

  // Removed unsafe formatTextWithReferences function
  // Now using SafeTextWithReferences component instead

  const renderCodeBlock = (text: string) => {
    // Extract code from markdown-style code blocks
    const codeMatch = text.match(/```(\w+)?\n([\s\S]*?)\n```/)
    if (codeMatch) {
      const [, language, code] = codeMatch
      return (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
            <span className="font-mono text-sm text-slate-300">
              {language || "code"}
            </span>
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="bg-slate-900 p-4">
            <pre className="overflow-x-auto text-sm text-slate-200">
              <code>{code.trim()}</code>
            </pre>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Step-by-Step Solution
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Follow along as we break down the solution into manageable steps.
        </p>
      </div>

      {explanation.map((item: any, index: number) => {
        const Icon = getTypeIcon(item.type || "text")
        const styles = getTypeStyles(item.type || "text")

        // Handle solution code separately
        if (item.type === "solution_code") {
          return (
            <div key={item.id || index} className="space-y-3">
              <div className={`rounded-lg p-4 ${styles.container}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`mt-1 h-5 w-5 ${styles.icon}`} />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${styles.text}`}>
                      Complete Solution Code
                    </h4>
                    <p className={`mt-1 text-sm ${styles.text}`}>
                      {`Here's the complete working solution:`}
                    </p>
                  </div>
                </div>
                {renderCodeBlock(item.text)}
              </div>
            </div>
          )
        }

        // Handle regular explanation items
        return (
          <div key={item.id || index} className="space-y-3">
            <div className={`rounded-lg p-4 ${styles.container}`}>
              <div className="flex items-start gap-3">
                <Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${styles.icon}`} />
                <div className="min-w-0 flex-1">
                  <div className={`prose prose-sm max-w-none ${styles.text}`}>
                    <SafeTextWithReferences
                      text={item.text}
                      onReferenceClick={(number) => {
                        // Handle reference click - could scroll to code section
                        console.log(`Reference ${number} clicked`)
                      }}
                    />
                  </div>

                  {/* Show code references if available */}
                  {item.code_ref && item.code_ref.length > 0 && (
                    <div className="mt-3">
                      <ReferenceList
                        references={item.code_ref.map(
                          (ref: any) => ref.ref_number || 0
                        )}
                        onReferenceClick={(number) => {
                          // Handle reference click - could highlight code
                          console.log(`Code reference ${number} clicked`)
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ExplanationTabs
