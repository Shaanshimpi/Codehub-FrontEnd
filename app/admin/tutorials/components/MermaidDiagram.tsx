"use client"

/**
 * MermaidDiagram Component for CodeHub Complete Platform
 * Step 5: Create MermaidDiagram Component with superior error handling
 *
 * Replaces @lightenna/react-mermaid-diagram with robust error handling
 * Uses official mermaid package with custom React wrapper
 */
import React, { useCallback, useEffect, useRef, useState } from "react"
import mermaid, { type MermaidConfig } from "mermaid"
import {
  type MermaidDiagramData,
  convertJSONToMermaid,
  isMermaidDiagramData,
} from "../utils/mermaidConverter"

// Component props interface
interface MermaidDiagramProps {
  diagramData?: MermaidDiagramData | MermaidDiagramData[] | string | null
  className?: string
  showDebugInfo?: boolean
  showMermaidEditor?: boolean
  editable?: boolean
  onMermaidChange?: (mermaidCode: string) => void
  onError?: (error: string) => void
  theme?: "default" | "dark" | "forest" | "neutral"
  width?: number | string
  height?: number | string
}

// Error types for better error handling
enum MermaidErrorType {
  PARSE_ERROR = "PARSE_ERROR",
  RENDER_ERROR = "RENDER_ERROR",
  INVALID_DATA = "INVALID_DATA",
  INITIALIZATION_ERROR = "INITIALIZATION_ERROR",
}

interface MermaidError {
  type: MermaidErrorType
  message: string
  details?: any
}

// Theme configurations matching guide specifications
const THEME_CONFIG: Record<string, MermaidConfig> = {
  default: {
    theme: "base",
    themeVariables: {
      primaryColor: "#6b7280", // gray-500 - match PlantUML blue-gray
      primaryTextColor: "#374151", // gray-700
      primaryBorderColor: "#9ca3af", // gray-400
      lineColor: "#6b7280",
      sectionBkgColor: "#f3f4f6", // gray-100
      altSectionBkgColor: "#e5e7eb", // gray-200
      fontSize: "14px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
  },
  dark: {
    theme: "dark",
    themeVariables: {
      primaryColor: "#4f46e5",
      primaryTextColor: "#f9fafb",
      fontSize: "14px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
  },
  forest: {
    theme: "forest",
  },
  neutral: {
    theme: "neutral",
  },
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  diagramData,
  className = "",
  showDebugInfo = false,
  showMermaidEditor = false,
  editable = false,
  onMermaidChange,
  onError,
  theme = "default",
  width = "100%",
  height = "auto",
}) => {
  // State management
  const [mermaidCode, setMermaidCode] = useState<string>("")
  const [renderedSVG, setRenderedSVG] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<MermaidError | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)
  const [diagrams, setDiagrams] = useState<MermaidDiagramData[]>([])
  const [isArrayDiagram, setIsArrayDiagram] = useState<boolean>(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const renderCountRef = useRef<number>(0)

  // Initialize Mermaid with theme configuration
  const initializeMermaid = useCallback(async () => {
    try {
      const config: MermaidConfig = {
        startOnLoad: false,
        securityLevel: "loose", // Required for some diagram types
        maxTextSize: 50000,
        maxEdges: 500,
        ...THEME_CONFIG[theme],
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
        },
        sequence: {
          useMaxWidth: true,
          wrap: true,
          width: 150,
          height: 65,
        },
        er: {
          useMaxWidth: true,
        },
        journey: {
          useMaxWidth: true,
        },
      }

      await mermaid.initialize(config)
      setIsInitialized(true)
      setError(null)
    } catch (err) {
      const error: MermaidError = {
        type: MermaidErrorType.INITIALIZATION_ERROR,
        message: "Failed to initialize Mermaid",
        details: err,
      }
      setError(error)
      onError?.(error.message)
    }
  }, [theme, onError])

  // Convert diagram data to Mermaid syntax (pure function - no state updates)
  const processDiagramData = useCallback(
    (
      data: MermaidDiagramData | MermaidDiagramData[] | string | null,
      validDiagrams: MermaidDiagramData[],
      currentTabIndex: number
    ): string => {
      try {
        if (!data) {
          return ""
        }

        if (typeof data === "string") {
          return data
        }

        // Handle array of diagrams
        if (Array.isArray(data)) {
          if (validDiagrams.length === 0) {
            throw new Error("Array contains no valid diagram data")
          }

          const currentIndex =
            currentTabIndex < validDiagrams.length ? currentTabIndex : 0

          if (validDiagrams.length > 0 && validDiagrams[currentIndex]) {
            const selectedDiagram = validDiagrams[currentIndex]
            const convertedCode = convertJSONToMermaid(selectedDiagram)
            return convertedCode
          }
          return ""
        }

        // Handle single diagram
        if (isMermaidDiagramData(data)) {
          const convertedCode = convertJSONToMermaid(data)
          return convertedCode
        }

        throw new Error("Invalid diagram data format")
      } catch (err) {
        const error: MermaidError = {
          type: MermaidErrorType.INVALID_DATA,
          message: "Failed to process diagram data",
          details: err,
        }
        setError(error)
        onError?.(error.message)
        return generateErrorDiagram("Invalid diagram data")
      }
    },
    [onError]
  )

  // Render Mermaid diagram to SVG
  const renderDiagram = useCallback(
    async (code: string) => {
      if (!code.trim() || !isInitialized) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Validate syntax first
        const parseResult = await mermaid.parse(code)
        if (!parseResult) {
          throw new Error("Invalid Mermaid syntax")
        }

        // Generate unique ID for this render
        const renderCount = ++renderCountRef.current
        const diagramId = `mermaid-diagram-${renderCount}-${Date.now()}`

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, code)

        setRenderedSVG(svg)
        setError(null)
      } catch (err: any) {
        const error: MermaidError = {
          type: err.message?.includes("syntax")
            ? MermaidErrorType.PARSE_ERROR
            : MermaidErrorType.RENDER_ERROR,
          message: err.message || "Failed to render diagram",
          details: err,
        }

        setError(error)
        onError?.(error.message)

        // Generate fallback error diagram
        const errorDiagram = generateErrorDiagram(error.message)
        try {
          const { svg } = await mermaid.render(
            `error-${Date.now()}`,
            errorDiagram
          )
          setRenderedSVG(svg)
        } catch (errorErr) {
          // If even error diagram fails, show text fallback
          setRenderedSVG("")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [isInitialized, onError]
  )

  // Generate error diagram
  const generateErrorDiagram = (errorMessage: string): string => {
    return `flowchart TD
    error["⚠️ Diagram Error"]
    message["${errorMessage.replace(/"/g, '\\"')}"]
    error --> message
    style error fill:#fee2e2,stroke:#dc2626,color:#991b1b
    style message fill:#fef3c7,stroke:#d97706,color:#92400e`
  }

  // Handle manual code changes
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setMermaidCode(newCode)
      onMermaidChange?.(newCode)
    },
    [onMermaidChange]
  )

  // Initialize Mermaid on mount and theme change
  useEffect(() => {
    initializeMermaid()
  }, [initializeMermaid])

  // Initialize diagram state when data changes
  useEffect(() => {
    if (Array.isArray(diagramData)) {
      // Handle array data
      const validDiagrams = diagramData.filter((diagram) =>
        isMermaidDiagramData(diagram)
      )

      setIsArrayDiagram(true)
      setDiagrams(validDiagrams)

      // Reset tab index if it's out of bounds
      if (activeTabIndex >= validDiagrams.length) {
        setActiveTabIndex(0)
      }
    } else {
      // Handle single diagram or string data
      setIsArrayDiagram(false)
      setDiagrams([])
    }
  }, [diagramData, activeTabIndex])

  // Process diagram data to mermaid code
  useEffect(() => {
    if (Array.isArray(diagramData)) {
      // For arrays, only process if we have diagrams state populated
      if (diagrams.length > 0) {
        const processedCode = processDiagramData(
          diagramData,
          diagrams,
          activeTabIndex
        )
        setMermaidCode(processedCode)
      } else {
        // Validate diagrams inline if state not ready yet
        const validDiagrams = diagramData.filter((diagram) =>
          isMermaidDiagramData(diagram)
        )
        if (validDiagrams.length > 0) {
          const processedCode = processDiagramData(
            diagramData,
            validDiagrams,
            activeTabIndex
          )
          setMermaidCode(processedCode)
        } else {
          setMermaidCode(generateErrorDiagram("Invalid diagram data"))
        }
      }
    } else {
      // For single diagrams or strings
      const processedCode = processDiagramData(diagramData, [], 0)
      setMermaidCode(processedCode)
    }
  }, [diagramData, diagrams, activeTabIndex, processDiagramData])

  // Render diagram when code changes
  useEffect(() => {
    if (mermaidCode && isInitialized) {
      renderDiagram(mermaidCode)
    }
  }, [mermaidCode, isInitialized, renderDiagram])

  // Render component
  return (
    <div className={`mermaid-diagram-container ${className}`}>
      {/* Debug Information */}
      {showDebugInfo && (
        <div className="mb-4 rounded bg-gray-100 p-3 text-sm">
          <div>
            <strong>Status:</strong> {isLoading ? "Loading..." : "Ready"}
          </div>
          <div>
            <strong>Initialized:</strong> {isInitialized ? "Yes" : "No"}
          </div>
          <div>
            <strong>Code Length:</strong> {mermaidCode.length} characters
          </div>
          <div>
            <strong>Theme:</strong> {theme}
          </div>
          {error && (
            <div className="mt-2 text-red-600">
              <strong>Error:</strong> {error.type} - {error.message}
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation for Array Diagrams */}
      {isArrayDiagram && diagrams.length > 1 && (
        <div className="mb-4">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            {diagrams.map((diagram, index) => (
              <button
                key={index}
                onClick={() => setActiveTabIndex(index)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTabIndex === index
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {diagram.title || `Case ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Diagram Container */}
      <div
        ref={containerRef}
        className="diagram-wrapper rounded-lg border bg-white p-4"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          minHeight: typeof height === "number" ? `${height}px` : height,
        }}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
            <span className="ml-2 text-gray-600">Rendering diagram...</span>
          </div>
        )}

        {!isLoading && renderedSVG && (
          <div
            className="mermaid-svg-container"
            dangerouslySetInnerHTML={{ __html: renderedSVG }}
          />
        )}

        {!isLoading && !renderedSVG && error && (
          <div className="py-8 text-center text-red-600">
            <div className="mb-2 text-lg font-semibold">⚠️ Diagram Error</div>
            <div className="text-sm">{error.message}</div>
            {showDebugInfo && error.details && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer font-medium">
                  Error Details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-red-50 p-2 text-xs">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {!isLoading && !renderedSVG && !error && mermaidCode && (
          <div className="py-8 text-center text-gray-500">
            <div>No diagram to display</div>
          </div>
        )}
      </div>

      {/* Mermaid Code Editor - Always show for admin forms */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Mermaid Code Editor
          {isArrayDiagram &&
            diagrams.length > 0 &&
            diagrams[activeTabIndex] && (
              <span className="ml-2 text-sm font-normal text-blue-600">
                (
                {diagrams[activeTabIndex].title || `Case ${activeTabIndex + 1}`}
                )
              </span>
            )}
        </label>
        <textarea
          ref={editorRef}
          value={mermaidCode || ""}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="resize-vertical h-40 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          placeholder="Edit Mermaid code here to update the diagram in real-time..."
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Edit the Mermaid code above to update the diagram in real-time.
          </span>
          <span className="text-slate-400">
            {mermaidCode.length} characters
          </span>
        </div>
      </div>
    </div>
  )
}

export default MermaidDiagram
