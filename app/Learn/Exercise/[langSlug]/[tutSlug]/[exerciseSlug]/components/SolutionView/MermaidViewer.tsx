// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MermaidViewer.tsx
"use client"

import React, { useEffect, useState } from "react"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"
import {
  AlertCircle,
  ChartBar,
  Copy,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MermaidViewer.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MermaidViewer.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MermaidViewer.tsx

interface MermaidViewerProps {
  diagram: string
  title?: string
}

const MermaidViewer: React.FC<MermaidViewerProps> = ({
  diagram,
  title = "Flowchart",
}) => {
  const [showRawCode, setShowRawCode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [diagramError, setDiagramError] = useState(false)

  // Cleanup function to remove Mermaid DOM elements
  const cleanupMermaidElements = () => {
    // Cleanup Mermaid tooltips and SVG containers
    const mermaidTooltips = document.querySelectorAll(".mermaidTooltip")
    const mermaidSvgContainers = document.querySelectorAll(
      '[id*="mermaid-svg"]'
    )

    mermaidTooltips.forEach((tooltip) => tooltip.remove())
    mermaidSvgContainers.forEach((container) => container.remove())
  }

  // Cleanup on component unmount
  useEffect(() => {
    return cleanupMermaidElements
  }, [])

  // Cleanup when diagram changes
  useEffect(() => {
    if (diagram) {
      cleanupMermaidElements()
    }
  }, [diagram])

  if (!diagram) {
    return (
      <div className="flex h-full items-center justify-center text-center text-black dark:text-white">
        <div>
          <ChartBar className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-bold">No Flowchart Available</p>
          <p className="mt-2 text-sm font-medium">
            {`This exercise doesn't include a visual flowchart diagram.`}
          </p>
        </div>
      </div>
    )
  }

  const copyDiagram = () => {
    navigator.clipboard.writeText(diagram)
  }

  const resetZoom = () => {
    setZoom(100)
  }

  const zoomIn = () => {
    setZoom(Math.min(zoom + 25, 200))
  }

  const zoomOut = () => {
    setZoom(Math.max(zoom - 25, 50))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">
              {title}
            </h3>
            <p className="text-sm font-medium text-black dark:text-white">
              {`Visual representation of the program's logic flow`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawCode(!showRawCode)}
              className="rounded-lg border border-gray-300 bg-white p-2 text-black shadow-lg hover:bg-blue-50 hover:shadow-xl dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-blue-900"
              title="Toggle raw code view"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              onClick={copyDiagram}
              className="rounded-lg border border-gray-300 bg-white p-2 text-black shadow-lg hover:bg-blue-50 hover:shadow-xl dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-blue-900"
              title="Copy diagram code"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showRawCode && (
        /* Raw Mermaid Code View */
        <div className="space-y-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 shadow-lg dark:border-blue-700 dark:bg-blue-900">
            <h4 className="mb-2 font-bold text-blue-900 dark:text-blue-100">
              Mermaid Diagram Code
            </h4>
            <p className="text-sm font-medium text-black dark:text-white">
              This is the Mermaid syntax used to generate the flowchart. You can
              copy this code and use it in any Mermaid-compatible editor.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-lg dark:border-gray-600">
            <div className="flex items-center justify-between bg-black px-4 py-2 dark:bg-white">
              <span className="font-mono text-sm font-bold text-white dark:text-black">
                mermaid
              </span>
              <button
                onClick={copyDiagram}
                className="text-sm font-bold text-white hover:text-blue-300 dark:text-black dark:hover:text-blue-600"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-900 p-4 dark:bg-gray-100">
              <pre className="overflow-x-auto text-sm font-medium text-gray-200 dark:text-gray-800">
                <code>{diagram}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-3 ${showRawCode && "hidden"}`}>
        {/* Zoom Controls */}
        <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-900">
          <div className="text-sm font-bold text-black dark:text-white">
            Zoom: {zoom}%
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={zoom <= 50}
              className="rounded-lg border border-gray-300 bg-white p-2 text-black shadow-lg hover:bg-blue-50 hover:shadow-xl disabled:opacity-50 dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-blue-900"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={resetZoom}
              className="rounded-lg border border-gray-300 bg-white p-2 text-black shadow-lg hover:bg-blue-50 hover:shadow-xl dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-blue-900"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={zoomIn}
              disabled={zoom >= 200}
              className="rounded-lg border border-gray-300 bg-white p-2 text-black shadow-lg hover:bg-blue-50 hover:shadow-xl disabled:opacity-50 dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-blue-900"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Diagram Container */}
        <div className="overflow-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-600 dark:bg-gray-900">
          {diagramError ? (
            <div className="flex items-center justify-center p-8 text-center">
              <div>
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <p className="text-lg font-bold text-red-700 dark:text-red-400">
                  Diagram Render Error
                </p>
                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-300">
                  There was an issue rendering the flowchart. You can view the
                  raw code above.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="mermaid-container flex justify-center"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center top",
                minHeight: "200px",
              }}
            >
              <div className="w-full max-w-full">
                <MermaidDiagram>{diagram}</MermaidDiagram>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for Mermaid styling */}
      <style>{`
        .mermaid-container :global(.mermaid) {
          max-width: 100%;
          height: auto;
        }
        
        .mermaid-container :global(svg) {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        /* Hide global Mermaid elements that appear outside component */
        body :global(.mermaidTooltip) {
          display: none !important;
        }
        
        body :global([id*="mermaid-svg"]:not(.mermaid-container [id*="mermaid-svg"])) {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default MermaidViewer
