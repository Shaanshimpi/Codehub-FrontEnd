"use client"

import React from "react"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"

function page() {
  return (
    <div>
      <MermaidDiagram>
        {`graph TD
    A[SchoolMember] --> B(Teacher)
    A --> C(Student)
    A --> D(Other School Member)

    style A fill:#ff6b6b,stroke:#333,stroke-width:2px
    style B fill:#feca57,stroke:#333,stroke-width:2px
    style C fill:#1dd1a1,stroke:#333,stroke-width:2px
    style D fill:#5f27cd,stroke:#333,stroke-width:2px

    A --> E{'getRole'} 
    A --> F{'displayInfo'}

    E -.-> B
    E -.-> C
    F -.-> B
    F -.-> C

    linkStyle 0,1,2 stroke-width:2px,stroke:#333
    linkStyle 3,4 stroke-width:2px,stroke:#333
    linkStyle 5,6 stroke-width:2px,stroke:#333
          `}
      </MermaidDiagram>
    </div>
  )
}

export default page
