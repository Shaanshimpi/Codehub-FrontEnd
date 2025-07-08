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

  const handleCodeReview = async () => {
    if (!code.trim() && !prompt.trim()) return

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

  // const renderMessage = (message: Message, index: number): React.ReactElement => {
  //   const isUser = message.sender === "user"
  //   return (
  //     <div
  //       key={`message-${index}-${Date.now()}`}
  //       className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
  //     >
  //       <div
  //         className={`max-w-[80%] rounded-lg p-4 ${
  //           isUser
  //             ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
  //             : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
  //         }`}
  //       >
  //         <div className="prose prose-sm max-w-none dark:prose-invert">
  //           {message.text.split("\n").map((line, index) => {
  //             if (line.startsWith("```")) {
  //               return null // Handle code blocks separately
  //             }
  //             if (line.startsWith("**") && line.endsWith("**")) {
  //               return (
  //                 <div key={index} className="mb-2 font-semibold">
  //                   {line.slice(2, -2)}
  //                 </div>
  //               )
  //             }
  //             if (line.startsWith("# ")) {
  //               return (
  //                 <h3 key={index} className="mb-2 text-lg font-bold">
  //                   {line.slice(2)}
  //                 </h3>
  //               )
  //             }
  //             return (
  //               <p key={index} className="mb-2">
  //                 {line}
  //               </p>
  //             )
  //           })}
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-white/20 p-2">
                  <svg
                    className="h-5 w-5 text-white"
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
                <h2 className="text-xl font-bold text-white">
                  <span className="text-blue-700">VIVY</span> AI Code Review &
                  Learning
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex h-[calc(100%-4rem)]">
              {/* Input Section */}
              <div className="flex w-1/2 flex-col border-r border-slate-200 dark:border-slate-700">
                <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                    What would you like to learn?
                  </h3>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Review this code for bugs, Explain how this works, Optimize this function..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
                  />
                </div>

                <div className="flex-1 p-4">
                  <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                    Your Code
                  </h3>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`Paste your ${language} code here...`}
                    className="h-full w-full resize-none rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
                  />
                </div>

                <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCodeReview}
                      disabled={(!code.trim() && !prompt.trim()) || isLoading}
                      className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? "Analyzing..." : "Analyze Code"}
                    </button>
                    <button
                      onClick={clearChat}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="flex w-1/2 flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
                      <div>
                        <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                          <svg
                            className="h-8 w-8 text-slate-400"
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
                        <p className="text-lg font-semibold">Ready to Learn!</p>
                        <p className="mt-2 text-sm">
                          Paste your code and ask me anything about it.
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
                          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
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
                              <span className="text-sm text-slate-500 dark:text-slate-400">
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
