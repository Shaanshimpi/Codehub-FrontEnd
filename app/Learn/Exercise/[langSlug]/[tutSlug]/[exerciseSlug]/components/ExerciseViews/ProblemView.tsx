// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx
"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  removeComments,
} from "@/app/utils/codeCommentUtils"
import { BookOpen, Code, Code2, Play, Zap } from "lucide-react"
import QuestionPanel from "../ProblemView/QuestionPanel"
import EnhancedTabContainer, { TabConfig } from "../Shared/EnhancedTabContainer"
import UnifiedCodeEditor from "../Shared/UnifiedCodeEditor"

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx

// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx

interface PersistentCodeState {
  userCode: string
  isBoilerplateLoaded: boolean
}

interface ProblemViewProps {
  exercise: any
  language: any
  onProgressUpdate: (progress: number) => void
  onComplete: () => void
  persistentState: PersistentCodeState
  onStateUpdate: (state: Partial<PersistentCodeState>) => void
  isFullscreen?: boolean
  panelWidth?: number
  onPanelResize?: (e: React.MouseEvent) => void
}

const ProblemView: React.FC<ProblemViewProps> = ({
  exercise,
  language,
  onProgressUpdate,
  onComplete,
  persistentState,
  onStateUpdate,
  isFullscreen = false,
  panelWidth = 50,
  onPanelResize,
}) => {
  const [mobileActiveTab, setMobileActiveTab] = useState<"question" | "code">(
    "question"
  )

  // Generate boilerplate code based on language
  const getBoilerplateCode = useCallback(() => {
    // If exercise has specific boilerplate, use it
    if (exercise.boilerplate_code) {
      return exercise.boilerplate_code
    }

    // Otherwise generate based on language
    switch (language.slug) {
      case "c-programming":
      case "c":
        return `#include <stdio.h>

int main() {
    // TODO: Write your solution here
    
    return 0;
}`
      case "cpp":
      case "c++":
        return `#include <iostream>
using namespace std;

int main() {
    // TODO: Write your solution here
    
    return 0;
}`
      case "java":
        return `public class Solution {
    public static void main(String[] args) {
        // TODO: Write your solution here
        
    }
}`
      case "python":
        return `# TODO: Write your solution here

def main():
    pass

if __name__ == "__main__":
    main()`
      case "javascript":
        return `// TODO: Write your solution here

function main() {
    
}

main();`
      case "typescript":
        return `// TODO: Write your solution here

function main(): void {
    
}

main();`
      default:
        return `// TODO: Write your solution here`
    }
  }, [exercise.boilerplate_code, language.slug])

  // Handle loading boilerplate code
  const handleLoadBoilerplate = useCallback(() => {
    const boilerplate = getBoilerplateCode()
    onStateUpdate({
      userCode: boilerplate,
      isBoilerplateLoaded: true,
    })
    onProgressUpdate(25) // 25% progress when boilerplate is loaded
  }, [getBoilerplateCode, onStateUpdate, onProgressUpdate])

  // Handle code changes
  const handleCodeChange = useCallback(
    (code: string) => {
      onStateUpdate({ userCode: code })

      // Update progress based on code completion
      const baseLength = getBoilerplateCode().length
      if (code.length > baseLength) {
        const progressIncrement = Math.min(20, (code.length - baseLength) / 50)
        onProgressUpdate(Math.min(45, 25 + progressIncrement)) // Max 45% in problem view
      } else if (code.length === 0) {
        // Reset progress if code is completely cleared
        onProgressUpdate(0)
      }
    },
    [getBoilerplateCode, onStateUpdate, onProgressUpdate]
  )

  // Handle code execution
  const handleRunCode = useCallback(() => {
    onProgressUpdate(50) // 50% when code is run

    // Here you would implement actual code execution logic
    // For now, just simulate it
  }, [persistentState.userCode, onProgressUpdate])

  // Handle boilerplate status changes (from reset)
  const handleBoilerplateStatusChange = useCallback(
    (loaded: boolean) => {
      onStateUpdate({ isBoilerplateLoaded: loaded })
      if (!loaded) {
        // Reset progress when boilerplate is reset
        onProgressUpdate(0)
      }
    },
    [onStateUpdate, onProgressUpdate]
  )

  // Separate code states for different tabs
  const [playgroundCode, setPlaygroundCode] = useState<string>(
    persistentState.userCode || ""
  )
  const [currentActiveTab, setCurrentActiveTab] = useState<string>("playground")

  // Update playground code when persistent state changes (from external sources)
  useEffect(() => {
    if (currentActiveTab === "playground") {
      setPlaygroundCode(persistentState.userCode || "")
    }
  }, [persistentState.userCode, currentActiveTab])

  // Handle playground code changes
  const handlePlaygroundCodeChange = useCallback(
    (code: string) => {
      setPlaygroundCode(code)
      handleCodeChange(code)
    },
    [handleCodeChange]
  )

  // Enhanced tabs configuration for code section - all using Monaco editor
  const codeTabsConfig: TabConfig[] = useMemo(() => {
    const boilerplateCode = getBoilerplateCode()
    const cleanBoilerplateCode = removeComments(boilerplateCode, language.slug)

    return [
      {
        id: "playground",
        label: "Playground",
        icon: <Play className="h-4 w-4" />,
        content: (
          <UnifiedCodeEditor
            key="playground-editor" // Unique key to maintain component state
            exercise={exercise}
            language={language}
            code={playgroundCode} // Use separate playground code state
            onCodeChange={handlePlaygroundCodeChange}
            onLoadBoilerplate={handleLoadBoilerplate}
            onRunCode={handleRunCode}
            isBoilerplateLoaded={persistentState.isBoilerplateLoaded}
            onBoilerplateStatusChange={handleBoilerplateStatusChange}
            mode="problem"
          />
        ),
      },
      {
        id: "boilerplate",
        label: "Boilerplate",
        icon: <Code2 className="h-4 w-4" />,
        content: (
          <UnifiedCodeEditor
            key="boilerplate-editor" // Unique key
            exercise={exercise}
            language={language}
            code={boilerplateCode}
            onCodeChange={() => {}} // Read-only
            mode="problem"
            isReadOnly={true}
          />
        ),
      },
      {
        id: "clean",
        label: "Clean Code",
        icon: <Zap className="h-4 w-4" />,
        content: (
          <UnifiedCodeEditor
            key="clean-editor" // Unique key
            exercise={exercise}
            language={language}
            code={cleanBoilerplateCode}
            onCodeChange={() => {}} // Read-only
            mode="problem"
            isReadOnly={true}
          />
        ),
      },
    ]
  }, [
    exercise,
    language,
    playgroundCode,
    persistentState.isBoilerplateLoaded,
    getBoilerplateCode,
    handlePlaygroundCodeChange,
    handleLoadBoilerplate,
    handleRunCode,
    handleBoilerplateStatusChange,
  ])

  return (
    <>
      {/* Mobile Tab Switcher - Hidden on desktop */}
      <div className="bg-white dark:bg-slate-900 lg:hidden">
        <div className="flex">
          <button
            onClick={() => setMobileActiveTab("question")}
            className={`flex flex-1 items-center justify-center gap-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              mobileActiveTab === "question"
                ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <BookOpen className="h-3 w-3" />
            Question
          </button>
          <button
            onClick={() => setMobileActiveTab("code")}
            className={`flex flex-1 items-center justify-center gap-1 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              mobileActiveTab === "code"
                ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Code className="h-3 w-3" />
            Code
          </button>
        </div>
      </div>

      {/* Responsive Layout */}
      <div
        className={`lg:flex ${isFullscreen ? "h-screen" : "lg:h-[calc(100vh-10rem)]"}`}
      >
        {/* Question Panel */}
        <div
          className={`lg:border-r lg:border-slate-200 lg:bg-sky-50 lg:dark:border-slate-700 lg:dark:bg-slate-800 ${mobileActiveTab === "question" ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-6rem)]"} overflow-y-auto` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2 lg:overflow-y-auto" : "lg:flex-none"}`}
          style={isFullscreen ? { width: `${panelWidth}%` } : {}}
        >
          <QuestionPanel exercise={exercise} language={language} />
        </div>

        {/* Resize Handle - Only visible on desktop in fullscreen */}
        {isFullscreen && onPanelResize && (
          <button
            className="hidden w-1 flex-none cursor-col-resize bg-slate-300 transition-colors hover:bg-blue-500 lg:block"
            onMouseDown={onPanelResize}
            title="Drag to resize panels"
          />
        )}

        {/* Enhanced Code Editor Panel with Sub-tabs */}
        <div
          className={`lg:bg-white lg:dark:bg-slate-900 ${mobileActiveTab === "code" ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-6rem)]"}` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2 lg:overflow-y-auto" : "lg:flex-1"}`}
          style={
            isFullscreen ? { width: `calc(${100 - panelWidth}% - 4px)` } : {}
          }
        >
          <EnhancedTabContainer
            tabs={codeTabsConfig}
            variant="secondary"
            size="sm"
            className="h-full bg-white dark:bg-slate-900"
            contentClassName="h-[calc(100%-3rem)]"
            defaultTab="playground"
            onTabChange={(tabId) => setCurrentActiveTab(tabId)}
          />
        </div>
      </div>
    </>
  )
}

export default ProblemView
