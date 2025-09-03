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
  diagramData?: MermaidDiagramData | string | null
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

  // Convert diagram data to Mermaid syntax
  const processDiagramData = useCallback(
    (data: MermaidDiagramData | string | null): string => {
      try {
        if (!data) {
          return ""
        }

        if (typeof data === "string") {
          return data
        }

        if (isMermaidDiagramData(data)) {
          return convertJSONToMermaid(data)
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
        console.log("🔍 Validating Mermaid syntax:", {
          codeLength: code.length,
          codePreview:
            code.substring(0, 200) + (code.length > 200 ? "..." : ""),
        })

        const parseResult = await mermaid.parse(code)
        if (!parseResult) {
          throw new Error("Invalid Mermaid syntax")
        }

        console.log("✅ Mermaid syntax validation passed")

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

        // Console log detailed error information
        console.error("🚨 Mermaid Render Error:", {
          type: error.type,
          message: error.message,
          mermaidCode: code,
          originalError: err,
          stack: err.stack,
        })

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
        } catch {
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

  // Process diagram data when it changes
  useEffect(() => {
    const processedCode = processDiagramData(diagramData)
    setMermaidCode(processedCode)
  }, [diagramData, processDiagramData])

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
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mermaid Code Editor
        </label>
        <textarea
          ref={editorRef}
          value={mermaidCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="resize-vertical h-40 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Edit Mermaid code here to update the diagram in real-time..."
        />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            Edit the Mermaid code above to update the diagram in real-time.
          </span>
          <span className="text-gray-400">{mermaidCode.length} characters</span>
        </div>
      </div>
    </div>
  )
}

export default MermaidDiagram
