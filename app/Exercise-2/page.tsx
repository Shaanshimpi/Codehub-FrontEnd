"use client"

import React from "react"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"

function page() {
  return (
    <div>
      <MermaidDiagram>
        {`graph TD
    A[Start] --> B{number <= 10}
    style A fill:#f9f,stroke:#333,stroke-width:2px,color:#333
    style B fill:#ccf,stroke:#333,stroke-width:2px,color:#333
    B -- Yes --> C{number % 2 == 0}
    style C fill:#ccf,stroke:#333,stroke-width:2px,color:#333
    C -- Yes --> D[Print number is even]
    style D fill:#aef,stroke:#333,stroke-width:2px,color:#333
    C -- No --> E[Print number is odd]
    style E fill:#aef,stroke:#333,stroke-width:2px,color:#333
    D --> F[number++]
    E --> F
    style F fill:#bbf,stroke:#333,stroke-width:2px,color:#333
    F --> B
    B -- No --> G[End]
    style G fill:#f9f,stroke:#333,stroke-width:2px,color:#333
          `}
      </MermaidDiagram>
    </div>
  )
}

export default page
