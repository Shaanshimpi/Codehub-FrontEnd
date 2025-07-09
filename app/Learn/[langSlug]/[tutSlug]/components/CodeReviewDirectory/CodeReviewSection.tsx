"use client"

import React, { useEffect, useRef, useState } from "react"
import { Highlighter, createHighlighter } from "shiki"
import ChatMessage from "./ChatMessage"

interface Message {
  sender: "user" | "bot"
  text: string
}

interface CodeReviewSectionProps {
  language?: string
  content?: string
}

function stripHtml(html: string = ""): string {
  if (typeof window === "undefined") return html // SSR-safe fallback
  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || div.innerText || ""
}

const CodeReviewSection: React.FC<CodeReviewSectionProps> = ({
  language = "javascript",
  content,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [code, setCode] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createHighlighter({ theme: "github-dark" }).then(setHighlighter)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle responsive sidebar - auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleCodeReview = async () => {
    if (!code.trim() && !prompt.trim()) return
    setIsSidebarOpen(false)
    const userMessage = {
      sender: "user",
      text: [
        prompt.trim() ? `**📝 Prompt:**\n${prompt.trim()}` : "",
        code.trim()
          ? `**💻 Code:**\n\`\`\`${language}\n${code.trim()}\n\`\`\``
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/code-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          prompt,
          language,
          content: stripHtml(content),
          messages: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response,
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Error analyzing code. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = (): void => {
    console.log("🧹 Clearing chat history")
    setMessages([])
    setCode("")
    setPrompt("")
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <div className="relative">
            {isOpen ? (
              <svg
                className="h-6 w-6 transform transition-transform duration-300 group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            )}
          </div>
          <div className="absolute -top-12 right-0 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Code Review AI
          </div>
        </button>
      </div>

      {/* Code Review Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="h-[80vh] w-full max-w-7xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 md:h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 dark:border-slate-700 sm:px-6 sm:py-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="rounded-full bg-white/20 p-1.5 sm:p-2">
                  <svg
                    className="h-4 w-4 text-white sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  <span className="text-violet-400">VIVY</span>
                  <span className="hidden sm:inline">
                    {" "}
                    AI Code Review & Learning
                  </span>
                  <span className="sm:hidden"> AI</span>
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {/* Mobile sidebar toggle */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30 sm:p-2"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative flex h-[calc(100%-3.5rem)] sm:h-[calc(100%-4rem)]">
              {/* Input Section - Sidebar */}
              <div
                className={`absolute z-10 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900 lg:relative lg:z-auto ${
                  isSidebarOpen
                    ? "left-0 w-full sm:w-80 lg:w-96"
                    : "-left-full w-0 lg:left-0 lg:w-12"
                } ${!isSidebarOpen ? "overflow-hidden" : ""} h-full`}
              >
                {/* Sidebar Content */}
                <div
                  className={`flex h-full flex-col ${isSidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                >
                  <div className="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 sm:p-4">
                    <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                      What would you like to learn?
                    </h3>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Review this code for bugs, Explain how this works..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:px-4 sm:text-base"
                    />
                  </div>

                  <div className="min-h-0 flex-1 p-3 sm:p-4">
                    <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                      Your Code
                    </h3>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={`Paste your ${language} code here...`}
                      className="h-full w-full resize-none rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:p-4 sm:text-sm"
                    />
                  </div>

                  <div className="border-t border-slate-200 p-3 dark:border-slate-700 sm:p-4">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                      <button
                        onClick={handleCodeReview}
                        disabled={(!code.trim() && !prompt.trim()) || isLoading}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-900 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                      >
                        {isLoading ? "Analyzing..." : "Analyze Code"}
                      </button>
                      <button
                        onClick={clearChat}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:text-base"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar Toggle Button - Desktop */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`z-100 absolute -right-3 top-1/2 hidden h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-lg border border-slate-200 bg-white text-slate-600 shadow-lg transition-all duration-200 hover:text-blue-600 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400 lg:flex ${!isSidebarOpen ? "right-0" : "right-0"} `}
                >
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isSidebarOpen ? "" : "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Overlay for mobile */}
              {isSidebarOpen && (
                <button
                  className="absolute inset-0 z-0 bg-black bg-opacity-50 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Chat Section */}
              <div
                className={`flex min-w-0 flex-1 flex-col ${isSidebarOpen && window.innerWidth < 1024 ? "pointer-events-none" : ""} `}
              >
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
                      <div>
                        <div className="mx-auto mb-4 w-fit rounded-full bg-slate-100 p-3 dark:bg-slate-800 sm:p-4">
                          <svg
                            className="h-6 w-6 text-slate-400 sm:h-8 sm:w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <p className="text-base font-semibold sm:text-lg">
                          Ready to Learn!
                        </p>
                        <p className="mt-2 text-sm">
                          {!isSidebarOpen && window.innerWidth < 1024
                            ? "Open the sidebar to add your code"
                            : "Paste your code and ask me anything about it."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {messages.map((message, index) => (
                        <ChatMessage
                          key={index}
                          sender={message.sender}
                          text={message.text}
                        />
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 sm:p-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                                  style={{ animationDelay: "0.1s" }}
                                />
                                <div
                                  className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                                  style={{ animationDelay: "0.2s" }}
                                />
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                                AI is thinking...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CodeReviewSection
