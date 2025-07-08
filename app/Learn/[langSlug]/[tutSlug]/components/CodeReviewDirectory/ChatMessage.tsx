// components/ChatMessage.tsx
"use client"

import React from "react"
import "highlight.js/styles/github-dark.css"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"

// components/ChatMessage.tsx

interface ChatMessageProps {
  sender: "user" | "bot"
  text: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
  const isUser = sender === "user"

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-lg p-4 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
            : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        }`}
      >
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {text}
        </Markdown>
      </div>
    </div>
  )
}

export default ChatMessage
