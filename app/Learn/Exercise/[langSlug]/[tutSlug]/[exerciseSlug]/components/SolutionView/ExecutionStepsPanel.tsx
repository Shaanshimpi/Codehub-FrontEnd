// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExecutionStepsPanel.tsx
"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Code,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Terminal,
} from "lucide-react"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExecutionStepsPanel.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/SolutionView/ExecutionStepsPanel.tsx

interface ExecutionStepsPanelProps {
  executionSteps: any[]
  title?: string
}

const ExecutionStepsPanel: React.FC<ExecutionStepsPanelProps> = ({
  executionSteps,
  title = "Execution Steps",
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(2000) // milliseconds

  // Create a consistent memory state structure across all steps
  const allVariables = useMemo(() => {
    if (!executionSteps || !Array.isArray(executionSteps)) return []

    const variableSet = new Set<string>()
    executionSteps.forEach((step) => {
      if (step.memory_state && Array.isArray(step.memory_state)) {
        step.memory_state.forEach((variable: any) => {
          variableSet.add(variable.name)
        })
      }
    })
    return Array.from(variableSet).sort()
  }, [executionSteps])

  // Get the current memory state with all variables, filling missing ones
  const getCurrentMemoryState = useMemo(() => {
    if (
      !executionSteps ||
      !Array.isArray(executionSteps) ||
      !executionSteps[currentStep]
    )
      return []

    const currentExecution = executionSteps[currentStep]
    if (!currentExecution?.memory_state) return []

    const currentVariables = new Map()
    currentExecution.memory_state.forEach((variable: any) => {
      currentVariables.set(variable.name, variable)
    })

    return allVariables.map((varName) => {
      if (currentVariables.has(varName)) {
        return currentVariables.get(varName)
      } else {
        return {
          name: varName,
          value: "undefined",
          type: "undefined",
          changed: false,
        }
      }
    })
  }, [currentStep, executionSteps, allVariables])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStep < executionSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= executionSteps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, playSpeed)
    } else if (currentStep >= executionSteps.length - 1) {
      setIsPlaying(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentStep, executionSteps.length, playSpeed])

  if (!executionSteps || executionSteps.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
        <div>
          <Play className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No Execution Steps Available</p>
          <p className="mt-2 text-sm">
            Step-by-step execution tracking is not available for this exercise.
          </p>
        </div>
      </div>
    )
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, executionSteps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setIsPlaying(false)
  }

  const currentExecution = executionSteps && executionSteps[currentStep]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Follow the program execution with line-by-line memory state tracking
        </p>
      </div>

      {/* Current Step Highlight */}
      {currentExecution && (
        <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              {currentExecution.step}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Executing Line:
                </span>
                {currentExecution.line_number && (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    (Line {currentExecution.line_number})
                  </span>
                )}
              </div>
              <code className="block rounded bg-slate-800 px-3 py-2 text-sm text-slate-200">
                {currentExecution.line}
              </code>
              <p className="mt-3 text-sm text-green-700 dark:text-green-300">
                {currentExecution.description}
              </p>

              {/* Memory State Display - Fixed Structure */}
              {allVariables.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">💾</span>
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Memory State:
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-green-200 dark:border-green-700">
                    <table className="w-full text-sm">
                      <thead className="bg-green-100 dark:bg-green-800/30">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-green-800 dark:text-green-200">
                            Variable
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-green-800 dark:text-green-200">
                            Value
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-green-800 dark:text-green-200">
                            Type
                          </th>
                          <th className="px-3 py-2 text-center font-medium text-green-800 dark:text-green-200">
                            Changed
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800">
                        {getCurrentMemoryState.map(
                          (variable: any, vIndex: number) => (
                            <tr
                              key={variable.name}
                              className={`transition-colors duration-300 ${
                                variable.changed
                                  ? "bg-amber-50 dark:bg-amber-900/20"
                                  : variable.value === "undefined"
                                    ? "bg-slate-100 opacity-60 dark:bg-slate-800/50"
                                    : vIndex % 2 === 0
                                      ? "bg-slate-50 dark:bg-slate-700/50"
                                      : "bg-white dark:bg-slate-800"
                              }`}
                            >
                              <td
                                className={`px-3 py-2 font-mono transition-colors duration-300 ${
                                  variable.changed
                                    ? "font-bold text-amber-800 dark:text-amber-200"
                                    : variable.value === "undefined"
                                      ? "text-slate-400 dark:text-slate-500"
                                      : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {variable.name}
                              </td>
                              <td
                                className={`px-3 py-2 font-mono transition-colors duration-300 ${
                                  variable.changed
                                    ? "font-bold text-amber-800 dark:text-amber-200"
                                    : variable.value === "undefined"
                                      ? "italic text-slate-400 dark:text-slate-500"
                                      : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {variable.value}
                              </td>
                              <td
                                className={`px-3 py-2 transition-colors duration-300 ${
                                  variable.value === "undefined"
                                    ? "italic text-slate-400 dark:text-slate-500"
                                    : "text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {variable.type}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {variable.changed ? (
                                  <span className="animate-pulse font-bold text-amber-600 dark:text-amber-400">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentExecution.output && (
                <div className="mt-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Output:
                    </span>
                  </div>
                  <div className="rounded bg-slate-900 px-3 py-2">
                    <pre className="text-sm text-green-400">
                      {currentExecution.output}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
        <div className="flex items-center justify-between">
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
              disabled={currentStep >= executionSteps.length - 1}
              className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
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
              disabled={currentStep === executionSteps.length - 1}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              title="Next step"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Speed:
            </span>
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              <option value={1000}>Fast</option>
              <option value={2000}>Normal</option>
              <option value={3000}>Slow</option>
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              Step {currentStep + 1} of {executionSteps.length}
            </span>
            <span>
              {Math.round(((currentStep + 1) / executionSteps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-600 to-green-800 transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / executionSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900 dark:text-white">
          Execution Timeline with Memory States
        </h4>
        <div className="space-y-2">
          {executionSteps.map((step: any, index: number) => (
            <button
              key={step.step || index}
              onClick={() => handleStepClick(index)}
              className={`w-full rounded-lg border p-3 text-left transition-all ${
                index === currentStep
                  ? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20"
                  : index < currentStep
                    ? "border-slate-300 bg-slate-50 opacity-75 dark:border-slate-600 dark:bg-slate-800/50"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === currentStep
                      ? "bg-green-600 text-white"
                      : index < currentStep
                        ? "bg-slate-400 text-white"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {step.step}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <code
                      className={`font-mono text-sm ${
                        index === currentStep
                          ? "text-green-800 dark:text-green-200"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {step.line}
                    </code>
                    {step.line_number && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        (L{step.line_number})
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      index === currentStep
                        ? "text-green-700 dark:text-green-300"
                        : "text-slate-500 dark:text-slate-500"
                    }`}
                  >
                    {step.description}
                  </p>
                  {step.output && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Output:
                      </span>
                      <span className="ml-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {step.output}
                      </span>
                    </div>
                  )}
                  {/* Mini Memory State Indicator */}
                  {step.memory_state && step.memory_state.length > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs">💾</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {step.memory_state.filter((v: any) => v.changed)
                          .length > 0 ? (
                          <>
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                              {
                                step.memory_state.filter((v: any) => v.changed)
                                  .length
                              }{" "}
                              changed
                            </span>
                            {step.memory_state.filter((v: any) => !v.changed)
                              .length > 0 && (
                              <span>
                                ,{" "}
                                {
                                  step.memory_state.filter(
                                    (v: any) => !v.changed
                                  ).length
                                }{" "}
                                unchanged
                              </span>
                            )}
                          </>
                        ) : (
                          `${step.memory_state.length} variables`
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExecutionStepsPanel
