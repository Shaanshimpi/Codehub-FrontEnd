"use client"

import React from "react"
import { Button, Icon } from "../ui"

interface PlaygroundButtonProps {
  onClick: () => void
  lessonTitle?: string // Reserved for future use (e.g., tooltip)
}

/**
 * Playground Button Component
 * Button that opens the code playground for practicing code during lessons
 */
const PlaygroundButton: React.FC<PlaygroundButtonProps> = ({
  onClick,
  lessonTitle: _lessonTitle, // Reserved for future use
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-1 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/50 dark:border-blue-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 dark:hover:shadow-blue-400/30">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-col items-center gap-6 rounded-xl bg-white/95 p-8 backdrop-blur-sm dark:bg-gray-900/95 sm:flex-row sm:justify-between sm:gap-8">
        {/* Left Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="mb-3 flex items-center justify-center gap-3 sm:justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 dark:from-blue-600 dark:to-indigo-700">
              <Icon name="code" className="h-6 w-6 text-white" size="lg" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Code Playground
              </h3>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Interactive Learning Environment
              </p>
            </div>
          </div>
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Practice coding with a live editor. Write, run, and experiment with
            code in real-time. Perfect your skills with instant feedback.
          </p>

          {/* Feature badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              ✨ Live Execution
            </span>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              🚀 AI Assistance
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              💡 Real-time Feedback
            </span>
          </div>
        </div>

        {/* Right Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={onClick}
            variant="primary"
            size="xl"
            icon={<Icon name="code" size="md" />}
            className="min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700"
          >
            ▶ Open Playground
          </Button>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-left">
            Start coding now
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundButton
