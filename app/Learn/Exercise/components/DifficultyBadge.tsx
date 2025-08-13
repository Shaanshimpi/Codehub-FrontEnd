"use client"

import React from "react"

interface DifficultyBadgeProps {
  difficulty: number
  variant?: "default" | "compact"
}

const DifficultyBadge = ({
  difficulty,
  variant = "default",
}: DifficultyBadgeProps) => {
  const getDifficultyInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: "Beginner",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "🟢",
        }
      case 2:
        return {
          label: "Intermediate",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "🟡",
        }
      case 3:
        return {
          label: "Advanced",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: "🔴",
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "⚫",
        }
    }
  }

  const diffInfo = getDifficultyInfo(difficulty)
  const isCompact = variant === "compact"

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${isCompact ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"} ${diffInfo.color} `}
    >
      {!isCompact && <span className="mr-1">{diffInfo.icon}</span>}
      {diffInfo.label}
    </span>
  )
}

export default DifficultyBadge
