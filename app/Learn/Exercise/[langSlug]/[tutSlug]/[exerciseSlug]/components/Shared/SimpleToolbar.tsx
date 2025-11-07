// Simple toolbar with Run + Help buttons
"use client"

import React from "react"
import {
  HelpCircle,
  Minus,
  Play,
  Plus,
  RefreshCcw,
  Terminal,
} from "lucide-react"

// Simple toolbar with Run + Help buttons

// Simple toolbar with Run + Help buttons

interface SimpleToolbarProps {
  onRunCode: () => void
  onToggleHelp: () => void
  canRun: boolean
  isRunning: boolean
  isHelpOpen: boolean
  codeLength: number
  showInputSection: boolean
  onToggleInput: () => void
  hasInput: boolean
  showInputButton?: boolean
  showRunButton?: boolean
  onEditorZoomIn: () => void
  onEditorZoomOut: () => void
  onOutputZoomIn: () => void
  onOutputZoomOut: () => void
  onResetZoom: () => void
  isEditorReady: boolean
}

const SimpleToolbar: React.FC<SimpleToolbarProps> = ({
  onRunCode,
  onToggleHelp,
  canRun,
  isRunning,
  isHelpOpen,
  language,
  codeLength,
  showInputSection,
  onToggleInput,
  hasInput,
  showInputButton = true,
  showRunButton = true,
  onEditorZoomIn,
  onEditorZoomOut,
  onOutputZoomIn,
  onOutputZoomOut,
  onResetZoom,
  isEditorReady,
}) => {
  return (
    <div className="toolbar-enter border-t border-gray-300 bg-white px-3 py-2 shadow-lg dark:border-gray-600 dark:bg-black">
      <div className="flex items-center justify-between">
        {/* Left: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Run Button */}
          {showRunButton && (
            <button
              onClick={onRunCode}
              disabled={!canRun || isRunning}
              className={`focus-ring toolbar-button group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg ${
                !canRun || isRunning
                  ? "cursor-not-allowed bg-gray-400 opacity-50"
                  : "btn-primary btn-shimmer"
              } ${isRunning ? "loading-pulse" : ""}`}
              title={
                isRunning
                  ? "Running code..."
                  : canRun
                    ? "Run your code"
                    : "Write some code first"
              }
              aria-label={
                isRunning
                  ? "Code is running"
                  : canRun
                    ? "Run your code"
                    : "Write some code first before running"
              }
              aria-describedby="run-button-status"
            >
              <Play
                className={`h-4 w-4 transition-transform duration-300 ${!isRunning ? "group-hover:scale-110" : "animate-spin"}`}
              />
              <span className="relative">
                {isRunning ? "Running..." : "Run Code"}
                {!isRunning && canRun && (
                  <span className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[200%]" />
                )}
              </span>
            </button>
          )}

          {/* Input Toggle Button */}
          {showInputButton && (
            <div className="relative">
              <button
                onClick={onToggleInput}
                className={`focus-ring toolbar-button group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-md ${
                  showInputSection
                    ? "btn-warning"
                    : "bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-yellow-50 hover:text-yellow-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-300"
                }`}
                title={
                  showInputSection
                    ? "Hide input section"
                    : "Show input section for scanf, cin, etc."
                }
                aria-label={
                  showInputSection
                    ? "Hide program input section"
                    : "Show program input section for scanf, cin, and similar input operations"
                }
                aria-expanded={showInputSection}
              >
                <Terminal className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="hidden sm:inline">Input</span>
                {hasInput && (
                  <div
                    className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-yellow-500 dark:border-gray-900"
                    title="Has input data"
                  />
                )}
              </button>
            </div>
          )}

          {/* Help Button */}
          <div className="relative">
            <button
              onClick={onToggleHelp}
              className={`focus-ring toolbar-button group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-md ${
                isHelpOpen
                  ? "btn-success"
                  : "bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-green-50 hover:text-green-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-300"
              }`}
              title={
                isHelpOpen ? "Close help menu" : "Get help with this exercise"
              }
              aria-label={
                isHelpOpen
                  ? "Close help menu"
                  : "Open help menu with starter code and instructions"
              }
              aria-expanded={isHelpOpen}
              aria-haspopup="menu"
            >
              <HelpCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Need Help?</span>
            </button>
          </div>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded border border-gray-300 p-1 text-gray-600 dark:border-gray-600 dark:text-gray-300">
            <button
              onClick={onEditorZoomOut}
              className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              title="Zoom out editor"
              aria-label="Zoom out editor"
              disabled={!isEditorReady}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onEditorZoomIn}
              className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              title="Zoom in editor"
              aria-label="Zoom in editor"
              disabled={!isEditorReady}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-600" />
            <button
              onClick={onOutputZoomOut}
              className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              title="Zoom out output"
              aria-label="Zoom out output"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              onClick={onOutputZoomIn}
              className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              title="Zoom in output"
              aria-label="Zoom in output"
            >
              <Plus className="h-3 w-3" />
            </button>
            <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-600" />
            <button
              onClick={onResetZoom}
              className="rounded p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="hidden text-xs font-medium text-gray-500 dark:text-gray-400 sm:inline">
            {codeLength} chars
          </span>
        </div>
      </div>
    </div>
  )
}

export default SimpleToolbar
