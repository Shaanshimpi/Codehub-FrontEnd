// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MermaidViewer.tsx
"use client"

import React, { useState } from "react"
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

  if (!diagram) {
    return (
      <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
        <div>
          <ChartBar className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No Flowchart Available</p>
          <p className="mt-2 text-sm">
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

  const handleDiagramError = () => {
    setDiagramError(true)
  }
  // zoomOut()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {`Visual representation of the program's logic flow`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawCode(!showRawCode)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Toggle raw code view"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={copyDiagram}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Copy diagram code"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showRawCode && (
        /* Raw Mermaid Code View */
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
              Mermaid Diagram Code
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This is the Mermaid syntax used to generate the flowchart. You can
              copy this code and use it in any Mermaid-compatible editor.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
              <span className="font-mono text-sm text-slate-300">mermaid</span>
              <button
                onClick={copyDiagram}
                className="text-sm text-slate-400 hover:text-white"
              >
                Copy
              </button>
            </div>
            <div className="bg-slate-900 p-4">
              <pre className="overflow-x-auto text-sm text-slate-200">
                <code>{diagram}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${showRawCode && "hidden"}`}>
        {/* Zoom Controls */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Zoom: {zoom}%
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={zoom <= 50}
              className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={resetZoom}
              className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={zoomIn}
              disabled={zoom >= 200}
              className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Diagram Container */}
        <div className="overflow-auto rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          {diagramError ? (
            <div className="flex items-center justify-center p-8 text-center">
              <div>
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <p className="text-lg font-medium text-red-700 dark:text-red-400">
                  Diagram Render Error
                </p>
                <p className="mt-2 text-sm text-red-600 dark:text-red-300">
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
      `}</style>
    </div>
  )
}

export default MermaidViewer
