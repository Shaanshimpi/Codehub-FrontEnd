"use client"

import React, { useState } from "react"
import { Filter, Target, Trophy, Zap } from "lucide-react"

interface DifficultyFilterProps {
  onFilterChange: (difficulty: number | null) => void
}

const difficultyOptions = [
  {
    value: null,
    label: "All Levels",
    icon: Filter,
    color: "text-slate-600 dark:text-slate-400",
  },
  {
    value: 1,
    label: "Beginner",
    icon: Target,
    color: "text-green-600 dark:text-green-400",
  },
  {
    value: 2,
    label: "Intermediate",
    icon: Zap,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    value: 3,
    label: "Advanced",
    icon: Trophy,
    color: "text-red-600 dark:text-red-400",
  },
]

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  onFilterChange,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  )

  const handleFilterChange = (difficulty: number | null) => {
    setSelectedDifficulty(difficulty)
    onFilterChange(difficulty)
  }

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        Filter by Difficulty
      </h3>
      <div className="flex flex-wrap gap-2">
        {difficultyOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedDifficulty === option.value

          return (
            <button
              key={option.value || "all"}
              onClick={() => handleFilterChange(option.value)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isSelected ? "text-white" : option.color}`}
              />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DifficultyFilter
