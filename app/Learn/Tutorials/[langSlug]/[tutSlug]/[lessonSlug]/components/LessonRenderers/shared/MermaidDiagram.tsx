"use client"

import React, { useEffect, useRef } from "react"

interface MermaidDiagramProps {
  diagram: string
  className?: string
}

const MermaidDiagram = ({ diagram, className = "" }: MermaidDiagramProps) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!diagram || !elementRef.current) return

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default

        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        })

        // Clear previous content
        elementRef.current.innerHTML = ""

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg } = await mermaid.render(id, diagram)
        elementRef.current.innerHTML = svg
      } catch (error) {
        console.error("Error rendering Mermaid diagram:", error)
        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <p class="text-red-700 dark:text-red-300 text-sm">
                Unable to render diagram. Please check the diagram syntax.
              </p>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [diagram])

  if (!diagram) {
    return null
  }

  return (
    <div className={`mermaid-container ${className}`}>
      <div className="overflow-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800">
        <div
          ref={elementRef}
          className="flex min-h-[200px] items-center justify-center"
        />
      </div>
    </div>
  )
}

export default MermaidDiagram
