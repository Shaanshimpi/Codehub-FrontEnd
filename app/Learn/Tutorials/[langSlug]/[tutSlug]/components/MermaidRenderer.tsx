"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import type { MermaidConfig } from "mermaid"

interface MermaidRendererProps {
  code: string
  className?: string
  theme?: "light" | "dark"
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  code,
  className = "",
  theme = "light",
}) => {
  const [renderedSVG, setRenderedSVG] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const renderCountRef = useRef<number>(0)

  // Auto-detect theme from CSS if not provided
  const detectTheme = useCallback(() => {
    if (typeof window !== "undefined") {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      return isDark ? "dark" : "light"
    }
    return "light"
  }, [])

  const currentTheme = theme || detectTheme()

  // Enhanced theme configurations with string injection
  const getThemeConfig = useCallback(
    (themeMode: "light" | "dark"): MermaidConfig => {
      const isDark = themeMode === "dark"

      // Enhanced color palette with better visual hierarchy
      const colors = {
        light: {
          // Core brand colors
          primary: "#2563eb", // blue-600 - stronger blue
          secondary: "#7c3aed", // violet-600 - rich purple
          tertiary: "#0891b2", // cyan-600 - teal accent

          // Special node colors
          startNode: "#059669", // emerald-600 - vibrant green for start
          endNode: "#dc2626", // red-600 - strong red for end
          processNode: "#1d4ed8", // blue-700 - deep blue for processes
          decisionNode: "#f59e0b", // amber-500 - warm orange for decisions

          // Surface colors
          background: "#ffffff", // white
          surface: "#f8fafc", // slate-50
          surfaceHover: "#f1f5f9", // slate-100
          border: "#cbd5e1", // slate-300 - stronger borders
          borderHover: "#94a3b8", // slate-400

          // Text colors
          text: "#0f172a", // slate-900 - darker text
          textSecondary: "#475569", // slate-600
          textLight: "#ffffff", // white text for colored backgrounds

          // Status colors
          success: "#059669", // emerald-600
          warning: "#d97706", // amber-600
          error: "#dc2626", // red-600
          info: "#0284c7", // sky-600

          // Gradient colors
          gradientStart: "#3b82f6", // blue-500
          gradientEnd: "#8b5cf6", // violet-500
        },
        dark: {
          // Core brand colors
          primary: "#3b82f6", // blue-500 - bright blue
          secondary: "#a855f7", // purple-500 - vivid purple
          tertiary: "#06b6d4", // cyan-500 - bright cyan

          // Special node colors
          startNode: "#10b981", // emerald-500 - bright green for start
          endNode: "#f87171", // red-400 - softer red for dark mode
          processNode: "#60a5fa", // blue-400 - bright blue for processes
          decisionNode: "#fbbf24", // amber-400 - bright yellow for decisions

          // Surface colors
          background: "#0f172a", // slate-900
          surface: "#1e293b", // slate-800
          surfaceHover: "#334155", // slate-700
          border: "#475569", // slate-600 - stronger borders
          borderHover: "#64748b", // slate-500

          // Text colors
          text: "#f8fafc", // slate-50 - lighter text
          textSecondary: "#cbd5e1", // slate-300
          textLight: "#0f172a", // dark text for light backgrounds

          // Status colors
          success: "#34d399", // emerald-400
          warning: "#fbbf24", // amber-400
          error: "#f87171", // red-400
          info: "#38bdf8", // sky-400

          // Gradient colors
          gradientStart: "#60a5fa", // blue-400
          gradientEnd: "#a78bfa", // violet-400
        },
      }

      const palette = colors[themeMode]

      // Custom CSS for enhanced styling with string injection
      const customThemeCSS = `
      .mermaid {
        font-family: 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', sans-serif;
        background: ${palette.background};
        color: ${palette.text};
      }

      /* Enhanced Flowchart styling */
      .mermaid .node rect,
      .mermaid .node circle,
      .mermaid .node ellipse,
      .mermaid .node polygon {
        fill: ${palette.surface};
        stroke: ${palette.border};
        stroke-width: 2px;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, ${isDark ? "0.4" : "0.15"}));
        transition: all 0.3s ease;
      }

      /* Start nodes - Distinctive green styling */
      .mermaid .node.start rect,
      .mermaid .node.start circle,
      .mermaid g[id*="Start"] rect,
      .mermaid g[id*="start"] rect,
      .mermaid g[id*="Begin"] rect,
      .mermaid g[id*="begin"] rect {
        fill: ${palette.startNode} !important;
        stroke: ${palette.startNode} !important;
        stroke-width: 3px !important;
        filter: drop-shadow(0 3px 12px ${palette.startNode}40) !important;
      }

      .mermaid .node.start .nodeLabel,
      .mermaid g[id*="Start"] .nodeLabel,
      .mermaid g[id*="start"] .nodeLabel,
      .mermaid g[id*="Begin"] .nodeLabel,
      .mermaid g[id*="begin"] .nodeLabel {
        fill: ${palette.textLight} !important;
        font-weight: 700 !important;
        font-size: 14px !important;
      }

      /* End nodes - Distinctive red styling */
      .mermaid .node.end rect,
      .mermaid .node.end circle,
      .mermaid g[id*="End"] rect,
      .mermaid g[id*="end"] rect,
      .mermaid g[id*="Stop"] rect,
      .mermaid g[id*="stop"] rect,
      .mermaid g[id*="Finish"] rect,
      .mermaid g[id*="finish"] rect {
        fill: ${palette.endNode} !important;
        stroke: ${palette.endNode} !important;
        stroke-width: 3px !important;
        filter: drop-shadow(0 3px 12px ${palette.endNode}40) !important;
      }

      .mermaid .node.end .nodeLabel,
      .mermaid g[id*="End"] .nodeLabel,
      .mermaid g[id*="end"] .nodeLabel,
      .mermaid g[id*="Stop"] .nodeLabel,
      .mermaid g[id*="stop"] .nodeLabel,
      .mermaid g[id*="Finish"] .nodeLabel,
      .mermaid g[id*="finish"] .nodeLabel {
        fill: ${palette.textLight} !important;
        font-weight: 700 !important;
        font-size: 14px !important;
      }

      /* Process nodes - Enhanced blue styling */
      .mermaid .node.process rect,
      .mermaid g[id*="Process"] rect,
      .mermaid g[id*="process"] rect {
        fill: ${palette.processNode};
        stroke: ${palette.processNode};
        stroke-width: 2px;
        filter: drop-shadow(0 2px 10px ${palette.processNode}30);
      }

      .mermaid .node.process .nodeLabel,
      .mermaid g[id*="Process"] .nodeLabel,
      .mermaid g[id*="process"] .nodeLabel {
        fill: ${palette.textLight};
        font-weight: 600;
      }

      /* Decision nodes - Enhanced diamond styling */
      .mermaid .node.decision polygon,
      .mermaid g[id*="Decision"] polygon,
      .mermaid g[id*="decision"] polygon,
      .mermaid g[id*="If"] polygon,
      .mermaid g[id*="if"] polygon {
        fill: ${palette.decisionNode};
        stroke: ${palette.decisionNode};
        stroke-width: 2px;
        filter: drop-shadow(0 2px 10px ${palette.decisionNode}30);
      }

      .mermaid .node.decision .nodeLabel,
      .mermaid g[id*="Decision"] .nodeLabel,
      .mermaid g[id*="decision"] .nodeLabel,
      .mermaid g[id*="If"] .nodeLabel,
      .mermaid g[id*="if"] .nodeLabel {
        fill: ${palette.textLight};
        font-weight: 600;
      }

      /* Enhanced Edge styling */
      .mermaid .edgePath .path {
        stroke: ${palette.borderHover};
        stroke-width: 2.5px;
        fill: none;
        marker-end: url(#arrowhead);
      }

      .mermaid .edgeLabel {
        background-color: ${palette.background};
        color: ${palette.text};
        font-size: 12px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid ${palette.border};
        box-shadow: 0 1px 3px rgba(0, 0, 0, ${isDark ? "0.3" : "0.1"});
      }

      /* Arrow markers */
      .mermaid marker {
        fill: ${palette.borderHover};
      }

      /* Text styling */
      .mermaid .nodeLabel,
      .mermaid .edgeLabel {
        color: ${palette.text};
        font-weight: 500;
      }

      .mermaid .node.start .nodeLabel,
      .mermaid .node.end .nodeLabel,
      .mermaid .node.process .nodeLabel,
      .mermaid .node.decision .nodeLabel {
        color: ${isDark ? "#000" : "#fff"};
        font-weight: 600;
      }

      /* Class diagram styling */
      .mermaid .classGroup rect {
        fill: ${palette.surface};
        stroke: ${palette.border};
        stroke-width: 2px;
      }

      .mermaid .classGroup .title {
        fill: ${palette.primary};
        font-weight: bold;
      }

      .mermaid .relation {
        stroke: ${palette.border};
        stroke-width: 2px;
      }

      /* Sequence diagram styling */
      .mermaid .actor {
        fill: ${palette.primary};
        stroke: ${palette.border};
      }

      .mermaid .messageLine0,
      .mermaid .messageLine1 {
        stroke: ${palette.border};
        stroke-width: 2px;
      }

      .mermaid .messageText {
        fill: ${palette.text};
        font-size: 12px;
      }

      /* Enhanced hover effects with distinct behaviors */
      .mermaid .node:hover rect,
      .mermaid .node:hover circle,
      .mermaid .node:hover ellipse,
      .mermaid .node:hover polygon {
        filter: drop-shadow(0 6px 20px rgba(0, 0, 0, ${isDark ? "0.5" : "0.25"}));
        transform: scale(1.05);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Special hover effects for start nodes */
      .mermaid .node.start:hover rect,
      .mermaid .node.start:hover circle,
      .mermaid g[id*="Start"]:hover rect,
      .mermaid g[id*="start"]:hover rect,
      .mermaid g[id*="Begin"]:hover rect,
      .mermaid g[id*="begin"]:hover rect {
        filter: drop-shadow(0 8px 25px ${palette.startNode}60) !important;
        transform: scale(1.08) !important;
      }

      /* Special hover effects for end nodes */
      .mermaid .node.end:hover rect,
      .mermaid .node.end:hover circle,
      .mermaid g[id*="End"]:hover rect,
      .mermaid g[id*="end"]:hover rect,
      .mermaid g[id*="Stop"]:hover rect,
      .mermaid g[id*="stop"]:hover rect,
      .mermaid g[id*="Finish"]:hover rect,
      .mermaid g[id*="finish"]:hover rect {
        filter: drop-shadow(0 8px 25px ${palette.endNode}60) !important;
        transform: scale(1.08) !important;
      }

      /* Interactive edge hover effects */
      .mermaid .edgePath:hover .path {
        stroke: ${palette.primary};
        stroke-width: 3px;
        transition: all 0.2s ease;
      }
    `

      return {
        startOnLoad: false,
        securityLevel: "loose",
        maxTextSize: 50000,
        theme: "base", // Use base theme for custom styling
        themeCSS: customThemeCSS,
        themeVariables: {
          // Core theme variables
          primaryColor: palette.primary,
          primaryTextColor: palette.text,
          primaryBorderColor: palette.border,
          lineColor: palette.border,
          sectionBkgColor: palette.surface,
          altSectionBkgColor: palette.background,

          // Typography
          fontSize: "14px",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

          // Enhanced diagram color scale
          cScale0: palette.startNode,
          cScale1: palette.processNode,
          cScale2: palette.decisionNode,
          cScale3: palette.endNode,
          cScale4: palette.secondary,
          cScale5: palette.tertiary,

          // Background and surface
          background: palette.background,
          mainBkg: palette.surface,
          secondBkg: palette.background,
          tertiaryColor: palette.surface,

          // Text colors
          textColor: palette.text,
          secondaryTextColor: palette.textSecondary,

          // Node specific colors with enhanced hierarchy
          fillType0: palette.startNode,
          fillType1: palette.processNode,
          fillType2: palette.decisionNode,
          fillType3: palette.endNode,
          fillType4: palette.secondary,
          fillType5: palette.tertiary,

          // Class diagram
          classText: palette.text,

          // Flowchart
          nodeBorder: palette.border,
          clusterBkg: palette.surface,
          clusterBorder: palette.border,
          defaultLinkColor: palette.border,
          titleColor: palette.text,

          // Sequence diagram
          actorBkg: palette.primary,
          actorBorder: palette.border,
          actorTextColor: isDark ? "#000" : "#fff",
          actorLineColor: palette.border,
          signalColor: palette.text,
          signalTextColor: palette.text,
          labelBoxBkgColor: palette.surface,
          labelBoxBorderColor: palette.border,
          labelTextColor: palette.text,
          loopTextColor: palette.text,
          activationBkgColor: palette.secondary,
          activationBorderColor: palette.border,

          // ER diagram
          relationColor: palette.border,
          relationLabelBackground: palette.background,
          relationLabelColor: palette.text,

          // Git diagram
          git0: palette.primary,
          git1: palette.secondary,
          git2: palette.tertiary,
          git3: palette.success,
          git4: palette.warning,
          git5: palette.error,
          gitBranchLabel0: palette.text,
          gitBranchLabel1: palette.text,
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
          padding: 10,
        },
        sequence: {
          useMaxWidth: true,
          wrap: true,
          width: 150,
          height: 65,
          boxMargin: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35,
        },
        class: {
          useMaxWidth: true,
        },
        er: {
          useMaxWidth: true,
        },
        journey: {
          useMaxWidth: true,
        },
      }
    },
    []
  )

  // Initialize Mermaid with theme-based configuration using dynamic import
  const initializeMermaid = useCallback(async () => {
    try {
      if (typeof window === "undefined") {
        return // Skip initialization on server side
      }

      const mermaid = (await import("mermaid")).default
      const config = getThemeConfig(currentTheme)
      await mermaid.initialize(config)
      setIsInitialized(true)
      setError(null)
    } catch (err) {
      setError("Failed to initialize Mermaid")
      console.error("Mermaid initialization error:", err)
    }
  }, [currentTheme, getThemeConfig])

  // Render diagram using dynamic import
  const renderDiagram = useCallback(
    async (diagramCode: string) => {
      if (!diagramCode.trim() || !isInitialized) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        if (typeof window === "undefined") {
          return // Skip rendering on server side
        }

        const mermaid = (await import("mermaid")).default

        // Validate syntax first
        const parseResult = await mermaid.parse(diagramCode)
        if (!parseResult) {
          throw new Error("Invalid Mermaid syntax")
        }

        // Generate unique ID for this render
        const renderCount = ++renderCountRef.current
        const diagramId = `mermaid-lesson-${renderCount}-${Date.now()}`

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, diagramCode)
        setRenderedSVG(svg)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to render diagram")
        console.error("Mermaid render error:", err)

        // Try to render a simple error diagram
        try {
          if (typeof window !== "undefined") {
            const mermaid = (await import("mermaid")).default
            const errorDiagram = `flowchart TD
            error["⚠️ Diagram Error"]
            message["${(err.message || "Render failed").replace(/"/g, '\\"')}"]
            error --> message
            style error fill:#fee2e2,stroke:#dc2626,color:#991b1b
            style message fill:#fef3c7,stroke:#d97706,color:#92400e`

            const { svg } = await mermaid.render(
              `error-${Date.now()}`,
              errorDiagram
            )
            setRenderedSVG(svg)
          }
        } catch (errorErr) {
          // If even error diagram fails, just show text
          setRenderedSVG("")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [isInitialized]
  )

  // Initialize on mount and theme change
  useEffect(() => {
    initializeMermaid()
  }, [initializeMermaid])

  // Render when code or initialization changes
  useEffect(() => {
    if (code && isInitialized) {
      renderDiagram(code)
    }
  }, [code, isInitialized, renderDiagram])

  if (!code || !code.trim()) {
    return null
  }

  return (
    <div className={`mermaid-renderer ${className}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h5 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
          <span>🧩</span>
          <span>Interactive Diagram</span>
        </h5>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Rendering diagram...
            </span>
          </div>
        )}

        {!isLoading && renderedSVG && (
          <div
            className="mermaid-svg-container overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderedSVG }}
          />
        )}

        {!isLoading && error && !renderedSVG && (
          <div className="py-6 text-center">
            <div className="mb-2 text-red-500 dark:text-red-400">
              ⚠️ Diagram Error
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {error}
            </div>
            <details className="mt-3 text-left">
              <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Show diagram code
              </summary>
              <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-700">
                {code}
              </pre>
            </details>
          </div>
        )}

        {!isLoading && !renderedSVG && !error && (
          <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No diagram to display
          </div>
        )}
      </div>
    </div>
  )
}

export default MermaidRenderer
