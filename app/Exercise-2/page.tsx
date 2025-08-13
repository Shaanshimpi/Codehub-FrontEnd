"use client"

import React from "react"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"

function page() {
  return (
    <div>
      <MermaidDiagram>
        {`
        graph TD
    A["Book Class Definition"]
    B["Attributes: title, author"]
    C["Method: displayInfo()"]
    A --> B
    A --> C
          `}
      </MermaidDiagram>
    </div>
  )
}

export default page
