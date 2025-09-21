import { Bot, User } from "lucide-react"
import { Message } from "../types"
import { formatTimeString } from "../utils/chat"
import { MarkdownRenderer } from "./MarkdownRenderer"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl ${isUser ? "order-1" : ""}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white dark:from-blue-500 dark:to-blue-600"
              : "border border-gray-200/50 bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm dark:border-slate-600/50 dark:bg-slate-800/90 dark:text-slate-100"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words leading-relaxed text-white">
              {message.content}
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        <div
          className={`mt-2 text-xs text-gray-500 dark:text-slate-400 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {formatTimeString(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <div className="order-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  )
}
