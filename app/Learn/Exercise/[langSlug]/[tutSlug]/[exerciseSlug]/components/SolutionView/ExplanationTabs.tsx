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

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExplanationTabs.tsx

interface ExplanationTabsProps {
  explanation: any[]
}

const ExplanationTabs: React.FC<ExplanationTabsProps> = ({ explanation }) => {
  if (!explanation || explanation.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center text-black dark:text-white">
        <div>
          <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-bold">No Explanation Available</p>
          <p className="mt-2 text-sm font-medium">
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
            "bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 shadow-lg",
          icon: "bg-black dark:bg-white text-white dark:text-black p-1 rounded-md",
          text: "text-black dark:text-white font-medium",
          accent: "text-blue-900 dark:text-blue-100",
        }
      case "warning":
        return {
          container:
            "bg-white dark:bg-gray-900 border border-red-200 dark:border-red-700 shadow-lg",
          icon: "bg-black dark:bg-white text-white dark:text-black p-1 rounded-md",
          text: "text-black dark:text-white font-medium",
          accent: "text-red-900 dark:text-red-100",
        }
      case "tip":
        return {
          container:
            "bg-white dark:bg-gray-900 border border-green-200 dark:border-green-700 shadow-lg",
          icon: "bg-black dark:bg-white text-white dark:text-black p-1 rounded-md",
          text: "text-black dark:text-white font-medium",
          accent: "text-green-900 dark:text-green-100",
        }
      case "concept":
        return {
          container:
            "bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-700 shadow-lg",
          icon: "bg-black dark:bg-white text-white dark:text-black p-1 rounded-md",
          text: "text-black dark:text-white font-medium",
          accent: "text-purple-900 dark:text-purple-100",
        }
      default:
        return {
          container:
            "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow-lg",
          icon: "bg-black dark:bg-white text-white dark:text-black p-1 rounded-md",
          text: "text-black dark:text-white font-medium",
          accent: "text-black dark:text-white",
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
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-300 shadow-lg dark:border-gray-600">
          <div className="flex items-center justify-between bg-black px-4 py-2 dark:bg-white">
            <span className="font-mono text-sm font-bold text-white dark:text-black">
              {language || "code"}
            </span>
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="bg-gray-900 p-4 dark:bg-gray-100">
            <pre className="overflow-x-auto text-sm font-medium text-gray-200 dark:text-gray-800">
              <code>{code.trim()}</code>
            </pre>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900">
        <h3 className="mb-2 text-lg font-bold text-black dark:text-white">
          Step-by-Step Solution
        </h3>
        <p className="text-sm font-medium text-black dark:text-white">
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
              <div className={`rounded-lg p-3 ${styles.container}`}>
                <div className="flex items-start gap-3">
                  <div className={styles.icon}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${styles.accent}`}>
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
            <div className={`rounded-lg p-3 ${styles.container}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 flex-shrink-0 ${styles.icon}`}>
                  <Icon className="h-4 w-4" />
                </div>
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
