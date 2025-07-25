"use client"

import React, { useEffect, useRef, useState } from "react"
import { langMap } from "@/app/Learn/utils"
import {
  AlertCircle,
  CheckCircle,
  Code,
  Copy,
  Loader2,
  Play,
  Settings,
  Terminal,
} from "lucide-react"
import { CodeRunnerViewProps } from "../../types/TutorialTypes"
import { runCodeOnServer } from "./codeRunnerUtils"

const CodeRunnerView: React.FC<CodeRunnerViewProps> = ({
  language: initialLanguage = "javascript",
  initialCode = "",
  stdin = "",
  className = "",
  showHeader = true,
  onHeaderAction,
  headerActions,
}) => {
  const [isClient, setIsClient] = useState(false)
  const [language, setLanguage] = useState(initialLanguage)
  const [code, setCode] = useState(initialCode)
  const [input, setInput] = useState(stdin)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState("")
  const [executionTime, setExecutionTime] = useState(0)
  const [fontSize, setFontSize] = useState(14)
  const [lineNumbers, setLineNumbers] = useState(false)
  const [wordWrap, setWordWrap] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"code" | "output">("code")

  const codeRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get unique language options from langMap
  const uniqueLanguageOptions = Array.from(new Set(Object.values(langMap)))

  // Check if mobile and client-side
  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setShowLanguageDropdown(false)
    // Clear output when language changes
    setOutput("")
    setError("")
    setExecutionTime(0)
  }

  const getCurrentLanguageLabel = () => {
    return language.charAt(0).toUpperCase() + language.slice(1)
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setError("")
    if (isMobile) setActiveTab("output")

    try {
      const result = await runCodeOnServer(language, code, input)
      setOutput(result.output)
      setError(result.error)
      setExecutionTime(result.executionTime)
    } catch (err: any) {
      console.error("Run error:", err)
      setError(err.message || "Failed to execute")
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    if (isClient) {
      navigator.clipboard.writeText(code)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setInput(stdin)
    setOutput("")
    setError("")
    setExecutionTime(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      const newCode = code.substring(0, start) + "  " + code.substring(end)
      setCode(newCode)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }

    if (e.key === "Enter") {
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart
      const lines = code.substring(0, start).split("\n")
      const currentLine = lines[lines.length - 1]
      const indent = currentLine.match(/^\s*/)?.[0] || ""

      setTimeout(() => {
        const newStart = start + 1 + indent.length
        textarea.selectionStart = textarea.selectionEnd = newStart
      }, 0)
    }
  }

  const getLineNumbers = () => {
    const lineCount = code.split("\n").length
    return Array.from({ length: lineCount }, (_, i) => i + 1)
  }

  const handleHeaderActionClick = (
    action: "settings" | "fullscreen" | "close"
  ) => {
    if (action === "settings") {
      setShowSettings(!showSettings)
    }
    onHeaderAction?.(action)
  }

  if (!isClient) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
      >
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-slate-600">Loading code runner...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-slate-900 ${className}`}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-800 p-3 text-white dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 sm:p-4">
          <div className="flex items-center space-x-3">
            <Code className="h-5 w-5" />
            <h2 className="hidden text-lg font-bold sm:block">
              Try {getCurrentLanguageLabel()} Code
            </h2>
            <h2 className="text-base font-bold sm:hidden">
              {getCurrentLanguageLabel()}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-1 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 sm:px-4"
              >
                <span>{getCurrentLanguageLabel()}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${showLanguageDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 top-full z-50 mt-2 max-h-60 w-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
                  {uniqueLanguageOptions.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleLanguageChange(value)}
                      className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                        value.toLowerCase() === language.toLowerCase()
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleHeaderActionClick("settings")}
              className="rounded-lg p-1 transition-colors hover:bg-white/20"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            {headerActions}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <label
                className="text-slate-700 dark:text-slate-300"
                htmlFor="fontSize"
              >
                Font Size:
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                id="fontSize"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="rounded"
                id="wrap"
              />
              <label
                className="text-slate-700 dark:text-slate-300"
                htmlFor="wrap"
              >
                Word Wrap
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === "code"
                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Code className="mr-2 inline h-4 w-4" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === "output"
                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Terminal className="mr-2 inline h-4 w-4" />
            Output
          </button>
        </div>
      )}

      {/* Content */}
      <div
        className={`flex flex-1 ${isMobile ? "flex-col" : "flex-row"} overflow-hidden`}
      >
        {/* Code Panel */}
        <div
          className={`flex flex-col ${isMobile ? (activeTab === "code" ? "flex-1" : "hidden") : "w-1/2"} ${!isMobile ? "border-r border-slate-200 dark:border-slate-700" : ""}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Code Editor
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyCode}
                className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={resetCode}
                className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                title="Reset code"
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800 relative flex-1 overflow-auto">
            <div className="flex h-full">
              {/* Line Numbers */}
              {lineNumbers && (
                <div
                  className="sticky top-0 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-3 pr-2 dark:border-slate-700 dark:bg-slate-800"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <div className="text-right font-mono leading-6 text-slate-400 dark:text-slate-500">
                    {getLineNumbers().map((num) => (
                      <div key={num} className="select-none">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Editor */}
              <div className="flex-1 p-3 pl-2">
                <textarea
                  ref={codeRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-full w-full resize-none overflow-hidden bg-transparent font-mono leading-6 focus:outline-none dark:text-slate-100"
                  style={{
                    fontSize: `${fontSize}px`,
                    whiteSpace: wordWrap ? "pre-wrap" : "pre",
                    wordWrap: wordWrap ? "break-word" : "normal",
                  }}
                  placeholder={`Enter your ${getCurrentLanguageLabel()} code here...`}
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="flex-shrink-0 border-t border-slate-200 p-3 dark:border-slate-700">
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="stdin"
            >
              Input (stdin):
            </label>
            <textarea
              id="stdin"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-20 w-full resize-none rounded-lg border border-slate-200 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-blue-400"
              placeholder="Enter input for your program..."
            />
          </div>

          {/* Run Button */}
          <div className="flex-shrink-0 border-t border-slate-200 p-3 dark:border-slate-700">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-50 dark:from-green-500 dark:to-green-600"
            >
              {isRunning ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span>{isRunning ? "Running..." : "Run Code"}</span>
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div
          className={`flex flex-col ${isMobile ? (activeTab === "output" ? "flex-1" : "hidden") : "w-1/2"}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Output
            </span>
            {executionTime > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {executionTime}ms
              </span>
            )}
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800 h-full w-full overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-600 dark:bg-slate-800">
              {error ? (
                <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <pre className="overflow-auto whitespace-pre-wrap text-sm">
                    {error}
                  </pre>
                </div>
              ) : output ? (
                <div className="flex items-start space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <pre className="overflow-auto whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                    {output}
                  </pre>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <Play className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">{`Click "Run Code" to see output`}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeRunnerView
