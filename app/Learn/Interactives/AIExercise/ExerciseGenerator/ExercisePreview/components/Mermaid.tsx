"use client"

import React, { useEffect, useRef, useState } from "react"

interface MermaidProps {
  chart: string
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted && containerRef.current && chart) {
      import("mermaid").then((mermaid) => {
        mermaid.default.initialize({ startOnLoad: false })
        try {
          const id = `mermaid-graph-${Math.random().toString(36).substr(2, 9)}`
          mermaid.default.render(id, chart, (svgGraph) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svgGraph
            }
          })
        } catch (e) {
          console.error("Error rendering mermaid diagram:", e)
          if (containerRef.current) {
            containerRef.current.innerHTML = "Error rendering diagram."
          }
        }
      })
    }
  }, [chart, hasMounted])

  return <div ref={containerRef} />
}

export default Mermaid
