"use client"

// Necessary for client-side rendering in Next.js
import React, { useEffect, useState } from "react"
import { useTheme } from "@/app/theme-context"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language: string
}
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [highlightedCode, setHighlightedCode] = useState("")

  const { theme } = useTheme()

  useEffect(() => {
    async function highlightCode() {
      const html = await codeToHtml(code, {
        lang: language,
        theme: theme === "dark" ? "github-dark" : "light-plus",
      })
      setHighlightedCode(html)
    }
    highlightCode()
  }, [code, language, theme])

  return (
    <div className="overflow-x-hidden rounded-lg md:w-[50vw] md:max-w-[1200px]">
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
        className="overflow-x-scroll bg-[#e2e1e1] p-4 text-sm dark:bg-black"
        style={{
          // background: "#1e1e1e",
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
