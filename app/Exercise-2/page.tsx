"use client"

import React from "react"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"

function page() {
  return (
    <div>
      <MermaidDiagram>
        {`flowchart TD
        A["Start"] --> B{"Number <= 1?"}
        B -- Yes --> C["isPrime = false"]
        C --> F["Print Result"]
        B -- No --> D["Loop: i = 2 to sqrt (number)"]
        D --> E{"number  i == 0?"}
        E -- Yes --> G["isPrime = false"]
        G --> H["Break Loop"]
        H --> F
        E -- No --> D
        D --> F
        F[Print Result]
        style A fill:#a8e6cf,stroke:#333,stroke-width:2px
        style F fill:#ffaaa5,stroke:#333,stroke-width:2px
        style B fill:#feca57,stroke:#333,stroke-width:2px
        style D fill:#1dd1a1,stroke:#333,stroke-width:2px
        style E fill:#48cae4,stroke:#333,stroke-width:2px
        style G fill:#ff6b6b,stroke:#333,stroke-width:2px
          `}
      </MermaidDiagram>
    </div>
  )
}

export default page
