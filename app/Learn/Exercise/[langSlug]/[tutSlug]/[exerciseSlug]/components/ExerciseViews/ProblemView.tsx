// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx
"use client"

import React, { useState } from "react"
import CodeEditor from "../ProblemView/CodeEditor"
import QuestionPanel from "../ProblemView/QuestionPanel"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx

interface ProblemViewProps {
  exercise: any
  language: any
  onProgressUpdate: (progress: number) => void
  onComplete: () => void
}

const ProblemView: React.FC<ProblemViewProps> = ({
  exercise,
  language,
  onProgressUpdate,
  onComplete,
}) => {
  const [userCode, setUserCode] = useState("")
  const [isBoilerplateLoaded, setIsBoilerplateLoaded] = useState(false)

  const handleLoadBoilerplate = () => {
    setUserCode(exercise.boilerplate_code || "")
    setIsBoilerplateLoaded(true)
    onProgressUpdate(25) // 25% progress when boilerplate is loaded
  }

  const handleCodeChange = (code: string) => {
    setUserCode(code)
    // Update progress based on code completion
    if (code.length > (exercise.boilerplate_code?.length || 0)) {
      onProgressUpdate(Math.min(45, 25 + code.length / 100)) // Max 45% in problem view
    }
  }

  const handleRunCode = async () => {
    // Handle code execution
    console.log("Running code:", userCode)
    onProgressUpdate(50) // 50% when code is run
  }

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden">
      {/* Left Panel - Question, Objectives, Tags, Hints */}
      <div className="w-1/2 border-r border-slate-200 bg-sky-50 dark:border-slate-700 dark:bg-slate-800">
        <QuestionPanel exercise={exercise} language={language} />
      </div>

      {/* Right Panel - Code Workspace */}
      <div className="w-1/2 bg-white dark:bg-slate-900">
        <CodeEditor
          exercise={exercise}
          language={language}
          userCode={userCode}
          onCodeChange={handleCodeChange}
          onLoadBoilerplate={handleLoadBoilerplate}
          onRunCode={handleRunCode}
          isBoilerplateLoaded={isBoilerplateLoaded}
        />
      </div>
    </div>
  )
}

export default ProblemView
