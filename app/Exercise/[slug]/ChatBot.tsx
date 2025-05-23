"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { createHighlighter } from "shiki"

const ChatBot = ({ question, code }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [highlighter, setHighlighter] = useState(null)
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "# Welcome! 👋\n\nI'm here to help you with your programming questions.",
    },
    {
      sender: "bot",
      text: `# Question\n\n${question}\n\n## Code\n\n\`\`\`c\n${code}\n\`\`\``,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    createHighlighter({ theme: "github-dark" }).then(setHighlighter)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            // "HTTP-Referer": "https://codehub-front-end.vercel.app/",
            // "X-Title": "CodeHub",
            "Content-Type": "application/json",
            Authorization: `bearer ${process.env.NEXT_PUBLIC_AI_CHATBOT_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-maverick:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a programming assistant. Format responses with Markdown. explain just the topic at hand line by line. no need to explain each line, but the topic the question is focusing on. also if user asks to answer in other lang just use the other language just enough to understand to non-english speakers still try to use important words in english. explain the answer to a 12 year old.",
              },
              ...messages.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
              })),
              { role: "user", content: input },
            ],
          }),
        }
      )

      const data = (await response.json()) || []
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data?.choices[0]?.message.content },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response. Please try again." },
      ])
    }
    setIsLoading(false)
  }

  const MessageComponent = ({ message }) => {
    return (
      <div
        className={`break-words rounded-lg p-4 ${
          message.sender === "user"
            ? "self-end bg-blue-100"
            : "self-start bg-gray-100"
        }`}
        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
      >
        <ReactMarkdown
          components={{
            pre: ({ children }) => (
              <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-gray-900 p-2 text-white">
                {children}
              </pre>
            ),
            code: ({ children }) => (
              <code className="text-red-400">{children}</code>
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 z-[200] flex h-[80vh] w-[90vw] flex-col rounded-lg border bg-white p-2 text-black shadow-lg dark:bg-gray-800 md:max-w-[600px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Ask CodeHub JARVIS
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="z-100 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="z-[200] flex h-[60vh] max-h-[60vh] flex-col gap-4 overflow-y-auto overflow-x-hidden p-1"
            onWheel={(e) => e.stopPropagation()} // Ensure events aren't blocked
            style={{ overflowY: "scroll", scrollBehavior: "smooth" }} // Force smooth scrolling
          >
            {messages.map((msg, index) => (
              <MessageComponent key={index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask your question..."
            className="mt-3 w-full rounded border p-2"
          />
          <button
            onClick={handleSendMessage}
            className="mt-2 w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatBot
