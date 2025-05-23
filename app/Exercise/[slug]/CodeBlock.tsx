"use client"

// Necessary for client-side rendering in Next.js
import React, { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language: string
}
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    async function highlightCode() {
      const html = await codeToHtml(code, {
        lang: language,
        theme: "github-dark", // Change this to any supported Shiki theme
      })
      setHighlightedCode(html)
    }
    highlightCode()
  }, [code, language])

  return (
    <div className="overflow-x-hidden rounded-lg md:w-[60vw] md:max-w-[1200px]">
      {/* Code Header */}
      <div className="flex items-center gap-2 bg-blue-800 px-4 py-2">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 text-sm text-gray-400">code.{language}</span>
      </div>

      {/* Code Content */}
      <div
        className="overflow-x-scroll p-4 text-sm"
        style={{
          background: "#1e1e1e",
          borderRadius: "0 0 0.5rem 0.5rem",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  )
}

export default CodeBlock
