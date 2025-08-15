"use client"

import React from "react"
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram"
import pako from "pako"

function page() {
  const plantUmlCode = `@startuml
start
:User enters credentials;
:Validate input format;
if (Format valid?) then (yes)
  :Check credentials in database;
  if (Credentials match?) then (yes)
    :Generate session token;
    :Redirect to dashboard;
    :Login successful;
  else (no)
    :Show error message;
    :Return to login form;
  endif
else (no)
  :Show validation error;
  :Return to login form;
endif
stop
@enduml`

  // PlantUML custom base64 encoding table
  const plantumlAlphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"

  // Custom encoding function
  function plantumlEncode(data) {
    let res = ""
    for (let i = 0; i < data.length; i += 3) {
      if (i + 2 === data.length) {
        let b1 = data[i]
        let b2 = data[i + 1]
        res += plantumlAlphabet[b1 >> 2]
        res += plantumlAlphabet[((b1 & 0x3) << 4) | (b2 >> 4)]
        res += plantumlAlphabet[(b2 & 0xf) << 2]
      } else if (i + 1 === data.length) {
        let b1 = data[i]
        res += plantumlAlphabet[b1 >> 2]
        res += plantumlAlphabet[(b1 & 0x3) << 4]
      } else {
        let b1 = data[i]
        let b2 = data[i + 1]
        let b3 = data[i + 2]
        res += plantumlAlphabet[b1 >> 2]
        res += plantumlAlphabet[((b1 & 0x3) << 4) | (b2 >> 4)]
        res += plantumlAlphabet[((b2 & 0xf) << 2) | (b3 >> 6)]
        res += plantumlAlphabet[b3 & 0x3f]
      }
    }
    return res
  }

  // Compress text using pako (zlib/deflate library for JS)
  function plantumlUrl(umlText) {
    const compressed = pako.deflateRaw(new TextEncoder().encode(umlText)) // raw DEFLATE
    const encoded = plantumlEncode(compressed)
    console.log(encoded)
    return `https://www.plantuml.com/plantuml/png/${encoded}`
  }

  // Generate PlantUML URL using base64 encoding with ~1 prefix
  const plantUmlUrl = `${plantumlUrl(plantUmlCode)}`
  console.log(plantUmlUrl)
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-center text-3xl font-bold">
        Exercise-2: Diagram Demo
      </h1>

      {/* Mermaid Diagram */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Mermaid Diagram</h2>
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

      {/* PlantUML Diagram */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">PlantUML Diagram</h2>

        {/* PlantUML Code */}
        <div className="mb-4">
          <h3 className="mb-2 font-medium">PlantUML Code:</h3>
          <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
            <code>{plantUmlCode}</code>
          </pre>
        </div>

        {/* Rendered PlantUML */}
        <div>
          <h3 className="mb-2 font-medium">Rendered Output:</h3>
          <div className="rounded border bg-white p-4">
            <img
              src={plantUmlUrl}
              alt="User Authentication Flow"
              className="mx-auto h-auto max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
