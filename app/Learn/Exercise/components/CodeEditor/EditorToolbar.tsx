// Code editor toolbar with controls and actions
"use client"

import React, { memo } from "react"
import {
  Code2,
  Copy,
  Play,
  RotateCcw,
  Settings,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

// Code editor toolbar with controls and actions

interface FontControlsProps {
  fontSize: number
  onIncrease: () => void
  onDecrease: () => void
  onReset: () => void
  disabled?: boolean
}

/**
 * Font size control component
 */
export const FontControls: React.FC<FontControlsProps> = memo(
  ({ fontSize, onIncrease, onDecrease, onReset, disabled = false }) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-400">
          Font Size:
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onDecrease}
            disabled={disabled || fontSize <= 10}
            className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Decrease font size"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <span className="w-6 text-center text-xs text-slate-600 dark:text-slate-300">
            {fontSize}
          </span>
          <button
            onClick={onIncrease}
            disabled={disabled || fontSize >= 20}
            className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Increase font size"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
          <button
            onClick={onReset}
            disabled={disabled}
            className="ml-1 rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Reset font size"
            aria-label="Reset font size"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }
)

FontControls.displayName = "FontControls"

interface EditorActionsProps {
  onLoadBoilerplate?: () => void
  onRunCode: () => void
  onCopyCode: () => void
  onResetCode: () => void
  onToggleTheme?: () => void
  showLoadButton: boolean
  canRun: boolean
  isRunning: boolean
  disabled?: boolean
}

/**
 * Editor action buttons component
 */
export const EditorActions: React.FC<EditorActionsProps> = memo(
  ({
    onLoadBoilerplate,
    onRunCode,
    onCopyCode,
    onResetCode,
    onToggleTheme,
    showLoadButton,
    canRun,
    isRunning,
    disabled = false,
  }) => {
    return (
      <div className="flex gap-2">
        {/* Primary Actions */}
        {showLoadButton && onLoadBoilerplate && (
          <button
            onClick={onLoadBoilerplate}
            disabled={disabled}
            className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:flex-none"
            aria-label="Load boilerplate code"
          >
            <Code2 className="h-3.5 w-3.5" />
            Load Boilerplate
          </button>
        )}

        <button
          onClick={onRunCode}
          disabled={!canRun || isRunning || disabled}
          className="flex flex-1 items-center justify-center gap-1 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          title="Ctrl+Enter to run"
          aria-label={isRunning ? "Running code..." : "Run code"}
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? "Running..." : "Run Code"}
        </button>

        {/* Secondary Actions */}
        <button
          onClick={onCopyCode}
          disabled={disabled}
          className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={onResetCode}
          disabled={disabled}
          className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
          title="Reset code"
          aria-label="Reset code"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            disabled={disabled}
            className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Toggle theme"
            aria-label="Toggle editor theme"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )
  }
)

EditorActions.displayName = "EditorActions"

interface EditorStatusProps {
  language: string
  lineCount: number
  charCount: number
  isReady: boolean
}

/**
 * Editor status bar component
 */
export const EditorStatus: React.FC<EditorStatusProps> = memo(
  ({ language, lineCount, charCount, isReady }) => {
    if (!isReady) return null

    return (
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>Language: {language}</span>
          <span>Lines: {lineCount}</span>
          <span>Characters: {charCount}</span>
        </div>
        <div className="text-xs opacity-70">
          Ctrl+Enter to run • Ctrl+S to save
        </div>
      </div>
    )
  }
)

EditorStatus.displayName = "EditorStatus"

interface CodeInputProps {
  input: string
  onChange: (input: string) => void
  disabled?: boolean
  language: string
}

/**
 * Code input component for programs that require input
 */
export const CodeInput: React.FC<CodeInputProps> = memo(
  ({ input, onChange, disabled = false, language }) => {
    // Check if language supports input (implement your logic here)
    const supportsInput = ["python", "java", "c", "cpp"].includes(
      language.toLowerCase()
    )

    if (!supportsInput) return null

    return (
      <div className="mb-2">
        <label
          htmlFor="program-input"
          className="mb-1 block text-xs text-slate-600 dark:text-slate-400"
        >
          Program Input:
        </label>
        <textarea
          id="program-input"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          disabled={disabled}
          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Enter input for your program (each line will be passed as input)"
        />
      </div>
    )
  }
)

CodeInput.displayName = "CodeInput"
