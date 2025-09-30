// Exercise panel layout components
"use client"

import React from "react"
import { PanelResizer } from "./ExerciseControls"

// Exercise panel layout components

interface ExercisePanelLayoutProps {
  isFullscreen: boolean
  panelWidth: number
  onPanelResize?: (e: React.MouseEvent) => void
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  className?: string
}

/**
 * Two-panel layout with resizable divider
 */
export const ExercisePanelLayout: React.FC<ExercisePanelLayoutProps> = ({
  isFullscreen,
  panelWidth,
  onPanelResize,
  leftPanel,
  rightPanel,
  className = "",
}) => {
  return (
    <div className={`${isFullscreen ? "h-screen" : ""} ${className}`}>
      <div className="lg:flex">
        {/* Left Panel */}
        <div
          className={`lg:border-r lg:border-slate-200 lg:dark:border-slate-700 ${
            !isFullscreen ? "lg:h-full lg:w-1/2" : "lg:flex-none"
          }`}
          style={isFullscreen ? { width: `${panelWidth}%` } : {}}
        >
          {leftPanel}
        </div>

        {/* Resize Handle */}
        <PanelResizer
          onMouseDown={onPanelResize || (() => {})}
          isVisible={isFullscreen && !!onPanelResize}
        />

        {/* Right Panel */}
        <div
          className={`${!isFullscreen ? "lg:h-full lg:w-1/2" : "lg:flex-1"}`}
          style={
            isFullscreen ? { width: `calc(${100 - panelWidth}% - 4px)` } : {}
          }
        >
          {rightPanel}
        </div>
      </div>
    </div>
  )
}

interface ResponsivePanelProps {
  isFullscreen: boolean
  showOnMobile: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Responsive panel that adapts to mobile/desktop and fullscreen modes
 */
export const ResponsivePanel: React.FC<ResponsivePanelProps> = ({
  isFullscreen,
  showOnMobile,
  children,
  className = "",
  style = {},
}) => {
  const mobileClasses = showOnMobile
    ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-6rem)]"} overflow-y-auto`
    : "hidden lg:block"

  const desktopClasses = !isFullscreen
    ? "lg:h-full lg:overflow-y-auto"
    : "lg:flex-none"

  return (
    <div
      className={`${mobileClasses} ${desktopClasses} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
