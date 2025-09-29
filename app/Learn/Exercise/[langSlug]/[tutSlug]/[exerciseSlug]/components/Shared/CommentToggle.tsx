"use client"

import React from "react"
import { Code, Info, MessageSquare } from "lucide-react"

interface CommentToggleProps {
  showComments: boolean
  onToggle: (show: boolean) => void
  hasComments?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "switch" | "buttons"
  className?: string
}

const CommentToggle: React.FC<CommentToggleProps> = ({
  showComments,
  onToggle,
  hasComments = true,
  disabled = false,
  size = "md",
  variant = "switch",
  className = "",
}) => {
  if (!hasComments) return null

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  if (variant === "buttons") {
    return (
      <div
        className={`flex rounded-lg border border-slate-600 bg-slate-700 p-1 ${className}`}
      >
        <button
          onClick={() => onToggle(true)}
          disabled={disabled}
          className={`flex items-center gap-2 rounded-md transition-all ${sizeClasses[size]} ${
            showComments
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-600 hover:text-white"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          title="Show code with comments and explanations"
        >
          <MessageSquare className={iconSizes[size]} />
          <span>With Comments</span>
        </button>

        <button
          onClick={() => onToggle(false)}
          disabled={disabled}
          className={`flex items-center gap-2 rounded-md transition-all ${sizeClasses[size]} ${
            !showComments
              ? "bg-green-600 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-600 hover:text-white"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          title="Show clean code without comments"
        >
          <Code className={iconSizes[size]} />
          <span>Clean Code</span>
        </button>
      </div>
    )
  }

  // Switch variant (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-slate-300">
        <Info className={iconSizes[size]} />
        <span
          className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}
        >
          Comments
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => onToggle(!showComments)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            showComments ? "bg-blue-600" : "bg-slate-600"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          title={showComments ? "Hide comments" : "Show comments"}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showComments ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-1 text-slate-400">
        {showComments ? (
          <>
            <MessageSquare className={iconSizes[size]} />
            <span
              className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}
            >
              With explanations
            </span>
          </>
        ) : (
          <>
            <Code className={iconSizes[size]} />
            <span
              className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}
            >
              Clean code
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default CommentToggle
