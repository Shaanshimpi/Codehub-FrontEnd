// Code editor output display component
"use client"

import React, { memo } from "react"

// Code editor output display component

interface EditorOutputProps {
  output: string
  isRunning: boolean
  onClear: () => void
  language: string
  className?: string
}

/**
 * Code execution output display component
 */
const EditorOutput: React.FC<EditorOutputProps> = ({
  output,
  isRunning,
  onClear,
  language,
  className = "",
}) => {
  // Don't render if no output and not running
  if (!output && !isRunning) return null

  return (
    <div
      className={`border-t border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {/* Output Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-2 py-1 dark:border-slate-700">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Output
        </span>
        {output && !isRunning && (
          <button
            onClick={onClear}
            className="rounded text-xs text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Clear output"
          >
            Clear
          </button>
        )}
      </div>

      {/* Output Content */}
      <div className="max-h-40 overflow-y-auto p-2">
        {isRunning ? (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent" />
            <span className="text-xs">Executing {language} code...</span>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 dark:text-slate-200">
            {output}
          </pre>
        )}
      </div>
    </div>
  )
}

// Custom comparison function for EditorOutput
const editorOutputPropsEqual = (
  prevProps: EditorOutputProps,
  nextProps: EditorOutputProps
): boolean => {
  return (
    prevProps.output === nextProps.output &&
    prevProps.isRunning === nextProps.isRunning &&
    prevProps.language === nextProps.language &&
    prevProps.className === nextProps.className
  )
}

export default memo(EditorOutput, editorOutputPropsEqual)
