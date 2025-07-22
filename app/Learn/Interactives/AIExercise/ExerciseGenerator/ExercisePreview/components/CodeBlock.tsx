import React, { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language?: string
  theme?: "dark" | "light"
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "c",
  theme = "dark",
}) => {
  const [highlightedCode, setHighlightedCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function highlightCode() {
      if (!code) {
        setHighlightedCode("")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const html = await codeToHtml(code, {
          lang: language == "c-programming" ? "c" : language,
          theme: theme === "dark" ? "github-dark" : "github-light",
        })
        setHighlightedCode(html)
      } catch (error) {
        console.error("Error highlighting code:", error)
        // Fallback to plain text with basic styling
        setHighlightedCode(`<pre style="color: #e5e7eb;">${code}</pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCode()
  }, [code, language, theme])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  if (!code) {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2 font-mono text-xs text-slate-400">
          <span>Code</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-4 font-mono text-sm text-white">
          <code>No code available</code>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-700 shadow-lg">
      {/* VS Code-style header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
        <div className="flex items-center space-x-3">
          {/* Traffic light buttons */}
          <div className="flex space-x-1.5">
            <div className="h-3 w-3 cursor-pointer rounded-full bg-red-500 transition-colors hover:bg-red-400" />
            <div className="h-3 w-3 cursor-pointer rounded-full bg-yellow-500 transition-colors hover:bg-yellow-400" />
            <div className="h-3 w-3 cursor-pointer rounded-full bg-green-500 transition-colors hover:bg-green-400" />
          </div>

          {/* File info */}
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-mono text-xs">
              {language === "javascript"
                ? "script.js"
                : language === "typescript"
                  ? "script.ts"
                  : language === "python"
                    ? "script.py"
                    : language === "java"
                      ? "Main.java"
                      : language === "cpp" || language === "c++"
                        ? "main.cpp"
                        : language === "c"
                          ? "main.c"
                          : language === "html"
                            ? "index.html"
                            : language === "css"
                              ? "styles.css"
                              : `code.${language}`}
            </span>
            {isLoading && (
              <div className="h-2 w-2 animate-spin rounded-full border border-slate-400 border-t-transparent" />
            )}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 transition-all duration-200 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center bg-slate-900 p-4">
            <div className="flex items-center space-x-2 text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              <span className="text-sm">Highlighting code...</span>
            </div>
          </div>
        ) : (
          <div className="flex bg-slate-900">
            {/* Line numbers */}
            <div className="select-none border-r border-slate-700 bg-slate-800/50 px-3 py-5 font-mono text-xs leading-6 text-slate-500">
              {code.split("\n").map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code content */}
            <div
              className="flex-1 overflow-x-auto"
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                fontFamily:
                  "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
              }}
            >
              {highlightedCode ? (
                <div
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  className="[&>pre]:!m-0 [&>pre]:!border-none [&>pre]:!bg-transparent [&>pre]:!py-5 [&>pre]:!pl-4 [&>pre]:!pr-6"
                />
              ) : (
                <pre className="m-0 border-none bg-transparent py-5 pl-4 pr-6 text-slate-300">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeBlock
