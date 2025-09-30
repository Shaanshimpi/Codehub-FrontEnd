// Exercise control components (fullscreen, panel resize, etc.)
"use client"

import React from "react"
import { Maximize2, Minimize2 } from "lucide-react"

// Exercise control components (fullscreen, panel resize, etc.)

interface FullscreenToggleProps {
  isFullscreen: boolean
  onToggle: () => void
  className?: string
}

/**
 * Fullscreen toggle button component
 */
export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  isFullscreen,
  onToggle,
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed right-4 z-50 rounded-lg bg-blue-600 p-2 text-white shadow-lg transition-all hover:bg-blue-700 ${
        isFullscreen ? "top-4" : "bottom-4 lg:bottom-auto lg:top-20"
      } ${className}`}
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullscreen ? (
        <Minimize2 className="h-5 w-5" />
      ) : (
        <Maximize2 className="h-5 w-5" />
      )}
    </button>
  )
}

interface PanelResizerProps {
  onMouseDown: (e: React.MouseEvent) => void
  isVisible: boolean
  className?: string
}

/**
 * Panel resize handle component
 */
export const PanelResizer: React.FC<PanelResizerProps> = ({
  onMouseDown,
  isVisible,
  className = "",
}) => {
  if (!isVisible) return null

  return (
    <button
      className={`hidden w-1 flex-none cursor-col-resize bg-slate-300 transition-colors hover:bg-blue-500 focus:bg-blue-500 focus:outline-none lg:block ${className}`}
      onMouseDown={onMouseDown}
      title="Drag to resize panels"
      aria-label="Resize panels"
    />
  )
}

interface ExerciseContainerProps {
  isFullscreen: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Main exercise container with fullscreen support
 */
export const ExerciseContainer: React.FC<ExerciseContainerProps> = ({
  isFullscreen,
  children,
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen bg-white dark:bg-slate-900 ${
        isFullscreen ? "fixed inset-0 z-50" : "pt-14"
      } ${className}`}
    >
      {children}
    </div>
  )
}
