// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MemoryStatesPanel.tsx
"use client"

import React, { useState } from "react"
import {
  Database,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/MemoryStatesPanel.tsx

interface MemoryStatesPanelProps {
  memoryStates: any[]
  title?: string
}

const MemoryStatesPanel: React.FC<MemoryStatesPanelProps> = ({
  memoryStates,
  title = "Memory States",
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!memoryStates || memoryStates.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
        <div>
          <Database className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No Memory States Available</p>
          <p className="mt-2 text-sm">
            Memory state tracking is not available for this exercise.
          </p>
        </div>
      </div>
    )
  }

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= memoryStates.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, memoryStates.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const currentState = memoryStates[currentStep]

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "int":
      case "integer":
        return "text-blue-600 dark:text-blue-400"
      case "string":
      case "char":
        return "text-green-600 dark:text-green-400"
      case "float":
      case "double":
        return "text-purple-600 dark:text-purple-400"
      case "bool":
      case "boolean":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  const getValueColor = (value: string) => {
    if (value === "Uninitialized" || value === "undefined") {
      return "text-red-600 dark:text-red-400"
    }
    if (value === "true" || value === "false") {
      return "text-orange-600 dark:text-orange-400"
    }
    if (!isNaN(Number(value))) {
      return "text-blue-600 dark:text-blue-400"
    }
    return "text-green-600 dark:text-green-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Watch how variables change during program execution
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Reset to beginning"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Previous step"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={handlePlay}
            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === memoryStates.length - 1}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Next step"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          Step {currentStep + 1} of {memoryStates.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>
            {Math.round(((currentStep + 1) / memoryStates.length) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / memoryStates.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current State Display */}
      <div className="space-y-4">
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-sky-50 p-4 dark:from-blue-900/20 dark:to-sky-900/20">
          <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
            {currentState.step}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Current execution state of the program
          </p>
        </div>

        {/* Variables Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="bg-slate-800 px-4 py-3">
            <h5 className="font-medium text-white">Variable States</h5>
          </div>

          <div className="bg-white dark:bg-slate-900">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                    Variable
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {currentState.variables?.map((variable: any, index: number) => (
                  <tr
                    key={variable.name || index}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                        {variable.name}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${getValueColor(variable.value)}`}
                      >
                        {variable.value}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm ${getTypeColor(variable.type)}`}
                      >
                        {variable.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          variable.value === "Uninitialized"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        }`}
                      >
                        {variable.value === "Uninitialized"
                          ? "Uninitialized"
                          : "Set"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Memory Layout Visualization */}
        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <h5 className="mb-3 font-semibold text-purple-800 dark:text-purple-200">
            Memory Layout
          </h5>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {currentState.variables?.map((variable: any, index: number) => (
              <div
                key={variable.name || index}
                className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {variable.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {variable.type}: {variable.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MemoryStatesPanel
