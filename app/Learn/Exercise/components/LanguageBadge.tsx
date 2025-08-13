"use client"

import React from "react"

interface LanguageBadgeProps {
  language: string
  variant?: "default" | "compact"
}

const LanguageBadge = ({
  language,
  variant = "default",
}: LanguageBadgeProps) => {
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-100 text-yellow-800 border-yellow-200",
      python: "bg-blue-100 text-blue-800 border-blue-200",
      java: "bg-orange-100 text-orange-800 border-orange-200",
      cpp: "bg-purple-100 text-purple-800 border-purple-200",
      c: "bg-gray-100 text-gray-800 border-gray-200",
      csharp: "bg-green-100 text-green-800 border-green-200",
      go: "bg-cyan-100 text-cyan-800 border-cyan-200",
      rust: "bg-red-100 text-red-800 border-red-200",
      php: "bg-indigo-100 text-indigo-800 border-indigo-200",
      ruby: "bg-rose-100 text-rose-800 border-rose-200",
      swift: "bg-amber-100 text-amber-800 border-amber-200",
      kotlin: "bg-violet-100 text-violet-800 border-violet-200",
      typescript: "bg-blue-100 text-blue-800 border-blue-200",
    }

    const normalizedLang = language.toLowerCase().replace(/[^a-z]/g, "")
    return colors[normalizedLang] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const isCompact = variant === "compact"

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${isCompact ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} ${getLanguageColor(language)} `}
    >
      {language}
    </span>
  )
}

export default LanguageBadge
