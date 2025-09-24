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

      // Premium design system colors - perfectly matched to our UI
      const colors = {
        light: {
          // Core brand colors - matching our button/accent colors
          primary: "#2563eb", // blue-600 - primary buttons
          secondary: "#7c3aed", // violet-600 - secondary accents
          tertiary: "#0891b2", // cyan-600 - info elements

          // Semantic node colors - professional hierarchy
          startNode: "#059669", // emerald-600 - success green for starts
          endNode: "#dc2626", // red-600 - error red for ends
          processNode: "#2563eb", // blue-600 - primary for processes
          decisionNode: "#d97706", // amber-600 - warning for decisions
          dataNode: "#7c3aed", // violet-600 - secondary for data
          subprocessNode: "#0891b2", // cyan-600 - tertiary for subprocesses

          // Surface colors - matching our component backgrounds
          background: "#ffffff", // white - page background
          surface: "#f8fafc", // slate-50 - card backgrounds
          surfaceElevated: "#f1f5f9", // slate-100 - elevated cards
          surfaceHover: "#e2e8f0", // slate-200 - hover states
          border: "#cbd5e1", // slate-300 - borders
          borderHover: "#94a3b8", // slate-400 - hover borders
          borderStrong: "#64748b", // slate-500 - emphasized borders

          // Text colors - matching our typography
          text: "#0f172a", // slate-900 - primary text
          textSecondary: "#475569", // slate-600 - secondary text
          textMuted: "#64748b", // slate-500 - muted text
          textLight: "#ffffff", // white - text on colored backgrounds
          textContrast: "#1e293b", // slate-800 - high contrast text

          // Status colors - matching our alert system
          success: "#059669", // emerald-600 - success states
          warning: "#d97706", // amber-600 - warning states
          error: "#dc2626", // red-600 - error states
          info: "#0284c7", // sky-600 - info states

          // Gradient colors - premium visual effects
          gradientStart: "#3b82f6", // blue-500
          gradientMiddle: "#8b5cf6", // violet-500
          gradientEnd: "#06b6d4", // cyan-500
        },
        dark: {
          // Core brand colors - bright and vibrant for dark mode
          primary: "#3b82f6", // blue-500 - primary elements
          secondary: "#a855f7", // purple-500 - secondary accents
          tertiary: "#06b6d4", // cyan-500 - tertiary highlights

          // Semantic node colors - optimized for dark backgrounds
          startNode: "#10b981", // emerald-500 - bright success green
          endNode: "#f87171", // red-400 - softer error red
          processNode: "#3b82f6", // blue-500 - bright primary
          decisionNode: "#fbbf24", // amber-400 - bright warning
          dataNode: "#a855f7", // purple-500 - vibrant secondary
          subprocessNode: "#06b6d4", // cyan-500 - bright tertiary

          // Surface colors - matching our dark theme components
          background: "#0f172a", // slate-900 - page background
          surface: "#1e293b", // slate-800 - card backgrounds
          surfaceElevated: "#334155", // slate-700 - elevated elements
          surfaceHover: "#475569", // slate-600 - hover states
          border: "#475569", // slate-600 - subtle borders
          borderHover: "#64748b", // slate-500 - hover borders
          borderStrong: "#94a3b8", // slate-400 - emphasized borders

          // Text colors - optimized contrast for dark mode
          text: "#f8fafc", // slate-50 - primary text
          textSecondary: "#cbd5e1", // slate-300 - secondary text
          textMuted: "#94a3b8", // slate-400 - muted text
          textLight: "#0f172a", // slate-900 - text on light colored backgrounds
          textContrast: "#ffffff", // white - maximum contrast text

          // Status colors - bright and clear for dark backgrounds
          success: "#34d399", // emerald-400 - success states
          warning: "#fbbf24", // amber-400 - warning states
          error: "#f87171", // red-400 - error states
          info: "#38bdf8", // sky-400 - info states

          // Gradient colors - vibrant for dark mode
          gradientStart: "#60a5fa", // blue-400
          gradientMiddle: "#a78bfa", // violet-400
          gradientEnd: "#22d3ee", // cyan-400
        },
      }

      const palette = colors[themeMode]

      // Premium CSS styling - beautiful and modern design
      const customThemeCSS = `
      .mermaid {
        font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: ${palette.background};
        color: ${palette.text};
        border-radius: 12px;
        padding: 20px;
      }

      /* Premium node styling - beautiful cards with modern design */
      .mermaid .node rect,
      .mermaid .node circle,
      .mermaid .node ellipse,
      .mermaid .node polygon,
      .mermaid g.node rect,
      .mermaid g.node circle,
      .mermaid g.node ellipse,
      .mermaid g.node polygon,
      .mermaid svg g rect,
      .mermaid svg g circle,
      .mermaid svg g ellipse,
      .mermaid svg g polygon {
        fill: ${palette.surface} !important;
        stroke: ${palette.border} !important;
        stroke-width: 1.5px !important;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, ${isDark ? "0.3" : "0.08"})) drop-shadow(0 2px 4px rgba(0, 0, 0, ${isDark ? "0.2" : "0.04"})) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      /* Enhanced hover effects - interactive and smooth */
      .mermaid .node:hover rect,
      .mermaid .node:hover circle,
      .mermaid .node:hover ellipse,
      .mermaid .node:hover polygon {
        fill: ${palette.surfaceHover};
        stroke: ${palette.borderHover};
        stroke-width: 2px;
        filter: drop-shadow(0 8px 25px rgba(0, 0, 0, ${isDark ? "0.4" : "0.12"})) drop-shadow(0 4px 8px rgba(0, 0, 0, ${isDark ? "0.25" : "0.06"}));
        transform: translateY(-1px);
      }

      /* Start nodes - Beautiful emerald success styling */
      .mermaid .node.start rect,
      .mermaid .node.start circle,
      .mermaid g[id*="Start"] rect,
      .mermaid g[id*="start"] rect,
      .mermaid g[id*="Begin"] rect,
      .mermaid g[id*="begin"] rect,
      .mermaid #start_node rect,
      .mermaid #start_node circle,
      .mermaid g#start_node rect,
      .mermaid g#start_node circle,
      .mermaid [id="start_node"] rect,
      .mermaid [id="start_node"] circle {
        fill: ${palette.startNode} !important;
        stroke: ${palette.startNode} !important;
        stroke-width: 2.5px !important;
        filter: drop-shadow(0 6px 20px ${palette.startNode}25) drop-shadow(0 2px 6px ${palette.startNode}35) !important;
        rx: 8px !important;
      }

      .mermaid .node.start .nodeLabel,
      .mermaid g[id*="Start"] .nodeLabel,
      .mermaid g[id*="start"] .nodeLabel,
      .mermaid g[id*="Begin"] .nodeLabel,
      .mermaid g[id*="begin"] .nodeLabel {
        fill: ${palette.textLight} !important;
        font-weight: 600 !important;
        font-size: 13px !important;
        letter-spacing: 0.025em !important;
      }

      .mermaid .node.start:hover rect,
      .mermaid .node.start:hover circle,
      .mermaid g[id*="Start"]:hover rect,
      .mermaid g[id*="start"]:hover rect,
      .mermaid g[id*="Begin"]:hover rect,
      .mermaid g[id*="begin"]:hover rect {
        fill: ${palette.success} !important;
        stroke: ${palette.success} !important;
        filter: drop-shadow(0 8px 30px ${palette.success}30) drop-shadow(0 4px 12px ${palette.success}40) !important;
        transform: translateY(-2px) !important;
      }

      /* End nodes - Beautiful red completion styling */
      .mermaid .node.end rect,
      .mermaid .node.end circle,
      .mermaid g[id*="End"] rect,
      .mermaid g[id*="end"] rect,
      .mermaid g[id*="Stop"] rect,
      .mermaid g[id*="stop"] rect,
      .mermaid g[id*="Finish"] rect,
      .mermaid g[id*="finish"] rect,
      .mermaid #end_node rect,
      .mermaid #end_node circle,
      .mermaid g#end_node rect,
      .mermaid g#end_node circle,
      .mermaid [id="end_node"] rect,
      .mermaid [id="end_node"] circle {
        fill: ${palette.endNode} !important;
        stroke: ${palette.endNode} !important;
        stroke-width: 2.5px !important;
        filter: drop-shadow(0 6px 20px ${palette.endNode}25) drop-shadow(0 2px 6px ${palette.endNode}35) !important;
        rx: 8px !important;
      }

      .mermaid .node.end .nodeLabel,
      .mermaid g[id*="End"] .nodeLabel,
      .mermaid g[id*="end"] .nodeLabel,
      .mermaid g[id*="Stop"] .nodeLabel,
      .mermaid g[id*="stop"] .nodeLabel,
      .mermaid g[id*="Finish"] .nodeLabel,
      .mermaid g[id*="finish"] .nodeLabel {
        fill: ${palette.textLight} !important;
        font-weight: 600 !important;
        font-size: 13px !important;
        letter-spacing: 0.025em !important;
      }

      .mermaid .node.end:hover rect,
      .mermaid .node.end:hover circle,
      .mermaid g[id*="End"]:hover rect,
      .mermaid g[id*="end"]:hover rect,
      .mermaid g[id*="Stop"]:hover rect,
      .mermaid g[id*="stop"]:hover rect,
      .mermaid g[id*="Finish"]:hover rect,
      .mermaid g[id*="finish"]:hover rect {
        fill: ${palette.error} !important;
        stroke: ${palette.error} !important;
        filter: drop-shadow(0 8px 30px ${palette.error}30) drop-shadow(0 4px 12px ${palette.error}40) !important;
        transform: translateY(-2px) !important;
      }

      /* Process nodes - Beautiful primary blue styling */
      .mermaid .node.process rect,
      .mermaid g[id*="Process"] rect,
      .mermaid g[id*="process"] rect,
      .mermaid g[id*="declare"] rect,
      .mermaid g[id*="print"] rect,
      .mermaid g[id*="calculate"] rect,
      .mermaid g[id*="assign"] rect {
        fill: ${palette.processNode} !important;
        stroke: ${palette.processNode} !important;
        stroke-width: 2px !important;
        filter: drop-shadow(0 4px 16px ${palette.processNode}20) drop-shadow(0 2px 4px ${palette.processNode}30) !important;
        rx: 6px !important;
      }

      .mermaid .node.process .nodeLabel,
      .mermaid g[id*="Process"] .nodeLabel,
      .mermaid g[id*="process"] .nodeLabel,
      .mermaid g[id*="declare"] .nodeLabel,
      .mermaid g[id*="print"] .nodeLabel,
      .mermaid g[id*="calculate"] .nodeLabel,
      .mermaid g[id*="assign"] .nodeLabel {
        fill: ${palette.textLight} !important;
        font-weight: 500 !important;
        font-size: 12px !important;
        letter-spacing: 0.01em !important;
      }

      .mermaid .node.process:hover rect,
      .mermaid g[id*="Process"]:hover rect,
      .mermaid g[id*="process"]:hover rect,
      .mermaid g[id*="declare"]:hover rect,
      .mermaid g[id*="print"]:hover rect,
      .mermaid g[id*="calculate"]:hover rect,
      .mermaid g[id*="assign"]:hover rect {
        fill: ${palette.primary} !important;
        stroke: ${palette.primary} !important;
        filter: drop-shadow(0 6px 24px ${palette.primary}25) drop-shadow(0 3px 8px ${palette.primary}35) !important;
        transform: translateY(-1px) !important;
      }

      /* Decision nodes - Beautiful amber diamond styling */
      .mermaid .node.decision polygon,
      .mermaid g[id*="Decision"] polygon,
      .mermaid g[id*="decision"] polygon,
      .mermaid g[id*="check"] polygon,
      .mermaid g[id*="condition"] polygon,
      .mermaid g[id*="If"] polygon,
      .mermaid g[id*="if"] polygon,
      .mermaid #check_condition polygon,
      .mermaid g#check_condition polygon,
      .mermaid [id="check_condition"] polygon {
        fill: ${palette.decisionNode} !important;
        stroke: ${palette.decisionNode} !important;
        stroke-width: 2px !important;
        filter: drop-shadow(0 4px 16px ${palette.decisionNode}20) drop-shadow(0 2px 4px ${palette.decisionNode}30) !important;
      }

      .mermaid .node.decision .nodeLabel,
      .mermaid g[id*="Decision"] .nodeLabel,
      .mermaid g[id*="decision"] .nodeLabel,
      .mermaid g[id*="check"] .nodeLabel,
      .mermaid g[id*="condition"] .nodeLabel,
      .mermaid g[id*="If"] .nodeLabel,
      .mermaid g[id*="if"] .nodeLabel {
        fill: ${palette.textLight} !important;
        font-weight: 500 !important;
        font-size: 12px !important;
        letter-spacing: 0.01em !important;
      }

      .mermaid .node.decision:hover polygon,
      .mermaid g[id*="Decision"]:hover polygon,
      .mermaid g[id*="decision"]:hover polygon,
      .mermaid g[id*="check"]:hover polygon,
      .mermaid g[id*="condition"]:hover polygon,
      .mermaid g[id*="If"]:hover polygon,
      .mermaid g[id*="if"]:hover polygon {
        fill: ${palette.warning} !important;
        stroke: ${palette.warning} !important;
        filter: drop-shadow(0 6px 24px ${palette.warning}25) drop-shadow(0 3px 8px ${palette.warning}35) !important;
        transform: translateY(-1px) !important;
      }

      /* Premium Edge styling - smooth and professional */
      .mermaid .edgePath .path {
        stroke: ${palette.borderStrong} !important;
        stroke-width: 2px !important;
        fill: none !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        marker-end: url(#arrowhead) !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      .mermaid .edgePath:hover .path {
        stroke: ${palette.primary} !important;
        stroke-width: 2.5px !important;
        filter: drop-shadow(0 2px 8px ${palette.primary}30) !important;
      }

      /* Beautiful edge labels - modern pill design */
      .mermaid .edgeLabel {
        background: ${palette.surfaceElevated} !important;
        color: ${palette.text} !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        padding: 6px 12px !important;
        border-radius: 16px !important;
        border: 1px solid ${palette.border} !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, ${isDark ? "0.25" : "0.06"}), 0 1px 2px rgba(0, 0, 0, ${isDark ? "0.15" : "0.04"}) !important;
        letter-spacing: 0.01em !important;
        backdrop-filter: blur(8px) !important;
      }

      .mermaid .edgeLabel:hover {
        background: ${palette.surfaceHover} !important;
        border-color: ${palette.borderHover} !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDark ? "0.3" : "0.08"}), 0 2px 4px rgba(0, 0, 0, ${isDark ? "0.2" : "0.05"}) !important;
      }

      /* Modern arrow markers */
      .mermaid marker {
        fill: ${palette.borderStrong} !important;
      }

      .mermaid .edgePath:hover marker {
        fill: ${palette.primary} !important;
      }

      /* Premium typography */
      .mermaid .nodeLabel,
      .mermaid .edgeLabel {
        color: ${palette.text} !important;
        font-weight: 500 !important;
        text-rendering: optimizeLegibility !important;
        -webkit-font-smoothing: antialiased !important;
      }

      /* Node label overrides for colored backgrounds */
      .mermaid .node.start .nodeLabel,
      .mermaid .node.end .nodeLabel,
      .mermaid .node.process .nodeLabel,
      .mermaid .node.decision .nodeLabel,
      .mermaid g[id*="start"] .nodeLabel,
      .mermaid g[id*="end"] .nodeLabel,
      .mermaid g[id*="declare"] .nodeLabel,
      .mermaid g[id*="print"] .nodeLabel,
      .mermaid g[id*="check"] .nodeLabel,
      .mermaid g[id*="condition"] .nodeLabel {
        color: ${palette.textLight} !important;
        font-weight: 500 !important;
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

  // Direct SVG styling function - applies our design system colors directly to SVG elements
  const applyDirectStyling = useCallback(
    (svgString: string, themeMode: "light" | "dark"): string => {
      const colors = {
        light: {
          primary: "#2563eb", // blue-600
          secondary: "#7c3aed", // violet-600
          tertiary: "#0891b2", // cyan-600
          success: "#059669", // emerald-600
          warning: "#d97706", // amber-600
          error: "#dc2626", // red-600
          info: "#0284c7", // sky-600
          surface: "#f8fafc", // slate-50
          surfaceElevated: "#f1f5f9", // slate-100
          border: "#cbd5e1", // slate-300
          borderStrong: "#64748b", // slate-500
          text: "#0f172a", // slate-900
          textLight: "#ffffff", // white
        },
        dark: {
          primary: "#3b82f6", // blue-500
          secondary: "#a855f7", // purple-500
          tertiary: "#06b6d4", // cyan-500
          success: "#10b981", // emerald-500
          warning: "#fbbf24", // amber-400
          error: "#f87171", // red-400
          info: "#38bdf8", // sky-400
          surface: "#1e293b", // slate-800
          surfaceElevated: "#334155", // slate-700
          border: "#475569", // slate-600
          borderStrong: "#94a3b8", // slate-400
          text: "#f8fafc", // slate-50
          textLight: "#0f172a", // dark text for light backgrounds
        },
      }

      const palette = colors[themeMode]
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml")

      // Apply modern styling to all nodes
      const applyNodeStyling = (
        element: Element,
        fillColor: string,
        strokeColor: string,
        isSpecial = false
      ) => {
        element.setAttribute("fill", fillColor)
        element.setAttribute("stroke", strokeColor)
        element.setAttribute("stroke-width", isSpecial ? "2.5" : "2")
        element.setAttribute("rx", "8") // Rounded corners
        element.setAttribute("ry", "8")

        // Add subtle drop shadow
        const filter = `drop-shadow(0 4px 12px rgba(0, 0, 0, ${themeMode === "dark" ? "0.3" : "0.08"}))`
        element.setAttribute(
          "style",
          `filter: ${filter}; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`
        )
      }

      // Apply text styling
      const applyTextStyling = (
        element: Element,
        color: string,
        weight = "500"
      ) => {
        element.setAttribute("fill", color)
        element.setAttribute("font-weight", weight)
        element.setAttribute(
          "font-family",
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        )
        element.setAttribute("font-size", "13px")
      }

      // Style all rectangles (most flowchart nodes)
      const rects = svgDoc.querySelectorAll("rect")
      rects.forEach((rect) => {
        const parent = rect.parentElement
        const parentId = parent?.id?.toLowerCase() || ""
        const hasStartKeyword = /start|begin/i.test(parentId)
        const hasEndKeyword = /end|stop|finish/i.test(parentId)
        const hasProcessKeyword =
          /process|declare|print|calculate|assign/i.test(parentId)
        const isDecisionNode = parent?.querySelector("polygon") !== null

        if (hasStartKeyword) {
          applyNodeStyling(rect, palette.success, palette.success, true)
        } else if (hasEndKeyword) {
          applyNodeStyling(rect, palette.error, palette.error, true)
        } else if (hasProcessKeyword) {
          applyNodeStyling(rect, palette.primary, palette.primary)
        } else {
          // Default styling for generic nodes
          applyNodeStyling(rect, palette.surface, palette.border)
        }
      })

      // Style all polygons (decision nodes)
      const polygons = svgDoc.querySelectorAll("polygon")
      polygons.forEach((polygon) => {
        applyNodeStyling(polygon, palette.warning, palette.warning)
      })

      // Style all circles
      const circles = svgDoc.querySelectorAll("circle")
      circles.forEach((circle) => {
        const parent = circle.parentElement
        const parentId = parent?.id?.toLowerCase() || ""
        const hasStartKeyword = /start|begin/i.test(parentId)
        const hasEndKeyword = /end|stop|finish/i.test(parentId)

        if (hasStartKeyword) {
          applyNodeStyling(circle, palette.success, palette.success, true)
        } else if (hasEndKeyword) {
          applyNodeStyling(circle, palette.error, palette.error, true)
        } else {
          applyNodeStyling(circle, palette.surface, palette.border)
        }
      })

      // Style all text elements
      const textElements = svgDoc.querySelectorAll("text")
      textElements.forEach((text) => {
        const parent = text.closest("g")
        const parentId = parent?.id?.toLowerCase() || ""
        const isOnColoredBackground =
          /start|end|process|decision|declare|print|calculate|assign|check|condition/i.test(
            parentId
          )

        if (isOnColoredBackground) {
          applyTextStyling(text, palette.textLight, "600")
        } else {
          applyTextStyling(text, palette.text, "500")
        }
      })

      // Style edges (paths)
      const paths = svgDoc.querySelectorAll("path.flowchart-link, path[stroke]")
      paths.forEach((path) => {
        path.setAttribute("stroke", palette.borderStrong)
        path.setAttribute("stroke-width", "2")
        path.setAttribute("stroke-linecap", "round")
        path.setAttribute("stroke-linejoin", "round")
        path.setAttribute(
          "style",
          "transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);"
        )
      })

      // Style edge labels
      const labels = svgDoc.querySelectorAll("g.edgeLabel")
      labels.forEach((label) => {
        const rect = label.querySelector("rect")
        const text = label.querySelector("text")

        if (rect) {
          rect.setAttribute("fill", palette.surfaceElevated)
          rect.setAttribute("stroke", palette.border)
          rect.setAttribute("stroke-width", "1")
          rect.setAttribute("rx", "8")
          rect.setAttribute("ry", "8")
          rect.setAttribute(
            "style",
            `filter: drop-shadow(0 2px 8px rgba(0, 0, 0, ${themeMode === "dark" ? "0.25" : "0.06"}));`
          )
        }

        if (text) {
          applyTextStyling(text, palette.text, "500")
        }
      })

      // Style markers (arrow heads)
      const markers = svgDoc.querySelectorAll("marker path")
      markers.forEach((marker) => {
        marker.setAttribute("fill", palette.borderStrong)
        marker.setAttribute("stroke", palette.borderStrong)
      })

      // Return the enhanced SVG
      const serializer = new XMLSerializer()
      return serializer.serializeToString(svgDoc)
    },
    []
  )

  // Enhanced color mapping function for mermaid styling
  const enhanceMermaidColors = useCallback(
    (diagramCode: string, themeMode: "light" | "dark"): string => {
      const colors = {
        light: {
          primary: "#2563eb", // blue-600
          secondary: "#7c3aed", // violet-600
          tertiary: "#0891b2", // cyan-600
          success: "#059669", // emerald-600
          warning: "#d97706", // amber-600
          error: "#dc2626", // red-600
          info: "#0284c7", // sky-600
          surface: "#f8fafc", // slate-50
          border: "#cbd5e1", // slate-300
          text: "#0f172a", // slate-900
          textLight: "#ffffff", // white
        },
        dark: {
          primary: "#3b82f6", // blue-500
          secondary: "#a855f7", // purple-500
          tertiary: "#06b6d4", // cyan-500
          success: "#10b981", // emerald-500
          warning: "#fbbf24", // amber-400
          error: "#f87171", // red-400
          info: "#38bdf8", // sky-400
          surface: "#1e293b", // slate-800
          border: "#475569", // slate-600
          text: "#f8fafc", // slate-50
          textLight: "#0f172a", // dark text for light backgrounds
        },
      }

      const palette = colors[themeMode]

      // Common color replacements for better design system integration
      const colorReplacements = [
        // Common generic colors to our design system colors
        { from: /#FF0000|#ff0000|red/g, to: palette.error },
        { from: /#00FF00|#00ff00|lime|green(?!-)/g, to: palette.success },
        { from: /#0000FF|#0000ff|blue(?!-)/g, to: palette.primary },
        { from: /#FFFF00|#ffff00|yellow/g, to: palette.warning },
        { from: /#FF00FF|#ff00ff|magenta|purple(?!-)/g, to: palette.secondary },
        { from: /#00FFFF|#00ffff|cyan/g, to: palette.tertiary },
        { from: /#FFA500|#ffa500|orange/g, to: palette.warning },

        // Common mermaid default colors
        { from: /#f9f9f9|#F9F9F9/g, to: palette.surface },
        { from: /#333|#333333/g, to: palette.text },
        { from: /#666|#666666/g, to: palette.border },
        { from: /#999|#999999/g, to: palette.border },

        // Light blue variations to our primary
        { from: /#e1f5fe|#bbdefb|#90caf9/g, to: palette.primary + "20" }, // 20% opacity
        { from: /#2196f3|#1976d2|#0d47a1/g, to: palette.primary },

        // Light green variations to our success
        { from: /#e8f5e8|#c8e6c9|#a5d6a7/g, to: palette.success + "20" }, // 20% opacity
        { from: /#4caf50|#388e3c|#1b5e20/g, to: palette.success },

        // Light red variations to our error
        { from: /#ffebee|#ffcdd2|#ef9a9a/g, to: palette.error + "20" }, // 20% opacity
        { from: /#f44336|#d32f2f|#b71c1c/g, to: palette.error },

        // Professional node styling
        {
          from: /fill:#[a-fA-F0-9]{6}(?=,stroke:|$)/g,
          to: `fill:${palette.surface}`,
        },
        {
          from: /stroke:#[a-fA-F0-9]{6}(?=,|$)/g,
          to: `stroke:${palette.border}`,
        },
        {
          from: /color:#[a-fA-F0-9]{6}(?=,|;|$)/g,
          to: `color:${palette.text}`,
        },
      ]

      let enhancedCode = diagramCode

      // Apply color replacements
      colorReplacements.forEach(({ from, to }) => {
        enhancedCode = enhancedCode.replace(from, to)
      })

      // Enhance classDef statements for better visual hierarchy
      if (enhancedCode.includes("classDef")) {
        const classDefEnhancements = [
          {
            from: /classDef\s+(\w+)\s+fill:#[a-fA-F0-9]{6}/g,
            to: `classDef $1 fill:${palette.primary},stroke:${palette.border},stroke-width:2px,color:${palette.textLight}`,
          },
          {
            from: /classDef\s+start\s+[^;]*/g,
            to: `classDef start fill:${palette.success},stroke:${palette.success},stroke-width:3px,color:${palette.textLight}`,
          },
          {
            from: /classDef\s+end\s+[^;]*/g,
            to: `classDef end fill:${palette.error},stroke:${palette.error},stroke-width:3px,color:${palette.textLight}`,
          },
          {
            from: /classDef\s+process\s+[^;]*/g,
            to: `classDef process fill:${palette.primary},stroke:${palette.primary},stroke-width:2px,color:${palette.textLight}`,
          },
          {
            from: /classDef\s+decision\s+[^;]*/g,
            to: `classDef decision fill:${palette.warning},stroke:${palette.warning},stroke-width:2px,color:${palette.textLight}`,
          },
        ]

        classDefEnhancements.forEach(({ from, to }) => {
          enhancedCode = enhancedCode.replace(from, to)
        })
      }

      // Add default professional styling if no classDef exists
      if (
        !enhancedCode.includes("classDef") &&
        enhancedCode.includes("style ")
      ) {
        // Enhance existing style statements
        enhancedCode = enhancedCode.replace(
          /style\s+(\w+)\s+fill:#[a-fA-F0-9]{6}(?:,stroke:#[a-fA-F0-9]{6})?(?:,color:#[a-fA-F0-9]{6})?/g,
          `style $1 fill:${palette.surface},stroke:${palette.border},stroke-width:2px,color:${palette.text}`
        )
      }

      // Auto-add professional styling for flowcharts without any styling
      if (
        enhancedCode.includes("flowchart") &&
        !enhancedCode.includes("style ") &&
        !enhancedCode.includes("classDef")
      ) {
        const flowchartStyling = `

    %% Auto-generated professional styling
    classDef default fill:${palette.surface},stroke:${palette.border},stroke-width:2px,color:${palette.text}
    classDef startEnd fill:${palette.success},stroke:${palette.success},stroke-width:3px,color:${palette.textLight}
    classDef process fill:${palette.primary},stroke:${palette.primary},stroke-width:2px,color:${palette.textLight}
    classDef decision fill:${palette.warning},stroke:${palette.warning},stroke-width:2px,color:${palette.textLight}`

        enhancedCode += flowchartStyling

        // Apply node-specific styling using ::: syntax
        const lines = enhancedCode.split("\n")
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Check for start/end nodes
          if (
            line.match(/^\s*(start_node|end_node|start|end|Start|End)\s*[([]/)
          ) {
            const nodeName = line.match(/^\s*(\w+)/)?.[1]
            if (nodeName && !line.includes(":::")) {
              lines[i] = line.replace(nodeName, `${nodeName}:::startEnd`)
            }
          }

          // Check for decision nodes
          if (
            line.match(/^\s*(check_condition|decision|Decision|if|If)\s*\{/)
          ) {
            const nodeName = line.match(/^\s*(\w+)/)?.[1]
            if (nodeName && !line.includes(":::")) {
              lines[i] = line.replace(nodeName, `${nodeName}:::decision`)
            }
          }
        }

        enhancedCode = lines.join("\n")
      }

      // Auto-add styling for other diagram types without styling
      if (
        !enhancedCode.includes("flowchart") &&
        !enhancedCode.includes("style ") &&
        !enhancedCode.includes("classDef")
      ) {
        if (
          enhancedCode.includes("graph") ||
          enhancedCode.includes("sequenceDiagram") ||
          enhancedCode.includes("classDiagram")
        ) {
          const genericStyling = `

    %% Auto-generated professional styling
    classDef default fill:${palette.surface},stroke:${palette.border},stroke-width:2px,color:${palette.text}`

          enhancedCode += genericStyling
        }
      }

      return enhancedCode
    },
    []
  )

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

        // Use the original diagram code directly from database
        const codeToRender = diagramCode.trim()

        // Debug: Log what Mermaid generates
        console.group("🔍 Mermaid Debug Info")
        console.log("Theme mode:", currentTheme)
        console.log("Code to render:", codeToRender)

        // Validate syntax first
        const parseResult = await mermaid.parse(codeToRender)
        if (!parseResult) {
          throw new Error("Invalid Mermaid syntax")
        }

        // Generate unique ID for this render
        const renderCount = ++renderCountRef.current
        const diagramId = `mermaid-lesson-${renderCount}-${Date.now()}`

        // Render the pure diagram from database
        const { svg } = await mermaid.render(diagramId, codeToRender)

        // Debug: Log the generated SVG structure
        console.log("Generated SVG structure:", svg.substring(0, 800) + "...")

        // Parse SVG to examine node structure
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svg, "image/svg+xml")
        const rects = svgDoc.querySelectorAll("rect")
        const circles = svgDoc.querySelectorAll("circle")
        const polygons = svgDoc.querySelectorAll("polygon")
        const groups = svgDoc.querySelectorAll("g")

        console.log("🔍 SVG Element Analysis:")
        console.log("- Rectangles found:", rects.length)
        console.log("- Circles found:", circles.length)
        console.log("- Polygons found:", polygons.length)
        console.log("- Groups found:", groups.length)

        // Log node IDs and classes
        groups.forEach((group, index) => {
          if (group.id) {
            console.log(
              `- Group ${index}: ID="${group.id}", Class="${group.className.baseVal || group.getAttribute("class") || "none"}"`
            )
          }
        })

        rects.forEach((rect, index) => {
          const parent = rect.parentElement
          console.log(
            `- Rect ${index}: Parent ID="${parent?.id || "none"}", Fill="${rect.getAttribute("fill")}", Stroke="${rect.getAttribute("stroke")}"`
          )
        })

        console.groupEnd()

        // Post-process SVG to apply our beautiful styling directly
        const enhancedSVG = applyDirectStyling(svg, currentTheme)
        setRenderedSVG(enhancedSVG)
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
    [isInitialized, enhanceMermaidColors, currentTheme, applyDirectStyling]
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

  if (!code || typeof code !== "string" || !code.trim()) {
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
