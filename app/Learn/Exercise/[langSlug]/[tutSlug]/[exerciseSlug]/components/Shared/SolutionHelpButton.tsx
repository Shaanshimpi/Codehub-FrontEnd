// Simple help button for solution view
"use client"

import React from "react"
import { HelpCircle } from "lucide-react"

// Simple help button for solution view

interface SolutionHelpButtonProps {
  onHelp: () => void
  isOpen?: boolean
  label?: string
}

const SolutionHelpButton: React.FC<SolutionHelpButtonProps> = ({
  onHelp,
  isOpen = false,
  label = "Help",
}) => {
  return (
    <button
      onClick={onHelp}
      className={`focus-ring group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-md transition-all duration-300 hover:scale-[1.02] ${
        isOpen
          ? "bg-blue-600 text-white shadow-blue-500/25"
          : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
      }`}
      title={`${label} - Get help with explanations and clean solution`}
      aria-label={`${label} - Get help with explanations and clean solution`}
    >
      <HelpCircle
        className={`h-4 w-4 transition-transform duration-300 ${
          isOpen ? "rotate-180" : "group-hover:scale-110"
        }`}
      />
      <span className="hidden font-medium sm:inline">{label}</span>
    </button>
  )
}

export default SolutionHelpButton
