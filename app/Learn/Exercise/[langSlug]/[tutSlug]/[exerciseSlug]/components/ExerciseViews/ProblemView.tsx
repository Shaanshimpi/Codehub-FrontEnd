// app/Learn/Exercise/[langSlug]/[tutSlug]/[exerciseSlug]/components/ExerciseViews/ProblemView.tsx
"use client"

import React, { useCallback, useEffect, useState } from "react"
import UnifiedMobileTabSwitcher from "@/app/Learn/Exercise/components/Mobile/UnifiedMobileTabSwitcher"
import { BookOpen, Code } from "lucide-react"
import QuestionPanel from "../ProblemView/QuestionPanel"
import StudentPlayground from "../Shared/StudentPlayground"

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
  }, [onProgressUpdate])

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

  // Streamlined code state - Direct playground integration
  const [playgroundCode, setPlaygroundCode] = useState<string>(
    persistentState.userCode || ""
  )

  // Update playground code when persistent state changes
  useEffect(() => {
    setPlaygroundCode(persistentState.userCode || "")
  }, [persistentState.userCode])

  // Handle code changes - Direct integration
  const handlePlaygroundCodeChange = useCallback(
    (code: string) => {
      setPlaygroundCode(code)
      handleCodeChange(code)
    },
    [handleCodeChange]
  )

  // Mobile tabs configuration for UnifiedMobileTabSwitcher
  const mobileTabs = [
    {
      id: "question",
      label: "Problem",
      icon: <BookOpen className="h-4 w-4" />,
      description: "View problem statement and requirements",
    },
    {
      id: "code",
      label: "Code Editor",
      icon: <Code className="h-4 w-4" />,
      description: "Write and test your solution",
    },
  ]

  return (
    <>
      {/* Enhanced Mobile Tab Switcher - Hidden on desktop */}
      <div className="lg:hidden">
        <UnifiedMobileTabSwitcher
          tabs={mobileTabs}
          activeTab={mobileActiveTab}
          onTabChange={(tabId) =>
            setMobileActiveTab(tabId as "question" | "code")
          }
          className="bg-white dark:bg-neutral-900"
        />
      </div>

      {/* Responsive Layout */}
      <div
        className={`lg:flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-8rem)]"}`}
      >
        {/* Question Panel */}
        <div
          className={`lg:border-r lg:border-slate-200 lg:bg-sky-50 lg:dark:border-slate-700 lg:dark:bg-slate-800 ${mobileActiveTab === "question" ? `block ${isFullscreen ? "h-screen" : "h-[calc(100vh-8rem)]"} overflow-y-auto` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2 lg:overflow-y-auto" : "lg:flex-none"}`}
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

        {/* Streamlined Code Editor Panel - Direct Integration */}
        <div
          className={`border-l border-gray-300 bg-white dark:border-gray-600 dark:bg-black ${mobileActiveTab === "code" ? `block h-full` : "hidden lg:block"} ${!isFullscreen ? "lg:h-full lg:w-1/2" : "lg:flex-1"}`}
          style={
            isFullscreen ? { width: `calc(${100 - panelWidth}% - 4px)` } : {}
          }
        >
          {/* New Simplified Student Playground */}
          <StudentPlayground
            key="new-student-playground"
            exercise={exercise}
            language={language}
            code={playgroundCode}
            onCodeChange={handlePlaygroundCodeChange}
            onRunCode={handleRunCode}
            mode="problem"
          />
        </div>
      </div>
    </>
  )
}

export default ProblemView
